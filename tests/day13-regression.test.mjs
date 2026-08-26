import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { selectNextStoryScene } from "../src/story-manager.mjs";
import {
  applyLockedDay13ChoiceState,
  getLockedDay13ResumePresentation,
  getLockedDay13Segment
} from "../src/day13-campaign-runtime.mjs";

function makeState(mode=GAME_MODES.MARRIAGE_30){
  const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode});
  state.day=13;
  state.storyHistory=[{sceneId:"m30-day12-current-account-review",choiceId:"account12_access_read_only",day:12,response:"완료"}];
  state.storyFlags={
    day13CurrentHouseholdBudgetPending:true,
    day12VerifyStrategy:"account12_verify_support_call",
    day12ExpenseStrategy:"account12_expense_source_labels",
    day12AccessStrategy:"account12_access_separate_investment",
    day11ScheduleNoteMismatch:"unverified"
  };
  state.affection=39;
  state.trust=36;
  state.scenario.seojinAffection=9;
  state.scenario.seojinStatusInterest=16;
  state.scenario.featureUnlocks={finance:true};
  return state;
}

function roundTrip(state){
  const data=new Map();
  const storage={getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value),removeItem:key=>data.delete(key)};
  SaveManager.save(state,storage);
  return SaveManager.load(storage,GAME_MODES.MARRIAGE_30);
}

const invalidState=makeState();
const invalidSnapshot=structuredClone(invalidState);
assert.equal(applyLockedDay13ChoiceState(invalidState,"budget13_invalid_strategy"),null);
assert.deepEqual(invalidState,invalidSnapshot,"잘못된 선택은 DAY 13 상태를 바꾸면 안 된다");

const legacyState=makeState();
delete legacyState.storyFlags.day13RuntimeStage;
assert.equal(getLockedDay13Segment(legacyState).filter(step=>step.type==="choice").length,1);
assert.equal(getLockedDay13ResumePresentation(legacyState).backgroundId,"home-morning");

const state=makeState();
const protectedState={
  affection:state.affection,
  trust:state.trust,
  seojinAffection:state.scenario.seojinAffection,
  seojinStatusInterest:state.scenario.seojinStatusInterest,
  day12VerifyStrategy:state.storyFlags.day12VerifyStrategy,
  day12ExpenseStrategy:state.storyFlags.day12ExpenseStrategy,
  day12AccessStrategy:state.storyFlags.day12AccessStrategy,
  day11ScheduleNoteMismatch:state.storyFlags.day11ScheduleNoteMismatch
};
for(const [choiceId,stage,backgroundId] of [
  ["budget13_base_protected_buffer",1,"neighborhood-market-day"],
  ["budget13_contribution_capacity_review",2,"day2-home-entry"],
  ["budget13_review_weekly_changes",3,"home-morning"]
]){
  assert.deepEqual(applyLockedDay13ChoiceState(state,choiceId),{stage});
  assert.deepEqual(applyLockedDay13ChoiceState(state,choiceId),{stage},"같은 선택 재적용은 안전해야 한다");
  const restored=roundTrip(state);
  assert.ok(restored);
  Object.assign(state,restored);
  assert.equal(state.storyFlags.day13RuntimeStage,stage);
  assert.equal(getLockedDay13ResumePresentation(state).backgroundId,backgroundId);
}

for(const key of ["clues","unlockedActions","followUpHooks"]){
  assert.equal(new Set(state.scenario[key]).size,state.scenario[key].length,`${key} 중복 저장 금지`);
}
for(const choiceId of ["budget13_base_protected_buffer","budget13_contribution_capacity_review","budget13_review_weekly_changes"]){
  assert.equal(state.storyFlags[choiceId],true,`${choiceId} 선택 기억 누락`);
}
assert.deepEqual({
  affection:state.affection,
  trust:state.trust,
  seojinAffection:state.scenario.seojinAffection,
  seojinStatusInterest:state.scenario.seojinStatusInterest,
  day12VerifyStrategy:state.storyFlags.day12VerifyStrategy,
  day12ExpenseStrategy:state.storyFlags.day12ExpenseStrategy,
  day12AccessStrategy:state.storyFlags.day12AccessStrategy,
  day11ScheduleNoteMismatch:state.storyFlags.day11ScheduleNoteMismatch
},protectedState,"DAY 13 예산 전략은 관계 수치·서진 두 축·DAY 11/12 기억을 바꾸면 안 된다");
assert.equal(state.scenario.featureUnlocks.finance,true);
assert.equal(state.scenario.featureUnlocks.investment,undefined);
assert.equal(state.storyFlags.day13CurrentHouseholdBudgetCompleted,true);
assert.equal(state.storyFlags.day14CurrentChoiceSpendingPending,true);
assert.ok(state.scenario.clues.includes("current-household-budget-record"));
assert.ok(state.scenario.followUpHooks.includes("day14-current-choice-spending"));

state.day=14;
state.storyHistory.push({sceneId:"m30-day13-current-household-budget",choiceId:"budget13_review_weekly_changes",day:13,response:"완료"});
assert.equal(selectNextStoryScene(state)?.id,"m30-day14-current-choice-spending","DAY 13 완료 상태는 DAY 14로 도달해야 한다");

const freeState=makeState(GAME_MODES.FREE_ROMANCE);
assert.notEqual(selectNextStoryScene(freeState)?.id,"m30-day13-current-household-budget");

const playerText=JSON.stringify([0,1,2,3].flatMap(stage=>getLockedDay13Segment(state,stage)));
for(const forbidden of ["가짜 하은","진짜 하은","사고는 고의","범인","하은의 거짓말"]){
  assert.ok(!playerText.includes(forbidden),`DAY 13 조기 공개 금지: ${forbidden}`);
}

console.log("✓ DAY 13 무효·중복 선택·레거시/중간 저장·선택 기억·금융 경계·DAY 14 도달성 PASS");
