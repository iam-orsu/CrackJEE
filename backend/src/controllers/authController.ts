import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  class: z.enum(['11', '12', 'Dropper']),
  targetExam: z.enum(['Main', 'Advanced', 'Both']),
  currentLevel: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function signToken(userId: string, email: string): string {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign({ userId, email }, secret, {
    algorithm: 'HS256',
    expiresIn: '7d',
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

    const token = signToken(user.id, user.email);
    res.status(201).json({ success: true, data: { token, user } });
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
    });
    if (!user) throw new AppError(401, 'Invalid credentials');

    const valid = await bcrypt.compare(body.data.password, user.passwordHash);
    if (!valid) throw new AppError(401, 'Invalid credentials');

    const token = signToken(user.id, user.email);
    const { passwordHash: _, ...safeUser } = user;
    res.json({ success: true, data: { token, user: safeUser } });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request & { user?: { userId: string } }, res: Response, next: NextFunction): Promise<void> {
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
