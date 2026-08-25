import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  DAY8_CHECKIN_CHOICES,DAY8_PURCHASE_CHOICES,DAY8_SHARE_CHOICES,
  applyLockedDay8ChoiceState,getLockedDay8LegacyChoice,getLockedDay8ResumePresentation,getLockedDay8Segment,validateLockedDay8Runtime
} from "../src/day8-campaign-runtime.mjs";
import {createScenarioState,validateScenarioState} from "../src/scenario-state.mjs";
import {getStoryScene,selectNextStoryScene} from "../src/story-manager.mjs";

function stateFor(haeunTrust=30){
  const scenario=createScenarioState("marriage-in-30-days");
  scenario.haeunAffection=18;scenario.haeunTrust=haeunTrust;scenario.seojinAffection=7;scenario.seojinStatusInterest=11;
  scenario.followUpHooks=["day8-independent-errand"];
  return {gameMode:"marriage-in-30-days",day:8,money:73000,confidence:26,health:72,stress:10,energy:48,storyFlags:{day7OpeningStrategy:"date7_confirm_together",day7RecoveryStrategy:"date7_rest_and_shorten",day7MemoryStrategy:"date7_record_next_rule",day8IndependentErrandPending:true,shared_change_rule:true},storyHistory:[{day:7,sceneId:"m30-day7-first-present-date",choiceId:"date7_record_next_rule",response:"완료"}],scenario};
}

assert.equal(validateLockedDay8Runtime(),true,"locked DAY 8 runtime contract");
assert.deepEqual([DAY8_CHECKIN_CHOICES.length,DAY8_PURCHASE_CHOICES.length,DAY8_SHARE_CHOICES.length],[3,3,3]);
const shell=getStoryScene("m30-day8-independent-errand");
assert.ok(shell,"DAY 8 story shell");assert.equal(shell.choices.length,3);

const state=stateFor();
const path=["errand8_change_only_checkin","errand8_compare_labels","errand8_explain_decision_log"];
const expectedResume=["neighborhood-street-day","day8-household-store-day","home-morning"];
for(const [index,id] of path.entries()){
  assert.deepEqual(applyLockedDay8ChoiceState(state,id),{stage:index+1},id);
  const restored=JSON.parse(JSON.stringify(state));
  assert.equal(restored.storyFlags.day8RuntimeStage,index+1,"save restoration stage");
  assert.equal(getLockedDay8ResumePresentation(restored).backgroundId,expectedResume[index]);
  assert.equal(getLockedDay8ResumePresentation(restored).characterId,index<2?null:"girlfriend");
  assert.ok(getLockedDay8Segment(restored,index+1).length>0,id);
  assert.equal(validateScenarioState(restored.gameMode,restored.scenario),true);
}

assert.equal(getLockedDay8LegacyChoice(state),"errand8_explain_decision_log");
for(const key of ["day8OriginalPhoneUntouched","day8PastMemberNumberNotGuessed","day8IndependentErrandCompleted","day9SecondOfficeAdaptationPending","day8CurrentHouseholdChoiceSaved","day8ReturnDebriefSaved","day8OriginalPhoneAtHospital"])assert.equal(state.storyFlags[key],true,key);
assert.equal(state.storyFlags.day8IndependentErrandPending,false);
for(const id of ["independent-errand-contract","current-household-choice","return-debrief-rule"])assert.ok(state.scenario.clues.includes(id),id);
for(const id of ["independent-neighborhood-errand","review-current-mail","prepare-limited-office-return"])assert.ok(state.scenario.unlockedActions.includes(id),id);
assert.ok(state.scenario.followUpHooks.includes("day9-second-office-adaptation"));
assert.deepEqual([state.scenario.seojinAffection,state.scenario.seojinStatusInterest],[7,11]);

