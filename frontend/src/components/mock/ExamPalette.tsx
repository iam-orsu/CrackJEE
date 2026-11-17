import type { CSSProperties } from 'react';
import type { MockExamQuestion } from '@/types';
import { qStatus, STATUS_STYLE, type QStatus } from './examStatus';
import { EX, FONT_MONO } from './examTheme';

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

const SECTION_HEAD: CSSProperties = {
  fontSize: 10.5, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
  color: EX.ink, paddingBottom: 10, borderBottom: `1px solid ${EX.line}`,
};

/* Right-hand panel, top to bottom: legend, the per-subject question palette,
   then the counts by status */
export function ExamPalette({ totalAnswered, totalMarked, statusCounts, subjects, bySubject, questions, answers, marked, visited, currentIdx, goTo }: ExamPaletteProps) {
  const stats: { label: string; count: number; status: QStatus }[] = [
    { label: 'Answered', count: totalAnswered, status: 'answered' },
    { label: 'Not answered', count: statusCounts.not_answered, status: 'not_answered' },
    { label: 'Marked for review', count: totalMarked, status: 'marked' },
    { label: 'Not visited', count: statusCounts.not_visited, status: 'not_visited' },
  ];

  return (
    <>
      {/* Legend */}
      <div>
        <div style={SECTION_HEAD}>Legend</div>
        <div style={{ marginTop: 12 }}>
          {([
            ['not_visited',     'Not visited'],
            ['not_answered',    'Not answered'],
            ['answered',        'Answered'],
            ['marked',          'Marked for review'],
            ['answered_marked', 'Answered + marked'],
          ] as [QStatus, string][]).map(([status, label]) => {
            const st = STATUS_STYLE[status];
            const round = status === 'marked' || status === 'answered_marked';
            return (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                <div style={{
                  width: 16, height: 16, borderRadius: round ? '50%' : 2,
                  background: st.bg, border: `1px solid ${st.border}`, flexShrink: 0,
                }} />
                <span style={{ fontSize: 11, color: EX.ink2 }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-subject palette */}
      <div>
        <div style={SECTION_HEAD}>Question palette</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 14 }}>
          {subjects.map((subj) => {
            const subjectQs = bySubject[subj] ?? [];
            const answeredCount = subjectQs.filter((q) => !!answers[q.mockQuestionId]).length;
            return (
              <div key={subj}>
                <div style={{
                  display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8,
                  paddingBottom: 7, marginBottom: 9, borderBottom: `1px solid ${EX.lineSoft}`,
                }}>
                  <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: EX.ink }}>
                    {subj}
                  </span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: EX.mute, fontVariantNumeric: 'tabular-nums' }}>
                    {answeredCount}/{subjectQs.length}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {subjectQs.map((q) => {
                    const status = qStatus(q.mockQuestionId, answers, marked, visited);
                    const st = STATUS_STYLE[status];
                    const globalIdx = questions.findIndex((x) => x.mockQuestionId === q.mockQuestionId);
                    const isCurrent = globalIdx === currentIdx;
                    const round = status === 'marked' || status === 'answered_marked';
                    return (
                      <button
                        key={q.mockQuestionId}
                        onClick={() => goTo(globalIdx)}
                        title={`Q${q.questionNumber} — ${status.replace('_', ' ')}`}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = EX.ink2; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = isCurrent ? EX.ink : st.border; }}
                        style={{
                          width: 32, height: 32,
                          border: `1px solid ${isCurrent ? EX.ink : st.border}`,
                          borderRadius: round ? '50%' : 2,
                          background: st.bg, color: st.color,
                          fontFamily: FONT_MONO, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                          outline: isCurrent ? `2px solid ${EX.ink}` : 'none',
                          outlineOffset: 2,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          position: 'relative', transition: 'border-color .1s',
                        }}
                      >
                        {q.subjectIndex + 1}
                        {status === 'answered_marked' && (
                          <span style={{
                            position: 'absolute', top: -3, right: -3,
                            width: 9, height: 9, background: '#2E8B57',
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
        </div>
      </div>

      {/* Summary table */}
      <div>
        <div style={SECTION_HEAD}>Response summary</div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: 12,
          border: `1px solid ${EX.line}`, borderRadius: 2, overflow: 'hidden', background: EX.paper,
        }}>
          {stats.map(({ label, count, status }, i) => {
            const st = STATUS_STYLE[status];
            return (
              <div
                key={label}
                style={{
                  padding: '10px 12px',
                  borderRight: i % 2 === 0 ? `1px solid ${EX.lineSoft}` : 'none',
                  borderBottom: i < 2 ? `1px solid ${EX.lineSoft}` : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 2, background: st.bg, border: `1px solid ${st.border}`, flexShrink: 0 }} />
                  <span style={{ fontSize: 9.5, fontWeight: 600, color: EX.mute }}>{label}</span>
                </div>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 19, fontWeight: 700, color: EX.ink,
                  lineHeight: 1.1, fontVariantNumeric: 'tabular-nums',
                }}>
                  {Math.max(0, count)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}