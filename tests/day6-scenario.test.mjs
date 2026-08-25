import assert from "node:assert/strict";
import fs from "node:fs";

const scenario=fs.readFileSync(new URL("../docs/day6/DAY6_SCENARIO_DRAFT_V1.md",import.meta.url),"utf8");
const qa=fs.readFileSync(new URL("../docs/day6/DAY6_SCENARIO_QA_V1.md",import.meta.url),"utf8");

assert.equal((scenario.match(/^# SCENE \d{2}/gm)??[]).length,8,"DAY 6 must contain eight playable scenes");
assert.equal((scenario.match(/^## 선택 \d/gm)??[]).length,3,"DAY 6 must contain three strategic choice moments");

for(const id of [
  "route_essentials_first","route_shared_landmarks","route_solo_segment",
  "errand_fixed_budget","errand_compare_together","errand_split_roles",
  "date_new_place","date_revisit_with_opt_out","date_alternate_choices"
])assert.match(scenario,new RegExp(`\\b${id}\\b`),`missing choice ${id}`);

for(const callback of ["request-current-briefing","rebuild-social-context","set-return-boundary"])
  assert.match(scenario,new RegExp(callback),`missing DAY 5 callback ${callback}`);

for(const contract of [
  "m30-day6-life-radius","day6_life_restart_pending","day7-first-present-date",
  "day6_route_strategy","day6_errand_strategy","day6_date_plan",
  "current_life_radius","current_taste_note","first_present_date_plan"
])assert.match(scenario,new RegExp(contract),`missing contract ${contract}`);

assert.match(scenario,/원래 휴대폰은 병원 보관 중/);
assert.match(scenario,/임시 예비폰/);
assert.match(scenario,/서진의 두 관계 수치는 변하지 않는다/);
assert.doesNotMatch(scenario,/하은은 가짜|가짜 하은이라고|사고는 고의|진짜 하은의 증거/);
assert.match(qa,/SCENARIO QA PASS/);
assert.match(qa,/27개 조합/);

console.log("✓ DAY 6 8 Scene·3전략·DAY 5 콜백·스포일러 차단 시나리오 QA PASS");
