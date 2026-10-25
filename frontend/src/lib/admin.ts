'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';

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

// The admin session is an HttpOnly cookie set by /api/admin/login. Nothing admin-related is kept in page storage.
export async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  const res = await fetch(`${API_URL}/admin${path}`, { ...init, headers, credentials: 'same-origin' });
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
