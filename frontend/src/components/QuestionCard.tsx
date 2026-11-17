'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { CSSProperties } from 'react';
import type { Question, AnswerResult, ExplanationTier } from '@/types';
import { api } from '@/lib/api';
import { DiagramRenderer } from './DiagramRenderer';
import { renderMathHtml, renderExplanationHtml, splitExplanationSteps, stripOptionPrefix } from '@/lib/math';
import { MatchListTable, parseMatchQuestion } from '@/components/common/MatchListTable';
import { ALL_SKIN, SKIN, SYMBOL } from './practice/skin';
import type { MarkingScheme } from './practice/shared';

interface Props {
  question: Question;
  questionNum: number;
  onSubmit: (answer: string, timeSpent: number) => Promise<AnswerResult>;
  onNext: () => void;
  initialResult?: AnswerResult;
  initialSelected?: string;
  isLast?: boolean;
  markingScheme?: MarkingScheme;
}

const LETTERS = ['A', 'B', 'C', 'D'];

const CHECK = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const CROSS = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ARROW = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const CLOCK = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
  </svg>
);
const SHEET = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" /><path d="M9 13h6M9 17h4" />
  </svg>
);
const EXPAND = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
  </svg>
);
const CLOSE = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
const TIER_ICON = {
  simple: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 6h16M4 11h11M4 16h16M4 21h8" />
    </svg>
  ),
  better: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 5h5v4H4zM4 15h5v4H4zM11 7h9M11 17h9" />
    </svg>
  ),
  best: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="9" r="5.5" /><path d="M8.6 13.6 7.5 21l4.5-2.6 4.5 2.6-1.1-7.4" />
    </svg>
  ),
};

/* The paper speaks in official exam language. */
const TYPE_LABEL: Record<string, string> = {
  mcq_single: 'Single correct',
  mcq_multi: 'Multiple correct',
  integer: 'Numerical answer',
  matrix_match: 'Matrix match',
};

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: 'Easy',
  intermediate: 'Medium',
  advanced: 'Hard',
  mixed: 'Mixed',
};

const MARKING_LABEL: Record<MarkingScheme, string> = {
  standard: '+1 for a correct response, 0 for a wrong one',
  jee_main: '+4 for a correct response, −1 for a wrong one',
  jee_advanced: '+4 for a correct response, −2 for a wrong one',
};

