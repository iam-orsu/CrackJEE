'use client';

import React, { useEffect, useState } from 'react';
import {
  facultyGetAssignmentReport,
  facultyListAssignments,
  type FacultyAssignmentReport,
  type FacultyAssignmentSummary,
} from '@/lib/faculty';

const SELECT =
  'h-[46px] min-w-[260px] cursor-pointer rounded-xl border-[2.5px] border-[#003366] bg-white px-3 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none';

interface FacultyReportsTabProps {
  initialAssignmentId?: string | null;
}

export function FacultyReportsTab({ initialAssignmentId }: FacultyReportsTabProps) {
  const [assignments, setAssignments] = useState<FacultyAssignmentSummary[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(initialAssignmentId || '');
  const [report, setReport] = useState<FacultyAssignmentReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      .then((res) => setReport(res.report))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedAssignmentId]);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
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
          <div className="flex items-center gap-2.5">
            <label className="text-[13px] font-medium text-[#31407F]">Select Exam:</label>
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

      {error && <div className="mb-3.5 rounded-2xl border border-[#C8202F]/25 bg-[#FDF3F4] px-3.5 py-2.5 text-[13px] font-semibold text-[#C8202F]">{error}</div>}

      {loading ? (
        <div className="px-10 py-10 text-center text-[#5A6B8C]">
          Loading batch performance data...
        </div>
      ) : !report ? (
        <div className="rounded-3xl border border-dashed border-[#003366]/20 bg-white px-5 py-9 text-center text-[13.5px] font-medium text-[#5A6B8C]">
          No assignment selected or no assigned exams found. Assign an exam to a batch to view reports.
        </div>
      ) : (
        <>
          {/* Summary Overview Cards */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            <div className="rounded-[28px] border border-[#003366]/10 bg-white p-5 text-center shadow-[0_24px_56px_-36px_rgba(0,51,102,.45)] sm:p-6">
              <div className="text-[12px] font-semibold uppercase text-[#5A6B8C]">
                Batch Average
              </div>
              <div className="my-2 font-display text-[28px] font-extrabold text-[#003366]">
                {report.summary.avgScore}
              </div>
              <div className="text-[12px] text-[#5A6B8C]">Marks</div>
            </div>

            <div className="rounded-[28px] border border-[#003366]/10 bg-white p-5 text-center shadow-[0_24px_56px_-36px_rgba(0,51,102,.45)] sm:p-6">
              <div className="text-[12px] font-semibold uppercase text-[#5A6B8C]">
                Highest Score
              </div>
              <div className="my-2 font-display text-[28px] font-extrabold text-accent">
                {report.summary.highestScore}
              </div>
              <div className="text-[12px] text-[#5A6B8C]">Marks (Top Rank)</div>
            </div>

            <div className="rounded-[28px] border border-[#003366]/10 bg-white p-5 text-center shadow-[0_24px_56px_-36px_rgba(0,51,102,.45)] sm:p-6">
              <div className="text-[12px] font-semibold uppercase text-[#5A6B8C]">
                Lowest Score
              </div>
              <div className="my-2 font-display text-[28px] font-extrabold text-[#C8202F]">
                {report.summary.lowestScore}
              </div>
              <div className="text-[12px] text-[#5A6B8C]">Marks</div>
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
          </div>

          {/* Student Leaderboard Table */}
          <div className="rounded-[28px] border border-[#003366]/10 bg-white p-5 shadow-[0_24px_56px_-36px_rgba(0,51,102,.45)] sm:p-6">
            <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2.5 font-display text-[17px] font-extrabold text-[#003366]">
              <span>Batch Leaderboard &amp; Rankings ({report.rankList.length})</span>
              <span className="text-[12px] font-normal text-[#5A6B8C]">
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
                      <th className="w-[60px] px-3 py-2.5">Rank</th>
                      <th className="px-3 py-2.5">Roll Number</th>
                      <th className="px-3 py-2.5">Student Name</th>
                      <th className="px-3 py-2.5 text-center">Score / Max</th>
                      <th className="px-3 py-2.5 text-center">Accuracy</th>
                      <th className="px-3 py-2.5 text-center">Correct / Wrong / Skip</th>
                      <th className="px-3 py-2.5 text-right">Time Taken</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.rankList.map((st) => {
                      const medal = st.rank === 1 ? '🥇' : st.rank === 2 ? '🥈' : st.rank === 3 ? '🥉' : `#${st.rank}`;
                      const totalAttempted = st.correctCount + st.incorrectCount;
                      const accuracy = totalAttempted > 0 ? Math.round((st.correctCount / totalAttempted) * 100) : 0;

                      return (
                        <tr key={st.studentId} className="border-b border-[#003366]/10">
                          <td className="px-3 py-3 text-[14px] font-bold text-[#003366]">
                            {medal}
                          </td>
                          <td className="px-3 py-3 font-semibold text-accent">
                            {st.rollNumber}
                          </td>
                          <td className="px-3 py-3 font-medium text-[#003366]">
                            {st.name}
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span className={st.totalScore >= 0 ? 'font-bold text-[#003366]' : 'font-bold text-[#C8202F]'}>
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
                          <td className="px-3 py-3 text-right text-[12px] text-[#5A6B8C]">
                            {formatTime(st.timeTakenSeconds)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Question-by-Question Batch Accuracy Analysis */}
          <div className="rounded-[28px] border border-[#003366]/10 bg-white p-5 shadow-[0_24px_56px_-36px_rgba(0,51,102,.45)] sm:p-6">
            <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2.5 font-display text-[17px] font-extrabold text-[#003366]">
              <span>Question Difficulty &amp; Error Analysis</span>
              <span className="text-[12px] font-normal text-[#5A6B8C]">
                Identifies questions and topics the batch struggled with most
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr className="border-b-2 border-[#003366]/10 text-left text-[#5A6B8C]">
                    <th className="w-[50px] px-3 py-2.5">Q#</th>
                    <th className="px-3 py-2.5">Subject</th>
                    <th className="px-3 py-2.5">Topic</th>
                    <th className="px-3 py-2.5">Type</th>
                    <th className="min-w-[160px] px-3 py-2.5">Batch Accuracy</th>
                    <th className="px-3 py-2.5 text-right">Correct / Wrong / Skip</th>
                  </tr>
                </thead>
                <tbody>
                  {report.questionAnalytics.map((q) => (
                    <tr key={q.questionNumber} className="border-b border-[#003366]/10">
                      <td className="px-3 py-3 font-semibold text-[#003366]">
                        #{q.questionNumber}
                      </td>
                      <td className="px-3 py-3 font-medium text-[#31407F]">
                        {q.subject}
                      </td>
                      <td className="px-3 py-3 text-[#5A6B8C]">
                        {q.topic}
                      </td>
                      <td className="px-3 py-3">
                        <span className="rounded bg-ice px-1.5 py-0.5 text-[11px] font-bold uppercase text-[#003366]">
                          {q.questionType.replace('mcq_', '')}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#F1E3E5]">
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
                          <span className="min-w-[32px] text-[11px] font-semibold">
                            {q.accuracyPct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right text-[12px]">
                        <span className="font-semibold text-[#15803D]">{q.correctCount}</span>{' '}
                        <span className="text-[#003366]/20">/</span>{' '}
                        <span className="font-semibold text-[#C8202F]">{q.wrongCount}</span>{' '}
                        <span className="text-[#003366]/20">/</span>{' '}
                        <span className="text-[#5A6B8C]">{q.skippedCount}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
