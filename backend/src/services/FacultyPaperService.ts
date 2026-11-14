import {
  FacultyRepository,
  type FacultyPaperItem,
  type FacultyPaperSelection,
} from '../repositories/FacultyRepository';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { deepSeekService } from './DeepSeekService';
import type { DiagramTemplate, Difficulty, QuestionType, Subject } from '../types/index';
import { AppError } from '../utils/AppError';
import { isValidDiagramTemplate, hasBalancedMathDelimiters, normalizeFacultyAnswer } from '../utils/facultyPrompts';
import { logger } from '../utils/logger';

export type FacultyExamType = 'Main' | 'Advanced' | 'NEET';
export type FacultyDifficulty = Difficulty | 'mixed';
export type FacultyQuestionTypePref = 'auto' | QuestionType;

export interface CreateFacultyPaperInput {
  title?: string;
  examType: FacultyExamType;
  difficulty: FacultyDifficulty;
  questionCount: number;
  questionType?: FacultyQuestionTypePref;
  selections: FacultyPaperSelection[];
}

export interface UpdateFacultyQuestionInput {
  questionText?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  removeDiagram?: boolean;
}

export interface AcceptDraftQuestionInput {
  subject: Subject;
  topic: string;
  questionType: QuestionType;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  diagram?: DiagramTemplate | null;
  verified: boolean;
}

interface PaperSlot {
  number: number;
  subject: Subject;
  topic: string;
  difficulty: Difficulty;
  questionType: QuestionType;
}

const SUBJECT_ORDER: Record<Subject, number> = {
  Physics: 0,
  Chemistry: 1,
  Mathematics: 2,
  Botany: 3,
  Zoology: 4,
};

const MIXED_DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
const GENERATION_CONCURRENCY = 4;
const MAX_AI_ATTEMPTS = 2;

function defaultPaperTitle(examType: FacultyExamType, selections: FacultyPaperSelection[]): string {
  const subjects = [...new Set(selections.map((s) => s.subject))];
  const subjectLabel = subjects.length === 1 ? subjects[0]! : 'Combined';
  const examLabel = examType === 'NEET' ? 'NEET-UG' : `JEE ${examType}`;
  return `${examLabel} ${subjectLabel} Test`;
}

function formatPaperCode(paperCode: string | null | undefined, id: string): string {
  return paperCode && paperCode.trim() ? paperCode : `FP-${id.slice(-6).toUpperCase()}`;
}

function resolveSlotDifficulty(examType: FacultyExamType, filter: FacultyDifficulty, slotIdx: number): Difficulty {
  // Strict exam parity: JEE Advanced papers only contain Advanced-level synthesis problems.
  if (examType === 'Advanced') return 'advanced';
  return filter === 'mixed' ? MIXED_DIFFICULTIES[slotIdx % MIXED_DIFFICULTIES.length]! : filter;
}

function resolveSlotQuestionType(
  examType: FacultyExamType,
  preference: FacultyQuestionTypePref,
  indexInSelection: number,
  selectionCount: number,
): QuestionType {
  if (examType === 'NEET') return 'mcq_single';
  if (preference !== 'auto') return preference;

  if (examType === 'Main') {
    if (selectionCount < 3) return 'mcq_single';
    const integerThreshold = Math.ceil(selectionCount * 0.7);
    return indexInSelection >= integerThreshold ? 'integer' : 'mcq_single';
  }

  // JEE Advanced mix: 40% single-correct, 30% multi-correct, 30% integer
  if (selectionCount === 1) return 'mcq_single';
  if (selectionCount === 2) return indexInSelection === 0 ? 'mcq_single' : 'integer';
  const singleEnd = Math.ceil(selectionCount * 0.4);
  const multiEnd = Math.ceil(selectionCount * 0.7);
  if (indexInSelection < singleEnd) return 'mcq_single';
  if (indexInSelection < multiEnd) return 'mcq_multi';
  return 'integer';
}

