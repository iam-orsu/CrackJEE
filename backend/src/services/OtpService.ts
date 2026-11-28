import { createHash, randomInt, timingSafeEqual } from 'crypto';
import nodemailer from 'nodemailer';
import { OTP_CONSTANTS } from '../config/constants';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { CacheService, cacheService as defaultCache } from './CacheService';
import { Msg91Service } from './Msg91Service';

interface OtpRecord {
  hash: string;
  target: string;
  attempts: number;
}

const recordKey = (subject: string): string => `otp:${subject}`;
const cooldownKey = (subject: string): string => `otp:cooldown:${subject}`;
const verifiedKey = (subject: string): string => `otpok:${subject}`;

export class OtpService {
  private transporter: nodemailer.Transporter | null = null;

  constructor(
    private readonly cache: CacheService = defaultCache,
    private readonly sms: Msg91Service = new Msg91Service(),
  ) {}

  private hash(target: string, otp: string): string {
    const pepper = process.env.JWT_SECRET ?? 'otp-pepper';
    return createHash('sha256').update(`${pepper}:${target}:${otp}`).digest('hex');
  }

  private generateOtp(): string {
    return String(randomInt(0, 10 ** OTP_CONSTANTS.DIGITS)).padStart(OTP_CONSTANTS.DIGITS, '0');
  }

  private get mail(): nodemailer.Transporter {
    if (!this.transporter) {
      const port = Number(process.env.SMTP_PORT ?? 465);
      this.transporter = nodemailer.createTransport({
        host: (process.env.SMTP_HOST ?? 'smtp.zeptomail.com').trim(),
        port,
        secure: port === 465,
        auth: {
          user: (process.env.SMTP_USER ?? '').trim(),
          pass: process.env.SMTP_PASS ?? '',
        },
      });
    }
    return this.transporter;
  }

  private verificationEmailHtml(otp: string, minutes: number): string {
    const font = "'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Verify your email</title>
</head>
<body style="margin:0;padding:0;background:#eef1f6;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f6;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px;max-width:480px;background:#ffffff;border-radius:20px;border:1px solid rgba(0,51,102,0.1);box-shadow:0 10px 24px -18px rgba(0,51,102,0.5);overflow:hidden;">
        <tr>
          <td style="height:6px;line-height:6px;font-size:0;background-color:#803688;background-image:linear-gradient(135deg,#803688,#A24BA8);">&nbsp;</td>
        </tr>
        <tr>
          <td align="center" style="padding:32px 36px 4px;">
            <img src="https://jeeneet.ai/logo.png" width="168" alt="JEENEET.ai" style="display:block;width:168px;max-width:168px;height:auto;border:0;outline:none;text-decoration:none;">
          </td>
        </tr>
        <tr>
          <td style="padding:12px 36px 0;font-family:${font};text-align:center;">
            <h1 style="margin:0 0 8px;font-size:24px;line-height:1.3;font-weight:800;color:#003366;">Verify your email</h1>
            <p style="margin:0;font-size:15px;line-height:1.6;color:#4a5568;">Use the code below to finish signing up for JEENEET.ai.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 36px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1.5px dashed rgba(128,54,136,0.35);border-radius:14px;background:#faf5fb;">
              <tr>
                <td align="center" style="padding:20px 12px;font-family:'Courier New',monospace;font-size:36px;font-weight:700;letter-spacing:10px;color:#5A2560;">${otp}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 36px 0;font-family:${font};text-align:center;">
            <p style="margin:0;font-size:14px;line-height:1.6;color:#718096;">This code expires in <strong style="color:#003366;">${minutes} minutes</strong>.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 36px 32px;font-family:${font};text-align:center;">
            <p style="margin:0;font-size:13px;line-height:1.6;color:#a0aec0;">If you did not request this, you can safely ignore this email.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 36px;background:#f7f8fb;border-top:1px solid rgba(0,51,102,0.08);font-family:${font};text-align:center;">
            <p style="margin:0;font-size:12px;line-height:1.6;color:#a0aec0;">JEENEET.ai &middot; Your AI study companion for JEE &amp; NEET</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
  }

