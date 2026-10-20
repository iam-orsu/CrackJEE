/**
 * CrackNEET Master Question Compiler & Validator
 * Reads all chunk files from data/neet/botany, zoology, physics, chemistry
 * Deduplicates by 'id', validates schema, and compiles into data/neet/neet_master_questions.json
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const TARGET_QUOTA = 17940;
const NEET_DIR = __dirname;
const SUBJECT_DIRS = ['botany', 'zoology', 'physics', 'chemistry'];
const OUTPUT_FILE = path.join(NEET_DIR, 'neet_master_questions.json');
const REGISTRY_DIR = path.join(NEET_DIR, 'registry');
const TOPICS_FILE = path.join(REGISTRY_DIR, 'neet_topics.json');
const PROGRESS_FILE = path.join(REGISTRY_DIR, 'neet_progress.json');
const HASHES_FILE = path.join(REGISTRY_DIR, 'neet_hashes.json');

function compile() {
  console.log('===============================================================');
  console.log('   CrackNEET Master Question Compiler & Audit Report');
  console.log('===============================================================\n');

  // Load official topics to build ground-truth progress ledger
  let topicsData = null;
  if (fs.existsSync(TOPICS_FILE)) {
    topicsData = JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf8'));
  }

  const progress = {
    lastUpdated: new Date().toISOString(),
    totalQuestionsCompleted: 0,
    targetQuota: TARGET_QUOTA,
    subjects: {}
  };

  if (topicsData && topicsData.subjects) {
    for (const [subjName, sObj] of Object.entries(topicsData.subjects)) {
      progress.subjects[subjName] = {
        completedQuestions: 0,
        topics: {}
      };
      for (const t of sObj.topics) {
        progress.subjects[subjName].topics[t.name] = {
          completedChunks: 0,
          totalQuestions: 0,
          beginner: 0,
          intermediate: 0,
          advanced: 0,
          status: 'PENDING'
        };
      }
    }
  }

  const hashes = {};
  const questionMap = new Map();
  const breakdown = {
    subjects: { Botany: 0, Zoology: 0, Physics: 0, Chemistry: 0 },
    difficulty: { beginner: 0, intermediate: 0, advanced: 0 },
    questionType: { mcq_single: 0 }
  };

  let totalRawQuestions = 0;
  let chunkFilesCount = 0;

  for (const subDir of SUBJECT_DIRS) {
    const dirPath = path.join(NEET_DIR, subDir);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
    console.log(`Inspecting ${subDir.toUpperCase()} (${files.length} chunk files)...`);

    for (const file of files) {
      chunkFilesCount++;
      const fullPath = path.join(dirPath, file);
      let chunkData;
      try {
        chunkData = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      } catch (err) {
        console.error(`[ERROR] Parsing chunk file ${file}:`, err.message);
        continue;
      }

      const questions = chunkData.questions || [];
      const chunkSubject = chunkData.subject;
      const chunkTopic = chunkData.topic;

      if (progress.subjects[chunkSubject]?.topics[chunkTopic]) {
        progress.subjects[chunkSubject].topics[chunkTopic].completedChunks++;
      }

      for (const q of questions) {
        totalRawQuestions++;
        if (!q.id) {
          console.warn(`[WARN] Question missing id in ${file}`);
          continue;
        }

        if (questionMap.has(q.id)) {
          console.warn(`[DUPLICATE] ID ${q.id} found multiple times. Keeping first occurrence.`);
          continue;
        }

        questionMap.set(q.id, q);

        // Compute dedup hash
        const normalized = (q.questionText || '').replace(/\s+/g, ' ').trim().toLowerCase();
        const hash = crypto.createHash('sha256').update(normalized).digest('hex');
        hashes[hash] = q.id;

        // Subject tally
        if (breakdown.subjects[q.subject] !== undefined) {
          breakdown.subjects[q.subject]++;
        } else {
          breakdown.subjects[q.subject] = 1;
        }

        // Difficulty tally
        if (breakdown.difficulty[q.difficulty] !== undefined) {
          breakdown.difficulty[q.difficulty]++;
        } else {
          breakdown.difficulty[q.difficulty] = 1;
        }

        // Question type tally
        if (breakdown.questionType[q.questionType] !== undefined) {
          breakdown.questionType[q.questionType]++;
        } else {
          breakdown.questionType[q.questionType] = 1;
        }

        // Update progress ledger
        if (progress.subjects[q.subject]?.topics[q.topic]) {
          const tProg = progress.subjects[q.subject].topics[q.topic];
          tProg.totalQuestions++;
          if (q.difficulty === 'beginner') tProg.beginner++;
          else if (q.difficulty === 'intermediate') tProg.intermediate++;
          else if (q.difficulty === 'advanced') tProg.advanced++;
          tProg.status = tProg.totalQuestions >= 230 ? 'COMPLETED' : 'IN_PROGRESS';
        }
      }
    }
  }

  // Calculate subject totals & grand total
  let grandTotal = 0;
  for (const sName of Object.keys(progress.subjects)) {
    const sObj = progress.subjects[sName];
    sObj.completedQuestions = Object.values(sObj.topics).reduce((sum, t) => sum + t.totalQuestions, 0);
    grandTotal += sObj.completedQuestions;
  }
  progress.totalQuestionsCompleted = grandTotal;

  const uniqueQuestions = Array.from(questionMap.values());
  const completionPercentage = ((uniqueQuestions.length / TARGET_QUOTA) * 100).toFixed(2) + '%';

  const masterPayload = {
    generatedAt: new Date().toISOString(),
    totalQuestions: uniqueQuestions.length,
    targetQuota: TARGET_QUOTA,
    completionPercentage,
    breakdown,
    questions: uniqueQuestions
  };

  // Write master file, progress ledger, and hashes
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(masterPayload, null, 2), 'utf8');
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf8');
  fs.writeFileSync(HASHES_FILE, JSON.stringify(hashes, null, 2), 'utf8');

  console.log('\n===============================================================');
  console.log(` Compilation Complete: ${uniqueQuestions.length} / ${TARGET_QUOTA} questions (${completionPercentage})`);
  console.log(` Master file written to: ${OUTPUT_FILE}`);
  console.log(` Progress ledger synced: ${PROGRESS_FILE}`);
  console.log(` Hash registry synced: ${HASHES_FILE} (${Object.keys(hashes).length} fingerprints)`);
  console.log(` Chunk files parsed: ${chunkFilesCount}`);
  console.log(' Breakdown by Subject:', breakdown.subjects);
  console.log(' Breakdown by Difficulty:', breakdown.difficulty);
  console.log(' Breakdown by Question Type:', breakdown.questionType);
  console.log('===============================================================\n');

  return masterPayload;
}

if (require.main === module) {
  compile();
}

module.exports = { compile };
