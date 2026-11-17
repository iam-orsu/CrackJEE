// Page numbers around the current page — up to ten of them, so the depth of the
// list is visible without the row running away.
function pageWindow(page: number, pageCount: number): number[] {
  const start = Math.max(1, page - 4);
  const end = Math.min(pageCount, page + 5);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/* Previous / numbered pages / Next for a paper list. */
export function PaperPager({ page, pageCount, disabled, onPageChange }: { page: number; pageCount: number; disabled: boolean; onPageChange: (page: number) => void }) {
  if (pageCount <= 1) return null;
  const win = pageWindow(page, pageCount);
  const start = win[0]!;
  const end = win[win.length - 1]!;
  return (
    <nav className="paper-pager" aria-label="Paper pages">
      <button type="button" className="btn btn-outline" onClick={() => onPageChange(page - 1)} disabled={disabled || page <= 1}>
        Previous
      </button>
      <div className="paper-pager-pages">
        {start > 1 && <span className="paper-pager-gap">…</span>}
        {win.map((item) => (
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
        ))}
        {end < pageCount && <span className="paper-pager-gap">…</span>}
      </div>
      <span className="paper-pager-meta">
        Page {page} of {pageCount} · 10 papers per page
      </span>
      <button type="button" className="btn btn-outline" onClick={() => onPageChange(page + 1)} disabled={disabled || page >= pageCount}>
        Next
      </button>
    </nav>
  );
}
