import type { CSSProperties } from 'react';

/* Each subject carries its own colour skin. The card stays white and the colour
   lives in the atomic symbol, the border and the 3D offset. */
export interface Skin {
  deep: string;
  soft: string;
  line: string;
  shade: string;
}

export const SKIN: Record<string, Skin> = {
  Mathematics: { deep: '#803688', soft: '#F3E6F6', line: 'rgba(128,54,136,.30)', shade: '#5A2560' },
  Physics:     { deep: '#2A4FD6', soft: '#E2EAFE', line: 'rgba(42,79,214,.30)',  shade: '#1E4BA6' },
  Chemistry:   { deep: '#6A35C9', soft: '#EFE6FB', line: 'rgba(106,53,201,.30)', shade: '#4C1F9E' },
  Biology:     { deep: '#2E9E5B', soft: '#E3F5EA', line: 'rgba(46,158,91,.30)',  shade: '#1E7A45' },
  Botany:      { deep: '#2E9E5B', soft: '#E3F5EA', line: 'rgba(46,158,91,.30)',  shade: '#1E7A45' },
  Zoology:     { deep: '#1E8A66', soft: '#E0F2EC', line: 'rgba(30,138,102,.30)', shade: '#14624A' },
};

export const ALL_SKIN: Skin = { deep: '#003366', soft: '#E6EBFA', line: 'rgba(0,51,102,.28)', shade: '#00284F' };

/* The atomic symbol that stands for each subject, as a watermark */
export const SYMBOL: Record<string, string> = {
  Mathematics: '∑',
  Physics: 'π',
  Chemistry: 'H₂O',
  Biology: 'Δ',
  Botany: 'λ',
  Zoology: 'Ω',
};

export function skinVars(skin: Skin): CSSProperties {
  return {
    '--skin': skin.deep,
    '--skin-soft': skin.soft,
    '--skin-line': skin.line,
    '--skin-shade': skin.shade,
  } as CSSProperties;
}
