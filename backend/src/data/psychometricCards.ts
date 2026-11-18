export interface PsychometricCardDef {
  id: string;
  name: string;
  description: string;
  subtopics: string[];
  bestFor: string;
  badge: string;
  estimatedMinutes: number;
}

export const PSYCHOMETRIC_CARDS: PsychometricCardDef[] = [
  {
    id: 'cognitive_ability',
    name: 'Cognitive Ability Tests',
    description: 'Measure how effectively a candidate understands information, solves problems, and learns.',
    subtopics: [
      'Numerical reasoning',
      'Verbal reasoning',
      'Logical reasoning',
      'Abstract reasoning',
      'Spatial reasoning',
      'Critical thinking and problem-solving',
    ],
    bestFor: 'Graduate recruitment, aptitude screening, analytical roles and campus placements.',
    badge: 'Analytical',
    estimatedMinutes: 12,
  },
  {
    id: 'personality',
    name: 'Personality Tests',
    description: 'Assess relatively stable behavioral preferences and interpersonal tendencies.',
    subtopics: [
      'Big Five personality traits',
      'Introversion–extraversion',
      'Conscientiousness and dependability',
      'Emotional stability',
      'Openness to experience',
      'Agreeableness and cooperation',
    ],
    bestFor: 'Team fit, self-awareness, role development and leadership development.',
    badge: 'Behavioral',
    estimatedMinutes: 8,
  },
  {
    id: 'situational_judgment',
    name: 'Situational Judgment Tests (SJT)',
    description: 'Present realistic workplace situations and ask candidates how they would respond.',
    subtopics: [
      'Conflict resolution',
      'Customer handling',
      'Ethical decision-making',
      'Teamwork',
      'Prioritization',
      'Workplace communication',
    ],
    bestFor: 'Freshers, management trainees, customer support, sales and managerial roles.',
    badge: 'Real Situations',
    estimatedMinutes: 10,
  },
  {
    id: 'emotional_intelligence',
    name: 'Emotional Intelligence (EI) Tests',
    description: 'Evaluate how candidates perceive, understand, and manage emotions.',
    subtopics: [
      'Emotional awareness',
      'Emotion regulation',
      'Empathy',
      'Social awareness',
      'Relationship management',
    ],
    bestFor: 'Team leaders, client-facing roles, managers and collaborative positions.',
    badge: 'People Skills',
    estimatedMinutes: 8,
  },
  {
    id: 'motivation_work_values',
    name: 'Motivation and Work-Values Tests',
    description: 'Identify what drives a candidate and the work environment they prefer.',
    subtopics: [
      'Achievement and ambition',
      'Learning and growth',
      'Autonomy',
      'Stability and security',
      'Recognition',
      'Collaboration and service orientation',
    ],
    bestFor: 'Career guidance, retention planning, role alignment and development discussions.',
    badge: 'Drivers & Purpose',
    estimatedMinutes: 7,
  },
  {
    id: 'behavioral_work_style',
    name: 'Behavioral and Work-Style Assessments',
    description: 'Examine how candidates tend to approach tasks and interact in a work setting.',
    subtopics: [
      'Planning and organization',
      'Attention to detail',
      'Adaptability',
      'Initiative',
      'Team orientation',
      'Preference for independent or structured work',
    ],
    bestFor: 'Operational roles, project teams, internships and workplace development.',
    badge: 'Execution Style',
    estimatedMinutes: 8,
  },
  {
    id: 'career_interest',
    name: 'Career Interest Tests',
    description: 'Identify the types of activities and work domains a candidate finds appealing.',
    subtopics: [
      'Technology and engineering',
      'Business and entrepreneurship',
      'Research and science',
      'Creative and design work',
      'Social and helping professions',
      'Practical and hands-on work',
    ],
    bestFor: 'Students, graduates, career counselling and career-path recommendations.',
    badge: 'Career Matching',
    estimatedMinutes: 7,
  },
  {
    id: 'integrity_risk',
    name: 'Integrity and Risk-Related Assessments',
    description: 'Assess job-relevant ethical judgment, rule adherence and responses to workplace dilemmas.',
    subtopics: [
      'Ethical decision-making',
      'Responsibility and accountability',
      'Compliance judgment',
      'Responses to conflicts of interest',
    ],
    bestFor: 'Roles with significant trust, financial responsibility or compliance requirements.',
    badge: 'Ethics & Trust',
    estimatedMinutes: 8,
  },
];

export interface CandidateProfile {
  age: number;
  professionStatus: 'student' | 'employed' | 'job_seeker';
  studentLevel?: 'school' | 'intermediate' | 'ug' | 'pg';
  stream?: string;
  jobTitle?: string;
  companyType?: string;
  highestQualification?: string;
  targetRole?: string;
}

export function findCardDef(cardId: string): PsychometricCardDef | undefined {
  return PSYCHOMETRIC_CARDS.find((c) => c.id === cardId);
}
