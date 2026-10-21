import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import type { AuthRequest, Subject, Difficulty, QuestionType } from '../types/index';
import { JEE_TOPICS_BY_CLASS, NEET_TOPICS_BY_CLASS, NEET_SUBJECTS } from '../types/index';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { generateFreshMockBatch, distributeTopicSlots, fisherYatesShuffle } from '../services/questionService';
import { getSharedPool, setSharedPool, appendQuestionsToMasterJson } from '../services/mockPoolService';
import type { MockPoolItem } from '../services/mockPoolService';
import { scoreQuestion, getMaxMarkPerQuestion } from '../services/scoringService';

const startSchema = z.object({
  examType: z.enum(['Main', 'Advanced', 'NEET']),
  difficultyMode: z.enum(['easy', 'medium', 'hard']).default('medium'),
});

const answerSchema = z.object({
  mockQuestionId: z.string().min(1).max(36),
  answer: z.string().max(20),
  markedForReview: z.boolean().optional(),
});

/* ── Question slot type ─────────────────────────────────────────── */

interface QuestionSlot {
  subject: Subject;
  topic: string;
  difficulty: Difficulty;
  type: QuestionType;
  number: number;
  subjectIndex: number;
}

/* ── Difficulty distribution ────────────────────────────────────── */

function pickDifficulty(examType: 'Main' | 'Advanced', seed: number, difficultyMode: 'easy' | 'medium' | 'hard'): Difficulty {
  if (difficultyMode === 'easy') {
    if (seed < 0.60) return 'beginner';
    if (seed < 0.95) return 'intermediate';
    return 'advanced';
  }
  if (difficultyMode === 'hard') {
    if (examType === 'Advanced') return seed < 0.12 ? 'intermediate' : 'advanced';
    if (seed < 0.25) return 'intermediate';
    return 'advanced';
  }
  if (examType === 'Advanced') return seed < 0.35 ? 'intermediate' : 'advanced';
  if (seed < 0.2) return 'beginner';
  if (seed < 0.65) return 'intermediate';
  return 'advanced';
}

/* ── JEE question plan (kept for buildJEESlots) ─────────────────── */

function buildQuestionPlan(examType: 'Main' | 'Advanced', difficultyMode: 'easy' | 'medium' | 'hard'): QuestionSlot[] {
  const subjects: Subject[] = ['Physics', 'Chemistry', 'Mathematics'];
  const plan: QuestionSlot[] = [];
  let globalNum = 1;

  const typePlan: Array<{ type: QuestionType; count: number }> =
    examType === 'Main'
      ? [{ type: 'mcq_single', count: 20 }, { type: 'integer', count: 5 }]
      : [{ type: 'mcq_single', count: 7 }, { type: 'mcq_multi', count: 4 }, { type: 'integer', count: 6 }];

  const totalPerSubject = typePlan.reduce((sum, t) => sum + t.count, 0);

  for (const subject of subjects) {
    const subjectTopics = JEE_TOPICS_BY_CLASS[subject] ?? { class11: [], class12: [] };
    const allTopics = [...subjectTopics.class11, ...subjectTopics.class12];
    const allocatedTopics = distributeTopicSlots(allTopics, totalPerSubject);
    let topicCursor = 0;
    let subjectIndex = 0;

    for (const { type, count } of typePlan) {
      for (let i = 0; i < count; i++) {
        plan.push({
          subject,
          topic: allocatedTopics[topicCursor++]!,
          difficulty: pickDifficulty(examType, Math.random(), difficultyMode),
          type,
          number: globalNum++,
          subjectIndex: subjectIndex++,
        });
      }
    }
  }

  return plan;
}

/* ── Slot builders ──────────────────────────────────────────────── */

type SlotInput = {
  subject: Subject;
  topic: string;
  difficulty: Difficulty;
  examType: 'Main' | 'Advanced' | 'NEET';
  questionType: QuestionType;
};

