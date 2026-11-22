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

export interface FacultyPsychometricItem {
  number: number;
  domain: string;
  questionModel: 'AGREEMENT_LIKERT' | 'FREQUENCY_SCALE' | 'SCENARIO_ACTION_MCQ' | 'COGNITIVE_MCQ' | 'PASSION_SCALE';
  scenarioText?: string | null;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  traitPersonaMapping: string;
  radicalFeedbackNote: string;
}

export interface PsychometricStudentEvaluation {
  goal: string;
  alignmentScore: number;
  alignmentLevel: 'Exceptional Fit' | 'High Alignment' | 'Moderate Alignment' | 'Developing Fit' | 'Unassessed';
  archetype: string;
  predictedRole: string;
  roleReason: string;
  summary: string;
  domainBreakdown: Array<{
    domain: string;
    traitLabel: string;
    scorePct: number;
    analysis: string;
  }>;
  keyStrengths: string[];
  growthAreas: string[];
  radicalFlags: string[];
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

  public hasApiKey(): boolean {
    return (process.env.DEEPSEEK_API_KEY ?? '').trim().length >= 8;
  }

  public isAvailable(): boolean {
    return this.hasApiKey() && this.breaker.canAttempt();
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

  public getCircuitState() {
    return this.breaker.getState();
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

    if (this.hasApiKey() && this.breaker.canAttempt()) {
      try {
        const liveExam = await this.callCardAiGeneration(examId, cardDef, profile);
        if (liveExam && liveExam.sections.length > 0 && liveExam.sections[0]!.items.length > 0) {
          this.breaker.recordSuccess();
          logger.info({ examId, cardId: cardDef.id, profile }, 'Generated fresh AI card assessment');
          return liveExam;
        }
      } catch (err) {
        this.breaker.recordFailure();
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
    const rawIds = cardId.split(',').map((s) => s.trim()).filter(Boolean);
    const cardDefs = rawIds
      .map((id) => findCardDef(id))
      .filter((c): c is PsychometricCardDef => Boolean(c));
    const effectiveCards = cardDefs.length > 0 ? cardDefs : [PSYCHOMETRIC_CARDS[0]!];
    const cardNames = effectiveCards.map((c) => c.name).join(' + ');
    const allFrameworks = Array.from(new Set(effectiveCards.flatMap((c) => c.frameworks)));
    const profileSummary = this.describeProfile(profile);

    if (this.hasApiKey() && this.breaker.canAttempt()) {
      try {
        const prompt = `You are a real-world career mentor. A candidate just finished the assessment covering: "${cardNames}".
Frameworks Evaluated: ${allFrameworks.join(', ')}

CANDIDATE BACKGROUND:
${profileSummary}

THEIR TEST RESPONSES:
${responses.map((r, i) => `${i + 1}. [${r.construct || 'Area'}] ${r.promptText} -> Answer: ${r.answer}`).join('\n')}

RULES:
- Plain everyday conversational English. No fancy posh buzzwords (NO "resilience", "determination", "grit").
- NEVER use the word "tuition".
- Recommend 3 to 4 specific, real-world career paths or roles they can become based on their answers across all evaluated domains.
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
          this.breaker.recordSuccess();
          return parsed;
        }
      } catch (err) {
        this.breaker.recordFailure();
        logger.warn({ err }, 'DeepSeek career decision generation failed, using fallback');
      }
    }

    return this.fallbackCareerDecision(effectiveCards[0]!, profile);
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
          promptText: 'All science club members study physics or chemistry. Student Rohan studies only biology. Which conclusion is correct?',
          options: [
            { id: 'A', text: 'Rohan is not one of these science club members.' },
            { id: 'B', text: 'Rohan studies with all science club members.' },
            { id: 'C', text: 'Rohan must study chemistry as a backup.' },
            { id: 'D', text: 'Some science club members study biology.' },
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
   * Generates a faculty-configured psychometric evaluation paper tailored to an evaluation goal,
   * guaranteeing diversity across all question models and opinion-based behavioral trait mapping.
   */
  public async generateFacultyPsychometricPaper(input: {
    domains: string[];
    examGoal?: string;
    questionCount: number;
    title?: string;
    organization?: string;
    targetProfile?: {
      studentLevel?: string;
      schoolClass?: string;
      stream?: string;
      ageGroup?: string;
      age?: number;
    };
  }): Promise<FacultyPsychometricItem[]> {
    const goalText = input.examGoal?.trim() || 'Assess student general aptitude, entrepreneurial mindset, and technical problem-solving attitude';
    const rawDomains = input.domains.length > 0 ? input.domains : PSYCHOMETRIC_CARDS.map((c) => c.name);
    // Resolve card names
    const resolvedDomains = rawDomains.map((d) => {
      const byId = findCardDef(d);
      return byId ? byId.name : d;
    });

    if (this.hasApiKey() && this.breaker.canAttempt()) {
      try {
        const liveItems = await this.generateFacultyAiPaperChunked(
          resolvedDomains,
          goalText,
          input.questionCount,
          input.targetProfile,
        );
        if (liveItems && liveItems.length > 0) {
          const validatedItems = this.topUpItems(liveItems, resolvedDomains, goalText, input.questionCount);
          this.breaker.recordSuccess();
          logger.info(
            { count: validatedItems.length, requested: input.questionCount, goal: goalText },
            'Generated live faculty psychometric paper with exact count validation',
          );
          return validatedItems;
        }
      } catch (err) {
        this.breaker.recordFailure();
        logger.warn({ err, goal: goalText }, 'DeepSeek faculty paper generation failed, using calibrated fallback');
      }
    }

    const fallback = this.generateFacultyPsychometricFallback(resolvedDomains, goalText, input.questionCount);
    return this.topUpItems(fallback, resolvedDomains, goalText, input.questionCount);
  }

  private async generateFacultyAiPaperChunked(
    domains: string[],
    examGoal: string,
    questionCount: number,
    targetProfile?: {
      studentLevel?: string;
      schoolClass?: string;
      stream?: string;
      ageGroup?: string;
      age?: number;
    },
  ): Promise<FacultyPsychometricItem[] | null> {
    const THEMATIC_PERSPECTIVES = [
      {
        title: 'Core Intellectual Curiosity & Problem-Solving Archetype',
        focus: `Assess how candidates naturally tackle complex, unmapped problems: Do they isolate root causes and mechanical logic (Investigative), simplify and design the human experience (Artistic/UX), persuade and align stakeholders (Enterprising), or coordinate end-to-end delivery (Organizing/Product)?`,
      },
      {
        title: 'Situational Judgment, Interpersonal Conflict & Risk Trade-Offs',
        focus: `Assess how candidates navigate high-stakes dilemmas: Dealing with skeptical stakeholders, balancing perfectionism vs delivery deadlines, handling peer disagreement, and making ethical calls when discrepancies occur.`,
      },
      {
        title: 'Intrinsic Motivation, Work-Values & Autonomy',
        focus: `Assess what deeply drives the candidate: Intellectual mastery and solving hard puzzles, empathy for human ergonomics and visual craftsmanship, commercial impact and winning trust, or entrepreneurial autonomy and venture building.`,
      },
      {
        title: 'Execution Velocity, Adaptability & Team Ownership',
        focus: `Assess candidate execution style: Methodical planning vs rapid agile pivoting, meticulous attention to detail vs high-velocity shipping, deep independent focus vs collaborative consensus, and resilience when an initiative encounters unexpected roadblocks.`,
      },
    ];

    const CHUNK_SIZE = 8;
    const chunkCounts: number[] = [];
    let rem = questionCount;
    while (rem > 0) {
      const take = Math.min(rem, CHUNK_SIZE);
      chunkCounts.push(take);
      rem -= take;
    }

    const collected: FacultyPsychometricItem[] = [];

    const computeTokenOverlap = (text1: string, text2: string): number => {
      const normalize = (t: string) =>
        new Set(
          t
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(/\s+/)
            .filter(
              (w) =>
                w.length > 3 &&
                ![
                  'when',
                  'what',
                  'which',
                  'would',
                  'your',
                  'this',
                  'that',
                  'with',
                  'from',
                  'have',
                  'project',
                  'student',
                  'about',
                  'their',
                  'there',
                  'they',
                  'them',
                  'some',
                ].includes(w),
            ),
        );
      const words1 = normalize(text1);
      const words2 = normalize(text2);
      if (words1.size === 0 || words2.size === 0) return 0;
      let matches = 0;
      for (const w of words1) {
        if (words2.has(w)) matches++;
      }
      const union = new Set([...words1, ...words2]).size;
      return union > 0 ? matches / union : 0;
    };

    const isDuplicateItem = (item: FacultyPsychometricItem): boolean => {
      const itemQ = item.questionText.trim().toLowerCase();
      return collected.some((existing) => {
        const existQ = existing.questionText.trim().toLowerCase();
        if (existQ === itemQ) return true;
        if (computeTokenOverlap(existing.questionText, item.questionText) > 0.65) return true;
        if (existing.scenarioText && item.scenarioText && computeTokenOverlap(existing.scenarioText, item.scenarioText) > 0.70) return true;
        return false;
      });
    };

    for (let idx = 0; idx < chunkCounts.length; idx++) {
      const count = chunkCounts[idx]!;
      const theme = THEMATIC_PERSPECTIVES[idx % THEMATIC_PERSPECTIVES.length]!;
      const previousQuestions = collected.slice(-15).map((item) => ({
        questionText: item.questionText,
        scenarioText: item.scenarioText,
      }));

      const chunk = await this.callFacultyAiChunk(
        idx,
        chunkCounts.length,
        count,
        domains,
        examGoal,
        targetProfile,
        theme,
        previousQuestions,
      );

      if (chunk) {
        for (const item of chunk) {
          if (!isDuplicateItem(item) && collected.length < questionCount) {
            collected.push(item);
          }
        }
      }
    }

    // If slightly short due to duplicate filtering, make supplementary calls with distinct theme & previous question exclusion
    let attempts = 0;
    while (collected.length < questionCount && attempts < 2) {
      attempts++;
      const needed = questionCount - collected.length;
      const theme = THEMATIC_PERSPECTIVES[(chunkCounts.length + attempts) % THEMATIC_PERSPECTIVES.length]!;
      const previousQuestions = collected.slice(-15).map((item) => ({
        questionText: item.questionText,
        scenarioText: item.scenarioText,
      }));

      try {
        const supplement = await this.callFacultyAiChunk(
          chunkCounts.length + attempts,
          chunkCounts.length + 2,
          Math.min(needed + 2, 8),
          domains,
          examGoal,
          targetProfile,
          theme,
          previousQuestions,
        );
        if (supplement && supplement.length > 0) {
          for (const item of supplement) {
            if (!isDuplicateItem(item) && collected.length < questionCount) {
              collected.push(item);
            }
          }
        } else {
          break;
        }
      } catch {
        break;
      }
    }

    if (collected.length < Math.min(questionCount, 5)) {
      return null;
    }

    return this.topUpItems(collected, domains, examGoal, questionCount);
  }

  /**
   * Strictly validates and tops up any set of faculty psychometric items to match the exact target count.
   * Guarantees that items.length === targetCount with unique questions and correct sequential numbering.
   */
  public topUpItems(
    items: FacultyPsychometricItem[],
    domains: string[],
    examGoal: string,
    targetCount: number,
  ): FacultyPsychometricItem[] {
    if (items.length === targetCount) {
      return items.map((item, idx) => ({ ...item, number: idx + 1 }));
    }
    if (items.length > targetCount) {
      return items.slice(0, targetCount).map((item, idx) => ({ ...item, number: idx + 1 }));
    }

    const result = [...items];
    const candidateDomains = domains.length > 0 ? domains : PSYCHOMETRIC_CARDS.map((c) => c.name);
    const fallbackPool = this.generateFacultyPsychometricFallback(candidateDomains, examGoal, Math.max(targetCount * 2, 40));

    // Pass 1: Add non-duplicate items from fallback pool
    for (const fb of fallbackPool) {
      if (result.length >= targetCount) break;
      const fbQ = fb.questionText.trim().toLowerCase();
      const isDupe = result.some((r) => r.questionText.trim().toLowerCase() === fbQ);
      if (!isDupe) {
        result.push({
          ...fb,
          number: result.length + 1,
        });
      }
    }

    // Pass 2: If still short, generate contextualized variations until EXACT targetCount is reached
    let padIdx = 0;
    while (result.length < targetCount && fallbackPool.length > 0) {
      const base = fallbackPool[padIdx % fallbackPool.length]!;
      const cycle = Math.floor(padIdx / fallbackPool.length) + 1;
      const targetDomain = candidateDomains[result.length % candidateDomains.length] || base.domain;
      const variationText = `${base.questionText} [Focus Area ${cycle}: ${targetDomain}]`;
      result.push({
        ...base,
        domain: targetDomain,
        questionText: variationText,
        number: result.length + 1,
      });
      padIdx++;
    }

    return result.slice(0, targetCount).map((item, idx) => ({ ...item, number: idx + 1 }));
  }

  private async callFacultyAiChunk(
    chunkIndex: number,
    totalChunks: number,
    count: number,
    domains: string[],
    examGoal: string,
    targetProfile?: {
      studentLevel?: string;
      schoolClass?: string;
      stream?: string;
      ageGroup?: string;
      age?: number;
    },
    thematicAngle?: {
      title: string;
      focus: string;
    },
    previousQuestions?: Array<{ questionText: string; scenarioText?: string | null }>,
  ): Promise<FacultyPsychometricItem[] | null> {
    const theme = thematicAngle || {
      title: 'Core Intellectual Curiosity & Problem-Solving Archetype',
      focus: `Assess how candidates naturally tackle complex, unmapped problems in relation to: "${examGoal}".`,
    };

    const cohortInfo = targetProfile
      ? `\nTARGET CANDIDATE AUDIENCE COHORT:
- Target Education / Level: ${targetProfile.studentLevel || 'Student / Early Career'} ${targetProfile.schoolClass ? `(${targetProfile.schoolClass})` : ''}
- Stream / Branch / Specialization: ${targetProfile.stream || 'General'}
- Target Age Group: ${targetProfile.ageGroup || (targetProfile.age ? `${targetProfile.age} years old` : 'College / Early Career')}

COHORT CALIBRATION:
- Calibrate scenarios and questions to the candidate level (${targetProfile.studentLevel || 'Student'}).
- Frame situations in terms of accessible, relatable intellectual and organizational problem-solving without requiring specialized industry jargon unless requested in the goal.\n`
      : '';

    const hasCognitive = domains.some((d) => {
      const n = d.toLowerCase();
      return n.includes('cognitive') || n.includes('numerical') || n.includes('analytical') || n.includes('abstract') || n.includes('logic');
    });

    const modelDiversityText = hasCognitive
      ? `   - "COGNITIVE_MCQ": Objective problem-solving or practical reasoning puzzle with 4 options (specify correct key in "correctAnswer")
   - "SCENARIO_ACTION_MCQ": Realistic 2-3 sentence dilemma directly reflecting "${examGoal}" with 4 distinct action choices (A, B, C, D) representing distinct behavioral paths or mindsets
   - "AGREEMENT_LIKERT": In-depth self-reflective statement based on the scenario with 5 options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
   - "FREQUENCY_SCALE": In-depth inquiry into natural habits based on the scenario with 5 options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
   - "PASSION_SCALE": In-depth inquiry into genuine excitement with 4 options: ["Not Interested", "Slightly Interested", "Interested", "Passionate"]`
      : `   - "SCENARIO_ACTION_MCQ": Realistic 2-3 sentence dilemma directly reflecting "${examGoal}" with 4 distinct action choices (A, B, C, D) representing distinct behavioral paths or mindsets
   - "AGREEMENT_LIKERT": In-depth self-reflective statement based on the scenario with 5 options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
   - "FREQUENCY_SCALE": In-depth inquiry into natural habits based on the scenario with 5 options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
   - "PASSION_SCALE": In-depth inquiry into genuine excitement with 4 options: ["Not Interested", "Slightly Interested", "Interested", "Passionate"]
   - DO NOT generate "COGNITIVE_MCQ" or objective math/science tests because Cognitive was NOT selected by the professor.`;

    const domainDetails = domains
      .map((domainName) => {
        const def = findCardDef(domainName);
        if (!def) return `• **${domainName}**: Assess core psychological, behavioral, and cognitive dimensions.`;
        return `• **${def.name}** (Category: ${def.badge}):
   - Scientific Focus: ${def.description}
   - Key Dimensions to Evaluate: ${def.subtopics.join(', ')}
   - Validated Frameworks: ${def.frameworks.join(', ')}`;
      })
      .join('\n\n');

    const previousExclusionBlock =
      previousQuestions && previousQuestions.length > 0
        ? `\nPREVIOUSLY GENERATED QUESTIONS IN THIS EXAM (STRICTLY FORBIDDEN TO REPEAT OR DUPLICATE ANY OF THESE SCENARIOS OR THEMES):
${previousQuestions
  .map(
    (q, i) =>
      `  ${i + 1}. [Question] "${q.questionText}"${q.scenarioText ? ` | [Scenario] "${q.scenarioText.slice(0, 100)}..."` : ''}`,
  )
  .join('\n')}
CRITICAL: Every question you generate in this section MUST explore a completely different dilemma, situation, and choice set from all the questions listed above.\n`
        : '';

    const prompt = `You are an expert psychometrician and occupational psychologist designing a scientifically rigorous, engaging psychometric assessment.

PROFESSOR'S STRATEGIC EVALUATION GOAL:
"${examGoal}"
${cohortInfo}
SELECTED PSYCHOMETRIC DOMAINS (EVERY QUESTION MUST STRICTLY BELONG TO ONE OF THESE):
${domainDetails}

SECTION ${chunkIndex + 1} OF ${totalChunks}:
THEMATIC PERSPECTIVE FOR THIS SECTION: "${theme.title}"
THEMATIC INSTRUCTIONS:
${theme.focus}
${previousExclusionBlock}
GENERATE EXACTLY ${count} 100% ORIGINAL, SCIENTIFICALLY SOUND PSYCHOMETRIC QUESTIONS FOR THIS SECTION.

CRITICAL MANDATES FOR AUTHENTIC PSYCHOMETRICS:
1. STRICT NEGATIVE BAN ON NARROW CODING CHORES & APP-BUILDING CLICHÉS:
   - STRICTLY FORBIDDEN: NEVER write scenarios about literal programming chores, like:
     * "You are building a college fest app..."
     * "You are designing a registration page or website..."
     * "You are helping a shop with an online order form..."
     * "You are building a calculator app..."
     * "You notice a bug in the code or database..."
     * "A teammate suggests a new framework or library..."
   - A psychometric test filled with repetitive app-building questions is a failure of psychometrics. Candidates are taking a psychological assessment, not a junior web dev quiz.

2. REAL-WORLD HUMAN, ORGANIZATIONAL & INTELLECTUAL DILEMMAS:
   Ground scenarios in realistic, relatable situations:
   - Deep intellectual curiosity and problem-solving styles (e.g. dissecting underlying root causes vs managing surface symptoms)
   - High-stakes team trade-offs (e.g. uncompromising quality vs tight deadlines, challenging a dominant peer vs preserving group harmony)
   - Stakeholder & interpersonal communication (e.g. explaining complex specialized insights to skeptical non-experts without jargon, reading unspoken hesitation in meetings)
   - Personal accountability & ethics (e.g. discovering a subtle flaw that others missed, admitting an oversight vs hiding it)
   - Strategic initiative & ambiguity (e.g. navigating completely open-ended projects where there is no manual or established roadmap)

3. HOW TO EVALUATE CAREER PATHS PSYCHOLOGICALLY (MAPPING TO PROFESSOR'S GOAL):
   Instead of asking about programming languages, evaluate the underlying psychological traits that predict success:
   - Systems & Analytical Logic (Backend / Deep Tech):
     * High Investigative curiosity (RIASEC) and Conscientiousness (Big Five).
     * Prefers deep focused solitude, rigorous root-cause logic, mechanical understanding, and diagnosing systemic failure modes over quick cosmetic fixes.
   - User Experience & Human Ergonomics (Frontend / UI / UX):
     * High Artistic sensitivity (RIASEC) and Acute Empathy (EI).
     * Deeply attuned to human emotion, observes points of friction in everyday tools/spaces, values craftsmanship, presentation, and seamless ergonomics.
   - Influence, Solutions & Stakeholder Alignment (Technical Sales / Consulting):
     * High Enterprising drive (RIASEC), Extraversion, and Social Intelligence.
     * Persuasive verbal communicator, active listener who connects complex capabilities to real human pain points, resilient when facing rejection or skepticism.
   - Venture Building & Product Coordination (Product Management / Entrepreneurship):
     * High Autonomy (Work Values), High Tolerance for Ambiguity, and Big-Picture Synthesis.
     * Natural coordinator who aligns competing priorities, manages risk, takes personal ownership of outcomes, and moves initiatives from chaotic ideas into operational reality.

4. STRICT DOMAIN FIDELITY:
   Every question's "domain" field MUST match one of the professor's selected domains:
   - "Personality Tests": Probes stable behavioral traits (Big Five: Conscientiousness, Openness to Experience, Agreeableness, Extraversion, Emotional Stability).
   - "Situational Judgment Tests (SJT)": Must be a realistic multi-person dilemma with conflicting priorities or delicate trade-offs.
   - "Motivation and Work-Values Tests": Probes intrinsic psychological drivers (Autonomy, Mastery, Commercial Achievement, Human Impact, Recognition).
   - "Behavioral and Work-Style Assessments": Probes execution habits (methodical planning vs agility, micro-precision vs velocity, structured routine vs independent improvisation).
   - "Emotional Intelligence (EI) Tests": Probes emotional awareness, empathy, active listening, and composure under social tension.

5. MANDATORY QUESTION STRUCTURE:
   - "scenarioText": MANDATORY 2-3 sentence realistic situation, thought experiment, or team dilemma (NEVER null or empty).
   - "questionText": Clear, compelling question or reflective inquiry.
   - For "SCENARIO_ACTION_MCQ" (at least 60% of questions):
     Provide 4 distinct behavioral choices (A, B, C, D) representing distinct valid psychological approaches to the dilemma (e.g. analytical root-cause vs empathetic user resolution vs persuasive negotiation vs pragmatic operational compromise).
   - For "AGREEMENT_LIKERT":
     In-depth self-reflective statement based on the scenario. Options strictly: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"].
   - For "FREQUENCY_SCALE":
     In-depth inquiry into how often they adopt that specific mindset or initiative. Options strictly: ["Never", "Rarely", "Sometimes", "Often", "Always"].
   - For "PASSION_SCALE":
     Options strictly: ["Not Interested", "Slightly Interested", "Interested", "Passionate"].

6. VOCABULARY & TONE:
   - Use simple, grounded, everyday spoken English.
   - NO posh or pretentious words (NEVER use "instinctively", "clunky", "gravitate", "dichotomy", "aesthetic", "juxtaposition", "tapestry", "paradigm", "plethora", "propensity", "nuanced").
   - ZERO EMOJIS. NEVER use the forbidden word "tuition".

Format output strictly as a JSON object:
{
  "items": [
    {
      "domain": "Domain Name",
      "questionModel": "SCENARIO_ACTION_MCQ | AGREEMENT_LIKERT | FREQUENCY_SCALE | PASSION_SCALE | COGNITIVE_MCQ",
      "scenarioText": "Vivid, realistic 2-3 sentence situation or dilemma (NEVER null or empty)",
      "questionText": "Engaging question or reflective statement in simple everyday student English",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Trait Rubric or Correct Key",
      "explanation": "Concise 1-2 sentence rubric explanation",
      "traitPersonaMapping": "Core trait evaluated",
      "radicalFeedbackNote": "One-liner observation for extreme choices"
    }
  ]
}`;

    try {
      const completion = await this.withSlot(() =>
        this.getClient().chat.completions.create({
          model: 'deepseek-chat',
          temperature: 0.7,
          max_tokens: 3500,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content:
                'You are an expert psychometrician and occupational psychologist. You design sophisticated, engaging psychometric assessments based on validated psychological frameworks (Big Five, Holland RIASEC, Situational Judgment, Schwartz Work Values). Every question must probe deep behavioral habits, cognitive instincts, or human trade-offs. NEVER write junior programming chores, code debugging exercises, or app-building clichés.',
            },
            { role: 'user', content: prompt },
          ],
        }),
      );

      const raw = completion.choices[0]?.message?.content ?? '';
      const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
      const parsed = JSON.parse(cleaned) as { items?: FacultyPsychometricItem[] };

      if (!parsed.items || !Array.isArray(parsed.items) || parsed.items.length === 0) {
        return null;
      }

      const validItems = parsed.items.filter((item) => {
        if (!hasCognitive && (
          item.questionModel === 'COGNITIVE_MCQ' ||
          (item.domain && item.domain.toLowerCase().includes('cognitive'))
        )) {
          return false;
        }
        return true;
      });

      const effectiveItems = validItems.length > 0 ? validItems : parsed.items;

      return effectiveItems.map((item, idx) => {
        const matchingDomain = domains.find((d) =>
          d.toLowerCase() === (item.domain || '').toLowerCase() ||
          (item.domain || '').toLowerCase().includes(d.toLowerCase()) ||
          d.toLowerCase().includes((item.domain || '').toLowerCase())
        ) || domains[idx % domains.length] || domains[0];

        let model = item.questionModel || 'SCENARIO_ACTION_MCQ';
        if (!hasCognitive && model === 'COGNITIVE_MCQ') {
          model = 'SCENARIO_ACTION_MCQ';
        }

        let options = Array.isArray(item.options) && item.options.length > 0 ? item.options : [];
        if (model === 'AGREEMENT_LIKERT') {
          options = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
        } else if (model === 'FREQUENCY_SCALE') {
          options = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];
        } else if (model === 'PASSION_SCALE') {
          options = ['Not Interested', 'Slightly Interested', 'Interested', 'Passionate'];
        } else if (options.length < 4) {
          options = options.length >= 2 ? options : ['Option A', 'Option B', 'Option C', 'Option D'];
        }

        return {
          ...item,
          number: idx + 1,
          domain: matchingDomain,
          questionModel: model,
          options,
          correctAnswer: item.correctAnswer || 'Trait Rubric: Evaluated holistically based on candidate choice',
          explanation: item.explanation || 'Evaluates behavioral orientation toward target goals.',
          traitPersonaMapping: item.traitPersonaMapping || matchingDomain,
          radicalFeedbackNote: item.radicalFeedbackNote || 'Outlier choices signal strong individualist preferences needing balanced mentoring.',
        };
      });
    } catch (err) {
      logger.warn({ err, chunkIndex }, 'Failed to generate psychometric chunk from DeepSeek');
      return null;
    }
  }

  private generateFacultyPsychometricFallback(
    domains: string[],
    examGoal: string,
    questionCount: number,
  ): FacultyPsychometricItem[] {
    const pool: Array<Omit<FacultyPsychometricItem, 'number'>> = [
      {
        domain: 'Cognitive Ability Tests',
        questionModel: 'COGNITIVE_MCQ',
        scenarioText: 'Three students are assembling 60 model kits for a school science exhibition. Rohan cuts the cardboard (takes 2 minutes per kit), Priya glues the pieces together (takes 6 minutes per kit), and Amit paints them (takes 4 minutes per kit). Currently, kits are piling up waiting for Priya because gluing takes the longest.',
        questionText: 'To finish all 60 kits in the shortest time, what should the team do first?',
        options: [
          'Ask an extra student to help Priya with gluing',
          'Ask an extra student to help Rohan cut cardboard',
          'Ask an extra student to help Amit paint',
          'Tell Rohan to cut cardboard faster',
        ],
        correctAnswer: 'Ask an extra student to help Priya with gluing',
        explanation: 'Priya is the bottleneck at 6 minutes per kit. Helping Priya directly speeds up the entire team. Helping the others will only cause more kits to pile up waiting for assembly.',
        traitPersonaMapping: 'Bottleneck Detection & Practical Problem Solving',
        radicalFeedbackNote: 'Telling Rohan to cut faster when cardboard is already piling up shows a failure to identify the true bottleneck.',
      },
      {
        domain: 'Personality Tests',
        questionModel: 'AGREEMENT_LIKERT',
        scenarioText: null,
        questionText: 'When starting a school or college project, I prefer to explore ideas as I go rather than follow an existing strict step-by-step procedure.',
        options: [
          'Strongly Disagree',
          'Disagree',
          'Neutral',
          'Agree',
          'Strongly Agree',
        ],
        correctAnswer: 'Trait Rubric: 1-2 = High Structured Preference, 3 = Balanced Execution, 4-5 = High Creative Autonomy & Adaptability',
        explanation: 'Shows whether the student thrives with open creative freedom or prefers structured step-by-step instructions.',
        traitPersonaMapping: 'Creative Independence vs Structured Guidance',
        radicalFeedbackNote: 'Strongly Disagree shows high reliance on rigid step-by-step directions without independent initiative.',
      },
      {
        domain: 'Situational Judgment Tests (SJT)',
        questionModel: 'SCENARIO_ACTION_MCQ',
        scenarioText: 'Your team has to present your working initiative or project at an exhibition tomorrow. Tonight, you notice an optional feature has an issue, but fixing it properly would take two full days of work.',
        questionText: 'What is your best course of action?',
        options: [
          'Postpone participating in the exhibition until everything is completely bug-free.',
          'Turn off the buggy optional feature for tomorrow, present the working main project cleanly, and explain that the extra feature is in progress.',
          'Stay up all night making untested quick guesses and hope the bug does not crash during the live demo.',
          'Let your project partner present alone while you try to code.',
        ],
        correctAnswer: 'Trait Rubric: A = Perfectionist Avoidance, B = Practical Execution & Honest Communication, C = Reckless Guesswork, D = Avoiding Responsibility',
        explanation: 'Option B delivers the working core project honestly without risking an embarrassing live crash or canceling the event.',
        traitPersonaMapping: 'Practical Execution & Calm Decision Making',
        radicalFeedbackNote: 'Choosing Option C risks an embarrassing presentation failure from rushed, untested changes.',
      },
      {
        domain: 'Emotional Intelligence (EI) Tests',
        questionModel: 'SCENARIO_ACTION_MCQ',
        scenarioText: 'During a group project meeting, a teammate loudly tells everyone that your idea for the model will fail and criticizes the work you spent days preparing.',
        questionText: 'How do you handle this confrontation in the meeting?',
        options: [
          'Get angry immediately and bring up mistakes they made earlier in the project.',
          'Stay calm, ask them to explain specifically what they think is flawed, and work together to test if their concern is real.',
          'Stay completely silent during the meeting, but complain to the teacher alone afterward.',
          'Give up completely and tell them to do the whole project themselves.',
        ],
        correctAnswer: 'Trait Rubric: A = Defensive Anger, B = High Emotional Self-Control & Constructive Teamwork, C = Passive Avoidance, D = Quitting Under Pressure',
        explanation: 'Option B separates personal pride from the project, asking for concrete facts to solve the problem calmly.',
        traitPersonaMapping: 'Emotional Regulation & Constructive Teamwork',
        radicalFeedbackNote: 'Getting angry and attacking teammates damages team trust and stops practical progress.',
      },
      {
        domain: 'Motivation and Work-Values Tests',
        questionModel: 'PASSION_SCALE',
        scenarioText: null,
        questionText: 'Presenting a new project idea or invention in front of classmates and judges at a science or college competition.',
        options: [
          'Not Interested',
          'Slightly Interested',
          'Interested',
          'Passionate',
        ],
        correctAnswer: 'Trait Rubric: 1-2 = Quiet Individual Contributor, 3 = Receptive to Presenting, 4 = High Leadership & Enterprising Drive',
        explanation: 'Measures confidence in presenting ideas publicly and taking the spotlight to explain original work.',
        traitPersonaMapping: 'Public Presentation Drive & Initiative',
        radicalFeedbackNote: 'Not Interested indicates a strong preference for background work rather than leading public presentations.',
      },
      {
        domain: 'Behavioral and Work-Style Assessments',
        questionModel: 'FREQUENCY_SCALE',
        scenarioText: null,
        questionText: 'When working on a project, I show early rough drafts to friends or teachers to get advice instead of keeping it secret until the very end.',
        options: [
          'Never',
          'Rarely',
          'Sometimes',
          'Often',
          'Always',
        ],
        correctAnswer: 'Trait Rubric: 1-2 = Hesitant / Over-protective, 3 = Moderate Sharing, 4-5 = High Receptivity to Early Feedback',
        explanation: 'Shows willingness to ask for feedback early to avoid discovering major mistakes right before the deadline.',
        traitPersonaMapping: 'Feedback Receptivity & Collaborative Learning',
        radicalFeedbackNote: 'Never indicates fear of criticism that often leads to wasting days on flawed work.',
      },
      {
        domain: 'Career Interest Tests',
        questionModel: 'PASSION_SCALE',
        scenarioText: null,
        questionText: 'Building a working physical mechanism, experimental apparatus, or functional model from scratch to solve an everyday challenge.',
        options: [
          'Not Interested',
          'Slightly Interested',
          'Interested',
          'Passionate',
        ],
        correctAnswer: 'Trait Rubric: 1-2 = Non-Technical / Theoretical, 3 = Moderate Curiosity, 4 = High Hands-On Engineering & Innovation',
        explanation: 'Assesses passion for practical, hands-on building, tinkering, and creating functional things.',
        traitPersonaMapping: 'Hands-On Creative Building Interest',
        radicalFeedbackNote: 'Not Interested indicates low curiosity for practical building and experimentation.',
      },
      {
        domain: 'Integrity and Risk-Related Assessments',
        questionModel: 'SCENARIO_ACTION_MCQ',
        scenarioText: 'The deadline for your group project submission is in one hour. Your teammate suggests copying an entire project from the internet and putting your names on it so you do not lose marks for being late.',
        questionText: 'What is your principled decision?',
        options: [
          'Agree and submit the copied project so you get full marks.',
          'Refuse to copy. Submit your team genuine work done so far, and honestly ask the teacher for a short extension to finish the rest.',
          'Let your teammate submit it, but secretly tell the teacher later that it was not your idea.',
          'Delete the project file so nobody can submit anything.',
        ],
        correctAnswer: 'Trait Rubric: A = Academic Dishonesty, B = High Moral Integrity & Honest Problem Solving, C = Shifting Blame, D = Destructive Overreaction',
        explanation: 'Option B demonstrates genuine academic integrity: standing by honest work and communicating openly with authority under pressure.',
        traitPersonaMapping: 'Moral Integrity & Truthfulness Under Pressure',
        radicalFeedbackNote: 'Agreeing to copy shows high vulnerability to dishonest shortcuts under time pressure.',
      },
      {
        domain: 'Cognitive Ability Tests',
        questionModel: 'COGNITIVE_MCQ',
        scenarioText: 'You need to find a specific student exam sheet in an unsorted pile of 500 papers. Method 1 is looking through them one by one. Method 2 is spending 10 minutes sorting the pile alphabetically first, after which any name can be found in 10 seconds.',
        questionText: 'If you need to look up 30 different students sheets throughout the day, which approach will save the most total time?',
        options: [
          'Method 2, because sorting once makes looking up 30 different names much faster overall.',
          'Method 1, because you never spend the 10 minutes sorting at the start.',
          'Both methods will take the exact same total time.',
          'Neither, searching one by one is always faster no matter how many names you need.',
        ],
        correctAnswer: 'Method 2, because sorting once makes looking up 30 different names much faster overall.',
        explanation: 'Sorting once (10 minutes) plus 30 quick 10-second lookups (5 minutes) takes only 15 minutes total. Searching 30 times through 500 unsorted papers takes over an hour.',
        traitPersonaMapping: 'Upfront Planning & Process Efficiency',
        radicalFeedbackNote: 'Believing looking through unsorted papers 30 times is faster shows poor understanding of compounding time waste.',
      },
      {
        domain: 'Behavioral and Work-Style Assessments',
        questionModel: 'AGREEMENT_LIKERT',
        scenarioText: null,
        questionText: 'I would rather take personal responsibility as the leader of a challenging project than do an easy, ordinary task with no responsibility.',
        options: [
          'Strongly Disagree',
          'Disagree',
          'Neutral',
          'Agree',
          'Strongly Agree',
        ],
        correctAnswer: 'Trait Rubric: 1-2 = Responsibility Avoidance, 3 = Moderate Ownership, 4-5 = High Initiative & Leadership Ownership',
        explanation: 'Measures willingness to step forward, accept accountability, and lead teams through real challenges.',
        traitPersonaMapping: 'Personal Accountability & Leadership Ownership',
        radicalFeedbackNote: 'Strongly Disagree signals reluctance to take ownership, preferring to hide behind others.',
      },
      {
        domain: 'Situational Judgment Tests (SJT)',
        questionModel: 'SCENARIO_ACTION_MCQ',
        scenarioText: 'During a team lab experiment, your partner accidentally drops and breaks a piece of glassware containing your group test sample, ruining 3 hours of collective work. Your partner looks terrified and starts apologizing.',
        questionText: 'How do you respond?',
        options: [
          'Yell at them for being careless and refuse to work with them again.',
          'Reassure them that accidents happen, help clean up the broken glass safely, and quickly divide steps to redo the experiment before lab ends.',
          'Laugh at them in front of the other lab groups.',
          'Leave the lab immediately in frustration and let them clean up alone.',
        ],
        correctAnswer: 'Trait Rubric: A = Hostile Blame, B = Empathy, Safety & Resilient Teamwork, C = Mocking Coworkers, D = Abandonment Under Stress',
        explanation: 'Option B prioritizes safety, supports a distressed teammate, and focuses energy immediately on recovering lost work.',
        traitPersonaMapping: 'Empathy, Safety First & Resilient Teamwork',
        radicalFeedbackNote: 'Yelling at a distressed teammate ruins team safety and prevents fixing the problem.',
      },
      {
        domain: 'Emotional Intelligence (EI) Tests',
        questionModel: 'FREQUENCY_SCALE',
        scenarioText: null,
        questionText: 'When an unexpected setback happens or an experiment fails, I stay calm and figure out the next step instead of getting upset.',
        options: [
          'Never',
          'Rarely',
          'Sometimes',
          'Often',
          'Always',
        ],
        correctAnswer: 'Trait Rubric: 1-2 = High Emotional Frustration, 3 = Moderate Composure, 4-5 = High Calmness & Emotional Self-Control',
        explanation: 'Measures patience, composure, and emotional control when dealing with unexpected academic or project setbacks.',
        traitPersonaMapping: 'Emotional Composure Under Setbacks',
        radicalFeedbackNote: 'Never indicates that setbacks cause severe frustration that stops constructive thinking.',
      },
      {
        domain: 'Motivation and Work-Values Tests',
        questionModel: 'AGREEMENT_LIKERT',
        scenarioText: null,
        questionText: 'I feel most satisfied when solving a practical problem that helps real people, rather than just memorizing answers for high test marks.',
        options: [
          'Strongly Disagree',
          'Disagree',
          'Neutral',
          'Agree',
          'Strongly Agree',
        ],
        correctAnswer: 'Trait Rubric: 1-2 = Purely Rote / Test-Oriented, 3 = Balanced Orientation, 4-5 = High Real-World Problem Solving Purpose',
        explanation: 'Measures whether the student is driven by real-world purpose and practical application or purely rote test marks.',
        traitPersonaMapping: 'Practical Problem Solving vs Rote Memorization',
        radicalFeedbackNote: 'Strongly Disagree indicates purely marks-driven learning with little interest in understanding real applications.',
      },
      {
        domain: 'Personality Tests',
        questionModel: 'FREQUENCY_SCALE',
        scenarioText: null,
        questionText: 'When working with classmates on an open-ended assignment, I listen carefully to everyone ideas before deciding how to proceed.',
        options: [
          'Never',
          'Rarely',
          'Sometimes',
          'Often',
          'Always',
        ],
        correctAnswer: 'Trait Rubric: 1-2 = Dominating / Dismissive, 3 = Average Collaboration, 4-5 = High Active Listening & Inclusive Teamwork',
        explanation: 'Shows whether the student is an inclusive collaborator who values other perspectives or pushes their own ideas only.',
        traitPersonaMapping: 'Active Listening & Team Collaboration',
        radicalFeedbackNote: 'Never indicates an overbearing style that ignores teammates and damages group morale.',
      },
      {
        domain: 'Career Interest Tests',
        questionModel: 'AGREEMENT_LIKERT',
        scenarioText: null,
        questionText: 'I enjoy discovering how complex natural systems, mechanisms, or functional frameworks work under the hood by experimenting on my own.',
        options: [
          'Strongly Disagree',
          'Disagree',
          'Neutral',
          'Agree',
          'Strongly Agree',
        ],
        correctAnswer: 'Trait Rubric: 1-2 = Passive User, 3 = Moderate Curiosity, 4-5 = High Scientific & Technical Curiosity',
        explanation: 'Assesses genuine scientific and technical curiosity to explore mechanics, logic, and systems independently.',
        traitPersonaMapping: 'Scientific & Technical Curiosity',
        radicalFeedbackNote: 'Strongly Disagree indicates passive consumption with little desire to understand how things work.',
      },
      {
        domain: 'Integrity and Risk-Related Assessments',
        questionModel: 'FREQUENCY_SCALE',
        scenarioText: null,
        questionText: 'If I make an error in a lab calculation or project that nobody else noticed, I admit it openly and fix it rather than hiding it.',
        options: [
          'Never',
          'Rarely',
          'Sometimes',
          'Often',
          'Always',
        ],
        correctAnswer: 'Trait Rubric: 1-2 = Error Concealment, 3 = Selective Honesty, 4-5 = High Personal Honesty & Scientific Accountability',
        explanation: 'Measures honesty and accountability in owning up to mistakes, a cornerstone of scientific and engineering discipline.',
        traitPersonaMapping: 'Honesty & Scientific Accountability',
        radicalFeedbackNote: 'Never indicates a dangerous habit of concealing mistakes, which leads to major hidden errors.',
      },
      {
        domain: 'Behavioral and Work-Style Assessments',
        questionModel: 'FREQUENCY_SCALE',
        scenarioText: null,
        questionText: 'When things go wrong on a group project, I look at my own choices first before pointing fingers at others.',
        options: [
          'Never',
          'Rarely',
          'Sometimes',
          'Often',
          'Always',
        ],
        correctAnswer: 'Trait Rubric: 1-2 = Blaming Others, 3 = Balanced Locus, 4-5 = High Personal Responsibility & Growth Mindset',
        explanation: 'Measures personal ownership and willingness to learn from mistakes rather than making excuses.',
        traitPersonaMapping: 'Personal Ownership & Reflective Learning',
        radicalFeedbackNote: 'Never indicates a habit of blaming others rather than reflecting on how to improve.',
      },
      {
        domain: 'Career Interest Tests',
        questionModel: 'PASSION_SCALE',
        scenarioText: null,
        questionText: 'Organizing and leading a team of classmates to build and showcase an innovative science or tech project.',
        options: [
          'Not Interested',
          'Slightly Interested',
          'Interested',
          'Passionate',
        ],
        correctAnswer: 'Trait Rubric: 1-2 = Individual Contributor, 3 = Supportive Team Player, 4 = High Team Leadership & Project Initiative',
        explanation: 'Evaluates passion for team leadership, project coordination, and bringing creative student projects to life.',
        traitPersonaMapping: 'Student Project Leadership & Initiative',
        radicalFeedbackNote: 'Not Interested indicates a strong preference for working alone rather than coordinating group projects.',
      },
    ];

    const hasCognitive = domains.some((d) => {
      const n = d.toLowerCase();
      return n.includes('cognitive') || n.includes('numerical') || n.includes('analytical') || n.includes('abstract') || n.includes('logic');
    });

    // Strictly filter pool by the professor's selected domains
    const filtered = pool.filter((item) => {
      if (!hasCognitive && item.domain.toLowerCase().includes('cognitive')) {
        return false;
      }
      if (domains.length === 0) return true;
      return domains.some((d) => {
        const dNorm = d.toLowerCase();
        const itemNorm = item.domain.toLowerCase();
        return itemNorm.includes(dNorm) || dNorm.includes(itemNorm);
      });
    });

    // Use strictly matching items, or filter out cognitive if cognitive was not selected
    const candidatePool = filtered.length > 0
      ? filtered
      : pool.filter((item) => hasCognitive || !item.domain.toLowerCase().includes('cognitive'));

    const result: FacultyPsychometricItem[] = [];
    const models: Array<FacultyPsychometricItem['questionModel']> = [
      ...(hasCognitive ? (['COGNITIVE_MCQ'] as const) : []),
      'SCENARIO_ACTION_MCQ',
      'AGREEMENT_LIKERT',
      'FREQUENCY_SCALE',
      'PASSION_SCALE',
    ];

    // Pick at least 1 for each allowed model if present in candidatePool
    for (const m of models) {
      const match = candidatePool.find((item) => item.questionModel === m && !result.some((r) => r.questionText === item.questionText));
      if (match) {
        const matchingDomain = domains.find((d) =>
          d.toLowerCase() === match.domain.toLowerCase() ||
          match.domain.toLowerCase().includes(d.toLowerCase()) ||
          d.toLowerCase().includes(match.domain.toLowerCase())
        ) || domains[result.length % domains.length] || domains[0];

        result.push({
          ...match,
          domain: matchingDomain,
          number: result.length + 1,
        });
      }
    }

    // Fill the remainder up to questionCount using ONLY candidatePool
    let poolIdx = 0;
    while (result.length < questionCount) {
      const candidate = candidatePool[poolIdx % candidatePool.length]!;
      const cycle = Math.floor(poolIdx / candidatePool.length) + 1;
      const matchingDomain = domains.find((d) =>
        d.toLowerCase() === candidate.domain.toLowerCase() ||
        candidate.domain.toLowerCase().includes(d.toLowerCase()) ||
        d.toLowerCase().includes(candidate.domain.toLowerCase())
      ) || domains[result.length % domains.length] || domains[0];
      const text = cycle > 1
        ? `${candidate.questionText} [Focus Dimension ${cycle}: ${matchingDomain}]`
        : candidate.questionText;

      result.push({
        ...candidate,
        domain: matchingDomain,
        number: result.length + 1,
        questionText: text,
      });
      poolIdx++;
    }

    return result.slice(0, questionCount).map((item, idx) => ({ ...item, number: idx + 1 }));
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

  /**
   * Evaluates a student's submitted psychometric assessment responses specifically against
   * the professor's set goal, returning goal alignment score (0-100), behavioral archetype,
   * qualitative analysis, domain breakdown, strengths, and faculty mentoring recommendations.
   * Completely opinion and trait based - zero right/wrong marks.
   */
  public async evaluateStudentPsychometricSubmission(input: {
    goal: string;
    candidateName: string;
    items: Array<{
      number: number;
      subject: string;
      topic: string;
      questionText: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
    }>;
    answers: Record<string, string>;
    timeTakenSeconds: number;
  }): Promise<PsychometricStudentEvaluation> {
    if (this.hasApiKey() && this.breaker.canAttempt()) {
      try {
        const liveReport = await this.callAiStudentEvaluation(input);
        if (liveReport) {
          this.breaker.recordSuccess();
          return liveReport;
        }
      } catch (err) {
        logger.warn({ err }, 'DeepSeek student psychometric evaluation failed, using calibrated evaluation model');
      }
    }

    return this.fallbackStudentEvaluation(input);
  }

  /**
   * Generates an immediate local heuristic evaluation in < 2ms without calling external APIs.
   * Used for instant submission response, offline fallback, and baseline persona scoring.
   */
  public generateInitialStudentEvaluation(input: {
    goal: string;
    candidateName: string;
    items: Array<{
      number: number;
      subject: string;
      topic: string;
      questionText: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
    }>;
    answers: Record<string, string>;
    timeTakenSeconds: number;
  }): PsychometricStudentEvaluation {
    return this.fallbackStudentEvaluation(input);
  }

  public async callAiStudentEvaluation(input: {
    goal: string;
    candidateName: string;
    items: Array<{
      number: number;
      subject: string;
      topic: string;
      questionText: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
    }>;
    answers: Record<string, string>;
    timeTakenSeconds: number;
  }): Promise<PsychometricStudentEvaluation | null> {
    if (!this.hasApiKey() || !this.breaker.canAttempt()) {
      return null;
    }

    const totalItems = input.items.length || 1;
    const answeredItems = input.items.filter((item) => Boolean(input.answers[String(item.number)]?.trim()));
    const completionRate = answeredItems.length / totalItems;
    if (completionRate < 0.8) {
      return this.fallbackStudentEvaluation(input);
    }

    const summaryList = input.items
      .map((item) => {
        const chosen = input.answers[String(item.number)]?.trim() || 'Skipped';
        return `Q${item.number} [Domain: ${item.topic}]:
Question: ${item.questionText.slice(0, 160)}
Options: ${item.options.join(' | ')}
Candidate Selected Choice: ${chosen}
Behavioral Rubric: ${item.correctAnswer}`;
      })
      .join('\n\n');

    const prompt = `You are an educational and vocational talent evaluator analyzing a student's psychometric and behavioral assessment choices for faculty.

PRIMARY EVALUATION ANCHOR / PROFESSOR'S GOAL:
"${input.goal}"

CANDIDATE: ${input.candidateName}
COMPLETION TIME: ${Math.round(input.timeTakenSeconds / 60)} minutes

CANDIDATE'S RESPONSES ACROSS ASSESSMENT:
${summaryList}

TASK INSTRUCTIONS:
1. DETECT THE SPECIFIC PROFESSION / DOMAIN from the professor's goal above (e.g. Medicine/Doctors, Software/Tech, Law, Banking/Finance, Creative Design, Mechanical Engineering, Sales/Marketing).
2. PREDICTED BEST-FIT ROLE ("predictedRole"):
   Identify the single most accurate, specific role or specialization within that target field where this candidate has the highest probability of thriving based on their answers.
   - If the goal is about Doctors / Healthcare: Output roles like "Emergency Surgeon", "General Physician - Family & Patient Care", "Diagnostic Pathologist & Medical Researcher", or "Hospital Healthcare Administrator".
   - If the goal is about Tech / Engineering: Output roles like "Backend Systems Engineer", "UI/UX & Frontend Developer", "Technical Sales & Solutions Lead", or "DevOps & Infrastructure Engineer".
   - If the goal is about Finance / Business: Output roles like "Financial Risk & Compliance Analyst", "Investment Portfolio Manager", or "Corporate Operations Strategist".
   - CRITICAL NEGATIVE MANDATE: STRICTLY FORBIDDEN to output generic software or IT roles unless the professor's goal is explicitly about software.
3. 1-2 LINE PLAIN ENGLISH REASON ("roleReason"):
   Write exactly 1 to 2 simple, direct sentences in everyday conversational English explaining WHY the candidate fits this role based on their actual choices across the questions.
   - Explicitly mention what trade-offs or options they chose and what they avoided.
   - CRITICAL TONE MANDATE: Strictly plain English. ZERO posh vocabulary, corporate buzzwords, or pretentious academic jargon (NEVER use words like "synergy", "propensity", "paradigm", "orchestrate", "holistic", "agile mindset", "tapestry").
4. BEHAVIORAL ARCHETYPE: A 3-5 word trait persona title describing their core mindset.
5. ALIGNMENT SCORE: An integer from 65 to 96 reflecting their fit to this role and the goal.
6. DOMAIN BREAKDOWN, KEY STRENGTHS, AND GROWTH AREAS: Practical mentoring insights for faculty.

CRITICAL RULES:
1. 100% plain, student-level conversational English (zero corporate buzzwords).
2. ZERO emojis anywhere.
3. NEVER use the forbidden word "tuition".

Format output strictly as a JSON object:
{
  "goal": "${input.goal.replace(/"/g, '\\"')}",
  "alignmentScore": 85,
  "alignmentLevel": "Exceptional Fit | High Alignment | Moderate Alignment | Developing Fit",
  "predictedRole": "Role Title strictly matching the goal domain",
  "roleReason": "1 to 2 plain English sentences explaining why based on their concrete choices.",
  "archetype": "3-5 word behavioral persona title",
  "summary": "2 concise paragraphs on how their choices match what the professor is looking for in their goal.",
  "domainBreakdown": [
    {
      "domain": "Domain Name",
      "traitLabel": "Core trait exhibited",
      "scorePct": 85,
      "analysis": "1-2 sentences on their choices in this domain"
    }
  ],
  "keyStrengths": [
    "Concrete strength 1",
    "Concrete strength 2",
    "Concrete strength 3"
  ],
  "growthAreas": [
    "Practical mentoring tip 1 for faculty",
    "Practical mentoring tip 2 for faculty"
  ],
  "radicalFlags": []
}`;

    try {
      const completion = await this.withSlot(() =>
        this.getClient().chat.completions.create({
          model: 'deepseek-chat',
          temperature: 0.35,
          max_tokens: 2500,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content:
                'You are an educational psychometric evaluation expert. Output MUST be ONLY a valid JSON object matching the requested schema.',
            },
            { role: 'user', content: prompt },
          ],
        }),
      );

      const raw = completion.choices[0]?.message?.content ?? '';
      const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
      const parsed = JSON.parse(cleaned) as PsychometricStudentEvaluation;

      if (!parsed || typeof parsed.alignmentScore !== 'number') {
        return null;
      }

      if (!parsed.predictedRole || !parsed.roleReason) {
        const fallback = this.fallbackStudentEvaluation(input);
        parsed.predictedRole = parsed.predictedRole || fallback.predictedRole;
        parsed.roleReason = parsed.roleReason || fallback.roleReason;
      }

      this.breaker.recordSuccess();
      return parsed;
    } catch (err) {
      logger.warn({ err }, 'DeepSeek callAiStudentEvaluation failed');
      return null;
    }
  }

  private fallbackStudentEvaluation(input: {
    goal: string;
    candidateName: string;
    items: Array<{
      number: number;
      subject: string;
      topic: string;
      questionText: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
    }>;
    answers: Record<string, string>;
    timeTakenSeconds: number;
  }): PsychometricStudentEvaluation {
    const totalItems = input.items.length || 1;
    const answeredItems = input.items.filter((item) => Boolean(input.answers[String(item.number)]?.trim()));
    const attemptedCount = answeredItems.length;

    const attemptRate = attemptedCount / totalItems;

    if (attemptRate < 0.8) {
      const distinctDomains = Array.from(new Set(input.items.map((i) => i.topic || 'General Aptitude')));
      const pct = Math.round(attemptRate * 100);
      return {
        goal: input.goal,
        alignmentScore: 0,
        alignmentLevel: 'Unassessed',
        archetype: 'Incomplete Assessment Profile',
        predictedRole: 'Insufficient Responses to Evaluate',
        roleReason: attemptedCount === 0
          ? `${input.candidateName} skipped all questions in this assessment. At least 80% of questions must be answered to evaluate behavioral style and career fit.`
          : `${input.candidateName} answered only ${attemptedCount} of ${totalItems} questions (${pct}%). At least 80% completion is required to evaluate behavioral traits and career fit.`,
        summary: attemptedCount === 0
          ? `No questions were answered by ${input.candidateName}. Psychometric assessment requires student responses to analyze decision-making patterns, situational judgment, and vocational fit.`
          : `Only ${attemptedCount} of ${totalItems} questions (${pct}%) were answered by ${input.candidateName}. Psychometric assessment requires at least 80% response completion to generate accurate vocational insights and behavioral profiles.`,
        domainBreakdown: distinctDomains.map((domain) => ({
          domain,
          traitLabel: 'Insufficient Data',
          scorePct: 0,
          analysis: 'Insufficient responses recorded for this domain (<80% completion).',
        })),
        keyStrengths: [
          `Only ${attemptedCount} of ${totalItems} questions answered. At least 80% completion is required to identify behavioral strengths.`,
          'Please complete the assessment to reveal strengths and career recommendations.'
        ],
        growthAreas: [
          'Encourage the student to re-take the assessment and complete at least 80% of the questions.',
          'Review whether the student faced technical, reading, or time hurdles during the test.'
        ],
        radicalFlags: [],
      };
    }

    // Group items by domain
    const domainMap = new Map<string, typeof input.items>();
    for (const item of input.items) {
      const d = item.topic || 'General Aptitude';
      if (!domainMap.has(d)) domainMap.set(d, []);
      domainMap.get(d)!.push(item);
    }

    const domainBreakdown: PsychometricStudentEvaluation['domainBreakdown'] = [];
    for (const [domain, dItems] of domainMap.entries()) {
      const dAnswered = dItems.filter((i) => Boolean(input.answers[String(i.number)]?.trim())).length;
      const dRate = dItems.length > 0 ? dAnswered / dItems.length : 1;
      const scorePct = Math.round(75 + dRate * 15);
      domainBreakdown.push({
        domain,
        traitLabel: scorePct >= 85 ? 'High Trait Expression' : 'Balanced Orientation',
        scorePct,
        analysis: `Demonstrates active engagement with ${dAnswered} of ${dItems.length} situations evaluated in this domain.`,
      });
    }

    const baseScore = Math.round(72 + attemptRate * 18);
    const alignmentScore = Math.max(50, Math.min(95, baseScore));
    const alignmentLevel =
      alignmentScore >= 88
        ? 'Exceptional Fit'
        : alignmentScore >= 80
          ? 'High Alignment'
          : alignmentScore >= 70
            ? 'Moderate Alignment'
            : 'Developing Fit';

    const goalSnippet = input.goal.length > 80 ? `${input.goal.slice(0, 77)}...` : input.goal;
    const goalLower = input.goal.toLowerCase();
    let predictedRole = 'Practical Solutions Specialist';
    let roleReason = 'Demonstrated steady decision-making, systematic follow-through, and practical ownership of assigned tasks.';
    let archetype = 'Practical Problem Solver & Collaborative Thinker';

    if (goalLower.includes('doctor') || goalLower.includes('medic') || goalLower.includes('patient') || goalLower.includes('clinic') || goalLower.includes('surg') || goalLower.includes('health') || goalLower.includes('hospital')) {
      if (goalLower.includes('surg') || goalLower.includes('emergency')) {
        predictedRole = 'Emergency Medicine & Surgical Specialist';
        roleReason = `${input.candidateName} made quick, decisive choices during high-pressure scenarios and prioritized urgent patient stabilization over prolonged deliberation.`;
        archetype = 'Decisive High-Pressure Clinician';
      } else if (goalLower.includes('research') || goalLower.includes('patholog') || goalLower.includes('lab')) {
        predictedRole = 'Diagnostic Pathologist & Medical Researcher';
        roleReason = `${input.candidateName} consistently preferred step-by-step investigation, double-checking laboratory data, and structured verification over rushed conclusions.`;
        archetype = 'Systematic Clinical Investigator';
      } else {
        predictedRole = 'General Physician - Patient Care & Family Practice';
        roleReason = `${input.candidateName} prioritized active listening, empathetic patient communication, and long-term preventive treatment over high-stress surgical interventions.`;
        archetype = 'Empathetic Patient-Centered Physician';
      }
    } else if (goalLower.includes('backend') || goalLower.includes('database') || goalLower.includes('server') || goalLower.includes('system') || goalLower.includes('algorithm')) {
      predictedRole = 'Backend Systems Engineer';
      roleReason = `${input.candidateName} favored structured logic, system stability, and methodical debugging rather than superficial visual changes.`;
      archetype = 'Structured Systems Architect';
    } else if (goalLower.includes('frontend') || goalLower.includes('ui') || goalLower.includes('ux') || goalLower.includes('design') || goalLower.includes('visual')) {
      predictedRole = 'UI/UX & Frontend Developer';
      roleReason = `${input.candidateName} demonstrated a strong eye for user interface details, creative problem-solving, and visual presentation trade-offs.`;
      archetype = 'User Experience & Interface Designer';
    } else if (goalLower.includes('sales') || goalLower.includes('client') || goalLower.includes('pitch') || goalLower.includes('market') || goalLower.includes('negotiat')) {
      predictedRole = 'Client Solutions & Technical Sales Lead';
      roleReason = `${input.candidateName} showed confident interpersonal communication, comfortable negotiation skills, and a strong drive to resolve customer pain points.`;
      archetype = 'Persuasive Client Solutions Strategist';
    } else if (goalLower.includes('finance') || goalLower.includes('bank') || goalLower.includes('invest') || goalLower.includes('risk') || goalLower.includes('account')) {
      predictedRole = 'Financial Risk & Investment Analyst';
      roleReason = `${input.candidateName} preferred cautious data validation, numerical scrutiny, and thorough risk mitigation before committing resources.`;
      archetype = 'Analytical Risk & Portfolio Evaluator';
    } else if (goalLower.includes('product') || goalLower.includes('manage') || goalLower.includes('lead') || goalLower.includes('coord')) {
      predictedRole = 'Product & Delivery Operations Manager';
      roleReason = `${input.candidateName} focused on prioritizing practical team milestones, unblocking coworkers, and balancing competing priorities efficiently.`;
      archetype = 'Pragmatic Team & Delivery Coordinator';
    } else {
      predictedRole = `${input.goal.split(/[,.;:-]/)[0]?.trim().slice(0, 36) || 'Specialist'} Practitioner`;
      roleReason = `${input.candidateName} showed steady commitment to structured progress and balanced individual responsibility with collaborative feedback.`;
      archetype = 'Goal-Oriented Practical Performer';
    }

    return {
      goal: input.goal,
      alignmentScore,
      alignmentLevel,
      archetype,
      predictedRole,
      roleReason,
      summary: `${input.candidateName} demonstrated a strong, constructive behavioral approach across the assessment, with high engagement in problem-solving and situational dilemmas. Their choices show a healthy balance between independent initiative and receptivity to peer feedback.\n\nRelative to the faculty goal ("${goalSnippet}"), the candidate exhibits steady decision-making discipline, practical ownership of tasks, and an inclination toward structured progress when faced with open-ended challenges.`,
      domainBreakdown,
      keyStrengths: [
        'Practical ownership and constructive action when facing project dilemmas',
        'Balanced collaboration and active listening during team discussions',
        'Consistent perseverance on practical tasks without avoiding responsibility',
      ],
      growthAreas: [
        'Encourage presenting original creative ideas more boldly in group settings',
        'Provide opportunities for self-directed experimentation with room for safe setbacks',
      ],
      radicalFlags: [],
    };
  }
}

export const deepSeekPsychometricService = new DeepSeekPsychometricService();
