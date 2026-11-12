import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/AuthService';
import { setSessionCookie, clearSessionCookie } from '../middlewares/auth.middleware';
import { AppError } from '../utils/AppError';
import type { AuthRequest } from '../types/index';

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

export class AuthController {
  constructor(private readonly authService: AuthService = new AuthService()) {}

  public readonly register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = registerSchema.safeParse(req.body);
      if (!body.success) {
        throw new AppError(400, body.error.errors[0]?.message ?? 'Validation error');
      }

      const { token, user, expiresAt } = await this.authService.register(body.data);
      setSessionCookie(res, token);
      res.status(201).json({ success: true, data: { user, expiresAt } });
    } catch (err) {
      next(err);
    }
  };

  public readonly login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = loginSchema.safeParse(req.body);
      if (!body.success) {
        throw new AppError(400, 'Invalid credentials');
      }

      const { token, user, expiresAt } = await this.authService.login(body.data.email, body.data.password);
      setSessionCookie(res, token);
      res.json({ success: true, data: { user, expiresAt } });
    } catch (err) {
      next(err);
    }
  };

  public readonly me = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.authService.getProfile(req.user!.userId);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  };

  public readonly refresh = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, expiresAt } = this.authService.refreshSession(
        req.user!.userId,
        req.user!.sessionStart,
      );
      setSessionCookie(res, token);
      res.json({ success: true, data: { expiresAt } });
    } catch (err) {
      next(err);
    }
  };

  public readonly logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.authService.logout(req.user?.jti);
      clearSessionCookie(res);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  };
}
