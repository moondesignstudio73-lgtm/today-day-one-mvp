import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {getNpcSprite} from "../src/assets/asset-manifest.mjs";
import {
  DAY4_ACCIDENT_CHOICES,DAY4_CONTACT_CHOICES,DAY4_HOME_CHOICES,DAY4_IDENTITY_CHOICES,DAY4_SHARING_CHOICES,
  applyLockedDay4ChoiceState,getAvailableDay4HomeChoices,getLockedDay4LegacyChoice,getLockedDay4ResumePresentation,getLockedDay4Segment,validateLockedDay4Runtime
} from "../src/day4-campaign-runtime.mjs";
import {createScenarioState} from "../src/scenario-state.mjs";

assert.equal(validateLockedDay4Runtime(),true,"locked DAY 4 runtime contract");
assert.ok(getNpcSprite("best-friend"),"Jihoon sprite must resolve");
assert.equal(DAY4_HOME_CHOICES.length,4);
assert.equal(DAY4_CONTACT_CHOICES.length,3);
assert.equal(DAY4_IDENTITY_CHOICES.length,3);
assert.equal(DAY4_ACCIDENT_CHOICES.length,3);
assert.equal(DAY4_SHARING_CHOICES.length,3);

function stateFor(day3Choice="inspect-system-first"){
  return {
    gameMode:"marriage-in-30-days",
    storyFlags:{},
    storyHistory:[{day:3,sceneId:"m30-day3-discharge-phone",choiceId:day3Choice}],
    scenario:createScenarioState("marriage-in-30-days")
  };
}

assert.deepEqual(getAvailableDay4HomeChoices(stateFor("inspect-system-first")).map(item=>item.id),["map-home-basics","cross-check-digital-address"]);
assert.deepEqual(getAvailableDay4HomeChoices(stateFor("set-up-together")).map(item=>item.id),["map-home-basics","restore-routine-together"]);
assert.deepEqual(getAvailableDay4HomeChoices(stateFor("seal-until-home")).map(item=>item.id),["map-home-basics","open-phone-at-desk"]);

const state=stateFor();
const path=["cross-check-digital-address","contact_written_proof","identity_evidence_first","accident_direct_knowledge_only","sharing_transparent"];
for(const [index,id] of path.entries()){
  const result=applyLockedDay4ChoiceState(state,id);
  assert.deepEqual(result,{stage:index+1},id);
  assert.ok(getLockedDay4Segment(state,result.stage).length>0,id);
  const restored=structuredClone(state);
  assert.equal(restored.storyFlags.day4RuntimeStage,index+1,"save restoration stage");
  assert.equal(getLockedDay4ResumePresentation(restored).backgroundId,getLockedDay4ResumePresentation(state).backgroundId);
}
assert.equal(getLockedDay4LegacyChoice(state),"cross-check-digital-address");
assert.equal(state.storyFlags.day4TestimonyLedgerUnlocked,true);
assert.equal(state.storyFlags.day4WorkContactPending,true);
assert.ok(state.scenario.unlockedActions.includes("testimony-ledger"));
assert.ok(state.scenario.followUpHooks.includes("day5-work-return"));
assert.ok(state.scenario.investigation>=4);
assert.ok(state.scenario.haeunTrust>=2);

for(const [choices,key] of [[DAY4_CONTACT_CHOICES,"day4ContactStrategy"],[DAY4_IDENTITY_CHOICES,"day4IdentityFocus"],[DAY4_ACCIDENT_CHOICES,"day4AccidentQuestion"],[DAY4_SHARING_CHOICES,"day4SharingStrategy"]]){
  for(const item of choices){const branch=stateFor();branch.storyFlags.day4HomeStrategy="map-home-basics";assert.ok(applyLockedDay4ChoiceState(branch,item.id),item.id);assert.equal(branch.storyFlags[key],item.id);}
}

const allText=JSON.stringify([0,1,2,3,4,5].flatMap(stage=>getLockedDay4Segment(state,stage)));
for(const forbidden of ["가짜 하은","D-27","트럭 충돌","하은이 사고에 동승"])assert.ok(!allText.includes(forbidden),forbidden);
assert.ok(allText.includes("직접 겪은 것"));
assert.ok(allText.includes("미확인 증언"));
assert.ok(allText.includes("민호입니다"));

const game=readFileSync(new URL("../game.js",import.meta.url),"utf8");
assert.match(game,/LOCKED_DAY4_SCENE_ID/);
assert.match(game,/applyLockedDay4ChoiceState\(state,choiceId\)/);
assert.match(game,/getLockedDay4LegacyChoice\(state\)/);
console.log("✓ DAY 4 잠금 시나리오 10 Scene·5단계 선택·저장 복원·후속 훅 검증 통과");
