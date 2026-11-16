import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import {
  distributeTopicSlots,
  fisherYatesShuffle,
  planDifficultySlots,
  planQuestionTypeSlots,
} from '../utils/questionUtils';

const TOPICS = ['Kinematics', 'Laws of Motion', 'Work Energy', 'Gravitation'];

test('fisherYatesShuffle keeps every element exactly once', () => {
  const input = [1, 2, 3, 4, 5, 6];
  const out = fisherYatesShuffle(input);
  assert.deepEqual([...out].sort((a, b) => a - b), input);
  assert.notEqual(out, input, 'returns a new array');
});

test('a single topic fills all slots with that topic', () => {
  assert.deepEqual(distributeTopicSlots(['Sets'], 3), ['Sets', 'Sets', 'Sets']);
});

test('fewer slots than topics gives distinct topics, one slot each', () => {
  const out = distributeTopicSlots(TOPICS, 3);
  assert.equal(out.length, 3);
  assert.equal(new Set(out).size, 3);
  for (const t of out) assert.ok(TOPICS.includes(t));
});

test('between N and 2N slots: every topic appears, none more than twice', () => {
  const out = distributeTopicSlots(TOPICS, 6);
  assert.equal(out.length, 6);
  for (const t of TOPICS) {
    const n = out.filter((x) => x === t).length;
    assert.ok(n >= 1 && n <= 2, `${t} appeared ${n} times`);
  }
});

test('many slots are spread evenly, differing by at most one', () => {
  const out = distributeTopicSlots(TOPICS, 30);
  assert.equal(out.length, 30);
  const counts = TOPICS.map((t) => out.filter((x) => x === t).length);
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 1, `counts ${counts}`);
});

test('no topics or no slots gives an empty plan', () => {
  assert.deepEqual(distributeTopicSlots([], 5), []);
  assert.deepEqual(distributeTopicSlots(TOPICS, 0), []);
});

test('planDifficultySlots respects percentage distribution (e.g. 30/30/40)', () => {
  const slots = planDifficultySlots(10, 'mixed', { beginner: 30, intermediate: 30, advanced: 40 });
  assert.equal(slots.length, 10);
  const beg = slots.filter((d) => d === 'beginner').length;
  const inter = slots.filter((d) => d === 'intermediate').length;
  const adv = slots.filter((d) => d === 'advanced').length;
  assert.equal(beg, 3);
  assert.equal(inter, 3);
  assert.equal(adv, 4);
});

test('planDifficultySlots defaults mixed difficulty to 20% easy, 40% med, 40% hard without jumping', () => {
  const slots10 = planDifficultySlots(10, 'mixed');
  assert.equal(slots10.length, 10);
  assert.equal(slots10.filter((d) => d === 'beginner').length, 2);
  assert.equal(slots10.filter((d) => d === 'intermediate').length, 4);
  assert.equal(slots10.filter((d) => d === 'advanced').length, 4);

  const slots20 = planDifficultySlots(20, 'mixed');
  assert.equal(slots20.length, 20);
  assert.equal(slots20.filter((d) => d === 'beginner').length, 4);
  assert.equal(slots20.filter((d) => d === 'intermediate').length, 8);
  assert.equal(slots20.filter((d) => d === 'advanced').length, 8);
});

test('planDifficultySlots returns single difficulty when specified without distribution', () => {
  const slots = planDifficultySlots(7, 'advanced');
  assert.equal(slots.length, 7);
  assert.ok(slots.every((d) => d === 'advanced'));
});

test('planQuestionTypeSlots allocates exact type counts when matching slot count', () => {
  const slots = planQuestionTypeSlots(10, {
    mcq_single: 5,
    integer: 3,
    matrix_match: 2,
  });
  assert.equal(slots.length, 10);
  assert.equal(slots.filter((t) => t === 'mcq_single').length, 5);
  assert.equal(slots.filter((t) => t === 'integer').length, 3);
  assert.equal(slots.filter((t) => t === 'matrix_match').length, 2);
});

test('planQuestionTypeSlots scales proportionally when total counts differ', () => {
  const slots = planQuestionTypeSlots(12, {
    mcq_single: 5,
    integer: 3,
    matrix_match: 2,
  });
  assert.equal(slots.length, 12);
  const single = slots.filter((t) => t === 'mcq_single').length;
  const integer = slots.filter((t) => t === 'integer').length;
  const matrix = slots.filter((t) => t === 'matrix_match').length;
  assert.equal(single + integer + matrix, 12);
  assert.ok(single > integer);
});

