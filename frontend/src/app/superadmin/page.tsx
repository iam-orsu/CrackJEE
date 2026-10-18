'use client';

import { useEffect, useState, type FormEvent } from 'react';
import {
  adminFetch,
  AdminError,
  clearAdminToken,
  getAdminToken,
  setAdminToken,
  type AdminStats,
} from '@/lib/admin';
import styles from './superadmin.module.css';

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function SuperAdminPage() {
  const [signedIn, setSignedIn] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      setStats(await adminFetch<AdminStats>('/stats'));
      setSignedIn(true);
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) {
        clearAdminToken();
        setSignedIn(false);
        setError('Your admin session ended. Sign in again.');
      } else {
        setError(err instanceof Error ? err.message : 'Could not load stats');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (getAdminToken()) load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await adminFetch<{ token: string }>('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAdminToken(token);
      setPassword('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      setLoading(false);
    }
  }

  function handleLogout() {
    clearAdminToken();
    setStats(null);
    setSignedIn(false);
  }

  if (!signedIn) {
    return (
      <div className={styles.loginWrap}>
        <form className={styles.loginBox} onSubmit={handleLogin}>
          <p className={styles.loginTitle}>CrackJEE admin</p>
          <p className={styles.loginSub}>Sign in to view platform metrics.</p>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="admin-email">Email</label>
            <input id="admin-email" className={styles.input} type="email" autoComplete="username"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="admin-password">Password</label>
            <input id="admin-password" className={styles.input} type="password" autoComplete="current-password"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className={`${styles.btn} ${styles.submit}`} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    );
  }

  const maxSignups = Math.max(1, ...(stats?.signupsByDay.map((d) => d.count) ?? [0]));

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <header className={styles.header}>
          <div>
            <p className={styles.title}>Platform overview</p>
            <p className={styles.sub}>Students, exams and question bank. Refreshed when you press Refresh.</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={styles.btn} onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</button>
            <button className={styles.btn} onClick={handleLogout}>Sign out</button>
          </div>
        </header>

        {error && <div className={styles.error}>{error}</div>}

        {stats && (
          <>
            <section className={styles.statGrid}>
              <div className={styles.card}>
                <p className={styles.statLabel}>Registered students</p>
                <p className={styles.statValue}>{stats.totals.registered}</p>
              </div>
              <div className={styles.card}>
                <p className={styles.statLabel}>Took any exam</p>
                <p className={styles.statValue}>{stats.totals.tookAnyExam}</p>
                <p className={styles.statSub}>{stats.totals.registered > 0
                  ? `${Math.round((stats.totals.tookAnyExam / stats.totals.registered) * 100)}% of students`
                  : 'No students yet'}</p>
              </div>
              <div className={styles.card}>
                <p className={styles.statLabel}>Practice sessions</p>
                <p className={styles.statValue}>{stats.totals.practiceAttempts}</p>
                <p className={styles.statSub}>{stats.totals.tookPractice} students · {stats.totals.practiceAccuracy}% correct</p>
              </div>
              <div className={styles.card}>
                <p className={styles.statLabel}>Mock exams submitted</p>
                <p className={styles.statValue}>{stats.totals.mockSubmissions}</p>
                <p className={styles.statSub}>{stats.totals.tookMock} students</p>
              </div>
              <div className={styles.card}>
                <p className={styles.statLabel}>Average mock score</p>
                <p className={styles.statValue}>{stats.totals.avgMockPercent !== null ? `${stats.totals.avgMockPercent}%` : '—'}</p>
              </div>
              <div className={styles.card}>
                <p className={styles.statLabel}>Questions in bank</p>
                <p className={styles.statValue}>{stats.bank.total.toLocaleString('en-IN')}</p>
              </div>
            </section>

            <div className={styles.twoCol}>
              <section className={`${styles.card} ${styles.section}`} style={{ marginTop: 0 }}>
                <p className={styles.sectionTitle}>Sign-ups, last 14 days</p>
                {stats.signupsByDay.map((d) => (
                  <div key={d.date} className={styles.barRow}>
                    <span>{d.date.slice(5)}</span>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ width: `${(d.count / maxSignups) * 100}%` }} />
                    </div>
                    <span className={styles.count}>{d.count}</span>
                  </div>
                ))}
              </section>

              <section className={`${styles.card} ${styles.section}`} style={{ marginTop: 0 }}>
                <p className={styles.sectionTitle}>Question bank by subject</p>
                {Object.entries(stats.bank.bySubject).map(([subject, count]) => (
                  <div key={subject} className={styles.subjectRow}>
                    <span>{subject}</span>
                    <span>{count.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </section>
            </div>

            <section className={styles.section}>
              <p className={styles.sectionTitle}>Students and exam activity</p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Class</th>
                      <th>Target</th>
                      <th>Joined</th>
                      <th className={styles.num}>Practice</th>
                      <th className={styles.num}>Accuracy</th>
                      <th className={styles.num}>Mocks</th>
                      <th>Last active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.students.length === 0 && (
                      <tr><td colSpan={9} className={styles.muted}>No students registered yet.</td></tr>
                    )}
                    {stats.students.map((s) => (
                      <tr key={s.id}>
                        <td>{s.name}</td>
                        <td className={styles.muted}>{s.email}</td>
                        <td>{s.class}</td>
                        <td>{s.targetExam}</td>
                        <td>{fmtDate(s.joinedAt)}</td>
                        <td className={styles.num}>{s.practiceAttempts}</td>
                        <td className={styles.num}>{s.practiceAttempts > 0 ? `${s.practiceAccuracy}%` : '—'}</td>
                        <td className={styles.num}>{s.mockSubmitted}</td>
                        <td>{fmtDate(s.lastActive)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
