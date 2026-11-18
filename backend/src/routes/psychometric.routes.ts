import { Router } from 'express';
import { PsychometricController } from '../controllers/PsychometricController';
import { requireAuth } from '../middlewares/auth.middleware';

export function createPsychometricRoutes(): Router {
  const router = Router();
  const controller = new PsychometricController();

  router.use(requireAuth);

  router.get('/cards', controller.getCards);
  router.post('/session/card', controller.startCardSession);
  router.get('/session', controller.getSession);
  router.post('/answer', controller.saveAnswer);
  router.post('/submit', controller.submitSession);
  router.get('/history', controller.getHistory);
  router.get('/report', controller.getReport);

  return router;
}
