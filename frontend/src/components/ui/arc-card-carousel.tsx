"use client"

import * as React from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"


gsap.registerPlugin(ScrollTrigger)

export type TopicGroup = {
  /** e.g. "Class 11" */
  label: string
  items: string[]
}

export type ArcCardItem = {
  src: string
  alt?: string
  /** Shown beside the flat card. Without any titles the caption is left out. */
  title?: string
  /** A small line under the title. */
  meta?: string
  /** Every topic of the subject, grouped. Falls back to SUBJECT_TOPICS by title. */
  topics?: TopicGroup[]
}

export type ArcCardCarouselProps = {
  items: ArcCardItem[]
  /** Height of the pinned stage. **Must be a definite length.** */
  height?: string
  /** Scroll per card, as a fraction of the stage height. */
  scrollPerCard?: number
  /** Degrees of the wheel between neighbouring cards. */
  step?: number
  /** Card corner radius in px. */
  radius?: number
  /** Show the number, title and topics beside the flat card. */
  caption?: boolean
  /**
   * Scroll on forever: past the last card the wheel comes round to the first
   * again, and up past the first to the last. The page can't scroll beyond the
   * section, so use it as the page or a full-screen view.
   */
  loop?: boolean
  onIndexChange?: (index: number) => void
  ariaLabel?: string
  className?: string
}

// #region topics
/**
 * Default topic lists (Class 11 + 12 chapters). Edit these to match the exact
 * topic names in your question bank, or pass `topics` on each item.
 */
export const SUBJECT_TOPICS: Record<"physics" | "chemistry" | "mathematics" | "biology", TopicGroup[]> = {
  physics: [
    {
      label: "Class 11",
      items: [
        "Units & Measurements",
        "Motion in a Straight Line",
        "Motion in a Plane",
        "Laws of Motion",
        "Work, Energy & Power",
        "Rotational Motion",
        "Gravitation",
        "Properties of Solids",
        "Properties of Fluids",
        "Thermal Properties",
        "Thermodynamics",
        "Kinetic Theory",
        "Oscillations",
        "Waves",
      ],
    },
    {
      label: "Class 12",
      items: [
        "Electric Charges & Fields",
        "Potential & Capacitance",
        "Current Electricity",
        "Moving Charges & Magnetism",
        "Magnetism & Matter",
        "Electromagnetic Induction",
        "Alternating Current",
        "Electromagnetic Waves",
        "Ray Optics",
        "Wave Optics",
        "Dual Nature of Matter",
        "Atoms",
        "Nuclei",
        "Semiconductor Electronics",
      ],
    },
  ],
  chemistry: [
    {
      label: "Class 11",
      items: [
        "Basic Concepts of Chemistry",
        "Structure of Atom",
        "Periodic Classification",
        "Chemical Bonding",
        "States of Matter",
        "Thermodynamics",
        "Equilibrium",
        "Redox Reactions",
        "Hydrogen",
        "s-Block Elements",
        "p-Block (Group 13 & 14)",
        "Organic: Basic Principles",
        "Hydrocarbons",
      ],
    },
    {
      label: "Class 12",
      items: [
        "Solid State",
        "Solutions",
        "Electrochemistry",
        "Chemical Kinetics",
        "Surface Chemistry",
        "p-Block (Group 15 to 18)",
        "d & f-Block Elements",
        "Coordination Compounds",
        "Haloalkanes & Haloarenes",
        "Alcohols, Phenols & Ethers",
        "Aldehydes, Ketones & Acids",
        "Amines",
        "Biomolecules",
        "Polymers",
        "Chemistry in Everyday Life",
      ],
    },
  ],
  mathematics: [
    {
      label: "Class 11",
      items: [
        "Sets",
        "Relations & Functions",
        "Trigonometric Functions",
        "Mathematical Induction",
        "Complex Numbers",
        "Linear Inequalities",
        "Permutations & Combinations",
        "Binomial Theorem",
        "Sequences & Series",
        "Straight Lines",
        "Conic Sections",
        "Intro to 3D Geometry",
        "Limits & Derivatives",
        "Statistics",
        "Probability",
      ],
    },
    {
      label: "Class 12",
      items: [
        "Relations & Functions",
        "Inverse Trigonometry",
        "Matrices",
        "Determinants",
        "Continuity & Differentiability",
        "Applications of Derivatives",
        "Integrals",
        "Applications of Integrals",
        "Differential Equations",
        "Vector Algebra",
        "3D Geometry",
        "Linear Programming",
        "Probability",
      ],
    },
  ],
  biology: [
    {
      label: "Class 11",
      items: [
        "The Living World",
        "Biological Classification",
        "Plant Kingdom",
        "Animal Kingdom",
        "Morphology of Flowering Plants",
        "Anatomy of Flowering Plants",
        "Structural Organisation in Animals",
        "Cell: The Unit of Life",
        "Biomolecules",
        "Cell Cycle & Division",
        "Transport in Plants",
        "Mineral Nutrition",
        "Photosynthesis",
        "Respiration in Plants",
        "Plant Growth & Development",
        "Digestion & Absorption",
        "Breathing & Gas Exchange",
        "Body Fluids & Circulation",
        "Excretory Products",
        "Locomotion & Movement",
        "Neural Control",
        "Chemical Coordination",
      ],
    },
    {
      label: "Class 12",
      items: [
        "Reproduction in Flowering Plants",
        "Human Reproduction",
        "Reproductive Health",
        "Principles of Inheritance",
        "Molecular Basis of Inheritance",
        "Evolution",
        "Human Health & Disease",
        "Microbes in Human Welfare",
        "Biotechnology: Principles",
        "Biotechnology: Applications",
        "Organisms & Populations",
        "Ecosystem",
        "Biodiversity & Conservation",
      ],
    },
  ],
}

