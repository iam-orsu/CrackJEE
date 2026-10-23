import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { checkAnswer } from '../controllers/answerController';

test('single-correct accepts letter case and surrounding text', () => {
  assert.equal(checkAnswer('mcq_single', 'b', 'B'), true);
  assert.equal(checkAnswer('mcq_single', ' B ', 'B'), true);
  assert.equal(checkAnswer('mcq_single', 'C', 'B'), false);
});

test('multi-correct compares sets, so order does not matter', () => {
  assert.equal(checkAnswer('mcq_multi', 'C,A', 'A,C'), true);
  assert.equal(checkAnswer('mcq_multi', 'A', 'A,C'), false);
  assert.equal(checkAnswer('mcq_multi', 'A,B,C', 'A,C'), false);
});

test('single-correct rejects multi-letter submissions instead of grading their first letter', () => {
  assert.equal(checkAnswer('mcq_single', 'A,C', 'A'), false);
  assert.equal(checkAnswer('mcq_single', 'AB', 'A'), false);
  assert.equal(checkAnswer('mcq_single', '(A)', 'A'), true);
});

test('integer compares numeric value, ignoring a leading plus', () => {
  assert.equal(checkAnswer('integer', '+5', '5'), true);
  assert.equal(checkAnswer('integer', '5.0', '5'), true);
  assert.equal(checkAnswer('integer', '6', '5'), false);
});
