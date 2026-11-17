'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  studentGetResult,
  type StudentExamResultData,
} from '@/lib/facultyStudent';
import { renderMathHtml, renderExplanationHtml, stripOptionPrefix } from '@/lib/math';
import { DiagramRenderer } from '@/components/DiagramRenderer';
import styles from '@/app/student-portal/studentPortal.module.css';

export default function StudentExamResultPage() {
  const params = useParams();
  const examId = String(params.id);

  const [data, setData] = useState<StudentExamResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'incorrect' | 'skipped'>('all');

  useEffect(() => {
    studentGetResult(examId)
      .then((res) => setData(res))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load result'))
      .finally(() => setLoading(false));
  }, [examId]);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }

  if (loading) {
    return (
      <div className={styles.loginContainer}>
        <div style={{ color: '#0f766e', fontWeight: 600, fontSize: '16px' }}>
          Calculating scorecard &amp; compiling solutions…
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.error}>{error || 'Result not found'}</div>
          <Link href="/student-portal" className={styles.btnSecondary} style={{ display: 'block', textAlign: 'center' }}>
            ← Back to Student Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { scorecard, assignment, solutions } = data;
  const rank = scorecard.rank;
  const rankMedal = rank === 1 ? '🥇 Rank 1' : rank === 2 ? '🥈 Rank 2' : rank === 3 ? '🥉 Rank 3' : `#${rank} in Batch`;

  const totalAttempted = scorecard.correctCount + scorecard.incorrectCount;
  const accuracyPct = totalAttempted > 0 ? Math.round((scorecard.correctCount / totalAttempted) * 100) : 0;

  // Filter solutions
  const filteredSolutions = (solutions || []).filter((q) => {
    if (filterType === 'correct') return q.isCorrect;
    if (filterType === 'incorrect') return !q.isCorrect && q.studentAnswer;
    if (filterType === 'skipped') return !q.studentAnswer;
    return true;
  });

  return (
    <div className={styles.wrap}>
      {/* Top Header */}
      <header className={styles.dashHeader}>
        <div className={styles.headerInner}>
          <div>
            <div className={styles.brandTitle}>
              📊 Exam Scorecard &amp; Solutions
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
              {assignment.title} • {assignment.batchName} ({assignment.facultyName})
            </div>
          </div>

          <Link
            href="/student-portal"
            className={styles.btnSecondary}
            style={{ textDecoration: 'none', fontSize: '13px' }}
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className={styles.mainContainer}>
        {/* Scorecard Overview Grid */}
        <div className={styles.scoreCard}>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              Batch Standing
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f766e', margin: '6px 0 2px' }}>
              {rankMedal}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Out of {scorecard.totalCandidates} student(s) in batch
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Marks
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: scorecard.totalScore >= 0 ? '#0f172a' : '#ef4444', margin: '6px 0 2px' }}>
              {scorecard.totalScore}
              <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 400 }}> / {scorecard.maxScore}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Accuracy: <strong>{accuracyPct}%</strong>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              Breakdown
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '8px' }}>
              <span style={{ color: '#10b981', fontWeight: 700, fontSize: '16px' }}>+{scorecard.correctCount} Correct</span>
              <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '16px' }}>-{scorecard.incorrectCount} Wrong</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              {scorecard.unattemptedCount} Skipped
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              Time Taken
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px' }}>
              {formatTime(scorecard.timeTakenSeconds)}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Submitted {scorecard.submittedAt ? new Date(scorecard.submittedAt).toLocaleTimeString() : ''}
            </div>
          </div>
        </div>

        {/* Detailed Solutions Section */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <h2 className={styles.sectionTitle}>
              📖 Step-by-Step Solutions &amp; Answer Key
            </h2>

            {solutions && (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className={filterType === 'all' ? styles.btnPrimary : styles.btnSecondary}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                  onClick={() => setFilterType('all')}
                >
                  All ({solutions.length})
                </button>
                <button
                  type="button"
                  className={filterType === 'correct' ? styles.btnPrimary : styles.btnSecondary}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                  onClick={() => setFilterType('correct')}
                >
                  Correct ({scorecard.correctCount})
                </button>
                <button
                  type="button"
                  className={filterType === 'incorrect' ? styles.btnPrimary : styles.btnSecondary}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                  onClick={() => setFilterType('incorrect')}
                >
                  Incorrect ({scorecard.incorrectCount})
                </button>
                <button
                  type="button"
                  className={filterType === 'skipped' ? styles.btnPrimary : styles.btnSecondary}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                  onClick={() => setFilterType('skipped')}
                >
                  Skipped ({scorecard.unattemptedCount})
                </button>
              </div>
            )}
          </div>

          {!assignment.showSolutions ? (
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '36px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '14px',
              }}
            >
              🔒 <strong>Detailed Solutions are currently hidden by your faculty.</strong>
              <div style={{ marginTop: '8px', fontSize: '13px' }}>
                Your faculty will open the solution keys once all students in the batch finish their exams.
              </div>
            </div>
          ) : filteredSolutions.length === 0 ? (
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '28px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '13px',
              }}
            >
              No questions found under this filter.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredSolutions.map((q) => {
                const isSkipped = !q.studentAnswer;
                const isCorrect = q.isCorrect;
                const statusColor = isCorrect ? '#10b981' : isSkipped ? '#64748b' : '#ef4444';
                const statusBadge = isCorrect ? '✓ Correct (+4)' : isSkipped ? '○ Unattempted (0)' : `✕ Incorrect (${q.score})`;

                return (
                  <div key={q.number} className={styles.solutionCard}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                          Question {q.number}
                        </span>
                        <span style={{ fontSize: '11px', background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '2px 8px', borderRadius: '4px', color: '#475569' }}>
                          {q.subject} • {q.topic}
                        </span>
                      </div>

                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          color: statusColor,
                          background: isCorrect ? '#ecfdf5' : isSkipped ? '#f8fafc' : '#fef2f2',
                          border: `1px solid ${statusColor}44`,
                          padding: '3px 10px',
                          borderRadius: '6px',
                        }}
                      >
                        {statusBadge}
                      </span>
                    </div>

                    {/* Diagram */}
                    {q.diagram && (
                      <div style={{ padding: '12px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <DiagramRenderer descriptor={q.diagram} />
                      </div>
                    )}

                    {/* Question text with KaTeX */}
                    <div
                      style={{ fontSize: '15px', lineHeight: 1.7, color: '#1e293b' }}
                      dangerouslySetInnerHTML={{ __html: renderMathHtml(q.questionText) }}
                    />

                    {/* Options list */}
                    {q.options && q.options.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                        {q.options.map((opt, idx) => {
                          const letter = String.fromCharCode(65 + idx);
                          const isStudentSelected = (q.studentAnswer || '').split(',').includes(letter);
                          const isCorrectOption = (q.correctAnswer || '').split(',').includes(letter);

                          let border = '1px solid #e2e8f0';
                          let bg = '#ffffff';
                          if (isCorrectOption) {
                            border = '2px solid #10b981';
                            bg = '#ecfdf5';
                          } else if (isStudentSelected && !isCorrectOption) {
                            border = '2px solid #ef4444';
                            bg = '#fef2f2';
                          }

                          return (
                            <div
                              key={letter}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border,
                                background: bg,
                                fontSize: '14px',
                              }}
                            >
                              <span style={{ fontWeight: 700, minWidth: '22px' }}>{letter}.</span>
                              <span
                                style={{ flex: 1 }}
                                dangerouslySetInnerHTML={{ __html: renderMathHtml(stripOptionPrefix(opt)) }}
                              />
                              {isCorrectOption && (
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#065f46' }}>✓ Correct</span>
                              )}
                              {isStudentSelected && !isCorrectOption && (
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#991b1b' }}>Your Choice</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Non-MCQ student response vs correct answer */}
                    {(!q.options || q.options.length === 0) && (
                      <div style={{ display: 'flex', gap: '16px', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', fontSize: '13px' }}>
                        <div>
                          <span style={{ color: '#64748b' }}>Your Submitted Answer: </span>
                          <strong style={{ color: isCorrect ? '#10b981' : '#ef4444' }}>
                            {q.studentAnswer || '(Unattempted)'}
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: '#64748b' }}>Correct Answer: </span>
                          <strong style={{ color: '#10b981' }}>{q.correctAnswer}</strong>
                        </div>
                      </div>
                    )}

                    {/* Step-by-Step LaTeX Explanation */}
                    {q.explanation && (
                      <div
                        style={{
                          background: '#f0fdfa',
                          border: '1px solid #ccfbf1',
                          borderRadius: '10px',
                          padding: '16px',
                          marginTop: '8px',
                        }}
                      >
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f766e', textTransform: 'uppercase', marginBottom: '8px' }}>
                          💡 Step-by-Step Explanation:
                        </div>
                        <div
                          style={{ fontSize: '14px', lineHeight: 1.7, color: '#134e4a' }}
                          dangerouslySetInnerHTML={{ __html: renderExplanationHtml(q.explanation) }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
