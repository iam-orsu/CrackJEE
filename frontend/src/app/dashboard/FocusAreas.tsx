import Link from 'next/link';
import type { MockWeakTopic } from '@/types';
import styles from './dashboard.module.css';
import { SUBJECT_COLOR } from '@/lib/subjects';
import { plural } from './helpers';

interface FocusAreasProps {
  loading: boolean;
  hasMockWeakAreas: boolean;
  weakSubjects: string[];
  weakBySubject: Record<string, MockWeakTopic[]>;
  expandedSubject: string | null;
  onToggleSubject: (subject: string | null) => void;
  buildPracticeUrl: (subject: string) => string;
}

/* Focus areas: subjects with weak topics from mock exams */
export function FocusAreas({ loading, hasMockWeakAreas, weakSubjects, weakBySubject, expandedSubject, onToggleSubject, buildPracticeUrl }: FocusAreasProps) {
  return (
    <>
    {!loading && hasMockWeakAreas && (
      <section className={styles.panel}>
        <div className={styles.panelHead}>
          <div>
            <h2 className={styles.panelTitle}>Focus areas</h2>
            <p className={styles.panelSub}>Subjects where you scored under 60% in mock exams</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {weakSubjects.map((subject) => {
            const topics = weakBySubject[subject]!;
            const worstPct = Math.min(...topics.map((t) => t.successRate));
            const isOpen = expandedSubject === subject;
            const color = SUBJECT_COLOR[subject] ?? '#64748b';
            return (
              <div key={subject} className={styles.subjCard}>
                <button
                  className={`${styles.subjCardHead} ${isOpen ? styles.subjCardHeadOpen : ''}`}
                  onClick={() => onToggleSubject(isOpen ? null : subject)}
                  style={{ width: '100%', border: 'none', textAlign: 'left' }}
                >
                  <div>
                    <p className={styles.subjCardName} style={{ color }}>{subject}</p>
                    <p className={styles.subjCardMeta}>{plural(topics.length, 'weak topic')}</p>
                  </div>
                  <div className={styles.subjCardRight}>
                    <span className={`${styles.subjCardPct} ${worstPct >= 40 ? styles.subjCardPctMid : ''}`}>
                      Worst {worstPct}%
                    </span>
                    <svg
                      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', color: 'var(--gray-400)', flexShrink: 0 }}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className={styles.subjCardBody}>
                    {topics.map((t) => (
                      <div key={t.topic} className={styles.subjTopicRow}>
                        <div>
                          <p className={styles.subjTopicName}>{t.topic}</p>
                          <p className={styles.subjTopicMeta}>{t.correct}/{t.attempts} correct</p>
                        </div>
                        <span
                          className={styles.subjTopicPct}
                          style={{ color: t.successRate >= 40 ? 'var(--amber-600)' : 'var(--red-600)' }}
                        >
                          {t.successRate}%
                        </span>
                        <div className={styles.subjTopicBar}>
                          <div
                            className={styles.subjTopicBarFill}
                            style={{ width: `${t.successRate}%`, background: t.successRate >= 40 ? 'var(--amber-600)' : 'var(--red-600)' }}
                          />
                        </div>
                      </div>
                    ))}
                    <div style={{ marginTop: 14 }}>
                      <Link
                        href={buildPracticeUrl(subject)}
                        className={`${styles.primaryBtn} ${styles.primaryBtnSm}`}
                      >
                        Practice {subject} weak areas →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    )}

    </>
  );
}
