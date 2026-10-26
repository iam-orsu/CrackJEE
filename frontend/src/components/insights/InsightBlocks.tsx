import type { ReactNode } from 'react';
import Link from 'next/link';
import type { CarelessSummary, CutoffData, CutoffRow, GuessingAnalysis, NegativeSummary, ProjectionData, StandingData, SubjectOrderRow, TimeByTypeRow, TopicStat } from '@/types';
import { SUBJECT_COLOR } from '@/lib/subjects';

const QUESTION_TYPE_LABELS: Record<string, string> = {
  mcq_single: 'Single correct',
  mcq_multi: 'Multi-correct',
  integer: 'Integer',
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function toneColor(pct: number): string {
  if (pct >= 60) return 'var(--green-600)';
  if (pct >= 40) return 'var(--amber-600)';
  return 'var(--red-600)';
}

function formatSeconds(total: number): string {
  if (total < 60) return `${Math.round(total)}s`;
  return `${Math.floor(total / 60)}m ${Math.round(total % 60)}s`;
}

/* ── SVG donut ring — the core visual unit ─────────────────────────── */
export function Ring({ pct, color, size = 72, stroke = 7, children }: {
  pct: number; color: string; size?: number; stroke?: number; children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const fill = Math.min(1, Math.max(0, pct / 100)) * circ;
  const cx = size / 2, cy = size / 2;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ display: 'block' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--gray-100)" strokeWidth={stroke} />
        <circle
          cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      {children && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Card shell ─────────────────────────────────────────────────────── */
export function InsightCard({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) {
  return (
    <section style={{
      background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 16,
      padding: '20px 22px', minWidth: 0,
      transition: 'box-shadow 0.18s ease, transform 0.18s ease',
    }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px -4px rgba(15,23,42,.10), 0 2px 6px -2px rgba(15,23,42,.06)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLElement).style.transform = 'none';
      }}
    >
      <h3 style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{title}</h3>
      {sub && <p style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 1, marginBottom: 14 }}>{sub}</p>}
      {children}
    </section>
  );
}

/* ── Projection — range bar with ring ──────────────────────────────── */
export function ProjectionCard({ projection }: { projection: ProjectionData }) {
  return (
    <InsightCard title="Likely next score" sub="Estimate from your recent mocks">
      {projection.available ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <Ring pct={projection.expected} color={toneColor(projection.expected)} size={80} stroke={8}>
              <span style={{ fontSize: 16, fontWeight: 800, color: toneColor(projection.expected), fontVariantNumeric: 'tabular-nums' }}>
                {projection.expected}%
              </span>
            </Ring>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: toneColor(projection.expected), fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {projection.expected}%
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4 }}>
                {projection.trendPerMock >= 0 ? '↑' : '↓'} {Math.abs(projection.trendPerMock)} per mock
              </div>
              <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2 }}>
                {projection.mocks} mock{projection.mocks !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', height: 8, borderRadius: 999, background: 'var(--gray-100)' }}>
            <div style={{
              position: 'absolute', left: `${projection.low}%`, top: 0, height: '100%',
              width: `${projection.high - projection.low}%`,
              background: toneColor(projection.expected), opacity: 0.2, borderRadius: 999,
            }} />
            <div style={{
              position: 'absolute', top: -3, width: 14, height: 14, borderRadius: '50%',
              background: toneColor(projection.expected), border: '2px solid #fff',
              left: `${projection.expected}%`, transform: 'translateX(-50%)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--gray-400)', marginTop: 5 }}>
            <span>Low {projection.low}%</span>
            <span>High {projection.high}%</span>
          </div>
        </>
      ) : (
        <p style={{ fontSize: 13, color: 'var(--gray-500)', paddingTop: 8 }}>
          Take at least two mocks to see a projection. You have {projection.mocks} so far.
        </p>
      )}
    </InsightCard>
  );
}

