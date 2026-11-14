import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MockExamService } from '../services/MockExamService';
import { ScoringService } from '../services/ScoringService';
import { GradingService } from '../services/GradingService';
import { isExamExpired } from '../utils/questionUtils';

describe('GradingService & ScoringService edge cases', () => {
  const grading = new GradingService();
  const scoring = new ScoringService();

  describe('JEE Advanced Multi-Correct (+4, partial credit, -2 penalty)', () => {
    it('awards full 4 marks for all correct options regardless of submission order or spacing', () => {
      assert.equal(scoring.scoreQuestion('Advanced', 'mcq_multi', 'A,B,D', 'A,B,D'), 4);
      assert.equal(scoring.scoreQuestion('Advanced', 'mcq_multi', 'D, A, B', 'A,B,D'), 4);
      assert.equal(scoring.scoreQuestion('Advanced', 'mcq_multi', 'b,d,a', 'A,B,D'), 4);
    });

    it('awards partial credit (+1, +2, +3) when only correct options are chosen', () => {
      // 4 correct options (A,B,C,D)
      assert.equal(scoring.scoreQuestion('Advanced', 'mcq_multi', 'A', 'A,B,C,D'), 1);
      assert.equal(scoring.scoreQuestion('Advanced', 'mcq_multi', 'A,C', 'A,B,C,D'), 2);
      assert.equal(scoring.scoreQuestion('Advanced', 'mcq_multi', 'A,B,D', 'A,B,C,D'), 3);

      // 3 correct options (A,B,C)
      assert.equal(scoring.scoreQuestion('Advanced', 'mcq_multi', 'B', 'A,B,C'), 1);
      assert.equal(scoring.scoreQuestion('Advanced', 'mcq_multi', 'B,C', 'A,B,C'), 2);
    });

    it('imposes -2 penalty if even a single incorrect option is chosen', () => {
      // Correct is A,B; student submitted A,B,C (C is wrong)
      assert.equal(scoring.scoreQuestion('Advanced', 'mcq_multi', 'A,B,C', 'A,B'), -2);
      // Student selected completely wrong option
      assert.equal(scoring.scoreQuestion('Advanced', 'mcq_multi', 'D', 'A,B'), -2);
      // Student selected all four options when only two were correct
      assert.equal(scoring.scoreQuestion('Advanced', 'mcq_multi', 'A,B,C,D', 'A,B'), -2);
    });

    it('awards 0 marks when skipped or unattempted', () => {
      assert.equal(scoring.scoreQuestion('Advanced', 'mcq_multi', null, 'A,B'), 0);
      assert.equal(scoring.scoreQuestion('Advanced', 'mcq_multi', '', 'A,B'), 0);
      assert.equal(scoring.scoreQuestion('Advanced', 'mcq_multi', '   ', 'A,B'), 0);
    });
  });

  describe('Integer questions: formatting, zero penalties, leading zeros and signs', () => {
    it('accepts leading zeros, leading plus sign, and surrounding spaces', () => {
      assert.equal(grading.matchInteger('007', '7'), true);
      assert.equal(grading.matchInteger('+42', '42'), true);
      assert.equal(grading.matchInteger('  99  ', '99'), true);
      assert.equal(grading.matchInteger('0', '000'), true);
      assert.equal(grading.matchInteger('10.0', '10'), true);
    });

    it('rejects non-numeric strings safely without crashing', () => {
      assert.equal(grading.matchInteger('abc', '5'), false);
      assert.equal(grading.matchInteger('NaN', '5'), false);
      assert.equal(grading.matchInteger('undefined', '0'), false);
    });

    it('enforces JEE Main integer scoring: +4 when correct, 0 when wrong (NO negative marking)', () => {
      assert.equal(scoring.scoreQuestion('Main', 'integer', '25', '25'), 4);
      assert.equal(scoring.scoreQuestion('Main', 'integer', '24', '25'), 0);
      assert.equal(scoring.scoreQuestion('Main', 'integer', null, '25'), 0);
    });

    it('enforces JEE Advanced integer scoring: +3 when correct, 0 when wrong', () => {
      assert.equal(scoring.scoreQuestion('Advanced', 'integer', '8', '8'), 3);
      assert.equal(scoring.scoreQuestion('Advanced', 'integer', '9', '8'), 0);
      assert.equal(scoring.scoreQuestion('Advanced', 'integer', null, '8'), 0);
    });
  });

  describe('Single-correct questions: Main and NEET', () => {
    it('awards +4 for correct, -1 for wrong, 0 for unattempted in JEE Main and NEET', () => {
      assert.equal(scoring.scoreQuestion('Main', 'mcq_single', 'B', 'B'), 4);
      assert.equal(scoring.scoreQuestion('Main', 'mcq_single', 'C', 'B'), -1);
      assert.equal(scoring.scoreQuestion('Main', 'mcq_single', null, 'B'), 0);

      assert.equal(scoring.scoreQuestion('NEET', 'mcq_single', 'D', 'D'), 4);
      assert.equal(scoring.scoreQuestion('NEET', 'mcq_single', 'A', 'D'), -1);
      assert.equal(scoring.scoreQuestion('NEET', 'mcq_single', '', 'D'), 0);
    });

    it('matchSingle handles lowercase letters and brackets', () => {
      assert.equal(grading.matchSingle('b', 'B'), true);
      assert.equal(grading.matchSingle('(c)', 'C'), true);
      assert.equal(grading.matchSingle('Option D', 'D'), true);
      // Rejects multi-letter answers
      assert.equal(grading.matchSingle('AB', 'A'), false);
    });
  });
});

