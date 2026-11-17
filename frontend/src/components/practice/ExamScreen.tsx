import Image from 'next/image';
import { Fragment } from 'react';
import type { Question, AnswerResult } from '@/types';
import { QuestionCard } from '@/components/QuestionCard';
import type { StoredResult, MarkingScheme } from './shared';

interface ExamScreenProps {
  questions: Question[];
  currentIndex: number;
  examResults: Record<number, StoredResult>;
  sessionSecs: number;
  isFullscreen: boolean;
  fmtTime: (secs: number) => string;
  onEndSession: () => void;
  onToggleFullscreen: () => void;
  onSubmitAnswer: (answer: string, timeSpent: number) => Promise<AnswerResult>;
  onNext: () => void;
  onPrev: () => void;
  onSelectIndex: (index: number) => void;
  markingScheme?: MarkingScheme;
}

/* The question screen: one question at a time, with the question palette and session timer */
export function ExamScreen({ questions, currentIndex, examResults, sessionSecs, isFullscreen, fmtTime, onEndSession, onToggleFullscreen, onSubmitAnswer, onNext, onPrev, onSelectIndex, markingScheme }: ExamScreenProps) {
  const q = questions[currentIndex]!;
  const storedResult = examResults[currentIndex];

  /* The navigator is cut into subject runs, so a mixed paper shows where one
     subject ends and the next begins. */
  const runs: Array<{ subject: string; items: Array<{ qItem: Question; i: number }> }> = [];
  questions.forEach((qItem, i) => {
    const last = runs[runs.length - 1];
    if (last && last.subject === qItem.subject) last.items.push({ qItem, i });
    else runs.push({ subject: qItem.subject, items: [{ qItem, i }] });
  });

  return (
    <div className="exam-overlay">
      <div className="exam-header">
        <div className="exam-head-left">
          <span className="exam-logo"><Image src="/logo.png" alt="JEENEET.ai" width={92} height={48} className="site-logo" /></span>
          <span className="exam-head-rule" aria-hidden />
          <div className="exam-where">
            <p className="exam-where-subject">{q.subject}</p>
            <p className="exam-where-topic">{q.topic}</p>
          </div>
        </div>

        <div className="exam-progress">
          <span className="exam-qnum">Question {currentIndex + 1} <i>of {questions.length}</i></span>
          <span className="exam-progress-track">
            <span className="exam-progress-fill" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
          </span>
        </div>

        <div className="exam-head-right">
          <span className="exam-timer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
            </svg>
            {fmtTime(sessionSecs)}
          </span>
          <button
            type="button"
            className="exam-icon-btn"
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/></svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            }
          </button>
          <button type="button" className="exam-end-btn" onClick={onEndSession}>End session</button>
        </div>
      </div>

      <div className="exam-body">
        <div className="exam-question-wrap">
          <QuestionCard
            key={currentIndex}
            question={q}
            questionNum={currentIndex + 1}
            onSubmit={onSubmitAnswer}
            onNext={onNext}
            initialResult={storedResult}
            initialSelected={storedResult?.selectedAnswer}
            isLast={currentIndex === questions.length - 1}
            markingScheme={markingScheme}
          />
        </div>
      </div>

      <div className="exam-footer">
        <div className="exam-nav">
          <button
            type="button"
            className="exam-nav-btn"
            onClick={onPrev}
            disabled={currentIndex === 0}
            title="Previous question"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Prev
          </button>
        </div>

        {/* The response sheet: one cell per question, split where a subject ends */}
        <div className="exam-palette" role="group" aria-label="Question navigator">
          {runs.map((run, runIdx) => (
            <Fragment key={`${run.subject}-${runIdx}`}>
              {runIdx > 0 && <span className="exam-sep" aria-hidden />}
              {run.items.map(({ qItem, i }) => {
                const res = examResults[i];
                const isCurrent = i === currentIndex;
                const state = res ? (res.isCorrect ? 'Correct' : 'Wrong') : 'Not answered';
                let cls = 'exam-dot';
                if (res) cls += res.isCorrect ? ' is-correct' : ' is-wrong';
                if (isCurrent) cls += ' is-current';
                return (
                  <button
                    key={`${qItem.id}-${i}`}
                    type="button"
                    className={cls}
                    onClick={() => onSelectIndex(i)}
                    title={`Question ${i + 1} · ${qItem.subject} · ${state}`}
                    aria-label={`Question ${i + 1}, ${state}`}
                    aria-current={isCurrent ? 'true' : undefined}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </Fragment>
          ))}
        </div>

        {/* The key to the sheet */}
        <div className="exam-legend">
          <span className="exam-legend-item"><span className="exam-legend-cell is-correct" aria-hidden />Correct</span>
          <span className="exam-legend-item"><span className="exam-legend-cell is-wrong" aria-hidden />Wrong</span>
          <span className="exam-legend-item"><span className="exam-legend-cell" aria-hidden />Not answered</span>
        </div>
      </div>
    </div>
  );
}
