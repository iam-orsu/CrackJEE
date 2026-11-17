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

  public async bulkCreateStudents(
    facultyId: string,
    students: Array<{
      batchId?: string;
      batchCode?: string;
      batchName?: string;
      name: string;
      rollNumber: string;
      email?: string;
      password?: string;
    }>,
    defaultBatchId?: string,
  ) {
    const batches = await this.batchRepo.listByFaculty(facultyId);
    const batchMapById = new Map<string, string>();
    const batchMapByCode = new Map<string, string>();
    const batchMapByName = new Map<string, string>();

    for (const b of batches) {
      batchMapById.set(b.id, b.id);
      batchMapByCode.set(b.code.toUpperCase().trim(), b.id);
      batchMapByName.set(b.name.toLowerCase().trim(), b.id);
    }

    const created: any[] = [];
    const errors: Array<{ row: number; rollNumber?: string; name?: string; error: string }> = [];

    for (let i = 0; i < students.length; i++) {
      const s = students[i]!;
      const rowNum = i + 1;
      try {
        const rawName = s.name?.trim();
        const rawRoll = s.rollNumber?.trim();

        if (!rawName || !rawRoll) {
          errors.push({ row: rowNum, rollNumber: rawRoll, name: rawName, error: 'Name and Roll Number are required' });
          continue;
        }

        // Determine target batch
        let targetBatchId = s.batchId;
        if (!targetBatchId && s.batchCode) {
          targetBatchId = batchMapByCode.get(s.batchCode.toUpperCase().trim());
        }
        if (!targetBatchId && s.batchName) {
          targetBatchId = batchMapByName.get(s.batchName.toLowerCase().trim());
        }
        if (!targetBatchId) {
          targetBatchId = defaultBatchId;
        }

        if (!targetBatchId || !batchMapById.has(targetBatchId)) {
          errors.push({
            row: rowNum,
            rollNumber: rawRoll,
            name: rawName,
            error: `Target batch "${s.batchCode || s.batchName || 'unspecified'}" not found`,
          });
          continue;
        }

        const rollNumber = rawRoll.toUpperCase();
        const existingRoll = await this.studentRepo.findByRollNumber(facultyId, rollNumber);
        if (existingRoll) {
          errors.push({
            row: rowNum,
            rollNumber,
            name: rawName,
            error: `Roll Number "${rollNumber}" already exists in your institute`,
          });
          continue;
        }

        const plainPassword = s.password?.trim() || rollNumber;
        const passwordHash = await bcrypt.hash(plainPassword, AUTH_CONSTANTS.BCRYPT_ROUNDS);

        const newStudent = await this.studentRepo.create({
          facultyId,
          batchId: targetBatchId,
          name: rawName,
          rollNumber,
          email: s.email?.trim() || undefined,
          passwordHash,
        });

        created.push({
          id: newStudent.id,
          name: newStudent.name,
          rollNumber: newStudent.rollNumber,
          batchId: targetBatchId,
          email: newStudent.email,
        });
      } catch (err: any) {
        errors.push({
          row: rowNum,
          rollNumber: s.rollNumber,
          name: s.name,
          error: err.message || 'Failed to create student',
        });
      }
    }

    return {
      total: students.length,
      createdCount: created.length,
      errorCount: errors.length,
      created,
      errors,
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
