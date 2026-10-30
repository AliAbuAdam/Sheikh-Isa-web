// Считает волну для плеера лекций: node scripts/generate-peaks.mjs input.mp3 output.json
// Требует ffmpeg и ffprobe в PATH.
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage: node scripts/generate-peaks.mjs <input> <output.json>");
  process.exit(1);
}

const SAMPLE_RATE = 8000;
const MAX_BARS = 1500;

const duration = Number(
  execFileSync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=nw=1:nk=1",
    input,
  ]).toString(),
);

const pcm = execFileSync(
  "ffmpeg",
  ["-v", "error", "-i", input, "-ac", "1", "-ar", String(SAMPLE_RATE), "-f", "f32le", "-"],
  { maxBuffer: 1024 * 1024 * 1024 },
);
const samples = new Float32Array(pcm.buffer, pcm.byteOffset, Math.floor(pcm.length / 4));

const barSeconds = Math.max(1, duration / MAX_BARS);
const barSamples = Math.floor(barSeconds * SAMPLE_RATE);
const levels = [];
for (let start = 0; start < samples.length; start += barSamples) {
  const end = Math.min(start + barSamples, samples.length);
  let sum = 0;
  for (let i = start; i < end; i++) sum += samples[i] * samples[i];
  levels.push(Math.sqrt(sum / (end - start)));
}

const max = Math.max(...levels, 1e-6);
const peaks = levels.map((level) => Number(Math.sqrt(level / max).toFixed(3)));

writeFileSync(output, JSON.stringify({ duration: Number(duration.toFixed(2)), peaks }));
console.log(`${output}: ${peaks.length} bars, ${duration.toFixed(1)}s`);
