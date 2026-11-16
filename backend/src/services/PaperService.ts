import { createHash } from 'crypto';
import type { Question } from '@prisma/client';
import { CACHE_CONSTANTS } from '../config/constants';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { CacheService, cacheService as defaultCache } from './CacheService';
import type { Difficulty, ExamType, Subject, QuestionType, QuestionTypeCounts, DifficultyDistribution } from '../types/index';
import { planDifficultySlots } from '../utils/questionUtils';

export const PAPER_PAGE_SIZE = 10;
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
  questionTypes?: QuestionTypeCounts;
  difficultyDistribution?: DifficultyDistribution;
}

interface PoolRow {
  id: string;
  subject: string;
  topic: string;
  difficulty?: string;
  questionType?: string;
}

export interface PaperPage {
  papers: string[][];
  available: number;
  pageCount: number;
  possibleSets: string;
}

export class PaperService {
  private readonly binomialCache = new Map<string, bigint>();

  constructor(
    private readonly questions: QuestionRepository = new QuestionRepository(),
    private readonly cache: CacheService = defaultCache,
  ) {}

  private servedKey(userId: string, subject: string, topic: string): string {
    return `served:${userId}:${subject}:${topic}:practice`;
  }

  private binomial(n: number, k: number): bigint {
    if (k < 0 || k > n) return 0n;
    const kk = Math.min(k, n - k);
    const key = `${n}|${kk}`;
    const cached = this.binomialCache.get(key);
    if (cached !== undefined) return cached;
    let result = 1n;
    for (let i = 1; i <= kk; i++) {
      result = (result * BigInt(n - kk + i)) / BigInt(i);
    }
    if (this.binomialCache.size >= 5000) this.binomialCache.clear();
    this.binomialCache.set(key, result);
    return result;
  }

  private poolHash(options: PaperOptions): string {
    const normalised = {
      selections: options.selections.map((s) => [s.subject, s.topic]).sort(),
      difficulty: options.difficulty,
      examType: options.examType,
      perSubject: options.perSubject,
      questionTypes: options.questionTypes
        ? {
            mcq_single: options.questionTypes.mcq_single ?? 0,
            mcq_multi: options.questionTypes.mcq_multi ?? 0,
            integer: options.questionTypes.integer ?? 0,
            matrix_match: options.questionTypes.matrix_match ?? 0,
          }
        : null,
      difficultyDistribution: options.difficultyDistribution
        ? {
            beginner: options.difficultyDistribution.beginner ?? 0,
            intermediate: options.difficultyDistribution.intermediate ?? 0,
            advanced: options.difficultyDistribution.advanced ?? 0,
          }
        : null,
    };
    return createHash('sha256').update(JSON.stringify(normalised)).digest('hex');
  }

  private async loadPool(options: PaperOptions): Promise<PoolRow[]> {
    const cacheKey = `paperpool:${this.poolHash(options)}`;
    const cached = await this.cache.getJson<PoolRow[]>(cacheKey);
    if (cached) return cached;

    const bankExamType: 'Main' | 'Advanced' = options.examType === 'Advanced' ? 'Advanced' : 'Main';
    const rows = await this.questions.findPaperPoolRows(bankExamType, options.selections, options.difficulty);
    await this.cache.setJson(cacheKey, rows, CACHE_CONSTANTS.POOL_TTL_SECONDS);
    return rows;
  }

  private unrank(items: PoolRow[], k: number, rank: bigint): PoolRow[] {
    const picked: PoolRow[] = [];
    let remaining = rank;
    let start = 0;
    for (let i = 0; i < k; i++) {
      for (;;) {
        const block = this.binomial(items.length - start - 1, k - i - 1);
        if (remaining < block) break;
        remaining -= block;
        start++;
      }
      picked.push(items[start]!);
      start++;
    }
    return picked;
  }

