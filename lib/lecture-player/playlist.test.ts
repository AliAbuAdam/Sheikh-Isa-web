import assert from "node:assert/strict";
import { test } from "node:test";

import {
  PLAYLIST_TTL_DAYS,
  addEntry,
  dropIndex,
  moveEntry,
  parseEntries,
  pruneExpired,
  removeEntry,
  rowShift,
} from "./playlist.ts";

const DAY = 24 * 60 * 60 * 1000;

test("pruneExpired keeps entries younger than the storage period", () => {
  const now = 100 * DAY;
  const fresh = { id: "fresh", addedAt: now - (PLAYLIST_TTL_DAYS - 1) * DAY };
  const expired = { id: "old", addedAt: now - PLAYLIST_TTL_DAYS * DAY };
  assert.deepEqual(pruneExpired([fresh, expired], now), [fresh]);
});

test("pruneExpired honours a custom storage period", () => {
  const entry = { id: "a", addedAt: 0 };
  assert.deepEqual(pruneExpired([entry], 2 * DAY, 3), [entry]);
  assert.deepEqual(pruneExpired([entry], 3 * DAY, 3), []);
});

test("addEntry appends once and keeps the original date", () => {
  const added = addEntry([], "a", 1);
  assert.deepEqual(added, [{ id: "a", addedAt: 1 }]);
  assert.deepEqual(addEntry(added, "a", 2), added);
  assert.deepEqual(addEntry(added, "b", 2).map((entry) => entry.id), ["a", "b"]);
});

test("removeEntry removes only the requested record", () => {
  const entries = [
    { id: "a", addedAt: 1 },
    { id: "b", addedAt: 2 },
  ];
  assert.deepEqual(removeEntry(entries, "a"), [{ id: "b", addedAt: 2 }]);
});

test("moveEntry moves records in both directions", () => {
  const entries = ["a", "b", "c", "d"].map((id, i) => ({ id, addedAt: i }));
  const order = (list: typeof entries) => list.map((entry) => entry.id).join("");
  assert.equal(order(moveEntry(entries, "a", "c")), "bcad");
  assert.equal(order(moveEntry(entries, "d", "b")), "adbc");
  assert.equal(order(entries), "abcd");
});

test("moveEntry ignores unknown records and keeps dates", () => {
  const entries = [
    { id: "a", addedAt: 1 },
    { id: "b", addedAt: 2 },
  ];
  assert.equal(moveEntry(entries, "x", "a"), entries);
  assert.equal(moveEntry(entries, "a", "a"), entries);
  assert.deepEqual(moveEntry(entries, "a", "b")[1], { id: "a", addedAt: 1 });
});

test("dropIndex stays inside the list", () => {
  assert.equal(dropIndex(-20, 44, 5), 0);
  assert.equal(dropIndex(50, 44, 5), 1);
  assert.equal(dropIndex(1000, 44, 5), 4);
});

test("rowShift makes room for the dragged record", () => {
  assert.deepEqual([0, 1, 2, 3].map((i) => rowShift(i, 0, 2)), [0, -1, -1, 0]);
  assert.deepEqual([0, 1, 2, 3].map((i) => rowShift(i, 3, 1)), [0, 1, 1, 0]);
  assert.deepEqual([0, 1].map((i) => rowShift(i, 1, 1)), [0, 0]);
});

test("parseEntries survives damaged storage", () => {
  assert.deepEqual(parseEntries(null), []);
  assert.deepEqual(parseEntries("{broken"), []);
  assert.deepEqual(parseEntries('{"id":"a"}'), []);
  assert.deepEqual(parseEntries('[{"id":"a","addedAt":1},{"id":2},null]'), [
    { id: "a", addedAt: 1 },
  ]);
});
