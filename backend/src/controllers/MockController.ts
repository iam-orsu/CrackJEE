import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import { MockExamService } from '../services/MockExamService';
import { AppError } from '../utils/AppError';
import type { AuthRequest } from '../types/index';

const startSchema = z.object({
  examType: z.enum(['Main', 'Advanced', 'NEET']),
  difficultyMode: z.enum(['easy', 'medium', 'hard']).default('medium'),
});

const answerSchema = z.object({
  mockQuestionId: z.string().min(1).max(36),
  answer: z.string().max(20),
  markedForReview: z.boolean().optional(),
});

export class MockController {
  constructor(private readonly mockExamService: MockExamService = new MockExamService()) {}

  public readonly startMock = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = startSchema.safeParse(req.body);
      if (!body.success) throw new AppError(400, 'Invalid examType');

      const data = await this.mockExamService.startMock(
        req.user!.userId,
        body.data.examType,
        body.data.difficultyMode,
      );
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly getMock = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const data = await this.mockExamService.getMock(req.user!.userId, id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly beginMock = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const data = await this.mockExamService.beginMock(req.user!.userId, id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly saveAnswer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const body = answerSchema.safeParse(req.body);
      if (!body.success) throw new AppError(400, 'Invalid input');

      await this.mockExamService.saveAnswer(
        req.user!.userId,
        id,
        body.data.mockQuestionId,
        body.data.answer,
        body.data.markedForReview,
      );
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  };

  public readonly submitMock = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const questionTimes = (req.body as { questionTimes?: Record<string, number> })?.questionTimes ?? {};
      const data = await this.mockExamService.submitMock(req.user!.userId, id, questionTimes);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly getMockResult = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const data = await this.mockExamService.getMockResult(req.user!.userId, id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly cancelMock = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      await this.mockExamService.cancelMock(req.user!.userId, id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  };

  public readonly getMockHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.mockExamService.getMockHistory(req.user!.userId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly getExamInsights = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const data = await this.mockExamService.getExamInsights(req.user!.userId, id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly getQuestionExplanation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id, mockQuestionId } = req.params as { id: string; mockQuestionId: string };
      const data = await this.mockExamService.getQuestionExplanation(req.user!.userId, id, mockQuestionId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };
}
