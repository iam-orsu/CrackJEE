import { Router } from 'express';
import { submitAnswer } from '../controllers/answerController';
import { requireAuth } from '../middleware/auth';
import { answerLimiter } from '../middleware/rateLimiter';

export const answerRoutes = Router();

answerRoutes.use(requireAuth);

answerRoutes.post('/submit', answerLimiter, submitAnswer);
