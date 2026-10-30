import assert from "node:assert/strict";
import { test } from "node:test";

import { PLAYBACK_SPEEDS, formatSpeed, nextSpeed } from "./playback-speed.ts";

test("nextSpeed walks through every speed and wraps around", () => {
  let speed = 1;
  const seen = [];
  for (let i = 0; i < PLAYBACK_SPEEDS.length; i++) {
    seen.push(speed);
    speed = nextSpeed(speed);
  }
  assert.deepEqual(seen, PLAYBACK_SPEEDS);
  assert.equal(speed, 1);
});

test("nextSpeed falls back to the first speed for an unknown value", () => {
  assert.equal(nextSpeed(3), 1);
});

test("formatSpeed adds the multiplication sign", () => {
  assert.equal(formatSpeed(1), "1×");
  assert.equal(formatSpeed(1.25), "1.25×");
});
