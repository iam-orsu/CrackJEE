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

interface LaggingRow {
  key: string;
  topic: string;
  pct: number;
  detail: string;
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

  // One card per subject. Accuracy is averaged over attempts, so the merged Biology card weights each part correctly.
  const subjectRows = SUBJECTS.map((subject) => {
    const parts = (data?.subjectAccuracy ?? []).filter((x) => groupOf(x.subject) === subject);
    const attempts = parts.reduce((sum, x) => sum + x.attempts, 0);
    const weighted = parts.reduce((sum, x) => sum + x.accuracy * x.attempts, 0);
    return { subject, attempts, pct: attempts ? Math.round(weighted / attempts) : 0 };
  });

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
      .map((t) => ({ key: `${t.subject}|${t.topic}`, topic: t.topic, pct: t.successRate, detail: `${t.correct}/${t.attempts} correct` }))
      .sort((a, b) => a.pct - b.pct);
  }

  // Leaderboard: pick exam type relevant to user
  const targetExam = user?.targetExam ?? 'Main';
  const lbExamType = targetExam === 'NEET' ? 'NEET' : targetExam === 'Advanced' ? 'Advanced' : 'Main';
  const lbData = leaderboard?.[lbExamType] ?? null;
  const lbSubjects = lbData ? Object.entries(lbData).sort(([a], [b]) => a.localeCompare(b)) : [];

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

          {/* Left: weekly chart + platform standings · Right: subject mastery cards */}
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

              {/* Platform standings */}
              {!loading && lbSubjects.length > 0 && (
                <section className={styles.panel}>
                  <div className={styles.panelHead}>
                    <div>
                      <h2 className={styles.panelTitle}>Platform standings</h2>
                      <p className={styles.panelSub}>
                        {lbExamType === 'NEET' ? 'NEET UG' : `JEE ${lbExamType}`} · Your highest and average vs platform average and top score (% of max marks)
                      </p>
                    </div>
                  </div>
                  <table className={styles.lbTable}>
                    <colgroup>
                      <col style={{ width: '25%' }} />
                      <col style={{ width: '17%' }} />
                      <col style={{ width: '17%' }} />
                      <col style={{ width: '18%' }} />
                      <col style={{ width: '23%' }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th className={styles.lbHead} style={{ textAlign: 'left' }}>Subject</th>
                        <th className={styles.lbHead}>My highest</th>
                        <th className={styles.lbHead}>My average</th>
                        <th className={styles.lbHead}>Platform avg</th>
                        <th className={styles.lbHead}>Platform top</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lbSubjects.map(([subj, stat]) => {
                        const best = stat.best;
                        const mine = stat.mine;
                        return (
                          <tr key={subj} className={styles.lbRow}>
                            <td>
                              <span className={styles.lbSubject} style={{ color: SUBJECT_COLOR[subj] ?? 'var(--gray-800)' }}>
                                {subj}
                              </span>
                            </td>
                            <td className={styles.lbNum} style={{ color: best == null ? 'var(--gray-400)' : toneColor(best) }}>
                              {best != null ? `${best}%` : '—'}
                            </td>
                            <td className={styles.lbNum} style={{ color: mine == null ? 'var(--gray-400)' : toneColor(mine) }}>
                              {mine != null ? `${mine}%` : '—'}
                            </td>
                            <td className={styles.lbNum} style={{ color: 'var(--gray-600)' }}>
                              {stat.count > 0 ? `${stat.avg}%` : '—'}
                            </td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                                <span className={styles.lbNum} style={{ color: 'var(--gray-900)' }}>
                                  {stat.count > 0 ? `${stat.top}%` : '—'}
                                </span>
                                {stat.count > 0 && (
                                  <div style={{ width: '100%', maxWidth: 80, height: 5, background: 'var(--gray-100)', borderRadius: 999, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${stat.top}%`, background: SUBJECT_COLOR[subj] ?? '#94a3b8', borderRadius: 999 }} />
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {lbSubjects[0]?.[1]?.count != null && (
                    <p style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 14 }}>
                      Based on {lbSubjects[0][1].count} mock result{lbSubjects[0][1].count === 1 ? '' : 's'} · scores are anonymous
                    </p>
                  )}
                </section>
              )}
            </div>

            {/* Subject mastery: one card per subject, click to see the topics lagging behind */}
            <section className={styles.panel}>
              <div className={styles.panelHead}>
                <div>
                  <h2 className={styles.panelTitle}>Subject mastery</h2>
                  <p className={styles.panelSub}>Score by subject · tap a card for lagging topics</p>
                </div>
              </div>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[0, 1, 2].map((i) => <div key={i} className={styles.skeleton} style={{ height: 52 }} />)}
                </div>
              ) : (
                <div className={styles.subjectList}>
                  {subjectRows.map(({ subject, attempts, pct }) => {
                    const isOpen = expandedMastery === subject;
                    return (
                      <div key={subject} className={styles.subjCard}>
                        <button
                          className={`${styles.subjCardHead} ${isOpen ? styles.subjCardHeadOpen : ''}`}
                          onClick={() => setExpandedMastery(isOpen ? null : subject)}
                          style={{ width: '100%', border: 'none', textAlign: 'left' }}
                        >
                          <div>
                            <p className={styles.subjCardName} style={{ color: SUBJECT_COLOR[subject] ?? 'var(--gray-900)' }}>{subject}</p>
                            <p className={styles.subjCardMeta}>{attempts ? plural(attempts, 'question') : 'Not started'}</p>
                          </div>
                          <div className={styles.subjCardRight}>
                            <span className={styles.subjCardPct} style={{ color: attempts ? toneColor(pct) : 'var(--gray-400)' }}>
                              {attempts ? `${pct}%` : '—'}
                            </span>
                            <svg
                              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                              style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', color: 'var(--gray-400)', flexShrink: 0 }}
                            >
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </div>
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
                                  <p className={styles.masteryNote} style={{ paddingTop: 12 }}>
                                    Lagging topics · from mock exams
                                  </p>
                                  {lagging.map((r) => (
                                    <div key={r.key} className={styles.subjTopicRow}>
                                      <div>
                                        <p className={styles.subjTopicName}>{r.topic}</p>
                                        <p className={styles.subjTopicMeta}>{r.detail}</p>
                                      </div>
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
