import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AUTH_CONSTANTS } from '../config/constants';
import { FacultyAssignmentRepository } from '../repositories/FacultyAssignmentRepository';
import { FacultyStudentExamRepository } from '../repositories/FacultyStudentExamRepository';
import { FacultyStudentRepository } from '../repositories/FacultyStudentRepository';
import { type FacultyPaperItem } from '../repositories/FacultyRepository';
import { scoringService } from './ScoringService';
import { gradingService } from './GradingService';
import { AppError } from '../utils/AppError';

export class FacultyStudentExamService {
  constructor(
    private readonly studentRepo: FacultyStudentRepository = new FacultyStudentRepository(),
    private readonly assignmentRepo: FacultyAssignmentRepository = new FacultyAssignmentRepository(),
    private readonly examRepo: FacultyStudentExamRepository = new FacultyStudentExamRepository(),
  ) {}

  public async login(identifier: string, password: string) {
    const candidates = await this.studentRepo.findByCredentials(identifier);
    if (!candidates || candidates.length === 0) {
      throw new AppError(401, 'Invalid Roll Number / Email or password');
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
        instructions: a.instructions,
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
      instructions: assignment.instructions,
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
      };
    }

    const assignment = await this.assignmentRepo.findByIdGlobal(assignmentId);
    if (!assignment) {
      throw new AppError(404, 'Assignment not found');
    }

    const items = (assignment.paper.items as unknown as FacultyPaperItem[]) || [];
    const examType = assignment.paper.examType;

    let totalScore = 0;
    let maxScore = 0;
    let correctCount = 0;
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

    const resultBreakdown = {
      subjectBreakdown,
      itemResults,
      accuracyPct: correctCount + incorrectCount > 0 ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) : 0,
    };

    await this.examRepo.submit(session.id, {
      status: 'submitted',
      submittedAt: new Date(),
      timeTakenSeconds,
      totalScore: Math.round(totalScore * 10) / 10,
      maxScore,
      correctCount,
      incorrectCount,
      unattemptedCount,
      answers,
      resultBreakdown,
    });

    return {
      success: true,
      totalScore: Math.round(totalScore * 10) / 10,
      maxScore,
      correctCount,
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

    // Compute student's rank within the batch
    const allBatchSubmissions = await this.examRepo.getBatchResults(assignmentId);
    let rank = 1;
    for (let i = 0; i < allBatchSubmissions.length; i++) {
      if (allBatchSubmissions[i]!.student.id === studentId) {
        rank = i + 1;
        break;
      }
    }

    const items = (assignment.paper.items as unknown as FacultyPaperItem[]) || [];
    const submittedAnswers = (session.answers as Record<string, string>) || {};

    let solutions = null;
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
        totalCandidates: allBatchSubmissions.length,
        totalScore: session.totalScore,
        maxScore: session.maxScore,
        correctCount: session.correctCount,
        incorrectCount: session.incorrectCount,
        unattemptedCount: session.unattemptedCount,
        timeTakenSeconds: session.timeTakenSeconds,
        submittedAt: session.submittedAt?.toISOString() ?? null,
        resultBreakdown: session.resultBreakdown,
      },
      solutions,
    };
  }
}
