'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { api } from '@/lib/api';
import { isAuthenticated, getUser } from '@/lib/auth';
import type { DashboardData, WeeklyPoint } from '@/types';

/* ── Mini sparkline ──────────────────────────────────────── */
function Sparkline({ data }: { data: WeeklyPoint[] }) {
  const W = 220; const H = 56; const PAD = 4;
  const max = Math.max(...data.map((d) => d.total), 1);
  const n = data.length;
  const xOf = (i: number) => PAD + (i / Math.max(n - 1, 1)) * (W - PAD * 2);
  const yOf = (v: number) => H - PAD - (v / max) * (H - PAD * 2);

  function smooth(pts: [number, number][]) {
    if (pts.length < 2) return '';
    let d = `M${pts[0]![0]} ${pts[0]![1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1]!;
      const [cx, cy] = pts[i]!;
      const mid = (px + cx) / 2;
      d += ` C${mid} ${py} ${mid} ${cy} ${cx} ${cy}`;
    }
    return d;
  }

  const totalPts = data.map((d, i): [number, number] => [xOf(i), yOf(d.total)]);
  const correctPts = data.map((d, i): [number, number] => [xOf(i), yOf(d.correct)]);
  const areaFill = (pts: [number, number][]) =>
    pts.length < 2 ? '' : smooth(pts) + ` L${pts[pts.length - 1]![0]} ${H} L${pts[0]![0]} ${H} Z`;

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <linearGradient id="spGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaFill(totalPts)} fill="var(--gray-100)" />
      <path d={smooth(totalPts)} fill="none" stroke="var(--gray-200)" strokeWidth="1.5" />
      <path d={areaFill(correctPts)} fill="url(#spGrad)" />
      <path d={smooth(correctPts)} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Subject donut ───────────────────────────────────────── */
function SubjectDonut({ pct, color }: { pct: number; color: string }) {
  const r = 22; const circ = 2 * Math.PI * r;
  return (
    <svg width={56} height={56}>
      <circle cx={28} cy={28} r={r} fill="none" stroke="var(--gray-100)" strokeWidth={6} />
      <circle cx={28} cy={28} r={r} fill="none"
        stroke={color} strokeWidth={6} strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * circ} ${circ}`}
        transform="rotate(-90 28 28)"
        style={{ transition: 'stroke-dasharray 0.9s ease' }} />
      <text x={28} y={32} textAnchor="middle" fontSize="11" fontWeight="700"
        fill={color} fontFamily="Inter, sans-serif">{pct}%</text>
    </svg>
  );
}

