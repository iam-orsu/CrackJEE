import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import { createRazorpayOrder, fetchRazorpayPayment, verifyRazorpaySignature } from './razorpay';

export class PaymentService {
  public async createOrder(userId: string, planId: string): Promise<{ orderId: string; amount: number; currency: string }> {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan || !plan.isActive) throw new AppError(404, 'Plan not found');
    if (plan.pricePaise <= 0) throw new AppError(400, 'The free plan does not need payment');

    const amountPaise = Math.round(plan.pricePaise * 1.18);
    const order = await createRazorpayOrder(amountPaise, `rcpt_${Date.now()}`);

    await prisma.payment.create({
      data: { userId, planId, orderId: order.id, amountPaise },
    });

    return { orderId: order.id, amount: order.amount, currency: order.currency };
  }

  public async verifyPayment(
    userId: string,
    orderId: string,
    paymentId: string,
    signature: string,
  ): Promise<{ planActivated: boolean }> {
    const payment = await prisma.payment.findUnique({ where: { orderId } });
    if (!payment || payment.userId !== userId) throw new AppError(404, 'Payment not found');
    if (payment.status === 'CAPTURED') return { planActivated: true };
    if (!verifyRazorpaySignature(orderId, paymentId, signature)) throw new AppError(400, 'Invalid payment signature');

    const method = await fetchRazorpayPayment(paymentId).then((p) => p?.method ?? null).catch(() => null);
    return this.activate(orderId, paymentId, method, signature);
  }

  public activateFromWebhook(orderId: string, paymentId: string, method: string | null): Promise<{ planActivated: boolean }> {
    return this.activate(orderId, paymentId, method, null);
  }

  /**
   * Flips a CREATED payment to CAPTURED and activates the purchased plan. The conditional
   * `updateMany` claims the row exactly once, so concurrent verify/webhook/replays activate
   * the plan exactly one time.
   */
  private async activate(
    orderId: string,
    paymentId: string,
    method: string | null,
    signature: string | null,
  ): Promise<{ planActivated: boolean }> {
    const payment = await prisma.payment.findUnique({ where: { orderId } });
    if (!payment) return { planActivated: false };
    if (payment.status === 'CAPTURED') return { planActivated: true };

    const plan = await prisma.plan.findUnique({ where: { id: payment.planId } });
    if (!plan) return { planActivated: false };
    const expiresAt = plan.durationDays ? new Date(Date.now() + plan.durationDays * 86_400_000) : null;

    return prisma.$transaction(async (tx) => {
      const claimed = await tx.payment.updateMany({
        where: { orderId, status: { not: 'CAPTURED' } },
        data: { paymentId, signature, status: 'CAPTURED', paymentMethod: method },
      });
      if (claimed.count === 0) return { planActivated: true };
      await tx.user.update({
        where: { id: payment.userId },
        data: { plan: plan.id, planExpiresAt: expiresAt, examsUsed: 0 },
      });
      return { planActivated: true };
    });
  }

  public async markFailed(userId: string, orderId: string): Promise<void> {
    await prisma.payment.updateMany({
      where: { orderId, userId, status: 'CREATED' },
      data: { status: 'FAILED' },
    });
  }

  public listForUser(userId: string) {
    return prisma.payment.findMany({
      where: { userId, status: 'CAPTURED' },
      orderBy: { createdAt: 'desc' },
      select: { id: true, planId: true, amountPaise: true, currency: true, status: true, createdAt: true },
    });
  }
}