  private async sendEmailOtp(email: string, otp: string): Promise<void> {
    const user = (process.env.SMTP_USER ?? '').trim();
    const pass = process.env.SMTP_PASS ?? '';
    if (!user || !pass) {
      throw new AppError(503, 'Email service is not configured yet');
    }

    const minutes = Math.floor(OTP_CONSTANTS.TTL_SECONDS / 60);

    try {
      await this.mail.sendMail({
        from: (process.env.SMTP_FROM ?? 'no-reply@jeeneet.ai').trim(),
        to: email,
        subject: 'Your JEENEET.ai verification code',
        text: `Your verification code is ${otp}. It expires in ${minutes} minutes. If you did not request this, ignore this email.`,
        html: this.verificationEmailHtml(otp, minutes),
      });
    } catch (err) {
      logger.error({ err: err instanceof Error ? err.message : String(err) }, '[smtp] OTP email failed');
      throw new AppError(502, 'Could not send the verification email. Please try again.');
    }
  }

  private async issue(
    subject: string,
    target: string,
    deliver: (otp: string) => Promise<unknown>,
  ): Promise<{ expiresIn: number; cooldownSeconds: number }> {
    const acquired = await this.cache.setNx(cooldownKey(subject), OTP_CONSTANTS.RESEND_COOLDOWN_SECONDS);
    if (!acquired) {
      throw new AppError(429, `Please wait ${OTP_CONSTANTS.RESEND_COOLDOWN_SECONDS} seconds before requesting another code.`);
    }

    const otp = this.generateOtp();
    const record: OtpRecord = { hash: this.hash(target, otp), target, attempts: 0 };

    try {
      await deliver(otp);
    } catch (err) {
      await this.cache.del(recordKey(subject));
      await this.cache.del(cooldownKey(subject));
      throw err;
    }

    await this.cache.setJson(recordKey(subject), record, OTP_CONSTANTS.TTL_SECONDS);
    logger.info({ subject }, '[otp] code issued');

    return {
      expiresIn: OTP_CONSTANTS.TTL_SECONDS,
      cooldownSeconds: OTP_CONSTANTS.RESEND_COOLDOWN_SECONDS,
    };
  }

  public async requestOtp(subject: string, mobile: string): Promise<{ expiresIn: number; cooldownSeconds: number }> {
    return this.issue(subject, mobile, (otp) => this.sms.sendOtp(mobile, otp));
  }

  public async requestEmailOtp(subject: string, email: string): Promise<{ expiresIn: number; cooldownSeconds: number }> {
    return this.issue(subject, email, (otp) => this.sendEmailOtp(email, otp));
  }

  public async verifyOtp(subject: string, target: string, otp: string, label = 'number'): Promise<void> {
    const record = await this.cache.getJson<OtpRecord>(recordKey(subject));
    if (!record) {
      throw new AppError(400, 'That code has expired. Request a new one.');
    }
    if (record.target !== target) {
      throw new AppError(400, `That code was sent to a different ${label}.`);
    }
    if (record.attempts >= OTP_CONSTANTS.MAX_VERIFY_ATTEMPTS) {
      await this.cache.del(recordKey(subject));
      throw new AppError(429, 'Too many incorrect attempts. Request a new code.');
    }

    const expected = Buffer.from(record.hash, 'hex');
    const actual = Buffer.from(this.hash(target, otp), 'hex');
    const matches = expected.length === actual.length && timingSafeEqual(expected, actual);

    if (!matches) {
      record.attempts += 1;
      const remaining = Math.max(0, OTP_CONSTANTS.MAX_VERIFY_ATTEMPTS - record.attempts);
      await this.cache.setJson(recordKey(subject), record, OTP_CONSTANTS.TTL_SECONDS);
      throw new AppError(400, `Incorrect code. ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} left.`);
    }

    await this.cache.del(recordKey(subject));
    logger.info({ subject }, '[otp] code verified');
  }

  public async markVerified(subject: string, target: string): Promise<void> {
    await this.cache.setJson(verifiedKey(subject), { target }, OTP_CONSTANTS.VERIFIED_TTL_SECONDS);
  }

  public async isVerified(subject: string, target: string): Promise<boolean> {
    const record = await this.cache.getJson<{ target: string }>(verifiedKey(subject));
    return Boolean(record && record.target === target);
  }
}

export const otpService = new OtpService();
