import { describe, it, expect, beforeEach } from 'vitest';
import { setSession, getUser, clearSession, isAuthenticated, shouldRefresh, setSessionExpiry } from './auth';

const user = { id: 'u1', name: 'Ada', email: 'ada@example.com', class: '12', targetExam: 'Main', currentLevel: 'beginner' } as const;
const inHours = (h: number) => new Date(Date.now() + h * 3600_000).toISOString();

describe('session storage', () => {
  beforeEach(() => localStorage.clear());

  it('stores the user and expiry, never a token', () => {
    setSession(user as never, inHours(24));
    expect(getUser()?.email).toBe('ada@example.com');
    const everything = JSON.stringify({ ...localStorage });
    expect(everything).not.toMatch(/eyJ|token/i);
  });

  it('is authenticated while within the 7-day refresh grace period, and logged out beyond it', () => {
    setSession(user as never, inHours(24));
    expect(isAuthenticated()).toBe(true);
    // 1 hour past token expiry is still within 7-day refresh grace window
    setSession(user as never, inHours(-1));
    expect(isAuthenticated()).toBe(true);
    // 8 days past expiry is beyond the 7-day grace period
    setSession(user as never, inHours(-192));
    expect(isAuthenticated()).toBe(false);
  });

  it('treats an older build session (no expiry) as signed out', () => {
    localStorage.setItem('jee_user', JSON.stringify(user));
    localStorage.setItem('jee_token', 'legacy-token');
    expect(isAuthenticated()).toBe(false);
  });

  it('removes the legacy jee_token when a new session starts', () => {
    localStorage.setItem('jee_token', 'legacy-token');
    setSession(user as never, inHours(24));
    expect(localStorage.getItem('jee_token')).toBeNull();
  });

  it('clearSession removes everything', () => {
    setSession(user as never, inHours(24));
    clearSession();
    expect(getUser()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });
});

describe('renewal', () => {
  beforeEach(() => localStorage.clear());

  it('asks for renewal within an hour of expiry only', () => {
    setSessionExpiry(inHours(0.5));
    expect(shouldRefresh()).toBe(true);
    setSessionExpiry(inHours(5));
    expect(shouldRefresh()).toBe(false);
  });

  it('renews a session within the 7-day grace period, but not after 7 days', () => {
    setSessionExpiry(inHours(-1));
    expect(shouldRefresh()).toBe(true);
    setSessionExpiry(inHours(-192));
    expect(shouldRefresh()).toBe(false);
  });
});
