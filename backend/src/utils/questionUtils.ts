import { MOCK_CONSTANTS } from '../config/constants';
import type { Difficulty, ExamType, QuestionType, DifficultyDistribution, QuestionTypeCounts } from '../types/index';

const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

export function randomDifficulty(): Difficulty {
  return DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)] as Difficulty;
}

export function planDifficultySlots(
  totalSlots: number,
  difficulty: Difficulty | 'mixed',
  distribution?: DifficultyDistribution,
): Difficulty[] {
  if (totalSlots <= 0) return [];

  if (distribution) {
    const bPct = Math.max(0, distribution.beginner ?? 0);
    const iPct = Math.max(0, distribution.intermediate ?? 0);
    const aPct = Math.max(0, distribution.advanced ?? 0);
    const totalPct = bPct + iPct + aPct;

    if (totalPct > 0) {
      let bCount = Math.round((bPct / totalPct) * totalSlots);
      let iCount = Math.round((iPct / totalPct) * totalSlots);
      let aCount = totalSlots - bCount - iCount;

      if (aCount < 0) {
        if (bCount + aCount >= 0) {
          bCount += aCount;
        } else {
          iCount += aCount;
        }
        aCount = 0;
      }

      const list: Difficulty[] = [
        ...Array(Math.max(0, bCount)).fill('beginner'),
        ...Array(Math.max(0, iCount)).fill('intermediate'),
        ...Array(Math.max(0, aCount)).fill('advanced'),
      ];
      return fisherYatesShuffle(list);
    }
  }

  if (difficulty !== 'mixed') {
    return Array(totalSlots).fill(difficulty);
  }

  const bCount = Math.floor(totalSlots / 3);
  const iCount = Math.floor(totalSlots / 3);
  const aCount = totalSlots - bCount - iCount;

  return fisherYatesShuffle([
    ...Array(bCount).fill('beginner'),
    ...Array(iCount).fill('intermediate'),
    ...Array(aCount).fill('advanced'),
  ]);
}

export function planQuestionTypeSlots(
  totalSlots: number,
  questionTypeCounts?: QuestionTypeCounts,
  examType?: ExamType,
): Array<QuestionType | undefined> {
  if (totalSlots <= 0) return [];

  if (questionTypeCounts) {
    const s = Math.max(0, questionTypeCounts.mcq_single ?? 0);
    const m = Math.max(0, questionTypeCounts.mcq_multi ?? 0);
    const i = Math.max(0, questionTypeCounts.integer ?? 0);
    const mat = Math.max(0, questionTypeCounts.matrix_match ?? 0);
    const sum = s + m + i + mat;

    if (sum > 0) {
      if (sum === totalSlots) {
        return fisherYatesShuffle([
          ...Array(s).fill('mcq_single'),
          ...Array(m).fill('mcq_multi'),
          ...Array(i).fill('integer'),
          ...Array(mat).fill('matrix_match'),
        ]);
      }

      let sCount = Math.round((s / sum) * totalSlots);
      let mCount = Math.round((m / sum) * totalSlots);
      let iCount = Math.round((i / sum) * totalSlots);
      let matCount = totalSlots - sCount - mCount - iCount;

      while (matCount < 0) {
        if (sCount > 0) sCount--;
        else if (iCount > 0) iCount--;
        else if (mCount > 0) mCount--;
        matCount++;
      }

      return fisherYatesShuffle([
        ...Array(Math.max(0, sCount)).fill('mcq_single'),
        ...Array(Math.max(0, mCount)).fill('mcq_multi'),
        ...Array(Math.max(0, iCount)).fill('integer'),
        ...Array(Math.max(0, matCount)).fill('matrix_match'),
      ]);
    }
  }

  return Array(totalSlots).fill(undefined);
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
