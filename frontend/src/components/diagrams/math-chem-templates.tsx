import React from 'react';
import { Arr, latexToPlain } from './helpers';
import type { ArgandPlaneParams, CircleGeomParams, ConicSectionParams, CrystalStructParams, ElectrochemCellParams, MoDiagramParams, MolecGeometryParams, OrganicStructParams, TriangleParams } from './types';

/* ── TEMPLATE 11: Triangle ───────────────────────────────────── */
export function TriangleDiagram({ p }: { p: TriangleParams }) {
  const lbl = p.labels ?? {};
  let Adeg = +(p.angles?.A ?? p.angle_A ?? 60);
  let Bdeg = +(p.angles?.B ?? p.angle_B ?? 60);
  let Cdeg = +(p.angles?.C ?? p.angle_C ?? 60);
  const tot = Adeg + Bdeg + Cdeg;
  Adeg = (Adeg / tot) * 180; Bdeg = (Bdeg / tot) * 180; Cdeg = (Cdeg / tot) * 180;
  const Ar = Adeg * Math.PI / 180, Br = Bdeg * Math.PI / 180;

  // side lengths (law of sines, base BC = 1): c = AB opposite C, b = AC opposite B
  const sideC = Math.sin(Cdeg * Math.PI / 180) / Math.sin(Ar);
  const sideB = Math.sin(Bdeg * Math.PI / 180) / Math.sin(Ar);

  // vertices in math-coords (y up): B at origin, C at (1,0), A from angle at B
  const Bm: [number, number] = [0, 0];
  const Cm: [number, number] = [1, 0];
  const Am: [number, number] = [sideC * Math.cos(Br), sideC * Math.sin(Br)];

  const allX = [Am[0], 0, 1], allY = [Am[1], 0, 0];
  const mnX = Math.min(...allX), mxX = Math.max(...allX);
  const mnY = Math.min(...allY), mxY = Math.max(...allY);
  const VW = 400, VH = 240, PAD = 52;
  const sc = Math.min((VW - 2 * PAD) / (mxX - mnX || 1), (VH - 2 * PAD) / (mxY - mnY || 1));

  const sv = ([mx, my]: [number, number]): [number, number] => [
    PAD + (mx - mnX) * sc, VH - PAD - (my - mnY) * sc,
  ];
  const [Ax, Ay] = sv(Am), [Bx, By] = sv(Bm), [Cx, Cy] = sv(Cm);
  const A: [number, number] = [Ax, Ay], B: [number, number] = [Bx, By], C: [number, number] = [Cx, Cy];

  // incircle: incenter weighted by opposite sides
  const perim = 1 + sideB + sideC;
  const Ix = (1 * Ax + sideB * Bx + sideC * Cx) / perim;
  const Iy = (1 * Ay + sideB * By + sideC * Cy) / perim;
  const area = 0.5 * Math.abs((Bx - Ax) * (Cy - Ay) - (Cx - Ax) * (By - Ay));
  const inR  = area / (perim * sc / 2);

  // circumcircle
  const D2 = 2 * (Ax * (By - Cy) + Bx * (Cy - Ay) + Cx * (Ay - By));
  const A2 = Ax**2 + Ay**2, B2 = Bx**2 + By**2, C2 = Cx**2 + Cy**2;
  const ccX = D2 ? (A2*(By-Cy) + B2*(Cy-Ay) + C2*(Ay-By)) / D2 : (Ax+Bx+Cx)/3;
  const ccY = D2 ? (A2*(Cx-Bx) + B2*(Ax-Cx) + C2*(Bx-Ax)) / D2 : (Ay+By+Cy)/3;
  const ccR = Math.sqrt((ccX - Bx)**2 + (ccY - By)**2);

  const arcR = 18;
  function arcD(V: [number,number], P1: [number,number], P2: [number,number]) {
    const a1 = Math.atan2(P1[1]-V[1], P1[0]-V[0]);
    const a2 = Math.atan2(P2[1]-V[1], P2[0]-V[0]);
    let d = ((a2 - a1) + 2*Math.PI) % (2*Math.PI);
    if (d > Math.PI) d -= 2*Math.PI;
    return `M ${(V[0]+arcR*Math.cos(a1)).toFixed(1)},${(V[1]+arcR*Math.sin(a1)).toFixed(1)} A ${arcR},${arcR} 0 0,${d>0?1:0} ${(V[0]+arcR*Math.cos(a2)).toFixed(1)},${(V[1]+arcR*Math.sin(a2)).toFixed(1)}`;
  }
  function angLblPos(V: [number,number], P1: [number,number], P2: [number,number], r: number): [number,number] {
    const a1 = Math.atan2(P1[1]-V[1], P1[0]-V[0]);
    const a2 = Math.atan2(P2[1]-V[1], P2[0]-V[0]);
    let d = ((a2-a1)+2*Math.PI)%(2*Math.PI); if(d>Math.PI) d-=2*Math.PI;
    const mid = a1 + d/2; return [V[0]+r*Math.cos(mid), V[1]+r*Math.sin(mid)];
  }
  const [alx,aly] = angLblPos(A,B,C,arcR+13);
  const [blx,bly] = angLblPos(B,A,C,arcR+13);
  const [clx,cly] = angLblPos(C,A,B,arcR+13);

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      {p.show_circumcircle && <circle cx={ccX} cy={ccY} r={ccR} fill="none" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="5,3"/>}
      <polygon points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`} fill="rgba(99,102,241,0.05)" stroke="#6366f1" strokeWidth="2"/>
      {p.show_incircle && <circle cx={Ix} cy={Iy} r={inR} fill="none" stroke="#16a34a" strokeWidth="1.2" strokeDasharray="4,2"/>}
      <path d={arcD(A,B,C)} fill="none" stroke="#6366f1" strokeWidth="1.2"/>
      <path d={arcD(B,A,C)} fill="none" stroke="#6366f1" strokeWidth="1.2"/>
      <path d={arcD(C,A,B)} fill="none" stroke="#6366f1" strokeWidth="1.2"/>
      <text x={alx} y={aly} fill="#4f46e5" fontSize="11" fontWeight="600" textAnchor="middle" dominantBaseline="middle">{latexToPlain(lbl.A ?? `${Math.round(Adeg)}°`)}</text>
      <text x={blx} y={bly} fill="#4f46e5" fontSize="11" fontWeight="600" textAnchor="middle" dominantBaseline="middle">{latexToPlain(lbl.B ?? `${Math.round(Bdeg)}°`)}</text>
      <text x={clx} y={cly} fill="#4f46e5" fontSize="11" fontWeight="600" textAnchor="middle" dominantBaseline="middle">{latexToPlain(lbl.C ?? `${Math.round(Cdeg)}°`)}</text>
      <text x={Ax} y={Ay-14} fill="#374151" fontSize="13" fontWeight="700" textAnchor="middle">{lbl.vertex_A ?? 'A'}</text>
      <text x={Bx-16} y={By+6} fill="#374151" fontSize="13" fontWeight="700" textAnchor="middle">{lbl.vertex_B ?? 'B'}</text>
      <text x={Cx+16} y={Cy+6} fill="#374151" fontSize="13" fontWeight="700" textAnchor="middle">{lbl.vertex_C ?? 'C'}</text>
      {lbl.a && <text x={(Bx+Cx)/2} y={(By+Cy)/2+16} fill="#374151" fontSize="12" textAnchor="middle">{latexToPlain(lbl.a)}</text>}
      {lbl.b && <text x={(Ax+Cx)/2+12} y={(Ay+Cy)/2} fill="#374151" fontSize="12" textAnchor="start">{latexToPlain(lbl.b)}</text>}
      {lbl.c && <text x={(Ax+Bx)/2-12} y={(Ay+By)/2} fill="#374151" fontSize="12" textAnchor="end">{latexToPlain(lbl.c)}</text>}
      {p.show_circumcircle && <circle cx={ccX} cy={ccY} r="3" fill="#dc2626"/>}
      {p.show_incircle && <circle cx={Ix} cy={Iy} r="3" fill="#16a34a"/>}
    </svg>
  );
}

/* ── TEMPLATE 12: Circle Geometry ────────────────────────────── */
export function CircleGeom({ p }: { p: CircleGeomParams }) {
  const lbl = p.labels ?? {};
  const sub = (p.subtype ?? 'single').toLowerCase().replace(/[-\s]/g, '_');
  const VW = 380, VH = 240;
  const cx1 = +(p.cx ?? p.cx1 ?? 190), cy1 = +(p.cy ?? p.cy1 ?? 120), r1 = +(p.r ?? p.r1 ?? 80);

  if (sub === 'two_circles') {
    const cx2 = +(p.cx2 ?? cx1 + r1 + 50), cy2 = +(p.cy2 ?? cy1), r2 = +(p.r2 ?? 55);
    const rawMinX = Math.min(cx1-r1, cx2-r2), rawMaxX = Math.max(cx1+r1, cx2+r2);
    const rawMinY = Math.min(cy1-r1, cy2-r2), rawMaxY = Math.max(cy1+r1, cy2+r2);
    // Proportional padding (18% of range) so small math-unit circles still fill the viewport
    const pad = Math.max(rawMaxX-rawMinX, rawMaxY-rawMinY, 1) * 0.18;
    const mnX = rawMinX-pad, mxX = rawMaxX+pad, mnY = rawMinY-pad, mxY = rawMaxY+pad;
    const sc2 = Math.min(VW/(mxX-mnX), VH/(mxY-mnY));
    const tx = (x: number) => (x-mnX)*sc2;
    // Flip y-axis: higher math-y should appear higher on screen
    const ty = (y: number) => VH - (y-mnY)*sc2;
    return (
      <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
        <circle cx={tx(cx1)} cy={ty(cy1)} r={r1*sc2} fill="rgba(99,102,241,0.06)" stroke="#6366f1" strokeWidth="1.8"/>
        <circle cx={tx(cx2)} cy={ty(cy2)} r={r2*sc2} fill="rgba(37,99,235,0.06)" stroke="#2563eb" strokeWidth="1.8"/>
        {lbl.r1 && <><line x1={tx(cx1)} y1={ty(cy1)} x2={tx(cx1+r1)} y2={ty(cy1)} stroke="#6366f1" strokeWidth="1" strokeDasharray="3,2"/>
          <text x={tx(cx1+r1/2)} y={ty(cy1)+14} fill="#6366f1" fontSize="11" textAnchor="middle">{lbl.r1}</text></>}
        {lbl.r2 && <><line x1={tx(cx2)} y1={ty(cy2)} x2={tx(cx2+r2)} y2={ty(cy2)} stroke="#2563eb" strokeWidth="1" strokeDasharray="3,2"/>
          <text x={tx(cx2+r2/2)} y={ty(cy2)+14} fill="#2563eb" fontSize="11" textAnchor="middle">{lbl.r2}</text></>}
        {/* Labels placed above each circle so long equation strings don't overlap the circles */}
        {lbl.c1 && <text x={tx(cx1)} y={ty(cy1+r1)-10} fill="#6366f1" fontSize="11" fontWeight="600" textAnchor="middle">{latexToPlain(lbl.c1)}</text>}
        {lbl.c2 && <text x={tx(cx2)} y={Math.min(ty(cy2+r2)-10, VH-8)} fill="#2563eb" fontSize="11" fontWeight="600" textAnchor="middle">{latexToPlain(lbl.c2)}</text>}
      </svg>
    );
  }

  if (sub === 'tangent_from_point') {
    let px = +(p.point_x ?? cx1 + r1 + 70), py = +(p.point_y ?? cy1);
    let dist = Math.sqrt((px-cx1)**2 + (py-cy1)**2);
    // If the external point is inside or on the circle, push it outside so tangents can be drawn
    if (dist <= r1) { px = cx1 + r1 * 1.7; py = cy1; dist = r1 * 1.7; }
    const tang = Math.sqrt(dist**2 - r1**2);
    const ang = Math.atan2(py-cy1, px-cx1), half = Math.asin(r1/dist);
    const t1x = px - tang*Math.cos(ang-half), t1y = py - tang*Math.sin(ang-half);
    const t2x = px - tang*Math.cos(ang+half), t2y = py - tang*Math.sin(ang+half);
    return (
      <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
        <circle cx={cx1} cy={cy1} r={r1} fill="rgba(99,102,241,0.06)" stroke="#6366f1" strokeWidth="1.8"/>
        <circle cx={cx1} cy={cy1} r="3" fill="#6366f1"/>
        <line x1={px} y1={py} x2={t1x} y2={t1y} stroke="#dc2626" strokeWidth="1.5"/>
        <line x1={px} y1={py} x2={t2x} y2={t2y} stroke="#dc2626" strokeWidth="1.5"/>
        <circle cx={px} cy={py} r="4.5" fill="#dc2626"/>
        <circle cx={t1x} cy={t1y} r="3.5" fill="#6366f1"/>
        <circle cx={t2x} cy={t2y} r="3.5" fill="#6366f1"/>
        {lbl.point && <text x={px+12} y={py+5} fill="#dc2626" fontSize="12" fontWeight="600">{latexToPlain(lbl.point)}</text>}
        {lbl.center && <text x={cx1+10} y={cy1-8} fill="#6366f1" fontSize="12" fontWeight="600">{latexToPlain(lbl.center)}</text>}
        {lbl.radius && <><line x1={cx1} y1={cy1} x2={t1x} y2={t1y} stroke="#6366f1" strokeWidth="1" strokeDasharray="3,2"/>
          <text x={(cx1+t1x)/2-12} y={(cy1+t1y)/2-6} fill="#6366f1" fontSize="11">{latexToPlain(lbl.radius)}</text></>}
        {lbl.tangent && <text x={(px+t1x)/2-14} y={(py+t1y)/2-6} fill="#dc2626" fontSize="11">{latexToPlain(lbl.tangent)}</text>}
      </svg>
    );
  }

  // default: single circle with optional chord/points
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      <circle cx={cx1} cy={cy1} r={r1} fill="rgba(99,102,241,0.06)" stroke="#6366f1" strokeWidth="1.8"/>
      <circle cx={cx1} cy={cy1} r="3" fill="#6366f1"/>
      {lbl.radius && (<><line x1={cx1} y1={cy1} x2={cx1+r1} y2={cy1} stroke="#6366f1" strokeWidth="1" strokeDasharray="3,2"/>
        <text x={cx1+r1/2} y={cy1-9} fill="#6366f1" fontSize="11" textAnchor="middle">{latexToPlain(lbl.radius)}</text></>)}
      {lbl.center && <text x={cx1+8} y={cy1-6} fill="#6366f1" fontSize="12" fontWeight="600">{latexToPlain(lbl.center)}</text>}
      {p.chord && (
        <><line x1={+(p.chord.x1??cx1-r1)} y1={+(p.chord.y1??cy1)} x2={+(p.chord.x2??cx1+r1)} y2={+(p.chord.y2??cy1)} stroke="#374151" strokeWidth="1.5"/>
          {p.chord.label && <text x={(+(p.chord.x1??cx1-r1) + +(p.chord.x2??cx1+r1))/2} y={(+(p.chord.y1??cy1) + +(p.chord.y2??cy1))/2-8} fill="#374151" fontSize="11" textAnchor="middle">{latexToPlain(p.chord.label)}</text>}
        </>
      )}
      {(p.points ?? []).map((pt: {x:number;y:number;label?:string}, i: number) => (
        <g key={i}>
          <circle cx={+pt.x} cy={+pt.y} r="4.5" fill="#2563eb" stroke="white" strokeWidth="1.5"/>
          {pt.label && <text x={+pt.x+10} y={+pt.y-5} fill="#2563eb" fontSize="12" fontWeight="600">{latexToPlain(pt.label)}</text>}
        </g>
      ))}
    </svg>
  );
}

/* ── TEMPLATE 13: Conic Section ──────────────────────────────── */
export function ConicSection({ p }: { p: ConicSectionParams }) {
  const type = (p.type ?? 'parabola').toLowerCase();
  const lbl = p.labels ?? {};
  const VW = 420, VH = 260;
  const ox = VW / 2, oy = VH / 2;
  const toS = (x: number, y: number, sc: number): [number,number] => [ox + x*sc, oy - y*sc];

  if (type === 'ellipse' || type === 'hyperbola') {
    const a = +(p.a ?? 4), b = +(p.b ?? 3);
    const sc = Math.min((VW/2 - 32) / a, (VH/2 - 28) / b, 30);
    const isVertEllipse = type === 'ellipse' && b > a;
    const c = type === 'ellipse'
      ? Math.sqrt(Math.max(0, Math.max(a,b)**2 - Math.min(a,b)**2))
      : Math.sqrt(a**2 + b**2);
    // Horizontal ellipse/hyperbola: foci on x-axis at (±c,0)
    // Vertical ellipse (b>a): foci on y-axis at (0,±c)
    const hf1x = toS(-c, 0, sc)[0], hf2x = toS(c, 0, sc)[0];
    const f1x = isVertEllipse ? ox : hf1x;
    const f2x = isVertEllipse ? ox : hf2x;
    const f1y = isVertEllipse ? oy+c*sc : oy;
    const f2y = isVertEllipse ? oy-c*sc : oy;
    const focY = oy; // used by hyperbola (always x-axis)

    const axes = (
      <>{['x','y'].map((ax,i) => (
        <Arr key={ax} x1={i?ox:24} y1={i?VH-16:oy} x2={i?ox:VW-12} y2={i?14:oy} color="#94a3b8" sw={1.5}/>
      ))}
        <text x={VW-10} y={oy+14} fill="#94a3b8" fontSize="11">x</text>
        <text x={ox+6} y={20} fill="#94a3b8" fontSize="11">y</text>
        <text x={ox-12} y={oy+14} fill="#94a3b8" fontSize="10">O</text>
      </>
    );

    if (type === 'ellipse') {
      return (
        <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
          {axes}
          <ellipse cx={ox} cy={oy} rx={a*sc} ry={b*sc} fill="rgba(99,102,241,0.06)" stroke="#6366f1" strokeWidth="2"/>
          {p.show_focus !== false && (<>
            <circle cx={f1x} cy={f1y} r="4" fill="#2563eb"/><circle cx={f2x} cy={f2y} r="4" fill="#2563eb"/>
            <text x={f1x+(isVertEllipse?8:0)} y={f1y+(isVertEllipse?4:16)} fill="#2563eb" fontSize="11" fontWeight="600" textAnchor={isVertEllipse?"start":"middle"}>{lbl.f1 ?? (isVertEllipse?'(0,−c)':'(-c,0)')}</text>
            <text x={f2x+(isVertEllipse?8:0)} y={f2y+(isVertEllipse?4:16)} fill="#2563eb" fontSize="11" fontWeight="600" textAnchor={isVertEllipse?"start":"middle"}>{lbl.f2 ?? (isVertEllipse?'(0,c)':'(c,0)')}</text>
          </>)}
          {lbl.a && (<><line x1={ox} y1={oy} x2={ox+a*sc} y2={oy} stroke="#374151" strokeWidth="1" strokeDasharray="3,2"/>
            <text x={ox+a*sc/2} y={oy-8} fill="#374151" fontSize="11" textAnchor="middle">{lbl.a}</text></>)}
          {lbl.b && (<><line x1={ox} y1={oy} x2={ox} y2={oy-b*sc} stroke="#374151" strokeWidth="1" strokeDasharray="3,2"/>
            <text x={ox+10} y={oy-b*sc/2} fill="#374151" fontSize="11">{lbl.b}</text></>)}
          {lbl.equation && <text x={VW-16} y={38} fill="#6366f1" fontSize="12" fontWeight="600" textAnchor="end">{latexToPlain(lbl.equation)}</text>}
        </svg>
      );
    }

    // hyperbola
    const slopeV = b / a;
    const branch = (sign: 1|-1): string => {
      const pts: string[] = [];
      for (let t = -2.6; t <= 2.6; t += 0.07) {
        const [sx, sy] = toS(sign*a*Math.cosh(t), b*Math.sinh(t), sc);
        pts.push(`${sx.toFixed(1)},${sy.toFixed(1)}`);
      }
      return `M${pts[0]} L${pts.slice(1).join(' L')}`;
    };
    const dxL = 24 - ox, dxR = VW - 12 - ox;
    return (
      <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
        {p.show_asymptotes !== false && (<>
          <line x1={24} y1={oy-dxL*slopeV} x2={VW-12} y2={oy-dxR*slopeV} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="5,3"/>
          <line x1={24} y1={oy+dxL*slopeV} x2={VW-12} y2={oy+dxR*slopeV} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="5,3"/>
        </>)}
        {axes}
        <path d={branch(1)} fill="none" stroke="#6366f1" strokeWidth="2"/>
        <path d={branch(-1)} fill="none" stroke="#6366f1" strokeWidth="2"/>
        {p.show_focus !== false && (<>
          <circle cx={f1x} cy={focY} r="4" fill="#2563eb"/><circle cx={f2x} cy={focY} r="4" fill="#2563eb"/>
          <text x={f1x} y={focY+16} fill="#2563eb" fontSize="11" fontWeight="600" textAnchor="middle">{lbl.f1 ?? '(-c,0)'}</text>
          <text x={f2x} y={focY+16} fill="#2563eb" fontSize="11" fontWeight="600" textAnchor="middle">{lbl.f2 ?? '(c,0)'}</text>
        </>)}
        {lbl.equation && <text x={VW-16} y={38} fill="#6366f1" fontSize="12" fontWeight="600" textAnchor="end">{latexToPlain(lbl.equation)}</text>}
      </svg>
    );
  }

  // parabola (default)
  const a = +(p.a ?? 2);
  const sc = Math.min(60 / a, 28);
  const focX = ox + a*sc, dirX = ox - a*sc;
  const paraPts: string[] = [];
  for (let t = -3.4; t <= 3.4; t += 0.1) {
    const [sx, sy] = toS(t*t / (4*a), t, sc);
    paraPts.push(`${sx.toFixed(1)},${sy.toFixed(1)}`);
  }
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      {p.show_directrix !== false && (<>
        <line x1={dirX} y1={22} x2={dirX} y2={VH-22} stroke="#dc2626" strokeWidth="1.2" strokeDasharray="5,3"/>
        <text x={dirX-6} y={34} fill="#dc2626" fontSize="10" textAnchor="end">{latexToPlain(lbl.directrix ?? 'x = −a')}</text>
      </>)}
      <Arr x1={28} y1={oy} x2={VW-12} y2={oy} color="#94a3b8" sw={1.5}/>
      <Arr x1={ox} y1={VH-16} x2={ox} y2={14} color="#94a3b8" sw={1.5}/>
      <text x={VW-10} y={oy+14} fill="#94a3b8" fontSize="11">x</text>
      <text x={ox+6} y={20} fill="#94a3b8" fontSize="11">y</text>
      <text x={ox-12} y={oy+14} fill="#94a3b8" fontSize="10">O</text>
      <path d={`M${paraPts[0]} L${paraPts.slice(1).join(' L')}`} fill="none" stroke="#6366f1" strokeWidth="2"/>
      {p.show_focus !== false && (<>
        <circle cx={focX} cy={oy} r="4" fill="#2563eb"/>
        <text x={focX+8} y={oy-8} fill="#2563eb" fontSize="11" fontWeight="600">{latexToPlain(lbl.focus ?? 'F(a,0)')}</text>
      </>)}
      {lbl.equation && <text x={VW-16} y={86} fill="#6366f1" fontSize="12" fontWeight="600" textAnchor="end">{latexToPlain(lbl.equation)}</text>}
    </svg>
  );
}

/* ── TEMPLATE 14: Argand Plane ───────────────────────────────── */
export function ArgandPlane({ p }: { p: ArgandPlaneParams }) {
  const pts: Array<{re:number;im:number;label?:string;show_modulus?:boolean;show_argument?:boolean}> = p.points ?? [];
  const VW = 380, VH = 280, ox = VW/2, oy = VH/2;
  const allRe = pts.map(pt => Math.abs(pt.re)), allIm = pts.map(pt => Math.abs(pt.im));
  const maxRe = Math.max(1, ...allRe) * 1.4, maxIm = Math.max(1, ...allIm) * 1.4;
  const PAD = 46;
  const sc = Math.min((VW/2 - PAD) / maxRe, (VH/2 - PAD) / maxIm, 42);
  const toS = (re: number, im: number): [number,number] => [ox + re*sc, oy - im*sc];
  const reMax = Math.ceil(maxRe / 1.4), imMax = Math.ceil(maxIm / 1.4);

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      <Arr x1={PAD-8} y1={oy} x2={VW-PAD+8} y2={oy} color="#94a3b8" sw={1.5}/>
      <Arr x1={ox} y1={VH-PAD+8} x2={ox} y2={PAD-8} color="#94a3b8" sw={1.5}/>
      <text x={VW-PAD+12} y={oy+4} fill="#94a3b8" fontSize="11">Re</text>
      <text x={ox+6} y={PAD-12} fill="#94a3b8" fontSize="11">Im</text>
      {Array.from({length:reMax*2+1},(_,i)=>i-reMax).filter(n=>n!==0).map(n => (
        <g key={`r${n}`}>
          <line x1={ox+n*sc} y1={oy-3} x2={ox+n*sc} y2={oy+3} stroke="#94a3b8" strokeWidth="1"/>
          <text x={ox+n*sc} y={oy+14} fill="#94a3b8" fontSize="9" textAnchor="middle">{n}</text>
        </g>
      ))}
      {Array.from({length:imMax*2+1},(_,i)=>i-imMax).filter(n=>n!==0).map(n => (
        <g key={`i${n}`}>
          <line x1={ox-3} y1={oy-n*sc} x2={ox+3} y2={oy-n*sc} stroke="#94a3b8" strokeWidth="1"/>
          <text x={ox-8} y={oy-n*sc+4} fill="#94a3b8" fontSize="9" textAnchor="end">{n}i</text>
        </g>
      ))}
      {pts.map((pt, i) => {
        const [sx, sy] = toS(pt.re, pt.im);
        const angR = Math.atan2(pt.im, pt.re);
        const modLen = Math.sqrt(pt.re**2 + pt.im**2) * sc;
        const arcRadius = Math.max(Math.min(modLen * 0.32, 30), 12);
        return (
          <g key={i}>
            {pt.show_modulus !== false && <line x1={ox} y1={oy} x2={sx} y2={sy} stroke="#6366f1" strokeWidth="1.3" strokeDasharray="4,2"/>}
            {pt.show_argument !== false && Math.sqrt(pt.re**2+pt.im**2) > 0.01 && (
              <path d={`M ${ox+arcRadius},${oy} A ${arcRadius},${arcRadius} 0 0,${pt.im>=0?0:1} ${(ox+arcRadius*Math.cos(angR)).toFixed(1)},${(oy-arcRadius*Math.sin(angR)).toFixed(1)}`}
                fill="none" stroke="#d97706" strokeWidth="1.2"/>
            )}
            <line x1={sx} y1={sy} x2={sx} y2={oy} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,2"/>
            <line x1={sx} y1={sy} x2={ox} y2={sy} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,2"/>
            <circle cx={sx} cy={sy} r="4.5" fill="#2563eb" stroke="white" strokeWidth="1.5"/>
            {pt.label && <text x={sx+(pt.re>=0?10:-10)} y={sy+(pt.im>=0?-9:14)} fill="#2563eb" fontSize="12" fontWeight="600" textAnchor={pt.re>=0?'start':'end'}>{latexToPlain(pt.label)}</text>}
          </g>
        );
      })}
    </svg>
  );
}

/* ── TEMPLATE 15: Molecular Geometry (VSEPR) ─────────────────── */
export function MolecGeometry({ p }: { p: MolecGeometryParams }) {
  const shape = (p.shape ?? 'tetrahedral').toLowerCase().replace(/[-\s]/g, '_');
  const central = p.central_atom ?? 'X';
  const ligs: Array<{label?:string}> = p.ligands ?? [];
  const lbl = p.labels ?? {};
  const VW = 380, VH = 230, cx = 190, cy = 118, BL = 72;

  const solidLine = (x1:number,y1:number,x2:number,y2:number) =>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#374151" strokeWidth="2" strokeLinecap="round"/>;
  const wedge = (fx:number,fy:number,tx:number,ty:number) => {
    const dx=tx-fx,dy=ty-fy,len=Math.sqrt(dx**2+dy**2)||1;
    const nx=-dy/len,ny=dx/len,W=5.5;
    return <polygon points={`${fx},${fy} ${tx+nx*W},${ty+ny*W} ${tx-nx*W},${ty-ny*W}`} fill="#374151"/>;
  };
  const dashed = (x1:number,y1:number,x2:number,y2:number) =>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeDasharray="5,3"/>;

  const ligAtom = (x:number,y:number,idx:number) => {
    const label = ligs[idx]?.label ?? `X${idx+1}`;
    const color = /^O/.test(label)?'#dc2626':/^N/.test(label)?'#2563eb':/^H/.test(label)?'#94a3b8':
                  /^C[lL]/.test(label)?'#16a34a':/^B[r]/.test(label)?'#92400e':'#374151';
    return (<g key={idx}>
      <circle cx={x} cy={y} r="14" fill="white" stroke={color} strokeWidth="1.8"/>
      <text x={x} y={y+5} textAnchor="middle" fill={color} fontSize="12" fontWeight="700">{label}</text>
    </g>);
  };
  const centralAtomEl = (
    <g><circle cx={cx} cy={cy} r="17" fill="white" stroke="#374151" strokeWidth="2"/>
       <text x={cx} y={cy+5} textAnchor="middle" fill="#374151" fontSize="13" fontWeight="700">{central}</text>
    </g>
  );
  const angleLbl = lbl.bond_angle;

  if (shape === 'linear') {
    const L = BL*1.05;
    return <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      {solidLine(cx,cy,cx-L,cy)}{solidLine(cx,cy,cx+L,cy)}
      {ligAtom(cx-L,cy,0)}{ligAtom(cx+L,cy,1)}{centralAtomEl}
      {angleLbl && <text x={cx} y={cy-28} fill="#6366f1" fontSize="12" textAnchor="middle" fontWeight="600">{latexToPlain(angleLbl)}</text>}
    </svg>;
  }
  if (shape === 'bent') {
    const ang = +(p.bond_angle ?? 104.5), h = ang/2 * Math.PI/180;
    const l1 = [cx-BL*Math.sin(h), cy+BL*Math.cos(h)], l2 = [cx+BL*Math.sin(h), cy+BL*Math.cos(h)];
    return <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      {solidLine(cx,cy,l1[0]!,l1[1]!)}{solidLine(cx,cy,l2[0]!,l2[1]!)}
      {ligAtom(l1[0]!,l1[1]!,0)}{ligAtom(l2[0]!,l2[1]!,1)}{centralAtomEl}
      {(() => {
        // Arc endpoints are on the bond directions at arcR2 from central atom
        const arcR2 = 26;
        const pa2 = Math.atan2(BL*Math.cos(h), BL*Math.sin(h));  // direction to l2
        const pa1 = Math.atan2(BL*Math.cos(h), -BL*Math.sin(h)); // direction to l1
        const axS = +(cx + arcR2*Math.cos(pa2)).toFixed(1), ayS = +(cy + arcR2*Math.sin(pa2)).toFixed(1);
        const axE = +(cx + arcR2*Math.cos(pa1)).toFixed(1), ayE = +(cy + arcR2*Math.sin(pa1)).toFixed(1);
        return <path d={`M ${axS},${ayS} A ${arcR2},${arcR2} 0 0,1 ${axE},${ayE}`} fill="none" stroke="#6366f1" strokeWidth="1.2"/>;
      })()}
      <text x={cx} y={cy+44} fill="#6366f1" fontSize="11" textAnchor="middle" fontWeight="600">{latexToPlain(angleLbl ?? `${ang}°`)}</text>
    </svg>;
  }
  if (shape === 'trigonal_planar') {
    const pos = [270,30,150].map(d => [cx+BL*Math.cos(d*Math.PI/180), cy+BL*Math.sin(d*Math.PI/180)]);
    return <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      {pos.map((q) => solidLine(cx,cy,q[0]!,q[1]!))}
      {pos.map((q,i) => ligAtom(q[0]!,q[1]!,i))}{centralAtomEl}
      {angleLbl && <text x={cx+BL*0.6} y={cy-18} fill="#6366f1" fontSize="11" fontWeight="600">{latexToPlain(angleLbl)}</text>}
    </svg>;
  }
  if (shape === 'octahedral') {
    const pos = [[cx,cy-BL],[cx,cy+BL],[cx-BL,cy],[cx+BL,cy]];
    const fr = [cx+BL*0.62,cy+BL*0.62], bk = [cx-BL*0.62,cy-BL*0.62];
    return <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      {pos.map((q) => solidLine(cx,cy,q[0]!,q[1]!))}
      {wedge(cx,cy,fr[0]!,fr[1]!)}{dashed(cx,cy,bk[0]!,bk[1]!)}
      {pos.map((q,i) => ligAtom(q[0]!,q[1]!,i))}
      {ligAtom(fr[0]!,fr[1]!,4)}{ligAtom(bk[0]!,bk[1]!,5)}{centralAtomEl}
      {angleLbl && <text x={cx+BL+24} y={cy+4} fill="#6366f1" fontSize="11" fontWeight="600" dominantBaseline="middle">{latexToPlain(angleLbl)}</text>}
    </svg>;
  }
  // tetrahedral (default) and trigonal_bipyramidal
  if (shape === 'trigonal_bipyramidal') {
    const eqPos = [0,120,240].map(d => [cx+BL*Math.cos(d*Math.PI/180), cy+BL*Math.sin(d*Math.PI/180)]);
    const axT = [cx, cy-BL], axB = [cx, cy+BL];
    return <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      {eqPos.map((q) => solidLine(cx,cy,q[0]!,q[1]!))}
      {solidLine(cx,cy,axT[0]!,axT[1]!)}{solidLine(cx,cy,axB[0]!,axB[1]!)}
      {eqPos.map((q,i) => ligAtom(q[0]!,q[1]!,i))}
      {ligAtom(axT[0]!,axT[1]!,3)}{ligAtom(axB[0]!,axB[1]!,4)}{centralAtomEl}
      {angleLbl && <text x={cx+BL+18} y={cy+30} fill="#6366f1" fontSize="11" fontWeight="600">{latexToPlain(angleLbl)}</text>}
    </svg>;
  }
  // tetrahedral
  const top = [cx, cy-BL*0.88], bot = [cx, cy+BL*0.88], left = [cx-BL*0.88,cy], right = [cx+BL*0.88,cy];
  return <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
    {solidLine(cx,cy,left[0]!,left[1]!)}{solidLine(cx,cy,right[0]!,right[1]!)}
    {wedge(cx,cy,bot[0]!,bot[1]!)}{dashed(cx,cy,top[0]!,top[1]!)}
    {ligAtom(left[0]!,left[1]!,0)}{ligAtom(right[0]!,right[1]!,1)}{ligAtom(bot[0]!,bot[1]!,2)}{ligAtom(top[0]!,top[1]!,3)}{centralAtomEl}
    {angleLbl && <text x={cx+52} y={cy+30} fill="#6366f1" fontSize="11" fontWeight="600">{latexToPlain(angleLbl ?? '109.5°')}</text>}
  </svg>;
}

/* ── TEMPLATE 16: MO Diagram ─────────────────────────────────── */
export function MoDiagram({ p }: { p: MoDiagramParams }) {
  const molRaw = (p.molecule ?? 'N2');
  const mol = molRaw.replace(/₂/g,'2').replace(/⁺/g,'+').replace(/⁻/g,'-').toUpperCase();

  type MOLevel = { label:string; ab:boolean; deg:boolean; cap:number };
  const lt7Levels: MOLevel[] = [
    {label:'σ(2s)', ab:false,deg:false,cap:2},{label:'σ*(2s)',ab:true, deg:false,cap:2},
    {label:'π(2p)', ab:false,deg:true, cap:4},{label:'σ(2p)', ab:false,deg:false,cap:2},
    {label:'π*(2p)',ab:true, deg:true, cap:4},{label:'σ*(2p)',ab:true, deg:false,cap:2},
  ];
  const gt7Levels: MOLevel[] = [
    {label:'σ(2s)', ab:false,deg:false,cap:2},{label:'σ*(2s)',ab:true, deg:false,cap:2},
    {label:'σ(2p)', ab:false,deg:false,cap:2},{label:'π(2p)', ab:false,deg:true, cap:4},
    {label:'π*(2p)',ab:true, deg:true, cap:4},{label:'σ*(2p)',ab:true, deg:false,cap:2},
  ];
  const molDb: Record<string,{order:'lt7'|'gt7';val:number}> = {
    'LI2':{order:'lt7',val:2},'BE2':{order:'lt7',val:4},'B2':{order:'lt7',val:6},
    'C2':{order:'lt7',val:8},'N2':{order:'lt7',val:10},'N2+':{order:'lt7',val:9},
    'O2':{order:'gt7',val:12},'O2+':{order:'gt7',val:11},'O2-':{order:'gt7',val:13},
    'F2':{order:'gt7',val:14},'NE2':{order:'gt7',val:16},
    'NO':{order:'gt7',val:11},'CO':{order:'lt7',val:10},'CN-':{order:'lt7',val:10},
  };
  const mdata = molDb[mol] ?? {order:'lt7' as const, val:+(p.valence_electrons ?? 10)};
  const levels = mdata.order === 'lt7' ? lt7Levels : gt7Levels;
  let rem = mdata.val;
  const filled = levels.map(lv => { const e=Math.min(rem,lv.cap); rem-=e; return e; });

  let bonding = 0, antibonding = 0;
  levels.forEach((lv,i) => { if(lv.ab) antibonding+=filled[i]!; else bonding+=filled[i]!; });
  const bo = (bonding - antibonding) / 2;
  let unpaired = 0;
  // Hund's rule: degenerate pair with e electrons → min(e,4-e) unpaired (handles e=2→2 unpaired for O2/B2)
  levels.forEach((lv,i) => { if(lv.deg){ const e=filled[i]!; unpaired+=Math.min(e,4-e); } else if(filled[i]===1) unpaired++; });

  const VW=380, VH=310;
  const lx=68, rx=306, cx2=VW/2;
  const dlx=(lx+cx2-14)/2, drx=(cx2+14+rx)/2;
  const ys=[264,228,192,158,122,90] as const;
  const abC='#dc2626', bC='#374151';

  const arrowUp = (x:number,y:number,c:string='#2563eb') => (
    <g><line x1={x} y1={y} x2={x} y2={y-14} stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
       <polyline points={`${x-4},${y-9} ${x},${y-15} ${x+4},${y-9}`} fill="none" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/></g>
  );
  const arrowDn = (x:number,y:number,c:string='#2563eb') => (
    <g><line x1={x} y1={y-14} x2={x} y2={y} stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
       <polyline points={`${x-4},${y-5} ${x},${y} ${x+4},${y-5}`} fill="none" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/></g>
  );

  const drawEl = (i:number, e:number, deg:boolean) => {
    if (e === 0) return null;
    const y = ys[i]!;
    if (!deg) return (<g key={`e${i}`}>{e>=1&&arrowUp(cx2-8,y)}{e>=2&&arrowDn(cx2+8,y)}</g>);
    // Hund's rule: fill one per orbital first
    const e1 = e<=2 ? Math.min(e,1) : e===3 ? 2 : 2;
    const e2 = e===0?0:e===1?0:e===2?1:e===3?1:2;
    return (<g key={`e${i}`}>
      {e1>=1&&arrowUp(dlx-6,y)}{e1>=2&&arrowDn(dlx+6,y)}
      {e2>=1&&arrowUp(drx-6,y,'#dc2626')}{e2>=2&&arrowDn(drx+6,y,'#dc2626')}
    </g>);
  };

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      <text x={VW/2} y={22} textAnchor="middle" fill="#374151" fontSize="13" fontWeight="700">
        MO Diagram - {molRaw}
      </text>
      {levels.map((lv,i) => {
        const y=ys[i]!, c=lv.ab?abC:bC;
        const dash = lv.ab ? '6,3' : undefined;
        return (<g key={i}>
          {lv.deg ? (<>
            <line x1={lx} y1={y} x2={cx2-14} y2={y} stroke={c} strokeWidth={lv.ab?1.5:2} strokeDasharray={dash}/>
            <line x1={cx2+14} y1={y} x2={rx} y2={y} stroke={c} strokeWidth={lv.ab?1.5:2} strokeDasharray={dash}/>
          </>) : (
            <line x1={lx} y1={y} x2={rx} y2={y} stroke={c} strokeWidth={lv.ab?1.5:2} strokeDasharray={dash}/>
          )}
          <text x={lx-6} y={y+4} fill={c} fontSize="11" fontWeight={lv.ab?'400':'600'} textAnchor="end">{lv.label}</text>
          {drawEl(i,filled[i]!,lv.deg)}
        </g>);
      })}
      <text x={VW-8} y={288} fill="#374151" fontSize="11" textAnchor="end">Bond order = {bo}</text>
      <text x={VW-8} y={304} fill={unpaired>0?'#dc2626':'#16a34a'} fontSize="11" textAnchor="end">
        {unpaired>0?'Paramagnetic':'Diamagnetic'}
      </text>
    </svg>
  );
}

/* ── TEMPLATE 17: Crystal Structure ─────────────────────────── */
export function CrystalStruct({ p }: { p: CrystalStructParams }) {
  const type = (p.type ?? 'fcc').toLowerCase();
  const lbl = p.labels ?? {};
  const VW=380, VH=260;
  const cxI=VW/2, cyI=VH*0.54, L=84;
  const c30=0.866, s30=0.5;

  // Isometric projection: gx=right, gy=left, gz=up
  const iso = (gx:number,gy:number,gz:number):[number,number] => [
    cxI + (gx-gy)*c30*L,
    cyI + (gx+gy)*s30*L - gz*L,
  ];

  // All 8 corners
  const corners: Array<[number,number,number]> = [
    [0,0,0],[1,0,0],[0,1,0],[1,1,0],
    [0,0,1],[1,0,1],[0,1,1],[1,1,1],
  ];
  const corSvg = corners.map(([x,y,z]) => iso(x,y,z));

  // Edges: pairs of corner indices
  const edges:[number,number,boolean][] = [ // [i,j,hidden]
    [0,1,true],[0,2,true],[0,4,true],   // hidden edges from (0,0,0)
    [1,3,false],[1,5,false],
    [2,3,false],[2,6,false],
    [3,7,false],
    [4,5,false],[4,6,false],
    [5,7,false],[6,7,false],
  ];

  // Atom positions
  const atomPositions: Array<{pos:[number,number,number];type:string}> = [];
  corners.forEach(([x,y,z]) => atomPositions.push({pos:[x,y,z],type:'corner'}));
  if (type === 'bcc') {
    atomPositions.push({pos:[0.5,0.5,0.5],type:'center'});
  } else if (type === 'fcc') {
    [[0.5,0.5,0],[0.5,0.5,1],[0.5,0,0.5],[0,0.5,0.5],[1,0.5,0.5],[0.5,1,0.5]].forEach(
      ([x,y,z]) => atomPositions.push({pos:[x!,y!,z!],type:'face'})
    );
  } else if (type === 'nacl') {
    // NaCl: Na at body-center + edge centers; Cl at corners + face centers (simplified)
    atomPositions.forEach(a => { a.type = 'Cl'; }); // reassign corners as Cl
    [[0.5,0.5,0.5],[1,0.5,0],[0.5,0,0],[0,0.5,0],[1,0,0.5],[0,0,0.5],[0.5,1,0],[0,0.5,1]].forEach(
      ([x,y,z]) => atomPositions.push({pos:[x!,y!,z!],type:'Na'})
    );
  }

  const atomRadius = (t:string) => t==='corner'?5:t==='center'?8:t==='face'?7:t==='Na'?6:5;
  const atomColor = (t:string) => t==='corner'?'#6366f1':t==='center'?'#2563eb':t==='face'?'#7c3aed':
    t==='Na'?'#2563eb':t==='Cl'?'#dc2626':'#6366f1';
  const atomStroke = (t:string) => t==='corner'||t==='Cl'?'#6366f1':'white';

  const apc = type==='scc'?'1':type==='bcc'?'2':type==='fcc'?'4':type==='nacl'?'4 (NaCl)':'–';
  const typeName = type.toUpperCase().replace('NACL','NaCl');

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      <text x={VW/2} y={20} textAnchor="middle" fill="#374151" fontSize="13" fontWeight="700">{lbl.title ?? `${typeName} Unit Cell`}</text>
      {edges.map(([i,j,hidden],k) => {
        const [x1,y1]=corSvg[i]!, [x2,y2]=corSvg[j]!;
        return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={hidden?'#cbd5e1':'#475569'} strokeWidth={hidden?1:1.5}
          strokeDasharray={hidden?'5,3':undefined} strokeLinecap="round"/>;
      })}
      {atomPositions.map(({pos:[gx,gy,gz],type:t},i) => {
        const [sx,sy]=iso(gx,gy,gz);
        return <circle key={i} cx={sx} cy={sy} r={atomRadius(t)} fill={atomColor(t)} stroke={atomStroke(t)} strokeWidth="1.5" opacity="0.9"/>;
      })}
      {(type==='nacl') && (<>
        <circle cx={32} cy={VH-32} r="5" fill="#dc2626" stroke="#6366f1" strokeWidth="1.5"/>
        <text x={44} y={VH-28} fill="#374151" fontSize="10">Cl⁻</text>
        <circle cx={32} cy={VH-18} r="5" fill="#2563eb" stroke="white" strokeWidth="1.5"/>
        <text x={44} y={VH-14} fill="#374151" fontSize="10">Na⁺</text>
      </>)}
      <text x={VW/2} y={VH-8} fill="#64748b" fontSize="10" textAnchor="middle">
        {lbl.formula ?? ''} {apc} atom{apc==='1'?'':'s'}/cell
      </text>
    </svg>
  );
}

/* ── TEMPLATE 18: Electrochemical Cell ──────────────────────── */
export function ElectrochemCell({ p }: { p: ElectrochemCellParams }) {
  const lbl = p.labels ?? {};
  const anodeMetal  = p.anode?.metal  ?? 'Zn';
  const cathodeMetal= p.cathode?.metal ?? 'Cu';
  const anodeElec   = p.anode?.electrolyte  ?? `${anodeMetal}SO₄`;
  const cathodeElec = p.cathode?.electrolyte ?? `${cathodeMetal}SO₄`;
  const emf = p.emf ?? '';
  const VW=440, VH=260;
  // lbY=96: beaker starts at 96, salt bridge at 96-32=64, electrode labels at 64-10=54
  // wireY=22: wire across the top, voltmeter circle at y=22
  const lbX=36,lbY=96,lbW=128,lbH=136;
  const rbX=276,rbY=96,rbW=128,rbH=136;
  const aX=lbX+lbW*0.44, cX=rbX+rbW*0.56;
  const wireY=20, sbBridgeY=lbY-32;
  const vmX=VW/2;

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{width:'100%',height:'auto',display:'block'}}>
      {/* External wire */}
      <polyline points={`${aX},${lbY-20} ${aX},${wireY} ${cX},${wireY} ${cX},${rbY-20}`}
        fill="none" stroke="#374151" strokeWidth="1.8" strokeLinejoin="round"/>
      {/* Voltmeter — r=20 fits up to 6-char EMF strings */}
      <circle cx={vmX} cy={wireY} r="20" fill="white" stroke="#374151" strokeWidth="1.5"/>
      <text x={vmX} y={wireY+4} textAnchor="middle" fill="#374151" fontSize="10" fontWeight="700">{emf||'V'}</text>
      {/* Electron arrows on wire */}
      <Arr x1={aX+14} y1={wireY} x2={vmX-24} y2={wireY} color="#374151" sw={1.4}/>
      <Arr x1={vmX+24} y1={wireY} x2={cX-14} y2={wireY} color="#374151" sw={1.4}/>
      <text x={(aX+vmX)/2} y={wireY+14} fill="#374151" fontSize="9" textAnchor="middle">e⁻</text>
      {/* Salt bridge (U-shape tube) */}
      <polyline points={`${lbX+lbW/2},${lbY} ${lbX+lbW/2},${sbBridgeY} ${rbX+rbW/2},${sbBridgeY} ${rbX+rbW/2},${rbY}`}
        fill="none" stroke="#94a3b8" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points={`${lbX+lbW/2},${lbY} ${lbX+lbW/2},${sbBridgeY} ${rbX+rbW/2},${sbBridgeY} ${rbX+rbW/2},${rbY}`}
        fill="none" stroke="#f1f5f9" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <text x={VW/2} y={sbBridgeY-8} fill="#64748b" fontSize="9" textAnchor="middle">Salt Bridge</text>
      {/* Left beaker (anode) */}
      <rect x={lbX} y={lbY} width={lbW} height={lbH} fill="rgba(219,234,254,0.35)" stroke="#374151" strokeWidth="1.8" rx="2"/>
      <line x1={aX} y1={lbY-20} x2={aX} y2={lbY+lbH-6} stroke="#374151" strokeWidth="5" strokeLinecap="round"/>
      <text x={aX} y={sbBridgeY-12} fill="#dc2626" fontSize="9" fontWeight="700" textAnchor="middle">Anode (−)</text>
      <text x={aX} y={lbY+lbH-10} fill="white" fontSize="10" fontWeight="700" textAnchor="middle" stroke="#374151" strokeWidth="3" paintOrder="stroke">{anodeMetal}</text>
      <text x={lbX+lbW/2} y={lbY+62} fill="#1d4ed8" fontSize="11" textAnchor="middle" fontWeight="600">{anodeElec}</text>
      <text x={lbX+lbW/2} y={lbY+78} fill="#1d4ed8" fontSize="10" textAnchor="middle">(aq)</text>
      {lbl.anode_rxn && <text x={lbX+lbW/2} y={lbY+lbH+16} fill="#374151" fontSize="9" textAnchor="middle">{latexToPlain(lbl.anode_rxn)}</text>}
      {!lbl.anode_rxn && <text x={lbX+lbW/2} y={lbY+lbH+16} fill="#94a3b8" fontSize="9" textAnchor="middle">oxidation</text>}
      {/* Right beaker (cathode) */}
      <rect x={rbX} y={rbY} width={rbW} height={rbH} fill="rgba(220,252,231,0.35)" stroke="#374151" strokeWidth="1.8" rx="2"/>
      <line x1={cX} y1={rbY-20} x2={cX} y2={rbY+rbH-6} stroke="#b45309" strokeWidth="5" strokeLinecap="round"/>
      <text x={cX} y={sbBridgeY-12} fill="#16a34a" fontSize="9" fontWeight="700" textAnchor="middle">Cathode (+)</text>
      <text x={cX} y={rbY+rbH-10} fill="white" fontSize="10" fontWeight="700" textAnchor="middle" stroke="#374151" strokeWidth="3" paintOrder="stroke">{cathodeMetal}</text>
      <text x={rbX+rbW/2} y={rbY+62} fill="#15803d" fontSize="11" textAnchor="middle" fontWeight="600">{cathodeElec}</text>
      <text x={rbX+rbW/2} y={rbY+78} fill="#15803d" fontSize="10" textAnchor="middle">(aq)</text>
      {lbl.cathode_rxn && <text x={rbX+rbW/2} y={rbY+rbH+16} fill="#374151" fontSize="9" textAnchor="middle">{latexToPlain(lbl.cathode_rxn)}</text>}
      {!lbl.cathode_rxn && <text x={rbX+rbW/2} y={rbY+rbH+16} fill="#94a3b8" fontSize="9" textAnchor="middle">reduction</text>}
    </svg>
  );
}

/* ── TEMPLATE 19: Organic Structure (SmilesDrawer) ──────────── */
export function OrganicStruct({ p }: { p: OrganicStructParams }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const smiles: string = p.smiles ?? 'c1ccccc1';
  const label: string = p.label ?? '';
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    import('smiles-drawer').then((mod: any) => {
      if (!active || !canvasRef.current) return;
      try {
        const Lib = mod.default ?? mod;
        const DrawerClass = Lib.SmilesDrawer ?? Lib;
        const parseFunc = (Lib.parse ?? Lib.SmilesDrawer?.parse) as
          ((s:string, ok:(t:unknown)=>void, err:(e:unknown)=>void)=>void) | undefined;
        if (!DrawerClass || !parseFunc) { setFailed(true); return; }
        const drawer = new DrawerClass({
          width: 380, height: 200, bondThickness: 1.2,
          shortBondWidth: 0.85, compactDrawing: true,
          themes: {
            light: {
              C:'#374151',O:'#dc2626',N:'#2563eb',S:'#d97706',
              P:'#7c3aed',F:'#16a34a',Cl:'#16a34a',Br:'#92400e',
              I:'#7c3aed',H:'#94a3b8',BACKGROUND:'#fafafa',
            }
          }
        });
        parseFunc.call(Lib, smiles,
          (tree: unknown) => { if (active && canvasRef.current) drawer.draw(tree, canvasRef.current, 'light', false); },
          (err: unknown) => { console.warn('[SmilesDrawer]', err); if (active) setFailed(true); }
        );
      } catch (e) { console.warn('[SmilesDrawer init]', e); if (active) setFailed(true); }
    }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [smiles]);

  return (
    <div style={{textAlign:'center'}}>
      {failed ? (
        <div style={{padding:'24px 16px',border:'1px solid #e5e7eb',borderRadius:6,background:'#f9fafb'}}>
          <div style={{fontFamily:'monospace',fontSize:12,color:'#374151',letterSpacing:'0.02em'}}>{smiles}</div>
          <div style={{marginTop:6,fontSize:11,color:'#6b7280'}}>Structural formula (SMILES)</div>
          {label && <div style={{marginTop:4,fontSize:12,color:'#374151',fontWeight:600}}>{label}</div>}
        </div>
      ) : (
        <>
          <canvas ref={canvasRef} width={380} height={200} style={{maxWidth:'100%',height:'auto'}}/>
          {label && <p style={{fontSize:12,color:'#475569',margin:'4px 0 0',padding:0}}>{label}</p>}
        </>
      )}
    </div>
  );
}

export class DiagramErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: unknown) {
    console.warn('[DiagramRenderer error caught]:', err);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

