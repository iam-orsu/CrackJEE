export interface User {
  id: string;
  name: string;
  email: string;
  class: '11' | '12' | 'Dropper';
  targetExam: 'Main' | 'Advanced' | 'Both' | 'NEET';
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  createdAt?: string;
}

export interface DiagramTemplate {
  template: 'inclined_plane' | 'simple_circuit' | 'lens_mirror' | 'energy_profile' | 'coordinate_geometry'
    | 'projectile_motion' | 'pulley_system' | 'wave_diagram' | 'capacitor_field' | 'pv_diagram'
    | 'triangle' | 'circle_geometry' | 'conic_section' | 'argand_plane'
    | 'molecular_geometry' | 'mo_diagram' | 'crystal_structure' | 'electrochemical_cell' | 'organic_structure';
  params: Record<string, unknown>;
}

export interface Question {
  id: string;
  topic: string;
  subject: string;
  questionText: string;
  questionType: 'mcq_single' | 'mcq_multi' | 'integer';
  options: string[];   // empty [] for integer type
  difficulty: string;
  examType: string;
  diagram?: DiagramTemplate | null;
}

export interface AnswerResult {
  isCorrect: boolean;
  correctAnswer: string;
  explanation?: string;
}

export interface TopicProgress {
  id: string;
  topicName: string;
  subject: string;
  attempts: number;
  correctCount: number;
  successRate: number;
  markedAsWeak: boolean;
  lastAttemptAt: string;
}

export interface WeeklyPoint {
  date: string;
  total: number;
  correct: number;
}

export interface SubjectAccuracy {
  subject: string;
  accuracy: number;
  attempts: number;
}

export interface DashboardData {
  stats: {
    totalAttempts: number;
    correctAttempts: number;
    accuracy: number;
  };
  weeklyStats: WeeklyPoint[];
  subjectAccuracy: SubjectAccuracy[];
}

export type Subject = 'Mathematics' | 'Physics' | 'Chemistry' | 'Botany' | 'Zoology';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

/* ── Question paper row (practice page) ───────────────────────── */

export interface PaperQuestion {
  id: string;
  topic: string;
  subject: string;
  questionText: string;
  questionType: 'mcq_single' | 'mcq_multi' | 'integer';
  options: string[];
  difficulty: string;
  diagram?: DiagramTemplate | null;
}

export interface PaperSet {
  number: number;
  questionIds: string[];
  questions: PaperQuestion[];
}

/* ── Mock exam types ─────────────────────────────────────────── */

export interface MockExamQuestion {
  mockQuestionId: string;
  questionId: string;
  questionNumber: number;
  subjectIndex: number;
  subject: string;
  savedAnswer: string | null;
  markedForReview: boolean;
  questionText: string;
  questionType: 'mcq_single' | 'mcq_multi' | 'integer';
  options: string[];
  topic: string;
  difficulty: string;
  diagram?: DiagramTemplate | null;
}

export interface MockExam {
  id: string;
  examType: 'Main' | 'Advanced' | 'NEET';
  difficultyMode?: string;
  status: 'generating' | 'ready' | 'in_progress' | 'submitted' | 'error';
  durationSeconds: number;
  startedAt: string | null;
  submittedAt: string | null;
  timeLeft?: number;
  questions: MockExamQuestion[];
}

export interface MockResultBreakdown {
  questionId: string;
  subject: string;
  submitted: string | null;
  correctAnswer: string;
  awarded: number;
  maxMarks: number;
  questionType: string;
  timeSpentSeconds?: number;
}

export interface MockExamResult {
  id: string;
  examId: string;
  totalScore: number;
  maxScore: number;
  physicsScore: number;
  chemistryScore: number;
  mathScore: number;
  biologyScore?: number;
  correct: number;
  partial: number;
  incorrect: number;
  unattempted: number;
  timeTaken: number;
  scoreBreakdown: Record<string, MockResultBreakdown>;
}

export interface MockResultData {
  exam: MockExam & {
    questions: Array<MockExamQuestion & {
      question: {
        id: string;
        questionText: string;
        questionType: string;
        options: string[];
        explanation: string;
        answer: string;
        subject: string;
        topic: string;
        difficulty: string;
      };
    }>;
    result: MockExamResult;
  };
  result: MockExamResult;
}

export interface MockHistoryItem {
  id: string;
  examType: string;
  difficultyMode?: string;
  status: string;
  createdAt: string;
  submittedAt: string | null;
  result?: { totalScore: number; maxScore: number; correct: number; partial?: number; incorrect: number; unattempted: number };
}

export interface MockWeakTopic {
  subject: string;
  topic: string;
  attempts: number;
  correct: number;
  successRate: number;
}

export interface LeaderboardSubject {
  top: number;
  avg: number;
  mine: number | null;
  count: number;
}

export type LeaderboardData = Record<string, Record<string, LeaderboardSubject>>;
