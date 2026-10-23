import type { PaperSet } from '@/types';
import { PaperCard, formatPossible } from './shared';

interface PaperStepProps {
  papersError: string;
  paperSets: PaperSet[];
  possibleSets: string;
  papersLoading: boolean;
  onChoosePaper: (paper: PaperSet) => void;
  onLoadPapers: () => void;
  onStartExam: () => void;
}

/* Step 3 (papers): the generated paper cards, with shuffle and a random-start option */
export function PaperStep({ papersError, paperSets, possibleSets, papersLoading, onChoosePaper, onLoadPapers, onStartExam }: PaperStepProps) {
  return (
    <>
      <p className="wizard-section-title">Choose your paper</p>
      <p className="wizard-section-sub">
        Each paper is a different set of questions from the bank. Pick one to start.
      </p>

      {papersError && <div className="badge badge-red" style={{ marginBottom: 16 }}>{papersError}</div>}

      {paperSets.length > 0 && (
        <div className="paper-combos">
          <span className="paper-combos-value">{formatPossible(possibleSets)}</span>
          <span className="paper-combos-label">
            distinct papers this bank can make for your selection. You are looking at {paperSets.length} of them.
          </span>
        </div>
      )}

      {/* The row stays mounted while shuffling, so the page does not jump to the top */}
      <div className={`paper-row${papersLoading ? ' paper-row-loading' : ''}`} aria-busy={papersLoading}>
        {paperSets.map((paper) => (
          <PaperCard key={paper.number} paper={paper} onStart={() => onChoosePaper(paper)} />
        ))}
        {papersLoading && <div className="paper-row-overlay">Shuffling the bank...</div>}
      </div>

      <div className="paper-grid-actions">
        <button type="button" className="btn btn-outline" onClick={onLoadPapers} disabled={papersLoading}>
          Shuffle papers
        </button>
        <button type="button" className="btn btn-ghost" onClick={onStartExam}>
          Skip, start a random paper
        </button>
      </div>
    </>
  );
}
