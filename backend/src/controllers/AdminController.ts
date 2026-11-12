import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AdminService } from '../services/AdminService';
import { setAdminCookie, clearAdminCookie } from '../middlewares/adminAuth.middleware';
import { AppError } from '../utils/AppError';

const loginSchema = z.object({
  email: z.string().min(1).max(200),
  password: z.string().min(1).max(200),
});

export class AdminController {
  constructor(private readonly adminService: AdminService = new AdminService()) {}

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
}
