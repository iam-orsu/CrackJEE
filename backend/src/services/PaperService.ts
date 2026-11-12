import { createHash } from 'crypto';
import type { Question } from '@prisma/client';
import { CACHE_CONSTANTS } from '../config/constants';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { CacheService, cacheService as defaultCache } from './CacheService';
import type { Difficulty, ExamType, Subject } from '../types/index';

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
}

interface PoolRow {
  id: string;
  subject: string;
  topic: string;
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

  public async buildPaperPage(userId: string, options: PaperOptions, page: number): Promise<PaperPage> {
    const pool = await this.loadPool(options);
    const subjects = [...new Set(options.selections.map((s) => s.subject))];
    const bySubject = subjects.map((subject) => pool.filter((r) => r.subject === subject));
    const totals = bySubject.map((items) => this.binomial(items.length, options.perSubject));

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
        const total = totals[s]!;
        const subjectRank = global % total;
        global /= total;
        for (const row of this.unrank(bySubject[s]!, options.perSubject, subjectRank)) ids.push(row.id);
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
