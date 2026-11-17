import type { DiagramTemplate } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export type FacultyExamType = 'Main' | 'Advanced' | 'NEET';
export type FacultyDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'mixed';
export type FacultyQuestionType = 'mcq_single' | 'mcq_multi' | 'integer' | 'matrix_match';
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
  mcqCount?: number;
  integerCount?: number;
  multiCount?: number;
  matrixCount?: number;
  mcqEasy?: number;
  mcqMedium?: number;
  mcqHard?: number;
  integerEasy?: number;
  integerMedium?: number;
  integerHard?: number;
  multiEasy?: number;
  multiMedium?: number;
  multiHard?: number;
  matrixEasy?: number;
  matrixMedium?: number;
  matrixHard?: number;
}

export interface FacultyPaperItem {
  number: number;
  subject: 'Physics' | 'Chemistry' | 'Mathematics' | 'Botany' | 'Zoology';
  topic: string;
  difficulty?: FacultyDifficulty;
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
  organization?: string | null;
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
  organization?: string;
  examType: FacultyExamType;
  difficulty: FacultyDifficulty;
  difficultyDistribution?: { beginner: number; intermediate: number; advanced: number };
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

export async function facultyDownloadPdf(id: string, mode: PrintMode = 'questions'): Promise<void> {
  const res = await fetch(`${API_URL}/faculty/papers/${encodeURIComponent(id)}/pdf?mode=${encodeURIComponent(mode)}`, {
    credentials: 'same-origin',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new FacultyError(res.status, err.error ?? `Failed to download PDF (${res.status})`);
  }

  const blob = await res.blob();
  const disposition = res.headers.get('content-disposition');
  let filename = `Paper-${mode}.pdf`;
  if (disposition) {
    const match = disposition.match(/filename="?([^";]+)"?/);
    if (match?.[1]) filename = match[1];
  }

  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(downloadUrl);
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

export interface FacultyBatch {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  createdAt: string;
  _count?: {
    students: number;
    assignments: number;
  };
}

export interface FacultyStudent {
  id: string;
  facultyId: string;
  batchId: string;
  name: string;
  rollNumber: string;
  email?: string | null;
  isActive: boolean;
  createdAt: string;
  batch?: {
    id: string;
    name: string;
    code: string;
  };
  _count?: {
    examSessions: number;
  };
}

export interface FacultyAssignmentSummary {
  id: string;
  title: string;
  durationMinutes: number;
  startTime: string | null;
  endTime: string | null;
  showSolutions: boolean;
  status: string;
  createdAt: string;
  paper: {
    id: string;
    title: string;
    examType: FacultyExamType;
    difficulty: FacultyDifficulty;
    questionCount: number;
  };
  batch: {
    id: string;
    name: string;
    code: string;
    totalStudents: number;
  };
  stats: {
    totalEnrolled: number;
    submittedCount: number;
    inProgressCount: number;
    avgScore: number;
  };
}

export interface FacultyStudentSubmission {
  assignment: {
    id: string;
    title: string;
    durationMinutes: number;
    paperTitle: string;
    examType: string;
  };
  student: {
    id: string;
    name: string;
    rollNumber: string;
    email: string | null;
    batchName: string;
    batchCode: string;
  };
  score: {
    totalScore: number;
    maxScore: number;
    correctCount: number;
    incorrectCount: number;
    unattemptedCount: number;
    timeTakenSeconds: number;
    submittedAt: string | null;
  };
  questions: Array<{
    number: number;
    subject: string;
    topic: string;
    questionType: string;
    difficulty: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
    studentAnswer: string | null;
    isCorrect: boolean;
    isSkipped: boolean;
    marksAwarded: number;
    explanation?: string | null;
  }>;
}

export interface FacultyAssignmentReport {
  assignment: {
    id: string;
    title: string;
    durationMinutes: number;
    startTime: string | null;
    endTime: string | null;
    showSolutions: boolean;
    batch: { id: string; name: string; code: string };
    paper: { id: string; title: string; examType: string; questionCount: number };
  };
  summary: {
    totalEnrolled: number;
    submittedCount: number;
    inProgressCount: number;
    highestScore: number;
    lowestScore: number;
    avgScore: number;
  };
  rankList: Array<{
    rank: number;
    studentId: string;
    name: string;
    rollNumber: string;
    totalScore: number;
    maxScore: number;
    timeTakenSeconds: number;
    correctCount: number;
    incorrectCount: number;
    unattemptedCount: number;
    submittedAt: string | null;
    resultBreakdown: Record<string, unknown> | null;
    personalWeakTopics?: Array<{ topic: string; mistakes: number }>;
  }>;
  questionAnalytics: Array<{
    questionNumber: number;
    subject: string;
    topic: string;
    questionType: string;
    difficulty: string;
    questionText?: string;
    options?: string[];
    correctAnswer?: string;
    explanation?: string | null;
    correctCount: number;
    wrongCount: number;
    skippedCount: number;
    accuracyPct: number;
    optionDistribution?: Record<string, number>;
    optionPercentages?: Record<string, number>;
  }>;
  topicAnalytics?: Array<{
    topic: string;
    subject: string;
    questionCount: number;
    questionNumbers: number[];
    totalAttempts: number;
    correctCount: number;
    wrongCount: number;
    skippedCount: number;
    accuracyPct: number;
    marksLost?: number;
    negativeMarks?: number;
    isWeak: boolean;
    isStrong: boolean;
    questions: Array<{
      questionNumber: number;
      subject: string;
      topic: string;
      questionType: string;
      difficulty: string;
      questionText?: string;
      options?: string[];
      correctAnswer?: string;
      explanation?: string | null;
      correctCount: number;
      wrongCount: number;
      skippedCount: number;
      accuracyPct: number;
      optionDistribution?: Record<string, number>;
      optionPercentages?: Record<string, number>;
    }>;
  }>;
  revisionRecommendations?: {
    lackingTopics: Array<{
      topic: string;
      subject: string;
      accuracyPct: number;
      questionCount: number;
      wrongCount?: number;
      marksLost?: number;
    }>;
    topPerformingTopics: Array<{
      topic: string;
      subject: string;
      accuracyPct: number;
      questionCount: number;
      correctCount?: number;
    }>;
    recommendations: string[];
  };
}

// ── Batch API ──
export async function facultyListBatches() {
  return facultyFetch<{ batches: FacultyBatch[] }>('/batches');
}

export async function facultyCreateBatch(input: { name: string; code: string; description?: string }) {
  return facultyFetch<{ batch: FacultyBatch }>('/batches', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function facultyDeleteBatch(id: string) {
  return facultyFetch<Record<string, never>>(`/batches/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

// ── Student API ──
export async function facultyListStudents(batchId?: string) {
  const query = batchId ? `?batchId=${encodeURIComponent(batchId)}` : '';
  return facultyFetch<{ students: FacultyStudent[] }>(`/students${query}`);
}

export async function facultyCreateStudent(input: {
  batchId: string;
  name: string;
  rollNumber: string;
  email?: string;
  password?: string;
}) {
  return facultyFetch<{ student: FacultyStudent; initialPassword?: string }>('/students', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function facultyBulkCreateStudents(input: {
  batchId?: string;
  students: Array<{
    batchId?: string;
    batchCode?: string;
    batchName?: string;
    name: string;
    rollNumber: string;
    email?: string;
    password?: string;
  }>;
}) {
  return facultyFetch<{
    total: number;
    createdCount: number;
    errorCount: number;
    created: Array<{ id: string; name: string; rollNumber: string; batchId: string; email: string | null }>;
    errors: Array<{ row: number; rollNumber?: string; name?: string; error: string }>;
  }>('/students/bulk', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function facultyDeleteStudent(id: string) {
  return facultyFetch<Record<string, never>>(`/students/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

// ── Exam Assignments & Reports API ──
export async function facultyListAssignments() {
  return facultyFetch<{ assignments: FacultyAssignmentSummary[] }>('/assignments');
}

export async function facultyCreateAssignment(input: {
  paperId: string;
  batchId: string;
  title: string;
  instructions?: string;
  durationMinutes: number;
  startTime?: string | null;
  endTime?: string | null;
  showSolutions?: boolean;
}) {
  return facultyFetch<{ assignment: Record<string, unknown> }>('/assignments', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function facultyDeleteAssignment(id: string) {
  return facultyFetch<Record<string, never>>(`/assignments/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function facultyGetAssignmentReport(id: string) {
  return facultyFetch<{ report: FacultyAssignmentReport }>(`/assignments/${encodeURIComponent(id)}/report`);
}

export async function facultyGetStudentSubmission(assignmentId: string, studentId: string) {
  return facultyFetch<{ submission: FacultyStudentSubmission }>(
    `/assignments/${encodeURIComponent(assignmentId)}/submissions/${encodeURIComponent(studentId)}`,
  );
}
