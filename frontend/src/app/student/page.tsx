'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  studentListExams,
  studentLogout,
  studentMe,
  type FacultyStudentUser,
  type StudentExamCard,
} from '@/lib/facultyStudent';
import Loader from '@/components/loader';
import {
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  CARD_INTERACTIVE,
  CHIP_ACCENT,
  CHIP_PROGRESS,
  CHIP_READY,
  CHIP_SCHEDULED,
  CHIP_SUBJECT,
  EMPTY,
  ERROR_BANNER,
  FOCUS_RING,
  cx,
} from '@/components/student-portal/ui';

const ClockIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cx('h-4 w-4', className)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const ListIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cx('h-4 w-4', className)}>
    <path d="M8 6h12M8 12h12M8 18h12" />
    <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cx('h-4 w-4', className)}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

function SectionHeading({ label, count }: { label: string; count: number }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="font-display text-[18px] font-extrabold text-[#003366]">{label}</h2>
      <span className="rounded-full bg-ice px-2.5 py-0.5 text-[12px] font-extrabold text-[#003366]">{count}</span>
      <span aria-hidden className="h-0.5 flex-1 rounded-[2px] bg-[repeating-linear-gradient(90deg,#C6D2F8_0_6px,transparent_6px_11px)]" />
    </div>
  );
}

