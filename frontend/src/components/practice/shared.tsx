import type { CSSProperties } from 'react';
import type { PaperSet, Subject, AnswerResult } from '@/types';
import { SUBJECT_COLOR } from '@/lib/subjects';
import { SubjectIcon } from './SubjectIcon';
import { ALL_SKIN, SKIN } from './skin';

/* Light background tint used behind each subject on the review screen */
const REVIEW_BG: Record<string, string> = {
  Physics: '#eff6ff',
  Chemistry: '#f0fdf4',
  Mathematics: '#f5f3ff',
};

export const REVIEW_SUBJ: Record<string, { color: string; bg: string }> = Object.fromEntries(
  Object.keys(REVIEW_BG).map((subject) => [
    subject,
    { color: SUBJECT_COLOR[subject], bg: REVIEW_BG[subject] },
  ]),
);

/* ─── Types ─────────────────────────────────────────────── */
export type AppState = 'wizard' | 'loading' | 'exam' | 'summary' | 'review';
export type WizardStep = 1 | 2 | 3;
export type DiffOption = 'beginner' | 'intermediate' | 'advanced' | 'mixed';
export type MarkingScheme = 'standard' | 'jee_main' | 'jee_advanced';
export type StoredResult = AnswerResult & { selectedAnswer: string };

export type QuestionTypeKey = 'mcq_single' | 'mcq_multi' | 'integer' | 'matrix_match';

export interface QuestionTypeCounts {
  mcq_single: number;
  mcq_multi: number;
  integer: number;
  matrix_match: number;
}

export interface TypeDifficultyBreakdown {
  easy: number;
  medium: number;
  hard: number;
}

export const MAX_TOPIC_QUESTIONS = 50;

export interface TopicCustomConfig {
  subject: Subject;
  topic: string;
  mcq: TypeDifficultyBreakdown;
  integer: TypeDifficultyBreakdown;
  multi: TypeDifficultyBreakdown;
  matrix: TypeDifficultyBreakdown;
}

export function createBalancedDifficulty(count: number): TypeDifficultyBreakdown {
  if (count <= 0) return { easy: 0, medium: 0, hard: 0 };
  if (count === 1) return { easy: 0, medium: 1, hard: 0 };
  if (count === 2) return { easy: 1, medium: 1, hard: 0 };
  if (count === 3) return { easy: 1, medium: 1, hard: 1 };
  const easy = Math.max(1, Math.round(count * 0.25));
  const hard = Math.max(1, Math.round(count * 0.35));
  const med = Math.max(0, count - easy - hard);
  return { easy, medium: med, hard };
}

export function getTypeTotal(t?: TypeDifficultyBreakdown): number {
  if (!t) return 0;
  return (t.easy || 0) + (t.medium || 0) + (t.hard || 0);
}

export function getTopicTotal(cfg?: TopicCustomConfig): number {
  if (!cfg) return 0;
  return (
    getTypeTotal(cfg.mcq) +
    getTypeTotal(cfg.integer) +
    getTypeTotal(cfg.multi) +
    getTypeTotal(cfg.matrix)
  );
}

export interface DifficultyDistribution {
  beginner: number;     // % e.g. 20
  intermediate: number; // % e.g. 40
  advanced: number;     // % e.g. 40
}

export const DEFAULT_DIFFICULTY_DISTRIBUTION: DifficultyDistribution = {
  beginner: 20,
  intermediate: 40,
  advanced: 40,
};

export function getDefaultQuestionTypes(
  count: number,
  examType: 'Main' | 'Advanced',
  isNeet: boolean,
): QuestionTypeCounts {
  if (isNeet) {
    const matrix = Math.max(1, Math.round(count * 0.2));
    const single = Math.max(0, count - matrix);
    return { mcq_single: single, integer: 0, matrix_match: matrix, mcq_multi: 0 };
  }
  if (examType === 'Advanced') {
    const matrix = Math.max(1, Math.round(count * 0.2));
    const integer = Math.max(1, Math.round(count * 0.2));
    const multi = Math.max(1, Math.round(count * 0.2));
    const single = Math.max(0, count - matrix - integer - multi);
    return { mcq_single: single, integer, matrix_match: matrix, mcq_multi: multi };
  }
  // JEE Main
  const matrix = Math.max(1, Math.round(count * 0.2));
  const integer = Math.max(1, Math.round(count * 0.2));
  const single = Math.max(0, count - matrix - integer);
  return { mcq_single: single, integer, matrix_match: matrix, mcq_multi: 0 };
}

