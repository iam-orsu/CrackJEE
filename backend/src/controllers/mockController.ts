import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import type { AuthRequest, Subject, Difficulty, QuestionType } from '../types/index';
import { JEE_TOPICS_BY_CLASS, NEET_TOPICS_BY_CLASS, NEET_SUBJECTS } from '../types/index';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { generateFreshMockBatch, distributeTopicSlots, fisherYatesShuffle } from '../services/questionService';
import { findStoredPaper, saveStoredPaper } from '../services/mockPaperService';
import { loadTopicHistory, type SubjectHistory } from '../services/mockTopicHistory';
import { planSubjectTopics, fullTopicList, paperFitsPlan } from '../services/mockTopicPlan';
import { topicStats, strongAndWeak, topMarksLost, negativeAnalysis, timeByType, subjectOrder, cutoffComparison } from '../services/mockInsights';
import { cutoffsFor } from '../services/examCutoffs';
import { loadExamMockData } from '../services/mockInsightsData';
import type { MockPoolItem } from '../services/mockPaperService';
import { cacheSetNx, cacheDel } from '../services/cacheService';
import { runOnce } from '../lib/distributedOnce';
import { logger } from '../lib/logger';
import { scoreQuestion, getMaxMarkPerQuestion } from '../services/scoringService';

// Allowance for network latency: answers saved this long after the deadline still count
const ANSWER_GRACE_MS = 15_000;
// A generation still "generating" after this long is dead (its process crashed or was stopped)
export const STUCK_GENERATION_MS = 20 * 60 * 1000;

/** True once the exam's time (plus grace) is up. Answers saved after this are rejected. */
export function isExamExpired(
  startedAt: Date | null,
  durationSeconds: number,
  now: number = Date.now(),
  graceMs: number = ANSWER_GRACE_MS,
): boolean {
  if (!startedAt) return false;
  return now > startedAt.getTime() + durationSeconds * 1000 + graceMs;
}

// Background generations started by this process. Shutdown waits for them instead of killing them.
const activeGenerations = new Set<Promise<void>>();

