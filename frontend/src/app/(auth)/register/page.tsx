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
  const [showPwd, setShowPwd] = useState(false);

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
      {/* ── Left brand panel ── */}
      <div className="auth-brand">
        <Link href="/" className="auth-brand-logo">CrackJEE</Link>

        <div className="auth-brand-body">
          <div className="auth-brand-eyebrow">30 seconds to set up</div>
          <p className="auth-brand-tagline">The only prep tool<br />that learns you.</p>
          <p className="auth-brand-sub">
            We track every topic you attempt. The moment your accuracy drops
            below 60%, it's flagged as a weak area. No wasted time, only targeted practice.
          </p>

          <div className="auth-features">
            <div className="auth-feature-item">
              <span className="auth-feature-icon" style={{ background: 'rgba(96,165,250,.15)', color: '#60a5fa' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                  <path d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/>
                </svg>
              </span>
              <div>
                <p className="auth-feature-title">AI generates every question</p>
                <p className="auth-feature-desc">No recycled question banks, unique problems every session</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-icon" style={{ background: 'rgba(251,191,36,.15)', color: '#fbbf24' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </span>
              <div>
                <p className="auth-feature-title">Instant weak area detection</p>
                <p className="auth-feature-desc">Dashboard shows exactly which topics need work</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-icon" style={{ background: 'rgba(74,222,128,.15)', color: '#4ade80' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
                </svg>
              </span>
              <div>
                <p className="auth-feature-title">JEE Main & Advanced</p>
                <p className="auth-feature-desc">Covers full Class 11 + 12 MPC syllabus</p>
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
            <p className="auth-form-title">Create your account</p>
            <p className="auth-form-sub">Free for all students · takes 30 seconds</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form-fields">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full name</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input id="name" type="text" className="form-input auth-input-padded"
                  placeholder="Your full name"
                  value={form.name} onChange={(e) => set('name', e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <input id="email" type="email" className="form-input auth-input-padded"
                  placeholder="you@example.com"
                  value={form.email} onChange={(e) => set('email', e.target.value)}
                  autoComplete="email" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input id="password" type={showPwd ? 'text' : 'password'}
                  className="form-input auth-input-padded auth-input-padded-r"
                  placeholder="Min 8 characters"
                  value={form.password} onChange={(e) => set('password', e.target.value)}
                  autoComplete="new-password" required />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPwd(v => !v)} tabIndex={-1}>
                  {showPwd
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
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
              <label className="form-label">Current level</label>
              <select className="form-select" value={form.currentLevel}
                onChange={(e) => set('currentLevel', e.target.value as FormState['currentLevel'])}>
                <option value="beginner">Beginner: just getting started</option>
                <option value="intermediate">Intermediate: covered most topics</option>
                <option value="advanced">Advanced: revision &amp; mock tests</option>
              </select>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading
                ? <><span className="auth-spinner" />Creating account...</>
                : 'Create account →'
              }
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
