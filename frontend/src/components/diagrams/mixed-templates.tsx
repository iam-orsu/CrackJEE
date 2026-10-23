import React from 'react';
import { Arr, latexToPlain } from './helpers';
import type { CapacitorFieldParams, CoordGeometryParams, EnergyProfileParams, ProjectileMotionParams, PulleySystemParams, PvDiagramParams, WaveDiagramParams } from './types';

/* ── TEMPLATE 4: Energy Profile ─────────────────────────────── */
export function EnergyProfile({ p }: { p: EnergyProfileParams }) {
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
        textAnchor="middle" dominantBaseline="middle">{latexToPlain(lbl.ea ?? 'Ea')}</text>

      {reactY !== prodY && (
        <>
          <line x1={dhX} y1={reactY} x2={dhX} y2={prodY} stroke="#374151" strokeWidth="1" strokeDasharray="2,2" />
          <line x1={dhX - 5} y1={reactY} x2={dhX + 5} y2={reactY} stroke="#374151" strokeWidth="1.2" />
          <line x1={dhX - 5} y1={prodY}  x2={dhX + 5} y2={prodY}  stroke="#374151" strokeWidth="1.2" />
          <text x={dhX + 16} y={(reactY + prodY) / 2} fill="#374151" fontSize="11"
            textAnchor="middle" dominantBaseline="middle">{latexToPlain(lbl.delta_h ?? 'ΔH')}</text>
        </>
      )}
    </svg>
  );
}

/* ── TEMPLATE 5: Coordinate Geometry ────────────────────────── */
export function CoordGeometry({ p }: { p: CoordGeometryParams }) {
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
        line.arrow === true ? (
          <Arr key={i} x1={sx(line.from[0])} y1={sy(line.from[1])}
            x2={sx(line.to[0])} y2={sy(line.to[1])} color="#334155" label={line.label ? latexToPlain(line.label) : undefined} />
        ) : (
          <g key={i}>
            <line x1={sx(line.from[0])} y1={sy(line.from[1])}
              x2={sx(line.to[0])} y2={sy(line.to[1])}
              stroke="#334155" strokeWidth="1.5"
              strokeDasharray={line.dashed ? '5,3' : undefined} />
            {line.label && (
              <text x={(sx(line.from[0]) + sx(line.to[0])) / 2 + 8}
                y={(sy(line.from[1]) + sy(line.to[1])) / 2 - 7}
                fill="#334155" fontSize="12" fontWeight="600">{latexToPlain(line.label)}</text>
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
              fill="#6366f1" fontSize="12" fontWeight="600" dominantBaseline="middle">{latexToPlain(c.label)}</text>
          )}
        </g>
      ))}
      {(p.points ?? []).map((pt: GPoint, i: number) => (
        <g key={i}>
          <circle cx={sx(pt.x)} cy={sy(pt.y)} r="4.5" fill="#2563eb" stroke="white" strokeWidth="1.5" />
          {pt.label && (
            <text x={sx(pt.x) + 9} y={sy(pt.y) - 7}
              fill="#2563eb" fontSize="12" fontWeight="600">{latexToPlain(pt.label)}</text>
          )}
        </g>
      ))}
    </svg>
  );
}

/* ── TEMPLATE 6: Projectile Motion ──────────────────────────── */
export function ProjectileMotion({ p }: { p: ProjectileMotionParams }) {
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
        {latexToPlain(lbl.angle ?? `${angle}°`)}
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
export function PulleySystem({ p }: { p: PulleySystemParams }) {
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
            textAnchor="end" dominantBaseline="middle">{latexToPlain(lbl.tension)}</text>
          <text x={rightX + 14} y={(ropeY + m2Y - boxH / 2) / 2} fill="#374151" fontSize="11"
            textAnchor="start" dominantBaseline="middle">{latexToPlain(lbl.tension)}</text>
        </>
      )}

      {/* Acceleration arrows: m1 downward (below box), m2 upward (above box) */}
      <Arr x1={leftX}  y1={m1Y + boxH / 2}      x2={leftX}  y2={m1Y + boxH / 2 + 28}
        color="#dc2626" label={latexToPlain(lbl.accel ?? 'a')} lx={leftX + 18} ly={m1Y + boxH / 2 + 24} sw={1.5} />
      <Arr x1={rightX} y1={m2Y - boxH / 2}      x2={rightX} y2={m2Y - boxH / 2 - 28}
        color="#16a34a" label={latexToPlain(lbl.accel ?? 'a')} lx={rightX + 18} ly={m2Y - boxH / 2 - 24} sw={1.5} />
    </svg>
  );
}

