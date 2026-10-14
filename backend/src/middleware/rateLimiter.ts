import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many attempts, please try again later' },
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Rate limit exceeded' },
});

export const questionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000, // relaxed for seeded database practice
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Question request limit reached for this hour' },
  keyGenerator: (req) => {
    const authReq = req as typeof req & { user?: { userId: string } };
    return authReq.user?.userId ?? req.ip ?? 'unknown';
  },
});

export const mockStartLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6, // max 6 full mock generation requests per 15 mins per user
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Mock exam generation limit reached. Please wait before starting another.' },
  keyGenerator: (req) => {
    const authReq = req as typeof req & { user?: { userId: string } };
    return authReq.user?.userId ?? req.ip ?? 'unknown';
  },
});
