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

/* The small secondary button and the compact select, so the dense student and
   batch toolbars stay on the same brand scale as the rest of the studio. */
const BTN_SECONDARY_SM =
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3 py-1.5 text-[12px] font-extrabold text-[#003366] no-underline shadow-[0_3px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_5px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none';
const BTN_GHOST_SM =
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border-0 bg-transparent px-2 py-1 text-[12px] font-bold text-[#5A6B8C] transition-colors duration-150 hover:bg-ice hover:text-[#003366] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none';
const SELECT_SM =
  'h-9 cursor-pointer rounded-xl border-[2.5px] border-[#003366] bg-white px-2.5 text-[12px] font-semibold text-[#003366] shadow-[0_3px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 focus:border-accent focus:shadow-[0_4px_0_#E3C9E6] motion-reduce:transition-none';

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
    <div className="flex flex-col gap-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-[18px] font-extrabold text-[#003366]">Batches &amp; Student Management</h2>
          <p className="text-[13px] text-[#5A6B8C]">
            Organize students into batches and manage their isolated student portal credentials.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
            onClick={() => setBatchModalOpen(true)}
          >
            + Create New Batch
          </button>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#5A2560] bg-grad px-4 py-2 text-[13px] font-extrabold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[3px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
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

      {error && <div className="mb-3.5 rounded-2xl border border-[#C8202F]/25 bg-[#FDF3F4] px-3.5 py-2.5 text-[13px] font-semibold text-[#C8202F]">{error}</div>}

      {/* Newly Created Student Credentials Notification */}
      {createdCredentials && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#9FD6B2] bg-[#EAF7EF] px-5 py-4">
          <div>
            <div className="text-[14px] font-bold text-[#146C33]">
              ✓ Student Created Successfully!
            </div>
            <div className="mt-1 text-[13px] text-[#146C33]">
              <strong>{createdCredentials.name}</strong> • Roll No:{' '}
              <code>{createdCredentials.rollNumber}</code> • Password:{' '}
              <code>{createdCredentials.password}</code>
            </div>
            <div className="mt-0.5 text-[12px] text-[#15803D]">
              Students can sign in directly at <strong>/student-portal</strong> using these credentials.
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" className={BTN_SECONDARY_SM} onClick={copyCredentials}>
              {copied ? '✓ Copied to Clipboard!' : 'Copy Credentials'}
            </button>
            <button type="button" className={BTN_GHOST_SM} onClick={() => setCreatedCredentials(null)}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Batches Cards Grid */}
      <div>
        <h3 className="mb-3 text-[14px] font-bold text-[#31407F]">
          Active Batches ({batches.length})
        </h3>
        {batches.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#003366]/20 bg-white px-5 py-9 text-center text-[13.5px] font-medium text-[#5A6B8C]">
            No batches created yet. Click <strong>+ Create New Batch</strong> above to set up your first student cohort.
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
            {batches.map((b) => {
              const isSelected = selectedBatchId === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBatchId(isSelected ? 'all' : b.id)}
                  className={`flex cursor-pointer flex-col justify-between gap-3 rounded-2xl bg-white p-4 transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none ${
                    isSelected
                      ? 'border-2 border-accent shadow-[0_6px_18px_-6px_rgba(128,54,136,.35)]'
                      : 'border border-[#003366]/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-accent-50 px-2 py-0.5 text-[11px] font-bold tracking-[0.04em] text-accent">
                        {b.code}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBatch(b.id, b.name);
                        }}
                        className="cursor-pointer rounded-md border-0 bg-transparent px-1.5 py-0.5 text-[12px] text-[#C8202F] transition-colors duration-150 hover:bg-[#FDF3F4] motion-reduce:transition-none"
                        title="Delete Batch"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="mt-2 text-[15px] font-bold text-[#003366]">
                      {b.name}
                    </div>
                    {b.description && (
                      <div className="mt-1 text-[12px] text-[#5A6B8C]">
                        {b.description}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-[#003366]/10 pt-2.5 text-[12px] text-[#5A6B8C]">
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
      <div className="mt-2 rounded-[28px] border border-[#003366]/10 bg-white p-5 shadow-[0_24px_56px_-36px_rgba(0,51,102,.45)] sm:p-6">
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2.5 font-display text-[17px] font-extrabold text-[#003366]">
          <div className="flex items-center gap-3">
            <span>Students ({students.length})</span>
            {selectedBatchId !== 'all' && (
              <button type="button" className={BTN_GHOST_SM} onClick={() => setSelectedBatchId('all')}>
                Showing single batch • Click to view all
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[12px] text-[#5A6B8C]">Filter Batch:</label>
            <select
              className={SELECT_SM}
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
          <div className="px-6 py-6 text-center text-[14px] text-[#5A6B8C]">
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#003366]/20 bg-white px-5 py-9 text-center text-[13.5px] font-medium text-[#5A6B8C]">
            No students found in this batch. Click <strong>+ Add Student</strong> to enroll students.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b-2 border-[#003366]/10 text-left text-[#5A6B8C]">
                  <th className="px-3 py-2.5">Roll Number</th>
                  <th className="px-3 py-2.5">Student Name</th>
                  <th className="px-3 py-2.5">Batch</th>
                  <th className="px-3 py-2.5">Email</th>
                  <th className="px-3 py-2.5">Exams Taken</th>
                  <th className="px-3 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-[#003366]/10">
                    <td className="px-3 py-3 font-semibold text-accent">
                      {s.rollNumber}
                    </td>
                    <td className="px-3 py-3 font-medium text-[#003366]">
                      {s.name}
                    </td>
                    <td className="px-3 py-3 text-[#5A6B8C]">
                      <span className="rounded bg-ice px-1.5 py-0.5 text-[11px] font-bold text-[#003366]">
                        {s.batch?.code || '—'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[#5A6B8C]">
                      {s.email || '—'}
                    </td>
                    <td className="px-3 py-3 text-[#003366]">
                      {s._count?.examSessions || 0}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteStudent(s.id, s.name)}
                        className="cursor-pointer rounded-md border-0 bg-transparent px-1.5 py-0.5 text-[12px] text-[#C8202F] transition-colors duration-150 hover:bg-[#FDF3F4] motion-reduce:transition-none"
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
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0F172A]/45 p-5" onClick={() => setBatchModalOpen(false)}>
          <div className="w-full max-w-[440px] max-h-[90vh] overflow-y-auto rounded-[22px] border border-[#003366]/10 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.12)] sm:px-7" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 font-display text-[18px] font-extrabold text-[#003366]">
              Create New Batch
            </h3>
            <form onSubmit={handleCreateBatch} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#003366]">Batch Name</label>
                <input
                  type="text"
                  className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                  placeholder="e.g. JEE 2026 Achievers"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#003366]">Batch Code (Identifier)</label>
                <input
                  type="text"
                  className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                  placeholder="e.g. ACHIEVERS-A"
                  value={batchCode}
                  onChange={(e) => setBatchCode(e.target.value.toUpperCase())}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#003366]">Description (Optional)</label>
                <input
                  type="text"
                  className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                  placeholder="e.g. Morning classroom cohort"
                  value={batchDesc}
                  onChange={(e) => setBatchDesc(e.target.value)}
                />
              </div>
              <div className="mt-2.5 flex justify-end gap-2.5">
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                  onClick={() => setBatchModalOpen(false)}
                  disabled={batchSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#5A2560] bg-grad px-4 py-2 text-[13px] font-extrabold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[3px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none" disabled={batchSubmitting}>
                  {batchSubmitting ? 'Creating...' : 'Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Student */}
      {studentModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0F172A]/45 p-5" onClick={() => setStudentModalOpen(false)}>
          <div className="w-full max-w-[460px] max-h-[90vh] overflow-y-auto rounded-[22px] border border-[#003366]/10 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.12)] sm:px-7" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 font-display text-[18px] font-extrabold text-[#003366]">
              Add Student to Batch
            </h3>
            <form onSubmit={handleCreateStudent} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#003366]">Assign to Batch</label>
                <select
                  className="h-[46px] w-full cursor-pointer rounded-xl border-[2.5px] border-[#003366] bg-white px-3 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
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
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#003366]">Student Full Name</label>
                <input
                  type="text"
                  className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                  placeholder="e.g. Sumanth Varma"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#003366]">Roll Number (Login Username)</label>
                <input
                  type="text"
                  className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                  placeholder="e.g. JEE-2026-042"
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#003366]">Email (Optional)</label>
                <input
                  type="email"
                  className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                  placeholder="e.g. sumanth@example.com"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#003366]">Password (Leave blank to use Roll Number)</label>
                <input
                  type="text"
                  className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                  placeholder="Defaults to Roll Number"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                />
              </div>
              <div className="mt-2.5 flex justify-end gap-2.5">
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                  onClick={() => setStudentModalOpen(false)}
                  disabled={studentSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#5A2560] bg-grad px-4 py-2 text-[13px] font-extrabold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[3px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none" disabled={studentSubmitting}>
                  {studentSubmitting ? 'Adding...' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
