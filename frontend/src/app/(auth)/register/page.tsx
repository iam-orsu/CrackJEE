'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { setSession } from '@/lib/auth';

type FormState = {
  name: string;
  email: string;
  password: string;
  class: '11' | '12' | 'Dropper';
  targetExam: 'Main' | 'Advanced' | 'Both';
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    class: '12',
    targetExam: 'Main',
    currentLevel: 'beginner',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const { token, user } = await api.auth.register(form);
      setSession(token, user);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-brand">
        <Link href="/" className="auth-brand-logo">CrackJEE</Link>

        <div className="auth-brand-body">
          <p className="auth-brand-tagline">
            The only prep platform that learns your weak spots.
          </p>
          <p className="auth-brand-sub">
            We track every topic you practice. The moment your success
            rate dips below 60%, we flag it as a weak area. You will never
            waste time on topics you already know.
          </p>
        </div>

        <p className="auth-brand-footer">Takes 30 seconds to set up</p>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-box">
          <p className="auth-form-title">Create your account</p>
          <p className="auth-form-sub">Start practicing in under a minute</p>

          <form onSubmit={handleSubmit} className="auth-form-fields">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full name</label>
              <input id="name" type="text" className="form-input" placeholder="Rahul Sharma"
                value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input id="email" type="email" className="form-input" placeholder="you@example.com"
                value={form.email} onChange={(e) => set('email', e.target.value)}
                autoComplete="email" required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input id="password" type="password" className="form-input" placeholder="Min 8 characters"
                value={form.password} onChange={(e) => set('password', e.target.value)}
                autoComplete="new-password" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Class</label>
                <select className="form-select" value={form.class}
                  onChange={(e) => set('class', e.target.value as FormState['class'])}>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                  <option value="Dropper">Dropper</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Target</label>
                <select className="form-select" value={form.targetExam}
                  onChange={(e) => set('targetExam', e.target.value as FormState['targetExam'])}>
                  <option value="Main">JEE Main</option>
                  <option value="Advanced">JEE Advanced</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Current preparation level</label>
              <select className="form-select" value={form.currentLevel}
                onChange={(e) => set('currentLevel', e.target.value as FormState['currentLevel'])}>
                <option value="beginner">Beginner: just getting started</option>
                <option value="intermediate">Intermediate: covered most topics</option>
                <option value="advanced">Advanced: revision and mock tests</option>
              </select>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 4 }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="auth-form-link">
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
