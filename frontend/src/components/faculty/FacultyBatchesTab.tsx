'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  facultyCreateBatch,
  facultyCreateStudent,
  facultyDeleteBatch,
  facultyDeleteStudent,
  facultyListBatches,
  facultyListStudents,
  type FacultyBatch,
  type FacultyStudent,
} from '@/lib/faculty';
import styles from '@/app/faculty/faculty.module.css';

export function FacultyBatchesTab() {
  const [batches, setBatches] = useState<FacultyBatch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('all');
  const [students, setStudents] = useState<FacultyStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Batch modal
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchName, setBatchName] = useState('');
  const [batchCode, setBatchCode] = useState('');
  const [batchDesc, setBatchDesc] = useState('');
  const [batchSubmitting, setBatchSubmitting] = useState(false);

  // Student modal
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [targetBatchId, setTargetBatchId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentSubmitting, setStudentSubmitting] = useState(false);

  // Credentials notification banner
  const [createdCredentials, setCreatedCredentials] = useState<{
    name: string;
    rollNumber: string;
    password: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [batchRes, studentRes] = await Promise.all([
        facultyListBatches(),
        facultyListStudents(selectedBatchId !== 'all' ? selectedBatchId : undefined),
      ]);
      setBatches(batchRes.batches);
      setStudents(studentRes.students);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load batches');
    } finally {
      setLoading(false);
    }
  }, [selectedBatchId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleCreateBatch(e: React.FormEvent) {
    e.preventDefault();
    if (!batchName.trim() || !batchCode.trim()) return;
    setBatchSubmitting(true);
    setError('');
    try {
      await facultyCreateBatch({
        name: batchName.trim(),
        code: batchCode.trim(),
        description: batchDesc.trim() || undefined,
      });
      setBatchModalOpen(false);
      setBatchName('');
      setBatchCode('');
      setBatchDesc('');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create batch');
    } finally {
      setBatchSubmitting(false);
    }
  }

  async function handleDeleteBatch(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete batch "${name}"? This will also remove its student accounts.`)) {
      return;
    }
    try {
      await facultyDeleteBatch(id);
      if (selectedBatchId === id) setSelectedBatchId('all');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete batch');
    }
  }

  async function handleCreateStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!targetBatchId || !studentName.trim() || !studentRoll.trim()) return;
    setStudentSubmitting(true);
    setError('');
    try {
      const res = await facultyCreateStudent({
        batchId: targetBatchId,
        name: studentName.trim(),
        rollNumber: studentRoll.trim(),
        email: studentEmail.trim() || undefined,
        password: studentPassword.trim() || undefined,
      });
      setCreatedCredentials({
        name: res.student.name,
        rollNumber: res.student.rollNumber,
        password: res.initialPassword || res.student.rollNumber,
      });
      setStudentModalOpen(false);
      setStudentName('');
      setStudentRoll('');
      setStudentEmail('');
      setStudentPassword('');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add student');
    } finally {
      setStudentSubmitting(false);
    }
  }

  async function handleDeleteStudent(id: string, name: string) {
    if (!confirm(`Remove student "${name}" from this batch?`)) return;
    try {
      await facultyDeleteStudent(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove student');
    }
  }

  function copyCredentials() {
    if (!createdCredentials) return;
    const text = `Student Portal Login Credentials\nPortal: /student-portal\nRoll Number: ${createdCredentials.rollNumber}\nPassword: ${createdCredentials.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)' }}>Batches &amp; Student Management</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
            Organize students into batches and manage their isolated student portal credentials.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => setBatchModalOpen(true)}
          >
            + Create New Batch
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => {
              if (batches.length > 0) {
                setTargetBatchId(batches[0]!.id);
                setStudentModalOpen(true);
              } else {
                alert('Please create at least one batch first before adding students.');
              }
            }}
          >
            + Add Student
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Newly Created Student Credentials Notification */}
      {createdCredentials && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ fontWeight: 600, color: '#065f46', fontSize: '14px' }}>
              ✓ Student Created Successfully!
            </div>
            <div style={{ fontSize: '13px', color: '#047857', marginTop: '4px' }}>
              <strong>{createdCredentials.name}</strong> • Roll No:{' '}
              <code>{createdCredentials.rollNumber}</code> • Password:{' '}
              <code>{createdCredentials.password}</code>
            </div>
            <div style={{ fontSize: '12px', color: '#059669', marginTop: '2px' }}>
              Students can sign in directly at <strong>/student-portal</strong> using these credentials.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className={styles.btnSecondary}
              style={{ fontSize: '12px', padding: '6px 12px' }}
              onClick={copyCredentials}
            >
              {copied ? '✓ Copied to Clipboard!' : 'Copy Credentials'}
            </button>
            <button
              type="button"
              className={styles.btnGhost}
              style={{ fontSize: '12px' }}
              onClick={() => setCreatedCredentials(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Batches Cards Grid */}
      <div>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink-2)', marginBottom: '12px' }}>
          Active Batches ({batches.length})
        </h3>
        {batches.length === 0 ? (
          <div className={styles.emptyState}>
            No batches created yet. Click <strong>+ Create New Batch</strong> above to set up your first student cohort.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {batches.map((b) => {
              const isSelected = selectedBatchId === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBatchId(isSelected ? 'all' : b.id)}
                  style={{
                    background: '#fff',
                    border: isSelected ? '2px solid var(--accent)' : '1px solid var(--line)',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 14px rgba(15, 118, 110, 0.12)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                        {b.code}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBatch(b.id, b.name);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '12px',
                          padding: '2px 6px',
                        }}
                        title="Delete Batch"
                      >
                        ✕
                      </button>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', marginTop: '8px' }}>
                      {b.name}
                    </div>
                    {b.description && (
                      <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                        {b.description}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '12px',
                      color: 'var(--muted)',
                      borderTop: '1px solid var(--line)',
                      paddingTop: '10px',
                    }}
                  >
                    <span>
                      👥 <strong>{b._count?.students || 0}</strong> students
                    </span>
                    <span>
                      📋 <strong>{b._count?.assignments || 0}</strong> exams
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Students Table */}
      <div className={styles.panel} style={{ marginTop: '8px' }}>
        <div className={styles.panelTitle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>Students ({students.length})</span>
            {selectedBatchId !== 'all' && (
              <button
                type="button"
                className={styles.btnGhost}
                style={{ fontSize: '12px', padding: '2px 8px' }}
                onClick={() => setSelectedBatchId('all')}
              >
                Showing single batch • Click to view all
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{ fontSize: '12px', color: 'var(--muted)' }}>Filter Batch:</label>
            <select
              className={styles.select}
              style={{ fontSize: '12px', padding: '4px 8px' }}
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
            >
              <option value="all">All Batches</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)', fontSize: '14px' }}>
            Loading students…
          </div>
        ) : students.length === 0 ? (
          <div className={styles.emptyState}>
            No students found in this batch. Click <strong>+ Add Student</strong> to enroll students.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--line)', textAlign: 'left', color: 'var(--muted)' }}>
                  <th style={{ padding: '10px 12px' }}>Roll Number</th>
                  <th style={{ padding: '10px 12px' }}>Student Name</th>
                  <th style={{ padding: '10px 12px' }}>Batch</th>
                  <th style={{ padding: '10px 12px' }}>Email</th>
                  <th style={{ padding: '10px 12px' }}>Exams Taken</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '12px', fontWeight: 600, color: 'var(--accent)' }}>
                      {s.rollNumber}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 500, color: 'var(--ink)' }}>
                      {s.name}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--muted)' }}>
                      <span
                        style={{
                          background: 'var(--surface)',
                          border: '1px solid var(--line)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '11px',
                        }}
                      >
                        {s.batch?.code || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--muted)' }}>
                      {s.email || '—'}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--ink)' }}>
                      {s._count?.examSessions || 0}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteStudent(s.id, s.name)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create Batch */}
      {batchModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setBatchModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)', marginBottom: '16px' }}>
              Create New Batch
            </h3>
            <form onSubmit={handleCreateBatch} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className={styles.field}>
                <label className={styles.label}>Batch Name</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. JEE 2026 Achievers"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Batch Code (Identifier)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. ACHIEVERS-A"
                  value={batchCode}
                  onChange={(e) => setBatchCode(e.target.value.toUpperCase())}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Description (Optional)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Morning classroom cohort"
                  value={batchDesc}
                  onChange={(e) => setBatchDesc(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setBatchModalOpen(false)}
                  disabled={batchSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={batchSubmitting}>
                  {batchSubmitting ? 'Creating…' : 'Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Student */}
      {studentModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setStudentModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)', marginBottom: '16px' }}>
              Add Student to Batch
            </h3>
            <form onSubmit={handleCreateStudent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className={styles.field}>
                <label className={styles.label}>Assign to Batch</label>
                <select
                  className={styles.select}
                  value={targetBatchId}
                  onChange={(e) => setTargetBatchId(e.target.value)}
                  required
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Student Full Name</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Sumanth Varma"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Roll Number (Login Username)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. JEE-2026-042"
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email (Optional)</label>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="e.g. sumanth@example.com"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Password (Leave blank to use Roll Number)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Defaults to Roll Number"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setStudentModalOpen(false)}
                  disabled={studentSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={studentSubmitting}>
                  {studentSubmitting ? 'Adding…' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
