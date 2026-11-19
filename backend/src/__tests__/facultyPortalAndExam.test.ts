import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { FacultyBatchService } from '../services/FacultyBatchService';
import { FacultyAssignmentService } from '../services/FacultyAssignmentService';
import { FacultyStudentExamService } from '../services/FacultyStudentExamService';
import { PsychometricEvaluationWorker } from '../services/PsychometricEvaluationWorker';
import { scoringService } from '../services/ScoringService';
import { gradingService } from '../services/GradingService';

process.env.JWT_SECRET = 'test-secret-key-1234567890123456';

describe('Faculty Batch & Student Management', () => {
  test('creates batch and prevents duplicate batch code within same faculty', async () => {
    const batches: any[] = [];
    const mockBatchRepo: any = {
      findByCode: async (facultyId: string, code: string) =>
        batches.find((b) => b.facultyId === facultyId && b.code === code) || null,
      create: async (data: any) => {
        const item = { id: `batch-${Date.now()}`, ...data };
        batches.push(item);
        return item;
      },
      listByFaculty: async (facultyId: string) => batches.filter((b) => b.facultyId === facultyId),
      findById: async (id: string, facultyId: string) =>
        batches.find((b) => b.id === id && b.facultyId === facultyId) || null,
    };

    const service = new FacultyBatchService(mockBatchRepo, {} as any);

    const b1 = await service.createBatch('fac-1', {
      name: 'Alpha Batch 2026',
      code: 'ALPHA-26',
      description: 'Morning cohort',
    });
    assert.equal(b1.code, 'ALPHA-26');

    await assert.rejects(
      async () => {
        await service.createBatch('fac-1', {
          name: 'Another Alpha',
          code: 'alpha-26', // Case-insensitive check
        });
      },
      (err: any) => err.statusCode === 409,
    );

    // Different faculty can have the same code
    const b2 = await service.createBatch('fac-2', {
      name: 'Alpha Batch Other Faculty',
      code: 'ALPHA-26',
    });
    assert.equal(b2.facultyId, 'fac-2');
  });

  test('provisions student with encrypted password and checks roll number uniqueness', async () => {
    const students: any[] = [];
    const mockBatchRepo: any = {
      findById: async (id: string, facultyId: string) => ({ id, facultyId, name: 'Batch 1' }),
    };
    const mockStudentRepo: any = {
      findByRollNumber: async (facultyId: string, roll: string) =>
        students.find((s) => s.facultyId === facultyId && s.rollNumber === roll) || null,
      create: async (data: any) => {
        const item = { id: `stu-${Date.now()}`, ...data };
        students.push(item);
        return item;
      },
    };

    const service = new FacultyBatchService(mockBatchRepo, mockStudentRepo);

    const res = await service.createStudent('fac-1', {
      batchId: 'batch-1',
      name: 'Rahul Sharma',
      rollNumber: 'JEE-101',
    });

    assert.equal(res.student.name, 'Rahul Sharma');
    assert.equal(res.initialPassword, 'JEE-101'); // Defaults to roll number
    assert.ok(await bcrypt.compare('JEE-101', res.student.passwordHash));

    // Duplicate roll number for same faculty rejected
    await assert.rejects(
      async () => {
        await service.createStudent('fac-1', {
          batchId: 'batch-1',
          name: 'Another Student',
          rollNumber: 'jee-101',
        });
      },
      (err: any) => err.statusCode === 409,
    );
  });

  test('updates batch details and validates code uniqueness', async () => {
    const batches: any[] = [
      { id: 'b-1', facultyId: 'fac-1', name: 'Batch One', code: 'B1', description: 'Desc 1' },
      { id: 'b-2', facultyId: 'fac-1', name: 'Batch Two', code: 'B2', description: 'Desc 2' },
    ];
    const mockBatchRepo: any = {
      findById: async (id: string, facultyId: string) =>
        batches.find((b) => b.id === id && b.facultyId === facultyId) || null,
      findByCode: async (facultyId: string, code: string) =>
        batches.find((b) => b.facultyId === facultyId && b.code === code) || null,
      update: async (id: string, facultyId: string, data: any) => {
        const item = batches.find((b) => b.id === id && b.facultyId === facultyId);
        Object.assign(item, data);
        return item;
      },
    };

    const service = new FacultyBatchService(mockBatchRepo, {} as any);

    const updated = await service.updateBatch('b-1', 'fac-1', {
      name: 'Batch One Renamed',
      description: 'Updated description',
    });
    assert.equal(updated.name, 'Batch One Renamed');
    assert.equal(updated.description, 'Updated description');

    // Reject conflicting code
    await assert.rejects(
      async () => {
        await service.updateBatch('b-1', 'fac-1', { code: 'b2' });
      },
      (err: any) => err.statusCode === 409,
    );
  });

  test('updates student profile email and resets student password', async () => {
    let student = {
      id: 'stu-1',
      facultyId: 'fac-1',
      batchId: 'batch-1',
      name: 'Old Name',
      rollNumber: 'ROLL-1',
      email: 'old@example.com',
      passwordHash: 'hash',
    };
    const mockStudentRepo: any = {
      findById: async (id: string, facultyId: string) =>
        student.id === id && student.facultyId === facultyId ? student : null,
      findByRollNumber: async () => null,
      update: async (id: string, facultyId: string, data: any) => {
        student = { ...student, ...data };
        return student;
      },
      updatePassword: async (id: string, facultyId: string, hash: string) => {
        student.passwordHash = hash;
        return student;
      },
    };

    const service = new FacultyBatchService({} as any, mockStudentRepo);

    // Update email and name
    const updated = await service.updateStudent('stu-1', 'fac-1', {
      name: 'New Name',
      email: 'new@example.com',
    });
    assert.equal(updated.name, 'New Name');
    assert.equal(updated.email, 'new@example.com');

    // Reset password with custom password
    const reset1 = await service.resetStudentPassword('stu-1', 'fac-1', 'SecretPass@123');
    assert.equal(reset1.newPassword, 'SecretPass@123');
    assert.ok(await bcrypt.compare('SecretPass@123', student.passwordHash));

    // Reset password without specifying defaults to roll number
    const reset2 = await service.resetStudentPassword('stu-1', 'fac-1');
    assert.equal(reset2.newPassword, 'ROLL-1');
    assert.ok(await bcrypt.compare('ROLL-1', student.passwordHash));
  });
});