function buildJEESlots(examType: 'Main' | 'Advanced', difficultyMode: 'easy' | 'medium' | 'hard'): SlotInput[] {
  return buildQuestionPlan(examType, difficultyMode).map((slot) => ({
    subject: slot.subject,
    topic: slot.topic,
    difficulty: slot.difficulty,
    examType,
    questionType: slot.type,
  }));
}

function buildNEETSlots(difficultyMode: 'easy' | 'medium' | 'hard'): SlotInput[] {
  const slots: SlotInput[] = [];
  for (const subject of NEET_SUBJECTS) {
    const allTopics = [
      ...NEET_TOPICS_BY_CLASS[subject]!.class11,
      ...NEET_TOPICS_BY_CLASS[subject]!.class12,
    ];
    for (const topic of distributeTopicSlots(allTopics, 45)) {
      slots.push({
        subject,
        topic,
        difficulty: pickDifficulty('Main', Math.random(), difficultyMode),
        examType: 'NEET',
        questionType: 'mcq_single',
      });
    }
  }
  return slots;
}

/* ── Overlap check ──────────────────────────────────────────────── */

async function getOverlapRatio(userId: string, examType: string, poolIds: string[]): Promise<number> {
  if (poolIds.length === 0) return 0;
  const past = await prisma.mockExamQuestion.findMany({
    where: { exam: { userId, examType } },
    select: { questionId: true },
  });
  const seen = new Set(past.map((r) => r.questionId));
  return poolIds.filter((id) => seen.has(id)).length / poolIds.length;
}

/* ── Fresh generation + pool save ──────────────────────────────── */

function expectedPerSubject(examType: 'Main' | 'Advanced' | 'NEET'): number {
  if (examType === 'NEET') return 45;
  if (examType === 'Advanced') return 17;
  return 25;
}

async function generateAndSavePool(
  examType: 'Main' | 'Advanced' | 'NEET',
  difficultyMode: 'easy' | 'medium' | 'hard',
  saveToSharedPool: boolean,
): Promise<MockPoolItem[]> {
  const slots = examType === 'NEET'
    ? buildNEETSlots(difficultyMode)
    : buildJEESlots(examType, difficultyMode);

  let questions = await generateFreshMockBatch(slots, 4);

  // Top-up pass: detect short subjects and generate extra slots to fill gaps
  const expected = expectedPerSubject(examType);
  const subjectCounts = new Map<string, number>();
  for (const q of questions) subjectCounts.set(q.subject, (subjectCounts.get(q.subject) ?? 0) + 1);

  const topUpSlots: SlotInput[] = [];
  for (const slot of slots) {
    const current = subjectCounts.get(slot.subject) ?? 0;
    if (current < expected) {
      topUpSlots.push(slot);
      subjectCounts.set(slot.subject, current + 1);
    }
  }

  if (topUpSlots.length > 0) {
    console.log(`[mockPool] Top-up: generating ${topUpSlots.length} extra slots for short subjects`);
    const extras = await generateFreshMockBatch(topUpSlots, 4);
    questions = [...questions, ...extras];
  }

  const items: MockPoolItem[] = questions.map((q) => ({
    questionId: q.id,
    subject: q.subject,
    questionType: q.questionType,
  }));

  if (saveToSharedPool && items.length >= 20) {
    await setSharedPool(examType, difficultyMode, items);
  }

  // Append to master JSON in background — never block mock generation
  appendQuestionsToMasterJson(examType, questions).catch(() => {});

  return items;
}

/* ── Assign question numbers and persist rows ───────────────────── */

