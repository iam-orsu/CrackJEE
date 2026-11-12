import { MOCK_CONSTANTS } from '../config/constants';
import type { Difficulty, ExamType, QuestionType } from '../types/index';

const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

export function randomDifficulty(): Difficulty {
  return DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)] as Difficulty;
}

export function pickQuestionType(examType: ExamType): QuestionType {
  if (examType !== 'Advanced') {
    return Math.random() < 0.70 ? 'mcq_single' : 'integer';
  }
  const r = Math.random();
  if (r < 0.40) return 'mcq_single';
  if (r < 0.75) return 'mcq_multi';
  return 'integer';
}

export function normalizeBankExamType(examType: ExamType): 'NEET' | 'Advanced' | 'Main' {
  if (examType === 'NEET') return 'NEET';
  if (examType === 'Advanced') return 'Advanced';
  return 'Main';
}

/**
 * In-place Fisher-Yates array shuffle returning a newly allocated shuffled array.
 */
export function fisherYatesShuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = result[i]!;
    result[i] = result[j]!;
    result[j] = tmp;
  }
  return result;
}

/**
 * Distribute question slots across selected topics following the distribution rules.
 */
export function distributeTopicSlots(topics: string[], totalSlots: number): string[] {
  if (topics.length === 0 || totalSlots <= 0) return [];
  if (topics.length === 1) return Array(totalSlots).fill(topics[0]!);

  const shuffled = fisherYatesShuffle(topics);
  const n = shuffled.length;

  if (totalSlots <= n) {
    return shuffled.slice(0, totalSlots);
  }

  if (totalSlots <= 2 * n) {
    const result = [...shuffled];
    const secondPass = fisherYatesShuffle(shuffled).slice(0, totalSlots - n);
    result.push(...secondPass);
    return fisherYatesShuffle(result);
  }

  const result: string[] = [];
  const base = Math.floor(totalSlots / n);
  const remainder = totalSlots % n;
  for (let i = 0; i < n; i++) {
    const count = base + (i < remainder ? 1 : 0);
    for (let c = 0; c < count; c++) result.push(shuffled[i]!);
  }
  return fisherYatesShuffle(result);
}

/** True once the exam's time (plus grace) is up. Answers saved after this are rejected. */
export function isExamExpired(
  startedAt: Date | null,
  durationSeconds: number,
  now: number = Date.now(),
  graceMs: number = MOCK_CONSTANTS.ANSWER_GRACE_MS,
): boolean {
  if (!startedAt) return false;
  return now > startedAt.getTime() + durationSeconds * 1000 + graceMs;
}
