/**
 * Позиция для экрана блокировки. setPositionState бросает исключение,
 * если позиция больше длительности, поэтому значения приводятся к допустимым.
 */
export function toPositionState(
  duration: number,
  position: number,
  playbackRate: number,
): MediaPositionState | null {
  if (!Number.isFinite(duration) || duration <= 0) return null;
  return {
    duration,
    position: Math.min(Math.max(position, 0), duration),
    playbackRate: playbackRate > 0 ? playbackRate : 1,
  };
}
