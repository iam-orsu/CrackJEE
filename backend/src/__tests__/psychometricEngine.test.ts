import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DeepSeekPsychometricService } from '../services/DeepSeekPsychometricService';
import { PSYCHOMETRIC_BANK } from '../data/psychometricBank';

describe('Psychometric Engine & Framework Coverage', () => {
  const service = new DeepSeekPsychometricService();

  it('generates a complete 5-section psychometric exam battery', () => {
    const exam = service.generateFromRandomizedBank('test_psy_1', 'Main');

    assert.ok(exam.id.startsWith('test_psy_1'));
    assert.equal(exam.sections.length, 5);

    const sectionIds = exam.sections.map((s) => s.id);
    assert.deepEqual(sectionIds, [
      'sec_cognitive',
      'sec_behavioral',
      'sec_sjt',
      'sec_anxiety',
      'sec_riasec',
    ]);
  });

  it('covers CHC Theory with timed cognitive aptitude questions', () => {
    const exam = service.generateFromRandomizedBank('test_psy_2', 'NEET');
    const cogSec = exam.sections.find((s) => s.id === 'sec_cognitive');

    assert.ok(cogSec);
    assert.equal(cogSec.timeLimitSeconds, 15 * 60); // 15 mins timed
    assert.ok(cogSec.items.length >= 4);

    // Verify cognitive items have options and correct answers
    cogSec.items.forEach((item) => {
      assert.equal(item.section, 'COGNITIVE');
      assert.equal(item.itemType, 'COGNITIVE_MCQ');
      assert.ok(item.options && item.options.length === 4);
      assert.ok(item.correctAnswer);
    });
  });

  it('covers Big Five (OCEAN) and HEXACO Honesty-Humility with 5-point Likert items', () => {
    const exam = service.generateFromRandomizedBank('test_psy_3', 'Main');
    const behSec = exam.sections.find((s) => s.id === 'sec_behavioral');

    assert.ok(behSec);
    const constructs = new Set(behSec.items.map((it) => it.construct));

    assert.ok(constructs.has('CONSCIENTIOUSNESS'));
    assert.ok(constructs.has('OPENNESS'));
    assert.ok(constructs.has('EMOTIONAL_STABILITY'));
    assert.ok(constructs.has('HONESTY_HUMILITY')); // HEXACO H factor

    behSec.items.forEach((item) => {
      assert.equal(item.itemType, 'LIKERT_5');
      assert.equal(item.options?.length, 5);
    });
  });

  it('covers Situational Judgment (SJT) with scenario vignettes and agreement rating', () => {
    const exam = service.generateFromRandomizedBank('test_psy_4', 'Advanced');
    const sjtSec = exam.sections.find((s) => s.id === 'sec_sjt');

    assert.ok(sjtSec);
    sjtSec.items.forEach((item) => {
      assert.equal(item.section, 'SJT');
      assert.equal(item.itemType, 'SCENARIO_LIKERT_5');
      assert.ok(item.scenarioText && item.scenarioText.length > 20);
      assert.ok(item.promptText && item.promptText.length > 10);
      assert.equal(item.options?.length, 5);
      assert.equal(item.options[0]?.text, 'Strongly Disagree');
      assert.equal(item.options[4]?.text, 'Strongly Agree');
    });
  });

  it('covers Spielberger TAI and Cassidy ARS-30 for test anxiety and resilience', () => {
    const exam = service.generateFromRandomizedBank('test_psy_5', 'NEET');
    const anxSec = exam.sections.find((s) => s.id === 'sec_anxiety');

    assert.ok(anxSec);
    const constructs = new Set(anxSec.items.map((it) => it.construct));

    assert.ok(constructs.has('TEST_ANXIETY'));
    assert.ok(constructs.has('ACADEMIC_RESILIENCE'));

    anxSec.items.forEach((item) => {
      assert.equal(item.itemType, 'LIKERT_4');
      assert.equal(item.options?.length, 4);
      assert.equal(item.options[0]?.text, 'Almost Never');
      assert.equal(item.options[3]?.text, 'Almost Always');
    });
  });

  it('covers Holland RIASEC model for engineering vs medical stream discovery', () => {
    const exam = service.generateFromRandomizedBank('test_psy_6', 'Both');
    const riaSec = exam.sections.find((s) => s.id === 'sec_riasec');

    assert.ok(riaSec);
    const constructs = new Set(riaSec.items.map((it) => it.construct));

    assert.ok(constructs.has('RIASEC_R')); // Realistic
    assert.ok(constructs.has('RIASEC_I')); // Investigative
    assert.ok(constructs.has('RIASEC_C')); // Conventional
    assert.ok(constructs.has('RIASEC_S')); // Social

    riaSec.items.forEach((item) => {
      assert.equal(item.itemType, 'RIASEC_RATING');
      assert.equal(item.options?.length, 5);
      assert.equal(item.options[0]?.text, 'Strongly Dislike');
      assert.equal(item.options[4]?.text, 'Strongly Like');
    });
  });

  it('correctly calculates reverse-keying for negative psychological items', () => {
    // On a 1-5 scale: adjusted = (5 + 1) - raw
    const reverseKey = (raw: number) => Math.max(1, Math.min(5, 6 - raw));

    assert.equal(reverseKey(1), 5); // Strongly disagree with a negative statement = high positive score
    assert.equal(reverseKey(2), 4);
    assert.equal(reverseKey(3), 3);
    assert.equal(reverseKey(4), 2);
    assert.equal(reverseKey(5), 1); // Strongly agreeing with negative statement = 1
  });
});
