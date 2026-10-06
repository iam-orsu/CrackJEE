'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { setSession } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, user } = await api.auth.login(form);
      setSession(token, user);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout">
      {/* ── Brand panel ── */}
      <div className="auth-brand">
        <Link href="/" className="auth-brand-logo">CrackJEE</Link>

        <div className="auth-brand-body">
          <p className="auth-brand-tagline">
            Every question you skip is a mark you lose.
          </p>
          <p className="auth-brand-sub">
            AI generates fresh JEE questions on every session.
            Your weak areas are tracked automatically so you know
            exactly where to focus.
          </p>
        </div>

        <p className="auth-brand-footer">Free for all students · JEE Main & Advanced</p>
      </div>

      {/* ── Form panel ── */}
      <div className="auth-form-panel">
        <div className="auth-form-box">
          <p className="auth-form-title">Welcome back</p>
          <p className="auth-form-sub">Sign in to continue your preparation</p>

          <form onSubmit={handleSubmit} className="auth-form-fields">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className={`form-input${error ? ' error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className={`form-input${error ? ' error' : ''}`}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <button
              type="submit"
              className="btn btn-primary w-full"
              style={{ marginTop: 4, width: '100%', justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="auth-form-link">
            New to CrackJEE?{' '}
            <Link href="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
