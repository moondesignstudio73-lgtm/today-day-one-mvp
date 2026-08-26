import assert from "node:assert/strict";
import fs from "node:fs";

const scenario=fs.readFileSync(new URL("../docs/day10/DAY10_SCENARIO_DRAFT_V1.md",import.meta.url),"utf8");
const qa=fs.readFileSync(new URL("../docs/day10/DAY10_SCENARIO_QA_V1.md",import.meta.url),"utf8");
const runtime=fs.readFileSync(new URL("../src/day10-campaign-runtime.mjs",import.meta.url),"utf8");

assert.equal((scenario.match(/^# SCENE \d{2}/gm)??[]).length,8);
assert.equal((scenario.match(/^## 선택 \d/gm)??[]).length,3);

for(const id of [
  "work10_rhythm_fixed_blocks","work10_rhythm_symptom_check","work10_rhythm_task_milestones",
  "work10_lunch_current_roles","work10_lunch_one_question_each","work10_lunch_quiet_recovery",
  "work10_debrief_keep_rhythm","work10_debrief_adjust_one_block","work10_debrief_separate_scores"
])assert.match(scenario,new RegExp(`\\b${id}\\b`),id);

for(const callback of [
  "office9_scope_current_queue","office9_scope_shadow_handoff","office9_scope_compare_decisions",
  "office9_pressure_route_questions","office9_pressure_observe_annotate","office9_pressure_reversible_task",
  "office9_debrief_name_limits","office9_debrief_write_protocol","office9_debrief_targeted_feedback",
  "day9ScopeStrategy","day9PressureStrategy","day9DebriefStrategy"
]){
  assert.match(scenario,new RegExp(callback),`scenario ${callback}`);
  assert.match(runtime,new RegExp(callback),`runtime ${callback}`);
}

for(const contract of [
  "m30-day10-three-hour-work-rhythm","day10RuntimeStage","day10ThreeHourWorkRhythmCompleted",
  "day11CurrentLifePlanPending","three-hour-work-rhythm-record","day11-current-life-plan"
])assert.match(scenario,new RegExp(contract),contract);

assert.match(scenario,/AFFECTION.*STATUS_INTEREST|STATUS_INTEREST.*AFFECTION/s);
assert.match(scenario,/23세/);
assert.match(scenario,/관찰 → 가능성 → 확인 → 판단 → 행동/);
assert.match(runtime,/neighborhood-cafe-day/);
assert.doesNotMatch(runtime,/cafe-rain-evening/);

const playable=scenario.slice(scenario.indexOf("# SCENE 01"),scenario.indexOf("## 선택 결과·상태 계약"));
assert.doesNotMatch(playable,/가짜 하은|진짜 하은|사고는 고의|가해자|동승자|트럭 충돌|D-20|D-21/);
assert.doesNotMatch(playable,/의미심장한 미소|묘한 표정|알 수 없는 감정|공기가 달라졌다|왠지 모를 불안/);

assert.match(qa,/27개 경로/);
assert.match(qa,/DAY 6~10 생활 확장/);
assert.match(qa,/SCENARIO QA PASS/);
assert.match(qa,/NEEDS FIX 0/);

console.log("✓ DAY 10 8 Scene·3전략·27경로·DAY 9 전체 콜백·낮 배경·스포일러 차단 시나리오 QA PASS");
