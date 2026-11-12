import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import { FacultyAuthService } from '../services/FacultyAuthService';
import { facultyPaperService, type FacultyPaperService } from '../services/FacultyPaperService';
import {
  clearFacultyCookie,
  setFacultyCookie,
  type FacultyAuthRequest,
} from '../middlewares/facultyAuth.middleware';
import { getJeeTopicsForExam, NEET_TOPICS, type Subject } from '../types/index';
import { AppError } from '../utils/AppError';

const loginSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(1).max(200),
});

const selectionSchema = z.object({
  subject: z.enum(['Physics', 'Chemistry', 'Mathematics', 'Botany', 'Zoology']),
  topic: z.string().trim().min(1).max(120),
});

const createPaperSchema = z.object({
  title: z.string().trim().max(120).optional(),
  examType: z.enum(['Main', 'Advanced', 'NEET']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'mixed']),
  questionCount: z.number().int().min(1).max(180),
  questionType: z.enum(['auto', 'mcq_single', 'mcq_multi', 'integer']).optional(),
  selections: z.array(selectionSchema).min(1).max(60),
});

const updateQuestionSchema = z.object({
  questionText: z.string().min(1).max(4000).optional(),
  options: z.array(z.string().min(1).max(1000)).length(4).optional(),
  correctAnswer: z.string().min(1).max(20).optional(),
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
  subject: z.enum(['Physics', 'Chemistry', 'Mathematics', 'Botany', 'Zoology']),
  topic: z.string().trim().min(1).max(120),
  questionType: z.enum(['mcq_single', 'mcq_multi', 'integer']).optional(),
});

const acceptDraftSchema = z.object({
  subject: z.enum(['Physics', 'Chemistry', 'Mathematics', 'Botany', 'Zoology']),
  topic: z.string().trim().min(1).max(120),
  questionType: z.enum(['mcq_single', 'mcq_multi', 'integer']),
  questionText: z.string().min(1).max(4000),
  options: z.array(z.string().max(1000)).max(4),
  correctAnswer: z.string().min(1).max(20),
  explanation: z.string().max(4000),
  diagram: z.any().nullable(),
  verified: z.boolean(),
});

function parseQuestionNumber(raw: unknown): number {
  const num = Number(Array.isArray(raw) ? raw[0] : raw);
  if (!Number.isInteger(num) || num < 1 || num > 180) {
    throw new AppError(400, 'Invalid question number');
  }
  return num;
}

function catalogForExam(examType: 'Main' | 'Advanced' | 'NEET'): Record<string, string[]> {
  return examType === 'NEET' ? NEET_TOPICS : getJeeTopicsForExam(examType);
}

/** Handles faculty portal authentication, topic lookup, paper creation, editing, and PDF data retrieval. */
export class FacultyController {
  constructor(
    private readonly authService: FacultyAuthService = new FacultyAuthService(),
    private readonly paperService: FacultyPaperService = facultyPaperService,
  ) {}

  public readonly login = async (req: FacultyAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) throw new AppError(400, 'Valid email and password are required');

      const result = await this.authService.login(parsed.data.email, parsed.data.password);
      setFacultyCookie(res, result.token);
      res.json({ success: true, faculty: result.faculty, expiresAt: result.expiresAt });
    } catch (err) {
      next(err);
    }
  };

  public readonly me = (req: FacultyAuthRequest, res: Response): void => {
    res.json({ success: true, faculty: req.faculty });
  };

  public readonly logout = (_req: FacultyAuthRequest, res: Response): void => {
    clearFacultyCookie(res);
    res.json({ success: true });
  };

  public readonly getTopics = (req: FacultyAuthRequest, res: Response): void => {
    const rawExam = String(req.query.examType ?? 'Main');
    const examType = rawExam === 'NEET' ? 'NEET' : rawExam === 'Advanced' ? 'Advanced' : 'Main';
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
      const validSelections: Array<{ subject: Subject; topic: string }> = [];

      for (const sel of parsed.data.selections) {
        const allowedTopics = catalog[sel.subject];
        if (!allowedTopics || !allowedTopics.includes(sel.topic)) {
          throw new AppError(400, `Topic "${sel.topic}" is not valid for ${parsed.data.examType} ${sel.subject}`);
        }
        const key = `${sel.subject}::${sel.topic}`;
        if (!seen.has(key)) {
          seen.add(key);
          validSelections.push({ subject: sel.subject as Subject, topic: sel.topic });
        }
      }

      const paper = await this.paperService.startPaper(req.faculty!.facultyId, {
        title: parsed.data.title,
        examType: parsed.data.examType,
        difficulty: parsed.data.difficulty,
        questionCount: parsed.data.questionCount,
        questionType: parsed.data.questionType,
        selections: validSelections,
      });

      res.status(201).json({ success: true, paper });
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
      const catalog = catalogForExam(paper.examType as 'Main' | 'Advanced' | 'NEET');
      const allowed = catalog[parsed.data.subject];
      if (!allowed || !allowed.includes(parsed.data.topic)) {
        throw new AppError(400, `Topic "${parsed.data.topic}" is not valid for ${paper.examType} ${parsed.data.subject}`);
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
}
