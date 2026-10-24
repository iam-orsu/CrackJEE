import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import type { AuthRequest, Subject } from '../types/index';
import { JEE_TOPICS, getTopicsForClass } from '../types/index';
import { AppError } from '../middleware/errorHandler';
import { buildPaperPage, fetchPaperQuestions, claimPaper, PAPER_PAGE_SIZE } from '../services/paperService';

const selectionSchema = z.object({
  subject: z.enum(['Mathematics', 'Physics', 'Chemistry']),
  topic: z.string().min(1).max(100),
});

const papersSchema = z.object({
  selections: z.array(selectionSchema).min(1).max(150),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'mixed']).default('mixed'),
  examType: z.enum(['Main', 'Advanced', 'Both']).default('Main'),
  studentClass: z.enum(['11', '12', 'Dropper']).default('12'),
  perSubject: z.number().int().min(1).max(30).default(10),
  // Papers come in pages of PAPER_PAGE_SIZE; 1000 pages cover the 10,000 papers each student can page through
  page: z.number().int().min(1).max(1000).default(1),
});

const claimSchema = z.object({
  questionIds: z.array(z.string().min(1).max(64).regex(/^[a-zA-Z0-9_-]+$/)).min(1).max(150),
});

// POST /api/questions/papers — preview one page of distinct papers (marks nothing as served)
export async function previewPapers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = papersSchema.safeParse(req.body);
    if (!body.success) {
      throw new AppError(400, body.error.errors[0]?.message ?? 'Invalid parameters');
    }
    const { selections, difficulty, examType, studentClass, perSubject, page } = body.data;

    for (const { subject, topic } of selections) {
      if (!JEE_TOPICS[subject].includes(topic)) {
        throw new AppError(400, `Invalid topic "${topic}" for subject "${subject}"`);
      }
      if (!getTopicsForClass(subject, studentClass).includes(topic)) {
        throw new AppError(400, `Topic "${topic}" is not in the Class ${studentClass} syllabus`);
      }
    }

    const result = await buildPaperPage(
      req.user!.userId,
      {
        selections: selections as Array<{ subject: Subject; topic: string }>,
        difficulty,
        examType,
        perSubject,
      },
      page,
    );

    const allIds = result.papers.flat();
    const questions = await fetchPaperQuestions(allIds);
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
}

// POST /api/questions/papers/claim — start the chosen paper and mark its questions as served
export async function claimPapers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = claimSchema.safeParse(req.body);
    if (!body.success) {
      throw new AppError(400, body.error.errors[0]?.message ?? 'Invalid input');
    }

    const questions = await claimPaper(req.user!.userId, body.data.questionIds);
    if (questions.length === 0) {
      throw new AppError(404, 'None of these questions are available any more. Pick another paper.');
    }

    const safe = questions.map(({ answer: _, explanation: __, ...q }) => q);
    res.json({ success: true, data: safe, source: 'bank' });
  } catch (err) {
    next(err);
  }
}
