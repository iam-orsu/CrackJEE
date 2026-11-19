import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import { facultyPaperService, type FacultyPaperService } from '../services/FacultyPaperService';
import { FacultyBatchService } from '../services/FacultyBatchService';
import { FacultyAssignmentService } from '../services/FacultyAssignmentService';
import { FacultyPdfService } from '../services/FacultyPdfService';
import {
  clearFacultyCookie,
  type FacultyAuthRequest,
} from '../middlewares/facultyAuth.middleware';
import { getJeeTopicsForExam, NEET_TOPICS, type Subject } from '../types/index';
import { findCardDef, PSYCHOMETRIC_CARDS } from '../data/psychometricCards';
import { AppError } from '../utils/AppError';

const selectionSchema = z.object({
  subject: z.enum(['Physics', 'Chemistry', 'Mathematics', 'Botany', 'Zoology', 'Psychometric']),
  topic: z.string().trim().min(1).max(120),
  mcqCount: z.number().int().min(0).max(180).optional(),
  integerCount: z.number().int().min(0).max(180).optional(),
  multiCount: z.number().int().min(0).max(180).optional(),
  matrixCount: z.number().int().min(0).max(180).optional(),
  mcqEasy: z.number().int().min(0).max(180).optional(),
  mcqMedium: z.number().int().min(0).max(180).optional(),
  mcqHard: z.number().int().min(0).max(180).optional(),
  integerEasy: z.number().int().min(0).max(180).optional(),
  integerMedium: z.number().int().min(0).max(180).optional(),
  integerHard: z.number().int().min(0).max(180).optional(),
  multiEasy: z.number().int().min(0).max(180).optional(),
  multiMedium: z.number().int().min(0).max(180).optional(),
  multiHard: z.number().int().min(0).max(180).optional(),
  matrixEasy: z.number().int().min(0).max(180).optional(),
  matrixMedium: z.number().int().min(0).max(180).optional(),
  matrixHard: z.number().int().min(0).max(180).optional(),
});

const createPaperSchema = z.object({
  title: z.string().trim().max(120).optional(),
  organization: z.string().trim().max(120).optional(),
  examType: z.enum(['Main', 'Advanced', 'NEET', 'Psychometric']),
  examGoal: z.string().trim().max(1000).optional(),
  targetProfile: z
    .object({
      studentLevel: z.string().trim().max(100).optional(),
      schoolClass: z.string().trim().max(100).optional(),
      stream: z.string().trim().max(100).optional(),
      ageGroup: z.string().trim().max(100).optional(),
      age: z.number().int().min(6).max(100).optional(),
    })
    .optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'mixed']).optional().default('intermediate'),
  difficultyDistribution: z
    .object({
      beginner: z.number().min(0).max(100),
      intermediate: z.number().min(0).max(100),
      advanced: z.number().min(0).max(100),
    })
    .optional(),
  questionCount: z.number().int().min(1).max(180),
  questionType: z.enum(['auto', 'mcq_single', 'mcq_multi', 'integer', 'matrix_match']).optional(),
  selections: z.array(selectionSchema).min(1).max(60),
});

const updateQuestionSchema = z.object({
  questionText: z.string().min(1).max(4000).optional(),
  options: z.array(z.string().min(1).max(1000)).length(4).optional(),
  correctAnswer: z.string().min(1).max(1000).optional(),
  explanation: z.string().max(4000).optional(),
  removeDiagram: z.boolean().optional(),
}).refine(
  (v) =>
    v.questionText !== undefined ||
    v.options !== undefined ||
    v.correctAnswer !== undefined ||
    v.explanation !== undefined ||
    v.removeDiagram !== undefined,
  { message: 'Provide at least one field to update' },
);

const draftQuestionSchema = z.object({
  subject: z.enum(['Physics', 'Chemistry', 'Mathematics', 'Botany', 'Zoology', 'Psychometric']),
  topic: z.string().trim().min(1).max(120),
  questionType: z.enum(['mcq_single', 'mcq_multi', 'integer', 'matrix_match']).optional(),
});

const acceptDraftSchema = z.object({
  subject: z.enum(['Physics', 'Chemistry', 'Mathematics', 'Botany', 'Zoology', 'Psychometric']),
  topic: z.string().trim().min(1).max(120),
  questionType: z.enum(['mcq_single', 'mcq_multi', 'integer', 'matrix_match']),
  questionText: z.string().min(1).max(4000),
  options: z.array(z.string().max(1000)).max(4),
  correctAnswer: z.string().min(1).max(1000),
  explanation: z.string().max(4000),
  diagram: z.any().nullable(),
  verified: z.boolean(),
});

