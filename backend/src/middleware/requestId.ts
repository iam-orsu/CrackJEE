import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export function requestId(req: Request, res: Response, next: NextFunction): void {
  const raw = req.headers['x-request-id'] as string | undefined;
  const id = /^[a-zA-Z0-9_\-]{1,64}$/.test(raw ?? '') ? raw! : randomUUID();
  req.headers['x-request-id'] = id;
  res.setHeader('X-Request-Id', id);
  next();
}
