import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { mockStartLimiter } from '../middleware/rateLimiter';
import {
  startMock,
  getMock,
  beginMock,
  saveAnswer,
  submitMock,
  getMockResult,
  getMockHistory,
  cancelMock,
  getExamInsights,
} from '../controllers/mockController';

export const mockRoutes = Router();

mockRoutes.use(requireAuth);

// /history must be before /:id to avoid being caught as an id param
mockRoutes.get('/history', getMockHistory);
mockRoutes.post('/start', mockStartLimiter, startMock);
mockRoutes.get('/:id', getMock);
mockRoutes.post('/:id/begin', beginMock);
mockRoutes.patch('/:id/answer', saveAnswer);
mockRoutes.post('/:id/submit', submitMock);
mockRoutes.get('/:id/result', getMockResult);
mockRoutes.get('/:id/insights', getExamInsights);
mockRoutes.delete('/:id', cancelMock);
