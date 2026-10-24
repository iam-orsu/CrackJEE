/* Pure helpers for the mock result page: formatting, subject constants, and cracking-chance bands */

/* ── Helpers ─────────────────────────────────────────────────── */

export function fmtTime(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

export function fmtQTime(s: number): string {
  if (s === 0) return '—';
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

export function scoreColor(pct: number): string {
  if (pct >= 70) return '#16a34a';
  if (pct >= 50) return '#d97706';
  return '#dc2626';
}

/* ── JEE cracking chances bands ─────────────────────────────── */

export interface ChanceBand {
  label: string; color: string; bg: string; border: string;
  headline: string; details: string[]; bar: number;
}

export function getJeeCrackingChances(pct: number, examType: string): ChanceBand {
  if (examType === 'Main') {
    if (pct >= 75) return { label: 'Excellent', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', headline: 'Top 1% nationally', details: ['99+ percentile range (AIR < 1,000)', 'Strong NIT/IIIT admission — any branch', 'JEE Advanced qualifier — very likely'], bar: 95 };
    if (pct >= 60) return { label: 'Very Good', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', headline: 'Top 3–5% nationally', details: ['97–99 percentile range (AIR 1,000–10,000)', 'Good NITs assured (CS/Mech/EE)', 'JEE Advanced qualifying range'], bar: 75 };
    if (pct >= 45) return { label: 'Good', color: '#d97706', bg: '#fffbeb', border: '#fde68a', headline: 'Top 10–15% nationally', details: ['90–97 percentile range', 'Decent NITs/IIITs accessible', 'Near JEE Advanced qualifying threshold'], bar: 55 };
    if (pct >= 30) return { label: 'Average', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', headline: 'Top 20–35% nationally', details: ['80–90 percentile range', 'Some NITs/IIITs (lower branches)', 'Below JEE Advanced cutoff — improve accuracy'], bar: 35 };
    return { label: 'Needs Work', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', headline: 'Below qualifying threshold', details: ['Below 80 percentile range', 'Focus on NCERT fundamentals first', 'Strengthen weak topics before next mock'], bar: 15 };
  }
  // JEE Advanced
  if (pct >= 75) return { label: 'Outstanding', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', headline: 'IIT Top Branches assured', details: ['AIR < 200 range', 'CS/EE at IIT Bombay, Delhi, Madras within reach', 'Top 0.1% of JEE Advanced aspirants'], bar: 98 };
  if (pct >= 60) return { label: 'Excellent', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', headline: 'Top IITs guaranteed', details: ['AIR 200–1,000 range', 'CS/EE at top-5 IITs very likely', 'Top 0.5% of JEE Advanced aspirants'], bar: 80 };
  if (pct >= 47) return { label: 'Very Good', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', headline: 'IIT admission assured', details: ['AIR 1,000–5,000 range', 'Good branches at IIT Roorkee, Kharagpur, Guwahati', 'Top 2–3% of JEE Advanced aspirants'], bar: 62 };
  if (pct >= 35) return { label: 'Good', color: '#d97706', bg: '#fffbeb', border: '#fde68a', headline: 'IIT admission possible', details: ['AIR 5,000–15,000 range', 'Lower branches at newer IITs', '2025 closing cutoff was ~35–47% range'], bar: 42 };
  if (pct >= 25) return { label: 'Borderline', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', headline: 'Near qualifying cutoff', details: ['2025 open category cutoff ~28–30%', 'Work on accuracy — multi-correct guessing costs marks', 'Improve integer-type hit rate'], bar: 25 };
  return { label: 'Needs Work', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', headline: 'Below qualifying cutoff', details: ['Below 2025 open category threshold', 'Master conceptual clarity across all 3 subjects', 'Focus on single-correct accuracy before tackling multi-correct'], bar: 10 };
}

/* ── NEET cracking chances bands ─────────────────────────────── */

export function getNEETCrackingChances(pct: number): ChanceBand {
  // NEET 2025: General cutoff ~50% (360/720); top medical colleges ~95%+
  if (pct >= 90) return { label: 'Exceptional', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', headline: 'AIIMS / Top Government Medical Colleges', details: ['AIIMS Delhi, JIPMER — realistic target', 'AIR < 100 range', 'Top 0.01% of ~24 lakh aspirants'], bar: 98 };
  if (pct >= 75) return { label: 'Excellent', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', headline: 'Top Government & Private Medical Colleges', details: ['Top State Government Medical Colleges assured', 'AIR < 5,000 range', 'Top 0.02% of aspirants'], bar: 82 };
  if (pct >= 60) return { label: 'Very Good', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', headline: 'Government Medical College assured', details: ['Government seat highly likely', 'AIR 5,000–30,000 range', 'Top 0.1% of aspirants'], bar: 65 };
  if (pct >= 50) return { label: 'Good', color: '#d97706', bg: '#fffbeb', border: '#fde68a', headline: 'Near qualifying cutoff for government seats', details: ['360+ marks (50%) is the general qualifying cutoff', 'Government seat possible in home state', 'Private college admission assured'], bar: 48 };
  if (pct >= 40) return { label: 'Average', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', headline: 'Qualifying threshold — private colleges', details: ['Below general cutoff for government seats', 'Private medical/dental colleges accessible', 'Strengthen Biology and Physics accuracy'], bar: 30 };
  return { label: 'Needs Work', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', headline: 'Below qualifying cutoff', details: ['Below 40% — below NEET qualifying threshold', 'Focus on NCERT Biology (50% of paper)', 'Revise Physics and Chemistry fundamentals'], bar: 12 };
}

/* ── Plain text preview (strips LaTeX for snippet) ──────────── */

