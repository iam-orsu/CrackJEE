import { QuestionRepository } from '../repositories/QuestionRepository';
import { AttemptRepository } from '../repositories/AttemptRepository';
import { MockExamRepository } from '../repositories/MockExamRepository';
import { CacheService, cacheService as defaultCache } from './CacheService';
import { GradingService, gradingService as defaultGrading } from './GradingService';
import { AppError } from '../utils/AppError';

const SERVED_KINDS = ['practice', 'mcq_single', 'mcq_multi', 'integer'] as const;

export class AnswerService {
  constructor(
    private readonly questions: QuestionRepository = new QuestionRepository(),
    private readonly attempts: AttemptRepository = new AttemptRepository(),
    private readonly mocks: MockExamRepository = new MockExamRepository(),
    private readonly cache: CacheService = defaultCache,
    private readonly grading: GradingService = defaultGrading,
  ) {}

  private async wasServedToUser(
    userId: string,
    questionId: string,
    subject: string,
    topic: string,
  ): Promise<boolean> {
    for (const kind of SERVED_KINDS) {
      const ids = await this.cache.getJson<string[]>(`served:${userId}:${subject}:${topic}:${kind}`);
      if (ids?.includes(questionId)) return true;
    }
    return this.mocks.hasQuestionForUser(userId, questionId);
  }

  public async submitPracticeAnswer(params: {
    userId: string;
    questionId: string;
    answer: string;
    timeSpent: number;
  }): Promise<{ isCorrect: boolean; correctAnswer: string; explanation: string }> {
    const { userId, questionId, answer, timeSpent } = params;

    const question = await this.questions.findById(questionId);
    if (!question) throw new AppError(404, 'Question not found');

    if (!(await this.wasServedToUser(userId, question.id, question.subject, question.topic))) {
      throw new AppError(403, 'This question is not part of your session. Open it from practice, a paper or a mock first.');
    }

    if (await this.mocks.isQuestionInActiveMock(userId, questionId)) {
      throw new AppError(403, 'Cannot submit answers for questions in an active mock exam');
    }

    const lockKey = `answer-lock:${userId}:${questionId}`;
    if (!(await this.cache.setNx(lockKey, 10))) {
      throw new AppError(409, 'This answer is already being submitted. Please wait a moment.');
    }

    if (question.questionType === 'integer') {
      const intVal = parseInt(answer, 10);
      const maxVal = question.examType === 'Advanced' ? 9 : 99;
      if (isNaN(intVal) || intVal < 0 || intVal > maxVal) {
        await this.cache.del(lockKey);
        throw new AppError(400, `Integer answer must be between 0 and ${maxVal}`);
      }
    }

    const isCorrect = this.grading.checkAnswer(
      question.questionType ?? 'mcq_single',
      answer,
      question.answer,
    );

    try {
      await this.attempts.recordPracticeAttempt({
        userId,
        questionId,
        topic: question.topic,
        subject: question.subject,
        answerSubmitted: answer,
        isCorrect,
        timeSpent,
      });
    } catch (err) {
      await this.cache.del(lockKey);
      throw err;
    }

    return {
      isCorrect,
      correctAnswer: question.answer,
      explanation: question.explanation,
    };
  }
}
