import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { parseRawQuestion } from '../utils/deepseekPrompts';

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

test('matrix match accepts valid 4x4 matching and rejects 2x2 or 3x3 matching', () => {
  const valid4x4 = {
    question: 'Match List I with List II:\nList I:\nA. P-wave\nB. S-wave\nC. Rayleigh wave\nD. Love wave\nList II:\nP. Longitudinal body wave\nQ. Transverse body wave\nR. Surface wave with retrograde elliptical motion\nS. Surface wave with horizontal transverse motion\nChoose the correct option:',
    options: [
      'A-P, B-Q, C-R, D-S',
      'A-Q, B-P, C-S, D-R',
      'A-P, B-R, C-Q, D-S',
      'A-S, B-Q, C-R, D-P',
    ],
    correct_answer: 'A',
    answer_explanation: 'A matches P, B matches Q, C matches R, D matches S.',
  };
  const parsed = parseRawQuestion(valid4x4, 'matrix_match', 'Main');
  assert.equal(parsed.correct_answer, 'A');
  assert.equal(parsed.options.length, 4);

  // 2x2 matrix match must be strictly rejected
  const invalid2x2 = {
    question: 'Match List I with List II:\nList I:\nA. P-wave\nB. S-wave\nList II:\nP. Longitudinal\nQ. Transverse',
    options: ['A-P, B-Q', 'A-Q, B-P', 'A-P, B-P', 'A-Q, B-Q'],
    correct_answer: 'A',
    answer_explanation: 'A matches P, B matches Q.',
  };
  assert.throws(() => parseRawQuestion(invalid2x2, 'matrix_match', 'Main'));

  // 3x3 matrix match (missing D) must be strictly rejected
  const invalid3x3 = {
    question: 'Match List I with List II:\nList I:\nA. P-wave\nB. S-wave\nC. Surface wave\nList II:\nP. Item 1\nQ. Item 2\nR. Item 3',
    options: ['A-P, B-Q, C-R', 'A-Q, B-P, C-R', 'A-R, B-Q, C-P', 'A-P, B-R, C-Q'],
    correct_answer: 'A',
    answer_explanation: 'A matches P, B matches Q, C matches R.',
  };
  assert.throws(() => parseRawQuestion(invalid3x3, 'matrix_match', 'Main'));
});

test('requiresDiagram strictly validates diagram presence and template validity', () => {
  const withNullDiagram = {
    ...single,
    diagram: null,
  };
  const withValidDiagram = {
    ...single,
    diagram: {
      template: 'simple_circuit',
      params: { components: [] },
    },
  };
  const withFakeDiagram = {
    ...single,
    diagram: {
      template: 'non_existent_fake_diagram',
      params: {},
    },
  };

  // Rejects when requiresDiagram is true and diagram is null
  assert.throws(() => parseRawQuestion(withNullDiagram, 'mcq_single', 'Main', false, true));

  // Rejects when requiresDiagram is true and template is invalid
  assert.throws(() => parseRawQuestion(withFakeDiagram, 'mcq_single', 'Main', false, true));

  // Accepts when requiresDiagram is true and template is valid
  const parsed = parseRawQuestion(withValidDiagram, 'mcq_single', 'Main', false, true);
  assert.equal(parsed.diagram?.template, 'simple_circuit');

  // Accepts null when requiresDiagram is false
  const parsedNull = parseRawQuestion(withNullDiagram, 'mcq_single', 'Main', false, false);
  assert.equal(parsedNull.diagram, null);
});
