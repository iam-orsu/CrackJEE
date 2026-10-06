'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Question, AnswerResult } from '@/types';

interface Props {
  question: Question;
  questionNum: number;
  onSubmit: (answer: string, timeSpent: number) => Promise<AnswerResult>;
  onNext: () => void;
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

export function QuestionCard({ question, questionNum, onSubmit, onNext }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult]     = useState<AnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [elapsed, setElapsed]   = useState(0);
  const startRef  = useRef(Date.now());
  const timerRef  = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const cardRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(null);
    setResult(null);
    setElapsed(0);
    startRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);

    return () => clearInterval(timerRef.current);
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

  return (
    <div ref={cardRef} className="card" style={{ borderRadius: 'var(--radius-xl)', padding: 0, overflow: 'hidden' }}>
      {/* ── Meta row ── */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="question-meta">
          <span className="badge badge-gray">{question.subject}</span>
          <span className="badge badge-blue">{question.topic}</span>
          <span className="badge badge-gray">{question.difficulty}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="timer-display">{mm}:{ss}</span>
          <span className="caption" style={{ color: 'var(--gray-400)' }}>Q{questionNum}</span>
        </div>
      </div>

      {/* ── Body: two-column when explanation visible ── */}
      <div className={`qcard-body${result ? ' qcard-body-split' : ''}`}>
        {/* ── Left: question + options ── */}
        <div className="qcard-left">
          <p className="question-text">{question.questionText}</p>

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
                  <span style={{ flex: 1 }}>{opt}</span>
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
                Next question →
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

        {/* ── Right: explanation panel (only after submit) ── */}
        {result && (
          <div className="qcard-explanation">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--navy-600)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--navy-600)' }}>
                Explanation
              </span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--gray-700)', whiteSpace: 'pre-wrap' }}>
              {result.explanation ?? 'No explanation available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
