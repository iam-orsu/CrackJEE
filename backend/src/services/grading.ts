/*
 * The one place that decides whether a submitted answer is correct.
 * Used by practice answers (answerController) and mock scoring (scoringService).
 */

export function matchInteger(submitted: string, correct: string): boolean {
  const subClean = submitted.trim().replace(/^\+/, '');
  const corClean = correct.trim().replace(/^\+/, '');
  if (subClean === corClean) return true;
  const subNum = Number(subClean);
  const corNum = Number(corClean);
  if (!Number.isNaN(subNum) && !Number.isNaN(corNum)) {
    return subNum === corNum;
  }
  return false;
}

/**
 * Single-correct: exactly one option letter. "C" and "(C)" are accepted; "A,C" or "AB" are not,
 * so a multi-letter submission can never be graded as its first letter.
 */
export function matchSingle(submitted: string, correct: string): boolean {
  const sub = submitted.trim().toUpperCase();
  if (sub.includes(',')) return false;
  const subLetters = sub.replace(/[^A-D]/g, '');
  if (subLetters.length !== 1) return false;
  const corLetter = correct.trim().toUpperCase().replace(/[^A-D]/g, '').slice(0, 1);
  return corLetter !== '' && subLetters === corLetter;
}

/** Multi-correct: same set of letters, order does not matter ("C,A" equals "A,C"). */
export function matchMulti(submitted: string, correct: string): boolean {
  const sub = new Set(submitted.toUpperCase().split(',').map((s) => s.trim().replace(/[^A-D]/g, '')).filter(Boolean));
  const cor = new Set(correct.toUpperCase().split(',').map((s) => s.trim().replace(/[^A-D]/g, '')).filter(Boolean));
  if (sub.size !== cor.size) return false;
  for (const v of sub) if (!cor.has(v)) return false;
  return true;
}

export function checkAnswer(questionType: string, submitted: string, correct: string): boolean {
  if (questionType === 'mcq_multi') return matchMulti(submitted, correct);
  if (questionType === 'integer') return matchInteger(submitted, correct);
  return matchSingle(submitted, correct);
}