describe('MockExamService concurrency, idempotency, and deadline enforcement', () => {
  it('isExamExpired correctly enforces exam duration plus grace window', () => {
    const start = new Date('2026-01-01T10:00:00Z');
    const base = start.getTime();
    // Exactly at duration (3600s): not expired
    assert.equal(isExamExpired(start, 3600, base + 3600 * 1000), false);
    // Within grace window (+10s): not expired
    assert.equal(isExamExpired(start, 3600, base + 3600 * 1000 + 10_000), false);
    // Past grace window (+20s where grace is 15s): expired
    assert.equal(isExamExpired(start, 3600, base + 3600 * 1000 + 20_000), true);
  });

  it('saveAnswer rejects modifications if exam is expired', async () => {
    const fakeRepo: any = {
      findStatusOwnerAndTiming: async () => ({
        userId: 'student-1',
        status: 'in_progress',
        durationSeconds: 1800,
        startedAt: new Date(Date.now() - 2000 * 1000), // well past 1800 + grace
      }),
    };
    const service = new MockExamService(fakeRepo, {} as any, {} as any, {} as any, {} as any, {} as any);

    await assert.rejects(
      () => service.saveAnswer('student-1', 'exam-1', 'mq-1', 'A'),
      (err: any) => err.statusCode === 400 && /Time is up/i.test(err.message),
    );
  });

  it('saveAnswer rejects modifications if exam is not in_progress', async () => {
    const fakeRepo: any = {
      findStatusOwnerAndTiming: async () => ({
        userId: 'student-1',
        status: 'submitted',
        durationSeconds: 1800,
        startedAt: new Date(),
      }),
    };
    const service = new MockExamService(fakeRepo, {} as any, {} as any, {} as any, {} as any, {} as any);

    await assert.rejects(
      () => service.saveAnswer('student-1', 'exam-1', 'mq-1', 'A'),
      (err: any) => err.statusCode === 400 && /Exam not in progress/i.test(err.message),
    );
  });

  it('submitMock is idempotent: returns existing resultId if already submitted', async () => {
    const fakeRepo: any = {
      findForSubmit: async () => ({
        userId: 'student-1',
        status: 'submitted',
      }),
      findResultByExamId: async () => ({ id: 'res-existing-999' }),
    };
    const service = new MockExamService(fakeRepo, {} as any, {} as any, {} as any, {} as any, {} as any);

    const result = await service.submitMock('student-1', 'exam-1');
    assert.equal(result.resultId, 'res-existing-999');
  });

  it('submitMock handles P2002 unique constraint race condition gracefully', async () => {
    const fakeRepo: any = {
      findForSubmit: async () => ({
        userId: 'student-1',
        status: 'in_progress',
        examType: 'Main',
        durationSeconds: 3600,
        startedAt: new Date(Date.now() - 1000),
        questions: [],
      }),
      createResultAndMarkSubmitted: async () => {
        const p2002Err: any = new Error('Unique constraint failed on MockExamResult.examId');
        p2002Err.code = 'P2002';
        throw p2002Err;
      },
      findResultByExamId: async () => ({ id: 'res-concurrent-created' }),
    };
    const fakeTopicRepo: any = {
      batchRecordExamResults: async () => {},
    };
    const fakeCache: any = {
      del: async () => {},
    };

    const service = new MockExamService(
      fakeRepo,
      fakeCache,
      new ScoringService(),
      {} as any,
      {} as any,
      fakeTopicRepo,
    );

    const res = await service.submitMock('student-1', 'exam-1');
    assert.equal(res.resultId, 'res-concurrent-created');
  });

  it('submitMock aggregates scores correctly across subjects and question types', async () => {
    let capturedResultPayload: any = null;
    const fakeRepo: any = {
      findForSubmit: async () => ({
        userId: 'student-1',
        status: 'in_progress',
        examType: 'Main',
        durationSeconds: 3600,
        startedAt: new Date(Date.now() - 500 * 1000),
        questions: [
          {
            id: 'mq1',
            questionId: 'q1',
            subject: 'Physics',
            savedAnswer: 'A',
            question: { questionType: 'mcq_single', answer: 'A', topicId: 'top1' },
          },
          {
            id: 'mq2',
            questionId: 'q2',
            subject: 'Physics',
            savedAnswer: 'B', // wrong -> -1
            question: { questionType: 'mcq_single', answer: 'C', topicId: 'top1' },
          },
          {
            id: 'mq3',
            questionId: 'q3',
            subject: 'Chemistry',
            savedAnswer: '42', // integer correct -> +4
            question: { questionType: 'integer', answer: '42', topicId: 'top2' },
          },
          {
            id: 'mq4',
            questionId: 'q4',
            subject: 'Chemistry',
            savedAnswer: '10', // integer wrong -> 0 (no penalty)
            question: { questionType: 'integer', answer: '20', topicId: 'top2' },
          },
          {
            id: 'mq5',
            questionId: 'q5',
            subject: 'Mathematics',
            savedAnswer: null, // skipped -> 0
            question: { questionType: 'mcq_single', answer: 'D', topicId: 'top3' },
          },
        ],
      }),
      createResultAndMarkSubmitted: async (payload: any) => {
        capturedResultPayload = payload;
        return { id: 'result-calc-1' };
      },
      findResultByExamId: async () => null,
    };
    const recordedMastery: any[] = [];
    const fakeTopicRepo: any = {
      batchRecordExamResults: async (_uid: string, items: any[]) => {
        recordedMastery.push(...items);
      },
    };
    const fakeCache: any = {
      del: async () => {},
    };

    const service = new MockExamService(
      fakeRepo,
      fakeCache,
      new ScoringService(),
      {} as any,
      {} as any,
      fakeTopicRepo,
    );

    const submission = await service.submitMock('student-1', 'exam-1');
    assert.equal(submission.resultId, 'result-calc-1');

    // Scores breakdown:
    // mq1: +4 (Physics)
    // mq2: -1 (Physics) -> Physics total = 3
    // mq3: +4 (Chemistry)
    // mq4: 0 (Chemistry) -> Chemistry total = 4
    // mq5: 0 (Mathematics) -> Math total = 0
    // Total = 3 + 4 + 0 = 7
    assert.equal(capturedResultPayload.physicsScore, 3);
    assert.equal(capturedResultPayload.chemistryScore, 4);
    assert.equal(capturedResultPayload.mathScore, 0);
    assert.equal(capturedResultPayload.totalScore, 7);
    assert.equal(capturedResultPayload.maxScore, 20); // 5 questions * 4 marks
    assert.equal(capturedResultPayload.correct, 2);
    assert.equal(capturedResultPayload.incorrect, 2);
    assert.equal(capturedResultPayload.unattempted, 1);

    // Topic mastery batch
    assert.equal(recordedMastery.length, 5);
    assert.equal(recordedMastery[0].topicId, 'top1');
    assert.equal(recordedMastery[0].isCorrect, true);
    assert.equal(recordedMastery[1].isCorrect, false);
    assert.equal(recordedMastery[1].marksLost, 5); // 4 - (-1) = 5 marks lost
  });
});
