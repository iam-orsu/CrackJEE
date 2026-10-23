import type { MockExamQuestion } from '@/types';
import { SUBJECT_COLOR } from '@/lib/subjects';
import { qStatus, STATUS_STYLE, type QStatus } from './examStatus';

interface ExamPaletteProps {
  totalAnswered: number;
  totalMarked: number;
  statusCounts: Record<QStatus, number>;
  subjects: readonly string[];
  bySubject: Record<string, MockExamQuestion[]>;
  questions: MockExamQuestion[];
  answers: Record<string, string>;
  marked: Record<string, boolean>;
  visited: Record<string, boolean>;
  currentIdx: number;
  goTo: (index: number) => void;
}

/* Right-hand panel: counts by status, the per-subject question palette and the colour legend */
export function ExamPalette({ totalAnswered, totalMarked, statusCounts, subjects, bySubject, questions, answers, marked, visited, currentIdx, goTo }: ExamPaletteProps) {
  return (
    <>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {[
          { label: 'Answered', count: totalAnswered, bg: '#dcfce7', color: '#166534' },
          { label: 'Not Answered', count: statusCounts.not_answered, bg: '#fee2e2', color: '#991b1b' },
          { label: 'Marked', count: totalMarked, bg: '#ede9fe', color: '#5b21b6' },
          { label: 'Not Visited', count: statusCounts.not_visited, bg: '#f1f5f9', color: '#475569' },
        ].map(({ label, count, bg, color }) => (
          <div key={label} style={{ background: bg, borderRadius: 6, padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color }}>{Math.max(0, count)}</div>
            <div style={{ fontSize: 10, color, opacity: 0.8 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Per-subject palette */}
      {subjects.map((subj) => {
        const subjectQs = bySubject[subj] ?? [];
        return (
          <div key={subj}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: SUBJECT_COLOR[subj],
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8,
              paddingBottom: 6, borderBottom: `2px solid ${SUBJECT_COLOR[subj]}30`,
            }}>
              {subj}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {subjectQs.map((q) => {
                const status = qStatus(q.mockQuestionId, answers, marked, visited);
                const st = STATUS_STYLE[status];
                const globalIdx = questions.findIndex((x) => x.mockQuestionId === q.mockQuestionId);
                const isCurrent = globalIdx === currentIdx;
                return (
                  <button
                    key={q.mockQuestionId}
                    onClick={() => goTo(globalIdx)}
                    title={`Q${q.questionNumber} — ${status.replace('_', ' ')}`}
                    style={{
                      width: 32, height: 32, border: `2px solid ${isCurrent ? '#0f172a' : st.border}`,
                      borderRadius: status === 'marked' || status === 'answered_marked' ? '50%' : 5,
                      background: st.bg, color: st.color,
                      fontSize: 11, fontWeight: 700, cursor: 'pointer',
                      outline: isCurrent ? '2px solid #0f172a' : 'none',
                      outlineOffset: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    {q.subjectIndex + 1}
                    {status === 'answered_marked' && (
                      <span style={{
                        position: 'absolute', top: -3, right: -3,
                        width: 10, height: 10, background: '#22c55e',
                        borderRadius: '50%', border: '1px solid #fff',
                      }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Legend</div>
        {([
          ['not_visited',     'Not Visited'],
          ['not_answered',    'Not Answered'],
          ['answered',        'Answered'],
          ['marked',          'Marked for Review'],
          ['answered_marked', 'Answered + Marked'],
        ] as [QStatus, string][]).map(([status, label]) => {
          const st = STATUS_STYLE[status];
          return (
            <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <div style={{
                width: 18, height: 18, borderRadius: status === 'marked' || status === 'answered_marked' ? '50%' : 3,
                background: st.bg, border: `1.5px solid ${st.border}`,
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 11, color: '#475569' }}>{label}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
