import type { Request } from 'express';

export type Subject = 'Mathematics' | 'Physics' | 'Chemistry' | 'Botany' | 'Zoology';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type ExamType = 'Main' | 'Advanced' | 'Both' | 'NEET';
export type StudentClass = '11' | '12' | 'Dropper';
export type QuestionType = 'mcq_single' | 'mcq_multi' | 'integer';
export const NEET_SUBJECTS: Subject[] = ['Physics', 'Chemistry', 'Botany', 'Zoology'];

export interface AuthPayload {
  userId: string;
  // Unique token id: lets logout revoke this exact token
  jti?: string;
  // When the login session began (ms since epoch); refreshes keep it so sessions have a hard maximum
  sessionStart?: number;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

// Template-based diagram: DeepSeek picks a template + named params.
// The frontend computes all geometry from params — no raw coordinates.
export interface DiagramTemplate {
  template: 'inclined_plane' | 'simple_circuit' | 'lens_mirror' | 'energy_profile' | 'coordinate_geometry'
    | 'projectile_motion' | 'pulley_system' | 'wave_diagram' | 'capacitor_field' | 'pv_diagram'
    | 'triangle' | 'circle_geometry' | 'conic_section' | 'argand_plane'
    | 'molecular_geometry' | 'mo_diagram' | 'crystal_structure' | 'electrochemical_cell' | 'organic_structure';
  params: Record<string, unknown>;
}

export interface GeneratedQuestion {
  question: string;
  question_type: QuestionType;
  options: string[];       // empty [] for integer type
  correct_answer: string;  // "B" for mcq_single | "A,C" sorted for mcq_multi | "42" for integer
  answer_explanation: string;
  diagram?: DiagramTemplate | null;
}

// Topics split by which NCERT class introduces them
export const JEE_TOPICS_BY_CLASS: Record<string, { class11: string[]; class12: string[] }> = {
  Mathematics: {
    class11: [
      'Sets',
      'Relations and Functions',
      'Trigonometric Functions',
      'Principle of Mathematical Induction',
      'Complex Numbers',
      'Quadratic Equations',
      'Linear Inequalities',
      'Permutations and Combinations',
      'Binomial Theorem',
      'Sequences and Series',
      'Straight Lines',
      'Circles',
      'Conic Sections',
      'Introduction to 3D Geometry',
      'Limits and Derivatives',
      'Statistics',
      'Probability',
    ],
    class12: [
      'Relations and Functions (Advanced)',
      'Inverse Trigonometric Functions',
      'Matrices',
      'Determinants',
      'Continuity and Differentiability',
      'Applications of Derivatives',
      'Indefinite Integration',
      'Definite Integration',
      'Applications of Integrals',
      'Differential Equations',
      'Vectors',
      'Three Dimensional Geometry',
      'Linear Programming',
      'Probability (Bayes and Random Variables)',
    ],
  },
  Physics: {
    class11: [
      'Units and Dimensions',
      'Kinematics',
      'Laws of Motion',
      'Friction',
      'Work Energy and Power',
      'System of Particles',
      'Rotational Motion',
      'Gravitation',
      'Elasticity',
      'Fluid Mechanics',
      'Thermal Properties of Matter',
      'Thermodynamics',
      'Kinetic Theory of Gases',
      'Simple Harmonic Motion',
      'Waves',
    ],
    class12: [
      'Electrostatics',
      'Electric Potential and Capacitance',
      'Current Electricity',
      'Moving Charges and Magnetism',
      'Magnetism and Matter',
      'Electromagnetic Induction',
      'Alternating Current',
      'Electromagnetic Waves',
      'Ray Optics',
      'Wave Optics',
      'Dual Nature of Radiation',
      'Atoms and Nuclei',
      'Semiconductor Devices',
      'Communication Systems',
    ],
  },
  Chemistry: {
    class11: [
      'Mole Concept and Stoichiometry',
      'Atomic Structure',
      'Periodic Table and Periodicity',
      'Chemical Bonding',
      'States of Matter',
      'Chemical Thermodynamics',
      'Chemical Equilibrium',
      'Ionic Equilibrium',
      'Redox Reactions',
      'Hydrogen',
      's-Block Elements',
      'p-Block Elements Group 13 and 14',
      'Organic Chemistry Basics',
      'Hydrocarbons',
      'Environmental Chemistry',
    ],
    class12: [
      'Solid State',
      'Solutions',
      'Electrochemistry',
      'Chemical Kinetics',
      'Surface Chemistry',
      'General Principles of Metallurgy',
      'p-Block Elements Group 15 to 18',
      'Transition Metals and d-Block',
      'Coordination Compounds',
      'Haloalkanes and Haloarenes',
      'Alcohols Phenols and Ethers',
      'Aldehydes and Ketones',
      'Carboxylic Acids and Derivatives',
      'Amines',
      'Biomolecules',
      'Polymers',
    ],
  },
};

// Returns topics the student is allowed to practice
export function getTopicsForClass(subject: Subject, studentClass: StudentClass): string[] {
  const map = JEE_TOPICS_BY_CLASS[subject];
  if (!map) return [];
  if (studentClass === '11') return [...map.class11];
  return [...map.class11, ...map.class12]; // Class 12 and Droppers get full syllabus
}

// Flat union of all topics — used for backend validation
export const JEE_TOPICS: Record<string, string[]> = {
  Mathematics: [
    ...JEE_TOPICS_BY_CLASS.Mathematics.class11,
    ...JEE_TOPICS_BY_CLASS.Mathematics.class12,
  ],
  Physics: [
    ...JEE_TOPICS_BY_CLASS.Physics.class11,
    ...JEE_TOPICS_BY_CLASS.Physics.class12,
  ],
  Chemistry: [
    ...JEE_TOPICS_BY_CLASS.Chemistry.class11,
    ...JEE_TOPICS_BY_CLASS.Chemistry.class12,
  ],
};

// NEET topics split by NCERT class (NMC Rationalized Syllabus 2024-2026)
export const NEET_TOPICS_BY_CLASS: Record<string, { class11: string[]; class12: string[] }> = {
  Physics: {
    class11: [
      'Units and Measurements', 'Motion in a Straight Line', 'Motion in a Plane',
      'Laws of Motion', 'Work, Energy, and Power', 'System of Particles and Rotational Motion',
      'Gravitation', 'Mechanical Properties of Solids', 'Mechanical Properties of Fluids',
      'Thermal Properties of Matter', 'Thermodynamics', 'Kinetic Theory of Gases',
      'Oscillations', 'Waves',
    ],
    class12: [
      'Electrostatics', 'Current Electricity', 'Moving Charges and Magnetism',
      'Electromagnetic Induction and Alternating Currents', 'Electromagnetic Waves',
      'Ray Optics and Optical Instruments', 'Wave Optics',
      'Dual Nature of Radiation and Matter', 'Atoms and Nuclei',
      'Semiconductor Electronics', 'Experimental Skills in Physics',
    ],
  },
  Chemistry: {
    class11: [
      'Some Basic Concepts of Chemistry', 'Structure of Atom',
      'Classification of Elements and Periodicity in Properties',
      'Chemical Bonding and Molecular Structure', 'Chemical Thermodynamics',
      'Equilibrium', 'Redox Reactions',
      'Organic Chemistry - Some Basic Principles and Techniques', 'Hydrocarbons',
    ],
    class12: [
      'Solutions', 'Electrochemistry', 'Chemical Kinetics',
      'The p-Block Elements', 'The d- and f-Block Elements', 'Coordination Compounds',
      'Haloalkanes and Haloarenes', 'Alcohols, Phenols and Ethers',
      'Aldehydes, Ketones and Carboxylic Acids', 'Amines', 'Biomolecules',
      'Principles Related to Practical Chemistry',
    ],
  },
  Botany: {
    class11: [
      'The Living World', 'Biological Classification', 'Plant Kingdom',
      'Morphology of Flowering Plants', 'Anatomy of Flowering Plants',
      'Cell: The Unit of Life', 'Biomolecules (Botany)', 'Cell Cycle and Cell Division',
      'Photosynthesis in Higher Plants', 'Respiration in Plants', 'Plant Growth and Development',
    ],
    class12: [
      'Sexual Reproduction in Flowering Plants', 'Principles of Inheritance and Variation',
      'Molecular Basis of Inheritance', 'Microbes in Human Welfare',
      'Biotechnology: Principles and Processes', 'Biotechnology and its Applications',
      'Organisms and Populations', 'Ecosystem', 'Biodiversity and Conservation',
    ],
  },
  Zoology: {
    class11: [
      'Animal Kingdom', 'Structural Organisation in Animals',
      'Breathing and Exchange of Gases', 'Body Fluids and Circulation',
      'Excretory Products and their Elimination', 'Locomotion and Movement',
      'Neural Control and Coordination', 'Chemical Coordination and Integration',
    ],
    class12: [
      'Human Reproduction', 'Reproductive Health', 'Evolution',
      'Human Health and Disease',
    ],
  },
};

// Flat NEET topics per subject
export const NEET_TOPICS: Record<string, string[]> = {
  Physics: [
    ...NEET_TOPICS_BY_CLASS.Physics.class11,
    ...NEET_TOPICS_BY_CLASS.Physics.class12,
  ],
  Chemistry: [
    ...NEET_TOPICS_BY_CLASS.Chemistry.class11,
    ...NEET_TOPICS_BY_CLASS.Chemistry.class12,
  ],
  Botany: [
    ...NEET_TOPICS_BY_CLASS.Botany.class11,
    ...NEET_TOPICS_BY_CLASS.Botany.class12,
  ],
  Zoology: [
    ...NEET_TOPICS_BY_CLASS.Zoology.class11,
    ...NEET_TOPICS_BY_CLASS.Zoology.class12,
  ],
};
