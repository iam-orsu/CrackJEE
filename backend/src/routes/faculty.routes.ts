import { Router } from 'express';
import { FacultyController } from '../controllers/FacultyController';
import { requireFaculty } from '../middlewares/facultyAuth.middleware';

/**
 * Mounts `/api/v1/faculty/*` mentor portal routes, isolated from student & admin auth.
 * Sign-in happens through Google OAuth (`/api/v1/google/*`), so there is no password route here.
 */
export function createFacultyRoutes(controller = new FacultyController()): Router {
  const router = Router();
  const guard = requireFaculty();

  router.post('/logout', controller.logout);
  router.get('/me', guard, controller.me);
  router.get('/topics', guard, controller.getTopics);

  router.get('/papers', guard, controller.listPapers);
  router.post('/papers', guard, controller.createPaper);
  router.get('/papers/:id', guard, controller.getPaper);
  router.get('/papers/:id/pdf', guard, controller.downloadPaperPdf);
  router.get('/papers/:id/excel', guard, controller.downloadPaperExcel);
  router.post('/papers/:id/draft-question', guard, controller.generateDraftQuestion);
  router.post('/papers/:id/questions/accept', guard, controller.acceptDraftQuestion);
  router.post('/papers/:id/questions/:number/accept', guard, controller.acceptDraftQuestion);
  router.patch('/papers/:id/questions/:number', guard, controller.updateQuestion);
  router.post('/papers/:id/questions/:number/regenerate', guard, controller.regenerateQuestion);
  router.delete('/papers/:id/questions/:number', guard, controller.deleteQuestion);
  router.delete('/papers/:id', guard, controller.deletePaper);

  // Batches
  router.get('/batches', guard, controller.listBatches);
  router.post('/batches', guard, controller.createBatch);
  router.patch('/batches/:id', guard, controller.updateBatch);
  router.delete('/batches/:id', guard, controller.deleteBatch);

  // Students
  router.get('/students', guard, controller.listStudents);
  router.post('/students', guard, controller.createStudent);
  router.post('/students/bulk', guard, controller.bulkCreateStudents);
  router.patch('/students/:id', guard, controller.updateStudent);
  router.post('/students/:id/reset-password', guard, controller.resetStudentPassword);
  router.delete('/students/:id', guard, controller.deleteStudent);

  // Assignments & Reports
  router.get('/assignments', guard, controller.listAssignments);
  router.post('/assignments', guard, controller.createAssignment);
  router.delete('/assignments/:id', guard, controller.deleteAssignment);
  router.get('/assignments/:id/report', guard, controller.getAssignmentReport);
  router.get('/assignments/:id/csv', guard, controller.downloadAssignmentResultsCsv);
  router.get('/assignments/:id/submissions/:studentId', guard, controller.getStudentSubmission);

  return router;
}
