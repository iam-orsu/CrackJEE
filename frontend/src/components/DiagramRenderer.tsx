'use client';

import React from 'react';
import type { DiagramTemplate } from '@/types';

/* ── Arrow helper ──────────────────────────────────────────── */
function Arr({
  x1, y1, x2, y2, color = '#475569', label, lx, ly, sw,
}: {
  x1: number; y1: number; x2: number; y2: number;
  color?: string; label?: string; lx?: number; ly?: number; sw?: number;
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
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={sw ?? 2} strokeLinecap="round" />
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

/* double-headed arrow helper */
function DblArr({ x1, y1, x2, y2, color = '#374151', label, lx, ly }: {
  x1: number; y1: number; x2: number; y2: number;
  color?: string; label?: string; lx?: number; ly?: number;
}) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  return (
    <g>
      <Arr x1={mx} y1={my} x2={x1} y2={y1} color={color} />
      <Arr x1={mx} y1={my} x2={x2} y2={y2} color={color} />
      {label && (
        <text x={lx ?? mx} y={ly ?? my - 10}
          fill={color} fontSize="11" fontWeight="600" textAnchor="middle" dominantBaseline="middle">
          {label}
        </text>
      )}
    </g>
  );
}

/* ── TEMPLATE 1: Inclined Plane ─────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InclinedPlane({ p }: { p: any }) {
  const angle = Math.max(10, Math.min(70, +(p.angle_deg ?? 30)));
  const θ = (angle * Math.PI) / 180;
  const lbl = p.labels ?? {};

  const bx1 = 30, bx2 = 370, by = 200;
  const peakH = Math.min((bx2 - bx1) * Math.tan(θ), 172);
  const px = bx1, py = by - peakH;

  const sdx = bx2 - px, sdy = by - py;
  const slen = Math.sqrt(sdx * sdx + sdy * sdy);
  const cosθ = sdx / slen, sinθ = sdy / slen;
  const rot = Math.atan2(sdy, sdx) * (180 / Math.PI);

  const t = 0.42;
  const bkx = bx2 - t * sdx, bky = by - t * sdy;
  const FL = 58;

  const AR = 28;
  const arcBx = bx2 - AR, arcBy = by;
  const arcSx = bx2 - cosθ * AR, arcSy = by - sinθ * AR;

  return (
    <svg viewBox="0 0 400 220" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <line x1={bx1 - 8} y1={by} x2={bx2 + 8} y2={by} stroke="#d1d5db" strokeWidth="1" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line key={i} x1={40 + i * 50} y1={by} x2={32 + i * 50} y2={by + 8} stroke="#d1d5db" strokeWidth="1" />
      ))}
      <polygon points={`${px},${py} ${bx1},${by} ${bx2},${by}`}
        fill="rgba(99,102,241,0.08)" stroke="#6366f1" strokeWidth="1.8" />
      <path d={`M ${arcBx},${arcBy} A ${AR},${AR} 0 0,0 ${arcSx},${arcSy}`}
        fill="none" stroke="#6366f1" strokeWidth="1.4" />
      <text x={bx2 - AR * 2.1} y={by - 7} fill="#4f46e5" fontSize="11" fontWeight="600">
        {lbl.angle ?? `${angle}°`}
      </text>
      <g transform={`translate(${bkx},${bky}) rotate(${rot})`}>
        <rect x="-18" y="-14" width="36" height="28" rx="3"
          fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
        <text x="0" y="6" textAnchor="middle" fill="#1e40af" fontSize="11" fontWeight="600">
          {lbl.block ?? 'm'}
        </text>
      </g>
      {p.show_weight !== false && (
        <Arr x1={bkx} y1={bky} x2={bkx} y2={bky + FL} color="#dc2626"
          label={lbl.weight ?? 'mg'} lx={bkx + 18} ly={bky + FL - 4} />
      )}
      {p.show_normal !== false && (
        <Arr x1={bkx} y1={bky} x2={bkx + sinθ * FL} y2={bky - cosθ * FL} color="#16a34a"
          label={lbl.normal ?? 'N'} lx={bkx + sinθ * FL + 16} ly={bky - cosθ * FL} />
      )}
      {p.show_friction === true && (
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
      {label && <text x={horiz ? x : x + 20} y={horiz ? y - 20 : y} fill="#374151" fontSize="11"
        textAnchor={horiz ? 'middle' : 'start'} dominantBaseline="middle">{label}</text>}
    </g>
  );

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
  const axisY = 108, lensX = 250, lensH = 72;

  const isLens = type.includes('lens');
  const isConcave = type.includes('concave');
  const lensTop = axisY - lensH, lensBot = axisY + lensH;
  const bulge = isConcave ? -24 : 24;

  const fVal = Math.max(5, +(p.focal_length ?? 20));
  const uVal = Math.max(fVal * 0.5 + 1, +(p.object_distance ?? fVal * 1.5));

  // NCERT Cartesian sign convention
  const fSigned = isConcave ? -fVal : fVal;
  const denom = isLens ? (1 / fSigned - 1 / uVal) : (1 / fSigned + 1 / uVal);
  const vRaw = Math.abs(denom) > 1e-9 ? 1 / denom : 999;
  const vComputed = vRaw > 0 ? Math.min(vRaw, uVal * 4) : Math.max(vRaw, -uVal * 4);

  const maxPhys = Math.max(uVal, Math.abs(vComputed), fVal * 2.5);
  const scale = Math.min(195 / maxPhys, 7);

  const objX = Math.max(25, lensX - uVal * scale);
  const fLx = lensX - fVal * scale;
  const fRx = lensX + fVal * scale;
  const imgXRaw = lensX + vComputed * scale;
  const imgX = Math.max(22, Math.min(478, imgXRaw));

  const imgVirtual = isLens ? vComputed < 0 : vComputed > 0;
  const objH = 50;
  const mag = Math.min(Math.abs(vComputed) / uVal, 2.2);
  const imgH = Math.max(18, Math.min(80, objH * mag * 0.9));
  const objTop = axisY - objH;
  const imgTop = imgVirtual ? axisY - imgH : axisY + imgH;

  // Label for v value
  const vAbs = Math.abs(vRaw) > 900 ? '∞' : Math.abs(vRaw).toFixed(0);

  return (
    <svg viewBox="0 0 500 248" style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* Principal axis */}
      <line x1="18" y1={axisY} x2="482" y2={axisY} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="6,4" />

      {isLens ? (
        <g>
          <path d={`M ${lensX},${lensTop} Q ${lensX + bulge},${axisY} ${lensX},${lensBot}`}
            fill="rgba(147,197,253,0.12)" stroke="#64748b" strokeWidth="2" />
          <path d={`M ${lensX},${lensTop} Q ${lensX - bulge},${axisY} ${lensX},${lensBot}`}
            fill="none" stroke="#64748b" strokeWidth="2" />
          <polygon points={`${lensX},${lensTop - 7} ${lensX - 5},${lensTop + 8} ${lensX + 5},${lensTop + 8}`} fill="#64748b" />
          <polygon points={`${lensX},${lensBot + 7} ${lensX - 5},${lensBot - 8} ${lensX + 5},${lensBot - 8}`} fill="#64748b" />
        </g>
      ) : (
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
      {isLens && fLx > 30 && fLx < lensX - 8 && (
        <>
          <circle cx={fLx} cy={axisY} r="3" fill="#475569" />
          <text x={fLx} y={axisY + 14} fill="#475569" fontSize="10" textAnchor="middle">F</text>
        </>
      )}
      {isLens && fRx > lensX + 8 && fRx < 470 && (
        <>
          <circle cx={fRx} cy={axisY} r="3" fill="#475569" />
          <text x={fRx} y={axisY + 14} fill="#475569" fontSize="10" textAnchor="middle">F</text>
        </>
      )}
      {!isLens && (
        <circle cx={lensX - fVal * scale * (isConcave ? 1 : -1)} cy={axisY} r="3" fill="#475569" />
      )}

      {/* f label */}
      {lbl.f && (
        <text x={isLens ? (lensX + fRx) / 2 : lensX - 30} y={axisY - 10}
          fill="#475569" fontSize="10" textAnchor="middle">{lbl.f}</text>
      )}

      {/* Object arrow */}
      <Arr x1={objX} y1={axisY} x2={objX} y2={objTop} color="#2563eb"
        label={lbl.object ?? 'O'} lx={objX - 14} ly={objTop - 4} />

      {/* u distance label — sits below axis on the left side */}
      {objX > 22 && objX < lensX - 5 && (
        <g>
          <line x1={objX} y1={axisY + 4} x2={objX} y2={axisY + 22}
            stroke="#2563eb" strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
          <line x1={lensX} y1={axisY + 4} x2={lensX} y2={axisY + 22}
            stroke="#2563eb" strokeWidth="1" strokeDasharray="3,2" opacity="0.3" />
          <line x1={objX} y1={axisY + 22} x2={lensX} y2={axisY + 22}
            stroke="#2563eb" strokeWidth="1" opacity="0.35" />
          <text x={(objX + lensX) / 2} y={axisY + 34}
            fill="#2563eb" fontSize="10" textAnchor="middle">{`u = ${uVal} cm`}</text>
        </g>
      )}

      {/* Image arrow */}
      {imgVirtual ? (
        <g>
          <line x1={imgX} y1={axisY} x2={imgX} y2={imgTop}
            stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4,3" />
          <polygon points={`${imgX},${imgTop} ${imgX - 4},${imgTop + 10} ${imgX + 4},${imgTop + 10}`} fill="#dc2626" />
          <text x={imgX + 13} y={imgTop} fill="#dc2626" fontSize="11" fontWeight="600" dominantBaseline="middle">
            {lbl.image ?? 'I'}
          </text>
        </g>
      ) : (
        <Arr x1={imgX} y1={axisY} x2={imgX} y2={imgTop} color="#dc2626"
          label={lbl.image ?? 'I'} lx={imgX + 13} ly={imgTop} />
      )}

      {/* v distance label — sits below axis on the right (or virtual: left) side */}
      {!imgVirtual && imgX > lensX + 5 && imgX < 475 && (
        <g>
          <line x1={imgX}  y1={axisY + 4} x2={imgX}  y2={axisY + 44}
            stroke="#dc2626" strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
          <line x1={lensX} y1={axisY + 4} x2={lensX} y2={axisY + 44}
            stroke="#dc2626" strokeWidth="1" strokeDasharray="3,2" opacity="0.3" />
          <line x1={lensX} y1={axisY + 44} x2={imgX} y2={axisY + 44}
            stroke="#dc2626" strokeWidth="1" opacity="0.35" />
          <text x={(lensX + imgX) / 2} y={axisY + 56}
            fill="#dc2626" fontSize="10" textAnchor="middle">{`v = ${vAbs} cm`}</text>
        </g>
      )}
      {imgVirtual && imgX > 22 && imgX < lensX - 5 && (
        <g>
          <line x1={imgX}  y1={axisY + 4} x2={imgX}  y2={axisY + 44}
            stroke="#dc2626" strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
          <line x1={lensX} y1={axisY + 4} x2={lensX} y2={axisY + 44}
            stroke="#dc2626" strokeWidth="1" strokeDasharray="3,2" opacity="0.3" />
          <line x1={imgX}  y1={axisY + 44} x2={lensX} y2={axisY + 44}
            stroke="#dc2626" strokeWidth="1" opacity="0.35" />
          <text x={(imgX + lensX) / 2} y={axisY + 56}
            fill="#dc2626" fontSize="10" textAnchor="middle">{`v = −${vAbs} cm`}</text>
        </g>
      )}

      {/* Principal rays — convex lens, real image */}
      {showRays && type === 'convex_lens' && !imgVirtual && imgX > lensX + 5 && objX < lensX - 5 && (
        <g stroke="#fbbf24" strokeWidth="1" opacity="0.6">
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

  const peakY = 52, reactY = exo ? 118 : 148, prodY = exo ? 148 : 118;
  const reactX = 88, peakX = 214, prodX = 358;

  const curve = `M ${reactX},${reactY} C ${reactX + 52},${reactY} ${peakX - 52},${peakY} ${peakX},${peakY} S ${prodX - 52},${prodY} ${prodX},${prodY}`;

  const eaX = 146;
  const dhX = 384;

  return (
    <svg viewBox="0 0 430 215" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <Arr x1={48} y1={188} x2={48} y2={28} color="#94a3b8" />
      <Arr x1={48} y1={188} x2={420} y2={188} color="#94a3b8" />
      <text x={28} y={108} fill="#64748b" fontSize="11" textAnchor="middle"
        transform="rotate(-90,28,108)">Energy</text>
      <text x={230} y={204} fill="#64748b" fontSize="11" textAnchor="middle">Reaction coordinate</text>

      <line x1={60} y1={reactY} x2={reactX + 46} y2={reactY}
        stroke="#16a34a" strokeWidth="1.2" strokeDasharray="4,3" />
      <line x1={prodX - 46} y1={prodY} x2={412} y2={prodY}
        stroke="#dc2626" strokeWidth="1.2" strokeDasharray="4,3" />

      <path d={curve} fill="none" stroke="#6366f1" strokeWidth="2.2" />

      <text x={peakX} y={peakY - 10} fill="#6366f1" fontSize="11" textAnchor="middle" fontWeight="600">TS</text>

      <text x={reactX} y={reactY + 18} fill="#16a34a" fontSize="12" fontWeight="600" textAnchor="middle">
        {p.reactant_label ?? 'Reactants'}
      </text>
      <text x={prodX} y={prodY + 18} fill="#dc2626" fontSize="12" fontWeight="600" textAnchor="middle">
        {p.product_label ?? 'Products'}
      </text>

      <line x1={eaX} y1={reactY} x2={eaX} y2={peakY} stroke="#374151" strokeWidth="1" strokeDasharray="2,2" />
      <line x1={eaX - 5} y1={reactY} x2={eaX + 5} y2={reactY} stroke="#374151" strokeWidth="1.2" />
      <line x1={eaX - 5} y1={peakY}  x2={eaX + 5} y2={peakY}  stroke="#374151" strokeWidth="1.2" />
      <text x={eaX - 16} y={(reactY + peakY) / 2} fill="#374151" fontSize="11"
        textAnchor="middle" dominantBaseline="middle">{lbl.ea ?? 'Ea'}</text>

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
      {xTicks.map((x) => <line key={`gx${x}`} x1={sx(x)} y1={PT} x2={sx(x)} y2={VH - PB} stroke="#f1f5f9" strokeWidth="1" />)}
      {yTicks.map((y) => <line key={`gy${y}`} x1={PL} y1={sy(y)} x2={VW - PR} y2={sy(y)} stroke="#f1f5f9" strokeWidth="1" />)}
      <Arr x1={PL} y1={axY} x2={VW - PR} y2={axY} color="#94a3b8" />
      <Arr x1={axX} y1={VH - PB} x2={axX} y2={PT} color="#94a3b8" />
      <text x={VW - PR + 4} y={axY + 4} fill="#94a3b8" fontSize="11">x</text>
      <text x={axX + 4}     y={PT - 4}  fill="#94a3b8" fontSize="11">y</text>
      {xTicks.filter((x) => x !== 0).map((x) => (
        <text key={`tx${x}`} x={sx(x)} y={axY + 13} fill="#94a3b8" fontSize="9" textAnchor="middle">{x}</text>
      ))}
      {yTicks.filter((y) => y !== 0).map((y) => (
        <text key={`ty${y}`} x={axX - 6} y={sy(y) + 4} fill="#94a3b8" fontSize="9" textAnchor="end">{y}</text>
      ))}
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

/* ── TEMPLATE 6: Projectile Motion ──────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProjectileMotion({ p }: { p: any }) {
  const angle = Math.max(10, Math.min(80, +(p.angle_deg ?? 45)));
  const θ = (angle * Math.PI) / 180;
  const lbl = p.labels ?? {};
  const showComponents: boolean = p.show_components !== false;

  const x0 = 55, yg = 182, R = 308, xm = x0 + R / 2, xEnd = x0 + R;
  // For symmetric projectile: H/R = tan(θ)/4
  const H = Math.min(R * Math.tan(θ) / 4, 128);
  // Quadratic bezier: control point Cy = yg - 2H gives apex at yg - H
  const qcY = yg - 2 * H;

  const vLen = 52;
  const vx2 = x0 + Math.cos(θ) * vLen;
  const vy2 = yg - Math.sin(θ) * vLen;

  const AR = 24;
  const arcEndX = x0 + Math.cos(θ) * AR;
  const arcEndY = yg - Math.sin(θ) * AR;

  return (
    <svg viewBox="0 0 420 228" style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* Ground */}
      <line x1={x0 - 14} y1={yg} x2={xEnd + 14} y2={yg} stroke="#d1d5db" strokeWidth="1.5" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <line key={i} x1={58 + i * 42} y1={yg} x2={48 + i * 42} y2={yg + 8} stroke="#d1d5db" strokeWidth="1" />
      ))}

      {/* Trajectory */}
      <path d={`M ${x0},${yg} Q ${xm},${qcY} ${xEnd},${yg}`}
        fill="none" stroke="#6366f1" strokeWidth="2" />

      {/* Launch and landing dots */}
      <circle cx={x0} cy={yg} r="3.5" fill="#2563eb" />
      <circle cx={xEnd} cy={yg} r="3.5" fill="#2563eb" />

      {/* Initial velocity vector */}
      <Arr x1={x0} y1={yg} x2={vx2} y2={vy2} color="#2563eb"
        label={lbl.v0 ?? 'v₀'} lx={vx2 + 14} ly={vy2 - 5} />

      {/* Components */}
      {showComponents && (
        <g stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3">
          <line x1={x0} y1={yg} x2={vx2} y2={yg} />
          <line x1={vx2} y1={yg} x2={vx2} y2={vy2} />
        </g>
      )}

      {/* Angle arc */}
      <path d={`M ${x0 + AR},${yg} A ${AR},${AR} 0 0,0 ${arcEndX},${arcEndY}`}
        fill="none" stroke="#6366f1" strokeWidth="1.2" />
      <text x={x0 + AR + 9} y={yg - 8} fill="#4f46e5" fontSize="11" fontWeight="600">
        {lbl.angle ?? `${angle}°`}
      </text>

      {/* Max height marker */}
      {H > 20 && (
        <>
          <line x1={xm} y1={yg} x2={xm} y2={yg - H}
            stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
          <line x1={xm + 18} y1={yg - H} x2={xm + 18} y2={yg} stroke="#16a34a" strokeWidth="1.5" />
          <polygon points={`${xm+18},${yg-H} ${xm+14},${yg-H+9} ${xm+22},${yg-H+9}`} fill="#16a34a" />
          <polygon points={`${xm+18},${yg} ${xm+14},${yg-9} ${xm+22},${yg-9}`} fill="#16a34a" />
          <text x={xm + 28} y={(yg * 2 - H) / 2}
            fill="#16a34a" fontSize="11" fontWeight="600" dominantBaseline="middle">
            {lbl.height ?? 'H'}
          </text>
        </>
      )}

      {/* Range arrow */}
      <line x1={x0} y1={yg + 20} x2={xEnd} y2={yg + 20} stroke="#dc2626" strokeWidth="1.5" />
      <polygon points={`${x0},${yg+20} ${x0+9},${yg+16} ${x0+9},${yg+24}`} fill="#dc2626" />
      <polygon points={`${xEnd},${yg+20} ${xEnd-9},${yg+16} ${xEnd-9},${yg+24}`} fill="#dc2626" />
      <text x={xm} y={yg + 34} fill="#dc2626" fontSize="11" fontWeight="600" textAnchor="middle">
        {lbl.range ?? 'R'}
      </text>
    </svg>
  );
}

