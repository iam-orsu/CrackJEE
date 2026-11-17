'use client';

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import type {
  TopicStat, CarelessSummary, CutoffData, CutoffRow, GuessingAnalysis, NegativeSummary,
  ProjectionData, StandingData, SubjectOrderRow, TimeByTypeRow,
} from '@/types';

/* Palette */
export const NAVY = '#003366';
export const PURPLE = '#803688';
export const GOOD = '#15803D';
export const WARN = '#B45309';
export const BAD = '#C8202F';
export const PLATFORM = '#97A3D4';
export const MUTE = '#5A6B8C';
export const FAINT = '#7A87A0';
export const INK = '#31407F';
export const TRACK = '#EEF2FF';

export const QT: Record<string, string> = {
  mcq_single: 'Single correct',
  mcq_multi: 'Multi-correct',
  integer: 'Integer',
  matrix_match: 'Matrix Match',
};

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const HEAD = 'font-display';
export const glass = 'min-w-0 rounded-[28px] border border-[#003366]/10 bg-white/85 shadow-[0_24px_60px_-34px_rgba(0,51,102,.45)] backdrop-blur-xl';
export const kicker = 'text-[12px] font-semibold text-[#7A87A0]';
export const h2c = `${HEAD} text-[21px] font-extrabold leading-tight tracking-[-0.01em] text-[#003366]`;
export const btn = 'inline-flex items-center justify-center gap-2 rounded-full bg-[#803688] px-5 py-2.5 text-[13px] font-bold text-white no-underline shadow-[0_10px_24px_-10px_rgba(128,54,136,.8)] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none';
export const skel = 'animate-pulse rounded-[28px] bg-[#EEF2FF] motion-reduce:animate-none';

export const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;
export const fmtSec = (t: number) => (t < 60 ? `${Math.round(t)}s` : `${Math.floor(t / 60)}m ${Math.round(t % 60)}s`);

export function toneColor(pct: number) { return pct >= 60 ? GOOD : pct >= 40 ? WARN : BAD; }
export const SUBJECT_TONE: Record<string, string> = {
  Physics: '#2A4FD6',
  Chemistry: '#803688',
  Mathematics: '#2E9E5B',
  Biology: '#1E8A66',
  Botany: '#1E8A66',
  Zoology: '#0F766E',
};
export function subjectTone(s: string) { return SUBJECT_TONE[s] ?? MUTE; }

