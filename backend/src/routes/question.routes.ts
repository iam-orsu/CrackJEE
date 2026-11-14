import { Router } from 'express';
import { QuestionController } from '../controllers/QuestionController';
import { PaperController } from '../controllers/PaperController';
import { requireAuth } from '../middlewares/auth.middleware';
import { questionLimiter } from '../middlewares/rateLimiter.middleware';

export function createQuestionRoutes(
  questionController = new QuestionController(),
  paperController = new PaperController(),
): Router {
  const router = Router();

  router.use(requireAuth);
  router.get('/next', questionLimiter, questionController.nextQuestion);
  router.get('/weak-practice', questionLimiter, questionController.weakPractice);
  router.post('/batch', questionLimiter, questionController.batchQuestions);
  router.get('/topics', questionController.getTopics);
  router.get('/bank-stats', questionController.bankStats);
  router.post('/papers', questionLimiter, paperController.previewPapers);
  router.post('/papers/claim', questionLimiter, paperController.claimPapers);
  router.post('/:id/explain', questionLimiter, questionController.getTieredExplanation);

  return router;
}
