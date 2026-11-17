'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { isAuthenticated, getUser } from '@/lib/auth';
import type {
  DashboardData, MockWeakTopic, LeaderboardData, MockInsights, TopicStat,
  CarelessSummary, CutoffData, CutoffRow, GuessingAnalysis, NegativeSummary,
  ProjectionData, StandingData, SubjectOrderRow, TimeByTypeRow,
} from '@/types';

/* Palette (unchanged) */
const NAVY = '#003366', PURPLE = '#803688', GOOD = '#15803D', WARN = '#B45309', BAD = '#C8202F';
const PLATFORM = '#97A3D4', MUTE = '#5A6B8C', FAINT = '#7A87A0', INK = '#31407F', TRACK = '#EEF2FF';
const QT: Record<string, string> = { mcq_single: 'Single correct', mcq_multi: 'Multi-correct', integer: 'Integer', matrix_match: 'Matrix Match' };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const HEAD = 'font-display';
const glass = 'min-w-0 rounded-[28px] border border-[#003366]/10 bg-white/85 shadow-[0_24px_60px_-34px_rgba(0,51,102,.45)] backdrop-blur-xl';
const kicker = 'text-[12px] font-semibold text-[#7A87A0]';
const h2c = `${HEAD} text-[21px] font-extrabold leading-tight tracking-[-0.01em] text-[#003366]`;
const btn = 'inline-flex items-center justify-center gap-2 rounded-full bg-[#803688] px-5 py-2.5 text-[13px] font-bold text-white no-underline shadow-[0_10px_24px_-10px_rgba(128,54,136,.8)] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none';
const skel = 'animate-pulse rounded-[28px] bg-[#EEF2FF] motion-reduce:animate-none';
const MASONRY = 'columns-1 gap-4 md:columns-2 2xl:columns-3 [column-fill:balance]';

interface LaggingRow { key: string; topic: string; pct: number }
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;
const fmtSec = (t: number) => (t < 60 ? `${Math.round(t)}s` : `${Math.floor(t / 60)}m ${Math.round(t % 60)}s`);
const groupOf = (s: string) => (s === 'Botany' || s === 'Zoology' ? 'Biology' : s);
const rawSubjectsOf = (g: string) => (g === 'Biology' ? ['Botany', 'Zoology', 'Biology'] : [g]);
export function toneColor(pct: number) { return pct >= 60 ? GOOD : pct >= 40 ? WARN : BAD; }
const SUBJECT_TONE: Record<string, string> = { Physics: '#2A4FD6', Chemistry: '#803688', Mathematics: '#2E9E5B', Biology: '#1E8A66', Botany: '#1E8A66', Zoology: '#0F766E' };
export function subjectTone(s: string) { return SUBJECT_TONE[s] ?? MUTE; }

type GlyphName = 'target' | 'trend' | 'bolt' | 'alert' | 'check' | 'clock';
function Glyph({ name, size = 18 }: { name: GlyphName; size?: number }) {
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

function Meter({ pct, color, mark, h = 'h-2' }: { pct: number; color: string; mark?: number; h?: string }) {
  return (
    <span className={`relative block ${h} w-full rounded-full bg-[#EEF2FF]`}>
      <span className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }} />
      {mark != null && mark <= 100 && <span className="absolute -inset-y-1 w-[3px] -translate-x-1/2 rounded-sm bg-[#003366]" style={{ left: `${mark}%` }} />}
    </span>
  );
}

