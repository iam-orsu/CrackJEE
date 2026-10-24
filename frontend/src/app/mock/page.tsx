'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { PaperCard } from '@/components/practice/shared';
import { PaperPager } from '@/components/practice/PaperPager';
import { api } from '@/lib/api';
import { isAuthenticated, getUser } from '@/lib/auth';
import type { MockHistoryItem, PaperSet, PaperQuestion } from '@/types';

const EXAM_INFO = {
  Main: {
    title: 'JEE Main',
    subtitle: 'Paper 1 — B.E./B.Tech',
    duration: '3 hours',
    questions: '75 questions',
    marks: '300 marks',
    pattern: [
      'Physics: 20 MCQ (Single Correct) + 5 Integer',
      'Chemistry: 20 MCQ (Single Correct) + 5 Integer',
      'Mathematics: 20 MCQ (Single Correct) + 5 Integer',
    ],
    marking: [
      'MCQ Single Correct: +4 correct, −1 wrong, 0 unattempted',
      'Integer / Numerical: +4 correct, 0 wrong (no negative marking)',
    ],
  },
  Advanced: {
    title: 'JEE Advanced',
    subtitle: 'Paper 1 (Simulation)',
    duration: '3 hours',
    questions: '51 questions',
    marks: '~180 marks',
    pattern: [
      'Physics: 7 Single Correct + 4 Multi-Correct + 6 Integer',
      'Chemistry: 7 Single Correct + 4 Multi-Correct + 6 Integer',
      'Mathematics: 7 Single Correct + 4 Multi-Correct + 6 Integer',
    ],
    marking: [
      'Single Correct: +3 correct, −1 wrong',
      'Multi-Correct: +4 all correct; partial +1/option; −2 any wrong selected',
      'Integer: +3 correct, 0 wrong',
    ],
  },
  NEET: {
    title: 'NEET UG',
    subtitle: 'NMC Pattern 2025',
    duration: '3 hours 20 min',
    questions: '180 questions',
    marks: '720 marks',
    pattern: [
      'Physics: 45 MCQ (Single Correct)',
      'Chemistry: 45 MCQ (Single Correct)',
      'Botany: 45 MCQ (Single Correct)',
      'Zoology: 45 MCQ (Single Correct)',
    ],
    marking: [
      'MCQ Single Correct: +4 correct, −1 wrong, 0 unattempted',
      'No integer or multi-correct type',
    ],
  },
} as const;

type ExamType = 'Main' | 'Advanced' | 'NEET';
type DifficultyMode = 'easy' | 'medium' | 'hard';
type DifficultyFilter = 'all' | DifficultyMode;

const DIFFICULTY_ORDER: DifficultyMode[] = ['easy', 'medium', 'hard'];
const DIFFICULTY_LABELS: Record<DifficultyMode, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
const DIFFICULTY_COLORS: Record<DifficultyMode, { bg: string; text: string }> = {
  easy: { bg: '#dcfce7', text: '#166534' },
  medium: { bg: '#fef9c3', text: '#854d0e' },
  hard: { bg: '#fee2e2', text: '#991b1b' },
};

const PAPERS_PER_PAGE = 10;
// Papers shown in the list. These are placeholders for browsing; a real paper is chosen when the student starts one.
const PLACEHOLDER_TOTAL = 1500;

const PLACEHOLDER_SUBJECTS: Record<ExamType, string[]> = {
  Main: ['Physics', 'Chemistry', 'Mathematics'],
  Advanced: ['Physics', 'Chemistry', 'Mathematics'],
  NEET: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
};
const PLACEHOLDER_QUESTION_COUNT: Record<ExamType, number> = { Main: 75, Advanced: 51, NEET: 180 };
const PLACEHOLDER_TEXTS = [
  'Let $f(x)=x^3-3x+2$. Find the number of real roots of $f(x)=0$ in $[-2,2]$.',
  'A particle moves with velocity $v(t)=3t^2-6t$. Find its displacement from $t=0$ to $t=3$.',
  'Find the pH of a buffer prepared by mixing $0.1\\text{ M}$ acetic acid and $0.1\\text{ M}$ sodium acetate.',
  'Identify the major product when propene reacts with $HBr$ in the presence of peroxide.',
];

// Placeholder metadata for every paper in the list; difficulty cycles so each filter has an equal share
const PLACEHOLDERS: Array<{ number: number; difficulty: DifficultyMode }> = Array.from(
  { length: PLACEHOLDER_TOTAL },
  (_, i) => ({ number: i + 1, difficulty: DIFFICULTY_ORDER[i % 3]! }),
);

// Topic names per subject, so a placeholder paper lists real topics on its card
const PLACEHOLDER_TOPICS: Record<string, string[]> = {
  Physics: ['Kinematics', 'Laws of Motion', 'Electrostatics', 'Current Electricity'],
  Chemistry: ['Mole Concept', 'Chemical Bonding', 'Chemical Equilibrium', 'Organic Basics'],
  Mathematics: ['Algebra', 'Calculus', 'Coordinate Geometry', 'Trigonometry'],
  Botany: ['Plant Physiology', 'Genetics', 'Cell Biology', 'Ecology'],
  Zoology: ['Human Physiology', 'Reproduction', 'Evolution', 'Biotechnology'],
};
// PaperCard counts difficulty by the practice keys
const CARD_DIFFICULTY: Record<DifficultyMode, string> = { easy: 'beginner', medium: 'intermediate', hard: 'advanced' };

