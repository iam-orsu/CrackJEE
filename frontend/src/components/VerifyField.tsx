'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

const OTP_LENGTH = 4;

type VerifyFieldProps = {
  id: string;
  channel: 'email' | 'mobile';
  variant?: 'field' | 'code';
  tone?: 'brand' | 'faculty';
  label: string;
  hint: string;
  placeholder?: string;
  icon?: ReactNode;
  prefix?: string;
  value: string;
  valid: (value: string) => boolean;
  verified: boolean;
  autoSend?: boolean;
  otpPlacement?: 'inline' | 'below';
  onChange?: (value: string) => void;
  onVerified: () => void;
  sendCode: (value: string) => Promise<{ cooldownSeconds: number }>;
  verifyCode: (value: string, otp: string) => Promise<unknown>;
};

function OtpBoxes({
  value,
  onChange,
  onComplete,
  disabled,
  invalid,
}: {
  value: string;
  onChange: (next: string) => void;
  onComplete: (code: string) => void;
  disabled?: boolean;
  invalid?: boolean;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const chars = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] ?? ' ');

  const fill = (next: string) => {
    onChange(next);
    if (next.length === OTP_LENGTH && !next.includes(' ')) onComplete(next);
  };

  function handleChange(i: number, raw: string) {
    const digits = raw.replace(/\D/g, '');
    if (!digits) {
      fill(value.slice(0, i) + ' ' + value.slice(i + 1));
      return;
    }
    fill(value.slice(0, i) + digits.slice(-1) + value.slice(i + 1));
    if (i < OTP_LENGTH - 1) refs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !value[i].trim() && i > 0) {
      e.preventDefault();
      fill(value.slice(0, i - 1) + ' ' + value.slice(i));
      refs.current[i - 1]?.focus();
      return;
    }
    if (e.key === 'ArrowLeft' && i > 0) {
      e.preventDefault();
      refs.current[i - 1]?.focus();
      return;
    }
    if (e.key === 'ArrowRight' && i < OTP_LENGTH - 1) {
      e.preventDefault();
      refs.current[i + 1]?.focus();
      return;
    }
    if (e.key === 'Enter' && value.length === OTP_LENGTH && !value.includes(' ')) {
      e.preventDefault();
      onComplete(value);
    }
  }

  function handlePaste(i: number, e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH - i);
    if (!digits) return;
    const next = (value.slice(0, i) + digits + value.slice(i + digits.length)).slice(0, OTP_LENGTH);
    fill(next);
    refs.current[Math.min(i + digits.length, OTP_LENGTH - 1)]?.focus();
  }

  return (
    <div className="vf-otp" role="group" aria-label="4-digit verification code">
      {chars.map((char, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={`vf-box${char !== ' ' ? ' filled' : ''}${invalid ? ' bad' : ''}`}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={char === ' ' ? '' : char}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
        />
      ))}
    </div>
  );
}

