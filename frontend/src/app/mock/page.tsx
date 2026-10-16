'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import type { MockHistoryItem } from '@/types';

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
      'Integer: +4 correct, 0 wrong',
    ],
  },
} as const;

type DifficultyMode = 'easy' | 'medium' | 'hard';

const DIFFICULTY_OPTIONS: Array<{ value: DifficultyMode; label: string; description: string }> = [
  { value: 'easy', label: 'Easy', description: 'Single-concept problems, standard formula application' },
  { value: 'medium', label: 'Medium', description: 'Multi-step, non-standard setups — typical JEE Main' },
  { value: 'hard', label: 'Hard', description: 'Cross-topic, 3+ reasoning steps — JEE Advanced grade' },
];

const DIFFICULTY_COLORS: Record<DifficultyMode, { bg: string; text: string }> = {
  easy: { bg: '#dcfce7', text: '#166534' },
  medium: { bg: '#fef9c3', text: '#854d0e' },
  hard: { bg: '#fee2e2', text: '#991b1b' },
};

export default function MockPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<'Main' | 'Advanced' | null>(null);
  const [difficultyMode, setDifficultyMode] = useState<DifficultyMode>('medium');
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<MockHistoryItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    api.mock.history().then(setHistory).catch(() => {});
  }, [router]);

  async function handleStart() {
    if (!selected) return;
    setStarting(true);
    setError('');
    try {
      const { id } = await api.mock.start({ examType: selected, difficultyMode });
      router.push(`/mock/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start exam');
      setStarting(false);
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

        {/* Exam type selection */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
          {(['Main', 'Advanced'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelected(type)}
              style={{
                flex: 1,
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
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>JEE {type}</div>
              <div style={{ fontSize: 13, opacity: 0.75 }}>{EXAM_INFO[type].questions} · {EXAM_INFO[type].duration}</div>
            </button>
          ))}
        </div>

        {/* Difficulty selector */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
            Difficulty Level
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {DIFFICULTY_OPTIONS.map(({ value, label, description }) => (
              <button
                key={value}
                onClick={() => setDifficultyMode(value)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: `2px solid ${difficultyMode === value ? 'var(--gray-700)' : 'var(--gray-200)'}`,
                  borderRadius: 6,
                  background: difficultyMode === value ? 'var(--gray-50)' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'border-color 0.15s',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)', lineHeight: 1.4 }}>{description}</div>
              </button>
            ))}
          </div>
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

            <div style={{
              marginTop: 20,
              padding: '12px 16px',
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 6,
              fontSize: 13,
              color: '#92400e',
            }}>
              ⚠ Questions are AI-generated. The exam will take 20–40 seconds to prepare. Do not close the tab during loading.
            </div>
          </div>
        )}

        {error && (
          <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 16 }}>{error}</div>
        )}

        <button
          onClick={handleStart}
          disabled={!selected || starting}
          style={{
            padding: '12px 32px',
            background: selected && !starting ? 'var(--gray-900)' : 'var(--gray-300)',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 15,
            fontWeight: 600,
            cursor: selected && !starting ? 'pointer' : 'not-allowed',
            marginBottom: 40,
          }}
        >
          {starting ? 'Preparing exam…' : 'Start Exam →'}
        </button>

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
                      <td style={{ padding: '10px 14px', fontWeight: 500 }}>JEE {item.examType}</td>
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
                        {item.status === 'in_progress' && (
                          <a href={`/mock/${item.id}`} style={{ color: 'var(--gray-700)', fontWeight: 500, fontSize: 12, textDecoration: 'underline' }}>
                            Resume
                          </a>
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
