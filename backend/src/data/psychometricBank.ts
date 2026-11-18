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
  correctAnswer?: string; // For cognitive or optimal SJT
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
  { id: '1', text: 'Highly Ineffective' },
  { id: '2', text: 'Somewhat Ineffective' },
  { id: '3', text: 'Effective' },
  { id: '4', text: 'Highly Effective' },
];

export const PASSION_OPTIONS = [
  { id: '1', text: 'Not Interested' },
  { id: '2', text: 'Slightly Curious' },
  { id: '3', text: 'Interested' },
  { id: '4', text: 'Extremely Passionate' },
];

export const PSYCHOMETRIC_BANK: PsychometricQuestionData[] = [
  // ==========================================
  // SECTION 1: COGNITIVE APTITUDE (Timed MCQs - CHC Theory)
  // ==========================================
  {
    id: 'cog_num_01',
    section: 'COGNITIVE',
    construct: 'NUMERICAL',
    subFacet: 'Number Series Induction',
    itemType: 'COGNITIVE_MCQ',
    promptText: 'Find the next number in the sequence: 4, 11, 25, 53, 109, ?',
    options: [
      { id: 'A', text: '215' },
      { id: 'B', text: '221' },
      { id: 'C', text: '219' },
      { id: 'D', text: '225' },
    ],
    correctAnswer: 'B',
    orderIndex: 1,
  },
  {
    id: 'cog_num_02',
    section: 'COGNITIVE',
    construct: 'NUMERICAL',
    subFacet: 'Quantitative Logic',
    itemType: 'COGNITIVE_MCQ',
    promptText: 'A car covers the first 40% of a distance at 60 km/h and the remaining 60% at 90 km/h. What is the average speed for the entire journey?',
    options: [
      { id: 'A', text: '72 km/h' },
      { id: 'B', text: '75 km/h' },
      { id: 'C', text: '73.5 km/h' },
      { id: 'D', text: '78 km/h' },
    ],
    correctAnswer: 'B',
    orderIndex: 2,
  },
  {
    id: 'cog_abs_01',
    section: 'COGNITIVE',
    construct: 'ABSTRACT',
    subFacet: 'Matrix Rule Induction',
    itemType: 'COGNITIVE_MCQ',
    promptText: 'In a 3x3 pattern matrix, Row 1 has: 1 circle (0 crosses), 2 circles (1 cross), 3 circles (2 crosses). Row 2 has: 2 squares (1 cross), 3 squares (2 crosses), 4 squares (3 crosses). Row 3 has: 3 triangles (2 crosses), 4 triangles (3 crosses), [ ? ]. Which completes the matrix?',
    options: [
      { id: 'A', text: '5 triangles with 3 crosses' },
      { id: 'B', text: '5 triangles with 4 crosses' },
      { id: 'C', text: '4 triangles with 4 crosses' },
      { id: 'D', text: '6 triangles with 4 crosses' },
    ],
    correctAnswer: 'B',
    orderIndex: 3,
  },
  {
    id: 'cog_log_01',
    section: 'COGNITIVE',
    construct: 'LOGICAL',
    subFacet: 'Deductive Syllogism',
    itemType: 'COGNITIVE_MCQ',
    promptText: 'Premise 1: All high-energy photons cause photoelectric emission on surface X.\nPremise 2: Some UV rays are high-energy photons.\nPremise 3: Radiation Y does not cause photoelectric emission on surface X.\nWhich conclusion is logically certain?',
    options: [
      { id: 'A', text: 'Radiation Y cannot be ultraviolet.' },
      { id: 'B', text: 'Radiation Y is definitely infrared.' },
      { id: 'C', text: 'Radiation Y is not a high-energy photon.' },
      { id: 'D', text: 'Radiation Y has a frequency above the threshold frequency.' },
    ],
    correctAnswer: 'C',
    orderIndex: 4,
  },
  {
    id: 'cog_spa_01',
    section: 'COGNITIVE',
    construct: 'SPATIAL',
    subFacet: '3D Mental Rotation',
    itemType: 'COGNITIVE_MCQ',
    promptText: 'A solid cube has opposite faces painted Red/Green, Blue/Yellow, and White/Black. If Red is on TOP, Blue is on FRONT, and White is on the RIGHT, what color is on the face opposite to the face touching the tabletop?',
    options: [
      { id: 'A', text: 'Green' },
      { id: 'B', text: 'Yellow' },
      { id: 'C', text: 'Red' },
      { id: 'D', text: 'Black' },
    ],
    correctAnswer: 'C',
    orderIndex: 5,
  },

  // ==========================================
  // SECTION 2: BEHAVIORAL PROFILE (Habits, Preferences & 1 Agreement Question)
  // ==========================================
  {
    id: 'beh_hab_01',
    section: 'BEHAVIORAL',
    construct: 'CONSCIENTIOUSNESS',
    subFacet: 'Distraction & Pacing',
    itemType: 'FREQUENCY_SCALE',
    promptText: 'When studying alone at home, how often do you catch yourself getting distracted by your phone or switching apps instead of working?',
    options: FREQUENCY_5_OPTIONS,
    isReverseKeyed: true, // Never/Rarely = High Conscientiousness
    orderIndex: 6,
  },
  {
    id: 'beh_hab_02',
    section: 'BEHAVIORAL',
    construct: 'CONSCIENTIOUSNESS',
    subFacet: 'Error Logging',
    itemType: 'FREQUENCY_SCALE',
    promptText: 'How consistently do you maintain a dedicated notebook to record and re-solve questions you got wrong in mock tests?',
    options: FREQUENCY_5_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 7,
  },
  {
    id: 'beh_pref_01',
    section: 'BEHAVIORAL',
    construct: 'OPENNESS',
    subFacet: 'Problem Solving Style',
    itemType: 'PREFERENCE_CHOICE',
    promptText: 'When tackling an unfamiliar, multi-concept physics problem, which approach best describes your default tendency?',
    options: [
      { id: 'A', text: 'I derive the problem from first principles and visualize the core physical laws.' },
      { id: 'B', text: 'I search my memory for standard formula patterns and drill through calculation steps.' },
      { id: 'C', text: 'I prefer seeing a worked-out solution first to learn the standard trick.' },
    ],
    correctAnswer: 'A',
    orderIndex: 8,
  },
  {
    id: 'beh_agr_01',
    section: 'BEHAVIORAL',
    construct: 'AGREEABLENESS',
    subFacet: 'Peer Collaboration',
    itemType: 'FREQUENCY_SCALE',
    promptText: 'When a classmate is struggling with a concept you understand well, how often do you take time to explain it to them?',
    options: FREQUENCY_5_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 9,
  },
  // ── OCCASIONAL AGREEMENT SCALE QUESTION (1 of 2 in whole exam) ──
  {
    id: 'beh_lik_01',
    section: 'BEHAVIORAL',
    construct: 'HONESTY_HUMILITY',
    subFacet: 'Academic Integrity',
    itemType: 'AGREEMENT_LIKERT',
    promptText: '“If an unreleased answer key or leaked question paper were secretly circulating in a private group chat, I would strictly refuse to look at it to preserve genuine self-assessment.”',
    options: AGREEMENT_LIKERT_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 10,
  },

  // ==========================================
  // SECTION 3: SITUATIONAL JUDGMENT SCENARIOS (Action Choices & Strategy)
  // ==========================================
  {
    id: 'sjt_act_01',
    section: 'SJT',
    construct: 'SJT_DECISION_MAKING',
    subFacet: 'Exam Hall Triage',
    itemType: 'SCENARIO_ACTION_MCQ',
    scenarioText: 'You are 25 minutes into the 3-hour exam. The physics section is unexpectedly difficult; you spent 18 minutes attempting the first 3 questions and could not arrive at a definitive answer for any of them. Panic starts building.',
    promptText: 'What is your best immediate course of action?',
    options: [
      { id: 'A', text: 'Keep working on these 3 questions until I finish at least one to protect my confidence.' },
      { id: 'B', text: 'Take a 15-second deep breath, mark them for later review, and immediately switch to Chemistry/Biology to bank quick, confident marks.' },
      { id: 'C', text: 'Guess option B or C for all three questions and speed-read through the remaining physics paper.' },
      { id: 'D', text: 'Re-read the question statements repeatedly from the very beginning.' },
    ],
    correctAnswer: 'B',
    orderIndex: 11,
  },
  {
    id: 'sjt_act_02',
    section: 'SJT',
    construct: 'SJT_ACADEMIC_ETHICS',
    subFacet: 'Peer Pressure Dilemma',
    itemType: 'SCENARIO_ACTION_MCQ',
    scenarioText: 'During an offline mock test, your close friend seated next to you nudges your desk and whispers asking for your answer sheet on the Organic Chemistry section.',
    promptText: 'How do you handle this situation?',
    options: [
      { id: 'A', text: 'Move my arm so they can read my answers without attracting the invigilator’s attention.' },
      { id: 'B', text: 'Discreetly shield my paper and stay focused on my own exam, knowing false marks harm their preparation in the long run.' },
      { id: 'C', text: 'Raise my hand and publicly accuse my friend in front of the classroom.' },
      { id: 'D', text: 'Whisper back the answers quickly to avoid offending them.' },
    ],
    correctAnswer: 'B',
    orderIndex: 12,
  },
  {
    id: 'sjt_eff_01',
    section: 'SJT',
    construct: 'SJT_RESILIENCE',
    subFacet: 'Post-Exam Setback Recovery',
    itemType: 'EFFECTIVENESS_SCALE',
    scenarioText: 'The faculty publishes batch rankings for a major mock exam. You scored in the bottom 25% of the batch with -18 negative marks due to over-guessing in the last 15 minutes.',
    promptText: 'Rate the effectiveness of this strategy: “Analyze the error log to calculate marks lost to wild guessing, set a strict zero-guess policy on the next test, and schedule a 20-minute doubt review with the faculty.”',
    options: EFFECTIVENESS_OPTIONS,
    correctAnswer: '4', // Highly effective
    orderIndex: 13,
  },
  // ── OCCASIONAL AGREEMENT SCALE QUESTION (2 of 2 in whole exam) ──
  {
    id: 'sjt_lik_01',
    section: 'SJT',
    construct: 'SJT_FEEDBACK_RECEPTIVITY',
    subFacet: 'Faculty Critical Feedback',
    itemType: 'AGREEMENT_LIKERT',
    scenarioText: 'During a live batch paper analysis, a senior professor points out to the whole batch that your approach to Calculus is based on superficial memorization rather than conceptual understanding.',
    promptText: '“Instead of feeling embarrassed or angry, I would visit the professor during office hours with my rough work to ask for targeted problem-solving guidance.”',
    options: AGREEMENT_LIKERT_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 14,
  },

  // ==========================================
  // SECTION 4: EXAM ANXIETY & RESILIENCE (Frequency of Somatic & Panic Reactions)
  // ==========================================
  {
    id: 'anx_frq_01',
    section: 'ANXIETY',
    construct: 'TEST_ANXIETY',
    subFacet: 'Somatic Panic',
    itemType: 'FREQUENCY_SCALE',
    promptText: 'In the 10 minutes right before exam papers are unsealed, how often do you experience racing heartbeats, cold hands, or physical stomach tension?',
    options: FREQUENCY_5_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 15,
  },
  {
    id: 'anx_frq_02',
    section: 'ANXIETY',
    construct: 'TEST_ANXIETY',
    subFacet: 'Cognitive Blanking',
    itemType: 'FREQUENCY_SCALE',
    promptText: 'How often do formulas you knew perfectly at home suddenly vanish from your mind the moment you face them in the exam hall?',
    options: FREQUENCY_5_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 16,
  },
  {
    id: 'anx_frq_03',
    section: 'ANXIETY',
    construct: 'ACADEMIC_RESILIENCE',
    subFacet: 'Bounce-Back Stamina',
    itemType: 'FREQUENCY_SCALE',
    promptText: 'When you receive a disappointing score in a weekly test, how consistently do you recover your motivation and resume focused preparation within 24 hours?',
    options: FREQUENCY_5_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 17,
  },

  // ==========================================
  // SECTION 5: CAREER & STREAM DISCOVERY (Passion & Interest Ratings)
  // ==========================================
  {
    id: 'ria_pas_01',
    section: 'RIASEC',
    construct: 'RIASEC_I',
    subFacet: 'Algorithms & AI Systems',
    itemType: 'PASSION_SCALE',
    promptText: 'Building machine learning models, writing code to automate workflows, or exploring algorithmic problem solving.',
    options: PASSION_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 18,
  },
  {
    id: 'ria_pas_02',
    section: 'RIASEC',
    construct: 'RIASEC_R',
    subFacet: 'Robotics & Hardware',
    itemType: 'PASSION_SCALE',
    promptText: 'Designing mechanical gear assemblies, soldering microcontroller circuits, or experimenting with drones and robots.',
    options: PASSION_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 19,
  },
  {
    id: 'ria_pas_03',
    section: 'RIASEC',
    construct: 'RIASEC_I',
    subFacet: 'Clinical Medicine & Surgery',
    itemType: 'PASSION_SCALE',
    promptText: 'Diagnosing complex medical symptoms, studying neurobiology and anatomy, or performing high-precision lab procedures.',
    options: PASSION_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 20,
  },
  {
    id: 'ria_pas_04',
    section: 'RIASEC',
    construct: 'RIASEC_I',
    subFacet: 'Biotechnology & Genetics',
    itemType: 'PASSION_SCALE',
    promptText: 'Investigating DNA sequencing, CRISPR gene therapies, and computational bioinformatics.',
    options: PASSION_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 21,
  },
  {
    id: 'ria_pas_05',
    section: 'RIASEC',
    construct: 'RIASEC_C',
    subFacet: 'Data Systems & Security',
    itemType: 'PASSION_SCALE',
    promptText: 'Organizing complex database structures, analyzing financial metrics, or designing cybersecurity protocols.',
    options: PASSION_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 22,
  },
  {
    id: 'ria_pas_06',
    section: 'RIASEC',
    construct: 'RIASEC_I',
    subFacet: 'Theoretical Research',
    itemType: 'PASSION_SCALE',
    promptText: 'Working on unresolved mathematical conjectures, quantum mechanics theories, and publishing research papers.',
    options: PASSION_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 23,
  },
];
