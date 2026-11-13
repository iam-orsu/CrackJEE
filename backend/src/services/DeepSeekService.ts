import OpenAI from 'openai';
import type { GeneratedQuestion, Difficulty, ExamType, Subject, StudentClass, QuestionType } from '../types/index';
import { createConcurrencyLimiter } from '../utils/concurrencyLimiter';
import { createCircuitBreaker, CircuitOpenError } from '../utils/circuitBreaker';
import { incCounter } from '../utils/metrics';
import {
  buildBatchPrompt,
  buildDifficultySpec,
  buildIntegerPrompt,
  buildMCQMultiPrompt,
  buildMCQSinglePrompt,
  buildMixedBatchPrompt,
  buildTieredExplanationPrompt,
  cleanExplanation,
  cleanTieredExplanation,
  parseRawQuestion,
} from '../utils/deepseekPrompts';
import {
  answersMatch,
  buildFacultyBlindVerifyPrompt,
  buildFacultyGenerationPrompt,
  validateFacultyQuestion,
} from '../utils/facultyPrompts';

function extractJsonObject(raw: string): Record<string, unknown> {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) {
    throw new Error('No JSON object found in model output');
  }
  return JSON.parse(trimmed.slice(start, end + 1)) as Record<string, unknown>;
}

export { CircuitOpenError, parseRawQuestion };

