'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Check,
  CircleCheckBig,
  ClipboardList,
  Download,
  Eye,
  EyeOff,
  FolderOpen,
  User,
  Users,
  X,
} from 'lucide-react';
import {
  facultyCreateBatch,
  facultyCreateStudent,
  facultyBulkCreateStudents,
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

function parseStudentCsv(text: string): Array<{ name: string; rollNumber: string; email?: string; password?: string; batchCode?: string }> {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const header = lines[0]!.toLowerCase().split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
  const nameIdx = header.findIndex((h) => h.includes('name'));
  const rollIdx = header.findIndex((h) => h.includes('roll') || h.includes('id') || h.includes('user'));
  const emailIdx = header.findIndex((h) => h.includes('email') || h.includes('mail'));
  const passIdx = header.findIndex((h) => h.includes('pass'));
  const batchIdx = header.findIndex((h) => h.includes('batch'));

  const results: Array<{ name: string; rollNumber: string; email?: string; password?: string; batchCode?: string }> = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i]!;
    const cells = (rawLine.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || rawLine.split(',')).map((c) =>
      c.trim().replace(/^["']|["']$/g, ''),
    );
    if (cells.length === 0) continue;

    const name = nameIdx !== -1 ? cells[nameIdx] : cells[0];
    const rollNumber = rollIdx !== -1 ? cells[rollIdx] : cells[1];
    const email = emailIdx !== -1 ? cells[emailIdx] : cells[2];
    const password = passIdx !== -1 ? cells[passIdx] : cells[3];
    const batchCode = batchIdx !== -1 ? cells[batchIdx] : cells[4];

    if (name && rollNumber) {
      results.push({
        name,
        rollNumber,
        email: email || undefined,
        password: password || undefined,
        batchCode: batchCode || undefined,
      });
    }
  }

  return results;
}

function downloadSampleCsv() {
  const sample =
    'name,rollNumber,email,password,batchCode\n' +
    'Sumanth Varma,JEE-2026-001,sumanth@example.com,,COCDE\n' +
    'Priya Sharma,JEE-2026-002,priya@example.com,Secret@123,COCDE\n' +
    'Rahul Reddy,JEE-2026-003,rahul@example.com,,COCDE\n';
  const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'students_bulk_template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

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
  const [studentCreationMode, setStudentCreationMode] = useState<'single' | 'bulk'>('single');
  const [targetBatchId, setTargetBatchId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [studentSubmitting, setStudentSubmitting] = useState(false);

  // Bulk CSV upload states
  const [csvFileName, setCsvFileName] = useState('');
  const [parsedStudents, setParsedStudents] = useState<
    Array<{ name: string; rollNumber: string; email?: string; password?: string; batchCode?: string }>
  >([]);
  const [bulkResult, setBulkResult] = useState<{
    total: number;
    createdCount: number;
    errorCount: number;
    errors: Array<{ row: number; error: string; rollNumber?: string; name?: string }>;
  } | null>(null);

  // Credentials notification banner
  const [createdCredentials, setCreatedCredentials] = useState<{
    name: string;
    rollNumber: string;
    email?: string | null;
    password: string;
  } | null>(null);
  const [showCredentialsPassword, setShowCredentialsPassword] = useState(false);
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
        email: res.student.email,
        password: res.initialPassword || res.student.rollNumber,
      });
      setShowCredentialsPassword(false);
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

  function handleCsvFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    setBulkResult(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = String(event.target?.result || '');
      const parsed = parseStudentCsv(text);
      setParsedStudents(parsed);
    };
    reader.readAsText(file);
  }

  async function handleBulkUpload(e: React.FormEvent) {
    e.preventDefault();
    if (parsedStudents.length === 0) {
      alert('Please select a valid CSV file with student records.');
      return;
    }
    setStudentSubmitting(true);
    setError('');
    try {
      const res = await facultyBulkCreateStudents({
        batchId: targetBatchId,
        students: parsedStudents,
      });
      setBulkResult(res);
      if (res.createdCount > 0) {
        await loadData();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk import students');
    } finally {
      setStudentSubmitting(false);
    }
  }

  function copyCredentials() {
    if (!createdCredentials) return;
    const text = `Student Portal Credentials\nPortal: /student-portal\nRoll Number: ${createdCredentials.rollNumber}${createdCredentials.email ? `\nEmail: ${createdCredentials.email}` : ''}\nPassword: ${createdCredentials.password}`;
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
            <div className="flex items-center gap-1.5 text-[14px] font-bold text-[#146C33]">
              <CircleCheckBig className="h-[15px] w-[15px] shrink-0" aria-hidden />
              <span>Student Created Successfully</span>
            </div>
            <div className="mt-1 text-[13px] text-[#146C33]">
              <strong>{createdCredentials.name}</strong> • Roll No:{' '}
              <code>{createdCredentials.rollNumber}</code>
              {createdCredentials.email && (
                <> • Email: <code>{createdCredentials.email}</code></>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[13px] text-[#146C33]">
              <span>Password:</span>
              <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono">
                {showCredentialsPassword ? createdCredentials.password : '••••••••'}
              </code>
              <button
                type="button"
                onClick={() => setShowCredentialsPassword((v) => !v)}
                aria-label={showCredentialsPassword ? 'Hide password' : 'Show password'}
                title={showCredentialsPassword ? 'Hide password' : 'Show password'}
                className="inline-flex cursor-pointer items-center rounded-md border-0 bg-transparent p-1 text-[#146C33] transition-colors duration-150 hover:bg-white/60 motion-reduce:transition-none"
              >
                {showCredentialsPassword ? (
                  <EyeOff className="h-[13px] w-[13px]" aria-hidden />
                ) : (
                  <Eye className="h-[13px] w-[13px]" aria-hidden />
                )}
              </button>
            </div>
            <div className="mt-0.5 text-[12px] text-[#15803D]">
              Students can sign in directly at <strong>/student-portal</strong> using their Roll Number (or Email) and Password.
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" className={BTN_SECONDARY_SM} onClick={copyCredentials}>
              {copied ? (
                <>
                  <Check className="h-[13px] w-[13px] shrink-0" aria-hidden />
                  Copied to Clipboard
                </>
              ) : (
                'Copy Credentials'
              )}
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
                        className="cursor-pointer rounded-md border-0 bg-transparent px-1.5 py-0.5 text-[#C8202F] transition-colors duration-150 hover:bg-[#FDF3F4] motion-reduce:transition-none"
                        title="Delete Batch"
                      >
                        <X className="h-[13px] w-[13px]" aria-hidden />
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
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-[13px] w-[13px] shrink-0" aria-hidden />
                      <strong>{b._count?.students || 0}</strong> students
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <ClipboardList className="h-[13px] w-[13px] shrink-0" aria-hidden />
                      <strong>{b._count?.assignments || 0}</strong> exams
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
                  <th className="px-3 py-2.5">Email</th>
                  <th className="px-3 py-2.5">Student Name</th>
                  <th className="px-3 py-2.5">Batch</th>
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
                      {s.email || '—'}
                    </td>
                    <td className="px-3 py-3 text-[#5A6B8C]">
                      {s.name}
                    </td>
                    <td className="px-3 py-3 text-[#5A6B8C]">
                      <span className="rounded bg-ice px-1.5 py-0.5 text-[11px] font-bold text-[#003366]">
                        {s.batch?.code || '—'}
                      </span>
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
          <div className="w-full max-w-[500px] max-h-[90vh] overflow-y-auto rounded-[22px] border border-[#003366]/10 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.12)] sm:px-7" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-[18px] font-extrabold text-[#003366]">
                Add Students to Batch
              </h3>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#5A6B8C] transition-colors hover:bg-[#F1F5F9] hover:text-[#003366]"
                onClick={() => setStudentModalOpen(false)}
                title="Close"
              >
                <X className="h-[18px] w-[18px]" aria-hidden />
              </button>
            </div>

            {/* Segmented Mode Toggle: Single vs Bulk */}
            <div className="mb-4 flex rounded-xl border-[2px] border-[#003366]/15 bg-[#F8FAFC] p-1">
              <button
                type="button"
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[12.5px] font-bold transition-colors ${
                  studentCreationMode === 'single'
                    ? 'bg-[#003366] text-white shadow-sm'
                    : 'text-[#5A6B8C] hover:text-[#003366]'
                }`}
                onClick={() => setStudentCreationMode('single')}
              >
                <User className="h-[14px] w-[14px] shrink-0" aria-hidden />
                Single Student
              </button>
              <button
                type="button"
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[12.5px] font-bold transition-colors ${
                  studentCreationMode === 'bulk'
                    ? 'bg-[#003366] text-white shadow-sm'
                    : 'text-[#5A6B8C] hover:text-[#003366]'
                }`}
                onClick={() => setStudentCreationMode('bulk')}
              >
                <FolderOpen className="h-[14px] w-[14px] shrink-0" aria-hidden />
                Bulk Upload (CSV)
              </button>
            </div>

            {studentCreationMode === 'single' ? (
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
                  <div className="relative">
                    <input
                      type={showStudentPassword ? 'text' : 'password'}
                      className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 pr-12 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                      placeholder="Defaults to Roll Number"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowStudentPassword((v) => !v)}
                      aria-label={showStudentPassword ? 'Hide password' : 'Show password'}
                      title={showStudentPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-1.5 top-1/2 inline-flex -translate-y-1/2 cursor-pointer items-center rounded-[10px] border-0 bg-transparent p-2 text-[#31407F] transition-colors duration-150 hover:bg-ice motion-reduce:transition-none"
                    >
                      {showStudentPassword ? (
                        <EyeOff className="h-[15px] w-[15px]" aria-hidden />
                      ) : (
                        <Eye className="h-[15px] w-[15px]" aria-hidden />
                      )}
                    </button>
                  </div>
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
            ) : (
              <form onSubmit={handleBulkUpload} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-extrabold text-[#003366]">Default Batch</label>
                  <select
                    className="h-[46px] w-full cursor-pointer rounded-xl border-[2.5px] border-[#003366] bg-white px-3 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                    value={targetBatchId}
                    onChange={(e) => setTargetBatchId(e.target.value)}
                  >
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
                  <span className="text-[11.5px] text-[#5A6B8C]">
                    Used when a student row in CSV does not specify a batch code.
                  </span>
                </div>

                {/* CSV Template Download Action */}
                <div className="flex items-center justify-between rounded-xl border border-dashed border-[#003366]/25 bg-ice/40 p-3">
                  <div>
                    <div className="text-[12.5px] font-bold text-[#003366]">Need the CSV format?</div>
                    <div className="text-[11.5px] text-[#5A6B8C]">Columns: name, rollNumber, email, password, batchCode</div>
                  </div>
                  <button
                    type="button"
                    onClick={downloadSampleCsv}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#003366] bg-white px-2.5 py-1 text-[11.5px] font-extrabold text-[#003366] shadow-sm hover:bg-ice"
                  >
                    <Download className="h-[13px] w-[13px] shrink-0" aria-hidden />
                    Download CSV Template
                  </button>
                </div>

                {/* File Upload Box */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-extrabold text-[#003366]">Upload CSV File</label>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleCsvFile}
                    className="block w-full text-[13px] text-[#5A6B8C] file:mr-3 file:cursor-pointer file:rounded-xl file:border-0 file:bg-[#003366] file:px-3 file:py-2 file:text-[12px] file:font-bold file:text-white hover:file:bg-[#002244]"
                  />
                  {csvFileName && (
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-accent">
                      <Check className="h-[13px] w-[13px] shrink-0" aria-hidden />
                      Selected: {csvFileName} ({parsedStudents.length} valid students detected)
                    </span>
                  )}
                </div>

                {/* Parsed Students Preview Table */}
                {parsedStudents.length > 0 && (
                  <div className="max-h-[160px] overflow-y-auto rounded-xl border border-[#003366]/15 bg-[#FBFCFE] p-2 text-[11.5px]">
                    <div className="mb-1 font-bold text-[#003366]">Preview ({parsedStudents.length} records):</div>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b text-[#5A6B8C]">
                          <th className="py-1">Name</th>
                          <th className="py-1">Roll Number</th>
                          <th className="py-1">Email</th>
                          <th className="py-1">Batch</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedStudents.slice(0, 10).map((s, idx) => (
                          <tr key={idx} className="border-b border-[#003366]/5">
                            <td className="py-1 font-semibold text-[#003366]">{s.name}</td>
                            <td className="py-1 text-accent">{s.rollNumber}</td>
                            <td className="py-1 text-[#5A6B8C]">{s.email || '—'}</td>
                            <td className="py-1 text-[#5A6B8C]">{s.batchCode || 'Default'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {parsedStudents.length > 10 && (
                      <div className="mt-1 text-center text-[10.5px] text-[#5A6B8C]">
                        ... and {parsedStudents.length - 10} more students
                      </div>
                    )}
                  </div>
                )}

                {/* Bulk Results Feedback */}
                {bulkResult && (
                  <div className="flex flex-col gap-1.5 rounded-xl border border-[#15803D]/25 bg-[#EAF7EF] p-3 text-[12.5px] text-[#146C33]">
                    <div className="inline-flex items-center gap-1.5 font-bold">
                      <CircleCheckBig className="h-[14px] w-[14px] shrink-0" aria-hidden />
                      <span>
                        Successfully imported {bulkResult.createdCount} of {bulkResult.total} students
                      </span>
                    </div>
                    {bulkResult.errorCount > 0 && (
                      <div className="mt-1 text-[11.5px] text-[#C8202F]">
                        {bulkResult.errorCount} row(s) skipped:
                        <ul className="list-disc pl-4 mt-0.5">
                          {bulkResult.errors.map((e, idx) => (
                            <li key={idx}>Row {e.row}: {e.error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-2.5 flex justify-end gap-2.5">
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                    onClick={() => {
                      setStudentModalOpen(false);
                      setBulkResult(null);
                      setParsedStudents([]);
                      setCsvFileName('');
                    }}
                    disabled={studentSubmitting}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#5A2560] bg-grad px-4 py-2 text-[13px] font-extrabold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[3px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                    disabled={studentSubmitting || parsedStudents.length === 0}
                  >
                    {studentSubmitting ? 'Importing...' : `Import ${parsedStudents.length} Students`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