/* ── Monthly bars ──────────────────────────────────────────────────── */
export function MonthlyBars({ monthly }: { monthly: Array<{ month: string; avgPct: number; mocks: number }> }) {
  return (
    <InsightCard title="Month by month" sub="Average mock score per month">
      {monthly.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>No mocks yet.</p>
      ) : (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120 }}>
          {monthly.map((m) => {
            const idx = Number(m.month.slice(5, 7)) - 1;
            const color = toneColor(m.avgPct);
            return (
              <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color }}>{m.avgPct}%</span>
                <div
                  title={`${m.mocks} mock${m.mocks === 1 ? '' : 's'}`}
                  style={{ width: '100%', maxWidth: 40, height: `${Math.max(8, m.avgPct)}%`, background: color, borderRadius: '5px 5px 2px 2px', opacity: 0.85, transition: 'height 0.6s ease' }}
                />
                <span style={{ fontSize: 10, color: 'var(--gray-400)' }}>{MONTH_LABELS[idx] ?? m.month}</span>
              </div>
            );
          })}
        </div>
      )}
    </InsightCard>
  );
}

/* ── Topic list — ring per row ──────────────────────────────────────── */
export function TopicList({
  title, sub, topics, mode, emptyText, action,
}: {
  title: string; sub?: string; topics: TopicStat[];
  mode: 'accuracy' | 'marks'; emptyText: string; action?: ReactNode;
}) {
  const maxMarksLost = mode === 'marks' ? Math.max(...topics.map((t) => t.marksLost ?? 0), 1) : 1;

  return (
    <InsightCard title={title} sub={sub}>
      {topics.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>{emptyText}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {topics.map((t) => {
            const subjectColor = SUBJECT_COLOR[t.subject] ?? 'var(--gray-400)';
            const pct = mode === 'accuracy' ? (t.accuracy ?? 0) : Math.round(((t.marksLost ?? 0) / maxMarksLost) * 100);
            const color = mode === 'accuracy' ? toneColor(t.accuracy ?? 0) : 'var(--red-600)';
            const label = mode === 'accuracy' ? `${t.accuracy}%` : `−${t.marksLost}`;
            return (
              <div key={`${t.subject}|${t.topic}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderTop: '1px solid var(--gray-100)' }}>
                <Ring pct={pct} color={color} size={36} stroke={4}>
                  <span style={{ fontSize: 8, fontWeight: 700, color }}>{t.accuracy}%</span>
                </Ring>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.topic}</div>
                  <div style={{ fontSize: 11, color: subjectColor, marginTop: 1 }}>{t.subject} · {t.attempts} answered</div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{label}</span>
              </div>
            );
          })}
        </div>
      )}
      {action && <div style={{ marginTop: 14 }}>{action}</div>}
    </InsightCard>
  );
}

/* ── Negative marking — ring + ratio ───────────────────────────────── */
export function NegativesCard({ negatives }: { negatives: NegativeSummary }) {
  const total = negatives.answered;
  const wrongPct = total > 0 ? Math.round((negatives.wrong / total) * 100) : 0;
  const correct = negatives.answered - negatives.wrong;

  return (
    <InsightCard title="Negative marking" sub="How much wrong answers cost you">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
        <Ring pct={wrongPct} color={wrongPct >= 40 ? 'var(--red-600)' : 'var(--amber-600)'} size={80} stroke={8}>
          <span style={{ fontSize: 14, fontWeight: 800, color: wrongPct >= 40 ? 'var(--red-600)' : 'var(--amber-600)', fontVariantNumeric: 'tabular-nums' }}>
            {wrongPct}%
          </span>
        </Ring>
        <div>
          <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 8 }}>wrong rate</div>
          <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
            <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--green-600)', marginRight: 5 }} />{correct} correct</span>
            <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--red-600)', marginRight: 5 }} />{negatives.wrong} wrong</span>
          </div>
          {negatives.negativeCount > 0 && (
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--red-600)', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
              {negatives.negativeMarks} marks lost
            </div>
          )}
        </div>
      </div>
      {[
        ['Time on wrong', `${formatSeconds(negatives.timeOnWrongSeconds)} (${negatives.shareOfTimeOnWrongPct}%)`],
        ['Time on correct', formatSeconds(negatives.timeOnCorrectSeconds)],
      ].map(([l, v]) => (
        <div key={l} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '7px 0', borderTop: '1px solid var(--gray-100)', fontSize: 12 }}>
          <span style={{ color: 'var(--gray-500)' }}>{l}</span>
          <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{v}</span>
        </div>
      ))}
    </InsightCard>
  );
}

/* ── Time by type — bar per row ─────────────────────────────────────── */
export function TimeByTypeCard({ rows }: { rows: TimeByTypeRow[] }) {
  return (
    <InsightCard title="Time by question type" sub="Accuracy and average time per type">
      {rows.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>No answered questions yet.</p>
      ) : (
        <div>
          {rows.map((r) => (
            <div key={r.questionType} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderTop: '1px solid var(--gray-100)' }}>
              <Ring pct={r.accuracy} color={toneColor(r.accuracy)} size={36} stroke={4}>
                <span style={{ fontSize: 8, fontWeight: 700, color: toneColor(r.accuracy) }}>{r.accuracy}%</span>
              </Ring>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-900)' }}>{QUESTION_TYPE_LABELS[r.questionType] ?? r.questionType}</div>
                <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 1 }}>{r.answered} answered · avg {formatSeconds(r.avgSeconds)}</div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 800, color: toneColor(r.accuracy), fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{r.accuracy}%</span>
            </div>
          ))}
        </div>
      )}
    </InsightCard>
  );
}

/* ── Section order — subject efficiency bars ────────────────────────── */
export function SectionOrderCard({ rows }: { rows: SubjectOrderRow[] }) {
  const top = rows[0];
  const maxPerMin = Math.max(...rows.map((r) => r.correctPerMinute), 0.1);

  return (
    <InsightCard title="Which section to start with" sub="Correct answers per minute on each subject">
      {!top ? (
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>Answer some questions to see this.</p>
      ) : (
        <>
          <p style={{ fontSize: 14, color: 'var(--gray-900)', marginBottom: 14, lineHeight: 1.5 }}>
            Start with <strong style={{ color: SUBJECT_COLOR[top.subject] ?? 'var(--gray-900)' }}>{top.subject}</strong> — most correct per minute.
          </p>
          {rows.map((r, i) => {
            const color = SUBJECT_COLOR[r.subject] ?? 'var(--gray-400)';
            const barPct = (r.correctPerMinute / maxPerMin) * 100;
            return (
              <div key={r.subject} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderTop: '1px solid var(--gray-100)' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, background: `${color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color, flexShrink: 0,
                }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: i === 0 ? color : 'var(--gray-800)' }}>{r.subject}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{r.correctPerMinute}/min</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 999, background: 'var(--gray-100)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${barPct}%`, background: i === 0 ? color : 'var(--gray-300)', borderRadius: 999, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </InsightCard>
  );
}

/* ── Platform standing — ring ───────────────────────────────────────── */
export function StandingCard({ standing }: { standing: StandingData }) {
  return (
    <InsightCard title="Platform standing" sub="Among students on this platform only — not an NTA percentile">
      {standing.available ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
            <Ring pct={standing.percentile} color="var(--gray-800)" size={80} stroke={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1 }}>#{standing.rank}</div>
              </div>
            </Ring>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                Top {100 - standing.percentile}%
              </div>
              <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 5 }}>Rank {standing.rank} of {standing.of}</div>
              <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2 }}>Ahead of {standing.percentile}% · avg {standing.mine}%</div>
            </div>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: 'var(--gray-100)', overflow: 'visible', position: 'relative' }}>
            <div style={{ height: '100%', width: `${standing.percentile}%`, background: 'var(--gray-800)', borderRadius: 999, transition: 'width 0.8s ease' }} />
            <div style={{
              position: 'absolute', top: -3, left: `${standing.percentile}%`, transform: 'translateX(-50%)',
              width: 14, height: 14, borderRadius: '50%', background: 'var(--gray-900)', border: '2px solid #fff',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--gray-400)', marginTop: 4 }}>
            <span>Bottom</span><span>Top</span>
          </div>
        </>
      ) : (
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
          {standing.mine === null
            ? 'Take a mock to see where you stand.'
            : `Appears once ${standing.needed} students have mocks. ${standing.students} so far.`}
        </p>
      )}
    </InsightCard>
  );
}

