import fs from 'fs';
import path from 'path';
import { cacheGetJson, cacheSetJson } from './cacheService';
import type { Question } from '@prisma/client';

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

// Per-file write mutex so concurrent mock generations don't corrupt the JSON
const writeLocks = new Map<string, Promise<void>>();

function getMasterJsonPath(examType: string): string {
  const dataDir = process.env.DATA_DIR ?? '/app/data';
  return examType === 'NEET'
    ? path.join(dataDir, 'neet', 'neet_master_questions.json')
    : path.join(dataDir, 'jee', 'jee_master_questions.json');
}

export async function appendQuestionsToMasterJson(
  examType: string,
  questions: Question[],
): Promise<void> {
  if (questions.length === 0) return;
  const filePath = getMasterJsonPath(examType);

  const prev = writeLocks.get(filePath) ?? Promise.resolve();
  const next = prev.then(async () => {
    try {
      let existing: object[] = [];
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(raw) as unknown;
        existing = Array.isArray(parsed)
          ? (parsed as object[])
          : ((parsed as { questions?: object[] }).questions ?? []);
      }

      const existingIds = new Set(existing.map((q) => (q as { id: string }).id));
      const newEntries = questions
        .filter((q) => !existingIds.has(q.id))
        .map((q) => ({
          id: q.id,
          subject: q.subject,
          topic: q.topic,
          difficulty: q.difficulty,
          examType: q.examType,
          questionType: q.questionType,
          questionText: q.questionText,
          options: q.options as string[],
          answer: q.answer,
          explanation: q.explanation ?? '',
          ...(q.diagram ? { diagram: q.diagram } : {}),
        }));

      if (newEntries.length === 0) return;

      const merged = [...existing, ...newEntries];
      // Atomic write: temp file → rename
      const tmpPath = `${filePath}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(merged, null, 2), 'utf8');
      fs.renameSync(tmpPath, filePath);
      console.log(`[mockPool] Appended ${newEntries.length} new questions to ${path.basename(filePath)}`);
    } catch (err) {
      // Don't break mock generation if JSON append fails
      console.error('[mockPool] Failed to append to master JSON:', err);
    }
  });

  writeLocks.set(filePath, next.catch(() => {}));
  await next;
}
