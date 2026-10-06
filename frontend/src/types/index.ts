export interface User {
  id: string;
  name: string;
  email: string;
  class: '11' | '12' | 'Dropper';
  targetExam: 'Main' | 'Advanced' | 'Both';
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  createdAt?: string;
}

export interface DiagramElement {
  kind: string;
  coords?: [number, number];
  from?: [number, number];
  to?: [number, number];
  arrow?: 'none' | 'end' | 'start' | 'both';
  dashed?: boolean;
  center?: [number, number];
  radius?: number;
  fill?: string;
  startAngle?: number;
  endAngle?: number;
  vertex?: [number, number];
  arm1?: [number, number];
  arm2?: [number, number];
  content?: string;
  bold?: boolean;
  fontSize?: number;
  expr?: string;
  xMin?: number;
  xMax?: number;
  label?: string;
  color?: string;
  visible?: boolean;
}

export interface DiagramDescriptor {
  boundingBox: [number, number, number, number];
  showAxes?: boolean;
  elements: DiagramElement[];
}

export interface Question {
  id: string;
  topic: string;
  subject: string;
  questionText: string;
  options: string[];
  difficulty: string;
  examType: string;
  diagram?: DiagramDescriptor | null;
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
  weakAreas: TopicProgress[];
  recentActivity: Array<{
    id: string;
    isCorrect: boolean;
    timeSpent: number;
    createdAt: string;
    question: { topic: string; subject: string; difficulty: string };
  }>;
  weeklyStats: WeeklyPoint[];
  subjectAccuracy: SubjectAccuracy[];
}

export type Subject = 'Mathematics' | 'Physics' | 'Chemistry';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
