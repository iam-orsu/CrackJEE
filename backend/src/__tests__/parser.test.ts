import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { parseRawQuestion } from '../services/deepseekService';

const single = {
  question: 'What is 2+2?',
  options: ['3', '4', '5', '6'],
  correct_answer: 'b',
  answer_explanation: 'Two plus two is four.',
};

test('parses a valid single-correct question and normalises the letter', () => {
  const q = parseRawQuestion(single, 'mcq_single', 'Main');
  assert.equal(q.correct_answer, 'B');
  assert.equal(q.options.length, 4);
});

test('rejects a single-correct question without exactly four options', () => {
  assert.throws(() => parseRawQuestion({ ...single, options: ['3', '4', '5'] }, 'mcq_single', 'Main'));
});

test('rejects duplicate options', () => {
  assert.throws(() => parseRawQuestion({ ...single, options: ['3', '4', '4', '6'] }, 'mcq_single', 'Main'));
});

test('rejects an invalid answer letter', () => {
  assert.throws(() => parseRawQuestion({ ...single, correct_answer: 'Z' }, 'mcq_single', 'Main'));
});

test('integer answers must be in range: 0-99 for Main, 0-9 for Advanced', () => {
  const int = { question: 'Find x', options: [], correct_answer: '42', answer_explanation: 'Compute.' };
  assert.equal(parseRawQuestion(int, 'integer', 'Main').correct_answer, '42');
  assert.throws(() => parseRawQuestion(int, 'integer', 'Advanced'));
  assert.throws(() => parseRawQuestion({ ...int, correct_answer: '150' }, 'integer', 'Main'));
});

test('multi-correct rejects all-four-correct and accepts a subset', () => {
  const multi = { ...single, correct_answers: ['A', 'C'] };
  assert.equal(parseRawQuestion(multi, 'mcq_multi', 'Advanced').correct_answer, 'A,C');
  assert.throws(() => parseRawQuestion({ ...multi, correct_answers: ['A', 'B', 'C', 'D'] }, 'mcq_multi', 'Advanced'));
});

test('strips reasoning filler from the explanation', () => {
  const q = parseRawQuestion({ ...single, answer_explanation: "Let me think. So the answer is B. Two plus two is four." }, 'mcq_single', 'Main');
  assert.ok(!/let me think/i.test(q.answer_explanation));
});
