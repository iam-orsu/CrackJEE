import type { ReactNode } from 'react';
import Link from 'next/link';
import type { CutoffData, NegativeSummary, ProjectionData, StandingData, SubjectOrderRow, TimeByTypeRow, TopicStat } from '@/types';
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

/* A white insight card with a title and a one-line explanation */
export function InsightCard({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) {
  return (
    <section style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 14, padding: '20px 22px', minWidth: 0 }}>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{title}</h3>
      {sub && <p style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2, marginBottom: 16 }}>{sub}</p>}
      {children}
    </section>
  );
}

/* Thin progress bar */
function Bar({ pct, color, height = 6 }: { pct: number; color: string; height?: number }) {
  return (
    <div style={{ height, borderRadius: 999, background: 'var(--gray-100)', overflow: 'hidden', flex: 1 }}>
      <div style={{ height: '100%', width: `${Math.min(100, Math.max(0, pct))}%`, background: color, borderRadius: 999, transition: 'width 0.6s ease' }} />
    </div>
  );
}

/* Likely next score with a visual range bar */
export function ProjectionCard({ projection }: { projection: ProjectionData }) {
  return (
    <InsightCard title="Likely next score" sub="Estimate from your recent mocks">
      {projection.available ? (
        <>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 36, fontWeight: 700, color: toneColor(projection.expected), fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
              {projection.expected}%
            </span>
            <span style={{ fontSize: 13, color: 'var(--gray-500)', fontWeight: 500 }}>
              {projection.trendPerMock >= 0 ? '↑' : '↓'} {Math.abs(projection.trendPerMock)} per mock
            </span>
          </div>

          {/* Range bar: low → expected → high */}
          <div style={{ position: 'relative', margin: '16px 0 8px' }}>
            <div style={{ height: 8, borderRadius: 999, background: 'var(--gray-100)', overflow: 'visible', position: 'relative' }}>
              {/* Range fill */}
              <div style={{
                position: 'absolute', top: 0, height: '100%',
                left: `${projection.low}%`, width: `${projection.high - projection.low}%`,
                background: toneColor(projection.expected), opacity: 0.25, borderRadius: 999,
              }} />
              {/* Expected marker */}
              <div style={{
                position: 'absolute', top: -3, width: 14, height: 14, borderRadius: '50%',
                background: toneColor(projection.expected), border: '2px solid #fff',
                left: `${projection.expected}%`, transform: 'translateX(-50%)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--gray-400)', marginBottom: 12 }}>
            <span>Low {projection.low}%</span>
            <span>Expected {projection.expected}%</span>
            <span>High {projection.high}%</span>
          </div>

          <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>Based on {projection.mocks} mock{projection.mocks !== 1 ? 's' : ''}</div>
        </>
      ) : (
        <p style={{ fontSize: 13, color: 'var(--gray-500)', paddingTop: 8 }}>
          Take at least two mocks to see a projection. You have {projection.mocks} so far.
        </p>
      )}
    </InsightCard>
  );
}

/* Average score per month, as bars */
export function MonthlyBars({ monthly }: { monthly: Array<{ month: string; avgPct: number; mocks: number }> }) {
  return (
    <InsightCard title="Month by month" sub="Average mock score per month">
      {monthly.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>No mocks yet.</p>
      ) : (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120, paddingTop: 8 }}>
          {monthly.map((m) => {
            const monthIndex = Number(m.month.slice(5, 7)) - 1;
            const color = toneColor(m.avgPct);
            return (
              <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color }}>{m.avgPct}%</span>
                <div
                  title={`${m.mocks} mock${m.mocks === 1 ? '' : 's'}`}
                  style={{ width: '100%', maxWidth: 40, height: `${Math.max(6, m.avgPct)}%`, background: color, borderRadius: '6px 6px 3px 3px', opacity: 0.85 }}
                />
                <span style={{ fontSize: 10, color: 'var(--gray-400)' }}>{MONTH_LABELS[monthIndex] ?? m.month}</span>
              </div>
            );
          })}
        </div>
      )}
    </InsightCard>
  );
}

