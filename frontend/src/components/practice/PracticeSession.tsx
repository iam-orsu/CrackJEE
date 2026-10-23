'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { isAuthenticated, getUser } from '@/lib/auth';
import type { Question, AnswerResult, Subject, TopicProgress, PaperSet } from '@/types';
import type { SplitTopics } from '@/lib/api';
import type { AppState, WizardStep, DiffOption, MarkingScheme, StoredResult } from './shared';
import type { PracticeExamConfig } from './examConfig';
import { SessionReview } from './SessionReview';
import { WizardHero } from './WizardHero';
import { StepBar } from './StepBar';
import { SubjectStep } from './SubjectStep';
import { TopicStep } from './TopicStep';
import { PaperStep } from './PaperStep';
import { SessionSettings } from './SessionSettings';
import { SessionSummary } from './SessionSummary';
import { ExamScreen } from './ExamScreen';

/* Practice for one exam: the wizard (subjects, topics, settings), the question session, the summary and the review.
   JEE and NEET share everything here; examConfig.ts holds the differences. */
export function PracticeSession({ config }: { config: PracticeExamConfig }) {
  const router = useRouter();
  const isNeet = config.exam === 'NEET';
  const [studentClass, setStudentClass] = useState<string>('12');
  /* NEET questions are always drawn for class 12 */
  const batchClass = isNeet ? '12' : studentClass;

  /* ── App state ── */
  const [appState, setAppState] = useState<AppState>('wizard');
  const [wizardStep, setWizardStep] = useState<WizardStep>(1);

  /* ── Wizard selections ── */
  const [selectedSubjects, setSelectedSubjects] = useState<Set<Subject>>(new Set([config.defaultSubject]));
  const [selectedTopics, setSelectedTopics] = useState<Partial<Record<Subject, Set<string>>>>({
    [config.defaultSubject]: new Set(),
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

  /* ── Paper row (choose a paper before starting; JEE only) ── */
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
      sessionStorage.setItem(config.sessionKey, JSON.stringify({
        appState,
        questions,
        currentIndex,
        examResults,
        sessionSecs,
        markingScheme,
      }));
    } catch {}
  }, [appState, questions, currentIndex, examResults, sessionSecs, markingScheme, config.sessionKey]);

  /* ─── Auth + weak mode init ──────────────────────────── */
  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    const u = getUser();
    if (u?.class) setStudentClass(u.class);

    // Fetch topics and bank size for this exam
    api.questions.topics(isNeet ? undefined : (u?.class ?? '12'), isNeet ? 'NEET' : undefined)
      .then((data) => setTopicsByClass(data))
      .catch(() => {});

    api.questions.bankStats(isNeet ? 'NEET' : undefined)
      .then(setBank)
      .catch(() => {});

    // A mode link (weak areas, mock drill) always starts fresh — don't restore a stale session
    const incomingMode = new URLSearchParams(window.location.search).get('mode');
    if (incomingMode) {
      try { sessionStorage.removeItem(config.sessionKey); } catch {}
    } else {
      // Restore a saved exam session (survives refresh within the same tab)
      try {
        const raw = sessionStorage.getItem(config.sessionKey);
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
          const subjects = parsed.subjects.filter((s) => config.subjects.includes(s as Subject)) as Subject[];
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
          if (!config.subjects.includes(subj)) continue;
          if (!subjectTopics.has(subj)) subjectTopics.set(subj, new Set());
          subjectTopics.get(subj)!.add(w.topicName);
        }
        if (subjectTopics.size === 0) { setWeakStartLoading(false); return; }
        const topicsMap: Partial<Record<Subject, Set<string>>> = {};
        for (const [subj, topicSet] of subjectTopics) topicsMap[subj] = topicSet;
        setSelectedSubjects(new Set(subjectTopics.keys()));
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
    setSelectedSubjects(new Set(config.subjects));
    const topics: Partial<Record<Subject, Set<string>>> = {};
    for (const s of config.subjects) topics[s] = new Set();
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
      return isNaN(n) || n < 1 ? 5 : Math.min(n, config.maxPerSubject);
    }
    return questionCount;
  }

  /* ─── Paper row: preview papers, then claim the chosen one (JEE) ── */
  async function loadPapers() {
    setShowPapers(true);
    setPapersLoading(true);
    setPapersError('');
    try {
      const res = await api.questions.papers({
        selections: buildSelections(),
        difficulty,
        examType,
        studentClass: batchClass,
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
      setLoadMsgIdx((i) => (i + 1) % config.loadMessages.length);
    }, 2800);

    try {
      const selections = buildSelections();
      const perSubject = resolvedCount();
      const count = perSubject * selectedSubjects.size;

      const batch = await api.questions.batch({
        selections,
        difficulty,
        examType: isNeet ? 'NEET' : examType,
        studentClass: batchClass,
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
  }, [selectedSubjects, selectedTopics, questionCount, customCount, difficulty, examType, batchClass, isNeet, config]);

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
    try { sessionStorage.removeItem(config.sessionKey); } catch {}
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
          <p className="ai-loader-msg">{config.weakLoadingText}</p>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     RENDER: Wizard
  ═══════════════════════════════════════════════════════ */
  if (appState === 'wizard') {
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
        <WizardHero config={config} bankTotal={bankTotal} topicTotal={topicTotal} />

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
            <StepBar wizardStep={wizardStep} />

            {wizardStep === 1 && (
              <SubjectStep
                config={config}
                selectedSubjects={selectedSubjects}
                topicsByClass={topicsByClass}
                bank={bank}
                onSelectAll={selectAllSubjects}
                onToggleSubject={toggleSubject}
              />
            )}

            {wizardStep === 2 && (
              <TopicStep
                intro={config.topicsIntro}
                selectedSubjects={selectedSubjects}
                selectedTopics={selectedTopics}
                studentClass={batchClass}
                getTopicsForStudent={getTopicsForStudent}
                onToggleAllTopics={toggleAllTopics}
                onToggleTopic={toggleTopic}
              />
            )}

            {wizardStep === 3 && showPapers && (
              <PaperStep
                papersError={papersError}
                paperSets={paperSets}
                possibleSets={possibleSets}
                papersLoading={papersLoading}
                onChoosePaper={choosePaper}
                onLoadPapers={loadPapers}
                onStartExam={startExam}
              />
            )}

            {wizardStep === 3 && !showPapers && (
              <SessionSettings
                config={config}
                questionCount={questionCount}
                onQuestionCount={setQuestionCount}
                customCount={customCount}
                onCustomCount={setCustomCount}
                difficulty={difficulty}
                onDifficulty={setDifficulty}
                examType={examType}
                onExamType={setExamType}
                markingScheme={markingScheme}
                onMarkingScheme={setMarkingScheme}
                perSubjectCount={resolvedCount()}
                selectedSubjects={selectedSubjects}
                selectedTopics={selectedTopics}
              />
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
              ) : !config.hasPapers ? (
                <button className="btn btn-primary btn-lg" onClick={startExam}>
                  Start practice
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
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
          <p className="ai-loader-title">{config.loadingTitle}</p>
          <p className="ai-loader-msg">{config.loadMessages[loadMsgIdx]}</p>
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
        examTitle={isNeet ? 'NEET' : undefined}
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
