'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';
import type { Plan, SubscriptionStatus, User } from '@/types';
import { PlanCards } from '@/components/subscription/PlanCards';
import Footer from '@/components/footer';

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: () => void) => void;
    };
  }
}

type PaymentRow = {
  id: string;
  planId: string;
  amountPaise: number;
  currency: string;
  status: string;
  createdAt: string;
};

function loadRazorpay(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Could not load Razorpay checkout'));
    document.body.appendChild(s);
  });
}

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [paying, setPaying] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [me, setMe] = useState<SubscriptionStatus | null>(null);
  const [payments, setPayments] = useState<PaymentRow[]>([]);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    api.subscription
      .plans()
      .then(setPlans)
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load plans'));
    if (u) {
      api.subscription.me().then(setMe).catch(() => {});
      api.subscription.payments().then(setPayments).catch(() => {});
    }
  }, []);

  const currentName = me ? plans.find((p) => p.id === me.plan)?.name ?? me.plan : '';

  async function handleSelect(id: string) {
    setNotice('');
    setError('');
    if (id === 'free') return;
    if (!user) {
      router.push('/login');
      return;
    }
    const plan = plans.find((p) => p.id === id);
    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!plan || !key) {
      setError('Payment configuration missing.');
      return;
    }

    setPaying(true);
    try {
      const order = await api.subscription.createOrder(id);
      await loadRazorpay();
      const rzp = new window.Razorpay!({
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'JEENEET.ai',
        description: plan.name,
        order_id: order.orderId,
        theme: { color: '#803688' },
        handler: async (response: RazorpayResponse) => {
          try {
            await api.subscription.verifyPayment(response);
            setMe(await api.subscription.me());
            setPayments(await api.subscription.payments());
            setNotice('Payment successful — your plan is active.');
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Payment verification failed');
          } finally {
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      });
      rzp.on('payment.failed', () => {
        api.subscription.paymentFailed(order.orderId).catch(() => {});
        setPaying(false);
      });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start payment');
      setPaying(false);
    }
  }

  return (
    <>
      <div className="pg-root">
        <style>{css}</style>
        <div className="pg-blob pg-b1" aria-hidden />
        <div className="pg-blob pg-b2" aria-hidden />
        <div className="pg-page">
          {user ? (
            <div className="pg-nav">
              <button type="button" className="pg-back" onClick={() => router.back()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polyline points="15 6 9 12 15 18" />
                </svg>
                Back
              </button>
            </div>
          ) : (
            <nav className="pg-nav">
              <Link href="/">
                <Image src="/logo.png" alt="JEENEET.ai" width={150} height={62} style={{ width: 'auto', height: 64 }} priority />
              </Link>
              <Link href="/login" className="pg-nav-btn">Sign in</Link>
            </nav>
          )}

          <header className="pg-hero">
            <h1>Pick the plan that <span>fits your prep</span></h1>
            <p className="pg-sub">
              Every plan unlocks unlimited mock tests and practice. The free plan includes 5 exams — upgrade any time.
            </p>
            {user && me && (
              <p className="pg-current">
                You are currently on the <strong>{currentName}</strong> plan
                {me.limit !== null && ` · ${me.remaining} of ${me.limit} free exams left`}
              </p>
            )}
          </header>

          {error && <p className="pg-err">{error}</p>}
          {notice && <p className="pg-ok">{notice}</p>}
          {paying && <p className="pg-load">Waiting for payment...</p>}
          {plans.length > 0 && (
            <PlanCards
              plans={plans}
              currentPlan={me?.plan}
              onSelect={handleSelect}
            />
          )}
          {!error && plans.length === 0 && <p className="pg-load">Loading plans...</p>}

          {user && payments.length > 0 && (
            <section className="pg-history">
              <h2>Billing history</h2>
              <div className="pg-hrows">
                {payments.map((p) => (
                  <div key={p.id} className="pg-hrow">
                    <span className="pg-hdate">
                      {new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="pg-hplan">{plans.find((x) => x.id === p.planId)?.name ?? p.planId}</span>
                    <span className="pg-hamt">₹{(p.amountPaise / 100).toLocaleString('en-IN')}</span>
                    <span className="pg-hst pg-hst-captured">Paid</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      {!user && <Footer />}
    </>
  );
}

const css = `
.pg-root{--brand:#003366;--accent:#803688;--accent-d:#5A2560;--grad:linear-gradient(135deg,#803688 0%,#A24BA8 100%);--ice:#EEF2FF;--blob:#EDE3EF;position:relative;min-height:100vh;overflow:clip;background:#fff;font-family:'DM Sans',system-ui,sans-serif;color:var(--brand)}
.pg-root *{box-sizing:border-box}
.pg-blob{position:absolute;z-index:0;pointer-events:none}
.pg-b1{width:min(70vw,980px);aspect-ratio:1.1;right:-22vw;bottom:-18vw;background:var(--blob);border-radius:58% 42% 47% 53% / 52% 61% 39% 48%}
.pg-b2{width:min(40vw,560px);aspect-ratio:1;left:-14vw;top:-12vw;background:#EEF1FB;border-radius:46% 54% 60% 40% / 52% 44% 56% 48%}
.pg-page{position:relative;z-index:2;max-width:1180px;margin:0 auto;padding:0 clamp(16px,4vw,48px) clamp(56px,8vw,110px)}
.pg-nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0}
.pg-nav-btn{display:inline-flex;align-items:center;min-height:46px;padding:0 22px;border-radius:14px;font-weight:800;font-size:15px;color:#fff;text-decoration:none;background:var(--grad);box-shadow:0 5px 0 var(--accent-d)}
.pg-back{display:inline-flex;align-items:center;gap:8px;min-height:46px;padding:0 20px;border:2.5px solid var(--brand);border-radius:14px;background:#fff;color:var(--brand);font:inherit;font-weight:800;font-size:15px;cursor:pointer;box-shadow:0 4px 0 var(--ice);transition:transform .15s,box-shadow .15s}
.pg-back:hover{transform:translateY(-2px);box-shadow:0 6px 0 var(--ice)}
.pg-back:active{transform:translateY(2px);box-shadow:0 2px 0 var(--ice)}
.pg-hero{display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px;padding:clamp(18px,4vh,40px) 0 clamp(28px,4vh,44px)}
.pg-hero h1{margin:0;font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:clamp(32px,5vw,58px);line-height:1.05;letter-spacing:-.03em;color:var(--brand)}
.pg-hero h1 span{color:#fff;background:var(--grad);padding:.02em .18em .08em;border-radius:.22em;box-shadow:0 .07em 0 var(--accent-d);white-space:nowrap}
.pg-sub{margin:0;max-width:560px;font-size:clamp(15px,1.4vw,17px);line-height:1.6;color:#3C4A8A}
.pg-current{margin:0;padding:9px 18px;border-radius:99px;background:var(--ice);border:1.5px solid #B9C4EE;font-size:14px;font-weight:700;color:var(--brand)}
.pg-err{margin:0 0 20px;text-align:center;color:#C0283A;font-weight:700}
.pg-ok{margin:0 0 20px;text-align:center;color:#1B7F4B;font-weight:700}
.pg-load{margin:40px 0;text-align:center;font-weight:700;color:#5A6B8C}
.pg-history{margin-top:clamp(36px,6vh,64px);background:#fff;border:2.5px solid var(--brand);border-radius:24px;padding:24px;box-shadow:6px 8px 0 var(--ice)}
.pg-history h2{margin:0 0 16px;font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:22px;font-weight:800;color:var(--brand)}
.pg-hrows{display:flex;flex-direction:column}
.pg-hrow{display:flex;flex-wrap:wrap;align-items:center;gap:6px 14px;padding:12px 0;border-top:1.5px solid var(--ice);font-size:14px;font-weight:600;color:#3C4A8A}
.pg-hrow:first-child{border-top:0}
.pg-hdate{color:#5A6B8C;min-width:92px}
.pg-hplan{flex:1 1 140px}
.pg-hamt{font-weight:800;color:var(--brand)}
.pg-hst{padding:4px 12px;border-radius:99px;font-size:12px;font-weight:800;text-align:center}
.pg-hst-captured{background:#E4F6EB;color:#1B7F4B}
@media(max-width:560px){.pg-nav-btn{display:none}}
`;