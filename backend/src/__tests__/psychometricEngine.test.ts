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

  it('ensures agreement scale (Strongly Disagree to Agree) occurs only occasionally (1-2 times)', () => {
    const exam = service.generateFromRandomizedBank('test_psy_3', 'Main');
    const allItems = exam.sections.flatMap((s) => s.items);

    const agreementItems = allItems.filter((it) => it.itemType === 'AGREEMENT_LIKERT');
    // As explicitly requested: strongly agree/disagree should come occasionally like 1-2, not everything
    assert.ok(agreementItems.length <= 2, `Expected at most 2 agreement items, got ${agreementItems.length}`);
    assert.ok(agreementItems.length >= 1, 'Expected at least 1 agreement item');
  });

  it('covers Situational Judgment (SJT) with realistic scenario action MCQs and effectiveness ratings', () => {
    const exam = service.generateFromRandomizedBank('test_psy_4', 'Advanced');
    const sjtSec = exam.sections.find((s) => s.id === 'sec_sjt');

    assert.ok(sjtSec);
    const itemTypes = new Set(sjtSec.items.map((it) => it.itemType));
    assert.ok(itemTypes.has('SCENARIO_ACTION_MCQ'));

    const actionMcq = sjtSec.items.find((it) => it.itemType === 'SCENARIO_ACTION_MCQ');
    assert.ok(actionMcq);
    assert.ok(actionMcq.scenarioText && actionMcq.scenarioText.length > 20);
    assert.ok(actionMcq.options.length === 4); // 4 distinct action options (A, B, C, D)
  });

  it('covers Spielberger TAI and Cassidy ARS-30 with frequency rating scales', () => {
    const exam = service.generateFromRandomizedBank('test_psy_5', 'NEET');
    const anxSec = exam.sections.find((s) => s.id === 'sec_anxiety');

    assert.ok(anxSec);
    const constructs = new Set(anxSec.items.map((it) => it.construct));

    assert.ok(constructs.has('TEST_ANXIETY'));
    assert.ok(constructs.has('ACADEMIC_RESILIENCE'));

    anxSec.items.forEach((item) => {
      assert.equal(item.itemType, 'FREQUENCY_SCALE');
      assert.equal(item.options?.length, 5);
      assert.equal(item.options[0]?.text, 'Never');
      assert.equal(item.options[4]?.text, 'Always');
    });
  });

  it('covers Holland RIASEC model with passion & interest ratings', () => {
    const exam = service.generateFromRandomizedBank('test_psy_6', 'Both');
    const riaSec = exam.sections.find((s) => s.id === 'sec_riasec');

    assert.ok(riaSec);
    const constructs = new Set(riaSec.items.map((it) => it.construct));

    assert.ok(constructs.has('RIASEC_R')); // Realistic
    assert.ok(constructs.has('RIASEC_I')); // Investigative
    assert.ok(constructs.has('RIASEC_C')); // Conventional

    riaSec.items.forEach((item) => {
      assert.equal(item.itemType, 'PASSION_SCALE');
      assert.equal(item.options?.length, 4);
      assert.equal(item.options[0]?.text, 'Not Interested');
      assert.equal(item.options[3]?.text, 'Extremely Passionate');
    });
  });

  it('correctly calculates reverse-keying for negative psychological items', () => {
    // On a 1-5 scale: adjusted = (5 + 1) - raw
    const reverseKey = (raw: number) => Math.max(1, Math.min(5, 6 - raw));

    assert.equal(reverseKey(1), 5); // Never getting distracted = high positive score
    assert.equal(reverseKey(2), 4);
    assert.equal(reverseKey(3), 3);
    assert.equal(reverseKey(4), 2);
    assert.equal(reverseKey(5), 1); // Always getting distracted = 1
  });
});
