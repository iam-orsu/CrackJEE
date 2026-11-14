import type { Question } from '@prisma/client';
import { MOCK_CONSTANTS } from '../config/constants';
import { MockExamRepository, type MockPoolItem } from '../repositories/MockExamRepository';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { TopicRepository } from '../repositories/TopicRepository';
import { QuestionService } from './QuestionService';
import { DeepSeekService, deepSeekService as defaultDeepSeek } from './DeepSeekService';
import { MockDataService } from './MockDataService';
import { fillSlotsFromBank, slotKey, type SlotKey } from './mockBankFill';
import { fullTopicList } from './mockTopicPlan';
import { fisherYatesShuffle } from '../utils/questionUtils';
import { runOnce } from '../utils/distributedOnce';
import { logger } from '../utils/logger';
import { NEET_SUBJECTS, type Difficulty, type QuestionType, type Subject } from '../types/index';

type SlotInput = {
  subject: Subject;
  topic: string;
  difficulty: Difficulty;
  examType: 'Main' | 'Advanced' | 'NEET';
  questionType: QuestionType;
};

type PaperQuestion = { id: string; subject: string; topic: string; questionType: string };

export class MockGeneratorService {
  private readonly activeGenerations = new Set<Promise<void>>();

  constructor(
    private readonly mockRepo: MockExamRepository = new MockExamRepository(),
    private readonly questionRepo: QuestionRepository = new QuestionRepository(),
    private readonly questionService: QuestionService = new QuestionService(),
    private readonly mockData: MockDataService = new MockDataService(),
    private readonly deepSeek: DeepSeekService = defaultDeepSeek,
    private readonly topicRepo: TopicRepository = new TopicRepository(),
  ) {}

  public trackGeneration(promise: Promise<void>): void {
    this.activeGenerations.add(promise);
    void promise.finally(() => this.activeGenerations.delete(promise));
  }

  public async waitForActiveGenerations(timeoutMs: number): Promise<void> {
    if (this.activeGenerations.size === 0) return;
    logger.info({ count: this.activeGenerations.size }, 'Waiting for mock generations to finish');
    await Promise.race([
      Promise.allSettled([...this.activeGenerations]),
      new Promise((resolve) => setTimeout(resolve, timeoutMs)),
    ]);
  }

  private expectedPerSubject(examType: 'Main' | 'Advanced' | 'NEET'): number {
    if (examType === 'NEET') return 45;
    if (examType === 'Advanced') return 17;
    return 25;
  }

  private pickDifficulty(
    examType: 'Main' | 'Advanced',
    seed: number,
    difficultyMode: 'easy' | 'medium' | 'hard',
  ): Difficulty {
    // JEE Advanced never asks school-level / beginner single-formula questions, even on accessible mocks.
    if (examType === 'Advanced') {
      if (difficultyMode === 'easy') return seed < 0.45 ? 'intermediate' : 'advanced';
      if (difficultyMode === 'hard') return seed < 0.12 ? 'intermediate' : 'advanced';
      return seed < 0.25 ? 'intermediate' : 'advanced';
    }
    if (difficultyMode === 'easy') {
      if (seed < 0.60) return 'beginner';
      if (seed < 0.95) return 'intermediate';
      return 'advanced';
    }
    if (difficultyMode === 'hard') {
      if (seed < 0.25) return 'intermediate';
      return 'advanced';
    }
    if (seed < 0.2) return 'beginner';
    if (seed < 0.65) return 'intermediate';
    return 'advanced';
  }

  private buildJEESlots(
    examType: 'Main' | 'Advanced',
    difficultyMode: 'easy' | 'medium' | 'hard',
    topicsBySubject: Record<string, string[]>,
  ): SlotInput[] {
    const subjects: Subject[] = ['Physics', 'Chemistry', 'Mathematics'];
    const typePlan: Array<{ type: QuestionType; count: number }> = examType === 'Main'
      ? [{ type: 'mcq_single', count: 20 }, { type: 'integer', count: 5 }]
      : [{ type: 'mcq_single', count: 7 }, { type: 'mcq_multi', count: 4 }, { type: 'integer', count: 6 }];

    const slots: SlotInput[] = [];
    for (const subject of subjects) {
      const allocatedTopics = topicsBySubject[subject] ?? [];
      let cursor = 0;
      for (const { type, count } of typePlan) {
        for (let i = 0; i < count; i++) {
          slots.push({
            subject,
            topic: allocatedTopics[cursor++]!,
            difficulty: this.pickDifficulty(examType, Math.random(), difficultyMode),
            examType,
            questionType: type,
          });
        }
      }
    }
    return slots;
  }

