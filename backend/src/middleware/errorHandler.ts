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

  // Malformed JSON in a request body is a client error, not a server fault
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ success: false, error: 'Malformed JSON in request body' });
    return;
  }

  logger.error({ err }, 'Unhandled error');
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : (err instanceof Error ? err.message : 'Internal server error');
  res.status(500).json({ success: false, error: message });
}
