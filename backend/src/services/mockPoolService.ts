import { cacheGetJson, cacheSetJson } from './cacheService';

const MOCK_POOL_TTL = 6 * 3600; // 6 hours

export interface MockPoolItem {
  questionId: string;
  subject: string;
  questionType: string;
}

function poolKey(examType: string, difficultyMode: string): string {
  return `mock_pool:${examType}:${difficultyMode}`;
}

export async function getSharedPool(examType: string, difficultyMode: string): Promise<MockPoolItem[] | null> {
  return cacheGetJson<MockPoolItem[]>(poolKey(examType, difficultyMode));
}

export async function setSharedPool(
  examType: string,
  difficultyMode: string,
  items: MockPoolItem[],
): Promise<void> {
  await cacheSetJson(poolKey(examType, difficultyMode), items, MOCK_POOL_TTL);
}

// Mock questions are stored only in the database (flagged mockOnly). The question bank JSON under
// data/ is curated input and is never written by the running server, so replicas cannot race on it.
