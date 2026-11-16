/**
 * embedMatrixQuestions.ts
 *
 * Merges generated JEE matrix match questions into `jee_master_questions.json`
 * and inserts them into the MySQL `Question` database table.
 */

import fs from 'fs';
import path from 'path';
import type { Prisma } from '@prisma/client';
import { loadDotEnv } from '../config/env';
import { database } from '../config/database';

const BATCH_SIZE = 100;

async function main(): Promise<void> {
  loadDotEnv();

  const dataDir = path.resolve(__dirname, '../../../data/jee');
  const matrixFile = path.join(dataDir, 'matrix_math_questions.json');
  const masterFile = path.join(dataDir, 'jee_master_questions.json');

  if (!fs.existsSync(matrixFile)) {
    throw new Error(`Matrix questions file not found: ${matrixFile}`);
  }

  const rawMatrix = fs.readFileSync(matrixFile, 'utf8');
  const matrixQuestions = JSON.parse(rawMatrix);

  console.log(`[embed] Loaded ${matrixQuestions.length} matrix match questions from ${matrixFile}`);

  if (!Array.isArray(matrixQuestions) || matrixQuestions.length === 0) {
    console.log('[embed] No matrix questions to embed. Exiting.');
    return;
  }

  // 1. Merge into jee_master_questions.json
  if (fs.existsSync(masterFile)) {
    const rawMaster = fs.readFileSync(masterFile, 'utf8');
    const masterData = JSON.parse(rawMaster);
    const masterList: any[] = Array.isArray(masterData) ? masterData : (masterData.questions ?? []);

    const existingMasterIds = new Set(masterList.map((q) => q.id));
    let newlyAddedToMaster = 0;

    for (const mq of matrixQuestions) {
      if (!existingMasterIds.has(mq.id)) {
        masterList.push(mq);
        existingMasterIds.add(mq.id);
        newlyAddedToMaster++;
      }
    }

    fs.writeFileSync(masterFile, JSON.stringify(masterList, null, 2), 'utf8');
    console.log(`[embed] Updated ${masterFile}: added ${newlyAddedToMaster} new questions (total in master: ${masterList.length})`);
  } else {
    console.warn(`[embed] Warning: Master file not found at ${masterFile}`);
  }

  // 2. Insert into MySQL Question table
  await database.connect();

  const existingInDb = await database.client.question.findMany({
    select: { id: true },
  });
  const existingDbIds = new Set(existingInDb.map((q) => q.id));
  console.log(`[embed] Current DB question count: ${existingDbIds.size}`);

  const questionsToInsert = matrixQuestions.filter((q) => !existingDbIds.has(q.id));
  console.log(`[embed] New matrix questions to insert into DB: ${questionsToInsert.length}`);

  let insertedTotal = 0;
  const now = new Date();

  for (let i = 0; i < questionsToInsert.length; i += BATCH_SIZE) {
    const batch = questionsToInsert.slice(i, i + BATCH_SIZE);
    const result = await database.client.question.createMany({
      data: batch.map((q) => ({
        id: q.id,
        subject: q.subject,
        topic: q.topic,
        difficulty: q.difficulty,
        examType: q.examType,
        questionType: q.questionType ?? 'matrix_match',
        questionText: q.questionText,
        options: (q.options ?? []) as Prisma.InputJsonValue,
        answer: q.answer,
        explanation: q.explanation ?? '',
        mockOnly: false,
        generatedAt: now,
        validatedAt: now,
      })),
      skipDuplicates: true,
    });
    insertedTotal += result.count;
    console.log(`[embed] Inserted ${Math.min(i + BATCH_SIZE, questionsToInsert.length)} / ${questionsToInsert.length}`);
  }

  const finalCount = await database.client.question.count({
    where: { questionType: 'matrix_match', subject: 'Mathematics' },
  });
  console.log(`[embed] Done! Newly inserted: ${insertedTotal}. Total Mathematics matrix_match in DB: ${finalCount}`);
}

main()
  .catch((err) => {
    console.error('[embed] Error:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await database.disconnect();
  });