let completePaths=0;
for(const checkin of DAY8_CHECKIN_CHOICES){
  for(const purchase of DAY8_PURCHASE_CHOICES){
    for(const share of DAY8_SHARE_CHOICES){
      let branch=stateFor(34);const before=[branch.scenario.seojinAffection,branch.scenario.seojinStatusInterest];
      assert.deepEqual(applyLockedDay8ChoiceState(branch,checkin.id),{stage:1});branch=JSON.parse(JSON.stringify(branch));
      assert.deepEqual(getLockedDay8ResumePresentation(branch),{backgroundId:"neighborhood-street-day",characterId:null,expressionId:null,poseId:null});
      assert.deepEqual(applyLockedDay8ChoiceState(branch,purchase.id),{stage:2});branch=JSON.parse(JSON.stringify(branch));
      assert.deepEqual(getLockedDay8ResumePresentation(branch),{backgroundId:"day8-household-store-day",characterId:null,expressionId:null,poseId:null});
      assert.deepEqual(applyLockedDay8ChoiceState(branch,share.id),{stage:3});branch=JSON.parse(JSON.stringify(branch));
      assert.equal(getLockedDay8ResumePresentation(branch).characterId,"girlfriend");
      assert.equal(branch.storyFlags.day8CheckInStrategy,checkin.id);assert.equal(branch.storyFlags.day8PurchaseStrategy,purchase.id);assert.equal(branch.storyFlags.day8ShareStrategy,share.id);
      assert.deepEqual([branch.scenario.seojinAffection,branch.scenario.seojinStatusInterest],before,"Seojin axes remain isolated");
      assert.equal(new Set(branch.scenario.clues).size,branch.scenario.clues.length);assert.equal(new Set(branch.scenario.unlockedActions).size,branch.scenario.unlockedActions.length);assert.equal(new Set(branch.scenario.followUpHooks).size,branch.scenario.followUpHooks.length);
      assert.equal(validateScenarioState(branch.gameMode,branch.scenario),true);completePaths++;
    }
  }
}
assert.equal(completePaths,27,"DAY 8 three strategy axes");

for(const [key,value,required] of [["day7OpeningStrategy","date7_lead_first_leg","첫 이동"],["day7RecoveryStrategy","date7_return_now_reschedule","미룬 건 실패"],["day7MemoryStrategy","date7_record_two_sentences","멈춘 건 실패"]]){
  const callback=stateFor();callback.storyFlags[key]=value;
  assert.ok(JSON.stringify(getLockedDay8Segment(callback,0)).includes(required),`${key} callback`);
}
const low=stateFor(10);low.storyFlags.day8ShareStrategy="errand8_set_next_solo_boundary";
const high=stateFor(40);high.storyFlags.day8ShareStrategy="errand8_set_next_solo_boundary";
assert.ok(JSON.stringify(getLockedDay8Segment(low,3)).includes("연락하고 싶었지만 계약대로 기다렸어"));
assert.ok(JSON.stringify(getLockedDay8Segment(high,3)).includes("질문 순서도 네가 정해"));

const allText=JSON.stringify([0,1,2].flatMap(stage=>getLockedDay8Segment(state,stage)).concat(DAY8_SHARE_CHOICES.flatMap(item=>getLockedDay8Segment({...state,storyFlags:{...state.storyFlags,day8ShareStrategy:item.id}},3))));
for(const required of ["위치 공유 화면을 열지 않고","모르는 번호를 찍는 것보다","원래 휴대폰은 병원 보관","내가 안 따라가도 오늘이 보여","현재 정보부터 확인하고"])assert.ok(allText.includes(required),required);
for(const forbidden of ["가짜 하은","D-29","트럭 충돌","하은이 사고에 동승","의미심장한 미소","아무것도 아니야"])assert.ok(!allText.includes(forbidden),forbidden);

const day9Campaign={...stateFor(),day:9,partner:{heroineId:"haeun"}};
day9Campaign.storyHistory.push({day:8,sceneId:"m30-day8-independent-errand",choiceId:"errand8_explain_decision_log",response:"완료"});
assert.notEqual(selectNextStoryScene(day9Campaign)?.id,"ex-message","free-romance legacy stories must not leak after DAY 8");

const game=readFileSync(new URL("../game.js",import.meta.url),"utf8");
for(const pattern of [/LOCKED_DAY8_SCENE_ID/,/applyLockedDay8ChoiceState\(state,choiceId\)/,/getLockedDay8LegacyChoice\(state\)/,/day8Prompts/,/getLockedDay8ResumePresentation/,/Object\.hasOwn\(step,"characterId"\)/,/transition\.characterId===null/])assert.match(game,pattern);
console.log("✓ DAY 8 잠금 시나리오 8 Scene·27경로·DAY 7 콜백·솔로 화면·양축 보존·JSON 저장 복원 검증 통과");
