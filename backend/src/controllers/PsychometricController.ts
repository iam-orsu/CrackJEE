import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import { PsychometricService, psychometricService as defaultPsychometricService } from '../services/PsychometricService';
import type { AuthRequest } from '../types/index';
import { AppError } from '../utils/AppError';

const candidateProfileSchema = z.object({
  age: z.number().int().min(6).max(100).default(16),
  professionStatus: z.enum(['student', 'employed', 'job_seeker']),
  studentLevel: z.enum(['school', 'intermediate', 'ug', 'pg']).optional(),
  schoolClass: z.enum(['class_4', 'class_5', 'class_6', 'class_7', 'class_8', 'class_9', 'class_10']).optional(),
  stream: z.string().optional(),
  jobTitle: z.string().optional(),
  companyType: z.string().optional(),
  highestQualification: z.string().optional(),
  targetRole: z.string().optional(),
});

const startCardSchema = z.object({
  cardId: z.string().optional(),
  cardIds: z.array(z.string().min(1)).optional(),
  profile: candidateProfileSchema,
}).refine((data) => Boolean(data.cardId || (data.cardIds && data.cardIds.length > 0)), {
  message: 'Must provide cardId or cardIds',
});

const saveAnswerSchema = z.object({
  sessionId: z.string().min(1),
  item: z.object({
    id: z.string(),
    section: z.string().nullish(),
    construct: z.string().nullish(),
    subFacet: z.string().nullish(),
    itemType: z.string().nullish(),
    scenarioText: z.string().nullish(),
    promptText: z.string(),
    options: z.array(z.object({ id: z.string(), text: z.string() })).nullish(),
    correctAnswer: z.string().nullish(),
    isReverseKeyed: z.boolean().nullish(),
    orderIndex: z.number().nullish(),
  }),
  answer: z.string().min(1),
  timeSpentMs: z.number().optional().default(0),
});

const submitSessionSchema = z.object({
  sessionId: z.string().min(1),
  profile: candidateProfileSchema.partial().optional(),
});

export class PsychometricController {
  constructor(private readonly service: PsychometricService = defaultPsychometricService) {}

  public readonly getCards = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cards = this.service.getCards();
      res.json({ success: true, data: cards });
    } catch (err) {
      next(err);
    }
  };

  public readonly startCardSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError(401, 'Unauthorized');

      const parsed = startCardSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.errors[0]?.message ?? 'Invalid request');
      }

      const cardIds =
        parsed.data.cardIds && parsed.data.cardIds.length > 0
          ? parsed.data.cardIds
          : [parsed.data.cardId!];

      const result = await this.service.startCardSession(
        userId,
        cardIds,
        parsed.data.profile as any,
      );
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  public readonly getSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError(401, 'Unauthorized');

      const targetExam = (req.query.targetExam as string) || 'Main';
      const result = await this.service.getOrCreateSession(userId, targetExam);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  public readonly getActiveSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError(401, 'Unauthorized');

      const result = await this.service.getActiveSession(userId);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  public readonly discardSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError(401, 'Unauthorized');

      const sessionId = req.body?.sessionId as string | undefined;
      const result = await this.service.discardSession(userId, sessionId);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  public readonly saveAnswer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError(401, 'Unauthorized');

      const parsed = saveAnswerSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.errors[0]?.message ?? 'Invalid request');
      }

      const response = await this.service.saveAnswer({
        sessionId: parsed.data.sessionId,
        userId,
        item: parsed.data.item as any,
        answer: parsed.data.answer,
        timeSpentMs: parsed.data.timeSpentMs,
      });

      res.json({ success: true, data: response });
    } catch (err) {
      next(err);
    }
  };

  public readonly submitSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError(401, 'Unauthorized');

      const parsed = submitSessionSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.errors[0]?.message ?? 'Invalid request');
      }

      const report = await this.service.submitSession(
        parsed.data.sessionId,
        userId,
        parsed.data.profile as any,
      );
      res.json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  };

  public readonly getHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError(401, 'Unauthorized');

      const history = await this.service.getUserHistory(userId);
      res.json({ success: true, data: history });
    } catch (err) {
      next(err);
    }
  };

  public readonly getReport = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError(401, 'Unauthorized');

      const report = await this.service.getReport(userId);
      res.json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  };
}
