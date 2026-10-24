import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export interface MockPoolItem {
  questionId: string;
  subject: string;
  questionType: string;
  // Recorded for papers stored from now on; older papers have no topic and are never reused
  topic?: string;
}

// How many random stored papers are checked for one start before a new paper is generated
const CANDIDATES_PER_START = 20;
const MIN_PAPER_QUESTIONS = 20;

/**
 * A stored paper for this exam type and difficulty that the student's topic plan accepts.
 * Returns null when none fits, so the caller generates a new paper.
 */
export async function findStoredPaper(
  examType: string,
  difficultyMode: string,
  accept: (items: MockPoolItem[]) => boolean,
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
    if (accept(items)) return items;
  }
  return null;
}

/** Store a freshly generated paper so later students of the same exam and difficulty can be given it */
export async function saveStoredPaper(examType: string, difficultyMode: string, items: MockPoolItem[]): Promise<void> {
  if (items.length < MIN_PAPER_QUESTIONS) throw new Error('Generated paper is too short to store');

  // Mock papers may only use mock-only questions, so practice never shows a question a mock has used
  const ids = [...new Set(items.map((i) => i.questionId))];
  const mockOnlyCount = await prisma.question.count({ where: { id: { in: ids }, mockOnly: true } });
  if (mockOnlyCount !== ids.length) {
    throw new Error('Mock paper contains questions outside the mock-only pool; not stored');
  }

  await prisma.mockPaper.create({
    data: { examType, difficultyMode, items: items as unknown as Prisma.InputJsonValue },
  });
}
