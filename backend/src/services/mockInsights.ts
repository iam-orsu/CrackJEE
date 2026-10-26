/*
 * Mock-exam analytics. Pure functions over per-question records, so they can be unit tested
 * without a database. The data loaders live in mockInsightsData.ts.
 */

export interface QuestionRecord {
  subject: string;
  topic: string;
  questionType: string;
  // Only answered questions count towards accuracy, speed and negatives; skipped ones are ignored
  answered: boolean;
  awarded: number;
  maxMarks: number;
  timeSeconds: number;
  at: Date;
}

export interface ExamTotal {
  at: Date;
  pct: number;
}

export interface TopicStat {
  subject: string;
  topic: string;
  attempts: number;
  correct: number;
  accuracy: number;
  marksLost: number;
  lastAt: string | null;
}

export const WEAK_BELOW_PERCENT = 60;
// One wrong answer is enough to flag a topic for revision; a topic is only called strong after two answers
export const STRONG_MIN_ATTEMPTS = 2;
export const LIST_LIMIT = 5;
export const PROJECTION_MOCKS = 5;

const round = (value: number): number => Math.round(value);
const clamp = (value: number, low: number, high: number): number => Math.min(high, Math.max(low, value));

/** Calendar month of an instant in India Standard Time, as YYYY-MM */
export function istMonthKey(date: Date): string {
  return new Date(date.getTime() + 330 * 60 * 1000).toISOString().slice(0, 7);
}

/** Accuracy, marks lost and last attempt for every topic that was answered */
export function topicStats(records: QuestionRecord[]): TopicStat[] {
  const byKey = new Map<string, TopicStat & { lastMs: number }>();
  for (const r of records) {
    if (!r.answered) continue;
    const key = `${r.subject}|${r.topic}`;
    if (!byKey.has(key)) {
      byKey.set(key, { subject: r.subject, topic: r.topic, attempts: 0, correct: 0, accuracy: 0, marksLost: 0, lastAt: null, lastMs: 0 });
    }
    const entry = byKey.get(key)!;
    entry.attempts++;
    if (r.awarded > 0) entry.correct++;
    entry.marksLost += r.maxMarks - r.awarded;
    if (r.at.getTime() > entry.lastMs) {
      entry.lastMs = r.at.getTime();
      entry.lastAt = r.at.toISOString();
    }
  }
  return [...byKey.values()].map(({ lastMs: _lastMs, ...stat }) => ({
    ...stat,
    accuracy: round((stat.correct / stat.attempts) * 100),
    marksLost: round(stat.marksLost),
  }));
}

/** Weak topics: below the target, most urgent first. Strong topics: at or above the target with enough answers. */
export function strongAndWeak(stats: TopicStat[]): { strong: TopicStat[]; weak: TopicStat[] } {
  const weak = stats
    .filter((s) => s.accuracy < WEAK_BELOW_PERCENT)
    .sort((a, b) => a.accuracy - b.accuracy || (b.lastAt ?? '').localeCompare(a.lastAt ?? ''))
    .slice(0, LIST_LIMIT);
  const strong = stats
    .filter((s) => s.accuracy >= WEAK_BELOW_PERCENT && s.attempts >= STRONG_MIN_ATTEMPTS)
    .sort((a, b) => b.accuracy - a.accuracy || b.attempts - a.attempts)
    .slice(0, LIST_LIMIT);
  return { strong, weak };
}

/** Topics that cost the most marks, including negative marks */
export function topMarksLost(stats: TopicStat[]): TopicStat[] {
  return stats
    .filter((s) => s.marksLost > 0)
    .sort((a, b) => b.marksLost - a.marksLost || a.accuracy - b.accuracy)
    .slice(0, LIST_LIMIT);
}

/** Average overall score for each calendar month, oldest first */
export function monthlyTrend(totals: ExamTotal[]): Array<{ month: string; avgPct: number; mocks: number }> {
  const byMonth = new Map<string, { sum: number; count: number }>();
  for (const t of totals) {
    const key = istMonthKey(t.at);
    const entry = byMonth.get(key) ?? { sum: 0, count: 0 };
    entry.sum += t.pct;
    entry.count++;
    byMonth.set(key, entry);
  }
  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, { sum, count }]) => ({ month, avgPct: round(sum / count), mocks: count }));
}

export type Projection =
  | { available: false; mocks: number }
  | { available: true; mocks: number; expected: number; low: number; high: number; trendPerMock: number };

/**
 * Likely next score from a straight-line fit through the most recent mocks, with a range of one
 * standard deviation of the fit around it. Needs at least two mocks.
 */
