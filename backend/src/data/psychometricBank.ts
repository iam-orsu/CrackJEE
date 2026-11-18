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
 * Calibrated 23-item question bank tailored for Indian students in Class 6 to 12
 * Uses simple, relatable, everyday Indian school and exam language without complex academic jargon.
 */
export const PSYCHOMETRIC_BANK: PsychometricQuestionData[] = [
  // ==========================================
  // SECTION 1: MIND PUZZLES & QUICK LOGIC (5 Questions)
  // ==========================================
  {
    id: 'cog_num_01',
    section: 'COGNITIVE',
    construct: 'NUMERICAL',
    subFacet: 'Number Pattern Puzzle',
    itemType: 'COGNITIVE_MCQ',
    promptText: 'Look at the pattern: 2, 6, 12, 20, 30, ? What number comes next?',
    options: [
      { id: 'A', text: '40' },
      { id: 'B', text: '42' },
      { id: 'C', text: '36' },
      { id: 'D', text: '48' },
    ],
    correctAnswer: 'B', // +4, +6, +8, +10, +12 = 42
    orderIndex: 1,
  },
  {
    id: 'cog_num_02',
    section: 'COGNITIVE',
    construct: 'NUMERICAL',
    subFacet: 'Speed & Time Puzzle',
    itemType: 'COGNITIVE_MCQ',
    promptText: 'A school bus travels 60 kilometers in the first hour, and 40 kilometers in the second hour. What is the average speed of the bus over the 2 hours?',
    options: [
      { id: 'A', text: '45 km/h' },
      { id: 'B', text: '50 km/h' },
      { id: 'C', text: '55 km/h' },
      { id: 'D', text: '52 km/h' },
    ],
    correctAnswer: 'B', // (60 + 40) / 2 = 50 km/h
    orderIndex: 2,
  },
  {
    id: 'cog_abs_01',
    section: 'COGNITIVE',
    construct: 'ABSTRACT',
    subFacet: 'Shape Sequence',
    itemType: 'COGNITIVE_MCQ',
    promptText: 'In a shape pattern: Step 1 is a Triangle (3 sides), Step 2 is a Square (4 sides), Step 3 is a Pentagon (5 sides). What shape must come in Step 4?',
    options: [
      { id: 'A', text: 'Circle (0 straight sides)' },
      { id: 'B', text: 'Hexagon (6 sides)' },
      { id: 'C', text: 'Heptagon (7 sides)' },
      { id: 'D', text: 'Rectangle (4 sides)' },
    ],
    correctAnswer: 'B',
    orderIndex: 3,
  },
  {
    id: 'cog_log_01',
    section: 'COGNITIVE',
    construct: 'LOGICAL',
    subFacet: 'Class Ranking Deduction',
    itemType: 'COGNITIVE_MCQ',
    promptText: 'In a class test: Priya scored higher than Rahul. Rahul scored higher than Ananya. Sneha scored higher than Priya. Who scored the lowest marks among all four?',
    options: [
      { id: 'A', text: 'Priya' },
      { id: 'B', text: 'Rahul' },
      { id: 'C', text: 'Ananya' },
      { id: 'D', text: 'Sneha' },
    ],
    correctAnswer: 'C',
    orderIndex: 4,
  },
  {
    id: 'cog_spa_01',
    section: 'COGNITIVE',
    construct: 'SPATIAL',
    subFacet: 'Dice / Cube Visualization',
    itemType: 'COGNITIVE_MCQ',
    promptText: 'On a standard Ludo dice, opposite faces always add up to 7 (for example, 1 is opposite to 6). If the number 3 is on the top face of the dice, which number is on the bottom face touching the table?',
    options: [
      { id: 'A', text: '2' },
      { id: 'B', text: '5' },
      { id: 'C', text: '4' },
      { id: 'D', text: '6' },
    ],
    correctAnswer: 'C', // 7 - 3 = 4
    orderIndex: 5,
  },

  // ==========================================
  // SECTION 2: DAILY STUDY HABITS & ROUTINE (5 Questions)
  // ==========================================
  {
    id: 'beh_hab_01',
    section: 'BEHAVIORAL',
    construct: 'CONSCIENTIOUSNESS',
    subFacet: 'Phone Distraction',
    itemType: 'FREQUENCY_SCALE',
    promptText: 'When studying alone at home, how often do you get distracted by your mobile phone (checking Instagram reels, YouTube shorts, games, or chat notifications)?',
    options: FREQUENCY_5_OPTIONS,
    isReverseKeyed: true, // Never/Rarely = High Discipline
    orderIndex: 6,
  },
  {
    id: 'beh_hab_02',
    section: 'BEHAVIORAL',
    construct: 'CONSCIENTIOUSNESS',
    subFacet: 'Mistake Notebook Routine',
    itemType: 'FREQUENCY_SCALE',
    promptText: 'How often do you write down questions you got wrong in tests into a separate notebook to practice them again before the next exam?',
    options: FREQUENCY_5_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 7,
  },
  {
    id: 'beh_pref_01',
    section: 'BEHAVIORAL',
    construct: 'OPENNESS',
    subFacet: 'How You Learn Best',
    itemType: 'PREFERENCE_CHOICE',
    promptText: 'When you encounter a difficult new concept in Maths or Science, how do you prefer to tackle it?',
    options: [
      { id: 'A', text: 'I try to understand the core reason behind it and figure out why the formula works.' },
      { id: 'B', text: 'I practice 10 similar problems step-by-step until the method becomes automatic.' },
      { id: 'C', text: 'I prefer seeing the solved example first so I can memorize the trick.' },
    ],
    correctAnswer: 'A',
    orderIndex: 8,
  },
  {
    id: 'beh_agr_01',
    section: 'BEHAVIORAL',
    construct: 'AGREEABLENESS',
    subFacet: 'Helping Classmates',
    itemType: 'FREQUENCY_SCALE',
    promptText: 'When a classmate or friend is struggling with a topic that you understand easily, how often do you happily sit and explain it to them?',
    options: FREQUENCY_5_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 9,
  },
  // ── OCCASIONAL AGREEMENT SCALE (1 of 2 in whole exam) ──
  {
    id: 'beh_lik_01',
    section: 'BEHAVIORAL',
    construct: 'HONESTY_HUMILITY',
    subFacet: 'Honesty & Fair Play',
    itemType: 'AGREEMENT_LIKERT',
    promptText: '“If someone in my class secretly gets a copy of tomorrow’s exam questions and offers to show it to me, I would strictly say NO and prepare honestly on my own.”',
    options: AGREEMENT_LIKERT_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 10,
  },

  // ==========================================
  // SECTION 3: REAL SCHOOL & EXAM SITUATIONS (4 Questions)
  // ==========================================
  {
    id: 'sjt_act_01',
    section: 'SJT',
    construct: 'SJT_DECISION_MAKING',
    subFacet: 'Exam Time Management',
    itemType: 'SCENARIO_ACTION_MCQ',
    scenarioText: 'You have only 20 minutes left in a major exam, and there are still 6 questions left. Question 15 looks very difficult, and you already wasted 8 minutes trying to solve it without finding the answer. You are feeling anxious.',
    promptText: 'What is the smartest thing for you to do right now?',
    options: [
      { id: 'A', text: 'Keep fighting with Question 15 until I solve it, no matter how much time it takes.' },
      { id: 'B', text: 'Leave Question 15 immediately, quickly read the other 5 questions, and solve the easiest ones first to grab sure marks.' },
      { id: 'C', text: 'Guess option B or C for all remaining questions and put my pen down.' },
      { id: 'D', text: 'Close my eyes and panic about getting low marks.' },
    ],
    correctAnswer: 'B',
    orderIndex: 11,
  },
  {
    id: 'sjt_act_02',
    section: 'SJT',
    construct: 'SJT_ACADEMIC_ETHICS',
    subFacet: 'Friend Asking to Copy',
    itemType: 'SCENARIO_ACTION_MCQ',
    scenarioText: 'During a class test, your close friend seated next to you nudges your elbow and whispers, asking you to move your hand so they can copy your answers. The teacher is looking the other way.',
    promptText: 'What do you do?',
    options: [
      { id: 'A', text: 'Let them copy easily so they don’t get angry with me.' },
      { id: 'B', text: 'Politely cover my answer sheet, focus on my exam, and explain after class that copying will not help them learn.' },
      { id: 'C', text: 'Stand up and shout loudly to make the teacher punish them in front of everyone.' },
      { id: 'D', text: 'Quickly whisper the answers so they pass the test.' },
    ],
    correctAnswer: 'B',
    orderIndex: 12,
  },
  {
    id: 'sjt_eff_01',
    section: 'SJT',
    construct: 'SJT_RESILIENCE',
    subFacet: 'Overcoming Low Marks',
    itemType: 'EFFECTIVENESS_SCALE',
    scenarioText: 'You received a disappointing score in a weekly test because you rushed and made silly calculation mistakes.',
    promptText: 'Rate this strategy: “Circle every silly mistake in red pen, find out why I rushed, solve 10 similar questions carefully, and double-check all calculations before submitting next time.”',
    options: EFFECTIVENESS_OPTIONS,
    correctAnswer: '4', // Super Effective
    orderIndex: 13,
  },
  // ── OCCASIONAL AGREEMENT SCALE (2 of 2 in whole exam) ──
  {
    id: 'sjt_lik_01',
    section: 'SJT',
    construct: 'SJT_FEEDBACK_RECEPTIVITY',
    subFacet: 'Handling Teacher Feedback',
    itemType: 'AGREEMENT_LIKERT',
    scenarioText: 'Your teacher checks your test paper and points out in front of the class that your handwriting is messy and you skipped basic formula steps.',
    promptText: '“Instead of feeling hurt or angry at the teacher, I would politely ask them after class how I can improve my step-by-step presentation.”',
    options: AGREEMENT_LIKERT_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 14,
  },

  // ==========================================
  // SECTION 4: EXAM TENSION & CONFIDENCE (3 Questions)
  // ==========================================
  {
    id: 'anx_frq_01',
    section: 'ANXIETY',
    construct: 'TEST_ANXIETY',
    subFacet: 'Butterflies Before Exam',
    itemType: 'FREQUENCY_SCALE',
    promptText: 'Right before the teacher distributes the question paper in the exam hall, do you feel nervous, have butterflies in your stomach, or feel your heart beating fast?',
    options: FREQUENCY_5_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 15,
  },
  {
    id: 'anx_frq_02',
    section: 'ANXIETY',
    construct: 'TEST_ANXIETY',
    subFacet: 'Blanking Out',
    itemType: 'FREQUENCY_SCALE',
    promptText: 'Have you ever known an answer or formula really well at home, but totally forgot it the moment you saw the question paper in the exam?',
    options: FREQUENCY_5_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 16,
  },
  {
    id: 'anx_frq_03',
    section: 'ANXIETY',
    construct: 'ACADEMIC_RESILIENCE',
    subFacet: 'Bouncing Back',
    itemType: 'FREQUENCY_SCALE',
    promptText: 'When you score lower marks than expected in a school test, how consistently can you cheer up and start studying again with confidence within 24 hours?',
    options: FREQUENCY_5_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 17,
  },

  // ==========================================
  // SECTION 5: YOUR INTERESTS & DREAM CAREERS (6 Questions)
  // ==========================================
  {
    id: 'ria_pas_01',
    section: 'RIASEC',
    construct: 'RIASEC_I',
    subFacet: 'Coding, Apps & Games',
    itemType: 'PASSION_SCALE',
    promptText: 'Writing computer code, making your own mobile apps, or creating 3D video games.',
    options: PASSION_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 18,
  },
  {
    id: 'ria_pas_02',
    section: 'RIASEC',
    construct: 'RIASEC_R',
    subFacet: 'Robots, Gadgets & Machines',
    itemType: 'PASSION_SCALE',
    promptText: 'Taking apart old gadgets, building remote-control cars, drones, or assembling electronic circuits.',
    options: PASSION_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 19,
  },
  {
    id: 'ria_pas_03',
    section: 'RIASEC',
    construct: 'RIASEC_I',
    subFacet: 'Doctors & Saving Lives',
    itemType: 'PASSION_SCALE',
    promptText: 'Learning how the human body works, curing sick patients, and becoming a doctor or surgeon in a hospital.',
    options: PASSION_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 20,
  },
  {
    id: 'ria_pas_04',
    section: 'RIASEC',
    construct: 'RIASEC_I',
    subFacet: 'Space, Rockets & Experiments',
    itemType: 'PASSION_SCALE',
    promptText: 'Learning about space missions (like ISRO Chandrayaan & rockets), astronomy, and doing fun science lab experiments.',
    options: PASSION_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 21,
  },
  {
    id: 'ria_pas_05',
    section: 'RIASEC',
    construct: 'RIASEC_C',
    subFacet: 'Business, Startups & Leadership',
    itemType: 'PASSION_SCALE',
    promptText: 'Organizing school events, managing money, and dreaming of starting your own business or company.',
    options: PASSION_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 22,
  },
  {
    id: 'ria_pas_06',
    section: 'RIASEC',
    construct: 'RIASEC_A',
    subFacet: 'Drawing, Animation & Creative Design',
    itemType: 'PASSION_SCALE',
    promptText: 'Drawing sketches, digital art, video editing, 3D animation, or designing buildings and stylish products.',
    options: PASSION_OPTIONS,
    isReverseKeyed: false,
    orderIndex: 23,
  },
];
