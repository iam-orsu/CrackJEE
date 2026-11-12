import { Router } from 'express';
import { MockController } from '../controllers/MockController';
import { requireAuth } from '../middlewares/auth.middleware';
import { mockStartLimiter } from '../middlewares/rateLimiter.middleware';

export function createMockRoutes(controller = new MockController()): Router {
  const router = Router();

  router.use(requireAuth);
  // Registered before /:id so Express never captures 'history' as a mock id.
  router.get('/history', controller.getMockHistory);
  router.post('/start', mockStartLimiter, controller.startMock);
  router.get('/:id', controller.getMock);
  router.post('/:id/begin', controller.beginMock);
  router.patch('/:id/answer', controller.saveAnswer);
  router.post('/:id/submit', controller.submitMock);
  router.get('/:id/result', controller.getMockResult);
  router.get('/:id/insights', controller.getExamInsights);
  router.post('/:id/questions/:mockQuestionId/explanation', controller.getQuestionExplanation);
  router.delete('/:id', controller.cancelMock);

  return router;
}