function formatDateTime(value: string | null) {
  if (!value) return 'To be announced';
  return new Date(value).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function StudentPortalPage() {
  const router = useRouter();
  const [student, setStudent] = useState<FacultyStudentUser | null>(null);
  const [exams, setExams] = useState<StudentExamCard[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [error, setError] = useState('');

  const loadExams = useCallback(async () => {
    setLoadingExams(true);
    try {
      const res = await studentListExams();
      setExams(res.exams);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load exams');
    } finally {
      setLoadingExams(false);
    }
  }, []);

  useEffect(() => {
    studentMe()
      .then((res) => {
        setStudent(res.student);
        void loadExams();
      })
      .catch(() => router.replace('/student/login'));
  }, [router, loadExams]);

  async function handleLogout() {
    await studentLogout();
    router.replace('/student/login');
  }

  if (!student) {
    return <Loader fullScreen text="Checking your session" />;
  }

  const initials = student.name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const activeExams = exams.filter((e) => e.status !== 'submitted' && !e.isUpcoming && !e.isExpired);
  const upcomingExams = exams.filter((e) => e.isUpcoming);
  const completedExams = exams.filter((e) => e.status === 'submitted');

  return (
    <div className="min-h-screen bg-[#FBFCFE] bg-page-wash font-dm text-[#003366]">
      {/* Top navigation: the brand, who is signed in, and the way out. */}
      <header className="sticky top-0 z-20 border-b border-[#003366]/10 bg-[#FBFCFE]/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1160px] items-center justify-between gap-4 px-4 py-1.5 sm:px-6 sm:py-2">
          <Link href="/" aria-label="JEENEET.ai home" className="shrink-0 rounded-xl">
            <Image src="/logo.png" alt="JEENEET.ai" width={118} height={48} priority className="block h-12 w-auto sm:h-14" />
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2.5 rounded-full border border-[#003366]/10 bg-white py-1 pl-1 pr-3.5 shadow-[0_2px_0_#E3E9F7]">
              <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-grad text-[12px] font-extrabold text-white">
                {initials || 'S'}
              </span>
              <span className="hidden min-w-0 flex-col leading-tight sm:flex">
                <span className="max-w-[180px] truncate text-[12.5px] font-extrabold text-[#003366]">{student.name}</span>
                <span className="max-w-[180px] truncate text-[11px] font-medium text-[#5A6B8C]">
                  {student.rollNumber} · {student.batch?.name || student.batch?.code}
                </span>
              </span>
            </div>
            <button type="button" className={cx(BUTTON_SECONDARY, FOCUS_RING)} onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 pb-16 pt-5 sm:px-6 sm:pb-[72px] sm:pt-6">
        <div className="mx-auto w-full max-w-[1160px]">
          <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[#003366]/10 pb-4">
            <div>
              <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-[#003366] sm:text-[26px]">
                {student.institute?.name || 'Your institute'}
              </h1>
              <p className="mt-1 text-[13px] font-medium text-[#5A6B8C]">
                Student exam portal · {exams.length} exam{exams.length === 1 ? '' : 's'} assigned to {student.batch?.name || student.batch?.code}
              </p>
            </div>
            <span className={CHIP_ACCENT}>Batch {student.batch?.code || '—'}</span>
          </header>

          {error && <div className={cx(ERROR_BANNER, 'mb-5')} role="alert">{error}</div>}

          <main className="flex flex-col gap-9">
            {/* 1. Active and available exams */}
            <section>
              <SectionHeading label="Active mock exams" count={activeExams.length} />

              {loadingExams ? (
                <Loader fullScreen={false} size={96} text="Loading assigned exams" />
              ) : activeExams.length === 0 ? (
                <div className={EMPTY}>No active exams right now. Your faculty will schedule the next drill here.</div>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-5">
                  {activeExams.map((exam) => (
                    <article key={exam.id} className={cx(CARD_INTERACTIVE, 'flex flex-col justify-between gap-5')}>
                      <div>
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <span className={CHIP_SUBJECT}>{exam.paper.examType}</span>
                          <span className={exam.status === 'in_progress' ? CHIP_PROGRESS : CHIP_READY}>
                            {exam.status === 'in_progress' ? 'In progress' : 'Ready to start'}
                          </span>
                        </div>

                        <h3 className="text-[16.5px] font-extrabold leading-snug text-[#003366]">{exam.title}</h3>

                        <div className="mt-2 flex flex-wrap items-center gap-4 text-[13px] font-medium text-[#5A6B8C]">
                          <span className="inline-flex items-center gap-1.5">
                            <ClockIcon className="text-[#31407F]" />
                            <strong className="text-[#003366]">{exam.durationMinutes}</strong> minutes
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <ListIcon className="text-[#31407F]" />
                            <strong className="text-[#003366]">{exam.paper.questionCount}</strong> questions
                          </span>
                        </div>

                        {exam.instructions && (
                          <p className="mt-3 rounded-[14px] border border-[#003366]/10 bg-ice px-3.5 py-2.5 text-[12.5px] leading-relaxed text-[#31407F]">
                            {exam.instructions}
                          </p>
                        )}
                      </div>

                      <Link
                        href={`/student/exam/${exam.id}`}
                        className={cx(BUTTON_PRIMARY, 'w-full', FOCUS_RING)}
                      >
                        {exam.status === 'in_progress' ? 'Resume exam' : exam.paper.examType === 'Psychometric' ? 'Start assessment' : 'Start mock exam'}
                      </Link>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* 2. Upcoming scheduled exams */}
            {upcomingExams.length > 0 && (
              <section>
                <SectionHeading label="Upcoming scheduled exams" count={upcomingExams.length} />
                <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-5">
                  {upcomingExams.map((exam) => (
                    <article key={exam.id} className={cx(CARD_INTERACTIVE, 'flex flex-col justify-between gap-5')}>
                      <div>
                        <span className={CHIP_SCHEDULED}>Scheduled</span>
                        <h3 className="mt-3 text-[16.5px] font-extrabold leading-snug text-[#003366]">{exam.title}</h3>
                        <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5A6B8C]">
                          <CalendarIcon className="text-[#31407F]" />
                          Opens {formatDateTime(exam.startTime)}
                        </p>
                      </div>
                      <button type="button" disabled className={cx(BUTTON_SECONDARY, 'w-full')}>
                        Locked until scheduled time
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* 3. Completed exams and scorecards */}
            <section>
              <SectionHeading label="Completed exams and scorecards" count={completedExams.length} />

              {completedExams.length === 0 ? (
                <div className={EMPTY}>
                  Nothing submitted yet. Once you finish an exam, your score, answers and solutions appear here.
                </div>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-5">
                  {completedExams.map((exam) => {
                    const releaseMode =
                      exam.resultReleaseMode ||
                      (exam.result?.isLocked ? 'locked' : exam.showSolutions ? 'full' : 'responses_only');

                    return (
                      <article key={exam.id} className={cx(CARD_INTERACTIVE, 'flex flex-col justify-between gap-5')}>
                        <div>
                          <div className="mb-3 flex items-center justify-between gap-2">
                            <span className={CHIP_READY}>
                              {releaseMode === 'locked' ? 'Submitted' : 'Completed'}
                            </span>
                            {exam.result?.submittedAt && (
                              <span className="text-[12px] font-medium text-[#5A6B8C]">
                                {new Date(exam.result.submittedAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </span>
                            )}
                          </div>

                          <h3 className="text-[16.5px] font-extrabold leading-snug text-[#003366]">{exam.title}</h3>

                          {exam.result && (
                            releaseMode === 'locked' ? (
                              <div className="mt-4 rounded-[16px] border border-[#803688]/20 bg-[#FDF8FF] px-4 py-3 text-center">
                                <div className="text-[12.5px] font-extrabold text-[#803688]">Submission Recorded</div>
                                <div className="mt-0.5 text-[11.5px] text-[#5A6B8C]">Results &amp; answers locked by faculty</div>
                              </div>
                            ) : releaseMode === 'responses_only' ? (
                              <div className="mt-4 rounded-[16px] border border-[#003366]/15 bg-ice px-4 py-3 text-center">
                                <div className="text-[12.5px] font-extrabold text-[#003366]">Responses Recorded</div>
                                <div className="mt-0.5 text-[11.5px] text-[#5A6B8C]">Score &amp; answer key hidden by faculty</div>
                              </div>
                            ) : exam.paper.examType === 'Psychometric' ? (
                              <div className="mt-4 rounded-[16px] border border-[#803688]/15 bg-[#FBF5FC] px-3 py-3 text-center">
                                <div className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#803688]">Psychometric Assessment</div>
                                <div className="mt-0.5 text-[14px] font-extrabold text-[#003366]">Evaluated · View Career Insights</div>
                              </div>
                            ) : (
                              <div className="mt-4 grid grid-cols-3 gap-2 rounded-[16px] border border-[#003366]/10 bg-ice px-3 py-3 text-center">
                                <div>
                                  <div className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#5A6B8C]">Score</div>
                                  <div className={cx('mt-0.5 text-[17px] font-extrabold tabular-nums', exam.result.totalScore >= 0 ? 'text-[#003366]' : 'text-[#C8202F]')}>
                                    {exam.result.totalScore}
                                    <span className="text-[12px] font-semibold text-[#5A6B8C]"> / {exam.result.maxScore}</span>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#5A6B8C]">Correct</div>
                                  <div className="mt-0.5 text-[17px] font-extrabold tabular-nums text-[#15803D]">+{exam.result.correctCount}</div>
                                </div>
                                <div>
                                  <div className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#5A6B8C]">Wrong</div>
                                  <div className="mt-0.5 text-[17px] font-extrabold tabular-nums text-[#C8202F]">-{exam.result.incorrectCount}</div>
                                </div>
                              </div>
                            )
                          )}
                        </div>

                        <Link
                          href={`/student/result/${exam.id}`}
                          className={cx(BUTTON_SECONDARY, 'w-full', FOCUS_RING)}
                        >
                          {releaseMode === 'locked'
                            ? 'View submission status'
                            : releaseMode === 'responses_only'
                              ? 'Review your responses'
                              : exam.paper.examType === 'Psychometric'
                                ? 'View behavioral report & fit'
                                : 'View scorecard and solutions'}
                        </Link>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
