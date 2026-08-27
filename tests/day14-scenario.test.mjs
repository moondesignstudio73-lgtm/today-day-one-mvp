import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DAY14_LANE_CHOICES, DAY14_PURCHASE_CHOICES, DAY14_CONSENT_CHOICES } from "../src/day14-campaign-runtime.mjs";

const scenario=readFileSync(new URL("../docs/day14/DAY14_SCENARIO_DRAFT_V1.md",import.meta.url),"utf8");
const contract=readFileSync(new URL("../docs/day14/DAY14_CHAPTER_CONTRACT_V1.md",import.meta.url),"utf8");
const qa=readFileSync(new URL("../docs/day14/DAY14_SCENARIO_QA_V1.md",import.meta.url),"utf8");

assert.ok(scenario.includes("SCENARIO LOCK V1"));
assert.ok(contract.includes("CHAPTER CONTRACT LOCK V1"));
assert.equal((scenario.match(/^# SCENE \d{2}/gm)??[]).length,8);
assert.deepEqual([DAY14_LANE_CHOICES.length,DAY14_PURCHASE_CHOICES.length,DAY14_CONSENT_CHOICES.length],[3,3,3]);
for(const choice of [...DAY14_LANE_CHOICES,...DAY14_PURCHASE_CHOICES,...DAY14_CONSENT_CHOICES]){
  assert.ok(scenario.includes(choice.id),`시나리오 선택 누락: ${choice.id}`);
  assert.ok(scenario.includes(choice.label),`시나리오 선택 문구 누락: ${choice.id}`);
}
for(const callback of ["budget13_base_verified_personal","budget13_base_shared_essentials","budget13_base_protected_buffer","budget13_contribution_item_owner","budget13_contribution_equal_confirmed","budget13_contribution_capacity_review","budget13_review_totals_only","budget13_review_receipt_consent","budget13_review_weekly_changes"]) assert.ok(scenario.includes(callback),`DAY 13 콜백 누락: ${callback}`);
for(const marker of ["day14LaneStrategy=spend14_lane_","day14PurchaseStrategy=spend14_purchase_","day14ConsentStrategy=spend14_consent_","day14PastPreferenceRecommendation=unverified","개봉 전 반품 기한","10분 기다린 뒤 공식 가격","오늘은 선물을 사지 않고 필요한 것만 기록한다","day11ScheduleNoteMismatch=unverified","day15-current-leisure-date","윤서진 `AFFECTION`/`STATUS_INTEREST`","내러티브 QA와 시나리오 잠금 판정은 완료했다"]) assert.ok(scenario.includes(marker),`불변·후속 계약 누락: ${marker}`);
for(const stale of ["day14SpendingLane=","day14GiftConsent=","day14PurchaseStrategy=one-item","day14PurchaseStrategy=wait-compare","day14PurchaseStrategy=receipt-owner"]) assert.equal(scenario.includes(stale),false,`레거시/불일치 상태명 금지: ${stale}`);
for(const forbidden of ["가짜 하은","진짜 하은","사고는 고의","하은의 거짓말","아무것도 아니야","의미심장한 미소","얼어붙은 표정","과연 진실"]) assert.equal(scenario.includes(forbidden),false,`조기 공개·악역 코딩 금지: ${forbidden}`);
const haeun=(scenario.match(/\*\*하은\*\*/g)??[]).length;
const protagonist=(scenario.match(/\*\*주인공\*\*/g)??[]).length;
assert.ok(haeun>protagonist&&haeun/(haeun+protagonist)>=0.5,"하은의 생활 대화 주도성 필요");
for(const marker of ["NARRATIVE QA PASS","SCENARIO LOCK V1","NEEDS FIX`: 0","QA에서 발견하고 수정한 결함","DAY 14 기존 에셋 감사"]) assert.ok(qa.includes(marker),`QA 판정 누락: ${marker}`);
console.log("✓ DAY 14 8 Scene·9선택·DAY 13 3×3 콜백·화자·밀도·정보 예산 QA PASS");
