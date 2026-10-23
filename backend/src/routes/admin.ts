import { Router } from 'express';
import { adminLogin, adminLogout, adminStats } from '../controllers/adminController';
import { adminMock, adminStudent } from '../controllers/adminDetailController';
import { requireAdmin } from '../middleware/adminAuth';
import { authLimiter } from '../middleware/rateLimiter';

export const adminRoutes = Router();

adminRoutes.post('/login', authLimiter, adminLogin);
adminRoutes.post('/logout', adminLogout);
adminRoutes.get('/stats', requireAdmin, adminStats);
adminRoutes.get('/students/:id', requireAdmin, adminStudent);
adminRoutes.get('/mocks/:examId', requireAdmin, adminMock);
