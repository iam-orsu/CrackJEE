import { Router } from 'express';
import { AnswerController } from '../controllers/AnswerController';
import { requireAuth } from '../middlewares/auth.middleware';
import { answerLimiter } from '../middlewares/rateLimiter.middleware';

export function createAnswerRoutes(controller = new AnswerController()): Router {
  const router = Router();

  router.use(requireAuth);
  router.post('/submit', answerLimiter, controller.submitAnswer);

  return router;
}
