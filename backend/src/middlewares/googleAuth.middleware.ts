import type { Request, Response } from 'express';
import { GOOGLE_CONSTANTS } from '../config/constants';
import { isCookieSecure } from '../config/env';

export const GOOGLE_STATE_COOKIE = GOOGLE_CONSTANTS.STATE_COOKIE;
export const GOOGLE_STATE_COOKIE_MAX_AGE_S = GOOGLE_CONSTANTS.STATE_TTL_SECONDS;

function stateCookieFlags(maxAgeSeconds: number): string {
  const secure = isCookieSecure() ? ' Secure;' : '';
  return `Path=/api/v1; HttpOnly;${secure} SameSite=Lax; Max-Age=${maxAgeSeconds}`;
}

export function setGoogleStateCookie(res: Response, nonce: string): void {
  res.append('Set-Cookie', `${GOOGLE_STATE_COOKIE}=${nonce}; ${stateCookieFlags(GOOGLE_STATE_COOKIE_MAX_AGE_S)}`);
}

export function clearGoogleStateCookie(res: Response): void {
  res.append('Set-Cookie', `${GOOGLE_STATE_COOKIE}=; ${stateCookieFlags(0)}`);
}

export function readGoogleStateCookie(req: Request): string | null {
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const [name, ...value] = part.trim().split('=');
    if (name === GOOGLE_STATE_COOKIE && value.length > 0) {
      return decodeURIComponent(value.join('='));
    }
  }
  return null;
}
