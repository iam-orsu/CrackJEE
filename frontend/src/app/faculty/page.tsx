'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Landmark, Target } from 'lucide-react';
import {
  facultyCreatePaper,
  facultyDeletePaper,
  facultyDownloadPdf,
  facultyGetPaper,
  facultyGetTopics,
  facultyListPapers,
  facultyLogout,
  facultyMe,
  FacultyError,
  type FacultyExamType,
  type FacultyPaper,
  type FacultyPaperSelection,
  type FacultyPaperSummary,
  type FacultyQuestionTypePref,
  type FacultyUser,
} from '@/lib/faculty';
import { FacultyPaperPreview } from '@/components/faculty/FacultyPaperPreview';
import { FacultyBatchesTab } from '@/components/faculty/FacultyBatchesTab';
import { FacultyAssignmentsTab } from '@/components/faculty/FacultyAssignmentsTab';
import { FacultyReportsTab } from '@/components/faculty/FacultyReportsTab';
import { FacultySidebar, type PortalTab } from '@/components/faculty/FacultySidebar';
import type { Subject } from '@/types';
import { TopicBreakdownConfig } from '@/components/practice/TopicBreakdownConfig';
import type { TopicCustomConfig } from '@/components/practice/shared';
import {
  getTopicTotal,
  createBalancedDifficulty,
  getDefaultQuestionTypes,
  planTopicTypeSlots,
  MAX_TOPIC_QUESTIONS,
} from '@/components/practice/shared';

const COUNT_PRESETS: Record<FacultyExamType, Array<{ count: number; label: string }>> = {
  Main: [
    { count: 15, label: '15 (Quiz)' },
    { count: 30, label: '30 (Half)' },
    { count: 75, label: '75 (NTA Full)' },
    { count: 90, label: '90 (Classic)' },
  ],
  Advanced: [
    { count: 18, label: '18 (Quiz)' },
    { count: 36, label: '36 (2x)' },
    { count: 54, label: '54 (Paper)' },
  ],
  NEET: [
    { count: 20, label: '20 (Quiz)' },
    { count: 45, label: '45 (1 Subj)' },
    { count: 90, label: '90 (Half)' },
    { count: 180, label: '180 (NTA Full)' },
  ],
  Psychometric: [
    { count: 16, label: '16 (Diagnostic)' },
    { count: 24, label: '24 (Standard)' },
    { count: 32, label: '32 (Comprehensive)' },
    { count: 48, label: '48 (In-Depth)' },
  ],
};

const DEFAULT_COUNT: Record<FacultyExamType, number> = {
  Main: 75,
  Advanced: 54,
  NEET: 180,
  Psychometric: 24,
};

const PSYCHOMETRIC_DOMAINS = [
  'Cognitive Ability Tests',
  'Personality Tests',
  'Situational Judgment Tests (SJT)',
  'Emotional Intelligence (EI) Tests',
  'Motivation and Work-Values Tests',
  'Behavioral and Work-Style Assessments',
  'Career Interest Tests',
  'Integrity and Risk-Related Assessments',
];

const PSYCHOMETRIC_DOMAIN_META: Record<string, { badge: string; desc: string }> = {
  'Cognitive Ability Tests': {
    badge: 'Analytical',
    desc: 'Numerical, verbal, logical, abstract reasoning, and critical problem solving.',
  },
  'Personality Tests': {
    badge: 'Behavioral',
    desc: 'Big Five / OCEAN, HEXACO, DISC, introversion/extraversion, and emotional stability.',
  },
  'Situational Judgment Tests (SJT)': {
    badge: 'Real Situations',
    desc: 'Real-world dilemmas, stakeholder management, conflict resolution, and trade-offs.',
  },
  'Emotional Intelligence (EI) Tests': {
    badge: 'People Skills',
    desc: 'Self-awareness, emotional regulation under pressure, empathy, and social leadership.',
  },
  'Motivation and Work-Values Tests': {
    badge: 'Drivers & Purpose',
    desc: 'Autonomy, ambition, achievement, and organizational work values.',
  },
  'Behavioral and Work-Style Assessments': {
    badge: 'Execution Style',
    desc: 'Planning, adaptability, attention to detail, execution velocity, and teamwork.',
  },
  'Career Interest Tests': {
    badge: 'Career Matching',
    desc: 'Holland RIASEC code alignment across technology, business, and creative paths.',
  },
  'Integrity and Risk-Related Assessments': {
    badge: 'Ethics & Trust',
    desc: 'Ethical decision-making, accountability, risk judgment, and compliance.',
  },
};

type ClassValue = string | false | null | undefined;
const cx = (...parts: ClassValue[]) => parts.filter(Boolean).join(' ');

/* The studio repeats a handful of surfaces and controls, so their classes live
   here and every instance stays identical. */
const PANEL = 'rounded-[28px] border border-[#003366]/10 bg-white p-5 shadow-[0_24px_56px_-36px_rgba(0,51,102,.45)] sm:p-6';
const PANEL_TITLE = 'mb-3.5 flex flex-wrap items-center justify-between gap-2.5 font-display text-[17px] font-extrabold text-[#003366]';
const FIELD = 'mb-3.5 flex flex-col gap-1.5';
const LABEL = 'text-[12.5px] font-extrabold text-[#003366]';
const INPUT = 'h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none';
const SELECT = 'h-[46px] w-full cursor-pointer rounded-xl border-[2.5px] border-[#003366] bg-white px-3 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none';
const BTN_PRIMARY = 'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#5A2560] bg-grad px-4 py-2 text-[13px] font-extrabold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[3px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none';
const BTN_SECONDARY = 'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none';
const BTN_ACCENT = 'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-accent bg-white px-3 py-1.5 text-[12.5px] font-extrabold text-accent no-underline shadow-[0_4px_0_#E2C2F0] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#E2C2F0] active:translate-y-[3px] active:shadow-[0_1px_0_#E2C2F0] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none';
const BTN_DANGER = 'cursor-pointer rounded-xl border border-[#C8202F]/30 bg-white px-2.5 py-1.5 text-[12px] font-bold text-[#C8202F] transition-colors duration-150 hover:bg-[#FDF3F4] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none';
const MICRO_BTN = 'cursor-pointer rounded-xl border-[2px] border-[#003366]/20 px-2.5 py-1 text-[11.5px] font-bold transition-colors duration-150 motion-reduce:transition-none';
const MICRO_ON = 'border-transparent bg-grad text-white';
const MICRO_OFF = 'bg-white text-[#003366] hover:bg-ice';

