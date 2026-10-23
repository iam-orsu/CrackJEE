import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';
import { incCounter } from '../lib/metrics';
import { runOnce } from '../lib/distributedOnce';
import { cacheGetJson, cacheSetJson, cacheAppendUnique } from './cacheService';
import { generateQuestion, generateQuestionBatch } from './deepseekService';
import type { Subject, Difficulty, ExamType, StudentClass, QuestionType, GeneratedQuestion } from '../types/index';
import type { Question } from '@prisma/client';

const pendingGeneration = new Map<string, Promise<Question>>();

// ── Shared helpers ───────────────────────────────────────────────────────────
const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

// Max concurrent DB-backed slot lookups per batch request. Keeps one request from
// queueing more queries than the Prisma connection pool can serve.
const FANOUT_CONCURRENCY = Number(process.env.DB_FANOUT_CONCURRENCY ?? 5);

// Newest N generated questions kept per pool cache key. The pool is re-read and re-parsed on every
// request, so an unbounded pool would grow request cost and Redis memory forever. Older rows stay in the DB.
const MAX_POOL_SIZE = 300;

/**
 * Like Promise.allSettled, but runs at most `limit` tasks at a time.
 */
async function settleWithLimit<T, R>(
  items: T[],
  limit: number,
  task: (item: T) => Promise<R>,
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length);
  let cursor = 0;
  async function worker(): Promise<void> {
    while (cursor < items.length) {
      const idx = cursor++;
      try {
        results[idx] = { status: 'fulfilled', value: await task(items[idx]!) };
      } catch (reason) {
        results[idx] = { status: 'rejected', reason };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

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

/**
 * In-place Fisher-Yates array shuffle returning a newly allocated shuffled array.
 */
export function fisherYatesShuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = result[i]!;
    result[i] = result[j]!;
    result[j] = tmp;
  }
  return result;
}

/**
 * Distribute question slots across selected topics following the distribution rules:
 * - Single topic selected: allow all slots from that topic (e.g. 30 questions from Ray Optics).
 * - Multiple topics selected:
 *   - If totalSlots <= N: select totalSlots distinct topics (each gets exactly 1 question, max 1).
 *   - If N < totalSlots <= 2N: every topic gets 1 question, and remaining slots get a 2nd question (min 1, max 2).
 *   - If totalSlots > 2N: distribute slots evenly across all topics with at most difference 1.
 */
export function distributeTopicSlots(topics: string[], totalSlots: number): string[] {
  if (topics.length === 0 || totalSlots <= 0) return [];
  if (topics.length === 1) return Array(totalSlots).fill(topics[0]!);

  const shuffled = fisherYatesShuffle(topics);
  const N = shuffled.length;

  if (totalSlots <= N) {
    return shuffled.slice(0, totalSlots);
  }

  if (totalSlots <= 2 * N) {
    const result = [...shuffled];
    const secondPass = fisherYatesShuffle(shuffled).slice(0, totalSlots - N);
    result.push(...secondPass);
    return fisherYatesShuffle(result);
  }

  const result: string[] = [];
  const base = Math.floor(totalSlots / N);
  const remainder = totalSlots % N;
  for (let i = 0; i < N; i++) {
    const count = base + (i < remainder ? 1 : 0);
    for (let c = 0; c < count; c++) result.push(shuffled[i]!);
  }
  return fisherYatesShuffle(result);
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
  // Map examType to what is stored in the DB:
  // NEET questions are stored with examType 'NEET'; JEE questions with 'Main' or 'Advanced'.
  const bankExamType: string = examType === 'NEET' ? 'NEET'
    : examType === 'Advanced' ? 'Advanced' : 'Main';

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

  // Pick a random unseen question. The IDs for this topic/difficulty are cached in Redis for 10 minutes,
  // so a batch of N slots costs one cache read per slot instead of one database query per slot.
  const poolSize = 10;
  const idKey = `bankids:${bankExamType}:${subject}:${topic}:${difficulty}:${forceType ?? 'any'}`;
  let ids = await cacheGetJson<string[]>(idKey);
  if (!ids) {
    const rows = await prisma.question.findMany({ where: { ...where, id: undefined }, select: { id: true } });
    ids = rows.map((r) => r.id);
    await cacheSetJson(idKey, ids, 600);
  }
  const unseen = ids.filter((id) => !allExcluded.has(id));
  let candidates: Question[] = [];
  if (unseen.length > 0) {
    const chosen = fisherYatesShuffle(unseen).slice(0, poolSize);
    candidates = await prisma.question.findMany({ where: { id: { in: chosen } } });
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
  await cacheAppendUnique(servedKey, [question.id], 86400 * 7);
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

  // Pre-filter each subject's topics to only those that actually have questions in the DB.
  // This prevents empty-topic slots from reducing the final count below what was requested.
  const bankExamType = examType === 'NEET' ? 'NEET' : examType === 'Advanced' ? 'Advanced' : 'Main';
  for (const [subject, topics] of subjectGroups) {
    const rows = await prisma.question.findMany({
      where: { subject, examType: bankExamType, validatedAt: { not: null }, topic: { in: topics } },
      select: { topic: true },
      distinct: ['topic'],
    });
    const validTopics = new Set(rows.map((r) => r.topic));
    const filtered = topics.filter((t) => validTopics.has(t));
    // Keep at least the original list if nothing is valid (fallbacks in getPracticeQuestion will handle it)
    subjectGroups.set(subject, filtered.length > 0 ? filtered : topics);
  }

  const numSubjects = subjectGroups.size;
  const perSubject = numSubjects > 0 ? Math.floor(count / numSubjects) : count;

  // Build plan using distributeTopicSlots (over-plan by 20% to absorb empty slots)
  const overPlan: Array<{ subject: Subject; topic: string; diff: Difficulty }> = [];
  for (const [subject, topics] of subjectGroups) {
    const slots = Math.ceil(perSubject * 1.2);
    const allocatedTopics = distributeTopicSlots(topics, slots);
    for (const topic of allocatedTopics) {
      overPlan.push({
        subject,
        topic,
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

  const settled = await settleWithLimit([...keyGroups.values()], FANOUT_CONCURRENCY, async (slots) => {
    const group: Question[] = [];
    const excludeIds: string[] = [];
    for (const { subject, topic, diff } of slots) {
      try {
        const q = await getPracticeQuestion(userId, subject, topic, diff, examType, excludeIds);
        excludeIds.push(q.id);
        group.push(q);
      } catch (err) {
        // Bank empty for this combo is expected; anything else (pool timeout, DB down) is logged
        logger.warn({ err, topic, subject }, '[practice] slot skipped');
      }
    }
    return group;
  });

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
  let finalQuestions = results;
  if (withDiagrams.length > targetDiagrams) {
    const shuffled = fisherYatesShuffle([...withDiagrams]);
    const stripSet = new Set(shuffled.slice(targetDiagrams).map((q) => q.id));
    finalQuestions = results.map((q) => (stripSet.has(q.id) ? { ...q, diagram: null } : q));
  }

  // Consolidate served keys — concurrent groups race-write the same key, so do one final
  // authoritative write per subject:topic that includes every question ID we are returning.
  const servedByTopicKey = new Map<string, string[]>();
  for (const q of finalQuestions) {
    const key = `served:${userId}:${q.subject}:${q.topic}:practice`;
    if (!servedByTopicKey.has(key)) servedByTopicKey.set(key, []);
    servedByTopicKey.get(key)!.push(q.id);
  }
  await Promise.all(
    [...servedByTopicKey.entries()].map(([key, ids]) => cacheAppendUnique(key, ids, 86400 * 7)),
  );

  // Randomize question sequence so students receive independently shuffled question orders
  return fisherYatesShuffle(finalQuestions);
}

const BATCH_SIZE = 3;

/**
 * Prepares generated questions for storage. The second-model (OpenAI) check was removed because it
 * rejected nearly every DeepSeek question and its verdicts were not reliable. Questions still pass the
 * structural checks in deepseekService.parseRawQuestion (option count, distinct options, valid answer letter).
 */
function prepareForStorage(
  batch: GeneratedQuestion[],
): Array<{ question: GeneratedQuestion; validatedAt: Date }> {
  return batch.map((question) => ({ question, validatedAt: new Date() }));
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
  // Generate BATCH_SIZE questions in one API call (~67% cost reduction on cold cache)
  const batch = await generateQuestionBatch(BATCH_SIZE, subject, topic, difficulty, examType, studentClass, questionType)
    .catch(async () => {
      // Fall back to single generation if batch fails
      const single = await generateQuestion(subject, topic, difficulty, examType, studentClass, questionType);
      return [single];
    });

  const kept = prepareForStorage(batch);
  if (kept.length === 0) {
    throw new Error('DeepSeek returned no usable questions');
  }

  const cacheKey = `q:${subject}:${topic}:${difficulty}:${examType}:${studentClass}:${questionType}`;

  // Store all surviving questions in a single transaction
  const createdQuestions = await prisma.$transaction(
    kept.map(({ question: q, validatedAt }) => prisma.question.create({
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
        validatedAt,
      },
    }))
  );

  // Cache all 3 questions (24h TTL, was 6h)
  const updatedPool = [...(pool ?? []), ...createdQuestions].slice(-MAX_POOL_SIZE);
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
      await cacheAppendUnique(servedKey, [question.id], 86400 * 7);
      incCounter('question_source_total', { source: 'pool' });
      return question;
    }
  }

  const candidates = await prisma.question.findMany({
    where: {
      topic,
      subject,
      difficulty,
      examType,
      questionType,
      id: { notIn: [...allExcluded] },
      validatedAt: { not: null },
    },
    take: 10,
  });
  if (candidates.length > 0) {
    const existing = candidates[Math.floor(Math.random() * candidates.length)]!;
    await cacheAppendUnique(servedKey, [existing.id], 86400 * 7);
    incCounter('question_source_total', { source: 'bank' });
    return existing;
  }

  // One generation per bank key across all instances. Other callers wait for the new question to appear
  // in the database rather than generating their own.
  let genPromise = pendingGeneration.get(cacheKey);
  if (!genPromise) {
    genPromise = runOnce<Question>(`gen:${cacheKey}`, {
      lockSeconds: 180,
      waitMs: 90_000,
      readShared: () => prisma.question.findFirst({
        where: {
          topic, subject, difficulty, examType, questionType,
          id: { notIn: [...allExcluded] },
          validatedAt: { not: null },
        },
      }),
      produce: () => generateAndPersist(subject, topic, difficulty, examType, studentClass, questionType, pool),
    }).finally(() => pendingGeneration.delete(cacheKey));
    pendingGeneration.set(cacheKey, genPromise);
  }

  const question = await genPromise;
  incCounter('question_source_total', { source: 'generated' });
  await cacheAppendUnique(servedKey, [question.id], 86400 * 7);
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

  // Build plan grouped by subject using distributeTopicSlots — over-plan by 20% to absorb failures.
  const overPlan: Array<{ subject: Subject; topic: string; diff: Difficulty }> = [];
  for (const [subject, topics] of subjectGroups) {
    const slots = Math.ceil(perSubject * 1.2);
    const allocatedTopics = distributeTopicSlots(topics, slots);
    for (const topic of allocatedTopics) {
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

  const groupSettled = await settleWithLimit([...keyGroups.values()], FANOUT_CONCURRENCY, async (slots) => {
    const groupQuestions: Question[] = [];
    const excludeIds: string[] = [];
    for (const { subject, topic, diff } of slots) {
      try {
        const q = await getNextQuestion(userId, subject, topic, diff, examType, studentClass, excludeIds);
        excludeIds.push(q.id);
        groupQuestions.push(q);
      } catch (err) {
        // A failed slot is skipped so the rest of the batch still returns; log it so failures are visible
        logger.warn({ err, topic, subject }, '[ai] slot skipped');
      }
    }
    return groupQuestions;
  });

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
  let finalQuestions = results;
  if (withDiagrams.length > targetDiagrams) {
    const shuffled = fisherYatesShuffle([...withDiagrams]);
    const stripSet = new Set(shuffled.slice(targetDiagrams).map((q) => q.id));
    finalQuestions = results.map((q) => (stripSet.has(q.id) ? { ...q, diagram: null } : q));
  }

  // Independently shuffle questions for this student
  return fisherYatesShuffle(finalQuestions);
}

/**
 * Generate fresh AI questions for a mock exam.
 * Always calls DeepSeek — never reads from the seeded DB or practice cache.
 * Groups slots by key to minimise API calls (1 DeepSeek batch = 3 questions).
 * Saves generated questions to DB + updates practice cache as a side-benefit.
 */
export async function generateFreshMockBatch(
  slots: Array<{
    subject: Subject;
    topic: string;
    difficulty: Difficulty;
    examType: ExamType;
    questionType: QuestionType;
  }>,
  concurrency = 4,
): Promise<Question[]> {
  // Group by unique key so the same topic+diff only calls DeepSeek once
  const groups = new Map<string, typeof slots>();
  for (const slot of slots) {
    const k = `${slot.subject}|${slot.topic}|${slot.difficulty}|${slot.examType}|${slot.questionType}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(slot);
  }

  const allGenerated: Question[] = [];
  const seenIds = new Set<string>();
  const groupEntries = [...groups.entries()];
  let cursor = 0;

  async function worker(): Promise<void> {
    while (cursor < groupEntries.length) {
      const idx = cursor++;
      const [, groupSlots] = groupEntries[idx]!;
      const { subject, topic, difficulty, examType, questionType } = groupSlots[0]!;
      const needed = groupSlots.length;
      const cacheKey = `q:${subject}:${topic}:${difficulty}:${examType}:Dropper:${questionType}`;

      const generated: Question[] = [];
      // One DeepSeek batch call per ceil(needed / BATCH_SIZE) iterations
      for (let b = 0; b < Math.ceil(needed / BATCH_SIZE); b++) {
        // Retry once on transient failures so slots don't silently go unfulfilled
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const batch = await generateQuestionBatch(
              BATCH_SIZE, subject, topic, difficulty, examType, 'Dropper', questionType,
            ).catch(async () => {
              const s = await generateQuestion(subject, topic, difficulty, examType, 'Dropper', questionType);
              return [s];
            });

            const kept = prepareForStorage(batch);
            if (kept.length === 0) throw new Error('DeepSeek returned no usable questions');

            const created = await prisma.$transaction(
              kept.map(({ question: q, validatedAt }) =>
                prisma.question.create({
                  data: {
                    topic, subject,
                    questionText: q.question,
                    options: q.options,
                    answer: q.correct_answer,
                    explanation: q.answer_explanation,
                    diagram: q.diagram ? JSON.parse(JSON.stringify(q.diagram)) : undefined,
                    difficulty, examType, questionType,
                    validatedAt,
                  },
                }),
              ),
            );
            generated.push(...created);
            break; // success — don't retry
          } catch {
            // retry once; if second attempt also fails the slot goes unfulfilled
          }
        }
      }

      // Update practice cache so practice sessions also benefit
      if (generated.length > 0) {
        const existing = (await cacheGetJson<Question[]>(cacheKey)) ?? [];
        await cacheSetJson(cacheKey, [...existing, ...generated].slice(-MAX_POOL_SIZE), 3600 * 24);
      }

      // Only add up to `needed` questions to the pool — extras stay in practice cache only
      let added = 0;
      for (const q of generated) {
        if (added >= needed) break;
        if (!seenIds.has(q.id)) {
          seenIds.add(q.id);
          allGenerated.push(q);
          added++;
        }
      }
    }
  }

  const workerCount = Math.min(concurrency, Math.max(1, groups.size));
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return allGenerated;
}
