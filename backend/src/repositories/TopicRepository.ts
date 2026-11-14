import { prisma } from '../config/database';
import type { Prisma } from '@prisma/client';

export interface TopicRecord {
  id: string;
  numericCode: number;
  name: string;
  subject: string;
  classLevel: string;
  examCategory: string;
  syllabusOrder: number;
  isExcluded: boolean;
}

export interface StudentMasteryRecord {
  id: string;
  userId: string;
  topicId: string;
  attemptsCount: number;
  correctCount: number;
  accuracyPct: number;
  marksLostTotal: number;
  isWeak: boolean;
  lastTestedAt: Date;
  topic: TopicRecord;
}

export class TopicRepository {
  public async findAll(examCategory?: string): Promise<TopicRecord[]> {
    return prisma.topic.findMany({
      where: examCategory ? { examCategory: { in: [examCategory, 'BOTH'] } } : undefined,
      orderBy: [{ subject: 'asc' }, { syllabusOrder: 'asc' }],
    });
  }

  public async findById(id: string): Promise<TopicRecord | null> {
    return prisma.topic.findUnique({
      where: { id },
    });
  }

  public async findByNameAndSubject(name: string, subject: string): Promise<TopicRecord | null> {
    return prisma.topic.findFirst({
      where: { name, subject },
    });
  }

  public async getStudentMasteries(userId: string): Promise<StudentMasteryRecord[]> {
    return prisma.studentTopicMastery.findMany({
      where: { userId },
      include: { topic: true },
      orderBy: [{ isWeak: 'desc' }, { accuracyPct: 'asc' }],
    });
  }

  public async getWeakTopicsForStudent(userId: string, limit = 10): Promise<StudentMasteryRecord[]> {
    return prisma.studentTopicMastery.findMany({
      where: { userId, isWeak: true },
      include: { topic: true },
      orderBy: [{ marksLostTotal: 'desc' }, { accuracyPct: 'asc' }],
      take: limit,
    });
  }

  public async getTopWeakTopicForStudent(userId: string, subject?: string): Promise<StudentMasteryRecord | null> {
    return prisma.studentTopicMastery.findFirst({
      where: {
        userId,
        isWeak: true,
        ...(subject ? { topic: { subject } } : {}),
      },
      include: { topic: true },
      orderBy: [{ marksLostTotal: 'desc' }, { accuracyPct: 'asc' }],
    });
  }

  public async recordAttempt(
    userId: string,
    topicId: string,
    isCorrect: boolean,
    marksLost = 0,
  ): Promise<void> {
    const existing = await prisma.studentTopicMastery.findUnique({
      where: { userId_topicId: { userId, topicId } },
    });

    if (!existing) {
      const attemptsCount = 1;
      const correctCount = isCorrect ? 1 : 0;
      const accuracyPct = isCorrect ? 100 : 0;
      // Marked weak if at least 2 attempts and < 60% accuracy, or 1 attempt 0% accuracy
      const isWeak = !isCorrect;
      await prisma.studentTopicMastery.create({
        data: {
          userId,
          topicId,
          attemptsCount,
          correctCount,
          accuracyPct,
          marksLostTotal: marksLost,
          isWeak,
          lastTestedAt: new Date(),
        },
      });
      return;
    }

    const attemptsCount = existing.attemptsCount + 1;
    const correctCount = existing.correctCount + (isCorrect ? 1 : 0);
    const accuracyPct = Math.round((correctCount / attemptsCount) * 1000) / 10;
    const marksLostTotal = existing.marksLostTotal + marksLost;
    const isWeak = attemptsCount >= 2 ? accuracyPct < 60 : accuracyPct < 50;

    await prisma.studentTopicMastery.update({
      where: { id: existing.id },
      data: {
        attemptsCount,
        correctCount,
        accuracyPct,
        marksLostTotal,
        isWeak,
        lastTestedAt: new Date(),
      },
    });
  }

  public async batchRecordExamResults(
    userId: string,
    results: Array<{ topicId: string; isCorrect: boolean; marksLost: number }>,
  ): Promise<void> {
    if (results.length === 0) return;

    // Group results by topicId
    const byTopic = new Map<string, { attempts: number; correct: number; marksLost: number }>();
    for (const r of results) {
      if (!r.topicId) continue;
      const cur = byTopic.get(r.topicId) ?? { attempts: 0, correct: 0, marksLost: 0 };
      cur.attempts++;
      if (r.isCorrect) cur.correct++;
      cur.marksLost += r.marksLost;
      byTopic.set(r.topicId, cur);
    }

    for (const [topicId, data] of byTopic) {
      const existing = await prisma.studentTopicMastery.findUnique({
        where: { userId_topicId: { userId, topicId } },
      });

      if (!existing) {
        const accuracyPct = Math.round((data.correct / data.attempts) * 1000) / 10;
        const isWeak = data.attempts >= 2 ? accuracyPct < 60 : accuracyPct < 50;
        await prisma.studentTopicMastery.create({
          data: {
            userId,
            topicId,
            attemptsCount: data.attempts,
            correctCount: data.correct,
            accuracyPct,
            marksLostTotal: data.marksLost,
            isWeak,
            lastTestedAt: new Date(),
          },
        });
      } else {
        const attemptsCount = existing.attemptsCount + data.attempts;
        const correctCount = existing.correctCount + data.correct;
        const accuracyPct = Math.round((correctCount / attemptsCount) * 1000) / 10;
        const marksLostTotal = existing.marksLostTotal + data.marksLost;
        const isWeak = attemptsCount >= 2 ? accuracyPct < 60 : accuracyPct < 50;

        await prisma.studentTopicMastery.update({
          where: { id: existing.id },
          data: {
            attemptsCount,
            correctCount,
            accuracyPct,
            marksLostTotal,
            isWeak,
            lastTestedAt: new Date(),
          },
        });
      }
    }
  }
}
