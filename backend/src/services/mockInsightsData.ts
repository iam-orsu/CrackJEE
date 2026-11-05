import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { cacheGetJson, cacheSetJson } from './cacheService';
import type { QuestionRecord, ExamTotal } from './mockInsights';

// The most recent submitted mocks the dashboard analyses. Keeps the query bounded as a student's history grows.
export const INSIGHT_EXAMS = 30;

const STUDENT_MOCK_DATA_TTL = 120; // seconds — same window as mock-answers cache

type BreakdownEntry = {
  awarded: number;
  maxMarks?: number;
  submitted: string | null;
  timeSpentSeconds?: number;
  questionType?: string;
};

/** One record per question of the given exams, with its marks, time and topic */
function recordsFromExams(
  exams: Array<{
    submittedAt: Date | null;
    createdAt: Date;
    questions: Array<{ id: string; question: { subject: string; topic: string } }>;
    result: { scoreBreakdown: unknown } | null;
  }>,
): QuestionRecord[] {
  const records: QuestionRecord[] = [];
  for (const exam of exams) {
    if (!exam.result) continue;
    const breakdown = exam.result.scoreBreakdown as Record<string, BreakdownEntry>;
    const at = exam.submittedAt ?? exam.createdAt;
    for (const mq of exam.questions) {
      const bd = breakdown[mq.id];
      records.push({
        subject: mq.question.subject,
        topic: mq.question.topic,
        questionType: bd?.questionType ?? 'mcq_single',
        answered: !!bd && bd.submitted !== null,
        awarded: bd?.awarded ?? 0,
        maxMarks: bd?.maxMarks ?? 4,
        timeSeconds: bd?.timeSpentSeconds ?? 0,
        at,
      });
    }
  }
  return records;
}

const examInclude = {
  questions: { include: { question: { select: { topic: true, subject: true } } } },
  result: { select: { scoreBreakdown: true, totalScore: true, maxScore: true } },
} as const;

type StudentMockDataResult = {
  records: QuestionRecord[];
  totals: ExamTotal[];
  examsAnalysed: number;
  latestExamType: string | null;
};

// Dates serialise to strings in JSON; this is what actually comes back from Redis.
type SerializedStudentMockData = {
  records: Array<Omit<QuestionRecord, 'at'> & { at: string }>;
  totals: Array<Omit<ExamTotal, 'at'> & { at: string }>;
  examsAnalysed: number;
  latestExamType: string | null;
};

/** Question records and overall score per exam for a student's recent submitted mocks */
export async function loadStudentMockData(userId: string): Promise<StudentMockDataResult> {
  const cacheKey = `mock-data:${userId}`;
  const cached = await cacheGetJson<SerializedStudentMockData>(cacheKey);
  if (cached) {
    return {
      ...cached,
      records: cached.records.map((r) => ({ ...r, at: new Date(r.at) })),
      totals: cached.totals.map((t) => ({ ...t, at: new Date(t.at) })),
    };
  }

  const exams = await prisma.mockExam.findMany({
    where: { userId, status: 'submitted' },
    orderBy: { createdAt: 'desc' },
    take: INSIGHT_EXAMS,
    include: examInclude,
  });

  const totals: ExamTotal[] = [];
  for (const exam of exams) {
    if (!exam.result || exam.result.maxScore <= 0) continue;
    totals.push({
      at: exam.submittedAt ?? exam.createdAt,
      pct: Math.round((exam.result.totalScore / exam.result.maxScore) * 100),
    });
  }

  const result: StudentMockDataResult = {
    records: recordsFromExams(exams),
    totals,
    examsAnalysed: exams.length,
    latestExamType: exams[0]?.examType ?? null,
  };

  await cacheSetJson(cacheKey, result, STUDENT_MOCK_DATA_TTL);
  return result;
}

const PLATFORM_AVERAGE_TTL = 60;

/**
 * Each student's average mock score for one exam type, across all their submitted mocks of that type.
 * Cached briefly: it is the same for every student who views the dashboard.
 */
export async function loadPlatformAverages(examType: string): Promise<Array<{ userId: string; avgPct: number }>> {
  const cacheKey = `platform-avg:${examType}`;
  const cached = await cacheGetJson<Array<{ userId: string; avgPct: number }>>(cacheKey);
  if (cached) return cached;

  const rows = await prisma.$queryRaw<Array<{ userId: string; avgPct: number }>>(Prisma.sql`
    SELECT e."userId" AS "userId",
           AVG(r."totalScore" * 100.0 / r."maxScore")::float8 AS "avgPct"
    FROM "MockExamResult" r
    JOIN "MockExam" e ON e.id = r."examId"
    WHERE e.status = 'submitted' AND e."examType" = ${examType} AND r."maxScore" > 0
    GROUP BY e."userId"
  `);
  const averages = rows.map((r) => ({ userId: r.userId, avgPct: Math.round(r.avgPct * 10) / 10 }));
  await cacheSetJson(cacheKey, averages, PLATFORM_AVERAGE_TTL);
  return averages;
}

/** Question records for one exam, when the student owns it */
export async function loadExamMockData(
  userId: string,
  examId: string,
): Promise<{ records: QuestionRecord[]; examType: string; scorePct: number | null } | null> {
  const exam = await prisma.mockExam.findFirst({
    where: { id: examId, userId, status: 'submitted' },
    include: examInclude,
  });
  if (!exam) return null;
  const scorePct = exam.result && exam.result.maxScore > 0
    ? Math.round((exam.result.totalScore / exam.result.maxScore) * 100)
    : null;
  return { records: recordsFromExams([exam]), examType: exam.examType, scorePct };
}
