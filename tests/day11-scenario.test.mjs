import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DAY11_ANCHOR_CHOICES, DAY11_CONFLICT_CHOICES, DAY11_SHARE_CHOICES } from "../src/day11-campaign-runtime.mjs";

const scenario=readFileSync(new URL("../docs/day11/DAY11_SCENARIO_DRAFT_V1.md",import.meta.url),"utf8");
const qa=readFileSync(new URL("../docs/day11/DAY11_SCENARIO_QA_V1.md",import.meta.url),"utf8");

assert.equal((scenario.match(/^# SCENE \d+/gm)??[]).length,8);
assert.equal(DAY11_ANCHOR_CHOICES.length,3);
assert.equal(DAY11_CONFLICT_CHOICES.length,3);
assert.equal(DAY11_SHARE_CHOICES.length,3);
for(const choice of [...DAY11_ANCHOR_CHOICES,...DAY11_CONFLICT_CHOICES,...DAY11_SHARE_CHOICES]){
  assert.ok(scenario.includes(choice.id),`시나리오 선택 누락: ${choice.id}`);
  assert.ok(scenario.includes(choice.label),`시나리오 선택 문구 누락: ${choice.id}`);
}
for(const section of ["## 챕터 계약","## Voice Profile","## 지식 장부","## 정보 공개 예산","## DAY 10 콜백 계약","## 선택 결과·상태 계약","## 저장 복원 계약"])assert.ok(scenario.includes(section),`필수 계약 누락: ${section}`);
for(const callback of ["work10_rhythm_fixed_blocks","work10_rhythm_symptom_check","work10_rhythm_task_milestones","work10_lunch_current_roles","work10_lunch_one_question_each","work10_lunch_quiet_recovery","work10_debrief_keep_rhythm","work10_debrief_adjust_one_block","work10_debrief_separate_scores"])assert.ok(scenario.includes(callback),`DAY 10 콜백 누락: ${callback}`);
for(const marker of ["day11-schedule-note-mismatch","과거 메모 · 미확인","일정 변경","작성 오류","DOES_NOT_KNOW","LIES_ABOUT","MUST NOT REVEAL"])assert.ok(scenario.includes(marker),`지식·불일치 계약 누락: ${marker}`);
for(const forbidden of ["가짜 하은","사고는 고의","트럭 충돌","의미심장한 미소","묘한 표정","하은의 거짓말이었다"])assert.ok(!scenario.includes(forbidden),`DAY 11 조기 공개·악역 코딩 금지: ${forbidden}`);
assert.ok(qa.includes("NEEDS FIX: 0"));
console.log("✓ DAY 11 8 Scene·3전략·DAY 10 9콜백·작은 불일치·지식/스포일러 계약 PASS");

