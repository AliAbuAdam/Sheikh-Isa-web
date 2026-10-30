import assert from "node:assert/strict";
import { test } from "node:test";

import {
  decaySpeed,
  formatTime,
  glideTo,
  holdRate,
  releaseVelocity,
  rubberBand,
  visibleBars,
} from "./physics.ts";

test("releaseVelocity measures the last 100 ms of the gesture", () => {
  const samples = [
    { x: 0, t: 0 },
    { x: 500, t: 400 },
    { x: 550, t: 450 },
    { x: 600, t: 500 },
  ];
  assert.equal(releaseVelocity(samples, 510), 1000);
});

test("releaseVelocity is zero when the finger stopped before release", () => {
  const samples = [
    { x: 0, t: 0 },
    { x: 100, t: 50 },
  ];
  assert.equal(releaseVelocity(samples, 300), 0);
  assert.equal(releaseVelocity([], 0), 0);
});

test("decaySpeed slows down and is independent of frame rate", () => {
  const once = decaySpeed(1000, 0.032);
  const twice = decaySpeed(decaySpeed(1000, 0.016), 0.016);
  assert.ok(once < 1000);
  assert.ok(Math.abs(once - twice) < 1e-9);
});

test("glideTo approaches the target without overshooting", () => {
  const next = glideTo(0, 10, 0.016);
  assert.ok(next > 0 && next < 10);
  assert.ok(Math.abs(glideTo(0, 10, 10) - 10) < 1e-3);
});

test("rubberBand keeps in-range positions and resists past the edges", () => {
  assert.equal(rubberBand(50, 100, 0.1), 50);
  const pulled = rubberBand(-20, 100, 0.1);
  assert.ok(pulled < 0 && pulled > -20);
  const pulledFurther = rubberBand(-40, 100, 0.1);
  assert.ok(pulledFurther < pulled);
  assert.ok(rubberBand(1000, 100, 0.1) < 100 + 90 * 0.1);
  assert.ok(rubberBand(120, 100, 0.1) > 100);
});

test("holdRate accelerates up to a ceiling", () => {
  assert.equal(holdRate(0), 10);
  assert.ok(holdRate(1000) > holdRate(500));
  assert.equal(holdRate(60000), 120);
});

test("visibleBars stays within the recording", () => {
  assert.deepEqual(visibleBars(0, 90, 1, 100), { first: 0, last: 6 });
  assert.deepEqual(visibleBars(100, 90, 1, 100), { first: 94, last: 99 });
  const { first, last } = visibleBars(50, 90, 1, 100);
  assert.deepEqual([first, last], [44, 56]);
});

test("formatTime pads and adds hours only when needed", () => {
  assert.equal(formatTime(0), "0:00");
  assert.equal(formatTime(65.9), "1:05");
  assert.equal(formatTime(3725), "1:02:05");
  assert.equal(formatTime(-3), "0:00");
});
