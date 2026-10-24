/*
 * Published 2026 qualifying and aggregate cutoffs. Compared as percentages of the maximum marks,
 * so a one-paper mock can be placed against a full-exam cutoff without scaling.
 *
 * These come from secondary sources (see `sources`). Re-check them against the official NTA and IIT
 * notices and update this file when the official figures are confirmed.
 */

export interface CutoffLine {
  label: string;
  marks: number;
  maxMarks: number;
}

export interface ExamCutoffs {
  examType: 'NEET' | 'Advanced';
  name: string;
  lines: CutoffLine[];
  sources: Array<{ label: string; url: string }>;
}

// Careers360 reports NEET UG 2026 qualifying marks by category. For each category the reported range is
// read as "highest to lowest"; the lowest figure is taken as the qualifying line.
export const NEET_2026_CUTOFFS: ExamCutoffs = {
  examType: 'NEET',
  name: 'NEET UG 2026 qualifying',
  lines: [
    { label: 'UR / EWS (50th percentile)', marks: 213, maxMarks: 720 },
    { label: 'OBC / SC / ST (40th percentile)', marks: 177, maxMarks: 720 },
  ],
  sources: [
    {
      label: 'Careers360: NEET UG 2026 cut-offs by category',
      url: 'https://news.careers360.com/neet-ug-2026-cut-offs-rise-category-wise-cut-offs-general-obc-sc-st-mcc-counselling/amp',
    },
  ],
};

// Aggregate cutoffs for JEE Advanced 2026 (out of 360), reported by coaching sites and dated 1 June 2026
export const JEE_ADVANCED_2026_CUTOFFS: ExamCutoffs = {
  examType: 'Advanced',
  name: 'JEE Advanced 2026 aggregate',
  lines: [
    { label: 'General (CRL)', marks: 92, maxMarks: 360 },
    { label: 'GEN-EWS / OBC-NCL', marks: 82, maxMarks: 360 },
    { label: 'SC / ST / PwD', marks: 46, maxMarks: 360 },
  ],
  sources: [
    {
      label: 'Aakash: JEE Advanced 2026 cut-off, category-wise',
      url: 'https://www.aakash.ac.in/blog/jee-advanced-2026-cut-off-category-wise/',
    },
  ],
};

/**
 * Cutoffs for an exam type. JEE Main returns null: no verified 2026 Main cutoff is available,
 * so none is shown rather than an estimate.
 */
export function cutoffsFor(examType: string): ExamCutoffs | null {
  if (examType === 'NEET') return NEET_2026_CUTOFFS;
  if (examType === 'Advanced') return JEE_ADVANCED_2026_CUTOFFS;
  return null;
}
