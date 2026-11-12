import Redis from 'ioredis';
import { logger } from '../utils/logger';
import { incCounter } from '../utils/metrics';

const APPEND_UNIQUE_LUA = `
local cur = redis.call('GET', KEYS[1])
local list = {}
if cur then list = cjson.decode(cur) end
local seen = {}
for _, v in ipairs(list) do seen[v] = true end
for i = 3, #ARGV do
  if not seen[ARGV[i]] then
    seen[ARGV[i]] = true
    table.insert(list, ARGV[i])
  end
end
local maxLen = tonumber(ARGV[2])
while #list > maxLen do table.remove(list, 1) end
redis.call('SET', KEYS[1], cjson.encode(list), 'EX', ARGV[1])
return #list
`;

const APPEND_MAX_LIST_LENGTH = 2000;
const MEMORY_MAX_ENTRIES = 20_000;

interface MemoryEntry {
  value: string;
  expiresAt: number;
}

/**
 * Bounded in-memory TTL store used when REDIS_URL is not configured (e.g. local dev or single-node PM2).
 * Implements the exact semantics of get/set/del/appendUnique/setNx/incr so features like served-question
 * tracking, logout JTI revocation, rate limiting, and single-flight locks work without Redis.
 */
export class InMemoryCacheStore {
  private readonly store = new Map<string, MemoryEntry>();

  private getValid(key: string): MemoryEntry | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() >= entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry;
  }

  private setEntry(key: string, value: string, expiresAt: number): void {
    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= MEMORY_MAX_ENTRIES) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey !== undefined) this.store.delete(oldestKey);
    }
    this.store.set(key, { value, expiresAt });
  }

  public get(key: string): string | null {
    return this.getValid(key)?.value ?? null;
  }

  public set(key: string, value: string, ttlSeconds: number): void {
    const expiresAt = Date.now() + Math.max(1, ttlSeconds) * 1000;
    this.setEntry(key, value, expiresAt);
  }

  public del(key: string): void {
    this.store.delete(key);
  }

  public appendUnique(key: string, values: string[], ttlSeconds: number): void {
    if (values.length === 0) return;
    const entry = this.getValid(key);
    let list: string[] = [];
    if (entry) {
      try {
        const parsed = JSON.parse(entry.value);
        if (Array.isArray(parsed)) list = parsed;
      } catch {
        list = [];
      }
    }
    const seen = new Set(list);
    for (const v of values) {
      if (!seen.has(v)) {
        seen.add(v);
        list.push(v);
      }
    }
    if (list.length > APPEND_MAX_LIST_LENGTH) {
      list = list.slice(list.length - APPEND_MAX_LIST_LENGTH);
    }
    this.set(key, JSON.stringify(list), ttlSeconds);
  }

  public setNx(key: string, ttlSeconds: number): boolean {
    if (this.getValid(key) !== null) return false;
    this.set(key, '1', ttlSeconds);
    return true;
  }

  public incr(key: string, windowSeconds: number): number {
    const existing = this.getValid(key);
    if (!existing) {
      const expiresAt = Date.now() + Math.max(1, windowSeconds) * 1000;
      this.setEntry(key, '1', expiresAt);
      return 1;
    }
    const next = (parseInt(existing.value, 10) || 0) + 1;
    this.setEntry(key, String(next), existing.expiresAt);
    return next;
  }
}

/**
 * Class-based cache facade supporting optional Redis (`REDIS_URL`) with seamless in-memory fallback.
 */
export class CacheService {
  private redisClient: Redis | null = null;
  private readonly memory = new InMemoryCacheStore();
  private readonly redisUrl?: string;

  constructor(redisUrl: string | undefined = process.env.REDIS_URL) {
    this.redisUrl = redisUrl && redisUrl.trim() !== '' ? redisUrl.trim() : undefined;
  }

  public isRedisEnabled(): boolean {
    const url = this.redisUrl ?? process.env.REDIS_URL;
    return typeof url === 'string' && url.trim() !== '';
  }

  private getRedis(): Redis | null {
    const url = this.redisUrl ?? process.env.REDIS_URL;
    if (!url || url.trim() === '') return null;
    if (!this.redisClient) {
      this.redisClient = new Redis(url.trim(), {
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
        lazyConnect: true,
        retryStrategy: (times) => (times > 3 ? null : Math.min(times * 250, 1000)),
      });
      this.redisClient.on('error', (err: Error) => {
        incCounter('redis_errors_total');
        logger.error({ err: err.message }, '[redis] connection error');
      });
    }
    return this.redisClient;
  }

  public async get(key: string): Promise<string | null> {
    const client = this.getRedis();
    if (!client) return this.memory.get(key);
    try {
      return await client.get(key);
    } catch {
      return this.memory.get(key);
    }
  }

  public async set(key: string, value: string, ttlSeconds = 3600): Promise<void> {
    const client = this.getRedis();
    if (!client) {
      this.memory.set(key, value, ttlSeconds);
      return;
    }
    try {
      await client.set(key, value, 'EX', ttlSeconds);
    } catch {
      this.memory.set(key, value, ttlSeconds);
    }
  }

  public async del(key: string): Promise<void> {
    const client = this.getRedis();
    if (!client) {
      this.memory.del(key);
      return;
    }
    try {
      await client.del(key);
    } catch {
      this.memory.del(key);
    }
  }

  public async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  public async setJson(key: string, value: unknown, ttlSeconds = 3600): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }

  public async appendUnique(key: string, values: string[], ttlSeconds: number): Promise<void> {
    if (values.length === 0) return;
    const client = this.getRedis();
    if (!client) {
      this.memory.appendUnique(key, values, ttlSeconds);
      return;
    }
    try {
      await client.eval(APPEND_UNIQUE_LUA, 1, key, String(ttlSeconds), String(APPEND_MAX_LIST_LENGTH), ...values);
    } catch {
      this.memory.appendUnique(key, values, ttlSeconds);
    }
  }

  public async setNx(key: string, ttlSeconds: number): Promise<boolean> {
    const client = this.getRedis();
    if (!client) return this.memory.setNx(key, ttlSeconds);
    try {
      const result = await client.set(key, '1', 'EX', ttlSeconds, 'NX');
      return result === 'OK';
    } catch {
      return this.memory.setNx(key, ttlSeconds);
    }
  }

  public async incr(key: string, windowSeconds: number): Promise<number | null> {
    const client = this.getRedis();
    if (!client) return this.memory.incr(key, windowSeconds);
    try {
      const count = await client.incr(key);
      if (count === 1) await client.expire(key, windowSeconds);
      return count;
    } catch {
      return this.memory.incr(key, windowSeconds);
    }
  }

  public async disconnect(): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.quit().catch(() => {});
      this.redisClient = null;
    }
  }
}

export const cacheService = new CacheService();
