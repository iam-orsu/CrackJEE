import type {
  GeneratedQuestion,
  Difficulty,
  ExamType,
  Subject,
  StudentClass,
  QuestionType,
  DiagramTemplate,
} from '../types/index';

export function buildDifficultySpec(difficulty: Difficulty, examType: ExamType): string {
  if (examType === 'NEET') {
    const levelLabel = difficulty === 'beginner'
      ? 'STANDARD NEET-UG (60s direct-to-moderate NCERT application)'
      : difficulty === 'advanced'
        ? 'CHALLENGING NEET-UG (rank-decider numericals, multi-statement / Assertion-Reason traps)'
        : 'MODERATE NEET-UG (authentic NTA NEET difficulty)';
    return `${levelLabel}: Strictly grounded in Rationalized NCERT Class 11 & 12 concepts.
Biology (Botany/Zoology): Test precise NCERT wording, metabolic pathways, exceptions, Statement I & II, Assertion-Reason, or match-list reasoning — zero out-of-NCERT trivia.
Chemistry: Inorganic NCERT trends & exceptions; Organic NCERT reagents/mechanisms; Physical clean numerical formula application.
Physics: Crisp concept-to-numerical or graph interpretation solvable in ~60-90s under speed pressure — NO IIT-Advanced multi-page calculus derivations.
NEVER copy verbatim NCERT end-of-chapter exercise wording; vary numbers and phrasing freshly.`;
  }
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

export const DIAGRAM_SPEC = `
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

export function buildMCQSinglePrompt(
  subject: Subject, topic: string, _difficulty: Difficulty,
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

export function buildMCQMultiPrompt(
  subject: Subject, topic: string, _difficulty: Difficulty,
  _examType: ExamType, studentClass: StudentClass,
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

export function buildIntegerPrompt(
  subject: Subject, topic: string, _difficulty: Difficulty,
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

export function buildBatchPrompt(
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

export function buildMixedBatchPrompt(
  subject: Subject,
  examType: ExamType,
  questionType: QuestionType,
  plan: Array<{ topic: string; count: number }>,
  targetLetters: string[],
  difficultySpec: string,
): string {
  const qTypeName = questionType === 'mcq_single'
    ? 'single-correct MCQ'
    : questionType === 'mcq_multi'
      ? 'multi-correct MCQ'
      : 'integer-type';
  const total = plan.reduce((sum, p) => sum + p.count, 0);
  const topicLines = plan.map((p) => `  - "${p.topic}": exactly ${p.count} question(s)`).join('\n');
  const letterConstraints = questionType === 'mcq_single'
    ? '\n' + targetLetters.map((l, i) => `  - Question ${i + 1} correct answer MUST be at option ${l}`).join('\n')
    : '';
  const exampleObj = questionType === 'mcq_single'
    ? `{ "topic": "<one topic name>", "question": "...", "question_type": "mcq_single", "options": ["...", "...", "...", "..."], "correct_answer": "B", "diagram": null }`
    : questionType === 'mcq_multi'
      ? `{ "topic": "<one topic name>", "question": "...", "question_type": "mcq_multi", "options": ["...", "...", "...", "..."], "correct_answers": ["A", "C"], "diagram": null }`
      : `{ "topic": "<one topic name>", "question": "...", "question_type": "integer", "options": [], "correct_answer": "7", "diagram": null }`;

  const examLabel = examType === 'NEET' ? 'NEET-UG medical entrance exam' : `JEE ${examType} competitive entrance exam`;
  const cognitiveRule = examType === 'Advanced'
    ? 'IIT JEE Advanced cognitive rigor ONLY: cross-topic synthesis, non-routine first-principles setups, limiting/boundary traps — NO board/NCERT exercises or easy single-formula JEE Main style questions.'
    : examType === 'NEET'
      ? 'NTA NEET-UG rigor: strictly NCERT Class 11/12 grounded — precise Biology statements/Assertion-Reason, NCERT Chemistry reactions/trends, and crisp Physics numericals.'
      : 'NTA JEE Main competitive rigor: 2-3 step application, speed-accuracy numericals, and conceptual/sign traps within rationalized NCERT scope — NEVER copy school/NCERT textbook exercises or definitions.';

  return `
<context>
  <subject>${subject}</subject>
  <exam_type>${examLabel}</exam_type>
  <syllabus_scope>Class 11 and Class 12</syllabus_scope>
</context>

<difficulty_requirement>
  ${difficultySpec}
  IMPORTANT: ${cognitiveRule}
</difficulty_requirement>

<task>
  Generate exactly ${total} DISTINCT ${examLabel} ${qTypeName} questions in ${subject}, split across these topics:
${topicLines}
  Each question MUST test a different concept, formula or scenario — no repetition.${letterConstraints}
</task>

<format>
  Return ONLY valid JSON, no markdown, no extra text:
  {
    "questions": [
      ${exampleObj},
      ... (${total} total)
    ]
  }
  Each question's "topic" must be exactly one of the topic names above.
${DIAGRAM_SPEC}
</format>

<constraints>
  - Return EXACTLY ${total} question objects in the "questions" array, with the topic counts above
  ${questionType === 'mcq_single' ? '- Each correct_answer must match its assigned option letter' : ''}
  ${questionType === 'mcq_multi' ? '- correct_answers: array of letters, never all 4 correct, never all 4 wrong' : ''}
  ${questionType === 'integer' ? '- Answer MUST be a whole number (not a fraction or decimal)' : ''}
  - Use LaTeX delimiters ($...$) for all mathematical content
  - NEVER copy or paraphrase any NCERT example, textbook exercise, or rote school-board definition
  - Do NOT use out-of-syllabus concepts
</constraints>`;
}

const REASONING_NOISE = [
  /^(okay|alright|sure|let me|i'll|i will|i need to|let's|now,?\s+let|let me think|to solve this|so,?\s+)/i,
  /then\s+(the\s+)?correct\s+answer\s+is\s+[A-D]\.?/gi,
  /i'll\s+do\s+that\.?/gi,
  /the\s+answer\s+is\s+(therefore\s+)?[A-D]\.?\s*$/gi,
  /so\s+the\s+(correct\s+)?answer\s+is/gi,
];

export function cleanExplanation(raw: string): string {
  let s = raw.trim();
  for (const pat of REASONING_NOISE) s = s.replace(pat, '').trim();
  s = s.replace(/\n{3,}/g, '\n\n').trim();
  if (s.length > 1800) {
    const cutoff = s.lastIndexOf('.', 1800);
    s = (cutoff > 100 ? s.slice(0, cutoff + 1) : s.slice(0, 1800)).trim();
  }
  return s || raw.trim();
}

export function cleanTieredExplanation(raw: string, maxLen = 3500): string {
  let s = raw.trim();
  for (const pat of REASONING_NOISE) s = s.replace(pat, '').trim();
  // Ensure major section headings always start on their own paragraph
  s = s.replace(/([^\n])\s*(\*\*\s*(?:💡|⚡|⚠️|Step \d|Given Data|Verification))/gi, '$1\n\n$2');
  s = s.replace(/\n{3,}/g, '\n\n').trim();
  if (s.length > maxLen) {
    const cutoff = s.lastIndexOf('.', maxLen);
    s = (cutoff > 200 ? s.slice(0, cutoff + 1) : s.slice(0, maxLen)).trim();
  }
  return s || raw.trim();
}

export function buildTieredExplanationPrompt(params: {
  questionText: string;
  options: string[];
  answer: string;
  questionType: string;
  subject: string;
  topic: string;
  examType?: string;
  tier: 'better' | 'best';
  existingExplanation?: string;
}): string {
  const optionsBlock = params.options.length > 0
    ? params.options.map((o, i) => `  ${['A', 'B', 'C', 'D'][i]}) ${o}`).join('\n')
    : '  (integer answer)';
  const correctLabel = params.questionType === 'mcq_multi'
    ? `Correct options: ${params.answer}`
    : `Correct answer: ${params.answer}`;

  const examContext = params.examType === 'NEET' ? 'NEET' : params.examType === 'Advanced' ? 'JEE Advanced' : 'JEE Main';

  if (params.tier === 'better') {
    return `
