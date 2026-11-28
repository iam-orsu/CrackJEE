import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import { FacultyStudentOnboardingService } from '../services/FacultyStudentOnboardingService';
import type { FacultyStudentAuthRequest } from '../middlewares/facultyStudentAuth.middleware';
import { AppError } from '../utils/AppError';

const emailSendSchema = z.object({
  email: z.string().trim().email('Enter a valid email address').max(254).optional(),
});

const emailVerifySchema = z.object({
  email: z.string().trim().email('Enter a valid email address').max(254),
  otp: z.string().trim().regex(/^\d{4}$/, 'Enter the 4-digit code we sent you'),
});

const mobileSendSchema = z.object({
  mobile: z.string().trim().min(6).max(20),
});

const mobileVerifySchema = z.object({
  mobile: z.string().trim().min(6).max(20),
  otp: z.string().trim().regex(/^\d{4}$/, 'Enter the 4-digit code we sent you'),
});

/** Drives the student-portal onboarding: email + mobile OTP verification after login. */
export class FacultyStudentOnboardingController {
  constructor(
    private readonly onboardingService: FacultyStudentOnboardingService = new FacultyStudentOnboardingService(),
  ) {}

  public readonly sendEmailOtp = async (
    req: FacultyStudentAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = emailSendSchema.safeParse(req.body ?? {});
      if (!parsed.success) {
        throw new AppError(400, parsed.error.issues[0]?.message ?? 'Enter a valid email address');
      }
      const result = await this.onboardingService.sendEmailOtp(
        req.facultyStudent!.studentId,
        parsed.data.email,
      );
      res.json({ success: true, sent: true, ...result });
    } catch (err) {
      next(err);
    }
  };

  public readonly verifyEmailOtp = async (
    req: FacultyStudentAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = emailVerifySchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.issues[0]?.message ?? 'Invalid OTP');
      }
      const result = await this.onboardingService.verifyEmailOtp(
        req.facultyStudent!.studentId,
        parsed.data.email,
        parsed.data.otp,
      );
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  };

  public readonly sendMobileOtp = async (
    req: FacultyStudentAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = mobileSendSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.issues[0]?.message ?? 'Enter a valid 10-digit mobile number');
      }
      const result = await this.onboardingService.sendMobileOtp(
        req.facultyStudent!.studentId,
        parsed.data.mobile,
      );
      res.json({ success: true, sent: true, ...result });
    } catch (err) {
      next(err);
    }
  };

  public readonly verifyMobileOtp = async (
    req: FacultyStudentAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = mobileVerifySchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.issues[0]?.message ?? 'Invalid OTP');
      }
      const result = await this.onboardingService.verifyMobileOtp(
        req.facultyStudent!.studentId,
        parsed.data.mobile,
        parsed.data.otp,
      );
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  };

  public readonly complete = async (
    req: FacultyStudentAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.onboardingService.complete(req.facultyStudent!.studentId);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  };
}
