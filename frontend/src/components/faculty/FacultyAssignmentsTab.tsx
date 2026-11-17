'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  facultyCreateAssignment,
  facultyDeleteAssignment,
  facultyListAssignments,
  facultyListBatches,
  facultyListPapers,
  type FacultyAssignmentSummary,
  type FacultyBatch,
  type FacultyPaperSummary,
} from '@/lib/faculty';
import styles from '@/app/faculty/faculty.module.css';

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
  const [durationMinutes, setDurationMinutes] = useState(180);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showSolutions, setShowSolutions] = useState(true);
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
    setAssignSubmitting(true);
    setError('');
    try {
      await facultyCreateAssignment({
        paperId: selectedPaperId,
        batchId: selectedBatchId,
        title: title.trim(),
        instructions: instructions.trim() || undefined,
        durationMinutes,
        startTime: startTime ? new Date(startTime).toISOString() : null,
        endTime: endTime ? new Date(endTime).toISOString() : null,
        showSolutions,
      });
      setAssignModalOpen(false);
      setTitle('');
      setInstructions('');
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)' }}>Assign Mock Exams</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
            Assign verified question papers to student batches with scheduled exam windows and CBT timings.
          </p>
        </div>
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={() => {
            if (readyPapers.length === 0) {
              alert('You do not have any ready papers yet. Please generate a question paper in Paper Studio first.');
              return;
            }
            if (batches.length === 0) {
              alert('Please create at least one batch first in Batches & Students.');
              return;
            }
            setAssignModalOpen(true);
          }}
        >
          + Assign New Exam
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Assignments List */}
      {loading ? (
        <div style={{ padding: '36px', textAlign: 'center', color: 'var(--muted)' }}>
          Loading assigned exams…
        </div>
      ) : assignments.length === 0 ? (
        <div className={styles.emptyState}>
          No exams assigned yet. Click <strong>+ Assign New Exam</strong> to assign a paper to one of your batches.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {assignments.map((a) => {
            const completionRate =
              a.stats.totalEnrolled > 0
                ? Math.round((a.stats.submittedCount / a.stats.totalEnrolled) * 100)
                : 0;

            return (
              <div
                key={a.id}
                style={{
                  background: '#fff',
                  border: '1px solid var(--line)',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '20px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: '1 1 320px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        color: 'var(--accent)',
                        background: 'var(--accent-bg)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {a.batch.name} ({a.batch.code})
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#6366f1',
                        background: '#eef2ff',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {a.paper.examType} • {a.paper.questionCount} Questions
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      ⏱ {a.durationMinutes} mins
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>
                    {a.title}
                  </h3>

                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
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
                <div
                  style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    background: 'var(--surface)',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--line)',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Submissions
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>
                      {a.stats.submittedCount} / {a.stats.totalEnrolled}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--accent)' }}>
                      {completionRate}% completed
                    </div>
                  </div>

                  <div style={{ width: '1px', height: '32px', background: 'var(--line)' }} />

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Batch Avg
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>
                      {a.stats.avgScore}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                      Marks
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={() => onViewReport(a.id)}
                    style={{ fontSize: '13px', padding: '8px 14px' }}
                  >
                    📊 View Batch Report
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAssignment(a.id, a.title)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '13px',
                      padding: '8px 10px',
                    }}
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
        <div className={styles.modalOverlay} onClick={() => setAssignModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)', marginBottom: '16px' }}>
              Assign Exam to Batch
            </h3>
            <form onSubmit={handleAssignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className={styles.field}>
                <label className={styles.label}>Select Question Paper</label>
                <select
                  className={styles.select}
                  value={selectedPaperId}
                  onChange={(e) => setSelectedPaperId(e.target.value)}
                  required
                >
                  {readyPapers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.paperCode ? `[${p.paperCode}] ` : ''}{p.title} ({p.examType} • {p.questionCount} Qs)
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Select Target Batch</label>
                <select
                  className={styles.select}
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

              <div className={styles.field}>
                <label className={styles.label}>Exam Title</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Weekly Full Length CBT Mock Drill #3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Exam Duration</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  {[60, 90, 180].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      className={durationMinutes === mins ? styles.btnPrimary : styles.btnSecondary}
                      style={{ fontSize: '12px', padding: '4px 10px' }}
                      onClick={() => setDurationMinutes(mins)}
                    >
                      {mins} Mins
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  className={styles.input}
                  min={10}
                  max={360}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className={styles.field}>
                  <label className={styles.label}>Start Window (Optional)</label>
                  <input
                    type="datetime-local"
                    className={styles.input}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>End Window (Optional)</label>
                  <input
                    type="datetime-local"
                    className={styles.input}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Exam Instructions (Optional)</label>
                <textarea
                  className={styles.textarea}
                  rows={2}
                  placeholder="e.g. Read each question carefully. Standard negative marking applies."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showSolutions}
                  onChange={(e) => setShowSolutions(e.target.checked)}
                />
                <span>Allow students to view detailed step-by-step solutions after submission</span>
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setAssignModalOpen(false)}
                  disabled={assignSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={assignSubmitting}>
                  {assignSubmitting ? 'Assigning…' : 'Publish & Assign Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
