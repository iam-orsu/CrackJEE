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
  const bank = JSON.parse(raw) as QuestionBank;
  const questions = bank.questions ?? [];

  if (questions.length === 0) {
    console.log('[seed] No questions found in file. Exiting.');
    return;
  }

  console.log(`[seed] Found ${questions.length} questions. Starting upsert...`);

  const now = new Date();
  let processed = 0;

  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    const batch = questions.slice(i, i + BATCH_SIZE);

    await prisma.$transaction(
      batch.map((q) =>
        prisma.question.upsert({
          where: { id: q.id },
          update: {},  // already exists — leave it untouched (idempotent)
          create: {
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
            validatedAt: now,  // pre-validated by gatekeeper
          },
        })
      )
    );

    processed += batch.length;
    console.log(`[seed] Progress: ${processed} / ${questions.length}`);
  }

  console.log(`\n[seed] ✅ Seeding complete — ${processed} questions upserted.`);
}

const filePath =
  process.argv[2] ?? path.resolve(__dirname, '../../data/master_questions.json');

seed(filePath)
  .catch((err: unknown) => {
    console.error('[seed] Fatal error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
