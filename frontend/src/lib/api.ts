import { getToken, clearSession } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';

class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  // Session expired or token rejected — clear and redirect to login
  if (res.status === 401) {
    clearSession();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new ApiError(401, 'Session expired. Please log in again.');
  }

  const json = await res.json() as { success: boolean; data?: T; error?: string };

  if (!res.ok || !json.success) {
    throw new ApiError(res.status, json.error ?? 'Unknown error');
  }

  return json.data as T;
}

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

    topics: (subject?: string) => {
      const qs = subject ? `?subject=${subject}` : '';
      return request<Record<string, string[]>>(`/questions/topics${qs}`);
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
};

export { ApiError };
