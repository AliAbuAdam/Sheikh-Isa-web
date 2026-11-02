// Срок хранения записи в плейлисте. Меняется здесь и действует на всех пользователей.
export const PLAYLIST_TTL_DAYS = 7;

const DAY_MS = 24 * 60 * 60 * 1000;

export type PlaylistEntry = {
  id: string;
  addedAt: number;
};

export function pruneExpired(
  entries: PlaylistEntry[],
  now: number,
  ttlDays = PLAYLIST_TTL_DAYS,
) {
  return entries.filter((entry) => now - entry.addedAt < ttlDays * DAY_MS);
}

export function addEntry(entries: PlaylistEntry[], id: string, now: number) {
  return entries.some((entry) => entry.id === id)
    ? entries
    : [...entries, { id, addedAt: now }];
}

export function removeEntry(entries: PlaylistEntry[], id: string) {
  return entries.filter((entry) => entry.id !== id);
}

/** Ставит запись id на место записи targetId, сдвигая остальные. */
export function moveEntry(
  entries: PlaylistEntry[],
  id: string,
  targetId: string,
) {
  const from = entries.findIndex((entry) => entry.id === id);
  const to = entries.findIndex((entry) => entry.id === targetId);
  if (from < 0 || to < 0 || from === to) return entries;
  const next = [...entries];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

/** Строка, над которой находится центр перетаскиваемой записи. */
export function dropIndex(centerY: number, rowHeight: number, count: number) {
  return Math.min(Math.max(Math.floor(centerY / rowHeight), 0), count - 1);
}

/** Смещение строки в рядах, чтобы освободить место перетаскиваемой записи. */
export function rowShift(index: number, from: number, to: number) {
  if (from < to && index > from && index <= to) return -1;
  if (from > to && index >= to && index < from) return 1;
  return 0;
}

/** Разбирает сохранённый плейлист; повреждённые данные считаются пустым списком. */
export function parseEntries(raw: string | null): PlaylistEntry[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is PlaylistEntry =>
        typeof entry?.id === "string" && typeof entry?.addedAt === "number",
    );
  } catch {
    return [];
  }
}
