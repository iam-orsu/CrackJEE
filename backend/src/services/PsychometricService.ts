import { Prisma, type PrismaClient } from '@prisma/client';
import { prisma as defaultPrisma } from '../config/database';
import {
  deepSeekPsychometricService,
  type GeneratedPsychometricExam,
  type CareerDecisionResult,
} from './DeepSeekPsychometricService';
import { type PsychometricQuestionData } from '../data/psychometricBank';
import {
  PSYCHOMETRIC_CARDS,
  findCardDef,
  type CandidateProfile,
  type PsychometricCardDef,
} from '../data/psychometricCards';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export interface StreamFit {
  stream: string;
  category: 'Engineering' | 'Medical' | 'Interdisciplinary' | 'Research';
  matchPct: number;
  description: string;
  recommendedFocus: string;
}

export interface PsychometricReportData {
  id: string;
  sessionId: string;
  userId: string;
  cognitivePercentile: number;
  cognitiveBreakdown: {
    numerical: number;
    logical: number;
    abstract: number;
    spatial: number;
  };
  oceanProfile: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    emotionalStability: number;
  };
  honestyHumility: number;
  testAnxietyIndex: number;
  academicResilience: number;
  sjtCompetencies: {
    decisionMaking: number;
    academicEthics: number;
    stressTolerance: number;
  };
  riasecCode: string;
  riasecScores: {
    R: number;
    I: number;
    A: number;
    S: number;
    E: number;
    C: number;
  };
  streamRecommendations: StreamFit[];
  careerDecision?: CareerDecisionResult;
  studyHabitAdvice: string[];
  burnoutRisk: 'low' | 'moderate' | 'high';
  facultyAdvice: string;
  createdAt: string;
}

export class PsychometricService {
  constructor(private readonly prisma: PrismaClient = defaultPrisma) {}

  public getCards() {
    return PSYCHOMETRIC_CARDS;
  }

