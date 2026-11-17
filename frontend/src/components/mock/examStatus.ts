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
  not_visited:     { bg: '#E9EDF2', color: '#445364', border: '#BCC7D4' },
  not_answered:    { bg: '#C0392B', color: '#FFFFFF', border: '#A32E23' },
  answered:        { bg: '#1E7A45', color: '#FFFFFF', border: '#176036' },
  marked:          { bg: '#6D4AA8', color: '#FFFFFF', border: '#59398C' },
  answered_marked: { bg: '#55308F', color: '#FFFFFF', border: '#452677' },
};
