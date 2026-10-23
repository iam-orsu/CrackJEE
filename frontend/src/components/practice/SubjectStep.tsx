import type { Subject } from '@/types';
import type { SplitTopics } from '@/lib/api';
import { SUBJECT_ICON } from '@/lib/subjects';
import type { PracticeExamConfig } from './examConfig';

interface SubjectStepProps {
  config: PracticeExamConfig;
  selectedSubjects: Set<Subject>;
  topicsByClass: SplitTopics | null;
  bank: { total: number; bySubject: Record<string, number> } | null;
  onSelectAll: () => void;
  onToggleSubject: (subject: Subject) => void;
}

/* Step 1: pick the subjects to practise (one or more, or all of them) */
export function SubjectStep({ config, selectedSubjects, topicsByClass, bank, onSelectAll, onToggleSubject }: SubjectStepProps) {
  return (
    <>
      <p className="wizard-section-title">Which subjects?</p>
      <p className="wizard-section-sub">{config.subjectsIntro}</p>
      <div className="subject-cards">
        <div className={`subject-card${selectedSubjects.size === config.subjects.length ? ' selected' : ''}`} onClick={onSelectAll}>
          <span className="subject-card-emoji">{config.allIcon}</span>
          <span className="subject-card-name">{config.allLabel}</span>
          <span className="subject-card-sub">Full coverage</span>
        </div>
        {config.subjects.map((s) => {
          const t = topicsByClass?.[s];
          const topicCount = t ? (t.class11.length + t.class12.length) : null;
          const questionCount = bank?.bySubject[s];
          return (
            <div key={s} className={`subject-card${selectedSubjects.has(s) ? ' selected' : ''}`} onClick={() => onToggleSubject(s)}>
              <span className="subject-card-emoji" style={{ fontFamily: 'serif', fontSize: 28 }}>{SUBJECT_ICON[s]}</span>
              <span className="subject-card-name">{s}</span>
              <span className="subject-card-sub">
                {topicCount !== null ? `${topicCount} topics` : 'Loading...'}
                {questionCount !== undefined && ` · ${questionCount.toLocaleString('en-IN')} questions`}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 12, fontSize: 13, color: 'var(--gray-500)' }}>
        {selectedSubjects.size} subject{selectedSubjects.size !== 1 ? 's' : ''} selected
      </div>
    </>
  );
}
