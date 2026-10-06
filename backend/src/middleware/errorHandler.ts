import type { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, error: err.message });
    return;
  }

  logger.error({ err }, 'Unhandled error');
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : (err instanceof Error ? err.message : 'Internal server error');
  res.status(500).json({ success: false, error: message });
}
