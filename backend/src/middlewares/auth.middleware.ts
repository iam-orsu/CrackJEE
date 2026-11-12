import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AUTH_CONSTANTS } from '../config/constants';
import { isCookieSecure } from '../config/env';
import { UserRepository } from '../repositories/UserRepository';
import { cacheService } from '../services/CacheService';
import type { AuthPayload, AuthRequest } from '../types/index';

const userRepo = new UserRepository();

export const SESSION_MAX_MS = AUTH_CONSTANTS.SESSION_MAX_MS;
export const SESSION_COOKIE = AUTH_CONSTANTS.SESSION_COOKIE;
export const SESSION_COOKIE_MAX_AGE_S = AUTH_CONSTANTS.SESSION_COOKIE_MAX_AGE_S;

/** Returns session origin timestamp (ms since epoch), falling back to JWT `iat`. */
export function sessionStartOf(payload: AuthPayload & { iat?: number }): number {
  return payload.sessionStart ?? (payload.iat ?? 0) * 1000;
}

/** Checks whether the login session has exceeded its hard maximum lifetime. */
export function isSessionTooOld(sessionStart: number, now: number = Date.now()): boolean {
  return now - sessionStart > SESSION_MAX_MS;
}

function cookieFlags(maxAgeSeconds: number): string {
  const secure = isCookieSecure() ? ' Secure;' : '';
  return `Path=/api; HttpOnly;${secure} SameSite=Strict; Max-Age=${maxAgeSeconds}`;
}

export function setSessionCookie(res: Response, token: string): void {
  res.append('Set-Cookie', `${SESSION_COOKIE}=${token}; ${cookieFlags(SESSION_COOKIE_MAX_AGE_S)}`);
}

export function clearSessionCookie(res: Response): void {
  res.append('Set-Cookie', `${SESSION_COOKIE}=; ${cookieFlags(0)}`);
}

/** Reads the student JWT either from Bearer Authorization header or the `jee_session` cookie. */
export function sessionTokenFrom(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7);
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const [name, ...value] = part.trim().split('=');
    if (name === SESSION_COOKIE && value.length > 0) return decodeURIComponent(value.join('='));
  }
  return null;
}

async function isRevoked(jti: string | undefined): Promise<boolean> {
  if (!jti) return false;
  return (await cacheService.get(`revoked:${jti}`)) !== null;
}

/** Middleware requiring a valid, non-revoked student session JWT. */
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
    const user = await userRepo.existsById(payload.userId);
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
