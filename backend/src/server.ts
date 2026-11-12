import { getEnv } from './config/env';
import { database } from './config/database';
import { cacheService } from './services/CacheService';
import { MockExamService } from './services/MockExamService';
import { mockGeneratorService } from './services/MockGeneratorService';
import { facultyPaperService } from './services/FacultyPaperService';
import { createApp } from './app';
import { logger } from './utils/logger';

/** Process entrypoint: validates env, connects MySQL, boots HTTP server and graceful shutdown hooks. */
async function start(): Promise<void> {
  const env = getEnv();
  await database.connect();

  if (!cacheService.isRedisEnabled()) {
    logger.warn('REDIS_URL is not set — running with in-memory TTL cache fallback');
  }

  const mockExamService = new MockExamService();
  const interrupted = await mockExamService.sweepStuckGenerations();
  if (interrupted > 0) {
    logger.warn({ count: interrupted }, 'Marked stuck mock generations as error');
  }
  const facultyInterrupted = await facultyPaperService.sweepStuckGenerating();
  if (facultyInterrupted > 0) {
    logger.warn({ count: facultyInterrupted }, 'Marked stuck faculty generations as error');
  }

  const app = createApp();
  const server = app.listen(env.PORT, '0.0.0.0', () => {
    logger.info(`Backend listening on :${env.PORT} [${env.NODE_ENV}]`);
  });

  const sweepInterval = setInterval(async () => {
    try {
      const swept = await mockExamService.sweepStuckGenerations();
      if (swept > 0) {
        logger.warn({ count: swept }, 'Periodic sweep: marked stuck mock generations as error');
      }
      const facultySwept = await facultyPaperService.sweepStuckGenerating();
      if (facultySwept > 0) {
        logger.warn({ count: facultySwept }, 'Periodic sweep: marked stuck faculty generations as error');
      }
    } catch (err) {
      logger.error({ err }, 'Periodic sweep failed');
    }
  }, 60 * 1000);
  sweepInterval.unref();

  let shuttingDown = false;
  async function shutdown(signal: string): Promise<void> {
    if (shuttingDown) return;
    shuttingDown = true;
    clearInterval(sweepInterval);
    logger.info(`${signal} received - shutting down`);
    await Promise.race([
      new Promise<void>((resolve) => server.close(() => resolve())),
      new Promise<void>((resolve) => setTimeout(resolve, 15_000)),
    ]);
    await Promise.all([
      mockGeneratorService.waitForActiveGenerations(12_000),
      facultyPaperService.waitForActiveGenerations(12_000),
    ]);
    await database.disconnect();
    await cacheService.disconnect();
    logger.info('Shutdown complete');
    process.exit(0);
  }

  process.on('SIGTERM', () => { void shutdown('SIGTERM'); });
  process.on('SIGINT', () => { void shutdown('SIGINT'); });
}

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled promise rejection');
});
process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception — shutting down');
  process.exit(1);
});

start().catch((err: unknown) => {
  logger.error(err, 'Fatal error during startup');
  process.exit(1);
});
