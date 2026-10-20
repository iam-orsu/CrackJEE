import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import type { AuthRequest, Subject, Difficulty, QuestionType } from '../types/index';
import { JEE_TOPICS_BY_CLASS, NEET_TOPICS_BY_CLASS, NEET_SUBJECTS } from '../types/index';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { getNextQuestion, distributeTopicSlots, fisherYatesShuffle } from '../services/questionService';
import { scoreQuestion, getMaxMarkPerQuestion } from '../services/scoringService';
import type { Question } from '@prisma/client';

const startSchema = z.object({
  examType: z.enum(['Main', 'Advanced', 'NEET']),
  difficultyMode: z.enum(['easy', 'medium', 'hard']).default('medium'),
});

const answerSchema = z.object({
  mockQuestionId: z.string().min(1).max(36),
  answer: z.string().max(20),
  markedForReview: z.boolean().optional(),
});

/* ── Question plan ─────────────────────────────────────────────── */

interface QuestionSlot {
  subject: Subject;
  topic: string;
  difficulty: Difficulty;
  type: QuestionType;
  number: number;
  subjectIndex: number;
}

function pickDifficulty(examType: 'Main' | 'Advanced', seed: number, difficultyMode: 'easy' | 'medium' | 'hard'): Difficulty {
  if (difficultyMode === 'easy') {
    // 60% beginner, 35% intermediate, 5% advanced
    if (seed < 0.60) return 'beginner';
    if (seed < 0.95) return 'intermediate';
    return 'advanced';
  }
  if (difficultyMode === 'hard') {
    // JEE Advanced is inherently hard — skew maximally toward advanced
    if (examType === 'Advanced') return seed < 0.12 ? 'intermediate' : 'advanced';
    // JEE Main hard: 0% beginner, 25% intermediate, 75% advanced
    if (seed < 0.25) return 'intermediate';
    return 'advanced';
  }
  // medium (default): existing distribution
  if (examType === 'Advanced') return seed < 0.35 ? 'intermediate' : 'advanced';
  if (seed < 0.2) return 'beginner';
  if (seed < 0.65) return 'intermediate';
  return 'advanced';
}

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
    const allTopics = [
      ...subjectTopics.class11,
      ...subjectTopics.class12,
    ];
    // Distribute topics ensuring min 1, max 2 rule across topics
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

/* ── NEET mock generation (DeepSeek-backed, cache-first) ──────────── */

async function generateNEETMockQuestions(
  examId: string,
  userId: string,
  difficultyMode: 'easy' | 'medium' | 'hard',
): Promise<void> {
  try {
    const QUESTIONS_PER_SUBJECT = 45;

    // Build plan: 45 mcq_single slots per subject across all NEET topics
    const plan: QuestionSlot[] = [];
    let globalNum = 1;

    for (const subject of NEET_SUBJECTS) {
      const subjectTopics = NEET_TOPICS_BY_CLASS[subject]!;
      const allTopics = [...subjectTopics.class11, ...subjectTopics.class12];
      const allocatedTopics = distributeTopicSlots(allTopics, QUESTIONS_PER_SUBJECT);
      let subjectIndex = 0;

      for (const topic of allocatedTopics) {
        plan.push({
          subject,
          topic,
          difficulty: pickDifficulty('Main', Math.random(), difficultyMode),
          type: 'mcq_single',
          number: globalNum++,
          subjectIndex: subjectIndex++,
        });
      }
    }

    // Concurrency-4 matches JEE — avoids DeepSeek 429s.
    // getNextQuestion is cache-first (Redis → DB → DeepSeek), so seeded bank
    // questions are reused at no cost; DeepSeek only fires for exhausted topics.
    const results = await mapConcurrentSettled(
      plan,
      4,
      (slot) =>
        getNextQuestion(
          userId, slot.subject, slot.topic, slot.difficulty,
          'NEET', 'Dropper', [], 'mcq_single',
        ),
    );

    const seenIds = new Set<string>();
    const bySubject = new Map<Subject, string[]>();
    for (const subj of NEET_SUBJECTS) bySubject.set(subj, []);

    for (let i = 0; i < results.length; i++) {
      const r = results[i]!;
      const slot = plan[i]!;
      if (r.status === 'fulfilled' && !seenIds.has(r.value.id)) {
        seenIds.add(r.value.id);
        bySubject.get(slot.subject as Subject)!.push(r.value.id);
      }
    }

    if (seenIds.size < 20) {
      await prisma.mockExam.update({ where: { id: examId }, data: { status: 'error' } });
      return;
    }

    const questionData: Array<{
      examId: string; questionId: string; subject: string;
      questionNumber: number; subjectIndex: number;
    }> = [];
    let gNum = 1;

    for (const subj of NEET_SUBJECTS) {
      const shuffled = fisherYatesShuffle(bySubject.get(subj)!);
      let subjIdx = 0;
      for (const questionId of shuffled) {
        questionData.push({ examId, questionId, subject: subj, questionNumber: gNum++, subjectIndex: subjIdx++ });
      }
    }

    await prisma.mockExamQuestion.createMany({ data: questionData });
    await prisma.mockExam.update({ where: { id: examId }, data: { status: 'ready' } });
  } catch {
    await prisma.mockExam.update({ where: { id: examId }, data: { status: 'error' } }).catch(() => {});
  }
}

