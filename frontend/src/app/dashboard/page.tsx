'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { api } from '@/lib/api';
import { isAuthenticated, getUser } from '@/lib/auth';
import type { DashboardData, WeeklyPoint } from '@/types';

/* ── Mini bar chart ──────────────────────────────────── */
function WeeklyBarChart({ data }: { data: WeeklyPoint[] }) {
  const max = Math.max(...data.map((d) => d.total), 1);
  const barW = 28;
  const gap  = 8;
  const h    = 72;
  const w    = data.length * (barW + gap) - gap;
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <svg width={w} height={h + 22} aria-label="Weekly practice chart">
      {data.map((d, i) => {
        const x       = i * (barW + gap);
        const bgH     = Math.max((d.total / max) * h, d.total > 0 ? 4 : 2);
        const fillH   = Math.max((d.correct / max) * h, d.correct > 0 ? 4 : 0);
        const date    = new Date(d.date);

        return (
          <g key={d.date}>
            {/* background bar */}
            <rect x={x} y={h - bgH} width={barW} height={bgH}
              fill="var(--gray-100)" rx={4} />
            {/* correct bar */}
            {fillH > 0 && (
              <rect x={x} y={h - fillH} width={barW} height={fillH}
                fill="var(--primary)" rx={4} />
            )}
            <text x={x + barW / 2} y={h + 16} textAnchor="middle"
              fill="var(--gray-400)" fontSize="11" fontFamily="Inter, sans-serif">
              {days[date.getDay()]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Skeleton row ────────────────────────────────────── */
function SkeletonRow({ w }: { w: string }) {
  return <div className="skeleton" style={{ height: 14, width: w, borderRadius: 6 }} />;
}

export default function DashboardPage() {
  const router = useRouter();
  const user   = getUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    api.progress.dashboard()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const statCards = data
    ? [
        { label: 'Questions attempted', value: data.stats.totalAttempts },
        { label: 'Correct answers',     value: data.stats.correctAttempts },
        { label: 'Accuracy',            value: `${data.stats.accuracy}%` },
        { label: 'Weak areas',          value: data.weakAreas.length },
      ]
    : [];

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">

        {/* ── Header ── */}
        <div className="page-header">
          <h1 className="page-title">{greeting}{user ? `, ${user.name.split(' ')[0]}` : ''}</h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {error && (
          <div className="badge badge-red" style={{ marginBottom: 20, fontSize: 13 }}>{error}</div>
        )}

        {/* ── Stat cards ── */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="stat-card">
                  <SkeletonRow w="60%" />
                  <div className="stat-value skeleton" style={{ height: 36, width: '50%', margin: '8px 0 4px' }} />
                  <SkeletonRow w="40%" />
                </div>
              ))
            : statCards.map((s) => (
                <div key={s.label} className="stat-card">
                  <p className="stat-label">{s.label}</p>
                  <p className="stat-value">{s.value}</p>
                </div>
              ))}
        </div>

        <div className="dashboard-grid-main" style={{ marginBottom: 28 }}>
          {/* ── Weekly chart ── */}
          <div className="chart-wrap">
            <p className="chart-label">Practice this week</p>
            <p className="chart-sublabel">
              <span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--primary)', borderRadius: 2, marginRight: 5 }} />
              Correct
              <span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--gray-100)', borderRadius: 2, marginRight: 5, marginLeft: 12 }} />
              Total
            </p>
            {loading
              ? <div className="skeleton" style={{ height: 94, borderRadius: 8 }} />
              : data?.weeklyStats && <WeeklyBarChart data={data.weeklyStats} />}
          </div>

          {/* ── Subject accuracy ── */}
          <div className="chart-wrap">
            <p className="chart-label">Subject accuracy</p>
            <p className="chart-sublabel">Based on all attempts</p>
            {loading
              ? <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[0,1,2].map(i => <SkeletonRow key={i} w="100%" />)}
                </div>
              : (
                <div style={{ marginTop: 4 }}>
                  {(data?.subjectAccuracy ?? []).length === 0
                    ? <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>No data yet. Start practicing.</p>
                    : data?.subjectAccuracy.map((s) => (
                        <div key={s.subject} className="subject-row">
                          <span className="subject-name">{s.subject.slice(0, 4)}</span>
                          <div className="progress-track flex-1">
                            <div
                              className={`progress-fill${s.accuracy >= 60 ? ' green' : ' red'}`}
                              style={{ width: `${s.accuracy}%` }}
                            />
                          </div>
                          <span className="subject-pct">{s.accuracy}%</span>
                        </div>
                      ))}
                </div>
              )}
          </div>
        </div>

        <div className="dashboard-grid-bottom">
          {/* ── Weak areas ── */}
          <div className="chart-wrap">
            <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
              <p className="chart-label" style={{ margin: 0 }}>Weak areas</p>
              <Link href="/progress" className="btn btn-ghost btn-sm">View all</Link>
            </div>
            {loading
              ? <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[0,1,2].map(i => <SkeletonRow key={i} w="90%" />)}
                </div>
              : data?.weakAreas.length === 0
                ? <p style={{ fontSize: 13, color: 'var(--gray-500)', padding: '8px 0' }}>
                    No weak areas yet. Keep practicing!
                  </p>
                : data?.weakAreas.map((w) => (
                    <div key={w.id} className="activity-item">
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 2 }}>
                          {w.topicName}
                        </p>
                        <p className="activity-meta">{w.subject} · {Math.round(w.successRate * 100)}% accuracy · {w.attempts} attempts</p>
                      </div>
                      <span className="badge badge-red" style={{ marginLeft: 'auto', flexShrink: 0 }}>weak</span>
                    </div>
                  ))}
          </div>

          {/* ── Recent activity ── */}
          <div className="chart-wrap">
            <p className="chart-label" style={{ marginBottom: 14 }}>Recent activity</p>
            {loading
              ? <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[0,1,2].map(i => <SkeletonRow key={i} w="85%" />)}
                </div>
              : data?.recentActivity.length === 0
                ? <p style={{ fontSize: 13, color: 'var(--gray-500)', padding: '8px 0' }}>
                    No activity yet.
                  </p>
                : data?.recentActivity.map((a) => (
                    <div key={a.id} className="activity-item">
                      <span className={`activity-dot${a.isCorrect ? ' correct' : ' wrong'}`} />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)' }}>
                          {a.question.topic}
                        </p>
                        <p className="activity-meta">
                          {a.question.subject} · {a.question.difficulty} · {a.timeSpent}s
                        </p>
                      </div>
                    </div>
                  ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{ marginTop: 28, display: 'flex', gap: 10 }}>
          <Link href="/practice" className="btn btn-primary">Start practicing</Link>
          <Link href="/progress" className="btn btn-outline">View full progress</Link>
        </div>

      </main>
    </div>
  );
}