async function createExamQuestionsFromPool(
  examId: string,
  examType: 'Main' | 'Advanced' | 'NEET',
  items: MockPoolItem[],
): Promise<void> {
  const subjects: Subject[] =
    examType === 'NEET' ? [...NEET_SUBJECTS] : ['Physics', 'Chemistry', 'Mathematics'];

  const bySubject = new Map<string, MockPoolItem[]>();
  for (const s of subjects) bySubject.set(s, []);
  for (const item of items) {
    bySubject.get(item.subject)?.push(item);
  }

  const questionData: Array<{
    examId: string; questionId: string; subject: string;
    questionNumber: number; subjectIndex: number;
  }> = [];
  let gNum = 1;

  for (const subj of subjects) {
    const subjItems = fisherYatesShuffle(bySubject.get(subj) ?? []);
    let subjIdx = 0;
    for (const item of subjItems) {
      questionData.push({
        examId, questionId: item.questionId, subject: subj,
        questionNumber: gNum++, subjectIndex: subjIdx++,
      });
    }
  }

  await prisma.mockExamQuestion.createMany({ data: questionData });
  await prisma.mockExam.update({ where: { id: examId }, data: { status: 'ready' } });
}

/* ── Unified background generator ──────────────────────────────── */

async function runMockGeneration(
  examId: string,
  userId: string,
  examType: 'Main' | 'Advanced' | 'NEET',
  difficultyMode: 'easy' | 'medium' | 'hard',
): Promise<void> {
  try {
    let poolItems: MockPoolItem[];
    const sharedPool = await getSharedPool(examType, difficultyMode);

    if (sharedPool && sharedPool.length >= 20) {
      const overlap = await getOverlapRatio(userId, examType, sharedPool.map((p) => p.questionId));
      if (overlap <= 0.30) {
        // Reuse shared pool — shuffle gives this student a unique order
        poolItems = sharedPool;
      } else {
        // >30% overlap: generate fresh for this student, keep shared pool intact
        poolItems = await generateAndSavePool(examType, difficultyMode, false);
      }
    } else {
      // No pool yet — generate fresh and publish as the shared pool
      poolItems = await generateAndSavePool(examType, difficultyMode, true);
    }

    if (poolItems.length < 10) {
      await prisma.mockExam.update({ where: { id: examId }, data: { status: 'error' } });
      return;
    }

    await createExamQuestionsFromPool(examId, examType, poolItems);
  } catch {
    await prisma.mockExam.update({ where: { id: examId }, data: { status: 'error' } }).catch(() => {});
  }
}

/* ── Controllers ───────────────────────────────────────────────── */

export async function startMock(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = startSchema.safeParse(req.body);
    if (!body.success) throw new AppError(400, body.error.errors[0]?.message ?? 'Invalid input');

    const { examType, difficultyMode } = body.data;
    const userId = req.user!.userId;

    // Fail exams stuck in 'generating' for >10 minutes (e.g. after server restart)
    await prisma.mockExam.updateMany({
      where: { userId, status: 'generating', createdAt: { lt: new Date(Date.now() - 10 * 60 * 1000) } },
      data: { status: 'error' },
    });

    // If student already has an active exam of the same type, return it
    const active = await prisma.mockExam.findFirst({
      where: { userId, examType, status: { in: ['generating', 'ready', 'in_progress'] } },
      orderBy: { createdAt: 'desc' },
    });
    if (active) {
      res.json({ success: true, data: { id: active.id, status: active.status } });
      return;
    }

    const mockExam = await prisma.mockExam.create({
      data: { userId, examType, difficultyMode, status: 'generating', durationSeconds: 10800 },
    });

    // Fire and forget — runMockGeneration handles pool hit/miss + fresh generation
    runMockGeneration(mockExam.id, userId, examType, difficultyMode).catch(() => {});

    res.json({ success: true, data: { id: mockExam.id, status: 'generating' } });
  } catch (err) {
    next(err);
  }
}

