'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { setSession } from '@/lib/auth';

const Sparkle = ({ className }: { className: string }) => (
  <svg className={`ag-spark ${className}`} viewBox="0 0 24 24" aria-hidden>
    <path d="M12 0C12 7 17 12 24 12C17 12 12 17 12 24C12 17 7 12 0 12C7 12 12 7 12 0Z" />
  </svg>
);

export default function GoogleSignInCompletePage() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    api.auth
      .session()
      .then(({ user, expiresAt }) => {
        if (!active) return;
        setSession(user, expiresAt);
        router.replace(user.isOnboarded ? '/dashboard' : '/onboarding');
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Google sign-in could not be completed.');
      });

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <div className="ag-root">
      <style>{css}</style>

      <div className="ag-blob ag-blob-a" aria-hidden />
      <div className="ag-blob ag-blob-b" aria-hidden />
      <div className="ag-blob ag-blob-c" aria-hidden />
      <div className="ag-blob ag-blob-d" aria-hidden />
      <Sparkle className="ag-s1" />
      <Sparkle className="ag-s2" />
      <Sparkle className="ag-s3" />

      <div className="ag-page">
        <nav className="ag-nav">
          <Link href="/" className="ag-logo" aria-label="JEENEET.ai home">
            <Image src="/logo.png" alt="JEENEET.ai" width={150} height={62} className="site-logo" priority />
          </Link>
        </nav>

        <main className="ag-box">
          {error ? (
            <>
              <span className="ag-badge ag-badge-error">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                Sign-in failed
              </span>
              <h1>We could not finish your sign-in</h1>
              <p className="ag-sub">{error}</p>
              <Link href="/login" className="ag-btn">Back to sign in</Link>
            </>
          ) : (
            <>
              <span className="ag-badge">
                <span className="ag-dot" aria-hidden />
                Google sign-in
              </span>
              <h1>Signing you in…</h1>
              <p className="ag-sub">Fetching your Google profile and opening your dashboard.</p>

              <div className="ag-steps">
                <span className="ag-step is-done">
                  <i aria-hidden />
                  Google verified
                </span>
                <span className="ag-step">
                  <i aria-hidden />
                  Loading your profile
                </span>
                <span className="ag-step">
                  <i aria-hidden />
                  Opening the studio
                </span>
              </div>

              <span className="ag-spinner" aria-hidden />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700;800&display=swap');

.ag-root{
  --blue:#003366; --blue-d:#00284F; --ink:#003366; --muted:#3C4A8A;
  --purple:#803688; --purple-d:#5A2560; --purple-2:#A24BA8;
  --grad:linear-gradient(135deg,#803688 0%,#A24BA8 100%);
  --ice:#EEF2FF; --soft:#C6D2F8; --blob:#EDE3EF; --err:#C0283A;
  position:relative;min-height:100vh;min-height:100dvh;
  overflow:hidden;overflow:clip;background:#fff;
  font-family:'DM Sans',system-ui,sans-serif;color:var(--ink);
  -webkit-text-size-adjust:100%;
}
.ag-root *{box-sizing:border-box}
.ag-root h1,.ag-root p{margin:0;padding:0}
.ag-root :focus-visible{outline:3px solid var(--purple);outline-offset:3px}

.ag-blob{position:absolute;z-index:0;pointer-events:none}
.ag-blob-a{width:min(80vw,1150px);aspect-ratio:1.1;right:-24vw;bottom:-16vw;background:var(--blob);border-radius:58% 42% 47% 53% / 52% 61% 39% 48%}
.ag-blob-b{width:min(46vw,660px);aspect-ratio:1;left:-14vw;top:-13vw;background:#EEF1FB;border-radius:46% 54% 60% 40% / 52% 44% 56% 48%}
.ag-blob-c{width:min(30vw,420px);aspect-ratio:1;left:-6vw;bottom:8vh;background:#F3EAF5;border-radius:55% 45% 38% 62% / 48% 57% 43% 52%}
.ag-blob-d{width:min(18vw,260px);aspect-ratio:1;right:5vw;top:13vh;background:#F0F3FF;border-radius:62% 38% 50% 50% / 44% 56% 44% 56%}

.ag-spark{position:absolute;z-index:1;pointer-events:none;fill:var(--blue)}
.ag-s1{width:30px;top:21%;left:5%}
.ag-s2{width:22px;top:46%;right:6%;fill:var(--purple)}
.ag-s3{width:26px;bottom:20%;left:9%;fill:var(--purple)}

.ag-page{
  position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;
  width:100%;max-width:1320px;margin:0 auto;padding:0 clamp(16px,4vw,56px) clamp(56px,8vw,110px);
}

.ag-nav{width:100%;display:flex;align-items:center;justify-content:space-between;padding:12px 0}
.ag-logo{display:inline-flex;align-items:center}
.ag-logo .site-logo{width:auto;height:70px;max-width:100%}
@media(max-width:720px){.ag-logo .site-logo{height:56px}}

.ag-box{
  position:relative;z-index:3;width:100%;max-width:520px;margin-top:clamp(20px,3vh,32px);
  background:#fff;border:2.5px solid var(--blue);border-radius:28px;padding:clamp(26px,3.6vw,42px);
  box-shadow:8px 10px 0 var(--blue),16px 20px 0 var(--purple);
}

.ag-badge{
  display:inline-flex;align-items:center;gap:9px;margin:0 0 14px;padding:6px 14px;border-radius:99px;
  background:var(--ice);border:1.5px solid #B9C4EE;font-size:11.5px;font-weight:800;
  letter-spacing:.06em;text-transform:uppercase;color:var(--blue);white-space:nowrap;
}
.ag-badge-error{background:#FDE6E8;border-color:#F3B9BF;color:var(--err)}
.ag-dot{width:9px;height:9px;border-radius:50%;background:var(--purple);box-shadow:0 0 0 3px rgba(128,54,136,.22)}

.ag-box h1{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:clamp(26px,3.2vw,34px);line-height:1.1;letter-spacing:-.02em;color:var(--blue)}
.ag-sub{margin-top:10px;color:var(--muted);font-size:15px;line-height:1.6}

.ag-steps{display:grid;gap:10px;margin:24px 0 4px}
.ag-step{
  display:flex;align-items:center;gap:11px;font-size:13.5px;font-weight:700;color:var(--muted);
}
.ag-step i{width:16px;height:16px;border-radius:50%;border:2.5px solid var(--soft);background:#fff;flex-shrink:0}
.ag-step.is-done{color:var(--blue)}
.ag-step.is-done i{border-color:var(--blue);background:var(--blue);box-shadow:inset 0 0 0 3px #fff}

.ag-spinner{
  display:block;width:26px;height:26px;margin-top:26px;border-radius:50%;
  border:3px solid var(--soft);border-top-color:var(--purple);animation:ag-rot .75s linear infinite;
}

.ag-btn{
  display:inline-flex;align-items:center;justify-content:center;min-height:52px;margin-top:24px;padding:0 28px;
  border-radius:16px;font-weight:800;font-size:16px;color:#fff;background:var(--grad);text-decoration:none;
  border:0;box-shadow:0 6px 0 var(--purple-d);transition:transform .15s,box-shadow .15s;
}
.ag-btn:hover{transform:translateY(-3px);box-shadow:0 9px 0 var(--purple-d)}
.ag-btn:active{transform:translateY(4px);box-shadow:0 2px 0 var(--purple-d)}

@keyframes ag-rot{to{transform:rotate(360deg)}}

@media(max-width:980px){.ag-s1,.ag-s3{display:none}}
@media(max-width:600px){
  .ag-nav{padding:16px 0}
  .ag-box{box-shadow:5px 7px 0 var(--blue),10px 14px 0 var(--purple);border-radius:24px}
  .ag-sub{font-size:14px}
}
@media(max-width:400px){.ag-nav{justify-content:center}}
@media(hover:none){.ag-btn:hover{transform:none}}
@media(prefers-reduced-motion:reduce){
  .ag-root *{animation:none!important;transition:none!important}
}
`;