<task>
  You are an expert ${examContext} teacher writing a "Better Explanation" for a student.
  The student found the standard 1-sentence solution too brief or difficult to follow.
  Provide a clear, detailed, step-by-step first-principles derivation.

  Required structure:
  **Given Data & Core Principle**
  State the given values, unknown to find, and fundamental physics/math/chemistry law or formula clearly (define every symbol).

  **Step-by-Step Solution**
  Walk through each algebraic manipulation, formula substitution, and intermediate calculation sequentially. DO NOT skip steps or jump straight to numbers.

  **Verification**
  Conclude by showing how the final calculated result directly matches ${correctLabel}.

  Constraints:
  - Format all equations, symbols, numbers with units, and expressions in valid LaTeX math ($...$ or $$...$$).
  - Separate every section with TWO blank lines (\\n\\n) so headers never run into paragraphs.
  - Clear and patient pedagogical tone.
  - No introductory chatter or meta-commentary. Start immediately with "**Given Data & Core Principle**".
</task>

<question subject="${params.subject}" topic="${params.topic}">
${params.questionText}
${optionsBlock}
${correctLabel}
${params.existingExplanation ? `Standard Brief Solution: ${params.existingExplanation}` : ''}
</question>`;
  }

  return `
<task>
  You are an IIT / AIIMS top-ranker exam coach writing a "Best Explanation" (Masterclass Breakdown) for an ambitious ${examContext} aspirant.
  Provide a high-leverage competitive analysis focusing on intuition, rapid exam technique, and distractor traps.

  Required structure:
  **💡 Conceptual Insight**
  Explain the intuitive "why" behind this problem. What is the fundamental mechanism, conservation law, or symmetry at play?

  **⚡ Speed Technique / Shortcut**
  How can a top aspirant solve or eliminate options in under 60 seconds? (e.g. dimensional analysis, boundary/limiting values, graph behavior, order-of-magnitude estimation, or symmetry). If standard calculation is the only path, highlight the algebraic shortcut.

  **⚠️ Common Pitfalls & Traps**
  Analyze why students pick the wrong options. Specifically identify the common sign error, unit mistake, or theoretical misconception the question setter planted in the distractors.

  Constraints:
  - Format all equations, symbols, numbers with units, and expressions in valid LaTeX math ($...$ or $$...$$).
  - Separate every section with TWO blank lines (\\n\\n) so headers never run into paragraphs.
  - High-level, razor-sharp competitive coaching tone.
  - No introductory chatter or meta-commentary. Start immediately with "**💡 Conceptual Insight**".
