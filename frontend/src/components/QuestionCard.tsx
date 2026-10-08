'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Question, AnswerResult } from '@/types';
import { DiagramRenderer } from './DiagramRenderer';

interface Props {
  question: Question;
  questionNum: number;
  onSubmit: (answer: string, timeSpent: number) => Promise<AnswerResult>;
  onNext: () => void;
  initialResult?: AnswerResult;
  initialSelected?: string;
  isLast?: boolean;
}

const CHECK = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const CROSS = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Subject visual config
const SUBJECT_STYLE: Record<string, { bg: string; accent: string; textColor: string; icon: React.ReactNode }> = {
  Physics: {
    bg: '#eff6ff',
    accent: '#2563eb',
    textColor: '#1d4ed8',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="3"/>
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0 12 12)"/>
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
      </svg>
    ),
  },
  Chemistry: {
    bg: '#f0fdf4',
    accent: '#16a34a',
    textColor: '#15803d',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M9 3h6v7l3.5 6.5A2 2 0 0116.76 19H7.24a2 2 0 01-1.74-2.5L9 10V3z"/>
        <path d="M9 3H7M15 3h2M7 10h10"/>
      </svg>
    ),
  },
  Mathematics: {
    bg: '#f5f3ff',
    accent: '#7c3aed',
    textColor: '#6d28d9',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="8" y1="8" x2="16" y2="16" strokeWidth="1.4"/>
      </svg>
    ),
  },
};

function stripOptionPrefix(opt: string): string {
  return opt.replace(/^[A-Da-d][).]\s*/, '').trim();
}

// Strip LaTeX commands that appear inline in prose and would break KaTeX if wrapped in $...$
function preprocessLatex(text: string): string {
  const SUB = '₀₁₂₃₄₅₆₇₈₉';
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';

  function ceFormulaToUnicode(f: string): string {
    return f
      .replace(/_\{(\d+)\}/g, (_, n: string) => n.replace(/\d/g, (d) => SUB[+d] ?? d))
      .replace(/_(\d)/g, (_, d: string) => SUB[+d] ?? d)
      .replace(/\^\{(\d+)\}/g, (_, n: string) => n.replace(/\d/g, (d) => SUP[+d] ?? d))
      .replace(/\^(\d)/g, (_, d: string) => SUP[+d] ?? d)
      .replace(/([A-Za-z)])(\d+)/g, (_, ch: string, n: string) => ch + n.replace(/\d/g, (d) => SUB[+d] ?? d))
      .replace(/\\cdot/g, '·').replace(/\*/g, '·');
  }

  return text
    // \ce{...} chemistry notation
    .replace(/\\ce\s*\{([^}]+)\}/g, (_, f: string) => ceFormulaToUnicode(f))
    .replace(/\\ce\s*([A-Za-z0-9_^{}\-+·*]+)/g, (_, f: string) => ceFormulaToUnicode(f))
    // Temperature/angle degree: \,^\circ\text{C} → °C
    .replace(/\\[,;!]\s*\^\{?\\circ\}?\s*\\text\{([A-Za-z])\}/g, '°$1')
    .replace(/\^\{?\\circ\}?\s*\\text\{([A-Za-z])\}/g, '°$1')
    .replace(/\\[,;!]\s*\^\{?\\circ\}?/g, '°')
    .replace(/\^\{?\\circ\}?/g, '°')
    .replace(/\\degree/g, '°')
    // \text{...} → its plain content
    .replace(/\\text\{([^}]*)\}/g, '$1')
    // Thin/negative spacing macros → plain space or nothing
    .replace(/\\[,;!]/g, ' ')
    // Common units that appear bare in prose
    .replace(/\\Omega/g, 'Ω')
    .replace(/\\mu/g, 'μ')
    .replace(/\\times/g, '×')
    .replace(/\\mathrm\{([^}]*)\}/g, '$1')
    .replace(/\\mathbf\{([^}]*)\}/g, '$1')
    .replace(/\\mathit\{([^}]*)\}/g, '$1')
    .replace(/\\cdotp/g, '·')
    .replace(/\\cdot/g, '·')
    .replace(/\\pm/g, '±');
}

