import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import {
  distributeTopicSlots,
  fisherYatesShuffle,
  planDifficultySlots,
  planQuestionTypeSlots,
} from '../utils/questionUtils';

const TOPICS = ['Kinematics', 'Laws of Motion', 'Work Energy', 'Gravitation'];

test('fisherYatesShuffle keeps every element exactly once', () => {
  const input = [1, 2, 3, 4, 5, 6];
  const out = fisherYatesShuffle(input);
  assert.deepEqual([...out].sort((a, b) => a - b), input);
  assert.notEqual(out, input, 'returns a new array');
});

test('a single topic fills all slots with that topic', () => {
  assert.deepEqual(distributeTopicSlots(['Sets'], 3), ['Sets', 'Sets', 'Sets']);
});

test('fewer slots than topics gives distinct topics, one slot each', () => {
  const out = distributeTopicSlots(TOPICS, 3);
  assert.equal(out.length, 3);
  assert.equal(new Set(out).size, 3);
  for (const t of out) assert.ok(TOPICS.includes(t));
});

test('between N and 2N slots: every topic appears, none more than twice', () => {
  const out = distributeTopicSlots(TOPICS, 6);
  assert.equal(out.length, 6);
  for (const t of TOPICS) {
    const n = out.filter((x) => x === t).length;
    assert.ok(n >= 1 && n <= 2, `${t} appeared ${n} times`);
  }
});

test('many slots are spread evenly, differing by at most one', () => {
  const out = distributeTopicSlots(TOPICS, 30);
  assert.equal(out.length, 30);
  const counts = TOPICS.map((t) => out.filter((x) => x === t).length);
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 1, `counts ${counts}`);
});

test('no topics or no slots gives an empty plan', () => {
  assert.deepEqual(distributeTopicSlots([], 5), []);
  assert.deepEqual(distributeTopicSlots(TOPICS, 0), []);
});

test('planDifficultySlots respects percentage distribution (e.g. 30/30/40)', () => {
  const slots = planDifficultySlots(10, 'mixed', { beginner: 30, intermediate: 30, advanced: 40 });
  assert.equal(slots.length, 10);
  const beg = slots.filter((d) => d === 'beginner').length;
  const inter = slots.filter((d) => d === 'intermediate').length;
  const adv = slots.filter((d) => d === 'advanced').length;
  assert.equal(beg, 3);
  assert.equal(inter, 3);
  assert.equal(adv, 4);
});

test('planDifficultySlots returns single difficulty when specified without distribution', () => {
  const slots = planDifficultySlots(7, 'advanced');
  assert.equal(slots.length, 7);
  assert.ok(slots.every((d) => d === 'advanced'));
});

test('planQuestionTypeSlots allocates exact type counts when matching slot count', () => {
  const slots = planQuestionTypeSlots(10, {
    mcq_single: 5,
    integer: 3,
    matrix_match: 2,
  });
  assert.equal(slots.length, 10);
  assert.equal(slots.filter((t) => t === 'mcq_single').length, 5);
  assert.equal(slots.filter((t) => t === 'integer').length, 3);
  assert.equal(slots.filter((t) => t === 'matrix_match').length, 2);
});

test('planQuestionTypeSlots scales proportionally when total counts differ', () => {
  const slots = planQuestionTypeSlots(12, {
    mcq_single: 5,
    integer: 3,
    matrix_match: 2,
  });
  assert.equal(slots.length, 12);
  const single = slots.filter((t) => t === 'mcq_single').length;
  const integer = slots.filter((t) => t === 'integer').length;
  const matrix = slots.filter((t) => t === 'matrix_match').length;
  assert.equal(single + integer + matrix, 12);
  assert.ok(single > integer);
});
