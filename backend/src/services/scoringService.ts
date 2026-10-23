import { matchInteger, matchSingle } from './grading';

/*
 * Marks per question, per CLAUDE.md:
 *  - JEE Main / NEET: single-correct +4 / -1, integer +4 / 0
 *  - JEE Advanced: single-correct +3 / -1, multi-correct +4 all right, +1 per correct option
 *    when nothing wrong is picked, -2 if any wrong option is picked, integer +3 / 0
 */
export function scoreQuestion(
  examType: string,
  questionType: string,
  submitted: string | null,
  correct: string,
): number {
  if (!submitted || submitted.trim() === '') return 0;

  if (examType === 'Main' || examType === 'NEET') {
    if (questionType === 'integer') {
      return matchInteger(submitted, correct) ? 4 : 0;
    }
    return matchSingle(submitted, correct) ? 4 : -1;
  }

  // JEE Advanced
  if (questionType === 'integer') {
    return matchInteger(submitted, correct) ? 3 : 0;
  }
  if (questionType === 'mcq_single') {
    return matchSingle(submitted, correct) ? 3 : -1;
  }
  if (questionType === 'mcq_multi') {
    const sub = new Set(submitted.toUpperCase().split(',').map((s) => s.trim()).filter(Boolean));
    const cor = new Set(correct.toUpperCase().split(',').map((s) => s.trim()).filter(Boolean));
    const hasWrong = [...sub].some((x) => !cor.has(x));
    if (hasWrong) return -2;
    if (sub.size === cor.size) return 4; // all correct
    return sub.size; // partial: +1 per correct option selected (max 3)
  }
  return 0;
}

export function getMaxMarkPerQuestion(examType: string, questionType: string): number {
  if (examType === 'Main' || examType === 'NEET') return 4;
  if (questionType === 'mcq_single' || questionType === 'integer') return 3;
  return 4; // mcq_multi
}
