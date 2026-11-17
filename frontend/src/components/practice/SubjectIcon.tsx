/* Line icons for the practice subjects — one set, one stroke, in the brand's navy. */

interface SubjectIconProps {
  subject: string;
  size?: number;
}

export function SubjectIcon({ subject, size = 28 }: SubjectIconProps) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (subject === 'Physics') {
    return (
      <svg {...props}>
        <ellipse cx="12" cy="12" rx="9.5" ry="3.8" />
        <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (subject === 'Chemistry') {
    return (
      <svg {...props}>
        <path d="M9.5 3h5M10.5 3v6.2L6 17.4A2 2 0 0 0 7.7 20.4h8.6a2 2 0 0 0 1.7-3L13.5 9.2V3" />
        <path d="M7.6 14.4h8.8" />
      </svg>
    );
  }

  if (subject === 'Mathematics') {
    return (
      <svg {...props}>
        <path d="M17.5 5H7.5l5.5 7-5.5 7h10" />
      </svg>
    );
  }

  /* Biology, Botany, Zoology */
  return (
    <svg {...props}>
      <path d="M5 19C4.2 9.6 11 4.6 20 4.4c.4 8.8-4.6 14.8-15 14.6Z" />
      <path d="M6.2 17.8C9.4 13 13.4 9.2 18 6.4" />
    </svg>
  );
}
