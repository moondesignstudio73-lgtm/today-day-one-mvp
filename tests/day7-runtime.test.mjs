import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  DAY7_MEMORY_CHOICES,DAY7_OPENING_CHOICES,DAY7_RECOVERY_CHOICES,
  applyLockedDay7ChoiceState,getLockedDay7LegacyChoice,getLockedDay7ResumePresentation,getLockedDay7Segment,validateLockedDay7Runtime
} from "../src/day7-campaign-runtime.mjs";
import {createScenarioState,validateScenarioState} from "../src/scenario-state.mjs";
import {getStoryScene,selectNextStoryScene} from "../src/story-manager.mjs";

function stateFor(day6DatePlan="date_alternate_choices"){
  const scenario=createScenarioState("marriage-in-30-days");
  scenario.haeunAffection=12;scenario.haeunTrust=14;scenario.seojinAffection=7;scenario.seojinStatusInterest=11;
  scenario.followUpHooks=["day7-first-present-date"];
  return {gameMode:"marriage-in-30-days",day:7,money:73000,confidence:26,health:72,stress:10,energy:48,storyFlags:{day6RouteStrategy:"route_shared_landmarks",day6ErrandStrategy:"errand_compare_together",day6DatePlan,day7FirstPresentDatePending:true},storyHistory:[{day:6,sceneId:"m30-day6-neighborhood",choiceId:day6DatePlan,response:"완료"}],scenario};
}

assert.equal(validateLockedDay7Runtime(),true,"locked DAY 7 runtime contract");
assert.deepEqual([DAY7_OPENING_CHOICES.length,DAY7_RECOVERY_CHOICES.length,DAY7_MEMORY_CHOICES.length],[3,3,3]);
const shell=getStoryScene("m30-day7-first-present-date");
assert.ok(shell,"DAY 7 story shell");
assert.equal(shell.choices.length,3);

const state=stateFor();
const path=["date7_confirm_together","date7_rest_and_shorten","date7_record_next_rule"];
for(const [index,id] of path.entries()){
  assert.deepEqual(applyLockedDay7ChoiceState(state,id),{stage:index+1},id);
  const restored=JSON.parse(JSON.stringify(state));
  assert.equal(restored.storyFlags.day7RuntimeStage,index+1,"save restoration stage");
  assert.deepEqual(getLockedDay7ResumePresentation(restored),getLockedDay7ResumePresentation(state));
  assert.ok(getLockedDay7Segment(restored,index+1).length>0,id);
  assert.equal(validateScenarioState(restored.gameMode,restored.scenario),true);
}

assert.equal(getLockedDay7LegacyChoice(state),"date7_record_next_rule");
for(const key of ["day7ChangeSharedNotFailed","first_present_date_memory","shared_change_rule","day7FirstPresentDateCompleted","day8IndependentErrandPending"])assert.equal(state.storyFlags[key],true,key);
assert.equal(state.storyFlags.day7FirstPresentDatePending,false);
for(const id of ["first-present-date-memory","shared-change-rule"])assert.ok(state.scenario.clues.includes(id),id);
for(const id of ["review-present-date-memory","plan-independent-errand"])assert.ok(state.scenario.unlockedActions.includes(id),id);
assert.ok(state.scenario.followUpHooks.includes("day8-independent-errand"));
assert.equal(state.scenario.seojinAffection,7);
assert.equal(state.scenario.seojinStatusInterest,11);

const expectedActivityBackground={date_new_place:"day7-gallery-day",date_revisit_with_opt_out:"day7-river-promenade-day",date_alternate_choices:"day7-gallery-day"};
let completePaths=0;
for(const day6Plan of Object.keys(expectedActivityBackground)){
  for(const opening of DAY7_OPENING_CHOICES){
    for(const recovery of DAY7_RECOVERY_CHOICES){
      for(const memory of DAY7_MEMORY_CHOICES){
        let branch=stateFor(day6Plan);const before=[branch.scenario.seojinAffection,branch.scenario.seojinStatusInterest];
        assert.deepEqual(applyLockedDay7ChoiceState(branch,opening.id),{stage:1});branch=JSON.parse(JSON.stringify(branch));
        assert.equal(getLockedDay7ResumePresentation(branch).backgroundId,"day7-bookshop-day");
        assert.deepEqual(applyLockedDay7ChoiceState(branch,recovery.id),{stage:2});branch=JSON.parse(JSON.stringify(branch));
        assert.equal(getLockedDay7ResumePresentation(branch).backgroundId,expectedActivityBackground[day6Plan]);
        assert.deepEqual(applyLockedDay7ChoiceState(branch,memory.id),{stage:3});branch=JSON.parse(JSON.stringify(branch));
        assert.equal(getLockedDay7ResumePresentation(branch).backgroundId,"home-morning");
        assert.equal(branch.storyFlags.day7OpeningStrategy,opening.id);assert.equal(branch.storyFlags.day7RecoveryStrategy,recovery.id);assert.equal(branch.storyFlags.day7MemoryStrategy,memory.id);
        assert.deepEqual([branch.scenario.seojinAffection,branch.scenario.seojinStatusInterest],before,"Seojin axes remain isolated");
        assert.equal(new Set(branch.scenario.clues).size,branch.scenario.clues.length);assert.equal(new Set(branch.scenario.unlockedActions).size,branch.scenario.unlockedActions.length);assert.equal(new Set(branch.scenario.followUpHooks).size,branch.scenario.followUpHooks.length);
        assert.equal(validateScenarioState(branch.gameMode,branch.scenario),true);completePaths++;
      }
    }
  }
}
assert.equal(completePaths,81,"DAY 6 plan × DAY 7 three strategies");

for(const [plan,required] of [["date_new_place","둘 다 처음"],["date_revisit_with_opt_out","기억을 시험하지 않는 강변"],["date_alternate_choices","선택권을 번갈아"]]){
  const callback=stateFor(plan);callback.storyFlags.day7OpeningStrategy="date7_lead_first_leg";
  assert.ok(JSON.stringify(getLockedDay7Segment(callback,1)).includes(required),`${plan} callback`);
}
const allText=JSON.stringify([0,1,2,3].flatMap(stage=>getLockedDay7Segment(state,stage)));
for(const required of ["더 안 풀리게 묶었어","기억 말고 취향","변경은 실패로 세지 않기로","오늘 이유가 있으면 충분해","계획은 함께 세우고, 변경은 실패로 세지 않는다"])assert.ok(allText.includes(required),required);
for(const forbidden of ["가짜 하은","D-29","트럭 충돌","하은이 사고에 동승","의미심장한 미소","아무것도 아니야"])assert.ok(!allText.includes(forbidden),forbidden);

const day8Campaign={...stateFor("date_revisit_with_opt_out"),day:8,partner:{heroineId:"haeun"}};
day8Campaign.storyHistory.push({day:7,sceneId:"m30-day7-first-present-date",choiceId:"date7_record_next_rule",response:"완료"});
assert.notEqual(selectNextStoryScene(day8Campaign)?.id,"ex-message","free-romance legacy stories must not leak into the campaign after DAY 7");

const game=readFileSync(new URL("../game.js",import.meta.url),"utf8");
for(const pattern of [/LOCKED_DAY7_SCENE_ID/,/applyLockedDay7ChoiceState\(state,choiceId\)/,/getLockedDay7LegacyChoice\(state\)/,/day7Prompts/,/getLockedDay7ResumePresentation/])assert.match(game,pattern);
console.log("✓ DAY 7 잠금 시나리오 8 Scene·81경로·DAY 6 콜백·양축 보존·JSON 저장 복원 검증 통과");
