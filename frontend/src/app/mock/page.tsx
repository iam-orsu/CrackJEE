'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { StudySidebar } from '@/components/StudySidebar';
import { api } from '@/lib/api';
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
  const [starting, setStarting] = useState(false);
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

  async function startPaper(examType: ExamType, difficultyMode: DifficultyMode) {
    if (starting) return;
    if (activeExam) {
      setError('Terminate your exam in progress before starting a new paper.');
      // Take the student to the in-progress exam and its Terminate button
      historyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
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
    <div className="app-shell">
      <style>{css}</style>
      <Sidebar />
      <main className="app-main">
        <div className="mk-row">
          <div className="mk-col">
            {/* ── Header ── */}
            <header className="mk-hero">
              <h1>Mock Test</h1>
              <p>Full-length exam simulation with real JEE marking schemes and a 3-hour timer.</p>
              <div className="mk-hero-stamps">
                <span>3-hour timer</span>
                <span>Real marking</span>
              </div>
              <span className="mk-hero-note">all the best!</span>
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
                <p className="mk-hand">pick an exam to see the papers</p>
              </div>
            )}

            {/* ── Exam details ── */}
            {info && (
              <section className="mk-sheet">
                <span className="mk-tape" />
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

                <Pager page={page} pageCount={pageCount} disabled={starting} onPageChange={setPage} />

                <div className="mk-grid" aria-busy={starting}>
                  {/* Keyed by filter and page, so every change rolls the papers out again, one after another */}
                  {pagePapers.map((p, i) => (
                    <div
                      key={`${filter}-${page}-${p.number}`}
                      className="mk-roll"
                      style={{ animationDelay: `${i * 45}ms` }}
                    >
                      <article className={`mk-card${p.difficulty === 'hard' ? ' hard' : ''}`}>
                        <div className="mk-card-top">
                          <div className="mk-no">
                            <small>Paper</small>
                            <strong>#{p.number}</strong>
                          </div>
                          <span className={`mk-chip mk-d-${p.difficulty}`}>{DIFFICULTY_LABELS[p.difficulty]}</span>
                        </div>

                        <p className="mk-meta">
                          {PLACEHOLDER_QUESTION_COUNT[selected]} questions · {EXAM_INFO[selected].duration}
                        </p>

                        <div className="mk-subj">
                          {PLACEHOLDER_SUBJECTS[selected].map((s) => <span key={s}>{s}</span>)}
                        </div>

                        <p className="mk-topics">
                          <b>Topics</b> {topicsFor(p.number, selected).join(' · ')}
                        </p>

                        <button
                          type="button"
                          className="mk-btn-red mk-start"
                          disabled={starting}
                          onClick={() => startPaper(selected, p.difficulty)}
                        >
                          Start paper →
                        </button>
                      </article>
                    </div>
                  ))}
                  {starting && (
                    <div className="mk-overlay">
                      <span className="mk-spin" />
                      Preparing your paper...
                    </div>
                  )}
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
      </main>

      {/* Kept outside the content column so the fixed overlay always covers the whole screen */}
      {confirmTerminate && (
        <div className="mk-modal" onClick={() => setConfirmTerminate(null)}>
          <div className="mk-dialog" role="dialog" aria-modal="true" aria-labelledby="mk-tt" onClick={(e) => e.stopPropagation()}>
            <h3 id="mk-tt">Terminate exam?</h3>
            <p>This will end the session immediately. Your progress will be lost and this cannot be undone.</p>
            <div className="mk-actions">
              <button type="button" className="mk-btn-ghost" onClick={() => setConfirmTerminate(null)}>Cancel</button>
              <button type="button" className="mk-btn-red" onClick={() => confirmTerminateExam(confirmTerminate)}>Terminate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.mk-row,.mk-modal{
  --blue:#0B2A9B; --blue-d:#071C6B; --blue-l:#2A4FD6;
  --red:#C8202F; --red-d:#8F1521; --ice:#EEF2FF; --ink:#0E1A55; --mute:#5663A0;
  /* Remap the app's own tokens so StudySidebar (inside this page) picks up the palette */
  --gray-50:#F5F7FF; --gray-100:#E8EDFC; --gray-200:#D7DFFA; --gray-300:#C6D2F8; --gray-400:#97A3D4;
  --gray-500:#5663A0; --gray-600:#3C4A8A; --gray-700:#31407F; --gray-800:#1B2866; --gray-900:#0E1A55;
  font-family:'Plus Jakarta Sans',system-ui,sans-serif; color:var(--ink);
}
.mk-row *,.mk-modal *{box-sizing:border-box}
.mk-row h1,.mk-row h2,.mk-row h3,.mk-row p,.mk-row ul,.mk-modal h3,.mk-modal p{margin:0;padding:0}

/* Layout: content column + study sidebar */
.mk-row{display:flex;gap:32px;align-items:flex-start;max-width:1200px}
.mk-col{flex:1 1 0;min-width:0;max-width:900px;container-type:inline-size;container-name:mk}
.mk-aside{flex:0 0 auto;min-width:0}

/* Shared bits */
.mk-hand{font-family:'Caveat',cursive;font-weight:600;font-size:26px;color:var(--red)}
.mk-link{color:var(--blue);font-weight:800;text-decoration:underline;text-underline-offset:3px;font-size:13px}
.mk-linkbtn{background:none;border:0;padding:0;font:inherit;font-size:13px;font-weight:800;color:var(--red-d);text-decoration:underline;text-underline-offset:3px;cursor:pointer}
.mk-linkbtn:disabled{opacity:.6;cursor:default}
.mk-btn-red{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:0 20px;
  font:inherit;font-weight:800;font-size:15px;color:#fff;background:var(--red);border:0;border-radius:14px;cursor:pointer;
  box-shadow:0 6px 0 var(--red-d);transition:transform .15s,box-shadow .15s;-webkit-tap-highlight-color:transparent;
}
.mk-btn-red:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 9px 0 var(--red-d)}
.mk-btn-red:active:not(:disabled){transform:translateY(4px);box-shadow:0 2px 0 var(--red-d)}
.mk-btn-red:disabled{opacity:.7;cursor:not-allowed}
.mk-btn-ghost{
  min-height:48px;padding:0 20px;font:inherit;font-weight:800;font-size:15px;color:var(--blue);background:#fff;
  border:2.5px solid var(--blue);border-radius:14px;box-shadow:0 4px 0 #C6D2F8;cursor:pointer;
}
.mk-spin{width:18px;height:18px;border-radius:50%;border:3px solid rgba(11,42,155,.25);border-top-color:var(--blue);animation:mk-rot .7s linear infinite}

/* Header: ruled blue notebook page */
.mk-hero{
  position:relative;overflow:hidden;color:#fff;border-radius:22px;padding:26px 24px 24px 76px;margin-bottom:26px;
  background-color:var(--blue);
  background-image:
    repeating-linear-gradient(to bottom, transparent 0 31px, rgba(255,255,255,.11) 31px 32px),
    radial-gradient(600px 300px at 90% 0%, var(--blue-l) 0%, transparent 70%);
  box-shadow:0 8px 0 var(--blue-d);
}
.mk-hero::before{content:"";position:absolute;top:0;bottom:0;left:48px;width:2px;background:var(--red)}
.mk-hero h1{font-family:'Fraunces',serif;font-weight:800;font-size:clamp(28px,5cqi,42px);line-height:1.05;letter-spacing:-.02em}
.mk-hero p{margin-top:10px;max-width:560px;line-height:1.6;font-size:15px;opacity:.92}
.mk-hero-stamps{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}
.mk-hero-stamps span{border:2px dashed rgba(255,255,255,.6);border-radius:8px;padding:5px 12px;font-weight:800;font-size:11px;letter-spacing:.1em;text-transform:uppercase}
.mk-hero-stamps span:nth-child(1){transform:rotate(-1.5deg)}
.mk-hero-stamps span:nth-child(2){transform:rotate(1.5deg);border-color:#ff9aa4;color:#ffd5d9}
.mk-hero-note{position:absolute;right:26px;top:18px;transform:rotate(5deg);font-family:'Caveat',cursive;font-weight:600;font-size:26px;color:#FFE680}

/* Exam type */
.mk-exams{display:flex;flex-wrap:wrap;gap:16px;margin-bottom:28px}
.mk-exam{
  flex:1 1 200px;text-align:left;padding:18px 22px;font:inherit;color:var(--blue);background:#fff;
  border:3px solid var(--blue);border-radius:18px;cursor:pointer;box-shadow:0 7px 0 #C6D2F8;
  transition:transform .15s,box-shadow .15s,background .15s,color .15s;-webkit-tap-highlight-color:transparent;
}
.mk-exam:hover{transform:translateY(-3px);box-shadow:0 10px 0 #C6D2F8}
.mk-exam.on{background:var(--blue);color:#fff;box-shadow:0 7px 0 var(--blue-d);transform:none}
.mk-exam strong{display:block;font-family:'Fraunces',serif;font-weight:800;font-size:22px;margin-bottom:4px}
.mk-exam span{font-size:13px;font-weight:600;opacity:.8}
.mk-exam:focus-visible,.mk-fchip:focus-visible,.mk-pg:focus-visible{outline:3px solid var(--red);outline-offset:2px}

.mk-empty{display:flex;align-items:center;gap:14px;padding:4px 8px 34px}
.mk-empty svg{width:64px;height:50px;flex:none;fill:none;stroke:var(--red);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}

/* Exam details: taped sheet */
.mk-sheet{
  position:relative;background:#fffdf7;border:2px solid #E7E1D0;border-radius:10px;padding:28px 24px 24px;margin-bottom:32px;
  box-shadow:0 2px 0 #e7e1d0,0 16px 30px rgba(7,28,107,.12);transform:rotate(-.3deg);
}
.mk-tape{position:absolute;top:-11px;left:30px;width:80px;height:22px;background:rgba(255,236,170,.9);transform:rotate(-4deg);box-shadow:0 2px 4px rgba(0,0,0,.15)}
.mk-sheet-top{display:flex;align-items:baseline;justify-content:space-between;gap:10px;flex-wrap:wrap}
.mk-sheet-top h2{font-family:'Fraunces',serif;font-weight:800;font-size:26px;color:var(--blue)}
.mk-sheet-top p{font-size:13px;font-weight:700;color:var(--mute)}
.mk-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:16px 0 22px}
.mk-stat{background:#fff;border:2px solid var(--blue);border-radius:14px;padding:12px 14px;box-shadow:0 4px 0 #C6D2F8;min-width:0}
.mk-stat small{display:block;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);margin-bottom:2px}
.mk-stat strong{font-family:'Fraunces',serif;font-weight:800;font-size:20px;color:var(--blue);overflow-wrap:anywhere}
.mk-cols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
.mk-label{display:inline-block;background:var(--red);color:#fff;font-weight:800;font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding:5px 11px;border-radius:999px;margin-bottom:12px}
.mk-list{list-style:none;display:grid;gap:8px}
.mk-list li{display:flex;gap:10px;font-size:13.5px;line-height:1.5;color:#2B3A78;font-weight:500}
.mk-list li::before{content:"";flex:none;width:8px;height:8px;margin-top:6px;border-radius:2px;background:var(--blue);transform:rotate(45deg)}

/* Paper list */
.mk-papers{margin-bottom:44px}
.mk-notice{
  display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:22px;
  background:#FFE680;color:var(--ink);padding:14px 18px;border-radius:6px;font-size:13.5px;font-weight:700;line-height:1.5;
  transform:rotate(-.4deg);box-shadow:0 10px 18px rgba(7,28,107,.18);
}
.mk-notice-actions{display:flex;gap:16px;align-items:center}
.mk-listhead{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:6px}
.mk-listhead h2{font-family:'Fraunces',serif;font-weight:800;font-size:clamp(20px,3.4cqi,26px);color:var(--blue)}
.mk-listhead p{font-size:12.5px;font-weight:600;color:var(--mute);margin-top:4px;line-height:1.5}
.mk-filters{display:flex;flex-wrap:wrap;gap:8px}
.mk-fchip{
  min-height:42px;padding:0 16px;font:inherit;font-weight:800;font-size:13px;color:var(--blue);background:#fff;
  border:2.5px solid var(--blue);border-radius:12px;cursor:pointer;box-shadow:0 4px 0 #C6D2F8;
  transition:transform .12s,box-shadow .12s,background .12s;-webkit-tap-highlight-color:transparent;
}
.mk-fchip:hover:not(.on){transform:translateY(-2px);box-shadow:0 6px 0 #C6D2F8}
.mk-fchip.on{background:var(--blue);color:#fff;box-shadow:0 4px 0 var(--blue-d)}

/* Pager */
.mk-pager{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;margin:16px 0}
.mk-pg{
  min-width:42px;min-height:42px;padding:0 12px;font:inherit;font-weight:800;font-size:14px;color:var(--blue);background:#fff;
  border:2.5px solid var(--blue);border-radius:12px;box-shadow:0 4px 0 #C6D2F8;cursor:pointer;
  transition:transform .12s;-webkit-tap-highlight-color:transparent;
}
.mk-pg:hover:not(:disabled):not(.on){transform:translateY(-2px)}
.mk-pg.on{background:var(--red);border-color:var(--red);color:#fff;box-shadow:0 4px 0 var(--red-d)}
.mk-pg:disabled{opacity:.45;cursor:not-allowed}
.mk-dots{color:var(--mute);font-weight:800;padding:0 2px}
.mk-pg-of{display:none;font-size:13px;font-weight:700;color:var(--mute)}

/* Cards */
.mk-grid{position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px 18px;padding:8px 2px 10px}
.mk-roll{display:flex;animation:mk-roll .45s cubic-bezier(.2,.8,.2,1) both}
.mk-card{
  flex:1;display:flex;flex-direction:column;gap:12px;min-width:0;background:#fff;
  border:3px solid var(--blue);border-radius:20px;padding:18px 16px 16px;box-shadow:0 7px 0 var(--blue-d);
  transition:transform .15s,box-shadow .15s;
}
.mk-card.hard{border-color:var(--red);box-shadow:0 7px 0 var(--red-d)}
.mk-roll:nth-child(3n+1) .mk-card{transform:rotate(-.6deg)}
.mk-roll:nth-child(3n+2) .mk-card{transform:rotate(.4deg)}
.mk-roll:nth-child(3n) .mk-card{transform:rotate(-.2deg)}
.mk-card:hover{transform:rotate(0) translateY(-5px)}
.mk-card:not(.hard):hover{box-shadow:0 12px 0 var(--blue-d)}
.mk-card.hard:hover{box-shadow:0 12px 0 var(--red-d)}
.mk-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}
.mk-no small{display:block;font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}
.mk-no strong{font-family:'Fraunces',serif;font-weight:800;font-size:30px;line-height:1.05;color:var(--blue)}
.mk-meta{font-size:12.5px;font-weight:700;color:var(--mute)}
.mk-subj{display:flex;flex-wrap:wrap;gap:6px}
.mk-subj span{border:1.5px dashed var(--blue);border-radius:6px;padding:3px 8px;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--blue)}
.mk-topics{font-size:12.5px;line-height:1.6;color:#31407F;font-weight:500}
.mk-topics b{color:var(--red);font-weight:800;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;margin-right:4px}
.mk-start{margin-top:auto;width:100%}

.mk-chip{display:inline-block;font-size:11px;font-weight:800;padding:4px 11px;border-radius:999px;white-space:nowrap;background:#F1F3FA;color:#374151}
.mk-d-easy{background:var(--ice);color:var(--blue)}
.mk-d-medium{background:#FFE680;color:var(--ink)}
.mk-d-hard{background:#FDE6E8;color:var(--red-d)}
.mk-st-done{background:var(--ice);color:var(--blue)}
.mk-st-live{background:#FFE680;color:var(--ink)}
.mk-st-off{background:#FDE6E8;color:var(--red-d)}

.mk-overlay{
  position:absolute;inset:0;z-index:5;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;
  background:rgba(255,255,255,.82);border-radius:20px;font-weight:800;color:var(--blue);font-size:16px;text-align:center;padding:16px;
}
.mk-overlay .mk-spin{width:30px;height:30px;border-width:4px}

.mk-error{background:#FDE6E8;color:var(--red-d);border-left:5px solid var(--red);border-radius:10px;padding:12px 14px;font-weight:700;font-size:14px;margin-bottom:20px;overflow-wrap:anywhere}

/* Past attempts */
.mk-hist h2{font-family:'Fraunces',serif;font-weight:800;font-size:clamp(20px,3.4cqi,26px);color:var(--blue);margin-bottom:14px}
.mk-tablewrap{border:3px solid var(--blue);border-radius:18px;overflow-x:auto;background:#fff;box-shadow:0 7px 0 #C6D2F8}
.mk-table{width:100%;border-collapse:collapse;font-size:13px}
.mk-table th{background:var(--ice);color:var(--blue);text-align:left;font-size:11px;letter-spacing:.08em;text-transform:uppercase;padding:12px 14px;font-weight:800;white-space:nowrap}
.mk-table td{padding:12px 14px;border-top:1px solid #E1E8FB;vertical-align:middle}
.mk-muted{color:var(--mute);white-space:nowrap}
.mk-good{color:#15803d;font-weight:800}
.mk-bad{color:var(--red);font-weight:800}
.mk-dash{color:#A7B0D6}
.mk-act-row{display:flex;gap:8px;align-items:center}
.mk-sep{color:#A7B0D6}

/* Modal */
.mk-modal{position:fixed;inset:0;z-index:100;display:grid;place-items:center;padding:16px;background:rgba(7,28,107,.45)}
.mk-dialog{width:100%;max-width:420px;background:#fffdf7;border:3px solid var(--blue);border-radius:18px;padding:26px 24px 22px;box-shadow:0 10px 0 var(--blue-d)}
.mk-dialog h3{font-family:'Fraunces',serif;font-weight:800;font-size:24px;color:var(--blue);margin-bottom:10px}
.mk-dialog p{font-size:14.5px;line-height:1.6;color:#2B3A78}
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
  .mk-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .mk-cols{gap:20px}
}
@container mk (max-width:640px){
  .mk-cols{grid-template-columns:minmax(0,1fr)}
  .mk-hero-note{display:none}
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
  .mk-grid{grid-template-columns:minmax(0,1fr)}
  .mk-roll .mk-card{transform:none}
  .mk-hero{padding:22px 18px 20px 56px;border-radius:18px}
  .mk-hero::before{left:34px}
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
  .mk-btn-red{font-size:14px}
}

@media(max-width:480px){
  .mk-dialog{padding:22px 18px 18px}
  .mk-actions .mk-btn-red,.mk-actions .mk-btn-ghost{flex:1 1 100%}
}

/* Touch devices: no hover lift */
@media(hover:none){
  .mk-exam:hover,.mk-fchip:hover:not(.on),.mk-pg:hover:not(:disabled):not(.on){transform:none}
  .mk-btn-red:hover:not(:disabled){transform:none;box-shadow:0 6px 0 var(--red-d)}
  .mk-card:hover{transform:none}
}

@media(prefers-reduced-motion:reduce){
  .mk-row *,.mk-modal *{animation:none!important;transition:none!important}
}
`;