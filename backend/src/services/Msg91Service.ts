import { OTP_CONSTANTS } from '../config/constants';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

const DEFAULT_BASE_URL = 'https://apitxt.com/api';

interface Msg91Response {
  status?: string;
  message?: string;
  code?: number;
  data?: {
    request_id?: string;
    mobile?: string;
  };
}

export class Msg91Service {
  private get authKey(): string {
    const key = (process.env.APITXT_AUTH_KEY ?? process.env.MSG91_AUTHKEY)?.trim();
    if (!key) throw new AppError(503, 'SMS service is not configured yet');
    return key;
  }

  private get baseUrl(): string {
    const configured = (process.env.APITXT_BASE_URL ?? process.env.MSG91_BASE_URL)?.trim();
    return (configured || DEFAULT_BASE_URL).replace(/\/+$/, '');
  }

  public async sendOtp(mobile: string, otp: string): Promise<{ requestId?: string }> {
    const authkey = this.authKey;

    const url = new URL(`${this.baseUrl}/sendOTP`);
    url.searchParams.set('authkey', authkey);
    url.searchParams.set('mobile', mobile);
    url.searchParams.set('otp', otp);

    let res: Response;
    try {
      res = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(OTP_CONSTANTS.UPSTREAM_TIMEOUT_MS),
      });
    } catch (err) {
      logger.error({ err: err instanceof Error ? err.message : String(err) }, '[msg91] sendOTP request failed');
      throw new AppError(502, 'Could not reach the SMS service. Please try again.');
    }

    const body = (await res.json().catch(() => ({}))) as Msg91Response;

    if (res.ok && body.status === 'success') {
      logger.info({ mobile, requestId: body.data?.request_id }, '[msg91] OTP sent');
      return { requestId: body.data?.request_id };
    }

    const message = body.message?.trim() || `SMS service responded with HTTP ${res.status}`;
    logger.warn({ mobile, status: res.status, code: body.code, message }, '[msg91] OTP send rejected');

    if (body.code === 429 || res.status === 429 || /please wait/i.test(message)) {
      throw new AppError(429, 'Please wait a few seconds before requesting another code.');
    }
    if (/auth|invalid|unauthor/i.test(message)) {
      throw new AppError(502, 'Could not send the code right now. Please try again later.');
    }

    throw new AppError(502, message);
  }
}

export const msg91Service = new Msg91Service();
