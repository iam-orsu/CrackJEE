import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/PaymentService';
import { verifyWebhookSignature } from '../services/razorpay';
import { AppError } from '../utils/AppError';

/** Public provider webhooks (no session cookie) — authenticated by HMAC over the raw body. */
export function createWebhookRoutes(): Router {
  const router = Router();
  const payments = new PaymentService();

  router.post('/razorpay', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signature = req.headers['x-razorpay-signature'];
      const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;
      if (typeof signature !== 'string' || !rawBody || !verifyWebhookSignature(rawBody, signature)) {
        throw new AppError(400, 'Invalid webhook signature');
      }

      const body = req.body as {
        event?: string;
        payload?: { payment?: { entity?: { id?: string; order_id?: string; method?: string } } };
      };
      const entity = body.payload?.payment?.entity;
      if (body.event === 'payment.captured' && entity?.id && entity.order_id) {
        await payments.activateFromWebhook(entity.order_id, entity.id, entity.method ?? null);
      }
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
