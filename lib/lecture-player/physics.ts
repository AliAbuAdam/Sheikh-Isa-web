// Физика волны: чистые функции без DOM, единицы — секунды и пиксели.

export const BAR_PITCH = 9;
export const FLING_FRICTION = 2.6;
export const FLING_MIN_SPEED = 30;
export const GLIDE_RATE = 12;
export const RUBBER_LIMIT = 90;
export const TAP_MAX_MOVE = 6;
export const TAP_MAX_MS = 250;
export const HOLD_DELAY_MS = 280;
export const JUMP_SECONDS = 15;

const VELOCITY_WINDOW_MS = 100;
const VELOCITY_STALE_MS = 60;

export type PointerSample = { x: number; t: number };

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Скорость пальца в px/с; ноль, если перед отпусканием палец остановился. */
export function releaseVelocity(samples: PointerSample[], now: number) {
  const last = samples[samples.length - 1];
  if (!last || now - last.t > VELOCITY_STALE_MS) return 0;
  const first = samples.find((s) => last.t - s.t <= VELOCITY_WINDOW_MS) ?? last;
  const elapsed = last.t - first.t;
  return elapsed > 0 ? ((last.x - first.x) / elapsed) * 1000 : 0;
}

export function decaySpeed(speed: number, dt: number) {
  return speed * Math.exp(-FLING_FRICTION * dt);
}

export function glideTo(current: number, target: number, dt: number) {
  return target + (current - target) * Math.exp(-GLIDE_RATE * dt);
}

/** Сопротивление за краями записи: чем дальше тянем, тем меньше она сдвигается. */
export function rubberBand(
  position: number,
  duration: number,
  secondsPerPixel: number,
) {
  const edge = clamp(position, 0, duration);
  const overPixels = Math.abs(position - edge) / secondsPerPixel;
  if (overPixels === 0) return position;
  const resisted =
    (1 - 1 / ((overPixels * 0.55) / RUBBER_LIMIT + 1)) * RUBBER_LIMIT;
  return edge + Math.sign(position - edge) * resisted * secondsPerPixel;
}

/** Скорость перемотки при удержании кнопки, с/с: разгон от 10 до 120. */
export function holdRate(heldMs: number) {
  const seconds = heldMs / 1000;
  return Math.min(120, 10 + seconds * seconds * 20);
}

export function visibleBars(
  position: number,
  width: number,
  barSeconds: number,
  barCount: number,
) {
  const center = position / barSeconds;
  const half = width / 2 / BAR_PITCH + 1;
  return {
    first: Math.max(0, Math.floor(center - half)),
    last: Math.min(barCount - 1, Math.ceil(center + half)),
  };
}

export function formatTime(totalSeconds: number) {
  const total = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = String(total % 60).padStart(2, "0");
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${seconds}`
    : `${minutes}:${seconds}`;
}
