import assert from "node:assert/strict";
import fs from "node:fs";

const scenario=fs.readFileSync(new URL("../docs/day8/DAY8_SCENARIO_DRAFT_V1.md",import.meta.url),"utf8");
const qa=fs.readFileSync(new URL("../docs/day8/DAY8_SCENARIO_QA_V1.md",import.meta.url),"utf8");

assert.equal((scenario.match(/^# SCENE \d{2}/gm)??[]).length,8);
assert.equal((scenario.match(/^## 선택 \d/gm)??[]).length,3);

for(const id of [
  "errand8_change_only_checkin","errand8_timed_checkin","errand8_return_only_report",
  "errand8_compare_labels","errand8_ask_current_need","errand8_buy_small_test",
  "errand8_sort_receipt_together","errand8_explain_decision_log","errand8_set_next_solo_boundary"
])assert.match(scenario,new RegExp(`\\b${id}\\b`),id);

for(const callback of [
  "date7_record_shared_photo","date7_record_two_sentences","date7_record_next_rule",
  "date7_lead_first_leg","date7_confirm_together","date7_follow_then_switch",
  "date7_rest_and_shorten","date7_end_activity_keep_meal","date7_return_now_reschedule",
  "day7OpeningStrategy","day7RecoveryStrategy","day7MemoryStrategy"
])assert.match(scenario,new RegExp(callback),callback);

for(const contract of [
  "m30-day8-independent-errand","day8IndependentErrandPending","day8RuntimeStage",
  "day8IndependentErrandCompleted","day9SecondOfficeAdaptationPending",
  "day9-second-office-adaptation","independent_errand_contract",
  "current_household_choice","return_debrief_rule"
])assert.match(scenario,new RegExp(contract),contract);

assert.match(scenario,/임시 예비폰/);
assert.match(scenario,/원래 휴대폰은 병원 보관 중/);
assert.match(scenario,/윤서진의 \`seojinAffection\`과 \`seojinStatusInterest\`는 변하지 않는다/);
assert.match(scenario,/haeunTrust >= 35/);
assert.match(scenario,/haeunTrust < 35/);

const playable=scenario.slice(scenario.indexOf("# SCENE 01"),scenario.indexOf("## 저장 복원 계약"));
assert.doesNotMatch(playable,/가짜 하은|진짜 하은의 증거|사고는 고의|트럭 충돌|D-23|D-22/);
assert.doesNotMatch(playable,/의미심장한 미소|묘한 표정|알 수 없는 감정|공기가 달라졌다|왠지 모를 불안/);

assert.match(qa,/27개 선택 조합/);
assert.match(qa,/729개 연속 상태/);
assert.match(qa,/의료 안전/);
assert.match(qa,/관계별 말투/);
assert.match(qa,/SCENARIO QA PASS/);

console.log("✓ DAY 8 8 Scene·3전략·27경로·DAY 7 콜백·스포일러 차단 시나리오 QA PASS");
