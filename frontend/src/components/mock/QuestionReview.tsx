import { MathText } from '@/lib/math';
import { MatchListTable, parseMatchQuestion } from '@/components/common/MatchListTable';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';
import { subjectTone } from '@/components/insights/InsightBlocks';
import type { MockExamQuestion, MockResultBreakdown } from '@/types';
import { fmtQTime } from './resultHelpers';
import { ExplanationReveal } from './ExplanationReveal';

export type FilterStatus = 'all' | 'correct' | 'incorrect' | 'unattempted';

type ReviewQuestion = MockExamQuestion & { explanation?: string };

interface QuestionReviewProps {
  examId: string;
  weakPracticeUrl: string;
  isNEET: boolean;
  allQs: ReviewQuestion[];
  filteredQs: ReviewQuestion[];
  breakdown: Record<string, MockResultBreakdown>;
  expandedQ: string | null;
  onExpand: (questionId: string | null) => void;
  filterSubject: string;
  onFilterSubject: (subject: string) => void;
  filterStatus: FilterStatus;
  onFilterStatus: (status: FilterStatus) => void;
}

/* The dashboard's palette, so the review sheet belongs to the same product */
const NAVY = '#003366', GOOD = '#15803D', BAD = '#C8202F';
const MUTE = '#5A6B8C', FAINT = '#7A87A0', INK = '#31407F';
const HEAD = 'font-display';

