import OpenAI from 'openai';
import type { GeneratedQuestion, Difficulty, ExamType, Subject, StudentClass } from '../types/index';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

const RETRY_DELAYS = [1000, 2000, 4000];

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateQuestion(
  subject: Subject,
  topic: string,
  difficulty: Difficulty,
  examType: ExamType,
  studentClass: StudentClass,
): Promise<GeneratedQuestion> {
  const classSyllabus =
    studentClass === '11'
      ? 'Class 11 only — do NOT use Class 12 concepts'
      : `Class 11 and Class 12 — use concepts appropriate for Class ${studentClass}`;

  // Force even A/B/C/D distribution — LLMs default to A/B/C without this
  const LETTERS = ['A', 'B', 'C', 'D'] as const;
  const targetLetter = LETTERS[Math.floor(Math.random() * 4)]!;

  const difficultySpec = difficulty === 'beginner'
    ? `BEGINNER (JEE level): Single-concept problem requiring direct application of a formula or theorem. Still a proper JEE question — NOT a school textbook example. Requires understanding of the concept, not just recall. A student who has studied the topic should be able to solve it in under 90 seconds.`
    : difficulty === 'intermediate'
    ? `INTERMEDIATE (JEE Main level): Requires combining 2-3 concepts or applying a concept in a non-obvious way. Typical of actual JEE Main paper questions. A well-prepared student should solve it in 2-3 minutes. Tricky but fair.`
    : `ADVANCED (JEE Advanced level): Multi-step problem requiring deep conceptual understanding and non-trivial reasoning. Similar to JEE Advanced paper difficulty. Should challenge even a well-prepared student. Options must be carefully crafted so elimination is difficult.`;

  const prompt = `
<context>
  <subject>${subject}</subject>
  <topic>${topic}</topic>
  <exam_type>JEE ${examType} competitive entrance exam</exam_type>
  <student_class>Class ${studentClass}</student_class>
  <syllabus_scope>${classSyllabus}</syllabus_scope>
</context>

<difficulty_requirement>
  ${difficultySpec}
  IMPORTANT: This is a competitive exam for admission to IITs and NITs. Questions must be at that standard. Do NOT generate school-level, NCERT textbook, or basic definitional questions. Every question must require actual mathematical or scientific reasoning to solve.
</difficulty_requirement>

<task>
  Generate one JEE ${examType} level ${subject} question on "${topic}".
  - The correct answer must be placed at option ${targetLetter}
  - The question must require active problem solving, not just memory recall
  - All four options must be numerically or conceptually plausible to prevent easy elimination
  - Question must be unambiguous with exactly one correct answer
</task>

<format>
  Return ONLY valid JSON, no markdown, no extra text, no reasoning or thought process:
  {
    "question": "Full question text here",
    "options": ["option1 text only", "option2 text only", "option3 text only", "option4 text only"],
    "correct_answer": "${targetLetter}",
    "answer_explanation": "Concise 3-4 sentence explanation of the solution only.",
    "diagram": null
  }

  If the question has a geometric/physical setup that benefits from a figure, replace "diagram": null with ONE of these templates. The frontend renders geometry from your params — do NOT invent a different structure.

  TEMPLATE "inclined_plane" — block on a slope, normal/friction/weight forces:
  { "template": "inclined_plane", "params": {
      "angle_deg": 30,
      "show_weight": true, "show_normal": true, "show_friction": false, "show_applied": false,
      "labels": { "angle": "30°", "block": "m", "weight": "mg", "normal": "N", "friction": "f", "applied": "F" }
  }}

  TEMPLATE "simple_circuit" — series or parallel electric circuit:
  { "template": "simple_circuit", "params": {
      "topology": "series",
      "components": [
        { "type": "battery", "label": "6V" },
        { "type": "resistor", "label": "2Ω" },
        { "type": "resistor", "label": "4Ω" }
      ]
  }}
  Allowed component types: "battery" | "resistor" | "capacitor" | "bulb" | "inductor" | "switch"
  Allowed topology: "series" | "parallel"

  TEMPLATE "lens_mirror" — ray optics (lens or mirror):
  { "template": "lens_mirror", "params": {
      "type": "convex_lens",
      "focal_length": 15,
      "object_distance": 45,
      "show_rays": true,
      "labels": { "f": "f = 15 cm", "object": "O", "image": "I" }
  }}
  focal_length and object_distance: EXACT positive numbers in cm from the question.
  Allowed types: "convex_lens" | "concave_lens" | "concave_mirror" | "convex_mirror"

  TEMPLATE "energy_profile" — reaction coordinate diagram (Chemistry):
  { "template": "energy_profile", "params": {
      "reactant_label": "A + B", "product_label": "C + D", "exothermic": true,
      "labels": { "ea": "Ea", "delta_h": "ΔH < 0" }
  }}

  TEMPLATE "coordinate_geometry" — points/lines/circles on x-y plane (Mathematics):
  { "template": "coordinate_geometry", "params": {
      "x_range": [-4, 4], "y_range": [-4, 4],
      "points": [{ "x": 1, "y": 2, "label": "P(1,2)" }],
      "lines": [{ "from": [-3, -1], "to": [3, 3], "label": "L", "dashed": false, "arrow": false }],
      "circles": [{ "cx": 0, "cy": 0, "r": 2, "label": "C" }]
  }}

  TEMPLATE "projectile_motion" — oblique projectile trajectory:
  { "template": "projectile_motion", "params": {
      "angle_deg": 45,
      "show_components": true,
      "labels": { "v0": "v₀", "angle": "45°", "height": "H", "range": "R" }
  }}
  Use for: projectile questions, maximum height, range, time of flight problems.

  TEMPLATE "pulley_system" — Atwood machine (two masses over fixed pulley):
  { "template": "pulley_system", "params": {
      "type": "atwood",
      "masses": [{ "value": "m₁" }, { "value": "m₂" }],
      "labels": { "tension": "T", "accel": "a" }
  }}
  Use for: Atwood machine, pulley with two hanging masses, tension/acceleration problems.

  TEMPLATE "wave_diagram" — transverse or standing wave:
  { "template": "wave_diagram", "params": {
      "type": "transverse",
      "num_cycles": 2,
      "labels": { "amplitude": "A", "wavelength": "λ", "velocity": "v" }
  }}
  Allowed types: "transverse" | "standing"
  Use for: wave motion, SHM, standing waves, string vibration, resonance problems.

  TEMPLATE "capacitor_field" — parallel plate capacitor with uniform E field:
  { "template": "capacitor_field", "params": {
      "num_field_lines": 5,
      "show_battery": false,
      "labels": { "field": "E", "charge_left": "+Q", "charge_right": "−Q", "separation": "d" }
  }}
  Use for: parallel plate capacitor, uniform electric field, capacitance, dielectric problems.

  TEMPLATE "pv_diagram" — thermodynamic P-V diagram:
  { "template": "pv_diagram", "params": {
      "process": "isothermal",
      "labels": { "state_a": "A", "state_b": "B", "process": "T = const" }
  }}
  Allowed processes: "isothermal" | "adiabatic" | "isobaric" | "isochoric" | "carnot"
  Use for: thermodynamic processes, work done by gas, PV graph questions, Carnot cycle.

  WHEN TO INCLUDE A DIAGRAM:
  Physics: inclined_plane | simple_circuit | lens_mirror | projectile_motion | pulley_system | wave_diagram | capacitor_field | pv_diagram | energy_profile
  Mathematics: coordinate_geometry | triangle | circle_geometry | conic_section | argand_plane
  Chemistry: energy_profile | molecular_geometry | mo_diagram | crystal_structure | electrochemical_cell | organic_structure

  TEMPLATE "triangle" — triangle with computed angles, optional incircle/circumcircle (Mathematics):
  { "template": "triangle", "params": {
      "angles": { "A": 60, "B": 60, "C": 60 },
      "labels": { "vertex_A": "A", "vertex_B": "B", "vertex_C": "C", "a": "a", "b": "b", "c": "c" },
      "show_incircle": false, "show_circumcircle": false
  }}
  Use for: triangle angle/side problems, sine rule, cosine rule, incircle, circumcircle, area questions.
  angles.A+B+C need not sum to 180 — they are normalized automatically.

  TEMPLATE "circle_geometry" — circle, two circles, or external point + tangent (Mathematics):
  { "template": "circle_geometry", "params": {
      "subtype": "single",
      "cx": 190, "cy": 120, "r": 80,
      "labels": { "center": "O", "radius": "r" },
      "points": [{ "x": 230, "y": 60, "label": "P" }]
  }}
  Subtypes: "single" | "two_circles" | "tangent_from_point"
  For two_circles: add cx2, cy2, r2, labels.c1, labels.c2, labels.r1, labels.r2
  For tangent_from_point: add point_x, point_y, labels.point, labels.tangent
  Use for: chord, tangent, secant, circle theorems, two-circle problems.

  TEMPLATE "conic_section" — parabola, ellipse, or hyperbola on coordinate axes (Mathematics):
  { "template": "conic_section", "params": {
      "type": "parabola",
      "a": 2,
      "show_focus": true, "show_directrix": true,
      "labels": { "focus": "F(a,0)", "directrix": "x = −a", "equation": "y² = 4ax" }
  }}
  For ellipse/hyperbola: add "b" param and optional "show_asymptotes": true (hyperbola only)
  labels can include "f1", "f2" for focus labels, "a", "b" for semi-axis labels
  Allowed types: "parabola" | "ellipse" | "hyperbola"
  Use for: conic sections, focus-directrix, eccentricity, tangent to conics, locus problems.

  TEMPLATE "argand_plane" — complex numbers plotted on Argand diagram (Mathematics):
  { "template": "argand_plane", "params": {
      "points": [
        { "re": 3, "im": 4, "label": "z = 3+4i", "show_modulus": true, "show_argument": true }
      ]
  }}
  Up to 4 points. show_modulus draws line from origin; show_argument draws angle arc.
  Use for: modulus, argument, locus of complex numbers, polar form, roots of unity.

  TEMPLATE "molecular_geometry" — VSEPR 2D projection (Chemistry):
  { "template": "molecular_geometry", "params": {
      "shape": "tetrahedral",
      "central_atom": "C",
      "ligands": [{"label":"H"},{"label":"H"},{"label":"H"},{"label":"H"}],
      "bond_angle": 109.5,
      "labels": { "bond_angle": "109.5°" }
  }}
  Allowed shapes: "linear" | "bent" | "trigonal_planar" | "tetrahedral" | "octahedral" | "trigonal_bipyramidal"
  Use for: VSEPR theory, molecular shapes, bond angles, hybridization questions.

  TEMPLATE "mo_diagram" — molecular orbital energy level diagram (Chemistry):
  { "template": "mo_diagram", "params": {
      "molecule": "N2"
  }}
  Supported molecules: N2, O2, F2, B2, C2, Li2, Be2, Ne2, NO, CO, O2+, O2-, N2+, CN-
  Automatically shows filled orbitals, bond order, and magnetic behavior.
  Use for: MO theory, bond order, paramagnetism/diamagnetism, stability comparison.

  TEMPLATE "crystal_structure" — isometric unit cell diagram (Chemistry):
  { "template": "crystal_structure", "params": {
      "type": "fcc",
      "labels": { "formula": "Cu", "title": "FCC" }
  }}
  Allowed types: "scc" | "bcc" | "fcc" | "nacl"
  Shows atoms at correct positions with atoms-per-unit-cell label.
  Use for: solid state, packing efficiency, coordination number, unit cell problems.

  TEMPLATE "electrochemical_cell" — galvanic/Daniell cell diagram (Chemistry):
  { "template": "electrochemical_cell", "params": {
      "anode":   { "metal": "Zn", "electrolyte": "ZnSO₄" },
      "cathode": { "metal": "Cu", "electrolyte": "CuSO₄" },
      "emf": "1.10 V",
      "labels": { "anode_rxn": "Zn → Zn²⁺ + 2e⁻", "cathode_rxn": "Cu²⁺ + 2e⁻ → Cu" }
  }}
  Use for: electrochemistry, EMF, cell notation, electrode reactions, standard electrode potential.

  TEMPLATE "organic_structure" — 2D skeletal structure via SMILES (Chemistry):
  { "template": "organic_structure", "params": {
      "smiles": "c1ccccc1",
      "label": "Benzene"
  }}
  Use IUPAC/standard SMILES notation. Examples:
    Benzene: "c1ccccc1"  |  Ethanol: "CCO"  |  Acetic acid: "CC(=O)O"
    Cyclohexane: "C1CCCCC1"  |  Aniline: "Nc1ccccc1"  |  Acetone: "CC(=O)C"
    Glucose: "OC[C@@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O"
  Use for: IUPAC naming, functional groups, isomerism, organic reactions, structure identification.

  SET diagram to null for: pure algebra, number theory, probability, permutations, chemical equations without energy profile, kinematics without a geometric setup, abstract/definitional questions, multi-lens or multi-mirror combination problems.
</format>

<constraints>
  - The correct answer MUST be option ${targetLetter} — arrange your options so the right answer falls at position ${targetLetter}
  - correct_answer must be exactly "${targetLetter}" — no other value is acceptable
  - Options must be plain text values only — do NOT prefix with "A)", "B)", "C)", "D)"
  - answer_explanation must be 3-4 sentences maximum — direct, clear, no internal monologue
  - ALL mathematical expressions — fractions, exponents, subscripts, symbols, binomial coefficients, integrals, etc. — MUST be wrapped in $...$ delimiters for inline math or $$...$$ for display math (e.g. $x^2 + y^2$, $\binom{n}{r}$, $\frac{a}{b}$). Never write bare LaTeX commands outside delimiters.
  - Do NOT use concepts beyond the student's class syllabus scope
  - Do NOT generate basic definitional or recall questions
  - Include units where applicable
  - diagram field must always be present: either a valid template object or null
  - If you include a diagram, use ONLY the template names and param keys shown above — no other structure
</constraints>`;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('Empty response from DeepSeek');

      const parsed = JSON.parse(content) as GeneratedQuestion;

      if (
        !parsed.question ||
        !Array.isArray(parsed.options) ||
        parsed.options.length !== 4 ||
        !parsed.correct_answer ||
        !parsed.answer_explanation
      ) {
        throw new Error('Invalid question format returned');
      }

      // Normalize correct_answer to a single uppercase letter
      const letter = parsed.correct_answer.trim().toUpperCase().charAt(0);
      if (!['A', 'B', 'C', 'D'].includes(letter)) {
        throw new Error(`Invalid correct_answer value: "${parsed.correct_answer}"`);
      }
      parsed.correct_answer = letter;

      return parsed;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < 2) {
        await sleep(RETRY_DELAYS[attempt] ?? 1000);
      }
    }
  }

  throw lastError ?? new Error('Failed to generate question after retries');
}
