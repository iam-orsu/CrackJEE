'use client';

import React from 'react';
import type { DiagramTemplate } from '@/types';

/* ── Arrow helper ──────────────────────────────────────────── */
function Arr({
  x1, y1, x2, y2, color = '#475569', label, lx, ly,
}: {
  x1: number; y1: number; x2: number; y2: number;
  color?: string; label?: string; lx?: number; ly?: number;
}) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 5) return null;
  const ux = dx / len, uy = dy / len;
  const S = 8;
  const bx = x2 - ux * S, by = y2 - uy * S;
  const px = -uy * S * 0.45, py = ux * S * 0.45;
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth="2" strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${bx + px},${by + py} ${bx - px},${by - py}`} fill={color} />
      {label && (
        <text x={lx ?? x2 + ux * 14} y={ly ?? y2 + uy * 14}
          fill={color} fontSize="12" fontWeight="600" textAnchor="middle" dominantBaseline="middle">
          {label}
        </text>
      )}
    </g>
  );
}

/* ── TEMPLATE 1: Inclined Plane ─────────────────────────────
   Computes force vector directions from angle — no raw coords needed.
────────────────────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InclinedPlane({ p }: { p: any }) {
  const angle = Math.max(10, Math.min(70, +(p.angle_deg ?? 30)));
  const θ = (angle * Math.PI) / 180;
  const lbl = p.labels ?? {};

  // Triangle vertices: peak top-left, bottom-left (right angle), bottom-right (angle θ)
  const bx1 = 30, bx2 = 370, by = 200;
  const peakH = Math.min((bx2 - bx1) * Math.tan(θ), 172);
  const px = bx1, py = by - peakH;

  // Slope direction vector (from peak down-right to bx2,by)
  const sdx = bx2 - px, sdy = by - py;
  const slen = Math.sqrt(sdx * sdx + sdy * sdy);
  const cosθ = sdx / slen, sinθ = sdy / slen;
  const rot = Math.atan2(sdy, sdx) * (180 / Math.PI);

  // Block center: 42% along slope from bx2 upward
  const t = 0.42;
  const bkx = bx2 - t * sdx, bky = by - t * sdy;

  const FL = 58; // force vector length px

  // Angle arc at bottom-right vertex — CCW sweep from base to slope
  const AR = 28;
  const arcBx = bx2 - AR, arcBy = by;
  const arcSx = bx2 - cosθ * AR, arcSy = by - sinθ * AR;

  return (
    <svg viewBox="0 0 400 220" style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* Ground hatching */}
      <line x1={bx1 - 8} y1={by} x2={bx2 + 8} y2={by} stroke="#d1d5db" strokeWidth="1" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line key={i} x1={40 + i * 50} y1={by} x2={32 + i * 50} y2={by + 8} stroke="#d1d5db" strokeWidth="1" />
      ))}
      {/* Inclined plane */}
      <polygon points={`${px},${py} ${bx1},${by} ${bx2},${by}`}
        fill="rgba(99,102,241,0.08)" stroke="#6366f1" strokeWidth="1.8" />
      {/* Angle arc (CCW = sweep-flag 0) */}
      <path d={`M ${arcBx},${arcBy} A ${AR},${AR} 0 0,0 ${arcSx},${arcSy}`}
        fill="none" stroke="#6366f1" strokeWidth="1.4" />
      <text x={bx2 - AR * 2.1} y={by - 7} fill="#4f46e5" fontSize="11" fontWeight="600">
        {lbl.angle ?? `${angle}°`}
      </text>
      {/* Block rotated onto slope */}
      <g transform={`translate(${bkx},${bky}) rotate(${rot})`}>
        <rect x="-18" y="-14" width="36" height="28" rx="3"
          fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
        <text x="0" y="6" textAnchor="middle" fill="#1e40af" fontSize="11" fontWeight="600">
          {lbl.block ?? 'm'}
        </text>
      </g>
      {/* Force vectors — directions derived from θ, not hardcoded */}
      {p.show_weight !== false && (
        <Arr x1={bkx} y1={bky} x2={bkx} y2={bky + FL} color="#dc2626"
          label={lbl.weight ?? 'mg'} lx={bkx + 18} ly={bky + FL - 4} />
      )}
      {p.show_normal !== false && (
        /* Normal: (sinθ, −cosθ) in screen coords */
        <Arr x1={bkx} y1={bky} x2={bkx + sinθ * FL} y2={bky - cosθ * FL} color="#16a34a"
          label={lbl.normal ?? 'N'} lx={bkx + sinθ * FL + 16} ly={bky - cosθ * FL} />
      )}
      {p.show_friction === true && (
        /* Friction: up slope = (−cosθ, −sinθ) */
        <Arr x1={bkx} y1={bky} x2={bkx - cosθ * FL} y2={bky - sinθ * FL} color="#d97706"
          label={lbl.friction ?? 'f'} lx={bkx - cosθ * FL - 14} ly={bky - sinθ * FL} />
      )}
      {p.show_applied === true && (
        <Arr x1={bkx} y1={bky} x2={bkx - cosθ * FL} y2={bky - sinθ * FL} color="#7c3aed"
          label={lbl.applied ?? 'F'} lx={bkx - cosθ * FL - 14} ly={bky - sinθ * FL} />
      )}
    </svg>
  );
}

/* ── TEMPLATE 2: Simple Circuit ─────────────────────────────── */
type CComp = { type?: string; label?: string };

function compSymbol(
  x: number, y: number, type: string, label: string | undefined, horiz: boolean,
): React.ReactNode {
  const T = (type ?? '').toLowerCase();

  if (T === 'battery') return horiz ? (
    <g key={`${x}${y}`}>
      <line x1={x - 10} y1={y - 13} x2={x - 10} y2={y + 13} stroke="#1e293b" strokeWidth="2.5" />
      <line x1={x + 10} y1={y - 7}  x2={x + 10} y2={y + 7}  stroke="#1e293b" strokeWidth="1.5" />
      <text x={x - 10} y={y - 18} fill="#374151" fontSize="10" textAnchor="middle">+</text>
      {label && <text x={x} y={y - 24} fill="#374151" fontSize="11" textAnchor="middle">{label}</text>}
    </g>
  ) : (
    <g key={`${x}${y}`}>
      <line x1={x - 13} y1={y - 10} x2={x + 13} y2={y - 10} stroke="#1e293b" strokeWidth="2.5" />
      <line x1={x - 7}  y1={y + 10} x2={x + 7}  y2={y + 10} stroke="#1e293b" strokeWidth="1.5" />
      <text x={x + 20} y={y - 10} fill="#374151" fontSize="10" dominantBaseline="middle">+</text>
      {label && <text x={x + 20} y={y + 4} fill="#374151" fontSize="10">{label}</text>}
    </g>
  );

  if (T === 'resistor') return horiz ? (
    <g key={`${x}${y}`}>
      <rect x={x - 20} y={y - 9} width="40" height="18" fill="white" stroke="#1e293b" strokeWidth="1.5" rx="2" />
      {label && <text x={x} y={y - 16} fill="#374151" fontSize="11" textAnchor="middle">{label}</text>}
    </g>
  ) : (
    <g key={`${x}${y}`}>
      <rect x={x - 9} y={y - 20} width="18" height="40" fill="white" stroke="#1e293b" strokeWidth="1.5" rx="2" />
      {label && <text x={x + 16} y={y} fill="#374151" fontSize="11" dominantBaseline="middle">{label}</text>}
    </g>
  );

  if (T === 'capacitor') return horiz ? (
    <g key={`${x}${y}`}>
      <line x1={x - 5} y1={y - 13} x2={x - 5} y2={y + 13} stroke="#1e293b" strokeWidth="2.5" />
      <line x1={x + 5} y1={y - 13} x2={x + 5} y2={y + 13} stroke="#1e293b" strokeWidth="2.5" />
      {label && <text x={x} y={y - 20} fill="#374151" fontSize="11" textAnchor="middle">{label}</text>}
    </g>
  ) : (
    <g key={`${x}${y}`}>
      <line x1={x - 13} y1={y - 5} x2={x + 13} y2={y - 5} stroke="#1e293b" strokeWidth="2.5" />
      <line x1={x - 13} y1={y + 5} x2={x + 13} y2={y + 5} stroke="#1e293b" strokeWidth="2.5" />
      {label && <text x={x + 20} y={y} fill="#374151" fontSize="11" dominantBaseline="middle">{label}</text>}
    </g>
  );

  if (T === 'bulb') {
    const r = 13;
    return (
      <g key={`${x}${y}`}>
        <circle cx={x} cy={y} r={r} fill="white" stroke="#1e293b" strokeWidth="1.5" />
        <line x1={x - 8} y1={y - 8} x2={x + 8} y2={y + 8} stroke="#1e293b" strokeWidth="1.5" />
        <line x1={x + 8} y1={y - 8} x2={x - 8} y2={y + 8} stroke="#1e293b" strokeWidth="1.5" />
        {label && <text x={x} y={y - r - 7} fill="#374151" fontSize="11" textAnchor="middle">{label}</text>}
      </g>
    );
  }

  if (T === 'inductor') return horiz ? (
    <g key={`${x}${y}`}>
      {[-14, -4.5, 5].map((dx, i) => (
        <path key={i} d={`M ${x + dx},${y} A 4.5,5 0 0,1 ${x + dx + 9},${y}`} fill="none" stroke="#1e293b" strokeWidth="1.5" />
      ))}
      {label && <text x={x} y={y - 16} fill="#374151" fontSize="11" textAnchor="middle">{label}</text>}
    </g>
  ) : (
    <g key={`${x}${y}`}>
      {[-14, -4.5, 5].map((dy, i) => (
        <path key={i} d={`M ${x},${y + dy} A 5,4.5 0 0,0 ${x},${y + dy + 9}`} fill="none" stroke="#1e293b" strokeWidth="1.5" />
      ))}
      {label && <text x={x + 20} y={y} fill="#374151" fontSize="11" dominantBaseline="middle">{label}</text>}
    </g>
  );

  if (T === 'switch') return (
    <g key={`${x}${y}`}>
      <circle cx={horiz ? x - 14 : x} cy={horiz ? y : y - 14} r="3" fill="#1e293b" />
      <circle cx={horiz ? x + 14 : x} cy={horiz ? y : y + 14} r="3" fill="#1e293b" />
      {horiz
        ? <line x1={x - 11} y1={y} x2={x + 12} y2={y - 10} stroke="#1e293b" strokeWidth="1.5" />
        : <line x1={x} y1={y - 11} x2={x + 10} y2={y + 12} stroke="#1e293b" strokeWidth="1.5" />}
      {label && <text x={horiz ? x : x + 20} y={horiz ? y - 20 : y} fill="#374151" fontSize="11" textAnchor={horiz ? 'middle' : 'start'} dominantBaseline="middle">{label}</text>}
    </g>
  );

  // Fallback: labeled rectangle
  return (
    <g key={`${x}${y}`}>
      <rect x={horiz ? x - 16 : x - 9} y={horiz ? y - 9 : y - 16}
        width={horiz ? 32 : 18} height={horiz ? 18 : 32}
        fill="white" stroke="#1e293b" strokeWidth="1.5" rx="2" />
      <text x={x} y={y + 4} textAnchor="middle" fill="#374151" fontSize="11" fontWeight="600">
        {T[0]?.toUpperCase() ?? '?'}
      </text>
      {label && <text x={horiz ? x : x + 16} y={horiz ? y - 16 : y}
        fill="#374151" fontSize="11" textAnchor={horiz ? 'middle' : 'start'} dominantBaseline="middle">{label}</text>}
    </g>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SimpleCircuit({ p }: { p: any }) {
  const comps: CComp[] = p.components ?? [];
  const topology = (p.topology ?? 'series').toLowerCase();
  const battery = comps.find((c) => (c.type ?? '').toLowerCase() === 'battery');
  const branches = comps.filter((c) => (c.type ?? '').toLowerCase() !== 'battery');

  if (topology === 'parallel') {
    const topY = 50, botY = 170, batX = 50;
    const n = Math.max(branches.length, 1);
    const branchXs = branches.map((_, i) => 120 + (i + 0.5) * (300 / n));
    const midY = (topY + botY) / 2;
    return (
      <svg viewBox="0 0 460 220" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <line x1={batX} y1={topY} x2={420} y2={topY} stroke="#1e293b" strokeWidth="1.8" />
        <line x1={batX} y1={botY} x2={420} y2={botY} stroke="#1e293b" strokeWidth="1.8" />
        <line x1={batX} y1={topY} x2={batX} y2={midY - 14} stroke="#1e293b" strokeWidth="1.8" />
        <line x1={batX} y1={midY + 14} x2={batX} y2={botY} stroke="#1e293b" strokeWidth="1.8" />
        {compSymbol(batX, midY, 'battery', battery?.label, false)}
        {branchXs.map((bx, i) => (
          <g key={i}>
            <circle cx={bx} cy={topY} r="3" fill="#1e293b" />
            <circle cx={bx} cy={botY} r="3" fill="#1e293b" />
            <line x1={bx} y1={topY} x2={bx} y2={midY - 23} stroke="#1e293b" strokeWidth="1.8" />
            <line x1={bx} y1={midY + 23} x2={bx} y2={botY} stroke="#1e293b" strokeWidth="1.8" />
            {compSymbol(bx, midY, branches[i]?.type ?? 'resistor', branches[i]?.label, false)}
          </g>
        ))}
      </svg>
    );
  }

  // Series: rectangular loop, battery on left side, components on top wire
  const y0 = 45, y1 = 165, x0 = 55, x1 = 440;
  const batCY = (y0 + y1) / 2;
  const n = Math.max(branches.length, 1);
  const compXs = branches.map((_, i) => 100 + (i + 0.5) * ((x1 - 100) / n));
  return (
    <svg viewBox="0 0 490 200" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <line x1={x0} y1={y0} x2={x1} y2={y0} stroke="#1e293b" strokeWidth="1.8" />
      <line x1={x1} y1={y0} x2={x1} y2={y1} stroke="#1e293b" strokeWidth="1.8" />
      <line x1={x0} y1={y1} x2={x1} y2={y1} stroke="#1e293b" strokeWidth="1.8" />
      <line x1={x0} y1={y0} x2={x0} y2={batCY - 15} stroke="#1e293b" strokeWidth="1.8" />
      <line x1={x0} y1={batCY + 15} x2={x0} y2={y1} stroke="#1e293b" strokeWidth="1.8" />
      {compSymbol(x0, batCY, 'battery', battery?.label, false)}
      {branches.map((comp, i) => compSymbol(compXs[i]!, y0, comp.type ?? 'resistor', comp.label, true))}
    </svg>
  );
}

/* ── TEMPLATE 3: Lens / Mirror ──────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LensMirror({ p }: { p: any }) {
  const type: string = p.type ?? 'convex_lens';
  const lbl = p.labels ?? {};
  const showRays: boolean = p.show_rays !== false;
  const axisY = 115, lensX = 250, lensH = 78;
  const fL = 182, fR = 318;  // focal points

  const isLens = type.includes('lens');
  const isConcave = type.includes('concave');
  const lensTop = axisY - lensH, lensBot = axisY + lensH;
  const bulge = isConcave ? -24 : 24;

  // Object: upright arrow on left
  const objX = 100, objTop = axisY - 58;
  // Image: approximated position / orientation per lens/mirror type
  const imgX = (type === 'convex_lens') ? 368
    : (type === 'concave_mirror') ? 160
    : 88;
  const imgVirtual = type === 'concave_lens' || type === 'convex_mirror';
  const imgTop = imgVirtual ? axisY - 36 : axisY + 36;

  return (
    <svg viewBox="0 0 500 230" style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* Principal axis */}
      <line x1="18" y1={axisY} x2="482" y2={axisY} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="6,4" />

      {isLens ? (
        /* Lens: two bezier arcs */
        <g>
          <path d={`M ${lensX},${lensTop} Q ${lensX + bulge},${axisY} ${lensX},${lensBot}`}
            fill="rgba(147,197,253,0.12)" stroke="#64748b" strokeWidth="2" />
          <path d={`M ${lensX},${lensTop} Q ${lensX - bulge},${axisY} ${lensX},${lensBot}`}
            fill="none" stroke="#64748b" strokeWidth="2" />
          {/* Arrowheads on lens */}
          <polygon points={`${lensX},${lensTop - 7} ${lensX - 5},${lensTop + 8} ${lensX + 5},${lensTop + 8}`} fill="#64748b" />
          <polygon points={`${lensX},${lensBot + 7} ${lensX - 5},${lensBot - 8} ${lensX + 5},${lensBot - 8}`} fill="#64748b" />
        </g>
      ) : (
        /* Mirror: arc + backing hatch */
        <g>
          <path d={`M ${lensX},${lensTop} Q ${lensX + (isConcave ? -32 : 32)},${axisY} ${lensX},${lensBot}`}
            fill="none" stroke="#64748b" strokeWidth="2.5" />
          {[-60, -44, -28, -12, 4, 20, 36, 52].map((dy, i) => {
            const my = axisY + dy;
            if (my < lensTop || my > lensBot) return null;
            const ratio = (my - lensTop) / (lensH * 2);
            const mx = lensX + (isConcave ? -32 : 32) * Math.sin(ratio * Math.PI);
            return <line key={i} x1={mx} y1={my} x2={mx + 8} y2={my + 8} stroke="#94a3b8" strokeWidth="1" />;
          })}
        </g>
      )}

      {/* Focal point markers */}
      {isLens && <>
        <circle cx={fL} cy={axisY} r="3" fill="#475569" />
        <circle cx={fR} cy={axisY} r="3" fill="#475569" />
        <text x={fL} y={axisY + 15} fill="#475569" fontSize="11" textAnchor="middle">F</text>
        <text x={fR} y={axisY + 15} fill="#475569" fontSize="11" textAnchor="middle">F</text>
      </>}
      {!isLens && <circle cx={lensX + (isConcave ? -40 : 40)} cy={axisY} r="3" fill="#475569" />}

      {/* f label */}
      {lbl.f && <text x={(lensX + fR) / 2} y={axisY - 12} fill="#475569" fontSize="11" textAnchor="middle">{lbl.f}</text>}

      {/* Object arrow */}
      <Arr x1={objX} y1={axisY} x2={objX} y2={objTop} color="#2563eb"
        label={lbl.object ?? 'O'} lx={objX - 16} ly={objTop - 4} />

      {/* Image arrow — dashed if virtual */}
      {imgVirtual ? (
        <g>
          <line x1={imgX} y1={axisY} x2={imgX} y2={imgTop}
            stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4,3" />
          <polygon points={`${imgX},${imgTop} ${imgX - 4},${imgTop + 10} ${imgX + 4},${imgTop + 10}`} fill="#dc2626" />
          <text x={imgX + 14} y={imgTop} fill="#dc2626" fontSize="11" fontWeight="600" dominantBaseline="middle">
            {lbl.image ?? 'I (virtual)'}
          </text>
        </g>
      ) : (
        <Arr x1={imgX} y1={axisY} x2={imgX} y2={imgTop} color="#dc2626"
          label={lbl.image ?? 'I'} lx={imgX + 14} ly={imgTop} />
      )}

      {/* 3 principal rays for convex lens */}
      {showRays && type === 'convex_lens' && (
        <g stroke="#fbbf24" strokeWidth="1" opacity="0.65">
          <line x1={objX} y1={objTop} x2={lensX} y2={objTop} />
          <line x1={lensX} y1={objTop} x2={imgX} y2={imgTop} />
          <line x1={objX} y1={objTop} x2={imgX} y2={imgTop} />
        </g>
      )}
    </svg>
  );
}

/* ── TEMPLATE 4: Energy Profile ─────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EnergyProfile({ p }: { p: any }) {
  const exo: boolean = p.exothermic !== false;
  const lbl = p.labels ?? {};

  // Screen y: lower value = higher energy
  const peakY = 52, reactY = exo ? 118 : 148, prodY = exo ? 148 : 118;
  const reactX = 88, peakX = 214, prodX = 358;

  const curve = `M ${reactX},${reactY} C ${reactX + 52},${reactY} ${peakX - 52},${peakY} ${peakX},${peakY} S ${prodX - 52},${prodY} ${prodX},${prodY}`;

  const eaX = 146;  // activation energy bracket x
  const dhX = 384;  // ΔH bracket x

  return (
    <svg viewBox="0 0 430 215" style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* Axes */}
      <Arr x1={48} y1={188} x2={48} y2={28} color="#94a3b8" />
      <Arr x1={48} y1={188} x2={420} y2={188} color="#94a3b8" />
      <text x={28} y={108} fill="#64748b" fontSize="11" textAnchor="middle"
        transform="rotate(-90,28,108)">Energy</text>
      <text x={230} y={204} fill="#64748b" fontSize="11" textAnchor="middle">Reaction coordinate</text>

      {/* Energy level dashed lines */}
      <line x1={60} y1={reactY} x2={reactX + 46} y2={reactY}
        stroke="#16a34a" strokeWidth="1.2" strokeDasharray="4,3" />
      <line x1={prodX - 46} y1={prodY} x2={412} y2={prodY}
        stroke="#dc2626" strokeWidth="1.2" strokeDasharray="4,3" />

      {/* Curve */}
      <path d={curve} fill="none" stroke="#6366f1" strokeWidth="2.2" />

      {/* Transition state label */}
      <text x={peakX} y={peakY - 10} fill="#6366f1" fontSize="11" textAnchor="middle" fontWeight="600">TS</text>

      {/* Compound labels */}
      <text x={reactX} y={reactY + 18} fill="#16a34a" fontSize="12" fontWeight="600" textAnchor="middle">
        {p.reactant_label ?? 'Reactants'}
      </text>
      <text x={prodX} y={prodY + 18} fill="#dc2626" fontSize="12" fontWeight="600" textAnchor="middle">
        {p.product_label ?? 'Products'}
      </text>

      {/* Ea bracket */}
      <line x1={eaX} y1={reactY} x2={eaX} y2={peakY} stroke="#374151" strokeWidth="1" strokeDasharray="2,2" />
      <line x1={eaX - 5} y1={reactY} x2={eaX + 5} y2={reactY} stroke="#374151" strokeWidth="1.2" />
      <line x1={eaX - 5} y1={peakY}  x2={eaX + 5} y2={peakY}  stroke="#374151" strokeWidth="1.2" />
      <text x={eaX - 16} y={(reactY + peakY) / 2} fill="#374151" fontSize="11"
        textAnchor="middle" dominantBaseline="middle">{lbl.ea ?? 'Ea'}</text>

      {/* ΔH bracket */}
      {reactY !== prodY && (
        <>
          <line x1={dhX} y1={reactY} x2={dhX} y2={prodY} stroke="#374151" strokeWidth="1" strokeDasharray="2,2" />
          <line x1={dhX - 5} y1={reactY} x2={dhX + 5} y2={reactY} stroke="#374151" strokeWidth="1.2" />
          <line x1={dhX - 5} y1={prodY}  x2={dhX + 5} y2={prodY}  stroke="#374151" strokeWidth="1.2" />
          <text x={dhX + 16} y={(reactY + prodY) / 2} fill="#374151" fontSize="11"
            textAnchor="middle" dominantBaseline="middle">{lbl.delta_h ?? 'ΔH'}</text>
        </>
      )}
    </svg>
  );
}

/* ── TEMPLATE 5: Coordinate Geometry ────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CoordGeometry({ p }: { p: any }) {
  const [xMin, xMax]: [number, number] = p.x_range ?? [-5, 5];
  const [yMin, yMax]: [number, number] = p.y_range ?? [-5, 5];
  const PL = 46, PR = 22, PT = 22, PB = 36;
  const VW = 360, VH = 290;
  const plotW = VW - PL - PR, plotH = VH - PT - PB;

  const sx = (x: number) => PL + ((x - xMin) / (xMax - xMin)) * plotW;
  const sy = (y: number) => VH - PB - ((y - yMin) / (yMax - yMin)) * plotH;
  const axX = sx(0), axY = sy(0);

  const xTicks = Array.from({ length: xMax - xMin - 1 }, (_, i) => xMin + i + 1);
  const yTicks = Array.from({ length: yMax - yMin - 1 }, (_, i) => yMin + i + 1);

  type GPoint  = { x: number; y: number; label?: string };
  type GLine   = { from: [number, number]; to: [number, number]; label?: string; dashed?: boolean; arrow?: boolean };
  type GCircle = { cx: number; cy: number; r: number; label?: string };

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* Grid */}
      {xTicks.map((x) => <line key={`gx${x}`} x1={sx(x)} y1={PT} x2={sx(x)} y2={VH - PB} stroke="#f1f5f9" strokeWidth="1" />)}
      {yTicks.map((y) => <line key={`gy${y}`} x1={PL} y1={sy(y)} x2={VW - PR} y2={sy(y)} stroke="#f1f5f9" strokeWidth="1" />)}
      {/* Axes */}
      <Arr x1={PL} y1={axY} x2={VW - PR} y2={axY} color="#94a3b8" />
      <Arr x1={axX} y1={VH - PB} x2={axX} y2={PT} color="#94a3b8" />
      <text x={VW - PR + 4} y={axY + 4} fill="#94a3b8" fontSize="11">x</text>
      <text x={axX + 4}     y={PT - 4}  fill="#94a3b8" fontSize="11">y</text>
      {/* Tick labels */}
      {xTicks.filter((x) => x !== 0).map((x) => (
        <text key={`tx${x}`} x={sx(x)} y={axY + 13} fill="#94a3b8" fontSize="9" textAnchor="middle">{x}</text>
      ))}
      {yTicks.filter((y) => y !== 0).map((y) => (
        <text key={`ty${y}`} x={axX - 6} y={sy(y) + 4} fill="#94a3b8" fontSize="9" textAnchor="end">{y}</text>
      ))}
      {/* Lines */}
      {(p.lines ?? []).map((line: GLine, i: number) => (
        line.arrow !== false ? (
          <Arr key={i} x1={sx(line.from[0])} y1={sy(line.from[1])}
            x2={sx(line.to[0])} y2={sy(line.to[1])} color="#334155" label={line.label} />
        ) : (
          <g key={i}>
            <line x1={sx(line.from[0])} y1={sy(line.from[1])}
              x2={sx(line.to[0])} y2={sy(line.to[1])}
              stroke="#334155" strokeWidth="1.5"
              strokeDasharray={line.dashed ? '5,3' : undefined} />
            {line.label && (
              <text x={(sx(line.from[0]) + sx(line.to[0])) / 2 + 8}
                y={(sy(line.from[1]) + sy(line.to[1])) / 2 - 7}
                fill="#334155" fontSize="12" fontWeight="600">{line.label}</text>
            )}
          </g>
        )
      ))}
      {/* Circles */}
      {(p.circles ?? []).map((c: GCircle, i: number) => (
        <g key={i}>
          <circle cx={sx(c.cx)} cy={sy(c.cy)} r={c.r * (plotW / (xMax - xMin))}
            fill="none" stroke="#6366f1" strokeWidth="1.5" />
          {c.label && (
            <text x={sx(c.cx) + c.r * (plotW / (xMax - xMin)) + 5} y={sy(c.cy)}
              fill="#6366f1" fontSize="12" fontWeight="600" dominantBaseline="middle">{c.label}</text>
          )}
        </g>
      ))}
      {/* Points */}
      {(p.points ?? []).map((pt: GPoint, i: number) => (
        <g key={i}>
          <circle cx={sx(pt.x)} cy={sy(pt.y)} r="4.5" fill="#2563eb" stroke="white" strokeWidth="1.5" />
          {pt.label && (
            <text x={sx(pt.x) + 9} y={sy(pt.y) - 7}
              fill="#2563eb" fontSize="12" fontWeight="600">{pt.label}</text>
          )}
        </g>
      ))}
    </svg>
  );
}

/* ── Main component ─────────────────────────────────────────── */
interface Props {
  descriptor: DiagramTemplate;
}

export function DiagramRenderer({ descriptor }: Props) {
  if (!descriptor?.template) return null;
  const { template, params } = descriptor;

  let inner: React.ReactNode = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = params as any;
  switch (template) {
    case 'inclined_plane':       inner = <InclinedPlane p={p} />; break;
    case 'simple_circuit':       inner = <SimpleCircuit p={p} />; break;
    case 'lens_mirror':          inner = <LensMirror p={p} />;    break;
    case 'energy_profile':       inner = <EnergyProfile p={p} />; break;
    case 'coordinate_geometry':  inner = <CoordGeometry p={p} />; break;
    default: return null;
  }

  return (
    <div style={{
      width: '100%',
      background: '#fafafa',
      border: '1px solid var(--gray-200)',
      borderRadius: 8,
      marginBottom: 16,
      overflow: 'hidden',
    }}>
      {inner}
    </div>
  );
}
