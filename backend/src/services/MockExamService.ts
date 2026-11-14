import { MOCK_CONSTANTS } from '../config/constants';
import { MockExamRepository } from '../repositories/MockExamRepository';
import { TopicRepository } from '../repositories/TopicRepository';
import { CacheService, cacheService as defaultCache } from './CacheService';
import { ScoringService, scoringService as defaultScoring } from './ScoringService';
import { MockGeneratorService, mockGeneratorService as defaultGenerator } from './MockGeneratorService';
import { MockDataService } from './MockDataService';
import {
  topicStats,
  strongAndWeak,
  topMarksLost,
  negativeAnalysis,
  timeByType,
  subjectOrder,
  cutoffComparison,
} from './mockInsights';
import { cutoffsFor } from './examCutoffs';
import { isExamExpired } from '../utils/questionUtils';
import { AppError } from '../utils/AppError';

export class MockExamService {
  constructor(
    private readonly mockRepo: MockExamRepository = new MockExamRepository(),
    private readonly cache: CacheService = defaultCache,
    private readonly scoring: ScoringService = defaultScoring,
    private readonly generator: MockGeneratorService = defaultGenerator,
    private readonly mockData: MockDataService = new MockDataService(),
    private readonly topicRepo: TopicRepository = new TopicRepository(),
  ) {}

  private async withStartLock<T>(userId: string, task: () => Promise<T>): Promise<T> {
    const key = `lock:mockstart:${userId}`;
    if (!(await this.cache.setNx(key, MOCK_CONSTANTS.START_LOCK_SECONDS))) {
      throw new AppError(409, 'Your exam is already being created. Please wait a moment.');
    }
    try {
      return await task();
    } finally {
      await this.cache.del(key);
    }
  }

  public async sweepStuckGenerations(userId?: string): Promise<number> {
    const cutoff = new Date(Date.now() - MOCK_CONSTANTS.STUCK_GENERATION_MS);
    const res = await this.mockRepo.sweepStuckGenerating(cutoff, userId);
    return res.count;
  }

  public async startMock(
    userId: string,
    examType: 'Main' | 'Advanced' | 'NEET',
    difficultyMode: 'easy' | 'medium' | 'hard',
    paperNumber?: number,
  ) {
    const started = await this.withStartLock(userId, async () => {
      await this.sweepStuckGenerations(userId);

      const active = await this.mockRepo.findActiveForUser(userId);
      if (active) {
        throw new AppError(409, 'You have an exam in progress. Terminate it before starting a new one.');
      }

      const exam = await this.mockRepo.createExam(userId, examType, difficultyMode);
      return { exam, isNew: true };
    });

    if (started.isNew) {
      const job = this.generator
        .runMockGeneration(started.exam.id, userId, examType, difficultyMode, paperNumber)
        .catch(() => {});
      this.generator.trackGeneration(job);
    }

    return { id: started.exam.id, status: started.exam.status };
  }

  public async getMock(userId: string, examId: string) {
    const exam = await this.mockRepo.findByIdWithQuestions(examId);
    if (!exam || exam.userId !== userId) throw new AppError(404, 'Exam not found');

    const questions = exam.questions.map((mq) => ({
      mockQuestionId: mq.id,
      questionNumber: mq.questionNumber,
      subjectIndex: mq.subjectIndex,
      subject: mq.subject,
      savedAnswer: mq.savedAnswer,
      markedForReview: mq.markedForReview,
      questionText: mq.question.questionText,
      questionType: mq.question.questionType,
      options: mq.question.options as string[],
      topic: mq.question.topic,
      difficulty: mq.question.difficulty,
      diagram: mq.question.diagram,
    }));

    let timeLeft: number | undefined;
    if (exam.startedAt && exam.status === 'in_progress') {
      const elapsed = Math.floor((Date.now() - exam.startedAt.getTime()) / 1000);
      timeLeft = Math.max(0, exam.durationSeconds - elapsed);
    }

    return {
      id: exam.id,
      examType: exam.examType,
      status: exam.status,
      durationSeconds: exam.durationSeconds,
      startedAt: exam.startedAt?.toISOString() ?? null,
      submittedAt: exam.submittedAt?.toISOString() ?? null,
      timeLeft,
      questions,
    };
  }

