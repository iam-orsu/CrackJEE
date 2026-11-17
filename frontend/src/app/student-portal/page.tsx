'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  studentListExams,
  studentLogin,
  studentLogout,
  studentMe,
  type FacultyStudentUser,
  type StudentExamCard,
} from '@/lib/facultyStudent';
import styles from './studentPortal.module.css';

export default function StudentPortalPage() {
  const [student, setStudent] = useState<FacultyStudentUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [exams, setExams] = useState<StudentExamCard[]>([]);
  const [loadingExams, setLoadingExams] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    studentMe()
      .then((res) => {
        setStudent(res.student);
        loadExams();
      })
      .catch(() => {
        setStudent(null);
      })
      .finally(() => {
        setAuthChecked(true);
      });
  }, []);

  async function loadExams() {
    setLoadingExams(true);
    try {
      const res = await studentListExams();
      setExams(res.exams);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load exams');
    } finally {
      setLoadingExams(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await studentLogin(identifier, password);
      setStudent(res.student);
      await loadExams();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid Roll Number or Password');
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    await studentLogout();
    setStudent(null);
    setExams([]);
  }

  if (!authChecked) {
    return (
      <div className={styles.loginContainer}>
        <div style={{ color: '#64748b', fontSize: '14px' }}>Loading Student Portal…</div>
      </div>
    );
  }

  // If not logged in, show student sign-in screen
  if (!student) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <span className={styles.badge}>Student Exam Portal</span>
          <h1 className={styles.loginTitle}>Institute Student Sign-In</h1>
          <p className={styles.loginSub}>
            Sign in with the Roll Number and password assigned by your faculty to access your mock drills.
          </p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleLogin}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="student-roll">Roll Number or Registered Email</label>
              <input
                id="student-roll"
                type="text"
                className={styles.input}
                placeholder="e.g. JEE-2026-042"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="student-pass">Password</label>
              <input
                id="student-pass"
                type="password"
                className={styles.input}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className={styles.btnPrimary}
              style={{ width: '100%', marginTop: '10px' }}
              disabled={busy}
            >
              {busy ? 'Signing in…' : 'Sign In to Portal'}
            </button>
          </form>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
            Looking for personal self-study practice? <Link href="/login" style={{ color: '#0f766e', fontWeight: 600 }}>Go to Self-Prep Login</Link>
          </div>
        </div>
      </div>
    );
  }

  // Group exams
  const activeExams = exams.filter((e) => e.status !== 'submitted' && !e.isUpcoming);
  const upcomingExams = exams.filter((e) => e.isUpcoming);
  const completedExams = exams.filter((e) => e.status === 'submitted');

  return (
    <div className={styles.wrap}>
      {/* Dashboard Top Header */}
      <header className={styles.dashHeader}>
        <div className={styles.headerInner}>
          <div>
            <div className={styles.brandTitle}>
              🎓 {student.institute?.name || 'Faculty Institute'}
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
              Student Mock Exam Portal
            </div>
          </div>

          <div className={styles.studentMeta}>
            <div className={styles.metaPill}>
              👤 <strong>{student.name}</strong> ({student.rollNumber})
            </div>
            <div className={styles.metaPill}>
              🏷️ Batch: <strong>{student.batch?.name || student.batch?.code}</strong>
            </div>
            <button
              type="button"
              className={styles.btnSecondary}
              style={{ fontSize: '12px', padding: '6px 12px' }}
              onClick={handleLogout}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContainer}>
        {error && <div className={styles.error}>{error}</div>}

        {/* 1. Active & Available Exams */}
        <section>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              📝 Active Mock Exams ({activeExams.length})
            </h2>
          </div>

          {loadingExams ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
              Loading assigned exams…
            </div>
          ) : activeExams.length === 0 ? (
            <div
              style={{
                background: '#ffffff',
                border: '1px dashed #cbd5e1',
                borderRadius: '12px',
                padding: '36px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '14px',
              }}
            >
              No active exams right now. Your faculty will schedule upcoming drills here.
            </div>
          ) : (
            <div className={styles.examGrid}>
              {activeExams.map((exam) => (
                <div key={exam.id} className={styles.examCard}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#0f766e',
                          background: '#f0fdfa',
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {exam.paper.examType}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: exam.status === 'in_progress' ? '#b45309' : '#059669',
                          background: exam.status === 'in_progress' ? '#fef3c7' : '#ecfdf5',
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {exam.status === 'in_progress' ? 'In Progress' : 'Ready to Start'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
                      {exam.title}
                    </h3>

                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      ⏱ <strong>{exam.durationMinutes}</strong> Minutes • 📋 <strong>{exam.paper.questionCount}</strong> Questions
                    </div>

                    {exam.instructions && (
                      <p style={{ fontSize: '12px', color: '#475569', marginTop: '10px', background: '#f8fafc', padding: '8px 10px', borderRadius: '6px' }}>
                        {exam.instructions}
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/student-portal/exam/${exam.id}`}
                    className={styles.btnPrimary}
                    style={{ textDecoration: 'none', textAlign: 'center' }}
                  >
                    {exam.status === 'in_progress' ? 'Resume Exam →' : 'Start Mock Exam →'}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 2. Upcoming Exams */}
        {upcomingExams.length > 0 && (
          <section>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                ⏳ Upcoming Scheduled Exams ({upcomingExams.length})
              </h2>
            </div>
            <div className={styles.examGrid}>
              {upcomingExams.map((exam) => (
                <div key={exam.id} className={styles.examCard} style={{ opacity: 0.85 }}>
                  <div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#6366f1',
                        background: '#eef2ff',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      Scheduled
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '8px 0 6px' }}>
                      {exam.title}
                    </h3>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      Opens at: {exam.startTime ? new Date(exam.startTime).toLocaleString() : 'TBD'}
                    </div>
                  </div>
                  <button type="button" className={styles.btnSecondary} disabled style={{ cursor: 'not-allowed' }}>
                    Exam Locked until Scheduled Time
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Completed Exams & Results */}
        <section>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              📊 Completed Exams &amp; Scorecards ({completedExams.length})
            </h2>
          </div>

          {completedExams.length === 0 ? (
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
              No submitted exams yet. Once you complete an exam, your score, answers, and solutions will appear here.
            </div>
          ) : (
            <div className={styles.examGrid}>
              {completedExams.map((exam) => (
                <div key={exam.id} className={styles.examCard}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#065f46',
                          background: '#ecfdf5',
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        ✓ Completed
                      </span>
                      {exam.result?.submittedAt && (
                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                          {new Date(exam.result.submittedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>
                      {exam.title}
                    </h3>

                    {exam.result && (
                      <div
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '12px',
                          display: 'flex',
                          justifyContent: 'space-around',
                          textAlign: 'center',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>Score</div>
                          <div style={{ fontSize: '18px', fontWeight: 700, color: exam.result.totalScore >= 0 ? '#0f172a' : '#ef4444' }}>
                            {exam.result.totalScore}
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 400 }}> / {exam.result.maxScore}</span>
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>Correct</div>
                          <div style={{ fontSize: '18px', fontWeight: 700, color: '#10b981' }}>
                            +{exam.result.correctCount}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>Wrong</div>
                          <div style={{ fontSize: '18px', fontWeight: 700, color: '#ef4444' }}>
                            -{exam.result.incorrectCount}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/student-portal/result/${exam.id}`}
                    className={styles.btnSecondary}
                    style={{ textDecoration: 'none', textAlign: 'center', fontWeight: 600 }}
                  >
                    View Scorecard &amp; Solutions →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
