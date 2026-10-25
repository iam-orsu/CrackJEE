import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export interface MockPoolItem {
  questionId: string;
  subject: string;
  questionType: string;
  // Recorded for papers stored from now on; older papers have no topic and are never reused
  topic?: string;
}

const MIN_PAPER_QUESTIONS = 20;

/**
 * A stored paper for this exam type, difficulty and topic plan.
 *
 * Primary lookup: find by planKey (O(log n) via index). Secondary: scan recent papers and apply
 * the acceptance function — used only for backwards compatibility with papers that predate planKey.
 * Returns null when none fits, so the caller generates a new paper.
 */
export async function findStoredPaper(
  examType: string,
  difficultyMode: string,
  planKey: string,
  accept: (items: MockPoolItem[]) => boolean,
): Promise<MockPoolItem[] | null> {
  // Fast path: find a stored paper with the exact same topic plan
  const exact = await prisma.$queryRaw<Array<{ items: MockPoolItem[] }>>(Prisma.sql`
    SELECT items FROM "MockPaper"
    WHERE "examType" = ${examType}
      AND "difficultyMode" = ${difficultyMode}
      AND "planKey" = ${planKey}
    ORDER BY id DESC
    LIMIT 5
  `);

  for (const candidate of exact) {
    const items = candidate.items;
    if (items.length >= MIN_PAPER_QUESTIONS && accept(items)) return items;
  }

  // Slow path: check the 50 most recent papers in case they were stored without planKey
  // (backwards compatibility for papers generated before this column was added)
  const recent = await prisma.$queryRaw<Array<{ items: MockPoolItem[] }>>(Prisma.sql`
    SELECT items FROM "MockPaper"
    WHERE "examType" = ${examType}
      AND "difficultyMode" = ${difficultyMode}
      AND "planKey" IS NULL
    ORDER BY id DESC
    LIMIT 50
  `);

  for (const candidate of recent) {
    const items = candidate.items;
    if (items.length >= MIN_PAPER_QUESTIONS && accept(items)) return items;
  }

  return null;
}

/** Store a freshly generated paper so later students of the same exam, difficulty and plan can be given it */
export async function saveStoredPaper(
  examType: string,
  difficultyMode: string,
  items: MockPoolItem[],
  planKey: string,
): Promise<void> {
  if (items.length < MIN_PAPER_QUESTIONS) throw new Error('Generated paper is too short to store');

  await prisma.mockPaper.create({
    data: { examType, difficultyMode, items: items as unknown as Prisma.InputJsonValue, planKey },
  });
}
