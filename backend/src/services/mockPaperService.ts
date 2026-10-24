import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export interface MockPoolItem {
  questionId: string;
  subject: string;
  questionType: string;
}

// A stored paper is reused only while it shares at most this share of its questions with the student's past mocks
export const MAX_PAPER_OVERLAP = 0.3;
// How many random stored papers are checked for one start before a new paper is generated
const CANDIDATES_PER_START = 8;
const MIN_PAPER_QUESTIONS = 20;

/** Question ids the student has already been given in mocks of this exam type */
export async function pastQuestionIds(userId: string, examType: string): Promise<Set<string>> {
  const past = await prisma.mockExamQuestion.findMany({
    where: { exam: { userId, examType } },
    select: { questionId: true },
  });
  return new Set(past.map((r) => r.questionId));
}

/**
 * A stored paper for this exam type and difficulty that the student has not mostly taken before.
 * Returns null when none fits, so the caller generates a new paper.
 */
export async function findStoredPaper(
  examType: string,
  difficultyMode: string,
  seen: Set<string>,
): Promise<MockPoolItem[] | null> {
  const candidates = await prisma.$queryRaw<Array<{ items: MockPoolItem[] }>>(Prisma.sql`
    SELECT items FROM "MockPaper"
    WHERE "examType" = ${examType} AND "difficultyMode" = ${difficultyMode}
    ORDER BY random()
    LIMIT ${CANDIDATES_PER_START}
  `);

  for (const candidate of candidates) {
    const items = candidate.items;
    if (items.length < MIN_PAPER_QUESTIONS) continue;
    const shared = items.filter((item) => seen.has(item.questionId)).length;
    if (shared / items.length <= MAX_PAPER_OVERLAP) return items;
  }
  return null;
}

/** Store a freshly generated paper so later students of the same exam and difficulty can be given it */
export async function saveStoredPaper(examType: string, difficultyMode: string, items: MockPoolItem[]): Promise<void> {
  if (items.length < MIN_PAPER_QUESTIONS) throw new Error('Generated paper is too short to store');
  await prisma.mockPaper.create({
    data: { examType, difficultyMode, items: items as unknown as Prisma.InputJsonValue },
  });
}
