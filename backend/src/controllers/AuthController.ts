import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AUTH_CONSTANTS } from '../config/constants';
import { AuthService } from '../services/AuthService';
import { setSessionCookie, clearSessionCookie } from '../middlewares/auth.middleware';
import { AppError } from '../utils/AppError';
import type { AuthRequest } from '../types/index';

const registerSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(8).max(128),
  class: z.enum(['11', '12', 'Dropper']),
  targetExam: z.enum(['Main', 'Advanced', 'Both', 'NEET', 'Psychometric']),
  hasPsychometric: z.boolean().optional().default(false),
  currentLevel: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
});

const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});

const profileSchema = z.object({
  class: z.enum(['11', '12', 'Dropper']).optional(),
  targetExam: z.enum(['Main', 'Advanced', 'Both', 'NEET', 'Psychometric']).optional(),
  currentLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  hasPsychometric: z.boolean().optional(),
});

const onboardingSchema = z.object({
  class: z.enum(['11', '12', 'Dropper']),
  targetExam: z.enum(['Main', 'Advanced', 'Both', 'NEET', 'Psychometric']),
  currentLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  hasPsychometric: z.boolean().optional(),
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

  public readonly session = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.authService.getProfile(req.user!.userId);
      res.json({
        success: true,
        data: {
          user,
          expiresAt: new Date(Date.now() + AUTH_CONSTANTS.TOKEN_TTL_SECONDS * 1000).toISOString(),
        },
      });
    } catch (err) {
      next(err);
    }
  };

  public readonly updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = profileSchema.safeParse(req.body);
      if (!body.success) {
        throw new AppError(400, body.error.errors[0]?.message ?? 'Invalid profile input');
      }

      const user = await this.authService.updateProfile(req.user!.userId, body.data);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  };

  public readonly completeOnboarding = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = onboardingSchema.safeParse(req.body);
      if (!body.success) {
        throw new AppError(400, body.error.errors[0]?.message ?? 'Invalid onboarding input');
      }

      const user = await this.authService.completeOnboarding(req.user!.userId, body.data);
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
      if (req.user?.jti) {
        await this.authService.logout(req.user.jti);
      }
      setSessionCookie(res, token);
      res.json({ success: true, data: { token, expiresAt } });
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
