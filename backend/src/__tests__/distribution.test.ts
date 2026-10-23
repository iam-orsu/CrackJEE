import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { distributeTopicSlots, fisherYatesShuffle } from '../services/questionService';

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
