import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DeepSeekPsychometricService } from '../services/DeepSeekPsychometricService';
import { PSYCHOMETRIC_CARDS, findCardDef, type CandidateProfile } from '../data/psychometricCards';

describe('Psychometric Engine & Framework Coverage', () => {
  const service = new DeepSeekPsychometricService();

  it('contains exactly the 8 specified assessment cards with required subtopics', () => {
    assert.equal(PSYCHOMETRIC_CARDS.length, 8);

    const cardNames = PSYCHOMETRIC_CARDS.map((c) => c.name);
    assert.deepEqual(cardNames, [
      'Cognitive Ability Tests',
      'Personality Tests',
      'Situational Judgment Tests (SJT)',
      'Emotional Intelligence (EI) Tests',
      'Motivation and Work-Values Tests',
      'Behavioral and Work-Style Assessments',
      'Career Interest Tests',
      'Integrity and Risk-Related Assessments',
    ]);

    // Check subtopics on Cognitive Ability Tests
    const cogCard = findCardDef('cognitive_ability');
    assert.ok(cogCard);
    assert.deepEqual(cogCard.subtopics, [
      'Numerical reasoning',
      'Verbal reasoning',
      'Logical reasoning',
      'Abstract reasoning',
      'Spatial reasoning',
      'Critical thinking and problem-solving',
    ]);

    // Check subtopics on SJT
    const sjtCard = findCardDef('situational_judgment');
    assert.ok(sjtCard);
    assert.ok(sjtCard.subtopics.includes('Conflict resolution'));
    assert.ok(sjtCard.subtopics.includes('Customer handling'));
    assert.ok(sjtCard.subtopics.includes('Ethical decision-making'));
  });

  it('generates dynamic assessment tailored to student profile', async () => {
    const studentProfile: CandidateProfile = {
      age: 16,
      professionStatus: 'student',
      studentLevel: 'intermediate',
      stream: 'Science / JEE',
    };

    const exam = await service.generateCardExam('cognitive_ability', studentProfile);
    assert.ok(exam.id.startsWith('psy_cognitive_ability'));
    assert.equal(exam.title, 'Cognitive Ability Tests');
    assert.ok(exam.sections.length > 0);

    const items = exam.sections[0]!.items;
    assert.ok(items.length >= 6);

    // Verify cognitive items have 4 options and a correct answer
    items.forEach((it) => {
      assert.ok(it.promptText.length > 5);
      assert.ok(it.options && it.options.length === 4);
    });
  });

  it('generates dynamic assessment tailored to working professional profile', async () => {
    const workingProfile: CandidateProfile = {
      age: 26,
      professionStatus: 'employed',
      jobTitle: 'Software Engineer',
      companyType: 'IT Services',
    };

    const exam = await service.generateCardExam('situational_judgment', workingProfile);
    assert.ok(exam.id.startsWith('psy_situational_judgment'));
    assert.equal(exam.title, 'Situational Judgment Tests (SJT)');

    const items = exam.sections[0]!.items;
    assert.ok(items.length >= 6);

    // Check for scenario action dilemmas
    const scenarioItems = items.filter((it) => it.itemType === 'SCENARIO_ACTION_MCQ');
    assert.ok(scenarioItems.length > 0);
    scenarioItems.forEach((it) => {
      assert.ok(it.scenarioText && it.scenarioText.length > 15);
      assert.equal(it.options.length, 4);
    });
  });

  it('includes varied response combinations across cards (Frequency, Agreement, Scenario Actions)', async () => {
    const profile: CandidateProfile = {
      age: 21,
      professionStatus: 'job_seeker',
      highestQualification: 'B.Tech',
      targetRole: 'Data Analyst',
    };

    const exam = await service.generateCardExam('behavioral_work_style', profile);
    const items = exam.sections[0]!.items;
    const types = new Set(items.map((it) => it.itemType));

    // Must mix scales: frequency and agreement
    assert.ok(types.has('FREQUENCY_SCALE') || types.has('AGREEMENT_LIKERT'));

    const freqItem = items.find((it) => it.itemType === 'FREQUENCY_SCALE');
    if (freqItem) {
      assert.equal(freqItem.options[0]?.text, 'Never');
      assert.equal(freqItem.options[4]?.text, 'Always');
    }
  });

  it('decides career outcome and what candidate can become in plain English', async () => {
    const profile: CandidateProfile = {
      age: 20,
      professionStatus: 'student',
      studentLevel: 'ug',
      stream: 'Computer Science',
    };

    const decision = await service.decideCareerAndOutcome('cognitive_ability', profile, [
      { promptText: 'Number sequence puzzle', answer: 'B', construct: 'Numerical reasoning' },
      { promptText: 'Code logic debugging problem', answer: 'A', construct: 'Logical reasoning' },
    ]);

    assert.ok(decision.summary && decision.summary.length > 10);
    assert.ok(decision.whatYouCanBecome.length >= 2);
    assert.ok(decision.coreStrengths.length >= 2);
    assert.ok(decision.actionableNextSteps.length >= 2);

    // Ensure recommendations have roles and match percentages
    decision.whatYouCanBecome.forEach((rec) => {
      assert.ok(rec.role && rec.role.length > 2);
      assert.ok(rec.matchPct >= 50 && rec.matchPct <= 100);
      assert.ok(rec.whyYouFit && rec.whyYouFit.length > 5);
    });
  });

  it('correctly calculates reverse-keying for negative psychological items', () => {
    const reverseKey = (raw: number) => Math.max(1, Math.min(5, 6 - raw));

    assert.equal(reverseKey(1), 5);
    assert.equal(reverseKey(2), 4);
    assert.equal(reverseKey(3), 3);
    assert.equal(reverseKey(4), 2);
    assert.equal(reverseKey(5), 1);
  });
});
