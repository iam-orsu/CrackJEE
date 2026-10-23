import { randomUUID } from 'crypto';
import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import type { AuthRequest } from '../types/index';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { cacheGetJson, cacheSetNx, cacheDel } from '../services/cacheService';

// Served-list keys written by the practice, AI batch and paper flows (see questionService / paperService)
const SERVED_KINDS = ['practice', 'mcq_single', 'mcq_multi', 'integer'];

// A question can only be answered if this user was actually shown it, so answers
// can't be harvested by submitting guessed question IDs
async function wasServedToUser(userId: string, questionId: string, subject: string, topic: string): Promise<boolean> {
  for (const kind of SERVED_KINDS) {
    const ids = await cacheGetJson<string[]>(`served:${userId}:${subject}:${topic}:${kind}`);
    if (ids?.includes(questionId)) return true;
  }
  const inMock = await prisma.mockExamQuestion.findFirst({
    where: { questionId, exam: { userId } },
    select: { id: true },
  });
  return !!inMock;
}

const submitSchema = z.object({
  questionId: z.string().min(1).max(64).regex(/^[a-zA-Z0-9_-]+$/),
  // mcq_single: "A" | mcq_multi: "A,C" | integer: "42"
  answer: z.string().min(1).max(100),
  timeSpent: z.number().int().min(0).max(3600),
});

// Grading lives in services/grading.ts (shared with mock scoring); re-exported for existing imports
export { checkAnswer } from '../services/grading';
import { checkAnswer } from '../services/grading';

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

    if (!(await wasServedToUser(userId, question.id, question.subject, question.topic))) {
      throw new AppError(403, 'This question is not part of your session. Open it from practice, a paper or a mock first.');
    }

    // Prevent cheating: verify this question does not belong to an active mock exam for this user
    const inActiveMock = await prisma.mockExamQuestion.findFirst({
      where: {
        questionId,
        exam: { userId, status: 'in_progress' },
      },
      select: { id: true },
    });
    if (inActiveMock) {
      throw new AppError(403, 'Cannot submit answers for questions in an active mock exam');
    }

    // Double-submit guard: a second POST for the same question within 10s is rejected, so one
    // click (or a retry) cannot record two attempts. The lock is released if the write fails.
    const lockKey = `answer-lock:${userId}:${questionId}`;
    if (!(await cacheSetNx(lockKey, 10))) {
      throw new AppError(409, 'This answer is already being submitted. Please wait a moment.');
    }

    const isCorrect = checkAnswer(question.questionType ?? 'mcq_single', answer, question.answer);

    try {
      // Attempt row and topic progress commit together or not at all
      await prisma.$transaction(async (tx) => {
        await tx.studentAttempt.create({
          data: { userId, questionId, answerSubmitted: answer, isCorrect, timeSpent },
        });
        await updateTopicProgress(tx, userId, question.topic, question.subject, isCorrect);
      });
    } catch (err) {
      await cacheDel(lockKey);
      throw err;
    }

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
  tx: Prisma.TransactionClient,
  userId: string,
  topicName: string,
  subject: string,
  isCorrect: boolean,
): Promise<void> {
  const inc = isCorrect ? 1 : 0;
  // Single atomic statement: no read-then-write race condition
  const newId = randomUUID();
  await tx.$executeRaw`
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
