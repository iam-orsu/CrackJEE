import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AUTH_CONSTANTS } from '../config/constants';
import { FacultyAssignmentRepository } from '../repositories/FacultyAssignmentRepository';
import { FacultyStudentExamRepository } from '../repositories/FacultyStudentExamRepository';
import { FacultyStudentRepository } from '../repositories/FacultyStudentRepository';
import { type FacultyPaperItem } from '../repositories/FacultyRepository';
import { scoringService } from './ScoringService';
import { gradingService } from './GradingService';
import { deepSeekPsychometricService } from './DeepSeekPsychometricService';
import { psychometricEvaluationWorker } from './PsychometricEvaluationWorker';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';

export class FacultyStudentExamService {
  constructor(
    private readonly studentRepo: FacultyStudentRepository = new FacultyStudentRepository(),
    private readonly assignmentRepo: FacultyAssignmentRepository = new FacultyAssignmentRepository(),
    private readonly examRepo: FacultyStudentExamRepository = new FacultyStudentExamRepository(),
  ) {}

  public async login(identifier: string, password: string, batchCode?: string) {
    let candidates = await this.studentRepo.findByCredentials(identifier);
    if (!candidates || candidates.length === 0) {
      throw new AppError(401, 'Invalid Roll Number / Email or password');
    }

    if (batchCode && batchCode.trim()) {
      const trimmedCode = batchCode.trim().toUpperCase();
      const filtered = candidates.filter((c) => c.batch.code.toUpperCase() === trimmedCode);
      if (filtered.length > 0) {
        candidates = filtered;
      }
    }

    let matchedStudent = null;
    for (const cand of candidates) {
      const match = await bcrypt.compare(password, cand.passwordHash);
      if (match) {
        matchedStudent = cand;
        break;
      }
    }

    if (!matchedStudent) {
      throw new AppError(401, 'Invalid Roll Number / Email or password');
    }

    if (!matchedStudent.isActive) {
      throw new AppError(403, 'Your student account is deactivated. Please contact your faculty.');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError(500, 'Server misconfiguration');

    const token = jwt.sign(
      {
        studentId: matchedStudent.id,
        facultyId: matchedStudent.facultyId,
        batchId: matchedStudent.batchId,
        role: 'faculty_student',
      },
      secret,
      { algorithm: 'HS256', expiresIn: `${AUTH_CONSTANTS.FACULTY_STUDENT_COOKIE_MAX_AGE_S}s` },
    );

    const expiresAt = new Date(
      Date.now() + AUTH_CONSTANTS.FACULTY_STUDENT_COOKIE_MAX_AGE_S * 1000,
    ).toISOString();

    return {
      token,
      expiresAt,
      student: {
        id: matchedStudent.id,
        name: matchedStudent.name,
        rollNumber: matchedStudent.rollNumber,
        email: matchedStudent.email,
        batch: {
          id: matchedStudent.batch.id,
          name: matchedStudent.batch.name,
          code: matchedStudent.batch.code,
        },
        institute: {
          id: matchedStudent.faculty.id,
          name: matchedStudent.faculty.name,
        },
      },
    };
  }

  public refreshSession(studentId: string, facultyId: string, batchId: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError(500, 'Server misconfiguration');

    const token = jwt.sign(
      {
        studentId,
        facultyId,
        batchId,
        role: 'faculty_student',
      },
      secret,
      { algorithm: 'HS256', expiresIn: `${AUTH_CONSTANTS.FACULTY_STUDENT_COOKIE_MAX_AGE_S}s` },
    );

    const expiresAt = new Date(
      Date.now() + AUTH_CONSTANTS.FACULTY_STUDENT_COOKIE_MAX_AGE_S * 1000,
    ).toISOString();

    return { token, expiresAt };
  }

  public async getStudentProfile(studentId: string) {
    const student = await this.studentRepo.findByIdGlobal(studentId);
    if (!student) {
      throw new AppError(404, 'Student not found');
    }
    return {
      id: student.id,
      name: student.name,
      rollNumber: student.rollNumber,
      email: student.email,
      batch: {
        id: student.batch.id,
        name: student.batch.name,
        code: student.batch.code,
      },
      institute: {
        id: student.faculty.id,
        name: student.faculty.name,
      },
    };
  }

  public async listExamsForStudent(studentId: string, batchId: string) {
    const assignments = await this.assignmentRepo.listForBatch(batchId);
    const studentExams = await this.examRepo.listForStudent(studentId);
    const examMap = new Map(studentExams.map((e) => [e.assignmentId, e]));

    const now = new Date();

    return assignments.map((a) => {
      const examSession = examMap.get(a.id);
      let sessionStatus = examSession ? examSession.status : 'not_started';

      const isUpcoming = a.startTime && new Date(a.startTime) > now;
      const isExpired = a.endTime && new Date(a.endTime) < now;

      return {
        id: a.id,
        title: a.title,
        instructions: (a.instructions || '').replace('<!--showGoal:true-->', '').trim() || null,
        durationMinutes: a.durationMinutes,
        startTime: a.startTime?.toISOString() ?? null,
        endTime: a.endTime?.toISOString() ?? null,
        showSolutions: a.showSolutions,
        paper: {
          id: a.paper.id,
          title: a.paper.title,
          examType: a.paper.examType,
          questionCount: a.paper.questionCount,
          difficulty: a.paper.difficulty,
        },
        facultyName: a.faculty.name,
        status: sessionStatus, // "not_started" | "in_progress" | "submitted"
        isUpcoming,
        isExpired,
        result:
          examSession && examSession.status === 'submitted'
            ? {
                totalScore: examSession.totalScore,
                maxScore: examSession.maxScore,
                correctCount: examSession.correctCount,
                incorrectCount: examSession.incorrectCount,
                unattemptedCount: examSession.unattemptedCount,
                submittedAt: examSession.submittedAt?.toISOString() ?? null,
              }
            : null,
      };
    });
  }

  public async startExam(assignmentId: string, studentId: string) {
    const assignment = await this.assignmentRepo.findByIdGlobal(assignmentId);
    if (!assignment) {
      throw new AppError(404, 'Exam assignment not found');
    }

    const student = await this.studentRepo.findByIdGlobal(studentId);
    if (!student || student.batchId !== assignment.batchId) {
      throw new AppError(403, 'This exam is not assigned to your batch');
    }

    const now = new Date();
    if (assignment.startTime && new Date(assignment.startTime) > now) {
      throw new AppError(400, 'This exam has not started yet');
    }
    if (assignment.endTime && new Date(assignment.endTime) < now) {
      throw new AppError(400, 'The window for taking this exam has closed');
    }

    const examSession = await this.examRepo.findOrCreate(assignmentId, studentId);
    if (examSession.status === 'submitted') {
      throw new AppError(400, 'You have already submitted this exam');
    }

    const rawItems = (assignment.paper.items as unknown as FacultyPaperItem[]) || [];

    // Strip out correctAnswer and explanation for exam delivery integrity
    const questions = rawItems.map((q) => ({
      number: q.number,
      subject: q.subject,
      topic: q.topic,
      difficulty: q.difficulty,
      questionType: q.questionType,
      questionText: q.questionText,
      options: q.options,
      diagram: q.diagram,
    }));

    return {
      examSessionId: examSession.id,
      assignmentId: assignment.id,
      title: assignment.title,
      instructions: (assignment.instructions || '').replace('<!--showGoal:true-->', '').trim() || null,
      durationMinutes: assignment.durationMinutes,
      examType: assignment.paper.examType,
      questionCount: assignment.paper.questionCount,
      questions,
      savedAnswers: (examSession.answers as Record<string, string>) || {},
      timeTakenSeconds: examSession.timeTakenSeconds || 0,
      startedAt: examSession.startedAt?.toISOString() ?? null,
    };
  }

  public async saveAnswers(
    assignmentId: string,
    studentId: string,
    answers: Record<string, string>,
    timeTakenSeconds: number,
  ) {
    const session = await this.examRepo.findByAssignmentAndStudent(assignmentId, studentId);
    if (!session) {
      throw new AppError(404, 'Exam session not found. Please start the exam first.');
    }
    if (session.status === 'submitted') {
      throw new AppError(400, 'Cannot save answers on an already submitted exam');
    }

    const assignment = await this.assignmentRepo.findByIdGlobal(assignmentId);
    if (assignment) {
      const graceSeconds = 120; // 2 min grace period for network latency
      const totalAllowed = (assignment.durationMinutes ?? 180) * 60 + graceSeconds;
      if (timeTakenSeconds > totalAllowed) {
        throw new AppError(400, 'Exam time limit exceeded. Please submit your exam.');
      }
      if (assignment.endTime && new Date() > new Date(new Date(assignment.endTime).getTime() + graceSeconds * 1000)) {
        throw new AppError(400, 'The exam window has ended. Please submit your exam.');
      }
    }

    await this.examRepo.saveAnswers(session.id, answers, timeTakenSeconds);
    return { success: true, savedAt: new Date().toISOString() };
  }

  public async submitExam(
    assignmentId: string,
    studentId: string,
    answers: Record<string, string>,
    timeTakenSeconds: number,
  ) {
    const session = await this.examRepo.findByAssignmentAndStudent(assignmentId, studentId);
    if (!session) {
      throw new AppError(404, 'Exam session not found');
    }
    if (session.status === 'submitted') {
      return {
        success: true,
        alreadySubmitted: true,
        totalScore: session.totalScore,
        maxScore: session.maxScore,
        correctCount: session.correctCount,
        partialCount: session.partialCount,
        incorrectCount: session.incorrectCount,
        unattemptedCount: session.unattemptedCount,
      };
    }

    const assignment = await this.assignmentRepo.findByIdGlobal(assignmentId);
    if (!assignment) {
      throw new AppError(404, 'Assignment not found');
    }

    const items = (assignment.paper.items as unknown as FacultyPaperItem[]) || [];
    const examType = assignment.paper.examType;

    // Psychometric assessments: 100% opinion and trait based - zero right/wrong scoring
    const isPsychometric = examType === 'Psychometric' || (items.length > 0 && items[0].subject === 'Psychometric');
    if (isPsychometric) {
      const professorGoal = this.extractPaperGoal(assignment.paper);
      const studentName = session.student?.name || 'Student';
      const attemptedCount = items.filter((item) => Boolean(answers[String(item.number)]?.trim())).length;
      const unattemptedCount = items.length - attemptedCount;

      // Generate instant baseline heuristic evaluation (< 2ms) as fallback
      let psychometricReport = deepSeekPsychometricService.generateInitialStudentEvaluation({
        goal: professorGoal,
        candidateName: studentName,
        items,
        answers,
        timeTakenSeconds,
      });
      let aiStatus: 'pending' | 'completed' = 'pending';

      // Attempt fast live AI evaluation with a 3.5s race timeout so student lands directly on completed results
      if (deepSeekPsychometricService.isAvailable()) {
        try {
          const aiPromise = deepSeekPsychometricService.callAiStudentEvaluation({
            goal: professorGoal,
            candidateName: studentName,
            items,
            answers,
            timeTakenSeconds,
          });
          const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3500));
          const maybeAiReport = await Promise.race([aiPromise, timeoutPromise]);
          if (maybeAiReport) {
            psychometricReport = maybeAiReport;
            aiStatus = 'completed';
          }
        } catch (err) {
          logger.warn({ err, sessionId: session.id }, 'Synchronous AI evaluation race failed, falling back to background worker');
        }
      }

      const itemResults: Record<
        number,
        { submitted: string | null; isCorrect: null; score: null; maxScore: null }
      > = {};

      for (const item of items) {
        itemResults[item.number] = {
          submitted: answers[String(item.number)]?.trim() || null,
          isCorrect: null,
          score: null,
          maxScore: null,
        };
      }

      const resultBreakdown = {
        itemResults,
        psychometricReport,
        attemptedCount,
        unattemptedCount,
        goal: professorGoal,
        aiStatus,
        queuedAt: new Date().toISOString(),
        ...(aiStatus === 'completed' ? { completedAt: new Date().toISOString() } : {}),
      };

      await this.examRepo.submit(session.id, {
        status: 'submitted',
        submittedAt: new Date(),
        timeTakenSeconds,
        totalScore: psychometricReport.alignmentScore,
        maxScore: 100,
        correctCount: 0,
        partialCount: 0,
        incorrectCount: 0,
        unattemptedCount,
        answers,
        resultBreakdown,
      });

      if (aiStatus === 'pending') {
        // Wake background worker immediately to process without polling delay
        psychometricEvaluationWorker.notify();
      }

      return {
        success: true,
        totalScore: psychometricReport.alignmentScore,
        maxScore: 100,
        correctCount: 0,
        partialCount: 0,
        incorrectCount: 0,
        unattemptedCount,
        psychometricReport,
        aiStatus,
      };
    }

