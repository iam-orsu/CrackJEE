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

export function sanitizeMathDelimiters(text: string): string {
  if (!text) return '';

  let s = text;

  // 1. Remove dangling trailing LaTeX commands at end of line/text
  // e.g. "= \frac{", "\frac{", "\sqrt{", "= \", etc. where opening brace or command is never finished
  s = s.replace(/\s*(?:[=+\-*/]|\\cdot|\\times)?\s*(?:\\[a-zA-Z]*(?:\s*$|(?:\{[^{}]*\})*\{[^{}]*$)|\\$)/gm, (match) => {
    if (/\{[ \t]*$/.test(match) || /\\[a-zA-Z]+[ \t]*$/.test(match) || /\\$/.test(match)) {
      return '';
    }
    return match;
  });

  // 2. Balance unclosed `{` if there are more `{` than `}` inside an unclosed math block
  // Check \( vs \)
  const openParen = (s.match(/\\\(/g) || []).length;
  const closeParen = (s.match(/\\\)/g) || []).length;
  if (openParen > closeParen) {
    const lastOpenIndex = s.lastIndexOf('\\(');
    const unclosedSegment = s.slice(lastOpenIndex);
    const openBraces = (unclosedSegment.match(/\{/g) || []).length;
    const closeBraces = (unclosedSegment.match(/\}/g) || []).length;
    if (openBraces > closeBraces) {
      s += '}'.repeat(openBraces - closeBraces);
    }
    s += '\\)'.repeat(openParen - closeParen);
  }

  // Check \[ vs \]
  const openBracket = (s.match(/\\\[/g) || []).length;
  const closeBracket = (s.match(/\\\]/g) || []).length;
  if (openBracket > closeBracket) {
    const lastOpenIndex = s.lastIndexOf('\\[');
    const unclosedSegment = s.slice(lastOpenIndex);
    const openBraces = (unclosedSegment.match(/\{/g) || []).length;
    const closeBraces = (unclosedSegment.match(/\}/g) || []).length;
    if (openBraces > closeBraces) {
      s += '}'.repeat(openBraces - closeBraces);
    }
    s += '\\]'.repeat(openBracket - closeBracket);
  }

  // Check $$
  const doubleDollar = (s.match(/\$\$/g) || []).length;
  if (doubleDollar % 2 !== 0) {
    const lastOpenIndex = s.lastIndexOf('$$');
    const unclosedSegment = s.slice(lastOpenIndex);
    const openBraces = (unclosedSegment.match(/\{/g) || []).length;
    const closeBraces = (unclosedSegment.match(/\}/g) || []).length;
    if (openBraces > closeBraces) {
      s += '}'.repeat(openBraces - closeBraces);
    }
    s += '$$';
  } else {
    // Check single $ (excluding $$)
    const withoutDouble = s.replace(/\$\$/g, '');
    const singleDollar = (withoutDouble.match(/\$/g) || []).length;
    if (singleDollar % 2 !== 0) {
      const lastOpenIndex = s.lastIndexOf('$');
      const unclosedSegment = s.slice(lastOpenIndex);
      const openBraces = (unclosedSegment.match(/\{/g) || []).length;
      const closeBraces = (unclosedSegment.match(/\}/g) || []).length;
      if (openBraces > closeBraces) {
        s += '}'.repeat(openBraces - closeBraces);
      }
      s += '$';
    }
  }

  // Remove empty math blocks like \(\), \[\], $$, $$ $$
  s = s.replace(/\\\(\s*\\\)/g, '');
  s = s.replace(/\\\[\s*\\\]/g, '');
  s = s.replace(/\$\$\s*\$\$/g, '');

  return s;
}

/* KaTeX paints a parse error in red, which reads as "wrong answer" in a
   solution. A formula that will not parse is repaired once (a truncated
   command or a degree sign that lost its command) and, failing that, shown as
   plain source instead of a red blob. */
function renderKatex(content: string, display: boolean): string {
  const opts = { displayMode: display, throwOnError: true, trust: false };
  try {
    return katex.renderToString(content, opts);
  } catch {
    const repaired = content
      .replace(/\^\s*$/, '')           // a degree sign that lost its command
      .replace(/\\[a-zA-Z]+\s*$/, '')  // a dangling command
      .trim();
    if (repaired && repaired !== content) {
      try {
        return katex.renderToString(repaired, opts);
      } catch { /* fall through to the plain source */ }
    }
    return `<span class="math-plain">${escapeHtml(content)}</span>`;
  }
}

export function renderMath(rawText: string): string {
  if (!rawText) return '';
  const text = sanitizeMathDelimiters(rawText);

  // No explicit delimiters — apply preprocessLatex on full text, then detect bare LaTeX
  if (!/[$]|\\\(|\\\[/.test(text)) {
    const processed = preprocessLatex(text);
    if (/\\[a-zA-Z]|[_^]\{/.test(processed)) {
      let start = processed.search(/\\[a-zA-Z]|[_^]\{/);
      while (start > 0 && /[a-zA-Z0-9]/.test(processed[start - 1]!)) start--;
      const pre  = processed.slice(0, start);
      const math = processed.slice(start).trim();
      return (pre ? escapeHtml(pre) : '') + renderKatex(math, false);
    }
    return escapeHtml(processed);
  }

  // Text has delimiters: apply preprocessLatex only to non-math segments so KaTeX
  // renders \mu, \times, \Omega, \text{} etc. with proper math fonts.
  const pattern = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g;
  const parts: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    parts.push(escapeHtml(preprocessLatex(text.slice(lastIndex, match.index))));
    const raw = match[0]!;
    let display = false;
    let content = raw;
    if (raw.startsWith('$$'))       { display = true;  content = raw.slice(2, -2); }
    else if (raw.startsWith('$'))                     { content = raw.slice(1, -1); }
    else if (raw.startsWith('\\[')) { display = true;  content = raw.slice(2, -2); }
    else if (raw.startsWith('\\('))                   { content = raw.slice(2, -2); }
    parts.push(renderKatex(content.trim(), display));
    lastIndex = match.index + raw.length;
  }

  parts.push(escapeHtml(preprocessLatex(text.slice(lastIndex))));
  return parts.join('');
}

export const renderMathHtml = renderMath;

export function formatInlineMarkdown(text: string): string {
  const pre = preprocessLatex(text);
  let s = escapeHtml(pre);

  // Convert **bold** (including any spaces like ** bold **)
  s = s.replace(/\*\*\s*([^*]+?)\s*\*\*/g, '<strong>$1</strong>');

  // Convert *italic*
  s = s.replace(/(^|[^\*])\*([^\*\n]+)\*([^\*]|$)/g, '$1<em>$2</em>$3');

  // Clean up any remaining rogue asterisks so raw ** never appears
  s = s.replace(/\*\*/g, '');

  return s;
}

interface SectionItem {
  kind: 'p' | 'li' | 'math' | 'step_header';
  text: string;
}

/* The section kind is carried by one small status dot, not an icon in a
   coloured box. The emoji the model writes are used only for detection. */
const SUBSTEP_ICON =
  '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>';

interface ParsedSection {
  type: 'insight' | 'shortcut' | 'trap' | 'verification' | 'step' | 'general';
  icon: string;
  title: string;
  isSubStep?: boolean;
  items: SectionItem[];
}

function detectHeader(line: string): { type: ParsedSection['type']; icon: string; title: string; isSubStep?: boolean } | null {
  const m = line.match(/^(?:\*\*\s*|#{1,4}\s*)(💡|⚡|⚠️|📐|📝|✅|Step \d+|Given Data|Step-by-Step|Speed Technique|Common Pitfalls|Verification|Core Principle)([\s\S]*?)(?:\*\*|:)?$/i);
  if (!m) return null;
  const lead = m[1]!.trim();
  const rest = (m[2] ?? '').trim().replace(/^[:\-\s]+/, '');
  const combined = `${lead} ${rest}`.trim();
  const title = combined.replace(/^[\p{Extended_Pictographic}\uFE0F\s:*-]+/u, '').trim();

  if (/^Step\s*\d+/i.test(lead)) {
    return {
      type: 'step',
      icon: '🔢',
      isSubStep: true,
      title: title || lead,
    };
  }

  if (/💡|Conceptual|Given Data|Core Principle|📐/i.test(combined)) {
    return {
      type: 'insight',
      icon: /💡/.test(combined) ? '💡' : '📐',
      title: title || 'Conceptual Insight',
    };
  }
  if (/⚡|Speed Technique|Shortcut|Step-by-Step|📝/i.test(combined)) {
    return {
      type: 'shortcut',
      icon: /⚡/.test(combined) ? '⚡' : '📝',
      title: title || 'Step-by-Step Solution',
    };
  }
  if (/⚠️|Pitfalls|Traps/i.test(combined)) {
    return {
      type: 'trap',
      icon: '⚠️',
      title: title || 'Common Pitfalls & Traps',
    };
  }
  if (/✅|Verification|Sanity/i.test(combined)) {
    return {
      type: 'verification',
      icon: '✅',
      title: title || 'Verification',
    };
  }
  return {
    type: 'general',
    icon: '💡',
    title: title || combined,
  };
}

/* A short line that ends in a colon introduces what follows, so it is set
   as a label rather than as body prose. */
function paragraphHtml(text: string): string {
  const plain = text.replace(/\*\*/g, '').trim();
  const isLead = plain.length > 0 && plain.length <= 40 && /:$/.test(plain);
  return `<p class="explain-para${isLead ? ' is-lead' : ''}">${formatInlineMarkdown(text)}</p>`;
}

export function renderExplanationHtml(rawText: string): string {
  if (!rawText || !rawText.trim()) return '';
  const text = sanitizeMathDelimiters(rawText);

  // 1. Separate math spans and replace with tokens so markdown formatting doesn't alter math
  const mathTokens: string[] = [];
  const pattern = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g;

  let textWithTokens = text.replace(pattern, (match) => {
    let display = false;
    let content = match;
    if (match.startsWith('$$'))       { display = true;  content = match.slice(2, -2); }
    else if (match.startsWith('$'))   { content = match.slice(1, -1); }
    else if (match.startsWith('\\[')) { display = true;  content = match.slice(2, -2); }
    else if (match.startsWith('\\(')) { content = match.slice(2, -2); }

    let rendered = renderKatex(content.trim(), display);
    if (display) rendered = `<span class="explain-math-display">${rendered}</span>`;
    const token = `@@MATH_TOKEN_${mathTokens.length}@@`;
    mathTokens.push(rendered);
    return token;
  });

  // 2. Preprocess spaces inside asterisks: ** 💡 Conceptual Insight ** -> **💡 Conceptual Insight**
  textWithTokens = textWithTokens.replace(/\*\*\s*([^*]+?)\s*\*\*/g, '**$1**');

  // 3. Ensure section headers have double newlines so they separate cleanly into cards
  const sectionKeywords = [
    '💡\\s*Conceptual Insight',
    '⚡\\s*Speed Technique(?:\\s*\\/\\s*Shortcut)?',
    '⚠️\\s*Common Pitfalls(?:\\s*&\\s*Traps)?',
    'Given Data(?:\\s*&\\s*Core Principle)?',
    'Step-by-Step(?:\\s*Solution|\\s*Walkthrough)?',
    'Verification(?:\\s*&\\s*Sanity Checks)?',
    'Step\\s*\\d+',
  ].join('|');

  const headerRegex = new RegExp('(?:^|\\s*)(\\*\\*\\s*(?:' + sectionKeywords + ')[^*]*\\*\\*|#{1,4}\\s*(?:' + sectionKeywords + ')[^\\n]*)', 'gi');
  textWithTokens = textWithTokens.replace(headerRegex, (match, p1) => '\n\n' + p1.trim() + '\n\n');

  // 4. Ensure bullet points have newlines: handle "- **Title:**" and "- Title"
  textWithTokens = textWithTokens.replace(/([^\n])\s*([•\-])\s+(\*\*[^*]+\*\*|[A-Za-z])/g, '$1\n- $3');

  // 5. Parse lines into structured sections
  const lines = textWithTokens.split('\n').map((l) => l.trim()).filter(Boolean);
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;

  for (const line of lines) {
    const header = detectHeader(line);
    if (header) {
      if (header.isSubStep && currentSection && (currentSection.type === 'shortcut' || currentSection.type === 'step')) {
        currentSection.items.push({ kind: 'step_header', text: header.title });
        continue;
      }
      if (currentSection && currentSection.items.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { ...header, items: [] };
      continue;
    }

    if (!currentSection) {
      currentSection = {
        type: 'general',
        icon: '💡',
        title: 'Solution Overview',
        items: [],
      };
    }

    const bulletMatch = line.match(/^[-•*]\s+([\s\S]+)$/);
    if (bulletMatch) {
      currentSection.items.push({ kind: 'li', text: bulletMatch[1]! });
    } else if (/^<span class="explain-math-display">@@MATH_TOKEN_\d+@@<\/span>$/.test(line) || /^@@MATH_TOKEN_\d+@@$/.test(line)) {
      currentSection.items.push({ kind: 'math', text: line });
    } else {
      currentSection.items.push({ kind: 'p', text: line });
    }
  }
  if (currentSection && currentSection.items.length > 0) {
    sections.push(currentSection);
  }

  if (sections.length === 0) return '';

  // Single general section with no card structure (e.g. Simple Explanation): clean minimal text
  if (sections.length === 1 && sections[0]!.type === 'general') {
    let simpleHtml = '';
    for (const item of sections[0]!.items) {
      if (item.kind === 'math') simpleHtml += `<div class="explain-math-block">${item.text}</div>`;
      else simpleHtml += paragraphHtml(item.text);
    }
    for (let i = 0; i < mathTokens.length; i++) {
      simpleHtml = simpleHtml.replace(new RegExp(`@@MATH_TOKEN_${i}@@`, 'g'), () => mathTokens[i]!);
    }
    return `<div class="explain-simple-text">${simpleHtml}</div>`;
  }

  // Render cards for structured sections
  const renderedCards = sections.map((sec) => {
    let bodyHtml = '';
    let inList = false;

    for (const item of sec.items) {
      if (item.kind === 'li') {
        if (!inList) {
          bodyHtml += `<ul class="explain-list">`;
          inList = true;
        }
        bodyHtml += `<li>${formatInlineMarkdown(item.text)}</li>`;
      } else {
        if (inList) {
          bodyHtml += `</ul>`;
          inList = false;
        }
        if (item.kind === 'step_header') {
          bodyHtml += `<div class="explain-substep-badge"><span class="badge-num">${SUBSTEP_ICON}</span> <strong>${escapeHtml(item.text)}</strong></div>`;
        } else if (item.kind === 'math') {
          bodyHtml += `<div class="explain-math-block">${item.text}</div>`;
        } else {
          bodyHtml += paragraphHtml(item.text);
        }
      }
    }
    if (inList) bodyHtml += `</ul>`;

    if (sec.type === 'general') {
      return `<div class="explain-intro-lead">${bodyHtml}</div>`;
    }

    return `<div class="explain-card ${sec.type}">
  <div class="explain-card-header">
    <span class="explain-card-title">${escapeHtml(sec.title)}</span>
  </div>
  <div class="explain-card-body">${bodyHtml}</div>
</div>`;
  });

  let fullHtml = renderedCards.join('\n');

  // Restore math tokens
  for (let i = 0; i < mathTokens.length; i++) {
    fullHtml = fullHtml.replace(new RegExp(`@@MATH_TOKEN_${i}@@`, 'g'), () => mathTokens[i]!);
  }

  return fullHtml;
}

export interface ExplanationStep {
  label: string;
  text: string;
}

export interface SplitExplanation {
  lead: string | null;
  steps: ExplanationStep[];
}

/* Math spans are protected while we look for step markers, so a "Step 2"
   written inside an equation never splits the text. */
const EXPLANATION_MATH_SPAN = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g;

/**
 * Splits an explanation that carries "Step 1: … Step 2: …" markers into
 * numbered steps, the way an official solution booklet prints them.
 * Returns null when the text has no usable step markers.
 */
export function splitExplanationSteps(raw: string): SplitExplanation | null {
  if (!raw) return null;

  const mathRanges: Array<[number, number]> = [];
  const mathPattern = new RegExp(EXPLANATION_MATH_SPAN.source, 'g');
  let match: RegExpExecArray | null;
  while ((match = mathPattern.exec(raw)) !== null) {
    mathRanges.push([match.index, match.index + match[0].length]);
  }
  const insideMath = (i: number) => mathRanges.some(([a, b]) => i >= a && i < b);

  const marker = /Step\s*(\d{1,2})\s*(?::|\.|–|—|-|−|\)|\*)/gi;
  const cuts: Array<{ num: string; start: number; end: number }> = [];
  while ((match = marker.exec(raw)) !== null) {
    if (insideMath(match.index)) continue;
    cuts.push({ num: match[1]!, start: match.index, end: match.index + match[0].length });
  }
  if (cuts.length < 2) return null;

  const lead = raw.slice(0, cuts[0]!.start).trim();
  const steps: ExplanationStep[] = [];
  for (let i = 0; i < cuts.length; i += 1) {
    const from = cuts[i]!.end;
    const to = i + 1 < cuts.length ? cuts[i + 1]!.start : raw.length;
    const text = raw.slice(from, to).trim().replace(/^\*+\s*/, '');
    if (text) steps.push({ label: cuts[i]!.num, text });
  }
  if (steps.length < 2) return null;
  return { lead: lead || null, steps };
}

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
