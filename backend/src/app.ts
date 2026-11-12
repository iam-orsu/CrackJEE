import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { buildCorsOptions, helmetOptions } from './config/cors';
import { database } from './config/database';
import { createApiV1Router } from './routes/index';
import { requestIdMiddleware } from './middlewares/requestId.middleware';
import { apiLimiter } from './middlewares/rateLimiter.middleware';
import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware';
import { deepSeekService } from './services/DeepSeekService';
import { logger } from './utils/logger';
import { incCounter, renderMetrics } from './utils/metrics';

let deepseekState: 'up' | 'degraded' | 'unknown' = 'unknown';
let deepseekLastCheck = 0;
let deepseekRefreshing = false;

function refreshDeepSeekState(): void {
  if (deepseekRefreshing) return;
  deepseekRefreshing = true;
  const apiKey = process.env.DEEPSEEK_API_KEY ?? '';
  fetch('https://api.deepseek.com/models', {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(8000),
  })
    .then((r) => { deepseekState = r.ok ? 'up' : 'degraded'; })
    .catch(() => { deepseekState = 'degraded'; })
    .finally(() => {
      deepseekLastCheck = Date.now();
      deepseekRefreshing = false;
    });
}

/** Builds and configures the Express application without opening network listeners. */
export function createApp(): express.Express {
  const app = express();

  app.set('trust proxy', 1);
  app.use(requestIdMiddleware);
  app.use(helmet(helmetOptions));
  app.use(cors(buildCorsOptions()));
  app.use(express.json({ limit: '10kb' }));
  app.use(apiLimiter);

  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - start;
      const status = res.statusCode;
      const meta = { method: req.method, url: req.url, status, ms, reqId: req.headers['x-request-id'] };
      const msg = `${req.method} ${req.url} ${status} ${ms}ms`;
      if (status >= 500) logger.error(meta, msg);
      else if (status >= 400) logger.warn(meta, msg);
      else logger.info(meta, msg);

      const route = req.route
        ? req.originalUrl.split('?')[0]!.replace(/\/[A-Za-z0-9_-]{16,}/g, '/:id')
        : 'unmatched';
      incCounter('http_requests_total', { route, status: String(status) });
      incCounter('http_request_duration_ms_total', { route }, ms);
    });
    next();
  });

  app.get('/metrics', (_req, res) => {
    res.type('text/plain').send(renderMetrics());
  });

  app.get('/health', async (_req, res) => {
    if (Date.now() - deepseekLastCheck > 60_000) refreshDeepSeekState();
    try {
      await database.ping();
      res.json({
        status: 'ok',
        db: 'up',
        deepseek: deepseekState,
        deepseekCircuit: deepSeekService.getCircuitState(),
        ts: new Date().toISOString(),
      });
    } catch {
      res.status(503).json({ status: 'error', db: 'down' });
    }
  });

  app.use('/api/v1', createApiV1Router());
  app.use(errorHandlerMiddleware);

  return app;
}
