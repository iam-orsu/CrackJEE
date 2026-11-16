import type { Subject } from '@/types';
import type { DiffOption, MarkingScheme, QuestionTypeCounts, DifficultyDistribution } from './shared';
import type { PracticeExamConfig } from './examConfig';

interface SessionSettingsProps {
  config: PracticeExamConfig;
  questionCount: number | 'custom';
  onQuestionCount: (value: number | 'custom') => void;
  customCount: string;
  onCustomCount: (value: string) => void;
  difficulty: DiffOption;
  onDifficulty: (value: DiffOption) => void;
  difficultyMode: 'preset' | 'custom';
  onDifficultyMode: (mode: 'preset' | 'custom') => void;
  difficultyDistribution: DifficultyDistribution;
  onDifficultyDistribution: (dist: DifficultyDistribution | ((prev: DifficultyDistribution) => DifficultyDistribution)) => void;
  questionTypeCounts: QuestionTypeCounts;
  onQuestionTypeCounts: (counts: QuestionTypeCounts | ((prev: QuestionTypeCounts) => QuestionTypeCounts)) => void;
  examType: 'Main' | 'Advanced';
  onExamType: (value: 'Main' | 'Advanced') => void;
  markingScheme: MarkingScheme;
  onMarkingScheme: (value: MarkingScheme) => void;
  perSubjectCount: number;
  selectedSubjects: Set<Subject>;
  selectedTopics: Partial<Record<Subject, Set<string>>>;
}

