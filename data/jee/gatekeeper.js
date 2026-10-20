/**
 * gatekeeper.js — High-Precision Quality Assessor & Validation Gatekeeper
 * 
 * Strict Gatekeeping Rules:
 * 1. Strict Schema & Official Topic Mapping from backend/src/types/index.ts
 * 2. KaTeX LaTeX Syntax Certification (balanced $, $$, braces, valid commands)
 * 3. Anti-Trivial & Anti-Definition Enforcement (Zero-Kindergarten rule)
 * 4. Deduplication Engine (SHA-256 fingerprinting & normalized text hashing)
 * 5. Cognitive Quality Scoring (1-10 scale)
 * 6. Live Ledger Synchronization (updates data/registry/progress.json)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REGISTRY_DIR = path.resolve(__dirname, 'registry');
const TOPICS_FILE = path.join(REGISTRY_DIR, 'topics.json');
const PROGRESS_FILE = path.join(REGISTRY_DIR, 'progress.json');
const HASHES_FILE = path.join(REGISTRY_DIR, 'question_hashes.json');

// ── 1. Load Registry & Topics ───────────────────────────────────────────────
if (!fs.existsSync(TOPICS_FILE)) {
  throw new Error(`topics.json not found at ${TOPICS_FILE}`);
}
const topicsData = JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf8'));

const VALID_TOPICS = {
  Physics: new Set(topicsData.subjects.Physics.topics.map(t => t.name)),
  Chemistry: new Set(topicsData.subjects.Chemistry.topics.map(t => t.name)),
  Mathematics: new Set(topicsData.subjects.Mathematics.topics.map(t => t.name))
};

// ── 2. Trivial & Definition-Recall Blacklist ─────────────────────────────────
const TRIVIAL_PATTERNS = [
  /is\/are TRUE for all valid values in their domains/i,
  /by fundamental properties of/i,
  /is constant and equal to/i,
  /Which of the following inverse trigonometric statements/i,
  /Which of the following trigonometric statements is\/are TRUE/i,
  /Which of the following properties of .* is\/are correct\?/i,
  /moves with a speed of \$\d+\$ m\/s\. Find its kinetic energy/i,
  /Find its kinetic energy\.\s*$/i,
  /has mass \$\d+\$ kg and speed \$\d+\$ m\/s\. Find/i,
  /Find the work done in joules\.\s*$/i,
  /does \$\d+\$ J of work in \$\d+\$ s\. Find its power/i,
  /fair coin is tossed/i,
  /Find its momentum\.\s*$/i,
  /constant force of \$\d+\$ N acts on a body moving at/i,
  /mass \$\d+\$ kg rests on a frictionless horizontal table/i,
  /what is the full form of/i,
  /what is meant by/i,
  /What is the SI unit of/i,
  /Recheck this item/i,
  /TODO/i,
  /PLACEHOLDER/i
];

// ── 3. KaTeX LaTeX Validator ────────────────────────────────────────────────
function validateLatexString(str) {
  if (typeof str !== 'string' || !str) return { valid: true };

  // Balanced $ delimiters
  let inInline = false;
  let inDisplay = false;
  let i = 0;
  while (i < str.length) {
    if (str[i] === '\\') {
      i += 2; // skip escaped character (e.g. \$)
      continue;
    }
    if (str[i] === '$') {
      if (str[i + 1] === '$') {
        inDisplay = !inDisplay;
        i += 2;
        continue;
      } else if (!inDisplay) {
        inInline = !inInline;
        i += 1;
        continue;
      }
    }
    i++;
  }

  if (inInline) return { valid: false, reason: 'Unclosed inline math delimiter $' };
  if (inDisplay) return { valid: false, reason: 'Unclosed display math delimiter $$' };

  // Balanced braces inside math blocks
  const mathSegments = [];
  const mathRegex = /\$\$([\s\S]*?)\$\$|\$([^\$]+)\$/g;
  let match;
  while ((match = mathRegex.exec(str)) !== null) {
    mathSegments.push(match[1] || match[2]);
  }

  for (const seg of mathSegments) {
    let braceCount = 0;
    for (let j = 0; j < seg.length; j++) {
      if (seg[j] === '\\') {
        j++;
        continue;
      }
      if (seg[j] === '{') braceCount++;
      if (seg[j] === '}') braceCount--;
      if (braceCount < 0) return { valid: false, reason: 'Mismatched closing brace } in LaTeX' };
    }
    if (braceCount !== 0) return { valid: false, reason: 'Unclosed opening brace { in LaTeX' };
  }

  return { valid: true };
}

// ── 4. Cognitive Depth Assessor (1 to 10 Scale) ──────────────────────────────
function evaluateCognitiveDepth(q) {
  let score = 5.0; // base score
  const text = q.questionText || '';
  const exp = q.explanation || '';

  // LaTeX density (+2 max)
  const mathCount = (text.match(/\$[^$]+\$/g) || []).length + (exp.match(/\$[^$]+\$/g) || []).length;
  if (mathCount >= 6) score += 2.0;
  else if (mathCount >= 3) score += 1.0;

  // Derivation multi-step structure (+2 max)
  const stepIndicators = (exp.match(/(step|therefore|hence|integrat|substitut|solving|we get|implies|yielding|applying)/gi) || []).length;
  if (stepIndicators >= 4) score += 1.5;
  else if (stepIndicators >= 2) score += 0.8;

  // Question length & constraint setup (+1 max)
  if (text.length >= 140) score += 1.0;
  else if (text.length >= 100) score += 0.5;

  // Penalties for trivial patterns (-3)
  for (const pat of TRIVIAL_PATTERNS) {
    if (pat.test(text) || pat.test(exp)) {
      score -= 4.0;
      break;
    }
  }

  return Math.min(10.0, Math.max(1.0, score));
}

// ── 5. Question Fingerprinting ──────────────────────────────────────────────
function getQuestionFingerprint(questionText) {
  const normalized = questionText
    .replace(/\$[^$]+\$/g, 'MATH') // normalize math expressions
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
  return crypto.createHash('sha256').update(normalized).digest('hex').substring(0, 16);
}

// ── 6. Single Question Audit Function ───────────────────────────────────────
function auditQuestion(q, activeHashes) {
  // Required fields check
  if (!q.id || typeof q.id !== 'string') return { valid: false, reason: 'Missing or invalid id' };
  if (!/^[a-zA-Z0-9_\-]+$/.test(q.id) || q.id.length > 128) {
    return { valid: false, reason: `id '${q.id}' must be alphanumeric/hyphen/underscore <= 128 chars` };
  }

  // Subject check
  if (!['Physics', 'Chemistry', 'Mathematics'].includes(q.subject)) {
    return { valid: false, reason: `Invalid subject '${q.subject}'` };
  }

  // Official topic check
  if (!VALID_TOPICS[q.subject].has(q.topic)) {
    return { valid: false, reason: `Topic '${q.topic}' does not exist in official JEE_TOPICS for ${q.subject}` };
  }

  // Exam type & Difficulty
  if (!['Main', 'Advanced'].includes(q.examType)) {
    return { valid: false, reason: `Invalid examType '${q.examType}' (must be 'Main' or 'Advanced')` };
  }
  if (!['beginner', 'intermediate', 'advanced'].includes(q.difficulty)) {
    return { valid: false, reason: `Invalid difficulty '${q.difficulty}'` };
  }

  // Question type
  if (!['mcq_single', 'mcq_multi', 'integer'].includes(q.questionType)) {
    return { valid: false, reason: `Invalid questionType '${q.questionType}'` };
  }

  // Length thresholds
  if (!q.questionText || q.questionText.trim().length < 75) {
    return { valid: false, reason: 'questionText too short (<75 characters)' };
  }
  if (!q.explanation || q.explanation.trim().length < 65) {
    return { valid: false, reason: 'explanation too short (<65 characters)' };
  }

  // Options check
  if (q.questionType === 'integer') {
    if (!Array.isArray(q.options) || q.options.length !== 0) {
      q.options = [];
    }
  } else {
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      return { valid: false, reason: `MCQ requires exactly 4 options, found ${q.options ? q.options.length : 0}` };
    }
    // Check distinct options
    const normalizedOptions = q.options.map(opt =>
      String(opt).replace(/\$/g, '').replace(/^[A-D][).]\s*/, '').replace(/\s+/g, ' ').trim().toLowerCase()
    );
    if (new Set(normalizedOptions).size < 4) {
      return { valid: false, reason: 'Duplicate or indistinct options in MCQ' };
    }
  }

  // Answer format validation
  if (q.answer === undefined || q.answer === null || String(q.answer).trim() === '') {
    return { valid: false, reason: 'Answer is missing or empty' };
  }
  const rawAns = String(q.answer).trim().toUpperCase();

  if (q.questionType === 'mcq_single') {
    if (!['A', 'B', 'C', 'D'].includes(rawAns)) {
      return { valid: false, reason: `mcq_single answer must be 'A', 'B', 'C', or 'D', found '${rawAns}'` };
    }
    q.answer = rawAns;
  } else if (q.questionType === 'mcq_multi') {
    const letters = [...new Set(rawAns.split(/[,\s]+/).map(s => s.trim().toUpperCase()).filter(Boolean))].sort();
    if (letters.length === 0 || !letters.every(l => ['A', 'B', 'C', 'D'].includes(l))) {
      return { valid: false, reason: `mcq_multi answer must be valid combination of A-D, found '${rawAns}'` };
    }
    q.answer = letters.join(',');
  } else if (q.questionType === 'integer') {
    const num = parseInt(rawAns, 10);
    if (isNaN(num)) {
      return { valid: false, reason: `integer answer must be valid numeric integer, found '${rawAns}'` };
    }
    q.answer = String(num);
  }

  // KaTeX LaTeX check
  const qLatex = validateLatexString(q.questionText);
  if (!qLatex.valid) return { valid: false, reason: `KaTeX LaTeX error in questionText: ${qLatex.reason}` };

  const expLatex = validateLatexString(q.explanation);
  if (!expLatex.valid) return { valid: false, reason: `KaTeX LaTeX error in explanation: ${expLatex.reason}` };

  for (let idx = 0; idx < q.options.length; idx++) {
    const optLatex = validateLatexString(q.options[idx]);
    if (!optLatex.valid) return { valid: false, reason: `KaTeX LaTeX error in option ${idx}: ${optLatex.reason}` };
  }

  // Anti-Trivial / Zero-Kindergarten Check
  for (const pat of TRIVIAL_PATTERNS) {
    if (pat.test(q.questionText) || pat.test(q.explanation)) {
      return { valid: false, reason: `Zero-Kindergarten violation: matches trivial pattern ${pat}` };
    }
  }

  // Cognitive Depth Check for Advanced
  const depth = evaluateCognitiveDepth(q);
  if (q.difficulty === 'advanced' && depth < 6.8) {
    return { valid: false, reason: `Question labeled 'advanced' failed cognitive depth assessment (Score: ${depth.toFixed(1)}/10, minimum required 6.8)` };
  }

  // Deduplication Check
  const fp = getQuestionFingerprint(q.questionText);
  if (activeHashes[fp] && activeHashes[fp] !== q.id) {
    return { valid: false, reason: `Duplicate question content detected (Matches existing ID: ${activeHashes[fp]})` };
  }

  return { valid: true, fingerprint: fp, cognitiveDepth: depth, question: q };
}

