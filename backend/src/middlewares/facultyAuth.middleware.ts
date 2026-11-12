import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AUTH_CONSTANTS } from '../config/constants';
import { isCookieSecure } from '../config/env';
import { FacultyRepository } from '../repositories/FacultyRepository';

export const FACULTY_COOKIE = AUTH_CONSTANTS.FACULTY_COOKIE;
export const FACULTY_COOKIE_MAX_AGE_S = AUTH_CONSTANTS.FACULTY_COOKIE_MAX_AGE_S;

export interface FacultyAuthRequest extends Request {
  faculty?: {
    facultyId: string;
    name: string;
    email: string;
  };
}

function facultyCookieFlags(maxAgeSeconds: number): string {
  const secure = isCookieSecure() ? ' Secure;' : '';
  return `Path=/api/v1/faculty; HttpOnly;${secure} SameSite=Strict; Max-Age=${maxAgeSeconds}`;
}

export function setFacultyCookie(res: Response, token: string): void {
  res.append('Set-Cookie', `${FACULTY_COOKIE}=${token}; ${facultyCookieFlags(FACULTY_COOKIE_MAX_AGE_S)}`);
}

export function clearFacultyCookie(res: Response): void {
  res.append('Set-Cookie', `${FACULTY_COOKIE}=; ${facultyCookieFlags(0)}`);
}

function facultyTokenFrom(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7);
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const [name, ...value] = part.trim().split('=');
    if (name === FACULTY_COOKIE && value.length > 0) return decodeURIComponent(value.join('='));
  }
  return null;
}

const defaultRepo = new FacultyRepository();

/** Middleware restricting faculty routes to active `role: 'faculty'` JWT sessions. */
export function requireFaculty(repo: FacultyRepository = defaultRepo) {
  return async (req: FacultyAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = facultyTokenFrom(req);
    if (!token) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ success: false, error: 'Server misconfiguration' });
      return;
    }

    let payload: { facultyId?: string; role?: string };
    try {
      payload = jwt.verify(token, secret, { algorithms: ['HS256'] }) as { facultyId?: string; role?: string };
    } catch {
      res.status(401).json({ success: false, error: 'Invalid or expired faculty session' });
      return;
    }

    if (payload.role !== 'faculty' || !payload.facultyId) {
      res.status(403).json({ success: false, error: 'Faculty access only' });
      return;
    }

    try {
      const account = await repo.findById(payload.facultyId);
      if (!account || !account.isActive) {
        res.status(403).json({ success: false, error: 'Faculty account is inactive or missing' });
        return;
      }
      req.faculty = { facultyId: account.id, name: account.name, email: account.email };
      next();
    } catch (err) {
      next(err);
    }
  };
}
