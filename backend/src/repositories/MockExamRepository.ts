import { Prisma, type PrismaClient } from '@prisma/client';
import { prisma as defaultPrisma } from '../config/database';
import { MOCK_CONSTANTS } from '../config/constants';

export interface MockPoolItem {
  questionId: string;
  subject: string;
  questionType: string;
  topic?: string;
}

const INSIGHT_EXAM_INCLUDE = {
  questions: { include: { question: { select: { topic: true, subject: true } } } },
  result: { select: { scoreBreakdown: true, totalScore: true, maxScore: true } },
} as const;

export class MockExamRepository {
  constructor(private readonly prisma: PrismaClient = defaultPrisma) {}

  public async hasQuestionForUser(userId: string, questionId: string): Promise<boolean> {
    const row = await this.prisma.mockExamQuestion.findFirst({
      where: { questionId, exam: { userId } },
      select: { id: true },
    });
    return !!row;
  }

  public async isQuestionInActiveMock(userId: string, questionId: string): Promise<boolean> {
    const row = await this.prisma.mockExamQuestion.findFirst({
      where: { questionId, exam: { userId, status: 'in_progress' } },
      select: { id: true },
    });
    return !!row;
  }

  public sweepStuckGenerating(cutoffDate: Date, userId?: string) {
    return this.prisma.mockExam.updateMany({
      where: {
        ...(userId ? { userId } : {}),
        status: 'generating',
        createdAt: { lt: cutoffDate },
      },
      data: { status: 'error' },
    });
  }

  public findActiveForUser(userId: string) {
    return this.prisma.mockExam.findFirst({
      where: { userId, status: { in: ['generating', 'ready', 'in_progress'] } },
      orderBy: { createdAt: 'desc' },
    });
  }

  public createExam(userId: string, examType: string, difficultyMode: string) {
    return this.prisma.mockExam.create({
      data: {
        userId,
        examType,
        difficultyMode,
        status: 'generating',
        durationSeconds: MOCK_CONSTANTS.DURATION_SECONDS,
      },
    });
  }

  public markError(examId: string) {
    return this.prisma.mockExam.update({
      where: { id: examId },
      data: { status: 'error' },
    });
  }

