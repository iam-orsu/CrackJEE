import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import {
  topicStats,
  strongAndWeak,
  topMarksLost,
  monthlyTrend,
  projection,
  negativeAnalysis,
  timeByType,
  subjectOrder,
  istMonthKey,
  type QuestionRecord,
} from '../services/mockInsights';

const at = new Date('2026-10-10T06:00:00Z');

function rec(overrides: Partial<QuestionRecord>): QuestionRecord {
  return {
    subject: 'Physics',
    topic: 'Kinematics',
    questionType: 'mcq_single',
    answered: true,
    awarded: 4,
    maxMarks: 4,
    timeSeconds: 60,
    at,
    ...overrides,
  };
}

test('skipped questions do not count towards topic accuracy or marks lost', () => {
  const stats = topicStats([
    rec({ answered: false, awarded: 0 }),
    rec({ answered: true, awarded: 4 }),
  ]);
  assert.equal(stats.length, 1);
  assert.equal(stats[0]!.attempts, 1);
  assert.equal(stats[0]!.accuracy, 100);
  assert.equal(stats[0]!.marksLost, 0);
});

test('negative marks count as marks lost beyond the maximum', () => {
  const stats = topicStats([rec({ awarded: -1, maxMarks: 4 })]);
  assert.equal(stats[0]!.marksLost, 5);
});

test('one wrong answer flags a topic as weak; a single correct answer is not enough to call it strong', () => {
  const stats = topicStats([
    rec({ topic: 'Waves', awarded: 0 }),
    rec({ topic: 'Optics', awarded: 4 }),
  ]);
  const { strong, weak } = strongAndWeak(stats);
  assert.deepEqual(weak.map((t) => t.topic), ['Waves']);
  assert.deepEqual(strong.map((t) => t.topic), []);
});

test('a topic is strong only after at least two answers at or above 60%', () => {
  const stats = topicStats([
    rec({ topic: 'Gravitation', awarded: 4 }),
    rec({ topic: 'Gravitation', awarded: 4 }),
    rec({ topic: 'Gravitation', awarded: 0 }),
  ]);
  const { strong, weak } = strongAndWeak(stats);
  assert.equal(stats[0]!.accuracy, 67);
  assert.deepEqual(strong.map((t) => t.topic), ['Gravitation']);
  assert.deepEqual(weak, []);
});

test('weak topics list the lowest accuracy first', () => {
  const stats = topicStats([
    rec({ topic: 'A', awarded: 0 }),
    rec({ topic: 'B', awarded: 4 }),
    rec({ topic: 'B', awarded: 0 }),
  ]);
  const { weak } = strongAndWeak(stats);
  assert.deepEqual(weak.map((t) => t.topic), ['A', 'B']);
});

test('marks lost are ranked by the most lost first', () => {
  const stats = topicStats([
    rec({ topic: 'Small', awarded: 0 }),
    rec({ topic: 'Big', awarded: -1 }),
    rec({ topic: 'Big', awarded: 0 }),
  ]);
  assert.equal(topMarksLost(stats)[0]!.topic, 'Big');
});

test('monthly trend averages each month in India time, oldest first', () => {
  const trend = monthlyTrend([
    { at: new Date('2026-09-02T10:00:00Z'), pct: 40 },
    { at: new Date('2026-09-20T10:00:00Z'), pct: 60 },
    { at: new Date('2026-10-05T10:00:00Z'), pct: 70 },
  ]);
  assert.deepEqual(trend, [
    { month: '2026-09', avgPct: 50, mocks: 2 },
    { month: '2026-10', avgPct: 70, mocks: 1 },
  ]);
});

test('IST month key rolls over at India midnight, not UTC midnight', () => {
  // 2026-09-30 19:00 UTC is 2026-10-01 00:30 in India
  assert.equal(istMonthKey(new Date('2026-09-30T19:00:00Z')), '2026-10');
});

test('projection needs at least two mocks', () => {
  assert.deepEqual(projection([{ at, pct: 50 }]), { available: false, mocks: 1 });
});

test('projection follows a rising trend and stays within 0 to 100', () => {
  const result = projection([
    { at: new Date('2026-10-01T00:00:00Z'), pct: 30 },
    { at: new Date('2026-10-08T00:00:00Z'), pct: 50 },
    { at: new Date('2026-10-15T00:00:00Z'), pct: 70 },
  ]);
  assert.equal(result.available, true);
  if (!result.available) return;
  assert.equal(result.expected, 90);
  assert.equal(result.trendPerMock, 20);
  assert.ok(result.high <= 100 && result.low >= 0);
});

test('projection clamps to 100 when the trend would overshoot', () => {
  const result = projection([
    { at: new Date('2026-10-01T00:00:00Z'), pct: 80 },
    { at: new Date('2026-10-08T00:00:00Z'), pct: 95 },
  ]);
  assert.equal(result.available, true);
  if (!result.available) return;
  assert.equal(result.expected, 100);
});

test('negative analysis reports negatives, marks taken away and time on wrong versus right answers', () => {
  const analysis = negativeAnalysis([
    rec({ awarded: 4, timeSeconds: 60 }),
    rec({ awarded: -1, timeSeconds: 120 }),
    rec({ awarded: 0, timeSeconds: 30, answered: true }),
    rec({ answered: false, awarded: 0, timeSeconds: 999 }),
  ]);
  assert.equal(analysis.answered, 3);
  assert.equal(analysis.correct, 1);
  assert.equal(analysis.wrong, 2);
  assert.equal(analysis.negativeCount, 1);
  assert.equal(analysis.negativeMarks, -1);
  assert.equal(analysis.timeOnWrongSeconds, 150);
  assert.equal(analysis.timeOnCorrectSeconds, 60);
  assert.equal(analysis.shareOfTimeOnWrongPct, 71);
});

test('time by question type averages seconds and accuracy per type', () => {
  const byType = timeByType([
    rec({ questionType: 'integer', awarded: 4, timeSeconds: 100 }),
    rec({ questionType: 'integer', awarded: 0, timeSeconds: 200 }),
    rec({ questionType: 'mcq_single', awarded: 4, timeSeconds: 50 }),
  ]);
  const integer = byType.find((t) => t.questionType === 'integer')!;
  assert.equal(integer.avgSeconds, 150);
  assert.equal(integer.accuracy, 50);
});

test('subject order ranks subjects by correct answers per minute spent', () => {
  const order = subjectOrder([
    rec({ subject: 'Physics', awarded: 4, timeSeconds: 600 }),
    rec({ subject: 'Mathematics', awarded: 4, timeSeconds: 120 }),
    rec({ subject: 'Mathematics', awarded: 0, timeSeconds: 120 }),
  ]);
  assert.equal(order[0]!.subject, 'Mathematics');
  // One correct answer in 240 seconds of Mathematics is 0.25 correct per minute
  assert.equal(order[0]!.correctPerMinute, 0.25);
});
