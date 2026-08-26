import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DAY13_BASE_CHOICES, DAY13_CONTRIBUTION_CHOICES, DAY13_REVIEW_CHOICES } from "../src/day13-campaign-runtime.mjs";

const scenario=readFileSync(new URL("../docs/day13/DAY13_SCENARIO_DRAFT_V1.md",import.meta.url),"utf8");
const contract=readFileSync(new URL("../docs/day13/DAY13_CHAPTER_CONTRACT_V1.md",import.meta.url),"utf8");
const qa=readFileSync(new URL("../docs/day13/DAY13_SCENARIO_QA_V1.md",import.meta.url),"utf8");

assert.ok(scenario.includes("SCENARIO LOCK V1"));
assert.ok(contract.includes("CHAPTER CONTRACT LOCK V1"));
assert.equal((scenario.match(/^# SCENE \d{2}/gm)??[]).length,8);
assert.deepEqual([DAY13_BASE_CHOICES.length,DAY13_CONTRIBUTION_CHOICES.length,DAY13_REVIEW_CHOICES.length],[3,3,3]);
for(const choice of [...DAY13_BASE_CHOICES,...DAY13_CONTRIBUTION_CHOICES,...DAY13_REVIEW_CHOICES]){
  assert.ok(scenario.includes(choice.id),`시나리오 선택 누락: ${choice.id}`);
  assert.ok(scenario.includes(choice.label),`시나리오 선택 문구 누락: ${choice.id}`);
}
for(const callback of ["account12_verify_owner_statement","account12_verify_support_call","account12_verify_living_entries","account12_expense_personal_only","account12_expense_shared_unconfirmed","account12_expense_source_labels","account12_access_read_only","account12_access_monthly_review","account12_access_separate_investment"]) assert.ok(scenario.includes(callback),`DAY 12 콜백 누락: ${callback}`);
for(const marker of ["day11ScheduleNoteMismatch=unverified","current-household-budget-record","day14-current-choice-spending","투자 잠금","윤서진 `AFFECTION`/`STATUS_INTEREST`","내러티브 QA와 시나리오 잠금 판정은 완료"]) assert.ok(scenario.includes(marker),`불변·후속 계약 누락: ${marker}`);
for(const forbidden of ["가짜 하은","진짜 하은","사고는 고의","하은의 거짓말","아무것도 아니야","의미심장한 미소","얼어붙은 표정"]) assert.equal(scenario.includes(forbidden),false,`조기 공개·악역 코딩 금지: ${forbidden}`);
const haeun=(scenario.match(/\*\*하은\*\*/g)??[]).length;
const protagonist=(scenario.match(/\*\*주인공\*\*/g)??[]).length;
assert.ok(haeun>protagonist&&haeun/(haeun+protagonist)>=0.5,"하은의 생활 대화 주도성 필요");
for(const marker of ["NARRATIVE QA PASS","SCENARIO LOCK V1","NEEDS FIX`: 0","DAY 13 기존 에셋 감사"]) assert.ok(qa.includes(marker),`QA 판정 누락: ${marker}`);
console.log("✓ DAY 13 8 Scene·9선택·DAY 12 3×3 콜백·화자·밀도·정보 예산 QA PASS");