/* A list of topics with their accuracy or marks lost, now with inline bars */
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
            const barPct = mode === 'accuracy' ? (t.accuracy ?? 0) : ((t.marksLost ?? 0) / maxMarksLost) * 100;
            const barColor = mode === 'accuracy' ? toneColor(t.accuracy ?? 0) : 'var(--red-600)';
            return (
              <div key={`${t.subject}|${t.topic}`} style={{ padding: '10px 0', borderTop: '1px solid var(--gray-100)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.topic}</div>
                    <div style={{ fontSize: 11, color: subjectColor, marginTop: 1 }}>{t.subject} · {t.attempts} answered</div>
                  </div>
                  {mode === 'accuracy' ? (
                    <span style={{ fontSize: 14, fontWeight: 700, color: toneColor(t.accuracy ?? 0), fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{t.accuracy}%</span>
                  ) : (
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--red-600)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>−{t.marksLost}</span>
                  )}
                </div>
                <Bar pct={barPct} color={barColor} height={4} />
              </div>
            );
          })}
        </div>
      )}
      {action && <div style={{ marginTop: 14 }}>{action}</div>}
    </InsightCard>
  );
}

/* Negative marks: visual ratio + key stats */
export function NegativesCard({ negatives }: { negatives: NegativeSummary }) {
  const totalAnswered = negatives.answered;
  const wrongPct = totalAnswered > 0 ? Math.round((negatives.wrong / totalAnswered) * 100) : 0;
  const correctCount = negatives.answered - negatives.wrong;

  return (
    <InsightCard title="Negative marking" sub="How much wrong answers cost you">
      {/* Visual ratio bar */}
      <div style={{ display: 'flex', height: 10, borderRadius: 999, overflow: 'hidden', marginBottom: 10 }}>
        <div style={{ flex: correctCount, background: 'var(--green-600)', opacity: 0.8 }} />
        <div style={{ flex: negatives.wrong, background: 'var(--red-600)', opacity: 0.8 }} />
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 12, color: 'var(--gray-500)' }}>
        <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--green-600)', marginRight: 5, verticalAlign: 'middle' }} />{correctCount} correct</span>
        <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--red-600)', marginRight: 5, verticalAlign: 'middle' }} />{negatives.wrong} wrong</span>
      </div>

      {/* Big number: wrong % */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, color: wrongPct >= 40 ? 'var(--red-600)' : 'var(--amber-600)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{wrongPct}%</div>
          <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>wrong rate</div>
        </div>
        {negatives.negativeCount > 0 && (
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--red-600)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{negatives.negativeMarks}</div>
            <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>marks lost</div>
          </div>
        )}
      </div>

      {[
        ['Time on wrong answers', `${formatSeconds(negatives.timeOnWrongSeconds)} (${negatives.shareOfTimeOnWrongPct}%)`],
        ['Time on correct answers', formatSeconds(negatives.timeOnCorrectSeconds)],
      ].map(([label, value]) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '7px 0', borderTop: '1px solid var(--gray-100)', fontSize: 12 }}>
          <span style={{ color: 'var(--gray-500)' }}>{label}</span>
          <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{value}</span>
        </div>
      ))}
    </InsightCard>
  );
}

/* Accuracy and average time for each question type — with inline bars */
export function TimeByTypeCard({ rows }: { rows: TimeByTypeRow[] }) {
  return (
    <InsightCard title="Time by question type" sub="Accuracy and average time per type">
      {rows.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>No answered questions yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {rows.map((r) => (
            <div key={r.questionType} style={{ padding: '10px 0', borderTop: '1px solid var(--gray-100)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)' }}>{QUESTION_TYPE_LABELS[r.questionType] ?? r.questionType}</span>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--gray-400)', fontVariantNumeric: 'tabular-nums' }}>{r.answered} answered</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: toneColor(r.accuracy), fontVariantNumeric: 'tabular-nums' }}>{r.accuracy}%</span>
                  <span style={{ fontSize: 12, color: 'var(--gray-500)', fontVariantNumeric: 'tabular-nums', minWidth: 28, textAlign: 'right' }}>{formatSeconds(r.avgSeconds)}</span>
                </div>
              </div>
              <Bar pct={r.accuracy} color={toneColor(r.accuracy)} height={5} />
            </div>
          ))}
        </div>
      )}
    </InsightCard>
  );
}

/* Which section to attempt first — with efficiency bars */
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
            Start with{' '}
            <strong style={{ color: SUBJECT_COLOR[top.subject] ?? 'var(--gray-900)' }}>{top.subject}</strong>{' '}
            — you score the most per minute there.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {rows.map((r, i) => {
              const color = SUBJECT_COLOR[r.subject] ?? 'var(--gray-400)';
              const barPct = (r.correctPerMinute / maxPerMin) * 100;
              return (
                <div key={r.subject} style={{ padding: '9px 0', borderTop: '1px solid var(--gray-100)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: i === 0 ? color : 'var(--gray-700)' }}>
                      {i + 1}. {r.subject}
                    </span>
                    <div style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--gray-500)', fontVariantNumeric: 'tabular-nums' }}>
                      <span>{r.accuracy}% accuracy</span>
                      <span style={{ fontWeight: 600, color }}>{r.correctPerMinute}/min</span>
                    </div>
                  </div>
                  <Bar pct={barPct} color={i === 0 ? color : 'var(--gray-300)'} height={4} />
                </div>
              );
            })}
          </div>
        </>
      )}
    </InsightCard>
  );
}