const RETRY_DELAYS = [1000, 2000, 4000];
const LETTERS = ['A', 'B', 'C', 'D'] as const;

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class DeepSeekService {
  private client: OpenAI | null = null;
  private readonly withSlot = createConcurrencyLimiter(Number(process.env.DEEPSEEK_CONCURRENCY ?? 6));
  private readonly breaker = createCircuitBreaker({
    name: 'deepseek',
    failureThreshold: Number(process.env.DEEPSEEK_CIRCUIT_FAILURE_THRESHOLD ?? 5),
    cooldownMs: Number(process.env.DEEPSEEK_CIRCUIT_COOLDOWN_MS ?? 5 * 60 * 1000),
  });

  private hasApiKey(): boolean {
    return (process.env.DEEPSEEK_API_KEY ?? '').trim().length >= 8;
  }

  private getClient(): OpenAI {
    if (!this.hasApiKey()) {
      throw new Error('DEEPSEEK_API_KEY is not configured');
    }
    if (!this.client) {
      this.client = new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY!.trim(),
        baseURL: 'https://api.deepseek.com',
        timeout: 60000,
        maxRetries: 0,
      });
    }
    return this.client;
  }

  public isAvailable(): boolean {
    return this.hasApiKey() && !this.breaker.isOpen();
  }

  public getCircuitState(): string {
    return this.breaker.getState();
  }

  private async callChat(
    params: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming,
  ): Promise<OpenAI.Chat.ChatCompletion> {
    if (!this.hasApiKey()) {
      throw new Error('DEEPSEEK_API_KEY is not configured');
    }
    if (!this.breaker.canAttempt()) {
      incCounter('deepseek_requests_total', { outcome: 'circuit_open' });
      throw new CircuitOpenError();
    }
    try {
      const response = await this.withSlot(() => this.getClient().chat.completions.create(params));
      this.breaker.recordSuccess();
      incCounter('deepseek_requests_total', { outcome: 'ok' });
      return response;
    } catch (err) {
      this.breaker.recordFailure();
      incCounter('deepseek_requests_total', { outcome: 'error' });
      throw err;
    }
  }

  private async withRetries<T>(fn: () => Promise<T>, failureMessage: string): Promise<T> {
    let lastError: Error | null = null;
    for (let attempt = 0; attempt < RETRY_DELAYS.length; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (err instanceof CircuitOpenError || !this.hasApiKey()) break;
        if (attempt < RETRY_DELAYS.length - 1) await sleep(RETRY_DELAYS[attempt] ?? 1000);
      }
    }
    throw lastError ?? new Error(failureMessage);
  }

  public async generateQuestion(
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
    const targetLetter = LETTERS[Math.floor(Math.random() * 4)]!;
    const difficultySpec = buildDifficultySpec(difficulty, examType);

    const prompt = questionType === 'mcq_multi'
      ? buildMCQMultiPrompt(subject, topic, difficulty, examType, studentClass, difficultySpec, classSyllabus)
      : questionType === 'integer'
        ? buildIntegerPrompt(subject, topic, difficulty, examType, studentClass, difficultySpec, classSyllabus)
        : buildMCQSinglePrompt(subject, topic, difficulty, examType, studentClass, targetLetter, difficultySpec, classSyllabus);

    return this.withRetries(async () => {
      const response = await this.callChat({
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
    }, 'Failed to generate question after retries');
  }

  public async generateQuestionBatch(
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
    const targetLetters = Array.from({ length: count }, () => LETTERS[Math.floor(Math.random() * 4)]!);
    const prompt = buildBatchPrompt(
      count, subject, topic, examType, studentClass,
      questionType, targetLetters, difficultySpec, classSyllabus,
    );

    return this.withRetries(async () => {
      const response = await this.callChat({
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
          // Skip individual malformed questions
        }
      }
      if (parsed.length === 0) throw new Error('No valid questions in batch response');
      return parsed;
    }, 'Failed to generate question batch after retries');
  }

  public async generateMixedTopicBatch(params: {
    subject: Subject;
    examType: ExamType;
    difficulty: Difficulty;
    questionType: QuestionType;
    plan: Array<{ topic: string; count: number }>;
  }): Promise<Array<{ topic: string; question: GeneratedQuestion }>> {
    const { subject, examType, difficulty, questionType, plan } = params;
    const total = plan.reduce((sum, p) => sum + p.count, 0);
    if (total === 0) return [];

    const difficultySpec = buildDifficultySpec(difficulty, examType);
    const targetLetters = Array.from({ length: total }, () => LETTERS[Math.floor(Math.random() * 4)]!);
    const prompt = buildMixedBatchPrompt(subject, examType, questionType, plan, targetLetters, difficultySpec);

    return this.withRetries(async () => {
      const response = await this.callChat({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: Math.min(total * 700 + 400, 8000),
        response_format: { type: 'json_object' },
      });
      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('Empty response from DeepSeek');
      const rawBatch = JSON.parse(content) as { questions?: unknown[] };
      const rawQuestions = Array.isArray(rawBatch.questions) ? rawBatch.questions : [];

      const remaining = new Map(plan.map((p) => [p.topic, p.count]));
      const result: Array<{ topic: string; question: GeneratedQuestion }> = [];
      for (const rawQ of rawQuestions) {
        let question: GeneratedQuestion;
        try {
          question = parseRawQuestion(rawQ as Record<string, unknown>, questionType, examType, false);
        } catch {
          continue;
        }
        const named = typeof (rawQ as { topic?: unknown }).topic === 'string' ? (rawQ as { topic: string }).topic : '';
        const topic = remaining.get(named) ? named : plan.find((p) => (remaining.get(p.topic) ?? 0) > 0)?.topic;
        if (!topic) continue;
        remaining.set(topic, (remaining.get(topic) ?? 0) - 1);
        result.push({ topic, question });
      }
      if (result.length === 0) throw new Error('No valid questions in mixed batch response');
      return result;
    }, 'Failed to generate mixed question batch after retries');
  }

  public async verifyQuestionBatch(questions: GeneratedQuestion[]): Promise<boolean[]> {
    if (questions.length === 0) return [];
    const items = questions.map((q, i) => {
      const options = q.options.length > 0
        ? q.options.map((o, j) => `  ${['A', 'B', 'C', 'D'][j]}) ${o}`).join('\n')
        : '  (integer answer, no options)';
      return `Question ${i + 1}: ${q.question}\n${options}\nStated answer: ${q.correct_answer}`;
    }).join('\n\n');

    const prompt = `
<task>
  You are checking competitive exam questions. For each question below, solve it yourself from scratch,
  then decide whether the stated answer is correct. Mark a question valid only if you reach the same answer.
  Mark it invalid if the question is ambiguous, has no consistent answer, or the stated answer is wrong.
</task>

<questions>
${items}
</questions>

<format>
  Return ONLY valid JSON, no markdown: {"verdicts": [{"index": 1, "valid": true}, ... one entry per question in order]}
</format>`;

    try {
      const response = await this.callChat({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
        max_tokens: Math.min(questions.length * 80 + 200, 2000),
        response_format: { type: 'json_object' },
      });
      const content = response.choices[0]?.message?.content;
      if (!content) return questions.map(() => false);
      const parsed = JSON.parse(content) as { verdicts?: Array<{ index?: unknown; valid?: unknown }> };
      const byIndex = new Map<number, boolean>();
      for (const v of parsed.verdicts ?? []) {
        if (typeof v.index === 'number') byIndex.set(v.index, v.valid === true);
      }
      return questions.map((_, i) => byIndex.get(i + 1) === true);
    } catch {
      return questions.map(() => false);
    }
  }

  public async generateExplanation(q: {
    questionText: string;
    options: string[];
    answer: string;
    questionType: string;
    subject: string;
    topic: string;
  }): Promise<string> {
    const options = q.options.length > 0
      ? q.options.map((o, i) => `  ${['A', 'B', 'C', 'D'][i]}) ${o}`).join('\n')
      : '  (integer answer)';
    const correct = q.questionType === 'mcq_multi' ? `Correct options: ${q.answer}` : `Correct answer: ${q.answer}`;
    const prompt = `
<task>
  Explain to a JEE student why the correct answer is correct. 2-3 sentences, plain and direct.
  Start with the key idea or formula. No "I'll", no "Let me", no "So the answer is".
  Write all mathematics in LaTeX between $...$.
</task>

<question subject="${q.subject}" topic="${q.topic}">
${q.questionText}
${options}
${correct}
</question>`;

    const response = await this.callChat({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 350,
    });
    const content = response.choices[0]?.message?.content;
    if (!content || !content.trim()) throw new Error('Empty explanation from DeepSeek');
    return cleanExplanation(content);
  }

  public async generateTieredExplanation(params: {
    questionText: string;
    options: string[];
    answer: string;
    questionType: string;
    subject: string;
    topic: string;
    examType?: string;
    tier: 'better' | 'best';
    existingExplanation?: string;
  }): Promise<string> {
    const prompt = buildTieredExplanationPrompt(params);
    const maxTokens = params.tier === 'best' ? 1200 : 900;
    const response = await this.callChat({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.25,
      max_tokens: maxTokens,
    });
    const content = response.choices[0]?.message?.content;
    if (!content || !content.trim()) throw new Error('Empty explanation from DeepSeek');
    return cleanTieredExplanation(content);
  }

  /** Solution-first faculty question generator with deterministic formatting validation. */
  public async generateFacultyQuestion(params: {
    examType: 'Main' | 'Advanced' | 'NEET';
    subject: Subject;
    topic: string;
    difficulty: Difficulty;
    questionType: QuestionType;
  }): Promise<GeneratedQuestion> {
    const targetLetter = LETTERS[Math.floor(Math.random() * 4)]!;
    const prompt = buildFacultyGenerationPrompt({ ...params, targetLetter });
    const examType: ExamType = params.examType === 'NEET' ? 'NEET' : params.examType;

    return this.withRetries(async () => {
      const response = await this.callChat({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.25,
        max_tokens: 1400,
        response_format: { type: 'json_object' },
      });
      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('Empty response from DeepSeek');
      const raw = extractJsonObject(content);
      return validateFacultyQuestion(raw, params.questionType, examType);
    }, 'Failed to generate faculty question after retries');
  }

  /** Blind independent verification using `deepseek-reasoner` (falling back to `deepseek-chat` if unavailable). */
  public async blindVerifyFacultyQuestion(params: {
    examType: 'Main' | 'Advanced' | 'NEET';
    subject: Subject;
    topic: string;
    question: GeneratedQuestion;
  }): Promise<boolean> {
    const prompt = buildFacultyBlindVerifyPrompt({
      examType: params.examType,
      subject: params.subject,
      topic: params.topic,
      questionType: params.question.question_type,
      questionText: params.question.question,
      options: params.question.options,
      explanation: params.question.answer_explanation,
    });

    const runVerify = async (useReasoner: boolean): Promise<boolean> => {
      const response = await this.callChat(
        useReasoner
          ? {
              model: 'deepseek-reasoner',
              messages: [{ role: 'user', content: prompt }],
              max_tokens: 2200,
            }
          : {
              model: 'deepseek-chat',
              messages: [{ role: 'user', content: prompt }],
              temperature: 0,
              max_tokens: 600,
              response_format: { type: 'json_object' },
            },
      );
      const content = response.choices[0]?.message?.content;
      if (!content) return false;
      const parsed = extractJsonObject(content);
      const solved = typeof parsed.solved_answer === 'string' ? parsed.solved_answer : String(parsed.solved_answer ?? '');
      const unambiguous = parsed.is_unambiguous === true;
      const explanationConsistent = parsed.explanation_consistent !== false;
      return unambiguous && explanationConsistent && answersMatch(params.question.question_type, params.question.correct_answer, solved);
    };

    try {
      return await runVerify(true);
    } catch (err) {
      if (err instanceof CircuitOpenError || !this.hasApiKey()) return false;
      try {
        return await runVerify(false);
      } catch {
        return false;
      }
    }
  }
}

export const deepSeekService = new DeepSeekService();