  private buildNEETSlots(
    difficultyMode: 'easy' | 'medium' | 'hard',
    topicsBySubject: Record<string, string[]>,
  ): SlotInput[] {
    const slots: SlotInput[] = [];
    for (const subject of NEET_SUBJECTS) {
      for (const topic of topicsBySubject[subject] ?? []) {
        slots.push({
          subject,
          topic,
          difficulty: this.pickDifficulty('Main', Math.random(), difficultyMode),
          examType: 'NEET',
          questionType: 'mcq_single',
        });
      }
    }
    return slots;
  }

  private async loadMockBank(examType: 'Main' | 'Advanced' | 'NEET', slots: SlotInput[]) {
    const keys = new Map<string, SlotKey>();
    for (const s of slots) {
      const key: SlotKey = {
        subject: s.subject,
        topic: s.topic,
        difficulty: s.difficulty,
        questionType: s.questionType,
      };
      keys.set(slotKey(key), key);
    }
    return this.questionRepo.findMockBankSlots(examType, [...keys.values()]);
  }

  private async generateFreshPaper(
    examType: 'Main' | 'Advanced' | 'NEET',
    difficultyMode: 'easy' | 'medium' | 'hard',
    topicsBySubject: Record<string, string[]>,
    seen: Set<string>,
  ): Promise<MockPoolItem[]> {
    const slots = examType === 'NEET'
      ? this.buildNEETSlots(difficultyMode, topicsBySubject)
      : this.buildJEESlots(examType, difficultyMode, topicsBySubject);

    const slotKeys: SlotKey[] = slots.map((s) => ({
      subject: s.subject,
      topic: s.topic,
      difficulty: s.difficulty,
      questionType: s.questionType,
    }));
    const bank = await this.loadMockBank(examType, slots);
    const picks = fillSlotsFromBank(slotKeys, bank, seen);
    const bankById = new Map(bank.map((q) => [q.id, q]));
    const fromBank: PaperQuestion[] = picks.flatMap((id) => (id ? [bankById.get(id)!] : []));
    let missingSlots = slots.filter((_, i) => picks[i] === null);
    logger.info({ fromBank: fromBank.length, generate: missingSlots.length }, '[mockPool] Mock-only paper slots filled from bank');

    const canGenerateWithAi = this.deepSeek.isAvailable();
    if (missingSlots.length > 0 && !canGenerateWithAi) {
      throw new Error(`Cannot generate mock paper: DeepSeek AI is required for mock questions. Practice bank questions (mockOnly=false) are strictly isolated and never used in mocks.`);
    }

    const generated: PaperQuestion[] = missingSlots.length > 0 && canGenerateWithAi
      ? await this.questionService.generateFreshMockBatch(missingSlots, 4)
      : [];
    let questions: PaperQuestion[] = [...fromBank, ...generated];

    const expected = this.expectedPerSubject(examType);
    if (canGenerateWithAi) {
      for (let round = 0; round < 8; round++) {
        if (!this.deepSeek.isAvailable()) break;
        const subjectCounts = new Map<string, number>();
        for (const q of questions) subjectCounts.set(q.subject, (subjectCounts.get(q.subject) ?? 0) + 1);

        const topUpSlots: SlotInput[] = [];
        for (const slot of slots) {
          const current = subjectCounts.get(slot.subject) ?? 0;
          if (current < expected) {
            topUpSlots.push(slot, slot);
            subjectCounts.set(slot.subject, current + 1);
          }
        }
        if (topUpSlots.length === 0) break;

        logger.info({ round: round + 1, slots: topUpSlots.length }, '[mockPool] Top-up: generating replacements via DeepSeek');
        const extras = await this.questionService.generateFreshMockBatch(topUpSlots, 4);
        questions = [...questions, ...extras];
      }
    }

    const subjectsNeeded: string[] = examType === 'NEET' ? [...NEET_SUBJECTS] : ['Physics', 'Chemistry', 'Mathematics'];
    for (const subject of subjectsNeeded) {
      const count = questions.filter((q) => q.subject === subject).length;
      if (count < expected) {
        throw new Error(`Paper incomplete: ${subject} has ${count} of ${expected} mock-only questions. DeepSeek generation required.`);
      }
    }

    questions = subjectsNeeded.flatMap((subject) => questions.filter((q) => q.subject === subject).slice(0, expected));

    return questions.map((q) => ({
      questionId: q.id,
      subject: q.subject,
      questionType: q.questionType,
      topic: q.topic,
    }));
  }

