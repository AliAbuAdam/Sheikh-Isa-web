"use client";

import { useCallback, useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import {
  SharpFastForward,
  SharpPause,
  SharpPlay,
  SharpRewind,
  SharpSkipBack,
  SharpSkipForward,
} from "@/components/lecture-player/icons";
import { usePlayer } from "@/components/lecture-player/player-provider";
import type { Lecture } from "@/lib/lecture-player/lectures";
import {
  BAR_PITCH,
  FLING_MIN_SPEED,
  HOLD_DELAY_MS,
  JUMP_SECONDS,
  TAP_MAX_MOVE,
  TAP_MAX_MS,
  clamp,
  decaySpeed,
  formatTime,
  glideTo,
  holdRate,
  releaseVelocity,
  rubberBand,
  visibleBars,
  type PointerSample,
} from "@/lib/lecture-player/physics";

import "./player.css";

type Mode = "follow" | "drag" | "fling" | "glide" | "hold" | "wheel";

const BAR_WIDTH = 5;
const WHEEL_COMMIT_MS = 180;

function SeekButton({
  label,
  onJump,
  onHoldStart,
  onHoldEnd,
  children,
}: {
  label: string;
  onJump: () => void;
  onHoldStart: () => void;
  onHoldEnd: () => void;
  children: ReactNode;
}) {
  const timer = useRef(0);
  const holding = useRef(false);

  const cancel = () => {
    clearTimeout(timer.current);
    if (holding.current) {
      holding.current = false;
      onHoldEnd();
    }
  };

  return (
    <button
      type="button"
      className="wave-seekbar__round"
      aria-label={label}
      onPointerDown={() => {
        holding.current = false;
        timer.current = window.setTimeout(() => {
          holding.current = true;
          onHoldStart();
        }, HOLD_DELAY_MS);
      }}
      onPointerUp={() => {
        const wasHolding = holding.current;
        cancel();
        if (!wasHolding) onJump();
      }}
      onPointerCancel={cancel}
      onPointerLeave={cancel}
      onContextMenu={(event) => event.preventDefault()}
      onClick={(event) => {
        if (event.detail === 0) onJump();
      }}
    >
      {children}
    </button>
  );
}

export function WaveSeekbar({ lecture }: { lecture: Lecture }) {
  const { isPlaying, togglePlay, seek, getTime, previous, next, playLecture } =
    usePlayer();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elapsedRef = useRef<HTMLSpanElement>(null);
  const motion = useRef({
    mode: "follow" as Mode,
    position: 0,
    raw: 0,
    speed: 0,
    target: 0,
    direction: 1,
    holdStart: 0,
    startX: 0,
    startPosition: 0,
    startTime: 0,
    samples: [] as PointerSample[],
    wheelTimer: 0,
  });

  const barSeconds = lecture.duration / lecture.peaks.length;
  const secondsPerPixel = barSeconds / BAR_PITCH;

  const setScrubbing = (on: boolean) => {
    rootRef.current?.toggleAttribute("data-scrubbing", on);
  };

  const commit = useCallback(() => {
    const m = motion.current;
    m.mode = "follow";
    m.position = clamp(m.position, 0, lecture.duration);
    seek(Math.min(m.position, lecture.duration - 0.1));
    rootRef.current?.removeAttribute("data-scrubbing");
  }, [lecture.duration, seek]);

  const glide = (target: number) => {
    const m = motion.current;
    m.target = clamp(target, 0, lecture.duration);
    m.mode = "glide";
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const root = rootRef.current;
    if (!canvas || !context || !root) return;
    const m = motion.current;
    m.position = getTime();

    let frame = 0;
    let previousTime = 0;
    let drawn = "";
    let label = "";

    const step = (dt: number, now: number) => {
      if (m.mode === "follow") {
        m.position = getTime();
      } else if (m.mode === "fling") {
        m.position += m.speed * secondsPerPixel * dt;
        m.speed = decaySpeed(m.speed, dt);
        const out = m.position < 0 || m.position > lecture.duration;
        if (out || Math.abs(m.speed) < FLING_MIN_SPEED) commit();
      } else if (m.mode === "glide") {
        m.position = glideTo(m.position, m.target, dt);
        if (Math.abs(m.position - m.target) < barSeconds / 20) {
          m.position = m.target;
          commit();
        }
      } else if (m.mode === "hold") {
        const rate = holdRate(now - m.holdStart);
        m.position = clamp(
          m.position + m.direction * rate * dt,
          0,
          lecture.duration,
        );
      }
    };

    const draw = () => {
      if (!root.parentElement?.clientHeight) return;
      const { width, height } = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      const { fill: playedColor, stroke: upcomingColor } =
        getComputedStyle(canvas);
      const signature = [
        m.position,
        width,
        height,
        playedColor,
        upcomingColor,
      ].join();
      if (signature === drawn) return;
      drawn = signature;

      if (canvas.width !== Math.round(width * ratio)) {
        canvas.width = Math.round(width * ratio);
      }
      if (canvas.height !== Math.round(height * ratio)) {
        canvas.height = Math.round(height * ratio);
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);

      const center = width / 2;
      const amplitude = height * 0.66;
      const { first, last } = visibleBars(
        m.position,
        width,
        barSeconds,
        lecture.peaks.length,
      );
      for (let i = first; i <= last; i++) {
        const x = center + ((i * barSeconds - m.position) / barSeconds) * BAR_PITCH;
        const barHeight = Math.max(4, lecture.peaks[i] * amplitude);
        const played = (i + 1) * barSeconds <= m.position;
        context.fillStyle = played ? playedColor : upcomingColor;
        context.globalAlpha = played
          ? 1 - (0.7 * Math.abs(x - center)) / Math.max(center, 1)
          : 1;
        context.beginPath();
        context.roundRect(
          x,
          (height - barHeight) / 2,
          BAR_WIDTH,
          barHeight,
          BAR_WIDTH / 2,
        );
        context.fill();
      }
      context.globalAlpha = 1;
    };

    const tick = (now: number) => {
      const dt = previousTime ? Math.min((now - previousTime) / 1000, 0.05) : 0;
      previousTime = now;
      step(dt, now);
      draw();
      const text = formatTime(m.position);
      if (text !== label) {
        label = text;
        if (elapsedRef.current) elapsedRef.current.textContent = text;
        root.setAttribute("aria-valuenow", String(Math.floor(m.position)));
        root.setAttribute("aria-valuetext", text);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      if (m.mode !== "wheel") {
        m.mode = "wheel";
        root.setAttribute("data-scrubbing", "");
      }
      m.position = clamp(
        m.position + event.deltaX * secondsPerPixel,
        0,
        lecture.duration,
      );
      clearTimeout(m.wheelTimer);
      m.wheelTimer = window.setTimeout(commit, WHEEL_COMMIT_MS);
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(m.wheelTimer);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [lecture, barSeconds, secondsPerPixel, getTime, commit]);

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    const m = motion.current;
    event.currentTarget.setPointerCapture(event.pointerId);
    m.mode = "drag";
    m.startX = event.clientX;
    m.startPosition = m.position;
    m.raw = m.position;
    m.startTime = event.timeStamp;
    m.samples = [{ x: event.clientX, t: event.timeStamp }];
    setScrubbing(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const m = motion.current;
    if (m.mode !== "drag") return;
    m.samples.push({ x: event.clientX, t: event.timeStamp });
    if (m.samples.length > 12) m.samples.shift();
    m.raw = m.startPosition - (event.clientX - m.startX) * secondsPerPixel;
    m.position = rubberBand(m.raw, lecture.duration, secondsPerPixel);
  };

  const onPointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    const m = motion.current;
    if (m.mode !== "drag") return;
    const moved = Math.abs(event.clientX - m.startX);
    const isTap =
      moved < TAP_MAX_MOVE && event.timeStamp - m.startTime < TAP_MAX_MS;
    if (isTap) {
      const { left, width } = event.currentTarget.getBoundingClientRect();
      setScrubbing(false);
      glide(
        m.startPosition +
          (event.clientX - left - width / 2) * secondsPerPixel,
      );
      return;
    }
    if (m.position < 0 || m.position > lecture.duration) {
      setScrubbing(false);
      glide(m.position);
      return;
    }
    const speed = -releaseVelocity(m.samples, event.timeStamp);
    if (Math.abs(speed) > FLING_MIN_SPEED) {
      m.speed = speed;
      m.mode = "fling";
    } else {
      commit();
    }
  };

  const onPointerCancel = () => {
    motion.current.mode = "follow";
    setScrubbing(false);
  };

  const startHold = (direction: number) => {
    const m = motion.current;
    m.direction = direction;
    m.holdStart = performance.now();
    m.mode = "hold";
  };

  const jump = (direction: number) => {
    glide(motion.current.position + direction * JUMP_SECONDS);
  };

  return (
    <div
      ref={rootRef}
      className="wave-seekbar"
      role="slider"
      tabIndex={0}
      aria-label={`Позиция: ${lecture.title}`}
      aria-valuemin={0}
      aria-valuemax={Math.floor(lecture.duration)}
      aria-valuenow={0}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          const sign = event.key === "ArrowRight" ? 1 : -1;
          glide(motion.current.position + sign * JUMP_SECONDS);
        } else if (event.key === " ") {
          event.preventDefault();
          togglePlay();
        }
      }}
    >
      <canvas
        ref={canvasRef}
        className="wave-seekbar__canvas"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      />
      <span className="wave-seekbar__playhead" aria-hidden="true" />
      <div className="wave-seekbar__controls">
        <button
          type="button"
          className="wave-seekbar__ghost"
          aria-label="Предыдущая запись"
          disabled={!previous}
          onClick={() => previous && playLecture(previous)}
        >
          <SharpSkipBack />
        </button>
        <SeekButton
          label={`Назад на ${JUMP_SECONDS} секунд, удерживайте для перемотки`}
          onJump={() => jump(-1)}
          onHoldStart={() => startHold(-1)}
          onHoldEnd={commit}
        >
          <SharpRewind />
        </SeekButton>
        <button
          type="button"
          className="wave-seekbar__round wave-seekbar__round--main"
          aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
          onClick={togglePlay}
        >
          {isPlaying ? <SharpPause /> : <SharpPlay />}
        </button>
        <SeekButton
          label={`Вперёд на ${JUMP_SECONDS} секунд, удерживайте для перемотки`}
          onJump={() => jump(1)}
          onHoldStart={() => startHold(1)}
          onHoldEnd={commit}
        >
          <SharpFastForward />
        </SeekButton>
        <button
          type="button"
          className="wave-seekbar__ghost"
          aria-label="Следующая запись"
          disabled={!next}
          onClick={() => next && playLecture(next)}
        >
          <SharpSkipForward />
        </button>
      </div>
      <div className="wave-seekbar__footer">
        <span ref={elapsedRef} className="wave-seekbar__elapsed">
          0:00
        </span>
        {` / ${formatTime(lecture.duration)}`}
      </div>
    </div>
  );
}
