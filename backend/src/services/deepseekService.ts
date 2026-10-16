import OpenAI from 'openai';
import type { GeneratedQuestion, Difficulty, ExamType, Subject, StudentClass, QuestionType, DiagramTemplate } from '../types/index';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
  timeout: 60000,
});

const RETRY_DELAYS = [1000, 2000, 4000];

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildDifficultySpec(difficulty: Difficulty, examType: ExamType): string {
  if (difficulty === 'beginner') {
    return `EASY (JEE-entry level): Single-concept problem applying ONE formula or principle to a completely original scenario.
Physics: Standard formula in a fresh context — e.g. projectile with specific angle and speed, simple circuit applying Ohm's law with real resistance values, friction with given mass and coefficient. NOT F=ma stated directly.
Chemistry: Basic stoichiometry with given masses/volumes, strong acid pH with specific concentration, VSEPR shape prediction for a molecule not in any textbook.
Math: Quadratic with fresh non-textbook coefficients, basic definite integral with original limits, simple trigonometric identity with a specific angle.
ANTI-HALLUCINATION RULES:
  1. DO NOT reproduce, paraphrase, or adapt any NCERT example, NCERT exercise, or standard coaching material problem — ever.
  2. Use completely fresh numbers and a new scenario not found in any reference book.
  3. This is still a competitive exam question — it requires understanding, not just formula recall.
Solvable in under 90 seconds by a student who understands the concept.`;
  }
  if (difficulty === 'intermediate') {
    return `MEDIUM (JEE Main level): 2-3 step problem in a non-standard setup. Concept combination or a twist on standard application.
Physics: Non-standard physical setups — object on incline inside an accelerating elevator, circuit with both series and parallel branches and internal resistance, projectile launched from a moving cart or from a height.
Chemistry: Buffer pH with specific weak acid/base and salt concentrations, Kp ↔ Kc conversion with temperature and moles of gas change, electrochemistry with a non-standard Nernst equation condition.
Math: Integration requiring substitution then boundary evaluation, quadratic + geometric interpretation, probability combined with combinatorics (distinct items with constraints).
ANTI-HALLUCINATION RULES:
  1. DO NOT reproduce, paraphrase, or adapt any NCERT example or exercise — these are disqualifying.
  2. Create a completely original scenario. A student who only memorises the formula will get it wrong.
  3. Distractors must be results of specific wrong moves (sign error, forgotten condition, wrong formula variant) — not arbitrary numbers.
Solvable in 2-3 minutes by a well-prepared student.`;
  }
  if (examType === 'Advanced') {
    return `HARD (JEE Advanced level): Multi-concept problem requiring at least 3 non-obvious reasoning steps and cross-topic integration.
Physics: Quantities varying with position or time (force as f(x), non-uniform rotating rod), simultaneous energy + momentum + torque analysis in a single problem, non-standard thermodynamics involving variable heat capacity or phase transitions, Biot-Savart + superposition in non-symmetric geometry.
Chemistry: Multi-stage stoichiometry-dependent calculations (product of step 1 feeds step 2), organic multi-step reaction with stereo/regioselectivity, coordination compounds with competing ligand field effects, electrochemistry combined with acid-base equilibrium.
Math: Hidden parameter conditions (find all k such that…), cross-chapter (definite integral technique + differential equations, conic sections + complex numbers), problems requiring a non-obvious substitution, transformation, or insight before the algebra unlocks.
ANTI-HALLUCINATION RULES:
  1. DO NOT reproduce any past JEE question, NCERT example, or coaching material problem. The scenario must be completely original.
  2. A student who memorised formulas will fail. The question should require reasoning about WHY, not just applying WHAT.
  3. Each wrong option must follow from a specific, plausible error in a particular step — not a random number.
  4. Verify internally that your stated answer is correct by mentally completing the solution before outputting.
Solvable in 3-5 minutes by a top JEE aspirant. Only top 5% should answer completely correctly.`;
  }
  return `HARD (JEE Main — top difficulty): Multi-step problem requiring concept combination and non-trivial reasoning beyond formula substitution.
Physics/Chemistry/Math: At least 2 concepts applied in sequence; a standard formula is necessary but not sufficient.
Options must be crafted so elimination is impossible without actually solving — each distractor is the result of a specific wrong step.
ANTI-HALLUCINATION RULES:
  1. DO NOT reproduce any NCERT example, exercise, or standard textbook problem. Completely original scenario and numbers.
  2. The scenario must be original. A student who tries to recall a similar problem will be misled by the differences.
  3. Verify internally that your stated answer is correct before outputting.
A well-prepared student needs 3+ minutes.`;
}