export function SessionSettings({
  config,
  questionCount,
  onQuestionCount,
  customCount,
  onCustomCount,
  difficulty,
  onDifficulty,
  difficultyMode,
  onDifficultyMode,
  difficultyDistribution,
  onDifficultyDistribution,
  questionTypeCounts,
  onQuestionTypeCounts,
  examType,
  onExamType,
  markingScheme,
  onMarkingScheme,
  perSubjectCount,
  selectedSubjects,
  selectedTopics,
}: SessionSettingsProps) {
  const isNeet = config.exam === 'NEET';
  const examLabel = isNeet ? 'NEET UG' : `JEE ${examType}`;
  const isAdvanced = !isNeet && examType === 'Advanced';

  // Total allocated question types
  const totalAllocatedTypes =
    (questionTypeCounts.mcq_single || 0) +
    (questionTypeCounts.integer || 0) +
    (questionTypeCounts.matrix_match || 0) +
    (isAdvanced ? (questionTypeCounts.mcq_multi || 0) : 0);

  const typeDiff = perSubjectCount - totalAllocatedTypes;

  // Percentage distribution total
  const totalPct =
    (difficultyDistribution.beginner || 0) +
    (difficultyDistribution.intermediate || 0) +
    (difficultyDistribution.advanced || 0);

  // Stepper helper for question types
  const updateTypeCount = (key: keyof QuestionTypeCounts, delta: number) => {
    onQuestionTypeCounts((prev) => {
      const current = prev[key] || 0;
      if (delta > 0 && totalAllocatedTypes >= perSubjectCount) {
        return prev;
      }
      const next = Math.max(0, current + delta);
      return { ...prev, [key]: next };
    });
  };

  const setDirectTypeCount = (key: keyof QuestionTypeCounts, value: number) => {
    onQuestionTypeCounts((prev) => {
      const otherTypesSum =
        (prev.mcq_single || 0) +
        (prev.integer || 0) +
        (prev.matrix_match || 0) +
        (isAdvanced ? (prev.mcq_multi || 0) : 0) -
        (prev[key] || 0);
      const maxAllowed = Math.max(0, perSubjectCount - otherTypesSum);
      const parsed = isNaN(value) ? 0 : Math.max(0, value);
      return {
        ...prev,
        [key]: Math.min(parsed, maxAllowed),
      };
    });
  };

  // Auto-balance question types to match perSubjectCount
  const handleAutoBalanceTypes = () => {
    if (typeDiff === 0) return;
    onQuestionTypeCounts((prev) => {
      const next = { ...prev };
      if (typeDiff > 0) {
        // Add remaining to single choice
        next.mcq_single = (next.mcq_single || 0) + typeDiff;
      } else {
        // Reduce from types starting with single choice, then numerical, then matrix
        let toRemove = Math.abs(typeDiff);
        if ((next.mcq_single || 0) >= toRemove) {
          next.mcq_single = (next.mcq_single || 0) - toRemove;
        } else {
          toRemove -= next.mcq_single || 0;
          next.mcq_single = 0;
          if ((next.integer || 0) >= toRemove) {
            next.integer = (next.integer || 0) - toRemove;
          } else {
            toRemove -= next.integer || 0;
            next.integer = 0;
            next.matrix_match = Math.max(0, (next.matrix_match || 0) - toRemove);
          }
        }
      }
      return next;
    });
  };

  // Type presets
  const applyTypePreset = (preset: 'all_single' | 'all_integer' | 'all_matrix' | 'exam_mix') => {
    if (preset === 'all_single') {
      onQuestionTypeCounts({
        mcq_single: perSubjectCount,
        integer: 0,
        matrix_match: 0,
        mcq_multi: 0,
      });
    } else if (preset === 'all_integer') {
      onQuestionTypeCounts({
        mcq_single: 0,
        integer: perSubjectCount,
        matrix_match: 0,
        mcq_multi: 0,
      });
    } else if (preset === 'all_matrix') {
      onQuestionTypeCounts({
        mcq_single: 0,
        integer: 0,
        matrix_match: perSubjectCount,
        mcq_multi: 0,
      });
    } else if (preset === 'exam_mix') {
      if (isNeet) {
        const matrix = Math.max(1, Math.round(perSubjectCount * 0.2));
        const single = Math.max(0, perSubjectCount - matrix);
        onQuestionTypeCounts({ mcq_single: single, integer: 0, matrix_match: matrix, mcq_multi: 0 });
      } else if (isAdvanced) {
        const matrix = Math.max(1, Math.round(perSubjectCount * 0.2));
        const integer = Math.max(1, Math.round(perSubjectCount * 0.2));
        const multi = Math.max(1, Math.round(perSubjectCount * 0.2));
        const single = Math.max(0, perSubjectCount - matrix - integer - multi);
        onQuestionTypeCounts({ mcq_single: single, integer, matrix_match: matrix, mcq_multi: multi });
      } else {
        const matrix = Math.max(1, Math.round(perSubjectCount * 0.2));
        const integer = Math.max(1, Math.round(perSubjectCount * 0.2));
        const single = Math.max(0, perSubjectCount - matrix - integer);
        onQuestionTypeCounts({ mcq_single: single, integer, matrix_match: matrix, mcq_multi: 0 });
      }
    }
  };

  // Percentage distribution presets
  const applyDifficultyPreset = (b: number, i: number, a: number) => {
    onDifficultyMode('custom');
    onDifficulty('mixed');
    onDifficultyDistribution({ beginner: b, intermediate: i, advanced: a });
  };

  // Auto-normalize percentages to 100%
  const handleNormalizePercentages = () => {
    if (totalPct <= 0) {
      onDifficultyDistribution({ beginner: 34, intermediate: 33, advanced: 33 });
      return;
    }
    const b = Math.round(((difficultyDistribution.beginner || 0) / totalPct) * 100);
    const i = Math.round(((difficultyDistribution.intermediate || 0) / totalPct) * 100);
    const a = 100 - b - i;
    onDifficultyDistribution({ beginner: Math.max(0, b), intermediate: Math.max(0, i), advanced: Math.max(0, a) });
  };

  // Calculate question count for a given percentage
  const getCountForPct = (pct: number) => {
    return Math.round((pct / (totalPct || 100)) * perSubjectCount);
  };

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

      {/* ── 2. Question Types Breakdown (Boss Feature 1) ── */}
      <div className="config-row" style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <p className="config-label" style={{ marginBottom: 2 }}>Question types (per subject)</p>
            <p style={{ fontSize: 12, color: 'var(--gray-500)', margin: 0 }}>
              Specify how many questions of each type you want in each subject.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                background: typeDiff === 0 ? 'var(--green-50)' : typeDiff < 0 ? 'var(--red-50)' : 'var(--amber-50)',
                color: typeDiff === 0 ? 'var(--green-600)' : typeDiff < 0 ? 'var(--red-600)' : 'var(--amber-600)',
                border: `1px solid ${typeDiff === 0 ? 'var(--green-100)' : typeDiff < 0 ? 'var(--red-100)' : 'var(--amber-100)'}`,
              }}
            >
              {typeDiff === 0
                ? `✓ ${totalAllocatedTypes}/${perSubjectCount} matched`
                : typeDiff < 0
                ? `⚠️ ${totalAllocatedTypes}/${perSubjectCount} (${Math.abs(typeDiff)} over!)`
                : `⚠️ ${totalAllocatedTypes}/${perSubjectCount} (${typeDiff} needed)`}
            </span>
            {typeDiff !== 0 && (
              <button
                type="button"
                onClick={handleAutoBalanceTypes}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--primary)',
                  background: 'var(--navy-50)',
                  border: '1px solid var(--navy-200)',
                  borderRadius: 'var(--radius-full)',
                  padding: '3px 8px',
                  cursor: 'pointer',
                }}
              >
                Auto-balance
              </button>
            )}
          </div>
        </div>

        {/* Warning Banner if types are over-allocated or under-allocated */}
        {typeDiff !== 0 && (
          <div
            className={`badge ${typeDiff < 0 ? 'badge-red' : 'badge-amber'}`}
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 12,
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            <span>
              ⚠️ <strong>{typeDiff < 0 ? 'Question limit exceeded' : 'Questions under-allocated'}:</strong>{' '}
              {typeDiff < 0
                ? `You have allocated ${totalAllocatedTypes} questions, which is ${Math.abs(typeDiff)} more than the ${perSubjectCount} per subject required. Please reduce question counts or click Auto-balance.`
                : `You have allocated ${totalAllocatedTypes} of ${perSubjectCount} questions (${typeDiff} more needed). Please add questions or click Auto-balance.`}
            </span>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              style={{ whiteSpace: 'nowrap', fontSize: 11, padding: '4px 10px' }}
              onClick={handleAutoBalanceTypes}
            >
              Auto-balance to {perSubjectCount}
            </button>
          </div>
        )}

        {/* Quick type presets */}
        <div className="pill-group" style={{ marginBottom: 14 }}>
          <button
            type="button"
            className="pill"
            style={{ fontSize: 12, padding: '5px 12px' }}
            onClick={() => applyTypePreset('exam_mix')}
          >
            Exam Mix
          </button>
          <button
            type="button"
            className="pill"
            style={{ fontSize: 12, padding: '5px 12px' }}
            onClick={() => applyTypePreset('all_single')}
          >
            All Single Choice
          </button>
          {!isNeet && (
            <button
              type="button"
              className="pill"
              style={{ fontSize: 12, padding: '5px 12px' }}
              onClick={() => applyTypePreset('all_integer')}
            >
              All Numerical
            </button>
          )}
          <button
            type="button"
            className="pill"
            style={{ fontSize: 12, padding: '5px 12px' }}
            onClick={() => applyTypePreset('all_matrix')}
          >
            All Matrix Match
          </button>
        </div>

        {/* Type stepper cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 10 }}>
          {/* Single Choice MCQ */}
          <div
            style={{
              background: 'var(--white)',
              border: typeDiff < 0 ? '1.5px solid var(--red-600)' : '1.5px solid var(--gray-200)',
              borderRadius: 'var(--radius-lg)',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'border-color 0.2s ease',
            }}
          >
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)' }}>Single Choice</span>
                <span style={{ fontSize: 10, fontWeight: 700, background: 'var(--gray-100)', color: 'var(--gray-600)', padding: '2px 6px', borderRadius: 4 }}>MCQ</span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--gray-400)', margin: '2px 0 0' }}>4 options, 1 correct</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ width: 28, height: 28, padding: 0, borderRadius: 6, fontSize: 16, border: '1px solid var(--gray-200)' }}
                disabled={(questionTypeCounts.mcq_single || 0) <= 0}
                onClick={() => updateTypeCount('mcq_single', -1)}
              >
                −
              </button>
              <input
                type="number"
                min={0}
                max={perSubjectCount}
                value={questionTypeCounts.mcq_single || 0}
                onChange={(e) => setDirectTypeCount('mcq_single', parseInt(e.target.value, 10))}
                style={{ width: 44, textAlign: 'center', fontWeight: 700, fontSize: 15, border: 'none', background: 'transparent', outline: 'none' }}
              />
              <button
                type="button"
                className="btn btn-ghost"
                style={{ width: 28, height: 28, padding: 0, borderRadius: 6, fontSize: 16, border: '1px solid var(--gray-200)' }}
                disabled={totalAllocatedTypes >= perSubjectCount}
                onClick={() => updateTypeCount('mcq_single', 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Numerical / Integer (JEE) */}
          {!isNeet && (
            <div
              style={{
                background: 'var(--white)',
                border: typeDiff < 0 ? '1.5px solid var(--red-600)' : '1.5px solid var(--gray-200)',
                borderRadius: 'var(--radius-lg)',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s ease',
              }}
            >
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)' }}>Numerical / Integer</span>
                  <span style={{ fontSize: 10, fontWeight: 700, background: 'var(--gray-100)', color: 'var(--gray-600)', padding: '2px 6px', borderRadius: 4 }}>NUM</span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--gray-400)', margin: '2px 0 0' }}>Direct value answer</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ width: 28, height: 28, padding: 0, borderRadius: 6, fontSize: 16, border: '1px solid var(--gray-200)' }}
                  disabled={(questionTypeCounts.integer || 0) <= 0}
                  onClick={() => updateTypeCount('integer', -1)}
                >
                  −
                </button>
                <input
                  type="number"
                  min={0}
                  max={perSubjectCount}
                  value={questionTypeCounts.integer || 0}
                  onChange={(e) => setDirectTypeCount('integer', parseInt(e.target.value, 10))}
                  style={{ width: 44, textAlign: 'center', fontWeight: 700, fontSize: 15, border: 'none', background: 'transparent', outline: 'none' }}
                />
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ width: 28, height: 28, padding: 0, borderRadius: 6, fontSize: 16, border: '1px solid var(--gray-200)' }}
                  disabled={totalAllocatedTypes >= perSubjectCount}
                  onClick={() => updateTypeCount('integer', 1)}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Matrix Match */}
          <div
            style={{
              background: 'var(--white)',
              border: typeDiff < 0 ? '1.5px solid var(--red-600)' : '1.5px solid var(--gray-200)',
              borderRadius: 'var(--radius-lg)',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'border-color 0.2s ease',
            }}
          >
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)' }}>Matrix Match</span>
                <span style={{ fontSize: 10, fontWeight: 700, background: 'var(--gray-100)', color: 'var(--gray-600)', padding: '2px 6px', borderRadius: 4 }}>MATRIX</span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--gray-400)', margin: '2px 0 0' }}>Col I to Col II mapping</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ width: 28, height: 28, padding: 0, borderRadius: 6, fontSize: 16, border: '1px solid var(--gray-200)' }}
                disabled={(questionTypeCounts.matrix_match || 0) <= 0}
                onClick={() => updateTypeCount('matrix_match', -1)}
              >
                −
              </button>
              <input
                type="number"
                min={0}
                max={perSubjectCount}
                value={questionTypeCounts.matrix_match || 0}
                onChange={(e) => setDirectTypeCount('matrix_match', parseInt(e.target.value, 10))}
                style={{ width: 44, textAlign: 'center', fontWeight: 700, fontSize: 15, border: 'none', background: 'transparent', outline: 'none' }}
              />
              <button
                type="button"
                className="btn btn-ghost"
                style={{ width: 28, height: 28, padding: 0, borderRadius: 6, fontSize: 16, border: '1px solid var(--gray-200)' }}
                disabled={totalAllocatedTypes >= perSubjectCount}
                onClick={() => updateTypeCount('matrix_match', 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Multiple Correct (JEE Advanced only) */}
          {isAdvanced && (
            <div
              style={{
                background: 'var(--white)',
                border: typeDiff < 0 ? '1.5px solid var(--red-600)' : '1.5px solid var(--gray-200)',
                borderRadius: 'var(--radius-lg)',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s ease',
              }}
            >
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)' }}>Multiple Correct</span>
                  <span style={{ fontSize: 10, fontWeight: 700, background: 'var(--gray-100)', color: 'var(--gray-600)', padding: '2px 6px', borderRadius: 4 }}>MULTI</span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--gray-400)', margin: '2px 0 0' }}>1 or more correct</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ width: 28, height: 28, padding: 0, borderRadius: 6, fontSize: 16, border: '1px solid var(--gray-200)' }}
                  disabled={(questionTypeCounts.mcq_multi || 0) <= 0}
                  onClick={() => updateTypeCount('mcq_multi', -1)}
                >
                  −
                </button>
                <input
                  type="number"
                  min={0}
                  max={perSubjectCount}
                  value={questionTypeCounts.mcq_multi || 0}
                  onChange={(e) => setDirectTypeCount('mcq_multi', parseInt(e.target.value, 10))}
                  style={{ width: 44, textAlign: 'center', fontWeight: 700, fontSize: 15, border: 'none', background: 'transparent', outline: 'none' }}
                />
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ width: 28, height: 28, padding: 0, borderRadius: 6, fontSize: 16, border: '1px solid var(--gray-200)' }}
                  disabled={totalAllocatedTypes >= perSubjectCount}
                  onClick={() => updateTypeCount('mcq_multi', 1)}
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 3. Difficulty & Percentage Distribution (Boss Feature 2) ── */}
      <div className="config-row" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <p className="config-label" style={{ marginBottom: 2 }}>Difficulty &amp; percentage distribution</p>
            <p style={{ fontSize: 12, color: 'var(--gray-500)', margin: 0 }}>
              Choose a preset level or customize percentages (Easy, Medium, Hard).
            </p>
          </div>
          {difficultyMode === 'custom' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: totalPct === 100 ? 'var(--green-50)' : totalPct > 100 ? 'var(--red-50)' : 'var(--amber-50)',
                  color: totalPct === 100 ? 'var(--green-600)' : totalPct > 100 ? 'var(--red-600)' : 'var(--amber-600)',
                  border: `1px solid ${totalPct === 100 ? 'var(--green-100)' : totalPct > 100 ? 'var(--red-100)' : 'var(--amber-100)'}`,
                }}
              >
                {totalPct === 100 ? '✓ Total: 100%' : totalPct > 100 ? `⚠️ Total: ${totalPct}% (${totalPct - 100}% over!)` : `⚠️ Total: ${totalPct}% (${100 - totalPct}% needed)`}
              </span>
              {totalPct !== 100 && (
                <button
                  type="button"
                  onClick={handleNormalizePercentages}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--primary)',
                    background: 'var(--navy-50)',
                    border: '1px solid var(--navy-200)',
                    borderRadius: 'var(--radius-full)',
                    padding: '3px 8px',
                    cursor: 'pointer',
                  }}
                >
                  Normalize to 100%
                </button>
              )}
            </div>
          )}
        </div>

        {/* Warning Banner if difficulty percentages do not equal 100% */}
        {difficultyMode === 'custom' && totalPct !== 100 && (
          <div
            className={`badge ${totalPct > 100 ? 'badge-red' : 'badge-amber'}`}
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 12,
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            <span>
              ⚠️ <strong>Difficulty percentage mismatch:</strong> Total must equal exactly 100% (currently {totalPct}%).{' '}
              {totalPct > 100
                ? `Please reduce percentages by ${totalPct - 100}% or click Normalize to 100%.`
                : `Please increase percentages by ${100 - totalPct}% or click Normalize to 100%.`}
            </span>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              style={{ whiteSpace: 'nowrap', fontSize: 11, padding: '4px 10px' }}
              onClick={handleNormalizePercentages}
            >
              Normalize to 100%
            </button>
          </div>
        )}

        {/* Main Difficulty Pills */}
        <div className="pill-group" style={{ marginBottom: 12 }}>
          <button
            className={`pill${difficultyMode === 'preset' && difficulty === 'mixed' ? ' selected' : ''}`}
            onClick={() => {
              onDifficultyMode('preset');
              onDifficulty('mixed');
            }}
          >
            All levels (Mixed)
          </button>
          <button
            className={`pill${difficultyMode === 'custom' ? ' selected' : ''}`}
            onClick={() => onDifficultyMode('custom')}
          >
            Custom percentages %
          </button>
          <button
            className={`pill${difficultyMode === 'preset' && difficulty === 'beginner' ? ' selected' : ''}`}
            onClick={() => {
              onDifficultyMode('preset');
              onDifficulty('beginner');
            }}
          >
            Beginner (Easy)
          </button>
          <button
            className={`pill${difficultyMode === 'preset' && difficulty === 'intermediate' ? ' selected' : ''}`}
            onClick={() => {
              onDifficultyMode('preset');
              onDifficulty('intermediate');
            }}
          >
            Intermediate (Medium)
          </button>
          <button
            className={`pill${difficultyMode === 'preset' && difficulty === 'advanced' ? ' selected' : ''}`}
            onClick={() => {
              onDifficultyMode('preset');
              onDifficulty('advanced');
            }}
          >
            Advanced (Hard)
          </button>
        </div>

        {/* Percentage Sliders and Quick Presets (when Custom % is selected) */}
        {difficultyMode === 'custom' && (
          <div
            style={{
              background: 'var(--gray-50)',
              border: totalPct !== 100 ? '1.5px solid var(--red-600)' : '1px solid var(--gray-200)',
              borderRadius: 'var(--radius-xl)',
              padding: 16,
              marginTop: 10,
              transition: 'border-color 0.2s ease',
            }}
          >
            {/* Quick Distribution Presets */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginRight: 4 }}>
                Presets:
              </span>
              <button
                type="button"
                className="pill"
                style={{
                  fontSize: 12,
                  padding: '4px 10px',
                  background:
                    difficultyDistribution.beginner === 30 &&
                    difficultyDistribution.intermediate === 30 &&
                    difficultyDistribution.advanced === 40
                      ? 'var(--primary)'
                      : 'var(--white)',
                  color:
                    difficultyDistribution.beginner === 30 &&
                    difficultyDistribution.intermediate === 30 &&
                    difficultyDistribution.advanced === 40
                      ? 'var(--white)'
                      : 'var(--gray-700)',
                }}
                onClick={() => applyDifficultyPreset(30, 30, 40)}
              >
                ★ 30% Easy · 30% Med · 40% Hard
              </button>
              <button
                type="button"
                className="pill"
                style={{
                  fontSize: 12,
                  padding: '4px 10px',
                  background:
                    difficultyDistribution.beginner === 34 &&
                    difficultyDistribution.intermediate === 33 &&
                    difficultyDistribution.advanced === 33
                      ? 'var(--primary)'
                      : 'var(--white)',
                  color:
                    difficultyDistribution.beginner === 34 &&
                    difficultyDistribution.intermediate === 33 &&
                    difficultyDistribution.advanced === 33
                      ? 'var(--white)'
                      : 'var(--gray-700)',
                }}
                onClick={() => applyDifficultyPreset(34, 33, 33)}
              >
                Balanced (34/33/33)
              </button>
              <button
                type="button"
                className="pill"
                style={{
                  fontSize: 12,
                  padding: '4px 10px',
                  background:
                    difficultyDistribution.beginner === 50 &&
                    difficultyDistribution.intermediate === 30 &&
                    difficultyDistribution.advanced === 20
                      ? 'var(--primary)'
                      : 'var(--white)',
                  color:
                    difficultyDistribution.beginner === 50 &&
                    difficultyDistribution.intermediate === 30 &&
                    difficultyDistribution.advanced === 20
                      ? 'var(--white)'
                      : 'var(--gray-700)',
                }}
                onClick={() => applyDifficultyPreset(50, 30, 20)}
              >
                Foundation (50/30/20)
              </button>
              <button
                type="button"
                className="pill"
                style={{
                  fontSize: 12,
                  padding: '4px 10px',
                  background:
                    difficultyDistribution.beginner === 20 &&
                    difficultyDistribution.intermediate === 40 &&
                    difficultyDistribution.advanced === 40
                      ? 'var(--primary)'
                      : 'var(--white)',
                  color:
                    difficultyDistribution.beginner === 20 &&
                    difficultyDistribution.intermediate === 40 &&
                    difficultyDistribution.advanced === 40
                      ? 'var(--white)'
                      : 'var(--gray-700)',
                }}
                onClick={() => applyDifficultyPreset(20, 40, 40)}
              >
                Rank Booster (20/40/40)
              </button>
            </div>

            {/* Visual Multi-Segment Bar */}
            <div
              style={{
                height: 10,
                width: '100%',
                borderRadius: 5,
                background: 'var(--gray-200)',
                display: 'flex',
                overflow: 'hidden',
                marginBottom: 16,
              }}
            >
              <div
                title={`Easy: ${difficultyDistribution.beginner || 0}%`}
                style={{
                  width: `${(difficultyDistribution.beginner || 0) / (totalPct || 100) * 100}%`,
                  background: '#22c55e',
                  transition: 'width 0.2s ease',
                }}
              />
              <div
                title={`Medium: ${difficultyDistribution.intermediate || 0}%`}
                style={{
                  width: `${(difficultyDistribution.intermediate || 0) / (totalPct || 100) * 100}%`,
                  background: '#eab308',
                  transition: 'width 0.2s ease',
                }}
              />
              <div
                title={`Hard: ${difficultyDistribution.advanced || 0}%`}
                style={{
                  width: `${(difficultyDistribution.advanced || 0) / (totalPct || 100) * 100}%`,
                  background: '#ef4444',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>

            {/* 3 Percentage Rows */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              {/* Beginner / Easy */}
              <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)' }}>Easy (Beginner)</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-500)' }}>
                    ~{getCountForPct(difficultyDistribution.beginner || 0)} Qs
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={difficultyDistribution.beginner || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      onDifficultyDistribution((prev) => ({ ...prev, beginner: val }));
                    }}
                    style={{ flex: 1, accentColor: '#22c55e' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={difficultyDistribution.beginner || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        onDifficultyDistribution((prev) => ({ ...prev, beginner: isNaN(val) ? 0 : val }));
                      }}
                      style={{ width: 44, textAlign: 'right', fontWeight: 700, fontSize: 14, border: '1px solid var(--gray-200)', borderRadius: 4, padding: '2px 4px' }}
                    />
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginLeft: 3 }}>%</span>
                  </div>
                </div>
              </div>

              {/* Intermediate / Medium */}
              <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#eab308' }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)' }}>Medium (Intermediate)</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-500)' }}>
                    ~{getCountForPct(difficultyDistribution.intermediate || 0)} Qs
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={difficultyDistribution.intermediate || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      onDifficultyDistribution((prev) => ({ ...prev, intermediate: val }));
                    }}
                    style={{ flex: 1, accentColor: '#eab308' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={difficultyDistribution.intermediate || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        onDifficultyDistribution((prev) => ({ ...prev, intermediate: isNaN(val) ? 0 : val }));
                      }}
                      style={{ width: 44, textAlign: 'right', fontWeight: 700, fontSize: 14, border: '1px solid var(--gray-200)', borderRadius: 4, padding: '2px 4px' }}
                    />
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginLeft: 3 }}>%</span>
                  </div>
                </div>
              </div>

              {/* Advanced / Hard */}
              <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)' }}>Hard (Advanced)</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-500)' }}>
                    ~{getCountForPct(difficultyDistribution.advanced || 0)} Qs
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={difficultyDistribution.advanced || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      onDifficultyDistribution((prev) => ({ ...prev, advanced: val }));
                    }}
                    style={{ flex: 1, accentColor: '#ef4444' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={difficultyDistribution.advanced || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        onDifficultyDistribution((prev) => ({ ...prev, advanced: isNaN(val) ? 0 : val }));
                      }}
                      style={{ width: 44, textAlign: 'right', fontWeight: 700, fontSize: 14, border: '1px solid var(--gray-200)', borderRadius: 4, padding: '2px 4px' }}
                    />
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginLeft: 3 }}>%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 4. Exam type & Marking scheme (JEE) ── */}
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

      {/* ── 5. Summary Info Card ── */}
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
            <strong style={{ color: 'var(--gray-900)' }}>
              {difficultyMode === 'custom'
                ? `${difficultyDistribution.beginner}% E / ${difficultyDistribution.intermediate}% M / ${difficultyDistribution.advanced}% H`
                : difficulty === 'mixed'
                ? 'All levels'
                : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </strong>{' '}
            <span style={{ color: 'var(--gray-500)' }}>difficulty</span>
          </span>

          <span>
            <strong style={{ color: 'var(--gray-900)' }}>
              {[
                (questionTypeCounts.mcq_single || 0) > 0 && `${questionTypeCounts.mcq_single} Single`,
                (questionTypeCounts.integer || 0) > 0 && `${questionTypeCounts.integer} Integer`,
                (questionTypeCounts.matrix_match || 0) > 0 && `${questionTypeCounts.matrix_match} Matrix`,
                isAdvanced && (questionTypeCounts.mcq_multi || 0) > 0 && `${questionTypeCounts.mcq_multi} Multi`,
              ].filter(Boolean).join(' · ')}
            </strong>{' '}
            <span style={{ color: 'var(--gray-500)' }}>types</span>
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
