import type { Question } from '@prisma/client';
import { CACHE_CONSTANTS } from '../config/constants';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { CacheService, cacheService as defaultCache } from './CacheService';
import { DeepSeekService, deepSeekService as defaultDeepSeek } from './DeepSeekService';
import { fillPracticeSlotsWithFallbacks, type PracticePoolCandidate } from './mockBankFill';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { incCounter } from '../utils/metrics';
import { runOnce } from '../utils/distributedOnce';
import { settleWithLimit } from '../utils/concurrencyLimiter';
import {
  distributeTopicSlots,
  fisherYatesShuffle,
  normalizeBankExamType,
  pickQuestionType,
  randomDifficulty,
} from '../utils/questionUtils';
import {
  JEE_TOPICS_BY_CLASS,
  NEET_TOPICS_BY_CLASS,
  type Difficulty,
  type ExamType,
  type GeneratedQuestion,
  type QuestionType,
  type StudentClass,
  type Subject,
} from '../types/index';

const BATCH_SIZE = 3;
const MOCK_BATCH_SIZE = 5;
const MAX_POOL_SIZE = 300;
const FANOUT_CONCURRENCY = Number(process.env.DB_FANOUT_CONCURRENCY ?? 5);

export class QuestionService {
  private readonly pendingGeneration = new Map<string, Promise<Question>>();

  constructor(
    private readonly questions: QuestionRepository = new QuestionRepository(),
    private readonly cache: CacheService = defaultCache,
    private readonly deepSeek: DeepSeekService = defaultDeepSeek,
  ) {}

  private poolCacheKey(
    subject: Subject,
    topic: string,
    difficulty: Difficulty,
    examType: ExamType,
    studentClass: StudentClass,
    questionType: QuestionType,
  ): string {
    return `qp2:${subject}:${topic}:${difficulty}:${examType}:${studentClass}:${questionType}`;
  }

  private capAndShuffleBatch(results: Question[]): Question[] {
    const targetDiagrams = Math.floor(results.length / 5);
    const withDiagrams = results.filter((q) => q.diagram !== null);
    let finalQuestions = results;
    if (withDiagrams.length > targetDiagrams) {
      const shuffled = fisherYatesShuffle([...withDiagrams]);
      const stripSet = new Set(shuffled.slice(targetDiagrams).map((q) => q.id));
      finalQuestions = results.map((q) => (stripSet.has(q.id) ? { ...q, diagram: null } : q));
    }
    return fisherYatesShuffle(finalQuestions);
  }

  public async getPracticeQuestion(
    userId: string,
    subject: Subject,
    topic: string,
    difficulty: Difficulty,
    examType: ExamType,
    batchExcludeIds: string[] = [],
    forceType?: QuestionType,
  ): Promise<Question> {
    const bankExamType = normalizeBankExamType(examType);
    const servedKey = `served:${userId}:${subject}:${topic}:practice`;
    const servedIds = (await this.cache.getJson<string[]>(servedKey)) ?? [];
    const allExcluded = new Set([...servedIds, ...batchExcludeIds]);

    const poolSize = 10;
    const idKey = `bankids:${bankExamType}:${subject}:${topic}:${difficulty}:${forceType ?? 'any'}`;
    let ids = await this.cache.getJson<string[]>(idKey);
    if (!ids) {
      ids = await this.questions.findIdsByCriteria({
        topic,
        subject,
        difficulty,
        examType: bankExamType,
        ...(forceType ? { questionType: forceType } : {}),
        validatedAt: { not: null },
        mockOnly: false,
      });
      await this.cache.setJson(idKey, ids, CACHE_CONSTANTS.POOL_TTL_SECONDS);
    }

    const unseen = ids.filter((id) => !allExcluded.has(id));
    let candidates: Question[] = [];
    if (unseen.length > 0) {
      const chosen = fisherYatesShuffle(unseen).slice(0, poolSize);
      candidates = await this.questions.findManyByIds(chosen);
    }

    const batchExclude = batchExcludeIds.length > 0 ? { id: { notIn: batchExcludeIds } } : {};

    if (candidates.length === 0 && allExcluded.size > 0) {
      candidates = await this.questions.findMany(
        {
          topic,
          subject,
          difficulty,
          examType: bankExamType,
          ...(forceType ? { questionType: forceType } : {}),
          ...batchExclude,
          validatedAt: { not: null },
          mockOnly: false,
        },
        poolSize,
      );
    }

    if (candidates.length === 0) {
      candidates = await this.questions.findMany(
        { topic, subject, examType: bankExamType, ...batchExclude, validatedAt: { not: null }, mockOnly: false },
        poolSize,
      );
    }

    if (candidates.length === 0) {
      candidates = await this.questions.findMany(
        { topic, subject, ...batchExclude, validatedAt: { not: null }, mockOnly: false },
        poolSize,
      );
    }

    if (candidates.length === 0) {
      throw new Error(`No practice questions found in database for topic "${topic}" in ${subject}.`);
    }

    const question = candidates[Math.floor(Math.random() * candidates.length)]!;
    await this.cache.appendUnique(servedKey, [question.id], CACHE_CONSTANTS.SERVED_TTL_SECONDS);
    return question;
  }