/* ── TEMPLATE 7: Pulley System ───────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PulleySystem({ p }: { p: any }) {
  const masses: { value?: string }[] = p.masses ?? [{ value: 'm₁' }, { value: 'm₂' }];
  const lbl = p.labels ?? {};

  // Pulley at center-top; ropes hang from the leftmost/rightmost tangent points of the circle
  // so vertical ropes + a clean semicircular arc over the top.
  const px = 210, py = 56, pr = 26;
  const leftX = px - pr;   // 184 — left tangent point x
  const rightX = px + pr;  // 236 — right tangent point x
  const ropeY = py;         // ropes attach at equator of pulley

  // Different heights: m1 lower (heavier → goes down), m2 higher (lighter → goes up)
  const m1Y = 158, m2Y = 118;
  const boxW = 40, boxH = 28;

  return (
    <svg viewBox="0 0 420 222" style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* Ceiling support */}
      <line x1={px - 30} y1={28} x2={px + 30} y2={28} stroke="#94a3b8" strokeWidth="2.5" />
      {[-2, -1, 0, 1, 2].map((i) => (
        <line key={i} x1={px + i * 12} y1={28} x2={px + i * 12 - 8} y2={18} stroke="#94a3b8" strokeWidth="1" />
      ))}
      {/* Pulley axle */}
      <line x1={px} y1={28} x2={px} y2={py - pr} stroke="#94a3b8" strokeWidth="2" />
      {/* Pulley wheel */}
      <circle cx={px} cy={py} r={pr} fill="white" stroke="#475569" strokeWidth="2" />
      <circle cx={px} cy={py} r={pr * 0.28} fill="#94a3b8" />

      {/* Rope: left vertical → arc over top → right vertical */}
      {/* Arc from left tangent (184,56) over the top to right tangent (236,56) — perfect semicircle */}
      <path d={`M ${leftX},${ropeY} A ${pr},${pr} 0 0,0 ${rightX},${ropeY}`}
        fill="none" stroke="#374151" strokeWidth="1.8" />
      <line x1={leftX}  y1={ropeY} x2={leftX}  y2={m1Y - boxH / 2} stroke="#374151" strokeWidth="1.8" />
      <line x1={rightX} y1={ropeY} x2={rightX} y2={m2Y - boxH / 2} stroke="#374151" strokeWidth="1.8" />

      {/* Mass 1 (left, lower = heavier) */}
      <rect x={leftX  - boxW / 2} y={m1Y - boxH / 2} width={boxW} height={boxH} rx="3"
        fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
      <text x={leftX} y={m1Y + 5} textAnchor="middle" fill="#1e40af" fontSize="12" fontWeight="600">
        {masses[0]?.value ?? 'm₁'}
      </text>

      {/* Mass 2 (right, higher = lighter) */}
      <rect x={rightX - boxW / 2} y={m2Y - boxH / 2} width={boxW} height={boxH} rx="3"
        fill="#fce7f3" stroke="#db2777" strokeWidth="1.5" />
      <text x={rightX} y={m2Y + 5} textAnchor="middle" fill="#9d174d" fontSize="12" fontWeight="600">
        {masses[1]?.value ?? 'm₂'}
      </text>

      {/* Tension labels on rope segments */}
      {lbl.tension && (
        <>
          <text x={leftX  - 14} y={(ropeY + m1Y - boxH / 2) / 2} fill="#374151" fontSize="11"
            textAnchor="end" dominantBaseline="middle">{lbl.tension}</text>
          <text x={rightX + 14} y={(ropeY + m2Y - boxH / 2) / 2} fill="#374151" fontSize="11"
            textAnchor="start" dominantBaseline="middle">{lbl.tension}</text>
        </>
      )}

      {/* Acceleration arrows: m1 downward (below box), m2 upward (above box) */}
      <Arr x1={leftX}  y1={m1Y + boxH / 2}      x2={leftX}  y2={m1Y + boxH / 2 + 28}
        color="#dc2626" label={lbl.accel ?? 'a'} lx={leftX + 18} ly={m1Y + boxH / 2 + 24} sw={1.5} />
      <Arr x1={rightX} y1={m2Y - boxH / 2}      x2={rightX} y2={m2Y - boxH / 2 - 28}
        color="#16a34a" sw={1.5} />
    </svg>
  );
}

