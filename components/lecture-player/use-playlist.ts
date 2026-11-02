"use client";

import { useMemo, useSyncExternalStore } from "react";

import { lectures, type Lecture } from "@/lib/lecture-player/lectures";
import {
  addEntry,
  moveEntry,
  parseEntries,
  pruneExpired,
  removeEntry,
  type PlaylistEntry,
} from "@/lib/lecture-player/playlist";

const STORAGE_KEY = "lecture-playlist";
const EMPTY: PlaylistEntry[] = [];

let entries: PlaylistEntry[] | null = null;
const listeners = new Set<() => void>();

function readStorage() {
  try {
    return parseEntries(localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

function getSnapshot() {
  entries ??= pruneExpired(readStorage(), Date.now());
  return entries;
}

function update(next: PlaylistEntry[]) {
  entries = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Без хранилища плейлист работает до перезагрузки страницы.
  }
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  entries = null;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function add(id: string) {
  update(addEntry(getSnapshot(), id, Date.now()));
}

function remove(id: string) {
  update(removeEntry(getSnapshot(), id));
}

function move(id: string, targetId: string) {
  update(moveEntry(getSnapshot(), id, targetId));
}

function clear() {
  update([]);
}

export function usePlaylist() {
  const stored = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  const items = useMemo(
    () =>
      stored.flatMap((entry): Lecture[] => {
        const lecture = lectures.find((item) => item.id === entry.id);
        return lecture ? [lecture] : [];
      }),
    [stored],
  );
  return { items, add, remove, move, clear };
}
