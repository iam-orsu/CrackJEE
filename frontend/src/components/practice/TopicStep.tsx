import type { Subject } from '@/types';
import { CHECK_SVG } from './shared';

interface TopicStepProps {
  intro: string;
  selectedSubjects: Set<Subject>;
  selectedTopics: Partial<Record<Subject, Set<string>>>;
  studentClass: string;
  getTopicsForStudent: (subject: Subject) => { class11: string[]; class12: string[] };
  onToggleAllTopics: (subject: Subject) => void;
  onToggleTopic: (subject: Subject, topic: string) => void;
}

/* Step 2: pick topics for each chosen subject */
export function TopicStep({ intro, selectedSubjects, selectedTopics, studentClass, getTopicsForStudent, onToggleAllTopics, onToggleTopic }: TopicStepProps) {
  return (
    <>
      <p className="wizard-section-title">Which topics?</p>
      <p className="wizard-section-sub">{intro}</p>
      {Array.from(selectedSubjects).map((subject) => {
        const topics = getTopicsForStudent(subject);
        const cur = selectedTopics[subject] ?? new Set<string>();
        const allTopics = [...topics.class11, ...topics.class12];
        const allSelected = cur.size === allTopics.length;
        return (
          <div key={subject} className="topic-subject-section">
            <div className="topic-subject-header">
              <span className="topic-subject-name">{subject}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => onToggleAllTopics(subject)}>
                {allSelected ? 'Deselect all' : 'Select all'}
              </button>
            </div>
            {topics.class11.length > 0 && (
              <div className="topic-class-group">
                {studentClass !== '11' && <p className="topic-class-label">Class 11</p>}
                <div className="wizard-topic-grid">
                  {topics.class11.map((t) => (
                    <button key={t} className={`topic-chip${cur.has(t) ? ' selected' : ''}`} onClick={() => onToggleTopic(subject, t)}>
                      <span className="topic-chip-check">{cur.has(t) && CHECK_SVG}</span>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {topics.class12.length > 0 && (
              <div className="topic-class-group" style={{ marginTop: 10 }}>
                <p className="topic-class-label">Class 12</p>
                <div className="wizard-topic-grid">
                  {topics.class12.map((t) => (
                    <button key={t} className={`topic-chip${cur.has(t) ? ' selected' : ''}`} onClick={() => onToggleTopic(subject, t)}>
                      <span className="topic-chip-check">{cur.has(t) && CHECK_SVG}</span>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--gray-400)' }}>
              {cur.size} of {allTopics.length} topics selected
            </div>
          </div>
        );
      })}
    </>
  );
}
