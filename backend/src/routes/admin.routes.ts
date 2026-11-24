import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { requireAdmin } from '../middlewares/adminAuth.middleware';
import { authLimiter } from '../middlewares/rateLimiter.middleware';

export function createAdminRoutes(controller = new AdminController()): Router {
  const router = Router();

  router.post('/login', authLimiter, controller.login);
  router.post('/logout', controller.logout);
  router.get('/stats', requireAdmin, controller.stats);
  router.get('/students/:id', requireAdmin, controller.studentDetail);
  router.get('/mocks/:examId', requireAdmin, controller.mockDetail);
  router.get('/faculty', requireAdmin, controller.listFaculty);
  router.post('/faculty', requireAdmin, controller.createFaculty);
  router.patch('/faculty/:id', requireAdmin, controller.updateFaculty);
  router.get('/plans', requireAdmin, controller.listPlans);
  router.post('/plans', requireAdmin, controller.createPlan);
  router.patch('/plans/:id', requireAdmin, controller.updatePlan);
  router.delete('/plans/:id', requireAdmin, controller.deletePlan);
  router.get('/payments', requireAdmin, controller.listPayments);

  return router;
}
