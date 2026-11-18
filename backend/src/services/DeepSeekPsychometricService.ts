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

const PSYCHOMETRIC_SYSTEM_PROMPT = `You are a real-world career mentor and practical psychometrician.
You anchor all evaluations in authoritative scientific frameworks:
- Cognitive & Aptitude: Cattell–Horn–Carroll (CHC Theory: Fluid reasoning Gf, visual-spatial Gv, working memory), Spearman's g Model, Bloom's Taxonomy (Analyze, Evaluate), and Critical Thinking.
- Personality: Big Five / OCEAN, HEXACO (Honesty-Humility factor), DISC Assessment, Myers-Briggs (MBTI), and Hogan (HPI/HDS).
- Situational Judgment: SJT Scenario-Decision Framework, STAR Method, Behaviorally Anchored Rating Scales (BARS), and Critical Incident Technique.
- Emotional Intelligence: Mayer–Salovey–Caruso Ability Model (MSCEIT) and Daniel Goleman Competency Model (Self-awareness, Emotion regulation, Empathy, Relationship management).
- Motivation & Values: Schwartz Theory of Basic Human Values, Self-Determination Theory (SDT: Autonomy, Competence, Relatedness), and Goal Orientation Theory.
- Workplace Competency: SHL Great Eight Competencies and Korn Ferry Leadership Architect (Lominger).
- Career Interests: Holland RIASEC Codes (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) and O*NET Occupational Framework.
- Integrity & Ethics: Cognitive Moral Development and workplace compliance risk judgment.

CRITICAL TONE & VOCABULARY RULES:
1. USE SIMPLE, PLAIN, DOWN-TO-EARTH CONVERSATIONAL ENGLISH.
   - Absolutely ZERO posh, fancy corporate or academic buzzwords (NEVER use words like "resilience", "determination", "grit", "cognitive fortitude", "somatic", "synergistic", "stakeholder triage").
   - Use language real people use every day: projects, deadlines, homework, exams, team members, customers, boss, software bugs, making mistakes, solving problems, and career choices.
2. ABSOLUTE FORBIDDEN TERM:
   - NEVER use the word "tuition" under any circumstances.
3. RIGOROUS DIFFICULTY CALIBRATION:
   - For cognitive and reasoning questions:
     * If the candidate is a school student (e.g., Class 10): questions MUST match real 10th-grade academic rigor (algebraic word problems, ratio/proportion systems, geometry logic, speed-distance-time, probability/permutation logic, or logical syllogisms). NEVER ask childish 5th-grade arithmetic like basic single-step percentages ("45 out of 60").
     * If Intermediate (11th-12th): pre-college analytical reasoning, function logic, deductive puzzles.
     * If College / Graduate / Employed: campus recruitment / corporate aptitude testing standard (multi-step data analysis, critical deduction, pattern matrices).
4. STRICT SCENARIO RULES (NO LAZY ONE-LINERS):
   - Whenever scenarioText is provided, it MUST be a clear, vivid, multi-sentence real-world situation (2 to 4 complete sentences).
   - It MUST describe a concrete incident with characters, actions, a conflict or challenge, and real stakes (e.g. what went wrong, who was involved, what deadline or relationship is at risk).
   - STRICTLY FORBIDDEN: NEVER write lazy one-liner instructions as scenarios (e.g. NEVER write "Think about how you respond to others' feelings", "Consider how you handle stressful situations", "Reflect on your teamwork", or "Imagine that...").
   - For direct self-report statements (Likert 1-5 agreement on general habits or personal traits), DO NOT create placeholder scenarios — set "scenarioText": null.
5. TAILOR SCENARIO CONTEXT TO CANDIDATE BACKGROUND:
   - School student: school projects, homework, exams, teacher feedback, sports/club activities.
   - College / UG / PG: college presentations, lab work, coding/engineering projects, campus recruitment, internships.
   - Employed professional: workplace meetings, deadlines, client issues, code reviews, coworker collaboration.
   - Job seeker: skill building, interviews, practical tasks, portfolio projects.
6. FORMAT DIVERSITY:
   - Reasoning / Logic: 4 options (A, B, C, D) with one clear "correctAnswer".
   - Dilemma / SJT: 4 realistic behavioral action options reflecting effective to ineffective choices.
   - Frequency / Habits: 5-point scale (Never, Rarely, Sometimes, Often, Always).
   - Values / Work Style: 5-point scale (Strongly Disagree, Disagree, Neutral, Agree, Strongly Agree).
7. Output MUST be ONLY valid JSON matching the requested schema. No markdown outside the JSON.`;

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

