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

const PSYCHOMETRIC_SYSTEM_PROMPT = `You are an expert student mentor and child psychologist specializing in Indian school and college students (Class 6 to 10 Foundation, and Class 11-12 Intermediate / JEE & NEET aspirants).

CRITICAL TONE & VOCABULARY GUIDELINES:
1. USE SIMPLE, EVERYDAY INDIAN STUDENT ENGLISH.
   - Absolutely NO posh corporate jargon or advanced academic words (e.g., do NOT use "cybersecurity protocols", "computational bioinformatics", "somatic panic", "resilience quotient", "stakeholder triage", or "photoelectric emission syllogisms").
   - Students are 11 to 18 years old. Use words they hear in school every day: homework, school tests, unit tests, mock exams, board exams, classes, mobile phone distractions (Instagram reels, YouTube shorts, gaming), silly mistakes, asking doubts to teachers, exam nervousness, helping friends, and dream careers.

2. FORMAT DIVERSITY (Strict Rule):
   - Do NOT use "Strongly Disagree to Strongly Agree" for every question! Use the 5-point agreement scale for ONLY 1 or 2 select honesty/ethics questions in the whole exam.
   - For all other questions, use:
     a) SCENARIO_ACTION_MCQ: Everyday school/exam situation with 4 action choices (A, B, C, D) asking what the student would do.
     b) FREQUENCY_SCALE: (Never, Rarely, Sometimes, Often, Always) for daily habits, phone distractions, and exam nervousness.
     c) EFFECTIVENESS_SCALE: (Very Bad Idea, Not Very Helpful, Helpful & Good, Super Effective) for study and revision strategies.
     d) PASSION_SCALE: (Not Interested, A Little Curious, Interested, Love It / Passionate) for career and stream interests (Coding/Games, Robots/Machines, Doctors/MBBS, Space/ISRO rockets, Business/Startups, Art/Animation).
     e) COGNITIVE_MCQ: Simple, fun number patterns, shape sequences, class rankings, and dice/cube visualization puzzles (A, B, C, D).

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
   * Generates a dynamic, live AI psychometric exam paper tailored for Indian students.
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
    const prompt = `Create a fun, simple, highly relatable psychometric assessment for an Indian student in Class 6 to 12 preparing for ${targetExam.toUpperCase()} or school exams.

Include:
- 5 Cognitive MCQs: simple number pattern, speed/distance puzzle, shape sequence, class test ranking, and dice puzzle.
- 5 Daily Study Habit items: mobile phone distraction (reels/gaming), mistake notebook routine, asking teacher doubts, helping classmates, and 1 honesty/ethics agreement question.
- 4 Real Situations (What Would You Do?): exam time running out dilemma, friend asking to copy in test, fixing silly mistakes strategy, and 1 teacher feedback agreement question.
- 3 Exam Tension & Confidence items: butterflies before exam, blanking out on formulas, bouncing back after low marks.
- 6 Dream Career & Stream items: Coding & Mobile Games, Robots & Gadgets, Doctors & Medicine, Space Rockets & Science Experiments (ISRO), Business & Startups, Creative Design & Art.

Format as a single JSON object:
{
  "title": "Student Mindset & Career Guidance Test",
  "description": "Discover your brain strengths, study habits, exam confidence, and best college career streams.",
  "items": [
    {
      "id": "cog_ai_1",
      "section": "COGNITIVE",
      "construct": "NUMERICAL",
      "subFacet": "Number Pattern",
      "itemType": "COGNITIVE_MCQ",
      "promptText": "What comes next in the sequence: 5, 10, 20, 40, ?",
      "options": [{"id": "A", "text": "60"}, {"id": "B", "text": "80"}, {"id": "C", "text": "70"}, {"id": "D", "text": "100"}],
      "correctAnswer": "B"
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

    return this.buildSections(
      examId,
      parsed.title || 'Student Mindset & Career Guidance Test',
      parsed.description || 'Discover your brain strengths, study habits, exam confidence, and best college career streams.',
      items,
      true,
    );
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
      `Student Mindset & Career Guidance Test (${targetExam.toUpperCase()})`,
      'Discover your brain strengths, study habits, exam confidence, and best college career streams.',
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
          name: '1. Mind Puzzles & Quick Logic',
          description: 'Fun number puzzles, shape sequences, and brain teasers that test your quick thinking.',
          timeLimitSeconds: 15 * 60, // 15 mins timed
          items: cognitiveItems.length > 0 ? cognitiveItems : PSYCHOMETRIC_BANK.filter((q) => q.section === 'COGNITIVE'),
        },
        {
          id: 'sec_behavioral',
          name: '2. Daily Study Habits & Routine',
          description: 'How you handle mobile phone distractions, homework, mistake notebooks, and helping friends.',
          items: behavioralItems.length > 0 ? behavioralItems : PSYCHOMETRIC_BANK.filter((q) => q.section === 'BEHAVIORAL'),
        },
        {
          id: 'sec_sjt',
          name: '3. Real Situations: What Would You Do?',
          description: 'Everyday school and exam hall dilemmas: time running out, friends asking to copy, and overcoming silly mistakes.',
          items: sjtItems.length > 0 ? sjtItems : PSYCHOMETRIC_BANK.filter((q) => q.section === 'SJT'),
        },
        {
          id: 'sec_anxiety',
          name: '4. Exam Tension & Confidence',
          description: 'How you feel before exams, handling test nervousness, and bouncing back after low marks.',
          items: anxietyItems.length > 0 ? anxietyItems : PSYCHOMETRIC_BANK.filter((q) => q.section === 'ANXIETY'),
        },
        {
          id: 'sec_riasec',
          name: '5. Your Interests & Dream Careers',
          description: 'Explore what you love most: Coding, Robots, Doctors/Medicine, Space Rockets (ISRO), Business, or Design.',
          items: riasecItems.length > 0 ? riasecItems : PSYCHOMETRIC_BANK.filter((q) => q.section === 'RIASEC'),
        },
      ],
    };
  }
}

export const deepSeekPsychometricService = new DeepSeekPsychometricService();
