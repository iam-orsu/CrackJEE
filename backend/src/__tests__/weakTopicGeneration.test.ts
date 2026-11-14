import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { TopicRepository } from '../repositories/TopicRepository';
import { fisherYatesShuffle } from '../utils/questionUtils';
import { cacheService } from '../services/CacheService';

after(async () => {
  await cacheService.disconnect();
});

test('StudentTopicMastery calculation and weak-topic detection rules', () => {
  // Test accuracy calculation and isWeak threshold (accuracy < 60% with >= 2 attempts)
  const calcMastery = (existing: { attempts: number; correct: number; marksLost: number } | null, isCorrect: boolean, marksLost = 0) => {
    if (!existing) {
      const attempts = 1;
      const correct = isCorrect ? 1 : 0;
      const accuracyPct = isCorrect ? 100 : 0;
      const isWeak = !isCorrect;
      return { attempts, correct, accuracyPct, marksLost, isWeak };
    }
    const attempts = existing.attempts + 1;
    const correct = existing.correct + (isCorrect ? 1 : 0);
    const accuracyPct = Math.round((correct / attempts) * 1000) / 10;
    const isWeak = attempts >= 2 ? accuracyPct < 60 : accuracyPct < 50;
    return { attempts, correct, accuracyPct, marksLost: existing.marksLost + marksLost, isWeak };
  };

  // 1st attempt wrong -> isWeak: true (0%)
  const step1 = calcMastery(null, false, 4);
  assert.equal(step1.attempts, 1);
  assert.equal(step1.accuracyPct, 0);
  assert.equal(step1.isWeak, true);

  // 2nd attempt wrong -> isWeak: true (0%)
  const step2 = calcMastery(step1, false, 4);
  assert.equal(step2.attempts, 2);
  assert.equal(step2.accuracyPct, 0);
  assert.equal(step2.isWeak, true);

  // 3rd attempt correct -> accuracy 33.3%, still < 60% -> isWeak: true
  const step3 = calcMastery(step2, true, 0);
  assert.equal(step3.attempts, 3);
  assert.equal(step3.accuracyPct, 33.3);
  assert.equal(step3.isWeak, true);

  // 4th and 5th attempts correct -> accuracy 60% -> isWeak: false
  const step4 = calcMastery(step3, true, 0);
  assert.equal(step4.attempts, 4);
  assert.equal(step4.accuracyPct, 50);
  assert.equal(step4.isWeak, true);

  const step5 = calcMastery(step4, true, 0);
  assert.equal(step5.attempts, 5);
  assert.equal(step5.accuracyPct, 60);
  assert.equal(step5.isWeak, false);
});

test('Base paper ladder progression: starts at 1, increments progressively, cycles past available count', () => {
  const getNextNumber = (latestAttempted: number | null, availableCount: number): number => {
    if (availableCount === 0) return 1;
    if (!latestAttempted) return 1;
    const next = latestAttempted + 1;
    return next > availableCount ? 1 : next;
  };

  // First mock exam -> starts at 1
  assert.equal(getNextNumber(null, 5), 1);

  // After completing Paper #1 -> advances to Paper #2
  assert.equal(getNextNumber(1, 5), 2);

  // After completing Paper #2 -> advances to Paper #3
  assert.equal(getNextNumber(2, 5), 3);

  // After completing Paper #5 -> cycles back to Paper #1
  assert.equal(getNextNumber(5, 5), 1);
});