/* Every question with its marks, correct answer, explanation, and the subject, topic and status filters */
export function QuestionReview({ examId, weakPracticeUrl, isNEET, allQs, filteredQs, breakdown, expandedQ, onExpand, filterSubject, onFilterSubject, filterStatus, onFilterStatus }: QuestionReviewProps) {
  return (
  <div className="rounded-[28px] border border-[#003366]/10 bg-white p-5 shadow-[0_24px_60px_-34px_rgba(0,51,102,.45)] sm:p-6">
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className={`${HEAD} text-[21px] font-extrabold leading-tight tracking-[-0.01em] text-[#003366]`}>Question review</h2>
        <p className="mt-1 text-[13px] text-[#5A6B8C]">Every question with the correct answer, your response and the explanation.</p>
      </div>
      <a href={weakPracticeUrl} className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#803688] px-[18px] py-[9px] text-[12.5px] font-extrabold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[4px] active:shadow-[0_1px_0_#5A2560] motion-reduce:transition-none">
        Practice weak areas
      </a>
    </div>

    {/* Filters */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
      <div style={{ overflowX: 'auto', paddingBottom: 2 }}>
        <AnimatedTabs
          size="sm"
          accentColor={NAVY}
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
      </div>
      <div style={{ overflowX: 'auto', paddingBottom: 2 }}>
        <AnimatedTabs
          size="sm"
          accentColor={NAVY}
          tabs={[
            { value: 'all',         label: 'All',       count: allQs.length },
            { value: 'correct',     label: '✓ Correct', count: allQs.filter((q) => { const bd = breakdown[q.mockQuestionId ?? q.questionId]; return !!bd?.submitted && (bd.awarded ?? 0) > 0; }).length },
            { value: 'incorrect',   label: '✗ Wrong',   count: allQs.filter((q) => { const bd = breakdown[q.mockQuestionId ?? q.questionId]; return !!bd?.submitted && (bd.awarded ?? 0) <= 0; }).length },
            { value: 'unattempted', label: '○ Skipped', count: allQs.filter((q) => { const bd = breakdown[q.mockQuestionId ?? q.questionId]; return !bd?.submitted; }).length },
          ]}
          value={filterStatus}
          onChange={(v) => onFilterStatus(v as FilterStatus)}
        />
      </div>
    </div>

    <div className="mb-3 text-[12px] font-semibold text-[#7A87A0]">
      Showing {filteredQs.length} of {allQs.length} questions
    </div>

    <div className="flex flex-col gap-2.5">
      {filteredQs.map((q) => {
        const mqId = q.mockQuestionId ?? q.questionId;
        const bd = breakdown[mqId];
        const isCorrect = !!bd && bd.awarded > 0;
        const isUnattempted = !bd?.submitted;
        const isExpanded = expandedQ === q.questionId;

        const tone = isCorrect ? GOOD : isUnattempted ? FAINT : BAD;
        const rowBg = isExpanded ? '#fff' : isCorrect ? '#F2FAF5' : isUnattempted ? '#F7F9FC' : '#FDF3F4';
        const rowBorder = isExpanded ? 'rgba(0,51,102,.22)' : isCorrect ? '#C6E6D2' : isUnattempted ? 'rgba(0,51,102,.10)' : '#F1C9CE';
        const statusLabel = isCorrect ? `+${bd!.awarded}` : isUnattempted ? '0' : `${bd?.awarded ?? 0}`;
        const sc = subjectTone(q.subject);

        return (
          <div key={q.questionId} style={{
            border: `1px solid ${rowBorder}`,
            borderRadius: 16, overflow: 'hidden',
            background: rowBg,
            transition: 'background .15s ease, border-color .15s ease',
          }}>
            {/* Row header */}
            <button
              onClick={() => onExpand(isExpanded ? null : q.questionId)}
              aria-expanded={isExpanded}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '11px 14px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span className={HEAD} style={{
                flexShrink: 0, width: 30, height: 30, borderRadius: 10,
                background: tone, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800, fontVariantNumeric: 'tabular-nums',
              }}>
                {statusLabel}
              </span>
              <span className="hidden sm:inline" style={{ fontSize: 11.5, fontWeight: 700, color: FAINT, flexShrink: 0 }}>Q{q.questionNumber}</span>
              <span style={{
                flexShrink: 0, display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
                padding: '2px 9px', borderRadius: 9999, fontSize: 10.5, fontWeight: 800,
                color: sc, background: `${sc}14`, border: `1px solid ${sc}33`,
              }}>
                {q.subject}
              </span>
              <span className="hidden md:inline truncate" style={{ fontSize: 11, fontWeight: 600, color: FAINT, maxWidth: 160 }}>
                {q.topic}
              </span>
              <span className="min-w-0 flex-1 truncate" style={{ fontSize: 13, color: INK }}>
                <MathText text={q.questionText ?? ''} />
              </span>
              {(bd?.timeSpentSeconds ?? 0) > 0 && (
                <span className="hidden sm:inline" style={{ fontSize: 11, fontWeight: 600, color: FAINT, flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {fmtQTime(bd!.timeSpentSeconds!)}
                </span>
              )}
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={MUTE} strokeWidth="2.4"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden
                style={{ flexShrink: 0, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform .18s ease' }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Expanded content */}
            {isExpanded && (
              <div style={{ padding: '2px 16px 18px', borderTop: '1px solid rgba(0,51,102,.10)' }}>
                {/* Question text */}
                <div style={{ fontSize: 14, color: INK, lineHeight: 1.7, padding: '14px 0 12px' }}>
                  {q.questionType === 'matrix_match' || parseMatchQuestion(q.questionText ?? '') ? (
                    <MatchListTable questionText={q.questionText ?? ''} />
                  ) : (
                    <MathText text={q.questionText ?? ''} />
                  )}
                </div>

                {/* Options */}
                {q.options && q.options.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                    {q.options.map((opt, i) => {
                      const letter = ['A', 'B', 'C', 'D'][i]!;
                      const correctSet = new Set((bd?.correctAnswer ?? '').split(',').map((s) => s.trim()).filter(Boolean));
                      const submittedSet = new Set((bd?.submitted ?? '').split(',').map((s) => s.trim()).filter(Boolean));
                      const isCorrectOpt = correctSet.has(letter);
                      const isSubmittedOpt = submittedSet.has(letter);
                      let optBg = '#F7F9FC'; let optBorder = 'rgba(0,51,102,.10)'; let optColor = INK;
                      if (isCorrectOpt) { optBg = '#EAF7EF'; optBorder = '#9FD6B2'; optColor = '#146C33'; }
                      if (isSubmittedOpt && !isCorrectOpt) { optBg = '#FCEBED'; optBorder = '#F0A8AE'; optColor = '#A31A25'; }
                      return (
                        <div key={letter} style={{
                          display: 'flex', alignItems: 'flex-start', gap: 10,
                          padding: '9px 12px', borderRadius: 12,
                          border: `1px solid ${optBorder}`, background: optBg,
                        }}>
                          <span className={HEAD} style={{ fontWeight: 800, color: optColor, flexShrink: 0, fontSize: 13 }}>{letter}</span>
                          <span style={{ fontSize: 13, color: optColor }}><MathText text={opt.replace(/^[A-Da-d][).]\s*/, '')} /></span>
                          {isCorrectOpt && <span style={{ marginLeft: 'auto', color: '#15803D', fontWeight: 800, fontSize: 11.5, flexShrink: 0 }}>✓ Correct</span>}
                          {isSubmittedOpt && !isCorrectOpt && <span style={{ marginLeft: 'auto', color: '#C8202F', fontWeight: 800, fontSize: 11.5, flexShrink: 0 }}>✗ Your answer</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Integer answer */}
                {q.questionType === 'integer' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14, fontSize: 13 }}>
                    <div style={{ padding: '8px 14px', background: '#EAF7EF', border: '1px solid #9FD6B2', borderRadius: 12 }}>
                      <span style={{ color: MUTE }}>Correct: </span>
                      <strong style={{ color: '#15803D' }}>{bd?.correctAnswer}</strong>
                    </div>
                    {bd?.submitted && bd.submitted !== '' && (
                      <div style={{
                        padding: '8px 14px', borderRadius: 12,
                        background: isCorrect ? '#EAF7EF' : '#FCEBED',
                        border: `1px solid ${isCorrect ? '#9FD6B2' : '#F0A8AE'}`,
                      }}>
                        <span style={{ color: MUTE }}>Your answer: </span>
                        <strong style={{ color: isCorrect ? '#15803D' : '#C8202F' }}>{bd.submitted}</strong>
                      </div>
                    )}
                    {(!bd?.submitted || bd.submitted === '') && (
                      <div style={{ padding: '8px 14px', background: '#F7F9FC', border: '1px solid rgba(0,51,102,.10)', borderRadius: 12 }}>
                        <span style={{ color: MUTE }}>Not attempted</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Explanation */}
                {q.explanation ? (
                  <div style={{
                    padding: '14px 16px', background: '#FFF9EC', border: '1px solid #F1DFB4',
                    borderRadius: 14, fontSize: 13, color: '#6B4E00', lineHeight: 1.7,
                  }}>
                    <div style={{ fontWeight: 800, marginBottom: 6, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Explanation</div>
                    <MathText text={q.explanation} />
                  </div>
                ) : (
                  <ExplanationReveal examId={examId} mockQuestionId={mqId} />
                )}

                {/* Marks awarded */}
                <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 12, fontWeight: 600, color: MUTE }}>
                  <span>Marks awarded: <strong style={{ color: tone, fontVariantNumeric: 'tabular-nums' }}>{bd?.awarded ?? 0}</strong></span>
                  <span>Max marks: <strong style={{ color: INK }}>{bd?.maxMarks ?? 4}</strong></span>
                  <span>Type: <strong style={{ color: INK }}>{q.questionType === 'mcq_single' ? 'Single Correct' : q.questionType === 'mcq_multi' ? 'Multi-Correct' : q.questionType === 'matrix_match' ? 'Matrix Match' : 'Integer'}</strong></span>
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