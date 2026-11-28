'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '@/app/superadmin/superadmin.module.css';
import { useSuperAdmin } from '@/components/superadmin/superadmin-context';

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function SuperAdminStudentsPage() {
  const { stats, reload, loading } = useSuperAdmin();
  const [query, setQuery] = useState('');

  if (!stats) return null;

  const needle = query.trim().toLowerCase();
  const visibleStudents = stats.students.filter(
    (s) => !needle || s.name.toLowerCase().includes(needle) || s.email.toLowerCase().includes(needle),
  );

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.title}>Students</p>
          <p className={styles.sub}>Every registered learner, with practice and mock activity.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={styles.btn} onClick={reload} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</button>
        </div>
      </header>

      <section className={styles.section} style={{ marginTop: 0 }}>
        <div className={styles.blockHead}>
          <h2 className={styles.blockTitle}>Roster <span className={styles.muted}>{visibleStudents.length} of {stats.students.length}</span></h2>
          <input
            className={styles.search}
            placeholder="Search name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
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
              {visibleStudents.length === 0 && (
                <tr><td colSpan={9} className={styles.muted}>No students match.</td></tr>
              )}
              {visibleStudents.map((s) => (
                <tr key={s.id}>
                  <td>
                    <Link href={`/superadmin/students/${s.id}`} className={styles.textBtn}>{s.name}</Link>
                  </td>
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
  );
}
