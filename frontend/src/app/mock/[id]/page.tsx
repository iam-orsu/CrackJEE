'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import type { MockExam } from '@/types';

import { MathText, stripOptionPrefix } from '@/lib/math';
import { OrbitalLoader } from '@/components/ui/OrbitalLoader';
import { Badge, qtypeVariant, difficultyVariant } from '@/components/ui/Badge';
import { qStatus, type QStatus } from '@/components/mock/examStatus';
import { SUBJECT_COLOR } from '@/lib/subjects';
import { ExamPalette } from '@/components/mock/ExamPalette';
import { SubmitModal } from '@/components/mock/SubmitModal';

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


/* ══════════════════════════════════════════════════════════════
   Main component
══════════════════════════════════════════════════════════════ */

export default function MockExamPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;

  const [exam, setExam] = useState<MockExam | null>(null);
  const [pageStatus, setPageStatus] = useState<'loading' | 'polling' | 'exam' | 'submitting' | 'error'>('loading');
  // Set while the paper is generating, so the wait message names only this exam's time
  const [pendingExamType, setPendingExamType] = useState<string | null>(null);
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

  // Per-question time tracking
  const questionTimesRef = useRef<Record<string, number>>({});   // mqId → total seconds
  const questionEnteredAtRef = useRef<number | null>(null);      // epoch ms when current question was entered

  // UI
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const submittingRef = useRef(false);

  // Ref to the latest handleSubmit so timer/visibilitychange callbacks never call a stale closure
  const handleSubmitRef = useRef<(auto?: boolean) => Promise<void>>(async () => undefined);

  // Latest state for handlers that run outside a render (the timer interval and auto-submit)
  const stateRef = useRef({ exam: null as MockExam | null, currentIdx: 0, draft: '' });
  stateRef.current = { exam, currentIdx, draft };
  // Answer saves go out one at a time, in order, so the last choice the student made is the one stored
  const saveChainRef = useRef<Promise<void>>(Promise.resolve());
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (pollTimerRef.current) clearTimeout(pollTimerRef.current); }, []);

  /* ── Load exam ── */
  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    loadExam();
  }, [examId]);

  async function loadExam() {
    try {
      const data = await api.mock.get(examId);
      if (data.status === 'error') { setPageStatus('error'); setLoadMsg('Exam generation failed. Please try again.'); return; }
      if (data.status === 'generating') { setPendingExamType(data.examType); setPageStatus('polling'); pollForReady(); return; }
      // A finished exam belongs on its result page; the exam screen would show a timer and answers that can't be saved
      if (data.status === 'submitted') { router.replace(`/mock/${examId}/result`); return; }
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
    const MAX_ATTEMPTS = 100; // ~5 minutes at 3s intervals (NEET first-gen takes 3-4 min)
    let attempt = 0;
    const poll = async (): Promise<void> => {
      if (attempt >= MAX_ATTEMPTS) {
        setPageStatus('error');
        setLoadMsg('Exam generation timed out. Please go back and try again.');
        return;
      }
      setLoadMsg(MESSAGES[attempt % MESSAGES.length]!);
      attempt++;
      try {
        const data = await api.mock.get(examId);
        if (data.status === 'generating') { pollTimerRef.current = setTimeout(poll, 3000); return; }
        if (data.status === 'error') { setPageStatus('error'); setLoadMsg('Exam generation failed.'); return; }
        // A finished exam belongs on its result page; the exam screen would show a timer and answers that can't be saved
        if (data.status === 'submitted') { router.replace(`/mock/${examId}/result`); return; }
        await initializeExam(data);
      } catch {
        pollTimerRef.current = setTimeout(poll, 4000);
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
    // Mark first question as visited and record entry time
    if (data.questions[0]) {
      setVisited((p) => ({ ...p, [data.questions[0]!.mockQuestionId]: true }));
      setDraft(initAnswers[data.questions[0]!.mockQuestionId] ?? '');
      questionEnteredAtRef.current = Date.now();
    }
  }

  /* ── Timer ── */
  useEffect(() => {
    if (pageStatus !== 'exam' || !startedAt) return;

    const durationSeconds = exam?.durationSeconds ?? 10800;

    function checkAndAutoSubmit() {
      const elapsed = Math.floor((Date.now() - new Date(startedAt!).getTime()) / 1000);
      const remaining = Math.max(0, durationSeconds - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) void handleSubmitRef.current(true);
    }

    // Immediately check on mount — catches the case where a student reloads an expired exam
    // or returns to a tab where time has already run out.
    checkAndAutoSubmit();

    timerRef.current = setInterval(checkAndAutoSubmit, 1000);

    // When the laptop wakes from sleep or the student switches back to this tab, the
    // setInterval may have been throttled/frozen. Run an immediate check so the exam
    // auto-submits within milliseconds of the tab becoming active again.
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') checkAndAutoSubmit();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [pageStatus, startedAt, exam?.durationSeconds]);

  /* ── Navigate between questions ── */
  const currentQ = exam?.questions[currentIdx] ?? null;

  function flushCurrentQuestionTime() {
    const { exam: ex, currentIdx: idx } = stateRef.current;
    if (!ex) return;
    const prev = ex.questions[idx];
    if (prev && questionEnteredAtRef.current !== null) {
      const elapsed = Math.floor((Date.now() - questionEnteredAtRef.current) / 1000);
      const mqId = prev.mockQuestionId;
      questionTimesRef.current[mqId] = (questionTimesRef.current[mqId] ?? 0) + elapsed;
      questionEnteredAtRef.current = null;
    }
  }

  function goTo(idx: number) {
    if (!exam) return;
    const q = exam.questions[idx];
    if (!q) return;
    flushCurrentQuestionTime();
    setCurrentIdx(idx);
    setDraft(answers[q.mockQuestionId] ?? '');
    setVisited((p) => ({ ...p, [q.mockQuestionId]: true }));
    questionEnteredAtRef.current = Date.now();
  }

  /* ── Answer actions ── */

  /* Store one question's answer, locally and on the server. Every choice is saved as it is made, so moving
     between questions, the palette, or auto-submit can never drop it. Saves are queued, so they arrive in order. */
  function persistAnswer(mqId: string, value: string, markedForReview?: boolean) {
    setAnswers((p) => {
      const n = { ...p };
      if (value) n[mqId] = value; else delete n[mqId];
      return n;
    });
    saveChainRef.current = saveChainRef.current
      .then(() => api.mock.saveAnswer(examId, { mockQuestionId: mqId, answer: value, markedForReview }))
      .then(() => undefined, () => undefined);
  }

  function saveAndNext(doMark?: boolean) {
    if (!currentQ) return;
    const mqId = currentQ.mockQuestionId;

    if (doMark !== undefined) setMarked((p) => ({ ...p, [mqId]: doMark }));
    persistAnswer(mqId, draft, doMark);

    // Move to next question
    if (currentIdx < (exam?.questions.length ?? 0) - 1) {
      goTo(currentIdx + 1);
    }
  }

  function markForReview() {
    if (!currentQ) return;
    const mqId = currentQ.mockQuestionId;

    setMarked((p) => ({ ...p, [mqId]: true }));
    persistAnswer(mqId, draft, true);

    if (currentIdx < (exam?.questions.length ?? 0) - 1) {
      goTo(currentIdx + 1);
    }
  }

  function clearResponse() {
    if (!currentQ) return;
    const mqId = currentQ.mockQuestionId;
    setDraft('');
    persistAnswer(mqId, '');
  }

  /* ── Submit ── */
  async function handleSubmit(auto = false) {
    if (submittingRef.current) return;
    if (!auto && !showSubmitModal) { setShowSubmitModal(true); return; }
    submittingRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    // Flush time for current question before submitting
    flushCurrentQuestionTime();
    // Store the question on screen (e.g. an integer typed but not yet blurred) before the exam closes
    const cur = stateRef.current;
    const curQ = cur.exam?.questions[cur.currentIdx];
    if (curQ) persistAnswer(curQ.mockQuestionId, cur.draft);
    setPageStatus('submitting');
    setShowSubmitModal(false);
    try {
      await saveChainRef.current;
      await api.mock.submit(examId, questionTimesRef.current);
      router.push(`/mock/${examId}/result`);
    } catch (e) {
      submittingRef.current = false;
      setErrorMsg(e instanceof Error ? e.message : 'Submission failed');
      setPageStatus('exam');
    }
  }

  // Keep handleSubmitRef pointing to the latest version every render so the timer interval
  // and visibilitychange callback never call a stale closure.
  handleSubmitRef.current = handleSubmit;

  /* ── Multi-correct toggle ── */
  function toggleMulti(letter: string) {
    const parts = draft ? draft.split(',').map((s) => s.trim()).filter(Boolean) : [];
    const idx = parts.indexOf(letter);
    if (idx >= 0) parts.splice(idx, 1); else parts.push(letter);
    parts.sort();
    const next = parts.join(',');
    setDraft(next);
    if (currentQ) persistAnswer(currentQ.mockQuestionId, next);
  }

  /* ── Loading / polling screen ── */
  if (pageStatus === 'loading' || pageStatus === 'polling') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <OrbitalLoader
          message={loadMsg}
          submessage={pageStatus === 'polling' && pendingExamType
            ? (pendingExamType === 'NEET' ? 'NEET first load takes 3–4 minutes' : 'JEE takes about 60–90 seconds')
            : undefined}
        />
      </div>
    );
  }

  if (pageStatus === 'error') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ fontSize: 16, color: '#dc2626', marginBottom: 16 }}>{loadMsg}</div>
        <Link href="/mock" style={{ color: 'var(--gray-700)', textDecoration: 'underline' }}>Back to Mock Tests</Link>
      </div>
    );
  }

  if (pageStatus === 'submitting') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <OrbitalLoader message="Evaluating your answers…" />
      </div>
    );
  }

  if (!exam || !currentQ) return null;

  const questions = exam.questions;
  const isNEET = exam.examType === 'NEET';
  const subjects = isNEET
    ? (['Physics', 'Chemistry', 'Botany', 'Zoology'] as const)
    : (['Physics', 'Chemistry', 'Mathematics'] as const);
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
        background: '#fff', color: '#1e293b', padding: '0 20px', height: 52, flexShrink: 0,
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ display: 'inline-flex' }}>
            <img src="/logo.png" alt="JEENEET.ai" className="site-logo" />
          </span>
          <span style={{ width: 1, height: 20, background: '#e2e8f0' }} />
          <span style={{ fontSize: 14, color: '#64748b' }}>
            {exam.examType === 'NEET' ? 'NEET UG Mock Test' : `JEE ${exam.examType} Mock Test`}
          </span>
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
            background: '#fff', color: '#1e293b', border: '1px solid #cbd5e1',
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
                {answeredCount}/{subjQs.length}
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
            <Badge variant={qtypeVariant(qt)}>
              {qt === 'mcq_single' ? 'Single Correct' : qt === 'mcq_multi' ? 'Multi-Correct' : 'Integer Type'}
            </Badge>
            <Badge variant={difficultyVariant(currentQ.difficulty)}>
              {currentQ.difficulty}
            </Badge>
            <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 'auto' }}>
              {currentQ.topic}
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
                  onBlur={(e) => {
                    e.target.style.borderColor = '#cbd5e1';
                    // Save what was typed once the field is left; Save & Next, navigation and submit also save it
                    persistAnswer(currentQ.mockQuestionId, e.target.value);
                  }}
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
                        if (qt === 'mcq_single') {
                          const next = isSelected ? '' : letter;
                          setDraft(next);
                          persistAnswer(currentQ.mockQuestionId, next);
                        } else {
                          toggleMulti(letter);
                        }
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
          <ExamPalette
            totalAnswered={totalAnswered}
            totalMarked={totalMarked}
            statusCounts={statusCounts}
            subjects={subjects}
            bySubject={bySubject}
            questions={questions}
            answers={answers}
            marked={marked}
            visited={visited}
            currentIdx={currentIdx}
            goTo={goTo}
          />
        </div>
      </div>

      {/* ── Submit confirmation modal ── */}
      {showSubmitModal && (
        <SubmitModal
          totalAnswered={totalAnswered}
          total={total}
          onConfirm={() => handleSubmit(true)}
          onCancel={() => setShowSubmitModal(false)}
        />
      )}
    </div>
  );
}