const DIAGRAM_SPEC = `
  If the question has a geometric/physical setup that benefits from a figure, replace "diagram": null with ONE of these templates. The frontend renders geometry from your params — do NOT invent a different structure.

  TEMPLATE "inclined_plane": { "template": "inclined_plane", "params": { "angle_deg": 30, "show_weight": true, "show_normal": true, "show_friction": false, "show_applied": false, "labels": { "angle": "30°", "block": "m", "weight": "mg", "normal": "N", "friction": "f", "applied": "F" } }}

  TEMPLATE "simple_circuit": { "template": "simple_circuit", "params": { "topology": "series", "components": [{ "type": "battery", "label": "6V" }, { "type": "resistor", "label": "2Ω" }] }}
  Allowed types: "battery"|"resistor"|"capacitor"|"bulb"|"inductor"|"switch". Topology: "series"|"parallel"

  TEMPLATE "lens_mirror": { "template": "lens_mirror", "params": { "type": "convex_lens", "focal_length": 15, "object_distance": 45, "show_rays": true, "labels": { "f": "f = 15 cm", "object": "O", "image": "I" } }}
  Allowed: "convex_lens"|"concave_lens"|"concave_mirror"|"convex_mirror"

  TEMPLATE "energy_profile": { "template": "energy_profile", "params": { "reactant_label": "A + B", "product_label": "C + D", "exothermic": true, "labels": { "ea": "Ea", "delta_h": "ΔH < 0" } }}

  TEMPLATE "coordinate_geometry": { "template": "coordinate_geometry", "params": { "x_range": [-4, 4], "y_range": [-4, 4], "points": [{ "x": 1, "y": 2, "label": "P(1,2)" }], "lines": [], "circles": [] }}

  TEMPLATE "projectile_motion": { "template": "projectile_motion", "params": { "angle_deg": 45, "show_components": true, "labels": { "v0": "v₀", "angle": "45°", "height": "H", "range": "R" } }}

  TEMPLATE "pulley_system": { "template": "pulley_system", "params": { "type": "atwood", "masses": [{ "value": "m₁" }, { "value": "m₂" }], "labels": { "tension": "T", "accel": "a" } }}

  TEMPLATE "wave_diagram": { "template": "wave_diagram", "params": { "type": "transverse", "num_cycles": 2, "labels": { "amplitude": "A", "wavelength": "λ", "velocity": "v" } }}
  Allowed: "transverse"|"standing"

  TEMPLATE "capacitor_field": { "template": "capacitor_field", "params": { "num_field_lines": 5, "show_battery": false, "labels": { "field": "E", "charge_left": "+Q", "charge_right": "−Q", "separation": "d" } }}

  TEMPLATE "pv_diagram": { "template": "pv_diagram", "params": { "process": "isothermal", "labels": { "state_a": "A", "state_b": "B", "process": "T = const" } }}
  Allowed: "isothermal"|"adiabatic"|"isobaric"|"isochoric"|"carnot"

  TEMPLATE "triangle": { "template": "triangle", "params": { "angles": { "A": 60, "B": 60, "C": 60 }, "labels": { "vertex_A": "A", "vertex_B": "B", "vertex_C": "C", "a": "a", "b": "b", "c": "c" }, "show_incircle": false, "show_circumcircle": false }}

  TEMPLATE "circle_geometry": { "template": "circle_geometry", "params": { "subtype": "single", "cx": 190, "cy": 120, "r": 80, "labels": { "center": "O", "radius": "r" }, "points": [] }}
  Subtypes: "single"|"two_circles"|"tangent_from_point"

  TEMPLATE "conic_section": { "template": "conic_section", "params": { "type": "parabola", "a": 2, "show_focus": true, "show_directrix": true, "labels": { "focus": "F(a,0)", "directrix": "x = −a", "equation": "y² = 4ax" } }}
  Allowed: "parabola"|"ellipse"|"hyperbola"

  TEMPLATE "argand_plane": { "template": "argand_plane", "params": { "points": [{ "re": 3, "im": 4, "label": "z = 3+4i", "show_modulus": true, "show_argument": true }] }}

  TEMPLATE "molecular_geometry": { "template": "molecular_geometry", "params": { "shape": "tetrahedral", "central_atom": "C", "ligands": [{"label":"H"},{"label":"H"},{"label":"H"},{"label":"H"}], "bond_angle": 109.5, "labels": { "bond_angle": "109.5°" } }}
  Shapes: "linear"|"bent"|"trigonal_planar"|"tetrahedral"|"octahedral"|"trigonal_bipyramidal"

  TEMPLATE "mo_diagram": { "template": "mo_diagram", "params": { "molecule": "N2" }}
  Supported: N2, O2, F2, B2, C2, Li2, Be2, Ne2, NO, CO, O2+, O2-, N2+, CN-

  TEMPLATE "crystal_structure": { "template": "crystal_structure", "params": { "type": "fcc", "labels": { "formula": "Cu", "title": "FCC" } }}
  Allowed: "scc"|"bcc"|"fcc"|"nacl"

  TEMPLATE "electrochemical_cell": { "template": "electrochemical_cell", "params": { "anode": { "metal": "Zn", "electrolyte": "ZnSO₄" }, "cathode": { "metal": "Cu", "electrolyte": "CuSO₄" }, "emf": "1.10 V", "labels": { "anode_rxn": "Zn → Zn²⁺ + 2e⁻", "cathode_rxn": "Cu²⁺ + 2e⁻ → Cu" } }}

  TEMPLATE "organic_structure": { "template": "organic_structure", "params": { "smiles": "c1ccccc1", "label": "Benzene" }}
  Use IUPAC/standard SMILES: Ethanol "CCO", Acetic acid "CC(=O)O", Aniline "Nc1ccccc1"

  SET diagram to null for: pure algebra, number theory, probability, permutations, abstract questions, chemical equations without energy profile.`;

