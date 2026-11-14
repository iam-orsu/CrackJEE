import { CACHE_CONSTANTS } from '../config/constants';
import { AttemptRepository } from '../repositories/AttemptRepository';
import { MockExamRepository } from '../repositories/MockExamRepository';
import { ProgressRepository, type GlobalLeaderboardRow } from '../repositories/ProgressRepository';
import { TopicRepository } from '../repositories/TopicRepository';
import { CacheService, cacheService as defaultCache } from './CacheService';
import { MockDataService } from './MockDataService';
import {
  topicStats,
  strongAndWeak,
  topMarksLost,
  monthlyTrend,
  projection,
  negativeAnalysis,
  timeByType,
  subjectOrder,
  platformStanding,
  cutoffComparison,
  carelessAnalysis,
  guessingAnalysis,
  practiceTomorrow,
} from './mockInsights';
import { cutoffsFor } from './examCutoffs';
import { istDateKey } from '../utils/dateIst';

const MIN_STANDING_STUDENTS = 10;
const MOCK_WEAK_AREA_EXAMS = 30;
const OVERALL_CACHE_KEY = 'overall:global';
const LEADERBOARD_CACHE_KEY = 'leaderboard:global';

interface MockAnswer {
  subject: string;
  topic: string;
  correct: boolean;
  at: Date;
}

type SerializedMockAnswer = Omit<MockAnswer, 'at'> & { at: string };

export class ProgressService {
  constructor(
    private readonly attempts: AttemptRepository = new AttemptRepository(),
    private readonly mocks: MockExamRepository = new MockExamRepository(),
    private readonly progressRepo: ProgressRepository = new ProgressRepository(),
    private readonly cache: CacheService = defaultCache,
    private readonly mockData: MockDataService = new MockDataService(),
    private readonly topicRepo: TopicRepository = new TopicRepository(),
  ) {}

  public async getNormalizedWeakTopics(userId: string) {
    const masteries = await this.topicRepo.getStudentMasteries(userId);
    return masteries.map((m) => ({
      topicId: m.topicId,
      name: m.topic.name,
      subject: m.topic.subject,
      classLevel: m.topic.classLevel,
      attemptsCount: m.attemptsCount,
      correctCount: m.correctCount,
      accuracyPct: m.accuracyPct,
      marksLostTotal: m.marksLostTotal,
      isWeak: m.isWeak,
      lastTestedAt: m.lastTestedAt,
    }));
  }

  private async getMockAnswers(userId: string): Promise<MockAnswer[]> {
    const cacheKey = `mock-answers:${userId}`;
    const cached = await this.cache.getJson<SerializedMockAnswer[]>(cacheKey);
    if (cached) return cached.map((a) => ({ ...a, at: new Date(a.at) }));

    const exams = await this.mocks.findSubmittedForInsights(userId, MOCK_WEAK_AREA_EXAMS);
    const answers: MockAnswer[] = [];

    for (const exam of exams) {
      if (!exam.result) continue;
      const breakdown = exam.result.scoreBreakdown as Record<string, { awarded: number; submitted: string | null }>;
      const at = exam.submittedAt ?? exam.createdAt;
      for (const mq of exam.questions) {
        const bd = breakdown[mq.id];
        if (!bd || bd.submitted === null) continue;
        answers.push({
          subject: mq.question.subject,
          topic: mq.question.topic,
          correct: bd.awarded > 0,
          at,
        });
      }
    }

    await this.cache.setJson(cacheKey, answers, CACHE_CONSTANTS.MOCK_ANSWERS_TTL_SECONDS);
    return answers;
  }

  private async getMockHistory(userId: string): Promise<Array<{ date: string; pct: number }>> {
    const rows = await this.mocks.findRecentSubmittedResults(userId, 10);
    return rows.reverse().map((r) => ({
      date: (r.exam.submittedAt ?? r.exam.createdAt).toISOString(),
      pct: r.maxScore > 0 ? Math.round((r.totalScore / r.maxScore) * 100) : 0,
    }));
  }

  private async getOverallMockStats(userId: string) {
    let globalStats = await this.cache.getJson<{ platformAvg: number | null; topAvg: number | null }>(OVERALL_CACHE_KEY);
    if (!globalStats) {
      globalStats = await this.progressRepo.getGlobalOverallMockStats();
      await this.cache.setJson(OVERALL_CACHE_KEY, globalStats, CACHE_CONSTANTS.LEADERBOARD_TTL_SECONDS);
    }

    const userCacheKey = `overall:user:${userId}`;
    const cachedUser = await this.cache.getJson<{ mine: number | null; examType: string | null }>(userCacheKey);
    const userStats = cachedUser ?? await (async () => {
      const [mine, latest] = await Promise.all([
        this.progressRepo.getUserOverallMockAvg(userId),
        this.mocks.findLatestSubmittedExamType(userId),
      ]);
      const result = { mine, examType: latest?.examType ?? null };
      await this.cache.setJson(userCacheKey, result, CACHE_CONSTANTS.OVERALL_USER_TTL_SECONDS);
      return result;
    })();

    return {
      mine: userStats.mine,
      platformAvg: globalStats.platformAvg,
      topAvg: globalStats.topAvg,
      examType: userStats.examType,
    };
  }

