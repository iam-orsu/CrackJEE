'use client';

import type { Plan } from '@/types';

export function PlanCards({
  plans,
  currentPlan,
  onSelect,
}: {
  plans: Plan[];
  currentPlan?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="pc-root">
      <style>{css}</style>
      <div className="pc-grid">
        {plans.map((p) => {
          const isCurrent = currentPlan !== undefined && p.id === currentPlan;
          const isFree = p.id === 'free';
          const per =
            isFree ? 'forever'
              : p.durationDays === null ? 'one-time'
                : p.durationDays === 30 ? '/mo'
                  : `/ ${p.durationDays / 30} mo`;
          return (
            <div key={p.id} className={`pc-card${p.featured ? ' pc-pop' : ''}`}>
              {p.badge && <span className="pc-badge">{p.badge}</span>}
              <h3 className="pc-name">{p.name}</h3>
              <p className="pc-price">
                <strong>{isFree ? 'Free' : `₹${(p.pricePaise / 100).toLocaleString('en-IN')}`}</strong>
                {!isFree && <span className="pc-per">{per}</span>}
              </p>
              {p.originalPricePaise ? (
                <p className="pc-was">₹{(p.originalPricePaise / 100).toLocaleString('en-IN')}</p>
              ) : (
                <p className="pc-was pc-was-empty">&nbsp;</p>
              )}
              {!isFree && <p className="pc-gst">+18% GST at checkout</p>}
              {p.tagline && <p className="pc-tag">{p.tagline}</p>}
              <ul className="pc-feats">
                {p.features.map((f) => (
                  <li key={f}><i aria-hidden>✓</i>{f}</li>
                ))}
              </ul>
              <button
                type="button"
                className={`pc-cta${isFree ? ' pc-cta-outline' : ''}`}
                disabled={isCurrent}
                onClick={() => onSelect(p.id)}
              >
                {isCurrent ? 'Current plan' : isFree ? 'Get started' : 'Upgrade'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@500;600;700;800&display=swap');
.pc-root{--brand:#003366;--brand-d:#00284F;--accent:#803688;--accent-d:#5A2560;--grad:linear-gradient(135deg,#803688 0%,#A24BA8 100%);--soft:#C6D2F8;font-family:'DM Sans',system-ui,sans-serif;color:var(--brand)}
.pc-root *{box-sizing:border-box}
.pc-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:22px;align-items:stretch}
.pc-card{position:relative;display:flex;flex-direction:column;background:#fff;border:2.5px solid var(--brand);border-radius:24px;padding:26px 22px;box-shadow:6px 8px 0 var(--soft)}
.pc-pop{border-color:var(--accent);box-shadow:6px 8px 0 var(--accent-d);transform:translateY(-8px)}
.pc-badge{align-self:flex-start;margin-bottom:12px;padding:5px 12px;border-radius:99px;background:var(--grad);color:#fff;font-size:12px;font-weight:800;letter-spacing:.03em}
.pc-name{margin:0;font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:20px;color:var(--brand)}
.pc-price{margin:10px 0 0;display:flex;align-items:baseline;gap:6px}
.pc-price strong{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:34px;line-height:1;color:var(--brand)}
.pc-per{font-size:13px;font-weight:700;color:#5A6B8C}
.pc-was{margin:6px 0 0;font-size:14px;font-weight:700;color:#97A3D4;text-decoration:line-through;min-height:20px}
.pc-was-empty{text-decoration:none}
.pc-gst{margin:5px 0 0;font-size:12px;font-weight:700;color:#97A3D4}
.pc-tag{margin:8px 0 0;font-size:13px;font-weight:700;color:#5A6B8C}
.pc-feats{list-style:none;margin:14px 0 0;padding:0;display:flex;flex:1 1 auto;flex-direction:column;gap:9px}
.pc-feats li{display:flex;align-items:flex-start;gap:9px;font-size:14px;font-weight:600;line-height:1.4;color:#3C4A8A}
.pc-feats i{flex-shrink:0;width:18px;height:18px;margin-top:1px;border-radius:50%;background:var(--accent);color:#fff;font-style:normal;font-size:11px;font-weight:800;display:inline-flex;align-items:center;justify-content:center}
.pc-cta{margin-top:22px;width:100%;min-height:50px;border:0;border-radius:15px;cursor:pointer;font:inherit;font-weight:800;font-size:15px;color:#fff;background:var(--grad);box-shadow:0 6px 0 var(--accent-d);transition:transform .15s,box-shadow .15s}
.pc-cta:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 0 var(--accent-d)}
.pc-cta:active:not(:disabled){transform:translateY(4px);box-shadow:0 2px 0 var(--accent-d)}
.pc-cta-outline{background:#fff;color:var(--brand);border:2.5px solid var(--brand);box-shadow:0 5px 0 var(--soft)}
.pc-cta-outline:hover:not(:disabled){box-shadow:0 7px 0 var(--soft)}
.pc-cta:disabled{opacity:.55;cursor:default;transform:none}
@media(max-width:980px){.pc-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:560px){.pc-grid{grid-template-columns:1fr}.pc-pop{transform:none}}
@media(prefers-reduced-motion:reduce){.pc-root *{transition:none!important}}
`;