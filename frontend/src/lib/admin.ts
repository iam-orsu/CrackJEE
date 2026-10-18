'use client';

// Super admin session. Kept in sessionStorage so it ends when the browser tab closes.
const ADMIN_TOKEN_KEY = 'jee_admin_token';
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';

export class AdminError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export interface AdminStudent {
  id: string;
  name: string;
  email: string;
  class: string;
  targetExam: string;
  joinedAt: string;
  practiceAttempts: number;
  practiceAccuracy: number;
  mockSubmitted: number;
  lastActive: string | null;
}

export interface AdminStats {
  totals: {
    registered: number;
    tookAnyExam: number;
    tookPractice: number;
    practiceAttempts: number;
    practiceAccuracy: number;
    tookMock: number;
    mockSubmissions: number;
    avgMockPercent: number | null;
  };
  signupsByDay: Array<{ date: string; count: number }>;
  bank: { total: number; bySubject: Record<string, number> };
  students: AdminStudent[];
}

export function getAdminToken(): string | null {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string): void {
  try {
    sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  } catch {
    // Storage blocked
  }
}

export function clearAdminToken(): void {
  try {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // Storage blocked
  }
}

export async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/admin${path}`, { ...init, headers });
  const json = (await res.json().catch(() => ({ success: false, error: `HTTP ${res.status}` }))) as {
    success: boolean;
    data?: T;
    error?: string;
  };

  if (!res.ok || !json.success) {
    throw new AdminError(res.status, json.error ?? 'Request failed');
  }
  return json.data as T;
}
