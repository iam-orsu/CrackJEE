'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { Question } from '@/types';
import type { StoredResult } from './shared';

interface SessionReviewProps {
  questions: Question[];
  examResults: Record<number, StoredResult>;
  sessionSecs: number;
  fmtTime: (secs: number) => string;
  onBackToScore: () => void;
  onNewSession: () => void;
}

/* The dashboard's brand system, one level down */
const NAVY = '#003366', PURPLE = '#803688', GOOD = '#15803D', WARN = '#B45309', BAD = '#C8202F';
const FAINT = '#7A87A0', TRACK = '#EEF2FF';

const HEAD = 'font-display';
const glass = 'rounded-[28px] border border-[#003366]/10 bg-white shadow-[0_24px_60px_-34px_rgba(0,51,102,.45)]';
const h2c = `${HEAD} text-[21px] font-extrabold leading-tight tracking-[-0.01em] text-[#003366]`;
const pill = 'inline-flex items-center justify-center gap-2 rounded-full bg-[#803688] px-5 py-2.5 text-[13px] font-bold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[4px] active:shadow-[0_1px_0_#5A2560] motion-reduce:transition-none';
const quietPill = 'inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#003366]/20 bg-white px-5 py-2 text-[13px] font-bold text-[#003366] no-underline transition-colors duration-150 hover:border-[#003366]/45 hover:bg-[#EEF2FF]';

const SUBJECT_TONE: Record<string, string> = {
  Physics: '#2A4FD6', Chemistry: '#803688', Mathematics: '#2E9E5B',
  Biology: '#1E8A66', Botany: '#1E8A66', Zoology: '#0F766E',
};
const subjectTone = (s: string) => SUBJECT_TONE[s] ?? FAINT;
const toneColor = (pct: number) => (pct >= 60 ? GOOD : pct >= 40 ? WARN : BAD);

function Meter({ pct, color, h = 7 }: { pct: number; color: string; h?: number }) {
  return (
    <span className="block w-full overflow-hidden rounded-full bg-[#EEF2FF]" style={{ height: h }}>
      <span
        className="block h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none"
        style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: color }}
      />
    </span>
  );
}

/* The ring gauge the dashboard uses for its headline numbers */
function Ring({ pct, color, size = 84, stroke = 9, track = TRACK, children }: {
  pct: number; color: string; size?: number; stroke?: number; track?: string; children?: ReactNode;
}) {
  const [shown, setShown] = useState(0);
  useEffect(() => { const id = requestAnimationFrame(() => setShown(pct)); return () => cancelAnimationFrame(id); }, [pct]);
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, f = Math.min(1, Math.max(0, shown / 100)) * c, m = size / 2;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="block">
        <circle cx={m} cy={m} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={m} cy={m} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={`${f} ${c}`} strokeLinecap="round" transform={`rotate(-90 ${m} ${m})`} style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.2,.8,.2,1)' }} />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
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

