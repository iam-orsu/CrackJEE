'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Question } from '@/types';
import type { StoredResult, MarkingScheme } from './shared';

interface SessionSummaryProps {
  questions: Question[];
  examResults: Record<number, StoredResult>;
  sessionSecs: number;
  markingScheme: MarkingScheme;
  /* Exam name for the headings, e.g. "NEET"; JEE leaves it out */
  examTitle?: string;
  fmtTime: (secs: number) => string;
  onReview: () => void;
  onPracticeAgain: () => void;
}

/* The dashboard's palette and shapes, so the result page reads as part of it */
const NAVY = '#003366', GOOD = '#15803D', WARN = '#B45309', BAD = '#C8202F';
const TRACK = '#EEF2FF';
const HEAD = 'font-display';
const glass = 'min-w-0 rounded-[28px] border border-[#003366]/10 bg-white/85 shadow-[0_24px_60px_-34px_rgba(0,51,102,.45)] backdrop-blur-xl';
const h2c = `${HEAD} text-[21px] font-extrabold leading-tight tracking-[-0.01em] text-[#003366]`;
const btn = 'inline-flex items-center justify-center gap-2 rounded-full bg-[#803688] px-5 py-2.5 text-[13px] font-bold text-white no-underline shadow-[0_10px_24px_-10px_rgba(128,54,136,.8)] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none';
const btn2 = 'inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#003366]/15 bg-white px-5 py-2.5 text-[13px] font-bold text-[#003366] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none';

function toneColor(pct: number) { return pct >= 60 ? GOOD : pct >= 40 ? WARN : BAD; }

/* The ring gauge the dashboard uses for its headline numbers */
function Ring({ pct, color, size = 84, stroke = 9, children }: { pct: number; color: string; size?: number; stroke?: number; children?: ReactNode }) {
  const [shown, setShown] = useState(0);
  useEffect(() => { const id = requestAnimationFrame(() => setShown(pct)); return () => cancelAnimationFrame(id); }, [pct]);
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, f = Math.min(1, Math.max(0, shown / 100)) * c, m = size / 2;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="block">
        <circle cx={m} cy={m} r={r} fill="none" stroke={TRACK} strokeWidth={stroke} />
        <circle cx={m} cy={m} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={`${f} ${c}`} strokeLinecap="round" transform={`rotate(-90 ${m} ${m})`} style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.2,.8,.2,1)' }} />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
}

/* A label on the left, its figure on the right, hairline separated */
function Split({ rows }: { rows: Array<[string, ReactNode]> }) {
  return (
    <>
      {rows.map(([l, v]) => (
        <div key={l} className="flex justify-between gap-3 border-t border-[rgba(0,51,102,.08)] py-2.5 text-[12.5px]">
          <span className="font-semibold text-[#5A6B8C]">{l}</span>
          <span className="font-extrabold tabular-nums text-[#31407F]">{v}</span>
        </div>
      ))}
    </>
  );
}

