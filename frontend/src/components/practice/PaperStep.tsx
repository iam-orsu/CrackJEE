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
  onBack?: () => void;
}

/* Step 3 (papers): one page of distinct paper cards, paged from the top and the bottom, plus a random-start option */
export function PaperStep({
  papersError,
  paperSets,
  page,
  pageCount,
  available,
  papersLoading,
  onChoosePaper,
  onPageChange,
  onStartExam,
  onBack,
}: PaperStepProps) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
        <div>
          <p className="wizard-section-title" style={{ margin: 0 }}>Choose your paper</p>
          <p className="wizard-section-sub" style={{ margin: '4px 0 0' }}>
            Each paper is a different set of questions from the bank. Pick one to start.
          </p>
        </div>
        {onBack && (
          <button type="button" className="btn btn-ghost" onClick={onBack} style={{ fontSize: 13 }}>
            ← Back to Settings
          </button>
        )}
      </div>

      {papersError && available > 0 && (
        <div className="badge badge-red" style={{ marginBottom: 16 }}>{papersError}</div>
      )}

      {available === 0 && !papersLoading && (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 14,
            padding: '32px 24px',
            textAlign: 'center',
            maxWidth: 580,
            margin: '24px auto',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 12 }}>📚</div>
          <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: 'var(--gray-900)' }}>
            Not enough pre-assembled papers for this question count
          </h3>
          <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.5 }}>
            A single topic has fewer pre-built questions in the bank than the requested count to create distinct paper combinations. You can start your custom practice session directly right now, or go back to select more topics!
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={onStartExam}
              style={{ padding: '10px 24px', fontSize: 14 }}
            >
              ⚡ Start Practice Directly
            </button>
            {onBack && (
              <button
                type="button"
                className="btn btn-ghost btn-lg"
                onClick={onBack}
                style={{ padding: '10px 20px', fontSize: 14 }}
              >
                ← Add More Topics
              </button>
            )}
          </div>
        </div>
      )}

      {available > 0 && (
        <div className="paper-combos">
          <span className="paper-combos-value">{available >= 10000 ? '10,000+' : available.toLocaleString('en-IN')}</span>
          <span className="paper-combos-label">
            practice combinations · 10 papers per page · page {page}
          </span>
        </div>
      )}

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
