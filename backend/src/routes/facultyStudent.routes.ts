import { Router } from 'express';
import { FacultyStudentExamController } from '../controllers/FacultyStudentExamController';
import { requireFacultyStudent } from '../middlewares/facultyStudentAuth.middleware';
import { authLimiter } from '../middlewares/rateLimiter.middleware';

/** Mounts `/api/v1/faculty-student/*` routes for students enrolled under an institute faculty. */
export function createFacultyStudentRoutes(controller = new FacultyStudentExamController()): Router {
  const router = Router();
  const guard = requireFacultyStudent();

  router.post('/login', authLimiter, controller.login);
  router.post('/logout', controller.logout);
  router.get('/me', guard, controller.me);

  router.get('/exams', guard, controller.listExams);
  router.post('/exams/:id/start', guard, controller.startExam);
  router.post('/exams/:id/save', guard, controller.saveAnswers);
  router.post('/exams/:id/submit', guard, controller.submitExam);
  router.get('/exams/:id/result', guard, controller.getExamResult);

  return router;
}
