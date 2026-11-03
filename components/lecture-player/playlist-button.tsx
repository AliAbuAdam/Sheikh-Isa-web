"use client";

import { PlaylistIcon } from "@/components/lecture-player/icons";
import { usePlayer } from "@/components/lecture-player/player-provider";
import { usePlaylist } from "@/components/lecture-player/use-playlist";
import { Button } from "@/components/ui/button";

// Вход в плейлист, который не зависит от того, открыт ли плеер.
export function PlaylistButton() {
  const { playlistOpen, setPlaylistOpen } = usePlayer();
  const { items } = usePlaylist();
  if (items.length === 0 && !playlistOpen) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="relative"
      data-playlist-trigger=""
      aria-label={`Плейлист: ${items.length}`}
      aria-expanded={playlistOpen}
      title="Плейлист"
      onClick={() => setPlaylistOpen((open) => !open)}
    >
      <PlaylistIcon className="h-5 w-5" />
      {items.length > 0 ? (
        <span className="absolute -top-1 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] leading-none font-semibold text-primary-foreground tabular-nums ring-2 ring-background">
          {items.length}
        </span>
      ) : null}
    </Button>
  );
}
