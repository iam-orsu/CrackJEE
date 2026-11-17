'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DiagramRenderer } from '@/components/DiagramRenderer';
import { MathText, stripOptionPrefix } from '@/lib/math';
import { MatchListTable, parseMatchQuestion } from '@/components/common/MatchListTable';
import {
  facultyAcceptDraftQuestion,
  facultyDeleteQuestion,
  facultyGenerateDraftQuestion,
  facultyUpdateQuestion,
  type FacultyExamType,
  type FacultyPaper,
  type FacultyPaperItem,
  type FacultyQuestionType,
} from '@/lib/faculty';

const LETTERS = ['A', 'B', 'C', 'D'];

type ClassValue = string | false | null | undefined;
const cx = (...parts: ClassValue[]) => parts.filter(Boolean).join(' ');

function isOptionSelected(correctAnswer: string, letter: string): boolean {
  return correctAnswer.toUpperCase().split(',').map((s) => s.trim()).includes(letter);
}

/** Shared renderer used by both saved question cards and Sparkle draft candidate previews. */
function QuestionContent({ item }: { item: FacultyPaperItem }) {
  return (
    <>
      <div className="text-[14px] leading-[1.65] text-[#0F172A]">
        {item.questionType === 'matrix_match' || parseMatchQuestion(item.questionText) ? (
          <MatchListTable questionText={item.questionText} />
        ) : (
          <MathText text={item.questionText} />
        )}
      </div>

      {item.diagram && (
        <div className="my-3 max-w-[440px]">
          <DiagramRenderer descriptor={item.diagram} />
        </div>
      )}

      {item.questionType !== 'integer' && item.options.length > 0 && (
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {item.options.map((opt, idx) => {
            const letter = LETTERS[idx]!;
            const isCorrect = isOptionSelected(item.correctAnswer, letter);
            return (
              <div key={letter} className={cx('flex items-baseline gap-2 rounded-xl border border-[#CBD5E1] bg-white px-2.5 py-2 text-[13px] font-medium text-[#0F172A] [print-color-adjust:exact]', isCorrect && 'border-[#86EFAC] bg-[#F0FDF4]')}>
                <span className="font-extrabold text-[#64748B]">{letter})</span>
                <MathText text={stripOptionPrefix(opt)} />
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-2.5 inline-block rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-2.5 py-1.5 text-[13px] font-bold text-[#15803D] [print-color-adjust:exact]">Answer: {item.correctAnswer}</div>

      {item.explanation && (
        <div className="mt-2.5 rounded-lg border-l-[3px] border-l-[#94A3B8] bg-[#F8FAFC] px-3 py-2.5 text-[13px] leading-relaxed text-[#334155]">
          <strong>Solution: </strong>
          <MathText text={item.explanation} />
        </div>
      )}
    </>
  );
}

interface SparklePanelProps {
  paperId: string;
  examType: FacultyExamType;
  targetNumber: number | null;
  initialSubject: FacultyPaperItem['subject'];
  initialTopic: string;
  initialType: FacultyQuestionType;
  topicsBySubject: Record<string, string[]>;
  onPaperUpdated: (paper: FacultyPaper) => void;
  onClose: () => void;
  onError: (msg: string) => void;
}

function SparklePanel({
  paperId,
  examType,
  targetNumber,
  initialSubject,
  initialTopic,
  initialType,
  topicsBySubject,
  onPaperUpdated,
  onClose,
  onError,
}: SparklePanelProps) {
  const availableSubjects = Object.keys(topicsBySubject);
  const [subject, setSubject] = useState<string>(
    availableSubjects.includes(initialSubject) ? initialSubject : (availableSubjects[0] ?? 'Physics'),
  );
  const subjectTopics = topicsBySubject[subject] ?? [];
  const [topic, setTopic] = useState<string>(
    subjectTopics.includes(initialTopic) ? initialTopic : (subjectTopics[0] ?? initialTopic),
  );
  const [questionType, setQuestionType] = useState<FacultyQuestionType>(
    examType === 'NEET' ? 'mcq_single' : initialType,
  );
  const [generating, setGenerating] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [candidate, setCandidate] = useState<FacultyPaperItem | null>(null);

  function handleSubjectChange(nextSubject: string) {
    setSubject(nextSubject);
    const list = topicsBySubject[nextSubject] ?? [];
    setTopic(list[0] ?? '');
  }

  async function handleGenerate() {
    if (!topic) return;
    setGenerating(true);
    onError('');
    try {
      const res = await facultyGenerateDraftQuestion(paperId, {
        subject: subject as FacultyPaperItem['subject'],
        topic,
        questionType,
      });
      setCandidate(res.candidate);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to generate question');
    } finally {
      setGenerating(false);
    }
  }

  async function handleAccept() {
    if (!candidate) return;
    setAccepting(true);
    onError('');
    try {
      const res = await facultyAcceptDraftQuestion(paperId, targetNumber, candidate);
      onPaperUpdated(res.paper);
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to save accepted question');
    } finally {
      setAccepting(false);
    }
  }

  return (
    <div className="mt-3 rounded-[22px] border border-accent/30 bg-accent-50 p-4">
      <div className="mb-2.5 flex items-center justify-between">
        <strong className="text-[13px] text-accent-900">
          ✨ {targetNumber !== null ? `Sparkle Replace Q${targetNumber}` : 'Sparkle Add New Question'}
        </strong>
        <button type="button" className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-2 py-[3px] text-[11px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="mb-2 flex flex-col gap-1.5">
          <label className="text-[12.5px] font-extrabold text-[#003366]">Subject</label>
          <select
            className="h-[46px] w-full cursor-pointer rounded-xl border-[2.5px] border-[#003366] bg-white px-3 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
            value={subject}
            onChange={(e) => handleSubjectChange(e.target.value)}
            disabled={generating || accepting}
          >
            {availableSubjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="mb-2 flex flex-col gap-1.5">
          <label className="text-[12.5px] font-extrabold text-[#003366]">Topic</label>
          <select
            className="h-[46px] w-full cursor-pointer rounded-xl border-[2.5px] border-[#003366] bg-white px-3 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={generating || accepting}
          >
            {subjectTopics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="mb-2 flex flex-col gap-1.5">
          <label className="text-[12.5px] font-extrabold text-[#003366]">Question Type</label>
          <select
            className="h-[46px] w-full cursor-pointer rounded-xl border-[2.5px] border-[#003366] bg-white px-3 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
            value={questionType}
            disabled={generating || accepting}
            onChange={(e) => setQuestionType(e.target.value as FacultyQuestionType)}
          >
            <option value="mcq_single">Single-correct MCQ</option>
            <option value="matrix_match">Matrix Match / Match the List</option>
            {examType !== 'NEET' && <option value="integer">Integer Type</option>}
            {examType === 'Advanced' && <option value="mcq_multi">Multi-correct MCQ</option>}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1 rounded-xl border-[2.5px] border-accent bg-accent-50 px-2.5 py-1.5 text-[12px] font-extrabold text-accent transition-colors duration-150 hover:bg-accent-100 disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
          onClick={() => void handleGenerate()}
          disabled={generating || accepting || !topic}
        >
          {generating ? '✨ Generating verified draft…' : candidate ? '✨ Generate Another' : '✨ Generate Candidate'}
        </button>
      </div>

      {candidate && (
        <div className="mt-3 rounded-2xl border border-accent/40 bg-white p-3.5">
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-ice px-2 py-0.5 text-[11.5px] font-bold text-[#003366]">{candidate.subject} · {candidate.topic}</span>
              <span className={candidate.verified ? 'rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[11.5px] font-bold text-[#15803D]' : 'rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[11.5px] font-bold text-[#B45309]'}>
                {candidate.verified ? 'Verified ✓' : 'Unverified Draft'}
              </span>
            </div>
          </div>

          <QuestionContent item={candidate} />

          <div className="mt-3 flex flex-wrap gap-1.5">
            <button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-accent bg-white px-3 py-1.5 text-[12.5px] font-extrabold text-accent no-underline shadow-[0_4px_0_#E2C2F0] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#E2C2F0] active:translate-y-[3px] active:shadow-[0_1px_0_#E2C2F0] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
              onClick={() => void handleAccept()}
              disabled={accepting || generating}
            >
              {accepting
                ? 'Saving…'
                : targetNumber !== null
                  ? `Accept & Replace Q${targetNumber}`
                  : 'Accept & Add to Paper'}
            </button>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
              onClick={() => setCandidate(null)}
              disabled={accepting || generating}
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface QuestionCardProps {
  paperId: string;
  examType: FacultyExamType;
  item: FacultyPaperItem;
  canDelete: boolean;
  busy: boolean;
  topicsBySubject: Record<string, string[]>;
  onPaperUpdated: (paper: FacultyPaper) => void;
  onError: (msg: string) => void;
}

function FacultyQuestionCard({
  paperId,
  examType,
  item,
  canDelete,
  busy,
  topicsBySubject,
  onPaperUpdated,
  onError,
}: QuestionCardProps) {
  const [editing, setEditing] = useState(false);
  const [sparkleOpen, setSparkleOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [draftText, setDraftText] = useState(item.questionText);
  const [draftOptions, setDraftOptions] = useState<string[]>(item.options);
  const [draftAnswer, setDraftAnswer] = useState(item.correctAnswer);
  const [draftExplain, setDraftExplain] = useState(item.explanation);
  const [removeDiagram, setRemoveDiagram] = useState(false);

  function openEdit() {
    setDraftText(item.questionText);
    setDraftOptions(item.options);
    setDraftAnswer(item.correctAnswer);
    setDraftExplain(item.explanation);
    setRemoveDiagram(false);
    setSparkleOpen(false);
    setEditing(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    onError('');
    try {
      const payload = {
        questionText: draftText,
        ...(item.questionType !== 'integer' ? { options: draftOptions } : {}),
        correctAnswer: draftAnswer,
        explanation: draftExplain,
        ...(removeDiagram ? { removeDiagram: true } : {}),
      };
      const res = await facultyUpdateQuestion(paperId, item.number, payload);
      onPaperUpdated(res.paper);
      setEditing(false);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to save question edit');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!canDelete) return;
    setDeleting(true);
    onError('');
    try {
      const res = await facultyDeleteQuestion(paperId, item.number);
      onPaperUpdated(res.paper);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to delete question');
    } finally {
      setDeleting(false);
    }
  }

  const typeLabel = item.questionType === 'mcq_multi'
    ? 'Multi-correct'
    : item.questionType === 'integer'
      ? 'Integer'
      : item.questionType === 'matrix_match'
        ? 'Matrix Match'
        : 'Single-correct';

  return (
    <article className="mb-3.5 rounded-[22px] border border-[#003366]/10 bg-white p-4 shadow-[0_16px_40px_-34px_rgba(0,51,102,.4)] sm:p-[18px]">
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display text-[15px] font-extrabold text-[#003366]">Q{item.number}</span>
          <span className="rounded-lg bg-ice px-2 py-0.5 text-[11.5px] font-bold text-[#003366]">{item.subject} · {item.topic}</span>
          <span className="rounded-lg bg-ice px-2 py-0.5 text-[11.5px] font-bold text-[#003366]">{typeLabel}</span>
          {item.editedByFaculty && (
            <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[11.5px] font-bold text-[#15803D]">Edited ✓</span>
          )}
        </div>
        {!busy && (
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1 rounded-xl border-[2.5px] border-accent bg-accent-50 px-2.5 py-1.5 text-[12px] font-extrabold text-accent transition-colors duration-150 hover:bg-accent-100 disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
              onClick={() => { setEditing(false); setSparkleOpen((v) => !v); }}
              disabled={saving || deleting}
            >
              ✨ {sparkleOpen ? 'Close Sparkle' : 'Sparkle Replace'}
            </button>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
              onClick={editing ? () => setEditing(false) : openEdit}
              disabled={saving || deleting}
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-xl border border-[#C8202F]/30 bg-white px-2.5 py-1.5 text-[12px] font-bold text-[#C8202F] transition-colors duration-150 hover:bg-[#FDF3F4] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
              onClick={() => void handleDelete()}
              disabled={!canDelete || saving || deleting}
              title={canDelete ? 'Delete question & renumber' : 'Paper must keep at least 1 question'}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      {!editing ? (
        <QuestionContent item={item} />
      ) : (
        <form onSubmit={handleSave} className="mt-3 rounded-2xl border border-[#003366]/15 bg-[#FBFCFE] p-3.5">
          <div className="mb-3.5 flex flex-col gap-1.5">
            <label className="text-[12.5px] font-extrabold text-[#003366]">Question (supports $LaTeX$)</label>
            <textarea
              className="min-h-[76px] w-full resize-y rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2.5 text-[14px] font-semibold leading-relaxed text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              required
            />
          </div>

          {item.questionType !== 'integer' && (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {draftOptions.map((opt, idx) => (
                <div key={LETTERS[idx]} className="mb-3.5 flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-extrabold text-[#003366]">Option {LETTERS[idx]}</label>
                  <input
                    className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
                    value={opt}
                    onChange={(e) => {
                      const next = [...draftOptions];
                      next[idx] = e.target.value;
                      setDraftOptions(next);
                    }}
                    required
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mb-3.5 flex flex-col gap-1.5">
            <label className="text-[12.5px] font-extrabold text-[#003366]">
              Correct Answer {item.questionType === 'mcq_multi' ? '(e.g. A,C)' : item.questionType === 'integer' ? '(non-negative integer)' : '(A, B, C, or D)'}
            </label>
            <input
              className="h-[46px] w-full rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 text-[14px] font-semibold text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
              value={draftAnswer}
              onChange={(e) => setDraftAnswer(e.target.value)}
              required
            />
          </div>

          <div className="mb-3.5 flex flex-col gap-1.5">
            <label className="text-[12.5px] font-extrabold text-[#003366]">Step-by-step Solution</label>
            <textarea
              className="min-h-[76px] w-full resize-y rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2.5 text-[14px] font-semibold leading-relaxed text-[#003366] shadow-[0_4px_0_#C6D2F8] outline-none transition-[box-shadow,border-color] duration-150 placeholder:font-medium placeholder:text-[#97A3D4] focus:border-accent focus:shadow-[0_6px_0_#E3C9E6] motion-reduce:transition-none"
              value={draftExplain}
              onChange={(e) => setDraftExplain(e.target.value)}
            />
          </div>

          {item.diagram && (
            <label className="mb-3 flex cursor-pointer items-center gap-2 text-[12px] text-[#C8202F]">
              <input
                type="checkbox"
                checked={removeDiagram}
                onChange={(e) => setRemoveDiagram(e.target.checked)}
              />
              <span>Remove attached diagram from this question</span>
            </label>
          )}

          <div className="flex flex-wrap gap-1.5">
            <button type="submit" className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#5A2560] bg-grad px-4 py-2 text-[13px] font-extrabold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[3px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none" disabled={saving}>
              {saving ? 'Saving…' : 'Save Question'}
            </button>
            <button type="button" className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none" onClick={() => setEditing(false)} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {sparkleOpen && (
        <SparklePanel
          paperId={paperId}
          examType={examType}
          targetNumber={item.number}
          initialSubject={item.subject}
          initialTopic={item.topic}
          initialType={item.questionType}
          topicsBySubject={topicsBySubject}
          onPaperUpdated={onPaperUpdated}
          onClose={() => setSparkleOpen(false)}
          onError={onError}
        />
      )}
    </article>
  );
}

interface PreviewProps {
  paper: FacultyPaper;
  topicsBySubject: Record<string, string[]>;
  onBack: () => void;
  onPaperUpdated: (paper: FacultyPaper) => void;
  onDelete: (paperId: string) => Promise<void>;
  onError: (msg: string) => void;
}

export function FacultyPaperPreview({
  paper,
  topicsBySubject,
  onBack,
  onPaperUpdated,
  onDelete,
  onError,
}: PreviewProps) {
  const [deletingPaper, setDeletingPaper] = useState(false);
  const [addSparkleOpen, setAddSparkleOpen] = useState(false);

  useEffect(() => {
    setAddSparkleOpen(false);
  }, [paper.id]);

  const isGenerating = paper.status === 'generating';

  const firstSel = paper.selections[0];
  const defaultSubject = firstSel?.subject ?? (Object.keys(topicsBySubject)[0] as FacultyPaperItem['subject'] | undefined) ?? 'Physics';
  const defaultTopic = firstSel?.topic ?? topicsBySubject[defaultSubject]?.[0] ?? '';

  async function handleDeletePaper() {
    if (isGenerating) return;
    setDeletingPaper(true);
    try {
      await onDelete(paper.id);
    } finally {
      setDeletingPaper(false);
    }
  }

  return (
    <section className="rounded-[28px] border border-[#003366]/10 bg-white p-5 shadow-[0_24px_56px_-36px_rgba(0,51,102,.45)] sm:p-6">
      <div className="mb-3.5">
        <button type="button" className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none" onClick={onBack}>
          ← Back to Paper Stack
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-start justify-between gap-4 border-b border-[#003366]/10 pb-4">
        <div>
          {paper.organization && (
            <div className="mb-0.5 text-[13px] font-extrabold uppercase tracking-[0.04em] text-[#003366]">
              🏛️ {paper.organization}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-ice px-2 py-0.5 font-mono text-[11px] font-bold text-accent">{paper.paperCode}</span>
            <h2 className="font-display text-[18px] font-extrabold leading-tight tracking-[-0.02em] text-[#003366]">{paper.title}</h2>
          </div>
          <p className="mt-1 text-[13px] font-medium text-[#5A6B8C]">
            {paper.examType === 'NEET' ? 'NEET-UG' : `JEE ${paper.examType}`} · {paper.difficulty}
            {!isGenerating && ` · ${paper.questionCount} Questions`}
          </p>
          {paper.status === 'ready' && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={`/faculty/papers/${paper.id}/print?mode=questions&download=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-accent bg-white px-3 py-1.5 text-[12.5px] font-extrabold text-accent no-underline shadow-[0_4px_0_#E2C2F0] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#E2C2F0] active:translate-y-[3px] active:shadow-[0_1px_0_#E2C2F0] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
              >
                Download PDF: Question Paper
              </Link>
              <Link
                href={`/faculty/papers/${paper.id}/print?mode=solutions&download=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-accent bg-white px-3 py-1.5 text-[12.5px] font-extrabold text-accent no-underline shadow-[0_4px_0_#E2C2F0] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#E2C2F0] active:translate-y-[3px] active:shadow-[0_1px_0_#E2C2F0] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
              >
                Download PDF: Paper + Solutions
              </Link>
              <Link
                href={`/faculty/papers/${paper.id}/print?mode=key&download=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-accent bg-white px-3 py-1.5 text-[12.5px] font-extrabold text-accent no-underline shadow-[0_4px_0_#E2C2F0] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#E2C2F0] active:translate-y-[3px] active:shadow-[0_1px_0_#E2C2F0] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
              >
                Download PDF: Answer Key
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="cursor-pointer rounded-xl border border-[#C8202F]/30 bg-white px-2.5 py-1.5 text-[12px] font-bold text-[#C8202F] transition-colors duration-150 hover:bg-[#FDF3F4] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
          onClick={() => void handleDeletePaper()}
          disabled={isGenerating || deletingPaper}
        >
          {deletingPaper ? 'Deleting…' : 'Delete Paper'}
        </button>
      </div>

      {isGenerating && (
        <div className="mb-5 flex flex-col items-center justify-center gap-3.5 rounded-[28px] border border-[#003366]/10 bg-white px-5 py-10 shadow-[0_24px_56px_-40px_rgba(0,51,102,.4)]">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#C6D2F8] border-t-accent motion-reduce:animate-none" />
          <div className="font-display text-[17px] font-extrabold text-[#003366]">Generating questions…</div>
          <p className="m-0 text-[13px] font-medium text-[#5A6B8C]">Please wait while your verified questions are prepared.</p>
        </div>
      )}

      {paper.status === 'error' && (
        <div className="mb-3.5 rounded-2xl border border-[#C8202F]/25 bg-[#FDF3F4] px-3.5 py-2.5 text-[13px] font-semibold text-[#C8202F]">
          {paper.errorMessage || 'Generation failed. Try generating again or selecting another topic.'}
        </div>
      )}

      {!isGenerating &&
        paper.items.map((item) => (
          <FacultyQuestionCard
            key={item.number}
            paperId={paper.id}
            examType={paper.examType}
            item={item}
            canDelete={paper.items.length > 1}
            busy={false}
            topicsBySubject={topicsBySubject}
            onPaperUpdated={onPaperUpdated}
            onError={onError}
          />
        ))}

      {paper.status === 'ready' && (
        <div className="mt-4 flex flex-col gap-2.5 border-t border-dashed border-[#003366]/20 pt-4">
          {!addSparkleOpen ? (
            <div>
              <button type="button" className="inline-flex cursor-pointer items-center gap-1 rounded-xl border-[2.5px] border-accent bg-accent-50 px-2.5 py-1.5 text-[12px] font-extrabold text-accent transition-colors duration-150 hover:bg-accent-100 disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none" onClick={() => setAddSparkleOpen(true)}>
                ✨ Add Question (Choose Topic &amp; Preview)
              </button>
            </div>
          ) : (
            <SparklePanel
              paperId={paper.id}
              examType={paper.examType}
              targetNumber={null}
              initialSubject={defaultSubject}
              initialTopic={defaultTopic}
              initialType="mcq_single"
              topicsBySubject={topicsBySubject}
              onPaperUpdated={onPaperUpdated}
              onClose={() => setAddSparkleOpen(false)}
              onError={onError}
            />
          )}
        </div>
      )}
    </section>
  );
}