function buildPaperSlots(input: CreateFacultyPaperInput): PaperSlot[] {
  const sortedSelections = [...input.selections].sort(
    (a, b) => (SUBJECT_ORDER[a.subject] ?? 9) - (SUBJECT_ORDER[b.subject] ?? 9) || a.topic.localeCompare(b.topic),
  );

  const hasGranularCounts = sortedSelections.some(
    (s) => (s.mcqCount ?? 0) > 0 || (s.integerCount ?? 0) > 0 || (s.multiCount ?? 0) > 0,
  );

  const slots: PaperSlot[] = [];
  let number = 1;

  if (hasGranularCounts) {
    for (const sel of sortedSelections) {
      const mcqCount = Math.max(0, sel.mcqCount ?? 0);
      const multiCount = Math.max(0, sel.multiCount ?? 0);
      const integerCount = Math.max(0, sel.integerCount ?? 0);

      // Single-choice MCQs
      for (let i = 0; i < mcqCount; i++) {
        slots.push({
          number,
          subject: sel.subject,
          topic: sel.topic,
          difficulty: resolveSlotDifficulty(input.examType, input.difficulty, number - 1),
          questionType: 'mcq_single',
        });
        number++;
      }

      // Multi-choice MCQs (e.g. JEE Advanced)
      for (let i = 0; i < multiCount; i++) {
        slots.push({
          number,
          subject: sel.subject,
          topic: sel.topic,
          difficulty: resolveSlotDifficulty(input.examType, input.difficulty, number - 1),
          questionType: 'mcq_multi',
        });
        number++;
      }

      // Integer / Numerical
      for (let i = 0; i < integerCount; i++) {
        slots.push({
          number,
          subject: sel.subject,
          topic: sel.topic,
          difficulty: resolveSlotDifficulty(input.examType, input.difficulty, number - 1),
          questionType: 'integer',
        });
        number++;
      }
    }
    return slots;
  }

  // Fallback: standard equal split when granular counts are not provided
  const n = sortedSelections.length;
  const base = Math.floor(input.questionCount / n);
  const remainder = input.questionCount % n;
  const pref = input.questionType ?? 'auto';

  for (let sIdx = 0; sIdx < n; sIdx++) {
    const sel = sortedSelections[sIdx]!;
    const countForSelection = base + (sIdx < remainder ? 1 : 0);
    for (let i = 0; i < countForSelection; i++) {
      slots.push({
        number,
        subject: sel.subject,
        topic: sel.topic,
        difficulty: resolveSlotDifficulty(input.examType, input.difficulty, number - 1),
        questionType: resolveSlotQuestionType(input.examType, pref, i, countForSelection),
      });
      number++;
    }
  }
  return slots;
}

/** Coordinates AI generation, blind verification, bank fallback, editing, and paper storage. */
export class FacultyPaperService {
  private readonly activeJobs = new Set<Promise<void>>();

  constructor(
    private readonly facultyRepo: FacultyRepository = new FacultyRepository(),
    private readonly questionRepo: QuestionRepository = new QuestionRepository(),
  ) {}

  public async listPapers(facultyId: string) {
    const rows = await this.facultyRepo.listPapersByFaculty(facultyId);
    return rows.map((r) => ({
      ...r,
      paperCode: formatPaperCode(r.paperCode, r.id),
      selections: r.selections as unknown as FacultyPaperSelection[],
    }));
  }

  public async getPaper(facultyId: string, paperId: string) {
    const paper = await this.facultyRepo.findPaperById(paperId);
    if (!paper || paper.facultyId !== facultyId) {
      throw new AppError(404, 'Paper not found');
    }
    return {
      ...paper,
      paperCode: formatPaperCode(paper.paperCode, paper.id),
      selections: paper.selections as unknown as FacultyPaperSelection[],
      items: paper.items as unknown as FacultyPaperItem[],
    };
  }

