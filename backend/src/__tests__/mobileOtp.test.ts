import { describe, it, before, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import nodemailer from 'nodemailer';
import { AppError } from '../utils/AppError';
import { normalizeMobile, maskMobile } from '../utils/mobile';
import { OTP_CONSTANTS } from '../config/constants';
import { CacheService } from '../services/CacheService';
import { OtpService } from '../services/OtpService';
import { Msg91Service } from '../services/Msg91Service';

const TEST_SECRET = 'test-jwt-secret-for-otp-tests-crackjee-2026';

class FakeSms {
  public sent: Array<{ mobile: string; otp: string }> = [];
  public failWith: Error | null = null;

  async sendOtp(mobile: string, otp: string): Promise<{ requestId?: string }> {
    if (this.failWith) throw this.failWith;
    this.sent.push({ mobile, otp });
    return { requestId: 'test-request' };
  }
}

function makeService(): { service: OtpService; sms: FakeSms } {
  const sms = new FakeSms();
  const cache = new CacheService();
  const service = new OtpService(cache, sms as unknown as Msg91Service);
  return { service, sms };
}

describe('Mobile number normalisation', () => {
  it('accepts the plain 10-digit national number', () => {
    assert.equal(normalizeMobile('8341665060'), '918341665060');
  });

  it('accepts +91, 91 and 0 prefixed forms', () => {
    assert.equal(normalizeMobile('+918341665060'), '918341665060');
    assert.equal(normalizeMobile('918341665060'), '918341665060');
    assert.equal(normalizeMobile('08341665060'), '918341665060');
    assert.equal(normalizeMobile(' 83416 65060 '), '918341665060');
  });

  it('rejects numbers that are not valid Indian mobile numbers', () => {
    assert.equal(normalizeMobile('1234567890'), null);
    assert.equal(normalizeMobile('834166506'), null);
    assert.equal(normalizeMobile('83416650601'), null);
    assert.equal(normalizeMobile(''), null);
    assert.equal(normalizeMobile('abcdefghij'), null);
  });

  it('masks a normalised number for display', () => {
    assert.equal(maskMobile('918341665060'), '+91 83416 65060');
  });
});

describe('OtpService', () => {
  before(() => {
    process.env.JWT_SECRET = TEST_SECRET;
    process.env.REDIS_URL = '';
  });

  beforeEach(() => {
    process.env.REDIS_URL = '';
  });

  it('sends a 4-digit code and reports the expiry window', async () => {
    const { service, sms } = makeService();

    const result = await service.requestOtp('user-1', '918341665060');

    assert.equal(result.expiresIn, OTP_CONSTANTS.TTL_SECONDS);
    assert.equal(result.cooldownSeconds, OTP_CONSTANTS.RESEND_COOLDOWN_SECONDS);
    assert.equal(sms.sent.length, 1);
    assert.equal(sms.sent[0].mobile, '918341665060');
    assert.match(sms.sent[0].otp, /^\d{4}$/);
  });

  it('accepts the correct code and clears the stored record', async () => {
    const { service, sms } = makeService();

    await service.requestOtp('user-2', '918341665060');
    const code = sms.sent[0].otp;

    await service.verifyOtp('user-2', '918341665060', code);

    await assert.rejects(
      () => service.verifyOtp('user-2', '918341665060', code),
      (err: AppError) => err.statusCode === 400 && /expired/i.test(err.message),
    );
  });

  it('rejects an incorrect code and counts the remaining attempts', async () => {
    const { service, sms } = makeService();

    await service.requestOtp('user-3', '918341665060');
    const code = sms.sent[0].otp;
    const wrong = code === '0000' ? '1111' : '0000';

    await assert.rejects(
      () => service.verifyOtp('user-3', '918341665060', wrong),
      (err: AppError) => err.statusCode === 400 && /attempts? left/i.test(err.message),
    );
  });

  it('locks the code out after too many incorrect attempts', async () => {
    const { service, sms } = makeService();

    await service.requestOtp('user-4', '918341665060');
    const code = sms.sent[0].otp;
    const wrong = code === '0000' ? '1111' : '0000';

    for (let i = 0; i < OTP_CONSTANTS.MAX_VERIFY_ATTEMPTS; i += 1) {
      await assert.rejects(() => service.verifyOtp('user-4', '918341665060', wrong));
    }

    await assert.rejects(
      () => service.verifyOtp('user-4', '918341665060', code),
      (err: AppError) => err.statusCode === 429,
    );
  });

  it('rejects a code that was sent to a different number', async () => {
    const { service, sms } = makeService();

    await service.requestOtp('user-5', '918341665060');
    const code = sms.sent[0].otp;

    await assert.rejects(
      () => service.verifyOtp('user-5', '919999999999', code),
      (err: AppError) => err.statusCode === 400 && /different number/i.test(err.message),
    );
  });

  it('rejects a code that was never issued', async () => {
    const { service } = makeService();

    await assert.rejects(
      () => service.verifyOtp('user-6', '918341665060', '1234'),
      (err: AppError) => err.statusCode === 400 && /expired/i.test(err.message),
    );
  });

  it('blocks a second request inside the resend cooldown', async () => {
    const { service, sms } = makeService();

    await service.requestOtp('user-7', '918341665060');

    await assert.rejects(
      () => service.requestOtp('user-7', '918341665060'),
      (err: AppError) => err.statusCode === 429 && /wait/i.test(err.message),
    );
    assert.equal(sms.sent.length, 1);
  });

  it('drops the stored code when the SMS could not be delivered', async () => {
    const { service, sms } = makeService();
    sms.failWith = new AppError(502, 'gateway down');

    await assert.rejects(() => service.requestOtp('user-8', '918341665060'));

    sms.failWith = null;
    await service.requestOtp('user-8', '918341665060');
    assert.equal(sms.sent.length, 1);
  });
});

describe('Msg91Service', () => {
  const originalFetch = globalThis.fetch;

  before(() => {
    process.env.APITXT_AUTH_KEY = 'test-auth-key-for-msg91-client';
    process.env.APITXT_BASE_URL = 'https://apitxt.com/api';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  function stubFetch(handler: (url: string) => { ok: boolean; status: number; body: unknown }): void {
    globalThis.fetch = (async (input: any) => {
      const { ok, status, body } = handler(String(input));
      return { ok, status, json: async () => body } as any;
    }) as typeof fetch;
  }

  it('sends the code and returns the provider request id', async () => {
    let requestedUrl = '';
    stubFetch((url) => {
      requestedUrl = url;
      return {
        ok: true,
        status: 200,
        body: { status: 'success', message: 'Sms OTP Sent Successfully', data: { request_id: 'SMS-OTP-1' } },
      };
    });

    const result = await new Msg91Service().sendOtp('918341665060', '4521');

    assert.equal(result.requestId, 'SMS-OTP-1');
    assert.ok(requestedUrl.startsWith('https://apitxt.com/api/sendOTP?'));
    assert.ok(requestedUrl.includes('mobile=918341665060'));
    assert.ok(requestedUrl.includes('otp=4521'));
    assert.ok(requestedUrl.includes('authkey=test-auth-key-for-msg91-client'));
  });

  it('maps the provider resend cooldown to a 429', async () => {
    stubFetch(() => ({
      ok: true,
      status: 200,
      body: { status: 'error', message: 'Please wait 15 seconds before requesting another OTP for this number.', code: 429 },
    }));

    await assert.rejects(
      () => new Msg91Service().sendOtp('918341665060', '4521'),
      (err: AppError) => err.statusCode === 429,
    );
  });

  it('surfaces other provider failures as a 502', async () => {
    stubFetch(() => ({ ok: false, status: 500, body: { status: 'error', message: 'Server error' } }));

    await assert.rejects(
      () => new Msg91Service().sendOtp('918341665060', '4521'),
      (err: AppError) => err.statusCode === 502,
    );
  });

  it('reports a missing auth key instead of calling the provider', async () => {
    const savedKey = process.env.APITXT_AUTH_KEY;
    delete process.env.APITXT_AUTH_KEY;

    await assert.rejects(
      () => new Msg91Service().sendOtp('918341665060', '4521'),
      (err: AppError) => err.statusCode === 503,
    );

    process.env.APITXT_AUTH_KEY = savedKey;
  });
});

describe('Registration OTP flow', () => {
  before(() => {
    process.env.JWT_SECRET = TEST_SECRET;
    process.env.REDIS_URL = '';
  });

  beforeEach(() => {
    process.env.REDIS_URL = '';
  });

  it('marks a number as verified so an account can be created with it', async () => {
    const { service, sms } = makeService();
    const subject = 'reg:918341665060';

    assert.equal(await service.isVerified(subject, '918341665060'), false);

    await service.requestOtp(subject, '918341665060');
    await service.verifyOtp(subject, '918341665060', sms.sent[0].otp);
    await service.markVerified(subject, '918341665060');

    assert.equal(await service.isVerified(subject, '918341665060'), true);
  });

  it('does not treat a different number as verified', async () => {
    const { service, sms } = makeService();
    const subject = 'reg:918341665060';

    await service.requestOtp(subject, '918341665060');
    await service.verifyOtp(subject, '918341665060', sms.sent[0].otp);
    await service.markVerified(subject, '918341665060');

    assert.equal(await service.isVerified(subject, '919999999999'), false);
    assert.equal(await service.isVerified('reg:919999999999', '918341665060'), false);
  });

  it('keeps the verification of one number separate from another', async () => {
    const { service, sms } = makeService();

    await service.requestOtp('reg:918341665060', '918341665060');
    await service.verifyOtp('reg:918341665060', '918341665060', sms.sent[0].otp);
    await service.markVerified('reg:918341665060', '918341665060');

    assert.equal(await service.isVerified('reg:918341665060', '918341665060'), true);
    assert.equal(await service.isVerified('reg:919999999999', '919999999999'), false);
  });
});

describe('Email OTP flow', () => {
  const originalCreateTransport = nodemailer.createTransport;
  let sent: Array<{ from?: string; to?: string; subject?: string; text?: string }> = [];

  before(() => {
    process.env.JWT_SECRET = TEST_SECRET;
    process.env.REDIS_URL = '';
    process.env.SMTP_USER = 'emailapikey';
    process.env.SMTP_PASS = 'test-smtp-password';
    process.env.SMTP_FROM = 'no-reply@jeeneet.ai';
  });

  beforeEach(() => {
    process.env.REDIS_URL = '';
    sent = [];
    nodemailer.createTransport = (() => ({
      sendMail: async (options: { from?: string; to?: string; subject?: string; text?: string }) => {
        sent.push(options);
        return { messageId: 'test-message' };
      },
    })) as unknown as typeof nodemailer.createTransport;
  });

  afterEach(() => {
    nodemailer.createTransport = originalCreateTransport;
  });

  it('emails the code and marks the address as verified', async () => {
    const service = new OtpService(new CacheService());
    const subject = 'email:student@example.com';

    assert.equal(await service.isVerified(subject, 'student@example.com'), false);

    const result = await service.requestEmailOtp(subject, 'student@example.com');

    assert.equal(result.expiresIn, OTP_CONSTANTS.TTL_SECONDS);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].from, 'no-reply@jeeneet.ai');
    assert.equal(sent[0].to, 'student@example.com');
    assert.match(sent[0].text ?? '', /\d{4}/);

    const code = (sent[0].text ?? '').match(/\d{4}/)?.[0] ?? '';
    await service.verifyOtp(subject, 'student@example.com', code, 'email address');
    await service.markVerified(subject, 'student@example.com');

    assert.equal(await service.isVerified(subject, 'student@example.com'), true);
  });

  it('rejects a code sent to a different email address', async () => {
    const service = new OtpService(new CacheService());
    const subject = 'email:student@example.com';

    await service.requestEmailOtp(subject, 'student@example.com');

    await assert.rejects(
      () => service.verifyOtp(subject, 'other@example.com', '1234', 'email address'),
      (err: AppError) => err.statusCode === 400 && /different email address/i.test(err.message),
    );
  });

  it('keeps email and mobile verification for the same account separate', async () => {
    const service = new OtpService(new CacheService());

    await service.requestEmailOtp('email:student@example.com', 'student@example.com');
    await service.verifyOtp('email:student@example.com', 'student@example.com', '0000', 'email address').catch(() => undefined);
    await service.markVerified('email:student@example.com', 'student@example.com');

    assert.equal(await service.isVerified('email:student@example.com', 'student@example.com'), true);
    assert.equal(await service.isVerified('reg:918341665060', 'student@example.com'), false);
    assert.equal(await service.isVerified('email:student@example.com', 'other@example.com'), false);
  });
});
