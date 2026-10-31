'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';
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

const SUBJECT_TAG: Record<string, { bg: string; text: string }> = {
  Physics:     { bg: '#eff6ff', text: '#1d4ed8' },
  Chemistry:   { bg: '#f0fdf4', text: '#15803d' },
  Mathematics: { bg: '#f5f3ff', text: '#6d28d9' },
  Botany:      { bg: '#ecfdf5', text: '#065f46' },
  Zoology:     { bg: '#fdf4ff', text: '#7e22ce' },
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

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--gray-200)',
      borderRadius: 10,
      padding: '16px 18px',
    }}>
      {children}
    </div>
  );
}

function Label({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: '.07em',
      color: 'var(--gray-500)',
      marginBottom: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {children}
      {action}
    </div>
  );
}

export function StudySidebar() {
  const user = getUser();
  const targetExam = user?.targetExam ?? 'Main';

  const [weakAreas, setWeakAreas] = useState<TopicProgress[]>([]);
  const [week, setWeek]           = useState<WeeklyPoint[]>([]);
  const [loaded, setLoaded]       = useState(false);

  useEffect(() => {
    Promise.allSettled([
      api.progress.weakAreas(),
      api.dashboard.data(),
    ]).then(([wa, dd]) => {
      if (wa.status === 'fulfilled') setWeakAreas(wa.value.slice(0, 3));
      if (dd.status === 'fulfilled') setWeek(dd.value.weeklyStats);
    }).finally(() => setLoaded(true));
  }, []);

  // Pick the nearest upcoming exam for this student's target
  const examList = (NEXT_EXAMS[targetExam] ?? NEXT_EXAMS['Main']!);
  const nextExam = examList
    .map((e) => ({ ...e, days: daysUntil(e.date) }))
    .filter((e) => e.days > 0)
    .sort((a, b) => a.days - b.days)[0];

  const streak       = computeStreak(week);
  const todayTotal   = week[week.length - 1]?.total ?? 0;

  // Bar fill: more filled = less time left. Color shifts from blue → amber → red as exam approaches.
  const barFill  = nextExam ? Math.min(100, Math.max(2, (1 - nextExam.days / 365) * 100)) : 0;
  const barColor = nextExam
    ? nextExam.days <= 30 ? '#dc2626'
    : nextExam.days <= 90 ? '#d97706'
    : '#2563eb'
    : '#2563eb';

  return (
    <aside style={{
      width: 252, flexShrink: 0,
      display: 'flex', flexDirection: 'column', gap: 12,
      position: 'sticky', top: 36, alignSelf: 'flex-start',
    }}>
      {/* ── Widget 1: Exam countdown ──────────────────────── */}
      {nextExam && (
        <Card>
          <Label>Next Exam</Label>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-700)', marginBottom: 6 }}>
            {nextExam.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 10 }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1 }}>
              {nextExam.days}
            </span>
            <span style={{ fontSize: 13, color: 'var(--gray-500)', fontWeight: 500 }}>days to go</span>
          </div>
          <div style={{ height: 5, background: 'var(--gray-100)', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ height: '100%', width: `${barFill}%`, background: barColor, borderRadius: 99, transition: 'width .4s' }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>
            {nextExam.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </Card>
      )}

      {/* ── Widget 2: Weak areas ──────────────────────────── */}
      <Card>
        <Label
          action={weakAreas.length > 0
            ? <a href="/practice?mode=weak" style={{ fontSize: 11, color: 'var(--gray-400)', fontWeight: 500, textDecoration: 'underline', textTransform: 'none', letterSpacing: 'normal' }}>Practice all</a>
            : null}
        >
          Weak Areas
        </Label>

        {!loaded ? (
          <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>Loading...</div>
        ) : weakAreas.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.6 }}>
            No weak areas yet. Keep practicing and gaps will appear here.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {weakAreas.map((area) => {
              const tag = SUBJECT_TAG[area.subject] ?? { bg: '#f3f4f6', text: '#374151' };
              const pct = Math.round(area.successRate * 100);
              return (
                <div key={`${area.subject}:${area.topicName}`}
                  style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 500, color: 'var(--gray-800)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {area.topicName}
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 600,
                      background: tag.bg, color: tag.text,
                      padding: '1px 6px', borderRadius: 4,
                      display: 'inline-block', marginTop: 2,
                    }}>
                      {area.subject}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#dc2626', flexShrink: 0, paddingTop: 1 }}>
                    {pct}%
                  </div>
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
          <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>Loading...</div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 20, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1 }}>
                  {streak}
                </div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 3 }}>day streak</div>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1 }}>
                  {todayTotal}
                </div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 3 }}>questions today</div>
              </div>
            </div>

            {/* 7-day dot bar */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
              {week.map((day, i) => (
                <div
                  key={i}
                  title={`${day.date}: ${day.total} questions`}
                  style={{
                    flex: 1, height: 6, borderRadius: 99,
                    background: day.total > 0 ? '#2563eb' : 'var(--gray-100)',
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>
              Last 7 days (mock attempts)
            </div>

            {streak === 0 && (
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.5 }}>
                Start a mock today to build your streak.
              </div>
            )}
          </>
        )}
      </Card>
    </aside>
  );
}
