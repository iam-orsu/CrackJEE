import { prisma } from '../lib/prisma';
import { NEET_SUBJECTS } from '../types/index';
import { coveredAfterMock, fullTopicList, weakestTopic } from './mockTopicPlan';

export interface SubjectHistory {
  covered: Set<string>;
  weakTopic: string | null;
}

type BreakdownEntry = { awarded: number; submitted: string | null };

function subjectsFor(examType: 'Main' | 'Advanced' | 'NEET'): readonly string[] {
  return examType === 'NEET' ? NEET_SUBJECTS : ['Physics', 'Chemistry', 'Mathematics'];
}

/**
 * Where a student is in each subject's topic rotation, and the weak topic from their last mock.
 * Built from the student's own mocks of this exam type, oldest first, so it needs no extra storage.
 */
export async function loadTopicHistory(
  userId: string,
  examType: 'Main' | 'Advanced' | 'NEET',
): Promise<Record<string, SubjectHistory>> {
  const subjects = subjectsFor(examType);
  const result: Record<string, SubjectHistory> = {};
  for (const subject of subjects) result[subject] = { covered: new Set(), weakTopic: null };

  // Covered topics: every mock that was generated or taken, oldest first
  // The latest 200 mocks are plenty for a rotation of 90 topics at 10 a mock, and keep this query bounded
  const latest = await prisma.mockExam.findMany({
    where: { userId, examType, status: { in: ['submitted', 'in_progress', 'ready'] } },
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: { questions: { include: { question: { select: { topic: true, subject: true } } } } },
  });
  const mocks = latest.reverse();
  for (const mock of mocks) {
    for (const subject of subjects) {
      const topics = mock.questions
        .filter((mq) => mq.question.subject === subject)
        .map((mq) => mq.question.topic);
      result[subject]!.covered = coveredAfterMock(result[subject]!.covered, topics, fullTopicList(examType, subject));
    }
  }

  // Weak topic: the lowest-accuracy topic per subject in the last submitted mock
  const last = await prisma.mockExam.findFirst({
    where: { userId, examType, status: 'submitted' },
    orderBy: { submittedAt: 'desc' },
    include: {
      questions: { include: { question: { select: { topic: true, subject: true } } } },
      result: { select: { scoreBreakdown: true } },
    },
  });
  if (last?.result) {
    const breakdown = last.result.scoreBreakdown as Record<string, BreakdownEntry>;
    for (const subject of subjects) {
      const answers = last.questions
        .filter((mq) => mq.question.subject === subject)
        .flatMap((mq) => {
          const bd = breakdown[mq.id];
          if (!bd || bd.submitted === null) return [];
          return [{ topic: mq.question.topic, correct: bd.awarded > 0 }];
        });
      result[subject]!.weakTopic = weakestTopic(answers);
    }
  }

  return result;
}

/** Question ids this student has already had in mocks of this exam type, so a paper never repeats one */
export async function loadSeenQuestionIds(userId: string, examType: 'Main' | 'Advanced' | 'NEET'): Promise<Set<string>> {
  const rows = await prisma.mockExamQuestion.findMany({
    where: { exam: { userId, examType, status: { in: ['submitted', 'in_progress', 'ready'] } } },
    select: { questionId: true },
  });
  return new Set(rows.map((r) => r.questionId));
}
