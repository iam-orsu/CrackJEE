import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { GoogleAuthController } from '../controllers/GoogleAuthController';
import { OtpController } from '../controllers/OtpController';
import { requireAuth, requireRefreshableAuth } from '../middlewares/auth.middleware';
import { authLimiter, otpSendLimiter, otpVerifyLimiter, otpPublicSendLimiter, otpPublicVerifyLimiter } from '../middlewares/rateLimiter.middleware';

export function createAuthRoutes(
  controller = new AuthController(),
  googleController = new GoogleAuthController(),
  otpController = new OtpController(),
): Router {
  const router = Router();

  router.post('/register', authLimiter, controller.register);
  router.post('/register/otp/send', otpPublicSendLimiter, otpController.sendForRegistration);
  router.post('/register/otp/verify', otpPublicVerifyLimiter, otpController.verifyForRegistration);
  router.post('/login', authLimiter, controller.login);
  router.get('/me', requireAuth, controller.me);
  router.get('/session', requireAuth, controller.session);
  router.patch('/profile', requireAuth, controller.updateProfile);
  router.post('/onboarding', requireAuth, controller.completeOnboarding);
  router.post('/otp/send', requireAuth, otpSendLimiter, otpController.send);
  router.post('/otp/verify', requireAuth, otpVerifyLimiter, otpController.verify);
  router.post('/refresh', requireRefreshableAuth, controller.refresh);
  router.post('/logout', requireAuth, controller.logout);

  router.get('/google/start', googleController.startStudent);

  return router;
}