  public async getDashboard(userId: string) {
    const answers = await this.getMockAnswers(userId);
    const totalAttempts = answers.length;
    const correctAttempts = answers.filter((a) => a.correct).length;
    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

    const weeklyStats = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
      const dateStr = istDateKey(d);
      const dayAnswers = answers.filter((a) => istDateKey(a.at) === dateStr);
      return {
        date: dateStr,
        total: dayAnswers.length,
        correct: dayAnswers.filter((a) => a.correct).length,
      };
    });

    const [history, overall] = await Promise.all([
      this.getMockHistory(userId),
      this.getOverallMockStats(userId),
    ]);

    return {
      stats: { totalAttempts, correctAttempts, accuracy },
      weeklyStats,
      history,
      overall,
    };
  }

  public getWeakAreas(userId: string) {
    return this.attempts.findWeakAreasByUser(userId);
  }

  public getOverview(userId: string) {
    return this.attempts.findOverviewByUser(userId);
  }

  public async getMockWeakAreas(userId: string) {
    const answers = await this.getMockAnswers(userId);
    const topicMap = new Map<string, { subject: string; topic: string; correct: number; total: number }>();

    for (const a of answers) {
      const key = `${a.subject}::${a.topic}`;
      if (!topicMap.has(key)) topicMap.set(key, { subject: a.subject, topic: a.topic, correct: 0, total: 0 });
      const entry = topicMap.get(key)!;
      entry.total++;
      if (a.correct) entry.correct++;
    }

    return [...topicMap.values()]
      .filter((t) => t.total > 0 && t.correct / t.total < 0.6)
      .map((t) => ({
        subject: t.subject,
        topic: t.topic,
        attempts: t.total,
        correct: t.correct,
        successRate: Math.round((t.correct / t.total) * 100),
      }))
      .sort((a, b) => a.successRate - b.successRate);
  }

  public async getLeaderboard(userId: string) {
    let globalRows = await this.cache.getJson<GlobalLeaderboardRow[]>(LEADERBOARD_CACHE_KEY);
    if (!globalRows) {
      globalRows = await this.progressRepo.getGlobalLeaderboardRows();
      await this.cache.setJson(LEADERBOARD_CACHE_KEY, globalRows, CACHE_CONSTANTS.LEADERBOARD_TTL_SECONDS);
    }

    const myRows = await this.progressRepo.getUserLeaderboardRows(userId);
    const myByKey = new Map(myRows.map((r) => [`${r.examType}|${r.subject}`, r]));

    const result: Record<
      string,
      Record<string, { top: number; avg: number; topAvg: number | null; mine: number | null; best: number | null; count: number }>
    > = {};

    for (const row of globalRows) {
      const mineRow = myByKey.get(`${row.examType}|${row.subject}`);
      result[row.examType] ??= {};
      result[row.examType]![row.subject] = {
        top: row.top,
        avg: row.avg,
        topAvg: row.topAvg ?? null,
        mine: mineRow?.mine ?? null,
        best: mineRow?.best ?? null,
        count: row.count,
      };
    }

    return result;
  }

  public async getMockInsights(userId: string) {
    const { records, totals, examsAnalysed, latestExamType } = await this.mockData.loadStudentMockData(userId);
    const stats = topicStats(records);
    const { strong, weak } = strongAndWeak(stats);

    const cutoffs = latestExamType ? cutoffsFor(latestExamType) : null;
    const averages = latestExamType ? await this.mockData.loadPlatformAverages(latestExamType) : [];
    const mine = averages.find((a) => a.userId === userId)?.avgPct ?? null;
    const standing = mine !== null && averages.length >= MIN_STANDING_STUDENTS
      ? { available: true as const, mine, ...platformStanding(mine, averages.map((a) => a.avgPct)) }
      : { available: false as const, mine, students: averages.length, needed: MIN_STANDING_STUDENTS };

    return {
      examsAnalysed,
      examType: latestExamType,
      standing,
      cutoffs: cutoffs
        ? { name: cutoffs.name, sources: cutoffs.sources, lines: mine !== null ? cutoffComparison(mine, cutoffs.lines) : null }
        : null,
      strongTopics: strong,
      weakTopics: weak,
      reviseToday: weak,
      practiceTomorrow: practiceTomorrow(stats),
      marksLostTopics: topMarksLost(stats),
      monthly: monthlyTrend(totals),
      projection: projection(totals),
      negatives: negativeAnalysis(records),
      timeByType: timeByType(records),
      subjectOrder: subjectOrder(records),
      careless: carelessAnalysis(records),
      guessing: guessingAnalysis(records),
    };
  }
}
