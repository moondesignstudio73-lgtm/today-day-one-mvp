import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DAY13_BASE_CHOICES, DAY13_CONTRIBUTION_CHOICES, DAY13_REVIEW_CHOICES, LOCKED_DAY13_SCENE_ID } from "../src/day13-campaign-runtime.mjs";
import { getStoryScene } from "../src/story-manager.mjs";

const contract=readFileSync(new URL("../docs/day13/DAY13_CHAPTER_CONTRACT_V1.md",import.meta.url),"utf8");
assert.equal(LOCKED_DAY13_SCENE_ID,"m30-day13-current-household-budget");
assert.equal(getStoryScene(LOCKED_DAY13_SCENE_ID)?.window?.[0],13);
assert.deepEqual([DAY13_BASE_CHOICES.length,DAY13_CONTRIBUTION_CHOICES.length,DAY13_REVIEW_CHOICES.length],[3,3,3]);
for(const marker of ["Voice Profile","지식 장부","MUST REVEAL","MUST NOT REVEAL","PLAYER MAY SUSPECT","8 Beat 구조 계약","TARGET_PLAYTIME","FOLLOW_UP_HOOK","저장 복원 계약","NEEDS FIX: 0"])assert.ok(contract.includes(marker),`DAY 13 계약 누락: ${marker}`);
for(const id of ["account12_verify_owner_statement","account12_verify_support_call","account12_verify_living_entries","account12_expense_personal_only","account12_expense_shared_unconfirmed","account12_expense_source_labels","account12_access_read_only","account12_access_monthly_review","account12_access_separate_investment"])assert.ok(contract.includes(id),`DAY 12 콜백 누락: ${id}`);
for(const choice of [...DAY13_BASE_CHOICES,...DAY13_CONTRIBUTION_CHOICES,...DAY13_REVIEW_CHOICES])assert.ok(contract.includes(choice.id),`DAY 13 선택 계약 누락: ${choice.id}`);
for(const marker of ["day11ScheduleNoteMismatch=unverified","미스터리 단서 신규 0","AFFECTION","STATUS_INTEREST","투자 기능은 잠금","day14-current-choice-spending"])assert.ok(contract.includes(marker),`불변·후속 계약 누락: ${marker}`);
for(const forbidden of ["가짜 하은","진짜 하은","사고는 고의","하은의 거짓말"])assert.ok(!contract.includes(forbidden),`조기 공개 금지: ${forbidden}`);
console.log("✓ DAY 13 챕터 계약·Voice Profile·지식 장부·DAY 12 3×3 콜백·정보 예산 PASS");
