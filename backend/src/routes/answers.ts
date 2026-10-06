import { Router } from 'express';
import { submitAnswer } from '../controllers/answerController';
import { requireAuth } from '../middleware/auth';

export const answerRoutes = Router();

answerRoutes.use(requireAuth);

answerRoutes.post('/submit', submitAnswer);
