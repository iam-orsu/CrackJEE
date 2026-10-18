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

export interface AdminPracticeAttempt {
  id: string;
  answeredAt: string;
  subject: string;
  topic: string;
  difficulty: string;
  questionType: string;
  examType: string;
  questionText: string;
  options: string[];
  answerSubmitted: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface AdminMockSummary {
  id: string;
  examType: string;
  difficultyMode: string;
  status: string;
  createdAt: string;
  submittedAt: string | null;
  result: {
    totalScore: number;
    maxScore: number;
    physicsScore: number;
    chemistryScore: number;
    mathScore: number;
    correct: number;
    incorrect: number;
    unattempted: number;
    timeTaken: number;
  } | null;
}

export interface AdminStudentDetail {
  student: {
    id: string;
    name: string;
    email: string;
    class: string;
    targetExam: string;
    currentLevel: string;
    joinedAt: string;
  };
  summary: { answered: number; correct: number; wrong: number; accuracy: number };
  topics: Array<{ subject: string; topic: string; attempts: number; correct: number; accuracy: number }>;
  practice: AdminPracticeAttempt[];
  mocks: AdminMockSummary[];
}

export interface AdminMockRow {
  questionNumber: number;
  subject: string;
  topic: string;
  difficulty: string;
  questionType: string;
  questionText: string;
  options: string[];
  submitted: string | null;
  correctAnswer: string;
  explanation: string;
  markedForReview: boolean;
  awarded: number | null;
  maxMarks: number | null;
}

export interface AdminMockDetail {
  exam: {
    id: string;
    examType: string;
    status: string;
    createdAt: string;
    submittedAt: string | null;
    studentName: string;
    studentEmail: string;
  };
  result: {
    totalScore: number;
    maxScore: number;
    correct: number;
    incorrect: number;
    unattempted: number;
    timeTaken: number;
  } | null;
  questions: AdminMockRow[];
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