  private getSubjectPlan(
    subjectRows: PoolRow[],
    perSubject: number,
    questionTypes?: QuestionTypeCounts,
    difficulty?: Difficulty | 'mixed',
    difficultyDistribution?: DifficultyDistribution,
  ): {
    partitions: Array<{ rows: PoolRow[]; count: number; ways: bigint }>;
    totalWays: bigint;
  } {
    const hasCustomTypes =
      questionTypes &&
      ((questionTypes.mcq_single ?? 0) > 0 ||
        (questionTypes.integer ?? 0) > 0 ||
        (questionTypes.matrix_match ?? 0) > 0 ||
        (questionTypes.mcq_multi ?? 0) > 0);

    if (hasCustomTypes) {
      const typeKeys: QuestionType[] = ['mcq_single', 'integer', 'matrix_match', 'mcq_multi'];
      const rowsByType: Record<QuestionType, PoolRow[]> = {
        mcq_single: [],
        integer: [],
        matrix_match: [],
        mcq_multi: [],
      };
      for (const r of subjectRows) {
        const t = (r.questionType as QuestionType) || 'mcq_single';
        if (rowsByType[t]) rowsByType[t].push(r);
        else rowsByType.mcq_single.push(r);
      }

      let deficit = 0;
      const counts: Record<QuestionType, number> = {
        mcq_single: 0,
        integer: 0,
        matrix_match: 0,
        mcq_multi: 0,
      };
      for (const t of typeKeys) {
        const req = Math.max(0, questionTypes[t] ?? 0);
        const avail = rowsByType[t].length;
        if (avail >= req) {
          counts[t] = req;
        } else {
          counts[t] = avail;
          deficit += req - avail;
        }
      }
      if (deficit > 0) {
        for (const t of typeKeys) {
          const surplus = rowsByType[t].length - counts[t];
          if (surplus > 0) {
            const add = Math.min(surplus, deficit);
            counts[t] += add;
            deficit -= add;
            if (deficit === 0) break;
          }
        }
      }

      const totalAllocated = Object.values(counts).reduce((a, b) => a + b, 0);
      if (totalAllocated < perSubject) {
        return { partitions: [], totalWays: 0n };
      }

      const partitions: Array<{ rows: PoolRow[]; count: number; ways: bigint }> = [];
      let totalWays = 1n;
      for (const t of typeKeys) {
        const c = counts[t];
        if (c <= 0) continue;
        const ways = this.binomial(rowsByType[t].length, c);
        if (ways === 0n) return { partitions: [], totalWays: 0n };
        partitions.push({ rows: rowsByType[t], count: c, ways });
        totalWays *= ways;
      }
      return { partitions, totalWays };
    }

    const hasCustomDiff =
      difficultyDistribution &&
      ((difficultyDistribution.beginner ?? 0) > 0 ||
        (difficultyDistribution.intermediate ?? 0) > 0 ||
        (difficultyDistribution.advanced ?? 0) > 0);

    if (hasCustomDiff && (difficulty === 'mixed' || !difficulty)) {
      const diffKeys: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
      const diffSlots = planDifficultySlots(perSubject, difficulty ?? 'mixed', difficultyDistribution);
      const targetCounts: Record<Difficulty, number> = {
        beginner: diffSlots.filter((d) => d === 'beginner').length,
        intermediate: diffSlots.filter((d) => d === 'intermediate').length,
        advanced: diffSlots.filter((d) => d === 'advanced').length,
      };
      const rowsByDiff: Record<Difficulty, PoolRow[]> = {
        beginner: [],
        intermediate: [],
        advanced: [],
      };
      for (const r of subjectRows) {
        const d = (r.difficulty as Difficulty) || 'intermediate';
        if (rowsByDiff[d]) rowsByDiff[d].push(r);
        else rowsByDiff.intermediate.push(r);
      }

      let deficit = 0;
      const counts: Record<Difficulty, number> = {
        beginner: 0,
        intermediate: 0,
        advanced: 0,
      };
      for (const d of diffKeys) {
        const req = targetCounts[d];
        const avail = rowsByDiff[d].length;
        if (avail >= req) {
          counts[d] = req;
        } else {
          counts[d] = avail;
          deficit += req - avail;
        }
      }
      if (deficit > 0) {
        for (const d of diffKeys) {
          const surplus = rowsByDiff[d].length - counts[d];
          if (surplus > 0) {
            const add = Math.min(surplus, deficit);
            counts[d] += add;
            deficit -= add;
            if (deficit === 0) break;
          }
        }
      }

      const totalAllocated = Object.values(counts).reduce((a, b) => a + b, 0);
      if (totalAllocated < perSubject) {
        return { partitions: [], totalWays: 0n };
      }

      const partitions: Array<{ rows: PoolRow[]; count: number; ways: bigint }> = [];
      let totalWays = 1n;
      for (const d of diffKeys) {
        const c = counts[d];
        if (c <= 0) continue;
        const ways = this.binomial(rowsByDiff[d].length, c);
        if (ways === 0n) return { partitions: [], totalWays: 0n };
        partitions.push({ rows: rowsByDiff[d], count: c, ways });
        totalWays *= ways;
      }
      return { partitions, totalWays };
    }

    const ways = this.binomial(subjectRows.length, perSubject);
    if (ways === 0n) return { partitions: [], totalWays: 0n };
    return {
      partitions: [{ rows: subjectRows, count: perSubject, ways }],
      totalWays: ways,
    };
  }

