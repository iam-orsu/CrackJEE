'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getUser, setSession } from '@/lib/auth';
import MobileVerify from '@/components/MobileVerify';

const CLASSES = [
  { value: '11', label: 'Class 11', hint: 'Just finished 10th' },
  { value: '12', label: 'Class 12', hint: 'Preparing for the exam' },
  { value: 'Dropper', label: 'Dropper', hint: 'A second attempt' },
] as const;

const EXAMS = [
  { value: 'Main', label: 'JEE Main', hint: 'NIT, IIIT, CFTI' },
  { value: 'Advanced', label: 'JEE Advanced', hint: 'IIT admission' },
  { value: 'Both', label: 'JEE Both', hint: 'Main + Advanced' },
  { value: 'NEET', label: 'NEET UG', hint: 'Medical entrance' },
] as const;

const LEVELS = [
  { value: 'beginner', label: 'Beginner', hint: 'We build from the basics' },
  { value: 'intermediate', label: 'Intermediate', hint: 'Most topics feel easy' },
  { value: 'advanced', label: 'Advanced', hint: 'Only the tricky bits left' },
] as const;

const TOTAL_STEPS = 5;
const MOBILE_STEP = 3;
const PSYCHOMETRIC_STEP = 4;

const Sparkle = ({ className }: { className: string }) => (
  <svg className={`ob-spark ${className}`} viewBox="0 0 24 24" aria-hidden>
    <path d="M12 0C12 7 17 12 24 12C17 12 12 17 12 24C12 17 7 12 0 12C7 12 12 7 12 0Z" />
  </svg>
);

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [classValue, setClassValue] = useState<string>('12');
  const [examValue, setExamValue] = useState<string>('Both');
  const [levelValue, setLevelValue] = useState<string>('beginner');
  const [psychometric, setPsychometric] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [mobileVerified, setMobileVerified] = useState(false);
  const [initialMobile, setInitialMobile] = useState('');

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.isOnboarded) {
      router.replace('/dashboard');
      return;
    }
    setClassValue(user.class);
    setExamValue(user.targetExam);
    setLevelValue(user.currentLevel);
    setPsychometric(Boolean(user.hasPsychometric));
    if (user.mobileVerified && user.mobile) {
      setInitialMobile(user.mobile.slice(-10));
      setMobileVerified(true);
    }
  }, [router]);

  async function handleFinish() {
    setSaving(true);
    setError('');
    try {
      const user = await api.auth.completeOnboarding({
        class: classValue,
        targetExam: examValue,
        currentLevel: levelValue,
        hasPsychometric: psychometric,
      });
      const current = getUser();
      setSession(
        { ...(current ?? user), ...user } as import('@/types').User,
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      );
      router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your preferences');
      setSaving(false);
    }
  }

  const steps = [
    {
      title: 'Which class are you in?',
      copy: 'We pull questions from the syllabus that matches your class.',
      options: CLASSES.map((o) => ({ ...o, on: classValue === o.value, pick: () => setClassValue(o.value) })),
    },
    {
      title: 'Which exam are you preparing for?',
      copy: 'Your dashboard, mocks and weak areas all follow this choice.',
      options: EXAMS.map((o) => ({ ...o, on: examValue === o.value, pick: () => setExamValue(o.value) })),
    },
    {
      title: 'How is your prep going?',
      copy: 'This sets the difficulty mix of the questions we serve you.',
      options: LEVELS.map((o) => ({ ...o, on: levelValue === o.value, pick: () => setLevelValue(o.value) })),
    },
  ];

  const current = steps[step];
  const isOptionStep = step < steps.length;
  const isMobileStep = step === MOBILE_STEP;
  const isPsychometricStep = step === PSYCHOMETRIC_STEP;

  return (
    <div className="ob-root">
      <style>{css}</style>

      <div className="ob-blob ob-blob-a" aria-hidden />
      <div className="ob-blob ob-blob-b" aria-hidden />
      <div className="ob-blob ob-blob-c" aria-hidden />
      <div className="ob-blob ob-blob-d" aria-hidden />
      <Sparkle className="ob-s1" />
      <Sparkle className="ob-s2" />
      <Sparkle className="ob-s3" />

      <div className="ob-page">
        <nav className="ob-nav">
          <Link href="/" className="ob-logo" aria-label="JEENEET.ai home">
            <Image src="/logo.png" alt="JEENEET.ai" width={150} height={62} className="site-logo" priority />
          </Link>
        </nav>

        <main className="ob-box">
          <header className="ob-head">
            <p className="ob-step">Step {Math.min(step + 1, TOTAL_STEPS)} of {TOTAL_STEPS}</p>
            <h1>
              {isOptionStep
                ? current.title
                : isMobileStep
                  ? 'Verify your mobile number'
                  : 'One last thing'}
            </h1>
            <p>
              {isOptionStep
                ? current.copy
                : isMobileStep
                  ? 'We text a 4-digit code to your phone so your account stays reachable and mock reminders reach you.'
                  : 'An optional diagnostic that maps your strengths and study habits.'}
            </p>
          </header>

          <div className="ob-bar" role="progressbar" aria-valuemin={1} aria-valuemax={TOTAL_STEPS} aria-valuenow={step + 1}>
            <i style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} />
          </div>

          {error && (
            <p role="alert" className="ob-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </p>
          )}

          {isOptionStep ? (
            <div className="ob-options">
              {current.options.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  className={`ob-option${option.on ? ' on' : ''}${index === current.options.length - 1 && current.options.length % 2 === 1 ? ' ob-option-wide' : ''}`}
                  onClick={option.pick}
                  aria-pressed={option.on}
                >
                  <span className="ob-option-main">
                    <strong>{option.label}</strong>
                    <small>{option.hint}</small>
                  </span>
                  <span className="ob-tick" aria-hidden>
                    {option.on && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                </button>
              ))}
            </div>
          ) : isMobileStep ? (
            <MobileVerify
              initialMobile={initialMobile}
              alreadyVerified={mobileVerified}
              sendCode={(m) => api.otp.send({ mobile: m })}
              verifyCode={(m, code) => api.otp.verify({ mobile: m, otp: code })}
              onVerified={(user) => {
                setMobileVerified(true);
                const current = getUser();
                setSession(
                  { ...(current ?? user), ...user } as import('@/types').User,
                  new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                );
              }}
            />
          ) : (
            <div className="ob-options">
              <button
                type="button"
                className={`ob-addon${psychometric ? ' on' : ''}`}
                onClick={() => setPsychometric((v) => !v)}
                aria-pressed={psychometric}
              >
                <span className="ob-tick" aria-hidden>
                  {psychometric && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <span className="ob-option-main">
                  <strong>Behavioral &amp; Career Diagnostic</strong>
                  <small>A live AI assessment of your strengths, study habits and career direction.</small>
                </span>
              </button>
            </div>
          )}

          <div className="ob-actions">
            {step > 0 ? (
              <button type="button" className="ob-back" onClick={() => setStep((s) => s - 1)} disabled={saving}>
                Back
              </button>
            ) : (
              <span />
            )}

            {isPsychometricStep ? (
              <button type="button" className="ob-next" onClick={handleFinish} disabled={saving}>
                {saving ? 'Setting up...' : 'Start preparing'}
              </button>
            ) : (
              <button
                type="button"
                className="ob-next"
                onClick={() => setStep((s) => s + 1)}
                disabled={isMobileStep && !mobileVerified}
              >
                Continue
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700;800&display=swap');

.ob-root{
  --blue:#003366; --blue-d:#00284F; --ink:#003366; --muted:#3C4A8A;
  --purple:#803688; --purple-d:#5A2560; --purple-2:#A24BA8;
  --grad:linear-gradient(135deg,#803688 0%,#A24BA8 100%);
  --ice:#EEF2FF; --soft:#C6D2F8; --blob:#EDE3EF; --err:#C0283A;
  position:relative;min-height:100vh;min-height:100dvh;
  overflow:hidden;overflow:clip;background:#fff;
  font-family:'DM Sans',system-ui,sans-serif;color:var(--ink);
  -webkit-text-size-adjust:100%;
}
.ob-root *{box-sizing:border-box}
.ob-root h1,.ob-root p{margin:0;padding:0}
.ob-root button{font-family:inherit}
.ob-root :focus-visible{outline:3px solid var(--purple);outline-offset:3px}

.ob-blob{position:absolute;z-index:0;pointer-events:none}
.ob-blob-a{width:min(80vw,1150px);aspect-ratio:1.1;right:-24vw;bottom:-16vw;background:var(--blob);border-radius:58% 42% 47% 53% / 52% 61% 39% 48%}
.ob-blob-b{width:min(46vw,660px);aspect-ratio:1;left:-14vw;top:-13vw;background:#EEF1FB;border-radius:46% 54% 60% 40% / 52% 44% 56% 48%}
.ob-blob-c{width:min(30vw,420px);aspect-ratio:1;left:-6vw;bottom:8vh;background:#F3EAF5;border-radius:55% 45% 38% 62% / 48% 57% 43% 52%}
.ob-blob-d{width:min(18vw,260px);aspect-ratio:1;right:5vw;top:13vh;background:#F0F3FF;border-radius:62% 38% 50% 50% / 44% 56% 44% 56%}

.ob-spark{position:absolute;z-index:1;pointer-events:none;fill:var(--blue)}
.ob-s1{width:30px;top:21%;left:5%}
.ob-s2{width:22px;top:46%;right:6%;fill:var(--purple)}
.ob-s3{width:26px;bottom:20%;left:9%;fill:var(--purple)}

.ob-page{
  position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;
  width:100%;max-width:1320px;margin:0 auto;padding:0 clamp(16px,4vw,56px) clamp(56px,8vw,110px);
}

.ob-nav{width:100%;display:flex;align-items:center;justify-content:space-between;padding:12px 0}
.ob-logo{display:inline-flex;align-items:center}
.ob-logo .site-logo{width:auto;height:70px;max-width:100%}
@media(max-width:720px){.ob-logo .site-logo{height:56px}}

.ob-box{
  position:relative;z-index:3;width:100%;max-width:580px;margin-top:clamp(20px,3vh,32px);
  background:#fff;border:2.5px solid var(--blue);border-radius:28px;padding:clamp(24px,3.4vw,40px);
  box-shadow:8px 10px 0 var(--blue),16px 20px 0 var(--purple);
}

.ob-head .ob-step{
  display:inline-block;margin:0 0 12px;padding:5px 12px;border-radius:99px;
  background:var(--ice);border:1.5px solid #B9C4EE;font-size:11.5px;font-weight:800;
  letter-spacing:.06em;text-transform:uppercase;color:var(--blue);white-space:nowrap;
}
.ob-head h1{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:clamp(24px,3vw,32px);line-height:1.12;letter-spacing:-.02em;color:var(--blue)}
.ob-head p{margin-top:10px;color:var(--muted);font-size:15px;line-height:1.6}

.ob-bar{height:8px;margin:22px 0 26px;border-radius:99px;background:var(--ice);overflow:hidden}
.ob-bar i{display:block;height:100%;border-radius:99px;background:var(--grad);transition:width .3s cubic-bezier(.2,.8,.2,1)}

.ob-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.ob-option{
  display:flex;align-items:center;justify-content:space-between;gap:14px;width:100%;text-align:left;
  padding:15px 16px;border-radius:18px;background:#fff;border:2.5px solid var(--blue);
  box-shadow:0 5px 0 var(--soft);cursor:pointer;
  transition:transform .15s,box-shadow .15s,background .15s,border-color .15s;
  -webkit-tap-highlight-color:transparent;
}
.ob-option-wide{grid-column:1/-1}
.ob-option:hover{transform:translateY(-2px);box-shadow:0 7px 0 var(--soft)}
.ob-option.on{background:var(--grad);border-color:var(--purple);color:#fff;box-shadow:0 5px 0 var(--purple-d)}
.ob-option-main{display:flex;flex-direction:column;gap:3px;min-width:0}
.ob-option-main strong{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:16px;line-height:1.2}
.ob-option-main small{font-size:13px;font-weight:600;color:var(--muted);line-height:1.4}
.ob-option.on .ob-option-main small{color:rgba(255,255,255,.85)}
.ob-tick{
  display:grid;place-items:center;width:28px;height:28px;flex-shrink:0;border-radius:50%;
  border:2px solid var(--blue);color:#fff;background:#fff;
}
.ob-option.on .ob-tick{background:#fff;border-color:#fff;color:var(--purple)}

.ob-addon{
  display:flex;align-items:flex-start;gap:13px;width:100%;grid-column:1/-1;text-align:left;padding:16px;
  border-radius:18px;background:#fff;border:2.5px solid var(--blue);box-shadow:0 5px 0 var(--soft);
  cursor:pointer;transition:transform .15s,box-shadow .15s,background .15s,border-color .15s;
  -webkit-tap-highlight-color:transparent;
}
.ob-addon:hover{transform:translateY(-2px);box-shadow:0 7px 0 var(--soft)}
.ob-addon.on{background:var(--ice);border-color:var(--purple)}
.ob-addon .ob-tick{margin-top:2px}
.ob-addon.on .ob-tick{background:var(--purple);border-color:var(--purple);color:#fff}

.ob-box .ob-error{
  display:flex;align-items:flex-start;gap:10px;margin:0 0 18px;
  background:#FFF5F6;color:var(--err);border:2px solid var(--err);border-radius:14px;
  padding:11px 14px;box-shadow:0 4px 0 #F3C3C8;
  font-weight:600;font-size:13.5px;line-height:1.45;overflow-wrap:anywhere;
}
.ob-box .ob-error svg{flex:none;width:16px;height:16px;margin-top:1px}
.ob-box .ob-error span{min-width:0}

.ob-actions{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:26px}
.ob-back{
  min-height:46px;padding:0 18px;border-radius:14px;background:#fff;border:2.5px solid var(--blue);
  font-weight:800;font-size:14px;color:var(--blue);cursor:pointer;box-shadow:0 4px 0 var(--soft);
  transition:transform .15s,box-shadow .15s;
}
.ob-back:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 0 var(--soft)}
.ob-next{
  display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:0 28px;border-radius:16px;
  font-weight:800;font-size:16px;color:#fff;background:var(--grad);border:0;cursor:pointer;
  box-shadow:0 6px 0 var(--purple-d);transition:transform .15s,box-shadow .15s;
}
.ob-next:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 9px 0 var(--purple-d)}
.ob-next:active:not(:disabled){transform:translateY(4px);box-shadow:0 2px 0 var(--purple-d)}
.ob-next:disabled{opacity:.75;cursor:not-allowed}

@media(max-width:980px){.ob-s1,.ob-s3{display:none}}
@media(max-width:600px){
  .ob-nav{padding:16px 0}
  .ob-box{box-shadow:5px 7px 0 var(--blue),10px 14px 0 var(--purple);border-radius:24px}
  .ob-head p{font-size:14px}
  .ob-option-main strong{font-size:15px}
  .ob-options{grid-template-columns:minmax(0,1fr)}
  .ob-option-wide{grid-column:auto}
}
@media(max-width:400px){
  .ob-nav{justify-content:center}
}
@media(hover:none){
  .ob-option:hover,.ob-addon:hover,.ob-back:hover,.ob-next:hover{transform:none}
}
@media(prefers-reduced-motion:reduce){
  .ob-root *{animation:none!important;transition:none!important}
}
`;
