import OpenAI from 'openai';
import { createConcurrencyLimiter } from '../utils/concurrencyLimiter';
import { createCircuitBreaker } from '../utils/circuitBreaker';
import { type PsychometricQuestionData } from '../data/psychometricBank';
import {
  findCardDef,
  PSYCHOMETRIC_CARDS,
  type CandidateProfile,
  type PsychometricCardDef,
} from '../data/psychometricCards';
import { logger } from '../utils/logger';

export interface GeneratedPsychometricExam {
  id: string;
  cardId?: string;
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

export interface CareerDecisionResult {
  summary: string;
  whatYouCanBecome: Array<{
    role: string;
    field: string;
    matchPct: number;
    whyYouFit: string;
  }>;
  coreStrengths: string[];
  workStyle: string;
  intentAndDrivers: string;
  actionableNextSteps: string[];
}

const PSYCHOMETRIC_SYSTEM_PROMPT = `You are a real-world career mentor and practical psychologist.
CRITICAL TONE & VOCABULARY RULES:
1. USE SIMPLE, PLAIN, DOWN-TO-EARTH ENGLISH.
   - Absolutely ZERO posh, fancy corporate or academic buzzwords (e.g. NEVER use words like "resilience", "determination", "grit", "cognitive fortitude", "somatic", "synergistic", "stakeholder triage").
   - Use language real people use every day at school, college, or work: projects, deadlines, homework, exams, team members, customers, boss, software bugs, making mistakes, solving problems, and career choices.
2. TAILOR THE CONTEXT TO THE CANDIDATE:
   - If the candidate is a school or intermediate student: dilemmas and examples must be about school, classes, homework, exams, teacher feedback, and friend situations.
   - If college / UG / PG student: dilemmas must be about college projects, exams, group presentations, campus recruitment, and internships.
   - If employed in a job: dilemmas must be about meetings, deadlines, coworkers, clients, manager feedback, and daily work tasks.
   - If looking for a job: dilemmas must be about learning new skills, interviews, practical tasks, and starting fresh in a career.
3. FORMAT DIVERSITY:
   - For cognitive and logic questions: 4 options (A, B, C, D) with one clear correct answer.
   - For situational and dilemma questions: 4 realistic action options (A, B, C, D) asking what the candidate would actually do.
   - For daily habits or reactions: 5-point frequency scale (Never, Rarely, Sometimes, Often, Always).
   - For values, opinions, and work style: 5-point agreement scale (Strongly Disagree, Disagree, Neutral, Agree, Strongly Agree).
4. Return ONLY a valid JSON object matching the requested schema. No markdown formatting outside the JSON.`;

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
   * Generates a completely dynamic, on-demand assessment exam for one of the 8 modular cards
   * based on the candidate's age, education, and profession profile.
   */
  public async generateCardExam(
    cardId: string,
    profile: CandidateProfile,
  ): Promise<GeneratedPsychometricExam> {
    const cardDef = findCardDef(cardId) ?? PSYCHOMETRIC_CARDS[0]!;
    const examId = `psy_${cardDef.id}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    if (this.hasApiKey() && !this.breaker.isOpen()) {
      try {
        const liveExam = await this.callCardAiGeneration(examId, cardDef, profile);
        if (liveExam && liveExam.sections.length > 0 && liveExam.sections[0]!.items.length > 0) {
          logger.info({ examId, cardId: cardDef.id, profile }, 'Generated fresh AI card assessment');
          return liveExam;
        }
      } catch (err) {
        logger.warn({ err, cardId: cardDef.id }, 'DeepSeek card generation failed, using structured fallback');
      }
    }

    return this.generateCardFallback(examId, cardDef, profile);
  }

  private async callCardAiGeneration(
    examId: string,
    cardDef: PsychometricCardDef,
    profile: CandidateProfile,
  ): Promise<GeneratedPsychometricExam | null> {
    const profileSummary = this.describeProfile(profile);

    const prompt = `Generate a fresh, 100% unique assessment for the card: "${cardDef.name}".
Card Description: ${cardDef.description}
Subtopics to cover:
${cardDef.subtopics.map((s, i) => `${i + 1}. ${s}`).join('\n')}

CANDIDATE BACKGROUND:
${profileSummary}

REQUIREMENTS:
- Generate exactly 8 distinct questions covering these subtopics.
- Ensure scenarios match their real background (${profile.professionStatus}).
- Zero posh words! No "resilience", "determination", "grit", or complex psychological jargon.
- Mix formats:
  - If reasoning/puzzle: 4 options with "correctAnswer" ("A", "B", "C", or "D").
  - If dilemma/situation: 4 concrete practical action choices.
  - If behavior/habits: Frequency scale (Never, Rarely, Sometimes, Often, Always).
  - If mindset/values: Agreement scale (Strongly Disagree, Disagree, Neutral, Agree, Strongly Agree).

Format output as JSON:
{
  "title": "${cardDef.name}",
  "description": "${cardDef.description}",
  "items": [
    {
      "id": "item_1",
      "section": "${cardDef.id}",
      "construct": "Subtopic name here",
      "subFacet": "Specific angle",
      "itemType": "COGNITIVE_MCQ | SCENARIO_ACTION_MCQ | FREQUENCY_SCALE | AGREEMENT_LIKERT | PASSION_SCALE",
      "scenarioText": "Optional realistic context or dilemma if applicable",
      "promptText": "The exact question in simple plain English",
      "options": [{"id": "1", "text": "Option text"}],
      "correctAnswer": "A (optional for cognitive questions)"
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
    const parsed = JSON.parse(cleaned) as {
      title?: string;
      description?: string;
      items?: PsychometricQuestionData[];
    };

    if (!parsed.items || !Array.isArray(parsed.items) || parsed.items.length === 0) {
      return null;
    }

    const items: PsychometricQuestionData[] = parsed.items.map((item, idx) => ({
      ...item,
      id: item.id || `psy_${cardDef.id}_${idx + 1}_${Date.now()}`,
      section: (item.section as any) || cardDef.id,
      orderIndex: idx + 1,
    }));

    return {
      id: examId,
      cardId: cardDef.id,
      title: cardDef.name,
      description: cardDef.description,
      generatedByAi: true,
      sections: [
        {
          id: `sec_${cardDef.id}`,
          name: cardDef.name,
          description: cardDef.description,
          timeLimitSeconds: cardDef.estimatedMinutes * 60,
          items,
        },
      ],
    };
  }

  /**
   * Generates a definitive AI career decision and blueprint based on candidate's
   * test responses, intent, and background.
   */
  public async decideCareerAndOutcome(
    cardId: string,
    profile: CandidateProfile,
    responses: Array<{
      promptText: string;
      answer: string;
      construct?: string;
    }>,
  ): Promise<CareerDecisionResult> {
    const cardDef = findCardDef(cardId) ?? PSYCHOMETRIC_CARDS[0]!;
    const profileSummary = this.describeProfile(profile);

    if (this.hasApiKey() && !this.breaker.isOpen()) {
      try {
        const prompt = `You are a real-world career mentor. A candidate just finished the "${cardDef.name}" assessment.
CANDIDATE BACKGROUND:
${profileSummary}

THEIR TEST RESPONSES:
${responses.map((r, i) => `${i + 1}. [${r.construct || 'Area'}] ${r.promptText} -> Answer: ${r.answer}`).join('\n')}

RULES:
- Plain everyday conversational English. No fancy posh buzzwords (NO "resilience", "determination", "grit").
- Recommend 3 to 4 specific, real-world career paths or roles they can become based on their answers and background.
- Give concrete reasons why their mindset and work style fit.

Format as JSON:
{
  "summary": "2-3 plain sentences summarizing their core thinking and mindset.",
  "whatYouCanBecome": [
    {
      "role": "Specific Job Title (e.g., Cloud & DevOps Engineer, Product Coordinator, Market Research Analyst, UI/UX Designer)",
      "field": "Industry / Domain",
      "matchPct": 94,
      "whyYouFit": "Clear plain explanation in 2 sentences."
    }
  ],
  "coreStrengths": ["Clear strength 1", "Clear strength 2", "Clear strength 3"],
  "workStyle": "How they work best in plain words.",
  "intentAndDrivers": "What truly motivates them.",
  "actionableNextSteps": [
    "Practical next step 1",
    "Practical next step 2",
    "Practical next step 3"
  ]
}`;

        const completion = await this.withSlot(() =>
          this.getClient().chat.completions.create({
            model: 'deepseek-chat',
            temperature: 0.6,
            max_tokens: 2500,
            messages: [
              { role: 'system', content: PSYCHOMETRIC_SYSTEM_PROMPT },
              { role: 'user', content: prompt },
            ],
          }),
        );

        const raw = completion.choices[0]?.message?.content ?? '';
        const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(cleaned) as CareerDecisionResult;

        if (parsed.whatYouCanBecome && Array.isArray(parsed.whatYouCanBecome)) {
          return parsed;
        }
      } catch (err) {
        logger.warn({ err }, 'DeepSeek career decision generation failed, using fallback');
      }
    }

    return this.fallbackCareerDecision(cardDef, profile);
  }

  private describeProfile(profile: CandidateProfile): string {
    const parts = [`- Age: ${profile.age || 'Not specified'}`];
    if (profile.professionStatus === 'student') {
      const levelMap: Record<string, string> = {
        school: 'School / 10th Class',
        intermediate: '11th-12th / Intermediate',
        ug: 'Undergraduate / College',
        pg: 'Postgraduate / Masters',
      };
      parts.push(`- Status: Student (${levelMap[profile.studentLevel ?? 'ug'] ?? 'College'})`);
      if (profile.stream) parts.push(`- Stream / Focus: ${profile.stream}`);
    } else if (profile.professionStatus === 'employed') {
      parts.push(`- Status: Working Professional`);
      if (profile.jobTitle) parts.push(`- Role: ${profile.jobTitle}`);
      if (profile.companyType) parts.push(`- Industry / Company: ${profile.companyType}`);
    } else {
      parts.push(`- Status: Looking for Job / Early Career`);
      if (profile.highestQualification) parts.push(`- Education: ${profile.highestQualification}`);
      if (profile.targetRole) parts.push(`- Target Field: ${profile.targetRole}`);
    }
    return parts.join('\n');
  }

  private generateCardFallback(
    examId: string,
    cardDef: PsychometricCardDef,
    profile: CandidateProfile,
  ): GeneratedPsychometricExam {
    const isStudent = profile.professionStatus === 'student';
    const items: PsychometricQuestionData[] = cardDef.subtopics.map((st, idx) => {
      if (cardDef.id === 'cognitive_ability') {
        return {
          id: `item_cog_${idx + 1}`,
          section: 'COGNITIVE' as any,
          construct: st,
          subFacet: st,
          itemType: 'COGNITIVE_MCQ',
          promptText:
            idx % 2 === 0
              ? `What number comes next in the sequence: ${idx * 4 + 2}, ${idx * 4 + 6}, ${idx * 4 + 12}, ${idx * 4 + 20}, ?`
              : `A team has 5 members. If every member pairs with every other member once, how many unique pairs are formed?`,
          options: [
            { id: 'A', text: `${idx * 4 + 28}` },
            { id: 'B', text: `${idx * 4 + 30}` },
            { id: 'C', text: `${idx * 4 + 32}` },
            { id: 'D', text: '10' },
          ],
          correctAnswer: 'B',
          orderIndex: idx + 1,
        };
      }

      if (cardDef.id === 'situational_judgment' || cardDef.id === 'integrity_risk') {
        return {
          id: `item_sjt_${idx + 1}`,
          section: 'SJT' as any,
          construct: st,
          subFacet: st,
          itemType: 'SCENARIO_ACTION_MCQ',
          scenarioText: isStudent
            ? 'A key group assignment is due tomorrow morning, but one team member has not submitted their assigned part.'
            : 'A client project deadline is tomorrow, but one team member missed their deliverable.',
          promptText: 'What is the most practical action you would take right away?',
          options: [
            { id: 'A', text: 'Call them directly to check their blocker and divide the remaining work.' },
            { id: 'B', text: 'Inform the teacher / manager immediately and ask for an extension.' },
            { id: 'C', text: 'Stay up late and complete their part yourself without telling anyone.' },
            { id: 'D', text: 'Submit what is ready and explain who missed their work.' },
          ],
          orderIndex: idx + 1,
        };
      }

      if (idx % 2 === 0) {
        return {
          id: `item_freq_${idx + 1}`,
          section: 'BEHAVIORAL' as any,
          construct: st,
          subFacet: st,
          itemType: 'FREQUENCY_SCALE',
          promptText: isStudent
            ? `When preparing for an important class test or project, how often do you plan your study schedule in advance?`
            : `When handling multiple work tasks with tight deadlines, how often do you prioritize high-impact items first?`,
          options: [
            { id: '1', text: 'Never' },
            { id: '2', text: 'Rarely' },
            { id: '3', text: 'Sometimes' },
            { id: '4', text: 'Often' },
            { id: '5', text: 'Always' },
          ],
          orderIndex: idx + 1,
        };
      }

      return {
        id: `item_agr_${idx + 1}`,
        section: 'BEHAVIORAL' as any,
        construct: st,
        subFacet: st,
        itemType: 'AGREEMENT_LIKERT',
        promptText: `I work best when I have clear goals and the freedom to organize my own approach.`,
        options: [
          { id: '1', text: 'Strongly Disagree' },
          { id: '2', text: 'Disagree' },
          { id: '3', text: 'Neutral' },
          { id: '4', text: 'Agree' },
          { id: '5', text: 'Strongly Agree' },
        ],
        orderIndex: idx + 1,
      };
    });

    return {
      id: examId,
      cardId: cardDef.id,
      title: cardDef.name,
      description: cardDef.description,
      generatedByAi: false,
      sections: [
        {
          id: `sec_${cardDef.id}`,
          name: cardDef.name,
          description: cardDef.description,
          timeLimitSeconds: cardDef.estimatedMinutes * 60,
          items,
        },
      ],
    };
  }

  private fallbackCareerDecision(
    cardDef: PsychometricCardDef,
    profile: CandidateProfile,
  ): CareerDecisionResult {
    const isTech = cardDef.id === 'cognitive_ability' || cardDef.id === 'career_interest';
    return {
      summary:
        'You show practical thinking, clear task focus, and steady decision-making when solving real-world problems.',
      whatYouCanBecome: isTech
        ? [
            {
              role: 'Full-Stack Software Developer',
              field: 'Technology & Web Engineering',
              matchPct: 94,
              whyYouFit:
                'Your structured logic and clear problem-solving steps match building high-quality software applications.',
            },
            {
              role: 'Data & Systems Analyst',
              field: 'Analytics & Cloud Computing',
              matchPct: 88,
              whyYouFit:
                'You naturally spot patterns, ask the right questions, and organize numbers with accuracy.',
            },
            {
              role: 'Product Operations Specialist',
              field: 'Tech Startups & Modern Teams',
              matchPct: 85,
              whyYouFit:
                'You bridge technical details with daily team coordination and practical execution.',
            },
          ]
        : [
            {
              role: 'Operations & Project Coordinator',
              field: 'Business & Team Management',
              matchPct: 92,
              whyYouFit:
                'You keep tasks organized, handle pressure calmly, and communicate clearly across teams.',
            },
            {
              role: 'Client Relationship & Solutions Lead',
              field: 'Consulting & Business Growth',
              matchPct: 87,
              whyYouFit:
                'You understand people needs, listen closely, and resolve tricky situations with common sense.',
            },
            {
              role: 'Quality & Process Specialist',
              field: 'Enterprise & Operations',
              matchPct: 84,
              whyYouFit:
                'You take responsibility for results, respect rules, and deliver clean, trustworthy work.',
            },
          ],
      coreStrengths: [
        'Practical problem-solving under tight timelines',
        'Clear, calm communication with teammates and leaders',
        'Strong sense of responsibility for final deliverables',
      ],
      workStyle:
        'You work best with clear milestones, honest feedback, and the autonomy to find the smartest route to the goal.',
      intentAndDrivers:
        'You are driven by continuous learning, seeing tangible results from your effort, and earning respect for solid work.',
      actionableNextSteps: [
        'Build a hands-on portfolio or project demonstrating your primary analytical strength.',
        'Practice taking ownership of end-to-end deliverables to stand out in interviews.',
        'Connect with professionals currently in your top recommended role to understand their day-to-day work.',
      ],
    };
  }

  /**
   * Backward-compatible legacy generator for general psychometric testing.
   */
  public async generateLiveExam(targetExam: string = 'Main'): Promise<GeneratedPsychometricExam> {
    const defaultProfile: CandidateProfile = {
      age: 18,
      professionStatus: 'student',
      studentLevel: 'intermediate',
      stream: targetExam,
    };
    return this.generateCardExam('cognitive_ability', defaultProfile);
  }

  public generateFromRandomizedBank(examId: string, targetExam: string): GeneratedPsychometricExam {
    const defaultProfile: CandidateProfile = {
      age: 18,
      professionStatus: 'student',
      studentLevel: 'intermediate',
      stream: targetExam,
    };
    return this.generateCardFallback(examId, PSYCHOMETRIC_CARDS[0]!, defaultProfile);
  }
}

export const deepSeekPsychometricService = new DeepSeekPsychometricService();
