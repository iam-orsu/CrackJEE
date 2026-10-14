'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import katex from 'katex';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import type { MockExam, MockExamQuestion } from '@/types';

import { MathText, renderMath, stripOptionPrefix } from '@/lib/math';

/* ── Helpers ──────────────────────────────────────────────────── */

function stripPrefix(opt: string): string {
  return stripOptionPrefix(opt);
}

function fmtTime(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

type QStatus = 'not_visited' | 'not_answered' | 'answered' | 'marked' | 'answered_marked';

function qStatus(mqId: string, answers: Record<string, string>, marked: Record<string, boolean>, visited: Record<string, boolean>): QStatus {
  const isAns = !!answers[mqId];
  const isMark = !!marked[mqId];
  const isVis = !!visited[mqId] || isAns;
  if (!isVis) return 'not_visited';
  if (isAns && isMark) return 'answered_marked';
  if (isAns) return 'answered';
  if (isMark) return 'marked';
  return 'not_answered';
}

const STATUS_STYLE: Record<QStatus, { bg: string; color: string; border: string }> = {
  not_visited:     { bg: '#d1d5db', color: '#374151', border: '#9ca3af' },
  not_answered:    { bg: '#ef4444', color: '#fff',    border: '#dc2626' },
  answered:        { bg: '#22c55e', color: '#fff',    border: '#16a34a' },
  marked:          { bg: '#a855f7', color: '#fff',    border: '#9333ea' },
  answered_marked: { bg: '#7c3aed', color: '#fff',    border: '#6d28d9' },
};

const SUBJECT_COLOR: Record<string, string> = {
  Physics: '#2563eb', Chemistry: '#16a34a', Mathematics: '#7c3aed',
};

/* ══════════════════════════════════════════════════════════════
   Main component
══════════════════════════════════════════════════════════════ */

export default function MockExamPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;

  const [exam, setExam] = useState<MockExam | null>(null);
  const [pageStatus, setPageStatus] = useState<'loading' | 'polling' | 'exam' | 'submitting' | 'error'>('loading');
  const [loadMsg, setLoadMsg] = useState('Loading exam…');

  // Question state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [visited, setVisited] = useState<Record<string, boolean>>({});
  const [draft, setDraft] = useState<string>(''); // current question draft

  // Timer
  const [timeLeft, setTimeLeft] = useState(0);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // UI
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const submittingRef = useRef(false);

  /* ── Load exam ── */
  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    loadExam();
  }, [examId]);

  async function loadExam() {
    try {
      const data = await api.mock.get(examId);
      if (data.status === 'error') { setPageStatus('error'); setLoadMsg('Exam generation failed. Please try again.'); return; }
      if (data.status === 'generating') { setPageStatus('polling'); pollForReady(); return; }
      await initializeExam(data);
    } catch {
      setPageStatus('error');
      setLoadMsg('Failed to load exam.');
    }
  }

  async function pollForReady() {
    const MESSAGES = [
      'Generating your questions…',
      'Running quality checks…',
      'Mixing difficulty levels…',
      'Building your unique paper…',
      'Almost ready…',
    ];
    let attempt = 0;
    const poll = async (): Promise<void> => {
      setLoadMsg(MESSAGES[attempt % MESSAGES.length]!);
      attempt++;
      try {
        const data = await api.mock.get(examId);
        if (data.status === 'generating') { setTimeout(poll, 3000); return; }
        if (data.status === 'error') { setPageStatus('error'); setLoadMsg('Exam generation failed.'); return; }
        await initializeExam(data);
      } catch {
        setTimeout(poll, 4000);
      }
    };
    poll();
  }

  async function initializeExam(data: MockExam) {
    // Initialize local state from server-saved answers
    const initAnswers: Record<string, string> = {};
    const initMarked: Record<string, boolean> = {};
    for (const q of data.questions) {
      if (q.savedAnswer) initAnswers[q.mockQuestionId] = q.savedAnswer;
      if (q.markedForReview) initMarked[q.mockQuestionId] = true;
    }
    setAnswers(initAnswers);
    setMarked(initMarked);
    setExam(data);

    // Start or get startedAt
    let sa = data.startedAt;
    if (data.status === 'ready' || (!sa && data.status === 'in_progress')) {
      try {
        const res = await api.mock.begin(examId);
        sa = res.startedAt;
      } catch {}
    }
    setStartedAt(sa);

    // Compute initial timeLeft
    if (sa) {
      const elapsed = Math.floor((Date.now() - new Date(sa).getTime()) / 1000);
      setTimeLeft(Math.max(0, data.durationSeconds - elapsed));
    } else {
      setTimeLeft(data.durationSeconds);
    }

    setPageStatus('exam');
    // Mark first question as visited
    if (data.questions[0]) {
      setVisited((p) => ({ ...p, [data.questions[0]!.mockQuestionId]: true }));
      setDraft(initAnswers[data.questions[0]!.mockQuestionId] ?? '');
    }
  }

  /* ── Timer ── */
  useEffect(() => {
    if (pageStatus !== 'exam' || !startedAt) return;
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
      const remaining = Math.max(0, (exam?.durationSeconds ?? 10800) - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) handleSubmit(true);
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [pageStatus, startedAt, exam?.durationSeconds]);

  /* ── Navigate between questions ── */
  const currentQ = exam?.questions[currentIdx] ?? null;

  function goTo(idx: number) {
    if (!exam) return;
    const q = exam.questions[idx];
    if (!q) return;
    setCurrentIdx(idx);
    setDraft(answers[q.mockQuestionId] ?? '');
    setVisited((p) => ({ ...p, [q.mockQuestionId]: true }));
  }

  /* ── Answer actions ── */
  function saveAndNext(doMark?: boolean) {
    if (!currentQ) return;
    const mqId = currentQ.mockQuestionId;

    // Update local state immediately
    setAnswers((p) => draft ? { ...p, [mqId]: draft } : { ...p, [mqId]: p[mqId] ?? '' });
    if (doMark !== undefined) setMarked((p) => ({ ...p, [mqId]: doMark }));

    // Persist to server (fire and forget)
    api.mock.saveAnswer(examId, {
      mockQuestionId: mqId,
      answer: draft,
      markedForReview: doMark,
    }).catch(() => {});

    // Move to next question
    if (currentIdx < (exam?.questions.length ?? 0) - 1) {
      goTo(currentIdx + 1);
    }
  }

  function markForReview() {
    if (!currentQ) return;
    const mqId = currentQ.mockQuestionId;

    setMarked((p) => ({ ...p, [mqId]: true }));
    if (draft) setAnswers((p) => ({ ...p, [mqId]: draft }));

    api.mock.saveAnswer(examId, {
      mockQuestionId: mqId,
      answer: draft,
      markedForReview: true,
    }).catch(() => {});

    if (currentIdx < (exam?.questions.length ?? 0) - 1) {
      goTo(currentIdx + 1);
    }
  }

  function clearResponse() {
    if (!currentQ) return;
    const mqId = currentQ.mockQuestionId;
    setDraft('');
    setAnswers((p) => { const n = { ...p }; delete n[mqId]; return n; });
    api.mock.saveAnswer(examId, { mockQuestionId: mqId, answer: '' }).catch(() => {});
  }

  /* ── Submit ── */
  async function handleSubmit(auto = false) {
    if (submittingRef.current) return;
    if (!auto && !showSubmitModal) { setShowSubmitModal(true); return; }
    submittingRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    setPageStatus('submitting');
    setShowSubmitModal(false);
    try {
      await api.mock.submit(examId);
      router.push(`/mock/${examId}/result`);
    } catch (e) {
      submittingRef.current = false;
      setErrorMsg(e instanceof Error ? e.message : 'Submission failed');
      setPageStatus('exam');
    }
  }

  /* ── Multi-correct toggle ── */
  function toggleMulti(letter: string) {
    const parts = draft ? draft.split(',').map((s) => s.trim()).filter(Boolean) : [];
    const idx = parts.indexOf(letter);
    if (idx >= 0) parts.splice(idx, 1); else parts.push(letter);
    parts.sort();
    setDraft(parts.join(','));
  }

  /* ── Loading / polling screen ── */
  if (pageStatus === 'loading' || pageStatus === 'polling') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--gray-200)', borderTopColor: 'var(--gray-900)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 20 }} />
        <div style={{ fontSize: 16, color: 'var(--gray-700)', fontWeight: 500 }}>{loadMsg}</div>
        {pageStatus === 'polling' && (
          <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 8 }}>This may take 30–60 seconds on first load</div>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (pageStatus === 'error') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ fontSize: 16, color: '#dc2626', marginBottom: 16 }}>{loadMsg}</div>
        <a href="/mock" style={{ color: 'var(--gray-700)', textDecoration: 'underline' }}>Back to Mock Tests</a>
      </div>
    );
  }

  if (pageStatus === 'submitting') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--gray-200)', borderTopColor: 'var(--gray-900)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 20 }} />
        <div style={{ fontSize: 16, color: 'var(--gray-700)', fontWeight: 500 }}>Evaluating your answers…</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!exam || !currentQ) return null;

  const questions = exam.questions;
  const subjects = ['Physics', 'Chemistry', 'Mathematics'] as const;
  const bySubject = Object.fromEntries(subjects.map((s) => [s, questions.filter((q) => q.subject === s)]));

  // Compute accurate counts using qStatus (single source of truth)
  const statusCounts = { answered: 0, not_answered: 0, marked: 0, not_visited: 0, answered_marked: 0 } as Record<QStatus, number>;
  for (const q of questions) statusCounts[qStatus(q.mockQuestionId, answers, marked, visited)]++;
  const totalAnswered = statusCounts.answered + statusCounts.answered_marked;
  const totalMarked = Object.values(marked).filter(Boolean).length;
  const total = questions.length;

  const timerColor = timeLeft < 600 ? '#dc2626' : timeLeft < 1800 ? '#d97706' : '#166534';
  const timerBg   = timeLeft < 600 ? '#fef2f2' : timeLeft < 1800 ? '#fffbeb' : '#f0fdf4';

  const qt = currentQ.questionType;
  const options = ['A', 'B', 'C', 'D'];
  const multiSelected = new Set(draft ? draft.split(',').map((s) => s.trim()).filter(Boolean) : []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f3f4f6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── Top bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#1e293b', color: '#fff', padding: '0 20px', height: 52, flexShrink: 0,
        borderBottom: '2px solid #0f172a',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>CrackJEE</span>
          <span style={{ width: 1, height: 20, background: '#475569' }} />
          <span style={{ fontSize: 14, color: '#94a3b8' }}>JEE {exam.examType} Mock Test</span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: timerBg, color: timerColor,
          border: `1px solid ${timerColor}30`,
          borderRadius: 6, padding: '6px 14px',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700 }}>{fmtTime(timeLeft)}</span>
        </div>
        <button
          onClick={() => handleSubmit(false)}
          style={{
            background: '#fff', color: '#1e293b', border: 'none',
            padding: '7px 20px', borderRadius: 5, fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}
        >
          Submit Test
        </button>
      </div>

      {/* ── Subject tabs ── */}
      <div style={{ display: 'flex', background: '#fff', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
        {subjects.map((subj) => {
          const subjQs = bySubject[subj] ?? [];
          const firstIdx = questions.findIndex((q) => q.subject === subj);
          const isActive = currentQ.subject === subj;
          const answeredCount = subjQs.filter((q) => !!answers[q.mockQuestionId]).length;
          return (
            <button
              key={subj}
              onClick={() => goTo(firstIdx)}
              style={{
                flex: 1, padding: '10px 16px', border: 'none', cursor: 'pointer',
                background: isActive ? '#fff' : '#f8fafc',
                borderBottom: isActive ? `3px solid ${SUBJECT_COLOR[subj]}` : '3px solid transparent',
                color: isActive ? SUBJECT_COLOR[subj] : '#64748b',
                fontWeight: isActive ? 700 : 500, fontSize: 13,
                transition: 'all 0.15s',
              }}
            >
              {subj}
              <span style={{
                marginLeft: 8, fontSize: 11, padding: '1px 6px', borderRadius: 9999,
                background: isActive ? `${SUBJECT_COLOR[subj]}18` : '#e2e8f0',
                color: isActive ? SUBJECT_COLOR[subj] : '#64748b',
              }}>
                {answeredCount}/{subj === 'Mathematics' || subj === 'Physics' || subj === 'Chemistry' ? subjQs.length : '?'}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Main body ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Question area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Question header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>
              Question {currentQ.questionNumber} of {total}
            </span>
            <span style={{
              padding: '2px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 600,
              background: qt === 'mcq_multi' ? '#fef3c7' : qt === 'integer' ? '#eff6ff' : '#f1f5f9',
              color: qt === 'mcq_multi' ? '#92400e' : qt === 'integer' ? '#1e40af' : '#475569',
            }}>
              {qt === 'mcq_single' ? 'Single Correct' : qt === 'mcq_multi' ? 'Multi-Correct' : 'Integer Type'}
            </span>
            <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 'auto' }}>
              {currentQ.topic} · {currentQ.difficulty}
            </span>
          </div>

          {/* Question text */}
          <div style={{
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8,
            padding: '20px 24px', fontSize: 15, lineHeight: 1.7, color: '#1e293b',
          }}>
            <MathText text={currentQ.questionText} />
          </div>

          {/* Options / Input */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '16px 20px' }}>
            {qt === 'integer' ? (
              <div>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>
                  Enter your answer (integer):
                </div>
                <input
                  type="number"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type integer answer"
                  style={{
                    width: 160, padding: '10px 14px', border: '2px solid #cbd5e1',
                    borderRadius: 6, fontSize: 16, fontFamily: 'monospace',
                    outline: 'none', color: '#1e293b',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#1e293b')}
                  onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {qt === 'mcq_multi' && (
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                    Select one or more correct options
                  </div>
                )}
                {currentQ.options.map((opt, i) => {
                  const letter = options[i]!;
                  const isSelected = qt === 'mcq_single' ? draft === letter : multiSelected.has(letter);
                  return (
                    <button
                      key={letter}
                      onClick={() => {
                        if (qt === 'mcq_single') setDraft(isSelected ? '' : letter);
                        else toggleMulti(letter);
                      }}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 14, padding: '12px 16px',
                        border: `2px solid ${isSelected ? '#1e293b' : '#e2e8f0'}`,
                        borderRadius: 7, background: isSelected ? '#f1f5f9' : '#fff',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.12s',
                      }}
                    >
                      <span style={{
                        flexShrink: 0, width: 26, height: 26,
                        borderRadius: qt === 'mcq_single' ? '50%' : 4,
                        border: `2px solid ${isSelected ? '#1e293b' : '#94a3b8'}`,
                        background: isSelected ? '#1e293b' : '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: isSelected ? '#fff' : '#64748b',
                      }}>
                        {letter}
                      </span>
                      <span style={{ fontSize: 14, color: '#1e293b', lineHeight: 1.5, paddingTop: 2 }}>
                        <MathText text={stripPrefix(opt)} />
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingBottom: 20 }}>
            <button
              onClick={() => saveAndNext(false)}
              style={{
                padding: '10px 20px', background: '#1e293b', color: '#fff',
                border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Save &amp; Next
            </button>
            <button
              onClick={markForReview}
              style={{
                padding: '10px 20px', background: '#7c3aed', color: '#fff',
                border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Mark for Review &amp; Next
            </button>
            <button
              onClick={clearResponse}
              style={{
                padding: '10px 20px', background: '#fff', color: '#ef4444',
                border: '1px solid #fca5a5', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Clear Response
            </button>
            <div style={{ flex: 1 }} />
            <button
              onClick={() => currentIdx > 0 && goTo(currentIdx - 1)}
              disabled={currentIdx === 0}
              style={{
                padding: '10px 16px', background: '#fff', color: currentIdx === 0 ? '#94a3b8' : '#1e293b',
                border: `1px solid ${currentIdx === 0 ? '#e2e8f0' : '#cbd5e1'}`,
                borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              ← Back
            </button>
            <button
              onClick={() => currentIdx < total - 1 && goTo(currentIdx + 1)}
              disabled={currentIdx === total - 1}
              style={{
                padding: '10px 16px', background: '#fff', color: currentIdx === total - 1 ? '#94a3b8' : '#1e293b',
                border: `1px solid ${currentIdx === total - 1 ? '#e2e8f0' : '#cbd5e1'}`,
                borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: currentIdx === total - 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Next →
            </button>
          </div>

          {errorMsg && <div style={{ color: '#dc2626', fontSize: 13 }}>{errorMsg}</div>}
        </div>

        {/* ── Question Palette ── */}
        <div style={{
          width: 268, flexShrink: 0, background: '#fff', borderLeft: '1px solid #e2e8f0',
          overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 16,
        }}>
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
        </div>
      </div>

      {/* ── Submit confirmation modal ── */}
      {showSubmitModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
        }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 28, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>Submit Exam?</h3>
            <div style={{ fontSize: 14, color: '#475569', marginBottom: 20, lineHeight: 1.6 }}>
              You have answered <strong>{totalAnswered}</strong> of <strong>{total}</strong> questions.
              {total - totalAnswered > 0 && (
                <> <span style={{ color: '#dc2626' }}>{total - totalAnswered} question{total - totalAnswered > 1 ? 's' : ''} unanswered.</span></>
              )}
              <br />This action cannot be undone.
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowSubmitModal(false)}
                style={{ padding: '9px 20px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', color: '#475569', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Review Answers
              </button>
              <button
                onClick={() => handleSubmit(true)}
                style={{ padding: '9px 20px', border: 'none', borderRadius: 6, background: '#1e293b', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
