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

const SUBJECT_STYLE: Record<string, { bg: string; accent: string; textColor: string; icon: React.ReactNode }> = {
  Physics: {
    bg: '#eff6ff', accent: '#2563eb', textColor: '#1d4ed8',
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
    bg: '#f0fdf4', accent: '#16a34a', textColor: '#15803d',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M9 3h6v7l3.5 6.5A2 2 0 0116.76 19H7.24a2 2 0 01-1.74-2.5L9 10V3z"/>
        <path d="M9 3H7M15 3h2M7 10h10"/>
      </svg>
    ),
  },
  Mathematics: {
    bg: '#f5f3ff', accent: '#7c3aed', textColor: '#6d28d9',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="8" y1="8" x2="16" y2="16" strokeWidth="1.4"/>
      </svg>
    ),
  },
};

const QTYPE_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  mcq_multi: { label: 'Multi-correct', bg: '#fef3c7', color: '#92400e' },
  integer:   { label: 'Integer type',  bg: '#eff6ff', color: '#1e40af' },
};

function stripOptionPrefix(opt: string): string {
  return opt.replace(/^[A-Da-d][).]\s*/, '').trim();
}

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
    .replace(/\\ce\s*\{([^}]+)\}/g, (_, f: string) => ceFormulaToUnicode(f))
    .replace(/\\ce\s*([A-Za-z0-9_^{}\-+·*]+)/g, (_, f: string) => ceFormulaToUnicode(f))
    .replace(/\\[,;!]\s*\^\{?\\circ\}?\s*\\text\{([A-Za-z])\}/g, '°$1')
    .replace(/\^\{?\\circ\}?\s*\\text\{([A-Za-z])\}/g, '°$1')
    .replace(/\\[,;!]\s*\^\{?\\circ\}?/g, '°')
    .replace(/\^\{?\\circ\}?/g, '°')
    .replace(/\\degree/g, '°')
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\\[,;!]/g, ' ')
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

