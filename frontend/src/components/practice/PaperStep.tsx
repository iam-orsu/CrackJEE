import type { PaperSet } from '@/types';
import { PaperCard } from './shared';
import { PaperPager } from './PaperPager';

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
            practice combinations · 10 papers per page · page {page}
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
