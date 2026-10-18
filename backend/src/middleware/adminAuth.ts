import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Admin tokens carry role: 'admin' and no userId, so student tokens can never pass this check
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Missing admin token' });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ success: false, error: 'Server misconfiguration' });
    return;
  }

  try {
    const payload = jwt.verify(header.slice(7), secret, { algorithms: ['HS256'] }) as { role?: string };
    if (payload.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Admin access only' });
      return;
    }
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired admin session' });
  }
}
