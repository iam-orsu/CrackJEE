'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { isAuthenticated, getUser } from '@/lib/auth';
import { QuestionCard } from '@/components/QuestionCard';
import type { Question, AnswerResult, Subject } from '@/types';

/* ─── Syllabus data ─────────────────────────────────────── */
const TOPICS_BY_CLASS: Record<Subject, { class11: string[]; class12: string[] }> = {
  Mathematics: {
    class11: ['Sets','Relations and Functions','Trigonometric Functions','Principle of Mathematical Induction','Complex Numbers','Quadratic Equations','Linear Inequalities','Permutations and Combinations','Binomial Theorem','Sequences and Series','Straight Lines','Circles','Conic Sections','Introduction to 3D Geometry','Limits and Derivatives','Statistics','Probability'],
    class12: ['Relations and Functions (Advanced)','Inverse Trigonometric Functions','Matrices','Determinants','Continuity and Differentiability','Applications of Derivatives','Indefinite Integration','Definite Integration','Applications of Integrals','Differential Equations','Vectors','Three Dimensional Geometry','Linear Programming','Probability (Bayes and Random Variables)'],
  },
  Physics: {
    class11: ['Units and Dimensions','Kinematics','Laws of Motion','Friction','Work Energy and Power','System of Particles','Rotational Motion','Gravitation','Elasticity','Fluid Mechanics','Thermal Properties of Matter','Thermodynamics','Kinetic Theory of Gases','Simple Harmonic Motion','Waves'],
    class12: ['Electrostatics','Electric Potential and Capacitance','Current Electricity','Moving Charges and Magnetism','Magnetism and Matter','Electromagnetic Induction','Alternating Current','Electromagnetic Waves','Ray Optics','Wave Optics','Dual Nature of Radiation','Atoms and Nuclei','Semiconductor Devices','Communication Systems'],
  },
  Chemistry: {
    class11: ['Mole Concept and Stoichiometry','Atomic Structure','Periodic Table and Periodicity','Chemical Bonding','States of Matter','Chemical Thermodynamics','Chemical Equilibrium','Ionic Equilibrium','Redox Reactions','Hydrogen','s-Block Elements','p-Block Elements Group 13 and 14','Organic Chemistry Basics','Hydrocarbons','Environmental Chemistry'],
    class12: ['Solid State','Solutions','Electrochemistry','Chemical Kinetics','Surface Chemistry','General Principles of Metallurgy','p-Block Elements Group 15 to 18','Transition Metals and d-Block','Coordination Compounds','Haloalkanes and Haloarenes','Alcohols Phenols and Ethers','Aldehydes and Ketones','Carboxylic Acids and Derivatives','Amines','Biomolecules','Polymers'],
  },
};

const SUBJECT_META: Record<Subject, { emoji: string; sub: string }> = {
  Mathematics: { emoji: '∑', sub: '31 topics' },
  Physics:     { emoji: 'φ', sub: '29 topics' },
  Chemistry:   { emoji: '⚗', sub: '31 topics' },
};

function getTopicsForStudent(subject: Subject, studentClass: string) {
  const t = TOPICS_BY_CLASS[subject];
  return studentClass === '11' ? { class11: t.class11, class12: [] } : t;
}

/* ─── Loading messages ──────────────────────────────────── */
const LOAD_MESSAGES = [
  'Crafting your questions...',
  'Checking the JEE syllabus...',
  'Running quality checks...',
  'Generating unique problems...',
  'Sit back, almost ready...',
];