</task>

<question subject="${params.subject}" topic="${params.topic}">
${params.questionText}
${optionsBlock}
${correctLabel}
${params.existingExplanation ? `Standard Brief Solution: ${params.existingExplanation}` : ''}
</question>`;
}

export function parseRawQuestion(
  raw: Record<string, unknown>,
  questionType: QuestionType,
  examType: ExamType,
  needExplanation = true,
): GeneratedQuestion {
  const parsed: GeneratedQuestion = {
    question: String(raw.question ?? ''),
    question_type: questionType,
    options: Array.isArray(raw.options) ? (raw.options as string[]) : [],
    correct_answer: '',
    answer_explanation: cleanExplanation(String(raw.answer_explanation ?? '')),
    diagram: (raw.diagram as DiagramTemplate | null) ?? null,
  };

  if (!parsed.question || (needExplanation && !parsed.answer_explanation)) {
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
        .filter((s) => ['A', 'B', 'C', 'D'].includes(s)),
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
    if (parsed.options.length !== 4) throw new Error('MCQ single must have exactly 4 options');
    const letter = String(raw.correct_answer ?? '').trim().toUpperCase().charAt(0);
    if (!['A', 'B', 'C', 'D'].includes(letter)) {
      throw new Error(`Invalid correct_answer: "${raw.correct_answer}"`);
    }
    const normalized = parsed.options.map((o) =>
      o.replace(/\$/g, '').replace(/\s+/g, ' ').trim().toLowerCase(),
    );
    if (new Set(normalized).size < 4) {
      throw new Error('Duplicate options detected — rejecting question');
    }
    parsed.correct_answer = letter;
  }

  return parsed;
}
