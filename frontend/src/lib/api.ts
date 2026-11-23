import { clearSession, shouldRefresh, setSessionExpiry } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

let _refreshPromise: Promise<boolean> | null = null;

async function getOrInitRefresh(): Promise<boolean> {
  if (_refreshPromise) return _refreshPromise;
  _refreshPromise = (async () => {
    try {
      const res = await requestRaw<{ expiresAt: string }>('/auth/refresh', { method: 'POST' });
      if (res?.expiresAt) {
        setSessionExpiry(res.expiresAt);
      }
      return true;
    } catch {
      return false;
    } finally {
      _refreshPromise = null;
    }
  })();
  return _refreshPromise;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  // Silent proactive session renewal when approaching expiration
  if (!_refreshPromise && path !== '/auth/refresh' && shouldRefresh()) {
    void getOrInitRefresh();
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Same-origin request: the browser sends the HttpOnly session cookie by itself
  let res = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: 'same-origin' });

  // If 401 occurs, attempt single-flight refresh and retry
  if (res.status === 401 && !path.startsWith('/auth/')) {
    const refreshed = await getOrInitRefresh();
    if (refreshed) {
      res = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: 'same-origin' });
    }
  }

  // Session expired or token rejected — clear and redirect to login unless actively in an examination
  if (res.status === 401 && !path.startsWith('/auth/')) {
    const isExamSession = typeof window !== 'undefined' && (
      window.location.pathname.includes('/mock/') ||
      window.location.pathname.includes('/student/exam/')
    );

    if (!isExamSession) {
      clearSession();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
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
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const res = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: 'same-origin' });
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
      hasPsychometric?: boolean;
      currentLevel: string;
      mobile: string;
    }) => request<{ user: import('@/types').User; expiresAt: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

    login: (body: { email: string; password: string }) =>
      request<{ user: import('@/types').User; expiresAt: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    me: () => request<import('@/types').User>('/auth/me'),

    session: () =>
      request<{ user: import('@/types').User; expiresAt: string }>('/auth/session'),

    updateProfile: (body: { class?: string; targetExam?: string }) =>
      request<import('@/types').User>('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    completeOnboarding: (body: {
      class: string;
      targetExam: string;
      currentLevel?: string;
      hasPsychometric?: boolean;
    }) =>
      request<import('@/types').User>('/auth/onboarding', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    googleUrl: (redirectTo = '/auth/google') =>
      `${API_URL}/auth/google/start?redirect=${encodeURIComponent(redirectTo)}`,

    refresh: () => request<{ expiresAt: string }>('/auth/refresh', { method: 'POST' }),

    // Revokes the session on the server and clears the cookie
    logout: () => request<void>('/auth/logout', { method: 'POST' }),
  },

  otp: {
    send: (body: { mobile: string }) =>
      request<{ sent: boolean; expiresIn: number; cooldownSeconds: number }>('/auth/otp/send', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    verify: (body: { mobile: string; otp: string }) =>
      request<import('@/types').User>('/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    sendForRegistration: (body: { mobile: string }) =>
      request<{ sent: boolean; expiresIn: number; cooldownSeconds: number }>('/auth/register/otp/send', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    verifyForRegistration: (body: { mobile: string; otp: string }) =>
      request<{ verified: boolean; mobile: string }>('/auth/register/otp/verify', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    sendEmailForRegistration: (body: { email: string }) =>
      request<{ sent: boolean; expiresIn: number; cooldownSeconds: number }>('/auth/register/email-otp/send', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    verifyEmailForRegistration: (body: { email: string; otp: string }) =>
      request<{ verified: boolean; email: string }>('/auth/register/email-otp/verify', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    registrationStatus: (body: { email: string; mobile: string }) =>
      request<{ emailVerified: boolean; mobileVerified: boolean }>('/auth/register/status', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    sendEmail: (body: { email: string }) =>
      request<{ sent: boolean; expiresIn: number; cooldownSeconds: number }>('/auth/email-otp/send', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    verifyEmail: (body: { email: string; otp: string }) =>
      request<import('@/types').User>('/auth/email-otp/verify', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },

  psychometric: {
    getCards: () =>
      request<
        Array<{
          id: string;
          name: string;
          description: string;
          subtopics: string[];
          frameworks?: string[];
          bestFor: string;
          badge: string;
          estimatedMinutes: number;
        }>
      >('/psychometric/cards'),

    startCardSession: (body: {
      cardId?: string;
      cardIds?: string[];
      profile: {
        age: number;
        professionStatus: 'student' | 'employed' | 'job_seeker';
        studentLevel?: 'school' | 'intermediate' | 'ug' | 'pg';
        schoolClass?: 'class_4' | 'class_5' | 'class_6' | 'class_7' | 'class_8' | 'class_9' | 'class_10';
        stream?: string;
        jobTitle?: string;
        companyType?: string;
        highestQualification?: string;
        targetRole?: string;
      };
    }) =>
      request<{
        session: { id: string; status: string; currentSection: string };
        exam: {
          id: string;
          cardId?: string;
          title: string;
          description: string;
          generatedByAi: boolean;
          sections: Array<{
            id: string;
            name: string;
            description: string;
            timeLimitSeconds?: number;
            items: Array<{
              id: string;
              section: string;
              construct: string;
              subFacet?: string;
              itemType: string;
              scenarioText?: string;
              promptText: string;
              options?: Array<{ id: string; text: string }>;
              correctAnswer?: string;
              isReverseKeyed?: boolean;
              orderIndex: number;
            }>;
          }>;
        };
        card: {
          id: string;
          name: string;
          description: string;
          subtopics: string[];
          bestFor: string;
          badge: string;
          estimatedMinutes: number;
        };
        answeredCount: number;
      }>('/psychometric/session/card', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    getHistory: () =>
      request<
        Array<{
          sessionId: string;
          cardId: string;
          completedAt: string;
          cognitivePercentile: number;
          summary: string | null;
          whatYouCanBecome: Array<{
            role: string;
            field: string;
            matchPct: number;
            whyYouFit: string;
          }>;
          coreStrengths: string[];
        }>
      >('/psychometric/history'),

    getSession: (targetExam?: string) =>
      request<{
        session: { id: string; status: string; currentSection: string };
        exam: {
          id: string;
          title: string;
          description: string;
          generatedByAi: boolean;
          sections: Array<{
            id: string;
            name: string;
            description: string;
            timeLimitSeconds?: number;
            items: Array<{
              id: string;
              section: string;
              construct: string;
              subFacet?: string;
              itemType: string;
              scenarioText?: string;
              promptText: string;
              options?: Array<{ id: string; text: string }>;
              correctAnswer?: string;
              isReverseKeyed?: boolean;
              orderIndex: number;
            }>;
          }>;
        };
        answeredCount: number;
      }>(`/psychometric/session${targetExam ? `?targetExam=${encodeURIComponent(targetExam)}` : ''}`),

    getActiveSession: () =>
      request<{
        active: boolean;
        session?: { id: string; currentSection: string; status: string; createdAt: string };
        answeredCount?: number;
        answers?: Record<string, string>;
      }>('/psychometric/active-session'),

    discardSession: (sessionId?: string) =>
      request<{ success: boolean }>('/psychometric/session/discard', {
        method: 'POST',
        body: JSON.stringify({ sessionId }),
      }),

    saveAnswer: (body: {
      sessionId: string;
      item: Record<string, unknown>;
      answer: string;
      timeSpentMs?: number;
    }) => request<{ id: string; answer: string; score: number }>('/psychometric/answer', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

    submit: (sessionId: string) =>
      request<Record<string, unknown>>('/psychometric/submit', {
        method: 'POST',
        body: JSON.stringify({ sessionId }),
      }),

    getReport: () => request<Record<string, unknown> | null>('/psychometric/report'),
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
      selections: Array<{
        subject: string;
        topic: string;
        count?: number;
        mcqCount?: number;
        integerCount?: number;
        multiCount?: number;
        matrixCount?: number;
        beginnerCount?: number;
        intermediateCount?: number;
        advancedCount?: number;
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
        difficulty?: string;
        difficultyDistribution?: {
          beginner?: number;
          intermediate?: number;
          advanced?: number;
        };
      }>;
      difficulty: string;
      examType: string;
      studentClass: string;
      count: number;
      questionTypes?: {
        mcq_single?: number;
        mcq_multi?: number;
        integer?: number;
        matrix_match?: number;
      };
      difficultyDistribution?: {
        beginner?: number;
        intermediate?: number;
        advanced?: number;
      };
    }) => request<import('@/types').Question[]>('/questions/batch', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

    bankStats: (examType?: string) =>
      request<{ total: number; bySubject: Record<string, number> }>(
        `/questions/bank-stats${examType ? `?examType=${examType}` : ''}`,
      ),

    papers: (body: {
      selections: Array<{
        subject: string;
        topic: string;
        count?: number;
        mcqCount?: number;
        integerCount?: number;
        multiCount?: number;
        matrixCount?: number;
        beginnerCount?: number;
        intermediateCount?: number;
        advancedCount?: number;
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
      }>;
      difficulty: string;
      examType: string;
      studentClass: string;
      perSubject: number;
      page: number;
      questionTypes?: {
        mcq_single?: number;
        mcq_multi?: number;
        integer?: number;
        matrix_match?: number;
      };
      difficultyDistribution?: {
        beginner?: number;
        intermediate?: number;
        advanced?: number;
      };
    }) => request<{
      papers: import('@/types').PaperSet[];
      page: number;
      pageCount: number;
      available: number;
      possibleSets: string;
    }>('/questions/papers', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

    claimPapers: (questionIds: string[]) => request<import('@/types').Question[]>('/questions/papers/claim', {
      method: 'POST',
      body: JSON.stringify({ questionIds }),
    }),

    explain: (questionId: string, tier: 'better' | 'best') =>
      request<{ tier: 'better' | 'best'; explanation: string; cached: boolean }>(
        `/questions/${encodeURIComponent(questionId)}/explain`,
        {
          method: 'POST',
          body: JSON.stringify({ tier }),
        },
      ),

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

  stats: {
    mockWeakAreas: () => request<import('@/types').MockWeakTopic[]>('/stats/mock-weak-areas'),
    mockInsights: () => request<import('@/types').MockInsights>('/stats/mock-insights'),
    leaderboard: () => request<import('@/types').LeaderboardData>('/stats/leaderboard'),
  },

  mock: {
    insights: (id: string) => request<import('@/types').ExamInsights>(`/mock/${id}/insights`),
    explanation: (id: string, mockQuestionId: string) =>
      request<{ explanation: string }>(`/mock/${id}/questions/${mockQuestionId}/explanation`, { method: 'POST' }),
    start: (body: { examType: 'Main' | 'Advanced' | 'NEET'; difficultyMode?: 'easy' | 'medium' | 'hard'; paperNumber?: number }) =>
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

    submit: (id: string, questionTimes?: Record<string, number>) =>
      request<{ resultId: string }>(`/mock/${id}/submit`, {
        method: 'POST',
        body: JSON.stringify({ questionTimes: questionTimes ?? {} }),
      }),

    result: (id: string) =>
      request<import('@/types').MockResultData>(`/mock/${id}/result`),

    history: () =>
      request<import('@/types').MockHistoryItem[]>('/mock/history'),

    cancel: (id: string) =>
      request<void>(`/mock/${id}`, { method: 'DELETE' }),
  },
};

export { ApiError };
