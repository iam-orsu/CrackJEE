'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  AdminError,
  createFacultyAccount,
  listFacultyAccounts,
  updateFacultyAccount,
  type FacultyAccount,
} from '@/lib/admin';
import styles from '@/app/superadmin/superadmin.module.css';

interface Props {
  onUnauthorized: () => void;
}

/** Superadmin management block for creating, toggling, and resetting faculty accounts. */
export function FacultyAccountsPanel({ onUnauthorized }: Props) {
  const [accounts, setAccounts] = useState<FacultyAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);

  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listFacultyAccounts();
      setAccounts(list);
      setError('');
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) {
        onUnauthorized();
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to load faculty accounts');
    } finally {
      setLoading(false);
    }
  }, [onUnauthorized]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      const created = await createFacultyAccount({ name, email, password });
      setAccounts((prev) => [created, ...prev]);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) return onUnauthorized();
      setError(err instanceof Error ? err.message : 'Could not create faculty account');
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleActive(acc: FacultyAccount) {
    setSavingId(acc.id);
    setError('');
    try {
      const updated = await updateFacultyAccount(acc.id, { isActive: !acc.isActive });
      setAccounts((prev) => prev.map((a) => (a.id === acc.id ? updated : a)));
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) return onUnauthorized();
      setError(err instanceof Error ? err.message : 'Failed to update faculty status');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.blockHead}>
        <h2 className={styles.blockTitle}>
          Faculty / Mentor Accounts <span className={styles.muted}>{accounts.length} total · /faculty</span>
        </h2>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form
        onSubmit={handleCreate}
        className={styles.card}
        style={{ marginBottom: 14, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end' }}
      >
        <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label className={styles.label}>Mentor Name</label>
          <input
            className={styles.input}
            placeholder="e.g. Dr. R. Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div style={{ flex: '1 1 210px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            className={styles.input}
            placeholder="faculty@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ flex: '1 1 170px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label className={styles.label}>Initial Password (optional)</label>
          <input
            type="password"
            minLength={8}
            className={styles.input}
            placeholder="Leave blank — Google sign-in only"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.btn} disabled={creating}>
          {creating ? 'Creating…' : 'Create Faculty Account'}
        </button>
      </form>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th className={styles.num}>Papers</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className={styles.muted}>Loading faculty accounts…</td></tr>
            )}
            {!loading && accounts.length === 0 && (
              <tr><td colSpan={5} className={styles.muted}>No faculty accounts yet. Create one above — mentors sign in with Google using the same email.</td></tr>
            )}
            {accounts.map((acc) => (
              <tr key={acc.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {acc.avatarUrl ? (
                      <Image
                        src={acc.avatarUrl}
                        alt=""
                        width={32}
                        height={32}
                        className="h-8 w-8 shrink-0 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span
                        aria-hidden
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '999px',
                          background: '#EEF2FF',
                          color: '#003366',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {(acc.name || acc.email).slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <span className={styles.muted}>{acc.name}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span className={styles.muted}>{acc.email}</span>
                    {acc.googleLinked && (
                      <span className={`${styles.pill} ${styles.pill_neutral}`}>Google linked</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`${styles.pill} ${acc.isActive ? styles.pill_good : styles.pill_bad}`}>
                    {acc.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className={styles.num}>{acc.paperCount}</td>
                <td>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className={styles.textBtn}
                      disabled={savingId === acc.id}
                      onClick={() => void handleToggleActive(acc)}
                    >
                      {acc.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
