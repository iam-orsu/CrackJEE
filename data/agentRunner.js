/**
 * agentRunner.js — Swarm Orchestrator & Task Dispatcher for data/
 * 
 * Coordinates generation across the 91 official syllabus topics.
 * Ensures crash-proof resumption by checking data/registry/progress.json.
 */

const fs = require('fs');
const path = require('path');
const { auditChunkFile, VALID_TOPICS } = require('./gatekeeper');

const DATA_DIR = path.resolve(__dirname);
const REGISTRY_DIR = path.join(DATA_DIR, 'registry');
const PROGRESS_FILE = path.join(REGISTRY_DIR, 'progress.json');
const TOPICS_FILE = path.join(REGISTRY_DIR, 'topics.json');

function getNextPendingTopic(subject) {
  const progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  const topicsData = JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf8'));

  const sProgress = progress.subjects[subject];
  if (!sProgress) return null;

  for (const [tName, tData] of Object.entries(sProgress.topics)) {
    const target = topicsData.subjects[subject].targetPerTopic;
    if (tData.totalQuestions < target) {
      return {
        subject,
        topic: tName,
        completed: tData.totalQuestions,
        target: target,
        remaining: target - tData.totalQuestions,
        currentChunkIndex: Math.floor(tData.totalQuestions / 55) + 1
      };
    }
  }

  return null; // All completed for this subject
}

function getOverallProgress() {
  const progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  const topicsData = JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf8'));

  const stats = {
    totalTarget: topicsData.metadata.totalTarget,
    totalCompleted: progress.totalQuestionsCompleted,
    percentage: ((progress.totalQuestionsCompleted / topicsData.metadata.totalTarget) * 100).toFixed(2) + '%',
    subjects: {}
  };

  for (const [subj, sData] of Object.entries(progress.subjects)) {
    const sTarget = topicsData.subjects[subj].totalTarget;
    stats.subjects[subj] = {
      completed: sData.completedQuestions,
      target: sTarget,
      percentage: ((sData.completedQuestions / sTarget) * 100).toFixed(2) + '%'
    };
  }

  return stats;
}

module.exports = {
  getNextPendingTopic,
  getOverallProgress
};
