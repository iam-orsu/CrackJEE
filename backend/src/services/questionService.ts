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
      diagram: finalQuestion.diagram ? JSON.parse(JSON.stringify(finalQuestion.diagram)) : undefined,
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
  // Over-plan by 20% so duplicate cache hits and occasional failures don't leave us short.
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

  // Run all questions in parallel — each DeepSeek call takes 5-15s so sequential
  // would exceed nginx's timeout for batches > ~12 questions on a cold cache.
  // pendingGeneration deduplicates concurrent requests for the same topic key.
  const settled = await Promise.allSettled(
    overPlan.map(({ subject, topic, diff }) =>
      getNextQuestion(userId, subject, topic, diff, examType, studentClass, [])
    )
  );

  // Collect unique results per subject, capping each at perSubject to hit total count.
  const seenIds = new Set<string>();
  const perSubjectResults = new Map<Subject, Question[]>();
  for (const [subject] of subjectGroups) perSubjectResults.set(subject, []);

  for (const result of settled) {
    if (result.status !== 'fulfilled') continue;
    const q = result.value;
    if (seenIds.has(q.id)) continue;
    const bucket = perSubjectResults.get(q.subject as Subject);
    if (!bucket || bucket.length >= perSubject) continue;
    seenIds.add(q.id);
    bucket.push(q);
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
