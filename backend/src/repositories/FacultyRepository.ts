import type { Prisma } from '@prisma/client';
import { database } from '../config/database';
import type { DiagramTemplate, Difficulty, QuestionType, Subject } from '../types/index';

export interface FacultyPaperSelection {
  subject: Subject;
  topic: string;
  mcqCount?: number;
  integerCount?: number;
  multiCount?: number;
  matrixCount?: number;
  mcqEasy?: number;
  mcqMedium?: number;
  mcqHard?: number;
  integerEasy?: number;
  integerMedium?: number;
  integerHard?: number;
  multiEasy?: number;
  multiMedium?: number;
  multiHard?: number;
  matrixEasy?: number;
  matrixMedium?: number;
  matrixHard?: number;
}

export interface FacultyPaperItem {
  number: number;
  subject: Subject;
  topic: string;
  difficulty?: Difficulty;
  questionType: QuestionType;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  diagram: DiagramTemplate | null;
  verified: boolean;
  editedByFaculty?: boolean;
}

/** Data-access class for `Faculty` and `FacultyPaper` tables. */
export class FacultyRepository {
  public async findByEmail(email: string) {
    return database.client.faculty.findUnique({ where: { email: email.trim().toLowerCase() } });
  }

  public async findById(id: string) {
    return database.client.faculty.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, isActive: true, avatarUrl: true, mobile: true, mobileVerified: true, createdAt: true },
    });
  }

  public async findByMobile(mobile: string) {
    return database.client.faculty.findUnique({
      where: { mobile },
      select: { id: true, email: true },
    });
  }

  public async findByGoogleSub(googleSub: string) {
    return database.client.faculty.findUnique({ where: { googleSub } });
  }

  public async listAllWithCounts() {
    return database.client.faculty.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        googleSub: true,
        avatarUrl: true,
        mobile: true,
        mobileVerified: true,
        createdAt: true,
        _count: { select: { papers: true } },
      },
    });
  }

  public async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    googleSub?: string | null;
    avatarUrl?: string | null;
    mobile?: string | null;
  }) {
    return database.client.faculty.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        passwordHash: data.passwordHash,
        googleSub: data.googleSub ?? null,
        avatarUrl: data.avatarUrl ?? null,
        mobile: data.mobile ?? null,
      },
      select: { id: true, name: true, email: true, isActive: true, googleSub: true, avatarUrl: true, mobile: true, mobileVerified: true, createdAt: true },
    });
  }

  public async linkGoogleSub(id: string, googleSub: string, avatarUrl?: string | null) {
    return database.client.faculty.update({
      where: { id },
      data: { googleSub, ...(avatarUrl ? { avatarUrl } : {}) },
      select: { id: true, name: true, email: true, isActive: true, googleSub: true, avatarUrl: true, createdAt: true },
    });
  }

  public async updateAccount(
    id: string,
    data: { name?: string; isActive?: boolean; passwordHash?: string; mobile?: string | null; mobileVerified?: boolean },
  ) {
    return database.client.faculty.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, isActive: true, avatarUrl: true, mobile: true, mobileVerified: true, createdAt: true },
    });
  }

  public async createPaper(data: {
    facultyId: string;
    title: string;
    organization?: string | null;
    examType: string;
    difficulty: string;
    questionCount: number;
    selections: FacultyPaperSelection[];
  }) {
    const existingCount = await database.client.facultyPaper.count();
    const candidateSeq = existingCount + 1;
    const randomSuffix = Math.random().toString(36).slice(2, 5).toUpperCase();
    const paperCode = `FP-${String(candidateSeq).padStart(3, '0')}${randomSuffix}`;

    return database.client.facultyPaper.create({
      data: {
        paperCode,
        facultyId: data.facultyId,
        title: data.title.trim(),
        organization: data.organization ? data.organization.trim() : null,
        examType: data.examType,
        difficulty: data.difficulty,
        questionCount: data.questionCount,
        selections: data.selections as unknown as Prisma.InputJsonValue,
        items: [] as unknown as Prisma.InputJsonValue,
        status: 'generating',
        verifiedCount: 0,
      },
    });
  }

  public async findPaperById(id: string) {
    return database.client.facultyPaper.findUnique({ where: { id } });
  }

  public async listPapersByFaculty(facultyId: string, limit = 50) {
    return database.client.facultyPaper.findMany({
      where: { facultyId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        paperCode: true,
        title: true,
        organization: true,
        examType: true,
        difficulty: true,
        questionCount: true,
        selections: true,
        status: true,
        verifiedCount: true,
        errorMessage: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  public async updatePaperState(
    id: string,
    data: {
      status?: string;
      questionCount?: number;
      verifiedCount?: number;
      items?: FacultyPaperItem[];
      errorMessage?: string | null;
    },
  ) {
    const payload: Prisma.FacultyPaperUpdateInput = {};
    if (data.status !== undefined) payload.status = data.status;
    if (data.questionCount !== undefined) payload.questionCount = data.questionCount;
    if (data.verifiedCount !== undefined) payload.verifiedCount = data.verifiedCount;
    if (data.items !== undefined) payload.items = data.items as unknown as Prisma.InputJsonValue;
    if (data.errorMessage !== undefined) payload.errorMessage = data.errorMessage;
    return database.client.facultyPaper.update({ where: { id }, data: payload });
  }

  public async deletePaper(id: string) {
    return database.client.facultyPaper.delete({ where: { id } });
  }

  public async sweepStuckGenerating(cutoff: Date): Promise<number> {
    const res = await database.client.facultyPaper.updateMany({
      where: { status: 'generating', updatedAt: { lt: cutoff } },
      data: {
        status: 'error',
        errorMessage: 'Generation timed out or was interrupted. Please regenerate.',
      },
    });
    return res.count;
  }
}
