import Redis from 'ioredis';
import { logger } from '../lib/logger';
import { incCounter } from '../lib/metrics';

let client: Redis | null = null;

function getClient(): Redis {
  if (!client) {
    client = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
    client.on('error', (err: Error) => {
      incCounter('redis_errors_total');
      logger.error({ err: err.message }, '[redis] connection error');
    });
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

// Reads the JSON array at `key`, appends any values not already present, and writes it back
// in one Redis script. Atomic, so concurrent requests cannot overwrite each other's additions.
// The stored format stays a plain JSON array, so existing readers keep working.
const APPEND_UNIQUE_LUA = `
local cur = redis.call('GET', KEYS[1])
local list = {}
if cur then list = cjson.decode(cur) end
local seen = {}
for _, v in ipairs(list) do seen[v] = true end
for i = 2, #ARGV do
  if not seen[ARGV[i]] then
    seen[ARGV[i]] = true
    table.insert(list, ARGV[i])
  end
end
redis.call('SET', KEYS[1], cjson.encode(list), 'EX', ARGV[1])
return #list
`;

export async function cacheAppendUnique(key: string, values: string[], ttlSeconds: number): Promise<void> {
  if (values.length === 0) return;
  try {
    await getClient().eval(APPEND_UNIQUE_LUA, 1, key, String(ttlSeconds), ...values);
  } catch {
    // Non-fatal, same as the other cache helpers
  }
}

/**
 * Sets `key` only if it does not exist yet. Returns true when this caller acquired it.
 * If Redis is unreachable this returns true, so a cache outage never blocks the caller.
 */
export async function cacheSetNx(key: string, ttlSeconds: number): Promise<boolean> {
  try {
    const result = await getClient().set(key, '1', 'EX', ttlSeconds, 'NX');
    return result === 'OK';
  } catch {
    return true;
  }
}
