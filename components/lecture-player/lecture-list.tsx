"use client";

import { Check, Plus } from "lucide-react";

import { SharpPause, SharpPlay } from "@/components/lecture-player/icons";
import { usePlayer } from "@/components/lecture-player/player-provider";
import { usePlaylist } from "@/components/lecture-player/use-playlist";
import { Button } from "@/components/ui/button";
import { lectures } from "@/lib/lecture-player/lectures";
import { formatTime } from "@/lib/lecture-player/physics";

export function LectureList() {
  const { current, isPlaying, playLecture } = usePlayer();
  const { items, add, remove } = usePlaylist();

  return (
    <ul className="divide-y rounded-xl border">
      {lectures.map((lecture) => {
        const isActive = current?.id === lecture.id;
        const isThisPlaying = isActive && isPlaying;
        const inPlaylist = items.some((item) => item.id === lecture.id);
        return (
          <li key={lecture.id} className="flex items-center gap-3 p-3">
            <Button
              type="button"
              size="icon-lg"
              variant={isActive ? "default" : "secondary"}
              className="rounded-full"
              aria-label={`${isThisPlaying ? "Пауза" : "Воспроизвести"}: ${lecture.title}`}
              onClick={() => playLecture(lecture, "catalog")}
            >
              {isThisPlaying ? <SharpPause /> : <SharpPlay />}
            </Button>
            <span className="min-w-0 flex-1 truncate font-medium">
              {lecture.title}
            </span>
            <span className="text-sm text-muted-foreground tabular-nums">
              {formatTime(lecture.duration)}
            </span>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-pressed={inPlaylist}
              aria-label={`${inPlaylist ? "Убрать из плейлиста" : "Добавить в плейлист"}: ${lecture.title}`}
              title={inPlaylist ? "Убрать из плейлиста" : "Добавить в плейлист"}
              onClick={() =>
                inPlaylist ? remove(lecture.id) : add(lecture.id)
              }
            >
              {inPlaylist ? <Check className="text-primary" /> : <Plus />}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
