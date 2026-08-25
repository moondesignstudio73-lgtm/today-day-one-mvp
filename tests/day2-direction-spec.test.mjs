import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const spec = readFileSync(new URL("../docs/day2/DAY2_DIRECTION_SPEC.md", import.meta.url), "utf8");

assert.match(spec, /PHASE 18 COMPLETE/);
assert.match(spec, /NEEDS FIX 0/);

for (let scene = 1; scene <= 12; scene += 1) {
  assert.match(spec, new RegExp(`S${String(scene).padStart(2, "0")}\\b`), `missing Scene ${scene}`);
}

for (const asset of [
  "cg-day2-home-threshold-v2.png",
  "cg-day2-family-photo-v1.png",
  "cg-day2-couple-photo-v1.png",
  "cg-day2-three-column-resolve-v2.png",
]) {
  assert.ok(spec.includes(asset), `missing approved CG: ${asset}`);
}

for (const contract of [
  "prefers-reduced-motion",
  "저장 복원",
  "자동 진행",
  "키보드",
  "터치",
  "contact_boundary",
  "contact_acceptance",
  "identity_first",
  "family_question_first",
  "accident_interest",
  "recovery_focus",
  "key_log_only",
  "key_test_visible_only",
]) {
  assert.ok(spec.includes(contract), `missing direction contract: ${contract}`);
}

assert.match(spec, /`D-29`[^\n]*(표시하지 않는다|금지)/);
assert.match(spec, /원래 휴대폰은 병원 보관 중/);
assert.match(spec, /작은 열쇠[^\n]*미분류 물건/);

console.log("DAY 2 direction specification checks passed.");
