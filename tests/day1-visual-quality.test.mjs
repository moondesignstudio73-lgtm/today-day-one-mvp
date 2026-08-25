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

const day1Runtime = readFileSync(new URL("../src/day1-campaign-runtime.mjs", import.meta.url), "utf8");
const day1Styles = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
assert.match(day1Runtime, /보라색 머리의 여자가 앉아 있었다[^\n]+backgroundId:BG_BEDSIDE/, "turning toward Haeun must switch away from the ceiling POV");
assert.match(day1Runtime, /haeun-pose-seated-dozing-2d\.png[^\n]+positionPreset:"left"/, "dozing Haeun must align with the bedside chair");
assert.match(day1Runtime, /haeun-pose-seated-no-contact-2d\.png[^\n]+positionPreset:"left"/, "seated Haeun must align with the bedside chair");
assert.match(day1Runtime, /SCENE 03 · 1년[^\n]+haeun-pose-standing-bedside-restraint-2d\.png[^\n]+depth:"background"/, "medical scene must restage Haeun behind the clinicians");
assert.match(day1Styles, /aspect-ratio:16\/9/, "desktop story stage must preserve the authored 16:9 composition");
assert.match(day1Styles, /\.vn-day1-event-cg\{object-fit:contain/, "DAY 1 CGs must not be cropped");

console.log("✓ DAY 1 의료진·병실 구도·16:9 CG 프레이밍 계약 PASS");
