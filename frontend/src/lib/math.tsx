'use client';

import React from 'react';
import katex from 'katex';

const SUB = '₀₁₂₃₄₅₆₇₈₉';
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';

export function ceFormulaToUnicode(f: string): string {
  return f
    .replace(/_\{(\d+)\}/g, (_, n: string) => n.replace(/\d/g, (d) => SUB[+d] ?? d))
    .replace(/_(\d)/g, (_, d: string) => SUB[+d] ?? d)
    .replace(/\^\{(\d+)\}/g, (_, n: string) => n.replace(/\d/g, (d) => SUP[+d] ?? d))
    .replace(/\^(\d)/g, (_, d: string) => SUP[+d] ?? d)
    .replace(/([A-Za-z)])(\d+)/g, (_, ch: string, n: string) => ch + n.replace(/\d/g, (d) => SUB[+d] ?? d))
    .replace(/\\cdot/g, '·')
    .replace(/\*/g, '·');
}

export function preprocessLatex(text: string): string {
  return text
    .replace(/\\ce\s*\{([^}]+)\}/g, (_, f: string) => ceFormulaToUnicode(f))
    .replace(/\\ce\s*([A-Za-z0-9_^{}\-+·*]+)/g, (_, f: string) => ceFormulaToUnicode(f))
    .replace(/\\[,;!]\s*\^\{?\\circ\}?\s*\\text\{([A-Za-z])\}/g, '°$1')
    .replace(/\^\{?\\circ\}?\s*\\text\{([A-Za-z])\}/g, '°$1')
    .replace(/\\[,;!]\s*\^\{?\\circ\}?/g, '°')
    .replace(/\^\{?\\circ\}?/g, '°')
    .replace(/\\degree/g, '°')
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\\[,;!]/g, ' ')
    .replace(/\\Omega/g, 'Ω')
    .replace(/\\mu/g, 'μ')
    .replace(/\\times/g, '×')
    .replace(/\\mathrm\{([^}]*)\}/g, '$1')
    .replace(/\\mathbf\{([^}]*)\}/g, '$1')
    .replace(/\\mathit\{([^}]*)\}/g, '$1')
    .replace(/\\cdotp/g, '·')
    .replace(/\\cdot/g, '·')
    .replace(/\\pm/g, '±');
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderMath(rawText: string): string {
  if (!rawText) return '';

  // No explicit delimiters — apply preprocessLatex on full text, then detect bare LaTeX
  if (!/[$]|\\\(|\\\[/.test(rawText)) {
    const processed = preprocessLatex(rawText);
    if (/\\[a-zA-Z]|[_^]\{/.test(processed)) {
      let start = processed.search(/\\[a-zA-Z]|[_^]\{/);
      while (start > 0 && /[a-zA-Z0-9]/.test(processed[start - 1]!)) start--;
      const pre  = processed.slice(0, start);
      const math = processed.slice(start).trim();
      try {
        return (pre ? escapeHtml(pre) : '') + katex.renderToString(math, { throwOnError: false });
      } catch {
        return escapeHtml(processed);
      }
    }
    return escapeHtml(processed);
  }

  // Text has delimiters: apply preprocessLatex only to non-math segments so KaTeX
  // renders \mu, \times, \Omega, \text{} etc. with proper math fonts.
  const pattern = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g;
  const parts: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(rawText)) !== null) {
    parts.push(escapeHtml(preprocessLatex(rawText.slice(lastIndex, match.index))));
    const raw = match[0]!;
    let display = false;
    let content = raw;
    if (raw.startsWith('$$'))       { display = true;  content = raw.slice(2, -2); }
    else if (raw.startsWith('$'))                     { content = raw.slice(1, -1); }
    else if (raw.startsWith('\\[')) { display = true;  content = raw.slice(2, -2); }
    else if (raw.startsWith('\\('))                   { content = raw.slice(2, -2); }
    try {
      parts.push(katex.renderToString(content.trim(), { displayMode: display, throwOnError: false }));
    } catch {
      parts.push(escapeHtml(raw));
    }
    lastIndex = match.index + raw.length;
  }

  parts.push(escapeHtml(preprocessLatex(rawText.slice(lastIndex))));
  return parts.join('');
}

export const renderMathHtml = renderMath;

export function MathText({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: renderMath(text) }}
    />
  );
}

export function stripOptionPrefix(opt: string): string {
  return opt.replace(/^[A-Da-d][).]\s*/, '').trim();
}
