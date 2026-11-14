import { prisma } from '../config/database';
import type { Prisma } from '@prisma/client';

export interface BaseMockPaperRecord {
  id: string;
  paperNumber: number;
  examType: string;
  title: string;
  totalQuestions: number;
  questionIds: string[];
  createdAt: Date;
}

export class BaseMockPaperRepository {
  public async findBasePaper(examType: string, paperNumber: number): Promise<BaseMockPaperRecord | null> {
    const raw = await prisma.baseMockPaper.findUnique({
      where: {
        examType_paperNumber: { examType, paperNumber },
      },
    });
    if (!raw) return null;
    return {
      ...raw,
      questionIds: raw.questionIds as string[],
    };
  }

  public async countBasePapers(examType: string): Promise<number> {
    return prisma.baseMockPaper.count({
      where: { examType },
    });
  }

  public async findAllBasePapers(examType: string): Promise<BaseMockPaperRecord[]> {
    const list = await prisma.baseMockPaper.findMany({
      where: { examType },
      orderBy: { paperNumber: 'asc' },
    });
    return list.map((p) => ({
      ...p,
      questionIds: p.questionIds as string[],
    }));
  }

  public async createBasePaper(data: {
    paperNumber: number;
    examType: string;
    title: string;
    totalQuestions: number;
    questionIds: string[];
  }): Promise<BaseMockPaperRecord> {
    const raw = await prisma.baseMockPaper.upsert({
      where: {
        examType_paperNumber: { examType: data.examType, paperNumber: data.paperNumber },
      },
      update: {
        title: data.title,
        totalQuestions: data.totalQuestions,
        questionIds: data.questionIds as Prisma.InputJsonValue,
      },
      create: {
        paperNumber: data.paperNumber,
        examType: data.examType,
        title: data.title,
        totalQuestions: data.totalQuestions,
        questionIds: data.questionIds as Prisma.InputJsonValue,
      },
    });
    return {
      ...raw,
      questionIds: raw.questionIds as string[],
    };
  }

  public async getNextBasePaperNumber(userId: string, examType: string): Promise<number> {
    const availableCount = await this.countBasePapers(examType);
    if (availableCount === 0) return 1;

    // Find the latest mock attempted by this student for this exam type
    const latestExam = await prisma.mockExam.findFirst({
      where: {
        userId,
        examType,
        basePaperNumber: { not: null },
      },
      orderBy: { createdAt: 'desc' },
      select: { basePaperNumber: true },
    });

    if (!latestExam || !latestExam.basePaperNumber) {
      return 1;
    }

    const next = latestExam.basePaperNumber + 1;
    return next > availableCount ? 1 : next;
  }
}
