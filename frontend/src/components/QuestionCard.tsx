'use client';

import { useState, useEffect, useRef } from 'react';
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

export function QuestionCard({ question, questionNum, onSubmit, onNext }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult]     = useState<AnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [elapsed, setElapsed]   = useState(0);
  const startRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

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

  async function handleSubmit() {
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
  }

  const letters = ['A', 'B', 'C', 'D'];
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  return (
    <div className="card" style={{ borderRadius: 'var(--radius-xl)' }}>
      {/* ── Meta row ── */}
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <div className="question-meta">
          <span className="badge badge-gray">{question.subject}</span>
          <span className="badge badge-gray">{question.topic}</span>
          <span className="badge badge-gray">{question.difficulty}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="timer-display">
            {mm}:{ss}
          </span>
          <span className="caption" style={{ color: 'var(--gray-400)' }}>Q{questionNum}</span>
        </div>
      </div>

      <div className="divider" style={{ marginBottom: 20 }} />

      {/* ── Question text ── */}
      <p className="question-text">{question.questionText}</p>

      {/* ── Options ── */}
      <div className="options-grid">
        {question.options.map((opt, i) => {
          const letter = letters[i] ?? String.fromCharCode(65 + i);
          const isSelected = selected === letter;
          const isCorrect  = result && letter === result.correctAnswer;
          const isWrong    = result && isSelected && !result.isCorrect;

          let cls = 'option-btn';
          if (isCorrect)   cls += ' correct';
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

      {/* ── Result + explanation ── */}
      {result && (
        <div style={{ marginTop: 20 }}>
          <div className={`result-banner${result.isCorrect ? ' correct' : ' wrong'}`}>
            {result.isCorrect ? CHECK : CROSS}
            {result.isCorrect
              ? `Correct! Solved in ${mm}:${ss}`
              : `Incorrect. Correct answer: ${result.correctAnswer}`}
          </div>

          {result.explanation && (
            <div className="explanation-box" style={{ marginTop: 12 }}>
              <p className="explanation-label">Explanation</p>
              <p className="explanation-text">{result.explanation}</p>
            </div>
          )}

          <button
            className="btn btn-outline"
            style={{ marginTop: 16 }}
            onClick={onNext}
          >
            Next question →
          </button>
        </div>
      )}

      {/* ── Submit ── */}
      {!result && (
        <div style={{ marginTop: 20 }}>
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
        </div>
      )}
    </div>
  );
}