/* Platform standing — with percentile bar */
export function StandingCard({ standing }: { standing: StandingData }) {
  return (
    <InsightCard title="Platform standing" sub="Among students on this platform only — not an NTA percentile">
      {standing.available ? (
        <>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--gray-900)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {standing.rank === 1 ? '#1' : `Top ${100 - standing.percentile}%`}
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 14 }}>
            Rank {standing.rank} of {standing.of} · ahead of {standing.percentile}% · your avg {standing.mine}%
          </div>

          {/* Percentile bar showing position among peers */}
          <div style={{ position: 'relative', margin: '4px 0 8px' }}>
            <Bar pct={standing.percentile} color="var(--gray-800)" height={8} />
            <div style={{ position: 'absolute', top: -3, left: `${standing.percentile}%`, transform: 'translateX(-50%)' }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--gray-900)', border: '2px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--gray-400)', marginTop: 4 }}>
            <span>Bottom</span>
            <span>Top</span>
          </div>
        </>
      ) : (
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
          {standing.mine === null
            ? 'Take a mock to see where you stand.'
            : `Standing appears once ${standing.needed} students have mocks. ${standing.students} so far.`}
        </p>
      )}
    </InsightCard>
  );
}

/* Cutoff check — with visual proximity bars */
export function CutoffCard({ cutoffs, scoreLabel }: { cutoffs: CutoffData | null; scoreLabel: string }) {
  if (!cutoffs) {
    return (
      <InsightCard title="Cutoff check" sub="2026 published cutoffs">
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
          No verified 2026 cutoff is available for this exam.
        </p>
      </InsightCard>
    );
  }
  return (
    <InsightCard title="Cutoff check" sub={`${cutoffs.name} · compared as % of max marks`}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)' }}>{line.label}</span>
                <span style={{
                  fontSize: 11, fontWeight: 600, color,
                  background: isAbove ? 'var(--green-50, #f0fdf4)' : 'var(--red-50, #fef2f2)',
                  padding: '2px 7px', borderRadius: 999, flexShrink: 0,
                }}>
                  {isAbove ? `+${Math.abs(line.gapPct)} above` : `−${Math.abs(line.gapPct)} to go`}
                </span>
              </div>

              {/* Bar: shows score vs cutoff */}
              <div style={{ position: 'relative', height: 8, borderRadius: 999, background: 'var(--gray-100)', overflow: 'visible' }}>
                {/* Score fill */}
                <div style={{
                  position: 'absolute', left: 0, top: 0, height: '100%',
                  width: `${Math.min(100, scorePct)}%`, background: color,
                  borderRadius: 999, opacity: 0.7, transition: 'width 0.6s ease',
                }} />
                {/* Cutoff marker line */}
                {cutoffPct <= 100 && (
                  <div style={{
                    position: 'absolute', top: -3, left: `${cutoffPct}%`,
                    width: 2, height: 14, background: 'var(--gray-500)',
                    transform: 'translateX(-50%)', borderRadius: 1,
                  }} />
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--gray-400)', marginTop: 5 }}>
                <span>{scoreLabel}: <strong style={{ color }}>{scorePct}%</strong></span>
                <span>Cutoff: <strong style={{ color: 'var(--gray-600)' }}>{cutoffPct}%</strong></span>
              </div>
            </div>
          );
        })
      )}
      <p style={{ fontSize: 10, color: 'var(--gray-400)', marginTop: 10, lineHeight: 1.5 }}>
        From published reports, not an official notice. Verify with NTA or IIT before relying on these.
        {cutoffs.sources.length > 0 && (
          <>
            {' '}
            {cutoffs.sources.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noreferrer" style={{ color: 'var(--gray-500)', textDecoration: 'underline', marginRight: 8 }}>
                {s.label}
              </a>
            ))}
          </>
        )}
      </p>
    </InsightCard>
  );
}

/* A link button for practising a set of topics */
export function PracticeLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="btn btn-primary" style={{ display: 'inline-flex' }}>
      {label}
    </Link>
  );
}
