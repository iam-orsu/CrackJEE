/*
 * Topic rotation for mock exams. Pure functions, so they can be unit tested without a database.
 *
 * For each subject, a student's mocks walk through that subject's topic list in order, a fixed number of
 * fresh topics per mock. When every topic has been covered, the walk starts again from the first topic.
 * Each mock also revisits one weak topic per subject from the student's previous mock.
 */

import { JEE_TOPICS_BY_CLASS, NEET_TOPICS_BY_CLASS } from '../types/index';

export const FRESH_TOPICS_PER_SUBJECT = 10;
// The weak topic from the last mock is asked this many times in the next mock
export const WEAK_TOPIC_QUESTIONS = 2;

/** Every topic of a subject in syllabus order (Class 11 then Class 12) */
export function fullTopicList(examType: 'Main' | 'Advanced' | 'NEET', subject: string): string[] {
  if (examType === 'NEET') {
    const map = NEET_TOPICS_BY_CLASS[subject];
    return map ? [...map.class11, ...map.class12] : [];
  }
  const map = JEE_TOPICS_BY_CLASS[subject];
  return map ? [...map.class11, ...map.class12] : [];
}

export interface SubjectPlan {
  // One topic per question slot, in the order questions are generated
  questionTopics: string[];
  // Topics already covered in the current rotation, before this mock
  covered: Set<string>;
  weakTopic: string | null;
}

/**
 * The topics for one subject's questions in the next mock.
 * `covered` is what the student has already had in the current rotation. The weak topic is asked
 * WEAK_TOPIC_QUESTIONS times, and the rest of the slots are spread over the fresh topics.
 */
export function planSubjectTopics(
  topicList: string[],
  covered: Set<string>,
  weakTopic: string | null,
  questionCount: number,
): SubjectPlan {
  if (topicList.length === 0) return { questionTopics: [], covered, weakTopic: null };

  const weak = weakTopic && topicList.includes(weakTopic) ? weakTopic : null;
  const rotationCovered = new Set(covered);

  // Fresh topics are the next uncovered ones in syllabus order. If the rotation is finished, start again.
  let pool = topicList.filter((t) => !rotationCovered.has(t) && t !== weak);
  if (pool.length === 0) {
    rotationCovered.clear();
    pool = topicList.filter((t) => t !== weak);
  }
  const fresh = pool.slice(0, FRESH_TOPICS_PER_SUBJECT);
  // Fewer uncovered topics than a mock needs: fill the rest by wrapping around to the start of the list
  for (const t of topicList) {
    if (fresh.length >= FRESH_TOPICS_PER_SUBJECT) break;
    if (t !== weak && !fresh.includes(t)) fresh.push(t);
  }

  const weakSlots = weak ? WEAK_TOPIC_QUESTIONS : 0;
  const questionTopics: string[] = weak ? Array(weakSlots).fill(weak) : [];
  const freshSlots = Math.max(0, questionCount - weakSlots);
  for (let i = 0; i < freshSlots && fresh.length > 0; i++) {
    questionTopics.push(fresh[i % fresh.length]!);
  }

  // Covered before this mock. Topics this mock asks are not counted, so papers that carry them still fit.
  const asked = new Set([...fresh, ...(weak ? [weak] : [])]);
  return {
    questionTopics,
    covered: new Set([...rotationCovered].filter((t) => !asked.has(t))),
    weakTopic: weak,
  };
}

/**
 * Covered topics after a mock. When every topic in the subject has been covered, the rotation is complete
 * and the set empties, so the next mock starts the list again.
 */
export function coveredAfterMock(covered: Set<string>, mockTopics: string[], topicList: string[]): Set<string> {
  const next = new Set(covered);
  for (const t of mockTopics) next.add(t);
  const complete = topicList.length > 0 && topicList.every((t) => next.has(t));
  return complete ? new Set() : next;
}

/** The topic with the lowest accuracy among answered questions; ties go to the first topic seen */
export function weakestTopic(answers: Array<{ topic: string; correct: boolean }>): string | null {
  const byTopic = new Map<string, { correct: number; attempts: number }>();
  for (const a of answers) {
    const entry = byTopic.get(a.topic) ?? { correct: 0, attempts: 0 };
    entry.attempts++;
    if (a.correct) entry.correct++;
    byTopic.set(a.topic, entry);
  }
  let worst: string | null = null;
  let worstAccuracy = Infinity;
  for (const [topic, { correct, attempts }] of byTopic) {
    const accuracy = correct / attempts;
    if (accuracy < worstAccuracy) {
      worstAccuracy = accuracy;
      worst = topic;
    }
  }
  return worst;
}

/**
 * A stored paper fits a student's plan when, for every subject, it only repeats the weak topic from
 * the last mock and uses no topic the student has already covered in this rotation.
 */
export function paperFitsPlan(
  items: Array<{ subject: string; topic?: string }>,
  plan: Record<string, { covered: Set<string>; weakTopic: string | null }>,
): boolean {
  for (const [subject, subjectPlan] of Object.entries(plan)) {
    const subjectItems = items.filter((i) => i.subject === subject);
    // Papers stored before topics were recorded cannot be checked, so they are not reused
    if (subjectItems.some((i) => !i.topic)) return false;
    const topics = new Set(subjectItems.map((i) => i.topic as string));
    if (subjectPlan.weakTopic && !topics.has(subjectPlan.weakTopic)) return false;
    for (const topic of topics) {
      if (topic === subjectPlan.weakTopic) continue;
      if (subjectPlan.covered.has(topic)) return false;
    }
  }
  return true;
}
