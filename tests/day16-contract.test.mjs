import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  DAY16_CONTACT_CHOICES,
  DAY16_MEETING_CHOICES,
  DAY16_SHARING_CHOICES,
  LOCKED_DAY16_SCENE_ID
} from "../src/day16-campaign-runtime.mjs";

const contract=readFileSync(new URL("../docs/day16/DAY16_CHAPTER_CONTRACT_V1.md",import.meta.url),"utf8");

assert.equal(LOCKED_DAY16_SCENE_ID,"m30-day16-current-social-circle");
assert.match(contract,/CHAPTER CONTRACT PASS/);
assert.match(contract,/NEEDS FIX: 0/);
assert.match(contract,/TARGET_PLAYTIME.*8.?12분/);
assert.match(contract,/FOLLOW_UP_HOOK.*day17-current-health-routine/);
assert.match(contract,/day15CurrentLeisureDateCompleted=true/);
assert.match(contract,/day16CurrentSocialCirclePending=true/);

for(const speaker of ["이하은, 23세","주인공","박지훈, 29세"]){
  assert.match(contract,new RegExp(`### ${speaker}`));
}
for(const field of ["KNOWS","BELIEVES","SUSPECTS","DOES_NOT_KNOW","HIDES","LIES_ABOUT","MISREMEMBERS","WANTS","FEARS"]){
  assert.equal(contract.split("`"+field+"`").length-1,3,`${field} must exist for all three speakers`);
}
for(const heading of ["### MUST REVEAL","### MAY REVEAL","### MUST NOT REVEAL","### PLAYER MAY SUSPECT"]){
  assert.ok(contract.includes(heading),`${heading} missing`);
}

const day15CallbackIds=[
  "leisure15_activity_each_pick","leisure15_activity_two_options","leisure15_activity_low_sensory",
  "leisure15_change_shorten","leisure15_change_switch","leisure15_change_end",
  "leisure15_privacy_private_note","leisure15_privacy_ask_each_photo","leisure15_privacy_no_location"
];
for(const id of day15CallbackIds)assert.ok(contract.includes(`\`${id}\``),`missing DAY 15 callback ${id}`);

const day16Choices=[...DAY16_CONTACT_CHOICES,...DAY16_MEETING_CHOICES,...DAY16_SHARING_CHOICES];
assert.equal(day16Choices.length,9);
assert.equal(new Set(day16Choices.map(choice=>choice.id)).size,9);
for(const {id} of day16Choices)assert.ok(contract.includes(`\`${id}\``),`missing DAY 16 strategy ${id}`);

for(let beat=1;beat<=8;beat++)assert.match(contract,new RegExp(`^${beat}\\. `,"m"),`missing beat ${beat}`);
assert.match(contract,/관찰 → 가능한 관계 형태 분리 → 현재 신원·목적 확인 → 지킬 경계 판단 → 1회 행동으로 시험/);
assert.match(contract,/seojinAffection.*seojinStatusInterest.*독립 값/);
assert.match(contract,/가짜 하은.*하은의 잠금 프로필/);
assert.doesNotMatch(contract,/하은은 범인|사고는 고의였다|차량을 조작했다/);

console.log("✓ DAY 16 챕터 계약·3 Voice Profile·지식 장부·9콜백·9전략·8 Beat·정보 예산 PASS");
