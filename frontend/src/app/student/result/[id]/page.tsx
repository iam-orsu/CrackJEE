'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  studentGetResult,
  type StudentExamResultData,
} from '@/lib/facultyStudent';
import { renderMathHtml, renderExplanationHtml, stripOptionPrefix } from '@/lib/math';
import { DiagramRenderer } from '@/components/DiagramRenderer';
import Loader from '@/components/loader';
import {
  BAD,
  FAINT,
  GOOD,
  HEAD,
  NAVY,
  Ring,
  btn,
  glass,
  h2c,
  kicker,
  plural,
  toneColor,
  Empty,
} from '@/components/insights/InsightBlocks';

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className ?? 'h-4 w-4'}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className ?? 'h-4 w-4'}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const CompassIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className ?? 'h-4 w-4'}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const FILTER_TABS = [
  { value: 'all', label: 'All' },
  { value: 'correct', label: 'Correct' },
  { value: 'incorrect', label: 'Incorrect' },
  { value: 'skipped', label: 'Skipped' },
] as const;

const STATUS_CHIP = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-[0.03em]';
const CHIP_CORRECT = `${STATUS_CHIP} bg-[#EAF7EF] text-[#146C33]`;
const CHIP_WRONG = `${STATUS_CHIP} bg-[#FDE6E8] text-[#C8202F]`;
const CHIP_SKIPPED = `${STATUS_CHIP} bg-[#EEF2FF] text-[#5A6B8C]`;
const SECONDARY_BTN =
  'inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#003366] bg-white px-5 py-2.5 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_6px_0_rgba(0,51,102,.18)] transition-[transform,box-shadow] duration-150 hover:-translate-y-[3px] hover:shadow-[0_9px_0_rgba(0,51,102,.18)] active:translate-y-[4px] active:shadow-[0_2px_0_rgba(0,51,102,.18)] motion-reduce:transition-none';

/* Same page-load motion the dashboard uses. */
const Style = () => (
  <style>{`
@keyframes dz-rise{from{opacity:0;transform:translateY(20px) scale(.98)}to{opacity:1;transform:none}}
@keyframes dz-pop{0%{opacity:0;transform:scale(.55)}70%{transform:scale(1.07)}100%{opacity:1;transform:scale(1)}}
@keyframes dz-slide{from{width:0}}
.dz-rise{animation:dz-rise .75s cubic-bezier(.2,.8,.2,1) both}
.dz-stagger>*{animation:dz-rise .65s cubic-bezier(.2,.8,.2,1) both}
.dz-stagger>*:nth-child(2){animation-delay:.07s}.dz-stagger>*:nth-child(3){animation-delay:.14s}.dz-stagger>*:nth-child(4){animation-delay:.21s}.dz-stagger>*:nth-child(5){animation-delay:.28s}.dz-stagger>*:nth-child(6){animation-delay:.35s}
.dz-pop{animation:dz-pop .55s cubic-bezier(.2,.9,.3,1.2) both}
@media (prefers-reduced-motion:reduce){.dz-rise,.dz-stagger>*,.dz-pop{animation:none!important}}
`}</style>
);

