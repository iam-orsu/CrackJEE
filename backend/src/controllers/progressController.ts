import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../types/index';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { cacheGetJson, cacheSetJson } from '../services/cacheService';
import {
  topicStats,
  strongAndWeak,
  topMarksLost,
  monthlyTrend,
  projection,
  negativeAnalysis,
  timeByType,
  subjectOrder,
} from '../services/mockInsights';
import { platformStanding, cutoffComparison } from '../services/mockInsights';
import { loadStudentMockData, loadPlatformAverages } from '../services/mockInsightsData';
import { cutoffsFor } from '../services/examCutoffs';

// The platform standing is only shown once enough students have mocks of this exam type to mean something
const MIN_STANDING_STUDENTS = 10;

const MOCK_WEAK_AREA_EXAMS = 30;

// YYYY-MM-DD of an instant in India Standard Time (UTC+5:30, no DST)
function istDateKey(date: Date): string {
  return new Date(date.getTime() + 330 * 60 * 1000).toISOString().slice(0, 10);
}

interface MockAnswer {
  subject: string;
  topic: string;
  correct: boolean;
  at: Date;
}

// Every answered question in the student's submitted Mock Test exams, newest exams first.
// Practice attempts are never read here: the dashboard and lagging topics are mock-only.
async function mockAnswers(userId: string): Promise<MockAnswer[]> {
  // Only the most recent exams: the cost of this query otherwise grows with every mock a student has taken
  const exams = await prisma.mockExam.findMany({
    where: { userId, status: 'submitted' },
    orderBy: { createdAt: 'desc' },
    take: MOCK_WEAK_AREA_EXAMS,
    include: {
      questions: {
        include: { question: { select: { topic: true, subject: true } } },
      },
      result: { select: { scoreBreakdown: true } },
    },
  });

  const answers: MockAnswer[] = [];
  for (const exam of exams) {
    if (!exam.result) continue;
    const breakdown = exam.result.scoreBreakdown as Record<string, { awarded: number; submitted: string | null }>;
    const at = exam.submittedAt ?? exam.createdAt;
    for (const mq of exam.questions) {
      const bd = breakdown[mq.id];
      // Skipped questions say nothing about the student's ability, so they are not counted
      if (!bd || bd.submitted === null) continue;
      answers.push({
        subject: mq.question.subject,
        topic: mq.question.topic,
        correct: bd.awarded > 0,
        at,
      });
    }
  }
  return answers;
}

// The student's last 10 submitted mocks, oldest first, as overall percentages
async function mockHistory(userId: string): Promise<Array<{ date: string; pct: number }>> {
  const rows = await prisma.mockExamResult.findMany({
    where: { exam: { userId, status: 'submitted' }, maxScore: { gt: 0 } },
    orderBy: { exam: { submittedAt: 'desc' } },
    take: 10,
    select: { totalScore: true, maxScore: true, exam: { select: { submittedAt: true, createdAt: true } } },
  });
  return rows.reverse().map((r) => ({
    date: (r.exam.submittedAt ?? r.exam.createdAt).toISOString(),
    pct: Math.round((r.totalScore / r.maxScore) * 100),
  }));
}

// Overall mock averages: mine, the platform average, and the highest student average. Platform figures are cached.
const OVERALL_CACHE_KEY = 'overall:global';
async function overallMockStats(userId: string): Promise<{ mine: number | null; platformAvg: number | null; topAvg: number | null; examType: string | null }> {
  let globalStats = await cacheGetJson<{ platformAvg: number | null; topAvg: number | null }>(OVERALL_CACHE_KEY);
  if (!globalStats) {
    const rows = await prisma.$queryRaw<Array<{ avg: number | null; top: number | null }>>(Prisma.sql`
      WITH per_exam AS (
        SELECT e."userId" AS "userId", r."totalScore" * 100.0 / r."maxScore" AS pct
        FROM "MockExamResult" r JOIN "MockExam" e ON e.id = r."examId"
        WHERE e.status = 'submitted' AND r."maxScore" > 0
      )
      SELECT (SELECT FLOOR(AVG(pct) + 0.5)::float8 FROM per_exam) AS avg,
             (SELECT FLOOR(MAX(ua) + 0.5)::float8 FROM (SELECT AVG(pct) AS ua FROM per_exam GROUP BY "userId") t) AS top
    `);
    globalStats = { platformAvg: rows[0]?.avg ?? null, topAvg: rows[0]?.top ?? null };
    await cacheSetJson(OVERALL_CACHE_KEY, globalStats, LEADERBOARD_TTL_SECONDS);
  }

  const mineRows = await prisma.$queryRaw<Array<{ mine: number | null }>>(Prisma.sql`
    SELECT FLOOR(AVG(r."totalScore" * 100.0 / r."maxScore") + 0.5)::float8 AS mine
    FROM "MockExamResult" r JOIN "MockExam" e ON e.id = r."examId"
    WHERE e.status = 'submitted' AND r."maxScore" > 0 AND e."userId" = ${userId}
  `);
  // Subject cards follow the exam the student actually sits, which may differ from their profile's target
  const latest = await prisma.mockExam.findFirst({
    where: { userId, status: 'submitted' },
    orderBy: { submittedAt: 'desc' },
    select: { examType: true },
  });
  return {
    mine: mineRows[0]?.mine ?? null,
    platformAvg: globalStats.platformAvg,
    topAvg: globalStats.topAvg,
    examType: latest?.examType ?? null,
  };
}

