import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import type { AuthRequest } from '../types/index';
import { JEE_TOPICS, JEE_TOPICS_BY_CLASS, getTopicsForClass } from '../types/index';
import type { Subject, StudentClass } from '../types/index';
import { getNextQuestion, getQuestionBatch, getPracticeQuestion, getPracticeQuestionBatch } from '../services/questionService';
import { AppError } from '../middleware/errorHandler';
import { prisma } from '../lib/prisma';

const nextQuestionSchema = z.object({
  subject: z.enum(['Mathematics', 'Physics', 'Chemistry']),
  topic: z.string().min(1).max(100),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
  examType: z.enum(['Main', 'Advanced', 'Both']).default('Main'),
  studentClass: z.enum(['11', '12', 'Dropper']).default('12'),
  mode: z.enum(['practice', 'ai']).default('practice'),  // practice = question bank, ai = DeepSeek
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
  mode: z.enum(['practice', 'ai']).default('practice'),  // practice = question bank, ai = DeepSeek
});

export async function nextQuestion(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = nextQuestionSchema.safeParse(req.query);
    if (!query.success) {
      throw new AppError(400, query.error.errors[0]?.message ?? 'Invalid parameters');
    }

    const { subject, topic, difficulty, examType, studentClass, mode } = query.data;

    if (!JEE_TOPICS[subject].includes(topic)) {
      throw new AppError(400, `Invalid topic "${topic}" for subject "${subject}"`);
    }

    const allowedTopics = getTopicsForClass(subject, studentClass);
    if (!allowedTopics.includes(topic)) {
      throw new AppError(400, `Topic "${topic}" is not in the Class ${studentClass} syllabus`);
    }

    const question = mode === 'practice'
      ? await getPracticeQuestion(req.user!.userId, subject, topic, difficulty, examType)
      : await getNextQuestion(req.user!.userId, subject, topic, difficulty, examType, studentClass);

    const { answer: _, explanation: __, ...safeQuestion } = question;
    res.json({ success: true, data: safeQuestion, source: mode === 'practice' ? 'bank' : 'ai' });
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

    const { selections, difficulty, examType, studentClass, count, mode } = body.data;

    for (const { subject, topic } of selections) {
      if (!JEE_TOPICS[subject].includes(topic)) {
        throw new AppError(400, `Invalid topic "${topic}" for subject "${subject}"`);
      }
      const allowed = getTopicsForClass(subject, studentClass);
      if (!allowed.includes(topic)) {
        throw new AppError(400, `Topic "${topic}" is not in the Class ${studentClass} syllabus`);
      }
    }

    const questions = mode === 'practice'
      ? await getPracticeQuestionBatch(
          req.user!.userId,
          selections as Array<{ subject: import('../types/index').Subject; topic: string }>,
          difficulty,
          examType,
          count,
        )
      : await getQuestionBatch(
          req.user!.userId,
          selections as Array<{ subject: import('../types/index').Subject; topic: string }>,
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
}

// Count of validated questions in the bank, overall and per subject
export async function bankStats(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const rows = await prisma.question.groupBy({
      by: ['subject'],
      where: { validatedAt: { not: null } },
      _count: { _all: true },
    });
    const bySubject: Record<string, number> = { Physics: 0, Chemistry: 0, Mathematics: 0 };
    for (const row of rows) bySubject[row.subject] = row._count._all;
    const total = Object.values(bySubject).reduce((sum, n) => sum + n, 0);
    res.json({ success: true, data: { total, bySubject } });
  } catch (err) {
    next(err);
  }
}

export function getTopics(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    const studentClass = (req.query.studentClass as StudentClass | undefined) ?? '12';

    if (!(['11', '12', 'Dropper'] as string[]).includes(studentClass)) {
      throw new AppError(400, 'Invalid studentClass');
    }

    const subjects: Subject[] = ['Mathematics', 'Physics', 'Chemistry'];

    // Return split format: { subject: { class11: [...], class12: [...] } }
    // For class 11, class12 topics are filtered out
    const data = Object.fromEntries(
      subjects.map((s) => {
        const split = JEE_TOPICS_BY_CLASS[s];
        return [
          s,
          {
            class11: split.class11,
            class12: studentClass === '11' ? [] : split.class12,
          },
        ];
      })
    );

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

