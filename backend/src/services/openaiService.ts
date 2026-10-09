import OpenAI from 'openai';
import type { GeneratedQuestion } from '../types/index';
import { logger } from '../lib/logger';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  ...(process.env.OPENAI_BASE_URL ? { baseURL: process.env.OPENAI_BASE_URL } : {}),
});

const RETRY_DELAYS = [500, 1000, 2000];

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function validateQuestion(question: GeneratedQuestion): Promise<boolean> {
  const qt = question.question_type ?? 'mcq_single';

  const questionSection = qt === 'integer'
    ? `${question.question}\nAnswer: ${question.correct_answer}`
    : qt === 'mcq_multi'
    ? `${question.question}\nOptions: ${question.options.join(' | ')}\nCorrect answers: ${question.correct_answer}`
    : `${question.question}\nOptions: ${question.options.join(' | ')}\nCorrect Answer: ${question.correct_answer}`;

  const checksSection = qt === 'integer'
    ? `- Is the answer a valid non-negative integer?
  - Is the question clearly solvable with a unique integer answer?
  - Is the calculation in the explanation correct?`
    : qt === 'mcq_multi'
    ? `- Are all specified correct answers actually correct?
  - Do the wrong options represent plausible misconceptions?
  - Is the number of correct answers between 1 and 3 (not all 4)?
  - Is this suitable for JEE Advanced difficulty?`
    : `- Is the answer unambiguous with exactly one correct option?
  - Are all options valid and distinct?
  - Is the difficulty appropriate for JEE?
  - Is the explanation correct?`;

  const prompt = `
<task>
  Validate if this JEE ${qt} question is mathematically/scientifically correct and appropriate.
</task>

<question>
  ${questionSection}
  Explanation: ${question.answer_explanation}
</question>

<checks>
  ${checksSection}
</checks>

<response>
  Respond with ONLY: "VALID" or "INVALID: <one line reason>"
</response>`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
        max_tokens: 50,
      });

      const content = response.choices[0]?.message?.content?.trim() ?? '';
      return content.startsWith('VALID');
    } catch (err) {
      if (attempt < 2) {
        await sleep(RETRY_DELAYS[attempt] ?? 500);
      } else {
        logger.error({ err }, '[openai] validation failed after retries — failing open');
        return true; // Fail open — don't block question generation if validation is down
      }
    }
  }

  return true;
}
