"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Gauge, Pause, Play, X } from "lucide-react";

import { usePlayer } from "@/components/lecture-player/player-provider";
import { WaveSeekbar } from "@/components/lecture-player/wave-seekbar";
import { Button } from "@/components/ui/button";
import { formatSpeed } from "@/lib/lecture-player/playback-speed";
import { formatTime } from "@/lib/lecture-player/physics";

import "./player.css";

// Единый пульт: виден на всех страницах, пока выбрана запись.
export function PlayerDock() {
  const {
    current,
    isPlaying,
    hasError,
    speed,
    cycleSpeed,
    togglePlay,
    getTime,
    close,
  } = usePlayer();
  const [expanded, setExpanded] = useState(false);
  const dockRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

  const duration = current?.duration;
  useEffect(() => {
    if (!duration) return;
    let frame = 0;
    const tick = () => {
      const time = getTime();
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${time / duration})`;
      }
      if (timeRef.current) {
        timeRef.current.textContent = `${formatTime(time)} / ${formatTime(duration)}`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, getTime]);

  useEffect(() => {
    if (!expanded) return;
    // Сворачиваем по отпусканию: прокрутка пальцем заканчивается pointercancel,
    // а перетаскивание волны начинается внутри карточки.
    let pressedOutside = false;
    const onDown = (event: PointerEvent) => {
      pressedOutside = !dockRef.current?.contains(event.target as Node);
    };
    const onUp = () => {
      if (pressedOutside) setExpanded(false);
      pressedOutside = false;
    };
    const onCancel = () => {
      pressedOutside = false;
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onCancel);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onCancel);
    };
  }, [expanded]);

  if (!current) return null;

  return (
    <section
      ref={dockRef}
      className="player-dock fixed inset-x-2 bottom-[calc(0.5rem+env(safe-area-inset-bottom))] z-40 overflow-hidden rounded-2xl border bg-background shadow-lg sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-[400px]"
      aria-label="Плеер лекций"
    >
      <div className="player-dock__wave" data-open={expanded ? "" : undefined}>
        <div className="player-dock__wave-inner" inert={!expanded}>
          <div className="player-dock__top">
            <button
              type="button"
              className="player-dock__speed"
              aria-label={`Скорость воспроизведения: ${formatSpeed(speed)}. Нажмите, чтобы изменить`}
              onClick={cycleSpeed}
            >
              <Gauge aria-hidden="true" />
              <span>{formatSpeed(speed)}</span>
            </button>
            {current.format ? (
              <span className="player-dock__format">{current.format}</span>
            ) : null}
          </div>
          <WaveSeekbar
            key={current.id}
            lecture={current}
            expanded={expanded}
          />
        </div>
      </div>
      <div className="relative flex h-[50px] items-center gap-2 px-3 sm:gap-3 sm:px-4">
        <span
          ref={progressRef}
          className="player-dock__progress"
          aria-hidden="true"
        />
        <Button
          type="button"
          size="icon"
          className="rounded-full"
          aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="fill-current" />
          ) : (
            <Play className="fill-current" />
          )}
        </Button>
        <button
          type="button"
          className="min-w-0 flex-1 cursor-pointer text-left"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          <span className="block truncate text-sm font-medium">
            {current.title}
          </span>
          <span
            ref={timeRef}
            className="block text-xs text-muted-foreground tabular-nums"
          >
            {hasError ? "Не удалось загрузить запись" : "0:00"}
          </span>
        </button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={expanded ? "Свернуть плеер" : "Развернуть плеер"}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? <ChevronDown /> : <ChevronUp />}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Закрыть плеер"
          onClick={() => {
            setExpanded(false);
            close();
          }}
        >
          <X />
        </Button>
      </div>
    </section>
  );
}
