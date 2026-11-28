import { Router } from 'express';
import { FacultyStudentExamController } from '../controllers/FacultyStudentExamController';
import { FacultyStudentOnboardingController } from '../controllers/FacultyStudentOnboardingController';
import { requireFacultyStudent, requireRefreshableFacultyStudent } from '../middlewares/facultyStudentAuth.middleware';
import {
  authLimiter,
  otpSendLimiter,
  otpVerifyLimiter,
  emailOtpSendLimiter,
  emailOtpVerifyLimiter,
} from '../middlewares/rateLimiter.middleware';

/** Mounts `/api/v1/faculty-student/*` routes for students enrolled under an institute faculty. */
export function createFacultyStudentRoutes(
  controller = new FacultyStudentExamController(),
  onboardingController = new FacultyStudentOnboardingController(),
): Router {
  const router = Router();
  const guard = requireFacultyStudent();

  router.post('/login', authLimiter, controller.login);
  router.post('/logout', controller.logout);
  router.post('/refresh', requireRefreshableFacultyStudent(), controller.refresh);
  router.get('/me', guard, controller.me);

  // Onboarding: confirm the institute-held email and mobile before the portal opens.
  router.post('/onboarding/email/send', guard, emailOtpSendLimiter, onboardingController.sendEmailOtp);
  router.post('/onboarding/email/verify', guard, emailOtpVerifyLimiter, onboardingController.verifyEmailOtp);
  router.post('/onboarding/mobile/send', guard, otpSendLimiter, onboardingController.sendMobileOtp);
  router.post('/onboarding/mobile/verify', guard, otpVerifyLimiter, onboardingController.verifyMobileOtp);
  router.post('/onboarding/complete', guard, onboardingController.complete);

  router.get('/exams', guard, controller.listExams);
  router.post('/exams/:id/start', guard, controller.startExam);
  router.post('/exams/:id/save', guard, controller.saveAnswers);
  router.post('/exams/:id/submit', guard, controller.submitExam);
  router.get('/exams/:id/result', guard, controller.getExamResult);

  return router;
}
