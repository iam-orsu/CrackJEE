/**
 * CrackNEET Master Question Compiler & Validator
 * Reads all chunk files from data/neet/botany, zoology, physics, chemistry.
 * Every question goes through the same gatekeeper (auditQuestion) the chunk audit uses, so invalid questions,
 * off-syllabus topics and content duplicates never reach neet_master_questions.json.
 * Writes the master file, the progress ledger and the hash ledger, all derived from the accepted questions.
 */

const fs = require('fs');
const path = require('path');
const { auditQuestion } = require('./neet_gatekeeper');

const TARGET_QUOTA = 17940;
const NEET_DIR = __dirname;
const SUBJECT_DIRS = ['botany', 'zoology', 'physics', 'chemistry'];
const OUTPUT_FILE = path.join(NEET_DIR, 'neet_master_questions.json');
const REGISTRY_DIR = path.join(NEET_DIR, 'registry');
const TOPICS_FILE = path.join(REGISTRY_DIR, 'neet_topics.json');
const PROGRESS_FILE = path.join(REGISTRY_DIR, 'neet_progress.json');
const HASHES_FILE = path.join(REGISTRY_DIR, 'neet_hashes.json');
const MAX_REJECTIONS_SHOWN = 20;

function compile() {
  console.log('===============================================================');
  console.log('   CrackNEET Master Question Compiler & Audit Report');
  console.log('===============================================================\n');

  const topicsData = JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf8'));

  // Ledger skeleton from the official topic list; counts are filled in from the accepted questions below
  const progress = {
    lastUpdated: new Date().toISOString(),
    totalQuestionsCompleted: 0,
    targetQuota: TARGET_QUOTA,
    subjects: {},
  };
  for (const [subjName, sObj] of Object.entries(topicsData.subjects)) {
    progress.subjects[subjName] = { completedQuestions: 0, topics: {} };
    for (const t of sObj.topics) {
      progress.subjects[subjName].topics[t.name] = {
        completedChunks: 0,
        totalQuestions: 0,
        beginner: 0,
        intermediate: 0,
        advanced: 0,
        status: 'PENDING',
      };
    }
  }

  const hashes = {};
  const acceptedById = new Map();
  const rejections = [];
  const seenIds = new Set();
  let totalRawQuestions = 0;
  let chunkFilesCount = 0;

  for (const subDir of SUBJECT_DIRS) {
    const dirPath = path.join(NEET_DIR, subDir);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.json'));
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
        if (!q || !q.id) {
          rejections.push({ id: 'MISSING_ID', file, reason: 'Question has no id' });
          continue;
        }
        if (seenIds.has(q.id)) {
          rejections.push({ id: q.id, file, reason: 'Duplicate id (kept the first occurrence)' });
          continue;
        }
        seenIds.add(q.id);

        // The same gatekeeper as the chunk audit: schema, topic, options, answer, LaTeX, trivia and duplicate content
        const res = auditQuestion(q, hashes);
        if (!res.valid) {
          rejections.push({ id: q.id, file, reason: res.reason });
          continue;
        }
        hashes[res.hash] = q.id;
        acceptedById.set(q.id, q);

        const tProg = progress.subjects[q.subject]?.topics[q.topic];
        if (tProg) {
          tProg.totalQuestions++;
          if (q.difficulty === 'beginner') tProg.beginner++;
          else if (q.difficulty === 'intermediate') tProg.intermediate++;
          else if (q.difficulty === 'advanced') tProg.advanced++;
          tProg.status = tProg.totalQuestions >= 230 ? 'COMPLETED' : 'IN_PROGRESS';
        }
      }
    }
  }

  // Ledger totals from accepted questions only
  let grandTotal = 0;
  for (const sName of Object.keys(progress.subjects)) {
    const sObj = progress.subjects[sName];
    sObj.completedQuestions = Object.values(sObj.topics).reduce((sum, t) => sum + t.totalQuestions, 0);
    grandTotal += sObj.completedQuestions;
  }
  progress.totalQuestionsCompleted = grandTotal;

  const uniqueQuestions = Array.from(acceptedById.values());
  const completionPercentage = ((uniqueQuestions.length / TARGET_QUOTA) * 100).toFixed(2) + '%';

  const breakdown = {
    subjects: {},
    difficulty: { beginner: 0, intermediate: 0, advanced: 0 },
    questionType: { mcq_single: 0 },
  };
  for (const q of uniqueQuestions) {
    breakdown.subjects[q.subject] = (breakdown.subjects[q.subject] || 0) + 1;
    breakdown.difficulty[q.difficulty] = (breakdown.difficulty[q.difficulty] || 0) + 1;
    breakdown.questionType[q.questionType] = (breakdown.questionType[q.questionType] || 0) + 1;
  }

  const masterPayload = {
    generatedAt: new Date().toISOString(),
    totalQuestions: uniqueQuestions.length,
    targetQuota: TARGET_QUOTA,
    completionPercentage,
    breakdown,
    questions: uniqueQuestions,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(masterPayload, null, 2), 'utf8');
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf8');
  fs.writeFileSync(HASHES_FILE, JSON.stringify(hashes, null, 2), 'utf8');

  console.log('\n===============================================================');
  console.log(` Compilation Complete: ${uniqueQuestions.length} / ${TARGET_QUOTA} questions (${completionPercentage})`);
  console.log(` Raw questions read: ${totalRawQuestions} from ${chunkFilesCount} chunk files`);
  console.log(` Rejected by the gatekeeper: ${rejections.length}`);
  for (const r of rejections.slice(0, MAX_REJECTIONS_SHOWN)) {
    console.log(`   - ${r.id} (${r.file || ''}): ${r.reason}`);
  }
  if (rejections.length > MAX_REJECTIONS_SHOWN) {
    console.log(`   ... and ${rejections.length - MAX_REJECTIONS_SHOWN} more`);
  }
  console.log(` Master file written to: ${OUTPUT_FILE}`);
  console.log(` Progress ledger synced: ${PROGRESS_FILE}`);
  console.log(` Hash registry synced: ${HASHES_FILE} (${Object.keys(hashes).length} fingerprints)`);
  console.log(' Breakdown by Subject:', breakdown.subjects);
  console.log(' Breakdown by Difficulty:', breakdown.difficulty);
  console.log('===============================================================\n');

  return masterPayload;
}

if (require.main === module) {
  compile();
}

module.exports = { compile };