export default function VerifyField({
  id,
  channel,
  variant = 'field',
  tone = 'brand',
  label,
  hint,
  placeholder,
  icon,
  prefix,
  value,
  valid,
  verified,
  autoSend = false,
  otpPlacement = 'below',
  onChange,
  onVerified,
  sendCode,
  verifyCode,
}: VerifyFieldProps) {
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState('    ');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState('');
  const autoSent = useRef(false);

  const isEmail = channel === 'email';
  const isCode = variant === 'code';
  const showOtp = sent && !verified;

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    setSent(false);
    setOtp('    ');
    setError('');
    setCooldown(0);
  }, [value]);

  const requestCode = useCallback(async () => {
    if (!valid(value)) {
      setError(isEmail ? 'Enter a valid email address' : 'Enter a valid 10-digit mobile number');
      return;
    }
    setSending(true);
    setError('');
    try {
      const result = await sendCode(value);
      setSent(true);
      setOtp('    ');
      setCooldown(result.cooldownSeconds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the code');
    } finally {
      setSending(false);
    }
  }, [isEmail, sendCode, valid, value]);

  useEffect(() => {
    if (!autoSend || autoSent.current || verified) return;
    if (!valid(value)) return;
    autoSent.current = true;
    void requestCode();
  }, [autoSend, requestCode, valid, value, verified]);

  async function submitOtp(code: string) {
    if (verifying) return;
    setVerifying(true);
    setError('');
    try {
      await verifyCode(value, code);
      onVerified();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not verify the code');
    } finally {
      setVerifying(false);
    }
  }

  const target = isEmail ? value : prefix ? `${prefix} ${value}` : value;

  const otpNode = (
    <OtpBoxes
      value={otp}
      onChange={setOtp}
      onComplete={(code) => void submitOtp(code)}
      disabled={verifying}
      invalid={Boolean(error)}
    />
  );

  const inputNode = !isCode && (
    <div className={`vf-input${prefix ? ' vf-hascc' : ''}`}>
      {icon}
      {prefix && <span className="vf-cc">{prefix}</span>}
      <input
        id={id}
        className={verified ? 'vf-done' : ''}
        type={isEmail ? 'email' : 'tel'}
        inputMode={isEmail ? 'email' : 'numeric'}
        autoComplete={isEmail ? 'email' : 'tel-national'}
        placeholder={placeholder}
        value={value}
        maxLength={isEmail ? 254 : 10}
        onChange={(e) => onChange?.(e.target.value)}
        required
      />
    </div>
  );

  return (
    <div className={`vf-field${isCode ? ' vf-codefield' : ''}${tone === 'faculty' ? ' vf-faculty' : ''}`}>
      <style>{css}</style>

      <div className="vf-labelrow">
        <label className="vf-label" htmlFor={id}>{label}</label>
        {verified ? (
          <span className="vf-ok">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Verified
          </span>
        ) : (
          <button
            type="button"
            className="vf-act"
            onClick={() => void requestCode()}
            disabled={sending || cooldown > 0 || !valid(value)}
          >
            {sending ? 'Sending…' : cooldown > 0 ? `Resend in ${cooldown}s` : sent ? 'Resend code' : 'Send code'}
          </button>
        )}
      </div>

      {isCode ? (
        <div className="vf-codewrap">{otpNode}</div>
      ) : otpPlacement === 'inline' ? (
        <div className="vf-inputrow">
          {inputNode}
          {showOtp && otpNode}
        </div>
      ) : (
        <>
          {inputNode}
          {showOtp && otpNode}
        </>
      )}

      {error && (
        <p role="alert" className="vf-err">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </p>
      )}

      <p className={`vf-hint${verified ? ' ok' : ''}`}>
        {verifying
          ? 'Checking your code'
          : verified
            ? isEmail
              ? 'Address confirmed'
              : 'Number confirmed'
            : showOtp
              ? `Enter the code sent to ${target}`
              : hint}
      </p>
    </div>
  );
}

