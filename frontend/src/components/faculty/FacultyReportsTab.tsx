'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { MathText, stripOptionPrefix } from '@/lib/math';
import { MatchListTable, parseMatchQuestion } from '@/components/common/MatchListTable';
import {
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

  // Subject filter for Topic Analysis
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  // Expanded topics state
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  // Student Submission Viewer Modal state
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState<FacultyStudentSubmission | null>(null);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'incorrect' | 'correct' | 'skipped'>('all');

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
        // Reset topic expansion when assignment changes
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

  // Filtered topics
  const filteredTopics = useMemo(() => {
    if (!report?.topicAnalytics) return [];
    if (selectedSubject === 'ALL') return report.topicAnalytics;
    return report.topicAnalytics.filter((t) => t.subject.toLowerCase() === selectedSubject.toLowerCase());
  }, [report, selectedSubject]);

  // Filtered questions in submission viewer
  const filteredQuestions = useMemo(() => {
    if (!activeSubmission) return [];
    if (submissionFilter === 'correct') return activeSubmission.questions.filter((q) => q.isCorrect);
    if (submissionFilter === 'incorrect') return activeSubmission.questions.filter((q) => !q.isCorrect && !q.isSkipped);
    if (submissionFilter === 'skipped') return activeSubmission.questions.filter((q) => q.isSkipped);
    return activeSubmission.questions;
  }, [activeSubmission, submissionFilter]);

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
            Examine student rankings, topic accuracy, revision recommendations, and individual response sheets.
          </p>
        </div>

        {assignments.length > 0 && (
          <div className="flex items-center gap-2.5">
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
          <p className="mt-2 text-[14px] font-medium">Loading batch performance analytics...</p>
        </div>
      ) : !report ? (
        <div className="rounded-3xl border border-dashed border-[#003366]/20 bg-white px-5 py-9 text-center text-[13.5px] font-medium text-[#5A6B8C]">
          No assignment selected or no assigned exams found. Assign an exam to a batch to view reports.
        </div>
      ) : (
        <>
          {/* Summary Overview Cards */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            <div className="rounded-[24px] border border-[#003366]/10 bg-white p-5 text-center shadow-[0_20px_45px_-30px_rgba(0,51,102,.35)]">
              <div className="text-[11.5px] font-semibold uppercase tracking-wider text-[#5A6B8C]">
                Batch Average
              </div>
              <div className="my-1.5 font-display text-[26px] font-extrabold text-[#003366]">
                {report.summary.avgScore}
              </div>
              <div className="text-[12px] text-[#5A6B8C]">Marks</div>
            </div>

            <div className="rounded-[24px] border border-[#003366]/10 bg-white p-5 text-center shadow-[0_20px_45px_-30px_rgba(0,51,102,.35)]">
              <div className="text-[11.5px] font-semibold uppercase tracking-wider text-[#5A6B8C]">
                Highest Score
              </div>
              <div className="my-1.5 font-display text-[26px] font-extrabold text-accent">
                {report.summary.highestScore}
              </div>
              <div className="text-[12px] text-[#5A6B8C]">Marks (Top Rank)</div>
            </div>

            <div className="rounded-[24px] border border-[#003366]/10 bg-white p-5 text-center shadow-[0_20px_45px_-30px_rgba(0,51,102,.35)]">
              <div className="text-[11.5px] font-semibold uppercase tracking-wider text-[#5A6B8C]">
                Lowest Score
              </div>
              <div className="my-1.5 font-display text-[26px] font-extrabold text-[#C8202F]">
                {report.summary.lowestScore}
              </div>
              <div className="text-[12px] text-[#5A6B8C]">Marks</div>
            </div>

            <div className="rounded-[24px] border border-[#003366]/10 bg-white p-5 text-center shadow-[0_20px_45px_-30px_rgba(0,51,102,.35)]">
              <div className="text-[11.5px] font-semibold uppercase tracking-wider text-[#5A6B8C]">
                Submissions
              </div>
              <div className="my-1.5 font-display text-[26px] font-extrabold text-[#003366]">
                {report.summary.submittedCount} / {report.summary.totalEnrolled}
              </div>
              <div className="text-[12px] font-medium text-accent">
                {report.summary.totalEnrolled > 0
                  ? `${Math.round((report.summary.submittedCount / report.summary.totalEnrolled) * 100)}% Turnout`
                  : '—'}
              </div>
            </div>
          </div>

          {/* Revision Recommendations Banner */}
          {report.revisionRecommendations && (
            <div className="rounded-[24px] border border-[#003366]/10 bg-gradient-to-br from-white to-[#F8FAFF] p-5 shadow-[0_20px_45px_-30px_rgba(0,51,102,.25)]">
              <div className="flex items-center gap-2 font-display text-[16px] font-extrabold text-[#003366]">
                <span>📋 Revision &amp; Learning Needs Overview</span>
              </div>
              <p className="mt-1 text-[12.5px] text-[#5A6B8C]">
                Automated curriculum analysis to plan targeted revision sessions and reinforce topics.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Lacking Topics */}
                <div className="rounded-2xl border border-[#C8202F]/20 bg-[#FDF3F4] p-3.5">
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#C8202F]">
                    <span>⚠️ Topics Requiring Immediate Revision (&lt; 50% Accuracy)</span>
                  </div>
                  {report.revisionRecommendations.lackingTopics.length === 0 ? (
                    <p className="mt-2 text-[12px] text-[#146C33]">
                      Great job! The batch achieved ≥ 50% accuracy across all tested topics.
                    </p>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {report.revisionRecommendations.lackingTopics.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#C8202F]/30 bg-white px-2.5 py-1 text-[12px] font-semibold text-[#C8202F] shadow-sm"
                        >
                          <span>{item.topic}</span>
                          <span className="text-[10.5px] font-normal text-[#5A6B8C]">({item.subject})</span>
                          <span className="rounded bg-[#FDF3F4] px-1 py-0.2 text-[11px] font-bold">
                            {item.accuracyPct}%
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Strong Topics */}
                <div className="rounded-2xl border border-[#146C33]/20 bg-[#EAF7EF] p-3.5">
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#146C33]">
                    <span>🌟 Mastered High-Scoring Topics (≥ 70% Accuracy)</span>
                  </div>
                  {report.revisionRecommendations.topPerformingTopics.length === 0 ? (
                    <p className="mt-2 text-[12px] text-[#5A6B8C]">
                      No topics reached 70% accuracy yet. Continued practice is recommended.
                    </p>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {report.revisionRecommendations.topPerformingTopics.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#146C33]/30 bg-white px-2.5 py-1 text-[12px] font-semibold text-[#146C33] shadow-sm"
                        >
                          <span>{item.topic}</span>
                          <span className="text-[10.5px] font-normal text-[#5A6B8C]">({item.subject})</span>
                          <span className="rounded bg-[#EAF7EF] px-1 py-0.2 text-[11px] font-bold">
                            {item.accuracyPct}%
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {report.revisionRecommendations.recommendations.length > 0 && (
                <div className="mt-3.5 rounded-xl border border-[#003366]/10 bg-white p-3 text-[12.5px] text-[#31407F]">
                  <span className="font-bold text-[#003366]">Faculty Action Items: </span>
                  {report.revisionRecommendations.recommendations.join(' • ')}
                </div>
              )}
            </div>
          )}

          {/* Student Leaderboard Table */}
          <div className="rounded-[28px] border border-[#003366]/10 bg-white p-5 shadow-[0_24px_56px_-36px_rgba(0,51,102,.45)] sm:p-6">
            <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2.5">
              <div>
                <h3 className="font-display text-[17px] font-extrabold text-[#003366]">
                  Batch Leaderboard &amp; Rankings ({report.rankList.length})
                </h3>
                <p className="text-[12px] text-[#5A6B8C]">
                  Click the 👁 View Response button on any student to review their complete answered question paper.
                </p>
              </div>
              <span className="text-[12px] font-medium text-[#5A6B8C]">
                Ranked by Total Marks Descending
              </span>
            </div>

            {report.rankList.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#003366]/20 bg-white px-5 py-9 text-center text-[13.5px] font-medium text-[#5A6B8C]">
                No student has submitted this exam yet. Students can take the test at <strong>/student-portal</strong>.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr className="border-b-2 border-[#003366]/10 text-left text-[#5A6B8C]">
                      <th className="w-[50px] px-3 py-2.5">Rank</th>
                      <th className="px-3 py-2.5">Roll Number</th>
                      <th className="px-3 py-2.5">Student Name</th>
                      <th className="px-3 py-2.5 text-center">Score / Max</th>
                      <th className="px-3 py-2.5 text-center">Accuracy</th>
                      <th className="px-3 py-2.5 text-center">Correct / Wrong / Skip</th>
                      <th className="px-3 py-2.5">Weak Topics</th>
                      <th className="px-3 py-2.5 text-right">Time Taken</th>
                      <th className="px-3 py-2.5 text-center">Paper Sheet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.rankList.map((st) => {
                      const medal =
                        st.rank === 1 ? '🥇' : st.rank === 2 ? '🥈' : st.rank === 3 ? '🥉' : `#${st.rank}`;
                      const totalAttempted = st.correctCount + st.incorrectCount;
                      const accuracy =
                        totalAttempted > 0 ? Math.round((st.correctCount / totalAttempted) * 100) : 0;

                      return (
                        <tr key={st.studentId} className="border-b border-[#003366]/10 transition-colors hover:bg-[#F8FAFF]">
                          <td className="px-3 py-3 text-[14px] font-bold text-[#003366]">{medal}</td>
                          <td className="px-3 py-3 font-semibold text-accent">{st.rollNumber}</td>
                          <td className="px-3 py-3 font-medium text-[#003366]">{st.name}</td>
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
                              <span className="text-[#15803D] font-medium">None</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-right text-[12px] text-[#5A6B8C]">
                            {formatTime(st.timeTakenSeconds)}
                          </td>
                          <td className="px-3 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleViewSubmission(st.studentId)}
                              className="inline-flex items-center gap-1 rounded-xl border border-[#003366]/20 bg-white px-2.5 py-1 text-[12px] font-bold text-[#003366] shadow-[0_2px_0_#C6D2F8] transition-all hover:border-accent hover:bg-[#F3E8FF] hover:text-accent hover:shadow-[0_3px_0_#E3C9E6] active:translate-y-0.5"
                              title="Inspect student's chosen options and question paper"
                            >
                              <span>👁</span>
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

          {/* Topic-Grouped Question Analytics with Subject Dropdown */}
          <div className="rounded-[28px] border border-[#003366]/10 bg-white p-5 shadow-[0_24px_56px_-36px_rgba(0,51,102,.45)] sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-[17px] font-extrabold text-[#003366]">
                  Topic-Wise Question Difficulty &amp; Option Distribution
                </h3>
                <p className="text-[12px] text-[#5A6B8C]">
                  Grouped by topic to avoid clutter. Expand each topic to inspect question accuracy and student option selection percentages.
                </p>
              </div>

              {/* Subject Filter Dropdown on top right */}
              <div className="flex items-center gap-2">
                <label className="text-[12.5px] font-bold text-[#31407F]">Subject:</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="h-[38px] cursor-pointer rounded-xl border-[2px] border-[#003366] bg-white px-3 text-[13px] font-bold text-[#003366] shadow-[0_2px_0_#C6D2F8] outline-none transition-[border-color,box-shadow] focus:border-accent"
                >
                  <option value="ALL">All Subjects</option>
                  {availableSubjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredTopics.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#003366]/20 bg-white p-6 text-center text-[13px] text-[#5A6B8C]">
                No topics found for the selected subject filter.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredTopics.map((t) => {
                  const topicKey = `${t.subject}-${t.topic}`;
                  const isExpanded = !!expandedTopics[topicKey];

                  return (
                    <div
                      key={topicKey}
                      className="overflow-hidden rounded-2xl border border-[#003366]/15 bg-white transition-all shadow-sm"
                    >
                      {/* Topic Header Row (Accordion Trigger) */}
                      <button
                        type="button"
                        onClick={() => toggleTopic(topicKey)}
                        className="flex w-full flex-wrap items-center justify-between gap-3 bg-[#F8FAFF] px-4 py-3 text-left transition-colors hover:bg-[#EEF3FF]"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-[13px] font-bold text-[#003366]">{t.topic}</span>
                          <span className="rounded-full bg-ice px-2 py-0.5 text-[11px] font-bold text-[#003366]">
                            {t.subject}
                          </span>
                          <span className="rounded-md border border-[#003366]/15 bg-white px-2 py-0.5 text-[11px] font-medium text-[#5A6B8C]">
                            {t.questionCount} {t.questionCount === 1 ? 'Question' : 'Questions'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Accuracy bar */}
                          <div className="flex items-center gap-2">
                            <span className="text-[11.5px] text-[#5A6B8C]">Accuracy:</span>
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
                              className={`min-w-[34px] text-[12px] font-bold ${
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

                          {/* Status Badge */}
                          {t.isWeak ? (
                            <span className="rounded-full bg-[#FDF3F4] px-2 py-0.5 text-[11px] font-bold text-[#C8202F]">
                              ⚠️ Needs Revision
                            </span>
                          ) : t.isStrong ? (
                            <span className="rounded-full bg-[#EAF7EF] px-2 py-0.5 text-[11px] font-bold text-[#146C33]">
                              ✅ Mastered
                            </span>
                          ) : (
                            <span className="rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[11px] font-bold text-[#B45309]">
                              🟡 Average
                            </span>
                          )}

                          <span className="text-[13px] font-bold text-[#003366]">
                            {isExpanded ? '▲ Hide' : '▼ View Qs'}
                          </span>
                        </div>
                      </button>

                      {/* Expanded Questions List */}
                      {isExpanded && (
                        <div className="border-t border-[#003366]/10 p-4 bg-white">
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-[12.5px]">
                              <thead>
                                <tr className="border-b border-[#003366]/10 text-left text-[#5A6B8C]">
                                  <th className="w-[50px] px-2.5 py-2">Q#</th>
                                  <th className="px-2.5 py-2">Type</th>
                                  <th className="px-2.5 py-2">Difficulty</th>
                                  <th className="min-w-[140px] px-2.5 py-2">Batch Accuracy</th>
                                  <th className="px-2.5 py-2 text-center">Correct / Wrong / Skip</th>
                                  <th className="min-w-[200px] px-2.5 py-2">Option Selection %</th>
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
                                              q.accuracyPct >= 60
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
                                    <td className="px-2.5 py-2.5 text-center text-[11.5px]">
                                      <span className="font-semibold text-[#15803D]">+{q.correctCount}</span>{' '}
                                      <span className="text-[#003366]/20">/</span>{' '}
                                      <span className="font-semibold text-[#C8202F]">-{q.wrongCount}</span>{' '}
                                      <span className="text-[#003366]/20">/</span>{' '}
                                      <span className="text-[#5A6B8C]">{q.skippedCount}</span>
                                    </td>
                                    <td className="px-2.5 py-2.5">
                                      {q.optionPercentages && Object.keys(q.optionPercentages).length > 0 ? (
                                        <div className="flex flex-wrap items-center gap-1 text-[11px]">
                                          {Object.entries(q.optionPercentages).map(([opt, pct]) => (
                                            <span
                                              key={opt}
                                              className={`rounded px-1.5 py-0.5 font-medium ${
                                                opt === 'Skipped'
                                                  ? 'bg-[#F1F5F9] text-[#64748B]'
                                                  : 'bg-[#F3E8FF] text-[#003366]'
                                              }`}
                                            >
                                              {opt}: <strong className="font-bold">{pct}%</strong>
                                            </span>
                                          ))}
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
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-[16px] font-bold text-[#5A6B8C] transition hover:bg-[#E5E7EB] hover:text-[#003366]"
                title="Close"
              >
                ✕
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
                    <div className="text-center">
                      <div className="text-[11px] font-semibold uppercase text-[#5A6B8C]">Time Taken</div>
                      <div className="text-[18px] font-extrabold text-[#31407F]">
                        {formatTime(activeSubmission.score.timeTakenSeconds)}
                      </div>
                    </div>
                  </div>

                  {/* Filter Submissions Tabs */}
                  <div className="flex items-center justify-between gap-3 border-b border-[#003366]/10 pb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12.5px] font-bold text-[#003366]">Filter Questions:</span>
                      {(['all', 'incorrect', 'correct', 'skipped'] as const).map((mode) => (
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
                      const isCorrect = q.isCorrect;
                      const isSkipped = q.isSkipped;
                      const isWrong = !isCorrect && !isSkipped;

                      return (
                        <div
                          key={q.number}
                          className={`rounded-2xl border p-4 transition-all ${
                            isCorrect
                              ? 'border-[#15803D]/25 bg-white shadow-sm'
                              : isWrong
                                ? 'border-[#C8202F]/25 bg-white shadow-sm'
                                : 'border-[#003366]/15 bg-white shadow-sm'
                          }`}
                        >
                          {/* Question Meta Bar */}
                          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="rounded-lg bg-[#003366] px-2 py-0.5 text-[12px] font-extrabold text-white">
                                Q#{q.number}
                              </span>
                              <span className="rounded-md bg-ice px-2 py-0.5 text-[11px] font-bold text-[#003366]">
                                {q.subject}
                              </span>
                              <span className="rounded-md border border-[#003366]/15 bg-white px-2 py-0.5 text-[11px] font-semibold text-[#5A6B8C]">
                                {q.topic}
                              </span>
                              <span className="text-[11px] font-medium uppercase text-[#5A6B8C]">
                                {q.questionType.replace('mcq_', '')}
                              </span>
                            </div>

                            {/* Mark badge */}
                            <div>
                              {isCorrect ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF7EF] px-2.5 py-0.5 text-[11.5px] font-bold text-[#146C33]">
                                  <span>✓ Correct</span>
                                  <span>(+{q.marksAwarded})</span>
                                </span>
                              ) : isWrong ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#FDF3F4] px-2.5 py-0.5 text-[11.5px] font-bold text-[#C8202F]">
                                  <span>✕ Incorrect</span>
                                  <span>({q.marksAwarded})</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-[11.5px] font-bold text-[#64748B]">
                                  <span>⚪ Not Attempted</span>
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
                                  q.correctAnswer.toUpperCase().includes(letter);

                                let optBorder = 'border-[#003366]/15 bg-[#F8FAFF]';
                                if (isStudentPick && isCorrectOpt) {
                                  optBorder = 'border-[#15803D] bg-[#EAF7EF] text-[#146C33] font-medium';
                                } else if (isStudentPick && !isCorrectOpt) {
                                  optBorder = 'border-[#C8202F] bg-[#FDF3F4] text-[#C8202F] font-medium';
                                } else if (isCorrectOpt) {
                                  optBorder = 'border-[#15803D] border-dashed bg-[#F0FDF4] text-[#15803D]';
                                }

                                return (
                                  <div
                                    key={idx}
                                    className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-[12.5px] transition ${optBorder}`}
                                  >
                                    <span
                                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10.5px] font-bold ${
                                        isStudentPick && isCorrectOpt
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
                                        <div className="mt-1 text-[11px] font-bold">
                                          {isCorrectOpt
                                            ? '✓ Student Selected (Correct)'
                                            : '✕ Student Selected (Incorrect)'}
                                        </div>
                                      )}
                                      {!isStudentPick && isCorrectOpt && (
                                        <div className="mt-1 text-[11px] font-semibold text-[#15803D]">
                                          ✓ Correct Option
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
                                    isCorrect ? 'text-[#15803D]' : isWrong ? 'text-[#C8202F]' : 'text-[#5A6B8C]'
                                  }`}
                                >
                                  {q.studentAnswer ?? 'None (Skipped)'}
                                </span>
                              </div>
                              <div>
                                <span className="font-semibold text-[#5A6B8C]">Correct Answer: </span>
                                <span className="font-bold text-[#15803D]">{q.correctAnswer}</span>
                              </div>
                            </div>
                          )}

                          {/* Explanation */}
                          {q.explanation && (
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