  public async startPaper(facultyId: string, input: CreateFacultyPaperInput) {
    const title = input.title?.trim() ? input.title.trim() : defaultPaperTitle(input.examType, input.selections);
    const effectiveDifficulty = input.examType === 'Advanced' ? 'advanced' : input.difficulty;
    const normalizedInput: CreateFacultyPaperInput = { ...input, difficulty: effectiveDifficulty };
    const slots = buildPaperSlots(normalizedInput);
    const effectiveQuestionCount = slots.length > 0 ? slots.length : input.questionCount;

    const paper = await this.facultyRepo.createPaper({
      facultyId,
      title,
      examType: input.examType,
      difficulty: effectiveDifficulty,
      questionCount: effectiveQuestionCount,
      selections: input.selections,
    });
    const job = this.runGeneration(paper.id, input.examType, slots)
      .catch((err) => {
        logger.error({ err, paperId: paper.id }, 'Unhandled faculty paper generation failure');
      })
      .finally(() => {
        this.activeJobs.delete(job);
      });

    this.activeJobs.add(job);
    return {
      ...paper,
      paperCode: formatPaperCode(paper.paperCode, paper.id),
      selections: input.selections,
      items: [] as FacultyPaperItem[],
    };
  }

  public async updateQuestion(
    facultyId: string,
    paperId: string,
    questionNumber: number,
    patch: UpdateFacultyQuestionInput,
  ) {
    const paper = await this.getPaper(facultyId, paperId);
    if (paper.status === 'generating') {
      throw new AppError(409, 'Wait for paper generation to finish before editing questions');
    }

    const items = [...paper.items];
    const idx = items.findIndex((item) => item.number === questionNumber);
    if (idx === -1) {
      throw new AppError(404, `Question #${questionNumber} not found`);
    }

    const current = items[idx]!;
    const nextText = patch.questionText !== undefined ? patch.questionText.trim() : current.questionText;
    const nextExplanation = patch.explanation !== undefined ? patch.explanation.trim() : current.explanation;
    const nextOptions = patch.options !== undefined ? patch.options.map((o) => o.trim()) : current.options;
    const rawAnswer = patch.correctAnswer !== undefined ? patch.correctAnswer : current.correctAnswer;

    if (!nextText) throw new AppError(400, 'Question text cannot be empty');
    if (!hasBalancedMathDelimiters(nextText)) throw new AppError(400, 'Unbalanced $ math delimiters in question text');
    if (nextExplanation && !hasBalancedMathDelimiters(nextExplanation)) {
      throw new AppError(400, 'Unbalanced $ math delimiters in explanation');
    }

    if (current.questionType !== 'integer') {
      if (nextOptions.length !== 4 || nextOptions.some((o) => !o)) {
        throw new AppError(400, 'MCQ questions require exactly 4 non-empty options');
      }
      if (nextOptions.some((o) => !hasBalancedMathDelimiters(o))) {
        throw new AppError(400, 'Unbalanced $ math delimiters in options');
      }
    }

    const canonicalAnswer = normalizeFacultyAnswer(current.questionType, rawAnswer);
    if (!canonicalAnswer) {
      throw new AppError(400, `Invalid answer format for ${current.questionType}`);
    }

    items[idx] = {
      ...current,
      questionText: nextText,
      options: current.questionType === 'integer' ? [] : nextOptions,
      correctAnswer: canonicalAnswer,
      explanation: nextExplanation,
      diagram: patch.removeDiagram ? null : current.diagram,
      verified: true,
      editedByFaculty: true,
    };

    const verifiedCount = items.filter((item) => item.verified).length;
    await this.facultyRepo.updatePaperState(paperId, { items, verifiedCount });
    return this.getPaper(facultyId, paperId);
  }