export async function getMock(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.userId;

    const exam = await prisma.mockExam.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            question: {
              select: {
                id: true,
                questionText: true,
                questionType: true,
                options: true,
                subject: true,
                topic: true,
                difficulty: true,
                diagram: true,
              },
            },
          },
          orderBy: { questionNumber: 'asc' },
        },
      },
    });

    if (!exam || exam.userId !== userId) throw new AppError(404, 'Exam not found');

    const questions = exam.questions.map((mq) => ({
      mockQuestionId: mq.id,
      questionNumber: mq.questionNumber,
      subjectIndex: mq.subjectIndex,
      subject: mq.subject,
      savedAnswer: mq.savedAnswer,
      markedForReview: mq.markedForReview,
      questionText: mq.question.questionText,
      questionType: mq.question.questionType,
      options: mq.question.options as string[],
      topic: mq.question.topic,
      difficulty: mq.question.difficulty,
      diagram: mq.question.diagram,
    }));

    let timeLeft: number | undefined;
    if (exam.startedAt && exam.status === 'in_progress') {
      const elapsed = Math.floor((Date.now() - exam.startedAt.getTime()) / 1000);
      timeLeft = Math.max(0, exam.durationSeconds - elapsed);
    }

    res.json({
      success: true,
      data: {
        id: exam.id,
        examType: exam.examType,
        status: exam.status,
        durationSeconds: exam.durationSeconds,
        startedAt: exam.startedAt?.toISOString() ?? null,
        submittedAt: exam.submittedAt?.toISOString() ?? null,
        timeLeft,
        questions,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function beginMock(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.userId;

    const exam = await prisma.mockExam.findUnique({ where: { id } });
    if (!exam || exam.userId !== userId) throw new AppError(404, 'Exam not found');

    if (exam.startedAt) {
      res.json({ success: true, data: { startedAt: exam.startedAt.toISOString() } });
      return;
    }

    if (exam.status !== 'ready') throw new AppError(400, 'Exam is not ready to start');

    const updated = await prisma.mockExam.update({
      where: { id },
      data: { status: 'in_progress', startedAt: new Date() },
    });

    res.json({ success: true, data: { startedAt: updated.startedAt!.toISOString() } });
  } catch (err) {
    next(err);
  }
}

export async function saveAnswer(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.userId;

    const body = answerSchema.safeParse(req.body);
    if (!body.success) throw new AppError(400, 'Invalid input');

    const { mockQuestionId, answer, markedForReview } = body.data;

    const exam = await prisma.mockExam.findUnique({ where: { id }, select: { userId: true, status: true } });
    if (!exam || exam.userId !== userId) throw new AppError(404, 'Exam not found');
    if (exam.status !== 'in_progress') throw new AppError(400, 'Exam not in progress');

    const updated = await prisma.mockExamQuestion.updateMany({
      where: { id: mockQuestionId, examId: id },
      data: {
        savedAnswer: answer || null,
        ...(markedForReview !== undefined ? { markedForReview } : {}),
      },
    });

    if (updated.count === 0) throw new AppError(404, 'Question not found in this exam');

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function submitMock(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.userId;
    const questionTimes: Record<string, number> = (req.body as { questionTimes?: Record<string, number> })?.questionTimes ?? {};

    const exam = await prisma.mockExam.findUnique({
      where: { id },
      include: { questions: { include: { question: true } } },
    });

    if (!exam || exam.userId !== userId) throw new AppError(404, 'Exam not found');
    if (exam.status === 'submitted') {
      const existing = await prisma.mockExamResult.findUnique({ where: { examId: id } });
      if (existing) {
        res.json({ success: true, data: { resultId: existing.id } });
        return;
      }
      throw new AppError(400, 'Already submitted');
    }
    if (exam.status !== 'in_progress') throw new AppError(400, 'Exam not started');

    const examType = exam.examType as 'Main' | 'Advanced' | 'NEET';
    let physicsScore = 0, chemistryScore = 0, mathScore = 0, biologyScore = 0;
    let correct = 0, partial = 0, incorrect = 0, unattempted = 0, maxScore = 0;
    const breakdown: Record<string, {
      questionId: string; subject: string;
      submitted: string | null; correctAnswer: string;
      awarded: number; maxMarks: number; questionType: string;
      timeSpentSeconds: number;
    }> = {};

    for (const mq of exam.questions) {
      const q = mq.question;
      const marks = scoreQuestion(examType, q.questionType, mq.savedAnswer, q.answer);
      const maxMarks = getMaxMarkPerQuestion(examType, q.questionType);
      maxScore += maxMarks;

      if (!mq.savedAnswer) unattempted++;
      else if (marks === maxMarks) correct++;
      else if (marks > 0) partial++;
      else incorrect++;

      if (mq.subject === 'Physics') physicsScore += marks;
      else if (mq.subject === 'Chemistry') chemistryScore += marks;
      else if (mq.subject === 'Botany' || mq.subject === 'Zoology') biologyScore += marks;
      else mathScore += marks;

      breakdown[mq.id] = {
        questionId: mq.questionId, subject: mq.subject,
        submitted: mq.savedAnswer, correctAnswer: q.answer,
        awarded: marks, maxMarks, questionType: q.questionType,
        timeSpentSeconds: questionTimes[mq.id] ?? 0,
      };
    }

    const totalScore = physicsScore + chemistryScore + mathScore + biologyScore;
    const timeTaken = exam.startedAt
      ? Math.floor((Date.now() - exam.startedAt.getTime()) / 1000)
      : exam.durationSeconds;

    const [result] = await prisma.$transaction([
      prisma.mockExamResult.create({
        data: {
          examId: id, totalScore, maxScore,
          physicsScore, chemistryScore, mathScore, biologyScore,
          correct, partial, incorrect, unattempted, timeTaken,
          scoreBreakdown: breakdown,
        },
      }),
      prisma.mockExam.update({
        where: { id },
        data: { status: 'submitted', submittedAt: new Date() },
      }),
    ]);

    res.json({ success: true, data: { resultId: result.id } });
  } catch (err) {
    next(err);
  }
}

export async function getMockResult(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.userId;

    const exam = await prisma.mockExam.findUnique({
      where: { id },
      include: {
        result: true,
        questions: {
          include: {
            question: {
              select: {
                id: true, questionText: true, questionType: true,
                options: true, explanation: true, answer: true,
                subject: true, topic: true, difficulty: true,
              },
            },
          },
          orderBy: { questionNumber: 'asc' },
        },
      },
    });

    if (!exam || exam.userId !== userId) throw new AppError(404, 'Exam not found');
    if (!exam.result) throw new AppError(404, 'Result not yet available');

    const questions = exam.questions.map((mq) => ({
      mockQuestionId: mq.id,
      questionId: mq.questionId,
      questionNumber: mq.questionNumber,
      subjectIndex: mq.subjectIndex,
      subject: mq.subject,
      savedAnswer: mq.savedAnswer,
      markedForReview: mq.markedForReview,
      questionText: mq.question.questionText,
      questionType: mq.question.questionType,
      options: mq.question.options as string[],
      topic: mq.question.topic,
      difficulty: mq.question.difficulty,
      explanation: mq.question.explanation,
      answer: mq.question.answer,
    }));

    res.json({ success: true, data: { exam: { ...exam, questions }, result: exam.result } });
  } catch (err) {
    next(err);
  }
}

export async function cancelMock(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.userId;

    const exam = await prisma.mockExam.findUnique({ where: { id }, select: { userId: true, status: true } });
    if (!exam || exam.userId !== userId) throw new AppError(404, 'Exam not found');
    if (exam.status === 'submitted') throw new AppError(400, 'Cannot cancel a submitted exam');

    await prisma.mockExam.update({ where: { id }, data: { status: 'error' } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function getMockHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const exams = await prisma.mockExam.findMany({
      where: { userId, status: { not: 'error' } },
      select: {
        id: true, examType: true, difficultyMode: true, status: true, createdAt: true, submittedAt: true,
        result: { select: { totalScore: true, maxScore: true, correct: true, partial: true, incorrect: true, unattempted: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json({ success: true, data: exams });
  } catch (err) {
    next(err);
  }
}
