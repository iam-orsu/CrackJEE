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
  password: z.string().min(8).max(200).optional(),
});

const updateFacultySchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8).max(200).optional(),
}).refine((v) => v.name !== undefined || v.isActive !== undefined || v.password !== undefined, {
  message: 'Provide at least one field to update',
});

const planSchema = z.object({
  name: z.string().trim().min(1).max(60),
  tagline: z.string().trim().max(120).nullable().optional(),
  pricePaise: z.number().int().min(0),
  originalPricePaise: z.number().int().min(0).nullable().optional(),
  durationDays: z.number().int().min(0).nullable().optional(),
  examLimit: z.number().int().min(0).nullable().optional(),
  features: z.array(z.string().trim().min(1).max(140)).max(20),
  badge: z.string().trim().max(40).nullable().optional(),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

const updatePlanSchema = planSchema.partial().refine((v) => Object.keys(v).length > 0, {
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

  public readonly listPlans = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.adminService.listPlans();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly createPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = planSchema.safeParse(req.body);
      if (!body.success) throw new AppError(400, body.error.errors[0]?.message ?? 'Invalid plan input');

      const data = await this.adminService.createPlan(body.data);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly updatePlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const body = updatePlanSchema.safeParse(req.body);
      if (!body.success) throw new AppError(400, body.error.errors[0]?.message ?? 'Invalid plan update payload');

      const data = await this.adminService.updatePlan(id, body.data);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly deletePlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      await this.adminService.deletePlan(id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  };

  public readonly listPayments = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.adminService.listPayments();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };
}
