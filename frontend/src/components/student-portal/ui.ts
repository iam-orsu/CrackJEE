/**
 * The student portal repeats a handful of surfaces and controls across its
 * four screens, so their classes live here and every instance stays identical.
 */

type ClassValue = string | false | null | undefined;
export const cx = (...parts: ClassValue[]) => parts.filter(Boolean).join(' ');

export const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-accent focus-visible:outline-offset-[3px]';

/* ── Surfaces ── */
export const CARD =
  'rounded-[24px] border border-[#003366]/10 bg-white p-5 shadow-[0_20px_48px_-38px_rgba(0,51,102,.5)] sm:p-6';
export const CARD_INTERACTIVE =
  'rounded-[24px] border border-[#003366]/10 bg-white p-5 shadow-[0_20px_48px_-38px_rgba(0,51,102,.5)] transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_26px_52px_-36px_rgba(0,51,102,.55)] motion-reduce:transition-none sm:p-6';
export const EMPTY =
  'rounded-[24px] border border-dashed border-[#003366]/20 bg-white px-5 py-9 text-center text-[13.5px] font-medium text-[#5A6B8C]';

/* ── Controls ── */
export const BUTTON_PRIMARY =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-[#5A2560] bg-grad px-4 py-2.5 text-[13.5px] font-extrabold text-white no-underline shadow-[0_5px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_7px_0_#5A2560] active:translate-y-[4px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none';
export const BUTTON_SECONDARY =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-[#003366] bg-white px-3.5 py-2.5 text-[13.5px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none';
export const BUTTON_QUIET =
  'cursor-pointer rounded-[12px] border-0 bg-transparent px-2.5 py-1.5 text-[12.5px] font-bold text-[#5A6B8C] transition-colors duration-150 hover:bg-ice hover:text-[#003366] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none';

export const LABEL = 'text-[12.5px] font-extrabold text-[#003366]';
export const INPUT =
  'h-[52px] w-full rounded-[14px] border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_5px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_7px_0_#E3C9E6] motion-reduce:transition-none';

/* ── Chips ── */
const CHIP = 'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-bold tracking-[0.03em]';
export const CHIP_SUBJECT = `${CHIP} bg-ice text-[#003366]`;
export const CHIP_ACCENT = `${CHIP} bg-accent-50 text-accent`;
export const CHIP_READY = `${CHIP} bg-[#EAF7EF] text-[#146C33]`;
export const CHIP_PROGRESS = `${CHIP} bg-[#FEF3C7] text-[#B45309]`;
export const CHIP_SCHEDULED = `${CHIP} bg-ice text-[#31407F]`;

export const ERROR_BANNER =
  'rounded-[14px] border-l-[5px] border-[#C8202F] bg-[#FDE6E8] px-3.5 py-3 text-[13px] font-bold text-[#C8202F]';