  public async assignQuestionsAndMarkReady(
    examId: string,
    questionData: Array<{
      examId: string;
      questionId: string;
      subject: string;
      questionNumber: number;
      subjectIndex: number;
      sourceType?: string;
    }>,
  ): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.mockExamQuestion.createMany({
        data: questionData.map((q) => ({
          ...q,
          sourceType: q.sourceType ?? 'SWARM',
        })),
      }),
      this.prisma.mockExam.update({
        where: { id: examId },
        data: {
          status: 'ready',
        },
      }),
    ]);
  }

  public findByIdWithQuestions(examId: string) {
    return this.prisma.mockExam.findUnique({
      where: { id: examId },
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
  }

  public findById(examId: string) {
    return this.prisma.mockExam.findUnique({ where: { id: examId } });
  }

  public findStartedAt(examId: string) {
    return this.prisma.mockExam.findUnique({
      where: { id: examId },
      select: { startedAt: true },
    });
  }

  public findStatusOwnerAndTiming(examId: string) {
    return this.prisma.mockExam.findUnique({
      where: { id: examId },
      select: { userId: true, status: true, startedAt: true, durationSeconds: true },
    });
  }

  public findOwnerAndStatus(examId: string) {
    return this.prisma.mockExam.findUnique({
      where: { id: examId },
      select: { userId: true, status: true },
    });
  }

  public claimReadyExam(examId: string, userId: string, startedAt: Date) {
    return this.prisma.mockExam.updateMany({
      where: { id: examId, userId, status: 'ready', startedAt: null },
      data: { status: 'in_progress', startedAt },
    });
  }

  public saveQuestionAnswer(
    examId: string,
    mockQuestionId: string,
    savedAnswer: string | null,
    markedForReview?: boolean,
  ) {
    return this.prisma.mockExamQuestion.updateMany({
      where: { id: mockQuestionId, examId },
      data: {
        savedAnswer,
        ...(markedForReview !== undefined ? { markedForReview } : {}),
      },
    });
  }

  public findForSubmit(examId: string) {
    return this.prisma.mockExam.findUnique({
      where: { id: examId },
      include: { questions: { include: { question: true } } },
    });
  }

  public findResultByExamId(examId: string) {
    return this.prisma.mockExamResult.findUnique({ where: { examId } });
  }

  public async createResultAndMarkSubmitted(data: {
    examId: string;
    totalScore: number;
    maxScore: number;
    physicsScore: number;
    chemistryScore: number;
    mathScore: number;
    biologyScore: number;
    correct: number;
    partial: number;
    incorrect: number;
    unattempted: number;
    timeTaken: number;
    scoreBreakdown: Prisma.InputJsonValue;
  }) {
    const [result] = await this.prisma.$transaction([
      this.prisma.mockExamResult.create({ data }),
      this.prisma.mockExam.update({
        where: { id: data.examId },
        data: { status: 'submitted', submittedAt: new Date() },
      }),
    ]);
    return result;
  }

  public findForResult(examId: string) {
    return this.prisma.mockExam.findUnique({
      where: { id: examId },
      include: {
        result: true,
        questions: {
          include: {
            question: {
              select: {
                id: true,
                questionText: true,
                questionType: true,
                options: true,
                explanation: true,
                answer: true,
                subject: true,
                topic: true,
                difficulty: true,
              },
            },
          },
          orderBy: { questionNumber: 'asc' },
        },
      },
    });
  }

  public cancelNonSubmitted(examId: string) {
    return this.prisma.mockExam.updateMany({
      where: { id: examId, status: { not: 'submitted' } },
      data: { status: 'error' },
    });
  }

  public findHistoryByUser(userId: string, take = 20) {
    return this.prisma.mockExam.findMany({
      where: { userId, status: { not: 'error' } },
      select: {
        id: true,
        examType: true,
        difficultyMode: true,
        status: true,
        createdAt: true,
        submittedAt: true,
        result: {
          select: {
            totalScore: true,
            maxScore: true,
            correct: true,
            partial: true,
            incorrect: true,
            unattempted: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }

  public findSubmittedOwnedExam(examId: string, userId: string) {
    return this.prisma.mockExam.findFirst({
      where: { id: examId, userId, status: 'submitted' },
      select: { id: true },
    });
  }

  public findQuestionForExplanation(examId: string, mockQuestionId: string) {
    return this.prisma.mockExamQuestion.findFirst({
      where: { id: mockQuestionId, examId },
      include: { question: true },
    });
  }

  public countSubmittedForUser(userId: string, examType: string): Promise<number> {
    return this.prisma.mockExam.count({
      where: { userId, examType, status: 'submitted' },
    });
  }

  public findStoredPapersByPlanKey(examType: string, planKey: string, take = 5) {
    return this.prisma.mockPaper.findMany({
      where: { examType, planKey },
      orderBy: { id: 'desc' },
      take,
      select: { items: true },
    });
  }

  public findLegacyStoredPapers(examType: string, difficultyMode: string, take = 50) {
    return this.prisma.mockPaper.findMany({
      where: { examType, difficultyMode, planKey: null },
      orderBy: { id: 'desc' },
      take,
      select: { items: true },
    });
  }

  public saveStoredPaper(examType: string, difficultyMode: string, items: MockPoolItem[], planKey: string) {
    return this.prisma.mockPaper.create({
      data: { examType, difficultyMode, items: items as unknown as Prisma.InputJsonValue, planKey },
    });
  }

  public findRecentForTopicHistory(userId: string, examType: string, take = 200) {
    return this.prisma.mockExam.findMany({
      where: { userId, examType, status: { in: ['submitted', 'in_progress', 'ready'] } },
      orderBy: { createdAt: 'desc' },
      take,
      include: { questions: { include: { question: { select: { topic: true, subject: true } } } } },
    });
  }

  public findLastSubmittedForWeakTopic(userId: string, examType: string) {
    return this.prisma.mockExam.findFirst({
      where: { userId, examType, status: 'submitted' },
      orderBy: { submittedAt: 'desc' },
      include: {
        questions: { include: { question: { select: { topic: true, subject: true } } } },
        result: { select: { scoreBreakdown: true } },
      },
    });
  }

  public findSeenQuestionIds(userId: string, examType: string) {
    return this.prisma.mockExamQuestion.findMany({
      where: { exam: { userId, examType, status: { in: ['submitted', 'in_progress', 'ready'] } } },
      select: { questionId: true },
    });
  }

  public findSubmittedForInsights(userId: string, take: number) {
    return this.prisma.mockExam.findMany({
      where: { userId, status: 'submitted' },
      orderBy: { createdAt: 'desc' },
      take,
      include: INSIGHT_EXAM_INCLUDE,
    });
  }

  public findSubmittedExamForInsights(examId: string, userId: string) {
    return this.prisma.mockExam.findFirst({
      where: { id: examId, userId, status: 'submitted' },
      include: INSIGHT_EXAM_INCLUDE,
    });
  }

  public findRecentSubmittedResults(userId: string, take = 10) {
    return this.prisma.mockExamResult.findMany({
      where: { exam: { userId, status: 'submitted' }, maxScore: { gt: 0 } },
      orderBy: { exam: { submittedAt: 'desc' } },
      take,
      select: { totalScore: true, maxScore: true, exam: { select: { submittedAt: true, createdAt: true } } },
    });
  }

  public findLatestSubmittedExamType(userId: string) {
    return this.prisma.mockExam.findFirst({
      where: { userId, status: 'submitted' },
      orderBy: { submittedAt: 'desc' },
      select: { examType: true },
    });
  }

  public findUserMocksForAdmin(userId: string) {
    return this.prisma.mockExam.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        examType: true,
        difficultyMode: true,
        status: true,
        createdAt: true,
        submittedAt: true,
        result: {
          select: {
            totalScore: true,
            maxScore: true,
            physicsScore: true,
            chemistryScore: true,
            mathScore: true,
            biologyScore: true,
            correct: true,
            partial: true,
            incorrect: true,
            unattempted: true,
            timeTaken: true,
          },
        },
      },
    });
  }

  public groupSubmittedByUserForAdmin() {
    return this.prisma.mockExam.groupBy({
      by: ['userId'],
      where: { status: 'submitted' },
      _count: { _all: true },
    });
  }

  public findAllResultTotalsForAdmin() {
    return this.prisma.mockExamResult.findMany({
      select: { totalScore: true, maxScore: true },
    });
  }

  public findExamForAdminDetail(examId: string) {
    return this.prisma.mockExam.findUnique({
      where: { id: examId },
      select: {
        id: true,
        examType: true,
        status: true,
        createdAt: true,
        submittedAt: true,
        user: { select: { name: true, email: true } },
        result: {
          select: {
            totalScore: true,
            maxScore: true,
            correct: true,
            incorrect: true,
            unattempted: true,
            timeTaken: true,
            scoreBreakdown: true,
          },
        },
        questions: {
          orderBy: { questionNumber: 'asc' },
          select: {
            id: true,
            questionNumber: true,
            subject: true,
            savedAnswer: true,
            markedForReview: true,
            question: {
              select: {
                topic: true,
                questionType: true,
                difficulty: true,
                questionText: true,
                options: true,
                answer: true,
                explanation: true,
              },
            },
          },
        },
      },
    });
  }
}
