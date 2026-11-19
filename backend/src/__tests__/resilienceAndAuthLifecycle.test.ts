import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { requireAuth, requireRefreshableAuth } from '../middlewares/auth.middleware';
import { requireFacultyStudent, requireRefreshableFacultyStudent } from '../middlewares/facultyStudentAuth.middleware';
import { errorHandlerMiddleware } from '../middlewares/errorHandler.middleware';
import { FacultyStudentExamService } from '../services/FacultyStudentExamService';
import { MockExamService } from '../services/MockExamService';

const TEST_SECRET = 'test-jwt-resilience-secret-crackjee-2026';

describe('Fault Tolerance, Auth Lifecycle & Active Exam Resilience', () => {
  before(() => {
    process.env.JWT_SECRET = TEST_SECRET;
  });

  describe('JWT Token Expiration & Refresh Flow', () => {
    it('standard requireAuth rejects expired tokens with 401', async () => {
      // Token expired 10 minutes ago
      const expiredToken = jwt.sign(
        { userId: 'student-uuid-1', jti: 'jti-1', sessionStart: Date.now() - 3600 * 1000 },
        TEST_SECRET,
        { algorithm: 'HS256', expiresIn: -600 },
      );

      let status = 0;
      let jsonBody: any = null;
      let nextCalled = false;
      const req: any = { headers: { authorization: `Bearer ${expiredToken}` } };
      const res: any = {
        status: (code: number) => { status = code; return res; },
        json: (data: any) => { jsonBody = data; },
      };

      requireAuth(req, res, () => { nextCalled = true; });

      // Give async microtasks a tick
      await new Promise((r) => setImmediate(r));

      assert.equal(nextCalled, false);
      assert.equal(status, 401);
      assert.equal(jsonBody.error, 'Invalid or expired token');
    });

    it('requireRefreshableAuth allows cryptographically authentic expired token within 7-day session window', async () => {
      // Mock userRepo exists check
      const expiredToken = jwt.sign(
        { userId: 'student-uuid-1', sessionStart: Date.now() - 3600 * 1000 },
        TEST_SECRET,
        { algorithm: 'HS256', expiresIn: -600 },
      );

      let nextCalled = false;
      const req: any = { headers: { authorization: `Bearer ${expiredToken}` } };
      const res: any = {
        status: () => res,
        json: () => {},
      };

      const mockUserRepo: any = {
        existsById: async (id: string) => id === 'student-uuid-1',
      };

      await new Promise<void>((resolve, reject) => {
        requireRefreshableAuth(req, res, (err?: any) => {
          if (err) reject(err);
          else {
            nextCalled = true;
            resolve();
          }
        }, mockUserRepo);
      });

      assert.equal(nextCalled, true);
      assert.equal(req.user?.userId, 'student-uuid-1');
    });

    it('requireRefreshableAuth rejects tampered tokens with 401', async () => {
      let status = 0;
      let jsonBody: any = null;
      let nextCalled = false;
      const req: any = { headers: { authorization: 'Bearer header.tamperedpayload.invalidsignature' } };
      const res: any = {
        status: (code: number) => { status = code; return res; },
        json: (data: any) => { jsonBody = data; },
      };

      requireRefreshableAuth(req, res, () => { nextCalled = true; });
      await new Promise((r) => setTimeout(r, 10));

      assert.equal(nextCalled, false);
      assert.equal(status, 401);
      assert.equal(jsonBody.error, 'Invalid or tampered token');
    });

    it('requireRefreshableAuth rejects sessions older than 7 days with 401', async () => {
      const eightDaysAgo = Date.now() - (8 * 24 * 60 * 60 * 1000);
      const expiredToken = jwt.sign(
        { userId: 'student-uuid-1', jti: 'jti-old', sessionStart: eightDaysAgo },
        TEST_SECRET,
        { algorithm: 'HS256', expiresIn: -600 },
      );

      let status = 0;
      let jsonBody: any = null;
      let nextCalled = false;
      const req: any = { headers: { authorization: `Bearer ${expiredToken}` } };
      const res: any = {
        status: (code: number) => { status = code; return res; },
        json: (data: any) => { jsonBody = data; },
      };

      requireRefreshableAuth(req, res, () => { nextCalled = true; });
      await new Promise((r) => setTimeout(r, 10));

      assert.equal(nextCalled, false);
      assert.equal(status, 401);
      assert.equal(jsonBody.error, 'Session expired, please log in again');
    });
  });

  describe('Faculty Student Token Refresh Lifecycle', () => {
    const activeStudent = {
      id: 'fs-student-1',
      facultyId: 'fac-1',
      batchId: 'batch-1',
      name: 'Rohan Sharma',
      rollNumber: 'JEE2026-001',
      isActive: true,
    };

    const inactiveStudent = {
      id: 'fs-student-inactive',
      facultyId: 'fac-1',
      batchId: 'batch-1',
      name: 'Deactivated Student',
      rollNumber: 'JEE2026-999',
      isActive: false,
    };

    const fakeStudentRepo: any = {
      findByIdGlobal: async (id: string) => {
        if (id === activeStudent.id) return activeStudent;
        if (id === inactiveStudent.id) return inactiveStudent;
        return null;
      },
    };

    const standardStudentGuard = requireFacultyStudent(fakeStudentRepo);
    const refreshableStudentGuard = requireRefreshableFacultyStudent(fakeStudentRepo);

    it('standard guard rejects expired faculty student token with 401', async () => {
      const expiredToken = jwt.sign(
        {
          studentId: activeStudent.id,
          facultyId: activeStudent.facultyId,
          batchId: activeStudent.batchId,
          role: 'faculty_student',
        },
        TEST_SECRET,
        { algorithm: 'HS256', expiresIn: -300 },
      );

      let status = 0;
      let jsonBody: any = null;
      let nextCalled = false;
      const req: any = { headers: { authorization: `Bearer ${expiredToken}` } };
      const res: any = {
        status: (code: number) => { status = code; return res; },
        json: (data: any) => { jsonBody = data; },
      };

      await standardStudentGuard(req, res, () => { nextCalled = true; });

      assert.equal(nextCalled, false);
      assert.equal(status, 401);
      assert.equal(jsonBody.error, 'Invalid or expired student session');
    });

    it('refreshable guard accepts expired student token and allows refresh', async () => {
      const expiredToken = jwt.sign(
        {
          studentId: activeStudent.id,
          facultyId: activeStudent.facultyId,
          batchId: activeStudent.batchId,
          role: 'faculty_student',
        },
        TEST_SECRET,
        { algorithm: 'HS256', expiresIn: -300 },
      );

      let status = 0;
      let jsonBody: any = null;
      let nextCalled = false;
      const req: any = { headers: { authorization: `Bearer ${expiredToken}` } };
      const res: any = {
        status: (code: number) => { status = code; return res; },
        json: (data: any) => { jsonBody = data; },
      };

      await refreshableStudentGuard(req, res, () => { nextCalled = true; });

      assert.equal(nextCalled, true);
      assert.equal(req.facultyStudent?.studentId, activeStudent.id);
      assert.equal(req.facultyStudent?.rollNumber, 'JEE2026-001');
    });

    it('refreshable guard rejects deactivated student account with 403', async () => {
      const token = jwt.sign(
        {
          studentId: inactiveStudent.id,
          facultyId: inactiveStudent.facultyId,
          batchId: inactiveStudent.batchId,
          role: 'faculty_student',
        },
        TEST_SECRET,
        { algorithm: 'HS256', expiresIn: 3600 },
      );

      let status = 0;
      let jsonBody: any = null;
      let nextCalled = false;
      const req: any = { headers: { authorization: `Bearer ${token}` } };
      const res: any = {
        status: (code: number) => { status = code; return res; },
        json: (data: any) => { jsonBody = data; },
      };

      await refreshableStudentGuard(req, res, () => { nextCalled = true; });

      assert.equal(nextCalled, false);
      assert.equal(status, 403);
      assert.equal(jsonBody.error, 'Student account is inactive or not found');
    });
  });

  describe('Database Error Handling & 503 Service Unavailable Mapping', () => {
    it('maps Prisma P1001 (database connection failure) to 503 with Retry-After header', () => {
      let status = 0;
      let jsonBody: any = null;
      const headers: Record<string, string> = {};
      const req: any = {};
      const res: any = {
        setHeader: (name: string, value: string) => { headers[name] = value; },
        status: (code: number) => { status = code; return res; },
        json: (data: any) => { jsonBody = data; },
      };

      const prismaError = new Error('Can not reach database server at 127.0.0.1:3306');
      (prismaError as any).code = 'P1001';

      errorHandlerMiddleware(prismaError, req, res, () => {});

      assert.equal(status, 503);
      assert.equal(headers['Retry-After'], '2');
      assert.equal(jsonBody.success, false);
      assert.equal(jsonBody.retryAfterSeconds, 2);
      assert.match(jsonBody.error, /Database temporarily unavailable/i);
    });

    it('maps Prisma P1008 (operations timed out) to 503 with Retry-After', () => {
      let status = 0;
      let jsonBody: any = null;
      const headers: Record<string, string> = {};
      const req: any = {};
      const res: any = {
        setHeader: (name: string, value: string) => { headers[name] = value; },
        status: (code: number) => { status = code; return res; },
        json: (data: any) => { jsonBody = data; },
      };

      const prismaError = new Error('Operations timed out after 5000ms');
      (prismaError as any).code = 'P1008';

      errorHandlerMiddleware(prismaError, req, res, () => {});

      assert.equal(status, 503);
      assert.equal(headers['Retry-After'], '2');
      assert.equal(jsonBody.success, false);
    });

    it('forwards error to next without crashing if response headers were already sent', () => {
      let nextCalledWith: any = null;
      const req: any = {};
      const res: any = {
        headersSent: true,
        status: () => { throw new Error('Cannot set status after headers sent'); },
        json: () => { throw new Error('Cannot write json after headers sent'); },
      };

      const testError = new Error('Late stream write failure');
      errorHandlerMiddleware(testError, req, res, (err: any) => { nextCalledWith = err; });

      assert.equal(nextCalledWith, testError);
    });
  });

  describe('Exam Submission Idempotency Under Concurrent Calls', () => {
    it('FacultyStudentExamService.submitExam returns existing score on duplicate submit', async () => {
      const mockSession = {
        id: 'sess-100',
        assignmentId: 'asg-1',
        studentId: 'stud-1',
        status: 'submitted',
        totalScore: 180,
        maxScore: 300,
        correctCount: 45,
        partialCount: 0,
        incorrectCount: 10,
        unattemptedCount: 20,
      };

      const fakeExamRepo: any = {
        findByAssignmentAndStudent: async () => mockSession,
      };

      const service = new FacultyStudentExamService(
        {} as any,
        {} as any,
        fakeExamRepo,
      );

      // Submit once
      const res1 = await service.submitExam('asg-1', 'stud-1', { '1': 'A' }, 3600);
      assert.equal(res1.success, true);
      assert.equal(res1.alreadySubmitted, true);
      assert.equal(res1.totalScore, 180);

      // Submit again immediately (simulating double click or network retry)
      const res2 = await service.submitExam('asg-1', 'stud-1', { '1': 'A' }, 3600);
      assert.equal(res2.success, true);
      assert.equal(res2.alreadySubmitted, true);
      assert.equal(res2.totalScore, 180);
    });

    it('MockExamService.submitMock returns existing resultId without failure on repeat submit', async () => {
      const fakeMockRepo: any = {
        findForSubmit: async () => ({
          userId: 'stud-2',
          status: 'submitted',
        }),
        findResultByExamId: async () => ({ id: 'mock-res-555' }),
      };

      const mockService = new MockExamService(
        fakeMockRepo,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
      );

      const result = await mockService.submitMock('stud-2', 'mock-exam-1');
      assert.equal(result.resultId, 'mock-res-555');
    });

    it('handles 20 concurrent duplicate submitExam requests safely without throwing or duplicating state', async () => {
      const mockSession = {
        id: 'sess-concurrent-1',
        assignmentId: 'asg-conc',
        studentId: 'stud-conc',
        status: 'submitted',
        totalScore: 240,
        maxScore: 300,
        correctCount: 60,
        partialCount: 0,
        incorrectCount: 0,
        unattemptedCount: 15,
      };

      const fakeExamRepo: any = {
        findByAssignmentAndStudent: async () => mockSession,
      };

      const service = new FacultyStudentExamService(
        {} as any,
        {} as any,
        fakeExamRepo,
      );

      // Launch 20 concurrent submissions
      const submissions = Array.from({ length: 20 }, () =>
        service.submitExam('asg-conc', 'stud-conc', { '1': 'B' }, 3500)
      );

      const results = await Promise.all(submissions);
      assert.equal(results.length, 20);
      for (const res of results) {
        assert.equal(res.success, true);
        assert.equal(res.alreadySubmitted, true);
        assert.equal(res.totalScore, 240);
      }
    });

    it('verifies token refresh session age boundary: accepts 6.9 days old session, rejects 7.1 days old session', async () => {
      const mockUserRepo: any = {
        existsById: async () => true,
      };

      // 6.9 days old session
      const validAgeToken = jwt.sign(
        { userId: 'student-valid-age', sessionStart: Date.now() - (6.9 * 24 * 60 * 60 * 1000) },
        TEST_SECRET,
        { algorithm: 'HS256', expiresIn: -60 },
      );

      let nextCalledValid = false;
      const reqValid: any = { headers: { authorization: `Bearer ${validAgeToken}` } };
      const resValid: any = { status: () => resValid, json: () => {} };

      await new Promise<void>((resolve, reject) => {
        requireRefreshableAuth(reqValid, resValid, (err?: any) => {
          if (err) reject(err);
          else {
            nextCalledValid = true;
            resolve();
          }
        }, mockUserRepo);
      });
      assert.equal(nextCalledValid, true);

      // 7.1 days old session
      const tooOldToken = jwt.sign(
        { userId: 'student-too-old', sessionStart: Date.now() - (7.1 * 24 * 60 * 60 * 1000) },
        TEST_SECRET,
        { algorithm: 'HS256', expiresIn: -60 },
      );

      let statusOld = 0;
      let jsonOld: any = null;
      let nextCalledOld = false;
      const reqOld: any = { headers: { authorization: `Bearer ${tooOldToken}` } };
      const resOld: any = {
        status: (code: number) => { statusOld = code; return resOld; },
        json: (data: any) => { jsonOld = data; },
      };

      requireRefreshableAuth(reqOld, resOld, () => { nextCalledOld = true; }, mockUserRepo);
      assert.equal(nextCalledOld, false);
      assert.equal(statusOld, 401);
      assert.equal(jsonOld.error, 'Session expired, please log in again');
    });
  });
});