/* ── Cutoff check — bar per line ────────────────────────────────────── */
export function CutoffCard({ cutoffs, scoreLabel }: { cutoffs: CutoffData | null; scoreLabel: string }) {
  if (!cutoffs) {
    return (
      <InsightCard title="Cutoff check" sub="2026 published cutoffs">
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>No verified 2026 cutoff is available for this exam.</p>
      </InsightCard>
    );
  }
  return (
    <InsightCard title="Cutoff check" sub={`${cutoffs.name} · as % of max marks`}>
      {cutoffs.lines === null ? (
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>Take a mock to compare with the cutoff.</p>
      ) : (
        cutoffs.lines.map((line) => {
          const isAbove = line.status === 'above';
          const color = isAbove ? 'var(--green-600)' : 'var(--red-600)';
          const scorePct = line.scorePct ?? 0;
          const cutoffPct = line.cutoffPct ?? 0;
          return (
            <div key={line.label} style={{ padding: '12px 0', borderTop: '1px solid var(--gray-100)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)' }}>{line.label}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, color,
                  background: isAbove ? '#f0fdf4' : '#fef2f2',
                  padding: '2px 8px', borderRadius: 999,
                }}>
                  {isAbove ? `+${Math.abs(line.gapPct)} above` : `−${Math.abs(line.gapPct)} to go`}
                </span>
              </div>
              <div style={{ position: 'relative', height: 8, borderRadius: 999, background: 'var(--gray-100)' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${Math.min(100, scorePct)}%`, background: color, borderRadius: 999, opacity: 0.75, transition: 'width 0.6s ease' }} />
                {cutoffPct <= 100 && (
                  <div style={{ position: 'absolute', top: -3, left: `${cutoffPct}%`, width: 2, height: 14, background: 'var(--gray-500)', transform: 'translateX(-50%)', borderRadius: 1 }} />
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--gray-400)', marginTop: 4 }}>
                <span>{scoreLabel}: <strong style={{ color }}>{scorePct}%</strong></span>
                <span>Cutoff: <strong style={{ color: 'var(--gray-600)' }}>{cutoffPct}%</strong></span>
              </div>
            </div>
          );
        })
      )}
      <p style={{ fontSize: 10, color: 'var(--gray-400)', marginTop: 10, lineHeight: 1.5 }}>
        From published reports — verify with NTA or IIT before relying on these.
        {cutoffs.sources.length > 0 && cutoffs.sources.map((s) => (
          <a key={s.url} href={s.url} target="_blank" rel="noreferrer" style={{ color: 'var(--gray-500)', textDecoration: 'underline', marginLeft: 6 }}>{s.label}</a>
        ))}
      </p>
    </InsightCard>
  );
}

/* ── Practice link ──────────────────────────────────────────────────── */
export function PracticeLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="btn btn-primary" style={{ display: 'inline-flex' }}>{label}</Link>
  );
}

/* ── Careless mistakes (#7) ─────────────────────────────────────────── */
export function CarelessCard({ careless }: { careless: CarelessSummary }) {
  const { carelessCount, totalWrong, carelessPct, topTopics } = careless;
  const color = carelessPct >= 30 ? 'var(--red-600)' : 'var(--amber-600)';
  return (
    <InsightCard title="Careless mistakes" sub="Wrong answers where you answered in under half your usual time">
      {totalWrong === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>No wrong answers recorded yet.</p>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
            <Ring pct={carelessPct} color={color} size={80} stroke={8}>
              <span style={{ fontSize: 14, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums' }}>{carelessPct}%</span>
            </Ring>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--gray-900)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                {carelessCount} <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-400)' }}>careless</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>out of {totalWrong} wrong answers</div>
              <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>Slow down — you likely knew these.</div>
            </div>
          </div>
          {topTopics.length > 0 && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Most careless in</p>
              {topTopics.map((t) => (
                <div key={`${t.subject}|${t.topic}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '6px 0', borderTop: '1px solid var(--gray-100)' }}>
                  <span style={{ color: 'var(--gray-700)', fontWeight: 500 }}>{t.topic}</span>
                  <span style={{ color: SUBJECT_COLOR[t.subject] ?? 'var(--gray-400)' }}>{t.subject} · {t.count}×</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </InsightCard>
  );
}

/* ── Guessing frequency (#8) ────────────────────────────────────────── */
export function GuessingCard({ guessing }: { guessing: GuessingAnalysis }) {
  const { guessCount, totalAnswered, guessPct, wrongGuesses, rightGuesses } = guessing;
  const isHigh = guessPct >= 15;
  const color = isHigh ? 'var(--red-600)' : 'var(--green-600)';
  return (
    <InsightCard title="Guessing frequency" sub="Answers submitted in under 20 seconds">
      {totalAnswered === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>No answered questions yet.</p>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
            <Ring pct={guessPct} color={color} size={80} stroke={8}>
              <span style={{ fontSize: 14, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums' }}>{guessPct}%</span>
            </Ring>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--gray-900)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                {guessCount} <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-400)' }}>guesses</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>of {totalAnswered} answered</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, padding: '10px', background: '#fef2f2', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--red-600)', fontVariantNumeric: 'tabular-nums' }}>{wrongGuesses}</div>
              <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>wrong guesses</div>
              <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>−ve marks risk</div>
            </div>
            <div style={{ flex: 1, padding: '10px', background: '#f0fdf4', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--green-600)', fontVariantNumeric: 'tabular-nums' }}>{rightGuesses}</div>
              <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>lucky guesses</div>
              <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>got marks</div>
            </div>
          </div>
          <p style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 10, lineHeight: 1.5 }}>
            {isHigh ? 'High guessing rate. Skip or mark-for-review instead of guessing — wrong guesses trigger −ve marks.' : 'Guessing rate is fine. Keep skipping questions you are unsure about.'}
          </p>
        </>
      )}
    </InsightCard>
  );
}

/* ── What to improve to reach target rank (#12) ─────────────────────── */
export function ImprovementCard({
  cutoffs, subjectOrder, projection,
}: {
  cutoffs: CutoffData | null;
  subjectOrder: SubjectOrderRow[];
  projection: ProjectionData;
}) {
  if (!cutoffs?.lines || subjectOrder.length === 0) {
    return (
      <InsightCard title="What to improve" sub="Personalised roadmap to clear the cutoff">
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>Submit a mock to see your improvement roadmap.</p>
      </InsightCard>
    );
  }
  const belowLines = cutoffs.lines.filter((l: CutoffRow) => l.status === 'below').sort((a: CutoffRow, b: CutoffRow) => b.gapPct - a.gapPct);
  const worst = belowLines[0];
  const weakestSubject = [...subjectOrder].sort((a, b) => a.accuracy - b.accuracy)[0];
  const strongestSubject = subjectOrder[0];

  const items: Array<{ icon: string; text: string; kind: 'danger' | 'warn' | 'ok' }> = [];
  if (worst) items.push({ icon: '🎯', text: `You are ${worst.gapPct} pts below the ${worst.label} cutoff (${worst.cutoffPct}%). That is the gap to close.`, kind: 'danger' });
  if (weakestSubject) items.push({ icon: '📈', text: `${weakestSubject.subject} is your weakest at ${weakestSubject.accuracy}% accuracy. Bringing it to 60%+ has the biggest impact.`, kind: 'warn' });
  if (strongestSubject && strongestSubject.subject !== weakestSubject?.subject) items.push({ icon: '⚡', text: `You are most efficient in ${strongestSubject.subject}. Start with it in the exam to bank marks early.`, kind: 'ok' });
  if ('trendPerMock' in projection && projection.trendPerMock < 0) items.push({ icon: '⚠️', text: 'Your scores are trending down. Address this now.', kind: 'danger' });
  if (items.length === 0) items.push({ icon: '✅', text: 'You are above all published cutoff lines. Keep the momentum.', kind: 'ok' });

  const kindStyle: Record<string, { bg: string; border: string }> = {
    danger: { bg: '#fef2f2', border: '#fca5a533' },
    warn: { bg: '#fffbeb', border: '#fcd34d33' },
    ok: { bg: '#f0fdf4', border: '#86efac33' },
  };

  return (
    <InsightCard title="What to improve" sub="Personalised roadmap based on your mock data">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 10, background: kindStyle[item.kind]!.bg, border: `1px solid ${kindStyle[item.kind]!.border}` }}>
            <span style={{ fontSize: 16, lineHeight: 1.4, flexShrink: 0 }}>{item.icon}</span>
            <p style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.5 }}>{item.text}</p>
          </div>
        ))}
      </div>
    </InsightCard>
  );
}