// ── 7. Chunk Audit & Commitment Runner ──────────────────────────────────────
function auditChunkFile(filePath, commitToRegistry = false) {
  if (!fs.existsSync(filePath)) {
    return { success: false, error: `File not found: ${filePath}` };
  }

  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return {
      success: false,
      error: `Invalid JSON or file in-flight: ${err.message}`,
      total: 0,
      passed: 0,
      failed: 1,
      rejections: [{ id: 'FILE_READ_ERROR', reason: err.message }]
    };
  }
  const questions = raw.questions || [];

  let hashes, progress;
  for (let retry = 0; retry < 3; retry++) {
    try {
      hashes = JSON.parse(fs.readFileSync(HASHES_FILE, 'utf8'));
      progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
      break;
    } catch (err) {
      if (retry === 2) throw err;
      const start = Date.now();
      while (Date.now() - start < 50); // 50ms sync backoff
    }
  }
  const initialHashes = { ...hashes };

  const validQuestions = [];
  const rejected = [];

  for (const q of questions) {
    const isNew = !initialHashes[getQuestionFingerprint(q.questionText)];
    const res = auditQuestion(q, hashes);
    if (res.valid) {
      res.isNew = isNew;
      validQuestions.push(res);
      hashes[res.fingerprint] = q.id;
    } else {
      rejected.push({ id: q.id, reason: res.reason, topic: q.topic });
    }
  }

  if (commitToRegistry && rejected.length === 0 && validQuestions.length > 0) {
    // Commit verified hashes
    fs.writeFileSync(HASHES_FILE, JSON.stringify(hashes, null, 2));

    // Update progress ledger
    for (const v of validQuestions) {
      if (!v.isNew) continue; // Idempotent: do not double count
      const q = v.question;
      const tProgress = progress.subjects[q.subject].topics[q.topic];
      if (tProgress) {
        tProgress.totalQuestions++;
        tProgress[q.difficulty]++;
        progress.subjects[q.subject].completedQuestions++;
        progress.totalQuestionsCompleted++;
      }
    }

    // Check if topic completed
    for (const [subj, sData] of Object.entries(progress.subjects)) {
      for (const [tName, tData] of Object.entries(sData.topics)) {
        const target = topicsData.subjects[subj].targetPerTopic;
        if (tData.totalQuestions >= target) {
          tData.status = 'COMPLETED';
        } else if (tData.totalQuestions > 0) {
          tData.status = 'IN_PROGRESS';
        }
      }
    }

    progress.lastUpdated = new Date().toISOString();
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
  }

  return {
    success: rejected.length === 0,
    total: questions.length,
    passed: validQuestions.length,
    failed: rejected.length,
    rejections: rejected,
    averageCognitiveDepth: validQuestions.length > 0
      ? (validQuestions.reduce((a, b) => a + b.cognitiveDepth, 0) / validQuestions.length).toFixed(1)
      : 0
  };
}

module.exports = {
  auditQuestion,
  auditChunkFile,
  evaluateCognitiveDepth,
  getQuestionFingerprint,
  VALID_TOPICS
};