export function projection(totals: ExamTotal[]): Projection {
  const recent = [...totals].sort((a, b) => a.at.getTime() - b.at.getTime()).slice(-PROJECTION_MOCKS);
  const n = recent.length;
  if (n < 2) return { available: false, mocks: n };

  const xs = recent.map((_, i) => i);
  const ys = recent.map((t) => t.pct);
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i]! - meanX) * (ys[i]! - meanY);
    sxx += (xs[i]! - meanX) ** 2;
  }
  const slope = sxx === 0 ? 0 : sxy / sxx;
  const intercept = meanY - slope * meanX;
  const residualVariance = ys.reduce((acc, y, i) => acc + (y - (intercept + slope * xs[i]!)) ** 2, 0) / n;
  const spread = round(Math.sqrt(residualVariance));

  const expected = clamp(round(intercept + slope * n), 0, 100);
  return {
    available: true,
    mocks: n,
    expected,
    low: clamp(expected - spread, 0, 100),
    high: clamp(expected + spread, 0, 100),
    trendPerMock: Math.round(slope * 10) / 10,
  };
}

export interface NegativeAnalysis {
  answered: number;
  correct: number;
  wrong: number;
  negativeCount: number;
  negativeMarks: number;
  timeOnWrongSeconds: number;
  timeOnCorrectSeconds: number;
  shareOfTimeOnWrongPct: number;
}

/** Wrong answers, the marks taken away by negative marking, and how much time went into each kind of answer */
export function negativeAnalysis(records: QuestionRecord[]): NegativeAnalysis {
  let answered = 0, correct = 0, wrong = 0, negativeCount = 0, negativeMarks = 0;
  let timeOnWrong = 0, timeOnCorrect = 0;
  for (const r of records) {
    if (!r.answered) continue;
    answered++;
    if (r.awarded > 0) {
      correct++;
      timeOnCorrect += r.timeSeconds;
    } else {
      wrong++;
      timeOnWrong += r.timeSeconds;
    }
    if (r.awarded < 0) {
      negativeCount++;
      negativeMarks += r.awarded;
    }
  }
  const totalTime = timeOnWrong + timeOnCorrect;
  return {
    answered,
    correct,
    wrong,
    negativeCount,
    negativeMarks,
    timeOnWrongSeconds: timeOnWrong,
    timeOnCorrectSeconds: timeOnCorrect,
    shareOfTimeOnWrongPct: totalTime > 0 ? round((timeOnWrong / totalTime) * 100) : 0,
  };
}

/** Accuracy and average time for each question type */
export function timeByType(records: QuestionRecord[]): Array<{ questionType: string; answered: number; accuracy: number; avgSeconds: number }> {
  const byType = new Map<string, { answered: number; correct: number; time: number }>();
  for (const r of records) {
    if (!r.answered) continue;
    const entry = byType.get(r.questionType) ?? { answered: 0, correct: 0, time: 0 };
    entry.answered++;
    if (r.awarded > 0) entry.correct++;
    entry.time += r.timeSeconds;
    byType.set(r.questionType, entry);
  }
  return [...byType.entries()]
    .map(([questionType, e]) => ({
      questionType,
      answered: e.answered,
      accuracy: round((e.correct / e.answered) * 100),
      avgSeconds: round(e.time / e.answered),
    }))
    .sort((a, b) => b.answered - a.answered);
}

/**
 * Subjects ranked by correct answers per minute spent on them. The top one is the suggested section to start with.
 */
export function subjectOrder(records: QuestionRecord[]): Array<{ subject: string; attempts: number; accuracy: number; correctPerMinute: number }> {
  const bySubject = new Map<string, { attempts: number; correct: number; time: number }>();
  for (const r of records) {
    if (!r.answered) continue;
    const entry = bySubject.get(r.subject) ?? { attempts: 0, correct: 0, time: 0 };
    entry.attempts++;
    if (r.awarded > 0) entry.correct++;
    entry.time += r.timeSeconds;
    bySubject.set(r.subject, entry);
  }
  return [...bySubject.entries()]
    .map(([subject, e]) => ({
      subject,
      attempts: e.attempts,
      accuracy: round((e.correct / e.attempts) * 100),
      correctPerMinute: e.time > 0 ? Math.round((e.correct / (e.time / 60)) * 100) / 100 : 0,
    }))
    .sort((a, b) => b.correctPerMinute - a.correctPerMinute || b.accuracy - a.accuracy);
}

/** Share of all students this score is at or above (percentile) and its rank, 1 being the best */
export function platformStanding(mine: number, everyone: number[]): { percentile: number; rank: number; of: number } {
  const of = everyone.length;
  const above = everyone.filter((v) => v > mine).length;
  const below = everyone.filter((v) => v < mine).length;
  const equal = of - above - below;
  return {
    percentile: Math.round(((below + equal / 2) / of) * 100),
    rank: above + 1,
    of,
  };
}

