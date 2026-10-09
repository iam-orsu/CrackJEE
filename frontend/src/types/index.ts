export interface User {
  id: string;
  name: string;
  email: string;
  class: '11' | '12' | 'Dropper';
  targetExam: 'Main' | 'Advanced' | 'Both';
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
