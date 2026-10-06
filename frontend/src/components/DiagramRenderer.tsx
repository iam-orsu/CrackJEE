'use client';

import { useEffect, useRef } from 'react';
import type { DiagramDescriptor, DiagramElement } from '@/types';

/* ── Safe expression evaluator ─────────────────────────────
   Only allows digits, arithmetic operators, and a whitelist
   of Math functions. DeepSeek generates these expressions
   server-side, but we sanitize anyway.
──────────────────────────────────────────────────────────── */
function safeEvalExpr(expr: string, x: number): number {
  if (!expr || typeof expr !== 'string') return 0;
  const clean = expr.replace(/\b(sin|cos|tan|sqrt|abs|log|exp|pi)\b/g, '');
  if (!/^[\d\s+\-*/^().x,eE]+$/.test(clean)) return 0;
  try {
    const normalized = expr
      .replace(/\^/g, '**')
      .replace(/\b(sin|cos|tan|sqrt|abs|log|exp)\b/g, 'Math.$1')
      .replace(/\bpi\b/g, 'Math.PI');
    // eslint-disable-next-line no-new-func
    const fn = new Function('x', `"use strict"; try { return +(${normalized}); } catch(e) { return 0; }`);
    const r = fn(x) as number;
    return Number.isFinite(r) ? r : 0;
  } catch {
    return 0;
  }
}

/* ── JSXGraph element renderer ──────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderElement(board: any, el: DiagramElement): void {
  try {
    const stroke = el.color ?? '#333333';

    switch (el.kind) {
      case 'point': {
        if (!el.coords) return;
        board.create('point', el.coords, {
          name: el.label ?? '',
          withLabel: !!el.label,
          size: 3,
          strokeColor: stroke,
          fillColor: stroke,
          fixed: true,
        });
        break;
      }

      case 'line': {
        if (!el.from || !el.to) return;
        const p1 = board.create('point', el.from, { visible: false, fixed: true });
        const p2 = board.create('point', el.to,   { visible: false, fixed: true });
        const hasArrow = el.arrow && el.arrow !== 'none';
        board.create(hasArrow ? 'arrow' : 'segment', [p1, p2], {
          strokeColor: stroke,
          strokeWidth: 1.8,
          dash: el.dashed ? 2 : 0,
          lastArrow:  (el.arrow === 'end'   || el.arrow === 'both') ? { type: 1, size: 6 } : false,
          firstArrow: (el.arrow === 'start' || el.arrow === 'both') ? { type: 1, size: 6 } : false,
          name: el.label ?? '',
          withLabel: !!el.label,
          fixed: true,
        });
        break;
      }

      case 'circle': {
        if (!el.center || el.radius === undefined) return;
        const cp = board.create('point', el.center, { visible: false, fixed: true });
        board.create('circle', [cp, el.radius], {
          strokeColor: stroke,
          strokeWidth: 1.8,
          fillColor:   el.fill ?? 'transparent',
          fillOpacity: el.fill ? 0.08 : 0,
          name: el.label ?? '',
          withLabel: !!el.label,
          fixed: true,
        });
        break;
      }

      case 'arc': {
        if (!el.center || el.radius === undefined || el.startAngle === undefined || el.endAngle === undefined) return;
        const ac = board.create('point', el.center, { visible: false, fixed: true });
        const aS = board.create('point', [
          el.center[0] + el.radius * Math.cos(el.startAngle),
          el.center[1] + el.radius * Math.sin(el.startAngle),
        ], { visible: false, fixed: true });
        const aE = board.create('point', [
          el.center[0] + el.radius * Math.cos(el.endAngle),
          el.center[1] + el.radius * Math.sin(el.endAngle),
        ], { visible: false, fixed: true });
        board.create('arc', [ac, aS, aE], {
          strokeColor: stroke,
          strokeWidth: 1.8,
          name: el.label ?? '',
          withLabel: !!el.label,
          fixed: true,
        });
        break;
      }

      case 'angle': {
        if (!el.vertex || !el.arm1 || !el.arm2) return;
        const av  = board.create('point', el.vertex, { visible: false, fixed: true });
        const aa1 = board.create('point', el.arm1,   { visible: false, fixed: true });
        const aa2 = board.create('point', el.arm2,   { visible: false, fixed: true });
        board.create('angle', [aa1, av, aa2], {
          name: el.label ?? '',
          withLabel: !!el.label,
          strokeColor: stroke,
          fillColor:   stroke,
          fillOpacity: 0.12,
          radius: 0.4,
          fixed: true,
        });
        break;
      }

      case 'text': {
        if (!el.coords) return;
        board.create('text', [el.coords[0], el.coords[1], el.content ?? ''], {
          strokeColor: el.color ?? '#333',
          fontSize: el.fontSize ?? 13,
          fixed: true,
        });
        break;
      }

      case 'plot': {
        if (!el.expr) return;
        const capturedExpr = el.expr;
        board.create('functiongraph', [
          (x: number) => safeEvalExpr(capturedExpr, x),
          el.xMin ?? -10,
          el.xMax ?? 10,
        ], {
          strokeColor: stroke,
          strokeWidth: 2,
          fixed: true,
        });
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.warn('[DiagramRenderer] failed to render element:', el.kind, err);
  }
}

/* ── Component ──────────────────────────────────────────── */
interface Props {
  descriptor: DiagramDescriptor;
}

