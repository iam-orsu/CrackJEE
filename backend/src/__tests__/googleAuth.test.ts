import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { FacultyAuthService } from '../services/FacultyAuthService';
import { GoogleAuthService, sanitizeRedirectPath } from '../services/GoogleAuthService';

process.env.JWT_SECRET = 'test-secret-key-1234567890123456';

interface FakeFaculty {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  googleSub: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
}

function mockRepo(seed: FakeFaculty[]) {
  const rows = [...seed];
  return {
    rows,
    findByEmail: async (email: string) => rows.find((r) => r.email === email) ?? null,
    findByGoogleSub: async (sub: string) => rows.find((r) => r.googleSub === sub) ?? null,
    create: async (data: any) => {
      const row: FakeFaculty = {
        id: `fac-${rows.length + 1}`,
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        googleSub: data.googleSub ?? null,
        avatarUrl: data.avatarUrl ?? null,
        isActive: true,
      };
      rows.push(row);
      return row;
    },
    linkGoogleSub: async (id: string, googleSub: string, avatarUrl?: string | null) => {
      const row = rows.find((r) => r.id === id)!;
      row.googleSub = googleSub;
      if (avatarUrl) row.avatarUrl = avatarUrl;
      return row;
    },
  } as any;
}

const googleProfile = {
  sub: 'google-sub-1',
  email: 'mentor@college.edu',
  emailVerified: true,
  name: 'Dr. Rao',
  picture: 'https://lh3.googleusercontent.com/a/mentor-avatar=s96-c',
};

describe('Google OAuth helpers', () => {
  test('keeps post-login redirects inside the app', () => {
    assert.equal(sanitizeRedirectPath('/faculty'), '/faculty');
    assert.equal(sanitizeRedirectPath('https://evil.example.com'), '/faculty');
    assert.equal(sanitizeRedirectPath('//evil.example.com'), '/faculty');
    assert.equal(sanitizeRedirectPath('/\\evil.example.com'), '/faculty');
    assert.equal(sanitizeRedirectPath(undefined), '/faculty');
  });

  test('signs and verifies the OAuth state, rejecting tampered payloads', () => {
    const service = new GoogleAuthService();
    const state = service.signState({ nonce: 'nonce-123', redirectTo: '/faculty' });
    const verified = service.verifyState(state);
    assert.equal(verified.nonce, 'nonce-123');
    assert.equal(verified.redirectTo, '/faculty');

    const forged = jwt.sign({ nonce: 'nonce-123', redirectTo: '/faculty' }, 'a-different-secret');
    assert.throws(() => service.verifyState(forged), (err: any) => err.statusCode === 400);
    assert.throws(() => service.verifyState('not-a-jwt'), (err: any) => err.statusCode === 400);
  });
});

