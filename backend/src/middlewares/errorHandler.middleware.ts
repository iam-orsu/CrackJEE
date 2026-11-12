import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export { AppError };

/** Express terminal error handler converting operational and unexpected errors into JSON. */
export function errorHandlerMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, error: err.message });
    return;
  }

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
