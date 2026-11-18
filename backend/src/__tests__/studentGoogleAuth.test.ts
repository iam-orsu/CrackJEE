import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/AuthService';

process.env.JWT_SECRET = 'test-secret-key-1234567890123456';

interface FakeUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  googleSub: string | null;
  avatarUrl: string | null;
  class: string;
  targetExam: string;
  currentLevel: string;
  hasPsychometric: boolean;
  isOnboarded: boolean;
}

function mockUserRepo(seed: Partial<FakeUser>[]) {
  const rows: FakeUser[] = seed.map((row, index) => ({
    id: `u-${index + 1}`,
    name: 'Student',
    email: 'student@example.com',
    passwordHash: 'hash',
    googleSub: null,
    avatarUrl: null,
    class: '12',
    targetExam: 'Both',
    currentLevel: 'beginner',
    hasPsychometric: false,
    isOnboarded: true,
    ...row,
  }));

  return {
    rows,
    findByEmailForAuth: async (email: string) => rows.find((r) => r.email === email) ?? null,
    findByGoogleSub: async (sub: string) => rows.find((r) => r.googleSub === sub) ?? null,
    linkGoogleSub: async (id: string, googleSub: string, avatarUrl?: string | null) => {
      const row = rows.find((r) => r.id === id)!;
      row.googleSub = googleSub;
      if (avatarUrl) row.avatarUrl = avatarUrl;
      return row;
    },
    create: async (data: any) => {
      const row: FakeUser = {
        id: `u-${rows.length + 1}`,
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        googleSub: data.googleSub ?? null,
        avatarUrl: data.avatarUrl ?? null,
        class: data.class,
        targetExam: data.targetExam,
        currentLevel: data.currentLevel,
        hasPsychometric: data.hasPsychometric ?? false,
        isOnboarded: data.isOnboarded ?? false,
      };
      rows.push(row);
      return row;
    },
    existsByEmail: async (email: string) => rows.find((r) => r.email === email) ?? null,
    findSafeById: async (id: string) => rows.find((r) => r.id === id) ?? null,
    updateProfile: async (id: string, data: any) => {
      const row = rows.find((r) => r.id === id)!;
      Object.assign(row, data);
      return row;
    },
  } as any;
}

const cache = { get: async () => null, set: async () => undefined } as any;

const googleProfile = {
  sub: 'google-sub-1',
  email: 'student@example.com',
  emailVerified: true,
  name: 'Aspirant Kumar',
  picture: 'https://lh3.googleusercontent.com/a/student-avatar=s96-c',
};

