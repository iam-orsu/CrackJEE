import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { scoreQuestion, getMaxMarkPerQuestion } from '../services/scoringService';

test('JEE Main single-correct: +4 right, -1 wrong, 0 when skipped', () => {
  assert.equal(scoreQuestion('Main', 'mcq_single', 'B', 'B'), 4);
  assert.equal(scoreQuestion('Main', 'mcq_single', 'C', 'B'), -1);
  assert.equal(scoreQuestion('Main', 'mcq_single', null, 'B'), 0);
  assert.equal(scoreQuestion('Main', 'mcq_single', '   ', 'B'), 0);
});

test('JEE Main integer: +4 when exact, no penalty when wrong', () => {
  assert.equal(scoreQuestion('Main', 'integer', '42', '42'), 4);
  assert.equal(scoreQuestion('Main', 'integer', '41', '42'), 0);
});

test('NEET uses the same single-correct rules as JEE Main', () => {
  assert.equal(scoreQuestion('NEET', 'mcq_single', 'A', 'A'), 4);
  assert.equal(scoreQuestion('NEET', 'mcq_single', 'D', 'A'), -1);
});

test('JEE Advanced single-correct: +3 right, -1 wrong', () => {
  assert.equal(scoreQuestion('Advanced', 'mcq_single', 'A', 'A'), 3);
  assert.equal(scoreQuestion('Advanced', 'mcq_single', 'B', 'A'), -1);
});

test('JEE Advanced multi-correct: partial credit, -2 for any wrong option', () => {
  assert.equal(scoreQuestion('Advanced', 'mcq_multi', 'A,C', 'A,C'), 4);
  assert.equal(scoreQuestion('Advanced', 'mcq_multi', 'A', 'A,C'), 1);
  assert.equal(scoreQuestion('Advanced', 'mcq_multi', 'A,B', 'A,C'), -2);
});

test('max marks per question', () => {
  assert.equal(getMaxMarkPerQuestion('Main', 'mcq_single'), 4);
  assert.equal(getMaxMarkPerQuestion('NEET', 'mcq_single'), 4);
  assert.equal(getMaxMarkPerQuestion('Advanced', 'mcq_single'), 3);
  assert.equal(getMaxMarkPerQuestion('Advanced', 'mcq_multi'), 4);
  assert.equal(getMaxMarkPerQuestion('Advanced', 'integer'), 3);
});

test('JEE Advanced integer: +3 right, 0 wrong (CLAUDE.md spec)', () => {
  assert.equal(scoreQuestion('Advanced', 'integer', '7', '7'), 3);
  assert.equal(scoreQuestion('Advanced', 'integer', '6', '7'), 0);
});
