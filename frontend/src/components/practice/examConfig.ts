import type { Subject } from '@/types';

/* What differs between the JEE and NEET practice screens. Everything else is shared in PracticeSession. */
export interface PracticeExamConfig {
  exam: 'JEE' | 'NEET';
  subjects: readonly Subject[];
  defaultSubject: Subject;

  /* Wizard copy */
  allIcon: string;
  allLabel: string;
  subjectsIntro: string;
  topicsIntro: string;
  settingsNote: string;
  hero: {
    kicker: string;
    title: readonly string[];
    body: string;
    showTeaser: boolean;
  };

  /* Session settings */
  countOptions: readonly number[];
  maxPerSubject: number;

  /* JEE builds paper sets and lets the student choose exam type and marking; NEET starts straight from settings */
  hasPapers: boolean;

  /* Loading screens */
  loadingTitle: string;
  loadMessages: readonly string[];
  weakLoadingText: string;

  /* sessionStorage key for an unfinished session */
  sessionKey: string;
}

const JEE_LOAD_MESSAGES = [
  'Crafting your questions...',
  'Checking the JEE syllabus...',
  'Running quality checks...',
  'Generating unique problems...',
  'Sit back, almost ready...',
];

const NEET_LOAD_MESSAGES = [
  'Finding NEET questions…',
  'Checking the NMC syllabus…',
  'Pulling from question bank…',
  'Almost ready…',
];

export const JEE_PRACTICE: PracticeExamConfig = {
  exam: 'JEE',
  subjects: ['Mathematics', 'Physics', 'Chemistry'],
  defaultSubject: 'Mathematics',

  allIcon: 'MPC',
  allLabel: 'All Three',
  subjectsIntro: 'Pick one or more. You can practice MPC together or focus on one.',
  topicsIntro: 'Select all or pick specific ones. Questions rotate across your selection.',
  settingsNote: 'Configure your exam session.',
  hero: {
    kicker: 'Practice Mode',
    title: ['A fresh paper', 'every session'],
    body: 'Each session draws a new set of questions from the bank across Physics, Chemistry and Mathematics. You see the answer and explanation after every question.',
    showTeaser: true,
  },

  countOptions: [5, 10, 20, 30],
  maxPerSubject: 30,

  hasPapers: true,

  loadingTitle: 'Preparing your session',
  loadMessages: JEE_LOAD_MESSAGES,
  weakLoadingText: 'Checking your topic progress...',

  sessionKey: 'jeeneet_exam_session',
};

export const NEET_PRACTICE: PracticeExamConfig = {
  exam: 'NEET',
  subjects: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
  defaultSubject: 'Botany',

  allIcon: 'NEET',
  allLabel: 'All Four',
  subjectsIntro: 'NEET has 4 subjects. Pick the ones you want to practice.',
  topicsIntro: 'All topics follow the NMC Rationalized Syllabus 2024-2026.',
  settingsNote: 'All NEET questions are MCQ single-correct. Marking: +4 / −1.',
  hero: {
    kicker: 'NEET Practice Mode',
    title: ['Practice NEET — Biology, Physics, Chemistry'],
    body: 'Draw questions from the NEET question bank across Botany, Zoology, Physics and Chemistry. All questions are MCQ single correct, NCERT-based.',
    showTeaser: false,
  },

  countOptions: [5, 10, 20, 30, 45],
  maxPerSubject: 45,

  hasPapers: false,

  loadingTitle: 'Preparing NEET session',
  loadMessages: NEET_LOAD_MESSAGES,
  weakLoadingText: 'Checking your NEET topic progress...',

  sessionKey: 'jeeneet_exam_session_neet',
};
