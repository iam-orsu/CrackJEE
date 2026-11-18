import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import {
  clearGoogleStateCookie,
  readGoogleStateCookie,
  setGoogleStateCookie,
} from '../middlewares/googleAuth.middleware';
import { setFacultyCookie } from '../middlewares/facultyAuth.middleware';
import { FacultyAuthService } from '../services/FacultyAuthService';
import { GoogleAuthService, sanitizeRedirectPath } from '../services/GoogleAuthService';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

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
  ) {}

  public readonly start = (req: Request, res: Response): void => {
    try {
      if (!this.googleService.isConfigured()) {
        throw new AppError(503, 'Google sign-in is not configured on this server');
      }

      const nonce = crypto.randomBytes(24).toString('base64url');
      const redirectTo = sanitizeRedirectPath(req.query.redirect);
      const state = this.googleService.signState({ nonce, redirectTo });

      setGoogleStateCookie(res, nonce);
      res.redirect(302, this.googleService.buildAuthUrl(state));
    } catch (err) {
      logger.warn({ err }, 'Google sign-in could not be started');
      res.redirect(302, `${frontendBaseUrl()}/faculty/login?error=${encodeURIComponent(friendlyError(err))}`);
    }
  };

  public readonly callback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
      const cookieNonce = readGoogleStateCookie(req);
      clearGoogleStateCookie(res);
      if (!cookieNonce || cookieNonce !== state.nonce) {
        throw new AppError(400, 'Sign-in request could not be verified. Please try again.');
      }

      const accessToken = await this.googleService.exchangeCode(code);
      const profile = await this.googleService.fetchProfile(accessToken);
      const session = await this.facultyAuthService.loginWithGoogle(profile);

      setFacultyCookie(res, session.token);
      logger.info({ facultyId: session.faculty.id, email: session.faculty.email }, 'Faculty signed in with Google');
      res.redirect(302, `${frontendBaseUrl()}${state.redirectTo}`);
    } catch (err) {
      const status = err instanceof AppError ? err.statusCode : 500;
      logger.warn({ err, status }, 'Google faculty sign-in failed');
      if (res.headersSent) {
        next(err);
        return;
      }
      res.redirect(302, `${frontendBaseUrl()}/faculty/login?error=${encodeURIComponent(friendlyError(err))}`);
    }
  };
}