function buildMCQSinglePrompt(
  subject: Subject, topic: string, difficulty: Difficulty,
  examType: ExamType, studentClass: StudentClass,
  targetLetter: string, difficultySpec: string, classSyllabus: string,
): string {
  const advancedExtra = examType === 'Advanced'
    ? `\n  CRITICAL for JEE Advanced: This MUST involve non-trivial reasoning chains. Formula memorisation alone must not be enough. The correct answer should require at least 3 logical steps that are non-obvious. Distractors must be designed so that a partially-prepared student would pick wrong ones.`
    : '';

  return `
<context>
  <subject>${subject}</subject>
  <topic>${topic}</topic>
  <exam_type>JEE ${examType} competitive entrance exam</exam_type>
  <student_class>Class ${studentClass}</student_class>
  <syllabus_scope>${classSyllabus}</syllabus_scope>
</context>

<difficulty_requirement>
  ${difficultySpec}${advancedExtra}
  IMPORTANT: This is a competitive exam for admission to IITs and NITs. Do NOT generate school-level, NCERT textbook, or basic definitional questions. Every question must require actual reasoning to solve.
</difficulty_requirement>

<task>
  Generate one JEE ${examType} single-correct MCQ on "${subject} — ${topic}".
  - The correct answer MUST be placed at option ${targetLetter}
  - All four options must be numerically/conceptually plausible — no obvious elimination
  - Exactly one correct answer
</task>

<format>
  Return ONLY valid JSON, no markdown, no extra text:
  {
    "question": "Full question text",
    "question_type": "mcq_single",
    "options": ["option A text", "option B text", "option C text", "option D text"],
    "correct_answer": "${targetLetter}",
    "answer_explanation": "Concise 3-4 sentence explanation.",
    "diagram": null
  }
${DIAGRAM_SPEC}
</format>

<constraints>
  - correct_answer MUST be exactly "${targetLetter}"
  - Options: plain text only — do NOT prefix with "A)", "B)", "C)", "D)"
  - ALL 4 options MUST be mathematically distinct — no two options can have the same value or expression
  - answer_explanation: 2-3 sentences ONLY. No "I'll", no "Let me", no "So the answer is". Start directly with the key insight or formula.
  - ALL math expressions MUST be in $...$ delimiters (e.g. $x^2 + y^2$, $\\frac{a}{b}$)
  - Do NOT use concepts outside the class syllabus
  - NEVER copy or paraphrase any NCERT example, exercise, or standard textbook problem — use a completely original scenario
  - Verify the correct answer before outputting: mentally solve using the given values
  - diagram must always be present: valid template object or null
</constraints>`;
}

