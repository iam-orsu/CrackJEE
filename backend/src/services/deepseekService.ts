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

  const prompt = `
<context>
  <subject>${subject}</subject>
  <topic>${topic}</topic>
  <difficulty>${difficulty}</difficulty>
  <exam_type>JEE ${examType}</exam_type>
  <student_class>Class ${studentClass}</student_class>
  <syllabus_scope>${classSyllabus}</syllabus_scope>
</context>

<task>
  Generate a JEE-style ${subject} question on "${topic}" with these properties:
  - Clear single correct answer from 4 options (A, B, C, D)
  - Solvable in 2-3 minutes
  - Appropriate difficulty for ${difficulty} level
  - Strictly within the ${classSyllabus} syllabus scope
</task>

<format>
  Return ONLY valid JSON, no markdown, no extra text:
  {
    "question": "Full question text here",
    "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
    "correct_answer": "<the actual correct letter: A, B, C, or D>",
    "answer_explanation": "Step-by-step explanation here"
  }
</format>

<constraints>
  - correct_answer must be ONLY a single letter: A, B, C, or D — whichever option is actually correct
  - Vary the position of the correct answer naturally (do NOT always put it at A)
  - Do NOT use concepts beyond the student's class syllabus scope
  - Do NOT generate ambiguous questions
  - Include units where applicable
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
