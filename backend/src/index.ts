import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { z } from 'zod';
import { prisma } from './lib/prisma';
import { authRoutes } from './routes/auth';
import { questionRoutes } from './routes/questions';
import { answerRoutes } from './routes/answers';
import { progressRoutes } from './routes/progress';
import { mockRoutes } from './routes/mock';
import { adminRoutes } from './routes/admin';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import { requestId } from './middleware/requestId';
import { logger } from './lib/logger';
import { incCounter, renderMetrics } from './lib/metrics';

/* -- Validate required env vars at startup --------------- */
const envSchema = z.object({
  DATABASE_URL:     z.string().startsWith('postgresql://'),
  REDIS_URL:        z.string().startsWith('redis://'),
  JWT_SECRET:       z.string().min(16),
  DEEPSEEK_API_KEY: z.string().min(8),
  FRONTEND_URL:     z.string().url().optional(),
});

const env = envSchema.safeParse(process.env);
if (!env.success) {
  logger.error({ issues: env.error.errors }, 'Invalid environment - aborting startup');
  process.exit(1);
}

const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);

app.set('trust proxy', 1);
app.use(requestId);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com', 'cdn.jsdelivr.net'],
      fontSrc: ["'self'", 'fonts.gstatic.com', 'cdn.jsdelivr.net'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
const allowedOrigins = new Set([
  frontendUrl,
  // Allow both http and https variants so plain-HTTP access works alongside HTTPS
  frontendUrl.startsWith('https://')
    ? frontendUrl.replace('https://', 'http://')
    : frontendUrl.replace('http://', 'https://'),
  'http://localhost',
  'https://localhost',
  'http://localhost:3000',
  'https://localhost:3000',
  'http://127.0.0.1',
  'https://127.0.0.1',
  ...(process.env.EXTRA_CORS_ORIGINS ?? '').split(',').filter(Boolean),
]);
// RFC 1918 private IP ranges — covers any WSL2 / Docker bridge IP for local testing
const PRIVATE_IP_RE = /^https?:\/\/(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)\d+\.\d+(:\d+)?$/;
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.has(origin) || PRIVATE_IP_RE.test(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(apiLimiter);

/* -- Request logging -------------------------------------- */
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms     = Date.now() - start;
    const status = res.statusCode;
    const meta   = { method: req.method, url: req.url, status, ms, reqId: req.headers['x-request-id'] };
    const msg    = `${req.method} ${req.url} ${status} ${ms}ms`;
    if (status >= 500)      logger.error(meta, msg);
    else if (status >= 400) logger.warn(meta, msg);
    else                    logger.info(meta, msg);

    // Route label: ids collapsed to :id, and unmatched paths grouped so scanners can't explode cardinality
    const route = req.route
      ? req.originalUrl.split('?')[0]!.replace(/\/[A-Za-z0-9_-]{16,}/g, '/:id')
      : 'unmatched';
    incCounter('http_requests_total', { route, status: String(status) });
    incCounter('http_request_duration_ms_total', { route }, ms);
  });
  next();
});

/* -- Routes ----------------------------------------------- */
// Internal only: nginx routes /api and / and never /metrics, and the backend port is not published
app.get('/metrics', (_req, res) => {
  res.type('text/plain').send(renderMetrics());
});

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'up', ts: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'error', db: 'down' });
  }
});

app.use('/api/auth',      authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers',   answerRoutes);
app.use('/api/mock',      mockRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api',           progressRoutes);

app.use(errorHandler);

/* -- Boot ------------------------------------------------- */
async function start(): Promise<void> {
  await prisma.$connect();
  logger.info('Connected to PostgreSQL');

  // Mock generations run inside the backend process. A restart interrupts any still in progress,
  // so mark them as errors: students see a retry instead of waiting on a generation that will never finish.
  const interrupted = await prisma.mockExam.updateMany({ where: { status: 'generating' }, data: { status: 'error' } });
  if (interrupted.count > 0) logger.warn({ count: interrupted.count }, 'Marked interrupted mock generations as error');

  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Backend listening on :${PORT} [${process.env.NODE_ENV ?? 'development'}]`);
  });

  function shutdown(signal: string): void {
    logger.info(`${signal} received - shutting down`);
    server.close(async () => {
      await prisma.$disconnect();
      logger.info('Shutdown complete');
      process.exit(0);
    });
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

start().catch((err: unknown) => {
  logger.error(err, 'Fatal error during startup');
  process.exit(1);
});
