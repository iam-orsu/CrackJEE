'use client';

import React from 'react';
import type { DiagramTemplate } from '@/types';
import { CapacitorField, CoordGeometry, EnergyProfile, ProjectileMotion, PulleySystem, PvDiagram, WaveDiagram } from './diagrams/mixed-templates';
import { DiagramErrorBoundary, ArgandPlane, CircleGeom, ConicSection, CrystalStruct, ElectrochemCell, MoDiagram, MolecGeometry, OrganicStruct, TriangleDiagram } from './diagrams/math-chem-templates';
import type { ArgandPlaneParams, CapacitorFieldParams, CircleGeomParams, ConicSectionParams, CoordGeometryParams, CrystalStructParams, ElectrochemCellParams, EnergyProfileParams, InclinedPlaneParams, LensMirrorParams, MoDiagramParams, MolecGeometryParams, OrganicStructParams, ProjectileMotionParams, PulleySystemParams, PvDiagramParams, SimpleCircuitParams, TriangleParams, WaveDiagramParams } from './diagrams/types';
import { InclinedPlane, LensMirror, SimpleCircuit } from './diagrams/physics-templates';

/* ── Main component ─────────────────────────────────────────── */
interface Props {
  descriptor: DiagramTemplate;
}

export function DiagramRenderer({ descriptor }: Props) {
  if (!descriptor?.template) return null;
  const { template, params } = descriptor;

  let inner: React.ReactNode = null;
  switch (template) {
    case 'inclined_plane':       inner = <InclinedPlane p={params as InclinedPlaneParams} />;        break;
    case 'simple_circuit':       inner = <SimpleCircuit p={params as SimpleCircuitParams} />;        break;
    case 'lens_mirror':          inner = <LensMirror p={params as LensMirrorParams} />;              break;
    case 'energy_profile':       inner = <EnergyProfile p={params as EnergyProfileParams} />;        break;
    case 'coordinate_geometry':  inner = <CoordGeometry p={params as CoordGeometryParams} />;        break;
    case 'projectile_motion':    inner = <ProjectileMotion p={params as ProjectileMotionParams} />;  break;
    case 'pulley_system':        inner = <PulleySystem p={params as PulleySystemParams} />;          break;
    case 'wave_diagram':         inner = <WaveDiagram p={params as WaveDiagramParams} />;            break;
    case 'capacitor_field':      inner = <CapacitorField p={params as CapacitorFieldParams} />;      break;
    case 'pv_diagram':           inner = <PvDiagram p={params as PvDiagramParams} />;                break;
    case 'triangle':             inner = <TriangleDiagram p={params as TriangleParams} />;           break;
    case 'circle_geometry':      inner = <CircleGeom p={params as CircleGeomParams} />;              break;
    case 'conic_section':        inner = <ConicSection p={params as ConicSectionParams} />;          break;
    case 'argand_plane':         inner = <ArgandPlane p={params as ArgandPlaneParams} />;            break;
    case 'molecular_geometry':   inner = <MolecGeometry p={params as MolecGeometryParams} />;        break;
    case 'mo_diagram':           inner = <MoDiagram p={params as MoDiagramParams} />;                break;
    case 'crystal_structure':    inner = <CrystalStruct p={params as CrystalStructParams} />;        break;
    case 'electrochemical_cell': inner = <ElectrochemCell p={params as ElectrochemCellParams} />;    break;
    case 'organic_structure':    inner = <OrganicStruct p={params as OrganicStructParams} />;        break;
    default: return null;
  }

  return (
    <DiagramErrorBoundary>
      <div style={{
        width: '100%',
        background: '#fafafa',
        border: '1px solid var(--gray-200)',
        borderRadius: 8,
        marginBottom: 16,
        padding: '12px 16px 8px',
      }}>
        {inner}
      </div>
    </DiagramErrorBoundary>
  );
}
