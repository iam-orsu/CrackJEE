'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  facultyLogout,
  facultyMe,
  facultySendOtp,
  facultyVerifyOtp,
  type FacultyUser,
} from '@/lib/faculty';
import VerifyField from '@/components/VerifyField';

export default function FacultyOnboardingPage() {
  const router = useRouter();
  const [faculty, setFaculty] = useState<FacultyUser | null>(null);
  const [mobile, setMobile] = useState('');
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    facultyMe()
      .then((res) => {
        if (!active) return;
        setFaculty(res.faculty);
        setMobile(res.faculty.mobile ?? '');
        setVerified(Boolean(res.faculty.mobileVerified));
      })
      .catch(() => {
        if (active) router.replace('/faculty/login');
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => { active = false; };
  }, [router]);

  useEffect(() => {
    if (checking) return;
    if (!faculty) return;
    if (verified) router.replace('/faculty');
  }, [checking, faculty, verified, router]);

  async function handleSignOut() {
    try {
      await facultyLogout();
    } catch {
      // The cookie is cleared server-side either way; leaving the portal is the goal.
    }
    router.replace('/faculty/login');
  }

  if (checking || !faculty) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#FBFCFE] bg-page-wash font-dm">
        <div className="flex flex-col items-center gap-5" role="status" aria-live="polite">
          <Image src="/logo.png" alt="JEENEET.ai" width={118} height={48} priority className="block h-12 w-auto" />
          <span
            aria-hidden
            className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#C6D2F8] border-t-[#803688] motion-reduce:animate-none"
          />
          <p className="text-[13px] font-semibold text-[#7A87A0]">Checking faculty session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFCFE] bg-page-wash font-dm text-[#003366]">
      <header className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-3 px-4 py-5 sm:px-6">
        <Link href="/" aria-label="JEENEET.ai home" className="shrink-0 rounded-xl">
          <Image src="/logo.png" alt="JEENEET.ai" width={118} height={48} priority style={{ display: 'block', height: 48, width: 'auto' }} />
        </Link>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          className="shrink-0 rounded-full border border-[#003366]/10 bg-white px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.09em] text-[#5A6B8C] shadow-[0_2px_0_#E3E9F7] transition-colors hover:text-[#003366]"
        >
          Sign out
        </button>
      </header>

      <main className="mx-auto w-full max-w-[560px] px-4 pb-16 sm:px-6">
        <div className="rounded-[28px] border border-[#003366]/10 bg-white p-7 shadow-[0_24px_60px_-34px_rgba(0,51,102,.45)] sm:rounded-[32px] sm:p-9">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FF] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#003366]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#803688]" aria-hidden />
            Step 1 of 1
          </span>

          <h1 className="font-display mt-5 text-[clamp(24px,2.8vw,31px)] font-extrabold leading-tight tracking-[-0.02em] text-[#003366]">
            Confirm your phone number
          </h1>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#5A6B8C]">
            You are signed in as <span className="font-bold text-[#003366]">{faculty.email}</span>. Confirm the number
            your students can reach you on to open the paper studio.
          </p>

          <div className="mt-7">
            <VerifyField
              id="faculty-mobile"
              channel="mobile"
              tone="faculty"
              label="Mobile number"
              hint="We text a 4-digit code to confirm the number."
              placeholder="98765 43210"
              prefix="+91"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              }
              value={mobile}
              valid={(v) => v.length === 10}
              verified={verified}
              otpPlacement="inline"
              onChange={(v) => setMobile(v.replace(/\D/g, '').slice(0, 10))}
              onVerified={() => setVerified(true)}
              sendCode={(v) => facultySendOtp(v)}
              verifyCode={(v, code) => facultyVerifyOtp(v, code)}
            />
          </div>

          {verified && (
            <div className="mt-6 rounded-2xl border border-[#12784A]/25 bg-[#F1F9F4] px-4 py-4">
              <p className="flex items-center gap-2.5 text-[13.5px] font-bold text-[#12784A]">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Number confirmed
              </p>
              <button
                type="button"
                onClick={() => router.replace('/faculty')}
                className="mt-3 inline-flex h-11 items-center justify-center rounded-2xl border-[2.5px] border-[#003366] bg-white px-5 text-[14px] font-extrabold text-[#003366] shadow-[0_5px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_7px_0_#C6D2F8] active:translate-y-[4px] active:shadow-[0_1px_0_#C6D2F8] motion-reduce:transition-none"
              >
                Open the paper studio
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
