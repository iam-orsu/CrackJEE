import { Router } from 'express';
import { dashboard, weakAreas, overview, mockWeakAreas, leaderboard } from '../controllers/progressController';
import { requireAuth } from '../middleware/auth';

export const progressRoutes = Router();

progressRoutes.use(requireAuth);

progressRoutes.get('/user/dashboard', dashboard);
progressRoutes.get('/progress/weak-areas', weakAreas);
progressRoutes.get('/stats/overview', overview);
progressRoutes.get('/stats/mock-weak-areas', mockWeakAreas);
progressRoutes.get('/stats/leaderboard', leaderboard);
