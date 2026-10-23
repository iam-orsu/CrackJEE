'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { isAuthenticated, getUser } from '@/lib/auth';
import { QuestionCard } from '@/components/QuestionCard';
import type { Question, AnswerResult, Subject, TopicProgress, PaperSet } from '@/types';
import type { SplitTopics } from '@/lib/api';

const SUBJECT_META: Record<string, { emoji: string }> = {
  Mathematics: { emoji: '∑' },
  Physics:     { emoji: '⚛' },
  Chemistry:   { emoji: '⚗' },
  Botany:      { emoji: '🌿' },
  Zoology:     { emoji: '🦎' },
};

const REVIEW_SUBJ: Record<string, { color: string; icon: string; bg: string }> = {
  Physics:     { color: '#2563eb', icon: '⚛', bg: '#eff6ff' },
  Chemistry:   { color: '#16a34a', icon: '⚗', bg: '#f0fdf4' },
  Mathematics: { color: '#7c3aed', icon: '∑', bg: '#f5f3ff' },
};

/* ─── Loading messages ──────────────────────────────────── */
const LOAD_MESSAGES = [
  'Crafting your questions...',
  'Checking the JEE syllabus...',
  'Running quality checks...',
  'Generating unique problems...',
  'Sit back, almost ready...',
];

/* ─── Types ─────────────────────────────────────────────── */
type AppState = 'wizard' | 'loading' | 'exam' | 'summary' | 'review';
type WizardStep = 1 | 2 | 3;
type DiffOption = 'beginner' | 'intermediate' | 'advanced' | 'mixed';
type MarkingScheme = 'standard' | 'jee_main' | 'jee_advanced';
type StoredResult = AnswerResult & { selectedAnswer: string };

const SUBJECTS_FOR_PAPERS: Subject[] = ['Physics', 'Chemistry', 'Mathematics'];
const DIFFICULTY_LABELS: Array<[string, string]> = [
  ['beginner', 'easy'],
  ['intermediate', 'medium'],
  ['advanced', 'hard'],
];

/* Short plain-text snippet of a question for the paper cards (LaTeX stripped) */
function previewText(text: string): string {
  const plain = text
    .replace(/\$\$?/g, ' ')
    .replace(/\\begin\{[^}]*\}|\\end\{[^}]*\}/g, ' ')
    .replace(/\\\\/g, ' ')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[{}&_^]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > 150 ? plain.slice(0, 150) + '…' : plain;
}

/* Big counts read as "≈ 1.23 × 10^58" instead of a wall of digits */
function formatPossible(value: string): string {
  if (!value || value === '0') return '0';
  if (value.length <= 9) return Number(value).toLocaleString('en-IN');
  return `≈ ${value[0]}.${value.slice(1, 3)} × 10^${value.length - 1}`;
}

/* A paper that looks like a real question paper. The questions stay blurred until the student starts it. */
function PaperCard({ paper, onStart }: { paper: PaperSet; onStart: () => void }) {
  const subjectCounts = SUBJECTS_FOR_PAPERS
    .map((s) => ({ s, n: paper.questions.filter((q) => q.subject === s).length }))
    .filter((x) => x.n > 0);
  const diffCounts = DIFFICULTY_LABELS
    .map(([key, label]) => ({ key, label, n: paper.questions.filter((q) => q.difficulty === key).length }))
    .filter((x) => x.n > 0);
  const topicCount = new Set(paper.questions.map((q) => q.topic)).size;
  const teaser = paper.questions.slice(0, 3).map((q) => previewText(q.questionText));
  const total = paper.questions.length || 1;

  return (
    <button type="button" className="paper-sheet" onClick={onStart}>
      <div className="paper-sheet-head">
        <span className="paper-no">Paper {String(paper.number).padStart(2, '0')}</span>
        <span className="paper-count">{paper.questions.length} questions</span>
      </div>

      <div className="paper-chips">
        {subjectCounts.map(({ s, n }) => (
          <span key={s} className="paper-chip">{SUBJECT_META[s].emoji} {s} · {n}</span>
        ))}
      </div>

      <div className="paper-teaser" aria-hidden="true">
        {teaser.map((t, i) => <p key={i}>{t}</p>)}
      </div>

      <div className="paper-diff" aria-hidden="true">
        {diffCounts.map((d) => (
          <span key={d.key} className={`paper-diff-seg paper-diff-${d.key}`} style={{ flexGrow: d.n / total }} />
        ))}
      </div>

      <div className="paper-foot">
        <span>{topicCount} topics · {diffCounts.map((d) => `${d.n} ${d.label}`).join(' · ')}</span>
        <span className="paper-start">Start →</span>
      </div>
    </button>
  );
}

