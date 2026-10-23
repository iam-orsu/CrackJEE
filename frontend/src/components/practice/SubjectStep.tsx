import type { Subject } from '@/types';
import type { SplitTopics } from '@/lib/api';
import { SUBJECT_META } from './shared';

interface SubjectStepProps {
  selectedSubjects: Set<Subject>;
  topicsByClass: SplitTopics | null;
  bank: { total: number; bySubject: Record<string, number> } | null;
  onSelectAll: () => void;
  onToggleSubject: (subject: Subject) => void;
}

/* Step 1: pick one, two or all three subjects */
export function SubjectStep({ selectedSubjects, topicsByClass, bank, onSelectAll, onToggleSubject }: SubjectStepProps) {
  const subjects: Subject[] = ['Mathematics', 'Physics', 'Chemistry'];
  return (
    <>
      <p className="wizard-section-title">Which subjects?</p>
      <p className="wizard-section-sub">Pick one or more. You can practice MPC together or focus on one.</p>
      <div className="subject-cards">
        <div className={`subject-card${selectedSubjects.size === 3 ? ' selected' : ''}`} onClick={onSelectAll}>
          <span className="subject-card-emoji">MPC</span>
          <span className="subject-card-name">All Three</span>
          <span className="subject-card-sub">Full coverage</span>
        </div>
        {subjects.map((s) => {
          const t = topicsByClass?.[s];
          const topicCount = t ? (t.class11.length + t.class12.length) : null;
          const questionCount = bank?.bySubject[s];
          return (
            <div key={s} className={`subject-card${selectedSubjects.has(s) ? ' selected' : ''}`} onClick={() => onToggleSubject(s)}>
              <span className="subject-card-emoji" style={{ fontFamily: 'serif', fontSize: 28 }}>{SUBJECT_META[s].emoji}</span>
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
