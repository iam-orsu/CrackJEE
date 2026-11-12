import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AUTH_CONSTANTS } from '../config/constants';
import { UserRepository } from '../repositories/UserRepository';
import { CacheService, cacheService as defaultCache } from './CacheService';
import { AppError } from '../utils/AppError';

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
    targetExam: 'Main' | 'Advanced' | 'Both' | 'NEET';
    currentLevel: 'beginner' | 'intermediate' | 'advanced';
  }) {
    const existing = await this.users.existsByEmail(input.email);
    if (existing) throw new AppError(409, 'Email already registered');

    const passwordHash = await bcrypt.hash(input.password, AUTH_CONSTANTS.BCRYPT_ROUNDS);
    const user = await this.users.create({
      name: input.name,
      email: input.email,
      passwordHash,
      class: input.class,
      targetExam: input.targetExam,
      currentLevel: input.currentLevel,
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
