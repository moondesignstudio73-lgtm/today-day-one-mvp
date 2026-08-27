import assert from "node:assert/strict";
import {applyLockedDay4ChoiceState,getLockedDay4ResumePresentation,getLockedDay4Segment} from "../src/day4-campaign-runtime.mjs";
import {createScenarioState} from "../src/scenario-state.mjs";

const state={gameMode:"marriage-in-30-days",affection:500,trust:450,money:50000,storyFlags:{},storyHistory:[{day:3,sceneId:"m30-day3-discharge-phone",choiceId:"inspect-system-first"}],scenario:createScenarioState("marriage-in-30-days")};
const path=[
  ["morning_flirt",1],["contact_written_proof",2],["identity_haeun",3],["disclose_tell",4],
  ["taste_old_order",5],["old_drink_bad",6],["haeun_past_marriage",7],["accident_last_contact",8],
  ["payment_split",9],["reflection_curious",10]
];

assert.match(JSON.stringify(getLockedDay4Segment(state,0)),/08:17/);
for(const [id,stage] of path){
  const result=applyLockedDay4ChoiceState(state,id);assert.deepEqual(result,{stage},id);
  assert.equal(state.storyFlags.day4RuntimeVersion,3);assert.equal(state.storyFlags.day4RuntimeStage,stage);
  const segment=getLockedDay4Segment(state,stage);assert.ok(segment.length>0,id);
  const restored=structuredClone(state);assert.deepEqual(getLockedDay4ResumePresentation(restored),getLockedDay4ResumePresentation(state));
  const before=JSON.stringify(state);assert.deepEqual(applyLockedDay4ChoiceState(state,id),{stage});assert.equal(JSON.stringify(state),before,`${id} idempotency`);
}
assert.equal(state.storyFlags.friend_system_unlocked,true);
assert.equal(state.storyFlags.jihoon_contact_unlocked,true);
assert.equal(state.storyFlags.day5_minho_hook,true);
assert.equal(state.storyFlags.day4SharingStrategy,"sharing_transparent","legacy completion compatibility");
assert.ok(state.scenario.unlockedActions.includes("past-contacts-index"));
assert.ok(state.scenario.followUpHooks.includes("day5-work-return"));
const ending=JSON.stringify(getLockedDay4Segment(state,10));
assert.match(ending,/FRIEND SYSTEM UNLOCKED/);assert.match(ending,/민호/);
for(const forbidden of ["가짜 하은","사고는 고의","윤서진과 연애","D-27"])assert.doesNotMatch(ending,new RegExp(forbidden));
console.log("✓ DAY 4 V3 10단계 상태 머신·저장 복원·멱등성·레거시 완료 호환 PASS");
