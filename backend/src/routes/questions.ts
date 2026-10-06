import { Router } from 'express';
import { nextQuestion, batchQuestions, getTopics } from '../controllers/questionController';
import { requireAuth } from '../middleware/auth';
import { questionLimiter } from '../middleware/rateLimiter';

export const questionRoutes = Router();

questionRoutes.use(requireAuth);

questionRoutes.get('/next', questionLimiter, nextQuestion);
questionRoutes.post('/batch', questionLimiter, batchQuestions);
questionRoutes.get('/topics', getTopics);
