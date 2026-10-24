// Page numbers around the current page, one by one. The last page is not pinned, so the list never jumps to the end.
function pageWindow(page: number, pageCount: number): number[] {
  const start = Math.max(1, page - 2);
  const end = Math.min(pageCount, page + 2);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/* Previous / numbered pages / Next for a paper list. Used at the top and bottom of paper rows. */
export function PaperPager({ page, pageCount, disabled, onPageChange }: { page: number; pageCount: number; disabled: boolean; onPageChange: (page: number) => void }) {
  if (pageCount <= 1) return null;
  return (
    <nav className="paper-pager" aria-label="Paper pages">
      <button type="button" className="btn btn-outline" onClick={() => onPageChange(page - 1)} disabled={disabled || page <= 1}>
        Previous
      </button>
      {pageWindow(page, pageCount).map((item) => (
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
      <button type="button" className="btn btn-outline" onClick={() => onPageChange(page + 1)} disabled={disabled || page >= pageCount}>
        Next
      </button>
    </nav>
  );
}
