import type { Request, Response, NextFunction } from 'express';
import { cacheService } from '../services/CacheService';

interface LimitOptions {
  name: string;
  windowSeconds: number;
  max: number;
  keyBy: 'user' | 'email' | 'ip';
  message: string;
}

function createRateLimiter(opts: LimitOptions) {
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

    const count = await cacheService.incr(`rl:${opts.name}:${who}`, opts.windowSeconds);
    if (count !== null && count > opts.max) {
      res.setHeader('Retry-After', String(opts.windowSeconds));
      res.status(429).json({ success: false, error: opts.message });
      return;
    }
    next();
  };
}

export const authLimiter = createRateLimiter({
  name: 'auth',
  windowSeconds: 15 * 60,
  max: 30,
  keyBy: 'email',
  message: 'Too many attempts for this account, please try again in 15 minutes',
});

export const apiLimiter = createRateLimiter({
  name: 'api',
  windowSeconds: 60,
  max: 50000,
  keyBy: 'ip',
  message: 'Rate limit exceeded',
});

export const questionLimiter = createRateLimiter({
  name: 'question',
  windowSeconds: 60 * 60,
  max: 1000,
  keyBy: 'user',
  message: 'Question request limit reached for this hour',
});

export const mockStartLimiter = createRateLimiter({
  name: 'mockstart',
  windowSeconds: 15 * 60,
  max: 10,
  keyBy: 'user',
  message: 'Mock exam generation limit reached. Please wait before starting another.',
});

export const answerLimiter = createRateLimiter({
  name: 'answer',
  windowSeconds: 60,
  max: 120,
  keyBy: 'user',
  message: 'Answer submission limit reached. Please wait a moment.',
});
