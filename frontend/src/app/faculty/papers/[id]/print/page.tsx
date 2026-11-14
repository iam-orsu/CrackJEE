'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { DiagramRenderer } from '@/components/DiagramRenderer';
import { MathText, stripOptionPrefix } from '@/lib/math';
import { facultyGetPaper, type FacultyPaper, type PrintMode } from '@/lib/faculty';
import styles from '../../../faculty.module.css';

const LETTERS = ['A', 'B', 'C', 'D'];

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
  const printedRef = useRef(false);

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
      if (mode === 'solutions' || mode === 'key') {
        lines.push(`Answer: ${item.correctAnswer}`);
      }
      if (mode === 'solutions' && item.explanation) {
        lines.push(`Solution: ${item.explanation}`);
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
    const triggerPrint = () => {
      if (typeof document !== 'undefined' && document.fonts?.ready) {
        document.fonts.ready.then(() => {
          setTimeout(() => window.print(), 150);
        });
      } else {
        window.print();
      }
    };
    const timer = setTimeout(triggerPrint, 700);
    return () => clearTimeout(timer);
  }, [paper, autoDownload]);

  if (loading) {
    return (
      <div className={styles.printPageBg}>
        <div className={styles.printToolbar}>Loading printable A4 sheet…</div>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className={styles.printPageBg}>
        <div className={styles.printToolbar}>
          <span style={{ color: '#b91c1c', fontSize: 13 }}>{error || 'Paper not found'}</span>
          <Link href="/faculty" className={styles.btn}>Back to Faculty Studio</Link>
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
    <div className={styles.printPageBg}>
      <div className={`${styles.printToolbar} ${styles.noPrint}`}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/faculty" className={styles.btn}>← Back to Studio</Link>
          <Link
            href={`/faculty/papers/${paper.id}/print?mode=questions`}
            className={mode === 'questions' ? styles.btnPrimary : styles.btn}
          >
            Question Paper
          </Link>
          <Link
            href={`/faculty/papers/${paper.id}/print?mode=solutions`}
            className={mode === 'solutions' ? styles.btnPrimary : styles.btn}
          >
            Paper + Solutions
          </Link>
          <Link
            href={`/faculty/papers/${paper.id}/print?mode=key`}
            className={mode === 'key' ? styles.btnPrimary : styles.btn}
          >
            Answer Key
          </Link>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="button" className={styles.btn} onClick={handleCopyAll}>
            {copied ? '✓ Copied All!' : '📋 Copy Text'}
          </button>
          <button type="button" className={styles.btnAccent} onClick={() => window.print()}>
            Download / Save PDF (A4)
          </button>
        </div>
      </div>

      <main className={styles.printSheet}>
        <header className={styles.printHeader}>
          <h1 className={styles.printTitle}>{paper.title}</h1>
          <div className={styles.printSubRow}>
            <span><strong>Paper ID:</strong> {paper.paperCode}</span>
            <span><strong>Pattern:</strong> {examLabel}</span>
            <span><strong>Document:</strong> {modeLabel}</span>
            <span><strong>Questions:</strong> {paper.items.length}</span>
            <span><strong>Level:</strong> {paper.difficulty}</span>
          </div>
        </header>

        {mode === 'key' ? (
          <section className={styles.keyGrid}>
            {paper.items.map((item) => (
              <div key={item.number} className={styles.keyCell}>
                <span className={styles.keyQNum}>{item.number}.</span>
                <span className={styles.keyAns}>{item.correctAnswer}</span>
              </div>
            ))}
          </section>
        ) : (
          <section>
            {paper.items.map((item) => (
              <article key={item.number} className={styles.printQ}>
                <div className={styles.printQHead}>
                  Q{item.number}.
                  <span className={styles.printQSubject}>
                    [{item.subject} · {item.topic}
                    {item.questionType === 'mcq_multi' ? ' · One or More Correct' : ''}
                    {item.questionType === 'integer' ? ' · Integer Type' : ''}]
                  </span>
                </div>

                <div className={styles.qBody}>
                  <MathText text={item.questionText} />
                </div>

                {item.diagram && (
                  <div className={styles.diagramWrap}>
                    <DiagramRenderer descriptor={item.diagram} />
                  </div>
                )}

                {item.questionType !== 'integer' && item.options.length > 0 ? (
                  <div className={styles.optGrid}>
                    {item.options.map((opt, idx) => {
                      const letter = LETTERS[idx]!;
                      const highlight = mode === 'solutions' && isCorrectOption(item.correctAnswer, letter);
                      return (
                        <div
                          key={letter}
                          className={`${styles.optBox} ${highlight ? styles.optBoxCorrect : ''}`}
                        >
                          <span className={styles.optLetter}>({letter})</span>
                          <MathText text={stripOptionPrefix(opt)} />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  mode === 'questions' && (
                    <div className={styles.printIntegerBox}>Numerical Answer: ____________</div>
                  )
                )}

                {mode === 'solutions' && (
                  <>
                    <div className={styles.answerLine}>Correct Answer: {item.correctAnswer}</div>
                    {item.explanation && (
                      <div className={styles.explainBox}>
                        <strong>Solution: </strong>
                        <MathText text={item.explanation} />
                      </div>
                    )}
                  </>
                )}
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
        <div className={styles.printPageBg}>
          <div className={styles.printToolbar}>Loading printable A4 sheet…</div>
        </div>
      }
    >
      <FacultyPrintContent />
    </Suspense>
  );
}
