'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { studentLogin, studentMe } from '@/lib/facultyStudent';
import Loader from '@/components/loader';
import {
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  CHIP_READY,
  CHIP_SUBJECT,
  ERROR_BANNER,
  FOCUS_RING,
  INPUT,
  LABEL,
  cx,
} from '@/components/student-portal/ui';

const Sparkle = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={cx('pointer-events-none absolute z-0 fill-current', className)}>
    <path d="M12 0C12 7 17 12 24 12C17 12 12 17 12 24C12 17 7 12 0 12C7 12 12 7 12 0Z" />
  </svg>
);

const SIDE_CARD = 'rounded-[22px] border-[2.5px] border-[#003366] bg-white p-5 shadow-[6px_8px_0_#C6D2F8]';

const FEATURES = [
  {
    title: 'Papers from your faculty',
    body: 'Scheduled mocks land here the moment they are assigned to your batch.',
    Icon: PaperIcon,
  },
  {
    title: 'Timed like exam day',
    body: 'A live countdown, question palette and auto-submit when time runs out.',
    Icon: ClockIcon,
  },
  {
    title: 'Marked on submit',
    body: 'Score, batch rank and step-by-step solutions, the moment the paper closes.',
    Icon: ChartIcon,
  },
] as const;

function PaperIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cx('h-6 w-6', className)}>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6M8 13h8M8 17h5" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cx('h-6 w-6', className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cx('h-6 w-6', className)}>
      <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />
    </svg>
  );
}

