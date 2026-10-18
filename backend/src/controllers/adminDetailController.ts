import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

// Full activity for one student: profile, every practice answer, every mock exam, topic breakdown
export async function adminStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string };

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, class: true, targetExam: true, currentLevel: true, createdAt: true },
    });
    if (!user) throw new AppError(404, 'Student not found');

    const [attempts, mocks] = await Promise.all([
      prisma.studentAttempt.findMany({
        where: { userId: id },
        orderBy: { createdAt: 'desc' },
        take: 1000,
        include: {
          question: {
            select: {
              topic: true, subject: true, difficulty: true, questionType: true, examType: true,
              questionText: true, options: true, answer: true,
            },
          },
        },
      }),
      prisma.mockExam.findMany({
        where: { userId: id },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, examType: true, difficultyMode: true, status: true, createdAt: true, submittedAt: true,
          result: {
            select: {
              totalScore: true, maxScore: true, physicsScore: true, chemistryScore: true, mathScore: true,
              correct: true, incorrect: true, unattempted: true, timeTaken: true,
            },
          },
        },
      }),
    ]);

    const practice = attempts.map((a) => ({
      id: a.id,
      answeredAt: a.createdAt.toISOString(),
      subject: a.question.subject,
      topic: a.question.topic,
      difficulty: a.question.difficulty,
      questionType: a.question.questionType,
      examType: a.question.examType,
      questionText: a.question.questionText,
      options: a.question.options as string[],
      answerSubmitted: a.answerSubmitted,
      correctAnswer: a.question.answer,
      isCorrect: a.isCorrect,
      timeSpent: a.timeSpent,
    }));

    // Topic breakdown
    const topicMap = new Map<string, { subject: string; topic: string; attempts: number; correct: number }>();
    for (const p of practice) {
      const key = `${p.subject}::${p.topic}`;
      const row = topicMap.get(key) ?? { subject: p.subject, topic: p.topic, attempts: 0, correct: 0 };
      row.attempts++;
      if (p.isCorrect) row.correct++;
      topicMap.set(key, row);
    }
    const topics = [...topicMap.values()]
      .map((t) => ({ ...t, accuracy: t.attempts > 0 ? Math.round((t.correct / t.attempts) * 100) : 0 }))
      .sort((a, b) => a.accuracy - b.accuracy);

    const answered = practice.length;
    const correct = practice.filter((p) => p.isCorrect).length;

    res.json({
      success: true,
      data: {
        student: {
          id: user.id,
          name: user.name,
          email: user.email,
          class: user.class,
          targetExam: user.targetExam,
          currentLevel: user.currentLevel,
          joinedAt: user.createdAt.toISOString(),
        },
        summary: {
          answered,
          correct,
          wrong: answered - correct,
          accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0,
        },
        topics,
        practice,
        mocks: mocks.map((m) => ({
          id: m.id,
          examType: m.examType,
          difficultyMode: m.difficultyMode,
          status: m.status,
          createdAt: m.createdAt.toISOString(),
          submittedAt: m.submittedAt ? m.submittedAt.toISOString() : null,
          result: m.result,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
}

// Every question of one mock exam: what the student picked, the right answer, the marks awarded
export async function adminMock(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { examId } = req.params as { examId: string };

    const exam = await prisma.mockExam.findUnique({
      where: { id: examId },
      select: {
        id: true, examType: true, status: true, createdAt: true, submittedAt: true,
        user: { select: { name: true, email: true } },
        result: {
          select: { totalScore: true, maxScore: true, correct: true, incorrect: true, unattempted: true, timeTaken: true, scoreBreakdown: true },
        },
        questions: {
          orderBy: { questionNumber: 'asc' },
          select: {
            id: true, questionNumber: true, subject: true, savedAnswer: true, markedForReview: true,
            question: {
              select: {
                topic: true, questionType: true, difficulty: true, questionText: true,
                options: true, answer: true, explanation: true,
              },
            },
          },
        },
      },
    });
    if (!exam) throw new AppError(404, 'Exam not found');

    // scoreBreakdown is keyed by mock question id and holds the awarded marks
    const breakdown = (exam.result?.scoreBreakdown ?? {}) as Record<string, { awarded: number; maxMarks: number }>;

    res.json({
      success: true,
      data: {
        exam: {
          id: exam.id,
          examType: exam.examType,
          status: exam.status,
          createdAt: exam.createdAt.toISOString(),
          submittedAt: exam.submittedAt ? exam.submittedAt.toISOString() : null,
          studentName: exam.user.name,
          studentEmail: exam.user.email,
        },
        result: exam.result
          ? {
              totalScore: exam.result.totalScore,
              maxScore: exam.result.maxScore,
              correct: exam.result.correct,
              incorrect: exam.result.incorrect,
              unattempted: exam.result.unattempted,
              timeTaken: exam.result.timeTaken,
            }
          : null,
        questions: exam.questions.map((q) => ({
          questionNumber: q.questionNumber,
          subject: q.subject,
          topic: q.question.topic,
          difficulty: q.question.difficulty,
          questionType: q.question.questionType,
          questionText: q.question.questionText,
          options: q.question.options as string[],
          submitted: q.savedAnswer,
          correctAnswer: q.question.answer,
          explanation: q.question.explanation,
          markedForReview: q.markedForReview,
          awarded: breakdown[q.id]?.awarded ?? null,
          maxMarks: breakdown[q.id]?.maxMarks ?? null,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
}
