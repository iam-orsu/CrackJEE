'use client';

import type { User } from '@/types';

/*
 * The session token lives in an HttpOnly cookie set by the server. Scripts cannot read it, so it is not stored here.
 * This module keeps only what the page needs: the signed-in user and when the cookie expires.
 * A request the server rejects with 401 ends the session (see api.ts), so a stale local copy cannot hide that.
 */
const USER_KEY = 'jee_user';
const EXPIRES_KEY = 'jee_session_expires';
// Earlier builds kept the token here. Remove it so it is never left behind.
const LEGACY_TOKEN_KEY = 'jee_token';

export function getUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setSession(user: User, expiresAt: string): void {
  try {
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(EXPIRES_KEY, expiresAt);
  } catch {
    // Storage blocked (private mode): the cookie still works, pages just cannot show the user
  }
}

export function setSessionExpiry(expiresAt: string): void {
  try {
    localStorage.setItem(EXPIRES_KEY, expiresAt);
  } catch {
    // Storage blocked
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRES_KEY);
  } catch {
    // Storage blocked
  }
}

function expiryTime(): number | null {
  try {
    const raw = localStorage.getItem(EXPIRES_KEY);
    if (!raw) return null;
    const t = Date.parse(raw);
    return Number.isNaN(t) ? null : t;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  // Sessions from older builds have no expiry time, so they are treated as signed out and must sign in again
  const exp = expiryTime();
  if (exp === null || exp <= Date.now()) {
    clearSession();
    return false;
  }
  return getUser() !== null;
}

/** True when the session is within an hour of expiring, so the page should renew it. */
export function shouldRefresh(): boolean {
  const exp = expiryTime();
  if (exp === null) return false;
  const now = Date.now();
  if (exp <= now) return false;
  return exp < now + 60 * 60 * 1000;
}
