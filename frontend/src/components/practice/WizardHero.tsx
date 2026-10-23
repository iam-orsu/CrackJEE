/* Teaser stack of sample papers: explains what a practice session is, before the student picks topics */
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
  bankTotal: string;
  topicTotal: number | null;
}

export function WizardHero({ bankTotal, topicTotal }: WizardHeroProps) {
  return (
    <div className="paper-hero" style={{ background: '#fff', borderBottom: '1px solid var(--gray-200)', padding: '40px 40px 36px', flexShrink: 0 }}>
      <div className="paper-hero-inner" style={{ maxWidth: 920, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 48 }}>

        {/* Left: copy + stats */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 10 }}>
            Practice Mode
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.18, marginBottom: 12, letterSpacing: '-0.025em' }}>
            A fresh paper<br />every session
          </h1>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.65, marginBottom: 28, maxWidth: 340 }}>
            Each session draws a new set of questions from the bank across Physics, Chemistry and Mathematics. You see the answer and explanation after every question.
          </p>
          <div style={{ display: 'flex', gap: 28 }}>
            {[
              { num: bankTotal, label: 'Questions' },
              { num: topicTotal !== null ? String(topicTotal) : '—', label: 'Topics' },
              { num: '3', label: 'Subjects' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em' }}>{num}</div>
                <div style={{ fontSize: 10, color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 1 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 3 side-by-side paper cards with depth blur */}
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
                border: '1px solid #e5e7eb',
                borderRadius: 6,
                padding: '11px 13px 14px',
                boxShadow: paper.zIndex === 3
                  ? '0 6px 24px rgba(0,0,0,0.13)'
                  : '0 2px 10px rgba(0,0,0,0.07)',
                transform: `rotate(${paper.rotate}) translateY(${paper.ty})`,
                zIndex: paper.zIndex,
                opacity: paper.opacity,
                filter: paper.cardBlur > 0 ? `blur(${paper.cardBlur}px)` : undefined,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              {/* Paper header */}
              <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: '0.08em', color: '#9ca3af', textTransform: 'uppercase', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid #f3f4f6' }}>
                Practice paper &nbsp;·&nbsp; {paper.subject}
              </div>
              {/* Single question */}
              <div style={{ fontSize: 11, color: '#1f2937', lineHeight: 1.55, marginBottom: 10, fontWeight: 400 }}>
                <span style={{ fontWeight: 700, marginRight: 3 }}>Q1.</span>
                {paper.q.text}
              </div>
              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {paper.q.opts.map((opt, oi) => (
                  <div key={oi} style={{
                    fontSize: 10, color: '#4b5563',
                    padding: '3px 7px',
                    border: '1px solid #f3f4f6',
                    borderRadius: 3,
                    background: '#fafafa',
                  }}>
                    ({String.fromCharCode(65 + oi)}) {opt}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