/* ── Can I crack JEE/NEET (#13) ─────────────────────────────────────── */
export function CrackabilityCard({
  projection, cutoffs, examType,
}: {
  projection: ProjectionData;
  cutoffs: CutoffData | null;
  examType: string | null;
}) {
  const examLabel = examType === 'NEET' ? 'NEET' : examType === 'Advanced' ? 'JEE Advanced' : 'JEE Main';

  if (!projection.available) {
    return (
      <InsightCard title={`Can I crack ${examLabel}?`} sub="Based on your mock performance trend">
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>Take at least 2 mocks to get a verdict. You have {projection.mocks} so far.</p>
      </InsightCard>
    );
  }

  const lowestCutoff = cutoffs?.lines ? Math.min(...cutoffs.lines.map((l: CutoffRow) => l.cutoffPct)) : null;
  const isAbove = lowestCutoff !== null && projection.expected >= lowestCutoff;
  const isTrendUp = projection.trendPerMock > 0;
  const isTrendDown = projection.trendPerMock < -1;
  const gap = lowestCutoff !== null ? Math.round(lowestCutoff - projection.expected) : null;

  let verdict: string, verdictColor: string, verdictBg: string, detail: string;

  if (isAbove) {
    verdict = '✅ On track'; verdictColor = 'var(--green-600)'; verdictBg = '#f0fdf4';
    detail = `Projected ${projection.expected}% is above the ${lowestCutoff}% cutoff. Maintain consistency.`;
  } else if (isTrendDown) {
    verdict = '⚠️ At risk'; verdictColor = 'var(--red-600)'; verdictBg = '#fef2f2';
    detail = `Scores declining (${projection.trendPerMock}/mock). Reverse the trend${gap !== null ? ` and close a ${gap}-pt gap` : ''}.`;
  } else if (isTrendUp && gap !== null) {
    const mocksNeeded = gap > 0 ? Math.ceil(gap / Math.max(projection.trendPerMock, 0.5)) : 0;
    verdict = '📈 Improving'; verdictColor = 'var(--amber-600)'; verdictBg = '#fffbeb';
    detail = `${gap} pts below cutoff, improving by ${projection.trendPerMock}/mock. ~${mocksNeeded} more mocks at this rate.`;
  } else {
    verdict = '⏳ Keep going'; verdictColor = 'var(--amber-600)'; verdictBg = '#fffbeb';
    detail = gap !== null ? `${gap} pts below the cutoff. Projected ${projection.expected}%. Needs consistent practice.` : `Projected ${projection.expected}%. Take more mocks to refine.`;
  }

  return (
    <InsightCard title={`Can I crack ${examLabel}?`} sub="Projected score vs published cutoff">
      <div style={{ padding: '14px 16px', borderRadius: 12, background: verdictBg, marginBottom: 16 }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: verdictColor, marginBottom: 6 }}>{verdict}</div>
        <p style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.5 }}>{detail}</p>
      </div>
      {lowestCutoff !== null && (
        <>
          <div style={{ position: 'relative', height: 10, borderRadius: 999, background: 'var(--gray-100)' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${Math.min(100, projection.expected)}%`, background: verdictColor, borderRadius: 999, opacity: 0.8, transition: 'width 0.8s ease' }} />
            {lowestCutoff <= 100 && (
              <div style={{ position: 'absolute', top: -4, left: `${lowestCutoff}%`, width: 3, height: 18, background: 'var(--gray-600)', transform: 'translateX(-50%)', borderRadius: 2 }} />
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--gray-400)', marginTop: 4 }}>
            <span>Projected: <strong style={{ color: verdictColor }}>{projection.expected}%</strong></span>
            <span>Cutoff: <strong style={{ color: 'var(--gray-600)' }}>{lowestCutoff}%</strong></span>
          </div>
        </>
      )}
      <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 8 }}>
        {projection.mocks} mocks · trend {projection.trendPerMock >= 0 ? '+' : ''}{projection.trendPerMock}/mock
      </div>
    </InsightCard>
  );
}