export default function StudentPortalLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);

  // Already signed in on this device? Go straight to the dashboard.
  useEffect(() => {
    studentMe()
      .then(() => router.replace('/student'))
      .catch(() => setChecking(false));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await studentLogin(identifier, password);
      router.replace('/student');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid roll number or password');
      setBusy(false);
    }
  }

  if (checking) {
    return <Loader fullScreen text="Checking your session" />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FBFCFE] bg-page-wash font-dm text-[#003366]">
      <Sparkle className="left-[6%] top-[18%] w-7 text-[#003366]" />
      <Sparkle className="right-[7%] top-[42%] w-6 text-accent" />
      <Sparkle className="bottom-[16%] left-[10%] w-5 text-accent" />

      <div className="relative z-10 mx-auto w-full max-w-[1160px] px-4 pb-14 pt-1 sm:px-6 sm:pt-2">
        <nav className="flex items-center justify-between py-3">
          <Link href="/" aria-label="JEENEET.ai home" className="rounded-xl">
            <Image src="/logo.png" alt="JEENEET.ai" width={118} height={48} priority className="block h-12 w-auto sm:h-14" />
          </Link>
          <Link href="/login" className={cx(BUTTON_SECONDARY, FOCUS_RING)}>
            Self-prep login
          </Link>
        </nav>

        {/* Hero: who this door is for and what sits behind it. */}
        <header className="mx-auto mt-1 flex max-w-[1000px] flex-col items-center gap-3 text-center sm:mt-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#003366]/15 bg-ice px-3.5 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.07em] text-[#003366]">
            <i aria-hidden className="h-2 w-2 rounded-full bg-accent shadow-[0_0_0_3px_rgba(128,54,136,.18)]" />
            Institutional exam portal
          </span>

          <h1 className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 font-display text-[30px] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#003366] sm:text-[38px] lg:text-[46px]">
            <span className="whitespace-nowrap">Write the paper.</span>
            <span className="inline-block rotate-[-1.5deg] whitespace-nowrap rounded-[10px] bg-grad px-2.5 pb-1 pt-0.5 text-white shadow-[0_4px_0_#5A2560]">
              See the marking.
            </span>
          </h1>


        </header>

        {/* Stage: the form in the middle, a real paper and scorecard beside it. */}
        <section className="mt-6 grid justify-items-center gap-6 sm:mt-7 xl:mt-8 xl:grid-cols-[290px_minmax(0,460px)_290px] xl:items-start xl:gap-10">
          <aside className="order-2 w-full max-w-[460px] xl:order-1 xl:mt-10 xl:max-w-none xl:-rotate-2">
            <div className={SIDE_CARD}>
              <div className="flex items-center justify-between gap-2">
                <span className={CHIP_SUBJECT}>Mock exam</span>
                <span className={CHIP_READY}>Ready to start</span>
              </div>
              <h2 className="mt-3 font-display text-[17px] font-extrabold leading-snug text-[#003366]">
                Full syllabus mock 04
              </h2>
              <p className="mt-1.5 text-[12.5px] font-semibold text-[#5A6B8C]">
                180 minutes · 75 questions · PCM
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5" aria-hidden>
                {Array.from({ length: 10 }).map((_, i) => (
                  <span
                    key={i}
                    className={cx(
                      'grid h-7 w-7 place-items-center rounded-[8px] border text-[11px] font-extrabold tabular-nums',
                      i < 4
                        ? 'border-[#15803D] bg-[#15803D] text-white'
                        : i === 6
                          ? 'border-accent bg-accent text-white'
                          : 'border-[#003366]/15 bg-white text-[#003366]',
                    )}
                  >
                    {i + 1}
                  </span>
                ))}
                <span className="grid h-7 w-7 place-items-center rounded-[8px] border border-[#003366]/10 bg-ice text-[11px] font-bold text-[#5A6B8C]">
                  +65
                </span>
              </div>

              <p className="mt-3 border-t border-[#003366]/10 pt-3 text-[12px] font-medium text-[#5A6B8C]">
                Opens when your faculty releases it. You can resume a started paper.
              </p>
            </div>
          </aside>

          <main className="order-1 w-full max-w-[460px] xl:order-2">
            <div className="rounded-[28px] border-[2.5px] border-[#003366] bg-white p-6 shadow-[7px_9px_0_#C6D2F8] sm:p-9">
              <div className="mb-5">
                <h2 className="font-display text-[25px] font-extrabold leading-tight tracking-[-0.02em] text-[#003366] sm:text-[28px]">
                  Student sign in
                </h2>
                <p className="mt-1.5 text-[13.5px] leading-[1.6] text-[#5A6B8C]">
                  Use the roll number and password your faculty issued.
                </p>
              </div>

              {error && <div className={cx(ERROR_BANNER, 'mb-4')} role="alert">{error}</div>}

              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-1.5">
                  <label className={LABEL} htmlFor="student-roll">Roll number or registered email</label>
                  <input
                    id="student-roll"
                    type="text"
                    className={INPUT}
                    placeholder="e.g. JEE-2026-042"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="grid gap-1.5">
                  <label className={LABEL} htmlFor="student-pass">Password</label>
                  <div className="relative">
                    <input
                      id="student-pass"
                      type={showPassword ? 'text' : 'password'}
                      className={cx(INPUT, 'pr-[76px]')}
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
                      className={cx(
                        'absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-[10px] border-0 bg-transparent px-2.5 py-2 text-[12px] font-extrabold text-[#31407F] transition-colors duration-150 hover:bg-ice motion-reduce:transition-none',
                        FOCUS_RING,
                      )}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <button type="submit" className={cx(BUTTON_PRIMARY, 'mt-1 min-h-[54px] w-full text-[15px]')} disabled={busy}>
                  {busy ? (
                    <>
                      <span
                        aria-hidden
                        className="h-4 w-4 animate-[spin_.7s_linear_infinite] rounded-full border-[3px] border-white/40 border-t-white motion-reduce:animate-none"
                      />
                      Signing in...
                    </>
                  ) : (
                    'Sign in to the portal'
                  )}
                </button>
              </form>

              <p className="mt-6 border-t border-[#003366]/10 pt-4 text-center text-[13px] leading-[1.6] text-[#5A6B8C]">
                Studying on your own?{' '}
                <Link href="/login" className="font-extrabold text-accent underline decoration-2 underline-offset-4">
                  Use the self-prep login
                </Link>
              </p>
            </div>
          </main>

          <aside className="order-3 w-full max-w-[460px] xl:mt-16 xl:max-w-none xl:rotate-2">
            <div className={SIDE_CARD}>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#5A6B8C]">Latest scorecard</p>
              <p className="mt-1 font-display text-[30px] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-[#003366]">
                148
                <span className="ml-1 text-[14px] font-bold text-[#5A6B8C]">/ 240</span>
              </p>
              <p className="mt-1.5 text-[12.5px] font-semibold text-[#5A6B8C]">Rank #3 of 24 in the batch</p>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ice">
                <div className="h-full w-[72%] rounded-full bg-grad" />
              </div>

              <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-[#003366]/10 pt-3">
                <div>
                  <dt className="text-[10.5px] font-bold uppercase tracking-[0.04em] text-[#5A6B8C]">Correct</dt>
                  <dd className="text-[15px] font-extrabold tabular-nums text-[#15803D]">+38</dd>
                </div>
                <div>
                  <dt className="text-[10.5px] font-bold uppercase tracking-[0.04em] text-[#5A6B8C]">Wrong</dt>
                  <dd className="text-[15px] font-extrabold tabular-nums text-[#C8202F]">-8</dd>
                </div>
                <div>
                  <dt className="text-[10.5px] font-bold uppercase tracking-[0.04em] text-[#5A6B8C]">Accuracy</dt>
                  <dd className="text-[15px] font-extrabold tabular-nums text-[#003366]">83%</dd>
                </div>
              </dl>
            </div>
          </aside>
        </section>

        {/* What the portal does, in three lines. */}
        <section className="mt-12 sm:mt-14">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="font-display text-[18px] font-extrabold text-[#003366]">Inside the portal</h2>
            <span aria-hidden className="h-0.5 flex-1 rounded-[2px] bg-[repeating-linear-gradient(90deg,#C6D2F8_0_6px,transparent_6px_11px)]" />
          </div>

          <ul className="grid gap-4 sm:grid-cols-3">
            {FEATURES.map(({ title, body, Icon }) => (
              <li key={title} className="rounded-[22px] border-[2.5px] border-[#003366] bg-white p-5 shadow-[0_7px_0_#C6D2F8]">
                <span className="grid h-11 w-11 place-items-center rounded-[14px] bg-grad text-white shadow-[0_4px_0_#5A2560]">
                  <Icon />
                </span>
                <p className="mt-3.5 font-display text-[16.5px] font-extrabold leading-snug text-[#003366]">{title}</p>
                <p className="mt-1 text-[13px] leading-[1.6] text-[#5A6B8C]">{body}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {['Physics', 'Chemistry', 'Mathematics'].map((subject) => (
            <span key={subject} className="inline-flex items-center gap-2 text-[14px] font-bold text-[#003366]">
              <i aria-hidden className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_4px_#EAD7EC]" />
              {subject}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
