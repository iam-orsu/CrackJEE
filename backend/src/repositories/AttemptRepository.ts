import { randomUUID } from 'crypto';
import type { PrismaClient } from '@prisma/client';
import { prisma as defaultPrisma } from '../config/database';

export class AttemptRepository {
  constructor(private readonly prisma: PrismaClient = defaultPrisma) {}

  /**
   * Atomically creates a StudentAttempt row and upserts TopicProgress in MySQL within a single transaction.
   * Note: In MySQL `ON DUPLICATE KEY UPDATE`, expressions evaluate left-to-right; `successRate` and
   * `markedAsWeak` MUST be computed BEFORE `correctCount` and `attempts` are incremented so they read
   * the pre-increment row values consistently.
   */
  public async recordPracticeAttempt(params: {
    userId: string;
    questionId: string;
    topic: string;
    subject: string;
    answerSubmitted: string;
    isCorrect: boolean;
    timeSpent: number;
  }): Promise<void> {
    const { userId, questionId, topic, subject, answerSubmitted, isCorrect, timeSpent } = params;
    const inc = isCorrect ? 1 : 0;
    const progressId = randomUUID();

    await this.prisma.$transaction(async (tx) => {
      await tx.studentAttempt.create({
        data: { userId, questionId, answerSubmitted, isCorrect, timeSpent },
      });

      await tx.$executeRaw`
        INSERT INTO \`TopicProgress\` (
          \`id\`, \`userId\`, \`topicName\`, \`subject\`,
          \`attempts\`, \`correctCount\`, \`successRate\`, \`markedAsWeak\`, \`lastAttemptAt\`
        )
        VALUES (
          ${progressId}, ${userId}, ${topic}, ${subject},
          1, ${inc}, CAST(${inc} AS DOUBLE), false, NOW(3)
        )
        ON DUPLICATE KEY UPDATE
          \`successRate\`  = CAST(\`correctCount\` + ${inc} AS DOUBLE) / (\`attempts\` + 1),
          \`markedAsWeak\` = (\`attempts\` + 1 >= 3)
                           AND (CAST(\`correctCount\` + ${inc} AS DOUBLE) / (\`attempts\` + 1) < 0.6),
          \`correctCount\` = \`correctCount\` + ${inc},
          \`attempts\`     = \`attempts\` + 1,
          \`lastAttemptAt\` = NOW(3)
      `;
    });
  }

  public findWeakAreasByUser(userId: string) {
    return this.prisma.topicProgress.findMany({
      where: { userId, markedAsWeak: true },
      orderBy: { successRate: 'asc' },
    });
  }

  public findOverviewByUser(userId: string) {
    return this.prisma.topicProgress.findMany({
      where: { userId },
      orderBy: [{ subject: 'asc' }, { successRate: 'asc' }],
    });
  }

  public findUserAttemptsForAdmin(userId: string) {
    return this.prisma.studentAttempt.findMany({
      where: { userId },
      select: { isCorrect: true, question: { select: { topic: true, subject: true } } },
    });
  }

  public groupByUserForAdmin() {
    return this.prisma.studentAttempt.groupBy({
      by: ['userId'],
      _count: { _all: true },
      _max: { createdAt: true },
    });
  }

  public groupCorrectByUserForAdmin() {
    return this.prisma.studentAttempt.groupBy({
      by: ['userId'],
      where: { isCorrect: true },
      _count: { _all: true },
    });
  }
}
