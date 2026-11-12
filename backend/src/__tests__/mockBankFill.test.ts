import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import {
  fillSlotsFromBank,
  fillPracticeSlotsWithFallbacks,
  type BankQuestion,
  type PracticePoolCandidate,
  type PracticeSlotRequest,
  type SlotKey,
} from '../services/mockBankFill';

const slotA: SlotKey = { subject: 'Physics', topic: 'Kinematics', difficulty: 'beginner', questionType: 'mcq_single' };
const slotB: SlotKey = { subject: 'Physics', topic: 'Waves', difficulty: 'beginner', questionType: 'mcq_single' };

const bank: BankQuestion[] = [
  { id: 'q1', ...slotA },
  { id: 'q2', ...slotA },
  { id: 'q3', ...slotB },
];

test('each slot takes a bank question with the same subject, topic, difficulty and type', () => {
  const picks = fillSlotsFromBank([slotA, slotB], bank, new Set(), () => 0);
  assert.deepEqual(picks, ['q1', 'q3']);
});

test('a slot with no matching bank question is left empty for generation', () => {
  const other: SlotKey = { ...slotA, topic: 'Electrostatics' };
  assert.deepEqual(fillSlotsFromBank([other], bank, new Set()), [null]);
});

test('questions the student has already seen are never used', () => {
  const picks = fillSlotsFromBank([slotA], bank, new Set(['q1', 'q2']));
  assert.deepEqual(picks, [null]);
});

test('one paper never uses the same bank question twice', () => {
  const picks = fillSlotsFromBank([slotA, slotA], bank, new Set(), () => 0);
  assert.equal(picks[0] !== picks[1], true);
  assert.deepEqual([...picks].sort(), ['q1', 'q2']);
});

test('a question with a different difficulty does not fill the slot', () => {
  const hard: SlotKey = { ...slotA, difficulty: 'advanced' };
  assert.deepEqual(fillSlotsFromBank([hard], bank, new Set()), [null]);
});

test('fillPracticeSlotsWithFallbacks preserves index alignment and relaxes within subject', () => {
  const slots: PracticeSlotRequest[] = [
    { subject: 'Chemistry', topic: 'Atomic Structure', difficulty: 'beginner', questionType: 'mcq_single', bankExamType: 'Main' },
    { subject: 'Physics', topic: 'Kinematics', difficulty: 'beginner', questionType: 'mcq_single', bankExamType: 'Main' },
    { subject: 'Physics', topic: 'Optics', difficulty: 'advanced', questionType: 'integer', bankExamType: 'Main' },
  ];
  const pool: PracticePoolCandidate[] = [
    { id: 'excluded', subject: 'Physics', topic: 'Kinematics', difficulty: 'beginner', questionType: 'mcq_single', examType: 'Main' },
    { id: 'p1', subject: 'Physics', topic: 'Kinematics', difficulty: 'beginner', questionType: 'mcq_single', examType: 'Main' },
    { id: 'p2', subject: 'Physics', topic: 'Waves', difficulty: 'beginner', questionType: 'mcq_single', examType: 'Main' },
  ];

  const picks = fillPracticeSlotsWithFallbacks(slots, pool, new Set(['excluded']), () => 0);
  assert.equal(picks[0], null); // Chemistry has no candidates -> null preserved at index 0
  assert.equal(picks[1]?.id, 'p1'); // Exact match for Kinematics, skipping excluded
  assert.equal(picks[2]?.id, 'p2'); // Relaxed fallback within Physics, without reusing p1
});
