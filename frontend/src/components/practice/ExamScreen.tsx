import type { Question, AnswerResult } from '@/types';
import { QuestionCard } from '@/components/QuestionCard';
import type { StoredResult } from './shared';

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
}

/* The question screen: one question at a time, with the question palette and session timer */
export function ExamScreen({ questions, currentIndex, examResults, sessionSecs, isFullscreen, fmtTime, onEndSession, onToggleFullscreen, onSubmitAnswer, onNext, onPrev, onSelectIndex }: ExamScreenProps) {
  const q = questions[currentIndex]!;
  const answeredCount = Object.keys(examResults).length;
  const storedResult = examResults[currentIndex];
  return (
    <div className="exam-overlay">
      <div className="exam-header">
        <span className="exam-logo"><img src="/logo.png" alt="JEENEET.ai" className="site-logo" /></span>
        <div className="exam-meta">
          <span className="exam-qnum">Q{currentIndex + 1} / {questions.length}</span>
          <span className="exam-topic">{q.subject} · {q.topic}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="exam-timer">{fmtTime(sessionSecs)}</span>
          <button className="btn btn-outline btn-sm" onClick={onEndSession}>End session</button>
          <button className="btn btn-ghost btn-sm"
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
            {isFullscreen
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            }
          </button>
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
          />
        </div>
      </div>

      <div className="exam-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {currentIndex > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={onPrev} title="Previous question">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Prev
            </button>
          )}
        </div>
        <div className="exam-palette">
          {questions.map((qItem, i) => {
            const res = examResults[i];
            let cls = 'exam-dot';
            if (i === currentIndex) cls += ' current';
            else if (res) cls += res.isCorrect ? ' correct' : ' wrong';
            return (
              <div key={`${qItem.id}-${i}`} className={cls}
                style={{ cursor: res ? 'pointer' : 'default' }}
                onClick={() => res ? onSelectIndex(i) : undefined}
                title={res ? `Q${i + 1}: ${res.isCorrect ? 'Correct' : 'Wrong'} (click to review)` : undefined}>
                {i + 1}
              </div>
            );
          })}
        </div>
        <span className="exam-footer-count">{answeredCount} of {questions.length} answered</span>
      </div>
    </div>
  );
}
