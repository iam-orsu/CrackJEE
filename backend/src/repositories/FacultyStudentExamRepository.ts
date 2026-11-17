import { database } from '../config/database';

export class FacultyStudentExamRepository {
  public async findOrCreate(assignmentId: string, studentId: string) {
    const existing = await database.client.facultyStudentExam.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId,
        },
      },
      include: {
        assignment: {
          include: {
            paper: true,
            batch: true,
          },
        },
      },
    });

    if (existing) {
      return existing;
    }

    try {
      return await database.client.facultyStudentExam.create({
        data: {
          assignmentId,
          studentId,
          status: 'in_progress',
          startedAt: new Date(),
          answers: {},
        },
        include: {
          assignment: {
            include: {
              paper: true,
              batch: true,
            },
          },
        },
      });
    } catch (err: unknown) {
      // Handle concurrent P2002 race condition gracefully
      if ((err as { code?: string })?.code === 'P2002') {
        const raceWinner = await database.client.facultyStudentExam.findUnique({
          where: {
            assignmentId_studentId: {
              assignmentId,
              studentId,
            },
          },
          include: {
            assignment: {
              include: {
                paper: true,
                batch: true,
              },
            },
          },
        });
        if (raceWinner) return raceWinner;
      }
      throw err;
    }
  }

  public async findById(id: string) {
    return database.client.facultyStudentExam.findUnique({
      where: { id },
      include: {
        assignment: {
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
        },
        student: {
          select: {
            id: true,
            name: true,
            rollNumber: true,
            batchId: true,
          },
        },
      },
    });
  }

  public async findByAssignmentAndStudent(assignmentId: string, studentId: string) {
    return database.client.facultyStudentExam.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId,
        },
      },
      include: {
        assignment: {
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
        },
        student: {
          select: {
            id: true,
            name: true,
            rollNumber: true,
          },
        },
      },
    });
  }

  public async listForStudent(studentId: string) {
    return database.client.facultyStudentExam.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
      include: {
        assignment: {
          include: {
            paper: {
              select: {
                id: true,
                title: true,
                examType: true,
                questionCount: true,
                difficulty: true,
              },
            },
            batch: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  public async saveAnswers(id: string, answers: any, timeTakenSeconds: number) {
    return database.client.facultyStudentExam.update({
      where: { id },
      data: {
        answers,
        timeTakenSeconds,
        status: 'in_progress',
      },
    });
  }

  public async submit(
    id: string,
    data: {
      status: string;
      submittedAt: Date;
      timeTakenSeconds: number;
      totalScore: number;
      maxScore: number;
      correctCount: number;
      partialCount?: number;
      incorrectCount: number;
      unattemptedCount: number;
      answers: any;
      resultBreakdown: any;
    },
  ) {
    const res = await database.client.facultyStudentExam.updateMany({
      where: {
        id,
        status: { not: 'submitted' },
      },
      data: {
        status: data.status,
        submittedAt: data.submittedAt,
        timeTakenSeconds: data.timeTakenSeconds,
        totalScore: data.totalScore,
        maxScore: data.maxScore,
        correctCount: data.correctCount,
        partialCount: data.partialCount ?? 0,
        incorrectCount: data.incorrectCount,
        unattemptedCount: data.unattemptedCount,
        answers: data.answers,
        resultBreakdown: data.resultBreakdown,
      },
    });
    return res.count > 0;
  }

  public async countStudentsScoredHigher(assignmentId: string, score: number) {
    return database.client.facultyStudentExam.count({
      where: {
        assignmentId,
        status: 'submitted',
        totalScore: { gt: score },
      },
    });
  }

  public async countBatchSubmissions(assignmentId: string) {
    return database.client.facultyStudentExam.count({
      where: {
        assignmentId,
        status: 'submitted',
      },
    });
  }

  public async getBatchResults(assignmentId: string) {
    return database.client.facultyStudentExam.findMany({
      where: {
        assignmentId,
        status: 'submitted',
      },
      orderBy: [{ totalScore: 'desc' }, { timeTakenSeconds: 'asc' }],
      include: {
        student: {
          select: {
            id: true,
            name: true,
            rollNumber: true,
          },
        },
      },
    });
  }
}
