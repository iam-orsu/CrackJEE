'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  facultyCreatePaper,
  facultyDeletePaper,
  facultyGetPaper,
  facultyGetTopics,
  facultyListPapers,
  facultyLogout,
  facultyMe,
  FacultyError,
  type FacultyDifficulty,
  type FacultyExamType,
  type FacultyPaper,
  type FacultyPaperSelection,
  type FacultyPaperSummary,
  type FacultyQuestionTypePref,
  type FacultyUser,
} from '@/lib/faculty';
import { FacultyPaperPreview } from '@/components/faculty/FacultyPaperPreview';

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
};

const DEFAULT_COUNT: Record<FacultyExamType, number> = {
  Main: 75,
  Advanced: 54,
  NEET: 180,
};

type ClassValue = string | false | null | undefined;
const cx = (...parts: ClassValue[]) => parts.filter(Boolean).join(' ');

/* The builder repeats a few micro-controls a dozen times, so their classes
   live here and every instance stays identical. */
const MICRO_BTN = 'cursor-pointer rounded-xl border-[2px] border-[#003366]/20 px-2 py-1 text-[10.5px] font-bold transition-colors duration-150 motion-reduce:transition-none';
const MICRO_ON = 'border-transparent bg-grad text-white';
const MICRO_OFF = 'bg-white text-[#003366] hover:bg-ice';
const RANGE = 'h-1 flex-1 cursor-pointer appearance-none rounded-full bg-soft/60';
const RANGE_ROW = 'flex items-center gap-2 text-[11.5px] font-semibold text-[#003366]';
const RANGE_LABEL = 'w-[90px] shrink-0 font-bold';
const RANGE_VALUE = 'w-[34px] shrink-0 text-right font-extrabold tabular-nums';

/* Overflow / underflow banners and the count status pill. */
const BANNER = 'mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-3.5 py-2.5 text-[13px] font-semibold';
const BANNER_BAD = 'border-[#FECACA] bg-[#FDF3F4] text-[#C8202F]';
const BANNER_WARN = 'border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]';
const AUTO_MATCH_BTN = 'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border-[2.5px] border-[#5A2560] bg-grad px-2.5 py-1 text-[11px] font-extrabold text-white shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[3px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none';

function countPill(ok: boolean, over: boolean): string {
  return cx(
    'rounded-full border px-2 py-1 text-[11.5px] font-bold',
    ok ? 'border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]' : over ? 'border-[#FECACA] bg-[#FDF3F4] text-[#C8202F]' : 'border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]',
  );
}

