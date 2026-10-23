import rateLimit from 'express-rate-limit';

// Auth is keyed by IP and shared by everyone on a school or coaching-centre network,
// so the cap is set high enough for a classroom. Per-account brute force is limited by bcrypt cost.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many attempts, please try again later' },
});

// Global floor per IP. Runs before auth, so it cannot key by user. The per-user limiters
// (questionLimiter, answerLimiter, mockStartLimiter) do the real limiting on authenticated routes.
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 600,
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

export const answerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60, // max 60 answer submissions per min per user
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Answer submission limit reached. Please wait a moment.' },
  keyGenerator: (req) => {
    const authReq = req as typeof req & { user?: { userId: string } };
    return authReq.user?.userId ?? req.ip ?? 'unknown';
  },
});