  public async beginMock(userId: string, examId: string) {
    const exam = await this.mockRepo.findById(examId);
    if (!exam || exam.userId !== userId) throw new AppError(404, 'Exam not found');

    if (exam.startedAt) {
      return { startedAt: exam.startedAt.toISOString() };
    }

    if (exam.status !== 'ready') throw new AppError(400, 'Exam is not ready to start');

    const startedAt = new Date();
    const claimed = await this.mockRepo.claimReadyExam(examId, userId, startedAt);
    if (claimed.count === 0) {
      const current = await this.mockRepo.findStartedAt(examId);
      if (current?.startedAt) {
        return { startedAt: current.startedAt.toISOString() };
      }
      throw new AppError(400, 'Exam is not ready to start');
    }

    return { startedAt: startedAt.toISOString() };
  }

  public async saveAnswer(
    userId: string,
    examId: string,
    mockQuestionId: string,
    answer: string,
    markedForReview?: boolean,
  ): Promise<void> {
    const exam = await this.mockRepo.findStatusOwnerAndTiming(examId);
    if (!exam || exam.userId !== userId) throw new AppError(404, 'Exam not found');
    if (exam.status !== 'in_progress') throw new AppError(400, 'Exam not in progress');
    if (isExamExpired(exam.startedAt, exam.durationSeconds)) {
      throw new AppError(400, 'Time is up. Answers can no longer be changed.');
    }

    const updated = await this.mockRepo.saveQuestionAnswer(
      examId,
      mockQuestionId,
      answer || null,
      markedForReview,
    );
    if (updated.count === 0) throw new AppError(404, 'Question not found in this exam');
  }

  public async submitMock(
    userId: string,
    examId: string,
    questionTimes: Record<string, number> = {},
  ): Promise<{ resultId: string }> {
    const exam = await this.mockRepo.findForSubmit(examId);
    if (!exam || exam.userId !== userId) throw new AppError(404, 'Exam not found');

    if (exam.status === 'submitted') {
      const existing = await this.mockRepo.findResultByExamId(examId);
      if (existing) return { resultId: existing.id };
      throw new AppError(400, 'Already submitted');
    }
    if (exam.status !== 'in_progress') throw new AppError(400, 'Exam not started');

    const examType = exam.examType as 'Main' | 'Advanced' | 'NEET';
    let physicsScore = 0;
    let chemistryScore = 0;
    let mathScore = 0;
    let biologyScore = 0;
    let correct = 0;
    let partial = 0;
    let incorrect = 0;
    let unattempted = 0;
    let maxScore = 0;

    const breakdown: Record<string, {
      questionId: string;
      subject: string;
      submitted: string | null;
      correctAnswer: string;
      awarded: number;
      maxMarks: number;
      questionType: string;
      timeSpentSeconds: number;
    }> = {};

    const topicResults: Array<{ topicId: string; isCorrect: boolean; marksLost: number }> = [];

    for (const mq of exam.questions) {
      const q = mq.question;
      const marks = this.scoring.scoreQuestion(examType, q.questionType, mq.savedAnswer, q.answer);
      const maxMarks = this.scoring.getMaxMarkPerQuestion(examType, q.questionType);
      maxScore += maxMarks;

      const isCorrect = marks === maxMarks;
      const marksLost = Math.max(0, maxMarks - marks);

      if (q.topicId) {
        topicResults.push({
          topicId: q.topicId,
          isCorrect,
          marksLost,
        });
      }

      if (!mq.savedAnswer) unattempted++;
      else if (isCorrect) correct++;
      else if (marks > 0) partial++;
      else incorrect++;

      if (mq.subject === 'Physics') physicsScore += marks;
      else if (mq.subject === 'Chemistry') chemistryScore += marks;
      else if (mq.subject === 'Botany' || mq.subject === 'Zoology') biologyScore += marks;
      else mathScore += marks;

      breakdown[mq.id] = {
        questionId: mq.questionId,
        subject: mq.subject,
        submitted: mq.savedAnswer,
        correctAnswer: q.answer,
        awarded: marks,
        maxMarks,
        questionType: q.questionType,
        timeSpentSeconds: questionTimes[mq.id] ?? 0,
      };
    }

    const totalScore = physicsScore + chemistryScore + mathScore + biologyScore;
    const timeTaken = exam.startedAt
      ? Math.min(Math.floor((Date.now() - exam.startedAt.getTime()) / 1000), exam.durationSeconds)
      : exam.durationSeconds;

    try {
      const result = await this.mockRepo.createResultAndMarkSubmitted({
        examId,
        totalScore,
        maxScore,
        physicsScore,
        chemistryScore,
        mathScore,
        biologyScore,
        correct,
        partial,
        incorrect,
        unattempted,
        timeTaken,
        scoreBreakdown: breakdown,
      });

      // Update student topic mastery records asynchronously
      await this.topicRepo.batchRecordExamResults(userId, topicResults).catch(() => {});

      await Promise.all([
        this.cache.del(`mock-answers:${userId}`),
        this.cache.del(`overall:user:${userId}`),
      ]);
      return { resultId: result.id };
    } catch (err) {
      if ((err as { code?: string }).code === 'P2002') {
        const existing = await this.mockRepo.findResultByExamId(examId);
        if (existing) return { resultId: existing.id };
      }
      throw err;
    }
  }

