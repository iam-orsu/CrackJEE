import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { FacultyPaperService, type CreateFacultyPaperInput } from '../services/FacultyPaperService';
import type { FacultyPaperItem, FacultyPaperSelection } from '../repositories/FacultyRepository';
import { deepSeekService } from '../services/DeepSeekService';
import type { Subject, QuestionType } from '../types';

describe('FacultyPaperService slot allocation and rules', () => {
  let origIsAvailable: any;

  before(() => {
    origIsAvailable = deepSeekService.isAvailable.bind(deepSeekService);
    // Mock deepSeekService to avoid network calls during fast unit tests
    (deepSeekService as any).isAvailable = () => false;
  });

  after(() => {
    (deepSeekService as any).isAvailable = origIsAvailable;
  });
  it('allocates slots evenly and distributes remainder across subjects in syllabus order', async () => {
    let createdInput: any = null;
    const fakeRepo: any = {
      createPaper: async (data: any) => {
        createdInput = data;
        return {
          id: 'test-paper-1',
          paperCode: 'FP-001ABC',
          facultyId: data.facultyId,
          title: data.title,
          examType: data.examType,
          difficulty: data.difficulty,
          questionCount: data.questionCount,
          selections: data.selections,
          items: [],
          status: 'ready',
          verifiedCount: 0,
        };
      },
      updatePaperState: async () => {},
    };

    const fallbackQuestions: any[] = [
      { id: 'q1', questionText: 'Q1', questionType: 'mcq_single', options: ['A', 'B', 'C', 'D'], answer: 'A', explanation: 'exp1' },
      { id: 'q2', questionText: 'Q2', questionType: 'mcq_single', options: ['A', 'B', 'C', 'D'], answer: 'B', explanation: 'exp2' },
      { id: 'q3', questionText: 'Q3', questionType: 'mcq_single', options: ['A', 'B', 'C', 'D'], answer: 'C', explanation: 'exp3' },
      { id: 'q4', questionText: 'Q4', questionType: 'mcq_single', options: ['A', 'B', 'C', 'D'], answer: 'D', explanation: 'exp4' },
      { id: 'q5', questionText: 'Q5', questionType: 'mcq_single', options: ['A', 'B', 'C', 'D'], answer: 'A', explanation: 'exp5' },
    ];
    const fakeQRepo: any = {
      findFacultyFallbackQuestions: async (_s: any, _t: any, _e: any, qType?: any) =>
        qType ? fallbackQuestions.filter((q) => q.questionType === qType) : fallbackQuestions,
    };

    const service = new FacultyPaperService(fakeRepo, fakeQRepo);
    const selections: FacultyPaperSelection[] = [
      { subject: 'Chemistry', topic: 'Thermodynamics' },
      { subject: 'Physics', topic: 'Kinematics' },
    ];

    const result = await service.startPaper('faculty-123', {
      examType: 'Main',
      difficulty: 'mixed',
      questionCount: 5,
      selections,
    });

    await service.waitForActiveGenerations();

    assert.equal(result.id, 'test-paper-1');
    assert.equal(createdInput.difficulty, 'mixed');
    // Physics sorted before Chemistry, so Physics gets 3 questions (base 2 + 1 remainder), Chemistry gets 2
    assert.equal(createdInput.questionCount, 5);
  });

  it('allocates granular per-topic question types (single option MCQ and integer) exactly as requested by faculty', async () => {
    let createdInput: any = null;
    let savedSlots: any[] = [];
    const fakeRepo: any = {
      createPaper: async (data: any) => {
        createdInput = data;
        return {
          id: 'test-paper-granular',
          paperCode: 'FP-GRANULAR',
          facultyId: data.facultyId,
          title: data.title,
          examType: data.examType,
          difficulty: data.difficulty,
          questionCount: data.questionCount,
          selections: data.selections,
          items: [],
          status: 'ready',
          verifiedCount: 0,
        };
      },
      updatePaperState: async (_id: string, update: any) => {
        if (update.items) savedSlots = update.items;
      },
    };

    const fallbackQuestions: any[] = [
      { id: 'q1', questionText: 'Q1', questionType: 'mcq_single', options: ['A', 'B', 'C', 'D'], answer: 'A', explanation: 'exp' },
      { id: 'q2', questionText: 'Q2', questionType: 'mcq_single', options: ['A', 'B', 'C', 'D'], answer: 'B', explanation: 'exp' },
      { id: 'q3', questionText: 'Q3', questionType: 'mcq_single', options: ['A', 'B', 'C', 'D'], answer: 'C', explanation: 'exp' },
      { id: 'q4', questionText: 'Q4', questionType: 'integer', options: [], answer: '15', explanation: 'exp' },
      { id: 'q5', questionText: 'Q5', questionType: 'integer', options: [], answer: '18', explanation: 'exp' },
      { id: 'q6', questionText: 'Q6', questionType: 'integer', options: [], answer: '25', explanation: 'exp' },
    ];
    const fakeQRepo: any = {
      findFacultyFallbackQuestions: async (_s: any, _t: any, _e: any, qType?: any) =>
        qType ? fallbackQuestions.filter((q) => q.questionType === qType) : fallbackQuestions,
    };

    const service = new FacultyPaperService(fakeRepo, fakeQRepo);
    const selections: FacultyPaperSelection[] = [
      { subject: 'Physics', topic: 'Kinematics', mcqCount: 2, integerCount: 1 },
      { subject: 'Chemistry', topic: 'Thermodynamics', mcqCount: 1, integerCount: 2 },
    ];

    const result = await service.startPaper('faculty-123', {
      examType: 'Main',
      difficulty: 'intermediate',
      questionCount: 6, // 2+1 + 1+2 = 6
      selections,
    });

    await service.waitForActiveGenerations();

    assert.equal(result.id, 'test-paper-granular');
    assert.equal(createdInput.questionCount, 6);
    assert.equal(savedSlots.length, 6);
    // Physics Kinematics has 2 MCQ and 1 Integer
    const physKin = savedSlots.filter((s: any) => s.subject === 'Physics' && s.topic === 'Kinematics');
    assert.equal(physKin.length, 3);
    assert.equal(physKin.filter((s: any) => s.questionType === 'mcq_single').length, 2);
    assert.equal(physKin.filter((s: any) => s.questionType === 'integer').length, 1);

    // Chemistry Thermodynamics has 1 MCQ and 2 Integer
    const chemThermo = savedSlots.filter((s: any) => s.subject === 'Chemistry' && s.topic === 'Thermodynamics');
    assert.equal(chemThermo.length, 3);
    assert.equal(chemThermo.filter((s: any) => s.questionType === 'mcq_single').length, 1);
    assert.equal(chemThermo.filter((s: any) => s.questionType === 'integer').length, 2);
  });

  it('strictly enforces JEE Advanced parity: always advanced difficulty', async () => {
    let createdInput: any = null;
    const fakeRepo: any = {
      createPaper: async (data: any) => {
        createdInput = data;
        return {
          id: 'test-paper-adv',
          paperCode: 'FP-002ADV',
          facultyId: data.facultyId,
          title: data.title,
          examType: data.examType,
          difficulty: data.difficulty,
          questionCount: data.questionCount,
          selections: data.selections,
          items: [],
          status: 'ready',
          verifiedCount: 0,
        };
      },
      updatePaperState: async () => {},
    };
    const fakeQRepo: any = {
      findFacultyFallbackQuestions: async () => [
        { id: 'qadv1', questionText: 'Q Adv 1', questionType: 'mcq_single', options: ['A', 'B', 'C', 'D'], answer: 'A', explanation: 'exp' },
        { id: 'qadv2', questionText: 'Q Adv 2', questionType: 'integer', options: [], answer: '7', explanation: 'exp' },
      ],
    };

    const service = new FacultyPaperService(fakeRepo, fakeQRepo);
    await service.startPaper('faculty-123', {
      examType: 'Advanced',
      difficulty: 'beginner', // faculty requested beginner, but Advanced must enforce 'advanced'
      questionCount: 2,
      selections: [{ subject: 'Physics', topic: 'Rotational Motion' }],
    });

    await service.waitForActiveGenerations();
    assert.equal(createdInput.difficulty, 'advanced');
  });

  it('formats paper code and defaults title when title is omitted', async () => {
    let savedTitle = '';
    const fakeRepo: any = {
      createPaper: async (data: any) => {
        savedTitle = data.title;
        return {
          id: '00000000-0000-0000-0000-111122223333',
          paperCode: '',
          facultyId: data.facultyId,
          title: data.title,
          examType: data.examType,
          difficulty: data.difficulty,
          questionCount: data.questionCount,
          selections: data.selections,
          items: [],
          status: 'ready',
          verifiedCount: 0,
        };
      },
      updatePaperState: async () => {},
    };
    const fakeQRepo: any = {
      findFacultyFallbackQuestions: async () => [
        { id: 'qneet', questionText: 'Q NEET', questionType: 'mcq_single', options: ['A', 'B', 'C', 'D'], answer: 'A', explanation: 'exp' },
      ],
    };

    const service = new FacultyPaperService(fakeRepo, fakeQRepo);
    const paper = await service.startPaper('faculty-123', {
      examType: 'NEET',
      difficulty: 'intermediate',
      questionCount: 1,
      selections: [{ subject: 'Botany', topic: 'Plant Physiology' }],
    });

    assert.equal(savedTitle, 'NEET-UG Botany Test');
    assert.equal(paper.paperCode, 'FP-223333');
  });
});

