import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import type { AuthRequest } from '../types/index';
import { JEE_TOPICS, JEE_TOPICS_BY_CLASS, getTopicsForClass } from '../types/index';
import type { Subject, StudentClass } from '../types/index';
import { getNextQuestion, getQuestionBatch } from '../services/questionService';
import { AppError } from '../middleware/errorHandler';

const nextQuestionSchema = z.object({
  subject: z.enum(['Mathematics', 'Physics', 'Chemistry']),
  topic: z.string().min(1).max(100),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
  examType: z.enum(['Main', 'Advanced', 'Both']).default('Main'),
  studentClass: z.enum(['11', '12', 'Dropper']).default('12'),
});

const selectionSchema = z.object({
  subject: z.enum(['Mathematics', 'Physics', 'Chemistry']),
  topic: z.string().min(1).max(100),
});

const batchSchema = z.object({
  selections: z.array(selectionSchema).min(1).max(150),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'mixed']).default('mixed'),
  examType: z.enum(['Main', 'Advanced', 'Both']).default('Main'),
  studentClass: z.enum(['11', '12', 'Dropper']).default('12'),
  count: z.number().int().min(1).max(100).default(10),
});

export async function nextQuestion(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = nextQuestionSchema.safeParse(req.query);
    if (!query.success) {
      throw new AppError(400, query.error.errors[0]?.message ?? 'Invalid parameters');
    }

    const { subject, topic, difficulty, examType, studentClass } = query.data;

    if (!JEE_TOPICS[subject].includes(topic)) {
      throw new AppError(400, `Invalid topic "${topic}" for subject "${subject}"`);
    }

    const allowedTopics = getTopicsForClass(subject, studentClass);
    if (!allowedTopics.includes(topic)) {
      throw new AppError(400, `Topic "${topic}" is not in the Class ${studentClass} syllabus`);
    }

    const question = await getNextQuestion(req.user!.userId, subject, topic, difficulty, examType, studentClass);

    const { answer: _, explanation: __, ...safeQuestion } = question;
    res.json({ success: true, data: safeQuestion });
  } catch (err) {
    next(err);
  }
}

export async function batchQuestions(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = batchSchema.safeParse(req.body);
    if (!body.success) {
      throw new AppError(400, body.error.errors[0]?.message ?? 'Invalid parameters');
    }

    const { selections, difficulty, examType, studentClass, count } = body.data;

    for (const { subject, topic } of selections) {
      if (!JEE_TOPICS[subject].includes(topic)) {
        throw new AppError(400, `Invalid topic "${topic}" for subject "${subject}"`);
      }
      const allowed = getTopicsForClass(subject, studentClass);
      if (!allowed.includes(topic)) {
        throw new AppError(400, `Topic "${topic}" is not in the Class ${studentClass} syllabus`);
      }
    }

    const questions = await getQuestionBatch(
      req.user!.userId,
      selections as Array<{ subject: import('../types/index').Subject; topic: string }>,
      difficulty,
      examType,
      studentClass,
      count,
    );

    const safe = questions.map(({ answer: _, explanation: __, ...q }) => q);
    res.json({ success: true, data: safe });
  } catch (err) {
    next(err);
  }
}

export function getTopics(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    const subject = req.query.subject as string | undefined;
    const studentClass = (req.query.studentClass as StudentClass | undefined) ?? '12';

    if (subject && !(['Mathematics', 'Physics', 'Chemistry'] as string[]).includes(subject)) {
      throw new AppError(400, 'Invalid subject');
    }
    if (!(['11', '12', 'Dropper'] as string[]).includes(studentClass)) {
      throw new AppError(400, 'Invalid studentClass');
    }

    if (subject) {
      const s = subject as Subject;
      res.json({ success: true, data: { [subject]: getTopicsForClass(s, studentClass) } });
    } else {
      res.json({
        success: true,
        data: {
          Mathematics: getTopicsForClass('Mathematics', studentClass),
          Physics:     getTopicsForClass('Physics',     studentClass),
          Chemistry:   getTopicsForClass('Chemistry',   studentClass),
        },
      });
    }
  } catch (err) {
    next(err);
  }
}

export function getTopicsByClass(_req: AuthRequest, res: Response): void {
  res.json({ success: true, data: JEE_TOPICS_BY_CLASS });
}