export function QuestionCard({ question, questionNum, onSubmit, onNext, initialResult, initialSelected, isLast, markingScheme = 'jee_main' }: Props) {
  const qt = question.questionType ?? 'mcq_single';

  // State per question type
  const [selected, setSelected]         = useState<string | null>(
    qt === 'mcq_single' ? (initialSelected ?? null) : null,
  );
  const [selectedMulti, setSelectedMulti] = useState<Set<string>>(
    () => qt === 'mcq_multi' && initialSelected
      ? new Set(initialSelected.split(',').map((s) => s.trim()))
      : new Set(),
  );
  const [integerInput, setIntegerInput]  = useState<string>(
    qt === 'integer' ? (initialSelected ?? '') : '',
  );

  const [result, setResult]         = useState<AnswerResult | null>(initialResult ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [elapsed, setElapsed]       = useState(0);
  const startRef  = useRef(Date.now());
  const timerRef  = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const [activeTier, setActiveTier] = useState<ExplanationTier>('simple');
  const [aiExplanations, setAiExplanations] = useState<Record<'better' | 'best', string | null>>({
    better: initialResult?.betterExplanation ?? null,
    best: initialResult?.bestExplanation ?? null,
  });
  const [loadingTier, setLoadingTier] = useState(false);
  const [tierError, setTierError]   = useState<string | null>(null);

  /* The long solutions open in a reading dialog. */
  const [solutionOpen, setSolutionOpen] = useState(false);
  const dialogRef   = useRef<HTMLDivElement>(null);
  const closeRef    = useRef<HTMLButtonElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const [canExpand, setCanExpand] = useState(false);

  const handleSelectTier = useCallback(async (tier: ExplanationTier) => {
    setActiveTier(tier);
    setTierError(null);

    if (tier === 'simple') return;
    if (aiExplanations[tier]) return;

    setLoadingTier(true);
    try {
      const data = await api.questions.explain(question.id, tier);
      setAiExplanations((prev) => ({
        ...prev,
        [tier]: data.explanation,
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate explanation. Please try again.';
      setTierError(msg);
    } finally {
      setLoadingTier(false);
    }
  }, [aiExplanations, question.id]);

  useEffect(() => {
    clearInterval(timerRef.current);
    setActiveTier('simple');
    setAiExplanations({
      better: initialResult?.betterExplanation ?? null,
      best: initialResult?.bestExplanation ?? null,
    });
    setLoadingTier(false);
    setTierError(null);

    if (initialResult) {
      setResult(initialResult);
      if (qt === 'mcq_multi' && initialSelected) {
        setSelectedMulti(new Set(initialSelected.split(',').map((s) => s.trim())));
      } else if (qt === 'integer') {
        setIntegerInput(initialSelected ?? '');
      } else {
        setSelected(initialSelected ?? null);
      }
      return;
    }

    setSelected(null);
    setSelectedMulti(new Set());
    setIntegerInput('');
    setResult(null);
    setSubmitError('');
    setElapsed(0);
    startRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const canSubmit =
    qt === 'mcq_multi' ? selectedMulti.size > 0
    : qt === 'integer' ? integerInput.trim() !== '' && !isNaN(parseInt(integerInput.trim(), 10)) && parseInt(integerInput.trim(), 10) >= 0
    : !!selected;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || submitting || result) return;
    clearInterval(timerRef.current);
    setSubmitting(true);
    setSubmitError('');

    let answer: string;
    if (qt === 'mcq_multi') {
      answer = [...selectedMulti].sort().join(',');
    } else if (qt === 'integer') {
      answer = integerInput.trim();
    } else {
      answer = selected!;
    }

    try {
      const timeSpent = Math.max(1, Math.floor((Date.now() - startRef.current) / 1000));
      const res = await onSubmit(answer, timeSpent);
      setResult(res);
      setAiExplanations({
        better: res.betterExplanation ?? null,
        best: res.bestExplanation ?? null,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit answer. Please try again.');
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
      }, 1000);
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, submitting, result, qt, selectedMulti, integerInput, selected, onSubmit]);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');
  const skin = SKIN[question.subject] ?? ALL_SKIN;
  const symbol = SYMBOL[question.subject] ?? '·';
  const typeLabel = TYPE_LABEL[qt] ?? 'Single correct';
  const difficultyLabel = DIFFICULTY_LABEL[question.difficulty] ?? question.difficulty;
  const marksLabel = MARKING_LABEL[markingScheme];

  // Correct letters for multi-correct result display
  const correctLetters = result?.correctAnswer
    ? result.correctAnswer.split(',').map((s) => s.trim())
    : [];

  /* The answer key, the way a solutions booklet prints it. */
  const answerKey = useMemo(() => {
    if (!result) return '';
    const raw = result.correctAnswer ?? '';
    if (qt === 'integer' || qt === 'matrix_match') return raw;
    const keys = raw.split(',').map((s) => s.trim()).filter(Boolean);
    const texts = keys
      .map((k) => {
        const idx = LETTERS.indexOf(k);
        if (idx < 0) return null;
        const t = stripOptionPrefix(question.options[idx] ?? '');
        return t && t.length <= 40 ? t : null;
      })
      .filter(Boolean) as string[];
    const keyText = keys.join(', ');
    return texts.length ? `${keyText} — ${texts.join('; ')}` : keyText;
  }, [result, qt, question.options]);

  /* The solution for the tier on screen, split into printed steps when the
     explanation carries step markers. */
  const tierText = activeTier === 'better'
    ? aiExplanations.better
    : activeTier === 'best'
    ? aiExplanations.best
    : result?.explanation ?? '';
  const tierHtml = useMemo(() => renderExplanationHtml(tierText ?? ''), [tierText]);
  const isPlainTier = tierHtml.includes('explain-simple-text');
  const splitSteps = isPlainTier ? splitExplanationSteps(tierText ?? '') : null;

  const clearResponse = () => {
    if (qt === 'mcq_multi') setSelectedMulti(new Set());
    else if (qt === 'integer') setIntegerInput('');
    else setSelected(null);
  };
  const hasResponse = qt === 'mcq_multi' ? selectedMulti.size > 0 : qt === 'integer' ? integerInput.trim() !== '' : !!selected;

  /* The expand control appears when the solution runs past its pane. */
  useEffect(() => {
    const pane = solutionRef.current;
    const content = contentRef.current;
    if (!pane || !content) { setCanExpand(false); return; }
    const check = () => {
      const natural = content.offsetHeight;
      const visible = pane.clientHeight;
      setCanExpand(natural > visible + 8 || natural > window.innerHeight * 1.2);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(content);
    window.addEventListener('resize', check);
    return () => { ro.disconnect(); window.removeEventListener('resize', check); };
  }, [result, activeTier, tierText, loadingTier, tierError]);

  /* Escape closes the dialog, Tab stays inside it, focus returns where it came from. */
  useEffect(() => {
    if (!solutionOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSolutionOpen(false); return; }
      if (e.key !== 'Tab') return;
      const el = dialogRef.current;
      if (!el) return;
      const items = el.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      opener?.focus?.();
    };
  }, [solutionOpen]);

  /* Short answers print in two columns on a response sheet, the way an OMR
     form does. Long ones stay in one column so the text keeps its measure. */
  const twoColumnOptions =
    qt !== 'matrix_match' &&
    question.options.length <= 4 &&
    question.options.every((o) => stripOptionPrefix(o).length <= 28);

  /* The tier content, shared by the panel and the reading dialog. */
  const tierContent = loadingTier ? (
    <div className="qpaper-solution-loading">
      <span className="qpaper-spinner" aria-hidden />
      <p>Writing the {activeTier === 'better' ? 'step-by-step breakdown' : 'masterclass breakdown'}</p>
    </div>
  ) : tierError ? (
    <div className="qpaper-solution-error">
      <p>{tierError}</p>
      <div className="qpaper-solution-error-actions">
        <button type="button" className="qpaper-btn is-quiet" onClick={() => handleSelectTier(activeTier)}>
          Try again
        </button>
        <button type="button" className="qpaper-btn is-quiet" onClick={() => handleSelectTier('simple')}>
          Show simple
        </button>
      </div>
    </div>
  ) : !tierText ? (
    <div className="qpaper-solution-empty">
      <span className="qpaper-solution-empty-icon" aria-hidden>{SHEET}</span>
      <p>No explanation was recorded for this question.</p>
    </div>
  ) : (
    <div className="qpaper-solution-body">
      {splitSteps ? (
        <>
          {splitSteps.lead && (
            <p className="sol-lead" dangerouslySetInnerHTML={{ __html: renderExplanationHtml(splitSteps.lead) }} />
          )}
          <ol className="sol-steps">
            {splitSteps.steps.map((step, i) => (
              <li className="sol-step" key={`${step.label}-${i}`}>
                <span className="sol-step-num">{step.label}</span>
                <div
                  className="sol-step-body"
                  dangerouslySetInnerHTML={{ __html: renderExplanationHtml(step.text) }}
                />
              </li>
            ))}
          </ol>
        </>
      ) : (
        <div className="qpaper-solution-text" dangerouslySetInnerHTML={{ __html: tierHtml }} />
      )}
    </div>
  );

  const tierTabs = (
    <div className="tier-tabs" role="tablist" aria-label="Explanation depth">
      {([
        { key: 'simple' as const, label: 'Simple' },
        { key: 'better' as const, label: 'Better' },
        { key: 'best' as const, label: 'Best' },
      ]).map((tier) => (
        <button
          key={tier.key}
          type="button"
          role="tab"
          aria-selected={activeTier === tier.key}
          className={`tier-tab${activeTier === tier.key ? ' is-active' : ''}`}
          onClick={() => handleSelectTier(tier.key)}
          title={
            tier.key === 'simple' ? 'The short explanation'
            : tier.key === 'better' ? 'Step-by-step first-principles derivation'
            : 'Concepts, shortcuts and the traps to watch for'
          }
        >
          {TIER_ICON[tier.key]}
          {tier.label}
          {tier.key !== 'simple' && aiExplanations[tier.key] && <span className="tier-dot" title="Already generated" />}
        </button>
      ))}
    </div>
  );

  return (
    <article className="qpaper">
      {/* ── Masthead ── */}
      <header className="qpaper-head">
        <div className="qpaper-id">
          <span
            className="qpaper-mark"
            style={{ '--skin': skin.deep, '--skin-soft': skin.soft } as CSSProperties}
            aria-hidden
          >
            {symbol}
          </span>
          <div className="qpaper-where">
            <p className="qpaper-subject">{question.subject}</p>
            <p className="qpaper-topic">{question.topic}</p>
          </div>
        </div>

        <div className="qpaper-meta">
          <span className="qpaper-kind">{typeLabel} · {difficultyLabel}</span>
          <span className="qpaper-serial">Q{String(questionNum).padStart(2, '0')}</span>
          <span className="qpaper-clock">
            {CLOCK}
            {mm}:{ss}
          </span>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="qpaper-body">
        <div className="qpaper-main">
          <div className="qpaper-main-scroll">
            <div className="qpaper-content">
              {question.diagram && <DiagramRenderer descriptor={question.diagram} />}

              <div className="qpaper-q">
                <span className="qpaper-qnum">{questionNum}.</span>
                <div className="qpaper-qtext">
                  {qt === 'matrix_match' || parseMatchQuestion(question.questionText) ? (
                    <MatchListTable questionText={question.questionText} />
                  ) : (
                    <p className="question-text" dangerouslySetInnerHTML={{ __html: renderMathHtml(question.questionText) }} />
                  )}
                </div>
              </div>
    
              {/* ── Multi-correct hint ── */}
              {qt === 'mcq_multi' && !result && (
                <p className="qpaper-hint-line">One or more options may be correct. Mark every option that applies.</p>
              )}

              {/* ── Options, laid out as an OMR response sheet ── */}
              {qt !== 'integer' && (
                <div className={`omr${qt === 'mcq_multi' ? ' omr-multi' : ''}${twoColumnOptions ? ' is-two-col' : ''}`} role="group" aria-label="Answer options">
                  {question.options.map((opt, i) => {
                    const letter = LETTERS[i] ?? String.fromCharCode(65 + i);
    
                    if (qt === 'mcq_multi') {
                      const isSelectedM  = selectedMulti.has(letter);
                      const isCorrectOpt = correctLetters.includes(letter);
                      const isWrongSel   = !!result && isSelectedM && !isCorrectOpt;
                      const isMissed     = !!result && !isSelectedM && isCorrectOpt;
    
                      let cls = 'omr-row';
                      if (result) {
                        if (isCorrectOpt && isSelectedM) cls += ' is-correct';
                        else if (isWrongSel) cls += ' is-wrong';
                        else if (isMissed) cls += ' is-missed';
                      } else if (isSelectedM) {
                        cls += ' is-selected';
                      }
    
                      return (
                        <button key={letter} type="button" className={cls}
                          onClick={() => !result && setSelectedMulti((prev) => {
                            const next = new Set(prev);
                            if (next.has(letter)) next.delete(letter);
                            else next.add(letter);
                            return next;
                          })}
                          disabled={!!result}
                          aria-pressed={isSelectedM}
                        >
                          <span className="omr-cell" aria-hidden />
                          <span className="omr-key" aria-hidden>({letter})</span>
                          <span className="omr-text" dangerouslySetInnerHTML={{ __html: renderMathHtml(stripOptionPrefix(opt)) }} />
                          {result && isCorrectOpt && isSelectedM && <span className="omr-flag is-correct">{CHECK}</span>}
                          {result && isWrongSel && <span className="omr-flag is-wrong">{CROSS}</span>}
                          {result && isMissed && <span className="omr-flag is-missed">missed</span>}
                        </button>
                      );
                    }
    
                    // mcq_single
                    const isSelected = selected === letter;
                    const isCorrect  = !!result && letter === result.correctAnswer;
                    const isWrong    = !!result && isSelected && !result.isCorrect;
    
                    let cls = 'omr-row';
                    if (isCorrect)   cls += ' is-correct';
                    else if (isWrong) cls += ' is-wrong';
                    else if (isSelected) cls += ' is-selected';
    
                    return (
                      <button key={letter} type="button" className={cls}
                        onClick={() => !result && setSelected(letter)}
                        disabled={!!result}
                        aria-pressed={isSelected}
                      >
                        <span className="omr-cell" aria-hidden />
                        <span className="omr-key" aria-hidden>({letter})</span>
                        <span className="omr-text" dangerouslySetInnerHTML={{ __html: renderMathHtml(stripOptionPrefix(opt)) }} />
                        {isCorrect && <span className="omr-flag is-correct">{CHECK}</span>}
                        {isWrong   && <span className="omr-flag is-wrong">{CROSS}</span>}
                      </button>
                    );
                  })}
                </div>
              )}
    
              {/* ── Integer input ── */}
              {qt === 'integer' && (
                <div className="qpaper-numeric">
                  <label className="qpaper-numeric-label" htmlFor="qpaper-numeric-input">
                    Enter your answer
                    <span>{question.examType === 'Advanced' ? 'integer 0–9' : 'integer 0–99'}</span>
                  </label>
                  <input
                    id="qpaper-numeric-input"
                    type="number"
                    min={0}
                    max={question.examType === 'Advanced' ? 9 : 99}
                    value={integerInput}
                    onChange={(e) => !result && setIntegerInput(e.target.value)}
                    placeholder={question.examType === 'Advanced' ? '0 – 9' : '0 – 99'}
                    disabled={!!result}
                    className={`qpaper-numeric-input${result ? (result.isCorrect ? ' is-correct' : ' is-wrong') : ''}`}
                  />
                </div>
              )}

              {/* ── Status and action, once the question ends ── */}
              <div className="qpaper-actions">
                <div className="qpaper-status">
                  {submitError ? (
                    <span className="qpaper-status-error" role="alert">{submitError}</span>
                  ) : result ? (
                    <>
                      <span className={`qpaper-status-icon ${result.isCorrect ? 'is-correct' : 'is-wrong'}`} aria-hidden>
                        {result.isCorrect ? CHECK : CROSS}
                      </span>
                      <span className={`qpaper-status-label ${result.isCorrect ? 'is-correct' : 'is-wrong'}`}>
                        {result.isCorrect ? 'Correct response' : 'Incorrect response'}
                      </span>
                      {answerKey && (
                        <span className="qpaper-status-meta" dangerouslySetInnerHTML={{ __html: `Answer ${renderMathHtml(answerKey)}` }} />
                      )}
                      <span className="qpaper-status-meta">{mm}:{ss} on this question</span>
                    </>
                  ) : !canSubmit ? null : (
                    <span className="qpaper-status-meta">{marksLabel}</span>
                  )}
                </div>

                <div className="qpaper-actions-right">
                  {hasResponse && !result && (
                    <button type="button" className="qpaper-btn is-quiet" onClick={clearResponse}>
                      Clear response
                    </button>
                  )}
                  {!result && !canSubmit && (
                    <span className="qpaper-hint">
                      {qt === 'mcq_multi' ? 'Mark at least one option' : qt === 'integer' ? 'Enter an integer' : 'Mark an option first'}
                    </span>
                  )}
                  {result ? (
                    <button type="button" className="qpaper-btn is-primary" onClick={onNext}>
                      {isLast ? 'Finish session' : 'Next question'}
                      {ARROW}
                    </button>
                  ) : (
                    <button type="button" className="qpaper-btn is-primary" onClick={handleSubmit} disabled={!canSubmit || submitting}>
                      {submitting ? 'Checking' : 'Submit answer'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Solution. It opens with the answer, not before ── */}
        {result && (
        <aside className="qpaper-solution" aria-label="Solution">
          <div className="qpaper-solution-head">
            <div className="qpaper-solution-headrow">
              <h2 className="qpaper-solution-title">Solution</h2>
              {canExpand && (
                <button
                  type="button"
                  className="qpaper-expand"
                  onClick={() => setSolutionOpen(true)}
                  title="Open the solution in a larger view"
                >
                  {EXPAND}
                  Expand
                </button>
              )}
            </div>
            {tierTabs}
          </div>

          <div className="qpaper-solution-scroll" ref={solutionRef}>
            <div ref={contentRef}>{tierContent}</div>
          </div>
        </aside>
        )}
      </div>

      {/* ── Reading dialog for the long solutions ── */}
      {solutionOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="qpaper-modal"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setSolutionOpen(false); }}
        >
          <div
            className="qpaper-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="qpaper-dialog-title"
            ref={dialogRef}
          >
            <header className="qpaper-dialog-head">
              <div>
                <h2 className="qpaper-dialog-title" id="qpaper-dialog-title">Solution</h2>
                <p className="qpaper-dialog-meta">
                  {question.subject} · {question.topic} · Q{questionNum}
                </p>
              </div>
              <button
                type="button"
                className="qpaper-dialog-close"
                onClick={() => setSolutionOpen(false)}
                aria-label="Close the solution"
                ref={closeRef}
              >
                {CLOSE}
              </button>
            </header>

            <div className="qpaper-dialog-tabs">{tierTabs}</div>

            <div className="qpaper-dialog-body">{tierContent}</div>

            <footer className="qpaper-dialog-foot">
              <button type="button" className="qpaper-btn is-quiet" onClick={() => setSolutionOpen(false)}>
                Close
              </button>
            </footer>
          </div>
        </div>,
        document.body,
      )}
    </article>
  );
}
