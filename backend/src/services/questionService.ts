import { prisma } from '../lib/prisma';
import { cacheGetJson, cacheSetJson } from './cacheService';
import { generateQuestion, generateQuestionBatch } from './deepseekService';
import { validateQuestion } from './openaiService';
import type { Subject, Difficulty, ExamType, StudentClass, QuestionType } from '../types/index';
import type { Question } from '@prisma/client';

const pendingGeneration = new Map<string, Promise<Question>>();

// ── Shared helpers ───────────────────────────────────────────────────────────
const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

function randomDifficulty(): Difficulty {
  return DIFFICULTIES[Math.floor(Math.random() * 3)] as Difficulty;
}

function pickQuestionType(examType: ExamType): QuestionType {
  if (examType !== 'Advanced') {
    return Math.random() < 0.70 ? 'mcq_single' : 'integer';
  }
  const r = Math.random();
  if (r < 0.40) return 'mcq_single';
  if (r < 0.75) return 'mcq_multi';
  return 'integer';
}

// ── Practice-mode: DB-only helpers (zero DeepSeek calls) ─────────────────────

/**
 * Return one unseen question from the seeded question bank for practice mode.
 * Never calls DeepSeek. Throws if the bank is exhausted for this user/topic.
 */
export async function getPracticeQuestion(
  userId: string,
  subject: Subject,
  topic: string,
  difficulty: Difficulty,
  examType: ExamType,
  batchExcludeIds: string[] = [],
  forceType?: QuestionType,
): Promise<Question> {
  // The bank only contains 'Main' and 'Advanced' — treat 'Both' as 'Main' for
  // practice queries (the bank has enough Main questions for all topics).
  const bankExamType: 'Main' | 'Advanced' = examType === 'Advanced' ? 'Advanced' : 'Main';

  const servedKey = `served:${userId}:${subject}:${topic}:practice`;
  const servedIds = (await cacheGetJson<string[]>(servedKey)) ?? [];
  const allExcluded = new Set([...servedIds, ...batchExcludeIds]);

  const where = {
    topic,
    subject,
    difficulty,
    examType: bankExamType,
    ...(forceType ? { questionType: forceType } : {}),
    id: { notIn: [...allExcluded] },
    validatedAt: { not: null },
  };

  // Pick a random question: fetch a small pool then pick one randomly.
  // Uses a single DB call — no count+findFirst race condition.
  const poolSize = 10;
  const randomSkip = Math.floor(Math.random() * 50); // spread across first 50 unseen rows
  let candidates = await prisma.question.findMany({
    where,
    take: poolSize,
    skip: randomSkip,
  });

  // If random offset overshot (near end of result set), fall back to offset 0
  if (candidates.length === 0) {
    candidates = await prisma.question.findMany({ where, take: poolSize });
  }

  // Fallback 1: If user has seen all questions in this topic/diff, reset served cache
  if (candidates.length === 0 && allExcluded.size > 0) {
    await cacheSetJson(servedKey, [], 1);
    candidates = await prisma.question.findMany({
      where: {
        topic,
        subject,
        difficulty,
        examType: bankExamType,
        ...(forceType ? { questionType: forceType } : {}),
        validatedAt: { not: null },
      },
      take: poolSize,
    });
  }

  // Fallback 2: Relax difficulty filter across this topic
  if (candidates.length === 0) {
    candidates = await prisma.question.findMany({
      where: {
        topic,
        subject,
        examType: bankExamType,
        validatedAt: { not: null },
      },
      take: poolSize,
    });
  }

  // Fallback 3: Relax examType filter across this topic
  if (candidates.length === 0) {
    candidates = await prisma.question.findMany({
      where: {
        topic,
        subject,
        validatedAt: { not: null },
      },
      take: poolSize,
    });
  }

  if (candidates.length === 0) {
    throw new Error(
      `No practice questions found in database for topic "${topic}" in ${subject}.`
    );
  }

  const question = candidates[Math.floor(Math.random() * candidates.length)]!;
  await cacheSetJson(servedKey, [...servedIds, question.id], 86400 * 7);
  return question;
}

/**
 * Return a batch of questions from the seeded bank for practice mode.
 * Mirrors getQuestionBatch but never touches DeepSeek.
 */
