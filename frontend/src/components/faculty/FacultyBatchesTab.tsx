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
  KeyRound,
  Pencil,
  User,
  Users,
  X,
} from 'lucide-react';
import {
  facultyCreateBatch,
  facultyUpdateBatch,
  facultyCreateStudent,
  facultyUpdateStudent,
  facultyResetStudentPassword,
  facultyResetBatchPasswords,
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

function parseCsvLine(line: string, explicitDelimiter?: string): string[] {
  let delimiter = explicitDelimiter;
  if (!delimiter) {
    if (line.includes('\t') && !line.includes(',')) delimiter = '\t';
    else if (line.includes(';') && !line.includes(',')) delimiter = ';';
    else delimiter = ',';
  }

  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function cleanCsvValue(val?: string | null): string {
  if (!val) return '';
  let str = val.trim();
  const hyperlinkMatch = str.match(/^=HYPERLINK\s*\(\s*["']([^"']+)["']\s*(?:,\s*["']([^"']+)["'])?\s*\)/i);
  if (hyperlinkMatch) {
    str = (hyperlinkMatch[2] || hyperlinkMatch[1] || '').trim();
  }
  if (/^mailto:/i.test(str)) {
    str = str.replace(/^mailto:/i, '').trim();
  }
  return str.replace(/^["']|["']$/g, '').trim();
}

interface ParsedStudentRow {
  name: string;
  rollNumber: string;
  email?: string;
  password?: string;
  batchCode?: string;
}

interface CsvParseResult {
  valid: ParsedStudentRow[];
  errors: string[];
}

function parseStudentCsv(text: string): CsvParseResult {
  if (
    text.startsWith('PK\x03\x04') ||
    text.includes('[Content_Types].xml') ||
    (text.charCodeAt(0) === 0x50 && text.charCodeAt(1) === 0x4B)
  ) {
    return {
      valid: [],
      errors: [
        'The uploaded file is an Excel Workbook (.xlsx) saved with a .csv extension. Please open the file in Microsoft Excel, click File > Save As, and in the "Save as type" dropdown select "CSV (Comma delimited) (*.csv)".',
      ],
    };
  }

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const errors: string[] = [];

  if (lines.length === 0) {
    return {
      valid: [],
      errors: ['The uploaded CSV file is empty. Please add student rows or download the template below.'],
    };
  }
  if (lines.length < 2) {
    return {
      valid: [],
      errors: ['CSV contains only a header line with no student rows. Please add student records under the header.'],
    };
  }

  let delimiter = ',';
  if (lines[0]!.includes('\t') && !lines[0]!.includes(',')) delimiter = '\t';
  else if (lines[0]!.includes(';') && !lines[0]!.includes(',')) delimiter = ';';

  const rawHeader = parseCsvLine(lines[0]!, delimiter);
  const header = rawHeader.map((h) => cleanCsvValue(h).toLowerCase());
  const nameIdx = header.findIndex((h) => h.includes('name'));
  const rollIdx = header.findIndex((h) => h.includes('roll') || h.includes('id') || h.includes('user'));
  const emailIdx = header.findIndex((h) => h.includes('email') || h.includes('mail'));
  const passIdx = header.findIndex((h) => h.includes('pass'));
  const batchIdx = header.findIndex((h) => h.includes('batch'));

  if (nameIdx === -1) {
    errors.push('Missing required column: "name" header was not found in your CSV. (Expected columns: name, rollNumber, email, password, batchCode)');
  }
  if (rollIdx === -1) {
    errors.push('Missing required column: "rollNumber" (or "roll" / "id") header was not found in your CSV.');
  }

  if (nameIdx === -1 || rollIdx === -1) {
    return { valid: [], errors };
  }

  const valid: ParsedStudentRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i]!;
    const cells = parseCsvLine(rawLine, delimiter);
    if (cells.length === 0 || (cells.length === 1 && !cells[0])) continue;

    const rowNum = i + 1;
    const name = cleanCsvValue(nameIdx !== -1 ? cells[nameIdx] : cells[0]);
    const rollNumber = cleanCsvValue(rollIdx !== -1 ? cells[rollIdx] : cells[1]);
    const email = cleanCsvValue(emailIdx !== -1 ? cells[emailIdx] : cells[2]);
    const password = cleanCsvValue(passIdx !== -1 ? cells[passIdx] : cells[3]);
    const batchCode = cleanCsvValue(batchIdx !== -1 ? cells[batchIdx] : cells[4]);

    if (!name && !rollNumber) {
      errors.push(`Row ${rowNum}: Both student Name and Roll Number are missing.`);
      continue;
    }
    if (!name) {
      errors.push(`Row ${rowNum}: Missing student Name for roll number "${rollNumber}". Please add the student's name.`);
      continue;
    }
    if (!rollNumber) {
      errors.push(`Row ${rowNum}: Missing Roll Number for student "${name}". Please add a roll number.`);
      continue;
    }

    valid.push({
      name,
      rollNumber,
      email: email || undefined,
      password: password || undefined,
      batchCode: batchCode || undefined,
    });
  }

  return { valid, errors };
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
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
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

  // Edit Batch modal
  const [editBatchModalOpen, setEditBatchModalOpen] = useState(false);
  const [editingBatchId, setEditingBatchId] = useState('');
  const [editBatchName, setEditBatchName] = useState('');
  const [editBatchCode, setEditBatchCode] = useState('');
  const [editBatchDesc, setEditBatchDesc] = useState('');
  const [editBatchSubmitting, setEditBatchSubmitting] = useState(false);

  // Edit Student modal
  const [editStudentModalOpen, setEditStudentModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState('');
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentRoll, setEditStudentRoll] = useState('');
  const [editStudentEmail, setEditStudentEmail] = useState('');
  const [editStudentBatchId, setEditStudentBatchId] = useState('');
  const [editStudentSubmitting, setEditStudentSubmitting] = useState(false);

  // Reset Student Password modal
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [resetStudentId, setResetStudentId] = useState('');
  const [resetStudentName, setResetStudentName] = useState('');
  const [resetStudentRoll, setResetStudentRoll] = useState('');
  const [customNewPassword, setCustomNewPassword] = useState('');
  const [resetPasswordSubmitting, setResetPasswordSubmitting] = useState(false);

  // Reset Batch Password modal
  const [resetBatchPasswordModalOpen, setResetBatchPasswordModalOpen] = useState(false);
  const [resetBatchTargetId, setResetBatchTargetId] = useState('');
  const [resetBatchTargetName, setResetBatchTargetName] = useState('');
  const [resetBatchTargetCode, setResetBatchTargetCode] = useState('');
  const [resetBatchStudentCount, setResetBatchStudentCount] = useState(0);
  const [batchNewPassword, setBatchNewPassword] = useState('');
  const [showBatchNewPassword, setShowBatchNewPassword] = useState(false);
  const [resetBatchSubmitting, setResetBatchSubmitting] = useState(false);

  // Batch Password notification banner
  const [batchPasswordNotice, setBatchPasswordNotice] = useState<{
    batchName: string;
    batchCode: string;
    count: number;
    password: string;
  } | null>(null);
  const [batchPasswordCopied, setBatchPasswordCopied] = useState(false);

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

  function openEditBatch(b: FacultyBatch) {
    setEditingBatchId(b.id);
    setEditBatchName(b.name);
    setEditBatchCode(b.code);
    setEditBatchDesc(b.description || '');
    setEditBatchModalOpen(true);
  }

  async function handleUpdateBatch(e: React.FormEvent) {
    e.preventDefault();
    if (!editBatchName.trim() || !editBatchCode.trim()) return;
    setEditBatchSubmitting(true);
    setError('');
    try {
      await facultyUpdateBatch(editingBatchId, {
        name: editBatchName.trim(),
        code: editBatchCode.trim(),
        description: editBatchDesc.trim() || null,
      });
      setEditBatchModalOpen(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update batch');
    } finally {
      setEditBatchSubmitting(false);
    }
  }

  function openEditStudent(s: FacultyStudent) {
    setEditingStudentId(s.id);
    setEditStudentName(s.name);
    setEditStudentRoll(s.rollNumber);
    setEditStudentEmail(s.email || '');
    setEditStudentBatchId(s.batchId);
    setEditStudentModalOpen(true);
  }

  async function handleUpdateStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!editStudentName.trim() || !editStudentRoll.trim() || !editStudentBatchId) return;
    setEditStudentSubmitting(true);
    setError('');
    try {
      await facultyUpdateStudent(editingStudentId, {
        name: editStudentName.trim(),
        rollNumber: editStudentRoll.trim(),
        email: editStudentEmail.trim() || null,
        batchId: editStudentBatchId,
      });
      setEditStudentModalOpen(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update student profile');
    } finally {
      setEditStudentSubmitting(false);
    }
  }

  function openResetPassword(s: FacultyStudent) {
    setResetStudentId(s.id);
    setResetStudentName(s.name);
    setResetStudentRoll(s.rollNumber);
    setCustomNewPassword('');
    setResetPasswordModalOpen(true);
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setResetPasswordSubmitting(true);
    setError('');
    try {
      const res = await facultyResetStudentPassword(resetStudentId, customNewPassword.trim() || undefined);
      setCreatedCredentials({
        name: resetStudentName,
        rollNumber: res.rollNumber,
        email: null,
        password: res.newPassword,
      });
      setShowCredentialsPassword(true);
      setResetPasswordModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset student password');
    } finally {
      setResetPasswordSubmitting(false);
    }
  }

  function openResetBatchPassword(b: FacultyBatch) {
    setResetBatchTargetId(b.id);
    setResetBatchTargetName(b.name);
    setResetBatchTargetCode(b.code);
    setResetBatchStudentCount(b._count?.students || 0);
    setBatchNewPassword('');
    setShowBatchNewPassword(false);
    setResetBatchPasswordModalOpen(true);
  }

  async function handleResetBatchPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!resetBatchTargetId || !batchNewPassword.trim()) return;
    setResetBatchSubmitting(true);
    setError('');
    try {
      const res = await facultyResetBatchPasswords(resetBatchTargetId, batchNewPassword.trim());
      setBatchPasswordNotice({
        batchName: res.batchName || resetBatchTargetName,
        batchCode: res.batchCode || resetBatchTargetCode,
        count: res.updatedCount,
        password: res.newPassword,
      });
      setBatchPasswordCopied(false);
      setResetBatchPasswordModalOpen(false);
      setBatchNewPassword('');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update batch passwords');
    } finally {
      setResetBatchSubmitting(false);
    }
  }

  function handleCsvFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    setBulkResult(null);
    setCsvErrors([]);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = String(event.target?.result || '');
      const { valid, errors } = parseStudentCsv(text);
      setParsedStudents(valid);
      setCsvErrors(errors);
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
    const text = `Student Portal Credentials\nPortal: /student\nRoll Number: ${createdCredentials.rollNumber}${createdCredentials.email ? `\nEmail: ${createdCredentials.email}` : ''}\nPassword: ${createdCredentials.password}`;
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
              Students can sign in directly at <strong>/student</strong> using their Roll Number (or Email) and Password.
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

      {/* Batch Passwords Updated Notification */}
      {batchPasswordNotice && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#9FD6B2] bg-[#EAF7EF] px-5 py-4">
          <div>
            <div className="flex items-center gap-1.5 text-[14px] font-bold text-[#146C33]">
              <CircleCheckBig className="h-[15px] w-[15px] shrink-0" aria-hidden />
              <span>Batch Passwords Updated Successfully</span>
            </div>
            <div className="mt-1 text-[13px] text-[#146C33]">
              Batch <strong>{batchPasswordNotice.batchName}</strong> (<code>{batchPasswordNotice.batchCode}</code>) • Updated <strong>{batchPasswordNotice.count}</strong> student accounts.
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[13px] text-[#146C33]">
              <span>New Uniform Password:</span>
              <code className="rounded bg-white/80 px-2 py-0.5 font-mono font-bold text-[#003366]">
                {batchPasswordNotice.password}
              </code>
            </div>
            <div className="mt-0.5 text-[12px] text-[#15803D]">
              All students in this batch can now sign in at <strong>/student</strong> using their Roll Number and this password.
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className={BTN_SECONDARY_SM}
              onClick={() => {
                navigator.clipboard.writeText(
                  `Batch: ${batchPasswordNotice.batchName} (${batchPasswordNotice.batchCode})\nPassword: ${batchPasswordNotice.password}\nLogin Portal: /student`
                );
                setBatchPasswordCopied(true);
                setTimeout(() => setBatchPasswordCopied(false), 2500);
              }}
            >
              {batchPasswordCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#15803D]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  <span>Copy Password Info</span>
                </>
              )}
            </button>
            <button
              type="button"
              className={BTN_GHOST_SM}
              onClick={() => setBatchPasswordNotice(null)}
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
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
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openResetBatchPassword(b);
                          }}
                          className="cursor-pointer rounded-md border-0 bg-transparent px-1.5 py-0.5 text-[#5A6B8C] transition-colors duration-150 hover:bg-accent-50 hover:text-accent motion-reduce:transition-none"
                          title="Update All Passwords in Batch"
                        >
                          <KeyRound className="h-[13px] w-[13px]" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditBatch(b);
                          }}
                          className="cursor-pointer rounded-md border-0 bg-transparent px-1.5 py-0.5 text-[#5A6B8C] transition-colors duration-150 hover:bg-ice hover:text-[#003366] motion-reduce:transition-none"
                          title="Edit Batch"
                        >
                          <Pencil className="h-[13px] w-[13px]" aria-hidden />
                        </button>
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
          <div className="flex flex-wrap items-center gap-2">
            {selectedBatchId !== 'all' && batches.find((b) => b.id === selectedBatchId) && (
              <button
                type="button"
                className={BTN_SECONDARY_SM}
                onClick={() => {
                  const b = batches.find((item) => item.id === selectedBatchId);
                  if (b) openResetBatchPassword(b);
                }}
                title="Update passwords for all students in this batch"
              >
                <KeyRound className="h-3.5 w-3.5" aria-hidden />
                <span>Update Batch Passwords</span>
              </button>
            )}
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
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditStudent(s)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-md border-0 bg-transparent px-2 py-1 text-[12px] font-semibold text-[#003366] transition-colors duration-150 hover:bg-ice motion-reduce:transition-none"
                          title="Edit Student Profile"
                        >
                          <Pencil className="h-[12px] w-[12px] shrink-0" aria-hidden />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => openResetPassword(s)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-md border-0 bg-transparent px-2 py-1 text-[12px] font-semibold text-[#803688] transition-colors duration-150 hover:bg-[#FBF5FC] motion-reduce:transition-none"
                          title="Reset Student Password"
                        >
                          <KeyRound className="h-[12px] w-[12px] shrink-0" aria-hidden />
                          Reset Pass
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStudent(s.id, s.name)}
                          className="cursor-pointer rounded-md border-0 bg-transparent px-2 py-1 text-[12px] font-semibold text-[#C8202F] transition-colors duration-150 hover:bg-[#FDF3F4] motion-reduce:transition-none"
                        >
                          Remove
                        </button>
                      </div>
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
                    <div className="mt-1 flex flex-col gap-2">
                      {parsedStudents.length > 0 ? (
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#15803D]">
                          <Check className="h-[13px] w-[13px] shrink-0" aria-hidden />
                          Selected: {csvFileName} ({parsedStudents.length} valid student{parsedStudents.length === 1 ? '' : 's'} detected)
                        </span>
                      ) : (
                        <div className="rounded-xl border border-[#C8202F]/25 bg-[#FDF3F4] p-3 text-[12px] text-[#C8202F]">
                          <div className="font-extrabold">No valid student records found in {csvFileName}</div>
                          <div className="mt-0.5 text-[11.5px] text-[#991B1B]">
                            Please check the missing fields below and update your CSV file:
                          </div>
                        </div>
                      )}

                      {/* Explicit Error Messages explaining what is missing in CSV */}
                      {csvErrors.length > 0 && (
                        <div className="rounded-xl border border-[#C8202F]/20 bg-[#FFF7F7] p-3 text-[12px] text-[#991B1B]">
                          <div className="font-bold text-[#C8202F]">Missing Data / Issues in CSV ({csvErrors.length}):</div>
                          <ul className="mt-1.5 max-h-[140px] list-disc overflow-y-auto pl-4 space-y-1 text-[11.5px]">
                            {csvErrors.map((err, idx) => (
                              <li key={idx}>{err}</li>
                            ))}
                          </ul>
                          <div className="mt-2 rounded-lg border border-[#003366]/10 bg-white p-2 text-[11px] text-[#003366]">
                            <strong>Required format:</strong> Columns <code>name</code> and <code>rollNumber</code> are mandatory. <code>batchCode</code> is optional (if left blank, students will automatically be assigned to the Default Batch selected above).
                          </div>
                        </div>
                      )}
                    </div>
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
                      setCsvErrors([]);
                      setCsvFileName('');
                    }}
                    disabled={studentSubmitting}
                  >
                    Close
                  </button>
                  {bulkResult ? (
                    <button
                      type="button"
                      className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#5A2560] bg-grad px-4 py-2 text-[13px] font-extrabold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[3px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                      onClick={() => {
                        setBulkResult(null);
                        setParsedStudents([]);
                        setCsvErrors([]);
                        setCsvFileName('');
                      }}
                    >
                      Import New Students
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#5A2560] bg-grad px-4 py-2 text-[13px] font-extrabold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[3px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                      disabled={studentSubmitting || parsedStudents.length === 0}
                    >
                      {studentSubmitting ? 'Importing...' : `Import ${parsedStudents.length} Students`}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Edit Batch */}
      {editBatchModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0F172A]/45 p-5" onClick={() => setEditBatchModalOpen(false)}>
          <div className="w-full max-w-[440px] max-h-[90vh] overflow-y-auto rounded-[22px] border border-[#003366]/10 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.12)] sm:px-7" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 font-display text-[18px] font-extrabold text-[#003366]">
              Edit Batch
            </h3>
            <form onSubmit={handleUpdateBatch} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#003366]">Batch Name</label>
                <input
                  type="text"
                  className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                  placeholder="e.g. JEE 2026 Achievers"
                  value={editBatchName}
                  onChange={(e) => setEditBatchName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#003366]">Batch Code (Identifier)</label>
                <input
                  type="text"
                  className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold uppercase text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                  placeholder="e.g. JEE-26-ACH"
                  value={editBatchCode}
                  onChange={(e) => setEditBatchCode(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#003366]">Description (Optional)</label>
                <textarea
                  className="w-full rounded-xl border-[2.5px] border-[#003366] bg-white p-3 text-[14px] font-medium text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                  rows={2}
                  placeholder="e.g. Morning 8am cohort for top-tier rankers"
                  value={editBatchDesc}
                  onChange={(e) => setEditBatchDesc(e.target.value)}
                />
              </div>
              <div className="mt-2.5 flex justify-end gap-2.5">
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                  onClick={() => setEditBatchModalOpen(false)}
                  disabled={editBatchSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#5A2560] bg-grad px-4 py-2 text-[13px] font-extrabold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[3px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                  disabled={editBatchSubmitting}
                >
                  {editBatchSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Student Profile */}
      {editStudentModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0F172A]/45 p-5" onClick={() => setEditStudentModalOpen(false)}>
          <div className="w-full max-w-[440px] max-h-[90vh] overflow-y-auto rounded-[22px] border border-[#003366]/10 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.12)] sm:px-7" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 font-display text-[18px] font-extrabold text-[#003366]">
              Edit Student Profile
            </h3>
            <form onSubmit={handleUpdateStudent} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#003366]">Assign Batch</label>
                <select
                  className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                  value={editStudentBatchId}
                  onChange={(e) => setEditStudentBatchId(e.target.value)}
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
                <label className="text-[12.5px] font-extrabold text-[#003366]">Student Name</label>
                <input
                  type="text"
                  className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                  value={editStudentName}
                  onChange={(e) => setEditStudentName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#003366]">Roll Number</label>
                <input
                  type="text"
                  className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold uppercase text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                  value={editStudentRoll}
                  onChange={(e) => setEditStudentRoll(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#003366]">Email Address</label>
                <input
                  type="email"
                  className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                  placeholder="student@example.com"
                  value={editStudentEmail}
                  onChange={(e) => setEditStudentEmail(e.target.value)}
                />
              </div>
              <div className="mt-2.5 flex justify-end gap-2.5">
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                  onClick={() => setEditStudentModalOpen(false)}
                  disabled={editStudentSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#5A2560] bg-grad px-4 py-2 text-[13px] font-extrabold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[3px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                  disabled={editStudentSubmitting}
                >
                  {editStudentSubmitting ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reset Student Password */}
      {resetPasswordModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0F172A]/45 p-5" onClick={() => setResetPasswordModalOpen(false)}>
          <div className="w-full max-w-[440px] max-h-[90vh] overflow-y-auto rounded-[22px] border border-[#003366]/10 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.12)] sm:px-7" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-2 font-display text-[18px] font-extrabold text-[#003366]">
              Reset Student Password
            </h3>
            <p className="mb-4 text-[13px] text-[#5A6B8C]">
              Reset credentials for <strong>{resetStudentName}</strong> (<code>{resetStudentRoll}</code>).
            </p>
            <form onSubmit={handleResetPassword} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#003366]">New Password</label>
                <input
                  type="text"
                  className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                  placeholder={`Leave empty to default to roll number (${resetStudentRoll})`}
                  value={customNewPassword}
                  onChange={(e) => setCustomNewPassword(e.target.value)}
                />
                <span className="text-[11.5px] text-[#5A6B8C]">
                  If left empty, the password will be reset to the student&apos;s Roll Number.
                </span>
              </div>
              <div className="mt-2.5 flex justify-end gap-2.5">
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                  onClick={() => setResetPasswordModalOpen(false)}
                  disabled={resetPasswordSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#5A2560] bg-grad px-4 py-2 text-[13px] font-extrabold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[3px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                  disabled={resetPasswordSubmitting}
                >
                  {resetPasswordSubmitting ? 'Resetting...' : 'Confirm Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal: Reset Batch Passwords */}
      {resetBatchPasswordModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0F172A]/45 p-5" onClick={() => setResetBatchPasswordModalOpen(false)}>
          <div className="w-full max-w-[460px] max-h-[90vh] overflow-y-auto rounded-[22px] border border-[#003366]/10 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.12)] sm:px-7" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-50 text-accent">
                <KeyRound className="h-4 w-4" />
              </div>
              <h3 className="font-display text-[18px] font-extrabold text-[#003366]">
                Update Batch Passwords
              </h3>
            </div>
            <p className="mb-4 text-[13px] text-[#5A6B8C]">
              Set a uniform password for all <strong>{resetBatchStudentCount}</strong> student{resetBatchStudentCount === 1 ? '' : 's'} enrolled in batch{' '}
              <strong className="text-[#003366]">{resetBatchTargetName}</strong> (<code>{resetBatchTargetCode}</code>).
            </p>
            <form onSubmit={handleResetBatchPassword} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-extrabold text-[#003366]">New Password for All Students</label>
                <div className="relative">
                  <input
                    type={showBatchNewPassword ? 'text' : 'password'}
                    className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 pr-10 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                    placeholder="e.g. Student@2026"
                    value={batchNewPassword}
                    onChange={(e) => setBatchNewPassword(e.target.value)}
                    required
                    minLength={4}
                  />
                  <button
                    type="button"
                    onClick={() => setShowBatchNewPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 border-0 bg-transparent p-1 text-[#5A6B8C] hover:text-[#003366]"
                    title={showBatchNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showBatchNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <span className="text-[11.5px] text-[#5A6B8C]">
                  Every student in this batch will immediately be able to log in at <code>/student</code> with their Roll Number and this password.
                </span>
              </div>
              <div className="mt-2.5 flex justify-end gap-2.5">
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                  onClick={() => setResetBatchPasswordModalOpen(false)}
                  disabled={resetBatchSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#5A2560] bg-grad px-4 py-2 text-[13px] font-extrabold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[3px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
                  disabled={resetBatchSubmitting || !batchNewPassword.trim()}
                >
                  {resetBatchSubmitting ? 'Updating...' : `Update All (${resetBatchStudentCount}) Passwords`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
