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

  /**
   * Finds submitted psychometric exam sessions that are queued for DeepSeek AI evaluation.
   */
  public async findPendingPsychometricExams(limit = 10) {
    try {
      const rows = await database.client.$queryRaw<Array<{ id: string }>>`
        SELECT id FROM FacultyStudentExam
        WHERE status = 'submitted'
          AND JSON_UNQUOTE(JSON_EXTRACT(resultBreakdown, '$.aiStatus')) = 'pending'
        ORDER BY submittedAt ASC
        LIMIT ${limit}
      `;
      if (!rows || rows.length === 0) return [];

      const ids = rows.map((r) => r.id);
      return database.client.facultyStudentExam.findMany({
        where: { id: { in: ids } },
        include: {
          assignment: {
            include: {
              paper: true,
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
    } catch {
      const submissions = await database.client.facultyStudentExam.findMany({
        where: {
          status: 'submitted',
          assignment: {
            paper: {
              examType: 'Psychometric',
            },
          },
        },
        include: {
          assignment: {
            include: {
              paper: true,
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
        orderBy: { submittedAt: 'asc' },
        take: limit * 5,
      });

      return submissions
        .filter((s) => {
          const breakdown = s.resultBreakdown as Record<string, unknown> | null;
          return breakdown?.aiStatus === 'pending';
        })
        .slice(0, limit);
    }
  }

  /**
   * Atomically transitions an exam's AI evaluation status from 'pending' to 'processing'.
   * Returns true if successfully claimed, or false if already claimed by another worker.
   */
  public async claimPendingPsychometricExam(id: string): Promise<boolean> {
    try {
      const count = await database.client.$executeRaw`
        UPDATE FacultyStudentExam
        SET resultBreakdown = JSON_SET(COALESCE(resultBreakdown, '{}'), '$.aiStatus', 'processing', '$.aiProcessingStartedAt', NOW())
        WHERE id = ${id}
          AND JSON_UNQUOTE(JSON_EXTRACT(resultBreakdown, '$.aiStatus')) = 'pending'
      `;
      return count > 0;
    } catch {
      const existing = await database.client.facultyStudentExam.findUnique({
        where: { id },
        select: { resultBreakdown: true },
      });
      const breakdown = (existing?.resultBreakdown as Record<string, unknown>) || {};
      if (breakdown.aiStatus !== 'pending') return false;

      await database.client.facultyStudentExam.update({
        where: { id },
        data: {
          resultBreakdown: {
            ...breakdown,
            aiStatus: 'processing',
            aiProcessingStartedAt: new Date().toISOString(),
          },
        },
      });
      return true;
    }
  }

  /**
   * Completes the AI evaluation with the live DeepSeek report and updates totalScore.
   */
  public async completeAiEvaluation(id: string, liveReport: any): Promise<void> {
    const existing = await database.client.facultyStudentExam.findUnique({
      where: { id },
      select: { resultBreakdown: true },
    });
    if (!existing) return;

    const breakdown = (existing.resultBreakdown as Record<string, unknown>) || {};
    const updatedBreakdown = {
      ...breakdown,
      psychometricReport: liveReport,
      aiStatus: 'completed',
      aiProcessedAt: new Date().toISOString(),
    };

    await database.client.facultyStudentExam.update({
      where: { id },
      data: {
        totalScore: liveReport.alignmentScore,
        resultBreakdown: updatedBreakdown,
      },
    });
  }

  /**
   * Marks a job failed or requeues it for retry after backoff.
   */
  public async markEvaluationFailedOrRetry(id: string, errMessage: string): Promise<void> {
    const existing = await database.client.facultyStudentExam.findUnique({
      where: { id },
      select: { resultBreakdown: true },
    });
    if (!existing) return;

    const breakdown = (existing.resultBreakdown as Record<string, unknown>) || {};
    const retryCount = ((breakdown.aiRetryCount as number) || 0) + 1;
    const aiStatus = retryCount >= 3 ? 'completed' : 'pending';

    await database.client.facultyStudentExam.update({
      where: { id },
      data: {
        resultBreakdown: {
          ...breakdown,
          aiStatus,
          aiError: errMessage,
          aiRetryCount: retryCount,
        },
      },
    });
  }

  /**
   * Sweeps and resets stale processing jobs (e.g. after a crash or PM2 restart) back to 'pending'.
   */
  public async recoverStuckPsychometricJobs(staleMinutes = 3): Promise<number> {
    const cutoff = new Date(Date.now() - staleMinutes * 60 * 1000);
    try {
      return await database.client.$executeRaw`
        UPDATE FacultyStudentExam
        SET resultBreakdown = JSON_SET(resultBreakdown, '$.aiStatus', 'pending')
        WHERE status = 'submitted'
          AND JSON_UNQUOTE(JSON_EXTRACT(resultBreakdown, '$.aiStatus')) = 'processing'
          AND updatedAt < ${cutoff}
      `;
    } catch {
      const stuck = await database.client.facultyStudentExam.findMany({
        where: {
          status: 'submitted',
          updatedAt: { lt: cutoff },
        },
        select: { id: true, resultBreakdown: true },
      });
      let count = 0;
      for (const item of stuck) {
        const b = item.resultBreakdown as Record<string, unknown> | null;
        if (b?.aiStatus === 'processing') {
          await database.client.facultyStudentExam.update({
            where: { id: item.id },
            data: {
              resultBreakdown: {
                ...b,
                aiStatus: 'pending',
              },
            },
          });
          count++;
        }
      }
      return count;
    }
  }
}
