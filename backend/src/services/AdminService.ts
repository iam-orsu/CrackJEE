import { createHash, timingSafeEqual } from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AUTH_CONSTANTS } from '../config/constants';
import { UserRepository } from '../repositories/UserRepository';
import { AttemptRepository } from '../repositories/AttemptRepository';
import { MockExamRepository } from '../repositories/MockExamRepository';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

function safeEqualStr(a: string, b: string): boolean {
  const left = createHash('sha256').update(a).digest();
  const right = createHash('sha256').update(b).digest();
  return timingSafeEqual(left, right);
}

export class AdminService {
  constructor(
    private readonly users: UserRepository = new UserRepository(),
    private readonly attempts: AttemptRepository = new AttemptRepository(),
    private readonly mocks: MockExamRepository = new MockExamRepository(),
    private readonly questions: QuestionRepository = new QuestionRepository(),
  ) {}

  public async login(email: string, password: string): Promise<{ token: string; expiresAt: string }> {
    const expectedEmail = process.env.SUPERADMIN_EMAIL;
    const passwordHash = process.env.SUPERADMIN_PASSWORD_HASH;
    const passwordPlain = process.env.SUPERADMIN_PASSWORD;

    if (!expectedEmail || (!passwordHash && !passwordPlain)) {
      throw new AppError(503, 'Super admin is not configured. Set SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD_HASH in .env');
    }

    const emailOk = safeEqualStr(email.trim().toLowerCase(), expectedEmail.trim().toLowerCase());

    let passwordOk: boolean;
    if (passwordHash) {
      passwordOk = await bcrypt.compare(password, passwordHash);
    } else {
      logger.warn('Admin login using plaintext SUPERADMIN_PASSWORD. Set SUPERADMIN_PASSWORD_HASH instead.');
      const left = createHash('sha256').update(password).digest();
      const right = createHash('sha256').update(passwordPlain!).digest();
      passwordOk = timingSafeEqual(left, right);
    }

    if (!emailOk || !passwordOk) throw new AppError(401, 'Invalid credentials');

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError(500, 'Server misconfiguration');

    const token = jwt.sign({ role: 'admin' }, secret, { algorithm: 'HS256', expiresIn: '8h' });
    const expiresAt = new Date(Date.now() + AUTH_CONSTANTS.ADMIN_COOKIE_MAX_AGE_S * 1000).toISOString();
    return { token, expiresAt };
  }

  public async getStats() {
    const [users, attemptGroups, correctGroups, mockGroups, mockResults, bankGroups] = await Promise.all([
      this.users.findAllForAdmin(),
      this.attempts.groupByUserForAdmin(),
      this.attempts.groupCorrectByUserForAdmin(),
      this.mocks.groupSubmittedByUserForAdmin(),
      this.mocks.findAllResultTotalsForAdmin(),
      this.questions.groupValidatedCountsBySubject({ validatedAt: { not: null } }),
    ]);

    const attempts = new Map<string, { count: number; last: Date | null }>();
    for (const g of attemptGroups) attempts.set(g.userId, { count: g._count._all, last: g._max.createdAt });
    const correct = new Map<string, number>();
    for (const g of correctGroups) correct.set(g.userId, g._count._all);
    const mocks = new Map<string, number>();
    for (const g of mockGroups) mocks.set(g.userId, g._count._all);

    const students = users
      .map((u) => {
        const a = attempts.get(u.id);
        const practiceAttempts = a?.count ?? 0;
        const practiceCorrect = correct.get(u.id) ?? 0;
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          class: u.class,
          targetExam: u.targetExam,
          joinedAt: u.createdAt.toISOString(),
          practiceAttempts,
          practiceAccuracy: practiceAttempts > 0 ? Math.round((practiceCorrect / practiceAttempts) * 100) : 0,
          mockSubmitted: mocks.get(u.id) ?? 0,
          lastActive: a?.last ? a.last.toISOString() : null,
        };
      })
      .sort((x, y) => (y.lastActive ?? '').localeCompare(x.lastActive ?? ''));

    const practiceAttempts = attemptGroups.reduce((sum, g) => sum + g._count._all, 0);
    const practiceCorrect = correctGroups.reduce((sum, g) => sum + g._count._all, 0);
    const mockSubmissions = mockGroups.reduce((sum, g) => sum + g._count._all, 0);
    const avgMockPercent = mockResults.length > 0
      ? Math.round(
          mockResults.reduce((sum, r) => sum + (r.maxScore > 0 ? (r.totalScore / r.maxScore) * 100 : 0), 0) /
            mockResults.length,
        )
      : null;