/** The topic groups for an item: its own, else matched from its title. */
export function topicsFor(it: ArcCardItem): TopicGroup[] {
  if (it.topics) return it.topics
  const t = (it.title ?? it.alt ?? "").toLowerCase()
  if (t.includes("phys")) return SUBJECT_TOPICS.physics
  if (t.includes("chem")) return SUBJECT_TOPICS.chemistry
  if (t.includes("math")) return SUBJECT_TOPICS.mathematics
  if (t.includes("bio")) return SUBJECT_TOPICS.biology
  return []
}
// #endregion

// #region wheel
/** Where item `i` sits relative to the position, wrapped to [-n/2, n/2). */
export function offsetOf(i: number, pos: number, n: number): number {
  if (n <= 0) return 0
  const d = (((i - pos) % n) + n) % n
  return d >= n / 2 ? d - n : d
}

/** Cards on the rim: the list repeated to at least ten, so the wrap happens off screen. */
export function ringSize(len: number): number {
  return len > 0 ? Math.ceil(10 / len) * len : 0
}

export function wrapIndex(i: number, n: number): number {
  if (n <= 0) return 0
  return ((Math.round(i) % n) + n) % n
}

/**
 * Proportions measured off the reference at 680px tall: the flat card is
 * 0.30 of the height wide, its centre 0.284 in from the left, and the hub
 * 0.71 of the height behind it. `u` is that height, shrunk on narrow stages.
 * On narrow stages the flat card rides high, leaving the lower part of the
 * screen for the topics sheet.
 */
export function geometry(w: number, h: number, narrow = false) {
  const u = Math.min(h, w / 0.47)
  const cardW = 0.3 * u
  return {
    cardW,
    cardH: cardW / 1.65,
    radius: 0.71 * u,
    hubX: 0.284 * u - 0.71 * u,
    hubY: (narrow ? 0.24 : 0.475) * h,
  }
}

/**
 * Centre and turn (degrees) of a card `d` steps after the flat one. Later
 * cards wait above, so scrolling on rolls the wheel down as in the reference.
 */
