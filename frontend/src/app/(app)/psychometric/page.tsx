'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';

export interface PsychometricCardDef {
  id: string;
  name: string;
  description: string;
  subtopics: string[];
  frameworks?: string[];
  bestFor: string;
  badge: string;
  estimatedMinutes: number;
}

export interface CandidateProfile {
  age: number;
  professionStatus: 'student' | 'employed' | 'job_seeker';
  studentLevel?: 'school' | 'intermediate' | 'ug' | 'pg';
  schoolClass?: 'class_4' | 'class_5' | 'class_6' | 'class_7' | 'class_8' | 'class_9' | 'class_10';
  stream?: string;
  jobTitle?: string;
  companyType?: string;
  highestQualification?: string;
  targetRole?: string;
}

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
  cardId?: string;
  title: string;
  description: string;
  generatedByAi: boolean;
  sections: SectionData[];
}

interface CareerDecision {
  summary: string;
  whatYouCanBecome: Array<{
    role: string;
    field: string;
    matchPct: number;
    whyYouFit: string;
  }>;
  coreStrengths: string[];
  workStyle: string;
  intentAndDrivers: string;
  actionableNextSteps: string[];
}

interface ReportData {
  id: string;
  sessionId: string;
  userId: string;
  cognitivePercentile: number;
  careerDecision?: CareerDecision;
  streamRecommendations?: unknown;
  createdAt: string;
}

type ViewState = 'hub' | 'exam' | 'report';

const LIKERT_5 = [
  { val: '1', label: 'Strongly Disagree', color: '#E11D48', bg: '#FFE4E6' },
  { val: '2', label: 'Disagree', color: '#EA580C', bg: '#FFEDD5' },
  { val: '3', label: 'Neutral', color: '#D97706', bg: '#FEF3C7' },
  { val: '4', label: 'Agree', color: '#059669', bg: '#D1FAE5' },
  { val: '5', label: 'Strongly Agree', color: '#2563EB', bg: '#DBEAFE' },
];

const FREQUENCY_SCALE = [
  { val: '1', label: 'Never', color: '#059669', bg: '#D1FAE5' },
  { val: '2', label: 'Rarely', color: '#0284C7', bg: '#E0F2FE' },
  { val: '3', label: 'Sometimes', color: '#D97706', bg: '#FEF3C7' },
  { val: '4', label: 'Often', color: '#EA580C', bg: '#FFEDD5' },
  { val: '5', label: 'Always', color: '#E11D48', bg: '#FFE4E6' },
];

const PASSION_SCALE = [
  { val: '1', label: 'Not Interested', color: '#64748B', bg: '#F1F5F9' },
  { val: '2', label: 'A Little Curious', color: '#0284C7', bg: '#E0F2FE' },
  { val: '3', label: 'Interested', color: '#059669', bg: '#D1FAE5' },
  { val: '4', label: 'Love It / Passionate', color: '#2563EB', bg: '#DBEAFE' },
];

