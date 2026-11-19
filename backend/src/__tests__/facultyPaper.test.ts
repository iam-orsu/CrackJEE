import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { FacultyPaperService, isTopicDiagramCompatible, type CreateFacultyPaperInput } from '../services/FacultyPaperService';
import type { FacultyPaperItem, FacultyPaperSelection } from '../repositories/FacultyRepository';
import { deepSeekService } from '../services/DeepSeekService';
import { deepSeekPsychometricService } from '../services/DeepSeekPsychometricService';
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
      { id: 'q6', questionText: 'Q6', questionType: 'matrix_match', options: ['A-P', 'A-Q'], answer: 'A', explanation: 'exp' },
      { id: 'q7', questionText: 'Q7', questionType: 'integer', options: [], answer: '25', explanation: 'exp' },
    ];
    const fakeQRepo: any = {
      findFacultyFallbackQuestions: async (_s: any, _t: any, _e: any, qType?: any) =>
        qType ? fallbackQuestions.filter((q) => q.questionType === qType) : fallbackQuestions,
    };

    const service = new FacultyPaperService(fakeRepo, fakeQRepo);
    const selections: FacultyPaperSelection[] = [
      { subject: 'Physics', topic: 'Kinematics', mcqCount: 2, integerCount: 1, matrixCount: 1 },
      { subject: 'Chemistry', topic: 'Thermodynamics', mcqCount: 1, integerCount: 2 },
    ];

    const result = await service.startPaper('faculty-123', {
      examType: 'Main',
      difficulty: 'intermediate',
      questionCount: 7, // 2+1+1 + 1+2 = 7
      selections,
    });

    await service.waitForActiveGenerations();

    assert.equal(result.id, 'test-paper-granular');
    assert.equal(createdInput.questionCount, 7);
    assert.equal(savedSlots.length, 7);
    // Physics Kinematics has 2 MCQ, 1 Integer, and 1 Matrix Match
    const physKin = savedSlots.filter((s: any) => s.subject === 'Physics' && s.topic === 'Kinematics');
    assert.equal(physKin.length, 4);
    assert.equal(physKin.filter((s: any) => s.questionType === 'mcq_single').length, 2);
    assert.equal(physKin.filter((s: any) => s.questionType === 'integer').length, 1);
    assert.equal(physKin.filter((s: any) => s.questionType === 'matrix_match').length, 1);

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

  it('saves optional organization name and allocates difficulty slots matching custom difficultyDistribution percentages', async () => {
    let createdInput: any = null;
    let savedSlots: any[] = [];
    const fakeRepo: any = {
      createPaper: async (data: any) => {
        createdInput = data;
        return {
          id: 'test-paper-custom-diff',
          paperCode: 'FP-CUSTOM',
          facultyId: data.facultyId,
          title: data.title,
          organization: data.organization,
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

    const fallbackQuestions: any[] = Array.from({ length: 10 }, (_, i) => ({
      id: `q${i + 1}`,
      questionText: `Q${i + 1}`,
      questionType: 'mcq_single',
      options: ['A', 'B', 'C', 'D'],
      answer: 'A',
      explanation: 'exp',
    }));
    const fakeQRepo: any = {
      findFacultyFallbackQuestions: async () => fallbackQuestions,
    };

    const service = new FacultyPaperService(fakeRepo, fakeQRepo);
    await service.startPaper('faculty-123', {
      title: 'Weekly Test 1',
      organization: 'Department of Science',
      examType: 'Main',
      difficulty: 'mixed',
      difficultyDistribution: { beginner: 50, intermediate: 30, advanced: 20 },
      questionCount: 10,
      selections: [{ subject: 'Physics', topic: 'Kinematics', mcqCount: 10 }],
    });

    await service.waitForActiveGenerations();

    assert.equal(createdInput.organization, 'Department of Science');
    assert.equal(savedSlots.length, 10);
    // 50% beginner = 5, 30% intermediate = 3, 20% advanced = 2
    assert.equal(savedSlots.filter((s: any) => s.difficulty === 'beginner').length, 5);
    assert.equal(savedSlots.filter((s: any) => s.difficulty === 'intermediate').length, 3);
    assert.equal(savedSlots.filter((s: any) => s.difficulty === 'advanced').length, 2);
  });

  it('guarantees at least 2 diagram questions on every faculty paper (10, 20, 75 questions)', async () => {
    let savedItems: any[] = [];
    const fakeRepo: any = {
      createPaper: async (data: any) => ({
        id: 'test-paper-diagram-quota',
        paperCode: 'FP-DIAG',
        facultyId: data.facultyId,
        title: data.title,
        examType: data.examType,
        difficulty: data.difficulty,
        questionCount: data.questionCount,
        selections: data.selections,
        items: [],
        status: 'ready',
        verifiedCount: 0,
      }),
      updatePaperState: async (_id: string, update: any) => {
        if (update.items) savedItems = update.items;
      },
    };

    // Bank questions: 2 with diagrams, 8 without
    const fallbackQuestions: any[] = Array.from({ length: 10 }, (_, i) => ({
      id: `q_${i + 1}`,
      questionText: `Question text ${i + 1}`,
      questionType: 'mcq_single',
      options: ['A', 'B', 'C', 'D'],
      answer: 'A',
      explanation: 'Explanation',
      diagram: i < 2 ? { template: 'simple_circuit', params: {} } : null,
    }));

    const fakeQRepo: any = {
      findFacultyFallbackQuestions: async () => fallbackQuestions,
    };

    const service = new FacultyPaperService(fakeRepo, fakeQRepo);
    await service.startPaper('faculty-123', {
      examType: 'Main',
      difficulty: 'intermediate',
      questionCount: 10,
      selections: [{ subject: 'Physics', topic: 'Current Electricity' }],
    });

    await service.waitForActiveGenerations();

    const diagramItems = savedItems.filter((item) => item.diagram !== null);
    assert.ok(diagramItems.length >= 2, `Expected at least 2 diagram items in 10-question faculty paper, got ${diagramItems.length}`);
  });

  it('isTopicDiagramCompatible correctly identifies abstract vs visual topics', () => {
    assert.equal(isTopicDiagramCompatible('Mathematics', 'Permutations and Combinations'), false);
    assert.equal(isTopicDiagramCompatible('Mathematics', 'Binomial Theorem'), false);
    assert.equal(isTopicDiagramCompatible('Mathematics', 'Matrices'), false);
    assert.equal(isTopicDiagramCompatible('Mathematics', 'Mathematical Reasoning'), false);
    assert.equal(isTopicDiagramCompatible('Mathematics', 'Statistics'), false);
    assert.equal(isTopicDiagramCompatible('Mathematics', 'Probability'), false);
    assert.equal(isTopicDiagramCompatible('Mathematics', 'Sequences and Series'), false);
    assert.equal(isTopicDiagramCompatible('Mathematics', 'Coordinate Geometry'), true);
    assert.equal(isTopicDiagramCompatible('Mathematics', 'Circles'), true);
    assert.equal(isTopicDiagramCompatible('Physics', 'Kinematics'), true);
    assert.equal(isTopicDiagramCompatible('Physics', 'Current Electricity'), true);
    assert.equal(isTopicDiagramCompatible('Physics', 'Units and Dimensions'), false);
    assert.equal(isTopicDiagramCompatible('Physics', 'Units and Measurements'), false);
    assert.equal(isTopicDiagramCompatible('Physics', 'Physical World and Measurement'), false);
    assert.equal(isTopicDiagramCompatible('Chemistry', 'Hydrocarbons'), true);
    assert.equal(isTopicDiagramCompatible('Botany', 'Plant Kingdom'), true);
  });

  it('gracefully handles abstract-only topic selection without forcing diagrams or failing', async () => {
    let savedItems: any[] = [];
    const fakeRepo: any = {
      createPaper: async (data: any) => ({
        id: 'test-paper-abstract',
        paperCode: 'FP-ABS',
        facultyId: data.facultyId,
        title: data.title,
        examType: data.examType,
        difficulty: data.difficulty,
        questionCount: data.questionCount,
        selections: data.selections,
        items: [],
        status: 'ready',
        verifiedCount: 0,
      }),
      updatePaperState: async (_id: string, update: any) => {
        if (update.items) savedItems = update.items;
      },
    };

    const fallbackQuestions: any[] = Array.from({ length: 5 }, (_, i) => ({
      id: `p_${i + 1}`,
      questionText: `Permutation question ${i + 1}`,
      questionType: 'mcq_single',
      options: ['120', '720', '5040', '24'],
      answer: 'B',
      explanation: 'Formula n!',
      diagram: null,
    }));

    const fakeQRepo: any = {
      findFacultyFallbackQuestions: async () => fallbackQuestions,
    };

    const service = new FacultyPaperService(fakeRepo, fakeQRepo);
    await service.startPaper('faculty-123', {
      examType: 'Main',
      difficulty: 'intermediate',
      questionCount: 5,
      selections: [{ subject: 'Mathematics', topic: 'Permutations and Combinations' }],
    });

    await service.waitForActiveGenerations();

    // Abstract paper generates cleanly with 5 questions, all diagram: null
    assert.equal(savedItems.length, 5);
    const diagramItems = savedItems.filter((item) => item.diagram !== null);
    assert.equal(diagramItems.length, 0, 'Abstract topics should not have diagrams forced onto them');
  });
});

describe('FacultyPaperService editing, mutating, and error guards', () => {
  let origPsyHasApiKey: any;

  before(() => {
    origPsyHasApiKey = (deepSeekPsychometricService as any).hasApiKey.bind(deepSeekPsychometricService);
    (deepSeekPsychometricService as any).hasApiKey = () => false;
  });

  after(() => {
    (deepSeekPsychometricService as any).hasApiKey = origPsyHasApiKey;
  });

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

  it('generates a faculty psychometric paper with goal calibration, model diversity, and CSV export', async () => {
    let savedState: any = null;
    const fakeRepo: any = {
      createPaper: async (data: any) => ({
        id: 'psy-paper-101',
        paperCode: 'FP-PSY101',
        facultyId: data.facultyId,
        title: data.title,
        examType: data.examType,
        difficulty: data.difficulty,
        questionCount: data.questionCount,
        selections: data.selections,
        items: [],
        status: 'generating',
        verifiedCount: 0,
      }),
      updatePaperState: async (_id: string, state: any) => {
        savedState = state;
      },
      findPaperById: async () => ({
        id: 'psy-paper-101',
        paperCode: 'FP-PSY101',
        facultyId: 'fac-1',
        title: 'Psychometric CS & Entrepreneurship Assessment',
        examType: 'Psychometric',
        difficulty: 'intermediate',
        questionCount: 16,
        selections: [{ subject: 'Psychometric', topic: 'Cognitive Ability Tests' }],
        items: savedState?.items || [],
        status: savedState?.status || 'ready',
        verifiedCount: savedState?.verifiedCount || 16,
      }),
    };

    const service = new FacultyPaperService(fakeRepo, {} as any);
    const paper = await service.startPaper('fac-1', {
      title: 'Psychometric CS & Entrepreneurship Assessment',
      organization: 'Tech Institute',
      examType: 'Psychometric',
      examGoal: "Assess student's Computer Science aptitude and Entrepreneurship mindset",
      difficulty: 'intermediate',
      questionCount: 16,
      selections: [
        { subject: 'Psychometric' as Subject, topic: 'Cognitive Ability Tests' },
        { subject: 'Psychometric' as Subject, topic: 'Personality Tests' },
        { subject: 'Psychometric' as Subject, topic: 'Situational Judgment Tests (SJT)' },
        { subject: 'Psychometric' as Subject, topic: 'Motivation and Work-Values Tests' },
      ],
    });

    assert.equal(paper.id, 'psy-paper-101');
    assert.equal(paper.examType, 'Psychometric');

    // Wait for the background psychometric generation job to complete
    await service.waitForActiveGenerations();

    assert.ok(savedState !== null);
    assert.equal(savedState.status, 'ready');
    assert.equal(savedState.items.length, 16);

    // Verify all 5 psychometric question models are represented in the generated items
    const hasLikert = savedState.items.some((i: any) => i.options.length === 5 && i.options.includes('Strongly Disagree'));
    const hasFrequency = savedState.items.some((i: any) => i.options.length === 5 && i.options.includes('Never'));
    const hasPassion = savedState.items.some((i: any) => i.options.length === 4 && i.options.includes('Passionate'));
    const hasScenario = savedState.items.some((i: any) => i.topic.includes('Situational') || i.questionText.includes('\n\n'));
    const hasCognitive = savedState.items.some((i: any) => i.topic.includes('Cognitive'));

    assert.ok(hasLikert, 'Must include 5-point Agreement Likert model');
    assert.ok(hasFrequency, 'Must include 5-point Frequency scale model');
    assert.ok(hasPassion, 'Must include 4-point Passion/Interest scale model');
    assert.ok(hasScenario, 'Must include SJT scenario action dilemma model');
    assert.ok(hasCognitive, 'Must include Cognitive aptitude puzzle model');

    // Verify opinion-based evaluation rubric and radical answer flags in explanation
    const itemWithRadicalFlag = savedState.items.find((i: any) => i.explanation.includes('**Radical Answer Flag:**'));
    assert.ok(itemWithRadicalFlag, 'Explanation must include radical answer observation note');

    // Verify CSV export
    const csv = service.exportPaperToCsv({
      paperCode: 'FP-PSY101',
      title: 'Psychometric CS & Entrepreneurship Assessment',
      organization: 'Tech Institute',
      examType: 'Psychometric',
      difficulty: 'intermediate',
      questionCount: 16,
      items: savedState.items,
    });

    assert.ok(csv.startsWith('\uFEFF'), 'CSV must include UTF-8 BOM for Excel');
    assert.ok(csv.includes('FP-PSY101'), 'CSV must include paper code');
    assert.ok(csv.includes('Psychometric CS & Entrepreneurship Assessment'), 'CSV must include title');
    assert.ok(csv.includes('Radical Answer Observation Flag'), 'CSV must include radical flag column header');
    assert.ok(csv.includes('Candidate Persona Fit'), 'CSV must include persona fit column');

    // Verify updating a question with trait rubric text is permitted
    const updated = await service.updateQuestion('fac-1', 'psy-paper-101', 2, {
      correctAnswer: 'Trait Rubric: A = High Bold Risk, B = Structured Prudence',
    });
    assert.equal(updated.items[1]?.correctAnswer, 'Trait Rubric: A = High Bold Risk, B = Structured Prudence');

    // Verify generating a Sparkle draft question on psychometric topic
    const candidate = await service.generateDraftQuestion('fac-1', 'psy-paper-101', {
      subject: 'Psychometric' as Subject,
      topic: 'Cognitive Ability Tests',
    });

    assert.equal(candidate.subject, 'Psychometric');
    assert.ok(candidate.questionText.length > 10);
    assert.ok(candidate.options.length >= 4);
    assert.ok(candidate.correctAnswer.length > 0);

    // Verify accepting the candidate replaces the question
    const paperWithReplaced = await service.acceptDraftQuestion('fac-1', 'psy-paper-101', 1, candidate);
    assert.equal(paperWithReplaced.items[0]?.questionText, candidate.questionText);
  });
});