/* ─── Types ─────────────────────────────────────────────── */
type AppState = 'wizard' | 'loading' | 'exam' | 'summary';
type WizardStep = 1 | 2 | 3;
type DiffOption = 'beginner' | 'intermediate' | 'advanced' | 'mixed';

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
  const user = getUser();
  const studentClass = user?.class ?? '12';

  useEffect(() => { if (!isAuthenticated()) router.push('/login'); }, [router]);

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

  /* ── Loading ── */
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadMsgIdx, setLoadMsgIdx] = useState(0);
  const [loadError, setLoadError] = useState('');

  /* ── Exam ── */
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [examResults, setExamResults] = useState<Record<number, AnswerResult>>({});
  const [sessionSecs, setSessionSecs] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const sessionTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  /* ─── Fullscreen handling ─────────────────────────────── */
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

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
        if (next.size === 1) return prev; // at least 1 required
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
    for (const s of all) {
      topics[s] = new Set(); // student picks topics in step 2
    }
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
    const topics = getTopicsForStudent(subject, studentClass);
    const all = [...topics.class11, ...topics.class12];
    const cur = selectedTopics[subject];
    if (cur && cur.size === all.length) {
      setSelectedTopics((p) => ({ ...p, [subject]: new Set([all[0] ?? '']) }));
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

  /* ─── Start exam (fetch batch) ────────────────────────── */
  const startExam = useCallback(async () => {
    // Must be called synchronously in the click handler to satisfy browser gesture requirement
    enterFullscreen();
    setAppState('loading');
    setLoadProgress(0);
    setLoadMsgIdx(0);
    setLoadError('');

    // Animate progress — keeps moving the whole time, never truly stops
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

      // Short pause so 100% is visible
      await new Promise((r) => setTimeout(r, 500));

      // Sort questions by subject in the order subjects were selected (Physics all first, then Chemistry, etc.)
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

  /* ─── Exam handlers ───────────────────────────────────── */
  async function handleExamSubmit(answer: string, timeSpent: number): Promise<AnswerResult> {
    const q = questions[currentIndex]!;
    const result = await api.answers.submit({ questionId: q.id, answer, timeSpent });
    setExamResults((prev) => ({ ...prev, [currentIndex]: result }));
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
    setAppState('wizard');
    setWizardStep(1);
    setQuestions([]);
    setExamResults({});
  }

  /* ─── Timer formatting ─────────────────────────────────── */
  function fmtTime(secs: number) {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  /* ═══════════════════════════════════════════════════════
     RENDER: Wizard
  ═══════════════════════════════════════════════════════ */
  if (appState === 'wizard') {
    const subjects: Subject[] = ['Mathematics', 'Physics', 'Chemistry'];

    return (
      <div className="wizard-page">
        {/* Topbar */}
        <div className="wizard-topbar">
          <span className="wizard-topbar-logo">CrackJEE</span>
          <div className="divider" style={{ width: 1, height: 20, background: 'var(--gray-200)', margin: '0 4px' }} />
          <Link href="/dashboard" className="btn btn-ghost btn-sm">Dashboard</Link>
          {loadError && (
            <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--red-600)' }}>{loadError}</span>
          )}
        </div>

        <div className="wizard-body">
          <div className="wizard-inner">
            {/* Step bar */}
            <div className="wizard-step-bar">
              {(['Subjects', 'Topics', 'Session'] as const).map((label, idx) => {
                const stepN = (idx + 1) as WizardStep;
                const isDone = wizardStep > stepN;
                const isActive = wizardStep === stepN;
                return (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', flex: idx < 2 ? 1 : undefined }}>
                    <div className={`wizard-step-item${isActive ? ' active' : ''}${isDone ? ' done' : ''}`}>
                      <div className="wizard-step-num">
                        {isDone ? CHECK_SVG : stepN}
                      </div>
                      <span className="wizard-step-label">{label}</span>
                    </div>
                    {idx < 2 && <div className="wizard-step-line" />}
                  </div>
                );
              })}
            </div>

            {/* ── Step 1: Subjects ── */}
            {wizardStep === 1 && (
              <>
                <p className="wizard-section-title">Which subjects?</p>
                <p className="wizard-section-sub">
                  Pick one or more. You can practice MPC together or focus on one.
                </p>
                <div className="subject-cards">
                  {/* MPC All */}
                  <div
                    className={`subject-card${selectedSubjects.size === 3 ? ' selected' : ''}`}
                    onClick={selectAllSubjects}
                  >
                    <span className="subject-card-emoji">MPC</span>
                    <span className="subject-card-name">All Three</span>
                    <span className="subject-card-sub">Full coverage</span>
                  </div>
                  {subjects.map((s) => (
                    <div
                      key={s}
                      className={`subject-card${selectedSubjects.has(s) ? ' selected' : ''}`}
                      onClick={() => toggleSubject(s)}
                    >
                      <span className="subject-card-emoji" style={{ fontFamily: 'serif', fontSize: 28 }}>
                        {SUBJECT_META[s].emoji}
                      </span>
                      <span className="subject-card-name">{s}</span>
                      <span className="subject-card-sub">{SUBJECT_META[s].sub}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12, fontSize: 13, color: 'var(--gray-500)' }}>
                  {selectedSubjects.size} subject{selectedSubjects.size !== 1 ? 's' : ''} selected
                </div>
              </>
            )}

            {/* ── Step 2: Topics ── */}
            {wizardStep === 2 && (
              <>
                <p className="wizard-section-title">Which topics?</p>
                <p className="wizard-section-sub">
                  Select all or pick specific ones. Questions rotate across your selection.
                </p>
                {Array.from(selectedSubjects).map((subject) => {
                  const topics = getTopicsForStudent(subject, studentClass);
                  const cur = selectedTopics[subject] ?? new Set<string>();
                  const allTopics = [...topics.class11, ...topics.class12];
                  const allSelected = cur.size === allTopics.length;

                  return (
                    <div key={subject} className="topic-subject-section">
                      <div className="topic-subject-header">
                        <span className="topic-subject-name">{subject}</span>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => toggleAllTopics(subject)}
                        >
                          {allSelected ? 'Deselect all' : 'Select all'}
                        </button>
                      </div>

                      {topics.class11.length > 0 && (
                        <div className="topic-class-group">
                          {studentClass !== '11' && (
                            <p className="topic-class-label">Class 11</p>
                          )}
                          <div className="wizard-topic-grid">
                            {topics.class11.map((t) => (
                              <button
                                key={t}
                                className={`topic-chip${cur.has(t) ? ' selected' : ''}`}
                                onClick={() => toggleTopic(subject, t)}
                              >
                                <span className="topic-chip-check">
                                  {cur.has(t) && CHECK_SVG}
                                </span>
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
                              <button
                                key={t}
                                className={`topic-chip${cur.has(t) ? ' selected' : ''}`}
                                onClick={() => toggleTopic(subject, t)}
                              >
                                <span className="topic-chip-check">
                                  {cur.has(t) && CHECK_SVG}
                                </span>
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

            {/* ── Step 3: Session config ── */}
            {wizardStep === 3 && (
              <>
                <p className="wizard-section-title">Session settings</p>
                <p className="wizard-section-sub">Configure your exam session.</p>

                <div className="config-row">
                  <p className="config-label">How many questions per subject?</p>
                  <div className="pill-group">
                    {([5, 10, 20, 30] as const).map((n) => (
                      <button
                        key={n}
                        className={`pill${questionCount === n ? ' selected' : ''}`}
                        onClick={() => setQuestionCount(n)}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      className={`pill${questionCount === 'custom' ? ' selected' : ''}`}
                      onClick={() => setQuestionCount('custom')}
                    >
                      Custom
                    </button>
                    {questionCount === 'custom' && (
                      <input
                        type="number"
                        className="custom-count-input"
                        placeholder="1-30"
                        min={1}
                        max={30}
                        value={customCount}
                        onChange={(e) => setCustomCount(e.target.value)}
                      />
                    )}
                  </div>
                </div>

                <div className="config-row">
                  <p className="config-label">Difficulty</p>
                  <div className="pill-group">
                    {(['mixed', 'beginner', 'intermediate', 'advanced'] as DiffOption[]).map((d) => (
                      <button
                        key={d}
                        className={`pill${difficulty === d ? ' selected' : ''}`}
                        onClick={() => setDifficulty(d)}
                        style={{ textTransform: 'capitalize' }}
                      >
                        {d === 'mixed' ? 'Mixed (all levels)' : d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="config-row">
                  <p className="config-label">Exam type</p>
                  <div className="pill-group">
                    {(['Main', 'Advanced'] as const).map((e) => (
                      <button
                        key={e}
                        className={`pill${examType === e ? ' selected' : ''}`}
                        onClick={() => setExamType(e)}
                      >
                        JEE {e}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="card card-sm" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 13 }}>
                    <span>
                      <strong style={{ color: 'var(--gray-900)' }}>{resolvedCount()}</strong>{' '}
                      <span style={{ color: 'var(--gray-500)' }}>per subject</span>
                      {selectedSubjects.size > 1 && (
                        <span style={{ color: 'var(--gray-400)', marginLeft: 4 }}>
                          ({resolvedCount() * selectedSubjects.size} total)
                        </span>
                      )}
                    </span>
                    <span>
                      <strong style={{ color: 'var(--gray-900)', textTransform: 'capitalize' }}>{difficulty}</strong>{' '}
                      <span style={{ color: 'var(--gray-500)' }}>difficulty</span>
                    </span>
                    <span>
                      <strong style={{ color: 'var(--gray-900)' }}>JEE {examType}</strong>
                    </span>
                    <span>
                      <strong style={{ color: 'var(--gray-900)' }}>{Array.from(selectedSubjects).join(', ')}</strong>
                    </span>
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

            {/* Wizard nav */}
            <div className="wizard-nav">
              <button
                className="btn btn-outline"
                onClick={() => wizardStep > 1 ? setWizardStep((s) => (s - 1) as WizardStep) : router.push('/dashboard')}
              >
                {wizardStep === 1 ? 'Cancel' : 'Back'}
              </button>

              {wizardStep < 3 ? (
                <button
                  className="btn btn-primary btn-lg"
                  disabled={!canAdvanceStep()}
                  onClick={() => setWizardStep((s) => (s + 1) as WizardStep)}
                >
                  Continue
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-lg"
                  onClick={startExam}
                >
                  Start Exam
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
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gray-800)" strokeWidth="1.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>

        <div className="ai-loader-text">
          <p className="ai-loader-title">Preparing your session</p>
          <p className="ai-loader-msg">{LOAD_MESSAGES[loadMsgIdx]}</p>
          <div className="ai-loader-dots">
            <div className="ai-loader-dot" />
            <div className="ai-loader-dot" />
            <div className="ai-loader-dot" />
          </div>
        </div>

        <div className="ai-loader-bar-wrap">
          <div className="ai-loader-bar-track">
            <div className="ai-loader-bar-fill" style={{ width: `${loadProgress}%` }} />
          </div>
          <p className="ai-loader-bar-label">
            {loadProgress < 100 ? `${Math.round(loadProgress)}% complete` : 'Ready!'}
          </p>
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

    return (
      <div className="exam-overlay">
        {/* Header */}
        <div className="exam-header">
          <span className="exam-logo">CrackJEE</span>

          <div className="exam-meta">
            <span className="exam-qnum">Q{currentIndex + 1} / {questions.length}</span>
            <span className="exam-topic">{q.subject} · {q.topic}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span className="exam-timer">{fmtTime(sessionSecs)}</span>
            <button className="btn btn-outline btn-sm" onClick={handleEndSession}>
              End session
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => isFullscreen ? exitFullscreen() : enterFullscreen()}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="exam-body">
          <div className="exam-question-wrap">
            <QuestionCard
              key={q.id}
              question={q}
              questionNum={currentIndex + 1}
              onSubmit={handleExamSubmit}
              onNext={handleExamNext}
            />
          </div>
        </div>

        {/* Footer palette */}
        <div className="exam-footer">
          <div className="exam-palette">
            {questions.map((qItem, i) => {
              const res = examResults[i];
              let cls = 'exam-dot';
              if (i === currentIndex) cls += ' current';
              else if (res) cls += res.isCorrect ? ' correct' : ' wrong';
              return (
                <div key={`${qItem.id}-${i}`} className={cls}>{i + 1}</div>
              );
            })}
          </div>
          <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>
            {answeredCount} of {questions.length} answered
          </span>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     RENDER: Summary
  ═══════════════════════════════════════════════════════ */
  if (appState === 'summary') {
    const total = questions.length;
    const correct = Object.values(examResults).filter((r) => r.isCorrect).length;
    const attempted = Object.keys(examResults).length;
    const answeredCount = attempted;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    return (
      <div className="exam-overlay">
        <div className="exam-header">
          <span className="exam-logo">CrackJEE</span>
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
                <div className="summary-stat-val" style={{ color: 'var(--red-600)' }}>{attempted - correct}</div>
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

            <div className="divider" />

            <div className="summary-actions">
              <button className="btn btn-outline" onClick={handlePracticeAgain}>
                Practice again
              </button>
              <Link href="/dashboard" className="btn btn-primary">
                View dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
