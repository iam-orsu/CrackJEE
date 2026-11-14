import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import { MockExamService } from '../services/MockExamService';
import { AppError } from '../utils/AppError';
import type { AuthRequest } from '../types/index';

const idParamSchema = z.string().min(1).max(64).regex(/^[A-Za-z0-9_-]+$/);

const startSchema = z.object({
  examType: z.enum(['Main', 'Advanced', 'NEET']),
  difficultyMode: z.enum(['easy', 'medium', 'hard']).default('medium'),
  paperNumber: z.number().int().min(1).max(5000).optional(),
});

const answerSchema = z.object({
  mockQuestionId: z.string().min(1).max(64).regex(/^[A-Za-z0-9_-]+$/),
  answer: z.string().max(20),
  markedForReview: z.boolean().optional(),
});

const submitSchema = z.object({
  questionTimes: z
    .record(
      z.string().min(1).max(64).regex(/^[A-Za-z0-9_-]+$/),
      z.number().finite().min(0).max(86400).transform((n) => Math.round(n)),
    )
    .optional()
    .default({}),
});

export function parseMockIdParam(id: string | undefined, label = 'mock ID'): string {
  const parsed = idParamSchema.safeParse(id);
  if (!parsed.success) throw new AppError(400, `Invalid ${label}`);
  return parsed.data;
}

export function parseSubmitMockBody(raw: unknown): Record<string, number> {
  const parsed = submitSchema.safeParse(raw ?? {});
  if (!parsed.success) throw new AppError(400, 'Invalid questionTimes payload');
  const sanitized = Object.create(null) as Record<string, number>;
  for (const [key, val] of Object.entries(parsed.data.questionTimes)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    sanitized[key] = val;
  }
  return sanitized;
}

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
        body.data.paperNumber,
      );
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly getMock = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseMockIdParam((req.params as { id?: string }).id);
      const data = await this.mockExamService.getMock(req.user!.userId, id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly beginMock = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseMockIdParam((req.params as { id?: string }).id);
      const data = await this.mockExamService.beginMock(req.user!.userId, id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly saveAnswer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseMockIdParam((req.params as { id?: string }).id);
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
      const id = parseMockIdParam((req.params as { id?: string }).id);
      const questionTimes = parseSubmitMockBody(req.body);
      const data = await this.mockExamService.submitMock(req.user!.userId, id, questionTimes);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly getMockResult = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseMockIdParam((req.params as { id?: string }).id);
      const data = await this.mockExamService.getMockResult(req.user!.userId, id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly cancelMock = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseMockIdParam((req.params as { id?: string }).id);
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
      const id = parseMockIdParam((req.params as { id?: string }).id);
      const data = await this.mockExamService.getExamInsights(req.user!.userId, id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly getQuestionExplanation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = req.params as { id?: string; mockQuestionId?: string };
      const id = parseMockIdParam(params.id);
      const mockQuestionId = parseMockIdParam(params.mockQuestionId, 'mockQuestionId');
      const data = await this.mockExamService.getQuestionExplanation(req.user!.userId, id, mockQuestionId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };
}
