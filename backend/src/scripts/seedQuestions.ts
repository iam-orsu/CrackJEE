/**
 * seedQuestions.ts — Idempotent seeder for master_questions.json
 *
 * Reads the pre-generated question bank and upserts every question into the
 * PostgreSQL Question table. Safe to run multiple times — uses upsert so
 * already-seeded questions are skipped without error.
 *
 * Usage (inside backend container after build):
 *   node dist/scripts/seedQuestions.js [path/to/master_questions.json]
 *
 * Default path: /app/data/master_questions.json
 */

import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RawQuestion {
  id: string;
  subject: string;
  topic: string;
  difficulty: string;
  examType: string;
  questionType: string;
  questionText: string;
  options: string[];
  answer: string;
  explanation: string;
  diagram?: unknown;
}

interface QuestionBank {
  questions: RawQuestion[];
}

const BATCH_SIZE = 100;

async function seed(filePath: string): Promise<void> {
  console.log(`[seed] Reading question bank from: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error(`[seed] ERROR: File not found — ${filePath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const bank = JSON.parse(raw) as QuestionBank | RawQuestion[];
  const questions = Array.isArray(bank) ? bank : (bank.questions ?? []);

  if (questions.length === 0) {
    console.log('[seed] No questions found in file. Exiting.');
    return;
  }

  console.log(`[seed] Checking existing database records...`);
  const existingRows = await prisma.question.findMany({ select: { id: true } });
  const existingIdSet = new Set(existingRows.map((r) => r.id));
  console.log(`[seed] Database currently contains: ${existingIdSet.size} questions.`);

  const seenNewIds = new Set<string>();
  const validNewQuestions: RawQuestion[] = [];
  let invalidCount = 0;
  let alreadyInDbCount = 0;

  for (const q of questions) {
    if (!q || typeof q !== 'object' || !q.questionText || !q.topic || !q.subject || !q.answer) {
      invalidCount++;
      continue;
    }
    const id = (q.id && typeof q.id === 'string' && q.id.trim()) ? q.id.trim() : `gen_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    q.id = id;

    if (existingIdSet.has(id)) {
      alreadyInDbCount++;
      continue;
    }
    if (seenNewIds.has(id)) {
      // Intra-file duplicate
      continue;
    }
    seenNewIds.add(id);
    validNewQuestions.push(q);
  }

  console.log(`[seed] Total questions in JSON:   ${questions.length}`);
  console.log(`[seed] Already in DB (untouched):  ${alreadyInDbCount}`);
  if (invalidCount > 0) {
    console.log(`[seed] Skipped invalid records:    ${invalidCount}`);
  }
  console.log(`[seed] New to be inserted:         ${validNewQuestions.length}`);

  if (validNewQuestions.length === 0) {
    console.log(`\n[seed] ✅ No new questions to insert. Existing database records left 100% untouched.`);
    return;
  }

  console.log(`[seed] Starting insertion of ${validNewQuestions.length} new questions...`);
  const now = new Date();
  let processed = 0;

  for (let i = 0; i < validNewQuestions.length; i += BATCH_SIZE) {
    const batch = validNewQuestions.slice(i, i + BATCH_SIZE);

    await prisma.$transaction(
      batch.map((q) =>
        prisma.question.create({
          data: {
            id: q.id,
            subject: q.subject,
            topic: q.topic,
            difficulty: q.difficulty,
            examType: q.examType,
            questionType: q.questionType ?? 'mcq_single',
            questionText: q.questionText,
            options: q.options ?? [],
            answer: q.answer,
            explanation: q.explanation,
            diagram: q.diagram
              ? (JSON.parse(JSON.stringify(q.diagram)) as object)
              : undefined,
            generatedAt: now,
            validatedAt: now,  // pre-validated
          },
        })
      )
    );

    processed += batch.length;
    console.log(`[seed] Insert progress: ${processed} / ${validNewQuestions.length}`);
  }

  const finalTotal = await prisma.question.count();
  console.log(`\n[seed] ✅ Seeding complete:`);
  console.log(`       Untouched (existing): ${alreadyInDbCount}`);
  console.log(`       Newly inserted:       ${processed}`);
  console.log(`       Total now in DB:      ${finalTotal}`);
}

const filePath =
  process.argv[2] ?? path.resolve(__dirname, '../../data/jee/jee_master_questions.json');

seed(filePath)
  .catch((err: unknown) => {
    console.error('[seed] Fatal error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
