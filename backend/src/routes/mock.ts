import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  startMock,
  getMock,
  beginMock,
  saveAnswer,
  submitMock,
  getMockResult,
  getMockHistory,
} from '../controllers/mockController';

export const mockRoutes = Router();

mockRoutes.use(requireAuth);

// /history must be before /:id to avoid being caught as an id param
mockRoutes.get('/history', getMockHistory);
mockRoutes.post('/start', startMock);
mockRoutes.get('/:id', getMock);
mockRoutes.post('/:id/begin', beginMock);
mockRoutes.patch('/:id/answer', saveAnswer);
mockRoutes.post('/:id/submit', submitMock);
mockRoutes.get('/:id/result', getMockResult);
