import { database } from '../config/database';

export class FacultyAssignmentRepository {
  public async create(data: {
    facultyId: string;
    paperId: string;
    batchId: string;
    title: string;
    instructions?: string;
    durationMinutes: number;
    startTime?: Date | null;
    endTime?: Date | null;
    showSolutions?: boolean;
    status?: string;
  }) {
    return database.client.facultyExamAssignment.create({
      data: {
        facultyId: data.facultyId,
        paperId: data.paperId,
        batchId: data.batchId,
        title: data.title.trim(),
        instructions: data.instructions?.trim(),
        durationMinutes: data.durationMinutes,
        startTime: data.startTime,
        endTime: data.endTime,
        showSolutions: data.showSolutions ?? true,
        status: data.status ?? 'active',
      },
      include: {
        paper: {
          select: {
            id: true,
            title: true,
            examType: true,
            difficulty: true,
            questionCount: true,
          },
        },
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

  public async listByFaculty(facultyId: string) {
    return database.client.facultyExamAssignment.findMany({
      where: { facultyId },
      orderBy: { createdAt: 'desc' },
      include: {
        paper: {
          select: {
            id: true,
            title: true,
            examType: true,
            difficulty: true,
            questionCount: true,
          },
        },
        batch: {
          select: {
            id: true,
            name: true,
            code: true,
            _count: {
              select: {
                students: true,
              },
            },
          },
        },
        _count: {
          select: {
            studentExams: true,
          },
        },
        studentExams: {
          select: {
            id: true,
            status: true,
            totalScore: true,
          },
        },
      },
    });
  }

  public async findById(id: string, facultyId: string) {
    return database.client.facultyExamAssignment.findFirst({
      where: { id, facultyId },
      include: {
        paper: true,
        batch: {
          include: {
            students: {
              select: {
                id: true,
                name: true,
                rollNumber: true,
              },
            },
          },
        },
        studentExams: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                rollNumber: true,
                email: true,
              },
            },
          },
          orderBy: { totalScore: 'desc' },
        },
      },
    });
  }

  public async findByIdGlobal(id: string) {
    return database.client.facultyExamAssignment.findUnique({
      where: { id },
      include: {
        paper: true,
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

  public async listForBatch(batchId: string) {
    return database.client.facultyExamAssignment.findMany({
      where: {
        batchId,
        status: { in: ['scheduled', 'active'] },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        paper: {
          select: {
            id: true,
            title: true,
            examType: true,
            difficulty: true,
            questionCount: true,
          },
        },
        faculty: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  public async delete(id: string, facultyId: string) {
    return database.client.facultyExamAssignment.deleteMany({
      where: { id, facultyId },
    });
  }
}
