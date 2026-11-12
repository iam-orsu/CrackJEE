"use client";

import React, { useEffect, useId, useState } from "react";

/* ------------------------------------------------------------------ */
/*  JEENEET Loader                                                     */
/*  5 animated science loaders. Every time <Loader /> mounts, one of   */
/*  them is picked at random (never the same one twice in a row).      */
/*  Force one with:  <Loader variant="atom" />                         */
/* ------------------------------------------------------------------ */

const NAVY = "#12356B";
const PURPLE = "#9333A8";
const PINK = "#E84A8F";
const TOMATO = "#FF6347";

type SymbolProps = { size: number; uid: string };

/* ---------- 1. Atom (Physics) ---------- */
const ATOM_ORBITS = [
  { rotate: 0, dur: "2.4s", color: PINK, begin: "0s" },
  { rotate: 60, dur: "3.1s", color: TOMATO, begin: "-0.8s" },
  { rotate: 120, dur: "2.8s", color: PURPLE, begin: "-1.6s" },
];
const ORBIT_PATH = "M20,100 a80,30 0 1,0 160,0 a80,30 0 1,0 -160,0";

function AtomSymbol({ size }: SymbolProps) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className="jn-svg" aria-hidden="true">
      <g className="jn-spin">
        {ATOM_ORBITS.map((o, i) => (
          <g key={i} transform={`rotate(${o.rotate} 100 100)`}>
            <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke={NAVY} strokeWidth="4" strokeLinecap="round" />
            <circle r="9" fill={o.color} stroke="#fff" strokeWidth="2.5">
              <animateMotion dur={o.dur} begin={o.begin} repeatCount="indefinite" path={ORBIT_PATH} />
            </circle>
          </g>
        ))}
      </g>
      <g className="jn-pulse" style={{ transformOrigin: "100px 100px" }}>
        <circle cx="100" cy="100" r="24" fill={PURPLE} />
        <circle cx="92" cy="92" r="7" fill="#fff" opacity="0.28" />
        <Face cx={100} cy={98} gap={8} />
        <path d="M91 107 Q100 116 109 107" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <circle cx="87" cy="106" r="3.4" fill={TOMATO} opacity="0.55" />
        <circle cx="113" cy="106" r="3.4" fill={TOMATO} opacity="0.55" />
      </g>
    </svg>
  );
}

/* shared blinking eyes */
function Face({ cx, cy, gap, r = 3.2, fill = "#fff" }: { cx: number; cy: number; gap: number; r?: number; fill?: string }) {
  return (
    <g className="jn-blink" style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <circle cx={cx - gap} cy={cy} r={r} fill={fill} />
      <circle cx={cx + gap} cy={cy} r={r} fill={fill} />
    </g>
  );
}

