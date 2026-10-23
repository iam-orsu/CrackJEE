import { MathText } from '@/lib/math';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';
import { Badge, subjectVariant } from '@/components/ui/Badge';
import type { MockResultBreakdown } from '@/types';
import { fmtQTime, toPlainPreview } from './resultHelpers';

export type FilterStatus = 'all' | 'correct' | 'incorrect' | 'unattempted';

interface QuestionReviewProps {
  weakPracticeUrl: string;
  isNEET: boolean;
  allQs: any[];
  filteredQs: any[];
  breakdown: Record<string, MockResultBreakdown>;
  expandedQ: string | null;
  onExpand: (questionId: string | null) => void;
  filterSubject: string;
  onFilterSubject: (subject: string) => void;
  filterStatus: FilterStatus;
  onFilterStatus: (status: FilterStatus) => void;
}

/* Every question with its marks, correct answer, explanation, and the subject, topic and status filters */
export function QuestionReview({ weakPracticeUrl, isNEET, allQs, filteredQs, breakdown, expandedQ, onExpand, filterSubject, onFilterSubject, filterStatus, onFilterStatus }: QuestionReviewProps) {
  return (
  <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: 24 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Question Review</h2>
      <a href={weakPracticeUrl} style={{
        padding: '7px 14px', background: '#fff', color: '#1e293b',
        border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, fontWeight: 600,
        textDecoration: 'none', whiteSpace: 'nowrap',
      }}>
        Practice Weak Areas
      </a>
    </div>

    {/* Filters */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
      <AnimatedTabs
        size="sm"
        tabs={[
          { value: 'All', label: 'All Subjects' },
          ...(isNEET
            ? (['Physics', 'Chemistry', 'Botany', 'Zoology'] as const).map((s) => ({ value: s, label: s }))
            : (['Physics', 'Chemistry', 'Mathematics'] as const).map((s) => ({ value: s, label: s }))
          ),
        ]}
        value={filterSubject}
        onChange={onFilterSubject}
      />
      <AnimatedTabs
        size="sm"
        tabs={[
          { value: 'all',         label: 'All',       count: allQs.length },
          { value: 'correct',     label: '✓ Correct', count: allQs.filter((q) => { const bd = breakdown[(q as any).mockQuestionId ?? q.questionId]; return !!bd?.submitted && (bd.awarded ?? 0) > 0; }).length },
          { value: 'incorrect',   label: '✗ Wrong',   count: allQs.filter((q) => { const bd = breakdown[(q as any).mockQuestionId ?? q.questionId]; return !!bd?.submitted && (bd.awarded ?? 0) <= 0; }).length },
          { value: 'unattempted', label: '○ Skipped', count: allQs.filter((q) => { const bd = breakdown[(q as any).mockQuestionId ?? q.questionId]; return !bd?.submitted; }).length },
        ]}
        value={filterStatus}
        onChange={(v) => onFilterStatus(v as FilterStatus)}
      />
    </div>

    <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 14 }}>
      Showing {filteredQs.length} of {allQs.length} questions
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {filteredQs.map((q) => {
        const mqId = (q as any).mockQuestionId ?? q.questionId;
        const bd = breakdown[mqId];
        const isCorrect = bd && bd.awarded > 0;
        const isUnattempted = !bd?.submitted;
        const isIncorrect = !!bd?.submitted && bd.awarded <= 0;
        const isExpanded = expandedQ === q.questionId;

        const statusColor = isCorrect ? '#16a34a' : isUnattempted ? '#64748b' : '#dc2626';
        const statusBg = isCorrect ? '#f0fdf4' : isUnattempted ? '#f8fafc' : '#fef2f2';
        const statusBorder = isCorrect ? '#bbf7d0' : isUnattempted ? '#e2e8f0' : '#fecaca';
        const statusLabel = isCorrect ? `+${bd!.awarded}` : isUnattempted ? '0' : `${bd?.awarded ?? 0}`;

        return (
          <div key={q.questionId} style={{
            border: `1px solid ${isExpanded ? '#cbd5e1' : statusBorder}`,
            borderRadius: 8, overflow: 'hidden',
            background: isExpanded ? '#fff' : statusBg,
          }}>
            {/* Row header */}
            <button
              onClick={() => onExpand(isExpanded ? null : q.questionId)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: 5,
                background: statusColor, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800,
              }}>
                {statusLabel}
              </span>
              <span style={{ fontSize: 12, color: '#64748b', flexShrink: 0 }}>Q{q.questionNumber}</span>
              <Badge variant={subjectVariant(q.subject)}>{q.subject}</Badge>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{(q as any).topic}</span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, color: '#374151' }}>
                {toPlainPreview((q as any).questionText ?? '')}
              </span>
              {(bd?.timeSpentSeconds ?? 0) > 0 && (
                <span style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  ⏱ {fmtQTime(bd!.timeSpentSeconds!)}
                </span>
              )}
              <span style={{ fontSize: 12, color: '#94a3b8', flexShrink: 0 }}>
                {isExpanded ? '▲' : '▼'}
              </span>
            </button>

            {/* Expanded content */}
            {isExpanded && (
              <div style={{ padding: '0 16px 20px', borderTop: '1px solid #e2e8f0' }}>
                {/* Question text */}
                <div style={{ fontSize: 14, color: '#1e293b', lineHeight: 1.7, padding: '14px 0 12px' }}>
                  <MathText text={(q as any).questionText ?? ''} />
                </div>

                {/* Options */}
                {(q as any).options && (q as any).options.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                    {((q as any).options as string[]).map((opt, i) => {
                      const letter = ['A', 'B', 'C', 'D'][i]!;
                      const correctAns = bd?.correctAnswer ?? '';
                      const submittedAns = bd?.submitted ?? '';
                      const isCorrectOpt = correctAns.includes(letter);
                      const isSubmittedOpt = submittedAns.includes(letter);
                      let optBg = '#f8fafc'; let optBorder = '#e2e8f0'; let optColor = '#374151';
                      if (isCorrectOpt) { optBg = '#f0fdf4'; optBorder = '#86efac'; optColor = '#15803d'; }
                      if (isSubmittedOpt && !isCorrectOpt) { optBg = '#fef2f2'; optBorder = '#fca5a5'; optColor = '#dc2626'; }
                      return (
                        <div key={letter} style={{
                          display: 'flex', alignItems: 'flex-start', gap: 10,
                          padding: '8px 12px', borderRadius: 6,
                          border: `1px solid ${optBorder}`, background: optBg,
                        }}>
                          <span style={{ fontWeight: 700, color: optColor, flexShrink: 0 }}>{letter})</span>
                          <span style={{ fontSize: 13, color: optColor }}><MathText text={opt.replace(/^[A-Da-d][).]\s*/, '')} /></span>
                          {isCorrectOpt && <span style={{ marginLeft: 'auto', color: '#16a34a', fontWeight: 700, fontSize: 12 }}>✓ Correct</span>}
                          {isSubmittedOpt && !isCorrectOpt && <span style={{ marginLeft: 'auto', color: '#dc2626', fontWeight: 700, fontSize: 12 }}>✗ Your answer</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Integer answer */}
                {(q as any).questionType === 'integer' && (
                  <div style={{ display: 'flex', gap: 20, marginBottom: 14, fontSize: 13 }}>
                    <div style={{ padding: '8px 14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 6 }}>
                      <span style={{ color: '#64748b' }}>Correct: </span>
                      <strong style={{ color: '#15803d' }}>{bd?.correctAnswer}</strong>
                    </div>
                    {bd?.submitted && bd.submitted !== '' && (
                      <div style={{
                        padding: '8px 14px', borderRadius: 6,
                        background: isCorrect ? '#f0fdf4' : '#fef2f2',
                        border: `1px solid ${isCorrect ? '#86efac' : '#fca5a5'}`,
                      }}>
                        <span style={{ color: '#64748b' }}>Your answer: </span>
                        <strong style={{ color: isCorrect ? '#15803d' : '#dc2626' }}>{bd.submitted}</strong>
                      </div>
                    )}
                    {(!bd?.submitted || bd.submitted === '') && (
                      <div style={{ padding: '8px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6 }}>
                        <span style={{ color: '#64748b' }}>Not attempted</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Explanation */}
                {(q as any).explanation && (
                  <div style={{
                    padding: '14px 16px', background: '#fffbeb', border: '1px solid #fde68a',
                    borderRadius: 6, fontSize: 13, color: '#92400e', lineHeight: 1.7,
                  }}>
                    <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Explanation</div>
                    <MathText text={(q as any).explanation} />
                  </div>
                )}

                {/* Marks awarded */}
                <div style={{ marginTop: 12, display: 'flex', gap: 12, fontSize: 12, color: '#64748b' }}>
                  <span>Marks awarded: <strong style={{ color: statusColor }}>{bd?.awarded ?? 0}</strong></span>
                  <span>Max marks: <strong>{bd?.maxMarks ?? 4}</strong></span>
                  <span>Type: <strong>{(q as any).questionType === 'mcq_single' ? 'Single Correct' : (q as any).questionType === 'mcq_multi' ? 'Multi-Correct' : 'Integer'}</strong></span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
  );
}
