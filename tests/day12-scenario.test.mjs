import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DAY12_ACCESS_CHOICES, DAY12_EXPENSE_CHOICES, DAY12_VERIFY_CHOICES } from "../src/day12-campaign-runtime.mjs";

const scenario=readFileSync(new URL("../docs/day12/DAY12_SCENARIO_DRAFT_V1.md",import.meta.url),"utf8");
const qa=readFileSync(new URL("../docs/day12/DAY12_SCENARIO_QA_V1.md",import.meta.url),"utf8");

assert.equal((scenario.match(/^# SCENE \d+/gm)??[]).length,8);
assert.equal(DAY12_VERIFY_CHOICES.length,3);
assert.equal(DAY12_EXPENSE_CHOICES.length,3);
assert.equal(DAY12_ACCESS_CHOICES.length,3);
for(const choice of [...DAY12_VERIFY_CHOICES,...DAY12_EXPENSE_CHOICES,...DAY12_ACCESS_CHOICES]){
  assert.ok(scenario.includes(choice.id),`시나리오 선택 누락: ${choice.id}`);
  assert.ok(scenario.includes(choice.label),`시나리오 선택 문구 누락: ${choice.id}`);
}
for(const section of ["## 챕터 계약","## Voice Profile","## 지식 장부","## 정보 공개 예산","## DAY 11 콜백 계약","## 선택 결과·상태 계약","## 저장 복원 계약"])assert.ok(scenario.includes(section),`필수 계약 누락: ${section}`);
for(const callback of ["life11_anchor_recovery","life11_anchor_work","life11_anchor_shared","life11_conflict_health_first","life11_conflict_owner_decides","life11_conflict_buffer","life11_share_changes_only","life11_share_weekly_review","life11_share_separate_ownership"])assert.ok(scenario.includes(callback),`DAY 11 콜백 누락: ${callback}`);
for(const marker of ["verified-current-account-record","day13-current-household-budget","소유권 미확인","DOES_NOT_KNOW","LIES_ABOUT","MUST NOT REVEAL"])assert.ok(scenario.includes(marker),`지식·권한 계약 누락: ${marker}`);
for(const forbidden of ["사고는 고의","트럭 충돌","의미심장한 미소","묘한 표정","하은의 거짓말이었다"])assert.ok(!scenario.includes(forbidden),`DAY 12 조기 공개·악역 코딩 금지: ${forbidden}`);
assert.ok(qa.includes("NEEDS FIX: 0"));
console.log("✓ DAY 12 8 Scene·3전략·DAY 11 9콜백·현재 금융 경계·지식/스포일러 계약 PASS");
