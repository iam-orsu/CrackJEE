/**
 * Evaluates submitted answers across mcq_single, mcq_multi, and integer question types.
 */
export class GradingService {
  public matchInteger(submitted: string, correct: string): boolean {
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

  public matchSingle(submitted: string, correct: string): boolean {
    const sub = submitted.trim().toUpperCase();
    if (sub.includes(',')) return false;
    const subLetters = sub.replace(/[^A-D]/g, '');
    if (subLetters.length !== 1) return false;
    const corLetter = correct.trim().toUpperCase().replace(/[^A-D]/g, '').slice(0, 1);
    return corLetter !== '' && subLetters === corLetter;
  }

  public matchMulti(submitted: string, correct: string): boolean {
    const sub = new Set(submitted.toUpperCase().split(',').map((s) => s.trim().replace(/[^A-D]/g, '')).filter(Boolean));
    const cor = new Set(correct.toUpperCase().split(',').map((s) => s.trim().replace(/[^A-D]/g, '')).filter(Boolean));
    if (sub.size !== cor.size) return false;
    for (const v of sub) if (!cor.has(v)) return false;
    return true;
  }

  public checkAnswer(questionType: string, submitted: string, correct: string): boolean {
    if (questionType === 'mcq_multi') return this.matchMulti(submitted, correct);
    if (questionType === 'integer') return this.matchInteger(submitted, correct);
    return this.matchSingle(submitted, correct);
  }
}

export const gradingService = new GradingService();
export const matchInteger = (submitted: string, correct: string) => gradingService.matchInteger(submitted, correct);
export const matchSingle = (submitted: string, correct: string) => gradingService.matchSingle(submitted, correct);
export const matchMulti = (submitted: string, correct: string) => gradingService.matchMulti(submitted, correct);
export const checkAnswer = (questionType: string, submitted: string, correct: string) =>
  gradingService.checkAnswer(questionType, submitted, correct);
