import { Prisma, type PrismaClient, type Question } from '@prisma/client';
import { prisma as defaultPrisma } from '../config/database';
import type { GeneratedQuestion, Subject, Difficulty, ExamType, QuestionType } from '../types/index';

export interface CreateQuestionInput {
  topic: string;
  subject: string;
  questionText: string;
  options: Prisma.InputJsonValue;
  answer: string;
  explanation: string;
  diagram?: Prisma.InputJsonValue;
  difficulty: string;
  examType: string;
  questionType: string;
  validatedAt: Date;
  mockOnly?: boolean;
}

export class QuestionRepository {
  constructor(private readonly prisma: PrismaClient = defaultPrisma) {}

  public findById(id: string): Promise<Question | null> {
    return this.prisma.question.findUnique({ where: { id } });
  }

  public findByIdForExplanation(id: string) {
    return this.prisma.question.findUnique({
      where: { id },
      select: { explanation: true },
    });
  }

  public findByIdForTieredExplanation(id: string) {
    return this.prisma.question.findUnique({
      where: { id },
      select: {
        id: true,
        topic: true,
        subject: true,
        questionText: true,
        options: true,
        answer: true,
        explanation: true,
        betterExplanation: true,
        bestExplanation: true,
        questionType: true,
        examType: true,
        difficulty: true,
      },
    });
  }

  public updateExplanation(id: string, explanation: string) {
    return this.prisma.question.update({
      where: { id },
      data: { explanation },
    });
  }

  public updateTieredExplanation(id: string, tier: 'better' | 'best', text: string) {
    const data = tier === 'better' ? { betterExplanation: text } : { bestExplanation: text };
    return this.prisma.question.update({
      where: { id },
      data,
    });
  }

  public findManyByIds(ids: string[]): Promise<Question[]> {
    if (ids.length === 0) return Promise.resolve([]);
    return this.prisma.question.findMany({ where: { id: { in: ids } } });
  }

  public findPaperPreviewByIds(ids: string[]) {
    if (ids.length === 0) return Promise.resolve([]);
    return this.prisma.question.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        topic: true,
        subject: true,
        questionText: true,
        options: true,
        difficulty: true,
        questionType: true,
        diagram: true,
      },
    });
  }

  public findValidatedByIds(ids: string[]): Promise<Question[]> {
    if (ids.length === 0) return Promise.resolve([]);
    return this.prisma.question.findMany({
      where: { id: { in: ids }, validatedAt: { not: null } },
    });
  }

  public async findIdsByCriteria(where: Prisma.QuestionWhereInput): Promise<string[]> {
    const rows = await this.prisma.question.findMany({ where, select: { id: true } });
    return rows.map((r) => r.id);
  }

  public findMany(where: Prisma.QuestionWhereInput, take?: number): Promise<Question[]> {
    return this.prisma.question.findMany({
      where,
      ...(take !== undefined ? { take } : {}),
    });
  }

  public findFirst(where: Prisma.QuestionWhereInput): Promise<Question | null> {
    return this.prisma.question.findFirst({ where });
  }

  public findPaperPoolRows(
    bankExamType: 'Main' | 'Advanced',
    selections: Array<{ subject: Subject; topic: string }>,
    difficulty: Difficulty | 'mixed',
  ) {
    return this.prisma.question.findMany({
      where: {
        validatedAt: { not: null },
        mockOnly: false,
        examType: bankExamType,
        OR: selections.map((s) => ({
          subject: s.subject,
          topic: s.topic,
          ...(difficulty !== 'mixed' ? { difficulty } : {}),
        })),
      },
      select: { id: true, subject: true, topic: true },
      orderBy: { id: 'asc' },
    });
  }

  public async findDistinctPracticeTopics(subject: string, examType: string): Promise<Set<string>> {
    const rows = await this.prisma.question.findMany({
      where: { subject, examType, validatedAt: { not: null }, mockOnly: false },
      select: { topic: true },
      distinct: ['topic'],
    });
    return new Set(rows.map((r) => r.topic));
  }

  public async findDistinctPracticeTopicsIn(
    subject: string,
    examType: string,
    topics: string[],
  ): Promise<Set<string>> {
    const rows = await this.prisma.question.findMany({
      where: { subject, examType, validatedAt: { not: null }, mockOnly: false, topic: { in: topics } },
      select: { topic: true },
      distinct: ['topic'],
    });
    return new Set(rows.map((r) => r.topic));
  }

  public findMockBankSlots(
    examType: 'Main' | 'Advanced' | 'NEET',
    slotOrConditions: Array<{ subject: string; topic: string; difficulty: string; questionType: string }>,
  ) {
    if (slotOrConditions.length === 0) return Promise.resolve([]);
    return this.prisma.question.findMany({
      where: {
        mockOnly: true,
        validatedAt: { not: null },
        examType,
        OR: slotOrConditions,
      },
      select: { id: true, subject: true, topic: true, difficulty: true, questionType: true },
    });
  }

  public findPracticePoolBySubjects(subjects: string[]) {
    if (subjects.length === 0) return Promise.resolve([]);
    return this.prisma.question.findMany({
      where: {
        mockOnly: false,
        validatedAt: { not: null },
        subject: { in: subjects },
      },
      select: { id: true, subject: true, topic: true, difficulty: true, examType: true, questionType: true },
    });
  }

  public createGeneratedBatch(
    items: Array<{
      topic: string;
      subject: Subject | string;
      difficulty: Difficulty | string;
      examType: ExamType | string;
      questionType: QuestionType | string;
      question: GeneratedQuestion;
      validatedAt: Date;
      mockOnly?: boolean;
    }>,
  ): Promise<Question[]> {
    return this.prisma.$transaction(
      items.map(({ topic, subject, difficulty, examType, questionType, question: q, validatedAt, mockOnly }) =>
        this.prisma.question.create({
          data: {
            topic,
            subject,
            questionText: q.question,
            options: q.options as unknown as Prisma.InputJsonValue,
            answer: q.correct_answer,
            explanation: q.answer_explanation,
            diagram: q.diagram ? (JSON.parse(JSON.stringify(q.diagram)) as Prisma.InputJsonValue) : undefined,
            difficulty,
            examType,
            questionType,
            validatedAt,
            mockOnly: mockOnly ?? false,
          },
        }),
      ),
    );
  }

  public groupValidatedCountsBySubject(where: Prisma.QuestionWhereInput) {
    return this.prisma.question.groupBy({
      by: ['subject'],
      where,
      _count: { _all: true },
    });
  }

  /** Fetches validated question bank candidates for a single topic as optional fallback. */
  public findFacultyFallbackQuestions(
    subject: string,
    topic: string,
    examTypes: string[],
    questionType?: string,
    take = 10,
  ) {
    return this.prisma.question.findMany({
      where: {
        subject,
        topic,
        examType: { in: examTypes },
        validatedAt: { not: null },
        ...(questionType ? { questionType } : {}),
      },
      select: {
        id: true,
        subject: true,
        topic: true,
        questionType: true,
        questionText: true,
        options: true,
        answer: true,
        explanation: true,
        diagram: true,
      },
      take,
    });
  }
}
