import { Router } from 'express';
import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { requireAuth } from '../middlewares/auth.middleware';
import { PaymentService } from '../services/PaymentService';
import { resolvePlan } from '../services/quota';
import { AppError } from '../utils/AppError';
import type { AuthRequest } from '../types/index';

const orderSchema = z.object({ planId: z.string().min(1).max(60) });

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

const failedSchema = z.object({ razorpay_order_id: z.string().min(1) });

export function createSubscriptionRoutes(): Router {
  const router = Router();
  const payments = new PaymentService();

  router.get('/plans', async (_req, res: Response, next: NextFunction): Promise<void> => {
    try {
      const plans = await prisma.plan.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          name: true,
          tagline: true,
          pricePaise: true,
          originalPricePaise: true,
          durationDays: true,
          features: true,
          badge: true,
          featured: true,
        },
      });
      res.json({ success: true, data: plans });
    } catch (err) {
      next(err);
    }
  });

  router.get('/me', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { plan, expiresAt, examsUsed: used } = await resolvePlan(req.user!.userId);
      const isActive = plan !== 'free' && (expiresAt === null || expiresAt.getTime() > Date.now());
      const planRow = await prisma.plan.findUnique({ where: { id: plan }, select: { examLimit: true } });
      const limit = planRow?.examLimit ?? null;
      res.json({
        success: true,
        data: { plan, isActive, expiresAt, used, limit, remaining: limit === null ? null : Math.max(0, limit - used) },
      });
    } catch (err) {
      next(err);
    }
  });

  router.post('/create-order', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = orderSchema.safeParse(req.body);
      if (!body.success) throw new AppError(400, 'Invalid plan');
      const data = await payments.createOrder(req.user!.userId, body.data.planId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  });

  router.post('/verify-payment', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = verifySchema.safeParse(req.body);
      if (!body.success) throw new AppError(400, 'Missing payment details');
      const data = await payments.verifyPayment(
        req.user!.userId,
        body.data.razorpay_order_id,
        body.data.razorpay_payment_id,
        body.data.razorpay_signature,
      );
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  });

  router.post('/payment-failed', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = failedSchema.safeParse(req.body);
      if (!body.success) throw new AppError(400, 'Missing order ID');
      await payments.markFailed(req.user!.userId, body.data.razorpay_order_id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  });

  router.get('/payments', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await payments.listForUser(req.user!.userId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  });

  return router;
}