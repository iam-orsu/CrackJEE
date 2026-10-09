import { prisma } from '../lib/prisma';
import { cacheGetJson, cacheSetJson } from './cacheService';
import { generateQuestion } from './deepseekService';
import { validateQuestion } from './openaiService';
import type { Subject, Difficulty, ExamType, StudentClass, QuestionType } from '../types/index';
import type { Question } from '@prisma/client';

const pendingGeneration = new Map<string, Promise<Question>>();

const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

function randomDifficulty(): Difficulty {
  return DIFFICULTIES[Math.floor(Math.random() * 3)] as Difficulty;
}

function pickQuestionType(examType: ExamType): QuestionType {
  if (examType !== 'Advanced') {
    // JEE Main: 70% single correct, 30% integer
    return Math.random() < 0.70 ? 'mcq_single' : 'integer';
  }
  // JEE Advanced: 40% single, 35% multi-correct, 25% integer
  const r = Math.random();
  if (r < 0.40) return 'mcq_single';
  if (r < 0.75) return 'mcq_multi';
  return 'integer';
}

async function generateAndPersist(
  subject: Subject,
  topic: string,
  difficulty: Difficulty,
  examType: ExamType,
  studentClass: StudentClass,
  questionType: QuestionType,
  pool: Question[] | null,
): Promise<Question> {
  const generated = await generateQuestion(subject, topic, difficulty, examType, studentClass, questionType);
  const isValid = await validateQuestion(generated);

  let finalQuestion = generated;
  if (!isValid) {
    try {
      const retry = await generateQuestion(subject, topic, difficulty, examType, studentClass, questionType);
      const retryValid = await validateQuestion(retry);
      if (retryValid) finalQuestion = retry;
    } catch {
      // use original
    }
  }

  const cacheKey = `q:${subject}:${topic}:${difficulty}:${examType}:${studentClass}:${questionType}`;

  const question = await prisma.question.create({
    data: {
      topic,
      subject,
      questionText: finalQuestion.question,
      options: finalQuestion.options,
      answer: finalQuestion.correct_answer,
      explanation: finalQuestion.answer_explanation,
      diagram: finalQuestion.diagram ? JSON.parse(JSON.stringify(finalQuestion.diagram)) : undefined,
      difficulty,
      examType,
      questionType,
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
  const questionType = pickQuestionType(examType);
  const cacheKey = `q:${subject}:${topic}:${difficulty}:${examType}:${studentClass}:${questionType}`;
  const servedKey = `served:${userId}:${subject}:${topic}:${questionType}`;
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
      questionType,
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
    genPromise = generateAndPersist(subject, topic, difficulty, examType, studentClass, questionType, pool).finally(
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

  // Build plan grouped by subject — over-plan by 20% to absorb failures.
  const overPlan: Array<{ subject: Subject; topic: string; diff: Difficulty }> = [];
  for (const [subject, topics] of subjectGroups) {
    const shuffledTopics = [...topics].sort(() => Math.random() - 0.5);
    const slots = Math.ceil(perSubject * 1.2);
    for (let i = 0; i < slots; i++) {
      const topic = shuffledTopics[i % shuffledTopics.length]!;
      overPlan.push({
        subject,
        topic,
        diff: difficulty === 'mixed' ? randomDifficulty() : difficulty,
      });
    }
  }

  // Group slots by cache key so slots for the same topic+difficulty run
  // sequentially (building an exclude list to get distinct questions), while
  // different topic keys run in parallel for speed.
  const keyGroups = new Map<string, Array<{ subject: Subject; topic: string; diff: Difficulty }>>();
  for (const slot of overPlan) {
    const key = `${slot.subject}:${slot.topic}:${slot.diff}`;
    if (!keyGroups.has(key)) keyGroups.set(key, []);
    keyGroups.get(key)!.push(slot);
  }

  const groupSettled = await Promise.allSettled(
    [...keyGroups.values()].map(async (slots) => {
      const groupQuestions: Question[] = [];
      const excludeIds: string[] = [];
      for (const { subject, topic, diff } of slots) {
        try {
          const q = await getNextQuestion(userId, subject, topic, diff, examType, studentClass, excludeIds);
          excludeIds.push(q.id);
          groupQuestions.push(q);
        } catch {
          // skip failed slot
        }
      }
      return groupQuestions;
    })
  );

  // Collect unique results per subject, capping each bucket at perSubject.
  const seenIds = new Set<string>();
  const perSubjectResults = new Map<Subject, Question[]>();
  for (const [subject] of subjectGroups) perSubjectResults.set(subject, []);

  for (const result of groupSettled) {
    if (result.status !== 'fulfilled') continue;
    for (const q of result.value) {
      if (seenIds.has(q.id)) continue;
      const bucket = perSubjectResults.get(q.subject as Subject);
      if (!bucket || bucket.length >= perSubject) continue;
      seenIds.add(q.id);
      bucket.push(q);
    }
  }

  const results: Question[] = [];
  for (const [, bucket] of perSubjectResults) results.push(...bucket);

  if (results.length === 0) {
    throw new Error('Could not generate any questions. Check your API keys and try again.');
  }

  // Cap diagrams to 1 per 5 questions (5q→1, 10q→2, 20q→4, 30q→6)
  const targetDiagrams = Math.floor(results.length / 5);
  const withDiagrams = results.filter((q) => q.diagram !== null);
  if (withDiagrams.length > targetDiagrams) {
    const shuffled = [...withDiagrams].sort(() => Math.random() - 0.5);
    const stripSet = new Set(shuffled.slice(targetDiagrams).map((q) => q.id));
    return results.map((q) => (stripSet.has(q.id) ? { ...q, diagram: null } : q));
  }

  return results;
}
