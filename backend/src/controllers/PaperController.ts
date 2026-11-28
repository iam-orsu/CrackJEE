import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import { PaperService, PAPER_PAGE_SIZE } from '../services/PaperService';
import { AppError } from '../utils/AppError';
import { consumeExamCredit, refundExamCredit } from '../services/quota';
import { JEE_TOPICS, getTopicsForClass, type AuthRequest, type Subject } from '../types/index';

const selectionSchema = z.object({
  subject: z.enum(['Mathematics', 'Physics', 'Chemistry']),
  topic: z.string().min(1).max(100),
  count: z.number().int().min(0).max(150).optional(),
  mcqCount: z.number().int().min(0).max(150).optional(),
  integerCount: z.number().int().min(0).max(150).optional(),
  multiCount: z.number().int().min(0).max(150).optional(),
  matrixCount: z.number().int().min(0).max(150).optional(),
  mcqEasy: z.number().int().min(0).max(150).optional(),
  mcqMedium: z.number().int().min(0).max(150).optional(),
  mcqHard: z.number().int().min(0).max(150).optional(),
  integerEasy: z.number().int().min(0).max(150).optional(),
  integerMedium: z.number().int().min(0).max(150).optional(),
  integerHard: z.number().int().min(0).max(150).optional(),
  multiEasy: z.number().int().min(0).max(150).optional(),
  multiMedium: z.number().int().min(0).max(150).optional(),
  multiHard: z.number().int().min(0).max(150).optional(),
  matrixEasy: z.number().int().min(0).max(150).optional(),
  matrixMedium: z.number().int().min(0).max(150).optional(),
  matrixHard: z.number().int().min(0).max(150).optional(),
}).passthrough();

const papersSchema = z.object({
  selections: z.array(selectionSchema).min(1).max(150),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'mixed']).default('mixed'),
  examType: z.enum(['Main', 'Advanced', 'Both']).default('Main'),
  studentClass: z.enum(['11', '12', 'Dropper']).default('12'),
  perSubject: z.number().int().min(1).max(150).default(10),
  page: z.number().int().min(1).max(1000).default(1),
  questionTypes: z.object({
    mcq_single: z.number().int().min(0).optional(),
    mcq_multi: z.number().int().min(0).optional(),
    integer: z.number().int().min(0).optional(),
    matrix_match: z.number().int().min(0).optional(),
  }).optional(),
  difficultyDistribution: z.object({
    beginner: z.number().min(0).max(100).optional(),
    intermediate: z.number().min(0).max(100).optional(),
    advanced: z.number().min(0).max(100).optional(),
  }).optional(),
});

const claimSchema = z.object({
  questionIds: z.array(z.string().min(1).max(64).regex(/^[a-zA-Z0-9_-]+$/)).min(1).max(500),
});

export class PaperController {
  constructor(private readonly paperService: PaperService = new PaperService()) {}

  public readonly previewPapers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = papersSchema.safeParse(req.body);
      if (!body.success) {
        throw new AppError(400, body.error.errors[0]?.message ?? 'Invalid parameters');
      }
      const { selections, difficulty, examType, studentClass, perSubject, page, questionTypes, difficultyDistribution } = body.data;

      for (const { subject, topic } of selections) {
        if (!JEE_TOPICS[subject].includes(topic)) {
          throw new AppError(400, `Invalid topic "${topic}" for subject "${subject}"`);
        }
        if (!getTopicsForClass(subject, studentClass).includes(topic)) {
          throw new AppError(400, `Topic "${topic}" is not in the Class ${studentClass} syllabus`);
        }
      }

      const result = await this.paperService.buildPaperPage(
        req.user!.userId,
        {
          selections: selections as Array<{ subject: Subject; topic: string }>,
          difficulty,
          examType,
          perSubject,
          questionTypes,
          difficultyDistribution,
        },
        page,
      );

      const allIds = result.papers.flat();
      const questions = await this.paperService.fetchPaperQuestions(allIds);
      const byId = new Map(questions.map((q) => [q.id, q]));

      const firstNumber = (page - 1) * PAPER_PAGE_SIZE;
      const data = result.papers.map((ids, index) => ({
        number: firstNumber + index + 1,
        questionIds: ids,
        questions: ids.map((id) => byId.get(id)).filter((q): q is NonNullable<typeof q> => !!q),
      }));

      res.json({
        success: true,
        data: {
          papers: data,
          page,
          pageCount: result.pageCount,
          available: result.available,
          possibleSets: result.possibleSets,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  public readonly claimPapers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = claimSchema.safeParse(req.body);
      if (!body.success) {
        throw new AppError(400, body.error.errors[0]?.message ?? 'Invalid input');
      }

      await consumeExamCredit(req.user!.userId);

      const questions = await this.paperService.claimPaper(req.user!.userId, body.data.questionIds);
      if (questions.length === 0) {
        await refundExamCredit(req.user!.userId);
        throw new AppError(404, 'None of these questions are available any more. Pick another paper.');
      }

      const safe = questions.map(({ answer: _, explanation: __, ...q }) => q);
      res.json({ success: true, data: safe, source: 'bank' });
    } catch (err) {
      next(err);
    }
  };
}
