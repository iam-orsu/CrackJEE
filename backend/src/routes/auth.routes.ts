import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { GoogleAuthController } from '../controllers/GoogleAuthController';
import { requireAuth, requireRefreshableAuth } from '../middlewares/auth.middleware';
import { authLimiter } from '../middlewares/rateLimiter.middleware';

export function createAuthRoutes(
  controller = new AuthController(),
  googleController = new GoogleAuthController(),
): Router {
  const router = Router();

  router.post('/register', authLimiter, controller.register);
  router.post('/login', authLimiter, controller.login);
  router.get('/me', requireAuth, controller.me);
  router.get('/session', requireAuth, controller.session);
  router.patch('/profile', requireAuth, controller.updateProfile);
  router.post('/onboarding', requireAuth, controller.completeOnboarding);
  router.post('/refresh', requireRefreshableAuth, controller.refresh);
  router.post('/logout', requireAuth, controller.logout);

  router.get('/google/start', googleController.startStudent);

  return router;
}
