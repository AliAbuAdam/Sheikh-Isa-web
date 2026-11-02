import assert from "node:assert/strict";
import { test } from "node:test";

import { coverFor, toPositionState } from "./media-session.ts";

test("coverFor prefers the recording's own cover", () => {
  assert.equal(coverFor("/books/fiqh.png", "dark"), "/books/fiqh.png");
});

test("coverFor falls back to the logo in the site theme", () => {
  assert.equal(coverFor(undefined, "dark"), "/player-cover-dark.png");
  assert.equal(coverFor(undefined, "light"), "/player-cover-light.png");
  assert.equal(coverFor(undefined, undefined), "/player-cover-light.png");
});

test("toPositionState passes valid values through", () => {
  assert.deepEqual(toPositionState(100, 30, 1.5), {
    duration: 100,
    position: 30,
    playbackRate: 1.5,
  });
});

test("toPositionState keeps the position inside the recording", () => {
  assert.equal(toPositionState(100, 150, 1)?.position, 100);
  assert.equal(toPositionState(100, -5, 1)?.position, 0);
});

test("toPositionState rejects an unknown duration", () => {
  assert.equal(toPositionState(NaN, 0, 1), null);
  assert.equal(toPositionState(Infinity, 0, 1), null);
  assert.equal(toPositionState(0, 0, 1), null);
});

test("toPositionState replaces an invalid playback rate", () => {
  assert.equal(toPositionState(100, 0, 0)?.playbackRate, 1);
});
