"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ChevronDown, ChevronUp, GripVertical, Plus, X } from "lucide-react";

import { SharpPause, SharpPlay } from "@/components/lecture-player/icons";
import { usePlayer } from "@/components/lecture-player/player-provider";
import { usePlaylist } from "@/components/lecture-player/use-playlist";
import { formatTime } from "@/lib/lecture-player/physics";
import {
  PLAYLIST_TTL_DAYS,
  dropIndex,
  rowShift,
} from "@/lib/lecture-player/playlist";

const COLLAPSED_ROWS = 5;

export function PlaylistPanel({ onClose }: { onClose: () => void }) {
  const { current, isPlaying, playLecture } = usePlayer();
  const { items, add, remove, move, clear } = usePlaylist();
  const [showAll, setShowAll] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const drag = useRef({ from: -1, to: -1, grabOffset: 0 });

  const currentIndex = items.findIndex((item) => item.id === current?.id);
  const visible = showAll ? items : items.slice(0, COLLAPSED_ROWS);

  const rows = () =>
    Array.from(listRef.current?.children ?? []) as HTMLElement[];

  // Строки сдвигаются только визуально, порядок меняется при отпускании:
  // перестановка в DOM сбросила бы захват указателя.
  const endDrag = (commit: boolean) => {
    const { from, to } = drag.current;
    if (from < 0) return;
    drag.current.from = -1;
    listRef.current?.removeAttribute("data-dragging");
    rows().forEach((row) => {
      row.style.transform = "";
      row.removeAttribute("data-dragged");
    });
    if (commit && from !== to) move(visible[from].id, visible[to].id);
  };

  const onHandleDown = (
    event: PointerEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const row = rows()[index];
    if (!row) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      from: index,
      to: index,
      grabOffset: event.clientY - row.getBoundingClientRect().top,
    };
    listRef.current?.setAttribute("data-dragging", "");
    row.setAttribute("data-dragged", "");
  };

  const onHandleMove = (event: PointerEvent<HTMLButtonElement>) => {
    const { from, grabOffset } = drag.current;
    const list = listRef.current;
    if (from < 0 || !list) return;
    const all = rows();
    const rowHeight = all[from].offsetHeight;
    const box = list.getBoundingClientRect();
    if (event.clientY < box.top + rowHeight / 2) list.scrollTop -= 8;
    if (event.clientY > box.bottom - rowHeight / 2) list.scrollTop += 8;
    const top = event.clientY - box.top + list.scrollTop - grabOffset;
    const to = dropIndex(top + rowHeight / 2, rowHeight, all.length);
    drag.current.to = to;
    all.forEach((row, index) => {
      row.style.transform =
        index === from
          ? `translateY(${top - rowHeight * from}px)`
          : `translateY(${rowShift(index, from, to) * rowHeight}px)`;
    });
  };

  const onHandleKey = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const step = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
    const target = visible[index + step];
    if (!step || !target) return;
    event.preventDefault();
    move(visible[index].id, target.id);
  };

  return (
    <div className="playlist-panel" role="region" aria-label="Плейлист">
      <header className="playlist-panel__header">
        <h2 className="playlist-panel__title">Плейлист</h2>
        <span className="playlist-panel__count">
          {currentIndex >= 0
            ? `${currentIndex + 1} из ${items.length}`
            : items.length}
        </span>
        {items.length > 0 ? (
          <button
            type="button"
            className="playlist-panel__clear"
            onClick={clear}
          >
            Очистить
          </button>
        ) : null}
        <button
          type="button"
          className="playlist-panel__icon"
          aria-label="Закрыть плейлист"
          onClick={onClose}
        >
          <ChevronDown aria-hidden="true" />
        </button>
      </header>

      {current && currentIndex < 0 ? (
        <button
          type="button"
          className="playlist-panel__add"
          onClick={() => add(current.id)}
        >
          <Plus aria-hidden="true" />
          <span className="truncate">Добавить: {current.title}</span>
        </button>
      ) : null}

      {items.length === 0 ? (
        <p className="playlist-panel__empty">
          Плейлист пуст. Добавляйте записи кнопкой «+» в списке лекций.
        </p>
      ) : (
        <ul ref={listRef} className="playlist-panel__list">
          {visible.map((item, index) => {
            const isCurrent = item.id === current?.id;
            const isThisPlaying = isCurrent && isPlaying;
            return (
              <li
                key={item.id}
                className="playlist-panel__row"
                data-current={isCurrent ? "" : undefined}
              >
                {items.length > 1 ? (
                  <button
                    type="button"
                    className="playlist-panel__handle"
                    aria-label={`Изменить порядок: ${item.title}. Перетащите или нажимайте стрелки вверх и вниз`}
                    title="Перетащите, чтобы изменить порядок"
                    onPointerDown={(event) => onHandleDown(event, index)}
                    onPointerMove={onHandleMove}
                    onPointerUp={() => endDrag(true)}
                    onPointerCancel={() => endDrag(false)}
                    onKeyDown={(event) => onHandleKey(event, index)}
                  >
                    <GripVertical aria-hidden="true" />
                  </button>
                ) : null}
                <button
                  type="button"
                  className="playlist-panel__play"
                  aria-label={`${isThisPlaying ? "Пауза" : "Воспроизвести"}: ${item.title}`}
                  onClick={() => playLecture(item, "playlist")}
                >
                  <span className="playlist-panel__play-icon">
                    {isThisPlaying ? <SharpPause /> : <SharpPlay />}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {index + 1}. {item.title}
                  </span>
                  <span className="playlist-panel__duration">
                    {formatTime(item.duration)}
                  </span>
                </button>
                <button
                  type="button"
                  className="playlist-panel__icon"
                  aria-label={`Убрать из плейлиста: ${item.title}`}
                  onClick={() => remove(item.id)}
                >
                  <X aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {items.length > COLLAPSED_ROWS ? (
        <button
          type="button"
          className="playlist-panel__more"
          onClick={() => setShowAll((value) => !value)}
        >
          {showAll ? (
            <ChevronUp aria-hidden="true" />
          ) : (
            <ChevronDown aria-hidden="true" />
          )}
          {showAll ? "Свернуть" : "Показать весь плейлист"}
        </button>
      ) : null}

      <p className="playlist-panel__note">
        Записи хранятся {PLAYLIST_TTL_DAYS} дней на этом устройстве
      </p>
    </div>
  );
}