export async function getPracticeQuestionBatch(
  userId: string,
  selections: Array<{ subject: Subject; topic: string }>,
  difficulty: Difficulty | 'mixed',
  examType: ExamType,
  count: number,
): Promise<Question[]> {
  // Group by subject
  const subjectGroups = new Map<Subject, string[]>();
  for (const { subject, topic } of selections) {
    if (!subjectGroups.has(subject)) subjectGroups.set(subject, []);
    subjectGroups.get(subject)!.push(topic);
  }

  const numSubjects = subjectGroups.size;
  const perSubject = numSubjects > 0 ? Math.floor(count / numSubjects) : count;

  // Build plan (over-plan by 20% to absorb empty slots)
  const overPlan: Array<{ subject: Subject; topic: string; diff: Difficulty }> = [];
  for (const [subject, topics] of subjectGroups) {
    const shuffled = [...topics].sort(() => Math.random() - 0.5);
    const slots = Math.ceil(perSubject * 1.2);
    for (let i = 0; i < slots; i++) {
      overPlan.push({
        subject,
        topic: shuffled[i % shuffled.length]!,
        diff: difficulty === 'mixed' ? randomDifficulty() : difficulty,
      });
    }
  }

  // Run slots grouped by subject+topic+diff key to build per-key exclude lists
  const keyGroups = new Map<string, Array<{ subject: Subject; topic: string; diff: Difficulty }>>();
  for (const slot of overPlan) {
    const key = `${slot.subject}:${slot.topic}:${slot.diff}`;
    if (!keyGroups.has(key)) keyGroups.set(key, []);
    keyGroups.get(key)!.push(slot);
  }

  const settled = await Promise.allSettled(
    [...keyGroups.values()].map(async (slots) => {
      const group: Question[] = [];
      const excludeIds: string[] = [];
      for (const { subject, topic, diff } of slots) {
        try {
          const q = await getPracticeQuestion(userId, subject, topic, diff, examType, excludeIds);
          excludeIds.push(q.id);
          group.push(q);
        } catch {
          // bank empty for this combo — skip
        }
      }
      return group;
    })
  );

  // Collect and deduplicate
  const seenIds = new Set<string>();
  const perSubjectResults = new Map<Subject, Question[]>();
  for (const [subject] of subjectGroups) perSubjectResults.set(subject, []);

  for (const result of settled) {
    if (result.status !== 'fulfilled') continue;
    for (const q of result.value) {
      if (seenIds.has(q.id)) continue;
      const bucket = perSubjectResults.get(q.subject as Subject);
      if (!bucket) continue;
      seenIds.add(q.id);
      bucket.push(q);
    }
  }

  // Interleave questions across subjects evenly up to the exact requested count
  const results: Question[] = [];
  let addedAny = true;
  let round = 0;
  while (results.length < count && addedAny) {
    addedAny = false;
    for (const [, bucket] of perSubjectResults) {
      if (round < bucket.length && results.length < count) {
        results.push(bucket[round]!);
        addedAny = true;
      }
    }
    round++;
  }

  if (results.length === 0) {
    throw new Error(
      'No practice questions available for the selected topics in the database.'
    );
  }

  // Cap diagrams to 1 per 5 questions
  const targetDiagrams = Math.floor(results.length / 5);
  const withDiagrams = results.filter((q) => q.diagram !== null);
  if (withDiagrams.length > targetDiagrams) {
    const shuffled = [...withDiagrams].sort(() => Math.random() - 0.5);
    const stripSet = new Set(shuffled.slice(targetDiagrams).map((q) => q.id));
    return results.map((q) => (stripSet.has(q.id) ? { ...q, diagram: null } : q));
  }

  return results;
}

const BATCH_SIZE = 3;

async function generateAndPersist(
  subject: Subject,
  topic: string,
  difficulty: Difficulty,
  examType: ExamType,
  studentClass: StudentClass,
  questionType: QuestionType,
  pool: Question[] | null,
): Promise<Question> {
  // Generate BATCH_SIZE questions in one API call (~67% cost reduction on cold cache)
  let batch = await generateQuestionBatch(BATCH_SIZE, subject, topic, difficulty, examType, studentClass, questionType)
    .catch(async () => {
      // Fall back to single generation if batch fails
      const single = await generateQuestion(subject, topic, difficulty, examType, studentClass, questionType);
      return [single];
    });

  // Validate only for non-beginner (skip OpenAI cost for easy questions)
  if (difficulty !== 'beginner' && batch.length > 0) {
    const isValid = await validateQuestion(batch[0]!);
    if (!isValid && batch.length > 1) {
      const isValid2 = await validateQuestion(batch[1]!);
      if (isValid2) {
        [batch[0], batch[1]] = [batch[1]!, batch[0]!];
      }
    }
  }

  const cacheKey = `q:${subject}:${topic}:${difficulty}:${examType}:${studentClass}:${questionType}`;

  // Store all generated questions in a single transaction
  const createdQuestions = await prisma.$transaction(
    batch.map((q) => prisma.question.create({
      data: {
        topic,
        subject,
        questionText: q.question,
        options: q.options,
        answer: q.correct_answer,
        explanation: q.answer_explanation,
        diagram: q.diagram ? JSON.parse(JSON.stringify(q.diagram)) : undefined,
        difficulty,
        examType,
        questionType,
        validatedAt: new Date(),
      },
    }))
  );

  // Cache all 3 questions (24h TTL, was 6h)
  const updatedPool = [...(pool ?? []), ...createdQuestions];
  await cacheSetJson(cacheKey, updatedPool, 3600 * 24);

  return createdQuestions[0]!;
}

export async function getNextQuestion(
  userId: string,
  subject: Subject,
  topic: string,
  difficulty: Difficulty,
  examType: ExamType,
  studentClass: StudentClass,
  batchExcludeIds: string[] = [],
  forceType?: QuestionType,
): Promise<Question> {
  const questionType = forceType ?? pickQuestionType(examType);
  const cacheKey = `q:${subject}:${topic}:${difficulty}:${examType}:${studentClass}:${questionType}`;
  const servedKey = `served:${userId}:${subject}:${topic}:${questionType}`;
  const servedIds = (await cacheGetJson<string[]>(servedKey)) ?? [];
  const allExcluded = new Set([...servedIds, ...batchExcludeIds]);

  const pool = await cacheGetJson<Question[]>(cacheKey);
  if (pool && pool.length > 0) {
    const unserved = pool.filter((q) => !allExcluded.has(q.id));
    if (unserved.length > 0) {
      const question = unserved[Math.floor(Math.random() * unserved.length)]!;
      await cacheSetJson(servedKey, [...servedIds, question.id], 86400 * 7);
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
    await cacheSetJson(servedKey, [...servedIds, existing.id], 86400 * 7);
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
  await cacheSetJson(servedKey, [...servedIds, question.id], 86400 * 7);
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

  // ── NOTE: Mock exam questions go through the AI path above. ─────────────────
  // ── Practice questions use getPracticeQuestionBatch (no DeepSeek). ──────────

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
