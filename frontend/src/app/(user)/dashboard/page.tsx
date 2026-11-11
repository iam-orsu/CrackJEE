'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { api } from '@/lib/api';
import { isAuthenticated, getUser } from '@/lib/auth';
import type { DashboardData, WeeklyPoint, MockWeakTopic, LeaderboardData, MockInsights, TopicStat } from '@/types';
import { Ring, ProjectionCard, StandingCard, CutoffCard, MonthlyBars, TopicList, NegativesCard, TimeByTypeCard, SectionOrderCard, PracticeLink, CarelessCard, GuessingCard, ImprovementCard, CrackabilityCard } from '@/components/insights/InsightBlocks';
import styles from './dashboard.module.css';
import { SUBJECT_COLOR } from '@/lib/subjects';
import { plural } from './helpers';
import { FocusAreas } from './FocusAreas';

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const COLOR_PLATFORM = '#94a3b8';
const COLOR_TOP = '#16a34a';
const PREVIOUS_COLOR = '#cbd5e1';

interface LaggingRow {
  key: string;
  topic: string;
  pct: number;
}

function niceMax(value: number): number {
  if (value <= 4) return 4;
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const n = value / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

// Botany and Zoology are one "Biology" card for NEET students
function groupOf(subject: string): string {
  return subject === 'Botany' || subject === 'Zoology' ? 'Biology' : subject;
}

// Raw subject names that a card covers
function rawSubjectsOf(group: string): string[] {
  return group === 'Biology' ? ['Botany', 'Zoology', 'Biology'] : [group];
}

function toneColor(pct: number): string {
  if (pct >= 60) return 'var(--green-600)';
  if (pct >= 40) return 'var(--amber-600)';
  return 'var(--red-600)';
}

/* Smooth catmull-rom → cubic bezier path through points */
function smoothPath(pts: Array<{ x: number; y: number }>, t = 0.4): string {
  if (pts.length < 2) return '';
  const parts = [`M ${pts[0]!.x},${pts[0]!.y}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[Math.min(pts.length - 1, i + 2)]!;
    const cp1x = p1.x + (p2.x - p0.x) * t / 3;
    const cp1y = p1.y + (p2.y - p0.y) * t / 3;
    const cp2x = p2.x - (p3.x - p1.x) * t / 3;
    const cp2y = p2.y - (p3.y - p1.y) * t / 3;
    parts.push(`C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`);
  }
  return parts.join(' ');
}

/* ── Weekly chart — gradient area ───────────────────────────────── */
function WeeklyChart({ data }: { data: WeeklyPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = niceMax(Math.max(...data.map((d) => d.total), 1));

  const W = 640, H = 200, PL = 34, PR = 16, PT = 12, PB = 28;
  const plotW = W - PL - PR;
  const plotH = H - PT - PB;
  const xFor = (i: number) => PL + (i / Math.max(data.length - 1, 1)) * plotW;
  const yFor = (v: number) => PT + plotH - (v / max) * plotH;
  const bottom = PT + plotH;
  const ticks = [0, Math.round(max / 2), max];

  const totalPts = data.map((d, i) => ({ x: xFor(i), y: yFor(d.total) }));
  const correctPts = data.map((d, i) => ({ x: xFor(i), y: yFor(d.correct) }));
  const totalLine = smoothPath(totalPts);
  const correctLine = smoothPath(correctPts);
  const totalArea = totalLine + ` L ${totalPts[totalPts.length - 1]!.x},${bottom} L ${totalPts[0]!.x},${bottom} Z`;
  const correctArea = correctLine + ` L ${correctPts[correctPts.length - 1]!.x},${bottom} L ${correctPts[0]!.x},${bottom} Z`;
  const hovered = hover !== null ? data[hover] : null;

  return (
    <div className={styles.chart}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Questions attempted per day this week">
        <defs>
          <linearGradient id="wk-total-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2c3e50" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#2c3e50" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wk-correct-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16a34a" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((t) => (
          <g key={t}>
            <line x1={PL} x2={W - PR} y1={yFor(t)} y2={yFor(t)} className={styles.gridLine} />
            <text x={PL - 8} y={yFor(t)} dy="0.32em" textAnchor="end" className={styles.tick}>{t}</text>
          </g>
        ))}

        {/* Area fills */}
        {data.some((d) => d.total > 0) && (
          <>
            <path d={totalArea} fill="url(#wk-total-grad)" />
            <path d={correctArea} fill="url(#wk-correct-grad)" />
            <path d={totalLine} fill="none" stroke="#2c3e50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
            <path d={correctLine} fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}

        {/* Hover hit areas + day labels + dots */}
        {data.map((d, i) => {
          const cx = xFor(i);
          const isToday = i === data.length - 1;
          return (
            <g key={d.date}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0}
            >
              <rect x={cx - 36} y={PT} width={72} height={plotH} fill="transparent" />
              {hover === i && d.total > 0 && (
                <line x1={cx} x2={cx} y1={PT} y2={bottom} stroke="var(--gray-200)" strokeWidth="1" strokeDasharray="4 3" />
              )}
              {d.total > 0 && (
                <circle cx={cx} cy={yFor(d.total)} r={hover === i ? 5 : 3} fill="#2c3e50" opacity="0.5" />
              )}
              {d.correct > 0 && (
                <circle cx={cx} cy={yFor(d.correct)} r={hover === i ? 5.5 : 3.5} fill="#16a34a" stroke="#fff" strokeWidth="1.5" />
              )}
              <text x={cx} y={H - 6} textAnchor="middle" className={isToday ? styles.dayToday : styles.day}>
                {DAY_SHORT[new Date(d.date + 'T00:00:00').getDay()]}
              </text>
            </g>
          );
        })}
      </svg>

      {hovered && hover !== null && (
        <div className={styles.tooltip} style={{ left: `${((xFor(hover)) / W) * 100}%` }}>
          <div className={styles.tooltipTitle}>
            {new Date(hovered.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
          <div className={styles.tooltipValue}>
            {hovered.total === 0 ? 'No questions' : `${hovered.correct} correct of ${plural(hovered.total, 'question')}`}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Score history: area + line chart, dot per mock ─────────────── */
function ScoreHistoryChart({ history }: { history: Array<{ date: string; pct: number }> }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 640, H = 200, PL = 34, PR = 16, PT = 12, PB = 28;
  const plotW = W - PL - PR;
  const plotH = H - PT - PB;
  const n = history.length;
  const xFor = (i: number) => PL + (i / Math.max(n - 1, 1)) * plotW;
  const yFor = (v: number) => PT + plotH - (v / 100) * plotH;
  const bottom = PT + plotH;
  const ticks = [0, 25, 50, 75, 100];
  const pts = history.map((h, i) => ({ x: xFor(i), y: yFor(h.pct) }));
  const linePath = smoothPath(pts);
  const areaPath = linePath + ` L ${pts[pts.length - 1]!.x},${bottom} L ${pts[0]!.x},${bottom} Z`;

  return (
    <div className={styles.chart}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Mock score history">
        <defs>
          <linearGradient id="hist-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 60% target line */}
        <line x1={PL} x2={W - PR} y1={yFor(60)} y2={yFor(60)} stroke="#16a34a" strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />
        <text x={W - PR - 2} y={yFor(60) - 5} textAnchor="end" fontSize={10} fill="#16a34a" opacity="0.7">target 60%</text>

        {ticks.map((t) => (
          <g key={t}>
            <line x1={PL} x2={W - PR} y1={yFor(t)} y2={yFor(t)} className={styles.gridLine} />
            <text x={PL - 8} y={yFor(t)} dy="0.32em" textAnchor="end" className={styles.tick}>{t}%</text>
          </g>
        ))}

        {n >= 2 && (
          <>
            <path d={areaPath} fill="url(#hist-grad)" />
            <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}

        {history.map((h, i) => {
          const cx = xFor(i);
          const cy = yFor(h.pct);
          const color = h.pct >= 60 ? '#16a34a' : '#dc2626';
          const dateLabel = new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
          return (
            <g key={h.date}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0}
            >
              <rect x={cx - 30} y={PT} width={60} height={plotH} fill="transparent" />
              {hover === i && <line x1={cx} x2={cx} y1={PT} y2={bottom} stroke="var(--gray-200)" strokeWidth="1" strokeDasharray="4 3" />}
              <circle cx={cx} cy={cy} r={hover === i ? 6 : 4} fill={color} stroke="#fff" strokeWidth="2" style={{ transition: 'r 0.1s' }} />
              {hover === i && (
                <text x={cx} y={cy - 12} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{h.pct}%</text>
              )}
              <text x={cx} y={H - 6} textAnchor="middle" className={styles.day}>{dateLabel}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── One comparison row inside a subject card ─────────────────────── */
function MasteryRow({ label, pct, color, strong }: { label: string; pct: number | null; color: string; strong?: boolean }) {
  return (
    <div className={styles.masteryRow}>
      <span className={styles.masteryLabel}>{label}</span>
      <div className={styles.masteryTrack}>
        <div className={styles.masteryFill} style={{ width: `${pct ?? 0}%`, background: color }} />
      </div>
      <span className={styles.masteryValue} style={{ color: strong ? color : 'var(--gray-700)', fontWeight: strong ? 700 : 500 }}>
        {pct != null ? `${pct}%` : '—'}
      </span>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [mockWeakTopics, setMockWeakTopics] = useState<MockWeakTopic[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [insights, setInsights] = useState<MockInsights | null>(null);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [expandedMastery, setExpandedMastery] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setUser(getUser());
    if (!isAuthenticated()) { router.push('/login'); return; }
    Promise.all([
      api.dashboard.data(),
      api.stats.mockWeakAreas().catch(() => [] as MockWeakTopic[]),
      api.stats.leaderboard().catch(() => null),
      api.stats.mockInsights().catch(() => null),
    ])
      .then(([dashData, weakTopics, lb, insightData]) => {
        setData(dashData);
        setMockWeakTopics(weakTopics);
        setLeaderboard(lb);
        setInsights(insightData);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  const [greeting, setGreeting] = useState('');
  const [today, setToday] = useState('');
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
    setToday(new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
  }, []);
  const firstName = user?.name?.split(' ')[0] ?? '';

  const accuracy = data?.stats.accuracy ?? 0;
  const totalAttempts = data?.stats.totalAttempts ?? 0;
  const correctAttempts = data?.stats.correctAttempts ?? 0;
  const hasActivity = totalAttempts > 0;
  const isFreshUser = !loading && totalAttempts === 0 && mockWeakTopics.length === 0;

  // The exam you actually sit (from your latest mock) decides the subjects and leaderboard; your profile is the fallback
  const examType = data?.overall.examType ?? (user?.targetExam === 'NEET' ? 'NEET' : user?.targetExam === 'Advanced' ? 'Advanced' : 'Main');
  const examIsNEET = examType === 'NEET';

  const SUBJECTS: readonly string[] = examIsNEET
    ? ['Physics', 'Chemistry', 'Biology']
    : ['Physics', 'Chemistry', 'Mathematics'];

  // Group mock weak topics by subject
  const weakBySubject: Record<string, MockWeakTopic[]> = {};
  for (const t of mockWeakTopics) {
    if (!weakBySubject[t.subject]) weakBySubject[t.subject] = [];
    weakBySubject[t.subject].push(t);
  }
  const weakSubjects = Object.keys(weakBySubject).sort();
  const hasMockWeakAreas = weakSubjects.length > 0;

  // Lagging topics for a subject card, from mock exams only
  function laggingTopics(group: string): LaggingRow[] {
    return mockWeakTopics
      .filter((t) => groupOf(t.subject) === group)
      .map((t) => ({ key: `${t.subject}|${t.topic}`, topic: t.topic, pct: t.successRate }))
      .sort((a, b) => a.pct - b.pct);
  }

  // Leaderboard: pick exam type relevant to user
  const lbData = leaderboard?.[examType] ?? null;

  function buildPracticeUrl(subject: string): string {
    const isNEET = ['Botany', 'Zoology', 'Biology'].includes(subject);
    const basePath = isNEET ? '/neet/practice' : '/practice';
    const subjectMap: Record<string, string[]> = {};
    for (const raw of rawSubjectsOf(subject)) {
      const topics = weakBySubject[raw]?.map((t) => t.topic) ?? [];
      if (topics.length > 0) subjectMap[raw] = topics;
    }
    const subjects = Object.keys(subjectMap);
    if (subjects.length === 0) return basePath;
    const weakData = encodeURIComponent(JSON.stringify({ subjects, topics: subjectMap }));
    return `${basePath}?mode=mock_weak&weakData=${weakData}`;
  }

  const history = data?.history ?? [];

  // Practice link for a list of topics, grouped by subject; uses the practice page's weak-topic mode
  function revisePracticeUrl(topics: TopicStat[]): string {
    const bySubject: Record<string, string[]> = {};
    for (const t of topics) {
      if (!bySubject[t.subject]) bySubject[t.subject] = [];
      bySubject[t.subject]!.push(t.topic);
    }
    const basePath = examIsNEET ? '/neet/practice' : '/practice';
    const weakData = encodeURIComponent(JSON.stringify({ subjects: Object.keys(bySubject), topics: bySubject }));
    return `${basePath}?mode=mock_weak&weakData=${weakData}`;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <div className={styles.page}>

          {/* Header */}
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>{today}</p>
              <h1 className={styles.title}>
                {greeting}{firstName ? `, ${firstName}` : ''}
              </h1>
            </div>
            <Link href={user?.targetExam === 'NEET' ? '/neet/practice' : '/practice'} className={styles.primaryBtn}>
              Start practice
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </header>

          {error && <div className={styles.error}>{error}</div>}

          {/* Fresh-user CTA — shown instead of stats until first attempt */}
          {isFreshUser ? (
            <section className={styles.freshCta}>
              <div className={styles.freshCtaInner}>
                <div className={styles.freshCtaIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M7 8h10M7 12h6M16 16l2-2-2-2" />
                  </svg>
                </div>
                <div>
                  <p className={styles.freshCtaTitle}>No analytics yet</p>
                  <p className={styles.freshCtaSub}>
                    Take your first mock test to start tracking accuracy, weak areas, and time spent per question.
                  </p>
                </div>
                <Link href="/mock" className={`${styles.primaryBtn} ${styles.freshCtaBtn}`}>
                  Take a mock test
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </section>
          ) : (
            /* Stat strip — 3 KPI tiles */
            <section className={styles.statStrip} aria-label="Summary">
              {/* Tile 1: questions */}
              <div className={styles.stat} style={{ borderTop: '3px solid var(--gray-900)' }}>
                <p className={styles.statLabel}>Questions done</p>
                <p className={styles.statValue} style={{ fontVariantNumeric: 'tabular-nums' }}>{loading ? '–' : totalAttempts}</p>
                <p className={styles.statSub}>{loading ? ' ' : `${correctAttempts} correct`}</p>
              </div>
              {/* Tile 2: accuracy — ring */}
              <div className={styles.stat} style={{ borderTop: `3px solid ${hasActivity ? (accuracy >= 60 ? 'var(--green-600)' : accuracy >= 40 ? 'var(--amber-600)' : 'var(--red-600)') : 'var(--gray-300)'}` }}>
                <p className={styles.statLabel}>Accuracy</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                  {!loading && hasActivity && (
                    <Ring pct={accuracy} color={accuracy >= 60 ? 'var(--green-600)' : accuracy >= 40 ? 'var(--amber-600)' : 'var(--red-600)'} size={52} stroke={5} />
                  )}
                  <p className={`${styles.statValue} ${hasActivity && accuracy < 60 ? styles.statValueBad : ''} ${hasActivity && accuracy >= 60 ? styles.statValueGood : ''}`}
                    style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {loading ? '–' : `${accuracy}%`}
                  </p>
                </div>
                <p className={styles.statSub}>
                  {!hasActivity ? 'No attempts yet' : accuracy >= 60 ? 'On track ✓' : 'Below the 60% target'}
                </p>
              </div>
              {/* Tile 3: weak areas */}
              <div className={styles.stat} style={{ borderTop: `3px solid ${mockWeakTopics.length > 0 ? 'var(--red-600)' : 'var(--green-600)'}` }}>
                <p className={styles.statLabel}>Weak areas</p>
                <p className={styles.statValue} style={{ fontVariantNumeric: 'tabular-nums' }}>{loading ? '–' : mockWeakTopics.length}</p>
                <p className={styles.statSub}>
                  {loading ? ' ' : mockWeakTopics.length > 0 ? 'Topics under 60%' : 'None flagged ✓'}
                </p>
              </div>
            </section>
          )}

          {/* Left: weekly activity + score history · Right: subject mastery */}
          <div className={styles.grid}>
            <div className={styles.column}>
              <section className={styles.panel}>
                <div className={styles.panelHead}>
                  <div>
                    <h2 className={styles.panelTitle}>Weekly activity</h2>
                    <p className={styles.panelSub}>Questions attempted, last 7 days</p>
                  </div>
                  <div className={styles.legend}>
                    <span><span className={styles.legendDot} style={{ background: '#2c3e50' }} />Correct</span>
                    <span><span className={styles.legendDot} style={{ background: 'var(--gray-200)' }} />Attempted</span>
                  </div>
                </div>
                {loading ? (
                  <div className={styles.skeleton} style={{ height: 230 }} />
                ) : data?.weeklyStats?.length ? (
                  <WeeklyChart data={data.weeklyStats} />
                ) : (
                  <p className={styles.empty}>No activity yet this week.</p>
                )}
              </section>

              <section className={styles.panel}>
                <div className={styles.panelHead}>
                  <div>
                    <h2 className={styles.panelTitle}>Mock score history</h2>
                    <p className={styles.panelSub}>Each mock against the one before it</p>
                  </div>
                  <div className={styles.legend}>
                    <span><span className={styles.legendDot} style={{ background: PREVIOUS_COLOR }} />Previous mock</span>
                    <span><span className={styles.legendDot} style={{ background: COLOR_TOP }} />60% and above</span>
                    <span><span className={styles.legendDot} style={{ background: '#dc2626' }} />Below 60%</span>
                  </div>
                </div>
                {loading ? (
                  <div className={styles.skeleton} style={{ height: 230 }} />
                ) : history.length > 0 ? (
                  <ScoreHistoryChart history={history} />
                ) : (
                  <p className={styles.empty}>Submit a mock test to see your score history.</p>
                )}
              </section>
            </div>

            {/* Subject mastery: my average beside the platform average and the top scorer's average */}
            <section className={styles.panel}>
              <div className={styles.panelHead}>
                <div>
                  <h2 className={styles.panelTitle}>Subject mastery</h2>
                  <p className={styles.panelSub}>Average of all your mocks · tap a subject for lagging topics</p>
                </div>
              </div>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[0, 1, 2].map((i) => <div key={i} className={styles.skeleton} style={{ height: 96 }} />)}
                </div>
              ) : (
                <div className={styles.subjectList}>
                  {SUBJECTS.map((subject) => {
                    const stat = lbData?.[subject];
                    // A mock total can dip below zero with negative marking; the card shows a score floor of 0%
                    const floored = (v: number | null | undefined) => (v == null ? null : Math.max(0, v));
                    const mine = floored(stat?.mine);
                    const isOpen = expandedMastery === subject;
                    const subjectColor = SUBJECT_COLOR[subject] ?? 'var(--gray-900)';
                    const mineColor = mine != null ? toneColor(mine) : 'var(--gray-300)';
                    return (
                      <div key={subject} className={styles.subjCard} style={{ borderLeft: `3px solid ${subjectColor}` }}>
                        <button
                          className={`${styles.subjCardHead} ${isOpen ? styles.subjCardHeadOpen : ''}`}
                          onClick={() => setExpandedMastery(isOpen ? null : subject)}
                          style={{ width: '100%', border: 'none', textAlign: 'left' }}
                        >
                          <Ring pct={mine ?? 0} color={mineColor} size={52} stroke={5}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: mineColor, fontVariantNumeric: 'tabular-nums' }}>
                              {mine != null ? `${mine}%` : '—'}
                            </span>
                          </Ring>
                          <div style={{ flex: 1, minWidth: 0, marginLeft: 12 }}>
                            <div className={styles.masteryHead}>
                              <p className={styles.subjCardName} style={{ color: subjectColor }}>{subject}</p>
                              <span className={styles.masteryBig} style={{ color: mineColor }}>
                                {mine != null ? `${mine}%` : 'Not started'}
                              </span>
                            </div>
                            <div className={styles.masteryRows}>
                              <MasteryRow label="My average" pct={mine} color={mineColor} strong />
                              <MasteryRow label="Platform avg" pct={floored(stat?.avg)} color={COLOR_PLATFORM} />
                              <MasteryRow label="Top scorer avg" pct={floored(stat?.topAvg)} color={COLOR_TOP} strong />
                            </div>
                          </div>
                          <svg
                            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', color: 'var(--gray-400)', flexShrink: 0, marginLeft: 12 }}
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </button>

                        {isOpen && (() => {
                          const lagging = laggingTopics(subject);
                          return (
                            <div className={styles.subjCardBody}>
                              {lagging.length === 0 ? (
                                <p className={styles.masteryNote} style={{ paddingTop: 12 }}>
                                  No lagging topics yet. Topics under 60% in your mock exams will show here.
                                </p>
                              ) : (
                                <>
                                  <p className={styles.masteryNote} style={{ paddingTop: 12 }}>Lagging topics · from mock exams</p>
                                  {lagging.map((r) => (
                                    <div key={r.key} className={styles.subjTopicRow}>
                                      <p className={styles.subjTopicName}>{r.topic}</p>
                                      <span className={styles.subjTopicPct} style={{ color: toneColor(r.pct) }}>{r.pct}%</span>
                                      <div className={styles.subjTopicBar}>
                                        <div className={styles.subjTopicBarFill} style={{ width: `${r.pct}%`, background: toneColor(r.pct) }} />
                                      </div>
                                    </div>
                                  ))}
                                  <div style={{ marginTop: 14 }}>
                                    <Link href={buildPracticeUrl(subject)} className={`${styles.primaryBtn} ${styles.primaryBtnSm}`}>
                                      Practice {subject} weak areas →
                                    </Link>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Mock insights: built only from submitted mock exams */}
          {!loading && insights && insights.examsAnalysed > 0 && (
            <section style={{ marginTop: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <h2 className={styles.panelTitle}>Mock insights</h2>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', background: 'var(--gray-100)', padding: '2px 8px', borderRadius: 999 }}>
                  {plural(insights.examsAnalysed, 'mock')} analysed
                </span>
              </div>

              {/* Row 1: key stats — projection, standing, cutoff */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginBottom: 14 }}>
                <ProjectionCard projection={insights.projection} />
                <StandingCard standing={insights.standing} />
                <CutoffCard cutoffs={insights.cutoffs} scoreLabel="Your average" />
              </div>

              {/* Row 2: verdict + roadmap */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginBottom: 14 }}>
                <CrackabilityCard projection={insights.projection} cutoffs={insights.cutoffs} examType={insights.examType} />
                <ImprovementCard cutoffs={insights.cutoffs} subjectOrder={insights.subjectOrder} projection={insights.projection} />
              </div>

              {/* Row 3: topic performance */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginBottom: 14 }}>
                <TopicList
                  title="Revise today"
                  sub="Your weakest topics — study the concept"
                  topics={insights.reviseToday}
                  mode="accuracy"
                  emptyText="Nothing to revise yet."
                  action={insights.reviseToday.length > 0 ? <PracticeLink href={revisePracticeUrl(insights.reviseToday)} label="Practise these topics →" /> : undefined}
                />
                <TopicList
                  title="Practice tomorrow"
                  sub="Borderline topics (40–75%) — do more problems"
                  topics={insights.practiceTomorrow ?? []}
                  mode="accuracy"
                  emptyText="No borderline topics yet."
                  action={(insights.practiceTomorrow ?? []).length > 0 ? <PracticeLink href={revisePracticeUrl(insights.practiceTomorrow ?? [])} label="Practice these topics →" /> : undefined}
                />
                <TopicList
                  title="Strong topics"
                  sub="At 60%+ accuracy, at least 2 answers"
                  topics={insights.strongTopics}
                  mode="accuracy"
                  emptyText="No strong topics yet. A topic needs two answers at 60% or better."
                />
                <TopicList
                  title="Weak topics"
                  sub="Below 60%, lowest first"
                  topics={insights.weakTopics}
                  mode="accuracy"
                  emptyText="No weak topics yet."
                />
                <TopicList
                  title="Marks lost by topic"
                  sub="Where your marks went, including negatives"
                  topics={insights.marksLostTopics}
                  mode="marks"
                  emptyText="No marks lost yet."
                />
              </div>

              {/* Row 4: behaviour + time patterns */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginBottom: 14 }}>
                {insights.careless && <CarelessCard careless={insights.careless} />}
                {insights.guessing && <GuessingCard guessing={insights.guessing} />}
                <NegativesCard negatives={insights.negatives} />
              </div>

              {/* Row 5: time, section order, monthly */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                <TimeByTypeCard rows={insights.timeByType} />
                <SectionOrderCard rows={insights.subjectOrder} />
                <MonthlyBars monthly={insights.monthly} />
              </div>
            </section>
          )}

          <div className={styles.grid} style={{ gridTemplateColumns: '1fr' }}>
            <FocusAreas
              loading={loading}
              hasMockWeakAreas={hasMockWeakAreas}
              weakSubjects={weakSubjects}
              weakBySubject={weakBySubject}
              expandedSubject={expandedSubject}
              onToggleSubject={setExpandedSubject}
              buildPracticeUrl={buildPracticeUrl}
            />

            {/* Start guide for new students */}
            {!loading && !hasActivity && (
              <section className={styles.panel}>
                <div className={styles.panelHead}>
                  <div>
                    <h2 className={styles.panelTitle}>Get started</h2>
                    <p className={styles.panelSub}>Three steps to your first session</p>
                  </div>
                </div>
                <div className={styles.guideSteps}>
                  <div className={styles.guideStep}>
                    <span className={styles.guideNum}>1</span>
                    <div>
                      <p className={styles.guideTitle}>Pick subjects and topics</p>
                      <p className={styles.guideText}>Choose from Physics, Chemistry and Mathematics.</p>
                    </div>
                  </div>
                  <div className={styles.guideStep}>
                    <span className={styles.guideNum}>2</span>
                    <div>
                      <p className={styles.guideTitle}>Answer one question at a time</p>
                      <p className={styles.guideText}>Get instant feedback and a full explanation.</p>
                    </div>
                  </div>
                  <div className={styles.guideStep}>
                    <span className={styles.guideNum}>3</span>
                    <div>
                      <p className={styles.guideTitle}>Watch your weak areas appear</p>
                      <p className={styles.guideText}>Topics under 60% accuracy are flagged here automatically.</p>
                    </div>
                  </div>
                </div>
                <Link href="/practice" className={styles.primaryBtn}>Start your first session</Link>
              </section>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
