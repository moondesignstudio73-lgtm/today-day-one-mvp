import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const v1=readFileSync(new URL("../docs/day5/DAY5_SCENARIO_DRAFT_V1.md",import.meta.url),"utf8");
const v2=readFileSync(new URL("../docs/day5/DAY5_SCENARIO_REBUILD_V2.md",import.meta.url),"utf8");
const qa=readFileSync(new URL("../docs/day5/DAY5_SCENARIO_QA_V2.md",import.meta.url),"utf8");

assert.equal((v1.match(/^# SCENE \d{2}/gm)||[]).length,8,"V1 must retain SCENE 01–08");
for(let scene=1;scene<=8;scene++)assert.match(v1,new RegExp(`^# SCENE ${String(scene).padStart(2,"0")}\\b`,`m`));
assert.equal((v1.match(/^## 선택 [1-4]/gm)||[]).length,4,"four choice moments");

const strategies=[
  "entry_current_facts","entry_social_map","entry_recovery_boundary",
  "seojin_role_history","seojin_current_intent","seojin_present_boundary",
  "work_observe_only","work_bounded_review","work_pair_check",
  "request-current-briefing","rebuild-social-context","set-return-boundary"
];
for(const id of strategies)assert.ok(v1.includes(id),`V1 strategy ${id}`);

for(const marker of ["LOW","MID","HIGH","day5_haeun_boundary_respected","day5_haeun_autonomy_trust","day5ScenarioVersion = 2","day5ChoiceEffectsApplied","day6_life_restart_pending"])assert.ok(v2.includes(marker),marker);
for(const checkpoint of ["선택 1 직후","SCENE 03 직후","선택 2 직후","선택 3 직후","선택 4 직후","DAY REPORT 직전"])assert.ok(v2.includes(checkpoint),checkpoint);

assert.match(v2,/role_history[^\n]*seojinStatusInterest \+3[^\n]*seojinAffection \+0/);
assert.match(v2,/current_intent[^\n]*seojinAffection \+3[^\n]*seojinStatusInterest \+0/);
for(const forbidden of ["의미심장한 미소","알 수 없는 감정","운명의 시작","과연 진실은 무엇일까"])assert.ok(!`${v1}\n${v2}`.includes(forbidden),forbidden);
for(const forbidden of ["가짜 하은의 정체를 공개","하은이 사고의 범인"])assert.ok(!`${v1}\n${v2}`.includes(forbidden),forbidden);

assert.match(qa,/상태: `NARRATIVE QA PASS`/);
assert.match(qa,/NEEDS FIX: `0`/);
assert.equal((qa.match(/^\d+\. .*PASS/gm)||[]).length,10,"ten-question QA");
assert.match(qa,/기존 압축 런타임은 이 밀도를 충족하지 않으므로/);

console.log("✓ DAY 5 V1+V2 원고 충실도·화자·정보 예산·선택 기억·10문항 QA 통과");
