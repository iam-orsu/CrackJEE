import type {
  DiagramTemplate,
  Difficulty,
  ExamType,
  GeneratedQuestion,
  QuestionType,
  Subject,
} from '../types/index';
import { buildDifficultySpec, DIAGRAM_SPEC, parseRawQuestion } from './deepseekPrompts';

export const ALLOWED_DIAGRAM_TEMPLATES = new Set<string>([
  'inclined_plane',
  'simple_circuit',
  'lens_mirror',
  'energy_profile',
  'coordinate_geometry',
  'projectile_motion',
  'pulley_system',
  'wave_diagram',
  'capacitor_field',
  'pv_diagram',
  'triangle',
  'circle_geometry',
  'conic_section',
  'argand_plane',
  'molecular_geometry',
  'mo_diagram',
  'crystal_structure',
  'electrochemical_cell',
  'organic_structure',
]);

/** Checks that unescaped `$` math delimiters occur in balanced pairs (ignoring `$$` blocks & `\$`). */
export function hasBalancedMathDelimiters(text: string): boolean {
  let inDisplay = false;
  let inInline = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    if (ch === '\\') {
      i++; // skip escaped char (e.g. \$)
      continue;
    }
    if (ch !== '$') continue;
    if (text[i + 1] === '$' && !inInline) {
      inDisplay = !inDisplay;
      i++;
    } else if (!inDisplay) {
      inInline = !inInline;
    } else {
      return false;
    }
  }
  return !inDisplay && !inInline;
}

/** Validates diagram payload against the 19 supported templates and finite numeric bounds. */
export function isValidDiagramTemplate(diagram: unknown): diagram is DiagramTemplate | null {
  if (diagram === null || diagram === undefined) return true;
  if (typeof diagram !== 'object' || Array.isArray(diagram)) return false;

  const obj = diagram as { template?: unknown; params?: unknown };
  if (typeof obj.template !== 'string' || !ALLOWED_DIAGRAM_TEMPLATES.has(obj.template)) return false;
  if (!obj.params || typeof obj.params !== 'object' || Array.isArray(obj.params)) return false;

  const p = obj.params as Record<string, unknown>;
  if (obj.template === 'organic_structure') {
    return typeof p.smiles === 'string' && p.smiles.trim().length > 0;
  }
  if (obj.template === 'mo_diagram') {
    return typeof p.molecule === 'string' && p.molecule.trim().length > 0;
  }
  if (obj.template === 'inclined_plane' || obj.template === 'projectile_motion') {
    if (p.angle_deg !== undefined) {
      const deg = Number(p.angle_deg);
      if (!Number.isFinite(deg) || deg <= 0 || deg >= 89) return false;
    }
  }
  if (obj.template === 'lens_mirror') {
    if (p.focal_length !== undefined && (!Number.isFinite(Number(p.focal_length)) || Number(p.focal_length) === 0)) {
      return false;
    }
    if (p.object_distance !== undefined && (!Number.isFinite(Number(p.object_distance)) || Number(p.object_distance) <= 0)) {
      return false;
    }
  }
  if (obj.template === 'triangle' && p.angles && typeof p.angles === 'object') {
    const a = p.angles as { A?: unknown; B?: unknown; C?: unknown };
    const vals = [Number(a.A), Number(a.B), Number(a.C)];
    if (vals.some((v) => !Number.isFinite(v) || v <= 0) || vals.reduce((s, v) => s + v, 0) <= 0) {
      return false;
    }
  }
  return true;
}

/** Canonicalizes an answer string (`"B"`, `"A,C"`, or `"42"`) for comparison. */
export function normalizeFacultyAnswer(questionType: QuestionType, raw: string): string {
  const trimmed = raw.trim().toUpperCase();
  if (questionType === 'integer') {
    const n = parseInt(trimmed, 10);
    return Number.isNaN(n) ? '' : String(n);
  }
  if (questionType === 'mcq_multi') {
    const letters = [...new Set(
      trimmed.split(',').map((s) => s.trim().charAt(0)).filter((c) => ['A', 'B', 'C', 'D'].includes(c)),
    )].sort();
    return letters.join(',');
  }
  const letter = trimmed.charAt(0);
  return ['A', 'B', 'C', 'D'].includes(letter) ? letter : '';
}

