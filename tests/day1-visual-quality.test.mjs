import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const sources = [
  "doctor-bedside-assessment-2d-v2.png",
  "doctor-explain-open-hands-2d-v2.png",
  "doctor-record-and-explain-2d-v2.png",
  "nurse-vitals-check-2d-v2.png",
  "nurse-safety-guidance-2d-v2.png",
  "nurse-swallow-assessment-2d-v2.png",
].map(name => `assets/npcs/day1/hq/${name}`);

for (const source of sources) {
  const url = new URL(`../${source}`, import.meta.url);
  assert.equal(existsSync(url), true, source);
  const file = readFileSync(url);
  assert.equal(file.subarray(1, 4).toString(), "PNG", source);
  assert.equal(file[25], 6, `${source}: expected RGBA PNG color type`);
  assert.ok(file.readUInt32BE(20) >= 1700, `${source}: expected regenerated source height`);
  assert.ok(file.readUInt32BE(16) >= 850, `${source}: sprite is too narrow`);
}

for (const runtime of ["day1-campaign-runtime.mjs", "day2-campaign-runtime.mjs"]) {
  const source = readFileSync(new URL(`../src/${runtime}`, import.meta.url), "utf8");
  assert.match(source, /assets\/npcs\/day1\/hq\//, `${runtime}: HQ medical path missing`);
  assert.match(source, /doctor-[a-z-]+-2d-v2\.png/, `${runtime}: regenerated doctor path missing`);
}

console.log("✓ DAY 1 의료진 6종 전면 재생성 RGBA 경로·크기 계약 PASS");