function buildMCQMultiPrompt(
  subject: Subject, topic: string, difficulty: Difficulty,
  examType: ExamType, studentClass: StudentClass,
  difficultySpec: string, classSyllabus: string,
): string {
  return `
<context>
  <subject>${subject}</subject>
  <topic>${topic}</topic>
  <exam_type>JEE Advanced competitive entrance exam</exam_type>
  <question_type>Multi-correct MCQ — one or more options can be correct</question_type>
  <student_class>Class ${studentClass}</student_class>
  <syllabus_scope>${classSyllabus}</syllabus_scope>
</context>

<difficulty_requirement>
  ${difficultySpec}
  DESIGN GOAL: Multi-correct questions expose partial understanding. Each option tests a different facet. A student with shallow knowledge picks only one obvious answer; the question rewards thorough analysis of all options.
  Cross at least 2 sub-topics or concepts within "${topic}".
</difficulty_requirement>

<task>
  Generate one JEE Advanced multi-correct MCQ on "${subject} — ${topic}".
  - Between 1 and 3 options must be correct (NEVER 0, NEVER all 4)
  - Each option is a distinct testable statement or value
  - Wrong options represent plausible misconceptions or boundary-case errors
  - The question scenario must be rich enough to make each option independently verifiable
  - Solvable in 4-5 minutes for a top student
</task>

<format>
  Return ONLY valid JSON, no markdown, no extra text:
  {
    "question": "Full question text",
    "question_type": "mcq_multi",
    "options": ["option A text", "option B text", "option C text", "option D text"],
    "correct_answers": ["A", "C"],
    "answer_explanation": "Option A: correct because... Option B: wrong because... Option C: correct because... Option D: wrong because...",
    "diagram": null
  }
${DIAGRAM_SPEC}
</format>

<constraints>
  - correct_answers: array of letter strings, e.g. ["A", "C"] or ["A", "B", "D"]
  - NEVER all 4 correct, NEVER all 4 wrong
  - Options: plain text only — do NOT prefix with "A)", "B)", "C)", "D)"
  - answer_explanation MUST address each option individually, 1 sentence per option. No "I'll", no "Let me", no meta-commentary.
  - ALL math in $...$ delimiters
  - Do NOT use concepts outside the class syllabus
  - NEVER copy or paraphrase any NCERT example, exercise, or standard textbook problem — use a completely original scenario
  - Verify every correct answer before outputting: mentally confirm each marked-correct option is actually true
  - diagram must always be present: valid template or null
</constraints>`;
}

