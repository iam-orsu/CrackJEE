'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { isAuthenticated } from '@/lib/auth';
import ArcCardCarousel, { type ArcCardItem } from '@/components/ui/arc-card-carousel';

/* ───────────────────────── SVG ILLUSTRATIONS ───────────────────────── */

/* ───────────────────────── SVG GRADIENT DEFS ───────────────────────── */

const AccentGradientDefs = () => (
  <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
    <defs>
      <linearGradient id="jn-accent" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#803688" />
        <stop offset="1" stopColor="#A24BA8" />
      </linearGradient>
    </defs>
  </svg>
);

const Atom = ({ size = 160 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    <g stroke="currentColor" strokeWidth="5" strokeLinecap="round">
      <ellipse cx="100" cy="100" rx="86" ry="32" />
      <ellipse cx="100" cy="100" rx="86" ry="32" transform="rotate(60 100 100)" />
      <ellipse cx="100" cy="100" rx="86" ry="32" transform="rotate(120 100 100)" />
    </g>
    <circle cx="100" cy="100" r="16" fill="url(#jn-accent)" />
    <circle cx="186" cy="100" r="9" fill="#A24BA8" />
    <circle cx="57" cy="25" r="9" fill="#fff" stroke="currentColor" strokeWidth="4" />
    <circle cx="57" cy="175" r="9" fill="#fff" stroke="currentColor" strokeWidth="4" />
  </svg>
);

const Flask = ({ size = 160 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    <path d="M78 22h44M88 22v52L36 158a16 16 0 0 0 14 24h100a16 16 0 0 0 14-24l-52-84V22" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M58 128h84l22 36a10 10 0 0 1-9 15H45a10 10 0 0 1-9-15z" fill="url(#jn-accent)" />
    <circle cx="92" cy="108" r="7" fill="#fff" stroke="currentColor" strokeWidth="4" />
    <circle cx="116" cy="90" r="5" fill="#fff" stroke="currentColor" strokeWidth="4" />
    <circle cx="104" cy="64" r="4" fill="#fff" stroke="currentColor" strokeWidth="3" />
  </svg>
);

const MathShape = ({ size = 160 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    <path d="M24 176V24M24 176h156" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    <path d="M24 176C60 176 70 40 110 40s46 136 70 136" stroke="url(#jn-accent)" strokeWidth="7" strokeLinecap="round" />
    <path d="M44 150l46-70 46 70z" fill="#fff" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
    <text x="128" y="70" fontSize="44" fontWeight="700" fill="currentColor" fontFamily="Fraunces, serif">π</text>
  </svg>
);

const Sparkle = ({ size = 28, color = '#fff' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z" />
  </svg>
);

const Rocket = () => (
  <svg width="90" height="90" viewBox="0 0 100 100" fill="none">
    <path d="M50 8c18 10 26 30 22 52H28C24 38 32 18 50 8z" fill="#fff" stroke="#003366" strokeWidth="4" strokeLinejoin="round" />
    <circle cx="50" cy="38" r="8" fill="#003366" />
    <path d="M28 60L12 76l18-4zM72 60l16 16-18-4z" fill="url(#jn-accent)" stroke="#003366" strokeWidth="4" strokeLinejoin="round" />
    <path d="M42 66h16l-8 24z" fill="url(#jn-accent)" />
  </svg>
);

const Leaf = ({ size = 160 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    {/* microscope */}
    <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M118 30l26 14-22 40-26-14z" fill="#fff" />
      <path d="M104 78l-8 14M132 70c26 18 26 58-6 74" />
      <path d="M92 160h72M104 144h40" />
      <rect x="92" y="150" width="72" height="12" rx="4" fill="#fff" />
    </g>
    {/* leaf */}
    <path d="M30 150c-4-40 14-72 52-84 4 40-8 74-52 84z" fill="#fff" fillOpacity=".9" />
    <path d="M32 148c14-28 30-50 48-70" stroke="#2E9E5B" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const IconChip = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <rect x="10" y="10" width="4" height="4" fill="#fff" />
    <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
  </svg>
);
const IconChart = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="14" width="4" height="7" rx="1" fill="#2E9E5B" />
    <rect x="10" y="10" width="4" height="11" rx="1" fill="#2E9E5B" />
    <rect x="17" y="6" width="4" height="15" rx="1" fill="#2E9E5B" />
    <path d="M3 9l6-5 4 3 7-5" stroke="#2E9E5B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconDoc = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M6 2h8l5 5v15H6z" fill="#3B6EF0" />
    <path d="M14 2v5h5" fill="#9DB8FA" />
    <path d="M9 12h7M9 15h7M9 18h5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const IconCal = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="16" rx="3" fill="#F5A33A" />
    <path d="M8 3v4M16 3v4" stroke="#C97A12" strokeWidth="2" strokeLinecap="round" />
    <path d="M7 12h2M11 12h2M15 12h2M7 16h2M11 16h2" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconHat = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 16a8 8 0 0 1 16 0z" fill="#FFC145" stroke="#FFC145" />
    <path d="M10 8V5h4v3M3 19h18" />
    <circle cx="12" cy="13" r="2" fill="#003366" stroke="#fff" />
  </svg>
);
const IconSteth = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3v6a4 4 0 0 0 8 0V3" />
    <path d="M10 13v2a5 5 0 0 0 10 0v-1" />
    <circle cx="20" cy="12" r="2" fill="#fff" />
  </svg>
);
const IconBook = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2A4FD6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z" />
    <path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z" />
  </svg>
);
const ArrowCircle = () => (
  <span className="jn-gs-arrow">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  </span>
);

/* ───────────────────────── DATA ───────────────────────── */

const subjects = [
  {
    name: 'Physics',
    tone: 'blue',
    art: <Atom />,
    topics: ['Kinematics', 'Optics', 'Electrostatics', 'Modern Physics'],
    line: 'From laws of motion to quantum ideas, practise concept by concept.',
  },
  {
    name: 'Chemistry',
    tone: 'red',
    art: <Flask />,
    topics: ['Mole Concept', 'Equilibrium', 'Organic', 'Periodic Table'],
    line: 'Reactions, bonding and numericals in bite-sized questions.',
  },
  {
    name: 'Mathematics',
    tone: 'blue',
    art: <MathShape />,
    topics: ['Calculus', 'Algebra', 'Coordinate Geometry', 'Probability'],
    line: 'Build speed and accuracy with fresh problems on every topic.',
  },
];

const superpowers = [
  { icon: <IconChip />, tone: 'purple', text: 'Get your customized learning plan with deep tech' },
  { icon: <IconChart />, tone: 'green', text: 'Get your score prediction' },
  { icon: <IconDoc />, tone: 'blue', text: 'More than 5000+ JEE and NEET Papers' },
  { icon: <IconCal />, tone: 'orange', text: '5 Years Previous Papers' },
];

const goals = [
  { name: 'JEE', sub: 'Main & Advanced', tone: 'jee', icon: <IconHat />, href: '/register?exam=jee' },
  { name: 'NEET', sub: 'UG', tone: 'neet', icon: <IconSteth />, href: '/register?exam=neet' },
];

const exploreSubjects = [
  { name: 'Physics', tone: 'phy', art: <Atom size={110} /> },
  { name: 'Chemistry', tone: 'chem', art: <Flask size={110} /> },
  { name: 'Mathematics', tone: 'math', art: <MathShape size={110} /> },
  { name: 'Biology', tone: 'bio', art: <Leaf size={110} /> },
];

const features = [
  {
    emoji: '🧠',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Questions crafted by Deep Tech',
    desc: 'Questions are generated for the topic you choose and checked by automatic rules (answer format, four distinct options, no duplicates) before they are stored.',
  },
  {
    emoji: '🎯',
    title: 'Weak area tracking',
    desc: 'The platform detects topics where your success rate drops below 60% and flags them so you focus effort where it counts.',
  },
  {
    emoji: '🔁',
    title: 'Questions you have seen are tracked',
    desc: 'Each question you answer is recorded, so you rarely see the same one twice. Once a topic is fully covered, questions can come back.',
  },
];

const battlefieldItems: ArcCardItem[] = [
  {
    title: 'Physics',
    meta: 'Kinematics · Optics · Electrostatics',
    alt: 'Physics concepts',
    src: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title: 'Chemistry',
    meta: 'Mole Concept · Organic · Equilibrium',
    alt: 'Chemistry concepts',
    src: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title: 'Mathematics',
    meta: 'Calculus · Algebra · Coordinate Geometry',
    alt: 'Mathematics concepts',
    src: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title: 'Biology',
    meta: 'Botany · Zoology',
    alt: 'Biology concepts',
    src: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const steps = [
  {
    num: '01',
    title: 'Choose subject & topic',
    desc: 'Select from Mathematics, Physics, or Chemistry. Pick any syllabus topic and difficulty level.',
  },
  {
    num: '02',
    title: 'Get a fresh question, every time',
    desc: 'A JEE-style question for your topic is served from the bank or generated on the fly, and checked by automatic rules before you see it.',
  },
  {
    num: '03',
    title: 'Get instant feedback',
    desc: 'Wrong answer? Get the full explanation. Your weak areas are tracked and surfaced in your dashboard.',
  },
];

const ticker = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Botany', 'Class 11', 'Class 12', 'JEE Main', 'JEE Advanced', 'NEET'];

/* ───────────────────────── PAGE ───────────────────────── */

export default function LandingPage() {
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) router.replace('/dashboard');
  }, [router]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-y * 14).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(x * 18).toFixed(2)}deg`);
  };
  const onLeave = () => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  const tilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 12}deg) rotateY(${x * 14}deg) translateY(-6px)`;
  };
  const untilt = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = '';
  };

  const showcaseTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1200px) rotateX(${-y * 8}deg) rotateY(${x * 10}deg) translateY(-4px)`;
  };
  const showcaseUntilt = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = '';
  };

  return (
    <>
      <style>{css}</style>
      <AccentGradientDefs />

      {/* ── Header ── */}
      <header className={`jn-header ${scrolled ? 'jn-header-scrolled' : ''}`}>
        <span className="jn-logo">
          <Image src="/logo.png" alt="JEENEET.ai" width={150} height={150} className="site-logo" />
        </span>
        <nav className="jn-nav">
          <Link href="/login" className="jn-btn jn-btn-ghost jn-sm">Sign in</Link>
          <Link href="/register" className="jn-btn jn-btn-red jn-sm">Get started free</Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="jn-hero" onMouseMove={onMove} onMouseLeave={onLeave}>
        {/*<div className="jn-grid-bg" />*/}
        <div className="jn-blob-svg" aria-hidden="true">
          <svg viewBox="0 0 900 700" preserveAspectRatio="xMaxYMax slice" fill="none">
            <defs>
              <linearGradient id="jn-blob-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#803688" stopOpacity="0.20" />
                <stop offset="0.5" stopColor="#803688" stopOpacity="0.12" />
                <stop offset="1" stopColor="#B98CBE" stopOpacity="0.18" />
              </linearGradient>
            </defs>
            <path
              d="M1000 700 L1000 150 C946 92 862 62 772 78 C668 97 596 172 528 246 C462 318 396 378 310 414 C214 455 132 508 84 578 C52 626 30 668 24 700 Z"
              fill="url(#jn-blob-fill)"
            />
          </svg>
        </div>
        <span className="jn-spark" style={{ top: '14%', left: '6%' }}><Sparkle size={26} color="#003366" /></span>
        <span className="jn-spark" style={{ top: '70%', left: '44%', animationDelay: '1s' }}><Sparkle size={18} color="#803688" /></span>
        <span className="jn-spark" style={{ top: '10%', left: '48%', animationDelay: '2s' }}><Sparkle size={16} color="#003366" /></span>

        <div className="jn-hero-inner">
          {/* Left copy */}
          <div className="jn-hero-copy">
            <span className="jn-pill"> Class 11 & 12 · JEE Main & Advanced · NEET</span>

            <h1 className="jn-title">
              Prepare for <span className="jn-hl">JEE</span> & <span className="jn-hl">NEET</span> with practice powered by <em>Deep Tech</em>
            </h1>

            <p className="jn-sub">
              Every question crafted fresh by our Deep Tech engine. Tracks your weak areas automatically.
              Practice smarter, not harder.
            </p>

            <div className="jn-ctas">
              <Link href="/register" className="jn-btn jn-btn-red jn-lg">Start practicing free →</Link>
              <Link href="/login" className="jn-btn jn-btn-white jn-lg">Sign in</Link>
            </div>

            <div className="jn-proof">
              {['Physics', 'Chemistry', 'Mathematics', 'Biology '].map((t) => (
                <span key={t} className="jn-proof-item"><i />{t}</span>
              ))}
            </div>
          </div>

          {/* Right 3D scene */}
          <div className="jn-scene">
            <div className="jn-stage" ref={stageRef}>
              <div className="jn-plate" />

              <div className="jn-card jn-card-back" />
              <div className="jn-card jn-card-mid" />

              {/* Question card */}
              <div className="jn-card jn-qcard">
                <div className="jn-q-top">
                  <span className="jn-chip-blue">Physics · Kinematics</span>
                  <span className="jn-chip-red">Medium</span>
                </div>
                <p className="jn-q-text">
                  A ball is thrown vertically upward at 20 m/s. Find the maximum height reached. (g = 10 m/s²)
                </p>
                <div className="jn-opts">
                  <div className="jn-opt"><b>A</b> 10 m</div>
                  <div className="jn-opt jn-opt-ok"><b>B</b> 20 m <span>✓</span></div>
                  <div className="jn-opt"><b>C</b> 30 m</div>
                  <div className="jn-opt"><b>D</b> 40 m</div>
                </div>
                <div className="jn-q-foot">🎉 Correct! See the full explanation</div>
              </div>

              {/* Floating 3D elements */}
              <div className="jn-float jn-f-atom"><Atom size={130} /></div>
              <div className="jn-float jn-f-rocket"><Rocket /></div>

              <div className="jn-float jn-f-weak">
                <p>Weak area spotted</p>
                <strong>Thermodynamics</strong>
                <div className="jn-bar"><span style={{ width: '54%' }} /></div>
                <small>54% · below 60%</small>
              </div>

              <div className="jn-float jn-f-chip jn-fc1">E = mc²</div>
              <div className="jn-float jn-f-chip jn-fc2">H₂O</div>
              <div className="jn-float jn-f-chip jn-fc3">∫ x dx</div>
              <div className="jn-float jn-f-chip jn-fc4">π</div>
            </div>
          </div>
        </div>


      </section>

      {/* ── Subject Banner ── */}
      <div className="jn-float-banner">
        <motion.div
          className="jn-float-banner-track"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
        >
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="jn-float-pill">
              {t}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Showcase ── */}
      <motion.section
        className="jn-showcase"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="jn-showcase-inner">
          <div className="jn-showcase-media" onMouseMove={showcaseTilt} onMouseLeave={showcaseUntilt}>
            <Image
              src="/mpc/landing.png"
              alt="A student celebrating, surrounded by a performance dial, an All India Rank card and a study plan for the day"
              width={1672}
              height={941}
              sizes="(max-width: 980px) 100vw, 640px"
              className="jn-showcase-img"
            />
          </div>

          <div className="jn-showcase-copy">
            <p className="jn-eyebrow">Progress tracking</p>
            <h2 className="jn-showcase-h2">Practice with 5000+ papers for JEE, JEE Advanced &amp; NEET</h2>
            <p className="jn-showcase-p">
              Access 5000+ curated practice papers and questions for JEE Main, JEE Advanced, and NEET.
              Every question is generated for the topic you pick and checked before you see it.
              The platform tracks your weak areas and helps you focus exactly where it matters to boost your scores.
            </p>


            <dl className="jn-showcase-meta">
              <div><dt>Class</dt><dd>11 &amp; 12</dd></div>
              <div><dt>Exams</dt><dd>JEE Main &amp; Advanced, NEET</dd></div>
            </dl>
          </div>
        </div>
      </motion.section>

      {/* ── Learning superpowers strip ── */}
      <section className="jn-gs">
        <div className="jn-sp">
          <div className="jn-sp-title">
            <h3>Your Learning<br />Superpowers</h3>
            <p>Powered by Deep Tech</p>
            <svg width="90" height="10" viewBox="0 0 90 10" fill="none"><path d="M2 8C20 1 60 1 88 6" stroke="#F5A33A" strokeWidth="3" strokeLinecap="round" /></svg>
          </div>
          {superpowers.map((s) => (
            <div key={s.text} className="jn-sp-item">
              <span className={`jn-sp-ico jn-sp-${s.tone}`}>{s.icon}</span>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Choose your goal + Explore subjects ── */}
      <section className="jn-gs">
        <div className="jn-gs-wrap">
          <div className="jn-goal">
            <h3>Choose Your Goal</h3>
            <p>Select your exam to start your journey</p>
            {goals.map((g) => (
              <Link key={g.name} href={g.href} className={`jn-goal-btn jn-goal-${g.tone}`}>
                <span className="jn-goal-ico">{g.icon}</span>
                <span className="jn-goal-txt"><strong>{g.name}</strong><small>{g.sub}</small></span>
                <ArrowCircle />
              </Link>
            ))}
          </div>

          <div className="jn-explore">
            <div className="jn-explore-head">
              <h3><IconBook /> Explore Subjects</h3>
              <Link href="/register" className="jn-viewall">View All →</Link>
            </div>
            <div className="jn-gs-grid">
              {exploreSubjects.map((s) => (
                <div key={s.name} className={`jn-gs-card jn-gs-${s.tone}`}>
                  <h4>{s.name}</h4>
                  <div className="jn-gs-art">{s.art}</div>
                  <Link href="/register" className="jn-gs-start">Start Learning →</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Subjects ── */}
      <motion.section
        className="jn-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="jn-label">Pick your battlefield</p>
        <h2 className="jn-h2">Four subjects. Every syllabus topic.</h2>

        <div className="w-full">
          <ArcCardCarousel items={battlefieldItems} height="90vh" loop={false} />
        </div>
      </motion.section>

      {/* ── Features ── */}
      <motion.section
        className="jn-section jn-soft"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="jn-label">Why JEENEET.ai</p>
        <h2 className="jn-h2">Built around how toppers actually study</h2>

        <div className="jn-features">
          {features.map((f, i) => (
            <div key={f.title} className={`jn-feature ${i === 1 ? 'jn-feature-red' : ''}`} onMouseMove={tilt} onMouseLeave={untilt}>
              <div className="jn-emoji">{f.emoji}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── How it works ── */}
      <section className="jn-section">
        <p className="jn-label">How it works</p>
        <h2 className="jn-h2">Three steps to better scores</h2>

        <div className="jn-steps">
          <svg className="jn-steps-line" viewBox="0 0 1000 40" preserveAspectRatio="none">
            <path d="M0 20 Q 125 -10 250 20 T 500 20 T 750 20 T 1000 20" stroke="#003366" strokeWidth="3" strokeDasharray="3 12" strokeLinecap="round" fill="none" />
          </svg>
          {steps.map((s) => (
            <div key={s.num} className="jn-step">
              <div className="jn-step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* ── CTA ── */}
      <section className="jn-cta">
        <span className="jn-cta-float" style={{ top: '14%', left: '8%' }}><Atom size={90} /></span>
        <span className="jn-cta-float" style={{ bottom: '12%', right: '9%', animationDelay: '1.5s' }}><Flask size={90} /></span>
        <h2>Ready to start?</h2>
        <p>Join students already preparing for JEE and NEET with our Deep Tech-powered platform.</p>
        <Link href="/register" className="jn-btn jn-btn-white jn-lg">Create free account →</Link>
      </section>

      {/* ── Footer ── */}
      <footer className="jn-footer">
        <span>© 2026 JEENEET.ai</span>
        <span>Built for IIT aspirants</span>
      </footer>
    </>
  );
}

/* ───────────────────────── STYLES ───────────────────────── */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=DM+Sans:wght@400;500;600;700;800&display=swap');
:root{
  --jn-blue:#003366;
  --jn-blue-d:#003366;
  --jn-blue-l:#2A4FD6;
  --jn-red:#803688;
  --jn-red-2:#A24BA8;
  --jn-red-d:#5A2560;
  --jn-grad:linear-gradient(135deg,#803688 0%,#A24BA8 100%);
  --jn-white:#FFFFFF;
  --jn-ice:#EEF2FF;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font-family:'DM Sans',system-ui,sans-serif;color:var(--jn-blue);background:#fff;overflow-x:hidden}
h1,h2,h3{margin:0;font-family:'Bricolage Grotesque',system-ui,sans-serif}

/* Buttons – chunky 3D */
.jn-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:800;text-decoration:none;border-radius:14px;transition:transform .15s,box-shadow .15s;white-space:nowrap}
.jn-sm{padding:10px 18px;font-size:14px}
.jn-lg{padding:16px 30px;font-size:17px}
.jn-btn-red{background:var(--jn-grad);color:#fff;box-shadow:0 6px 0 var(--jn-red-d)}
.jn-btn-white{background:#fff;color:var(--jn-blue);box-shadow:0 6px 0 #B9C6F5}
.jn-btn-ghost{background:#fff;color:var(--jn-blue);border:2px solid rgba(0,51,102,.42)}
.jn-btn-ghost:hover{border-color:var(--jn-blue)}
.jn-btn:hover{transform:translateY(-3px)}
.jn-btn-red:hover{box-shadow:0 9px 0 var(--jn-red-d)}
.jn-btn-white:hover{box-shadow:0 9px 0 #B9C6F5}
.jn-btn:active{transform:translateY(4px);box-shadow:0 2px 0 rgba(0,0,0,.25)}

/* Header */
.jn-header{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;justify-content:space-between;align-items:center;padding:6px clamp(18px,5vw,64px);transition:background .2s ease,box-shadow .2s ease,backdrop-filter .2s ease}
.jn-header-scrolled{background:rgba(255,255,255,0.95);backdrop-filter:saturate(180%) blur(8px);box-shadow:0 4px 20px rgba(0,51,102,0.06)}
.jn-logo{border-radius:14px;display:inline-flex;align-items:center}
.jn-logo .site-logo{width:auto;height:70px;max-width:none;display:block}
.jn-nav{display:flex;gap:12px;align-items:center}

/* Hero – white base, text in navy, no purple wash */
.jn-hero{position:relative;background:#fff;color:var(--jn-blue);padding:160px clamp(18px,5vw,64px) 150px;overflow:hidden}
.jn-grid-bg{position:absolute;inset:0;background-image:linear-gradient(rgba(0,51,102,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(0,51,102,.06) 1px,transparent 1px);background-size:44px 44px;margin:-1px;mask-image:radial-gradient(ellipse at center,#000 22%,transparent 74%);-webkit-mask-image:radial-gradient(ellipse at center,#000 22%,transparent 74%)}
.jn-spark{position:absolute;animation:jn-twinkle 3s ease-in-out infinite}
.jn-blob-svg{position:absolute;right:0;bottom:0;width:min(78%,980px);height:88%;pointer-events:none;z-index:0}
.jn-blob-svg svg{width:100%;height:100%;display:block}
.jn-hero-inner{position:relative;z-index:2;max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1.05fr 1fr;gap:40px;align-items:center}
.jn-pill{display:inline-block;background:rgba(0,51,102,.06);border:1px solid rgba(0,51,102,.26);padding:8px 16px;border-radius:999px;font-size:13px;font-weight:700}
.jn-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:clamp(36px,5.2vw,68px);line-height:1.05;margin:22px 0 18px;letter-spacing:-.02em;color:var(--jn-blue)}
.jn-title em{font-style:italic;color:#803688;text-decoration:underline;text-decoration-color:var(--jn-red);text-decoration-thickness:6px;text-underline-offset:8px}
.jn-hl{background:var(--jn-grad);color:#fff;padding:0 .22em;border-radius:12px;display:inline-block;transform:rotate(-2deg);box-shadow:0 6px 0 var(--jn-red-d)}
.jn-sub{font-size:clamp(16px,1.6vw,19px);line-height:1.65;max-width:540px;margin:0 0 30px}
.jn-ctas{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:30px}
.jn-hero .jn-btn-white{color:var(--jn-blue);border:2px solid var(--jn-blue);box-shadow:0 6px 0 rgba(0,51,102,.22)}
.jn-hero .jn-btn-white:hover{box-shadow:0 9px 0 rgba(0,51,102,.22)}
.jn-proof{display:flex;gap:10px 22px;flex-wrap:wrap;font-weight:700;font-size:14px}
.jn-proof-item{display:inline-flex;align-items:center;gap:8px}
.jn-proof-item i{width:10px;height:10px;border-radius:50%;background:var(--jn-red);box-shadow:0 0 0 3px rgba(0,51,102,.16)}

/* 3D scene */
.jn-scene{perspective:1400px;height:560px;display:flex;align-items:center;justify-content:center}
.jn-stage{--rx:0deg;--ry:0deg;position:relative;width:min(460px,100%);height:480px;transform-style:preserve-3d;transform:rotateX(calc(var(--rx) + 8deg)) rotateY(calc(var(--ry) - 14deg));transition:transform .25s ease-out}
.jn-plate{position:absolute;inset:20px -10px -30px -10px;border-radius:40px;background:rgba(0,51,102,.05);border:2px dashed rgba(0,51,102,.28);transform:translateZ(-80px)}
.jn-card{position:absolute;border-radius:28px;background:#fff;color:var(--jn-blue)}
.jn-card-back{inset:30px 10px 0 30px;background:var(--jn-grad);transform:translateZ(-30px)}
.jn-card-mid{inset:15px 20px 12px 14px;background:var(--jn-blue);transform:translateZ(-5px);border:3px solid rgba(255,255,255,.35)}
.jn-qcard{inset:0 30px 24px 0;padding:24px;transform:translateZ(40px);border:2px solid rgba(0,51,102,.12);display:flex;flex-direction:column;gap:14px}
.jn-q-top{display:flex;justify-content:space-between;gap:8px}
.jn-chip-blue,.jn-chip-red{font-size:12px;font-weight:800;padding:6px 12px;border-radius:999px}
.jn-chip-blue{background:var(--jn-ice);color:var(--jn-blue)}
.jn-chip-red{background:#F4E8F5;color:var(--jn-red-d)}
.jn-q-text{margin:0;font-weight:700;font-size:16px;line-height:1.5}
.jn-opts{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.jn-opt{display:flex;align-items:center;gap:10px;border:2px solid #D7DFFA;border-radius:14px;padding:12px;font-weight:700;font-size:15px}
.jn-opt b{width:26px;height:26px;border-radius:8px;background:var(--jn-ice);color:var(--jn-blue);display:grid;place-items:center;font-size:13px}
.jn-opt-ok{background:var(--jn-blue);border-color:var(--jn-blue);color:#fff}
.jn-opt-ok b{background:#fff}
.jn-opt-ok span{margin-left:auto}
.jn-q-foot{margin-top:auto;background:var(--jn-ice);border-radius:14px;padding:12px 14px;font-weight:700;font-size:13px;color:var(--jn-blue)}

.jn-float{position:absolute;transform-style:preserve-3d;animation:jn-bob 5s ease-in-out infinite}
.jn-f-atom{top:-50px;right:-30px;color:var(--jn-blue);transform:translateZ(110px)}
.jn-f-rocket{bottom:-30px;left:-40px;transform:translateZ(120px);animation-delay:1s}
.jn-f-weak{right:-34px;bottom:70px;width:190px;background:#fff;color:var(--jn-blue);border-radius:20px;padding:14px 16px;transform:translateZ(100px);animation-delay:.5s;border-left:6px solid var(--jn-red)}
.jn-f-weak p{margin:0;font-size:11px;font-weight:800;color:var(--jn-red-d);text-transform:uppercase;letter-spacing:.06em}
.jn-f-weak strong{display:block;font-size:15px;margin:2px 0 8px}
.jn-f-weak small{font-size:11px;font-weight:700;opacity:.7}
.jn-bar{height:8px;background:var(--jn-ice);border-radius:99px;overflow:hidden;margin-bottom:6px}
.jn-bar span{display:block;height:100%;background:var(--jn-grad);border-radius:99px}
.jn-f-chip{background:#fff;color:var(--jn-blue);font-family:'Fraunces',serif;font-weight:800;font-size:18px;padding:10px 16px;border-radius:14px;border:1px solid rgba(0,51,102,.14)}
.jn-fc1{top:60px;left:-50px;transform:translateZ(90px) rotate(-8deg)}
.jn-fc2{top:210px;left:-62px;transform:translateZ(70px) rotate(6deg);background:var(--jn-grad);color:#fff;animation-delay:1.2s}
.jn-fc3{bottom:110px;right:90px;transform:translateZ(130px) rotate(5deg);animation-delay:2s}
.jn-fc4{top:-24px;left:120px;transform:translateZ(100px) rotate(-6deg);animation-delay:2.4s;background:var(--jn-grad);color:#fff}

/* Floating Horizontal Banner */
.jn-float-banner{background:#fff;border-top:1px solid rgba(0,51,102,0.08);border-bottom:1px solid rgba(0,51,102,0.08);overflow:hidden;padding:12px 0;position:relative;width:100%}
.jn-float-banner-track{display:flex;gap:12px;align-items:center;will-change:transform}
.jn-float-pill{display:inline-flex;align-items:center;flex-shrink:0;padding:8px 18px;background:linear-gradient(90deg, rgba(0,51,102,0.03) 0%, rgba(128,54,136,0.03) 100%);color:var(--jn-blue);border:1px solid rgba(0,51,102,0.16);border-radius:999px;font-size:13px;font-weight:600;white-space:nowrap;box-shadow:0 2px 6px rgba(0,51,102,0.04)}

/* Showcase – image left, copy right */
.jn-showcase{background:#fff;padding:88px clamp(18px,5vw,64px) 96px}
.jn-showcase-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1.15fr .85fr;gap:64px;align-items:center}
.jn-showcase-media{position:relative;min-width:0;perspective:1200px;transition:transform .25s ease-out;transform-style:preserve-3d}
.jn-showcase-img{width:100%;height:auto;display:block;transition:transform .25s ease-out}
.jn-showcase-copy{min-width:0}
.jn-eyebrow{margin:0 0 16px;font-size:13px;font-weight:600;letter-spacing:.02em;color:#5A2560;font-family:'DM Sans',system-ui,sans-serif}
.jn-showcase-h2{margin:0 0 20px;font-size:clamp(28px,3.2vw,42px);font-weight:600;line-height:1.16;letter-spacing:-.02em;color:var(--jn-blue);font-family:'Bricolage Grotesque',system-ui,sans-serif}
.jn-showcase-p{margin:0 0 32px;max-width:46ch;font-size:17px;line-height:1.65;color:#4A5A78;font-family:'DM Sans',system-ui,sans-serif}
.jn-showcase-actions{display:flex;align-items:center;gap:28px;flex-wrap:wrap;margin-bottom:36px}
.jn-btn-solid{display:inline-flex;align-items:center;justify-content:center;padding:13px 24px;border-radius:8px;background:var(--jn-blue);color:#fff;font-size:15px;font-weight:600;text-decoration:none;transition:background .15s}
.jn-btn-solid:hover{background:#00284F}
.jn-textlink{display:inline-flex;align-items:center;gap:6px;font-size:15px;font-weight:600;color:var(--jn-blue);text-decoration:none}
.jn-textlink svg{transition:transform .15s}
.jn-textlink:hover svg{transform:translateX(3px)}
.jn-showcase-meta{display:flex;flex-wrap:wrap;gap:0;margin:0;padding-top:24px;border-top:1px solid rgba(0,51,102,.12)}
.jn-showcase-meta div{padding-right:28px;margin-right:28px;border-right:1px solid rgba(0,51,102,.12)}
.jn-showcase-meta div:last-child{padding-right:0;margin-right:0;border-right:0}
.jn-showcase-meta dt{margin:0 0 4px;font-size:12px;font-weight:500;color:#7A87A0}
.jn-showcase-meta dd{margin:0;font-size:14px;font-weight:600;color:var(--jn-blue);font-variant-numeric:tabular-nums}

/* Superpowers strip + Goal / Explore */
.jn-gs{background:#fff;padding:0 clamp(18px,5vw,64px) 40px}
.jn-sp{max-width:1240px;margin:0 auto;display:grid;grid-template-columns:1.15fr repeat(4,1fr);align-items:center;background:#fff;border:1px solid rgba(0,51,102,.1);border-radius:24px;box-shadow:0 12px 34px rgba(0,51,102,.1);padding:28px 12px}
.jn-sp-title{padding:0 32px}
.jn-sp-title h3{font-size:24px;font-weight:800;line-height:1.15;color:var(--jn-blue)}
.jn-sp-title p{margin:8px 0 6px;font-size:13px;font-weight:600;color:#4A5A78}
.jn-sp-item{display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;padding:6px 22px;border-left:1px solid rgba(0,51,102,.12);height:100%;justify-content:center}
.jn-sp-item p{margin:0;font-size:14px;font-weight:600;line-height:1.5;color:var(--jn-blue)}
.jn-sp-ico{width:52px;height:52px;border-radius:14px;display:grid;place-items:center}
.jn-sp-purple{background:#7B4FE0}
.jn-sp-green{background:#E3F5EA}
.jn-sp-blue{background:#E2EAFE}
.jn-sp-orange{background:#FDEBD0}

.jn-gs-wrap{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:.8fr 2.2fr;gap:22px;background:#F6F8FF;border:1px solid rgba(0,51,102,.08);border-radius:26px;padding:24px;box-shadow:0 10px 30px rgba(0,51,102,.06)}
.jn-goal h3,.jn-explore-head h3{font-size:22px;font-weight:800;color:var(--jn-blue);display:flex;align-items:center;gap:8px}
.jn-goal>p{margin:6px 0 20px;font-size:13px;color:#5A6B8C;font-weight:500}
.jn-goal-btn{display:flex;align-items:center;gap:14px;padding:18px;border-radius:16px;color:#fff;text-decoration:none;margin-bottom:16px;transition:transform .15s,box-shadow .15s}
.jn-goal-btn:hover{transform:translateY(-3px);box-shadow:0 10px 20px rgba(0,51,102,.2)}
.jn-goal-jee{background:linear-gradient(135deg,#2A4FD6,#3F7BFF)}
.jn-goal-neet{background:linear-gradient(135deg,#2E9E5B,#5BCB84)}
.jn-goal-ico{display:grid;place-items:center;width:46px}
.jn-goal-txt{display:flex;flex-direction:column;flex:1}
.jn-goal-txt strong{font-size:20px;font-weight:800;line-height:1.1}
.jn-goal-txt small{font-size:12px;font-weight:600;opacity:.9}
.jn-gs-arrow{width:30px;height:30px;border-radius:50%;background:#fff;color:var(--jn-blue);display:grid;place-items:center}

.jn-explore-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.jn-viewall{font-size:13px;font-weight:700;color:#2A4FD6;text-decoration:none}
.jn-gs-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.jn-gs-card{border-radius:18px;padding:16px 14px 18px;color:#fff;text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px;transition:transform .15s,box-shadow .15s}
.jn-gs-card:hover{transform:translateY(-4px);box-shadow:0 12px 22px rgba(0,51,102,.22)}
.jn-gs-card h4{margin:0;font-size:16px;font-weight:700;align-self:flex-start}
.jn-gs-art{display:grid;place-items:center;height:120px;color:#fff;animation:jn-bob 6s ease-in-out infinite}
.jn-gs-art svg [fill="url(#jn-accent)"]{fill:#FFC145}
.jn-gs-art svg [stroke="url(#jn-accent)"]{stroke:#FFC145}
.jn-gs-phy{background:linear-gradient(160deg,#2A4FD6,#4C86FF)}
.jn-gs-chem{background:linear-gradient(160deg,#6A35C9,#9A5FE6)}
.jn-gs-math{background:linear-gradient(160deg,#2E9E5B,#62CC8B)}
.jn-gs-bio{background:linear-gradient(160deg,#1E8A66,#4FBF98)}
.jn-gs-start{display:inline-block;background:#fff;color:var(--jn-blue);font-size:12px;font-weight:700;padding:8px 16px;border-radius:999px;text-decoration:none;margin-top:auto}

/* Sections */
.jn-section{padding:96px clamp(18px,5vw,64px);max-width:100%;text-align:center}
.jn-soft{background:var(--jn-ice)}
.jn-label{display:inline-block;margin:0 0 14px;background:var(--jn-grad);color:#fff;font-weight:800;font-size:12px;letter-spacing:.12em;text-transform:uppercase;padding:7px 14px;border-radius:999px}
.jn-h2{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:clamp(30px,4vw,52px);line-height:1.1;letter-spacing:-.02em;max-width:760px;margin:0 auto 56px;color:var(--jn-blue)}

/* Subject cards */
.jn-subjects{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;max-width:1200px;margin:0 auto}
.jn-subject{border-radius:32px;padding:34px 28px;text-align:left;transition:transform .15s ease-out,box-shadow .2s;position:relative;overflow:hidden}
.jn-subject.jn-blue{background:var(--jn-blue);color:#fff;box-shadow:0 12px 0 var(--jn-blue-d)}
.jn-subject.jn-red{background:var(--jn-grad);color:#fff;box-shadow:0 12px 0 var(--jn-red-d)}
.jn-subject-art{display:grid;place-items:center;height:190px;margin-bottom:16px;background:rgba(255,255,255,.12);border-radius:24px;color:#fff;animation:jn-bob 6s ease-in-out infinite}
.jn-subject h3{font-family:'Fraunces',serif;font-size:32px;margin-bottom:8px}
.jn-subject p{margin:0 0 18px;line-height:1.6;opacity:.92;font-size:15px}
.jn-tags{display:flex;flex-wrap:wrap;gap:8px}
.jn-tags span{background:#fff;color:var(--jn-blue);font-weight:700;font-size:12px;padding:6px 12px;border-radius:999px}

/* Feature cards */
.jn-features{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;max-width:1200px;margin:0 auto}
.jn-feature{background:#fff;border:3px solid var(--jn-blue);border-radius:28px;padding:32px 28px;text-align:left;box-shadow:10px 10px 0 var(--jn-blue);transition:transform .15s ease-out}
.jn-feature-red{border-color:var(--jn-red-2);box-shadow:10px 10px 0 var(--jn-red-2)}
.jn-emoji{width:64px;height:64px;border-radius:20px;background:var(--jn-ice);display:grid;place-items:center;font-size:32px;margin-bottom:18px;box-shadow:0 5px 0 #C6D2F8}
.jn-feature-red .jn-emoji{background:#F4E8F5;box-shadow:0 5px 0 #D8BEDB}
.jn-feature h3{font-size:21px;margin-bottom:10px;color:var(--jn-blue)}
.jn-feature p{margin:0;line-height:1.65;font-size:15px;color:#31407F}

/* Steps */
.jn-steps{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:40px;max-width:1100px;margin:0 auto}
.jn-steps-line{position:absolute;top:22px;left:10%;width:80%;height:40px;z-index:0}
.jn-step{position:relative;z-index:1}
.jn-step-num{width:84px;height:84px;margin:0 auto 18px;border-radius:50%;background:var(--jn-grad);color:#fff;display:grid;place-items:center;font-family:'Fraunces',serif;font-weight:800;font-size:30px;box-shadow:0 8px 0 var(--jn-red-d);border:5px solid #fff;outline:3px solid var(--jn-red)}
.jn-step:nth-child(3) .jn-step-num{background:var(--jn-blue);box-shadow:0 8px 0 var(--jn-blue-d);outline-color:var(--jn-blue)}
.jn-step h3{font-size:21px;color:var(--jn-blue);margin-bottom:8px}
.jn-step p{margin:0 auto;max-width:320px;line-height:1.65;color:#31407F;font-size:15px}

/* Stats */
.jn-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;background:var(--jn-blue);color:#fff;padding:54px clamp(18px,5vw,64px);text-align:center;border-top:6px solid var(--jn-red)}
.jn-stats strong{display:block;font-family:'Fraunces',serif;font-size:clamp(32px,4vw,52px)}
.jn-stats span{font-weight:600;opacity:.85;font-size:14px}

/* CTA */
.jn-cta{position:relative;background:var(--jn-grad);color:#fff;text-align:center;padding:100px 24px;overflow:hidden}
.jn-cta h2{font-family:'Fraunces',serif;font-size:clamp(34px,5vw,60px);margin-bottom:14px}
.jn-cta p{max-width:560px;margin:0 auto 32px;font-size:18px;line-height:1.6;opacity:.95}
.jn-cta-float{position:absolute;color:#fff;opacity:.9;animation:jn-bob 5s ease-in-out infinite}

/* Footer */
.jn-footer{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;background:var(--jn-blue-d);color:#fff;padding:22px clamp(18px,5vw,64px);font-size:13px;font-weight:600}

/* Animations */
@keyframes jn-bob{0%,100%{translate:0 0}50%{translate:0 -14px}}
@keyframes jn-twinkle{0%,100%{opacity:.3;scale:.8}50%{opacity:1;scale:1.2}}
@keyframes jn-scroll{to{transform:translateX(-33.333%)}}

/* Responsive */
@media(max-width:980px){
  .jn-hero{padding-top:110px;padding-bottom:120px}
  .jn-showcase{padding:64px clamp(18px,5vw,64px) 72px}
  .jn-showcase-inner{grid-template-columns:1fr;gap:40px}
  .jn-showcase-copy{order:-1}
  .jn-blob-svg{width:100%;height:70%;opacity:.85}
  .jn-hero-inner{grid-template-columns:1fr;text-align:center}
  .jn-sub{margin-left:auto;margin-right:auto}
  .jn-ctas,.jn-proof{justify-content:center}
  .jn-scene{height:520px;margin-top:10px}
  .jn-subjects,.jn-features{grid-template-columns:1fr;max-width:520px}
  .jn-steps{grid-template-columns:1fr;gap:44px}
  .jn-steps-line{display:none}
  .jn-stats{grid-template-columns:repeat(2,1fr)}
  .jn-sp{grid-template-columns:1fr 1fr;row-gap:18px}
  .jn-sp-title{grid-column:1/-1;padding-bottom:6px}
  .jn-sp-item:nth-child(2),.jn-sp-item:nth-child(4){border-left:0}
  .jn-gs-wrap{grid-template-columns:1fr}
  .jn-gs-grid{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:520px){
  .jn-stage{height:440px;width:300px}
  .jn-qcard{padding:16px}
  .jn-q-text{font-size:14px}
  .jn-opt{padding:9px;font-size:13px}
  .jn-f-atom{right:-10px;top:-40px}
  .jn-f-atom svg{width:90px;height:90px}
  .jn-f-weak{right:-10px;width:160px}
  .jn-f-rocket{left:-10px}
  .jn-fc1,.jn-fc2{left:-14px}
  .jn-nav .jn-btn-ghost{display:none}
}
@media(prefers-reduced-motion:reduce){
  *{animation:none!important;transition:none!important}
}
`;