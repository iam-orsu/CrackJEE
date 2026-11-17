'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { ExamInsights } from '@/types';
// The insight cards are shared with the dashboard, so they live in the shared
// InsightBlocks file rather than inside the dashboard route.
import {
  TopicList, NegativesCard, TimeByTypeCard, SectionOrderCard, CutoffCard,
  Ring, subjectTone, toneColor,
} from '@/components/insights/InsightBlocks';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import type { MockResultData, MockResultBreakdown } from '@/types';

import { fmtTime, fmtQTime, getJeeCrackingChances, getNEETCrackingChances } from '@/components/mock/resultHelpers';
import { JEE_SUBJECTS, NEET_SUBJECTS } from '@/lib/subjects';
import { QuestionReview } from '@/components/mock/QuestionReview';
import Loader from '@/components/loader';

/* ── The dashboard's brand system, one level down ─────────────────── */
const NAVY = '#003366', PURPLE = '#803688', GOOD = '#15803D', BAD = '#C8202F';
const FAINT = '#7A87A0', INK = '#31407F';

const HEAD = 'font-display';
const glass = 'rounded-[28px] border border-[#003366]/10 bg-white shadow-[0_24px_60px_-34px_rgba(0,51,102,.45)]';
const pill = 'inline-flex items-center justify-center gap-2 rounded-full bg-[#803688] px-5 py-2.5 text-[13px] font-bold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[4px] active:shadow-[0_1px_0_#5A2560] motion-reduce:transition-none';
const quietPill = 'inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#003366]/20 bg-white px-5 py-2 text-[13px] font-bold text-[#003366] no-underline transition-colors duration-150 hover:border-[#003366]/45 hover:bg-[#EEF2FF]';

function Meter({ pct, color, h = 8 }: { pct: number; color: string; h?: number }) {
  return (
    <span className="block w-full overflow-hidden rounded-full bg-[#EEF2FF]" style={{ height: h }}>
      <span
        className="block h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none"
        style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: color }}
      />
    </span>
  );
}

/* The landing page's blob, reused as the hero's quiet moment */
function Blob({ id, color, className }: { id: string; color: string; className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 900 700" preserveAspectRatio="xMaxYMax slice" className={`pointer-events-none absolute ${className}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.2" />
          <stop offset="0.5" stopColor={color} stopOpacity="0.11" />
          <stop offset="1" stopColor={color} stopOpacity="0.17" />
        </linearGradient>
      </defs>
      <path
        d="M1000 700 L1000 150 C946 92 862 62 772 78 C668 97 596 172 528 246 C462 318 396 378 310 414 C214 455 132 508 84 578 C52 626 30 668 24 700 Z"
        fill={`url(#${id})`}
      />
    </svg>
  );
}

function Stat({ label, value, sub, color }: { label: string; value: React.ReactNode; sub?: string; color: string }) {
  return (
    <div className="rounded-2xl border border-[#003366]/10 bg-[rgba(238,242,255,.55)] px-4 py-3">
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
        <span className="text-[11px] font-bold uppercase tracking-[0.07em] text-[#7A87A0]">{label}</span>
      </div>
      <div className={`${HEAD} mt-1.5 text-[24px] font-extrabold leading-none tabular-nums`} style={{ color }}>{value}</div>
      {sub && <div className="mt-1 text-[11.5px] font-semibold text-[#5A6B8C]">{sub}</div>}
    </div>
  );
}

