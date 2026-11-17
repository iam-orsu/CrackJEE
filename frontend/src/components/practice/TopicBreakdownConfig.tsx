'use client';

import React from 'react';
import type { Subject } from '@/types';
import type { TopicCustomConfig, TypeDifficultyBreakdown } from './shared';
import {
  getTypeTotal,
  getTopicTotal,
  createBalancedDifficulty,
  getDefaultQuestionTypes,
  planTopicTypeSlots,
} from './shared';
import { SubjectIcon } from './SubjectIcon';
import { SKIN, ALL_SKIN } from './skin';

interface TopicBreakdownConfigProps {
  selectedSubjects: Set<Subject>;
  selectedTopics: Partial<Record<Subject, Set<string>>>;
  perSubjectCount: number;
  isNeet: boolean;
  isAdvanced: boolean;
  topicConfigs: Record<string, TopicCustomConfig>;
  onTopicConfigs: React.Dispatch<React.SetStateAction<Record<string, TopicCustomConfig>>>;
  onAutoDistributeSubject: (subject: Subject) => void;
  onAutoDistributeAll: () => void;
}

const emptyBreakdown = (): TypeDifficultyBreakdown => ({ easy: 0, medium: 0, hard: 0 });

export function TopicBreakdownConfig({
  selectedSubjects,
  selectedTopics,
  perSubjectCount,
  isNeet,
  isAdvanced,
  topicConfigs,
  onTopicConfigs,
  onAutoDistributeSubject,
  onAutoDistributeAll,
}: TopicBreakdownConfigProps) {
  const subjects = Array.from(selectedSubjects);

  // Helper to adjust a specific difficulty level (easy, medium, hard) within a question type
  const adjustDifficulty = (
    key: string,
    typeKey: 'mcq' | 'integer' | 'matrix' | 'multi',
    level: 'easy' | 'medium' | 'hard',
    delta: number,
  ) => {
    onTopicConfigs((prev) => {
      const current = prev[key];
      if (!current) return prev;
      const currentBreakdown = current[typeKey] ?? emptyBreakdown();
      const nextVal = Math.max(0, (currentBreakdown[level] || 0) + delta);
      return {
        ...prev,
        [key]: {
          ...current,
          [typeKey]: {
            ...currentBreakdown,
            [level]: nextVal,
          },
        },
      };
    });
  };

  // Helper to change total count of a question type by adding or removing from difficulty
  const adjustTypeCount = (
    key: string,
    typeKey: 'mcq' | 'integer' | 'matrix' | 'multi',
    delta: number,
  ) => {
    onTopicConfigs((prev) => {
      const current = prev[key];
      if (!current) return prev;
      const b = { ...(current[typeKey] ?? emptyBreakdown()) };
      if (delta > 0) {
        b.medium = (b.medium || 0) + delta;
      } else if (delta < 0) {
        let toRemove = Math.abs(delta);
        if ((b.hard || 0) >= toRemove) {
          b.hard = (b.hard || 0) - toRemove;
        } else {
          toRemove -= b.hard || 0;
          b.hard = 0;
          if ((b.medium || 0) >= toRemove) {
            b.medium = (b.medium || 0) - toRemove;
          } else {
            toRemove -= b.medium || 0;
            b.medium = 0;
            b.easy = Math.max(0, (b.easy || 0) - toRemove);
          }
        }
      }
      return {
        ...prev,
        [key]: {
          ...current,
          [typeKey]: b,
        },
      };
    });
  };

  // Helper to change total questions for an entire topic directly (e.g. typing 15)
  const setTopicTotalExact = (key: string, targetCount: number) => {
    const newTotal = Math.max(0, targetCount);
    onTopicConfigs((prev) => {
      const current = prev[key];
      if (!current) return prev;
      const currentTotal = getTopicTotal(current);
      if (newTotal === currentTotal) return prev;

      const examTypeStr = isAdvanced ? 'Advanced' : 'Main';
      const defTypes = getDefaultQuestionTypes(newTotal, examTypeStr, isNeet);
      const typeSlots = planTopicTypeSlots(newTotal, defTypes, isAdvanced, isNeet);
      const mcqCount = typeSlots.filter((t) => t === 'mcq_single').length;
      const integerCount = typeSlots.filter((t) => t === 'integer').length;
      const multiCount = typeSlots.filter((t) => t === 'mcq_multi').length;
      const matrixCount = typeSlots.filter((t) => t === 'matrix_match').length;

      return {
        ...prev,
        [key]: {
          ...current,
          mcq: createBalancedDifficulty(mcqCount),
          integer: createBalancedDifficulty(integerCount),
          multi: createBalancedDifficulty(multiCount),
          matrix: createBalancedDifficulty(matrixCount),
        },
      };
    });
  };

  // Helper to increment or decrement an entire topic's total questions
  const adjustTopicTotal = (key: string, delta: number) => {
    onTopicConfigs((prev) => {
      const current = prev[key];
      if (!current) return prev;
      const currentTotal = getTopicTotal(current);
      const newTotal = Math.max(0, currentTotal + delta);
      if (newTotal === currentTotal) return prev;

      if (delta > 0) {
        // Increment: add to MCQ medium
        const mcq = { ...(current.mcq ?? emptyBreakdown()) };
        mcq.medium = (mcq.medium || 0) + delta;
        return {
          ...prev,
          [key]: { ...current, mcq },
        };
      } else {
        // Decrement: remove from hard -> medium -> easy across types
        let toRemove = Math.abs(delta);
        const nextCfg = {
          ...current,
          matrix: { ...(current.matrix ?? emptyBreakdown()) },
          multi: { ...(current.multi ?? emptyBreakdown()) },
          integer: { ...(current.integer ?? emptyBreakdown()) },
          mcq: { ...(current.mcq ?? emptyBreakdown()) },
        };
        const types: Array<'matrix' | 'multi' | 'integer' | 'mcq'> = ['matrix', 'multi', 'integer', 'mcq'];
        for (const t of types) {
          if (toRemove <= 0) break;
          const b = nextCfg[t];
          for (const lvl of ['hard', 'medium', 'easy'] as const) {
            if (toRemove <= 0) break;
            const available = b[lvl] || 0;
            const take = Math.min(available, toRemove);
            b[lvl] = available - take;
            toRemove -= take;
          }
        }
        return {
          ...prev,
          [key]: nextCfg,
        };
      }
    });
  };

  return (
    <div className="config-row" style={{ marginTop: 20 }}>
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <div>
          <p className="config-label" style={{ marginBottom: 2 }}>
            Customize Questions per Topic
          </p>
          <p style={{ fontSize: 12, color: 'var(--gray-500)', margin: 0 }}>
            Choose question types for each topic, and adjust Easy, Medium, or Hard counts.
          </p>
        </div>
        <button
          type="button"
          onClick={onAutoDistributeAll}
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--brand, #003366)',
            background: 'var(--ice, #eef2ff)',
            border: '1px solid rgba(0,51,102,.15)',
            borderRadius: 999,
            padding: '5px 12px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          ⚡ Auto-distribute evenly
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {subjects.map((subject) => {
          const skin = SKIN[subject] ?? ALL_SKIN;
          const topics = Array.from(selectedTopics[subject] ?? new Set<string>());
          if (topics.length === 0) return null;

          const subjectTotal = topics.reduce((sum, topic) => {
            const key = `${subject}::${topic}`;
            return sum + getTopicTotal(topicConfigs[key]);
          }, 0);

          const isSubjectMatched = subjectTotal === perSubjectCount;
          const diff = perSubjectCount - subjectTotal;

          return (
            <div
              key={subject}
              style={{
                background: 'var(--white)',
                border: '1px solid rgba(0,51,102,.1)',
                borderRadius: 14,
                padding: '16px 18px',
                boxShadow: '0 2px 10px -4px rgba(0,51,102,.08)',
              }}
            >
              {/* Subject Bar Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 14,
                  flexWrap: 'wrap',
                  gap: 10,
                  paddingBottom: 10,
                  borderBottom: '1px solid rgba(0,51,102,.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: '.04em',
                      textTransform: 'uppercase',
                      color: skin.deep,
                      background: skin.soft,
                      padding: '3px 10px',
                      borderRadius: 999,
                    }}
                  >
                    <SubjectIcon subject={subject} size={14} /> {subject}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600 }}>
                    Target: {perSubjectCount} Questions
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 999,
                      background: isSubjectMatched
                        ? '#ecfdf5'
                        : diff < 0
                        ? '#fef2f2'
                        : '#fffbeb',
                      color: isSubjectMatched
                        ? '#047857'
                        : diff < 0
                        ? '#b91c1c'
                        : '#b45309',
                      border: `1px solid ${
                        isSubjectMatched
                          ? '#a7f3d0'
                          : diff < 0
                          ? '#fecaca'
                          : '#fde68a'
                      }`,
                    }}
                  >
                    {isSubjectMatched
                      ? `✓ ${subjectTotal} of ${perSubjectCount} matched`
                      : diff < 0
                      ? `⚠️ ${subjectTotal} of ${perSubjectCount} (${Math.abs(diff)} over)`
                      : `⚠️ ${subjectTotal} of ${perSubjectCount} (${diff} needed)`}
                  </span>

                  {!isSubjectMatched && (
                    <button
                      type="button"
                      onClick={() => onAutoDistributeSubject(subject)}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'var(--brand, #003366)',
                        background: 'var(--ice, #eef2ff)',
                        border: '1px solid rgba(0,51,102,.2)',
                        borderRadius: 999,
                        padding: '3px 10px',
                        cursor: 'pointer',
                      }}
                    >
                      ⚡ Auto-match
                    </button>
                  )}
                </div>
              </div>

              {/* Alert banner if subject total does not match target */}
              {!isSubjectMatched && (
                <div
                  style={{
                    background: diff < 0 ? '#fef2f2' : '#fffbeb',
                    border: `1px solid ${diff < 0 ? '#fecaca' : '#fde68a'}`,
                    color: diff < 0 ? '#b91c1c' : '#b45309',
                    padding: '8px 12px',
                    borderRadius: 8,
                    marginBottom: 14,
                    fontSize: 12,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <span>
                    ⚠️ You have configured {subjectTotal} questions across {subject} topics, but target is {perSubjectCount}.{' '}
                    {diff < 0
                      ? `Reduce ${Math.abs(diff)} question(s) or click Auto-match.`
                      : `Add ${diff} more question(s) or click Auto-match.`}
                  </span>
                  <button
                    type="button"
                    onClick={() => onAutoDistributeSubject(subject)}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: 'var(--brand, #003366)',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Auto-match to {perSubjectCount}
                  </button>
                </div>
              )}

              {/* Topics Grid - clean full-width responsive grid (NO empty space on the right) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    topics.length === 1
                      ? '1fr'
                      : 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: 14,
                }}
              >
                {topics.map((topic) => {
                  const key = `${subject}::${topic}`;
                  const cfg: TopicCustomConfig = topicConfigs[key] ?? {
                    subject,
                    topic,
                    mcq: emptyBreakdown(),
                    integer: emptyBreakdown(),
                    matrix: emptyBreakdown(),
                    multi: emptyBreakdown(),
                  };

                  const topicTotal = getTopicTotal(cfg);

                  const questionTypesList: Array<{
                    id: 'mcq' | 'integer' | 'matrix' | 'multi';
                    label: string;
                    sub: string;
                    badge: string;
                  }> = [
                    { id: 'mcq', label: 'Single Choice', sub: '4 options, 1 correct', badge: 'MCQ' },
                    ...(!isNeet ? [{ id: 'integer' as const, label: 'Numerical / Integer', sub: 'Direct value answer', badge: 'NUM' }] : []),
                    { id: 'matrix', label: 'Matrix Match', sub: 'Column matching', badge: 'MATRIX' },
                    ...(isAdvanced ? [{ id: 'multi' as const, label: 'Multiple Choice', sub: '1 or more correct', badge: 'MULTI' }] : []),
                  ];

                  return (
                    <div
                      key={topic}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 12,
                        padding: '14px 16px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                      }}
                    >
                      {/* Topic Card Header */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 12,
                          paddingBottom: 10,
                          borderBottom: '1px solid #f1f5f9',
                          flexWrap: 'wrap',
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: 14,
                            fontWeight: 700,
                            color: 'var(--gray-900)',
                            lineHeight: 1.3,
                          }}
                        >
                          {topic}
                        </h4>

                        {/* Interactive Topic Questions Stepper & Direct Input */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: 'var(--gray-500)',
                              textTransform: 'uppercase',
                              letterSpacing: '.03em',
                            }}
                          >
                            Questions:
                          </span>
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              background: '#f8fafc',
                              border: '1px solid #cbd5e1',
                              borderRadius: 8,
                              padding: '2px',
                              gap: 2,
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => adjustTopicTotal(key, -1)}
                              disabled={topicTotal <= 0}
                              title="Decrease topic questions"
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 6,
                                border: 'none',
                                background: '#ffffff',
                                color: '#1e293b',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                                fontSize: 14,
                                fontWeight: 700,
                                cursor: topicTotal <= 0 ? 'not-allowed' : 'pointer',
                                opacity: topicTotal <= 0 ? 0.35 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                              }}
                            >
                              −
                            </button>

                            <input
                              type="number"
                              min={0}
                              max={150}
                              value={topicTotal}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val)) {
                                  setTopicTotalExact(key, val);
                                }
                              }}
                              aria-label={`${topic} question count`}
                              style={{
                                width: 44,
                                textAlign: 'center',
                                fontSize: 13,
                                fontWeight: 800,
                                color: 'var(--brand, #003366)',
                                border: 'none',
                                background: 'transparent',
                                outline: 'none',
                                padding: '0 2px',
                                MozAppearance: 'textfield',
                              }}
                            />

                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: 'var(--gray-500)',
                                paddingRight: 4,
                                userSelect: 'none',
                              }}
                            >
                              Qs
                            </span>

                            <button
                              type="button"
                              onClick={() => adjustTopicTotal(key, 1)}
                              title="Increase topic questions"
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 6,
                                border: 'none',
                                background: '#ffffff',
                                color: '#1e293b',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                                fontSize: 14,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Question Types List: Multi-column if 1 topic, single column if multiple topics */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            topics.length === 1
                              ? 'repeat(auto-fit, minmax(260px, 1fr))'
                              : '1fr',
                          gap: 10,
                        }}
                      >
                        {questionTypesList.map(({ id, label, sub, badge }) => {
                          const breakdown = cfg[id] ?? emptyBreakdown();
                          const count = getTypeTotal(breakdown);

                          return (
                            <div
                              key={id}
                              style={{
                                background: count > 0 ? '#f8fafc' : '#ffffff',
                                border: `1px solid ${count > 0 ? '#cbd5e1' : '#f1f5f9'}`,
                                borderRadius: 10,
                                padding: '8px 10px',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              {/* Top row: Label on left, compact counter on right */}
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>
                                      {label}
                                    </span>
                                    <span
                                      style={{
                                        fontSize: 9,
                                        fontWeight: 800,
                                        background: '#e2e8f0',
                                        color: '#475569',
                                        padding: '1px 4px',
                                        borderRadius: 3,
                                      }}
                                    >
                                      {badge}
                                    </span>
                                  </div>
                                  <p style={{ margin: 0, fontSize: 10, color: '#64748b' }}>{sub}</p>
                                </div>

                                {/* Counter Stepper */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <button
                                    type="button"
                                    onClick={() => adjustTypeCount(key, id, -1)}
                                    disabled={count <= 0}
                                    title={`Decrease ${label}`}
                                    style={{
                                      width: 24,
                                      height: 24,
                                      borderRadius: 6,
                                      border: '1px solid #cbd5e1',
                                      background: '#ffffff',
                                      fontSize: 14,
                                      fontWeight: 700,
                                      cursor: count <= 0 ? 'not-allowed' : 'pointer',
                                      opacity: count <= 0 ? 0.35 : 1,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      padding: 0,
                                      color: '#1e293b',
                                    }}
                                  >
                                    −
                                  </button>
                                  <span
                                    style={{
                                      minWidth: 20,
                                      textAlign: 'center',
                                      fontSize: 13,
                                      fontWeight: 800,
                                      color: '#0f172a',
                                    }}
                                  >
                                    {count}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => adjustTypeCount(key, id, 1)}
                                    title={`Increase ${label}`}
                                    style={{
                                      width: 24,
                                      height: 24,
                                      borderRadius: 6,
                                      border: '1px solid #cbd5e1',
                                      background: '#ffffff',
                                      fontSize: 14,
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      padding: 0,
                                      color: '#1e293b',
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* Easy / Medium / Hard Breakdown: Compact inline chips (Never stretched!) */}
                              {count > 0 && (
                                <div
                                  style={{
                                    marginTop: 6,
                                    paddingTop: 6,
                                    borderTop: '1px dashed #e2e8f0',
                                    display: 'flex',
                                    gap: 6,
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                  }}
                                >
                                  {/* Easy Chip */}
                                  <div
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 5,
                                      background: '#ecfdf5',
                                      border: '1px solid #a7f3d0',
                                      borderRadius: 999,
                                      padding: '2px 6px 2px 8px',
                                    }}
                                  >
                                    <span style={{ fontSize: 10, fontWeight: 700, color: '#047857' }}>
                                      Easy
                                    </span>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                                      <button
                                        type="button"
                                        onClick={() => adjustDifficulty(key, id, 'easy', -1)}
                                        disabled={(breakdown.easy || 0) <= 0}
                                        title="Decrease Easy"
                                        style={{
                                          width: 17,
                                          height: 17,
                                          border: '1px solid #a7f3d0',
                                          background: '#ffffff',
                                          color: '#047857',
                                          borderRadius: 4,
                                          fontSize: 11,
                                          fontWeight: 700,
                                          cursor: (breakdown.easy || 0) <= 0 ? 'not-allowed' : 'pointer',
                                          opacity: (breakdown.easy || 0) <= 0 ? 0.3 : 1,
                                          padding: 0,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          lineHeight: 1,
                                        }}
                                      >
                                        −
                                      </button>
                                      <span style={{ fontSize: 11, fontWeight: 800, color: '#047857', minWidth: 14, textAlign: 'center' }}>
                                        {breakdown.easy || 0}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => adjustDifficulty(key, id, 'easy', 1)}
                                        title="Increase Easy"
                                        style={{
                                          width: 17,
                                          height: 17,
                                          border: '1px solid #a7f3d0',
                                          background: '#ffffff',
                                          color: '#047857',
                                          borderRadius: 4,
                                          fontSize: 11,
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          padding: 0,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          lineHeight: 1,
                                        }}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>

                                  {/* Medium Chip */}
                                  <div
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 5,
                                      background: '#fffbeb',
                                      border: '1px solid #fde68a',
                                      borderRadius: 999,
                                      padding: '2px 6px 2px 8px',
                                    }}
                                  >
                                    <span style={{ fontSize: 10, fontWeight: 700, color: '#b45309' }}>
                                      Medium
                                    </span>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                                      <button
                                        type="button"
                                        onClick={() => adjustDifficulty(key, id, 'medium', -1)}
                                        disabled={(breakdown.medium || 0) <= 0}
                                        title="Decrease Medium"
                                        style={{
                                          width: 17,
                                          height: 17,
                                          border: '1px solid #fde68a',
                                          background: '#ffffff',
                                          color: '#b45309',
                                          borderRadius: 4,
                                          fontSize: 11,
                                          fontWeight: 700,
                                          cursor: (breakdown.medium || 0) <= 0 ? 'not-allowed' : 'pointer',
                                          opacity: (breakdown.medium || 0) <= 0 ? 0.3 : 1,
                                          padding: 0,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          lineHeight: 1,
                                        }}
                                      >
                                        −
                                      </button>
                                      <span style={{ fontSize: 11, fontWeight: 800, color: '#b45309', minWidth: 14, textAlign: 'center' }}>
                                        {breakdown.medium || 0}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => adjustDifficulty(key, id, 'medium', 1)}
                                        title="Increase Medium"
                                        style={{
                                          width: 17,
                                          height: 17,
                                          border: '1px solid #fde68a',
                                          background: '#ffffff',
                                          color: '#b45309',
                                          borderRadius: 4,
                                          fontSize: 11,
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          padding: 0,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          lineHeight: 1,
                                        }}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>

                                  {/* Hard Chip */}
                                  <div
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 5,
                                      background: '#fef2f2',
                                      border: '1px solid #fecaca',
                                      borderRadius: 999,
                                      padding: '2px 6px 2px 8px',
                                    }}
                                  >
                                    <span style={{ fontSize: 10, fontWeight: 700, color: '#b91c1c' }}>
                                      Hard
                                    </span>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                                      <button
                                        type="button"
                                        onClick={() => adjustDifficulty(key, id, 'hard', -1)}
                                        disabled={(breakdown.hard || 0) <= 0}
                                        title="Decrease Hard"
                                        style={{
                                          width: 17,
                                          height: 17,
                                          border: '1px solid #fecaca',
                                          background: '#ffffff',
                                          color: '#b91c1c',
                                          borderRadius: 4,
                                          fontSize: 11,
                                          fontWeight: 700,
                                          cursor: (breakdown.hard || 0) <= 0 ? 'not-allowed' : 'pointer',
                                          opacity: (breakdown.hard || 0) <= 0 ? 0.3 : 1,
                                          padding: 0,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          lineHeight: 1,
                                        }}
                                      >
                                        −
                                      </button>
                                      <span style={{ fontSize: 11, fontWeight: 800, color: '#b91c1c', minWidth: 14, textAlign: 'center' }}>
                                        {breakdown.hard || 0}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => adjustDifficulty(key, id, 'hard', 1)}
                                        title="Increase Hard"
                                        style={{
                                          width: 17,
                                          height: 17,
                                          border: '1px solid #fecaca',
                                          background: '#ffffff',
                                          color: '#b91c1c',
                                          borderRadius: 4,
                                          fontSize: 11,
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          padding: 0,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          lineHeight: 1,
                                        }}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
