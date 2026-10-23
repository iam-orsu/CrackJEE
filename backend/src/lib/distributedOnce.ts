import { cacheDel, cacheSetNx } from '../services/cacheService';

const POLL_INTERVAL_MS = 2000;

/**
 * Runs `produce` once across every backend instance for the same `key`.
 *
 * The first caller takes a Redis lock and does the work. Other callers poll `readShared` until the
 * result appears. If the holder is slow or has died (the lock expires, or the wait runs out), a waiter
 * runs `produce` itself, so a crashed instance can never block students for longer than `waitMs`.
 */
export async function runOnce<T>(
  key: string,
  opts: {
    lockSeconds: number;
    waitMs: number;
    readShared: () => Promise<T | null>;
    produce: () => Promise<T>;
  },
): Promise<T> {
  const lockKey = `lock:${key}`;
  if (await cacheSetNx(lockKey, opts.lockSeconds)) {
    try {
      return await opts.produce();
    } finally {
      await cacheDel(lockKey);
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
