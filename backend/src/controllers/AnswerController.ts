import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AnswerService } from '../services/AnswerService';
import { AppError } from '../utils/AppError';
import type { AuthRequest } from '../types/index';

const submitSchema = z.object({
  questionId: z.string().min(1).max(64).regex(/^[a-zA-Z0-9_-]+$/),
  answer: z.string().min(1).max(100),
  timeSpent: z.number().int().min(0).max(3600),
});

export class AnswerController {
  constructor(private readonly answerService: AnswerService = new AnswerService()) {}

  public readonly submitAnswer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = submitSchema.safeParse(req.body);
      if (!body.success) {
        throw new AppError(400, body.error.errors[0]?.message ?? 'Invalid input');
      }

      const result = await this.answerService.submitPracticeAnswer({
        userId: req.user!.userId,
        questionId: body.data.questionId,
        answer: body.data.answer,
        timeSpent: body.data.timeSpent,
      });

      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
}
