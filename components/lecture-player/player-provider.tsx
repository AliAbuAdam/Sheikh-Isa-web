"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { lectures, type Lecture } from "@/lib/lecture-player/lectures";
import { nextSpeed } from "@/lib/lecture-player/playback-speed";

type PlayerContextValue = {
  current: Lecture | null;
  isPlaying: boolean;
  hasError: boolean;
  speed: number;
  cycleSpeed: () => void;
  previous: Lecture | null;
  next: Lecture | null;
  playLecture: (lecture: Lecture) => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  getTime: () => number;
  close: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function usePlayer() {
  const value = use(PlayerContext);
  if (!value) throw new Error("usePlayer must be used within PlayerProvider");
  return value;
}

const TAB_CHANNEL = "lecture-player";

// Единственный <audio> на всё приложение. Он живёт в корневом layout и не
// пересоздаётся при переходах, поэтому две записи не могут играть одновременно.
export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const [current, setCurrent] = useState<Lecture | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [speed, setSpeed] = useState(1);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, []);

  const playLecture = useCallback(
    (lecture: Lecture) => {
      const audio = audioRef.current;
      if (!audio) return;
      if (lecture.id === current?.id) {
        togglePlay();
        return;
      }
      setHasError(false);
      setCurrent(lecture);
      audio.src = lecture.src;
      audio.play().catch(() => {});
    },
    [current?.id, togglePlay],
  );

  const seek = useCallback((seconds: number) => {
    if (audioRef.current) audioRef.current.currentTime = seconds;
  }, []);

  // defaultPlaybackRate нужен, чтобы скорость пережила смену src: load() сбрасывает playbackRate.
  const cycleSpeed = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const speedNow = nextSpeed(audio.playbackRate);
    audio.defaultPlaybackRate = speedNow;
    audio.playbackRate = speedNow;
    setSpeed(speedNow);
  }, []);

  const getTime = useCallback(() => audioRef.current?.currentTime ?? 0, []);

  const close = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    setCurrent(null);
    setHasError(false);
  }, []);

  useEffect(() => {
    const channel = new BroadcastChannel(TAB_CHANNEL);
    channel.onmessage = () => audioRef.current?.pause();
    channelRef.current = channel;
    return () => channel.close();
  }, []);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const session = navigator.mediaSession;
    session.metadata = current
      ? new MediaMetadata({ title: current.title, artist: "Шейх Иса" })
      : null;
    session.setActionHandler("play", () => audioRef.current?.play());
    session.setActionHandler("pause", () => audioRef.current?.pause());
    session.setActionHandler("seekto", (details) => {
      if (details.seekTime !== undefined) seek(details.seekTime);
    });
  }, [current, seek]);

  const value = useMemo(() => {
    const index = current
      ? lectures.findIndex((lecture) => lecture.id === current.id)
      : -1;
    return {
      current,
      isPlaying,
      hasError,
      speed,
      cycleSpeed,
      previous: index > 0 ? lectures[index - 1] : null,
      next: index >= 0 ? (lectures[index + 1] ?? null) : null,
      playLecture,
      togglePlay,
      seek,
      getTime,
      close,
    };
  }, [
    current,
    isPlaying,
    hasError,
    speed,
    cycleSpeed,
    playLecture,
    togglePlay,
    seek,
    getTime,
    close,
  ]);

  return (
    <PlayerContext value={value}>
      {children}
      <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => {
          setIsPlaying(true);
          channelRef.current?.postMessage("playing");
        }}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          if (audioRef.current?.getAttribute("src")) setHasError(true);
        }}
      />
    </PlayerContext>
  );
}
