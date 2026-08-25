import assert from "node:assert/strict";
import fs from "node:fs";

const scenario=fs.readFileSync(new URL("../docs/day7/DAY7_SCENARIO_DRAFT_V1.md",import.meta.url),"utf8");
const qa=fs.readFileSync(new URL("../docs/day7/DAY7_SCENARIO_QA_V1.md",import.meta.url),"utf8");

assert.equal((scenario.match(/^# SCENE \d{2}/gm)??[]).length,8);
assert.equal((scenario.match(/^## 선택 \d/gm)??[]).length,3);
for(const id of ["date_new_place","date_revisit_with_opt_out","date_alternate_choices","date7_lead_first_leg","date7_confirm_together","date7_follow_then_switch","date7_rest_and_shorten","date7_end_activity_keep_meal","date7_return_now_reschedule","date7_record_shared_photo","date7_record_two_sentences","date7_record_next_rule"])assert.match(scenario,new RegExp(`\\b${id}\\b`),id);
for(const contract of ["m30-day7-first-present-date","day7FirstPresentDatePending","day7RuntimeStage","day8IndependentErrandPending","day8-independent-errand","first_present_date_memory","shared_change_rule"])assert.match(scenario,new RegExp(contract),contract);
assert.match(scenario,/윤서진의 `seojinAffection`과 `seojinStatusInterest`는 변하지 않는다/);
const playable=scenario.slice(scenario.indexOf("# SCENE 01"));
assert.doesNotMatch(playable,/가짜 하은|진짜 하은의 증거|사고는 고의|트럭 충돌|D-29/);
assert.match(qa,/81개 조합/);
assert.match(qa,/SCENARIO QA PASS/);
console.log("✓ DAY 7 8 Scene·3전략·81경로·스포일러 차단 시나리오 QA PASS");