test('JEE Main 90/10 Hybrid exam structure: 70 base + 5 weak injection = exactly 75 questions', () => {
  const baseQuestions = Array.from({ length: 75 }, (_, i) => {
    const subject = i < 25 ? 'Physics' : i < 50 ? 'Chemistry' : 'Mathematics';
    const subIdx = i % 25;
    const questionType = subIdx < 20 ? 'mcq_single' : 'integer';
    return { id: `base-q-${i + 1}`, subject, questionType, topic: `topic-${subject}` };
  });

  assert.equal(baseQuestions.length, 75);
  assert.equal(baseQuestions.filter((q) => q.subject === 'Physics').length, 25);
  assert.equal(baseQuestions.filter((q) => q.subject === 'Chemistry').length, 25);
  assert.equal(baseQuestions.filter((q) => q.subject === 'Mathematics').length, 25);

  // Student has weak topic in Physics
  const weakTopic = { topicId: 'phy-kinematics-11', subject: 'Physics', name: 'Kinematics' };
  const weakQuestions = Array.from({ length: 5 }, (_, i) => ({
    id: `weak-q-${i + 1}`,
    subject: weakTopic.subject,
    questionType: 'mcq_single',
    topic: weakTopic.name,
  }));

  // Hybrid injection logic
  const subjects = ['Physics', 'Chemistry', 'Mathematics'];
  const questionsBySubject = new Map<string, Array<{ id: string; subject: string; sourceType: string }>>();
  for (const s of subjects) {
    questionsBySubject.set(s, baseQuestions.filter((q) => q.subject === s).map((q) => ({ ...q, sourceType: 'BASE' })));
  }

  // Inject 5 weak questions into Physics
  const phyList = questionsBySubject.get(weakTopic.subject)!;
  for (let i = 0; i < 5; i++) {
    phyList[phyList.length - 1 - i] = {
      ...weakQuestions[i]!,
      sourceType: 'WEAK_INJECTION',
    };
  }

  const finalExam: Array<{ id: string; subject: string; sourceType: string; questionNumber: number }> = [];
  let gNum = 1;
  for (const s of subjects) {
    const shuffled = fisherYatesShuffle(questionsBySubject.get(s)!);
    for (const item of shuffled) {
      finalExam.push({ ...item, questionNumber: gNum++ });
    }
  }

  // Total questions MUST be exactly 75
  assert.equal(finalExam.length, 75);

  // Exact 25 per subject
  assert.equal(finalExam.filter((q) => q.subject === 'Physics').length, 25);
  assert.equal(finalExam.filter((q) => q.subject === 'Chemistry').length, 25);
  assert.equal(finalExam.filter((q) => q.subject === 'Mathematics').length, 25);

  // Exactly 5 questions are weak injections
  const injected = finalExam.filter((q) => q.sourceType === 'WEAK_INJECTION');
  assert.equal(injected.length, 5);
  assert.ok(injected.every((q) => q.subject === 'Physics'));

  // Exactly 70 questions are from base paper
  const base = finalExam.filter((q) => q.sourceType === 'BASE');
  assert.equal(base.length, 70);
});

test('JEE Advanced 90/10 Hybrid exam structure: 46 base + 5 weak injection = exactly 51 questions', () => {
  const baseQuestions = Array.from({ length: 51 }, (_, i) => {
    const subject = i < 17 ? 'Physics' : i < 34 ? 'Chemistry' : 'Mathematics';
    const subIdx = i % 17;
    const questionType = subIdx < 7 ? 'mcq_single' : subIdx < 11 ? 'mcq_multi' : 'integer';
    return { id: `adv-q-${i + 1}`, subject, questionType, topic: `topic-${subject}` };
  });

  assert.equal(baseQuestions.length, 51);
  assert.equal(baseQuestions.filter((q) => q.subject === 'Physics').length, 17);
  assert.equal(baseQuestions.filter((q) => q.subject === 'Chemistry').length, 17);
  assert.equal(baseQuestions.filter((q) => q.subject === 'Mathematics').length, 17);

  // Weak topic in Mathematics
  const weakTopic = { topicId: 'math-definite-integrals-12', subject: 'Mathematics', name: 'Definite Integration' };
  const weakQuestions = Array.from({ length: 5 }, (_, i) => ({
    id: `weak-math-${i + 1}`,
    subject: weakTopic.subject,
    questionType: 'mcq_single',
    topic: weakTopic.name,
  }));

  const subjects = ['Physics', 'Chemistry', 'Mathematics'];
  const questionsBySubject = new Map<string, Array<{ id: string; subject: string; sourceType: string }>>();
  for (const s of subjects) {
    questionsBySubject.set(s, baseQuestions.filter((q) => q.subject === s).map((q) => ({ ...q, sourceType: 'BASE' })));
  }

  // Replace 5 mcq_single questions in Mathematics with weak injection
  const mathList = questionsBySubject.get('Mathematics')!;
  for (let i = 0; i < 5; i++) {
    mathList[i] = { ...weakQuestions[i]!, sourceType: 'WEAK_INJECTION' };
  }

  const finalExam: Array<{ id: string; subject: string; sourceType: string }> = [];
  for (const s of subjects) {
    finalExam.push(...fisherYatesShuffle(questionsBySubject.get(s)!));
  }

  assert.equal(finalExam.length, 51);
  assert.equal(finalExam.filter((q) => q.subject === 'Physics').length, 17);
  assert.equal(finalExam.filter((q) => q.subject === 'Chemistry').length, 17);
  assert.equal(finalExam.filter((q) => q.subject === 'Mathematics').length, 17);
  assert.equal(finalExam.filter((q) => q.sourceType === 'WEAK_INJECTION').length, 5);
  assert.equal(finalExam.filter((q) => q.sourceType === 'BASE').length, 46);
});

