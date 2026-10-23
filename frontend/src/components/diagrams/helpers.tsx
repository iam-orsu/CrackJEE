import React from 'react';

/* ── LaTeX → plain Unicode (for SVG text labels) ──────────── */
export function latexToPlain(s: string): string {
  return s
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2')
    .replace(/\^\{([^}]+)\}/g, (_: string, e: string) => e === '2' ? '²' : e === '3' ? '³' : e === 'n' ? 'ⁿ' : `^${e}`)
    .replace(/\^2/g, '²').replace(/\^3/g, '³').replace(/\^n/g, 'ⁿ')
    .replace(/_\{([^}]*)\}/g, (_, s: string) => s.replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[+d] ?? d).replace(/[a-z]/g, (c) => ({i:'ᵢ',n:'ₙ',a:'ₐ',e:'ₑ',x:'ₓ',k:'ₖ',l:'ₗ',m:'ₘ',p:'ₚ',s:'ₛ',t:'ₜ'}[c] ?? c)))
    .replace(/_([0-9])/g, (_, d: string) => '₀₁₂₃₄₅₆₇₈₉'[+d] ?? d)
    .replace(/_([a-z])/g, (_, c: string) => ({i:'ᵢ',n:'ₙ',a:'ₐ',e:'ₑ',x:'ₓ',k:'ₖ',l:'ₗ',m:'ₘ',p:'ₚ',s:'ₛ',t:'ₜ'}[c] ?? c))
    .replace(/\\pm/g, '±').replace(/\\mp/g, '∓')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)').replace(/\\sqrt/g, '√')
    .replace(/\\cdot/g, '·').replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\leq/g, '≤').replace(/\\geq/g, '≥').replace(/\\neq/g, '≠')
    .replace(/\\infty/g, '∞').replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ')
    .replace(/\\delta/g, 'δ').replace(/\\lambda/g, 'λ').replace(/\\mu/g, 'μ')
    .replace(/\\left[\(\[{|]/g, '').replace(/\\right[\)\]{|]/g, '')
    .replace(/\\[a-zA-Z]+/g, '').replace(/[{}]/g, '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/* ── Arrow helper ──────────────────────────────────────────── */
export function Arr({
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
export function DblArr({ x1, y1, x2, y2, color = '#374151', label, lx, ly }: {
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

