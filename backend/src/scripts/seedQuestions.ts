/**
 * seedQuestions.ts — Idempotent seeder for JEE and NEET question bank JSON files.
 *
 * Reads master question bank JSON files and inserts any new questions into the
 * MySQL `Question` table. Safe to run multiple times without creating duplicates
 * or touching already-seeded rows.
 *
 * Usage:
 *   npm run db:seed                                    # seeds both JEE & NEET banks
 *   node dist/scripts/seedQuestions.js [file.json]     # seeds a specific JSON file
 */

import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import type { Prisma } from '@prisma/client';
import { loadDotEnv } from '../config/env';
import { database } from '../config/database';

interface RawQuestion {
  id: string;
  subject: string;
  topic: string;
  difficulty: string;
  examType: string;
  questionType?: string;
  questionText: string;
  options?: string[];
  answer: string;
  explanation?: string;
  diagram?: unknown;
}

interface QuestionBank {
  questions: RawQuestion[];
}

const BATCH_SIZE = 200;

function resolveDefaultBankFiles(): string[] {
  const roots = [
    path.resolve(__dirname, '../../../data'),
    path.resolve(__dirname, '../../data'),
    path.resolve(process.cwd(), '../data'),
    path.resolve(process.cwd(), 'data'),
  ];

  const dataDir = roots.find((dir) => fs.existsSync(dir));
  if (!dataDir) return [];

  const candidates = [
    path.join(dataDir, 'jee', 'jee_master_questions.json'),
    path.join(dataDir, 'neet', 'neet_master_questions.json'),
  ];
  return candidates.filter((file) => fs.existsSync(file));
}

async function seedFile(filePath: string, existingIdSet: Set<string>): Promise<number> {
  console.log(`[seed] Reading question bank from: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Question bank file not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const bank = JSON.parse(raw) as QuestionBank | RawQuestion[];
  const questions = Array.isArray(bank) ? bank : (bank.questions ?? []);

  if (questions.length === 0) {
    console.log('[seed] No questions found in file. Skipping.');
    return 0;
  }

  const validNewQuestions: RawQuestion[] = [];
  let invalidCount = 0;
  let alreadyInDbCount = 0;

  for (const q of questions) {
    if (!q || typeof q !== 'object' || !q.questionText || !q.topic || !q.subject || !q.answer) {
      invalidCount++;
      continue;
    }

    const id = (q.id && typeof q.id === 'string' && q.id.trim())
      ? q.id.trim()
      : `gen_${createHash('sha256').update(`${q.subject}|${q.topic}|${q.questionText}`).digest('hex').slice(0, 24)}`;
    q.id = id;

    if (existingIdSet.has(id)) {
      alreadyInDbCount++;
      continue;
    }

    existingIdSet.add(id);
    validNewQuestions.push(q);
  }

  console.log(`[seed] Total in JSON: ${questions.length} | Already present: ${alreadyInDbCount} | New: ${validNewQuestions.length}${invalidCount > 0 ? ` | Skipped invalid: ${invalidCount}` : ''}`);

  if (validNewQuestions.length === 0) {
    return 0;
  }

  const now = new Date();
  let inserted = 0;

  for (let i = 0; i < validNewQuestions.length; i += BATCH_SIZE) {
    const batch = validNewQuestions.slice(i, i + BATCH_SIZE);
    const result = await database.client.question.createMany({
      data: batch.map((q) => ({
        id: q.id,
        subject: q.subject,
        topic: q.topic,
        difficulty: q.difficulty,
        examType: q.examType,
        questionType: q.questionType ?? 'mcq_single',
        questionText: q.questionText,
        options: (q.options ?? []) as Prisma.InputJsonValue,
        answer: q.answer,
        explanation: q.explanation ?? '',
        ...(q.diagram ? { diagram: JSON.parse(JSON.stringify(q.diagram)) as Prisma.InputJsonValue } : {}),
        generatedAt: now,
        validatedAt: now,
      })),
      skipDuplicates: true,
    });
    inserted += result.count;
    console.log(`[seed] Progress (${path.basename(filePath)}): ${Math.min(i + BATCH_SIZE, validNewQuestions.length)} / ${validNewQuestions.length}`);
  }

  return inserted;
}

async function main(): Promise<void> {
  loadDotEnv();
  await database.connect();

  const argPath = process.argv[2];
  const files = argPath ? [path.resolve(process.cwd(), argPath)] : resolveDefaultBankFiles();
  if (files.length === 0) {
    throw new Error('No question bank JSON files found. Pass a file path or place data/jee and data/neet in the repository root.');
  }

  const existingRows = await database.client.question.findMany({ select: { id: true } });
  const existingIdSet = new Set(existingRows.map((r) => r.id));
  console.log(`[seed] Database currently contains: ${existingIdSet.size} questions.`);

  let totalInserted = 0;
  for (const file of files) {
    totalInserted += await seedFile(file, existingIdSet);
  }

  const finalTotal = await database.client.question.count();
  console.log(`[seed] Done. Newly inserted: ${totalInserted} | Total in MySQL: ${finalTotal}`);
}

main()
  .catch((err: unknown) => {
    console.error('[seed] Fatal error:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await database.disconnect();
  });
