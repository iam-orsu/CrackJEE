export interface PsychometricQuestionData {
  id: string;
  section: 'COGNITIVE' | 'BEHAVIORAL' | 'SJT' | 'ANXIETY' | 'RIASEC';
  construct: string;
  subFacet?: string;
  itemType:
    | 'SCENARIO_ACTION_MCQ'
    | 'FREQUENCY_SCALE'
    | 'EFFECTIVENESS_SCALE'
    | 'PREFERENCE_CHOICE'
    | 'PASSION_SCALE'
    | 'AGREEMENT_LIKERT'
    | 'COGNITIVE_MCQ';
  scenarioText?: string;
  promptText: string;
  options: Array<{ id: string; text: string }>;
  correctAnswer?: string;
  isReverseKeyed?: boolean;
  orderIndex: number;
}

export const AGREEMENT_LIKERT_OPTIONS = [
  { id: '1', text: 'Strongly Disagree' },
  { id: '2', text: 'Disagree' },
  { id: '3', text: 'Partially Agree' },
  { id: '4', text: 'Agree' },
  { id: '5', text: 'Strongly Agree' },
];

export const FREQUENCY_5_OPTIONS = [
  { id: '1', text: 'Never' },
  { id: '2', text: 'Rarely' },
  { id: '3', text: 'Sometimes' },
  { id: '4', text: 'Often' },
  { id: '5', text: 'Always' },
];

export const EFFECTIVENESS_OPTIONS = [
  { id: '1', text: 'Very Bad Idea' },
  { id: '2', text: 'Not Very Helpful' },
  { id: '3', text: 'Helpful & Good' },
  { id: '4', text: 'Super Effective' },
];

export const PASSION_OPTIONS = [
  { id: '1', text: 'Not Interested' },
  { id: '2', text: 'A Little Curious' },
  { id: '3', text: 'Interested' },
  { id: '4', text: 'Love It / Passionate' },
];

/**
 * Static question bank has been purged.
 * All psychometric and behavioral questions are generated 100% dynamically on-demand
 * by the AI engine based on candidate age, education, and profession profile.
 */
export const PSYCHOMETRIC_BANK: PsychometricQuestionData[] = [];