// Threshold under which an answered question is likely a guess
const GUESS_SECONDS = 20;

export interface CarelessSummary {
  carelessCount: number;
  totalWrong: number;
  carelessPct: number;
  topTopics: Array<{ subject: string; topic: string; count: number }>;
}

/**
 * Careless mistakes: wrong answers where the student answered in less than half the average
 * time for that question type and also under 30 seconds — almost certainly didn't think it through.
 */
export function carelessAnalysis(records: QuestionRecord[]): CarelessSummary {
  const typeTime = new Map<string, { total: number; count: number }>();
  for (const r of records) {
    if (!r.answered || r.timeSeconds <= 0) continue;
    const e = typeTime.get(r.questionType) ?? { total: 0, count: 0 };
    e.total += r.timeSeconds;
    e.count++;
    typeTime.set(r.questionType, e);
  }
  const avgByType = new Map<string, number>();
  for (const [type, { total, count }] of typeTime) avgByType.set(type, total / count);

  const topicCount = new Map<string, { subject: string; topic: string; count: number }>();
  let carelessCount = 0;
  let totalWrong = 0;
  for (const r of records) {
    if (!r.answered) continue;
    if (r.awarded > 0) continue;
    totalWrong++;
    const avg = avgByType.get(r.questionType) ?? 0;
    if (avg > 0 && r.timeSeconds < avg * 0.5 && r.timeSeconds < 30) {
      carelessCount++;
      const key = `${r.subject}|${r.topic}`;
      const entry = topicCount.get(key) ?? { subject: r.subject, topic: r.topic, count: 0 };
      entry.count++;
      topicCount.set(key, entry);
    }
  }
  return {
    carelessCount,
    totalWrong,
    carelessPct: totalWrong > 0 ? round((carelessCount / totalWrong) * 100) : 0,
    topTopics: [...topicCount.values()].sort((a, b) => b.count - a.count).slice(0, LIST_LIMIT),
  };
}

export interface GuessingAnalysis {
  guessCount: number;
  totalAnswered: number;
  guessPct: number;
  wrongGuesses: number;
  rightGuesses: number;
}

/**
 * Guessing: any answered question where time < 20 s.
 * Right guesses are lucky; wrong ones are the dangerous kind that trigger negative marking.
 */
export function guessingAnalysis(records: QuestionRecord[]): GuessingAnalysis {
  let guessCount = 0, totalAnswered = 0, wrongGuesses = 0, rightGuesses = 0;
  for (const r of records) {
    if (!r.answered) continue;
    totalAnswered++;
    if (r.timeSeconds > 0 && r.timeSeconds <= GUESS_SECONDS) {
      guessCount++;
      if (r.awarded > 0) rightGuesses++; else wrongGuesses++;
    }
  }
  return {
    guessCount,
    totalAnswered,
    guessPct: totalAnswered > 0 ? round((guessCount / totalAnswered) * 100) : 0,
    wrongGuesses,
    rightGuesses,
  };
}

/**
 * Practice tomorrow: topics in the 40–75 % accuracy zone — not your worst (that is "revise today"),
 * but borderline. Fixing these gives the biggest marks-per-hour return because the student already
 * understands the concept but makes mistakes under exam conditions. Sorted by marks lost.
 */
export function practiceTomorrow(stats: TopicStat[]): TopicStat[] {
  return stats
    .filter((s) => s.accuracy >= 40 && s.accuracy < 75 && s.attempts >= 1)
    .sort((a, b) => b.marksLost - a.marksLost || a.accuracy - b.accuracy)
    .slice(0, LIST_LIMIT);
}

export interface CutoffResult {
  label: string;
  cutoffPct: number;
  scorePct: number;
  status: 'above' | 'below';
  // Positive: percentage points still needed to reach the cutoff. Negative: points above it.
  gapPct: number;
}

/** Where a score (as a percentage of the maximum) sits against each published cutoff line */
export function cutoffComparison(
  scorePct: number,
  lines: Array<{ label: string; marks: number; maxMarks: number }>,
): CutoffResult[] {
  return lines.map((line) => {
    const cutoffPct = Math.round((line.marks / line.maxMarks) * 1000) / 10;
    return {
      label: line.label,
      cutoffPct,
      scorePct,
      status: scorePct >= cutoffPct ? 'above' : 'below',
      gapPct: Math.round((cutoffPct - scorePct) * 10) / 10,
    };
  });
}
