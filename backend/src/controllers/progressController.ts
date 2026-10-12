import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../types/index';
import { prisma } from '../lib/prisma';

export async function dashboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [totalAttempts, correctAttempts, weakAreas, last7Days, allProgress, allAttemptDates] = await Promise.all([
      prisma.studentAttempt.count({ where: { userId } }),
      prisma.studentAttempt.count({ where: { userId, isCorrect: true } }),
      prisma.topicProgress.findMany({
        where: { userId, markedAsWeak: true },
        orderBy: { successRate: 'asc' },
        take: 6,
      }),
      prisma.studentAttempt.findMany({
        where: { userId, createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true, isCorrect: true },
      }),
      prisma.topicProgress.findMany({ where: { userId } }),
      prisma.studentAttempt.findMany({
        where: { userId },
        select: { createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Build weekly stats: last 7 calendar days
    const weeklyStats = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().slice(0, 10);
      const dayAttempts = last7Days.filter((a) => a.createdAt.toISOString().startsWith(dateStr));
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
    const ALL_SUBJECTS = ['Physics', 'Mathematics', 'Chemistry'];
    const subjectAccuracy = ALL_SUBJECTS.map((subject) => {
      const d = subjectMap[subject] ?? { correct: 0, total: 0 };
      return {
        subject,
        accuracy: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0,
        attempts: d.total,
      };
    });

    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

    // Streak: count consecutive days (UTC) ending today or yesterday
    const dateSet = new Set(allAttemptDates.map((a) => a.createdAt.toISOString().slice(0, 10)));
    const streak = (() => {
      if (!dateSet.size) return 0;
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const todayStr = today.toISOString().slice(0, 10);
      const yday = new Date(today);
      yday.setUTCDate(yday.getUTCDate() - 1);
      const ydayStr = yday.toISOString().slice(0, 10);
      const cursor = new Date(dateSet.has(todayStr) ? today : dateSet.has(ydayStr) ? yday : new Date(0));
      if (cursor.getFullYear() < 2000) return 0;
      let count = 0;
      while (dateSet.has(cursor.toISOString().slice(0, 10))) {
        count++;
        cursor.setUTCDate(cursor.getUTCDate() - 1);
      }
      return count;
    })();

    res.json({
      success: true,
      data: {
        stats: { totalAttempts, correctAttempts, accuracy },
        weakAreas,
        streak,
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