function Stat({ label, value, sub, color }: { label: string; value: ReactNode; sub?: string; color: string }) {
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

/* One page-load rise, then everything rests */
const MotionStyle = () => (
  <style>{`
@keyframes sr-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.sr-rise{animation:sr-rise .65s cubic-bezier(.2,.8,.2,1) both}
.sr-stagger>*{animation:sr-rise .55s cubic-bezier(.2,.8,.2,1) both}
.sr-stagger>*:nth-child(2){animation-delay:.06s}
.sr-stagger>*:nth-child(3){animation-delay:.12s}
.sr-stagger>*:nth-child(4){animation-delay:.18s}
@media (prefers-reduced-motion:reduce){.sr-rise,.sr-stagger>*{animation:none!important}}
`}</style>
);

/* Session analysis: score headline, subject breakdown, weakest topics and coaching insight */
export function SessionReview({ questions, examResults, sessionSecs, fmtTime, onBackToScore, onNewSession }: SessionReviewProps) {
  const totalQ    = questions.length;
  const correct   = Object.values(examResults).filter((r) => r.isCorrect).length;
  const wrong     = Object.values(examResults).filter((r) => !r.isCorrect).length;
  const skipped   = totalQ - Object.keys(examResults).length;
  const attempted = correct + wrong;
  const accuracy  = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  const tone      = toneColor(accuracy);
  const avgSeconds = attempted > 0 ? Math.round(sessionSecs / attempted) : 0;

  const isNEET = questions.some((q) => q.subject === 'Botany' || q.subject === 'Zoology' || q.subject === 'Biology');

  /* Per-subject stats */
  const subjectStats = new Map<string, { correct: number; total: number }>();
  /* Per-topic stats */
  const topicStats   = new Map<string, { correct: number; total: number; subject: string }>();
  /* Per-difficulty stats */
  const diffStats    = new Map<string, { correct: number; total: number }>();

  questions.forEach((q, i) => {
    const res = examResults[i];
    // Skipped questions are not attempts: they must not count as wrong answers in subject or topic stats
    if (!res) return;
    const isC = res.isCorrect;

    if (!subjectStats.has(q.subject)) subjectStats.set(q.subject, { correct: 0, total: 0 });
    subjectStats.get(q.subject)!.total++;
    if (isC) subjectStats.get(q.subject)!.correct++;

    const tk = `${q.subject}::${q.topic}`;
    if (!topicStats.has(tk)) topicStats.set(tk, { correct: 0, total: 0, subject: q.subject });
    topicStats.get(tk)!.total++;
    if (isC) topicStats.get(tk)!.correct++;

    if (!diffStats.has(q.difficulty)) diffStats.set(q.difficulty, { correct: 0, total: 0 });
    diffStats.get(q.difficulty)!.total++;
    if (isC) diffStats.get(q.difficulty)!.correct++;
  });

  /* Weakest topics — sorted by accuracy ascending */
  const weakTopics = [...topicStats.entries()]
    .map(([key, s]) => ({
      key,
      topic: key.split('::')[1] ?? key,
      subject: s.subject,
      correct: s.correct,
      total: s.total,
      pct: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
    }))
    .filter((t) => t.pct < 100)
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 6);

  /* Generate insight text */
  const insightParts: string[] = [];

  if (accuracy >= 80) {
    insightParts.push('Good session. Your preparation is working.');
  } else if (accuracy >= 60) {
    insightParts.push('You crossed 60%. See the topics below and keep going.');
  } else if (accuracy >= 40) {
    insightParts.push('Not a bad start. The topics below show where you lost marks.');
  } else {
    insightParts.push('Rough session. That is fine. Use the topic list below to know what to study next.');
  }

  /* Difficulty pattern */
  const begS = diffStats.get('beginner');
  const advS = diffStats.get('advanced');
  if (begS && advS && begS.total >= 2 && advS.total >= 2) {
    const begPct = Math.round((begS.correct / begS.total) * 100);
    const advPct = Math.round((advS.correct / advS.total) * 100);
    if (begPct - advPct >= 30) {
      insightParts.push(`You got ${begPct}% on easier questions but only ${advPct}% on harder ones. The concepts are not fully clear yet.`);
    } else if (advPct > begPct + 10) {
      insightParts.push(`You scored higher on harder questions (${advPct}%) than easier ones (${begPct}%). You may be rushing through the simpler problems.`);
    }
  }

  /* Dominant weak subject */
  let worstSubj = ''; let worstPct = 101;
  for (const [subj, s] of subjectStats) {
    if (s.total >= 3) {
      const pct = Math.round((s.correct / s.total) * 100);
      if (pct < worstPct) { worstPct = pct; worstSubj = subj; }
    }
  }
  if (worstSubj && worstPct < 50) {
    insightParts.push(`${worstSubj} is where you lost the most marks. Only ${worstPct}% correct across ${subjectStats.get(worstSubj)!.total} questions.`);
  }

  /* Single topic dominating wrong answers */
  const dominant = weakTopics.find((t) => t.total >= 3 && t.pct === 0);
  if (dominant) {
    insightParts.push(`${dominant.topic} was wrong every time across ${dominant.total} attempts. Revise this topic before your next session.`);
  } else if (skipped > totalQ * 0.3) {
    insightParts.push(`You skipped ${skipped} of ${totalQ} questions. Try to attempt everything in practice, even if you are unsure.`);
  }

  const insight = insightParts.join(' ');

  /* Practice link for the topics missed in this session */
  const weakPracticeUrl = (() => {
    const weights = new Map<string, { subject: string; weight: number }>();
    questions.forEach((q, i) => {
      const res = examResults[i];
      const isWrong = !!res && !res.isCorrect;
      if (res && !isWrong) return;
      if (!q.subject || !q.topic) return;
      const key = `${q.subject}::${q.topic}`;
      const weight = isWrong ? 2 : 1;
      const ex = weights.get(key);
      if (ex) ex.weight += weight;
      else weights.set(key, { subject: q.subject, weight });
    });
    const base = isNEET ? '/neet/practice' : '/practice';
    if (weights.size === 0) return base;
    const subjectMap: Record<string, string[]> = {};
    for (const [key, { subject }] of [...weights.entries()].sort(([, a], [, b]) => b.weight - a.weight)) {
      const topic = key.split('::')[1]!;
      if (!subjectMap[subject]) subjectMap[subject] = [];
      subjectMap[subject].push(topic);
    }
    const weakData = encodeURIComponent(JSON.stringify({ subjects: Object.keys(subjectMap), topics: subjectMap }));
    return `${base}?mode=mock_weak&weakData=${weakData}`;
  })();

  const subjectNames = [...subjectStats.keys()].join(' · ');

  return (
    <div className="exam-overlay">
      <div className="min-h-0 flex-1 overflow-y-auto bg-[#FBFCFE] bg-page-wash font-dm text-[#003366]">
        <MotionStyle />

        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b border-[#003366]/10 bg-white/85 backdrop-blur-xl">
          <div className="mx-auto flex min-h-16 w-full max-w-[1240px] items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Link href="/dashboard" aria-label="JEENEET.ai dashboard" className="shrink-0">
                <Image
                  src="/logo.png" alt="JEENEET.ai" width={118} height={48} priority
                  style={{ display: 'block', height: 48, width: 'auto' }}
                />
              </Link>
              <span aria-hidden className="hidden h-6 w-px bg-[#003366]/15 sm:block" />
              <nav className="hidden min-w-0 items-center gap-2 text-[13px] font-semibold sm:flex">
                <Link href={isNEET ? '/neet/practice' : '/practice'} className="truncate text-[#5A6B8C] transition-colors hover:text-[#003366]">Practice</Link>
                <span className="text-[#A2AEC5]">›</span>
                <span className="truncate text-[#003366]">Session analysis</span>
              </nav>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" onClick={onBackToScore} className="hidden rounded-full px-3 py-2 text-[13px] font-bold text-[#5A6B8C] transition-colors hover:bg-[#EEF2FF] hover:text-[#003366] sm:inline-flex">
                Back to score
              </button>
              <button type="button" onClick={onNewSession} className={pill}>New session</button>
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 px-4 pb-16 pt-6 sm:px-6 lg:px-8">

          {/* Accuracy hero */}
          <section className="sr-rise relative overflow-hidden rounded-[36px] border border-[#003366]/10 bg-white p-6 sm:p-8 xl:p-10">
            <Blob id="sr-hero-blob" color={PURPLE} className="bottom-[-12%] right-0 h-[78%] w-[min(62%,680px)]" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_210px]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.09em] text-[#003366]">
                    Practice · Session analysis
                  </span>
                  <span className="rounded-full border border-[#003366]/10 px-3 py-1 text-[11px] font-bold text-[#5A6B8C]">
                    {fmtTime(sessionSecs)} session
                  </span>
                </div>

                <h1 className={`${HEAD} mt-4 text-[clamp(30px,4.2vw,50px)] font-extrabold leading-[1.05] tracking-[-0.03em]`}>
                  You got <span style={{ color: tone }}>{accuracy}%</span> right
                </h1>
                <p className="mt-3 max-w-[58ch] text-[14.5px] leading-relaxed text-[#5A6B8C]">
                  {insight}
                </p>

                <div className="sr-stagger mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  <Stat label="Correct" value={correct} sub={`${accuracy}% accuracy`} color={GOOD} />
                  <Stat label="Wrong" value={wrong} sub="answered incorrectly" color={BAD} />
                  <Stat label="Skipped" value={skipped} sub={`of ${totalQ} questions`} color={FAINT} />
                  <Stat
                    label="Time taken"
                    value={fmtTime(sessionSecs)}
                    sub={avgSeconds > 0 ? `avg ${fmtTime(avgSeconds)} per q` : 'session length'}
                    color={NAVY}
                  />
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={onNewSession} className={pill}>New session</button>
                  <button type="button" onClick={onBackToScore} className={quietPill}>Back to score</button>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 justify-self-center">
                <Ring pct={accuracy} color={tone} size={172} stroke={16} track="rgba(0,51,102,.1)">
                  <div className="text-center">
                    <div className={`${HEAD} text-[38px] font-extrabold leading-none tabular-nums`} style={{ color: tone }}>{accuracy}%</div>
                    <div className="mt-1 text-[11px] font-semibold text-[#7A87A0]">accuracy</div>
                  </div>
                </Ring>
                <p className="text-center text-[12px] font-semibold text-[#5A6B8C]">
                  {subjectStats.size > 0 ? `${subjectStats.size} subject${subjectStats.size === 1 ? '' : 's'} · ` : ''}{totalQ} questions
                </p>
              </div>
            </div>
          </section>

          {/* Subject performance */}
          {subjectStats.size > 0 && (
            <section className={`${glass} p-5 sm:p-6`}>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 className={h2c}>Subject performance</h2>
                  <p className="mt-1 text-[13px] text-[#5A6B8C]">How each subject went, from the questions you answered.</p>
                </div>
                <span className="text-[12px] font-semibold text-[#7A87A0]">
                  {subjectNames} · {attempted} attempted
                </span>
              </div>

              <div className={`grid gap-3 sm:grid-cols-2 ${subjectStats.size > 3 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
                {[...subjectStats.entries()].map(([subj, s]) => {
                  const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
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
                            {s.correct}<span className="text-[14px] font-bold text-[#A2AEC5]"> / {s.total}</span>
                          </div>
                        </div>
                        <Ring pct={pct} color={sc} size={46} stroke={5} track="rgba(0,51,102,.1)">
                          <span className="text-[10px] font-extrabold tabular-nums" style={{ color: sc }}>{pct}%</span>
                        </Ring>
                      </div>
                      <div className="relative mt-3"><Meter pct={pct} color={sc} h={7} /></div>
                      <div className="relative mt-2 flex justify-between text-[11.5px] font-semibold text-[#5A6B8C]">
                        <span>{pct}% accuracy</span>
                        <span>{s.total} attempted</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Topics to focus on */}
          <section className={`${glass} p-5 sm:p-6`}>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className={h2c}>Topics to focus on</h2>
                <p className="mt-1 text-[13px] text-[#5A6B8C]">Lowest accuracy first, built from this session.</p>
              </div>
              {weakTopics.length > 0 && (
                <a href={weakPracticeUrl} className={pill}>Practice weak topics</a>
              )}
            </div>

            {weakTopics.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {weakTopics.map((t, i) => {
                  const sc = subjectTone(t.subject);
                  const tTone = t.pct < 40 ? BAD : WARN;
                  return (
                    <div
                      key={t.key}
                      className="relative overflow-hidden rounded-[24px] border border-[#003366]/10 bg-white p-4 transition-transform duration-200 hover:-translate-y-[2px] motion-reduce:transition-none"
                      style={{ boxShadow: '0 12px 26px -22px rgba(0,51,102,.55)' }}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`${HEAD} grid h-8 w-8 shrink-0 place-items-center rounded-xl text-[12px] font-extrabold tabular-nums`}
                          style={{ background: `${sc}14`, color: sc }}
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className={`${HEAD} text-[15px] font-extrabold leading-snug text-[#003366]`}>{t.topic}</div>
                          <div className="mt-1 flex items-center gap-1.5 text-[11.5px] font-bold" style={{ color: sc }}>
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: sc }} />
                            {t.subject}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className={`${HEAD} text-[20px] font-extrabold leading-none tabular-nums`} style={{ color: tTone }}>{t.pct}%</div>
                          <div className="mt-1 text-[11px] font-semibold text-[#7A87A0]">{t.correct}/{t.total} correct</div>
                        </div>
                      </div>
                      <div className="mt-3"><Meter pct={t.pct} color={tTone} h={6} /></div>
                    </div>
                  );
                })}
              </div>
            ) : attempted > 0 ? (
              <div className="rounded-[24px] border border-[#15803D]/20 bg-[#F2FAF5] px-5 py-4">
                <p className={`${HEAD} text-[16px] font-extrabold text-[#15803D]`}>Perfect or near-perfect session</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-[#5A6B8C]">
                  You got every answered question right. Try a harder difficulty or a new topic to keep growing.
                </p>
              </div>
            ) : (
              <div className="rounded-[24px] border border-[#003366]/10 bg-[#F7F9FC] px-5 py-4">
                <p className={`${HEAD} text-[16px] font-extrabold text-[#003366]`}>No answers recorded</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-[#5A6B8C]">
                  Start a session and answer a few questions to see your topic breakdown here.
                </p>
              </div>
            )}
          </section>

          {/* Closing action */}
          <section className="relative overflow-hidden rounded-[36px] p-7 text-white sm:p-10" style={{ background: 'linear-gradient(135deg,#803688 0%,#A24BA8 100%)' }}>
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <span className="absolute -right-16 -top-20 h-[320px] w-[320px] rounded-full bg-white/10" />
              <span className="absolute -bottom-24 left-1/3 h-[260px] w-[260px] rounded-full bg-white/[.07]" />
            </div>
            <div className="relative flex flex-wrap items-center justify-between gap-6">
              <div className="min-w-0 max-w-[52ch]">
                <h2 className={`${HEAD} text-[clamp(22px,2.6vw,32px)] font-extrabold leading-tight tracking-[-0.02em]`}>
                  Turn this session into your next jump.
                </h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/85">
                  Practise the topics you missed while they are fresh, then run another session to measure the change.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onNewSession}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-[13.5px] font-extrabold text-[#803688] shadow-[0_5px_0_rgba(90,37,96,.45)] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] active:translate-y-[3px] active:shadow-[0_1px_0_rgba(90,37,96,.45)] motion-reduce:transition-none"
                >
                  New session
                </button>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white/60 px-6 py-2.5 text-[13.5px] font-extrabold text-white no-underline transition-colors duration-150 hover:border-white hover:bg-white/10"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}