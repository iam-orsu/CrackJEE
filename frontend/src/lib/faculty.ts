import type { DiagramTemplate } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export type FacultyExamType = 'Main' | 'Advanced' | 'NEET';
export type FacultyDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'mixed';
export type FacultyQuestionType = 'mcq_single' | 'mcq_multi' | 'integer';
export type FacultyQuestionTypePref = 'auto' | FacultyQuestionType;
export type PrintMode = 'questions' | 'solutions' | 'key';

export interface FacultyUser {
  id?: string;
  facultyId?: string;
  name: string;
  email: string;
}

export interface FacultyPaperSelection {
  subject: 'Physics' | 'Chemistry' | 'Mathematics' | 'Botany' | 'Zoology';
  topic: string;
}

export interface FacultyPaperItem {
  number: number;
  subject: 'Physics' | 'Chemistry' | 'Mathematics' | 'Botany' | 'Zoology';
  topic: string;
  questionType: FacultyQuestionType;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  diagram: DiagramTemplate | null;
  verified: boolean;
  editedByFaculty?: boolean;
}

export interface FacultyPaperSummary {
  id: string;
  paperCode: string;
  title: string;
  examType: FacultyExamType;
  difficulty: FacultyDifficulty;
  questionCount: number;
  selections: FacultyPaperSelection[];
  status: 'generating' | 'ready' | 'error';
  verifiedCount: number;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FacultyPaper extends FacultyPaperSummary {
  items: FacultyPaperItem[];
}

export class FacultyError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function facultyFetch<T extends object>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}/faculty${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers as Record<string, string> | undefined) },
    credentials: 'same-origin',
  });

  const json = (await res.json().catch(() => ({ success: false, error: `HTTP ${res.status}` }))) as T & {
    success?: boolean;
    error?: string;
  };

  if (!res.ok || !json.success) {
    throw new FacultyError(res.status, json.error ?? 'Request failed');
  }
  return json;
}

export async function facultyLogin(email: string, password: string) {
  return facultyFetch<{ faculty: FacultyUser; expiresAt: string }>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function facultyLogout() {
  return facultyFetch<Record<string, never>>('/logout', { method: 'POST' });
}

export async function facultyMe() {
  return facultyFetch<{ faculty: FacultyUser }>('/me');
}

export async function facultyGetTopics(examType: FacultyExamType) {
  return facultyFetch<{ examType: FacultyExamType; subjects: string[]; topics: Record<string, string[]> }>(
    `/topics?examType=${encodeURIComponent(examType)}`,
  );
}

export async function facultyListPapers() {
  return facultyFetch<{ papers: FacultyPaperSummary[] }>('/papers');
}

export async function facultyCreatePaper(input: {
  title?: string;
  examType: FacultyExamType;
  difficulty: FacultyDifficulty;
  questionCount: number;
  questionType?: FacultyQuestionTypePref;
  selections: FacultyPaperSelection[];
}) {
  return facultyFetch<{ paper: FacultyPaper }>('/papers', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function facultyGetPaper(id: string) {
  return facultyFetch<{ paper: FacultyPaper }>(`/papers/${encodeURIComponent(id)}`);
}

export async function facultyUpdateQuestion(
  paperId: string,
  number: number,
  patch: {
    questionText?: string;
    options?: string[];
    correctAnswer?: string;
    explanation?: string;
    removeDiagram?: boolean;
  },
) {
  return facultyFetch<{ paper: FacultyPaper }>(`/papers/${encodeURIComponent(paperId)}/questions/${number}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

export async function facultyRegenerateQuestion(paperId: string, number: number) {
  return facultyFetch<{ paper: FacultyPaper }>(
    `/papers/${encodeURIComponent(paperId)}/questions/${number}/regenerate`,
    { method: 'POST' },
  );
}

export async function facultyDeleteQuestion(paperId: string, number: number) {
  return facultyFetch<{ paper: FacultyPaper }>(
    `/papers/${encodeURIComponent(paperId)}/questions/${number}`,
    { method: 'DELETE' },
  );
}

export async function facultyGenerateDraftQuestion(
  paperId: string,
  input: {
    subject: FacultyPaperItem['subject'];
    topic: string;
    questionType?: FacultyQuestionType;
  },
) {
  return facultyFetch<{ candidate: FacultyPaperItem }>(
    `/papers/${encodeURIComponent(paperId)}/draft-question`,
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  );
}

export async function facultyAcceptDraftQuestion(
  paperId: string,
  targetNumber: number | null,
  candidate: FacultyPaperItem,
) {
  const path = targetNumber !== null
    ? `/papers/${encodeURIComponent(paperId)}/questions/${targetNumber}/accept`
    : `/papers/${encodeURIComponent(paperId)}/questions/accept`;
  return facultyFetch<{ paper: FacultyPaper }>(path, {
    method: 'POST',
    body: JSON.stringify({
      subject: candidate.subject,
      topic: candidate.topic,
      questionType: candidate.questionType,
      questionText: candidate.questionText,
      options: candidate.options,
      correctAnswer: candidate.correctAnswer,
      explanation: candidate.explanation,
      diagram: candidate.diagram,
      verified: candidate.verified,
    }),
  });
}

export async function facultyDeletePaper(id: string) {
  return facultyFetch<Record<string, never>>(`/papers/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
