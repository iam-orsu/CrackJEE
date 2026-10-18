'use client';

import { Fragment, useEffect, useState } from 'react';
import {
  adminFetch,
  AdminError,
  type AdminMockDetail,
  type AdminStudentDetail,
} from '@/lib/admin';
import { MathText, stripOptionPrefix } from '@/lib/math';
import styles from './superadmin.module.css';

const LETTERS = ['A', 'B', 'C', 'D'];

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function fmtDuration(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function initials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join('');
}

// Loads one admin endpoint and reports an expired session up to the page
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

function Tile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className={styles.tile}>
      <p className={styles.tileLabel}>{label}</p>
      <p className={styles.tileValue}>{value}</p>
      {hint && <p className={styles.tileHint}>{hint}</p>}
    </div>
  );
}

function Pill({ tone, children }: { tone: 'good' | 'bad' | 'neutral'; children: React.ReactNode }) {
  return <span className={`${styles.pill} ${styles[`pill_${tone}`]}`}>{children}</span>;
}

/* ── One student ─────────────────────────────────────────────────── */
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

  if (loading) return <p className={styles.muted}>Loading…</p>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!data) return null;

  const { student, summary, topics, mocks } = data;
  const submittedMocks = mocks.filter((m) => m.result);
  const bestMock = submittedMocks.length > 0
    ? Math.max(...submittedMocks.map((m) => Math.round((m.result!.totalScore / m.result!.maxScore) * 100)))
    : null;

  return (
    <div className={styles.detail}>
      <button className={styles.backBtn} onClick={onBack}>← All students</button>

      <div className={styles.profile}>
        <div className={styles.avatar}>{initials(student.name)}</div>
        <div>
          <p className={styles.name}>{student.name}</p>
          <p className={styles.email}>{student.email}</p>
          <div className={styles.meta}>
            <span className={styles.chip}>Class {student.class}</span>
            <span className={styles.chip}>JEE {student.targetExam}</span>
            <span className={styles.chip}>{student.currentLevel}</span>
            <span className={styles.chip}>Joined {fmtDate(student.joinedAt)}</span>
          </div>
        </div>
      </div>

      <div className={styles.tiles}>
        <Tile label="Practice answered" value={String(summary.answered)} hint={`${summary.correct} correct · ${summary.wrong} wrong`} />
        <Tile label="Practice accuracy" value={summary.answered > 0 ? `${summary.accuracy}%` : '—'} />
        <Tile label="Mock exams" value={String(submittedMocks.length)} hint={`${mocks.length} started`} />
        <Tile label="Best mock" value={bestMock !== null ? `${bestMock}%` : '—'} />
      </div>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Mock exams</h2>
        {mocks.length === 0 ? (
          <p className={styles.muted}>No mock exams yet.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Started</th>
                  <th>Exam</th>
                  <th>Level</th>
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
                    <td className={styles.capitalize}>{m.difficultyMode}</td>
                    <td>
                      <Pill tone={m.status === 'submitted' ? 'good' : 'neutral'}>{m.status.replace('_', ' ')}</Pill>
                    </td>
                    <td className={`${styles.num} ${styles.strong}`}>{m.result ? `${m.result.totalScore} / ${m.result.maxScore}` : '—'}</td>
                    <td className={styles.num}>{m.result?.correct ?? '—'}</td>
                    <td className={styles.num}>{m.result?.incorrect ?? '—'}</td>
                    <td className={styles.num}>{m.result?.unattempted ?? '—'}</td>
                    <td className={styles.num}>{m.result ? fmtDuration(m.result.timeTaken) : '—'}</td>
                    <td className={styles.num}>
                      {m.result && <button className={styles.textBtn} onClick={() => onOpenMock(m.id)}>View →</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Practice by topic <span className={styles.muted}>weakest first</span></h2>
        {topics.length === 0 ? (
          <p className={styles.muted}>No practice answers yet.</p>
        ) : (
          <div className={styles.topicList}>
            {topics.map((t) => (
              <div key={`${t.subject}-${t.topic}`} className={styles.topicRow}>
                <div className={styles.topicName}>
                  <span>{t.topic}</span>
                  <span className={styles.muted}>{t.subject}</span>
                </div>
                <div className={styles.bar}>
                  <div
                    className={`${styles.barFill} ${t.accuracy < 60 ? styles.barLow : ''}`}
                    style={{ width: `${t.accuracy}%` }}
                  />
                </div>
                <span className={styles.topicStat}>{t.correct}/{t.attempts} · {t.accuracy}%</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ── One mock exam: compact question list, details on click ────── */
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
  const [openNo, setOpenNo] = useState<number | null>(null);

  if (loading) return <p className={styles.muted}>Loading…</p>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!data) return null;

  const { exam, result, questions } = data;

  return (
    <div className={styles.detail}>
      <button className={styles.backBtn} onClick={onBack}>← Back to student</button>

      <div className={styles.profile}>
        <div className={styles.avatar}>{initials(exam.studentName)}</div>
        <div>
          <p className={styles.name}>{exam.studentName}</p>
          <p className={styles.email}>JEE {exam.examType} mock · {fmtDate(exam.submittedAt ?? exam.createdAt)}</p>
        </div>
      </div>

      {result && (
        <div className={styles.tiles}>
          <Tile label="Score" value={`${result.totalScore} / ${result.maxScore}`} />
          <Tile label="Correct" value={String(result.correct)} />
          <Tile label="Wrong" value={String(result.incorrect)} />
          <Tile label="Skipped" value={String(result.unattempted)} hint={`in ${fmtDuration(result.timeTaken)}`} />
        </div>
      )}

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Questions <span className={styles.muted}>click a row to see the question</span></h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.num}>#</th>
                <th>Subject</th>
                <th>Their answer</th>
                <th>Correct</th>
                <th className={styles.num}>Marks</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => {
                const isOpen = openNo === q.questionNumber;
                const correctSet = new Set(q.correctAnswer.split(',').map((s) => s.trim()));
                const submittedSet = new Set((q.submitted ?? '').split(',').map((s) => s.trim()).filter(Boolean));
                const skipped = !q.submitted;
                const awarded = q.awarded ?? 0;
                const tone = skipped ? 'neutral' : awarded > 0 ? 'good' : 'bad';
                return (
                  <Fragment key={q.questionNumber}>
                    <tr className={styles.clickRow} onClick={() => setOpenNo(isOpen ? null : q.questionNumber)}>
                      <td className={styles.num}>{q.questionNumber}</td>
                      <td>{q.subject}</td>
                      <td>{q.submitted || <span className={styles.muted}>—</span>}</td>
                      <td className={styles.strong}>{q.correctAnswer}</td>
                      <td className={styles.num}>
                        <Pill tone={tone}>{q.awarded !== null ? `${awarded} / ${q.maxMarks}` : '—'}</Pill>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className={styles.expandRow}>
                        <td colSpan={5}>
                          <div className={styles.expand}>
                            <div className={styles.questionText}><MathText text={q.questionText} /></div>
                            {q.options.length > 0 && (
                              <ul className={styles.options}>
                                {q.options.map((opt, i) => {
                                  const letter = LETTERS[i]!;
                                  const isCorrect = correctSet.has(letter);
                                  const isPicked = submittedSet.has(letter);
                                  return (
                                    <li
                                      key={letter}
                                      className={`${styles.option} ${isCorrect ? styles.optionCorrect : ''} ${isPicked && !isCorrect ? styles.optionWrong : ''}`}
                                    >
                                      <span className={styles.optLetter}>{letter}</span>
                                      <MathText text={stripOptionPrefix(opt)} />
                                      {isPicked && <span className={styles.optTag}>their answer</span>}
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                            {q.options.length === 0 && (
                              <p className={styles.muted}>
                                Integer question. Their answer: {q.submitted || 'none'} · correct: {q.correctAnswer}
                              </p>
                            )}
                            {q.explanation && (
                              <div className={styles.explanation}>
                                <p className={styles.explainLabel}>Explanation</p>
                                <MathText text={q.explanation} />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
