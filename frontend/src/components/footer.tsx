'use client';

import { Fragment, useState, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type FooterLink = { label: string; href: string };

const footerSections: Record<string, FooterLink[]> = {
  'JEE Preparation': [
    { label: 'JEE Main Mock Tests', href: '/mock?exam=jee-main' },
    { label: 'JEE Main Online Test Series', href: '/mock?series=jee-main' },
    { label: 'JEE Main Practice Tests', href: '/practice?exam=jee-main' },
    { label: 'JEE Main Previous Year Question Papers', href: '/papers?exam=jee-main' },
    { label: 'JEE Main Chapter-Wise Tests', href: '/practice?exam=jee-main&mode=chapter' },
    { label: 'JEE Main Subject-Wise Tests', href: '/practice?exam=jee-main&mode=subject' },
    { label: 'JEE Main Physics Practice', href: '/practice?exam=jee-main&subject=physics' },
    { label: 'JEE Main Chemistry Practice', href: '/practice?exam=jee-main&subject=chemistry' },
    { label: 'JEE Main Mathematics Practice', href: '/practice?exam=jee-main&subject=mathematics' },
    { label: 'JEE Main Full-Length Mock Tests', href: '/mock?exam=jee-main&type=full' },
    { label: 'JEE Main Sample Papers', href: '/papers?exam=jee-main&type=sample' },
    { label: 'JEE Main Revision Tests', href: '/practice?exam=jee-main&mode=revision' },
    { label: 'JEE Advanced Mock Tests', href: '/mock?exam=jee-advanced' },
    { label: 'JEE Advanced Practice Questions', href: '/practice?exam=jee-advanced' },
    { label: 'JEE Advanced Previous Year Papers', href: '/papers?exam=jee-advanced' },
    { label: 'JEE Main Preparation Online', href: '/jee-preparation' },
    { label: 'JEE Exam Practice for Class 11', href: '/practice?class=11&exam=jee' },
    { label: 'JEE Exam Practice for Class 12', href: '/practice?class=12&exam=jee' },
  ],
  'JEE Score Predictor': [
    { label: 'Predict Your JEE Main Score', href: '/predictor/jee-main' },
    { label: 'JEE Main Marks Predictor', href: '/predictor/jee-main/marks' },
    { label: 'JEE Main Percentile Predictor', href: '/predictor/jee-main/percentile' },
    { label: 'JEE Main Rank Predictor', href: '/predictor/jee-main/rank' },
    { label: 'JEE Main College Predictor', href: '/predictor/jee-main/college' },
    { label: 'JEE Main Marks vs Percentile', href: '/predictor/jee-main/marks-vs-percentile' },
    { label: 'JEE Main Expected Rank Calculator', href: '/predictor/jee-main/expected-rank' },
    { label: 'JEE Main Cutoff Predictor', href: '/predictor/jee-main/cutoff' },
    { label: 'JEE Advanced Score Predictor', href: '/predictor/jee-advanced' },
    { label: 'JEE Advanced Rank Predictor', href: '/predictor/jee-advanced/rank' },
    { label: 'JEE Main Score Analysis', href: '/dashboard/analysis?exam=jee-main' },
    { label: 'JEE Main Performance Analysis', href: '/dashboard/performance?exam=jee-main' },
  ],
  'NEET Preparation': [
    { label: 'NEET UG Mock Tests', href: '/mock?exam=neet' },
    { label: 'NEET Online Test Series', href: '/mock?series=neet' },
    { label: 'NEET Practice Tests', href: '/practice?exam=neet' },
    { label: 'NEET Previous Year Question Papers', href: '/papers?exam=neet' },
    { label: 'NEET Chapter-Wise Tests', href: '/practice?exam=neet&mode=chapter' },
    { label: 'NEET Subject-Wise Tests', href: '/practice?exam=neet&mode=subject' },
    { label: 'NEET Physics Practice Questions', href: '/practice?exam=neet&subject=physics' },
    { label: 'NEET Chemistry Practice Questions', href: '/practice?exam=neet&subject=chemistry' },
    { label: 'NEET Biology Practice Questions', href: '/practice?exam=neet&subject=biology' },
    { label: 'NEET Botany Practice Questions', href: '/practice?exam=neet&subject=botany' },
    { label: 'NEET Zoology Practice Questions', href: '/practice?exam=neet&subject=zoology' },
    { label: 'NEET Full-Length Mock Tests', href: '/mock?exam=neet&type=full' },
    { label: 'NEET Sample Papers', href: '/papers?exam=neet&type=sample' },
    { label: 'NEET Revision Tests', href: '/practice?exam=neet&mode=revision' },
    { label: 'NEET Preparation Online', href: '/neet-preparation' },
    { label: 'NEET Exam Practice for Class 11', href: '/practice?class=11&exam=neet' },
    { label: 'NEET Exam Practice for Class 12', href: '/practice?class=12&exam=neet' },
    { label: 'NEET Exam Practice for Droppers', href: '/practice?exam=neet&target=droppers' },
  ],
  'NEET Score Predictor': [
    { label: 'Predict Your NEET Score', href: '/predictor/neet' },
    { label: 'NEET Marks Predictor', href: '/predictor/neet/marks' },
    { label: 'NEET Expected Score Calculator', href: '/predictor/neet/expected-score' },
    { label: 'NEET Rank Predictor', href: '/predictor/neet/rank' },
    { label: 'NEET College Predictor', href: '/predictor/neet/college' },
    { label: 'NEET Marks vs Rank', href: '/predictor/neet/marks-vs-rank' },
    { label: 'NEET Marks vs Percentile', href: '/predictor/neet/marks-vs-percentile' },
    { label: 'NEET Cutoff Predictor', href: '/predictor/neet/cutoff' },
    { label: 'NEET Score Analysis', href: '/dashboard/analysis?exam=neet' },
    { label: 'NEET Performance Analysis', href: '/dashboard/performance?exam=neet' },
    { label: 'NEET Expected Rank Calculator', href: '/predictor/neet/expected-rank' },
    { label: 'NEET Admission Chances Calculator', href: '/predictor/neet/admission-chances' },
  ],
  'Practice by Subject': [
    { label: 'Physics Online Practice Tests', href: '/practice?subject=physics' },
    { label: 'Chemistry Online Practice Tests', href: '/practice?subject=chemistry' },
    { label: 'Mathematics Online Practice Tests', href: '/practice?subject=mathematics' },
    { label: 'Biology Online Practice Tests', href: '/practice?subject=biology' },
    { label: 'Organic Chemistry Practice', href: '/practice?subject=chemistry&topic=organic' },
    { label: 'Inorganic Chemistry Practice', href: '/practice?subject=chemistry&topic=inorganic' },
    { label: 'Physical Chemistry Practice', href: '/practice?subject=chemistry&topic=physical' },
    { label: 'Mechanics Practice Questions', href: '/practice?subject=physics&topic=mechanics' },
    { label: 'Electricity and Magnetism Practice', href: '/practice?subject=physics&topic=electromagnetism' },
    { label: 'Human Physiology Practice', href: '/practice?subject=biology&topic=human-physiology' },
    { label: 'Genetics and Evolution Practice', href: '/practice?subject=biology&topic=genetics' },
    { label: 'Plant Physiology Practice', href: '/practice?subject=biology&topic=plant-physiology' },
  ],
  'Practice by Chapter and Topic': [
    { label: 'JEE Chapter-Wise Practice Tests', href: '/practice?exam=jee&mode=chapter' },
    { label: 'NEET Chapter-Wise Practice Tests', href: '/practice?exam=neet&mode=chapter' },
    { label: 'JEE Topic-Wise Mock Tests', href: '/mock?exam=jee&mode=topic' },
    { label: 'NEET Topic-Wise Mock Tests', href: '/mock?exam=neet&mode=topic' },
    { label: 'Important JEE Main Questions', href: '/questions?exam=jee-main&important=true' },
    { label: 'Important NEET Questions', href: '/questions?exam=neet&important=true' },
    { label: 'JEE Formula Revision', href: '/revision?exam=jee&type=formulas' },
    { label: 'NEET Biology Revision', href: '/revision?exam=neet&subject=biology' },
    { label: 'JEE and NEET Daily Practice Questions', href: '/practice/daily' },
  ],
  'Exam Resources': [
    { label: 'JEE Main Exam Pattern', href: '/resources/jee-main-pattern' },
    { label: 'JEE Advanced Exam Pattern', href: '/resources/jee-advanced-pattern' },
    { label: 'NEET UG Exam Pattern', href: '/resources/neet-pattern' },
    { label: 'JEE Main Syllabus', href: '/resources/jee-main-syllabus' },
    { label: 'JEE Advanced Syllabus', href: '/resources/jee-advanced-syllabus' },
    { label: 'NEET UG Syllabus', href: '/resources/neet-syllabus' },
    { label: 'JEE Main Preparation Strategy', href: '/resources/jee-main-strategy' },
    { label: 'JEE Advanced Preparation Strategy', href: '/resources/jee-advanced-strategy' },
    { label: 'NEET Preparation Strategy', href: '/resources/neet-strategy' },
    { label: 'JEE Study Plan', href: '/study-plan?exam=jee' },
    { label: 'NEET Study Plan', href: '/study-plan?exam=neet' },
    { label: 'JEE and NEET Time Management', href: '/resources/time-management' },
    { label: 'JEE and NEET Exam Preparation Tips', href: '/resources/preparation-tips' },
  ],
  'About & Support': [
    { label: 'Terms and Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'About Us', href: '/about' },
  ],
};

const seoKeywords = [
  'JEE Main mock test online',
  'JEE Advanced practice test',
  'JEE online test series',
  'JEE Main previous year questions',
  'JEE Main score predictor',
  'JEE percentile predictor',
  'JEE rank predictor',
  'NEET mock test online',
  'NEET UG online test series',
  'NEET practice questions',
  'NEET previous year question papers',
  'NEET score predictor',
  'NEET marks predictor',
  'NEET rank predictor',
  'NEET full-length mock test',
  'Physics practice test',
  'Chemistry practice test',
  'Mathematics practice test',
  'Biology practice test',
  'online exam preparation for JEE and NEET',
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [openBlock, setOpenBlock] = useState<string | null>(null);

  const toggle = (title: string) =>
    setOpenBlock((prev) => (prev === title ? null : title));

  const linkBlock = (title: string, span = 1, cols = 1) => (
    <Block
      key={title}
      title={title}
      span={span}
      cols={cols}
      open={openBlock === title}
      onToggle={() => toggle(title)}
    >
      <ul className="jn-list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {footerSections[title].map((link) => (
          <li key={link.href} style={{ listStyle: 'none' }}>
            <Link href={link.href} className="jn-link">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </Block>
  );

  return (
    <footer className="jn-footer" role="contentinfo">
      <div className="jn-wrap">
        <div className="jn-layout">
          {/* Left rail: brand + the remaining link groups */}
          <aside className="jn-side">
            <div className="jn-brand">
              <Link href="/" className="jn-logo-plate" aria-label="JEENEET.ai Home">
                <Image
                  src="/logo.png"
                  alt="JEENEET.ai"
                  width={180}
                  height={70}
                  style={{ height: 60, width: 'auto' }}
                  priority={false}
                />
              </Link>
              <p className="jn-tagline">
                JEE &amp; NEET preparation platform. Online mock tests, chapter-wise questions,
                performance analytics and score prediction powered by Deep Tech.
              </p>
            </div> 

            <div className="jn-side-blocks">
              {linkBlock('Practice by Chapter and Topic')}
              {linkBlock('About & Support')}
            </div>
          </aside>

          {/* Main links */}
          <nav className="jn-links" aria-label="Footer navigation">
            <div className="jn-grid">
              {linkBlock('JEE Preparation', 2, 2)}
              {linkBlock('NEET Preparation', 2, 2)}

              {linkBlock('JEE Score Predictor')}
              {linkBlock('NEET Score Predictor')}
              {linkBlock('Practice by Subject')}
              {linkBlock('Exam Resources')}

            
            </div>
            
          </nav>
          <Block
                title="Popular Searches"
                span={4}
                cols={1}
                wide
                open={openBlock === 'Popular Searches'}
                onToggle={() => toggle('Popular Searches')}
              >
                <p className="jn-para">
                  {seoKeywords.map((keyword, i) => (
                    <Fragment key={keyword}>
                      <Link
                        href={`/search?q=${encodeURIComponent(keyword)}`}
                        className="jn-para-link"
                      >
                        {keyword}
                      </Link>
                      {i < seoKeywords.length - 1 && (
                        <span className="jn-dot" aria-hidden="true">
                          {' · '}
                        </span>
                      )}
                    </Fragment>
                  ))}
                </p>
              </Block>
        </div>

        {/* Legal row */}
        <div className="jn-legal">
          <p>© {currentYear} JEENEET.ai (A Product of BVS Education Private Limited). All rights reserved.</p>
          <p>Made with ♥ for JEE &amp; NEET aspirants</p>
        </div>
      </div>

      <button
        type="button"
        className="jn-top-btn"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>

      <style jsx global>{`
        .jn-footer {
          --bg: rgb(30, 39, 51);
          --orange: #ff5a1f;
          --text: #ffffff;
          --muted: rgba(255, 255, 255, 0.74);
          --line: rgba(255, 255, 255, 0.2);
          position: relative;
          display: block;
          margin-top: auto;
          padding: 64px 32px 28px;
          background: var(--bg) !important;
          color: var(--text);
          font-family: inherit;
        }
        .jn-footer .jn-wrap {
          max-width: 1360px;
          margin: 0 auto;
        }
        .jn-footer .jn-layout {
          display: grid;
          grid-template-columns: 300px minmax(0, 1fr);
        }

        /* Left rail */
        .jn-footer .jn-side {
          display: flex;
          flex-direction: column;
          gap: 40px;
          padding-right: 40px;
        }
        .jn-footer .jn-brand {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .jn-footer .jn-logo-plate {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          background: #ffffff;
          border-radius: 20px;
        }
        .jn-footer .jn-logo-plate img {
          display: block;
        }
        .jn-footer .jn-tagline {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.7;
          color: var(--muted);
        }
        .jn-footer .jn-social {
          display: flex;
          gap: 22px;
        }
        .jn-footer .jn-social-link {
          color: var(--text);
          display: inline-flex;
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .jn-footer .jn-social-link:hover {
          color: var(--orange);
          transform: translateY(-2px);
        }
        .jn-footer .jn-side-blocks {
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        /* Links area with the vertical divider */
        .jn-footer .jn-links {
          padding-left: 56px;
          border-left: 1px solid var(--line);
        }
        .jn-footer .jn-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 44px 32px;
        }

        /* Blocks */
        .jn-footer .jn-block {
          grid-column: span var(--span, 1);
          min-width: 0;
        }
        .jn-footer .jn-block-head {
          all: unset;
          box-sizing: border-box;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
          cursor: default;
        }
        .jn-footer .jn-block-head h4 {
          position: relative;
          margin: 0;
          padding-top: 10px;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.005em;
          color: #fff;
        }
        .jn-footer .jn-block-head h4::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 28px;
          height: 3px;
          background: var(--orange);
        }
        .jn-footer .jn-block-head:focus-visible {
          outline: 2px solid var(--orange);
          outline-offset: 4px;
        }
        .jn-footer .jn-chev {
          display: none;
          color: #fff;
          transition: transform 0.25s ease;
        }
        .jn-footer .jn-list {
          list-style: none;
          margin: 0;
          padding: 0;
          columns: var(--cols, 1);
          column-gap: 32px;
        }
        .jn-footer .jn-list li {
          list-style: none;
          break-inside: avoid;
          margin-bottom: 13px;
        }
        .jn-footer .jn-list li::marker {
          content: '';
        }
        .jn-footer .jn-link {
          display: inline-block;
          font-size: 0.86rem;
          font-weight: 600;
          line-height: 1.4;
          color: var(--text);
          text-decoration: none;
          background-image: linear-gradient(var(--orange), var(--orange));
          background-repeat: no-repeat;
          background-size: 0 2px;
          background-position: 0 100%;
          padding-bottom: 2px;
          transition: background-size 0.25s ease;
        }
        .jn-footer .jn-link:hover {
          background-size: 100% 2px;
        }

        /* Popular searches paragraph */
        .jn-footer .jn-para {
          margin: 0;
          font-size: 0.88rem;
          line-height: 2.1;
          color: var(--muted);
        }
        .jn-footer .jn-para-link {
          font-weight: 600;
          color: var(--text);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .jn-footer .jn-para-link:hover {
          color: var(--orange);
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .jn-footer .jn-dot {
          color: var(--orange);
          font-weight: 800;
          white-space: pre;
        }

        /* Legal row */
        .jn-footer .jn-legal {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 8px 32px;
          margin-top: 56px;
          padding-top: 22px;
          border-top: 1px solid var(--line);
          font-size: 0.78rem;
          color: var(--muted);
        }
        .jn-footer .jn-legal p {
          margin: 0;
        }

        .jn-footer .jn-top-btn {
          position: absolute;
          right: 28px;
          bottom: 28px;
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 50%;
          background: #e6ebef;
          color: #5b6672;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        .jn-footer .jn-top-btn:hover {
          background: var(--orange);
          color: #fff;
          transform: translateY(-3px);
        }

        /* Tablet */
        @media (max-width: 1100px) {
          .jn-footer .jn-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .jn-footer .jn-side {
            padding-right: 0;
          }
          .jn-footer .jn-brand {
            max-width: 560px;
          }
          .jn-footer .jn-side-blocks {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 36px 32px;
          }
          .jn-footer .jn-links {
            padding-left: 0;
            border-left: 0;
            border-top: 1px solid var(--line);
            padding-top: 40px;
          }
          .jn-footer .jn-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .jn-footer .jn-block {
            grid-column: span 1;
          }
          .jn-footer .jn-block-wide {
            grid-column: 1 / -1;
          }
          .jn-footer .jn-list {
            columns: 1;
          }
        }

        /* Mobile: flat accordion rows */
        @media (max-width: 720px) {
          .jn-footer {
            padding: 44px 20px 88px;
          }
          .jn-footer .jn-side {
            gap: 28px;
          }
          .jn-side-blocks,
          .jn-footer .jn-grid {
            display: block;
          }
          .jn-footer .jn-links {
            padding-top: 16px;
          }
          .jn-footer .jn-block {
            border-bottom: 1px solid var(--line);
          }
          .jn-footer .jn-block-head {
            margin: 0;
            padding: 18px 0;
            cursor: pointer;
          }
          .jn-footer .jn-block-head h4 {
            padding-top: 0;
          }
          .jn-footer .jn-block-head h4::before {
            display: none;
          }
          .jn-footer .jn-chev {
            display: block;
          }
          .jn-footer .jn-block.is-open .jn-chev {
            transform: rotate(180deg);
          }
          .jn-footer .jn-block-body {
            display: none;
            padding-bottom: 14px;
          }
          .jn-footer .jn-block.is-open .jn-block-body {
            display: block;
          }
          .jn-footer .jn-legal {
            flex-direction: column;
            align-items: flex-start;
            margin-top: 36px;
          }
          .jn-footer .jn-top-btn {
            right: 20px;
            bottom: 20px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .jn-link,
          .jn-social-link,
          .jn-para-link,
          .jn-footer .jn-top-btn {
            transition: none;
          }
        }
      `}</style>
    </footer>
  );
}

/* One link group. Static block on desktop, accordion row on mobile. */
function Block({
  title,
  span,
  cols,
  wide = false,
  open,
  onToggle,
  children,
}: {
  title: string;
  span: number;
  cols: number;
  wide?: boolean;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section
      className={`jn-block ${wide ? 'jn-block-wide' : ''} ${open ? 'is-open' : ''}`}
      style={{ ['--span' as string]: span, ['--cols' as string]: cols }}
    >
      <button type="button" className="jn-block-head" onClick={onToggle} aria-expanded={open}>
        <h4>{title}</h4>
        <svg className="jn-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div className="jn-block-body">{children}</div>
    </section>
  );
}