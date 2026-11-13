import { describe, it, expect } from 'vitest';
import { renderMath, renderExplanationHtml, escapeHtml, stripOptionPrefix } from './math';

describe('escapeHtml', () => {
  it('escapes markup characters', () => {
    expect(escapeHtml('<img src=x onerror="alert(1)">')).toBe('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
  });
});

describe('renderMath (question text from the model is untrusted)', () => {
  it('does not turn injected markup into live HTML in plain text', () => {
    const html = renderMath('Find x. <script>alert(1)</script> and <img src=x onerror=alert(1)>');
    expect(html).not.toContain('<script>');
    expect(html).not.toMatch(/<img[^>]*onerror/i);
    expect(html).toContain('&lt;script&gt;');
  });

  it('renders delimited math with KaTeX and keeps text outside it escaped', () => {
    const html = renderMath('Compute $x^2$ <b>now</b>');
    expect(html).toContain('katex');
    expect(html).toContain('&lt;b&gt;now&lt;/b&gt;');
  });

  it('keeps the KaTeX trust setting off, so \\href cannot create a link', () => {
    // KaTeX echoes the TeX source as escaped text, which is harmless. What matters is that no anchor is produced.
    const html = renderMath('$\\href{javascript:alert(1)}{x}$');
    expect(html).not.toMatch(/<a\b[^>]*href/i);
  });
});

describe('stripOptionPrefix', () => {
  it('removes the A) / B. prefixes from option text', () => {
    expect(stripOptionPrefix('A) $5$ m')).toBe('$5$ m');
    expect(stripOptionPrefix('c. 10')).toBe('10');
    expect(stripOptionPrefix('no prefix')).toBe('no prefix');
  });
});

describe('renderExplanationHtml', () => {
  it('strips markdown asterisks and converts headers into structured visual cards', () => {
    const raw = '** 💡 Conceptual Insight** The coefficient of $x^3$ is a **convolution sum** over complementary degrees. ** ⚡ Speed Technique / Shortcut** Write the coefficient in one line:';
    const html = renderExplanationHtml(raw);

    // No raw ** should remain anywhere
    expect(html).not.toContain('**');
    // Structured cards should be created
    expect(html).toContain('explain-card insight');
    expect(html).toContain('explain-card shortcut');
    expect(html).toContain('explain-card-title');
    expect(html).toContain('Conceptual Insight');
    expect(html).toContain('Speed Technique / Shortcut');
    // Bold words should be converted to strong tags
    expect(html).toContain('<strong>convolution sum</strong>');
    // KaTeX should be rendered for math
    expect(html).toContain('katex');
  });

  it('parses inline bullet points into structured lists with distinct list items', () => {
    const raw = '** ⚠️ Common Pitfalls & Traps** - **Evaluating derivative:** Trap 1 explanation. - **Sign slip in $y(3)$:** Dropped sign. - **Missing constant:** Shifts values.';
    const html = renderExplanationHtml(raw);

    expect(html).not.toContain('**');
    expect(html).toContain('explain-card trap');
    expect(html).toContain('Common Pitfalls &amp; Traps');
    expect(html).toContain('<ul class="explain-list">');
    expect(html).toContain('<li><strong>Evaluating derivative:</strong> Trap 1 explanation.</li>');
    expect(html).toContain('<li><strong>Sign slip in');
    expect(html).toContain('<li><strong>Missing constant:</strong> Shifts values.</li>');
    expect(html).toContain('</ul>');
  });

  it('renders Step-by-Step solution with inner substep badges', () => {
    const raw = '**Step-by-Step Solution**\n**Step 1:** Differentiate curve\n$$\\frac{dy}{dx} = 2x$$\n**Step 2:** Solve for zero\n$x = 0$';
    const html = renderExplanationHtml(raw);

    expect(html).not.toContain('**');
    expect(html).toContain('explain-card shortcut');
    expect(html).toContain('Step-by-Step Solution');
    expect(html).toContain('explain-substep-badge');
    expect(html).toContain('Step 1');
    expect(html).toContain('Step 2');
    expect(html).toContain('katex');
  });

  it('renders simple explanations cleanly in minimal container without cards', () => {
    const raw = 'Differentiating gives $f\'(x) = 6(x-1)(x-2)$. Negative when $1 < x < 2$.';
    const html = renderExplanationHtml(raw);

    expect(html).toContain('explain-simple-text');
    expect(html).not.toContain('explain-card');
    expect(html).toContain('katex');
  });

  it('escapes injected HTML while preserving math formatting', () => {
    const raw = '**Step 1: Given**\n$v = 10\\text{ m/s}$\n<script>bad()</script>';
    const html = renderExplanationHtml(raw);

    expect(html).not.toContain('**');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
});
