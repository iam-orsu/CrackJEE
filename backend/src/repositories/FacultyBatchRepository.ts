import { database } from '../config/database';

export class FacultyBatchRepository {
  public async create(data: {
    facultyId: string;
    name: string;
    code: string;
    description?: string;
  }) {
    return database.client.facultyBatch.create({
      data: {
        facultyId: data.facultyId,
        name: data.name.trim(),
        code: data.code.trim().toUpperCase(),
        description: data.description?.trim(),
      },
    });
  }

  public async listByFaculty(facultyId: string) {
    return database.client.facultyBatch.findMany({
      where: { facultyId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            students: true,
            assignments: true,
          },
        },
      },
    });
  }

  public async findById(id: string, facultyId: string) {
    return database.client.facultyBatch.findFirst({
      where: { id, facultyId },
      include: {
        _count: {
          select: {
            students: true,
            assignments: true,
          },
        },
      },
    });
  }

  public async findByCode(facultyId: string, code: string) {
    return database.client.facultyBatch.findUnique({
      where: {
        facultyId_code: {
          facultyId,
          code: code.trim().toUpperCase(),
        },
      },
    });
  }

  public async update(
    id: string,
    facultyId: string,
    data: { name?: string; code?: string; description?: string | null },
  ) {
    return database.client.facultyBatch.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name.trim() } : {}),
        ...(data.code !== undefined ? { code: data.code.trim().toUpperCase() } : {}),
        ...(data.description !== undefined ? { description: data.description?.trim() || null } : {}),
      },
    });
  }

  public async delete(id: string, facultyId: string) {
    return database.client.facultyBatch.deleteMany({
      where: { id, facultyId },
    });
  }
}
