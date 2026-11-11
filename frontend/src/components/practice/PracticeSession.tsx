'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { isAuthenticated, getUser } from '@/lib/auth';
import type { Question, AnswerResult, Subject, TopicProgress, PaperSet } from '@/types';
import type { SplitTopics } from '@/lib/api';
import type { AppState, WizardStep, DiffOption, MarkingScheme, StoredResult } from './shared';
import type { PracticeExamConfig } from './examConfig';
import { SessionReview } from './SessionReview';
import { SubjectStep } from './SubjectStep';
import { TopicStep } from './TopicStep';
import { PaperStep } from './PaperStep';
import { SessionSettings } from './SessionSettings';
import { SessionSummary } from './SessionSummary';
import { ExamScreen } from './ExamScreen';

/* ───────────────────────── Small presentational pieces ───────────────────────── */

function Loader({ title, message, progress }: { title: string; message: string; progress?: number }) {
  return (
    <div className="pr-loader" role="status" aria-live="polite">
      <div className="pr-lcard">
        <span className="pr-ltape" />
        <svg className="pr-atom" viewBox="0 0 200 200" fill="none" aria-hidden>
          <g stroke="currentColor" strokeWidth="6" strokeLinecap="round">
            <ellipse cx="100" cy="100" rx="86" ry="32" />
            <ellipse cx="100" cy="100" rx="86" ry="32" transform="rotate(60 100 100)" />
            <ellipse cx="100" cy="100" rx="86" ry="32" transform="rotate(120 100 100)" />
            <circle cx="186" cy="100" r="9" fill="#C8202F" stroke="none" />
          </g>
          <circle cx="100" cy="100" r="16" fill="#C8202F" />
        </svg>
        <h2>{title}</h2>
        <p className="pr-hand">{message}</p>
        {progress !== undefined && (
          <div className="pr-prog">
            <div className="pr-track"><i style={{ width: `${progress}%` }} /></div>
            <small>{progress < 100 ? `${Math.round(progress)}% complete` : 'Ready!'}</small>
          </div>
        )}
      </div>
    </div>
  );
}