export type GlyphName = 'target' | 'trend' | 'bolt' | 'alert' | 'check' | 'clock';
export function Glyph({ name, size = 18 }: { name: GlyphName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {name === 'target' && (<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" fill="currentColor" /></>)}
      {name === 'trend' && (<><polyline points="3 17 9 11 13 15 21 7" /><polyline points="15 7 21 7 21 13" /></>)}
      {name === 'bolt' && <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />}
      {name === 'alert' && (<><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>)}
      {name === 'check' && <path d="M5 12.5l4.5 4.5L19 7.5" />}
      {name === 'clock' && (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>)}
    </svg>
  );
}

export function Ring({ pct, color, size = 72, stroke = 7, track = TRACK, children }: { pct: number; color: string; size?: number; stroke?: number; track?: string; children?: ReactNode }) {
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

export function Meter({ pct, color, mark, h = 'h-2' }: { pct: number; color: string; mark?: number; h?: string }) {
  return (
    <span className={`relative block ${h} w-full rounded-full bg-[#EEF2FF]`}>
      <span className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }} />
      {mark != null && mark <= 100 && <span className="absolute -inset-y-1 w-[3px] -translate-x-1/2 rounded-sm bg-[#003366]" style={{ left: `${mark}%` }} />}
    </span>
  );
}

export function InsightCard({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) {
  return (
    <section className={`${glass} mb-4 flex break-inside-avoid flex-col p-5`}>
      <h3 className={`${HEAD} text-[17px] font-extrabold leading-tight text-[#003366]`}>{title}</h3>
      {sub && <p className="mt-1 text-[12.5px] leading-snug text-[#5A6B8C]">{sub}</p>}
      <div className="mt-4 flex flex-1 flex-col">{children}</div>
    </section>
  );
}

export const Empty = ({ children }: { children: ReactNode }) => <p className="text-[13px] font-medium leading-relaxed text-[#5A6B8C]">{children}</p>;
export const Split = ({ rows }: { rows: Array<[string, ReactNode]> }) => (
  <>{rows.map(([l, v]) => (<div key={l} className="flex justify-between gap-3 border-t border-[rgba(0,51,102,.08)] py-2 text-[12.5px]"><span className="font-semibold text-[#5A6B8C]">{l}</span><span className="font-extrabold text-[#31407F]">{v}</span></div>))}</>
);
export const RingStat = ({ pct, color, label, big, small }: { pct: number; color: string; label: ReactNode; big: ReactNode; small?: ReactNode }) => (
  <div className="mb-4 flex items-center gap-4">
    <Ring pct={pct} color={color} size={84} stroke={9}><span className={`${HEAD} text-[17px] font-extrabold tabular-nums`} style={{ color }}>{label}</span></Ring>
    <div className="min-w-0"><div className={`${HEAD} text-[26px] font-extrabold leading-none tabular-nums text-[#31407F]`}>{big}</div>{small && <div className="mt-1.5 text-[12px] font-semibold text-[#5A6B8C]">{small}</div>}</div>
  </div>
);

export function ProjectionCard({ projection: p }: { projection: ProjectionData }) {
  const tone = p.available ? toneColor(p.expected) : PLATFORM;
  return (
    <InsightCard title="Likely next score" sub="Estimate from your recent mocks">
      {p.available ? (<>
        <RingStat pct={p.expected} color={tone} label={`${p.expected}%`} big={<span style={{ color: p.trendPerMock >= 0 ? GOOD : BAD }}>{p.trendPerMock >= 0 ? '↑' : '↓'} {Math.abs(p.trendPerMock)}<span className="ml-1.5 text-[13px] font-bold text-[#5A6B8C]">per mock</span></span>} small={plural(p.mocks, 'mock')} />
        <div className="relative h-3 rounded-full bg-[#EEF2FF]">
          <div className="absolute top-0 h-full rounded-full opacity-30" style={{ left: `${p.low}%`, width: `${p.high - p.low}%`, background: tone }} />
          <div className="absolute -top-[3px] h-[18px] w-[18px] -translate-x-1/2 rounded-full border-[3px] border-white shadow" style={{ left: `${p.expected}%`, background: tone }} />
        </div>
        <div className="mt-2 flex justify-between text-[11px] font-bold text-[#5A6B8C]"><span>Low {p.low}%</span><span>High {p.high}%</span></div>
      </>) : <Empty>Take at least two mocks to see a projection. You have {p.mocks} so far.</Empty>}
    </InsightCard>
  );
}

export function StandingCard({ standing: s }: { standing: StandingData }) {
  return (
    <InsightCard title="Platform standing" sub="Among students on this platform only, not an NTA percentile">
      {s.available ? (<>
        <RingStat pct={s.percentile} color={NAVY} label={`#${s.rank}`} big={`Top ${100 - s.percentile}%`} small={`Rank ${s.rank} of ${s.of} · avg ${s.mine}%`} />
        <div className="relative h-3 rounded-full bg-[#EEF2FF]">
          <div className="h-full rounded-full bg-[#003366] transition-[width] duration-700 motion-reduce:transition-none" style={{ width: `${s.percentile}%` }} />
          <div className="absolute -top-[3px] h-[18px] w-[18px] -translate-x-1/2 rounded-full border-[3px] border-white bg-[#C8202F] shadow" style={{ left: `${s.percentile}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-[11px] font-bold text-[#5A6B8C]"><span>Bottom</span><span>Top</span></div>
      </>) : <Empty>{s.mine === null ? 'Take a mock to see where you stand.' : `Appears once ${s.needed} students have mocks. ${s.students} so far.`}</Empty>}
    </InsightCard>
  );
}

export function CutoffCard({ cutoffs, scoreLabel }: { cutoffs: CutoffData | null; scoreLabel: string }) {
  if (!cutoffs) return null;
  return (
    <InsightCard title="Cutoff check" sub={`${cutoffs.name} · as % of max marks`}>
      {cutoffs.lines === null ? <Empty>Take a mock to compare with the cutoff.</Empty> : cutoffs.lines.map((l) => {
        const up = l.status === 'above', color = up ? GOOD : BAD, sp = l.scorePct ?? 0, cp = l.cutoffPct ?? 0;
        return (
          <div key={l.label} className="border-t border-[rgba(0,51,102,.08)] py-3 first:border-t-0 first:pt-0">
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <span className="min-w-0 truncate text-[13.5px] font-bold text-[#31407F]">{l.label}</span>
              <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold" style={{ color, background: up ? '#E3F6E8' : '#FDE6E8' }}>{up ? `+${Math.abs(l.gapPct)} above` : `−${Math.abs(l.gapPct)} to go`}</span>
            </div>
            <Meter pct={sp} color={color} mark={cp} h="h-3" />
            <div className="mt-1.5 flex justify-between text-[11px] font-semibold text-[#5A6B8C]"><span>{scoreLabel}: <strong style={{ color }}>{sp}%</strong></span><span>Cutoff: <strong className="text-[#31407F]">{cp}%</strong></span></div>
          </div>
        );
      })}
      <p className="mt-3 text-[10.5px] font-medium leading-relaxed text-[#7A87A0]">From published reports, so verify with NTA or IIT before relying on these.{cutoffs.sources.map((s) => (<a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="ml-1.5 font-bold text-[#003366] underline">{s.label}</a>))}</p>
    </InsightCard>
  );
}

export function MonthlyBars({ monthly }: { monthly: Array<{ month: string; avgPct: number; mocks: number }> }) {
  return (
    <InsightCard title="Month by month" sub="Average mock score per month">
      {monthly.length === 0 ? <Empty>No mocks yet.</Empty> : (
        <div className="flex h-[150px] items-end gap-2.5">
          {monthly.map((m) => (
            <div key={m.month} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1" title={plural(m.mocks, 'mock')}>
              <span className="text-[11px] font-extrabold tabular-nums" style={{ color: toneColor(m.avgPct) }}>{m.avgPct}%</span>
              <div className="w-full max-w-[44px] rounded-t-xl transition-[height] duration-500 motion-reduce:transition-none" style={{ height: `${Math.max(8, m.avgPct) * 0.7}%`, background: toneColor(m.avgPct) }} />
              <span className="text-[10.5px] font-bold text-[#5A6B8C]">{MONTHS[Number(m.month.slice(5, 7)) - 1] ?? m.month}</span>
            </div>
          ))}
        </div>
      )}
    </InsightCard>
  );
}

export const MiniRow = ({ ring, color, title, subtitle, subColor, value }: { ring: number; color: string; title: string; subtitle: string; subColor?: string; value: string }) => (
  <div className="flex items-center gap-3 border-t border-[rgba(0,51,102,.08)] py-2.5 first:border-t-0 first:pt-0">
    <Ring pct={ring} color={color} size={40} stroke={4.5}><span className="text-[9px] font-extrabold" style={{ color }}>{Math.round(ring)}%</span></Ring>
    <div className="min-w-0 flex-1"><div className="truncate text-[13.5px] font-bold text-[#31407F]">{title}</div><div className="mt-0.5 text-[11px] font-bold" style={{ color: subColor ?? MUTE }}>{subtitle}</div></div>
    <span className={`${HEAD} shrink-0 text-[17px] font-extrabold tabular-nums`} style={{ color }}>{value}</span>
  </div>
);

export function TopicList({ title, sub, topics, mode, emptyText, action }: { title: string; sub?: string; topics: TopicStat[]; mode: 'accuracy' | 'marks'; emptyText: string; action?: ReactNode }) {
  const mx = mode === 'marks' ? Math.max(...topics.map((t) => t.marksLost ?? 0), 1) : 1;
  return (
    <InsightCard title={title} sub={sub}>
      {topics.length === 0 ? <Empty>{emptyText}</Empty> : topics.map((t) => {
        const acc = mode === 'accuracy';
        return <MiniRow key={`${t.subject}|${t.topic}`} ring={acc ? (t.accuracy ?? 0) : Math.round(((t.marksLost ?? 0) / mx) * 100)} color={acc ? toneColor(t.accuracy ?? 0) : BAD} title={t.topic} subtitle={`${t.subject} · ${t.attempts} answered`} subColor={subjectTone(t.subject)} value={acc ? `${t.accuracy}%` : `−${t.marksLost}`} />;
      })}
      {action && <div className="mt-auto pt-4">{action}</div>}
    </InsightCard>
  );
}

export function NegativesCard({ negatives: n }: { negatives: NegativeSummary }) {
  const wp = n.answered > 0 ? Math.round((n.wrong / n.answered) * 100) : 0, tone = wp >= 40 ? BAD : WARN;
  return (
    <InsightCard title="Negative marking" sub="How much wrong answers cost you">
      <RingStat pct={wp} color={tone} label={`${wp}%`} big={`${n.answered - n.wrong} / ${n.wrong}`} small={n.negativeCount > 0 ? `correct / wrong · ${n.negativeMarks} marks lost` : 'correct / wrong'} />
      <Split rows={[['Time on wrong', `${fmtSec(n.timeOnWrongSeconds)} (${n.shareOfTimeOnWrongPct}%)`], ['Time on correct', fmtSec(n.timeOnCorrectSeconds)]]} />
    </InsightCard>
  );
}

export function TimeByTypeCard({ rows }: { rows: TimeByTypeRow[] }) {
  return (
    <InsightCard title="Time by question type" sub="Accuracy and average time per type">
      {rows.length === 0 ? <Empty>No answered questions yet.</Empty> : rows.map((r) => (
        <MiniRow key={r.questionType} ring={r.accuracy} color={toneColor(r.accuracy)} title={QT[r.questionType] ?? r.questionType} subtitle={`${r.answered} answered · avg ${fmtSec(r.avgSeconds)}`} value={`${r.accuracy}%`} />
      ))}
    </InsightCard>
  );
}

export function SectionOrderCard({ rows }: { rows: SubjectOrderRow[] }) {
  const top = rows[0], mx = Math.max(...rows.map((r) => r.correctPerMinute), 0.1);
  return (
    <InsightCard title="Which section to start with" sub="Correct answers per minute on each subject">
      {!top ? <Empty>Answer some questions to see this.</Empty> : (<>
        <p className="mb-4 rounded-2xl bg-[#EEF2FF] px-3.5 py-3 text-[14px] font-semibold leading-relaxed text-[#31407F]">Start with <strong className="font-extrabold" style={{ color: subjectTone(top.subject) }}>{top.subject}</strong>, where you get the most right per minute.</p>
        {rows.map((r, i) => {
          const c = subjectTone(r.subject);
          return (
            <div key={r.subject} className="flex items-center gap-3 border-t border-[rgba(0,51,102,.08)] py-2.5 first:border-t-0 first:pt-0">
              <div className={`${HEAD} flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[16px] font-extrabold`} style={i === 0 ? { background: c, color: '#fff' } : { background: `${c}1A`, color: c }}>{i + 1}</div>
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex justify-between gap-2"><span className="truncate text-[13.5px] font-bold" style={{ color: i === 0 ? c : INK }}>{r.subject}</span><span className="shrink-0 text-[12px] font-extrabold tabular-nums" style={{ color: c }}>{r.correctPerMinute}/min</span></div>
                <Meter pct={(r.correctPerMinute / mx) * 100} color={i === 0 ? c : '#B9C6F5'} />
              </div>
            </div>
          );
        })}
      </>)}
    </InsightCard>
  );
}

export function PracticeLink({ href, label }: { href: string; label: string }) {
  return <Link href={href} className={btn}>{label}</Link>;
}

export function CarelessCard({ careless: c }: { careless: CarelessSummary }) {
  const color = c.carelessPct >= 30 ? BAD : WARN;
  return (
    <InsightCard title="Careless mistakes" sub="Wrong answers where you answered in under half your usual time">
      {c.totalWrong === 0 ? <Empty>No wrong answers recorded yet.</Empty> : (<>
        <RingStat pct={c.carelessPct} color={color} label={`${c.carelessPct}%`} big={<>{c.carelessCount} <span className="text-[13px] font-bold text-[#5A6B8C]">careless</span></>} small={`out of ${c.totalWrong} wrong. Slow down, you likely knew these.`} />
        {c.topTopics.length > 0 && (<><p className={`${kicker} mb-1`}>Most careless in</p>
          <Split rows={c.topTopics.map((t): [string, ReactNode] => [t.topic, <span key={t.topic} style={{ color: subjectTone(t.subject) }}>{t.subject} · {t.count}×</span>])} /></>)}
      </>)}
    </InsightCard>
  );
}

export function GuessingCard({ guessing: g }: { guessing: GuessingAnalysis }) {
  const high = g.guessPct >= 15, color = high ? BAD : GOOD;
  return (
    <InsightCard title="Guessing frequency" sub="Answers submitted in under 20 seconds">
      {g.totalAnswered === 0 ? <Empty>No answered questions yet.</Empty> : (<>
        <RingStat pct={g.guessPct} color={color} label={`${g.guessPct}%`} big={<>{g.guessCount} <span className="text-[13px] font-bold text-[#5A6B8C]">guesses</span></>} small={`of ${g.totalAnswered} answered`} />
        <div className="flex gap-3">
          <div className="flex-1 rounded-2xl bg-[#FDE6E8] px-2.5 py-3 text-center"><div className={`${HEAD} text-[24px] font-extrabold tabular-nums text-[#C8202F]`}>{g.wrongGuesses}</div><div className="text-[11.5px] font-bold text-[#31407F]">wrong guesses</div></div>
          <div className="flex-1 rounded-2xl bg-[#E3F6E8] px-2.5 py-3 text-center"><div className={`${HEAD} text-[24px] font-extrabold tabular-nums text-[#15803D]`}>{g.rightGuesses}</div><div className="text-[11.5px] font-bold text-[#31407F]">lucky guesses</div></div>
        </div>
        <p className="mt-3.5 text-[11.5px] font-medium leading-relaxed text-[#5A6B8C]">{high ? 'High guessing rate. Skip or mark for review instead, since wrong guesses cost negative marks.' : 'Guessing rate is fine. Keep skipping questions you are unsure about.'}</p>
      </>)}
    </InsightCard>
  );
}

export const KIND = { danger: ['bg-[#FDE6E8]', 'bg-[#C8202F]'], warn: ['bg-[#FFF3C4]', 'bg-[#B45309]'], ok: ['bg-[#E3F6E8]', 'bg-[#15803D]'] } as const;

export function ImprovementCard({ cutoffs, subjectOrder, projection }: { cutoffs: CutoffData | null; subjectOrder: SubjectOrderRow[]; projection: ProjectionData }) {
  if (!cutoffs?.lines || subjectOrder.length === 0) return <InsightCard title="What to improve" sub="Personalised roadmap to clear the cutoff"><Empty>Submit a mock to see your improvement roadmap.</Empty></InsightCard>;
  const worst = cutoffs.lines.filter((l: CutoffRow) => l.status === 'below').sort((a: CutoffRow, b: CutoffRow) => b.gapPct - a.gapPct)[0];
  const weak = [...subjectOrder].sort((a, b) => a.accuracy - b.accuracy)[0], strong = subjectOrder[0];
  const items: Array<{ icon: GlyphName; text: string; kind: keyof typeof KIND }> = [];
  if (worst) items.push({ icon: 'target', text: `You are ${worst.gapPct} pts below the ${worst.label} cutoff (${worst.cutoffPct}%). That is the gap to close.`, kind: 'danger' });
  if (weak) items.push({ icon: 'trend', text: `${weak.subject} is your weakest at ${weak.accuracy}% accuracy. Bringing it to 60%+ has the biggest impact.`, kind: 'warn' });
  if (strong && strong.subject !== weak?.subject) items.push({ icon: 'bolt', text: `You are most efficient in ${strong.subject}. Start with it in the exam to bank marks early.`, kind: 'ok' });
  if ('trendPerMock' in projection && projection.trendPerMock < 0) items.push({ icon: 'alert', text: 'Your scores are trending down. Address this now.', kind: 'danger' });
  if (items.length === 0) items.push({ icon: 'check', text: 'You are above all published cutoff lines. Keep the momentum.', kind: 'ok' });
  return (
    <InsightCard title="What to improve" sub="Personalised roadmap based on your mock data">
      <div className="flex flex-col gap-3">
        {items.map((it, i) => (
          <div key={i} className={`flex items-start gap-3 rounded-2xl px-3 py-3 ${KIND[it.kind][0]}`}>
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-white ${KIND[it.kind][1]}`}><Glyph name={it.icon} size={17} /></span>
            <p className="pt-0.5 text-[13px] font-semibold leading-relaxed text-[#31407F]">{it.text}</p>
          </div>
        ))}
      </div>
    </InsightCard>
  );
}

export function CrackabilityCard({ projection: p, cutoffs, examType }: { projection: ProjectionData; cutoffs: CutoffData | null; examType: string | null }) {
  const label = examType === 'NEET' ? 'NEET' : examType === 'Advanced' ? 'JEE Advanced' : 'JEE Main';
  if (!p.available) return <InsightCard title={`Can I crack ${label}?`} sub="Based on your mock performance trend"><Empty>Take at least 2 mocks to get a verdict. You have {p.mocks} so far.</Empty></InsightCard>;
  const low = cutoffs?.lines ? Math.min(...cutoffs.lines.map((l: CutoffRow) => l.cutoffPct)) : null;
  const above = low !== null && p.expected >= low, down = p.trendPerMock < -1, up = p.trendPerMock > 0;
  const gap = low !== null ? Math.round(low - p.expected) : null;
  let verdict: string, vc: string, vb: string, detail: string, icon: GlyphName;
  if (above) { verdict = 'On track'; vc = GOOD; vb = '#E3F6E8'; icon = 'check'; detail = `Projected ${p.expected}% is above the ${low}% cutoff. Maintain consistency.`; }
  else if (down) { verdict = 'At risk'; vc = BAD; vb = '#FDE6E8'; icon = 'alert'; detail = `Scores declining (${p.trendPerMock}/mock). Reverse the trend${gap !== null ? ` and close a ${gap}-pt gap` : ''}.`; }
  else if (up && gap !== null) { verdict = 'Improving'; vc = WARN; vb = '#FFF3C4'; icon = 'trend'; detail = `${gap} pts below cutoff, improving by ${p.trendPerMock}/mock. About ${gap > 0 ? Math.ceil(gap / Math.max(p.trendPerMock, 0.5)) : 0} more mocks at this rate.`; }
  else { verdict = 'Keep going'; vc = WARN; vb = '#FFF3C4'; icon = 'clock'; detail = gap !== null ? `${gap} pts below the cutoff. Projected ${p.expected}%. Needs consistent practice.` : `Projected ${p.expected}%. Take more mocks to refine.`; }
  return (
    <InsightCard title={`Can I crack ${label}?`} sub="Projected score vs published cutoff">
      <div className="mb-4 flex items-start gap-3.5 rounded-3xl px-4 py-3.5" style={{ background: vb }}>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white" style={{ background: vc }}><Glyph name={icon} size={22} /></span>
        <div className="min-w-0"><div className={`${HEAD} text-[22px] font-extrabold leading-tight`} style={{ color: vc }}>{verdict}</div><p className="mt-1 text-[13px] font-semibold leading-relaxed text-[#31407F]">{detail}</p></div>
      </div>
      {low !== null && (<>
        <Meter pct={p.expected} color={vc} mark={low} h="h-3" />
        <div className="mt-1.5 flex justify-between text-[11px] font-semibold text-[#5A6B8C]"><span>Projected: <strong style={{ color: vc }}>{p.expected}%</strong></span><span>Cutoff: <strong className="text-[#31407F]">{low}%</strong></span></div>
      </>)}
      <div className="mt-2.5 text-[11.5px] font-semibold text-[#7A87A0]">{plural(p.mocks, 'mock')}, trend {p.trendPerMock >= 0 ? '+' : ''}{p.trendPerMock} per mock</div>
    </InsightCard>
  );
}
