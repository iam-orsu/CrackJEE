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
      diagram: finalQuestion.diagram ?? undefined,
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
  batchExcludeIds: string[] = [],
): Promise<Question> {
  const cacheKey = `q:${subject}:${topic}:${difficulty}:${examType}:${studentClass}`;
  const servedKey = `served:${userId}:${subject}:${topic}`;
  const servedIds = (await cacheGetJson<string[]>(servedKey)) ?? [];
  const allExcluded = new Set([...servedIds, ...batchExcludeIds]);

  const pool = await cacheGetJson<Question[]>(cacheKey);
  if (pool && pool.length > 0) {
    const unserved = pool.filter((q) => !allExcluded.has(q.id));
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
      id: { notIn: [...allExcluded] },
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
  // Group selections by subject preserving insertion order (Physics topics, then Chemistry topics, etc.)
  const subjectGroups = new Map<Subject, string[]>();
  for (const { subject, topic } of selections) {
    if (!subjectGroups.has(subject)) subjectGroups.set(subject, []);
    subjectGroups.get(subject)!.push(topic);
  }

  const numSubjects = subjectGroups.size;
  // Use Math.floor so we never exceed the requested count; frontend sends count = perSubject * numSubjects
  const perSubject = numSubjects > 0 ? Math.floor(count / numSubjects) : count;

  // Build plan grouped by subject so all Physics come first, then Chemistry, etc.
  const plan: Array<{ subject: Subject; topic: string; diff: Difficulty }> = [];
  for (const [subject, topics] of subjectGroups) {
    const shuffledTopics = [...topics].sort(() => Math.random() - 0.5);
    for (let i = 0; i < perSubject; i++) {
      const topic = shuffledTopics[i % shuffledTopics.length]!;
      plan.push({
        subject,
        topic,
        diff: difficulty === 'mixed' ? randomDifficulty() : difficulty,
      });
    }
  }

  // Sequential execution with a growing exclude list so concurrent Redis reads
  // never return the same cached question twice in the same batch.
  const results: Question[] = [];
  const usedIds: string[] = [];

  for (const { subject, topic, diff } of plan) {
    try {
      const q = await getNextQuestion(userId, subject, topic, diff, examType, studentClass, usedIds);
      usedIds.push(q.id);
      results.push(q);
    } catch {
      // skip failed question rather than aborting the whole batch
    }
  }

  if (results.length === 0) {
    throw new Error('Could not generate any questions. Check your API keys and try again.');
  }

  return results;
}
