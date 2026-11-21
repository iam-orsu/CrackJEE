'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { getUser, isAuthenticated } from '@/lib/auth';
import type { MockExam, User } from '@/types';

import { MathText, stripOptionPrefix } from '@/lib/math';
import { MatchListTable, parseMatchQuestion } from '@/components/common/MatchListTable';
import { DiagramRenderer } from '@/components/DiagramRenderer';
import Loader from '@/components/loader';
import { qStatus, type QStatus } from '@/components/mock/examStatus';
import { ExamPalette } from '@/components/mock/ExamPalette';
import { SubmitModal } from '@/components/mock/SubmitModal';
import { EX, FONT_MONO, FONT_SANS } from '@/components/mock/examTheme';

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

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]!));
}

/* A small ruled tag, like a field on an official form */
const TAG: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 8px',
  border: `1px solid ${EX.line}`,
  borderRadius: 2,
  background: EX.paper,
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: EX.ink2,
  whiteSpace: 'nowrap',
};

/* Hover and focus live in CSS so inline styles stay declarative */
const EXAM_CSS = `
  .exa-btn { font: inherit; cursor: pointer; transition: background .12s, border-color .12s, color .12s; }
  .exa-btn:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(29, 78, 137, .22); }
  .exa-btn:disabled { cursor: not-allowed; }
  .exa-primary { background: ${EX.accent}; color: #fff; border: 1px solid ${EX.accentDark}; }
  .exa-primary:hover:not(:disabled) { background: ${EX.accentDark}; }
  .exa-outline { background: #fff; color: ${EX.accent}; border: 1px solid ${EX.accent}; }
  .exa-outline:hover:not(:disabled) { background: ${EX.accentWash}; }
  .exa-ghost { background: #fff; color: ${EX.ink}; border: 1px solid ${EX.line}; }
  .exa-ghost:hover:not(:disabled) { background: #F7F9FC; border-color: #AEBBCB; }
  .exa-danger { background: #fff; color: ${EX.danger}; border: 1px solid ${EX.dangerLine}; }
  .exa-danger:hover:not(:disabled) { background: #FDF1F0; border-color: #D9A5A0; }
  .exa-opt { transition: border-color .12s, background .12s; }
  .exa-opt:hover { border-color: #AEBBCB; }
  .exa-opt.is-selected:hover { border-color: ${EX.accent}; }
  /* Candidate watermark: tiled behind glass, never intercepts the pointer */
  .exa-watermark {
    position: absolute; inset: 0; z-index: 1;
    pointer-events: none; user-select: none; -webkit-user-select: none;
    background-repeat: repeat;
  }

  /* Phone and small tablet: the CBT shell becomes one scrolling column.
     The palette drops below the question so neither is squeezed. */
  @media (max-width: 900px) {
    .exa-root { height: auto !important; min-height: 100dvh; }
    .exa-top { height: auto !important; padding: 8px 12px !important; gap: 10px !important; flex-wrap: wrap; }
    .exa-top-left { gap: 10px !important; }
    .exa-top-rule, .exa-top-title, .exa-offline { display: none !important; }
    .exa-cand, .exa-cand-rule { display: none !important; }
    .exa-timer { padding: 4px 10px !important; gap: 8px !important; }
    .exa-submit { padding: 8px 14px !important; font-size: 11px !important; }
    .exa-main { flex-direction: column !important; overflow: visible !important; flex: 1 0 auto !important; }
    .exa-qarea { flex: 0 0 auto !important; overflow: visible !important; padding: 16px 14px 20px !important; }
    .exa-qcard { padding: 18px 16px !important; }
    .exa-optcard { padding: 14px !important; }
    .exa-palette {
      width: 100% !important; border-left: 0 !important; border-top: 1px solid ${EX.line};
      overflow: visible !important; padding: 16px 14px 24px !important;
    }
  }
  @media (max-width: 400px) {
    .exa-logo { height: 34px !important; }
    .exa-top { padding: 8px 10px !important; gap: 8px !important; }
    .exa-qarea { padding: 14px 10px 18px !important; }
    .exa-palette { padding: 14px 10px 22px !important; }
  }
`;


