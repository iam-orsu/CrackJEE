/* Shared tokens for the mock exam screens: a formal paper-and-ink treatment
   with one official navy accent. Question-state colours live in examStatus.ts
   because they carry meaning, not decoration. */

export const EX = {
  ink: '#1B2533',
  ink2: '#3D4B5C',
  mute: '#6C7A8C',
  faint: '#93A0B1',
  line: '#D4DBE4',
  lineSoft: '#E8ECF2',
  paper: '#FFFFFF',
  ground: '#EDF1F5',
  accent: '#1D4E89',
  accentDark: '#163C6B',
  accentWash: '#EDF3FA',
  danger: '#B42318',
  dangerLine: '#EBBDB8',
  warn: '#9A5B00',
  warnWash: '#FFF8E6',
  warnLine: '#EBD9AE',
} as const;

export const FONT_SANS = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";
export const FONT_MONO = "ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace";