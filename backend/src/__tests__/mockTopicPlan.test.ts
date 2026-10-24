import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { planSubjectTopics, coveredAfterMock, weakestTopic, paperFitsPlan } from '../services/mockTopicPlan';

test('the next mock takes the uncovered topics in syllabus order, with the weak topic asked twice first', () => {
  // A is covered and C is the weak topic, so the fresh pool is B and D
  const plan = planSubjectTopics(['A', 'B', 'C', 'D'], new Set(['A']), 'C', 5);
  assert.deepEqual(plan.questionTopics, ['C', 'C', 'B', 'D', 'B']);
  assert.equal(plan.questionTopics.length, 5);
});

test('with no weak topic, every slot goes to fresh topics', () => {
  const plan = planSubjectTopics(['A', 'B', 'C'], new Set(), null, 3);
  assert.deepEqual(plan.questionTopics, ['A', 'B', 'C']);
});

test('when every topic is covered, the rotation starts again from the first topic', () => {
  const plan = planSubjectTopics(['A', 'B'], new Set(['A', 'B']), null, 3);
  assert.deepEqual(plan.questionTopics, ['A', 'B', 'A']);
  assert.equal(plan.covered.size, 0);
});

test('a mock adds its topics to coverage, and an exhausted subject empties it', () => {
  assert.deepEqual([...coveredAfterMock(new Set(['A']), ['B'], ['A', 'B', 'C'])].sort(), ['A', 'B']);
  assert.equal(coveredAfterMock(new Set(['A']), ['B'], ['A', 'B']).size, 0);
});

test('the weakest topic is the one with the lowest accuracy in the last mock', () => {
  const answers = [
    { topic: 'X', correct: true },
    { topic: 'X', correct: false },
    { topic: 'Y', correct: true },
  ];
  assert.equal(weakestTopic(answers), 'X');
  assert.equal(weakestTopic([]), null);
});

test('a stored paper fits when it repeats only the weak topic and uses no covered topic', () => {
  const plan = { Physics: { covered: new Set(['A']), weakTopic: 'C' } };
  assert.equal(paperFitsPlan([{ subject: 'Physics', topic: 'C' }, { subject: 'Physics', topic: 'B' }], plan), true);
});

test('a stored paper does not fit when it uses a covered topic', () => {
  const plan = { Physics: { covered: new Set(['A']), weakTopic: 'C' } };
  assert.equal(paperFitsPlan([{ subject: 'Physics', topic: 'C' }, { subject: 'Physics', topic: 'A' }], plan), false);
});

test('a stored paper does not fit when the weak topic is missing', () => {
  const plan = { Physics: { covered: new Set<string>(), weakTopic: 'C' } };
  assert.equal(paperFitsPlan([{ subject: 'Physics', topic: 'B' }], plan), false);
});

test('papers stored before topics were recorded are not reused', () => {
  const plan = { Physics: { covered: new Set<string>(), weakTopic: null } };
  assert.equal(paperFitsPlan([{ subject: 'Physics' }], plan), false);
});
