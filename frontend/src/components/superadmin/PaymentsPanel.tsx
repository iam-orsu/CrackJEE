'use client';

import { useCallback, useEffect, useState } from 'react';
import { AdminError, listPayments, type AdminPayment } from '@/lib/admin';
import styles from '@/app/superadmin/superadmin.module.css';

interface Props {
  onUnauthorized: () => void;
}

const statusClass = (status: string) =>
  status === 'CAPTURED' ? styles.pill_good : status === 'FAILED' ? styles.pill_bad : styles.pill_neutral;

const statusLabel = (status: string) =>
  status === 'CAPTURED' ? 'Paid' : status === 'FAILED' ? 'Failed' : 'Pending';

/** Superadmin read-only ledger of Razorpay transactions. */
export function PaymentsPanel({ onUnauthorized }: Props) {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setPayments(await listPayments());
      setError('');
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) {
        onUnauthorized();
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, [onUnauthorized]);

  useEffect(() => {
    void load();
  }, [load]);

  const captured = payments.filter((p) => p.status === 'CAPTURED').length;
  const revenue = payments.reduce((sum, p) => (p.status === 'CAPTURED' ? sum + p.amountPaise : sum), 0);

  return (
    <section className={styles.section}>
      <div className={styles.blockHead}>
        <h2 className={styles.blockTitle}>
          Transactions{' '}
          <span className={styles.muted}>
            {captured} paid · ₹{(revenue / 100).toLocaleString('en-IN')} collected
          </span>
        </h2>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Plan</th>
              <th className={styles.num}>Amount</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className={styles.muted}>Loading payments...</td></tr>}
            {!loading && payments.length === 0 && (
              <tr><td colSpan={6} className={styles.muted}>No payments yet.</td></tr>
            )}
            {payments.map((p) => (
              <tr key={p.id}>
                <td className={styles.num}>
                  {new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td>
                  <span className={styles.strong}>{p.user.name}</span>
                  <br />
                  <span className={styles.muted}>{p.user.email}</span>
                </td>
                <td>{p.planId}</td>
                <td className={styles.num}>₹{(p.amountPaise / 100).toLocaleString('en-IN')}</td>
                <td>{p.paymentMethod ?? '—'}</td>
                <td>
                  <span className={`${styles.pill} ${statusClass(p.status)}`}>{statusLabel(p.status)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
