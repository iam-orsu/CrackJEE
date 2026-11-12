import { Router } from 'express';
import { FacultyController } from '../controllers/FacultyController';
import { requireFaculty } from '../middlewares/facultyAuth.middleware';
import { authLimiter } from '../middlewares/rateLimiter.middleware';

/** Mounts `/api/v1/faculty/*` mentor portal routes, isolated from student & admin auth. */
export function createFacultyRoutes(controller = new FacultyController()): Router {
  const router = Router();
  const guard = requireFaculty();

  router.post('/login', authLimiter, controller.login);
  router.post('/logout', controller.logout);
  router.get('/me', guard, controller.me);
  router.get('/topics', guard, controller.getTopics);

  router.get('/papers', guard, controller.listPapers);
  router.post('/papers', guard, controller.createPaper);
  router.get('/papers/:id', guard, controller.getPaper);
  router.post('/papers/:id/draft-question', guard, controller.generateDraftQuestion);
  router.post('/papers/:id/questions/accept', guard, controller.acceptDraftQuestion);
  router.post('/papers/:id/questions/:number/accept', guard, controller.acceptDraftQuestion);
  router.patch('/papers/:id/questions/:number', guard, controller.updateQuestion);
  router.post('/papers/:id/questions/:number/regenerate', guard, controller.regenerateQuestion);
  router.delete('/papers/:id/questions/:number', guard, controller.deleteQuestion);
  router.delete('/papers/:id', guard, controller.deletePaper);

  return router;
}
