'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { setSession, isAuthenticated } from '@/lib/auth';

type FormState = {
  name: string;
  email: string;
  password: string;
  class: '11' | '12' | 'Dropper';
  targetExam: 'Main' | 'Advanced' | 'Both' | 'NEET';
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
};

const CLASSES = [
  ['11', 'Class 11'],
  ['12', 'Class 12'],
  ['Dropper', 'Dropper'],
] as const;

const EXAMS = [
  ['Main', 'JEE Main'],
  ['Advanced', 'JEE Advanced'],
  ['Both', 'JEE Both'],
  ['NEET', 'NEET UG'],
] as const;

const LEVELS = [
  ['beginner', 'Beginner', 'Just getting started'],
  ['intermediate', 'Intermediate', 'Covered most topics'],
  ['advanced', 'Advanced', 'Revision & mock tests'],
] as const;

const GOAL_LABEL: Record<FormState['targetExam'], string> = {
  Main: 'JEE Main',
  Advanced: 'JEE Advanced',
  Both: 'JEE Main + Advanced',
  NEET: 'NEET UG',
};

const TRACKER = [
  { name: 'Physics', pct: 72, low: false },
  { name: 'Chemistry', pct: 58, low: true },
  { name: 'Mathematics', pct: 81, low: false },
  { name: 'Biology', pct: 66, low: false },
];

