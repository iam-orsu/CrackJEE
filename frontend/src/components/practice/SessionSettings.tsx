import type { Subject } from '@/types';
import type { DiffOption, MarkingScheme } from './shared';

interface SessionSettingsProps {
  questionCount: number | 'custom';
  onQuestionCount: (value: number | 'custom') => void;
  customCount: string;
  onCustomCount: (value: string) => void;
  difficulty: DiffOption;
  onDifficulty: (value: DiffOption) => void;
  examType: 'Main' | 'Advanced';
  onExamType: (value: 'Main' | 'Advanced') => void;
  markingScheme: MarkingScheme;
  onMarkingScheme: (value: MarkingScheme) => void;
  perSubjectCount: number;
  selectedSubjects: Set<Subject>;
  selectedTopics: Partial<Record<Subject, Set<string>>>;
}

/* Step 3 (settings): how many questions, difficulty, exam type and marking scheme */
export function SessionSettings({ questionCount, onQuestionCount, customCount, onCustomCount, difficulty, onDifficulty, examType, onExamType, markingScheme, onMarkingScheme, perSubjectCount, selectedSubjects, selectedTopics }: SessionSettingsProps) {
  return (
    <>
      <p className="wizard-section-title">Session settings</p>
      <p className="wizard-section-sub">Configure your exam session.</p>

      <div className="config-row">
        <p className="config-label">How many questions per subject?</p>
        <div className="pill-group">
          {([5, 10, 20, 30] as const).map((n) => (
            <button key={n} className={`pill${questionCount === n ? ' selected' : ''}`} onClick={() => onQuestionCount(n)}>{n}</button>
          ))}
          <button className={`pill${questionCount === 'custom' ? ' selected' : ''}`} onClick={() => onQuestionCount('custom')}>Custom</button>
          {questionCount === 'custom' && (
            <input type="number" className="custom-count-input" placeholder="1-30" min={1} max={30}
              value={customCount} onChange={(e) => onCustomCount(e.target.value)} />
          )}
        </div>
      </div>

      <div className="config-row">
        <p className="config-label">Difficulty</p>
        <div className="pill-group">
          {(['mixed', 'beginner', 'intermediate', 'advanced'] as DiffOption[]).map((d) => (
            <button key={d} className={`pill${difficulty === d ? ' selected' : ''}`} onClick={() => onDifficulty(d)} style={{ textTransform: 'capitalize' }}>
              {d === 'mixed' ? 'All levels' : d}
            </button>
          ))}
        </div>
      </div>

      <div className="config-row">
        <p className="config-label">Exam type</p>
        <div className="pill-group">
          {(['Main', 'Advanced'] as const).map((e) => (
            <button key={e} className={`pill${examType === e ? ' selected' : ''}`} onClick={() => onExamType(e)}>JEE {e}</button>
          ))}
        </div>
      </div>

      <div className="config-row">
        <p className="config-label">Marking scheme</p>
        <div className="pill-group">
          {([
            { key: 'standard',     label: 'Standard (1/0)'              },
            { key: 'jee_main',     label: 'JEE Main (+4/−1)'            },
            { key: 'jee_advanced', label: 'JEE Advanced (+4/−2 wrong)'  },
          ] as const).map(({ key, label }) => (
            <button key={key} className={`pill${markingScheme === key ? ' selected' : ''}`} onClick={() => onMarkingScheme(key)}>{label}</button>
          ))}
        </div>
      </div>

      <div className="card card-sm" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', marginTop: 8 }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 13 }}>
          <span>
            <strong style={{ color: 'var(--gray-900)' }}>{perSubjectCount}</strong>{' '}
            <span style={{ color: 'var(--gray-500)' }}>per subject</span>
            {selectedSubjects.size > 1 && (
              <span style={{ color: 'var(--gray-400)', marginLeft: 4 }}>({perSubjectCount * selectedSubjects.size} total)</span>
            )}
          </span>
          <span>
            <strong style={{ color: 'var(--gray-900)', textTransform: 'capitalize' }}>{difficulty}</strong>{' '}
            <span style={{ color: 'var(--gray-500)' }}>difficulty</span>
          </span>
          <span><strong style={{ color: 'var(--gray-900)' }}>JEE {examType}</strong></span>
          <span><strong style={{ color: 'var(--gray-900)' }}>{Array.from(selectedSubjects).join(', ')}</strong></span>
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