export function answersMatch(questionType: QuestionType, generated: string, solved: string): boolean {
  const left = normalizeFacultyAnswer(questionType, generated);
  const right = normalizeFacultyAnswer(questionType, solved);
  return left.length > 0 && left === right;
}

/** Deterministic validation gate run before a generated question enters a faculty paper. */
export function validateFacultyQuestion(
  raw: Record<string, unknown>,
  questionType: QuestionType,
  examType: ExamType,
): GeneratedQuestion {
  const parsed = parseRawQuestion(raw, questionType, examType, true);

  if (!hasBalancedMathDelimiters(parsed.question)) {
    throw new Error('Unbalanced LaTeX $ delimiters in question');
  }
  if (!hasBalancedMathDelimiters(parsed.answer_explanation)) {
    throw new Error('Unbalanced LaTeX $ delimiters in explanation');
  }
  for (const opt of parsed.options) {
    if (!hasBalancedMathDelimiters(opt)) {
      throw new Error('Unbalanced LaTeX $ delimiters in option');
    }
  }
  if (!isValidDiagramTemplate(parsed.diagram)) {
    throw new Error('Invalid diagram template or parameters');
  }

  return parsed;
}

function buildNeetSubjectNote(subject: Subject): string {
  if (subject === 'Botany' || subject === 'Zoology') {
    return `NEET-UG NCERT Biology rigor: test subtle NCERT facts, conceptual mechanisms, assertion-reason, or Statement I & II style reasoning without trivial textbook memorization.`;
  }
  return `NEET-UG level: clean NCERT-grounded multi-concept application solvable in ~60-90 seconds with realistic numerical distractors.`;
}

function buildExamCognitiveGuide(examType: 'Main' | 'Advanced' | 'NEET', subject: Subject): string {
  if (examType === 'Advanced') {
    return `COGNITIVE STANDARD — IIT JEE ADVANCED ONLY:
- Multi-concept cross-topic synthesis (3+ reasoning steps); cannot be solved by rote formula substitution.
- First-principles derivations, variable quantities / calculus / symmetry / limiting & boundary-case analysis.
- Engineered distractors reflecting genuine theoretical misconceptions (especially for multi-correct facets).
- STRICTLY NO school-level, NCERT back-exercise, or easy JEE Main direct-substitution questions.`;
  }
  if (examType === 'NEET') {
    return `${buildNeetSubjectNote(subject)}
- Strictly aligned to NMC/NTA Rationalized NCERT Class 11 & 12 scope — never copy NCERT textbook wording verbatim.`;
  }
  return `COGNITIVE STANDARD — NTA JEE MAIN COMPETITIVE:
- 2–3 step applied analytical problem solving (speed + conceptual precision + realistic algebraic/sign/unit distractors).
- Aligned strictly to Rationalized NCERT syllabus (no deleted chapters).
- STRICTLY NO school-board definitions, memory-only statements, or copied/paraphrased NCERT textbook exercises.`;
}

/**
 * Solution-first prompt for weekly printable exams across JEE Main, JEE Advanced, and NEET.
 * Forces step-by-step derivation BEFORE creating options and distractors.
 */