describe('Faculty Google sign-in', () => {
  test('rejects an unverified Google email', async () => {
    const service = new FacultyAuthService(mockRepo([]));
    await assert.rejects(
      async () => service.loginWithGoogle({ ...googleProfile, emailVerified: false }),
      (err: any) => err.statusCode === 403,
    );
  });

  test('provisions a faculty account on first Google sign-in (self sign-up)', async () => {
    delete process.env.GOOGLE_FACULTY_AUTO_PROVISION;
    const repo = mockRepo([]);
    const service = new FacultyAuthService(repo);

    const session = await service.loginWithGoogle(googleProfile);
    assert.equal(session.faculty.email, 'mentor@college.edu');
    assert.equal(session.faculty.name, 'Dr. Rao');
    assert.equal(session.faculty.avatarUrl, googleProfile.picture);
    assert.equal(repo.rows.length, 1);
    assert.equal(repo.rows[0]!.googleSub, 'google-sub-1');
    assert.equal(repo.rows[0]!.avatarUrl, googleProfile.picture);
    assert.ok(repo.rows[0]!.passwordHash.length > 0);
    assert.equal(repo.rows[0]!.isActive, true);
  });

  test('refreshes a stale profile picture on the next Google sign-in', async () => {
    delete process.env.GOOGLE_FACULTY_AUTO_PROVISION;
    const repo = mockRepo([
      {
        id: 'fac-1',
        name: 'Dr. Rao',
        email: 'mentor@college.edu',
        passwordHash: 'hash',
        googleSub: 'google-sub-1',
        avatarUrl: 'https://lh3.googleusercontent.com/a/old-avatar=s96-c',
        isActive: true,
      },
    ]);
    const service = new FacultyAuthService(repo);

    const session = await service.loginWithGoogle(googleProfile);
    assert.equal(session.faculty.avatarUrl, googleProfile.picture);
    assert.equal(repo.rows[0]!.avatarUrl, googleProfile.picture);
  });

  test('self sign-up can be turned off to require an administrator-created account', async () => {
    process.env.GOOGLE_FACULTY_AUTO_PROVISION = 'false';
    try {
      const repo = mockRepo([]);
      const service = new FacultyAuthService(repo);
      await assert.rejects(
        async () => service.loginWithGoogle(googleProfile),
        (err: any) => err.statusCode === 403 && err.message.includes('No faculty account exists'),
      );
      assert.equal(repo.rows.length, 0);
    } finally {
      delete process.env.GOOGLE_FACULTY_AUTO_PROVISION;
    }
  });

  test('links an existing faculty account and issues a session', async () => {
    delete process.env.GOOGLE_FACULTY_AUTO_PROVISION;
    const repo = mockRepo([
      {
        id: 'fac-1',
        name: 'Dr. Rao',
        email: 'mentor@college.edu',
        passwordHash: 'hash',
        googleSub: null,
        avatarUrl: null,
        isActive: true,
      },
    ]);
    const service = new FacultyAuthService(repo);

    const session = await service.loginWithGoogle(googleProfile);
    assert.equal(session.faculty.id, 'fac-1');
    assert.equal(session.faculty.email, 'mentor@college.edu');
    assert.ok(session.token);

    const payload = jwt.verify(session.token, process.env.JWT_SECRET!) as any;
    assert.equal(payload.role, 'faculty');
    assert.equal(payload.facultyId, 'fac-1');
    assert.equal(repo.rows[0]!.googleSub, 'google-sub-1');
  });

  test('signs in an already linked account without re-linking', async () => {
    delete process.env.GOOGLE_FACULTY_AUTO_PROVISION;
    const repo = mockRepo([
      {
        id: 'fac-1',
        name: 'Dr. Rao',
        email: 'mentor@college.edu',
        passwordHash: 'hash',
        googleSub: 'google-sub-1',
        isActive: true,
      },
    ]);
    const service = new FacultyAuthService(repo);
    const session = await service.loginWithGoogle(googleProfile);
    assert.equal(session.faculty.id, 'fac-1');
  });

  test('rejects a second Google account claiming the same faculty email', async () => {
    delete process.env.GOOGLE_FACULTY_AUTO_PROVISION;
    const repo = mockRepo([
      {
        id: 'fac-1',
        name: 'Dr. Rao',
        email: 'mentor@college.edu',
        passwordHash: 'hash',
        googleSub: 'google-sub-other',
        isActive: true,
      },
    ]);
    const service = new FacultyAuthService(repo);
    await assert.rejects(
      async () => service.loginWithGoogle(googleProfile),
      (err: any) => err.statusCode === 403 && err.message.includes('already linked'),
    );
  });

  test('rejects a Google account whose email no longer matches the linked faculty account', async () => {
    delete process.env.GOOGLE_FACULTY_AUTO_PROVISION;
    const repo = mockRepo([
      {
        id: 'fac-1',
        name: 'Dr. Rao',
        email: 'mentor@college.edu',
        passwordHash: 'hash',
        googleSub: 'google-sub-1',
        isActive: true,
      },
    ]);
    const service = new FacultyAuthService(repo);
    await assert.rejects(
      async () => service.loginWithGoogle({ ...googleProfile, email: 'other@college.edu' }),
      (err: any) => err.statusCode === 403,
    );
  });

  test('rejects a deactivated faculty account', async () => {
    delete process.env.GOOGLE_FACULTY_AUTO_PROVISION;
    const repo = mockRepo([
      {
        id: 'fac-1',
        name: 'Dr. Rao',
        email: 'mentor@college.edu',
        passwordHash: 'hash',
        googleSub: 'google-sub-1',
        isActive: false,
      },
    ]);
    const service = new FacultyAuthService(repo);
    await assert.rejects(
      async () => service.loginWithGoogle(googleProfile),
      (err: any) => err.statusCode === 403 && err.message.includes('deactivated'),
    );
  });

  test('auto-provisioning stays disabled when the flag is explicitly false', async () => {
    process.env.GOOGLE_FACULTY_AUTO_PROVISION = 'false';
    try {
      const repo = mockRepo([
        {
          id: 'fac-1',
          name: 'Dr. Rao',
          email: 'mentor@college.edu',
          passwordHash: 'hash',
          googleSub: null,
          isActive: true,
        },
      ]);
      const service = new FacultyAuthService(repo);
      const session = await service.loginWithGoogle(googleProfile);
      assert.equal(session.faculty.id, 'fac-1');
      assert.equal(repo.rows[0]!.googleSub, 'google-sub-1');
    } finally {
      delete process.env.GOOGLE_FACULTY_AUTO_PROVISION;
    }
  });
});
