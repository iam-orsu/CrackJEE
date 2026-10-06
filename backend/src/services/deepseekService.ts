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

  If the question has a geometric/physical setup that benefits from a figure, replace "diagram": null with:
  {
    "boundingBox": [xMin, yMax, xMax, yMin],
    "showAxes": true_or_false,
    "elements": [
      { "kind": "point",  "coords": [x, y], "label": "P", "color": "#333" },
      { "kind": "line",   "from": [x1,y1], "to": [x2,y2], "arrow": "end", "label": "v", "color": "#2563eb", "dashed": false },
      { "kind": "circle", "center": [cx,cy], "radius": r, "label": "C1", "color": "#dc2626" },
      { "kind": "arc",    "center": [cx,cy], "radius": r, "startAngle": 0, "endAngle": 3.14159, "color": "#333" },
      { "kind": "angle",  "vertex": [vx,vy], "arm1": [ax1,ay1], "arm2": [ax2,ay2], "label": "theta" },
      { "kind": "text",   "coords": [x,y], "content": "m = 2 kg", "color": "#555" },
      { "kind": "plot",   "expr": "x^2 - 4", "xMin": -3, "xMax": 3, "color": "#7c3aed" }
    ]
  }

  Include diagram ONLY for: coordinate geometry (circles, parabolas, ellipses, hyperbolas), vectors/force diagrams, ray optics (lens/mirror), projectile/circular motion setup, electromagnetic loop problems, inclined plane problems, reaction coordinate (energy) diagrams, wave/SHM geometry.
  Set diagram to null for: pure algebra, number theory, probability, permutations, chemical equations, thermodynamics laws, simple numerical calculations.

  boundingBox convention: [xMin, yMax, xMax, yMin] — yMax comes before yMin. Example: [-6, 6, 6, -6]
  Allowed colors: "#333" (black), "#2563eb" (blue), "#dc2626" (red), "#16a34a" (green), "#7c3aed" (purple), "#d97706" (amber)
  Keep total elements under 20. All coordinates must be numbers, not strings.
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
  - diagram field must always be present: either a valid descriptor object or null
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
