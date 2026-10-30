export const PLAYBACK_SPEEDS = [1, 1.25, 1.5, 1.75, 2, 0.75];

export function nextSpeed(speed: number) {
  const index = PLAYBACK_SPEEDS.indexOf(speed);
  return PLAYBACK_SPEEDS[(index + 1) % PLAYBACK_SPEEDS.length];
}

export function formatSpeed(speed: number) {
  return `${speed}×`;
}
