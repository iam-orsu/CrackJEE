'use client';

import React, { useEffect, useState } from 'react';
import {
  facultyGetAssignmentReport,
  facultyListAssignments,
  type FacultyAssignmentReport,
  type FacultyAssignmentSummary,
} from '@/lib/faculty';
import styles from '@/app/faculty/faculty.module.css';

interface FacultyReportsTabProps {
  initialAssignmentId?: string | null;
}

export function FacultyReportsTab({ initialAssignmentId }: FacultyReportsTabProps) {
  const [assignments, setAssignments] = useState<FacultyAssignmentSummary[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(initialAssignmentId || '');
  const [report, setReport] = useState<FacultyAssignmentReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load assignments list for selector
  useEffect(() => {
    facultyListAssignments()
      .then((res) => {
        setAssignments(res.assignments);
        setSelectedAssignmentId((prev) => prev || (res.assignments.length > 0 ? res.assignments[0]!.id : ''));
      })
      .catch((err) => setError(err.message));
  }, []);

  // Load report when selected assignment changes
  useEffect(() => {
    if (!selectedAssignmentId) return;
    setLoading(true);
    setError('');
    facultyGetAssignmentReport(selectedAssignmentId)
      .then((res) => setReport(res.report))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedAssignmentId]);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header & Assignment Picker */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)' }}>Batch Performance Reports</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
            Examine student rankings, score distributions, and topic accuracy across your assigned exams.
          </p>
        </div>

        {assignments.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink-2)' }}>Select Exam:</label>
            <select
              className={styles.select}
              style={{ minWidth: '260px' }}
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
            >
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} ({a.batch.name})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
          Loading batch performance data…
        </div>
      ) : !report ? (
        <div className={styles.emptyState}>
          No assignment selected or no assigned exams found. Assign an exam to a batch to view reports.
        </div>
      ) : (
        <>
          {/* Summary Overview Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className={styles.panel} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Batch Average
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ink)', margin: '8px 0 2px' }}>
                {report.summary.avgScore}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Marks</div>
            </div>

            <div className={styles.panel} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Highest Score
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--accent)', margin: '8px 0 2px' }}>
                {report.summary.highestScore}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Marks (Top Rank)</div>
            </div>

            <div className={styles.panel} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Lowest Score
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#ef4444', margin: '8px 0 2px' }}>
                {report.summary.lowestScore}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Marks</div>
            </div>

            <div className={styles.panel} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Submissions
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ink)', margin: '8px 0 2px' }}>
                {report.summary.submittedCount} / {report.summary.totalEnrolled}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--accent)' }}>
                {report.summary.totalEnrolled > 0
                  ? `${Math.round((report.summary.submittedCount / report.summary.totalEnrolled) * 100)}% turnout`
                  : '—'}
              </div>
            </div>
          </div>

          {/* Student Leaderboard Table */}
          <div className={styles.panel}>
            <div className={styles.panelTitle}>
              <span>Batch Leaderboard &amp; Rankings ({report.rankList.length})</span>
              <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--muted)' }}>
                Ranked by Total Marks Descending
              </span>
            </div>

            {report.rankList.length === 0 ? (
              <div className={styles.emptyState}>
                No student has submitted this exam yet. Students can take the test at <strong>/student-portal</strong>.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--line)', textAlign: 'left', color: 'var(--muted)' }}>
                      <th style={{ padding: '10px 12px', width: '60px' }}>Rank</th>
                      <th style={{ padding: '10px 12px' }}>Roll Number</th>
                      <th style={{ padding: '10px 12px' }}>Student Name</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Score / Max</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Accuracy</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Correct / Wrong / Skip</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>Time Taken</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.rankList.map((st) => {
                      const medal = st.rank === 1 ? '🥇' : st.rank === 2 ? '🥈' : st.rank === 3 ? '🥉' : `#${st.rank}`;
                      const totalAttempted = st.correctCount + st.incorrectCount;
                      const accuracy = totalAttempted > 0 ? Math.round((st.correctCount / totalAttempted) * 100) : 0;

                      return (
                        <tr key={st.studentId} style={{ borderBottom: '1px solid var(--line)' }}>
                          <td style={{ padding: '12px', fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>
                            {medal}
                          </td>
                          <td style={{ padding: '12px', fontWeight: 600, color: 'var(--accent)' }}>
                            {st.rollNumber}
                          </td>
                          <td style={{ padding: '12px', fontWeight: 500, color: 'var(--ink)' }}>
                            {st.name}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <span style={{ fontWeight: 700, color: st.totalScore >= 0 ? 'var(--ink)' : '#ef4444' }}>
                              {st.totalScore}
                            </span>
                            <span style={{ color: 'var(--muted)', fontSize: '12px' }}> / {st.maxScore}</span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <span
                              style={{
                                background: accuracy >= 70 ? '#ecfdf5' : accuracy >= 40 ? '#fffbeb' : '#fef2f2',
                                color: accuracy >= 70 ? '#065f46' : accuracy >= 40 ? '#b45309' : '#991b1b',
                                padding: '2px 8px',
                                borderRadius: '999px',
                                fontSize: '11px',
                                fontWeight: 600,
                              }}
                            >
                              {accuracy}%
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>
                            <span style={{ color: '#10b981', fontWeight: 600 }}>+{st.correctCount}</span>{' '}
                            <span style={{ color: 'var(--line)' }}>/</span>{' '}
                            <span style={{ color: '#ef4444', fontWeight: 600 }}>-{st.incorrectCount}</span>{' '}
                            <span style={{ color: 'var(--line)' }}>/</span>{' '}
                            <span style={{ color: 'var(--muted)' }}>{st.unattemptedCount}</span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', color: 'var(--muted)', fontSize: '12px' }}>
                            {formatTime(st.timeTakenSeconds)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Question-by-Question Batch Accuracy Analysis */}
          <div className={styles.panel}>
            <div className={styles.panelTitle}>
              <span>Question Difficulty &amp; Error Analysis</span>
              <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--muted)' }}>
                Identifies questions and topics the batch struggled with most
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--line)', textAlign: 'left', color: 'var(--muted)' }}>
                    <th style={{ padding: '10px 12px', width: '50px' }}>Q#</th>
                    <th style={{ padding: '10px 12px' }}>Subject</th>
                    <th style={{ padding: '10px 12px' }}>Topic</th>
                    <th style={{ padding: '10px 12px' }}>Type</th>
                    <th style={{ padding: '10px 12px', minWidth: '160px' }}>Batch Accuracy</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Correct / Wrong / Skip</th>
                  </tr>
                </thead>
                <tbody>
                  {report.questionAnalytics.map((q) => (
                    <tr key={q.questionNumber} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td style={{ padding: '12px', fontWeight: 600, color: 'var(--ink)' }}>
                        #{q.questionNumber}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 500, color: 'var(--ink-2)' }}>
                        {q.subject}
                      </td>
                      <td style={{ padding: '12px', color: 'var(--muted)' }}>
                        {q.topic}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            background: 'var(--surface)',
                            border: '1px solid var(--line)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                          }}
                        >
                          {q.questionType.replace('mcq_', '')}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              flex: 1,
                              height: '8px',
                              background: '#fee2e2',
                              borderRadius: '999px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${q.accuracyPct}%`,
                                height: '100%',
                                background: q.accuracyPct >= 60 ? '#10b981' : q.accuracyPct >= 35 ? '#f59e0b' : '#ef4444',
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 600, minWidth: '32px' }}>
                            {q.accuracyPct}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px' }}>
                        <span style={{ color: '#10b981', fontWeight: 600 }}>{q.correctCount}</span>{' '}
                        <span style={{ color: 'var(--line)' }}>/</span>{' '}
                        <span style={{ color: '#ef4444', fontWeight: 600 }}>{q.wrongCount}</span>{' '}
                        <span style={{ color: 'var(--line)' }}>/</span>{' '}
                        <span style={{ color: 'var(--muted)' }}>{q.skippedCount}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
