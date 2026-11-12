import { Router } from 'express';
import { ProgressController } from '../controllers/ProgressController';
import { requireAuth } from '../middlewares/auth.middleware';

export function createProgressRoutes(controller = new ProgressController()): Router {
  const router = Router();

  router.get('/user/dashboard', requireAuth, controller.dashboard);
  router.get('/progress/weak-areas', requireAuth, controller.weakAreas);
  router.get('/stats/overview', requireAuth, controller.overview);
  router.get('/stats/mock-weak-areas', requireAuth, controller.mockWeakAreas);
  router.get('/stats/mock-insights', requireAuth, controller.mockInsights);
  router.get('/stats/leaderboard', requireAuth, controller.leaderboard);

  return router;
}
