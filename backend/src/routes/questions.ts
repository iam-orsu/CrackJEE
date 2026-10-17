import { Router } from 'express';
import { nextQuestion, batchQuestions, getTopics, bankStats } from '../controllers/questionController';
import { requireAuth } from '../middleware/auth';
import { questionLimiter } from '../middleware/rateLimiter';
import { previewPapers, claimPapers } from '../controllers/paperController';

export const questionRoutes = Router();

questionRoutes.use(requireAuth);

questionRoutes.get('/next', questionLimiter, nextQuestion);
questionRoutes.post('/batch', questionLimiter, batchQuestions);
questionRoutes.get('/topics', getTopics);
questionRoutes.get('/bank-stats', bankStats);
questionRoutes.post('/papers', questionLimiter, previewPapers);
questionRoutes.post('/papers/claim', questionLimiter, claimPapers);
