'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { setSession, isAuthenticated } from '@/lib/auth';

const OPTIONS = [
  { k: 'A', v: '10 m' },
  { k: 'B', v: '20 m' },
  { k: 'C', v: '30 m' },
  { k: 'D', v: '40 m' },
];
const CORRECT = 'B';

const Sparkle = ({ className }: { className: string }) => (
  <svg className={`sn-spark ${className}`} viewBox="0 0 24 24" aria-hidden>
    <path d="M12 0C12 7 17 12 24 12C17 12 12 17 12 24C12 17 7 12 0 12C7 12 12 7 12 0Z" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

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
      const { user, expiresAt } = await api.auth.login(form);
      setSession(user, expiresAt);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  const feedback =
    picked === null
      ? 'Tap an option to answer.'
      : picked === CORRECT
        ? 'Correct! v² = 2gh gives h = 20 m.'
        : 'Not quite. Use v² = 2gh with v = 20 m/s.';

  return (
    <div className="sn-root">
      <style>{css}</style>

      {/* blob backgrounds, same family as the landing page */}
      <div className="sn-blob sn-blob-a" aria-hidden />
      <div className="sn-blob sn-blob-b" aria-hidden />
      <div className="sn-blob sn-blob-c" aria-hidden />
      <div className="sn-blob sn-blob-d" aria-hidden />
      <Sparkle className="sn-s1" />
      <Sparkle className="sn-s2" />
      <Sparkle className="sn-s3" />

      <div className="sn-page">
        {/* ── Nav ── */}
        <nav className="sn-nav">
          <Link href="/" className="sn-logo">
            <Image src="/logo.png" alt="JEENEET.ai" width={150} height={62} className="site-logo" priority />
          </Link>
          <Link href="/register" className="sn-nav-btn">Create a free account</Link>
        </nav>

        {/* ── Hero text ── */}
        <header className="sn-hero">
          <p className="sn-badge">
            <i aria-hidden />
            Deep Tech-powered JEE &amp; NEET preparation
          </p>
          <h2 className="sn-tagline">
            <span className="sn-t1">Stop guessing.</span>
            <span className="sn-t2">Start knowing.</span>
          </h2>
          <p className="sn-sub">
            Every session brings questions for your chosen topics, tracks your weak spots,
            and builds your mastery across Physics, Chemistry and Mathematics.
          </p>
        </header>

        {/* ── Stage: form in the middle, cards floating around it ── */}
        <section className="sn-stage">
          <main className="sn-box">
            <header className="sn-head">
              <h1>Welcome back</h1>
              <p>Sign in to continue your preparation</p>
            </header>

            <form onSubmit={handleSubmit} className="sn-form">
              <div className="sn-field">
                <label htmlFor="email">Email</label>
                <div className="sn-input">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    id="email"
                    type="email"
                    className={error ? 'sn-err' : ''}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="sn-field">
                <label htmlFor="password">Password</label>
                <div className="sn-input">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <input
                    id="password"
                    type={showPwd ? 'text' : 'password'}
                    className={error ? 'sn-err' : ''}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => set('password', e.target.value)}
                    autoComplete="current-password"
                    required
                    style={{ paddingRight: 52 }}
                  />
                  <button
                    type="button"
                    className="sn-eye"
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
              </div>

              {error && <p className="sn-error" role="alert">{error}</p>}

              <button type="submit" className="sn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="sn-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <p className="sn-link">
              New to JEENEET.ai? <Link href="/register">Create a free account</Link>
            </p>
          </main>

          {/* Question card */}
          <div className="sn-card">
            <div className="sn-card-top">
              <span className="sn-subject">Physics</span>
              <span className="sn-topic">Kinematics</span>
              <span className="sn-diff">Medium</span>
            </div>
            <p className="sn-q">
              A ball is thrown vertically upward at 20 m/s. Find the maximum height. (g = 10 m/s²)
            </p>
            <div className="sn-opts" role="group" aria-label="Answer options">
              {OPTIONS.map(({ k, v }) => {
                const cls = [
                  'sn-opt',
                  picked === k ? (k === CORRECT ? 'is-right' : 'is-wrong') : '',
                  picked !== null && picked !== k && k === CORRECT ? 'reveal' : '',
                ].join(' ');
                return (
                  <button
                    key={k}
                    type="button"
                    className={cls}
                    aria-pressed={picked === k}
                    onClick={() => setPicked(k)}
                  >
                    <span className="sn-bub">{k}</span>
                    <span>{v}</span>
                    {picked === k && k === CORRECT && (
                      <svg className="sn-tick" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="sn-feedback" aria-live="polite">{feedback}</p>
          </div>

          {/* Weak area */}
          <div className="sn-flag">
            <small>Weak area spotted</small>
            <strong>Thermodynamics</strong>
            <div className="sn-meter" title="Topics below 60% are flagged">
              <i />
              <b />
            </div>
            <span>54%, needs work</span>
          </div>

          {/* floating science chips (wide screens only) */}
          <span className="sn-chip sn-chip-pi" aria-hidden>π</span>
          <span className="sn-chip sn-chip-e" aria-hidden>E = mc²</span>
          <span className="sn-chip sn-chip-h2o" aria-hidden>H<sub>2</sub>O</span>
          <span className="sn-chip sn-chip-int" aria-hidden>∫x dx</span>
          <svg className="sn-atom" viewBox="0 0 120 120" fill="none" aria-hidden>
            <ellipse cx="60" cy="60" rx="52" ry="19" />
            <ellipse cx="60" cy="60" rx="52" ry="19" transform="rotate(60 60 60)" />
            <ellipse cx="60" cy="60" rx="52" ry="19" transform="rotate(120 60 60)" />
            <circle cx="60" cy="60" r="8" className="sn-nucleus" />
          </svg>
        </section>

        {/* ── Points ── */}
        <ul className="sn-points">
          <li>
            <span className="sn-ico">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 01-15.5 6.2L3 16" />
                <path d="M3 12A9 9 0 0118.5 5.8L21 8" />
                <path d="M21 3v5h-5M3 21v-5h5" />
              </svg>
            </span>
            <p>Fresh questions every time</p>
            <small>Questions are served from the bank or generated for your topics</small>
          </li>
          <li>
            <span className="sn-ico">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="12" cy="12" r="0.8" fill="currentColor" />
              </svg>
            </span>
            <p>Automatic weak area detection</p>
            <small>Topics below 60% accuracy are flagged instantly</small>
          </li>
          <li>
            <span className="sn-ico">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />
              </svg>
            </span>
            <p>Real progress tracking</p>
            <small>Subject mastery rings and weekly activity charts</small>
          </li>
        </ul>

        <div className="sn-subjects">
          <span><i />Physics</span>
          <span><i />Chemistry</span>
          <span><i />Mathematics</span>
        </div>
      </div>
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700;800&display=swap');

.sn-root{
  --blue:#003366; --blue-d:#00284F; --ink:#003366; --muted:#3C4A8A;
  --purple:#803688; --purple-d:#5A2560; --purple-2:#A24BA8;
  --grad:linear-gradient(135deg,#803688 0%,#A24BA8 100%);
  --ice:#EEF2FF; --soft:#C6D2F8; --blob:#EDE3EF; --err:#C0283A;
  position:relative; min-height:100vh; min-height:100dvh;
  overflow:hidden; overflow:clip; background:#fff;
  font-family:'DM Sans',system-ui,sans-serif; color:var(--ink);
  -webkit-text-size-adjust:100%;
}
.sn-root *{box-sizing:border-box}
.sn-root h1,.sn-root h2,.sn-root p,.sn-root ul{margin:0;padding:0}
.sn-root button{font-family:inherit}
.sn-root :focus-visible{outline:3px solid var(--purple);outline-offset:3px}

/* ── Blob backgrounds ── */
.sn-blob{position:absolute;z-index:0;pointer-events:none}
.sn-blob-a{width:min(80vw,1150px);aspect-ratio:1.1;right:-24vw;bottom:-16vw;background:var(--blob);border-radius:58% 42% 47% 53% / 52% 61% 39% 48%}
.sn-blob-b{width:min(46vw,660px);aspect-ratio:1;left:-14vw;top:-13vw;background:#EEF1FB;border-radius:46% 54% 60% 40% / 52% 44% 56% 48%}
.sn-blob-c{width:min(30vw,420px);aspect-ratio:1;left:-6vw;bottom:8vh;background:#F3EAF5;border-radius:55% 45% 38% 62% / 48% 57% 43% 52%}
.sn-blob-d{width:min(18vw,260px);aspect-ratio:1;right:5vw;top:13vh;background:#F0F3FF;border-radius:62% 38% 50% 50% / 44% 56% 44% 56%}

.sn-spark{position:absolute;z-index:1;pointer-events:none;fill:var(--blue)}
.sn-s1{width:30px;top:21%;left:5%}
.sn-s2{width:22px;top:46%;right:6%;fill:var(--purple)}
.sn-s3{width:26px;bottom:20%;left:9%;fill:var(--purple)}

.sn-page{
  position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;
  width:100%;max-width:1320px;margin:0 auto;padding:0 clamp(16px,4vw,56px) clamp(56px,8vw,110px);
}

/* ── Nav ── */
.sn-nav{width:100%;display:flex;align-items:center;justify-content:space-between;padding:22px 0}
.sn-logo{display:inline-flex;align-items:center}
.sn-logo .site-logo{width:auto;height:70px;max-width:100%}
@media(max-width:720px){.sn-logo .site-logo{height:56px}}
@media(max-width:520px){.sn-logo .site-logo{height:48px}}
.sn-nav-btn{
  display:inline-flex;align-items:center;min-height:46px;padding:0 22px;border-radius:14px;
  font-weight:800;font-size:15px;color:#fff;text-decoration:none;background:var(--grad);
  box-shadow:0 5px 0 var(--purple-d);transition:transform .15s,box-shadow .15s;
}
.sn-nav-btn:hover{transform:translateY(-2px);box-shadow:0 7px 0 var(--purple-d)}
.sn-nav-btn:active{transform:translateY(4px);box-shadow:0 1px 0 var(--purple-d)}

/* ── Hero text ── */
.sn-hero{display:flex;flex-direction:column;align-items:center;text-align:center;gap:clamp(14px,2.2vh,22px);margin-top:clamp(4px,2vh,24px);max-width:1100px}
.sn-badge{display:inline-flex;align-items:center;gap:9px;padding:8px 16px 8px 13px;border-radius:99px;
  background:var(--ice);border:1.5px solid #B9C4EE;font-size:13px;font-weight:700;color:var(--blue)}
.sn-badge i{width:9px;height:9px;border-radius:50%;background:var(--purple);box-shadow:0 0 0 3px rgba(128,54,136,.22)}
.sn-tagline{
  display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:.06em .28em;
  font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;
  font-size:clamp(36px,6.5vw,84px);line-height:1.04;letter-spacing:-.035em;
}
.sn-t1{color:var(--blue)}
.sn-t2{
  display:inline-block;color:#fff;background:var(--grad);padding:.02em .2em .09em;border-radius:.22em;
  box-shadow:0 .07em 0 var(--purple-d);transform:rotate(-1.5deg);
}
.sn-sub{max-width:560px;font-size:clamp(15px,1.3vw,17px);line-height:1.65;color:var(--blue);opacity:.88}

/* ── Stage ── */
.sn-stage{position:relative;width:100%;margin-top:clamp(36px,5vh,56px);display:flex;flex-direction:column;align-items:center;gap:44px}

.sn-box{
  position:relative;z-index:3;width:100%;max-width:450px;background:#fff;border:2.5px solid var(--blue);
  border-radius:28px;padding:clamp(24px,3.4vw,40px);
  box-shadow:8px 10px 0 var(--blue),16px 20px 0 var(--purple);
  margin-bottom:16px;
}
.sn-head{margin-bottom:26px}
.sn-head h1{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:clamp(30px,3vw,40px);line-height:1.08;letter-spacing:-.02em;color:var(--blue)}
.sn-head p{margin-top:10px;color:var(--muted);font-size:16px}

.sn-form{display:grid;gap:18px}
.sn-field label{display:block;font-weight:800;font-size:13px;margin-bottom:8px;color:var(--blue)}
.sn-input{position:relative}
.sn-input>svg{position:absolute;left:15px;top:50%;transform:translateY(-50%);color:var(--blue);opacity:.7;pointer-events:none}
.sn-input input{
  width:100%;height:54px;padding:0 16px 0 44px;font:inherit;font-weight:600;font-size:15px;color:var(--ink);
  background:#fff;border:2.5px solid var(--blue);border-radius:14px;outline:none;
  box-shadow:0 5px 0 var(--soft);transition:transform .12s,box-shadow .12s,border-color .12s;
  -webkit-appearance:none;appearance:none;
}
.sn-input input::placeholder{color:#97A3D4;font-weight:500}
.sn-input input:focus{border-color:var(--purple);transform:translateY(-2px);box-shadow:0 7px 0 #E3C9E6}
.sn-input input.sn-err{border-color:var(--err)}
.sn-eye{position:absolute;right:6px;top:50%;transform:translateY(-50%);width:44px;height:44px;display:grid;place-items:center;background:none;border:0;border-radius:10px;color:var(--blue);cursor:pointer}
.sn-eye:hover{background:var(--ice)}
.sn-error{background:#FDE6E8;color:var(--err);border-left:5px solid var(--err);border-radius:10px;padding:12px 14px;font-weight:700;font-size:14px;overflow-wrap:anywhere}

.sn-submit{
  display:inline-flex;align-items:center;justify-content:center;gap:10px;margin-top:6px;min-height:58px;width:100%;
  font-weight:800;font-size:17px;color:#fff;background:var(--grad);border:0;border-radius:16px;cursor:pointer;
  box-shadow:0 7px 0 var(--purple-d);transition:transform .15s,box-shadow .15s;-webkit-tap-highlight-color:transparent;
}
.sn-submit:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 10px 0 var(--purple-d)}
.sn-submit:active:not(:disabled){transform:translateY(5px);box-shadow:0 2px 0 var(--purple-d)}
.sn-submit:disabled{opacity:.75;cursor:not-allowed}
.sn-spin{width:18px;height:18px;border-radius:50%;border:3px solid rgba(255,255,255,.4);border-top-color:#fff;animation:sn-rot .7s linear infinite}
.sn-box .sn-link{margin-top:22px;text-align:center;font-size:15px;line-height:1.6;color:var(--muted);font-weight:500}
.sn-link a{color:var(--purple);font-weight:800;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:4px;white-space:nowrap}

/* Question card */
.sn-card{
  position:relative;z-index:2;width:100%;max-width:440px;background:#fff;border:2.5px solid var(--blue);
  border-radius:24px;padding:20px 20px 16px;box-shadow:6px 8px 0 var(--blue);transform:rotate(-1.5deg);
}
.sn-card-top{display:flex;align-items:center;gap:8px;margin-bottom:12px;font-size:12.5px;font-weight:700}
.sn-subject{background:var(--ice);color:var(--blue);border:1.5px solid #B9C4EE;border-radius:99px;padding:3px 11px}
.sn-topic{color:var(--muted)}
.sn-diff{margin-left:auto;background:#F3E5F5;color:var(--purple);border-radius:99px;padding:3px 11px}
.sn-q{font-weight:700;font-size:15px;line-height:1.55;margin-bottom:14px}
.sn-opts{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.sn-opt{
  position:relative;display:flex;align-items:center;gap:10px;min-height:48px;padding:8px 12px;text-align:left;cursor:pointer;
  border:1.5px solid #CBD5F3;border-radius:12px;background:#fff;color:var(--ink);font-weight:700;font-size:14px;
  transition:border-color .15s,background .15s,color .15s;
}
.sn-opt:hover{border-color:var(--blue)}
.sn-bub{flex:none;display:grid;place-items:center;width:26px;height:26px;border-radius:8px;background:var(--ice);color:var(--blue);font-size:12px;font-weight:800;transition:background .15s,color .15s}
.sn-tick{margin-left:auto}
.sn-opt.is-right{background:var(--blue);border-color:var(--blue);color:#fff}
.sn-opt.is-right .sn-bub{background:#fff;color:var(--blue)}
.sn-opt.is-wrong{background:#F3E5F5;border-color:var(--purple)}
.sn-opt.is-wrong .sn-bub{background:var(--purple);color:#fff}
.sn-opt.reveal{border-color:var(--blue);border-style:dashed}
.sn-feedback{margin-top:12px;padding:10px 12px;border-radius:12px;background:var(--ice);font-size:13px;font-weight:700;color:var(--blue)}

/* Weak area */
.sn-flag{
  position:relative;z-index:2;width:100%;max-width:300px;display:flex;flex-direction:column;gap:4px;
  background:#fff;border:2.5px solid var(--purple);border-radius:20px;padding:16px 18px;
  box-shadow:5px 7px 0 var(--purple-d);transform:rotate(1.5deg);
}
.sn-flag small{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--purple)}
.sn-flag strong{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:19px;font-weight:800;color:var(--blue)}
.sn-meter{position:relative;height:9px;margin:7px 0 4px;border-radius:99px;background:#E6E0EE}
.sn-meter i{display:block;height:100%;width:54%;border-radius:99px;background:var(--grad);animation:sn-fill 1.1s .35s cubic-bezier(.2,.8,.2,1) both}
.sn-meter b{position:absolute;left:60%;top:-4px;bottom:-4px;width:2px;border-radius:2px;background:var(--blue)}
.sn-flag span{font-size:13px;font-weight:700;color:var(--muted)}

/* Floating chips + atom: wide screens only */
.sn-chip,.sn-atom{display:none}
.sn-chip{position:absolute;z-index:1;font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:19px;border-radius:14px;padding:11px 17px;line-height:1}
.sn-chip-pi{background:var(--grad);color:#fff;box-shadow:0 5px 0 var(--purple-d);transform:rotate(-8deg)}
.sn-chip-h2o{background:var(--grad);color:#fff;box-shadow:0 5px 0 var(--purple-d);transform:rotate(6deg)}
.sn-chip-e{background:#fff;color:var(--blue);border:2px solid var(--blue);box-shadow:0 5px 0 var(--soft);transform:rotate(-5deg)}
.sn-chip-int{background:#fff;color:var(--blue);border:2px solid var(--blue);box-shadow:0 5px 0 var(--soft);transform:rotate(5deg)}
.sn-atom{position:absolute;z-index:1;width:112px;height:112px;stroke:var(--blue);stroke-width:4;stroke-linecap:round}
.sn-nucleus{fill:var(--purple);stroke:none}

/* Points */
.sn-points{
  list-style:none;width:100%;max-width:1060px;margin-top:clamp(64px,9vw,120px);
  display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;
}
.sn-points li{background:#fff;border:2.5px solid var(--blue);border-radius:22px;padding:24px;box-shadow:0 7px 0 var(--soft);display:grid;gap:6px;align-content:start}
.sn-ico{display:grid;place-items:center;width:52px;height:52px;margin-bottom:10px;border-radius:16px;color:#fff;background:var(--grad);box-shadow:0 4px 0 var(--purple-d)}
.sn-points p{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:20px;line-height:1.25;color:var(--blue)}
.sn-points small{font-size:14px;line-height:1.55;color:var(--muted)}

.sn-subjects{display:flex;flex-wrap:wrap;justify-content:center;gap:12px 26px;margin-top:40px}
.sn-subjects span{display:inline-flex;align-items:center;gap:9px;font-weight:700;font-size:15px;color:var(--blue)}
.sn-subjects i{width:12px;height:12px;border-radius:50%;background:var(--purple);box-shadow:0 0 0 4px #EAD7EC}

@keyframes sn-rot{to{transform:rotate(360deg)}}
@keyframes sn-fill{from{width:0}}

/* ═════════ RESPONSIVE ═════════ */

/* Wide: cards float around the form */
@media(min-width:1240px){
  .sn-stage{display:block;height:560px}
  .sn-box{position:absolute;left:50%;top:0;transform:translateX(-50%);margin:0}
  .sn-card{position:absolute;right:calc(50% + 150px);top:50px;width:410px;max-width:none;transform:rotate(-4deg)}
  .sn-flag{position:absolute;left:calc(50% + 175px);top:210px;width:290px;max-width:none;transform:rotate(3deg)}
  .sn-chip,.sn-atom{display:block}
  .sn-chip-pi{left:calc(50% - 560px);top:-6px}
  .sn-chip-e{left:calc(50% - 520px);top:360px}
  .sn-atom{left:calc(50% + 270px);top:-34px}
  .sn-chip-h2o{left:calc(50% + 400px);top:130px}
  .sn-chip-int{left:calc(50% + 330px);top:400px}
}

/* Tablets */
@media(max-width:980px){
  .sn-points{grid-template-columns:minmax(0,1fr);max-width:520px;gap:18px}
  .sn-s1,.sn-s3{display:none}
}

/* Phones */
@media(max-width:600px){
  .sn-nav{padding:16px 0}
  .sn-nav-btn{min-height:42px;padding:0 16px;font-size:14px}
  .sn-badge{font-size:12px;padding:7px 13px 7px 11px}
  .sn-sub{font-size:15px}
  .sn-stage{gap:36px}
  .sn-box{box-shadow:5px 7px 0 var(--blue),10px 14px 0 var(--purple);margin-bottom:12px;border-radius:24px}
  .sn-head p{font-size:15px}
  .sn-input input{font-size:16px} /* 16px stops iOS zoom on focus */
  .sn-opts{gap:8px}
  .sn-card{padding:18px 16px 14px;box-shadow:5px 6px 0 var(--blue)}
  .sn-s2{display:none}
  .sn-subjects{gap:10px 20px}
}

/* Very small phones */
@media(max-width:400px){
  .sn-nav-btn{display:none}
  .sn-nav{justify-content:center}
  .sn-opt{padding:8px 9px;gap:8px;font-size:13px}
  .sn-link{font-size:14px}
}

@media(hover:none){
  .sn-submit:hover:not(:disabled),.sn-nav-btn:hover{transform:none}
}
@media(prefers-reduced-motion:reduce){
  .sn-root *{animation:none!important;transition:none!important}
}
`;