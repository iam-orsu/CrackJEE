'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  studentSaveAnswers,
  studentStartExam,
  studentSubmitExam,
  type StudentExamQuestion,
  type StudentExamSession,
} from '@/lib/facultyStudent';
import { renderMathHtml, stripOptionPrefix } from '@/lib/math';
import { DiagramRenderer } from '@/components/DiagramRenderer';
import styles from '@/app/student-portal/studentPortal.module.css';

export default function StudentExamCbtPage() {
  const params = useParams();
  const router = useRouter();
  const examId = String(params.id);

  const [session, setSession] = useState<StudentExamSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Active question state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reviewMarked, setReviewMarked] = useState<Set<number>>(new Set());

  // Timer state
  const [secondsRemaining, setSecondsRemaining] = useState<number>(10800);
  const [timeTakenSeconds, setTimeTakenSeconds] = useState(0);

  // Filter subject tab
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  // Submit modal & busy
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Autosave interval ref
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const timeTakenRef = useRef(timeTakenSeconds);
  timeTakenRef.current = timeTakenSeconds;
  const finalSubmitRef = useRef<() => void>(() => {});

  // Load exam session
  useEffect(() => {
    studentStartExam(examId)
      .then((data) => {
        setSession(data);
        setAnswers(data.savedAnswers || {});
        const totalDuration = data.durationMinutes * 60;
        const elapsed = data.timeTakenSeconds || 0;
        setTimeTakenSeconds(elapsed);
        setSecondsRemaining(Math.max(0, totalDuration - elapsed));
      })
      .catch((err) => {
        // If already submitted, redirect to result
        if (err.message?.includes('already submitted')) {
          router.replace(`/student-portal/result/${examId}`);
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to launch exam');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [examId, router]);

  // Live timer countdown
  useEffect(() => {
    if (!session || submitting) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit on time out
          finalSubmitRef.current();
          return 0;
        }
        return prev - 1;
      });
      setTimeTakenSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [session, submitting]);

  // Periodic autosave every 30 seconds
  useEffect(() => {
    if (!session || submitting) return;

    const autosaveTimer = setInterval(() => {
      studentSaveAnswers(examId, answersRef.current, timeTakenRef.current).catch(() => {});
    }, 30_000);

    return () => clearInterval(autosaveTimer);
  }, [session, examId, submitting]);

  // Distinct subjects in paper
  const subjects = useMemo(() => {
    if (!session) return [];
    return Array.from(new Set(session.questions.map((q) => q.subject)));
  }, [session]);

  const activeQuestion: StudentExamQuestion | undefined = session?.questions[currentIndex];

  function formatTimer(totalSec: number) {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  // Answer modification handlers
  function handleSingleSelect(letter: string) {
    if (!activeQuestion) return;
    const qNum = String(activeQuestion.number);
    setAnswers((prev) => ({ ...prev, [qNum]: letter }));
  }

  function handleMultiSelect(letter: string) {
    if (!activeQuestion) return;
    const qNum = String(activeQuestion.number);
    const current = (answers[qNum] || '').split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);
    const set = new Set(current);
    if (set.has(letter)) {
      set.delete(letter);
    } else {
      set.add(letter);
    }
    const sorted = Array.from(set).sort().join(',');
    setAnswers((prev) => ({ ...prev, [qNum]: sorted }));
  }

  function handleIntegerChange(val: string) {
    if (!activeQuestion) return;
    const qNum = String(activeQuestion.number);
    setAnswers((prev) => ({ ...prev, [qNum]: val }));
  }

  function handleClearResponse() {
    if (!activeQuestion) return;
    const qNum = String(activeQuestion.number);
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[qNum];
      return copy;
    });
  }

  function toggleMarkForReview() {
    if (!activeQuestion) return;
    const num = activeQuestion.number;
    setReviewMarked((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  }

  async function handleFinalSubmit() {
    if (submitting) return;
    setSubmitting(true);
    try {
      await studentSubmitExam(examId, answersRef.current, timeTakenRef.current);
      router.replace(`/student-portal/result/${examId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
      setSubmitting(false);
      setConfirmModalOpen(false);
    }
  }
  finalSubmitRef.current = handleFinalSubmit;

  if (loading) {
    return (
      <div className={styles.loginContainer}>
        <div style={{ color: '#0f766e', fontWeight: 600, fontSize: '16px' }}>
          Preparing Computer-Based Test (CBT)…
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.error}>{error}</div>
          <Link href="/student-portal" className={styles.btnSecondary} style={{ display: 'block', textAlign: 'center' }}>
            ← Back to Student Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!session || !activeQuestion) return null;

  // Question stats for submit modal & palette
  const answeredCount = Object.keys(answers).length;
  const reviewCount = reviewMarked.size;
  const unattemptedCount = session.questions.length - answeredCount;

  const currentAnswer = answers[String(activeQuestion.number)] || '';
  const isMarkedReview = reviewMarked.has(activeQuestion.number);

  return (
    <div className={styles.cbtContainer}>
      {/* ── Top CBT Bar ── */}
      <header className={styles.cbtTopBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span
            style={{
              background: '#0f766e',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '4px',
            }}
          >
            {session.examType} CBT
          </span>
          <h1 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#f8fafc' }}>
            {session.title}
          </h1>
        </div>

        {/* Subject Navigation Tabs */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setSelectedSubject('All')}
            style={{
              background: selectedSubject === 'All' ? '#38bdf8' : '#334155',
              color: selectedSubject === 'All' ? '#0f172a' : '#f8fafc',
              border: 'none',
              borderRadius: '6px',
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            All Subjects
          </button>
          {subjects.map((subj) => (
            <button
              key={subj}
              type="button"
              onClick={() => {
                setSelectedSubject(subj);
                const firstInSubject = session.questions.findIndex((q) => q.subject === subj);
                if (firstInSubject !== -1) setCurrentIndex(firstInSubject);
              }}
              style={{
                background: selectedSubject === subj ? '#38bdf8' : '#334155',
                color: selectedSubject === subj ? '#0f172a' : '#f8fafc',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {subj}
            </button>
          ))}
        </div>

        {/* Live Timer & Submit Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className={`${styles.cbtTimer} ${secondsRemaining < 300 ? styles.cbtTimerWarning : ''}`}>
            ⏱ {formatTimer(secondsRemaining)}
          </div>
          <button
            type="button"
            className={styles.btnPrimary}
            style={{ background: '#10b981', borderColor: '#059669', fontSize: '13px', padding: '6px 14px' }}
            onClick={() => setConfirmModalOpen(true)}
          >
            Submit Exam
          </button>
        </div>
      </header>

      {/* ── Main Exam Body ── */}
      <div className={styles.cbtBody}>
        {/* Left: Active Question Viewer */}
        <main className={styles.cbtMain}>
          {/* Question Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                Question {activeQuestion.number} of {session.questions.length}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#475569',
                  background: '#e2e8f0',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                {activeQuestion.subject} • {activeQuestion.topic}
              </span>
            </div>

            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Marking: <strong style={{ color: '#10b981' }}>+4</strong> for correct, <strong style={{ color: '#ef4444' }}>-1</strong> for wrong
            </div>
          </div>

          {/* Diagram if available */}
          {activeQuestion.diagram && (
            <div style={{ margin: '8px 0', padding: '12px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <DiagramRenderer descriptor={activeQuestion.diagram} />
            </div>
          )}

          {/* Question Text with KaTeX */}
          <div
            style={{ fontSize: '16px', lineHeight: 1.7, color: '#1e293b' }}
            dangerouslySetInnerHTML={{ __html: renderMathHtml(activeQuestion.questionText) }}
          />

          {/* Options / Answer Input Section */}
          <div style={{ marginTop: '16px' }}>
            {activeQuestion.questionType === 'integer' ? (
              <div style={{ maxWidth: '300px' }}>
                <label className={styles.label}>Enter Integer / Numeric Answer:</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. 24 or -5"
                  value={currentAnswer}
                  onChange={(e) => handleIntegerChange(e.target.value)}
                />
              </div>
            ) : activeQuestion.questionType === 'mcq_multi' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '12px', color: '#6366f1', fontWeight: 600 }}>
                  Multiple Correct Option(s) — Check all that apply
                </div>
                {activeQuestion.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isChecked = currentAnswer.split(',').includes(letter);
                  return (
                    <div
                      key={letter}
                      onClick={() => handleMultiSelect(letter)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        background: isChecked ? '#f0fdfa' : '#ffffff',
                        border: isChecked ? '2px solid #0f766e' : '1px solid #e2e8f0',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <span style={{ fontWeight: 700, minWidth: '22px' }}>{letter}.</span>
                      <span
                        style={{ flex: 1 }}
                        dangerouslySetInnerHTML={{ __html: renderMathHtml(stripOptionPrefix(opt)) }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              // Single Choice & Matrix Match
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeQuestion.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = currentAnswer === letter;
                  return (
                    <div
                      key={letter}
                      onClick={() => handleSingleSelect(letter)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        background: isSelected ? '#f0fdfa' : '#ffffff',
                        border: isSelected ? '2px solid #0f766e' : '1px solid #e2e8f0',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: isSelected ? '5px solid #0f766e' : '2px solid #cbd5e1',
                          background: '#ffffff',
                        }}
                      />
                      <span style={{ fontWeight: 700, minWidth: '22px' }}>{letter}.</span>
                      <span
                        style={{ flex: 1 }}
                        dangerouslySetInnerHTML={{ __html: renderMathHtml(stripOptionPrefix(opt)) }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Actions Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '20px',
              marginTop: 'auto',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={toggleMarkForReview}
                style={{
                  background: isMarkedReview ? '#8b5cf6' : '#ffffff',
                  color: isMarkedReview ? '#ffffff' : '#475569',
                  borderColor: isMarkedReview ? '#7c3aed' : '#cbd5e1',
                }}
              >
                {isMarkedReview ? '★ Marked for Review' : 'Mark for Review'}
              </button>
              {currentAnswer && (
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={handleClearResponse}
                >
                  Clear Response
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className={styles.btnSecondary}
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
              >
                ← Previous
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => {
                  if (currentIndex < session.questions.length - 1) {
                    setCurrentIndex((idx) => idx + 1);
                  } else {
                    setConfirmModalOpen(true);
                  }
                }}
              >
                {currentIndex < session.questions.length - 1 ? 'Save & Next →' : 'Review & Submit'}
              </button>
            </div>
          </div>
        </main>

        {/* Right: Question Palette Sidebar */}
        <aside className={styles.cbtSidebar}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
              Question Palette
            </h3>
            {/* Palette legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#10b981' }} />
                <span><strong>{answeredCount}</strong> Answered</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#8b5cf6' }} />
                <span><strong>{reviewCount}</strong> Marked for Review</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#cbd5e1' }} />
                <span><strong>{unattemptedCount}</strong> Not Answered</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <div className={styles.paletteGrid}>
              {session.questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = !!answers[String(q.number)];
                const isReview = reviewMarked.has(q.number);

                let cls = styles.paletteBtn;
                if (isCurrent) cls += ` ${styles.paletteBtnActive}`;
                if (isAnswered) cls += ` ${styles.paletteAnswered}`;
                else if (isReview) cls += ` ${styles.paletteReview}`;

                return (
                  <button
                    key={q.number}
                    type="button"
                    className={cls}
                    onClick={() => setCurrentIndex(idx)}
                  >
                    {q.number}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <button
              type="button"
              className={styles.btnPrimary}
              style={{ width: '100%', background: '#10b981', borderColor: '#059669' }}
              onClick={() => setConfirmModalOpen(true)}
            >
              Submit Test
            </button>
          </div>
        </aside>
      </div>

      {/* ── Submit Confirmation Modal ── */}
      {confirmModalOpen && (
        <div className={styles.modalOverlay} onClick={() => !submitting && setConfirmModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>
              Submit Exam?
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px' }}>
              Are you sure you want to finish and submit your exam? Here is your summary:
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                textAlign: 'center',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '20px',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Answered</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#10b981' }}>{answeredCount}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Marked</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#8b5cf6' }}>{reviewCount}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Skipped</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#ef4444' }}>{unattemptedCount}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setConfirmModalOpen(false)}
                disabled={submitting}
              >
                Back to Test
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                style={{ background: '#10b981', borderColor: '#059669' }}
                onClick={handleFinalSubmit}
                disabled={submitting}
              >
                {submitting ? 'Submitting…' : 'Yes, Submit Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
