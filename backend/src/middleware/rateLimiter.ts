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
  // 'user' for authenticated routes (by userId), 'email' for auth routes (by account email), 'ip' for fallback
  keyBy: 'user' | 'email' | 'ip';
  message: string;
}

function limiter(opts: LimitOptions) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let who: string;
    if (opts.keyBy === 'user') {
      const userId = (req as Request & { user?: { userId: string } }).user?.userId;
      who = userId ? `u:${userId}` : (req.ip ?? 'unknown');
    } else if (opts.keyBy === 'email') {
      const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : null;
      who = email ? `e:${email}` : (req.ip ?? 'unknown');
    } else {
      who = req.ip ?? 'unknown';
    }

    const count = await cacheIncr(`rl:${opts.name}:${who}`, opts.windowSeconds);
    if (count !== null && count > opts.max) {
      res.setHeader('Retry-After', String(opts.windowSeconds));
      res.status(429).json({ success: false, error: opts.message });
      return;
    }
    next();
  };
}

// Auth is keyed by Account Email. Brute force against one account is throttled (30 attempts / 15 min),
// but other students on the same school/hostel Wi-Fi (shared IP) can log in without interference.
export const authLimiter = limiter({
  name: 'auth',
  windowSeconds: 15 * 60,
  max: 30,
  keyBy: 'email',
  message: 'Too many attempts for this account, please try again in 15 minutes',
});

// High emergency DDoS flood gate (50,000/min). Sized so entire campuses sharing one NAT never hit it.
export const apiLimiter = limiter({
  name: 'api',
  windowSeconds: 60,
  max: 50000,
  keyBy: 'ip',
  message: 'Rate limit exceeded',
});

// Authenticated per-user limiters:
export const questionLimiter = limiter({
  name: 'question',
  windowSeconds: 60 * 60,
  max: 1000,
  keyBy: 'user',
  message: 'Question request limit reached for this hour',
});

export const mockStartLimiter = limiter({
  name: 'mockstart',
  windowSeconds: 15 * 60,
  max: 10,
  keyBy: 'user',
  message: 'Mock exam generation limit reached. Please wait before starting another.',
});

export const answerLimiter = limiter({
  name: 'answer',
  windowSeconds: 60,
  max: 120,
  keyBy: 'user',
  message: 'Answer submission limit reached. Please wait a moment.',
});
