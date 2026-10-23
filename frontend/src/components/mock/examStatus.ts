/* Question-palette status for the mock exam: which colour a question shows */

export type QStatus = 'not_visited' | 'not_answered' | 'answered' | 'marked' | 'answered_marked';

export function qStatus(mqId: string, answers: Record<string, string>, marked: Record<string, boolean>, visited: Record<string, boolean>): QStatus {
  const isAns = !!answers[mqId];
  const isMark = !!marked[mqId];
  const isVis = !!visited[mqId] || isAns;
  if (!isVis) return 'not_visited';
  if (isAns && isMark) return 'answered_marked';
  if (isAns) return 'answered';
  if (isMark) return 'marked';
  return 'not_answered';
}

export const STATUS_STYLE: Record<QStatus, { bg: string; color: string; border: string }> = {
  not_visited:     { bg: '#d1d5db', color: '#374151', border: '#9ca3af' },
  not_answered:    { bg: '#ef4444', color: '#fff',    border: '#dc2626' },
  answered:        { bg: '#22c55e', color: '#fff',    border: '#16a34a' },
  marked:          { bg: '#a855f7', color: '#fff',    border: '#9333ea' },
  answered_marked: { bg: '#7c3aed', color: '#fff',    border: '#6d28d9' },
};
