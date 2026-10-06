import { prisma } from '../lib/prisma';
import { cacheGetJson, cacheSetJson } from './cacheService';
import { generateQuestion } from './deepseekService';
import { validateQuestion } from './openaiService';
import type { Subject, Difficulty, ExamType, StudentClass } from '../types/index';
import type { Question } from '@prisma/client';

const pendingGeneration = new Map<string, Promise<Question>>();

const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

function randomDifficulty(): Difficulty {
  return DIFFICULTIES[Math.floor(Math.random() * 3)] as Difficulty;
}

async function generateAndPersist(
  subject: Subject,
  topic: string,
  difficulty: Difficulty,
  examType: ExamType,
  studentClass: StudentClass,
  pool: Question[] | null,
): Promise<Question> {
  const cacheKey = `q:${subject}:${topic}:${difficulty}:${examType}:${studentClass}`;

  const generated = await generateQuestion(subject, topic, difficulty, examType, studentClass);
  const isValid = await validateQuestion(generated);

  let finalQuestion = generated;
  if (!isValid) {
    try {
      const retry = await generateQuestion(subject, topic, difficulty, examType, studentClass);
      const retryValid = await validateQuestion(retry);
      if (retryValid) finalQuestion = retry;
      // If still invalid, use the first generated question — a slightly imperfect
      // question is better than a 500 error for the student.
    } catch {
      // use original
    }
  }

  const question = await prisma.question.create({
    data: {
      topic,
      subject,
      questionText: finalQuestion.question,
      options: finalQuestion.options,
      answer: finalQuestion.correct_answer,
      explanation: finalQuestion.answer_explanation,
      difficulty,
      examType,
      validatedAt: new Date(),
    },
  });

  const updatedPool = [...(pool ?? []), question];
  await cacheSetJson(cacheKey, updatedPool, 3600 * 6);

  return question;
}

export async function getNextQuestion(
  userId: string,
  subject: Subject,
  topic: string,
  difficulty: Difficulty,
  examType: ExamType,
  studentClass: StudentClass,
): Promise<Question> {
  const cacheKey = `q:${subject}:${topic}:${difficulty}:${examType}:${studentClass}`;
  const servedKey = `served:${userId}:${subject}:${topic}`;
  const servedIds = (await cacheGetJson<string[]>(servedKey)) ?? [];

  const pool = await cacheGetJson<Question[]>(cacheKey);
  if (pool && pool.length > 0) {
    const unserved = pool.filter((q) => !servedIds.includes(q.id));
    if (unserved.length > 0) {
      const question = unserved[Math.floor(Math.random() * unserved.length)]!;
      await cacheSetJson(servedKey, [...servedIds, question.id], 86400);
      return question;
    }
  }

  const existing = await prisma.question.findFirst({
    where: {
      topic,
      subject,
      difficulty,
      examType,
      id: { notIn: servedIds },
      validatedAt: { not: null },
    },
  });
  if (existing) {
    await cacheSetJson(servedKey, [...servedIds, existing.id], 86400);
    return existing;
  }

  let genPromise = pendingGeneration.get(cacheKey);
  if (!genPromise) {
    genPromise = generateAndPersist(subject, topic, difficulty, examType, studentClass, pool).finally(
      () => pendingGeneration.delete(cacheKey),
    );
    pendingGeneration.set(cacheKey, genPromise);
  }

  const question = await genPromise;
  await cacheSetJson(servedKey, [...servedIds, question.id], 86400);
  return question;
}

export async function getQuestionBatch(
  userId: string,
  selections: Array<{ subject: Subject; topic: string }>,
  difficulty: Difficulty | 'mixed',
  examType: ExamType,
  studentClass: StudentClass,
  count: number,
): Promise<Question[]> {
  // Shuffle selections first so round-robin picks evenly across subjects
  const shuffled = [...selections].sort(() => Math.random() - 0.5);

  const plan: Array<{ subject: Subject; topic: string; diff: Difficulty }> = [];
  for (let i = 0; i < count; i++) {
    const sel = shuffled[i % shuffled.length]!;
    plan.push({
      subject: sel.subject,
      topic: sel.topic,
      diff: difficulty === 'mixed' ? randomDifficulty() : difficulty,
    });
  }

  const results: Question[] = [];
  const concurrency = Math.min(count, 8);

  for (let i = 0; i < plan.length; i += concurrency) {
    const chunk = plan.slice(i, i + concurrency);
    const settled = await Promise.allSettled(
      chunk.map(({ subject, topic, diff }) =>
        getNextQuestion(userId, subject, topic, diff, examType, studentClass),
      ),
    );
    for (const r of settled) {
      if (r.status === 'fulfilled') results.push(r.value);
    }
  }

  if (results.length === 0) {
    throw new Error('Could not generate any questions. Check your API keys and try again.');
  }

  return results;
}