/* ── TEMPLATE 8: Wave Diagram ────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WaveDiagram({ p }: { p: any }) {
  const waveType = (p.type ?? 'transverse').toLowerCase();
  const lbl = p.labels ?? {};
  const nCycles = Math.max(1, Math.min(3, +(p.num_cycles ?? 2)));

  const x0 = 50, xEnd = 382, axY = 105, A = 42;
  const W = xEnd - x0;
  const λPx = W / nCycles;

  // Build quadratic bezier sine path
  const buildSinePath = (phase: number = 0) => {
    const parts: string[] = [`M ${x0},${axY}`];
    for (let i = 0; i < nCycles * 2; i++) {
      const xS = x0 + (i / (nCycles * 2)) * W;
      const xE = x0 + ((i + 1) / (nCycles * 2)) * W;
      const xMid = (xS + xE) / 2;
      const isUp = (i + phase) % 2 === 0;
      // bezier control overshoots: 2A because quadratic bezier reaches half the control offset
      parts.push(`Q ${xMid},${axY + (isUp ? -2 * A : 2 * A)} ${xE},${axY}`);
    }
    return parts.join(' ');
  };

  if (waveType === 'standing') {
    const nodeXs = Array.from({ length: nCycles * 2 + 1 }, (_, i) => x0 + (i / (nCycles * 2)) * W);
    const antinodeXs = Array.from({ length: nCycles * 2 }, (_, i) => x0 + ((i + 0.5) / (nCycles * 2)) * W);

    return (
      <svg viewBox="0 0 430 210" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <Arr x1={x0 - 10} y1={axY} x2={xEnd + 14} y2={axY} color="#94a3b8" />
        <text x={xEnd + 18} y={axY + 4} fill="#94a3b8" fontSize="11">x</text>

        {/* Envelope curves */}
        <path d={buildSinePath(0)} fill="none" stroke="#6366f1" strokeWidth="2" />
        <path d={buildSinePath(1)} fill="none" stroke="#6366f1" strokeWidth="2" />

        {/* Node markers */}
        {nodeXs.map((nx, i) => (
          <g key={i}>
            <circle cx={nx} cy={axY} r="4" fill="#dc2626" />
            <text x={nx} y={axY + 16} fill="#dc2626" fontSize="9" textAnchor="middle">N</text>
          </g>
        ))}

        {/* Antinode labels */}
        {antinodeXs.map((ax, i) => (
          <text key={i} x={ax} y={axY - A - 12} fill="#16a34a" fontSize="9" textAnchor="middle">AN</text>
        ))}

        {lbl.amplitude && (
          <>
            <line x1={antinodeXs[0]!} y1={axY} x2={antinodeXs[0]!} y2={axY - A}
              stroke="#16a34a" strokeWidth="1" strokeDasharray="3,2" />
            <text x={antinodeXs[0]! + 14} y={axY - A / 2}
              fill="#16a34a" fontSize="11" fontWeight="600" dominantBaseline="middle">
              {lbl.amplitude}
            </text>
          </>
        )}

        {lbl.wavelength && nodeXs.length >= 3 && (
          <>
            <line x1={nodeXs[0]!} y1={axY + 28} x2={nodeXs[2]!} y2={axY + 28} stroke="#374151" strokeWidth="1.5" />
            <polygon points={`${nodeXs[0]},${axY+28} ${nodeXs[0]!+8},${axY+24} ${nodeXs[0]!+8},${axY+32}`} fill="#374151" />
            <polygon points={`${nodeXs[2]},${axY+28} ${nodeXs[2]!-8},${axY+24} ${nodeXs[2]!-8},${axY+32}`} fill="#374151" />
            <text x={(nodeXs[0]! + nodeXs[2]!) / 2} y={axY + 40}
              fill="#374151" fontSize="11" fontWeight="600" textAnchor="middle">{lbl.wavelength}</text>
          </>
        )}
      </svg>
    );
  }

  // Transverse wave
  const firstCrestX = x0 + λPx / 4;

  return (
    <svg viewBox="0 0 430 210" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <Arr x1={x0 - 10} y1={axY} x2={xEnd + 14} y2={axY} color="#94a3b8" />
      <Arr x1={x0} y1={axY + A + 16} x2={x0} y2={axY - A - 18} color="#94a3b8" />
      <text x={xEnd + 18} y={axY + 4} fill="#94a3b8" fontSize="11">x</text>
      <text x={x0 + 4} y={axY - A - 22} fill="#94a3b8" fontSize="11">y</text>

      <path d={buildSinePath(0)} fill="none" stroke="#6366f1" strokeWidth="2.2" />

      {/* Amplitude bracket */}
      <line x1={firstCrestX} y1={axY} x2={firstCrestX} y2={axY - A}
        stroke="#16a34a" strokeWidth="1" strokeDasharray="3,2" />
      <line x1={firstCrestX + 20} y1={axY - A} x2={firstCrestX + 20} y2={axY}
        stroke="#16a34a" strokeWidth="1.5" />
      <polygon points={`${firstCrestX+20},${axY-A} ${firstCrestX+16},${axY-A+8} ${firstCrestX+24},${axY-A+8}`} fill="#16a34a" />
      <polygon points={`${firstCrestX+20},${axY} ${firstCrestX+16},${axY-8} ${firstCrestX+24},${axY-8}`} fill="#16a34a" />
      <text x={firstCrestX + 32} y={(axY * 2 - A) / 2}
        fill="#16a34a" fontSize="11" fontWeight="600" dominantBaseline="middle">
        {lbl.amplitude ?? 'A'}
      </text>

      {/* Wavelength bracket */}
      <line x1={x0} y1={axY + 30} x2={x0 + λPx} y2={axY + 30} stroke="#374151" strokeWidth="1.5" />
      <polygon points={`${x0},${axY+30} ${x0+8},${axY+26} ${x0+8},${axY+34}`} fill="#374151" />
      <polygon points={`${x0+λPx},${axY+30} ${x0+λPx-8},${axY+26} ${x0+λPx-8},${axY+34}`} fill="#374151" />
      <text x={x0 + λPx / 2} y={axY + 42}
        fill="#374151" fontSize="11" fontWeight="600" textAnchor="middle">
        {lbl.wavelength ?? 'λ'}
      </text>

      {/* Wave velocity label */}
      {lbl.velocity && (
        <Arr x1={x0 + λPx * 0.6} y1={axY - 10} x2={x0 + λPx * 0.6 + 32} y2={axY - 10}
          color="#dc2626" label={lbl.velocity} lx={x0 + λPx * 0.6 + 48} ly={axY - 10} />
      )}
    </svg>
  );
}

/* ── TEMPLATE 9: Capacitor / Electric Field ─────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CapacitorField({ p }: { p: any }) {
  const lbl = p.labels ?? {};
  const nLines = Math.max(3, Math.min(7, +(p.num_field_lines ?? 5)));
  const showBattery: boolean = p.show_battery === true;

  const leftX = 130, rightX = 300, plateCY = 105, plateH = 130;
  const plateTop = plateCY - plateH / 2;
  const plateBot = plateCY + plateH / 2;
  const fieldYs = Array.from({ length: nLines }, (_, i) =>
    plateTop + 14 + (i * (plateH - 28)) / (nLines - 1)
  );

  return (
    <svg viewBox="0 0 430 248" style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* Left plate (+) */}
      <line x1={leftX} y1={plateTop} x2={leftX} y2={plateBot}
        stroke="#2563eb" strokeWidth="5" strokeLinecap="round" />
      {[0, 1, 2, 3].map((i) => {
        const y = plateTop + 16 + i * 27;
        return (
          <g key={i}>
            <line x1={leftX - 16} y1={y} x2={leftX - 6} y2={y} stroke="#2563eb" strokeWidth="1.5" />
            <line x1={leftX - 11} y1={y - 5} x2={leftX - 11} y2={y + 5} stroke="#2563eb" strokeWidth="1.5" />
          </g>
        );
      })}
      <text x={leftX - 30} y={plateCY + 5} fill="#2563eb" fontSize="12" fontWeight="700" textAnchor="middle">
        {lbl.charge_left ?? '+Q'}
      </text>

      {/* Right plate (−) */}
      <line x1={rightX} y1={plateTop} x2={rightX} y2={plateBot}
        stroke="#dc2626" strokeWidth="5" strokeLinecap="round" />
      {[0, 1, 2, 3].map((i) => {
        const y = plateTop + 16 + i * 27;
        return (
          <line key={i} x1={rightX + 6} y1={y} x2={rightX + 16} y2={y} stroke="#dc2626" strokeWidth="1.5" />
        );
      })}
      <text x={rightX + 30} y={plateCY + 5} fill="#dc2626" fontSize="12" fontWeight="700" textAnchor="middle">
        {lbl.charge_right ?? '−Q'}
      </text>

      {/* Electric field arrows */}
      {fieldYs.map((fy, i) => (
        <Arr key={i} x1={leftX + 8} y1={fy} x2={rightX - 8} y2={fy} color="#475569" sw={1.5} />
      ))}

      {/* E label above field */}
      <text x={(leftX + rightX) / 2} y={plateCY - plateH / 2 - 12}
        fill="#475569" fontSize="12" fontWeight="600" textAnchor="middle">
        {lbl.field ?? 'E →'}
      </text>

      {/* Plate separation d */}
      {lbl.separation && (
        <>
          <line x1={leftX} y1={plateBot + 16} x2={rightX} y2={plateBot + 16} stroke="#374151" strokeWidth="1.5" />
          <polygon points={`${leftX},${plateBot+16} ${leftX+8},${plateBot+12} ${leftX+8},${plateBot+20}`} fill="#374151" />
          <polygon points={`${rightX},${plateBot+16} ${rightX-8},${plateBot+12} ${rightX-8},${plateBot+20}`} fill="#374151" />
          <text x={(leftX + rightX) / 2} y={plateBot + 30}
            fill="#374151" fontSize="11" fontWeight="600" textAnchor="middle">
            {lbl.separation}
          </text>
        </>
      )}

      {/* Battery (optional) */}
      {showBattery && (
        <g>
          <line x1={leftX} y1={plateBot + 46} x2={leftX} y2={plateBot + 56} stroke="#374151" strokeWidth="1.5" />
          <line x1={rightX} y1={plateBot + 46} x2={rightX} y2={plateBot + 56} stroke="#374151" strokeWidth="1.5" />
          <line x1={leftX} y1={plateBot + 56} x2={(leftX + rightX) / 2 - 10} y2={plateBot + 56} stroke="#374151" strokeWidth="1.5" />
          <line x1={(leftX + rightX) / 2 + 10} y1={plateBot + 56} x2={rightX} y2={plateBot + 56} stroke="#374151" strokeWidth="1.5" />
          <line x1={(leftX + rightX) / 2 - 10} y1={plateBot + 49} x2={(leftX + rightX) / 2 + 10} y2={plateBot + 49}
            stroke="#1e293b" strokeWidth="2.5" />
          <line x1={(leftX + rightX) / 2 - 5} y1={plateBot + 56} x2={(leftX + rightX) / 2 + 5} y2={plateBot + 56}
            stroke="#1e293b" strokeWidth="1.5" />
          {lbl.voltage && (
            <text x={(leftX + rightX) / 2} y={plateBot + 70}
              fill="#374151" fontSize="11" textAnchor="middle">{lbl.voltage}</text>
          )}
        </g>
      )}
    </svg>
  );
}

