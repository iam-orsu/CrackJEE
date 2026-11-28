'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StudySidebar } from '@/components/StudySidebar';
import { api, ApiError } from '@/lib/api';
import { isAuthenticated, getUser } from '@/lib/auth';
import type { MockHistoryItem, User } from '@/types';

const EXAM_INFO = {
  Main: {
    title: 'JEE Main',
    subtitle: 'Paper 1 — B.E./B.Tech',
    duration: '3 hours',
    questions: '75 questions',
    marks: '300 marks',
    pattern: [
      'Physics: 20 MCQ (Single Correct & Match List) + 5 Integer',
      'Chemistry: 20 MCQ (Single Correct & Match List) + 5 Integer',
      'Mathematics: 20 MCQ (Single Correct & Match List) + 5 Integer',
    ],
    marking: [
      'MCQ Single Correct & Matrix Match: +4 correct, −1 wrong, 0 unattempted',
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
      'Physics: Single Correct, Multi-Correct, Integer & Matrix Match',
      'Chemistry: Single Correct, Multi-Correct, Integer & Matrix Match',
      'Mathematics: Single Correct, Multi-Correct, Integer & Matrix Match',
    ],
    marking: [
      'Single Correct & Matrix Match: +3 correct, −1 wrong',
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
      'Physics: 45 MCQ (Single Correct & Match the List)',
      'Chemistry: 45 MCQ (Single Correct & Match the List)',
      'Botany: 45 MCQ (Single Correct & Match the List)',
      'Zoology: 45 MCQ (Single Correct & Match the List)',
    ],
    marking: [
      'MCQ Single Correct & Matrix Match: +4 correct, −1 wrong, 0 unattempted',
      'No integer or multi-correct type',
    ],
  },
} as const;

type ExamType = 'Main' | 'Advanced' | 'NEET';
type DifficultyMode = 'easy' | 'medium' | 'hard';
type DifficultyFilter = 'all' | DifficultyMode;

const DIFFICULTY_ORDER: DifficultyMode[] = ['easy', 'medium', 'hard'];
const DIFFICULTY_LABELS: Record<DifficultyMode, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

// Nine per page fills a 3×3 grid
const PAPERS_PER_PAGE = 9;
// Papers shown in the list. These are placeholders for browsing; a real paper is chosen when the student starts one.
const PLACEHOLDER_TOTAL = 1500;

const PLACEHOLDER_SUBJECTS: Record<ExamType, string[]> = {
  Main: ['Physics', 'Chemistry', 'Mathematics'],
  Advanced: ['Physics', 'Chemistry', 'Mathematics'],
  NEET: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
};
const PLACEHOLDER_QUESTION_COUNT: Record<ExamType, number> = { Main: 75, Advanced: 51, NEET: 180 };

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

function topicsFor(number: number, examType: ExamType): string[] {
  return PLACEHOLDER_SUBJECTS[examType].map((s, i) => {
    const list = PLACEHOLDER_TOPICS[s]!;
    return list[(number + i) % list.length]!;
  });
}

const FILTER_OPTIONS: Array<{ value: DifficultyFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

function examName(t: string) {
  return t === 'NEET' ? 'NEET UG' : `JEE ${t}`;
}

function statusInfo(status: string): { label: string; cls: string } {
  switch (status) {
    case 'submitted': return { label: 'Completed', cls: 'mk-st-done' };
    case 'in_progress': return { label: 'In progress', cls: 'mk-st-live' };
    case 'ready': return { label: 'Ready', cls: 'mk-st-live' };
    case 'generating': return { label: 'Preparing', cls: 'mk-st-live' };
    default: return { label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' '), cls: 'mk-st-off' };
  }
}

function pageList(page: number, count: number): Array<number | '…'> {
  const keep = new Set([1, count, page - 1, page, page + 1]);
  const nums = [...keep].filter((n) => n >= 1 && n <= count).sort((a, b) => a - b);
  const out: Array<number | '…'> = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1]! > 1) out.push('…');
    out.push(n);
  });
  return out;
}

function Pager({ page, pageCount, disabled, onPageChange }: {
  page: number; pageCount: number; disabled: boolean; onPageChange: (p: number) => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <nav className="mk-pager" aria-label="Paper pages">
      <button type="button" className="mk-pg" disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">←</button>
      {pageList(page, pageCount).map((n, i) =>
        n === '…' ? (
          <span key={`d${i}`} className="mk-dots mk-pg-num">…</span>
        ) : (
          <button
            key={n}
            type="button"
            className={`mk-pg mk-pg-num${n === page ? ' on' : ''}`}
            disabled={disabled}
            aria-current={n === page ? 'page' : undefined}
            onClick={() => onPageChange(n)}
          >
            {n}
          </button>
        ),
      )}
      <span className="mk-pg-of">Page {page} of {pageCount}</span>
      <button type="button" className="mk-pg" disabled={disabled || page >= pageCount} onClick={() => onPageChange(page + 1)} aria-label="Next page">→</button>
    </nav>
  );
}