describe('Faculty Exam Assignment & Student Delivery Integrity', () => {
  const sampleItems = [
    {
      number: 1,
      subject: 'Physics',
      topic: 'Kinematics',
      questionType: 'mcq_single',
      questionText: 'A car accelerates from rest at 2 m/s^2 for 5s. What is its velocity?',
      options: ['5 m/s', '10 m/s', '15 m/s', '20 m/s'],
      correctAnswer: 'B',
      explanation: 'Using v = u + at = 0 + 2*5 = 10 m/s.',
      diagram: null,
      verified: true,
    },
    {
      number: 2,
      subject: 'Mathematics',
      topic: 'Quadratic Equations',
      questionType: 'integer',
      questionText: 'Find the sum of roots of x^2 - 7x + 12 = 0.',
      options: [],
      correctAnswer: '7',
      explanation: 'Sum of roots = -b/a = 7/1 = 7.',
      diagram: null,
      verified: true,
    },
  ];

  test('strips correct answers and explanations when student starts the exam', async () => {
    const mockAssignmentRepo: any = {
      findByIdGlobal: async (id: string) => ({
        id,
        batchId: 'batch-1',
        title: 'Weekly Drill 1',
        instructions: 'Test instructions',
        durationMinutes: 60,
        startTime: null,
        endTime: null,
        paper: {
          id: 'paper-1',
          examType: 'Main',
          questionCount: 2,
          items: sampleItems,
        },
      }),
    };
    const mockStudentRepo: any = {
      findByIdGlobal: async (id: string) => ({
        id,
        batchId: 'batch-1',
        isActive: true,
      }),
    };
    const mockExamRepo: any = {
      findOrCreate: async () => ({
        id: 'session-1',
        status: 'in_progress',
        answers: {},
        timeTakenSeconds: 0,
      }),
    };

    const examService = new FacultyStudentExamService(mockStudentRepo, mockAssignmentRepo, mockExamRepo);
    const delivery = await examService.startExam('assign-1', 'stu-1');

    assert.equal(delivery.questions.length, 2);
    // CRITICAL: Ensure correctAnswer and explanation are completely stripped from student payload
    for (const q of delivery.questions) {
      assert.equal((q as any).correctAnswer, undefined, 'Student payload must NOT leak correctAnswer');
      assert.equal((q as any).explanation, undefined, 'Student payload must NOT leak explanation');
      assert.ok(q.questionText);
    }
  });

  test('auto-grades exam on submit with correct JEE Main marking rules', async () => {
    let submittedRecord: any = null;
    const mockAssignmentRepo: any = {
      findByIdGlobal: async () => ({
        id: 'assign-1',
        paper: {
          examType: 'Main',
          items: sampleItems,
        },
      }),
    };
    const mockExamRepo: any = {
      findByAssignmentAndStudent: async () => ({
        id: 'session-1',
        status: 'in_progress',
      }),
      submit: async (_id: string, data: any) => {
        submittedRecord = data;
        return data;
      },
    };

    const examService = new FacultyStudentExamService({} as any, mockAssignmentRepo, mockExamRepo);

    // Student answered Q1 correctly (B -> +4), Q2 wrong (5 instead of 7 -> 0)
    const result = await examService.submitExam('assign-1', 'stu-1', { '1': 'B', '2': '5' }, 1200);

    assert.equal(result.totalScore, 4); // +4 for Q1, 0 for wrong integer in JEE Main
    assert.equal(result.maxScore, 8); // 4 + 4
    assert.equal(result.correctCount, 1);
    assert.equal(result.incorrectCount, 1);
    assert.equal(result.unattemptedCount, 0);
    assert.equal(submittedRecord.status, 'submitted');
  });

  test('computes batch rank list accurately in results', async () => {
    const mockExamRepo: any = {
      findByAssignmentAndStudent: async () => ({
        id: 'session-2',
        status: 'submitted',
        totalScore: 4,
        maxScore: 8,
        correctCount: 1,
        incorrectCount: 1,
        unattemptedCount: 0,
        timeTakenSeconds: 900,
        answers: { '1': 'B', '2': '5' },
        resultBreakdown: {},
      }),
      getBatchResults: async () => [
        { student: { id: 'stu-topper' }, totalScore: 8 },
        { student: { id: 'stu-2' }, totalScore: 4 },
        { student: { id: 'stu-3' }, totalScore: 0 },
      ],
    };
    const mockAssignmentRepo: any = {
      findByIdGlobal: async () => ({
        id: 'assign-1',
        title: 'Weekly Drill 1',
        showSolutions: true,
        batch: { name: 'Batch A' },
        faculty: { name: 'Dr. Rao' },
        paper: { examType: 'Main', items: sampleItems },
      }),
    };

    const examService = new FacultyStudentExamService({} as any, mockAssignmentRepo, mockExamRepo);
    const report = await examService.getExamResult('assign-1', 'stu-2');

    assert.equal(report.scorecard.rank, 2); // 2nd rank out of 3
    assert.equal(report.scorecard.totalScore, 4);
    assert.ok(report.solutions);
    assert.equal(report.solutions.length, 2);
    // Solutions are included with explanations when showSolutions is true
    assert.equal(report.solutions[0].correctAnswer, 'B');
    assert.ok(report.solutions[0].explanation.includes('Using v = u + at'));
  });

  test('enforces server-side time limit on saving answers', async () => {
    const mockAssignmentRepo: any = {
      findByIdGlobal: async () => ({
        id: 'assign-1',
        durationMinutes: 60, // 3600 seconds
        endTime: null,
      }),
    };
    const mockExamRepo: any = {
      findByAssignmentAndStudent: async () => ({
        id: 'session-1',
        status: 'in_progress',
      }),
      saveAnswers: async () => {},
    };

    const examService = new FacultyStudentExamService({} as any, mockAssignmentRepo, mockExamRepo);

    // Within limit (3500s <= 3600s + 120s grace)
    const valid = await examService.saveAnswers('assign-1', 'stu-1', { '1': 'A' }, 3500);
    assert.ok(valid.success);

    // Over limit (4000s > 3720s)
    await assert.rejects(
      async () => {
        await examService.saveAnswers('assign-1', 'stu-1', { '1': 'A' }, 4000);
      },
      (err: any) => err.statusCode === 400 && err.message.includes('time limit exceeded'),
    );
  });

  test('hides solutions and sanitizes item results when showSolutions is disabled', async () => {
    const mockExamRepo: any = {
      findByAssignmentAndStudent: async () => ({
        id: 'session-3',
        status: 'submitted',
        totalScore: 4,
        maxScore: 8,
        correctCount: 1,
        incorrectCount: 1,
        unattemptedCount: 0,
        timeTakenSeconds: 1500,
        answers: { '1': 'B', '2': '5' },
        resultBreakdown: {
          itemResults: {
            '1': { submitted: 'B', isCorrect: true, score: 4, maxScore: 4 },
            '2': { submitted: '5', isCorrect: false, score: 0, maxScore: 4 },
          },
        },
      }),
      countStudentsScoredHigher: async () => 0,
      countBatchSubmissions: async () => 1,
    };
    const mockAssignmentRepo: any = {
      findByIdGlobal: async () => ({
        id: 'assign-1',
        title: 'Weekly Drill 1',
        showSolutions: false, // Closed window: solutions hidden
        batch: { name: 'Batch A' },
        faculty: { name: 'Dr. Rao' },
        paper: { examType: 'Main', items: sampleItems },
      }),
    };

    const examService = new FacultyStudentExamService({} as any, mockAssignmentRepo, mockExamRepo);
    const report = await examService.getExamResult('assign-1', 'stu-3');

    assert.equal(report.solutions, null, 'Solutions array must be null when showSolutions is false');
    const breakdown = report.scorecard.resultBreakdown as any;
    assert.ok(breakdown?.itemResults['1']);
    assert.equal(breakdown.itemResults['1'].submitted, 'B');
    assert.equal(breakdown.itemResults['1'].isCorrect, undefined, 'isCorrect must be stripped');
    assert.equal(breakdown.itemResults['1'].score, undefined, 'score must be stripped from individual items');
  });

  test('supports disambiguated student login via optional batchCode', async () => {
    const hash = await bcrypt.hash('secret123', 10);
    const mockStudentRepo: any = {
      findByCredentials: async () => [
        {
          id: 'stu-a',
          name: 'Same Roll in Batch A',
          rollNumber: '101',
          passwordHash: hash,
          isActive: true,
          facultyId: 'fac-1',
          batchId: 'batch-a',
          batch: { id: 'batch-a', name: 'Batch A', code: 'ALPHA' },
          faculty: { id: 'fac-1', name: 'Fac 1' },
        },
        {
          id: 'stu-b',
          name: 'Same Roll in Batch B',
          rollNumber: '101',
          passwordHash: hash,
          isActive: true,
          facultyId: 'fac-2',
          batchId: 'batch-b',
          batch: { id: 'batch-b', name: 'Batch B', code: 'BETA' },
          faculty: { id: 'fac-2', name: 'Fac 2' },
        },
      ],
    };

    const examService = new FacultyStudentExamService(mockStudentRepo, {} as any, {} as any);

    // Disambiguate with batchCode 'BETA'
    const res = await examService.login('101', 'secret123', 'BETA');
    assert.equal(res.student.id, 'stu-b');
    assert.equal(res.student.batch.code, 'BETA');
  });

  test('exportAssignmentResultsCsv formats CSV columns according to exam department (Main, NEET, Psychometric)', async () => {
    const mockAssignmentRepo: any = {
      findById: async (id: string) => {
        if (id === 'main-assign') {
          return {
            id: 'main-assign',
            title: 'JEE Main Mock 1',
            batch: { name: 'Batch Alpha', code: 'ALPHA' },
            paper: { title: 'JEE Main Paper', examType: 'Main' },
            studentExams: [
              {
                status: 'submitted',
                totalScore: 240,
                maxScore: 300,
                correctCount: 60,
                incorrectCount: 15,
                unattemptedCount: 0,
                timeTakenSeconds: 7200,
                submittedAt: new Date('2026-11-18T10:00:00Z'),
                student: { name: 'Arjun Sharma', rollNumber: 'R101' },
                resultBreakdown: {
                  accuracyPct: 80,
                  subjectBreakdown: {
                    Physics: { score: 80 },
                    Chemistry: { score: 75 },
                    Mathematics: { score: 85 },
                  },
                },
              },
            ],
          };
        }
        if (id === 'neet-assign') {
          return {
            id: 'neet-assign',
            title: 'NEET Full Diagnostic',
            batch: { name: 'Batch Medico', code: 'MED1' },
            paper: { title: 'NEET 2026 Paper', examType: 'NEET' },
            studentExams: [
              {
                status: 'submitted',
                totalScore: 650,
                maxScore: 720,
                correctCount: 165,
                incorrectCount: 15,
                unattemptedCount: 0,
                timeTakenSeconds: 10800,
                submittedAt: new Date('2026-11-18T11:00:00Z'),
                student: { name: 'Priya Patel', rollNumber: 'N202' },
                resultBreakdown: {
                  accuracyPct: 91,
                  subjectBreakdown: {
                    Physics: { score: 150 },
                    Chemistry: { score: 160 },
                    Biology: { score: 340 },
                  },
                },
              },
            ],
          };
        }
        return {
          id: 'psy-assign',
          title: 'Psychometric Trait Assessment',
          batch: { name: 'Batch CS', code: 'CS1' },
          paper: { title: 'CS Aptitude Paper', examType: 'Psychometric' },
          studentExams: [
            {
              status: 'submitted',
              totalScore: 88,
              maxScore: 100,
              correctCount: 22,
              incorrectCount: 2,
              partialCount: 0,
              unattemptedCount: 0,
              timeTakenSeconds: 1800,
              submittedAt: new Date('2026-11-18T12:00:00Z'),
              student: { name: 'Rahul Verma', rollNumber: 'P303' },
              resultBreakdown: {
                accuracyPct: 92,
              },
            },
          ],
        };
      },
    };

    const assignmentService = new FacultyAssignmentService(mockAssignmentRepo, {} as any, {} as any);

    // 1. JEE Main CSV test
    const mainCsv = await assignmentService.exportAssignmentResultsCsv('main-assign', 'fac-1');
    assert.ok(mainCsv.filename.includes('Main-Results.csv'));
    assert.ok(mainCsv.csv.includes('Physics Score'));
    assert.ok(mainCsv.csv.includes('Chemistry Score'));
    assert.ok(mainCsv.csv.includes('Mathematics Score'));
    assert.ok(mainCsv.csv.includes('Arjun Sharma'));
    assert.ok(mainCsv.csv.includes('240'));

    // 2. NEET CSV test
    const neetCsv = await assignmentService.exportAssignmentResultsCsv('neet-assign', 'fac-1');
    assert.ok(neetCsv.filename.includes('NEET-Results.csv'));
    assert.ok(neetCsv.csv.includes('Biology (/360)'));
    assert.ok(neetCsv.csv.includes('Priya Patel'));
    assert.ok(neetCsv.csv.includes('650'));

    // 3. Psychometric CSV test
    const psyCsv = await assignmentService.exportAssignmentResultsCsv('psy-assign', 'fac-1');
    assert.ok(psyCsv.filename.includes('Psychometric-Results.csv'));
    assert.ok(psyCsv.csv.includes('Total Alignment Score'));
    assert.ok(psyCsv.csv.includes('Predicted Best-Fit Role'));
    assert.ok(psyCsv.csv.includes('Role Fit Reason (1-2 lines)'));
    assert.ok(psyCsv.csv.includes('Rahul Verma'));
  });

  test('Psychometric worker recovers interrupted jobs, claims pending exams atomically, and paces evaluation', async () => {
    let recoveredCount = 0;
    const exams = [
      {
        id: 'exam-pending-1',
        answers: { '1': 'A' },
        timeTakenSeconds: 120,
        assignment: {
          paper: {
            examType: 'Psychometric',
            items: [
              {
                number: 1,
                subject: 'Psychometric',
                topic: 'Situational Judgment & Workplace Scenarios',
                questionText: 'A high-load database outage occurs during peak traffic.',
                options: ['Investigate root cause', 'Wait for restart'],
                correctAnswer: 'A',
                explanation: 'Take initiative and ownership.',
              },
            ],
            title: 'Systems Engineering Readiness',
            customInstructions: 'Evaluate candidate aptitude for Backend Infrastructure Engineer',
          },
        },
        student: {
          id: 'st-worker-1',
          name: 'Ananya Roy',
          rollNumber: 'ROLL-WORKER-1',
        },
      },
    ];

    let claimed = false;
    let completedLiveReport: any = null;

    const mockExamRepo: any = {
      recoverStuckPsychometricJobs: async () => {
        recoveredCount += 3;
        return 3;
      },
      findPendingPsychometricExams: async () => {
        if (claimed) return [];
        return exams;
      },
      claimPendingPsychometricExam: async (id: string) => {
        if (claimed) return false;
        claimed = true;
        return true;
      },
      completeAiEvaluation: async (id: string, report: any) => {
        completedLiveReport = report;
      },
      markEvaluationFailedOrRetry: async () => {},
    };

    const worker = new PsychometricEvaluationWorker(mockExamRepo, 10);
    await worker.start();
    assert.equal(recoveredCount, 3);

    // Wait for the worker to process the queued item
    const start = Date.now();
    while (!completedLiveReport && Date.now() - start < 8000) {
      await new Promise((r) => setTimeout(r, 50));
    }
    await worker.stop(2000);

    assert.equal(claimed, true);
    assert.ok(completedLiveReport);
    assert.ok(completedLiveReport.predictedRole);
    assert.ok(completedLiveReport.roleReason);
  });
});
