import {
  FacultyRepository,
  type FacultyPaperItem,
  type FacultyPaperSelection,
} from '../repositories/FacultyRepository';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { deepSeekService } from './DeepSeekService';
import { deepSeekPsychometricService } from './DeepSeekPsychometricService';
import type { DiagramTemplate, Difficulty, QuestionType, Subject, DifficultyDistribution } from '../types/index';
import { AppError } from '../utils/AppError';
import { isValidDiagramTemplate, hasBalancedMathDelimiters, normalizeFacultyAnswer } from '../utils/facultyPrompts';
import { logger } from '../utils/logger';
import { planDifficultySlots } from '../utils/questionUtils';

export type FacultyExamType = 'Main' | 'Advanced' | 'NEET' | 'Psychometric';
export type FacultyDifficulty = Difficulty | 'mixed';
export type FacultyQuestionTypePref = 'auto' | QuestionType;

export interface CreateFacultyPaperInput {
  title?: string;
  organization?: string;
  examType: FacultyExamType;
  examGoal?: string;
  targetProfile?: {
    studentLevel?: string;
    schoolClass?: string;
    stream?: string;
    ageGroup?: string;
    age?: number;
  };
  difficulty: FacultyDifficulty;
  difficultyDistribution?: DifficultyDistribution;
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
  requiresDiagram?: boolean;
}

const SUBJECT_ORDER: Record<Subject, number> = {
  Physics: 0,
  Chemistry: 1,
  Mathematics: 2,
  Botany: 3,
  Zoology: 4,
  Psychometric: 5,
};

const MIXED_DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
const GENERATION_CONCURRENCY = 4;
const MAX_AI_ATTEMPTS = 3;

function defaultPaperTitle(examType: FacultyExamType, selections: FacultyPaperSelection[], examGoal?: string): string {
  if (examType === 'Psychometric') {
    if (examGoal && examGoal.trim()) {
      const trimmed = examGoal.trim();
      return trimmed.length > 50 ? `Psychometric: ${trimmed.slice(0, 47)}...` : `Psychometric: ${trimmed}`;
    }
    return 'Psychometric & Behavioral Assessment';
  }
  const subjects = [...new Set(selections.map((s) => s.subject))];
  const subjectLabel = subjects.length === 1 ? subjects[0]! : 'Combined';
  const examLabel = examType === 'NEET' ? 'NEET-UG' : `JEE ${examType}`;
  return `${examLabel} ${subjectLabel} Test`;
}

