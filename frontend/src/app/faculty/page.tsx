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
  type FacultyExamType,
  type FacultyPaper,
  type FacultyPaperSelection,
  type FacultyPaperSummary,
  type FacultyQuestionTypePref,
  type FacultyUser,
} from '@/lib/faculty';
import { FacultyPaperPreview } from '@/components/faculty/FacultyPaperPreview';
import { FacultyBatchesTab } from '@/components/faculty/FacultyBatchesTab';
import { FacultyAssignmentsTab } from '@/components/faculty/FacultyAssignmentsTab';
import { FacultyReportsTab } from '@/components/faculty/FacultyReportsTab';
import type { Subject } from '@/types';
import { TopicBreakdownConfig } from '@/components/practice/TopicBreakdownConfig';
import type { TopicCustomConfig } from '@/components/practice/shared';
import {
  getTopicTotal,
  createBalancedDifficulty,
  getDefaultQuestionTypes,
  planTopicTypeSlots,
  MAX_TOPIC_QUESTIONS,
} from '@/components/practice/shared';
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
  const [activeTab, setActiveTab] = useState<'papers' | 'batches' | 'assignments' | 'reports'>('papers');
  const [selectedReportAssignmentId, setSelectedReportAssignmentId] = useState<string | null>(null);

  // Builder state (JEE Main defaults to 75 per NTA 2025-2026 pattern)
  const [builderOpen, setBuilderOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [examType, setExamType] = useState<FacultyExamType>('Main');
  const [questionCount, setQuestionCount] = useState(75);
  const [questionCountStr, setQuestionCountStr] = useState('75');
  const [questionType, setQuestionType] = useState<FacultyQuestionTypePref>('auto');
  const [topicConfigs, setTopicConfigs] = useState<Record<string, TopicCustomConfig>>({});

  const selectedSubjects = useMemo(() => {
    const set = new Set<Subject>();
    for (const cfg of Object.values(topicConfigs)) {
      set.add(cfg.subject);
    }
    return set;
  }, [topicConfigs]);

  const selectedTopics = useMemo(() => {
    const map: Partial<Record<Subject, Set<string>>> = {};
    for (const cfg of Object.values(topicConfigs)) {
      if (!map[cfg.subject]) map[cfg.subject] = new Set();
      map[cfg.subject]!.add(cfg.topic);
    }
    return map;
  }, [topicConfigs]);

  const selectedTopicsCount = useMemo(() => {
    return Object.keys(topicConfigs).length;
  }, [topicConfigs]);

  const activeSubjectCount = selectedSubjects.size || 1;
  const perSubjectTarget = Math.max(1, Math.round(questionCount / activeSubjectCount));

  const totalCalculatedCount = useMemo(() => {
    return Object.values(topicConfigs).reduce((sum, cfg) => sum + getTopicTotal(cfg), 0);
  }, [topicConfigs]);

  const [subjects, setSubjects] = useState<string[]>(['Physics', 'Chemistry', 'Mathematics']);
  const [topicsBySubject, setTopicsBySubject] = useState<Record<string, string[]>>({});
  const [activeSubject, setActiveSubject] = useState('Physics');
  const [topicSearch, setTopicSearch] = useState('');

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
    const defaultCnt = DEFAULT_COUNT[nextExam];
    setQuestionCount(defaultCnt);
    setQuestionCountStr(String(defaultCnt));
    if (nextExam === 'Advanced') {
      setQuestionType('auto');
    } else if (nextExam === 'NEET') {
      setQuestionType('mcq_single');
    } else {
      setQuestionType('auto');
    }

    try {
      const res = await facultyGetTopics(nextExam);
      setSubjects(res.subjects);
      setTopicsBySubject(res.topics);
      setActiveSubject(res.subjects[0] ?? 'Physics');
      setTopicConfigs((prev) => {
        const next: Record<string, TopicCustomConfig> = {};
        for (const [key, cfg] of Object.entries(prev)) {
          if (res.topics[cfg.subject]?.includes(cfg.topic)) {
            next[key] = cfg;
          }
        }
        return next;
      });
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

  function toggleSelection(subject: Subject, topic: string) {
    const key = `${subject}::${topic}`;
    setTopicConfigs((prev) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        const isAdv = examType === 'Advanced';
        const isNeet = examType === 'NEET';
        const nextSubjCount = (selectedTopics[subject]?.size || 0) + 1;
        const targetForThisTopic = Math.min(
          MAX_TOPIC_QUESTIONS,
          Math.max(1, Math.round(perSubjectTarget / nextSubjCount)),
        );

        const defTypes = getDefaultQuestionTypes(targetForThisTopic, isAdv ? 'Advanced' : 'Main', isNeet);
        const typeSlots = planTopicTypeSlots(targetForThisTopic, defTypes, isAdv, isNeet);

        const mcqCount = typeSlots.filter((t) => t === 'mcq_single').length;
        const integerCount = typeSlots.filter((t) => t === 'integer').length;
        const multiCount = typeSlots.filter((t) => t === 'mcq_multi').length;
        const matrixCount = typeSlots.filter((t) => t === 'matrix_match').length;

        next[key] = {
          subject,
          topic,
          mcq: createBalancedDifficulty(mcqCount),
          integer: createBalancedDifficulty(integerCount),
          multi: createBalancedDifficulty(multiCount),
          matrix: createBalancedDifficulty(matrixCount),
        };
      }
      return next;
    });
  }

  const autoDistributeTopicsForSubject = useCallback(
    (subj: Subject) => {
      const topics = Array.from(selectedTopics[subj] ?? new Set<string>());
      if (topics.length === 0) return;

      const perSubject = perSubjectTarget;
      const isAdv = examType === 'Advanced';
      const isNeet = examType === 'NEET';

      const k = topics.length;
      const baseQuota = Math.floor(perSubject / k);
      const remainder = perSubject % k;

      setTopicConfigs((prev) => {
        const next = { ...prev };
        topics.forEach((topic, idx) => {
          const topicCount = Math.min(MAX_TOPIC_QUESTIONS, baseQuota + (idx < remainder ? 1 : 0));
          const defTypes = getDefaultQuestionTypes(topicCount, isAdv ? 'Advanced' : 'Main', isNeet);
          const typeSlots = planTopicTypeSlots(topicCount, defTypes, isAdv, isNeet);

          const mcqCount = typeSlots.filter((t) => t === 'mcq_single').length;
          const integerCount = typeSlots.filter((t) => t === 'integer').length;
          const multiCount = typeSlots.filter((t) => t === 'mcq_multi').length;
          const matrixCount = typeSlots.filter((t) => t === 'matrix_match').length;

          const key = `${subj}::${topic}`;
          next[key] = {
            subject: subj,
            topic,
            mcq: createBalancedDifficulty(mcqCount),
            integer: createBalancedDifficulty(integerCount),
            multi: createBalancedDifficulty(multiCount),
            matrix: createBalancedDifficulty(matrixCount),
          };
        });
        return next;
      });
    },
    [selectedTopics, perSubjectTarget, examType],
  );

  const autoDistributeAllTopics = useCallback(() => {
    const perSubject = perSubjectTarget;
    const isAdv = examType === 'Advanced';
    const isNeet = examType === 'NEET';

    setTopicConfigs((prev) => {
      const next = { ...prev };
      for (const subj of selectedSubjects) {
        const topics = Array.from(selectedTopics[subj] ?? new Set<string>());
        if (topics.length === 0) continue;
        const k = topics.length;
        const baseQuota = Math.floor(perSubject / k);
        const remainder = perSubject % k;

        topics.forEach((topic, idx) => {
          const topicCount = Math.min(MAX_TOPIC_QUESTIONS, baseQuota + (idx < remainder ? 1 : 0));
          const defTypes = getDefaultQuestionTypes(topicCount, isAdv ? 'Advanced' : 'Main', isNeet);
          const typeSlots = planTopicTypeSlots(topicCount, defTypes, isAdv, isNeet);

          const mcqCount = typeSlots.filter((t) => t === 'mcq_single').length;
          const integerCount = typeSlots.filter((t) => t === 'integer').length;
          const multiCount = typeSlots.filter((t) => t === 'mcq_multi').length;
          const matrixCount = typeSlots.filter((t) => t === 'matrix_match').length;

          const key = `${subj}::${topic}`;
          next[key] = {
            subject: subj,
            topic,
            mcq: createBalancedDifficulty(mcqCount),
            integer: createBalancedDifficulty(integerCount),
            multi: createBalancedDifficulty(multiCount),
            matrix: createBalancedDifficulty(matrixCount),
          };
        });
      }
      return next;
    });
  }, [perSubjectTarget, examType, selectedSubjects, selectedTopics]);

  function applyPresetAcrossTopics(total: number) {
    setQuestionCount(total);
    setQuestionCountStr(String(total));
    const entries = Object.entries(topicConfigs);
    if (entries.length === 0) return;

    const isAdv = examType === 'Advanced';
    const isNeet = examType === 'NEET';
    const n = entries.length;
    const baseQuota = Math.floor(total / n);
    const remainder = total % n;

    setTopicConfigs((prev) => {
      const next = { ...prev };
      entries.forEach(([key, cfg], idx) => {
        const topicTotal = Math.min(MAX_TOPIC_QUESTIONS, baseQuota + (idx < remainder ? 1 : 0));
        const defTypes = getDefaultQuestionTypes(topicTotal, isAdv ? 'Advanced' : 'Main', isNeet);
        const typeSlots = planTopicTypeSlots(topicTotal, defTypes, isAdv, isNeet);

        const mcqCount = typeSlots.filter((t) => t === 'mcq_single').length;
        const integerCount = typeSlots.filter((t) => t === 'integer').length;
        const multiCount = typeSlots.filter((t) => t === 'mcq_multi').length;
        const matrixCount = typeSlots.filter((t) => t === 'matrix_match').length;

        next[key] = {
          ...cfg,
          mcq: createBalancedDifficulty(mcqCount),
          integer: createBalancedDifficulty(integerCount),
          multi: createBalancedDifficulty(multiCount),
          matrix: createBalancedDifficulty(matrixCount),
        };
      });
      return next;
    });
  }

  function applyPresetToAll(mcq: number, intCount: number, multi = 0, matrix = 0) {
    setTopicConfigs((prev) => {
      const next = { ...prev };
      for (const [key, cfg] of Object.entries(next)) {
        next[key] = {
          ...cfg,
          mcq: createBalancedDifficulty(mcq),
          integer: createBalancedDifficulty(examType === 'NEET' ? 0 : intCount),
          multi: createBalancedDifficulty(examType === 'Advanced' ? multi : 0),
          matrix: createBalancedDifficulty(matrix),
        };
      }
      return next;
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
    const parsedCount = parseInt(questionCountStr, 10);
    const activeCount = !isNaN(parsedCount) && parsedCount >= 1 && parsedCount <= 180 ? parsedCount : questionCount;
    if (activeCount !== questionCount) {
      setQuestionCount(activeCount);
    }

    const selections: FacultyPaperSelection[] = [];
    for (const cfg of Object.values(topicConfigs)) {
      const total = getTopicTotal(cfg);
      if (total <= 0) continue;

      const mcqEasy = cfg.mcq?.easy || 0;
      const mcqMed = cfg.mcq?.medium || 0;
      const mcqHard = cfg.mcq?.hard || 0;
      const mcqCount = mcqEasy + mcqMed + mcqHard;

      const integerEasy = cfg.integer?.easy || 0;
      const integerMed = cfg.integer?.medium || 0;
      const integerHard = cfg.integer?.hard || 0;
      const integerCount = integerEasy + integerMed + integerHard;

      const multiEasy = cfg.multi?.easy || 0;
      const multiMed = cfg.multi?.medium || 0;
      const multiHard = cfg.multi?.hard || 0;
      const multiCount = multiEasy + multiMed + multiHard;

      const matrixEasy = cfg.matrix?.easy || 0;
      const matrixMed = cfg.matrix?.medium || 0;
      const matrixHard = cfg.matrix?.hard || 0;
      const matrixCount = matrixEasy + matrixMed + matrixHard;

      selections.push({
        subject: cfg.subject,
        topic: cfg.topic,
        mcqCount,
        integerCount,
        multiCount,
        matrixCount,
        mcqEasy,
        mcqMedium: mcqMed,
        mcqHard,
        integerEasy,
        integerMedium: integerMed,
        integerHard,
        multiEasy,
        multiMedium: multiMed,
        multiHard,
        matrixEasy,
        matrixMedium: matrixMed,
        matrixHard,
      });
    }

    if (selections.length === 0) {
      setError('Select at least one subject & topic before generating.');
      return;
    }
    if (totalCalculatedCount === 0) {
      setError('Please configure at least 1 question across your selected topics.');
      return;
    }
    if (totalCalculatedCount > 180) {
      setError('Total paper question count cannot exceed 180 questions.');
      return;
    }
    if (totalCalculatedCount !== questionCount) {
      setError(
        totalCalculatedCount > questionCount
          ? `Total questions configured in topics (${totalCalculatedCount}) exceeds Question Count (${questionCount}). Please reduce ${totalCalculatedCount - questionCount} question(s) from topics or click "Auto-match".`
          : `Total questions configured in topics (${totalCalculatedCount}) does not match target Question Count (${questionCount}). Please add ${questionCount - totalCalculatedCount} more question(s) or click "Auto-match".`
      );
      return;
    }

    setCreating(true);
    setError('');
    try {
      const res = await facultyCreatePaper({
        title: title.trim() || undefined,
        organization: organization.trim() || undefined,
        examType,
        difficulty: examType === 'Advanced' ? 'advanced' : 'mixed',
        questionCount,
        questionType: 'auto',
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
            <h1 className={styles.title}>Faculty Portal</h1>
            <p className={styles.sub}>Signed in as {faculty.name} ({faculty.email}) · {papers.length} paper(s) in studio</p>
          </div>
          <div className={styles.headerActions}>
            {!activePaper && activeTab === 'papers' && (
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

        {!activePaper && (
          <nav className={styles.portalNav}>
            <button
              type="button"
              className={`${styles.portalNavBtn} ${activeTab === 'papers' ? styles.portalNavBtnActive : ''}`}
              onClick={() => setActiveTab('papers')}
            >
              📝 Paper Studio
            </button>
            <button
              type="button"
              className={`${styles.portalNavBtn} ${activeTab === 'batches' ? styles.portalNavBtnActive : ''}`}
              onClick={() => setActiveTab('batches')}
            >
              👥 Batches &amp; Students
            </button>
            <button
              type="button"
              className={`${styles.portalNavBtn} ${activeTab === 'assignments' ? styles.portalNavBtnActive : ''}`}
              onClick={() => setActiveTab('assignments')}
            >
              📤 Assign Exams
            </button>
            <button
              type="button"
              className={`${styles.portalNavBtn} ${activeTab === 'reports' ? styles.portalNavBtnActive : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              📊 Batch Reports
            </button>
          </nav>
        )}

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
        ) : activeTab === 'batches' ? (
          <FacultyBatchesTab />
        ) : activeTab === 'assignments' ? (
          <FacultyAssignmentsTab
            onViewReport={(id) => {
              setSelectedReportAssignmentId(id);
              setActiveTab('reports');
            }}
          />
        ) : activeTab === 'reports' ? (
          <FacultyReportsTab initialAssignmentId={selectedReportAssignmentId} />
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

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="paper-org">
                        College / Organization Name <span style={{ fontWeight: 400, color: 'var(--muted, #64748b)' }}>(optional)</span>
                      </label>
                      <input
                        id="paper-org"
                        className={styles.input}
                        placeholder="Enter college or organization name"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
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
                        <label className={styles.label}>Cognitive Rigor &amp; Question Difficulty</label>
                        <div
                          style={{
                            background: 'var(--surface-2, #f8fafc)',
                            border: '1px solid var(--border, #e2e8f0)',
                            borderRadius: 8,
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            fontSize: 12,
                            color: 'var(--ink-2, #334155)',
                          }}
                        >
                          <span style={{ fontSize: 18 }}>🎯</span>
                          <div>
                            <strong>Granular Topic Breakdown:</strong> Configure exact quantities of <strong>Easy</strong>, <strong>Medium</strong>, and <strong>Hard</strong> questions per topic &amp; question type below using direct integer counters.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.row2}>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="paper-count">
                          Question Count (1–180)
                        </label>
                        <input
                          id="paper-count"
                          type="number"
                          min={1}
                          max={180}
                          className={styles.input}
                          placeholder="e.g. 75"
                          value={questionCountStr}
                          onChange={(e) => {
                            const raw = e.target.value;
                            setQuestionCountStr(raw);
                            if (raw.trim() === '') return;
                            const parsed = parseInt(raw, 10);
                            if (!isNaN(parsed) && parsed >= 1 && parsed <= 180) {
                              setQuestionCount(parsed);
                            }
                          }}
                          onBlur={() => {
                            const parsed = parseInt(questionCountStr, 10);
                            if (questionCountStr.trim() === '' || isNaN(parsed) || parsed < 1) {
                              const fallback = questionCount >= 1 ? questionCount : (DEFAULT_COUNT[examType] || 75);
                              setQuestionCount(fallback);
                              setQuestionCountStr(String(fallback));
                            } else if (parsed > 180) {
                              setQuestionCount(180);
                              setQuestionCountStr('180');
                            } else {
                              setQuestionCount(parsed);
                              setQuestionCountStr(String(parsed));
                            }
                          }}
                          required
                        />
                        <div className={styles.presetRow}>
                          {COUNT_PRESETS[examType].map((p) => (
                            <button
                              key={p.count}
                              type="button"
                              className={`${styles.presetBtn} ${questionCount === p.count ? styles.presetBtnActive : ''}`}
                              onClick={() => {
                                setQuestionCount(p.count);
                                setQuestionCountStr(String(p.count));
                                applyPresetAcrossTopics(p.count);
                              }}
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
                          onChange={(e) => {
                            const next = e.target.value as FacultyQuestionTypePref;
                            setQuestionType(next);
                            if (next === 'mcq_single') {
                              applyPresetToAll(5, 0, 0, 0);
                            } else if (next === 'integer') {
                              applyPresetToAll(0, 5, 0, 0);
                            } else if (next === 'mcq_multi') {
                              applyPresetToAll(0, 0, 5, 0);
                            } else if (next === 'matrix_match') {
                              applyPresetToAll(0, 0, 0, 5);
                            } else {
                              applyPresetToAll(examType === 'Advanced' ? 3 : 5, 1, examType === 'Advanced' ? 2 : 0, 0);
                            }
                          }}
                        >
                          {examType === 'NEET' ? (
                            <>
                              <option value="auto">NEET Standard Mix (MCQ + Match List)</option>
                              <option value="mcq_single">Single-correct MCQ Only</option>
                              <option value="matrix_match">Matrix Match (Match the List) Only</option>
                            </>
                          ) : (
                            <>
                              <option value="auto">Official Pattern Mix (5 MCQ + 1 Int)</option>
                              <option value="mcq_single">Single-correct Only</option>
                              <option value="integer">Integer Only</option>
                              {examType === 'Advanced' && <option value="mcq_multi">Multi-correct Only</option>}
                              <option value="matrix_match">Matrix Match (Match the List) Only</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className={styles.field}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className={styles.label}>Topics ({selectedTopicsCount} selected)</label>
                        {selectedTopicsCount > 0 && (
                          <button
                            type="button"
                            className={styles.btn}
                            style={{ fontSize: 11, padding: '2px 8px' }}
                            onClick={() => setTopicConfigs({})}
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
                          const checked = Boolean(topicConfigs[`${activeSubject}::${topic}`]);
                          return (
                            <label key={topic} className={styles.topicItem}>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  toggleSelection(activeSubject as Subject, topic)
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

                      {selectedTopicsCount > 0 && (
                        <div className={styles.chipList}>
                          {Object.values(topicConfigs).map((cfg) => (
                            <span key={`${cfg.subject}::${cfg.topic}`} className={styles.chip}>
                              {cfg.subject.slice(0, 4)}: {cfg.topic} ({getTopicTotal(cfg)} Qs)
                              <button
                                type="button"
                                className={styles.chipRemove}
                                aria-label={`Remove ${cfg.topic}`}
                                onClick={() => toggleSelection(cfg.subject, cfg.topic)}
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

                {selectedTopicsCount > 0 && (
                  <div style={{ marginTop: 20 }}>
                    <TopicBreakdownConfig
                      selectedSubjects={selectedSubjects}
                      selectedTopics={selectedTopics}
                      perSubjectCount={perSubjectTarget}
                      isNeet={examType === 'NEET'}
                      isAdvanced={examType === 'Advanced'}
                      topicConfigs={topicConfigs}
                      onTopicConfigs={setTopicConfigs}
                      onAutoDistributeSubject={autoDistributeTopicsForSubject}
                      onAutoDistributeAll={autoDistributeAllTopics}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                  <button
                    type="submit"
                    className={styles.btnPrimary}
                    disabled={
                      creating ||
                      selectedTopicsCount === 0 ||
                      totalCalculatedCount !== questionCount
                    }
                  >
                    {creating
                      ? 'Starting generation…'
                      : selectedTopicsCount === 0
                      ? 'Select at least 1 topic above'
                      : totalCalculatedCount > questionCount
                      ? `Overflow: Reduce ${totalCalculatedCount - questionCount} Q(s) in Topics`
                      : totalCalculatedCount < questionCount
                      ? `Add ${questionCount - totalCalculatedCount} more Q(s) to match ${questionCount}`
                      : `Generate ${questionCount}-Question Verified Paper`}
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
                            {p.organization && (
                              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand, #0f2b48)', background: 'var(--surface-2, #f1f5f9)', padding: '1px 6px', borderRadius: 4 }}>
                                🏛️ {p.organization}
                              </span>
                            )}
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
