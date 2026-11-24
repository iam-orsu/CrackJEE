import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { GoogleAuthController } from '../controllers/GoogleAuthController';
import { OtpController } from '../controllers/OtpController';
import { requireAuth, requireRefreshableAuth } from '../middlewares/auth.middleware';
import { authLimiter, otpSendLimiter, otpVerifyLimiter, otpPublicSendLimiter, otpPublicVerifyLimiter, emailOtpSendLimiter, emailOtpVerifyLimiter, registrationStatusLimiter } from '../middlewares/rateLimiter.middleware';

export function createAuthRoutes(
  controller = new AuthController(),
  googleController = new GoogleAuthController(),
  otpController = new OtpController(),
): Router {
  const router = Router();

  router.post('/register', authLimiter, controller.register);
  router.post('/register/otp/send', otpPublicSendLimiter, otpController.sendForRegistration);
  router.post('/register/otp/verify', otpPublicVerifyLimiter, otpController.verifyForRegistration);
  router.post('/register/email-otp/send', emailOtpSendLimiter, otpController.sendEmailForRegistration);
  router.post('/register/email-otp/verify', emailOtpVerifyLimiter, otpController.verifyEmailForRegistration);
  router.post('/register/status', registrationStatusLimiter, otpController.registrationStatus);
  router.post('/login', authLimiter, controller.login);
  router.post('/login/otp/verify', emailOtpVerifyLimiter, controller.loginVerify);
  router.get('/me', requireAuth, controller.me);
  router.get('/session', requireAuth, controller.session);
  router.patch('/profile', requireAuth, controller.updateProfile);
  router.post('/onboarding', requireAuth, controller.completeOnboarding);
  router.post('/otp/send', requireAuth, otpSendLimiter, otpController.send);
  router.post('/otp/verify', requireAuth, otpVerifyLimiter, otpController.verify);
  router.post('/email-otp/send', requireAuth, emailOtpSendLimiter, otpController.sendEmail);
  router.post('/email-otp/verify', requireAuth, emailOtpVerifyLimiter, otpController.verifyEmail);
  router.post('/refresh', requireRefreshableAuth, controller.refresh);
  router.post('/logout', requireAuth, controller.logout);

  router.get('/google/start', googleController.startStudent);

  return router;
}