/* ── TEMPLATE 10: P-V Diagram ────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PvDiagram({ p }: { p: any }) {
  const process = (p.process ?? 'isothermal').toLowerCase();
  const lbl = p.labels ?? {};

  // SVG layout: P-axis vertical left, V-axis horizontal bottom
  const ox = 58, oy = 205, xEnd = 355, yTop = 30;

  // Pre-defined curve paths for each process type
  // All states A and B are absolute SVG coordinates
  const processes: Record<string, { path: string; A: [number,number]; B: [number,number]; color: string }> = {
    isothermal: {
      path: `M 95,62 C 190,62 295,95 295,148`,
      A: [95, 62], B: [295, 148], color: '#6366f1',
    },
    adiabatic: {
      path: `M 95,55 C 135,55 295,118 295,162`,
      A: [95, 55], B: [295, 162], color: '#dc2626',
    },
    isobaric: {
      path: `M 95,100 L 295,100`,
      A: [95, 100], B: [295, 100], color: '#16a34a',
    },
    isochoric: {
      path: `M 175,162 L 175,62`,
      A: [175, 162], B: [175, 62], color: '#d97706',
    },
  };

  if (process === 'carnot') {
    // 4-process closed loop: A→B (hot isotherm), B→C (adiabatic), C→D (cold isotherm), D→A (adiabatic)
    const A: [number,number] = [95,  62];
    const B: [number,number] = [230, 98];
    const C: [number,number] = [280, 150];
    const D: [number,number] = [130, 122];

    return (
      <svg viewBox="0 0 380 235" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <Arr x1={ox} y1={oy} x2={ox} y2={yTop} color="#94a3b8" />
        <Arr x1={ox} y1={oy} x2={xEnd} y2={oy} color="#94a3b8" />
        <text x={ox - 14} y={yTop + 2} fill="#94a3b8" fontSize="11">P</text>
        <text x={xEnd + 4} y={oy + 4} fill="#94a3b8" fontSize="11">V</text>

        {/* Hot isotherm A→B (red) */}
        <path d={`M ${A[0]},${A[1]} C 175,${A[1]} ${B[0]},${B[1]-18} ${B[0]},${B[1]}`}
          fill="none" stroke="#dc2626" strokeWidth="2" />
        {/* Adiabatic B→C */}
        <path d={`M ${B[0]},${B[1]} C ${B[0]+20},${B[1]+20} ${C[0]},${C[1]-15} ${C[0]},${C[1]}`}
          fill="none" stroke="#475569" strokeWidth="1.6" strokeDasharray="6,3" />
        {/* Cold isotherm C→D (blue) */}
        <path d={`M ${C[0]},${C[1]} C 200,${C[1]} ${D[0]},${D[1]+14} ${D[0]},${D[1]}`}
          fill="none" stroke="#2563eb" strokeWidth="2" />
        {/* Adiabatic D→A */}
        <path d={`M ${D[0]},${D[1]} C ${D[0]-16},${D[1]-18} ${A[0]},${A[1]+15} ${A[0]},${A[1]}`}
          fill="none" stroke="#475569" strokeWidth="1.6" strokeDasharray="6,3" />

        {/* State dots */}
        {[A, B, C, D].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="4.5" fill="white" stroke="#475569" strokeWidth="1.5" />
            <text x={x + (i < 2 ? 8 : -14)} y={y - 6} fill="#374151" fontSize="11" fontWeight="600">
              {['A','B','C','D'][i]}
            </text>
          </g>
        ))}

        {/* Labels */}
        <text x={165} y={68} fill="#dc2626" fontSize="10" textAnchor="middle">
          {lbl.t_hot ?? 'T₁ (hot)'}
        </text>
        <text x={210} y={165} fill="#2563eb" fontSize="10" textAnchor="middle">
          {lbl.t_cold ?? 'T₂ (cold)'}
        </text>
        <text x={295} y={122} fill="#475569" fontSize="10" textAnchor="start">adiabatic</text>
      </svg>
    );
  }

  const proc = processes[process] ?? processes['isothermal']!;

  return (
    <svg viewBox="0 0 380 235" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <Arr x1={ox} y1={oy} x2={ox} y2={yTop} color="#94a3b8" />
      <Arr x1={ox} y1={oy} x2={xEnd} y2={oy} color="#94a3b8" />
      <text x={ox - 14} y={yTop + 2} fill="#94a3b8" fontSize="11">P</text>
      <text x={xEnd + 4} y={oy + 4} fill="#94a3b8" fontSize="11">V</text>

      {/* Dashed lines from states to axes */}
      <line x1={proc.A[0]} y1={proc.A[1]} x2={proc.A[0]} y2={oy}
        stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />
      <line x1={proc.A[0]} y1={proc.A[1]} x2={ox} y2={proc.A[1]}
        stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />
      <line x1={proc.B[0]} y1={proc.B[1]} x2={proc.B[0]} y2={oy}
        stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />
      <line x1={proc.B[0]} y1={proc.B[1]} x2={ox} y2={proc.B[1]}
        stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />

      {/* Process curve with direction arrow */}
      <path d={proc.path} fill="none" stroke={proc.color} strokeWidth="2.2" />

      {/* State markers */}
      <circle cx={proc.A[0]} cy={proc.A[1]} r="4.5" fill="white" stroke="#475569" strokeWidth="1.5" />
      <text x={proc.A[0] - 10} y={proc.A[1] - 6} fill="#374151" fontSize="11" fontWeight="600">
        {lbl.state_a ?? 'A'}
      </text>
      <circle cx={proc.B[0]} cy={proc.B[1]} r="4.5" fill="white" stroke="#475569" strokeWidth="1.5" />
      <text x={proc.B[0] + 8} y={proc.B[1] + 4} fill="#374151" fontSize="11" fontWeight="600">
        {lbl.state_b ?? 'B'}
      </text>

      {/* Process label */}
      {lbl.process && (
        <text x={(proc.A[0] + proc.B[0]) / 2 + 22} y={(proc.A[1] + proc.B[1]) / 2 - 8}
          fill={proc.color} fontSize="11" fontWeight="600" textAnchor="middle">
          {lbl.process}
        </text>
      )}

      {/* Work done shading */}
      <path d={`${proc.path} L ${proc.B[0]},${oy} L ${proc.A[0]},${oy} Z`}
        fill={proc.color} opacity="0.06" />
      <text x={(proc.A[0] + proc.B[0]) / 2} y={oy - 10}
        fill={proc.color} fontSize="10" textAnchor="middle" opacity="0.7">W</text>
    </svg>
  );
}

