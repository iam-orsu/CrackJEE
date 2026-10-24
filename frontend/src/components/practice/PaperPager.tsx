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

/* Previous / numbered pages / Next for a paper list. Used at the top and bottom of paper rows. */
export function PaperPager({ page, pageCount, disabled, onPageChange }: { page: number; pageCount: number; disabled: boolean; onPageChange: (page: number) => void }) {
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
