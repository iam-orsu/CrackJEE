import type { Response, NextFunction } from 'express';
import { ProgressService } from '../services/ProgressService';
import type { AuthRequest } from '../types/index';

export class ProgressController {
  constructor(private readonly progressService: ProgressService = new ProgressService()) {}

  public readonly dashboard = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.progressService.getDashboard(req.user!.userId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly weakAreas = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.progressService.getWeakAreas(req.user!.userId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly overview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.progressService.getOverview(req.user!.userId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly mockWeakAreas = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.progressService.getMockWeakAreas(req.user!.userId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly leaderboard = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.progressService.getLeaderboard(req.user!.userId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  public readonly mockInsights = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.progressService.getMockInsights(req.user!.userId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };
}