/* ---------- 2. Newton's Cradle (Physics) ---------- */
function CradleSymbol({ size }: SymbolProps) {
  const xs = [60, 80, 100, 120, 140];
  const colors = [TOMATO, PURPLE, NAVY, PURPLE, PINK];
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className="jn-svg" aria-hidden="true">
      <rect x="34" y="28" width="132" height="10" rx="5" fill={NAVY} />
      <rect x="34" y="28" width="10" height="120" rx="5" fill={NAVY} />
      <rect x="156" y="28" width="10" height="120" rx="5" fill={NAVY} />
      <rect x="24" y="142" width="152" height="12" rx="6" fill={NAVY} />
      {xs.map((x, i) => {
        const cls = i === 0 ? "jn-cradle-left" : i === 4 ? "jn-cradle-right" : "";
        return (
          <g key={i} className={cls} style={{ transformOrigin: `${x}px 38px` }}>
            <line x1={x} y1="38" x2={x} y2="105" stroke={NAVY} strokeWidth="2.5" />
            <circle cx={x} cy="115" r="10.5" fill={colors[i]} stroke="#fff" strokeWidth="2.5" />
            <circle cx={x - 3.5} cy="111" r="3" fill="#fff" opacity="0.35" />
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- 3. Magnet (Physics) ---------- */
function MagnetSymbol({ size }: SymbolProps) {
  const arc = "M66 36 Q100 -8 134 36";
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className="jn-svg" aria-hidden="true">
      {/* field lines */}
      <path d="M66 34 Q100 -2 134 34" fill="none" stroke={PURPLE} strokeWidth="3" strokeLinecap="round" strokeDasharray="4 7" className="jn-field" />
      <path d="M60 28 Q100 -22 140 28" fill="none" stroke={PINK} strokeWidth="3" strokeLinecap="round" strokeDasharray="4 7" className="jn-field jn-field--2" />
      {/* iron filings pulled between poles */}
      {[0, -0.6, -1.2].map((b, i) => (
        <circle key={i} r="4" fill={NAVY}>
          <animateMotion dur="1.8s" begin={`${b}s`} repeatCount="indefinite" path={arc} />
        </circle>
      ))}
      <g className="jn-wobble" style={{ transformOrigin: "100px 110px" }}>
        <path d="M55 52 V108 a45 45 0 0 0 90 0 V52" fill="none" stroke={NAVY} strokeWidth="24" />
        <rect x="43" y="44" width="24" height="26" fill={TOMATO} />
        <rect x="133" y="44" width="24" height="26" fill="#2F6BFF" />
        <rect x="43" y="44" width="24" height="7" fill="#fff" opacity="0.9" />
        <rect x="133" y="44" width="24" height="7" fill="#fff" opacity="0.9" />
        <Face cx={100} cy={152} gap={9} r={3} />
        <path d="M93 160 Q100 166 107 160" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ---------- 4. Chemistry Flask ---------- */
function FlaskSymbol({ size, uid }: SymbolProps) {
  const shape = "M85 30 H115 V80 L155 148 Q161 166 143 166 H57 Q39 166 45 148 L85 80 Z";
  const clip = `jn-clip-${uid}`;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className="jn-svg" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <path d={shape} />
        </clipPath>
      </defs>
      <g className="jn-wobble-slow" style={{ transformOrigin: "100px 166px" }}>
        <g clipPath={`url(#${clip})`}>
          <rect x="30" y="20" width="140" height="160" fill="#F4ECFA" />
          <g className="jn-wave">
            <path d="M-100 118 q25 -12 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V190 H-100 Z" fill={PURPLE} />
            <path d="M-100 126 q25 -10 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V190 H-100 Z" fill={PINK} opacity="0.55" />
          </g>
          {[78, 100, 122].map((x, i) => (
            <circle key={i} cx={x} cy="150" r={4 + (i % 2) * 2} fill="#fff" opacity="0.85" className="jn-bubble" style={{ animationDelay: `${i * 0.55}s` }} />
          ))}
        </g>
        <path d={shape} fill="none" stroke={NAVY} strokeWidth="5" strokeLinejoin="round" />
        <rect x="80" y="24" width="40" height="9" rx="4.5" fill={NAVY} />
        <Face cx={100} cy={140} gap={10} r={3.4} fill="#fff" />
        <path d="M92 150 Q100 158 108 150" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* steam puffs */}
      {[92, 108].map((x, i) => (
        <circle key={i} cx={x} cy="22" r="5" fill={PINK} className="jn-puff" style={{ animationDelay: `${i * 0.7}s` }} />
      ))}
    </svg>
  );
}

/* ---------- 5. DNA Helix (Biology) ---------- */
function DnaSymbol({ size }: SymbolProps) {
  const rows = Array.from({ length: 9 }, (_, i) => 22 + i * 19);
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className="jn-svg" aria-hidden="true">
      <g className="jn-sway" style={{ transformOrigin: "100px 100px" }}>
        {rows.map((y, i) => (
          <g key={i} className="jn-rung" style={{ transformOrigin: `100px ${y}px`, animationDelay: `${-i * 0.22}s` }}>
            <line x1="58" y1={y} x2="142" y2={y} stroke={i % 2 ? PINK : "#B9A5D6"} strokeWidth="4" strokeLinecap="round" />
            <circle cx="58" cy={y} r="8" fill={PURPLE} stroke="#fff" strokeWidth="2.5" />
            <circle cx="142" cy={y} r="8" fill={TOMATO} stroke="#fff" strokeWidth="2.5" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ------------------------- registry (max 5) ------------------------- */
const LOADERS = [
  {
    id: "atom",
    Symbol: AtomSymbol,
    title: "Charging up your brain",
    facts: [
      "An atom is so tiny that millions fit on a full stop!",
      "Electrons zoom around the nucleus like tiny planets.",
      "Everything around you is made of atoms.",
    ],
  },
  {
    id: "cradle",
    Symbol: CradleSymbol,
    title: "Swinging into action",
    facts: [
      "Newton's cradle shows that momentum is conserved.",
      "When one ball hits, the one on the far side jumps up!",
      "Energy passes through the balls, but the middle ones stay still.",
    ],
  },
  {
    id: "magnet",
    Symbol: MagnetSymbol,
    title: "Attracting great questions",
    facts: [
      "Every magnet has two poles, North and South.",
      "Opposite poles attract and like poles repel.",
      "Earth itself is one giant magnet!",
    ],
  },
  {
    id: "flask",
    Symbol: FlaskSymbol,
    title: "Mixing something awesome",
    facts: [
      "Bubbles in a reaction often mean a gas is being made.",
      "Water is two hydrogen atoms and one oxygen atom: H\u2082O.",
      "The periodic table has 118 known elements.",
    ],
  },
  {
    id: "dna",
    Symbol: DnaSymbol,
    title: "Unzipping your lesson",
    facts: [
      "DNA is shaped like a twisted ladder called a double helix.",
      "Your DNA holds the instructions to build you.",
      "Stretched out, the DNA in one cell is about 2 metres long!",
    ],
  },
] as const;

export type LoaderVariant = (typeof LOADERS)[number]["id"] | "random";

/* remembers the last pick so two loaders never repeat back to back */
let lastIndex = -1;
function pickRandomIndex() {
  let next = Math.floor(Math.random() * LOADERS.length);
  if (next === lastIndex) next = (next + 1) % LOADERS.length;
  lastIndex = next;
  return next;
}

type LoaderProps = {
  /** Cover the whole screen (page loading). Default: true */
  fullScreen?: boolean;
  /** Size of the symbol in px. Default: 180 */
  size?: number;
  /** Override the heading text */
  text?: string;
  /** "random" (default) or force one: atom | cradle | magnet | flask | dna */
  variant?: LoaderVariant;
};

export default function Loader({
  fullScreen = true,
  size = 180,
  text,
  variant = "random",
}: LoaderProps) {
  const uid = useId().replace(/:/g, "");
  const [index, setIndex] = useState<number | null>(null);
  const [factIndex, setFactIndex] = useState(0);

  // Pick after mount so server and client HTML always match (no hydration error)
  useEffect(() => {
    if (variant === "random") {
      setIndex(pickRandomIndex());
    } else {
      const found = LOADERS.findIndex((l) => l.id === variant);
      setIndex(found >= 0 ? found : 0);
    }
  }, [variant]);

  useEffect(() => {
    const id = setInterval(() => setFactIndex((i) => i + 1), 3200);
    return () => clearInterval(id);
  }, []);

  const loader = index === null ? null : LOADERS[index];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className={`jn-loader ${fullScreen ? "jn-loader--full" : ""}`}
    >
      {loader && (
        <>
          <div className="jn-wrap" style={{ width: size, height: size }}>
            <span className="jn-spark jn-spark--1" />
            <span className="jn-spark jn-spark--2" />
            <span className="jn-spark jn-spark--3" />
            <loader.Symbol size={size} uid={uid} />
          </div>

          <p className="jn-title">
            {text ?? loader.title}
            <span className="jn-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </p>

          <p key={factIndex} className="jn-fact">
            Did you know? {loader.facts[factIndex % loader.facts.length]}
          </p>
        </>
      )}

      <style>{`
        .jn-loader {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 14px; padding: 24px; text-align: center; font-family: inherit;
        }
        .jn-loader--full {
          position: fixed; inset: 0; z-index: 9999;
          background:
            radial-gradient(circle at 15% 20%, rgba(147,51,168,0.14), transparent 45%),
            radial-gradient(circle at 85% 85%, rgba(18,53,107,0.14), transparent 45%),
            #ffffff;
        }
        .jn-wrap { position: relative; }
        .jn-svg { overflow: visible; display: block; }

        .jn-title { margin: 6px 0 0; font-size: 1.15rem; font-weight: 800; color: ${NAVY}; letter-spacing: .2px; }
        .jn-dots { display: inline-flex; gap: 4px; margin-left: 6px; }
        .jn-dots i { width: 7px; height: 7px; border-radius: 50%; background: ${TOMATO}; display: inline-block; animation: jn-hop .9s ease-in-out infinite; }
        .jn-dots i:nth-child(2) { animation-delay: .15s; background: ${PURPLE}; }
        .jn-dots i:nth-child(3) { animation-delay: .3s; background: ${NAVY}; }
        .jn-fact { margin: 0; max-width: 320px; font-size: .88rem; color: #5b6486; animation: jn-fade 3.2s ease both; }

        .jn-spark { position: absolute; width: 10px; height: 10px; background: ${TOMATO};
          clip-path: polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);
          animation: jn-twinkle 1.8s ease-in-out infinite; }
        .jn-spark--1 { top: 4%; left: 6%; }
        .jn-spark--2 { top: 14%; right: 2%; background: ${PURPLE}; animation-delay: .6s; }
        .jn-spark--3 { bottom: 6%; left: 14%; background: ${NAVY}; animation-delay: 1.1s; }

        /* atom */
        .jn-spin { transform-origin: 100px 100px; animation: jn-spin 9s linear infinite; }
        .jn-pulse { animation: jn-pulse 1.3s ease-in-out infinite; }
        .jn-blink { animation: jn-blink 3.2s infinite; }

        /* cradle */
        .jn-cradle-left { animation: jn-cl 1.6s infinite; }
        .jn-cradle-right { animation: jn-cr 1.6s infinite; }

        /* magnet */
        .jn-wobble { animation: jn-wobble 1.6s ease-in-out infinite; }
        .jn-field { animation: jn-dash 1s linear infinite; }
        .jn-field--2 { animation-duration: 1.4s; opacity: .7; }

        /* flask */
        .jn-wobble-slow { animation: jn-wobble 2.4s ease-in-out infinite; }
        .jn-wave { animation: jn-wave 2s linear infinite; }
        .jn-bubble { animation: jn-bubble 1.8s ease-in infinite; }
        .jn-puff { animation: jn-puff 2s ease-out infinite; opacity: 0; }

        /* dna */
        .jn-rung { animation: jn-rung 2.2s ease-in-out infinite; }
        .jn-sway { animation: jn-sway 3s ease-in-out infinite; }

        @keyframes jn-spin { to { transform: rotate(360deg); } }
        @keyframes jn-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.14); } }
        @keyframes jn-blink { 0%,92%,100% { transform: scaleY(1); } 96% { transform: scaleY(.1); } }
        @keyframes jn-hop { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes jn-twinkle { 0%,100% { transform: scale(.4) rotate(0); opacity: .3; } 50% { transform: scale(1.3) rotate(90deg); opacity: 1; } }
        @keyframes jn-fade { 0% { opacity: 0; transform: translateY(6px); } 12%,88% { opacity: 1; transform: none; } 100% { opacity: 0; } }

        @keyframes jn-cl {
          0% { transform: rotate(-38deg); animation-timing-function: cubic-bezier(.55,0,1,.45); }
          25% { transform: rotate(0); }
          75% { transform: rotate(0); animation-timing-function: cubic-bezier(0,.55,.45,1); }
          100% { transform: rotate(-38deg); }
        }
        @keyframes jn-cr {
          0%,25% { transform: rotate(0); animation-timing-function: cubic-bezier(0,.55,.45,1); }
          50% { transform: rotate(38deg); animation-timing-function: cubic-bezier(.55,0,1,.45); }
          75%,100% { transform: rotate(0); }
        }
        @keyframes jn-wobble { 0%,100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
        @keyframes jn-dash { to { stroke-dashoffset: -22; } }
        @keyframes jn-wave { to { transform: translateX(100px); } }
        @keyframes jn-bubble {
          0% { transform: translateY(0) scale(.6); opacity: 0; }
          20% { opacity: .9; }
          100% { transform: translateY(-55px) scale(1.1); opacity: 0; }
        }
        @keyframes jn-puff {
          0% { transform: translateY(0) scale(.5); opacity: 0; }
          30% { opacity: .8; }
          100% { transform: translateY(-22px) scale(1.4); opacity: 0; }
        }
        @keyframes jn-rung { 0%,100% { transform: scaleX(1); } 50% { transform: scaleX(-1); } }
        @keyframes jn-sway { 0%,100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }

        @media (prefers-reduced-motion: reduce) {
          .jn-loader * { animation: none !important; }
        }
      `}</style>
    </div>
  );
}