/* ── Main ────────────────────────────────────────────────── */
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setUser(getUser());
    if (!isAuthenticated()) { router.push('/login'); return; }
    api.dashboard.data()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] ?? '';

  const accuracy      = data?.stats.accuracy ?? 0;
  const totalAttempts = data?.stats.totalAttempts ?? 0;
  const weakCount     = data?.weakAreas.length ?? 0;

  const streak = (() => {
    if (!data?.weeklyStats?.length) return 0;
    const sorted = [...data.weeklyStats].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    let c = 0;
    for (const d of sorted) { if (d.total > 0) c++; else break; }
    return c;
  })();

  const SUBJ_CFG: Record<string, { color: string; bg: string; icon: string }> = {
    Physics:     { color: '#2563eb', bg: '#eff6ff', icon: '⚛' },
    Chemistry:   { color: '#16a34a', bg: '#f0fdf4', icon: '⚗' },
    Mathematics: { color: '#7c3aed', bg: '#f5f3ff', icon: '∑' },
  };

  const kpis = [
    {
      label: 'Questions done',
      value: loading ? '—' : String(totalAttempts),
      sub: loading ? '' : `${data?.stats.correctAttempts ?? 0} correct`,
      color: '#2563eb', bg: '#eff6ff',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
        </svg>
      ),
    },
    {
      label: 'Accuracy',
      value: loading ? '—' : `${accuracy}%`,
      sub: accuracy >= 60 ? 'Keep it up!' : 'Room to grow',
      color: accuracy >= 60 ? '#16a34a' : '#dc2626',
      bg: accuracy >= 60 ? '#f0fdf4' : '#fef2f2',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
      ),
    },
    {
      label: 'Day streak',
      value: loading ? '—' : String(streak),
      sub: streak > 0 ? 'Keep the streak!' : 'Practice today',
      color: '#d97706', bg: '#fffbeb',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      ),
    },
    {
      label: 'Weak areas',
      value: loading ? '—' : String(weakCount),
      sub: weakCount === 0 ? 'Nothing flagged' : 'Need attention',
      color: '#dc2626', bg: '#fef2f2',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">

        {/* ── Greeting ── */}
        <div className="db-greeting-row">
          <div>
            <p className="db-greeting-label">{greeting}</p>
            <h1 className="db-greeting-name" suppressHydrationWarning>
              {firstName || 'Student'} 👋
            </h1>
          </div>
          <p className="db-greeting-date">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {error && (
          <div className="badge badge-red" style={{ marginBottom: 20 }}>{error}</div>
        )}

        {/* ── KPI row ── */}
        <div className="db-kpi-row">
          {kpis.map((k) => (
            <div key={k.label} className="db-kpi-card">
              <div className="db-kpi-icon" style={{ background: k.bg, color: k.color }}>
                {k.icon}
              </div>
              <div className="db-kpi-value" style={{ color: k.color }}>{k.value}</div>
              <div className="db-kpi-label">{k.label}</div>
              {k.sub && <div className="db-kpi-sub">{k.sub}</div>}
            </div>
          ))}
        </div>

        {/* ── Mid section: chart + subjects ── */}
        <div className="db-mid-row">

          {/* Activity chart */}
          <div className="db-card db-chart-card">
            <div className="db-card-header">
              <div>
                <p className="db-card-title">Weekly activity</p>
                <p className="db-card-sub">Questions attempted this week</p>
              </div>
              <div className="db-chart-legend">
                <span style={{ color: '#3b82f6' }}>
                  <span className="db-legend-dot" style={{ background: '#3b82f6' }} />Correct
                </span>
                <span style={{ color: 'var(--gray-400)' }}>
                  <span className="db-legend-dot" style={{ background: 'var(--gray-200)' }} />Total
                </span>
              </div>
            </div>
            <div className="db-chart-area">
              {loading ? (
                <div className="db-skeleton-block" style={{ height: 56 }} />
              ) : data?.weeklyStats?.length ? (
                <Sparkline data={data.weeklyStats} />
              ) : (
                <p className="db-empty-msg">No data yet. Start practicing.</p>
              )}
            </div>
            {/* Day labels */}
            {!loading && data?.weeklyStats?.length ? (
              <div className="db-day-labels">
                {data.weeklyStats.map((d) => (
                  <span key={d.date}>
                    {['Su','Mo','Tu','We','Th','Fr','Sa'][new Date(d.date).getDay()]}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* Subject cards */}
          <div className="db-subjects">
            <p className="db-section-title">Subject mastery</p>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[0,1,2].map(i => <div key={i} className="db-skeleton-block" style={{ height: 76 }} />)}
              </div>
            ) : !data?.subjectAccuracy.length ? (
              <p className="db-empty-msg">Practice across subjects to see breakdown.</p>
            ) : (
              data.subjectAccuracy.map((s) => {
                const cfg = SUBJ_CFG[s.subject] ?? { color: 'var(--gray-500)', bg: 'var(--gray-50)', icon: '?' };
                return (
                  <div key={s.subject} className="db-subj-card">
                    <div className="db-subj-left">
                      <span className="db-subj-icon" style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.icon}
                      </span>
                      <div>
                        <p className="db-subj-name">{s.subject}</p>
                        <p className="db-subj-meta">{s.attempts} question{s.attempts !== 1 ? 's' : ''} attempted</p>
                      </div>
                    </div>
                    <SubjectDonut pct={s.accuracy} color={cfg.color} />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Weak areas ── */}
        {!loading && (data?.weakAreas.length ?? 0) > 0 && (
          <div className="db-card db-weak-card">
            <div className="db-card-header" style={{ marginBottom: 14 }}>
              <div>
                <p className="db-card-title">Focus areas</p>
                <p className="db-card-sub">Topics where you scored below 60%</p>
              </div>
            </div>
            <div className="db-weak-list">
              {data!.weakAreas.slice(0, 6).map((w) => {
                const cfg = SUBJ_CFG[w.subject] ?? { color: 'var(--gray-500)', bg: 'var(--gray-50)', icon: '?' };
                const pct = Math.round(w.successRate * 100);
                return (
                  <div key={w.id} className="db-weak-item">
                    <span className="db-subj-icon" style={{ background: cfg.bg, color: cfg.color, fontSize: 14, width: 28, height: 28 }}>
                      {cfg.icon}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="db-weak-topic">{w.topicName}</p>
                      <p className="db-subj-meta">{w.subject}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: 16, fontWeight: 700, color: pct < 40 ? 'var(--red-600)' : 'var(--amber-600)', lineHeight: 1 }}>{pct}%</p>
                      <p className="db-subj-meta">{w.attempts} attempts</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── CTA ── */}
        <div className="db-cta-row">
          <Link href="/practice" className="btn btn-primary db-cta-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Start practice session
          </Link>
          <p className="db-cta-hint">Picks topics based on your weak areas</p>
        </div>

      </main>
    </div>
  );
}
