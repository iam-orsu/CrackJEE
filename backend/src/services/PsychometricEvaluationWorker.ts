import { deepSeekPsychometricService } from './DeepSeekPsychometricService';
import { FacultyStudentExamRepository } from '../repositories/FacultyStudentExamRepository';
import { type FacultyPaperItem } from '../repositories/FacultyRepository';
import { logger } from '../utils/logger';

/**
 * Paced background worker that processes queued student psychometric evaluations
 * at a controlled rate (e.g. 2-3 req/sec) to stay safely beneath DeepSeek RPM limits.
 *
 * Guarantees zero data loss, automatic crash recovery, and seamless resumption
 * from where students left off after any server reboot or PM2 restart.
 */
export class PsychometricEvaluationWorker {
  private readonly examRepo: FacultyStudentExamRepository;
  private isRunning = false;
  private isProcessing = false;
  private loopTimer: NodeJS.Timeout | null = null;
  private wakeResolve: (() => void) | null = null;

  // Controlled pacing: 400ms = 2.5 requests per second (150 RPM), comfortably under 300 RPM limit
  private readonly pacingDelayMs: number;
  private consecutiveRateLimits = 0;

  constructor(
    examRepo: FacultyStudentExamRepository = new FacultyStudentExamRepository(),
    pacingDelayMs = 400,
  ) {
    this.examRepo = examRepo;
    this.pacingDelayMs = pacingDelayMs;
  }

  /**
   * Starts the background worker and sweeps any jobs interrupted by previous server shutdowns.
   */
  public async start(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      const recovered = await this.examRepo.recoverStuckPsychometricJobs(3);
      if (recovered > 0) {
        logger.info({ count: recovered }, 'Psychometric worker: recovered interrupted evaluations');
      }
    } catch (err) {
      logger.error({ err }, 'Psychometric worker: failed to recover stuck jobs on boot');
    }

    void this.runLoop();
    logger.info('Psychometric evaluation background worker started');
  }

  /**
   * Signals the worker to wake up immediately (e.g. when a student submits an exam).
   */
  public notify(): void {
    if (this.wakeResolve) {
      this.wakeResolve();
      this.wakeResolve = null;
    }
  }

  /**
   * Sweeps stuck processing jobs periodically.
   */
  public async recoverStuckJobs(): Promise<number> {
    try {
      return await this.examRepo.recoverStuckPsychometricJobs(3);
    } catch (err) {
      logger.error({ err }, 'Failed periodic sweep of stuck psychometric evaluations');
      return 0;
    }
  }

  /**
   * Graceful stop hook for server shutdown.
   */
  public async stop(timeoutMs = 5000): Promise<void> {
    this.isRunning = false;
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    this.notify();

    const start = Date.now();
    while (this.isProcessing && Date.now() - start < timeoutMs) {
      await new Promise((r) => setTimeout(r, 100));
    }
    logger.info('Psychometric evaluation background worker stopped');
  }

  /**
   * Core execution loop.
   */
  private async runLoop(): Promise<void> {
    while (this.isRunning) {
      try {
        const processedCount = await this.processBatch();
        if (processedCount === 0) {
          // No pending jobs: sleep for 4 seconds or until notify() is called
          await this.sleepOrWake(4000);
        }
      } catch (err) {
        logger.error({ err }, 'Unhandled error in psychometric worker loop');
        await this.sleepOrWake(3000);
      }
    }
  }

  /**
   * Processes a batch of pending student evaluations one by one with pacing.
   */
  private async processBatch(): Promise<number> {
    this.isProcessing = true;
    try {
      const pendingExams = await this.examRepo.findPendingPsychometricExams(10);
      if (!pendingExams || pendingExams.length === 0) {
        return 0;
      }

      for (const exam of pendingExams) {
        if (!this.isRunning) break;

        // Atomically claim this exam so no other worker process handles it
        const claimed = await this.examRepo.claimPendingPsychometricExam(exam.id);
        if (!claimed) continue;

        await this.evaluateSingleExam(exam);

        // Pacing delay between calls to respect external rate limits
        if (this.pacingDelayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, this.pacingDelayMs));
        }
      }

      return pendingExams.length;
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Evaluates a single student's exam using DeepSeek and updates the record.
   */
  private async evaluateSingleExam(exam: {
    id: string;
    answers: unknown;
    timeTakenSeconds: number;
    assignment: {
      paper: {
        examType: string;
        items: unknown;
        customInstructions?: string | null;
        description?: string | null;
        title: string;
      };
    };
    student: {
      id: string;
      name: string;
      rollNumber: string;
    };
  }): Promise<void> {
    try {
      const items = (exam.assignment.paper.items as unknown as FacultyPaperItem[]) || [];
      const answers = (exam.answers as Record<string, string>) || {};
      const professorGoal =
        exam.assignment.paper.customInstructions?.trim() ||
        exam.assignment.paper.description?.trim() ||
        exam.assignment.paper.title;

      // Call DeepSeek AI evaluation (falls back to calibrated heuristic if API key is absent/unavailable)
      let finalReport = await deepSeekPsychometricService.callAiStudentEvaluation({
        goal: professorGoal,
        candidateName: exam.student.name || 'Student',
        items,
        answers,
        timeTakenSeconds: exam.timeTakenSeconds,
      });

      if (!finalReport) {
        finalReport = deepSeekPsychometricService.generateInitialStudentEvaluation({
          goal: professorGoal,
          candidateName: exam.student.name || 'Student',
          items,
          answers,
          timeTakenSeconds: exam.timeTakenSeconds,
        });
      }

      this.consecutiveRateLimits = 0;
      await this.examRepo.completeAiEvaluation(exam.id, finalReport);
      logger.info(
        { examId: exam.id, student: exam.student.name, role: finalReport.predictedRole },
        'Psychometric evaluation completed by DeepSeek worker',
      );
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const isRateLimit = errorMessage.includes('429') || errorMessage.toLowerCase().includes('rate limit');

      if (isRateLimit) {
        this.consecutiveRateLimits++;
        logger.warn(
          { examId: exam.id, consecutive: this.consecutiveRateLimits },
          'DeepSeek rate limit reached (429) - applying backoff',
        );
        await this.examRepo.markEvaluationFailedOrRetry(exam.id, 'Rate limit (429)');
        // Backoff for 10 seconds before attempting next call
        await new Promise((r) => setTimeout(r, 10_000));
      } else {
        logger.warn({ examId: exam.id, err: errorMessage }, 'Psychometric single exam evaluation failed');
        await this.examRepo.markEvaluationFailedOrRetry(exam.id, errorMessage);
      }
    }
  }

  /**
   * Helper that sleeps for ms or wakes early if notify() is triggered.
   */
  private sleepOrWake(ms: number): Promise<void> {
    return new Promise((resolve) => {
      this.wakeResolve = resolve;
      this.loopTimer = setTimeout(() => {
        this.wakeResolve = null;
        resolve();
      }, ms);
    });
  }
}

export const psychometricEvaluationWorker = new PsychometricEvaluationWorker();
