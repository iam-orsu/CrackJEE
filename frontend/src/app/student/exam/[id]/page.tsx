'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import Loader from '@/components/loader';
import {
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  ERROR_BANNER,
  FOCUS_RING,
  INPUT,
  LABEL,
  cx,
} from '@/components/student-portal/ui';

const SUBJECT_PILL =
  'cursor-pointer rounded-[12px] border px-3 py-1.5 text-[12.5px] font-bold transition-colors duration-150 motion-reduce:transition-none';

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

  const updateLocalAnswers = useCallback((nextAnswers: Record<string, string>) => {
    try {
      localStorage.setItem(`faculty_student_exam_answers_${examId}`, JSON.stringify(nextAnswers));
    } catch {}
  }, [examId]);

  // Load exam session with offline local storage cache merge
  useEffect(() => {
    studentStartExam(examId)
      .then((data) => {
        setSession(data);
        let initialAnswers = { ...(data.savedAnswers || {}) };
        try {
          const local = localStorage.getItem(`faculty_student_exam_answers_${examId}`);
          if (local) {
            const parsed = JSON.parse(local);
            if (parsed && typeof parsed === 'object') {
              initialAnswers = { ...initialAnswers, ...parsed };
            }
          }
        } catch {}
        setAnswers(initialAnswers);
        updateLocalAnswers(initialAnswers);
        const totalDuration = data.durationMinutes * 60;
        const elapsed = data.timeTakenSeconds || 0;
        setTimeTakenSeconds(elapsed);
        setSecondsRemaining(Math.max(0, totalDuration - elapsed));
      })
      .catch((err) => {
        // If already submitted, redirect to result
        if (err.message?.includes('already submitted')) {
          router.replace(`/student/result/${examId}`);
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to launch exam');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [examId, router, updateLocalAnswers]);

  // Flush answers on window close / navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (session && !submitting) {
        studentSaveAnswers(examId, answersRef.current, timeTakenRef.current).catch(() => {});
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [session, examId, submitting]);

  // Live timer countdown with wall-clock drift compensation (handles background tab throttling)
  useEffect(() => {
    if (!session || submitting) return;

    const initialElapsed = session.timeTakenSeconds || 0;
    const clientMountTime = Date.now();
    const totalDurationSec = session.durationMinutes * 60;

    const timer = setInterval(() => {
      const realSecondsSinceMount = Math.floor((Date.now() - clientMountTime) / 1000);
      const currentElapsed = initialElapsed + realSecondsSinceMount;
      const remaining = Math.max(0, totalDurationSec - currentElapsed);

      setTimeTakenSeconds(currentElapsed);
      setSecondsRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        // Auto submit on time out
        finalSubmitRef.current();
      }
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
    setAnswers((prev) => {
      const next = { ...prev, [qNum]: letter };
      updateLocalAnswers(next);
      return next;
    });
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
    setAnswers((prev) => {
      const next = { ...prev, [qNum]: sorted };
      updateLocalAnswers(next);
      return next;
    });
  }

  function handleIntegerChange(val: string) {
    if (!activeQuestion) return;
    const qNum = String(activeQuestion.number);
    setAnswers((prev) => {
      const next = { ...prev, [qNum]: val };
      updateLocalAnswers(next);
      return next;
    });
  }

  function handleClearResponse() {
    if (!activeQuestion) return;
    const qNum = String(activeQuestion.number);
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[qNum];
      updateLocalAnswers(copy);
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
      try {
        localStorage.removeItem(`faculty_student_exam_answers_${examId}`);
      } catch {}
      router.replace(`/student/result/${examId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed';
      if (message.includes('already submitted')) {
        try {
          localStorage.removeItem(`faculty_student_exam_answers_${examId}`);
        } catch {}
        router.replace(`/student/result/${examId}`);
        return;
      }
      setError(`${message}. Your answers are preserved locally. Please click Submit again.`);
      setSubmitting(false);
      setConfirmModalOpen(false);
    }
  }
  finalSubmitRef.current = handleFinalSubmit;

  if (loading) {
    return <Loader fullScreen text="Preparing your computer-based test" />;
  }

  if (error && !session) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#FBFCFE] bg-page-wash p-5 font-dm">
        <div className="w-full max-w-[460px] rounded-[28px] border-[2.5px] border-[#003366] bg-white p-6 shadow-[7px_9px_0_#C6D2F8]">
          <div className={ERROR_BANNER} role="alert">{error}</div>
          <Link href="/student" className={cx(BUTTON_SECONDARY, 'mt-4 w-full', FOCUS_RING)}>
            Back to dashboard
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
  const timerCritical = secondsRemaining < 300;
  const isPsychometric =
    session.examType === 'Psychometric' ||
    session.questions.some((q) => q.subject === 'Psychometric');

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#FBFCFE] font-dm text-[#003366]">
      {/* ── Top CBT bar ── */}
      <header className="z-10 flex flex-wrap items-center justify-between gap-4 border-b-[3px] border-[#5A2560] bg-[#003366] px-4 py-3 text-white sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 rounded-md bg-grad px-2 py-0.5 text-[11px] font-extrabold tracking-[0.04em] text-white">
            {isPsychometric
              ? 'Psychometric Assessment'
              : `${session.examType} CBT`}
          </span>
          <h1 className="truncate text-[15.5px] font-extrabold">{session.title}</h1>
        </div>

        {/* Subject navigation tabs (hidden for psychometric sequential flow) */}
        {!isPsychometric && (
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedSubject('All')}
              aria-pressed={selectedSubject === 'All'}
              className={cx(
                SUBJECT_PILL,
                selectedSubject === 'All'
                  ? 'border-white bg-white text-[#003366]'
                  : 'border-white/25 bg-white/10 text-white hover:bg-white/20',
                FOCUS_RING,
              )}
            >
              All subjects
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
                aria-pressed={selectedSubject === subj}
                className={cx(
                  SUBJECT_PILL,
                  selectedSubject === subj
                    ? 'border-white bg-white text-[#003366]'
                    : 'border-white/25 bg-white/10 text-white hover:bg-white/20',
                  FOCUS_RING,
                )}
              >
                {subj}
              </button>
            ))}
          </div>
        )}

        {/* Live timer & submit */}
        <div className="flex items-center gap-3">
          <div
            className={cx(
              'rounded-[12px] border px-3.5 py-1.5 font-mono text-[17px] font-bold tabular-nums tracking-[0.06em]',
              timerCritical
                ? 'animate-[pulse_1.5s_ease-in-out_infinite] border-[#FF9AA2] bg-[#7A1620] text-[#FFD3D7] motion-reduce:animate-none'
                : 'border-white/20 bg-white/10 text-white',
            )}
            role="timer"
            aria-live="off"
          >
            {formatTimer(secondsRemaining)}
          </div>
          <button
            type="button"
            className={cx(BUTTON_PRIMARY, FOCUS_RING)}
            onClick={() => setConfirmModalOpen(true)}
          >
            Submit exam
          </button>
        </div>
      </header>

      {/* ── Main exam body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: active question */}
        <main className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pb-20 pt-6 sm:px-8">
          {error && <div className={ERROR_BANNER} role="alert">{error}</div>}

          {/* Question header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#003366]/10 pb-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-[18px] font-extrabold text-[#003366]">
                {isPsychometric ? 'Assessment Question' : `Question ${activeQuestion.number} of ${session.questions.length}`}
              </h2>
              <span className="rounded-md bg-ice px-2 py-0.5 text-[11.5px] font-bold text-[#31407F]">
                {activeQuestion.subject} · {activeQuestion.topic}
              </span>
            </div>
            {session.examType === 'Psychometric' || activeQuestion.subject === 'Psychometric' ? (
              <span className="rounded-full bg-accent/10 px-3 py-1 text-[12px] font-bold text-accent">
                Opinion &amp; Behavioral Assessment · No Right/Wrong Answers
              </span>
            ) : (
              <p className="text-[12.5px] font-medium text-[#5A6B8C]">
                Marking: <strong className="text-[#15803D]">+4</strong> correct, <strong className="text-[#C8202F]">-1</strong> wrong
              </p>
            )}
          </div>

          {/* Diagram if available */}
          {activeQuestion.diagram && (
            <div className="rounded-[18px] border border-[#003366]/10 bg-white p-3">
              <DiagramRenderer descriptor={activeQuestion.diagram} context={{ topic: activeQuestion.topic, questionText: activeQuestion.questionText }} />
            </div>
          )}

          {/* Question text with KaTeX */}
          <div
            className="text-[16px] leading-[1.7] text-[#1E2A44]"
            dangerouslySetInnerHTML={{ __html: renderMathHtml(activeQuestion.questionText) }}
          />

          {/* Options / answer input */}
          <div>
            {activeQuestion.questionType === 'integer' ? (
              <div className="grid max-w-[320px] gap-1.5">
                <label className={LABEL} htmlFor="integer-answer">Enter integer / numeric answer</label>
                <input
                  id="integer-answer"
                  type="text"
                  className={INPUT}
                  placeholder="e.g. 24 or -5"
                  value={currentAnswer}
                  onChange={(e) => handleIntegerChange(e.target.value)}
                />
              </div>
            ) : activeQuestion.questionType === 'mcq_multi' ? (
              <div className="flex flex-col gap-2.5">
                <p className="text-[12.5px] font-extrabold text-accent">Multiple correct options — select all that apply</p>
                {activeQuestion.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isChecked = currentAnswer.split(',').includes(letter);
                  return (
                    <label
                      key={letter}
                      className={cx(
                        'flex cursor-pointer items-center gap-3 rounded-[16px] border-[2.5px] px-4 py-3 transition-colors duration-150 motion-reduce:transition-none',
                        isChecked ? 'border-accent bg-accent-50' : 'border-[#003366]/12 bg-white hover:border-[#003366]/30',
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleMultiSelect(letter)}
                        className="h-4 w-4 shrink-0 cursor-pointer accent-[#803688]"
                      />
                      <span className="min-w-[22px] font-extrabold">{letter}.</span>
                      <span
                        className="flex-1 text-[15px] text-[#1E2A44]"
                        dangerouslySetInnerHTML={{ __html: renderMathHtml(stripOptionPrefix(opt)) }}
                      />
                    </label>
                  );
                })}
              </div>
            ) : (
              // Single choice & matrix match
              <div className="flex flex-col gap-2.5">
                {activeQuestion.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = currentAnswer === letter;
                  return (
                    <label
                      key={letter}
                      className={cx(
                        'flex cursor-pointer items-center gap-3 rounded-[16px] border-[2.5px] px-4 py-3 transition-colors duration-150 motion-reduce:transition-none',
                        isSelected ? 'border-accent bg-accent-50' : 'border-[#003366]/12 bg-white hover:border-[#003366]/30',
                      )}
                    >
                      <input
                        type="radio"
                        name={`q-${activeQuestion.number}`}
                        checked={isSelected}
                        onChange={() => handleSingleSelect(letter)}
                        className="h-4 w-4 shrink-0 cursor-pointer accent-[#803688]"
                      />
                      <span className="min-w-[22px] font-extrabold">{letter}.</span>
                      <span
                        className="flex-1 text-[15px] text-[#1E2A44]"
                        dangerouslySetInnerHTML={{ __html: renderMathHtml(stripOptionPrefix(opt)) }}
                      />
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom actions bar */}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[#003366]/10 pt-5">
            <div className="flex flex-wrap gap-2.5">
              {!isPsychometric && (
                <>
                  <button
                    type="button"
                    className={cx(
                      BUTTON_SECONDARY,
                      isMarkedReview && 'border-accent text-accent shadow-[0_4px_0_#E2C2F0]',
                      FOCUS_RING,
                    )}
                    onClick={toggleMarkForReview}
                    aria-pressed={isMarkedReview}
                  >
                    {isMarkedReview ? 'Marked for review' : 'Mark for review'}
                  </button>
                  {currentAnswer && (
                    <button type="button" className={cx(BUTTON_SECONDARY, FOCUS_RING)} onClick={handleClearResponse}>
                      Clear response
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                className={cx(BUTTON_SECONDARY, FOCUS_RING)}
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
              >
                Previous
              </button>
              <button
                type="button"
                className={cx(BUTTON_PRIMARY, FOCUS_RING)}
                onClick={() => {
                  if (currentIndex < session.questions.length - 1) {
                    setCurrentIndex((idx) => idx + 1);
                  } else {
                    setConfirmModalOpen(true);
                  }
                }}
              >
                {currentIndex < session.questions.length - 1 ? (isPsychometric ? 'Next' : 'Save and next') : (isPsychometric ? 'Submit assessment' : 'Review and submit')}
              </button>
            </div>
          </div>
        </main>

        {/* Right: question palette (hidden for psychometric sequential flow) */}
        {!isPsychometric && (
          <aside className="hidden w-[320px] shrink-0 flex-col gap-5 overflow-y-auto border-l border-[#003366]/10 bg-white p-5 lg:flex">
            <div>
              <h3 className="mb-3 font-display text-[15px] font-extrabold text-[#003366]">Question palette</h3>
              <ul className="grid gap-2 text-[12.5px] font-semibold text-[#31407F]">
                <li className="flex items-center gap-2.5">
                  <span aria-hidden className="h-3.5 w-3.5 rounded-[4px] bg-[#15803D]" />
                  <strong className="tabular-nums">{answeredCount}</strong> answered
                </li>
                <li className="flex items-center gap-2.5">
                  <span aria-hidden className="h-3.5 w-3.5 rounded-[4px] bg-accent" />
                  <strong className="tabular-nums">{reviewCount}</strong> marked for review
                </li>
                <li className="flex items-center gap-2.5">
                  <span aria-hidden className="h-3.5 w-3.5 rounded-[4px] border border-[#003366]/20 bg-white" />
                  <strong className="tabular-nums">{unattemptedCount}</strong> not answered
                </li>
              </ul>
            </div>

            <div className="border-t border-[#003366]/10 pt-4">
              <div className="grid grid-cols-5 gap-2">
                {session.questions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered = !!answers[String(q.number)];
                  const isReview = reviewMarked.has(q.number);

                  return (
                    <button
                      key={q.number}
                      type="button"
                      aria-label={`Go to question ${q.number}`}
                      aria-current={isCurrent ? 'true' : undefined}
                      className={cx(
                        'grid aspect-square cursor-pointer place-items-center rounded-[10px] border text-[12.5px] font-bold tabular-nums transition-colors duration-150 motion-reduce:transition-none',
                        isAnswered
                          ? 'border-[#15803D] bg-[#15803D] text-white'
                          : isReview
                            ? 'border-accent bg-accent text-white'
                            : 'border-[#003366]/15 bg-white text-[#003366] hover:bg-ice',
                        isCurrent && 'outline outline-[3px] outline-offset-1 outline-accent',
                        FOCUS_RING,
                      )}
                      onClick={() => setCurrentIndex(idx)}
                    >
                      {q.number}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-auto border-t border-[#003366]/10 pt-4">
              <button
                type="button"
                className={cx(BUTTON_PRIMARY, 'w-full', FOCUS_RING)}
                onClick={() => setConfirmModalOpen(true)}
              >
                Submit test
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* ── Submit confirmation modal ── */}
      {confirmModalOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0F172A]/45 p-5"
          onClick={() => !submitting && setConfirmModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-exam-title"
            className="w-full max-w-[480px] rounded-[24px] border border-[#003366]/10 bg-white p-6 shadow-[0_20px_40px_rgba(15,23,42,0.15)] sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="submit-exam-title" className="font-display text-[19px] font-extrabold text-[#003366]">
              Submit the exam?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-[#5A6B8C]">
              Once submitted, your answers are final and cannot be changed.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3 rounded-[18px] border border-[#003366]/10 bg-ice px-4 py-4 text-center">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#5A6B8C]">Answered</div>
                <div className="mt-0.5 text-[20px] font-extrabold tabular-nums text-[#15803D]">{answeredCount}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#5A6B8C]">Marked</div>
                <div className="mt-0.5 text-[20px] font-extrabold tabular-nums text-accent">{reviewCount}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#5A6B8C]">Skipped</div>
                <div className="mt-0.5 text-[20px] font-extrabold tabular-nums text-[#C8202F]">{unattemptedCount}</div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                className={cx(BUTTON_SECONDARY, FOCUS_RING)}
                onClick={() => setConfirmModalOpen(false)}
                disabled={submitting}
              >
                Back to test
              </button>
              <button
                type="button"
                className={cx(BUTTON_PRIMARY, FOCUS_RING)}
                onClick={handleFinalSubmit}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit exam'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
