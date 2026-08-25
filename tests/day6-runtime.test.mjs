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

const moneyByErrand={errand_fixed_budget:70000,errand_compare_together:73000,errand_split_roles:71000};
const hookByDate={date_new_place:"day7-new-place-date",date_revisit_with_opt_out:"day7-revisit-date",date_alternate_choices:"day7-alternating-date"};
let completePaths=0;
for(const route of DAY6_ROUTE_CHOICES){
  for(const errand of DAY6_ERRAND_CHOICES){
    for(const date of DAY6_DATE_CHOICES){
      let branch=stateFor();
      assert.deepEqual(applyLockedDay6ChoiceState(branch,route.id),{stage:1});
      branch=JSON.parse(JSON.stringify(branch));
      assert.equal(branch.storyFlags.day6RuntimeStage,1);
      assert.equal(getLockedDay6ResumePresentation(branch).backgroundId,"neighborhood-street-day");
      assert.deepEqual(applyLockedDay6ChoiceState(branch,errand.id),{stage:2});
      branch=JSON.parse(JSON.stringify(branch));
      assert.equal(branch.storyFlags.day6RuntimeStage,2);
      assert.equal(getLockedDay6ResumePresentation(branch).backgroundId,"neighborhood-cafe-day");
      assert.deepEqual(applyLockedDay6ChoiceState(branch,date.id),{stage:3});
      branch=JSON.parse(JSON.stringify(branch));
      assert.equal(branch.storyFlags.day6RuntimeStage,3);
      assert.equal(getLockedDay6ResumePresentation(branch).backgroundId,"neighborhood-park-day");
      assert.equal(branch.money,moneyByErrand[errand.id],`${route.id}/${errand.id}/${date.id} money`);
      assert.ok(branch.scenario.followUpHooks.includes(hookByDate[date.id]),date.id);
      assert.ok(branch.scenario.followUpHooks.includes("day7-first-present-date"));
      assert.equal(branch.scenario.seojinAffection,7,"27-path affection isolation");
      assert.equal(branch.scenario.seojinStatusInterest,11,"27-path status isolation");
      assert.equal(validateScenarioState(branch.gameMode,branch.scenario),true);
      assert.equal(new Set(branch.scenario.unlockedActions).size,branch.scenario.unlockedActions.length,"deduplicated unlocks");
      assert.equal(new Set(branch.scenario.followUpHooks).size,branch.scenario.followUpHooks.length,"deduplicated hooks");
      completePaths++;
    }
  }
}
assert.equal(completePaths,27,"all DAY 6 strategy combinations");

for(const [returnPlan,required] of [["request-current-briefing","파란 파일 갱신"],["rebuild-social-context","점선을 열두 번"],["set-return-boundary","휴식일 회신 금지"]]){
  const callbackState=stateFor();callbackState.storyFlags.day5ReturnStrategy=returnPlan;callbackState.storyFlags.day6RouteStrategy="route_essentials_first";callbackState.storyFlags.day6ErrandStrategy="errand_fixed_budget";
  assert.ok(JSON.stringify(getLockedDay6Segment(callbackState,2)).includes(required),`${returnPlan} callback`);
}

const allText=JSON.stringify([0,1,2,3].flatMap(stage=>getLockedDay6Segment(state,stage)));
for(const required of ["임시 예비폰","현재값 확인","DAY 6 카페","경계는 바깥에서","같이 가도 대신 결정하지 않기"])assert.ok(allText.includes(required),required);
for(const forbidden of ["가짜 하은","D-29","트럭 충돌","하은이 사고에 동승","의미심장한 미소"])assert.ok(!allText.includes(forbidden),forbidden);

const game=readFileSync(new URL("../game.js",import.meta.url),"utf8");
for(const pattern of [/LOCKED_DAY6_SCENE_ID/,/applyLockedDay6ChoiceState\(state,choiceId\)/,/getLockedDay6LegacyChoice\(state\)/,/day6Prompts/,/getLockedDay6ResumePresentation/])assert.match(game,pattern);
console.log("✓ DAY 6 잠금 시나리오 8 Scene·27경로·3종 콜백·양축 보존·JSON 저장 복원 검증 통과");
