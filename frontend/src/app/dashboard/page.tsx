'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { api } from '@/lib/api';
import { isAuthenticated, getUser } from '@/lib/auth';
import type { DashboardData, WeeklyPoint } from '@/types';

/* ── Weekly bar chart ───────────────────────────────────── */
function WeeklyBars({ data }: { data: WeeklyPoint[] }) {
  const max = Math.max(...data.map((d) => d.total), 1);
  const DAY = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80, width: '100%' }}>
      {data.map((d, i) => {
        const totalPct  = (d.total   / max) * 100;
        const correctPct = (d.correct / max) * 100;
        const isToday   = i === data.length - 1;
        const dayLabel  = DAY[new Date(d.date).getDay()] ?? '';
        return (
          <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
            <div style={{ width: '100%', position: 'relative', height: `${Math.max(totalPct, 4)}%`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              {/* total bar (gray background) */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '100%',
                background: d.total > 0 ? '#e2e8f0' : '#f1f5f9',
                borderRadius: '3px 3px 0 0',
              }} />
              {/* correct bar (blue fill) */}
              {d.correct > 0 && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: `${(d.correct / d.total) * 100}%`,
                  background: isToday ? '#2563eb' : '#3b82f6',
                  borderRadius: '3px 3px 0 0',
                }} />
              )}
            </div>
            <span style={{
              fontSize: 10, fontWeight: isToday ? 700 : 400,
              color: isToday ? '#2563eb' : 'var(--gray-400)',
              lineHeight: 1,
            }}>{dayLabel}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Subject donut ───────────────────────────────────────── */
function SubjectDonut({ pct, color }: { pct: number; color: string }) {
  const r = 26; const circ = 2 * Math.PI * r;
  return (
    <svg width={64} height={64}>
      <circle cx={32} cy={32} r={r} fill="none" stroke="var(--gray-100)" strokeWidth={6} />
      <circle cx={32} cy={32} r={r} fill="none"
        stroke={color} strokeWidth={6} strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * circ} ${circ}`}
        transform="rotate(-90 32 32)"
        style={{ transition: 'stroke-dasharray 0.9s ease' }} />
      <text x={32} y={37} textAnchor="middle" fontSize="12" fontWeight="800"
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
      value: loading ? '...' : String(totalAttempts),
      sub: loading ? '' : `${data?.stats.correctAttempts ?? 0} correct`,
      color: '#2563eb',
      shadow: 'rgba(37,99,235,.12)',
      icon: (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
        </svg>
      ),
    },
    {
      label: 'Accuracy',
      value: loading ? '...' : `${accuracy}%`,
      sub: accuracy >= 60 ? 'Keep it up!' : 'Room to grow',
      color: accuracy >= 60 ? '#16a34a' : '#dc2626',
      shadow: accuracy >= 60 ? 'rgba(22,163,74,.12)' : 'rgba(220,38,38,.12)',
      icon: (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
      ),
    },
    {
      label: 'Day streak',
      value: loading ? '...' : String(streak),
      sub: streak > 0 ? 'Keep the streak!' : 'Practice today',
      color: '#d97706',
      shadow: 'rgba(217,119,6,.12)',
      icon: (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      ),
    },
    {
      label: 'Weak areas',
      value: loading ? '...' : String(weakCount),
      sub: weakCount === 0 ? 'All clear!' : 'Need attention',
      color: weakCount === 0 ? '#16a34a' : '#dc2626',
      shadow: weakCount === 0 ? 'rgba(22,163,74,.12)' : 'rgba(220,38,38,.12)',
      icon: (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
              <span className="db-kpi-watermark" style={{ color: k.color }}>{k.icon}</span>
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
                <div className="db-skeleton-block" style={{ height: 80 }} />
              ) : data?.weeklyStats?.length ? (
                <WeeklyBars data={data.weeklyStats} />
              ) : (
                <p className="db-empty-msg">No data yet. Start practicing.</p>
              )}
            </div>
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
              <Link
                href="/practice?mode=weak"
                className="btn btn-primary btn-sm"
                style={{ flexShrink: 0 }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Practice weak areas
              </Link>
            </div>
            <div className="db-weak-list">
              {data!.weakAreas.slice(0, 6).map((w) => {
                const cfg = SUBJ_CFG[w.subject] ?? { color: 'var(--gray-500)', bg: 'var(--gray-50)', icon: '?' };
                const pct = Math.round(w.successRate * 100);
                const badgeColor = pct < 40 ? '#dc2626' : '#d97706';
                const badgeBg    = pct < 40 ? '#fef2f2' : '#fffbeb';
                return (
                  <div key={w.id} className="db-weak-item">
                    <span className="db-subj-icon" style={{ background: cfg.bg, color: cfg.color, fontSize: 14, width: 30, height: 30, flexShrink: 0 }}>
                      {cfg.icon}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="db-weak-topic">{w.topicName}</p>
                      <p className="db-subj-meta">{w.subject} · {w.attempts} attempt{w.attempts !== 1 ? 's' : ''}</p>
                    </div>
                    <span className="db-weak-pct" style={{ color: badgeColor, background: badgeBg }}>{pct}%</span>
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
