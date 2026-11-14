import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { requireFaculty, setFacultyCookie, clearFacultyCookie, FACULTY_COOKIE } from '../middlewares/facultyAuth.middleware';
import { requireAdmin, setAdminCookie, clearAdminCookie, ADMIN_COOKIE } from '../middlewares/adminAuth.middleware';
import { sessionStartOf, isSessionTooOld, SESSION_MAX_MS } from '../middlewares/auth.middleware';

const TEST_SECRET = 'test-jwt-secret-for-security-tests-crackjee-2026';

describe('Faculty Auth Middleware & Security Guards', () => {
  before(() => {
    process.env.JWT_SECRET = TEST_SECRET;
  });

  const activeFaculty = {
    id: 'fac-active-1',
    name: 'Prof. Sharma',
    email: 'sharma@crackjee.in',
    isActive: true,
  };

  const inactiveFaculty = {
    id: 'fac-inactive-2',
    name: 'Dr. Verma',
    email: 'verma@crackjee.in',
    isActive: false,
  };

  const fakeRepo: any = {
    findById: async (id: string) => {
      if (id === activeFaculty.id) return activeFaculty;
      if (id === inactiveFaculty.id) return inactiveFaculty;
      return null;
    },
  };

  const facultyMiddleware = requireFaculty(fakeRepo);

  it('rejects unauthenticated requests with 401', async () => {
    let status = 0;
    let jsonBody: any = null;
    const req: any = { headers: {} };
    const res: any = {
      status: (code: number) => { status = code; return res; },
      json: (data: any) => { jsonBody = data; },
    };

    await facultyMiddleware(req, res, () => {});
    assert.equal(status, 401);
    assert.equal(jsonBody.error, 'Not authenticated');
  });

  it('rejects tampered or corrupt JWTs with 401', async () => {
    let status = 0;
    let jsonBody: any = null;
    const req: any = { headers: { authorization: 'Bearer completely-corrupted-token' } };
    const res: any = {
      status: (code: number) => { status = code; return res; },
      json: (data: any) => { jsonBody = data; },
    };

    await facultyMiddleware(req, res, () => {});
    assert.equal(status, 401);
    assert.equal(jsonBody.error, 'Invalid or expired faculty session');
  });

  it('rejects student role JWT trying to access faculty route with 403', async () => {
    const studentToken = jwt.sign({ userId: 'student-99', role: 'student' }, TEST_SECRET, { algorithm: 'HS256' });
    let status = 0;
    let jsonBody: any = null;
    const req: any = { headers: { authorization: `Bearer ${studentToken}` } };
    const res: any = {
      status: (code: number) => { status = code; return res; },
      json: (data: any) => { jsonBody = data; },
    };

    await facultyMiddleware(req, res, () => {});
    assert.equal(status, 403);
    assert.equal(jsonBody.error, 'Faculty access only');
  });

  it('rejects inactive faculty account with 403', async () => {
    const inactiveToken = jwt.sign(
      { facultyId: inactiveFaculty.id, role: 'faculty' },
      TEST_SECRET,
      { algorithm: 'HS256' },
    );
    let status = 0;
    let jsonBody: any = null;
    const req: any = { headers: { authorization: `Bearer ${inactiveToken}` } };
    const res: any = {
      status: (code: number) => { status = code; return res; },
      json: (data: any) => { jsonBody = data; },
    };

    await facultyMiddleware(req, res, () => {});
    assert.equal(status, 403);
    assert.equal(jsonBody.error, 'Faculty account is inactive or missing');
  });

  it('accepts valid faculty Bearer token and attaches faculty details to request', async () => {
    const validToken = jwt.sign(
      { facultyId: activeFaculty.id, role: 'faculty' },
      TEST_SECRET,
      { algorithm: 'HS256' },
    );
    let nextCalled = false;
    const req: any = { headers: { authorization: `Bearer ${validToken}` } };
    const res: any = {};

    await facultyMiddleware(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    assert.equal(req.faculty.facultyId, activeFaculty.id);
    assert.equal(req.faculty.name, activeFaculty.name);
    assert.equal(req.faculty.email, activeFaculty.email);
  });

  it('accepts valid faculty cookie when Authorization header is absent', async () => {
    const validToken = jwt.sign(
      { facultyId: activeFaculty.id, role: 'faculty' },
      TEST_SECRET,
      { algorithm: 'HS256' },
    );
    let nextCalled = false;
    const req: any = { headers: { cookie: `other=123; ${FACULTY_COOKIE}=${validToken}; user=abc` } };
    const res: any = {};

    await facultyMiddleware(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    assert.equal(req.faculty.facultyId, activeFaculty.id);
  });
});

describe('Admin Auth Middleware & Security Guards', () => {
  before(() => {
    process.env.JWT_SECRET = TEST_SECRET;
  });

  it('rejects missing admin token with 401', () => {
    let status = 0;
    let jsonBody: any = null;
    const req: any = { headers: {} };
    const res: any = {
      status: (code: number) => { status = code; return res; },
      json: (data: any) => { jsonBody = data; },
    };

    requireAdmin(req, res, () => {});
    assert.equal(status, 401);
    assert.equal(jsonBody.error, 'Missing admin token');
  });

  it('rejects student or faculty token on admin route with 403', () => {
    const facultyToken = jwt.sign({ facultyId: 'fac-1', role: 'faculty' }, TEST_SECRET, { algorithm: 'HS256' });
    let status = 0;
    let jsonBody: any = null;
    const req: any = { headers: { authorization: `Bearer ${facultyToken}` } };
    const res: any = {
      status: (code: number) => { status = code; return res; },
      json: (data: any) => { jsonBody = data; },
    };

    requireAdmin(req, res, () => {});
    assert.equal(status, 403);
    assert.equal(jsonBody.error, 'Admin access only');
  });

  it('accepts valid admin token and allows request to proceed', () => {
    const adminToken = jwt.sign({ role: 'admin' }, TEST_SECRET, { algorithm: 'HS256' });
    let nextCalled = false;
    const req: any = { headers: { authorization: `Bearer ${adminToken}` } };
    const res: any = {};

    requireAdmin(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
  });
});

describe('Session Lifetime & Cookie Security Flags', () => {
  it('sessionStartOf extracts explicit sessionStart or falls back to iat timestamp', () => {
    const explicitTime = Date.now() - 50000;
    assert.equal(sessionStartOf({ userId: 'u1', sessionStart: explicitTime }), explicitTime);

    const iatSeconds = 1700000000;
    assert.equal(sessionStartOf({ userId: 'u1', iat: iatSeconds }), iatSeconds * 1000);
  });

  it('isSessionTooOld detects expired sessions past SESSION_MAX_MS', () => {
    const now = Date.now();
    const freshSession = now - (1000 * 60 * 60); // 1 hour ago
    const expiredSession = now - (SESSION_MAX_MS + 10000); // 7 days + 10 seconds ago

    assert.equal(isSessionTooOld(freshSession, now), false);
    assert.equal(isSessionTooOld(expiredSession, now), true);
  });

  it('cookie handlers set HttpOnly and SameSite=Strict headers', () => {
    const appendedCookies: string[] = [];
    const res: any = {
      append: (header: string, val: string) => {
        if (header === 'Set-Cookie') appendedCookies.push(val);
      },
    };

    setFacultyCookie(res, 'test-faculty-jwt');
    assert.ok(appendedCookies[0].includes('HttpOnly'));
    assert.ok(appendedCookies[0].includes('SameSite=Strict'));
    assert.ok(appendedCookies[0].includes('Path=/api/v1/faculty'));

    clearFacultyCookie(res);
    assert.ok(appendedCookies[1].includes('Max-Age=0'));

    setAdminCookie(res, 'test-admin-jwt');
    assert.ok(appendedCookies[2].includes('Path=/api/v1/admin'));

    clearAdminCookie(res);
    assert.ok(appendedCookies[3].includes('Max-Age=0'));
  });
});
