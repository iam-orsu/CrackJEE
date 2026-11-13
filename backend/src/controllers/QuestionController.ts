import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import { QuestionService } from '../services/QuestionService';
import { AppError } from '../utils/AppError';
import {
  JEE_TOPICS,
  NEET_TOPICS,
  getTopicsForClass,
  type AuthRequest,
  type StudentClass,
  type Subject,
} from '../types/index';

const nextQuestionSchema = z.object({
  subject: z.enum(['Mathematics', 'Physics', 'Chemistry', 'Botany', 'Zoology']),
  topic: z.string().min(1).max(100),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
  examType: z.enum(['Main', 'Advanced', 'Both', 'NEET']).default('Main'),
  studentClass: z.enum(['11', '12', 'Dropper']).default('12'),
  mode: z.enum(['practice', 'ai']).default('practice'),
});

const selectionSchema = z.object({
  subject: z.enum(['Mathematics', 'Physics', 'Chemistry', 'Botany', 'Zoology']),
  topic: z.string().min(1).max(100),
});

const batchSchema = z.object({
  selections: z.array(selectionSchema).min(1).max(150),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'mixed']).default('mixed'),
  examType: z.enum(['Main', 'Advanced', 'Both', 'NEET']).default('Main'),
  studentClass: z.enum(['11', '12', 'Dropper']).default('12'),
  count: z.number().int().min(1).max(200).default(10),
  mode: z.enum(['practice', 'ai']).default('practice'),
});

const bankStatsQuerySchema = z.object({
  examType: z.enum(['Main', 'Advanced', 'Both', 'NEET']).optional(),
});

const getTopicsQuerySchema = z.object({
  studentClass: z.enum(['11', '12', 'Dropper']).default('12'),
  examMode: z.enum(['JEE', 'NEET']).default('JEE'),
});

const tieredExplanationSchema = z.object({
  tier: z.enum(['better', 'best']),
});

export class QuestionController {
  constructor(private readonly questionService: QuestionService = new QuestionService()) {}

  private validateTopicSelection(
    subject: Subject,
    topic: string,
    examType: string,
    studentClass: StudentClass,
  ): void {
    const isNEET = examType === 'NEET' || subject === 'Botany' || subject === 'Zoology';
    const topicList = isNEET ? (NEET_TOPICS[subject] ?? []) : (JEE_TOPICS[subject] ?? []);
    if (!topicList.includes(topic)) {
      throw new AppError(400, `Invalid topic "${topic}" for subject "${subject}"`);
    }
    if (!isNEET) {
      const allowedTopics = getTopicsForClass(subject, studentClass);
      if (!allowedTopics.includes(topic)) {
        throw new AppError(400, `Topic "${topic}" is not in the Class ${studentClass} syllabus`);
      }
    }
  }

  public readonly nextQuestion = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = nextQuestionSchema.safeParse(req.query);
      if (!query.success) {
        throw new AppError(400, query.error.errors[0]?.message ?? 'Invalid parameters');
      }

      const { subject, topic, difficulty, examType, studentClass, mode } = query.data;
      this.validateTopicSelection(subject, topic, examType, studentClass);

      const question = mode === 'practice'
        ? await this.questionService.getPracticeQuestion(req.user!.userId, subject, topic, difficulty, examType)
        : await this.questionService.getNextQuestion(req.user!.userId, subject, topic, difficulty, examType, studentClass);

      const { answer: _, explanation: __, ...safeQuestion } = question;
      res.json({ success: true, data: safeQuestion, source: mode === 'practice' ? 'bank' : 'ai' });
    } catch (err) {
      next(err);
    }
  };

  public readonly batchQuestions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = batchSchema.safeParse(req.body);
      if (!body.success) {
        throw new AppError(400, body.error.errors[0]?.message ?? 'Invalid parameters');
      }

      const { selections, difficulty, examType, studentClass, count, mode } = body.data;
      for (const { subject, topic } of selections) {
        this.validateTopicSelection(subject, topic, examType, studentClass);
      }

      const questions = mode === 'practice'
        ? await this.questionService.getPracticeQuestionBatch(
            req.user!.userId,
            selections as Array<{ subject: Subject; topic: string }>,
            difficulty,
            examType,
            count,
          )
        : await this.questionService.getQuestionBatch(
            req.user!.userId,
            selections as Array<{ subject: Subject; topic: string }>,
            difficulty,
            examType,
            studentClass,
            count,
          );

      const safe = questions.map(({ answer: _, explanation: __, ...q }) => q);
      res.json({ success: true, data: safe, source: mode === 'practice' ? 'bank' : 'ai' });
    } catch (err) {
      next(err);
    }
  };

  public readonly bankStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = bankStatsQuerySchema.safeParse(req.query);
      if (!query.success) {
        throw new AppError(400, 'Invalid examType filter');
      }
      const stats = await this.questionService.getBankStats(query.data.examType);
      res.json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  };

  public readonly getTopics = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      const query = getTopicsQuerySchema.safeParse(req.query);
      if (!query.success) {
        throw new AppError(400, query.error.errors[0]?.message ?? 'Invalid query parameters');
      }

      const data = this.questionService.getTopics(query.data.studentClass, query.data.examMode);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly getTieredExplanation = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string' || id.length > 64) {
        throw new AppError(400, 'Invalid question ID');
      }

      const body = tieredExplanationSchema.safeParse(req.body);
      if (!body.success) {
        throw new AppError(400, 'Tier must be either "better" or "best"');
      }

      const data = await this.questionService.getTieredExplanation(id, body.data.tier);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };
}
