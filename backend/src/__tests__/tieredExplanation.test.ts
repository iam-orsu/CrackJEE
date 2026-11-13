import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTieredExplanationPrompt,
  cleanTieredExplanation,
} from '../utils/deepseekPrompts';
import { QuestionService } from '../services/QuestionService';
import type { QuestionRepository } from '../repositories/QuestionRepository';
import type { CacheService } from '../services/CacheService';
import type { DeepSeekService } from '../services/DeepSeekService';
import { AppError } from '../utils/AppError';

describe('Tiered Explanation Prompt Builder & Cleaner', () => {
  it('builds a step-by-step first-principles prompt for "better" tier', () => {
    const prompt = buildTieredExplanationPrompt({
      questionText: 'Find the acceleration of a $2\\text{ kg}$ block on a smooth $30^\\circ$ incline.',
      options: ['$g/4$', '$g/2$', '$g$', '$2g$'],
      answer: 'B',
      questionType: 'mcq_single',
      subject: 'Physics',
      topic: 'Laws of Motion',
      examType: 'Main',
      tier: 'better',
    });

    assert.match(prompt, /Better Explanation/i);
    assert.match(prompt, /Given Data & Core Principle/i);
    assert.match(prompt, /Step-by-Step Solution/i);
    assert.match(prompt, /Verification/i);
  });

  it('builds a masterclass breakdown prompt for "best" tier', () => {
    const prompt = buildTieredExplanationPrompt({
      questionText: 'Find $\\lim_{x \\to 0} \\frac{\\sin x - x}{x^3}$.',
      options: ['$-1/6$', '$1/6$', '$0$', 'Does not exist'],
      answer: 'A',
      questionType: 'mcq_single',
      subject: 'Mathematics',
      topic: 'Limits and Derivatives',
      examType: 'Advanced',
      tier: 'best',
    });

    assert.match(prompt, /Best Explanation/i);
    assert.match(prompt, /Conceptual Insight/i);
    assert.match(prompt, /Speed Technique \/ Shortcut/i);
    assert.match(prompt, /Common Pitfalls & Traps/i);
  });

  it('cleans reasoning conversational fluff from explanations', () => {
    const raw = `Sure! Here is the explanation:\n\n**Given Data & Core Principle**\nLet $m = 2\\text{ kg}$.\n\n\n\nSo the answer is B.`;
    const cleaned = cleanTieredExplanation(raw);
    assert.equal(cleaned.startsWith('Sure!'), false);
    assert.match(cleaned, /\*\*Given Data & Core Principle\*\*/);
    assert.equal(cleaned.includes('\n\n\n\n'), false);
  });
});

describe('QuestionService.getTieredExplanation', () => {
  function makeMockDependencies(initialQuestion: Record<string, unknown> | null) {
    let currentQuestion = initialQuestion ? { ...initialQuestion } : null;
    let generateCalled = 0;
    let updateCalled = 0;

    const mockRepo = {
      findByIdForTieredExplanation: async (id: string) => {
        if (!currentQuestion || currentQuestion.id !== id) return null;
        return { ...currentQuestion };
      },
      updateTieredExplanation: async (id: string, tier: 'better' | 'best', text: string) => {
        updateCalled++;
        if (currentQuestion && currentQuestion.id === id) {
          if (tier === 'better') currentQuestion.betterExplanation = text;
          else currentQuestion.bestExplanation = text;
        }
      },
    } as unknown as QuestionRepository;

    const inMemoryCache = new Map<string, unknown>();
    const mockCache = {
      setNx: async (key: string) => {
        if (inMemoryCache.has(key)) return false;
        inMemoryCache.set(key, true);
        return true;
      },
      del: async (key: string) => {
        inMemoryCache.delete(key);
      },
      getJson: async (key: string) => inMemoryCache.get(key) ?? null,
      setJson: async (key: string, val: unknown) => {
        inMemoryCache.set(key, val);
      },
    } as unknown as CacheService;

    const mockDeepSeek = {
      isAvailable: () => true,
      generateTieredExplanation: async () => {
        generateCalled++;
        return '**Step 1**: Generated explanation text via DeepSeek AI.';
      },
    } as unknown as DeepSeekService;

    return {
      mockRepo,
      mockCache,
      mockDeepSeek,
      getStats: () => ({ generateCalled, updateCalled }),
    };
  }

  it('returns pre-existing database explanation with cached: true without calling AI', async () => {
    const { mockRepo, mockCache, mockDeepSeek, getStats } = makeMockDependencies({
      id: 'q-100',
      subject: 'Physics',
      topic: 'Rotational Motion',
      questionText: 'A disk rotates...',
      options: ['1', '2', '3', '4'],
      answer: 'B',
      explanation: 'Basic explanation',
      betterExplanation: 'Pre-existing step-by-step breakdown saved in DB',
      bestExplanation: null,
      questionType: 'mcq_single',
      examType: 'Main',
      difficulty: 'intermediate',
    });

    const service = new QuestionService(mockRepo, mockCache, mockDeepSeek);
    const result = await service.getTieredExplanation('q-100', 'better');

    assert.equal(result.cached, true);
    assert.equal(result.explanation, 'Pre-existing step-by-step breakdown saved in DB');
    assert.equal(getStats().generateCalled, 0);
    assert.equal(getStats().updateCalled, 0);
  });

  it('generates on-demand when explanation is null, saves to DB, and returns cached: false', async () => {
    const { mockRepo, mockCache, mockDeepSeek, getStats } = makeMockDependencies({
      id: 'q-200',
      subject: 'Chemistry',
      topic: 'Chemical Equilibrium',
      questionText: 'Find Kp for...',
      options: ['A', 'B', 'C', 'D'],
      answer: 'C',
      explanation: 'Basic explanation',
      betterExplanation: null,
      bestExplanation: null,
      questionType: 'mcq_single',
      examType: 'Main',
      difficulty: 'intermediate',
    });

    const service = new QuestionService(mockRepo, mockCache, mockDeepSeek);
    const result = await service.getTieredExplanation('q-200', 'better');

    assert.equal(result.cached, false);
    assert.match(result.explanation, /Generated explanation text via DeepSeek AI/);
    assert.equal(getStats().generateCalled, 1);
    assert.equal(getStats().updateCalled, 1);

    // Second call should immediately hit the DB-persisted explanation
    const result2 = await service.getTieredExplanation('q-200', 'better');
    assert.equal(result2.cached, true);
    assert.equal(getStats().generateCalled, 1); // Not called again!
  });

  it('throws 404 if question does not exist', async () => {
    const { mockRepo, mockCache, mockDeepSeek } = makeMockDependencies(null);
    const service = new QuestionService(mockRepo, mockCache, mockDeepSeek);

    await assert.rejects(
      () => service.getTieredExplanation('non-existent', 'better'),
      (err: unknown) => err instanceof AppError && err.statusCode === 404,
    );
  });
});