function ensureMathDelimiters(text: string): string {
  if (/\$|\\\(|\\\[/.test(text)) return text;
  if (!/\\[a-zA-Z]|[_^]\{/.test(text)) return text;
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
  const qt = question.questionType ?? 'mcq_single';

  // State per question type
  const [selected, setSelected]         = useState<string | null>(
    qt === 'mcq_single' ? (initialSelected ?? null) : null,
  );
  const [selectedMulti, setSelectedMulti] = useState<Set<string>>(
    () => qt === 'mcq_multi' && initialSelected
      ? new Set(initialSelected.split(',').map((s) => s.trim()))
      : new Set(),
  );
  const [integerInput, setIntegerInput]  = useState<string>(
    qt === 'integer' ? (initialSelected ?? '') : '',
  );

  const [result, setResult]       = useState<AnswerResult | null>(initialResult ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [elapsed, setElapsed]     = useState(0);
  const startRef  = useRef(Date.now());
  const timerRef  = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const cardRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    clearInterval(timerRef.current);

    if (initialResult) {
      setResult(initialResult);
      if (qt === 'mcq_multi' && initialSelected) {
        setSelectedMulti(new Set(initialSelected.split(',').map((s) => s.trim())));
      } else if (qt === 'integer') {
        setIntegerInput(initialSelected ?? '');
      } else {
        setSelected(initialSelected ?? null);
      }
      return;
    }

    setSelected(null);
    setSelectedMulti(new Set());
    setIntegerInput('');
    setResult(null);
    setElapsed(0);
    startRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => renderMath(cardRef.current));
    return () => cancelAnimationFrame(raf);
  }, [question.id, result]);

  const canSubmit =
    qt === 'mcq_multi' ? selectedMulti.size > 0
    : qt === 'integer' ? integerInput.trim() !== '' && !isNaN(parseInt(integerInput.trim(), 10)) && parseInt(integerInput.trim(), 10) >= 0
    : !!selected;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || submitting || result) return;
    clearInterval(timerRef.current);
    setSubmitting(true);

    let answer: string;
    if (qt === 'mcq_multi') {
      answer = [...selectedMulti].sort().join(',');
    } else if (qt === 'integer') {
      answer = integerInput.trim();
    } else {
      answer = selected!;
    }

    try {
      const timeSpent = Math.max(1, Math.floor((Date.now() - startRef.current) / 1000));
      const res = await onSubmit(answer, timeSpent);
      setResult(res);
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, submitting, result, qt, selectedMulti, integerInput, selected, onSubmit]);

  const letters = ['A', 'B', 'C', 'D'];
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');
  const subjectStyle = SUBJECT_STYLE[question.subject] ?? SUBJECT_STYLE['Physics']!;
  const typeBadge = QTYPE_BADGE[qt];

  // Correct letters for multi-correct result display
  const correctLetters = result?.correctAnswer
    ? result.correctAnswer.split(',').map((s) => s.trim())
    : [];

  return (
    <div ref={cardRef} className="card" style={{ borderRadius: 'var(--radius-xl)', padding: 0, overflow: 'hidden' }}>
      {/* Subject header */}
      <div style={{ background: subjectStyle.bg, borderBottom: `1px solid ${subjectStyle.accent}22`, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: subjectStyle.accent, display: 'flex', alignItems: 'center' }}>{subjectStyle.icon}</span>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: subjectStyle.accent, lineHeight: 1 }}>{question.subject}</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: subjectStyle.textColor, marginTop: 2 }}>{question.topic}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {typeBadge && (
            <span style={{ fontSize: 11, color: typeBadge.color, background: typeBadge.bg, padding: '3px 8px', borderRadius: 4, fontWeight: 600 }}>
              {typeBadge.label}
            </span>
          )}
          <span style={{ fontSize: 11, color: subjectStyle.accent, background: `${subjectStyle.accent}18`, padding: '3px 8px', borderRadius: 4, textTransform: 'capitalize' }}>{question.difficulty}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: subjectStyle.textColor, fontVariantNumeric: 'tabular-nums' }}>{mm}:{ss}</span>
          <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>Q{questionNum}</span>
        </div>
      </div>

      {/* Body */}
      <div className={`qcard-body${result?.explanation ? ' qcard-body-split' : ''}`}>
        <div className="qcard-left">
          {question.diagram && <DiagramRenderer descriptor={question.diagram} />}
          <p className="question-text">{ensureMathDelimiters(preprocessLatex(question.questionText))}</p>

          {/* ── Multi-correct hint ── */}
          {qt === 'mcq_multi' && !result && (
            <div style={{ marginBottom: 12, padding: '7px 12px', background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 6, fontSize: 12, color: '#92400e', fontWeight: 500 }}>
              One or more options may be correct. Select all that apply.
            </div>
          )}

          {/* ── Options (MCQ single + multi-correct) ── */}
          {qt !== 'integer' && (
            <div className="options-grid">
              {question.options.map((opt, i) => {
                const letter = letters[i] ?? String.fromCharCode(65 + i);

                if (qt === 'mcq_multi') {
                  const isSelectedM  = selectedMulti.has(letter);
                  const isCorrectOpt = correctLetters.includes(letter);
                  const isWrongSel   = !!result && isSelectedM && !isCorrectOpt;
                  const isMissed     = !!result && !isSelectedM && isCorrectOpt;

                  let cls = 'option-btn';
                  if (result) {
                    if (isCorrectOpt && isSelectedM) cls += ' correct';
                    else if (isWrongSel) cls += ' wrong';
                    else if (isMissed) cls += ' selected'; // highlight missed with neutral selected style
                  } else if (isSelectedM) {
                    cls += ' selected';
                  }

                  return (
                    <button key={letter} className={cls}
                      onClick={() => !result && setSelectedMulti((prev) => {
                        const next = new Set(prev);
                        if (next.has(letter)) next.delete(letter);
                        else next.add(letter);
                        return next;
                      })}
                      disabled={!!result}
                    >
                      <span className="option-letter">{letter}</span>
                      <span style={{ flex: 1 }}>{ensureMathDelimiters(preprocessLatex(stripOptionPrefix(opt)))}</span>
                      {result && isCorrectOpt && isSelectedM && <span style={{ flexShrink: 0, color: 'var(--green-600)' }}>{CHECK}</span>}
                      {result && isWrongSel && <span style={{ flexShrink: 0, color: 'var(--red-600)' }}>{CROSS}</span>}
                      {result && isMissed && (
                        <span style={{ flexShrink: 0, fontSize: 11, color: 'var(--amber-600)', fontWeight: 700 }}>missed</span>
                      )}
                    </button>
                  );
                }

                // mcq_single
                const isSelected = selected === letter;
                const isCorrect  = !!result && letter === result.correctAnswer;
                const isWrong    = !!result && isSelected && !result.isCorrect;

                let cls = 'option-btn';
                if (isCorrect)    cls += ' correct';
                else if (isWrong) cls += ' wrong';
                else if (isSelected) cls += ' selected';

                return (
                  <button key={letter} className={cls}
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
          )}

          {/* ── Integer input ── */}
          {qt === 'integer' && (
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 10 }}>
                Enter your answer{' '}
                <span style={{ color: 'var(--gray-400)' }}>
                  ({question.examType === 'Advanced' ? 'integer 0–9' : 'integer 0–99'})
                </span>
              </p>
              <input
                type="number"
                min={0}
                max={question.examType === 'Advanced' ? 9 : 99}
                value={integerInput}
                onChange={(e) => !result && setIntegerInput(e.target.value)}
                placeholder={question.examType === 'Advanced' ? '0 – 9' : '0 – 99'}
                disabled={!!result}
                style={{
                  width: 120,
                  padding: '10px 14px',
                  fontSize: 22,
                  fontWeight: 700,
                  border: `2px solid ${
                    result
                      ? result.isCorrect ? 'var(--green-500)' : 'var(--red-500)'
                      : 'var(--gray-300)'
                  }`,
                  borderRadius: 8,
                  outline: 'none',
                  textAlign: 'center',
                  color: 'var(--gray-900)',
                  background: result
                    ? result.isCorrect ? '#f0fdf4' : '#fef2f2'
                    : 'var(--white)',
                }}
              />
            </div>
          )}

          {/* Result banner */}
          {result && (
            <div className={`result-banner${result.isCorrect ? ' correct' : ' wrong'}`} style={{ marginTop: 16 }}>
              {result.isCorrect ? CHECK : CROSS}
              {qt === 'integer'
                ? result.isCorrect
                  ? `Correct! Answer: ${result.correctAnswer}  ·  Solved in ${mm}:${ss}`
                  : `Incorrect. Correct answer: ${result.correctAnswer}  ·  Solved in ${mm}:${ss}`
                : qt === 'mcq_multi'
                ? result.isCorrect
                  ? `All correct! Solved in ${mm}:${ss}`
                  : `Incorrect. Correct: ${correctLetters.join(', ')}`
                : result.isCorrect
                ? `Correct! Solved in ${mm}:${ss}`
                : `Incorrect. Correct answer: ${result.correctAnswer}`
              }
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
                <button className="btn btn-primary" onClick={handleSubmit} disabled={!canSubmit || submitting}>
                  {submitting ? 'Checking...' : 'Submit answer'}
                </button>
                {!canSubmit && (
                  <span style={{ marginLeft: 12, fontSize: 13, color: 'var(--gray-400)' }}>
                    {qt === 'mcq_multi' ? 'Select at least one option' : qt === 'integer' ? 'Enter an integer' : 'Select an option first'}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Explanation panel */}
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
