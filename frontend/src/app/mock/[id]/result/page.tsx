'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import katex from 'katex';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import type { MockResultData, MockResultBreakdown } from '@/types';

import { MathText, renderMath } from '@/lib/math';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';
import { Badge, subjectVariant, qtypeVariant } from '@/components/ui/Badge';

/* ── Helpers ─────────────────────────────────────────────────── */

function fmtTime(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

function fmtQTime(s: number): string {
  if (s === 0) return '—';
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function scoreColor(pct: number): string {
  if (pct >= 70) return '#16a34a';
  if (pct >= 50) return '#d97706';
  return '#dc2626';
}

const JEE_SUBJECTS = ['Physics', 'Chemistry', 'Mathematics'] as const;
const NEET_SUBJECTS_LIST = ['Physics', 'Chemistry', 'Botany', 'Zoology'] as const;
const SUBJECT_COLOR: Record<string, string> = {
  Physics: '#2563eb', Chemistry: '#16a34a', Mathematics: '#7c3aed',
  Botany: '#16a34a', Zoology: '#0891b2',
};

/* ── JEE cracking chances bands ─────────────────────────────── */

interface ChanceBand {
  label: string; color: string; bg: string; border: string;
  headline: string; details: string[]; bar: number;
}

function getJeeCrackingChances(pct: number, examType: string): ChanceBand {
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

function getNEETCrackingChances(pct: number): ChanceBand {
  // NEET 2025: General cutoff ~50% (360/720); top medical colleges ~95%+
  if (pct >= 90) return { label: 'Exceptional', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', headline: 'AIIMS / Top Government Medical Colleges', details: ['AIIMS Delhi, JIPMER — realistic target', 'AIR < 100 range', 'Top 0.01% of ~24 lakh aspirants'], bar: 98 };
  if (pct >= 75) return { label: 'Excellent', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', headline: 'Top Government & Private Medical Colleges', details: ['Top State Government Medical Colleges assured', 'AIR < 5,000 range', 'Top 0.02% of aspirants'], bar: 82 };
  if (pct >= 60) return { label: 'Very Good', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', headline: 'Government Medical College assured', details: ['Government seat highly likely', 'AIR 5,000–30,000 range', 'Top 0.1% of aspirants'], bar: 65 };
  if (pct >= 50) return { label: 'Good', color: '#d97706', bg: '#fffbeb', border: '#fde68a', headline: 'Near qualifying cutoff for government seats', details: ['360+ marks (50%) is the general qualifying cutoff', 'Government seat possible in home state', 'Private college admission assured'], bar: 48 };
  if (pct >= 40) return { label: 'Average', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', headline: 'Qualifying threshold — private colleges', details: ['Below general cutoff for government seats', 'Private medical/dental colleges accessible', 'Strengthen Biology and Physics accuracy'], bar: 30 };
  return { label: 'Needs Work', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', headline: 'Below qualifying cutoff', details: ['Below 40% — below NEET qualifying threshold', 'Focus on NCERT Biology (50% of paper)', 'Revise Physics and Chemistry fundamentals'], bar: 12 };
}

/* ── Plain text preview (strips LaTeX for snippet) ──────────── */

function toPlainPreview(text: string, max = 80): string {
  const plain = text
    .replace(/\$\$[\s\S]+?\$\$/g, '')
    .replace(/\$([^$\n]*)\$/g, '$1')
    .replace(/\\[a-zA-Z]+\{([^}]*)\}/g, '$1')
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/[{}[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > max ? plain.slice(0, max) + '…' : plain;
}

/* ══════════════════════════════════════════════════════════════
   Component
══════════════════════════════════════════════════════════════ */

export default function MockResultPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;

  const [data, setData] = useState<MockResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [filterSubject, setFilterSubject] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'all' | 'correct' | 'incorrect' | 'unattempted'>('all');

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    api.mock.result(examId)
      .then(setData)
      .catch((e) => setError(e?.message ?? 'Failed to load result'))
      .finally(() => setLoading(false));
  }, [examId]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: '#1e293b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error || !data) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', gap: 16 }}>
      <div style={{ color: '#dc2626', fontSize: 15 }}>{error || 'Result not found'}</div>
      <a href="/mock" style={{ color: '#1e293b', textDecoration: 'underline', fontSize: 14 }}>Back to Mock Tests</a>
    </div>
  );

  const { result, exam } = data;
  const breakdown = result.scoreBreakdown as Record<string, MockResultBreakdown>;
  const pct = Math.round((result.totalScore / result.maxScore) * 100);
  const examType = exam.examType;
  const isNEET = examType === 'NEET';

  const SUBJECTS = isNEET ? NEET_SUBJECTS_LIST : JEE_SUBJECTS;
  const numSubjects = SUBJECTS.length;

  // Build per-subject scores
  const subjectScores = SUBJECTS.map((subj) => {
    let score: number;
    if (subj === 'Physics') score = result.physicsScore;
    else if (subj === 'Chemistry') score = result.chemistryScore;
    else if (subj === 'Botany' || subj === 'Zoology') {
      // For NEET, split biologyScore evenly between Botany/Zoology (or calculate from breakdown)
      const subjQs = exam.questions.filter((q) => q.subject === subj);
      score = subjQs.reduce((sum, q) => {
        const bd = breakdown[(q as any).mockQuestionId ?? q.questionId];
        return sum + (bd?.awarded ?? 0);
      }, 0);
    } else {
      score = result.mathScore;
    }
    const subjectQs = exam.questions.filter((q) => q.subject === subj);
    const maxPerSubject = subjectQs.reduce((sum, q) => {
      const bd = breakdown[(q as any).mockQuestionId ?? q.questionId];
      return sum + (bd?.maxMarks ?? 0);
    }, 0) || Math.round(result.maxScore / numSubjects);
    const sPct = maxPerSubject > 0 ? Math.round((score / maxPerSubject) * 100) : 0;
    return { subj, score, maxPerSubject, pct: sPct, count: subjectQs.length };
  });

  // Build URL for "Practice Weak Areas" — encodes the wrong/skipped topics from this mock
  function buildWeakPracticeUrl(): string {
    const topicWeights = new Map<string, { subject: string; weight: number }>();
    for (const q of exam.questions) {
      const mqId = (q as any).mockQuestionId ?? q.questionId;
      const bd = breakdown[mqId];
      const isWrong = !!bd?.submitted && (bd.awarded ?? 0) <= 0;
      const isUnattempted = !bd?.submitted;
      if (!isWrong && !isUnattempted) continue;
      const topic = (q as any).topic as string;
      if (!topic || !q.subject) continue;
      const key = `${q.subject}::${topic}`;
      const weight = isWrong ? 2 : 1;
      const ex = topicWeights.get(key);
      if (ex) { ex.weight += weight; } else { topicWeights.set(key, { subject: q.subject, weight }); }
    }
    const basePath = isNEET ? '/neet/practice' : '/practice';
    if (topicWeights.size === 0) return basePath;
    const sorted = [...topicWeights.entries()].sort(([, a], [, b]) => b.weight - a.weight);
    const subjectMap: Record<string, string[]> = {};
    for (const [key, { subject }] of sorted) {
      const topic = key.split('::')[1]!;
      if (!subjectMap[subject]) subjectMap[subject] = [];
      subjectMap[subject].push(topic);
    }
    const weakData = encodeURIComponent(JSON.stringify({ subjects: Object.keys(subjectMap), topics: subjectMap }));
    return `${basePath}?mode=mock_weak&weakData=${weakData}`;
  }
  const weakPracticeUrl = buildWeakPracticeUrl();

  // Filter questions for review section
  const allQs = exam.questions;
  const filteredQs = allQs.filter((q) => {
    const bd = breakdown[(q as any).mockQuestionId ?? q.questionId];
    if (!bd) return filterSubject === 'All' || q.subject === filterSubject;
    const isCorrect = bd.awarded > 0;
    const isUnattempted = !bd.submitted;
    const isIncorrect = !!bd.submitted && bd.awarded <= 0;
    if (filterSubject !== 'All' && q.subject !== filterSubject) return false;
    if (filterStatus === 'correct' && !isCorrect) return false;
    if (filterStatus === 'incorrect' && !isIncorrect) return false;
    if (filterStatus === 'unattempted' && !isUnattempted) return false;
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Top bar */}
      <div style={{ background: '#1e293b', color: '#fff', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/dashboard" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>JEENEET.ai</a>
          <span style={{ color: '#475569' }}>›</span>
          <a href="/mock" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>Mock Tests</a>
          <span style={{ color: '#475569' }}>›</span>
          <span style={{ fontSize: 14, color: '#f1f5f9', fontWeight: 600 }}>
            Result — {isNEET ? 'NEET UG' : `JEE ${examType}`}
          </span>
        </div>
        <a href="/mock" style={{
          color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none',
          padding: '6px 16px', border: '1px solid #475569', borderRadius: 5,
        }}>
          New Mock Test
        </a>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Score card */}
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                {isNEET ? 'NEET UG' : `JEE ${examType}`} Mock — Score
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 52, fontWeight: 800, color: scoreColor(pct), lineHeight: 1 }}>
                  {result.totalScore}
                </span>
                <span style={{ fontSize: 22, color: '#94a3b8', fontWeight: 500 }}>/ {result.maxScore}</span>
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>✓ {result.correct} Correct</span>
                {(result.partial ?? 0) > 0 && (
                  <span style={{ fontSize: 13, color: '#d97706', fontWeight: 600 }}>◑ {result.partial} Partial</span>
                )}
                <span style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>✗ {result.incorrect} Wrong</span>
                <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>○ {result.unattempted} Skipped</span>
                <span style={{ fontSize: 13, color: '#64748b' }}>⏱ {fmtTime(result.timeTaken)}</span>
                {(() => {
                  const times = Object.values(breakdown).map((b) => b.timeSpentSeconds ?? 0).filter((t) => t > 0);
                  if (times.length === 0) return null;
                  const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
                  return <span style={{ fontSize: 13, color: '#64748b' }}>avg {fmtQTime(avg)}/q</span>;
                })()}
              </div>
            </div>

            {/* Score ring */}
            <div style={{ position: 'relative', width: 100, height: 100 }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={scoreColor(pct)} strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: scoreColor(pct) }}>{pct}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject breakdown */}
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 18 }}>Subject-wise Performance</h2>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isNEET ? 4 : 3}, 1fr)`, gap: 16 }}>
            {subjectScores.map(({ subj, score, maxPerSubject, pct: sPct }) => (
              <div key={subj} style={{
                padding: '16px 18px', border: `1px solid ${SUBJECT_COLOR[subj]}30`,
                borderRadius: 8, background: `${SUBJECT_COLOR[subj]}05`,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: SUBJECT_COLOR[subj], textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                  {subj}
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: scoreColor(sPct), marginBottom: 4 }}>
                  {score}
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#94a3b8' }}> / {maxPerSubject}</span>
                </div>
                {/* Progress bar */}
                <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden', marginTop: 10 }}>
                  <div style={{ height: '100%', width: `${Math.max(0, Math.min(100, sPct))}%`, background: SUBJECT_COLOR[subj], borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 5 }}>{sPct}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cracking Chances */}
        {(() => {
          const band = isNEET ? getNEETCrackingChances(pct) : getJeeCrackingChances(pct, examType);
          return (
            <div style={{ background: band.bg, borderRadius: 10, border: `1px solid ${band.border}`, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: band.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                    {isNEET ? 'NEET UG' : `JEE ${examType}`} — Cracking Chances
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: band.color, marginBottom: 4 }}>{band.label}</div>
                  <div style={{ fontSize: 14, color: '#374151', fontWeight: 600, marginBottom: 12 }}>{band.headline}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {band.details.map((d, i) => (
                      <div key={i} style={{ fontSize: 13, color: '#4b5563', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: band.color, fontWeight: 700, fontSize: 11 }}>›</span>
                        {d}
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 14 }}>
                    {isNEET
                      ? `Based on NEET 2025 cutoff trends · Your score: ${result.totalScore}/${result.maxScore} (${pct}%)`
                      : `Based on 2025 JEE open category cutoff trends · Your score: ${pct}% of max marks`
                    }
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 80 }}>
                  <div style={{ position: 'relative', width: 80, height: 80 }}>
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="32" fill="none" stroke={`${band.color}20`} strokeWidth="8" />
                      <circle
                        cx="40" cy="40" r="32" fill="none"
                        stroke={band.color} strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 32}`}
                        strokeDashoffset={`${2 * Math.PI * 32 * (1 - band.bar / 100)}`}
                        strokeLinecap="round"
                        transform="rotate(-90 40 40)"
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: band.color }}>{band.bar}%</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280', textAlign: 'center' }}>chance</div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* JEE Chances Analyzer — only for JEE exams */}
        {!isNEET && (() => {
          const rawPct = result.maxScore > 0 ? result.totalScore / result.maxScore : 0;

          type Band = { label: string; color: string; bg: string; border: string };
          const bands: Record<string, Band> = {
            exceptional: { label: 'Exceptional', color: '#15803d', bg: '#f0fdf4', border: '#86efac' },
            high:        { label: 'High',        color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
            good:        { label: 'Good',        color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
            moderate:    { label: 'Moderate',    color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
            low:         { label: 'Low',         color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
            veryLow:     { label: 'Very Low',    color: '#9f1239', bg: '#fff1f2', border: '#fecdd3' },
          };

          // JEE Main: score/maxScore → percentile → rank (calibrated to real JEE Main 2025 data)
          const mainData = rawPct >= 0.83
            ? { band: bands.exceptional, percentile: '99.95%+',    rank: 'AIR < 500',          colleges: 'IIT B/D/M CSE, EE',      msg: 'Near-perfect. IIT Bombay, Delhi, Madras flagship branches are in reach.' }
            : rawPct >= 0.67
            ? { band: bands.high,        percentile: '99.7–99.95%', rank: 'AIR 500–3,000',      colleges: 'Most IITs',              msg: 'Strong performance. Most IIT branches in top-tier IITs accessible.' }
            : rawPct >= 0.50
            ? { band: bands.good,        percentile: '99.0–99.7%',  rank: 'AIR 3,000–15,000',   colleges: 'Good NITs / Newer IITs', msg: 'Qualifies for JEE Advanced. Good NITs and newer IITs accessible.' }
            : rawPct >= 0.33
            ? { band: bands.moderate,    percentile: '95–99%',      rank: 'AIR 15,000–80,000',  colleges: 'NITs / GFTIs',           msg: 'May qualify for JEE Advanced. NITs and government colleges in range.' }
            : rawPct >= 0.25
            ? { band: bands.low,         percentile: '~93%',        rank: 'AIR 80,000+',        colleges: 'Borderline',             msg: 'Near the JEE Advanced qualifying cutoff (93.1 percentile, 2025). Borderline NIT admission.' }
            : { band: bands.veryLow,     percentile: '< 93%',       rank: '—',                  colleges: 'Below cutoff',           msg: 'Below the JEE Advanced qualifying percentile (93.1, 2025). Focus on core fundamentals.' };

          // JEE Advanced: score/maxScore → rank (calibrated to real JEE Advanced 2025 data)
          const advData = rawPct >= 0.70
            ? { band: bands.exceptional, rank: 'AIR < 500',        iitAccess: 'IIT B/D/M CSE, EE', msg: 'Exceptional. IIT Bombay, Delhi, Madras flagship branches in reach.' }
            : rawPct >= 0.56
            ? { band: bands.high,        rank: 'AIR 500–3,000',    iitAccess: 'IIT K/R/G/BHU',     msg: 'Strong. IIT Kanpur, Roorkee, Guwahati — good branches accessible.' }
            : rawPct >= 0.42
            ? { band: bands.good,        rank: 'AIR 3,000–8,000',  iitAccess: 'Newer IITs',         msg: 'Qualifies comfortably. Newer IITs and non-flagship branches of good IITs.' }
            : rawPct >= 0.35
            ? { band: bands.moderate,    rank: 'AIR 8,000–18,000', iitAccess: 'Limited options',    msg: 'Near the qualifying threshold (~35% of max). Few IIT branches accessible.' }
            : { band: bands.veryLow,     rank: '—',                iitAccess: 'Not qualifying',     msg: 'Below the typical qualifying mark (~35% of max, 2025). Strengthen weak areas first.' };

          return (
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Your JEE Chances</h2>
              <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>
                Based on JEE 2025 official cutoffs and marks vs rank trends. General (open) category only.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {/* JEE Main card */}
                <div style={{ padding: 18, borderRadius: 8, border: `1px solid ${mainData.band.border}`, background: mainData.band.bg }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                    JEE Main → NIT / IIT
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: mainData.band.color, marginBottom: 12 }}>
                    {mainData.band.label}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: '#64748b' }}>Percentile</span>
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>{mainData.percentile}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: '#64748b' }}>Expected Rank</span>
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>{mainData.rank}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: '#64748b' }}>Colleges in range</span>
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>{mainData.colleges}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: mainData.band.color, lineHeight: 1.5 }}>{mainData.msg}</div>
                </div>

                {/* JEE Advanced card */}
                <div style={{ padding: 18, borderRadius: 8, border: `1px solid ${advData.band.border}`, background: advData.band.bg }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                    JEE Advanced → IIT Rank
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: advData.band.color, marginBottom: 12 }}>
                    {advData.band.label}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: '#64748b' }}>Expected AIR</span>
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>{advData.rank}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: '#64748b' }}>IIT branches</span>
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>{advData.iitAccess}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: advData.band.color, lineHeight: 1.5 }}>{advData.msg}</div>
                </div>
              </div>

              <div style={{ marginTop: 14, fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>
                * Estimates based on JEE 2025 published data. Actual results vary with paper difficulty, normalization, and candidate count each year.
              </div>
            </div>
          );
        })()}

        {/* Question review */}
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Question Review</h2>
            <a href={weakPracticeUrl} style={{
              padding: '7px 14px', background: '#fff', color: '#1e293b',
              border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, fontWeight: 600,
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}>
              Practice Weak Areas
            </a>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            <AnimatedTabs
              size="sm"
              tabs={[
                { value: 'All', label: 'All Subjects' },
                ...(isNEET
                  ? (['Physics', 'Chemistry', 'Botany', 'Zoology'] as const).map((s) => ({ value: s, label: s }))
                  : (['Physics', 'Chemistry', 'Mathematics'] as const).map((s) => ({ value: s, label: s }))
                ),
              ]}
              value={filterSubject}
              onChange={setFilterSubject}
            />
            <AnimatedTabs
              size="sm"
              tabs={[
                { value: 'all',         label: 'All',       count: allQs.length },
                { value: 'correct',     label: '✓ Correct', count: allQs.filter((q) => { const bd = breakdown[(q as any).mockQuestionId ?? q.questionId]; return !!bd?.submitted && (bd.awarded ?? 0) > 0; }).length },
                { value: 'incorrect',   label: '✗ Wrong',   count: allQs.filter((q) => { const bd = breakdown[(q as any).mockQuestionId ?? q.questionId]; return !!bd?.submitted && (bd.awarded ?? 0) <= 0; }).length },
                { value: 'unattempted', label: '○ Skipped', count: allQs.filter((q) => { const bd = breakdown[(q as any).mockQuestionId ?? q.questionId]; return !bd?.submitted; }).length },
              ]}
              value={filterStatus}
              onChange={(v) => setFilterStatus(v as typeof filterStatus)}
            />
          </div>

          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 14 }}>
            Showing {filteredQs.length} of {allQs.length} questions
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredQs.map((q) => {
              const mqId = (q as any).mockQuestionId ?? q.questionId;
              const bd = breakdown[mqId];
              const isCorrect = bd && bd.awarded > 0;
              const isUnattempted = !bd?.submitted;
              const isIncorrect = !!bd?.submitted && bd.awarded <= 0;
              const isExpanded = expandedQ === q.questionId;

              const statusColor = isCorrect ? '#16a34a' : isUnattempted ? '#64748b' : '#dc2626';
              const statusBg = isCorrect ? '#f0fdf4' : isUnattempted ? '#f8fafc' : '#fef2f2';
              const statusBorder = isCorrect ? '#bbf7d0' : isUnattempted ? '#e2e8f0' : '#fecaca';
              const statusLabel = isCorrect ? `+${bd!.awarded}` : isUnattempted ? '0' : `${bd?.awarded ?? 0}`;

              return (
                <div key={q.questionId} style={{
                  border: `1px solid ${isExpanded ? '#cbd5e1' : statusBorder}`,
                  borderRadius: 8, overflow: 'hidden',
                  background: isExpanded ? '#fff' : statusBg,
                }}>
                  {/* Row header */}
                  <button
                    onClick={() => setExpandedQ(isExpanded ? null : q.questionId)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <span style={{
                      flexShrink: 0, width: 28, height: 28, borderRadius: 5,
                      background: statusColor, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 800,
                    }}>
                      {statusLabel}
                    </span>
                    <span style={{ fontSize: 12, color: '#64748b', flexShrink: 0 }}>Q{q.questionNumber}</span>
                    <Badge variant={subjectVariant(q.subject)}>{q.subject}</Badge>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{(q as any).topic}</span>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, color: '#374151' }}>
                      {toPlainPreview((q as any).questionText ?? '')}
                    </span>
                    {(bd?.timeSpentSeconds ?? 0) > 0 && (
                      <span style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0, whiteSpace: 'nowrap' }}>
                        ⏱ {fmtQTime(bd!.timeSpentSeconds!)}
                      </span>
                    )}
                    <span style={{ fontSize: 12, color: '#94a3b8', flexShrink: 0 }}>
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div style={{ padding: '0 16px 20px', borderTop: '1px solid #e2e8f0' }}>
                      {/* Question text */}
                      <div style={{ fontSize: 14, color: '#1e293b', lineHeight: 1.7, padding: '14px 0 12px' }}>
                        <MathText text={(q as any).questionText ?? ''} />
                      </div>

                      {/* Options */}
                      {(q as any).options && (q as any).options.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                          {((q as any).options as string[]).map((opt, i) => {
                            const letter = ['A', 'B', 'C', 'D'][i]!;
                            const correctAns = bd?.correctAnswer ?? '';
                            const submittedAns = bd?.submitted ?? '';
                            const isCorrectOpt = correctAns.includes(letter);
                            const isSubmittedOpt = submittedAns.includes(letter);
                            let optBg = '#f8fafc'; let optBorder = '#e2e8f0'; let optColor = '#374151';
                            if (isCorrectOpt) { optBg = '#f0fdf4'; optBorder = '#86efac'; optColor = '#15803d'; }
                            if (isSubmittedOpt && !isCorrectOpt) { optBg = '#fef2f2'; optBorder = '#fca5a5'; optColor = '#dc2626'; }
                            return (
                              <div key={letter} style={{
                                display: 'flex', alignItems: 'flex-start', gap: 10,
                                padding: '8px 12px', borderRadius: 6,
                                border: `1px solid ${optBorder}`, background: optBg,
                              }}>
                                <span style={{ fontWeight: 700, color: optColor, flexShrink: 0 }}>{letter})</span>
                                <span style={{ fontSize: 13, color: optColor }}><MathText text={opt.replace(/^[A-Da-d][).]\s*/, '')} /></span>
                                {isCorrectOpt && <span style={{ marginLeft: 'auto', color: '#16a34a', fontWeight: 700, fontSize: 12 }}>✓ Correct</span>}
                                {isSubmittedOpt && !isCorrectOpt && <span style={{ marginLeft: 'auto', color: '#dc2626', fontWeight: 700, fontSize: 12 }}>✗ Your answer</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Integer answer */}
                      {(q as any).questionType === 'integer' && (
                        <div style={{ display: 'flex', gap: 20, marginBottom: 14, fontSize: 13 }}>
                          <div style={{ padding: '8px 14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 6 }}>
                            <span style={{ color: '#64748b' }}>Correct: </span>
                            <strong style={{ color: '#15803d' }}>{bd?.correctAnswer}</strong>
                          </div>
                          {bd?.submitted && bd.submitted !== '' && (
                            <div style={{
                              padding: '8px 14px', borderRadius: 6,
                              background: isCorrect ? '#f0fdf4' : '#fef2f2',
                              border: `1px solid ${isCorrect ? '#86efac' : '#fca5a5'}`,
                            }}>
                              <span style={{ color: '#64748b' }}>Your answer: </span>
                              <strong style={{ color: isCorrect ? '#15803d' : '#dc2626' }}>{bd.submitted}</strong>
                            </div>
                          )}
                          {(!bd?.submitted || bd.submitted === '') && (
                            <div style={{ padding: '8px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6 }}>
                              <span style={{ color: '#64748b' }}>Not attempted</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Explanation */}
                      {(q as any).explanation && (
                        <div style={{
                          padding: '14px 16px', background: '#fffbeb', border: '1px solid #fde68a',
                          borderRadius: 6, fontSize: 13, color: '#92400e', lineHeight: 1.7,
                        }}>
                          <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Explanation</div>
                          <MathText text={(q as any).explanation} />
                        </div>
                      )}

                      {/* Marks awarded */}
                      <div style={{ marginTop: 12, display: 'flex', gap: 12, fontSize: 12, color: '#64748b' }}>
                        <span>Marks awarded: <strong style={{ color: statusColor }}>{bd?.awarded ?? 0}</strong></span>
                        <span>Max marks: <strong>{bd?.maxMarks ?? 4}</strong></span>
                        <span>Type: <strong>{(q as any).questionType === 'mcq_single' ? 'Single Correct' : (q as any).questionType === 'mcq_multi' ? 'Multi-Correct' : 'Integer'}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, paddingBottom: 32 }}>
          <a href="/mock" style={{
            padding: '11px 24px', background: '#1e293b', color: '#fff',
            borderRadius: 6, fontSize: 14, fontWeight: 600, textDecoration: 'none',
          }}>
            Take Another Mock
          </a>
          <a href={weakPracticeUrl} style={{
            padding: '11px 24px', background: '#fff', color: '#1e293b',
            border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, fontWeight: 600, textDecoration: 'none',
          }}>
            Practice Weak Areas
          </a>
        </div>
      </div>
    </div>
  );
}