export default function FacultyPage() {
  const router = useRouter();
  const [faculty, setFaculty] = useState<FacultyUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<PortalTab>('papers');
  const [selectedReportAssignmentId, setSelectedReportAssignmentId] = useState<string | null>(null);

  // Builder state (JEE Main defaults to 75 per NTA 2025-2026 pattern)
  const [builderOpen, setBuilderOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [examType, setExamType] = useState<FacultyExamType>('Main');
  const [questionCount, setQuestionCount] = useState(75);
  const [questionCountStr, setQuestionCountStr] = useState('75');
  const [questionType, setQuestionType] = useState<FacultyQuestionTypePref>('auto');
  const [topicConfigs, setTopicConfigs] = useState<Record<string, TopicCustomConfig>>({});
  const [examGoal, setExamGoal] = useState('');
  const [selectedPsychometricDomains, setSelectedPsychometricDomains] = useState<string[]>(PSYCHOMETRIC_DOMAINS);

  const selectedSubjects = useMemo(() => {
    const set = new Set<Subject>();
    for (const cfg of Object.values(topicConfigs)) {
      set.add(cfg.subject);
    }
    return set;
  }, [topicConfigs]);

  const selectedTopics = useMemo(() => {
    const map: Partial<Record<Subject, Set<string>>> = {};
    for (const cfg of Object.values(topicConfigs)) {
      if (!map[cfg.subject]) map[cfg.subject] = new Set();
      map[cfg.subject]!.add(cfg.topic);
    }
    return map;
  }, [topicConfigs]);

  const selectedTopicsCount = useMemo(() => {
    return Object.keys(topicConfigs).length;
  }, [topicConfigs]);

  const activeSubjectCount = selectedSubjects.size || 1;
  const perSubjectTarget = Math.max(1, Math.round(questionCount / activeSubjectCount));

  const totalCalculatedCount = useMemo(() => {
    return Object.values(topicConfigs).reduce((sum, cfg) => sum + getTopicTotal(cfg), 0);
  }, [topicConfigs]);

  const [subjects, setSubjects] = useState<string[]>(['Physics', 'Chemistry', 'Mathematics']);
  const [topicsBySubject, setTopicsBySubject] = useState<Record<string, string[]>>({});
  const [activeSubject, setActiveSubject] = useState('Physics');
  const [topicSearch, setTopicSearch] = useState('');

  // Stacked Paper Library & Opened Paper Workspace
  const [papers, setPapers] = useState<FacultyPaperSummary[]>([]);
  const [activePaper, setActivePaper] = useState<FacultyPaper | null>(null);
  const [activePaperTopics, setActivePaperTopics] = useState<Record<string, string[]>>({});
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [downloadingPdf, setDownloadingPdf] = useState<{ id: string; mode: string } | null>(null);

  async function handleDownloadPdf(paperId: string, mode: 'questions' | 'solutions' | 'key') {
    setDownloadingPdf({ id: paperId, mode });
    try {
      await facultyDownloadPdf(paperId, mode);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to download PDF');
    } finally {
      setDownloadingPdf(null);
    }
  }

  const loadWorkspace = useCallback(async (currentExam: FacultyExamType) => {
    const [topicsRes, papersRes] = await Promise.all([
      facultyGetTopics(currentExam),
      facultyListPapers(),
    ]);
    setSubjects(topicsRes.subjects);
    setTopicsBySubject(topicsRes.topics);
    setActiveSubject((prev) => (topicsRes.subjects.includes(prev) ? prev : (topicsRes.subjects[0] ?? 'Physics')));
    setPapers(papersRes.papers);
    setBuilderOpen(papersRes.papers.length === 0);
  }, []);

  useEffect(() => {
    let active = true;
    facultyMe()
      .then((res) => {
        if (!active) return;
        setFaculty(res.faculty);
        return loadWorkspace('Main');
      })
      .catch(() => {
        if (active) setFaculty(null);
      })
      .finally(() => {
        if (active) setAuthChecked(true);
      });
    return () => { active = false; };
  }, [loadWorkspace]);

  // The login screen lives on its own route, so an unauthenticated visit — after
  // the check has run — moves there instead of rendering a form inside the studio.
  useEffect(() => {
    if (authChecked && !faculty) router.replace('/faculty/login');
  }, [authChecked, faculty, router]);

  async function handleExamTypeChange(nextExam: FacultyExamType) {
    setExamType(nextExam);
    setTopicSearch('');
    const defaultCnt = DEFAULT_COUNT[nextExam] || 24;
    setQuestionCount(defaultCnt);
    setQuestionCountStr(String(defaultCnt));
    if (nextExam === 'Advanced') {
      setQuestionType('auto');
    } else if (nextExam === 'NEET') {
      setQuestionType('mcq_single');
    } else {
      setQuestionType('auto');
    }

    if (nextExam === 'Psychometric') {
      setSubjects(['Psychometric']);
      setTopicsBySubject({ Psychometric: PSYCHOMETRIC_DOMAINS });
      setActiveSubject('Psychometric');
      setTopicConfigs({});
      return;
    }

    try {
      const res = await facultyGetTopics(nextExam);
      setSubjects(res.subjects);
      setTopicsBySubject(res.topics);
      setActiveSubject(res.subjects[0] ?? 'Physics');
      setTopicConfigs((prev) => {
        const next: Record<string, TopicCustomConfig> = {};
        for (const [key, cfg] of Object.entries(prev)) {
          if (res.topics[cfg.subject]?.includes(cfg.topic)) {
            next[key] = cfg;
          }
        }
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load topics');
    }
  }

  // Poll active generating paper every 2.5s
  useEffect(() => {
    if (!faculty || !activePaper || activePaper.status !== 'generating') return;
    const paperId = activePaper.id;
    const timer = setInterval(async () => {
      try {
        const res = await facultyGetPaper(paperId);
        setActivePaper(res.paper);
        if (res.paper.status !== 'generating') {
          const listRes = await facultyListPapers();
          setPapers(listRes.papers);
        }
      } catch (err) {
        if (err instanceof FacultyError && err.status === 401) {
          setFaculty(null);
        }
      }
    }, 2500);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faculty, activePaper?.id, activePaper?.status]);

  const visibleTopics = useMemo(() => {
    const all = topicsBySubject[activeSubject] ?? [];
    const q = topicSearch.trim().toLowerCase();
    return q ? all.filter((t) => t.toLowerCase().includes(q)) : all;
  }, [topicsBySubject, activeSubject, topicSearch]);

  function toggleSelection(subject: Subject, topic: string) {
    const key = `${subject}::${topic}`;
    setTopicConfigs((prev) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        const isAdv = examType === 'Advanced';
        const isNeet = examType === 'NEET';
        const nextSubjCount = (selectedTopics[subject]?.size || 0) + 1;
        const targetForThisTopic = Math.min(
          MAX_TOPIC_QUESTIONS,
          Math.max(1, Math.round(perSubjectTarget / nextSubjCount)),
        );

        const defTypes = getDefaultQuestionTypes(targetForThisTopic, isAdv ? 'Advanced' : 'Main', isNeet);
        const typeSlots = planTopicTypeSlots(targetForThisTopic, defTypes, isAdv, isNeet);

        const mcqCount = typeSlots.filter((t) => t === 'mcq_single').length;
        const integerCount = typeSlots.filter((t) => t === 'integer').length;
        const multiCount = typeSlots.filter((t) => t === 'mcq_multi').length;
        const matrixCount = typeSlots.filter((t) => t === 'matrix_match').length;

        next[key] = {
          subject,
          topic,
          mcq: createBalancedDifficulty(mcqCount),
          integer: createBalancedDifficulty(integerCount),
          multi: createBalancedDifficulty(multiCount),
          matrix: createBalancedDifficulty(matrixCount),
        };
      }
      return next;
    });
  }

  const autoDistributeTopicsForSubject = useCallback(
    (subj: Subject) => {
      const topics = Array.from(selectedTopics[subj] ?? new Set<string>());
      if (topics.length === 0) return;

      const perSubject = perSubjectTarget;
      const isAdv = examType === 'Advanced';
      const isNeet = examType === 'NEET';

      const k = topics.length;
      const baseQuota = Math.floor(perSubject / k);
      const remainder = perSubject % k;

      setTopicConfigs((prev) => {
        const next = { ...prev };
        topics.forEach((topic, idx) => {
          const topicCount = Math.min(MAX_TOPIC_QUESTIONS, baseQuota + (idx < remainder ? 1 : 0));
          const defTypes = getDefaultQuestionTypes(topicCount, isAdv ? 'Advanced' : 'Main', isNeet);
          const typeSlots = planTopicTypeSlots(topicCount, defTypes, isAdv, isNeet);

          const mcqCount = typeSlots.filter((t) => t === 'mcq_single').length;
          const integerCount = typeSlots.filter((t) => t === 'integer').length;
          const multiCount = typeSlots.filter((t) => t === 'mcq_multi').length;
          const matrixCount = typeSlots.filter((t) => t === 'matrix_match').length;

          const key = `${subj}::${topic}`;
          next[key] = {
            subject: subj,
            topic,
            mcq: createBalancedDifficulty(mcqCount),
            integer: createBalancedDifficulty(integerCount),
            multi: createBalancedDifficulty(multiCount),
            matrix: createBalancedDifficulty(matrixCount),
          };
        });
        return next;
      });
    },
    [selectedTopics, perSubjectTarget, examType],
  );

  const autoDistributeAllTopics = useCallback(() => {
    const perSubject = perSubjectTarget;
    const isAdv = examType === 'Advanced';
    const isNeet = examType === 'NEET';

    setTopicConfigs((prev) => {
      const next = { ...prev };
      for (const subj of selectedSubjects) {
        const topics = Array.from(selectedTopics[subj] ?? new Set<string>());
        if (topics.length === 0) continue;
        const k = topics.length;
        const baseQuota = Math.floor(perSubject / k);
        const remainder = perSubject % k;

        topics.forEach((topic, idx) => {
          const topicCount = Math.min(MAX_TOPIC_QUESTIONS, baseQuota + (idx < remainder ? 1 : 0));
          const defTypes = getDefaultQuestionTypes(topicCount, isAdv ? 'Advanced' : 'Main', isNeet);
          const typeSlots = planTopicTypeSlots(topicCount, defTypes, isAdv, isNeet);

          const mcqCount = typeSlots.filter((t) => t === 'mcq_single').length;
          const integerCount = typeSlots.filter((t) => t === 'integer').length;
          const multiCount = typeSlots.filter((t) => t === 'mcq_multi').length;
          const matrixCount = typeSlots.filter((t) => t === 'matrix_match').length;

          const key = `${subj}::${topic}`;
          next[key] = {
            subject: subj,
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
  }, [perSubjectTarget, examType, selectedSubjects, selectedTopics]);

  function applyPresetAcrossTopics(total: number) {
    setQuestionCount(total);
    setQuestionCountStr(String(total));
    const entries = Object.entries(topicConfigs);
    if (entries.length === 0) return;

    const isAdv = examType === 'Advanced';
    const isNeet = examType === 'NEET';
    const n = entries.length;
    const baseQuota = Math.floor(total / n);
    const remainder = total % n;

    setTopicConfigs((prev) => {
      const next = { ...prev };
      entries.forEach(([key, cfg], idx) => {
        const topicTotal = Math.min(MAX_TOPIC_QUESTIONS, baseQuota + (idx < remainder ? 1 : 0));
        const defTypes = getDefaultQuestionTypes(topicTotal, isAdv ? 'Advanced' : 'Main', isNeet);
        const typeSlots = planTopicTypeSlots(topicTotal, defTypes, isAdv, isNeet);

        const mcqCount = typeSlots.filter((t) => t === 'mcq_single').length;
        const integerCount = typeSlots.filter((t) => t === 'integer').length;
        const multiCount = typeSlots.filter((t) => t === 'mcq_multi').length;
        const matrixCount = typeSlots.filter((t) => t === 'matrix_match').length;

        next[key] = {
          ...cfg,
          mcq: createBalancedDifficulty(mcqCount),
          integer: createBalancedDifficulty(integerCount),
          multi: createBalancedDifficulty(multiCount),
          matrix: createBalancedDifficulty(matrixCount),
        };
      });
      return next;
    });
  }

  function applyPresetToAll(mcq: number, intCount: number, multi = 0, matrix = 0) {
    setTopicConfigs((prev) => {
      const next = { ...prev };
      for (const [key, cfg] of Object.entries(next)) {
        next[key] = {
          ...cfg,
          mcq: createBalancedDifficulty(mcq),
          integer: createBalancedDifficulty(examType === 'NEET' ? 0 : intCount),
          multi: createBalancedDifficulty(examType === 'Advanced' ? multi : 0),
          matrix: createBalancedDifficulty(matrix),
        };
      }
      return next;
    });
  }

  async function handleOpenPaper(id: string) {
    setError('');
    try {
      const res = await facultyGetPaper(id);
      const topicsRes = await facultyGetTopics(res.paper.examType);
      setActivePaperTopics(topicsRes.topics);
      setActivePaper(res.paper);
      setBuilderOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open paper');
    }
  }

  async function handleCreatePaper(e: React.FormEvent) {
    e.preventDefault();
    const parsedCount = parseInt(questionCountStr, 10);
    const activeCount = !isNaN(parsedCount) && parsedCount >= 1 && parsedCount <= 180 ? parsedCount : questionCount;
    if (activeCount !== questionCount) {
      setQuestionCount(activeCount);
    }

    if (examType === 'Psychometric') {
      const activeDomains = selectedPsychometricDomains.length > 0
        ? selectedPsychometricDomains
        : PSYCHOMETRIC_DOMAINS;

      const selections: FacultyPaperSelection[] = activeDomains.map((domain) => ({
        subject: 'Psychometric' as Subject,
        topic: domain,
        mcqCount: Math.max(1, Math.floor(activeCount / activeDomains.length)),
      }));

      setCreating(true);
      setError('');
      try {
        const res = await facultyCreatePaper({
          title: title.trim() || undefined,
          organization: organization.trim() || undefined,
          examType: 'Psychometric',
          examGoal: examGoal.trim() || undefined,
          difficulty: 'intermediate',
          questionCount: activeCount,
          questionType: 'mcq_single',
          selections,
        });
        const listRes = await facultyListPapers();
        setPapers(listRes.papers);
        setActivePaperTopics({ Psychometric: PSYCHOMETRIC_DOMAINS });
        setActivePaper(res.paper);
        setBuilderOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not create psychometric assessment paper');
      } finally {
        setCreating(false);
      }
      return;
    }

    const selections: FacultyPaperSelection[] = [];
    for (const cfg of Object.values(topicConfigs)) {
      const total = getTopicTotal(cfg);
      if (total <= 0) continue;

      const mcqEasy = cfg.mcq?.easy || 0;
      const mcqMed = cfg.mcq?.medium || 0;
      const mcqHard = cfg.mcq?.hard || 0;
      const mcqCount = mcqEasy + mcqMed + mcqHard;

      const integerEasy = cfg.integer?.easy || 0;
      const integerMed = cfg.integer?.medium || 0;
      const integerHard = cfg.integer?.hard || 0;
      const integerCount = integerEasy + integerMed + integerHard;

      const multiEasy = cfg.multi?.easy || 0;
      const multiMed = cfg.multi?.medium || 0;
      const multiHard = cfg.multi?.hard || 0;
      const multiCount = multiEasy + multiMed + multiHard;

      const matrixEasy = cfg.matrix?.easy || 0;
      const matrixMed = cfg.matrix?.medium || 0;
      const matrixHard = cfg.matrix?.hard || 0;
      const matrixCount = matrixEasy + matrixMed + matrixHard;

      selections.push({
        subject: cfg.subject,
        topic: cfg.topic,
        mcqCount,
        integerCount,
        multiCount,
        matrixCount,
        mcqEasy,
        mcqMedium: mcqMed,
        mcqHard,
        integerEasy,
        integerMedium: integerMed,
        integerHard,
        multiEasy,
        multiMedium: multiMed,
        multiHard,
        matrixEasy,
        matrixMedium: matrixMed,
        matrixHard,
      });
    }

    if (selections.length === 0) {
      setError('Select at least one subject & topic before generating.');
      return;
    }
    if (totalCalculatedCount === 0) {
      setError('Please configure at least 1 question across your selected topics.');
      return;
    }
    if (totalCalculatedCount > 180) {
      setError('Total paper question count cannot exceed 180 questions.');
      return;
    }
    if (totalCalculatedCount !== questionCount) {
      setError(
        totalCalculatedCount > questionCount
          ? `Total questions configured in topics (${totalCalculatedCount}) exceeds Question Count (${questionCount}). Please reduce ${totalCalculatedCount - questionCount} question(s) from topics or click "Auto-match".`
          : `Total questions configured in topics (${totalCalculatedCount}) does not match target Question Count (${questionCount}). Please add ${questionCount - totalCalculatedCount} more question(s) or click "Auto-match".`
      );
      return;
    }

    setCreating(true);
    setError('');
    try {
      const res = await facultyCreatePaper({
        title: title.trim() || undefined,
        organization: organization.trim() || undefined,
        examType,
        difficulty: examType === 'Advanced' ? 'advanced' : 'mixed',
        questionCount,
        questionType: 'auto',
        selections,
      });
      const listRes = await facultyListPapers();
      setPapers(listRes.papers);
      setActivePaperTopics(topicsBySubject);
      setActivePaper(res.paper);
      setBuilderOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start paper generation');
    } finally {
      setCreating(false);
    }
  }

  async function handleDeletePaper(id: string) {
    setError('');
    try {
      await facultyDeletePaper(id);
      const listRes = await facultyListPapers();
      setPapers(listRes.papers);
      if (activePaper?.id === id) {
        setActivePaper(null);
      }
      if (listRes.papers.length === 0) setBuilderOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete paper');
    }
  }

  async function handleLogout() {
    await facultyLogout().catch(() => undefined);
    setFaculty(null);
    setPapers([]);
    setActivePaper(null);
    router.replace('/faculty/login');
  }

  // Still checking, or signed out and about to bounce to the login route: both
  // show the same quiet wait screen rather than a form inside the studio.
  if (!authChecked || !faculty) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#FBFCFE] bg-page-wash font-dm">
        <div className="flex flex-col items-center gap-5" role="status" aria-live="polite">
          <Image src="/logo.png" alt="JEENEET.ai" width={118} height={48} priority className="block h-12 w-auto" />
          <span
            aria-hidden
            className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#C6D2F8] border-t-[#803688] motion-reduce:animate-none"
          />
          <p className="text-[13px] font-semibold text-[#7A87A0]">
            {authChecked ? 'Taking you to sign in...' : 'Checking faculty session...'}
          </p>
        </div>
      </div>
    );
  }

  const initials = faculty.name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#FBFCFE] bg-page-wash font-dm text-[#003366]">
      {/* Top navigation: the brand on the left, who is signed in and the way out on the right. */}
      <header className="sticky top-0 z-20 border-b border-[#003366]/10 bg-[#FBFCFE]/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1160px] items-center justify-between gap-4 px-4 py-1.5 sm:px-6 sm:py-2">
          <Link href="/" aria-label="JEENEET.ai home" className="shrink-0 rounded-xl">
            <Image src="/logo.png" alt="JEENEET.ai" width={118} height={48} priority className="block h-12 w-auto sm:h-14" />
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2.5 rounded-full border border-[#003366]/10 bg-white py-1 pl-1 pr-3.5 shadow-[0_2px_0_#E3E9F7]">
              {faculty.avatarUrl ? (
                <Image
                  src={faculty.avatarUrl}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-grad text-[12px] font-extrabold text-white">
                  {initials || 'F'}
                </span>
              )}
              <span className="hidden min-w-0 flex-col leading-tight sm:flex">
                <span className="max-w-[180px] truncate text-[12.5px] font-extrabold text-[#003366]">{faculty.name}</span>
                <span className="max-w-[180px] truncate text-[11px] font-medium text-[#5A6B8C]">{faculty.email}</span>
              </span>
            </div>
            <button type="button" className={BTN_SECONDARY} onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 pb-16 pt-5 sm:px-6 sm:pb-[72px] sm:pt-6">
        <div className="mx-auto w-full max-w-[1160px]">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#003366]/10 pb-4">
            <div>
              <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-[#003366] sm:text-[26px]">Faculty Weekly Paper Studio</h1>
              <p className="mt-1 text-[13px] font-medium text-[#5A6B8C]">{papers.length} paper{papers.length === 1 ? '' : 's'} generated</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {!activePaper && activeTab === 'papers' && (
                <button type="button" className={BTN_PRIMARY} onClick={() => setBuilderOpen((v) => !v)}>
                  {builderOpen ? 'Close Builder' : '+ Generate New Paper'}
                </button>
              )}
            </div>
          </header>

          {error && <div className="mb-3.5 rounded-2xl border border-[#C8202F]/25 bg-[#FDF3F4] px-3.5 py-2.5 text-[13px] font-semibold text-[#C8202F]">{error}</div>}

          {activePaper ? (
            <FacultyPaperPreview
              paper={activePaper}
              topicsBySubject={activePaperTopics}
              onBack={() => setActivePaper(null)}
              onPaperUpdated={(updated) => {
                setActivePaper(updated);
                setPapers((prev) =>
                  prev.map((row) =>
                    row.id === updated.id
                      ? {
                          ...row,
                          questionCount: updated.questionCount,
                          verifiedCount: updated.verifiedCount,
                          status: updated.status,
                        }
                      : row,
                  ),
                );
              }}
              onDelete={handleDeletePaper}
              onError={setError}
            />
          ) : (
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-6">
              <FacultySidebar activeTab={activeTab} onTabChange={setActiveTab} />
              <div className="flex min-w-0 flex-1 flex-col gap-5">
                {activeTab === 'batches' ? (
                  <FacultyBatchesTab />
                ) : activeTab === 'assignments' ? (
                  <FacultyAssignmentsTab
                    onViewReport={(id) => {
                      setSelectedReportAssignmentId(id);
                      setActiveTab('reports');
                    }}
                  />
                ) : activeTab === 'reports' ? (
                  <FacultyReportsTab initialAssignmentId={selectedReportAssignmentId} />
                ) : (
                  <div className="flex flex-col gap-5">
                    {builderOpen && (
                      <form className={PANEL} onSubmit={handleCreatePaper}>
                        <div className={PANEL_TITLE}>
                          <span>Create Verified Exam Paper</span>
                          {papers.length > 0 && (
                            <button type="button" className={BTN_SECONDARY} onClick={() => setBuilderOpen(false)}>
                              Hide
                            </button>
                          )}
                        </div>

                        {/* 1. EXAM PATTERN SELECTOR (FIRST POSITION) */}
                        <div className="mb-4 rounded-2xl border border-[#003366]/15 bg-[#F7F9FF] p-4">
                          <div className={FIELD}>
                            <label className="text-[13px] font-black text-[#003366]" htmlFor="paper-exam">
                              Exam Pattern (Select First)
                            </label>
                            <select
                              id="paper-exam"
                              className={SELECT}
                              value={examType}
                              onChange={(e) => void handleExamTypeChange(e.target.value as FacultyExamType)}
                            >
                              <option value="Main">JEE Main (NTA Rationalized)</option>
                              <option value="Advanced">JEE Advanced (IIT Rigor Only)</option>
                              <option value="NEET">NEET-UG (NCERT Medical)</option>
                              <option value="Psychometric">Psychometric &amp; Behavioral Assessment</option>
                            </select>
                            <p className="mt-1 text-[12px] text-[#5A6B8C]">
                              {examType === 'Psychometric'
                                ? 'Customized psychometric & behavioral paper with evaluation goal calibration. Opinion-based, covers all 5 question models, and exports to Excel.'
                                : 'Select the examination standard to configure topics, cognitive difficulty distribution, and paper pattern.'}
                            </p>
                          </div>
                        </div>

                        {examType === 'Psychometric' ? (
                          /* PSYCHOMETRIC ASSESSMENT CREATION VIEW */
                          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div>
                              {/* Exam Goal Prompt Box */}
                              <div className={FIELD}>
                                <label className={LABEL} htmlFor="paper-goal">
                                  Exam Goal / Evaluation Target <span className="font-normal text-[#5A6B8C]">(AI Calibration Focus)</span>
                                </label>
                                <textarea
                                  id="paper-goal"
                                  className="min-h-[86px] w-full resize-y rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2.5 text-[14px] font-semibold leading-relaxed text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-normal placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6]"
                                  placeholder="e.g. Assess students' Computer Science aptitude and Entrepreneurship mindset, technical problem-solving attitude, and risk-taking preferences"
                                  value={examGoal}
                                  onChange={(e) => setExamGoal(e.target.value)}
                                  maxLength={500}
                                />
                                <p className="mt-1 text-[11.5px] text-[#5A6B8C]">
                                  The AI engine calibrates cognitive logic puzzles, situational dilemmas, emotional traits, and career inclinations directly to this goal. Generates questions without rigid right/wrong answers and flags radical responses for Excel export.
                                </p>
                              </div>

                              <div className={FIELD}>
                                <label className={LABEL} htmlFor="paper-title">Paper Title (optional, neutral)</label>
                                <input
                                  id="paper-title"
                                  className={INPUT}
                                  placeholder="e.g. Computer Science &amp; Entrepreneurship Diagnostic"
                                  value={title}
                                  onChange={(e) => setTitle(e.target.value)}
                                  maxLength={120}
                                />
                              </div>

                              <div className={FIELD}>
                                <label className={LABEL} htmlFor="paper-org">
                                  College / Organization Name <span className="font-normal text-[#5A6B8C]">(optional)</span>
                                </label>
                                <input
                                  id="paper-org"
                                  className={INPUT}
                                  placeholder="Enter college or organization name"
                                  value={organization}
                                  onChange={(e) => setOrganization(e.target.value)}
                                  maxLength={120}
                                />
                              </div>

                              <div className={FIELD}>
                                <label className={LABEL} htmlFor="paper-count">
                                  Question Count (1–180)
                                </label>
                                <input
                                  id="paper-count"
                                  type="number"
                                  min={1}
                                  max={180}
                                  className={INPUT}
                                  placeholder="e.g. 24"
                                  value={questionCountStr}
                                  onChange={(e) => {
                                    const raw = e.target.value;
                                    setQuestionCountStr(raw);
                                    if (raw.trim() === '') return;
                                    const parsed = parseInt(raw, 10);
                                    if (!isNaN(parsed) && parsed >= 1 && parsed <= 180) {
                                      setQuestionCount(parsed);
                                    }
                                  }}
                                  onBlur={() => {
                                    const parsed = parseInt(questionCountStr, 10);
                                    if (questionCountStr.trim() === '' || isNaN(parsed) || parsed < 1) {
                                      const fallback = questionCount >= 1 ? questionCount : 24;
                                      setQuestionCount(fallback);
                                      setQuestionCountStr(String(fallback));
                                    } else if (parsed > 180) {
                                      setQuestionCount(180);
                                      setQuestionCountStr('180');
                                    } else {
                                      setQuestionCount(parsed);
                                      setQuestionCountStr(String(parsed));
                                    }
                                  }}
                                  required
                                />
                                <div className="mt-1 flex flex-wrap gap-1.5">
                                  {COUNT_PRESETS.Psychometric.map((p) => (
                                    <button
                                      key={p.count}
                                      type="button"
                                      className={cx(MICRO_BTN, questionCount === p.count ? MICRO_ON : MICRO_OFF)}
                                      onClick={() => {
                                        setQuestionCount(p.count);
                                        setQuestionCountStr(String(p.count));
                                      }}
                                    >
                                      {p.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Question Model Diversity Checklist */}
                              <div className="mt-2 rounded-2xl border border-[#003366]/10 bg-[#F7F9FF] p-3.5 text-[12.5px] text-[#31407F]">
                                <div className="font-extrabold text-[#003366]">Mandatory Question Model Diversity (At least 1 from each model)</div>
                                <div className="mt-2 grid grid-cols-1 gap-1.5 text-[12px]">
                                  <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#15803D]" /> 5-point Agreement Scale (Strongly Disagree to Agree)</div>
                                  <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#15803D]" /> 5-point Frequency Scale (Never to Always)</div>
                                  <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#15803D]" /> Real-world Situational Judgment Dilemma (SJT)</div>
                                  <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#15803D]" /> Cognitive Logic &amp; Domain Aptitude MCQ</div>
                                  <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#15803D]" /> 4-point Passion / Career Interest Scale</div>
                                </div>
                                <div className="mt-2 border-t border-[#003366]/10 pt-2 text-[11px] text-[#5A6B8C]">
                                  Opinion &amp; trait based. Evaluates persona fit (e.g. Entrepreneurial Fit), flags radical answers, and exports to Excel (.csv).
                                </div>
                              </div>
                            </div>

                            {/* Right column: 8 Psychometric Domains */}
                            <div>
                              <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                                <label className={LABEL}>
                                  Psychometric Domains ({selectedPsychometricDomains.length}/8 selected)
                                </label>
                                <div className="flex gap-1.5">
                                  <button
                                    type="button"
                                    className="text-[12px] font-bold text-accent underline hover:text-[#5A2560]"
                                    onClick={() => setSelectedPsychometricDomains(PSYCHOMETRIC_DOMAINS)}
                                  >
                                    Select All
                                  </button>
                                  <span className="text-[#CBD5E1]">|</span>
                                  <button
                                    type="button"
                                    className="text-[12px] font-bold text-[#5A6B8C] underline hover:text-[#003366]"
                                    onClick={() => setSelectedPsychometricDomains([])}
                                  >
                                    Clear
                                  </button>
                                </div>
                              </div>

                              <div className="flex max-h-[480px] flex-col gap-2 overflow-y-auto rounded-2xl border-[2.5px] border-[#003366]/20 bg-[#F7F9FF] p-3">
                                {PSYCHOMETRIC_DOMAINS.map((domain) => {
                                  const isSelected = selectedPsychometricDomains.includes(domain);
                                  const meta = PSYCHOMETRIC_DOMAIN_META[domain] || { badge: 'Assessment', desc: '' };
                                  return (
                                    <label
                                      key={domain}
                                      className={cx(
                                        'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors',
                                        isSelected ? 'border-[#003366] bg-white shadow-sm' : 'border-[#CBD5E1] bg-white/60 opacity-80 hover:opacity-100',
                                      )}
                                    >
                                      <input
                                        type="checkbox"
                                        className="mt-1 h-4 w-4 rounded border-[#003366] text-accent focus:ring-accent"
                                        checked={isSelected}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedPsychometricDomains((prev) => [...prev, domain]);
                                          } else {
                                            setSelectedPsychometricDomains((prev) => prev.filter((d) => d !== domain));
                                          }
                                        }}
                                      />
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className="font-display text-[13.5px] font-extrabold text-[#003366]">{domain}</span>
                                          <span className="rounded-md bg-ice px-2 py-0.5 text-[10.5px] font-bold text-accent">{meta.badge}</span>
                                        </div>
                                        <p className="mt-0.5 text-[12px] leading-snug text-[#5A6B8C]">{meta.desc}</p>
                                      </div>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* STANDARD JEE / NEET EXAM CREATION VIEW */
                          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div>
                              <div className={FIELD}>
                                <label className={LABEL} htmlFor="paper-title">Paper Title (optional, neutral)</label>
                                <input
                                  id="paper-title"
                                  className={INPUT}
                                  placeholder="e.g. Week 4 Rotational Motion & Electrochemistry"
                                  value={title}
                                  onChange={(e) => setTitle(e.target.value)}
                                  maxLength={120}
                                />
                              </div>

                              <div className={FIELD}>
                                <label className={LABEL} htmlFor="paper-org">
                                  College / Organization Name <span className="font-normal text-[#5A6B8C]">(optional)</span>
                                </label>
                                <input
                                  id="paper-org"
                                  className={INPUT}
                                  placeholder="Enter college or organization name"
                                  value={organization}
                                  onChange={(e) => setOrganization(e.target.value)}
                                  maxLength={120}
                                />
                              </div>

                              <div className={FIELD}>
                                <label className={LABEL}>Cognitive Rigor &amp; Question Difficulty</label>
                                <div className="flex items-center gap-2.5 rounded-2xl border border-[#003366]/10 bg-[#F7F9FF] px-3.5 py-2.5 text-[12px] text-[#31407F]">
                                  <Target className="h-[16px] w-[16px] shrink-0" aria-hidden />
                                  <div>
                                    <strong>Granular Topic Breakdown:</strong> Configure exact quantities of <strong>Easy</strong>, <strong>Medium</strong>, and <strong>Hard</strong> questions per topic &amp; question type below using direct integer counters.
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                <div className={FIELD}>
                                  <label className={LABEL} htmlFor="paper-count">
                                    Question Count (1–180)
                                  </label>
                                  <input
                                    id="paper-count"
                                    type="number"
                                    min={1}
                                    max={180}
                                    className={INPUT}
                                    placeholder="e.g. 75"
                                    value={questionCountStr}
                                    onChange={(e) => {
                                      const raw = e.target.value;
                                      setQuestionCountStr(raw);
                                      if (raw.trim() === '') return;
                                      const parsed = parseInt(raw, 10);
                                      if (!isNaN(parsed) && parsed >= 1 && parsed <= 180) {
                                        setQuestionCount(parsed);
                                      }
                                    }}
                                    onBlur={() => {
                                      const parsed = parseInt(questionCountStr, 10);
                                      if (questionCountStr.trim() === '' || isNaN(parsed) || parsed < 1) {
                                        const fallback = questionCount >= 1 ? questionCount : (DEFAULT_COUNT[examType] || 75);
                                        setQuestionCount(fallback);
                                        setQuestionCountStr(String(fallback));
                                      } else if (parsed > 180) {
                                        setQuestionCount(180);
                                        setQuestionCountStr('180');
                                      } else {
                                        setQuestionCount(parsed);
                                        setQuestionCountStr(String(parsed));
                                      }
                                    }}
                                    required
                                  />
                                  <div className="mt-1 flex flex-wrap gap-1.5">
                                    {COUNT_PRESETS[examType]?.map((p) => (
                                      <button
                                        key={p.count}
                                        type="button"
                                        className={cx(MICRO_BTN, questionCount === p.count ? MICRO_ON : MICRO_OFF)}
                                        onClick={() => {
                                          setQuestionCount(p.count);
                                          setQuestionCountStr(String(p.count));
                                          applyPresetAcrossTopics(p.count);
                                        }}
                                      >
                                        {p.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className={FIELD}>
                                  <label className={LABEL} htmlFor="paper-qtype">Quick Batch Mix</label>
                                  <select
                                    id="paper-qtype"
                                    className={SELECT}
                                    value={questionType}
                                    onChange={(e) => {
                                      const next = e.target.value as FacultyQuestionTypePref;
                                      setQuestionType(next);
                                      if (next === 'mcq_single') {
                                        applyPresetToAll(5, 0, 0, 0);
                                      } else if (next === 'integer') {
                                        applyPresetToAll(0, 5, 0, 0);
                                      } else if (next === 'mcq_multi') {
                                        applyPresetToAll(0, 0, 5, 0);
                                      } else if (next === 'matrix_match') {
                                        applyPresetToAll(0, 0, 0, 5);
                                      } else {
                                        applyPresetToAll(examType === 'Advanced' ? 3 : 5, 1, examType === 'Advanced' ? 2 : 0, 0);
                                      }
                                    }}
                                  >
                                    {examType === 'NEET' ? (
                                      <>
                                        <option value="auto">NEET Standard Mix (MCQ + Match List)</option>
                                        <option value="mcq_single">Single-correct MCQ Only</option>
                                        <option value="matrix_match">Matrix Match (Match the List) Only</option>
                                      </>
                                    ) : (
                                      <>
                                        <option value="auto">Official Pattern Mix (5 MCQ + 1 Int)</option>
                                        <option value="mcq_single">Single-correct Only</option>
                                        <option value="integer">Integer Only</option>
                                        {examType === 'Advanced' && <option value="mcq_multi">Multi-correct Only</option>}
                                        <option value="matrix_match">Matrix Match (Match the List) Only</option>
                                      </>
                                    )}
                                  </select>
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className={FIELD}>
                                <div className="flex items-center justify-between">
                                  <label className={LABEL}>Topics ({selectedTopicsCount} selected)</label>
                                  {selectedTopicsCount > 0 && (
                                    <button
                                      type="button"
                                      className={cx(MICRO_BTN, MICRO_OFF)}
                                      onClick={() => setTopicConfigs({})}
                                    >
                                      Clear all
                                    </button>
                                  )}
                                </div>

                                <div className="mb-2.5 flex flex-wrap gap-1.5">
                                  {subjects.map((subj) => (
                                    <button
                                      key={subj}
                                      type="button"
                                      className={cx('cursor-pointer rounded-xl border-[2px] border-[#003366]/15 bg-white px-2.5 py-1.5 text-[12.5px] font-bold text-[#003366] transition-colors duration-150 hover:bg-ice motion-reduce:transition-none', activeSubject === subj && 'border-transparent bg-grad text-white')}
                                      onClick={() => setActiveSubject(subj)}
                                    >
                                      {subj}
                                    </button>
                                  ))}
                                </div>

                                <input
                                  className={cx(INPUT, 'mb-2')}
                                  placeholder={`Filter ${activeSubject} topics...`}
                                  value={topicSearch}
                                  onChange={(e) => setTopicSearch(e.target.value)}
                                />

                                <div className="max-h-[230px] overflow-y-auto rounded-2xl border border-[#003366]/10 bg-[#FBFCFE] p-1.5">
                                  {visibleTopics.map((topic) => {
                                    const checked = Boolean(topicConfigs[`${activeSubject}::${topic}`]);
                                    return (
                                      <label key={topic} className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-[12.5px] font-medium text-[#003366] transition-colors duration-150 hover:bg-ice motion-reduce:transition-none">
                                        <input
                                          type="checkbox"
                                          checked={checked}
                                          onChange={() => toggleSelection(activeSubject as Subject, topic)}
                                        />
                                        <span>{topic}</span>
                                      </label>
                                    );
                                  })}
                                  {visibleTopics.length === 0 && (
                                    <p className="mt-1 p-1.5 text-[13px] font-medium text-[#5A6B8C]">No topics match.</p>
                                  )}
                                </div>

                                {selectedTopicsCount > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1.5">
                                    {Object.values(topicConfigs).map((cfg) => (
                                      <span key={`${cfg.subject}::${cfg.topic}`} className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent-50 px-2 py-0.5 text-[11.5px] font-bold text-accent">
                                        {cfg.subject.slice(0, 4)}: {cfg.topic} ({getTopicTotal(cfg)} Qs)
                                        <button
                                          type="button"
                                          className="cursor-pointer border-0 bg-transparent p-0 text-[13px] leading-none text-accent transition-colors duration-150 hover:text-accent-900"
                                          aria-label={`Remove ${cfg.topic}`}
                                          onClick={() => toggleSelection(cfg.subject, cfg.topic)}
                                        >
                                          ×
                                        </button>
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {examType !== 'Psychometric' && selectedTopicsCount > 0 && (
                          <div className="mt-5">
                            <TopicBreakdownConfig
                              selectedSubjects={selectedSubjects}
                              selectedTopics={selectedTopics}
                              perSubjectCount={perSubjectTarget}
                              isNeet={examType === 'NEET'}
                              isAdvanced={examType === 'Advanced'}
                              topicConfigs={topicConfigs}
                              onTopicConfigs={setTopicConfigs}
                              onAutoDistributeSubject={autoDistributeTopicsForSubject}
                              onAutoDistributeAll={autoDistributeAllTopics}
                            />
                          </div>
                        )}

                        <div className="mt-6 flex justify-end">
                          <button
                            type="submit"
                            className={BTN_PRIMARY}
                            disabled={
                              creating ||
                              (examType === 'Psychometric'
                                ? selectedPsychometricDomains.length === 0
                                : selectedTopicsCount === 0 || totalCalculatedCount !== questionCount)
                            }
                          >
                            {creating
                              ? 'Starting generation...'
                              : examType === 'Psychometric'
                              ? selectedPsychometricDomains.length === 0
                                ? 'Select at least 1 domain above'
                                : `Generate ${questionCount}-Question Psychometric Paper`
                              : selectedTopicsCount === 0
                              ? 'Select at least 1 topic above'
                              : totalCalculatedCount > questionCount
                              ? `Overflow: Reduce ${totalCalculatedCount - questionCount} Q(s) in Topics`
                              : totalCalculatedCount < questionCount
                              ? `Add ${questionCount - totalCalculatedCount} more Q(s) to match ${questionCount}`
                              : `Generate ${questionCount}-Question Verified Paper`}
                          </button>
                        </div>
                      </form>
                    )}

                    <section className={PANEL}>
                      <div className={PANEL_TITLE}>
                        <span>Generated Papers Stack ({papers.length})</span>
                      </div>

                      {papers.length === 0 ? (
                        <p className="mt-1 text-[13px] font-medium text-[#5A6B8C]">No papers generated yet. Configure topics above to create your first paper.</p>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {papers.map((p) => {
                            const examLabel = p.examType === 'NEET' ? 'NEET-UG' : `JEE ${p.examType}`;
                            const dateStr = new Date(p.createdAt).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            });
                            return (
                              <div key={p.id} className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-[#003366]/10 bg-white px-5 py-4 shadow-[0_16px_40px_-34px_rgba(0,51,102,.4)] transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_22px_46px_-32px_rgba(0,51,102,.45)] motion-reduce:transition-none">
                                <div className="flex min-w-[240px] flex-1 flex-col gap-1.5">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-lg bg-ice px-2 py-0.5 font-mono text-[11px] font-bold text-accent">{p.paperCode}</span>
                                    {p.organization && (
                                      <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-ice px-1.5 py-px text-[11px] font-bold text-[#003366]">
                                        <Landmark className="h-[11px] w-[11px] shrink-0" aria-hidden />
                                        {p.organization}
                                      </span>
                                    )}
                                    <span className="font-display text-[17px] font-extrabold text-[#003366]">{p.title}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2.5 text-[12px] font-medium text-[#5A6B8C]">
                                    <span><strong>{examLabel}</strong></span>
                                    <span>{p.questionCount} Qs</span>
                                    <span>Difficulty: {p.difficulty}</span>
                                    <span>
                                      {p.status === 'ready'
                                        ? 'Ready'
                                        : p.status === 'generating'
                                          ? 'Generating...'
                                          : 'Error'}
                                    </span>
                                    <span>{dateStr}</span>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                  <button
                                    type="button"
                                    className={BTN_PRIMARY}
                                    onClick={() => void handleOpenPaper(p.id)}
                                  >
                                    Open / Edit
                                  </button>
                                  {p.status === 'ready' && (
                                    <>
                                      <button
                                        type="button"
                                        disabled={downloadingPdf?.id === p.id}
                                        onClick={() => void handleDownloadPdf(p.id, 'questions')}
                                        className={BTN_ACCENT}
                                      >
                                        {downloadingPdf?.id === p.id && downloadingPdf.mode === 'questions' ? 'Generating PDF...' : 'Download PDF: Questions'}
                                      </button>
                                      <button
                                        type="button"
                                        disabled={downloadingPdf?.id === p.id}
                                        onClick={() => void handleDownloadPdf(p.id, 'solutions')}
                                        className={BTN_ACCENT}
                                      >
                                        {downloadingPdf?.id === p.id && downloadingPdf.mode === 'solutions' ? 'Generating PDF...' : 'Download PDF: Solutions'}
                                      </button>
                                      <button
                                        type="button"
                                        disabled={downloadingPdf?.id === p.id}
                                        onClick={() => void handleDownloadPdf(p.id, 'key')}
                                        className={BTN_ACCENT}
                                      >
                                        {downloadingPdf?.id === p.id && downloadingPdf.mode === 'key' ? 'Generating PDF...' : 'Download PDF: Key'}
                                      </button>
                                    </>
                                  )}
                                  <button
                                    type="button"
                                    className={BTN_DANGER}
                                    disabled={p.status === 'generating'}
                                    onClick={() => void handleDeletePaper(p.id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </section>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
