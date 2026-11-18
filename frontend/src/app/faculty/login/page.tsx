'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { facultyGoogleLoginUrl, facultyMe } from '@/lib/faculty';

const HEAD = 'font-display';

const GOOGLE_MARK = (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden className="shrink-0">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 019.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

/* The landing page's blob, reused as the panel's quiet moment */
function Blob({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 900 700" preserveAspectRatio="xMaxYMax slice" className={`pointer-events-none absolute ${className}`}>
      <defs>
        <linearGradient id="faculty-login-blob" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A24BA8" stopOpacity="0.42" />
          <stop offset="0.5" stopColor="#803688" stopOpacity="0.26" />
          <stop offset="1" stopColor="#A24BA8" stopOpacity="0.36" />
        </linearGradient>
      </defs>
      <path
        d="M1000 700 L1000 150 C946 92 862 62 772 78 C668 97 596 172 528 246 C462 318 396 378 310 414 C214 455 132 508 84 578 C52 626 30 668 24 700 Z"
        fill="url(#faculty-login-blob)"
      />
    </svg>
  );
}

const FEATURES = [
  {
    title: 'Exam-pattern presets',
    copy: 'JEE Main, JEE Advanced and NEET layouts, sized to the official question count.',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </>
    ),
  },
  {
    title: 'Verified questions',
    copy: 'Every question is checked before it reaches the paper.',
    icon: (
      <>
        <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    title: 'Export-ready PDFs',
    copy: 'Questions, solutions and answer key, one click each.',
    icon: (
      <>
        <path d="M12 3v12" />
        <path d="M7 10l5 5 5-5" />
        <path d="M5 21h14" />
      </>
    ),
  },
];

export default function FacultyLoginPage() {
  const router = useRouter();
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState('');

  // Someone already signed in has no business here; send them to the studio.
  useEffect(() => {
    let active = true;
    facultyMe()
      .then(() => { if (active) router.replace('/faculty'); })
      .catch(() => undefined);
    return () => { active = false; };
  }, [router]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error');
    if (!oauthError) return;
    setError(oauthError);
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

  function handleGoogleSignIn() {
    setGoogleBusy(true);
    setError('');
    window.location.assign(facultyGoogleLoginUrl('/faculty'));
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FBFCFE] bg-page-wash font-dm text-[#003366]">
      <header className="relative z-10 mx-auto flex w-full max-w-[1120px] items-center justify-between gap-3 px-4 py-5 sm:px-6">
        <Link href="/" aria-label="JEENEET.ai home" className="shrink-0 rounded-xl">
          <Image
            src="/logo.png" alt="JEENEET.ai" width={118} height={48} priority
            style={{ display: 'block', height: 48, width: 'auto' }}
          />
        </Link>
        <span className="whitespace-nowrap rounded-full border border-[#003366]/10 bg-white px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.09em] text-[#5A6B8C] shadow-[0_2px_0_#E3E9F7]">
          Faculty portal
        </span>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-[1120px] items-stretch gap-5 px-4 pb-12 pt-2 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:pb-16">

        {/* Brand panel */}
        <section className="relative order-2 flex flex-col overflow-hidden rounded-[32px] bg-[#003366] p-7 text-white sm:rounded-[36px] sm:p-10 lg:order-1">
          <Blob className="bottom-[-16%] right-0 h-[66%] w-[min(78%,540px)]" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-white/90">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FDBA74]" aria-hidden />
              Paper studio
            </span>
            <h1 className={`${HEAD} mt-5 max-w-[15ch] text-[clamp(28px,3.6vw,44px)] font-extrabold leading-[1.06] tracking-[-0.03em]`}>
              Build a verified exam paper in minutes.
            </h1>
            <p className="mt-3 max-w-[46ch] text-[14.5px] leading-relaxed text-white/75">
              Pick the pattern, choose the topics, and generate a paper with solutions and an answer key ready to print.
            </p>

            <ul className="mt-7 flex flex-col gap-4">
              {FEATURES.map(({ title, copy, icon }) => (
                <li key={title} className="flex items-start gap-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/10 text-white">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      {icon}
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-extrabold leading-snug text-white">{title}</p>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-white/65">{copy}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <p className="relative mt-8 hidden text-[11.5px] font-semibold text-white/40 sm:block">
            JEENEET.ai · Faculty workspace
          </p>
        </section>

        {/* Sign-in card */}
        <section className="order-1 flex flex-col justify-center rounded-[32px] border border-[#003366]/10 bg-white p-6 shadow-[0_24px_60px_-34px_rgba(0,51,102,.45)] sm:rounded-[36px] sm:p-8 lg:order-2 lg:p-9">
          <div>
            <h2 className={`${HEAD} text-[clamp(24px,2.4vw,30px)] font-extrabold leading-tight tracking-[-0.02em] text-[#003366]`}>
              Sign in to the studio
            </h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[#5A6B8C]">
              The faculty portal uses your Google account. No password to remember, no approval queue.
            </p>
          </div>

          <div className="mt-7 grid gap-4">
            {error && (
              <div role="alert" className="flex items-start gap-2.5 rounded-2xl border border-[#C8202F]/25 bg-[#FDF3F4] px-4 py-3 text-[13px] font-semibold leading-relaxed text-[#C8202F]">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-0.5 shrink-0">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleBusy}
              className="inline-flex h-[58px] w-full items-center justify-center gap-3 rounded-2xl border-[2.5px] border-[#003366] bg-white text-[15px] font-extrabold text-[#003366] shadow-[0_6px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_8px_0_#C6D2F8] active:translate-y-[4px] active:shadow-[0_2px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none"
            >
              {googleBusy ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#003366]/25 border-t-[#003366] motion-reduce:animate-none" aria-hidden />
                  Redirecting to Google...
                </>
              ) : (
                <>
                  {GOOGLE_MARK}
                  Continue with Google
                </>
              )}
            </button>

            <ul className="mt-1 grid gap-2.5">
              {[
                'Your faculty account is created on the first sign-in',
                'Your Google profile photo and name carry over',
                'Sign out any time — no password to manage',
              ].map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-[12.5px] font-semibold leading-relaxed text-[#5A6B8C]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-[3px] shrink-0 text-[#803688]">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 text-[12.5px] leading-relaxed text-[#7A87A0]">
            Trouble signing in? Your program administrator can reactivate your faculty account.
          </p>
        </section>
      </main>
    </div>
  );
}
