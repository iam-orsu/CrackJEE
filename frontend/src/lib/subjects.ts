/* Subject colours and icons shared by practice, mock exams, results and the dashboard */

export const SUBJECT_COLOR: Record<string, string> = {
  Physics: '#2563eb',
  Chemistry: '#16a34a',
  Mathematics: '#7c3aed',
  Botany: '#16a34a',
  Zoology: '#0891b2',
  Biology: '#059669',
};

export const SUBJECT_ICON: Record<string, string> = {
  Mathematics: '∑',
  Physics: '⚛',
  Chemistry: '⚗',
  Botany: '🌿',
  Zoology: '🦎',
};

export const JEE_SUBJECTS = ['Physics', 'Chemistry', 'Mathematics'] as const;
export const NEET_SUBJECTS = ['Physics', 'Chemistry', 'Botany', 'Zoology'] as const;
