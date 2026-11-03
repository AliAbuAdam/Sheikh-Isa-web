"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Gauge,
  Menu,
  X,
} from "lucide-react";

import { SharpPause, SharpPlay } from "@/components/lecture-player/icons";
import { usePlayer } from "@/components/lecture-player/player-provider";
import { PlaylistPanel } from "@/components/lecture-player/playlist-panel";
import { WaveSeekbar } from "@/components/lecture-player/wave-seekbar";
import { Button } from "@/components/ui/button";
import { formatSpeed } from "@/lib/lecture-player/playback-speed";
import { formatTime } from "@/lib/lecture-player/physics";
import { cn } from "@/lib/utils";

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
    playlistOpen,
    setPlaylistOpen,
  } = usePlayer();
  const [expanded, setExpanded] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);
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

  const collapse = () => {
    setExpanded(false);
    setPlaylistOpen(false);
  };
  const toggleExpanded = () => {
    if (expanded) collapse();
    else setExpanded(true);
  };

  useEffect(() => {
    if (!expanded && !playlistOpen) return;
    // Сворачиваем по отпусканию: прокрутка пальцем заканчивается pointercancel,
    // а перетаскивание волны начинается внутри карточки.
    let pressedOutside = false;
    const onDown = (event: PointerEvent) => {
      const target = event.target as Element;
      // Значок плейлиста в шапке сам открывает и закрывает панель.
      pressedOutside =
        !dockRef.current?.contains(target) &&
        !target.closest?.("[data-playlist-trigger]");
    };
    const onUp = () => {
      if (pressedOutside) {
        setExpanded(false);
        setPlaylistOpen(false);
      }
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
  }, [expanded, playlistOpen, setPlaylistOpen]);

  if (!current && !playlistOpen) return null;

  return (
    <div
      ref={dockRef}
      className="fixed inset-x-2 bottom-[calc(0.5rem+env(safe-area-inset-bottom))] z-40 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-[400px]"
    >
      <div
        className="player-dock__playlist"
        data-open={playlistOpen ? "" : undefined}
      >
        <div className="player-dock__playlist-inner" inert={!playlistOpen}>
          <PlaylistPanel onClose={() => setPlaylistOpen(false)} />
        </div>
      </div>
      {current ? (
        <section
          className="player-dock overflow-hidden rounded-2xl border"
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
                <div className="player-dock__top-actions">
                  <button
                    type="button"
                    className="player-dock__tool"
                    aria-label={
                      playlistOpen ? "Закрыть плейлист" : "Открыть плейлист"
                    }
                    title="Плейлист"
                    aria-expanded={playlistOpen}
                    onClick={() => setPlaylistOpen((value) => !value)}
                  >
                    <Menu aria-hidden="true" />
                  </button>
                </div>
              </div>
              <WaveSeekbar key={current.id} lecture={current} />
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
              {isPlaying ? <SharpPause /> : <SharpPlay />}
            </Button>
            <div className="min-w-0 flex-1">
              <Link
                href={current.sourceHref}
                className="player-dock__title"
                title="Перейти к источнику записи"
              >
                {current.title}
              </Link>
              <span
                ref={timeRef}
                className={cn(
                  "block text-xs text-muted-foreground tabular-nums",
                  expanded && !hasError && "hidden",
                )}
              >
                {hasError ? "Не удалось загрузить запись" : "0:00"}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={expanded ? "Свернуть плеер" : "Развернуть плеер"}
              onClick={toggleExpanded}
            >
              {expanded ? <ChevronDown /> : <ChevronUp />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Закрыть плеер"
              onClick={() => {
                collapse();
                close();
              }}
            >
              <X />
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
