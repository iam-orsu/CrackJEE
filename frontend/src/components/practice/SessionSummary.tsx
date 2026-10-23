import Link from 'next/link';
import type { Question } from '@/types';
import type { StoredResult, MarkingScheme } from './shared';

interface SessionSummaryProps {
  questions: Question[];
  examResults: Record<number, StoredResult>;
  sessionSecs: number;
  markingScheme: MarkingScheme;
  /* Exam name for the headings, e.g. "NEET"; JEE leaves it out */
  examTitle?: string;
  fmtTime: (secs: number) => string;
  onReview: () => void;
  onPracticeAgain: () => void;
}

/* End-of-session score card: accuracy, counts, JEE-style marks when a scheme is chosen */
export function SessionSummary({ questions, examResults, sessionSecs, markingScheme, examTitle, fmtTime, onReview, onPracticeAgain }: SessionSummaryProps) {
  const total     = questions.length;
  const correct   = Object.values(examResults).filter((r) => r.isCorrect).length;
  const attempted = Object.keys(examResults).length;
  const wrong     = attempted - correct;
  const accuracy  = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  // Same marks as the mock exam: JEE Main integers have no penalty; Advanced single-correct is +3,
  // multi-correct is -2 when wrong, integer is +4. Multi-correct partial credit is not tracked here.
  const pointsIfCorrect = (qt: string) => (markingScheme === 'jee_advanced' && qt === 'mcq_single' ? 3 : 4);
  const jeeScore = markingScheme === 'standard' ? correct : questions.reduce((acc, q, i) => {
    const res = examResults[i];
    if (!res) return acc;
    if (res.isCorrect) return acc + pointsIfCorrect(q.questionType);
    if (markingScheme === 'jee_main') return acc - (q.questionType === 'integer' ? 0 : 1);
    if (q.questionType === 'integer') return acc;
    return acc - (q.questionType === 'mcq_multi' ? 2 : 1);
  }, 0);
  const jeeMax = markingScheme === 'standard' ? total
    : questions.reduce((acc, q) => acc + pointsIfCorrect(q.questionType), 0);

  return (
    <div className="exam-overlay">
      <div className="exam-header">
        <span className="exam-logo"><img src="/logo.png" alt="JEENEET.ai" className="site-logo" /></span>
        <span style={{ fontSize: 14, color: 'var(--gray-500)' }}>Session complete</span>
        <div />
      </div>
      <div className="summary-wrap">
        <div className="summary-card">
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--gray-500)', marginBottom: 20 }}>
            {examTitle ? `${examTitle} Session Results` : 'Session Results'}
          </div>
          <div className="summary-score-big">{accuracy}%</div>
          <div className="summary-score-sub">accuracy · {correct} of {attempted} correct</div>
          <div className="summary-stats">
            <div style={{ textAlign: 'center' }}>
              <div className="summary-stat-val" style={{ color: 'var(--green-600)' }}>{correct}</div>
              <div className="summary-stat-lbl">Correct</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="summary-stat-val" style={{ color: 'var(--red-600)' }}>{wrong}</div>
              <div className="summary-stat-lbl">Wrong</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="summary-stat-val">{total - attempted}</div>
              <div className="summary-stat-lbl">Skipped</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="summary-stat-val">{fmtTime(sessionSecs)}</div>
              <div className="summary-stat-lbl">Time</div>
            </div>
          </div>

          {markingScheme !== 'standard' && (
            <div style={{ background: 'var(--navy-50)', border: '1px solid var(--navy-100)', borderRadius: 'var(--radius-lg)', padding: '14px 20px', marginTop: 4 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--navy-600)', marginBottom: 4 }}>
                {examTitle
                  ? `${examTitle} Score (approx.)`
                  : markingScheme === 'jee_main' ? 'JEE Main Score' : 'JEE Advanced Score (approx.)'}
              </p>
              <p style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.1,
                color: jeeScore < 0 ? 'var(--red-600)' : jeeScore === 0 ? 'var(--gray-500)' : 'var(--primary)' }}>
                {jeeScore > 0 ? '+' : ''}{jeeScore}
                <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-400)', marginLeft: 6 }}>/ {jeeMax}</span>
              </p>
              <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 3 }}>
                {correct} correct
                {wrong > 0 && ` · ${wrong} wrong`}
                {total - attempted > 0 && ` · ${total - attempted} skipped (no penalty)`}
                {markingScheme === 'jee_advanced' && ' · multi-correct partial credit not reflected'}
              </p>
            </div>
          )}

          <div className="divider" style={{ margin: '20px 0 0' }} />
          <div className="summary-actions">
            <button className="btn btn-primary" onClick={() => onReview()}>Review session &rarr;</button>
            <button className="btn btn-outline" onClick={onPracticeAgain}>Practice again</button>
            <Link href="/dashboard" className="btn btn-ghost">Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
