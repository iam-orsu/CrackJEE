'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  facultyCreatePaper,
  facultyDeletePaper,
  facultyGetPaper,
  facultyGetTopics,
  facultyListPapers,
  facultyLogin,
  facultyLogout,
  facultyMe,
  FacultyError,
  type FacultyDifficulty,
  type FacultyExamType,
  type FacultyPaper,
  type FacultyPaperSelection,
  type FacultyPaperSummary,
  type FacultyQuestionTypePref,
  type FacultyUser,
} from '@/lib/faculty';
import { FacultyPaperPreview } from '@/components/faculty/FacultyPaperPreview';
import styles from './faculty.module.css';

const COUNT_PRESETS: Record<FacultyExamType, Array<{ count: number; label: string }>> = {
  Main: [
    { count: 15, label: '15 (Quiz)' },
    { count: 30, label: '30 (Half)' },
    { count: 75, label: '75 (NTA Full)' },
    { count: 90, label: '90 (Classic)' },
  ],
  Advanced: [
    { count: 18, label: '18 (Quiz)' },
    { count: 36, label: '36 (2x)' },
    { count: 54, label: '54 (Paper)' },
  ],
  NEET: [
    { count: 20, label: '20 (Quiz)' },
    { count: 45, label: '45 (1 Subj)' },
    { count: 90, label: '90 (Half)' },
    { count: 180, label: '180 (NTA Full)' },
  ],
};

const DEFAULT_COUNT: Record<FacultyExamType, number> = {
  Main: 75,
  Advanced: 54,
  NEET: 180,
};

