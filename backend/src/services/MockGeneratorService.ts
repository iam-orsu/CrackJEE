import { createHash } from 'crypto';
import { MOCK_CONSTANTS } from '../config/constants';
import { MockExamRepository, type MockPoolItem } from '../repositories/MockExamRepository';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { QuestionService } from './QuestionService';
import { DeepSeekService, deepSeekService as defaultDeepSeek } from './DeepSeekService';
import { MockDataService, type SubjectHistory } from './MockDataService';
import { fillSlotsFromBank, slotKey, type SlotKey } from './mockBankFill';
import { planSubjectTopics, fullTopicList, paperFitsPlan } from './mockTopicPlan';
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
    logger.info({ fromBank: fromBank.length, generate: missingSlots.length }, '[mockPool] Paper slots filled from the bank');

    let practiceBackfill: PaperQuestion[] = [];
    if (missingSlots.length > 0 && !this.deepSeek.isAvailable()) {
      const usedIds = new Set([...seen, ...fromBank.map((q) => q.id)]);
      const slotPicks = await this.questionService.fillMockSlotsFromPracticeBank(missingSlots, usedIds);
      practiceBackfill = slotPicks.flatMap((q) => (q ? [{
        id: q.id,
        subject: q.subject,
        topic: q.topic,
        questionType: q.questionType,
      }] : []));
      missingSlots = missingSlots.filter((_, i) => slotPicks[i] === null);
      logger.info({ fromPracticeBank: practiceBackfill.length, stillMissing: missingSlots.length }, '[mockPool] Practice bank fallback filled slots');
    }

    const canGenerateWithAi = this.deepSeek.isAvailable();
    const generated: PaperQuestion[] = missingSlots.length > 0 && canGenerateWithAi
      ? await this.questionService.generateFreshMockBatch(missingSlots, 4)
      : [];
    let questions: PaperQuestion[] = [...fromBank, ...practiceBackfill, ...generated];

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

        logger.info({ round: round + 1, slots: topUpSlots.length }, '[mockPool] Top-up: generating replacements for short subjects');
        const extras = await this.questionService.generateFreshMockBatch(topUpSlots, 4);
        questions = [...questions, ...extras];
      }
    }

    const subjectsNeeded: string[] = examType === 'NEET' ? [...NEET_SUBJECTS] : ['Physics', 'Chemistry', 'Mathematics'];
    const shortSubjects = subjectsNeeded.filter(
      (subject) => questions.filter((q) => q.subject === subject).length < expected,
    );
    if (shortSubjects.length > 0) {
      const deficitSlots: SlotInput[] = [];
      for (const subject of shortSubjects) {
        const have = questions.filter((q) => q.subject === subject).length;
        const needed = expected - have;
        const subjectSlots = slots.filter((s) => s.subject === subject);
        for (let i = 0; i < needed && i < subjectSlots.length; i++) {
          deficitSlots.push(subjectSlots[i]!);
        }
      }
      if (deficitSlots.length > 0) {
        const usedIds = new Set([...seen, ...questions.map((q) => q.id)]);
        const fallbackPicks = await this.questionService.fillMockSlotsFromPracticeBank(deficitSlots, usedIds);
        const fallbackQs: PaperQuestion[] = fallbackPicks.flatMap((q) => (q ? [{
          id: q.id,
          subject: q.subject,
          topic: q.topic,
          questionType: q.questionType,
        }] : []));
        questions = [...questions, ...fallbackQs];
        logger.info({ filled: fallbackQs.length }, '[mockPool] Post-AI practice bank fallback filled remaining slots');
      }
    }

    for (const subject of subjectsNeeded) {
      const count = questions.filter((q) => q.subject === subject).length;
      if (count < expected) {
        throw new Error(`Paper incomplete: ${subject} has ${count} of ${expected} questions`);
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

  private async assignExamQuestions(
    examId: string,
    examType: 'Main' | 'Advanced' | 'NEET',
    items: MockPoolItem[],
  ): Promise<void> {
    const subjects: Subject[] = examType === 'NEET' ? [...NEET_SUBJECTS] : ['Physics', 'Chemistry', 'Mathematics'];
    const bySubject = new Map<string, MockPoolItem[]>();
    for (const s of subjects) bySubject.set(s, []);
    for (const item of items) bySubject.get(item.subject)?.push(item);

    const questionData: Array<{
      examId: string;
      questionId: string;
      subject: string;
      questionNumber: number;
      subjectIndex: number;
    }> = [];
    let gNum = 1;

    for (const subj of subjects) {
      const subjItems = fisherYatesShuffle(bySubject.get(subj) ?? []);
      let subjIdx = 0;
      for (const item of subjItems) {
        questionData.push({
          examId,
          questionId: item.questionId,
          subject: subj,
          questionNumber: gNum++,
          subjectIndex: subjIdx++,
        });
      }
    }

    await this.mockRepo.assignQuestionsAndMarkReady(examId, questionData);
  }

  private planMockTopics(
    examType: 'Main' | 'Advanced' | 'NEET',
    history: Record<string, SubjectHistory>,
  ) {
    const subjects: string[] = examType === 'NEET' ? [...NEET_SUBJECTS] : ['Physics', 'Chemistry', 'Mathematics'];
    const count = this.expectedPerSubject(examType);
    const topicsBySubject: Record<string, string[]> = {};
    const fit: Record<string, { planned: Set<string> }> = {};

    for (const subject of subjects) {
      const past = history[subject] ?? { covered: new Set<string>(), weakTopic: null };
      const subjectPlan = planSubjectTopics(fullTopicList(examType, subject), past.covered, past.weakTopic, count);
      topicsBySubject[subject] = subjectPlan.questionTopics;
      fit[subject] = { planned: new Set(subjectPlan.questionTopics) };
    }
    return { topicsBySubject, fit };
  }

  public async runMockGeneration(
    examId: string,
    userId: string,
    examType: 'Main' | 'Advanced' | 'NEET',
    difficultyMode: 'easy' | 'medium' | 'hard',
  ): Promise<void> {
    try {
      const history = await this.mockData.loadTopicHistory(userId, examType);
      const seen = await this.mockData.loadSeenQuestionIds(userId, examType);
      const plan = this.planMockTopics(examType, history);
      const expectedTotal = (examType === 'NEET' ? NEET_SUBJECTS.length : 3) * this.expectedPerSubject(examType);
      const planKey = createHash('sha256')
        .update(JSON.stringify(plan.topicsBySubject))
        .digest('hex')
        .slice(0, 16);

      const reuse = () =>
        this.mockData.findStoredPaper(
          examType,
          difficultyMode,
          planKey,
          (items) => items.length === expectedTotal && paperFitsPlan(items, plan.fit),
        );

      let poolItems = await reuse();
      if (poolItems) {
        logger.info({ examId, examType, difficultyMode, planKey }, '[mockPool] Reused stored paper (fast path)');
      } else {
        logger.info({ examId, examType, difficultyMode, planKey }, '[mockPool] No stored paper found; generating fresh');
        poolItems = await runOnce<MockPoolItem[]>(`mockpaper:gen:${examType}:${difficultyMode}:${planKey}`, {
          lockSeconds: MOCK_CONSTANTS.LOCK_SECONDS,
          waitMs: MOCK_CONSTANTS.LOCK_WAIT_MS,
          readShared: reuse,
          produce: async () => {
            const stored = await reuse();
            if (stored) return stored;
            const fresh = await this.generateFreshPaper(examType, difficultyMode, plan.topicsBySubject, seen);
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

      await this.assignExamQuestions(examId, examType, poolItems);
    } catch (err) {
      logger.warn({ examId, err: err instanceof Error ? err.message : String(err) }, '[mockPool] Paper generation failed');
      await this.mockRepo.markError(examId).catch(() => {});
    }
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
