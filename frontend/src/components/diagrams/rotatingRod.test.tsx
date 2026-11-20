import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { DiagramRenderer } from '../DiagramRenderer';

describe('RotatingRod & DiagramRenderer rotational motion handling', () => {
  it('renders rotating_rod directly with accurate physical parameters and labels', () => {
    const html = renderToStaticMarkup(
      <DiagramRenderer
        descriptor={{
          template: 'rotating_rod',
          params: {
            m1: 3,
            m2: 1,
            length: 4,
            omega: 2,
            pivot: 'cm',
          },
        }}
      />
    );

    expect(html).toContain('3 kg');
    expect(html).toContain('1 kg');
    expect(html).toContain('CM');
    expect(html).toContain('ω = 2 rad/s');
    expect(html).toContain('r₁ = 1 m');
    expect(html).toContain('r₂ = 3 m');
    expect(html).toContain('Total rod length L = 4 m');
    expect(html).toContain('Axis (⊥ rod)');
  });

  it('auto-detects rotating rod about center of mass when circle_geometry is erroneously assigned', () => {
    const questionText =
      'Two small blocks of masses 3 kg and 1 kg are fixed at the two ends of a light rigid rod of length 4 m. The system is set into rotation about an axis through its centre of mass and perpendicular to the rod, with angular speed 2 rad s^-1. The total kinetic energy of the system is:';

    const html = renderToStaticMarkup(
      <DiagramRenderer
        descriptor={{
          template: 'circle_geometry',
          params: {
            subtype: 'single',
            cx: 190,
            cy: 120,
            r: 80,
            labels: {
              center: 'CM',
              radius: 'rod, L = 4 m',
            },
            points: [
              { x: 110, y: 120, label: '3 kg' },
              { x: 270, y: 120, label: '1 kg' },
            ],
          },
        }}
        context={{
          topic: 'Rotational Motion',
          questionText,
        }}
      />
    );

    // Should have intercepted and rendered RotatingRod
    expect(html).toContain('3 kg');
    expect(html).toContain('1 kg');
    expect(html).toContain('CM');
    expect(html).toContain('r₁ = 1 m');
    expect(html).toContain('r₂ = 3 m');
    expect(html).toContain('Total rod length L = 4 m');
    // Ensure the colliding unreadable string is NOT present
    expect(html).not.toContain('CM, rod, L = 4 m');
  });

  it('renders standard circle_geometry without overlapping center and radius labels', () => {
    const html = renderToStaticMarkup(
      <DiagramRenderer
        descriptor={{
          template: 'circle_geometry',
          params: {
            subtype: 'single',
            cx1: 190,
            cy1: 120,
            r1: 80,
            labels: {
              center: 'O',
              radius: 'r = 5 cm',
            },
          },
        }}
        context={{
          topic: 'Circles',
          questionText: 'Find the area of circle with center O and radius 5 cm.',
        }}
      />
    );

    expect(html).toContain('r = 5 cm');
    expect(html).toContain('O');
    // Center label is positioned with textAnchor="end" and offset from radius line
    expect(html).toContain('text-anchor="end"');
  });
});
