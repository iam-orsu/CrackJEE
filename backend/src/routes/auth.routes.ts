import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { requireAuth } from '../middlewares/auth.middleware';
import { authLimiter } from '../middlewares/rateLimiter.middleware';

export function createAuthRoutes(controller = new AuthController()): Router {
  const router = Router();

  router.post('/register', authLimiter, controller.register);
  router.post('/login', authLimiter, controller.login);
  router.get('/me', requireAuth, controller.me);
  router.post('/refresh', requireAuth, controller.refresh);
  router.post('/logout', requireAuth, controller.logout);

  return router;
}
