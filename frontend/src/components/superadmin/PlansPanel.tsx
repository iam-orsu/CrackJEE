'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  AdminError,
  createPlan,
  deletePlan,
  listPlans,
  updatePlan,
  type AdminPlan,
} from '@/lib/admin';
import styles from '@/app/superadmin/superadmin.module.css';

interface Props {
  onUnauthorized: () => void;
}

const blank = {
  name: '',
  price: '',
  originalPrice: '',
  durationDays: '',
  examLimit: '',
  tagline: '',
  badge: '',
  features: '',
  featured: false,
  isActive: true,
};

/** Superadmin CRUD block for subscription plans shown on the public pricing page. */
export function PlansPanel({ onUnauthorized }: Props) {
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [form, setForm] = useState(blank);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setPlans(await listPlans());
      setError('');
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) {
        onUnauthorized();
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to load plans');
    } finally {
      setLoading(false);
    }
  }, [onUnauthorized]);

  useEffect(() => {
    void load();
  }, [load]);

  function reset() {
    setEditingId(null);
    setForm(blank);
    setError('');
  }

  function startEdit(p: AdminPlan) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: String(p.pricePaise / 100),
      originalPrice: p.originalPricePaise !== null ? String(p.originalPricePaise / 100) : '',
      durationDays: p.durationDays !== null ? String(p.durationDays) : '',
      examLimit: p.examLimit !== null ? String(p.examLimit) : '',
      tagline: p.tagline ?? '',
      badge: p.badge ?? '',
      features: p.features.join('\n'),
      featured: p.featured,
      isActive: p.isActive,
    });
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      name: form.name.trim(),
      tagline: form.tagline.trim() || null,
      pricePaise: Math.round(Number(form.price || '0') * 100),
      originalPricePaise: form.originalPrice.trim() ? Math.round(Number(form.originalPrice) * 100) : null,
      durationDays: form.durationDays.trim() ? Number(form.durationDays) : null,
      examLimit: form.examLimit.trim() ? Number(form.examLimit) : null,
      features: form.features.split('\n').map((s) => s.trim()).filter(Boolean),
      badge: form.badge.trim() || null,
      featured: form.featured,
      isActive: form.isActive,
    };
    try {
      if (editingId) {
        const updated = await updatePlan(editingId, payload);
        setPlans((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      } else {
        const created = await createPlan(payload);
        setPlans((prev) => [...prev, created]);
      }
      reset();
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) return onUnauthorized();
      setError(err instanceof Error ? err.message : 'Could not save plan');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: AdminPlan) {
    if (!window.confirm(`Delete the "${p.name}" plan?`)) return;
    setBusyId(p.id);
    setError('');
    try {
      await deletePlan(p.id);
      setPlans((prev) => prev.filter((x) => x.id !== p.id));
      if (editingId === p.id) reset();
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) return onUnauthorized();
      setError(err instanceof Error ? err.message : 'Could not delete plan');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.blockHead}>
        <h2 className={styles.blockTitle}>
          Subscription Plans <span className={styles.muted}>{plans.length} total · /pricing</span>
        </h2>
        {editingId && (
          <button type="button" className={styles.textBtn} onClick={reset}>+ New plan</button>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.card} style={{ marginBottom: 14 }}>
        <p className={styles.sectionTitle}>{editingId ? `Editing: ${form.name || editingId}` : 'New plan'}</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className={styles.label}>Name</label>
            <input className={styles.input} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </div>
          <div style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className={styles.label}>Price (₹)</label>
            <input type="number" min={0} className={styles.input} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required />
          </div>
          <div style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className={styles.label}>Original (₹)</label>
            <input type="number" min={0} className={styles.input} value={form.originalPrice} onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))} />
          </div>
          <div style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className={styles.label}>Duration (days)</label>
            <input type="number" min={0} className={styles.input} placeholder="blank = forever" value={form.durationDays} onChange={(e) => setForm((f) => ({ ...f, durationDays: e.target.value }))} />
          </div>
          <div style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className={styles.label}>Free exam limit</label>
            <input type="number" min={0} className={styles.input} placeholder="blank = unlimited" value={form.examLimit} onChange={(e) => setForm((f) => ({ ...f, examLimit: e.target.value }))} />
          </div>
          <div style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className={styles.label}>Badge</label>
            <input className={styles.input} placeholder="Most popular" value={form.badge} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))} />
          </div>
          <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className={styles.label}>Tagline</label>
            <input className={styles.input} value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 10 }}>
          <label className={styles.label}>Features (one per line)</label>
          <textarea className={styles.textarea} rows={5} value={form.features} onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))} />
        </div>

        <div className={styles.checkRow}>
          <label>
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
            Featured card
          </label>
          <label>
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
            Active (visible on pricing)
          </label>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 14 }}>
          <button type="submit" className={styles.btn} disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Save changes' : 'Create plan'}
          </button>
          {editingId && <button type="button" className={styles.textBtn} onClick={reset}>Cancel</button>}
        </div>
      </form>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Plan</th>
              <th className={styles.num}>Price</th>
              <th>Duration</th>
              <th className={styles.num}>Exams</th>
              <th className={styles.num}>Features</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} className={styles.muted}>Loading plans...</td></tr>}
            {!loading && plans.length === 0 && (
              <tr><td colSpan={7} className={styles.muted}>No plans yet. Create one above — it appears on /pricing.</td></tr>
            )}
            {plans.map((p) => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span className={styles.strong}>{p.name}</span>
                    {p.badge && <span className={`${styles.pill} ${styles.pill_neutral}`}>{p.badge}</span>}
                  </div>
                </td>
                <td className={styles.num}>
                  ₹{(p.pricePaise / 100).toLocaleString('en-IN')}
                  {p.originalPricePaise !== null && (
                    <span className={styles.muted} style={{ marginLeft: 6, textDecoration: 'line-through' }}>
                      ₹{(p.originalPricePaise / 100).toLocaleString('en-IN')}
                    </span>
                  )}
                </td>
                <td>{p.durationDays === null ? 'Forever' : `${p.durationDays} days`}</td>
                <td className={styles.num}>{p.examLimit === null ? '∞' : p.examLimit}</td>
                <td className={styles.num}>{p.features.length}</td>
                <td>
                  <span className={`${styles.pill} ${p.isActive ? styles.pill_good : styles.pill_bad}`}>
                    {p.isActive ? 'Active' : 'Hidden'}
                  </span>
                  {p.featured && <span className={`${styles.pill} ${styles.pill_neutral}`} style={{ marginLeft: 6 }}>Featured</span>}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <button type="button" className={styles.textBtn} onClick={() => startEdit(p)}>Edit</button>
                    <button type="button" className={styles.textBtn} disabled={busyId === p.id} onClick={() => void handleDelete(p)}>
                      {busyId === p.id ? 'Deleting...' : 'Delete'}
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