  private async getOrGenerateWeakQuestions(
    userId: string,
    examType: 'Main' | 'Advanced' | 'NEET',
    subject: Subject,
    topic: string,
    topicId: string,
    count = 5,
  ): Promise<MockPoolItem[]> {
    const questionType: QuestionType = 'mcq_single';
    const seen = await this.mockData.loadSeenQuestionIds(userId, examType);
    const existing = await this.questionRepo.findMockBankSlots(examType, [
      { subject, topic, difficulty: 'intermediate', questionType },
      { subject, topic, difficulty: 'beginner', questionType },
      { subject, topic, difficulty: 'advanced', questionType },
    ]);
    const available = existing.filter((q) => !seen.has(q.id));

    if (available.length >= count) {
      return available.slice(0, count).map((q) => ({
        questionId: q.id,
        subject: q.subject as Subject,
        questionType: q.questionType,
        topic: q.topic,
      }));
    }

    const needed = count - available.length;
    const lockKey = `topic:mockgen:${examType}:${topicId}`;

    const generated = await runOnce<Question[]>(lockKey, {
      lockSeconds: 30,
      waitMs: 15_000,
      readShared: async () => {
        const fresh = await this.questionRepo.findMockBankSlots(examType, [
          { subject, topic, difficulty: 'intermediate', questionType },
          { subject, topic, difficulty: 'beginner', questionType },
          { subject, topic, difficulty: 'advanced', questionType },
        ]);
        const unread = fresh.filter((q) => !seen.has(q.id));
        return unread.length >= count ? (unread as unknown as Question[]) : null;
      },
      produce: async () => {
        const slots = Array.from({ length: needed }, () => ({
          subject,
          topic,
          difficulty: 'intermediate' as Difficulty,
          examType,
          questionType,
        }));
        if (!this.deepSeek.isAvailable()) {
          return [];
        }
        return this.questionService.generateFreshMockBatch(slots, 2);
      },
    });

    const combined: MockPoolItem[] = [
      ...available.map((q) => ({
        questionId: q.id,
        subject: q.subject as Subject,
        questionType: q.questionType,
        topic: q.topic,
      })),
      ...generated.map((q) => ({
        questionId: q.id,
        subject: q.subject as Subject,
        questionType: q.questionType,
        topic: q.topic,
      })),
    ];

    return combined.slice(0, count);
  }

