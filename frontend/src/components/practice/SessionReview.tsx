import Link from 'next/link';
import type { Question } from '@/types';
import { REVIEW_SUBJ, type StoredResult } from './shared';

interface SessionReviewProps {
  questions: Question[];
  examResults: Record<number, StoredResult>;
  sessionSecs: number;
  fmtTime: (secs: number) => string;
  onBackToScore: () => void;
  onNewSession: () => void;
}

/* Session analysis: score headline, subject breakdown, weakest topics and coaching insight */
export function SessionReview({ questions, examResults, sessionSecs, fmtTime, onBackToScore, onNewSession }: SessionReviewProps) {
  const totalQ    = questions.length;
  const correct   = Object.values(examResults).filter((r) => r.isCorrect).length;
  const wrong     = Object.values(examResults).filter((r) => !r.isCorrect).length;
  const skipped   = totalQ - Object.keys(examResults).length;
  const attempted = correct + wrong;
  const accuracy  = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  /* Per-subject stats */
  const subjectStats = new Map<string, { correct: number; total: number }>();
  /* Per-topic stats */
  const topicStats   = new Map<string, { correct: number; total: number; subject: string }>();
  /* Per-difficulty stats */
  const diffStats    = new Map<string, { correct: number; total: number }>();

  questions.forEach((q, i) => {
    const res = examResults[i];
    // Skipped questions are not attempts: they must not count as wrong answers in subject or topic stats
    if (!res) return;
    const isC = res.isCorrect;

    if (!subjectStats.has(q.subject)) subjectStats.set(q.subject, { correct: 0, total: 0 });
    subjectStats.get(q.subject)!.total++;
    if (isC) subjectStats.get(q.subject)!.correct++;

    const tk = `${q.subject}::${q.topic}`;
    if (!topicStats.has(tk)) topicStats.set(tk, { correct: 0, total: 0, subject: q.subject });
    topicStats.get(tk)!.total++;
    if (isC) topicStats.get(tk)!.correct++;

    if (res) {
      if (!diffStats.has(q.difficulty)) diffStats.set(q.difficulty, { correct: 0, total: 0 });
      diffStats.get(q.difficulty)!.total++;
      if (isC) diffStats.get(q.difficulty)!.correct++;
    }
  });

  /* Weakest topics — sorted by accuracy ascending */
  const weakTopics = [...topicStats.entries()]
    .map(([key, s]) => ({
      key,
      topic: key.split('::')[1] ?? key,
      subject: s.subject,
      correct: s.correct,
      total: s.total,
      pct: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
    }))
    .filter((t) => t.pct < 100)
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 6);

  /* Generate insight text */
  const insightParts: string[] = [];

  if (accuracy >= 80) {
    insightParts.push('Good session. Your preparation is working.');
  } else if (accuracy >= 60) {
    insightParts.push('You crossed 60%. See the topics below and keep going.');
  } else if (accuracy >= 40) {
    insightParts.push('Not a bad start. The topics below show where you lost marks.');
  } else {
    insightParts.push('Rough session. That is fine. Use the topic list below to know what to study next.');
  }

  /* Difficulty pattern */
  const begS = diffStats.get('beginner');
  const advS = diffStats.get('advanced');
  if (begS && advS && begS.total >= 2 && advS.total >= 2) {
    const begPct = Math.round((begS.correct / begS.total) * 100);
    const advPct = Math.round((advS.correct / advS.total) * 100);
    if (begPct - advPct >= 30) {
      insightParts.push(`You got ${begPct}% on easier questions but only ${advPct}% on harder ones. The concepts are not fully clear yet.`);
    } else if (advPct > begPct + 10) {
      insightParts.push(`You scored higher on harder questions (${advPct}%) than easier ones (${begPct}%). You may be rushing through the simpler problems.`);
    }
  }

  /* Dominant weak subject */
  let worstSubj = ''; let worstPct = 101;
  for (const [subj, s] of subjectStats) {
    if (s.total >= 3) {
      const pct = Math.round((s.correct / s.total) * 100);
      if (pct < worstPct) { worstPct = pct; worstSubj = subj; }
    }
  }
  if (worstSubj && worstPct < 50) {
    insightParts.push(`${worstSubj} is where you lost the most marks. Only ${worstPct}% correct across ${subjectStats.get(worstSubj)!.total} questions.`);
  }

  /* Single topic dominating wrong answers */
  const dominant = weakTopics.find((t) => t.total >= 3 && t.pct === 0);
  if (dominant) {
    insightParts.push(`${dominant.topic} was wrong every time across ${dominant.total} attempts. Revise this topic before your next session.`);
  } else if (skipped > totalQ * 0.3) {
    insightParts.push(`You skipped ${skipped} of ${totalQ} questions. Try to attempt everything in practice, even if you are unsure.`);
  }

  const insight = insightParts.join(' ');

  return (
    <div className="exam-overlay">
      <div className="exam-header">
        <span className="exam-logo"><img src="/logo.png" alt="JEENEET.ai" className="site-logo" /></span>
        <span style={{ fontSize: 14, color: 'var(--gray-500)' }}>Session analysis</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => onBackToScore()}>Back to score</button>
          <button className="btn btn-outline btn-sm" onClick={onNewSession}>New session</button>
          <Link href="/dashboard" className="btn btn-primary btn-sm">Dashboard</Link>
        </div>
      </div>

      <div className="exam-body" style={{ padding: '40px 32px' }}>
        <div style={{ width: '100%', maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Score headline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 10 }}>
              <span style={{
                fontSize: 56, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1,
                color: accuracy >= 60 ? 'var(--green-600)' : accuracy >= 40 ? 'var(--amber-600)' : 'var(--red-600)',
              }}>
                {accuracy}%
              </span>
              <span style={{ fontSize: 15, color: 'var(--gray-400)' }}>
                {correct} correct · {wrong} wrong{skipped > 0 ? ` · ${skipped} skipped` : ''} · {fmtTime(sessionSecs)}
              </span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--gray-600)', maxWidth: 620 }}>
              {insight}
            </p>
          </div>

          {/* Subject breakdown */}
          {subjectStats.size > 0 && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--gray-400)', marginBottom: 12 }}>
                By subject
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {[...subjectStats.entries()].map(([subj, s]) => {
                  const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                  const cfg = REVIEW_SUBJ[subj] ?? { color: 'var(--gray-600)', icon: '?', bg: 'var(--gray-50)' };
                  const barColor = pct >= 60 ? 'var(--green-600)' : pct >= 40 ? 'var(--amber-600)' : 'var(--red-600)';
                  return (
                    <div key={subj} style={{
                      flex: '1 1 160px', background: 'var(--white)',
                      border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)', padding: '16px 18px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <span style={{ fontSize: 18, color: cfg.color }}>{cfg.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' }}>{subj}</span>
                      </div>
                      <p style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.03em', color: barColor, marginBottom: 2 }}>
                        {pct}%
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 10 }}>
                        {s.correct} of {s.total} correct
                      </p>
                      <div style={{ height: 3, background: 'var(--gray-100)', borderRadius: 2 }}>
                        <div style={{ height: '100%', width: `${pct}%`, borderRadius: 2, background: barColor, transition: 'width .7s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Weak topics */}
          {weakTopics.length > 0 && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--gray-400)', marginBottom: 12 }}>
                Topics to focus on
              </p>
              <div style={{ border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                {weakTopics.map((t, i) => {
                  const cfg = REVIEW_SUBJ[t.subject] ?? { color: 'var(--gray-600)', icon: '?', bg: 'var(--gray-50)' };
                  const pctColor = t.pct < 40 ? 'var(--red-600)' : 'var(--amber-600)';
                  return (
                    <div key={t.key} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '13px 18px',
                      borderBottom: i < weakTopics.length - 1 ? '1px solid var(--gray-100)' : 'none',
                      background: 'var(--white)',
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-300)', width: 18, flexShrink: 0 }}>#{i + 1}</span>
                      <span style={{ fontSize: 15, color: cfg.color, flexShrink: 0 }}>{cfg.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {t.topic}
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 1 }}>{t.subject}</p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: 15, fontWeight: 800, color: pctColor }}>{t.pct}%</p>
                        <p style={{ fontSize: 11, color: 'var(--gray-400)' }}>{t.correct}/{t.total} correct</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All correct / nothing to show */}
          {weakTopics.length === 0 && attempted > 0 && (
            <div style={{ background: 'var(--green-50)', border: '1px solid var(--green-100)', borderRadius: 'var(--radius-xl)', padding: '20px 24px' }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--green-600)', marginBottom: 4 }}>
                Perfect or near-perfect session
              </p>
              <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7 }}>
                You got every answered question right. Try a harder difficulty or a new topic to keep growing.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
