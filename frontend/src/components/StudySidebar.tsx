'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { ALL_SKIN, SKIN } from '@/components/practice/skin';
import type { TopicProgress, WeeklyPoint } from '@/types';

// Approximate exam dates for the 2026-27 cycle
const NEXT_EXAMS: Record<string, Array<{ label: string; date: Date }>> = {
  Main: [
    { label: 'JEE Main — Session 1', date: new Date('2027-01-22') },
    { label: 'JEE Main — Session 2', date: new Date('2027-04-05') },
  ],
  Advanced: [
    { label: 'JEE Advanced',         date: new Date('2027-05-25') },
  ],
  Both: [
    { label: 'JEE Main — Session 1', date: new Date('2027-01-22') },
    { label: 'JEE Advanced',         date: new Date('2027-05-25') },
  ],
  NEET: [
    { label: 'NEET UG',              date: new Date('2027-05-04') },
  ],
};

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// A display figure: the app's headline face, tabular so counts never jitter
const FIGURE: CSSProperties = {
  fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
  fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
};

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / 86_400_000);
}

function computeStreak(week: WeeklyPoint[]): number {
  // Count consecutive days with activity from today backward (week is oldest-first)
  let streak = 0;
  for (let i = week.length - 1; i >= 0; i--) {
    if ((week[i]?.total ?? 0) > 0) streak++;
    else break;
  }
  return streak;
}

// Keys are date-only (YYYY-MM-DD), so parse at local midnight to keep the weekday right
function weekdayLabel(dateKey: string): string {
  const d = new Date(`${dateKey}T00:00:00`);
  return Number.isNaN(d.getTime()) ? '' : WEEKDAY[d.getDay()]!;
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(0,51,102,.1)',
      borderRadius: 16,
      padding: '18px 18px 16px',
      boxShadow: '0 10px 24px -18px rgba(0,51,102,.5)',
    }}>
      {children}
    </div>
  );
}

function Label({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
      minHeight: 14, marginBottom: 12,
      fontSize: 10, fontWeight: 800, letterSpacing: '.12em',
      textTransform: 'uppercase', color: 'var(--faint)',
    }}>
      {children}
      {action}
    </div>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-500)', lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

const css = `
.sb-link{font-size:11px;font-weight:700;color:var(--brand);text-decoration:underline;text-underline-offset:3px;text-transform:none;letter-spacing:normal}
.sb-link:hover{color:var(--accent-d)}
.sb-link:focus-visible{outline:3px solid var(--accent);outline-offset:2px;border-radius:4px}
@media(prefers-reduced-motion:reduce){.sb-bar{transition:none}}
`;

export function StudySidebar() {
  const user = getUser();
  const targetExam = user?.targetExam ?? 'Main';

  const [weakAreas, setWeakAreas] = useState<TopicProgress[]>([]);
  const [week, setWeek]           = useState<WeeklyPoint[]>([]);
  const [loaded, setLoaded]       = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      api.progress.weakAreas(),
      api.dashboard.data(),
    ]).then(([wa, dd]) => {
      if (cancelled) return;
      if (wa.status === 'fulfilled') setWeakAreas(wa.value.slice(0, 3));
      if (dd.status === 'fulfilled') setWeek(dd.value.weeklyStats);
    }).finally(() => {
      if (!cancelled) setLoaded(true);
    });
    return () => { cancelled = true; };
  }, []);

  // Pick the nearest upcoming exam for this student's target
  const examList = (NEXT_EXAMS[targetExam] ?? NEXT_EXAMS['Main']!);
  const nextExam = examList
    .map((e) => ({ ...e, days: daysUntil(e.date) }))
    .filter((e) => e.days > 0)
    .sort((a, b) => a.days - b.days)[0];

  const streak     = computeStreak(week);
  const todayTotal = week[week.length - 1]?.total ?? 0;

  return (
    <aside style={{
      width: 252, flexShrink: 0,
      display: 'flex', flexDirection: 'column', gap: 12,
      position: 'sticky', top: 36, alignSelf: 'flex-start',
    }}>
      <style>{css}</style>

      {/* ── Widget 1: Exam countdown ──────────────────────── */}
      {nextExam && (
        <Card>
          <Label>Next exam</Label>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 10 }}>
            {nextExam.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ ...FIGURE, fontSize: 40, color: nextExam.days <= 30 ? 'var(--red-600)' : 'var(--brand)' }}>
              {nextExam.days}
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)' }}>days to go</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 11, fontWeight: 600, color: 'var(--faint)', fontVariantNumeric: 'tabular-nums' }}>
            {nextExam.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </Card>
      )}

      {/* ── Widget 2: Weak areas ──────────────────────────── */}
      <Card>
        <Label
          action={weakAreas.length > 0
            ? <a className="sb-link" href={targetExam === 'NEET' ? '/neet/practice?mode=weak' : '/practice?mode=weak'}>Practice all</a>
            : null}
        >
          Weak areas
        </Label>

        {!loaded ? (
          <Muted>Loading…</Muted>
        ) : weakAreas.length === 0 ? (
          <Muted>No weak areas yet. Keep practicing and gaps will appear here.</Muted>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {weakAreas.map((area) => {
              const skin = SKIN[area.subject] ?? ALL_SKIN;
              const pct = Math.round(area.successRate * 100);
              return (
                <div key={`${area.subject}:${area.topicName}`}
                  style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 600, color: 'var(--gray-800)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {area.topicName}
                    </div>
                    <span style={{
                      display: 'inline-block', marginTop: 5, padding: '2px 8px', borderRadius: 999,
                      fontSize: 10, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase',
                      background: skin.soft, color: skin.deep,
                    }}>
                      {area.subject}
                    </span>
                  </div>
                  <span style={{
                    flexShrink: 0, fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                    color: pct < 60 ? 'var(--red-600)' : 'var(--gray-700)',
                  }}>
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* ── Widget 3: Streak + 7-day activity ────────────── */}
      <Card>
        <Label>Activity</Label>
        {!loaded ? (
          <Muted>Loading…</Muted>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
              <div>
                <div style={{ ...FIGURE, fontSize: 28, color: 'var(--brand)' }}>{streak}</div>
                <div style={{ marginTop: 4, fontSize: 11, fontWeight: 600, color: 'var(--gray-500)' }}>day streak</div>
              </div>
              <div>
                <div style={{ ...FIGURE, fontSize: 28, color: 'var(--brand)' }}>{todayTotal}</div>
                <div style={{ marginTop: 4, fontSize: 11, fontWeight: 600, color: 'var(--gray-500)' }}>questions today</div>
              </div>
            </div>

            {/* Last 7 days: one bar a day, the accent marks the days you practised */}
            {week.length > 0 && (
              <>
                <div style={{ display: 'flex', gap: 4 }}>
                  {week.map((day, i) => (
                    <div key={i} title={`${day.date}: ${day.total} questions`}
                      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <span className="sb-bar" style={{
                        width: '100%', height: 4, borderRadius: 99,
                        background: day.total > 0 ? 'var(--brand)' : 'rgba(0,51,102,.1)',
                      }} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.02em', color: 'var(--faint)' }}>
                        {weekdayLabel(day.date)}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 10, fontSize: 10, fontWeight: 600, color: 'var(--faint)' }}>
                  Mock attempts, last 7 days
                </div>
              </>
            )}

            {streak === 0 && (
              <div style={{ marginTop: 10, fontSize: 12, fontWeight: 500, color: 'var(--gray-500)', lineHeight: 1.5 }}>
                Start a mock today to build your streak.
              </div>
            )}
          </>
        )}
      </Card>
    </aside>
  );
}