  private async assignExamQuestions(
    examId: string,
    examType: 'Main' | 'Advanced' | 'NEET',
    items: MockPoolItem[],
    weakItems: MockPoolItem[] = [],
  ): Promise<void> {
    const subjects: Subject[] = examType === 'NEET' ? [...NEET_SUBJECTS] : ['Physics', 'Chemistry', 'Mathematics'];
    const bySubject = new Map<string, Array<{ item: MockPoolItem; sourceType: 'BASE' | 'WEAK_INJECTION' }>>();
    for (const s of subjects) bySubject.set(s, []);

    for (const item of items) {
      bySubject.get(item.subject)?.push({ item, sourceType: 'BASE' });
    }

    if (weakItems.length > 0) {
      const weakSubject = weakItems[0]!.subject;
      const list = bySubject.get(weakSubject);
      if (list && list.length >= weakItems.length) {
        const replaceIndices: number[] = [];
        for (let i = list.length - 1; i >= 0 && replaceIndices.length < weakItems.length; i--) {
          if (list[i]!.item.questionType === 'mcq_single') {
            replaceIndices.push(i);
          }
        }
        for (let i = list.length - 1; i >= 0 && replaceIndices.length < weakItems.length; i--) {
          if (!replaceIndices.includes(i)) {
            replaceIndices.push(i);
          }
        }
        for (let k = 0; k < replaceIndices.length && k < weakItems.length; k++) {
          const idx = replaceIndices[k]!;
          list[idx] = { item: weakItems[k]!, sourceType: 'WEAK_INJECTION' };
        }
      }
    }

    const questionData: Array<{
      examId: string;
      questionId: string;
      subject: string;
      questionNumber: number;
      subjectIndex: number;
      sourceType: 'BASE' | 'WEAK_INJECTION';
    }> = [];
    let gNum = 1;

    for (const subj of subjects) {
      const subjItems = fisherYatesShuffle(bySubject.get(subj) ?? []);
      let subjIdx = 0;
      for (const entry of subjItems) {
        questionData.push({
          examId,
          questionId: entry.item.questionId,
          subject: subj,
          questionNumber: gNum++,
          subjectIndex: subjIdx++,
          sourceType: entry.sourceType,
        });
      }
    }

    await this.mockRepo.assignQuestionsAndMarkReady(examId, questionData);
  }

  private buildLadderTopicPlan(
    examType: 'Main' | 'Advanced' | 'NEET',
    paperNumber: number,
  ): Record<string, string[]> {
    const subjects: Subject[] = examType === 'NEET' ? [...NEET_SUBJECTS] : ['Physics', 'Chemistry', 'Mathematics'];
    const count = this.expectedPerSubject(examType);
    const topicsBySubject: Record<string, string[]> = {};

    for (const subject of subjects) {
      const topicList = fullTopicList(examType, subject);
      if (topicList.length === 0) {
        topicsBySubject[subject] = [];
        continue;
      }
      const offset = ((paperNumber - 1) * 10) % topicList.length;
      const rotated = [...topicList.slice(offset), ...topicList.slice(0, offset)];
      const questionTopics: string[] = [];
      for (let i = 0; i < count; i++) {
        questionTopics.push(rotated[i % rotated.length]!);
      }
      topicsBySubject[subject] = questionTopics;
    }
    return topicsBySubject;
  }

  public async runMockGeneration(
    examId: string,
    userId: string,
    examType: 'Main' | 'Advanced' | 'NEET',
    difficultyMode: 'easy' | 'medium' | 'hard',
    paperNumber?: number,
  ): Promise<void> {
    try {
      await this.runDynamicMockGeneration(examId, userId, examType, difficultyMode, paperNumber);
    } catch (err) {
      logger.warn({ examId, err: err instanceof Error ? err.message : String(err) }, '[mockPool] Paper generation failed');
      await this.mockRepo.markError(examId).catch(() => {});
    }
  }

