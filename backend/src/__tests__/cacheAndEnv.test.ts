import { test, after } from 'node:test';
import * as assert from 'node:assert/strict';
import { CacheService, InMemoryCacheStore, cacheService } from '../services/CacheService';
import { envSchema, isCookieSecure } from '../config/env';
import { istDateKey, istMonthKey } from '../utils/dateIst';
import { DeepSeekService } from '../services/DeepSeekService';

test('InMemoryCacheStore handles set, get, del, and expiry', async () => {
  const store = new InMemoryCacheStore();
  assert.equal(store.get('missing'), null);

  store.set('k1', 'v1', 60);
  assert.equal(store.get('k1'), 'v1');

  store.del('k1');
  assert.equal(store.get('k1'), null);

  store.set('short', 'abc', 1);
  assert.equal(store.get('short'), 'abc');
  await new Promise((r) => setTimeout(r, 1050));
  assert.equal(store.get('short'), null);
});

test('InMemoryCacheStore appendUnique deduplicates values', () => {
  const store = new InMemoryCacheStore();
  store.appendUnique('served:u1', ['q1', 'q2'], 60);
  store.appendUnique('served:u1', ['q2', 'q3'], 60);
  const parsed = JSON.parse(store.get('served:u1') ?? '[]') as string[];
  assert.deepEqual(parsed, ['q1', 'q2', 'q3']);
});

test('InMemoryCacheStore setNx acts as an atomic single-flight lock', () => {
  const store = new InMemoryCacheStore();
  assert.equal(store.setNx('lock:1', 60), true);
  assert.equal(store.setNx('lock:1', 60), false);
  store.del('lock:1');
  assert.equal(store.setNx('lock:1', 60), true);
});

test('InMemoryCacheStore incr increments within fixed window', () => {
  const store = new InMemoryCacheStore();
  assert.equal(store.incr('rl:1', 60), 1);
  assert.equal(store.incr('rl:1', 60), 2);
  assert.equal(store.incr('rl:1', 60), 3);
});

test('CacheService operates without REDIS_URL via in-memory fallback', async () => {
  const cache = new CacheService('');
  assert.equal(cache.isRedisEnabled(), false);

  await cache.setJson('obj', { count: 42 }, 60);
  assert.deepEqual(await cache.getJson<{ count: number }>('obj'), { count: 42 });
  await cache.appendUnique('served:test', ['a', 'b', 'a'], 60);
  assert.deepEqual(await cache.getJson<string[]>('served:test'), ['a', 'b']);
  assert.equal(await cache.setNx('nx:test', 60), true);
  assert.equal(await cache.setNx('nx:test', 60), false);
});

test('CacheService operates with live Redis when configured', async () => {
  const cache = new CacheService('redis://127.0.0.1:6379');
  assert.equal(cache.isRedisEnabled(), true);
  await cache.set('live:test', 'hello-redis', 10);
  assert.equal(await cache.get('live:test'), 'hello-redis');
  assert.equal(await cache.setNx('live:lock', 10), true);
  assert.equal(await cache.setNx('live:lock', 10), false);
  await cache.del('live:lock');
  await cache.del('live:test');
  await cache.disconnect();
});

test('envSchema requires mysql:// DATABASE_URL and treats REDIS_URL as optional', () => {
  const ok = envSchema.safeParse({
    DATABASE_URL: 'mysql://user:pass@localhost:3306/jeeneet',
    JWT_SECRET: '0123456789abcdef',
    DEEPSEEK_API_KEY: 'sk-12345678',
    REDIS_URL: '',
  });
  assert.equal(ok.success, true);
  if (ok.success) {
    assert.equal(ok.data.REDIS_URL, undefined);
    assert.equal(ok.data.PORT, 3001);
  }

  const okNoAi = envSchema.safeParse({
    DATABASE_URL: 'mysql://user:pass@localhost:3306/jeeneet',
    JWT_SECRET: '0123456789abcdef',
    DEEPSEEK_API_KEY: '',
  });
  assert.equal(okNoAi.success, true);
  if (okNoAi.success) {
    assert.equal(okNoAi.data.DEEPSEEK_API_KEY, undefined);
  }

  const badDb = envSchema.safeParse({
    DATABASE_URL: 'postgresql://user:pass@localhost:5432/jeeneet',
    JWT_SECRET: '0123456789abcdef',
    DEEPSEEK_API_KEY: 'sk-12345678',
  });
  assert.equal(badDb.success, false);
});

test('isCookieSecure respects NODE_ENV and COOKIE_SECURE override', () => {
  assert.equal(isCookieSecure('production', undefined), true);
  assert.equal(isCookieSecure('development', undefined), false);
  assert.equal(isCookieSecure('production', 'false'), false);
  assert.equal(isCookieSecure('development', 'true'), true);
});

test('IST date helpers compute UTC+5:30 day and month accurately', () => {
  // 2026-03-31 19:00:00Z is 2026-04-01 00:30:00 IST
  const instant = new Date('2026-03-31T19:00:00Z');
  assert.equal(istDateKey(instant), '2026-04-01');
  assert.equal(istMonthKey(instant), '2026-04');
});

test('DeepSeekService.isAvailable reflects DEEPSEEK_API_KEY configuration', () => {
  const prev = process.env.DEEPSEEK_API_KEY;
  try {
    delete process.env.DEEPSEEK_API_KEY;
    const ds = new DeepSeekService();
    assert.equal(ds.isAvailable(), false);

    process.env.DEEPSEEK_API_KEY = '   ';
    assert.equal(ds.isAvailable(), false);

    process.env.DEEPSEEK_API_KEY = 'sk-test-valid-key';
    assert.equal(ds.isAvailable(), true);
  } finally {
    if (prev === undefined) delete process.env.DEEPSEEK_API_KEY;
    else process.env.DEEPSEEK_API_KEY = prev;
  }
});

after(async () => {
  await cacheService.disconnect();
});