const Head = ({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) => (
  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
    <div>
      <h2 className={h2c}>{title}</h2>
      {sub && <p className="mt-1 text-[13px] text-[#5A6B8C]">{sub}</p>}
    </div>
    {right}
  </div>
);

export default function StudentExamResultPage() {
  const params = useParams();
  const examId = String(params.id);

  const [data, setData] = useState<StudentExamResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'incorrect' | 'skipped'>('all');
  const [psyFilter, setPsyFilter] = useState<'all' | 'answered' | 'skipped'>('all');

  useEffect(() => {
    studentGetResult(examId)
      .then((res) => setData(res))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load result'))
      .finally(() => setLoading(false));
  }, [examId]);

  // Auto-poll result every 2s while AI evaluation is refining in background
  useEffect(() => {
    const isRefining =
      data?.scorecard?.aiStatus === 'pending' || data?.scorecard?.aiStatus === 'processing';
    if (!isRefining) return;

    const interval = setInterval(() => {
      studentGetResult(examId)
        .then((res) => {
          if (res) {
            setData(res);
            if (res.scorecard?.aiStatus === 'completed') {
              clearInterval(interval);
            }
          }
        })
        .catch(() => {});
    }, 2000);

    return () => clearInterval(interval);
  }, [examId, data?.scorecard?.aiStatus]);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }

  if (loading) {
    return <Loader fullScreen text="Calculating scorecard and compiling solutions" />;
  }

  if (error || !data) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#FBFCFE] bg-page-wash px-4 font-dm">
        <div className={`${glass} w-full max-w-[460px] p-6 text-center`}>
          <p className="rounded-2xl border border-[#F4C7C7] bg-[#FEF2F2] px-4 py-3 text-[13px] font-semibold text-[#B42318]" role="alert">
            {error || 'Result not found'}
          </p>
          <Link href="/student" className={`${btn} mt-4`}>
            <ArrowLeftIcon />
            Back to student dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { scorecard, assignment, solutions } = data;
  const rank = scorecard.rank;

  const totalAttempted = scorecard.correctCount + scorecard.incorrectCount;
  const accuracyPct = totalAttempted > 0 ? Math.round((scorecard.correctCount / totalAttempted) * 100) : 0;
  const scorePct =
    scorecard.maxScore > 0
      ? Math.max(0, Math.min(100, Math.round((scorecard.totalScore / scorecard.maxScore) * 100)))
      : 0;
  const tone = toneColor(scorePct);

  const aheadPct =
    scorecard.totalCandidates > 1
      ? Math.max(0, Math.min(100, Math.round(((scorecard.totalCandidates - rank) / (scorecard.totalCandidates - 1)) * 100)))
      : 100;

  const filterCounts = {
    all: solutions?.length ?? 0,
    correct: scorecard.correctCount,
    incorrect: scorecard.incorrectCount,
    skipped: scorecard.unattemptedCount,
  };

  const totalQuestions = Math.max(1, scorecard.correctCount + scorecard.incorrectCount + scorecard.unattemptedCount);
  const pctOf = (n: number) => Math.round((n / totalQuestions) * 100);

  const filteredSolutions = (solutions || []).filter((q) => {
    if (filterType === 'correct') return q.isCorrect;
    if (filterType === 'incorrect') return !q.isCorrect && q.studentAnswer;
    if (filterType === 'skipped') return !q.studentAnswer;
    return true;
  });

  const submitted = scorecard.submittedAt
    ? new Date(scorecard.submittedAt).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const isPsychometric =
    assignment.examType === 'Psychometric' ||
    (Boolean(solutions?.length) && solutions?.some((q) => q.subject === 'Psychometric'));

  if (isPsychometric) {
    const attemptedCount = scorecard.attemptedCount ?? ((solutions?.length || 0) - scorecard.unattemptedCount);
    const totalQuestions = solutions?.length || 0;
    const report = scorecard.psychometricReport;
    const isRefining = scorecard.aiStatus === 'pending' || scorecard.aiStatus === 'processing';
    const shouldShowGoal = Boolean(assignment.showGoalToStudents && (assignment.examGoal || report?.goal));
    const goalText = shouldShowGoal ? (assignment.examGoal || report?.goal) : null;

    const filteredPsySolutions = (solutions || []).filter((q) => {
      if (psyFilter === 'answered') return Boolean(q.studentAnswer);
      if (psyFilter === 'skipped') return !q.studentAnswer;
      return true;
    });

    return (
      <div className="min-h-screen bg-[#FBFCFE] bg-page-wash font-dm text-[#003366]">
        <Style />

        <header className="sticky top-0 z-20 border-b border-[#003366]/10 bg-[#FBFCFE]/85 backdrop-blur">
          <div className="mx-auto flex w-full max-w-[1160px] items-center justify-between gap-4 px-4 py-1.5 sm:px-6 sm:py-2">
            <Link href="/" aria-label="JEENEET.ai home" className="shrink-0 rounded-xl">
              <Image src="/logo.png" alt="JEENEET.ai" width={118} height={48} priority className="block h-12 w-auto sm:h-14" />
            </Link>
            <Link href="/student" className={SECONDARY_BTN}>
              <ArrowLeftIcon />
              Dashboard
            </Link>
          </div>
        </header>

        <div className="px-4 pb-16 pt-5 sm:px-6 sm:pb-[72px] sm:pt-6">
          <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-6">

            {/* Hero Card: Psychometric Goal Alignment */}
            <section className="dz-rise relative overflow-hidden rounded-[36px] border border-[#803688]/20 bg-white p-6 text-[#003366] sm:p-8 xl:p-10 shadow-[0_12px_32px_rgba(128,54,136,.06)]">
              <div aria-hidden className="pointer-events-none absolute inset-0">
                <svg viewBox="0 0 900 700" preserveAspectRatio="xMaxYMax slice" className="absolute bottom-[-10%] right-0 h-[76%] w-[min(66%,700px)]">
                  <defs>
                    <linearGradient id="psy-hero-blob" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#803688" stopOpacity="0.22" />
                      <stop offset="0.6" stopColor="#803688" stopOpacity="0.10" />
                      <stop offset="1" stopColor="#B98CBE" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M1000 700 L1000 150 C946 92 862 62 772 78 C668 97 596 172 528 246 C462 318 396 378 310 414 C214 455 132 508 84 578 C52 626 30 668 24 700 Z"
                    fill="url(#psy-hero-blob)"
                  />
                </svg>
              </div>

              <div className="relative grid items-center gap-8 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
                <Ring pct={isRefining ? 100 : scorecard.totalScore} color="#803688" size={156} stroke={15} track="rgba(128,54,136,.12)">
                  <div className="text-center">
                    <div className={`${HEAD} text-[36px] font-extrabold leading-none tabular-nums text-[#803688]`}>
                      {isRefining ? (
                        <span className="inline-block animate-pulse text-[28px]">...</span>
                      ) : (
                        `${scorecard.totalScore}%`
                      )}
                    </div>
                    <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#5A6B8C]">
                      {isRefining ? 'Evaluating' : 'Goal Alignment'}
                    </div>
                  </div>
                </Ring>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#803688]/15 px-3 py-1 text-[11.5px] font-extrabold text-[#803688]">
                      Psychometric &amp; Behavioral Assessment
                    </span>
                    <span className="text-[12px] font-semibold text-[#5A6B8C]">
                      · {assignment.batchName}
                    </span>
                  </div>

                  <h1 className={`${HEAD} mt-1.5 text-[clamp(24px,2.8vw,36px)] font-extrabold leading-tight tracking-[-0.02em] text-[#003366]`}>
                    {assignment.title}
                  </h1>

                  <p className="mt-1.5 text-[13px] text-[#5A6B8C]">
                    {assignment.facultyName}
                    {submitted && ` · Evaluated on ${submitted}`}
                  </p>

                  {/* Professor Goal Callout (Only visible when faculty enabled showGoalToStudents) */}
                  {goalText && (
                    <div className="mt-4 rounded-2xl border-[1.5px] border-[#803688]/25 bg-[#FBF5FC] p-3.5 sm:p-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-[#803688] px-2 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wider text-white">
                          Evaluation Target / Professor Goal
                        </span>
                      </div>
                      <p className="mt-1.5 text-[14px] font-semibold italic leading-relaxed text-[#003366]">
                        &ldquo;{goalText}&rdquo;
                      </p>
                    </div>
                  )}

                  <div className="mt-5 grid grid-cols-3 gap-3 max-sm:grid-cols-1">
                    <div className="dz-pop rounded-2xl border border-[#003366]/10 bg-[rgba(238,242,255,.72)] px-4 py-3 backdrop-blur">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-[12px] font-semibold text-[#7A87A0]">Predicted Best-Fit Role</p>
                        {isRefining && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9.5px] font-bold text-amber-800 animate-pulse">
                            AI Evaluating...
                          </span>
                        )}
                      </div>
                      <p className={`${HEAD} mt-1 text-[17px] font-extrabold text-[#803688]`}>
                        {isRefining ? 'AI Evaluating Mindset...' : (report?.predictedRole || report?.archetype || 'Evaluating Mindset')}
                      </p>
                      {isRefining ? (
                        <p className="mt-1 text-[11.5px] font-medium leading-snug text-[#475569] animate-pulse">
                          Analyzing candidate responses against the evaluation target...
                        </p>
                      ) : report?.roleReason ? (
                        <p className="mt-1 text-[11.5px] font-medium leading-snug text-[#475569]">
                          {report.roleReason}
                        </p>
                      ) : (
                        <p className="mt-1 text-[11.5px] font-medium text-[#5A6B8C] truncate" title={report?.archetype}>
                          {report?.alignmentLevel || 'High Alignment'}
                        </p>
                      )}
                    </div>

                    <div className="dz-pop rounded-2xl border border-[#003366]/10 bg-[rgba(238,242,255,.72)] px-4 py-3 backdrop-blur" style={{ animationDelay: '120ms' }}>
                      <p className="text-[12px] font-semibold text-[#7A87A0]">Questions Answered</p>
                      <p className={`${HEAD} mt-1 text-[24px] font-extrabold text-[#003366] tabular-nums`}>
                        {attemptedCount} <span className="text-[14px] font-normal text-[#5A6B8C]">/ {totalQuestions}</span>
                      </p>
                      <p className="mt-1 text-[11.5px] text-[#5A6B8C]">
                        {scorecard.unattemptedCount} skipped · 100% trait-based
                      </p>
                    </div>

                    <div className="dz-pop rounded-2xl border border-[#003366]/10 bg-[rgba(238,242,255,.72)] px-4 py-3 backdrop-blur" style={{ animationDelay: '240ms' }}>
                      <p className="text-[12px] font-semibold text-[#7A87A0]">Completion Time</p>
                      <p className={`${HEAD} mt-1 text-[24px] font-extrabold text-[#003366] tabular-nums`}>
                        {formatTime(scorecard.timeTakenSeconds)}
                      </p>
                      <p className="mt-1 text-[11.5px] text-[#5A6B8C]">
                        No right/wrong marking
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <a href="#review" className={btn}>Review Responses</a>
                  <Link href="/student" className={SECONDARY_BTN}>Back to dashboard</Link>
                </div>
              </div>
            </section>

            {/* AI Behavioral Synthesis & Guidance Grid */}
            <div className="grid gap-5 xl:grid-cols-12 xl:gap-6">
              {/* Executive Summary */}
              <section className={`${glass} flex flex-col p-6 xl:col-span-7`}>
                <div className="mb-4">
                  <span className="rounded-md bg-[#803688]/15 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-[#803688]">
                    AI Evaluation Synthesis
                  </span>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <h2 className={`${h2c} text-[20px]`}>Mindset &amp; Behavioral Analysis</h2>
                    {!isRefining && report?.predictedRole && (
                      <span className="rounded-full bg-[#803688] px-3 py-1 text-[12px] font-extrabold text-white">
                        {report.predictedRole}
                      </span>
                    )}
                  </div>
                  {!isRefining && report?.roleReason && (
                    <div className="mt-2.5 rounded-xl border border-[#803688]/20 bg-[#FDF8FF] p-3 text-[13px] font-medium leading-relaxed text-[#334155]">
                      <strong className="text-[#803688]">Why this role: </strong>{report.roleReason}
                    </div>
                  )}
                  <p className="mt-2 text-[13px] text-[#5A6B8C]">
                    {isRefining
                      ? 'AI is currently analyzing candidate situational choices. Live report will update automatically.'
                      : 'Detailed evaluation of candidate responses calibrated directly to the evaluation target.'}
                  </p>
                </div>

                <div className="flex-1 space-y-3.5 text-[14px] leading-relaxed text-[#1E2B45]">
                  {isRefining ? (
                    <div className="rounded-2xl border border-dashed border-[#803688]/30 bg-[#FDF8FF] p-6 text-center">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#803688] border-t-transparent" />
                      <p className="mt-2 text-[14px] font-semibold text-[#803688]">
                        AI evaluation in progress
                      </p>
                      <p className="mt-1 text-[12px] text-[#5A6B8C]">
                        Analyzing situational choices against target behavioral attributes...
                      </p>
                    </div>
                  ) : (
                    (report?.summary || 'The student demonstrated consistent decision-making patterns across situational and cognitive scenarios, with strong engagement in problem-solving and peer collaboration.')
                      .split('\n\n')
                      .map((para, pIdx) => (
                        <p key={pIdx} className="rounded-2xl border border-[#003366]/10 bg-[#F7F9FF] p-4 text-[#1E2B45]">
                          {para}
                        </p>
                      ))
                  )}
                </div>
              </section>

              {/* Strengths & Mentoring Guidance */}
              <div className="flex flex-col gap-5 xl:col-span-5">
                <section className={`${glass} p-5 sm:p-6`}>
                  <div className="flex items-center gap-2 text-[#15803D]">
                    <CheckCircleIcon className="h-5 w-5 shrink-0" />
                    <h3 className={`${HEAD} text-[16px] font-extrabold text-[#003366]`}>Demonstrated Strengths</h3>
                  </div>
                  <ul className="mt-3.5 space-y-2.5">
                    {(report?.keyStrengths || [
                      'Practical task ownership and initiative in overcoming project hurdles',
                      'Active listening and collaborative attitude during group interactions',
                      'Calculated decision discipline when facing unexpected setbacks'
                    ]).map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[#1E2B45]">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#15803D]" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className={`${glass} p-5 sm:p-6`}>
                  <div className="flex items-center gap-2 text-[#803688]">
                    <CompassIcon className="h-5 w-5 shrink-0" />
                    <h3 className={`${HEAD} text-[16px] font-extrabold text-[#003366]`}>Faculty Mentoring Guidance</h3>
                  </div>
                  <ul className="mt-3.5 space-y-2.5">
                    {(report?.growthAreas || [
                      'Provide safe spaces for autonomous design experiments with room for iterative trials',
                      'Encourage sharing original ideas with the entire group early in discussions'
                    ]).map((growth, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[#1E2B45]">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#803688]" />
                        <span>{growth}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>

            {/* Domain Breakdown */}
            {report?.domainBreakdown && report.domainBreakdown.length > 0 && (
              <section className={`${glass} p-6`}>
                <div className="mb-4">
                  <h2 className={`${h2c} text-[20px]`}>Psychometric Domain Breakdown</h2>
                  <p className="mt-1 text-[13px] text-[#5A6B8C]">
                    Alignment across evaluated behavioral and cognitive competency domains
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {report.domainBreakdown.map((d, i) => (
                    <div key={i} className="rounded-2xl border border-[#003366]/10 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-extrabold text-[14px] text-[#003366]">{d.domain}</h4>
                        <span className="rounded-full bg-[#803688]/10 px-2.5 py-0.5 text-[11.5px] font-extrabold text-[#803688]">
                          {d.scorePct}%
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] font-bold text-[#803688]">{d.traitLabel}</p>
                      <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#EEF2FF]">
                        <div className="h-full rounded-full bg-[#803688]" style={{ width: `${d.scorePct}%` }} />
                      </div>
                      <p className="mt-2.5 text-[12px] leading-relaxed text-[#5A6B8C]">{d.analysis}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Candidate Response Review (No right/wrong answers) */}
            <section id="review" className="scroll-mt-24">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className={`${HEAD} text-[24px] font-extrabold tracking-[-0.02em] text-[#003366]`}>
                    Candidate Response Review
                  </h2>
                  <p className="mt-1 text-[13px] text-[#5A6B8C]">
                    Review the questions and your recorded choices.
                  </p>
                </div>

                <div role="tablist" className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-[#003366]/10 bg-white/85 p-1 backdrop-blur-xl">
                  {[
                    { value: 'all', label: 'All Questions', count: totalQuestions },
                    { value: 'answered', label: 'Answered', count: attemptedCount },
                    { value: 'skipped', label: 'Skipped', count: scorecard.unattemptedCount },
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      type="button"
                      role="tab"
                      aria-selected={psyFilter === tab.value}
                      onClick={() => setPsyFilter(tab.value as typeof psyFilter)}
                      className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-bold transition-all duration-200 ${
                        psyFilter === tab.value ? 'bg-[#803688] text-white shadow-md' : 'text-[#5A6B8C] hover:bg-[#EEF2FF]'
                      }`}
                    >
                      {tab.label}
                      <span className={`ml-1.5 tabular-nums ${psyFilter === tab.value ? 'opacity-70' : 'opacity-60'}`}>{tab.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {filteredPsySolutions.length === 0 ? (
                <div className={`${glass} p-7 sm:p-9`}>
                  <Empty>No questions under this filter.</Empty>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredPsySolutions.map((q) => {
                    const isSkipped = !q.studentAnswer;

                    return (
                      <article key={q.number} className={`${glass} flex flex-col gap-4 p-5 sm:p-6`}>
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(0,51,102,.08)] pb-3.5">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#803688] text-[13px] font-extrabold tabular-nums text-white">
                              {q.number}
                            </span>
                            <span className={`${HEAD} text-[15px] font-extrabold text-[#003366]`}>Question {q.number}</span>
                            <span className="rounded-full bg-[#803688]/10 px-2.5 py-1 text-[11px] font-bold text-[#803688]">
                              {q.topic}
                            </span>
                          </div>

                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-bold tracking-wide ${
                            isSkipped ? 'bg-[#EEF2FF] text-[#5A6B8C]' : 'bg-[#803688]/10 text-[#803688]'
                          }`}>
                            {isSkipped ? 'Skipped' : 'Response Recorded'}
                          </span>
                        </div>

                        <div
                          className="text-[15px] leading-[1.7] text-[#1E2B45]"
                          dangerouslySetInnerHTML={{ __html: renderMathHtml(q.questionText) }}
                        />

                        {q.options && q.options.length > 0 && (
                          <div className="flex flex-col gap-2">
                            {q.options.map((opt, idx) => {
                              const letter = String.fromCharCode(65 + idx);
                              const isStudentSelected =
                                (q.studentAnswer || '').trim() === letter ||
                                (q.studentAnswer || '').trim() === opt.trim() ||
                                (q.studentAnswer || '').trim().startsWith(letter);

                              return (
                                <div
                                  key={letter}
                                  className={`flex items-center gap-3 rounded-[14px] border-[1.5px] px-3.5 py-2.5 text-[14px] transition-colors ${
                                    isStudentSelected
                                      ? 'border-[#803688] bg-[#FBF5FC] font-semibold text-[#803688] shadow-sm'
                                      : 'border-[#CBD5F3] bg-white text-[#5A6B8C]'
                                  }`}
                                >
                                  <span className={`min-w-[20px] font-extrabold ${isStudentSelected ? 'text-[#803688]' : 'text-[#003366]'}`}>
                                    {letter}.
                                  </span>
                                  <span
                                    className="flex-1"
                                    dangerouslySetInnerHTML={{ __html: renderMathHtml(stripOptionPrefix(opt)) }}
                                  />
                                  {isStudentSelected && (
                                    <span className="rounded-full bg-[#803688] px-2.5 py-0.5 text-[11px] font-extrabold text-white">
                                      Your Response
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFCFE] bg-page-wash font-dm text-[#003366]">
      <Style />

      <header className="sticky top-0 z-20 border-b border-[#003366]/10 bg-[#FBFCFE]/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1160px] items-center justify-between gap-4 px-4 py-1.5 sm:px-6 sm:py-2">
          <Link href="/" aria-label="JEENEET.ai home" className="shrink-0 rounded-xl">
            <Image src="/logo.png" alt="JEENEET.ai" width={118} height={48} priority className="block h-12 w-auto sm:h-14" />
          </Link>
          <Link href="/student" className={SECONDARY_BTN}>
            <ArrowLeftIcon />
            Dashboard
          </Link>
        </div>
      </header>

      <div className="px-4 pb-16 pt-5 sm:px-6 sm:pb-[72px] sm:pt-6">
        <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-6">

          {/* Hero: the score, who sat it, and the three facts that matter */}
          <section className="dz-rise relative overflow-hidden rounded-[36px] border border-[#003366]/10 bg-white p-6 text-[#003366] sm:p-8 xl:p-10">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <svg viewBox="0 0 900 700" preserveAspectRatio="xMaxYMax slice" className="absolute bottom-[-10%] right-0 h-[76%] w-[min(66%,700px)]">
                <defs>
                  <linearGradient id="result-hero-blob" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="1" stopColor="#803688" stopOpacity="0.20" />
                    <stop offset="0.5" stopColor="#803688" stopOpacity="0.12" />
                    <stop offset="1" stopColor="#B98CBE" stopOpacity="0.18" />
                  </linearGradient>
                </defs>
                <path
                  d="M1000 700 L1000 150 C946 92 862 62 772 78 C668 97 596 172 528 246 C462 318 396 378 310 414 C214 455 132 508 84 578 C52 626 30 668 24 700 Z"
                  fill="url(#result-hero-blob)"
                />
              </svg>
            </div>

            <div className="relative grid items-center gap-8 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
              <Ring pct={scorePct} color={tone} size={156} stroke={15} track="rgba(0,51,102,.1)">
                <div className="text-center">
                  <div className={`${HEAD} text-[36px] font-extrabold leading-none tabular-nums`} style={{ color: scorecard.totalScore < 0 ? BAD : NAVY }}>
                    {scorecard.totalScore}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold text-[#7A87A0]">of {scorecard.maxScore}</div>
                </div>
              </Ring>

              <div className="min-w-0">
                <p className={kicker}>Scorecard · {assignment.batchName}</p>
                <h1 className={`${HEAD} mt-1 text-[clamp(24px,2.8vw,38px)] font-extrabold leading-tight tracking-[-0.02em] text-[#003366]`}>
                  {assignment.title}
                </h1>
                <p className="mt-2 text-[13px] text-[#5A6B8C]">
                  {assignment.facultyName}
                  {submitted && ` · Submitted ${submitted}`}
                </p>

                <div className="mt-5 grid grid-cols-3 gap-3 max-sm:grid-cols-1">
                  {[
                    { label: 'Batch rank', value: `#${rank}`, sub: `of ${scorecard.totalCandidates} candidate${scorecard.totalCandidates === 1 ? '' : 's'}` },
                    { label: 'Accuracy', value: `${accuracyPct}%`, sub: `on ${totalAttempted} attempted` },
                    { label: 'Time taken', value: formatTime(scorecard.timeTakenSeconds), sub: `${scorePct}% of maximum` },
                  ].map((stat, i) => (
                    <div
                      key={stat.label}
                      className="dz-pop rounded-2xl border border-[#003366]/10 bg-[rgba(238,242,255,.72)] px-4 py-3 backdrop-blur transition-transform hover:-translate-y-1"
                      style={{ animationDelay: `${300 + i * 120}ms` }}
                    >
                      <p className="text-[12px] font-semibold text-[#7A87A0]">{stat.label}</p>
                      <p className={`${HEAD} mt-1 text-[26px] font-extrabold leading-none tabular-nums text-[#003366]`}>{stat.value}</p>
                      <p className="mt-1 text-[12px] text-[#5A6B8C]">{stat.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <a href="#solutions" className={btn}>Step-by-step solutions</a>
                <Link href="/student" className={SECONDARY_BTN}>Back to dashboard</Link>
              </div>
            </div>
          </section>

          {/* Answer breakdown + batch standing */}
          <div className="grid gap-5 xl:grid-cols-12 xl:gap-6">
            <section className={`${glass} flex flex-col p-5 sm:p-6 xl:col-span-7`}>
              <Head
                title="Answer breakdown"
                sub={`${plural(totalAttempted, 'question')} attempted, ${scorecard.unattemptedCount} skipped`}
                right={
                  <div className="flex items-center gap-4 text-[12px] font-semibold text-[#5A6B8C]">
                    <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ background: GOOD }} />Correct</span>
                    <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ background: BAD }} />Incorrect</span>
                    <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ background: FAINT }} />Skipped</span>
                  </div>
                }
              />

              <div className="mt-2 flex h-4 w-full overflow-hidden rounded-full bg-[#EEF2FF]">
                {scorecard.correctCount > 0 && (
                  <span style={{ width: `${pctOf(scorecard.correctCount)}%`, background: GOOD }} className="dz-pop h-full" />
                )}
                {scorecard.incorrectCount > 0 && (
                  <span style={{ width: `${pctOf(scorecard.incorrectCount)}%`, background: BAD }} className="h-full" />
                )}
                {scorecard.unattemptedCount > 0 && (
                  <span style={{ width: `${pctOf(scorecard.unattemptedCount)}%`, background: FAINT, opacity: 0.55 }} className="h-full" />
                )}
              </div>

              <div className="mt-5 flex flex-1 flex-col gap-2">
                {[
                  { label: 'Correct', count: scorecard.correctCount, pct: pctOf(scorecard.correctCount), color: GOOD, sign: '+' },
                  { label: 'Incorrect', count: scorecard.incorrectCount, pct: pctOf(scorecard.incorrectCount), color: BAD, sign: '-' },
                  { label: 'Skipped', count: scorecard.unattemptedCount, pct: pctOf(scorecard.unattemptedCount), color: FAINT, sign: '' },
                ].map((row) => (
                  <div key={row.label} className="grid grid-cols-[92px_1fr_76px] items-center gap-3 border-t border-[rgba(0,51,102,.08)] py-2 text-[12.5px] first:border-t-0">
                    <span className="font-semibold text-[#5A6B8C]">{row.label}</span>
                    <span className="h-1.5 overflow-hidden rounded-full bg-[rgba(0,51,102,.08)]">
                      <span className="block h-full rounded-full" style={{ width: `${row.pct}%`, background: row.color }} />
                    </span>
                    <span className="text-right font-bold tabular-nums text-[#003366]">
                      {row.sign}{row.count} <span className="text-[#7A87A0]">({row.pct}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className={`${glass} flex flex-col p-5 sm:p-6 xl:col-span-5`}>
              <Head title="Batch standing" sub="Where this paper placed you in the batch" />

              <div className="flex flex-1 flex-col justify-center">
                <p className={`${HEAD} text-[56px] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-[#003366]`}>
                  #{rank}
                </p>
                <p className="mt-2 text-[13px] font-semibold text-[#5A6B8C]">
                  of {scorecard.totalCandidates} candidate{scorecard.totalCandidates === 1 ? '' : 's'} · ahead of{' '}
                  <b className="text-[#003366]">{aheadPct}%</b>
                </p>

                <div className="relative mt-6 h-3 rounded-full bg-[#EEF2FF]">
                  <div className="dz-pop h-full rounded-full bg-[#003366]" style={{ width: `${aheadPct}%` }} />
                  <div className="absolute -top-[3px] h-[18px] w-[18px] -translate-x-1/2 rounded-full border-[3px] border-white bg-[#803688] shadow" style={{ left: `${aheadPct}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-[11px] font-bold text-[#5A6B8C]">
                  <span>Last</span>
                  <span>Top of batch</span>
                </div>
              </div>
            </section>
          </div>

          {/* Solutions */}
          <section id="solutions" className="scroll-mt-24">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className={`${HEAD} text-[24px] font-extrabold tracking-[-0.02em] text-[#003366]`}>Step-by-step solutions</h2>
                <p className="mt-1 text-[13px] text-[#5A6B8C]">Answer key with the reasoning behind every option.</p>
              </div>

              {assignment.showSolutions && solutions && solutions.length > 0 && (
                <div role="tablist" className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-[#003366]/10 bg-white/85 p-1 backdrop-blur-xl">
                  {FILTER_TABS.map((tab) => (
                    <button
                      key={tab.value}
                      type="button"
                      role="tab"
                      aria-selected={filterType === tab.value}
                      onClick={() => setFilterType(tab.value)}
                      className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-bold transition-all duration-200 ${
                        filterType === tab.value ? 'bg-[#003366] text-white shadow-md' : 'text-[#5A6B8C] hover:bg-[#EEF2FF]'
                      }`}
                    >
                      {tab.label}
                      <span className={`ml-1.5 tabular-nums ${filterType === tab.value ? 'opacity-70' : 'opacity-60'}`}>{filterCounts[tab.value]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!assignment.showSolutions ? (
              <div className={`${glass} p-7 text-center sm:p-9`}>
                <p className={`${HEAD} text-[17px] font-extrabold text-[#003366]`}>Solutions are hidden by your faculty</p>
                <p className="mx-auto mt-2 max-w-[46ch] text-[13px] leading-relaxed text-[#5A6B8C]">
                  The answer key opens once every student in the batch has submitted this exam.
                </p>
              </div>
            ) : filteredSolutions.length === 0 ? (
              <div className={`${glass} p-7 sm:p-9`}>
                <Empty>No questions under this filter.</Empty>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredSolutions.map((q) => {
                  const isSkipped = !q.studentAnswer;
                  const isCorrect = q.isCorrect;

                  return (
                    <article key={q.number} className={`${glass} flex flex-col gap-4 p-5 sm:p-6`}>
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(0,51,102,.08)] pb-3.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#003366] text-[13px] font-extrabold tabular-nums text-white">
                            {q.number}
                          </span>
                          <span className={`${HEAD} text-[15px] font-extrabold text-[#003366]`}>Question {q.number}</span>
                          <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[11px] font-bold text-[#31407F]">
                            {q.subject} · {q.topic}
                          </span>
                        </div>

                        <span className={isCorrect ? CHIP_CORRECT : isSkipped ? CHIP_SKIPPED : CHIP_WRONG}>
                          {isCorrect ? 'Correct' : isSkipped ? 'Unattempted' : `Incorrect (${q.score})`}
                        </span>
                      </div>

                      {q.diagram && (
                        <div className="rounded-[18px] border border-[#003366]/10 bg-white p-3">
                          <DiagramRenderer descriptor={q.diagram} />
                        </div>
                      )}

                      <div
                        className="text-[15px] leading-[1.7] text-[#1E2B45]"
                        dangerouslySetInnerHTML={{ __html: renderMathHtml(q.questionText) }}
                      />

                      {q.options && q.options.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {q.options.map((opt, idx) => {
                            const letter = String.fromCharCode(65 + idx);
                            const isStudentSelected = (q.studentAnswer || '').split(',').includes(letter);
                            const isCorrectOption = (q.correctAnswer || '').split(',').includes(letter);

                            return (
                              <div
                                key={letter}
                                className={`flex items-center gap-3 rounded-[14px] border-[1.5px] px-3.5 py-2.5 text-[14px] ${
                                  isCorrectOption
                                    ? 'border-[#15803D] bg-[#EAF7EF]'
                                    : isStudentSelected
                                      ? 'border-[#C8202F] bg-[#FDE6E8]'
                                      : 'border-[#CBD5F3] bg-white'
                                }`}
                              >
                                <span className="min-w-[20px] font-extrabold text-[#003366]">{letter}.</span>
                                <span
                                  className="flex-1"
                                  dangerouslySetInnerHTML={{ __html: renderMathHtml(stripOptionPrefix(opt)) }}
                                />
                                {isCorrectOption && <span className="text-[11px] font-extrabold text-[#146C33]">Correct</span>}
                                {isStudentSelected && !isCorrectOption && (
                                  <span className="text-[11px] font-extrabold text-[#C8202F]">Your choice</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-x-6 gap-y-2 rounded-[14px] border border-[#003366]/10 bg-[#EEF2FF] px-4 py-3 text-[13px]">
                          <div>
                            <span className="font-medium text-[#5A6B8C]">Your answer: </span>
                            <strong className={isCorrect ? 'text-[#146C33]' : 'text-[#C8202F]'}>
                              {q.studentAnswer || 'Unattempted'}
                            </strong>
                          </div>
                          <div>
                            <span className="font-medium text-[#5A6B8C]">Correct answer: </span>
                            <strong className="text-[#146C33]">{q.correctAnswer}</strong>
                          </div>
                        </div>
                      )}

                      {q.explanation && (
                        <div className="rounded-[16px] border-l-[5px] border-[#803688] bg-[#FBF5FC] px-4 py-3.5">
                          <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#803688]">
                            Explanation
                          </p>
                          <div
                            className="text-[14px] leading-[1.7] text-[#3B2450]"
                            dangerouslySetInnerHTML={{ __html: renderExplanationHtml(q.explanation) }}
                          />
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}