  public async buildPaperPage(userId: string, options: PaperOptions, page: number): Promise<PaperPage> {
    const pool = await this.loadPool(options);
    const subjects = [...new Set(options.selections.map((s) => s.subject))];
    const subjectPlans = subjects.map((subject) =>
      this.getSubjectPlan(
        pool.filter((r) => r.subject === subject),
        options.perSubject,
        options.questionTypes,
        options.difficulty,
        options.difficultyDistribution,
      ),
    );
    const totals = subjectPlans.map((p) => p.totalWays);

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

    const offsetSeed = createHash('sha256').update(`${userId}|${this.poolHash(options)}`).digest('hex');
    const start = BigInt(`0x${offsetSeed}`) % possible;

    const papers: string[][] = [];
    const firstIndex = (page - 1) * PAPER_PAGE_SIZE;
    const lastIndex = Math.min(firstIndex + PAPER_PAGE_SIZE, Number(available));
    for (let j = firstIndex; j < lastIndex; j++) {
      let global = (start + BigInt(j)) % possible;
      const ids: string[] = [];
      for (let s = 0; s < subjects.length; s++) {
        const plan = subjectPlans[s]!;
        const total = totals[s]!;
        let subjectRank = global % total;
        global /= total;
        for (const part of plan.partitions) {
          const partRank = subjectRank % part.ways;
          subjectRank /= part.ways;
          for (const row of this.unrank(part.rows, part.count, partRank)) {
            ids.push(row.id);
          }
        }
      }
      papers.push(ids);
    }

    return { papers, available: Number(available), pageCount, possibleSets: possible.toString() };
  }

  public async fetchPaperQuestions(ids: string[]) {
    const rows = await this.questions.findPaperPreviewByIds(ids);
    const byId = new Map(rows.map((r) => [r.id, r]));
    return ids.map((id) => byId.get(id)).filter((r): r is NonNullable<typeof r> => !!r);
  }

  public async claimPaper(userId: string, ids: string[]): Promise<Question[]> {
    const rows = await this.questions.findValidatedByIds(ids);
    const byId = new Map(rows.map((r) => [r.id, r]));
    const ordered = ids.map((id) => byId.get(id)).filter((q): q is Question => !!q);

    const groups = new Map<string, string[]>();
    for (const q of ordered) {
      const key = this.servedKey(userId, q.subject, q.topic);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(q.id);
    }
    for (const [key, newIds] of groups) {
      await this.cache.appendUnique(key, newIds, CACHE_CONSTANTS.SERVED_TTL_SECONDS);
    }

    return ordered;
  }
}
