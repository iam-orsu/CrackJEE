'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { QuestionCard } from '@/components/QuestionCard';
import type { Question, AnswerResult, TopicProgress } from '@/types';
import type { SplitTopics } from '@/lib/api';

type NeetSubject = 'Physics' | 'Chemistry' | 'Botany' | 'Zoology';

const NEET_SUBJECT_META: Record<NeetSubject, { emoji: string; color: string }> = {
  Physics:   { emoji: '⚛', color: '#2563eb' },
  Chemistry: { emoji: '⚗', color: '#16a34a' },
  Botany:    { emoji: '🌿', color: '#15803d' },
  Zoology:   { emoji: '🦎', color: '#0891b2' },
};

const ALL_NEET_SUBJECTS: NeetSubject[] = ['Physics', 'Chemistry', 'Botany', 'Zoology'];

type AppState = 'wizard' | 'loading' | 'exam' | 'summary' | 'review';
type WizardStep = 1 | 2 | 3;
type DiffOption = 'beginner' | 'intermediate' | 'advanced' | 'mixed';
type StoredResult = AnswerResult & { selectedAnswer: string };

const CHECK_SVG = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const LOAD_MESSAGES = [
  'Finding NEET questions…',
  'Checking the NMC syllabus…',
  'Pulling from question bank…',
  'Almost ready…',
];

