'use client';

import { useEffect, useState } from 'react';
import {
  adminFetch,
  AdminError,
  type AdminMockDetail,
  type AdminStudentDetail,
} from '@/lib/admin';
import { MathText, stripOptionPrefix } from '@/lib/math';
import styles from './superadmin.module.css';

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function fmtSecs(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

// Loads one admin endpoint; reports an expired session up to the page
function useAdminData<T>(path: string, onUnauthorized: () => void) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setData(null);
    adminFetch<T>(path)
      .then((d) => { if (active) setData(d); })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof AdminError && err.status === 401) onUnauthorized();
        else setError(err instanceof Error ? err.message : 'Could not load');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return { data, error, loading };
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return <button className={styles.btn} onClick={onClick}>← {label}</button>;
}

/* ── One student: profile, mock exams, topics, every practice answer ── */
export function StudentDetail({
  studentId,
  onBack,
  onOpenMock,
  onUnauthorized,
}: {
  studentId: string;
  onBack: () => void;
  onOpenMock: (examId: string) => void;
  onUnauthorized: () => void;
}) {
  const { data, error, loading } = useAdminData<AdminStudentDetail>(`/students/${studentId}`, onUnauthorized);

  if (loading) return <p className={styles.muted}>Loading student…</p>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!data) return null;

  const { student, summary, topics, practice, mocks } = data;

  return (
    <>
      <header className={styles.header}>
        <div>
          <BackButton onClick={onBack} label="All students" />
          <p className={styles.title} style={{ marginTop: 14 }}>{student.name}</p>
          <p className={styles.sub}>
            {student.email} · Class {student.class} · JEE {student.targetExam} · {student.currentLevel} · joined {fmtDate(student.joinedAt)}
          </p>
        </div>
      </header>

      <section className={styles.statGrid}>
        <div className={styles.card}>
          <p className={styles.statLabel}>Practice questions answered</p>
          <p className={styles.statValue}>{summary.answered}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.statLabel}>Correct / wrong</p>
          <p className={styles.statValue}>{summary.correct} / {summary.wrong}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.statLabel}>Practice accuracy</p>
          <p className={styles.statValue}>{summary.answered > 0 ? `${summary.accuracy}%` : '—'}</p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Mock exams ({mocks.length})</p>
        {mocks.length === 0 ? (
          <p className={styles.muted}>No mock exams started.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Started</th>
                  <th>Exam</th>
                  <th>Difficulty</th>
                  <th>Status</th>
                  <th className={styles.num}>Score</th>
                  <th className={styles.num}>Correct</th>
                  <th className={styles.num}>Wrong</th>
                  <th className={styles.num}>Skipped</th>
                  <th className={styles.num}>Time</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {mocks.map((m) => (
                  <tr key={m.id}>
                    <td>{fmtDate(m.createdAt)}</td>
                    <td>JEE {m.examType}</td>
                    <td>{m.difficultyMode}</td>
                    <td>{m.status}</td>
                    <td className={styles.num}>{m.result ? `${m.result.totalScore} / ${m.result.maxScore}` : '—'}</td>
                    <td className={styles.num}>{m.result?.correct ?? '—'}</td>
                    <td className={styles.num}>{m.result?.incorrect ?? '—'}</td>
                    <td className={styles.num}>{m.result?.unattempted ?? '—'}</td>
                    <td className={styles.num}>{m.result ? fmtSecs(m.result.timeTaken) : '—'}</td>
                    <td>
                      {m.result && (
                        <button className={styles.linkBtn} onClick={() => onOpenMock(m.id)}>View answers</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Practice by topic (weakest first)</p>
        {topics.length === 0 ? (
          <p className={styles.muted}>No practice answers yet.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Topic</th>
                  <th className={styles.num}>Attempted</th>
                  <th className={styles.num}>Correct</th>
                  <th className={styles.num}>Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {topics.map((t) => (
                  <tr key={`${t.subject}-${t.topic}`}>
                    <td>{t.subject}</td>
                    <td>{t.topic}</td>
                    <td className={styles.num}>{t.attempts}</td>
                    <td className={styles.num}>{t.correct}</td>
                    <td className={styles.num}>{t.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Every practice answer ({practice.length}, newest first)</p>
        {practice.length === 0 ? (
          <p className={styles.muted}>No practice answers yet.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>When</th>
                  <th>Subject / topic</th>
                  <th>Type</th>
                  <th>Question</th>
                  <th>Student answer</th>
                  <th>Correct answer</th>
                  <th>Result</th>
                  <th className={styles.num}>Time</th>
                </tr>
              </thead>
              <tbody>
                {practice.map((p) => (
                  <tr key={p.id}>
                    <td>{fmtDate(p.answeredAt)}</td>
                    <td>
                      <div>{p.subject}</div>
                      <div className={styles.muted}>{p.topic} · {p.difficulty}</div>
                    </td>
                    <td>{p.questionType === 'mcq_single' ? 'Single' : p.questionType === 'mcq_multi' ? 'Multi' : 'Integer'}</td>
                    <td className={styles.wrapCell}>
                      <MathText text={p.questionText} />
                    </td>
                    <td>{p.answerSubmitted || '—'}</td>
                    <td>{p.correctAnswer}</td>
                    <td className={p.isCorrect ? styles.good : styles.bad}>{p.isCorrect ? 'Correct' : 'Wrong'}</td>
                    <td className={styles.num}>{fmtSecs(p.timeSpent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

/* ── One mock exam: every question, the student's answer, the right answer, marks ── */
export function MockDetail({
  examId,
  onBack,
  onUnauthorized,
}: {
  examId: string;
  onBack: () => void;
  onUnauthorized: () => void;
}) {
  const { data, error, loading } = useAdminData<AdminMockDetail>(`/mocks/${examId}`, onUnauthorized);

  if (loading) return <p className={styles.muted}>Loading exam…</p>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!data) return null;

  const { exam, result, questions } = data;
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <>
      <header className={styles.header}>
        <div>
          <BackButton onClick={onBack} label="Back to student" />
          <p className={styles.title} style={{ marginTop: 14 }}>
            {exam.studentName} · JEE {exam.examType} mock
          </p>
          <p className={styles.sub}>
            {exam.studentEmail} · started {fmtDate(exam.createdAt)} · submitted {fmtDate(exam.submittedAt)} · status {exam.status}
          </p>
        </div>
      </header>

      {result && (
        <section className={styles.statGrid}>
          <div className={styles.card}>
            <p className={styles.statLabel}>Score</p>
            <p className={styles.statValue}>{result.totalScore} / {result.maxScore}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.statLabel}>Correct / wrong / skipped</p>
            <p className={styles.statValue}>{result.correct} / {result.incorrect} / {result.unattempted}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.statLabel}>Time taken</p>
            <p className={styles.statValue}>{fmtSecs(result.timeTaken)}</p>
          </div>
        </section>
      )}

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Every question ({questions.length})</p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Subject / topic</th>
                <th>Question</th>
                <th>Student answer</th>
                <th>Correct answer</th>
                <th className={styles.num}>Marks</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => {
                const got = q.awarded ?? 0;
                const cls = q.submitted === null || q.submitted === '' ? styles.muted : got > 0 ? styles.good : styles.bad;
                return (
                  <tr key={q.questionNumber}>
                    <td>{q.questionNumber}</td>
                    <td>
                      <div>{q.subject}</div>
                      <div className={styles.muted}>{q.topic}</div>
                    </td>
                    <td className={styles.wrapCell}>
                      <MathText text={q.questionText} />
                      {q.options.length > 0 && (
                        <ol className={styles.optList}>
                          {q.options.map((opt, i) => (
                            <li key={i}>
                              <strong>{letters[i]})</strong>{' '}
                              <MathText text={stripOptionPrefix(opt)} />
                            </li>
                          ))}
                        </ol>
                      )}
                    </td>
                    <td>{q.submitted || <span className={styles.muted}>Not answered</span>}</td>
                    <td>{q.correctAnswer}</td>
                    <td className={`${styles.num} ${cls}`}>
                      {q.awarded !== null ? `${q.awarded} / ${q.maxMarks}` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
