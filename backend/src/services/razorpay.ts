import crypto from 'crypto';

const authHeader = (): string => {
  const creds = `${process.env.RAZORPAY_KEY_ID ?? ''}:${process.env.RAZORPAY_KEY_SECRET ?? ''}`;
  return `Basic ${Buffer.from(creds).toString('base64')}`;
};

export async function createRazorpayOrder(amountPaise: number, receipt: string) {
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader() },
    body: JSON.stringify({ amount: amountPaise, currency: 'INR', receipt }),
  });
  if (!res.ok) throw new Error('Could not create Razorpay order');
  return res.json() as Promise<{ id: string; amount: number; currency: string }>;
}

export async function fetchRazorpayPayment(paymentId: string) {
  const res = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: authHeader() },
  });
  if (!res.ok) return null;
  return res.json() as Promise<{ method?: string }>;
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET ?? '')
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
}

export function verifyWebhookSignature(rawBody: Buffer, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET ?? '';
  if (!secret || !signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}