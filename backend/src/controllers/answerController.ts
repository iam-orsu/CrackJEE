import { randomUUID } from 'crypto';
import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import type { AuthRequest } from '../types/index';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

const submitSchema = z.object({
  questionId: z.string().min(1).max(36).regex(/^[a-z0-9]+$/),
  // mcq_single: "A" | mcq_multi: "A,C" | integer: "42"
  answer: z.string().min(1).max(20),
  timeSpent: z.number().int().min(0).max(3600),
});

function checkAnswer(questionType: string, submitted: string, correct: string): boolean {
  if (questionType === 'mcq_multi') {
    const sub = new Set(submitted.toUpperCase().split(',').map((s) => s.trim()).filter(Boolean));
    const cor = new Set(correct.toUpperCase().split(',').map((s) => s.trim()).filter(Boolean));
    if (sub.size !== cor.size) return false;
    for (const v of sub) if (!cor.has(v)) return false;
    return true;
  }
  if (questionType === 'integer') {
    return submitted.trim() === correct.trim();
  }
  return submitted.toUpperCase() === correct.toUpperCase();
}

export async function submitAnswer(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = submitSchema.safeParse(req.body);
    if (!body.success) {
      throw new AppError(400, body.error.errors[0]?.message ?? 'Invalid input');
    }

    const { questionId, answer, timeSpent } = body.data;
    const userId = req.user!.userId;

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) throw new AppError(404, 'Question not found');

    const isCorrect = checkAnswer(question.questionType ?? 'mcq_single', answer, question.answer);

    await prisma.studentAttempt.create({
      data: { userId, questionId, answerSubmitted: answer, isCorrect, timeSpent },
    });

    // Update topic progress
    await updateTopicProgress(userId, question.topic, question.subject, isCorrect);

    res.json({
      success: true,
      data: {
        isCorrect,
        correctAnswer: question.answer,
        explanation: question.explanation,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function updateTopicProgress(
  userId: string,
  topicName: string,
  subject: string,
  isCorrect: boolean,
): Promise<void> {
  const inc = isCorrect ? 1 : 0;
  // Single atomic statement: no read-then-write race condition
  const newId = randomUUID();
  await prisma.$executeRaw`
    INSERT INTO "TopicProgress" (
      "id", "userId", "topicName", "subject",
      "attempts", "correctCount", "successRate", "markedAsWeak", "lastAttemptAt"
    )
    VALUES (
      ${newId}, ${userId}, ${topicName}, ${subject},
      1, ${inc}, ${inc}::float8, false, now()
    )
    ON CONFLICT ("userId", "topicName") DO UPDATE SET
      "attempts"     = "TopicProgress"."attempts" + 1,
      "correctCount" = "TopicProgress"."correctCount" + ${inc},
      "successRate"  = ("TopicProgress"."correctCount" + ${inc})::float8
                       / ("TopicProgress"."attempts" + 1),
      "markedAsWeak" = ("TopicProgress"."attempts" + 1 >= 3)
                       AND (
                         ("TopicProgress"."correctCount" + ${inc})::float8
                         / ("TopicProgress"."attempts" + 1) < 0.6
                       ),
      "lastAttemptAt" = now()
  `;
}
