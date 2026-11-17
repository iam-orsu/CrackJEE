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
  type TopicSelectionConfig,
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
  count: z.number().int().min(0).max(150).optional(),
  mcqCount: z.number().int().min(0).max(150).optional(),
  integerCount: z.number().int().min(0).max(150).optional(),
  multiCount: z.number().int().min(0).max(150).optional(),
  matrixCount: z.number().int().min(0).max(150).optional(),
  beginnerCount: z.number().int().min(0).max(150).optional(),
  intermediateCount: z.number().int().min(0).max(150).optional(),
  advancedCount: z.number().int().min(0).max(150).optional(),
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
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'mixed']).optional(),
  difficultyDistribution: z.object({
    beginner: z.number().min(0).max(100).optional(),
    intermediate: z.number().min(0).max(100).optional(),
    advanced: z.number().min(0).max(100).optional(),
  }).optional(),
});

const batchSchema = z.object({
  selections: z.array(selectionSchema).min(1).max(150),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'mixed']).default('mixed'),
  examType: z.enum(['Main', 'Advanced', 'Both', 'NEET']).default('Main'),
  studentClass: z.enum(['11', '12', 'Dropper']).default('12'),
  count: z.number().int().min(1).max(450).default(10),
  mode: z.enum(['practice', 'ai']).default('practice'),
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

      const { selections, difficulty, examType, studentClass, count, mode, questionTypes, difficultyDistribution } = body.data;
      for (const { subject, topic } of selections) {
        this.validateTopicSelection(subject, topic, examType, studentClass);
      }

      const hasGranularTopicCounts = selections.some(
        (s) =>
          (s.count ?? 0) > 0 ||
          (s.mcqCount ?? 0) > 0 ||
          (s.integerCount ?? 0) > 0 ||
          (s.multiCount ?? 0) > 0 ||
          (s.matrixCount ?? 0) > 0 ||
          (s.mcqEasy ?? 0) > 0 || (s.mcqMedium ?? 0) > 0 || (s.mcqHard ?? 0) > 0 ||
          (s.integerEasy ?? 0) > 0 || (s.integerMedium ?? 0) > 0 || (s.integerHard ?? 0) > 0 ||
          (s.multiEasy ?? 0) > 0 || (s.multiMedium ?? 0) > 0 || (s.multiHard ?? 0) > 0 ||
          (s.matrixEasy ?? 0) > 0 || (s.matrixMedium ?? 0) > 0 || (s.matrixHard ?? 0) > 0,
      );

      if (hasGranularTopicCounts) {
        const topicTotalSum = selections.reduce((sum, s) => {
          const mcq = (s.mcqCount ?? 0) > 0 ? s.mcqCount! : ((s.mcqEasy ?? 0) + (s.mcqMedium ?? 0) + (s.mcqHard ?? 0));
          const integer = (s.integerCount ?? 0) > 0 ? s.integerCount! : ((s.integerEasy ?? 0) + (s.integerMedium ?? 0) + (s.integerHard ?? 0));
          const multi = (s.multiCount ?? 0) > 0 ? s.multiCount! : ((s.multiEasy ?? 0) + (s.multiMedium ?? 0) + (s.multiHard ?? 0));
          const matrix = (s.matrixCount ?? 0) > 0 ? s.matrixCount! : ((s.matrixEasy ?? 0) + (s.matrixMedium ?? 0) + (s.matrixHard ?? 0));
          const typeSum = mcq + integer + multi + matrix;
          return sum + (typeSum > 0 ? typeSum : (s.count ?? 0));
        }, 0);

        if (topicTotalSum > 0 && topicTotalSum !== count) {
          throw new AppError(
            400,
            `Total questions across topic breakdown (${topicTotalSum}) does not match session question count (${count}).`,
          );
        }
      } else if (questionTypes) {
        const typeSum =
          (questionTypes.mcq_single ?? 0) +
          (questionTypes.mcq_multi ?? 0) +
          (questionTypes.integer ?? 0) +
          (questionTypes.matrix_match ?? 0);
        const subjectCount = new Set(selections.map((s) => s.subject)).size || 1;
        const perSubjectExpected = Math.floor(count / subjectCount);
        if (typeSum !== perSubjectExpected) {
          throw new AppError(
            400,
            `Question types allocation (${typeSum}) does not match the required ${perSubjectExpected} questions per subject.`,
          );
        }
      }

      if (difficultyDistribution) {
        const diffSum =
          (difficultyDistribution.beginner ?? 0) +
          (difficultyDistribution.intermediate ?? 0) +
          (difficultyDistribution.advanced ?? 0);
        if (diffSum > 0 && diffSum !== 100) {
          throw new AppError(
            400,
            `Difficulty percentages must sum to 100% (currently ${diffSum}%). Please adjust your percentages.`,
          );
        }
      }

      const questions = mode === 'practice'
        ? await this.questionService.getPracticeQuestionBatch(
            req.user!.userId,
            selections as TopicSelectionConfig[],
            difficulty,
            examType,
            count,
            questionTypes,
            difficultyDistribution,
          )
        : await this.questionService.getQuestionBatch(
            req.user!.userId,
            selections as TopicSelectionConfig[],
            difficulty,
            examType,
            studentClass,
            count,
            questionTypes,
            difficultyDistribution,
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

  public readonly weakPractice = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const topicId = req.query.topicId as string | undefined;
      const topicIdsParam = req.query.topicIds as string | undefined;

      const topicIds: string[] = [];
      if (topicId) topicIds.push(topicId);
      if (topicIdsParam) {
        topicIds.push(...topicIdsParam.split(',').map((s) => s.trim()).filter(Boolean));
      }

      if (topicIds.length === 0) {
        throw new AppError(400, 'topicId or topicIds query parameter is required');
      }

      const questions = await this.questionService.getWeakTopicsBatch(req.user!.userId, topicIds);
      const safe = questions.map(({ answer: _, explanation: __, ...q }) => q);
      res.json({ success: true, count: safe.length, data: safe });
    } catch (err) {
      next(err);
    }
  };
}
