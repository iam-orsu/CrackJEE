import Redis from 'ioredis';
import { logger } from '../lib/logger';

let client: Redis | null = null;

function getClient(): Redis {
  if (!client) {
    client = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
    client.on('error', (err: Error) => logger.error({ err: err.message }, '[redis] connection error'));
  }
  return client;
}

export async function cacheGet(key: string): Promise<string | null> {
  try {
    return await getClient().get(key);
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: string, ttlSeconds = 3600): Promise<void> {
  try {
    await getClient().set(key, value, 'EX', ttlSeconds);
  } catch {
    // Cache failures are non-fatal
  }
}

export async function cacheDel(key: string): Promise<void> {
  try {
    await getClient().del(key);
  } catch {
    // Non-fatal
  }
}

export async function cacheGetJson<T>(key: string): Promise<T | null> {
  const raw = await cacheGet(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function cacheSetJson(key: string, value: unknown, ttlSeconds = 3600): Promise<void> {
  await cacheSet(key, JSON.stringify(value), ttlSeconds);
}
