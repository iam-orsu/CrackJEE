import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AUTH_CONSTANTS } from '../config/constants';
import { isCookieSecure } from '../config/env';

export const ADMIN_COOKIE = AUTH_CONSTANTS.ADMIN_COOKIE;
export const ADMIN_COOKIE_MAX_AGE_S = AUTH_CONSTANTS.ADMIN_COOKIE_MAX_AGE_S;

function adminCookieFlags(maxAgeSeconds: number): string {
  const secure = isCookieSecure() ? ' Secure;' : '';
  return `Path=/api/v1/admin; HttpOnly;${secure} SameSite=Strict; Max-Age=${maxAgeSeconds}`;
}

export function setAdminCookie(res: Response, token: string): void {
  res.append('Set-Cookie', `${ADMIN_COOKIE}=${token}; ${adminCookieFlags(ADMIN_COOKIE_MAX_AGE_S)}`);
}

export function clearAdminCookie(res: Response): void {
  res.append('Set-Cookie', `${ADMIN_COOKIE}=; ${adminCookieFlags(0)}`);
}

function adminTokenFrom(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7);
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const [name, ...value] = part.trim().split('=');
    if (name === ADMIN_COOKIE && value.length > 0) return decodeURIComponent(value.join('='));
  }
  return null;
}

/** Middleware restricting admin routes to valid `role: 'admin'` JWT sessions. */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const token = adminTokenFrom(req);
  if (!token) {
    res.status(401).json({ success: false, error: 'Missing admin token' });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ success: false, error: 'Server misconfiguration' });
    return;
  }

  try {
    const payload = jwt.verify(token, secret, { algorithms: ['HS256'] }) as { role?: string };
    if (payload.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Admin access only' });
      return;
    }
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired admin session' });
  }
}