function buildIntegerPrompt(
  subject: Subject, topic: string, difficulty: Difficulty,
  examType: ExamType, studentClass: StudentClass,
  difficultySpec: string, classSyllabus: string,
): string {
  const answerRange = examType === 'Advanced'
    ? 'The answer MUST be a non-negative single-digit integer (0 to 9).'
    : 'The answer MUST be a non-negative integer (0 to 99).';
  const timeSpec = examType === 'Advanced'
    ? 'Requires actual derivation (3-4 minutes). Not solvable by guessing.'
    : 'Solvable in 2-3 minutes with careful calculation.';

  return `
<context>
  <subject>${subject}</subject>
  <topic>${topic}</topic>
  <exam_type>JEE ${examType} competitive entrance exam</exam_type>
  <question_type>Integer type — no options, student computes and enters the exact integer answer</question_type>
  <student_class>Class ${studentClass}</student_class>
  <syllabus_scope>${classSyllabus}</syllabus_scope>
</context>

<difficulty_requirement>
  ${difficultySpec}
  ${answerRange}
  ${timeSpec}
  CRITICAL: The question must have a unique, exact integer answer. Design the problem so the numbers work out cleanly to an integer. Do NOT generate a question whose answer is a fraction or irrational number.
</difficulty_requirement>

<task>
  Generate one JEE ${examType} integer-type question on "${subject} — ${topic}".
  - No answer options — student computes the answer and enters the integer
  - All quantities needed for a unique solution must be given
  - ${examType === 'Advanced'
      ? 'Require at least 2-3 non-trivial computation steps. Cross-topic integration preferred (e.g. kinematics + energy, or calculus + geometry).'
      : 'Require careful substitution and calculation. All given values should lead to a clean integer.'}
</task>

<format>
  Return ONLY valid JSON, no markdown, no extra text:
  {
    "question": "Full question text",
    "question_type": "integer",
    "options": [],
    "correct_answer": "7",
    "answer_explanation": "Step-by-step solution showing all calculations.",
    "diagram": null
  }
${DIAGRAM_SPEC}
</format>

<constraints>
  - correct_answer: string of the integer only (e.g. "7" or "42")
  - ${answerRange}
  - options MUST be an empty array []
  - answer_explanation: show key calculation steps in 2-3 sentences. No "I'll", no "Let me", no meta-commentary. Start with the equation or principle.
  - ALL math in $...$ delimiters
  - Do NOT use concepts outside the class syllabus
  - NEVER copy or paraphrase any NCERT example, exercise, or standard textbook problem — use a completely original scenario
  - Verify the answer is an integer before returning: compute it step by step and confirm it falls in the valid range
  - diagram must always be present: valid template or null
</constraints>`;
}

const REASONING_NOISE = [
  /^(okay|alright|sure|let me|i'll|i will|i need to|let's|now,?\s+let|let me think|to solve this|so,?\s+)/i,
  /then\s+(the\s+)?correct\s+answer\s+is\s+[A-D]\.?/gi,
  /i'll\s+do\s+that\.?/gi,
  /the\s+answer\s+is\s+(therefore\s+)?[A-D]\.?\s*$/gi,
  /so\s+the\s+(correct\s+)?answer\s+is/gi,
];

function cleanExplanation(raw: string): string {
  let s = raw.trim();
  // Strip each noise pattern globally
  for (const pat of REASONING_NOISE) s = s.replace(pat, '').trim();
  // Collapse multiple blank lines
  s = s.replace(/\n{3,}/g, '\n\n').trim();
  // Hard cap: keep first 900 chars — enough for multi-step Advanced derivations
  if (s.length > 900) {
    const cutoff = s.lastIndexOf('.', 900);
    s = (cutoff > 100 ? s.slice(0, cutoff + 1) : s.slice(0, 900)).trim();
  }
  return s || raw.trim();
}