/** Resolves when every background generation started by this process has finished (or the timeout hits). */
export async function waitForActiveGenerations(timeoutMs: number): Promise<void> {
  if (activeGenerations.size === 0) return;
  logger.info({ count: activeGenerations.size }, 'Waiting for mock generations to finish');
  await Promise.race([
    Promise.allSettled([...activeGenerations]),
    new Promise((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}

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

// topicsBySubject gives one topic per question slot for each subject, from the student's topic rotation
function buildQuestionPlan(
  examType: 'Main' | 'Advanced',
  difficultyMode: 'easy' | 'medium' | 'hard',
  topicsBySubject: Record<string, string[]>,
): QuestionSlot[] {
  const subjects: Subject[] = ['Physics', 'Chemistry', 'Mathematics'];
  const plan: QuestionSlot[] = [];
  let globalNum = 1;

  const typePlan: Array<{ type: QuestionType; count: number }> =
    examType === 'Main'
      ? [{ type: 'mcq_single', count: 20 }, { type: 'integer', count: 5 }]
      : [{ type: 'mcq_single', count: 7 }, { type: 'mcq_multi', count: 4 }, { type: 'integer', count: 6 }];

  for (const subject of subjects) {
    const allocatedTopics = topicsBySubject[subject] ?? [];
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

function buildJEESlots(
  examType: 'Main' | 'Advanced',
  difficultyMode: 'easy' | 'medium' | 'hard',
  topicsBySubject: Record<string, string[]>,
): SlotInput[] {
  return buildQuestionPlan(examType, difficultyMode, topicsBySubject).map((slot) => ({
    subject: slot.subject,
    topic: slot.topic,
    difficulty: slot.difficulty,
    examType,
    questionType: slot.type,
  }));
}

function buildNEETSlots(difficultyMode: 'easy' | 'medium' | 'hard', topicsBySubject: Record<string, string[]>): SlotInput[] {
  const slots: SlotInput[] = [];
  for (const subject of NEET_SUBJECTS) {
    for (const topic of topicsBySubject[subject] ?? []) {
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

/* ── Fresh generation ──────────────────────────────────────────── */

function expectedPerSubject(examType: 'Main' | 'Advanced' | 'NEET'): number {
  if (examType === 'NEET') return 45;
  if (examType === 'Advanced') return 17;
  return 25;
}

async function generateFreshPaper(
  examType: 'Main' | 'Advanced' | 'NEET',
  difficultyMode: 'easy' | 'medium' | 'hard',
  topicsBySubject: Record<string, string[]>,
): Promise<MockPoolItem[]> {
  const slots = examType === 'NEET'
    ? buildNEETSlots(difficultyMode, topicsBySubject)
    : buildJEESlots(examType, difficultyMode, topicsBySubject);

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
    logger.info({ slots: topUpSlots.length }, '[mockPool] Top-up: generating extra slots for short subjects');
    const extras = await generateFreshMockBatch(topUpSlots, 4);
    questions = [...questions, ...extras];
  }

  return questions.map((q) => ({
    questionId: q.id,
    subject: q.subject,
    questionType: q.questionType,
    topic: q.topic,
  }));
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

// Stops two quick clicks (or two instances) from both creating an exam for the same student and type
async function withStartLock<T>(userId: string, examType: string, task: () => Promise<T>): Promise<T> {
  const key = `lock:mockstart:${userId}:${examType}`;
  if (!(await cacheSetNx(key, 15))) {
    throw new AppError(409, 'Your exam is already being created. Please wait a moment.');
  }
  try {
    return await task();
  } finally {
    await cacheDel(key);
  }
}

/**
 * For each subject: the topics of this mock's questions, and the fit rule a stored paper must meet.
 * Fresh topics come from the rotation; the weak topic from the last mock is included once.
 */
function planMockTopics(
  examType: 'Main' | 'Advanced' | 'NEET',
  history: Record<string, SubjectHistory>,
): {
  topicsBySubject: Record<string, string[]>;
  fit: Record<string, { covered: Set<string>; weakTopic: string | null }>;
} {
  const subjects: string[] = examType === 'NEET' ? [...NEET_SUBJECTS] : ['Physics', 'Chemistry', 'Mathematics'];
  const count = expectedPerSubject(examType);
  const topicsBySubject: Record<string, string[]> = {};
  const fit: Record<string, { covered: Set<string>; weakTopic: string | null }> = {};
  for (const subject of subjects) {
    const past = history[subject] ?? { covered: new Set<string>(), weakTopic: null };
    const subjectPlan = planSubjectTopics(fullTopicList(examType, subject), past.covered, past.weakTopic, count);
    topicsBySubject[subject] = subjectPlan.questionTopics;
    fit[subject] = { covered: subjectPlan.covered, weakTopic: subjectPlan.weakTopic };
  }
  return { topicsBySubject, fit };
}

async function runMockGeneration(
  examId: string,
  userId: string,
  examType: 'Main' | 'Advanced' | 'NEET',
  difficultyMode: 'easy' | 'medium' | 'hard',
): Promise<void> {
  try {
    // Prefer a stored paper this student has not mostly taken. Only when none fits is a new paper generated,
    // and it is stored so later students of this exam and difficulty can be given it.
    // The student's topic rotation decides which topics this paper uses; a stored paper is reused only if it fits
    const history = await loadTopicHistory(userId, examType);
    const plan = planMockTopics(examType, history);
    const reuse = () => findStoredPaper(examType, difficultyMode, (items) => paperFitsPlan(items, plan.fit));

    let poolItems: MockPoolItem[] | null = await reuse();
    if (!poolItems) {
      // Concurrent starts for the same exam and difficulty share one generation
      poolItems = await runOnce<MockPoolItem[]>(`mockpaper:gen:${examType}:${difficultyMode}`, {
        lockSeconds: 900,
        waitMs: 7 * 60 * 1000,
        readShared: reuse,
        produce: async () => {
          const stored = await reuse();
          if (stored) return stored;
          const fresh = await generateFreshPaper(examType, difficultyMode, plan.topicsBySubject);
          await saveStoredPaper(examType, difficultyMode, fresh);
          return fresh;
        },
      });
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

    const started = await withStartLock(userId, examType, async () => {
      // Fail exams stuck in 'generating' for >10 minutes (e.g. after server restart)
      await prisma.mockExam.updateMany({
        where: { userId, status: 'generating', createdAt: { lt: new Date(Date.now() - STUCK_GENERATION_MS) } },
        data: { status: 'error' },
      });

      // One exam at a time: the student must terminate (or finish) the one in progress before starting another
      const active = await prisma.mockExam.findFirst({
        where: { userId, status: { in: ['generating', 'ready', 'in_progress'] } },
        orderBy: { createdAt: 'desc' },
      });
      if (active) {
        throw new AppError(409, 'You have an exam in progress. Terminate it before starting a new one.');
      }

      const exam = await prisma.mockExam.create({
        data: { userId, examType, difficultyMode, status: 'generating', durationSeconds: 10800 },
      });
      return { exam, isNew: true };
    });

    // Fire and forget — runMockGeneration handles pool hit/miss + fresh generation
    if (started.isNew) {
      const job = runMockGeneration(started.exam.id, userId, examType, difficultyMode).catch(() => {});
      activeGenerations.add(job);
      void job.finally(() => activeGenerations.delete(job));
    }

    res.json({ success: true, data: { id: started.exam.id, status: started.exam.status } });
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

    // Conditional update: only one concurrent begin can move the exam from 'ready' to 'in_progress'
    const startedAt = new Date();
    const claimed = await prisma.mockExam.updateMany({
      where: { id, userId, status: 'ready', startedAt: null },
      data: { status: 'in_progress', startedAt },
    });
    if (claimed.count === 0) {
      // Another request won the race — return its start time if it set one
      const current = await prisma.mockExam.findUnique({ where: { id }, select: { startedAt: true } });
      if (current?.startedAt) {
        res.json({ success: true, data: { startedAt: current.startedAt.toISOString() } });
        return;
      }
      throw new AppError(400, 'Exam is not ready to start');
    }

    res.json({ success: true, data: { startedAt: startedAt.toISOString() } });
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

    const exam = await prisma.mockExam.findUnique({
      where: { id },
      select: { userId: true, status: true, startedAt: true, durationSeconds: true },
    });
    if (!exam || exam.userId !== userId) throw new AppError(404, 'Exam not found');
    if (exam.status !== 'in_progress') throw new AppError(400, 'Exam not in progress');
    // The server enforces the clock: the client timer is only a display
    if (isExamExpired(exam.startedAt, exam.durationSeconds)) throw new AppError(400, 'Time is up. Answers can no longer be changed.');

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
      ? Math.min(Math.floor((Date.now() - exam.startedAt.getTime()) / 1000), exam.durationSeconds)
      : exam.durationSeconds;

    let resultId: string;
    try {
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
      resultId = result.id;
    } catch (err) {
      // Two submits raced (double click, retry): the unique examId rejected the second one.
      // Return the result the first submit created instead of an error.
      if ((err as { code?: string }).code === 'P2002') {
        const existing = await prisma.mockExamResult.findUnique({ where: { examId: id } });
        if (existing) {
          res.json({ success: true, data: { resultId: existing.id } });
          return;
        }
      }
      throw err;
    }

    res.json({ success: true, data: { resultId } });
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

// GET /api/mock/:id/insights — analytics for one submitted exam, shown on its result page
export async function getExamInsights(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const exam = await loadExamMockData(req.user!.userId, id);
    if (!exam) throw new AppError(404, 'Result not yet available');
    const { records } = exam;

    const stats = topicStats(records);
    const { weak } = strongAndWeak(stats);
    const cutoffs = cutoffsFor(exam.examType);
    res.json({
      success: true,
      data: {
        cutoffs: cutoffs && exam.scorePct !== null
          ? { name: cutoffs.name, sources: cutoffs.sources, lines: cutoffComparison(exam.scorePct, cutoffs.lines) }
          : null,
        topics: [...stats].sort((a, b) => a.accuracy - b.accuracy || b.marksLost - a.marksLost),
        weakTopics: weak,
        marksLostTopics: topMarksLost(stats),
        negatives: negativeAnalysis(records),
        timeByType: timeByType(records),
        subjectOrder: subjectOrder(records),
      },
    });
  } catch (err) {
    next(err);
  }
}
