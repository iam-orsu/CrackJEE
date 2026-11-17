import { FacultyAssignmentRepository } from '../repositories/FacultyAssignmentRepository';
import { FacultyBatchRepository } from '../repositories/FacultyBatchRepository';
import { FacultyRepository, type FacultyPaperItem } from '../repositories/FacultyRepository';
import { AppError } from '../utils/AppError';

export class FacultyAssignmentService {
  constructor(
    private readonly assignmentRepo: FacultyAssignmentRepository = new FacultyAssignmentRepository(),
    private readonly batchRepo: FacultyBatchRepository = new FacultyBatchRepository(),
    private readonly facultyRepo: FacultyRepository = new FacultyRepository(),
  ) {}

  public async createAssignment(
    facultyId: string,
    input: {
      paperId: string;
      batchId: string;
      title: string;
      instructions?: string;
      durationMinutes: number;
      startTime?: string | null;
      endTime?: string | null;
      showSolutions?: boolean;
    },
  ) {
    const paper = await this.facultyRepo.findPaperById(input.paperId);
    if (!paper || paper.facultyId !== facultyId) {
      throw new AppError(404, 'Paper not found');
    }
    if (paper.status !== 'ready') {
      throw new AppError(400, 'Paper must be ready before assigning to a batch');
    }

    const batch = await this.batchRepo.findById(input.batchId, facultyId);
    if (!batch) {
      throw new AppError(404, 'Batch not found');
    }

    return this.assignmentRepo.create({
      facultyId,
      paperId: input.paperId,
      batchId: input.batchId,
      title: input.title,
      instructions: input.instructions,
      durationMinutes: input.durationMinutes || 180,
      startTime: input.startTime ? new Date(input.startTime) : null,
      endTime: input.endTime ? new Date(input.endTime) : null,
      showSolutions: input.showSolutions ?? true,
      status: 'active',
    });
  }

  public async listAssignments(facultyId: string) {
    const assignments = await this.assignmentRepo.listByFaculty(facultyId);
    return assignments.map((a) => {
      const totalEnrolled = a.batch._count.students;
      const submittedCount = a.studentExams.filter((e) => e.status === 'submitted').length;
      const inProgressCount = a.studentExams.filter((e) => e.status === 'in_progress').length;
      const scores = a.studentExams
        .filter((e) => e.status === 'submitted')
        .map((e) => e.totalScore);
      const avgScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;

      return {
        id: a.id,
        title: a.title,
        durationMinutes: a.durationMinutes,
        startTime: a.startTime?.toISOString() ?? null,
        endTime: a.endTime?.toISOString() ?? null,
        showSolutions: a.showSolutions,
        status: a.status,
        createdAt: a.createdAt.toISOString(),
        paper: a.paper,
        batch: {
          id: a.batch.id,
          name: a.batch.name,
          code: a.batch.code,
          totalStudents: totalEnrolled,
        },
        stats: {
          totalEnrolled,
          submittedCount,
          inProgressCount,
          avgScore: Math.round(avgScore * 10) / 10,
        },
      };
    });
  }

  public async deleteAssignment(id: string, facultyId: string) {
    const assignment = await this.assignmentRepo.findById(id, facultyId);
    if (!assignment) {
      throw new AppError(404, 'Assignment not found');
    }
    await this.assignmentRepo.delete(id, facultyId);
    return { success: true };
  }

  public async getAssignmentReport(assignmentId: string, facultyId: string) {
    const assignment = await this.assignmentRepo.findById(assignmentId, facultyId);
    if (!assignment) {
      throw new AppError(404, 'Assignment not found');
    }

    const items = (assignment.paper.items as unknown as FacultyPaperItem[]) || [];
    const submissions = assignment.studentExams.filter((e) => e.status === 'submitted');
    const totalEnrolled = assignment.batch.students.length;

    // Calculate rank list
    const rankList = submissions.map((s, idx) => ({
      rank: idx + 1,
      studentId: s.student.id,
      name: s.student.name,
      rollNumber: s.student.rollNumber,
      totalScore: s.totalScore,
      maxScore: s.maxScore,
      timeTakenSeconds: s.timeTakenSeconds,
      correctCount: s.correctCount,
      incorrectCount: s.incorrectCount,
      unattemptedCount: s.unattemptedCount,
      submittedAt: s.submittedAt?.toISOString() ?? null,
      resultBreakdown: s.resultBreakdown,
    }));

    const scores = submissions.map((s) => s.totalScore);
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
    const avgScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;

    // Item-level analytics
    const questionAnalytics = items.map((q) => {
      let correctCount = 0;
      let wrongCount = 0;
      let skippedCount = 0;

      for (const sub of submissions) {
        const studentAnswers = (sub.answers as Record<string, string>) || {};
        const ans = studentAnswers[String(q.number)];
        if (!ans || ans.trim() === '') {
          skippedCount++;
        } else if (ans.trim().toUpperCase() === q.correctAnswer.trim().toUpperCase()) {
          correctCount++;
        } else {
          wrongCount++;
        }
      }

      const totalAttempted = correctCount + wrongCount;
      const accuracyPct = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

      return {
        questionNumber: q.number,
        subject: q.subject,
        topic: q.topic,
        questionType: q.questionType,
        difficulty: q.difficulty || 'medium',
        correctCount,
        wrongCount,
        skippedCount,
        accuracyPct,
      };
    });

    return {
      assignment: {
        id: assignment.id,
        title: assignment.title,
        durationMinutes: assignment.durationMinutes,
        startTime: assignment.startTime?.toISOString() ?? null,
        endTime: assignment.endTime?.toISOString() ?? null,
        showSolutions: assignment.showSolutions,
        batch: {
          id: assignment.batch.id,
          name: assignment.batch.name,
          code: assignment.batch.code,
        },
        paper: {
          id: assignment.paper.id,
          title: assignment.paper.title,
          examType: assignment.paper.examType,
          questionCount: assignment.paper.questionCount,
        },
      },
      summary: {
        totalEnrolled,
        submittedCount: submissions.length,
        inProgressCount: assignment.studentExams.filter((e) => e.status === 'in_progress').length,
        highestScore: Math.round(highestScore * 10) / 10,
        lowestScore: Math.round(lowestScore * 10) / 10,
        avgScore: Math.round(avgScore * 10) / 10,
      },
      rankList,
      questionAnalytics,
    };
  }
}
