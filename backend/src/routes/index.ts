import { Router } from 'express';
import { createAuthRoutes } from './auth.routes';
import { createQuestionRoutes } from './question.routes';
import { createAnswerRoutes } from './answer.routes';
import { createMockRoutes } from './mock.routes';
import { createAdminRoutes } from './admin.routes';
import { createFacultyRoutes } from './faculty.routes';
import { createFacultyStudentRoutes } from './facultyStudent.routes';
import { createProgressRoutes } from './progress.routes';
import { createPsychometricRoutes } from './psychometric.routes';

/** Mounts all `/api/v1/*` domain routers onto a single parent router. */
export function createApiV1Router(): Router {
  const router = Router();

  router.use('/auth', createAuthRoutes());
  router.use('/questions', createQuestionRoutes());
  router.use('/answers', createAnswerRoutes());
  router.use('/mock', createMockRoutes());
  router.use('/psychometric', createPsychometricRoutes());
  router.use('/admin', createAdminRoutes());
  router.use('/faculty', createFacultyRoutes());
  router.use('/faculty-student', createFacultyStudentRoutes());
  router.use('/', createProgressRoutes());

  return router;
}