    let totalScore = 0;
    let maxScore = 0;
    let correctCount = 0;
    let partialCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    const subjectBreakdown: Record<
      string,
      { total: number; attempted: number; correct: number; incorrect: number; score: number; maxScore: number }
    > = {};

    const itemResults: Record<
      number,
      { submitted: string | null; isCorrect: boolean; score: number; maxScore: number }
    > = {};

    for (const item of items) {
      const qNum = item.number;
      const submitted = answers[String(qNum)]?.trim() || null;
      const maxMark = scoringService.getMaxMarkPerQuestion(examType, item.questionType);
      const score = scoringService.scoreQuestion(examType, item.questionType, submitted, item.correctAnswer);
      const isCorrect = submitted ? gradingService.checkAnswer(item.questionType, submitted, item.correctAnswer) : false;

      maxScore += maxMark;
      totalScore += score;

      if (!submitted) {
        unattemptedCount++;
      } else if (isCorrect) {
        correctCount++;
      } else if (score > 0 && score < maxMark) {
        partialCount++;
      } else {
        incorrectCount++;
      }

      if (!subjectBreakdown[item.subject]) {
        subjectBreakdown[item.subject] = {
          total: 0,
          attempted: 0,
          correct: 0,
          incorrect: 0,
          score: 0,
          maxScore: 0,
        };
      }

      const sb = subjectBreakdown[item.subject]!;
      sb.total++;
      sb.maxScore += maxMark;
      sb.score += score;
      if (submitted) {
        sb.attempted++;
        if (isCorrect) sb.correct++;
        else sb.incorrect++;
      }

      itemResults[qNum] = {
        submitted,
        isCorrect,
        score,
        maxScore: maxMark,
      };
    }

