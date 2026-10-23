import styles from './dashboard.module.css';

export function toneClass(pct: number): string {
  if (pct >= 60) return styles.toneGood;
  if (pct >= 40) return styles.toneMid;
  return styles.toneLow;
}

export function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}
