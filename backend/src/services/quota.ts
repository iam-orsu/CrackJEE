import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

export async function resolvePlan(
  userId: string,
): Promise<{ plan: string; expiresAt: Date | null; examsUsed: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, planExpiresAt: true, examsUsed: true },
  });
  if (!user) return { plan: 'free', expiresAt: null, examsUsed: 0 };

  if (user.plan !== 'free' && user.planExpiresAt !== null && user.planExpiresAt.getTime() <= Date.now()) {
    await prisma.user.update({
      where: { id: userId },
      data: { plan: 'free', planExpiresAt: null },
    });
    return { plan: 'free', expiresAt: null, examsUsed: user.examsUsed };
  }

  return { plan: user.plan, expiresAt: user.planExpiresAt, examsUsed: user.examsUsed };
}

export async function consumeExamCredit(userId: string): Promise<void> {
  const { plan: planId } = await resolvePlan(userId);
  const plan = await prisma.plan.findUnique({ where: { id: planId }, select: { examLimit: true } });
  const limit = plan?.examLimit ?? null;
  if (limit === null) return;

  const res = await prisma.user.updateMany({
    where: { id: userId, examsUsed: { lt: limit } },
    data: { examsUsed: { increment: 1 } },
  });
  if (res.count === 0) throw new AppError(402, 'You have used all your free exams. Upgrade your plan to continue.');
}

export async function refundExamCredit(userId: string): Promise<void> {
  await prisma.user.updateMany({
    where: { id: userId, examsUsed: { gt: 0 } },
    data: { examsUsed: { decrement: 1 } },
  });
}
