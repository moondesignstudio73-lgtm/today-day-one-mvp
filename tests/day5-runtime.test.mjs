import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  DAY5_ENTRY_CHOICES,DAY5_RETURN_CHOICES,DAY5_SEOJIN_CHOICES,DAY5_WORK_CHOICES,
  applyLockedDay5ChoiceState,getLockedDay5LegacyChoice,getLockedDay5ResumePresentation,getLockedDay5Segment,validateLockedDay5Runtime
} from "../src/day5-campaign-runtime.mjs";
import {createScenarioState,validateScenarioState} from "../src/scenario-state.mjs";

function stateFor(){return {gameMode:"marriage-in-30-days",storyFlags:{day4SharingStrategy:"sharing_transparent"},storyHistory:[{day:4,sceneId:"m30-day4-arrive-home",choiceId:"map-home-basics"}],scenario:createScenarioState("marriage-in-30-days")};}

assert.equal(validateLockedDay5Runtime(),true,"locked DAY 5 runtime contract");
assert.deepEqual([DAY5_ENTRY_CHOICES.length,DAY5_SEOJIN_CHOICES.length,DAY5_WORK_CHOICES.length,DAY5_RETURN_CHOICES.length],[3,3,3,3]);
assert.deepEqual(DAY5_RETURN_CHOICES.map(item=>item.id),["request-current-briefing","rebuild-social-context","set-return-boundary"],"legacy final choice IDs");

const state=stateFor();
const path=["entry_current_facts","seojin_role_history","work_bounded_review","set-return-boundary"];
for(const [index,id] of path.entries()){
  const result=applyLockedDay5ChoiceState(state,id);
  assert.deepEqual(result,{stage:index+1},id);
  assert.ok(getLockedDay5Segment(state,result.stage).length>0,id);
  const restored=structuredClone(state);
  assert.equal(restored.storyFlags.day5RuntimeStage,index+1,"save restoration stage");
  assert.deepEqual(getLockedDay5ResumePresentation(restored),getLockedDay5ResumePresentation(state));
  assert.equal(validateScenarioState(restored.gameMode,restored.scenario),true);
}
assert.equal(getLockedDay5LegacyChoice(state),"set-return-boundary");
assert.equal(state.storyFlags.day5ReturnPlanReady,true);
assert.ok(state.scenario.profileUnlocks.includes("seojin-basic"));
assert.ok(state.scenario.unlockedActions.includes("day5-work-trial"));
assert.ok(state.scenario.followUpHooks.includes("day6-life-restart"));

const roleHistory=stateFor();
applyLockedDay5ChoiceState(roleHistory,"seojin_role_history");
assert.equal(roleHistory.scenario.seojinAffection,0,"role history must not change affection");
assert.equal(roleHistory.scenario.seojinStatusInterest,3,"role history changes status interest");
const currentIntent=stateFor();
applyLockedDay5ChoiceState(currentIntent,"seojin_current_intent");
assert.equal(currentIntent.scenario.seojinAffection,3,"current intent changes affection");
assert.equal(currentIntent.scenario.seojinStatusInterest,0,"current intent must not change status interest");
const presentBoundary=stateFor();
applyLockedDay5ChoiceState(presentBoundary,"seojin_present_boundary");
assert.equal(presentBoundary.scenario.seojinAffection,1);
assert.equal(presentBoundary.scenario.seojinStatusInterest,1);

for(const [choices,key] of [[DAY5_ENTRY_CHOICES,"day5EntryStrategy"],[DAY5_SEOJIN_CHOICES,"day5SeojinStrategy"],[DAY5_WORK_CHOICES,"day5WorkTrial"],[DAY5_RETURN_CHOICES,"day5ReturnStrategy"]]){
  for(const item of choices){const branch=stateFor();assert.ok(applyLockedDay5ChoiceState(branch,item.id),item.id);assert.equal(branch.storyFlags[key],item.id);}
}

const allText=JSON.stringify([0,1,2,3,4].flatMap(stage=>getLockedDay5Segment(state,stage)));
for(const forbidden of ["가짜 하은","D-29","트럭 충돌","하은이 사고에 동승"])assert.ok(!allText.includes(forbidden),forbidden);
for(const required of ["확인된 사실","민호","윤서진","판단을 빌리는 연습","임시 예비폰"])assert.ok(allText.includes(required),required);

const game=readFileSync(new URL("../game.js",import.meta.url),"utf8");
assert.match(game,/LOCKED_DAY5_SCENE_ID/);
assert.match(game,/applyLockedDay5ChoiceState\(state,choiceId\)/);
assert.match(game,/getLockedDay5LegacyChoice\(state\)/);
assert.match(game,/day5Prompts/);
console.log("✓ DAY 5 잠금 시나리오 8 Scene·4단계 선택·양축 분리·저장 복원 검증 통과");
