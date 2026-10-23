'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { isAuthenticated, getUser } from '@/lib/auth';
import { QuestionCard } from '@/components/QuestionCard';
import type { Question, AnswerResult, Subject, TopicProgress, PaperSet } from '@/types';
import type { SplitTopics } from '@/lib/api';
import { SUBJECT_META, REVIEW_SUBJ, LOAD_MESSAGES, previewText, formatPossible, PaperCard, CHECK_SVG, SUBJECTS_FOR_PAPERS, DIFFICULTY_LABELS } from '@/components/practice/shared';
import type { AppState, WizardStep, DiffOption, MarkingScheme, StoredResult } from '@/components/practice/shared';
import { SessionReview } from '@/components/practice/SessionReview';
import { SessionSummary } from '@/components/practice/SessionSummary';
import { ExamScreen } from '@/components/practice/ExamScreen';


/* ═══════════════════════════════════════════════════════════
   Main component
═══════════════════════════════════════════════════════════ */
export default function PracticePage() {
  const router = useRouter();
  const [studentClass, setStudentClass] = useState<string>('12');

  /* ── App state ── */
  const [appState, setAppState] = useState<AppState>('wizard');
  const [wizardStep, setWizardStep] = useState<WizardStep>(1);

  /* ── Wizard selections ── */
  const [selectedSubjects, setSelectedSubjects] = useState<Set<Subject>>(new Set(['Mathematics']));
  const [selectedTopics, setSelectedTopics] = useState<Partial<Record<Subject, Set<string>>>>({
    Mathematics: new Set(),
  });
  const [questionCount, setQuestionCount] = useState<number | 'custom'>(10);
  const [customCount, setCustomCount] = useState('');
  const [difficulty, setDifficulty] = useState<DiffOption>('mixed');
  const [examType, setExamType] = useState<'Main' | 'Advanced'>('Main');
  const [markingScheme, setMarkingScheme] = useState<MarkingScheme>('jee_main');

  /* ── Topics (fetched from API) ── */
  const [topicsByClass, setTopicsByClass] = useState<SplitTopics | null>(null);

  /* ── Question bank size (from the API) ── */
  const [bank, setBank] = useState<{ total: number; bySubject: Record<string, number> } | null>(null);

  /* ── Paper row (choose a paper before starting) ── */
  const [showPapers, setShowPapers] = useState(false);
  const [paperSets, setPaperSets] = useState<PaperSet[]>([]);
  const [possibleSets, setPossibleSets] = useState('0');
  const [papersLoading, setPapersLoading] = useState(false);
  const [papersError, setPapersError] = useState('');

  function getTopicsForStudent(subject: Subject) {
    const t = topicsByClass?.[subject];
    return t ?? { class11: [], class12: [] };
  }

  const bankTotal = bank ? bank.total.toLocaleString('en-IN') : '—';
  const topicTotal = topicsByClass
    ? Object.values(topicsByClass).reduce((n, t) => n + t.class11.length + t.class12.length, 0)
    : null;

  /* ── Weak mode ── */
  const [weakMode, setWeakMode] = useState(false);
  const [weakSource, setWeakSource] = useState<'global' | 'mock' | null>(null);
  const [weakStartLoading, setWeakStartLoading] = useState(false);

  /* ── Loading ── */
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadMsgIdx, setLoadMsgIdx] = useState(0);
  const [loadError, setLoadError] = useState('');

  /* ── Exam ── */
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [examResults, setExamResults] = useState<Record<number, StoredResult>>({});
  const [sessionSecs, setSessionSecs] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const sessionTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  /* ─── Persist exam session to sessionStorage ─────────── */
  useEffect(() => {
    if (appState === 'wizard' || appState === 'loading') return;
    try {
      sessionStorage.setItem('jeeneet_exam_session', JSON.stringify({
        appState,
        questions,
        currentIndex,
        examResults,
        sessionSecs,
        markingScheme,
      }));
    } catch {}
  }, [appState, questions, currentIndex, examResults, sessionSecs, markingScheme]);

  /* ─── Auth + weak mode init ──────────────────────────── */
  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    const u = getUser();
    if (u?.class) setStudentClass(u.class);

    // Fetch topics from API (single source of truth)
    api.questions.topics(u?.class ?? '12')
      .then((data) => setTopicsByClass(data))
      .catch(() => {});

    api.questions.bankStats()
      .then(setBank)
      .catch(() => {});


    // When coming from a mock result, always start fresh — don't restore a stale session
    const incomingMode = new URLSearchParams(window.location.search).get('mode');
    if (incomingMode === 'mock_weak') {
      try { sessionStorage.removeItem('jeeneet_exam_session'); } catch {}
    } else {
      // Restore a saved exam session (survives refresh within the same tab)
      try {
        const raw = sessionStorage.getItem('jeeneet_exam_session');
        if (raw) {
          const s = JSON.parse(raw) as {
            appState: AppState; questions: Question[]; currentIndex: number;
            examResults: Record<number, StoredResult>; sessionSecs: number; markingScheme: MarkingScheme;
          };
          if (['exam', 'summary', 'review'].includes(s.appState) && s.questions?.length > 0) {
            setQuestions(s.questions);
            setCurrentIndex(s.currentIndex ?? 0);
            setExamResults(s.examResults ?? {});
            setSessionSecs(s.sessionSecs ?? 0);
            setMarkingScheme(s.markingScheme ?? 'jee_main');
            setAppState(s.appState);
            if (s.appState === 'exam') {
              sessionTimerRef.current = setInterval(() => setSessionSecs((sec) => sec + 1), 1000);
            }
            return; // skip weak-mode init when restoring
          }
        }
      } catch {}
    }

    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');

    // Pre-select topics from a specific mock exam's wrong/skipped questions
    if (mode === 'mock_weak') {
      const rawData = params.get('weakData');
      if (rawData) {
        try {
          const parsed = JSON.parse(decodeURIComponent(rawData)) as { subjects: string[]; topics: Record<string, string[]> };
          const valid = ['Mathematics', 'Physics', 'Chemistry'] as Subject[];
          const subjects = parsed.subjects.filter((s) => valid.includes(s as Subject)) as Subject[];
          if (subjects.length > 0) {
            const subjSet = new Set<Subject>(subjects);
            const topicsMap: Partial<Record<Subject, Set<string>>> = {};
            for (const subj of subjects) topicsMap[subj] = new Set(parsed.topics[subj] ?? []);
            setSelectedSubjects(subjSet);
            setSelectedTopics(topicsMap);
            setWeakMode(true);
            setWeakSource('mock');
            setWizardStep(3);
          }
        } catch {}
      }
      return;
    }

    if (mode !== 'weak') return;

    setWeakMode(true);
    setWeakStartLoading(true);
    api.progress.weakAreas()
      .then((areas: TopicProgress[]) => {
        if (!areas.length) { setWeakStartLoading(false); return; }
        const subjectTopics = new Map<Subject, Set<string>>();
        for (const w of areas) {
          const subj = w.subject as Subject;
          if (!(['Mathematics', 'Physics', 'Chemistry'] as string[]).includes(subj)) continue;
          if (!subjectTopics.has(subj)) subjectTopics.set(subj, new Set());
          subjectTopics.get(subj)!.add(w.topicName);
        }
        const subjects = new Set(subjectTopics.keys());
        const topicsMap: Partial<Record<Subject, Set<string>>> = {};
        for (const [subj, topicSet] of subjectTopics) topicsMap[subj] = topicSet;
        setSelectedSubjects(subjects);
        setSelectedTopics(topicsMap);
        setWeakSource('global');
        setWizardStep(3);
      })
      .catch(() => {})
      .finally(() => setWeakStartLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  /* ─── Fullscreen handling ─────────────────────────────── */
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  /* ─── Timer cleanup on unmount ────────────────────────── */
  useEffect(() => () => clearInterval(sessionTimerRef.current), []);

  function enterFullscreen() {
    try { document.documentElement.requestFullscreen().catch(() => {}); } catch {}
  }
  function exitFullscreen() {
    try { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); } catch {}
  }

  /* ─── Subject helpers ─────────────────────────────────── */
  function toggleSubject(s: Subject) {
    setSelectedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(s)) {
        if (next.size === 1) return prev;
        next.delete(s);
        setSelectedTopics((t) => { const n = { ...t }; delete n[s]; return n; });
      } else {
        next.add(s);
        setSelectedTopics((t) => ({ ...t, [s]: new Set() }));
      }
      return next;
    });
  }

  function selectAllSubjects() {
    const all: Subject[] = ['Mathematics', 'Physics', 'Chemistry'];
    setSelectedSubjects(new Set(all));
    const topics: Partial<Record<Subject, Set<string>>> = {};
    for (const s of all) topics[s] = new Set();
    setSelectedTopics(topics);
  }

  function toggleTopic(subject: Subject, topic: string) {
    setSelectedTopics((prev) => {
      const cur = new Set(prev[subject] ?? []);
      if (cur.has(topic)) { if (cur.size === 1) return prev; cur.delete(topic); }
      else cur.add(topic);
      return { ...prev, [subject]: cur };
    });
  }

  function toggleAllTopics(subject: Subject) {
    const topics = getTopicsForStudent(subject);
    const all = [...topics.class11, ...topics.class12];
    if (all.length === 0) return; // topics not yet loaded
    const cur = selectedTopics[subject];
    if (cur && cur.size === all.length) {
      setSelectedTopics((p) => ({ ...p, [subject]: new Set([all[0]!]) }));
    } else {
      setSelectedTopics((p) => ({ ...p, [subject]: new Set(all) }));
    }
  }

  /* ─── Wizard navigation ───────────────────────────────── */
  function canAdvanceStep(): boolean {
    if (wizardStep === 1) return selectedSubjects.size > 0;
    if (wizardStep === 2) {
      return Array.from(selectedSubjects).every((s) => (selectedTopics[s]?.size ?? 0) > 0);
    }
    return true;
  }

  /* ─── Build selections array ──────────────────────────── */
  function buildSelections(): Array<{ subject: Subject; topic: string }> {
    const out: Array<{ subject: Subject; topic: string }> = [];
    for (const subject of selectedSubjects) {
      for (const topic of (selectedTopics[subject] ?? new Set())) {
        out.push({ subject, topic });
      }
    }
    return out;
  }

  function resolvedCount(): number {
    if (questionCount === 'custom') {
      const n = parseInt(customCount, 10);
      return isNaN(n) || n < 1 ? 5 : Math.min(n, 30);
    }
    return questionCount;
  }

  /* ─── Paper row: preview papers, then claim the chosen one ── */
  async function loadPapers() {
    setShowPapers(true);
    setPapersLoading(true);
    setPapersError('');
    try {
      const res = await api.questions.papers({
        selections: buildSelections(),
        difficulty,
        examType,
        studentClass,
        perSubject: resolvedCount(),
        papers: 6,
      });
      setPaperSets(res.papers);
      setPossibleSets(res.possibleSets);
      if (res.papers.length === 0) setPapersError('No papers can be built from these topics. Try adding more topics.');
    } catch (e) {
      setPaperSets([]);
      setPapersError(e instanceof Error ? e.message : 'Could not build papers');
    } finally {
      setPapersLoading(false);
    }
  }

  async function choosePaper(paper: PaperSet) {
    enterFullscreen();
    setAppState('loading');
    setLoadProgress(50);
    setLoadError('');
    try {
      const claimed = await api.questions.claimPapers(paper.questionIds);
      setLoadProgress(100);
      await new Promise((r) => setTimeout(r, 300));
      setQuestions(claimed);
      setCurrentIndex(0);
      setExamResults({});
      setSessionSecs(0);
      setAppState('exam');
      sessionTimerRef.current = setInterval(() => setSessionSecs((s) => s + 1), 1000);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Could not start this paper');
      setAppState('wizard');
      loadPapers();
    }
  }

  /* ─── Start exam (fetch batch) ────────────────────────── */
  const startExam = useCallback(async () => {
    enterFullscreen();
    setAppState('loading');
    setLoadProgress(0);
    setLoadMsgIdx(0);
    setLoadError('');

    let p = 0;
    const progressInterval = setInterval(() => {
      p = Math.min(p + (p < 60 ? 4 : p < 80 ? 2 : p < 92 ? 0.8 : 0.15), 98);
      setLoadProgress(p);
    }, 300);

    const msgInterval = setInterval(() => {
      setLoadMsgIdx((i) => (i + 1) % LOAD_MESSAGES.length);
    }, 2800);

    try {
      const selections = buildSelections();
      const perSubject = resolvedCount();
      const count = perSubject * selectedSubjects.size;

      const batch = await api.questions.batch({
        selections,
        difficulty,
        examType,
        studentClass,
        count,
      });

      clearInterval(progressInterval);
      clearInterval(msgInterval);
      setLoadProgress(100);

      await new Promise((r) => setTimeout(r, 500));

      const subjectOrder = Array.from(selectedSubjects);
      const sorted = [...batch].sort(
        (a, b) => subjectOrder.indexOf(a.subject as Subject) - subjectOrder.indexOf(b.subject as Subject),
      );
      setQuestions(sorted);
      setCurrentIndex(0);
      setExamResults({});
      setSessionSecs(0);
      setAppState('exam');

      sessionTimerRef.current = setInterval(() => setSessionSecs((s) => s + 1), 1000);
    } catch (e: unknown) {
      clearInterval(progressInterval);
      clearInterval(msgInterval);
      setLoadError(e instanceof Error ? e.message : 'Failed to generate questions');
      setAppState('wizard');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubjects, selectedTopics, questionCount, customCount, difficulty, examType, studentClass]);

  // Keep the active question dot in view within the horizontal palette
  useEffect(() => {
    if (appState === 'exam') {
      const activeDot = document.querySelector('.exam-dot.current');
      activeDot?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentIndex, appState]);

  /* ─── Exam handlers ───────────────────────────────────── */
  async function handleExamSubmit(answer: string, timeSpent: number): Promise<AnswerResult> {
    const q = questions[currentIndex]!;
    const result = await api.answers.submit({ questionId: q.id, answer, timeSpent });
    setExamResults((prev) => ({ ...prev, [currentIndex]: { ...result, selectedAnswer: answer } }));

    return result;
  }

  function handleExamNext() {
    if (currentIndex + 1 >= questions.length) {
      clearInterval(sessionTimerRef.current);
      exitFullscreen();
      setAppState('summary');
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleEndSession() {
    clearInterval(sessionTimerRef.current);
    exitFullscreen();
    setAppState('summary');
  }

  function handlePracticeAgain() {
    exitFullscreen();
    try { sessionStorage.removeItem('jeeneet_exam_session'); } catch {}
    setAppState('wizard');
    setWizardStep(1);
    setQuestions([]);
    setExamResults({});
    setWeakMode(false);
    setWeakSource(null);
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }

  /* ─── Timer formatting ─────────────────────────────────── */
  function fmtTime(secs: number) {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  /* ═══════════════════════════════════════════════════════
     RENDER: Weak areas loading
  ═══════════════════════════════════════════════════════ */
  if (weakStartLoading) {
    return (
      <div className="ai-loader-overlay">
        <div className="ai-loader-icon-wrap">
          <div className="ai-spin-ring" />
          <div className="ai-spin-ring-2" />
          <div className="ai-loader-center">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="var(--gray-800)">
              <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
            </svg>
          </div>
        </div>
        <div className="ai-loader-text">
          <p className="ai-loader-title">Loading your weak areas</p>
          <p className="ai-loader-msg">Checking your topic progress...</p>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     RENDER: Wizard
  ═══════════════════════════════════════════════════════ */
  if (appState === 'wizard') {
    const subjects: Subject[] = ['Mathematics', 'Physics', 'Chemistry'];

    /* ── Fake paper data for the teaser stack ─────────────── */
    const PAPER_STACK = [
      {
        subject: 'Physics', left: 0, zIndex: 1,
        opacity: 0.68, cardBlur: 2.5, rotate: '-5deg', ty: '26px',
        q: { text: 'A block of mass m on frictionless incline at 30°. Normal reaction on block equals', opts: ['mg/2', 'mg cos30°', 'mg sin30°', 'mg'] },
      },
      {
        subject: 'Mathematics', left: 112, zIndex: 3,
        opacity: 1, cardBlur: 0, rotate: '0.5deg', ty: '0px',
        q: { text: 'f(x) = x³ − 3x² + 2x. Number of critical points in ℝ is', opts: ['0', '1', '2', '3'] },
      },
      {
        subject: 'Chemistry', left: 224, zIndex: 2,
        opacity: 0.68, cardBlur: 2.5, rotate: '5deg', ty: '20px',
        q: { text: 'The hybridisation of the central atom in XeF₄ is', opts: ['sp³d²', 'sp²', 'sp³', 'sp³d'] },
      },
    ];

    return (
      <div className="wizard-page">
        <div className="wizard-topbar">
          <span className="wizard-topbar-logo"><img src="/logo.png" alt="JEENEET.ai" className="site-logo" /></span>
          <div className="divider" style={{ width: 1, height: 20, background: 'var(--gray-200)', margin: '0 4px' }} />
          <Link href="/dashboard" className="btn btn-ghost btn-sm">Dashboard</Link>
          {loadError && (
            <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--red-600)' }}>{loadError}</span>
          )}
        </div>

        {/* ── Paper teaser hero ──────────────────────────────── */}
        <div className="paper-hero" style={{ background: '#fff', borderBottom: '1px solid var(--gray-200)', padding: '40px 40px 36px', flexShrink: 0 }}>
          <div className="paper-hero-inner" style={{ maxWidth: 920, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 48 }}>

            {/* Left: copy + stats */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 10 }}>
                Practice Mode
              </div>
              <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.18, marginBottom: 12, letterSpacing: '-0.025em' }}>
                A fresh paper<br />every session
              </h1>
              <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.65, marginBottom: 28, maxWidth: 340 }}>
                Each session draws a new set of questions from the bank across Physics, Chemistry and Mathematics. You see the answer and explanation after every question.
              </p>
              <div style={{ display: 'flex', gap: 28 }}>
                {[
                  { num: bankTotal, label: 'Questions' },
                  { num: topicTotal !== null ? String(topicTotal) : '—', label: 'Topics' },
                  { num: '3', label: 'Subjects' },
                ].map(({ num, label }) => (
                  <div key={label}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em' }}>{num}</div>
                    <div style={{ fontSize: 10, color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 1 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: 3 side-by-side paper cards with depth blur */}
            <div className="paper-hero-stack" style={{ flexShrink: 0, position: 'relative', width: 400, height: 290 }}>
              {PAPER_STACK.map((paper, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: paper.left,
                    top: 0,
                    width: 176,
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    padding: '11px 13px 14px',
                    boxShadow: paper.zIndex === 3
                      ? '0 6px 24px rgba(0,0,0,0.13)'
                      : '0 2px 10px rgba(0,0,0,0.07)',
                    transform: `rotate(${paper.rotate}) translateY(${paper.ty})`,
                    zIndex: paper.zIndex,
                    opacity: paper.opacity,
                    filter: paper.cardBlur > 0 ? `blur(${paper.cardBlur}px)` : undefined,
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                >
                  {/* Paper header */}
                  <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: '0.08em', color: '#9ca3af', textTransform: 'uppercase', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid #f3f4f6' }}>
                    Practice paper &nbsp;·&nbsp; {paper.subject}
                  </div>
                  {/* Single question */}
                  <div style={{ fontSize: 11, color: '#1f2937', lineHeight: 1.55, marginBottom: 10, fontWeight: 400 }}>
                    <span style={{ fontWeight: 700, marginRight: 3 }}>Q1.</span>
                    {paper.q.text}
                  </div>
                  {/* Options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {paper.q.opts.map((opt, oi) => (
                      <div key={oi} style={{
                        fontSize: 10, color: '#4b5563',
                        padding: '3px 7px',
                        border: '1px solid #f3f4f6',
                        borderRadius: 3,
                        background: '#fafafa',
                      }}>
                        ({String.fromCharCode(65 + oi)}) {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="wizard-body">
          <div className="wizard-inner">
            {weakMode && (
              <div style={{
                background: 'var(--navy-50)', border: '1px solid var(--navy-100)',
                borderRadius: 'var(--radius-lg)', padding: '12px 16px',
                marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--navy-600)" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy-800)' }}>
                    {weakSource === 'mock' ? 'Drilling your mock exam mistakes' : 'Targeting your weak areas'}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--navy-600)', marginLeft: 8 }}>
                    {Array.from(selectedSubjects).reduce((acc, s) => acc + (selectedTopics[s]?.size ?? 0), 0)} topics across {selectedSubjects.size} subject{selectedSubjects.size !== 1 ? 's' : ''} pre-selected
                    {weakSource === 'mock' && <span style={{ marginLeft: 6, opacity: 0.75 }}>· from your mock exam</span>}
                  </span>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}
                  onClick={() => { setWeakMode(false); setWizardStep(1); }}>
                  Change topics
                </button>
              </div>
            )}

            <div className="wizard-step-bar">
              {(['Subjects', 'Topics', 'Session'] as const).map((label, idx) => {
                const stepN = (idx + 1) as WizardStep;
                const isDone = wizardStep > stepN;
                const isActive = wizardStep === stepN;
                return (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', flex: idx < 2 ? 1 : undefined }}>
                    <div className={`wizard-step-item${isActive ? ' active' : ''}${isDone ? ' done' : ''}`}>
                      <div className="wizard-step-num">{isDone ? CHECK_SVG : stepN}</div>
                      <span className="wizard-step-label">{label}</span>
                    </div>
                    {idx < 2 && <div className="wizard-step-line" />}
                  </div>
                );
              })}
            </div>

            {wizardStep === 1 && (
              <>
                <p className="wizard-section-title">Which subjects?</p>
                <p className="wizard-section-sub">Pick one or more. You can practice MPC together or focus on one.</p>
                <div className="subject-cards">
                  <div className={`subject-card${selectedSubjects.size === 3 ? ' selected' : ''}`} onClick={selectAllSubjects}>
                    <span className="subject-card-emoji">MPC</span>
                    <span className="subject-card-name">All Three</span>
                    <span className="subject-card-sub">Full coverage</span>
                  </div>
                  {subjects.map((s) => {
                    const t = topicsByClass?.[s];
                    const topicCount = t ? (t.class11.length + t.class12.length) : null;
                    const questionCount = bank?.bySubject[s];
                    return (
                      <div key={s} className={`subject-card${selectedSubjects.has(s) ? ' selected' : ''}`} onClick={() => toggleSubject(s)}>
                        <span className="subject-card-emoji" style={{ fontFamily: 'serif', fontSize: 28 }}>{SUBJECT_META[s].emoji}</span>
                        <span className="subject-card-name">{s}</span>
                        <span className="subject-card-sub">
                          {topicCount !== null ? `${topicCount} topics` : 'Loading...'}
                          {questionCount !== undefined && ` · ${questionCount.toLocaleString('en-IN')} questions`}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 12, fontSize: 13, color: 'var(--gray-500)' }}>
                  {selectedSubjects.size} subject{selectedSubjects.size !== 1 ? 's' : ''} selected
                </div>
              </>
            )}

            {wizardStep === 2 && (
              <>
                <p className="wizard-section-title">Which topics?</p>
                <p className="wizard-section-sub">Select all or pick specific ones. Questions rotate across your selection.</p>
                {Array.from(selectedSubjects).map((subject) => {
                  const topics = getTopicsForStudent(subject);
                  const cur = selectedTopics[subject] ?? new Set<string>();
                  const allTopics = [...topics.class11, ...topics.class12];
                  const allSelected = cur.size === allTopics.length;
                  return (
                    <div key={subject} className="topic-subject-section">
                      <div className="topic-subject-header">
                        <span className="topic-subject-name">{subject}</span>
                        <button className="btn btn-ghost btn-sm" onClick={() => toggleAllTopics(subject)}>
                          {allSelected ? 'Deselect all' : 'Select all'}
                        </button>
                      </div>
                      {topics.class11.length > 0 && (
                        <div className="topic-class-group">
                          {studentClass !== '11' && <p className="topic-class-label">Class 11</p>}
                          <div className="wizard-topic-grid">
                            {topics.class11.map((t) => (
                              <button key={t} className={`topic-chip${cur.has(t) ? ' selected' : ''}`} onClick={() => toggleTopic(subject, t)}>
                                <span className="topic-chip-check">{cur.has(t) && CHECK_SVG}</span>
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {topics.class12.length > 0 && (
                        <div className="topic-class-group" style={{ marginTop: 10 }}>
                          <p className="topic-class-label">Class 12</p>
                          <div className="wizard-topic-grid">
                            {topics.class12.map((t) => (
                              <button key={t} className={`topic-chip${cur.has(t) ? ' selected' : ''}`} onClick={() => toggleTopic(subject, t)}>
                                <span className="topic-chip-check">{cur.has(t) && CHECK_SVG}</span>
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--gray-400)' }}>
                        {cur.size} of {allTopics.length} topics selected
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {wizardStep === 3 && showPapers && (
              <>
                <p className="wizard-section-title">Choose your paper</p>
                <p className="wizard-section-sub">
                  Each paper is a different set of questions from the bank. Pick one to start.
                </p>

                {papersError && <div className="badge badge-red" style={{ marginBottom: 16 }}>{papersError}</div>}

                {paperSets.length > 0 && (
                  <div className="paper-combos">
                    <span className="paper-combos-value">{formatPossible(possibleSets)}</span>
                    <span className="paper-combos-label">
                      distinct papers this bank can make for your selection. You are looking at {paperSets.length} of them.
                    </span>
                  </div>
                )}

                {/* The row stays mounted while shuffling, so the page does not jump to the top */}
                <div className={`paper-row${papersLoading ? ' paper-row-loading' : ''}`} aria-busy={papersLoading}>
                  {paperSets.map((paper) => (
                    <PaperCard key={paper.number} paper={paper} onStart={() => choosePaper(paper)} />
                  ))}
                  {papersLoading && <div className="paper-row-overlay">Shuffling the bank...</div>}
                </div>

                <div className="paper-grid-actions">
                  <button type="button" className="btn btn-outline" onClick={loadPapers} disabled={papersLoading}>
                    Shuffle papers
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={startExam}>
                    Skip, start a random paper
                  </button>
                </div>
              </>
            )}

            {wizardStep === 3 && !showPapers && (
              <>
                <p className="wizard-section-title">Session settings</p>
                <p className="wizard-section-sub">Configure your exam session.</p>

                <div className="config-row">
                  <p className="config-label">How many questions per subject?</p>
                  <div className="pill-group">
                    {([5, 10, 20, 30] as const).map((n) => (
                      <button key={n} className={`pill${questionCount === n ? ' selected' : ''}`} onClick={() => setQuestionCount(n)}>{n}</button>
                    ))}
                    <button className={`pill${questionCount === 'custom' ? ' selected' : ''}`} onClick={() => setQuestionCount('custom')}>Custom</button>
                    {questionCount === 'custom' && (
                      <input type="number" className="custom-count-input" placeholder="1-30" min={1} max={30}
                        value={customCount} onChange={(e) => setCustomCount(e.target.value)} />
                    )}
                  </div>
                </div>

                <div className="config-row">
                  <p className="config-label">Difficulty</p>
                  <div className="pill-group">
                    {(['mixed', 'beginner', 'intermediate', 'advanced'] as DiffOption[]).map((d) => (
                      <button key={d} className={`pill${difficulty === d ? ' selected' : ''}`} onClick={() => setDifficulty(d)} style={{ textTransform: 'capitalize' }}>
                        {d === 'mixed' ? 'All levels' : d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="config-row">
                  <p className="config-label">Exam type</p>
                  <div className="pill-group">
                    {(['Main', 'Advanced'] as const).map((e) => (
                      <button key={e} className={`pill${examType === e ? ' selected' : ''}`} onClick={() => setExamType(e)}>JEE {e}</button>
                    ))}
                  </div>
                </div>

                <div className="config-row">
                  <p className="config-label">Marking scheme</p>
                  <div className="pill-group">
                    {([
                      { key: 'standard',     label: 'Standard (1/0)'              },
                      { key: 'jee_main',     label: 'JEE Main (+4/−1)'            },
                      { key: 'jee_advanced', label: 'JEE Advanced (+4/−2 wrong)'  },
                    ] as const).map(({ key, label }) => (
                      <button key={key} className={`pill${markingScheme === key ? ' selected' : ''}`} onClick={() => setMarkingScheme(key)}>{label}</button>
                    ))}
                  </div>
                </div>

                <div className="card card-sm" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 13 }}>
                    <span>
                      <strong style={{ color: 'var(--gray-900)' }}>{resolvedCount()}</strong>{' '}
                      <span style={{ color: 'var(--gray-500)' }}>per subject</span>
                      {selectedSubjects.size > 1 && (
                        <span style={{ color: 'var(--gray-400)', marginLeft: 4 }}>({resolvedCount() * selectedSubjects.size} total)</span>
                      )}
                    </span>
                    <span>
                      <strong style={{ color: 'var(--gray-900)', textTransform: 'capitalize' }}>{difficulty}</strong>{' '}
                      <span style={{ color: 'var(--gray-500)' }}>difficulty</span>
                    </span>
                    <span><strong style={{ color: 'var(--gray-900)' }}>JEE {examType}</strong></span>
                    <span><strong style={{ color: 'var(--gray-900)' }}>{Array.from(selectedSubjects).join(', ')}</strong></span>
                    <span>
                      <strong style={{ color: 'var(--gray-900)' }}>
                        {Array.from(selectedSubjects).reduce((acc, s) => acc + (selectedTopics[s]?.size ?? 0), 0)}
                      </strong>{' '}
                      <span style={{ color: 'var(--gray-500)' }}>topics</span>
                    </span>
                  </div>
                </div>
              </>
            )}

            <div className="wizard-nav">
              <button className="btn btn-outline"
                onClick={() => {
                  if (showPapers) setShowPapers(false);
                  else if (wizardStep > 1) setWizardStep((s) => (s - 1) as WizardStep);
                  else router.push('/dashboard');
                }}>
                {wizardStep === 1 ? 'Cancel' : 'Back'}
              </button>
              {wizardStep < 3 ? (
                <button className="btn btn-primary btn-lg" disabled={!canAdvanceStep()}
                  onClick={() => setWizardStep((s) => (s + 1) as WizardStep)}>Continue</button>
              ) : showPapers ? null : (
                <button className="btn btn-primary btn-lg" onClick={loadPapers}>
                  Find papers
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     RENDER: AI Loading screen
  ═══════════════════════════════════════════════════════ */
  if (appState === 'loading') {
    return (
      <div className="ai-loader-overlay">
        <div className="ai-loader-icon-wrap">
          <div className="ai-spin-ring" />
          <div className="ai-spin-ring-2" />
          <div className="ai-loader-center">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="var(--gray-800)">
              <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
              <path d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/>
            </svg>
          </div>
        </div>
        <div className="ai-loader-text">
          <p className="ai-loader-title">Preparing your session</p>
          <p className="ai-loader-msg">{LOAD_MESSAGES[loadMsgIdx]}</p>
          <div className="ai-loader-dots">
            <div className="ai-loader-dot" /><div className="ai-loader-dot" /><div className="ai-loader-dot" />
          </div>
        </div>
        <div className="ai-loader-bar-wrap">
          <div className="ai-loader-bar-track">
            <div className="ai-loader-bar-fill" style={{ width: `${loadProgress}%` }} />
          </div>
          <p className="ai-loader-bar-label">{loadProgress < 100 ? `${Math.round(loadProgress)}% complete` : 'Ready!'}</p>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     RENDER: Exam overlay
  ═══════════════════════════════════════════════════════ */
  if (appState === 'exam' && questions.length > 0) {
    return (
      <ExamScreen
        questions={questions}
        currentIndex={currentIndex}
        examResults={examResults}
        sessionSecs={sessionSecs}
        isFullscreen={isFullscreen}
        fmtTime={fmtTime}
        onEndSession={handleEndSession}
        onToggleFullscreen={() => (isFullscreen ? exitFullscreen() : enterFullscreen())}
        onSubmitAnswer={handleExamSubmit}
        onNext={handleExamNext}
        onPrev={() => setCurrentIndex((i) => i - 1)}
        onSelectIndex={setCurrentIndex}
      />
    );
  }

  /* ═══════════════════════════════════════════════════════
     RENDER: Summary
  ═══════════════════════════════════════════════════════ */
  if (appState === 'summary') {
    return (
      <SessionSummary
        questions={questions}
        examResults={examResults}
        sessionSecs={sessionSecs}
        markingScheme={markingScheme}
        fmtTime={fmtTime}
        onReview={() => setAppState('review')}
        onPracticeAgain={handlePracticeAgain}
      />
    );
  }

  if (appState === 'review') {
    return (
      <SessionReview
        questions={questions}
        examResults={examResults}
        sessionSecs={sessionSecs}
        fmtTime={fmtTime}
        onBackToScore={() => setAppState('summary')}
        onNewSession={handlePracticeAgain}
      />
    );
  }

  return null;
}
