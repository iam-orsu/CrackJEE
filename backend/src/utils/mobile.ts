import { OTP_CONSTANTS } from '../config/constants';

export function normalizeMobile(input: string): string | null {
  const digits = (input ?? '').replace(/\D/g, '');

  let local = digits;
  if (digits.length === 12 && digits.startsWith(OTP_CONSTANTS.DEFAULT_COUNTRY_CODE)) {
    local = digits.slice(OTP_CONSTANTS.DEFAULT_COUNTRY_CODE.length);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    local = digits.slice(1);
  }

  if (local.length !== OTP_CONSTANTS.MOBILE_LENGTH) return null;
  if (!/^[6-9]/.test(local)) return null;

  return `${OTP_CONSTANTS.DEFAULT_COUNTRY_CODE}${local}`;
}

export function maskMobile(mobile: string): string {
  const normalised = normalizeMobile(mobile);
  if (!normalised) return mobile;
  const local = normalised.slice(OTP_CONSTANTS.DEFAULT_COUNTRY_CODE.length);
  return `+${OTP_CONSTANTS.DEFAULT_COUNTRY_CODE} ${local.slice(0, 5)} ${local.slice(5)}`;
}