function ChanceCard({ title, bandLabel, color, bg, border, rows, msg }: {
  title: string; bandLabel: string; color: string; bg: string; border: string;
  rows: Array<[string, string]>; msg: string;
}) {
  return (
    <div className="rounded-2xl border px-4 py-3.5" style={{ background: bg, borderColor: border }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-[#5A6B8C]">{title}</span>
        <span className={`${HEAD} text-[16px] font-extrabold`} style={{ color }}>{bandLabel}</span>
      </div>
      <dl className="mt-2.5 flex flex-col gap-1.5">
        {rows.map(([l, v]) => (
          <div key={l} className="flex justify-between gap-3 text-[12px] leading-snug">
            <dt className="shrink-0 font-semibold text-[#5A6B8C]">{l}</dt>
            <dd className="text-right font-extrabold text-[#31407F]">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2.5 text-[12px] font-semibold leading-relaxed" style={{ color }}>{msg}</p>
    </div>
  );
}

/* One page-load rise, then everything rests */
const MotionStyle = () => (
  <style>{`
@keyframes rs-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.rs-rise{animation:rs-rise .65s cubic-bezier(.2,.8,.2,1) both}
.rs-stagger>*{animation:rs-rise .55s cubic-bezier(.2,.8,.2,1) both}
.rs-stagger>*:nth-child(2){animation-delay:.06s}
.rs-stagger>*:nth-child(3){animation-delay:.12s}
.rs-stagger>*:nth-child(4){animation-delay:.18s}
@media (prefers-reduced-motion:reduce){.rs-rise,.rs-stagger>*{animation:none!important}}
`}</style>
);

/* ══════════════════════════════════════════════════════════════
   Component
══════════════════════════════════════════════════════════════ */

export default function MockResultPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;

  const [data, setData] = useState<MockResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [filterSubject, setFilterSubject] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'all' | 'correct' | 'incorrect' | 'unattempted'>('all');
  const [examInsights, setExamInsights] = useState<ExamInsights | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    api.mock.result(examId)
      .then(setData)
      .catch((e) => setError(e?.message ?? 'Failed to load result'))
      .finally(() => setLoading(false));
    api.mock.insights(examId).then(setExamInsights).catch(() => setExamInsights(null));
  }, [examId, router]);

  if (loading) return <Loader fullScreen size={180} text="Loading your results..." />;

  if (error || !data) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FBFCFE] px-6 text-center font-dm">
      <p className="text-[15px] font-bold text-[#C8202F]">{error || 'Result not found'}</p>
      <Link href="/mock" className={pill}>Back to mock tests</Link>
    </div>
  );

  const { result, exam } = data;
  const breakdown = result.scoreBreakdown as Record<string, MockResultBreakdown>;
  const pct = result.maxScore > 0 ? Math.round((result.totalScore / result.maxScore) * 100) : 0;
  const tone = toneColor(pct);
  const examType = exam.examType;
  const isNEET = examType === 'NEET';
  const examLabel = isNEET ? 'NEET UG' : `JEE ${examType}`;

  const SUBJECTS = isNEET ? NEET_SUBJECTS : JEE_SUBJECTS;
  const numSubjects = SUBJECTS.length;
  const allQs = exam.questions;

  const attempted = result.correct + result.incorrect + (result.partial ?? 0);
  const accuracy = attempted > 0 ? Math.round((result.correct / attempted) * 100) : 0;

  const timeValues = Object.values(breakdown).map((b) => b.timeSpentSeconds ?? 0).filter((t) => t > 0);
  const avgSeconds = timeValues.length > 0
    ? Math.round(timeValues.reduce((a, b) => a + b, 0) / timeValues.length)
    : 0;

  const chance = isNEET ? getNEETCrackingChances(pct) : getJeeCrackingChances(pct, examType);

  // Build per-subject scores
  const subjectScores = SUBJECTS.map((subj) => {
    const subjectQs = exam.questions.filter((q) => q.subject === subj);
    const correct = subjectQs.filter((q) => {
      const bd = breakdown[q.mockQuestionId ?? q.questionId];
      return !!bd?.submitted && (bd.awarded ?? 0) > 0;
    }).length;

    let score: number;
    if (subj === 'Physics') score = result.physicsScore;
    else if (subj === 'Chemistry') score = result.chemistryScore;
    else if (subj === 'Botany' || subj === 'Zoology') {
      // For NEET, split biologyScore evenly between Botany/Zoology (or calculate from breakdown)
      score = subjectQs.reduce((sum, q) => {
        const bd = breakdown[q.mockQuestionId ?? q.questionId];
        return sum + (bd?.awarded ?? 0);
      }, 0);
    } else {
      score = result.mathScore;
    }

    const maxPerSubject = subjectQs.reduce((sum, q) => {
      const bd = breakdown[q.mockQuestionId ?? q.questionId];
      return sum + (bd?.maxMarks ?? 0);
    }, 0) || Math.round(result.maxScore / numSubjects);
    const sPct = maxPerSubject > 0 ? Math.round((score / maxPerSubject) * 100) : 0;
    return { subj, score, maxPerSubject, pct: sPct, count: subjectQs.length, correct };
  });

  // Build URL for "Practice Weak Areas" — encodes the wrong/skipped topics from this mock
  function buildWeakPracticeUrl(): string {
    const topicWeights = new Map<string, { subject: string; weight: number }>();
    for (const q of exam.questions) {
      const mqId = q.mockQuestionId ?? q.questionId;
      const bd = breakdown[mqId];
      const isWrong = !!bd?.submitted && (bd.awarded ?? 0) <= 0;
      const isUnattempted = !bd?.submitted;
      if (!isWrong && !isUnattempted) continue;
      const topic = q.topic;
      if (!topic || !q.subject) continue;
      const key = `${q.subject}::${topic}`;
      const weight = isWrong ? 2 : 1;
      const ex = topicWeights.get(key);
      if (ex) { ex.weight += weight; } else { topicWeights.set(key, { subject: q.subject, weight }); }
    }
    const basePath = isNEET ? '/neet/practice' : '/practice';
    if (topicWeights.size === 0) return basePath;
    const sorted = [...topicWeights.entries()].sort(([, a], [, b]) => b.weight - a.weight);
    const subjectMap: Record<string, string[]> = {};
    for (const [key, { subject }] of sorted) {
      const topic = key.split('::')[1]!;
      if (!subjectMap[subject]) subjectMap[subject] = [];
      subjectMap[subject].push(topic);
    }
    const weakData = encodeURIComponent(JSON.stringify({ subjects: Object.keys(subjectMap), topics: subjectMap }));
    return `${basePath}?mode=mock_weak&weakData=${weakData}`;
  }
  const weakPracticeUrl = buildWeakPracticeUrl();

  // Filter questions for review section
  const filteredQs = allQs.filter((q) => {
    const bd = breakdown[q.mockQuestionId ?? q.questionId];
    if (!bd) return filterSubject === 'All' || q.subject === filterSubject;
    const isCorrect = bd.awarded > 0;
    const isUnattempted = !bd.submitted;
    const isIncorrect = !!bd.submitted && bd.awarded <= 0;
    if (filterSubject !== 'All' && q.subject !== filterSubject) return false;
    if (filterStatus === 'correct' && !isCorrect) return false;
    if (filterStatus === 'incorrect' && !isIncorrect) return false;
    if (filterStatus === 'unattempted' && !isUnattempted) return false;
    return true;
  });

  return (
    <div className="min-h-screen w-full bg-[#FBFCFE] bg-page-wash font-dm text-[#003366]">
      <MotionStyle />

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-[#003366]/10 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/dashboard" aria-label="JEENEET.ai dashboard" className="shrink-0">
              <Image
                src="/logo.png" alt="JEENEET.ai" width={118} height={48} priority
                style={{ display: 'block', height: 48, width: 'auto' }}
              />
            </Link>
            <span aria-hidden className="hidden h-6 w-px bg-[#003366]/15 sm:block" />
            <nav className="hidden min-w-0 items-center gap-2 text-[13px] font-semibold sm:flex">
              <Link href="/mock" className="truncate text-[#5A6B8C] transition-colors hover:text-[#003366]">Mock tests</Link>
              <span className="text-[#A2AEC5]">›</span>
              <span className="truncate text-[#003366]">Result · {examLabel}</span>
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/dashboard" className="hidden rounded-full px-3 py-2 text-[13px] font-bold text-[#5A6B8C] no-underline transition-colors hover:bg-[#EEF2FF] hover:text-[#003366] sm:inline-flex">
              Dashboard
            </Link>
            <Link href="/mock" className={pill}>New mock test</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 px-4 pb-16 pt-6 sm:px-6 lg:px-8">

        {/* Score hero */}
        <section className="rs-rise relative overflow-hidden rounded-[36px] border border-[#003366]/10 bg-white p-6 sm:p-8 xl:p-10">
          <Blob id="rs-hero-blob" color={PURPLE} className="bottom-[-12%] right-0 h-[78%] w-[min(62%,680px)]" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_210px]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.09em] text-[#003366]">
                  {examLabel} · Mock result
                </span>
                <span className="rounded-full border border-[#003366]/10 px-3 py-1 text-[11px] font-bold text-[#5A6B8C]">
                  Full paper
                </span>
              </div>

              <h1 className={`${HEAD} mt-4 text-[clamp(30px,4.2vw,50px)] font-extrabold leading-[1.05] tracking-[-0.03em]`}>
                You scored <span style={{ color: tone }}>{result.totalScore}</span>
                <span className="text-[#A2AEC5]"> / {result.maxScore}</span>
              </h1>
              <p className="mt-3 max-w-[58ch] text-[14.5px] leading-relaxed text-[#5A6B8C]">
                {pct}% of the paper · <strong className="font-extrabold text-[#003366]">{chance.label}</strong> — {chance.headline}
              </p>

              <div className="rs-stagger mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <Stat label="Correct" value={result.correct} sub={`${accuracy}% accuracy`} color={GOOD} />
                <Stat label="Wrong" value={result.incorrect} sub={result.partial ? `incl. ${result.partial} partial` : 'negative marks'} color={BAD} />
                <Stat label="Skipped" value={result.unattempted} sub={`of ${allQs.length} questions`} color={FAINT} />
                <Stat label="Time taken" value={fmtTime(result.timeTaken)} sub={avgSeconds > 0 ? `avg ${fmtQTime(avgSeconds)} per q` : 'per question'} color={NAVY} />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href={weakPracticeUrl} className={pill}>Practice weak areas</Link>
                <a href="#review" className={quietPill}>Review answers</a>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 justify-self-center">
              <Ring pct={pct} color={tone} size={172} stroke={16} track="rgba(0,51,102,.1)">
                <div className="text-center">
                  <div className={`${HEAD} text-[38px] font-extrabold leading-none tabular-nums`} style={{ color: tone }}>{pct}%</div>
                  <div className="mt-1 text-[11px] font-semibold text-[#7A87A0]">of max marks</div>
                </div>
              </Ring>
              <p className="text-center text-[12px] font-semibold text-[#5A6B8C]">{subjectScores.length} subjects · {allQs.length} questions</p>
            </div>
          </div>
        </section>

        {/* Subject performance */}
        <section className={`${glass} p-5 sm:p-6`}>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className={`${HEAD} text-[21px] font-extrabold leading-tight tracking-[-0.01em] text-[#003366]`}>Subject performance</h2>
              <p className="mt-1 text-[13px] text-[#5A6B8C]">Where the marks came from, and how accurate you were in each.</p>
            </div>
            <span className="text-[12px] font-semibold text-[#7A87A0]">{allQs.length} questions · {result.maxScore} marks</span>
          </div>

          <div className={`grid gap-3 sm:grid-cols-2 ${isNEET ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
            {subjectScores.map(({ subj, score, maxPerSubject, pct: sPct, count, correct }) => {
              const sc = subjectTone(subj);
              return (
                <div
                  key={subj}
                  className="relative overflow-hidden rounded-[24px] border border-[#003366]/10 bg-white p-4 transition-transform duration-200 hover:-translate-y-[2px] motion-reduce:transition-none"
                  style={{ boxShadow: '0 12px 26px -22px rgba(0,51,102,.55)' }}
                >
                  <span aria-hidden className={`${HEAD} pointer-events-none absolute -bottom-7 -right-1 text-[92px] font-extrabold leading-none`} style={{ color: sc, opacity: 0.07 }}>{subj[0]}</span>
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: sc }} />
                        <span className="truncate text-[11.5px] font-extrabold uppercase tracking-[0.08em]" style={{ color: sc }}>{subj}</span>
                      </div>
                      <div className={`${HEAD} mt-2 text-[26px] font-extrabold leading-none tabular-nums text-[#003366]`}>
                        {score}<span className="text-[14px] font-bold text-[#A2AEC5]"> / {maxPerSubject}</span>
                      </div>
                    </div>
                    <Ring pct={sPct} color={sc} size={46} stroke={5} track="rgba(0,51,102,.1)">
                      <span className="text-[10px] font-extrabold tabular-nums" style={{ color: sc }}>{sPct}%</span>
                    </Ring>
                  </div>
                  <div className="relative mt-3"><Meter pct={sPct} color={sc} h={7} /></div>
                  <div className="relative mt-2 flex justify-between text-[11.5px] font-semibold text-[#5A6B8C]">
                    <span>{correct} of {count} correct</span>
                    <span>{sPct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Cracking chances + where the score lands */}
        <div className={isNEET ? '' : 'grid gap-5 xl:grid-cols-2'}>

          <section className={`${glass} relative overflow-hidden p-5 sm:p-6`}>
            <Blob id="rs-chance-blob" color={chance.color} className="bottom-[-18%] right-0 h-[68%] w-[min(58%,420px)]" />
            <div className="relative">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em]" style={{ color: chance.color }}>Cracking chances</p>
              <h2 className={`${HEAD} mt-2 text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-[#003366]`}>{chance.label}</h2>
              <p className="mt-1 text-[14px] font-semibold" style={{ color: INK }}>{chance.headline}</p>

              <ul className="mt-4 flex flex-col gap-2">
                {chance.details.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[#5A6B8C]">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: chance.color }} />
                    {d}
                  </li>
                ))}
              </ul>

              <div className="mt-5">
                <div className="mb-1.5 flex justify-between text-[11.5px] font-bold text-[#5A6B8C]">
                  <span>Estimated chance</span>
                  <span style={{ color: chance.color }}>{chance.bar}%</span>
                </div>
                <Meter pct={chance.bar} color={chance.color} h={9} />
              </div>

              <p className="mt-3 text-[10.5px] font-medium leading-relaxed text-[#7A87A0]">
                {isNEET
                  ? `Rough estimate from your score (${result.totalScore}/${result.maxScore}, ${pct}%). Not an official cutoff prediction.`
                  : `Rough estimate from ${pct}% of max marks. Not an official cutoff prediction.`
                }
              </p>
            </div>
          </section>

          {!isNEET && (() => {
            const rawPct = result.maxScore > 0 ? result.totalScore / result.maxScore : 0;

            type Band = { label: string; color: string; bg: string; border: string };
            const bands: Record<string, Band> = {
              exceptional: { label: 'Exceptional', color: '#15803d', bg: '#f0fdf4', border: '#86efac' },
              high:        { label: 'High',        color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
              good:        { label: 'Good',        color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
              moderate:    { label: 'Moderate',    color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
              low:         { label: 'Low',         color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
              veryLow:     { label: 'Very Low',    color: '#9f1239', bg: '#fff1f2', border: '#fecdd3' },
            };

            // JEE Main: score/maxScore → percentile → rank (calibrated to real JEE Main 2025 data)
            const mainData = rawPct >= 0.83
              ? { band: bands.exceptional, percentile: '99.95%+',    rank: 'AIR < 500',          colleges: 'IIT B/D/M CSE, EE',      msg: 'Near-perfect. IIT Bombay, Delhi, Madras flagship branches are in reach.' }
              : rawPct >= 0.67
              ? { band: bands.high,        percentile: '99.7–99.95%', rank: 'AIR 500–3,000',      colleges: 'Most IITs',              msg: 'Strong performance. Most IIT branches in top-tier IITs accessible.' }
              : rawPct >= 0.50
              ? { band: bands.good,        percentile: '99.0–99.7%',  rank: 'AIR 3,000–15,000',   colleges: 'Good NITs / Newer IITs', msg: 'Qualifies for JEE Advanced. Good NITs and newer IITs accessible.' }
              : rawPct >= 0.33
              ? { band: bands.moderate,    percentile: '95–99%',      rank: 'AIR 15,000–80,000',  colleges: 'NITs / GFTIs',           msg: 'May qualify for JEE Advanced. NITs and government colleges in range.' }
              : rawPct >= 0.25
              ? { band: bands.low,         percentile: '~93%',        rank: 'AIR 80,000+',        colleges: 'Borderline',             msg: 'Near the JEE Advanced qualifying cutoff (93.1 percentile, 2025). Borderline NIT admission.' }
              : { band: bands.veryLow,     percentile: '< 93%',       rank: '—',                  colleges: 'Below cutoff',           msg: 'Below the JEE Advanced qualifying percentile (93.1, 2025). Focus on core fundamentals.' };

            // JEE Advanced: score/maxScore → rank (calibrated to real JEE Advanced 2025 data)
            const advData = rawPct >= 0.70
              ? { band: bands.exceptional, rank: 'AIR < 500',        iitAccess: 'IIT B/D/M CSE, EE', msg: 'Exceptional. IIT Bombay, Delhi, Madras flagship branches in reach.' }
              : rawPct >= 0.56
              ? { band: bands.high,        rank: 'AIR 500–3,000',    iitAccess: 'IIT K/R/G/BHU',     msg: 'Strong. IIT Kanpur, Roorkee, Guwahati — good branches accessible.' }
              : rawPct >= 0.42
              ? { band: bands.good,        rank: 'AIR 3,000–8,000',  iitAccess: 'Newer IITs',         msg: 'Qualifies comfortably. Newer IITs and non-flagship branches of good IITs.' }
              : rawPct >= 0.35
              ? { band: bands.moderate,    rank: 'AIR 8,000–18,000', iitAccess: 'Limited options',    msg: 'Near the qualifying threshold (~35% of max). Few IIT branches accessible.' }
              : { band: bands.veryLow,     rank: '—',                iitAccess: 'Not qualifying',     msg: 'Below the typical qualifying mark (~35% of max, 2025). Strengthen weak areas first.' };

            return (
              <section className={`${glass} p-5 sm:p-6`}>
                <h2 className={`${HEAD} text-[21px] font-extrabold leading-tight tracking-[-0.01em] text-[#003366]`}>Where this score lands</h2>
                <p className="mt-1 text-[13px] text-[#5A6B8C]">Rough bands from published data. Not official cutoffs or predictions.</p>

                <div className="mt-4 flex flex-col gap-3">
                  <ChanceCard
                    title="JEE Main → NIT / IIT"
                    bandLabel={mainData.band.label}
                    color={mainData.band.color} bg={mainData.band.bg} border={mainData.band.border}
                    rows={[['Percentile', mainData.percentile], ['Expected rank', mainData.rank], ['Colleges in range', mainData.colleges]]}
                    msg={mainData.msg}
                  />
                  <ChanceCard
                    title="JEE Advanced → IIT rank"
                    bandLabel={advData.band.label}
                    color={advData.band.color} bg={advData.band.bg} border={advData.band.border}
                    rows={[['Expected AIR', advData.rank], ['IIT branches', advData.iitAccess]]}
                    msg={advData.msg}
                  />
                </div>

                <p className="mt-3 text-[10.5px] font-medium leading-relaxed text-[#7A87A0]">
                  Estimates from fixed score bands, not official data. Actual results vary with paper difficulty, normalisation and candidate count each year.
                </p>
              </section>
            );
          })()}
        </div>

        {/* What this mock tells you */}
        {examInsights && (
          <section>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className={`${HEAD} text-[24px] font-extrabold tracking-[-0.02em] text-[#003366]`}>What this mock tells you</h2>
                <p className="mt-1 text-[13px] text-[#5A6B8C]">Built only from this attempt, so it reflects how this paper went.</p>
              </div>
              <span className="rounded-full bg-[#EEF2FF] px-3 py-1.5 text-[11.5px] font-bold text-[#003366]">6 signals</span>
            </div>
            <div className="columns-1 gap-4 md:columns-2 xl:columns-3 [column-fill:balance]">
              <TopicList
                title="Topic breakdown"
                sub={`Lowest accuracy first · ${examInsights.topics.length} topics in this mock`}
                topics={examInsights.topics.slice(0, 8)}
                mode="accuracy"
                emptyText="No answered questions in this mock."
              />
              <TopicList
                title="Marks lost by topic"
                sub="Including negative marks"
                topics={examInsights.marksLostTopics}
                mode="marks"
                emptyText="No marks lost in this mock."
              />
              <CutoffCard cutoffs={examInsights.cutoffs} scoreLabel="This mock" />
              <NegativesCard negatives={examInsights.negatives} />
              <TimeByTypeCard rows={examInsights.timeByType} />
              <SectionOrderCard rows={examInsights.subjectOrder} />
            </div>
          </section>
        )}

        {/* Question review */}
        <div id="review" className="scroll-mt-24">
          <QuestionReview
            examId={examId}
            weakPracticeUrl={weakPracticeUrl}
            isNEET={isNEET}
            allQs={allQs}
            filteredQs={filteredQs}
            breakdown={breakdown}
            expandedQ={expandedQ}
            onExpand={setExpandedQ}
            filterSubject={filterSubject}
            onFilterSubject={setFilterSubject}
            filterStatus={filterStatus}
            onFilterStatus={setFilterStatus}
          />
        </div>

        {/* Closing action */}
        <section className="relative overflow-hidden rounded-[36px] p-7 text-white sm:p-10" style={{ background: 'linear-gradient(135deg,#803688 0%,#A24BA8 100%)' }}>
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <span className="absolute -right-16 -top-20 h-[320px] w-[320px] rounded-full bg-white/10" />
            <span className="absolute -bottom-24 left-1/3 h-[260px] w-[260px] rounded-full bg-white/[.07]" />
          </div>
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div className="min-w-0 max-w-[52ch]">
              <h2 className={`${HEAD} text-[clamp(22px,2.6vw,32px)] font-extrabold leading-tight tracking-[-0.02em]`}>
                Turn this result into your next jump.
              </h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-white/85">
                Practise the topics you lost marks on while the paper is fresh, then take another mock to measure the change.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={weakPracticeUrl}
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-[13.5px] font-extrabold text-[#803688] no-underline shadow-[0_5px_0_rgba(90,37,96,.45)] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] active:translate-y-[3px] active:shadow-[0_1px_0_rgba(90,37,96,.45)] motion-reduce:transition-none"
              >
                Practice weak areas
              </Link>
              <Link
                href="/mock"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/60 px-6 py-2.5 text-[13.5px] font-extrabold text-white no-underline transition-colors duration-150 hover:border-white hover:bg-white/10"
              >
                Take another mock
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}