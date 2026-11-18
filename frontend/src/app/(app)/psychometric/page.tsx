'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';

type ViewMode = 'intro' | 'exam' | 'report';

interface QuestionItem {
  id: string;
  section: string;
  construct: string;
  subFacet?: string;
  itemType: string;
  scenarioText?: string;
  promptText: string;
  options?: Array<{ id: string; text: string }>;
  correctAnswer?: string;
  isReverseKeyed?: boolean;
  orderIndex: number;
}

interface SectionData {
  id: string;
  name: string;
  description: string;
  timeLimitSeconds?: number;
  items: QuestionItem[];
}

interface ExamData {
  id: string;
  title: string;
  description: string;
  generatedByAi: boolean;
  sections: SectionData[];
}

interface StreamFit {
  stream: string;
  category: 'Engineering' | 'Medical' | 'Interdisciplinary' | 'Research';
  matchPct: number;
  description: string;
  recommendedFocus: string;
}

interface ReportData {
  id: string;
  cognitivePercentile: number;
  cognitiveBreakdown: {
    numerical: number;
    logical: number;
    abstract: number;
    spatial: number;
  };
  oceanProfile: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    emotionalStability: number;
  };
  honestyHumility: number;
  testAnxietyIndex: number;
  academicResilience: number;
  sjtCompetencies: {
    decisionMaking: number;
    academicEthics: number;
    stressTolerance: number;
  };
  riasecCode: string;
  riasecScores: {
    R: number;
    I: number;
    A: number;
    S: number;
    E: number;
    C: number;
  };
  streamRecommendations: StreamFit[];
  studyHabitAdvice: string[];
  burnoutRisk: 'low' | 'moderate' | 'high';
  facultyAdvice: string;
  createdAt: string;
}

const LIKERT_5 = [
  { val: '1', label: 'Strongly Disagree', color: '#E11D48', bg: '#FFE4E6' },
  { val: '2', label: 'Disagree', color: '#EA580C', bg: '#FFEDD5' },
  { val: '3', label: 'Partially Agree', color: '#D97706', bg: '#FEF3C7' },
  { val: '4', label: 'Agree', color: '#059669', bg: '#D1FAE5' },
  { val: '5', label: 'Strongly Agree', color: '#803688', bg: '#F5E6F8' },
];

const FREQUENCY_SCALE = [
  { val: '1', label: 'Never', color: '#059669', bg: '#D1FAE5' },
  { val: '2', label: 'Rarely', color: '#0284C7', bg: '#E0F2FE' },
  { val: '3', label: 'Sometimes', color: '#D97706', bg: '#FEF3C7' },
  { val: '4', label: 'Often', color: '#EA580C', bg: '#FFEDD5' },
  { val: '5', label: 'Always', color: '#E11D48', bg: '#FFE4E6' },
];

const EFFECTIVENESS_SCALE = [
  { val: '1', label: 'Very Bad Idea', color: '#E11D48', bg: '#FFE4E6' },
  { val: '2', label: 'Not Very Helpful', color: '#EA580C', bg: '#FFEDD5' },
  { val: '3', label: 'Helpful & Good', color: '#059669', bg: '#D1FAE5' },
  { val: '4', label: 'Super Effective', color: '#803688', bg: '#F5E6F8' },
];

const PASSION_SCALE = [
  { val: '1', label: 'Not Interested', color: '#64748B', bg: '#F1F5F9' },
  { val: '2', label: 'A Little Curious', color: '#0284C7', bg: '#E0F2FE' },
  { val: '3', label: 'Interested', color: '#059669', bg: '#D1FAE5' },
  { val: '4', label: 'Love It / Passionate', color: '#803688', bg: '#F5E6F8' },
];

