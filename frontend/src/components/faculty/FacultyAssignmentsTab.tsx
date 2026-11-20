'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ChartColumn, Clock, Eye, Lock, CheckSquare } from 'lucide-react';
import {
  facultyCreateAssignment,
  facultyDeleteAssignment,
  facultyListAssignments,
  facultyListBatches,
  facultyListPapers,
  facultyUpdateAssignmentReleaseMode,
  type FacultyAssignmentSummary,
  type FacultyBatch,
  type FacultyPaperSummary,
  type ResultReleaseMode,
} from '@/lib/faculty';

const BTN_PRIMARY =
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#5A2560] bg-grad px-4 py-2 text-[13px] font-extrabold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[3px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none';
const BTN_SECONDARY =
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none';

interface FacultyAssignmentsTabProps {
  onViewReport: (assignmentId: string) => void;
}

export function FacultyAssignmentsTab({ onViewReport }: FacultyAssignmentsTabProps) {
  const [assignments, setAssignments] = useState<FacultyAssignmentSummary[]>([]);
  const [batches, setBatches] = useState<FacultyBatch[]>([]);
  const [readyPapers, setReadyPapers] = useState<FacultyPaperSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Assign modal state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedPaperId, setSelectedPaperId] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<number | ''>(60);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [resultReleaseMode, setResultReleaseMode] = useState<ResultReleaseMode>('full');
  const [showGoalToStudents, setShowGoalToStudents] = useState(false);
  const [assignSubmitting, setAssignSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [assignRes, batchRes, paperRes] = await Promise.all([
        facultyListAssignments(),
        facultyListBatches(),
        facultyListPapers(),
      ]);
      setAssignments(assignRes.assignments);
      setBatches(batchRes.batches);
      const ready = paperRes.papers.filter((p) => p.status === 'ready');
      setReadyPapers(ready);
      if (ready.length > 0 && !selectedPaperId) setSelectedPaperId(ready[0]!.id);
      if (batchRes.batches.length > 0 && !selectedBatchId) setSelectedBatchId(batchRes.batches[0]!.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, [selectedPaperId, selectedBatchId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleAssignSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPaperId || !selectedBatchId || !title.trim()) return;
    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      setError('End window must be after start window');
      return;
    }
    setAssignSubmitting(true);
    setError('');
    try {
      await facultyCreateAssignment({
        paperId: selectedPaperId,
        batchId: selectedBatchId,
        title: title.trim(),
        instructions: instructions.trim() || undefined,
        durationMinutes: typeof durationMinutes === 'number' && durationMinutes >= 10 ? durationMinutes : 60,
        startTime: startTime ? new Date(startTime).toISOString() : null,
        endTime: endTime ? new Date(endTime).toISOString() : null,
        showSolutions: resultReleaseMode === 'full',
        resultReleaseMode,
        showGoalToStudents,
      });
      setAssignModalOpen(false);
      setTitle('');
      setInstructions('');
      setResultReleaseMode('full');
      setShowGoalToStudents(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign exam');
    } finally {
      setAssignSubmitting(false);
    }
  }

  async function handleDeleteAssignment(id: string, titleStr: string) {
    if (!confirm(`Delete exam assignment "${titleStr}"? All student exam results for this assignment will also be removed.`)) {
      return;
    }
    try {
      await facultyDeleteAssignment(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete assignment');
    }
  }

  const [updatingModeId, setUpdatingModeId] = useState<string | null>(null);

  async function handleUpdateReleaseMode(id: string, newMode: ResultReleaseMode) {
    setUpdatingModeId(id);
    try {
      const res = await facultyUpdateAssignmentReleaseMode(id, newMode);
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, showSolutions: res.showSolutions, resultReleaseMode: res.resultReleaseMode }
            : a,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update result release mode');
    } finally {
      setUpdatingModeId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-[18px] font-extrabold text-[#003366]">Assign Mock Exams</h2>
          <p className="text-[13px] text-[#5A6B8C]">
            Assign verified question papers to student batches with scheduled exam windows and CBT timings.
          </p>
        </div>
        <button
          type="button"
          className={BTN_PRIMARY}
          onClick={() => {
            if (readyPapers.length === 0) {
              alert('You do not have any ready papers yet. Please generate a question paper in Paper Studio first.');
              return;
            }
            if (batches.length === 0) {
              alert('Please create at least one batch first in Batches & Students.');
              return;
            }
            const defaultPaper = readyPapers.find((p) => p.id === selectedPaperId) || readyPapers[0];
            if (defaultPaper && !title.trim()) {
              setTitle(defaultPaper.title);
            }
            setAssignModalOpen(true);
          }}
        >
          + Assign New Exam
        </button>
      </div>

      {error && <div className="mb-3.5 rounded-2xl border border-[#C8202F]/25 bg-[#FDF3F4] px-3.5 py-2.5 text-[13px] font-semibold text-[#C8202F]">{error}</div>}

      {/* Assignments List */}
      {loading ? (
        <div className="px-9 py-9 text-center text-[#5A6B8C]">
          Loading assigned exams...
        </div>
      ) : assignments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#003366]/20 bg-white px-5 py-9 text-center text-[13.5px] font-medium text-[#5A6B8C]">
          No exams assigned yet. Click <strong>+ Assign New Exam</strong> to assign a paper to one of your batches.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {assignments.map((a) => {
            const completionRate =
              a.stats.totalEnrolled > 0
                ? Math.round((a.stats.submittedCount / a.stats.totalEnrolled) * 100)
                : 0;

            return (
              <div
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-[#003366]/10 bg-white px-6 py-5"
              >
                <div className="flex-[1_1_320px]">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-accent-50 px-2 py-0.5 text-[11px] font-bold tracking-[0.04em] text-accent">
                      {a.batch.name} ({a.batch.code})
                    </span>
                    <span className="rounded-md bg-ice px-2 py-0.5 text-[11px] font-semibold text-[#003366]">
                      {a.paper.examType} • {a.paper.questionCount} Questions
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[12px] text-[#5A6B8C]">
                      <Clock className="h-[13px] w-[13px] shrink-0" aria-hidden />
                      {a.durationMinutes} mins
                    </span>
                    {(() => {
                      const mode: ResultReleaseMode = a.resultReleaseMode || (a.showSolutions ? 'full' : 'responses_only');
                      if (mode === 'locked') {
                        return (
                          <span
                            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold border border-[#803688]/25 bg-[#FDF8FF] text-[#803688]"
                            title="Complete Lock: Students only see submission confirmation; score, answers, and solutions are locked."
                          >
                            <Lock className="h-3 w-3" />
                            Results: Locked
                          </span>
                        );
                      }
                      if (mode === 'responses_only') {
                        return (
                          <span
                            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold border border-[#003366]/25 bg-[#EEF2FF] text-[#003366]"
                            title="Student Responses Only: Students see their marked choices; answer key and solutions are locked."
                          >
                            <CheckSquare className="h-3 w-3" />
                            Results: Responses Only
                          </span>
                        );
                      }
                      return (
                        <span
                          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold border border-[#15803D]/25 bg-[#F0FDF4] text-[#15803D]"
                          title="Full Solutions: Students see full scorecard, correct answers, and step-by-step solutions."
                        >
                          <Eye className="h-3 w-3" />
                          Results: Full Solutions
                        </span>
                      );
                    })()}
                  </div>

                  <h3 className="text-[16px] font-bold text-[#003366]">
                    {a.title}
                  </h3>

                  <div className="mt-1 text-[12px] text-[#5A6B8C]">
                    Paper: <strong>{a.paper.title}</strong>
                    {a.startTime && (
                      <> • Window opens: {new Date(a.startTime).toLocaleDateString()}</>
                    )}
                    {a.endTime && (
                      <> • Closes: {new Date(a.endTime).toLocaleDateString()}</>
                    )}
                  </div>
                </div>

                {/* Submission and Average Score Stats */}
                <div className="flex items-center gap-5 rounded-xl border border-[#003366]/10 bg-ice px-4 py-2.5">
                  <div className="text-center">
                    <div className="text-[11px] font-semibold uppercase text-[#5A6B8C]">
                      Submissions
                    </div>
                    <div className="text-[16px] font-bold text-[#003366]">
                      {a.stats.submittedCount} / {a.stats.totalEnrolled}
                    </div>
                    <div className="text-[11px] text-accent">
                      {completionRate}% completed
                    </div>
                  </div>

                  <div className="h-8 w-px bg-[#003366]/10" />

                  <div className="text-center">
                    <div className="text-[11px] font-semibold uppercase text-[#5A6B8C]">
                      Batch Avg
                    </div>
                    <div className="text-[16px] font-bold text-[#003366]">
                      {a.stats.avgScore}
                    </div>
                    <div className="text-[11px] text-[#5A6B8C]">
                      Marks
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-xl border border-[#003366]/20 bg-white px-2.5 py-1.5 shadow-[0_2px_0_#C6D2F8]">
                    <span className="text-[11.5px] font-extrabold text-[#5A6B8C]">Release:</span>
                    <select
                      value={a.resultReleaseMode || (a.showSolutions ? 'full' : 'responses_only')}
                      onChange={(e) => handleUpdateReleaseMode(a.id, e.target.value as ResultReleaseMode)}
                      disabled={updatingModeId === a.id}
                      className="cursor-pointer rounded-lg border-0 bg-transparent py-0.5 text-[12px] font-bold text-[#003366] outline-none hover:bg-ice"
                      title="Switch student result release mode"
                    >
                      <option value="locked">1. Locked (Skip Result)</option>
                      <option value="responses_only">2. Responses Only</option>
                      <option value="full">3. Full Solutions</option>
                    </select>
                    {updatingModeId === a.id && (
                      <span className="text-[11px] font-semibold text-[#803688] animate-pulse">...</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className={BTN_PRIMARY}
                    onClick={() => onViewReport(a.id)}
                  >
                    <ChartColumn className="h-[14px] w-[14px] shrink-0" aria-hidden />
                    View Batch Report
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAssignment(a.id, a.title)}
                    className="cursor-pointer rounded-lg border-0 bg-transparent px-2.5 py-2 text-[13px] text-[#C8202F] transition-colors duration-150 hover:bg-[#FDF3F4] motion-reduce:transition-none"
                    title="Delete Exam Assignment"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Assign Exam */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0F172A]/45 p-5" onClick={() => setAssignModalOpen(false)}>
          <div className="w-full max-w-[520px] max-h-[90vh] overflow-y-auto rounded-[22px] border border-[#003366]/10 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.12)] sm:px-7" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 font-display text-[18px] font-extrabold text-[#003366]">
              Assign Exam to Batch
            </h3>
            <form onSubmit={handleAssignSubmit} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#003366]">Select Question Paper</label>
                <select
                  className="h-[46px] w-full cursor-pointer rounded-xl border-[2.5px] border-[#003366] bg-white px-3 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                  value={selectedPaperId}
                  onChange={(e) => {
                    const nextId = e.target.value;
                    setSelectedPaperId(nextId);
                    const matched = readyPapers.find((p) => p.id === nextId);
                    if (matched && (!title.trim() || readyPapers.some((p) => p.title === title.trim()))) {
                      setTitle(matched.title);
                    }
                  }}
                  required
                >
                  {readyPapers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.paperCode ? `[${p.paperCode}] ` : ''}{p.title} ({p.examType} • {p.questionCount} Qs)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#003366]">Select Target Batch</label>
                <select
                  className="h-[46px] w-full cursor-pointer rounded-xl border-[2.5px] border-[#003366] bg-white px-3 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  required
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.code}) — {b._count?.students || 0} students
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#003366]">Exam Title</label>
                <input
                  type="text"
                  className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                  placeholder="e.g. Weekly Full Length CBT Mock Drill #3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#003366]">Exam Duration</label>
                <div className="mb-2 flex gap-2">
                  {[60, 90, 180].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      className={durationMinutes === mins ? BTN_PRIMARY : BTN_SECONDARY}
                      onClick={() => setDurationMinutes(mins)}
                    >
                      {mins} Mins
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                  min={10}
                  max={360}
                  placeholder="e.g. 60"
                  value={durationMinutes}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setDurationMinutes('');
                      return;
                    }
                    const num = parseInt(val, 10);
                    setDurationMinutes(isNaN(num) ? '' : num);
                  }}
                  onBlur={() => {
                    if (durationMinutes === '' || durationMinutes < 10) {
                      setDurationMinutes(60);
                    } else if (durationMinutes > 360) {
                      setDurationMinutes(360);
                    }
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-extrabold text-[#003366]">Start Window (Optional)</label>
                  <input
                    type="datetime-local"
                    className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-extrabold text-[#003366]">End Window (Optional)</label>
                  <input
                    type="datetime-local"
                    className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#003366]">Exam Instructions (Optional)</label>
                <textarea
                  className="min-h-[76px] w-full resize-y rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2.5 text-[14px] font-semibold leading-relaxed text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                  rows={2}
                  placeholder="e.g. Read each question carefully. Standard negative marking applies."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2 rounded-xl border-[2px] border-[#003366]/20 bg-[#F8FAFF] p-4">
                <label className="text-[13px] font-extrabold text-[#003366]">
                  Student Result Release Mode
                </label>
                <p className="text-[11.5px] font-medium text-[#5A6B8C]">
                  Choose what students see immediately upon exam submission. You can change this anytime from the assignment list.
                </p>
                <div className="mt-1 flex flex-col gap-2">
                  <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${resultReleaseMode === 'locked' ? 'border-[#803688] bg-[#FDF8FF]' : 'border-[#003366]/15 bg-white'}`}>
                    <input
                      type="radio"
                      name="releaseMode"
                      value="locked"
                      checked={resultReleaseMode === 'locked'}
                      onChange={() => setResultReleaseMode('locked')}
                      className="mt-0.5 h-4 w-4 accent-[#803688]"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-[13px] text-[#003366]">1. Complete Lock (Skip Result)</span>
                      <p className="mt-0.5 text-[11.5px] text-[#5A6B8C]">
                        Students only see &quot;Thank you for submitting&quot;. Scores, rank, submitted responses, and answer keys are locked.
                      </p>
                    </div>
                  </label>

                  <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${resultReleaseMode === 'responses_only' ? 'border-[#003366] bg-[#EEF2FF]' : 'border-[#003366]/15 bg-white'}`}>
                    <input
                      type="radio"
                      name="releaseMode"
                      value="responses_only"
                      checked={resultReleaseMode === 'responses_only'}
                      onChange={() => setResultReleaseMode('responses_only')}
                      className="mt-0.5 h-4 w-4 accent-[#003366]"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-[13px] text-[#003366]">2. Student Responses Only</span>
                      <p className="mt-0.5 text-[11.5px] text-[#5A6B8C]">
                        Students can review questions and their marked choices. Correct answer keys, scores, and step-by-step solutions remain locked.
                      </p>
                    </div>
                  </label>

                  <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${resultReleaseMode === 'full' ? 'border-[#15803D] bg-[#F0FDF4]' : 'border-[#003366]/15 bg-white'}`}>
                    <input
                      type="radio"
                      name="releaseMode"
                      value="full"
                      checked={resultReleaseMode === 'full'}
                      onChange={() => setResultReleaseMode('full')}
                      className="mt-0.5 h-4 w-4 accent-[#15803D]"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-[13px] text-[#003366]">3. Full Solutions Release</span>
                      <p className="mt-0.5 text-[11.5px] text-[#5A6B8C]">
                        Students see their full scorecard, their marked choices, the correct answer keys, and detailed solutions.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {readyPapers.find((p) => p.id === selectedPaperId)?.examType === 'Psychometric' && (
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#803688]/30 bg-[#FDF8FF] p-3 text-[13px] font-medium text-[#803688]">
                  <input
                    type="checkbox"
                    checked={showGoalToStudents}
                    onChange={(e) => setShowGoalToStudents(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#803688]"
                  />
                  <span>Show Evaluation Target / Professor Goal to students in their results</span>
                </label>
              )}

              <div className="mt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  className={BTN_SECONDARY}
                  onClick={() => setAssignModalOpen(false)}
                  disabled={assignSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className={BTN_PRIMARY} disabled={assignSubmitting}>
                  {assignSubmitting ? 'Assigning...' : 'Publish & Assign Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
