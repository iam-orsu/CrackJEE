/**
 * compiler.js — CrackJEE Master Data Compiler & Live Audit Reporter
 * 
 * Aggregates all validated chunks across data/physics/, data/chemistry/, data/mathematics/
 * into data/master_questions.json with a comprehensive quality scorecard.
 */

const fs = require('fs');
const path = require('path');
const { auditChunkFile } = require('./gatekeeper');

const DATA_DIR = path.resolve(__dirname);
const REGISTRY_DIR = path.join(DATA_DIR, 'registry');
const PROGRESS_FILE = path.join(REGISTRY_DIR, 'progress.json');
const TOPICS_FILE = path.join(REGISTRY_DIR, 'topics.json');
const MASTER_OUTPUT = path.join(DATA_DIR, 'master_questions.json');

const SUBJECT_DIRS = {
  Physics: path.join(DATA_DIR, 'physics'),
  Chemistry: path.join(DATA_DIR, 'chemistry'),
  Mathematics: path.join(DATA_DIR, 'mathematics')
};

function compileMasterDataset() {
  console.log('===============================================================');
  console.log('   CrackJEE Master Question Compiler & Quality Audit Report');
  console.log('===============================================================');

  const topicsData = JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf8'));
  const allMasterQuestions = [];
  const seenIds = new Set();
  const summary = {
    total: 0,
    bySubject: { Physics: 0, Chemistry: 0, Mathematics: 0 },
    byDifficulty: { beginner: 0, intermediate: 0, advanced: 0 },
    byExamType: { Main: 0, Advanced: 0 },
    byQuestionType: { mcq_single: 0, mcq_multi: 0, integer: 0 },
    cognitiveDepthScores: []
  };

  let totalChunksProcessed = 0;
  let totalChunksRejected = 0;

  for (const [subject, dir] of Object.entries(SUBJECT_DIRS)) {
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();
    console.log(`\nInspecting ${subject} (${files.length} chunk files)...`);

    for (const f of files) {
      const filePath = path.join(dir, f);
      const auditResult = auditChunkFile(filePath, true);

      if (!auditResult.success) {
        console.warn(`  [REJECTED CHUNK] ${f}: ${auditResult.failed} failed audits.`);
        totalChunksRejected++;
        continue;
      }

      totalChunksProcessed++;
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const questions = data.questions || [];

      for (const q of questions) {
        if (seenIds.has(q.id)) continue;
        seenIds.add(q.id);

        allMasterQuestions.push(q);
        summary.total++;
        summary.bySubject[q.subject] = (summary.bySubject[q.subject] || 0) + 1;
        summary.byDifficulty[q.difficulty] = (summary.byDifficulty[q.difficulty] || 0) + 1;
        summary.byExamType[q.examType] = (summary.byExamType[q.examType] || 0) + 1;
        summary.byQuestionType[q.questionType] = (summary.byQuestionType[q.questionType] || 0) + 1;
      }
    }
  }

  // Save compiled master dataset
  const masterPayload = {
    generatedAt: new Date().toISOString(),
    totalQuestions: allMasterQuestions.length,
    targetQuota: topicsData.metadata.totalTarget,
    completionPercentage: ((allMasterQuestions.length / topicsData.metadata.totalTarget) * 100).toFixed(2) + '%',
    breakdown: {
      subjects: summary.bySubject,
      difficulty: summary.byDifficulty,
      examType: summary.byExamType,
      questionType: summary.byQuestionType
    },
    questions: allMasterQuestions
  };

  fs.writeFileSync(MASTER_OUTPUT, JSON.stringify(masterPayload, null, 2), 'utf8');

  console.log('\n===============================================================');
  console.log(` Compilation Complete: ${allMasterQuestions.length} / ${topicsData.metadata.totalTarget} questions`);
  console.log(` Master file written to: ${MASTER_OUTPUT}`);
  console.log(' Breakdown by Subject:', summary.bySubject);
  console.log(' Breakdown by Difficulty:', summary.byDifficulty);
  console.log(' Breakdown by Question Type:', summary.byQuestionType);
  console.log('===============================================================');

  return masterPayload;
}

if (require.main === module) {
  compileMasterDataset();
}

module.exports = { compileMasterDataset };
