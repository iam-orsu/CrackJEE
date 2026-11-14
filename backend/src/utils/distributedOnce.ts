import { cacheService, type CacheService } from '../services/CacheService';

const POLL_INTERVAL_MS = 2000;

/**
 * Runs `produce` once across concurrent callers (and across instances when Redis is configured) for `key`.
 * Waiters poll `readShared` until the result appears or `waitMs` elapses.
 */
export async function runOnce<T>(
  key: string,
  opts: {
    lockSeconds: number;
    waitMs: number;
    readShared: () => Promise<T | null>;
    produce: () => Promise<T>;
  },
  cache: Pick<CacheService, 'setNx' | 'del'> = cacheService,
): Promise<T> {
  const lockKey = `lock:${key}`;
  if (await cache.setNx(lockKey, opts.lockSeconds)) {
    try {
      return await opts.produce();
    } finally {
      await cache.del(lockKey);
    }
  }

  const deadline = Date.now() + opts.waitMs;
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    const shared = await opts.readShared();
    if (shared) return shared;
  }
  return opts.produce();
}
