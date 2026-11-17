import type { Subject } from '@/types';
import { CHECK_SVG } from './shared';
import { ALL_SKIN, SKIN, SYMBOL, skinVars } from './skin';

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
        const allSelected = cur.size === allTopics.length && allTopics.length > 0;
        const pct = allTopics.length ? Math.round((cur.size / allTopics.length) * 100) : 0;
        const skin = SKIN[subject] ?? ALL_SKIN;

        const renderClass = (label: string, list: string[]) => (
          <div className="topic-class">
            <p className="topic-class-label">{label}</p>
            <div className="topic-chip-row">
              {list.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`topic-chip${cur.has(t) ? ' selected' : ''}`}
                  onClick={() => onToggleTopic(subject, t)}
                >
                  <span className="topic-chip-check">{cur.has(t) && CHECK_SVG}</span>
                  {t}
                </button>
              ))}
            </div>
          </div>
        );

        return (
          <section key={subject} className="topic-panel" style={skinVars(skin)}>
            <header className="topic-head">
              <span className="topic-symbol" aria-hidden>{SYMBOL[subject] ?? '·'}</span>
              <h3 className="topic-name">{subject}</h3>
              <button type="button" className="topic-all" onClick={() => onToggleAllTopics(subject)}>
                {allSelected ? 'Deselect all' : 'Select all'}
              </button>
            </header>

            <div className="topic-progress">
              <span className="topic-track">
                <span className="topic-fill" style={{ width: `${pct}%` }} />
              </span>
              <span className="topic-count">{cur.size} of {allTopics.length} selected</span>
            </div>

            {topics.class11.length > 0 && renderClass(studentClass === '11' ? 'Syllabus' : 'Class 11', topics.class11)}
            {topics.class12.length > 0 && renderClass('Class 12', topics.class12)}
          </section>
        );
      })}
    </>
  );
}