  public async regenerateQuestion(facultyId: string, paperId: string, questionNumber: number) {
    const paper = await this.getPaper(facultyId, paperId);
    if (paper.status === 'generating') {
      throw new AppError(409, 'Paper is currently generating');
    }

    const items = [...paper.items];
    const idx = items.findIndex((item) => item.number === questionNumber);
    if (idx === -1) {
      throw new AppError(404, `Question #${questionNumber} not found`);
    }

    const current = items[idx]!;
    const examType = paper.examType as FacultyExamType;
    const slotDifficulty = resolveSlotDifficulty(examType, paper.difficulty as FacultyDifficulty, questionNumber - 1);

    const usedTexts = new Set(items.filter((i) => i.number !== questionNumber).map((i) => i.questionText));
    const slot: PaperSlot = {
      number: current.number,
      subject: current.subject,
      topic: current.topic,
      difficulty: slotDifficulty,
      questionType: current.questionType,
    };

    const regenerated = await this.buildSlotItem(examType, slot, new Set<string>(), usedTexts);
    items[idx] = regenerated;

    const verifiedCount = items.filter((item) => item.verified).length;
    await this.facultyRepo.updatePaperState(paperId, { items, verifiedCount });
    return this.getPaper(facultyId, paperId);
  }

  public async deleteQuestion(facultyId: string, paperId: string, questionNumber: number) {
    const paper = await this.getPaper(facultyId, paperId);
    if (paper.status === 'generating') {
      throw new AppError(409, 'Wait for paper generation to finish before deleting questions');
    }
    if (paper.items.length <= 1) {
      throw new AppError(400, 'Paper must keep at least 1 question');
    }

    const filtered = paper.items.filter((item) => item.number !== questionNumber);
    if (filtered.length === paper.items.length) {
      throw new AppError(404, `Question #${questionNumber} not found`);
    }

    const renumbered: FacultyPaperItem[] = filtered.map((item, idx) => ({
      ...item,
      number: idx + 1,
    }));
    const verifiedCount = renumbered.filter((item) => item.verified).length;

    await this.facultyRepo.updatePaperState(paperId, {
      items: renumbered,
      questionCount: renumbered.length,
      verifiedCount,
    });
    return this.getPaper(facultyId, paperId);
  }

  /** Generates a single candidate question on the chosen topic WITHOUT saving it yet. */
  public async generateDraftQuestion(
    facultyId: string,
    paperId: string,
    input: { subject: Subject; topic: string; questionType?: QuestionType },
  ): Promise<FacultyPaperItem> {
    const paper = await this.getPaper(facultyId, paperId);
    if (paper.status === 'generating') {
      throw new AppError(409, 'Paper is currently generating');
    }

    const examType = paper.examType as FacultyExamType;
    const effectiveType: QuestionType = examType === 'NEET'
      ? 'mcq_single'
      : (input.questionType ?? 'mcq_single');
    const slotDifficulty = resolveSlotDifficulty(examType, paper.difficulty as FacultyDifficulty, paper.items.length);
    const usedTexts = new Set(paper.items.map((i) => i.questionText));

    return this.buildSlotItem(
      examType,
      {
        number: paper.items.length + 1,
        subject: input.subject,
        topic: input.topic,
        difficulty: slotDifficulty,
        questionType: effectiveType,
      },
      new Set<string>(),
      usedTexts,
    );
  }