export default function MockPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<ExamType | null>(null);
  const [filter, setFilter] = useState<DifficultyFilter>('all');
  const [page, setPage] = useState(1);
  // The paper currently being prepared, so only that one card shows the wait state
  const [startingKey, setStartingKey] = useState<string | null>(null);
  const starting = startingKey !== null;
  const [error, setError] = useState('');
  const [history, setHistory] = useState<MockHistoryItem[]>([]);
  const [terminating, setTerminating] = useState<string | null>(null);
  const [confirmTerminate, setConfirmTerminate] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const historyRef = useRef<HTMLDivElement | null>(null);

  // localStorage is not available during SSR, so load the user after mount
  useEffect(() => {
    setUser(getUser());
    setAuthReady(true);
  }, []);

  const filteredPlaceholders = useMemo(
    () => (filter === 'all' ? PLACEHOLDERS : PLACEHOLDERS.filter((p) => p.difficulty === filter)),
    [filter],
  );
  const pageCount = Math.ceil(filteredPlaceholders.length / PAPERS_PER_PAGE);
  const pagePapers = useMemo(() => {
    if (!selected) return [];
    return filteredPlaceholders.slice((page - 1) * PAPERS_PER_PAGE, page * PAPERS_PER_PAGE);
  }, [filteredPlaceholders, page, selected]);

  useEffect(() => {
    if (!authReady) return;
    if (!isAuthenticated()) { router.replace('/login'); return; }
    api.mock.history().then(setHistory).catch(() => {});
  }, [router, authReady]);

  useEffect(() => {
    if (!confirmTerminate) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setConfirmTerminate(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [confirmTerminate]);

  // Must stay below every hook: returning early above a hook changes the hook count between
  // the pre-mount render (authReady false) and the next one, which React rejects as
  // "Rendered more hooks than during the previous render".
  if (!authReady) return null;

  const currentUser = user;
  const isNEET = currentUser?.targetExam === 'NEET';
  const availableTypes = (['Main', 'Advanced', 'NEET'] as const).filter((t) =>
    isNEET ? t === 'NEET' : t !== 'NEET',
  );

  function changeFilter(next: DifficultyFilter) {
    setFilter(next);
    setPage(1);
  }

  // The exam the student has open right now, if any. A new paper can only start once it is terminated or finished.
  const activeExam = history.find((h) => ['generating', 'ready', 'in_progress'].includes(h.status));

  async function startPaper(examType: ExamType, difficultyMode: DifficultyMode, paperNumber?: number) {
    if (starting) return;
    if (activeExam) {
      setError('Terminate your exam in progress before starting a new paper.');
      // Take the student to the in-progress exam and its Terminate button
      historyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setStartingKey(paperNumber != null ? String(paperNumber) : 'new');
    setError('');
    // Enter fullscreen while we still have the click gesture; the request is rejected
    // outside one, and the exam works windowed if the browser refuses.
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    } catch {}
    try {
      const { id } = await api.mock.start({ examType, difficultyMode, paperNumber });
      router.push(`/mock/${id}`);
    } catch (e) {
      if (e instanceof ApiError && e.status === 402) {
        setStartingKey(null);
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        router.push('/pricing');
        return;
      }
      setError(e instanceof Error ? e.message : 'Failed to start exam');
      setStartingKey(null);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    }
  }

  function handleTerminate(id: string) {
    setConfirmTerminate(id);
  }

  async function confirmTerminateExam(id: string) {
    setConfirmTerminate(null);
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
    <>
      <style>{css}</style>
      <div className="mk-row">
          <div className="mk-col">
            {/* ── Header ── */}
            <header className="mk-hero">
              {/* the practice page's blob, anchored bottom-right */}
              <svg aria-hidden viewBox="0 0 900 700" preserveAspectRatio="xMaxYMax slice" className="mk-blob">
                <defs>
                  <linearGradient id="mk-hero-blob" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#803688" stopOpacity="0.20" />
                    <stop offset="0.5" stopColor="#803688" stopOpacity="0.12" />
                    <stop offset="1" stopColor="#B98CBE" stopOpacity="0.18" />
                  </linearGradient>
                </defs>
                <path
                  d="M1000 700 L1000 150 C946 92 862 62 772 78 C668 97 596 172 528 246 C462 318 396 378 310 414 C214 455 132 508 84 578 C52 626 30 668 24 700 Z"
                  fill="url(#mk-hero-blob)"
                />
              </svg>

              <div className="mk-hero-body">
                <p className="mk-eyebrow">Full-length simulation</p>
                <h1>
                  Take a{' '}
                  <span className="mk-scribble">
                    mock test
                    <svg viewBox="0 0 220 14" preserveAspectRatio="none" aria-hidden>
                      <path d="M3 9C40 2 80 12 120 6s70 3 97-2" />
                    </svg>
                  </span>
                </h1>
                <p className="mk-sub">
                  Full-length exam simulation with real JEE marking schemes and a 3-hour timer.
                </p>
                <div className="mk-hstats">
                  <div className="mk-hstat"><strong>+4 / −1</strong><span>marking per MCQ</span></div>
                  <div className="mk-hstat"><strong>3 hrs</strong><span>JEE papers · NEET runs 3 hrs 20 m</span></div>
                </div>
              </div>
            </header>

            {/* ── Exam type: only the exams that apply to this student ── */}
            <div className="mk-exams" role="radiogroup" aria-label="Exam type">
              {availableTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={selected === type}
                  className={`mk-exam${selected === type ? ' on' : ''}`}
                  onClick={() => { setSelected(type); setPage(1); }}
                >
                  <strong>{examName(type)}</strong>
                  <span>{EXAM_INFO[type].questions} · {EXAM_INFO[type].duration}</span>
                </button>
              ))}
            </div>

            {/* ── Nothing picked yet ── */}
            {!selected && (
              <div className="mk-empty">
                <svg viewBox="0 0 64 50" aria-hidden>
                  <path d="M56 46C30 46 12 32 10 7M10 7L1 19M10 7l14 9" />
                </svg>
                <p className="mk-empty-text">Pick an exam to see the papers</p>
              </div>
            )}

            {/* ── Exam details ── */}
            {info && (
              <section className="mk-sheet">
                <div className="mk-sheet-top">
                  <h2>{info.title}</h2>
                  <p>{info.subtitle}</p>
                </div>

                <div className="mk-stats">
                  {[
                    { label: 'Duration', value: info.duration },
                    { label: 'Questions', value: info.questions },
                    { label: 'Total marks', value: info.marks },
                  ].map(({ label, value }) => (
                    <div key={label} className="mk-stat">
                      <small>{label}</small>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>

                <div className="mk-cols">
                  <div>
                    <span className="mk-label">Paper pattern</span>
                    <ul className="mk-list">
                      {info.pattern.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="mk-label">Marking scheme</span>
                    <ul className="mk-list">
                      {info.marking.map((m) => <li key={m}>{m}</li>)}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* ── Paper list: placeholder cards for browsing; the paper is prepared when the student picks one ── */}
            {selected && (
              <section className="mk-papers">
                {activeExam && (
                  <div className="mk-notice">
                    <span>
                      You have a {examName(activeExam.examType)} exam in progress.
                      Terminate it before starting a new paper.
                    </span>
                    <span className="mk-notice-actions">
                      <Link href={`/mock/${activeExam.id}`} className="mk-link">Resume</Link>
                      <button
                        type="button"
                        className="mk-linkbtn"
                        onClick={() => handleTerminate(activeExam.id)}
                        disabled={terminating === activeExam.id}
                      >
                        {terminating === activeExam.id ? 'Terminating…' : 'Terminate'}
                      </button>
                    </span>
                  </div>
                )}

                <div className="mk-listhead">
                  <div>
                    <h2>
                      {filter === 'all'
                        ? `${PLACEHOLDER_TOTAL.toLocaleString('en-IN')}+ mock papers`
                        : `${filteredPlaceholders.length.toLocaleString('en-IN')}+ ${DIFFICULTY_LABELS[filter]} papers`}
                    </h2>
                    <p>9 papers per page · a new paper takes 60–90 seconds to prepare (NEET 3–4 minutes)</p>
                  </div>

                  {/* Difficulty filter: picking one rolls the papers out again */}
                  <div className="mk-filters" role="radiogroup" aria-label="Difficulty">
                    {FILTER_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        role="radio"
                        aria-checked={filter === o.value}
                        className={`mk-fchip${filter === o.value ? ' on' : ''}`}
                        onClick={() => changeFilter(o.value)}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mk-grid" aria-busy={starting}>
                  {/* Keyed by filter and page, so every change rolls the papers out again, one after another */}
                  {pagePapers.map((p, i) => {
                    const subjects = PLACEHOLDER_SUBJECTS[selected];
                    const topics = topicsFor(p.number, selected);
                    const busy = startingKey === String(p.number);
                    return (
                      <div
                        key={`${filter}-${page}-${p.number}`}
                        className="mk-roll"
                        style={{ animationDelay: `${i * 45}ms` }}
                      >
                        <button
                          type="button"
                          className={`mk-card${busy ? ' busy' : ''}`}
                          disabled={starting}
                          onClick={() => startPaper(selected, p.difficulty, p.number)}
                          aria-label={`Start paper ${p.number}, ${DIFFICULTY_LABELS[p.difficulty]}`}
                        >
                          <div className="mk-card-top">
                            <div className="mk-no">
                              <small>Paper</small>
                              <strong>#{p.number}</strong>
                            </div>
                            <span className={`mk-chip mk-d-${p.difficulty}`}>{DIFFICULTY_LABELS[p.difficulty]}</span>
                          </div>

                          <span className="mk-meta">
                            {PLACEHOLDER_QUESTION_COUNT[selected]} questions · {EXAM_INFO[selected].duration}
                          </span>

                          {/* The paper is sealed: a blurred question teaser hints at what is inside */}
                          <div className="mk-sealed" aria-hidden="true">
                            <div className="mk-blur">
                              <span style={{ width: '44%' }} />
                              <span style={{ width: '92%' }} />
                              <span style={{ width: '68%' }} />
                            </div>
                            <span className="mk-seal-tag">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                                <rect x="4" y="10" width="16" height="11" rx="2" />
                                <path d="M8 10V7a4 4 0 018 0v3" />
                              </svg>
                              Sealed
                            </span>
                          </div>

                          {/* Syllabus: the subject on the left, its topic on the right, one aligned row each */}
                          <div className="mk-sy">
                            <span className="mk-sy-label">Topics</span>
                            {subjects.map((s, si) => (
                              <span key={s} className="mk-sy-row">
                                <span className="mk-sy-subject">{s}</span>
                                <span className="mk-sy-topic">{topics[si]}</span>
                              </span>
                            ))}
                          </div>

                          <span className="mk-card-foot">
                            {busy ? (
                              <span className="mk-foot-busy">
                                <span className="mk-spin" aria-hidden />
                                Preparing paper…
                              </span>
                            ) : (
                              <>
                                Start paper
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                  <path d="M5 12h14M13 6l6 6-6 6" />
                                </svg>
                              </>
                            )}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                <Pager page={page} pageCount={pageCount} disabled={starting} onPageChange={setPage} />
              </section>
            )}

            {error && <p className="mk-error" role="alert">{error}</p>}

            {/* ── Past attempts ── */}
            {history.length > 0 && (
              <section className="mk-hist" ref={historyRef}>
                <h2>Past Attempts</h2>
                <div className="mk-tablewrap">
                  <table className="mk-table">
                    <thead>
                      <tr>
                        {['Exam', 'Difficulty', 'Date', 'Score', 'Correct', 'Wrong', 'Status', ''].map((h, i) => (
                          <th key={i}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => {
                        const st = statusInfo(item.status);
                        return (
                          <tr key={item.id}>
                            <td data-label="Exam"><b>{examName(item.examType)}</b></td>
                            <td data-label="Difficulty">
                              {item.difficultyMode ? (
                                <span className={`mk-chip mk-d-${item.difficultyMode}`}>
                                  {item.difficultyMode.charAt(0).toUpperCase() + item.difficultyMode.slice(1)}
                                </span>
                              ) : <span className="mk-dash">—</span>}
                            </td>
                            <td data-label="Date" className="mk-muted">
                              {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td data-label="Score"><b>{item.result ? `${item.result.totalScore} / ${item.result.maxScore}` : '—'}</b></td>
                            <td data-label="Correct" className="mk-good">{item.result?.correct ?? '—'}</td>
                            <td data-label="Wrong" className="mk-bad">{item.result?.incorrect ?? '—'}</td>
                            <td data-label="Status"><span className={`mk-chip ${st.cls}`}>{st.label}</span></td>
                            <td className="mk-act">
                              {item.status === 'submitted' && (
                                <Link href={`/mock/${item.id}/result`} className="mk-link">View result</Link>
                              )}
                              {(item.status === 'ready' || item.status === 'in_progress') && (
                                <span className="mk-act-row">
                                  <Link href={`/mock/${item.id}`} className="mk-link">
                                    {item.status === 'in_progress' ? 'Resume' : 'Open'}
                                  </Link>
                                  <span className="mk-sep">·</span>
                                  <button
                                    type="button"
                                    className="mk-linkbtn"
                                    onClick={() => handleTerminate(item.id)}
                                    disabled={terminating === item.id}
                                  >
                                    {terminating === item.id ? 'Terminating…' : 'Terminate'}
                                  </button>
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>

          <div className="mk-aside">
            <StudySidebar />
          </div>
        </div>

        {/* Kept outside the content column so the fixed overlay always covers the whole screen */}
        {confirmTerminate && (
          <div className="mk-modal" onClick={() => setConfirmTerminate(null)}>
            <div className="mk-dialog" role="dialog" aria-modal="true" aria-labelledby="mk-tt" onClick={(e) => e.stopPropagation()}>
              <h3 id="mk-tt">Terminate exam?</h3>
              <p>This will end the session immediately. Your progress will be lost and this cannot be undone.</p>
              <div className="mk-actions">
                <button type="button" className="mk-btn-ghost" onClick={() => setConfirmTerminate(null)}>Cancel</button>
                <button type="button" className="mk-btn-danger" onClick={() => confirmTerminateExam(confirmTerminate)}>Terminate</button>
              </div>
            </div>
          </div>
        )}
      </>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=DM+Sans:wght@400;500;600;700;800&display=swap');

.mk-row,.mk-modal{
  --brand:#003366; --brand-d:#00284F; --brand-l:#2A4FD6;
  --accent:#803688; --accent-d:#5A2560; --accent-2:#A24BA8; --accent-soft:#F3E6F6;
  --grad:linear-gradient(135deg,#803688 0%,#A24BA8 100%);
  --ice:#EEF2FF; --soft:#C6D2F8; --ink:#003366; --body:#31407F; --mute:#5A6B8C; --faint:#7A87A0;
  --line:rgba(0,51,102,.1); --line-2:rgba(0,51,102,.14);
  --card-shadow:0 10px 24px -18px rgba(0,51,102,.5);
  --card-shadow-hover:0 18px 34px -22px rgba(0,51,102,.55);
  --red:#C8202F; --red-d:#8F1521; --red-soft:#FDE6E8;
  --amber:#FDBA74; --green:#16a34a;
  /* Remap the app's own tokens so StudySidebar (inside this page) picks up the palette */
  --gray-50:#F8FAFF; --gray-100:#EEF2FF; --gray-200:#D7DFFA; --gray-300:#C6D2F8; --gray-400:#97A3D4;
  --gray-500:#5A6B8C; --gray-600:#4A5A78; --gray-700:#31407F; --gray-800:#1B2866; --gray-900:#003366;
  --navy-50:#EEF2FF; --navy-100:#D7DFFA; --navy-600:#003366; --navy-800:#003366; --red-600:#C8202F;
  font-family:'DM Sans',system-ui,sans-serif; color:var(--body); -webkit-text-size-adjust:100%;
}
.mk-row *,.mk-modal *{box-sizing:border-box}
.mk-row h1,.mk-row h2,.mk-row h3,.mk-row p,.mk-row ul,.mk-modal h3,.mk-modal p{margin:0;padding:0}

/* Layout: content column + study sidebar */
.mk-row{display:flex;gap:32px;align-items:flex-start;max-width:1200px}
.mk-col{flex:1 1 0;min-width:0;max-width:900px;container-type:inline-size;container-name:mk}
.mk-aside{flex:0 0 auto;min-width:0}

/* Shared bits */
.mk-link{color:var(--brand);font-weight:800;text-decoration:underline;text-underline-offset:3px;font-size:13px}
.mk-linkbtn{background:none;border:0;padding:0;font:inherit;font-size:13px;font-weight:800;color:var(--red);text-decoration:underline;text-underline-offset:3px;cursor:pointer}
.mk-linkbtn:disabled{opacity:.6;cursor:default}
.mk-btn-danger{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:0 20px;
  font:inherit;font-weight:800;font-size:15px;color:#fff;border:0;border-radius:14px;cursor:pointer;
  background:var(--red);box-shadow:0 6px 0 var(--red-d);
  transition:transform .15s,box-shadow .15s;-webkit-tap-highlight-color:transparent;
}
.mk-btn-danger:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 9px 0 var(--red-d)}
.mk-btn-danger:active:not(:disabled){transform:translateY(4px);box-shadow:0 2px 0 var(--red-d)}
.mk-btn-danger:disabled{opacity:.6;cursor:not-allowed}
.mk-btn-ghost{
  min-height:48px;padding:0 20px;font:inherit;font-weight:800;font-size:15px;color:var(--brand);background:#fff;
  border:1px solid var(--line-2);border-radius:14px;cursor:pointer;transition:background .15s,border-color .15s;
}
.mk-btn-ghost:hover{background:var(--ice);border-color:rgba(0,51,102,.24)}
.mk-spin{width:18px;height:18px;border-radius:50%;border:3px solid rgba(128,54,136,.25);border-top-color:var(--accent);animation:mk-rot .7s linear infinite}

/* Header: brand hero, the practice page's blob anchored bottom-right */
.mk-hero{
  position:relative;overflow:hidden;color:var(--ink);padding:30px 0 36px;margin-bottom:8px;
  background:transparent;
}
.mk-blob{
  position:absolute;bottom:-14%;right:0;height:112%;width:min(46%,520px);pointer-events:none;
  -webkit-mask-image:linear-gradient(to right,#000 40%,transparent 100%);
  mask-image:linear-gradient(to right,#000 40%,transparent 100%);
}
.mk-hero-body{position:relative;z-index:2;max-width:760px}
.mk-hero .mk-eyebrow{margin:0 0 10px;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent-d)}
.mk-hero h1{margin:0;font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:clamp(32px,5cqi,56px);line-height:1.04;letter-spacing:-.02em;color:var(--brand)}
.mk-scribble{position:relative;display:inline-block}
.mk-scribble svg{position:absolute;left:0;bottom:-10px;width:100%;height:14px}
.mk-scribble path{fill:none;stroke:var(--accent);stroke-width:5;stroke-linecap:round}
.mk-hero .mk-sub{margin:20px 0 0;max-width:560px;font-size:clamp(14px,1.5cqi,16px);line-height:1.65;color:var(--body)}
.mk-hstats{display:flex;gap:16px;flex-wrap:wrap;margin-top:22px}
.mk-hstat{background:#fff;color:var(--ink);border:1px solid var(--line);border-radius:16px;padding:12px 18px;box-shadow:var(--card-shadow);max-width:280px}
.mk-hstat:nth-child(2){background:var(--amber);border-color:rgba(0,51,102,.08)}
.mk-hstat strong{display:block;font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:24px;line-height:1.1;color:var(--brand);font-variant-numeric:tabular-nums}
.mk-hstat span{font-size:12px;font-weight:700;color:var(--mute);line-height:1.45}
.mk-hstat:nth-child(2) span{color:#6B4419}

/* Exam type: white cards, the accent lives in the selected state */
.mk-exams{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:28px}
.mk-exam{
  flex:1 1 200px;text-align:left;padding:20px 22px;font:inherit;color:var(--brand);background:#fff;
  border:1px solid var(--line);border-radius:20px;cursor:pointer;box-shadow:var(--card-shadow);
  transition:transform .18s,box-shadow .18s,border-color .18s;-webkit-tap-highlight-color:transparent;
}
.mk-exam:hover{transform:translateY(-3px);border-color:rgba(128,54,136,.35);box-shadow:var(--card-shadow-hover)}
.mk-exam.on{border-color:var(--accent);box-shadow:0 10px 0 var(--accent-d);transform:none}
.mk-exam strong{display:block;font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:22px;letter-spacing:-.02em;margin-bottom:4px}
.mk-exam span{font-size:13px;font-weight:600;color:var(--mute)}
.mk-exam.on span{color:var(--accent-d)}
.mk-exam:focus-visible,.mk-fchip:focus-visible,.mk-pg:focus-visible,.mk-btn-danger:focus-visible,.mk-btn-ghost:focus-visible,.mk-linkbtn:focus-visible{outline:3px solid var(--accent);outline-offset:2px}

.mk-empty{display:flex;align-items:center;gap:14px;padding:4px 8px 34px}
.mk-empty svg{width:56px;height:44px;flex:none;fill:none;stroke:var(--accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.mk-empty-text{font-size:14px;font-weight:600;color:var(--mute)}

/* Exam details: flat card, the practice page's panel treatment */
.mk-sheet{
  position:relative;background:#fff;border:1px solid var(--line);border-radius:20px;padding:26px 24px 24px;margin-bottom:32px;
  box-shadow:var(--card-shadow);
}
.mk-sheet-top{display:flex;align-items:baseline;justify-content:space-between;gap:10px;flex-wrap:wrap}
.mk-sheet-top h2{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:26px;letter-spacing:-.02em;color:var(--brand)}
.mk-sheet-top p{font-size:13px;font-weight:700;color:var(--mute)}
.mk-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:18px 0 22px}
.mk-stat{background:var(--ice);border:1px solid var(--line);border-radius:14px;padding:12px 14px;min-width:0}
.mk-stat small{display:block;font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);margin-bottom:3px}
.mk-stat strong{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:20px;color:var(--brand);overflow-wrap:anywhere;font-variant-numeric:tabular-nums}
.mk-cols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
.mk-label{display:inline-block;font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent-d);margin-bottom:12px}
.mk-list{list-style:none;display:grid;gap:8px}
.mk-list li{display:flex;gap:10px;font-size:13.5px;line-height:1.5;color:var(--body);font-weight:500}
.mk-list li::before{content:"";flex:none;width:7px;height:7px;margin-top:6px;border-radius:2px;background:var(--accent);transform:rotate(45deg)}

/* Paper list */
.mk-papers{margin-bottom:44px}
.mk-notice{
  display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:22px;
  background:var(--amber);color:var(--brand);padding:14px 18px;border:1px solid rgba(0,51,102,.08);border-radius:16px;
  font-size:13.5px;font-weight:700;line-height:1.5;box-shadow:0 10px 20px -14px rgba(0,51,102,.45);
}
.mk-notice-actions{display:flex;gap:16px;align-items:center}
.mk-listhead{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:14px}
.mk-listhead h2{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:clamp(20px,3.4cqi,26px);letter-spacing:-.02em;color:var(--brand)}
.mk-listhead p{font-size:12.5px;font-weight:600;color:var(--mute);margin-top:4px;line-height:1.5}
.mk-filters{display:flex;flex-wrap:wrap;gap:8px}
.mk-fchip{
  min-height:42px;padding:0 18px;font:inherit;font-weight:600;font-size:14px;color:var(--mute);background:#fff;
  border:1px solid var(--line-2);border-radius:999px;cursor:pointer;
  transition:border-color .15s,color .15s,background .15s,box-shadow .15s;-webkit-tap-highlight-color:transparent;
}
.mk-fchip:hover:not(.on){border-color:rgba(0,51,102,.3);color:var(--brand)}
.mk-fchip.on{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 4px 0 var(--accent-d)}

/* Pager */
.mk-pager{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;margin:16px 0}
.mk-pg{
  min-width:42px;min-height:42px;padding:0 12px;font:inherit;font-weight:700;font-size:14px;color:var(--mute);background:#fff;
  border:1px solid var(--line-2);border-radius:12px;cursor:pointer;
  transition:border-color .15s,color .15s,background .15s;-webkit-tap-highlight-color:transparent;
}
.mk-pg:hover:not(:disabled):not(.on){border-color:rgba(0,51,102,.28);color:var(--brand)}
.mk-pg.on{background:var(--brand);border-color:var(--brand);color:#fff}
.mk-pg:disabled{opacity:.45;cursor:not-allowed}
.mk-dots{color:var(--mute);font-weight:800;padding:0 2px}
.mk-pg-of{display:none;font-size:13px;font-weight:700;color:var(--mute)}

/* Cards */
/* Columns follow the width that is actually available: as many ~220px papers as fit, each stretching to fill the row */
.mk-grid{position:relative;display:grid;grid-template-columns:repeat(auto-fill,minmax(min(220px,100%),1fr));gap:18px;padding:8px 2px 10px}
.mk-roll{display:flex;animation:mk-roll .5s cubic-bezier(.2,.8,.2,1) both}
.mk-card{
  flex:1;display:flex;flex-direction:column;gap:12px;min-width:0;width:100%;text-align:left;
  font:inherit;color:var(--body);cursor:pointer;background:#fff;
  border:1px solid var(--line);border-radius:20px;padding:18px 18px 16px;box-shadow:var(--card-shadow);
  transition:transform .18s,box-shadow .18s,border-color .18s;-webkit-tap-highlight-color:transparent;
}
.mk-card:hover:not(:disabled){transform:translateY(-3px);border-color:rgba(128,54,136,.35);box-shadow:var(--card-shadow-hover)}
.mk-card:disabled{opacity:.5;cursor:default}
.mk-card.busy:disabled{opacity:1;cursor:progress;border-color:rgba(128,54,136,.35)}
.mk-card:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.mk-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}
.mk-no small{display:block;font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--faint)}
.mk-no strong{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:30px;line-height:1.05;letter-spacing:-.02em;color:var(--brand);font-variant-numeric:tabular-nums}
.mk-meta{display:block;font-size:12.5px;font-weight:600;color:var(--mute)}

/* Sealed preview: a fixed-height window onto blurred question lines, with a crisp lock pill on top.
   Fixed height and an absolutely-positioned blur layer, so nothing the label does can resize it. */
.mk-sealed{
  position:relative;display:flex;align-items:center;justify-content:center;
  height:78px;border-radius:12px;overflow:hidden;
  background:linear-gradient(180deg,#F6F7FD 0%,#FFFFFF 100%);
}
.mk-blur{
  position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;gap:9px;padding:0 14px;
  filter:blur(3.5px);opacity:.62;pointer-events:none;
  -webkit-mask-image:linear-gradient(to bottom,transparent,#000 26%,#000 74%,transparent);
  mask-image:linear-gradient(to bottom,transparent,#000 26%,#000 74%,transparent);
}
.mk-blur span{display:block;height:8px;border-radius:99px;background:var(--body)}
.mk-blur span:first-child{background:var(--accent-d)}
.mk-seal-tag{
  position:relative;z-index:1;display:inline-flex;align-items:center;gap:5px;flex:none;white-space:nowrap;
  padding:4px 11px;border-radius:999px;background:#fff;border:1px solid rgba(128,54,136,.3);
  font-size:10px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--accent-d);
  box-shadow:0 0 0 8px rgba(255,255,255,.9),0 2px 8px -4px rgba(0,51,102,.4);
}

/* Syllabus: a small aligned list — subject left, its topic right */
.mk-sy{display:flex;flex-direction:column;gap:5px}
.mk-sy-label{font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);margin-bottom:3px}
.mk-sy-row{display:grid;grid-template-columns:72px minmax(0,1fr);gap:10px;align-items:baseline}
.mk-sy-subject{font-size:11px;font-weight:700;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-sy-topic{font-size:12px;font-weight:500;color:var(--body);line-height:1.35}

/* Action bar: quiet white, only warming to violet on hover */
.mk-card-foot{
  margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:8px;
  padding:12px 16px;border-radius:12px;
  background:linear-gradient(135deg,#fff 0%,rgba(128,54,136,.10) 100%);
  border:1px solid rgba(128,54,136,.22);color:var(--accent-d);
  font-weight:800;font-size:14px;transition:background .15s,border-color .15s;
}
.mk-card-foot svg{transition:transform .18s}
.mk-card:hover:not(:disabled) .mk-card-foot{
  background:linear-gradient(135deg,rgba(128,54,136,.08) 0%,rgba(128,54,136,.24) 100%);
  border-color:var(--accent);
}
.mk-card:hover:not(:disabled) .mk-card-foot svg{transform:translateX(3px)}
/* Wait state, shown inside the card that was clicked */
.mk-foot-busy{display:inline-flex;align-items:center;gap:8px}
.mk-foot-busy .mk-spin{width:14px;height:14px;border-width:2px}

.mk-chip{display:inline-block;font-size:11px;font-weight:800;padding:4px 11px;border-radius:999px;white-space:nowrap}
.mk-d-easy{background:var(--ice);color:var(--brand)}
.mk-d-medium{background:var(--amber);color:var(--brand)}
.mk-d-hard{background:var(--red-soft);color:var(--red)}
.mk-st-done{background:var(--ice);color:var(--brand)}
.mk-st-live{background:var(--amber);color:#6B4419}
.mk-st-off{background:var(--red-soft);color:var(--red)}


.mk-error{background:var(--red-soft);color:var(--red);border-left:4px solid var(--red);border-radius:12px;padding:12px 14px;font-weight:700;font-size:14px;margin-bottom:20px;overflow-wrap:anywhere}

/* Past attempts */
.mk-hist h2{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:clamp(20px,3.4cqi,26px);letter-spacing:-.02em;color:var(--brand);margin-bottom:14px}
.mk-tablewrap{border:1px solid var(--line);border-radius:20px;overflow-x:auto;background:#fff;box-shadow:var(--card-shadow)}
.mk-table{width:100%;border-collapse:collapse;font-size:13px}
.mk-table th{background:var(--ice);color:var(--brand);text-align:left;font-size:11px;letter-spacing:.08em;text-transform:uppercase;padding:12px 14px;font-weight:800;white-space:nowrap}
.mk-table td{padding:12px 14px;border-top:1px solid #E8EDFC;vertical-align:middle}
.mk-table td b{font-variant-numeric:tabular-nums}
.mk-muted{color:var(--mute);white-space:nowrap}
.mk-good{color:var(--green);font-weight:800}
.mk-bad{color:var(--red);font-weight:800}
.mk-dash{color:#A7B0D6}
.mk-act-row{display:flex;gap:8px;align-items:center}
.mk-sep{color:#A7B0D6}

/* Modal */
.mk-modal{position:fixed;inset:0;z-index:100;display:grid;place-items:center;padding:16px;background:rgba(0,51,102,.45)}
.mk-dialog{width:100%;max-width:420px;background:#fff;border:1px solid var(--line);border-radius:20px;padding:26px 24px 22px;box-shadow:0 24px 48px -24px rgba(0,51,102,.5)}
.mk-dialog h3{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:22px;letter-spacing:-.02em;color:var(--brand);margin-bottom:10px}
.mk-dialog p{font-size:14.5px;line-height:1.6;color:var(--body)}
.mk-actions{display:flex;gap:12px;justify-content:flex-end;flex-wrap:wrap;margin-top:22px}

@keyframes mk-roll{from{opacity:0;translate:0 16px;scale:.97}to{opacity:1;translate:0 0;scale:1}}
@keyframes mk-rot{to{transform:rotate(360deg)}}

/* ═════════ RESPONSIVE ═════════
   Page-level: the study sidebar drops under the content on narrower screens. */
@media(max-width:1180px){
  .mk-row{flex-direction:column;align-items:stretch;gap:28px}
  .mk-col{width:100%}
  .mk-aside{width:100%}
}

/* Component-level: these follow the width of the content column itself, which changes with the app sidebar. */
@container mk (max-width:760px){
  .mk-cols{gap:20px}
}
@container mk (max-width:640px){
  .mk-cols{grid-template-columns:minmax(0,1fr)}
  /* Past attempts become one card per attempt */
  .mk-tablewrap{overflow:visible}
  .mk-table,.mk-table tbody,.mk-table tr,.mk-table td{display:block;width:100%}
  .mk-table thead{display:none}
  .mk-table tr{padding:14px 16px;border-top:1px solid #E1E8FB}
  .mk-table tr:first-child{border-top:0}
  .mk-table td{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:6px 0;border:0}
  .mk-table td::before{content:attr(data-label);font-weight:800;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
  .mk-table td.mk-act{justify-content:flex-start;padding-top:10px}
  .mk-table td.mk-act::before{display:none}
  .mk-table td.mk-act:empty{display:none}
}
@container mk (max-width:520px){
  .mk-hero{padding:24px 0 28px}
  .mk-hstat{max-width:none;flex:1 1 100%}
  .mk-exam{flex:1 1 100%;padding:16px 18px}
  .mk-sheet{padding:26px 16px 20px}
  .mk-stats{grid-template-columns:minmax(0,1fr);gap:10px}
  .mk-stat{display:flex;align-items:baseline;justify-content:space-between;gap:12px}
  .mk-stat strong{font-size:18px}
  .mk-listhead{align-items:flex-start}
  .mk-filters{width:100%}
  .mk-fchip{flex:1 1 auto}
  .mk-pg-num{display:none}
  .mk-pg-num.on{display:inline-flex;align-items:center;justify-content:center}
  .mk-pg-of{display:none}
  .mk-pager{gap:10px}
}
@container mk (max-width:360px){
  .mk-hero h1{font-size:26px}
  .mk-card{padding:16px 14px 14px}
  .mk-btn-danger{font-size:14px}
}

@media(max-width:480px){
  .mk-dialog{padding:22px 18px 18px}
  .mk-actions .mk-btn-danger,.mk-actions .mk-btn-ghost{flex:1 1 100%}
}

/* Touch devices: no hover lift, and the card action bar keeps its resting look */
@media(hover:none){
  .mk-exam:hover,.mk-card:hover:not(:disabled){transform:none;border-color:var(--line);box-shadow:var(--card-shadow)}
  .mk-card:hover:not(:disabled) .mk-card-foot{background:linear-gradient(135deg,#fff 0%,rgba(128,54,136,.10) 100%);border-color:rgba(128,54,136,.22)}
  .mk-card:hover:not(:disabled) .mk-card-foot svg{transform:none}
  .mk-btn-danger:hover:not(:disabled){transform:none;box-shadow:0 6px 0 var(--red-d)}
}

@media(prefers-reduced-motion:reduce){
  .mk-row *,.mk-modal *{animation:none!important;transition:none!important}
}
`;