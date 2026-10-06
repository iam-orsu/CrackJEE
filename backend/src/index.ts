import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { z } from 'zod';
import { prisma } from './lib/prisma';
import { authRoutes } from './routes/auth';
import { questionRoutes } from './routes/questions';
import { answerRoutes } from './routes/answers';
import { progressRoutes } from './routes/progress';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import { requestId } from './middleware/requestId';
import { logger } from './lib/logger';

/* â”€â”€ Validate required env vars at startup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const envSchema = z.object({
  DATABASE_URL:     z.string().startsWith('postgresql://'),
  REDIS_URL:        z.string().startsWith('redis://'),
  JWT_SECRET:       z.string().min(16),
  DEEPSEEK_API_KEY: z.string().min(8),
  OPENAI_API_KEY:   z.string().min(8),
});

const env = envSchema.safeParse(process.env);
if (!env.success) {
  logger.error({ issues: env.error.errors }, 'Invalid environment â€” aborting startup');
  process.exit(1);
}

const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);

app.set('trust proxy', 1);
app.use(requestId);
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(apiLimiter);

/* â”€â”€ Request logging â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
  });
  next();
});

/* â”€â”€ Routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
app.use('/api',           progressRoutes);

app.use(errorHandler);

/* â”€â”€ Boot â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
async function start(): Promise<void> {
  await prisma.$connect();
  logger.info('Connected to PostgreSQL');

  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Backend listening on :${PORT} [${process.env.NODE_ENV ?? 'development'}]`);
  });

  function shutdown(signal: string): void {
    logger.info(`${signal} received â€” shutting down`);
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