test('PaperService.buildPaperPage partitions questions matching questionTypes', async () => {
  const { PaperService } = await import('../services/PaperService');
  const mockRows = [
    // 8 single, 4 integer, 3 matrix match for Physics
    ...Array(8).fill(null).map((_, i) => ({ id: `p_s_${i}`, subject: 'Physics', topic: 'Kinematics', questionType: 'mcq_single', difficulty: 'intermediate' })),
    ...Array(4).fill(null).map((_, i) => ({ id: `p_i_${i}`, subject: 'Physics', topic: 'Kinematics', questionType: 'integer', difficulty: 'intermediate' })),
    ...Array(3).fill(null).map((_, i) => ({ id: `p_m_${i}`, subject: 'Physics', topic: 'Kinematics', questionType: 'matrix_match', difficulty: 'intermediate' })),
  ];

  const mockRepo = {
    findPaperPoolRows: async () => mockRows,
    findPaperPreviewByIds: async (ids: string[]) => ids.map((id) => ({ id, questionText: `Question ${id}`, difficulty: 'intermediate', subject: 'Physics', topic: 'Kinematics' })),
  } as any;

  const mockCache = {
    getJson: async () => null,
    setJson: async () => {},
  } as any;

  const service = new PaperService(mockRepo, mockCache);
  const result = await service.buildPaperPage('user_123', {
    selections: [{ subject: 'Physics', topic: 'Kinematics' }],
    difficulty: 'intermediate',
    examType: 'Main',
    perSubject: 10,
    questionTypes: {
      mcq_single: 5,
      integer: 3,
      matrix_match: 2,
    },
  }, 1);

  assert.ok(result.available > 0);
  assert.ok(result.papers.length > 0);
  const paper0 = result.papers[0]!;
  assert.equal(paper0.length, 10);
  assert.equal(paper0.filter((id) => id.startsWith('p_s_')).length, 5);
  assert.equal(paper0.filter((id) => id.startsWith('p_i_')).length, 3);
  assert.equal(paper0.filter((id) => id.startsWith('p_m_')).length, 2);
});

test('PaperService.buildPaperPage generates 20% easy, 40% med, 40% hard by default for mixed difficulty', async () => {
  const { PaperService } = await import('../services/PaperService');
  const mockRows = [
    ...Array(10).fill(null).map((_, i) => ({ id: `p_beg_${i}`, subject: 'Physics', topic: 'Kinematics', questionType: 'mcq_single', difficulty: 'beginner' })),
    ...Array(10).fill(null).map((_, i) => ({ id: `p_int_${i}`, subject: 'Physics', topic: 'Kinematics', questionType: 'mcq_single', difficulty: 'intermediate' })),
    ...Array(10).fill(null).map((_, i) => ({ id: `p_adv_${i}`, subject: 'Physics', topic: 'Kinematics', questionType: 'mcq_single', difficulty: 'advanced' })),
  ];

  const mockRepo = {
    findPaperPoolRows: async () => mockRows,
    findPaperPreviewByIds: async (ids: string[]) => ids.map((id) => ({ id, questionText: `Question ${id}`, difficulty: id.startsWith('p_beg') ? 'beginner' : id.startsWith('p_int') ? 'intermediate' : 'advanced', subject: 'Physics', topic: 'Kinematics' })),
  } as any;

  const mockCache = {
    getJson: async () => null,
    setJson: async () => {},
  } as any;

  const service = new PaperService(mockRepo, mockCache);
  const result = await service.buildPaperPage('user_mixed', {
    selections: [{ subject: 'Physics', topic: 'Kinematics' }],
    difficulty: 'mixed',
    examType: 'Main',
    perSubject: 10,
  }, 1);

  assert.ok(result.available > 0);
  assert.ok(result.papers.length > 0);
  for (const paper of result.papers) {
    assert.equal(paper.length, 10);
    assert.equal(paper.filter((id) => id.startsWith('p_beg_')).length, 2, '20% easy = 2 questions');
    assert.equal(paper.filter((id) => id.startsWith('p_int_')).length, 4, '40% medium = 4 questions');
    assert.equal(paper.filter((id) => id.startsWith('p_adv_')).length, 4, '40% hard = 4 questions');
  }
});
