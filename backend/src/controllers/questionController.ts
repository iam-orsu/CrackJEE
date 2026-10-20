import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import type { AuthRequest } from '../types/index';
import { JEE_TOPICS, JEE_TOPICS_BY_CLASS, NEET_TOPICS, NEET_TOPICS_BY_CLASS, getTopicsForClass } from '../types/index';
import type { Subject, StudentClass } from '../types/index';
import { getNextQuestion, getQuestionBatch, getPracticeQuestion, getPracticeQuestionBatch } from '../services/questionService';
import { AppError } from '../middleware/errorHandler';
import { prisma } from '../lib/prisma';

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

export async function nextQuestion(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = nextQuestionSchema.safeParse(req.query);
    if (!query.success) {
      throw new AppError(400, query.error.errors[0]?.message ?? 'Invalid parameters');
    }

    const { subject, topic, difficulty, examType, studentClass, mode } = query.data;

    const isNEET = examType === 'NEET' || subject === 'Botany' || subject === 'Zoology';
    const topicList = isNEET ? (NEET_TOPICS[subject] ?? []) : (JEE_TOPICS[subject] ?? []);
    if (!topicList.includes(topic)) {
      throw new AppError(400, `Invalid topic "${topic}" for subject "${subject}"`);
    }

    if (!isNEET) {
      const allowedTopics = getTopicsForClass(subject as import('../types/index').Subject, studentClass);
      if (!allowedTopics.includes(topic)) {
        throw new AppError(400, `Topic "${topic}" is not in the Class ${studentClass} syllabus`);
      }
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
      const isNEET = examType === 'NEET' || subject === 'Botany' || subject === 'Zoology';
      const topicList = isNEET ? (NEET_TOPICS[subject] ?? []) : (JEE_TOPICS[subject] ?? []);
      if (!topicList.includes(topic)) {
        throw new AppError(400, `Invalid topic "${topic}" for subject "${subject}"`);
      }
      if (!isNEET) {
        const allowed = getTopicsForClass(subject as import('../types/index').Subject, studentClass);
        if (!allowed.includes(topic)) {
          throw new AppError(400, `Topic "${topic}" is not in the Class ${studentClass} syllabus`);
        }
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

// Count of validated questions in the bank, overall and per subject.
// Optional query param: examType=NEET|Main|Advanced — filters to that exam type only.
export async function bankStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const examTypeFilter = req.query.examType as string | undefined;
    const rows = await prisma.question.groupBy({
      by: ['subject'],
      where: {
        validatedAt: { not: null },
        ...(examTypeFilter ? { examType: examTypeFilter } : {}),
      },
      _count: { _all: true },
    });
    const bySubject: Record<string, number> = { Physics: 0, Chemistry: 0, Mathematics: 0, Botany: 0, Zoology: 0 };
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
    const examMode = (req.query.examMode as string | undefined) ?? 'JEE';

    if (!(['11', '12', 'Dropper'] as string[]).includes(studentClass)) {
      throw new AppError(400, 'Invalid studentClass');
    }

    if (examMode === 'NEET') {
      // NEET: return all 4 subjects with class11/class12 split, no class-based filtering
      const data = Object.fromEntries(
        ['Physics', 'Chemistry', 'Botany', 'Zoology'].map((s) => {
          const split = NEET_TOPICS_BY_CLASS[s]!;
          return [s, { class11: split.class11, class12: split.class12 }];
        })
      );
      res.json({ success: true, data });
      return;
    }

    const subjects: Subject[] = ['Mathematics', 'Physics', 'Chemistry'];

    // Return split format: { subject: { class11: [...], class12: [...] } }
    // For class 11, class12 topics are filtered out
    const data = Object.fromEntries(
      subjects.map((s) => {
        const split = JEE_TOPICS_BY_CLASS[s] ?? { class11: [], class12: [] };
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