export async function dashboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const answers = await mockAnswers(userId);

    const totalAttempts = answers.length;
    const correctAttempts = answers.filter((a) => a.correct).length;
    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

    // Last 7 calendar days in IST, counting questions by the day their mock was submitted
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

    const [history, overall] = await Promise.all([mockHistory(userId), overallMockStats(userId)]);

    res.json({
      success: true,
      data: {
        stats: { totalAttempts, correctAttempts, accuracy },
        weeklyStats,
        history,
        overall,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function weakAreas(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const areas = await prisma.topicProgress.findMany({
      where: { userId: req.user!.userId, markedAsWeak: true },
      orderBy: { successRate: 'asc' },
    });
    res.json({ success: true, data: areas });
  } catch (err) {
    next(err);
  }
}

export async function overview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const progress = await prisma.topicProgress.findMany({
      where: { userId: req.user!.userId },
      orderBy: [{ subject: 'asc' }, { successRate: 'asc' }],
    });
    res.json({ success: true, data: progress });
  } catch (err) {
    next(err);
  }
}

export async function mockWeakAreas(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const answers = await mockAnswers(req.user!.userId);

    const topicMap = new Map<string, { subject: string; topic: string; correct: number; total: number }>();
    for (const a of answers) {
      const key = `${a.subject}::${a.topic}`;
      if (!topicMap.has(key)) topicMap.set(key, { subject: a.subject, topic: a.topic, correct: 0, total: 0 });
      const entry = topicMap.get(key)!;
      entry.total++;
      if (a.correct) entry.correct++;
    }

    const weak = [...topicMap.values()]
      .filter((t) => t.total > 0 && t.correct / t.total < 0.6)
      .map((t) => ({
        subject: t.subject,
        topic: t.topic,
        attempts: t.total,
        correct: t.correct,
        successRate: Math.round((t.correct / t.total) * 100),
      }))
      .sort((a, b) => a.successRate - b.successRate);

    res.json({ success: true, data: weak });
  } catch (err) {
    next(err);
  }
}

const LEADERBOARD_CACHE_KEY = 'leaderboard:global';
const LEADERBOARD_TTL_SECONDS = 60;

type GlobalLeaderboardRow = { examType: string; subject: string; top: number; avg: number; topAvg: number | null; count: number };
type MyLeaderboardRow = { examType: string; subject: string; best: number; mine: number };

/**
 * One row per (mock result, subject) with the percentage already computed in SQL.
 * Same rules as before: NEET max is 180/180/360; JEE max is maxScore/3 (100 if unknown).
 * Pass a userId to restrict to one student's exams.
 */
function scoredRowsSql(userId: string | null): Prisma.Sql {
  const userFilter = userId ? Prisma.sql`WHERE e."userId" = ${userId}` : Prisma.empty;
  const jeeMax = Prisma.sql`CASE WHEN r."maxScore" > 0 THEN ROUND(r."maxScore" / 3.0) ELSE 100 END`;
  return Prisma.sql`
    WITH parts AS (
      SELECT e."examType" AS "examType", e."userId" AS "userId", 'Physics' AS subject,
             r."physicsScore"::float8 AS score,
             (CASE WHEN e."examType" = 'NEET' THEN 180 ELSE ${jeeMax} END)::float8 AS max
      FROM "MockExamResult" r JOIN "MockExam" e ON e.id = r."examId" ${userFilter}
      UNION ALL
      SELECT e."examType", e."userId", 'Chemistry', r."chemistryScore"::float8,
             (CASE WHEN e."examType" = 'NEET' THEN 180 ELSE ${jeeMax} END)::float8
      FROM "MockExamResult" r JOIN "MockExam" e ON e.id = r."examId" ${userFilter}
      UNION ALL
      SELECT e."examType", e."userId",
             CASE WHEN e."examType" = 'NEET' THEN 'Biology' ELSE 'Mathematics' END,
             (CASE WHEN e."examType" = 'NEET' THEN r."biologyScore" ELSE r."mathScore" END)::float8,
             (CASE WHEN e."examType" = 'NEET' THEN 360 ELSE ${jeeMax} END)::float8
      FROM "MockExamResult" r JOIN "MockExam" e ON e.id = r."examId" ${userFilter}
    )
    SELECT "examType", subject, "userId",
           CASE WHEN max > 0 THEN FLOOR(score / max * 100 + 0.5) ELSE 0 END AS pct
    FROM parts
  `;
}

