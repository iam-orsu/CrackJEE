import React from 'react';

/* ── Template param interfaces ──────────────────────────────── */
export interface InclinedPlaneParams {
  angle_deg?: number;
  show_weight?: boolean;
  show_normal?: boolean;
  show_friction?: boolean;
  show_applied?: boolean;
  labels?: Record<string, string>;
}

export interface CircuitComponent { type: string; label?: string; }
export interface SimpleCircuitParams {
  topology?: 'series' | 'parallel';
  components?: CircuitComponent[];
}

export interface LensMirrorParams {
  type?: 'convex_lens' | 'concave_lens' | 'concave_mirror' | 'convex_mirror';
  focal_length?: number;
  object_distance?: number;
  show_rays?: boolean;
  labels?: Record<string, string>;
}

export interface EnergyProfileParams {
  reactant_label?: string;
  product_label?: string;
  exothermic?: boolean;
  labels?: Record<string, string>;
}

export interface CoordPoint { x: number; y: number; label?: string; }
export interface CoordLine { from: [number, number]; to: [number, number]; label?: string; dashed?: boolean; arrow?: boolean; }
export interface CoordCircleSpec { cx: number; cy: number; r: number; label?: string; }
export interface CoordGeometryParams {
  x_range?: [number, number];
  y_range?: [number, number];
  points?: CoordPoint[];
  lines?: CoordLine[];
  circles?: CoordCircleSpec[];
}

export interface ProjectileMotionParams {
  angle_deg?: number;
  show_components?: boolean;
  labels?: Record<string, string>;
}

export interface PulleyMass { value?: string; }
export interface PulleySystemParams {
  type?: string;
  masses?: PulleyMass[];
  labels?: Record<string, string>;
}

export interface WaveDiagramParams {
  type?: 'transverse' | 'standing';
  num_cycles?: number;
  labels?: Record<string, string>;
}

export interface CapacitorFieldParams {
  num_field_lines?: number;
  show_battery?: boolean;
  labels?: Record<string, string>;
}

export interface PvDiagramParams {
  process?: 'isothermal' | 'adiabatic' | 'isobaric' | 'isochoric' | 'carnot';
  labels?: Record<string, string>;
}

export interface TriangleParams {
  angles?: { A?: number; B?: number; C?: number };
  angle_A?: number;
  angle_B?: number;
  angle_C?: number;
  labels?: Record<string, string>;
  show_incircle?: boolean;
  show_circumcircle?: boolean;
}

export interface CircleChord { x1?: number; y1?: number; x2?: number; y2?: number; label?: string; }
export interface CirclePointSpec { x: number; y: number; label?: string; }
export interface CircleGeomParams {
  subtype?: 'single' | 'two_circles' | 'tangent_from_point';
  cx?: number; cy?: number; r?: number;
  cx1?: number; cy1?: number; r1?: number;
  cx2?: number; cy2?: number; r2?: number;
  point_x?: number; point_y?: number;
  labels?: Record<string, string>;
  points?: CirclePointSpec[];
  chord?: CircleChord;
}

export interface ConicSectionParams {
  type?: 'parabola' | 'ellipse' | 'hyperbola';
  a?: number;
  b?: number;
  show_focus?: boolean;
  show_directrix?: boolean;
  show_asymptotes?: boolean;
  labels?: Record<string, string>;
}

export interface ArgandPoint { re: number; im: number; label?: string; show_modulus?: boolean; show_argument?: boolean; }
export interface ArgandPlaneParams {
  points?: ArgandPoint[];
}

export interface MolecLigand { label?: string; }
export interface MolecGeometryParams {
  shape?: 'linear' | 'bent' | 'trigonal_planar' | 'tetrahedral' | 'octahedral' | 'trigonal_bipyramidal';
  central_atom?: string;
  ligands?: MolecLigand[];
  bond_angle?: number;
  labels?: Record<string, string>;
}

export interface MoDiagramParams {
  molecule?: string;
  valence_electrons?: number;
}

export interface CrystalStructParams {
  type?: 'scc' | 'bcc' | 'fcc' | 'nacl';
  labels?: Record<string, string>;
}

export interface ElectrodeSpec { metal?: string; electrolyte?: string; }
export interface ElectrochemCellParams {
  anode?: ElectrodeSpec;
  cathode?: ElectrodeSpec;
  emf?: string;
  labels?: Record<string, string>;
}

export interface OrganicStructParams {
  smiles?: string;
  label?: string;
}