export function formatPaperCode(paperCode: string | null | undefined, id: string): string {
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
  if (preference !== 'auto') return preference;
  if (examType === 'NEET') return 'mcq_single';

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

export const ABSTRACT_NON_DIAGRAM_TOPICS = new Set<string>([
  'permutations and combinations',
  'permutations & combinations',
  'binomial theorem',
  'mathematical reasoning',
  'statistics',
  'matrices',
  'determinants',
  'principle of mathematical induction',
  'units and dimensions',
  'units and measurements',
]);

export function isTopicDiagramCompatible(subject: Subject, topic: string): boolean {
  if (subject === 'Botany' || subject === 'Zoology') return true;
  if (subject === 'Physics') {
    return !topic.toLowerCase().includes('units');
  }
  if (subject === 'Chemistry') {
    return true;
  }
  // For Mathematics: check abstract topics
  const normalized = topic.trim().toLowerCase();
  for (const nonDiag of ABSTRACT_NON_DIAGRAM_TOPICS) {
    if (normalized.includes(nonDiag)) return false;
  }
  return true;
}

function buildPaperSlots(input: CreateFacultyPaperInput): PaperSlot[] {
  const sortedSelections = [...input.selections].sort(
    (a, b) => (SUBJECT_ORDER[a.subject] ?? 9) - (SUBJECT_ORDER[b.subject] ?? 9) || a.topic.localeCompare(b.topic),
  );

  const hasGranularCounts = sortedSelections.some(
    (s) =>
      (s.mcqCount ?? 0) > 0 ||
      (s.integerCount ?? 0) > 0 ||
      (s.multiCount ?? 0) > 0 ||
      (s.matrixCount ?? 0) > 0 ||
      (s.mcqEasy ?? 0) > 0 ||
      (s.mcqMedium ?? 0) > 0 ||
      (s.mcqHard ?? 0) > 0 ||
      (s.integerEasy ?? 0) > 0 ||
      (s.integerMedium ?? 0) > 0 ||
      (s.integerHard ?? 0) > 0 ||
      (s.multiEasy ?? 0) > 0 ||
      (s.multiMedium ?? 0) > 0 ||
      (s.multiHard ?? 0) > 0 ||
      (s.matrixEasy ?? 0) > 0 ||
      (s.matrixMedium ?? 0) > 0 ||
      (s.matrixHard ?? 0) > 0,
  );

  const totalCount = hasGranularCounts
    ? sortedSelections.reduce((acc, s) => {
        const mcq = (s.mcqEasy ?? 0) + (s.mcqMedium ?? 0) + (s.mcqHard ?? 0) || (s.mcqCount ?? 0);
        const multi = (s.multiEasy ?? 0) + (s.multiMedium ?? 0) + (s.multiHard ?? 0) || (s.multiCount ?? 0);
        const integer = (s.integerEasy ?? 0) + (s.integerMedium ?? 0) + (s.integerHard ?? 0) || (s.integerCount ?? 0);
        const matrix = (s.matrixEasy ?? 0) + (s.matrixMedium ?? 0) + (s.matrixHard ?? 0) || (s.matrixCount ?? 0);
        return acc + mcq + multi + integer + matrix;
      }, 0)
    : input.questionCount;

  const plannedDifficulties =
    input.examType === 'Advanced'
      ? Array(totalCount).fill('advanced' as Difficulty)
      : planDifficultySlots(totalCount, input.difficulty, input.difficultyDistribution);

  const slots: PaperSlot[] = [];
  let number = 1;

  if (hasGranularCounts) {
    for (const sel of sortedSelections) {
      const mcqCount = Math.max(0, (sel.mcqEasy ?? 0) + (sel.mcqMedium ?? 0) + (sel.mcqHard ?? 0) || (sel.mcqCount ?? 0));
      const multiCount = Math.max(0, (sel.multiEasy ?? 0) + (sel.multiMedium ?? 0) + (sel.multiHard ?? 0) || (sel.multiCount ?? 0));
      const integerCount = Math.max(0, (sel.integerEasy ?? 0) + (sel.integerMedium ?? 0) + (sel.integerHard ?? 0) || (sel.integerCount ?? 0));
      const matrixCount = Math.max(0, (sel.matrixEasy ?? 0) + (sel.matrixMedium ?? 0) + (sel.matrixHard ?? 0) || (sel.matrixCount ?? 0));

      const pushSlotsForType = (
        qType: QuestionType,
        easy: number,
        med: number,
        hard: number,
        fallbackTotal: number,
      ) => {
        if (easy > 0 || med > 0 || hard > 0) {
          for (let i = 0; i < easy; i++) {
            slots.push({
              number,
              subject: sel.subject,
              topic: sel.topic,
              difficulty: input.examType === 'Advanced' ? 'advanced' : 'beginner',
              questionType: qType,
            });
            number++;
          }
          for (let i = 0; i < med; i++) {
            slots.push({
              number,
              subject: sel.subject,
              topic: sel.topic,
              difficulty: input.examType === 'Advanced' ? 'advanced' : 'intermediate',
              questionType: qType,
            });
            number++;
          }
          for (let i = 0; i < hard; i++) {
            slots.push({
              number,
              subject: sel.subject,
              topic: sel.topic,
              difficulty: 'advanced',
              questionType: qType,
            });
            number++;
          }
        } else {
          for (let i = 0; i < fallbackTotal; i++) {
            slots.push({
              number,
              subject: sel.subject,
              topic: sel.topic,
              difficulty:
                plannedDifficulties[number - 1] ??
                resolveSlotDifficulty(input.examType, input.difficulty, number - 1),
              questionType: qType,
            });
            number++;
          }
        }
      };

      pushSlotsForType('mcq_single', sel.mcqEasy ?? 0, sel.mcqMedium ?? 0, sel.mcqHard ?? 0, mcqCount);
      pushSlotsForType('mcq_multi', sel.multiEasy ?? 0, sel.multiMedium ?? 0, sel.multiHard ?? 0, multiCount);
      pushSlotsForType('integer', sel.integerEasy ?? 0, sel.integerMedium ?? 0, sel.integerHard ?? 0, integerCount);
      pushSlotsForType('matrix_match', sel.matrixEasy ?? 0, sel.matrixMedium ?? 0, sel.matrixHard ?? 0, matrixCount);
    }
  } else {
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
          difficulty: plannedDifficulties[number - 1] ?? resolveSlotDifficulty(input.examType, input.difficulty, number - 1),
          questionType: resolveSlotQuestionType(input.examType, pref, i, countForSelection),
        });
        number++;
      }
    }
  }

  // Check which slots belong to diagram-compatible topics
  const diagramCapableSlots = slots.filter((s) => isTopicDiagramCompatible(s.subject, s.topic));

  if (diagramCapableSlots.length > 0) {
    // Mandatory diagram guarantee: At least 2 diagram questions (or 15% if larger), capped by available diagram-capable slots
    const diagramQuota = Math.min(diagramCapableSlots.length, Math.max(2, Math.round(slots.length * 0.15)));
    let assignedDiagrams = 0;

    // First pass: assign to MCQ / multi / integer slots in diagram-capable topics
    for (const s of diagramCapableSlots) {
      if (assignedDiagrams >= diagramQuota) break;
      if (s.questionType !== 'matrix_match') {
        s.requiresDiagram = true;
        assignedDiagrams++;
      }
    }

    // Second pass: assign to remaining diagram-capable slots if needed
    for (const s of diagramCapableSlots) {
      if (assignedDiagrams >= diagramQuota) break;
      if (!s.requiresDiagram) {
        s.requiresDiagram = true;
        assignedDiagrams++;
      }
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
    return rows.map((r) => {
      let examGoal: string | null = null;
      if (Array.isArray(r.selections) && r.selections.length > 0) {
        const first = r.selections[0] as Record<string, unknown>;
        if (first && typeof first.examGoal === 'string' && first.examGoal.trim()) {
          examGoal = first.examGoal.trim();
        }
      }
      return {
        ...r,
        examGoal,
        paperCode: formatPaperCode(r.paperCode, r.id),
        selections: r.selections as unknown as FacultyPaperSelection[],
      };
    });
  }

  public async getPaper(facultyId: string, paperId: string) {
    const paper = await this.facultyRepo.findPaperById(paperId);
    if (!paper || paper.facultyId !== facultyId) {
      throw new AppError(404, 'Paper not found');
    }
    let examGoal: string | null = null;
    let targetProfile: unknown = null;
    if (Array.isArray(paper.selections) && paper.selections.length > 0) {
      const first = paper.selections[0] as Record<string, unknown>;
      if (first && typeof first.examGoal === 'string' && first.examGoal.trim()) {
        examGoal = first.examGoal.trim();
      }
      if (first && first.targetProfile) {
        targetProfile = first.targetProfile;
      }
    }
    return {
      ...paper,
      examGoal,
      targetProfile,
      paperCode: formatPaperCode(paper.paperCode, paper.id),
      selections: paper.selections as unknown as FacultyPaperSelection[],
      items: paper.items as unknown as FacultyPaperItem[],
    };
  }

  private extractPaperGoal(paper: { title: string; selections?: unknown; examGoal?: string | null }): string {
    if (paper.examGoal?.trim()) {
      return paper.examGoal.trim();
    }
    if (Array.isArray(paper.selections) && paper.selections.length > 0) {
      const first = paper.selections[0] as Record<string, unknown>;
      if (first && typeof first.examGoal === 'string' && first.examGoal.trim()) {
        return first.examGoal.trim();
      }
    }
    return paper.title || 'Assess student general aptitude, entrepreneurial mindset, and technical problem-solving attitude';
  }

  public async startPaper(facultyId: string, input: CreateFacultyPaperInput) {
    if (input.examType === 'Psychometric') {
      const title = input.title?.trim()
        ? input.title.trim()
        : defaultPaperTitle(input.examType, input.selections, input.examGoal);
      const selectionsWithGoal = input.selections.map((sel, idx) => {
        if (idx === 0) {
          return {
            ...sel,
            examGoal: input.examGoal?.trim() || null,
            targetProfile: input.targetProfile || null,
          };
        }
        return sel;
      });

      const paper = await this.facultyRepo.createPaper({
        facultyId,
        title,
        organization: input.organization?.trim() || null,
        examType: input.examType,
        difficulty: 'intermediate',
        questionCount: input.questionCount,
        selections: selectionsWithGoal,
      });

      const job = this.runPsychometricGeneration(paper.id, input)
        .catch((err) => {
          logger.error({ err, paperId: paper.id }, 'Unhandled psychometric faculty paper generation failure');
        })
        .finally(() => {
          this.activeJobs.delete(job);
        });
      this.activeJobs.add(job);

      return {
        ...paper,
        examGoal: input.examGoal?.trim() || null,
        paperCode: formatPaperCode(paper.paperCode, paper.id),
        selections: selectionsWithGoal as unknown as FacultyPaperSelection[],
        items: [] as FacultyPaperItem[],
      };
    }

    const title = input.title?.trim() ? input.title.trim() : defaultPaperTitle(input.examType, input.selections);
    const effectiveDifficulty = input.examType === 'Advanced' ? 'advanced' : input.difficulty;
    const normalizedInput: CreateFacultyPaperInput = { ...input, difficulty: effectiveDifficulty };
    const slots = buildPaperSlots(normalizedInput);
    const effectiveQuestionCount = slots.length > 0 ? slots.length : input.questionCount;

    const paper = await this.facultyRepo.createPaper({
      facultyId,
      title,
      organization: input.organization?.trim() || null,
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

    const isPsychometric = current.subject === 'Psychometric';
    if (!isPsychometric && current.questionType !== 'integer') {
      if (nextOptions.length !== 4 || nextOptions.some((o) => !o)) {
        throw new AppError(400, 'MCQ questions require exactly 4 non-empty options');
      }
      if (nextOptions.some((o) => !hasBalancedMathDelimiters(o))) {
        throw new AppError(400, 'Unbalanced $ math delimiters in options');
      }
    }

    const canonicalAnswer = isPsychometric
      ? (rawAnswer ? rawAnswer.trim() : current.correctAnswer)
      : normalizeFacultyAnswer(current.questionType, rawAnswer);
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

    if (examType === 'Psychometric' || current.subject === 'Psychometric') {
      const examGoal = this.extractPaperGoal(paper);
      const firstSel = (paper.selections?.[0] as unknown) as Record<string, unknown> | undefined;
      const targetProfile = (firstSel?.targetProfile || (paper as Record<string, unknown>).targetProfile) as any;
      const psychometricItems = await deepSeekPsychometricService.generateFacultyPsychometricPaper({
        domains: [current.topic],
        examGoal,
        targetProfile,
        questionCount: 1,
        title: paper.title,
        organization: paper.organization ?? undefined,
      });

      const q = psychometricItems[0];
      if (q) {
        const cleanTag = (text: string) =>
          text
            .replace(/\*\*Scenario:\*\*\s*/gi, '')
            .replace(/\*\*Question:\*\*\s*/gi, '')
            .trim();

        const scenario = cleanTag(q.scenarioText || '');
        const question = cleanTag(q.questionText || '');
        const promptFull = scenario ? `${scenario}\n\n${question}` : question;
        const fullExplanation = `${q.explanation}\n\n**Trait / Persona Fit:** ${q.traitPersonaMapping}\n\n**Radical Answer Flag:** ${q.radicalFeedbackNote}`;

        items[idx] = {
          number: current.number,
          subject: 'Psychometric' as Subject,
          topic: q.domain || current.topic,
          difficulty: 'intermediate',
          questionType: 'mcq_single',
          questionText: promptFull,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: fullExplanation,
          diagram: null,
          verified: true,
        };

        const verifiedCount = items.filter((item) => item.verified).length;
        await this.facultyRepo.updatePaperState(paperId, { items, verifiedCount });
        return this.getPaper(facultyId, paperId);
      }
    }

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

    if (examType === 'Psychometric' || input.subject === 'Psychometric') {
      const examGoal = this.extractPaperGoal(paper);
      const firstSel = (paper.selections?.[0] as unknown) as Record<string, unknown> | undefined;
      const targetProfile = (firstSel?.targetProfile || (paper as Record<string, unknown>).targetProfile) as any;
      const psychometricItems = await deepSeekPsychometricService.generateFacultyPsychometricPaper({
        domains: [input.topic],
        examGoal,
        targetProfile,
        questionCount: 1,
        title: paper.title,
        organization: paper.organization ?? undefined,
      });

      const q = psychometricItems[0];
      if (!q) {
        throw new AppError(500, 'Failed to generate psychometric candidate question');
      }

      const cleanTag = (text: string) =>
        text
          .replace(/\*\*Scenario:\*\*\s*/gi, '')
          .replace(/\*\*Question:\*\*\s*/gi, '')
          .trim();

      const scenario = cleanTag(q.scenarioText || '');
      const question = cleanTag(q.questionText || '');
      const promptFull = scenario ? `${scenario}\n\n${question}` : question;
      const fullExplanation = `${q.explanation}\n\n**Trait / Persona Fit:** ${q.traitPersonaMapping}\n\n**Radical Answer Flag:** ${q.radicalFeedbackNote}`;

      return {
        number: paper.items.length + 1,
        subject: 'Psychometric' as Subject,
        topic: q.domain || input.topic,
        difficulty: 'intermediate',
        questionType: 'mcq_single',
        questionText: promptFull,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: fullExplanation,
        diagram: null,
        verified: true,
      };
    }

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

    const isPsychometric = candidate.subject === 'Psychometric' || paper.examType === 'Psychometric';
    const cleanText = candidate.questionText.trim();
    const cleanExplain = candidate.explanation.trim();
    const cleanOpts = candidate.options.map((o) => o.trim());

    if (!cleanText || (!isPsychometric && !hasBalancedMathDelimiters(cleanText))) {
      throw new AppError(400, 'Invalid question text or unbalanced $ math delimiters');
    }
    if (cleanExplain && !isPsychometric && !hasBalancedMathDelimiters(cleanExplain)) {
      throw new AppError(400, 'Unbalanced $ math delimiters in solution');
    }
    if (candidate.questionType !== 'integer') {
      if (cleanOpts.length !== 4 || (!isPsychometric && cleanOpts.some((o) => !o || !hasBalancedMathDelimiters(o)))) {
        throw new AppError(400, 'Invalid options on candidate question');
      }
    }
    if (!isValidDiagramTemplate(candidate.diagram)) {
      throw new AppError(400, 'Invalid diagram payload on candidate question');
    }
    const canonicalAnswer = isPsychometric
      ? candidate.correctAnswer
      : normalizeFacultyAnswer(candidate.questionType, candidate.correctAnswer);
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
      flushChain = flushChain
        .catch((e) => {
          logger.warn({ err: e, paperId }, 'Intermediate paper flush failed, will retry on next cycle');
        })
        .then(() =>
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

  private async runPsychometricGeneration(paperId: string, input: CreateFacultyPaperInput): Promise<void> {
    try {
      const domains = input.selections.map((s) => s.topic);
      const psychometricItems = await deepSeekPsychometricService.generateFacultyPsychometricPaper({
        domains,
        examGoal: input.examGoal,
        targetProfile: input.targetProfile,
        questionCount: input.questionCount,
        title: input.title,
        organization: input.organization,
      });

      const cleanTag = (text: string) =>
        text
          .replace(/\*\*Scenario:\*\*\s*/gi, '')
          .replace(/\*\*Question:\*\*\s*/gi, '')
          .trim();

      const items: FacultyPaperItem[] = psychometricItems.map((q) => {
        const scenario = cleanTag(q.scenarioText || '');
        const question = cleanTag(q.questionText || '');
        const promptFull = scenario ? `${scenario}\n\n${question}` : question;
        const fullExplanation = `${q.explanation}\n\n**Trait / Persona Fit:** ${q.traitPersonaMapping}\n\n**Radical Answer Flag:** ${q.radicalFeedbackNote}`;
        return {
          number: q.number,
          subject: 'Psychometric' as Subject,
          topic: q.domain,
          difficulty: 'intermediate',
          questionType: 'mcq_single',
          questionText: promptFull,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: fullExplanation,
          diagram: null,
          verified: true,
        };
      });

      await this.facultyRepo.updatePaperState(paperId, {
        status: 'ready',
        items,
        questionCount: items.length,
        verifiedCount: items.length,
        errorMessage: null,
      });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Psychometric generation failed';
      logger.error({ err, paperId }, 'Psychometric paper generation failed');
      await this.facultyRepo.updatePaperState(paperId, {
        status: 'error',
        errorMessage: errMsg,
      });
    }
  }

  public exportPaperToCsv(paper: {
    paperCode?: string | null;
    title: string;
    organization?: string | null;
    examType: string;
    difficulty: string;
    questionCount: number;
    items: FacultyPaperItem[];
  }): string {
    const escapeCsv = (val: unknown): string => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const lines: string[] = [];
    lines.push('\uFEFF'); // UTF-8 BOM
    lines.push(`Paper Code:,${escapeCsv(paper.paperCode || '')}`);
    lines.push(`Title:,${escapeCsv(paper.title)}`);
    lines.push(`Organization:,${escapeCsv(paper.organization || 'General')}`);
    lines.push(`Assessment Type:,${escapeCsv(paper.examType)}`);
    lines.push(`Question Count:,${escapeCsv(paper.questionCount)}`);
    lines.push('');

    const headers = [
      'Question #',
      'Domain / Area',
      'Question Model',
      'Scenario Context',
      'Question Prompt',
      'Option A',
      'Option B',
      'Option C',
      'Option D',
      'Option E',
      'Trait Rubric / Scoring Key',
      'AI Evaluation Guidelines',
      'Radical Answer Observation Flag',
      'Candidate Response (Fill in)',
      'Candidate Persona Fit (Fill in)',
    ];
    lines.push(headers.map(escapeCsv).join(','));

    for (const item of paper.items) {
      let scenario = '';
      let prompt = item.questionText;
      if (item.questionText.startsWith('**Scenario:**')) {
        const parts = item.questionText.split('**Question:**');
        if (parts.length === 2) {
          scenario = parts[0]!.replace('**Scenario:**', '').trim();
          prompt = parts[1]!.trim();
        }
      }

      let evalGuide = item.explanation;
      let personaFit = '';
      let radicalFlag = '';

      if (evalGuide.includes('**Trait / Persona Fit:**')) {
        const parts = evalGuide.split('**Trait / Persona Fit:**');
        evalGuide = parts[0]!.trim();
        const subParts = parts[1]!.split('**Radical Answer Flag:**');
        personaFit = subParts[0]!.trim();
        if (subParts.length > 1) {
          radicalFlag = subParts[1]!.trim();
        }
      } else if (evalGuide.includes('**Radical Answer Flag:**')) {
        const parts = evalGuide.split('**Radical Answer Flag:**');
        evalGuide = parts[0]!.trim();
        radicalFlag = parts[1]!.trim();
      }

      let model = 'Behavioral Dilemma MCQ';
      if (item.options.length === 5 && item.options[0]?.includes('Strongly Disagree')) {
        model = 'Agreement Likert Scale (5-pt)';
      } else if (item.options.length === 5 && item.options[0]?.includes('Never')) {
        model = 'Frequency Scale (5-pt)';
      } else if (item.options.length === 4 && item.options[0]?.includes('Not Interested')) {
        model = 'Passion / Interest Scale (4-pt)';
      } else if (item.topic.toLowerCase().includes('cognitive')) {
        model = 'Cognitive Logic MCQ';
      } else if (scenario.length > 0) {
        model = 'Situational Judgment Dilemma MCQ';
      }

      const optA = item.options[0] ?? '';
      const optB = item.options[1] ?? '';
      const optC = item.options[2] ?? '';
      const optD = item.options[3] ?? '';
      const optE = item.options[4] ?? '';

      const row = [
        item.number,
        item.topic,
        model,
        scenario,
        prompt,
        optA,
        optB,
        optC,
        optD,
        optE,
        item.correctAnswer,
        evalGuide,
        radicalFlag || 'Outlier choice flags distinctive individualist preferences',
        '',
        personaFit || 'Entrepreneurial & Technical Aptitude',
      ];
      lines.push(row.map(escapeCsv).join(','));
    }

    return lines.join('\r\n');
  }

  private async buildSlotItem(
    examType: FacultyExamType,
    slot: PaperSlot,
    usedBankIds: Set<string>,
    usedTexts: Set<string>,
  ): Promise<FacultyPaperItem> {
    const academicExamType: 'Main' | 'Advanced' | 'NEET' =
      examType === 'Advanced' ? 'Advanced' : examType === 'NEET' ? 'NEET' : 'Main';

    if (deepSeekService.isAvailable()) {
      let unverifiedCandidate: FacultyPaperItem | null = null;

      for (let attempt = 1; attempt <= MAX_AI_ATTEMPTS; attempt++) {
        try {
          // Honor requiresDiagram on initial attempts; relax on final attempt so generation never gets blocked
          const mustRequireDiagram = slot.requiresDiagram && attempt <= 2;
          const generated = await deepSeekService.generateFacultyQuestion({
            examType: academicExamType,
            subject: slot.subject,
            topic: slot.topic,
            difficulty: slot.difficulty,
            questionType: slot.questionType,
            requiresDiagram: mustRequireDiagram,
          });
          const verified = await deepSeekService.blindVerifyFacultyQuestion({
            examType: academicExamType,
            subject: slot.subject,
            topic: slot.topic,
            question: generated,
          });
          const item: FacultyPaperItem = {
            number: slot.number,
            subject: slot.subject,
            topic: slot.topic,
            difficulty: slot.difficulty,
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
    const examTypes = ['Main', 'NEET', 'Advanced'];
    let candidates = await this.questionRepo.findFacultyFallbackQuestions(
      slot.subject,
      slot.topic,
      examTypes,
      slot.questionType,
      15,
    );

    if (
      candidates.length === 0 &&
      slot.questionType === 'matrix_match' &&
      typeof this.questionRepo.findSubjectMatrixFallbackQuestions === 'function'
    ) {
      candidates = await this.questionRepo.findSubjectMatrixFallbackQuestions(slot.subject, 15);
    }

    const broadCandidates = candidates.length > 0
      ? candidates
      : await this.questionRepo.findFacultyFallbackQuestions(slot.subject, slot.topic, examTypes, undefined, 15);

    let row = slot.requiresDiagram
      ? broadCandidates.find((q) => !usedBankIds.has(q.id) && !usedTexts.has(q.questionText) && q.diagram != null)
      : undefined;

    if (!row) {
      row = broadCandidates.find((q) => !usedBankIds.has(q.id) && !usedTexts.has(q.questionText));
    }
    if (!row) return null;

    usedBankIds.add(row.id);
    usedTexts.add(row.questionText);

    return {
      number: slot.number,
      subject: slot.subject,
      topic: slot.topic,
      difficulty: slot.difficulty,
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
