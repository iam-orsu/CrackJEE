'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DiagramRenderer } from '@/components/DiagramRenderer';
import { MathText, stripOptionPrefix } from '@/lib/math';
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
import styles from '@/app/faculty/faculty.module.css';

const LETTERS = ['A', 'B', 'C', 'D'];

function isOptionSelected(correctAnswer: string, letter: string): boolean {
  return correctAnswer.toUpperCase().split(',').map((s) => s.trim()).includes(letter);
}

/** Shared renderer used by both saved question cards and Sparkle draft candidate previews. */
function QuestionContent({ item }: { item: FacultyPaperItem }) {
  return (
    <>
      <div className={styles.qBody}>
        <MathText text={item.questionText} />
      </div>

      {item.diagram && (
        <div className={styles.diagramWrap}>
          <DiagramRenderer descriptor={item.diagram} />
        </div>
      )}

      {item.questionType !== 'integer' && item.options.length > 0 && (
        <div className={styles.optGrid}>
          {item.options.map((opt, idx) => {
            const letter = LETTERS[idx]!;
            const isCorrect = isOptionSelected(item.correctAnswer, letter);
            return (
              <div key={letter} className={`${styles.optBox} ${isCorrect ? styles.optBoxCorrect : ''}`}>
                <span className={styles.optLetter}>{letter})</span>
                <MathText text={stripOptionPrefix(opt)} />
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.answerLine}>Answer: {item.correctAnswer}</div>

      {item.explanation && (
        <div className={styles.explainBox}>
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
    <div className={styles.sparkleBox}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <strong style={{ fontSize: 13, color: '#5b21b6' }}>
          ✨ {targetNumber !== null ? `Sparkle Replace Q${targetNumber}` : 'Sparkle Add New Question'}
        </strong>
        <button type="button" className={styles.btn} style={{ fontSize: 11, padding: '3px 8px' }} onClick={onClose}>
          Close
        </button>
      </div>

      <div className={styles.row3}>
        <div className={styles.field} style={{ marginBottom: 8 }}>
          <label className={styles.label}>Subject</label>
          <select
            className={styles.select}
            value={subject}
            onChange={(e) => handleSubjectChange(e.target.value)}
            disabled={generating || accepting}
          >
            {availableSubjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className={styles.field} style={{ marginBottom: 8 }}>
          <label className={styles.label}>Topic</label>
          <select
            className={styles.select}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={generating || accepting}
          >
            {subjectTopics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className={styles.field} style={{ marginBottom: 8 }}>
          <label className={styles.label}>Question Type</label>
          <select
            className={styles.select}
            value={questionType}
            disabled={examType === 'NEET' || generating || accepting}
            onChange={(e) => setQuestionType(e.target.value as FacultyQuestionType)}
          >
            <option value="mcq_single">Single-correct MCQ</option>
            {examType !== 'NEET' && <option value="integer">Integer Type</option>}
            {examType === 'Advanced' && <option value="mcq_multi">Multi-correct MCQ</option>}
          </select>
        </div>
      </div>

      <div className={styles.qActions}>
        <button
          type="button"
          className={styles.btnSparkle}
          onClick={() => void handleGenerate()}
          disabled={generating || accepting || !topic}
        >
          {generating ? '✨ Generating verified draft…' : candidate ? '✨ Generate Another' : '✨ Generate Candidate'}
        </button>
      </div>

      {candidate && (
        <div className={styles.draftPreview}>
          <div className={styles.qCardHead}>
            <div className={styles.qMeta}>
              <span className={styles.qTag}>{candidate.subject} · {candidate.topic}</span>
              <span className={candidate.verified ? styles.badgeVerified : styles.badgeWarn}>
                {candidate.verified ? 'Verified ✓' : 'Unverified Draft'}
              </span>
            </div>
          </div>

          <QuestionContent item={candidate} />

          <div className={styles.qActions} style={{ marginTop: 12 }}>
            <button
              type="button"
              className={styles.btnAccent}
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
              className={styles.btn}
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
      : 'Single-correct';

  return (
    <article className={styles.questionCard}>
      <div className={styles.qCardHead}>
        <div className={styles.qMeta}>
          <span className={styles.qNum}>Q{item.number}</span>
          <span className={styles.qTag}>{item.subject} · {item.topic}</span>
          <span className={styles.qTag}>{typeLabel}</span>
          {item.editedByFaculty ? (
            <span className={styles.badgeVerified}>Edited ✓</span>
          ) : item.verified ? (
            <span className={styles.badgeVerified}>Verified ✓</span>
          ) : (
            <span className={styles.badgeWarn}>Unverified — Review</span>
          )}
        </div>
        {!busy && (
          <div className={styles.qActions}>
            <button
              type="button"
              className={styles.btnSparkle}
              onClick={() => { setEditing(false); setSparkleOpen((v) => !v); }}
              disabled={saving || deleting}
            >
              ✨ {sparkleOpen ? 'Close Sparkle' : 'Sparkle Replace'}
            </button>
            <button
              type="button"
              className={styles.btn}
              onClick={editing ? () => setEditing(false) : openEdit}
              disabled={saving || deleting}
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
            <button
              type="button"
              className={styles.btnDanger}
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
        <form onSubmit={handleSave} className={styles.editBox}>
          <div className={styles.field}>
            <label className={styles.label}>Question (supports $LaTeX$)</label>
            <textarea
              className={styles.textarea}
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              required
            />
          </div>

          {item.questionType !== 'integer' && (
            <div className={styles.row2}>
              {draftOptions.map((opt, idx) => (
                <div key={LETTERS[idx]} className={styles.field}>
                  <label className={styles.label}>Option {LETTERS[idx]}</label>
                  <input
                    className={styles.input}
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

          <div className={styles.field}>
            <label className={styles.label}>
              Correct Answer {item.questionType === 'mcq_multi' ? '(e.g. A,C)' : item.questionType === 'integer' ? '(non-negative integer)' : '(A, B, C, or D)'}
            </label>
            <input
              className={styles.input}
              value={draftAnswer}
              onChange={(e) => setDraftAnswer(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Step-by-step Solution</label>
            <textarea
              className={styles.textarea}
              value={draftExplain}
              onChange={(e) => setDraftExplain(e.target.value)}
            />
          </div>

          {item.diagram && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, marginBottom: 12, color: '#b91c1c', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={removeDiagram}
                onChange={(e) => setRemoveDiagram(e.target.checked)}
              />
              <span>Remove attached diagram from this question</span>
            </label>
          )}

          <div className={styles.qActions}>
            <button type="submit" className={styles.btnPrimary} disabled={saving}>
              {saving ? 'Saving…' : 'Save Question'}
            </button>
            <button type="button" className={styles.btn} onClick={() => setEditing(false)} disabled={saving}>
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
    <section className={styles.panel}>
      <div style={{ marginBottom: 14 }}>
        <button type="button" className={styles.btn} onClick={onBack}>
          ← Back to Paper Stack
        </button>
      </div>

      <div className={styles.previewHeader}>
        <div>
          <div className={styles.paperCardTop}>
            <span className={styles.paperCodeBadge}>{paper.paperCode}</span>
            <h2 className={styles.title} style={{ fontSize: 18 }}>{paper.title}</h2>
          </div>
          <p className={styles.sub} style={{ marginTop: 4 }}>
            {paper.examType === 'NEET' ? 'NEET-UG' : `JEE ${paper.examType}`} · {paper.difficulty}
            {!isGenerating && ` · ${paper.questionCount} Questions · ${paper.verifiedCount}/${paper.items.length} Verified`}
          </p>
          {paper.status === 'ready' && (
            <div className={styles.pdfBar}>
              <Link
                href={`/faculty/papers/${paper.id}/print?mode=questions&download=1`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnAccent}
              >
                Download PDF: Question Paper
              </Link>
              <Link
                href={`/faculty/papers/${paper.id}/print?mode=solutions&download=1`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnAccent}
              >
                Download PDF: Paper + Solutions
              </Link>
              <Link
                href={`/faculty/papers/${paper.id}/print?mode=key&download=1`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnAccent}
              >
                Download PDF: Answer Key
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className={styles.btnDanger}
          onClick={() => void handleDeletePaper()}
          disabled={isGenerating || deletingPaper}
        >
          {deletingPaper ? 'Deleting…' : 'Delete Paper'}
        </button>
      </div>

      {isGenerating && (
        <div className={styles.loadingWrap}>
          <div className={styles.loadingSpinner} />
          <div className={styles.loadingTitle}>Generating questions…</div>
          <p className={styles.loadingSub}>Please wait while your verified questions are prepared.</p>
        </div>
      )}

      {paper.status === 'error' && (
        <div className={styles.error}>
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
        <div className={styles.addQuestionBar}>
          {!addSparkleOpen ? (
            <div>
              <button type="button" className={styles.btnSparkle} onClick={() => setAddSparkleOpen(true)}>
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
