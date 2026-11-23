'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  studentCompleteOnboarding,
  studentLogout,
  studentMe,
  studentSendEmailOtp,
  studentSendMobileOtp,
  studentVerifyEmailOtp,
  studentVerifyMobileOtp,
  type FacultyStudentUser,
} from '@/lib/facultyStudent';
import OtpBubbles from '@/components/student-portal/OtpBubbles';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, FOCUS_RING, INPUT, LABEL, cx } from '@/components/student-portal/ui';

const TOTAL_STEPS = 2;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const ACTION_LINK =
  'cursor-pointer border-0 bg-transparent p-0 text-[12.5px] font-extrabold text-accent underline decoration-2 underline-offset-[3px] transition-colors duration-150 hover:text-[#5A2560] disabled:cursor-not-allowed disabled:text-[#97A3D4] disabled:no-underline motion-reduce:transition-none';

const CheckIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cx('h-4 w-4', className)}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/**
 * One channel's verification block: the institute-held address, the send action,
 * and the OMR-style code row. The parent holds the value and the verified flag so
 * moving between steps never loses what the student typed.
 */
function VerificationStep({
  channel,
  value,
  onChange,
  verified,
  sendCode,
  verifyCode,
  onVerified,
}: {
  channel: 'email' | 'mobile';
  value: string;
  onChange: (value: string) => void;
  verified: boolean;
  sendCode: (value: string) => Promise<{ cooldownSeconds: number }>;
  verifyCode: (value: string, code: string) => Promise<unknown>;
  onVerified: () => void;
}) {
  const isEmail = channel === 'email';
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [code, setCode] = useState('    ');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const valid = isEmail ? EMAIL_RE.test(value.trim()) : value.length === 10;
  const target = isEmail ? value.trim() : `+91 ${value}`;

  async function requestCode() {
    if (!valid) {
      setError(isEmail ? 'Enter a valid email address' : 'Enter a valid 10-digit mobile number');
      return;
    }
    setSending(true);
    setError('');
    try {
      const result = await sendCode(value);
      setSent(true);
      setCode('    ');
      setCooldown(result.cooldownSeconds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the code');
    } finally {
      setSending(false);
    }
  }

  async function submitCode(entered: string) {
    if (verifying) return;
    setVerifying(true);
    setError('');
    try {
      await verifyCode(value, entered);
      onVerified();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not verify the code');
      setCode('    ');
    } finally {
      setVerifying(false);
    }
  }

  function changeTarget() {
    setSent(false);
    setCode('    ');
    setError('');
    setCooldown(0);
  }

  async function resendCode() {
    if (cooldown > 0 || sending) return;
    setSending(true);
    setError('');
    try {
      const result = await sendCode(value);
      setCooldown(result.cooldownSeconds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the code');
    } finally {
      setSending(false);
    }
  }

  const inputNode = isEmail ? (
    <input
      id="student-email"
      type="email"
      autoComplete="email"
      placeholder="you@example.com"
      className={INPUT}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\s/g, ''))}
    />
  ) : (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-extrabold text-[#31407F]">
        +91
      </span>
      <input
        id="student-mobile"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="98765 43210"
        className={cx(INPUT, 'pl-[58px]')}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
      />
    </div>
  );

  return (
    <div className="rounded-[20px] border border-[#003366]/12 bg-[#FAFBFF] p-4 sm:p-5">
      <div className="flex min-h-[20px] items-center justify-between gap-3">
        <span className={LABEL}>{isEmail ? 'Email address' : 'Mobile number'}</span>
        {verified ? (
          <span className="inline-flex items-center gap-1.5 text-[12px] font-extrabold text-[#12784A]">
            <CheckIcon className="h-3.5 w-3.5" />
            Verified
          </span>
        ) : sent ? (
          <button type="button" className={ACTION_LINK} onClick={changeTarget}>
            Change {isEmail ? 'email' : 'number'}
          </button>
        ) : (
          <button type="button" className={ACTION_LINK} onClick={() => void requestCode()} disabled={sending || !valid}>
            {sending ? 'Sending…' : 'Send code'}
          </button>
        )}
      </div>

      {verified ? (
        <div className="mt-3.5 flex items-center gap-2.5 rounded-[14px] border border-[#12784A]/25 bg-[#EAF7EF] px-3.5 py-3">
          <CheckIcon className="h-4 w-4 shrink-0 text-[#12784A]" />
          <span className="min-w-0 truncate text-[13px] font-semibold text-[#146C33]">{target}</span>
        </div>
      ) : sent ? (
        <div className="mt-4">
          <div className="flex justify-center">
            <OtpBubbles
              value={code}
              onChange={setCode}
              onComplete={(entered) => void submitCode(entered)}
              disabled={verifying}
              invalid={Boolean(error)}
              autoFocus
            />
          </div>
          <p className="mt-4 text-center text-[12.5px] font-semibold text-[#5A6B8C]">
            {verifying ? (
              'Checking your code'
            ) : (
              <>
                Enter the 4-digit code we sent to{' '}
                <span className="font-bold text-[#003366]">{target}</span>
              </>
            )}
          </p>
          <p className="mt-2 text-center text-[12px] font-semibold text-[#5A6B8C]">
            Didn&apos;t get it?{' '}
            <button
              type="button"
              className={ACTION_LINK}
              onClick={() => void resendCode()}
              disabled={sending || cooldown > 0}
            >
              {sending ? 'Sending…' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
            </button>
          </p>
        </div>
      ) : (
        <div className="mt-3.5">
          {inputNode}
          <p className="mt-2.5 text-[12px] font-semibold text-[#5A6B8C]">
            {isEmail ? 'We email a 4-digit code to this address' : 'We text a 4-digit code to this number'}
          </p>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3.5 flex items-start gap-2.5 rounded-[14px] border-2 border-[#C0283A] bg-[#FFF5F6] px-3.5 py-3 text-[13px] font-semibold leading-[1.45] text-[#C0283A] shadow-[0_4px_0_#F3C3C8]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-px h-4 w-4 shrink-0">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="min-w-0">{error}</span>
        </p>
      )}
    </div>
  );
}

export default function StudentOnboardingPage() {
  const router = useRouter();
  const [student, setStudent] = useState<FacultyStudentUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobile, setMobile] = useState('');
  const [mobileVerified, setMobileVerified] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    studentMe()
      .then((res) => {
        if (!active) return;
        const me = res.student;
        if (me.isOnboarded) {
          router.replace('/student');
          return;
        }
        setStudent(me);
        setEmail(me.email ?? '');
        setEmailVerified(Boolean(me.emailVerified));
        setMobile((me.mobile ?? '').replace(/\D/g, '').slice(-10));
        setMobileVerified(Boolean(me.mobileVerified));
        if (me.emailVerified) setStep(1);
      })
      .catch(() => {
        if (active) router.replace('/student/login');
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, [router]);

  async function handleFinish() {
    setSaving(true);
    setError('');
    try {
      await studentCompleteOnboarding();
      router.replace('/student');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not finish onboarding');
      setSaving(false);
    }
  }

  async function handleSignOut() {
    try {
      await studentLogout();
    } catch {
      // The cookie is cleared server-side either way; leaving the portal is the goal.
    }
    router.replace('/student/login');
  }

  if (checking || !student) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#FBFCFE] bg-page-wash font-dm">
        <div className="flex flex-col items-center gap-5" role="status" aria-live="polite">
          <Image src="/logo.png" alt="JEENEET.ai" width={118} height={48} priority className="block h-12 w-auto" />
          <span
            aria-hidden
            className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#C6D2F8] border-t-[#803688] motion-reduce:animate-none"
          />
          <p className="text-[13px] font-semibold text-[#7A87A0]">Checking your session</p>
        </div>
      </div>
    );
  }

  const isEmailStep = step === 0;
  const canContinue = isEmailStep ? emailVerified : mobileVerified;
  const initials = student.name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FBFCFE] bg-page-wash font-dm text-[#003366]">
      <header className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" aria-label="JEENEET.ai home" className="shrink-0 rounded-xl">
          <Image src="/logo.png" alt="JEENEET.ai" width={118} height={48} priority style={{ display: 'block', height: 48, width: 'auto' }} />
        </Link>
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="hidden min-w-0 items-center gap-2 text-[12.5px] font-bold text-[#5A6B8C] sm:inline-flex">
            <span aria-hidden className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-grad text-[11px] font-extrabold text-white">
              {initials || 'S'}
            </span>
            <span className="truncate">
              {student.rollNumber} · {student.batch?.name || student.batch?.code}
            </span>
          </span>
          <button type="button" className={cx(BUTTON_SECONDARY, FOCUS_RING, 'shrink-0')} onClick={() => void handleSignOut()}>
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[560px] px-4 pb-16 sm:px-6">
        <div className="rounded-[28px] border-[2.5px] border-[#003366] bg-white p-5 shadow-[7px_9px_0_#C6D2F8] sm:p-9">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] font-bold text-[#5A6B8C]">
              Step {step + 1} of {TOTAL_STEPS}
            </span>
            <span className="text-[12px] font-bold text-[#5A6B8C]">{isEmailStep ? 'Email' : 'Mobile'}</span>
          </div>

          <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-ice">
            <div
              className="h-full origin-left rounded-full bg-[#003366] transition-transform duration-300 motion-reduce:transition-none"
              style={{ transform: `scaleX(${(step + 1) / TOTAL_STEPS})` }}
            />
          </div>

          <h1 className="mt-5 font-display text-[clamp(24px,2.8vw,31px)] font-extrabold leading-tight tracking-[-0.02em] text-[#003366]">
            {isEmailStep ? 'Confirm your email' : 'Confirm your mobile number'}
          </h1>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#5A6B8C]">
            {isEmailStep ? (
              <>
                You&apos;re enrolled as <span className="font-bold text-[#003366]">{student.name}</span>. Confirm the email
                your institute holds so results and receipts reach you.
              </>
            ) : (
              <>Confirm the number your faculty can reach you on. We text a 4-digit code to check it.</>
            )}
          </p>

          <div className="mt-6">
            {isEmailStep ? (
              <VerificationStep
                key="email"
                channel="email"
                value={email}
                onChange={setEmail}
                verified={emailVerified}
                sendCode={(v) => studentSendEmailOtp(v.trim())}
                verifyCode={(v, code) => studentVerifyEmailOtp(v.trim(), code)}
                onVerified={() => setEmailVerified(true)}
              />
            ) : (
              <VerificationStep
                key="mobile"
                channel="mobile"
                value={mobile}
                onChange={setMobile}
                verified={mobileVerified}
                sendCode={(v) => studentSendMobileOtp(v)}
                verifyCode={(v, code) => studentVerifyMobileOtp(v, code)}
                onVerified={() => setMobileVerified(true)}
              />
            )}
          </div>

          {error && (
            <p role="alert" className="mt-5 flex items-start gap-2.5 rounded-[14px] border-2 border-[#C0283A] bg-[#FFF5F6] px-3.5 py-3 text-[13px] font-semibold leading-[1.45] text-[#C0283A] shadow-[0_4px_0_#F3C3C8]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-px h-4 w-4 shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span className="min-w-0">{error}</span>
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                disabled={saving}
                className={cx(BUTTON_SECONDARY, FOCUS_RING)}
              >
                Back
              </button>
            ) : (
              <span />
            )}

            {isEmailStep ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={!canContinue}
                className={cx(BUTTON_PRIMARY, FOCUS_RING)}
              >
                Verify &amp; continue
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handleFinish()}
                disabled={!canContinue || saving}
                className={cx(BUTTON_PRIMARY, FOCUS_RING)}
              >
                {saving ? (
                  <>
                    <span
                      aria-hidden
                      className="h-4 w-4 animate-spin rounded-full border-[3px] border-white/40 border-t-white motion-reduce:animate-none"
                    />
                    Setting up…
                  </>
                ) : (
                  'Open the paper studio'
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