  /** Commits an accepted Sparkle draft candidate by replacing `targetNumber` or appending to the paper. */
  public async acceptDraftQuestion(
    facultyId: string,
    paperId: string,
    targetNumber: number | null,
    candidate: AcceptDraftQuestionInput,
  ) {
    const paper = await this.getPaper(facultyId, paperId);
    if (paper.status === 'generating') {
      throw new AppError(409, 'Paper is currently generating');
    }

    const cleanText = candidate.questionText.trim();
    const cleanExplain = candidate.explanation.trim();
    const cleanOpts = candidate.options.map((o) => o.trim());

    if (!cleanText || !hasBalancedMathDelimiters(cleanText)) {
      throw new AppError(400, 'Invalid question text or unbalanced $ math delimiters');
    }
    if (cleanExplain && !hasBalancedMathDelimiters(cleanExplain)) {
      throw new AppError(400, 'Unbalanced $ math delimiters in solution');
    }
    if (candidate.questionType !== 'integer') {
      if (cleanOpts.length !== 4 || cleanOpts.some((o) => !o || !hasBalancedMathDelimiters(o))) {
        throw new AppError(400, 'Invalid options on candidate question');
      }
    }
    if (!isValidDiagramTemplate(candidate.diagram)) {
      throw new AppError(400, 'Invalid diagram payload on candidate question');
    }
    const canonicalAnswer = normalizeFacultyAnswer(candidate.questionType, candidate.correctAnswer);
    if (!canonicalAnswer) {
      throw new AppError(400, 'Invalid answer format on candidate question');
    }

    const items = [...paper.items];
    const nextItem: FacultyPaperItem = {
      number: targetNumber ?? items.length + 1,
      subject: candidate.subject,
      topic: candidate.topic,
      questionType: candidate.questionType,
      questionText: cleanText,
      options: candidate.questionType === 'integer' ? [] : cleanOpts,
      correctAnswer: canonicalAnswer,
      explanation: cleanExplain,
      diagram: candidate.diagram ?? null,
      verified: Boolean(candidate.verified),
    };

    if (targetNumber !== null) {
      const idx = items.findIndex((i) => i.number === targetNumber);
      if (idx === -1) throw new AppError(404, `Question #${targetNumber} not found`);
      items[idx] = nextItem;
    } else {
      items.push(nextItem);
    }

    const verifiedCount = items.filter((i) => i.verified).length;
    await this.facultyRepo.updatePaperState(paperId, {
      items,
      questionCount: items.length,
      verifiedCount,
    });
    return this.getPaper(facultyId, paperId);
  }

  public async deletePaper(facultyId: string, paperId: string): Promise<void> {
    const paper = await this.getPaper(facultyId, paperId);
    if (paper.status === 'generating') {
      throw new AppError(409, 'Cannot delete a paper while it is still generating');
    }
    await this.facultyRepo.deletePaper(paperId);
  }

  public sweepStuckGenerating(): Promise<number> {
    return this.facultyRepo.sweepStuckGenerating(new Date(Date.now() - 10 * 60 * 1000));
  }

  public async waitForActiveGenerations(timeoutMs = 10_000): Promise<void> {
    if (this.activeJobs.size === 0) return;
    await Promise.race([
      Promise.allSettled([...this.activeJobs]),
      new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
    ]);
  }

  private async runGeneration(paperId: string, examType: FacultyExamType, slots: PaperSlot[]): Promise<void> {
    const usedBankIds = new Set<string>();
    const usedTexts = new Set<string>();
    const completed: FacultyPaperItem[] = [];
    let nextIdx = 0;
    let fatalError: string | null = null;
    let lastFlushCount = 0;
    let flushChain = Promise.resolve();

    const enqueueFlush = (force = false) => {
      if (!force && completed.length - lastFlushCount < 3) return;
      lastFlushCount = completed.length;
      const snapshot = [...completed].sort((a, b) => a.number - b.number);
      const verifiedCount = snapshot.filter((i) => i.verified).length;
      flushChain = flushChain.then(() =>
        this.facultyRepo.updatePaperState(paperId, { items: snapshot, verifiedCount }).then(() => undefined),
      );
    };

    const worker = async () => {
      while (nextIdx < slots.length && !fatalError) {
        const slot = slots[nextIdx++]!;
        try {
          const item = await this.buildSlotItem(examType, slot, usedBankIds, usedTexts);
          usedTexts.add(item.questionText);
          completed.push(item);
          enqueueFlush();
        } catch (err) {
          fatalError = err instanceof Error ? err.message : 'Question generation failed';
        }
      }
    };

    const workerCount = Math.min(GENERATION_CONCURRENCY, slots.length);
    await Promise.all(Array.from({ length: workerCount }, () => worker()));
    await flushChain;

    if (fatalError || completed.length < slots.length) {
      await this.facultyRepo.updatePaperState(paperId, {
        status: 'error',
        items: [...completed].sort((a, b) => a.number - b.number),
        verifiedCount: completed.filter((i) => i.verified).length,
        errorMessage: fatalError ?? 'Incomplete paper generation',
      });
      return;
    }

    const ordered = [...completed].sort((a, b) => a.number - b.number);
    await this.facultyRepo.updatePaperState(paperId, {
      status: 'ready',
      items: ordered,
      verifiedCount: ordered.filter((i) => i.verified).length,
      errorMessage: null,
    });
  }

