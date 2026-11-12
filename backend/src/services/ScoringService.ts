import { gradingService } from './GradingService';

/**
 * Exam marking scheme calculation for JEE Main, NEET, and JEE Advanced.
 */
export class ScoringService {
  public scoreQuestion(
    examType: string,
    questionType: string,
    submitted: string | null,
    correct: string,
  ): number {
    if (!submitted || submitted.trim() === '') return 0;

    if (examType === 'Main' || examType === 'NEET') {
      if (questionType === 'integer') {
        return gradingService.matchInteger(submitted, correct) ? 4 : 0;
      }
      return gradingService.matchSingle(submitted, correct) ? 4 : -1;
    }

    if (questionType === 'integer') {
      return gradingService.matchInteger(submitted, correct) ? 3 : 0;
    }
    if (questionType === 'mcq_single') {
      return gradingService.matchSingle(submitted, correct) ? 3 : -1;
    }
    if (questionType === 'mcq_multi') {
      const sub = new Set(submitted.toUpperCase().split(',').map((s) => s.trim()).filter(Boolean));
      const cor = new Set(correct.toUpperCase().split(',').map((s) => s.trim()).filter(Boolean));
      const hasWrong = [...sub].some((x) => !cor.has(x));
      if (hasWrong) return -2;
      if (sub.size === cor.size) return 4;
      return sub.size;
    }
    return 0;
  }

  public getMaxMarkPerQuestion(examType: string, questionType: string): number {
    if (examType === 'Main' || examType === 'NEET') return 4;
    if (questionType === 'mcq_single' || questionType === 'integer') return 3;
    return 4;
  }
}

export const scoringService = new ScoringService();
export const scoreQuestion = (
  examType: string,
  questionType: string,
  submitted: string | null,
  correct: string,
) => scoringService.scoreQuestion(examType, questionType, submitted, correct);
export const getMaxMarkPerQuestion = (examType: string, questionType: string) =>
  scoringService.getMaxMarkPerQuestion(examType, questionType);
