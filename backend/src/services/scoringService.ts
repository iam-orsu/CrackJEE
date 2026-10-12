export function scoreQuestion(
  examType: string,
  questionType: string,
  submitted: string | null,
  correct: string,
): number {
  if (!submitted || submitted.trim() === '') return 0;

  if (examType === 'Main') {
    if (questionType === 'integer') {
      return submitted.trim() === correct.trim() ? 4 : 0;
    }
    return submitted.toUpperCase() === correct.toUpperCase() ? 4 : -1;
  }

  // JEE Advanced
  if (questionType === 'integer') {
    return submitted.trim() === correct.trim() ? 4 : 0;
  }
  if (questionType === 'mcq_single') {
    return submitted.toUpperCase() === correct.toUpperCase() ? 3 : -1;
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
  if (examType === 'Main') return 4;
  if (questionType === 'mcq_single') return 3;
  return 4; // mcq_multi and integer both max 4 in Advanced
}