  private async buildSlotItem(
    examType: FacultyExamType,
    slot: PaperSlot,
    usedBankIds: Set<string>,
    usedTexts: Set<string>,
  ): Promise<FacultyPaperItem> {
    if (deepSeekService.isAvailable()) {
      let unverifiedCandidate: FacultyPaperItem | null = null;

      for (let attempt = 1; attempt <= MAX_AI_ATTEMPTS; attempt++) {
        try {
          const generated = await deepSeekService.generateFacultyQuestion({
            examType,
            subject: slot.subject,
            topic: slot.topic,
            difficulty: slot.difficulty,
            questionType: slot.questionType,
          });
          const verified = await deepSeekService.blindVerifyFacultyQuestion({
            examType,
            subject: slot.subject,
            topic: slot.topic,
            question: generated,
          });
          const item: FacultyPaperItem = {
            number: slot.number,
            subject: slot.subject,
            topic: slot.topic,
            questionType: slot.questionType,
            questionText: generated.question,
            options: generated.options,
            correctAnswer: generated.correct_answer,
            explanation: generated.answer_explanation,
            diagram: generated.diagram ?? null,
            verified,
          };
          if (verified) return item;
          unverifiedCandidate = item;
        } catch (err) {
          logger.warn({ err, attempt, slot }, 'Faculty AI generation attempt failed');
        }
      }

      if (unverifiedCandidate) return unverifiedCandidate;
    }

    const fallback = await this.pickBankFallback(examType, slot, usedBankIds, usedTexts);
    if (fallback) return fallback;

    throw new AppError(
      503,
      `Could not generate ${slot.subject} (${slot.topic}) question. Verify DeepSeek API connectivity or pick another topic.`,
    );
  }

  private async pickBankFallback(
    examType: FacultyExamType,
    slot: PaperSlot,
    usedBankIds: Set<string>,
    usedTexts: Set<string>,
  ): Promise<FacultyPaperItem | null> {
    const examTypes = examType === 'NEET' ? ['NEET', 'Main'] : [examType];
    const candidates = await this.questionRepo.findFacultyFallbackQuestions(
      slot.subject,
      slot.topic,
      examTypes,
      slot.questionType,
      15,
    );
    const broadCandidates = candidates.length > 0
      ? candidates
      : await this.questionRepo.findFacultyFallbackQuestions(slot.subject, slot.topic, examTypes, undefined, 15);

    const row = broadCandidates.find((q) => !usedBankIds.has(q.id) && !usedTexts.has(q.questionText));
    if (!row) return null;

    usedBankIds.add(row.id);
    usedTexts.add(row.questionText);

    return {
      number: slot.number,
      subject: slot.subject,
      topic: slot.topic,
      questionType: row.questionType as QuestionType,
      questionText: row.questionText,
      options: Array.isArray(row.options) ? (row.options as string[]) : [],
      correctAnswer: row.answer,
      explanation: row.explanation,
      diagram: (row.diagram as DiagramTemplate | null) ?? null,
      verified: true,
    };
  }
}

export const facultyPaperService = new FacultyPaperService();
