import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  answersMatch,
  buildFacultyGenerationPrompt,
  hasBalancedMathDelimiters,
  isValidDiagramTemplate,
  normalizeFacultyAnswer,
  validateFacultyQuestion,
} from '../utils/facultyPrompts';
import { getJeeTopicsForExam } from '../types';

describe('facultyPrompts math and diagram validators', () => {
  it('validates balanced inline and display math delimiters while ignoring escaped $', () => {
    assert.equal(hasBalancedMathDelimiters('Let $x = 2$ and $$y = \\int_0^1 x\\,dx$$ cost \\$10.'), true);
    assert.equal(hasBalancedMathDelimiters('Broken math $x = 2 and y = 3'), false);
    assert.equal(hasBalancedMathDelimiters('Mismatched $$x = 2$'), false);
  });

  it('validates allowed diagram templates and parameter bounds', () => {
    assert.equal(isValidDiagramTemplate(null), true);
    assert.equal(isValidDiagramTemplate({ template: 'inclined_plane', params: { angle_deg: 30 } }), true);
    assert.equal(isValidDiagramTemplate({ template: 'inclined_plane', params: { angle_deg: 95 } }), false);
    assert.equal(isValidDiagramTemplate({ template: 'organic_structure', params: { smiles: 'CCO' } }), true);
    assert.equal(isValidDiagramTemplate({ template: 'organic_structure', params: { smiles: '' } }), false);
    assert.equal(isValidDiagramTemplate({ template: 'unknown_shape', params: {} }), false);
  });
});

describe('facultyPrompts answer canonicalization & matching', () => {
  it('canonicalizes mcq_single, mcq_multi, and integer answers', () => {
    assert.equal(normalizeFacultyAnswer('mcq_single', ' b '), 'B');
    assert.equal(normalizeFacultyAnswer('mcq_multi', 'c, a, c'), 'A,C');
    assert.equal(normalizeFacultyAnswer('integer', '0042'), '42');
    assert.equal(normalizeFacultyAnswer('integer', 'not-a-number'), '');
  });

  it('matches equivalent answers cleanly', () => {
    assert.equal(answersMatch('mcq_multi', 'C,A', 'a, c'), true);
    assert.equal(answersMatch('mcq_single', 'B', 'C'), false);
    assert.equal(answersMatch('integer', '7', '07'), true);
  });
});

describe('validateFacultyQuestion', () => {
  it('accepts a valid JEE/NEET single-correct question', () => {
    const valid = validateFacultyQuestion(
      {
        question: 'A block slides down a $30^\\circ$ smooth incline. Find acceleration $a$.',
        options: ['$g/4$', '$g/2$', '$g$', '$2g$'],
        correct_answer: 'B',
        answer_explanation: 'Along the incline, $a = g \\sin 30^\\circ = g/2$.',
        diagram: { template: 'inclined_plane', params: { angle_deg: 30 } },
      },
      'mcq_single',
      'NEET',
    );
    assert.equal(valid.correct_answer, 'B');
    assert.equal(valid.options.length, 4);
  });

  it('rejects unbalanced LaTeX delimiters or invalid diagram templates', () => {
    assert.throws(() =>
      validateFacultyQuestion(
        {
          question: 'Find $x + 1',
          options: ['1', '2', '3', '4'],
          correct_answer: 'A',
          answer_explanation: 'x=0',
          diagram: null,
        },
        'mcq_single',
        'Main',
      ),
    );

    assert.throws(() =>
      validateFacultyQuestion(
        {
          question: 'Find area.',
          options: ['1', '2', '3', '4'],
          correct_answer: 'A',
          answer_explanation: 'Area is 1.',
          diagram: { template: 'fake_diagram', params: {} },
        },
        'mcq_single',
        'Main',
      ),
    );
  });

  it('rejects negative integers on integer questions', () => {
    assert.throws(() =>
      validateFacultyQuestion(
        {
          question: 'Find $n$.',
          options: [],
          correct_answer: '-3',
          answer_explanation: 'n = -3',
          diagram: null,
        },
        'integer',
        'Main',
      ),
    );
  });
});

describe('rationalized syllabus and cognitive depth guards', () => {
  it('filters rationalized JEE Main chapters while keeping JEE Advanced Chemistry chapters', () => {
    const mainTopics = getJeeTopicsForExam('Main');
    const advTopics = getJeeTopicsForExam('Advanced');

    assert.equal(mainTopics.Physics.includes('Communication Systems'), false);
    assert.equal(mainTopics.Chemistry.includes('Polymers'), false);
    assert.equal(mainTopics.Chemistry.includes('Solid State'), false);
    assert.equal(mainTopics.Mathematics.includes('Principle of Mathematical Induction'), false);

    assert.equal(advTopics.Physics.includes('Communication Systems'), false);
    assert.equal(advTopics.Chemistry.includes('Polymers'), true);
    assert.equal(advTopics.Chemistry.includes('Solid State'), true);
    assert.equal(advTopics.Chemistry.includes('General Principles of Metallurgy'), true);
  });

  it('enforces IIT JEE Advanced rigor and anti-NCERT rules in faculty prompts', () => {
    const prompt = buildFacultyGenerationPrompt({
      subject: 'Physics',
      topic: 'Rotational Motion',
      examType: 'Advanced',
      difficulty: 'beginner',
      questionType: 'mcq_multi',
      targetLetter: 'A',
    });

    assert.match(prompt, /HARD \(JEE Advanced level\)/i);
    assert.match(prompt, /STRICTLY NO school-level, NCERT back-exercise/i);
    assert.match(prompt, /IIT JEE Advanced/i);
  });
});