const css = `
.vf-field{display:flex;flex-direction:column;gap:8px;min-width:0}
.vf-codefield{gap:16px}
.vf-labelrow{display:flex;align-items:baseline;justify-content:space-between;gap:12px;min-height:20px}
.vf-label{font-size:13px;font-weight:800;color:#003366}
.vf-act{
  background:none;border:0;padding:0;cursor:pointer;font:inherit;font-weight:800;font-size:13px;
  color:#803688;text-decoration:underline;text-underline-offset:3px;white-space:nowrap;
}
.vf-act:hover:not(:disabled){color:#5A2560}
.vf-act:disabled{color:#97A3D4;cursor:not-allowed;text-decoration:none}
.vf-ok{display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:800;color:#12784A;white-space:nowrap}

.vf-inputrow{display:flex;align-items:flex-start;gap:12px;flex-wrap:wrap}
.vf-inputrow .vf-input{flex:1 1 200px;min-width:0}
.vf-input{position:relative}
.vf-input>svg{position:absolute;left:15px;top:50%;transform:translateY(-50%);color:#003366;opacity:.7;pointer-events:none;z-index:1}
.vf-input input{
  width:100%;height:54px;padding:0 16px 0 44px;font:inherit;font-weight:600;font-size:15px;color:#003366;
  background:#fff;border:2.5px solid #003366;border-radius:14px;outline:none;
  box-shadow:0 5px 0 #C6D2F8;transition:transform .12s,box-shadow .12s,border-color .12s;
  -webkit-appearance:none;appearance:none;
}
.vf-input input::placeholder{color:#97A3D4;font-weight:500}
.vf-input input:focus{border-color:#803688;transform:translateY(-2px);box-shadow:0 7px 0 #E3C9E6}
.vf-input input.vf-done{border-color:#12784A;box-shadow:0 5px 0 #C7E6D3}
.vf-input input.vf-done:focus{border-color:#12784A;box-shadow:0 7px 0 #C7E6D3}
.vf-hascc input{padding-left:88px}
.vf-cc{position:absolute;left:46px;top:50%;transform:translateY(-50%);font-weight:800;font-size:15px;color:#3C4A8A;z-index:1}

.vf-codewrap{display:flex;justify-content:center}
.vf-otp{display:flex;gap:8px;flex:none;padding-top:1px}
.vf-box{
  width:46px;height:54px;flex:none;text-align:center;font:inherit;font-weight:800;font-size:20px;color:#003366;
  background:#fff;border:2.5px solid #003366;border-radius:13px;outline:none;
  box-shadow:0 5px 0 #C6D2F8;transition:transform .12s,box-shadow .12s,border-color .12s,background .12s;
  -webkit-appearance:none;appearance:none;
}
.vf-box.filled{background:#EEF2FF}
.vf-box:focus{border-color:#803688;transform:translateY(-2px);box-shadow:0 7px 0 #E3C9E6;background:#fff}
.vf-box.bad{border-color:#C0283A;box-shadow:0 5px 0 #F3C3C8}
.vf-box:disabled{opacity:.6}

.vf-hint{font-size:12px;font-weight:700;color:#5663A0}
.vf-hint.ok{color:#12784A}
.vf-faculty{--vf-ink:#003366;--vf-line:#C6D2F8;--vf-accent:#803688;--vf-accent-soft:#E3C9E6;--vf-ok:#12784A;--vf-ok-soft:#C7E6D3;--vf-err:#C8202F;--vf-err-bg:#FDF3F4;--vf-err-line:#F3C3C8}
.vf-faculty .vf-label{color:var(--vf-ink)}
.vf-faculty .vf-act{color:var(--vf-accent)}
.vf-faculty .vf-act:hover:not(:disabled){color:#5A2560}
.vf-faculty .vf-act:disabled{color:#97A3D4}
.vf-faculty .vf-ok{color:var(--vf-ok)}
.vf-faculty .vf-input>svg{color:var(--vf-ink)}
.vf-faculty .vf-input input{border-color:var(--vf-ink);box-shadow:0 5px 0 var(--vf-line)}
.vf-faculty .vf-input input:focus{border-color:var(--vf-accent);box-shadow:0 7px 0 var(--vf-accent-soft)}
.vf-faculty .vf-input input.vf-done{border-color:var(--vf-ok);box-shadow:0 5px 0 var(--vf-ok-soft)}
.vf-faculty .vf-input input.vf-done:focus{border-color:var(--vf-ok);box-shadow:0 7px 0 var(--vf-ok-soft)}
.vf-faculty .vf-cc{color:#5A6B8C}
.vf-faculty .vf-box{border-color:var(--vf-ink);box-shadow:0 5px 0 var(--vf-line)}
.vf-faculty .vf-box.filled{background:#EEF2FF}
.vf-faculty .vf-box:focus{border-color:var(--vf-accent);box-shadow:0 7px 0 var(--vf-accent-soft)}
.vf-faculty .vf-box.bad{border-color:var(--vf-err);box-shadow:0 5px 0 var(--vf-err-line)}
.vf-faculty .vf-hint{color:#5A6B8C}
.vf-faculty .vf-hint.ok{color:var(--vf-ok)}
.vf-faculty .vf-err{background:var(--vf-err-bg);color:var(--vf-err);border-color:var(--vf-err);box-shadow:0 4px 0 var(--vf-err-line)}
.vf-err{
  display:flex;align-items:flex-start;gap:10px;
  background:#FFF5F6;color:#C0283A;border:2px solid #C0283A;border-radius:14px;
  padding:11px 14px;box-shadow:0 4px 0 #F3C3C8;
  font-weight:600;font-size:13.5px;line-height:1.45;overflow-wrap:anywhere;
}
.vf-err svg{flex:none;width:16px;height:16px;margin-top:1px}
.vf-err span{min-width:0}
@media(max-width:600px){
  .vf-box{width:42px;height:50px;font-size:18px;border-radius:12px}
  .vf-otp{gap:6px}
}
`;
