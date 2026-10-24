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
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>{title}</h3>
      {sub && <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2, marginBottom: 14 }}>{sub}</p>}
      {children}
    </section>
  );
}

/* Likely next score with its range and the trend, or a note that more mocks are needed */
export function ProjectionCard({ projection }: { projection: ProjectionData }) {
  return (
    <InsightCard title="Likely next score" sub="An estimate from your recent mocks, not a guarantee">
      {projection.available ? (
        <>
          <div style={{ fontSize: 28, fontWeight: 600, color: toneColor(projection.expected), fontVariantNumeric: 'tabular-nums' }}>
            {projection.expected}%
          </div>
          <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4 }}>
            Range {projection.low}% to {projection.high}% · trend {projection.trendPerMock >= 0 ? '+' : ''}{projection.trendPerMock} per mock · based on {projection.mocks} mocks
          </div>
        </>
      ) : (
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
          Take at least two mocks to see a projection. You have {projection.mocks} so far.
        </p>
      )}
    </InsightCard>
  );
}

/* Average score per month, as bars */
export function MonthlyBars({ monthly }: { monthly: Array<{ month: string; avgPct: number; mocks: number }> }) {
  return (
    <InsightCard title="Month by month" sub="Average of your mock scores in each month">
      {monthly.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>No mocks yet.</p>
      ) : (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 150, paddingTop: 8 }}>
          {monthly.map((m) => {
            const monthIndex = Number(m.month.slice(5, 7)) - 1;
            return (
              <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: toneColor(m.avgPct) }}>{m.avgPct}%</span>
                <div
                  title={`${m.mocks} mock${m.mocks === 1 ? '' : 's'}`}
                  style={{ width: '100%', maxWidth: 46, height: `${Math.max(4, m.avgPct)}%`, background: toneColor(m.avgPct), borderRadius: 6 }}
                />
                <span style={{ fontSize: 11, color: 'var(--gray-500)' }}>{MONTH_LABELS[monthIndex] ?? m.month}</span>
              </div>
            );
          })}
        </div>
      )}
    </InsightCard>
  );
}

/* A list of topics with their accuracy, or the marks each one cost */
export function TopicList({
  title,
  sub,
  topics,
  mode,
  emptyText,
  action,
}: {
  title: string;
  sub?: string;
  topics: TopicStat[];
  mode: 'accuracy' | 'marks';
  emptyText: string;
  action?: ReactNode;
}) {
  return (
    <InsightCard title={title} sub={sub}>
      {topics.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>{emptyText}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {topics.map((t) => (
            <div key={`${t.subject}|${t.topic}`} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 4, padding: '10px 0', borderTop: '1px solid var(--gray-100)' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.topic}</div>
                <div style={{ fontSize: 11, color: SUBJECT_COLOR[t.subject] ?? 'var(--gray-500)' }}>{t.subject} · {t.attempts} answered</div>
              </div>
              {mode === 'accuracy' ? (
                <span style={{ fontSize: 13, fontWeight: 600, color: toneColor(t.accuracy), fontVariantNumeric: 'tabular-nums' }}>{t.accuracy}%</span>
              ) : (
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--red-600)', fontVariantNumeric: 'tabular-nums' }}>−{t.marksLost} marks</span>
              )}
            </div>
          ))}
        </div>
      )}
      {action && <div style={{ marginTop: 12 }}>{action}</div>}
    </InsightCard>
  );
}

/* Negative marks: how many, how much they cost, and time spent on wrong answers */
export function NegativesCard({ negatives }: { negatives: NegativeSummary }) {
  const rows: Array<[string, string]> = [
    ['Wrong answers', `${negatives.wrong} of ${negatives.answered}`],
    ['Negative marks taken', negatives.negativeCount > 0 ? `${negatives.negativeMarks}` : '0'],
    ['Time on wrong answers', `${formatSeconds(negatives.timeOnWrongSeconds)} (${negatives.shareOfTimeOnWrongPct}% of answered time)`],
    ['Time on correct answers', formatSeconds(negatives.timeOnCorrectSeconds)],
  ];
  return (
    <InsightCard title="Negative marking" sub="How much wrong answers cost you, and the time they took">
      {rows.map(([label, value]) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderTop: '1px solid var(--gray-100)', fontSize: 13 }}>
          <span style={{ color: 'var(--gray-600)' }}>{label}</span>
          <span style={{ fontWeight: 600, color: 'var(--gray-900)', textAlign: 'right' }}>{value}</span>
        </div>
      ))}
    </InsightCard>
  );
}

