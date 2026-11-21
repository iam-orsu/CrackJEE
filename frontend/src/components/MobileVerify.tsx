'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type MobileVerifyProps<TResult> = {
  initialMobile?: string;
  autoSend?: boolean;
  alreadyVerified?: boolean;
  verifyLabel?: string;
  sendCode: (mobile: string) => Promise<unknown>;
  verifyCode: (mobile: string, otp: string) => Promise<TResult>;
  onVerified: (result: TResult) => void;
};

function sanitizeMobile(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 10) return digits;
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits.slice(-10);
}

function sanitizeOtp(value: string): string {
  return value.replace(/\D/g, '').slice(0, 4);
}

export default function MobileVerify<TResult>({
  initialMobile = '',
  autoSend = false,
  alreadyVerified = false,
  verifyLabel = 'Verify code',
  sendCode,
  verifyCode,
  onVerified,
}: MobileVerifyProps<TResult>) {
  const [mobile, setMobile] = useState(sanitizeMobile(initialMobile));
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(alreadyVerified);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState('');

  const autoSent = useRef(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const requestOtp = useCallback(async (target: string) => {
    setSending(true);
    setError('');
    try {
      const result = (await sendCode(target)) as { cooldownSeconds: number };
      setSent(true);
      setOtp('');
      setCooldown(result.cooldownSeconds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the code');
    } finally {
      setSending(false);
    }
  }, [sendCode]);

  useEffect(() => {
    if (!autoSend || autoSent.current || verified) return;
    if (!/^\d{10}$/.test(initialMobile)) return;
    autoSent.current = true;
    void requestOtp(sanitizeMobile(initialMobile));
  }, [autoSend, initialMobile, requestOtp, verified]);

  async function handleVerify() {
    setVerifying(true);
    setError('');
    try {
      const result = await verifyCode(mobile, otp);
      setVerified(true);
      onVerified(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not verify the code');
    } finally {
      setVerifying(false);
    }
  }

  const masked = mobile.length === 10 ? `${mobile.slice(0, 5)} ${mobile.slice(5)}` : mobile;

  if (verified) {
    return (
      <div className="mv-root">
        <style>{css}</style>
        <div className="mv-verified">
          <span className="mv-verified-tick" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <span className="mv-verified-text">
            <strong>+91 {masked}</strong>
            <small>Verified. Mock reminders and daily streaks land here.</small>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mv-root">
      <style>{css}</style>

      <label className="mv-label" htmlFor="mv-mobile">Mobile number</label>
      <div className="mv-phone">
        <span className="mv-cc">+91</span>
        <input
          id="mv-mobile"
          className="mv-input"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="98765 43210"
          value={mobile}
          maxLength={10}
          disabled={sent}
          onChange={(e) => {
            setMobile(sanitizeMobile(e.target.value));
            setError('');
          }}
        />
        {sent && (
          <button type="button" className="mv-link" onClick={() => { setSent(false); setOtp(''); setError(''); }}>
            Change
          </button>
        )}
      </div>

      {!sent ? (
        <button
          type="button"
          className="mv-send"
          onClick={() => requestOtp(mobile)}
          disabled={sending || mobile.length !== 10}
        >
          {sending ? 'Sending code…' : 'Send OTP'}
        </button>
      ) : (
        <>
          <p className="mv-hint">We sent a 4-digit code to +91 {masked}.</p>
          <label className="mv-label" htmlFor="mv-otp">Enter the code</label>
          <input
            id="mv-otp"
            className="mv-input mv-otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="••••"
            value={otp}
            maxLength={4}
            onChange={(e) => {
              setOtp(sanitizeOtp(e.target.value));
              setError('');
            }}
          />
          <div className="mv-row">
            <button
              type="button"
              className="mv-send mv-send-inline"
              onClick={handleVerify}
              disabled={verifying || otp.length !== 4}
            >
              {verifying ? 'Verifying…' : verifyLabel}
            </button>
            <button
              type="button"
              className="mv-link"
              onClick={() => requestOtp(mobile)}
              disabled={sending || cooldown > 0}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
            </button>
          </div>
        </>
      )}

      {error && <p role="alert" className="mv-error">{error}</p>}
    </div>
  );
}

const css = `
.mv-root{display:flex;flex-direction:column;gap:12px}
.mv-label{font-size:11.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:#003366}
.mv-phone{
  display:flex;align-items:center;gap:12px;padding:0 16px;border-radius:18px;
  background:#fff;border:2.5px solid #003366;box-shadow:0 5px 0 #C6D2F8;
  transition:box-shadow .15s;
}
.mv-phone:focus-within{box-shadow:0 7px 0 #C6D2F8}
.mv-cc{font-weight:800;font-size:15px;color:#3C4A8A;padding:14px 12px 14px 0;border-right:1.5px solid #C6D2F8}
.mv-input{
  flex:1;min-width:0;border:0;outline:0;background:transparent;font-family:inherit;
  font-size:17px;font-weight:700;color:#003366;padding:15px 0;letter-spacing:.04em;
}
.mv-input::placeholder{color:#9AA6D8;font-weight:600;letter-spacing:0}
.mv-input:disabled{opacity:.65}
.mv-otp{
  width:100%;flex:none;text-align:center;font-size:26px;font-weight:800;letter-spacing:.6em;
  text-indent:.6em;padding:12px 0;border-radius:18px;background:#fff;
  border:2.5px solid #003366;box-shadow:0 5px 0 #C6D2F8;
}
.mv-otp::placeholder{letter-spacing:.3em;text-indent:.3em}
.mv-hint{font-size:13.5px;font-weight:600;color:#3C4A8A;line-height:1.5}
.mv-row{display:flex;align-items:center;gap:16px;flex-wrap:wrap}
.mv-send{
  display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 24px;
  border-radius:16px;border:0;cursor:pointer;color:#fff;
  background:linear-gradient(135deg,#803688 0%,#A24BA8 100%);
  font-weight:800;font-size:15px;box-shadow:0 5px 0 #5A2560;
  transition:transform .15s,box-shadow .15s;
}
.mv-send:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 7px 0 #5A2560}
.mv-send:active:not(:disabled){transform:translateY(3px);box-shadow:0 2px 0 #5A2560}
.mv-send:disabled{opacity:.6;cursor:not-allowed;box-shadow:0 5px 0 #5A2560}
.mv-send-inline{min-height:44px;padding:0 20px;font-size:14.5px}
.mv-link{
  background:none;border:0;padding:4px 0;cursor:pointer;color:#803688;
  font-weight:800;font-size:13.5px;text-decoration:underline;text-underline-offset:3px;
}
.mv-link:hover:not(:disabled){color:#5A2560}
.mv-link:disabled{color:#3C4A8A;opacity:.65;cursor:not-allowed;text-decoration:none}
.mv-error{
  background:#FDE6E8;color:#C0283A;border-left:5px solid #C0283A;border-radius:10px;
  padding:11px 14px;font-weight:700;font-size:13.5px;overflow-wrap:anywhere;
}
.mv-verified{
  display:flex;align-items:center;gap:13px;padding:15px 16px;border-radius:18px;
  background:#EEF2FF;border:2.5px solid #803688;
}
.mv-verified-tick{
  display:grid;place-items:center;width:32px;height:32px;flex-shrink:0;border-radius:50%;
  background:#803688;color:#fff;
}
.mv-verified-text{display:flex;flex-direction:column;gap:3px;min-width:0}
.mv-verified-text strong{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:16px;color:#003366}
.mv-verified-text small{font-size:13px;font-weight:600;color:#3C4A8A;line-height:1.4}
@media(max-width:600px){
  .mv-otp{font-size:22px;letter-spacing:.45em;text-indent:.45em}
}
`;
