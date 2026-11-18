import jwt from 'jsonwebtoken';
import { GOOGLE_CONSTANTS } from '../config/constants';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export interface GoogleConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
}

export interface GoogleProfile {
  sub: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  picture: string | null;
}

export interface GoogleState {
  nonce: string;
  redirectTo: string;
  audience: GoogleAudience;
}

export type GoogleAudience = 'faculty' | 'student';

export function readGoogleConfig(): GoogleConfig | null {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL?.trim();
  if (!clientId || !clientSecret || !callbackUrl) return null;
  return { clientId, clientSecret, callbackUrl };
}

export function sanitizeRedirectPath(raw: unknown, fallback = '/faculty'): string {
  if (typeof raw !== 'string') return fallback;
  const value = raw.trim();
  if (!value.startsWith('/')) return fallback;
  if (value.startsWith('//')) return fallback;
  if (value.includes('\\')) return fallback;
  return value;
}

export class GoogleAuthService {
  public isConfigured(): boolean {
    return readGoogleConfig() !== null;
  }

  private requireConfig(): GoogleConfig {
    const config = readGoogleConfig();
    if (!config) throw new AppError(503, 'Google sign-in is not configured on this server');
    return config;
  }

  public buildAuthUrl(state: string): string {
    const config = this.requireConfig();
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.callbackUrl,
      response_type: 'code',
      scope: GOOGLE_CONSTANTS.SCOPES,
      access_type: 'online',
      include_granted_scopes: 'true',
      prompt: 'select_account',
      state,
    });
    return `${GOOGLE_CONSTANTS.AUTH_ENDPOINT}?${params.toString()}`;
  }

  public signState(state: GoogleState): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError(500, 'Server misconfiguration');
    return jwt.sign(state, secret, {
      algorithm: 'HS256',
      expiresIn: `${GOOGLE_CONSTANTS.STATE_TTL_SECONDS}s`,
    });
  }

  public verifyState(raw: unknown): GoogleState {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError(500, 'Server misconfiguration');
    if (typeof raw !== 'string' || !raw) {
      throw new AppError(400, 'Missing OAuth state parameter');
    }
    try {
      const payload = jwt.verify(raw, secret, { algorithms: ['HS256'] }) as {
        nonce?: string;
        redirectTo?: string;
        audience?: string;
      };
      if (!payload.nonce) throw new Error('state is missing its nonce');
      const audience: GoogleAudience = payload.audience === 'student' ? 'student' : 'faculty';
      return {
        nonce: payload.nonce,
        redirectTo: sanitizeRedirectPath(payload.redirectTo),
        audience,
      };
    } catch {
      throw new AppError(400, 'Invalid or expired sign-in request. Please try again.');
    }
  }

  public async exchangeCode(code: string): Promise<string> {
    const config = this.requireConfig();
    const response = await fetch(GOOGLE_CONSTANTS.TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.callbackUrl,
        grant_type: 'authorization_code',
      }),
      signal: AbortSignal.timeout(GOOGLE_CONSTANTS.UPSTREAM_TIMEOUT_MS),
    }).catch((err: unknown) => {
      logger.warn({ err }, 'Google token exchange request failed');
      throw new AppError(502, 'Could not reach Google to complete sign-in. Please try again.');
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      logger.warn({ status: response.status, detail: detail.slice(0, 200) }, 'Google token exchange rejected');
      if (response.status === 400 || response.status === 401) {
        throw new AppError(400, 'Google rejected the sign-in request. Please start again.');
      }
      throw new AppError(502, 'Google rejected the sign-in request. Please try again.');
    }

    const payload = (await response.json()) as { access_token?: string };
    if (!payload.access_token) {
      throw new AppError(502, 'Google did not return an access token');
    }
    return payload.access_token;
  }

  public async fetchProfile(accessToken: string): Promise<GoogleProfile> {
    const response = await fetch(GOOGLE_CONSTANTS.USERINFO_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(GOOGLE_CONSTANTS.UPSTREAM_TIMEOUT_MS),
    }).catch((err: unknown) => {
      logger.warn({ err }, 'Google profile lookup request failed');
      throw new AppError(502, 'Could not reach Google to complete sign-in. Please try again.');
    });

    if (!response.ok) {
      logger.warn({ status: response.status }, 'Google profile lookup rejected');
      throw new AppError(502, 'Could not read your Google profile. Please try again.');
    }

    const payload = (await response.json()) as {
      sub?: string;
      email?: string;
      email_verified?: boolean | string;
      name?: string;
      picture?: string;
    };

    const email = payload.email?.trim().toLowerCase();
    if (!payload.sub || !email) {
      throw new AppError(400, 'Google did not share a usable email address');
    }

    const verified = payload.email_verified === true || payload.email_verified === 'true';
    return {
      sub: payload.sub,
      email,
      emailVerified: verified,
      name: payload.name?.trim() || null,
      picture: payload.picture ?? null,
    };
  }
}
