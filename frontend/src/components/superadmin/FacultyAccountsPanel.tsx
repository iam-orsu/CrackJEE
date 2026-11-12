'use client';

import React, { useCallback, useEffect, useState } from 'react';
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

  const [resetId, setResetId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState('');
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

  async function handleResetPassword(id: string) {
    if (resetPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setSavingId(id);
    setError('');
    try {
      const updated = await updateFacultyAccount(id, { password: resetPassword });
      setAccounts((prev) => prev.map((a) => (a.id === id ? updated : a)));
      setResetId(null);
      setResetPassword('');
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) return onUnauthorized();
      setError(err instanceof Error ? err.message : 'Failed to reset password');
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
          <label className={styles.label}>Initial Password (min 8)</label>
          <input
            type="password"
            minLength={8}
            className={styles.input}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
              <tr><td colSpan={5} className={styles.muted}>No faculty accounts yet. Create one above or via npm run faculty:create.</td></tr>
            )}
            {accounts.map((acc) => (
              <tr key={acc.id}>
                <td>{acc.name}</td>
                <td className={styles.muted}>{acc.email}</td>
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
                    {resetId === acc.id ? (
                      <>
                        <input
                          type="password"
                          minLength={8}
                          placeholder="New password"
                          className={styles.input}
                          style={{ padding: '4px 8px', fontSize: 12, width: 140 }}
                          value={resetPassword}
                          onChange={(e) => setResetPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className={styles.textBtn}
                          disabled={savingId === acc.id}
                          onClick={() => void handleResetPassword(acc.id)}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className={styles.textBtn}
                          style={{ color: '#6b7280' }}
                          onClick={() => { setResetId(null); setResetPassword(''); }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className={styles.textBtn}
                        onClick={() => { setResetId(acc.id); setResetPassword(''); }}
                      >
                        Reset Password
                      </button>
                    )}
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