function InsightCard({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) {
  return (
    <section className={`${glass} mb-4 flex break-inside-avoid flex-col p-5`}>
      <h3 className={`${HEAD} text-[17px] font-extrabold leading-tight text-[#003366]`}>{title}</h3>
      {sub && <p className="mt-1 text-[12.5px] leading-snug text-[#5A6B8C]">{sub}</p>}
      <div className="mt-4 flex flex-1 flex-col">{children}</div>
    </section>
  );
}

const Empty = ({ children }: { children: ReactNode }) => <p className="text-[13px] font-medium leading-relaxed text-[#5A6B8C]">{children}</p>;
const Split = ({ rows }: { rows: Array<[string, ReactNode]> }) => (
  <>{rows.map(([l, v]) => (<div key={l} className="flex justify-between gap-3 border-t border-[rgba(0,51,102,.08)] py-2 text-[12.5px]"><span className="font-semibold text-[#5A6B8C]">{l}</span><span className="font-extrabold text-[#31407F]">{v}</span></div>))}</>
);
const RingStat = ({ pct, color, label, big, small }: { pct: number; color: string; label: ReactNode; big: ReactNode; small?: ReactNode }) => (
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

const MiniRow = ({ ring, color, title, subtitle, subColor, value }: { ring: number; color: string; title: string; subtitle: string; subColor?: string; value: string }) => (
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

const KIND = { danger: ['bg-[#FDE6E8]', 'bg-[#C8202F]'], warn: ['bg-[#FFF3C4]', 'bg-[#B45309]'], ok: ['bg-[#E3F6E8]', 'bg-[#15803D]'] } as const;

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

/* ── Motion kit: one page-load sequence + responses to taps ───────── */
const Style = () => (
  <style>{`
@keyframes dz-rise{from{opacity:0;transform:translateY(20px) scale(.98)}to{opacity:1;transform:none}}
@keyframes dz-grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes dz-slide{from{width:0}}
@keyframes dz-pop{0%{opacity:0;transform:scale(.55)}70%{transform:scale(1.07)}100%{opacity:1;transform:scale(1)}}
@keyframes dz-ping{0%{box-shadow:0 0 0 0 rgba(128,54,136,.55)}100%{box-shadow:0 0 0 14px rgba(128,54,136,0)}}
.dz-rise{animation:dz-rise .75s cubic-bezier(.2,.8,.2,1) both}
.dz-stagger>*{animation:dz-rise .65s cubic-bezier(.2,.8,.2,1) both}
.dz-stagger>*:nth-child(2){animation-delay:.07s}.dz-stagger>*:nth-child(3){animation-delay:.14s}.dz-stagger>*:nth-child(4){animation-delay:.21s}.dz-stagger>*:nth-child(5){animation-delay:.28s}.dz-stagger>*:nth-child(6){animation-delay:.35s}
.dz-grow{transform-origin:bottom;animation:dz-grow .9s cubic-bezier(.2,.8,.2,1) both}
.dz-pop{animation:dz-pop .55s cubic-bezier(.2,.9,.3,1.2) both}
.dz-ping{animation:dz-ping 1.8s ease-out infinite}
@media (prefers-reduced-motion:reduce){.dz-rise,.dz-stagger>*,.dz-grow,.dz-pop,.dz-ping{animation:none!important}}
`}</style>
);

function useCountUp(to: number, ms = 1000) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(to); return; }
    let raf = 0, t0 = 0;
    const step = (t: number) => { if (!t0) t0 = t; const k = Math.min(1, (t - t0) / ms); setV(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, ms]);
  return v;
}
function Count({ to, suffix = '' }: { to: number; suffix?: string }) { const v = useCountUp(to); return <>{v}{suffix}</>; }
function useMounted() { const [m, setM] = useState(false); useEffect(() => { const id = requestAnimationFrame(() => setM(true)); return () => cancelAnimationFrame(id); }, []); return m; }

const Head = ({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) => (
  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
    <div><h2 className={h2c}>{title}</h2>{sub && <p className="mt-1 text-[13px] text-[#5A6B8C]">{sub}</p>}</div>{right}
  </div>
);

/* Road to the cutoff: the memorable moment of the insights */
function Road({ p, cutoffs }: { p: ProjectionData; cutoffs: CutoffData | null }) {
  const on = useMounted();
  const lines = cutoffs?.lines ?? [];
  return (
    <section className={`${glass} dz-rise p-5 sm:p-7`}>
      <Head title="Road to the cutoff" sub={p.available ? `You are projected at ${p.expected}%, give or take ${Math.round((p.high - p.low) / 2)}` : 'Take two or more mocks to place yourself on the road'} />
      <div className="relative mb-14 mt-14 h-4 rounded-full bg-gradient-to-r from-[#FDE6E8] via-[#FFF3C4] to-[#D6F2DD]">
        {p.available && <div className="absolute inset-y-0 rounded-full bg-[#803688]/25" style={{ left: `${p.low}%`, width: `${Math.max(2, p.high - p.low)}%` }} />}
        {lines.map((l: CutoffRow, i) => (
          <div key={l.label} className="absolute top-0 -translate-x-1/2" style={{ left: `${Math.min(100, l.cutoffPct)}%` }}>
            <div className="mx-auto h-9 w-[3px] rounded bg-[#003366]" style={{ marginTop: -10 }} />
            <p className="mt-1 whitespace-nowrap text-center text-[11px] font-bold text-[#003366]" style={{ transform: `translateY(${(i % 2) * 18}px)` }}>{l.label} {l.cutoffPct}%</p>
          </div>
        ))}
        {p.available && (
          <div className="absolute -top-[22px] -translate-x-1/2" style={{ left: `${on ? Math.min(100, Math.max(0, p.expected)) : 0}%`, transition: 'left 1.4s cubic-bezier(.2,.8,.2,1)' }}>
            <div className="dz-ping grid h-14 w-14 place-items-center rounded-full border-4 border-white bg-[#803688] text-[13px] font-extrabold text-white shadow-lg">{p.expected}%</div>
          </div>
        )}
      </div>
      <div className="flex justify-between text-[11px] font-semibold text-[#7A87A0]"><span>0%</span><span>100%</span></div>
    </section>
  );
}

function TopicMap({ topics }: { topics: TopicStat[] }) {
  const seen = new Set<string>();
  const all = topics.filter((t) => { const k = `${t.subject}|${t.topic}`; if (seen.has(k) || t.accuracy == null) return false; seen.add(k); return true; });
  const mx = Math.max(...all.map((t) => t.attempts), 1);
  return (
    <section className={`${glass} p-5 sm:p-6`}>
      <Head title="Topic map" sub="Every topic you have answered. Bigger means more attempts, colour shows accuracy" right={
        <div className="flex items-center gap-3 text-[12px] font-semibold text-[#5A6B8C]">{[['Strong', GOOD], ['Borderline', WARN], ['Weak', BAD]].map(([l, c]) => <span key={l} className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />{l}</span>)}</div>
      } />
      {all.length === 0 ? <Empty>Answer questions in a mock to fill the map.</Empty> : (
        <div className="flex flex-wrap items-center gap-2.5">
          {all.map((t, i) => {
            const c = toneColor(t.accuracy ?? 0);
            return (
              <span key={`${t.subject}|${t.topic}`} title={`${t.subject} · ${t.attempts} answered`} className="dz-pop cursor-default rounded-full border px-3.5 py-1.5 font-bold transition-transform duration-150 hover:-translate-y-1 hover:scale-105" style={{ color: c, borderColor: `${c}55`, background: `${c}14`, fontSize: 12 + (t.attempts / mx) * 5, animationDelay: `${Math.min(i, 30) * 40}ms` }}>
                {t.topic} <span className="ml-1 tabular-nums opacity-80">{t.accuracy}%</span>
              </span>
            );
          })}
        </div>
      )}
    </section>
  );
}

const TABS = [['where', 'Where you stand'], ['topics', 'Topics'], ['habits', 'Habits'], ['time', 'Time and trends']] as const;

/* ── Page ─────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [mockWeakTopics, setMockWeakTopics] = useState<MockWeakTopic[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [insights, setInsights] = useState<MockInsights | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number][0]>('where');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setUser(getUser());
    if (!isAuthenticated()) { router.push('/login'); return; }
    Promise.all([
      api.dashboard.data(),
      api.stats.mockWeakAreas().catch(() => [] as MockWeakTopic[]),
      api.stats.leaderboard().catch(() => null),
      api.stats.mockInsights().catch(() => null),
    ])
      .then(([d, w, lb, ins]) => { if (cancelled) return; setData(d); setMockWeakTopics(w); setLeaderboard(lb); setInsights(ins); })
      .catch((e: Error) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [router]);

  const accuracy = data?.stats.accuracy ?? 0;
  const totalAttempts = data?.stats.totalAttempts ?? 0;
  const hasActivity = totalAttempts > 0;
  const isFreshUser = !loading && totalAttempts === 0 && mockWeakTopics.length === 0;
  const examType = data?.overall.examType ?? (user?.targetExam === 'NEET' ? 'NEET' : user?.targetExam === 'Advanced' ? 'Advanced' : 'Main');
  const examIsNEET = examType === 'NEET';
  const SUBJECTS: readonly string[] = examIsNEET ? ['Physics', 'Chemistry', 'Biology'] : ['Physics', 'Chemistry', 'Mathematics'];
  const first = (user as { name?: string } | null)?.name?.split(' ')[0];

  const weakBySubject: Record<string, MockWeakTopic[]> = {};
  for (const t of mockWeakTopics) (weakBySubject[t.subject] ??= []).push(t);
  const laggingTopics = (g: string): LaggingRow[] =>
    mockWeakTopics.filter((t) => groupOf(t.subject) === g).map((t) => ({ key: `${t.subject}|${t.topic}`, topic: t.topic, pct: t.successRate })).sort((a, b) => a.pct - b.pct);
  const lbData = leaderboard?.[examType] ?? null;

  function buildPracticeUrl(subject: string): string {
    const base = ['Botany', 'Zoology', 'Biology'].includes(subject) ? '/neet/practice' : '/practice';
    const map: Record<string, string[]> = {};
    for (const raw of rawSubjectsOf(subject)) { const ts = weakBySubject[raw]?.map((t) => t.topic) ?? []; if (ts.length) map[raw] = ts; }
    const subjects = Object.keys(map);
    if (!subjects.length) return base;
    return `${base}?mode=mock_weak&weakData=${encodeURIComponent(JSON.stringify({ subjects, topics: map }))}`;
  }
  function revisePracticeUrl(topics: TopicStat[]): string {
    const by: Record<string, string[]> = {};
    for (const t of topics) (by[t.subject] ??= []).push(t.topic);
    return `${examIsNEET ? '/neet/practice' : '/practice'}?mode=mock_weak&weakData=${encodeURIComponent(JSON.stringify({ subjects: Object.keys(by), topics: by }))}`;
  }

  const history = data?.history ?? [];
  const week = data?.weeklyStats ?? [];
  const wmax = Math.max(...week.map((d) => d.total), 1);
  const wTotal = week.reduce((a, d) => a + d.total, 0), wCorrect = week.reduce((a, d) => a + d.correct, 0);
  const level = Math.floor(totalAttempts / 25) + 1, xp = totalAttempts % 25;
  const practiceHref = user?.targetExam === 'NEET' ? '/neet/practice' : '/practice';
  const ins = !loading && insights && insights.examsAnalysed > 0 ? insights : null;
  const steps = [
    { title: 'Pick subjects and topics', text: examIsNEET || user?.targetExam === 'NEET' ? 'Choose from Physics, Chemistry, Botany and Zoology.' : 'Choose from Physics, Chemistry and Mathematics.' },
    { title: 'Answer one question at a time', text: 'Get instant feedback and a full explanation.' },
    { title: 'Watch your weak areas appear', text: 'Topics under 60% accuracy are flagged here automatically.' },
  ];

  return (
    <div className="app-wide relative isolate min-h-full w-full font-dm text-[#003366]">
      <Style />



      <div className="relative mx-auto flex w-full flex-col gap-6 px-1 pb-10 sm:px-2 xl:gap-8">
        {error && <div role="alert" className="rounded-2xl border border-[#F4C7C7] bg-[#FEF2F2] px-4 py-3 text-[13px] font-semibold text-[#B42318]">{error}</div>}

        {/* Hero: white panel with the landing page's blob at the bottom right */}
        <section className="dz-rise relative overflow-hidden rounded-[36px] border border-[#003366]/10 bg-white p-6 text-[#003366] sm:p-8 xl:p-10">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <svg viewBox="0 0 900 700" preserveAspectRatio="xMaxYMax slice" className="absolute bottom-[-10%] right-0 h-[76%] w-[min(66%,700px)]">
              <defs>
                <linearGradient id="hero-blob-fill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="1" stopColor="#803688" stopOpacity="0.20" />
                  <stop offset="0.5" stopColor="#803688" stopOpacity="0.12" />
                  <stop offset="1" stopColor="#B98CBE" stopOpacity="0.18" />
                </linearGradient>
              </defs>
              <path
                d="M1000 700 L1000 150 C946 92 862 62 772 78 C668 97 596 172 528 246 C462 318 396 378 310 414 C214 455 132 508 84 578 C52 626 30 668 24 700 Z"
                fill="url(#hero-blob-fill)"
              />
            </svg>
          </div>
          {isFreshUser ? (
            <div className="relative flex flex-wrap items-center gap-6">
              <div className="min-w-0 flex-1 basis-[280px]">
                <h1 className={`${HEAD} text-[clamp(26px,3.2vw,42px)] font-extrabold leading-tight tracking-[-0.02em] text-[#003366]`}>{first ? `Welcome, ${first}. ` : ''}Your first mock lights this up.</h1>
                <p className="mt-3 max-w-[54ch] text-[14.5px] leading-relaxed text-[#5A6B8C]">Accuracy, weak topics and your rank appear here as soon as you answer questions.</p>
              </div>
              <Link href="/mock" className={btn}>Take a mock test</Link>
            </div>
          ) : (
            <div className="relative grid items-center gap-8 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
              <Ring pct={accuracy} color={accuracy >= 60 ? GOOD : WARN} size={156} stroke={15} track="rgba(0,51,102,.1)">
                <div className="text-center"><div className={`${HEAD} text-[38px] font-extrabold leading-none tabular-nums text-[#003366]`}><Count to={accuracy} suffix="%" /></div><div className="mt-1 text-[11px] font-semibold text-[#7A87A0]">accuracy</div></div>
              </Ring>
              <div className="min-w-0">
                <h1 className={`${HEAD} text-[clamp(24px,2.8vw,38px)] font-extrabold leading-tight tracking-[-0.02em] text-[#003366]`}>{first ? `Hi ${first}, ` : ''}{!hasActivity ? 'ready for your first session?' : accuracy >= 60 ? 'you are above the 60% line.' : `you are ${60 - accuracy} points from the 60% line.`}</h1>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#FDBA74] px-3 py-1 text-[12px] font-extrabold text-[#003366]">Level {level}</span>
                  <div className="h-2.5 w-full max-w-[300px] flex-1 overflow-hidden rounded-full bg-[#EEF2FF]"><div className="h-full rounded-full bg-gradient-to-r from-[#FDBA74] to-[#F9A8D4]" style={{ width: `${(xp / 25) * 100}%`, animation: 'dz-slide 1.4s cubic-bezier(.2,.8,.2,1) both' }} /></div>
                  <span className="text-[12px] text-[#5A6B8C]">{25 - xp} more questions to level {level + 1}</span>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 max-sm:grid-cols-1">
                  {[['Questions done', totalAttempts, `${data?.stats.correctAttempts ?? 0} correct`], ['Weak areas', mockWeakTopics.length, mockWeakTopics.length ? 'Topics under 60%' : 'None flagged'], ['Mocks taken', history.length, history.length ? `Latest ${history[history.length - 1]!.pct}%` : 'None yet']].map(([l, v, s], i) => (
                    <div key={String(l)} className="dz-pop rounded-2xl border border-[#003366]/10 bg-[rgba(238,242,255,.72)] px-4 py-3 backdrop-blur transition-transform hover:-translate-y-1" style={{ animationDelay: `${300 + i * 120}ms` }}>
                      <p className="text-[12px] font-semibold text-[#7A87A0]">{l}</p><p className={`${HEAD} mt-1 text-[28px] font-extrabold leading-none tabular-nums text-[#003366]`}>{loading ? '–' : <Count to={Number(v)} />}</p><p className="mt-1 text-[12px] text-[#5A6B8C]">{loading ? ' ' : s}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <Link href={practiceHref} className={btn}>Practice now</Link>
                <Link href="/mock" className="inline-flex items-center justify-center rounded-[14px] border-2 border-[#003366] bg-white px-5 py-2.5 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_6px_0_rgba(0,51,102,.22)] transition-[transform,box-shadow] duration-150 hover:-translate-y-[3px] hover:shadow-[0_9px_0_rgba(0,51,102,.22)] active:translate-y-[4px] active:shadow-[0_2px_0_rgba(0,51,102,.22)] motion-reduce:transition-none">Take a mock</Link>
              </div>
            </div>
          )}
        </section>

        {/* Week as a habit tracker + mock scoreboard */}
        <div className="grid gap-5 xl:grid-cols-12 xl:gap-6">
          <section className={`${glass} flex flex-col p-5 sm:p-6 xl:col-span-7`}>
            <Head title="This week" sub={loading ? ' ' : `${wTotal} attempted, ${wCorrect} correct${wTotal ? ` (${Math.round((wCorrect / wTotal) * 100)}%)` : ''}`} right={<div className="flex items-center gap-4 text-[12px] font-semibold text-[#5A6B8C]"><span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#803688]" />Correct</span><span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#C9D2F3]" />Attempted</span></div>} />
            {loading ? <div className={`${skel} h-[260px]`} /> : week.length === 0 ? <p className="py-12 text-center text-[13px] text-[#7A87A0]">No activity yet this week</p> : (
              <div className="flex flex-1 items-end gap-2 pt-4 sm:gap-4">
                {week.map((d, i) => {
                  const today = i === week.length - 1, hpx = d.total === 0 ? 8 : Math.max(24, Math.round((d.total / wmax) * 180));
                  return (
                    <div key={d.date} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
                      <span className="h-4 text-[11px] font-bold tabular-nums text-[#5A6B8C]">{d.total > 0 ? `${d.correct}/${d.total}` : ''}</span>
                      <div className={`dz-grow relative w-full max-w-[60px] overflow-hidden rounded-2xl bg-[#C9D2F3] ${today && d.total > 0 ? 'dz-ping' : ''}`} style={{ height: hpx, animationDelay: `${i * 90}ms` }}>
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#803688] to-[#B05CB8]" style={{ height: `${d.total ? (d.correct / d.total) * 100 : 0}%` }} />
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${today ? 'bg-[#003366] text-white' : 'text-[#7A87A0]'}`}>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(d.date + 'T00:00:00').getDay()]}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className={`${glass} flex flex-col p-5 sm:p-6 xl:col-span-5`}>
            <Head title="Mock scoreboard" sub="Each mock against the one before it" right={<span className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#5A6B8C]"><i className="h-0 w-5 border-t-2 border-dashed border-[#003366]/40" />60% target</span>} />
            <div className="flex flex-1 items-center">
              {loading ? <div className={`${skel} h-[240px] w-full`} /> : history.length > 0 ? (
                <div className="w-full overflow-x-auto pb-1">
                  <div className="relative mx-auto flex h-[250px] items-end gap-3" style={{ minWidth: history.length * 56 }}>
                    <div aria-hidden className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-[#003366]/25" style={{ bottom: 'calc(34px + (100% - 62px) * .6)' }} />
                    {history.map((h, i) => {
                      const dl = i > 0 ? h.pct - history[i - 1]!.pct : null;
                      return (
                        <div key={h.date} className="flex h-full min-w-[44px] flex-1 flex-col items-center justify-end gap-1">
                          <span className="text-[11px] font-bold tabular-nums" style={{ color: dl == null ? FAINT : dl >= 0 ? GOOD : BAD }}>{dl == null ? ' ' : `${dl >= 0 ? '+' : ''}${dl}`}</span>
                          <div className="dz-grow w-full max-w-[44px] rounded-t-2xl bg-gradient-to-t from-[#803688] to-[#B98CBE] transition-transform hover:scale-y-[1.04]" style={{ height: `calc((100% - 62px) * ${Math.max(2, Math.min(100, h.pct)) / 100})`, animationDelay: `${i * 110}ms` }} title={`${h.pct}%`} />
                          <span className="text-[11px] font-bold tabular-nums" style={{ color: h.pct >= 60 ? NAVY : BAD }}>{h.pct}%</span>
                          <span className="text-[10.5px] font-semibold text-[#7A87A0]">{new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : <p className="w-full py-8 text-center text-[13px] text-[#7A87A0]">Submit a mock test to see your score history</p>}
            </div>
          </section>
        </div>

        {/* Subjects: colour-blocked tiles */}
        <section className="relative overflow-hidden rounded-[36px] border border-[#003366]/10 bg-gradient-to-b from-white via-white to-[#EEF2FF] p-6 sm:p-8">
          <Head title="Where you stand" sub="You against the platform and the top scorers" />
          {loading ? (
            <div className="grid gap-4 md:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className={`${skel} h-[400px]`} />)}</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {SUBJECTS.map((subject) => {
                const st = lbData?.[subject];
                const fl = (v: number | null | undefined) => (v == null ? null : Math.max(0, v));
                const mine = fl(st?.mine), lag = laggingTopics(subject), sc = subjectTone(subject);
                return (
                  <div key={subject} className="relative flex flex-col overflow-hidden rounded-[32px] border border-[#003366]/10 bg-white p-6 text-[#003366] shadow-[0_26px_50px_-30px_rgba(0,51,102,.4)]">
                    <svg aria-hidden viewBox="0 0 900 700" preserveAspectRatio="xMaxYMax slice" className="pointer-events-none absolute bottom-[-16%] right-0 h-[88%] w-[min(96%,540px)]">
                      <defs>
                        <linearGradient id={`card-blob-${subject}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0" stopColor={sc} stopOpacity="0.34" />
                          <stop offset="0.5" stopColor={sc} stopOpacity="0.16" />
                          <stop offset="1" stopColor={sc} stopOpacity="0.28" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M1000 700 L1000 150 C946 92 862 62 772 78 C668 97 596 172 528 246 C462 318 396 378 310 414 C214 455 132 508 84 578 C52 626 30 668 24 700 Z"
                        fill={`url(#card-blob-${subject})`}
                      />
                    </svg>
                    <span aria-hidden className={`${HEAD} pointer-events-none absolute -bottom-10 -right-3 text-[170px] font-extrabold leading-none text-[rgba(0,51,102,.05)]`}>{subject[0]}</span>
                    <div className="relative flex items-center justify-between gap-3">
                      <div className="min-w-0"><h3 className={`${HEAD} text-[24px] font-extrabold`}>{subject}</h3><p className="mt-0.5 text-[12.5px] text-[#5A6B8C]">{lag.length ? plural(lag.length, 'lagging topic') : 'No lagging topics'}</p></div>
                      <Ring pct={mine ?? 0} color={sc} size={84} stroke={9} track="rgba(0,51,102,.1)"><span className={`${HEAD} text-[17px] font-extrabold tabular-nums`}>{mine != null ? <Count to={mine} suffix="%" /> : '—'}</span></Ring>
                    </div>
                    <div className="relative mt-5 flex flex-col gap-2.5">
                      {[['You', mine], ['Platform', fl(st?.avg)], ['Top scorers', fl(st?.topAvg)]].map(([l, v]) => (
                        <div key={String(l)} className="grid grid-cols-[84px_1fr_40px] items-center gap-3 text-[12.5px]"><span className="text-[#5A6B8C]">{l}</span><span className="h-1.5 overflow-hidden rounded-full bg-[rgba(0,51,102,.08)]"><span className="block h-full rounded-full" style={{ width: `${Number(v ?? 0)}%`, background: sc }} /></span><span className="text-right font-bold tabular-nums text-[#003366]">{v != null ? `${v}%` : '—'}</span></div>
                      ))}
                    </div>
                    <p className="relative mt-5 text-[12px] font-semibold text-[#5A6B8C]">Lagging topics</p>
                    <div className="relative mt-2 flex h-[132px] flex-wrap content-start gap-2 overflow-y-auto pr-1">
                      {lag.length === 0 ? <p className="text-[12.5px] leading-relaxed text-[#5A6B8C]">Topics under 60% in your mocks will show here.</p> : lag.map((r) => <span key={r.key} className="rounded-full bg-[rgba(0,51,102,.06)] px-3 py-1.5 text-[12px] font-semibold transition-colors hover:bg-[rgba(0,51,102,.1)]">{r.topic} <b className="ml-0.5 tabular-nums">{r.pct}%</b></span>)}
                    </div>
                    {lag.length > 0 && <Link href={buildPracticeUrl(subject)} className="relative mt-4 inline-flex self-start rounded-full bg-[#803688] px-5 py-2.5 text-[13px] font-bold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[4px] active:shadow-[0_1px_0_#5A2560] motion-reduce:transition-none">Practice {subject}</Link>}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Insights */}
        {ins && (
          <section>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div><h2 className={`${HEAD} text-[26px] font-extrabold tracking-[-0.02em]`}>Mock insights</h2><p className="mt-1 text-[13px] text-[#5A6B8C]">{plural(ins.examsAnalysed, 'mock')} analysed. Built only from your submitted mocks.</p></div>
              <div role="tablist" className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-[#003366]/10 bg-white/85 p-1 backdrop-blur-xl">
                {TABS.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-bold transition-all duration-200 ${tab === k ? 'bg-[#003366] text-white shadow-md' : 'text-[#5A6B8C] hover:bg-[#EEF2FF]'}`}>{l}</button>)}
              </div>
            </div>
            <div key={tab} className="flex flex-col gap-4">
              {tab === 'where' && (<>
                <Road p={ins.projection} cutoffs={ins.cutoffs} />
                <div className={`dz-stagger ${MASONRY}`}>
                  <StandingCard standing={ins.standing} />
                  <CutoffCard cutoffs={ins.cutoffs} scoreLabel="Your average" />
                  <CrackabilityCard projection={ins.projection} cutoffs={ins.cutoffs} examType={ins.examType} />
                  <ImprovementCard cutoffs={ins.cutoffs} subjectOrder={ins.subjectOrder} projection={ins.projection} />
                </div>
              </>)}
              {tab === 'topics' && (<>
                <TopicMap topics={[...ins.weakTopics, ...ins.practiceTomorrow ?? [], ...ins.strongTopics, ...ins.reviseToday]} />
                <div className={`dz-stagger ${MASONRY}`}>
                  <TopicList title="Revise today" sub="Your weakest topics, so study the concept" topics={ins.reviseToday} mode="accuracy" emptyText="Nothing to revise yet." action={ins.reviseToday.length > 0 ? <PracticeLink href={revisePracticeUrl(ins.reviseToday)} label="Practise these topics" /> : undefined} />
                  <TopicList title="Practice tomorrow" sub="Borderline topics (40–75%), so do more problems" topics={ins.practiceTomorrow ?? []} mode="accuracy" emptyText="No borderline topics yet." action={(ins.practiceTomorrow ?? []).length > 0 ? <PracticeLink href={revisePracticeUrl(ins.practiceTomorrow ?? [])} label="Practice these topics" /> : undefined} />
                  <TopicList title="Marks lost by topic" sub="Where your marks went, including negatives" topics={ins.marksLostTopics} mode="marks" emptyText="No marks lost yet." />
                </div>
              </>)}
              {tab === 'habits' && (
                <div className={`dz-stagger ${MASONRY}`}>
                  {ins.careless && <CarelessCard careless={ins.careless} />}
                  {ins.guessing && <GuessingCard guessing={ins.guessing} />}
                  <NegativesCard negatives={ins.negatives} />
                </div>
              )}
              {tab === 'time' && (
                <div className={`dz-stagger ${MASONRY}`}>
                  <TimeByTypeCard rows={ins.timeByType} />
                  <SectionOrderCard rows={ins.subjectOrder} />
                  <MonthlyBars monthly={ins.monthly} />
                </div>
              )}
            </div>
          </section>
        )}

        {!loading && !hasActivity && (
          <section>
            <Head title="Three steps to your first session" />
            <ol className="grid gap-4 md:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className={`${glass} dz-pop p-5 transition-transform hover:-translate-y-1`} style={{ animationDelay: `${i * 140}ms` }}>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#803688] text-[14px] font-extrabold text-white">{i + 1}</span>
                  <p className="mt-3 text-[15px] font-bold">{s.title}</p><p className="mt-1 text-[13px] leading-relaxed text-[#5A6B8C]">{s.text}</p>
                </li>
              ))}
            </ol>
            <Link href={practiceHref} className={`${btn} mt-6`}>Start your first session</Link>
          </section>
        )}
      </div>
    </div>
  );
}
