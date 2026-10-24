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

export async function dashboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const answers = await mockAnswers(req.user!.userId);

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

    // Accuracy per subject, from mock answers only
    const subjects = [...new Set(answers.map((a) => a.subject))];
    const subjectAccuracy = subjects.map((subject) => {
      const subjectAnswers = answers.filter((a) => a.subject === subject);
      const correct = subjectAnswers.filter((a) => a.correct).length;
      return {
        subject,
        accuracy: Math.round((correct / subjectAnswers.length) * 100),
        attempts: subjectAnswers.length,
      };
    });

    res.json({
      success: true,
      data: {
        stats: { totalAttempts, correctAttempts, accuracy },
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

type GlobalLeaderboardRow = { examType: string; subject: string; top: number; avg: number; count: number };
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
               COUNT(*)::int AS count
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

    const result: Record<string, Record<string, { top: number; avg: number; mine: number | null; best: number | null; count: number }>> = {};
    for (const row of globalRows) {
      const mineRow = myByKey.get(`${row.examType}|${row.subject}`);
      result[row.examType] ??= {};
      result[row.examType][row.subject] = {
        top: row.top,
        avg: row.avg,
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
