import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { parseMockIdParam, parseSubmitMockBody } from '../controllers/MockController';

test('parseMockIdParam accepts UUIDs and standard identifiers', () => {
  assert.equal(parseMockIdParam('123e4567-e89b-12d3-a456-426614174000'), '123e4567-e89b-12d3-a456-426614174000');
  assert.equal(parseMockIdParam('mock_exam-01'), 'mock_exam-01');
});

test('parseMockIdParam rejects path traversal or empty values', () => {
  assert.throws(() => parseMockIdParam('../admin'));
  assert.throws(() => parseMockIdParam(''));
  assert.throws(() => parseMockIdParam('a'.repeat(65)));
});

test('parseSubmitMockBody defaults missing payload and rounds valid timings', () => {
  assert.deepEqual(Object.entries(parseSubmitMockBody(undefined)), []);
  const res = parseSubmitMockBody({ questionTimes: { 'q-1': 12.6, 'q_2': 0 } });
  assert.equal(res['q-1'], 13);
  assert.equal(res['q_2'], 0);
});

test('parseSubmitMockBody rejects negative, NaN, infinite, or absurd timings', () => {
  assert.throws(() => parseSubmitMockBody({ questionTimes: { q1: -1 } }));
  assert.throws(() => parseSubmitMockBody({ questionTimes: { q1: Number.NaN } }));
  assert.throws(() => parseSubmitMockBody({ questionTimes: { q1: 999999 } }));
  assert.throws(() => parseSubmitMockBody({ questionTimes: 'invalid' }));
});

test('parseSubmitMockBody ignores unsafe prototype keys', () => {
  const payload = JSON.parse('{"questionTimes":{"__proto__":10,"q1":25}}') as unknown;
  const res = parseSubmitMockBody(payload);
  assert.equal(Object.getPrototypeOf(res), null);
  assert.equal(res.q1, 25);
});
