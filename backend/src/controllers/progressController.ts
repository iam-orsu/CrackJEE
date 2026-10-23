import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../types/index';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { cacheGetJson, cacheSetJson } from '../services/cacheService';

const MOCK_WEAK_AREA_EXAMS = 30;

// YYYY-MM-DD of an instant in India Standard Time (UTC+5:30, no DST)
function istDateKey(date: Date): string {
  return new Date(date.getTime() + 330 * 60 * 1000).toISOString().slice(0, 10);
}

export async function dashboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [totalAttempts, correctAttempts, weakAreas, recentAttempts, last7Days, allProgress] = await Promise.all([
      prisma.studentAttempt.count({ where: { userId } }),
      prisma.studentAttempt.count({ where: { userId, isCorrect: true } }),
      prisma.topicProgress.findMany({
        where: { userId, markedAsWeak: true },
        orderBy: { successRate: 'asc' },
        take: 6,
      }),
      prisma.studentAttempt.findMany({
        where: { userId },
        include: { question: { select: { topic: true, subject: true, difficulty: true } } },
        orderBy: { createdAt: 'desc' },
        take: 8,
      }),
      prisma.studentAttempt.findMany({
        where: { userId, createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true, isCorrect: true },
      }),
      prisma.topicProgress.findMany({ where: { userId }, take: 300 }),
    ]);

    // Build weekly stats: last 7 calendar days in IST, where the students are
    const weeklyStats = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
      const dateStr = istDateKey(d);
      const dayAttempts = last7Days.filter((a) => istDateKey(a.createdAt) === dateStr);
      return {
        date: dateStr,
        total: dayAttempts.length,
        correct: dayAttempts.filter((a) => a.isCorrect).length,
      };
    });

    // Subject accuracy — always include all 3 subjects even with zero attempts
    const subjectMap: Record<string, { correct: number; total: number }> = {};
    for (const p of allProgress) {
      if (!subjectMap[p.subject]) subjectMap[p.subject] = { correct: 0, total: 0 };
      subjectMap[p.subject].correct += p.correctCount;
      subjectMap[p.subject].total   += p.attempts;
    }
    const ALL_SUBJECTS = ['Physics', 'Mathematics', 'Chemistry', 'Botany', 'Zoology'];
    const subjectAccuracy = ALL_SUBJECTS.map((subject) => {
      const d = subjectMap[subject] ?? { correct: 0, total: 0 };
      return {
        subject,
        accuracy: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0,
        attempts: d.total,
      };
    });

    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

    res.json({
      success: true,
      data: {
        stats: { totalAttempts, correctAttempts, accuracy },
        weakAreas,
        recentActivity: recentAttempts,
        weeklyStats,
        subjectAccuracy,
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
    const userId = req.user!.userId;

    // Only the most recent submitted exams: the dashboard shows current weak areas, and the cost of this query
    // otherwise grows with every mock a student has ever taken (each one loads all its questions)
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

    const topicMap = new Map<string, { subject: string; topic: string; correct: number; total: number }>();

    for (const exam of exams) {
      if (!exam.result) continue;
      const breakdown = exam.result.scoreBreakdown as Record<string, { awarded: number; submitted: string | null }>;

      for (const mq of exam.questions) {
        const { topic, subject } = mq.question;
        const key = `${subject}::${topic}`;
        const bd = breakdown[mq.id];
        // Skipped questions say nothing about the student's ability, so they are not counted as misses
        if (!bd || bd.submitted === null) continue;

        if (!topicMap.has(key)) topicMap.set(key, { subject, topic, correct: 0, total: 0 });
        const entry = topicMap.get(key)!;
        entry.total++;
        if (bd.awarded > 0) entry.correct++;
      }
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

type GlobalLeaderboardRow = { examType: string; subject: string; top: number; avg: number; count: number };
type MyLeaderboardRow = { examType: string; subject: string; mine: number };

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
               COUNT(*)::int AS count
        FROM (${scoredRowsSql(null)}) p
        GROUP BY p."examType", p.subject
      `);
      await cacheSetJson(LEADERBOARD_CACHE_KEY, globalRows, LEADERBOARD_TTL_SECONDS);
    }

    // Only this student's rows — uses the MockExam.userId index
    const myRows = await prisma.$queryRaw<MyLeaderboardRow[]>(Prisma.sql`
      SELECT p."examType" AS "examType", p.subject AS subject, MAX(p.pct)::float8 AS mine
      FROM (${scoredRowsSql(userId)}) p
      GROUP BY p."examType", p.subject
    `);
    const myByKey = new Map(myRows.map((r) => [`${r.examType}|${r.subject}`, r.mine]));

    const result: Record<string, Record<string, { top: number; avg: number; mine: number | null; count: number }>> = {};
    for (const row of globalRows) {
      result[row.examType] ??= {};
      result[row.examType][row.subject] = {
        top: row.top,
        avg: row.avg,
        mine: myByKey.get(`${row.examType}|${row.subject}`) ?? null,
        count: row.count,
      };
    }

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
