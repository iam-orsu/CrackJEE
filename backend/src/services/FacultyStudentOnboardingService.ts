import { OtpService } from './OtpService';
import { FacultyStudentRepository } from '../repositories/FacultyStudentRepository';
import { normalizeMobile } from '../utils/mobile';
import { AppError } from '../utils/AppError';

/** OTP subjects are keyed per student so a code issued to one student can never verify another. */
export const studentEmailSubject = (studentId: string): string => `fs-email:${studentId}`;
export const studentMobileSubject = (studentId: string): string => `fs-mobile:${studentId}`;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Runs the student-portal onboarding: a faculty-created student confirms the email
 * and mobile the institute holds for them before the exam portal opens.
 */
export class FacultyStudentOnboardingService {
  constructor(
    private readonly studentRepo: FacultyStudentRepository = new FacultyStudentRepository(),
    private readonly otpService: OtpService = new OtpService(),
  ) {}

  private async loadStudent(studentId: string) {
    const student = await this.studentRepo.findByIdGlobal(studentId);
    if (!student) throw new AppError(404, 'Student not found');
    return student;
  }

  public async sendEmailOtp(studentId: string, emailInput?: string) {
    const student = await this.loadStudent(studentId);
    const email = (emailInput?.trim() || student.email || '').toLowerCase();
    if (!EMAIL_RE.test(email)) {
      throw new AppError(400, 'Enter a valid email address');
    }

    // A freshly typed address is unverified until the code comes back.
    if (email !== (student.email?.toLowerCase() ?? '')) {
      await this.studentRepo.updateVerification(studentId, { email, emailVerified: false });
    }

    const { expiresIn, cooldownSeconds } = await this.otpService.requestEmailOtp(
      studentEmailSubject(studentId),
      email,
    );
    return { email, expiresIn, cooldownSeconds };
  }

  public async verifyEmailOtp(studentId: string, emailInput: string, otp: string) {
    const email = emailInput.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) throw new AppError(400, 'Enter a valid email address');

    await this.otpService.verifyOtp(studentEmailSubject(studentId), email, otp, 'email address');
    await this.studentRepo.updateVerification(studentId, { email, emailVerified: true });
    return { emailVerified: true, email };
  }

  public async sendMobileOtp(studentId: string, mobileInput: string) {
    const student = await this.loadStudent(studentId);
    const mobile = normalizeMobile(mobileInput);
    if (!mobile) throw new AppError(400, 'Enter a valid 10-digit mobile number.');

    await this.assertMobileAvailable(student.facultyId, studentId, mobile);

    const { expiresIn, cooldownSeconds } = await this.otpService.requestOtp(
      studentMobileSubject(studentId),
      mobile,
    );
    return { expiresIn, cooldownSeconds };
  }

  public async verifyMobileOtp(studentId: string, mobileInput: string, otp: string) {
    const student = await this.loadStudent(studentId);
    const mobile = normalizeMobile(mobileInput);
    if (!mobile) throw new AppError(400, 'Enter a valid 10-digit mobile number.');

    await this.otpService.verifyOtp(studentMobileSubject(studentId), mobile, otp);
    await this.assertMobileAvailable(student.facultyId, studentId, mobile);
    await this.studentRepo.updateVerification(studentId, { mobile, mobileVerified: true });
    return { mobileVerified: true, mobile };
  }

  private async assertMobileAvailable(facultyId: string, studentId: string, mobile: string): Promise<void> {
    const owner = await this.studentRepo.findByMobile(facultyId, mobile);
    if (owner && owner.id !== studentId) {
      throw new AppError(409, 'This mobile number is already linked to another student with this faculty.');
    }
  }

  public async complete(studentId: string) {
    const student = await this.loadStudent(studentId);
    if (!student.emailVerified || !student.mobileVerified) {
      throw new AppError(400, 'Verify your email and mobile number before continuing.');
    }
    await this.studentRepo.updateVerification(studentId, { isOnboarded: true });
    return { isOnboarded: true };
  }
}
