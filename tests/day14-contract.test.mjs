import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DAY14_LANE_CHOICES, DAY14_PURCHASE_CHOICES, DAY14_CONSENT_CHOICES, LOCKED_DAY14_SCENE_ID } from "../src/day14-campaign-runtime.mjs";
import { getStoryScene } from "../src/story-manager.mjs";

const contract=readFileSync(new URL("../docs/day14/DAY14_CHAPTER_CONTRACT_V1.md",import.meta.url),"utf8");
assert.equal(LOCKED_DAY14_SCENE_ID,"m30-day14-current-choice-spending");
assert.equal(getStoryScene(LOCKED_DAY14_SCENE_ID)?.window?.[0],14);
assert.deepEqual([DAY14_LANE_CHOICES.length,DAY14_PURCHASE_CHOICES.length,DAY14_CONSENT_CHOICES.length],[3,3,3]);
for(const marker of ["Voice Profile","지식 장부","MUST REVEAL","MUST NOT REVEAL","PLAYER MAY SUSPECT","8 Beat 구조 계약","TARGET_PLAYTIME","FOLLOW_UP_HOOK","저장 복원 계약","NEEDS FIX: 0"])assert.ok(contract.includes(marker),`DAY 14 계약 누락: ${marker}`);
for(const id of ["budget13_base_verified_personal","budget13_base_shared_essentials","budget13_base_protected_buffer","budget13_contribution_item_owner","budget13_contribution_equal_confirmed","budget13_contribution_capacity_review","budget13_review_totals_only","budget13_review_receipt_consent","budget13_review_weekly_changes"])assert.ok(contract.includes(id),`DAY 13 콜백 누락: ${id}`);
for(const choice of [...DAY14_LANE_CHOICES,...DAY14_PURCHASE_CHOICES,...DAY14_CONSENT_CHOICES])assert.ok(contract.includes(choice.id),`DAY 14 선택 계약 누락: ${choice.id}`);
for(const marker of ["day11ScheduleNoteMismatch=unverified","day14PastPreferenceRecommendation=unverified","AFFECTION","STATUS_INTEREST","자동결제·고가 구매·투자 기능은 잠금","day15-current-leisure-date"])assert.ok(contract.includes(marker),`불변·후속 계약 누락: ${marker}`);
for(const forbidden of ["사고는 고의","하은이 범인","하은의 거짓말","정체를 밝혔다"])assert.ok(!contract.includes(forbidden),`조기 공개 금지: ${forbidden}`);
console.log("✓ DAY 14 챕터 계약·Voice Profile·지식 장부·DAY 13 3×3 콜백·작은 위화감 예산 PASS");
