import { database } from '../config/database';

export class FacultyStudentRepository {
  public async create(data: {
    facultyId: string;
    batchId: string;
    name: string;
    rollNumber: string;
    email?: string;
    passwordHash: string;
  }) {
    return database.client.facultyStudent.create({
      data: {
        facultyId: data.facultyId,
        batchId: data.batchId,
        name: data.name.trim(),
        rollNumber: data.rollNumber.trim().toUpperCase(),
        email: data.email?.trim().toLowerCase() || null,
        passwordHash: data.passwordHash,
      },
      include: {
        batch: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
  }

  public async listByFaculty(facultyId: string, batchId?: string) {
    return database.client.facultyStudent.findMany({
      where: {
        facultyId,
        ...(batchId ? { batchId } : {}),
      },
      orderBy: [{ batchId: 'asc' }, { rollNumber: 'asc' }],
      select: {
        id: true,
        facultyId: true,
        batchId: true,
        name: true,
        rollNumber: true,
        email: true,
        isActive: true,
        createdAt: true,
        batch: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        _count: {
          select: {
            examSessions: true,
          },
        },
      },
    });
  }

  public async findById(id: string, facultyId: string) {
    return database.client.facultyStudent.findFirst({
      where: { id, facultyId },
      include: {
        batch: true,
      },
    });
  }

  public async findByIdGlobal(id: string) {
    return database.client.facultyStudent.findUnique({
      where: { id },
      include: {
        batch: true,
        faculty: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  public async findByRollNumber(facultyId: string, rollNumber: string) {
    return database.client.facultyStudent.findUnique({
      where: {
        facultyId_rollNumber: {
          facultyId,
          rollNumber: rollNumber.trim().toUpperCase(),
        },
      },
    });
  }

  /**
   * Finds student by Roll Number or Email. If multiple match across different institutes,
   * returns all matching active records so the caller can handle institute disambiguation if needed.
   */
  public async findByCredentials(identifier: string) {
    const clean = identifier.trim();
    const cleanUpper = clean.toUpperCase();
    const cleanLower = clean.toLowerCase();

    return database.client.facultyStudent.findMany({
      where: {
        OR: [
          { rollNumber: cleanUpper },
          { email: cleanLower },
        ],
        isActive: true,
      },
      include: {
        batch: true,
        faculty: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  public async delete(id: string, facultyId: string) {
    return database.client.facultyStudent.deleteMany({
      where: { id, facultyId },
    });
  }
}