export default function FacultyPage() {
  const router = useRouter();
  const [faculty, setFaculty] = useState<FacultyUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Builder state (JEE Main defaults to 75 per NTA 2025-2026 pattern)
  const [builderOpen, setBuilderOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [examType, setExamType] = useState<FacultyExamType>('Main');
  const [difficulty, setDifficulty] = useState<FacultyDifficulty>('intermediate');
  const [difficultyMode, setDifficultyMode] = useState<'preset' | 'custom'>('preset');
  const [difficultyDistribution, setDifficultyDistribution] = useState<{
    beginner: number;
    intermediate: number;
    advanced: number;
  }>({
    beginner: 20,
    intermediate: 40,
    advanced: 40,
  });
  const [questionCount, setQuestionCount] = useState(75);
  const [questionCountStr, setQuestionCountStr] = useState('75');
  const [questionType, setQuestionType] = useState<FacultyQuestionTypePref>('auto');

  const totalDifficultyPct = useMemo(() => {
    return (
      (difficultyDistribution.beginner || 0) +
      (difficultyDistribution.intermediate || 0) +
      (difficultyDistribution.advanced || 0)
    );
  }, [difficultyDistribution]);

  function handleNormalizePercentages() {
    const b = difficultyDistribution.beginner || 0;
    const i = difficultyDistribution.intermediate || 0;
    const a = difficultyDistribution.advanced || 0;
    const sum = b + i + a;
    if (sum === 0) {
      setDifficultyDistribution({ beginner: 20, intermediate: 40, advanced: 40 });
      return;
    }
    const newB = Math.round((b / sum) * 100);
    const newI = Math.round((i / sum) * 100);
    const newA = 100 - newB - newI;
    setDifficultyDistribution({ beginner: newB, intermediate: newI, advanced: newA });
  }

  function applyDifficultyPreset(b: number, i: number, a: number) {
    setDifficultyDistribution({ beginner: b, intermediate: i, advanced: a });
  }

  function getDifficultyCountForPct(pct: number) {
    return Math.round((pct / 100) * questionCount);
  }

  const [subjects, setSubjects] = useState<string[]>(['Physics', 'Chemistry', 'Mathematics']);
  const [topicsBySubject, setTopicsBySubject] = useState<Record<string, string[]>>({});
  const [activeSubject, setActiveSubject] = useState('Physics');
  const [topicSearch, setTopicSearch] = useState('');
  const [selections, setSelections] = useState<FacultyPaperSelection[]>([]);

  // Stacked Paper Library & Opened Paper Workspace
  const [papers, setPapers] = useState<FacultyPaperSummary[]>([]);
  const [activePaper, setActivePaper] = useState<FacultyPaper | null>(null);
  const [activePaperTopics, setActivePaperTopics] = useState<Record<string, string[]>>({});
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

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
    const defaultCnt = DEFAULT_COUNT[nextExam];
    setQuestionCount(defaultCnt);
    setQuestionCountStr(String(defaultCnt));
    if (nextExam === 'Advanced') {
      setDifficulty('advanced');
      setQuestionType('auto');
    } else if (nextExam === 'NEET') {
      setDifficulty('intermediate');
      setQuestionType('mcq_single');
    } else {
      setDifficulty('intermediate');
      setQuestionType('auto');
    }

    try {
      const res = await facultyGetTopics(nextExam);
      setSubjects(res.subjects);
      setTopicsBySubject(res.topics);
      setActiveSubject(res.subjects[0] ?? 'Physics');
      setSelections((prev) =>
        prev
          .filter((sel) => res.topics[sel.subject]?.includes(sel.topic))
          .map((sel) => ({
            ...sel,
            mcqCount: sel.mcqCount ?? (nextExam === 'NEET' ? 5 : nextExam === 'Advanced' ? 3 : 5),
            integerCount: nextExam === 'NEET' ? 0 : (sel.integerCount ?? 1),
            multiCount: nextExam === 'Advanced' ? (sel.multiCount ?? 2) : 0,
          })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load topics');
    }
  }

  // Poll active generating paper every 2.5s
  useEffect(() => {
    if (!faculty || !activePaper || activePaper.status !== 'generating') return;
    const timer = setInterval(async () => {
      try {
        const res = await facultyGetPaper(activePaper.id);
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
  }, [faculty, activePaper]);

  const visibleTopics = useMemo(() => {
    const all = topicsBySubject[activeSubject] ?? [];
    const q = topicSearch.trim().toLowerCase();
    return q ? all.filter((t) => t.toLowerCase().includes(q)) : all;
  }, [topicsBySubject, activeSubject, topicSearch]);

  function toggleSelection(subject: FacultyPaperSelection['subject'], topic: string) {
    setSelections((prev) => {
      const exists = prev.some((s) => s.subject === subject && s.topic === topic);
      if (exists) {
        return prev.filter((s) => !(s.subject === subject && s.topic === topic));
      }
      const defaultMcq = examType === 'NEET' ? 5 : examType === 'Advanced' ? 3 : 5;
      const defaultInt = examType === 'NEET' ? 0 : 1;
      const defaultMulti = examType === 'Advanced' ? 2 : 0;
      return [
        ...prev,
        {
          subject,
          topic,
          mcqCount: defaultMcq,
          integerCount: defaultInt,
          multiCount: defaultMulti,
        },
      ];
    });
  }

  const totalCalculatedCount = useMemo(() => {
    if (selections.length === 0) return 0;
    return selections.reduce(
      (acc, s) => acc + (s.mcqCount ?? 0) + (s.integerCount ?? 0) + (s.multiCount ?? 0) + (s.matrixCount ?? 0),
      0,
    );
  }, [selections]);

  function handleCountChange(
    subject: FacultyPaperSelection['subject'],
    topic: string,
    field: 'mcqCount' | 'integerCount' | 'multiCount' | 'matrixCount',
    val: number,
  ) {
    const clamped = Math.max(0, Math.min(100, isNaN(val) ? 0 : val));
    setSelections((prev) =>
      prev.map((s) => (s.subject === subject && s.topic === topic ? { ...s, [field]: clamped } : s)),
    );
  }

  function handleCountStep(
    subject: FacultyPaperSelection['subject'],
    topic: string,
    field: 'mcqCount' | 'integerCount' | 'multiCount' | 'matrixCount',
    delta: number,
  ) {
    if (delta > 0 && totalCalculatedCount >= questionCount) {
      setError(`Cannot add more questions: total configured (${totalCalculatedCount}) already reaches or exceeds Question Count (${questionCount}). Reduce other topics or increase Question Count.`);
      return;
    }
    setError('');
    setSelections((prev) =>
      prev.map((s) => {
        if (s.subject !== subject || s.topic !== topic) return s;
        const current = s[field] ?? 0;
        const next = Math.max(0, Math.min(100, current + delta));
        return { ...s, [field]: next };
      }),
    );
  }

  function applyPresetToAll(mcq: number, intCount: number, multi = 0, matrix = 0) {
    setSelections((prev) =>
      prev.map((s) => ({
        ...s,
        mcqCount: mcq,
        integerCount: examType === 'NEET' ? 0 : intCount,
        multiCount: examType === 'Advanced' ? multi : 0,
        matrixCount: matrix,
      })),
    );
  }

  function applyPresetAcrossTopics(total: number) {
    setQuestionCount(total);
    setQuestionCountStr(String(total));
    if (selections.length === 0) return;
    const n = selections.length;
    const perTopic = Math.max(1, Math.floor(total / n));
    setSelections((prev) =>
      prev.map((s, idx) => {
        const topicTotal = perTopic + (idx < total % n ? 1 : 0);
        if (questionType === 'matrix_match') {
          return { ...s, mcqCount: 0, integerCount: 0, multiCount: 0, matrixCount: topicTotal };
        }
        if (examType === 'NEET') {
          const matrix = Math.min(s.matrixCount ?? 0, topicTotal);
          return { ...s, mcqCount: topicTotal - matrix, integerCount: 0, multiCount: 0, matrixCount: matrix };
        } else if (examType === 'Advanced') {
          const matrix = Math.min(s.matrixCount ?? 0, topicTotal);
          const rem = Math.max(0, topicTotal - matrix);
          const multi = Math.floor(rem * 0.3);
          const integer = Math.floor(rem * 0.3);
          const mcq = rem - multi - integer;
          return { ...s, mcqCount: mcq, multiCount: multi, integerCount: integer, matrixCount: matrix };
        } else {
          const matrix = Math.min(s.matrixCount ?? 0, topicTotal);
          const rem = Math.max(0, topicTotal - matrix);
          const integer = Math.max(1, Math.round(rem * 0.2));
          const mcq = Math.max(0, rem - integer);
          return { ...s, mcqCount: mcq, integerCount: integer, multiCount: 0, matrixCount: matrix };
        }
      }),
    );
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
          ? `Total questions configured in topics (${totalCalculatedCount}) exceeds Question Count (${questionCount}). Please reduce ${totalCalculatedCount - questionCount} question(s) from topics or adjust Question Count to match.`
          : `Total questions configured in topics (${totalCalculatedCount}) does not match target Question Count (${questionCount}). Please add ${questionCount - totalCalculatedCount} more question(s) or click "Auto-match".`
      );
      return;
    }
    if (examType !== 'Advanced' && difficultyMode === 'custom' && totalDifficultyPct !== 100) {
      setError(`Difficulty percentage total must equal 100% (currently ${totalDifficultyPct}%). Click "Normalize to 100%" or adjust sliders.`);
      return;
    }

    setCreating(true);
    setError('');
    try {
      const res = await facultyCreatePaper({
        title: title.trim() || undefined,
        organization: organization.trim() || undefined,
        examType,
        difficulty: examType === 'Advanced' ? 'advanced' : difficultyMode === 'custom' ? 'mixed' : difficulty,
        difficultyDistribution: examType !== 'Advanced' && difficultyMode === 'custom' ? difficultyDistribution : undefined,
        questionCount,
        questionType,
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
            {authChecked ? 'Taking you to sign in…' : 'Checking faculty session…'}
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
              <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-grad text-[12px] font-extrabold text-white">
                {initials || 'F'}
              </span>
              <span className="hidden min-w-0 flex-col leading-tight sm:flex">
                <span className="max-w-[180px] truncate text-[12.5px] font-extrabold text-[#003366]">{faculty.name}</span>
                <span className="max-w-[180px] truncate text-[11px] font-medium text-[#5A6B8C]">{faculty.email}</span>
              </span>
            </div>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
              onClick={handleLogout}
            >
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
              {!activePaper && (
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#5A2560] bg-grad px-4 py-2 text-[13px] font-extrabold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[3px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                  onClick={() => setBuilderOpen((v) => !v)}
                >
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
            <div className="flex flex-col gap-5">
              {builderOpen && (
                <form className="rounded-[28px] border border-[#003366]/10 bg-white p-5 shadow-[0_24px_56px_-36px_rgba(0,51,102,.45)] sm:p-6" onSubmit={handleCreatePaper}>
                  <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2.5 font-display text-[17px] font-extrabold text-[#003366]">
                    <span>Create Verified Exam Paper</span>
                    {papers.length > 0 && (
                      <button type="button" className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none" onClick={() => setBuilderOpen(false)}>
                        Hide
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div>
                      <div className="mb-3.5 flex flex-col gap-1.5">
                        <label className="text-[12.5px] font-extrabold text-[#003366]" htmlFor="paper-title">Paper Title (optional, neutral)</label>
                        <input
                          id="paper-title"
                          className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                          placeholder="e.g. Week 4 Rotational Motion & Electrochemistry"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          maxLength={120}
                        />
                      </div>

                      <div className="mb-3.5 flex flex-col gap-1.5">
                        <label className="text-[12.5px] font-extrabold text-[#003366]" htmlFor="paper-org">
                          College / Organization Name <span className="font-normal text-[#5A6B8C]">(optional)</span>
                        </label>
                        <input
                          id="paper-org"
                          className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                          placeholder="Enter college or organization name"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          maxLength={120}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        <div className="mb-3.5 flex flex-col gap-1.5">
                          <label className="text-[12.5px] font-extrabold text-[#003366]" htmlFor="paper-exam">Exam Pattern</label>
                          <select
                            id="paper-exam"
                            className="h-[46px] w-full cursor-pointer rounded-xl border-[2.5px] border-[#003366] bg-white px-3 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                            value={examType}
                            onChange={(e) => void handleExamTypeChange(e.target.value as FacultyExamType)}
                          >
                            <option value="Main">JEE Main (NTA Rationalized)</option>
                            <option value="Advanced">JEE Advanced (IIT Rigor Only)</option>
                            <option value="NEET">NEET-UG (NCERT Medical)</option>
                          </select>
                        </div>

                        <div className="mb-3.5 flex flex-col gap-1.5">
                          <div className="mb-1 flex items-center justify-between">
                            <label className="text-[12.5px] font-extrabold text-[#003366]" htmlFor="paper-diff">Cognitive Rigor</label>
                            {examType !== 'Advanced' && (
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  className={cx(MICRO_BTN, difficultyMode === 'preset' ? MICRO_ON : MICRO_OFF)}
                                  onClick={() => setDifficultyMode('preset')}
                                >
                                  Presets
                                </button>
                                <button
                                  type="button"
                                  className={cx(MICRO_BTN, difficultyMode === 'custom' ? MICRO_ON : MICRO_OFF)}
                                  onClick={() => setDifficultyMode('custom')}
                                >
                                  Custom %
                                </button>
                              </div>
                            )}
                          </div>

                          {examType === 'Advanced' ? (
                            <>
                              <input
                                id="paper-diff"
                                className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                                value="Strict JEE Advanced Only"
                                disabled
                              />
                              <div className="mt-0.5 rounded-xl border border-[#FDBA74] bg-[#FFF7EC] px-2.5 py-1.5 text-[11.5px] font-bold text-[#9A5B15]">Locked to IIT JEE Advanced multi-concept rigor</div>
                            </>
                          ) : difficultyMode === 'preset' ? (
                            <select
                              id="paper-diff"
                              className="h-[46px] w-full cursor-pointer rounded-xl border-[2.5px] border-[#003366] bg-white px-3 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                              value={difficulty}
                              onChange={(e) => setDifficulty(e.target.value as FacultyDifficulty)}
                            >
                              <option value="beginner">Beginner (Entry Competitive)</option>
                              <option value="intermediate">Intermediate (Standard Exam)</option>
                              <option value="advanced">Advanced (Rank-Decider)</option>
                              <option value="mixed">Mixed (Balanced)</option>
                            </select>
                          ) : (
                            <div className="rounded-2xl border border-[#003366]/10 bg-[#F7F9FF] px-3 py-2.5">
                              <div className="mb-2 flex flex-wrap items-center justify-between gap-1.5">
                                <span
                                  className={cx(
                                    'rounded-full border px-2 py-0.5 text-[11px] font-bold',
                                    totalDifficultyPct === 100
                                      ? 'border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]'
                                      : totalDifficultyPct > 100
                                      ? 'border-[#FECACA] bg-[#FDF3F4] text-[#C8202F]'
                                      : 'border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]',
                                  )}
                                >
                                  {totalDifficultyPct === 100
                                    ? '✓ Total: 100%'
                                    : totalDifficultyPct > 100
                                    ? `⚠️ Total: ${totalDifficultyPct}% (${totalDifficultyPct - 100}% over)`
                                    : `⚠️ Total: ${totalDifficultyPct}% (${100 - totalDifficultyPct}% needed)`}
                                </span>
                                {totalDifficultyPct !== 100 && (
                                  <button
                                    type="button"
                                    onClick={handleNormalizePercentages}
                                    className={MICRO_BTN + ' ' + MICRO_OFF}
                                  >
                                    Normalize to 100%
                                  </button>
                                )}
                              </div>

                              {/* Preset Buttons */}
                              <div className="mb-2.5 flex flex-wrap gap-1">
                                {([
                                  [30, 30, 40],
                                  [34, 33, 33],
                                  [50, 30, 20],
                                  [20, 40, 40],
                                ] as const).map(([b, i, a]) => {
                                  const on =
                                    difficultyDistribution.beginner === b &&
                                    difficultyDistribution.intermediate === i &&
                                    difficultyDistribution.advanced === a;
                                  return (
                                    <button
                                      key={`${b}/${i}/${a}`}
                                      type="button"
                                      className={cx(MICRO_BTN, on ? MICRO_ON : MICRO_OFF)}
                                      onClick={() => applyDifficultyPreset(b, i, a)}
                                    >
                                      {b}/{i}/{a}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Multi-segment Visual Bar */}
                              <div className="mb-2.5 flex h-1.5 w-full overflow-hidden rounded-full bg-soft/60">
                                <div
                                  title={`Easy: ${difficultyDistribution.beginner || 0}%`}
                                  className="bg-[#22C55E] transition-[width] duration-200 ease-out motion-reduce:transition-none"
                                  style={{ width: `${((difficultyDistribution.beginner || 0) / (totalDifficultyPct || 100)) * 100}%` }}
                                />
                                <div
                                  title={`Medium: ${difficultyDistribution.intermediate || 0}%`}
                                  className="bg-[#EAB308] transition-[width] duration-200 ease-out motion-reduce:transition-none"
                                  style={{ width: `${((difficultyDistribution.intermediate || 0) / (totalDifficultyPct || 100)) * 100}%` }}
                                />
                                <div
                                  title={`Hard: ${difficultyDistribution.advanced || 0}%`}
                                  className="bg-[#EF4444] transition-[width] duration-200 ease-out motion-reduce:transition-none"
                                  style={{ width: `${((difficultyDistribution.advanced || 0) / (totalDifficultyPct || 100)) * 100}%` }}
                                />
                              </div>

                              {/* 3 Slider Rows */}
                              <div className="flex flex-col gap-1.5">
                                <div className={RANGE_ROW}>
                                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#22C55E]" />
                                  <span className={RANGE_LABEL}>Easy (~{getDifficultyCountForPct(difficultyDistribution.beginner || 0)}Q):</span>
                                  <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    step={5}
                                    value={difficultyDistribution.beginner || 0}
                                    onChange={(e) => setDifficultyDistribution((prev) => ({ ...prev, beginner: parseInt(e.target.value, 10) }))}
                                    className={RANGE + ' accent-[#22C55E]'}
                                  />
                                  <span className={RANGE_VALUE}>{difficultyDistribution.beginner || 0}%</span>
                                </div>

                                <div className={RANGE_ROW}>
                                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#EAB308]" />
                                  <span className={RANGE_LABEL}>Medium (~{getDifficultyCountForPct(difficultyDistribution.intermediate || 0)}Q):</span>
                                  <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    step={5}
                                    value={difficultyDistribution.intermediate || 0}
                                    onChange={(e) => setDifficultyDistribution((prev) => ({ ...prev, intermediate: parseInt(e.target.value, 10) }))}
                                    className={RANGE + ' accent-[#EAB308]'}
                                  />
                                  <span className={RANGE_VALUE}>{difficultyDistribution.intermediate || 0}%</span>
                                </div>

                                <div className={RANGE_ROW}>
                                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#EF4444]" />
                                  <span className={RANGE_LABEL}>Hard (~{getDifficultyCountForPct(difficultyDistribution.advanced || 0)}Q):</span>
                                  <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    step={5}
                                    value={difficultyDistribution.advanced || 0}
                                    onChange={(e) => setDifficultyDistribution((prev) => ({ ...prev, advanced: parseInt(e.target.value, 10) }))}
                                    className={RANGE + ' accent-[#EF4444]'}
                                  />
                                  <span className={RANGE_VALUE}>{difficultyDistribution.advanced || 0}%</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        <div className="mb-3.5 flex flex-col gap-1.5">
                          <label className="text-[12.5px] font-extrabold text-[#003366]" htmlFor="paper-count">
                            Question Count (1–180)
                          </label>
                          <input
                            id="paper-count"
                            type="number"
                            min={1}
                            max={180}
                            className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
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
                            {COUNT_PRESETS[examType].map((p) => (
                              <button
                                key={p.count}
                                type="button"
                                className={cx('cursor-pointer rounded-xl border-[2px] border-[#003366]/20 bg-white px-2.5 py-1 text-[11.5px] font-bold text-[#003366] transition-colors duration-150 hover:bg-ice motion-reduce:transition-none', questionCount === p.count && 'border-transparent bg-grad text-white')}
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

                        <div className="mb-3.5 flex flex-col gap-1.5">
                          <label className="text-[12.5px] font-extrabold text-[#003366]" htmlFor="paper-qtype">Quick Batch Mix</label>
                          <select
                            id="paper-qtype"
                            className="h-[46px] w-full cursor-pointer rounded-xl border-[2.5px] border-[#003366] bg-white px-3 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
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
                      <div className="mb-3.5 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[12.5px] font-extrabold text-[#003366]">Topics ({selections.length} selected)</label>
                          {selections.length > 0 && (
                            <button
                              type="button"
                              className={MICRO_BTN + ' ' + MICRO_OFF}
                              onClick={() => setSelections([])}
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
                          className="mb-2 h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                          placeholder={`Filter ${activeSubject} topics…`}
                          value={topicSearch}
                          onChange={(e) => setTopicSearch(e.target.value)}
                        />

                        <div className="max-h-[230px] overflow-y-auto rounded-2xl border border-[#003366]/10 bg-[#FBFCFE] p-1.5">
                          {visibleTopics.map((topic) => {
                            const checked = selections.some((s) => s.subject === activeSubject && s.topic === topic);
                            return (
                              <label key={topic} className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-[12.5px] font-medium text-[#003366] transition-colors duration-150 hover:bg-ice motion-reduce:transition-none">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() =>
                                    toggleSelection(activeSubject as FacultyPaperSelection['subject'], topic)
                                  }
                                />
                                <span>{topic}</span>
                              </label>
                            );
                          })}
                          {visibleTopics.length === 0 && (
                            <p className="mt-1 p-1.5 text-[13px] font-medium text-[#5A6B8C]">No topics match.</p>
                          )}
                        </div>

                        {selections.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {selections.map((sel) => (
                              <span key={`${sel.subject}::${sel.topic}`} className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent-50 px-2 py-0.5 text-[11.5px] font-bold text-accent">
                                {sel.subject.slice(0, 4)}: {sel.topic}
                                <button
                                  type="button"
                                  className="cursor-pointer border-0 bg-transparent p-0 text-[13px] leading-none text-accent transition-colors duration-150 hover:text-accent-900"
                                  aria-label={`Remove ${sel.topic}`}
                                  onClick={() => toggleSelection(sel.subject, sel.topic)}
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

                  {selections.length > 0 && (
                    <div className="mt-5 flex flex-col gap-3 border-t border-[#003366]/10 pt-4">
                      {/* Overflow / Underflow Validation Banners */}
                      {totalCalculatedCount > questionCount && (
                        <div className={BANNER + ' ' + BANNER_BAD}>
                          <span>
                            ⚠️ <strong>Topic questions overflow:</strong> You have configured {totalCalculatedCount} questions across topics, but Question Count is {questionCount}. Please reduce {totalCalculatedCount - questionCount} question(s) or click Auto-match.
                          </span>
                          <button
                            type="button"
                            className={AUTO_MATCH_BTN}
                            onClick={() => applyPresetAcrossTopics(questionCount)}
                          >
                            ⚡ Auto-match to {questionCount}
                          </button>
                        </div>
                      )}

                      {totalCalculatedCount < questionCount && (
                        <div className={BANNER + ' ' + BANNER_WARN}>
                          <span>
                            ⚠️ <strong>Topic questions underflow:</strong> You have configured {totalCalculatedCount} questions, but target Question Count is {questionCount}. Please add {questionCount - totalCalculatedCount} more question(s) or click Auto-match.
                          </span>
                          <button
                            type="button"
                            className={AUTO_MATCH_BTN}
                            onClick={() => applyPresetAcrossTopics(questionCount)}
                          >
                            ⚡ Auto-match to {questionCount}
                          </button>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2 font-display text-[15px] font-extrabold text-[#003366]">
                          <span>Selected Topics &amp; Question Mix</span>
                          <span className={countPill(totalCalculatedCount === questionCount, totalCalculatedCount > questionCount)}>
                            {totalCalculatedCount === questionCount
                              ? `✓ ${totalCalculatedCount} / ${questionCount} Questions Configured`
                              : totalCalculatedCount > questionCount
                              ? `⚠️ ${totalCalculatedCount} / ${questionCount} (Overflow: reduce ${totalCalculatedCount - questionCount})`
                              : `⚠️ ${totalCalculatedCount} / ${questionCount} (${questionCount - totalCalculatedCount} needed)`}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            className={cx(MICRO_BTN, MICRO_ON)}
                            onClick={() => applyPresetAcrossTopics(questionCount)}
                            title={`Auto-distribute exactly ${questionCount} questions across all selected topics`}
                          >
                            ⚡ Auto-match ({questionCount} Qs)
                          </button>
                          <span className="text-[11.5px] font-bold text-[#5A6B8C]">Set all to:</span>
                          {examType === 'NEET' ? (
                            <>
                              <button
                                type="button"
                                className={MICRO_BTN + ' ' + MICRO_OFF}
                                onClick={() => applyPresetToAll(5, 0, 0, 0)}
                              >
                                5 MCQs
                              </button>
                              <button
                                type="button"
                                className={MICRO_BTN + ' ' + MICRO_OFF}
                                onClick={() => applyPresetToAll(10, 0, 0, 0)}
                              >
                                10 MCQs
                              </button>
                              <button
                                type="button"
                                className={MICRO_BTN + ' ' + MICRO_OFF}
                                onClick={() => applyPresetToAll(0, 0, 0, 5)}
                              >
                                Matrix Match (5)
                              </button>
                            </>
                          ) : examType === 'Advanced' ? (
                            <>
                              <button
                                type="button"
                                className={MICRO_BTN + ' ' + MICRO_OFF}
                                onClick={() => applyPresetToAll(3, 1, 2, 0)}
                              >
                                Std (3 Single + 2 Multi + 1 Int)
                              </button>
                              <button
                                type="button"
                                className={MICRO_BTN + ' ' + MICRO_OFF}
                                onClick={() => applyPresetToAll(5, 0, 0, 0)}
                              >
                                MCQ Only (5)
                              </button>
                              <button
                                type="button"
                                className={MICRO_BTN + ' ' + MICRO_OFF}
                                onClick={() => applyPresetToAll(0, 5, 0, 0)}
                              >
                                Integer Only (5)
                              </button>
                              <button
                                type="button"
                                className={MICRO_BTN + ' ' + MICRO_OFF}
                                onClick={() => applyPresetToAll(0, 0, 0, 5)}
                              >
                                Matrix Match (5)
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                className={MICRO_BTN + ' ' + MICRO_OFF}
                                onClick={() => applyPresetToAll(5, 1, 0, 0)}
                              >
                                Std (5 Single + 1 Int)
                              </button>
                              <button
                                type="button"
                                className={MICRO_BTN + ' ' + MICRO_OFF}
                                onClick={() => applyPresetToAll(10, 2, 0, 0)}
                              >
                                12 Qs (10 Single + 2 Int)
                              </button>
                              <button
                                type="button"
                                className={MICRO_BTN + ' ' + MICRO_OFF}
                                onClick={() => applyPresetToAll(5, 0, 0, 0)}
                              >
                                Single-Option Only (5)
                              </button>
                              <button
                                type="button"
                                className={MICRO_BTN + ' ' + MICRO_OFF}
                                onClick={() => applyPresetToAll(0, 5, 0, 0)}
                              >
                                Integer Only (5)
                              </button>
                              <button
                                type="button"
                                className={MICRO_BTN + ' ' + MICRO_OFF}
                                onClick={() => applyPresetToAll(0, 0, 0, 5)}
                              >
                                Matrix Match (5)
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
                        {selections.map((sel) => {
                          const mcq = sel.mcqCount ?? 0;
                          const integer = sel.integerCount ?? 0;
                          const multi = sel.multiCount ?? 0;
                          const matrix = sel.matrixCount ?? 0;
                          const topicTotal = mcq + integer + multi + matrix;

                          return (
                            <div key={`${sel.subject}::${sel.topic}`} className="flex flex-col gap-2.5 rounded-[22px] border border-[#003366]/10 bg-white p-3.5 shadow-[0_16px_38px_-32px_rgba(0,51,102,.45)] transition-[border-color,box-shadow] duration-150 hover:border-accent/30 motion-reduce:transition-none">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#5A6B8C]">{sel.subject}</span>
                                  <span className="text-[13.5px] font-extrabold text-[#003366]">{sel.topic}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="rounded-lg bg-ice px-2 py-0.5 text-[11.5px] font-bold text-[#003366]">{topicTotal} Qs</span>
                                  <button
                                    type="button"
                                    className="cursor-pointer rounded-lg border-0 bg-transparent px-1 py-0.5 text-[16px] leading-none text-[#5A6B8C] transition-colors duration-150 hover:bg-[#FDF3F4] hover:text-[#C8202F] motion-reduce:transition-none"
                                    title={`Remove ${sel.topic}`}
                                    onClick={() => toggleSelection(sel.subject, sel.topic)}
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>

                              <div className="flex flex-col gap-2 rounded-2xl bg-[#F7F9FF] p-2.5">
                                {/* Single Option MCQ */}
                                <div className="flex items-center justify-between text-[12.5px] font-semibold text-[#003366]">
                                  <div className="flex items-center gap-1.5 text-[12.5px] font-bold text-[#003366]">
                                    <span className={cx('inline-block h-[7px] w-[7px] rounded-full', 'bg-[#0284C7]')} />
                                    <span>Single Option (MCQ)</span>
                                  </div>
                                  <div className="inline-flex items-center overflow-hidden rounded-xl border-[2px] border-[#003366] bg-white">
                                    <button
                                      type="button"
                                      className="grid h-[26px] w-[26px] cursor-pointer place-items-center border-0 bg-ice text-[14px] font-extrabold text-[#003366] transition-colors duration-150 hover:bg-soft/60 disabled:cursor-not-allowed disabled:text-[#C6D2F8] motion-reduce:transition-none"
                                      disabled={mcq <= 0}
                                      onClick={() => handleCountStep(sel.subject, sel.topic, 'mcqCount', -1)}
                                    >
                                      −
                                    </button>
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      className="h-[26px] w-[38px] border-x border-[#003366]/15 bg-white text-center text-[12.5px] font-extrabold text-[#003366] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                      value={mcq}
                                      onChange={(e) =>
                                        handleCountChange(sel.subject, sel.topic, 'mcqCount', parseInt(e.target.value, 10))
                                      }
                                    />
                                    <button
                                      type="button"
                                      className="grid h-[26px] w-[26px] cursor-pointer place-items-center border-0 bg-ice text-[14px] font-extrabold text-[#003366] transition-colors duration-150 hover:bg-soft/60 disabled:cursor-not-allowed disabled:text-[#C6D2F8] motion-reduce:transition-none"
                                      onClick={() => handleCountStep(sel.subject, sel.topic, 'mcqCount', 1)}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                {/* Multi-correct MCQ (JEE Advanced only) */}
                                {examType === 'Advanced' && (
                                  <div className="flex items-center justify-between text-[12.5px] font-semibold text-[#003366]">
                                    <div className="flex items-center gap-1.5 text-[12.5px] font-bold text-[#003366]">
                                      <span className={cx('inline-block h-[7px] w-[7px] rounded-full', 'bg-[#D97706]')} />
                                      <span>Multi-Correct MCQ</span>
                                    </div>
                                    <div className="inline-flex items-center overflow-hidden rounded-xl border-[2px] border-[#003366] bg-white">
                                      <button
                                        type="button"
                                        className="grid h-[26px] w-[26px] cursor-pointer place-items-center border-0 bg-ice text-[14px] font-extrabold text-[#003366] transition-colors duration-150 hover:bg-soft/60 disabled:cursor-not-allowed disabled:text-[#C6D2F8] motion-reduce:transition-none"
                                        disabled={multi <= 0}
                                        onClick={() => handleCountStep(sel.subject, sel.topic, 'multiCount', -1)}
                                      >
                                        −
                                      </button>
                                      <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        className="h-[26px] w-[38px] border-x border-[#003366]/15 bg-white text-center text-[12.5px] font-extrabold text-[#003366] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        value={multi}
                                        onChange={(e) =>
                                          handleCountChange(sel.subject, sel.topic, 'multiCount', parseInt(e.target.value, 10))
                                        }
                                      />
                                      <button
                                        type="button"
                                        className="grid h-[26px] w-[26px] cursor-pointer place-items-center border-0 bg-ice text-[14px] font-extrabold text-[#003366] transition-colors duration-150 hover:bg-soft/60 disabled:cursor-not-allowed disabled:text-[#C6D2F8] motion-reduce:transition-none"
                                        onClick={() => handleCountStep(sel.subject, sel.topic, 'multiCount', 1)}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Integer / Numerical (JEE Main & Advanced only) */}
                                {examType !== 'NEET' && (
                                  <div className="flex items-center justify-between text-[12.5px] font-semibold text-[#003366]">
                                    <div className="flex items-center gap-1.5 text-[12.5px] font-bold text-[#003366]">
                                      <span className={cx('inline-block h-[7px] w-[7px] rounded-full', 'bg-accent')} />
                                      <span>Integer / Numerical</span>
                                    </div>
                                    <div className="inline-flex items-center overflow-hidden rounded-xl border-[2px] border-[#003366] bg-white">
                                      <button
                                        type="button"
                                        className="grid h-[26px] w-[26px] cursor-pointer place-items-center border-0 bg-ice text-[14px] font-extrabold text-[#003366] transition-colors duration-150 hover:bg-soft/60 disabled:cursor-not-allowed disabled:text-[#C6D2F8] motion-reduce:transition-none"
                                        disabled={integer <= 0}
                                        onClick={() => handleCountStep(sel.subject, sel.topic, 'integerCount', -1)}
                                      >
                                        −
                                      </button>
                                      <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        className="h-[26px] w-[38px] border-x border-[#003366]/15 bg-white text-center text-[12.5px] font-extrabold text-[#003366] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        value={integer}
                                        onChange={(e) =>
                                          handleCountChange(sel.subject, sel.topic, 'integerCount', parseInt(e.target.value, 10))
                                        }
                                      />
                                      <button
                                        type="button"
                                        className="grid h-[26px] w-[26px] cursor-pointer place-items-center border-0 bg-ice text-[14px] font-extrabold text-[#003366] transition-colors duration-150 hover:bg-soft/60 disabled:cursor-not-allowed disabled:text-[#C6D2F8] motion-reduce:transition-none"
                                        onClick={() => handleCountStep(sel.subject, sel.topic, 'integerCount', 1)}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Matrix Match / Match the List */}
                                <div className="flex items-center justify-between text-[12.5px] font-semibold text-[#003366]">
                                  <div className="flex items-center gap-1.5 text-[12.5px] font-bold text-[#003366]">
                                    <span className="inline-block h-[7px] w-[7px] rounded-full bg-[#9333EA]" />
                                    <span>Matrix Match (List)</span>
                                  </div>
                                  <div className="inline-flex items-center overflow-hidden rounded-xl border-[2px] border-[#003366] bg-white">
                                    <button
                                      type="button"
                                      className="grid h-[26px] w-[26px] cursor-pointer place-items-center border-0 bg-ice text-[14px] font-extrabold text-[#003366] transition-colors duration-150 hover:bg-soft/60 disabled:cursor-not-allowed disabled:text-[#C6D2F8] motion-reduce:transition-none"
                                      disabled={matrix <= 0}
                                      onClick={() => handleCountStep(sel.subject, sel.topic, 'matrixCount', -1)}
                                    >
                                      −
                                    </button>
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      className="h-[26px] w-[38px] border-x border-[#003366]/15 bg-white text-center text-[12.5px] font-extrabold text-[#003366] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                      value={matrix}
                                      onChange={(e) =>
                                        handleCountChange(sel.subject, sel.topic, 'matrixCount', parseInt(e.target.value, 10))
                                      }
                                    />
                                    <button
                                      type="button"
                                      className="grid h-[26px] w-[26px] cursor-pointer place-items-center border-0 bg-ice text-[14px] font-extrabold text-[#003366] transition-colors duration-150 hover:bg-soft/60 disabled:cursor-not-allowed disabled:text-[#C6D2F8] motion-reduce:transition-none"
                                      onClick={() => handleCountStep(sel.subject, sel.topic, 'matrixCount', 1)}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mt-3.5 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#5A2560] bg-grad px-4 py-2 text-[13px] font-extrabold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[3px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                      disabled={
                        creating ||
                        selections.length === 0 ||
                        (selections.length > 0 && totalCalculatedCount !== questionCount) ||
                        (examType !== 'Advanced' && difficultyMode === 'custom' && totalDifficultyPct !== 100)
                      }
                    >
                      {creating
                        ? 'Starting generation…'
                        : selections.length > 0 && totalCalculatedCount > questionCount
                        ? `Overflow: Reduce ${totalCalculatedCount - questionCount} Q(s) in Topics`
                        : selections.length > 0 && totalCalculatedCount < questionCount
                        ? `Add ${questionCount - totalCalculatedCount} more Q(s) to match ${questionCount}`
                        : examType !== 'Advanced' && difficultyMode === 'custom' && totalDifficultyPct !== 100
                        ? `Normalize % to 100% (currently ${totalDifficultyPct}%)`
                        : `Generate ${questionCount}-Question Verified Paper`}
                    </button>
                  </div>
                </form>
              )}

              <section className="rounded-[28px] border border-[#003366]/10 bg-white p-5 shadow-[0_24px_56px_-36px_rgba(0,51,102,.45)] sm:p-6">
                <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2.5 font-display text-[17px] font-extrabold text-[#003366]">
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
                                <span className="rounded-[4px] bg-ice px-1.5 py-px text-[11px] font-bold text-[#003366]">
                                  🏛️ {p.organization}
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
                                    ? 'Generating…'
                                    : 'Error'}
                              </span>
                              <span>{dateStr}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#5A2560] bg-grad px-4 py-2 text-[13px] font-extrabold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[3px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                              onClick={() => void handleOpenPaper(p.id)}
                            >
                              Open / Edit
                            </button>
                            {p.status === 'ready' && (
                              <>
                                <Link
                                  href={`/faculty/papers/${p.id}/print?mode=questions&download=1`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-accent bg-white px-3 py-1.5 text-[12.5px] font-extrabold text-accent no-underline shadow-[0_4px_0_#E2C2F0] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#E2C2F0] active:translate-y-[3px] active:shadow-[0_1px_0_#E2C2F0] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                                >
                                  PDF: Questions
                                </Link>
                                <Link
                                  href={`/faculty/papers/${p.id}/print?mode=solutions&download=1`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-accent bg-white px-3 py-1.5 text-[12.5px] font-extrabold text-accent no-underline shadow-[0_4px_0_#E2C2F0] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#E2C2F0] active:translate-y-[3px] active:shadow-[0_1px_0_#E2C2F0] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                                >
                                  PDF: Solutions
                                </Link>
                                <Link
                                  href={`/faculty/papers/${p.id}/print?mode=key&download=1`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-accent bg-white px-3 py-1.5 text-[12.5px] font-extrabold text-accent no-underline shadow-[0_4px_0_#E2C2F0] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#E2C2F0] active:translate-y-[3px] active:shadow-[0_1px_0_#E2C2F0] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                                >
                                  PDF: Key
                                </Link>
                              </>
                            )}
                            <button
                              type="button"
                              className="cursor-pointer rounded-xl border border-[#C8202F]/30 bg-white px-2.5 py-1.5 text-[12px] font-bold text-[#C8202F] transition-colors duration-150 hover:bg-[#FDF3F4] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
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
    </div>
  );
}
