'use client';

import React from 'react';
import type { Subject } from '@/types';
import type { MarkingScheme, TopicCustomConfig } from './shared';
import type { PracticeExamConfig } from './examConfig';
import { TopicBreakdownConfig } from './TopicBreakdownConfig';

interface SessionSettingsProps {
  config: PracticeExamConfig;
  questionCount: number | 'custom';
  onQuestionCount: (value: number | 'custom') => void;
  customCount: string;
  onCustomCount: (value: string) => void;
  examType: 'Main' | 'Advanced';
  onExamType: (value: 'Main' | 'Advanced') => void;
  markingScheme: MarkingScheme;
  onMarkingScheme: (value: MarkingScheme) => void;
  perSubjectCount: number;
  selectedSubjects: Set<Subject>;
  selectedTopics: Partial<Record<Subject, Set<string>>>;
  topicConfigs: Record<string, TopicCustomConfig>;
  onTopicConfigs: React.Dispatch<React.SetStateAction<Record<string, TopicCustomConfig>>>;
  onAutoDistributeSubject: (subject: Subject) => void;
  onAutoDistributeAll: () => void;
}

export function SessionSettings({
  config,
  questionCount,
  onQuestionCount,
  customCount,
  onCustomCount,
  examType,
  onExamType,
  markingScheme,
  onMarkingScheme,
  perSubjectCount,
  selectedSubjects,
  selectedTopics,
  topicConfigs,
  onTopicConfigs,
  onAutoDistributeSubject,
  onAutoDistributeAll,
}: SessionSettingsProps) {
  const isNeet = config.exam === 'NEET';
  const examLabel = isNeet ? 'NEET UG' : `JEE ${examType}`;
  const isAdvanced = !isNeet && examType === 'Advanced';

  return (
    <>
      <p className="wizard-section-title">Session settings</p>
      <p className="wizard-section-sub">{config.settingsNote}</p>

      {/* ── 1. Question count per subject ── */}
      <div className="config-row">
        <p className="config-label">How many questions per subject?</p>
        <div className="pill-group">
          {config.countOptions.map((n) => (
            <button
              key={n}
              className={`pill${questionCount === n ? ' selected' : ''}`}
              onClick={() => onQuestionCount(n)}
            >
              {n}
            </button>
          ))}
          <button
            className={`pill${questionCount === 'custom' ? ' selected' : ''}`}
            onClick={() => onQuestionCount('custom')}
          >
            Custom
          </button>
          {questionCount === 'custom' && (
            <input
              type="number"
              className="custom-count-input"
              placeholder={`1-${config.maxPerSubject}`}
              min={1}
              max={config.maxPerSubject}
              value={customCount}
              onChange={(e) => onCustomCount(e.target.value)}
            />
          )}
        </div>
      </div>

      {/* ── 2. Exam type & Marking scheme (JEE) ── */}
      {config.hasPapers && (
        <>
          <div className="config-row" style={{ marginTop: 20 }}>
            <p className="config-label">Exam type</p>
            <div className="pill-group">
              {(['Main', 'Advanced'] as const).map((e) => (
                <button
                  key={e}
                  className={`pill${examType === e ? ' selected' : ''}`}
                  onClick={() => onExamType(e)}
                >
                  JEE {e}
                </button>
              ))}
            </div>
          </div>

          <div className="config-row">
            <p className="config-label">Marking scheme</p>
            <div className="pill-group">
              {[
                { key: 'standard',     label: 'Standard (1/0)'              },
                { key: 'jee_main',     label: 'JEE Main (+4/−1)'            },
                { key: 'jee_advanced', label: 'JEE Advanced (+4/−2 wrong)'  },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  className={`pill${markingScheme === key ? ' selected' : ''}`}
                  onClick={() => onMarkingScheme(key as MarkingScheme)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── 3. Granular Topic Breakdown (Per-Topic Types & Difficulty) ── */}
      <TopicBreakdownConfig
        selectedSubjects={selectedSubjects}
        selectedTopics={selectedTopics}
        perSubjectCount={perSubjectCount}
        isNeet={isNeet}
        isAdvanced={isAdvanced}
        topicConfigs={topicConfigs}
        onTopicConfigs={onTopicConfigs}
        onAutoDistributeSubject={onAutoDistributeSubject}
        onAutoDistributeAll={onAutoDistributeAll}
      />

      {/* ── 4. Summary Info Card ── */}
      <div
        className="card card-sm"
        style={{
          background: 'var(--gray-50)',
          border: '1px solid var(--gray-200)',
          marginTop: 16,
          padding: '14px 18px',
        }}
      >
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13, alignItems: 'center' }}>
          <span>
            <strong style={{ color: 'var(--gray-900)' }}>{perSubjectCount}</strong>{' '}
            <span style={{ color: 'var(--gray-500)' }}>per subject</span>
            {selectedSubjects.size > 1 && (
              <span style={{ color: 'var(--gray-400)', marginLeft: 4 }}>
                ({perSubjectCount * selectedSubjects.size} total)
              </span>
            )}
          </span>

          <span>
            <strong style={{ color: 'var(--gray-900)' }}>{examLabel}</strong>
          </span>

          <span>
            <strong style={{ color: 'var(--gray-900)' }}>{Array.from(selectedSubjects).join(', ')}</strong>
          </span>

          <span>
            <strong style={{ color: 'var(--gray-900)' }}>
              {Array.from(selectedSubjects).reduce((acc, s) => acc + (selectedTopics[s]?.size ?? 0), 0)}
            </strong>{' '}
            <span style={{ color: 'var(--gray-500)' }}>topics</span>
          </span>
        </div>
      </div>
    </>
  );
}
