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
  const prompt = `
<task>
  Validate if this JEE question is mathematically/scientifically correct and appropriate.
</task>

<question>
  ${question.question}
  Options: ${question.options.join(' | ')}
  Correct Answer: ${question.correct_answer}
  Explanation: ${question.answer_explanation}
</question>

<checks>
  - Is the answer unambiguous?
  - Are all options valid and distinct?
  - Is the difficulty appropriate for JEE?
  - Can it be solved in under 3 minutes?
  - Is the explanation correct?
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
