import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  DAY6_DATE_CHOICES,DAY6_ERRAND_CHOICES,DAY6_ROUTE_CHOICES,
  applyLockedDay6ChoiceState,getLockedDay6LegacyChoice,getLockedDay6ResumePresentation,getLockedDay6Segment,validateLockedDay6Runtime
} from "../src/day6-campaign-runtime.mjs";
import {createScenarioState,validateScenarioState} from "../src/scenario-state.mjs";
import {getStoryScene} from "../src/story-manager.mjs";

function stateFor(){
  const scenario=createScenarioState("marriage-in-30-days");
  scenario.seojinAffection=7;scenario.seojinStatusInterest=11;
  return {gameMode:"marriage-in-30-days",day:6,money:100000,confidence:20,health:70,stress:10,energy:50,storyFlags:{day5ReturnStrategy:"set-return-boundary"},storyHistory:[{day:5,sceneId:"m30-day5-work-return",choiceId:"set-return-boundary",response:"완료"}],scenario};
}

assert.equal(validateLockedDay6Runtime(),true,"locked DAY 6 runtime contract");
assert.deepEqual([DAY6_ROUTE_CHOICES.length,DAY6_ERRAND_CHOICES.length,DAY6_DATE_CHOICES.length],[3,3,3]);
assert.ok(getStoryScene("m30-day6-neighborhood"),"DAY 6 story shell");

const state=stateFor();
const path=["route_shared_landmarks","errand_compare_together","date_alternate_choices"];
for(const [index,id] of path.entries()){
  const result=applyLockedDay6ChoiceState(state,id);
  assert.deepEqual(result,{stage:index+1},id);
  assert.ok(getLockedDay6Segment(state,result.stage).length>0,id);
  const restored=structuredClone(state);
  assert.equal(restored.storyFlags.day6RuntimeStage,index+1,"save restoration stage");
  assert.deepEqual(getLockedDay6ResumePresentation(restored),getLockedDay6ResumePresentation(state));
  assert.equal(validateScenarioState(restored.gameMode,restored.scenario),true);
}

assert.equal(getLockedDay6LegacyChoice(state),"date_alternate_choices");
assert.equal(state.storyFlags.day6MedicationRoutineSaved,true);
assert.equal(state.storyFlags.day6CurrentLifeRadiusSaved,true);
assert.equal(state.storyFlags.day6CurrentTasteSaved,true);
assert.equal(state.storyFlags.day6WorkBoundaryKept,true);
assert.equal(state.storyFlags.day7FirstPresentDatePending,true);
for(const action of ["neighborhood-pharmacy","neighborhood-market","neighborhood-cafe","neighborhood-park","current-life-map","plan-current-date"])assert.ok(state.scenario.unlockedActions.includes(action),action);
assert.ok(state.scenario.followUpHooks.includes("day7-first-present-date"));
assert.equal(state.scenario.seojinAffection,7,"DAY 6 must not alter Seojin affection");
assert.equal(state.scenario.seojinStatusInterest,11,"DAY 6 must not alter Seojin status interest");

for(const [choices,key] of [[DAY6_ROUTE_CHOICES,"day6RouteStrategy"],[DAY6_ERRAND_CHOICES,"day6ErrandStrategy"],[DAY6_DATE_CHOICES,"day6DatePlan"]]){
  for(const item of choices){const branch=stateFor();const before=[branch.scenario.seojinAffection,branch.scenario.seojinStatusInterest];assert.ok(applyLockedDay6ChoiceState(branch,item.id),item.id);assert.equal(branch.storyFlags[key],item.id);assert.deepEqual([branch.scenario.seojinAffection,branch.scenario.seojinStatusInterest],before,`${item.id} Seojin axes`);}
}

const allText=JSON.stringify([0,1,2,3].flatMap(stage=>getLockedDay6Segment(state,stage)));
for(const required of ["임시 예비폰","현재값 확인","DAY 6 카페","경계는 바깥에서","같이 가도 대신 결정하지 않기"])assert.ok(allText.includes(required),required);
for(const forbidden of ["가짜 하은","D-29","트럭 충돌","하은이 사고에 동승","의미심장한 미소"])assert.ok(!allText.includes(forbidden),forbidden);

const game=readFileSync(new URL("../game.js",import.meta.url),"utf8");
for(const pattern of [/LOCKED_DAY6_SCENE_ID/,/applyLockedDay6ChoiceState\(state,choiceId\)/,/getLockedDay6LegacyChoice\(state\)/,/day6Prompts/,/getLockedDay6ResumePresentation/])assert.match(game,pattern);
console.log("✓ DAY 6 잠금 시나리오 8 Scene·3단계 선택·DAY 5 콜백·양축 보존·저장 복원 검증 통과");
