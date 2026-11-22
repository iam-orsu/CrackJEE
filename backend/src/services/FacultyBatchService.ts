import bcrypt from 'bcrypt';
import { AUTH_CONSTANTS } from '../config/constants';
import { FacultyBatchRepository } from '../repositories/FacultyBatchRepository';
import { FacultyStudentRepository } from '../repositories/FacultyStudentRepository';
import { AppError } from '../utils/AppError';

function cleanCsvField(val?: string | null): string {
  if (!val) return '';
  let str = val.trim();
  const hyperlinkMatch = str.match(/^=HYPERLINK\s*\(\s*["']([^"']+)["']\s*(?:,\s*["']([^"']+)["'])?\s*\)/i);
  if (hyperlinkMatch) {
    str = (hyperlinkMatch[2] || hyperlinkMatch[1] || '').trim();
  }
  if (/^mailto:/i.test(str)) {
    str = str.replace(/^mailto:/i, '').trim();
  }
  return str.replace(/^["']|["']$/g, '').trim();
}

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

  public async updateBatch(
    id: string,
    facultyId: string,
    input: { name?: string; code?: string; description?: string | null },
  ) {
    const batch = await this.batchRepo.findById(id, facultyId);
    if (!batch) {
      throw new AppError(404, 'Batch not found');
    }

    if (input.code) {
      const code = input.code.trim().toUpperCase();
      if (code !== batch.code) {
        const existing = await this.batchRepo.findByCode(facultyId, code);
        if (existing && existing.id !== id) {
          throw new AppError(409, `A batch with code "${code}" already exists in your institute.`);
        }
      }
    }

    return this.batchRepo.update(id, facultyId, input);
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

    const rollNumber = cleanCsvField(input.rollNumber).toUpperCase();
    const existingRoll = await this.studentRepo.findByRollNumber(facultyId, rollNumber);
    if (existingRoll) {
      throw new AppError(409, `Student with Roll Number "${rollNumber}" already exists in your institute.`);
    }

    // Default password to roll number if not provided
    const cleanPassword = cleanCsvField(input.password);
    const plainPassword = cleanPassword || rollNumber;
    const passwordHash = await bcrypt.hash(plainPassword, AUTH_CONSTANTS.BCRYPT_ROUNDS);

    const student = await this.studentRepo.create({
      facultyId,
      batchId: input.batchId,
      name: cleanCsvField(input.name),
      rollNumber,
      email: cleanCsvField(input.email) || undefined,
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
        const rawName = cleanCsvField(s.name);
        const rawRoll = cleanCsvField(s.rollNumber);
        const rawBatchCode = cleanCsvField(s.batchCode);
        const rawBatchName = cleanCsvField(s.batchName);
        const rawEmail = cleanCsvField(s.email);
        const rawPassword = cleanCsvField(s.password);

        if (!rawName || !rawRoll) {
          errors.push({ row: rowNum, rollNumber: rawRoll, name: rawName, error: 'Name and Roll Number are required' });
          continue;
        }

        // Determine target batch
        let targetBatchId = s.batchId;
        if (!targetBatchId && rawBatchCode) {
          targetBatchId = batchMapByCode.get(rawBatchCode.toUpperCase().trim());
        }
        if (!targetBatchId && rawBatchName) {
          targetBatchId = batchMapByName.get(rawBatchName.toLowerCase().trim());
        }
        if (!targetBatchId) {
          targetBatchId = defaultBatchId;
        }

        if (!targetBatchId || !batchMapById.has(targetBatchId)) {
          errors.push({
            row: rowNum,
            rollNumber: rawRoll,
            name: rawName,
            error: `Target batch "${rawBatchCode || rawBatchName || 'unspecified'}" not found`,
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

        const plainPassword = rawPassword || rollNumber;
        const passwordHash = await bcrypt.hash(plainPassword, AUTH_CONSTANTS.BCRYPT_ROUNDS);

        const newStudent = await this.studentRepo.create({
          facultyId,
          batchId: targetBatchId,
          name: rawName,
          rollNumber,
          email: rawEmail || undefined,
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

  public async updateStudent(
    id: string,
    facultyId: string,
    input: {
      name?: string;
      email?: string | null;
      rollNumber?: string;
      batchId?: string;
    },
  ) {
    const student = await this.studentRepo.findById(id, facultyId);
    if (!student) {
      throw new AppError(404, 'Student not found');
    }

    if (input.batchId && input.batchId !== student.batchId) {
      const batch = await this.batchRepo.findById(input.batchId, facultyId);
      if (!batch) {
        throw new AppError(404, 'Selected batch does not exist');
      }
    }

    if (input.rollNumber) {
      const rollNumber = input.rollNumber.trim().toUpperCase();
      if (rollNumber !== student.rollNumber) {
        const existingRoll = await this.studentRepo.findByRollNumber(facultyId, rollNumber);
        if (existingRoll && existingRoll.id !== id) {
          throw new AppError(409, `Student with Roll Number "${rollNumber}" already exists in your institute.`);
        }
      }
    }

    return this.studentRepo.update(id, facultyId, input);
  }

  public async resetStudentPassword(
    id: string,
    facultyId: string,
    newPassword?: string,
  ) {
    const student = await this.studentRepo.findById(id, facultyId);
    if (!student) {
      throw new AppError(404, 'Student not found');
    }

    const plainPassword = newPassword?.trim() || student.rollNumber;
    const passwordHash = await bcrypt.hash(plainPassword, AUTH_CONSTANTS.BCRYPT_ROUNDS);

    await this.studentRepo.updatePassword(id, facultyId, passwordHash);

    return {
      success: true,
      studentId: student.id,
      rollNumber: student.rollNumber,
      newPassword: plainPassword,
    };
  }

  public async resetBatchPasswords(
    batchId: string,
    facultyId: string,
    newPassword: string,
  ) {
    const batch = await this.batchRepo.findById(batchId, facultyId);
    if (!batch) {
      throw new AppError(404, 'Batch not found');
    }

    const plainPassword = (newPassword || '').trim();
    if (plainPassword.length < 4) {
      throw new AppError(400, 'Password must be at least 4 characters long');
    }

    const passwordHash = await bcrypt.hash(plainPassword, AUTH_CONSTANTS.BCRYPT_ROUNDS);
    const result = await this.studentRepo.updatePasswordForBatch(batchId, facultyId, passwordHash);

    return {
      success: true,
      batchId: batch.id,
      batchName: batch.name,
      batchCode: batch.code,
      updatedCount: result.count,
      newPassword: plainPassword,
    };
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
