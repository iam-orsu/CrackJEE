import { Router } from 'express';
import { register, login, me, refresh } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

export const authRoutes = Router();

authRoutes.post('/register', authLimiter, register);
authRoutes.post('/login', authLimiter, login);
authRoutes.get('/me', requireAuth, me);
authRoutes.post('/refresh', requireAuth, refresh);