export function planTopicTypeSlots(
  count: number,
  types: QuestionTypeCounts,
  isAdvanced: boolean,
  isNeet: boolean,
): ('mcq_single' | 'mcq_multi' | 'integer' | 'matrix_match')[] {
  const slots: ('mcq_single' | 'mcq_multi' | 'integer' | 'matrix_match')[] = [];
  const matrix = types.matrix_match || 0;
  const integer = isNeet ? 0 : (types.integer || 0);
  const multi = isAdvanced ? (types.mcq_multi || 0) : 0;
  const single = types.mcq_single || 0;
  const total = matrix + integer + multi + single;

  if (total <= 0) {
    const def = getDefaultQuestionTypes(count, isAdvanced ? 'Advanced' : 'Main', isNeet);
    return planTopicTypeSlots(count, def, isAdvanced, isNeet);
  }

  const mCount = Math.round((matrix / total) * count);
  const iCount = isNeet ? 0 : Math.round((integer / total) * count);
  const multiCount = isAdvanced ? Math.round((multi / total) * count) : 0;
  let sCount = Math.max(0, count - mCount - iCount - multiCount);

  const currentSum = sCount + mCount + iCount + multiCount;
  if (currentSum > count) {
    const diff = currentSum - count;
    sCount = Math.max(0, sCount - diff);
  }

  for (let i = 0; i < sCount; i++) slots.push('mcq_single');
  for (let i = 0; i < iCount; i++) slots.push('integer');
  for (let i = 0; i < multiCount; i++) slots.push('mcq_multi');
  for (let i = 0; i < mCount; i++) slots.push('matrix_match');
  while (slots.length < count) slots.push('mcq_single');
  return slots.slice(0, count);
}

export function planTopicDifficultySlots(
  count: number,
  difficulty: DiffOption,
  dist?: DifficultyDistribution,
): ('beginner' | 'intermediate' | 'advanced')[] {
  const slots: ('beginner' | 'intermediate' | 'advanced')[] = [];
  if (difficulty === 'beginner') {
    for (let i = 0; i < count; i++) slots.push('beginner');
    return slots;
  }
  if (difficulty === 'intermediate') {
    for (let i = 0; i < count; i++) slots.push('intermediate');
    return slots;
  }
  if (difficulty === 'advanced') {
    for (let i = 0; i < count; i++) slots.push('advanced');
    return slots;
  }
  const bPct = dist?.beginner ?? 20;
  const iPct = dist?.intermediate ?? 40;
  const aPct = dist?.advanced ?? 40;
  const totalPct = (bPct + iPct + aPct) || 100;

  const bCount = Math.round((bPct / totalPct) * count);
  const aCount = Math.round((aPct / totalPct) * count);
  const iCount = Math.max(0, count - bCount - aCount);

  for (let i = 0; i < bCount; i++) slots.push('beginner');
  for (let i = 0; i < iCount; i++) slots.push('intermediate');
  for (let i = 0; i < aCount; i++) slots.push('advanced');
  while (slots.length < count) slots.push('intermediate');
  return slots.slice(0, count);
}

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
        <span className="paper-no">{String(paper.number).padStart(2, '0')}</span>
        <span className="paper-count">{paper.questions.length} questions</span>
      </div>

      <div className="paper-chips">
        {subjectCounts.map(({ s, n }) => {
          const skin = SKIN[s] ?? ALL_SKIN;
          return (
            <span
              key={s}
              className="paper-chip"
              style={{ '--chip': skin.deep, '--chip-soft': skin.soft } as CSSProperties}
            >
              <SubjectIcon subject={s} size={13} /> {s} · {n}
            </span>
          );
        })}
      </div>

      {/* The questions stay blurred until the paper is started */}
      <div className="paper-teaser" aria-hidden="true">
        {teaser.map((t, i) => <p key={i}>{t}</p>)}
      </div>
      <p className="paper-sealed">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
          <rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" />
        </svg>
        Sealed until you start
      </p>

      <div className="paper-diff" aria-hidden="true">
        {diffCounts.map((d) => (
          <span key={d.key} className={`paper-diff-seg paper-diff-${d.key}`} style={{ flexGrow: d.n / total }} />
        ))}
      </div>
      <div className="paper-legend">
        {diffCounts.map((d) => `${d.n} ${d.label}`).join(' · ')}
        {topicCount > 0 && ` · ${topicCount} topics`}
      </div>

      <div className="paper-foot">
        <span>Paper {String(paper.number).padStart(2, '0')}</span>
        <span className="paper-start">
          Start
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </button>
  );
}

export const CHECK_SVG = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
