import { createHash } from 'crypto';
import { prisma } from '../lib/prisma';
import { cacheGetJson, cacheSetJson, cacheAppendUnique } from './cacheService';
import type { Subject, Difficulty, ExamType } from '../types/index';
import type { Question } from '@prisma/client';

const SERVED_TTL = 86400 * 7;
const POOL_TTL = 600;
export const PAPER_PAGE_SIZE = 10;
// Each student can page through this many distinct papers for one selection
export const PAPER_SPACE_CAP = 10000;

export interface PaperSelection {
  subject: Subject;
  topic: string;
}

export interface PaperOptions {
  selections: PaperSelection[];
  difficulty: Difficulty | 'mixed';
  examType: ExamType;
  perSubject: number;
}

interface PoolRow {
  id: string;
  subject: string;
  topic: string;
}

// Same key format getPracticeQuestion uses, so served questions stay excluded everywhere
function servedKey(userId: string, subject: string, topic: string): string {
  return `served:${userId}:${subject}:${topic}:practice`;
}

/** C(n, k) as an exact integer, so very large counts are not rounded */
const binomialCache = new Map<string, bigint>();
function binomial(n: number, k: number): bigint {
  if (k < 0 || k > n) return 0n;
  const kk = Math.min(k, n - k);
  const key = `${n}|${kk}`;
  const cached = binomialCache.get(key);
  if (cached !== undefined) return cached;
  let result = 1n;
  for (let i = 1; i <= kk; i++) {
    result = (result * BigInt(n - kk + i)) / BigInt(i);
  }
  binomialCache.set(key, result);
  return result;
}

// Stable identifier for the question pool behind a selection (used for the cache key and the per-user offset)
function poolHash(options: PaperOptions): string {
  const normalised = {
    selections: options.selections.map((s) => [s.subject, s.topic]).sort(),
    difficulty: options.difficulty,
    examType: options.examType,
    perSubject: options.perSubject,
  };
  return createHash('sha256').update(JSON.stringify(normalised)).digest('hex');
}

// The question pool for a selection, sorted by id so every page maps to the same combinations.
// Cached briefly so paging through papers does not query the bank again.
async function loadPool(options: PaperOptions): Promise<PoolRow[]> {
  const cacheKey = `paperpool:${poolHash(options)}`;
  const cached = await cacheGetJson<PoolRow[]>(cacheKey);
  if (cached) return cached;

  const bankExamType: 'Main' | 'Advanced' = options.examType === 'Advanced' ? 'Advanced' : 'Main';
  const rows: PoolRow[] = await prisma.question.findMany({
    where: {
      validatedAt: { not: null },
      mockOnly: false,
      examType: bankExamType,
      OR: options.selections.map((s) => ({
        subject: s.subject,
        topic: s.topic,
        ...(options.difficulty !== 'mixed' ? { difficulty: options.difficulty } : {}),
      })),
    },
    select: { id: true, subject: true, topic: true },
    orderBy: { id: 'asc' },
  });
  await cacheSetJson(cacheKey, rows, POOL_TTL);
  return rows;
}

/**
 * The k-th combination (0-based, lexicographic) of k items from a sorted list.
 * Every rank gives a different combination, so ranks never repeat a paper.
 */
function unrank(items: PoolRow[], k: number, rank: bigint): PoolRow[] {
  const picked: PoolRow[] = [];
  let remaining = rank;
  let start = 0;
  for (let i = 0; i < k; i++) {
    // Skip whole blocks of combinations that begin with an earlier item than the one we want
    for (;;) {
      const block = binomial(items.length - start - 1, k - i - 1);
      if (remaining < block) break;
      remaining -= block;
      start++;
    }
    picked.push(items[start]!);
    start++;
  }
  return picked;
}

export interface PaperPage {
  papers: string[][];
  // How many distinct papers this student can page through, capped at PAPER_SPACE_CAP
  available: number;
  pageCount: number;
  // Exact count of combinations the bank can make for these settings
  possibleSets: string;
}

/**
 * One page of distinct papers for a student. A student's papers are a fixed walk through the
 * combinations, starting at an offset derived from their id, so the same page always gives the
 * same papers and no two papers on the first 10,000 positions repeat.
 */
export async function buildPaperPage(userId: string, options: PaperOptions, page: number): Promise<PaperPage> {
  const pool = await loadPool(options);
  const subjects = [...new Set(options.selections.map((s) => s.subject))];

  // Items per subject, in pool order
  const bySubject = subjects.map((subject) => pool.filter((r) => r.subject === subject));
  const totals = bySubject.map((items) => binomial(items.length, options.perSubject));

  // Combined combination space: product over subjects of C(questions in subject, perSubject)
  const possible = totals.reduce((acc, t) => acc * t, 1n);
  const emptyPage: PaperPage = {
    papers: [],
    available: 0,
    pageCount: 0,
    possibleSets: possible.toString(),
  };
  if (possible === 0n) return emptyPage;

  const cap = BigInt(PAPER_SPACE_CAP);
  const available = possible < cap ? possible : cap;
  const pageCount = Number((available + BigInt(PAPER_PAGE_SIZE) - 1n) / BigInt(PAPER_PAGE_SIZE));
  if (page < 1 || page > pageCount) return { ...emptyPage, available: Number(available), pageCount };

  // Each student starts at their own offset in the space, so students do not all see the same first papers
  const offsetSeed = createHash('sha256').update(`${userId}|${poolHash(options)}`).digest('hex');
  const start = BigInt(`0x${offsetSeed}`) % possible;

  const papers: string[][] = [];
  const firstIndex = (page - 1) * PAPER_PAGE_SIZE;
  const lastIndex = Math.min(firstIndex + PAPER_PAGE_SIZE, Number(available));
  for (let j = firstIndex; j < lastIndex; j++) {
    // Walk the combined space; mixed-radix split gives each subject its own combination rank
    let global = (start + BigInt(j)) % possible;
    const ids: string[] = [];
    for (let s = 0; s < subjects.length; s++) {
      const total = totals[s]!;
      const subjectRank = global % total;
      global /= total;
      for (const row of unrank(bySubject[s]!, options.perSubject, subjectRank)) ids.push(row.id);
    }
    papers.push(ids);
  }

  return { papers, available: Number(available), pageCount, possibleSets: possible.toString() };
}

/** Fetch the question rows for a paper, without answers or explanations */
export async function fetchPaperQuestions(ids: string[]) {
  const rows = await prisma.question.findMany({
    where: { id: { in: ids } },
    select: {
      id: true, topic: true, subject: true, questionText: true, options: true,
      difficulty: true, questionType: true, diagram: true,
    },
  });
  const byId = new Map(rows.map((r) => [r.id, r]));
  return ids.map((id) => byId.get(id)).filter((r): r is NonNullable<typeof r> => !!r);
}

/**
 * Mark the questions of a chosen paper as served, and return them in paper order.
 * Only this call changes served state, so previewing a page costs nothing.
 */
export async function claimPaper(userId: string, ids: string[]): Promise<Question[]> {
  const rows = await prisma.question.findMany({
    where: { id: { in: ids }, validatedAt: { not: null } },
  });
  const byId = new Map(rows.map((r) => [r.id, r]));
  const ordered = ids.map((id) => byId.get(id)).filter((q): q is Question => !!q);

  const groups = new Map<string, string[]>();
  for (const q of ordered) {
    const key = servedKey(userId, q.subject, q.topic);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(q.id);
  }
  for (const [key, newIds] of groups) {
    await cacheAppendUnique(key, newIds, SERVED_TTL);
  }

  return ordered;
}
