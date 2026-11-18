'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, Check, ClipboardCopy } from 'lucide-react';
import { DiagramRenderer } from '@/components/DiagramRenderer';
import { MathText, stripOptionPrefix } from '@/lib/math';
import { MatchListTable, parseMatchQuestion } from '@/components/common/MatchListTable';
import { facultyDownloadPdf, facultyGetPaper, type FacultyPaper, type PrintMode } from '@/lib/faculty';

const LETTERS = ['A', 'B', 'C', 'D'];

type ClassValue = string | false | null | undefined;
const cx = (...parts: ClassValue[]) => parts.filter(Boolean).join(' ');

function normalizeMode(raw: string | null): PrintMode {
  if (raw === 'solutions') return 'solutions';
  if (raw === 'key') return 'key';
  return 'questions';
}

function isCorrectOption(answer: string, letter: string): boolean {
  return answer.toUpperCase().split(',').map((s) => s.trim()).includes(letter);
}

function FacultyPrintContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const paperId = params?.id ?? '';
  const mode = normalizeMode(searchParams.get('mode'));
  const autoDownload = searchParams.get('download') === '1';

  const [paper, setPaper] = useState<FacultyPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const printedRef = useRef(false);

  async function handleDownloadPdfDirect() {
    if (!paper) return;
    setDownloading(true);
    try {
      await facultyDownloadPdf(paper.id, mode);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  }

  function handleCopyAll() {
    if (!paper) return;
    const lines: string[] = [];
    lines.push(`${paper.title} (${paper.paperCode})`);
    lines.push(`Pattern: ${paper.examType} | Questions: ${paper.items.length}\n`);

    paper.items.forEach((item) => {
      lines.push(`Q${item.number}. [${item.subject} - ${item.topic}]`);
      lines.push(item.questionText);
      if (item.questionType !== 'integer' && item.options.length > 0) {
        item.options.forEach((opt, idx) => {
          lines.push(`  (${LETTERS[idx]}) ${stripOptionPrefix(opt)}`);
        });
      } else {
        lines.push(`  Numerical Answer: _______`);
      }
      if (paper.examType !== 'Psychometric') {
        if (mode === 'solutions' || mode === 'key') {
          lines.push(`Answer: ${item.correctAnswer}`);
        }
        if (mode === 'solutions' && item.explanation) {
          lines.push(`Solution: ${item.explanation}`);
        }
      }
      lines.push('');
    });

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    if (!paperId) return;
    let active = true;
    facultyGetPaper(paperId)
      .then((res) => {
        if (!active) return;
        setPaper(res.paper);
        const modeTitle = mode === 'key'
          ? 'Answer Key'
          : mode === 'solutions'
            ? 'Solutions'
            : 'Question Paper';
        document.title = `${res.paper.paperCode} - ${res.paper.title} - ${modeTitle}`;
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Unable to load paper for printing');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [paperId, mode]);

  useEffect(() => {
    if (!paper || !autoDownload || printedRef.current) return;
    printedRef.current = true;
    facultyDownloadPdf(paper.id, mode).catch(() => {});
  }, [paper, autoDownload, mode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E2E8F0] px-4 pb-12 pt-5 font-[system-ui] select-text print:min-h-0 print:bg-white print:p-0">
        <div className="mx-auto mb-3.5 flex max-w-[210mm] flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-[#003366]/10 bg-white px-3.5 py-2.5 shadow-[0_10px_30px_-26px_rgba(0,51,102,.45)] print:hidden">Loading printable A4 sheet…</div>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen bg-[#E2E8F0] px-4 pb-12 pt-5 font-[system-ui] select-text print:min-h-0 print:bg-white print:p-0">
        <div className="mx-auto mb-3.5 flex max-w-[210mm] flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-[#003366]/10 bg-white px-3.5 py-2.5 shadow-[0_10px_30px_-26px_rgba(0,51,102,.45)] print:hidden">
          <span className="text-[13px] text-[#C8202F]">{error || 'Paper not found'}</span>
          <Link href="/faculty" className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none">Back to Faculty Studio</Link>
        </div>
      </div>
    );
  }

  const examLabel = paper.examType === 'NEET' ? 'NEET-UG' : `JEE ${paper.examType}`;
  const modeLabel = mode === 'key'
    ? 'Answer Key'
    : mode === 'solutions'
      ? 'Full Paper & Step-by-Step Solutions'
      : 'Question Paper';

  return (
    <div className="min-h-screen bg-[#E2E8F0] px-4 pb-12 pt-5 font-[system-ui] select-text print:min-h-0 print:bg-white print:p-0">
      <div className="mx-auto mb-3.5 flex max-w-[210mm] flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-[#003366]/10 bg-white px-3.5 py-2.5 shadow-[0_10px_30px_-26px_rgba(0,51,102,.45)] print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/faculty" className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"><ArrowLeft className="h-[14px] w-[14px] shrink-0" aria-hidden />Back to Studio</Link>
          <Link
            href={`/faculty/papers/${paper.id}/print?mode=questions`}
            className={mode === 'questions' ? 'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#5A2560] bg-grad px-4 py-2 text-[13px] font-extrabold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[3px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none' : 'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none'}
          >
            Question Paper
          </Link>
          {paper.examType !== 'Psychometric' && (
            <>
              <Link
                href={`/faculty/papers/${paper.id}/print?mode=solutions`}
                className={mode === 'solutions' ? 'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#5A2560] bg-grad px-4 py-2 text-[13px] font-extrabold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[3px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none' : 'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none'}
              >
                Paper + Solutions
              </Link>
              <Link
                href={`/faculty/papers/${paper.id}/print?mode=key`}
                className={mode === 'key' ? 'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#5A2560] bg-grad px-4 py-2 text-[13px] font-extrabold text-white no-underline shadow-[0_4px_0_#5A2560] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#5A2560] active:translate-y-[3px] active:shadow-[0_1px_0_#5A2560] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none' : 'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none'}
              >
                Answer Key
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#003366] bg-white px-3.5 py-2 text-[13px] font-extrabold text-[#003366] no-underline shadow-[0_4px_0_#C6D2F8] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#C6D2F8] active:translate-y-[3px] active:shadow-[0_1px_0_#C6D2F8] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none" onClick={handleCopyAll}>
            {copied ? (
              <>
                <Check className="h-[14px] w-[14px] shrink-0" aria-hidden />
                Copied All
              </>
            ) : (
              <>
                <ClipboardCopy className="h-[14px] w-[14px] shrink-0" aria-hidden />
                Copy Text
              </>
            )}
          </button>
          <button
            type="button"
            disabled={downloading}
            className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-accent bg-white px-3 py-1.5 text-[12.5px] font-extrabold text-accent no-underline shadow-[0_4px_0_#E2C2F0] transition-[transform,box-shadow] duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_0_#E2C2F0] active:translate-y-[3px] active:shadow-[0_1px_0_#E2C2F0] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
            onClick={() => void handleDownloadPdfDirect()}
          >
            {downloading ? 'Generating PDF...' : 'Download / Save PDF (A4)'}
          </button>
        </div>
      </div>

      <main className="faculty-print-sheet mx-auto flex w-[210mm] min-h-[297mm] max-w-full flex-col bg-white p-[14mm_16mm] font-[system-ui] text-black shadow-[0_4px_24px_rgba(15,23,42,0.12)] select-text print:m-0 print:min-h-0 print:w-full print:p-0 print:shadow-none">
        <header className="mb-4 border-b-2 border-[#0F172A] pb-2.5">
          {paper.organization && (
            <div className="mb-1.5 text-[20px] font-extrabold uppercase tracking-[0.04em] text-[#0F172A]">
              {paper.organization}
            </div>
          )}
          <h1 className="text-center font-display text-[19px] font-extrabold text-[#0F172A]">{paper.title}</h1>
          <div className="mt-2 flex flex-wrap justify-between gap-2.5 text-[12px] font-medium text-[#334155]">
            <span><strong>Paper ID:</strong> {paper.paperCode}</span>
            <span><strong>Pattern:</strong> {examLabel}</span>
            <span><strong>Document:</strong> {modeLabel}</span>
            <span><strong>Questions:</strong> {paper.items.length}</span>
            <span><strong>Level:</strong> {paper.difficulty}</span>
          </div>
        </header>

        {mode === 'key' ? (
          <section className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {paper.items.map((item) => (
              <div key={item.number} className="flex justify-between rounded-lg border border-[#CBD5E1] px-2.5 py-2 text-[13px] tabular-nums">
                <span className="font-extrabold text-[#334155]">{item.number}.</span>
                <span className="font-extrabold text-[#0F172A]">{item.correctAnswer}</span>
              </div>
            ))}
          </section>
        ) : (
          <section>
            {paper.items.map((item) => (
              <article key={item.number} className="mb-3 break-inside-avoid border-b border-[#E2E8F0] pb-3">
                <div className="mb-1 text-[13px] font-extrabold text-[#0F172A]">
                  Q{item.number}.
                  <span className="ml-2 text-[11px] font-medium text-[#475569]">
                    [{item.subject} · {item.topic}
                    {item.questionType === 'mcq_multi' ? ' · One or More Correct' : ''}
                    {item.questionType === 'integer' ? ' · Integer Type' : ''}
                    {item.questionType === 'matrix_match' ? ' · Matrix Match' : ''}]
                  </span>
                </div>

                {(() => {
                  const cleanPrompt = item.questionText
                    .replace(/\*\*Scenario:\*\*\s*/gi, '')
                    .replace(/\*\*Question:\*\*\s*/gi, '')
                    .trim();
                  return (
                    <>
                      <div className="text-[14px] leading-[1.65] text-[#0F172A]">
                        {item.questionType === 'matrix_match' || parseMatchQuestion(cleanPrompt) ? (
                          <MatchListTable questionText={cleanPrompt} />
                        ) : (
                          <MathText text={cleanPrompt} />
                        )}
                      </div>

                      {item.diagram && (
                        <div className="my-3 max-w-[440px]">
                          <DiagramRenderer descriptor={item.diagram} />
                        </div>
                      )}

                      {item.questionType !== 'integer' && item.options.length > 0 ? (
                        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {item.options.map((opt, idx) => {
                            const letter = LETTERS[idx]!;
                            const highlight = mode === 'solutions' && paper.examType !== 'Psychometric' && isCorrectOption(item.correctAnswer, letter);
                            return (
                              <div
                                key={letter}
                                className={cx('flex items-baseline gap-2 rounded-xl border border-[#CBD5E1] bg-white px-2.5 py-2 text-[13px] font-medium text-[#0F172A] [print-color-adjust:exact]', highlight && 'border-[#86EFAC] bg-[#F0FDF4]')}
                              >
                                <span className="font-extrabold text-[#64748B]">({letter})</span>
                                <MathText text={stripOptionPrefix(opt)} />
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        mode === 'questions' && (
                          <div className="mt-2 inline-block rounded-md border border-dashed border-[#64748B] px-2.5 py-1 text-[12px] font-medium text-[#334155]">Numerical Answer: ____________</div>
                        )
                      )}

                      {mode === 'solutions' && paper.examType !== 'Psychometric' && (
                        <>
                          <div className="mt-2.5 inline-block rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-2.5 py-1.5 text-[13px] font-bold text-[#15803D] [print-color-adjust:exact]">Correct Answer: {item.correctAnswer}</div>
                          {item.explanation && (
                            <div className="mt-2.5 rounded-lg border-l-[3px] border-l-[#94A3B8] bg-[#F8FAFC] px-3 py-2.5 text-[13px] leading-relaxed text-[#334155]">
                              <strong>Solution: </strong>
                              <MathText text={item.explanation} />
                            </div>
                          )}
                        </>
                      )}
                    </>
                  );
                })()}
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default function FacultyPrintPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#E2E8F0] px-4 pb-12 pt-5 font-[system-ui] select-text print:min-h-0 print:bg-white print:p-0">
          <div className="mx-auto mb-3.5 flex max-w-[210mm] flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-[#003366]/10 bg-white px-3.5 py-2.5 shadow-[0_10px_30px_-26px_rgba(0,51,102,.45)] print:hidden">Loading printable A4 sheet…</div>
        </div>
      }
    >
      <FacultyPrintContent />
    </Suspense>
  );
}
