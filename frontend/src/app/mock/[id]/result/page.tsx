'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import type { MockResultData, MockResultBreakdown } from '@/types';

import { fmtTime, fmtQTime, scoreColor, getJeeCrackingChances, getNEETCrackingChances } from '@/components/mock/resultHelpers';
import { JEE_SUBJECTS, NEET_SUBJECTS, SUBJECT_COLOR } from '@/lib/subjects';
import { QuestionReview } from '@/components/mock/QuestionReview';

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
      <Link href="/mock" style={{ color: '#1e293b', textDecoration: 'underline', fontSize: 14 }}>Back to Mock Tests</Link>
    </div>
  );

  const { result, exam } = data;
  const breakdown = result.scoreBreakdown as Record<string, MockResultBreakdown>;
  const pct = Math.round((result.totalScore / result.maxScore) * 100);
  const examType = exam.examType;
  const isNEET = examType === 'NEET';

  const SUBJECTS = isNEET ? NEET_SUBJECTS : JEE_SUBJECTS;
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
        const bd = breakdown[q.mockQuestionId ?? q.questionId];
        return sum + (bd?.awarded ?? 0);
      }, 0);
    } else {
      score = result.mathScore;
    }
    const subjectQs = exam.questions.filter((q) => q.subject === subj);
    const maxPerSubject = subjectQs.reduce((sum, q) => {
      const bd = breakdown[q.mockQuestionId ?? q.questionId];
      return sum + (bd?.maxMarks ?? 0);
    }, 0) || Math.round(result.maxScore / numSubjects);
    const sPct = maxPerSubject > 0 ? Math.round((score / maxPerSubject) * 100) : 0;
    return { subj, score, maxPerSubject, pct: sPct, count: subjectQs.length };
  });

  // Build URL for "Practice Weak Areas" — encodes the wrong/skipped topics from this mock
  function buildWeakPracticeUrl(): string {
    const topicWeights = new Map<string, { subject: string; weight: number }>();
    for (const q of exam.questions) {
      const mqId = q.mockQuestionId ?? q.questionId;
      const bd = breakdown[mqId];
      const isWrong = !!bd?.submitted && (bd.awarded ?? 0) <= 0;
      const isUnattempted = !bd?.submitted;
      if (!isWrong && !isUnattempted) continue;
      const topic = q.topic;
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
    const bd = breakdown[q.mockQuestionId ?? q.questionId];
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
      <div style={{ background: '#fff', color: '#1e293b', padding: '14px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/dashboard" style={{ display: 'inline-flex' }}><img src="/logo.png" alt="JEENEET.ai" className="site-logo" /></a>
          <span style={{ color: '#cbd5e1' }}>›</span>
          <Link href="/mock" style={{ color: '#64748b', fontSize: 14, textDecoration: 'none' }}>Mock Tests</Link>
          <span style={{ color: '#cbd5e1' }}>›</span>
          <span style={{ fontSize: 14, color: '#1e293b', fontWeight: 600 }}>
            Result — {isNEET ? 'NEET UG' : `JEE ${examType}`}
          </span>
        </div>
        <Link href="/mock" style={{
          color: '#1e293b', fontSize: 13, fontWeight: 600, textDecoration: 'none',
          padding: '6px 16px', border: '1px solid #cbd5e1', borderRadius: 5,
        }}>
          New Mock Test
        </Link>
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
                      ? `Rough estimate from your score (${result.totalScore}/${result.maxScore}, ${pct}%). Not an official cutoff prediction.`
                      : `Rough estimate from your score (${pct}% of max marks). Not an official cutoff prediction.`
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
                Rough estimates from score bands. General (open) category only. These are not official cutoffs or predictions.
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
                * Rough estimates from fixed score bands, not official data. Actual results vary with paper difficulty, normalization, and candidate count each year.
              </div>
            </div>
          );
        })()}

        <QuestionReview
          weakPracticeUrl={weakPracticeUrl}
          isNEET={isNEET}
          allQs={allQs}
          filteredQs={filteredQs}
          breakdown={breakdown}
          expandedQ={expandedQ}
          onExpand={setExpandedQ}
          filterSubject={filterSubject}
          onFilterSubject={setFilterSubject}
          filterStatus={filterStatus}
          onFilterStatus={setFilterStatus}
        />

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, paddingBottom: 32 }}>
          <Link href="/mock" style={{
            padding: '11px 24px', background: '#1e293b', color: '#fff',
            borderRadius: 6, fontSize: 14, fontWeight: 600, textDecoration: 'none',
          }}>
            Take Another Mock
          </Link>
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