export default function PsychometricPage() {
  const user = getUser();
  const [view, setView] = useState<ViewMode>('intro');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Exam taking state
  const [exam, setExam] = useState<ExamData | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [activeSecIdx, setActiveSecIdx] = useState(0);
  const [activeQIdx, setActiveQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [savingStatus, setSavingStatus] = useState<string>('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Completed report state
  const [report, setReport] = useState<ReportData | null>(null);

  // Check if report already exists on initial load
  useEffect(() => {
    async function checkExisting() {
      try {
        const rep = await api.psychometric.getReport();
        if (rep) {
          setReport(rep as unknown as ReportData);
        }
      } catch {
        // No report yet
      }
    }
    checkExisting();
  }, []);

  async function handleStartExam() {
    setLoading(true);
    setError('');
    try {
      const data = await api.psychometric.getSession(user?.targetExam || 'Main');
      setExam(data.exam);
      setSessionId(data.session.id);
      setView('exam');
      setActiveSecIdx(0);
      setActiveQIdx(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to launch test');
    } finally {
      setLoading(false);
    }
  }

  const currentSection = exam?.sections[activeSecIdx];
  const allItems = useMemo(() => {
    return exam?.sections.flatMap((s) => s.items) ?? [];
  }, [exam]);

  const currentItem = currentSection?.items[activeQIdx];

  const totalAnswered = useMemo(() => {
    return Object.keys(answers).length;
  }, [answers]);

  const unansweredCount = Math.max(0, allItems.length - totalAnswered);

  async function handleSelectAnswer(val: string) {
    if (!currentItem || !sessionId) return;
    setAnswers((prev) => ({ ...prev, [currentItem.id]: val }));

    try {
      setSavingStatus('Saving...');
      await api.psychometric.saveAnswer({
        sessionId,
        item: currentItem as unknown as Record<string, unknown>,
        answer: val,
      });
      setSavingStatus('Saved');
      setTimeout(() => setSavingStatus(''), 1500);
    } catch {
      setSavingStatus('Offline (saved locally)');
    }
  }

  async function handleSubmitFinal() {
    if (!sessionId) return;
    setLoading(true);
    setError('');
    try {
      const rep = await api.psychometric.submit(sessionId);
      setReport(rep as unknown as ReportData);
      setView('report');
      setShowSubmitModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit test');
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------------------------------
  // VIEW 1: INTRO & BRIEFING
  // --------------------------------------------------------------------------
  if (view === 'intro') {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Top Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1B4B] via-[#311042] to-[#803688] p-8 text-white shadow-xl sm:p-12">
          <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              For Students in Class 6 to 12 & Droppers
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Student Mindset & Career Guidance Test
            </h1>
            <p className="mt-3 text-base text-purple-100/90 leading-relaxed">
              Discover your brain strengths, daily study habits, exam confidence, and best college career streams in just 15 minutes.
              No complex formulas—just fun puzzles and real everyday school situations!
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleStartExam}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-extrabold text-[#1E1B4B] shadow-lg transition hover:bg-purple-50 active:scale-95 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1E1B4B] border-t-transparent" />
                    Preparing Your Test Questions...
                  </>
                ) : (
                  <>
                    <span>Start Your Test</span>
                    <span>→</span>
                  </>
                )}
              </button>

              {report && (
                <button
                  type="button"
                  onClick={() => setView('report')}
                  className="rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  View Your Latest Report
                </button>
              )}
            </div>

            {error && <p className="mt-4 text-xs font-semibold text-rose-300">{error}</p>}
          </div>
        </div>

        {/* Section Breakdown Grid */}
        <div className="mt-10">
          <h2 className="text-xl font-extrabold text-[#003366]">What This Test Measures</h2>
          <p className="text-sm text-[#5A6B8C]">
            A complete 5-part assessment designed specifically for Indian school and competitive exam students:
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                num: '01',
                title: 'Brain Puzzles & Quick Logic',
                framework: 'Mental Speed & Problem Solving',
                desc: 'Fun number patterns, shape sequences, class rankings, and dice puzzles that test your quick thinking.',
                badge: 'Brain Teasers',
                color: '#3B82F6',
              },
              {
                num: '02',
                title: 'Daily Study Habits & Focus',
                framework: 'How You Study at Home',
                desc: 'How you handle mobile phone distractions, mistake notebooks, asking doubts, and helping classmates.',
                badge: 'Daily Habits',
                color: '#803688',
              },
              {
                num: '03',
                title: 'What Would You Do? (Real Situations)',
                framework: 'Smart Exam Decisions',
                desc: 'Handling exam time running out, peer pressure to copy, and bouncing back after silly mistakes.',
                badge: 'Real Scenarios',
                color: '#D97706',
              },
              {
                num: '04',
                title: 'Exam Tension & Confidence',
                framework: 'Staying Cool Under Pressure',
                desc: 'Understanding pre-exam butterflies, blanking out on formulas, and recovering fast after low marks.',
                badge: 'Exam Composure',
                color: '#E11D48',
              },
              {
                num: '05',
                title: 'Your Interests & Dream Careers',
                framework: 'Discover Your Best College Branch',
                desc: 'Explore what you love most: Coding & Games, Robots, Doctors/Medicine, Space Rockets (ISRO), or Business.',
                badge: 'Career Match',
                color: '#059669',
              },
              {
                num: '06',
                title: 'Teacher & Mentor Guidance',
                framework: 'Friendly Advice for Parents & Teachers',
                desc: 'Clear, personalized study tips and guidance notes to help your teachers and mentors guide you better.',
                badge: 'Mentor Tips',
                color: '#4F46E5',
              },
            ].map((card) => (
              <div
                key={card.num}
                className="group relative rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#8A97AC]">{card.num}</span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                    style={{ background: `${card.color}15`, color: card.color }}
                  >
                    {card.badge}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-base font-bold text-[#1B254B]">{card.title}</h3>
                <span className="block text-[11px] font-semibold text-[#803688]">{card.framework}</span>
                <p className="mt-2 text-xs leading-relaxed text-[#5A6B8C]">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // VIEW 2: INTERACTIVE LIVE EXAM RUNNER
  // --------------------------------------------------------------------------
  if (view === 'exam' && exam && currentSection && currentItem) {
    const isCognitive = currentSection.id === 'sec_cognitive';
    const hasScenario = currentItem.scenarioText != null && currentItem.scenarioText.length > 0;

    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#F5E6F8] px-2.5 py-0.5 text-xs font-extrabold text-[#803688]">
                {currentSection.name}
              </span>
              {exam.generatedByAi && (
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  LIVE FRESH
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-[#5A6B8C]">{currentSection.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#5A6B8C]">
              Answered: <strong className="text-[#803688]">{totalAnswered}</strong> / {allItems.length}
            </span>
            <span className="text-xs font-semibold text-emerald-600">{savingStatus}</span>
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-bold text-rose-700 shadow-sm transition hover:bg-rose-100 flex items-center gap-1.5 active:scale-95"
            >
              <span>🛑</span>
              <span>End Exam</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Pills */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {exam.sections.map((sec, sIdx) => {
            const secAnswered = sec.items.filter((it) => answers[it.id] != null).length;
            const isDone = secAnswered === sec.items.length;
            const isCurr = sIdx === activeSecIdx;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  setActiveSecIdx(sIdx);
                  setActiveQIdx(0);
                }}
                className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  isCurr
                    ? 'bg-[#1E1B4B] text-white shadow-sm'
                    : isDone
                    ? 'bg-[#E3F6ED] text-[#008060]'
                    : 'bg-white text-[#5A6B8C] hover:bg-slate-100 border border-[#E2E8F0]'
                }`}
              >
                {sec.name.split('.')[1] || sec.name} ({secAnswered}/{sec.items.length})
              </button>
            );
          })}
        </div>

        {/* Main Question Card */}
        <div className="mt-6 rounded-3xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-sm">
          {/* Header indicator */}
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#8A97AC]">
                Question {activeQIdx + 1} of {currentSection.items.length}
              </span>
              {currentItem.subFacet && (
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-[#5A6B8C]">
                  {currentItem.subFacet}
                </span>
              )}
            </div>
            {isCognitive && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                ⏱ Quick Thinking Puzzle
              </span>
            )}
          </div>

          {/* Scenario Callout if Scenario exists */}
          {hasScenario && currentItem.scenarioText && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
              <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800">
                <span>📋</span>
                <span>EVERYDAY SCHOOL & EXAM SITUATION</span>
              </div>
              <p className="mt-2 text-sm text-amber-950 leading-relaxed font-medium">
                {currentItem.scenarioText}
              </p>
            </div>
          )}

          {/* Prompt Statement */}
          <div className="mt-6">
            <h3 className="font-display text-base sm:text-lg font-bold text-[#1B254B] leading-relaxed">
              {currentItem.promptText}
            </h3>
          </div>

          {/* Diverse Answer Inputs based on Question Format */}
          <div className="mt-8">
            {/* 1. OCCASIONAL 5-POINT AGREEMENT SCALE (Comes only on 1-2 select questions) */}
            {(currentItem.itemType === 'AGREEMENT_LIKERT' || currentItem.itemType === 'LIKERT_5') && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold tracking-wide uppercase text-[#8A97AC]">
                    How much do you agree with this statement?
                  </p>
                  <span className="text-[11px] font-semibold text-[#803688] bg-[#F5E6F8] px-2 py-0.5 rounded-full">
                    Your Opinion
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-5">
                  {LIKERT_5.map((opt) => {
                    const selected = answers[currentItem.id] === opt.val;
                    return (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => handleSelectAnswer(opt.val)}
                        className={`group relative flex sm:flex-col items-center justify-between sm:justify-center rounded-2xl p-4 text-center transition ${
                          selected
                            ? 'ring-2 ring-offset-2 ring-[#803688] font-extrabold shadow-sm'
                            : 'border border-[#E2E8F0] bg-white hover:bg-slate-50'
                        }`}
                        style={{ backgroundColor: selected ? opt.bg : undefined }}
                      >
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold sm:mb-2"
                          style={{
                            backgroundColor: selected ? opt.color : '#F1F5F9',
                            color: selected ? '#FFFFFF' : '#64748B',
                          }}
                        >
                          {opt.val}
                        </span>
                        <span className="text-xs font-bold leading-tight" style={{ color: selected ? opt.color : '#334155' }}>
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. SCENARIO ACTION MCQS / PREFERENCE CHOICES / COGNITIVE PUZZLES */}
            {(currentItem.itemType === 'SCENARIO_ACTION_MCQ' ||
              currentItem.itemType === 'PREFERENCE_CHOICE' ||
              currentItem.itemType === 'COGNITIVE_MCQ') &&
              currentItem.options && (
                <div>
                  <p className="mb-3 text-xs font-bold tracking-wide uppercase text-[#8A97AC]">
                    {currentItem.itemType === 'SCENARIO_ACTION_MCQ'
                      ? 'What would you do in this situation?'
                      : currentItem.itemType === 'PREFERENCE_CHOICE'
                      ? 'Which approach best describes you?'
                      : 'Choose the correct answer:'}
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {currentItem.options.map((opt) => {
                      const selected = answers[currentItem.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectAnswer(opt.id)}
                          className={`flex items-start gap-4 rounded-2xl p-4 text-left transition ${
                            selected
                              ? 'border-2 border-[#803688] bg-[#F5E6F8] font-bold shadow-sm'
                              : 'border border-[#E2E8F0] bg-white hover:bg-slate-50'
                          }`}
                        >
                          <span
                            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                              selected ? 'bg-[#803688] text-white shadow-sm' : 'bg-slate-100 text-[#5A6B8C]'
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span className="text-sm text-[#1B254B] pt-1 leading-relaxed">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* 3. FREQUENCY SCALE (Study Habits & Exam Reaction Frequency) */}
            {currentItem.itemType === 'FREQUENCY_SCALE' && (
              <div>
                <p className="mb-3 text-xs font-bold tracking-wide uppercase text-[#8A97AC]">
                  How often does this happen with you?
                </p>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-5">
                  {FREQUENCY_SCALE.map((opt) => {
                    const selected = answers[currentItem.id] === opt.val;
                    return (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => handleSelectAnswer(opt.val)}
                        className={`flex sm:flex-col items-center justify-between sm:justify-center rounded-2xl p-4 text-center transition ${
                          selected
                            ? 'ring-2 ring-offset-2 ring-emerald-600 font-extrabold shadow-sm'
                            : 'border border-[#E2E8F0] bg-white hover:bg-slate-50'
                        }`}
                        style={{ backgroundColor: selected ? opt.bg : undefined }}
                      >
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold sm:mb-2"
                          style={{
                            backgroundColor: selected ? opt.color : '#F1F5F9',
                            color: selected ? '#FFFFFF' : '#64748B',
                          }}
                        >
                          {opt.val}
                        </span>
                        <span className="text-xs font-bold" style={{ color: selected ? opt.color : '#334155' }}>
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. STRATEGY EFFECTIVENESS RATING */}
            {currentItem.itemType === 'EFFECTIVENESS_SCALE' && (
              <div>
                <p className="mb-3 text-xs font-bold tracking-wide uppercase text-[#8A97AC]">
                  What do you think of this idea / strategy?
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                  {EFFECTIVENESS_SCALE.map((opt) => {
                    const selected = answers[currentItem.id] === opt.val;
                    return (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => handleSelectAnswer(opt.val)}
                        className={`flex items-center justify-between rounded-2xl p-4 transition ${
                          selected
                            ? 'ring-2 ring-offset-2 ring-[#803688] font-extrabold shadow-sm'
                            : 'border border-[#E2E8F0] bg-white hover:bg-slate-50'
                        }`}
                        style={{ backgroundColor: selected ? opt.bg : undefined }}
                      >
                        <span className="text-xs font-bold" style={{ color: selected ? opt.color : '#334155' }}>
                          {opt.label}
                        </span>
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: selected ? opt.color : '#CBD5E1' }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. PASSION & INTEREST SCALE */}
            {currentItem.itemType === 'PASSION_SCALE' && (
              <div>
                <p className="mb-3 text-xs font-bold tracking-wide uppercase text-[#8A97AC]">
                  How interested are you in this activity or field?
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                  {PASSION_SCALE.map((opt) => {
                    const selected = answers[currentItem.id] === opt.val;
                    return (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => handleSelectAnswer(opt.val)}
                        className={`flex flex-col items-center justify-center rounded-2xl p-4 text-center transition ${
                          selected
                            ? 'ring-2 ring-offset-2 ring-purple-600 font-extrabold shadow-sm'
                            : 'border border-[#E2E8F0] bg-white hover:bg-slate-50'
                        }`}
                        style={{ backgroundColor: selected ? opt.bg : undefined }}
                      >
                        <span className="text-xl mb-1">
                          {opt.val === '1' ? '⚪' : opt.val === '2' ? '🔍' : opt.val === '3' ? '⭐' : '🔥'}
                        </span>
                        <span className="text-xs font-bold" style={{ color: selected ? opt.color : '#334155' }}>
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="mt-10 flex items-center justify-between border-t border-[#F1F5F9] pt-6">
            <button
              type="button"
              disabled={activeQIdx === 0 && activeSecIdx === 0}
              onClick={() => {
                if (activeQIdx > 0) {
                  setActiveQIdx((q) => q - 1);
                } else if (activeSecIdx > 0) {
                  const prevSec = exam.sections[activeSecIdx - 1];
                  setActiveSecIdx((s) => s - 1);
                  setActiveQIdx((prevSec?.items.length ?? 1) - 1);
                }
              }}
              className="rounded-xl border border-[#D6DCE7] bg-white px-5 py-2.5 text-xs font-bold text-[#5A6B8C] transition hover:bg-slate-50 disabled:opacity-30"
            >
              ← Previous
            </button>

            {/* End Exam Button Always Accessible */}
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>🛑</span>
              <span>End Exam</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (activeQIdx < currentSection.items.length - 1) {
                  setActiveQIdx((q) => q + 1);
                } else if (activeSecIdx < exam.sections.length - 1) {
                  setActiveSecIdx((s) => s + 1);
                  setActiveQIdx(0);
                } else {
                  setShowSubmitModal(true);
                }
              }}
              className="rounded-xl bg-[#1E1B4B] px-6 py-2.5 text-xs font-extrabold text-white shadow transition hover:bg-[#311042]"
            >
              {activeQIdx < currentSection.items.length - 1 || activeSecIdx < exam.sections.length - 1
                ? 'Next Question →'
                : 'Review & Submit Test'}
            </button>
          </div>
        </div>

        {/* Confirmation & Warning Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${
                    unansweredCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-[#803688]'
                  }`}
                >
                  <span className="text-xl">{unansweredCount > 0 ? '⚠️' : '🎓'}</span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-extrabold text-[#1B254B]">
                    {unansweredCount > 0 ? 'End Exam With Unanswered Questions?' : 'End & Submit Exam?'}
                  </h3>
                  <p className="text-xs text-[#5A6B8C]">
                    Student Mindset & Career Guidance Test
                  </p>
                </div>
              </div>

              {/* Warning Alert if questions are left unanswered */}
              {unansweredCount > 0 ? (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800">
                    <span>⚠️</span>
                    <span>WARNING: SOME QUESTIONS ARE NOT SUBMITTED</span>
                  </div>
                  <p className="mt-1.5 text-xs text-amber-950 leading-relaxed font-medium">
                    You have <strong>{unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}</strong> out of {allItems.length} total questions.
                    If you end the exam now, unanswered questions will not be evaluated and your report will be generated using only your answered responses.
                  </p>

                  <div className="mt-3 flex items-center gap-2 pt-2 border-t border-amber-200/60 text-xs font-bold">
                    <span className="rounded-lg bg-emerald-100 text-emerald-800 px-2.5 py-1">
                      ✓ Answered: {totalAnswered}
                    </span>
                    <span className="rounded-lg bg-rose-100 text-rose-800 px-2.5 py-1">
                      ✗ Unanswered: {unansweredCount}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs text-emerald-950 font-semibold leading-relaxed">
                    🎉 <strong>Great job!</strong> You have answered all <strong>{allItems.length}</strong> questions.
                    Submitting will analyze your responses and generate your personalized guidance report.
                  </p>
                </div>
              )}

              <p className="mt-4 text-xs text-[#5A6B8C] leading-relaxed">
                Are you sure you want to end the test and exit to your results?
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  ← Continue Test
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubmitModal(false);
                      setView('intro');
                    }}
                    className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-rose-600 transition"
                    title="Exit to home screen"
                  >
                    Exit Without Submitting
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitFinal}
                    disabled={loading}
                    className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-rose-700 transition active:scale-95 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-1.5">
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Submitting...
                      </span>
                    ) : (
                      'Yes, End Exam & Submit'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // VIEW 3: FULL COMPREHENSIVE DIAGNOSTIC REPORT
  // --------------------------------------------------------------------------
  if (view === 'report' && report) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Report Top Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1B4B] to-[#4C1D95] p-8 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <span>🎓</span>
                <span>Student Mindset & Career Guidance Report</span>
              </span>
              <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight">
                {user?.name || 'Student'}&apos;s Personal Discovery Report
              </h1>
              <p className="mt-1 text-xs text-purple-200">
                Target: {user?.targetExam || 'School / JEE / NEET'} · Completed on{' '}
                {new Date(report.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3.5 text-center backdrop-blur-sm border border-white/10">
                <span className="block text-[10px] font-bold tracking-wider uppercase text-purple-200">
                  Career Match Code
                </span>
                <span className="font-mono text-2xl font-extrabold text-white">{report.riasecCode}</span>
              </div>
              <button
                type="button"
                onClick={() => setView('intro')}
                className="rounded-xl bg-white/15 px-4 py-3 text-xs font-bold text-white transition hover:bg-white/25"
              >
                Retake Test
              </button>
            </div>
          </div>
        </div>

        {/* 4 High-Level Metric Tiles */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold text-[#8A97AC] uppercase tracking-wider">Brain Sharpness</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-[#1B254B]">{report.cognitivePercentile}</span>
              <span className="text-xs font-bold text-[#803688]">th %ile</span>
            </div>
            <p className="mt-1 text-[11px] text-[#5A6B8C]">Speed & quick logic thinking</p>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold text-[#8A97AC] uppercase tracking-wider">Bounce-Back Power</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-emerald-600">{report.academicResilience}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <p className="mt-1 text-[11px] text-[#5A6B8C]">Cheering up after low marks</p>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold text-[#8A97AC] uppercase tracking-wider">Exam Hall Calmness</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span
                className={`text-3xl font-extrabold ${
                  report.testAnxietyIndex > 65
                    ? 'text-rose-600'
                    : report.testAnxietyIndex > 45
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {100 - report.testAnxietyIndex}
              </span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <p className="mt-1 text-[11px] text-[#5A6B8C]">
              {report.testAnxietyIndex > 65
                ? 'Gets nervous easily'
                : report.testAnxietyIndex > 45
                ? 'Normal exam butterflies'
                : 'Cool and steady composure'}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold text-[#8A97AC] uppercase tracking-wider">Honesty & Fair Play</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-[#803688]">{report.honestyHumility}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <p className="mt-1 text-[11px] text-[#5A6B8C]">Refusing to cheat or copy</p>
          </div>
        </div>

        {/* Detailed Breakdowns Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Card 1: Cognitive Aptitude Bars */}
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display text-base font-bold text-[#1B254B]">
                How Your Brain Solves Puzzles
              </h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Quick Thinking
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {[
                { label: 'Logical Deductions & Rankings', val: report.cognitiveBreakdown.logical, color: '#3B82F6' },
                { label: 'Number Patterns & Math Logic', val: report.cognitiveBreakdown.numerical, color: '#803688' },
                { label: 'Shape Sequences & Diagram Puzzles', val: report.cognitiveBreakdown.abstract, color: '#059669' },
                { label: '3D Shapes & Dice Visualization', val: report.cognitiveBreakdown.spatial, color: '#D97706' },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between text-xs font-bold text-[#1B254B] mb-1">
                    <span>{row.label}</span>
                    <span style={{ color: row.color }}>{row.val}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${row.val}%`, backgroundColor: row.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Big Five & Behavioral Work-Style */}
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display text-base font-bold text-[#1B254B]">
                Your Study Style & Focus Habits
              </h3>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                Daily Routine
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {[
                { label: 'Study Discipline & Homework Routine', val: report.oceanProfile.conscientiousness, color: '#803688' },
                { label: 'Curiosity to Learn New Concepts', val: report.oceanProfile.openness, color: '#3B82F6' },
                { label: 'Staying Calm Under Test Pressure', val: report.oceanProfile.emotionalStability, color: '#059669' },
                { label: 'Helping Friends & Sharing Notes', val: report.oceanProfile.agreeableness, color: '#0284C7' },
                { label: 'Asking Doubts & Speaking Up in Class', val: report.oceanProfile.extraversion, color: '#E11D48' },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between text-xs font-bold text-[#1B254B] mb-1">
                    <span>{row.label}</span>
                    <span style={{ color: row.color }}>{row.val}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${row.val}%`, backgroundColor: row.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Situational Judgment & Mentor Advice Analysis */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* SJT Competency Card */}
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h3 className="font-display text-base font-bold text-[#1B254B] border-b border-slate-100 pb-3">
              Handling Tricky School Situations
            </h3>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex justify-between text-xs font-bold text-[#1B254B]">
                  <span>Smart Exam Decisions</span>
                  <span className="text-[#803688]">{report.sjtCompetencies.decisionMaking}%</span>
                </div>
                <p className="mt-1 text-xs text-[#5A6B8C]">
                  Skipping time-wasting questions and solving easier questions first to grab guaranteed marks.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex justify-between text-xs font-bold text-[#1B254B]">
                  <span>Honesty & Fair Play</span>
                  <span className="text-emerald-600">{report.sjtCompetencies.academicEthics}%</span>
                </div>
                <p className="mt-1 text-xs text-[#5A6B8C]">
                  Saying no to cheating, leaked test papers, and preparing with true self-respect.
                </p>
              </div>
            </div>
          </div>

          {/* Faculty Advice Card */}
          <div className="rounded-3xl border border-purple-200 bg-gradient-to-br from-[#FAF5FF] to-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-[#803688]">
              <span>👨‍🏫</span>
              <span>TEACHER & MENTOR DIRECTIVE</span>
            </div>
            <h3 className="mt-2 font-display text-base font-bold text-[#1B254B]">
              Mentor Guidance for You
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-[#334155] font-medium bg-white p-4 rounded-2xl border border-purple-100 shadow-sm">
              &quot;{report.facultyAdvice}&quot;
            </p>
            <div className="mt-4 flex items-center justify-between text-xs font-bold">
              <span className="text-[#5A6B8C]">Study Stress Level:</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold uppercase ${
                  report.burnoutRisk === 'high'
                    ? 'bg-rose-100 text-rose-700'
                    : report.burnoutRisk === 'moderate'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {report.burnoutRisk === 'high' ? 'High Stress' : report.burnoutRisk === 'moderate' ? 'Moderate Stress' : 'Balanced & Calm'}
              </span>
            </div>
          </div>
        </div>

        {/* Career & Stream Fit Recommendations */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-extrabold text-[#003366]">
                Your Best Matching College & Career Streams
              </h2>
              <p className="text-xs text-[#5A6B8C]">
                Calculated based on what you enjoy doing and how your brain solves problems:
              </p>
            </div>
            <span className="text-xs font-bold text-[#803688] bg-[#F5E6F8] px-3 py-1 rounded-full">
              Stream Fit
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {report.streamRecommendations.slice(0, 4).map((stream) => (
              <div
                key={stream.stream}
                className="relative rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                    {stream.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-extrabold text-[#803688]">{stream.matchPct}%</span>
                    <span className="text-[11px] font-bold text-slate-400">Match</span>
                  </div>
                </div>

                <h4 className="mt-3 font-display text-base font-bold text-[#1B254B]">{stream.stream}</h4>
                <p className="mt-1 text-xs text-[#5A6B8C] leading-relaxed">{stream.description}</p>

                <div className="mt-4 rounded-xl bg-purple-50/70 p-3 text-xs text-[#803688]">
                  <strong>What to focus on in school:</strong> {stream.recommendedFocus}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized Study Habit Directives */}
        <div className="mt-10 rounded-3xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="font-display text-lg font-bold text-[#1B254B]">
            Simple Study Tips Just for You
          </h3>
          <p className="text-xs text-[#5A6B8C] mt-1">
            Helpful daily habits tailored to your study style and exam composure:
          </p>

          <div className="mt-6 space-y-3">
            {report.studyHabitAdvice.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#803688] text-xs font-bold text-white">
                  {idx + 1}
                </span>
                <p className="text-xs text-[#334155] leading-relaxed pt-0.5 font-medium">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