/* ── TEMPLATE 11: Triangle ───────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TriangleDiagram({ p }: { p: any }) {
  const lbl = p.labels ?? {};
  let Adeg = +(p.angles?.A ?? p.angle_A ?? 60);
  let Bdeg = +(p.angles?.B ?? p.angle_B ?? 60);
  let Cdeg = +(p.angles?.C ?? p.angle_C ?? 60);
  const tot = Adeg + Bdeg + Cdeg;
  Adeg = (Adeg / tot) * 180; Bdeg = (Bdeg / tot) * 180; Cdeg = (Cdeg / tot) * 180;
  const Ar = Adeg * Math.PI / 180, Br = Bdeg * Math.PI / 180;

  // side lengths (law of sines, base BC = 1): c = AB opposite C, b = AC opposite B
  const sideC = Math.sin(Cdeg * Math.PI / 180) / Math.sin(Ar);
  const sideB = Math.sin(Bdeg * Math.PI / 180) / Math.sin(Ar);

  // vertices in math-coords (y up): B at origin, C at (1,0), A from angle at B
  const Bm: [number, number] = [0, 0];
  const Cm: [number, number] = [1, 0];
  const Am: [number, number] = [sideC * Math.cos(Br), sideC * Math.sin(Br)];

  const allX = [Am[0], 0, 1], allY = [Am[1], 0, 0];
  const mnX = Math.min(...allX), mxX = Math.max(...allX);
  const mnY = Math.min(...allY), mxY = Math.max(...allY);
  const VW = 400, VH = 240, PAD = 52;
  const sc = Math.min((VW - 2 * PAD) / (mxX - mnX || 1), (VH - 2 * PAD) / (mxY - mnY || 1));

  const sv = ([mx, my]: [number, number]): [number, number] => [
    PAD + (mx - mnX) * sc, VH - PAD - (my - mnY) * sc,
  ];
  const [Ax, Ay] = sv(Am), [Bx, By] = sv(Bm), [Cx, Cy] = sv(Cm);
  const A: [number, number] = [Ax, Ay], B: [number, number] = [Bx, By], C: [number, number] = [Cx, Cy];

  // incircle: incenter weighted by opposite sides
  const perim = 1 + sideB + sideC;
  const Ix = (1 * Ax + sideB * Bx + sideC * Cx) / perim;
  const Iy = (1 * Ay + sideB * By + sideC * Cy) / perim;
  const area = 0.5 * Math.abs((Bx - Ax) * (Cy - Ay) - (Cx - Ax) * (By - Ay));
  const inR  = area / (perim * sc / 2);

  // circumcircle
  const D2 = 2 * (Ax * (By - Cy) + Bx * (Cy - Ay) + Cx * (Ay - By));
  const A2 = Ax**2 + Ay**2, B2 = Bx**2 + By**2, C2 = Cx**2 + Cy**2;
  const ccX = D2 ? (A2*(By-Cy) + B2*(Cy-Ay) + C2*(Ay-By)) / D2 : (Ax+Bx+Cx)/3;
  const ccY = D2 ? (A2*(Cx-Bx) + B2*(Ax-Cx) + C2*(Bx-Ax)) / D2 : (Ay+By+Cy)/3;
  const ccR = Math.sqrt((ccX - Bx)**2 + (ccY - By)**2);

  const arcR = 18;
  function arcD(V: [number,number], P1: [number,number], P2: [number,number]) {
    const a1 = Math.atan2(P1[1]-V[1], P1[0]-V[0]);
    const a2 = Math.atan2(P2[1]-V[1], P2[0]-V[0]);
    let d = ((a2 - a1) + 2*Math.PI) % (2*Math.PI);
    if (d > Math.PI) d -= 2*Math.PI;
    return `M ${(V[0]+arcR*Math.cos(a1)).toFixed(1)},${(V[1]+arcR*Math.sin(a1)).toFixed(1)} A ${arcR},${arcR} 0 0,${d>0?1:0} ${(V[0]+arcR*Math.cos(a2)).toFixed(1)},${(V[1]+arcR*Math.sin(a2)).toFixed(1)}`;
  }
  function angLblPos(V: [number,number], P1: [number,number], P2: [number,number], r: number): [number,number] {
    const a1 = Math.atan2(P1[1]-V[1], P1[0]-V[0]);
    const a2 = Math.atan2(P2[1]-V[1], P2[0]-V[0]);
    let d = ((a2-a1)+2*Math.PI)%(2*Math.PI); if(d>Math.PI) d-=2*Math.PI;
    const mid = a1 + d/2; return [V[0]+r*Math.cos(mid), V[1]+r*Math.sin(mid)];
  }
  const [alx,aly] = angLblPos(A,B,C,arcR+13);
  const [blx,bly] = angLblPos(B,A,C,arcR+13);
  const [clx,cly] = angLblPos(C,A,B,arcR+13);

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      {p.show_circumcircle && <circle cx={ccX} cy={ccY} r={ccR} fill="none" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="5,3"/>}
      <polygon points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`} fill="rgba(99,102,241,0.05)" stroke="#6366f1" strokeWidth="2"/>
      {p.show_incircle && <circle cx={Ix} cy={Iy} r={inR} fill="none" stroke="#16a34a" strokeWidth="1.2" strokeDasharray="4,2"/>}
      <path d={arcD(A,B,C)} fill="none" stroke="#6366f1" strokeWidth="1.2"/>
      <path d={arcD(B,A,C)} fill="none" stroke="#6366f1" strokeWidth="1.2"/>
      <path d={arcD(C,A,B)} fill="none" stroke="#6366f1" strokeWidth="1.2"/>
      <text x={alx} y={aly} fill="#4f46e5" fontSize="11" fontWeight="600" textAnchor="middle" dominantBaseline="middle">{lbl.A ?? `${Math.round(Adeg)}°`}</text>
      <text x={blx} y={bly} fill="#4f46e5" fontSize="11" fontWeight="600" textAnchor="middle" dominantBaseline="middle">{lbl.B ?? `${Math.round(Bdeg)}°`}</text>
      <text x={clx} y={cly} fill="#4f46e5" fontSize="11" fontWeight="600" textAnchor="middle" dominantBaseline="middle">{lbl.C ?? `${Math.round(Cdeg)}°`}</text>
      <text x={Ax} y={Ay-14} fill="#374151" fontSize="13" fontWeight="700" textAnchor="middle">{lbl.vertex_A ?? 'A'}</text>
      <text x={Bx-16} y={By+6} fill="#374151" fontSize="13" fontWeight="700" textAnchor="middle">{lbl.vertex_B ?? 'B'}</text>
      <text x={Cx+16} y={Cy+6} fill="#374151" fontSize="13" fontWeight="700" textAnchor="middle">{lbl.vertex_C ?? 'C'}</text>
      {lbl.a && <text x={(Bx+Cx)/2} y={(By+Cy)/2+16} fill="#374151" fontSize="12" textAnchor="middle">{lbl.a}</text>}
      {lbl.b && <text x={(Ax+Cx)/2+12} y={(Ay+Cy)/2} fill="#374151" fontSize="12" textAnchor="start">{lbl.b}</text>}
      {lbl.c && <text x={(Ax+Bx)/2-12} y={(Ay+By)/2} fill="#374151" fontSize="12" textAnchor="end">{lbl.c}</text>}
      {p.show_circumcircle && <circle cx={ccX} cy={ccY} r="3" fill="#dc2626"/>}
      {p.show_incircle && <circle cx={Ix} cy={Iy} r="3" fill="#16a34a"/>}
    </svg>
  );
}

/* ── TEMPLATE 12: Circle Geometry ────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CircleGeom({ p }: { p: any }) {
  const lbl = p.labels ?? {};
  const sub = (p.subtype ?? 'single').toLowerCase().replace(/[-\s]/g, '_');
  const VW = 380, VH = 240;
  const cx1 = +(p.cx ?? p.cx1 ?? 190), cy1 = +(p.cy ?? p.cy1 ?? 120), r1 = +(p.r ?? p.r1 ?? 80);

  if (sub === 'two_circles') {
    const cx2 = +(p.cx2 ?? cx1 + r1 + 50), cy2 = +(p.cy2 ?? cy1), r2 = +(p.r2 ?? 55);
    const allX = [cx1-r1, cx1+r1, cx2-r2, cx2+r2], allY = [cy1-r1, cy1+r1, cy2-r2, cy2+r2];
    const [mnX,mxX,mnY,mxY] = [Math.min(...allX)-14,Math.max(...allX)+14,Math.min(...allY)-14,Math.max(...allY)+14];
    const sc2 = Math.min(VW/(mxX-mnX), VH/(mxY-mnY));
    const tx = (x: number) => (x-mnX)*sc2, ty = (y: number) => (y-mnY)*sc2;
    return (
      <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
        <circle cx={tx(cx1)} cy={ty(cy1)} r={r1*sc2} fill="rgba(99,102,241,0.06)" stroke="#6366f1" strokeWidth="1.8"/>
        <circle cx={tx(cx2)} cy={ty(cy2)} r={r2*sc2} fill="rgba(37,99,235,0.06)" stroke="#2563eb" strokeWidth="1.8"/>
        {lbl.r1 && <><line x1={tx(cx1)} y1={ty(cy1)} x2={tx(cx1+r1)} y2={ty(cy1)} stroke="#6366f1" strokeWidth="1" strokeDasharray="3,2"/>
          <text x={tx(cx1+r1/2)} y={ty(cy1)-8} fill="#6366f1" fontSize="11" textAnchor="middle">{lbl.r1}</text></>}
        {lbl.r2 && <><line x1={tx(cx2)} y1={ty(cy2)} x2={tx(cx2+r2)} y2={ty(cy2)} stroke="#2563eb" strokeWidth="1" strokeDasharray="3,2"/>
          <text x={tx(cx2+r2/2)} y={ty(cy2)-8} fill="#2563eb" fontSize="11" textAnchor="middle">{lbl.r2}</text></>}
        {lbl.c1 && <text x={tx(cx1)} y={ty(cy1)+5} fill="#6366f1" fontSize="12" fontWeight="600" textAnchor="middle">{lbl.c1}</text>}
        {lbl.c2 && <text x={tx(cx2)} y={ty(cy2)+5} fill="#2563eb" fontSize="12" fontWeight="600" textAnchor="middle">{lbl.c2}</text>}
      </svg>
    );
  }

  if (sub === 'tangent_from_point') {
    const px = +(p.point_x ?? cx1 + r1 + 70), py = +(p.point_y ?? cy1);
    const dist = Math.sqrt((px-cx1)**2 + (py-cy1)**2);
    if (dist <= r1) return null;
    const tang = Math.sqrt(dist**2 - r1**2);
    const ang = Math.atan2(py-cy1, px-cx1), half = Math.asin(r1/dist);
    const t1x = px - tang*Math.cos(ang-half), t1y = py - tang*Math.sin(ang-half);
    const t2x = px - tang*Math.cos(ang+half), t2y = py - tang*Math.sin(ang+half);
    return (
      <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
        <circle cx={cx1} cy={cy1} r={r1} fill="rgba(99,102,241,0.06)" stroke="#6366f1" strokeWidth="1.8"/>
        <circle cx={cx1} cy={cy1} r="3" fill="#6366f1"/>
        <line x1={px} y1={py} x2={t1x} y2={t1y} stroke="#dc2626" strokeWidth="1.5"/>
        <line x1={px} y1={py} x2={t2x} y2={t2y} stroke="#dc2626" strokeWidth="1.5"/>
        <circle cx={px} cy={py} r="4.5" fill="#dc2626"/>
        <circle cx={t1x} cy={t1y} r="3.5" fill="#6366f1"/>
        <circle cx={t2x} cy={t2y} r="3.5" fill="#6366f1"/>
        {lbl.point && <text x={px+12} y={py+5} fill="#dc2626" fontSize="12" fontWeight="600">{lbl.point}</text>}
        {lbl.center && <text x={cx1+10} y={cy1-8} fill="#6366f1" fontSize="12" fontWeight="600">{lbl.center}</text>}
        {lbl.radius && <><line x1={cx1} y1={cy1} x2={t1x} y2={t1y} stroke="#6366f1" strokeWidth="1" strokeDasharray="3,2"/>
          <text x={(cx1+t1x)/2-12} y={(cy1+t1y)/2-6} fill="#6366f1" fontSize="11">{lbl.radius}</text></>}
        {lbl.tangent && <text x={(px+t1x)/2-14} y={(py+t1y)/2-6} fill="#dc2626" fontSize="11">{lbl.tangent}</text>}
      </svg>
    );
  }

  // default: single circle with optional chord/points
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      <circle cx={cx1} cy={cy1} r={r1} fill="rgba(99,102,241,0.06)" stroke="#6366f1" strokeWidth="1.8"/>
      <circle cx={cx1} cy={cy1} r="3" fill="#6366f1"/>
      {lbl.radius && (<><line x1={cx1} y1={cy1} x2={cx1+r1} y2={cy1} stroke="#6366f1" strokeWidth="1" strokeDasharray="3,2"/>
        <text x={cx1+r1/2} y={cy1-9} fill="#6366f1" fontSize="11" textAnchor="middle">{lbl.radius}</text></>)}
      {lbl.center && <text x={cx1+8} y={cy1-6} fill="#6366f1" fontSize="12" fontWeight="600">{lbl.center}</text>}
      {p.chord && (
        <><line x1={+(p.chord.x1??cx1-r1)} y1={+(p.chord.y1??cy1)} x2={+(p.chord.x2??cx1+r1)} y2={+(p.chord.y2??cy1)} stroke="#374151" strokeWidth="1.5"/>
          {p.chord.label && <text x={(+(p.chord.x1??cx1-r1)++(p.chord.x2??cx1+r1))/2} y={(+(p.chord.y1??cy1)++(p.chord.y2??cy1))/2-8} fill="#374151" fontSize="11" textAnchor="middle">{p.chord.label}</text>}
        </>
      )}
      {(p.points ?? []).map((pt: {x:number;y:number;label?:string}, i: number) => (
        <g key={i}>
          <circle cx={+pt.x} cy={+pt.y} r="4.5" fill="#2563eb" stroke="white" strokeWidth="1.5"/>
          {pt.label && <text x={+pt.x+10} y={+pt.y-5} fill="#2563eb" fontSize="12" fontWeight="600">{pt.label}</text>}
        </g>
      ))}
    </svg>
  );
}

/* ── TEMPLATE 13: Conic Section ──────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ConicSection({ p }: { p: any }) {
  const type = (p.type ?? 'parabola').toLowerCase();
  const lbl = p.labels ?? {};
  const VW = 420, VH = 260;
  const ox = VW / 2, oy = VH / 2;
  const toS = (x: number, y: number, sc: number): [number,number] => [ox + x*sc, oy - y*sc];

  if (type === 'ellipse' || type === 'hyperbola') {
    const a = +(p.a ?? 4), b = +(p.b ?? 3);
    const sc = Math.min((VW/2 - 32) / a, (VH/2 - 28) / b, 30);
    const isVertEllipse = type === 'ellipse' && b > a;
    const c = type === 'ellipse'
      ? Math.sqrt(Math.max(0, Math.max(a,b)**2 - Math.min(a,b)**2))
      : Math.sqrt(a**2 + b**2);
    // Horizontal ellipse/hyperbola: foci on x-axis at (±c,0)
    // Vertical ellipse (b>a): foci on y-axis at (0,±c)
    const hf1x = toS(-c, 0, sc)[0], hf2x = toS(c, 0, sc)[0];
    const f1x = isVertEllipse ? ox : hf1x;
    const f2x = isVertEllipse ? ox : hf2x;
    const f1y = isVertEllipse ? oy+c*sc : oy;
    const f2y = isVertEllipse ? oy-c*sc : oy;
    const focY = oy; // used by hyperbola (always x-axis)

    const axes = (
      <>{['x','y'].map((ax,i) => (
        <Arr key={ax} x1={i?ox:24} y1={i?VH-16:oy} x2={i?ox:VW-12} y2={i?14:oy} color="#94a3b8" sw={1.5}/>
      ))}
        <text x={VW-10} y={oy+14} fill="#94a3b8" fontSize="11">x</text>
        <text x={ox+6} y={20} fill="#94a3b8" fontSize="11">y</text>
        <text x={ox-12} y={oy+14} fill="#94a3b8" fontSize="10">O</text>
      </>
    );

    if (type === 'ellipse') {
      return (
        <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
          {axes}
          <ellipse cx={ox} cy={oy} rx={a*sc} ry={b*sc} fill="rgba(99,102,241,0.06)" stroke="#6366f1" strokeWidth="2"/>
          {p.show_focus !== false && (<>
            <circle cx={f1x} cy={f1y} r="4" fill="#2563eb"/><circle cx={f2x} cy={f2y} r="4" fill="#2563eb"/>
            <text x={f1x+(isVertEllipse?8:0)} y={f1y+(isVertEllipse?4:16)} fill="#2563eb" fontSize="11" fontWeight="600" textAnchor={isVertEllipse?"start":"middle"}>{lbl.f1 ?? (isVertEllipse?'(0,−c)':'(-c,0)')}</text>
            <text x={f2x+(isVertEllipse?8:0)} y={f2y+(isVertEllipse?4:16)} fill="#2563eb" fontSize="11" fontWeight="600" textAnchor={isVertEllipse?"start":"middle"}>{lbl.f2 ?? (isVertEllipse?'(0,c)':'(c,0)')}</text>
          </>)}
          {lbl.a && (<><line x1={ox} y1={oy} x2={ox+a*sc} y2={oy} stroke="#374151" strokeWidth="1" strokeDasharray="3,2"/>
            <text x={ox+a*sc/2} y={oy-8} fill="#374151" fontSize="11" textAnchor="middle">{lbl.a}</text></>)}
          {lbl.b && (<><line x1={ox} y1={oy} x2={ox} y2={oy-b*sc} stroke="#374151" strokeWidth="1" strokeDasharray="3,2"/>
            <text x={ox+10} y={oy-b*sc/2} fill="#374151" fontSize="11">{lbl.b}</text></>)}
          {lbl.equation && <text x={VW-16} y={38} fill="#6366f1" fontSize="12" fontWeight="600" textAnchor="end">{lbl.equation}</text>}
        </svg>
      );
    }

    // hyperbola
    const slopeV = b / a;
    const branch = (sign: 1|-1): string => {
      const pts: string[] = [];
      for (let t = -2.6; t <= 2.6; t += 0.07) {
        const [sx, sy] = toS(sign*a*Math.cosh(t), b*Math.sinh(t), sc);
        pts.push(`${sx.toFixed(1)},${sy.toFixed(1)}`);
      }
      return `M${pts[0]} L${pts.slice(1).join(' L')}`;
    };
    const dxL = 24 - ox, dxR = VW - 12 - ox;
    return (
      <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
        {p.show_asymptotes !== false && (<>
          <line x1={24} y1={oy-dxL*slopeV} x2={VW-12} y2={oy-dxR*slopeV} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="5,3"/>
          <line x1={24} y1={oy+dxL*slopeV} x2={VW-12} y2={oy+dxR*slopeV} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="5,3"/>
        </>)}
        {axes}
        <path d={branch(1)} fill="none" stroke="#6366f1" strokeWidth="2"/>
        <path d={branch(-1)} fill="none" stroke="#6366f1" strokeWidth="2"/>
        {p.show_focus !== false && (<>
          <circle cx={f1x} cy={focY} r="4" fill="#2563eb"/><circle cx={f2x} cy={focY} r="4" fill="#2563eb"/>
          <text x={f1x} y={focY+16} fill="#2563eb" fontSize="11" fontWeight="600" textAnchor="middle">{lbl.f1 ?? '(-c,0)'}</text>
          <text x={f2x} y={focY+16} fill="#2563eb" fontSize="11" fontWeight="600" textAnchor="middle">{lbl.f2 ?? '(c,0)'}</text>
        </>)}
        {lbl.equation && <text x={VW-16} y={38} fill="#6366f1" fontSize="12" fontWeight="600" textAnchor="end">{lbl.equation}</text>}
      </svg>
    );
  }

  // parabola (default)
  const a = +(p.a ?? 2);
  const sc = Math.min(60 / a, 28);
  const focX = ox + a*sc, dirX = ox - a*sc;
  const paraPts: string[] = [];
  for (let t = -3.4; t <= 3.4; t += 0.1) {
    const [sx, sy] = toS(t*t / (4*a), t, sc);
    paraPts.push(`${sx.toFixed(1)},${sy.toFixed(1)}`);
  }
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      {p.show_directrix !== false && (<>
        <line x1={dirX} y1={22} x2={dirX} y2={VH-22} stroke="#dc2626" strokeWidth="1.2" strokeDasharray="5,3"/>
        <text x={dirX-6} y={34} fill="#dc2626" fontSize="10" textAnchor="end">{lbl.directrix ?? 'x = −a'}</text>
      </>)}
      <Arr x1={28} y1={oy} x2={VW-12} y2={oy} color="#94a3b8" sw={1.5}/>
      <Arr x1={ox} y1={VH-16} x2={ox} y2={14} color="#94a3b8" sw={1.5}/>
      <text x={VW-10} y={oy+14} fill="#94a3b8" fontSize="11">x</text>
      <text x={ox+6} y={20} fill="#94a3b8" fontSize="11">y</text>
      <text x={ox-12} y={oy+14} fill="#94a3b8" fontSize="10">O</text>
      <path d={`M${paraPts[0]} L${paraPts.slice(1).join(' L')}`} fill="none" stroke="#6366f1" strokeWidth="2"/>
      {p.show_focus !== false && (<>
        <circle cx={focX} cy={oy} r="4" fill="#2563eb"/>
        <text x={focX+8} y={oy-8} fill="#2563eb" fontSize="11" fontWeight="600">{lbl.focus ?? 'F(a,0)'}</text>
      </>)}
      {lbl.equation && <text x={VW-16} y={86} fill="#6366f1" fontSize="12" fontWeight="600" textAnchor="end">{lbl.equation}</text>}
    </svg>
  );
}

/* ── TEMPLATE 14: Argand Plane ───────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ArgandPlane({ p }: { p: any }) {
  const pts: Array<{re:number;im:number;label?:string;show_modulus?:boolean;show_argument?:boolean}> = p.points ?? [];
  const VW = 380, VH = 280, ox = VW/2, oy = VH/2;
  const allRe = pts.map(pt => Math.abs(pt.re)), allIm = pts.map(pt => Math.abs(pt.im));
  const maxRe = Math.max(1, ...allRe) * 1.4, maxIm = Math.max(1, ...allIm) * 1.4;
  const PAD = 46;
  const sc = Math.min((VW/2 - PAD) / maxRe, (VH/2 - PAD) / maxIm, 42);
  const toS = (re: number, im: number): [number,number] => [ox + re*sc, oy - im*sc];
  const reMax = Math.ceil(maxRe / 1.4), imMax = Math.ceil(maxIm / 1.4);

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      <Arr x1={PAD-8} y1={oy} x2={VW-PAD+8} y2={oy} color="#94a3b8" sw={1.5}/>
      <Arr x1={ox} y1={VH-PAD+8} x2={ox} y2={PAD-8} color="#94a3b8" sw={1.5}/>
      <text x={VW-PAD+12} y={oy+4} fill="#94a3b8" fontSize="11">Re</text>
      <text x={ox+6} y={PAD-12} fill="#94a3b8" fontSize="11">Im</text>
      {Array.from({length:reMax*2+1},(_,i)=>i-reMax).filter(n=>n!==0).map(n => (
        <g key={`r${n}`}>
          <line x1={ox+n*sc} y1={oy-3} x2={ox+n*sc} y2={oy+3} stroke="#94a3b8" strokeWidth="1"/>
          <text x={ox+n*sc} y={oy+14} fill="#94a3b8" fontSize="9" textAnchor="middle">{n}</text>
        </g>
      ))}
      {Array.from({length:imMax*2+1},(_,i)=>i-imMax).filter(n=>n!==0).map(n => (
        <g key={`i${n}`}>
          <line x1={ox-3} y1={oy-n*sc} x2={ox+3} y2={oy-n*sc} stroke="#94a3b8" strokeWidth="1"/>
          <text x={ox-8} y={oy-n*sc+4} fill="#94a3b8" fontSize="9" textAnchor="end">{n}i</text>
        </g>
      ))}
      {pts.map((pt, i) => {
        const [sx, sy] = toS(pt.re, pt.im);
        const angR = Math.atan2(pt.im, pt.re);
        const modLen = Math.sqrt(pt.re**2 + pt.im**2) * sc;
        const arcRadius = Math.min(modLen * 0.32, 30);
        return (
          <g key={i}>
            {pt.show_modulus !== false && <line x1={ox} y1={oy} x2={sx} y2={sy} stroke="#6366f1" strokeWidth="1.3" strokeDasharray="4,2"/>}
            {pt.show_argument !== false && Math.sqrt(pt.re**2+pt.im**2) > 0.01 && (
              <path d={`M ${ox+arcRadius},${oy} A ${arcRadius},${arcRadius} 0 0,${pt.im>=0?0:1} ${(ox+arcRadius*Math.cos(angR)).toFixed(1)},${(oy-arcRadius*Math.sin(angR)).toFixed(1)}`}
                fill="none" stroke="#d97706" strokeWidth="1.2"/>
            )}
            <line x1={sx} y1={sy} x2={sx} y2={oy} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,2"/>
            <line x1={sx} y1={sy} x2={ox} y2={sy} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,2"/>
            <circle cx={sx} cy={sy} r="4.5" fill="#2563eb" stroke="white" strokeWidth="1.5"/>
            {pt.label && <text x={sx+(pt.re>=0?10:-10)} y={sy+(pt.im>=0?-9:14)} fill="#2563eb" fontSize="12" fontWeight="600" textAnchor={pt.re>=0?'start':'end'}>{pt.label}</text>}
          </g>
        );
      })}
    </svg>
  );
}

/* ── TEMPLATE 15: Molecular Geometry (VSEPR) ─────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MolecGeometry({ p }: { p: any }) {
  const shape = (p.shape ?? 'tetrahedral').toLowerCase().replace(/[-\s]/g, '_');
  const central = p.central_atom ?? 'X';
  const ligs: Array<{label?:string}> = p.ligands ?? [];
  const lbl = p.labels ?? {};
  const VW = 380, VH = 230, cx = 190, cy = 118, BL = 72;

  const solidLine = (x1:number,y1:number,x2:number,y2:number) =>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#374151" strokeWidth="2" strokeLinecap="round"/>;
  const wedge = (fx:number,fy:number,tx:number,ty:number) => {
    const dx=tx-fx,dy=ty-fy,len=Math.sqrt(dx**2+dy**2)||1;
    const nx=-dy/len,ny=dx/len,W=5.5;
    return <polygon points={`${fx},${fy} ${tx+nx*W},${ty+ny*W} ${tx-nx*W},${ty-ny*W}`} fill="#374151"/>;
  };
  const dashed = (x1:number,y1:number,x2:number,y2:number) =>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeDasharray="5,3"/>;

  const ligAtom = (x:number,y:number,idx:number) => {
    const label = ligs[idx]?.label ?? `X${idx+1}`;
    const color = /^O/.test(label)?'#dc2626':/^N/.test(label)?'#2563eb':/^H/.test(label)?'#94a3b8':
                  /^C[lL]/.test(label)?'#16a34a':/^B[r]/.test(label)?'#92400e':'#374151';
    return (<g key={idx}>
      <circle cx={x} cy={y} r="14" fill="white" stroke={color} strokeWidth="1.8"/>
      <text x={x} y={y+5} textAnchor="middle" fill={color} fontSize="12" fontWeight="700">{label}</text>
    </g>);
  };
  const centralAtomEl = (
    <g><circle cx={cx} cy={cy} r="17" fill="white" stroke="#374151" strokeWidth="2"/>
       <text x={cx} y={cy+5} textAnchor="middle" fill="#374151" fontSize="13" fontWeight="700">{central}</text>
    </g>
  );
  const angleLbl = lbl.bond_angle;

  if (shape === 'linear') {
    const L = BL*1.05;
    return <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      {solidLine(cx,cy,cx-L,cy)}{solidLine(cx,cy,cx+L,cy)}
      {ligAtom(cx-L,cy,0)}{ligAtom(cx+L,cy,1)}{centralAtomEl}
      {angleLbl && <text x={cx} y={cy-28} fill="#6366f1" fontSize="12" textAnchor="middle" fontWeight="600">{angleLbl}</text>}
    </svg>;
  }
  if (shape === 'bent') {
    const ang = +(p.bond_angle ?? 104.5), h = ang/2 * Math.PI/180;
    const l1 = [cx-BL*Math.sin(h), cy+BL*Math.cos(h)], l2 = [cx+BL*Math.sin(h), cy+BL*Math.cos(h)];
    return <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      {solidLine(cx,cy,l1[0]!,l1[1]!)}{solidLine(cx,cy,l2[0]!,l2[1]!)}
      {ligAtom(l1[0]!,l1[1]!,0)}{ligAtom(l2[0]!,l2[1]!,1)}{centralAtomEl}
      {(() => {
        // Arc endpoints are on the bond directions at arcR2 from central atom
        const arcR2 = 26;
        const pa2 = Math.atan2(BL*Math.cos(h), BL*Math.sin(h));  // direction to l2
        const pa1 = Math.atan2(BL*Math.cos(h), -BL*Math.sin(h)); // direction to l1
        const axS = +(cx + arcR2*Math.cos(pa2)).toFixed(1), ayS = +(cy + arcR2*Math.sin(pa2)).toFixed(1);
        const axE = +(cx + arcR2*Math.cos(pa1)).toFixed(1), ayE = +(cy + arcR2*Math.sin(pa1)).toFixed(1);
        return <path d={`M ${axS},${ayS} A ${arcR2},${arcR2} 0 0,1 ${axE},${ayE}`} fill="none" stroke="#6366f1" strokeWidth="1.2"/>;
      })()}
      <text x={cx} y={cy+44} fill="#6366f1" fontSize="11" textAnchor="middle" fontWeight="600">{angleLbl ?? `${ang}°`}</text>
    </svg>;
  }
  if (shape === 'trigonal_planar') {
    const pos = [270,30,150].map(d => [cx+BL*Math.cos(d*Math.PI/180), cy+BL*Math.sin(d*Math.PI/180)]);
    return <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      {pos.map((q) => solidLine(cx,cy,q[0]!,q[1]!))}
      {pos.map((q,i) => ligAtom(q[0]!,q[1]!,i))}{centralAtomEl}
      {angleLbl && <text x={cx+BL*0.6} y={cy-18} fill="#6366f1" fontSize="11" fontWeight="600">{angleLbl}</text>}
    </svg>;
  }
  if (shape === 'octahedral') {
    const pos = [[cx,cy-BL],[cx,cy+BL],[cx-BL,cy],[cx+BL,cy]];
    const fr = [cx+BL*0.62,cy+BL*0.62], bk = [cx-BL*0.62,cy-BL*0.62];
    return <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      {pos.map((q) => solidLine(cx,cy,q[0]!,q[1]!))}
      {wedge(cx,cy,fr[0]!,fr[1]!)}{dashed(cx,cy,bk[0]!,bk[1]!)}
      {pos.map((q,i) => ligAtom(q[0]!,q[1]!,i))}
      {ligAtom(fr[0]!,fr[1]!,4)}{ligAtom(bk[0]!,bk[1]!,5)}{centralAtomEl}
      {angleLbl && <text x={cx+BL+24} y={cy+4} fill="#6366f1" fontSize="11" fontWeight="600" dominantBaseline="middle">{angleLbl}</text>}
    </svg>;
  }
  // tetrahedral (default) and trigonal_bipyramidal
  if (shape === 'trigonal_bipyramidal') {
    const eqPos = [0,120,240].map(d => [cx+BL*Math.cos(d*Math.PI/180), cy+BL*Math.sin(d*Math.PI/180)]);
    const axT = [cx, cy-BL], axB = [cx, cy+BL];
    return <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      {eqPos.map((q) => solidLine(cx,cy,q[0]!,q[1]!))}
      {solidLine(cx,cy,axT[0]!,axT[1]!)}{solidLine(cx,cy,axB[0]!,axB[1]!)}
      {eqPos.map((q,i) => ligAtom(q[0]!,q[1]!,i))}
      {ligAtom(axT[0]!,axT[1]!,3)}{ligAtom(axB[0]!,axB[1]!,4)}{centralAtomEl}
      {angleLbl && <text x={cx+BL+18} y={cy+30} fill="#6366f1" fontSize="11" fontWeight="600">{angleLbl}</text>}
    </svg>;
  }
  // tetrahedral
  const top = [cx, cy-BL*0.88], bot = [cx, cy+BL*0.88], left = [cx-BL*0.88,cy], right = [cx+BL*0.88,cy];
  return <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
    {solidLine(cx,cy,left[0]!,left[1]!)}{solidLine(cx,cy,right[0]!,right[1]!)}
    {wedge(cx,cy,bot[0]!,bot[1]!)}{dashed(cx,cy,top[0]!,top[1]!)}
    {ligAtom(left[0]!,left[1]!,0)}{ligAtom(right[0]!,right[1]!,1)}{ligAtom(bot[0]!,bot[1]!,2)}{ligAtom(top[0]!,top[1]!,3)}{centralAtomEl}
    {angleLbl && <text x={cx+52} y={cy+30} fill="#6366f1" fontSize="11" fontWeight="600">{angleLbl ?? '109.5°'}</text>}
  </svg>;
}

/* ── TEMPLATE 16: MO Diagram ─────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MoDiagram({ p }: { p: any }) {
  const molRaw = (p.molecule ?? 'N2');
  const mol = molRaw.replace(/₂/g,'2').replace(/⁺/g,'+').replace(/⁻/g,'-').toUpperCase();

  type MOLevel = { label:string; ab:boolean; deg:boolean; cap:number };
  const lt7Levels: MOLevel[] = [
    {label:'σ(2s)', ab:false,deg:false,cap:2},{label:'σ*(2s)',ab:true, deg:false,cap:2},
    {label:'π(2p)', ab:false,deg:true, cap:4},{label:'σ(2p)', ab:false,deg:false,cap:2},
    {label:'π*(2p)',ab:true, deg:true, cap:4},{label:'σ*(2p)',ab:true, deg:false,cap:2},
  ];
  const gt7Levels: MOLevel[] = [
    {label:'σ(2s)', ab:false,deg:false,cap:2},{label:'σ*(2s)',ab:true, deg:false,cap:2},
    {label:'σ(2p)', ab:false,deg:false,cap:2},{label:'π(2p)', ab:false,deg:true, cap:4},
    {label:'π*(2p)',ab:true, deg:true, cap:4},{label:'σ*(2p)',ab:true, deg:false,cap:2},
  ];
  const molDb: Record<string,{order:'lt7'|'gt7';val:number}> = {
    'LI2':{order:'lt7',val:2},'BE2':{order:'lt7',val:4},'B2':{order:'lt7',val:6},
    'C2':{order:'lt7',val:8},'N2':{order:'lt7',val:10},'N2+':{order:'lt7',val:9},
    'O2':{order:'gt7',val:12},'O2+':{order:'gt7',val:11},'O2-':{order:'gt7',val:13},
    'F2':{order:'gt7',val:14},'NE2':{order:'gt7',val:16},
    'NO':{order:'gt7',val:11},'CO':{order:'lt7',val:10},'CN-':{order:'lt7',val:10},
  };
  const mdata = molDb[mol] ?? {order:'lt7' as const, val:+(p.valence_electrons ?? 10)};
  const levels = mdata.order === 'lt7' ? lt7Levels : gt7Levels;
  let rem = mdata.val;
  const filled = levels.map(lv => { const e=Math.min(rem,lv.cap); rem-=e; return e; });

  let bonding = 0, antibonding = 0;
  levels.forEach((lv,i) => { if(lv.ab) antibonding+=filled[i]!; else bonding+=filled[i]!; });
  const bo = (bonding - antibonding) / 2;
  let unpaired = 0;
  // Hund's rule: degenerate pair with e electrons → min(e,4-e) unpaired (handles e=2→2 unpaired for O2/B2)
  levels.forEach((lv,i) => { if(lv.deg){ const e=filled[i]!; unpaired+=Math.min(e,4-e); } else if(filled[i]===1) unpaired++; });

  const VW=380, VH=290;
  const lx=68, rx=306, cx2=VW/2;
  const dlx=(lx+cx2-14)/2, drx=(cx2+14+rx)/2;
  const ys=[264,228,192,158,122,90] as const;
  const abC='#dc2626', bC='#374151';

  const arrowUp = (x:number,y:number,c:string='#2563eb') => (
    <g><line x1={x} y1={y} x2={x} y2={y-14} stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
       <polyline points={`${x-4},${y-9} ${x},${y-15} ${x+4},${y-9}`} fill="none" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/></g>
  );
  const arrowDn = (x:number,y:number,c:string='#2563eb') => (
    <g><line x1={x} y1={y-14} x2={x} y2={y} stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
       <polyline points={`${x-4},${y-5} ${x},${y} ${x+4},${y-5}`} fill="none" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/></g>
  );

  const drawEl = (i:number, e:number, deg:boolean) => {
    if (e === 0) return null;
    const y = ys[i]!;
    if (!deg) return (<g key={`e${i}`}>{e>=1&&arrowUp(cx2-8,y)}{e>=2&&arrowDn(cx2+8,y)}</g>);
    // Hund's rule: fill one per orbital first
    const e1 = e<=2 ? Math.min(e,1) : e===3 ? 2 : 2;
    const e2 = e===0?0:e===1?0:e===2?1:e===3?1:2;
    return (<g key={`e${i}`}>
      {e1>=1&&arrowUp(dlx-6,y)}{e1>=2&&arrowDn(dlx+6,y)}
      {e2>=1&&arrowUp(drx-6,y,'#dc2626')}{e2>=2&&arrowDn(drx+6,y,'#dc2626')}
    </g>);
  };

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      <text x={VW/2} y={22} textAnchor="middle" fill="#374151" fontSize="13" fontWeight="700">
        MO Diagram — {molRaw}
      </text>
      {levels.map((lv,i) => {
        const y=ys[i]!, c=lv.ab?abC:bC;
        const dash = lv.ab ? '6,3' : undefined;
        return (<g key={i}>
          {lv.deg ? (<>
            <line x1={lx} y1={y} x2={cx2-14} y2={y} stroke={c} strokeWidth={lv.ab?1.5:2} strokeDasharray={dash}/>
            <line x1={cx2+14} y1={y} x2={rx} y2={y} stroke={c} strokeWidth={lv.ab?1.5:2} strokeDasharray={dash}/>
          </>) : (
            <line x1={lx} y1={y} x2={rx} y2={y} stroke={c} strokeWidth={lv.ab?1.5:2} strokeDasharray={dash}/>
          )}
          <text x={lx-6} y={y+4} fill={c} fontSize="11" fontWeight={lv.ab?'400':'600'} textAnchor="end">{lv.label}</text>
          {drawEl(i,filled[i]!,lv.deg)}
        </g>);
      })}
      <text x={VW-8} y={268} fill="#374151" fontSize="11" textAnchor="end">Bond order = {bo}</text>
      <text x={VW-8} y={284} fill={unpaired>0?'#dc2626':'#16a34a'} fontSize="11" textAnchor="end">
        {unpaired>0?'Paramagnetic':'Diamagnetic'}
      </text>
    </svg>
  );
}

/* ── TEMPLATE 17: Crystal Structure ─────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CrystalStruct({ p }: { p: any }) {
  const type = (p.type ?? 'fcc').toLowerCase();
  const lbl = p.labels ?? {};
  const VW=380, VH=260;
  const cxI=VW/2, cyI=VH*0.54, L=84;
  const c30=0.866, s30=0.5;

  // Isometric projection: gx=right, gy=left, gz=up
  const iso = (gx:number,gy:number,gz:number):[number,number] => [
    cxI + (gx-gy)*c30*L,
    cyI + (gx+gy)*s30*L - gz*L,
  ];

  // All 8 corners
  const corners: Array<[number,number,number]> = [
    [0,0,0],[1,0,0],[0,1,0],[1,1,0],
    [0,0,1],[1,0,1],[0,1,1],[1,1,1],
  ];
  const corSvg = corners.map(([x,y,z]) => iso(x,y,z));

  // Edges: pairs of corner indices
  const edges:[number,number,boolean][] = [ // [i,j,hidden]
    [0,1,true],[0,2,true],[0,4,true],   // hidden edges from (0,0,0)
    [1,3,false],[1,5,false],
    [2,3,false],[2,6,false],
    [3,7,false],
    [4,5,false],[4,6,false],
    [5,7,false],[6,7,false],
  ];

  // Atom positions
  const atomPositions: Array<{pos:[number,number,number];type:string}> = [];
  corners.forEach(([x,y,z]) => atomPositions.push({pos:[x,y,z],type:'corner'}));
  if (type === 'bcc') {
    atomPositions.push({pos:[0.5,0.5,0.5],type:'center'});
  } else if (type === 'fcc') {
    [[0.5,0.5,0],[0.5,0.5,1],[0.5,0,0.5],[0,0.5,0.5],[1,0.5,0.5],[0.5,1,0.5]].forEach(
      ([x,y,z]) => atomPositions.push({pos:[x!,y!,z!],type:'face'})
    );
  } else if (type === 'nacl') {
    // NaCl: Na at body-center + edge centers; Cl at corners + face centers (simplified)
    atomPositions.forEach(a => { a.type = 'Cl'; }); // reassign corners as Cl
    [[0.5,0.5,0.5],[1,0.5,0],[0.5,0,0],[0,0.5,0],[1,0,0.5],[0,0.5,0.5],[0.5,1,0.5],[0.5,0.5,1]].forEach(
      ([x,y,z]) => atomPositions.push({pos:[x!,y!,z!],type:'Na'})
    );
  }

  const atomRadius = (t:string) => t==='corner'?5:t==='center'?8:t==='face'?7:t==='Na'?6:5;
  const atomColor = (t:string) => t==='corner'?'#6366f1':t==='center'?'#2563eb':t==='face'?'#7c3aed':
    t==='Na'?'#2563eb':t==='Cl'?'#dc2626':'#6366f1';
  const atomStroke = (t:string) => t==='corner'||t==='Cl'?'#6366f1':'white';

  const apc = type==='scc'?'1':type==='bcc'?'2':type==='fcc'?'4':type==='nacl'?'4 (NaCl)':'–';
  const typeName = type.toUpperCase().replace('NACL','NaCl');

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      <text x={VW/2} y={20} textAnchor="middle" fill="#374151" fontSize="13" fontWeight="700">{lbl.title ?? typeName} Unit Cell</text>
      {edges.map(([i,j,hidden],k) => {
        const [x1,y1]=corSvg[i]!, [x2,y2]=corSvg[j]!;
        return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={hidden?'#cbd5e1':'#475569'} strokeWidth={hidden?1:1.5}
          strokeDasharray={hidden?'5,3':undefined} strokeLinecap="round"/>;
      })}
      {atomPositions.map(({pos:[gx,gy,gz],type:t},i) => {
        const [sx,sy]=iso(gx,gy,gz);
        return <circle key={i} cx={sx} cy={sy} r={atomRadius(t)} fill={atomColor(t)} stroke={atomStroke(t)} strokeWidth="1.5" opacity="0.9"/>;
      })}
      {(type==='nacl') && (<>
        <circle cx={32} cy={VH-32} r="5" fill="#dc2626" stroke="#6366f1" strokeWidth="1.5"/>
        <text x={44} y={VH-28} fill="#374151" fontSize="10">Cl⁻</text>
        <circle cx={32} cy={VH-18} r="5" fill="#2563eb" stroke="white" strokeWidth="1.5"/>
        <text x={44} y={VH-14} fill="#374151" fontSize="10">Na⁺</text>
      </>)}
      <text x={VW/2} y={VH-8} fill="#64748b" fontSize="10" textAnchor="middle">
        {lbl.formula ?? ''} {apc} atom{apc==='1'?'':'s'}/cell
      </text>
    </svg>
  );
}

/* ── TEMPLATE 18: Electrochemical Cell ──────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ElectrochemCell({ p }: { p: any }) {
  const lbl = p.labels ?? {};
  const anodeMetal  = p.anode?.metal  ?? 'Zn';
  const cathodeMetal= p.cathode?.metal ?? 'Cu';
  const anodeElec   = p.anode?.electrolyte  ?? `${anodeMetal}SO₄`;
  const cathodeElec = p.cathode?.electrolyte ?? `${cathodeMetal}SO₄`;
  const emf = p.emf ?? '';
  const VW=440, VH=260;
  // lbY=96: beaker starts at 96, salt bridge at 96-32=64, electrode labels at 64-10=54
  // wireY=22: wire across the top, voltmeter circle at y=22
  const lbX=36,lbY=96,lbW=128,lbH=136;
  const rbX=276,rbY=96,rbW=128,rbH=136;
  const aX=lbX+lbW*0.44, cX=rbX+rbW*0.56;
  const wireY=20, sbBridgeY=lbY-32;
  const vmX=VW/2;

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      {/* External wire */}
      <polyline points={`${aX},${lbY-20} ${aX},${wireY} ${cX},${wireY} ${cX},${rbY-20}`}
        fill="none" stroke="#374151" strokeWidth="1.8" strokeLinejoin="round"/>
      {/* Voltmeter */}
      <circle cx={vmX} cy={wireY} r="14" fill="white" stroke="#374151" strokeWidth="1.5"/>
      <text x={vmX} y={wireY+5} textAnchor="middle" fill="#374151" fontSize="11" fontWeight="700">{emf||'V'}</text>
      {/* Electron arrows on wire */}
      <Arr x1={aX+14} y1={wireY} x2={vmX-18} y2={wireY} color="#374151" sw={1.4}/>
      <Arr x1={vmX+18} y1={wireY} x2={cX-14} y2={wireY} color="#374151" sw={1.4}/>
      <text x={(aX+vmX)/2} y={wireY-9} fill="#374151" fontSize="9" textAnchor="middle">e⁻</text>
      {/* Salt bridge (U-shape tube) */}
      <polyline points={`${lbX+lbW/2},${lbY} ${lbX+lbW/2},${sbBridgeY} ${rbX+rbW/2},${sbBridgeY} ${rbX+rbW/2},${rbY}`}
        fill="none" stroke="#94a3b8" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points={`${lbX+lbW/2},${lbY} ${lbX+lbW/2},${sbBridgeY} ${rbX+rbW/2},${sbBridgeY} ${rbX+rbW/2},${rbY}`}
        fill="none" stroke="#f1f5f9" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <text x={VW/2} y={sbBridgeY-8} fill="#64748b" fontSize="9" textAnchor="middle">Salt Bridge</text>
      {/* Left beaker (anode) */}
      <rect x={lbX} y={lbY} width={lbW} height={lbH} fill="rgba(219,234,254,0.35)" stroke="#374151" strokeWidth="1.8" rx="2"/>
      <line x1={aX} y1={lbY-20} x2={aX} y2={lbY+lbH-6} stroke="#374151" strokeWidth="5" strokeLinecap="round"/>
      <text x={aX} y={sbBridgeY-12} fill="#dc2626" fontSize="9" fontWeight="700" textAnchor="middle">Anode (−)</text>
      <text x={aX} y={lbY+lbH-10} fill="white" fontSize="10" fontWeight="700" textAnchor="middle">{anodeMetal}</text>
      <text x={lbX+lbW/2} y={lbY+62} fill="#1d4ed8" fontSize="11" textAnchor="middle" fontWeight="600">{anodeElec}</text>
      <text x={lbX+lbW/2} y={lbY+78} fill="#1d4ed8" fontSize="10" textAnchor="middle">(aq)</text>
      {lbl.anode_rxn && <text x={lbX+lbW/2} y={lbY+lbH+16} fill="#374151" fontSize="9" textAnchor="middle">{lbl.anode_rxn}</text>}
      {!lbl.anode_rxn && <text x={lbX+lbW/2} y={lbY+lbH+16} fill="#94a3b8" fontSize="9" textAnchor="middle">oxidation</text>}
      {/* Right beaker (cathode) */}
      <rect x={rbX} y={rbY} width={rbW} height={rbH} fill="rgba(220,252,231,0.35)" stroke="#374151" strokeWidth="1.8" rx="2"/>
      <line x1={cX} y1={rbY-20} x2={cX} y2={rbY+rbH-6} stroke="#b45309" strokeWidth="5" strokeLinecap="round"/>
      <text x={cX} y={sbBridgeY-12} fill="#16a34a" fontSize="9" fontWeight="700" textAnchor="middle">Cathode (+)</text>
      <text x={cX} y={rbY+rbH-10} fill="white" fontSize="10" fontWeight="700" textAnchor="middle">{cathodeMetal}</text>
      <text x={rbX+rbW/2} y={rbY+62} fill="#15803d" fontSize="11" textAnchor="middle" fontWeight="600">{cathodeElec}</text>
      <text x={rbX+rbW/2} y={rbY+78} fill="#15803d" fontSize="10" textAnchor="middle">(aq)</text>
      {lbl.cathode_rxn && <text x={rbX+rbW/2} y={rbY+rbH+16} fill="#374151" fontSize="9" textAnchor="middle">{lbl.cathode_rxn}</text>}
      {!lbl.cathode_rxn && <text x={rbX+rbW/2} y={rbY+rbH+16} fill="#94a3b8" fontSize="9" textAnchor="middle">reduction</text>}
    </svg>
  );
}

