import styles from './dashboard.module.css';

export const SUBJECT_COLOR: Record<string, string> = {
  Physics: '#2563eb', Chemistry: '#16a34a', Mathematics: '#7c3aed',
  Botany: '#16a34a', Zoology: '#0891b2', Biology: '#059669',
};

export function toneClass(pct: number): string {
  if (pct >= 60) return styles.toneGood;
  if (pct >= 40) return styles.toneMid;
  return styles.toneLow;
}

export function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}
