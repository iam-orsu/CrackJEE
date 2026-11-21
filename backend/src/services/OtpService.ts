import { createHash, randomInt, timingSafeEqual } from 'crypto';
import { OTP_CONSTANTS } from '../config/constants';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { CacheService, cacheService as defaultCache } from './CacheService';
import { Msg91Service } from './Msg91Service';

interface OtpRecord {
  hash: string;
  mobile: string;
  attempts: number;
}

const recordKey = (subject: string): string => `otp:${subject}`;
const cooldownKey = (subject: string): string => `otp:cooldown:${subject}`;
const verifiedKey = (subject: string): string => `otpok:${subject}`;

export class OtpService {
  constructor(
    private readonly cache: CacheService = defaultCache,
    private readonly sms: Msg91Service = new Msg91Service(),
  ) {}

  private hash(mobile: string, otp: string): string {
    const pepper = process.env.JWT_SECRET ?? 'otp-pepper';
    return createHash('sha256').update(`${pepper}:${mobile}:${otp}`).digest('hex');
  }

  private generateOtp(): string {
    return String(randomInt(0, 10 ** OTP_CONSTANTS.DIGITS)).padStart(OTP_CONSTANTS.DIGITS, '0');
  }

  public async requestOtp(subject: string, mobile: string): Promise<{ expiresIn: number; cooldownSeconds: number }> {
    const acquired = await this.cache.setNx(cooldownKey(subject), OTP_CONSTANTS.RESEND_COOLDOWN_SECONDS);
    if (!acquired) {
      throw new AppError(429, `Please wait ${OTP_CONSTANTS.RESEND_COOLDOWN_SECONDS} seconds before requesting another code.`);
    }

    const otp = this.generateOtp();
    const record: OtpRecord = { hash: this.hash(mobile, otp), mobile, attempts: 0 };

    try {
      await this.sms.sendOtp(mobile, otp);
    } catch (err) {
      await this.cache.del(recordKey(subject));
      await this.cache.del(cooldownKey(subject));
      throw err;
    }

    await this.cache.setJson(recordKey(subject), record, OTP_CONSTANTS.TTL_SECONDS);
    logger.info({ subject, mobile }, '[otp] code issued');

    return {
      expiresIn: OTP_CONSTANTS.TTL_SECONDS,
      cooldownSeconds: OTP_CONSTANTS.RESEND_COOLDOWN_SECONDS,
    };
  }

  public async verifyOtp(subject: string, mobile: string, otp: string): Promise<void> {
    const record = await this.cache.getJson<OtpRecord>(recordKey(subject));
    if (!record) {
      throw new AppError(400, 'That code has expired. Request a new one.');
    }
    if (record.mobile !== mobile) {
      throw new AppError(400, 'That code was sent to a different number.');
    }
    if (record.attempts >= OTP_CONSTANTS.MAX_VERIFY_ATTEMPTS) {
      await this.cache.del(recordKey(subject));
      throw new AppError(429, 'Too many incorrect attempts. Request a new code.');
    }

    const expected = Buffer.from(record.hash, 'hex');
    const actual = Buffer.from(this.hash(mobile, otp), 'hex');
    const matches = expected.length === actual.length && timingSafeEqual(expected, actual);

    if (!matches) {
      record.attempts += 1;
      const remaining = Math.max(0, OTP_CONSTANTS.MAX_VERIFY_ATTEMPTS - record.attempts);
      await this.cache.setJson(recordKey(subject), record, OTP_CONSTANTS.TTL_SECONDS);
      throw new AppError(400, `Incorrect code. ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} left.`);
    }

    await this.cache.del(recordKey(subject));
    logger.info({ subject, mobile }, '[otp] code verified');
  }

  public async markVerified(subject: string, mobile: string): Promise<void> {
    await this.cache.setJson(verifiedKey(subject), { mobile }, OTP_CONSTANTS.VERIFIED_TTL_SECONDS);
  }

  public async isVerified(subject: string, mobile: string): Promise<boolean> {
    const record = await this.cache.getJson<{ mobile: string }>(verifiedKey(subject));
    return Boolean(record && record.mobile === mobile);
  }
}

export const otpService = new OtpService();
