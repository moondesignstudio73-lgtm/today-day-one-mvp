import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const sources = [
  "doctor-bedside-assessment-2d.png",
  "doctor-explain-open-hands-2d.png",
  "doctor-record-and-explain-2d.png",
  "nurse-vitals-check-2d.png",
  "nurse-safety-guidance-2d.png",
  "nurse-swallow-assessment-2d.png",
].map(name => `assets/npcs/day1/hq/${name}`);

for (const source of sources) {
  const url = new URL(`../${source}`, import.meta.url);
  assert.equal(existsSync(url), true, source);
  const file = readFileSync(url);
  assert.equal(file.subarray(1, 4).toString(), "PNG", source);
  assert.equal(file[25], 6, `${source}: expected RGBA PNG color type`);
  assert.equal(file.readUInt32BE(20), 1536, `${source}: expected 1536px height`);
  assert.ok(file.readUInt32BE(16) >= 430, `${source}: sprite is too narrow`);
}

for (const runtime of ["day1-campaign-runtime.mjs", "day2-campaign-runtime.mjs"]) {
  const source = readFileSync(new URL(`../src/${runtime}`, import.meta.url), "utf8");
  assert.match(source, /assets\/npcs\/day1\/hq\//, `${runtime}: HQ medical path missing`);
}

console.log("✓ DAY 1 의료진 6종 고해상도 RGBA 경로·크기 계약 PASS");
