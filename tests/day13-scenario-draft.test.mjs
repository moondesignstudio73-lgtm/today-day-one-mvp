import assert from "node:assert/strict";
import fs from "node:fs";
import { DAY13_BASE_CHOICES, DAY13_CONTRIBUTION_CHOICES, DAY13_REVIEW_CHOICES } from "../src/day13-campaign-runtime.mjs";

const draft=fs.readFileSync(new URL("../docs/day13/DAY13_SCENARIO_DRAFT_V1.md",import.meta.url),"utf8");
assert.match(draft,/FULL PLAYABLE SCENARIO · SCENARIO LOCK V1/);
assert.equal((draft.match(/^# SCENE \d{2}/gm)??[]).length,8);
for(const choice of [...DAY13_BASE_CHOICES,...DAY13_CONTRIBUTION_CHOICES,...DAY13_REVIEW_CHOICES]) assert.ok(draft.includes(choice.id),`missing choice ${choice.id}`);
for(const callback of ["account12_verify_owner_statement","account12_verify_support_call","account12_verify_living_entries","account12_expense_personal_only","account12_expense_shared_unconfirmed","account12_expense_source_labels","account12_access_read_only","account12_access_monthly_review","account12_access_separate_investment"]) assert.ok(draft.includes(callback),`missing callback ${callback}`);
for(const marker of ["day11ScheduleNoteMismatch=unverified","current-household-budget-record","day14-current-choice-spending","투자 잠금","윤서진 `AFFECTION`/`STATUS_INTEREST`"]) assert.ok(draft.includes(marker),`missing invariant ${marker}`);
for(const forbidden of ["가짜 하은","사고를 일으킨","하은의 거짓말","범인은"]) assert.equal(draft.includes(forbidden),false,`early reveal: ${forbidden}`);
assert.ok((draft.match(/\*\*하은\*\*/g)??[]).length>=25,"Haeun needs full playable dialogue density");
assert.ok((draft.match(/\*\*주인공\*\*/g)??[]).length>=20,"protagonist needs full playable dialogue density");
assert.ok(draft.includes("내러티브 QA와 시나리오 잠금 판정은 완료"));
console.log("✓ DAY 13 8 Scene 완전 플레이 초안·9선택·DAY 12 3×3 콜백·공개 예산 PASS");
