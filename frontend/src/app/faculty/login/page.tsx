'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { facultyLogin, facultyMe } from '@/lib/faculty';

const HEAD = 'font-display';
const FIELD = 'h-[54px] w-full rounded-2xl border-[2.5px] border-[#003366] bg-white text-[15px] font-semibold text-[#003366] shadow-[0_5px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-[#803688] focus:shadow-[0_7px_0_#E3C9E6] motion-reduce:transition-none';
const FOCUS_RING = 'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#803688] focus-visible:outline-offset-2';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Someone already signed in has no business here; send them to the studio.
  useEffect(() => {
    let active = true;
    facultyMe()
      .then(() => { if (active) router.replace('/faculty'); })
      .catch(() => undefined);
    return () => { active = false; };
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await facultyLogin(email, password);
      router.replace('/faculty');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed');
      setBusy(false);
    }
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
              Use the mentor credentials issued by your program administrator.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 grid gap-4" noValidate>
            {error && (
              <div role="alert" className="flex items-start gap-2.5 rounded-2xl border border-[#C8202F]/25 bg-[#FDF3F4] px-4 py-3 text-[13px] font-semibold leading-relaxed text-[#C8202F]">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-0.5 shrink-0">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="faculty-email" className="mb-2 block text-[12.5px] font-extrabold text-[#003366]">
                Faculty email
              </label>
              <div className="relative">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#003366]/60">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  id="faculty-email"
                  type="email"
                  className={`${FIELD} pl-11 pr-4`}
                  placeholder="you@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="faculty-password" className="mb-2 block text-[12.5px] font-extrabold text-[#003366]">
                Password
              </label>
              <div className="relative">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#003366]/60">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  id="faculty-password"
                  type={showPwd ? 'text' : 'password'}
                  className={`${FIELD} pl-11 pr-14`}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                  aria-pressed={showPwd}
                  className={`absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-xl text-[#003366] transition-colors duration-150 hover:bg-[#EEF2FF] ${FOCUS_RING}`}
                >
                  {showPwd ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-1 inline-flex h-[56px] w-full items-center justify-center gap-2.5 rounded-2xl bg-grad px-5 text-[15px] font-extrabold text-white shadow-[0_6px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_8px_0_#5A2560] active:translate-y-[4px] active:shadow-[0_2px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none"
            >
              {busy ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" aria-hidden />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="mt-6 text-[12.5px] leading-relaxed text-[#7A87A0]">
            No account yet? Faculty access is created by your program administrator.
          </p>
        </section>
      </main>
    </div>
  );
}
