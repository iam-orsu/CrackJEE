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

    const examType = assignment.paper.examType;
    const isPsychometric = examType === 'Psychometric';
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
      maxScore: isPsychometric ? 100 : s.maxScore,
      timeTakenSeconds: s.timeTakenSeconds,
      correctCount: isPsychometric ? 0 : s.correctCount,
      incorrectCount: isPsychometric ? 0 : s.incorrectCount,
      unattemptedCount: s.unattemptedCount,
      submittedAt: s.submittedAt?.toISOString() ?? null,
      resultBreakdown: s.resultBreakdown,
    }));

    const scores = submissions.map((s) => s.totalScore);
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
    const avgScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;

    // Item-level analytics with option distribution
    const questionAnalytics = items.map((q) => {
      let correctCount = 0;
      let wrongCount = 0;
      let skippedCount = 0;
      const optionDistribution: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, other: 0, skipped: 0 };

      for (const sub of submissions) {
        const studentAnswers = (sub.answers as Record<string, string>) || {};
        const ans = (studentAnswers[String(q.number)] || '').trim().toUpperCase();
        if (!ans) {
          skippedCount++;
          optionDistribution.skipped++;
        } else {
          if (['A', 'B', 'C', 'D'].includes(ans)) {
            optionDistribution[ans] = (optionDistribution[ans] || 0) + 1;
          } else {
            optionDistribution.other = (optionDistribution.other || 0) + 1;
          }

          if (!isPsychometric) {
            if (ans === q.correctAnswer.trim().toUpperCase()) {
              correctCount++;
            } else {
              wrongCount++;
            }
          }
        }
      }

      const totalAttempted = isPsychometric
        ? submissions.length - skippedCount
        : correctCount + wrongCount;
      const accuracyPct = isPsychometric
        ? (submissions.length > 0 ? Math.round((totalAttempted / submissions.length) * 100) : 100)
        : (totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0);
      const totalStudents = submissions.length || 1;

      const optionPercentages = {
        A: Math.round(((optionDistribution.A || 0) / totalStudents) * 100),
        B: Math.round(((optionDistribution.B || 0) / totalStudents) * 100),
        C: Math.round(((optionDistribution.C || 0) / totalStudents) * 100),
        D: Math.round(((optionDistribution.D || 0) / totalStudents) * 100),
        other: Math.round(((optionDistribution.other || 0) / totalStudents) * 100),
        skipped: Math.round(((optionDistribution.skipped || 0) / totalStudents) * 100),
      };

      return {
        questionNumber: q.number,
        subject: q.subject,
        topic: q.topic,
        questionType: q.questionType,
        difficulty: q.difficulty || 'medium',
        questionText: q.questionText,
        options: q.options || [],
        correctAnswer: isPsychometric ? '' : q.correctAnswer,
        explanation: isPsychometric ? null : (q.explanation || null),
        correctCount,
        wrongCount,
        skippedCount,
        accuracyPct,
        optionDistribution,
        optionPercentages,
      };
    });

    // Topic-level analytics grouping
    const topicMap = new Map<
      string,
      {
        topic: string;
        subject: string;
        questionCount: number;
        questionNumbers: number[];
        totalAttempts: number;
        correctCount: number;
        wrongCount: number;
        skippedCount: number;
        questions: typeof questionAnalytics;
      }
    >();

    for (const qa of questionAnalytics) {
      const key = `${qa.subject}:::${qa.topic}`;
      let entry = topicMap.get(key);
      if (!entry) {
        entry = {
          topic: qa.topic,
          subject: qa.subject,
          questionCount: 0,
          questionNumbers: [],
          totalAttempts: 0,
          correctCount: 0,
          wrongCount: 0,
          skippedCount: 0,
          questions: [],
        };
        topicMap.set(key, entry);
      }
      entry.questionCount++;
      entry.questionNumbers.push(qa.questionNumber);
      entry.totalAttempts += qa.correctCount + qa.wrongCount;
      entry.correctCount += qa.correctCount;
      entry.wrongCount += qa.wrongCount;
      entry.skippedCount += qa.skippedCount;
      entry.questions.push(qa);
    }

    const topicAnalytics = Array.from(topicMap.values()).map((t) => {
      if (isPsychometric) {
        const attempted = submissions.length * t.questionCount - t.skippedCount;
        const totalPossible = (submissions.length || 1) * t.questionCount;
        const participationPct = totalPossible > 0 ? Math.round((attempted / totalPossible) * 100) : 100;
        return {
          ...t,
          accuracyPct: participationPct,
          marksLost: 0,
          negativeMarks: 0,
          isWeak: false,
          isStrong: false,
        };
      }
      const accuracyPct = t.totalAttempts > 0 ? Math.round((t.correctCount / t.totalAttempts) * 100) : 0;
      const marksLost = (t.wrongCount * 5) + (t.skippedCount * 4);
      const negativeMarks = t.wrongCount * 1;
      return {
        ...t,
        accuracyPct,
        marksLost,
        negativeMarks,
        isWeak: accuracyPct < 50,
        isStrong: accuracyPct >= 70,
      };
    });

    // Lacking and top performing topics
    const lackingTopics = topicAnalytics
      .filter((t) => t.isWeak && t.totalAttempts > 0)
      .sort((a, b) => b.marksLost - a.marksLost || a.accuracyPct - b.accuracyPct);

    const topPerformingTopics = topicAnalytics
      .filter((t) => t.isStrong && t.totalAttempts > 0)
      .sort((a, b) => b.accuracyPct - a.accuracyPct);

    // Actionable revision recommendations
    const recommendations: string[] = [];
    if (lackingTopics.length > 0) {
      for (const lt of lackingTopics.slice(0, 4)) {
        recommendations.push(
          `Re-teach ${lt.subject} — ${lt.topic}: Batch accuracy is ${lt.accuracyPct}%, with ${lt.wrongCount} mistakes causing ${lt.marksLost} marks lost across ${lt.questionCount} question${lt.questionCount > 1 ? 's' : ''}.`,
        );
      }
    } else if (submissions.length > 0) {
      recommendations.push('Overall batch performance is solid across all tested topics. Maintain periodic revision tests.');
    } else {
      recommendations.push('No submissions recorded yet for this exam.');
    }

    // Enhance rankList with individual student weak topics
    const enhancedRankList = rankList.map((st) => {
      const sub = submissions.find((s) => s.student.id === st.studentId);
      const studentAnswers = (sub?.answers as Record<string, string>) || {};
      const studentTopicMistakes: Record<string, number> = {};

      if (!isPsychometric) {
        for (const q of items) {
          const ans = (studentAnswers[String(q.number)] || '').trim().toUpperCase();
          if (ans && ans !== q.correctAnswer.trim().toUpperCase()) {
            studentTopicMistakes[q.topic] = (studentTopicMistakes[q.topic] || 0) + 1;
          }
        }
      }

      const personalWeakTopics = isPsychometric
        ? []
        : Object.entries(studentTopicMistakes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([topic, mistakes]) => ({ topic, mistakes }));

      return {
        ...st,
        personalWeakTopics,
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
      rankList: enhancedRankList,
      questionAnalytics,
      topicAnalytics,
      revisionRecommendations: {
        lackingTopics: lackingTopics.map((t) => ({
          topic: t.topic,
          subject: t.subject,
          accuracyPct: t.accuracyPct,
          questionCount: t.questionCount,
          wrongCount: t.wrongCount,
          marksLost: t.marksLost,
        })),
        topPerformingTopics: topPerformingTopics.map((t) => ({
          topic: t.topic,
          subject: t.subject,
          accuracyPct: t.accuracyPct,
          questionCount: t.questionCount,
          correctCount: t.correctCount,
        })),
        recommendations,
      },
    };
  }

  public async getStudentSubmission(assignmentId: string, studentId: string, facultyId: string) {
    const assignment = await this.assignmentRepo.findById(assignmentId, facultyId);
    if (!assignment) {
      throw new AppError(404, 'Assignment not found');
    }

    const exam = assignment.studentExams.find((e) => e.student.id === studentId);
    if (!exam) {
      throw new AppError(404, 'Student submission not found');
    }

    const examType = assignment.paper.examType;
    const isPsychometric = examType === 'Psychometric';
    const items = (assignment.paper.items as unknown as FacultyPaperItem[]) || [];
    const studentAnswers = (exam.answers as Record<string, string>) || {};

    const questions = items.map((q) => {
      const studentAnswer = (studentAnswers[String(q.number)] || '').trim();
      const isSkipped = !studentAnswer;
      const isCorrect = isPsychometric
        ? null
        : (!isSkipped && studentAnswer.toUpperCase() === q.correctAnswer.trim().toUpperCase());

      return {
        number: q.number,
        subject: q.subject,
        topic: q.topic,
        questionType: q.questionType,
        difficulty: q.difficulty || 'medium',
        questionText: q.questionText,
        options: q.options || [],
        correctAnswer: isPsychometric ? '' : q.correctAnswer,
        studentAnswer: isSkipped ? null : studentAnswer,
        isCorrect,
        isSkipped,
        marksAwarded: isPsychometric ? null : (isCorrect ? 4 : isSkipped ? 0 : -1),
        explanation: isPsychometric ? null : (q.explanation || null),
      };
    });

    return {
      assignment: {
        id: assignment.id,
        title: assignment.title,
        durationMinutes: assignment.durationMinutes,
        paperTitle: assignment.paper.title,
        examType: assignment.paper.examType,
      },
      student: {
        id: exam.student.id,
        name: exam.student.name,
        rollNumber: exam.student.rollNumber,
        email: exam.student.email,
        batchName: assignment.batch.name,
        batchCode: assignment.batch.code,
      },
      score: {
        totalScore: exam.totalScore,
        maxScore: isPsychometric ? 100 : exam.maxScore,
        correctCount: isPsychometric ? 0 : exam.correctCount,
        incorrectCount: isPsychometric ? 0 : exam.incorrectCount,
        unattemptedCount: exam.unattemptedCount,
        timeTakenSeconds: exam.timeTakenSeconds,
        submittedAt: exam.submittedAt?.toISOString() ?? null,
      },
      questions,
    };
  }

  public async exportAssignmentResultsCsv(
    assignmentId: string,
    facultyId: string,
  ): Promise<{ csv: string; filename: string }> {
    const assignment = await this.assignmentRepo.findById(assignmentId, facultyId);
    if (!assignment) {
      throw new AppError(404, 'Assignment not found');
    }

    const examType = assignment.paper.examType;
    const submissions = assignment.studentExams
      .filter((e) => e.status === 'submitted')
      .sort((a, b) => b.totalScore - a.totalScore);

    const escapeCsv = (val: unknown): string => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const lines: string[] = [];
    lines.push('\uFEFF'); // UTF-8 BOM
    lines.push(`Assignment:,${escapeCsv(assignment.title)}`);
    lines.push(`Batch:,${escapeCsv(assignment.batch.name)} (${escapeCsv(assignment.batch.code)})`);
    lines.push(`Exam Type:,${escapeCsv(examType)}`);
    lines.push(`Paper Title:,${escapeCsv(assignment.paper.title)}`);
    lines.push(`Total Submissions:,${escapeCsv(submissions.length)}`);
    lines.push(`Exported At:,${escapeCsv(new Date().toISOString())}`);
    lines.push('');

    const items = (assignment.paper.items as unknown as FacultyPaperItem[]) || [];

    const computeWeakTopicsOneLiner = (sub: any): string => {
      const studentAnswers = (sub?.answers as Record<string, string>) || {};
      const studentTopicMistakes: Record<string, number> = {};
      for (const q of items) {
        const ans = (studentAnswers[String(q.number)] || '').trim().toUpperCase();
        if (ans && ans !== q.correctAnswer.trim().toUpperCase()) {
          studentTopicMistakes[q.topic] = (studentTopicMistakes[q.topic] || 0) + 1;
        }
      }
      const top = Object.entries(studentTopicMistakes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([topic, count]) => `${topic} (${count} mistakes)`);
      return top.length > 0 ? top.join('; ') : 'None';
    };

    if (examType === 'Main') {
      lines.push(
        [
          'Rank',
          'Roll Number',
          'Student Name',
          'Total Score',
          'Max Marks',
          'Accuracy %',
          'Physics Score',
          'Chemistry Score',
          'Mathematics Score',
          'Correct',
          'Incorrect',
          'Unattempted',
          'Weak Topics',
          'Time Taken (mins)',
          'Submitted At',
        ]
          .map(escapeCsv)
          .join(','),
      );

      submissions.forEach((s, idx) => {
        const bd = (s.resultBreakdown as Record<string, any>) || {};
        const sb = bd.subjectBreakdown || {};
        const phy = sb['Physics']?.score ?? 0;
        const chem = sb['Chemistry']?.score ?? 0;
        const math = sb['Mathematics']?.score ?? 0;
        const accuracy = bd.accuracyPct ?? 0;
        const timeMins = Math.round(s.timeTakenSeconds / 60);
        const weakTopics = computeWeakTopicsOneLiner(s);

        lines.push(
          [
            idx + 1,
            s.student.rollNumber,
            s.student.name,
            s.totalScore,
            s.maxScore,
            `${accuracy}%`,
            phy,
            chem,
            math,
            s.correctCount,
            s.incorrectCount,
            s.unattemptedCount,
            weakTopics,
            timeMins,
            s.submittedAt ? s.submittedAt.toISOString() : '',
          ]
            .map(escapeCsv)
            .join(','),
        );
      });
    } else if (examType === 'Advanced') {
      lines.push(
        [
          'Rank',
          'Roll Number',
          'Student Name',
          'Total Score',
          'Max Marks',
          'Accuracy %',
          'Physics Score',
          'Chemistry Score',
          'Mathematics Score',
          'Correct',
          'Partial',
          'Incorrect',
          'Unattempted',
          'Weak Topics',
          'Time Taken (mins)',
          'Submitted At',
        ]
          .map(escapeCsv)
          .join(','),
      );

      submissions.forEach((s, idx) => {
        const bd = (s.resultBreakdown as Record<string, any>) || {};
        const sb = bd.subjectBreakdown || {};
        const phy = sb['Physics']?.score ?? 0;
        const chem = sb['Chemistry']?.score ?? 0;
        const math = sb['Mathematics']?.score ?? 0;
        const accuracy = bd.accuracyPct ?? 0;
        const timeMins = Math.round(s.timeTakenSeconds / 60);
        const weakTopics = computeWeakTopicsOneLiner(s);

        lines.push(
          [
            idx + 1,
            s.student.rollNumber,
            s.student.name,
            s.totalScore,
            s.maxScore,
            `${accuracy}%`,
            phy,
            chem,
            math,
            s.correctCount,
            s.partialCount,
            s.incorrectCount,
            s.unattemptedCount,
            weakTopics,
            timeMins,
            s.submittedAt ? s.submittedAt.toISOString() : '',
          ]
            .map(escapeCsv)
            .join(','),
        );
      });
    } else if (examType === 'NEET') {
      lines.push(
        [
          'Rank',
          'Roll Number',
          'Student Name',
          'Total Score (/720)',
          'Max Marks',
          'Accuracy %',
          'Physics (/180)',
          'Chemistry (/180)',
          'Biology (/360)',
          'Correct',
          'Incorrect',
          'Unattempted',
          'Weak Topics',
          'Time Taken (mins)',
          'Submitted At',
        ]
          .map(escapeCsv)
          .join(','),
      );

      submissions.forEach((s, idx) => {
        const bd = (s.resultBreakdown as Record<string, any>) || {};
        const sb = bd.subjectBreakdown || {};
        const phy = sb['Physics']?.score ?? 0;
        const chem = sb['Chemistry']?.score ?? 0;
        const bio = (sb['Biology']?.score ?? 0) + (sb['Botany']?.score ?? 0) + (sb['Zoology']?.score ?? 0);
        const accuracy = bd.accuracyPct ?? 0;
        const timeMins = Math.round(s.timeTakenSeconds / 60);
        const weakTopics = computeWeakTopicsOneLiner(s);

        lines.push(
          [
            idx + 1,
            s.student.rollNumber,
            s.student.name,
            s.totalScore,
            s.maxScore,
            `${accuracy}%`,
            phy,
            chem,
            bio,
            s.correctCount,
            s.incorrectCount,
            s.unattemptedCount,
            weakTopics,
            timeMins,
            s.submittedAt ? s.submittedAt.toISOString() : '',
          ]
            .map(escapeCsv)
            .join(','),
        );
      });
    } else {
      // Psychometric & Behavioral Assessment
      const paperItems = (assignment.paper.items as unknown as FacultyPaperItem[]) || [];
      const totalQuestionCount = paperItems.length || assignment.paper.questionCount || 24;

      lines.push(
        [
          'Rank',
          'Roll Number',
          'Student Name',
          'Total Alignment Score',
          'Max Score',
          'Behavioral Archetype',
          'Demonstrated Strengths',
          'Mentoring Guidance / Growth Areas',
          'Domain Breakdown',
          'Attempted Questions',
          'Skipped Questions',
          'Time Taken (mins)',
          'Submitted At',
        ]
          .map(escapeCsv)
          .join(','),
      );

      submissions.forEach((s, idx) => {
        const bd = (s.resultBreakdown as Record<string, any>) || {};
        const psy = bd.psychometricReport || {};
        const archetype = psy.archetype || 'Evaluating Mindset';
        const strengths = Array.isArray(psy.strengths) && psy.strengths.length > 0
          ? psy.strengths.slice(0, 2).join('; ')
          : 'Collaborative problem-solving';
        const guidance = Array.isArray(psy.guidance) && psy.guidance.length > 0
          ? psy.guidance.slice(0, 2).map((g: string) => g.replace(/^Mentoring recommendation:\s*/i, '')).join('; ')
          : 'Structured practice in foundational concepts';
        const domainBreakdown = Array.isArray(psy.domainBreakdown) && psy.domainBreakdown.length > 0
          ? psy.domainBreakdown.map((d: any) => `${d.domain}: ${d.score}% (${d.status})`).join('; ')
          : 'N/A';
        const timeMins = Math.round(s.timeTakenSeconds / 60);
        const attempted = Math.max(0, totalQuestionCount - s.unattemptedCount);

        lines.push(
          [
            idx + 1,
            s.student.rollNumber,
            s.student.name,
            s.totalScore,
            100,
            archetype,
            strengths,
            guidance,
            domainBreakdown,
            attempted,
            s.unattemptedCount,
            timeMins,
            s.submittedAt ? s.submittedAt.toISOString() : '',
          ]
            .map(escapeCsv)
            .join(','),
        );
      });
    }

    const safeTitle = assignment.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    return {
      csv: lines.join('\n'),
      filename: `${safeTitle}-${examType}-Results.csv`,
    };
  }
}
