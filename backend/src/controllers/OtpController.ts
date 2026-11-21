import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/AuthService';
import { OtpService } from '../services/OtpService';
import { AppError } from '../utils/AppError';
import { normalizeMobile } from '../utils/mobile';
import type { AuthRequest } from '../types/index';

const sendSchema = z.object({
  mobile: z.string().trim().min(6).max(20),
});

const verifySchema = z.object({
  mobile: z.string().trim().min(6).max(20),
  otp: z.string().trim().regex(/^\d{4}$/, 'Enter the 4-digit code we sent you'),
});

export const registrationSubject = (mobile: string): string => `reg:${mobile}`;

export class OtpController {
  constructor(
    private readonly otpService: OtpService = new OtpService(),
    private readonly authService: AuthService = new AuthService(),
  ) {}

  public readonly send = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = sendSchema.safeParse(req.body);
      if (!body.success) {
        throw new AppError(400, body.error.errors[0]?.message ?? 'Invalid mobile number');
      }

      const mobile = normalizeMobile(body.data.mobile);
      if (!mobile) {
        throw new AppError(400, 'Enter a valid 10-digit mobile number.');
      }

      const owner = await this.authService.isMobileTaken(mobile, req.user!.userId);
      if (owner) {
        throw new AppError(409, 'This number is already linked to another account.');
      }

      const { expiresIn, cooldownSeconds } = await this.otpService.requestOtp(req.user!.userId, mobile);
      res.json({ success: true, data: { sent: true, expiresIn, cooldownSeconds } });
    } catch (err) {
      next(err);
    }
  };

  public readonly verify = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = verifySchema.safeParse(req.body);
      if (!body.success) {
        throw new AppError(400, body.error.errors[0]?.message ?? 'Invalid OTP');
      }

      const mobile = normalizeMobile(body.data.mobile);
      if (!mobile) {
        throw new AppError(400, 'Enter a valid 10-digit mobile number.');
      }

      await this.otpService.verifyOtp(req.user!.userId, mobile, body.data.otp);

      const user = await this.authService.verifyMobile(req.user!.userId, mobile);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  };

  public readonly sendForRegistration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = sendSchema.safeParse(req.body);
      if (!body.success) {
        throw new AppError(400, body.error.errors[0]?.message ?? 'Invalid mobile number');
      }

      const mobile = normalizeMobile(body.data.mobile);
      if (!mobile) {
        throw new AppError(400, 'Enter a valid 10-digit mobile number.');
      }

      const { expiresIn, cooldownSeconds } = await this.otpService.requestOtp(registrationSubject(mobile), mobile);
      res.json({ success: true, data: { sent: true, expiresIn, cooldownSeconds } });
    } catch (err) {
      next(err);
    }
  };

  public readonly verifyForRegistration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = verifySchema.safeParse(req.body);
      if (!body.success) {
        throw new AppError(400, body.error.errors[0]?.message ?? 'Invalid OTP');
      }

      const mobile = normalizeMobile(body.data.mobile);
      if (!mobile) {
        throw new AppError(400, 'Enter a valid 10-digit mobile number.');
      }

      await this.otpService.verifyOtp(registrationSubject(mobile), mobile, body.data.otp);
      await this.otpService.markVerified(registrationSubject(mobile), mobile);

      res.json({ success: true, data: { verified: true, mobile } });
    } catch (err) {
      next(err);
    }
  };
}