SUBTOPICS TO COVER:
${cardDef.subtopics.map((s, i) => `${i + 1}. ${s}`).join('\n')}

THEORETICAL PSYCHOMETRIC FRAMEWORKS ANCHORING THIS TEST:
${cardDef.frameworks.map((f, i) => `${i + 1}. ${f}`).join('\n')}

CANDIDATE BACKGROUND:
${profileSummary}

SPECIFIC ASSESSMENT INSTRUCTIONS:
- Generate exactly 8 distinct questions directly covering the subtopics and anchored in the frameworks.
- If this is Cognitive Ability: Apply Cattell–Horn–Carroll (CHC Theory: Gf fluid reasoning, Gv visual-spatial, working memory) and Bloom's Taxonomy (Analyze, Evaluate). STRICT CALIBRATION: Match the candidate's exact level (${profileSummary}). If Class 10, generate genuine 10th-grade multi-step algebra word problems, ratio-proportion equations, geometric logic, or logical deductions. NEVER ask childish 5th-grade math like basic single-step percentages.
- If Personality: Ground in Big Five / OCEAN and HEXACO. Use natural everyday behavioral questions.
- If Situational Judgment: Ground in SJT, STAR Method, and BARS. Present a realistic scenario and 4 clear behavioral action choices (A, B, C, D) ranging from most effective to counterproductive.
- If Emotional Intelligence: Ground in Mayer–Salovey–Caruso (MSCEIT) and Goleman Competency Model (Self-awareness, Emotion regulation, Empathy, Relationship management).
- If Motivation & Work-Values: Ground in Schwartz Basic Human Values and Self-Determination Theory (Autonomy, Competence, Relatedness).
- If Behavioral & Work-Style: Ground in SHL Great Eight Competencies (Analyzing, Supporting, Organizing, Adapting, Executing).
- If Career Interests: Ground in Holland RIASEC Codes (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) and O*NET.
- If Integrity & Risk: Ground in Cognitive Moral Development and workplace ethical decision-making.

CRITICAL SCENARIO MANDATE:
- When writing a scenario (especially for Situational Judgment, Emotional Intelligence dilemmas, or practical challenges), write a real, multi-sentence story (2 to 4 full sentences). Describe a specific situation, people involved, the tension, and what decision is needed.
  * Good example: "During a major group project worth 30% of your grade, your team divided the work equally. Two days before the deadline, one member texts saying they were unable to finish their section due to personal issues, leaving your group with an incomplete deck."
  * STRICTLY FORBIDDEN: NEVER write lazy one-liners like "Think about how you respond to others' feelings" or "Consider how you handle stressful situations".
- For general self-assessment statements (e.g. agreement scales on personal traits), set "scenarioText": null.

TONE & RULES:
- Zero posh words! No "resilience", "determination", "grit", or complex academic jargon.
- NEVER use the forbidden word "tuition".
- Keep every question in simple, natural, conversational English.