const Sparkle = ({ className }: { className: string }) => (
  <svg className={`rg-spark ${className}`} viewBox="0 0 24 24" aria-hidden>
    <path d="M12 0C12 7 17 12 24 12C17 12 12 17 12 24C12 17 7 12 0 12C7 12 12 7 12 0Z" />
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) router.replace('/dashboard');
  }, [router]);

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
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const { user, expiresAt } = await api.auth.register(form);
      setSession(user, expiresAt);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  const pwdPct = Math.min(form.password.length / 8, 1) * 100;
  const pwdOk = form.password.length >= 8;

  return (
    <div className="rg-root">
      <style>{css}</style>

      {/* blob backgrounds, same family as the landing page */}
      <div className="rg-blob rg-blob-a" aria-hidden />
      <div className="rg-blob rg-blob-b" aria-hidden />
      <div className="rg-blob rg-blob-c" aria-hidden />
      <div className="rg-blob rg-blob-d" aria-hidden />
      <Sparkle className="rg-s1" />
      <Sparkle className="rg-s2" />
      <Sparkle className="rg-s3" />

      <div className="rg-page">
        {/* ── Nav ── */}
        <nav className="rg-nav">
          <Link href="/" className="rg-logo">
            <Image src="/logo.png" alt="JEENEET.ai" width={150} height={62} className="site-logo" priority />
          </Link>
          <Link href="/login" className="rg-nav-btn">Sign in</Link>
        </nav>

        {/* ── Hero text ── */}
        <header className="rg-hero">
          <p className="rg-badge">
            <i aria-hidden />
            30 seconds to set up
          </p>
          <h2 className="rg-tagline">
            <span className="rg-t1">The only prep tool</span>
            <span className="rg-t2">that learns you.</span>
          </h2>
          <p className="rg-sub">
            We track every topic you attempt. The moment your accuracy drops below 60%,
            it&apos;s flagged as a weak area. No wasted time, only targeted practice.
          </p>
        </header>

        {/* ── Stage: form in the middle, cards floating around it ── */}
        <section className="rg-stage">
          <main className="rg-box">
            <header className="rg-head">
              <h1>Create your account</h1>
              <p>Free for all students · takes 30 seconds</p>
            </header>

            <form onSubmit={handleSubmit} className="rg-form">
              <div className="rg-row-2">
                <div className="rg-field">
                  <label htmlFor="name">Full name</label>
                  <div className="rg-input">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>

                <div className="rg-field">
                  <label htmlFor="email">Email</label>
                  <div className="rg-input">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="rg-field">
                <label htmlFor="password">Password</label>
                <div className="rg-input">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <input
                    id="password"
                    type={showPwd ? 'text' : 'password'}
                    className={error && !pwdOk ? 'rg-err' : ''}
                    placeholder="Min 8 characters"
                    value={form.password}
                    onChange={(e) => set('password', e.target.value)}
                    autoComplete="new-password"
                    required
                    style={{ paddingRight: 52 }}
                  />
                  <button
                    type="button"
                    className="rg-eye"
                    onClick={() => setShowPwd((v) => !v)}
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                  >
                    {showPwd ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="rg-pmeter" aria-hidden>
                  <i className={pwdOk ? 'rg-ok' : ''} style={{ width: `${pwdPct}%` }} />
                </div>
                <p className="rg-hint">{pwdOk ? 'Good to go' : `${form.password.length}/8 characters`}</p>
              </div>

              <div className="rg-row-2">
                <div className="rg-field">
                  <span className="rg-label" id="lbl-class">Class</span>
                  <div className="rg-chips" role="radiogroup" aria-labelledby="lbl-class">
                    {CLASSES.map(([v, label]) => (
                      <button
                        key={v}
                        type="button"
                        role="radio"
                        aria-checked={form.class === v}
                        className={`rg-chip${form.class === v ? ' on' : ''}`}
                        onClick={() => set('class', v)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rg-field">
                  <span className="rg-label" id="lbl-target">Target exam</span>
                  <div className="rg-chips" role="radiogroup" aria-labelledby="lbl-target">
                    {EXAMS.map(([v, label]) => (
                      <button
                        key={v}
                        type="button"
                        role="radio"
                        aria-checked={form.targetExam === v}
                        className={`rg-chip${form.targetExam === v ? ' on' : ''}`}
                        onClick={() => set('targetExam', v)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rg-field">
                <span className="rg-label" id="lbl-level">Current level</span>
                <div className="rg-levels" role="radiogroup" aria-labelledby="lbl-level">
                  {LEVELS.map(([v, title, desc]) => (
                    <button
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={form.currentLevel === v}
                      className={`rg-level${form.currentLevel === v ? ' on' : ''}`}
                      onClick={() => set('currentLevel', v)}
                    >
                      <strong>{title}</strong>
                      <small>{desc}</small>
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="rg-error" role="alert">{error}</p>}

              <button type="submit" className="rg-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="rg-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            <p className="rg-link">
              Already have an account? <Link href="/login">Sign in</Link>
            </p>
          </main>

          {/* Accuracy tracker */}
          <div className="rg-card">
            <p className="rg-card-title">Accuracy tracker</p>
            <div className="rg-rows">
              {TRACKER.map((t) => (
                <div key={t.name} className={`rg-row${t.low ? ' rg-low' : ''}`}>
                  <span>{t.name}</span>
                  <div className="rg-bar"><i style={{ width: `${t.pct}%` }} /></div>
                  <em>{t.pct}%</em>
                </div>
              ))}
            </div>
            <p className="rg-note">below 60% = weak area</p>
          </div>

          {/* Goal card (updates live) */}
          <div className="rg-goal">
            <small>Your goal</small>
            <strong>
              {form.class === 'Dropper' ? 'Dropper' : `Class ${form.class}`} · {GOAL_LABEL[form.targetExam]}
            </strong>
            <span>let&apos;s go!</span>
          </div>

          {/* floating science chips (wide screens only) */}
          <span className="rg-chipf rg-chipf-pi" aria-hidden>π</span>
          <span className="rg-chipf rg-chipf-e" aria-hidden>E = mc²</span>
          <span className="rg-chipf rg-chipf-h2o" aria-hidden>H<sub>2</sub>O</span>
          <span className="rg-chipf rg-chipf-int" aria-hidden>∫x dx</span>
          <svg className="rg-atom" viewBox="0 0 120 120" fill="none" aria-hidden>
            <ellipse cx="60" cy="60" rx="52" ry="19" />
            <ellipse cx="60" cy="60" rx="52" ry="19" transform="rotate(60 60 60)" />
            <ellipse cx="60" cy="60" rx="52" ry="19" transform="rotate(120 60 60)" />
            <circle cx="60" cy="60" r="8" className="rg-nucleus" />
          </svg>
        </section>



        <div className="rg-subjects">
          <span><i />Physics</span>
          <span><i />Chemistry</span>
          <span><i />Mathematics</span>
          <span><i />Biology</span>
        </div>
      </div>
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700;800&display=swap');

.rg-root{
  --blue:#003366; --blue-d:#00284F; --ink:#003366; --muted:#3C4A8A;
  --purple:#803688; --purple-d:#5A2560; --purple-2:#A24BA8;
  --grad:linear-gradient(135deg,#803688 0%,#A24BA8 100%);
  --ice:#EEF2FF; --soft:#C6D2F8; --blob:#EDE3EF; --err:#C0283A;
  position:relative; min-height:100vh; min-height:100dvh;
  overflow:hidden; overflow:clip; background:#fff;
  font-family:'DM Sans',system-ui,sans-serif; color:var(--ink);
  -webkit-text-size-adjust:100%;
}
.rg-root *{box-sizing:border-box}
.rg-root h1,.rg-root h2,.rg-root p,.rg-root ul{margin:0;padding:0}
.rg-root button{font-family:inherit}
.rg-root :focus-visible{outline:3px solid var(--purple);outline-offset:3px}

/* ── Blob backgrounds ── */
.rg-blob{position:absolute;z-index:0;pointer-events:none}
.rg-blob-a{width:min(80vw,1150px);aspect-ratio:1.1;right:-24vw;bottom:-16vw;background:var(--blob);border-radius:58% 42% 47% 53% / 52% 61% 39% 48%}
.rg-blob-b{width:min(46vw,660px);aspect-ratio:1;left:-14vw;top:-13vw;background:#EEF1FB;border-radius:46% 54% 60% 40% / 52% 44% 56% 48%}
.rg-blob-c{width:min(30vw,420px);aspect-ratio:1;left:-6vw;bottom:14vh;background:#F3EAF5;border-radius:55% 45% 38% 62% / 48% 57% 43% 52%}
.rg-blob-d{width:min(18vw,260px);aspect-ratio:1;right:5vw;top:13vh;background:#F0F3FF;border-radius:62% 38% 50% 50% / 44% 56% 44% 56%}

.rg-spark{position:absolute;z-index:1;pointer-events:none;fill:var(--blue)}
.rg-s1{width:30px;top:21%;left:5%}
.rg-s2{width:22px;top:46%;right:6%;fill:var(--purple)}
.rg-s3{width:26px;bottom:20%;left:9%;fill:var(--purple)}

.rg-page{
  position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;
  width:100%;max-width:1320px;margin:0 auto;padding:0 clamp(16px,4vw,56px) clamp(56px,8vw,110px);
}

/* ── Nav ── */
.rg-nav{width:100%;display:flex;align-items:center;justify-content:space-between;padding:22px 0}
.rg-logo{display:inline-flex;align-items:center}
.rg-logo .site-logo{width:auto;height:70px;max-width:100%}
@media(max-width:720px){.rg-logo .site-logo{height:56px}}
@media(max-width:520px){.rg-logo .site-logo{height:48px}}
.rg-nav-btn{
  display:inline-flex;align-items:center;min-height:46px;padding:0 24px;border-radius:14px;
  font-weight:800;font-size:15px;color:var(--blue);text-decoration:none;background:#fff;border:2.5px solid var(--blue);
  box-shadow:0 5px 0 var(--soft);transition:transform .15s,box-shadow .15s;
}
.rg-nav-btn:hover{transform:translateY(-2px);box-shadow:0 7px 0 var(--soft)}
.rg-nav-btn:active{transform:translateY(4px);box-shadow:0 1px 0 var(--soft)}

/* ── Hero text ── */
.rg-hero{display:flex;flex-direction:column;align-items:center;text-align:center;gap:clamp(14px,2.2vh,22px);margin-top:clamp(4px,2vh,24px);max-width:1000px}
.rg-badge{display:inline-flex;align-items:center;gap:9px;padding:8px 16px 8px 13px;border-radius:99px;
  background:var(--ice);border:1.5px solid #B9C4EE;font-size:13px;font-weight:700;color:var(--blue)}
.rg-badge i{width:9px;height:9px;border-radius:50%;background:var(--purple);box-shadow:0 0 0 3px rgba(128,54,136,.22)}
.rg-tagline{
  display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:.06em .28em;
  font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;
  font-size:clamp(34px,5.8vw,76px);line-height:1.06;letter-spacing:-.035em;
}
.rg-t1{color:var(--blue)}
.rg-t2{
  display:inline-block;color:#fff;background:var(--grad);padding:.02em .2em .09em;border-radius:.22em;
  box-shadow:0 .07em 0 var(--purple-d);transform:rotate(-1.5deg);
}
.rg-sub{max-width:580px;font-size:clamp(15px,1.3vw,17px);line-height:1.65;color:var(--blue);opacity:.88}

/* ── Stage ── */
.rg-stage{position:relative;width:100%;margin-top:clamp(36px,5vh,56px);display:flex;flex-direction:column;align-items:center;gap:44px}

.rg-box{
  position:relative;z-index:3;width:100%;max-width:680px;background:#fff;border:2.5px solid var(--blue);
  border-radius:28px;padding:clamp(24px,3.4vw,44px);
  box-shadow:8px 10px 0 var(--blue),16px 20px 0 var(--purple);
  margin-bottom:16px;
}
.rg-card-inline{margin-top:22px;position:relative;box-shadow:0 10px 30px rgba(0,51,102,0.08);border:1.5px solid rgba(0,51,102,0.12)}
.rg-head{margin-bottom:26px}
.rg-head h1{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:clamp(30px,3vw,40px);line-height:1.08;letter-spacing:-.02em;color:var(--blue)}
.rg-head p{margin-top:10px;color:var(--muted);font-size:16px}

.rg-form{display:grid;gap:20px}
.rg-row-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
@media(max-width:720px){.rg-row-2{grid-template-columns:1fr}}
.rg-field label,.rg-label{display:block;font-weight:800;font-size:13px;margin-bottom:8px;color:var(--blue)}
.rg-input{position:relative}
.rg-input>svg{position:absolute;left:15px;top:50%;transform:translateY(-50%);color:var(--blue);opacity:.7;pointer-events:none}
.rg-input input{
  width:100%;height:54px;padding:0 16px 0 44px;font:inherit;font-weight:600;font-size:15px;color:var(--ink);
  background:#fff;border:2.5px solid var(--blue);border-radius:14px;outline:none;
  box-shadow:0 5px 0 var(--soft);transition:transform .12s,box-shadow .12s,border-color .12s;
  -webkit-appearance:none;appearance:none;
}
.rg-input input::placeholder{color:#97A3D4;font-weight:500}
.rg-input input:focus{border-color:var(--purple);transform:translateY(-2px);box-shadow:0 7px 0 #E3C9E6}
.rg-input input.rg-err{border-color:var(--err)}
.rg-eye{position:absolute;right:6px;top:50%;transform:translateY(-50%);width:44px;height:44px;display:grid;place-items:center;background:none;border:0;border-radius:10px;color:var(--blue);cursor:pointer}
.rg-eye:hover{background:var(--ice)}

.rg-pmeter{height:7px;background:#E4EAFC;border-radius:99px;overflow:hidden;margin-top:14px}
.rg-pmeter i{display:block;height:100%;background:var(--purple);border-radius:99px;transition:width .2s,background .2s}
.rg-pmeter i.rg-ok{background:var(--blue)}
.rg-hint{margin-top:6px;font-size:12px;font-weight:700;color:#5663A0}

/* Chips & level cards */
.rg-chips{display:flex;flex-wrap:wrap;gap:10px}
.rg-chip{
  min-height:46px;padding:0 18px;font-weight:800;font-size:14px;color:var(--blue);background:#fff;
  border:2.5px solid var(--blue);border-radius:13px;cursor:pointer;box-shadow:0 4px 0 var(--soft);
  transition:transform .12s,box-shadow .12s,background .12s,color .12s;-webkit-tap-highlight-color:transparent;
}
.rg-chip:hover{transform:translateY(-2px);box-shadow:0 6px 0 var(--soft)}
.rg-chip.on{background:var(--blue);color:#fff;box-shadow:0 4px 0 var(--blue-d);transform:translateY(0)}

.rg-levels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.rg-level{
  display:flex;flex-direction:column;gap:3px;align-items:flex-start;text-align:left;padding:12px 14px;min-height:66px;
  color:var(--blue);background:#fff;border:2.5px solid var(--blue);border-radius:14px;cursor:pointer;
  box-shadow:0 4px 0 var(--soft);transition:transform .12s,box-shadow .12s,background .12s;-webkit-tap-highlight-color:transparent;
}
.rg-level strong{font-size:14px}
.rg-level small{font-size:12px;line-height:1.35;font-weight:600;color:#5663A0}
.rg-level:hover{transform:translateY(-2px);box-shadow:0 6px 0 var(--soft)}
.rg-level.on{background:var(--grad);border-color:var(--purple);color:#fff;box-shadow:0 4px 0 var(--purple-d);transform:translateY(0)}
.rg-level.on small{color:rgba(255,255,255,.9)}

.rg-error{background:#FDE6E8;color:var(--err);border-left:5px solid var(--err);border-radius:10px;padding:12px 14px;font-weight:700;font-size:14px;overflow-wrap:anywhere}

.rg-submit{
  display:inline-flex;align-items:center;justify-content:center;gap:10px;margin-top:4px;min-height:58px;width:100%;
  font-weight:800;font-size:17px;color:#fff;background:var(--grad);border:0;border-radius:16px;cursor:pointer;
  box-shadow:0 7px 0 var(--purple-d);transition:transform .15s,box-shadow .15s;-webkit-tap-highlight-color:transparent;
}
.rg-submit:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 10px 0 var(--purple-d)}
.rg-submit:active:not(:disabled){transform:translateY(5px);box-shadow:0 2px 0 var(--purple-d)}
.rg-submit:disabled{opacity:.75;cursor:not-allowed}
.rg-spin{width:18px;height:18px;border-radius:50%;border:3px solid rgba(255,255,255,.4);border-top-color:#fff;animation:rg-rot .7s linear infinite}
.rg-box .rg-link{margin-top:22px;text-align:center;font-size:15px;line-height:1.6;color:var(--muted);font-weight:500}
.rg-link a{color:var(--purple);font-weight:800;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:4px;white-space:nowrap}

/* Accuracy tracker card */
.rg-card{
  position:relative;z-index:2;width:100%;max-width:440px;background:#fff;border:2.5px solid var(--blue);
  border-radius:24px;padding:22px 20px 18px;box-shadow:6px 8px 0 var(--blue);transform:rotate(-1.5deg);
}
.rg-card-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:20px;color:var(--blue);margin-bottom:12px}
.rg-rows{display:grid;gap:4px}
.rg-row{display:grid;grid-template-columns:96px minmax(0,1fr) 40px;gap:10px;align-items:center;padding:8px 10px;border-radius:12px;font-weight:700;font-size:13.5px}
.rg-row em{font-style:normal;text-align:right;font-weight:800}
.rg-bar{position:relative;height:10px;background:#E4EAFC;border-radius:99px}
.rg-bar i{display:block;height:100%;background:var(--blue);border-radius:99px;animation:rg-fill 1s .3s cubic-bezier(.2,.8,.2,1) both}
.rg-bar::after{content:"";position:absolute;left:60%;top:-4px;bottom:-4px;border-left:2px dashed rgba(0,51,102,.4)}
.rg-low{background:#F6E9F7}
.rg-low .rg-bar i{background:var(--grad)}
.rg-low em,.rg-low span{color:var(--purple)}
.rg-note{margin-top:12px;display:inline-block;padding:6px 12px;border-radius:99px;background:var(--ice);font-size:12.5px;font-weight:700;color:var(--blue)}

/* Goal card */
.rg-goal{
  position:relative;z-index:2;width:100%;max-width:300px;display:flex;flex-direction:column;gap:4px;
  background:#fff;border:2.5px solid var(--purple);border-radius:20px;padding:16px 18px;
  box-shadow:5px 7px 0 var(--purple-d);transform:rotate(1.5deg);
}
.rg-goal small{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--purple)}
.rg-goal strong{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:19px;line-height:1.25;font-weight:800;color:var(--blue)}
.rg-goal span{font-size:14px;font-weight:700;color:var(--muted)}

/* Floating chips + atom: wide screens only */
.rg-chipf,.rg-atom{display:none}
.rg-chipf{position:absolute;z-index:1;font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:19px;border-radius:14px;padding:11px 17px;line-height:1}
.rg-chipf-pi{background:var(--grad);color:#fff;box-shadow:0 5px 0 var(--purple-d);transform:rotate(-8deg)}
.rg-chipf-h2o{background:var(--grad);color:#fff;box-shadow:0 5px 0 var(--purple-d);transform:rotate(6deg)}
.rg-chipf-e{background:#fff;color:var(--blue);border:2px solid var(--blue);box-shadow:0 5px 0 var(--soft);transform:rotate(-5deg)}
.rg-chipf-int{background:#fff;color:var(--blue);border:2px solid var(--blue);box-shadow:0 5px 0 var(--soft);transform:rotate(5deg)}
.rg-atom{position:absolute;z-index:1;width:112px;height:112px;stroke:var(--blue);stroke-width:4;stroke-linecap:round}
.rg-nucleus{fill:var(--purple);stroke:none}

/* Points */
.rg-points{
  list-style:none;width:100%;max-width:1060px;margin-top:clamp(64px,9vw,120px);
  display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;
}
.rg-points li{background:#fff;border:2.5px solid var(--blue);border-radius:22px;padding:24px;box-shadow:0 7px 0 var(--soft);display:grid;gap:6px;align-content:start}
.rg-ico{display:grid;place-items:center;width:52px;height:52px;margin-bottom:10px;border-radius:16px;color:#fff;background:var(--grad);box-shadow:0 4px 0 var(--purple-d)}
.rg-points p{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:20px;line-height:1.25;color:var(--blue)}
.rg-points small{font-size:14px;line-height:1.55;color:var(--muted)}

.rg-subjects{display:flex;flex-wrap:wrap;justify-content:center;gap:12px 26px;margin-top:40px}
.rg-subjects span{display:inline-flex;align-items:center;gap:9px;font-weight:700;font-size:15px;color:var(--blue)}
.rg-subjects i{width:12px;height:12px;border-radius:50%;background:var(--purple);box-shadow:0 0 0 4px #EAD7EC}

@keyframes rg-rot{to{transform:rotate(360deg)}}
@keyframes rg-fill{from{width:0}}

/* ═════════ RESPONSIVE ═════════ */

/* Wide: cards float around the form */
@media(min-width:1240px){
  .rg-stage{display:block}
  .rg-box{margin:0 auto 16px}
  .rg-card{position:absolute;right:calc(50% + 190px);top:50px;width:410px;max-width:none;transform:rotate(-4deg)}
  .rg-goal{position:absolute;left:calc(50% + 215px);top:170px;width:270px;max-width:none;transform:rotate(3deg)}
  .rg-chipf,.rg-atom{display:block}
  .rg-chipf-pi{left:calc(50% - 575px);top:-6px}
  .rg-chipf-e{left:calc(50% - 540px);top:420px}
  .rg-atom{left:calc(50% + 300px);top:-34px}
  .rg-chipf-h2o{left:calc(50% + 430px);top:80px}
  .rg-chipf-int{left:calc(50% + 350px);top:380px}
}

/* Tablets */
@media(max-width:980px){
  .rg-points{grid-template-columns:minmax(0,1fr);max-width:520px;gap:18px}
  .rg-s1,.rg-s3{display:none}
}

/* Small phones: stack level cards */
@media(max-width:520px){
  .rg-levels{grid-template-columns:minmax(0,1fr)}
  .rg-level{flex-direction:row;align-items:center;gap:12px;min-height:54px}
  .rg-level small{margin-left:auto;text-align:right}
}

/* Phones */
@media(max-width:600px){
  .rg-nav{padding:16px 0}
  .rg-nav-btn{min-height:42px;padding:0 18px;font-size:14px}
  .rg-badge{font-size:12px;padding:7px 13px 7px 11px}
  .rg-sub{font-size:15px}
  .rg-stage{gap:36px}
  .rg-box{box-shadow:5px 7px 0 var(--blue),10px 14px 0 var(--purple);margin-bottom:12px;border-radius:24px}
  .rg-head p{font-size:15px}
  .rg-input input{font-size:16px} /* 16px stops iOS zoom on focus */
  .rg-chip{flex:1 1 auto}
  .rg-card{padding:18px 14px 14px;box-shadow:5px 6px 0 var(--blue)}
  .rg-row{grid-template-columns:84px minmax(0,1fr) 38px;gap:8px;padding:8px 6px}
  .rg-s2{display:none}
  .rg-subjects{gap:10px 20px}
}

/* Very small phones */
@media(max-width:400px){
  .rg-nav-btn{display:none}
  .rg-nav{justify-content:center}
  .rg-chip{padding:0 12px;font-size:13px}
  .rg-level small{display:none}
  .rg-link{font-size:14px}
}

@media(hover:none){
  .rg-submit:hover:not(:disabled),.rg-nav-btn:hover{transform:none}
  .rg-chip:hover:not(.on),.rg-level:hover:not(.on){transform:none}
}
@media(prefers-reduced-motion:reduce){
  .rg-root *{animation:none!important;transition:none!important}
}
`;