function Steps({ step, labels }: { step: WizardStep; labels: string[] }) {
  return (
    <ol className="pr-steps" aria-label="Progress">
      {labels.map((label, i) => {
        const n = i + 1;
        const state = n < step ? 'done' : n === step ? 'cur' : '';
        return (
          <li key={label} className="pr-step-wrap">
            <span className={`pr-step ${state}`} aria-current={n === step ? 'step' : undefined}>
              <i>
                {n < step ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                ) : n}
              </i>
              <span>{label}</span>
            </span>
            {i < labels.length - 1 && <span className={`pr-step-line${n < step ? ' done' : ''}`} aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}

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
  const [paperPage, setPaperPage] = useState(1);
  const [paperPageCount, setPaperPageCount] = useState(0);
  const [paperAvailable, setPaperAvailable] = useState(0);
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
        // Only label the session as weak-area practice when there are weak topics to pre-select
        setWeakMode(true);
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
  async function loadPapers(page: number) {
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
        page,
      });
      setPaperSets(res.papers);
      setPaperPage(res.page);
      setPaperPageCount(res.pageCount);
      setPaperAvailable(res.available);
      if (res.available === 0) setPapersError('No papers can be built from these topics. Try adding more topics.');
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
      loadPapers(paperPage);
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

  /* Every screen goes through this wrapper, so the palette and button styling reach the imported step screens too */
  const themed = (node: React.ReactNode) => (
    <div className="pr-root">
      <style>{css}</style>
      {node}
    </div>
  );

  /* ═══════════════════════════════════════════════════════
     RENDER: Weak areas loading
  ═══════════════════════════════════════════════════════ */
  if (weakStartLoading) {
    return themed(<Loader title="Loading your weak areas" message={config.weakLoadingText} />);
  }

  /* ═══════════════════════════════════════════════════════
     RENDER: Wizard
  ═══════════════════════════════════════════════════════ */
  if (appState === 'wizard') {
    const weakTopicCount = Array.from(selectedSubjects).reduce((acc, s) => acc + (selectedTopics[s]?.size ?? 0), 0);
    return themed(
      <div className="pr-page">
        {/* ── Header: ruled notebook page ── */}
        <header className="pr-hero">
          <div className="pr-top">
            <span className="pr-logo">
              <Image src="/logo.png" alt="JEENEET.ai" width={78} height={32} className="site-logo" />
            </span>
            <Link href="/dashboard" className="btn btn-ghost btn-sm">Dashboard</Link>
            {loadError && <span className="pr-toperr" role="alert">{loadError}</span>}
          </div>

          <div className="pr-hero-body">
            <p className="pr-eyebrow">{isNeet ? 'NEET UG' : 'JEE Main & Advanced'} practice</p>
            <h1>
              Build your{' '}
              <span className="pr-scribble">
                session
                <svg viewBox="0 0 220 14" preserveAspectRatio="none" aria-hidden>
                  <path d="M3 9C40 2 80 12 120 6s70 3 97-2" />
                </svg>
              </span>
            </h1>
            <p className="pr-sub">
              Pick your subjects, choose topics and set how you want to practise.
              Questions come from the bank or are generated for your topics.
            </p>
            <div className="pr-stats">
              <div className="pr-stat"><strong>{bankTotal}</strong><span>questions in the bank</span></div>
              <div className="pr-stat"><strong>{topicTotal ?? '—'}</strong><span>topics covered</span></div>
            </div>
          </div>
        </header>

        <div className="pr-body">
          <div className="pr-inner">
            {weakMode && (
              <div className="pr-weak">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8202F" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div>
                  <strong>{weakSource === 'mock' ? 'Drilling your mock exam mistakes' : 'Targeting your weak areas'}</strong>
                  <span>
                    {weakTopicCount} topics across {selectedSubjects.size} subject{selectedSubjects.size !== 1 ? 's' : ''} pre-selected
                    {weakSource === 'mock' && ' · from your mock exam'}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => { setWeakMode(false); setWizardStep(1); }}
                >
                  Change topics
                </button>
              </div>
            )}

            <Steps step={wizardStep} labels={['Subjects', 'Topics', showPapers ? 'Papers' : 'Settings']} />

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
                page={paperPage}
                pageCount={paperPageCount}
                available={paperAvailable}
                papersLoading={papersLoading}
                onChoosePaper={choosePaper}
                onPageChange={loadPapers}
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
          </div>
        </div>

        {/* Action bar stays in reach at the bottom, which matters most on phones */}
        <div className="pr-nav">
          <div className="pr-nav-in">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                if (showPapers) setShowPapers(false);
                else if (wizardStep > 1) setWizardStep((s) => (s - 1) as WizardStep);
                else router.push('/dashboard');
              }}
            >
              {wizardStep === 1 ? 'Cancel' : 'Back'}
            </button>
            {wizardStep < 3 ? (
              <button
                type="button"
                className="btn btn-primary btn-lg"
                disabled={!canAdvanceStep()}
                onClick={() => setWizardStep((s) => (s + 1) as WizardStep)}
              >
                Continue
              </button>
            ) : !config.hasPapers ? (
              <button type="button" className="btn btn-primary btn-lg" onClick={startExam}>
                Start practice
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            ) : showPapers ? null : (
              <button type="button" className="btn btn-primary btn-lg" onClick={() => loadPapers(1)}>
                Find papers
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>,
    );
  }

  /* ═══════════════════════════════════════════════════════
     RENDER: AI Loading screen
  ═══════════════════════════════════════════════════════ */
  if (appState === 'loading') {
    return themed(
      <Loader
        title={config.loadingTitle}
        message={config.loadMessages[loadMsgIdx] ?? ''}
        progress={loadProgress}
      />,
    );
  }

  /* ═══════════════════════════════════════════════════════
     RENDER: Exam overlay
  ═══════════════════════════════════════════════════════ */
  if (appState === 'exam' && questions.length > 0) {
    return themed(
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
      />,
    );
  }

  /* ═══════════════════════════════════════════════════════
     RENDER: Summary
  ═══════════════════════════════════════════════════════ */
  if (appState === 'summary') {
    return themed(
      <SessionSummary
        questions={questions}
        examResults={examResults}
        sessionSecs={sessionSecs}
        markingScheme={markingScheme}
        examTitle={isNeet ? 'NEET' : undefined}
        fmtTime={fmtTime}
        onReview={() => setAppState('review')}
        onPracticeAgain={handlePracticeAgain}
      />,
    );
  }

  if (appState === 'review') {
    return themed(
      <SessionReview
        questions={questions}
        examResults={examResults}
        sessionSecs={sessionSecs}
        fmtTime={fmtTime}
        onBackToScore={() => setAppState('summary')}
        onNewSession={handlePracticeAgain}
      />,
    );
  }

  return null;
}

/* ───────────────────────── STYLES ───────────────────────── */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.pr-root{
  --blue:#003366; --blue-d:#071C6B; --blue-l:#2A4FD6;
  --red:#C8202F; --red-d:#8F1521; --ice:#EEF2FF; --ink:#0E1A55; --mute:#5663A0;

  /* Remap the app's own tokens so the imported step screens pick up the palette */
  --gray-50:#F5F7FF; --gray-100:#E8EDFC; --gray-200:#D7DFFA; --gray-300:#C6D2F8; --gray-400:#97A3D4;
  --gray-500:#5663A0; --gray-600:#3C4A8A; --gray-700:#31407F; --gray-800:#1B2866; --gray-900:#0E1A55;
  --navy-50:#EEF2FF; --navy-100:#D7DFFA; --navy-600:#003366; --navy-800:#071C6B; --red-600:#C8202F;

  font-family:'Plus Jakarta Sans',system-ui,sans-serif; color:var(--ink);
  -webkit-text-size-adjust:100%;
}
.pr-root *{box-sizing:border-box}

/* Buttons used by this file and by the imported steps */
.pr-root .btn{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:46px;padding:0 20px;
  font-family:inherit;font-weight:800;font-size:15px;line-height:1.1;border-radius:14px;border:0;cursor:pointer;text-decoration:none;
  transition:transform .15s,box-shadow .15s,background .15s;-webkit-tap-highlight-color:transparent;
}
.pr-root .btn-sm{min-height:40px;padding:0 14px;font-size:13px;border-radius:12px}
.pr-root .btn-lg{min-height:54px;padding:0 28px;font-size:16px;border-radius:16px}
.pr-root .btn-primary{background:var(--red);color:#fff;box-shadow:0 6px 0 var(--red-d)}
.pr-root .btn-primary:hover:not(:disabled){background:var(--red);transform:translateY(-3px);box-shadow:0 9px 0 var(--red-d)}
.pr-root .btn-primary:active:not(:disabled){transform:translateY(4px);box-shadow:0 2px 0 var(--red-d)}
.pr-root .btn-outline{background:#fff;color:var(--blue);border:2.5px solid var(--blue);box-shadow:0 4px 0 #C6D2F8}
.pr-root .btn-outline:hover:not(:disabled){background:#fff;transform:translateY(-2px);box-shadow:0 6px 0 #C6D2F8}
.pr-root .btn-ghost{background:transparent;color:var(--blue);box-shadow:none}
.pr-root .btn-ghost:hover:not(:disabled){background:var(--ice)}
.pr-root .btn:disabled{opacity:.55;cursor:not-allowed;transform:none}
.pr-root .btn:focus-visible{outline:3px solid var(--red);outline-offset:2px}

/* Page */
.pr-page{
  min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;background-color:#F8FAFF;
  background-image:linear-gradient(rgba(11,42,155,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(11,42,155,.06) 1px,transparent 1px);
  background-size:32px 32px;
}

/* Header */
.pr-hero{
  --hero-l:clamp(60px,8vw,120px);
  position:relative;overflow:hidden;color:#fff;padding:16px clamp(18px,5vw,64px) 34px var(--hero-l);
  background-color:var(--blue);border-bottom:6px solid var(--red);
  background-image:
    repeating-linear-gradient(to bottom, transparent 0 35px, rgba(255,255,255,.11) 35px 36px),
    radial-gradient(800px 420px at 85% 0%, var(--blue-l) 0%, transparent 70%);
}
.pr-hero::before{content:"";position:absolute;top:0;bottom:0;left:calc(var(--hero-l) - 28px);width:2px;background:var(--red)}
.pr-top{position:relative;z-index:2;display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:26px}
.pr-logo{background:#fff;border-radius:14px;padding:6px 12px;display:inline-flex;box-shadow:0 5px 0 rgba(7,28,107,.4)}
.pr-hero .btn-ghost{color:#fff;border:2px solid rgba(255,255,255,.55)}
.pr-hero .btn-ghost:hover:not(:disabled){background:rgba(255,255,255,.14)}
.pr-toperr{margin-left:auto;background:#fff;color:var(--red-d);font-weight:800;font-size:13px;padding:7px 14px;border-radius:999px;max-width:100%;overflow-wrap:anywhere}
.pr-hero-body{position:relative;z-index:2;max-width:760px}
.pr-eyebrow{margin:0 0 10px;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;opacity:.85}
.pr-hero h1{margin:0;font-family:'Fraunces',serif;font-weight:800;font-size:clamp(32px,5vw,56px);line-height:1.04;letter-spacing:-.02em}
.pr-scribble{position:relative;display:inline-block}
.pr-scribble svg{position:absolute;left:0;bottom:-10px;width:100%;height:14px}
.pr-scribble path{fill:none;stroke:var(--red);stroke-width:5;stroke-linecap:round}
.pr-sub{margin:20px 0 0;max-width:560px;font-size:clamp(14px,1.5vw,16px);line-height:1.65;opacity:.92}
.pr-stats{display:flex;gap:16px;flex-wrap:wrap;margin-top:22px}
.pr-stat{background:#fffdf7;color:var(--ink);border-radius:6px;padding:12px 18px;box-shadow:0 12px 20px rgba(3,10,50,.35)}
.pr-stat:nth-child(1){transform:rotate(-2deg)}
.pr-stat:nth-child(2){transform:rotate(1.5deg);background:#FFE680}
.pr-stat strong{display:block;font-family:'Fraunces',serif;font-weight:800;font-size:26px;line-height:1.1;color:var(--blue)}
.pr-stat span{font-size:12px;font-weight:700;color:var(--mute)}

/* Body */
.pr-body{flex:1;padding:30px clamp(16px,4vw,48px) 36px}
.pr-inner{max-width:980px;margin:0 auto}

/* Step bar */
.pr-steps{list-style:none;margin:0 0 28px;padding:0;display:flex;align-items:center}
.pr-step-wrap{display:flex;align-items:center;flex:0 0 auto}
.pr-step-wrap:not(:last-child){flex:1 1 auto}
.pr-step{display:flex;align-items:center;gap:10px;font-weight:800;font-size:14px;color:var(--mute);white-space:nowrap}
.pr-step i{
  width:38px;height:38px;border-radius:50%;display:grid;place-items:center;font-style:normal;
  font-family:'Fraunces',serif;font-weight:800;font-size:16px;background:#fff;color:var(--blue);
  border:3px solid var(--blue);box-shadow:0 3px 0 #C6D2F8;
}
.pr-step.cur{color:var(--ink)}
.pr-step.cur i{background:var(--red);border-color:var(--red);color:#fff;box-shadow:0 3px 0 var(--red-d)}
.pr-step.done i{background:var(--blue);color:#fff;box-shadow:0 3px 0 var(--blue-d)}
.pr-step-line{flex:1 1 24px;min-width:16px;margin:0 12px;border-top:3px dashed #B9C6F5}
.pr-step-line.done{border-color:var(--blue)}

/* Weak-mode sticky note */
.pr-weak{
  display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:26px;padding:14px 18px;background:#FFE680;border-radius:6px;
  transform:rotate(-.4deg);box-shadow:0 10px 18px rgba(7,28,107,.18);
}
.pr-weak svg{flex:none}
.pr-weak div{min-width:0}
.pr-weak strong{display:block;font-size:14px}
.pr-weak span{display:block;margin-top:2px;font-size:12.5px;font-weight:600;color:#31407F;line-height:1.45}
.pr-weak .btn{margin-left:auto}

/* Action bar */
.pr-nav{position:sticky;bottom:0;z-index:20;background:#fff;border-top:3px solid var(--blue);padding:14px clamp(16px,4vw,48px) max(14px,env(safe-area-inset-bottom))}
.pr-nav-in{max-width:980px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px}

/* Loader: paper on a ruled notebook page */
.pr-loader{
  position:fixed;inset:0;z-index:200;display:grid;place-items:center;padding:20px;overflow:hidden;background-color:var(--blue);
  background-image:
    repeating-linear-gradient(to bottom, transparent 0 35px, rgba(255,255,255,.11) 35px 36px),
    radial-gradient(800px 500px at 80% 10%, var(--blue-l) 0%, transparent 70%);
}
.pr-loader::before{content:"";position:absolute;top:0;bottom:0;left:clamp(26px,6vw,80px);width:2px;background:var(--red)}
.pr-lcard{
  position:relative;width:100%;max-width:440px;text-align:center;padding:36px 26px 28px;background:#fffdf7;border-radius:8px;
  transform:rotate(-1deg);box-shadow:0 2px 0 #e7e1d0,0 28px 50px rgba(3,10,50,.5);
  background-image:repeating-linear-gradient(to bottom, transparent 0 27px, #dbe3fb 27px 28px);
}
.pr-ltape{position:absolute;top:-12px;left:50%;width:90px;height:24px;margin-left:-45px;background:rgba(255,236,170,.9);transform:rotate(3deg);box-shadow:0 2px 4px rgba(0,0,0,.15)}
.pr-atom{width:96px;height:96px;margin:0 auto 14px;color:var(--blue);display:block}
.pr-atom g{transform-origin:100px 100px;animation:pr-spin 6s linear infinite}
.pr-lcard h2{margin:0;font-family:'Fraunces',serif;font-weight:800;font-size:clamp(22px,5vw,28px);line-height:1.15;color:var(--blue)}
.pr-hand{margin:10px 0 0;min-height:2.3em;font-family:'Caveat',cursive;font-weight:600;font-size:26px;line-height:1.15;color:var(--red)}
.pr-prog{margin-top:18px}
.pr-track{height:14px;border-radius:99px;background:#E4EAFC;border:2px solid var(--blue);overflow:hidden}
.pr-track i{display:block;height:100%;background:var(--blue);border-radius:99px;transition:width .3s ease-out}
.pr-prog small{display:block;margin-top:8px;font-size:12px;font-weight:800;color:var(--mute)}

@keyframes pr-spin{to{transform:rotate(360deg)}}

/* ═════════ RESPONSIVE ═════════ */
@media(max-width:720px){
  .pr-body{padding-top:24px}
  .pr-stat strong{font-size:22px}
  .pr-weak .btn{margin-left:0;width:100%}
  .pr-step{font-size:13px}
  .pr-step-line{margin:0 8px}
}
@media(max-width:560px){
  .pr-hero{--hero-l:50px;padding-top:max(14px,env(safe-area-inset-top));padding-bottom:28px}
  .pr-top{margin-bottom:20px}
  .pr-stats{gap:12px}
  .pr-stat{padding:10px 14px}
  /* only the current step keeps its label */
  .pr-step>span{display:none}
  .pr-step.cur>span{display:inline}
  .pr-step i{width:34px;height:34px;font-size:15px}
  .pr-nav-in .btn{flex:1 1 0;padding:0 14px}
  .pr-nav-in .btn-lg{font-size:15px}
}
@media(max-width:360px){
  .pr-hero{--hero-l:42px}
  .pr-hand{font-size:22px}
  .pr-lcard{padding:32px 18px 22px}
  .pr-nav-in{gap:8px}
}
@media(max-height:480px) and (orientation:landscape){
  .pr-sub,.pr-stats{display:none}
  .pr-lcard{padding:24px 22px 18px}
  .pr-atom{width:56px;height:56px;margin-bottom:8px}
}
@media(hover:none){
  .pr-root .btn-primary:hover:not(:disabled){transform:none;box-shadow:0 6px 0 var(--red-d)}
  .pr-root .btn-outline:hover:not(:disabled){transform:none;box-shadow:0 4px 0 #C6D2F8}
}
@media(prefers-reduced-motion:reduce){
  .pr-root *{animation:none!important;transition:none!important}
}
`;
