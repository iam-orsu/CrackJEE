'use client';

import React from 'react';
import type { Subject } from '@/types';
import type { TopicCustomConfig } from './shared';
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

  // Helper to update a topic's counts
  const updateTopicField = (
    key: string,
    field: keyof TopicCustomConfig,
    delta: number,
  ) => {
    onTopicConfigs((prev) => {
      const current = prev[key];
      if (!current) return prev;
      const currentVal = (current[field] as number) || 0;
      const nextVal = Math.max(0, currentVal + delta);
      const updated: TopicCustomConfig = { ...current, [field]: nextVal };

      // If updating a question type, sync difficulty if difficulty sum was equal to previous total
      const prevTypeTotal =
        current.mcqCount +
        current.integerCount +
        current.multiCount +
        current.matrixCount;
      const prevDiffTotal =
        current.beginnerCount +
        current.intermediateCount +
        current.advancedCount;

      if (
        ['mcqCount', 'integerCount', 'multiCount', 'matrixCount'].includes(field)
      ) {
        const nextTypeTotal =
          updated.mcqCount +
          updated.integerCount +
          updated.multiCount +
          updated.matrixCount;

        if (prevTypeTotal === prevDiffTotal) {
          // Adjust intermediate difficulty to keep sum in sync
          const diffDelta = nextTypeTotal - prevTypeTotal;
          if (diffDelta > 0) {
            updated.intermediateCount = (updated.intermediateCount || 0) + diffDelta;
          } else if (diffDelta < 0) {
            let toReduce = Math.abs(diffDelta);
            if (updated.intermediateCount >= toReduce) {
              updated.intermediateCount -= toReduce;
            } else {
              toReduce -= updated.intermediateCount;
              updated.intermediateCount = 0;
              if (updated.beginnerCount >= toReduce) {
                updated.beginnerCount -= toReduce;
              } else {
                toReduce -= updated.beginnerCount;
                updated.beginnerCount = 0;
                updated.advancedCount = Math.max(0, updated.advancedCount - toReduce);
              }
            }
          }
        }
      }

      return { ...prev, [key]: updated };
    });
  };

  const equalizeDifficulty = (key: string) => {
    onTopicConfigs((prev) => {
      const current = prev[key];
      if (!current) return prev;
      const typeTotal =
        current.mcqCount +
        current.integerCount +
        current.multiCount +
        current.matrixCount;
      if (typeTotal === 0) {
        return {
          ...prev,
          [key]: { ...current, beginnerCount: 0, intermediateCount: 0, advancedCount: 0 },
        };
      }
      const b = Math.max(1, Math.round(typeTotal * 0.2));
      const a = Math.max(1, Math.round(typeTotal * 0.4));
      const i = Math.max(0, typeTotal - b - a);
      return {
        ...prev,
        [key]: { ...current, beginnerCount: b, intermediateCount: i, advancedCount: a },
      };
    });
  };

  return (
    <div className="config-row" style={{ marginTop: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <div>
          <p className="config-label" style={{ marginBottom: 2 }}>
            Selected Topics &amp; Question Mix
          </p>
          <p style={{ fontSize: 12, color: 'var(--gray-500)', margin: 0 }}>
            Fine-tune exact question counts, types, and difficulty rigor for each selected topic.
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
            borderRadius: 'var(--radius-full)',
            padding: '4px 12px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          ⚡ Auto-distribute across all topics
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {subjects.map((subject) => {
          const skin = SKIN[subject] ?? ALL_SKIN;
          const topics = Array.from(selectedTopics[subject] ?? new Set<string>());
          if (topics.length === 0) return null;

          const subjectTotal = topics.reduce((sum, topic) => {
            const key = `${subject}::${topic}`;
            const cfg = topicConfigs[key];
            if (!cfg) return sum;
            return (
              sum +
              cfg.mcqCount +
              cfg.integerCount +
              cfg.multiCount +
              cfg.matrixCount
            );
          }, 0);

          const isSubjectMatched = subjectTotal === perSubjectCount;
          const diff = perSubjectCount - subjectTotal;

          return (
            <div
              key={subject}
              style={{
                background: 'var(--white)',
                border: '1px solid rgba(0,51,102,.1)',
                borderRadius: 16,
                padding: '16px 18px',
                boxShadow: '0 4px 16px -8px rgba(0,51,102,.12)',
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
                    Target: {perSubjectCount} Qs
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
                      ? `✓ ${subjectTotal} / ${perSubjectCount} matched`
                      : diff < 0
                      ? `⚠️ ${subjectTotal} / ${perSubjectCount} (${Math.abs(diff)} over)`
                      : `⚠️ ${subjectTotal} / ${perSubjectCount} (${diff} needed)`}
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

              {/* Overflow / Underflow alert banner */}
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
                    ⚠️ <strong>{diff < 0 ? 'Topic questions overflow' : 'Topic questions underflow'}:</strong>{' '}
                    You have configured {subjectTotal} questions across {subject} topics, but target is {perSubjectCount}.{' '}
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

              {/* Topics Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: 12,
                }}
              >
                {topics.map((topic) => {
                  const key = `${subject}::${topic}`;
                  const cfg: TopicCustomConfig = topicConfigs[key] ?? {
                    subject,
                    topic,
                    mcqCount: 0,
                    integerCount: 0,
                    multiCount: 0,
                    matrixCount: 0,
                    beginnerCount: 0,
                    intermediateCount: 0,
                    advancedCount: 0,
                  };

                  const typeTotal =
                    cfg.mcqCount +
                    cfg.integerCount +
                    cfg.multiCount +
                    cfg.matrixCount;

                  const diffTotal =
                    cfg.beginnerCount +
                    cfg.intermediateCount +
                    cfg.advancedCount;

                  const diffMismatch = typeTotal !== diffTotal;

                  return (
                    <div
                      key={topic}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 12,
                        padding: '12px 14px',
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
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: '#1e293b',
                            lineHeight: 1.3,
                          }}
                        >
                          {topic}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            color: skin.deep,
                            background: skin.soft,
                            padding: '2px 8px',
                            borderRadius: 999,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {typeTotal} Qs
                        </span>
                      </div>

                      {/* Question Types Row */}
                      <div>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#64748b',
                            marginBottom: 6,
                            textTransform: 'uppercase',
                            letterSpacing: '.03em',
                          }}
                        >
                          Question Types
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: isAdvanced
                              ? 'repeat(4, 1fr)'
                              : !isNeet
                              ? 'repeat(3, 1fr)'
                              : 'repeat(2, 1fr)',
                            gap: 6,
                          }}
                        >
                          {/* MCQ */}
                          <div
                            style={{
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: 8,
                              padding: '6px 8px',
                              textAlign: 'center',
                            }}
                          >
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#475569', display: 'block' }}>
                              Single
                            </span>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: 4,
                              }}
                            >
                              <button
                                type="button"
                                style={{ width: 20, height: 20, borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 700, fontSize: 12, lineHeight: 1 }}
                                disabled={cfg.mcqCount <= 0}
                                onClick={() => updateTopicField(key, 'mcqCount', -1)}
                              >
                                −
                              </button>
                              <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                                {cfg.mcqCount}
                              </span>
                              <button
                                type="button"
                                style={{ width: 20, height: 20, borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 700, fontSize: 12, lineHeight: 1 }}
                                onClick={() => updateTopicField(key, 'mcqCount', 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Integer */}
                          {!isNeet && (
                            <div
                              style={{
                                background: '#ffffff',
                                border: '1px solid #cbd5e1',
                                borderRadius: 8,
                                padding: '6px 8px',
                                textAlign: 'center',
                              }}
                            >
                              <span style={{ fontSize: 10, fontWeight: 700, color: '#475569', display: 'block' }}>
                                Integer
                              </span>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  marginTop: 4,
                                }}
                              >
                                <button
                                  type="button"
                                  style={{ width: 20, height: 20, borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 700, fontSize: 12, lineHeight: 1 }}
                                  disabled={cfg.integerCount <= 0}
                                  onClick={() => updateTopicField(key, 'integerCount', -1)}
                                >
                                  −
                                </button>
                                <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                                  {cfg.integerCount}
                                </span>
                                <button
                                  type="button"
                                  style={{ width: 20, height: 20, borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 700, fontSize: 12, lineHeight: 1 }}
                                  onClick={() => updateTopicField(key, 'integerCount', 1)}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Multi */}
                          {isAdvanced && (
                            <div
                              style={{
                                background: '#ffffff',
                                border: '1px solid #cbd5e1',
                                borderRadius: 8,
                                padding: '6px 8px',
                                textAlign: 'center',
                              }}
                            >
                              <span style={{ fontSize: 10, fontWeight: 700, color: '#475569', display: 'block' }}>
                                Multi
                              </span>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  marginTop: 4,
                                }}
                              >
                                <button
                                  type="button"
                                  style={{ width: 20, height: 20, borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 700, fontSize: 12, lineHeight: 1 }}
                                  disabled={cfg.multiCount <= 0}
                                  onClick={() => updateTopicField(key, 'multiCount', -1)}
                                >
                                  −
                                </button>
                                <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                                  {cfg.multiCount}
                                </span>
                                <button
                                  type="button"
                                  style={{ width: 20, height: 20, borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 700, fontSize: 12, lineHeight: 1 }}
                                  onClick={() => updateTopicField(key, 'multiCount', 1)}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Matrix Match */}
                          <div
                            style={{
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: 8,
                              padding: '6px 8px',
                              textAlign: 'center',
                            }}
                          >
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#475569', display: 'block' }}>
                              Matrix
                            </span>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: 4,
                              }}
                            >
                              <button
                                type="button"
                                style={{ width: 20, height: 20, borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 700, fontSize: 12, lineHeight: 1 }}
                                disabled={cfg.matrixCount <= 0}
                                onClick={() => updateTopicField(key, 'matrixCount', -1)}
                              >
                                −
                              </button>
                              <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                                {cfg.matrixCount}
                              </span>
                              <button
                                type="button"
                                style={{ width: 20, height: 20, borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 700, fontSize: 12, lineHeight: 1 }}
                                onClick={() => updateTopicField(key, 'matrixCount', 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Difficulty Levels Row */}
                      <div>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#64748b',
                            marginBottom: 6,
                            textTransform: 'uppercase',
                            letterSpacing: '.03em',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span>Difficulty Rigor</span>
                          {diffMismatch && (
                            <button
                              type="button"
                              onClick={() => equalizeDifficulty(key)}
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: '#b45309',
                                background: '#fef3c7',
                                border: '1px solid #fde68a',
                                borderRadius: 4,
                                padding: '1px 5px',
                                cursor: 'pointer',
                              }}
                            >
                              ⚡ Equalize ({diffTotal} vs {typeTotal})
                            </button>
                          )}
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 6,
                          }}
                        >
                          {/* Easy */}
                          <div
                            style={{
                              background: '#ffffff',
                              border: '1px solid #a7f3d0',
                              borderRadius: 8,
                              padding: '6px 8px',
                              textAlign: 'center',
                            }}
                          >
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#047857', display: 'block' }}>
                              Easy
                            </span>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: 4,
                              }}
                            >
                              <button
                                type="button"
                                style={{ width: 20, height: 20, borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 700, fontSize: 12, lineHeight: 1 }}
                                disabled={cfg.beginnerCount <= 0}
                                onClick={() => updateTopicField(key, 'beginnerCount', -1)}
                              >
                                −
                              </button>
                              <span style={{ fontSize: 13, fontWeight: 800, color: '#047857' }}>
                                {cfg.beginnerCount}
                              </span>
                              <button
                                type="button"
                                style={{ width: 20, height: 20, borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 700, fontSize: 12, lineHeight: 1 }}
                                onClick={() => updateTopicField(key, 'beginnerCount', 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Medium */}
                          <div
                            style={{
                              background: '#ffffff',
                              border: '1px solid #fde68a',
                              borderRadius: 8,
                              padding: '6px 8px',
                              textAlign: 'center',
                            }}
                          >
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#b45309', display: 'block' }}>
                              Medium
                            </span>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: 4,
                              }}
                            >
                              <button
                                type="button"
                                style={{ width: 20, height: 20, borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 700, fontSize: 12, lineHeight: 1 }}
                                disabled={cfg.intermediateCount <= 0}
                                onClick={() => updateTopicField(key, 'intermediateCount', -1)}
                              >
                                −
                              </button>
                              <span style={{ fontSize: 13, fontWeight: 800, color: '#b45309' }}>
                                {cfg.intermediateCount}
                              </span>
                              <button
                                type="button"
                                style={{ width: 20, height: 20, borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 700, fontSize: 12, lineHeight: 1 }}
                                onClick={() => updateTopicField(key, 'intermediateCount', 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Hard */}
                          <div
                            style={{
                              background: '#ffffff',
                              border: '1px solid #fecaca',
                              borderRadius: 8,
                              padding: '6px 8px',
                              textAlign: 'center',
                            }}
                          >
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#b91c1c', display: 'block' }}>
                              Hard
                            </span>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: 4,
                              }}
                            >
                              <button
                                type="button"
                                style={{ width: 20, height: 20, borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 700, fontSize: 12, lineHeight: 1 }}
                                disabled={cfg.advancedCount <= 0}
                                onClick={() => updateTopicField(key, 'advancedCount', -1)}
                              >
                                −
                              </button>
                              <span style={{ fontSize: 13, fontWeight: 800, color: '#b91c1c' }}>
                                {cfg.advancedCount}
                              </span>
                              <button
                                type="button"
                                style={{ width: 20, height: 20, borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 700, fontSize: 12, lineHeight: 1 }}
                                onClick={() => updateTopicField(key, 'advancedCount', 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
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