    const totalAttempted = correctCount + incorrectCount + partialCount;
    const resultBreakdown = {
      subjectBreakdown,
      itemResults,
      accuracyPct: totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0,
    };

    const updated = await this.examRepo.submit(session.id, {
      status: 'submitted',
      submittedAt: new Date(),
      timeTakenSeconds,
      totalScore: Math.round(totalScore * 10) / 10,
      maxScore,
      correctCount,
      partialCount,
      incorrectCount,
      unattemptedCount,
      answers,
      resultBreakdown,
    });

    if (!updated) {
      const freshSession = await this.examRepo.findById(session.id);
      return {
        success: true,
        alreadySubmitted: true,
        totalScore: freshSession?.totalScore ?? totalScore,
        maxScore: freshSession?.maxScore ?? maxScore,
        correctCount: freshSession?.correctCount ?? correctCount,
        partialCount: freshSession?.partialCount ?? partialCount,
        incorrectCount: freshSession?.incorrectCount ?? incorrectCount,
        unattemptedCount: freshSession?.unattemptedCount ?? unattemptedCount,
      };
    }

    return {
      success: true,
      totalScore: Math.round(totalScore * 10) / 10,
      maxScore,
      correctCount,
      partialCount,
      incorrectCount,
      unattemptedCount,
      accuracyPct: resultBreakdown.accuracyPct,
    };
  }

  public async getExamResult(assignmentId: string, studentId: string) {
    const session = await this.examRepo.findByAssignmentAndStudent(assignmentId, studentId);
    if (!session || session.status !== 'submitted') {
      throw new AppError(404, 'Result not found or exam not submitted yet');
    }

    const assignment = await this.assignmentRepo.findByIdGlobal(assignmentId);
    if (!assignment) {
      throw new AppError(404, 'Assignment not found');
    }

    // High performance O(1) rank lookup using indexed composite count query
    const [higherCount, totalCandidates] = await Promise.all([
      typeof this.examRepo.countStudentsScoredHigher === 'function'
        ? this.examRepo.countStudentsScoredHigher(assignmentId, session.totalScore)
        : this.examRepo.getBatchResults(assignmentId).then((all) => all.filter((s: any) => s.totalScore > session.totalScore).length),
      typeof this.examRepo.countBatchSubmissions === 'function'
        ? this.examRepo.countBatchSubmissions(assignmentId)
        : this.examRepo.getBatchResults(assignmentId).then((all) => all.length),
    ]);
    const rank = higherCount + 1;

    const items = (assignment.paper.items as unknown as FacultyPaperItem[]) || [];
    const submittedAnswers = (session.answers as Record<string, string>) || {};

    const isPsychometric = assignment.paper.examType === 'Psychometric' || (items.length > 0 && items[0].subject === 'Psychometric');
    if (isPsychometric) {
      const professorGoal = this.extractPaperGoal(assignment.paper);
      const rawBreakdown = (session.resultBreakdown as Record<string, unknown>) || {};
      let psychometricReport = (rawBreakdown.psychometricReport as any) || null;

      if (!psychometricReport) {
        psychometricReport = deepSeekPsychometricService.generateInitialStudentEvaluation({
          goal: professorGoal,
          candidateName: session.student?.name || 'Student',
          items,
          answers: submittedAnswers,
          timeTakenSeconds: session.timeTakenSeconds,
        });
      }

      const attemptedCount = items.filter((q) => Boolean(submittedAnswers[String(q.number)]?.trim())).length;
      const unattemptedCount = items.length - attemptedCount;

      const solutions = items.map((q) => {
        const studentAns = submittedAnswers[String(q.number)] || null;
        return {
          number: q.number,
          subject: q.subject,
          topic: q.topic,
          difficulty: q.difficulty,
          questionType: q.questionType,
          questionText: q.questionText,
          options: q.options,
          diagram: q.diagram,
          studentAnswer: studentAns,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          isCorrect: null,
          score: null,
          maxScore: null,
        };
      });

      const showGoal = Boolean(assignment.instructions?.includes('<!--showGoal:true-->'));

      return {
        assignment: {
          id: assignment.id,
          title: assignment.title,
          examType: 'Psychometric',
          showSolutions: assignment.showSolutions,
          batchName: assignment.batch.name,
          facultyName: assignment.faculty.name,
          examGoal: showGoal ? professorGoal : null,
          showGoalToStudents: showGoal,
        },
        scorecard: {
          rank,
          totalCandidates,
          totalScore: (session.totalScore as number) || psychometricReport.alignmentScore,
          maxScore: 100,
          correctCount: 0,
          partialCount: 0,
          incorrectCount: 0,
          attemptedCount,
          unattemptedCount,
          timeTakenSeconds: session.timeTakenSeconds,
          submittedAt: session.submittedAt?.toISOString() ?? null,
          resultBreakdown: rawBreakdown,
          psychometricReport,
          aiStatus: (rawBreakdown.aiStatus as string) || 'completed',
        },
        solutions,
      };
    }

    let solutions = null;
    let sanitizedBreakdown = session.resultBreakdown as Record<string, unknown> | null;

    if (assignment.showSolutions) {
      solutions = items.map((q) => {
        const studentAns = submittedAnswers[String(q.number)] || null;
        const isCorrect = studentAns ? gradingService.checkAnswer(q.questionType, studentAns, q.correctAnswer) : false;
        const score = scoringService.scoreQuestion(
          assignment.paper.examType,
          q.questionType,
          studentAns,
          q.correctAnswer,
        );

        return {
          number: q.number,
          subject: q.subject,
          topic: q.topic,
          difficulty: q.difficulty,
          questionType: q.questionType,
          questionText: q.questionText,
          options: q.options,
          diagram: q.diagram,
          studentAnswer: studentAns,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          isCorrect,
          score,
          maxScore: scoringService.getMaxMarkPerQuestion(assignment.paper.examType, q.questionType),
        };
      });
    } else if (sanitizedBreakdown && typeof sanitizedBreakdown === 'object') {
      // Strip isCorrect and score details so answers are not leaked before faculty permits
      const rawItems = (sanitizedBreakdown as Record<string, unknown>).itemResults;
      if (rawItems && typeof rawItems === 'object') {
        const sanitizedItems: Record<string, { submitted: string | null }> = {};
        for (const [key, val] of Object.entries(rawItems as Record<string, unknown>)) {
          sanitizedItems[key] = {
            submitted: ((val as Record<string, unknown>)?.submitted as string | null) ?? null,
          };
        }
        sanitizedBreakdown = {
          ...sanitizedBreakdown,
          itemResults: sanitizedItems,
        };
      }
    }

    return {
      assignment: {
        id: assignment.id,
        title: assignment.title,
        examType: assignment.paper.examType,
        showSolutions: assignment.showSolutions,
        batchName: assignment.batch.name,
        facultyName: assignment.faculty.name,
      },
      scorecard: {
        rank,
        totalCandidates,
        totalScore: session.totalScore,
        maxScore: session.maxScore,
        correctCount: session.correctCount,
        partialCount: session.partialCount,
        incorrectCount: session.incorrectCount,
        unattemptedCount: session.unattemptedCount,
        timeTakenSeconds: session.timeTakenSeconds,
        submittedAt: session.submittedAt?.toISOString() ?? null,
        resultBreakdown: sanitizedBreakdown,
      },
      solutions,
    };
  }

  private extractPaperGoal(paper: { title: string; selections: unknown }): string {
    if (Array.isArray(paper.selections) && paper.selections.length > 0) {
      const first = paper.selections[0] as Record<string, unknown>;
      if (first && typeof first.examGoal === 'string' && first.examGoal.trim()) {
        return first.examGoal.trim();
      }
    }
    return paper.title || 'Assess student general aptitude, entrepreneurial mindset, and technical problem-solving attitude';
  }
}