function FacultyLoginForm({ onSignedIn }: { onSignedIn: (user: FacultyUser) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await facultyLogin(email, password);
      onSignedIn(res.faculty);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.loginWrap}>
      <form className={styles.loginBox} onSubmit={handleSubmit}>
        <span className={styles.loginBadge}>Faculty Portal</span>
        <h1 className={styles.loginTitle}>Weekly Exam Paper Studio</h1>
        <p className={styles.loginSub}>Sign in with your mentor credentials to generate verified JEE &amp; NEET papers.</p>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="faculty-email">Faculty Email</label>
          <input
            id="faculty-email"
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="faculty-password">Password</label>
          <input
            id="faculty-password"
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <button type="submit" className={styles.btnPrimary} style={{ width: '100%' }} disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in to Faculty Studio'}
        </button>
      </form>
    </div>
  );
}

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<FacultyUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Builder state (JEE Main defaults to 75 per NTA 2025-2026 pattern)
  const [builderOpen, setBuilderOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [examType, setExamType] = useState<FacultyExamType>('Main');
  const [difficulty, setDifficulty] = useState<FacultyDifficulty>('intermediate');
  const [questionCount, setQuestionCount] = useState(75);
  const [questionType, setQuestionType] = useState<FacultyQuestionTypePref>('auto');

  const [subjects, setSubjects] = useState<string[]>(['Physics', 'Chemistry', 'Mathematics']);
  const [topicsBySubject, setTopicsBySubject] = useState<Record<string, string[]>>({});
  const [activeSubject, setActiveSubject] = useState('Physics');
  const [topicSearch, setTopicSearch] = useState('');
  const [selections, setSelections] = useState<FacultyPaperSelection[]>([]);

  // Stacked Paper Library & Opened Paper Workspace
  const [papers, setPapers] = useState<FacultyPaperSummary[]>([]);
  const [activePaper, setActivePaper] = useState<FacultyPaper | null>(null);
  const [activePaperTopics, setActivePaperTopics] = useState<Record<string, string[]>>({});
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const loadWorkspace = useCallback(async (currentExam: FacultyExamType) => {
    const [topicsRes, papersRes] = await Promise.all([
      facultyGetTopics(currentExam),
      facultyListPapers(),
    ]);
    setSubjects(topicsRes.subjects);
    setTopicsBySubject(topicsRes.topics);
    setActiveSubject((prev) => (topicsRes.subjects.includes(prev) ? prev : (topicsRes.subjects[0] ?? 'Physics')));
    setPapers(papersRes.papers);
    setBuilderOpen(papersRes.papers.length === 0);
  }, []);

  useEffect(() => {
    let active = true;
    facultyMe()
      .then((res) => {
        if (!active) return;
        setFaculty(res.faculty);
        return loadWorkspace('Main');
      })
      .catch(() => {
        if (active) setFaculty(null);
      })
      .finally(() => {
        if (active) setAuthChecked(true);
      });
    return () => { active = false; };
  }, [loadWorkspace]);

  async function handleExamTypeChange(nextExam: FacultyExamType) {
    setExamType(nextExam);
    setTopicSearch('');
    setQuestionCount(DEFAULT_COUNT[nextExam]);
    if (nextExam === 'Advanced') {
      setDifficulty('advanced');
      setQuestionType('auto');
    } else if (nextExam === 'NEET') {
      setDifficulty('intermediate');
      setQuestionType('mcq_single');
    } else {
      setDifficulty('intermediate');
      setQuestionType('auto');
    }

    try {
      const res = await facultyGetTopics(nextExam);
      setSubjects(res.subjects);
      setTopicsBySubject(res.topics);
      setActiveSubject(res.subjects[0] ?? 'Physics');
      setSelections((prev) => prev.filter((sel) => res.topics[sel.subject]?.includes(sel.topic)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load topics');
    }
  }

  // Poll active generating paper every 2.5s
  useEffect(() => {
    if (!faculty || !activePaper || activePaper.status !== 'generating') return;
    const timer = setInterval(async () => {
      try {
        const res = await facultyGetPaper(activePaper.id);
        setActivePaper(res.paper);
        if (res.paper.status !== 'generating') {
          const listRes = await facultyListPapers();
          setPapers(listRes.papers);
        }
      } catch (err) {
        if (err instanceof FacultyError && err.status === 401) {
          setFaculty(null);
        }
      }
    }, 2500);
    return () => clearInterval(timer);
  }, [faculty, activePaper]);

  const visibleTopics = useMemo(() => {
    const all = topicsBySubject[activeSubject] ?? [];
    const q = topicSearch.trim().toLowerCase();
    return q ? all.filter((t) => t.toLowerCase().includes(q)) : all;
  }, [topicsBySubject, activeSubject, topicSearch]);

  function toggleSelection(subject: FacultyPaperSelection['subject'], topic: string) {
    setSelections((prev) => {
      const exists = prev.some((s) => s.subject === subject && s.topic === topic);
      return exists
        ? prev.filter((s) => !(s.subject === subject && s.topic === topic))
        : [...prev, { subject, topic }];
    });
  }

  async function handleOpenPaper(id: string) {
    setError('');
    try {
      const res = await facultyGetPaper(id);
      const topicsRes = await facultyGetTopics(res.paper.examType);
      setActivePaperTopics(topicsRes.topics);
      setActivePaper(res.paper);
      setBuilderOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open paper');
    }
  }

  async function handleCreatePaper(e: React.FormEvent) {
    e.preventDefault();
    if (selections.length === 0) {
      setError('Select at least one subject & topic before generating.');
      return;
    }
    setCreating(true);
    setError('');
    try {
      const res = await facultyCreatePaper({
        title: title.trim() || undefined,
        examType,
        difficulty: examType === 'Advanced' ? 'advanced' : difficulty,
        questionCount,
        questionType,
        selections,
      });
      const listRes = await facultyListPapers();
      setPapers(listRes.papers);
      setActivePaperTopics(topicsBySubject);
      setActivePaper(res.paper);
      setBuilderOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start paper generation');
    } finally {
      setCreating(false);
    }
  }

  async function handleDeletePaper(id: string) {
    setError('');
    try {
      await facultyDeletePaper(id);
      const listRes = await facultyListPapers();
      setPapers(listRes.papers);
      if (activePaper?.id === id) {
        setActivePaper(null);
      }
      if (listRes.papers.length === 0) setBuilderOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete paper');
    }
  }

  async function handleLogout() {
    await facultyLogout().catch(() => undefined);
    setFaculty(null);
    setPapers([]);
    setActivePaper(null);
  }

  if (!authChecked) {
    return (
      <div className={styles.loginWrap}>
        <p className={styles.sub}>Checking faculty session…</p>
      </div>
    );
  }

  if (!faculty) {
    return (
      <FacultyLoginForm
        onSignedIn={(user) => {
          setFaculty(user);
          void loadWorkspace(examType);
        }}
      />
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Faculty Weekly Paper Studio</h1>
            <p className={styles.sub}>Signed in as {faculty.name} ({faculty.email}) · {papers.length} paper(s) generated</p>
          </div>
          <div className={styles.headerActions}>
            {!activePaper && (
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => setBuilderOpen((v) => !v)}
              >
                {builderOpen ? 'Close Builder' : '+ Generate New Paper'}
              </button>
            )}
            <button type="button" className={styles.btn} onClick={handleLogout}>Sign out</button>
          </div>
        </header>

        {error && <div className={styles.error}>{error}</div>}

        {activePaper ? (
          <FacultyPaperPreview
            paper={activePaper}
            topicsBySubject={activePaperTopics}
            onBack={() => setActivePaper(null)}
            onPaperUpdated={(updated) => {
              setActivePaper(updated);
              setPapers((prev) =>
                prev.map((row) =>
                  row.id === updated.id
                    ? {
                        ...row,
                        questionCount: updated.questionCount,
                        verifiedCount: updated.verifiedCount,
                        status: updated.status,
                      }
                    : row,
                ),
              );
            }}
            onDelete={handleDeletePaper}
            onError={setError}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {builderOpen && (
              <form className={styles.panel} onSubmit={handleCreatePaper}>
                <div className={styles.panelTitle}>
                  <span>Create Verified Exam Paper</span>
                  {papers.length > 0 && (
                    <button type="button" className={styles.btn} onClick={() => setBuilderOpen(false)}>
                      Hide
                    </button>
                  )}
                </div>

                <div className={styles.builderGrid}>
                  <div>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="paper-title">Paper Title (optional, neutral)</label>
                      <input
                        id="paper-title"
                        className={styles.input}
                        placeholder="e.g. Week 4 Rotational Motion & Electrochemistry"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={120}
                      />
                    </div>

                    <div className={styles.row2}>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="paper-exam">Exam Pattern</label>
                        <select
                          id="paper-exam"
                          className={styles.select}
                          value={examType}
                          onChange={(e) => void handleExamTypeChange(e.target.value as FacultyExamType)}
                        >
                          <option value="Main">JEE Main (NTA Rationalized)</option>
                          <option value="Advanced">JEE Advanced (IIT Rigor Only)</option>
                          <option value="NEET">NEET-UG (NCERT Medical)</option>
                        </select>
                      </div>

                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="paper-diff">Cognitive Rigor</label>
                        {examType === 'Advanced' ? (
                          <>
                            <input
                              id="paper-diff"
                              className={styles.input}
                              value="Strict JEE Advanced Only"
                              disabled
                            />
                            <div className={styles.strictHint}>Locked to IIT JEE Advanced multi-concept rigor</div>
                          </>
                        ) : (
                          <select
                            id="paper-diff"
                            className={styles.select}
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as FacultyDifficulty)}
                          >
                            <option value="beginner">Beginner (Entry Competitive)</option>
                            <option value="intermediate">Intermediate (Standard Exam)</option>
                            <option value="advanced">Advanced (Rank-Decider)</option>
                            <option value="mixed">Mixed (Balanced)</option>
                          </select>
                        )}
                      </div>
                    </div>

                    <div className={styles.row2}>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="paper-count">Question Count (1–180)</label>
                        <input
                          id="paper-count"
                          type="number"
                          min={1}
                          max={180}
                          className={styles.input}
                          value={questionCount}
                          onChange={(e) => setQuestionCount(Math.max(1, Math.min(180, Number(e.target.value) || 1)))}
                          required
                        />
                        <div className={styles.presetRow}>
                          {COUNT_PRESETS[examType].map((p) => (
                            <button
                              key={p.count}
                              type="button"
                              className={`${styles.presetBtn} ${questionCount === p.count ? styles.presetBtnActive : ''}`}
                              onClick={() => setQuestionCount(p.count)}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="paper-qtype">Question Type Mix</label>
                        <select
                          id="paper-qtype"
                          className={styles.select}
                          value={questionType}
                          disabled={examType === 'NEET'}
                          onChange={(e) => setQuestionType(e.target.value as FacultyQuestionTypePref)}
                        >
                          {examType === 'NEET' ? (
                            <option value="mcq_single">Single-correct MCQ (100%)</option>
                          ) : (
                            <>
                              <option value="auto">Official Pattern Mix</option>
                              <option value="mcq_single">Single-correct Only</option>
                              <option value="integer">Integer Only</option>
                              {examType === 'Advanced' && <option value="mcq_multi">Multi-correct Only</option>}
                            </>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className={styles.field}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className={styles.label}>Topics ({selections.length} selected)</label>
                        {selections.length > 0 && (
                          <button
                            type="button"
                            className={styles.btn}
                            style={{ fontSize: 11, padding: '2px 8px' }}
                            onClick={() => setSelections([])}
                          >
                            Clear all
                          </button>
                        )}
                      </div>

                      <div className={styles.subjectTabs}>
                        {subjects.map((subj) => (
                          <button
                            key={subj}
                            type="button"
                            className={`${styles.tabBtn} ${activeSubject === subj ? styles.tabBtnActive : ''}`}
                            onClick={() => setActiveSubject(subj)}
                          >
                            {subj}
                          </button>
                        ))}
                      </div>

                      <input
                        className={styles.input}
                        style={{ marginBottom: 8 }}
                        placeholder={`Filter ${activeSubject} topics…`}
                        value={topicSearch}
                        onChange={(e) => setTopicSearch(e.target.value)}
                      />

                      <div className={styles.topicBox}>
                        {visibleTopics.map((topic) => {
                          const checked = selections.some((s) => s.subject === activeSubject && s.topic === topic);
                          return (
                            <label key={topic} className={styles.topicItem}>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  toggleSelection(activeSubject as FacultyPaperSelection['subject'], topic)
                                }
                              />
                              <span>{topic}</span>
                            </label>
                          );
                        })}
                        {visibleTopics.length === 0 && (
                          <p className={styles.sub} style={{ padding: 6 }}>No topics match.</p>
                        )}
                      </div>

                      {selections.length > 0 && (
                        <div className={styles.chipList}>
                          {selections.map((sel) => (
                            <span key={`${sel.subject}::${sel.topic}`} className={styles.chip}>
                              {sel.subject.slice(0, 4)}: {sel.topic}
                              <button
                                type="button"
                                className={styles.chipRemove}
                                aria-label={`Remove ${sel.topic}`}
                                onClick={() => toggleSelection(sel.subject, sel.topic)}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                  <button
                    type="submit"
                    className={styles.btnPrimary}
                    disabled={creating || selections.length === 0}
                  >
                    {creating ? 'Starting generation…' : `Generate ${questionCount}-Question Verified Paper`}
                  </button>
                </div>
              </form>
            )}

            <section className={styles.panel}>
              <div className={styles.panelTitle}>
                <span>Generated Papers Stack ({papers.length})</span>
              </div>

              {papers.length === 0 ? (
                <p className={styles.sub}>No papers generated yet. Configure topics above to create your first paper.</p>
              ) : (
                <div className={styles.paperStack}>
                  {papers.map((p) => {
                    const examLabel = p.examType === 'NEET' ? 'NEET-UG' : `JEE ${p.examType}`;
                    const dateStr = new Date(p.createdAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    return (
                      <div key={p.id} className={styles.paperStackCard}>
                        <div className={styles.paperCardLeft}>
                          <div className={styles.paperCardTop}>
                            <span className={styles.paperCodeBadge}>{p.paperCode}</span>
                            <span className={styles.paperStackTitle}>{p.title}</span>
                          </div>
                          <div className={styles.paperCardMeta}>
                            <span><strong>{examLabel}</strong></span>
                            <span>{p.questionCount} Qs</span>
                            <span>Difficulty: {p.difficulty}</span>
                            <span>
                              {p.status === 'ready'
                                ? `${p.verifiedCount}/${p.questionCount} Verified ✓`
                                : p.status === 'generating'
                                  ? 'Generating…'
                                  : 'Error'}
                            </span>
                            <span>{dateStr}</span>
                          </div>
                        </div>

                        <div className={styles.paperCardActions}>
                          <button
                            type="button"
                            className={styles.btnPrimary}
                            onClick={() => void handleOpenPaper(p.id)}
                          >
                            Open / Edit
                          </button>
                          {p.status === 'ready' && (
                            <>
                              <Link
                                href={`/faculty/papers/${p.id}/print?mode=questions&download=1`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.btnAccent}
                              >
                                PDF: Questions
                              </Link>
                              <Link
                                href={`/faculty/papers/${p.id}/print?mode=solutions&download=1`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.btnAccent}
                              >
                                PDF: Solutions
                              </Link>
                              <Link
                                href={`/faculty/papers/${p.id}/print?mode=key&download=1`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.btnAccent}
                              >
                                PDF: Key
                              </Link>
                            </>
                          )}
                          <button
                            type="button"
                            className={styles.btnDanger}
                            disabled={p.status === 'generating'}
                            onClick={() => void handleDeletePaper(p.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
