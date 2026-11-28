'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminError, adminFetch } from '@/lib/admin';

const HEAD = 'font-display';

const FIELD =
  'h-[52px] w-full rounded-[14px] border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_5px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_7px_0_#E3C9E6] motion-reduce:transition-none';

const CTA =
  'inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-[14px] border-[2.5px] border-[#5A2560] bg-grad px-4 text-[15px] font-extrabold text-white shadow-[0_5px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_7px_0_#5A2560] active:translate-y-[4px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none';

const ERROR =
  'flex items-start gap-2.5 rounded-[14px] border-2 border-[#C8202F] bg-[#FFF5F6] px-3.5 py-3 text-[13px] font-semibold leading-[1.45] text-[#C8202F] shadow-[0_4px_0_#F3C3C8]';

const LABEL = 'text-[12.5px] font-extrabold text-[#003366]';

const CAPABILITIES = [
  {
    title: 'Student analytics',
    copy: 'Registrations, practice accuracy and mock submissions.',
    icon: (
      <>
        <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />
      </>
    ),
  },
  {
    title: 'Question bank',
    copy: 'Every subject, topic and question count in one view.',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </>
    ),
  },
  {
    title: 'Mentor accounts',
    copy: 'Create, pause and reset faculty logins.',
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </>
    ),
  },
  {
    title: 'Plans and pricing',
    copy: 'Subscription tiers, features and what is live.',
    icon: (
      <>
        <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
];

function Blob({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 900 700" preserveAspectRatio="xMaxYMax slice" className={`pointer-events-none absolute ${className}`}>
      <defs>
        <linearGradient id="superadmin-login-blob" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A24BA8" stopOpacity="0.42" />
          <stop offset="0.5" stopColor="#803688" stopOpacity="0.26" />
          <stop offset="1" stopColor="#A24BA8" stopOpacity="0.36" />
        </linearGradient>
      </defs>
      <path
        d="M1000 700 L1000 150 C946 92 862 62 772 78 C668 97 596 172 528 246 C462 318 396 378 310 414 C214 455 132 508 84 578 C52 626 30 668 24 700 Z"
        fill="url(#superadmin-login-blob)"
      />
    </svg>
  );
}

function failureMessage(err: unknown): string {
  if (err instanceof AdminError) {
    if (err.status === 401) {
      return 'That email and password do not match. Try again, or ask the platform owner to reset it.';
    }
    if (err.status === 429) {
      return 'Too many sign-in attempts. Wait a minute and try again.';
    }
    if (err.status >= 500) {
      return err.message || 'The console could not be reached right now. Try again in a moment.';
    }
    return err.message;
  }
  return 'Sign in failed. Check your connection and try again.';
}

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 'password') passwordRef.current?.focus();
  }, [step]);

  function handleEmailNext(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('Enter a valid administrator email address.');
      return;
    }
    setEmail(value);
    setError('');
    setStep('password');
  }

  function handleUseAnotherAccount() {
    setStep('email');
    setPassword('');
    setShowPassword(false);
    setError('');
  }

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await adminFetch<{ expiresAt: string }>('/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      });
      setPassword('');
      router.replace('/superadmin');
      router.refresh();
    } catch (err) {
      setError(failureMessage(err));
      setBusy(false);
    }
  }

  const initials = email.trim().slice(0, 2).toUpperCase() || 'SA';

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FBFCFE] bg-page-wash font-dm text-[#003366]">
      <header className="relative z-10 mx-auto flex w-full max-w-[1120px] items-center justify-between gap-3 px-4 py-5 sm:px-6">
        <Link href="/" aria-label="JEENEET.ai home" className="shrink-0 rounded-xl">
          <Image
            src="/logo.png"
            alt="JEENEET.ai"
            width={118}
            height={48}
            priority
            style={{ display: 'block', height: 48, width: 'auto' }}
          />
        </Link>
        <span className="whitespace-nowrap rounded-full border border-[#003366]/10 bg-white px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.09em] text-[#5A6B8C] shadow-[0_2px_0_#E3E9F7]">
          Platform console
        </span>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-[1120px] items-stretch gap-5 px-4 pb-12 pt-2 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-6 lg:pb-16">
        <section className="relative order-2 flex flex-col overflow-hidden rounded-[32px] bg-[#003366] p-7 text-white sm:rounded-[36px] sm:p-10 lg:order-1">
          <Blob className="bottom-[-16%] right-0 h-[66%] w-[min(78%,540px)]" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-white/90">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FDBA74]" aria-hidden />
              Platform console
            </span>
            <h1 className={`${HEAD} mt-5 max-w-[16ch] text-[clamp(28px,3.6vw,44px)] font-extrabold leading-[1.06] tracking-[-0.03em]`}>
              Run the whole exam platform from one desk.
            </h1>
            <p className="mt-3 max-w-[46ch] text-[14.5px] leading-relaxed text-white/75">
              Students, question bank, mentor accounts and subscription plans, with the numbers behind every one of them.
            </p>

            <ul className="mt-7 flex flex-col gap-4">
              {CAPABILITIES.map(({ title, copy, icon }) => (
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
            JEENEET.ai · Restricted to platform administrators
          </p>
        </section>

        <section className="order-1 flex flex-col justify-center rounded-[32px] border border-[#003366]/10 bg-white p-6 shadow-[0_24px_60px_-34px_rgba(0,51,102,.45)] sm:rounded-[36px] sm:p-8 lg:order-2 lg:p-9">
          {step === 'email' ? (
            <>
              <div>
                <h2 className={`${HEAD} text-[clamp(24px,2.4vw,30px)] font-extrabold leading-tight tracking-[-0.02em] text-[#003366]`}>
                  Sign in
                </h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[#5A6B8C]">
                  Use your JEENEET.ai administrator account to open the platform console.
                </p>
              </div>

              {error && (
                <div role="alert" className={`${ERROR} mt-6`}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-0.5 shrink-0">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleEmailNext} className="mt-6 grid gap-4">
                <div className="grid gap-1.5">
                  <label className={LABEL} htmlFor="superadmin-email">
                    Email address
                  </label>
                  <input
                    id="superadmin-email"
                    type="email"
                    className={FIELD}
                    placeholder="admin@jeeneet.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    autoFocus
                    required
                  />
                </div>

                <button type="submit" className={`${CTA} mt-1`}>
                  Next
                </button>
              </form>

              <p className="mt-6 border-t border-[#003366]/10 pt-4 text-[12.5px] leading-relaxed text-[#7A87A0]">
                Trouble signing in? The platform owner can reset the administrator password.
              </p>
            </>
          ) : (
            <>
              <div>
                <button
                  type="button"
                  onClick={handleUseAnotherAccount}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-[10px] border-0 bg-transparent px-0 py-1 text-[12.5px] font-extrabold text-[#5A6B8C] transition-colors duration-150 hover:text-[#003366] motion-reduce:transition-none"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M19 12H5M11 18l-6-6 6-6" />
                  </svg>
                  Use a different account
                </button>

                <div className="mt-4 flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-grad text-[13px] font-extrabold text-white shadow-[0_4px_0_#5A2560]">
                    {initials}
                  </span>
                  <span className="min-w-0 truncate text-[14px] font-bold text-[#003366]">{email}</span>
                </div>

                <h2 className={`${HEAD} mt-5 text-[clamp(24px,2.4vw,30px)] font-extrabold leading-tight tracking-[-0.02em] text-[#003366]`}>
                  Welcome back
                </h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[#5A6B8C]">
                  Enter the administrator password for this account.
                </p>
              </div>

              {error && (
                <div role="alert" className={`${ERROR} mt-6`}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-0.5 shrink-0">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSignIn} className="mt-6 grid gap-4">
                <div className="grid gap-1.5">
                  <label className={LABEL} htmlFor="superadmin-password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="superadmin-password"
                      ref={passwordRef}
                      type={showPassword ? 'text' : 'password'}
                      className={`${FIELD} pr-[76px]`}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-[10px] border-0 bg-transparent px-2.5 py-2 text-[12px] font-extrabold text-[#31407F] transition-colors duration-150 hover:bg-ice motion-reduce:transition-none"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <button type="submit" className={`${CTA} mt-1`} disabled={busy}>
                  {busy ? (
                    <>
                      <span
                        aria-hidden
                        className="h-4 w-4 animate-[spin_.7s_linear_infinite] rounded-full border-[3px] border-white/40 border-t-white motion-reduce:animate-none"
                      />
                      Signing in...
                    </>
                  ) : (
                    'Sign in to the console'
                  )}
                </button>
              </form>

              <p className="mt-6 border-t border-[#003366]/10 pt-4 text-center text-[12.5px] leading-relaxed text-[#7A87A0]">
                Not an administrator?{' '}
                <Link href="/login" className="font-extrabold text-accent underline decoration-2 underline-offset-4">
                  Sign in as a student
                </Link>
              </p>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
