'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Circle,
  CircleCheckBig,
  CircleMinus,
  Download,
  Eye,
  ListTodo,
  Medal,
  Star,
  TriangleExclamationPoint,
  X,
} from 'lucide-react';
import { MathText, stripOptionPrefix } from '@/lib/math';
import { MatchListTable, parseMatchQuestion } from '@/components/common/MatchListTable';
import {
  facultyDownloadAssignmentResultsCsv,
  facultyGetAssignmentReport,
  facultyGetStudentSubmission,
  facultyListAssignments,
  type FacultyAssignmentReport,
  type FacultyAssignmentSummary,
  type FacultyStudentSubmission,
} from '@/lib/faculty';

const SELECT =
  'h-[42px] min-w-[200px] cursor-pointer rounded-xl border-[2px] border-[#003366] bg-white px-3 text-[13.5px] font-semibold text-[#003366] shadow-[0_3px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 focus:border-accent focus:shadow-[0_5px_0_#E3C9E6] motion-reduce:transition-none';

interface FacultyReportsTabProps {
  initialAssignmentId?: string | null;
}

export function FacultyReportsTab({ initialAssignmentId }: FacultyReportsTabProps) {
  const [assignments, setAssignments] = useState<FacultyAssignmentSummary[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(initialAssignmentId || '');
  const [report, setReport] = useState<FacultyAssignmentReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exportingCsv, setExportingCsv] = useState(false);

  // Subject filter for Topic Analysis
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  // Expanded topics state (default: collapsed as topic-grouped stack)
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  // Student Submission Viewer Modal state
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState<FacultyStudentSubmission | null>(null);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'incorrect' | 'correct' | 'skipped' | 'answered'>('all');

  // Load assignments list for selector
  useEffect(() => {
    facultyListAssignments()
      .then((res) => {
        setAssignments(res.assignments);
        setSelectedAssignmentId((prev) => prev || (res.assignments.length > 0 ? res.assignments[0]!.id : ''));
      })
      .catch((err) => setError(err.message));
  }, []);

  // Load report when selected assignment changes
  useEffect(() => {
    if (!selectedAssignmentId) return;
    setLoading(true);
    setError('');
    facultyGetAssignmentReport(selectedAssignmentId)
      .then((res) => {
        setReport(res.report);
        // Collapsed by default as a clean topic stack
        setExpandedTopics({});
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedAssignmentId]);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }

  async function handleExportCsv() {
    if (!selectedAssignmentId) return;
    setExportingCsv(true);
    setError('');
    try {
      await facultyDownloadAssignmentResultsCsv(selectedAssignmentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export student results CSV');
    } finally {
      setExportingCsv(false);
    }
  }

  // Load a student's full submission paper
  async function handleViewSubmission(studentId: string) {
    if (!selectedAssignmentId) return;
    setSubmissionModalOpen(true);
    setSubmissionLoading(true);
    setSubmissionError('');
    setActiveSubmission(null);
    setSubmissionFilter('all');

    try {
      const res = await facultyGetStudentSubmission(selectedAssignmentId, studentId);
      setActiveSubmission(res.submission);
    } catch (err: unknown) {
      setSubmissionError(err instanceof Error ? err.message : 'Failed to load student submission');
    } finally {
      setSubmissionLoading(false);
    }
  }

  // Available subjects for filtering
  const availableSubjects = useMemo(() => {
    if (!report) return [];
    const set = new Set<string>();
    if (report.topicAnalytics) {
      report.topicAnalytics.forEach((t) => set.add(t.subject));
    }
    if (report.questionAnalytics) {
      report.questionAnalytics.forEach((q) => set.add(q.subject));
    }
    return Array.from(set).sort();
  }, [report]);

  // Filtered topics based on subject filter dropdown
  const filteredTopics = useMemo(() => {
    if (!report?.topicAnalytics) return [];
    if (selectedSubject === 'ALL') return report.topicAnalytics;
    return report.topicAnalytics.filter((t) => t.subject.toLowerCase() === selectedSubject.toLowerCase());
  }, [report, selectedSubject]);

  const isSubPsychometric = activeSubmission?.assignment?.examType === 'Psychometric';

  // Filtered questions in submission viewer
  const filteredQuestions = useMemo(() => {
    if (!activeSubmission) return [];
    if (isSubPsychometric) {
      if (submissionFilter === 'answered') return activeSubmission.questions.filter((q) => !q.isSkipped);
      if (submissionFilter === 'skipped') return activeSubmission.questions.filter((q) => q.isSkipped);
      return activeSubmission.questions;
    }
    if (submissionFilter === 'correct') return activeSubmission.questions.filter((q) => q.isCorrect);
    if (submissionFilter === 'incorrect') return activeSubmission.questions.filter((q) => !q.isCorrect && !q.isSkipped);
    if (submissionFilter === 'skipped') return activeSubmission.questions.filter((q) => q.isSkipped);
    return activeSubmission.questions;
  }, [activeSubmission, submissionFilter, isSubPsychometric]);

  function toggleTopic(topicKey: string) {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicKey]: !prev[topicKey],
    }));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Assignment Picker */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-[18px] font-extrabold text-[#003366]">Batch Performance Reports</h2>
          <p className="text-[13px] text-[#5A6B8C]">
            Examine student rankings, score distributions, and topic accuracy across your assigned exams.
          </p>
        </div>

        {assignments.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5">
            <label className="text-[13px] font-semibold text-[#31407F]">Select Exam:</label>
            <select
              className={SELECT}
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
            >
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} ({a.batch.name})
                </option>
              ))}
            </select>
            {report && (
              <button
                type="button"
                disabled={exportingCsv}
                onClick={handleExportCsv}
                className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#107C41] bg-white px-3.5 py-2 text-[12.5px] font-extrabold text-[#107C41] no-underline shadow-[0_3px_0_#A3D9B5] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_5px_0_#A3D9B5] active:translate-y-[2px] active:shadow-[0_1px_0_#A3D9B5] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Download className="h-4 w-4 shrink-0" aria-hidden />
                {exportingCsv ? 'Exporting...' : 'Export Results (.csv)'}
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-[#C8202F]/25 bg-[#FDF3F4] px-4 py-3 text-[13px] font-semibold text-[#C8202F]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-dashed border-[#003366]/20 bg-white px-10 py-12 text-center text-[#5A6B8C]">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="mt-2 text-[14px] font-medium">Loading batch performance data...</p>
        </div>
      ) : !report ? (
        <div className="rounded-3xl border border-dashed border-[#003366]/20 bg-white px-5 py-9 text-center text-[13.5px] font-medium text-[#5A6B8C]">
          No assignment selected or no assigned exams found. Assign an exam to a batch to view reports.
        </div>
      ) : (
        <>
          {(() => {
            const isPsychometric = report.assignment?.paper?.examType === 'Psychometric';
            return (
              <>
                {/* Summary Overview Cards */}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                  <div className="rounded-[28px] border border-[#003366]/10 bg-white p-5 text-center shadow-[0_24px_56px_-36px_rgba(0,51,102,.45)] sm:p-6">
                    <div className="text-[12px] font-semibold uppercase text-[#5A6B8C]">
                      {isPsychometric ? 'Batch Alignment Avg' : 'Batch Average'}
                    </div>
                    <div className="my-2 font-display text-[28px] font-extrabold text-[#003366]">
                      {report.summary.avgScore}{isPsychometric ? '%' : ''}
                    </div>
                    <div className="text-[12px] text-[#5A6B8C]">
                      {isPsychometric ? 'Goal Fit' : 'Marks'}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-[#003366]/10 bg-white p-5 text-center shadow-[0_24px_56px_-36px_rgba(0,51,102,.45)] sm:p-6">
                    <div className="text-[12px] font-semibold uppercase text-[#5A6B8C]">
                      {isPsychometric ? 'Top Goal Alignment' : 'Highest Score'}
                    </div>
                    <div className="my-2 font-display text-[28px] font-extrabold text-accent">
                      {report.summary.highestScore}{isPsychometric ? '%' : ''}
                    </div>
                    <div className="text-[12px] text-[#5A6B8C]">
                      {isPsychometric ? 'Top Candidate Fit' : 'Marks (Top Rank)'}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-[#003366]/10 bg-white p-5 text-center shadow-[0_24px_56px_-36px_rgba(0,51,102,.45)] sm:p-6">
                    <div className="text-[12px] font-semibold uppercase text-[#5A6B8C]">
                      {isPsychometric ? 'Lowest Alignment' : 'Lowest Score'}
                    </div>
                    <div className="my-2 font-display text-[28px] font-extrabold text-[#C8202F]">
                      {report.summary.lowestScore}{isPsychometric ? '%' : ''}
                    </div>
                    <div className="text-[12px] text-[#5A6B8C]">
                      {isPsychometric ? 'Lowest Fit' : 'Marks'}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-[#003366]/10 bg-white p-5 text-center shadow-[0_24px_56px_-36px_rgba(0,51,102,.45)] sm:p-6">
                    <div className="text-[12px] font-semibold uppercase text-[#5A6B8C]">
                      Submissions
                    </div>
                    <div className="my-2 font-display text-[28px] font-extrabold text-[#003366]">
                      {report.summary.submittedCount} / {report.summary.totalEnrolled}
                    </div>
                    <div className="text-[12px] text-accent">
                      {report.summary.totalEnrolled > 0
                        ? `${Math.round((report.summary.submittedCount / report.summary.totalEnrolled) * 100)}% turnout`
                        : '—'}
                    </div>
                  </div>

                  {isPsychometric && report.summary.aiEvaluationStats && (
                    <div className="rounded-[28px] border border-[#803688]/20 bg-[#FDF8FF] p-5 text-center shadow-[0_24px_56px_-36px_rgba(128,54,136,.3)] sm:p-6">
                      <div className="text-[12px] font-semibold uppercase text-[#803688]">
                        AI Career Processing
                      </div>
                      <div className="my-2 font-display text-[28px] font-extrabold text-[#803688]">
                        {report.summary.aiEvaluationStats.completed} / {report.summary.aiEvaluationStats.total}
                      </div>
                      <div className="text-[12px] text-[#5A6B8C]">
                        {report.summary.aiEvaluationStats.pending > 0
                          ? `${report.summary.aiEvaluationStats.pending} in queued processing`
                          : '100% evaluated with live AI'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Candidate Evaluations & Behavioral Profiles Table with Eye Icon */}
                <div className="rounded-[28px] border border-[#003366]/10 bg-white p-5 shadow-[0_24px_56px_-36px_rgba(0,51,102,.45)] sm:p-6">
                  <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2.5 font-display text-[17px] font-extrabold text-[#003366]">
                    <span>
                      {isPsychometric ? 'Candidate Evaluations & Behavioral Profiles' : 'Batch Leaderboard & Rankings'} ({report.rankList.length})
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-normal text-[#5A6B8C]">
                      {isPsychometric
                        ? 'Sorted by Goal Alignment • Click Eye to inspect student choices'
                        : 'Ranked by Total Marks Descending • Click Eye to inspect student response sheet'}
                    </span>
                  </div>

                  {report.rankList.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-[#003366]/20 bg-white px-5 py-9 text-center text-[13.5px] font-medium text-[#5A6B8C]">
                      No student has submitted this exam yet. Students can take the test at <strong>/student</strong>.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-[13px]">
                        <thead>
                          <tr className="border-b-2 border-[#003366]/10 text-left text-[#5A6B8C]">
                            {!isPsychometric && <th className="w-[50px] px-3 py-2.5">Rank</th>}
                            <th className="px-3 py-2.5">Roll Number</th>
                            <th className="px-3 py-2.5">Student Name</th>
                            {isPsychometric ? (
                              <>
                                <th className="px-3 py-2.5 text-center">Goal Alignment</th>
                                <th className="px-3 py-2.5">Predicted Best-Fit Role &amp; Summary</th>
                                <th className="px-3 py-2.5 text-center">Attempted / Skipped</th>
                              </>
                            ) : (
                              <>
                                <th className="px-3 py-2.5 text-center">Score / Max</th>
                                <th className="px-3 py-2.5 text-center">Accuracy</th>
                                <th className="px-3 py-2.5 text-center">Correct / Wrong / Skip</th>
                                <th className="px-3 py-2.5">Weak Topics</th>
                              </>
                            )}
                            <th className="px-3 py-2.5 text-right">Time Taken</th>
                            <th className="px-3 py-2.5 text-center">Paper Sheet</th>
                          </tr>
                        </thead>
                        <tbody>
                          {report.rankList.map((st) => {
                            const onPodium = st.rank <= 3;
                            const totalAttempted = st.correctCount + st.incorrectCount;
                            const accuracy =
                              totalAttempted > 0 ? Math.round((st.correctCount / totalAttempted) * 100) : 0;
                            const psyReport = (st.resultBreakdown as Record<string, unknown> | null)?.psychometricReport as
                              | Record<string, unknown>
                              | undefined;
                            const predictedRole =
                              (st as { predictedRole?: string }).predictedRole ||
                              (psyReport?.predictedRole as string) ||
                              (psyReport?.archetype as string) ||
                              'Evaluating Mindset';
                            const roleReason =
                              (st as { roleReason?: string }).roleReason ||
                              (psyReport?.roleReason as string) ||
                              null;
                            const attemptedCount = Math.max(0, report.questionAnalytics.length - st.unattemptedCount);

                            return (
                              <tr key={st.studentId} className="border-b border-[#003366]/10 transition-colors hover:bg-[#F8FAFF]">
                                {!isPsychometric && (
                                  <td className="px-3 py-3 text-[14px] font-bold text-[#003366]">
                                    {onPodium ? (
                                      <span className="inline-flex items-center gap-1.5">
                                        <Medal className="h-[14px] w-[14px] shrink-0" aria-hidden />
                                        #{st.rank}
                                      </span>
                                    ) : (
                                      `#${st.rank}`
                                    )}
                                  </td>
                                )}
                                <td className="px-3 py-3 font-semibold text-accent">{st.rollNumber}</td>
                                <td className="px-3 py-3 font-medium text-[#003366]">
                                  <div className="flex items-center gap-2">
                                    <span>{st.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleViewSubmission(st.studentId)}
                                      className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-ice text-[#003366] transition hover:bg-accent hover:text-white"
                                      title={`Inspect ${st.name}'s answered paper`}
                                    >
                                      <Eye className="h-[13px] w-[13px]" aria-hidden />
                                    </button>
                                  </div>
                                </td>

                                {isPsychometric ? (
                                  <>
                                    <td className="px-3 py-3 text-center">
                                      <span className="font-extrabold text-[#803688]">
                                        {st.totalScore}%
                                      </span>
                                    </td>
                                    <td className="px-3 py-3 max-w-[340px]">
                                      <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span className="inline-block w-fit rounded-full bg-[#803688]/15 px-2.5 py-0.5 text-[11.5px] font-extrabold text-[#803688]">
                                            {predictedRole}
                                          </span>
                                          {(st.aiStatus === 'pending' || st.aiStatus === 'processing') && (
                                            <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 animate-pulse">
                                              Refining via AI...
                                            </span>
                                          )}
                                        </div>
                                        {roleReason && (
                                          <p className="text-[12px] font-normal leading-relaxed text-[#475569]">
                                            {roleReason}
                                          </p>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-3 py-3 text-center text-[12px]">
                                      <span className="font-semibold text-[#003366]">{attemptedCount}</span>
                                      <span className="text-[#003366]/30"> / </span>
                                      <span className="text-[#5A6B8C]">{st.unattemptedCount}</span>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td className="px-3 py-3 text-center">
                                      <span
                                        className={
                                          st.totalScore >= 0 ? 'font-bold text-[#003366]' : 'font-bold text-[#C8202F]'
                                        }
                                      >
                                        {st.totalScore}
                                      </span>
                                      <span className="text-[12px] text-[#5A6B8C]"> / {st.maxScore}</span>
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                      <span
                                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                          accuracy >= 70
                                            ? 'bg-[#EAF7EF] text-[#146C33]'
                                            : accuracy >= 40
                                              ? 'bg-[#FEF3C7] text-[#B45309]'
                                              : 'bg-[#FDF3F4] text-[#C8202F]'
                                        }`}
                                      >
                                        {accuracy}%
                                      </span>
                                    </td>
                                    <td className="px-3 py-3 text-center text-[12px]">
                                      <span className="font-semibold text-[#15803D]">+{st.correctCount}</span>{' '}
                                      <span className="text-[#003366]/20">/</span>{' '}
                                      <span className="font-semibold text-[#C8202F]">-{st.incorrectCount}</span>{' '}
                                      <span className="text-[#003366]/20">/</span>{' '}
                                      <span className="text-[#5A6B8C]">{st.unattemptedCount}</span>
                                    </td>
                                    <td className="px-3 py-3 text-[11px]">
                                      {st.personalWeakTopics && st.personalWeakTopics.length > 0 ? (
                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                          {st.personalWeakTopics.slice(0, 2).map((w, i) => (
                                            <span
                                              key={i}
                                              className="rounded bg-[#FDF3F4] px-1.5 py-0.5 font-medium text-[#C8202F]"
                                            >
                                              {w.topic} ({w.mistakes})
                                            </span>
                                          ))}
                                          {st.personalWeakTopics.length > 2 && (
                                            <span className="text-[#5A6B8C]">
                                              +{st.personalWeakTopics.length - 2} more
                                            </span>
                                          )}
                                        </div>
                                      ) : (
                                        <span className="font-medium text-[#15803D]">None</span>
                                      )}
                                    </td>
                                  </>
                                )}

                                <td className="px-3 py-3 text-right text-[12px] text-[#5A6B8C]">
                                  {formatTime(st.timeTakenSeconds)}
                                </td>
                                <td className="px-3 py-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleViewSubmission(st.studentId)}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#003366]/20 bg-white px-2.5 py-1 text-[12px] font-bold text-[#003366] shadow-[0_2px_0_#C6D2F8] transition-[background,border-color,color,box-shadow] hover:border-accent hover:bg-[#F3E8FF] hover:text-accent hover:shadow-[0_3px_0_#E3C9E6] active:translate-y-0.5"
                                    title="Inspect student's chosen options and question paper"
                                  >
                                    <Eye className="h-[13px] w-[13px] shrink-0" aria-hidden />
                                    <span>View</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            );
          })()}

          {/* 3. Subject-Filtered, Topic-Grouped Error & Revision Analytics */}
          <div className="rounded-[28px] border border-[#003366]/10 bg-white p-5 shadow-[0_24px_56px_-36px_rgba(0,51,102,.45)] sm:p-6">
            {/* Header: Title on Left, Subject Filter Dropdown on the Top Right */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#003366]/10 pb-4">
              <div>
                <h3 className="font-display text-[17px] font-extrabold text-[#003366]">
                  {report.assignment?.paper?.examType === 'Psychometric'
                    ? 'Psychometric Domains & Question Breakdown'
                    : 'Question Difficulty & Error Analysis'}
                </h3>
                <p className="text-[12px] text-[#5A6B8C]">
                  {report.assignment?.paper?.examType === 'Psychometric'
                    ? 'Domain-grouped stack: Response distribution and student opinion choice breakdown across each psychometric domain.'
                    : 'Topic-grouped stack: Identifies questions, batch accuracy, and marks lost per topic. Click any topic to inspect individual questions.'}
                </p>
              </div>

              {/* Subject Filter Dropdown on top right */}
              <div className="flex items-center gap-2">
                <label className="text-[13px] font-bold text-[#003366]">
                  {report.assignment?.paper?.examType === 'Psychometric' ? 'Domain Filter:' : 'Subject:'}
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="h-[38px] cursor-pointer rounded-xl border-[2px] border-[#003366] bg-white px-3 text-[13px] font-bold text-[#003366] shadow-[0_2px_0_#C6D2F8] outline-none transition-[border-color,box-shadow] focus:border-accent"
                >
                  <option value="ALL">
                    {report.assignment?.paper?.examType === 'Psychometric' ? 'All Domains' : 'All Subjects'}
                  </option>
                  {availableSubjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Batch & Student Revision Analytics Summary (Strongest, Lacking, Actionable Advice) */}
            {report.assignment?.paper?.examType !== 'Psychometric' && report.revisionRecommendations && (
              <div className="mb-5 grid grid-cols-1 gap-3.5 md:grid-cols-3">
                {/* 1. Lacking / Weak Topics */}
                <div className="rounded-2xl border border-[#C8202F]/25 bg-[#FDF3F4] p-3.5">
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#C8202F]">
                    <TriangleExclamationPoint className="h-[14px] w-[14px] shrink-0" aria-hidden />
                    <span>Lacking / Weak Topics</span>
                  </div>
                  <p className="mt-0.5 text-[11.5px] text-[#5A6B8C]">
                    Topics with high error rates or marks lost:
                  </p>
                  {report.revisionRecommendations.lackingTopics.length === 0 ? (
                    <div className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-[#146C33]">
                      <Check className="h-[13px] w-[13px] shrink-0" aria-hidden />
                      <span>No topics below 50% accuracy.</span>
                    </div>
                  ) : (
                    <div className="mt-2 flex flex-col gap-1.5">
                      {report.revisionRecommendations.lackingTopics.map((lt, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5 text-[12px] shadow-sm"
                        >
                          <div>
                            <span className="font-bold text-[#003366]">{lt.topic}</span>
                            <span className="ml-1 text-[11px] text-[#5A6B8C]">({lt.subject})</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-[#C8202F]">{lt.accuracyPct}% acc</span>
                            {lt.marksLost !== undefined && (
                              <span className="ml-1.5 text-[11px] font-medium text-[#C8202F]">
                                (-{lt.marksLost} pts)
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Strongest Topics */}
                <div className="rounded-2xl border border-[#146C33]/25 bg-[#EAF7EF] p-3.5">
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#146C33]">
                    <Star className="h-[14px] w-[14px] shrink-0" aria-hidden />
                    <span>Strongest Topics</span>
                  </div>
                  <p className="mt-0.5 text-[11.5px] text-[#5A6B8C]">
                    Topics with the highest score and accuracy:
                  </p>
                  {report.revisionRecommendations.topPerformingTopics.length === 0 ? (
                    <div className="mt-2 text-[12px] text-[#5A6B8C]">
                      No topics reached 70% accuracy yet.
                    </div>
                  ) : (
                    <div className="mt-2 flex flex-col gap-1.5">
                      {report.revisionRecommendations.topPerformingTopics.map((st, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5 text-[12px] shadow-sm"
                        >
                          <div>
                            <span className="font-bold text-[#003366]">{st.topic}</span>
                            <span className="ml-1 text-[11px] text-[#5A6B8C]">({st.subject})</span>
                          </div>
                          <span className="font-bold text-[#146C33]">{st.accuracyPct}% acc</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Actionable Revision Need */}
                <div className="rounded-2xl border border-[#003366]/15 bg-[#F8FAFF] p-3.5">
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#003366]">
                    <ListTodo className="h-[14px] w-[14px] shrink-0" aria-hidden />
                    <span>Actionable Revision Need</span>
                  </div>
                  <p className="mt-0.5 text-[11.5px] text-[#5A6B8C]">
                    Faculty priorities to re-teach or assign practice:
                  </p>
                  <div className="mt-2 text-[12px] leading-relaxed text-[#31407F]">
                    {report.revisionRecommendations.recommendations.length > 0 ? (
                      <ul className="list-inside list-disc space-y-1">
                        {report.revisionRecommendations.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    ) : (
                      <span>No specific revision needs identified.</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Topic-Grouped Stack (No Flat Dumps) */}
            {filteredTopics.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#003366]/20 bg-white p-6 text-center text-[13px] text-[#5A6B8C]">
                No topics found for the selected subject filter.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredTopics.map((t) => {
                  const topicKey = `${t.subject}-${t.topic}`;
                  const isExpanded = !!expandedTopics[topicKey];
                  const isPaperPsy = report.assignment?.paper?.examType === 'Psychometric';

                  return (
                    <div
                      key={topicKey}
                      className="overflow-hidden rounded-2xl border border-[#003366]/15 bg-white transition-all shadow-sm"
                    >
                      {/* Topic-Grouped Stack Row (Clean, Compact, Click to Expand) */}
                      <button
                        type="button"
                        onClick={() => toggleTopic(topicKey)}
                        className="flex w-full flex-wrap items-center justify-between gap-3 bg-[#F8FAFF] px-4 py-3.5 text-left transition-colors hover:bg-[#EEF3FF]"
                      >
                        {/* Topic Name & Question Count */}
                        <div className="flex items-center gap-2.5">
                          <span className="text-[14px] font-extrabold text-[#003366]">{t.topic}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                            isPaperPsy ? 'bg-[#803688]/10 text-[#803688]' : 'bg-ice text-[#003366]'
                          }`}>
                            {t.subject}
                          </span>
                          <span className="rounded-md border border-[#003366]/15 bg-white px-2 py-0.5 text-[11.5px] font-bold text-[#31407F]">
                            {t.questionCount} {t.questionCount === 1 ? 'Question' : 'Questions'}
                          </span>
                        </div>

                        {/* Topic Stats: Batch Accuracy & Marks Lost */}
                        <div className="flex flex-wrap items-center gap-3.5">
                          {isPaperPsy ? (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="text-[12px] text-[#5A6B8C]">Response Rate:</span>
                                <div className="h-2 w-24 overflow-hidden rounded-full bg-[#E2E8F0]">
                                  <div
                                    className="h-full bg-[#803688]"
                                    style={{ width: `${t.accuracyPct}%` }}
                                  />
                                </div>
                                <span className="min-w-[34px] text-[12.5px] font-bold text-[#803688]">
                                  {t.accuracyPct}%
                                </span>
                              </div>
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#F3E8FF] px-2.5 py-0.5 text-[11px] font-bold text-[#803688]">
                                Behavioral Domain
                              </span>
                            </>
                          ) : (
                            <>
                              {/* Accuracy Bar */}
                              <div className="flex items-center gap-2">
                                <span className="text-[12px] text-[#5A6B8C]">Batch Accuracy:</span>
                                <div className="h-2 w-24 overflow-hidden rounded-full bg-[#E2E8F0]">
                                  <div
                                    className={`h-full ${
                                      t.accuracyPct >= 70
                                        ? 'bg-[#15803D]'
                                        : t.accuracyPct >= 40
                                          ? 'bg-[#D97706]'
                                          : 'bg-[#C8202F]'
                                    }`}
                                    style={{ width: `${t.accuracyPct}%` }}
                                  />
                                </div>
                                <span
                                  className={`min-w-[34px] text-[12.5px] font-bold ${
                                    t.accuracyPct >= 70
                                      ? 'text-[#15803D]'
                                      : t.accuracyPct >= 40
                                        ? 'text-[#D97706]'
                                        : 'text-[#C8202F]'
                                  }`}
                                >
                                  {t.accuracyPct}%
                                </span>
                              </div>

                              {/* Marks Lost for that topic */}
                              <div className="rounded-md bg-white border border-[#003366]/15 px-2 py-0.5 text-[11.5px]">
                                <span className="text-[#5A6B8C]">Marks Lost: </span>
                                <span className={`font-bold ${t.marksLost ? 'text-[#C8202F]' : 'text-[#15803D]'}`}>
                                  {t.marksLost || 0}
                                </span>
                              </div>

                              {/* Correct / Wrong / Skipped Counts */}
                              <div className="text-[12px] text-[#5A6B8C]">
                                <span className="font-bold text-[#15803D]">+{t.correctCount}</span> /{' '}
                                <span className="font-bold text-[#C8202F]">-{t.wrongCount}</span> /{' '}
                                <span className="font-medium text-[#5A6B8C]">{t.skippedCount}</span>
                              </div>

                              {/* Status Badge */}
                              {t.isWeak ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#FDF3F4] px-2 py-0.5 text-[11px] font-bold text-[#C8202F]">
                                  <TriangleExclamationPoint className="h-[11px] w-[11px] shrink-0" aria-hidden />
                                  Needs Revision
                                </span>
                              ) : t.isStrong ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF7EF] px-2 py-0.5 text-[11px] font-bold text-[#146C33]">
                                  <CircleCheckBig className="h-[11px] w-[11px] shrink-0" aria-hidden />
                                  Mastered
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[11px] font-bold text-[#B45309]">
                                  <CircleMinus className="h-[11px] w-[11px] shrink-0" aria-hidden />
                                  Average
                                </span>
                              )}
                            </>
                          )}

                          {/* Expand/Collapse Dropdown Arrow */}
                          <span className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[#003366]">
                            {isExpanded ? (
                              <ChevronUp className="h-[13px] w-[13px] shrink-0" aria-hidden />
                            ) : (
                              <ChevronDown className="h-[13px] w-[13px] shrink-0" aria-hidden />
                            )}
                            {isExpanded ? 'Close' : isPaperPsy ? 'Inspect Domain' : 'Inspect Questions'}
                          </span>
                        </div>
                      </button>

                      {/* Expanded Section: Inspect Individual Questions Within That Topic */}
                      {isExpanded && (
                        <div className="border-t border-[#003366]/10 p-4 bg-white">
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-[12.5px]">
                              <thead>
                                <tr className="border-b border-[#003366]/10 text-left text-[#5A6B8C]">
                                  <th className="w-[50px] px-2.5 py-2">Q#</th>
                                  <th className="px-2.5 py-2">Type</th>
                                  <th className="px-2.5 py-2">{isPaperPsy ? 'Focus' : 'Difficulty'}</th>
                                  <th className="min-w-[140px] px-2.5 py-2">
                                    {isPaperPsy ? 'Response Rate' : 'Batch Accuracy'}
                                  </th>
                                  {!isPaperPsy && (
                                    <th className="px-2.5 py-2 text-center">Correct / Wrong / Skip</th>
                                  )}
                                  <th className="min-w-[200px] px-2.5 py-2">Student Option Choices</th>
                                </tr>
                              </thead>
                              <tbody>
                                {t.questions.map((q) => (
                                  <tr
                                    key={q.questionNumber}
                                    className="border-b border-[#003366]/5 transition-colors hover:bg-[#FAFBFD]"
                                  >
                                    <td className="px-2.5 py-2.5 font-bold text-[#003366]">
                                      #{q.questionNumber}
                                    </td>
                                    <td className="px-2.5 py-2.5">
                                      <span className="rounded bg-ice px-1.5 py-0.5 text-[10.5px] font-bold uppercase text-[#003366]">
                                        {q.questionType.replace('mcq_', '')}
                                      </span>
                                    </td>
                                    <td className="px-2.5 py-2.5 text-[#5A6B8C] capitalize">
                                      {q.difficulty}
                                    </td>
                                    <td className="px-2.5 py-2.5">
                                      <div className="flex items-center gap-2">
                                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E2E8F0]">
                                          <div
                                            className={`h-full ${
                                              isPaperPsy
                                                ? 'bg-[#803688]'
                                                : q.accuracyPct >= 60
                                                  ? 'bg-[#15803D]'
                                                  : q.accuracyPct >= 35
                                                    ? 'bg-[#D97706]'
                                                    : 'bg-[#C8202F]'
                                            }`}
                                            style={{ width: `${q.accuracyPct}%` }}
                                          />
                                        </div>
                                        <span className="min-w-[32px] text-[11px] font-bold">
                                          {q.accuracyPct}%
                                        </span>
                                      </div>
                                    </td>
                                    {!isPaperPsy && (
                                      <td className="px-2.5 py-2.5 text-center text-[11.5px]">
                                        <span className="font-semibold text-[#15803D]">+{q.correctCount}</span>{' '}
                                        <span className="text-[#003366]/20">/</span>{' '}
                                        <span className="font-semibold text-[#C8202F]">-{q.wrongCount}</span>{' '}
                                        <span className="text-[#003366]/20">/</span>{' '}
                                        <span className="text-[#5A6B8C]">{q.skippedCount}</span>
                                      </td>
                                    )}
                                    <td className="px-2.5 py-2.5">
                                      {q.optionPercentages && Object.keys(q.optionPercentages).length > 0 ? (
                                        <div className="flex flex-wrap items-center gap-1 text-[11px]">
                                          {Object.entries(q.optionPercentages).map(([opt, pct]) => {
                                            if (isPaperPsy) {
                                              return (
                                                <span
                                                  key={opt}
                                                  className="rounded bg-[#F8FAFF] border border-[#003366]/10 px-1.5 py-0.5 font-medium text-[#003366]"
                                                >
                                                  {opt}: <strong className="font-bold">{pct}%</strong>
                                                </span>
                                              );
                                            }
                                            return (
                                              <span
                                                key={opt}
                                                className={`rounded px-1.5 py-0.5 font-medium ${
                                                  opt === q.correctAnswer
                                                    ? 'bg-[#EAF7EF] text-[#146C33] font-bold'
                                                    : opt === 'Skipped'
                                                      ? 'bg-[#F1F5F9] text-[#64748B]'
                                                      : pct > 0
                                                        ? 'bg-[#FDF3F4] text-[#C8202F] font-semibold'
                                                        : 'bg-[#F3E8FF] text-[#003366]'
                                                }`}
                                              >
                                                {opt}: <strong className="font-bold">{pct}%</strong>
                                                {opt === q.correctAnswer && ' (Key)'}
                                              </span>
                                            );
                                          })}
                                        </div>
                                      ) : (
                                        <span className="text-[11px] text-[#5A6B8C]">—</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Student Submission Response Paper Viewer Modal */}
      {submissionModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSubmissionModalOpen(false)}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-4xl flex-col rounded-[28px] border border-[#003366]/20 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#003366]/10 px-6 py-4">
              <div>
                <h3 className="font-display text-[18px] font-extrabold text-[#003366]">
                  Student Question Paper &amp; Responses
                </h3>
                {activeSubmission && (
                  <p className="text-[12.5px] text-[#5A6B8C]">
                    {activeSubmission.student.name} ({activeSubmission.student.rollNumber}) •{' '}
                    {activeSubmission.student.batchName}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSubmissionModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-[#5A6B8C] transition hover:bg-[#E5E7EB] hover:text-[#003366]"
                title="Close"
              >
                <X className="h-[16px] w-[16px]" aria-hidden />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {submissionLoading ? (
                <div className="py-16 text-center text-[#5A6B8C]">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                  <p className="mt-2 text-[14px] font-medium">Loading student response sheet...</p>
                </div>
              ) : submissionError ? (
                <div className="rounded-2xl border border-[#C8202F]/25 bg-[#FDF3F4] p-4 text-[13px] font-semibold text-[#C8202F]">
                  {submissionError}
                </div>
              ) : !activeSubmission ? (
                <div className="py-12 text-center text-[13px] text-[#5A6B8C]">No data found.</div>
              ) : (
                <div className="flex flex-col gap-5">
                  {/* Performance Summary Pill Header */}
                  <div className="grid grid-cols-2 gap-3 rounded-2xl bg-[#F8FAFF] p-4 sm:grid-cols-4">
                    {isSubPsychometric ? (
                      <>
                        <div className="text-center">
                          <div className="text-[11px] font-semibold uppercase text-[#5A6B8C]">Goal Alignment</div>
                          <div className="text-[20px] font-extrabold text-[#803688]">
                            {activeSubmission.score.totalScore}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-[11px] font-semibold uppercase text-[#5A6B8C]">Attempted</div>
                          <div className="text-[20px] font-extrabold text-[#003366]">
                            {activeSubmission.questions.filter((q) => !q.isSkipped).length}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-[11px] font-semibold uppercase text-[#5A6B8C]">Skipped</div>
                          <div className="text-[20px] font-extrabold text-[#5A6B8C]">
                            {activeSubmission.questions.filter((q) => q.isSkipped).length}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center">
                          <div className="text-[11px] font-semibold uppercase text-[#5A6B8C]">Score</div>
                          <div className="text-[20px] font-extrabold text-[#003366]">
                            {activeSubmission.score.totalScore}{' '}
                            <span className="text-[12px] font-normal text-[#5A6B8C]">
                              / {activeSubmission.score.maxScore}
                            </span>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-[11px] font-semibold uppercase text-[#5A6B8C]">Correct</div>
                          <div className="text-[20px] font-extrabold text-[#15803D]">
                            {activeSubmission.score.correctCount}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-[11px] font-semibold uppercase text-[#5A6B8C]">Incorrect</div>
                          <div className="text-[20px] font-extrabold text-[#C8202F]">
                            {activeSubmission.score.incorrectCount}
                          </div>
                        </div>
                      </>
                    )}
                    <div className="text-center">
                      <div className="text-[11px] font-semibold uppercase text-[#5A6B8C]">Time Taken</div>
                      <div className="text-[18px] font-extrabold text-[#31407F]">
                        {formatTime(activeSubmission.score.timeTakenSeconds)}
                      </div>
                    </div>
                  </div>

                  {isSubPsychometric && (
                    (() => {
                      const psy = activeSubmission.score.psychometricReport as { predictedRole?: string; roleReason?: string; archetype?: string } | undefined;
                      const role = psy?.predictedRole || psy?.archetype;
                      const reason = psy?.roleReason;
                      if (!role && !reason) return null;
                      return (
                        <div className="flex flex-col gap-1.5 rounded-2xl border border-[#803688]/20 bg-[#FDF8FF] p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[11.5px] font-bold uppercase tracking-wider text-[#803688]">Predicted Best-Fit Role:</span>
                            <span className="rounded-full bg-[#803688] px-2.5 py-0.5 text-[11.5px] font-extrabold text-white">
                              {role}
                            </span>
                          </div>
                          {reason && (
                            <p className="text-[13px] leading-relaxed text-[#334155]">
                              {reason}
                            </p>
                          )}
                        </div>
                      );
                    })()
                  )}

                  {/* Filter Submissions Tabs */}
                  <div className="flex items-center justify-between gap-3 border-b border-[#003366]/10 pb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12.5px] font-bold text-[#003366]">Filter Questions:</span>
                      {(isSubPsychometric
                        ? (['all', 'answered', 'skipped'] as const)
                        : (['all', 'incorrect', 'correct', 'skipped'] as const)
                      ).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setSubmissionFilter(mode)}
                          className={`rounded-lg px-2.5 py-1 text-[11.5px] font-bold capitalize transition ${
                            submissionFilter === mode
                              ? 'bg-accent text-white shadow-sm'
                              : 'bg-[#F1F5F9] text-[#5A6B8C] hover:bg-[#E2E8F0]'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                    <span className="text-[12px] text-[#5A6B8C]">
                      Showing {filteredQuestions.length} of {activeSubmission.questions.length} questions
                    </span>
                  </div>

                  {/* Questions List */}
                  <div className="flex flex-col gap-4">
                    {filteredQuestions.map((q) => {
                      const letters = ['A', 'B', 'C', 'D'];
                      const isItemPsychometric = isSubPsychometric || q.subject === 'Psychometric';
                      const isCorrect = q.isCorrect;
                      const isSkipped = q.isSkipped;
                      const isWrong = !isCorrect && !isSkipped;

                      return (
                        <div
                          key={q.number}
                          className={`rounded-2xl border p-4 transition-all ${
                            isItemPsychometric
                              ? 'border-[#003366]/15 bg-white shadow-sm'
                              : isCorrect
                                ? 'border-[#15803D]/25 bg-white shadow-sm'
                                : isWrong
                                  ? 'border-[#C8202F]/25 bg-white shadow-sm'
                                  : 'border-[#003366]/15 bg-white shadow-sm'
                          }`}
                        >
                          {/* Question Meta Bar */}
                          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`rounded-lg px-2 py-0.5 text-[12px] font-extrabold text-white ${
                                isItemPsychometric ? 'bg-[#803688]' : 'bg-[#003366]'
                              }`}>
                                Q#{q.number}
                              </span>
                              <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                                isItemPsychometric ? 'bg-[#803688]/10 text-[#803688]' : 'bg-ice text-[#003366]'
                              }`}>
                                {q.subject}
                              </span>
                              <span className="rounded-md border border-[#003366]/15 bg-white px-2 py-0.5 text-[11px] font-semibold text-[#5A6B8C]">
                                {q.topic}
                              </span>
                              <span className="text-[11px] font-medium uppercase text-[#5A6B8C]">
                                {q.questionType.replace('mcq_', '')}
                              </span>
                            </div>

                            {/* Mark / Status badge */}
                            <div>
                              {isItemPsychometric ? (
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11.5px] font-bold ${
                                  isSkipped ? 'bg-[#F1F5F9] text-[#64748B]' : 'bg-[#803688]/10 text-[#803688]'
                                }`}>
                                  {isSkipped ? 'Skipped' : 'Response Recorded'}
                                </span>
                              ) : isCorrect ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF7EF] px-2.5 py-0.5 text-[11.5px] font-bold text-[#146C33]">
                                  <Check className="h-[12px] w-[12px] shrink-0" aria-hidden />
                                  <span>Correct</span>
                                  <span>(+{q.marksAwarded})</span>
                                </span>
                              ) : isWrong ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#FDF3F4] px-2.5 py-0.5 text-[11.5px] font-bold text-[#C8202F]">
                                  <X className="h-[12px] w-[12px] shrink-0" aria-hidden />
                                  <span>Incorrect</span>
                                  <span>({q.marksAwarded})</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-[11.5px] font-bold text-[#64748B]">
                                  <Circle className="h-[12px] w-[12px] shrink-0" aria-hidden />
                                  <span>Not Attempted</span>
                                  <span>(0)</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Question Text */}
                          <div className="text-[13.5px] leading-[1.65] text-[#0F172A]">
                            {q.questionType === 'matrix_match' || parseMatchQuestion(q.questionText) ? (
                              <MatchListTable questionText={q.questionText} />
                            ) : (
                              <MathText text={q.questionText} />
                            )}
                          </div>

                          {/* Options or Value Display */}
                          {q.options && q.options.length > 0 ? (
                            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                              {q.options.map((optText, idx) => {
                                const letter = letters[idx]!;
                                const isStudentPick =
                                  q.studentAnswer?.toUpperCase().trim() === letter;
                                const isCorrectOpt =
                                  !isItemPsychometric && q.correctAnswer.toUpperCase().includes(letter);

                                let optBorder = 'border-[#003366]/15 bg-[#F8FAFF]';
                                if (isItemPsychometric) {
                                  if (isStudentPick) {
                                    optBorder = 'border-[#803688] bg-[#FBF5FC] text-[#803688] font-semibold shadow-sm';
                                  } else {
                                    optBorder = 'border-[#CBD5F3] bg-white text-[#5A6B8C]';
                                  }
                                } else {
                                  if (isStudentPick && isCorrectOpt) {
                                    optBorder = 'border-[#15803D] bg-[#EAF7EF] text-[#146C33] font-medium';
                                  } else if (isStudentPick && !isCorrectOpt) {
                                    optBorder = 'border-[#C8202F] bg-[#FDF3F4] text-[#C8202F] font-medium';
                                  } else if (isCorrectOpt) {
                                    optBorder = 'border-[#15803D] border-dashed bg-[#F0FDF4] text-[#15803D]';
                                  }
                                }

                                return (
                                  <div
                                    key={idx}
                                    className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-[12.5px] transition ${optBorder}`}
                                  >
                                    <span
                                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10.5px] font-bold ${
                                        isItemPsychometric
                                          ? isStudentPick
                                            ? 'bg-[#803688] text-white'
                                            : 'bg-white text-[#003366] border border-[#CBD5F3]'
                                          : isStudentPick && isCorrectOpt
                                            ? 'bg-[#15803D] text-white'
                                            : isStudentPick && !isCorrectOpt
                                              ? 'bg-[#C8202F] text-white'
                                              : isCorrectOpt
                                                ? 'bg-[#15803D] text-white'
                                                : 'bg-white text-[#003366] border border-[#003366]/20'
                                      }`}
                                    >
                                      {letter}
                                    </span>
                                    <div className="flex-1">
                                      <MathText text={stripOptionPrefix(optText)} />
                                      {isStudentPick && (
                                        <div className="mt-1 flex items-center gap-1 text-[11px] font-bold">
                                          {isItemPsychometric ? (
                                            <span className="rounded-full bg-[#803688] px-2 py-0.5 text-[10.5px] font-extrabold text-white">
                                              Candidate Selection
                                            </span>
                                          ) : isCorrectOpt ? (
                                            <>
                                              <Check className="h-[11px] w-[11px] shrink-0" aria-hidden />
                                              <span>Student Selected (Correct)</span>
                                            </>
                                          ) : (
                                            <>
                                              <X className="h-[11px] w-[11px] shrink-0" aria-hidden />
                                              <span>Student Selected (Incorrect)</span>
                                            </>
                                          )}
                                        </div>
                                      )}
                                      {!isItemPsychometric && !isStudentPick && isCorrectOpt && (
                                        <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[#15803D]">
                                          <Check className="h-[11px] w-[11px] shrink-0" aria-hidden />
                                          <span>Correct Option</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="mt-3 flex flex-wrap items-center gap-4 rounded-xl border border-[#003366]/15 bg-[#F8FAFF] p-3 text-[13px]">
                              <div>
                                <span className="font-semibold text-[#5A6B8C]">Student Answer: </span>
                                <span
                                  className={`font-bold ${
                                    isItemPsychometric
                                      ? 'text-[#803688]'
                                      : isCorrect ? 'text-[#15803D]' : isWrong ? 'text-[#C8202F]' : 'text-[#5A6B8C]'
                                  }`}
                                >
                                  {q.studentAnswer ?? 'None (Skipped)'}
                                </span>
                              </div>
                              {!isItemPsychometric && (
                                <div>
                                  <span className="font-semibold text-[#5A6B8C]">Correct Answer: </span>
                                  <span className="font-bold text-[#15803D]">{q.correctAnswer}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Explanation (Purged completely for Psychometric) */}
                          {!isItemPsychometric && q.explanation && (
                            <div className="mt-3 rounded-xl border border-[#003366]/10 bg-[#FAFBFD] p-3 text-[12.5px] text-[#31407F]">
                              <span className="font-bold text-[#003366]">Explanation / Solution: </span>
                              <div className="mt-1">
                                <MathText text={q.explanation} />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end border-t border-[#003366]/10 px-6 py-3.5">
              <button
                type="button"
                onClick={() => setSubmissionModalOpen(false)}
                className="rounded-xl border border-[#003366]/20 bg-[#F1F5F9] px-4 py-2 text-[13px] font-bold text-[#003366] transition hover:bg-[#E2E8F0]"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