test('NEET 90/10 Hybrid exam structure: 175 base + 5 weak injection = exactly 180 questions', () => {
  const subjects = ['Physics', 'Chemistry', 'Botany', 'Zoology'];
  const baseQuestions = Array.from({ length: 180 }, (_, i) => {
    const subject = subjects[Math.floor(i / 45)]!;
    return { id: `neet-q-${i + 1}`, subject, questionType: 'mcq_single', topic: `topic-${subject}` };
  });

  assert.equal(baseQuestions.length, 180);
  for (const s of subjects) {
    assert.equal(baseQuestions.filter((q) => q.subject === s).length, 45);
  }

  // Weak topic in Botany
  const weakTopic = { topicId: 'bot-plant-kingdom-11', subject: 'Botany', name: 'Plant Kingdom' };
  const weakQuestions = Array.from({ length: 5 }, (_, i) => ({
    id: `weak-bot-${i + 1}`,
    subject: weakTopic.subject,
    questionType: 'mcq_single',
    topic: weakTopic.name,
  }));

  const questionsBySubject = new Map<string, Array<{ id: string; subject: string; sourceType: string }>>();
  for (const s of subjects) {
    questionsBySubject.set(s, baseQuestions.filter((q) => q.subject === s).map((q) => ({ ...q, sourceType: 'BASE' })));
  }

  const botList = questionsBySubject.get('Botany')!;
  for (let i = 0; i < 5; i++) {
    botList[i] = { ...weakQuestions[i]!, sourceType: 'WEAK_INJECTION' };
  }

  const finalExam: Array<{ id: string; subject: string; sourceType: string }> = [];
  for (const s of subjects) {
    finalExam.push(...fisherYatesShuffle(questionsBySubject.get(s)!));
  }

  assert.equal(finalExam.length, 180);
  for (const s of subjects) {
    assert.equal(finalExam.filter((q) => q.subject === s).length, 45);
  }
  assert.equal(finalExam.filter((q) => q.sourceType === 'WEAK_INJECTION').length, 5);
  assert.equal(finalExam.filter((q) => q.sourceType === 'BASE').length, 175);
});

test('Anti-cheating Fisher-Yates shuffle randomizes question presentation across students', () => {
  const originalOrder = Array.from({ length: 25 }, (_, i) => `Q${i + 1}`);
  const student1Order = fisherYatesShuffle([...originalOrder]);
  const student2Order = fisherYatesShuffle([...originalOrder]);

  // Both students have all 25 questions
  assert.equal(student1Order.length, 25);
  assert.equal(student2Order.length, 25);
  assert.deepEqual(new Set(student1Order), new Set(originalOrder));
  assert.deepEqual(new Set(student2Order), new Set(originalOrder));

  // The permutations are distinct (anti-cheating)
  assert.notDeepEqual(student1Order, student2Order);
});
