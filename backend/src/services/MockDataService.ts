import { CACHE_CONSTANTS, MOCK_CONSTANTS } from '../config/constants';
import { MockExamRepository, type MockPoolItem } from '../repositories/MockExamRepository';
import { ProgressRepository } from '../repositories/ProgressRepository';
import { CacheService, cacheService as defaultCache } from './CacheService';
import { coveredAfterMock, fullTopicList, weakestTopic } from './mockTopicPlan';
import type { ExamTotal, QuestionRecord } from './mockInsights';
import { NEET_SUBJECTS } from '../types/index';

export interface SubjectHistory {
  covered: Set<string>;
  weakTopic: string | null;
}

export const INSIGHT_EXAMS = 30;

type BreakdownEntry = {
  awarded: number;
  maxMarks?: number;
  submitted: string | null;
  timeSpentSeconds?: number;
  questionType?: string;
};

type SerializedStudentMockData = {
  records: Array<Omit<QuestionRecord, 'at'> & { at: string }>;
  totals: Array<Omit<ExamTotal, 'at'> & { at: string }>;
  examsAnalysed: number;
  latestExamType: string | null;
};

export class MockDataService {
  constructor(
    private readonly mockRepo: MockExamRepository = new MockExamRepository(),
    private readonly progressRepo: ProgressRepository = new ProgressRepository(),
    private readonly cache: CacheService = defaultCache,
  ) {}

  private subjectsFor(examType: 'Main' | 'Advanced' | 'NEET'): readonly string[] {
    return examType === 'NEET' ? NEET_SUBJECTS : ['Physics', 'Chemistry', 'Mathematics'];
  }

  public async findStoredPaper(
    examType: string,
    difficultyMode: string,
    planKey: string,
    accept: (items: MockPoolItem[]) => boolean,
  ): Promise<MockPoolItem[] | null> {
    const exact = await this.mockRepo.findStoredPapersByPlanKey(examType, difficultyMode, planKey, 5);
    for (const candidate of exact) {
      const items = candidate.items as unknown as MockPoolItem[];
      if (items.length >= MOCK_CONSTANTS.MIN_PAPER_QUESTIONS && accept(items)) return items;
    }

    const recent = await this.mockRepo.findLegacyStoredPapers(examType, difficultyMode, 50);
    for (const candidate of recent) {
      const items = candidate.items as unknown as MockPoolItem[];
      if (items.length >= MOCK_CONSTANTS.MIN_PAPER_QUESTIONS && accept(items)) return items;
    }

    return null;
  }

  public async saveStoredPaper(
    examType: string,
    difficultyMode: string,
    items: MockPoolItem[],
    planKey: string,
  ): Promise<void> {
    if (items.length < MOCK_CONSTANTS.MIN_PAPER_QUESTIONS) {
      throw new Error('Generated paper is too short to store');
    }
    await this.mockRepo.saveStoredPaper(examType, difficultyMode, items, planKey);
  }

  public async loadTopicHistory(
    userId: string,
    examType: 'Main' | 'Advanced' | 'NEET',
  ): Promise<Record<string, SubjectHistory>> {
    const subjects = this.subjectsFor(examType);
    const result: Record<string, SubjectHistory> = {};
    for (const subject of subjects) result[subject] = { covered: new Set(), weakTopic: null };

    const latest = await this.mockRepo.findRecentForTopicHistory(userId, examType, 200);
    for (const mock of latest.reverse()) {
      for (const subject of subjects) {
        const topics = mock.questions
          .filter((mq) => mq.question.subject === subject)
          .map((mq) => mq.question.topic);
        result[subject]!.covered = coveredAfterMock(
          result[subject]!.covered,
          topics,
          fullTopicList(examType, subject),
        );
      }
    }

    const last = await this.mockRepo.findLastSubmittedForWeakTopic(userId, examType);
    if (last?.result) {
      const breakdown = last.result.scoreBreakdown as Record<string, { awarded: number; submitted: string | null }>;
      for (const subject of subjects) {
        const answers = last.questions
          .filter((mq) => mq.question.subject === subject)
          .flatMap((mq) => {
            const bd = breakdown[mq.id];
            if (!bd || bd.submitted === null) return [];
            return [{ topic: mq.question.topic, correct: bd.awarded > 0 }];
          });
        result[subject]!.weakTopic = weakestTopic(answers);
      }
    }

    return result;
  }

