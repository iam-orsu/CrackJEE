import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthRequest, AuthPayload } from '../types/index';
import { prisma } from '../lib/prisma';
import { cacheGet } from '../services/cacheService';

// A login session can be refreshed for at most this long, then the student must sign in again
export const SESSION_MAX_MS = 7 * 24 * 60 * 60 * 1000;

/** The time a session began: set at login, carried across refreshes (falls back to iat for old tokens). */
export function sessionStartOf(payload: AuthPayload & { iat?: number }): number {
  return payload.sessionStart ?? (payload.iat ?? 0) * 1000;
}

export function isSessionTooOld(sessionStart: number, now: number = Date.now()): boolean {
  return now - sessionStart > SESSION_MAX_MS;
}

/** True when logout revoked this token. Redis down means cacheGet returns null, so this fails open like the rate limits. */
async function isRevoked(jti: string | undefined): Promise<boolean> {
  if (!jti) return false;
  return (await cacheGet(`revoked:${jti}`)) !== null;
}

// The student session lives in an HttpOnly cookie, so page scripts cannot read or leak it.
// Path=/api keeps it off the static pages; SameSite=Strict stops cross-site requests from carrying it.
export const SESSION_COOKIE = 'jee_session';
export const SESSION_COOKIE_MAX_AGE_S = 24 * 60 * 60;

export function setSessionCookie(res: Response, token: string): void {
  res.append(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_COOKIE_MAX_AGE_S}`,
  );
}

export function clearSessionCookie(res: Response): void {
  res.append('Set-Cookie', `${SESSION_COOKIE}=; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
}

/** The session token from the cookie, or a Bearer header (for scripts and the QA suite). */
export function sessionTokenFrom(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7);
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const [name, ...value] = part.trim().split('=');
    if (name === SESSION_COOKIE && value.length > 0) return decodeURIComponent(value.join('='));
  }
  return null;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = sessionTokenFrom(req);
  if (!token) {
    res.status(401).json({ success: false, error: 'Missing token' });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ success: false, error: 'Server misconfiguration' });
    return;
  }

  let payload: AuthPayload & { iat?: number };
  try {
    payload = jwt.verify(token, secret, { algorithms: ['HS256'] }) as AuthPayload & { iat?: number };
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
    return;
  }

  // Admin tokens carry role: 'admin' and no userId. They must never act as a student.
  if (typeof payload.userId !== 'string' || payload.userId === '') {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
    return;
  }

  if (isSessionTooOld(sessionStartOf(payload))) {
    res.status(401).json({ success: false, error: 'Session expired, please log in again' });
    return;
  }

  (async (): Promise<void> => {
    if (await isRevoked(payload.jti)) {
      res.status(401).json({ success: false, error: 'Session expired, please log in again' });
      return;
    }
    // Verify the user still exists in the DB — catches post-wipe stale tokens
    const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true } });
    if (!user) {
      res.status(401).json({ success: false, error: 'Session expired, please log in again' });
      return;
    }
    req.user = payload;
    next();
  })().catch((err: unknown) => {
    next(err instanceof Error ? err : new Error('Auth check failed'));
  });
}
