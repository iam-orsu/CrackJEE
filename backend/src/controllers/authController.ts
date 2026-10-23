import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../types/index';
import { cacheSet } from '../services/cacheService';
import { setSessionCookie, clearSessionCookie } from '../middleware/auth';

// Longest lifetime of one token. Revoked token ids are kept at least this long.
const TOKEN_TTL_SECONDS = 24 * 60 * 60;

// When the session cookie stops working, as an ISO time. The browser reads it to know when to renew.
function sessionExpiresAt(): string {
  return new Date(Date.now() + TOKEN_TTL_SECONDS * 1000).toISOString();
}

// Precomputed dummy bcrypt hash (cost 12) for constant-time comparisons when user does not exist
const DUMMY_HASH = '$2a$12$e80yqZzD7Cqm/5aE6e1PkuWjWcK3pZ0G8Q6T8W3g9o3e5k5g7q4yW';

const registerSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(8).max(128),
  class: z.enum(['11', '12', 'Dropper']),
  targetExam: z.enum(['Main', 'Advanced', 'Both', 'NEET']),
  currentLevel: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
});

const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});

// sessionStart is set at login and carried over by refresh, so a session has a hard maximum length
function signToken(userId: string, sessionStart: number = Date.now()): string {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign({ userId, jti: randomUUID(), sessionStart }, secret, {
    algorithm: 'HS256',
    expiresIn: `${TOKEN_TTL_SECONDS}s`,
  });
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = registerSchema.safeParse(req.body);
    if (!body.success) {
      throw new AppError(400, body.error.errors[0]?.message ?? 'Validation error');
    }

    const { name, email, password, ...rest } = body.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError(409, 'Email already registered');

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, passwordHash, ...rest },
      select: { id: true, name: true, email: true, class: true, targetExam: true, currentLevel: true },
    });

    setSessionCookie(res, signToken(user.id));
    res.status(201).json({ success: true, data: { user, expiresAt: sessionExpiresAt() } });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = loginSchema.safeParse(req.body);
    if (!body.success) {
      throw new AppError(400, 'Invalid credentials');
    }

    const user = await prisma.user.findUnique({
      where: { email: body.data.email },
      select: { id: true, name: true, email: true, class: true, targetExam: true, currentLevel: true, passwordHash: true },
    });

    if (!user) {
      // Execute dummy compare to eliminate timing discrepancy between existing & non-existing users
      await bcrypt.compare(body.data.password, DUMMY_HASH);
      throw new AppError(401, 'Invalid credentials');
    }

    const valid = await bcrypt.compare(body.data.password, user.passwordHash);
    if (!valid) throw new AppError(401, 'Invalid credentials');

    setSessionCookie(res, signToken(user.id));
    const { passwordHash: _, ...safeUser } = user;
    res.json({ success: true, data: { user: safeUser, expiresAt: sessionExpiresAt() } });
  } catch (err) {
    next(err);
  }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, name: true, email: true, class: true, targetExam: true, currentLevel: true, createdAt: true },
    });
    if (!user) throw new AppError(404, 'User not found');
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    // Keep the original session start: refreshing never extends a session past SESSION_MAX_MS
    setSessionCookie(res, signToken(req.user!.userId, req.user!.sessionStart ?? Date.now()));
    res.json({ success: true, data: { expiresAt: sessionExpiresAt() } });
  } catch (err) {
    next(err);
  }
}

// Revokes the current token server-side. Without this, a copied token stayed valid until it expired.
export async function logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const jti = req.user?.jti;
    if (jti) await cacheSet(`revoked:${jti}`, '1', TOKEN_TTL_SECONDS);
    clearSessionCookie(res);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
