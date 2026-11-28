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

const emailSendSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
});

const emailVerifySchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  otp: z.string().trim().regex(/^\d{4}$/, 'Enter the 4-digit code we sent you'),
});

const statusSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  mobile: z.string().trim().min(6).max(20),
});

export const registrationSubject = (mobile: string): string => `reg:${mobile}`;

export const registrationEmailSubject = (email: string): string => `email:${email}`;

export const loginEmailSubject = (email: string): string => `login:${email}`;

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

      const mobileOwner = await this.authService.findMobileOwner(mobile);
      if (mobileOwner) {
        throw new AppError(409, 'This mobile number is already linked to another account.');
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

  public readonly sendEmailForRegistration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = emailSendSchema.safeParse(req.body);
      if (!body.success) {
        throw new AppError(400, body.error.errors[0]?.message ?? 'Enter a valid email address');
      }

      const email = body.data.email;
      const { expiresIn, cooldownSeconds } = await this.otpService.requestEmailOtp(registrationEmailSubject(email), email);
      res.json({ success: true, data: { sent: true, expiresIn, cooldownSeconds } });
    } catch (err) {
      next(err);
    }
  };

  public readonly verifyEmailForRegistration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = emailVerifySchema.safeParse(req.body);
      if (!body.success) {
        throw new AppError(400, body.error.errors[0]?.message ?? 'Invalid OTP');
      }

      const email = body.data.email;
      await this.otpService.verifyOtp(registrationEmailSubject(email), email, body.data.otp, 'email address');
      await this.otpService.markVerified(registrationEmailSubject(email), email);

      res.json({ success: true, data: { verified: true, email } });
    } catch (err) {
      next(err);
    }
  };

  public readonly sendEmail = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = emailSendSchema.safeParse(req.body);
      if (!body.success) {
        throw new AppError(400, body.error.errors[0]?.message ?? 'Enter a valid email address');
      }

      const email = body.data.email;
      const { expiresIn, cooldownSeconds } = await this.otpService.requestEmailOtp(req.user!.userId, email);
      res.json({ success: true, data: { sent: true, expiresIn, cooldownSeconds } });
    } catch (err) {
      next(err);
    }
  };

  public readonly verifyEmail = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = emailVerifySchema.safeParse(req.body);
      if (!body.success) {
        throw new AppError(400, body.error.errors[0]?.message ?? 'Invalid OTP');
      }

      const email = body.data.email;
      await this.otpService.verifyOtp(req.user!.userId, email, body.data.otp, 'email address');

      const user = await this.authService.verifyEmail(req.user!.userId, email);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  };

  public readonly registrationStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = statusSchema.safeParse(req.body);
      if (!body.success) {
        throw new AppError(400, body.error.errors[0]?.message ?? 'Enter a valid email and mobile number');
      }

      const email = body.data.email;
      const mobile = normalizeMobile(body.data.mobile);

      const [emailVerified, mobileVerified] = await Promise.all([
        this.otpService.isVerified(registrationEmailSubject(email), email),
        mobile ? this.otpService.isVerified(registrationSubject(mobile), mobile) : Promise.resolve(false),
      ]);

      res.json({ success: true, data: { emailVerified, mobileVerified } });
    } catch (err) {
      next(err);
    }
  };
}