  public async getMockResult(userId: string, examId: string) {
    const exam = await this.mockRepo.findForResult(examId);
    if (!exam || exam.userId !== userId) throw new AppError(404, 'Exam not found');
    if (!exam.result) throw new AppError(404, 'Result not yet available');

    const questions = exam.questions.map((mq) => ({
      mockQuestionId: mq.id,
      questionId: mq.questionId,
      questionNumber: mq.questionNumber,
      subjectIndex: mq.subjectIndex,
      subject: mq.subject,
      savedAnswer: mq.savedAnswer,
      markedForReview: mq.markedForReview,
      questionText: mq.question.questionText,
      questionType: mq.question.questionType,
      options: mq.question.options as string[],
      topic: mq.question.topic,
      difficulty: mq.question.difficulty,
      explanation: mq.question.explanation,
      answer: mq.question.answer,
    }));

    return { exam: { ...exam, questions }, result: exam.result };
  }

  public async cancelMock(userId: string, examId: string): Promise<void> {
    const exam = await this.mockRepo.findOwnerAndStatus(examId);
    if (!exam || exam.userId !== userId) throw new AppError(404, 'Exam not found');
    if (exam.status === 'submitted') throw new AppError(400, 'Cannot cancel a submitted exam');

    const updated = await this.mockRepo.cancelNonSubmitted(examId);
    if (updated.count === 0) throw new AppError(400, 'Cannot cancel a submitted exam');
  }

  public getMockHistory(userId: string) {
    return this.mockRepo.findHistoryByUser(userId, 20);
  }

  public async getExamInsights(userId: string, examId: string) {
    const exam = await this.mockData.loadExamMockData(userId, examId);
    if (!exam) throw new AppError(404, 'Result not yet available');

    const { records } = exam;
    const stats = topicStats(records);
    const { weak } = strongAndWeak(stats);
    const cutoffs = cutoffsFor(exam.examType);

    return {
      cutoffs: cutoffs && exam.scorePct !== null
        ? { name: cutoffs.name, sources: cutoffs.sources, lines: cutoffComparison(exam.scorePct, cutoffs.lines) }
        : null,
      topics: [...stats].sort((a, b) => a.accuracy - b.accuracy || b.marksLost - a.marksLost),
      weakTopics: weak,
      marksLostTopics: topMarksLost(stats),
      negatives: negativeAnalysis(records),
      timeByType: timeByType(records),
      subjectOrder: subjectOrder(records),
    };
  }

  public async getQuestionExplanation(userId: string, examId: string, mockQuestionId: string) {
    const exam = await this.mockRepo.findSubmittedOwnedExam(examId, userId);
    if (!exam) throw new AppError(404, 'Result not yet available');

    const mq = await this.mockRepo.findQuestionForExplanation(examId, mockQuestionId);
    if (!mq) throw new AppError(404, 'Question not found');

    const q = mq.question;
    const explanation = await this.generator.getOrGenerateQuestionExplanation({
      id: q.id,
      questionText: q.questionText,
      options: q.options as string[],
      answer: q.answer,
      questionType: q.questionType,
      subject: q.subject,
      topic: q.topic,
      explanation: q.explanation,
    });

    return { explanation };
  }
}
