// Залитые иконки с острыми углами: у lucide углы скруглены обводкой.
export function SharpRewind() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="12,5 2,12 12,19" />
      <polygon points="22,5 12,12 22,19" />
    </svg>
  );
}

export function SharpFastForward() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="2,5 12,12 2,19" />
      <polygon points="12,5 22,12 12,19" />
    </svg>
  );
}

export function SharpSkipBack() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="20,5 8,12 20,19" />
      <rect x="4" y="5" width="2.5" height="14" />
    </svg>
  );
}

export function SharpSkipForward() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="4,5 16,12 4,19" />
      <rect x="17.5" y="5" width="2.5" height="14" />
    </svg>
  );
}

export function SharpPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="6,4 20,12 6,20" />
    </svg>
  );
}

export function SharpPause() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

export function PlaylistIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3 6h12M3 12h8M3 18h8" />
      <polygon points="15,11 22,15.5 15,20" fill="currentColor" stroke="none" />
    </svg>
  );
}