function parseRawQuestion(
  raw: Record<string, unknown>,
  questionType: QuestionType,
  examType: ExamType,
): GeneratedQuestion {
  const parsed: GeneratedQuestion = {
    question: String(raw.question ?? ''),
    question_type: questionType,
    options: Array.isArray(raw.options) ? (raw.options as string[]) : [],
    correct_answer: '',
    answer_explanation: cleanExplanation(String(raw.answer_explanation ?? '')),
    diagram: (raw.diagram as DiagramTemplate | null) ?? null,
  };

  if (!parsed.question || !parsed.answer_explanation) {
    throw new Error('Invalid question format: missing question or explanation');
  }

  if (questionType === 'mcq_multi') {
    const rawAnswers = Array.isArray(raw.correct_answers)
      ? (raw.correct_answers as string[])
      : typeof raw.correct_answer === 'string'
        ? raw.correct_answer.split(',')
        : [];

    const validLetters = [...new Set(
      rawAnswers
        .map((s) => String(s).trim().toUpperCase().charAt(0))
        .filter((s) => ['A', 'B', 'C', 'D'].includes(s))
    )].sort();

    if (validLetters.length === 0) throw new Error('No valid correct_answers for multi-correct question');
    if (validLetters.length === 4) throw new Error('All 4 options marked correct — invalid multi-correct');
    parsed.correct_answer = validLetters.join(',');

  } else if (questionType === 'integer') {
    const ansStr = String(raw.correct_answer ?? '').trim();
    const ansNum = parseInt(ansStr, 10);
    const maxInt = examType === 'Advanced' ? 9 : 99;
    if (isNaN(ansNum) || ansNum < 0 || ansNum > maxInt) {
      throw new Error(`Invalid integer answer "${ansStr}" for ${examType} (range 0–${maxInt})`);
    }
    parsed.correct_answer = String(ansNum);
    parsed.options = [];

  } else {
    // mcq_single
    if (parsed.options.length !== 4) throw new Error('MCQ single must have exactly 4 options');
    const letter = String(raw.correct_answer ?? '').trim().toUpperCase().charAt(0);
    if (!['A', 'B', 'C', 'D'].includes(letter)) {
      throw new Error(`Invalid correct_answer: "${raw.correct_answer}"`);
    }
    // Reject questions with duplicate options (DeepSeek hallucination)
    const normalized = parsed.options.map((o) =>
      o.replace(/\$/g, '').replace(/\s+/g, ' ').trim().toLowerCase()
    );
    if (new Set(normalized).size < 4) {
      throw new Error('Duplicate options detected — rejecting question');
    }
    parsed.correct_answer = letter;
  }

  return parsed;
}

function buildBatchPrompt(
  count: number,
  subject: Subject,
  topic: string,
  examType: ExamType,
  studentClass: StudentClass,
  questionType: QuestionType,
  targetLetters: string[],
  difficultySpec: string,
  classSyllabus: string,
): string {
  const qTypeName = questionType === 'mcq_single'
    ? 'single-correct MCQ'
    : questionType === 'mcq_multi'
      ? 'multi-correct MCQ'
      : 'integer-type';

  const letterConstraints = questionType === 'mcq_single' && targetLetters.length > 0
    ? '\n' + targetLetters.map((l, i) => `  - Question ${i + 1} correct answer MUST be at option ${l}`).join('\n')
    : '';

  const exampleObj = questionType === 'mcq_single'
    ? `{ "question": "...", "question_type": "mcq_single", "options": ["...", "...", "...", "..."], "correct_answer": "B", "answer_explanation": "3-4 sentences.", "diagram": null }`
    : questionType === 'mcq_multi'
      ? `{ "question": "...", "question_type": "mcq_multi", "options": ["...", "...", "...", "..."], "correct_answers": ["A", "C"], "answer_explanation": "Option A: ... B: ... C: ... D: ...", "diagram": null }`
      : `{ "question": "...", "question_type": "integer", "options": [], "correct_answer": "7", "answer_explanation": "Step-by-step solution.", "diagram": null }`;

  return `
<context>
  <subject>${subject}</subject>
  <topic>${topic}</topic>
  <exam_type>JEE ${examType} competitive entrance exam</exam_type>
  <student_class>Class ${studentClass}</student_class>
  <syllabus_scope>${classSyllabus}</syllabus_scope>
</context>

<difficulty_requirement>
  ${difficultySpec}
  IMPORTANT: Competitive exam questions — not school-level. Every question requires real reasoning.
</difficulty_requirement>

<task>
  Generate exactly ${count} DISTINCT JEE ${examType} ${qTypeName} questions on "${subject} — ${topic}".
  Each question MUST test a different concept, formula or scenario — no repetition.${letterConstraints}
</task>

<format>
  Return ONLY valid JSON, no markdown, no extra text:
  {
    "questions": [
      ${exampleObj},
      ... (${count} total)
    ]
  }
${DIAGRAM_SPEC}
</format>

<constraints>
  - Return EXACTLY ${count} question objects in the "questions" array
  ${questionType === 'mcq_single' ? `- Each correct_answer must match its assigned option letter` : ''}
  ${questionType === 'mcq_multi' ? `- correct_answers: array of letters, never all 4 correct, never all 4 wrong` : ''}
  ${questionType === 'integer' ? `- correct_answer: string integer${examType === 'Advanced' ? ' (0-9)' : ' (0-99)'}` : ''}
  - Options: plain text — do NOT prefix with "A)", "B)", "C)", "D)"
  - ALL 4 options in each question MUST be mathematically distinct — no two options can have the same value or expression
  - answer_explanation: 2-3 sentences max. Start directly with the insight. NO "I'll", "Let me", "So the answer is", or any internal monologue
  - ALL math expressions MUST be in $...$ delimiters
  - Do NOT use concepts outside the class syllabus
  - NEVER copy or paraphrase any NCERT example, exercise, or standard textbook problem — every question must use a completely original scenario
  - Verify each answer before outputting: mentally solve to confirm correctness
  - diagram must always be present: valid template object or null
</constraints>`;
}