describe('Student Google sign-in', () => {
  test('links an existing password account and issues a session', async () => {
    const repo = mockUserRepo([{ email: 'student@example.com', googleSub: null }]);
    const service = new AuthService(repo, cache);

    const session = await service.loginWithGoogle(googleProfile);
    assert.equal(session.user.email, 'student@example.com');
    assert.equal(session.created, false);
    assert.equal(repo.rows[0]!.googleSub, 'google-sub-1');
    assert.equal(repo.rows[0]!.avatarUrl, googleProfile.picture);

    const payload = jwt.verify(session.token, process.env.JWT_SECRET!) as any;
    assert.equal(payload.userId, repo.rows[0]!.id);
  });

  test('provisions an account on the first Google sign-in', async () => {
    delete process.env.GOOGLE_STUDENT_AUTO_PROVISION;
    const repo = mockUserRepo([]);
    const service = new AuthService(repo, cache);

    const session = await service.loginWithGoogle(googleProfile);
    assert.equal(session.created, true);
    assert.equal(repo.rows.length, 1);
    assert.equal(repo.rows[0]!.name, 'Aspirant Kumar');
    assert.equal(repo.rows[0]!.class, '12');
    assert.equal(repo.rows[0]!.targetExam, 'Both');
    assert.equal(repo.rows[0]!.googleSub, 'google-sub-1');
    assert.equal(repo.rows[0]!.isOnboarded, false, 'Google sign-ups still need onboarding');
  });

  test('manual registration counts as onboarded', async () => {
    const repo = mockUserRepo([]);
    const service = new AuthService(repo, cache);

    const session = await service.register({
      name: 'Aspirant Kumar',
      email: 'student@example.com',
      password: 'secret1234',
      class: '12',
      targetExam: 'Main',
      currentLevel: 'intermediate',
    });
    assert.equal(session.user.isOnboarded, true);
    assert.equal(repo.rows[0]!.isOnboarded, true);
  });

  test('manual registration is refused when the email already signs in with Google', async () => {
    const repo = mockUserRepo([{ email: 'student@example.com', googleSub: 'google-sub-1' }]);
    const service = new AuthService(repo, cache);

    await assert.rejects(
      async () =>
        service.register({
          name: 'Aspirant Kumar',
          email: 'student@example.com',
          password: 'secret1234',
          class: '12',
          targetExam: 'Main',
          currentLevel: 'beginner',
        }),
      (err: any) => err.statusCode === 409 && err.message.includes('Google sign-in'),
    );
    assert.equal(repo.rows.length, 1, 'no duplicate row is created');
  });

  test('manual registration is refused for an email that already registered manually', async () => {
    const repo = mockUserRepo([{ email: 'student@example.com', googleSub: null }]);
    const service = new AuthService(repo, cache);

    await assert.rejects(
      async () =>
        service.register({
          name: 'Aspirant Kumar',
          email: 'student@example.com',
          password: 'secret1234',
          class: '12',
          targetExam: 'Main',
          currentLevel: 'beginner',
        }),
      (err: any) => err.statusCode === 409 && err.message.includes('already registered'),
    );
    assert.equal(repo.rows.length, 1);
  });

  test('links a Google identity to an existing manual registration instead of duplicating it', async () => {
    const repo = mockUserRepo([{ email: 'student@example.com', googleSub: null, isOnboarded: true }]);
    const service = new AuthService(repo, cache);

    const session = await service.loginWithGoogle(googleProfile);
    assert.equal(repo.rows.length, 1, 'no duplicate account is created');
    assert.equal(repo.rows[0]!.googleSub, 'google-sub-1');
    assert.equal(session.user.id, repo.rows[0]!.id);
    assert.equal(session.user.isOnboarded, true, 'an onboarded manual user skips onboarding');
  });

  test('completing onboarding stores the profile and marks the user onboarded', async () => {
    const repo = mockUserRepo([{ email: 'student@example.com', isOnboarded: false }]);
    const service = new AuthService(repo, cache);

    const updated = await service.completeOnboarding(repo.rows[0]!.id, {
      class: 'Dropper',
      targetExam: 'NEET',
      currentLevel: 'advanced',
      hasPsychometric: true,
    });
    assert.equal(updated.class, 'Dropper');
    assert.equal(updated.targetExam, 'NEET');
    assert.equal(updated.currentLevel, 'advanced');
    assert.equal(updated.hasPsychometric, true);
    assert.equal(updated.isOnboarded, true);
  });

  test('can be turned off to require a password account first', async () => {
    process.env.GOOGLE_STUDENT_AUTO_PROVISION = 'false';
    try {
      const repo = mockUserRepo([]);
      const service = new AuthService(repo, cache);
      await assert.rejects(
        async () => service.loginWithGoogle(googleProfile),
        (err: any) => err.statusCode === 403 && err.message.includes('No account exists'),
      );
      assert.equal(repo.rows.length, 0);
    } finally {
      delete process.env.GOOGLE_STUDENT_AUTO_PROVISION;
    }
  });

  test('rejects an unverified Google email', async () => {
    const repo = mockUserRepo([]);
    const service = new AuthService(repo, cache);
    await assert.rejects(
      async () => service.loginWithGoogle({ ...googleProfile, emailVerified: false }),
      (err: any) => err.statusCode === 403,
    );
  });

  test('rejects a second Google account claiming the same email', async () => {
    const repo = mockUserRepo([{ email: 'student@example.com', googleSub: 'google-sub-other' }]);
    const service = new AuthService(repo, cache);
    await assert.rejects(
      async () => service.loginWithGoogle(googleProfile),
      (err: any) => err.statusCode === 403 && err.message.includes('already linked'),
    );
  });

  test('rejects a Google account whose email no longer matches the linked account', async () => {
    const repo = mockUserRepo([{ email: 'student@example.com', googleSub: 'google-sub-1' }]);
    const service = new AuthService(repo, cache);
    await assert.rejects(
      async () => service.loginWithGoogle({ ...googleProfile, email: 'other@example.com' }),
      (err: any) => err.statusCode === 403,
    );
  });

  test('updates the class and target exam of the signed-in student', async () => {
    const repo = mockUserRepo([{ email: 'student@example.com' }]);
    const service = new AuthService(repo, cache);

    const updated = await service.updateProfile(repo.rows[0]!.id, { class: 'Dropper', targetExam: 'NEET' });
    assert.equal(updated.class, 'Dropper');
    assert.equal(updated.targetExam, 'NEET');
  });
});
