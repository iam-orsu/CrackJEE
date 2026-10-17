import { prisma } from '../lib/prisma';
import { cacheGetJson, cacheSetJson } from './cacheService';
import { fisherYatesShuffle } from './questionService';
import type { Subject, Difficulty, ExamType } from '../types/index';
import type { Question } from '@prisma/client';

const SERVED_TTL = 86400 * 7;

export interface PaperSelection {
  subject: Subject;
  topic: string;
}

export interface PaperOptions {
  selections: PaperSelection[];
  difficulty: Difficulty | 'mixed';
  examType: ExamType;
  perSubject: number;
  papers: number;
}

// Same key format getPracticeQuestion uses, so served questions stay excluded everywhere
function servedKey(userId: string, subject: string, topic: string): string {
  return `served:${userId}:${subject}:${topic}:practice`;
}

interface PoolRow {
  id: string;
  subject: string;
  topic: string;
}

// Round-robin across topics so a paper mixes topics instead of drawing one topic repeatedly
function drawFromBuckets(buckets: Map<string, string[]>, count: number): string[] {
  const topics = fisherYatesShuffle([...buckets.keys()]);
  const out: string[] = [];
  let cursor = 0;
  let emptyInARow = 0;
  while (out.length < count && topics.length > 0 && emptyInARow < topics.length) {
    const bucket = buckets.get(topics[cursor % topics.length]!)!;
    cursor++;
    if (bucket.length > 0) {
      out.push(bucket.pop()!);
      emptyInARow = 0;
    } else {
      emptyInARow++;
    }
  }
  return out;
}

function groupByTopic(rows: PoolRow[]): Map<string, string[]> {
  const buckets = new Map<string, string[]>();
  for (const row of rows) {
    if (!buckets.has(row.topic)) buckets.set(row.topic, []);
    buckets.get(row.topic)!.push(row.id);
  }
  for (const [topic, ids] of buckets) buckets.set(topic, fisherYatesShuffle(ids));
  return buckets;
}

/** C(n, k) as an exact integer, so very large counts are not rounded */
function binomial(n: number, k: number): bigint {
  if (k < 0 || k > n) return 0n;
  const kk = Math.min(k, n - k);
  let result = 1n;
  for (let i = 1; i <= kk; i++) {
    result = (result * BigInt(n - kk + i)) / BigInt(i);
  }
  return result;
}

/**
 * Build a row of disjoint paper candidates from the bank.
 * Nothing is marked as served here; the student's pick is claimed separately.
 * Also returns how many distinct papers the bank could make for these settings.
 */
export async function buildPaperSet(userId: string, options: PaperOptions): Promise<{ papers: string[][]; possibleSets: string }> {
  const bankExamType: 'Main' | 'Advanced' = options.examType === 'Advanced' ? 'Advanced' : 'Main';

  const rows: PoolRow[] = await prisma.question.findMany({
    where: {
      validatedAt: { not: null },
      examType: bankExamType,
      OR: options.selections.map((s) => ({
        subject: s.subject,
        topic: s.topic,
        ...(options.difficulty !== 'mixed' ? { difficulty: options.difficulty } : {}),
      })),
    },
    select: { id: true, subject: true, topic: true },
  });

  // Questions the student has already seen go last, so they only appear if the bank runs short
  const servedIds = new Set<string>();
  const keys = new Set(options.selections.map((s) => servedKey(userId, s.subject, s.topic)));
  for (const key of keys) {
    for (const id of (await cacheGetJson<string[]>(key)) ?? []) servedIds.add(id);
  }
  const freshRows = rows.filter((r) => !servedIds.has(r.id));
  const reusedRows = rows.filter((r) => servedIds.has(r.id));

  const subjects = [...new Set(options.selections.map((s) => s.subject))];

  // Distinct papers = product over subjects of C(questions in subject, perSubject)
  let possible = 1n;
  for (const subject of subjects) {
    possible *= binomial(rows.filter((r) => r.subject === subject).length, options.perSubject);
  }

  const papers: string[][] = Array.from({ length: options.papers }, () => []);

  for (const subject of subjects) {
    const fresh = groupByTopic(freshRows.filter((r) => r.subject === subject));
    const reused = groupByTopic(reusedRows.filter((r) => r.subject === subject));
    for (const paper of papers) {
      let picked = drawFromBuckets(fresh, options.perSubject);
      if (picked.length < options.perSubject) {
        picked = picked.concat(drawFromBuckets(reused, options.perSubject - picked.length));
      }
      paper.push(...picked);
    }
  }

  return {
    papers: papers.filter((p) => p.length > 0),
    possibleSets: possible.toString(),
  };
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
 * Only this call changes served state, so previewing a row costs nothing.
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
    const previous = (await cacheGetJson<string[]>(key)) ?? [];
    await cacheSetJson(key, [...new Set([...previous, ...newIds])], SERVED_TTL);
  }

  return ordered;
}
