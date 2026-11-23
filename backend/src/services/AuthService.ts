import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AUTH_CONSTANTS } from '../config/constants';
import { UserRepository } from '../repositories/UserRepository';
import { CacheService, cacheService as defaultCache } from './CacheService';
import type { GoogleProfile } from './GoogleAuthService';
import { AppError } from '../utils/AppError';

const GOOGLE_DEFAULT_CLASS = '12';
const GOOGLE_DEFAULT_TARGET_EXAM = 'Both';

export class AuthService {
  constructor(
    private readonly users: UserRepository = new UserRepository(),
    private readonly cache: CacheService = defaultCache,
  ) {}

  private sessionExpiresAt(): string {
    return new Date(Date.now() + AUTH_CONSTANTS.TOKEN_TTL_SECONDS * 1000).toISOString();
  }

  public signToken(userId: string, sessionStart: number = Date.now()): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError(500, 'Server misconfiguration');
    return jwt.sign({ userId, jti: randomUUID(), sessionStart }, secret, {
      algorithm: 'HS256',
      expiresIn: `${AUTH_CONSTANTS.TOKEN_TTL_SECONDS}s`,
    });
  }

  public async register(input: {
    name: string;
    email: string;
    password: string;
    class: '11' | '12' | 'Dropper';
    targetExam: 'Main' | 'Advanced' | 'Both' | 'NEET' | 'Psychometric';
    hasPsychometric?: boolean;
    currentLevel: 'beginner' | 'intermediate' | 'advanced';
    mobile?: string | null;
    mobileVerified?: boolean;
    emailVerified?: boolean;
  }) {
    const existing = await this.users.findByEmailForAuth(input.email);
    if (existing) {
      if (existing.googleSub) {
        throw new AppError(409, 'This email already uses Google sign-in. Please continue with Google.');
      }
      throw new AppError(409, 'Email already registered. Please sign in.');
    }

    if (input.mobile) {
      const mobileOwner = await this.users.findByMobile(input.mobile);
      if (mobileOwner) {
        throw new AppError(409, 'This mobile number is already linked to another account.');
      }
    }

    const passwordHash = await bcrypt.hash(input.password, AUTH_CONSTANTS.BCRYPT_ROUNDS);
    const user = await this.users.create({
      name: input.name,
      email: input.email,
      passwordHash,
      class: input.class,
      targetExam: input.targetExam,
      hasPsychometric: input.hasPsychometric ?? false,
      currentLevel: input.currentLevel,
      mobile: input.mobile ?? null,
      mobileVerified: input.mobileVerified ?? false,
      emailVerified: input.emailVerified ?? false,
      isOnboarded: true,
    });

    const token = this.signToken(user.id);
    return { token, user, expiresAt: this.sessionExpiresAt() };
  }

  public async login(email: string, password: string) {
    const user = await this.users.findByEmailForAuth(email);
    if (!user) {
      // Constant-time dummy comparison prevents timing oracle on unknown emails
      await bcrypt.compare(password, AUTH_CONSTANTS.DUMMY_BCRYPT_HASH);
      throw new AppError(401, 'Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError(401, 'Invalid credentials');

    const { passwordHash: _, ...safeUser } = user;
    const token = this.signToken(user.id);
    return { token, user: safeUser, expiresAt: this.sessionExpiresAt() };
  }

  public async getProfile(userId: string) {
    const user = await this.users.findSafeById(userId);
    if (!user) throw new AppError(404, 'User not found');
    return user;
  }

  public async loginWithGoogle(profile: GoogleProfile) {
    if (!profile.emailVerified) {
      throw new AppError(403, 'Your Google email address is not verified. Verify it and try again.');
    }

    const email = profile.email.trim().toLowerCase();
    const linkedAccount = await this.users.findByGoogleSub(profile.sub);

    let user;
    let created = false;

    if (linkedAccount) {
      if (linkedAccount.email !== email) {
        throw new AppError(403, 'This Google account is linked to a different email.');
      }
      user = linkedAccount.avatarUrl === profile.picture
        ? linkedAccount
        : await this.users.linkGoogleSub(linkedAccount.id, profile.sub, profile.picture);
    } else {
      const existing = await this.users.findByEmailForAuth(email);
      if (existing) {
        if (existing.googleSub && existing.googleSub !== profile.sub) {
          throw new AppError(403, 'This email is already linked to a different Google account.');
        }
        user = await this.users.linkGoogleSub(existing.id, profile.sub, profile.picture);
      } else {
        if (process.env.GOOGLE_STUDENT_AUTO_PROVISION === 'false') {
          throw new AppError(
            403,
            'No account exists for this Google email. Sign up with a password first, then use Google to sign in.',
          );
        }
        const passwordHash = await bcrypt.hash(randomUUID() + randomUUID(), AUTH_CONSTANTS.BCRYPT_ROUNDS);
        user = await this.users.create({
          name: profile.name || email,
          email,
          passwordHash,
          class: GOOGLE_DEFAULT_CLASS,
          targetExam: GOOGLE_DEFAULT_TARGET_EXAM,
          currentLevel: 'beginner',
          googleSub: profile.sub,
          avatarUrl: profile.picture,
          emailVerified: true,
        });
        created = true;
      }
    }

    const token = this.signToken(user.id);
    return { token, user, expiresAt: this.sessionExpiresAt(), created };
  }

  public async updateProfile(
    userId: string,
    patch: { class?: string; targetExam?: string; currentLevel?: string; hasPsychometric?: boolean },
  ) {
    const existing = await this.users.findSafeById(userId);
    if (!existing) throw new AppError(404, 'User not found');

    const data: { class?: string; targetExam?: string; currentLevel?: string; hasPsychometric?: boolean } = {};
    if (patch.class !== undefined) data.class = patch.class;
    if (patch.targetExam !== undefined) data.targetExam = patch.targetExam;
    if (patch.currentLevel !== undefined) data.currentLevel = patch.currentLevel;
    if (patch.hasPsychometric !== undefined) data.hasPsychometric = patch.hasPsychometric;

    return this.users.updateProfile(userId, data);
  }

  public async isMobileTaken(mobile: string, userId: string): Promise<boolean> {
    const owner = await this.users.findByMobile(mobile);
    return Boolean(owner && owner.id !== userId);
  }

  public async findMobileOwner(mobile: string): Promise<{ id: string } | null> {
    return this.users.findByMobile(mobile);
  }

  public async verifyMobile(userId: string, mobile: string) {
    const existing = await this.users.findSafeById(userId);
    if (!existing) throw new AppError(404, 'User not found');

    const owner = await this.users.findByMobile(mobile);
    if (owner && owner.id !== userId) {
      throw new AppError(409, 'This number is already linked to another account.');
    }

    return this.users.updateProfile(userId, { mobile, mobileVerified: true });
  }

  public async verifyEmail(userId: string, email: string) {
    const existing = await this.users.findSafeById(userId);
    if (!existing) throw new AppError(404, 'User not found');

    const owner = await this.users.findByEmailForAuth(email);
    if (owner && owner.id !== userId) {
      throw new AppError(409, 'This address is already linked to another account.');
    }

    return this.users.updateProfile(userId, { emailVerified: true });
  }

  public async completeOnboarding(
    userId: string,
    input: {
      class: string;
      targetExam: string;
      currentLevel?: string;
      hasPsychometric?: boolean;
    },
  ) {
    const existing = await this.users.findSafeById(userId);
    if (!existing) throw new AppError(404, 'User not found');

    return this.users.updateProfile(userId, {
      class: input.class,
      targetExam: input.targetExam,
      currentLevel: input.currentLevel ?? existing.currentLevel,
      hasPsychometric: input.hasPsychometric ?? existing.hasPsychometric,
      isOnboarded: true,
    });
  }

  public refreshSession(userId: string, sessionStart?: number) {
    const token = this.signToken(userId, sessionStart ?? Date.now());
    return { token, expiresAt: this.sessionExpiresAt() };
  }

  public async logout(jti?: string): Promise<void> {
    if (jti) {
      await this.cache.set(`revoked:${jti}`, '1', AUTH_CONSTANTS.TOKEN_TTL_SECONDS);
    }
  }
}