/* Accuracy and average time for each question type */
export function TimeByTypeCard({ rows }: { rows: TimeByTypeRow[] }) {
  return (
    <InsightCard title="Time by question type" sub="Average time per answered question">
      {rows.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>No answered questions yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ color: 'var(--gray-500)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <th style={{ textAlign: 'left', padding: '0 0 8px', fontWeight: 600 }}>Type</th>
              <th style={{ textAlign: 'right', padding: '0 0 8px', fontWeight: 600 }}>Answered</th>
              <th style={{ textAlign: 'right', padding: '0 0 8px', fontWeight: 600 }}>Accuracy</th>
              <th style={{ textAlign: 'right', padding: '0 0 8px', fontWeight: 600 }}>Avg time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.questionType} style={{ borderTop: '1px solid var(--gray-100)' }}>
                <td style={{ padding: '8px 0', color: 'var(--gray-900)' }}>{QUESTION_TYPE_LABELS[r.questionType] ?? r.questionType}</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.answered}</td>
                <td style={{ padding: '8px 0', textAlign: 'right', color: toneColor(r.accuracy), fontWeight: 600 }}>{r.accuracy}%</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{formatSeconds(r.avgSeconds)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </InsightCard>
  );
}

/* Which section to attempt first: subjects ranked by correct answers per minute spent */
export function SectionOrderCard({ rows }: { rows: SubjectOrderRow[] }) {
  const top = rows[0];
  return (
    <InsightCard title="Which section to start with" sub="Ranked by correct answers per minute you spend on each subject">
      {!top ? (
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>Answer some questions to see this.</p>
      ) : (
        <>
          <p style={{ fontSize: 14, color: 'var(--gray-900)', marginBottom: 10 }}>
            Start with <strong style={{ color: SUBJECT_COLOR[top.subject] ?? 'var(--gray-900)' }}>{top.subject}</strong>: you get the most right per minute there.
          </p>
          {rows.map((r, i) => (
            <div key={r.subject} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderTop: '1px solid var(--gray-100)' }}>
              <span style={{ color: 'var(--gray-700)' }}>{i + 1}. {r.subject}</span>
              <span style={{ color: 'var(--gray-500)', fontVariantNumeric: 'tabular-nums' }}>{r.accuracy}% accuracy · {r.correctPerMinute} per min</span>
            </div>
          ))}
        </>
      )}
    </InsightCard>
  );
}

/* Your average against every student's average on this platform. Not an NTA percentile. */
export function StandingCard({ standing }: { standing: StandingData }) {
  return (
    <InsightCard title="Platform standing" sub="Against other students on this platform only, not an official NTA percentile">
      {standing.available ? (
        <>
          <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--gray-900)', fontVariantNumeric: 'tabular-nums' }}>
            Top {Math.max(1, 100 - standing.percentile)}%
          </div>
          <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4 }}>
            Rank {standing.rank} of {standing.of} students · you are ahead of {standing.percentile}% of them · your average {standing.mine}%
          </div>
        </>
      ) : (
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
          {standing.mine === null
            ? 'Take a mock to see where you stand.'
            : `Standing appears once ${standing.needed} students have mocks in this exam. ${standing.students} so far.`}
        </p>
      )}
    </InsightCard>
  );
}

/* Your score against each published 2026 cutoff line, with sources */
export function CutoffCard({ cutoffs, scoreLabel }: { cutoffs: CutoffData | null; scoreLabel: string }) {
  if (!cutoffs) {
    return (
      <InsightCard title="Cutoff check" sub="2026 published cutoffs">
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
          No verified 2026 cutoff is available for this exam, so none is shown.
        </p>
      </InsightCard>
    );
  }
  return (
    <InsightCard title="Cutoff check" sub={`For your latest exam: ${cutoffs.name}. Compared as a percentage of maximum marks.`}>
      {cutoffs.lines === null ? (
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>Take a mock to compare with the cutoff.</p>
      ) : (
        cutoffs.lines.map((line) => (
          <div key={line.label} style={{ padding: '10px 0', borderTop: '1px solid var(--gray-100)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
              <span style={{ color: 'var(--gray-900)', fontWeight: 500 }}>{line.label}</span>
              <span style={{ color: line.status === 'above' ? 'var(--green-600)' : 'var(--red-600)', fontWeight: 600 }}>
                {line.status === 'above' ? 'Above' : 'Below'} · cutoff {line.cutoffPct}%
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
              {scoreLabel} {line.scorePct}%
              {line.status === 'below' ? ` · ${line.gapPct} points to go` : ` · ${Math.abs(line.gapPct)} points above`}
            </div>
          </div>
        ))
      )}
      <p style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 12, lineHeight: 1.5 }}>
        Cutoffs come from published reports, not an official notice. Check the official NTA or IIT notice before relying on them.
        {' '}
        {cutoffs.sources.map((s) => (
          <a key={s.url} href={s.url} target="_blank" rel="noreferrer" style={{ color: 'var(--gray-600)', textDecoration: 'underline', marginRight: 8 }}>
            {s.label}
          </a>
        ))}
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
