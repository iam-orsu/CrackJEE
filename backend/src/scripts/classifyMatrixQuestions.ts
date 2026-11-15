/**
 * classifyMatrixQuestions.ts
 *
 * Carefully classifies exactly 400 "Match List I with List II" questions
 * across Botany, Zoology, Physics, and Chemistry into `questionType: "matrix_match"`,
 * leaving the remaining matching questions as `mcq_single`.
 *
 * Updates master question JSON files and executes an idempotent DB update.
 */
import fs from 'fs';
import path from 'path';
import { database } from '../config/database';
import { loadDotEnv } from '../config/env';

function parseMatch(text: string): boolean {
  if (!text) return false;
  const l1 = text.search(/\n\s*List\s*I\b/i);
  const l2 = text.search(/\n\s*List\s*II\b/i);
  return l1 !== -1 && l2 !== -1 && l1 < l2;
}

const QUOTAS: Record<string, number> = {
  Botany: 100,
  Zoology: 92,
  Physics: 97,
  Chemistry: 111,
};

async function main() {
  loadDotEnv();

  const dataDir = path.resolve(__dirname, '../../../data');
  const jeeMasterPath = path.join(dataDir, 'jee', 'jee_master_questions.json');
  const neetMasterPath = path.join(dataDir, 'neet', 'neet_master_questions.json');

  if (!fs.existsSync(jeeMasterPath) || !fs.existsSync(neetMasterPath)) {
    console.error('Master question files not found at:', jeeMasterPath, neetMasterPath);
    process.exit(1);
  }

  const jeeMaster = JSON.parse(fs.readFileSync(jeeMasterPath, 'utf8'));
  const neetMaster = JSON.parse(fs.readFileSync(neetMasterPath, 'utf8'));

  const counts: Record<string, number> = { Botany: 0, Zoology: 0, Physics: 0, Chemistry: 0 };
  const targetIds = new Set<string>();

  // Process master files to select exactly 400 questions
  for (const q of [...neetMaster, ...jeeMaster]) {
    if (parseMatch(q.questionText || '')) {
      const s = q.subject;
      if (QUOTAS[s] && counts[s]! < QUOTAS[s]!) {
        q.questionType = 'matrix_match';
        counts[s]!++;
        if (q.id) targetIds.add(q.id);
      }
    }
  }

  const totalSelected = Object.values(counts).reduce((a, b) => a + b, 0);
  console.log(`[classify] Selected exactly ${totalSelected} questions for matrix_match:`, counts);

  // Write updated master files
  fs.writeFileSync(jeeMasterPath, JSON.stringify(jeeMaster, null, 2), 'utf8');
  fs.writeFileSync(neetMasterPath, JSON.stringify(neetMaster, null, 2), 'utf8');
  console.log('[classify] Updated jee_master_questions.json and neet_master_questions.json');

  // Update corresponding chunk files where these IDs exist
  function updateChunks(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        updateChunks(fullPath);
      } else if (entry.name.endsWith('.json') && !entry.name.includes('master')) {
        try {
          const raw = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
          let modified = false;
          if (Array.isArray(raw)) {
            for (const q of raw) {
              if (q.id && targetIds.has(q.id)) {
                q.questionType = 'matrix_match';
                modified = true;
              }
            }
          } else if (raw && Array.isArray(raw.questions)) {
            for (const q of raw.questions) {
              if (q.id && targetIds.has(q.id)) {
                q.questionType = 'matrix_match';
                modified = true;
              }
            }
          }
          if (modified) {
            fs.writeFileSync(fullPath, JSON.stringify(raw, null, 2), 'utf8');
          }
        } catch {
          // ignore parsing error for non-json
        }
      }
    }
  }

  updateChunks(dataDir);
  console.log('[classify] Updated chunk files in data directory');

  // If database is connected, update rows in DB
  try {
    await database.connect();
    console.log('[classify] Connected to database, updating Question rows...');
    const idArray = Array.from(targetIds);
    const batchSize = 100;
    let updatedDbCount = 0;

    for (let i = 0; i < idArray.length; i += batchSize) {
      const batch = idArray.slice(i, i + batchSize);
      const res = await database.client.question.updateMany({
        where: { id: { in: batch } },
        data: { questionType: 'matrix_match' },
      });
      updatedDbCount += res.count;
    }

    console.log(`[classify] Successfully updated ${updatedDbCount} questions in MySQL database to questionType='matrix_match'`);
  } catch (err) {
    console.warn('[classify] Note: Could not connect to local MySQL (offline/dev); JSON files are successfully updated.', err instanceof Error ? err.message : err);
  } finally {
    try {
      await database.disconnect();
    } catch {
      // ignore
    }
  }
}

main().catch((err) => {
  console.error('[classify] Fatal error:', err);
  process.exit(1);
});
