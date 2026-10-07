import type { Request } from 'express';

export type Subject = 'Mathematics' | 'Physics' | 'Chemistry';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type ExamType = 'Main' | 'Advanced' | 'Both';
export type StudentClass = '11' | '12' | 'Dropper';

export interface AuthPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

// Template-based diagram: DeepSeek picks a template + named params.
// The frontend computes all geometry from params — no raw coordinates.
export interface DiagramTemplate {
  template: 'inclined_plane' | 'simple_circuit' | 'lens_mirror' | 'energy_profile' | 'coordinate_geometry'
    | 'projectile_motion' | 'pulley_system' | 'wave_diagram' | 'capacitor_field' | 'pv_diagram';
  params: Record<string, unknown>;
}

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  answer_explanation: string;
  diagram?: DiagramTemplate | null;
}

// Topics split by which NCERT class introduces them
export const JEE_TOPICS_BY_CLASS: Record<Subject, { class11: string[]; class12: string[] }> = {
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
  if (studentClass === '11') return [...map.class11];
  return [...map.class11, ...map.class12]; // Class 12 and Droppers get full syllabus
}

// Flat union of all topics — used for backend validation
export const JEE_TOPICS: Record<Subject, string[]> = {
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
