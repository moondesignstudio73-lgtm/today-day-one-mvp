import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const contract=readFileSync(new URL("../docs/day15/DAY15_CHAPTER_CONTRACT_V1.md",import.meta.url),"utf8");

for(const section of ["챕터 메타데이터","Voice Profile","지식 장부","MUST REVEAL","MAY REVEAL","MUST NOT REVEAL","PLAYER MAY SUSPECT","DAY 14 선택 콜백 계약","감정·관계·단서 예산","선택 계약","Scene Beat 계약","저장·복원 계약"])assert.ok(contract.includes(section),`필수 계약 섹션 누락: ${section}`);
for(const id of ["spend14_lane_personal","spend14_lane_shared","spend14_lane_gift","spend14_purchase_one_item","spend14_purchase_wait_compare","spend14_purchase_receipt_owner","spend14_consent_ask_first","spend14_consent_wishlist","spend14_consent_no_surprise"])assert.ok(contract.includes(id),`DAY 14 콜백 누락: ${id}`);
for(const id of ["leisure15_activity_each_pick","leisure15_activity_two_options","leisure15_activity_low_sensory","leisure15_change_shorten","leisure15_change_switch","leisure15_change_end","leisure15_privacy_private_note","leisure15_privacy_ask_each_photo","leisure15_privacy_no_location"])assert.ok(contract.includes(id),`DAY 15 전략 누락: ${id}`);
for(const marker of ["day15LeisureReservationVisitLabel=unverified","leisure-reservation-label-mismatch","day11ScheduleNoteMismatch=unverified","day14PastPreferenceRecommendation=unverified","윤서진 `seojinAffection`과 `seojinStatusInterest`","자동 게시·위치 공유·투자·고가 구매는 해금하지 않는다","day16-current-social-circle"])assert.ok(contract.includes(marker),`불변·후속 계약 누락: ${marker}`);
for(const forbidden of ["가짜 하은의 정체는","사고는 고의였다","하은이 사고에 동승했다","윤서진은 돈만 본다"])assert.equal(contract.includes(forbidden),false,`조기 공개/왜곡 문구: ${forbidden}`);
assert.equal((contract.match(/^\d+\. `[^`]+`/gm)??[]).length,8,"8개 Scene Beat 계약");
assert.match(contract,/관찰 → 전화번호·계정·업체 라벨 가능성 → 예약 상세 확인 → `unverified` 판단 → 현재 데이트 계속 여부 선택/);
assert.match(contract,/`TARGET_PLAYTIME`: 8~12분/);

console.log("✓ DAY 15 챕터 계약·Voice Profile·지식 장부·9콜백·9전략·8 Beat·정보 예산 PASS");