export default function NEETPracticePage() {
  const router = useRouter();

  const [appState, setAppState] = useState<AppState>('wizard');
  const [wizardStep, setWizardStep] = useState<WizardStep>(1);

  const [selectedSubjects, setSelectedSubjects] = useState<Set<NeetSubject>>(new Set(['Botany']));
  const [selectedTopics, setSelectedTopics] = useState<Partial<Record<NeetSubject, Set<string>>>>({
    Botany: new Set(),
  });
  const [questionCount, setQuestionCount] = useState<number | 'custom'>(10);
  const [customCount, setCustomCount] = useState('');
  const [difficulty, setDifficulty] = useState<DiffOption>('mixed');

  const [topicsByClass, setTopicsByClass] = useState<SplitTopics | null>(null);
  const [bank, setBank] = useState<{ total: number; bySubject: Record<string, number> } | null>(null);

  /* ── Weak mode ── */
  const [weakMode, setWeakMode] = useState(false);
  const [weakSource, setWeakSource] = useState<'global' | 'mock' | null>(null);
  const [weakStartLoading, setWeakStartLoading] = useState(false);

  const [loadProgress, setLoadProgress] = useState(0);
  const [loadMsgIdx, setLoadMsgIdx] = useState(0);
  const [loadError, setLoadError] = useState('');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [examResults, setExamResults] = useState<Record<number, StoredResult>>({});
  const [sessionSecs, setSessionSecs] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const sessionTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    api.questions.topics(undefined, 'NEET').then(setTopicsByClass).catch(() => {});
    api.questions.bankStats('NEET').then(setBank).catch(() => {});

    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');

    if (mode === 'mock_weak') {
      const rawData = params.get('weakData');
      if (rawData) {
        try {
          const parsed = JSON.parse(decodeURIComponent(rawData)) as { subjects: string[]; topics: Record<string, string[]> };
          const valid: NeetSubject[] = ['Physics', 'Chemistry', 'Botany', 'Zoology'];
          const subjects = parsed.subjects.filter((s) => valid.includes(s as NeetSubject)) as NeetSubject[];
          if (subjects.length > 0) {
            const subjSet = new Set<NeetSubject>(subjects);
            const topicsMap: Partial<Record<NeetSubject, Set<string>>> = {};
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
        const neetSubjects: NeetSubject[] = ['Physics', 'Chemistry', 'Botany', 'Zoology'];
        const subjectTopics = new Map<NeetSubject, Set<string>>();
        for (const w of areas) {
          const subj = w.subject as NeetSubject;
          if (!neetSubjects.includes(subj)) continue;
          if (!subjectTopics.has(subj)) subjectTopics.set(subj, new Set());
          subjectTopics.get(subj)!.add(w.topicName);
        }
        if (subjectTopics.size === 0) { setWeakStartLoading(false); return; }
        const topicsMap: Partial<Record<NeetSubject, Set<string>>> = {};
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

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  useEffect(() => () => clearInterval(sessionTimerRef.current), []);

  function enterFullscreen() {
    try { document.documentElement.requestFullscreen().catch(() => {}); } catch {}
  }
  function exitFullscreen() {
    try { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); } catch {}
  }

  function getTopicsForSubject(subject: NeetSubject) {
    const t = topicsByClass?.[subject];
    return t ?? { class11: [], class12: [] };
  }

  const bankTotal = bank
    ? (Object.entries(bank.bySubject)
        .filter(([s]) => ['Botany', 'Zoology', 'Physics', 'Chemistry'].includes(s))
        .reduce((sum, [, n]) => sum + n, 0)).toLocaleString('en-IN')
    : '—';

  function toggleSubject(s: NeetSubject) {
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
    setSelectedSubjects(new Set(ALL_NEET_SUBJECTS));
    const topics: Partial<Record<NeetSubject, Set<string>>> = {};
    for (const s of ALL_NEET_SUBJECTS) topics[s] = new Set();
    setSelectedTopics(topics);
  }

  function toggleTopic(subject: NeetSubject, topic: string) {
    setSelectedTopics((prev) => {
      const cur = new Set(prev[subject] ?? []);
      if (cur.has(topic)) { if (cur.size === 1) return prev; cur.delete(topic); }
      else cur.add(topic);
      return { ...prev, [subject]: cur };
    });
  }

  function toggleAllTopics(subject: NeetSubject) {
    const topics = getTopicsForSubject(subject);
    const all = [...topics.class11, ...topics.class12];
    if (all.length === 0) return;
    const cur = selectedTopics[subject];
    if (cur && cur.size === all.length) {
      setSelectedTopics((p) => ({ ...p, [subject]: new Set([all[0]!]) }));
    } else {
      setSelectedTopics((p) => ({ ...p, [subject]: new Set(all) }));
    }
  }

  function canAdvanceStep(): boolean {
    if (wizardStep === 1) return selectedSubjects.size > 0;
    if (wizardStep === 2) {
      return Array.from(selectedSubjects).every((s) => (selectedTopics[s]?.size ?? 0) > 0);
    }
    return true;
  }

  function buildSelections(): Array<{ subject: string; topic: string }> {
    const out: Array<{ subject: string; topic: string }> = [];
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
      return isNaN(n) || n < 1 ? 5 : Math.min(n, 45);
    }
    return questionCount;
  }

  const startExam = useCallback(async () => {
    enterFullscreen();
    setAppState('loading');
    setLoadProgress(0);
    setLoadMsgIdx(0);
    setLoadError('');

    let p = 0;
    const progressInterval = setInterval(() => {
      p = Math.min(p + (p < 60 ? 5 : p < 85 ? 2 : 0.5), 97);
      setLoadProgress(p);
    }, 200);
    const msgInterval = setInterval(() => setLoadMsgIdx((i) => (i + 1) % LOAD_MESSAGES.length), 2500);

    try {
      const selections = buildSelections();
      const perSubject = resolvedCount();
      const count = perSubject * selectedSubjects.size;

      const batch = await api.questions.batch({
        selections,
        difficulty,
        examType: 'NEET',
        studentClass: '12',
        count,
      });

      clearInterval(progressInterval);
      clearInterval(msgInterval);
      setLoadProgress(100);
      await new Promise((r) => setTimeout(r, 400));

      const subjectOrder = Array.from(selectedSubjects);
      const sorted = [...batch].sort(
        (a, b) => subjectOrder.indexOf(a.subject as NeetSubject) - subjectOrder.indexOf(b.subject as NeetSubject),
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
      setLoadError(e instanceof Error ? e.message : 'Failed to load questions');
      setAppState('wizard');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubjects, selectedTopics, questionCount, customCount, difficulty]);

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
          <p className="ai-loader-msg">Checking your NEET topic progress...</p>
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
          {loadError && <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--red-600)' }}>{loadError}</span>}
        </div>

        <div className="paper-hero" style={{ background: '#fff', borderBottom: '1px solid var(--gray-200)', padding: '36px 40px 32px', flexShrink: 0 }}>
          <div style={{ maxWidth: 920, margin: '0 auto' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 8 }}>
              NEET Practice Mode
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.2, marginBottom: 10, letterSpacing: '-0.02em' }}>
              Practice NEET — Biology, Physics, Chemistry
            </h1>
            <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.6, maxWidth: 500, marginBottom: 24 }}>
              Draw questions from the NEET question bank across Botany, Zoology, Physics and Chemistry. All questions are MCQ single correct, NCERT-based.
            </p>
            <div style={{ display: 'flex', gap: 28 }}>
              {[
                { num: bankTotal, label: 'NEET Questions' },
                { num: '78', label: 'Topics' },
                { num: '4', label: 'Subjects' },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em' }}>{num}</div>
                  <div style={{ fontSize: 10, color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 1 }}>{label}</div>
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
                <p className="wizard-section-sub">NEET has 4 subjects. Pick the ones you want to practice.</p>
                <div className="subject-cards">
                  <div className={`subject-card${selectedSubjects.size === 4 ? ' selected' : ''}`} onClick={selectAllSubjects}>
                    <span className="subject-card-emoji">NEET</span>
                    <span className="subject-card-name">All Four</span>
                    <span className="subject-card-sub">Full coverage</span>
                  </div>
                  {ALL_NEET_SUBJECTS.map((s) => {
                    const t = topicsByClass?.[s];
                    const topicCount = t ? (t.class11.length + t.class12.length) : null;
                    const qCount = bank?.bySubject[s];
                    return (
                      <div key={s} className={`subject-card${selectedSubjects.has(s) ? ' selected' : ''}`} onClick={() => toggleSubject(s)}>
                        <span className="subject-card-emoji" style={{ fontSize: 24 }}>{NEET_SUBJECT_META[s].emoji}</span>
                        <span className="subject-card-name">{s}</span>
                        <span className="subject-card-sub">
                          {topicCount !== null ? `${topicCount} topics` : 'Loading...'}
                          {qCount !== undefined && ` · ${qCount.toLocaleString('en-IN')} Qs`}
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
                <p className="wizard-section-sub">All topics follow the NMC Rationalized Syllabus 2024-2026.</p>
                {Array.from(selectedSubjects).map((subject) => {
                  const topics = getTopicsForSubject(subject);
                  const cur = selectedTopics[subject] ?? new Set<string>();
                  const allTopics = [...topics.class11, ...topics.class12];
                  const allSelected = cur.size === allTopics.length;
                  return (
                    <div key={subject} className="topic-subject-section">
                      <div className="topic-subject-header">
                        <span className="topic-subject-name" style={{ color: NEET_SUBJECT_META[subject].color }}>
                          {NEET_SUBJECT_META[subject].emoji} {subject}
                        </span>
                        <button className="btn btn-ghost btn-sm" onClick={() => toggleAllTopics(subject)}>
                          {allSelected ? 'Deselect all' : 'Select all'}
                        </button>
                      </div>
                      {topics.class11.length > 0 && (
                        <div className="topic-class-group">
                          <p className="topic-class-label">Class 11</p>
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

            {wizardStep === 3 && (
              <>
                <p className="wizard-section-title">Session settings</p>
                <p className="wizard-section-sub">All NEET questions are MCQ single-correct. Marking: +4 / −1.</p>

                <div className="config-row">
                  <p className="config-label">Questions per subject</p>
                  <div className="pill-group">
                    {([5, 10, 20, 30, 45] as const).map((n) => (
                      <button key={n} className={`pill${questionCount === n ? ' selected' : ''}`} onClick={() => setQuestionCount(n)}>{n}</button>
                    ))}
                    <button className={`pill${questionCount === 'custom' ? ' selected' : ''}`} onClick={() => setQuestionCount('custom')}>Custom</button>
                    {questionCount === 'custom' && (
                      <input type="number" className="custom-count-input" placeholder="1-45" min={1} max={45}
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
                    <span><strong style={{ color: 'var(--gray-900)' }}>NEET UG</strong></span>
                    <span><strong style={{ color: 'var(--gray-900)' }}>{Array.from(selectedSubjects).join(', ')}</strong></span>
                  </div>
                </div>
              </>
            )}

            <div className="wizard-nav">
              <button className="btn btn-outline"
                onClick={() => {
                  if (wizardStep > 1) setWizardStep((s) => (s - 1) as WizardStep);
                  else router.push('/dashboard');
                }}>
                {wizardStep === 1 ? 'Cancel' : 'Back'}
              </button>
              {wizardStep < 3 ? (
                <button className="btn btn-primary btn-lg" disabled={!canAdvanceStep()}
                  onClick={() => setWizardStep((s) => (s + 1) as WizardStep)}>Continue</button>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={startExam}>
                  Start practice
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
     RENDER: Loading
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
            </svg>
          </div>
        </div>
        <div className="ai-loader-text">
          <p className="ai-loader-title">Preparing NEET session</p>
          <p className="ai-loader-msg">{LOAD_MESSAGES[loadMsgIdx]}</p>
          <div className="ai-loader-dots">
            <div className="ai-loader-dot" /><div className="ai-loader-dot" /><div className="ai-loader-dot" />
          </div>
        </div>
        <div className="ai-loader-bar-wrap">
          <div className="ai-loader-bar-track">
            <div className="ai-loader-bar-fill" style={{ width: `${loadProgress}%` }} />
          </div>
          <p className="ai-loader-bar-label">{loadProgress < 100 ? `${Math.round(loadProgress)}%` : 'Ready!'}</p>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     RENDER: Exam
  ═══════════════════════════════════════════════════════ */
  if (appState === 'exam' && questions.length > 0) {
    const q = questions[currentIndex]!;
    const answeredCount = Object.keys(examResults).length;
    const storedResult = examResults[currentIndex];

    return (
      <div className="exam-overlay">
        <div className="exam-header">
          <span className="exam-logo"><img src="/logo.png" alt="JEENEET.ai" className="site-logo" /> · NEET</span>
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
              <button className="btn btn-ghost btn-sm" onClick={() => setCurrentIndex((i) => i - 1)}>
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
                  onClick={() => res ? setCurrentIndex(i) : undefined}>
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
    const neetScore = questions.reduce((acc, _q, i) => {
      const res = examResults[i];
      if (!res) return acc;
      return acc + (res.isCorrect ? 4 : -1);
    }, 0);
    const neetMax = total * 4;

    return (
      <div className="exam-overlay">
        <div className="exam-header">
          <span className="exam-logo"><img src="/logo.png" alt="JEENEET.ai" className="site-logo" /> · NEET</span>
          <span style={{ fontSize: 14, color: 'var(--gray-500)' }}>Session complete</span>
          <div />
        </div>
        <div className="summary-wrap">
          <div className="summary-card">
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--gray-500)', marginBottom: 20 }}>
              NEET Session Results
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

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-lg)', padding: '14px 20px', marginTop: 4 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: '#16a34a', marginBottom: 4 }}>
                NEET Score (approx.)
              </p>
              <p style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.1,
                color: neetScore < 0 ? 'var(--red-600)' : neetScore === 0 ? 'var(--gray-500)' : '#16a34a' }}>
                {neetScore > 0 ? '+' : ''}{neetScore}
                <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-400)', marginLeft: 6 }}>/ {neetMax}</span>
              </p>
              <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 3 }}>
                +4 correct · −1 wrong · 0 skipped
              </p>
            </div>

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
     RENDER: Review
  ═══════════════════════════════════════════════════════ */
  if (appState === 'review') {
    const totalQ    = questions.length;
    const correct   = Object.values(examResults).filter((r) => r.isCorrect).length;
    const wrong     = Object.values(examResults).filter((r) => !r.isCorrect).length;
    const skipped   = totalQ - Object.keys(examResults).length;
    const attempted = correct + wrong;
    const accuracy  = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    const subjectStats = new Map<string, { correct: number; total: number }>();
    const topicStats   = new Map<string, { correct: number; total: number; subject: string }>();

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
    });

    const weakTopics = [...topicStats.entries()]
      .map(([key, s]) => ({
        key, topic: key.split('::')[1] ?? key, subject: s.subject,
        correct: s.correct, total: s.total,
        pct: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
      }))
      .filter((t) => t.pct < 100)
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 6);

    const insight = accuracy >= 80
      ? 'Strong session. Keep going through more topics.'
      : accuracy >= 60
        ? 'Good work. Review the topics below to push higher.'
        : accuracy >= 40
          ? 'Keep practising. The topic list below shows where to focus.'
          : 'Focus on NCERT first — revise the concepts behind the topics below.';

    return (
      <div className="exam-overlay">
        <div className="exam-header">
          <span className="exam-logo"><img src="/logo.png" alt="JEENEET.ai" className="site-logo" /> · NEET</span>
          <span style={{ fontSize: 14, color: 'var(--gray-500)' }}>Session analysis</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setAppState('summary')}>Back to score</button>
            <button className="btn btn-outline btn-sm" onClick={handlePracticeAgain}>New session</button>
            <Link href="/dashboard" className="btn btn-primary btn-sm">Dashboard</Link>
          </div>
        </div>
        <div className="exam-body" style={{ padding: '40px 32px' }}>
          <div style={{ width: '100%', maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 28 }}>
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
              <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--gray-600)', maxWidth: 620 }}>{insight}</p>
            </div>

            {subjectStats.size > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--gray-400)', marginBottom: 12 }}>By subject</p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {[...subjectStats.entries()].map(([subj, s]) => {
                    const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                    const color = NEET_SUBJECT_META[subj as NeetSubject]?.color ?? 'var(--gray-600)';
                    const emoji = NEET_SUBJECT_META[subj as NeetSubject]?.emoji ?? '?';
                    const barColor = pct >= 60 ? 'var(--green-600)' : pct >= 40 ? 'var(--amber-600)' : 'var(--red-600)';
                    return (
                      <div key={subj} style={{
                        flex: '1 1 160px', background: 'var(--white)',
                        border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)', padding: '16px 18px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                          <span style={{ fontSize: 18, color }}>{emoji}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' }}>{subj}</span>
                        </div>
                        <p style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.03em', color: barColor, marginBottom: 2 }}>{pct}%</p>
                        <p style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 10 }}>{s.correct} of {s.total} correct</p>
                        <div style={{ height: 3, background: 'var(--gray-100)', borderRadius: 2 }}>
                          <div style={{ height: '100%', width: `${pct}%`, borderRadius: 2, background: barColor, transition: 'width .7s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {weakTopics.length > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--gray-400)', marginBottom: 12 }}>Topics to focus on</p>
                <div style={{ border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                  {weakTopics.map((t, i) => {
                    const color = NEET_SUBJECT_META[t.subject as NeetSubject]?.color ?? 'var(--gray-600)';
                    const emoji = NEET_SUBJECT_META[t.subject as NeetSubject]?.emoji ?? '?';
                    const pctColor = t.pct < 40 ? 'var(--red-600)' : 'var(--amber-600)';
                    return (
                      <div key={t.key} style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '13px 18px',
                        borderBottom: i < weakTopics.length - 1 ? '1px solid var(--gray-100)' : 'none',
                        background: 'var(--white)',
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-300)', width: 18, flexShrink: 0 }}>#{i + 1}</span>
                        <span style={{ fontSize: 15, color, flexShrink: 0 }}>{emoji}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.topic}</p>
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
          </div>
        </div>
      </div>
    );
  }

  return null;
}
