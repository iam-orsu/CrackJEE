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

  // Handle standard HTTP middleware errors (e.g. 413 Payload Too Large)
  if (
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    typeof (err as { status: unknown }).status === 'number'
  ) {
    const status = (err as { status: number }).status;
    const message = (err as { message?: string }).message || 'Request error';
    res.status(status).json({ success: false, error: message });
    return;
  }

  // Handle Prisma unique constraint violations (P2002)
  if ((err as { code?: string })?.code === 'P2002') {
    res.status(409).json({ success: false, error: 'A duplicate record with this identifier already exists' });
    return;
  }

  // Handle Prisma record not found errors (P2025)
  if ((err as { code?: string })?.code === 'P2025') {
    res.status(404).json({ success: false, error: 'The requested resource was not found' });
    return;
  }

  logger.error({ err }, 'Unhandled error');
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : (err instanceof Error ? err.message : 'Internal server error');
  res.status(500).json({ success: false, error: message });
}