export function DiagramRenderer({ descriptor }: Props) {
  const stableId = useRef(`jxg-${Math.random().toString(36).slice(2, 10)}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const boardRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cancelled = false;

    (async () => {
      try {
        // Dynamically import so Next.js SSR never touches this
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mod = await import('jsxgraph') as any;
        if (cancelled) return;

        // jsxgraph exports JXG in different shapes depending on bundler
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const JXG: any = mod.JXG ?? mod.default?.JXG ?? mod.default;
        if (!JXG?.JSXGraph?.initBoard) {
          console.error('[DiagramRenderer] JXG.JSXGraph not found in module');
          return;
        }

        // Free any previously mounted board on this element
        if (boardRef.current) {
          try { JXG.JSXGraph.freeBoard(boardRef.current); } catch {}
          boardRef.current = null;
        }

        const container = document.getElementById(stableId.current);
        if (!container) return;

        const [xMin, yMax, xMax, yMin] = descriptor.boundingBox;
        const board = JXG.JSXGraph.initBoard(stableId.current, {
          boundingbox: [xMin, yMax, xMax, yMin],
          axis: descriptor.showAxes ?? false,
          showNavigation: false,
          showCopyright: false,
          keepAspectRatio: true,
          pan:  { enabled: false },
          zoom: { enabled: false, factorX: 1, factorY: 1 },
          grid: false,
        });

        boardRef.current = board;

        for (const element of descriptor.elements) {
          renderElement(board, element);
        }
      } catch (err) {
        console.error('[DiagramRenderer] init failed:', err);
      }
    })();

    return () => {
      cancelled = true;
      // Async cleanup — cannot call freeBoard synchronously because JXG is async-imported
      if (boardRef.current) {
        const savedBoard = boardRef.current;
        boardRef.current = null;
        import('jsxgraph').then((mod) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const JXG = (mod as any).JXG ?? (mod as any).default?.JXG ?? (mod as any).default;
          try { JXG?.JSXGraph?.freeBoard(savedBoard); } catch {}
        }).catch(() => {});
      }
    };
  // descriptor reference changes when parent re-renders with a new question
  }, [descriptor]);

  return (
    <div
      id={stableId.current}
      style={{
        width: '100%',
        height: 220,
        borderRadius: 8,
        background: '#fafafa',
        border: '1px solid var(--gray-200)',
        marginBottom: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
    />
  );
}