export function place(d: number, stepDeg: number, g: { radius: number; hubX: number; hubY: number }) {
  const deg = -d * stepDeg
  const a = (deg * Math.PI) / 180
  return { x: g.hubX + g.radius * Math.cos(a), y: g.hubY + g.radius * Math.sin(a), rot: deg }
}

/**
 * Card steps along the section. Looping, the section runs one step past the
 * last card, back round to the first, so its bottom looks exactly like its top
 * and the scroll can jump from one to the other unseen.
 */
export function spans(count: number, loop: boolean): number {
  return Math.max(0, loop ? count : count - 1)
}

/** The wheel's position for a scroll progress (0-1) after `laps` trips through the section. */
export function positionAt(progress: number, laps: number, steps: number): number {
  return (progress + laps) * steps
}

/** Scroll offset inside the section that brings card `i` flat. */
export function scrollFor(i: number, steps: number, start: number, end: number): number {
  return steps > 0 ? start + (i / steps) * (end - start) : start
}
// #endregion

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=DM+Sans:wght@500;600;700&display=swap');

.acc-track{position:relative;background:var(--color-background,#fff)}
.acc-stage{position:sticky;top:0;overflow:hidden;background:var(--color-background,#fff)}

/* blob background: bottom right, reaching toward the centre */
.acc-blob{position:absolute;z-index:0;pointer-events:none}
.acc-blob-a{width:min(86vw,1300px);aspect-ratio:1.1;right:-22vw;bottom:-28vh;background:#EDE3EF;border-radius:58% 42% 47% 53% / 52% 61% 39% 48%}
.acc-blob-b{width:min(44vw,640px);aspect-ratio:1;right:6vw;bottom:-14vh;background:#F5EDF7;border-radius:46% 54% 60% 40% / 52% 44% 56% 48%}
.acc-blob-c{width:min(30vw,440px);aspect-ratio:1;right:-9vw;top:-17vh;background:#EEF1FB;border-radius:55% 45% 38% 62% / 48% 57% 43% 52%}
.acc-spark{position:absolute;z-index:0;pointer-events:none}
.acc-sp1{width:28px;right:9vw;top:13%;fill:#003366}
.acc-sp2{width:22px;right:34vw;bottom:11%;fill:#803688}

.acc-card{position:absolute;left:0;top:0;overflow:hidden;will-change:transform;cursor:pointer;
  box-shadow:0 1px 2px rgba(0,0,0,.08),0 14px 34px -10px rgba(0,0,0,.38);background:var(--color-border,#dfe3f3)}
.acc-card>img{display:block;width:100%;height:100%;max-width:none;object-fit:cover;pointer-events:none}
.acc-card:focus-visible{outline:3px solid #803688;outline-offset:3px}

/* caption + topics, right of the flat card */
.acc-cap{
  --k:1; --chip:clamp(10.5px,1.5vh,13.5px);
  position:absolute;transform:translateY(-50%);color:#003366;z-index:1000;
  display:flex;flex-direction:column;gap:calc(14px*var(--k));
  max-height:94%;overflow-y:auto;scrollbar-width:none;
  font-family:'DM Sans',system-ui,sans-serif;
}
.acc-cap::-webkit-scrollbar{display:none}
.acc-head{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
.acc-num{margin:0;padding:6px 13px;border-radius:99px;background:#EEF2FF;border:1.5px solid #B9C4EE;
  font-size:12.5px;font-weight:700;letter-spacing:.04em;font-variant-numeric:tabular-nums;color:#003366}
.acc-count{margin:0;padding:6px 14px;border-radius:99px;background:linear-gradient(135deg,#803688,#A24BA8);color:#fff;
  font-size:12.5px;font-weight:700;box-shadow:0 3px 0 #5A2560}
.acc-title{margin:0;font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:clamp(36px,5vw,78px);
  line-height:1;letter-spacing:-.035em;font-weight:800;color:#003366}
.acc-meta{margin:0;font-size:15px;line-height:1.5;color:#3C4A8A;max-width:46ch}

.acc-groups{display:grid;gap:calc(16px*var(--k))}
.acc-group{display:grid;gap:calc(9px*var(--k))}
.acc-ghead{display:flex;align-items:center;gap:8px}
.acc-ghead h4{margin:0;font-size:calc(var(--chip)*var(--k)*1.08);font-weight:700;color:#003366}
.acc-gdot{width:10px;height:10px;border-radius:50%;background:#003366;flex:none}
.acc-ghead em{font-style:normal;font-size:calc(var(--chip)*var(--k)*.92);font-weight:700;padding:1px 9px;border-radius:99px;background:#EEF2FF;color:#003366}
.acc-rule{flex:1;height:2px;border-radius:2px;background:repeating-linear-gradient(90deg,#C6D2F8 0 6px,transparent 6px 11px)}
.acc-g1 .acc-gdot{background:#803688}
.acc-g1 .acc-ghead em{background:#F3E5F5;color:#803688}
.acc-g1 .acc-rule{background:repeating-linear-gradient(90deg,#E3C9E6 0 6px,transparent 6px 11px)}

.acc-chips{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:calc(8px*var(--k)) calc(7px*var(--k))}
.acc-chip{
  font-size:calc(var(--chip)*var(--k));font-weight:600;line-height:1.2;padding:.5em .85em;border-radius:.75em;
  background:#fff;border:1.5px solid #003366;color:#003366;box-shadow:0 3px 0 #C6D2F8;white-space:nowrap;
  transition:transform .15s,box-shadow .15s,background .15s;
}
.acc-chip:hover{transform:translateY(-2px);box-shadow:0 5px 0 #C6D2F8;background:#EEF2FF}
.acc-g1 .acc-chip{border-color:#803688;color:#5A2560;box-shadow:0 3px 0 #E3C9E6}
.acc-g1 .acc-chip:hover{box-shadow:0 5px 0 #E3C9E6;background:#F8EEF9}

/* narrow screens: photo cards on top, topics in a bottom sheet */
.acc-cap[data-narrow]{
  --chip:11.5px;
  left:0 !important;right:0 !important;top:auto !important;bottom:0;transform:none;width:auto;
  max-height:58%;padding:48px 18px 18px;gap:12px;
  background:linear-gradient(to top,var(--color-background,#fff) calc(100% - 48px),transparent);
}
.acc-cap[data-narrow] .acc-title{font-size:30px}
.acc-cap[data-narrow] .acc-meta{font-size:13px}
.acc-cap[data-narrow] .acc-num,.acc-cap[data-narrow] .acc-count{font-size:11.5px;padding:5px 11px}

.acc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
`

export default function ArcCardCarousel({
  items,
  height = "100svh",
  scrollPerCard = 0.6,
  step = 14,
  radius = 10,
  caption = true,
  loop = true,
  onIndexChange,
  ariaLabel = "Photo carousel",
  className = "",
}: ArcCardCarouselProps) {
  const count = items.length
  const n = ringSize(count)
  const cards = React.useMemo(() => Array.from({ length: n }, (_, i) => items[i % count]), [items, n, count])
  const trackRef = React.useRef(null as HTMLDivElement | null)
  const stageRef = React.useRef(null as HTMLDivElement | null)
  const capRef = React.useRef(null as HTMLDivElement | null)
  const cardRefs = React.useRef([] as (HTMLDivElement | null)[])
  const pos = React.useRef({ v: 0 })
  const st = React.useRef(null as ScrollTrigger | null)
  const geo = React.useRef(geometry(1, 1))
  const narrowRef = React.useRef(false)
  const [index, setIndex] = React.useState(0)
  const [narrow, setNarrow] = React.useState(false)
  const [reduced, setReduced] = React.useState(false)
  const onIndexRef = React.useRef(onIndexChange)
  onIndexRef.current = onIndexChange
  const showCaption = caption && items.some((it) => it.title)

  // Topics panel sits to the right of the flat card.
  const placeCaption = React.useCallback(() => {
    const cap = capRef.current
    const el = stageRef.current
    if (!cap || !el) return
    if (narrowRef.current) {
      cap.style.left = ""
      cap.style.right = ""
      cap.style.top = ""
      return
    }
    const g = geo.current
    const w = el.clientWidth
    const cardRight = g.hubX + g.radius + g.cardW / 2
    const gap = Math.max(32, g.cardW * 0.16)
    cap.style.top = g.hubY + "px"
    cap.style.left = cardRight + gap + "px"
    cap.style.right = Math.max(24, w * 0.04) + "px"
  }, [])

  // Long topic lists shrink a little so they fit the pinned stage without scrolling.
  const fitCaption = React.useCallback(() => {
    const cap = capRef.current
    const el = stageRef.current
    if (!cap || !el) return
    cap.style.setProperty("--k", "1")
    if (narrowRef.current) return
    const avail = el.clientHeight * 0.9
    let k = 1
    while (k > 0.76 && cap.scrollHeight - 16 > avail) {
      k -= 0.04
      cap.style.setProperty("--k", k.toFixed(2))
    }
  }, [])

  const render = React.useCallback(() => {
    const g = geo.current
    const p = pos.current.v
    for (let i = 0; i < n; i++) {
      const el = cardRefs.current[i]
      if (!el) continue
      const d = offsetOf(i, p, n)
      const c = place(d, step, g)
      el.style.transform =
        "translate3d(" + (c.x - g.cardW / 2).toFixed(2) + "px," + (c.y - g.cardH / 2).toFixed(2) + "px,0) rotate(" + c.rot.toFixed(3) + "deg)"
      // Earlier cards (below) overlap later ones, as in the reference.
      el.style.zIndex = String(Math.round((n - d) * 10))
    }
    const now = wrapIndex(p, count)
    setIndex((prev) => (prev === now ? prev : now))
  }, [n, count, step])

  React.useEffect(() => {
    onIndexRef.current?.(index)
  }, [index])

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const on = () => setReduced(mq.matches)
    on()
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])

  // Size: every length is a fraction of the stage height.
  React.useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const isNarrow = el.clientWidth < 0.9 * el.clientHeight || el.clientWidth < 640
      narrowRef.current = isNarrow
      const g = geometry(el.clientWidth, el.clientHeight, isNarrow)
      geo.current = g
      for (const c of cardRefs.current) {
        if (!c) continue
        c.style.width = g.cardW + "px"
        c.style.height = g.cardH + "px"
      }
      setNarrow(isNarrow)
      placeCaption()
      fitCaption()
      render()
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [render, placeCaption, fitCaption])

  React.useLayoutEffect(() => {
    placeCaption()
    fitCaption()
  }, [showCaption, index, narrow, placeCaption, fitCaption])

  // The page scroll rolls the wheel; letting go settles on the nearest card.
  // The wheel chases the scroll with a little lag, like a scrub.
  const steps = spans(count, loop)
  React.useEffect(() => {
    const track = trackRef.current
    if (!track || count < 2) return
    let laps = 0
    let target = 0
    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      snap: reduced ? undefined : { snapTo: 1 / steps, duration: { min: 0.5, max: 1.4 }, delay: 0.12, ease: "power2.inOut" },
      onUpdate: (self) => {
        // Looping: the bottom of the section looks like its top, so jump there unseen.
        if (loop && self.progress >= 1 && self.direction > 0) {
          laps += 1
          self.scroll(self.start + 1)
          return
        }
        target = positionAt(self.progress, laps, steps)
      },
    })
    // At the very top there is no scroll left to fire onUpdate, so a wheel up wraps.
    const onWheel = (e: WheelEvent) => {
      if (!loop || e.deltaY >= 0 || trigger.scroll() > trigger.start + 1) return
      const r = track.getBoundingClientRect()
      if (r.top > 1 || r.bottom < window.innerHeight - 1) return
      laps -= 1
      trigger.scroll(trigger.end - 1)
    }
    window.addEventListener("wheel", onWheel, { passive: true })
    target = positionAt(trigger.progress, 0, steps)
    pos.current.v = target
    const tick = (_t: number, dt: number) => {
      const p = pos.current.v
      const next = reduced ? target : p + (target - p) * (1 - Math.exp(-dt / 110))
      if (Math.abs(next - p) < 1e-4 && next === target) return
      pos.current.v = Math.abs(target - next) < 1e-4 ? target : next
      render()
    }
    gsap.ticker.add(tick)
    st.current = trigger
    render()
    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener("wheel", onWheel)
      trigger.kill()
      st.current = null
    }
  }, [count, steps, loop, reduced, render])

  // The caption and topic chips swap in with the flat card.
  React.useEffect(() => {
    const cap = capRef.current
    if (!cap || reduced) return
    const tw = gsap.fromTo(
      cap.querySelectorAll(".acc-num,.acc-count,.acc-title,.acc-meta,.acc-ghead,.acc-chip"),
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.012 },
    )
    return () => void tw.kill()
  }, [index, reduced])

  const bringFlat = (i: number) => {
    const s = st.current
    if (!s) return
    window.scrollTo({ top: scrollFor(i % count, steps, s.start, s.end), behavior: reduced ? "auto" : "smooth" })
  }

  const current = items[index]
  const groups = current ? topicsFor(current) : []
  const total = groups.reduce((sum, g) => sum + g.items.length, 0)

  return (
    <div
      ref={trackRef}
      className={"acc-track " + className}
      style={{ height: "calc(" + height + " * " + (1 + steps * scrollPerCard) + ")" }}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <style>{CSS}</style>
      <div ref={stageRef} className="acc-stage" style={{ height }}>
        {/* blobs, same family as the landing page */}
        <div className="acc-blob acc-blob-c" aria-hidden />
        <svg className="acc-spark acc-sp1" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 0C12 7 17 12 24 12C17 12 12 17 12 24C12 17 7 12 0 12C7 12 12 7 12 0Z" />
        </svg>
        <svg className="acc-spark acc-sp2" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 0C12 7 17 12 24 12C17 12 12 17 12 24C12 17 7 12 0 12C7 12 12 7 12 0Z" />
        </svg>

        {cards.map((it, i) => (
          <div
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            className="acc-card"
            style={{ borderRadius: radius }}
            role="button"
            tabIndex={i < count ? 0 : -1}
            aria-roledescription="slide"
            aria-label={(it.title ?? it.alt ?? "Card") + ", " + ((i % count) + 1) + " of " + count}
            onClick={() => bringFlat(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                bringFlat(i)
              }
            }}
          >
            <img src={it.src} alt={it.alt ?? ""} draggable={false} decoding="async" />
          </div>
        ))}

        {showCaption && current && (
          <div ref={capRef} className="acc-cap" data-narrow={narrow ? "" : undefined} style={{ zIndex: n * 20 }}>
            <div className="acc-head">
              <p className="acc-num">
                {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </p>
              {total > 0 && <p className="acc-count">{total} topics</p>}
            </div>
            {current.title && <h3 className="acc-title">{current.title}</h3>}
            {current.meta && <p className="acc-meta">{current.meta}</p>}

            {groups.length > 0 && (
              <div className="acc-groups">
                {groups.map((g, gi) => (
                  <section key={g.label} className={"acc-group acc-g" + (gi % 2)} aria-label={g.label + " topics"}>
                    <div className="acc-ghead">
                      <span className="acc-gdot" aria-hidden />
                      <h4>{g.label}</h4>
                      <em>{g.items.length}</em>
                      <i className="acc-rule" aria-hidden />
                    </div>
                    <ul className="acc-chips">
                      {g.items.map((t) => (
                        <li key={t} className="acc-chip">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="acc-sr" aria-live="polite">
          {count ? "Card " + (index + 1) + " of " + count + (current?.title ? ": " + current.title : "") : ""}
        </p>
      </div>
    </div>
  )
}