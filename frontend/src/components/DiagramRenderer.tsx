'use client';

import React from 'react';
import type { DiagramTemplate } from '@/types';
import { CapacitorField, CoordGeometry, EnergyProfile, ProjectileMotion, PulleySystem, PvDiagram, WaveDiagram } from './diagrams/mixed-templates';
import { DiagramErrorBoundary, ArgandPlane, CircleGeom, ConicSection, CrystalStruct, ElectrochemCell, MoDiagram, MolecGeometry, OrganicStruct, TriangleDiagram } from './diagrams/math-chem-templates';
import type { ArgandPlaneParams, CapacitorFieldParams, CircleGeomParams, ConicSectionParams, CoordGeometryParams, CrystalStructParams, ElectrochemCellParams, EnergyProfileParams, InclinedPlaneParams, LensMirrorParams, MoDiagramParams, MolecGeometryParams, OrganicStructParams, ProjectileMotionParams, PulleySystemParams, PvDiagramParams, RotatingRodParams, SatelliteOrbitsParams, SimpleCircuitParams, TriangleParams, WaveDiagramParams } from './diagrams/types';
import { InclinedPlane, LensMirror, RotatingRod, SatelliteOrbits, SimpleCircuit } from './diagrams/physics-templates';

/* ── Main component ─────────────────────────────────────────── */
interface Props {
  descriptor: DiagramTemplate;
  context?: { topic?: string; questionText?: string };
}

