import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../types/index';
import { prisma } from '../lib/prisma';

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

    const exams = await prisma.mockExam.findMany({
      where: { userId, status: 'submitted' },
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
      const breakdown = exam.result.scoreBreakdown as Record<string, { awarded: number }>;

      for (const mq of exam.questions) {
        const { topic, subject } = mq.question;
        const key = `${subject}::${topic}`;
        const bd = breakdown[mq.id];
        if (!bd) continue;

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

export async function leaderboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;

    const allResults = await prisma.mockExamResult.findMany({
      include: { exam: { select: { examType: true, userId: true } } },
    });

    type SubjectStat = { scores: number[]; myScores: number[] };
    const stats: Record<string, Record<string, SubjectStat>> = {};

    for (const r of allResults) {
      const examType = r.exam.examType;
      const isMe = r.exam.userId === userId;

      if (!stats[examType]) stats[examType] = {};

      let subjects: Record<string, { score: number; max: number }>;
      if (examType === 'NEET') {
        subjects = {
          Physics: { score: r.physicsScore, max: 180 },
          Chemistry: { score: r.chemistryScore, max: 180 },
          Biology: { score: r.biologyScore, max: 360 },
        };
      } else {
        const maxPerSubj = r.maxScore > 0 ? Math.round(r.maxScore / 3) : 100;
        subjects = {
          Physics: { score: r.physicsScore, max: maxPerSubj },
          Chemistry: { score: r.chemistryScore, max: maxPerSubj },
          Mathematics: { score: r.mathScore, max: maxPerSubj },
        };
      }

      for (const [subj, { score, max }] of Object.entries(subjects)) {
        if (!stats[examType][subj]) stats[examType][subj] = { scores: [], myScores: [] };
        const pct = max > 0 ? Math.round((score / max) * 100) : 0;
        stats[examType][subj].scores.push(pct);
        if (isMe) stats[examType][subj].myScores.push(pct);
      }
    }

    const result: Record<string, Record<string, { top: number; avg: number; mine: number | null; count: number }>> = {};
    for (const [examType, subjects] of Object.entries(stats)) {
      result[examType] = {};
      for (const [subj, stat] of Object.entries(subjects)) {
        const { scores, myScores } = stat;
        result[examType][subj] = {
          top: scores.length > 0 ? Math.max(...scores) : 0,
          avg: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
          mine: myScores.length > 0 ? Math.max(...myScores) : null,
          count: scores.length,
        };
      }
    }

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
