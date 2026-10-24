import type { PaperSet } from '@/types';
import { PaperCard } from './shared';

interface PaperStepProps {
  papersError: string;
  paperSets: PaperSet[];
  page: number;
  pageCount: number;
  available: number;
  papersLoading: boolean;
  onChoosePaper: (paper: PaperSet) => void;
  onPageChange: (page: number) => void;
  onStartExam: () => void;
}

// Page numbers to show: the first and last page, the current page with its neighbours, and gaps in between
function pageWindow(page: number, pageCount: number): Array<number | 'gap'> {
  const pages = new Set<number>([1, pageCount, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pageCount));
  const sorted = [...pages].sort((a, b) => a - b);
  const out: Array<number | 'gap'> = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1]! > 1) out.push('gap');
    out.push(p);
  });
  return out;
}

function PaperPager({ page, pageCount, disabled, onPageChange }: { page: number; pageCount: number; disabled: boolean; onPageChange: (page: number) => void }) {
  if (pageCount <= 1) return null;
  return (
    <nav className="paper-pager" aria-label="Paper pages">
      <button type="button" className="btn btn-outline" onClick={() => onPageChange(page - 1)} disabled={disabled || page <= 1}>
        Previous
      </button>
      {pageWindow(page, pageCount).map((item, i) =>
        item === 'gap' ? (
          <span key={`gap-${i}`} className="paper-pager-gap">…</span>
        ) : (
          <button
            key={item}
            type="button"
            className={`paper-pager-num${item === page ? ' paper-pager-num-active' : ''}`}
            onClick={() => onPageChange(item)}
            disabled={disabled || item === page}
            aria-current={item === page ? 'page' : undefined}
          >
            {item}
          </button>
        ),
      )}
      <button type="button" className="btn btn-outline" onClick={() => onPageChange(page + 1)} disabled={disabled || page >= pageCount}>
        Next
      </button>
    </nav>
  );
}

/* Step 3 (papers): one page of distinct paper cards, paged from the top and the bottom, plus a random-start option */
export function PaperStep({ papersError, paperSets, page, pageCount, available, papersLoading, onChoosePaper, onPageChange, onStartExam }: PaperStepProps) {
  return (
    <>
      <p className="wizard-section-title">Choose your paper</p>
      <p className="wizard-section-sub">
        Each paper is a different set of questions from the bank. Pick one to start.
      </p>

      {papersError && <div className="badge badge-red" style={{ marginBottom: 16 }}>{papersError}</div>}

      {available > 0 && (
        <div className="paper-combos">
          <span className="paper-combos-value">{available >= 10000 ? '10,000+' : available.toLocaleString('en-IN')}</span>
          <span className="paper-combos-label">
            practice combinations · 10 papers per page · page {page} of {pageCount}
          </span>
        </div>
      )}

      <PaperPager page={page} pageCount={pageCount} disabled={papersLoading} onPageChange={onPageChange} />

      {/* The row stays mounted while paging, so the page does not jump to the top */}
      <div className={`paper-row${papersLoading ? ' paper-row-loading' : ''}`} aria-busy={papersLoading}>
        {paperSets.map((paper) => (
          <PaperCard key={paper.number} paper={paper} onStart={() => onChoosePaper(paper)} />
        ))}
        {papersLoading && <div className="paper-row-overlay">Loading papers...</div>}
      </div>

      <PaperPager page={page} pageCount={pageCount} disabled={papersLoading} onPageChange={onPageChange} />

      <div className="paper-grid-actions">
        <button type="button" className="btn btn-ghost" onClick={onStartExam}>
          Skip, start a random paper
        </button>
      </div>
    </>
  );
}