/* ══════════════════════════════════════════════════════════════
   Main component
══════════════════════════════════════════════════════════════ */

export default function MockExamPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;

  const [exam, setExam] = useState<MockExam | null>(null);
  const [pageStatus, setPageStatus] = useState<'loading' | 'polling' | 'exam' | 'submitting' | 'error'>('loading');
  // Read from storage after mount so the server and first client render agree
  const [candidate, setCandidate] = useState<User | null>(null);
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
  const pendingSyncRef = useRef<Map<string, { answer: string; markedForReview?: boolean }>>(new Map());
  const [isOnline, setIsOnline] = useState(true);

  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, []);

  // The candidate's name is stored with the session; load it after mount
  useEffect(() => { setCandidate(getUser()); }, []);

  const flushPendingAnswers = useCallback(async () => {
    if (pendingSyncRef.current.size === 0) return;
    const entries = Array.from(pendingSyncRef.current.entries());
    for (const [mqId, item] of entries) {
      try {
        await api.mock.saveAnswer(examId, { mockQuestionId: mqId, answer: item.answer, markedForReview: item.markedForReview });
        pendingSyncRef.current.delete(mqId);
      } catch {
        break; // Still offline, wait for next online event
      }
    }
  }, [examId]);

  const initializeExam = useCallback(async (data: MockExam) => {
    if (!mountedRef.current) return;
    // Initialize local state from server-saved answers
    const initAnswers: Record<string, string> = {};
    const initMarked: Record<string, boolean> = {};
    for (const q of data.questions) {
      if (q.savedAnswer) initAnswers[q.mockQuestionId] = q.savedAnswer;
      if (q.markedForReview) initMarked[q.mockQuestionId] = true;
    }

    // Restore any local offline answers that hadn't reached the server before a reload
    try {
      const local = localStorage.getItem(`mock_answers_${examId}`);
      if (local) {
        const parsed = JSON.parse(local) as Record<string, { answer: string; markedForReview?: boolean }>;
        for (const [mqId, val] of Object.entries(parsed)) {
          if (val?.answer) {
            initAnswers[mqId] = val.answer;
            // Also queue it to sync with server if it wasn't already in data.questions
            if (!data.questions.find((q) => q.mockQuestionId === mqId && q.savedAnswer === val.answer)) {
              pendingSyncRef.current.set(mqId, val);
            }
          }
          if (val?.markedForReview !== undefined) initMarked[mqId] = val.markedForReview;
        }
      }
    } catch {}

    setAnswers(initAnswers);
    setMarked(initMarked);
    setExam(data);
    if (pendingSyncRef.current.size > 0) void flushPendingAnswers();

    // Start or get startedAt
    let sa = data.startedAt;
    if (data.status === 'ready' || (!sa && data.status === 'in_progress')) {
      try {
        const res = await api.mock.begin(examId);
        sa = res.startedAt;
      } catch {}
    }
    if (!mountedRef.current) return;
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
  }, [examId, flushPendingAnswers]);

  const pollForReady = useCallback(() => {
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
      if (!mountedRef.current) return;
      if (attempt >= MAX_ATTEMPTS) {
        setPageStatus('error');
        setLoadMsg('Exam generation timed out. Please go back and try again.');
        return;
      }
      setLoadMsg(MESSAGES[attempt % MESSAGES.length]!);
      attempt++;
      try {
        const data = await api.mock.get(examId);
        if (!mountedRef.current) return;
        if (data.status === 'generating') { pollTimerRef.current = setTimeout(poll, 3000); return; }
        if (data.status === 'error') { setPageStatus('error'); setLoadMsg('Exam generation failed.'); return; }
        // A finished exam belongs on its result page; the exam screen would show a timer and answers that can't be saved
        if (data.status === 'submitted') { router.replace(`/mock/${examId}/result`); return; }
        await initializeExam(data);
      } catch {
        if (mountedRef.current) pollTimerRef.current = setTimeout(poll, 4000);
      }
    };
    void poll();
  }, [examId, router, initializeExam]);

  /* ── Network online/offline listener ── */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsOnline(navigator.onLine);

    const onOnline = () => {
      setIsOnline(true);
      void flushPendingAnswers();
    };
    const onOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [flushPendingAnswers]);

  /* ── Load exam ── */
  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    let cancelled = false;
    async function loadExam() {
      try {
        const data = await api.mock.get(examId);
        if (cancelled) return;
        if (data.status === 'error') { setPageStatus('error'); setLoadMsg('Exam generation failed. Please try again.'); return; }
        if (data.status === 'generating') { setPendingExamType(data.examType); setPageStatus('polling'); pollForReady(); return; }
        if (data.status === 'submitted') { router.replace(`/mock/${examId}/result`); return; }
        await initializeExam(data);
      } catch {
        if (!cancelled) {
          setPageStatus('error');
          setLoadMsg('Failed to load exam.');
        }
      }
    }
    void loadExam();
    return () => { cancelled = true; };
  }, [examId, router, pollForReady, initializeExam]);

  /* ── Fullscreen: the exam runs full-window when the browser allows it ── */
  useEffect(() => {
    if (pageStatus !== 'exam') return;
    if (typeof document === 'undefined' || document.fullscreenElement) return;
    document.documentElement.requestFullscreen?.().catch(() => {
      // Refused without a recent user gesture (e.g. a page reload) — the exam still works windowed
    });
  }, [pageStatus]);

  /* Leaving the exam (submit, back button, any navigation) releases fullscreen.
     The short delay lets StrictMode's dev-only mount/unmount cycle cancel itself. */
  const fsExitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (fsExitTimerRef.current) {
      clearTimeout(fsExitTimerRef.current);
      fsExitTimerRef.current = null;
    }
    return () => {
      fsExitTimerRef.current = setTimeout(() => {
        fsExitTimerRef.current = null;
        if (typeof document !== 'undefined' && document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
      }, 250);
    };
  }, []);

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

    // 1. Mirror to localStorage immediately (never lost on reload, sleep, or tab crash)
    try {
      const local = JSON.parse(localStorage.getItem(`mock_answers_${examId}`) ?? '{}');
      if (value || markedForReview) local[mqId] = { answer: value, markedForReview };
      else delete local[mqId];
      localStorage.setItem(`mock_answers_${examId}`, JSON.stringify(local));
    } catch {}

    // 2. Track in pendingSyncRef
    pendingSyncRef.current.set(mqId, { answer: value, markedForReview });

    // 3. Queue server sync
    saveChainRef.current = saveChainRef.current
      .then(async () => {
        await api.mock.saveAnswer(examId, { mockQuestionId: mqId, answer: value, markedForReview });
        pendingSyncRef.current.delete(mqId);
      })
      .catch(() => {
        // Preserved in pendingSyncRef and localStorage to retry when back online
      });
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
      if (pendingSyncRef.current.size > 0) {
        await flushPendingAnswers();
      }
      await api.mock.submit(examId, questionTimesRef.current);
      try { localStorage.removeItem(`mock_answers_${examId}`); } catch {}
      if (typeof document !== 'undefined' && document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
      router.replace(`/mock/${examId}/result`);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Submission failed';
      if (message.toLowerCase().includes('already submitted')) {
        try { localStorage.removeItem(`mock_answers_${examId}`); } catch {}
        if (typeof document !== 'undefined' && document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
        router.replace(`/mock/${examId}/result`);
        return;
      }
      submittingRef.current = false;
      setErrorMsg(message);
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
    const subMsg = pageStatus === 'polling' && pendingExamType
      ? (pendingExamType === 'NEET' ? 'NEET first load takes 3–4 minutes' : 'JEE takes about 60–90 seconds')
      : undefined;
    return (
      <Loader fullScreen size={180} text={subMsg ? `${loadMsg} — ${subMsg}` : loadMsg} />
    );
  }

  if (pageStatus === 'error') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: EX.paper, fontFamily: FONT_SANS }}>
        <div style={{ fontSize: 16, color: EX.danger, marginBottom: 16 }}>{loadMsg}</div>
        <Link href="/mock" style={{ color: EX.accent, textDecoration: 'underline' }}>Back to Mock Tests</Link>
      </div>
    );
  }

  if (pageStatus === 'submitting') {
    return <Loader fullScreen size={180} text="Evaluating your answers…" />;
  }

  if (!exam || !currentQ) return null;

  const questions = exam.questions;
  const isPsychometric = (exam.examType as string) === 'Psychometric' || questions.some((q) => q.subject === 'Psychometric');
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

  const timerColor = timeLeft < 600 ? EX.danger : timeLeft < 1800 ? EX.warn : EX.ink;

  const qt = currentQ.questionType;
  const qtypeLabel = qt === 'mcq_single' ? 'Single Correct' : qt === 'mcq_multi' ? 'Multi-Correct' : qt === 'matrix_match' ? 'Matrix Match' : 'Integer Type';
  const options = ['A', 'B', 'C', 'D'];
  const multiSelected = new Set(draft ? draft.split(',').map((s) => s.trim()).filter(Boolean) : []);

  // Tiled candidate watermark, the way proctored exams mark the paper
  const watermarkName = escapeXml(candidate?.name ?? 'JEENEET.AI');
  const watermarkExam = escapeXml(exam.examType === 'NEET' ? 'NEET (UG) · MOCK TEST' : `JEE ${exam.examType} · MOCK TEST`);
  const watermarkSvg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="230">` +
    `<g transform="rotate(-24 190 115)" fill="${EX.ink}" fill-opacity="0.07" font-family="Inter, Segoe UI, sans-serif" text-anchor="middle">` +
    `<text x="190" y="108" font-size="15" font-weight="600" letter-spacing="2.4">${watermarkName}</text>` +
    `<text x="190" y="130" font-size="9" font-weight="600" letter-spacing="3">${watermarkExam}</text>` +
    `</g></svg>`;

  return (
    <div className="exa-root" style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: EX.ground, fontFamily: FONT_SANS, color: EX.ink }}>
      <style>{EXAM_CSS}</style>

      {/* ── Top bar ── */}
      <div className="exa-top" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        background: EX.paper, padding: '0 24px', height: 60, flexShrink: 0,
        borderBottom: `1px solid ${EX.line}`,
      }}>
        <div className="exa-top-left" style={{ display: 'flex', alignItems: 'center', gap: 20, minWidth: 0 }}>
          <span style={{ display: 'inline-flex', flexShrink: 0 }}>
            <Image src="/logo.png" alt="JEENEET.ai" width={103} height={42} className="exa-logo" style={{ display: 'block', height: 42, width: 'auto' }} />
          </span>
          <span className="exa-top-rule" style={{ width: 1, height: 28, background: EX.line, flexShrink: 0 }} />
          <div className="exa-top-title" style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: EX.mute }}>
              Mock examination · CBT
            </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: EX.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {exam.examType === 'NEET' ? 'NEET (UG)' : `JEE ${exam.examType}`} — Mock Test
            </span>
          </div>
          {!isOnline && (
            <span className="exa-offline" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
              fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: EX.warn, background: EX.warnWash, border: `1px solid ${EX.warnLine}`,
              borderRadius: 2, padding: '3px 8px',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C7861A' }} />
              Offline — saved locally
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          {candidate && (
            <>
              <div className="exa-cand" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, minWidth: 0 }}>
                <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: EX.mute }}>
                  Candidate
                </span>
                <span
                  title={candidate.name}
                  style={{
                    fontSize: 13, fontWeight: 600, color: EX.ink, maxWidth: 200,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}
                >
                  {candidate.name}
                </span>
              </div>
              <span className="exa-cand-rule" style={{ width: 1, height: 28, background: EX.line, flexShrink: 0 }} />
            </>
          )}
          <div className="exa-timer" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: EX.paper, border: `1px solid ${EX.line}`,
            borderRadius: 3, padding: '5px 14px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={EX.mute} strokeWidth="2" aria-hidden>
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: EX.mute, lineHeight: '11px' }}>
                Time remaining
              </span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 16, fontWeight: 700, lineHeight: '18px', fontVariantNumeric: 'tabular-nums', color: timerColor }}>
                {fmtTime(timeLeft)}
              </span>
            </div>
          </div>
          <button
            onClick={() => handleSubmit(false)}
            className="exa-btn exa-primary exa-submit"
            style={{
              padding: '9px 22px', borderRadius: 3, fontSize: 11.5,
              fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* ── Submission error banner (if network/server drops) ── */}
      {errorMsg && (
        <div style={{
          background: '#FDF1F0', borderBottom: `1px solid ${EX.dangerLine}`, color: EX.danger,
          padding: '10px 24px', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <span><strong>Submission error:</strong> {errorMsg}. Please check your connection and click Submit Test again.</span>
          <button onClick={() => setErrorMsg('')} style={{ background: 'transparent', border: 'none', color: EX.danger, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>✕</button>
        </div>
      )}

      {/* ── Main body ── */}
      <div className="exa-main" style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div
          aria-hidden
          className="exa-watermark"
          style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(watermarkSvg)}")` }}
        />

        {/* Question area */}
        <div className="exa-qarea" style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Question header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {isPsychometric ? (
              <span style={{ fontSize: 15, fontWeight: 700, color: EX.ink, marginRight: 4 }}>
                Assessment Question
              </span>
            ) : (
              <span style={{ fontSize: 15, fontWeight: 700, color: EX.ink, marginRight: 4 }}>
                Question {currentQ.questionNumber} <span style={{ fontWeight: 500, color: EX.mute }}>of {total}</span>
              </span>
            )}
            <span style={TAG}>{currentQ.subject}</span>
            <span style={TAG}>{qtypeLabel}</span>
            <span style={TAG}>{currentQ.difficulty}</span>
            <span style={{ fontSize: 11, color: EX.mute, marginLeft: 'auto' }}>
              {currentQ.topic}
            </span>
          </div>

          {/* Question text */}
          <div className="exa-qcard" style={{
            background: EX.paper, border: `1px solid ${EX.line}`, borderRadius: 3,
            padding: '24px 28px', fontSize: 15, lineHeight: 1.75, color: EX.ink,
          }}>
            {qt === 'matrix_match' || parseMatchQuestion(currentQ.questionText) ? (
              <MatchListTable questionText={currentQ.questionText} />
            ) : (
              <MathText text={currentQ.questionText} />
            )}
            {currentQ.diagram && (
              <div style={{ marginTop: 18, maxWidth: 440 }}>
                <DiagramRenderer descriptor={currentQ.diagram} />
              </div>
            )}
          </div>

          {/* Options / Input */}
          <div className="exa-optcard" style={{ background: EX.paper, border: `1px solid ${EX.line}`, borderRadius: 3, padding: '18px 20px' }}>
            {qt === 'integer' ? (
              <div>
                <div style={{ fontSize: 12.5, color: EX.mute, marginBottom: 10 }}>
                  Enter your answer (integer)
                </div>
                <input
                  type="number"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type integer answer"
                  style={{
                    width: 168, padding: '10px 14px', border: `1px solid ${EX.line}`,
                    borderRadius: 3, fontSize: 16, fontFamily: FONT_MONO,
                    outline: 'none', color: EX.ink, background: EX.paper,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = EX.accent;
                    e.target.style.boxShadow = '0 0 0 3px rgba(29, 78, 137, .16)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = EX.line;
                    e.target.style.boxShadow = 'none';
                    // Save what was typed once the field is left; Save & Next, navigation and submit also save it
                    persistAnswer(currentQ.mockQuestionId, e.target.value);
                  }}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {qt === 'mcq_multi' && (
                  <div style={{ fontSize: 12.5, color: EX.mute, marginBottom: 4 }}>
                    Select one or more correct options
                  </div>
                )}
                {currentQ.options.map((opt, i) => {
                  const letter = options[i]!;
                  const isSelected = qt === 'mcq_multi' ? multiSelected.has(letter) : draft === letter;
                  return (
                    <button
                      key={letter}
                      className={`exa-opt${isSelected ? ' is-selected' : ''}`}
                      onClick={() => {
                        if (qt === 'mcq_multi') {
                          toggleMulti(letter);
                        } else {
                          const next = isSelected ? '' : letter;
                          setDraft(next);
                          persistAnswer(currentQ.mockQuestionId, next);
                        }
                      }}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 14, padding: '12px 16px',
                        border: `1.5px solid ${isSelected ? EX.accent : EX.line}`,
                        borderRadius: 3, background: isSelected ? EX.accentWash : EX.paper,
                        cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <span style={{
                        flexShrink: 0, width: 26, height: 26,
                        borderRadius: qt === 'mcq_multi' ? 3 : '50%',
                        border: `1.5px solid ${isSelected ? EX.accent : EX.faint}`,
                        background: isSelected ? EX.accent : EX.paper,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: FONT_MONO, fontSize: 12, fontWeight: 700,
                        color: isSelected ? '#fff' : EX.ink2,
                      }}>
                        {letter}
                      </span>
                      <span style={{ fontSize: 14, color: EX.ink, lineHeight: 1.55, paddingTop: 3 }}>
                        <MathText text={stripPrefix(opt)} />
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', paddingBottom: 24 }}>
            {!isPsychometric && (
              <>
                <button
                  onClick={() => saveAndNext(false)}
                  className="exa-btn exa-primary"
                  style={{ padding: '10px 22px', borderRadius: 3, fontSize: 12.5, fontWeight: 600 }}
                >
                  Save &amp; Next
                </button>
                <button
                  onClick={markForReview}
                  className="exa-btn exa-outline"
                  style={{ padding: '10px 22px', borderRadius: 3, fontSize: 12.5, fontWeight: 600 }}
                >
                  Mark for Review &amp; Next
                </button>
                <button
                  onClick={clearResponse}
                  className="exa-btn exa-danger"
                  style={{ padding: '10px 22px', borderRadius: 3, fontSize: 12.5, fontWeight: 600 }}
                >
                  Clear Response
                </button>
                <div style={{ flex: 1 }} />
              </>
            )}
            <button
              onClick={() => currentIdx > 0 && goTo(currentIdx - 1)}
              disabled={currentIdx === 0}
              className="exa-btn exa-ghost"
              style={{
                padding: '10px 18px', borderRadius: 3, fontSize: 12.5, fontWeight: 600,
                ...(currentIdx === 0 ? { color: EX.faint, borderColor: EX.lineSoft } : null),
              }}
            >
              ← Back
            </button>
            <button
              onClick={() => {
                if (currentIdx < total - 1) {
                  goTo(currentIdx + 1);
                } else if (isPsychometric) {
                  setShowSubmitModal(true);
                }
              }}
              disabled={!isPsychometric && currentIdx === total - 1}
              className={isPsychometric && currentIdx === total - 1 ? "exa-btn exa-primary" : "exa-btn exa-ghost"}
              style={{
                padding: '10px 18px', borderRadius: 3, fontSize: 12.5, fontWeight: 600,
                ...(!isPsychometric && currentIdx === total - 1 ? { color: EX.faint, borderColor: EX.lineSoft } : null),
              }}
            >
              {isPsychometric ? (currentIdx < total - 1 ? 'Next →' : 'Submit') : 'Next →'}
            </button>
          </div>

          {errorMsg && <div style={{ color: EX.danger, fontSize: 13 }}>{errorMsg}</div>}
        </div>

        {/* ── Question Palette (hidden for psychometric sequential flow) ── */}
        {!isPsychometric && (
          <div className="exa-palette" style={{
            width: 284, flexShrink: 0, background: EX.paper, borderLeft: `1px solid ${EX.line}`,
            overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 18,
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
        )}
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