/* ── Concurrency-limited promise pool ───────────────────────────── */

async function mapConcurrentSettled<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const idx = nextIndex++;
      const item = items[idx]!;
      try {
        const val = await fn(item, idx);
        results[idx] = { status: 'fulfilled', value: val };
      } catch (err) {
        results[idx] = { status: 'rejected', reason: err };
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}

/* ── Background generation ─────────────────────────────────────── */

async function generateMockQuestions(
  examId: string,
  userId: string,
  examType: 'Main' | 'Advanced',
  difficultyMode: 'easy' | 'medium' | 'hard',
): Promise<void> {
  try {
    const plan = buildQuestionPlan(examType, difficultyMode);

    // Limit concurrent DeepSeek calls to 4 to prevent 429 rate limits and socket timeouts
    const results = await mapConcurrentSettled(
      plan,
      4,
      (slot) =>
        getNextQuestion(
          userId, slot.subject, slot.topic, slot.difficulty,
          examType, 'Dropper', [], slot.type,
        ),
    );

    const seenIds = new Set<string>();
    const fulfilledSlots: Array<{
      questionId: string;
      subject: Subject;
      type: QuestionType;
    }> = [];

    for (let i = 0; i < results.length; i++) {
      const r = results[i]!;
      const slot = plan[i]!;
      if (r.status === 'fulfilled' && !seenIds.has(r.value.id)) {
        seenIds.add(r.value.id);
        fulfilledSlots.push({
          questionId: r.value.id,
          subject: slot.subject,
          type: slot.type,
        });
      }
    }

    if (fulfilledSlots.length < 10) {
      await prisma.mockExam.update({ where: { id: examId }, data: { status: 'error' } });
      return;
    }

    // Assign randomized question numbers and indices per student:
    // Organize by standard JEE subject order (Physics, Chemistry, Mathematics).
    // Within each subject, independently Fisher-Yates shuffle questions within
    // Section A (MCQs) and Section B (Numerical/Integer) so students receive unique question sequences!
    const questionData: Array<{
      examId: string;
      questionId: string;
      subject: string;
      questionNumber: number;
      subjectIndex: number;
    }> = [];

    const subjects: Subject[] = ['Physics', 'Chemistry', 'Mathematics'];
    let globalNum = 1;

    for (const subj of subjects) {
      const subjQuestions = fulfilledSlots.filter((q) => q.subject === subj);
      // Shuffle all types together so integers, MCQ single and multi-correct are interleaved
      const orderedSubjQuestions = fisherYatesShuffle(subjQuestions);
      let subjIdx = 0;
      for (const q of orderedSubjQuestions) {
        questionData.push({
          examId,
          questionId: q.questionId,
          subject: q.subject,
          questionNumber: globalNum++,
          subjectIndex: subjIdx++,
        });
      }
    }

    await prisma.mockExamQuestion.createMany({ data: questionData });
    await prisma.mockExam.update({ where: { id: examId }, data: { status: 'ready' } });
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

    // Generation runs in the background. If the server restarted mid-way, the exam would stay
    // 'generating' forever and block new exams, so fail anything stuck for over 10 minutes.
    await prisma.mockExam.updateMany({
      where: { userId, status: 'generating', createdAt: { lt: new Date(Date.now() - 10 * 60 * 1000) } },
      data: { status: 'error' },
    });

    // If student already has an active exam of the SAME type, return it
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

    // Fire and forget — background question generation
    if (examType === 'NEET') {
      generateNEETMockQuestions(mockExam.id, userId, difficultyMode).catch(() => {});
    } else {
      generateMockQuestions(mockExam.id, userId, examType, difficultyMode).catch(() => {});
    }

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

    // Idempotent — if already started, return existing startedAt
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
    }> = {};

    for (const mq of exam.questions) {
      const q = mq.question;
      const marks = scoreQuestion(examType, q.questionType, mq.savedAnswer, q.answer);
      const maxMarks = getMaxMarkPerQuestion(examType, q.questionType);
      maxScore += maxMarks;

      if (!mq.savedAnswer) {
        unattempted++;
      } else if (marks === maxMarks) {
        correct++;
      } else if (marks > 0) {
        partial++;
      } else {
        incorrect++;
      }

      if (mq.subject === 'Physics') physicsScore += marks;
      else if (mq.subject === 'Chemistry') chemistryScore += marks;
      else if (mq.subject === 'Botany' || mq.subject === 'Zoology') biologyScore += marks;
      else mathScore += marks;

      breakdown[mq.id] = {
        questionId: mq.questionId,
        subject: mq.subject,
        submitted: mq.savedAnswer,
        correctAnswer: q.answer,
        awarded: marks,
        maxMarks,
        questionType: q.questionType,
      };
    }

    const totalScore = physicsScore + chemistryScore + mathScore + biologyScore;
    const timeTaken = exam.startedAt
      ? Math.floor((Date.now() - exam.startedAt.getTime()) / 1000)
      : exam.durationSeconds;

    const [result] = await prisma.$transaction([
      prisma.mockExamResult.create({
        data: {
          examId: id,
          totalScore,
          maxScore,
          physicsScore,
          chemistryScore,
          mathScore,
          biologyScore,
          correct,
          partial,
          incorrect,
          unattempted,
          timeTaken,
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

export async function getMockHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const exams = await prisma.mockExam.findMany({
      where: { userId },
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