/* ── TEMPLATE 8: Wave Diagram ────────────────────────────────── */
export function WaveDiagram({ p }: { p: WaveDiagramParams }) {
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
              {latexToPlain(lbl.amplitude)}
            </text>
          </>
        )}

        {lbl.wavelength && nodeXs.length >= 3 && (
          <>
            <line x1={nodeXs[0]!} y1={axY + 28} x2={nodeXs[2]!} y2={axY + 28} stroke="#374151" strokeWidth="1.5" />
            <polygon points={`${nodeXs[0]},${axY+28} ${nodeXs[0]!+8},${axY+24} ${nodeXs[0]!+8},${axY+32}`} fill="#374151" />
            <polygon points={`${nodeXs[2]},${axY+28} ${nodeXs[2]!-8},${axY+24} ${nodeXs[2]!-8},${axY+32}`} fill="#374151" />
            <text x={(nodeXs[0]! + nodeXs[2]!) / 2} y={axY + 40}
              fill="#374151" fontSize="11" fontWeight="600" textAnchor="middle">{latexToPlain(lbl.wavelength)}</text>
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
        {latexToPlain(lbl.amplitude ?? 'A')}
      </text>

      {/* Wavelength bracket */}
      <line x1={x0} y1={axY + 30} x2={x0 + λPx} y2={axY + 30} stroke="#374151" strokeWidth="1.5" />
      <polygon points={`${x0},${axY+30} ${x0+8},${axY+26} ${x0+8},${axY+34}`} fill="#374151" />
      <polygon points={`${x0+λPx},${axY+30} ${x0+λPx-8},${axY+26} ${x0+λPx-8},${axY+34}`} fill="#374151" />
      <text x={x0 + λPx / 2} y={axY + 42}
        fill="#374151" fontSize="11" fontWeight="600" textAnchor="middle">
        {latexToPlain(lbl.wavelength ?? 'λ')}
      </text>

      {/* Wave velocity label */}
      {lbl.velocity && (
        <Arr x1={x0 + λPx * 0.6} y1={axY - 10} x2={x0 + λPx * 0.6 + 32} y2={axY - 10}
          color="#dc2626" label={lbl.velocity ? latexToPlain(lbl.velocity) : undefined} lx={x0 + λPx * 0.6 + 48} ly={axY - 10} />
      )}
    </svg>
  );
}

/* ── TEMPLATE 9: Capacitor / Electric Field ─────────────────── */
export function CapacitorField({ p }: { p: CapacitorFieldParams }) {
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
        {latexToPlain(lbl.charge_left ?? '+Q')}
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
        {latexToPlain(lbl.charge_right ?? '−Q')}
      </text>

      {/* Electric field arrows */}
      {fieldYs.map((fy, i) => (
        <Arr key={i} x1={leftX + 8} y1={fy} x2={rightX - 8} y2={fy} color="#475569" sw={1.5} />
      ))}

      {/* E label above field */}
      <text x={(leftX + rightX) / 2} y={plateCY - plateH / 2 - 12}
        fill="#475569" fontSize="12" fontWeight="600" textAnchor="middle">
        {latexToPlain(lbl.field ?? 'E →')}
      </text>

      {/* Plate separation d */}
      {lbl.separation && (
        <>
          <line x1={leftX} y1={plateBot + 16} x2={rightX} y2={plateBot + 16} stroke="#374151" strokeWidth="1.5" />
          <polygon points={`${leftX},${plateBot+16} ${leftX+8},${plateBot+12} ${leftX+8},${plateBot+20}`} fill="#374151" />
          <polygon points={`${rightX},${plateBot+16} ${rightX-8},${plateBot+12} ${rightX-8},${plateBot+20}`} fill="#374151" />
          <text x={(leftX + rightX) / 2} y={plateBot + 30}
            fill="#374151" fontSize="11" fontWeight="600" textAnchor="middle">
            {latexToPlain(lbl.separation)}
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
              fill="#374151" fontSize="11" textAnchor="middle">{latexToPlain(lbl.voltage)}</text>
          )}
        </g>
      )}
    </svg>
  );
}

/* ── TEMPLATE 10: P-V Diagram ────────────────────────────────── */
export function PvDiagram({ p }: { p: PvDiagramParams }) {
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
            <text x={x + (i < 2 ? 8 : i === 3 ? -22 : -14)} y={y + (i === 3 ? 14 : -6)} fill="#374151" fontSize="11" fontWeight="600">
              {['A','B','C','D'][i]}
            </text>
          </g>
        ))}

        {/* Labels */}
        <text x={165} y={68} fill="#dc2626" fontSize="10" textAnchor="middle">
          {latexToPlain(lbl.t_hot ?? 'T₁ (hot)')}
        </text>
        <text x={210} y={165} fill="#2563eb" fontSize="10" textAnchor="middle">
          {latexToPlain(lbl.t_cold ?? 'T₂ (cold)')}
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
          {latexToPlain(lbl.process)}
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

