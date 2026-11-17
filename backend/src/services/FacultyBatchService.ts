import bcrypt from 'bcrypt';
import { AUTH_CONSTANTS } from '../config/constants';
import { FacultyBatchRepository } from '../repositories/FacultyBatchRepository';
import { FacultyStudentRepository } from '../repositories/FacultyStudentRepository';
import { AppError } from '../utils/AppError';

export class FacultyBatchService {
  constructor(
    private readonly batchRepo: FacultyBatchRepository = new FacultyBatchRepository(),
    private readonly studentRepo: FacultyStudentRepository = new FacultyStudentRepository(),
  ) {}

  public async createBatch(facultyId: string, input: { name: string; code: string; description?: string }) {
    const code = input.code.trim().toUpperCase();
    const existing = await this.batchRepo.findByCode(facultyId, code);
    if (existing) {
      throw new AppError(409, `A batch with code "${code}" already exists in your institute.`);
    }

    return this.batchRepo.create({
      facultyId,
      name: input.name,
      code,
      description: input.description,
    });
  }

  public async listBatches(facultyId: string) {
    return this.batchRepo.listByFaculty(facultyId);
  }

  public async deleteBatch(id: string, facultyId: string) {
    const batch = await this.batchRepo.findById(id, facultyId);
    if (!batch) {
      throw new AppError(404, 'Batch not found');
    }
    await this.batchRepo.delete(id, facultyId);
    return { success: true };
  }

  public async createStudent(
    facultyId: string,
    input: {
      batchId: string;
      name: string;
      rollNumber: string;
      email?: string;
      password?: string;
    },
  ) {
    const batch = await this.batchRepo.findById(input.batchId, facultyId);
    if (!batch) {
      throw new AppError(404, 'Selected batch does not exist');
    }

    const rollNumber = input.rollNumber.trim().toUpperCase();
    const existingRoll = await this.studentRepo.findByRollNumber(facultyId, rollNumber);
    if (existingRoll) {
      throw new AppError(409, `Student with Roll Number "${rollNumber}" already exists in your institute.`);
    }

    // Default password to roll number if not provided
    const plainPassword = input.password?.trim() || rollNumber;
    const passwordHash = await bcrypt.hash(plainPassword, AUTH_CONSTANTS.BCRYPT_ROUNDS);

    const student = await this.studentRepo.create({
      facultyId,
      batchId: input.batchId,
      name: input.name,
      rollNumber,
      email: input.email,
      passwordHash,
    });

    return {
      student,
      initialPassword: plainPassword,
    };
  }

  public async listStudents(facultyId: string, batchId?: string) {
    return this.studentRepo.listByFaculty(facultyId, batchId);
  }

  public async deleteStudent(id: string, facultyId: string) {
    const student = await this.studentRepo.findById(id, facultyId);
    if (!student) {
      throw new AppError(404, 'Student not found');
    }
    await this.studentRepo.delete(id, facultyId);
    return { success: true };
  }
}
