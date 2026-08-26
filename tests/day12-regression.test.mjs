import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { selectNextStoryScene } from "../src/story-manager.mjs";
import {
  applyLockedDay12ChoiceState,
  getLockedDay12ResumePresentation,
  getLockedDay12Segment
} from "../src/day12-campaign-runtime.mjs";

function makeState(mode=GAME_MODES.MARRIAGE_30){
  const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode});
  state.day=12;
  state.storyHistory=[{sceneId:"m30-day11-current-life-plan",choiceId:"life11_share_separate_ownership",day:11,response:"완료"}];
  state.storyFlags={
    day12CurrentAccountReviewPending:true,
    day11AnchorStrategy:"life11_anchor_work",
    day11ConflictStrategy:"life11_conflict_buffer",
    day11ShareStrategy:"life11_share_separate_ownership",
    day11ScheduleNoteMismatch:"unverified"
  };
  state.affection=37;
  state.trust=35;
  state.scenario.seojinAffection=8;
  state.scenario.seojinStatusInterest=15;
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
assert.equal(applyLockedDay12ChoiceState(invalidState,"account12_invalid_strategy"),null);
assert.deepEqual(invalidState,invalidSnapshot,"잘못된 선택은 DAY 12 상태를 바꾸면 안 된다");

const legacyState=makeState();
delete legacyState.storyFlags.day12RuntimeStage;
assert.equal(getLockedDay12Segment(legacyState).filter(step=>step.type==="choice").length,1);
assert.equal(getLockedDay12ResumePresentation(legacyState).backgroundId,"home-morning");

const state=makeState();
const protectedState={
  affection:state.affection,
  trust:state.trust,
  seojinAffection:state.scenario.seojinAffection,
  seojinStatusInterest:state.scenario.seojinStatusInterest,
  day11AnchorStrategy:state.storyFlags.day11AnchorStrategy,
  day11ConflictStrategy:state.storyFlags.day11ConflictStrategy,
  day11ShareStrategy:state.storyFlags.day11ShareStrategy,
  day11ScheduleNoteMismatch:state.storyFlags.day11ScheduleNoteMismatch
};
for(const [choiceId,stage,backgroundId] of [
  ["account12_verify_support_call",1,"day2-home-entry"],
  ["account12_expense_shared_unconfirmed",2,"neighborhood-cafe-day"],
  ["account12_access_read_only",3,"home-morning"]
]){
  assert.deepEqual(applyLockedDay12ChoiceState(state,choiceId),{stage});
  assert.deepEqual(applyLockedDay12ChoiceState(state,choiceId),{stage},"같은 선택 재적용은 안전해야 한다");
  const restored=roundTrip(state);
  assert.ok(restored);
  Object.assign(state,restored);
  assert.equal(state.storyFlags.day12RuntimeStage,stage);
  assert.equal(getLockedDay12ResumePresentation(state).backgroundId,backgroundId);
}

for(const key of ["clues","unlockedActions","followUpHooks"]){
  assert.equal(new Set(state.scenario[key]).size,state.scenario[key].length,`${key} 중복 저장 금지`);
}
for(const choiceId of ["account12_verify_support_call","account12_expense_shared_unconfirmed","account12_access_read_only"]){
  assert.equal(state.storyFlags[choiceId],true,`${choiceId} 선택 기억 누락`);
}
assert.deepEqual({
  affection:state.affection,
  trust:state.trust,
  seojinAffection:state.scenario.seojinAffection,
  seojinStatusInterest:state.scenario.seojinStatusInterest,
  day11AnchorStrategy:state.storyFlags.day11AnchorStrategy,
  day11ConflictStrategy:state.storyFlags.day11ConflictStrategy,
  day11ShareStrategy:state.storyFlags.day11ShareStrategy,
  day11ScheduleNoteMismatch:state.storyFlags.day11ScheduleNoteMismatch
},protectedState,"DAY 12 금융 전략은 관계 수치·서진 두 축·DAY 11 기억을 바꾸면 안 된다");
assert.equal(state.scenario.featureUnlocks.finance,true);
assert.equal(state.scenario.featureUnlocks.investment,undefined);

state.day=13;
state.storyHistory.push({sceneId:"m30-day12-current-account-review",choiceId:"account12_access_read_only",day:12,response:"완료"});
assert.equal(selectNextStoryScene(state)?.id,"m30-day13-current-household-budget","DAY 12 완료 상태는 DAY 13으로 도달해야 한다");

const freeState=makeState(GAME_MODES.FREE_ROMANCE);
assert.notEqual(selectNextStoryScene(freeState)?.id,"m30-day12-current-account-review");

const playerText=JSON.stringify([0,1,2,3].flatMap(stage=>getLockedDay12Segment(state,stage)));
for(const forbidden of ["가짜 하은","진짜 하은","사고는 고의","범인","하은의 거짓말"]){
  assert.ok(!playerText.includes(forbidden),`DAY 12 조기 공개 금지: ${forbidden}`);
}

console.log("✓ DAY 12 잘못된 선택·중복 적용·레거시/중간 저장·선택 기억·금융 경계·DAY 13 도달성 PASS");
