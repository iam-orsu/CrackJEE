import React from 'react';
import { Arr, latexToPlain } from './helpers';
import type { InclinedPlaneParams, LensMirrorParams, SimpleCircuitParams } from './types';

/* ── TEMPLATE 1: Inclined Plane ─────────────────────────────── */
export function InclinedPlane({ p }: { p: InclinedPlaneParams }) {
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
        {latexToPlain(lbl.angle ?? `${angle}°`)}
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
      {/* Applied force: horizontal (rightward) — distinct from friction to avoid overlap */}
      {p.show_applied === true && (
        <Arr x1={bkx} y1={bky} x2={bkx + FL} y2={bky} color="#7c3aed"
          label={lbl.applied ?? 'F'} lx={bkx + FL + 14} ly={bky} />
      )}
    </svg>
  );
}

/* ── TEMPLATE 2: Simple Circuit ─────────────────────────────── */
type CComp = { type?: string; label?: string };

export function compSymbol(
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

export function SimpleCircuit({ p }: { p: SimpleCircuitParams }) {
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
export function LensMirror({ p }: { p: LensMirrorParams }) {
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

      {/* f label — white bg rect so it's legible over any ray */}
      {lbl.f && (() => {
        const fx = isLens ? (lensX + fRx) / 2 : lensX - 30;
        const fy = axisY - 14;
        const tw = lbl.f.length * 6.2 + 8;
        return (
          <g>
            <rect x={fx - tw / 2} y={fy - 11} width={tw} height={15} fill="white" opacity="0.88" rx="2" />
            <text x={fx} y={fy} fill="#475569" fontSize="10" textAnchor="middle">{lbl.f}</text>
          </g>
        );
      })()}

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