  public async loadSeenQuestionIds(
    userId: string,
    examType: 'Main' | 'Advanced' | 'NEET',
  ): Promise<Set<string>> {
    const rows = await this.mockRepo.findSeenQuestionIds(userId, examType);
    return new Set(rows.map((r) => r.questionId));
  }

  private recordsFromExams(
    exams: Array<{
      submittedAt: Date | null;
      createdAt: Date;
      questions: Array<{ id: string; question: { subject: string; topic: string } }>;
      result: { scoreBreakdown: unknown } | null;
    }>,
  ): QuestionRecord[] {
    const records: QuestionRecord[] = [];
    for (const exam of exams) {
      if (!exam.result) continue;
      const breakdown = exam.result.scoreBreakdown as Record<string, BreakdownEntry>;
      const at = exam.submittedAt ?? exam.createdAt;
      for (const mq of exam.questions) {
        const bd = breakdown[mq.id];
        records.push({
          subject: mq.question.subject,
          topic: mq.question.topic,
          questionType: bd?.questionType ?? 'mcq_single',
          answered: !!bd && bd.submitted !== null,
          awarded: bd?.awarded ?? 0,
          maxMarks: bd?.maxMarks ?? 4,
          timeSeconds: bd?.timeSpentSeconds ?? 0,
          at,
        });
      }
    }
    return records;
  }

  public async loadStudentMockData(userId: string): Promise<{
    records: QuestionRecord[];
    totals: ExamTotal[];
    examsAnalysed: number;
    latestExamType: string | null;
  }> {
    const cacheKey = `mock-data:${userId}`;
    const cached = await this.cache.getJson<SerializedStudentMockData>(cacheKey);
    if (cached) {
      return {
        ...cached,
        records: cached.records.map((r) => ({ ...r, at: new Date(r.at) })),
        totals: cached.totals.map((t) => ({ ...t, at: new Date(t.at) })),
      };
    }

    const exams = await this.mockRepo.findSubmittedForInsights(userId, INSIGHT_EXAMS);
    const totals: ExamTotal[] = [];
    for (const exam of exams) {
      if (!exam.result || exam.result.maxScore <= 0) continue;
      totals.push({
        at: exam.submittedAt ?? exam.createdAt,
        pct: Math.round((exam.result.totalScore / exam.result.maxScore) * 100),
      });
    }

    const result = {
      records: this.recordsFromExams(exams),
      totals,
      examsAnalysed: exams.length,
      latestExamType: exams[0]?.examType ?? null,
    };

    await this.cache.setJson(cacheKey, result, CACHE_CONSTANTS.STUDENT_MOCK_DATA_TTL_SECONDS);
    return result;
  }

  public async loadPlatformAverages(examType: string): Promise<Array<{ userId: string; avgPct: number }>> {
    const cacheKey = `platform-avg:${examType}`;
    const cached = await this.cache.getJson<Array<{ userId: string; avgPct: number }>>(cacheKey);
    if (cached) return cached;

    const averages = await this.progressRepo.getPlatformAveragesByExamType(examType);
    await this.cache.setJson(cacheKey, averages, CACHE_CONSTANTS.PLATFORM_AVERAGE_TTL_SECONDS);
    return averages;
  }

  public async loadExamMockData(
    userId: string,
    examId: string,
  ): Promise<{ records: QuestionRecord[]; examType: string; scorePct: number | null } | null> {
    const exam = await this.mockRepo.findSubmittedExamForInsights(examId, userId);
    if (!exam) return null;
    const scorePct = exam.result && exam.result.maxScore > 0
      ? Math.round((exam.result.totalScore / exam.result.maxScore) * 100)
      : null;
    return { records: this.recordsFromExams([exam]), examType: exam.examType, scorePct };
  }
}
