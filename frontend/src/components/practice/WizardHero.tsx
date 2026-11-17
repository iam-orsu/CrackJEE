import type { PracticeExamConfig } from './examConfig';

/* Hero: what a practice session is, the bank size, and (JEE) a teaser stack of sample papers */
/* ── Fake paper data for the teaser stack ─────────────── */
const PAPER_STACK = [
  {
    subject: 'Physics', left: 0, zIndex: 1,
    opacity: 0.68, cardBlur: 2.5, rotate: '-5deg', ty: '26px',
    q: { text: 'A block of mass m on frictionless incline at 30°. Normal reaction on block equals', opts: ['mg/2', 'mg cos30°', 'mg sin30°', 'mg'] },
  },
  {
    subject: 'Mathematics', left: 112, zIndex: 3,
    opacity: 1, cardBlur: 0, rotate: '0.5deg', ty: '0px',
    q: { text: 'f(x) = x³ − 3x² + 2x. Number of critical points in ℝ is', opts: ['0', '1', '2', '3'] },
  },
  {
    subject: 'Chemistry', left: 224, zIndex: 2,
    opacity: 0.68, cardBlur: 2.5, rotate: '5deg', ty: '20px',
    q: { text: 'The hybridisation of the central atom in XeF₄ is', opts: ['sp³d²', 'sp²', 'sp³', 'sp³d'] },
  },
];

interface WizardHeroProps {
  config: PracticeExamConfig;
  bankTotal: string;
  topicTotal: number | null;
}

export function WizardHero({ config, bankTotal, topicTotal }: WizardHeroProps) {
  return (
    <div className="paper-hero" style={{ background: '#fff', borderBottom: '1px solid rgba(0,51,102,.08)', padding: '44px 40px 40px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
      {/* the landing page's blob, anchored bottom-right */}
      <svg aria-hidden viewBox="0 0 900 700" preserveAspectRatio="xMaxYMax slice" style={{ position: 'absolute', bottom: '-14%', right: 0, height: '112%', width: 'min(46%,520px)', pointerEvents: 'none' }}>
        <defs>
          <linearGradient id="practice-hero-blob" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#803688" stopOpacity="0.20" />
            <stop offset="0.5" stopColor="#803688" stopOpacity="0.12" />
            <stop offset="1" stopColor="#B98CBE" stopOpacity="0.18" />
          </linearGradient>
        </defs>
        <path
          d="M1000 700 L1000 150 C946 92 862 62 772 78 C668 97 596 172 528 246 C462 318 396 378 310 414 C214 455 132 508 84 578 C52 626 30 668 24 700 Z"
          fill="url(#practice-hero-blob)"
        />
      </svg>

      <div className="paper-hero-inner" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 48, position: 'relative' }}>
        {/* Left: copy + stats */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: '#5A2560', textTransform: 'uppercase', marginBottom: 12 }}>
            {config.hero.kicker}
          </div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontSize: 34, fontWeight: 800, color: '#003366', lineHeight: 1.12, marginBottom: 14, letterSpacing: '-0.025em' }}>
            {config.hero.title.map((line, i) => (
              <span key={line}>{i > 0 && <br />}{line}</span>
            ))}
          </h1>
          <p style={{ fontSize: 14, color: '#5A6B8C', lineHeight: 1.65, marginBottom: 28, maxWidth: 360 }}>
            {config.hero.body}
          </p>
          <div style={{ display: 'flex', gap: 32 }}>
            {[
              { num: bankTotal, label: 'Questions' },
              { num: topicTotal !== null ? String(topicTotal) : '—', label: 'Topics' },
              { num: String(config.subjects.length), label: 'Subjects' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontSize: 24, fontWeight: 800, color: '#003366', letterSpacing: '-0.02em', lineHeight: 1 }}>{num}</div>
                <div style={{ fontSize: 10, color: '#7A87A0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 3 side-by-side paper cards with depth blur (JEE only, NEET has no paper preview) */}
        {config.hero.showTeaser && (
        <div className="paper-hero-stack" style={{ flexShrink: 0, position: 'relative', width: 400, height: 290 }}>
          {PAPER_STACK.map((paper, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: paper.left,
                top: 0,
                width: 176,
                background: '#fff',
                border: '1px solid rgba(0,51,102,.12)',
                borderRadius: 14,
                padding: '13px 15px 16px',
                boxShadow: paper.zIndex === 3
                  ? '0 10px 28px rgba(0,51,102,.14)'
                  : '0 3px 12px rgba(0,51,102,.08)',
                transform: `rotate(${paper.rotate}) translateY(${paper.ty})`,
                zIndex: paper.zIndex,
                opacity: paper.opacity,
                filter: paper.cardBlur > 0 ? `blur(${paper.cardBlur}px)` : undefined,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              {/* Paper header */}
              <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: '0.08em', color: '#7A87A0', textTransform: 'uppercase', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid rgba(0,51,102,.08)' }}>
                Practice paper &nbsp;·&nbsp; {paper.subject}
              </div>
              {/* Single question */}
              <div style={{ fontSize: 11, color: '#003366', lineHeight: 1.55, marginBottom: 10, fontWeight: 500 }}>
                <span style={{ fontWeight: 700, marginRight: 3 }}>Q1.</span>
                {paper.q.text}
              </div>
              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {paper.q.opts.map((opt, oi) => (
                  <div key={oi} style={{
                    fontSize: 10, color: '#5A6B8C',
                    padding: '4px 8px',
                    border: '1px solid rgba(0,51,102,.08)',
                    borderRadius: 7,
                    background: '#F8FAFF',
                  }}>
                    ({String.fromCharCode(65 + oi)}) {opt}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