function placeholderPaper(number: number, difficulty: DifficultyMode, examType: ExamType): PaperSet {
  const subjects = PLACEHOLDER_SUBJECTS[examType];
  const questions: PaperQuestion[] = Array.from({ length: PLACEHOLDER_QUESTION_COUNT[examType] }, (_, i) => {
    const subject = subjects[i % subjects.length]!;
    const topics = PLACEHOLDER_TOPICS[subject]!;
    return {
      id: `placeholder-${number}-${i}`,
      topic: topics[(number + i) % topics.length]!,
      subject,
      questionText: PLACEHOLDER_TEXTS[(number + i) % PLACEHOLDER_TEXTS.length]!,
      questionType: 'mcq_single',
      options: [],
      difficulty: CARD_DIFFICULTY[difficulty],
      diagram: null,
    };
  });
  return { number, questionIds: [], questions };
}

const FILTER_OPTIONS: Array<{ value: DifficultyFilter; label: string }> = [
  { value: 'all', label: 'All difficulties' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export default function MockPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<ExamType | null>(null);
  const [filter, setFilter] = useState<DifficultyFilter>('all');
  const [page, setPage] = useState(1);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<MockHistoryItem[]>([]);
  const [terminating, setTerminating] = useState<string | null>(null);

  const currentUser = getUser();
  const isNEET = currentUser?.targetExam === 'NEET';
  const availableTypes = (['Main', 'Advanced', 'NEET'] as const).filter((t) =>
    isNEET ? t === 'NEET' : t !== 'NEET',
  );

  const filteredPlaceholders = useMemo(
    () => (filter === 'all' ? PLACEHOLDERS : PLACEHOLDERS.filter((p) => p.difficulty === filter)),
    [filter],
  );
  const pageCount = Math.ceil(filteredPlaceholders.length / PAPERS_PER_PAGE);
  const pagePapers = useMemo(() => {
    if (!selected) return [];
    return filteredPlaceholders
      .slice((page - 1) * PAPERS_PER_PAGE, page * PAPERS_PER_PAGE)
      .map((p) => ({ difficulty: p.difficulty, paper: placeholderPaper(p.number, p.difficulty, selected) }));
  }, [filteredPlaceholders, page, selected]);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    api.mock.history().then(setHistory).catch(() => {});
  }, [router]);

  function changeFilter(next: DifficultyFilter) {
    setFilter(next);
    setPage(1);
  }

  async function startPaper(examType: ExamType, difficultyMode: DifficultyMode) {
    if (starting) return;
    setStarting(true);
    setError('');
    try {
      const { id } = await api.mock.start({ examType, difficultyMode });
      router.push(`/mock/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start exam');
      setStarting(false);
    }
  }

  async function handleTerminate(id: string) {
    if (!confirm('Terminate this exam session? This cannot be undone.')) return;
    setTerminating(id);
    try {
      await api.mock.cancel(id);
      setHistory((prev) => prev.map((h) => h.id === id ? { ...h, status: 'error' } : h));
    } catch {
      // ignore
    } finally {
      setTerminating(null);
    }
  }

  const info = selected ? EXAM_INFO[selected] : null;

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main" style={{ maxWidth: 900 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 4 }}>Mock Test</h1>
          <p style={{ fontSize: 14, color: 'var(--gray-500)' }}>
            Full-length exam simulation with real JEE marking schemes and a 3-hour timer.
          </p>
        </div>

        {/* Exam type: only the exams that apply to this student */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
          {availableTypes.map((type) => (
            <button
              key={type}
              onClick={() => { setSelected(type); setPage(1); }}
              style={{
                flex: '1 1 160px',
                padding: '20px 24px',
                border: `2px solid ${selected === type ? 'var(--gray-900)' : 'var(--gray-200)'}`,
                borderRadius: 8,
                background: selected === type ? 'var(--gray-900)' : '#fff',
                color: selected === type ? '#fff' : 'var(--gray-900)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                {type === 'NEET' ? 'NEET UG' : `JEE ${type}`}
              </div>
              <div style={{ fontSize: 13, opacity: 0.75 }}>{EXAM_INFO[type].questions} · {EXAM_INFO[type].duration}</div>
            </button>
          ))}
        </div>

        {/* Exam details */}
        {info && (
          <div style={{ border: '1px solid var(--gray-200)', borderRadius: 8, padding: 24, marginBottom: 24, background: '#fafafa' }}>
            <div style={{ display: 'flex', gap: 32, marginBottom: 20 }}>
              {[
                { label: 'Duration', value: info.duration },
                { label: 'Questions', value: info.questions },
                { label: 'Total Marks', value: info.marks },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: 11, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-900)' }}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 8 }}>PAPER PATTERN</div>
                {info.pattern.map((p) => (
                  <div key={p} style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 4, display: 'flex', gap: 6 }}>
                    <span style={{ color: 'var(--gray-400)' }}>›</span> {p}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 8 }}>MARKING SCHEME</div>
                {info.marking.map((m) => (
                  <div key={m} style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 4, display: 'flex', gap: 6 }}>
                    <span style={{ color: 'var(--gray-400)' }}>›</span> {m}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Paper list: placeholder cards for browsing; the paper is prepared when the student picks one */}
        {selected && (
          <section style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-900)' }}>
                  {filter === 'all' ? `${PLACEHOLDER_TOTAL.toLocaleString('en-IN')}+ mock papers` : `${filteredPlaceholders.length.toLocaleString('en-IN')}+ ${DIFFICULTY_LABELS[filter]} papers`}
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
                  10 papers per page · a new paper takes 60–90 seconds to prepare (NEET 3–4 minutes)
                </div>
              </div>

              {/* Difficulty dropdown: picking one rolls the papers out again */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--gray-600)' }}>
                Difficulty
                <select
                  value={filter}
                  onChange={(e) => changeFilter(e.target.value as DifficultyFilter)}
                  style={{
                    padding: '8px 12px', border: '1px solid var(--gray-200)', borderRadius: 6, background: '#fff',
                    fontSize: 13, color: 'var(--gray-900)', cursor: 'pointer', minWidth: 160,
                  }}
                >
                  {FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <PaperPager page={page} pageCount={pageCount} disabled={starting} onPageChange={setPage} />

            <div className={`paper-row${starting ? ' paper-row-loading' : ''}`} aria-busy={starting}>
              {/* Keyed by filter and page, so every change rolls the papers out again, one after another */}
              {pagePapers.map(({ difficulty, paper }, i) => (
                <div
                  key={`${filter}-${page}-${paper.number}`}
                  className="paper-rollout"
                  style={{ animationDelay: `${i * 45}ms` }}
                >
                  <PaperCard paper={paper} onStart={() => startPaper(selected, difficulty)} />
                </div>
              ))}
              {starting && <div className="paper-row-overlay">Preparing your paper...</div>}
            </div>

            <PaperPager page={page} pageCount={pageCount} disabled={starting} onPageChange={setPage} />
          </section>
        )}

        {error && (
          <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 16 }}>{error}</div>
        )}

        {/* Past attempts */}
        {history.length > 0 && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 12 }}>Past Attempts</h2>
            <div style={{ border: '1px solid var(--gray-200)', borderRadius: 8, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid var(--gray-200)' }}>
                    {['Exam', 'Difficulty', 'Date', 'Score', 'Correct', 'Wrong', 'Status', ''].map((h) => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--gray-600)', fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 500 }}>
                        {item.examType === 'NEET' ? 'NEET UG' : `JEE ${item.examType}`}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {item.difficultyMode ? (
                          <span style={{
                            padding: '2px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 600,
                            background: DIFFICULTY_COLORS[item.difficultyMode as DifficultyMode]?.bg ?? '#f3f4f6',
                            color: DIFFICULTY_COLORS[item.difficultyMode as DifficultyMode]?.text ?? '#374151',
                          }}>
                            {item.difficultyMode.charAt(0).toUpperCase() + item.difficultyMode.slice(1)}
                          </span>
                        ) : <span style={{ color: 'var(--gray-400)' }}>—</span>}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--gray-500)' }}>
                        {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>
                        {item.result ? `${item.result.totalScore} / ${item.result.maxScore}` : '—'}
                      </td>
                      <td style={{ padding: '10px 14px', color: '#16a34a' }}>{item.result?.correct ?? '—'}</td>
                      <td style={{ padding: '10px 14px', color: '#dc2626' }}>{item.result?.incorrect ?? '—'}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 600,
                          background: item.status === 'submitted' ? '#dcfce7' : '#fef3c7',
                          color: item.status === 'submitted' ? '#166534' : '#92400e',
                        }}>
                          {item.status === 'submitted' ? 'Completed' : item.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {item.status === 'submitted' && (
                          <a href={`/mock/${item.id}/result`} style={{ color: 'var(--gray-700)', fontWeight: 500, fontSize: 12, textDecoration: 'underline' }}>
                            View result
                          </a>
                        )}
                        {(item.status === 'ready' || item.status === 'in_progress') && (
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <a href={`/mock/${item.id}`} style={{ color: 'var(--gray-700)', fontWeight: 500, fontSize: 12, textDecoration: 'underline' }}>
                              {item.status === 'in_progress' ? 'Resume' : 'Open'}
                            </a>
                            <span style={{ color: 'var(--gray-300)' }}>·</span>
                            <button
                              onClick={() => handleTerminate(item.id)}
                              disabled={terminating === item.id}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontWeight: 500, fontSize: 12, textDecoration: 'underline', padding: 0 }}
                            >
                              {terminating === item.id ? 'Terminating…' : 'Terminate'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
