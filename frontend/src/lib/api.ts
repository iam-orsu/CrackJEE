import { getToken, clearSession, shouldRefresh, setToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

let _refreshing = false;

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  // Silent background token renewal — skips for the refresh endpoint itself
  if (!_refreshing && path !== '/auth/refresh' && shouldRefresh()) {
    _refreshing = true;
    // Fire-and-forget: update token in background without blocking current request
    requestRaw<{ token: string }>('/auth/refresh', { method: 'POST' })
      .then(({ token }) => setToken(token))
      .catch(() => {})
      .finally(() => { _refreshing = false; });
  }

  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  // Session expired or token rejected — clear and redirect to login.
  // Login/register return 401 for a wrong password, so those errors must reach the form.
  if (res.status === 401 && !path.startsWith('/auth/')) {
    clearSession();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new ApiError(401, 'Session expired. Please log in again.');
  }

  const json = await res.json().catch(() => ({ success: false, error: `HTTP ${res.status}` })) as { success: boolean; data?: T; error?: string };

  if (!res.ok || !json.success) {
    throw new ApiError(res.status, json.error ?? 'Unknown error');
  }

  return json.data as T;
}

// Internal raw request used by the refresh path (avoids circular calls)
async function requestRaw<T>(path: string, options: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const json = await res.json() as { success: boolean; data?: T; error?: string };
  if (!res.ok || !json.success) throw new Error(json.error ?? 'Refresh failed');
  return json.data as T;
}

export type SplitTopics = Record<string, { class11: string[]; class12: string[] }>;

export const api = {
  auth: {
    register: (body: {
      name: string;
      email: string;
      password: string;
      class: string;
      targetExam: string;
      currentLevel: string;
    }) => request<{ token: string; user: import('@/types').User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

    login: (body: { email: string; password: string }) =>
      request<{ token: string; user: import('@/types').User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    me: () => request<import('@/types').User>('/auth/me'),

    refresh: () => request<{ token: string }>('/auth/refresh', { method: 'POST' }),
  },

  questions: {
    next: (params: {
      subject: string;
      topic: string;
      difficulty: string;
      examType: string;
      studentClass: string;
    }) => {
      const qs = new URLSearchParams(params as Record<string, string>).toString();
      return request<import('@/types').Question>(`/questions/next?${qs}`);
    },

    batch: (body: {
      selections: Array<{ subject: string; topic: string }>;
      difficulty: string;
      examType: string;
      studentClass: string;
      count: number;
    }) => request<import('@/types').Question[]>('/questions/batch', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

    bankStats: (examType?: string) =>
      request<{ total: number; bySubject: Record<string, number> }>(
        `/questions/bank-stats${examType ? `?examType=${examType}` : ''}`,
      ),

    papers: (body: {
      selections: Array<{ subject: string; topic: string }>;
      difficulty: string;
      examType: string;
      studentClass: string;
      perSubject: number;
      papers: number;
    }) => request<{ papers: import('@/types').PaperSet[]; possibleSets: string }>('/questions/papers', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

    claimPapers: (questionIds: string[]) => request<import('@/types').Question[]>('/questions/papers/claim', {
      method: 'POST',
      body: JSON.stringify({ questionIds }),
    }),

    topics: (studentClass?: string, examMode?: 'JEE' | 'NEET') => {
      const params = new URLSearchParams();
      if (studentClass) params.set('studentClass', studentClass);
      if (examMode) params.set('examMode', examMode);
      const qs = params.toString();
      return request<SplitTopics>(`/questions/topics${qs ? `?${qs}` : ''}`);
    },
  },

  answers: {
    submit: (body: { questionId: string; answer: string; timeSpent: number }) =>
      request<import('@/types').AnswerResult>('/answers/submit', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },

  dashboard: {
    data: () => request<import('@/types').DashboardData>('/user/dashboard'),
  },

  progress: {
    weakAreas: () => request<import('@/types').TopicProgress[]>('/progress/weak-areas'),
  },

  mock: {
    start: (body: { examType: 'Main' | 'Advanced' | 'NEET'; difficultyMode?: 'easy' | 'medium' | 'hard' }) =>
      request<{ id: string; status: string }>('/mock/start', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    get: (id: string) =>
      request<import('@/types').MockExam>(`/mock/${id}`),

    begin: (id: string) =>
      request<{ startedAt: string }>(`/mock/${id}/begin`, { method: 'POST' }),

    saveAnswer: (id: string, body: { mockQuestionId: string; answer: string; markedForReview?: boolean }) =>
      request<void>(`/mock/${id}/answer`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    submit: (id: string) =>
      request<{ resultId: string }>(`/mock/${id}/submit`, { method: 'POST' }),

    result: (id: string) =>
      request<import('@/types').MockResultData>(`/mock/${id}/result`),

    history: () =>
      request<import('@/types').MockHistoryItem[]>('/mock/history'),

    cancel: (id: string) =>
      request<void>(`/mock/${id}`, { method: 'DELETE' }),
  },
};

export { ApiError };
