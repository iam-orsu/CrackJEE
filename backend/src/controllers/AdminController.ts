import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AdminService } from '../services/AdminService';
import { FacultyAuthService } from '../services/FacultyAuthService';
import { setAdminCookie, clearAdminCookie } from '../middlewares/adminAuth.middleware';
import { AppError } from '../utils/AppError';

const loginSchema = z.object({
  email: z.string().min(1).max(200),
  password: z.string().min(1).max(200),
});

const createFacultySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  password: z.string().min(8).max(200),
});

const updateFacultySchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8).max(200).optional(),
}).refine((v) => v.name !== undefined || v.isActive !== undefined || v.password !== undefined, {
  message: 'Provide at least one field to update',
});

export class AdminController {
  constructor(
    private readonly adminService: AdminService = new AdminService(),
    private readonly facultyAuth: FacultyAuthService = new FacultyAuthService(),
  ) {}

  public readonly login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = loginSchema.safeParse(req.body);
      if (!body.success) throw new AppError(400, 'Invalid credentials');

      const { token, expiresAt } = await this.adminService.login(body.data.email, body.data.password);
      setAdminCookie(res, token);
      res.json({ success: true, data: { expiresAt } });
    } catch (err) {
      next(err);
    }
  };

  public readonly logout = (_req: Request, res: Response): void => {
    clearAdminCookie(res);
    res.json({ success: true });
  };

  public readonly stats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.adminService.getStats();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly studentDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const data = await this.adminService.getStudentDetail(id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly mockDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { examId } = req.params as { examId: string };
      const data = await this.adminService.getMockDetail(examId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly listFaculty = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.facultyAuth.listAccounts();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly createFaculty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = createFacultySchema.safeParse(req.body);
      if (!body.success) throw new AppError(400, body.error.errors[0]?.message ?? 'Invalid faculty account input');

      const data = await this.facultyAuth.createAccount(body.data);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly updateFaculty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      if (!/^[a-zA-Z0-9_-]{8,64}$/.test(id)) throw new AppError(400, 'Invalid faculty ID');

      const body = updateFacultySchema.safeParse(req.body);
      if (!body.success) throw new AppError(400, body.error.errors[0]?.message ?? 'Invalid update payload');

      const data = await this.facultyAuth.updateAccount(id, body.data);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };
}