export async function generateQuestion(
  subject: Subject,
  topic: string,
  difficulty: Difficulty,
  examType: ExamType,
  studentClass: StudentClass,
  questionType: QuestionType = 'mcq_single',
): Promise<GeneratedQuestion> {
  const classSyllabus = studentClass === '11'
    ? 'Class 11 only — do NOT use Class 12 concepts'
    : `Class 11 and Class 12 — use concepts appropriate for Class ${studentClass}`;

  const LETTERS = ['A', 'B', 'C', 'D'] as const;
  const targetLetter = LETTERS[Math.floor(Math.random() * 4)]!;
  const difficultySpec = buildDifficultySpec(difficulty, examType);

  let prompt: string;
  if (questionType === 'mcq_multi') {
    prompt = buildMCQMultiPrompt(subject, topic, difficulty, examType, studentClass, difficultySpec, classSyllabus);
  } else if (questionType === 'integer') {
    prompt = buildIntegerPrompt(subject, topic, difficulty, examType, studentClass, difficultySpec, classSyllabus);
  } else {
    prompt = buildMCQSinglePrompt(subject, topic, difficulty, examType, studentClass, targetLetter, difficultySpec, classSyllabus);
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 700,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('Empty response from DeepSeek');

      const raw = JSON.parse(content) as Record<string, unknown>;
      return parseRawQuestion(raw, questionType, examType);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < 2) await sleep(RETRY_DELAYS[attempt] ?? 1000);
    }
  }

  throw lastError ?? new Error('Failed to generate question after retries');
}

export async function generateQuestionBatch(
  count: number,
  subject: Subject,
  topic: string,
  difficulty: Difficulty,
  examType: ExamType,
  studentClass: StudentClass,
  questionType: QuestionType = 'mcq_single',
): Promise<GeneratedQuestion[]> {
  const classSyllabus = studentClass === '11'
    ? 'Class 11 only — do NOT use Class 12 concepts'
    : `Class 11 and Class 12 — use concepts appropriate for Class ${studentClass}`;

  const difficultySpec = buildDifficultySpec(difficulty, examType);

  const LETTERS = ['A', 'B', 'C', 'D'] as const;
  const targetLetters = Array.from({ length: count }, () => LETTERS[Math.floor(Math.random() * 4)]!);

  const prompt = buildBatchPrompt(
    count, subject, topic, examType, studentClass,
    questionType, targetLetters, difficultySpec, classSyllabus,
  );

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: Math.min(count * 650 + 200, 3000),
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('Empty response from DeepSeek');

      const rawBatch = JSON.parse(content) as { questions?: unknown[] };
      const rawQuestions = Array.isArray(rawBatch.questions) ? rawBatch.questions : [];

      const parsed: GeneratedQuestion[] = [];
      for (const rawQ of rawQuestions) {
        try {
          parsed.push(parseRawQuestion(rawQ as Record<string, unknown>, questionType, examType));
        } catch {
          // skip individual malformed questions
        }
      }

      if (parsed.length === 0) throw new Error('No valid questions in batch response');
      return parsed;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < 2) await sleep(RETRY_DELAYS[attempt] ?? 1000);
    }
  }

  throw lastError ?? new Error('Failed to generate question batch after retries');
}
