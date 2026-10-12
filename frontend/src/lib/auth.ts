'use client';

import type { User } from '@/types';

const TOKEN_KEY = 'jee_token';
const USER_KEY = 'jee_user';

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setSession(token: string, user: User): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // Storage blocked (private mode)
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // Storage blocked
  }
}

function decodeJwtExp(token: string): number | null {
  try {
    const b64 = token.split('.')[1]!.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(b64)) as { exp?: number };
    return payload.exp ?? null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  const exp = decodeJwtExp(token);
  if (exp && exp * 1000 < Date.now()) {
    clearSession();
    return false;
  }
  return !!exp;
}

export function shouldRefresh(): boolean {
  const token = getToken();
  if (!token) return false;
  const exp = decodeJwtExp(token);
  if (!exp) return false;
  const now = Date.now();
  if (exp * 1000 <= now) return false; // already expired — let the 401 handler redirect to login
  // Refresh if token expires within 60 minutes
  return exp * 1000 < now + 60 * 60 * 1000;
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Storage blocked
  }
}
