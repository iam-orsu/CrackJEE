import OpenAI from 'openai';
import { createConcurrencyLimiter } from '../utils/concurrencyLimiter';
import { createCircuitBreaker } from '../utils/circuitBreaker';
import { PSYCHOMETRIC_BANK, type PsychometricQuestionData } from '../data/psychometricBank';
import { logger } from '../utils/logger';

export interface GeneratedPsychometricExam {
  id: string;
  title: string;
  description: string;
  generatedByAi: boolean;
  sections: {
    id: string;
    name: string;
    description: string;
    timeLimitSeconds?: number;
    items: PsychometricQuestionData[];
  }[];
}

const PSYCHOMETRIC_SYSTEM_PROMPT = `You are an expert psychometrician and industrial-organizational psychologist specializing in competitive STEM and medical entrance aspirants (JEE Main, JEE Advanced, and NEET UG).

Generate an authentic, highly realistic psychometric assessment battery covering:
1. Cognitive Aptitude (CHC Theory: Fluid Reasoning, Numerical Logic, Pattern Induction, Spatial Deduction)
2. Behavioral & Work-Style (Big Five OCEAN, HEXACO Honesty-Humility, Conscientiousness, Integrity)
3. Situational Judgment Scenarios (SJT): Realistic high-stakes exam and study dilemmas where candidates rate a proposed action on a 5-point scale (Strongly Disagree, Disagree, Partially Agree, Agree, Strongly Agree)
4. Exam Anxiety & Academic Resilience (Spielberger TAI & Cassidy ARS-30: Panic, Somatic Arousal, Recovery from Low Marks)
5. Career & Stream Interests (Holland RIASEC: Computer Science, Robotics, Clinical Medicine, Biotech, Data Science)

Return ONLY a valid JSON object matching the requested schema without markdown backticks or commentary.`;

export class DeepSeekPsychometricService {
  private client: OpenAI | null = null;
  private readonly withSlot = createConcurrencyLimiter(Number(process.env.DEEPSEEK_CONCURRENCY ?? 6));
  private readonly breaker = createCircuitBreaker({
    name: 'deepseek-psychometric',
    failureThreshold: Number(process.env.DEEPSEEK_CIRCUIT_FAILURE_THRESHOLD ?? 5),
    cooldownMs: Number(process.env.DEEPSEEK_CIRCUIT_COOLDOWN_MS ?? 5 * 60 * 1000),
  });

  private hasApiKey(): boolean {
    return (process.env.DEEPSEEK_API_KEY ?? '').trim().length >= 8;
  }