export async function leaderboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;

    // Global stats are the same for every student, so cache them briefly
    let globalRows = await cacheGetJson<GlobalLeaderboardRow[]>(LEADERBOARD_CACHE_KEY);
    if (!globalRows) {
      globalRows = await prisma.$queryRaw<GlobalLeaderboardRow[]>(Prisma.sql`
        SELECT p."examType" AS "examType", p.subject AS subject,
               MAX(p.pct)::float8 AS top,
               FLOOR(AVG(p.pct) + 0.5)::float8 AS avg,
               COUNT(*)::int AS count,
               -- Highest per-student average in this subject (each student's mocks averaged first)
               (SELECT FLOOR(MAX(u.ua) + 0.5)::float8
                FROM (SELECT AVG(q.pct) AS ua
                      FROM (${scoredRowsSql(null)}) q
                      WHERE q."examType" = p."examType" AND q.subject = p.subject
                      GROUP BY q."userId") u) AS "topAvg"
        FROM (${scoredRowsSql(null)}) p
        GROUP BY p."examType", p.subject
      `);
      await cacheSetJson(LEADERBOARD_CACHE_KEY, globalRows, LEADERBOARD_TTL_SECONDS);
    }

    // Only this student's rows — uses the MockExam.userId index
    const myRows = await prisma.$queryRaw<MyLeaderboardRow[]>(Prisma.sql`
      SELECT p."examType" AS "examType", p.subject AS subject,
             MAX(p.pct)::float8 AS best,
             FLOOR(AVG(p.pct) + 0.5)::float8 AS mine
      FROM (${scoredRowsSql(userId)}) p
      GROUP BY p."examType", p.subject
    `);
    const myByKey = new Map(myRows.map((r) => [`${r.examType}|${r.subject}`, r]));

    const result: Record<string, Record<string, { top: number; avg: number; topAvg: number | null; mine: number | null; best: number | null; count: number }>> = {};
    for (const row of globalRows) {
      const mineRow = myByKey.get(`${row.examType}|${row.subject}`);
      result[row.examType] ??= {};
      result[row.examType][row.subject] = {
        top: row.top,
        avg: row.avg,
        topAvg: row.topAvg ?? null,
        mine: mineRow?.mine ?? null,
        best: mineRow?.best ?? null,
        count: row.count,
      };
    }

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

// GET /api/stats/mock-insights — analytics across the student's recent submitted mocks (mock-only data)
export async function mockInsights(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { records, totals, examsAnalysed, latestExamType } = await loadStudentMockData(userId);
    const stats = topicStats(records);
    const { strong, weak } = strongAndWeak(stats);

    // Standing and cutoffs follow the exam the student sits most recently
    const cutoffs = latestExamType ? cutoffsFor(latestExamType) : null;
    const averages = latestExamType ? await loadPlatformAverages(latestExamType) : [];
    const mine = averages.find((a) => a.userId === userId)?.avgPct ?? null;
    const standing = mine !== null && averages.length >= MIN_STANDING_STUDENTS
      ? { available: true as const, mine, ...platformStanding(mine, averages.map((a) => a.avgPct)) }
      : { available: false as const, mine, students: averages.length, needed: MIN_STANDING_STUDENTS };

    res.json({
      success: true,
      data: {
        examsAnalysed,
        examType: latestExamType,
        standing,
        cutoffs: cutoffs
          ? { name: cutoffs.name, sources: cutoffs.sources, lines: mine !== null ? cutoffComparison(mine, cutoffs.lines) : null }
          : null,
        strongTopics: strong,
        weakTopics: weak,
        // Revise today: the weakest topics; practise tomorrow uses the same list
        reviseToday: weak,
        marksLostTopics: topMarksLost(stats),
        monthly: monthlyTrend(totals),
        projection: projection(totals),
        negatives: negativeAnalysis(records),
        timeByType: timeByType(records),
        subjectOrder: subjectOrder(records),
      },
    });
  } catch (err) {
    next(err);
  }
}
