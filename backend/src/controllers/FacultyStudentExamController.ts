import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import { FacultyStudentExamService } from '../services/FacultyStudentExamService';
import {
  clearFacultyStudentCookie,
  setFacultyStudentCookie,
  type FacultyStudentAuthRequest,
} from '../middlewares/facultyStudentAuth.middleware';
import { AppError } from '../utils/AppError';

const studentLoginSchema = z.object({
  identifier: z.string().trim().min(1, 'Roll Number or Email is required').max(200),
  password: z.string().min(1, 'Password is required').max(200),
  batchCode: z.string().trim().max(50).optional(),
});

const saveAnswersSchema = z.object({
  answers: z.record(z.string()),
  timeTakenSeconds: z.number().int().min(0),
});

const submitExamSchema = z.object({
  answers: z.record(z.string()),
  timeTakenSeconds: z.number().int().min(0),
});

export class FacultyStudentExamController {
  constructor(
    private readonly examService: FacultyStudentExamService = new FacultyStudentExamService(),
  ) {}

  public readonly login = async (
    req: FacultyStudentAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = studentLoginSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.issues[0]?.message ?? 'Invalid credentials');
      }

      const result = await this.examService.login(
        parsed.data.identifier,
        parsed.data.password,
        parsed.data.batchCode,
      );
      setFacultyStudentCookie(res, result.token);
      res.json({
        success: true,
        token: result.token,
        student: result.student,
        expiresAt: result.expiresAt,
      });
    } catch (err) {
      next(err);
    }
  };

  public readonly logout = (_req: FacultyStudentAuthRequest, res: Response): void => {
    clearFacultyStudentCookie(res);
    res.json({ success: true });
  };

  public readonly me = async (
    req: FacultyStudentAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const profile = await this.examService.getStudentProfile(req.facultyStudent!.studentId);
      res.json({ success: true, student: profile });
    } catch (err) {
      next(err);
    }
  };

  public readonly listExams = async (
    req: FacultyStudentAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const exams = await this.examService.listExamsForStudent(
        req.facultyStudent!.studentId,
        req.facultyStudent!.batchId,
      );
      res.json({ success: true, exams });
    } catch (err) {
      next(err);
    }
  };

  public readonly startExam = async (
    req: FacultyStudentAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const examData = await this.examService.startExam(
        String(req.params.id),
        req.facultyStudent!.studentId,
      );
      res.json({ success: true, ...examData });
    } catch (err) {
      next(err);
    }
  };

  public readonly saveAnswers = async (
    req: FacultyStudentAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = saveAnswersSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, 'Invalid answers payload');
      }
      const result = await this.examService.saveAnswers(
        String(req.params.id),
        req.facultyStudent!.studentId,
        parsed.data.answers,
        parsed.data.timeTakenSeconds,
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  public readonly submitExam = async (
    req: FacultyStudentAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = submitExamSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, 'Invalid submission payload');
      }
      const result = await this.examService.submitExam(
        String(req.params.id),
        req.facultyStudent!.studentId,
        parsed.data.answers,
        parsed.data.timeTakenSeconds,
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  public readonly getExamResult = async (
    req: FacultyStudentAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.examService.getExamResult(
        String(req.params.id),
        req.facultyStudent!.studentId,
      );
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  };
}
