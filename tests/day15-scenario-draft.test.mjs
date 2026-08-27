import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const draft=readFileSync(new URL("../docs/day15/DAY15_SCENARIO_DRAFT_V1.md",import.meta.url),"utf8");

for(const scene of ["SCENE 01","SCENE 02","SCENE 03","SCENE 04","SCENE 05","SCENE 06","SCENE 07","SCENE 08"])assert.ok(draft.includes(scene),`Scene 누락: ${scene}`);
for(const id of ["spend14_lane_personal","spend14_lane_shared","spend14_lane_gift","spend14_purchase_one_item","spend14_purchase_wait_compare","spend14_purchase_receipt_owner","spend14_consent_ask_first","spend14_consent_wishlist","spend14_consent_no_surprise"])assert.ok(draft.includes(id),`DAY 14 콜백 누락: ${id}`);
for(const id of ["leisure15_activity_each_pick","leisure15_activity_two_options","leisure15_activity_low_sensory","leisure15_change_shorten","leisure15_change_switch","leisure15_change_end","leisure15_privacy_private_note","leisure15_privacy_ask_each_photo","leisure15_privacy_no_location"])assert.ok(draft.includes(id),`DAY 15 전략 누락: ${id}`);
for(const marker of ["day15LeisureReservationVisitLabel=unverified","leisure-reservation-label-mismatch","전화번호 기반 업체 기록","이전 계정 병합","관찰 → 가능한 설명 → 범위 제한 확인 → 공동 평가 → 보류 → 현재 행동 결정","day16-current-social-circle","auto-payment/high-value/investment 잠금 유지","`seojinAffection`/`seojinStatusInterest` 변화 0"])assert.ok(draft.includes(marker),`정보·불변·후속 누락: ${marker}`);
for(const forbidden of ["의미심장한 미소","묘한 표정","알 수 없는 감정","공기가 달라졌다","왠지 모를 불안","아무것도 아니야","가짜 하은","사고는 고의였다","하은이 사고에 동승"])assert.equal(draft.includes(forbidden),false,`금지 표현/조기 공개: ${forbidden}`);
assert.equal((draft.match(/^## 선택 [123] —/gm)??[]).length,3,"세 전략 선택 단계");
assert.ok((draft.match(/\*\*하은\*\*/g)??[]).length>=45,"하은 생활 대사 밀도");
assert.ok((draft.match(/\*\*주인공\*\*/g)??[]).length>=38,"주인공 관찰·행동 대사 밀도");
assert.ok((draft.match(/\[MICRO-PROGRESSION:/g)??[]).length>=3,"미세 진행 표식");
assert.ok(draft.length>=18000,"8~12분 플레이 초안 밀도");

console.log("✓ DAY 15 완전 시나리오 8 Scene·DAY 14 9콜백·DAY 15 9전략·작은 위화감·저장 계약 PASS");
