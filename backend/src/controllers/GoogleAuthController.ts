import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import {
  clearGoogleStateCookie,
  readGoogleStateCookie,
  setGoogleStateCookie,
} from '../middlewares/googleAuth.middleware';
import { setFacultyCookie } from '../middlewares/facultyAuth.middleware';
import { setSessionCookie } from '../middlewares/auth.middleware';
import { AuthService } from '../services/AuthService';
import { FacultyAuthService } from '../services/FacultyAuthService';
import { GoogleAuthService, sanitizeRedirectPath, type GoogleAudience, type GoogleProfile } from '../services/GoogleAuthService';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

const LOGIN_PATHS: Record<GoogleAudience, string> = {
  faculty: '/faculty/login',
  student: '/login',
};

function frontendBaseUrl(): string {
  const raw = process.env.FRONTEND_URL?.trim() || 'http://localhost:3000';
  return raw.replace(/\/+$/, '');
}

function friendlyError(err: unknown): string {
  if (err instanceof AppError && err.statusCode < 500) return err.message;
  return 'Google sign-in is currently unavailable. Please try again.';
}

export class GoogleAuthController {
  constructor(
    private readonly googleService: GoogleAuthService = new GoogleAuthService(),
    private readonly facultyAuthService: FacultyAuthService = new FacultyAuthService(),
    private readonly authService: AuthService = new AuthService(),
  ) {}

  public readonly start = (req: Request, res: Response): void => {
    this.beginFlow(req, res, 'faculty');
  };

  public readonly startStudent = (req: Request, res: Response): void => {
    this.beginFlow(req, res, 'student');
  };

  private beginFlow(req: Request, res: Response, audience: GoogleAudience): void {
    try {
      if (!this.googleService.isConfigured()) {
        throw new AppError(503, 'Google sign-in is not configured on this server');
      }

      const nonce = crypto.randomBytes(24).toString('base64url');
      const redirectTo = sanitizeRedirectPath(req.query.redirect, audience === 'student' ? '/auth/google' : '/faculty');
      const state = this.googleService.signState({ nonce, redirectTo, audience });

      setGoogleStateCookie(res, nonce);
      res.redirect(302, this.googleService.buildAuthUrl(state));
    } catch (err) {
      logger.warn({ err }, 'Google sign-in could not be started');
      res.redirect(302, `${frontendBaseUrl()}${LOGIN_PATHS[audience]}?error=${encodeURIComponent(friendlyError(err))}`);
    }
  }

  public readonly callback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let audience: GoogleAudience = 'faculty';
    try {
      const providerError = typeof req.query.error === 'string' ? req.query.error : '';
      if (providerError) {
        throw new AppError(
          400,
          providerError === 'access_denied'
            ? 'Google sign-in was cancelled.'
            : 'Google sign-in could not be completed. Please try again.',
        );
      }

      const code = typeof req.query.code === 'string' ? req.query.code : '';
      if (!code) throw new AppError(400, 'Google did not return an authorization code');

      const state = this.googleService.verifyState(req.query.state);
      audience = state.audience;

      const cookieNonce = readGoogleStateCookie(req);
      clearGoogleStateCookie(res);
      if (!cookieNonce || cookieNonce !== state.nonce) {
        throw new AppError(400, 'Sign-in request could not be verified. Please try again.');
      }

      const accessToken = await this.googleService.exchangeCode(code);
      const profile = await this.googleService.fetchProfile(accessToken);

      if (state.audience === 'student') {
        await this.completeStudentSignIn(res, profile, state.redirectTo);
      } else {
        await this.completeFacultySignIn(res, profile, state.redirectTo);
      }
    } catch (err) {
      const status = err instanceof AppError ? err.statusCode : 500;
      logger.warn({ err, status }, 'Google sign-in failed');
      if (res.headersSent) {
        next(err);
        return;
      }
      res.redirect(302, `${frontendBaseUrl()}${LOGIN_PATHS[audience]}?error=${encodeURIComponent(friendlyError(err))}`);
    }
  };

  private async completeFacultySignIn(res: Response, profile: GoogleProfile, redirectTo: string): Promise<void> {
    const session = await this.facultyAuthService.loginWithGoogle(profile);
    setFacultyCookie(res, session.token);
    logger.info(
      { facultyId: session.faculty.id, email: session.faculty.email, mobileVerified: session.faculty.mobileVerified },
      'Faculty signed in with Google',
    );
    res.redirect(302, `${frontendBaseUrl()}${redirectTo}`);
  }

  private async completeStudentSignIn(res: Response, profile: GoogleProfile, redirectTo: string): Promise<void> {
    const session = await this.authService.loginWithGoogle(profile);
    setSessionCookie(res, session.token);
    logger.info(
      { userId: session.user.id, email: session.user.email, created: session.created },
      'Student signed in with Google',
    );
    const target = redirectTo;
    res.redirect(302, `${frontendBaseUrl()}${target}`);
  }
}
