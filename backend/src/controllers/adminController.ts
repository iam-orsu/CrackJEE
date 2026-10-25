import { timingSafeEqual, createHash } from 'crypto';
import bcrypt from 'bcrypt';
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { setAdminCookie, clearAdminCookie } from '../middleware/adminAuth';
import { logger } from '../lib/logger';

const loginSchema = z.object({
  email: z.string().min(1).max(200),
  password: z.string().min(1).max(200),
});

// Hash both sides to a fixed-length digest so the comparison never
// branches on string length — prevents a timing side-channel on the email check.
function safeEqualStr(a: string, b: string): boolean {
  const left = createHash('sha256').update(a).digest();
  const right = createHash('sha256').update(b).digest();
  return timingSafeEqual(left, right);
}

// Credentials come from .env. Preferred: SUPERADMIN_PASSWORD_HASH (bcrypt hash).
// Legacy: SUPERADMIN_PASSWORD (plaintext) — still works but logs a warning on every login.
// Generate a hash: node -e "require('bcrypt').hash('yourpassword',12).then(console.log)"
export async function adminLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const expectedEmail = process.env.SUPERADMIN_EMAIL;
    const passwordHash = process.env.SUPERADMIN_PASSWORD_HASH;
    const passwordPlain = process.env.SUPERADMIN_PASSWORD;

    if (!expectedEmail || (!passwordHash && !passwordPlain)) {
      throw new AppError(503, 'Super admin is not configured. Set SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD_HASH in .env');
    }

    const body = loginSchema.safeParse(req.body);
    if (!body.success) throw new AppError(400, 'Invalid credentials');

    const emailOk = safeEqualStr(body.data.email.trim().toLowerCase(), expectedEmail.trim().toLowerCase());

    let passwordOk: boolean;
    if (passwordHash) {
      passwordOk = await bcrypt.compare(body.data.password, passwordHash);
    } else {
      // Plaintext fallback — warn so operators know to migrate
      logger.warn('Admin login using plaintext SUPERADMIN_PASSWORD. Set SUPERADMIN_PASSWORD_HASH instead.');
      const left = createHash('sha256').update(body.data.password).digest();
      const right = createHash('sha256').update(passwordPlain!).digest();
      passwordOk = timingSafeEqual(left, right);
    }

    if (!emailOk || !passwordOk) throw new AppError(401, 'Invalid credentials');

    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET!, {
      algorithm: 'HS256',
      expiresIn: '8h',
    });
    setAdminCookie(res, token);
    res.json({ success: true, data: { expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() } });
  } catch (err) {
    next(err);
  }
}

export function adminLogout(_req: Request, res: Response): void {
  clearAdminCookie(res);
  res.json({ success: true });
}

export async function adminStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [users, attemptGroups, correctGroups, mockGroups, mockResults, bankGroups] = await Promise.all([
      prisma.user.findMany({
        select: { id: true, name: true, email: true, class: true, targetExam: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.studentAttempt.groupBy({ by: ['userId'], _count: { _all: true }, _max: { createdAt: true } }),
      prisma.studentAttempt.groupBy({ by: ['userId'], where: { isCorrect: true }, _count: { _all: true } }),
      prisma.mockExam.groupBy({ by: ['userId'], where: { status: 'submitted' }, _count: { _all: true } }),
      prisma.mockExamResult.findMany({ select: { totalScore: true, maxScore: true } }),
      prisma.question.groupBy({ by: ['subject'], where: { validatedAt: { not: null } }, _count: { _all: true } }),
    ]);

    // Per-student lookups
    const attempts = new Map<string, { count: number; last: Date | null }>();
    for (const g of attemptGroups) attempts.set(g.userId, { count: g._count._all, last: g._max.createdAt });
    const correct = new Map<string, number>();
    for (const g of correctGroups) correct.set(g.userId, g._count._all);
    const mocks = new Map<string, number>();
    for (const g of mockGroups) mocks.set(g.userId, g._count._all);

    const students = users
      .map((u) => {
        const a = attempts.get(u.id);
        const practiceAttempts = a?.count ?? 0;
        const practiceCorrect = correct.get(u.id) ?? 0;
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          class: u.class,
          targetExam: u.targetExam,
          joinedAt: u.createdAt.toISOString(),
          practiceAttempts,
          practiceAccuracy: practiceAttempts > 0 ? Math.round((practiceCorrect / practiceAttempts) * 100) : 0,
          mockSubmitted: mocks.get(u.id) ?? 0,
          lastActive: a?.last ? a.last.toISOString() : null,
        };
      })
      .sort((x, y) => (y.lastActive ?? '').localeCompare(x.lastActive ?? ''));

    const practiceAttempts = attemptGroups.reduce((sum, g) => sum + g._count._all, 0);
    const practiceCorrect = correctGroups.reduce((sum, g) => sum + g._count._all, 0);
    const mockSubmissions = mockGroups.reduce((sum, g) => sum + g._count._all, 0);
    const avgMockPercent = mockResults.length > 0
      ? Math.round(
          mockResults.reduce((sum, r) => sum + (r.maxScore > 0 ? (r.totalScore / r.maxScore) * 100 : 0), 0) /
            mockResults.length,
        )
      : null;

    // Signups per day for the last 14 days (UTC dates)
    const signupCounts = new Map<string, number>();
    for (const u of users) {
      const day = u.createdAt.toISOString().slice(0, 10);
      signupCounts.set(day, (signupCounts.get(day) ?? 0) + 1);
    }
    const signupsByDay: Array<{ date: string; count: number }> = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      signupsByDay.push({ date, count: signupCounts.get(date) ?? 0 });
    }

    const bySubject: Record<string, number> = { Physics: 0, Chemistry: 0, Mathematics: 0 };
    for (const g of bankGroups) bySubject[g.subject] = g._count._all;

    res.json({
      success: true,
      data: {
        totals: {
          registered: users.length,
          tookPractice: attemptGroups.length,
          tookAnyExam: students.filter((s) => s.practiceAttempts > 0 || s.mockSubmitted > 0).length,
          practiceAttempts,
          practiceAccuracy: practiceAttempts > 0 ? Math.round((practiceCorrect / practiceAttempts) * 100) : 0,
          tookMock: mockGroups.length,
          mockSubmissions,
          avgMockPercent,
        },
        signupsByDay,
        bank: {
          total: Object.values(bySubject).reduce((sum, n) => sum + n, 0),
          bySubject,
        },
        students,
      },
    });
  } catch (err) {
    next(err);
  }
}