/* ── TEMPLATE 19: Organic Structure (SmilesDrawer) ──────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function OrganicStruct({ p }: { p: any }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const smiles: string = p.smiles ?? 'c1ccccc1';
  const label: string = p.label ?? '';
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    import('smiles-drawer').then((mod: any) => {
      if (!active || !canvasRef.current) return;
      try {
        const Lib = mod.default ?? mod;
        const DrawerClass = Lib.SmilesDrawer ?? Lib;
        const parseFunc = (Lib.parse ?? Lib.SmilesDrawer?.parse) as
          ((s:string, ok:(t:unknown)=>void, err:(e:unknown)=>void)=>void) | undefined;
        if (!DrawerClass || !parseFunc) { setFailed(true); return; }
        const drawer = new DrawerClass({
          width: 380, height: 200, bondThickness: 1.2,
          shortBondWidth: 0.85, compactDrawing: true,
          themes: {
            light: {
              C:'#374151',O:'#dc2626',N:'#2563eb',S:'#d97706',
              P:'#7c3aed',F:'#16a34a',Cl:'#16a34a',Br:'#92400e',
              I:'#7c3aed',H:'#94a3b8',BACKGROUND:'#fafafa',
            }
          }
        });
        parseFunc.call(Lib, smiles,
          (tree: unknown) => { if (active && canvasRef.current) drawer.draw(tree, canvasRef.current, 'light', false); },
          (err: unknown) => { console.warn('[SmilesDrawer]', err); if (active) setFailed(true); }
        );
      } catch (e) { console.warn('[SmilesDrawer init]', e); if (active) setFailed(true); }
    }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [smiles]);

  return (
    <div style={{textAlign:'center'}}>
      {failed ? (
        <div style={{padding:'24px 16px',border:'1px solid #e5e7eb',borderRadius:6,background:'#f9fafb'}}>
          <div style={{fontFamily:'monospace',fontSize:12,color:'#374151',letterSpacing:'0.02em'}}>{smiles}</div>
          <div style={{marginTop:6,fontSize:11,color:'#6b7280'}}>Structural formula (SMILES)</div>
          {label && <div style={{marginTop:4,fontSize:12,color:'#374151',fontWeight:600}}>{label}</div>}
        </div>
      ) : (
        <>
          <canvas ref={canvasRef} width={380} height={200} style={{maxWidth:'100%',height:'auto'}}/>
          {label && <p style={{fontSize:12,color:'#475569',margin:'4px 0 0',padding:0}}>{label}</p>}
        </>
      )}
    </div>
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
    case 'inclined_plane':       inner = <InclinedPlane p={p} />;      break;
    case 'simple_circuit':       inner = <SimpleCircuit p={p} />;      break;
    case 'lens_mirror':          inner = <LensMirror p={p} />;         break;
    case 'energy_profile':       inner = <EnergyProfile p={p} />;      break;
    case 'coordinate_geometry':  inner = <CoordGeometry p={p} />;      break;
    case 'projectile_motion':    inner = <ProjectileMotion p={p} />;   break;
    case 'pulley_system':        inner = <PulleySystem p={p} />;       break;
    case 'wave_diagram':         inner = <WaveDiagram p={p} />;        break;
    case 'capacitor_field':      inner = <CapacitorField p={p} />;     break;
    case 'pv_diagram':           inner = <PvDiagram p={p} />;          break;
    case 'triangle':             inner = <TriangleDiagram p={p} />;    break;
    case 'circle_geometry':      inner = <CircleGeom p={p} />;         break;
    case 'conic_section':        inner = <ConicSection p={p} />;       break;
    case 'argand_plane':         inner = <ArgandPlane p={p} />;        break;
    case 'molecular_geometry':   inner = <MolecGeometry p={p} />;      break;
    case 'mo_diagram':           inner = <MoDiagram p={p} />;          break;
    case 'crystal_structure':    inner = <CrystalStruct p={p} />;      break;
    case 'electrochemical_cell': inner = <ElectrochemCell p={p} />;    break;
    case 'organic_structure':    inner = <OrganicStruct p={p} />;      break;
    default: return null;
  }

  return (
    <div style={{
      width: '100%',
      background: '#fafafa',
      border: '1px solid var(--gray-200)',
      borderRadius: 8,
      marginBottom: 16,
      padding: '12px 16px 8px',
    }}>
      {inner}
    </div>
  );
}