/* End-of-session result, laid out like the dashboard */
export function SessionSummary({ questions, examResults, sessionSecs, markingScheme, examTitle, fmtTime, onReview, onPracticeAgain }: SessionSummaryProps) {
  const total     = questions.length;
  const correct   = Object.values(examResults).filter((r) => r.isCorrect).length;
  const attempted = Object.keys(examResults).length;
  const wrong     = attempted - correct;
  const skipped   = total - attempted;
  const accuracy  = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  // Same marks as the mock exam: JEE Main integers have no penalty; Advanced single-correct and integer are +3,
  // multi-correct is -2 when wrong. Multi-correct partial credit is not tracked here.
  const pointsIfCorrect = (qt: string) =>
    (markingScheme === 'jee_advanced' && (qt === 'mcq_single' || qt === 'integer') ? 3 : 4);
  const score = markingScheme === 'standard' ? correct : questions.reduce((acc, q, i) => {
    const res = examResults[i];
    if (!res) return acc;
    if (res.isCorrect) return acc + pointsIfCorrect(q.questionType);
    if (markingScheme === 'jee_main') return acc - (q.questionType === 'integer' ? 0 : 1);
    if (q.questionType === 'integer') return acc;
    return acc - (q.questionType === 'mcq_multi' ? 2 : 1);
  }, 0);
  const max = markingScheme === 'standard' ? total
    : questions.reduce((acc, q) => acc + pointsIfCorrect(q.questionType), 0);

  const scoreLabel = markingScheme === 'standard'
    ? 'Correct answers'
    : examTitle ? `${examTitle} score` : markingScheme === 'jee_main' ? 'JEE Main score' : 'JEE Advanced score';
  const maxUnit = markingScheme === 'standard' ? 'questions' : 'marks';

  /* A negative score has nothing to show on the bar. */
  const scorePct = max > 0 ? Math.max(0, Math.min(100, (score / max) * 100)) : 0;
  const scoreTone = score < 0 ? BAD : NAVY;

  const subjects = Array.from(new Set(questions.map((q) => q.subject)));

  return (
    <div className="exam-overlay">
      <div className="exam-header">
        <div className="exam-head-left">
          <span className="exam-logo"><Image src="/logo.png" alt="JEENEET.ai" width={92} height={48} className="site-logo" /></span>
        </div>
        <div className="exam-head-right">
          <span className="exam-timer">{fmtTime(sessionSecs)}</span>
        </div>
      </div>

      <div className="summary-wrap">
        <div className="summary-page">
          {/* Page head */}
          <div className="mb-5">
            <h1 className={h2c}>Session complete</h1>
            <p className="mt-1 text-[13px] text-[#5A6B8C]">
              {subjects.join(' · ')} · {total} question{total === 1 ? '' : 's'} · {fmtTime(sessionSecs)} spent
            </p>
          </div>

          {/* Two stat cards */}
          <div className="summary-cards">
            <section className={`${glass} p-5 sm:p-6`}>
              <div className="flex items-center gap-4">
                <Ring pct={accuracy} color={toneColor(accuracy)} size={84} stroke={9}>
                  <span className={`${HEAD} text-[17px] font-extrabold tabular-nums`} style={{ color: toneColor(accuracy) }}>{accuracy}%</span>
                </Ring>
                <div className="min-w-0">
                  <div className={`${HEAD} text-[26px] font-extrabold leading-none tabular-nums text-[#31407F]`}>{correct} of {attempted}</div>
                  <div className="mt-1.5 text-[12px] font-semibold text-[#5A6B8C]">answered correctly</div>
                </div>
              </div>
            </section>

            <section className={`${glass} p-5 sm:p-6`}>
              <p className="text-[12px] font-semibold text-[#7A87A0]">{scoreLabel}</p>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className={`${HEAD} text-[34px] font-extrabold leading-none tabular-nums`} style={{ color: scoreTone }}>
                  {score > 0 ? '+' : ''}{score}
                </span>
                <span className="text-[13px] font-semibold text-[#5A6B8C]">of {max} {maxUnit}</span>
              </div>
              <div className="relative mt-4 h-3 rounded-full bg-[#EEF2FF]">
                <div className="h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none" style={{ width: `${scorePct}%`, background: scoreTone }} />
              </div>
              <div className="mt-2 flex justify-between text-[11px] font-semibold text-[#5A6B8C]"><span>0</span><span>{max}</span></div>
            </section>
          </div>

          {/* One wide card: how the paper went */}
          <section className={`${glass} mt-4 p-5 sm:p-6`}>
            <div className="mb-4">
              <h2 className={h2c}>How the paper went</h2>
              <p className="mt-1 text-[13px] text-[#5A6B8C]">Every question in this session, in one bar</p>
            </div>

            <div className="summary-split" aria-hidden>
              <span className="is-correct" style={{ flexGrow: correct }} />
              <span className="is-wrong" style={{ flexGrow: wrong }} />
              <span className="is-skipped" style={{ flexGrow: skipped }} />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#5A6B8C]"><i className="h-2.5 w-2.5 rounded-full" style={{ background: GOOD }} />{correct} correct</span>
              <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#5A6B8C]"><i className="h-2.5 w-2.5 rounded-full" style={{ background: BAD }} />{wrong} wrong</span>
              <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#5A6B8C]"><i className="h-2.5 w-2.5 rounded-full" style={{ background: '#B9C6F5' }} />{skipped} skipped</span>
            </div>

            <div className="mt-5 grid gap-x-10 sm:grid-cols-2">
              <Split rows={[
                ['Correct', <span key="c" style={{ color: GOOD }}>{correct}</span>],
                ['Wrong', <span key="w" style={{ color: BAD }}>{wrong}</span>],
              ]} />
              <Split rows={[
                ['Skipped', skipped],
                ['Attempted', attempted],
              ]} />
            </div>
          </section>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" className={btn} onClick={onReview}>Review session</button>
            <button type="button" className={btn2} onClick={onPracticeAgain}>Practice again</button>
            <Link href="/dashboard" className="px-1 text-[13px] font-bold text-[#5A6B8C] transition-colors hover:text-[#003366]">Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