export function DiagramRenderer({ descriptor, context }: Props) {
  if (!descriptor?.template) return null;
  let { template, params } = descriptor;

  // Auto-detect satellite / gravitation orbit context if circle_geometry was assigned
  if (
    template === 'circle_geometry' &&
    context &&
    (context.topic === 'Gravitation' || /satellite|circular orbit|planetary orbit/i.test(context.questionText || ''))
  ) {
    template = 'satellite_orbits';
    params = {
      central_body: 'Earth',
      r1: 65,
      r2: 102,
      labels: {
        body: 'Earth',
        r1: 'r₁ = 8,000 km',
        r2: 'r₂ = 12,800 km',
        s1: 'Orbit 1 (h₁ = 1600 km)',
        s2: 'Orbit 2 (h₂ = 6400 km)',
      },
      ...((params as Record<string, unknown>) || {}),
    };
  }

  // Auto-detect projectile launched from a tower / cliff / building / elevation
  if (
    template === 'projectile_motion' &&
    context &&
    /tower|cliff|building|roof|top of a|base of the|foot of the/i.test(context.questionText || '')
  ) {
    const existingParams = (params as Record<string, unknown>) || {};
    const existingLabels = ((existingParams.labels as Record<string, string>) || {});
    params = {
      ...existingParams,
      from_tower: true,
      tower_height: existingLabels.tower_height || existingLabels.height || 'h',
      labels: {
        v0: 'u = 20 m/s',
        angle: '30°',
        range: '40 m',
        tower_height: 'h',
        height: 'h',
        ...existingLabels,
      },
    };
  }

  // Auto-detect rotating rod / center of mass rotational motion if circle_geometry or generic template was assigned
  const qText = context?.questionText || '';
  const currentParams = (params as Record<string, unknown>) || {};
  const currentLabels = (currentParams.labels as Record<string, string>) || {};
  const currentPoints = (currentParams.points as Array<{ label?: string }>) || [];

  const isRotationalRodContext =
    template === 'rotating_rod' ||
    ((template === 'circle_geometry' || template === 'coordinate_geometry') &&
      (context?.topic === 'Rotational Motion' ||
        /rigid rod|centre of mass|center of mass|rotation about.*axis|rotat(?:ing|ion).*rod|blocks of masses.*rod|fixed at the.*ends.*rod|moment of inertia.*rod/i.test(qText) ||
        currentLabels.center === 'CM' ||
        /rod/i.test(currentLabels.radius || '') ||
        currentPoints.some((pt) => /kg|mass/i.test(pt.label || ''))));

  if (isRotationalRodContext) {
    template = 'rotating_rod';

    // Parse m1 and m2
    let m1Val: number | string = (currentParams.m1 as (number | string)) || 3;
    let m2Val: number | string = (currentParams.m2 as (number | string)) || 1;
    const massMatch =
      qText.match(/masses\s+([0-9]+(?:\.[0-9]+)?)\s*(?:kg|g)?\s*(?:and|&|,)\s*([0-9]+(?:\.[0-9]+)?)\s*(?:kg|g)?/i) ||
      qText.match(/([0-9]+(?:\.[0-9]+)?)\s*kg\s*(?:and|&|,)\s*([0-9]+(?:\.[0-9]+)?)\s*kg/i);
    if (massMatch) {
      m1Val = parseFloat(massMatch[1]);
      m2Val = parseFloat(massMatch[2]);
    } else if (currentPoints.length >= 2) {
      const p1m = currentPoints[0]?.label?.match(/([0-9]+(?:\.[0-9]+)?)/);
      const p2m = currentPoints[1]?.label?.match(/([0-9]+(?:\.[0-9]+)?)/);
      if (p1m) m1Val = parseFloat(p1m[1]);
      if (p2m) m2Val = parseFloat(p2m[1]);
    }

    // Parse length L
    let lengthVal: number | string = (currentParams.length as (number | string)) || 4;
    const lenMatch =
      qText.match(/(?:rod of length|length)\s+([0-9]+(?:\.[0-9]+)?)\s*(?:m|cm|meters)?/i) ||
      currentLabels.radius?.match(/L\s*=\s*([0-9]+(?:\.[0-9]+)?)/i) ||
      qText.match(/L\s*=\s*([0-9]+(?:\.[0-9]+)?)/i);
    if (lenMatch) {
      lengthVal = parseFloat(lenMatch[1]);
    }

    // Parse omega
    let omegaVal: number | string = (currentParams.omega as (number | string)) || 2;
    const omegaMatch =
      qText.match(/angular (?:speed|velocity)\s+([0-9]+(?:\.[0-9]+)?)/i) ||
      qText.match(/([0-9]+(?:\.[0-9]+)?)\s*rad\s*s\^?-1/i) ||
      qText.match(/([0-9]+(?:\.[0-9]+)?)\s*rad\/s/i);
    if (omegaMatch) {
      omegaVal = parseFloat(omegaMatch[1]);
    }

    // Parse pivot
    let pivotVal: 'cm' | 'end' | 'midpoint' = (currentParams.pivot as ('cm' | 'end' | 'midpoint')) || 'cm';
    if (/pivot.*one end|about.*one end|hinged at.*end/i.test(qText)) {
      pivotVal = 'end';
    } else if (/midpoint|geometric center/i.test(qText)) {
      pivotVal = 'midpoint';
    }

    const n1 = typeof m1Val === 'number' ? m1Val : 3;
    const n2 = typeof m2Val === 'number' ? m2Val : 1;
    const L = typeof lengthVal === 'number' ? lengthVal : 4;
    const r1 = +((n2 / (n1 + n2)) * L).toFixed(2);
    const r2 = +((n1 / (n1 + n2)) * L).toFixed(2);

    const cleanLabels = { ...currentLabels };
    delete cleanLabels.center;
    delete cleanLabels.radius;

    params = {
      ...currentParams,
      m1: m1Val,
      m2: m2Val,
      length: lengthVal,
      omega: omegaVal,
      pivot: pivotVal,
      labels: {
        ...cleanLabels,
        m1: cleanLabels.m1 || `${m1Val} kg`,
        m2: cleanLabels.m2 || `${m2Val} kg`,
        omega: cleanLabels.omega || `ω = ${omegaVal} rad/s`,
        length: cleanLabels.length || `Total rod length L = ${lengthVal} m`,
        r1: cleanLabels.r1 || `r₁ = ${r1} m`,
        r2: cleanLabels.r2 || `r₂ = ${r2} m`,
        pivot: cleanLabels.pivot || (pivotVal === 'cm' ? 'CM' : 'Pivot'),
      },
    };
  }

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
    case 'satellite_orbits':     inner = <SatelliteOrbits p={params as SatelliteOrbitsParams} />;    break;
    case 'rotating_rod':         inner = <RotatingRod p={params as RotatingRodParams} />;            break;
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