const createBatchSchema = z.object({
  name: z.string().trim().min(1, 'Batch name is required').max(100),
  code: z.string().trim().min(1, 'Batch code is required').max(50),
  description: z.string().trim().max(300).optional(),
});

const createStudentSchema = z.object({
  batchId: z.string().min(1, 'Batch is required'),
  name: z.string().trim().min(1, 'Student name is required').max(100),
  rollNumber: z.string().trim().min(1, 'Roll number is required').max(50),
  email: z.string().trim().email().optional().or(z.literal('')),
  password: z.string().min(4, 'Password must be at least 4 characters').optional().or(z.literal('')),
});

const bulkStudentItemSchema = z.object({
  batchId: z.string().optional(),
  batchCode: z.string().optional(),
  batchName: z.string().optional(),
  name: z.string().trim().min(1, 'Name is required').max(100),
  rollNumber: z.string().trim().min(1, 'Roll number is required').max(50),
  email: z.string().trim().email().optional().or(z.literal('')),
  password: z.string().min(4).optional().or(z.literal('')),
});

const bulkCreateStudentsSchema = z.object({
  batchId: z.string().optional(),
  students: z.array(bulkStudentItemSchema).min(1, 'At least one student is required').max(1000, 'Max 1000 students per batch'),
});

const createAssignmentSchema = z.object({
  paperId: z.string().min(1, 'Paper is required'),
  batchId: z.string().min(1, 'Batch is required'),
  title: z.string().trim().min(1, 'Title is required').max(150),
  instructions: z.string().max(2000).optional(),
  durationMinutes: z.number().int().min(10).max(360).default(180),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  showSolutions: z.boolean().default(true),
  showGoalToStudents: z.boolean().optional().default(false),
});

function parseQuestionNumber(raw: unknown): number {
  const num = Number(Array.isArray(raw) ? raw[0] : raw);
  if (!Number.isInteger(num) || num < 1 || num > 180) {
    throw new AppError(400, 'Invalid question number');
  }
  return num;
}

function catalogForExam(examType: 'Main' | 'Advanced' | 'NEET' | 'Psychometric'): Record<string, string[]> {
  if (examType === 'Psychometric') {
    return { Psychometric: PSYCHOMETRIC_CARDS.map((c) => c.name) };
  }
  return examType === 'NEET' ? NEET_TOPICS : getJeeTopicsForExam(examType);
}

/** Handles faculty portal authentication, topic lookup, paper creation, editing, and PDF data retrieval. */
export class FacultyController {
  constructor(
    private readonly paperService: FacultyPaperService = facultyPaperService,
    private readonly batchService: FacultyBatchService = new FacultyBatchService(),
    private readonly assignmentService: FacultyAssignmentService = new FacultyAssignmentService(),
    private readonly pdfService: FacultyPdfService = new FacultyPdfService(),
  ) {}

  public readonly me = (req: FacultyAuthRequest, res: Response): void => {
    res.json({ success: true, faculty: req.faculty });
  };

  public readonly logout = (_req: FacultyAuthRequest, res: Response): void => {
    clearFacultyCookie(res);
    res.json({ success: true });
  };

  public readonly getTopics = (req: FacultyAuthRequest, res: Response): void => {
    const rawExam = String(req.query.examType ?? 'Main');
    const examType = rawExam === 'Psychometric'
      ? 'Psychometric'
      : rawExam === 'NEET'
      ? 'NEET'
      : rawExam === 'Advanced'
      ? 'Advanced'
      : 'Main';
    const topics = catalogForExam(examType);
    res.json({ success: true, examType, subjects: Object.keys(topics), topics });
  };

