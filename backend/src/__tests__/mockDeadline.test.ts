import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { isExamExpired } from '../controllers/mockController';
import { isSessionTooOld, SESSION_MAX_MS } from '../middleware/auth';

test('an exam is open until its duration plus grace has passed', () => {
  const start = new Date('2026-01-01T10:00:00Z');
  const base = start.getTime();
  assert.equal(isExamExpired(start, 3600, base + 3600 * 1000), false);
  assert.equal(isExamExpired(start, 3600, base + 3600 * 1000 + 10_000), false, 'within grace');
  assert.equal(isExamExpired(start, 3600, base + 3600 * 1000 + 20_000), true, 'past grace');
});

test('an exam that has not started yet cannot expire', () => {
  assert.equal(isExamExpired(null, 3600, Date.now() + 1e12), false);
});

test('a session older than the maximum cannot be refreshed', () => {
  const now = Date.now();
  assert.equal(isSessionTooOld(now - SESSION_MAX_MS + 60_000, now), false);
  assert.equal(isSessionTooOld(now - SESSION_MAX_MS - 60_000, now), true);
});