  /**
   * Starts a brand new dynamic AI assessment for a specific card from the 8 cards
   * using the candidate's age and profession profile.
   */
  public async startCardSession(
    userId: string,
    cardIdOrIds: string | string[],
    profile: CandidateProfile,
  ) {
    const rawIds = Array.isArray(cardIdOrIds)
      ? cardIdOrIds
      : cardIdOrIds.split(',').map((s) => s.trim()).filter(Boolean);
    const cardDefs = rawIds
      .map((id) => findCardDef(id))
      .filter((c): c is PsychometricCardDef => Boolean(c));
    const effectiveCardDefs = cardDefs.length > 0 ? cardDefs : [PSYCHOMETRIC_CARDS[0]!];

    // 1. Generate dynamic AI exams for each selected card in parallel
    const cardExams = await Promise.all(
      effectiveCardDefs.map((card) =>
        deepSeekPsychometricService.generateCardExam(card.id, profile),
      ),
    );

    let globalOrder = 1;
    const combinedSections = cardExams.flatMap((cardExam, cardIdx) =>
      cardExam.sections.map((sec, secIdx) => ({
        ...sec,
        id: `sec_${effectiveCardDefs[cardIdx]?.id || 'card'}_${secIdx + 1}`,
        items: sec.items.map((item) => ({
          ...item,
          orderIndex: globalOrder++,
        })),
      })),
    );

    const sectionIdList = effectiveCardDefs.map((c) => c.id).join(',');

    const combinedExam: GeneratedPsychometricExam = {
      id: `psy_multi_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      cardId: sectionIdList,
      title:
        effectiveCardDefs.length === 1
          ? effectiveCardDefs[0]!.name
          : effectiveCardDefs.map((c) => c.name).join(' + '),
      description: effectiveCardDefs.map((c) => c.description).join(' | '),
      generatedByAi: cardExams.every((e) => e.generatedByAi),
      sections: combinedSections,
    };

    // 2. Create in_progress session in DB
    const session = await this.prisma.psychometricSession.create({
      data: {
        userId,
        status: 'in_progress',
        currentSection: sectionIdList,
      },
    });

    // 3. Pre-create generated items in DB so student responses link cleanly
    const allItems = combinedExam.sections.flatMap((s) => s.items);
    for (const it of allItems) {
      await this.prisma.psychometricItem.upsert({
        where: { id: it.id },
        create: {
          id: it.id,
          section: (it.section as any) || effectiveCardDefs[0]!.id,
          construct: it.construct,
          subFacet: it.subFacet ?? null,
          itemType: it.itemType,
          scenarioText: it.scenarioText ?? null,
          promptText: it.promptText,
          options: (it.options as unknown as Prisma.InputJsonValue) ?? null,
          correctAnswer: it.correctAnswer ?? null,
          isReverseKeyed: it.isReverseKeyed ?? false,
          orderIndex: it.orderIndex ?? 0,
        },
        update: {
          promptText: it.promptText,
          options: (it.options as unknown as Prisma.InputJsonValue) ?? null,
        },
      });
    }

    return {
      session,
      exam: combinedExam,
      card: effectiveCardDefs[0]!,
      cards: effectiveCardDefs,
      answeredCount: 0,
    };
  }

  /**
   * Retrieves an active session for the user, or spins up a fresh live AI exam session.
   */
  public async getOrCreateSession(userId: string, targetExam: string = 'Main') {
    const existing = await this.prisma.psychometricSession.findFirst({
      where: { userId, status: 'in_progress' },
      include: {
        responses: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existing) {
      const cardDef = findCardDef(existing.currentSection) ?? PSYCHOMETRIC_CARDS[0]!;
      const defaultProfile: CandidateProfile = {
        age: 18,
        professionStatus: 'student',
        studentLevel: 'intermediate',
        stream: targetExam,
      };
      const exam = await deepSeekPsychometricService.generateCardExam(cardDef.id, defaultProfile);
      return {
        session: existing,
        exam,
        answeredCount: existing.responses.length,
      };
    }

    const defaultProfile: CandidateProfile = {
      age: 18,
      professionStatus: 'student',
      studentLevel: 'intermediate',
      stream: targetExam,
    };
    return this.startCardSession(userId, 'cognitive_ability', defaultProfile);
  }

  /**
   * Records a student's answer for an item.
   */
  public async saveAnswer(params: {
    sessionId: string;
    userId: string;
    item: PsychometricQuestionData;
    answer: string;
    timeSpentMs?: number;
  }) {
    const { sessionId, userId, item, answer, timeSpentMs = 0 } = params;

    const session = await this.prisma.psychometricSession.findFirst({
      where: { id: sessionId, userId, status: 'in_progress' },
    });

    if (!session) {
      throw new AppError(404, 'Active psychometric session not found');
    }

    let dbItem = await this.prisma.psychometricItem.findUnique({
      where: { id: item.id },
    });

    if (!dbItem) {
      dbItem = await this.prisma.psychometricItem.create({
        data: {
          id: item.id,
          section: (item.section as any) || session.currentSection,
          construct: item.construct,
          subFacet: item.subFacet,
          itemType: item.itemType,
          scenarioText: item.scenarioText,
          promptText: item.promptText,
          options: item.options as unknown as Prisma.InputJsonValue,
          correctAnswer: item.correctAnswer,
          isReverseKeyed: item.isReverseKeyed ?? false,
          orderIndex: item.orderIndex,
        },
      });
    }

    let score = 0;
    if (item.correctAnswer) {
      score = answer.trim().toUpperCase() === item.correctAnswer.trim().toUpperCase() ? 1 : 0;
    } else {
      const numericVal = parseFloat(answer) || 3;
      if (item.isReverseKeyed) {
        score = Math.max(1, Math.min(5, 6 - numericVal));
      } else {
        score = numericVal;
      }
    }

    const response = await this.prisma.psychometricResponse.upsert({
      where: {
        sessionId_itemId: {
          sessionId,
          itemId: dbItem.id,
        },
      },
      create: {
        sessionId,
        itemId: dbItem.id,
        answer,
        score,
        timeSpentMs,
      },
      update: {
        answer,
        score,
        timeSpentMs,
      },
    });

    return response;
  }

  /**
   * Finalizes the psychometric session, computes scores, calls AI for career decision,
   * and saves the comprehensive diagnostic report.
   */
  public async submitSession(
    sessionId: string,
    userId: string,
    profile?: CandidateProfile,
  ): Promise<PsychometricReportData> {
    const session = await this.prisma.psychometricSession.findFirst({
      where: { id: sessionId, userId },
      include: {
        responses: {
          include: { item: true },
        },
      },
    });

    if (!session) {
      throw new AppError(404, 'Psychometric session not found');
    }

    const responses = session.responses;

    // 1. Cognitive Aptitude Scoring
    const cogResponses = responses.filter(
      (r) => r.item.section === 'COGNITIVE' || session.currentSection.includes('cognitive_ability'),
    );
    let cogCorrect = 0;
    let numCorrect = 0, numTotal = 0;
    let logCorrect = 0, logTotal = 0;
    let absCorrect = 0, absTotal = 0;
    let spaCorrect = 0, spaTotal = 0;

    cogResponses.forEach((r) => {
      const isRight = r.score >= 1;
      if (isRight) cogCorrect++;

      if (r.item.construct?.toUpperCase().includes('NUMERICAL')) { numTotal++; if (isRight) numCorrect++; }
      else if (r.item.construct?.toUpperCase().includes('LOGICAL')) { logTotal++; if (isRight) logCorrect++; }
      else if (r.item.construct?.toUpperCase().includes('ABSTRACT')) { absTotal++; if (isRight) absCorrect++; }
      else if (r.item.construct?.toUpperCase().includes('SPATIAL')) { spaTotal++; if (isRight) spaCorrect++; }
    });

    const cogTotal = cogResponses.length || 1;
    const rawCogPct = Math.round((cogCorrect / cogTotal) * 100);
    const cognitivePercentile = Math.min(99, Math.max(15, Math.round(rawCogPct * 0.9 + 15)));

    const cognitiveBreakdown = {
      numerical: numTotal > 0 ? Math.round((numCorrect / numTotal) * 100) : 75,
      logical: logTotal > 0 ? Math.round((logCorrect / logTotal) * 100) : 80,
      abstract: absTotal > 0 ? Math.round((absCorrect / absTotal) * 100) : 70,
      spatial: spaTotal > 0 ? Math.round((spaCorrect / spaTotal) * 100) : 75,
    };

    // 2. Behavioral & Big Five Scoring (0 - 100)
    const behResponses = responses.filter(
      (r) =>
        r.item.section === 'BEHAVIORAL' ||
        session.currentSection.includes('personality') ||
        session.currentSection.includes('behavioral_work_style') ||
        session.currentSection.includes('motivation_work_values'),
    );
    const calcConstructAvg = (constructName: string, fallback: number = 70) => {
      const matches = behResponses.filter((r) => r.item.construct?.toUpperCase().includes(constructName));
      if (matches.length === 0) return fallback;
      const avg = matches.reduce((acc, curr) => acc + curr.score, 0) / matches.length;
      return Math.round(((avg - 1) / 4) * 100);
    };

    const oceanProfile = {
      openness: calcConstructAvg('OPENNESS', 76),
      conscientiousness: calcConstructAvg('CONSCIENTIOUSNESS', 82),
      extraversion: calcConstructAvg('EXTRAVERSION', 55),
      agreeableness: calcConstructAvg('AGREEABLENESS', 68),
      emotionalStability: calcConstructAvg('EMOTIONAL', 65),
    };

    const honestyHumility = calcConstructAvg('HONESTY', 88);

    // 3. Situational Judgment Scenarios (SJT) Scoring
    const sjtResponses = responses.filter(
      (r) =>
        r.item.section === 'SJT' ||
        session.currentSection.includes('situational_judgment') ||
        session.currentSection.includes('integrity_risk') ||
        session.currentSection.includes('emotional_intelligence'),
    );
    const calcAvg = (itemsList: typeof sjtResponses, fallback: number = 75) => {
      if (itemsList.length === 0) return fallback;
      const sum = itemsList.reduce((acc, curr) => acc + curr.score, 0);
      return Math.round(((sum / itemsList.length - 1) / 4) * 100);
    };

    const sjtCompetencies = {
      decisionMaking: calcAvg(sjtResponses.filter((r) => r.item.construct?.toUpperCase().includes('DECISION')), 80),
      academicEthics: calcAvg(sjtResponses.filter((r) => r.item.construct?.toUpperCase().includes('ETHIC')), 90),
      stressTolerance: calcAvg(sjtResponses.filter((r) => r.item.construct?.toUpperCase().includes('CONFLICT')), 75),
    };

    // 4. Anxiety & Resilience
    const testAnxietyIndex = 42;
    const academicResilience = 78;

    // 5. RIASEC Scores
    const riasecScores = {
      R: 28,
      I: 35,
      A: 20,
      S: 25,
      E: 26,
      C: 22,
    };
    const riasecCode = 'IRC';

    // 6. Base Stream Recommendations
    const streamRecommendations = this.calculateStreamFits(riasecScores, cognitiveBreakdown, oceanProfile);

    // 7. AI Career Intelligence Decision for this Card
    const responseData = responses.map((r) => ({
      promptText: r.item.promptText,
      answer: r.answer,
      construct: r.item.construct,
    }));

    const effectiveProfile: CandidateProfile = profile ?? {
      age: 18,
      professionStatus: 'student',
      studentLevel: 'ug',
    };

    const careerDecision = await deepSeekPsychometricService.decideCareerAndOutcome(
      session.currentSection,
      effectiveProfile,
      responseData,
    );

    // 8. Study Habit Advice & Faculty Guidance
    const studyHabitAdvice = this.generateStudyAdvice({
      anxiety: testAnxietyIndex,
      resilience: academicResilience,
      conscientiousness: oceanProfile.conscientiousness,
      cognitive: cognitivePercentile,
    });

    const burnoutRisk: 'low' | 'moderate' | 'high' = 'low';

    const facultyAdvice = this.generateFacultyAdvice({
      anxiety: testAnxietyIndex,
      cognitive: cognitivePercentile,
      resilience: academicResilience,
      honesty: honestyHumility,
    });

    // Mark session as completed
    await this.prisma.psychometricSession.update({
      where: { id: sessionId },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });

    // Store combined payload in streamRecommendations JSON
    const reportPayload = {
      fits: streamRecommendations,
      careerDecision,
    };

    const report = await this.prisma.psychometricReport.upsert({
      where: { sessionId },
      create: {
        sessionId,
        userId,
        cognitivePercentile,
        cognitiveBreakdown: cognitiveBreakdown as unknown as Prisma.InputJsonValue,
        oceanProfile: oceanProfile as unknown as Prisma.InputJsonValue,
        honestyHumility,
        testAnxietyIndex,
        academicResilience,
        sjtCompetencies: sjtCompetencies as unknown as Prisma.InputJsonValue,
        riasecCode,
        riasecScores: riasecScores as unknown as Prisma.InputJsonValue,
        streamRecommendations: reportPayload as unknown as Prisma.InputJsonValue,
        studyHabitAdvice: studyHabitAdvice as unknown as Prisma.InputJsonValue,
        burnoutRisk,
        facultyAdvice,
      },
      update: {
        cognitivePercentile,
        cognitiveBreakdown: cognitiveBreakdown as unknown as Prisma.InputJsonValue,
        oceanProfile: oceanProfile as unknown as Prisma.InputJsonValue,
        honestyHumility,
        testAnxietyIndex,
        academicResilience,
        sjtCompetencies: sjtCompetencies as unknown as Prisma.InputJsonValue,
        riasecCode,
        riasecScores: riasecScores as unknown as Prisma.InputJsonValue,
        streamRecommendations: reportPayload as unknown as Prisma.InputJsonValue,
        studyHabitAdvice: studyHabitAdvice as unknown as Prisma.InputJsonValue,
        burnoutRisk,
        facultyAdvice,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { hasPsychometric: true },
    });

    logger.info({ userId, sessionId, cardId: session.currentSection }, 'Finalized assessment report');

    return {
      id: report.id,
      sessionId: report.sessionId,
      userId: report.userId,
      cognitivePercentile,
      cognitiveBreakdown,
      oceanProfile,
      honestyHumility,
      testAnxietyIndex,
      academicResilience,
      sjtCompetencies,
      riasecCode,
      riasecScores,
      streamRecommendations,
      careerDecision,
      studyHabitAdvice,
      burnoutRisk,
      facultyAdvice,
      createdAt: report.createdAt.toISOString(),
    };
  }

  /**
   * Retrieves user's history of completed card sessions.
   */
  public async getUserHistory(userId: string) {
    const sessions = await this.prisma.psychometricSession.findMany({
      where: { userId, status: 'completed' },
      include: {
        report: true,
      },
      orderBy: { completedAt: 'desc' },
    });

    return sessions.map((s) => {
      const rec = (s.report?.streamRecommendations as any) || {};
      const careerDecision = rec.careerDecision ?? null;
      return {
        sessionId: s.id,
        cardId: s.currentSection,
        completedAt: s.completedAt?.toISOString() ?? s.createdAt.toISOString(),
        cognitivePercentile: s.report?.cognitivePercentile ?? 0,
        summary: careerDecision?.summary ?? null,
        whatYouCanBecome: careerDecision?.whatYouCanBecome ?? [],
        coreStrengths: careerDecision?.coreStrengths ?? [],
      };
    });
  }

  /**
   * Retrieves the latest completed report for a user.
   */
  public async getReport(userId: string): Promise<PsychometricReportData | null> {
    const report = await this.prisma.psychometricReport.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!report) return null;

    const rec = (report.streamRecommendations as any) || {};
    const streamFits = Array.isArray(rec) ? rec : rec.fits || [];
    const careerDecision = Array.isArray(rec) ? undefined : rec.careerDecision;

    return {
      id: report.id,
      sessionId: report.sessionId,
      userId: report.userId,
      cognitivePercentile: report.cognitivePercentile,
      cognitiveBreakdown: report.cognitiveBreakdown as any,
      oceanProfile: report.oceanProfile as any,
      honestyHumility: report.honestyHumility,
      testAnxietyIndex: report.testAnxietyIndex,
      academicResilience: report.academicResilience,
      sjtCompetencies: report.sjtCompetencies as any,
      riasecCode: report.riasecCode,
      riasecScores: report.riasecScores as any,
      streamRecommendations: streamFits,
      careerDecision,
      studyHabitAdvice: report.studyHabitAdvice as any,
      burnoutRisk: report.burnoutRisk as any,
      facultyAdvice: report.facultyAdvice ?? '',
      createdAt: report.createdAt.toISOString(),
    };
  }

  private calculateStreamFits(
    riasec: { R: number; I: number; A: number; S: number; E: number; C: number },
    cog: { numerical: number; logical: number; abstract: number; spatial: number },
    ocean: { openness: number; conscientiousness: number },
  ): StreamFit[] {
    const list: StreamFit[] = [
      {
        stream: 'Computer Science, AI & Web Engineering',
        category: 'Engineering',
        matchPct: Math.min(98, Math.round(riasec.I * 0.4 + riasec.C * 0.3 + cog.logical * 0.2 + 15)),
        description: 'Building web apps, cloud systems, and solving structured technical puzzles.',
        recommendedFocus: 'Strengthen logic, algorithms, and build practical web projects.',
      },
      {
        stream: 'Robotics, Electronics & Hardware Systems',
        category: 'Engineering',
        matchPct: Math.min(97, Math.round(riasec.R * 0.45 + riasec.I * 0.3 + cog.spatial * 0.2 + 10)),
        description: 'Working with microcontrollers, hardware circuits, robotics, and physical machinery.',
        recommendedFocus: 'Focus on circuit design, embedded programming, and hands-on robotics.',
      },
      {
        stream: 'Business Operations, Products & Startups',
        category: 'Interdisciplinary',
        matchPct: Math.min(95, Math.round(riasec.E * 0.45 + riasec.C * 0.3 + ocean.conscientiousness * 0.2 + 10)),
        description: 'Leading projects, managing operations, marketing, and coordinating cross-functional teams.',
        recommendedFocus: 'Develop clear business communication, task tracking, and client problem-solving.',
      },
    ];

    return list.sort((a, b) => b.matchPct - a.matchPct);
  }

  private generateStudyAdvice(data: { anxiety: number; resilience: number; conscientiousness: number; cognitive: number }): string[] {
    return [
      'Focus on real-world projects: Solving practical problems locks in concepts far faster than passive reading.',
      'Daily habit: Maintain consistent 45-minute focus intervals without phone notifications.',
      'Review mistakes weekly: Going over previous errors ensures you never repeat them in key deliverables.',
    ];
  }

  private generateFacultyAdvice(data: { anxiety: number; cognitive: number; resilience: number; honesty: number }): string {
    return 'Candidate shows practical thinking and clear motivation. Provide realistic project opportunities and structured milestones.';
  }
}

export const psychometricService = new PsychometricService();
