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
      setSelections((prev) =>
        prev
          .filter((sel) => res.topics[sel.subject]?.includes(sel.topic))
          .map((sel) => ({
            ...sel,
            mcqCount: sel.mcqCount ?? (nextExam === 'NEET' ? 5 : nextExam === 'Advanced' ? 3 : 5),
            integerCount: nextExam === 'NEET' ? 0 : (sel.integerCount ?? 1),
            multiCount: nextExam === 'Advanced' ? (sel.multiCount ?? 2) : 0,
          })),
      );
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
      if (exists) {
        return prev.filter((s) => !(s.subject === subject && s.topic === topic));
      }
      const defaultMcq = examType === 'NEET' ? 5 : examType === 'Advanced' ? 3 : 5;
      const defaultInt = examType === 'NEET' ? 0 : 1;
      const defaultMulti = examType === 'Advanced' ? 2 : 0;
      return [
        ...prev,
        {
          subject,
          topic,
          mcqCount: defaultMcq,
          integerCount: defaultInt,
          multiCount: defaultMulti,
        },
      ];
    });
  }

  const totalCalculatedCount = useMemo(() => {
    if (selections.length === 0) return 0;
    return selections.reduce(
      (acc, s) => acc + (s.mcqCount ?? 0) + (s.integerCount ?? 0) + (s.multiCount ?? 0),
      0,
    );
  }, [selections]);

  function handleCountChange(
    subject: FacultyPaperSelection['subject'],
    topic: string,
    field: 'mcqCount' | 'integerCount' | 'multiCount',
    val: number,
  ) {
    const clamped = Math.max(0, Math.min(100, isNaN(val) ? 0 : val));
    setSelections((prev) =>
      prev.map((s) => (s.subject === subject && s.topic === topic ? { ...s, [field]: clamped } : s)),
    );
  }

  function handleCountStep(
    subject: FacultyPaperSelection['subject'],
    topic: string,
    field: 'mcqCount' | 'integerCount' | 'multiCount',
    delta: number,
  ) {
    setSelections((prev) =>
      prev.map((s) => {
        if (s.subject !== subject || s.topic !== topic) return s;
        const current = s[field] ?? 0;
        const next = Math.max(0, Math.min(100, current + delta));
        return { ...s, [field]: next };
      }),
    );
  }

  function applyPresetToAll(mcq: number, intCount: number, multi = 0) {
    setSelections((prev) =>
      prev.map((s) => ({
        ...s,
        mcqCount: mcq,
        integerCount: examType === 'NEET' ? 0 : intCount,
        multiCount: examType === 'Advanced' ? multi : 0,
      })),
    );
  }

  function applyPresetAcrossTopics(total: number) {
    setQuestionCount(total);
    if (selections.length === 0) return;
    const n = selections.length;
    const perTopic = Math.max(1, Math.floor(total / n));
    setSelections((prev) =>
      prev.map((s, idx) => {
        const topicTotal = perTopic + (idx < total % n ? 1 : 0);
        if (examType === 'NEET') {
          return { ...s, mcqCount: topicTotal, integerCount: 0, multiCount: 0 };
        } else if (examType === 'Advanced') {
          const multi = Math.floor(topicTotal * 0.3);
          const integer = Math.floor(topicTotal * 0.3);
          const mcq = topicTotal - multi - integer;
          return { ...s, mcqCount: mcq, multiCount: multi, integerCount: integer };
        } else {
          const integer = Math.max(1, Math.round(topicTotal * 0.2));
          const mcq = Math.max(0, topicTotal - integer);
          return { ...s, mcqCount: mcq, integerCount: integer, multiCount: 0 };
        }
      }),
    );
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
    const finalCount = totalCalculatedCount > 0 ? totalCalculatedCount : questionCount;
    if (finalCount === 0) {
      setError('Please configure at least 1 question across your selected topics.');
      return;
    }
    if (finalCount > 180) {
      setError('Total paper question count cannot exceed 180 questions.');
      return;
    }

    setCreating(true);
    setError('');
    try {
      const res = await facultyCreatePaper({
        title: title.trim() || undefined,
        examType,
        difficulty: examType === 'Advanced' ? 'advanced' : difficulty,
        questionCount: finalCount,
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
                        <label className={styles.label} htmlFor="paper-count">
                          Question Count {totalCalculatedCount > 0 ? `(${totalCalculatedCount} total from topics)` : '(1–180)'}
                        </label>
                        <input
                          id="paper-count"
                          type="number"
                          min={1}
                          max={180}
                          className={styles.input}
                          value={totalCalculatedCount > 0 ? totalCalculatedCount : questionCount}
                          onChange={(e) => {
                            const val = Math.max(1, Math.min(180, Number(e.target.value) || 1));
                            applyPresetAcrossTopics(val);
                          }}
                          required
                        />
                        <div className={styles.presetRow}>
                          {COUNT_PRESETS[examType].map((p) => (
                            <button
                              key={p.count}
                              type="button"
                              className={`${styles.presetBtn} ${(totalCalculatedCount > 0 ? totalCalculatedCount : questionCount) === p.count ? styles.presetBtnActive : ''}`}
                              onClick={() => applyPresetAcrossTopics(p.count)}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="paper-qtype">Quick Batch Mix</label>
                        <select
                          id="paper-qtype"
                          className={styles.select}
                          value={questionType}
                          disabled={examType === 'NEET'}
                          onChange={(e) => {
                            const next = e.target.value as FacultyQuestionTypePref;
                            setQuestionType(next);
                            if (next === 'mcq_single') {
                              applyPresetToAll(5, 0, 0);
                            } else if (next === 'integer') {
                              applyPresetToAll(0, 5, 0);
                            } else if (next === 'mcq_multi') {
                              applyPresetToAll(0, 0, 5);
                            } else {
                              applyPresetToAll(examType === 'Advanced' ? 3 : 5, 1, examType === 'Advanced' ? 2 : 0);
                            }
                          }}
                        >
                          {examType === 'NEET' ? (
                            <option value="mcq_single">Single-correct MCQ (100%)</option>
                          ) : (
                            <>
                              <option value="auto">Official Pattern Mix (5 MCQ + 1 Int)</option>
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

                {selections.length > 0 && (
                  <div className={styles.topicBreakdownWrap}>
                    <div className={styles.topicBreakdownHeader}>
                      <div className={styles.topicBreakdownTitle}>
                        <span>Selected Topics &amp; Question Mix</span>
                        <span className={styles.topicBreakdownBadge}>
                          {totalCalculatedCount} Questions Configured
                        </span>
                      </div>

                      <div className={styles.batchPresetsRow}>
                        <span className={styles.batchPresetLabel}>Set all to:</span>
                        {examType === 'NEET' ? (
                          <>
                            <button
                              type="button"
                              className={styles.presetBtn}
                              onClick={() => applyPresetToAll(5, 0)}
                            >
                              5 MCQs
                            </button>
                            <button
                              type="button"
                              className={styles.presetBtn}
                              onClick={() => applyPresetToAll(10, 0)}
                            >
                              10 MCQs
                            </button>
                          </>
                        ) : examType === 'Advanced' ? (
                          <>
                            <button
                              type="button"
                              className={styles.presetBtn}
                              onClick={() => applyPresetToAll(3, 1, 2)}
                            >
                              Std (3 Single + 2 Multi + 1 Int)
                            </button>
                            <button
                              type="button"
                              className={styles.presetBtn}
                              onClick={() => applyPresetToAll(5, 0, 0)}
                            >
                              MCQ Only (5)
                            </button>
                            <button
                              type="button"
                              className={styles.presetBtn}
                              onClick={() => applyPresetToAll(0, 5, 0)}
                            >
                              Integer Only (5)
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className={styles.presetBtn}
                              onClick={() => applyPresetToAll(5, 1)}
                            >
                              Std (5 Single + 1 Int)
                            </button>
                            <button
                              type="button"
                              className={styles.presetBtn}
                              onClick={() => applyPresetToAll(10, 2)}
                            >
                              12 Qs (10 Single + 2 Int)
                            </button>
                            <button
                              type="button"
                              className={styles.presetBtn}
                              onClick={() => applyPresetToAll(5, 0)}
                            >
                              Single-Option Only (5)
                            </button>
                            <button
                              type="button"
                              className={styles.presetBtn}
                              onClick={() => applyPresetToAll(0, 5)}
                            >
                              Integer Only (5)
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className={styles.topicGrid}>
                      {selections.map((sel) => {
                        const mcq = sel.mcqCount ?? 0;
                        const integer = sel.integerCount ?? 0;
                        const multi = sel.multiCount ?? 0;
                        const topicTotal = mcq + integer + multi;

                        return (
                          <div key={`${sel.subject}::${sel.topic}`} className={styles.topicConfigCard}>
                            <div className={styles.topicCardTop}>
                              <div className={styles.topicCardMeta}>
                                <span className={styles.topicSubjectTag}>{sel.subject}</span>
                                <span className={styles.topicCardName}>{sel.topic}</span>
                              </div>
                              <div className={styles.topicCardActions}>
                                <span className={styles.topicCardTotalBadge}>{topicTotal} Qs</span>
                                <button
                                  type="button"
                                  className={styles.topicRemoveBtn}
                                  title={`Remove ${sel.topic}`}
                                  onClick={() => toggleSelection(sel.subject, sel.topic)}
                                >
                                  ×
                                </button>
                              </div>
                            </div>

                            <div className={styles.typeCountersList}>
                              {/* Single Option MCQ */}
                              <div className={styles.counterRow}>
                                <div className={styles.counterLabel}>
                                  <span className={`${styles.typeDot} ${styles.typeDotMcq}`} />
                                  <span>Single Option (MCQ)</span>
                                </div>
                                <div className={styles.stepperControl}>
                                  <button
                                    type="button"
                                    className={styles.stepperBtn}
                                    disabled={mcq <= 0}
                                    onClick={() => handleCountStep(sel.subject, sel.topic, 'mcqCount', -1)}
                                  >
                                    −
                                  </button>
                                  <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    className={styles.stepperInput}
                                    value={mcq}
                                    onChange={(e) =>
                                      handleCountChange(sel.subject, sel.topic, 'mcqCount', parseInt(e.target.value, 10))
                                    }
                                  />
                                  <button
                                    type="button"
                                    className={styles.stepperBtn}
                                    onClick={() => handleCountStep(sel.subject, sel.topic, 'mcqCount', 1)}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* Multi-correct MCQ (JEE Advanced only) */}
                              {examType === 'Advanced' && (
                                <div className={styles.counterRow}>
                                  <div className={styles.counterLabel}>
                                    <span className={`${styles.typeDot} ${styles.typeDotMulti}`} />
                                    <span>Multi-Correct MCQ</span>
                                  </div>
                                  <div className={styles.stepperControl}>
                                    <button
                                      type="button"
                                      className={styles.stepperBtn}
                                      disabled={multi <= 0}
                                      onClick={() => handleCountStep(sel.subject, sel.topic, 'multiCount', -1)}
                                    >
                                      −
                                    </button>
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      className={styles.stepperInput}
                                      value={multi}
                                      onChange={(e) =>
                                        handleCountChange(sel.subject, sel.topic, 'multiCount', parseInt(e.target.value, 10))
                                      }
                                    />
                                    <button
                                      type="button"
                                      className={styles.stepperBtn}
                                      onClick={() => handleCountStep(sel.subject, sel.topic, 'multiCount', 1)}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Integer / Numerical (JEE Main & Advanced only) */}
                              {examType !== 'NEET' && (
                                <div className={styles.counterRow}>
                                  <div className={styles.counterLabel}>
                                    <span className={`${styles.typeDot} ${styles.typeDotInt}`} />
                                    <span>Integer / Numerical</span>
                                  </div>
                                  <div className={styles.stepperControl}>
                                    <button
                                      type="button"
                                      className={styles.stepperBtn}
                                      disabled={integer <= 0}
                                      onClick={() => handleCountStep(sel.subject, sel.topic, 'integerCount', -1)}
                                    >
                                      −
                                    </button>
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      className={styles.stepperInput}
                                      value={integer}
                                      onChange={(e) =>
                                        handleCountChange(sel.subject, sel.topic, 'integerCount', parseInt(e.target.value, 10))
                                      }
                                    />
                                    <button
                                      type="button"
                                      className={styles.stepperBtn}
                                      onClick={() => handleCountStep(sel.subject, sel.topic, 'integerCount', 1)}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
                  <button
                    type="submit"
                    className={styles.btnPrimary}
                    disabled={creating || selections.length === 0 || (selections.length > 0 && totalCalculatedCount === 0)}
                  >
                    {creating
                      ? 'Starting generation…'
                      : `Generate ${totalCalculatedCount > 0 ? totalCalculatedCount : questionCount}-Question Verified Paper`}
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
                                ? 'Ready'
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
