import { Router } from 'express';
import { register, login, me } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

export const authRoutes = Router();

authRoutes.post('/register', authLimiter, register);
authRoutes.post('/login', authLimiter, login);
authRoutes.get('/me', requireAuth, me);
