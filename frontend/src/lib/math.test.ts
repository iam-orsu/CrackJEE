import { describe, it, expect } from 'vitest';
import { renderMath, escapeHtml, stripOptionPrefix } from './math';

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
