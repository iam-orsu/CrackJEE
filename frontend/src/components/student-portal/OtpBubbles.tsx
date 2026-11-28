'use client';

import { useEffect, useRef } from 'react';
import { cx } from './ui';

const LENGTH = 4;

/**
 * The onboarding code row, drawn as an OMR answer-sheet strip: four bubbles
 * with the question number beneath each, so the one rich element on the page
 * belongs to the exam world the product lives in.
 */
export default function OtpBubbles({
  value,
  onChange,
  onComplete,
  disabled,
  invalid,
  autoFocus,
}: {
  value: string;
  onChange: (next: string) => void;
  onComplete: (code: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  autoFocus?: boolean;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const chars = Array.from({ length: LENGTH }, (_, i) => value[i] ?? ' ');

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const fill = (next: string) => {
    onChange(next);
    if (next.length === LENGTH && !next.includes(' ')) onComplete(next);
  };

  function handleChange(i: number, raw: string) {
    const digits = raw.replace(/\D/g, '');
    if (!digits) {
      fill(value.slice(0, i) + ' ' + value.slice(i + 1));
      return;
    }
    fill(value.slice(0, i) + digits.slice(-1) + value.slice(i + 1));
    if (i < LENGTH - 1) refs.current[i + 1]?.focus();
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
    if (e.key === 'ArrowRight' && i < LENGTH - 1) {
      e.preventDefault();
      refs.current[i + 1]?.focus();
      return;
    }
    if (e.key === 'Enter' && value.length === LENGTH && !value.includes(' ')) {
      e.preventDefault();
      onComplete(value);
    }
  }

  function handlePaste(i: number, e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH - i);
    if (!digits) return;
    const next = (value.slice(0, i) + digits + value.slice(i + digits.length)).slice(0, LENGTH);
    fill(next);
    refs.current[Math.min(i + digits.length, LENGTH - 1)]?.focus();
  }

  return (
    <div className="flex items-start justify-center gap-3 sm:gap-5" role="group" aria-label="4-digit verification code">
      {chars.map((char, i) => {
        const filled = char !== ' ';
        return (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <input
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              value={filled ? char : ''}
              disabled={disabled}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={(e) => handlePaste(i, e)}
              aria-label={`Digit ${i + 1} of ${LENGTH}`}
              className={cx(
                'h-11 w-11 rounded-full border-[2.5px] text-center text-[17px] font-extrabold tabular-nums caret-transparent outline-none transition-[transform,box-shadow,background-color,border-color,color] duration-150 selection:bg-transparent motion-reduce:transition-none sm:h-14 sm:w-14 sm:text-[20px]',
                filled
                  ? 'scale-[1.03] border-[#003366] bg-[#003366] text-white'
                  : 'border-[#003366]/45 bg-white text-[#003366]',
                'shadow-[0_4px_0_#C6D2F8] focus:-translate-y-[2px] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6]',
                invalid && 'border-[#C0283A] shadow-[0_4px_0_#F3C3C8]',
                disabled && 'opacity-60',
              )}
              style={{ WebkitAppearance: 'none', appearance: 'none' }}
            />
            <span
              aria-hidden
              className={cx(
                'text-[10px] font-bold tabular-nums sm:text-[11px]',
                filled ? 'text-[#003366]' : 'text-[#97A3D4]',
              )}
            >
              {i + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
}
