import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// The admin session lives in its own HttpOnly cookie, scoped to /api/admin, so student requests never carry it.
export const ADMIN_COOKIE = 'jee_admin';
export const ADMIN_COOKIE_MAX_AGE_S = 8 * 60 * 60;

export function setAdminCookie(res: Response, token: string): void {
  res.append(
    'Set-Cookie',
    `${ADMIN_COOKIE}=${token}; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${ADMIN_COOKIE_MAX_AGE_S}`,
  );
}

export function clearAdminCookie(res: Response): void {
  res.append('Set-Cookie', `${ADMIN_COOKIE}=; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
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

// Admin tokens carry role: 'admin' and no userId, so student tokens can never pass this check
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
