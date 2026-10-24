'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { api } from '@/lib/api';
import { isAuthenticated, getUser } from '@/lib/auth';
import type { DashboardData, WeeklyPoint, MockWeakTopic, LeaderboardData } from '@/types';
import styles from './dashboard.module.css';
import { SUBJECT_COLOR } from '@/lib/subjects';
import { plural } from './helpers';
import { FocusAreas } from './FocusAreas';

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const COLOR_YOU = '#2c3e50';
const COLOR_PLATFORM = '#94a3b8';
const COLOR_TOP = '#16a34a';

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

/* ── Weekly chart ────────────────────────────────────────────────── */
function WeeklyChart({ data }: { data: WeeklyPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = niceMax(Math.max(...data.map((d) => d.total), 0));

  const W = 640, H = 230, PL = 34, PT = 12, PB = 28;
  const plotH = H - PT - PB;
  const slot = (W - PL) / data.length;
  const barW = Math.min(34, slot * 0.46);
  const yFor = (v: number) => PT + plotH - (v / max) * plotH;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));

  const hovered = hover !== null ? data[hover] : null;

  return (
    <div className={styles.chart}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Questions attempted per day this week">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PL} x2={W} y1={yFor(t)} y2={yFor(t)} className={styles.gridLine} />
            <text x={PL - 8} y={yFor(t)} dy="0.32em" textAnchor="end" className={styles.tick}>{t}</text>
          </g>
        ))}

        {data.map((d, i) => {
          const cx = PL + slot * i + slot / 2;
          const isToday = i === data.length - 1;
          const totalH = (d.total / max) * plotH;
          const correctH = (d.correct / max) * plotH;
          return (
            <g
              key={d.date}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              tabIndex={0}
            >
              <rect x={PL + slot * i} y={PT} width={slot} height={plotH} fill="transparent" />
              {d.total > 0 ? (
                <rect x={cx - barW / 2} y={yFor(d.total)} width={barW} height={totalH} rx={6} className={styles.barTotal} />
              ) : (
                <rect x={cx - barW / 2} y={yFor(0) - 2} width={barW} height={2} rx={1} className={styles.barEmpty} />
              )}
              {d.correct > 0 && (
                <rect
                  x={cx - barW / 2} y={yFor(d.correct)}
                  width={barW} height={correctH} rx={6}
                  className={isToday ? styles.barCorrectToday : styles.barCorrect}
                />
              )}
              <text x={cx} y={H - 8} textAnchor="middle" className={isToday ? styles.dayToday : styles.day}>
                {DAY_SHORT[new Date(d.date + 'T00:00:00').getDay()]}
              </text>
            </g>
          );
        })}
      </svg>

      {hovered && hover !== null && (
        <div className={styles.tooltip} style={{ left: `${((PL + slot * hover + slot / 2) / W) * 100}%` }}>
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

/* ── Score history: my mock scores over time against platform figures ── */
function ScoreHistoryChart({
  history,
  platformAvg,
  topAvg,
}: {
  history: Array<{ date: string; pct: number }>;
  platformAvg: number | null;
  topAvg: number | null;
}) {
  const W = 640, H = 230, PL = 34, PR = 96, PT = 12, PB = 28;
  const plotW = W - PL - PR;
  const plotH = H - PT - PB;
  const n = history.length;
  const xFor = (i: number) => (n <= 1 ? PL + plotW / 2 : PL + (plotW * i) / (n - 1));
  const yFor = (v: number) => PT + plotH - (v / 100) * plotH;
  const ticks = [0, 25, 50, 75, 100];
  const line = history.map((h, i) => `${xFor(i)},${yFor(h.pct)}`).join(' ');

  return (
    <div className={styles.chart}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Your mock scores over time, with platform average and top scorer average">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PL} x2={W - PR} y1={yFor(t)} y2={yFor(t)} className={styles.gridLine} />
            <text x={PL - 8} y={yFor(t)} dy="0.32em" textAnchor="end" className={styles.tick}>{t}%</text>
          </g>
        ))}

        {topAvg != null && (
          <g>
            <line x1={PL} x2={W - PR} y1={yFor(topAvg)} y2={yFor(topAvg)} stroke={COLOR_TOP} strokeDasharray="4 4" strokeWidth={1.5} />
            <text x={W - PR + 8} y={yFor(topAvg)} dy="0.32em" fontSize={11} fill={COLOR_TOP}>Top scorer {topAvg}%</text>
          </g>
        )}
        {platformAvg != null && (
          <g>
            <line x1={PL} x2={W - PR} y1={yFor(platformAvg)} y2={yFor(platformAvg)} stroke={COLOR_PLATFORM} strokeDasharray="4 4" strokeWidth={1.5} />
            <text x={W - PR + 8} y={yFor(platformAvg)} dy="0.32em" fontSize={11} fill="#64748b">Platform avg {platformAvg}%</text>
          </g>
        )}

        {n > 1 && <polyline points={line} fill="none" stroke={COLOR_YOU} strokeWidth={2} strokeLinejoin="round" />}
        {history.map((h, i) => (
          <g key={h.date}>
            <circle cx={xFor(i)} cy={yFor(h.pct)} r={4.5} fill={COLOR_YOU} stroke="#fff" strokeWidth={1.5}>
              <title>{`${new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}: ${h.pct}%`}</title>
            </circle>
            <text x={xFor(i)} y={yFor(h.pct) - 10} textAnchor="middle" fontSize={11} fontWeight={600} fill={COLOR_YOU}>{h.pct}%</text>
            <text x={xFor(i)} y={H - 8} textAnchor="middle" className={styles.day}>
              {new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </text>
          </g>
        ))}
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
      <span className={styles.masteryValue} style={{ color: strong ? color : 'var(--gray-700)' }}>
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
    ])
      .then(([dashData, weakTopics, lb]) => {
        setData(dashData);
        setMockWeakTopics(weakTopics);
        setLeaderboard(lb);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] ?? '';
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const accuracy = data?.stats.accuracy ?? 0;
  const totalAttempts = data?.stats.totalAttempts ?? 0;
  const correctAttempts = data?.stats.correctAttempts ?? 0;
  const hasActivity = totalAttempts > 0;
  const isFreshUser = !loading && totalAttempts === 0 && mockWeakTopics.length === 0;

  const SUBJECTS: readonly string[] = user?.targetExam === 'NEET'
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
  const targetExam = user?.targetExam ?? 'Main';
  const lbExamType = targetExam === 'NEET' ? 'NEET' : targetExam === 'Advanced' ? 'Advanced' : 'Main';
  const lbData = leaderboard?.[lbExamType] ?? null;

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

  const overall = data?.overall;
  const history = data?.history ?? [];

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <div className={styles.page}>

          {/* Header */}
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow} suppressHydrationWarning>{today}</p>
              <h1 className={styles.title} suppressHydrationWarning>
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
            /* Stat strip — 3 tiles */
            <section className={styles.statStrip} aria-label="Summary">
              <div className={styles.stat}>
                <p className={styles.statLabel}>Questions done</p>
                <p className={styles.statValue}>{loading ? '–' : totalAttempts}</p>
                <p className={styles.statSub}>{loading ? ' ' : `${correctAttempts} correct`}</p>
              </div>
              <div className={styles.stat}>
                <p className={styles.statLabel}>Accuracy</p>
                <p className={`${styles.statValue} ${hasActivity && accuracy < 60 ? styles.statValueBad : ''} ${hasActivity && accuracy >= 60 ? styles.statValueGood : ''}`}>
                  {loading ? '–' : `${accuracy}%`}
                </p>
                <p className={styles.statSub}>
                  {!hasActivity ? 'No attempts yet' : accuracy >= 60 ? 'On track' : 'Below the 60% target'}
                </p>
              </div>
              <div className={styles.stat}>
                <p className={styles.statLabel}>Weak areas</p>
                <p className={styles.statValue}>{loading ? '–' : mockWeakTopics.length}</p>
                <p className={styles.statSub}>
                  {loading ? ' ' : mockWeakTopics.length > 0 ? 'Topics under 60%' : 'None flagged'}
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
                    <p className={styles.panelSub}>Your last {history.length || 10} mocks against the platform</p>
                  </div>
                  <div className={styles.legend}>
                    <span><span className={styles.legendDot} style={{ background: COLOR_YOU }} />You</span>
                    <span><span className={styles.legendDot} style={{ background: COLOR_PLATFORM }} />Platform avg</span>
                    <span><span className={styles.legendDot} style={{ background: COLOR_TOP }} />Top scorer avg</span>
                  </div>
                </div>
                {loading ? (
                  <div className={styles.skeleton} style={{ height: 230 }} />
                ) : history.length > 0 ? (
                  <ScoreHistoryChart history={history} platformAvg={overall?.platformAvg ?? null} topAvg={overall?.topAvg ?? null} />
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
                    const mine = stat?.mine ?? null;
                    const isOpen = expandedMastery === subject;
                    return (
                      <div key={subject} className={styles.subjCard}>
                        <button
                          className={`${styles.subjCardHead} ${isOpen ? styles.subjCardHeadOpen : ''}`}
                          onClick={() => setExpandedMastery(isOpen ? null : subject)}
                          style={{ width: '100%', border: 'none', textAlign: 'left' }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className={styles.masteryHead}>
                              <p className={styles.subjCardName} style={{ color: SUBJECT_COLOR[subject] ?? 'var(--gray-900)' }}>{subject}</p>
                              <span className={styles.masteryBig} style={{ color: mine != null ? toneColor(mine) : 'var(--gray-400)' }}>
                                {mine != null ? `${mine}%` : 'Not started'}
                              </span>
                            </div>
                            <div className={styles.masteryRows}>
                              <MasteryRow label="My average" pct={mine} color={mine != null ? toneColor(mine) : 'var(--gray-300)'} strong />
                              <MasteryRow label="Platform avg" pct={stat?.avg ?? null} color={COLOR_PLATFORM} />
                              <MasteryRow label="Top scorer avg" pct={stat?.topAvg ?? null} color={COLOR_TOP} strong />
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
