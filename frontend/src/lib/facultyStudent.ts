import type { DiagramTemplate } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export interface FacultyStudentUser {
  id: string;
  name: string;
  rollNumber: string;
  email?: string | null;
  batch: {
    id: string;
    name: string;
    code: string;
  };
  institute: {
    id: string;
    name: string;
  };
}

export interface StudentExamCard {
  id: string;
  title: string;
  instructions?: string | null;
  durationMinutes: number;
  startTime: string | null;
  endTime: string | null;
  showSolutions: boolean;
  paper: {
    id: string;
    title: string;
    examType: string;
    questionCount: number;
    difficulty: string;
  };
  facultyName: string;
  status: 'not_started' | 'in_progress' | 'submitted';
  isUpcoming?: boolean;
  isExpired?: boolean;
  result?: {
    totalScore: number;
    maxScore: number;
    correctCount: number;
    incorrectCount: number;
    unattemptedCount: number;
    submittedAt: string | null;
  } | null;
}

export interface StudentExamQuestion {
  number: number;
  subject: string;
  topic: string;
  difficulty?: string;
  questionType: string;
  questionText: string;
  options: string[];
  diagram: DiagramTemplate | null;
}

export interface StudentExamSession {
  examSessionId: string;
  assignmentId: string;
  title: string;
  instructions?: string | null;
  durationMinutes: number;
  examType: string;
  questionCount: number;
  questions: StudentExamQuestion[];
  savedAnswers: Record<string, string>;
  timeTakenSeconds: number;
  startedAt: string | null;
}

export interface StudentExamSolutionItem extends StudentExamQuestion {
  studentAnswer: string | null;
  correctAnswer: string;
  explanation: string;
  isCorrect: boolean;
  score: number;
  maxScore: number;
}

export interface StudentExamResultData {
  assignment: {
    id: string;
    title: string;
    examType: string;
    showSolutions: boolean;
    batchName: string;
    facultyName: string;
  };
  scorecard: {
    rank: number;
    totalCandidates: number;
    totalScore: number;
    maxScore: number;
    correctCount: number;
    incorrectCount: number;
    unattemptedCount: number;
    timeTakenSeconds: number;
    submittedAt: string | null;
    resultBreakdown: Record<string, unknown> | null;
  };
  solutions: StudentExamSolutionItem[] | null;
}

export class StudentApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function studentFetch<T extends object>(path: string, init: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('faculty_student_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/faculty-student${path}`, {
    ...init,
    headers,
    credentials: 'same-origin',
  });

  const json = (await res.json().catch(() => ({ success: false, error: `HTTP ${res.status}` }))) as T & {
    success?: boolean;
    error?: string;
  };

  if (!res.ok || !json.success) {
    throw new StudentApiError(res.status, json.error ?? 'Request failed');
  }
  return json;
}

export async function studentLogin(identifier: string, password: string) {
  const res = await studentFetch<{
    token: string;
    student: FacultyStudentUser;
    expiresAt: string;
  }>('/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
  if (typeof window !== 'undefined' && res.token) {
    localStorage.setItem('faculty_student_token', res.token);
  }
  return res;
}

export async function studentLogout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('faculty_student_token');
  }
  try {
    await studentFetch<Record<string, never>>('/logout', { method: 'POST' });
  } catch {}
}

export async function studentMe() {
  return studentFetch<{ student: FacultyStudentUser }>('/me');
}

export async function studentListExams() {
  return studentFetch<{ exams: StudentExamCard[] }>('/exams');
}

export async function studentStartExam(id: string) {
  return studentFetch<StudentExamSession>(`/exams/${encodeURIComponent(id)}/start`, {
    method: 'POST',
  });
}

export async function studentSaveAnswers(
  id: string,
  answers: Record<string, string>,
  timeTakenSeconds: number,
) {
  return studentFetch<{ success: boolean; savedAt: string }>(
    `/exams/${encodeURIComponent(id)}/save`,
    {
      method: 'POST',
      body: JSON.stringify({ answers, timeTakenSeconds }),
    },
  );
}

export async function studentSubmitExam(
  id: string,
  answers: Record<string, string>,
  timeTakenSeconds: number,
) {
  return studentFetch<{
    success: boolean;
    totalScore: number;
    maxScore: number;
    correctCount: number;
    incorrectCount: number;
    unattemptedCount: number;
    accuracyPct: number;
  }>(`/exams/${encodeURIComponent(id)}/submit`, {
    method: 'POST',
    body: JSON.stringify({ answers, timeTakenSeconds }),
  });
}

export async function studentGetResult(id: string) {
  return studentFetch<StudentExamResultData>(`/exams/${encodeURIComponent(id)}/result`);
}
