'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { isAuthenticated, getUser } from '@/lib/auth';
import type { Question, AnswerResult, Subject, TopicProgress, PaperSet } from '@/types';
import type { SplitTopics } from '@/lib/api';
import type { AppState, WizardStep, MarkingScheme, StoredResult, TopicCustomConfig } from './shared';
import { getDefaultQuestionTypes, planTopicTypeSlots, createBalancedDifficulty, getTypeTotal, getTopicTotal, MAX_TOPIC_QUESTIONS } from './shared';
import type { PracticeExamConfig } from './examConfig';
import { SessionReview } from './SessionReview';
import { SubjectStep } from './SubjectStep';
import { TopicStep } from './TopicStep';
import { PaperStep } from './PaperStep';
import { SessionSettings } from './SessionSettings';
import { SessionSummary } from './SessionSummary';
import { ExamScreen } from './ExamScreen';
import Loader from '@/components/loader';

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
  const [selectedSubjects, setSelectedSubjects] = useState<Set<Subject>>(new Set());
  const [selectedTopics, setSelectedTopics] = useState<Partial<Record<Subject, Set<string>>>>({});
  const [questionCount, setQuestionCount] = useState<number | 'custom'>(10);
  const [customCount, setCustomCount] = useState('');
  const [examType, setExamType] = useState<'Main' | 'Advanced'>('Main');
  const [markingScheme, setMarkingScheme] = useState<MarkingScheme>('jee_main');
  const [topicConfigs, setTopicConfigs] = useState<Record<string, TopicCustomConfig>>({});
  const prevCountRef = useRef(10);
  const prevExamTypeRef = useRef<'Main' | 'Advanced'>('Main');

  const handleExamTypeChange = useCallback((newExamType: 'Main' | 'Advanced') => {
    setExamType(newExamType);
    setMarkingScheme(newExamType === 'Advanced' ? 'jee_advanced' : 'jee_main');
  }, []);

  const resolvedCount = useCallback((): number => {
    if (questionCount === 'custom') {
      const n = parseInt(customCount, 10);
      return isNaN(n) || n < 1 ? 5 : Math.min(n, config.maxPerSubject);
    }
    return questionCount;
  }, [questionCount, customCount, config.maxPerSubject]);

  const autoDistributeTopicsForSubject = useCallback((subject: Subject) => {
    const topics = Array.from(selectedTopics[subject] ?? new Set<string>());
    if (topics.length === 0) return;

    const perSubject = resolvedCount();
    const isAdv = !isNeet && examType === 'Advanced';
    const isNeetMode = isNeet;

    const k = topics.length;
    const baseQuota = Math.floor(perSubject / k);
    const remainder = perSubject % k;

    setTopicConfigs((prev) => {
      const next = { ...prev };
      topics.forEach((topic, idx) => {
        const topicCount = Math.min(MAX_TOPIC_QUESTIONS, baseQuota + (idx < remainder ? 1 : 0));
        const defTypes = getDefaultQuestionTypes(topicCount, examType, isNeet);
        const typeSlots = planTopicTypeSlots(topicCount, defTypes, isAdv, isNeetMode);

        const mcqCount = typeSlots.filter((t) => t === 'mcq_single').length;
        const integerCount = typeSlots.filter((t) => t === 'integer').length;
        const multiCount = typeSlots.filter((t) => t === 'mcq_multi').length;
        const matrixCount = typeSlots.filter((t) => t === 'matrix_match').length;

        const key = `${subject}::${topic}`;
        next[key] = {
          subject,
          topic,
          mcq: createBalancedDifficulty(mcqCount),
          integer: createBalancedDifficulty(integerCount),
          multi: createBalancedDifficulty(multiCount),
          matrix: createBalancedDifficulty(matrixCount),
        };
      });
      return next;
    });
  }, [selectedTopics, resolvedCount, isNeet, examType]);

  const autoDistributeAllTopics = useCallback(() => {
    const perSubject = resolvedCount();
    const isAdv = !isNeet && examType === 'Advanced';
    const isNeetMode = isNeet;

    setTopicConfigs((prev) => {
      const next = { ...prev };
      for (const subject of selectedSubjects) {
        const topics = Array.from(selectedTopics[subject] ?? new Set<string>());
        if (topics.length === 0) continue;
        const k = topics.length;
        const baseQuota = Math.floor(perSubject / k);
        const remainder = perSubject % k;

        topics.forEach((topic, idx) => {
          const topicCount = Math.min(MAX_TOPIC_QUESTIONS, baseQuota + (idx < remainder ? 1 : 0));
          const defTypes = getDefaultQuestionTypes(topicCount, examType, isNeet);
          const typeSlots = planTopicTypeSlots(topicCount, defTypes, isAdv, isNeetMode);

          const mcqCount = typeSlots.filter((t) => t === 'mcq_single').length;
          const integerCount = typeSlots.filter((t) => t === 'integer').length;
          const multiCount = typeSlots.filter((t) => t === 'mcq_multi').length;
          const matrixCount = typeSlots.filter((t) => t === 'matrix_match').length;

          const key = `${subject}::${topic}`;
          next[key] = {
            subject,
            topic,
            mcq: createBalancedDifficulty(mcqCount),
            integer: createBalancedDifficulty(integerCount),
            multi: createBalancedDifficulty(multiCount),
            matrix: createBalancedDifficulty(matrixCount),
          };
        });
      }
      return next;
    });
  }, [selectedSubjects, selectedTopics, resolvedCount, isNeet, examType]);

  useEffect(() => {
    if (wizardStep !== 3) return;
    const perSubject = resolvedCount();

    let missing = false;
    for (const subject of selectedSubjects) {
      for (const topic of selectedTopics[subject] ?? []) {
        const key = `${subject}::${topic}`;
        if (!topicConfigs[key]) {
          missing = true;
          break;
        }
      }
      if (missing) break;
    }

    if (missing || prevCountRef.current !== perSubject || prevExamTypeRef.current !== examType) {
      prevCountRef.current = perSubject;
      prevExamTypeRef.current = examType;
      autoDistributeAllTopics();
    }
  }, [wizardStep, selectedSubjects, selectedTopics, autoDistributeAllTopics, topicConfigs, resolvedCount, examType]);

  const areTopicConfigsValid = useMemo(() => {
    if (selectedSubjects.size === 0) return true;
    const perSubject = resolvedCount();

    for (const subject of selectedSubjects) {
      const topics = Array.from(selectedTopics[subject] ?? new Set<string>());
      if (topics.length === 0) continue;
      const subjectTotal = topics.reduce((sum, topic) => {
        const key = `${subject}::${topic}`;
        return sum + getTopicTotal(topicConfigs[key]);
      }, 0);
      if (subjectTotal !== perSubject) return false;
    }
    return true;
  }, [selectedSubjects, selectedTopics, topicConfigs, resolvedCount]);

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
      if (cur.has(topic)) cur.delete(topic);
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
      // Everything is picked — clear the subject completely
      setSelectedTopics((p) => ({ ...p, [subject]: new Set() }));
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
  function buildSelections(): Array<{
    subject: Subject;
    topic: string;
    count?: number;
    mcqCount?: number;
    integerCount?: number;
    multiCount?: number;
    matrixCount?: number;
    beginnerCount?: number;
    intermediateCount?: number;
    advancedCount?: number;
    mcqEasy?: number;
    mcqMedium?: number;
    mcqHard?: number;
    integerEasy?: number;
    integerMedium?: number;
    integerHard?: number;
    multiEasy?: number;
    multiMedium?: number;
    multiHard?: number;
    matrixEasy?: number;
    matrixMedium?: number;
    matrixHard?: number;
  }> {
    const out: Array<{
      subject: Subject;
      topic: string;
      count?: number;
      mcqCount?: number;
      integerCount?: number;
      multiCount?: number;
      matrixCount?: number;
      beginnerCount?: number;
      intermediateCount?: number;
      advancedCount?: number;
      mcqEasy?: number;
      mcqMedium?: number;
      mcqHard?: number;
      integerEasy?: number;
      integerMedium?: number;
      integerHard?: number;
      multiEasy?: number;
      multiMedium?: number;
      multiHard?: number;
      matrixEasy?: number;
      matrixMedium?: number;
      matrixHard?: number;
    }> = [];
    for (const subject of selectedSubjects) {
      for (const topic of (selectedTopics[subject] ?? new Set())) {
        const key = `${subject}::${topic}`;
        const cfg = topicConfigs[key];
        if (cfg) {
          const mcqTotal = getTypeTotal(cfg.mcq);
          const integerTotal = getTypeTotal(cfg.integer);
          const multiTotal = getTypeTotal(cfg.multi);
          const matrixTotal = getTypeTotal(cfg.matrix);
          const totalQ = mcqTotal + integerTotal + multiTotal + matrixTotal;

          const beginnerTotal = (cfg.mcq?.easy || 0) + (cfg.integer?.easy || 0) + (cfg.multi?.easy || 0) + (cfg.matrix?.easy || 0);
          const intermediateTotal = (cfg.mcq?.medium || 0) + (cfg.integer?.medium || 0) + (cfg.multi?.medium || 0) + (cfg.matrix?.medium || 0);
          const advancedTotal = (cfg.mcq?.hard || 0) + (cfg.integer?.hard || 0) + (cfg.multi?.hard || 0) + (cfg.matrix?.hard || 0);

          out.push({
            subject,
            topic,
            count: totalQ,
            mcqCount: mcqTotal,
            integerCount: integerTotal,
            multiCount: multiTotal,
            matrixCount: matrixTotal,
            beginnerCount: beginnerTotal,
            intermediateCount: intermediateTotal,
            advancedCount: advancedTotal,
            mcqEasy: cfg.mcq?.easy || 0,
            mcqMedium: cfg.mcq?.medium || 0,
            mcqHard: cfg.mcq?.hard || 0,
            integerEasy: cfg.integer?.easy || 0,
            integerMedium: cfg.integer?.medium || 0,
            integerHard: cfg.integer?.hard || 0,
            multiEasy: cfg.multi?.easy || 0,
            multiMedium: cfg.multi?.medium || 0,
            multiHard: cfg.multi?.hard || 0,
            matrixEasy: cfg.matrix?.easy || 0,
            matrixMedium: cfg.matrix?.medium || 0,
            matrixHard: cfg.matrix?.hard || 0,
          });
        } else {
          out.push({ subject, topic });
        }
      }
    }
    return out;
  }

  /* ─── Paper row: preview papers, then claim the chosen one (JEE) ── */
  async function loadPapers(page: number) {
    const perSubject = resolvedCount();

    if (!areTopicConfigsValid) {
      for (const subject of selectedSubjects) {
        const topics = Array.from(selectedTopics[subject] ?? new Set<string>());
        const subjectTotal = topics.reduce((sum, topic) => {
          const cfg = topicConfigs[`${subject}::${topic}`];
          return sum + getTopicTotal(cfg);
        }, 0);
        if (subjectTotal !== perSubject) {
          setLoadError(
            `Questions in ${subject} (${subjectTotal}) do not match the target of ${perSubject} questions per subject. Adjust counts or click Auto-match.`,
          );
          return;
        }
      }
    }

    setShowPapers(true);
    setPapersLoading(true);
    setPapersError('');
    try {
      const res = await api.questions.papers({
        selections: buildSelections(),
        difficulty: 'mixed',
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
    setLoadError('');
    try {
      const claimed = await api.questions.claimPapers(paper.questionIds);
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
    const perSubject = resolvedCount();

    if (!areTopicConfigsValid) {
      for (const subject of selectedSubjects) {
        const topics = Array.from(selectedTopics[subject] ?? new Set<string>());
        const subjectTotal = topics.reduce((sum, topic) => {
          const cfg = topicConfigs[`${subject}::${topic}`];
          return sum + getTopicTotal(cfg);
        }, 0);
        if (subjectTotal !== perSubject) {
          setLoadError(
            `Questions in ${subject} (${subjectTotal}) do not match the target of ${perSubject} questions per subject. Adjust counts or click Auto-match.`,
          );
          return;
        }
      }
      return;
    }

    enterFullscreen();
    setAppState('loading');
    setLoadMsgIdx(0);
    setLoadError('');

    const msgInterval = setInterval(() => {
      setLoadMsgIdx((i) => (i + 1) % config.loadMessages.length);
    }, 2800);

    try {
      const selections = buildSelections();
      const count = perSubject * selectedSubjects.size;

      const batch = await api.questions.batch({
        selections,
        difficulty: 'mixed',
        examType: isNeet ? 'NEET' : examType,
        studentClass: batchClass,
        count,
      });

      clearInterval(msgInterval);

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
      clearInterval(msgInterval);
      setLoadError(e instanceof Error ? e.message : 'Failed to generate questions');
      setAppState('wizard');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubjects, selectedTopics, questionCount, customCount, examType, batchClass, isNeet, config, areTopicConfigsValid, topicConfigs, resolvedCount]);

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
    <div className="pr-root app-wide">
      <style>{css}</style>
      {node}
    </div>
  );

  /* ═══════════════════════════════════════════════════════
     RENDER: Weak areas loading
  ═══════════════════════════════════════════════════════ */
  if (weakStartLoading) {
    return <Loader fullScreen size={180} text={config.weakLoadingText} />;
  }

  /* ═══════════════════════════════════════════════════════
     RENDER: Wizard
  ═══════════════════════════════════════════════════════ */
  if (appState === 'wizard') {
    const weakTopicCount = Array.from(selectedSubjects).reduce((acc, s) => acc + (selectedTopics[s]?.size ?? 0), 0);
    return themed(
      <div className="pr-page">
        {/* ── Header ── */}
        <header className="pr-hero">
          {/* the landing page's blob, anchored bottom-right */}
          <svg aria-hidden viewBox="0 0 900 700" preserveAspectRatio="xMaxYMax slice" className="pr-blob">
            <defs>
              <linearGradient id="pr-hero-blob" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#803688" stopOpacity="0.20" />
                <stop offset="0.5" stopColor="#803688" stopOpacity="0.12" />
                <stop offset="1" stopColor="#B98CBE" stopOpacity="0.18" />
              </linearGradient>
            </defs>
            <path
              d="M1000 700 L1000 150 C946 92 862 62 772 78 C668 97 596 172 528 246 C462 318 396 378 310 414 C214 455 132 508 84 578 C52 626 30 668 24 700 Z"
              fill="url(#pr-hero-blob)"
            />
          </svg>
          {loadError && (
            <div className="pr-top">
              <span className="pr-toperr" role="alert">{loadError}</span>
            </div>
          )}

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

        <div className={`pr-body${wizardStep === 1 ? ' pr-body-top' : ''}`}>
          <div className="pr-inner">
            {weakMode && (
              <div className="pr-weak">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5A2560" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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

            {loadError && (
              <div
                className="badge badge-red"
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <span>⚠️ {loadError}</span>
                <button
                  type="button"
                  onClick={() => setLoadError('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 16,
                    cursor: 'pointer',
                    color: 'var(--red-600)',
                    lineHeight: 1,
                  }}
                >
                  ✕
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
                onBack={() => setShowPapers(false)}
              />
            )}

            {wizardStep === 3 && !showPapers && (
              <SessionSettings
                config={config}
                questionCount={questionCount}
                onQuestionCount={setQuestionCount}
                customCount={customCount}
                onCustomCount={setCustomCount}
                examType={examType}
                onExamType={handleExamTypeChange}
                markingScheme={markingScheme}
                onMarkingScheme={setMarkingScheme}
                perSubjectCount={resolvedCount()}
                selectedSubjects={selectedSubjects}
                selectedTopics={selectedTopics}
                topicConfigs={topicConfigs}
                onTopicConfigs={setTopicConfigs}
                onAutoDistributeSubject={autoDistributeTopicsForSubject}
                onAutoDistributeAll={autoDistributeAllTopics}
              />
            )}
          </div>
        </div>

        {/* Action bar */}
        <div className="pr-nav">
          <div className="pr-nav-in">
            {wizardStep < 3 ? (
              <button
                type="button"
                className="btn btn-primary btn-lg"
                disabled={!canAdvanceStep()}
                onClick={() => setWizardStep((s) => (s + 1) as WizardStep)}
              >
                Continue
              </button>
            ) : showPapers ? null : (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {(() => {
                  const perSubject = resolvedCount();
                  const canStartSession = areTopicConfigsValid;

                  return (
                    <>
                      {!canStartSession && (
                        <span
                          style={{
                            fontSize: 12,
                            color: 'var(--red-600)',
                            fontWeight: 600,
                            background: 'var(--red-50)',
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid var(--red-100)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          ⚠️ Topic questions must match target ({perSubject}/subject). Click Auto-match.
                        </span>
                      )}
                      {config.hasPapers && perSubject <= 30 && (
                        <button
                          type="button"
                          className="btn btn-ghost btn-lg"
                          disabled={!canStartSession}
                          onClick={() => {
                            if (!canStartSession) return;
                            loadPapers(1);
                          }}
                        >
                          Browse pre-made papers
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-primary btn-lg"
                        disabled={!canStartSession}
                        onClick={(e) => {
                          if (!canStartSession) {
                            e.preventDefault();
                            setLoadError('Topic questions must match target for each subject. Click Auto-match to balance.');
                            return;
                          }
                          startExam();
                        }}
                        style={!canStartSession ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                      >
                        Start practice ({perSubject * selectedSubjects.size} Qs)
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </button>
                    </>
                  );
                })()}
              </div>
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
    const msg = config.loadMessages[loadMsgIdx] ?? '';
    return <Loader fullScreen size={180} text={`${config.loadingTitle} — ${msg}`} />;
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
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=DM+Sans:wght@400;500;600;700;800&display=swap');

.pr-root{
  --brand:#003366; --brand-d:#00284F; --brand-l:#2A4FD6;
  --accent:#803688; --accent-d:#5A2560; --accent-2:#A24BA8;
  --grad:linear-gradient(135deg,#803688 0%,#A24BA8 100%);
  --ice:#EEF2FF; --soft:#C6D2F8; --ink:#003366; --body:#31407F; --mute:#5A6B8C;

  /* Remap the app's own tokens so the imported step screens pick up the palette */
  --gray-50:#F8FAFF; --gray-100:#EEF2FF; --gray-200:#D7DFFA; --gray-300:#C6D2F8; --gray-400:#97A3D4;
  --gray-500:#5A6B8C; --gray-600:#4A5A78; --gray-700:#31407F; --gray-800:#1B2866; --gray-900:#003366;
  --navy-50:#EEF2FF; --navy-100:#D7DFFA; --navy-600:#003366; --navy-800:#003366; --red-600:#C8202F;

  font-family:'DM Sans',system-ui,sans-serif; color:var(--body);
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
.pr-root .btn-primary{background:var(--grad);color:#fff;box-shadow:0 6px 0 var(--accent-d)}
.pr-root .btn-primary:hover:not(:disabled){background:var(--grad);transform:translateY(-3px);box-shadow:0 9px 0 var(--accent-d)}
.pr-root .btn-primary:active:not(:disabled){transform:translateY(4px);box-shadow:0 2px 0 var(--accent-d)}
.pr-root .btn-outline{background:#fff;color:var(--brand);border:2.5px solid var(--brand);box-shadow:0 4px 0 var(--soft)}
.pr-root .btn-outline:hover:not(:disabled){background:#fff;transform:translateY(-2px);box-shadow:0 6px 0 var(--soft)}
.pr-root .btn-ghost{background:transparent;color:var(--brand);box-shadow:none}
.pr-root .btn-ghost:hover:not(:disabled){background:var(--ice)}
.pr-root .btn:disabled{opacity:.55;cursor:not-allowed;transform:none}
.pr-root .btn:focus-visible{outline:3px solid var(--accent);outline-offset:2px}

/* Page — white, with the edges faded into the app canvas so the sheet has no hard border */
.pr-page{
  min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;position:relative;background:transparent;
}
.pr-page::before{
  content:"";position:absolute;inset:0;z-index:0;background:#fff;
  -webkit-mask-image:linear-gradient(to right,transparent 0,#000 48px,#000 calc(100% - 48px),transparent 100%),
                    linear-gradient(to bottom,transparent 0,#000 40px,#000 calc(100% - 40px),transparent 100%);
  -webkit-mask-composite:source-in;
  mask-image:linear-gradient(to right,transparent 0,#000 48px,#000 calc(100% - 48px),transparent 100%),
              linear-gradient(to bottom,transparent 0,#000 40px,#000 calc(100% - 40px),transparent 100%);
  mask-composite:intersect;
}
.pr-page > *{position:relative;z-index:1}

/* Header */
.pr-hero{
  position:relative;overflow:hidden;color:var(--ink);padding:30px clamp(18px,5vw,64px) 36px;
  background:transparent;border-bottom:none;
}
.pr-blob{
  position:absolute;bottom:-14%;right:0;height:112%;width:min(46%,520px);pointer-events:none;
  -webkit-mask-image:linear-gradient(to right,#000 40%,transparent 100%);
  mask-image:linear-gradient(to right,#000 40%,transparent 100%);
}
.pr-top{position:relative;z-index:2;display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:22px}
.pr-toperr{margin-left:auto;background:#FEF2F2;color:#B42318;border:1px solid #F4C7C7;font-weight:800;font-size:13px;padding:7px 14px;border-radius:999px;max-width:100%;overflow-wrap:anywhere}
.pr-hero-body{position:relative;z-index:2;max-width:760px}
.pr-eyebrow{margin:0 0 10px;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent-d)}
.pr-hero h1{margin:0;font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:clamp(32px,5vw,56px);line-height:1.04;letter-spacing:-.02em;color:var(--brand)}
.pr-scribble{position:relative;display:inline-block}
.pr-scribble svg{position:absolute;left:0;bottom:-10px;width:100%;height:14px}
.pr-scribble path{fill:none;stroke:var(--accent);stroke-width:5;stroke-linecap:round}
.pr-sub{margin:20px 0 0;max-width:560px;font-size:clamp(14px,1.5vw,16px);line-height:1.65;color:var(--body)}
.pr-stats{display:flex;gap:16px;flex-wrap:wrap;margin-top:22px}
.pr-stat{background:#fff;color:var(--ink);border:1px solid rgba(0,51,102,.1);border-radius:16px;padding:12px 18px;box-shadow:0 10px 24px -18px rgba(0,51,102,.5)}
.pr-stat:nth-child(2){background:#FDBA74;border-color:rgba(0,51,102,.08)}
.pr-stat strong{display:block;font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:26px;line-height:1.1;color:var(--brand)}
.pr-stat span{font-size:12px;font-weight:700;color:var(--mute)}

/* Body */
.pr-body{flex:1;padding:30px clamp(16px,4vw,48px) 36px}
/* On the first step the content is short, so the action bar tucks up under it
   instead of being pushed to the bottom of the viewport. */
.pr-body-top{flex:0 0 auto}
.pr-inner{max-width:1240px;margin:0 auto}

/* Step bar */
.pr-steps{list-style:none;margin:0 0 28px;padding:0;display:flex;align-items:center}
.pr-step-wrap{display:flex;align-items:center;flex:0 0 auto}
.pr-step-wrap:not(:last-child){flex:1 1 auto}
.pr-step{display:flex;align-items:center;gap:10px;font-weight:800;font-size:14px;color:var(--mute);white-space:nowrap}
.pr-step i{
  width:38px;height:38px;border-radius:50%;display:grid;place-items:center;font-style:normal;
  font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:16px;background:#fff;color:var(--brand);
  border:3px solid var(--brand);box-shadow:0 3px 0 var(--soft);
}
.pr-step.cur{color:var(--brand)}
.pr-step.cur i{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 3px 0 var(--accent-d)}
.pr-step.done i{background:var(--brand);color:#fff;box-shadow:0 3px 0 var(--brand-d)}
.pr-step-line{flex:1 1 24px;min-width:16px;margin:0 12px;border-top:3px dashed rgba(0,51,102,.18)}
.pr-step-line.done{border-color:var(--brand)}

/* Weak-mode sticky note */
.pr-weak{
  display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:26px;padding:14px 18px;background:#FDBA74;border:1px solid rgba(0,51,102,.08);border-radius:16px;
  box-shadow:0 10px 20px -14px rgba(0,51,102,.45);
}
.pr-weak svg{flex:none}
.pr-weak div{min-width:0}
.pr-weak strong{display:block;font-size:14px;color:var(--brand)}
.pr-weak span{display:block;margin-top:2px;font-size:12.5px;font-weight:600;color:var(--body);line-height:1.45}
.pr-weak .btn{margin-left:auto}

/* Action bar */
/* Action bar — flows after the content, not pinned to the viewport */
.pr-nav{position:static;background:#fff;border-top:none;padding:8px clamp(16px,4vw,48px) max(22px,env(safe-area-inset-bottom))}
.pr-nav-in{max-width:1240px;margin:0 auto;display:flex;align-items:center;justify-content:flex-end;gap:12px}

/* ═════════ RESPONSIVE ═════════ */
@media(max-width:720px){
  .pr-body{padding-top:24px}
  .pr-stat strong{font-size:22px}
  .pr-weak .btn{margin-left:0;width:100%}
  .pr-step{font-size:13px}
  .pr-step-line{margin:0 8px}
}
@media(max-width:560px){
  .pr-hero{padding-top:max(18px,env(safe-area-inset-top));padding-bottom:28px}
  .pr-top{margin-bottom:18px}
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
  .pr-nav-in{gap:8px}
}
@media(max-height:480px) and (orientation:landscape){
  .pr-sub,.pr-stats{display:none}
}
@media(hover:none){
  .pr-root .btn-primary:hover:not(:disabled){transform:none;box-shadow:0 6px 0 var(--accent-d)}
  .pr-root .btn-outline:hover:not(:disabled){transform:none;box-shadow:0 4px 0 var(--soft)}
}
@media(prefers-reduced-motion:reduce){
  .pr-root *{animation:none!important;transition:none!important}
}
`;
