import type { PaperSet, Subject, AnswerResult } from '@/types';
import { SUBJECT_COLOR, SUBJECT_ICON } from '@/lib/subjects';

/* Light background tint used behind each subject on the review screen */
const REVIEW_BG: Record<string, string> = {
  Physics: '#eff6ff',
  Chemistry: '#f0fdf4',
  Mathematics: '#f5f3ff',
};

export const REVIEW_SUBJ: Record<string, { color: string; icon: string; bg: string }> = Object.fromEntries(
  Object.keys(REVIEW_BG).map((subject) => [
    subject,
    { color: SUBJECT_COLOR[subject], icon: SUBJECT_ICON[subject], bg: REVIEW_BG[subject] },
  ]),
);

/* ─── Types ─────────────────────────────────────────────── */
export type AppState = 'wizard' | 'loading' | 'exam' | 'summary' | 'review';
export type WizardStep = 1 | 2 | 3;
export type DiffOption = 'beginner' | 'intermediate' | 'advanced' | 'mixed';
export type MarkingScheme = 'standard' | 'jee_main' | 'jee_advanced';
export type StoredResult = AnswerResult & { selectedAnswer: string };

export const SUBJECTS_FOR_PAPERS: Subject[] = ['Physics', 'Chemistry', 'Mathematics'];
export const DIFFICULTY_LABELS: Array<[string, string]> = [
  ['beginner', 'easy'],
  ['intermediate', 'medium'],
  ['advanced', 'hard'],
];

/* Short plain-text snippet of a question for the paper cards (LaTeX stripped) */
export function previewText(text: string): string {
  const plain = text
    .replace(/\$\$?/g, ' ')
    .replace(/\\begin\{[^}]*\}|\\end\{[^}]*\}/g, ' ')
    .replace(/\\\\/g, ' ')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[{}&_^]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > 150 ? plain.slice(0, 150) + '…' : plain;
}

/* A paper that looks like a real question paper. The questions stay blurred until the student starts it. */
export function PaperCard({ paper, onStart }: { paper: PaperSet; onStart: () => void }) {
  // Subjects come from the paper itself, so NEET papers show Botany and Zoology too
  const paperSubjects = [...new Set(paper.questions.map((q) => q.subject))];
  const subjectCounts = paperSubjects
    .map((s) => ({ s, n: paper.questions.filter((q) => q.subject === s).length }))
    .filter((x) => x.n > 0);
  const diffCounts = DIFFICULTY_LABELS
    .map(([key, label]) => ({ key, label, n: paper.questions.filter((q) => q.difficulty === key).length }))
    .filter((x) => x.n > 0);
  const topicCount = new Set(paper.questions.map((q) => q.topic)).size;
  const teaser = paper.questions.slice(0, 3).map((q) => previewText(q.questionText));
  const total = paper.questions.length || 1;

  return (
    <button type="button" className="paper-sheet" onClick={onStart}>
      <div className="paper-sheet-head">
        <span className="paper-no">Paper {String(paper.number).padStart(2, '0')}</span>
        <span className="paper-count">{paper.questions.length} questions</span>
      </div>

      <div className="paper-chips">
        {subjectCounts.map(({ s, n }) => (
          <span key={s} className="paper-chip">{SUBJECT_ICON[s]} {s} · {n}</span>
        ))}
      </div>

      <div className="paper-teaser" aria-hidden="true">
        {teaser.map((t, i) => <p key={i}>{t}</p>)}
      </div>

      <div className="paper-diff" aria-hidden="true">
        {diffCounts.map((d) => (
          <span key={d.key} className={`paper-diff-seg paper-diff-${d.key}`} style={{ flexGrow: d.n / total }} />
        ))}
      </div>

      <div className="paper-foot">
        <span>{topicCount} topics · {diffCounts.map((d) => `${d.n} ${d.label}`).join(' · ')}</span>
        <span className="paper-start">Start →</span>
      </div>
    </button>
  );
}

export const CHECK_SVG = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