    const signupCounts = new Map<string, number>();
    for (const u of users) {
      const day = u.createdAt.toISOString().slice(0, 10);
      signupCounts.set(day, (signupCounts.get(day) ?? 0) + 1);
    }
    const signupsByDay: Array<{ date: string; count: number }> = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      signupsByDay.push({ date, count: signupCounts.get(date) ?? 0 });
    }

    const bySubject: Record<string, number> = { Physics: 0, Chemistry: 0, Mathematics: 0 };
    for (const g of bankGroups) bySubject[g.subject] = g._count._all;

    return {
      totals: {
        registered: users.length,
        tookPractice: attemptGroups.length,
        tookAnyExam: students.filter((s) => s.practiceAttempts > 0 || s.mockSubmitted > 0).length,
        practiceAttempts,
        practiceAccuracy: practiceAttempts > 0 ? Math.round((practiceCorrect / practiceAttempts) * 100) : 0,
        tookMock: mockGroups.length,
        mockSubmissions,
        avgMockPercent,
      },
      signupsByDay,
      bank: {
        total: Object.values(bySubject).reduce((sum, n) => sum + n, 0),
        bySubject,
      },
      students,
    };
  }

  public async getStudentDetail(id: string) {
    const user = await this.users.findSafeById(id);
    if (!user) throw new AppError(404, 'Student not found');

    const [attemptRows, mocks] = await Promise.all([
      this.attempts.findUserAttemptsForAdmin(id),
      this.mocks.findUserMocksForAdmin(id),
    ]);

    const topicMap = new Map<string, { subject: string; topic: string; attempts: number; correct: number }>();
    for (const a of attemptRows) {
      const key = `${a.question.subject}::${a.question.topic}`;
      const row = topicMap.get(key) ?? { subject: a.question.subject, topic: a.question.topic, attempts: 0, correct: 0 };
      row.attempts++;
      if (a.isCorrect) row.correct++;
      topicMap.set(key, row);
    }

    const topics = [...topicMap.values()]
      .map((t) => ({ ...t, accuracy: t.attempts > 0 ? Math.round((t.correct / t.attempts) * 100) : 0 }))
      .sort((a, b) => a.accuracy - b.accuracy);

    const answered = attemptRows.length;
    const correct = attemptRows.filter((a) => a.isCorrect).length;

    return {
      student: {
        id: user.id,
        name: user.name,
        email: user.email,
        class: user.class,
        targetExam: user.targetExam,
        currentLevel: user.currentLevel,
        joinedAt: user.createdAt.toISOString(),
      },
      summary: {
        answered,
        correct,
        wrong: answered - correct,
        accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0,
      },
      topics,
      mocks: mocks.map((m) => ({
        id: m.id,
        examType: m.examType,
        difficultyMode: m.difficultyMode,
        status: m.status,
        createdAt: m.createdAt.toISOString(),
        submittedAt: m.submittedAt ? m.submittedAt.toISOString() : null,
        result: m.result,
      })),
    };
  }

  public async getMockDetail(examId: string) {
    const exam = await this.mocks.findExamForAdminDetail(examId);
    if (!exam) throw new AppError(404, 'Exam not found');

    const breakdown = (exam.result?.scoreBreakdown ?? {}) as Record<string, { awarded: number; maxMarks: number }>;

    return {
      exam: {
        id: exam.id,
        examType: exam.examType,
        status: exam.status,
        createdAt: exam.createdAt.toISOString(),
        submittedAt: exam.submittedAt ? exam.submittedAt.toISOString() : null,
        studentName: exam.user.name,
        studentEmail: exam.user.email,
      },
      result: exam.result
        ? {
            totalScore: exam.result.totalScore,
            maxScore: exam.result.maxScore,
            correct: exam.result.correct,
            incorrect: exam.result.incorrect,
            unattempted: exam.result.unattempted,
            timeTaken: exam.result.timeTaken,
          }
        : null,
      questions: exam.questions.map((q) => ({
        questionNumber: q.questionNumber,
        subject: q.subject,
        topic: q.question.topic,
        difficulty: q.question.difficulty,
        questionType: q.question.questionType,
        questionText: q.question.questionText,
        options: q.question.options as string[],
        submitted: q.savedAnswer,
        correctAnswer: q.question.answer,
        explanation: q.question.explanation,
        markedForReview: q.markedForReview,
        awarded: breakdown[q.id]?.awarded ?? null,
        maxMarks: breakdown[q.id]?.maxMarks ?? null,
      })),
    };
  }
}