// If text has bare LaTeX commands but no $ delimiters, add them so KaTeX renders
function ensureMathDelimiters(text: string): string {
  if (/\$|\\\(|\\\[/.test(text)) return text;           // already delimited
  if (!/\\[a-zA-Z]|[_^]\{/.test(text)) return text;    // no LaTeX at all
  // Find where math begins, extend back to include adjacent alphanumerics
  let start = text.search(/\\[a-zA-Z]|[_^]\{/);
  while (start > 0 && /[a-zA-Z0-9]/.test(text[start - 1]!)) start--;
  return text.slice(0, start) + '$' + text.slice(start).trim() + '$';
}

function renderMath(el: HTMLElement | null) {
  if (!el) return;
  const win = window as unknown as { renderMathInElement?: (el: HTMLElement, opts: object) => void };
  if (typeof win.renderMathInElement === 'function') {
    win.renderMathInElement(el, {
      delimiters: [
        { left: '\\(', right: '\\)', display: false },
        { left: '\\[', right: '\\]', display: true },
        { left: '$', right: '$', display: false },
        { left: '$$', right: '$$', display: true },
      ],
      throwOnError: false,
    });
  }
}

export function QuestionCard({ question, questionNum, onSubmit, onNext, initialResult, initialSelected, isLast }: Props) {
  const [selected, setSelected] = useState<string | null>(initialSelected ?? null);
  const [result, setResult]     = useState<AnswerResult | null>(initialResult ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [elapsed, setElapsed]   = useState(0);
  const startRef  = useRef(Date.now());
  const timerRef  = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const cardRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialResult) return; // already answered — keep pre-populated state, no timer
    setSelected(null);
    setResult(null);
    setElapsed(0);
    startRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);

    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  // Render math after question changes and after result (explanation may have math)
  useEffect(() => {
    const raf = requestAnimationFrame(() => renderMath(cardRef.current));
    return () => cancelAnimationFrame(raf);
  }, [question.id, result]);

  const handleSubmit = useCallback(async () => {
    if (!selected || submitting || result) return;
    clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const timeSpent = Math.max(1, Math.floor((Date.now() - startRef.current) / 1000));
      const res = await onSubmit(selected, timeSpent);
      setResult(res);
    } finally {
      setSubmitting(false);
    }
  }, [selected, submitting, result, onSubmit]);

  const letters = ['A', 'B', 'C', 'D'];
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  const subjectStyle = SUBJECT_STYLE[question.subject] ?? SUBJECT_STYLE['Physics']!;

  return (
    <div ref={cardRef} className="card" style={{ borderRadius: 'var(--radius-xl)', padding: 0, overflow: 'hidden' }}>
      {/* ── Subject header banner ── */}
      <div style={{ background: subjectStyle.bg, borderBottom: `1px solid ${subjectStyle.accent}22`, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: subjectStyle.accent, display: 'flex', alignItems: 'center' }}>{subjectStyle.icon}</span>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: subjectStyle.accent, lineHeight: 1 }}>{question.subject}</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: subjectStyle.textColor, marginTop: 2 }}>{question.topic}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, color: subjectStyle.accent, background: `${subjectStyle.accent}18`, padding: '3px 8px', borderRadius: 4, textTransform: 'capitalize' }}>{question.difficulty}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: subjectStyle.textColor, fontVariantNumeric: 'tabular-nums' }}>{mm}:{ss}</span>
          <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>Q{questionNum}</span>
        </div>
      </div>

      {/* ── Body: two-column when explanation visible ── */}
      <div className={`qcard-body${result?.explanation ? ' qcard-body-split' : ''}`}>
        {/* ── Left: question + options ── */}
        <div className="qcard-left">
          {question.diagram && <DiagramRenderer descriptor={question.diagram} />}
          <p className="question-text">{ensureMathDelimiters(preprocessLatex(question.questionText))}</p>

          <div className="options-grid">
            {question.options.map((opt, i) => {
              const letter    = letters[i] ?? String.fromCharCode(65 + i);
              const isSelected = selected === letter;
              const isCorrect  = result && letter === result.correctAnswer;
              const isWrong    = result && isSelected && !result.isCorrect;

              let cls = 'option-btn';
              if (isCorrect)    cls += ' correct';
              else if (isWrong) cls += ' wrong';
              else if (isSelected) cls += ' selected';

              return (
                <button
                  key={letter}
                  className={cls}
                  onClick={() => !result && setSelected(letter)}
                  disabled={!!result}
                >
                  <span className="option-letter">{letter}</span>
                  <span style={{ flex: 1 }}>{ensureMathDelimiters(preprocessLatex(stripOptionPrefix(opt)))}</span>
                  {isCorrect && <span style={{ flexShrink: 0, color: 'var(--green-600)' }}>{CHECK}</span>}
                  {isWrong   && <span style={{ flexShrink: 0, color: 'var(--red-600)' }}>{CROSS}</span>}
                </button>
              );
            })}
          </div>

          {/* Result banner */}
          {result && (
            <div className={`result-banner${result.isCorrect ? ' correct' : ' wrong'}`} style={{ marginTop: 16 }}>
              {result.isCorrect ? CHECK : CROSS}
              {result.isCorrect
                ? `Correct! Solved in ${mm}:${ss}`
                : `Incorrect. Correct answer: ${result.correctAnswer}`}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ marginTop: 16 }}>
            {result ? (
              <button className="btn btn-primary" onClick={onNext}>
                {isLast ? 'Finish session ✓' : 'Next question →'}
              </button>
            ) : (
              <>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={!selected || submitting}
                >
                  {submitting ? 'Checking...' : 'Submit answer'}
                </button>
                {!selected && (
                  <span style={{ marginLeft: 12, fontSize: 13, color: 'var(--gray-400)' }}>
                    Select an option first
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Right: explanation panel (only after submit and when explanation exists) ── */}
        {result?.explanation && (
          <div className="qcard-explanation">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--navy-600)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--navy-600)' }}>
                Explanation
              </span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--gray-700)' }}>
              {result.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
