'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { api } from '@/lib/api';
import { isAuthenticated, getUser } from '@/lib/auth';
import type { DashboardData, WeeklyPoint } from '@/types';

/* ── Accuracy ring ───────────────────────────────────────── */
function AccuracyRing({ pct }: { pct: number }) {
  const r = 46;
  const circ = 2 * Math.PI * r;
  const fill = (pct / 100) * circ;
  return (
    <svg width={120} height={120}>
      <circle cx={60} cy={60} r={r} fill="none"
        stroke="rgba(255,255,255,0.13)" strokeWidth={9}
        transform="rotate(-90 60 60)" />
      <circle cx={60} cy={60} r={r} fill="none"
        stroke="rgba(255,255,255,0.92)" strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray={`${fill} ${circ}`}
        transform="rotate(-90 60 60)"
        style={{ transition: 'stroke-dasharray 1.1s ease' }} />
    </svg>
  );
}

/* ── Sparkline ───────────────────────────────────────────── */
function Sparkline({ data }: { data: WeeklyPoint[] }) {
  const W = 260; const H = 72; const PAD = 8;
  const max = Math.max(...data.map((d) => d.total), 1);
  const n = data.length;
  const xOf = (i: number) => PAD + (i / Math.max(n - 1, 1)) * (W - PAD * 2);
  const yOf = (v: number) => H - PAD - (v / max) * (H - PAD * 2);
  const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

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
  const area = (pts: [number, number][]) =>
    smooth(pts) + ` L${pts[pts.length - 1]![0]} ${H} L${pts[0]![0]} ${H} Z`;

  return (
    <svg width={W} height={H + 22} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="gT" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--gray-300)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--gray-300)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--navy-500)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--navy-500)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area(totalPts)} fill="url(#gT)" />
      <path d={smooth(totalPts)} fill="none" stroke="var(--gray-300)" strokeWidth="1.5" />
      <path d={area(correctPts)} fill="url(#gC)" />
      <path d={smooth(correctPts)} fill="none" stroke="var(--navy-500)" strokeWidth="2" strokeLinecap="round" />
      {data.map((d, i) => (
        <text key={d.date} x={xOf(i)} y={H + 17} textAnchor="middle"
          fill="var(--gray-400)" fontSize="11" fontFamily="Inter, sans-serif">
          {DAYS[new Date(d.date).getDay()]}
        </text>
      ))}
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

  const SUBJ: Record<string, string> = {
    Physics:     'var(--navy-600)',
    Chemistry:   '#16a34a',
    Mathematics: '#7c3aed',
  };

  const weekDots: { total: number }[] = data?.weeklyStats ?? Array(7).fill({ total: 0 });

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main dash-page-main">

        {/* ════════════════ HERO ════════════════ */}
        <div className="dash-hero">

          {/* Left: greeting */}
          <div className="dash-hero-left">
            <p className="dash-greeting">{greeting}</p>
            <p className="dash-name" suppressHydrationWarning>
              {firstName || 'Student'}
            </p>
            <p className="dash-date">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long', day: 'numeric', month: 'long',
              })}
            </p>
            {error && (
              <p style={{ fontSize: 12, color: '#fca5a5', marginTop: 10 }}>{error}</p>
            )}
          </div>

          {/* Center: accuracy ring */}
          <div className="dash-ring-wrap">
            {loading ? (
              <div className="dash-ring-ghost" />
            ) : (
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <AccuracyRing pct={accuracy} />
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <p style={{ fontSize: 26, fontWeight: 800, color: 'white', lineHeight: 1 }}>
                    {accuracy}%
                  </p>
                </div>
              </div>
            )}
            <p className="dash-ring-label">overall accuracy</p>
          </div>

          {/* Right: streak + counts */}
          <div className="dash-hero-right">
            <div>
              <p className="dash-streak-label">
                {streak > 0 ? `${streak}-day streak` : 'Start a streak'}
              </p>
              <div className="dash-streak-row">
                {weekDots.map((d, i) => (
                  <div key={i} className={`dash-dot${d.total > 0 ? ' on' : ''}`} />
                ))}
              </div>
            </div>

            <div className="dash-counts">
              {loading ? (
                <>
                  <div className="dash-count-ghost" />
                  <div className="dash-count-ghost" />
                </>
              ) : (
                <>
                  <div className="dash-count">
                    <span className="dash-count-n">{totalAttempts}</span>
                    <span className="dash-count-l">attempted</span>
                  </div>
                  <div className="dash-count-sep" />
                  <div className="dash-count">
                    <span className="dash-count-n">{weakCount}</span>
                    <span className="dash-count-l">weak areas</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ════════════════ BODY ════════════════ */}
        <div className="dash-body">

          {/* Sparkline + Subject bars */}
          <div className="dash-two-col">

            <div>
              <span className="dash-eyebrow">This week</span>
              <div className="dash-legend">
                <span><span className="dash-legend-line navy" />Correct</span>
                <span><span className="dash-legend-line gray" />Total</span>
              </div>
              {loading ? (
                <div className="dash-sparkline-ghost" />
              ) : data?.weeklyStats?.length ? (
                <Sparkline data={data.weeklyStats} />
              ) : (
                <p className="dash-empty">No data yet. Start practicing.</p>
              )}
            </div>

            <div>
              <span className="dash-eyebrow">By subject</span>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 4 }}>
                  {[80, 55, 70].map((w, i) => (
                    <div key={i} style={{ height: 14, width: `${w}%`, background: 'var(--gray-100)', borderRadius: 4 }} />
                  ))}
                </div>
              ) : !data?.subjectAccuracy.length ? (
                <p className="dash-empty">Practice to see subject breakdown.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 4 }}>
                  {data.subjectAccuracy.map((s) => (
                    <div key={s.subject}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-700)', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: SUBJ[s.subject] ?? 'var(--gray-400)', display: 'inline-block', flexShrink: 0 }} />
                          {s.subject}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: s.accuracy >= 60 ? 'var(--green-600)' : 'var(--red-600)' }}>
                          {s.accuracy}%
                        </span>
                      </div>
                      <div style={{ height: 5, background: 'var(--gray-100)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${s.accuracy}%`, background: SUBJ[s.subject] ?? 'var(--gray-400)', borderRadius: 99, transition: 'width 0.9s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Weak area chips */}
          {!loading && (data?.weakAreas.length ?? 0) > 0 && (
            <div className="dash-weak-section">
              <span className="dash-eyebrow">Needs work</span>
              <div className="dash-chips">
                {data!.weakAreas.slice(0, 8).map((w) => (
                  <span key={w.id} className="dash-chip">
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: SUBJ[w.subject] ?? 'var(--gray-400)', display: 'inline-block', flexShrink: 0 }} />
                    {w.topicName}
                    <span style={{ color: 'var(--red-600)', fontWeight: 600 }}>
                      {Math.round(w.successRate * 100)}%
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="dash-cta">
            <Link href="/practice" className="btn btn-primary dash-cta-btn">
              Start your session
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
