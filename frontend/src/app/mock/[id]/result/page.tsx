'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import katex from 'katex';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import type { MockResultData, MockResultBreakdown } from '@/types';

import { MathText, renderMath } from '@/lib/math';

/* ── Helpers ─────────────────────────────────────────────────── */

function fmtTime(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

function scoreColor(pct: number): string {
  if (pct >= 70) return '#16a34a';
  if (pct >= 50) return '#d97706';
  return '#dc2626';
}

const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics'] as const;
const SUBJECT_COLOR: Record<string, string> = {
  Physics: '#2563eb', Chemistry: '#16a34a', Mathematics: '#7c3aed',
};

/* ── Plain text preview (strips LaTeX for snippet) ──────────── */

function toPlainPreview(text: string, max = 80): string {
  const plain = text
    .replace(/\$\$[\s\S]+?\$\$/g, '')
    .replace(/\$([^$\n]*)\$/g, '$1')
    .replace(/\\[a-zA-Z]+\{([^}]*)\}/g, '$1')
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/[{}[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > max ? plain.slice(0, max) + '…' : plain;
}

/* ══════════════════════════════════════════════════════════════
   Component
══════════════════════════════════════════════════════════════ */

export default function MockResultPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;

  const [data, setData] = useState<MockResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [filterSubject, setFilterSubject] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'all' | 'correct' | 'incorrect' | 'unattempted'>('all');

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    api.mock.result(examId)
      .then(setData)
      .catch((e) => setError(e?.message ?? 'Failed to load result'))
      .finally(() => setLoading(false));
  }, [examId]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: '#1e293b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error || !data) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', gap: 16 }}>
      <div style={{ color: '#dc2626', fontSize: 15 }}>{error || 'Result not found'}</div>
      <a href="/mock" style={{ color: '#1e293b', textDecoration: 'underline', fontSize: 14 }}>Back to Mock Tests</a>
    </div>
  );

  const { result, exam } = data;
  const breakdown = result.scoreBreakdown as Record<string, MockResultBreakdown>;
  const pct = Math.round((result.totalScore / result.maxScore) * 100);
  const examType = exam.examType;

  // Build per-subject scores
  const subjectScores = SUBJECTS.map((subj) => {
    const key = subj.toLowerCase() as 'physics' | 'chemistry' | 'mathematics';
    const score = key === 'physics' ? result.physicsScore : key === 'chemistry' ? result.chemistryScore : result.mathScore;
    const subjectQs = exam.questions.filter((q) => q.subject === subj);
    const maxPerSubject = Math.round(result.maxScore / 3);
    const sPct = Math.round((score / maxPerSubject) * 100);
    return { subj, score, maxPerSubject, pct: sPct, count: subjectQs.length };
  });

  // Filter questions for review section
  const allQs = exam.questions;
  const filteredQs = allQs.filter((q) => {
    const bd = breakdown[(q as any).mockQuestionId ?? q.questionId];
    if (!bd) return filterSubject === 'All' || q.subject === filterSubject;
    const isCorrect = bd.awarded > 0;
    const isUnattempted = !bd.submitted;
    const isIncorrect = !!bd.submitted && bd.awarded <= 0;
    if (filterSubject !== 'All' && q.subject !== filterSubject) return false;
    if (filterStatus === 'correct' && !isCorrect) return false;
    if (filterStatus === 'incorrect' && !isIncorrect) return false;
    if (filterStatus === 'unattempted' && !isUnattempted) return false;
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Top bar */}
      <div style={{ background: '#1e293b', color: '#fff', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/dashboard" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>CrackJEE</a>
          <span style={{ color: '#475569' }}>›</span>
          <a href="/mock" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>Mock Tests</a>
          <span style={{ color: '#475569' }}>›</span>
          <span style={{ fontSize: 14, color: '#f1f5f9', fontWeight: 600 }}>Result — JEE {examType}</span>
        </div>
        <a href="/mock" style={{
          color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none',
          padding: '6px 16px', border: '1px solid #475569', borderRadius: 5,
        }}>
          New Mock Test
        </a>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Score card */}
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                JEE {examType} Mock — Score
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 52, fontWeight: 800, color: scoreColor(pct), lineHeight: 1 }}>
                  {result.totalScore}
                </span>
                <span style={{ fontSize: 22, color: '#94a3b8', fontWeight: 500 }}>/ {result.maxScore}</span>
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>✓ {result.correct} Correct</span>
                <span style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>✗ {result.incorrect} Wrong</span>
                <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>○ {result.unattempted} Skipped</span>
                <span style={{ fontSize: 13, color: '#64748b' }}>⏱ {fmtTime(result.timeTaken)}</span>
              </div>
            </div>

            {/* Score ring */}
            <div style={{ position: 'relative', width: 100, height: 100 }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={scoreColor(pct)} strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: scoreColor(pct) }}>{pct}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject breakdown */}
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 18 }}>Subject-wise Performance</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {subjectScores.map(({ subj, score, maxPerSubject, pct: sPct }) => (
              <div key={subj} style={{
                padding: '16px 18px', border: `1px solid ${SUBJECT_COLOR[subj]}30`,
                borderRadius: 8, background: `${SUBJECT_COLOR[subj]}05`,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: SUBJECT_COLOR[subj], textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                  {subj}
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: scoreColor(sPct), marginBottom: 4 }}>
                  {score}
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#94a3b8' }}> / {maxPerSubject}</span>
                </div>
                {/* Progress bar */}
                <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden', marginTop: 10 }}>
                  <div style={{ height: '100%', width: `${Math.max(0, Math.min(100, sPct))}%`, background: SUBJECT_COLOR[subj], borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 5 }}>{sPct}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Question review */}
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>Question Review</h2>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['All', 'Physics', 'Chemistry', 'Mathematics'].map((s) => (
                <button key={s} onClick={() => setFilterSubject(s)} style={{
                  padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  border: '1px solid #e2e8f0', borderRadius: 5,
                  background: filterSubject === s ? '#1e293b' : '#fff',
                  color: filterSubject === s ? '#fff' : '#475569',
                }}>
                  {s}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {([['all', 'All'], ['correct', '✓ Correct'], ['incorrect', '✗ Wrong'], ['unattempted', '○ Skipped']] as const).map(([v, label]) => (
                <button key={v} onClick={() => setFilterStatus(v)} style={{
                  padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  border: '1px solid #e2e8f0', borderRadius: 5,
                  background: filterStatus === v ? '#1e293b' : '#fff',
                  color: filterStatus === v ? '#fff' : '#475569',
                }}>
                  {label}
                </button>
              ))}
            </div>
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
                    onClick={() => setExpandedQ(isExpanded ? null : q.questionId)}
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
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 9999, fontWeight: 600,
                      background: `${SUBJECT_COLOR[q.subject]}15`,
                      color: SUBJECT_COLOR[q.subject],
                    }}>
                      {q.subject}
                    </span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{(q as any).topic}</span>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, color: '#374151' }}>
                      {toPlainPreview((q as any).questionText ?? '')}
                    </span>
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

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, paddingBottom: 32 }}>
          <a href="/mock" style={{
            padding: '11px 24px', background: '#1e293b', color: '#fff',
            borderRadius: 6, fontSize: 14, fontWeight: 600, textDecoration: 'none',
          }}>
            Take Another Mock
          </a>
          <a href="/practice" style={{
            padding: '11px 24px', background: '#fff', color: '#1e293b',
            border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, fontWeight: 600, textDecoration: 'none',
          }}>
            Practice Weak Areas
          </a>
        </div>
      </div>
    </div>
  );
}