  public readonly listPapers = async (req: FacultyAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const papers = await this.paperService.listPapers(req.faculty!.facultyId);
      res.json({ success: true, papers });
    } catch (err) {
      next(err);
    }
  };

  public readonly createPaper = async (req: FacultyAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = createPaperSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.issues[0]?.message ?? 'Invalid paper configuration');
      }

      const catalog = catalogForExam(parsed.data.examType);
      const seen = new Set<string>();
      const validSelections: Array<{
        subject: Subject;
        topic: string;
        mcqCount?: number;
        integerCount?: number;
        multiCount?: number;
        matrixCount?: number;
      }> = [];

      for (const sel of parsed.data.selections) {
        const allowedTopics = catalog[sel.subject];
        let normalizedTopic = sel.topic;
        if (parsed.data.examType === 'Psychometric') {
          const byId = findCardDef(sel.topic);
          if (byId) normalizedTopic = byId.name;
        }
        if (!allowedTopics || (!allowedTopics.includes(sel.topic) && !allowedTopics.includes(normalizedTopic))) {
          throw new AppError(400, `Topic "${sel.topic}" is not valid for ${parsed.data.examType} ${sel.subject}`);
        }
        const key = `${sel.subject}::${normalizedTopic}`;
        if (!seen.has(key)) {
          seen.add(key);
          validSelections.push({
            subject: sel.subject as Subject,
            topic: normalizedTopic,
            mcqCount: sel.mcqCount,
            integerCount: sel.integerCount,
            multiCount: sel.multiCount,
            matrixCount: sel.matrixCount,
          });
        }
      }

      const paper = await this.paperService.startPaper(req.faculty!.facultyId, {
        title: parsed.data.title,
        organization: parsed.data.organization,
        examType: parsed.data.examType,
        examGoal: parsed.data.examGoal,
        targetProfile: parsed.data.targetProfile,
        difficulty: parsed.data.difficulty,
        difficultyDistribution: parsed.data.difficultyDistribution,
        questionCount: parsed.data.questionCount,
        questionType: parsed.data.questionType,
        selections: validSelections,
      });

      res.status(201).json({ success: true, paper });
    } catch (err) {
      next(err);
    }
  };

  public readonly downloadPaperExcel = async (req: FacultyAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const paperId = String(req.params.id);
      const paper = await this.paperService.getPaper(req.faculty!.facultyId, paperId);
      const csv = this.paperService.exportPaperToCsv(paper);
      const filename = `${paper.paperCode || 'Paper'}-Psychometric-Evaluation-Matrix.csv`;
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csv);
    } catch (err) {
      next(err);
    }
  };

  public readonly getPaper = async (req: FacultyAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const paper = await this.paperService.getPaper(req.faculty!.facultyId, String(req.params.id));
      res.json({ success: true, paper });
    } catch (err) {
      next(err);
    }
  };

  public readonly downloadPaperPdf = async (req: FacultyAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const paperId = String(req.params.id);
      const rawMode = String(req.query.mode || 'questions').toLowerCase();
      const mode = (rawMode === 'solutions' || rawMode === 'key') ? rawMode : 'questions';

      const { buffer, filename } = await this.pdfService.generatePaperPdf(
        req.faculty!.facultyId,
        paperId,
        mode,
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', buffer.length);
      res.end(buffer);
    } catch (err) {
      next(err);
    }
  };

  public readonly updateQuestion = async (
    req: FacultyAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const questionNumber = parseQuestionNumber(req.params.number);
      const parsed = updateQuestionSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.issues[0]?.message ?? 'Invalid question edit payload');
      }

      const paper = await this.paperService.updateQuestion(
        req.faculty!.facultyId,
        String(req.params.id),
        questionNumber,
        parsed.data,
      );
      res.json({ success: true, paper });
    } catch (err) {
      next(err);
    }
  };

  public readonly regenerateQuestion = async (
    req: FacultyAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const questionNumber = parseQuestionNumber(req.params.number);
      const paper = await this.paperService.regenerateQuestion(
        req.faculty!.facultyId,
        String(req.params.id),
        questionNumber,
      );
      res.json({ success: true, paper });
    } catch (err) {
      next(err);
    }
  };

  public readonly deleteQuestion = async (
    req: FacultyAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const questionNumber = parseQuestionNumber(req.params.number);
      const paper = await this.paperService.deleteQuestion(
        req.faculty!.facultyId,
        String(req.params.id),
        questionNumber,
      );
      res.json({ success: true, paper });
    } catch (err) {
      next(err);
    }
  };

  public readonly generateDraftQuestion = async (
    req: FacultyAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = draftQuestionSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.issues[0]?.message ?? 'Invalid topic selection');
      }

      const paper = await this.paperService.getPaper(req.faculty!.facultyId, String(req.params.id));
      const isPsychometric = paper.examType === 'Psychometric' || parsed.data.subject === 'Psychometric';

      if (!isPsychometric) {
        const catalog = catalogForExam(paper.examType as 'Main' | 'Advanced' | 'NEET');
        const allowed = catalog[parsed.data.subject];
        if (!allowed || !allowed.includes(parsed.data.topic)) {
          throw new AppError(400, `Topic "${parsed.data.topic}" is not valid for ${paper.examType} ${parsed.data.subject}`);
        }
      }

      const candidate = await this.paperService.generateDraftQuestion(req.faculty!.facultyId, paper.id, {
        subject: parsed.data.subject as Subject,
        topic: parsed.data.topic,
        questionType: parsed.data.questionType,
      });
      res.json({ success: true, candidate });
    } catch (err) {
      next(err);
    }
  };

  public readonly acceptDraftQuestion = async (
    req: FacultyAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const targetNumber = req.params.number !== undefined ? parseQuestionNumber(req.params.number) : null;
      const parsed = acceptDraftSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.issues[0]?.message ?? 'Invalid candidate question');
      }

      const paper = await this.paperService.acceptDraftQuestion(
        req.faculty!.facultyId,
        String(req.params.id),
        targetNumber,
        {
          ...parsed.data,
          diagram: parsed.data.diagram ?? null,
        },
      );
      res.json({ success: true, paper });
    } catch (err) {
      next(err);
    }
  };

  public readonly deletePaper = async (req: FacultyAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.paperService.deletePaper(req.faculty!.facultyId, String(req.params.id));
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  };

  // ── Batch Management ──
  public readonly listBatches = async (req: FacultyAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const batches = await this.batchService.listBatches(req.faculty!.facultyId);
      res.json({ success: true, batches });
    } catch (err) {
      next(err);
    }
  };

  public readonly createBatch = async (req: FacultyAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = createBatchSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.issues[0]?.message ?? 'Invalid batch details');
      }
      const batch = await this.batchService.createBatch(req.faculty!.facultyId, parsed.data);
      res.status(201).json({ success: true, batch });
    } catch (err) {
      next(err);
    }
  };

  public readonly deleteBatch = async (req: FacultyAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.batchService.deleteBatch(String(req.params.id), req.faculty!.facultyId);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  };

  // ── Student Management ──
  public readonly listStudents = async (req: FacultyAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const batchId = typeof req.query.batchId === 'string' ? req.query.batchId : undefined;
      const students = await this.batchService.listStudents(req.faculty!.facultyId, batchId);
      res.json({ success: true, students });
    } catch (err) {
      next(err);
    }
  };

  public readonly createStudent = async (req: FacultyAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = createStudentSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.issues[0]?.message ?? 'Invalid student details');
      }
      const result = await this.batchService.createStudent(req.faculty!.facultyId, {
        batchId: parsed.data.batchId,
        name: parsed.data.name,
        rollNumber: parsed.data.rollNumber,
        email: parsed.data.email || undefined,
        password: parsed.data.password || undefined,
      });
      res.status(201).json({ success: true, student: result.student, initialPassword: result.initialPassword });
    } catch (err) {
      next(err);
    }
  };

  public readonly bulkCreateStudents = async (req: FacultyAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = bulkCreateStudentsSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.issues[0]?.message ?? 'Invalid bulk student data');
      }
      const result = await this.batchService.bulkCreateStudents(
        req.faculty!.facultyId,
        parsed.data.students,
        parsed.data.batchId,
      );
      res.status(201).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  };

  public readonly deleteStudent = async (req: FacultyAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.batchService.deleteStudent(String(req.params.id), req.faculty!.facultyId);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  };

  // ── Exam Assignments & Batch Reports ──
  public readonly listAssignments = async (req: FacultyAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const assignments = await this.assignmentService.listAssignments(req.faculty!.facultyId);
      res.json({ success: true, assignments });
    } catch (err) {
      next(err);
    }
  };

  public readonly createAssignment = async (req: FacultyAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = createAssignmentSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.issues[0]?.message ?? 'Invalid assignment details');
      }
      const showGoal = parsed.data.showGoalToStudents;
      let finalInstructions = parsed.data.instructions?.trim() || '';
      if (showGoal) {
        finalInstructions = `<!--showGoal:true-->${finalInstructions}`;
      }
      const assignment = await this.assignmentService.createAssignment(req.faculty!.facultyId, {
        paperId: parsed.data.paperId,
        batchId: parsed.data.batchId,
        title: parsed.data.title,
        instructions: finalInstructions,
        durationMinutes: parsed.data.durationMinutes,
        startTime: parsed.data.startTime,
        endTime: parsed.data.endTime,
        showSolutions: parsed.data.showSolutions,
      });
      res.status(201).json({ success: true, assignment });
    } catch (err) {
      next(err);
    }
  };

  public readonly deleteAssignment = async (req: FacultyAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.assignmentService.deleteAssignment(String(req.params.id), req.faculty!.facultyId);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  };

  public readonly getAssignmentReport = async (req: FacultyAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const report = await this.assignmentService.getAssignmentReport(String(req.params.id), req.faculty!.facultyId);
      res.json({ success: true, report });
    } catch (err) {
      next(err);
    }
  };

  public readonly downloadAssignmentResultsCsv = async (req: FacultyAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const assignmentId = String(req.params.id);
      const { csv, filename } = await this.assignmentService.exportAssignmentResultsCsv(assignmentId, req.faculty!.facultyId);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csv);
    } catch (err) {
      next(err);
    }
  };

  public readonly getStudentSubmission = async (req: FacultyAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const assignmentId = String(req.params.id);
      const studentId = String(req.params.studentId);
      const submission = await this.assignmentService.getStudentSubmission(assignmentId, studentId, req.faculty!.facultyId);
      res.json({ success: true, submission });
    } catch (err) {
      next(err);
    }
  };
}
