import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import katex from 'katex';
import { FacultyRepository, type FacultyPaperItem } from '../repositories/FacultyRepository';
import { AppError } from '../utils/AppError';
import { formatPaperCode } from './FacultyPaperService';

export type PdfMode = 'questions' | 'solutions' | 'key';

const LETTERS = ['A', 'B', 'C', 'D'];

function escapeHtml(s: string): string {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripOptionPrefix(opt: string): string {
  return opt.replace(/^[A-Da-d][.)]\s*/, '').replace(/^\([A-Da-d]\)\s*/, '');
}

function isCorrectOption(answer: string, letter: string): boolean {
  if (!answer) return false;
  return answer.toUpperCase().split(',').map((s) => s.trim()).includes(letter);
}

function renderMath(math: string, displayMode: boolean): string {
  try {
    return katex.renderToString(math.trim(), {
      displayMode,
      throwOnError: false,
    });
  } catch {
    return escapeHtml(math);
  }
}

export function formatLatexToHtml(text: string): string {
  if (!text) return '';

  // 1. Display math: $$ ... $$ or \[ ... \]
  let output = text.replace(/\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]/g, (_, m1, m2) => {
    return `<div class="katex-display-wrap">${renderMath(m1 || m2, true)}</div>`;
  });

  // 2. Inline math: $ ... $ or \( ... \)
  output = output.replace(/\$([^\$\n]+?)\$|\\\(([\s\S]+?)\\\)/g, (_, m1, m2) => {
    return renderMath(m1 || m2, false);
  });

  // 3. Convert newlines outside tags to <br/>
  return output.replace(/\n/g, '<br/>');
}

let cachedKatexCss = '';
function getKatexCss(): string {
  if (!cachedKatexCss) {
    try {
      const candidates = [
        path.resolve(__dirname, '../../node_modules/katex/dist/katex.min.css'),
        path.resolve(process.cwd(), 'node_modules/katex/dist/katex.min.css'),
        path.resolve(process.cwd(), 'backend/node_modules/katex/dist/katex.min.css'),
      ];
      for (const p of candidates) {
        if (fs.existsSync(p)) {
          let rawCss = fs.readFileSync(p, 'utf8');
          const fontsDir = path.resolve(path.dirname(p), 'fonts');
          if (fs.existsSync(fontsDir)) {
            // Embed all KaTeX woff2 font files directly as base64 data URIs so Puppeteer
            // renders all math symbols (≠, ∈, ∫, ∑, etc.) reliably without missing glyphs (tofu)
            rawCss = rawCss.replace(/url\(fonts\/([^\)]+?\.woff2)\)/g, (match, filename) => {
              const fontFile = path.join(fontsDir, filename);
              if (fs.existsSync(fontFile)) {
                const b64 = fs.readFileSync(fontFile).toString('base64');
                return `url("data:font/woff2;base64,${b64}")`;
              }
              return match;
            });
          }
          cachedKatexCss = rawCss;
          break;
        }
      }
    } catch {
      // fallback
    }
  }
  return cachedKatexCss;
}