const CHECK_SVG = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

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
    const q = questions[currentIndex]!;
    const answeredCount = Object.keys(examResults).length;
    const storedResult = examResults[currentIndex];

    return (
      <div className="exam-overlay">
        <div className="exam-header">
          <span className="exam-logo"><img src="/logo.png" alt="JEENEET.ai" className="site-logo" /></span>
          <div className="exam-meta">
            <span className="exam-qnum">Q{currentIndex + 1} / {questions.length}</span>
            <span className="exam-topic">{q.subject} · {q.topic}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span className="exam-timer">{fmtTime(sessionSecs)}</span>
            <button className="btn btn-outline btn-sm" onClick={handleEndSession}>End session</button>
            <button className="btn btn-ghost btn-sm"
              onClick={() => isFullscreen ? exitFullscreen() : enterFullscreen()}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
              {isFullscreen
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/></svg>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
              }
            </button>
          </div>
        </div>

        <div className="exam-body">
          <div className="exam-question-wrap">
            <QuestionCard
              key={currentIndex}
              question={q}
              questionNum={currentIndex + 1}
              onSubmit={handleExamSubmit}
              onNext={handleExamNext}
              initialResult={storedResult}
              initialSelected={storedResult?.selectedAnswer}
              isLast={currentIndex === questions.length - 1}
            />
          </div>
        </div>

        <div className="exam-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {currentIndex > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={() => setCurrentIndex((i) => i - 1)} title="Previous question">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Prev
              </button>
            )}
          </div>
          <div className="exam-palette">
            {questions.map((qItem, i) => {
              const res = examResults[i];
              let cls = 'exam-dot';
              if (i === currentIndex) cls += ' current';
              else if (res) cls += res.isCorrect ? ' correct' : ' wrong';
              return (
                <div key={`${qItem.id}-${i}`} className={cls}
                  style={{ cursor: res ? 'pointer' : 'default' }}
                  onClick={() => res ? setCurrentIndex(i) : undefined}
                  title={res ? `Q${i + 1}: ${res.isCorrect ? 'Correct' : 'Wrong'} (click to review)` : undefined}>
                  {i + 1}
                </div>
              );
            })}
          </div>
          <span className="exam-footer-count">{answeredCount} of {questions.length} answered</span>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     RENDER: Summary
  ═══════════════════════════════════════════════════════ */
  if (appState === 'summary') {
    const total     = questions.length;
    const correct   = Object.values(examResults).filter((r) => r.isCorrect).length;
    const attempted = Object.keys(examResults).length;
    const wrong     = attempted - correct;
    const accuracy  = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    // Same marks as the mock exam: JEE Main integers have no penalty; Advanced single-correct is +3,
    // multi-correct is -2 when wrong, integer is +4. Multi-correct partial credit is not tracked here.
    const pointsIfCorrect = (qt: string) => (markingScheme === 'jee_advanced' && qt === 'mcq_single' ? 3 : 4);
    const jeeScore = markingScheme === 'standard' ? correct : questions.reduce((acc, q, i) => {
      const res = examResults[i];
      if (!res) return acc;
      if (res.isCorrect) return acc + pointsIfCorrect(q.questionType);
      if (markingScheme === 'jee_main') return acc - (q.questionType === 'integer' ? 0 : 1);
      if (q.questionType === 'integer') return acc;
      return acc - (q.questionType === 'mcq_multi' ? 2 : 1);
    }, 0);
    const jeeMax = markingScheme === 'standard' ? total
      : questions.reduce((acc, q) => acc + pointsIfCorrect(q.questionType), 0);

    return (
      <div className="exam-overlay">
        <div className="exam-header">
          <span className="exam-logo"><img src="/logo.png" alt="JEENEET.ai" className="site-logo" /></span>
          <span style={{ fontSize: 14, color: 'var(--gray-500)' }}>Session complete</span>
          <div />
        </div>
        <div className="summary-wrap">
          <div className="summary-card">
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--gray-500)', marginBottom: 20 }}>
              Session Results
            </div>
            <div className="summary-score-big">{accuracy}%</div>
            <div className="summary-score-sub">accuracy · {correct} of {attempted} correct</div>
            <div className="summary-stats">
              <div style={{ textAlign: 'center' }}>
                <div className="summary-stat-val" style={{ color: 'var(--green-600)' }}>{correct}</div>
                <div className="summary-stat-lbl">Correct</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="summary-stat-val" style={{ color: 'var(--red-600)' }}>{wrong}</div>
                <div className="summary-stat-lbl">Wrong</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="summary-stat-val">{total - attempted}</div>
                <div className="summary-stat-lbl">Skipped</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="summary-stat-val">{fmtTime(sessionSecs)}</div>
                <div className="summary-stat-lbl">Time</div>
              </div>
            </div>

            {markingScheme !== 'standard' && (
              <div style={{ background: 'var(--navy-50)', border: '1px solid var(--navy-100)', borderRadius: 'var(--radius-lg)', padding: '14px 20px', marginTop: 4 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--navy-600)', marginBottom: 4 }}>
                  {markingScheme === 'jee_main' ? 'JEE Main Score' : 'JEE Advanced Score (approx.)'}
                </p>
                <p style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.1,
                  color: jeeScore < 0 ? 'var(--red-600)' : jeeScore === 0 ? 'var(--gray-500)' : 'var(--primary)' }}>
                  {jeeScore > 0 ? '+' : ''}{jeeScore}
                  <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-400)', marginLeft: 6 }}>/ {jeeMax}</span>
                </p>
                <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 3 }}>
                  {correct} correct
                  {wrong > 0 && ` · ${wrong} wrong`}
                  {total - attempted > 0 && ` · ${total - attempted} skipped (no penalty)`}
                  {markingScheme === 'jee_advanced' && ' · multi-correct partial credit not reflected'}
                </p>
              </div>
            )}

            <div className="divider" style={{ margin: '20px 0 0' }} />
            <div className="summary-actions">
              <button className="btn btn-primary" onClick={() => setAppState('review')}>Review session &rarr;</button>
              <button className="btn btn-outline" onClick={handlePracticeAgain}>Practice again</button>
              <Link href="/dashboard" className="btn btn-ghost">Dashboard</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     RENDER: Review — coach analysis
  ═══════════════════════════════════════════════════════ */
  if (appState === 'review') {
    const totalQ    = questions.length;
    const correct   = Object.values(examResults).filter((r) => r.isCorrect).length;
    const wrong     = Object.values(examResults).filter((r) => !r.isCorrect).length;
    const skipped   = totalQ - Object.keys(examResults).length;
    const attempted = correct + wrong;
    const accuracy  = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    /* Per-subject stats */
    const subjectStats = new Map<string, { correct: number; total: number }>();
    /* Per-topic stats */
    const topicStats   = new Map<string, { correct: number; total: number; subject: string }>();
    /* Per-difficulty stats */
    const diffStats    = new Map<string, { correct: number; total: number }>();

    questions.forEach((q, i) => {
      const res = examResults[i];
      const isC = res?.isCorrect ?? false;

      if (!subjectStats.has(q.subject)) subjectStats.set(q.subject, { correct: 0, total: 0 });
      subjectStats.get(q.subject)!.total++;
      if (isC) subjectStats.get(q.subject)!.correct++;

      const tk = `${q.subject}::${q.topic}`;
      if (!topicStats.has(tk)) topicStats.set(tk, { correct: 0, total: 0, subject: q.subject });
      topicStats.get(tk)!.total++;
      if (isC) topicStats.get(tk)!.correct++;

      if (res) {
        if (!diffStats.has(q.difficulty)) diffStats.set(q.difficulty, { correct: 0, total: 0 });
        diffStats.get(q.difficulty)!.total++;
        if (isC) diffStats.get(q.difficulty)!.correct++;
      }
    });

    /* Weakest topics — sorted by accuracy ascending */
    const weakTopics = [...topicStats.entries()]
      .map(([key, s]) => ({
        key,
        topic: key.split('::')[1] ?? key,
        subject: s.subject,
        correct: s.correct,
        total: s.total,
        pct: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
      }))
      .filter((t) => t.pct < 100)
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 6);

    /* Generate insight text */
    const insightParts: string[] = [];

    if (accuracy >= 80) {
      insightParts.push('Good session. Your preparation is working.');
    } else if (accuracy >= 60) {
      insightParts.push('You crossed 60%. See the topics below and keep going.');
    } else if (accuracy >= 40) {
      insightParts.push('Not a bad start. The topics below show where you lost marks.');
    } else {
      insightParts.push('Rough session. That is fine. Use the topic list below to know what to study next.');
    }

    /* Difficulty pattern */
    const begS = diffStats.get('beginner');
    const advS = diffStats.get('advanced');
    if (begS && advS && begS.total >= 2 && advS.total >= 2) {
      const begPct = Math.round((begS.correct / begS.total) * 100);
      const advPct = Math.round((advS.correct / advS.total) * 100);
      if (begPct - advPct >= 30) {
        insightParts.push(`You got ${begPct}% on easier questions but only ${advPct}% on harder ones. The concepts are not fully clear yet.`);
      } else if (advPct > begPct + 10) {
        insightParts.push(`You scored higher on harder questions (${advPct}%) than easier ones (${begPct}%). You may be rushing through the simpler problems.`);
      }
    }

    /* Dominant weak subject */
    let worstSubj = ''; let worstPct = 101;
    for (const [subj, s] of subjectStats) {
      if (s.total >= 3) {
        const pct = Math.round((s.correct / s.total) * 100);
        if (pct < worstPct) { worstPct = pct; worstSubj = subj; }
      }
    }
    if (worstSubj && worstPct < 50) {
      insightParts.push(`${worstSubj} is where you lost the most marks. Only ${worstPct}% correct across ${subjectStats.get(worstSubj)!.total} questions.`);
    }

    /* Single topic dominating wrong answers */
    const dominant = weakTopics.find((t) => t.total >= 3 && t.pct === 0);
    if (dominant) {
      insightParts.push(`${dominant.topic} was wrong every time across ${dominant.total} attempts. Revise this topic before your next session.`);
    } else if (skipped > totalQ * 0.3) {
      insightParts.push(`You skipped ${skipped} of ${totalQ} questions. Try to attempt everything in practice, even if you are unsure.`);
    }

    const insight = insightParts.join(' ');

    return (
      <div className="exam-overlay">
        <div className="exam-header">
          <span className="exam-logo"><img src="/logo.png" alt="JEENEET.ai" className="site-logo" /></span>
          <span style={{ fontSize: 14, color: 'var(--gray-500)' }}>Session analysis</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setAppState('summary')}>Back to score</button>
            <button className="btn btn-outline btn-sm" onClick={handlePracticeAgain}>New session</button>
            <Link href="/dashboard" className="btn btn-primary btn-sm">Dashboard</Link>
          </div>
        </div>

        <div className="exam-body" style={{ padding: '40px 32px' }}>
          <div style={{ width: '100%', maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Score headline */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 10 }}>
                <span style={{
                  fontSize: 56, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1,
                  color: accuracy >= 60 ? 'var(--green-600)' : accuracy >= 40 ? 'var(--amber-600)' : 'var(--red-600)',
                }}>
                  {accuracy}%
                </span>
                <span style={{ fontSize: 15, color: 'var(--gray-400)' }}>
                  {correct} correct · {wrong} wrong{skipped > 0 ? ` · ${skipped} skipped` : ''} · {fmtTime(sessionSecs)}
                </span>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--gray-600)', maxWidth: 620 }}>
                {insight}
              </p>
            </div>

            {/* Subject breakdown */}
            {subjectStats.size > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--gray-400)', marginBottom: 12 }}>
                  By subject
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {[...subjectStats.entries()].map(([subj, s]) => {
                    const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                    const cfg = REVIEW_SUBJ[subj] ?? { color: 'var(--gray-600)', icon: '?', bg: 'var(--gray-50)' };
                    const barColor = pct >= 60 ? 'var(--green-600)' : pct >= 40 ? 'var(--amber-600)' : 'var(--red-600)';
                    return (
                      <div key={subj} style={{
                        flex: '1 1 160px', background: 'var(--white)',
                        border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)', padding: '16px 18px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                          <span style={{ fontSize: 18, color: cfg.color }}>{cfg.icon}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' }}>{subj}</span>
                        </div>
                        <p style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.03em', color: barColor, marginBottom: 2 }}>
                          {pct}%
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 10 }}>
                          {s.correct} of {s.total} correct
                        </p>
                        <div style={{ height: 3, background: 'var(--gray-100)', borderRadius: 2 }}>
                          <div style={{ height: '100%', width: `${pct}%`, borderRadius: 2, background: barColor, transition: 'width .7s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Weak topics */}
            {weakTopics.length > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--gray-400)', marginBottom: 12 }}>
                  Topics to focus on
                </p>
                <div style={{ border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                  {weakTopics.map((t, i) => {
                    const cfg = REVIEW_SUBJ[t.subject] ?? { color: 'var(--gray-600)', icon: '?', bg: 'var(--gray-50)' };
                    const pctColor = t.pct < 40 ? 'var(--red-600)' : 'var(--amber-600)';
                    return (
                      <div key={t.key} style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '13px 18px',
                        borderBottom: i < weakTopics.length - 1 ? '1px solid var(--gray-100)' : 'none',
                        background: 'var(--white)',
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-300)', width: 18, flexShrink: 0 }}>#{i + 1}</span>
                        <span style={{ fontSize: 15, color: cfg.color, flexShrink: 0 }}>{cfg.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {t.topic}
                          </p>
                          <p style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 1 }}>{t.subject}</p>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <p style={{ fontSize: 15, fontWeight: 800, color: pctColor }}>{t.pct}%</p>
                          <p style={{ fontSize: 11, color: 'var(--gray-400)' }}>{t.correct}/{t.total} correct</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All correct / nothing to show */}
            {weakTopics.length === 0 && attempted > 0 && (
              <div style={{ background: 'var(--green-50)', border: '1px solid var(--green-100)', borderRadius: 'var(--radius-xl)', padding: '20px 24px' }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--green-600)', marginBottom: 4 }}>
                  Perfect or near-perfect session
                </p>
                <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7 }}>
                  You got every answered question right. Try a harder difficulty or a new topic to keep growing.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  return null;
}
