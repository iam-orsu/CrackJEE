import { Router } from 'express';
import { createAuthRoutes } from './auth.routes';
import { createQuestionRoutes } from './question.routes';
import { createAnswerRoutes } from './answer.routes';
import { createMockRoutes } from './mock.routes';
import { createAdminRoutes } from './admin.routes';
import { createProgressRoutes } from './progress.routes';

/** Mounts all `/api/v1/*` domain routers onto a single parent router. */
export function createApiV1Router(): Router {
  const router = Router();

  router.use('/auth', createAuthRoutes());
  router.use('/questions', createQuestionRoutes());
  router.use('/answers', createAnswerRoutes());
  router.use('/mock', createMockRoutes());
  router.use('/admin', createAdminRoutes());
  router.use('/', createProgressRoutes());

  return router;
}
