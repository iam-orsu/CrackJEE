'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import type { TopicProgress } from '@/types';

type Subject = 'All' | 'Mathematics' | 'Physics' | 'Chemistry';
const TABS: Subject[] = ['All', 'Mathematics', 'Physics', 'Chemistry'];

export default function ProgressPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<TopicProgress[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [tab, setTab]           = useState<Subject>('All');
  const [weakOnly, setWeakOnly] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    api.progress.overview()
      .then(setProgress)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = progress
    .filter((p) => tab === 'All' || p.subject === tab)
    .filter((p) => !weakOnly || p.markedAsWeak)
    .sort((a, b) => a.successRate - b.successRate);

  const totalAttempts  = progress.reduce((s, p) => s + p.attempts, 0);
  const totalCorrect   = progress.reduce((s, p) => s + p.correctCount, 0);
  const overallAcc     = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const weakCount      = progress.filter((p) => p.markedAsWeak).length;

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <div className="page-header">
          <h1 className="page-title">Progress</h1>
          <p className="page-subtitle">Topic-wise performance breakdown</p>
        </div>

        {error && (
          <div className="badge badge-red" style={{ marginBottom: 20, fontSize: 13 }}>{error}</div>
        )}

        {/* ── Summary stats ── */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          {[
            { label: 'Topics practiced', value: progress.length },
            { label: 'Total attempts',   value: totalAttempts },
            { label: 'Overall accuracy', value: `${overallAcc}%` },
            { label: 'Weak areas',       value: weakCount },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <p className="stat-label">{s.label}</p>
              <p className="stat-value">{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
          <div className="subject-tabs" style={{ marginBottom: 0, border: 'none' }}>
            {TABS.map((t) => (
              <button key={t} className={`subject-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--gray-600)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={weakOnly}
              onChange={(e) => setWeakOnly(e.target.checked)}
              style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            Weak areas only
          </label>
        </div>

        <div className="divider" style={{ marginBottom: 20 }} />

        {/* ── Topics list ── */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 62, borderRadius: 8 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 6 }}>
              {weakOnly ? 'No weak areas in this subject' : 'No topics attempted yet'}
            </p>
            <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
              {weakOnly ? 'Great job! Keep practicing to maintain it.' : 'Head to Practice to get started.'}
            </p>
          </div>
        ) : (
          <div className="topic-card-grid">
            {filtered.map((p) => {
              const pct = Math.round(p.successRate * 100);
              const good = p.successRate >= 0.6;
              return (
                <div key={p.id} className={`topic-card${p.markedAsWeak ? ' weak' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="topic-name" style={{ fontSize: 13, marginBottom: 2 }}>{p.topicName}</p>
                      <p className="topic-meta">{p.subject}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 8 }}>
                      {p.markedAsWeak && <span className="badge badge-red" style={{ fontSize: 11, padding: '2px 7px' }}>weak</span>}
                      <span className={`topic-pct${good ? ' good' : ' bad'}`} style={{ fontSize: 15 }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="progress-track">
                    <div
                      className={`progress-fill${good ? ' green' : ' red'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="topic-meta" style={{ marginTop: 6 }}>
                    {p.attempts} attempt{p.attempts !== 1 ? 's' : ''} · {p.correctCount} correct
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
