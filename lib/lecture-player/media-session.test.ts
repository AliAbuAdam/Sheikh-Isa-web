import assert from "node:assert/strict";
import { test } from "node:test";

import { toPositionState } from "./media-session.ts";

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
