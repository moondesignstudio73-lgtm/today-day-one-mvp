import assert from "node:assert/strict";
import fs from "node:fs";

const scenario=fs.readFileSync(new URL("../docs/day9/DAY9_SCENARIO_DRAFT_V1.md",import.meta.url),"utf8");
const qa=fs.readFileSync(new URL("../docs/day9/DAY9_SCENARIO_QA_V1.md",import.meta.url),"utf8");

assert.equal((scenario.match(/^# SCENE \d{2}/gm)??[]).length,8);
assert.equal((scenario.match(/^## 선택 \d/gm)??[]).length,3);

for(const id of [
  "office9_scope_current_queue","office9_scope_shadow_handoff","office9_scope_compare_decisions",
  "office9_pressure_route_questions","office9_pressure_observe_annotate","office9_pressure_reversible_task",
  "office9_debrief_name_limits","office9_debrief_write_protocol","office9_debrief_targeted_feedback"
])assert.match(scenario,new RegExp(`\\b${id}\\b`),id);

for(const callback of [
  "request-current-briefing","rebuild-social-context","set-return-boundary","day5ReturnStrategy","day5SeojinStrategy",
  "errand8_change_only_checkin","errand8_timed_checkin","errand8_return_only_report",
  "errand8_compare_labels","errand8_ask_current_need","errand8_buy_small_test",
  "errand8_sort_receipt_together","errand8_explain_decision_log","errand8_set_next_solo_boundary",
  "day8CheckInStrategy","day8PurchaseStrategy","day8ShareStrategy"
])assert.match(scenario,new RegExp(callback),callback);

for(const contract of [
  "m30-day9-second-office-adaptation","day9SecondOfficeAdaptationPending","day9RuntimeStage",
  "day9SecondOfficeAdaptationCompleted","day10ThreeHourWorkRhythmPending","day10-three-hour-work-rhythm",
  "current_scope_map","bounded_decision_protocol","office_return_debrief"
])assert.match(scenario,new RegExp(contract),contract);

assert.match(scenario,/AFFECTION.*STATUS_INTEREST|STATUS_INTEREST.*AFFECTION/s);
assert.match(scenario,/office9_debrief_name_limits[\s\S]*AFFECTION[\s\S]*STATUS_INTEREST.*불변/);
assert.match(scenario,/office9_debrief_write_protocol[\s\S]*STATUS_INTEREST[\s\S]*AFFECTION.*불변/);
assert.match(scenario,/둘 다 높음/);
assert.match(scenario,/둘 다 낮음/);

const playable=scenario.slice(scenario.indexOf("# SCENE 01"),scenario.indexOf("## 저장 복원 계약"));
assert.doesNotMatch(playable,/가짜 하은|진짜 하은|사고는 고의|가해자|동승자|D-21|D-22/);
assert.doesNotMatch(playable,/의미심장한 미소|묘한 표정|알 수 없는 감정|공기가 달라졌다|왠지 모를 불안/);

assert.match(qa,/27개 DAY 9 경로/);
assert.match(qa,/관계별 말투/);
assert.match(qa,/DAY 6~10 생활 확장/);
assert.match(qa,/SCENARIO QA PASS/);

console.log("✓ DAY 9 8 Scene·3전략·27경로·DAY 5·8 콜백·서진 양축 분리·스포일러 차단 시나리오 QA PASS");

