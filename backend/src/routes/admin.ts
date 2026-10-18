import { Router } from 'express';
import { adminLogin, adminStats } from '../controllers/adminController';
import { requireAdmin } from '../middleware/adminAuth';
import { authLimiter } from '../middleware/rateLimiter';

export const adminRoutes = Router();

adminRoutes.post('/login', authLimiter, adminLogin);
adminRoutes.get('/stats', requireAdmin, adminStats);