export default function PsychometricPage() {
  const [view, setView] = useState<ViewState>('hub');
  const [cards, setCards] = useState<PsychometricCardDef[]>([]);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [saveNotice, setSaveNotice] = useState('');
  const [startingCardId, setStartingCardId] = useState<string | null>(null);

  const [profile, setProfile] = useState<CandidateProfile>({
    age: 16,
    professionStatus: 'student',
    studentLevel: 'school',
    schoolClass: 'class_10',
    stream: 'Science / Mathematics',
  });
  const [ageInput, setAgeInput] = useState<string>('16');

  const [exam, setExam] = useState<ExamData | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [activeQIdx, setActiveQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [savingStatus, setSavingStatus] = useState('');
  const [report, setReport] = useState<ReportData | null>(null);
  const [history, setHistory] = useState<
    Array<{
      sessionId: string;
      cardId: string;
      completedAt: string;
      whatYouCanBecome: Array<{
        role: string;
        field: string;
        matchPct: number;
        whyYouFit: string;
      }>;
    }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load cards and profile from localStorage / API on mount
  useEffect(() => {
    async function init() {
      try {
        const [cardsData, histData] = await Promise.all([
          api.psychometric.getCards().catch(() => []),
          api.psychometric.getHistory().catch(() => []),
        ]);
        if (cardsData && cardsData.length > 0) {
          setCards(cardsData);
        }
        if (histData && Array.isArray(histData)) {
          setHistory(histData);
        }
      } catch (err) {
        console.error('Failed to load assessment cards:', err);
      }

      // Check stored candidate profile
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('psychometric_candidate_profile') : null;
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed.age === 'number') {
            setProfile(parsed);
            setAgeInput(String(parsed.age));
            setProfileSaved(true);
          }
        }
      } catch {
        // Ignore local storage error
      }
    }
    init();
  }, []);

  const completedCardIds = useMemo(() => {
    return new Set(history.map((h) => h.cardId));
  }, [history]);

  function handleSaveProfile() {
    const ageNum = parseInt(ageInput, 10) || 16;
    const clampedAge = Math.max(6, Math.min(100, ageNum));
    const updated: CandidateProfile = {
      ...profile,
      age: clampedAge,
      schoolClass: profile.studentLevel === 'school' ? (profile.schoolClass || 'class_10') : undefined,
    };
    setProfile(updated);
    setAgeInput(String(clampedAge));
    setProfileSaved(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('psychometric_candidate_profile', JSON.stringify(updated));
      }
    } catch {
      // Ignore
    }
    setProfileModalOpen(false);
    setSaveNotice('Background details saved successfully. Select any assessment card below to begin.');
    setTimeout(() => setSaveNotice(''), 6000);
  }

  async function launchCardExam(card: PsychometricCardDef) {
    setStartingCardId(card.id);
    setLoading(true);
    setError('');
    try {
      const res = await api.psychometric.startCardSession({
        cardId: card.id,
        profile,
      });

      setExam(res.exam as ExamData);
      setSessionId(res.session.id);
      setAnswers({});
      setActiveQIdx(0);
      setView('exam');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to launch assessment');
    } finally {
      setLoading(false);
      setStartingCardId(null);
    }
  }

  function handleStartCardClick(card: PsychometricCardDef) {
    if (!profileSaved) {
      setProfileModalOpen(true);
      return;
    }
    launchCardExam(card);
  }

  const currentQuestions = useMemo(() => {
    return exam?.sections[0]?.items ?? [];
  }, [exam]);

  const currentQ = currentQuestions[activeQIdx];

  async function handleSelectAnswer(val: string) {
    if (!currentQ || !sessionId) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: val }));

    try {
      setSavingStatus('Saving...');
      await api.psychometric.saveAnswer({
        sessionId,
        item: currentQ as unknown as Record<string, unknown>,
        answer: val,
      });
      setSavingStatus('Saved');
      setTimeout(() => setSavingStatus(''), 1200);
    } catch {
      setSavingStatus('Saved locally');
    }
  }

  async function handleSubmitAssessment() {
    if (!sessionId) return;
    setLoading(true);
    setError('');
    try {
      const rep = await api.psychometric.submit(sessionId);
      const repData = rep as unknown as ReportData;
      setReport(repData);
      setView('report');
      // Refresh history
      api.psychometric.getHistory().then((h) => setHistory(h || [])).catch(() => {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit assessment');
    } finally {
      setLoading(false);
    }
  }

  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = currentQuestions.length > 0 && answeredCount >= currentQuestions.length;

  const schoolClassLabel = useMemo(() => {
    const map: Record<string, string> = {
      class_4: 'Class 4',
      class_5: 'Class 5',
      class_6: 'Class 6',
      class_7: 'Class 7',
      class_8: 'Class 8',
      class_9: 'Class 9',
      class_10: 'Class 10',
    };
    return map[profile.schoolClass || 'class_10'] || 'Class 10';
  }, [profile.schoolClass]);

  // --------------------------------------------------------------------------
  // VIEW: REPORT
  // --------------------------------------------------------------------------
  if (view === 'report' && report) {
    const career = report.careerDecision;
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header banner */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] p-8 text-white shadow-xl sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Assessment Complete
              </span>
              <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Your Career Intelligence & Decision Report
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Grounded advice and realistic career options matching your real-world thinking style.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setView('hub')}
              className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold tracking-wide text-white transition hover:bg-white/20"
            >
              Back to All Cards
            </button>
          </div>

          {/* Profile summary pill */}
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-slate-200">
            <span className="rounded-lg bg-white/10 px-3 py-1.5">Age: {profile.age}</span>
            <span className="rounded-lg bg-white/10 px-3 py-1.5 capitalize">Status: {profile.professionStatus.replace('_', ' ')}</span>
            {profile.professionStatus === 'student' && profile.studentLevel === 'school' && (
              <span className="rounded-lg bg-white/10 px-3 py-1.5">{schoolClassLabel}</span>
            )}
            {profile.professionStatus === 'student' && profile.studentLevel !== 'school' && profile.studentLevel && (
              <span className="rounded-lg bg-white/10 px-3 py-1.5 uppercase">Level: {profile.studentLevel}</span>
            )}
            {profile.stream && (
              <span className="rounded-lg bg-white/10 px-3 py-1.5">Stream: {profile.stream}</span>
            )}
            {profile.professionStatus === 'employed' && profile.jobTitle && (
              <span className="rounded-lg bg-white/10 px-3 py-1.5">Role: {profile.jobTitle}</span>
            )}
          </div>
        </div>

        {/* Core Summary */}
        {career?.summary && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Your Core Mindset & Thinking</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{career.summary}</p>
          </div>
        )}

        {/* Section: What You Can Become */}
        <div className="mt-8">
          <h2 className="text-xl font-extrabold text-slate-900">What You Can Become</h2>
          <p className="text-sm text-slate-500">Top career roles and work paths that directly fit your natural strengths.</p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(career?.whatYouCanBecome || []).map((role, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-400 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-extrabold text-blue-700">
                      {role.field}
                    </span>
                    <span className="text-sm font-extrabold text-emerald-600">{role.matchPct}% Match</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-slate-900">{role.role}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{role.whyYouFit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Strengths & Work Style Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Strengths */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Your Core Strengths</h3>
            <p className="text-xs text-slate-500">What you naturally do well when given a task.</p>
            <ul className="mt-4 space-y-2.5">
              {(career?.coreStrengths || []).map((str, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 leading-normal">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                    -
                  </span>
                  {str}
                </li>
              ))}
            </ul>
          </div>

          {/* Work Style & Drivers */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Workplace Style & Drivers</h3>
            <p className="text-xs text-slate-500">How you execute work and what keeps you going.</p>
            <div className="mt-4 space-y-4 text-xs text-slate-700">
              {career?.workStyle && (
                <div>
                  <span className="font-bold text-slate-900">How you work best: </span>
                  {career.workStyle}
                </div>
              )}
              {career?.intentAndDrivers && (
                <div>
                  <span className="font-bold text-slate-900">What motivates you: </span>
                  {career.intentAndDrivers}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actionable Next Steps */}
        {career?.actionableNextSteps && career.actionableNextSteps.length > 0 && (
          <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
            <h3 className="text-base font-bold text-emerald-950">Actionable Next Steps</h3>
            <p className="text-xs text-emerald-800">Clear, practical moves to build towards your ideal career roles.</p>
            <div className="mt-4 space-y-3">
              {career.actionableNextSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl bg-white p-3.5 shadow-sm text-xs text-slate-800">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-bold text-white text-[11px]">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
          <button
            type="button"
            onClick={() => setView('hub')}
            className="rounded-xl bg-[#003366] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#002244]"
          >
            Explore More Assessment Cards
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Print / Save Report (PDF)
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // VIEW: EXAM TAKING
  // --------------------------------------------------------------------------
  if (view === 'exam' && exam && currentQ) {
    const totalQ = currentQuestions.length;
    const progressPct = Math.round(((activeQIdx + 1) / totalQ) * 100);

    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
              {exam.title}
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900">
                Question {activeQIdx + 1} <span className="text-sm font-normal text-slate-400">of {totalQ}</span>
              </span>
              {savingStatus && (
                <span className="text-xs font-semibold text-emerald-600 transition-opacity">
                  - {savingStatus}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setView('hub')}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Exit Assessment
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Scenario text if provided and is a genuine multi-sentence context */}
          {currentQ.scenarioText &&
            currentQ.scenarioText.trim().length > 45 &&
            !/^think about|^consider how|^reflect on|^imagine how/i.test(currentQ.scenarioText.trim()) && (
              <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:p-5 text-xs sm:text-sm font-medium leading-relaxed text-blue-950">
                <span className="block font-bold text-blue-900 uppercase tracking-wider text-[11px] mb-1.5">
                  Real-World Scenario:
                </span>
                {currentQ.scenarioText}
              </div>
            )}

          {/* Subtopic & Framework pill */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {currentQ.construct && (
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                {currentQ.construct}
              </span>
            )}
            {currentQ.subFacet && (
              <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
                {currentQ.subFacet}
              </span>
            )}
          </div>

          {/* Prompt */}
          <h2 className="text-base font-semibold leading-relaxed text-slate-900 sm:text-lg">
            {currentQ.promptText}
          </h2>

          {/* Options Section */}
          <div className="mt-6">
            {/* Agreement Likert */}
            {currentQ.itemType === 'AGREEMENT_LIKERT' && (
              <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                {LIKERT_5.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.val;
                  return (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => handleSelectAnswer(opt.val)}
                      className={`flex-1 min-w-[120px] rounded-xl border px-3 py-3 text-center text-xs font-bold transition ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Frequency scale */}
            {currentQ.itemType === 'FREQUENCY_SCALE' && (
              <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                {FREQUENCY_SCALE.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.val;
                  return (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => handleSelectAnswer(opt.val)}
                      className={`flex-1 min-w-[100px] rounded-xl border px-3 py-3 text-center text-xs font-bold transition ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Passion scale */}
            {currentQ.itemType === 'PASSION_SCALE' && (
              <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                {PASSION_SCALE.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.val;
                  return (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => handleSelectAnswer(opt.val)}
                      className={`flex-1 min-w-[120px] rounded-xl border px-3 py-3 text-center text-xs font-bold transition ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Multiple Choice / Scenario Actions / Cognitive */}
            {(currentQ.itemType === 'COGNITIVE_MCQ' ||
              currentQ.itemType === 'SCENARIO_ACTION_MCQ' ||
              (!['AGREEMENT_LIKERT', 'FREQUENCY_SCALE', 'PASSION_SCALE'].includes(currentQ.itemType) &&
                currentQ.options &&
                currentQ.options.length > 0)) && (
              <div className="space-y-2.5">
                {(currentQ.options || []).map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectAnswer(opt.id)}
                      className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left text-xs font-medium leading-relaxed transition ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold'
                          : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {opt.id}
                      </span>
                      <span className="pt-0.5">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Nav Controls */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={activeQIdx === 0}
            onClick={() => setActiveQIdx((prev) => Math.max(0, prev - 1))}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
          >
            Previous
          </button>

          {activeQIdx < totalQ - 1 ? (
            <button
              type="button"
              onClick={() => setActiveQIdx((prev) => Math.min(totalQ - 1, prev + 1))}
              className="rounded-xl bg-[#003366] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#002244]"
            >
              Next Question
            </button>
          ) : (
            <button
              type="button"
              disabled={loading || !isAllAnswered}
              onClick={handleSubmitAssessment}
              className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Analyzing Your Responses...' : 'Submit & View Career Decision'}
            </button>
          )}
        </div>

        {error && <p className="mt-4 text-center text-xs text-rose-600">{error}</p>}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // VIEW: HUB (8 Modular Assessment Cards)
  // --------------------------------------------------------------------------
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#1D4E89] p-8 text-white shadow-xl sm:p-10">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            Candidate Intelligence & Career Decision Engine
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Modular Psychometric & Career Assessments
          </h1>
          <p className="mt-3 text-sm text-slate-200 leading-relaxed max-w-2xl">
            Save your background details once, then independently take any of the 8 modular cards below to evaluate your cognitive problem-solving, behavioral style, and what careers you fit best.
          </p>

          {/* Profile Active Status Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-100">
              <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold ${
                profileSaved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {profileSaved ? 'Profile Details Saved' : 'Profile Not Saved'}
              </span>
              <span className="rounded-lg bg-white/10 px-2.5 py-1">Age: {profile.age}</span>
              <span className="rounded-lg bg-white/10 px-2.5 py-1 capitalize">
                Status: {profile.professionStatus.replace('_', ' ')}
              </span>
              {profile.professionStatus === 'student' && profile.studentLevel === 'school' && (
                <span className="rounded-lg bg-white/10 px-2.5 py-1 font-bold text-sky-200">
                  {schoolClassLabel}
                </span>
              )}
              {profile.professionStatus === 'student' && profile.studentLevel !== 'school' && profile.studentLevel && (
                <span className="rounded-lg bg-white/10 px-2.5 py-1 uppercase">
                  Level: {profile.studentLevel}
                </span>
              )}
              {profile.stream && (
                <span className="rounded-lg bg-white/10 px-2.5 py-1">
                  Focus: {profile.stream}
                </span>
              )}
              {profile.professionStatus === 'employed' && profile.jobTitle && (
                <span className="rounded-lg bg-white/10 px-2.5 py-1">
                  Role: {profile.jobTitle}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setAgeInput(String(profile.age || 16));
                setProfileModalOpen(true);
              }}
              className="rounded-lg border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/25"
            >
              {profileSaved ? 'Edit Background Details' : 'Enter Background Details'}
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveNotice && (
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-900 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            <span>{saveNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveNotice('')}
            className="text-xs text-emerald-700 hover:text-emerald-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Cards Grid */}
      <div className="mt-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Choose an Assessment Card</h2>
            <p className="text-xs text-slate-500">
              Select any assessment card below. Each card is anchored in authoritative psychological frameworks and calibrated to your background.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {cards.length} Assessments Available
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, idx) => {
            const isCompleted = completedCardIds.has(card.id);
            const isStartingThis = startingCardId === card.id;

            return (
              <div
                key={card.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
                      {card.badge}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      ~{card.estimatedMinutes} mins
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-slate-900 leading-snug">
                    {idx + 1}. {card.name}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {card.description}
                  </p>

                  {/* Theoretical Frameworks Pill */}
                  {card.frameworks && card.frameworks.length > 0 && (
                    <div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50/70 p-2.5 text-[10px] text-indigo-950">
                      <span className="font-extrabold uppercase tracking-wider block text-[9px] text-indigo-600 mb-1">
                        Frameworks Used:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {card.frameworks.slice(0, 3).map((fw, fIdx) => (
                          <span
                            key={fIdx}
                            className="rounded bg-white/90 px-1.5 py-0.5 font-semibold text-indigo-800 shadow-2xs"
                          >
                            {fw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subtopics */}
                  <div className="mt-3 border-t border-slate-100 pt-2.5">
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                      Topics Covered:
                    </span>
                    <ul className="space-y-1">
                      {card.subtopics.slice(0, 4).map((st, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 truncate">
                          <span className="text-emerald-500 font-bold text-xs">-</span>
                          <span className="truncate">{st}</span>
                        </li>
                      ))}
                      {card.subtopics.length > 4 && (
                        <li className="text-[10px] text-slate-400 font-semibold pl-3">
                          + {card.subtopics.length - 4} more
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Best for box */}
                  <div className="mt-3 rounded-lg bg-slate-50 p-2 text-[11px] text-slate-500 leading-tight">
                    <span className="font-semibold text-slate-700">Best for: </span>
                    {card.bestFor}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleStartCardClick(card)}
                    className={`w-full rounded-xl py-2.5 text-center text-xs font-bold transition disabled:opacity-50 ${
                      isCompleted
                        ? 'border border-emerald-600 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        : 'bg-[#003366] text-white hover:bg-[#002244] shadow-sm'
                    }`}
                  >
                    {isStartingThis ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-white" />
                        Generating Questions...
                      </span>
                    ) : isCompleted ? (
                      'Completed (Retake)'
                    ) : (
                      'Start Assessment'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Candidate Profile Modal (ONLY Saves Details - Never Auto-Starts Exam) */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Enter Your Background Details</h3>
                <p className="text-xs text-slate-500">
                  Save your profile so questions and difficulty are accurately calibrated.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="rounded-lg p-1.5 text-xs font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {/* Age */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Age</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={ageInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setAgeInput(val);
                    if (val !== '') {
                      const num = parseInt(val, 10);
                      setProfile((p) => ({ ...p, age: num }));
                    }
                  }}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-600"
                  placeholder="Enter age (e.g. 15)"
                />
              </div>

              {/* Status Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">What are you currently doing?</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setProfile((p) => ({ ...p, professionStatus: 'student' }))}
                    className={`rounded-xl border py-2.5 text-center text-xs font-bold transition ${
                      profile.professionStatus === 'student'
                        ? 'border-blue-600 bg-blue-50 text-blue-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfile((p) => ({ ...p, professionStatus: 'employed' }))}
                    className={`rounded-xl border py-2.5 text-center text-xs font-bold transition ${
                      profile.professionStatus === 'employed'
                        ? 'border-blue-600 bg-blue-50 text-blue-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Working Job
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfile((p) => ({ ...p, professionStatus: 'job_seeker' }))}
                    className={`rounded-xl border py-2.5 text-center text-xs font-bold transition ${
                      profile.professionStatus === 'job_seeker'
                        ? 'border-blue-600 bg-blue-50 text-blue-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Looking for Job
                  </button>
                </div>
              </div>

              {/* Conditional: If Student */}
              {profile.professionStatus === 'student' && (
                <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Current Level</label>
                    <select
                      value={profile.studentLevel || 'school'}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          studentLevel: e.target.value as CandidateProfile['studentLevel'],
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none"
                    >
                      <option value="school">School (Class 4 - 10)</option>
                      <option value="intermediate">Intermediate / +2 (Class 11 - 12)</option>
                      <option value="ug">Undergraduate (College / Bachelors)</option>
                      <option value="pg">Postgraduate (Masters / Research)</option>
                    </select>
                  </div>

                  {/* Dedicated Class Dropdown when School is selected */}
                  {profile.studentLevel === 'school' && (
                    <div>
                      <label className="block text-xs font-bold text-blue-900 mb-1">
                        Select Exact School Class *
                      </label>
                      <select
                        value={profile.schoolClass || 'class_10'}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            schoolClass: e.target.value as CandidateProfile['schoolClass'],
                          }))
                        }
                        className="w-full rounded-xl border border-blue-300 bg-blue-50/50 px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-600"
                      >
                        <option value="class_10">Class 10 (Secondary Board Exam level)</option>
                        <option value="class_9">Class 9</option>
                        <option value="class_8">Class 8</option>
                        <option value="class_7">Class 7</option>
                        <option value="class_6">Class 6</option>
                        <option value="class_5">Class 5</option>
                        <option value="class_4">Class 4</option>
                      </select>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Cognitive questions will match this exact class standard.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Focus / Stream</label>
                    <input
                      type="text"
                      value={profile.stream || ''}
                      onChange={(e) => setProfile((p) => ({ ...p, stream: e.target.value }))}
                      placeholder="e.g. Science / Mathematics, CBSE / ICSE, Commerce"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Conditional: If Employed */}
              {profile.professionStatus === 'employed' && (
                <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title / Role</label>
                    <input
                      type="text"
                      value={profile.jobTitle || ''}
                      onChange={(e) => setProfile((p) => ({ ...p, jobTitle: e.target.value }))}
                      placeholder="e.g. Software Engineer, Sales Manager, Accountant"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Industry / Company Type</label>
                    <input
                      type="text"
                      value={profile.companyType || ''}
                      onChange={(e) => setProfile((p) => ({ ...p, companyType: e.target.value }))}
                      placeholder="e.g. IT Services, Banking, Manufacturing, Retail"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Conditional: If Job Seeker */}
              {profile.professionStatus === 'job_seeker' && (
                <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Highest Qualification</label>
                    <input
                      type="text"
                      value={profile.highestQualification || ''}
                      onChange={(e) => setProfile((p) => ({ ...p, highestQualification: e.target.value }))}
                      placeholder="e.g. B.Tech Computer Science, B.Com, MBA"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Role / Field</label>
                    <input
                      type="text"
                      value={profile.targetRole || ''}
                      onChange={(e) => setProfile((p) => ({ ...p, targetRole: e.target.value }))}
                      placeholder="e.g. Web Developer, Business Analyst, Marketing Executive"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700"
              >
                Save Background Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
