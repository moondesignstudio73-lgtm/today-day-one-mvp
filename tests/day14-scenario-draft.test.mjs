import assert from "node:assert/strict";
import fs from "node:fs";
import { DAY14_LANE_CHOICES, DAY14_PURCHASE_CHOICES, DAY14_CONSENT_CHOICES } from "../src/day14-campaign-runtime.mjs";

const draft=fs.readFileSync(new URL("../docs/day14/DAY14_SCENARIO_DRAFT_V1.md",import.meta.url),"utf8");
assert.match(draft,/FULL PLAYABLE SCENARIO · DRAFT V1/);
assert.equal((draft.match(/^# SCENE \d{2}/gm)??[]).length,8);
for(const choice of [...DAY14_LANE_CHOICES,...DAY14_PURCHASE_CHOICES,...DAY14_CONSENT_CHOICES]) assert.ok(draft.includes(choice.id),`missing choice ${choice.id}`);
for(const callback of ["budget13_base_verified_personal","budget13_base_shared_essentials","budget13_base_protected_buffer","budget13_contribution_item_owner","budget13_contribution_equal_confirmed","budget13_contribution_capacity_review","budget13_review_totals_only","budget13_review_receipt_consent","budget13_review_weekly_changes"]) assert.ok(draft.includes(callback),`missing callback ${callback}`);
for(const marker of ["day14PastPreferenceRecommendation=unverified","오래된 내 계정","합쳐진 공용 장바구니","네 구매 기록","사용자·시간·기기 출처","day11ScheduleNoteMismatch=unverified","윤서진 `AFFECTION`/`STATUS_INTEREST`","day14CurrentChoiceSpendingCompleted=true","day15CurrentLeisureDatePending=true","day15-current-leisure-date","current-choice-spending-record","투자 잠금"]) assert.ok(draft.includes(marker),`missing invariant ${marker}`);
for(const forbidden of ["가짜 하은","사고를 일으킨","하은의 거짓말","범인은"]) assert.equal(draft.includes(forbidden),false,`early reveal: ${forbidden}`);
const haeun=(draft.match(/\*\*하은\*\*/g)??[]).length;
const protagonist=(draft.match(/\*\*주인공\*\*/g)??[]).length;
assert.ok(haeun>=35,`Haeun dialogue density too low: ${haeun}`);
assert.ok(protagonist>=30,`protagonist dialogue density too low: ${protagonist}`);
assert.ok(haeun>protagonist,"Haeun should lead slightly more dialogue");
assert.ok(draft.includes("관찰→가능성→확인→판단→행동"));
assert.ok(draft.includes("다음 관문에서 음성·정보 예산·선택 대가를 정밀 검토한다."));
console.log("✓ DAY 14 8 Scene 완전 플레이 초안·9선택·DAY 13 3×3 콜백·작은 위화감 보류 PASS");
