import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { MockDataService } from '../services/MockDataService';
import type { MockPoolItem } from '../repositories/MockExamRepository';

function makeMockPool(prefix: string, count = 75): MockPoolItem[] {
  return Array.from({ length: count }, (_, i) => ({
    questionId: `${prefix}_q${i + 1}`,
    subject: i < 25 ? 'Physics' : i < 50 ? 'Chemistry' : 'Mathematics',
    questionType: i === 0 ? 'matrix_match' : 'mcq_single',
    topic: 'Units and Dimensions',
    hasDiagram: i === 0,
  }));
}

test('Mock paper reuse: brand new user reuses existing stored ladder paper', async () => {
  const paper1Items = makeMockPool('p1', 75);
  const mockRepo = {
    findStoredPapersByPlanKey: async () => [
      { id: 'stored_1', examType: 'Main', planKey: 'ladder:paper:1', items: paper1Items },
    ],
  };

  const service = new MockDataService(mockRepo as any);
  const seen = new Set<string>(); // brand new user

  const result = await service.findStoredPaper('Main', 'ladder:paper:1', (items) =>
    items.length === 75 &&
    items.some((i) => i.questionType === 'matrix_match') &&
    items.some((i) => i.hasDiagram) &&
    items.every((i) => {
      const qId = i.questionId || (i as any).id;
      return !!qId && !seen.has(qId);
    }),
  );

  assert.ok(result !== null);
  assert.equal(result!.length, 75);
  assert.equal(result![0]!.questionId, 'p1_q1');
});

test('Mock paper reuse: returning user who took the paper in the morning rejects the stored paper', async () => {
  const paper1Items = makeMockPool('p1', 75);
  const mockRepo = {
    findStoredPapersByPlanKey: async () => [
      { id: 'stored_1', examType: 'Main', planKey: 'ladder:paper:1', items: paper1Items },
    ],
  };

  const service = new MockDataService(mockRepo as any);
  // User took paper 1 in the morning, so all p1 questions are in seen
  const seen = new Set(paper1Items.map((q) => q.questionId));

  const result = await service.findStoredPaper('Main', 'ladder:paper:1', (items) =>
    items.length === 75 &&
    items.some((i) => i.questionType === 'matrix_match') &&
    items.some((i) => i.hasDiagram) &&
    items.every((i) => {
      const qId = i.questionId || (i as any).id;
      return !!qId && !seen.has(qId);
    }),
  );

  assert.equal(result, null, 'Stored paper with seen questions must be rejected');
});

test('Mock paper reuse: returning user reuses an alternative stored paper that has zero seen questions', async () => {
  const paper1Items = makeMockPool('p1', 75);
  const paper1AltItems = makeMockPool('p1_fresh', 75);

  const mockRepo = {
    findStoredPapersByPlanKey: async () => [
      { id: 'stored_1', examType: 'Main', planKey: 'ladder:paper:1', items: paper1Items },
      { id: 'stored_2', examType: 'Main', planKey: 'ladder:paper:1', items: paper1AltItems },
    ],
  };

  const service = new MockDataService(mockRepo as any);
  // User has seen p1, but has NOT seen p1_fresh
  const seen = new Set(paper1Items.map((q) => q.questionId));

  const result = await service.findStoredPaper('Main', 'ladder:paper:1', (items) =>
    items.length === 75 &&
    items.some((i) => i.questionType === 'matrix_match') &&
    items.some((i) => i.hasDiagram) &&
    items.every((i) => {
      const qId = i.questionId || (i as any).id;
      return !!qId && !seen.has(qId);
    }),
  );

  assert.ok(result !== null);
  assert.equal(result![0]!.questionId, 'p1_fresh_q1');
});

test('Mock paper reuse: rejects stored papers when items format uses id field and is in seen', async () => {
  const legacyItems = Array.from({ length: 75 }, (_, i) => ({
    id: `legacy_q${i + 1}`,
    subject: i < 25 ? 'Physics' : i < 50 ? 'Chemistry' : 'Mathematics',
    questionType: i === 0 ? 'matrix_match' : 'mcq_single',
    topic: 'Units and Dimensions',
    hasDiagram: i === 0,
  }));

  const mockRepo = {
    findStoredPapersByPlanKey: async () => [
      { id: 'stored_legacy', examType: 'Main', planKey: 'ladder:paper:1', items: legacyItems },
    ],
  };

  const service = new MockDataService(mockRepo as any);
  const seen = new Set(['legacy_q1']); // Seen at least one question

  const result = await service.findStoredPaper('Main', 'ladder:paper:1', (items) =>
    items.length === 75 &&
    items.some((i) => i.questionType === 'matrix_match') &&
    items.some((i) => i.hasDiagram) &&
    items.every((i) => {
      const qId = (i as any).questionId || (i as any).id;
      return !!qId && !seen.has(qId);
    }),
  );

  assert.equal(result, null, 'Legacy stored paper with seen questions must be rejected');
});