export function buildFacultyGenerationPrompt(params: {
  examType: 'Main' | 'Advanced' | 'NEET';
  subject: Subject;
  topic: string;
  difficulty: Difficulty;
  questionType: QuestionType;
  targetLetter: string;
}): string {
  const { examType, subject, topic, difficulty, questionType, targetLetter } = params;
  const effectiveExam: ExamType = examType === 'NEET' ? 'NEET' : examType;
  const effectiveDifficulty: Difficulty = examType === 'Advanced' ? 'advanced' : difficulty;
  const difficultySpec = buildDifficultySpec(effectiveDifficulty, effectiveExam);
  const cognitiveGuide = buildExamCognitiveGuide(examType, subject);

  const examLabel = examType === 'NEET'
    ? 'NEET-UG medical entrance exam'
    : `JEE ${examType} competitive entrance exam`;

  const answerRange = examType === 'Advanced' ? '0 to 9' : '0 to 99';

  const typeTask = questionType === 'mcq_multi'
    ? `- Multi-correct MCQ: 1 to 3 correct options (NEVER 0, NEVER all 4), returned sorted in "correct_answers" (e.g. ["A", "C"]).`
    : questionType === 'integer'
      ? `- Integer type: options MUST be [] and "correct_answer" must be an exact non-negative integer (${answerRange}). Design numbers so it resolves cleanly to an integer.`
      : `- Single-correct MCQ: exactly 4 distinct options; place the exact correct answer at option "${targetLetter}".`;

  const formatExample = questionType === 'mcq_multi'
    ? `"correct_answers": ["A", "C"]`
    : `"correct_answer": "${questionType === 'integer' ? '7' : targetLetter}"`;

  return `
<context>
  <role>Senior faculty exam setter writing a weekly printable competitive test</role>
  <exam_type>${examLabel}</exam_type>
  <subject>${subject}</subject>
  <topic>${topic}</topic>
  <question_type>${questionType}</question_type>
</context>

<difficulty_requirement>
  ${difficultySpec}
  ${cognitiveGuide}
  IMPORTANT: Solve the problem completely FIRST inside "working_steps" before writing options or selecting "correct_answer". Every number, sign, and unit must check out cleanly.
</difficulty_requirement>

<task>
  Create ONE original, unambiguous ${examLabel} question on "${subject} — ${topic}".
  ${typeTask}
</task>

<format>
  Return ONLY valid JSON (no markdown fences, no commentary) with keys in this exact order:
  {
    "working_steps": "Complete algebraic/conceptual derivation computing the exact result first.",
    "computed_answer": "Exact value or option result verified from working_steps.",
    "question": "Clear, self-contained question stem with all given constants/conditions.",
    "question_type": "${questionType}",
    "options": ${questionType === 'integer' ? '[]' : '["option A", "option B", "option C", "option D"]'},
    ${formatExample},
    "answer_explanation": "Clean, student-ready step-by-step solution matching computed_answer.",
    "diagram": null
  }
${DIAGRAM_SPEC}
</format>

<constraints>
  - Neutral exam wording only (never mention any school, college, institute, or brand name)
  - Plain option text ONLY — do NOT prefix options with "A)", "(A)", "1.", etc.
  - ALL math/chemical formulas in valid balanced $...$ delimiters (escape dollar signs only as LaTeX pairs)
  - For single-correct: all 4 options must be mathematically & conceptually distinct
  - diagram must be null or a valid template from the list above
</constraints>`;
}

/** Blind verification prompt: deliberately omits `correct_answer` to avoid confirmation bias. */
export function buildFacultyBlindVerifyPrompt(q: {
  examType: 'Main' | 'Advanced' | 'NEET';
  subject: Subject;
  topic: string;
  questionType: QuestionType;
  questionText: string;
  options: string[];
  explanation: string;
}): string {
  const optionsBlock = q.options.length > 0
    ? q.options.map((opt, idx) => `  ${['A', 'B', 'C', 'D'][idx]}) ${opt}`).join('\n')
    : '  (Integer-type question — no options; solve for the exact non-negative integer.)';

  const expectedFormatHint = q.questionType === 'mcq_multi'
    ? 'sorted comma-separated letters e.g. "A,C"'
    : q.questionType === 'integer'
      ? 'exact non-negative integer string e.g. "42"'
      : 'single capital letter "A", "B", "C", or "D"';

  return `
<role>Independent senior exam moderator performing blind QA before printing</role>
<task>
  Solve the ${q.examType} (${q.subject} — ${q.topic}) question below completely from scratch WITHOUT seeing any answer key.
  Then verify:
  1. The question is completely unambiguous with all necessary data given.
  2. For single-correct MCQ, EXACTLY ONE listed option matches your computed result.
  3. The draft solution below aligns with your independent solution and reaches the same answer.
</task>

<question>
${q.questionText}
${optionsBlock}
</question>

<draft_solution>
${q.explanation}
</draft_solution>

<format>
  Return ONLY valid JSON:
  {
    "solved_answer": ${JSON.stringify(expectedFormatHint)},
    "is_unambiguous": true,
    "explanation_consistent": true,
    "note": "Brief verification note"
  }
</format>`;
}