  private async runDynamicMockGeneration(
    examId: string,
    userId: string,
    examType: 'Main' | 'Advanced' | 'NEET',
    difficultyMode: 'easy' | 'medium' | 'hard',
    paperNumber?: number,
  ): Promise<void> {
    const completedMocks = await this.mockRepo.countSubmittedForUser(userId, examType);
    const resolvedPaperNumber = paperNumber ?? ((completedMocks % 50) + 1);
    const planKey = `ladder:paper:${resolvedPaperNumber}`;
    const topicsBySubject = this.buildLadderTopicPlan(examType, resolvedPaperNumber);
    const expectedTotal = (examType === 'NEET' ? NEET_SUBJECTS.length : 3) * this.expectedPerSubject(examType);

    const reuse = () =>
      this.mockData.findStoredPaper(
        examType,
        planKey,
        (items) => items.length === expectedTotal,
      );

    let poolItems = await reuse();
    if (poolItems) {
      logger.info({ examId, examType, paperNumber: resolvedPaperNumber, planKey }, '[mockPool] Reused shared global ladder paper');
    } else {
      logger.info({ examId, examType, paperNumber: resolvedPaperNumber, planKey }, '[mockPool] Generating fresh shared global ladder paper');
      poolItems = await runOnce<MockPoolItem[]>(`mockpaper:gen:${examType}:${planKey}`, {
        lockSeconds: MOCK_CONSTANTS.LOCK_SECONDS,
        waitMs: MOCK_CONSTANTS.LOCK_WAIT_MS,
        readShared: reuse,
        produce: async () => {
          const stored = await reuse();
          if (stored) return stored;
          const fresh = await this.generateFreshPaper(examType, difficultyMode, topicsBySubject, new Set());
          try {
            await this.mockData.saveStoredPaper(examType, difficultyMode, fresh, planKey);
          } catch (saveErr) {
            logger.warn(
              { examId, err: saveErr instanceof Error ? saveErr.message : String(saveErr) },
              '[mockPool] Paper storage failed; exam proceeds but later students will not benefit from this paper',
            );
          }
          return fresh;
        },
      });
    }

    if (poolItems.length < 10) {
      await this.mockRepo.markError(examId);
      return;
    }

    // 90/10 Hybrid: If student has completed previous mocks, inject 5 questions on their weakest topic
    let weakItems: MockPoolItem[] = [];
    if (completedMocks > 0) {
      try {
        const subjects: Subject[] = examType === 'NEET' ? [...NEET_SUBJECTS] : ['Physics', 'Chemistry', 'Mathematics'];
        let topWeak = await this.topicRepo.getTopWeakTopicForStudent(userId);
        if (topWeak?.topic && !subjects.includes(topWeak.topic.subject as Subject)) {
          for (const s of subjects) {
            topWeak = await this.topicRepo.getTopWeakTopicForStudent(userId, s);
            if (topWeak) break;
          }
        }

        if (topWeak?.topic && subjects.includes(topWeak.topic.subject as Subject)) {
          const weakSubject = topWeak.topic.subject as Subject;
          weakItems = await this.getOrGenerateWeakQuestions(
            userId,
            examType,
            weakSubject,
            topWeak.topic.name,
            topWeak.topic.id,
            5,
          );
          if (weakItems.length > 0) {
            logger.info(
              { examId, userId, topic: topWeak.topic.name, count: weakItems.length },
              '[mockPool] Injected targeted weak-topic questions into mock exam',
            );
          }
        }
      } catch (weakErr) {
        logger.warn(
          { examId, err: weakErr instanceof Error ? weakErr.message : String(weakErr) },
          '[mockPool] Weak topic injection skipped; exam proceeds with base paper',
        );
      }
    }

    await this.assignExamQuestions(examId, examType, poolItems, weakItems);
  }

  public async getOrGenerateQuestionExplanation(q: {
    id: string;
    questionText: string;
    options: string[];
    answer: string;
    questionType: string;
    subject: string;
    topic: string;
    explanation: string;
  }): Promise<string> {
    if (q.explanation) return q.explanation;

    try {
      return await runOnce<string>(`explain:${q.id}`, {
        lockSeconds: 60,
        waitMs: 60_000,
        readShared: async () => {
          const fresh = await this.questionRepo.findByIdForExplanation(q.id);
          return fresh?.explanation ? fresh.explanation : null;
        },
        produce: async () => {
          const existing = await this.questionRepo.findByIdForExplanation(q.id);
          if (existing?.explanation) return existing.explanation;
          const text = await this.deepSeek.generateExplanation({
            questionText: q.questionText,
            options: q.options,
            answer: q.answer,
            questionType: q.questionType,
            subject: q.subject,
            topic: q.topic,
          });
          await this.questionRepo.updateExplanation(q.id, text);
          return text;
        },
      });
    } catch {
      return 'Explanation is temporarily unavailable. Please try again in a few minutes.';
    }
  }
}

export const mockGeneratorService = new MockGeneratorService();