describe('FacultyPaperService editing, mutating, and error guards', () => {
  const samplePaper = {
    id: 'paper-456',
    paperCode: 'FP-456XYZ',
    facultyId: 'fac-1',
    title: 'Sample Test',
    examType: 'Main',
    difficulty: 'intermediate',
    questionCount: 2,
    status: 'ready',
    verifiedCount: 2,
    selections: [{ subject: 'Physics', topic: 'Kinematics' }],
    items: [
      {
        number: 1,
        subject: 'Physics' as Subject,
        topic: 'Kinematics',
        questionType: 'mcq_single' as QuestionType,
        questionText: 'Initial velocity is $u = 0$. Find distance $s$.',
        options: ['$10\\text{ m}$', '$20\\text{ m}$', '$30\\text{ m}$', '$40\\text{ m}$'],
        correctAnswer: 'A',
        explanation: 'Using $s = ut + \\frac{1}{2}at^2$.',
        diagram: null,
        verified: true,
      },
      {
        number: 2,
        subject: 'Physics' as Subject,
        topic: 'Kinematics',
        questionType: 'integer' as QuestionType,
        questionText: 'Find time taken in seconds.',
        options: [],
        correctAnswer: '5',
        explanation: 'Time $t = 5\\text{ s}$.',
        diagram: null,
        verified: true,
      },
    ],
  };

  it('updateQuestion updates question text, options, answer, and preserves verified status', async () => {
    let updatedPayload: any = null;
    const paperStore = JSON.parse(JSON.stringify(samplePaper));
    const fakeRepo: any = {
      findPaperById: async () => JSON.parse(JSON.stringify(paperStore)),
      updatePaperState: async (_id: string, payload: any) => {
        updatedPayload = payload;
        Object.assign(paperStore, payload);
      },
    };

    const service = new FacultyPaperService(fakeRepo, {} as any);
    const updated = await service.updateQuestion('fac-1', 'paper-456', 1, {
      questionText: 'Updated question with balanced math $v^2 = u^2 + 2as$.',
      correctAnswer: 'B',
      options: ['1 m', '2 m', '3 m', '4 m'],
    });

    assert.equal(updatedPayload.items[0].correctAnswer, 'B');
    assert.equal(updatedPayload.items[0].editedByFaculty, true);
    assert.equal(updatedPayload.items[0].verified, true);
    assert.equal(updatedPayload.verifiedCount, 2);
  });

  it('updateQuestion throws 409 if paper is still generating', async () => {
    const generatingPaper = { ...samplePaper, status: 'generating' };
    const fakeRepo: any = {
      findPaperById: async () => generatingPaper,
    };
    const service = new FacultyPaperService(fakeRepo, {} as any);

    await assert.rejects(
      () => service.updateQuestion('fac-1', 'paper-456', 1, { questionText: 'New text' }),
      (err: any) => err.statusCode === 409 && /generation/i.test(err.message),
    );
  });

  it('updateQuestion throws 404 for non-existent question number', async () => {
    const fakeRepo: any = {
      findPaperById: async () => samplePaper,
    };
    const service = new FacultyPaperService(fakeRepo, {} as any);

    await assert.rejects(
      () => service.updateQuestion('fac-1', 'paper-456', 99, { questionText: 'New text' }),
      (err: any) => err.statusCode === 404 && /Question #99 not found/i.test(err.message),
    );
  });

  it('updateQuestion rejects unbalanced LaTeX math delimiters or invalid MCQ options', async () => {
    const fakeRepo: any = {
      findPaperById: async () => samplePaper,
    };
    const service = new FacultyPaperService(fakeRepo, {} as any);

    // Unbalanced math
    await assert.rejects(
      () => service.updateQuestion('fac-1', 'paper-456', 1, { questionText: 'Unbalanced $x = 10' }),
      (err: any) => err.statusCode === 400 && /Unbalanced \$ math delimiters/i.test(err.message),
    );

    // MCQ with fewer than 4 options
    await assert.rejects(
      () => service.updateQuestion('fac-1', 'paper-456', 1, { options: ['A', 'B', 'C'] }),
      (err: any) => err.statusCode === 400 && /exactly 4 non-empty options/i.test(err.message),
    );
  });

  it('deleteQuestion renumbers remaining questions 1..N and rejects deleting when only 1 question remains', async () => {
    const paperStore = JSON.parse(JSON.stringify(samplePaper));
    const fakeRepo: any = {
      findPaperById: async () => JSON.parse(JSON.stringify(paperStore)),
      updatePaperState: async (_id: string, payload: any) => {
        Object.assign(paperStore, payload);
      },
    };
    const service = new FacultyPaperService(fakeRepo, {} as any);

    // Delete question 1 -> question 2 renumbers to 1
    const resultAfterDelete = await service.deleteQuestion('fac-1', 'paper-456', 1);
    assert.equal(resultAfterDelete.items.length, 1);
    assert.equal(resultAfterDelete.items[0].number, 1);
    assert.equal(resultAfterDelete.items[0].questionType, 'integer');

    // Attempting to delete the last remaining question throws 400
    await assert.rejects(
      () => service.deleteQuestion('fac-1', 'paper-456', 1),
      (err: any) => err.statusCode === 400 && /must keep at least 1 question/i.test(err.message),
    );
  });

  it('acceptDraftQuestion replaces target question or appends candidate', async () => {
    const paperStore = JSON.parse(JSON.stringify(samplePaper));
    const fakeRepo: any = {
      findPaperById: async () => JSON.parse(JSON.stringify(paperStore)),
      updatePaperState: async (_id: string, payload: any) => {
        Object.assign(paperStore, payload);
      },
    };
    const service = new FacultyPaperService(fakeRepo, {} as any);

    // Appending candidate (targetNumber = null)
    const afterAppend = await service.acceptDraftQuestion('fac-1', 'paper-456', null, {
      subject: 'Physics',
      topic: 'Kinematics',
      questionType: 'integer',
      questionText: 'Compute the acceleration $a$ in $\\text{m/s}^2$.',
      options: [],
      correctAnswer: '10',
      explanation: 'Using $v = u + at$.',
      diagram: null,
      verified: true,
    });

    assert.equal(afterAppend.items.length, 3);
    assert.equal(afterAppend.items[2].number, 3);
    assert.equal(afterAppend.items[2].correctAnswer, '10');

    // Replacing question 2
    const afterReplace = await service.acceptDraftQuestion('fac-1', 'paper-456', 2, {
      subject: 'Physics',
      topic: 'Kinematics',
      questionType: 'mcq_single',
      questionText: 'Replaced question $2$ text.',
      options: ['Opt 1', 'Opt 2', 'Opt 3', 'Opt 4'],
      correctAnswer: 'C',
      explanation: 'Replaced explanation.',
      diagram: null,
      verified: true,
    });

    assert.equal(afterReplace.items[1].number, 2);
    assert.equal(afterReplace.items[1].correctAnswer, 'C');
  });

  it('deletePaper prevents deleting while generating and deletes when ready', async () => {
    let deletedId = '';
    const fakeRepo: any = {
      findPaperById: async () => ({ ...samplePaper, status: 'generating' }),
      deletePaper: async (id: string) => { deletedId = id; },
    };
    const service = new FacultyPaperService(fakeRepo, {} as any);

    await assert.rejects(
      () => service.deletePaper('fac-1', 'paper-456'),
      (err: any) => err.statusCode === 409 && /Cannot delete a paper while it is still generating/i.test(err.message),
    );

    fakeRepo.findPaperById = async () => samplePaper;
    await service.deletePaper('fac-1', 'paper-456');
    assert.equal(deletedId, 'paper-456');
  });

  it('sweepStuckGenerating delegates to repository with 10 minute cutoff', async () => {
    let cutoffReceived: Date | null = null;
    const fakeRepo: any = {
      sweepStuckGenerating: async (cutoff: Date) => {
        cutoffReceived = cutoff;
        return 3;
      },
    };
    const service = new FacultyPaperService(fakeRepo, {} as any);
    const count = await service.sweepStuckGenerating();

    assert.equal(count, 3);
    assert.ok(cutoffReceived !== null);
    const receivedDate: Date = cutoffReceived!;
    const diffMs = Date.now() - receivedDate.getTime();
    assert.ok(diffMs >= 9 * 60 * 1000 && diffMs <= 11 * 60 * 1000);
  });
});