function getSystemChromePath(): string | undefined {
  if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  const candidates = [
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/snap/bin/chromium',
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return undefined;
}

export class FacultyPdfService {
  constructor(private readonly facultyRepo: FacultyRepository = new FacultyRepository()) {}

  public async generatePaperPdf(facultyId: string, paperId: string, mode: PdfMode = 'questions'): Promise<{ buffer: Buffer; filename: string }> {
    const raw = await this.facultyRepo.findPaperById(paperId);
    if (!raw || raw.facultyId !== facultyId) {
      throw new AppError(404, 'Paper not found');
    }

    const paperCode = formatPaperCode(raw.paperCode, raw.id);
    const items = raw.items as unknown as FacultyPaperItem[];
    const paper = {
      ...raw,
      paperCode,
      items,
    };

    const modeTitle = mode === 'key' ? 'Answer-Key' : mode === 'solutions' ? 'Solutions' : 'Question-Paper';
    const filename = `${paperCode}-${modeTitle}.pdf`;

    const html = this.buildHtml(paper, mode);

    const systemChrome = getSystemChromePath();
    const launchOptions: any = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--font-render-hinting=none',
      ],
    };
    if (systemChrome) {
      launchOptions.executablePath = systemChrome;
    }

    let browser;
    try {
      browser = await puppeteer.launch(launchOptions);
    } catch (launchErr: any) {
      console.error('[FacultyPdfService] Failed to launch Puppeteer browser:', launchErr?.message || launchErr);
      throw new AppError(500, `PDF engine launch error: ${launchErr?.message || 'Chromium missing or incomplete installation'}`);
    }

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      await page.evaluateHandle('document.fonts.ready');

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '12mm', right: '14mm', bottom: '15mm', left: '14mm' },
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: `
          <div style="font-size: 9px; color: #64748b; width: 100%; display: flex; justify-content: space-between; padding: 0 14mm; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <span><strong>${escapeHtml(paperCode)}</strong> • ${escapeHtml(paper.title)}</span>
            <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
          </div>
        `,
      });

      return {
        buffer: Buffer.from(pdfBuffer),
        filename,
      };
    } finally {
      await browser.close();
    }
  }

  private buildHtml(paper: any, mode: PdfMode): string {
    const katexCss = getKatexCss();
    const examLabel = paper.examType === 'NEET' ? 'NEET-UG' : `JEE ${paper.examType}`;
    const modeLabel = mode === 'key' ? 'Answer Key' : mode === 'solutions' ? 'Question Paper & Detailed Solutions' : 'Question Paper';

    let contentHtml = '';

    if (mode === 'key') {
      contentHtml = `
        <div class="key-grid">
          ${paper.items.map((item: FacultyPaperItem) => `
            <div class="key-cell">
              <span class="key-num">${item.number}.</span>
              <span class="key-ans">${escapeHtml(item.correctAnswer)}</span>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      contentHtml = `
        <div class="questions-list">
          ${paper.items.map((item: FacultyPaperItem) => {
            const isInteger = item.questionType === 'integer';
            const options = item.options || [];

            let optionsHtml = '';
            if (!isInteger && options.length > 0) {
              optionsHtml = `
                <div class="options-grid">
                  ${options.map((opt, idx) => {
                    const letter = LETTERS[idx] || String(idx + 1);
                    const isCorrect = mode === 'solutions' && isCorrectOption(item.correctAnswer, letter);
                    const textHtml = formatLatexToHtml(stripOptionPrefix(opt));
                    return `
                      <div class="option-item ${isCorrect ? 'correct-option' : ''}">
                        <span class="option-letter">${letter}</span>
                        <div class="option-content">${textHtml}</div>
                      </div>
                    `;
                  }).join('')}
                </div>
              `;
            } else if (isInteger) {
              if (mode === 'solutions') {
                optionsHtml = `
                  <div class="integer-box integer-correct">
                    Correct Numerical Answer: <strong>${escapeHtml(item.correctAnswer)}</strong>
                  </div>
                `;
              } else {
                optionsHtml = `
                  <div class="integer-box">
                    Numerical Answer: <span class="integer-line">____________________</span>
                  </div>
                `;
              }
            }

            let solutionHtml = '';
            if (mode === 'solutions') {
              solutionHtml = `
                <div class="solution-box">
                  <div class="solution-header">
                    <span>✓ Step-by-Step Solution</span>
                    <span class="correct-badge">Answer: ${escapeHtml(item.correctAnswer)}</span>
                  </div>
                  <div class="solution-text">
                    ${formatLatexToHtml(item.explanation || 'No detailed solution provided.')}
                  </div>
                </div>
              `;
            }

            return `
              <article class="question-card">
                <div class="q-header">
                  <span class="q-num">Q${item.number}.</span>
                  <span class="q-subject">${escapeHtml(item.subject)}</span>
                  <span class="q-topic">• ${escapeHtml(item.topic)}</span>
                  ${item.difficulty ? `<span class="q-diff ${item.difficulty}">${item.difficulty}</span>` : ''}
                </div>

                <div class="q-text">
                  ${formatLatexToHtml(item.questionText)}
                </div>

                ${optionsHtml}
                ${solutionHtml}
              </article>
            `;
          }).join('')}
        </div>
      `;
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(paper.paperCode)} - ${escapeHtml(paper.title)}</title>
        <style>
          ${katexCss}

          @page {
            size: A4;
            margin: 12mm 14mm 15mm 14mm;
          }

          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 0;
            background: #ffffff;
            font-size: 13.5px;
            line-height: 1.55;
          }

          .paper-header {
            border-bottom: 2.5px solid #003366;
            padding-bottom: 12px;
            margin-bottom: 18px;
          }

          .org-title {
            font-size: 20px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #003366;
            margin-bottom: 4px;
          }

          .paper-title {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
            margin: 4px 0 10px;
          }

          .meta-row {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 8px;
            font-size: 11.5px;
            color: #475569;
            background: #f8fafc;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
          }

          .meta-item strong {
            color: #003366;
          }

          .question-card {
            margin-bottom: 16px;
            padding-bottom: 14px;
            border-bottom: 1px solid #e2e8f0;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .q-header {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 8px;
          }

          .q-num {
            font-size: 15px;
            font-weight: 800;
            color: #003366;
          }

          .q-subject {
            color: #803688;
            font-weight: 700;
          }

          .q-topic {
            color: #64748b;
            font-weight: 500;
          }

          .q-diff {
            margin-left: auto;
            font-size: 10px;
            text-transform: uppercase;
            padding: 2px 7px;
            border-radius: 999px;
            font-weight: 700;
          }
          .q-diff.easy { background: #dcfce7; color: #15803d; }
          .q-diff.medium, .q-diff.intermediate { background: #fef9c3; color: #854d0e; }
          .q-diff.hard, .q-diff.advanced { background: #fee2e2; color: #b91c1c; }

          .q-text {
            color: #0f172a;
            font-size: 13.5px;
            margin-bottom: 12px;
          }

          .katex-display-wrap {
            margin: 8px 0;
            overflow-x: auto;
          }

          .options-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 8px;
          }

          .option-item {
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 13px;
            display: flex;
            align-items: flex-start;
            gap: 8px;
            background: #ffffff;
          }

          .option-letter {
            font-weight: 800;
            color: #003366;
            background: #eef2ff;
            border-radius: 4px;
            padding: 1px 6px;
            font-size: 11.5px;
            flex-shrink: 0;
          }

          .option-content {
            flex: 1;
          }

          .correct-option {
            border: 1.5px solid #16a34a;
            background: #f0fdf4;
          }

          .correct-option .option-letter {
            background: #16a34a;
            color: #ffffff;
          }

          .integer-box {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 13px;
            font-weight: 600;
            color: #334155;
            margin-top: 8px;
          }

          .integer-correct {
            border-color: #16a34a;
            background: #f0fdf4;
            color: #15803d;
          }

          .solution-box {
            margin-top: 12px;
            background: #fbf7ff;
            border: 1.5px solid #d8b4fe;
            border-radius: 10px;
            padding: 12px 14px;
            font-size: 12.5px;
            color: #3b0764;
          }

          .solution-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 800;
            font-size: 12.5px;
            color: #6b21a8;
            margin-bottom: 6px;
            padding-bottom: 6px;
            border-bottom: 1px dashed #e9d5ff;
          }

          .correct-badge {
            background: #16a34a;
            color: #ffffff;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
          }

          .solution-text {
            line-height: 1.6;
          }

          .key-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-top: 12px;
          }

          .key-cell {
            border: 1.5px solid #cbd5e1;
            border-radius: 8px;
            padding: 10px 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8fafc;
          }

          .key-num {
            font-weight: 800;
            color: #003366;
            font-size: 13px;
          }

          .key-ans {
            font-weight: 800;
            color: #16a34a;
            font-size: 14px;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <header class="paper-header">
          ${paper.organization ? `<div class="org-title">${escapeHtml(paper.organization)}</div>` : ''}
          <h1 class="paper-title">${escapeHtml(paper.title)}</h1>
          <div class="meta-row">
            <span class="meta-item"><strong>Paper ID:</strong> ${escapeHtml(paper.paperCode)}</span>
            <span class="meta-item"><strong>Pattern:</strong> ${escapeHtml(examLabel)}</span>
            <span class="meta-item"><strong>Document:</strong> ${escapeHtml(modeLabel)}</span>
            <span class="meta-item"><strong>Questions:</strong> ${paper.items.length}</span>
            <span class="meta-item"><strong>Level:</strong> ${escapeHtml(paper.difficulty)}</span>
          </div>
        </header>

        ${contentHtml}
      </body>
      </html>
    `;
  }
}
