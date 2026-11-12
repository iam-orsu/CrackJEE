import { describe, it, expect } from 'vitest';
import { clampNum, finiteNum, safeRange } from './helpers';

describe('safeRange (diagram params come from the database)', () => {
  it('accepts a sensible axis range', () => {
    expect(safeRange([-4, 4], [-5, 5])).toEqual([-4, 4]);
  });

  it('falls back for missing, malformed, or non-finite ranges', () => {
    expect(safeRange(undefined, [-5, 5])).toEqual([-5, 5]);
    expect(safeRange([1], [-5, 5])).toEqual([-5, 5]);
    expect(safeRange([0, Number.POSITIVE_INFINITY], [-5, 5])).toEqual([-5, 5]);
    expect(safeRange(['x', 'y'], [-5, 5])).toEqual([-5, 5]);
  });

  it('rejects enormous spans that would allocate huge tick arrays', () => {
    expect(safeRange([-1e9, 1e9], [-5, 5])).toEqual([-5, 5]);
  });

  it('rejects empty or inverted spans', () => {
    expect(safeRange([3, 3], [-5, 5])).toEqual([-5, 5]);
    expect(safeRange([4, -4], [-5, 5])).toEqual([-5, 5]);
  });
});

describe('finiteNum & clampNum', () => {
  it('returns fallback for NaN, Infinity, or non-numeric strings', () => {
    expect(finiteNum(undefined, 30)).toBe(30);
    expect(finiteNum('abc', 30)).toBe(30);
    expect(finiteNum(Number.NaN, 30)).toBe(30);
    expect(finiteNum(Number.POSITIVE_INFINITY, 30)).toBe(30);
    expect(clampNum('bad', 10, 70, 30)).toBe(30);
  });

  it('clamps finite numbers safely within [min, max]', () => {
    expect(clampNum(5, 10, 70, 30)).toBe(10);
    expect(clampNum(95, 10, 70, 30)).toBe(70);
    expect(clampNum('45', 10, 70, 30)).toBe(45);
  });
});
