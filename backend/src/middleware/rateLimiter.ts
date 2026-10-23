import type { Request, Response, NextFunction } from 'express';
import { cacheIncr } from '../services/cacheService';

/*
 * Fixed-window rate limits kept in Redis, so every backend instance shares the same counters.
 * If Redis is unavailable the request is allowed: a cache outage must not block students.
 */

interface LimitOptions {
  name: string;
  windowSeconds: number;
  max: number;
  // Who the limit applies to: a user (authenticated routes) or an IP (public routes)
  keyBy: 'user' | 'ip';
  message: string;
}

function limiter(opts: LimitOptions) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req as Request & { user?: { userId: string } }).user?.userId;
    const who = opts.keyBy === 'user' && userId ? userId : (req.ip ?? 'unknown');
    const count = await cacheIncr(`rl:${opts.name}:${who}`, opts.windowSeconds);
    if (count !== null && count > opts.max) {
      res.setHeader('Retry-After', String(opts.windowSeconds));
      res.status(429).json({ success: false, error: opts.message });
      return;
    }
    next();
  };
}

// Auth is keyed by IP. Everyone behind one coaching-centre NAT shares that IP, so a classroom
// logging in together must fit under this cap. Brute force on one account is also limited by bcrypt cost.
export const authLimiter = limiter({
  name: 'auth', windowSeconds: 15 * 60, max: 200, keyBy: 'ip',
  message: 'Too many attempts, please try again later',
});

// Global floor per IP. Runs before auth, so it cannot key by user. A classroom of ~100 students shares
// one IP, so this is sized for that. The per-user limiters (questionLimiter, answerLimiter,
// mockStartLimiter) do the fine-grained limiting on authenticated routes.
export const apiLimiter = limiter({
  name: 'api', windowSeconds: 60, max: 3000, keyBy: 'ip',
  message: 'Rate limit exceeded',
});

export const questionLimiter = limiter({
  name: 'question', windowSeconds: 60 * 60, max: 1000, keyBy: 'user',
  message: 'Question request limit reached for this hour',
});

export const mockStartLimiter = limiter({
  name: 'mockstart', windowSeconds: 15 * 60, max: 6, keyBy: 'user',
  message: 'Mock exam generation limit reached. Please wait before starting another.',
});

export const answerLimiter = limiter({
  name: 'answer', windowSeconds: 60, max: 60, keyBy: 'user',
  message: 'Answer submission limit reached. Please wait a moment.',
});