Format output as JSON:
{
  "title": "${cardDef.name}",
  "description": "${cardDef.description}",
  "items": [
    {
      "id": "item_1",
      "section": "${cardDef.id}",
      "construct": "Subtopic name here",
      "subFacet": "Framework aspect (e.g. CHC Fluid Reasoning / Big Five Conscientiousness / Goleman Empathy)",
      "itemType": "COGNITIVE_MCQ | SCENARIO_ACTION_MCQ | FREQUENCY_SCALE | AGREEMENT_LIKERT",
      "scenarioText": "A detailed 2-4 sentence realistic story, OR null if self-assessment statement",
      "promptText": "The exact question in simple plain English",
      "options": [
        {"id": "A", "text": "Option 1"},
        {"id": "B", "text": "Option 2"},
        {"id": "C", "text": "Option 3"},
        {"id": "D", "text": "Option 4"}
      ],
      "correctAnswer": "A (optional for cognitive questions with an objective right answer)"
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

    const items: PsychometricQuestionData[] = parsed.items.map((item, idx) => {
      let cleanScenario = item.scenarioText ? item.scenarioText.trim() : undefined;
      // Strip lazy one-liner pseudo-scenarios
      if (cleanScenario) {
        if (
          cleanScenario.length < 50 ||
          /^think about|^consider how|^reflect on|^imagine how|^in this scenario|^how do you respond/i.test(cleanScenario)
        ) {
          cleanScenario = undefined;
        }
      }

      return {
        ...item,
        id: item.id || `psy_${cardDef.id}_${idx + 1}_${Date.now()}`,
        section: (item.section as any) || cardDef.id,
        scenarioText: cleanScenario,
        orderIndex: idx + 1,
      };
    });

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
Frameworks Evaluated: ${cardDef.frameworks.join(', ')}

CANDIDATE BACKGROUND:
${profileSummary}

THEIR TEST RESPONSES:
${responses.map((r, i) => `${i + 1}. [${r.construct || 'Area'}] ${r.promptText} -> Answer: ${r.answer}`).join('\n')}

RULES:
- Plain everyday conversational English. No fancy posh buzzwords (NO "resilience", "determination", "grit").
- NEVER use the word "tuition".
- Recommend 3 to 4 specific, real-world career paths or roles they can become based on their answers and background.
- Give concrete reasons why their mindset, cognitive style, and problem-solving tendencies fit.

Format as JSON:
{
  "summary": "2-3 plain sentences summarizing their core thinking, behavioral tendencies, and cognitive style.",
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
        school: 'School Student',
        intermediate: '11th-12th / Intermediate',
        ug: 'Undergraduate / College (UG)',
        pg: 'Postgraduate / Masters (PG)',
      };
      const levelLabel = levelMap[profile.studentLevel ?? 'ug'] ?? 'College Student';
      parts.push(`- Status: Student (${levelLabel})`);

      if (profile.studentLevel === 'school') {
        const classMap: Record<string, string> = {
          class_4: 'Class 4 (Primary)',
          class_5: 'Class 5 (Primary)',
          class_6: 'Class 6',
          class_7: 'Class 7',
          class_8: 'Class 8',
          class_9: 'Class 9',
          class_10: 'Class 10 (Secondary Board Exam level)',
        };
        const classLabel = classMap[profile.schoolClass ?? 'class_10'] ?? 'Class 10';
        parts.push(`- Exact Class: ${classLabel}`);
        if (profile.schoolClass === 'class_4' || profile.schoolClass === 'class_5') {
          parts.push(
            `- CALIBRATION MANDATE: The student is in ${classLabel} (around 9-11 years old). Questions must match primary school reasoning: foundational word problems (multiplication, division in everyday scenarios like sharing books, simple patterns, visual fractions, and logic). Keep language extremely clear and simple.`,
          );
        } else {
          parts.push(
            `- CALIBRATION MANDATE: The student is in ${classLabel}. Questions MUST strictly match genuine ${classLabel} academic rigor. For Class 10, ask multi-step algebra word problems, ratio/proportion equations, speed-distance-time, geometric logic, or deduction. STRICTLY FORBIDDEN: Do NOT ask elementary 5th-grade math like basic single-step percentages ('45 out of 60') for higher grades.`,
          );
        }
      } else if (profile.studentLevel === 'intermediate') {
        parts.push(
          `- CALIBRATION MANDATE: Intermediate (11th-12th). Reasoning questions should test pre-college analytical thinking, function/algebra logic, and systematic problem solving.`,
        );
      } else {
        parts.push(
          `- CALIBRATION MANDATE: Higher education (UG/PG). Reasoning questions should test campus recruitment / graduate aptitude level critical thinking, data logic, and multi-step problem solving.`,
        );
      }

      if (profile.stream) parts.push(`- Stream / Focus: ${profile.stream}`);
    } else if (profile.professionStatus === 'employed') {
      parts.push(`- Status: Working Professional`);
      if (profile.jobTitle) parts.push(`- Role: ${profile.jobTitle}`);
      if (profile.companyType) parts.push(`- Industry / Company: ${profile.companyType}`);
      parts.push(
        `- CALIBRATION MANDATE: Working professional. Scenarios must reflect real workplace projects, team dynamics, deadlines, and cross-functional problem-solving.`,
      );
    } else {
      parts.push(`- Status: Looking for Job / Early Career`);
      if (profile.highestQualification) parts.push(`- Education: ${profile.highestQualification}`);
      if (profile.targetRole) parts.push(`- Target Field: ${profile.targetRole}`);
      parts.push(
        `- CALIBRATION MANDATE: Job seeker / Fresher. Scenarios must reflect interview preparation, practical skill evaluation, and real problem-solving.`,
      );
    }
    return parts.join('\n');
  }

  private generateCardFallback(
    examId: string,
    cardDef: PsychometricCardDef,
    profile: CandidateProfile,
  ): GeneratedPsychometricExam {
    const isStudent = profile.professionStatus === 'student';

    // Tailored cognitive questions with proper calibration
    const getCognitiveItems = (): PsychometricQuestionData[] => {
      const isClass10 = profile.studentLevel === 'school' && (profile.schoolClass === 'class_10' || !profile.schoolClass);
      
      if (isClass10) {
        return [
          {
            id: 'item_cog_1',
            section: 'COGNITIVE' as any,
            construct: 'Numerical reasoning',
            subFacet: 'CHC Theory: Fluid Reasoning (Gf)',
            itemType: 'COGNITIVE_MCQ',
            scenarioText: 'A train traveling at 54 km/h crosses a 180-meter long platform in 20 seconds.',
            promptText: 'What is the length of the train?',
            options: [
              { id: 'A', text: '100 meters' },
              { id: 'B', text: '120 meters' },
              { id: 'C', text: '140 meters' },
              { id: 'D', text: '150 meters' },
            ],
            correctAnswer: 'B',
            orderIndex: 1,
          },
          {
            id: 'item_cog_2',
            section: 'COGNITIVE' as any,
            construct: 'Logical reasoning',
            subFacet: 'Critical Thinking: Syllogistic Deduction',
            itemType: 'COGNITIVE_MCQ',
            scenarioText: 'In a school survey of 150 students: 90 like science, 70 like computer programming, and 40 like both.',
            promptText: 'How many students like exactly one of the two subjects?',
            options: [
              { id: 'A', text: '60' },
              { id: 'B', text: '80' },
              { id: 'C', text: '100' },
              { id: 'D', text: '110' },
            ],
            correctAnswer: 'B',
            orderIndex: 2,
          },
          {
            id: 'item_cog_3',
            section: 'COGNITIVE' as any,
            construct: 'Verbal reasoning',
            subFacet: 'Bloom\'s Taxonomy: Analyze Argument',
            itemType: 'COGNITIVE_MCQ',
            promptText: 'Consider this statement: "Every student who finishes their daily practice on time does well in the mock test. Rohan did well in the mock test. Therefore, Rohan finished his daily practice on time." Is this conclusion logically sound?',
            options: [
              { id: 'A', text: 'Yes, it is a logically necessary conclusion.' },
              { id: 'B', text: 'No, doing well does not prove daily practice was the only reason.' },
              { id: 'C', text: 'Yes, because practice always leads to mock test success.' },
              { id: 'D', text: 'It cannot be evaluated from the given information.' },
            ],
            correctAnswer: 'B',
            orderIndex: 3,
          },
          {
            id: 'item_cog_4',
            section: 'COGNITIVE' as any,
            construct: 'Abstract reasoning',
            subFacet: 'CHC Theory: Induction Pattern Analysis',
            itemType: 'COGNITIVE_MCQ',
            promptText: 'Find the next number in this sequence: 3, 7, 15, 31, 63, ?',
            options: [
              { id: 'A', text: '125' },
              { id: 'B', text: '127' },
              { id: 'C', text: '129' },
              { id: 'D', text: '131' },
            ],
            correctAnswer: 'B',
            orderIndex: 4,
          },
          {
            id: 'item_cog_5',
            section: 'COGNITIVE' as any,
            construct: 'Spatial reasoning',
            subFacet: 'CHC Theory: Visual Processing (Gv)',
            itemType: 'COGNITIVE_MCQ',
            scenarioText: 'A large wooden cube of side 4 cm is painted red on all 6 faces and then cut into unit cubes of side 1 cm.',
            promptText: 'How many of the 1 cm cubes have exactly two painted faces?',
            options: [
              { id: 'A', text: '16' },
              { id: 'B', text: '24' },
              { id: 'C', text: '32' },
              { id: 'D', text: '8' },
            ],
            correctAnswer: 'B',
            orderIndex: 5,
          },
          {
            id: 'item_cog_6',
            section: 'COGNITIVE' as any,
            construct: 'Critical thinking and problem-solving',
            subFacet: 'Algebraic Optimization',
            itemType: 'COGNITIVE_MCQ',
            scenarioText: 'A rectangular study area has its length 4 meters greater than its width. If the perimeter is 48 meters, what is the area?',
            promptText: 'Select the correct area calculation:',
            options: [
              { id: 'A', text: '120 sq meters' },
              { id: 'B', text: '140 sq meters' },
              { id: 'C', text: '154 sq meters' },
              { id: 'D', text: '160 sq meters' },
            ],
            correctAnswer: 'B',
            orderIndex: 6,
          },
          {
            id: 'item_cog_7',
            section: 'COGNITIVE' as any,
            construct: 'Problem-solving speed and accuracy',
            subFacet: 'Work-Rate Proportions',
            itemType: 'COGNITIVE_MCQ',
            promptText: 'If 6 students working together take 12 hours to build a working science model, how many students working at the same pace are needed to build it in 8 hours?',
            options: [
              { id: 'A', text: '7' },
              { id: 'B', text: '9' },
              { id: 'C', text: '10' },
              { id: 'D', text: '12' },
            ],
            correctAnswer: 'B',
            orderIndex: 7,
          },
          {
            id: 'item_cog_8',
            section: 'COGNITIVE' as any,
            construct: 'Numerical reasoning',
            subFacet: 'Ratio & Proportions Logic',
            itemType: 'COGNITIVE_MCQ',
            scenarioText: 'The ratio of present ages of two siblings is 5:3. Five years ago, the ratio was 2:1.',
            promptText: 'What is the sum of their present ages?',
            options: [
              { id: 'A', text: '32 years' },
              { id: 'B', text: '40 years' },
              { id: 'C', text: '48 years' },
              { id: 'D', text: '50 years' },
            ],
            correctAnswer: 'B',
            orderIndex: 8,
          },
        ];
      }

      // Default high-level cognitive items for intermediate/UG/PG/employed
      return [
        {
          id: 'item_cog_1',
          section: 'COGNITIVE' as any,
          construct: 'Numerical reasoning',
          subFacet: 'CHC Theory: Fluid Reasoning (Gf)',
          itemType: 'COGNITIVE_MCQ',
          scenarioText: 'A project team needs to allocate a server budget. System A costs $400/month with 99.9% uptime. System B costs $250/month with 98% uptime. An outage costs $1000 per 1% downtime per month.',
          promptText: 'Which system is more cost-effective on average per month?',
          options: [
            { id: 'A', text: 'System A saves approximately $1,750 per month' },
            { id: 'B', text: 'System B saves approximately $150 per month' },
            { id: 'C', text: 'Both systems cost the exact same total' },
            { id: 'D', text: 'System A is cheaper only if uptime exceeds 99.99%' },
          ],
          correctAnswer: 'A',
          orderIndex: 1,
        },
        {
          id: 'item_cog_2',
          section: 'COGNITIVE' as any,
          construct: 'Logical reasoning',
          subFacet: 'Deductive Syllogism',
          itemType: 'COGNITIVE_MCQ',
          promptText: 'All microservices communicate via REST or gRPC. Service Alpha communicates only via message queues. Which conclusion is correct?',
          options: [
            { id: 'A', text: 'Service Alpha is not one of these microservices.' },
            { id: 'B', text: 'Service Alpha communicates with all microservices.' },
            { id: 'C', text: 'Service Alpha must use REST as a backup.' },
            { id: 'D', text: 'Some microservices communicate via message queues.' },
          ],
          correctAnswer: 'A',
          orderIndex: 2,
        },
        {
          id: 'item_cog_3',
          section: 'COGNITIVE' as any,
          construct: 'Critical thinking and problem-solving',
          subFacet: 'Bloom\'s Taxonomy: Evaluate Evidence',
          itemType: 'COGNITIVE_MCQ',
          scenarioText: 'A website observes that users who read the FAQ page convert 40% more often than users who do not.',
          promptText: 'What is the most accurate conclusion to draw from this data alone?',
          options: [
            { id: 'A', text: 'Reading the FAQ directly causes higher conversions.' },
            { id: 'B', text: 'Users who are already highly interested are more likely to seek out the FAQ.' },
            { id: 'C', text: 'Removing the FAQ will drop conversions by 40%.' },
            { id: 'D', text: 'Forcing all users to read the FAQ will guarantee higher sales.' },
          ],
          correctAnswer: 'B',
          orderIndex: 3,
        },
        {
          id: 'item_cog_4',
          section: 'COGNITIVE' as any,
          construct: 'Abstract reasoning',
          subFacet: 'CHC Theory: Matrix Logic',
          itemType: 'COGNITIVE_MCQ',
          promptText: 'Identify the missing term: B2D, D4F, F8H, H16J, ?',
          options: [
            { id: 'A', text: 'J24L' },
            { id: 'B', text: 'J32L' },
            { id: 'C', text: 'I32K' },
            { id: 'D', text: 'K32M' },
          ],
          correctAnswer: 'B',
          orderIndex: 4,
        },
        {
          id: 'item_cog_5',
          section: 'COGNITIVE' as any,
          construct: 'Spatial reasoning',
          subFacet: 'CHC Theory: Visual Spatial Manipulation (Gv)',
          itemType: 'COGNITIVE_MCQ',
          promptText: 'If a 3x3x3 cube is formed by 27 smaller unit cubes, how many unit cubes are completely hidden on the inside with no exterior face exposed?',
          options: [
            { id: 'A', text: '1' },
            { id: 'B', text: '2' },
            { id: 'C', text: '4' },
            { id: 'D', text: '8' },
          ],
          correctAnswer: 'A',
          orderIndex: 5,
        },
        {
          id: 'item_cog_6',
          section: 'COGNITIVE' as any,
          construct: 'Analytical reasoning',
          subFacet: 'Data Interpretation',
          itemType: 'COGNITIVE_MCQ',
          promptText: 'A project has 4 sequential phases: Design (15%), Development (45%), Testing (25%), Deployment (15%). If Development took 36 working days, how long will the entire project take at the same pace?',
          options: [
            { id: 'A', text: '72 days' },
            { id: 'B', text: '80 days' },
            { id: 'C', text: '90 days' },
            { id: 'D', text: '100 days' },
          ],
          correctAnswer: 'B',
          orderIndex: 6,
        },
        {
          id: 'item_cog_7',
          section: 'COGNITIVE' as any,
          construct: 'Verbal reasoning',
          subFacet: 'Critical Inference',
          itemType: 'COGNITIVE_MCQ',
          promptText: 'Choose the word pair that has the same relationship as: HYPOTHESIS : EXPERIMENT',
          options: [
            { id: 'A', text: 'Blueprints : Construction' },
            { id: 'B', text: 'Conclusion : Analysis' },
            { id: 'C', text: 'Error : Debugging' },
            { id: 'D', text: 'Law : Courtroom' },
          ],
          correctAnswer: 'A',
          orderIndex: 7,
        },
        {
          id: 'item_cog_8',
          section: 'COGNITIVE' as any,
          construct: 'Problem-solving',
          subFacet: 'Combinatorics Logic',
          itemType: 'COGNITIVE_MCQ',
          promptText: 'In a group of 6 team members, how many distinct 2-person collaboration pairs can be formed?',
          options: [
            { id: 'A', text: '12' },
            { id: 'B', text: '15' },
            { id: 'C', text: '18' },
            { id: 'D', text: '30' },
          ],
          correctAnswer: 'B',
          orderIndex: 8,
        },
      ];
    };

    let items: PsychometricQuestionData[];

    if (cardDef.id === 'cognitive_ability') {
      items = getCognitiveItems();
    } else if (cardDef.id === 'situational_judgment' || cardDef.id === 'integrity_risk') {
      const studentScenarios = [
        'During an important science exhibition project due tomorrow, your group split the work evenly. One team member has completely stopped answering messages in your group chat and has not submitted their slides. Your other two teammates want to report them immediately and remove their name from the project.',
        'During a mock test review, your teacher mistakenly awarded you 15 extra marks because of a grading tally error. These extra marks pushed your rank to first in the class, and several classmates are congratulating you.',
        'You and your lab partner need to complete an experiment by 4 PM. Your partner insists on taking a shortcut by copying older data instead of running the remaining chemical trials, claiming everyone else does the same.',
        'Two of your closest friends in a school club have had a serious argument over who should speak at the annual event. Both friends refuse to work together and both are pressuring you to publicly choose a side.',
        'You have three major commitments on the same afternoon: studying for an important math assessment, completing a computer project worth 20% of your grade, and attending a mandatory sports practice.',
        'A classmate approaches you during recess and asks if they can copy your completed homework assignment, saying they were dealing with an emergency at home and could not finish it.',
      ];
      const workScenarios = [
        'A critical client presentation is scheduled for tomorrow at 9 AM, but your teammate missed their core data deliverable. The client has explicitly stated that no postponements will be accepted under any circumstances.',
        'You notice an accounting formula error in an approved quarterly budget spreadsheet that underestimates project costs by 18%. Your manager has already submitted the summary to senior leadership.',
        'A customer calls in demanding an immediate refund for an issue that violates company policy. They are shouting and threatening to post negative reviews across social media if you do not grant it right now.',
        'Two key engineers on your sprint team strongly disagree on the database architecture, refusing to collaborate and delaying the sprint deliverable by several days.',
        'You have four competing deadlines by end-of-day: a client bug fix, quarterly KPI report, reviewing a teammate\'s pull request, and attending an all-hands strategy session.',
        'A senior colleague asks you to approve an expense report without the required receipt documentation, promising they will find the receipt and upload it sometime next week.',
      ];
      const scenarioPool = isStudent ? studentScenarios : workScenarios;

      items = cardDef.subtopics.map((st, idx) => ({
        id: `item_sjt_${idx + 1}`,
        section: 'SJT' as any,
        construct: st,
        subFacet: 'BARS & Critical Incident Method',
        itemType: 'SCENARIO_ACTION_MCQ',
        scenarioText: scenarioPool[idx % scenarioPool.length],
        promptText: 'What is the most constructive action you would take in this situation?',
        options: [
          { id: 'A', text: 'Assess the core root cause first, discuss practical alternatives with everyone involved, and agree on a clear next step.' },
          { id: 'B', text: 'Escalate the issue to the teacher or supervisor immediately and let them decide how to resolve it.' },
          { id: 'C', text: 'Take full responsibility and finish the extra work yourself quietly to prevent any conflict or delay.' },
          { id: 'D', text: 'Politely decline to get involved and stick strictly to your own individual tasks.' },
        ],
        orderIndex: idx + 1,
      }));
    } else if (cardDef.id === 'personality') {
      items = cardDef.subtopics.map((st, idx) => ({
        id: `item_pers_${idx + 1}`,
        section: 'BEHAVIORAL' as any,
        construct: st,
        subFacet: 'Big Five / OCEAN & HEXACO',
        itemType: idx % 2 === 0 ? 'FREQUENCY_SCALE' : 'AGREEMENT_LIKERT',
        promptText:
          idx % 2 === 0
            ? isStudent
              ? `When working on a school project, how often do you take the lead in organizing tasks and milestones for everyone?`
              : `In your daily work, how often do you take the initiative to organize team tasks and deadlines without waiting for instructions?`
            : `I feel energized when solving complex, open-ended problems with teammates rather than working completely in isolation.`,
        options:
          idx % 2 === 0
            ? [
                { id: '1', text: 'Never' },
                { id: '2', text: 'Rarely' },
                { id: '3', text: 'Sometimes' },
                { id: '4', text: 'Often' },
                { id: '5', text: 'Always' },
              ]
            : [
                { id: '1', text: 'Strongly Disagree' },
                { id: '2', text: 'Disagree' },
                { id: '3', text: 'Neutral' },
                { id: '4', text: 'Agree' },
                { id: '5', text: 'Strongly Agree' },
              ],
        orderIndex: idx + 1,
      }));
    } else if (cardDef.id === 'emotional_intelligence') {
      const eiScenarios = isStudent
        ? [
            'Your teacher returns a graded project that you spent two full weeks perfecting, giving you a surprisingly low score and criticizing your main arguments in front of the classroom.',
            'You notice your best friend sitting alone in the cafeteria with their head down. When you sit next to them, they wipe their eyes quickly and say everything is fine, but their voice is trembling.',
            'During a high-stakes group project, tensions boil over and two teammates begin shouting insults at each other while other students in the room stare.',
            'You are chosen as the team captain for an academic quiz team, and you must inform an enthusiastic friend that another classmate was selected for the final roster instead of them.',
          ]
        : [
            'During an all-hands team review, your department head publicly criticizes your proposal as inadequate and impractical, without giving you a chance to explain your supporting data.',
            'You notice a normally energetic colleague has become completely withdrawn and quiet over the past three days, missing deadlines and avoiding eye contact during meetings.',
            'A high-priority project deployment fails 30 minutes before client sign-off, and several teammates begin blaming each other in panic during an emergency call.',
            'You need to deliver critical constructive feedback to a direct peer whose missed commitments have caused your entire squad to work overtime over the weekend.',
          ];

      items = cardDef.subtopics.map((st, idx) => ({
        id: `item_ei_${idx + 1}`,
        section: 'BEHAVIORAL' as any,
        construct: st,
        subFacet: 'Goleman Competency & MSCEIT Ability Model',
        itemType: idx % 2 === 0 ? 'FREQUENCY_SCALE' : 'AGREEMENT_LIKERT',
        scenarioText: eiScenarios[idx % eiScenarios.length],
        promptText:
          idx % 2 === 0
            ? `In high-pressure moments like this, how often do you pause to control your emotional reaction before speaking or acting?`
            : `I can easily identify the unspoken emotions of others in tense situations and adapt my behavior to help calm them down.`,
        options:
          idx % 2 === 0
            ? [
                { id: '1', text: 'Never' },
                { id: '2', text: 'Rarely' },
                { id: '3', text: 'Sometimes' },
                { id: '4', text: 'Often' },
                { id: '5', text: 'Always' },
              ]
            : [
                { id: '1', text: 'Strongly Disagree' },
                { id: '2', text: 'Disagree' },
                { id: '3', text: 'Neutral' },
                { id: '4', text: 'Agree' },
                { id: '5', text: 'Strongly Agree' },
              ],
        orderIndex: idx + 1,
      }));
    } else if (cardDef.id === 'career_interest') {
      items = cardDef.subtopics.map((st, idx) => ({
        id: `item_ci_${idx + 1}`,
        section: 'INTEREST' as any,
        construct: st,
        subFacet: 'Holland RIASEC Codes & O*NET',
        itemType: 'PASSION_SCALE' as any,
        promptText: `How much do you enjoy activities involving: "${st}"? (e.g. building things, solving data puzzles, designing visuals, or helping people solve practical challenges)`,
        options: [
          { id: '1', text: 'Dislike strongly' },
          { id: '2', text: 'Dislike somewhat' },
          { id: '3', text: 'Neutral' },
          { id: '4', text: 'Enjoy' },
          { id: '5', text: 'Love doing this' },
        ],
        orderIndex: idx + 1,
      }));
    } else {
      // Motivation / Behavioral cards
      items = cardDef.subtopics.map((st, idx) => ({
        id: `item_gen_${idx + 1}`,
        section: 'BEHAVIORAL' as any,
        construct: st,
        subFacet: 'Schwartz Human Values & SHL Great Eight',
        itemType: idx % 2 === 0 ? 'AGREEMENT_LIKERT' : 'FREQUENCY_SCALE',
        promptText:
          idx % 2 === 0
            ? `I am most satisfied when my day-to-day work allows me to learn new technical skills and tackle unsolved challenges.`
            : `When facing an unexpected obstacle in your work or studies, how often do you test alternative approaches before asking for help?`,
        options:
          idx % 2 === 0
            ? [
                { id: '1', text: 'Strongly Disagree' },
                { id: '2', text: 'Disagree' },
                { id: '3', text: 'Neutral' },
                { id: '4', text: 'Agree' },
                { id: '5', text: 'Strongly Agree' },
              ]
            : [
                { id: '1', text: 'Never' },
                { id: '2', text: 'Rarely' },
                { id: '3', text: 'Sometimes' },
                { id: '4', text: 'Often' },
                { id: '5', text: 'Always' },
              ],
        orderIndex: idx + 1,
      }));
    }

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
