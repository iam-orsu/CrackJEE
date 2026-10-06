import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthRequest, AuthPayload } from '../types/index';
import { prisma } from '../lib/prisma';

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Missing token' });
    return;
  }

  const token = header.slice(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ success: false, error: 'Server misconfiguration' });
    return;
  }

  let payload: AuthPayload;
  try {
    payload = jwt.verify(token, secret, { algorithms: ['HS256'] }) as AuthPayload;
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
    return;
  }

  // Verify the user still exists in the DB — catches post-wipe stale tokens
  prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true } })
    .then((user) => {
      if (!user) {
        res.status(401).json({ success: false, error: 'Session expired, please log in again' });
        return;
      }
      req.user = payload;
      next();
    })
    .catch(() => {
      res.status(500).json({ success: false, error: 'Auth check failed' });
    });
}