  private getClient(): OpenAI {
    if (!this.hasApiKey()) throw new Error('DEEPSEEK_API_KEY is not configured');
    if (!this.client) {
      this.client = new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY!.trim(),
        baseURL: 'https://api.deepseek.com',
        timeout: 45000,
        maxRetries: 0,
      });
    }
    return this.client;
  }

  /**
   * Generates a dynamic, live AI psychometric exam paper.
   * If the AI service is unreachable or errors out, gracefully falls back
   * to a randomized, freshly shuffled subset from the pre-calibrated psychometric bank.
   */
  public async generateLiveExam(targetExam: string = 'Main'): Promise<GeneratedPsychometricExam> {
    const examId = `psy_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    if (this.hasApiKey() && !this.breaker.isOpen()) {
      try {
        const liveExam = await this.callAiGeneration(examId, targetExam);
        if (liveExam && liveExam.sections.length > 0) {
          logger.info({ examId, targetExam }, 'Successfully generated live AI psychometric exam via DeepSeek');
          return liveExam;
        }
      } catch (err) {
        logger.warn({ err }, 'DeepSeek psychometric generation failed, falling back to randomized bank');
      }
    }

    return this.generateFromRandomizedBank(examId, targetExam);
  }

  private async callAiGeneration(examId: string, targetExam: string): Promise<GeneratedPsychometricExam | null> {
    const prompt = `Create a live psychometric assessment for a student preparing for ${targetExam.toUpperCase()}.
Include:
- 4 Cognitive Aptitude MCQs (numerical logic, abstract rule, deductive syllogism, spatial orientation)
- 6 Behavioral & Personality Likert items (Conscientiousness, Openness, Emotional Stability, HEXACO Honesty-Humility)
- 4 Situational Judgment Scenarios (SJT) with realistic student dilemma narrative + proposed action + 5 agreement options (Strongly Disagree to Strongly Agree)
- 4 Exam Anxiety & Resilience items (4-point frequency: Almost Never to Almost Always)
- 6 Career & Stream Discovery items (Holland RIASEC: AI, Robotics, Medicine, Biotechnology, Pure Math, Entrepreneurship)

Format as a single JSON object:
{
  "title": "AI Psychometric & Behavioral Diagnostic Battery",
  "description": "Comprehensive psychological, cognitive, and career alignment assessment.",
  "items": [
    {
      "id": "cog_ai_1",
      "section": "COGNITIVE",
      "construct": "NUMERICAL",
      "subFacet": "Number Series",
      "itemType": "COGNITIVE_MCQ",
      "promptText": "What is the next number in the series: ...",
      "options": [{"id": "A", "text": "..."}, {"id": "B", "text": "..."}, {"id": "C", "text": "..."}, {"id": "D", "text": "..."}],
      "correctAnswer": "B"
    },
    {
      "id": "sjt_ai_1",
      "section": "SJT",
      "construct": "SJT_DECISION_MAKING",
      "subFacet": "Exam Triage",
      "itemType": "SCENARIO_LIKERT_5",
      "scenarioText": "Scenario: ...",
      "promptText": "Proposed action: ...",
      "options": [
        {"id": "1", "text": "Strongly Disagree"},
        {"id": "2", "text": "Disagree"},
        {"id": "3", "text": "Partially Agree"},
        {"id": "4", "text": "Agree"},
        {"id": "5", "text": "Strongly Agree"}
      ],
      "isReverseKeyed": false
    }
  ]
}`;

    const completion = await this.withSlot(() =>
      this.getClient().chat.completions.create({
        model: 'deepseek-chat',
        temperature: 0.7,
        max_tokens: 3500,
        messages: [
          { role: 'system', content: PSYCHOMETRIC_SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
      }),
    );

    const raw = completion.choices[0]?.message?.content ?? '';
    const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(cleaned) as { title?: string; description?: string; items?: PsychometricQuestionData[] };

    if (!parsed.items || !Array.isArray(parsed.items) || parsed.items.length === 0) {
      return null;
    }

    // Partition into 5 sections
    const items = parsed.items.map((item, idx) => ({
      ...item,
      id: item.id || `psy_item_${idx + 1}`,
      orderIndex: idx + 1,
    }));

    return this.buildSections(examId, parsed.title || 'Live AI Psychometric Exam', parsed.description || 'AI-generated assessment', items, true);
  }

  /**
   * Shuffles and compiles the pre-calibrated psychometric bank to guarantee 100% instant reliability.
   */
  public generateFromRandomizedBank(examId: string, targetExam: string): GeneratedPsychometricExam {
    // Clone and slightly shuffle items within each section
    const shuffledItems: PsychometricQuestionData[] = [];
    const sections: Array<PsychometricQuestionData['section']> = ['COGNITIVE', 'BEHAVIORAL', 'SJT', 'ANXIETY', 'RIASEC'];

    sections.forEach((sec) => {
      const secItems = PSYCHOMETRIC_BANK.filter((q) => q.section === sec);
      // Shuffle slightly
      const shuffled = [...secItems].sort(() => Math.random() - 0.5);
      shuffledItems.push(...shuffled);
    });

    return this.buildSections(
      examId,
      `Comprehensive Psychometric Diagnostic (${targetExam.toUpperCase()})`,
      'Scientifically validated diagnostic covering cognitive agility, personality, situational judgment, test anxiety, and career stream match.',
      shuffledItems,
      false,
    );
  }

  private buildSections(
    examId: string,
    title: string,
    description: string,
    items: PsychometricQuestionData[],
    generatedByAi: boolean,
  ): GeneratedPsychometricExam {
    const cognitiveItems = items.filter((q) => q.section === 'COGNITIVE');
    const behavioralItems = items.filter((q) => q.section === 'BEHAVIORAL');
    const sjtItems = items.filter((q) => q.section === 'SJT');
    const anxietyItems = items.filter((q) => q.section === 'ANXIETY');
    const riasecItems = items.filter((q) => q.section === 'RIASEC');

    return {
      id: examId,
      title,
      description,
      generatedByAi,
      sections: [
        {
          id: 'sec_cognitive',
          name: '1. Cognitive Aptitude (CHC Theory)',
          description: 'Timed fluid logic, numerical induction, and spatial reasoning puzzles.',
          timeLimitSeconds: 15 * 60, // 15 mins timed
          items: cognitiveItems.length > 0 ? cognitiveItems : PSYCHOMETRIC_BANK.filter((q) => q.section === 'COGNITIVE'),
        },
        {
          id: 'sec_behavioral',
          name: '2. Behavioral & Work-Style (Big Five + HEXACO)',
          description: 'Assess conscientious study habits, perseverance, and ethical integrity.',
          items: behavioralItems.length > 0 ? behavioralItems : PSYCHOMETRIC_BANK.filter((q) => q.section === 'BEHAVIORAL'),
        },
        {
          id: 'sec_sjt',
          name: '3. Situational Judgment Scenarios (SJT)',
          description: 'Realistic high-stakes exam dilemmas and tactical decisions with agreement ratings.',
          items: sjtItems.length > 0 ? sjtItems : PSYCHOMETRIC_BANK.filter((q) => q.section === 'SJT'),
        },
        {
          id: 'sec_anxiety',
          name: '4. Exam Anxiety & Academic Resilience (TAI / ARS-30)',
          description: 'Evaluate physical exam-hall stress reactions and bounce-back determination.',
          items: anxietyItems.length > 0 ? anxietyItems : PSYCHOMETRIC_BANK.filter((q) => q.section === 'ANXIETY'),
        },
        {
          id: 'sec_riasec',
          name: '5. Career & Stream Profiler (Holland RIASEC)',
          description: 'Map your intrinsic strengths to Computer Science, Robotics, Medicine, Biotechnology, or Research.',
          items: riasecItems.length > 0 ? riasecItems : PSYCHOMETRIC_BANK.filter((q) => q.section === 'RIASEC'),
        },
      ],
    };
  }
}

export const deepSeekPsychometricService = new DeepSeekPsychometricService();
