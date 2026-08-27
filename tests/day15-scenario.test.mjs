import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DAY15_ACTIVITY_CHOICES, DAY15_CHANGE_CHOICES, DAY15_PRIVACY_CHOICES } from "../src/day15-campaign-runtime.mjs";

const scenario=readFileSync(new URL("../docs/day15/DAY15_SCENARIO_DRAFT_V1.md",import.meta.url),"utf8");
const contract=readFileSync(new URL("../docs/day15/DAY15_CHAPTER_CONTRACT_V1.md",import.meta.url),"utf8");
const qa=readFileSync(new URL("../docs/day15/DAY15_SCENARIO_QA_V1.md",import.meta.url),"utf8");

assert.ok(scenario.includes("NARRATIVE QA PASS · SCENARIO LOCK V1"));
assert.ok(contract.includes("CHAPTER CONTRACT LOCK V1"));
assert.equal((scenario.match(/^# SCENE \d{2}/gm)??[]).length,8);
assert.deepEqual([DAY15_ACTIVITY_CHOICES.length,DAY15_CHANGE_CHOICES.length,DAY15_PRIVACY_CHOICES.length],[3,3,3]);
for(const choice of [...DAY15_ACTIVITY_CHOICES,...DAY15_CHANGE_CHOICES,...DAY15_PRIVACY_CHOICES]){
  assert.ok(scenario.includes(choice.id),`시나리오 선택 누락: ${choice.id}`);
  assert.ok(scenario.includes(choice.label),`시나리오 선택 문구 누락: ${choice.id}`);
}
for(const callback of ["spend14_lane_personal","spend14_lane_shared","spend14_lane_gift","spend14_purchase_one_item","spend14_purchase_wait_compare","spend14_purchase_receipt_owner","spend14_consent_ask_first","spend14_consent_wishlist","spend14_consent_no_surprise"]) assert.ok(scenario.includes(callback),`DAY 14 콜백 누락: ${callback}`);
for(const marker of ["day15ActivityStrategy=leisure15_activity_","day15ChangeStrategy=leisure15_change_","day15PrivacyStrategy=leisure15_privacy_","day15LeisureReservationVisitLabel=unverified","leisure-reservation-label-mismatch","전화번호 기반 업체 기록","이전 계정 병합","day11ScheduleNoteMismatch=unverified","day14PastPreferenceRecommendation=unverified","day16-current-social-circle","auto-payment/high-value/investment 잠금 유지","`seojinAffection`/`seojinStatusInterest` 변화 0","내러티브 QA와 시나리오 잠금 판정은 완료했다"]) assert.ok(scenario.includes(marker),`불변·후속 계약 누락: ${marker}`);
for(const forbidden of ["가짜 하은","진짜 하은","사고는 고의였다","하은이 사고에 동승","아무것도 아니야","의미심장한 미소","얼어붙은 표정","공기가 달라졌다","과연 진실"]) assert.equal(scenario.includes(forbidden),false,`조기 공개·악역 코딩 금지: ${forbidden}`);
const haeun=(scenario.match(/\*\*하은\*\*/g)??[]).length;
const protagonist=(scenario.match(/\*\*주인공\*\*/g)??[]).length;
assert.ok(haeun>protagonist&&haeun/(haeun+protagonist)>=0.53,"하은의 생활 대화 주도성 필요");
assert.ok((scenario.match(/\[MICRO-PROGRESSION:/g)??[]).length>=3,"30~90초 미세 진행 표식 필요");
for(const marker of ["NARRATIVE QA PASS","SCENARIO LOCK V1","NEEDS FIX`: 0","QA에서 발견하고 수정한 결함","DAY 15 기존 에셋 감사"]) assert.ok(qa.includes(marker),`QA 판정 누락: ${marker}`);
console.log("✓ DAY 15 8 Scene·9선택·DAY 14 3×3 콜백·화자·밀도·정보 예산 QA PASS");
