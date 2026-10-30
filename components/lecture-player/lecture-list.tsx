"use client";

import { Pause, Play } from "lucide-react";

import { usePlayer } from "@/components/lecture-player/player-provider";
import { Button } from "@/components/ui/button";
import { lectures } from "@/lib/lecture-player/lectures";
import { formatTime } from "@/lib/lecture-player/physics";

export function LectureList() {
  const { current, isPlaying, playLecture } = usePlayer();

  return (
    <ul className="divide-y rounded-xl border">
      {lectures.map((lecture) => {
        const isActive = current?.id === lecture.id;
        const isThisPlaying = isActive && isPlaying;
        return (
          <li key={lecture.id} className="flex items-center gap-3 p-3">
            <Button
              type="button"
              size="icon-lg"
              variant={isActive ? "default" : "secondary"}
              className="rounded-full"
              aria-label={`${isThisPlaying ? "Пауза" : "Воспроизвести"}: ${lecture.title}`}
              onClick={() => playLecture(lecture)}
            >
              {isThisPlaying ? (
                <Pause className="fill-current" />
              ) : (
                <Play className="fill-current" />
              )}
            </Button>
            <span className="min-w-0 flex-1 truncate font-medium">
              {lecture.title}
            </span>
            <span className="text-sm text-muted-foreground tabular-nums">
              {formatTime(lecture.duration)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
