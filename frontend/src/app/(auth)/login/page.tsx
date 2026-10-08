'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { setSession, isAuthenticated } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) router.replace('/dashboard');
  }, [router]);

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
      {/* ── Left brand panel ── */}
      <div className="auth-brand">
        <Link href="/" className="auth-brand-logo">CrackJEE</Link>

        <div className="auth-brand-body">
          <div className="auth-brand-eyebrow">AI-powered JEE preparation</div>
          <p className="auth-brand-tagline">Stop guessing.<br />Start knowing.</p>
          <p className="auth-brand-sub">
            Every session brings fresh AI-generated questions, tracks your weak spots,
            and builds your mastery across Physics, Chemistry and Mathematics.
          </p>

          <div className="auth-features">
            <div className="auth-feature-item">
              <span className="auth-feature-icon" style={{ background: 'rgba(96,165,250,.15)', color: '#60a5fa' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </span>
              <div>
                <p className="auth-feature-title">Fresh questions every time</p>
                <p className="auth-feature-desc">DeepSeek generates unique JEE-style problems per session</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-icon" style={{ background: 'rgba(74,222,128,.15)', color: '#4ade80' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                </svg>
              </span>
              <div>
                <p className="auth-feature-title">Automatic weak area detection</p>
                <p className="auth-feature-desc">Topics below 60% accuracy are flagged instantly</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-icon" style={{ background: 'rgba(216,180,254,.15)', color: '#d8b4fe' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </span>
              <div>
                <p className="auth-feature-title">Real progress tracking</p>
                <p className="auth-feature-desc">Subject mastery rings and weekly activity charts</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-subject-tags">
          <span className="auth-subject-tag" style={{ color: '#60a5fa', background: 'rgba(96,165,250,.12)' }}>⚛ Physics</span>
          <span className="auth-subject-tag" style={{ color: '#d8b4fe', background: 'rgba(216,180,254,.12)' }}>∑ Mathematics</span>
          <span className="auth-subject-tag" style={{ color: '#4ade80', background: 'rgba(74,222,128,.12)' }}>⚗ Chemistry</span>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-form-panel">
        <div className="auth-form-box">
          <div className="auth-form-header">
            <p className="auth-form-title">Welcome back</p>
            <p className="auth-form-sub">Sign in to continue your preparation</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form-fields">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  id="email"
                  type="email"
                  className={`form-input auth-input-padded${error ? ' error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  className={`form-input auth-input-padded auth-input-padded-r${error ? ' error' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPwd(v => !v)} tabIndex={-1}>
                  {showPwd
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading
                ? <><span className="auth-spinner" />Signing in...</>
                : 'Sign in →'
              }
            </button>
          </form>

          <p className="auth-form-link">
            New to CrackJEE?{' '}
            <Link href="/register">Create a free account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
