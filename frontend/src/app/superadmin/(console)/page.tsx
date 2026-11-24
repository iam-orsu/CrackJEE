'use client';

import Link from 'next/link';
import styles from '@/app/superadmin/superadmin.module.css';
import { useSuperAdmin } from '@/components/superadmin/superadmin-context';

export default function SuperAdminOverviewPage() {
  const { stats, reload, loading } = useSuperAdmin();

  if (!stats) return null;

  const maxSignups = Math.max(1, ...stats.signupsByDay.map((d) => d.count));

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.title}>Platform overview</p>
          <p className={styles.sub}>Students, exams and question bank. Refreshed when you press Refresh.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={styles.btn} onClick={reload} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</button>
        </div>
      </header>

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
        <div className={styles.blockHead}>
          <h2 className={styles.blockTitle}>Students <span className={styles.muted}>{stats.students.length} registered</span></h2>
          <Link href="/superadmin/students" className={styles.textBtn}>Open the roster →</Link>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Class</th>
                <th>Target</th>
                <th className={styles.num}>Accuracy</th>
                <th className={styles.num}>Mocks</th>
              </tr>
            </thead>
            <tbody>
              {stats.students.length === 0 && (
                <tr><td colSpan={6} className={styles.muted}>No students yet.</td></tr>
              )}
              {stats.students.slice(0, 8).map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td className={styles.muted}>{s.email}</td>
                  <td>{s.class}</td>
                  <td>{s.targetExam}</td>
                  <td className={styles.num}>{s.practiceAttempts > 0 ? `${s.practiceAccuracy}%` : '—'}</td>
                  <td className={styles.num}>{s.mockSubmitted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