  public async getPracticeQuestionBatch(
    userId: string,
    selections: Array<{ subject: Subject; topic: string }>,
    difficulty: Difficulty | 'mixed',
    examType: ExamType,
    count: number,
  ): Promise<Question[]> {
    const subjectGroups = new Map<Subject, string[]>();
    for (const { subject, topic } of selections) {
      if (!subjectGroups.has(subject)) subjectGroups.set(subject, []);
      subjectGroups.get(subject)!.push(topic);
    }

    const bankExamType = normalizeBankExamType(examType);
    for (const [subject, topics] of subjectGroups) {
      const validTopics = await this.questions.findDistinctPracticeTopicsIn(subject, bankExamType, topics);
      const filtered = topics.filter((t) => validTopics.has(t));
      subjectGroups.set(subject, filtered.length > 0 ? filtered : topics);
    }

    const numSubjects = subjectGroups.size;
    const perSubject = numSubjects > 0 ? Math.floor(count / numSubjects) : count;

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
          const q = await this.getPracticeQuestion(userId, subject, topic, diff, examType, excludeIds);
          excludeIds.push(q.id);
          group.push(q);
        } catch (err) {
          logger.warn({ err, topic, subject }, '[practice] slot skipped');
        }
      }
      return group;
    });

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
      throw new Error('No practice questions available for the selected topics in the database.');
    }

    const finalQuestions = this.capAndShuffleBatch(results);

    const servedByTopicKey = new Map<string, string[]>();
    for (const q of finalQuestions) {
      const key = `served:${userId}:${q.subject}:${q.topic}:practice`;
      if (!servedByTopicKey.has(key)) servedByTopicKey.set(key, []);
      servedByTopicKey.get(key)!.push(q.id);
    }
    await Promise.all(
      [...servedByTopicKey.entries()].map(([key, ids]) =>
        this.cache.appendUnique(key, ids, CACHE_CONSTANTS.SERVED_TTL_SECONDS),
      ),
    );

    return finalQuestions;
  }

  private async cachedAiBankIds(
    subject: Subject,
    topic: string,
    difficulty: Difficulty,
    examType: ExamType,
    questionType: QuestionType,
  ): Promise<string[]> {
    const key = `bankids-ai:${subject}:${topic}:${difficulty}:${examType}:${questionType}`;
    const cached = await this.cache.getJson<string[]>(key);
    if (cached) return cached;
    const ids = await this.questions.findIdsByCriteria({
      topic,
      subject,
      difficulty,
      examType,
      questionType,
      validatedAt: { not: null },
      mockOnly: false,
    });
    await this.cache.setJson(key, ids, CACHE_CONSTANTS.POOL_TTL_SECONDS);
    return ids;
  }

  private async fallbackFromBank(
    subject: Subject,
    topic: string,
    difficulty: Difficulty,
    examType: ExamType,
    excludeIds: Set<string>,
  ): Promise<Question> {
    const bankExamType = normalizeBankExamType(examType);
    const notIn = [...excludeIds];
    const filters: Array<Record<string, unknown>> = [
      { topic, subject, difficulty, examType: bankExamType },
      { topic, subject, examType: bankExamType },
      { topic, subject },
      { subject },
    ];

    for (const where of filters) {
      const candidates = await this.questions.findMany(
        { ...where, id: { notIn }, validatedAt: { not: null }, mockOnly: false },
        10,
      );
      if (candidates.length > 0) {
        return candidates[Math.floor(Math.random() * candidates.length)]!;
      }
    }

    throw new Error(
      `No fallback questions available for ${subject}/${topic}. The AI service is temporarily unavailable and the question bank has no matching questions.`,
    );
  }

  private async generateAndPersist(
    subject: Subject,
    topic: string,
    difficulty: Difficulty,
    examType: ExamType,
    studentClass: StudentClass,
    questionType: QuestionType,
    pool: Question[] | null,
  ): Promise<Question> {
    const batch: GeneratedQuestion[] = await this.deepSeek
      .generateQuestionBatch(BATCH_SIZE, subject, topic, difficulty, examType, studentClass, questionType)
      .catch(async () => {
        const single = await this.deepSeek.generateQuestion(subject, topic, difficulty, examType, studentClass, questionType);
        return [single];
      });

    if (batch.length === 0) throw new Error('DeepSeek returned no usable questions');

    const now = new Date();
    const createdQuestions = await this.questions.createGeneratedBatch(
      batch.map((question) => ({
        topic,
        subject,
        difficulty,
        examType,
        questionType,
        question,
        validatedAt: now,
      })),
    );

    const cacheKey = this.poolCacheKey(subject, topic, difficulty, examType, studentClass, questionType);
    const updatedPool = [...(pool ?? []), ...createdQuestions].slice(-MAX_POOL_SIZE);
    await this.cache.setJson(cacheKey, updatedPool, CACHE_CONSTANTS.QUESTION_POOL_TTL_SECONDS);

    return createdQuestions[0]!;
  }

  public async getNextQuestion(
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
    const cacheKey = this.poolCacheKey(subject, topic, difficulty, examType, studentClass, questionType);
    const servedKey = `served:${userId}:${subject}:${topic}:${questionType}`;
    const servedIds = (await this.cache.getJson<string[]>(servedKey)) ?? [];
    const allExcluded = new Set([...servedIds, ...batchExcludeIds]);

    const pool = await this.cache.getJson<Question[]>(cacheKey);
    if (pool && pool.length > 0) {
      const unserved = pool.filter((q) => !allExcluded.has(q.id));
      if (unserved.length > 0) {
        const question = unserved[Math.floor(Math.random() * unserved.length)]!;
        await this.cache.appendUnique(servedKey, [question.id], CACHE_CONSTANTS.SERVED_TTL_SECONDS);
        incCounter('question_source_total', { source: 'pool' });
        return question;
      }
    }

    const bankIds = await this.cachedAiBankIds(subject, topic, difficulty, examType, questionType);
    const unseenIds = bankIds.filter((id) => !allExcluded.has(id));
    if (unseenIds.length > 0) {
      const pickedId = unseenIds[Math.floor(Math.random() * unseenIds.length)]!;
      const existing = await this.questions.findById(pickedId);
      if (existing) {
        await this.cache.appendUnique(servedKey, [existing.id], CACHE_CONSTANTS.SERVED_TTL_SECONDS);
        incCounter('question_source_total', { source: 'bank' });
        return existing;
      }
    }

    if (!this.deepSeek.isAvailable()) {
      logger.info({ subject, topic }, '[ai] Circuit open — falling back to DB bank');
      try {
        const question = await this.fallbackFromBank(subject, topic, difficulty, examType, allExcluded);
        incCounter('question_source_total', { source: 'fallback' });
        await this.cache.appendUnique(servedKey, [question.id], CACHE_CONSTANTS.SERVED_TTL_SECONDS);
        return question;
      } catch {
        throw new Error('AI service is temporarily unavailable and no fallback questions exist for this topic.');
      }
    }

    let genPromise = this.pendingGeneration.get(cacheKey);
    if (!genPromise) {
      genPromise = runOnce<Question>(`gen:${cacheKey}`, {
        lockSeconds: 180,
        waitMs: 90_000,
        readShared: () =>
          this.questions.findFirst({
            topic,
            subject,
            difficulty,
            examType,
            questionType,
            id: { notIn: [...allExcluded] },
            validatedAt: { not: null },
            mockOnly: false,
          }),
        produce: () => this.generateAndPersist(subject, topic, difficulty, examType, studentClass, questionType, pool),
      }).finally(() => this.pendingGeneration.delete(cacheKey));
      this.pendingGeneration.set(cacheKey, genPromise);
    }

    try {
      const question = await genPromise;
      incCounter('question_source_total', { source: 'generated' });
      await this.cache.appendUnique(servedKey, [question.id], CACHE_CONSTANTS.SERVED_TTL_SECONDS);
      return question;
    } catch (err) {
      logger.warn({ err: err instanceof Error ? err.message : String(err), subject, topic }, '[ai] Generation failed — trying DB fallback');
      try {
        const question = await this.fallbackFromBank(subject, topic, difficulty, examType, allExcluded);
        incCounter('question_source_total', { source: 'fallback' });
        await this.cache.appendUnique(servedKey, [question.id], CACHE_CONSTANTS.SERVED_TTL_SECONDS);
        return question;
      } catch {
        throw err;
      }
    }
  }

  public async getQuestionBatch(
    userId: string,
    selections: Array<{ subject: Subject; topic: string }>,
    difficulty: Difficulty | 'mixed',
    examType: ExamType,
    studentClass: StudentClass,
    count: number,
  ): Promise<Question[]> {
    if (!this.deepSeek.isAvailable()) {
      logger.info({ count, subjects: selections.length }, '[ai-batch] Circuit open — delegating to practice bank');
      return this.getPracticeQuestionBatch(userId, selections, difficulty, examType, count);
    }

    const subjectGroups = new Map<Subject, string[]>();
    for (const { subject, topic } of selections) {
      if (!subjectGroups.has(subject)) subjectGroups.set(subject, []);
      subjectGroups.get(subject)!.push(topic);
    }

    const numSubjects = subjectGroups.size;
    const perSubject = numSubjects > 0 ? Math.floor(count / numSubjects) : count;

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
          const q = await this.getNextQuestion(userId, subject, topic, diff, examType, studentClass, excludeIds);
          excludeIds.push(q.id);
          groupQuestions.push(q);
        } catch (err) {
          logger.warn({ err, topic, subject }, '[ai] slot skipped');
        }
      }
      return groupQuestions;
    });

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

    return this.capAndShuffleBatch(results);
  }

  public async fillMockSlotsFromPracticeBank(
    slots: Array<{ subject: Subject; topic: string; difficulty: Difficulty; examType: ExamType; questionType: QuestionType }>,
    excludeIds: Set<string>,
  ): Promise<Array<PracticePoolCandidate | null>> {
    if (slots.length === 0) return [];
    const subjects = [...new Set(slots.map((s) => s.subject))];
    const pool = await this.questions.findPracticePoolBySubjects(subjects);
    const slotRequests = slots.map((slot) => ({
      subject: slot.subject,
      topic: slot.topic,
      difficulty: slot.difficulty,
      questionType: slot.questionType,
      bankExamType: normalizeBankExamType(slot.examType),
    }));
    return fillPracticeSlotsWithFallbacks(slotRequests, pool, excludeIds);
  }

  public async generateFreshMockBatch(
    slots: Array<{
      subject: Subject;
      topic: string;
      difficulty: Difficulty;
      examType: ExamType;
      questionType: QuestionType;
    }>,
    concurrency = 4,
  ): Promise<Question[]> {
    const neededByTopic = new Map<string, number>();
    const groups = new Map<string, { subject: Subject; difficulty: Difficulty; examType: ExamType; questionType: QuestionType; topics: Map<string, number> }>();

    for (const slot of slots) {
      const key = `${slot.subject}|${slot.difficulty}|${slot.examType}|${slot.questionType}`;
      if (!groups.has(key)) {
        groups.set(key, {
          subject: slot.subject,
          difficulty: slot.difficulty,
          examType: slot.examType,
          questionType: slot.questionType,
          topics: new Map(),
        });
      }
      const group = groups.get(key)!;
      group.topics.set(slot.topic, (group.topics.get(slot.topic) ?? 0) + 1);
      neededByTopic.set(slot.topic, (neededByTopic.get(slot.topic) ?? 0) + 1);
    }

    const jobs: Array<{ subject: Subject; difficulty: Difficulty; examType: ExamType; questionType: QuestionType; plan: Array<{ topic: string; count: number }> }> = [];
    for (const group of groups.values()) {
      let plan: Array<{ topic: string; count: number }> = [];
      let size = 0;
      const flush = () => {
        if (plan.length > 0) jobs.push({ ...group, plan });
        plan = [];
        size = 0;
      };
      for (const [topic, count] of group.topics) {
        let left = count;
        while (left > 0) {
          const take = Math.min(left, MOCK_BATCH_SIZE - size);
          const last = plan[plan.length - 1];
          if (last && last.topic === topic) last.count += take;
          else plan.push({ topic, count: take });
          size += take;
          left -= take;
          if (size === MOCK_BATCH_SIZE) flush();
        }
      }
      flush();
    }

    const allGenerated: Question[] = [];
    const seenIds = new Set<string>();
    let cursor = 0;

    const worker = async (): Promise<void> => {
      while (cursor < jobs.length) {
        const job = jobs[cursor++]!;
        try {
          const results = await this.deepSeek.generateMixedTopicBatch({
            subject: job.subject,
            examType: job.examType,
            difficulty: job.difficulty,
            questionType: job.questionType,
            plan: job.plan,
          });
          const verdicts = await this.deepSeek.verifyQuestionBatch(results.map((r) => r.question));
          const verified = results.filter((_, i) => verdicts[i]);
          if (verified.length < results.length) {
            logger.info({ dropped: results.length - verified.length }, '[mockPool] Dropped questions that failed the answer check');
          }
          if (verified.length === 0) continue;

          const now = new Date();
          const created = await this.questions.createGeneratedBatch(
            verified.map(({ topic, question }) => ({
              topic,
              subject: job.subject,
              difficulty: job.difficulty,
              examType: job.examType,
              questionType: job.questionType,
              question,
              validatedAt: now,
              mockOnly: true,
            })),
          );

          for (const q of created) {
            const left = neededByTopic.get(q.topic) ?? 0;
            if (left <= 0 || seenIds.has(q.id)) continue;
            neededByTopic.set(q.topic, left - 1);
            seenIds.add(q.id);
            allGenerated.push(q);
          }
        } catch (err) {
          logger.warn({ err: err instanceof Error ? err.message : String(err), topics: job.plan.length }, '[mockPool] Question batch failed');
        }
      }
    };

    const workerCount = Math.min(concurrency, Math.max(1, jobs.length));
    await Promise.all(Array.from({ length: workerCount }, () => worker()));
    return allGenerated;
  }

  public async getBankStats(examTypeFilter?: string) {
    const rows = await this.questions.groupValidatedCountsBySubject({
      validatedAt: { not: null },
      mockOnly: false,
      ...(examTypeFilter ? { examType: examTypeFilter } : {}),
    });
    const bySubject: Record<string, number> = { Physics: 0, Chemistry: 0, Mathematics: 0, Botany: 0, Zoology: 0 };
    for (const row of rows) bySubject[row.subject] = row._count._all;
    const total = Object.values(bySubject).reduce((sum, n) => sum + n, 0);
    return { total, bySubject };
  }

  /** Returns Class 11/12 topic splits for JEE or NEET based on the student's class. */
  public getTopics(studentClass: StudentClass, examMode: string): Record<string, { class11: string[]; class12: string[] }> {
    if (examMode === 'NEET') {
      return Object.fromEntries(
        ['Physics', 'Chemistry', 'Botany', 'Zoology'].map((s) => {
          const split = NEET_TOPICS_BY_CLASS[s]!;
          return [s, { class11: split.class11, class12: split.class12 }];
        }),
      );
    }

    const subjects: Subject[] = ['Mathematics', 'Physics', 'Chemistry'];
    return Object.fromEntries(
      subjects.map((s) => {
        const split = JEE_TOPICS_BY_CLASS[s] ?? { class11: [], class12: [] };
        return [
          s,
          {
            class11: split.class11,
            class12: studentClass === '11' ? [] : split.class12,
          },
        ];
      }),
    );
  }

  /**
   * Retrieves or on-demand generates a 'better' or 'best' explanation for a question,
   * with write-through persistence to MySQL Question table and runOnce deduplication.
   */
  public async getTieredExplanation(
    questionId: string,
    tier: 'better' | 'best',
  ): Promise<{ tier: 'better' | 'best'; explanation: string; cached: boolean }> {
    const question = await this.questions.findByIdForTieredExplanation(questionId);
    if (!question) throw new AppError(404, 'Question not found');

    const existing = tier === 'better' ? question.betterExplanation : question.bestExplanation;
    if (existing && existing.trim()) {
      return { tier, explanation: existing, cached: true };
    }

    const explanation = await runOnce<string>(`explain:${questionId}:${tier}`, {
      lockSeconds: 60,
      waitMs: 60_000,
      readShared: async () => {
        const fresh = await this.questions.findByIdForTieredExplanation(questionId);
        const text = tier === 'better' ? fresh?.betterExplanation : fresh?.bestExplanation;
        return text && text.trim() ? text : null;
      },
      produce: async () => {
        const fresh = await this.questions.findByIdForTieredExplanation(questionId);
        const alreadySaved = tier === 'better' ? fresh?.betterExplanation : fresh?.bestExplanation;
        if (alreadySaved && alreadySaved.trim()) return alreadySaved;

        if (!this.deepSeek.isAvailable()) {
          throw new AppError(503, 'AI explanation service is temporarily unavailable. Please try again in a few moments.');
        }

        const options = Array.isArray(question.options) ? (question.options as string[]) : [];
        const text = await this.deepSeek.generateTieredExplanation({
          questionText: question.questionText,
          options,
          answer: question.answer,
          questionType: question.questionType,
          subject: question.subject,
          topic: question.topic,
          examType: question.examType,
          tier,
          existingExplanation: question.explanation,
        });

        await this.questions.updateTieredExplanation(questionId, tier, text);
        return text;
      },
    });

    return { tier, explanation, cached: false };
  }
}

export { distributeTopicSlots, fisherYatesShuffle };
