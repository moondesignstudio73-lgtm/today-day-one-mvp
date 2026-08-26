import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { selectNextStoryScene } from "../src/story-manager.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import {
  applyLockedDay11ChoiceState,
  getLockedDay11ResumePresentation,
  getLockedDay11Segment
} from "../src/day11-campaign-runtime.mjs";

function makeState(mode=GAME_MODES.MARRIAGE_30){
  const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode});
  state.day=11;
  state.storyHistory=[{sceneId:"m30-day10-three-hour-work-rhythm",choiceId:"work10_debrief_separate_scores",day:10,response:"완료"}];
  state.storyFlags={day11CurrentLifePlanPending:true};
  state.affection=38;
  state.trust=35;
  state.scenario.seojinAffection=8;
  state.scenario.seojinStatusInterest=14;
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
assert.equal(applyLockedDay11ChoiceState(invalidState,"life11_invalid_strategy"),null);
assert.deepEqual(invalidState,invalidSnapshot,"잘못된 선택은 DAY 11 상태를 바꾸면 안 된다");

const legacyState=makeState();
delete legacyState.storyFlags.day11RuntimeStage;
assert.equal(getLockedDay11Segment(legacyState).filter(step=>step.type==="choice").length,1);
assert.equal(getLockedDay11ResumePresentation(legacyState).backgroundId,"home-morning");

const state=makeState();
const protectedState={
  affection:state.affection,
  trust:state.trust,
  seojinAffection:state.scenario.seojinAffection,
  seojinStatusInterest:state.scenario.seojinStatusInterest
};
for(const [choiceId,stage,backgroundId] of [
  ["life11_anchor_recovery",1,"neighborhood-street-day"],
  ["life11_conflict_owner_decides",2,"neighborhood-park-day"],
  ["life11_share_changes_only",3,"home-morning"]
]){
  assert.deepEqual(applyLockedDay11ChoiceState(state,choiceId),{stage});
  assert.deepEqual(applyLockedDay11ChoiceState(state,choiceId),{stage},"같은 선택 재적용은 안전해야 한다");
  const restored=roundTrip(state);
  assert.ok(restored);
  Object.assign(state,restored);
  assert.equal(state.storyFlags.day11RuntimeStage,stage);
  assert.equal(getLockedDay11ResumePresentation(state).backgroundId,backgroundId);
}

for(const key of ["clues","unlockedActions","followUpHooks"]){
  assert.equal(new Set(state.scenario[key]).size,state.scenario[key].length,`${key} 중복 저장 금지`);
}
for(const choiceId of ["life11_anchor_recovery","life11_conflict_owner_decides","life11_share_changes_only"]){
  assert.equal(state.storyFlags[choiceId],true,`${choiceId} 선택 기억 누락`);
}
assert.equal(state.storyFlags.day11ScheduleNoteMismatch,"unverified");
assert.ok(state.scenario.clues.includes("day11-schedule-note-mismatch"));
assert.deepEqual({
  affection:state.affection,
  trust:state.trust,
  seojinAffection:state.scenario.seojinAffection,
  seojinStatusInterest:state.scenario.seojinStatusInterest
},protectedState,"DAY 11 생활 전략은 관계 수치나 서진의 두 축을 암묵적으로 바꾸면 안 된다");

state.day=12;
state.storyHistory.push({sceneId:"m30-day11-current-life-plan",choiceId:"life11_share_changes_only",day:11,response:"완료"});
assert.equal(selectNextStoryScene(state)?.id,"m30-day12-current-account-review","DAY 11 완료 상태는 DAY 12로 도달해야 한다");

const freeState=makeState(GAME_MODES.FREE_ROMANCE);
assert.notEqual(selectNextStoryScene(freeState)?.id,"m30-day11-current-life-plan");

const playerText=JSON.stringify([0,1,2,3].flatMap(stage=>getLockedDay11Segment(state,stage)));
for(const forbidden of ["가짜 하은","진짜 하은","사고는 고의","범인","하은의 거짓말"]){
  assert.ok(!playerText.includes(forbidden),`DAY 11 조기 공개 금지: ${forbidden}`);
}

console.log("✓ DAY 11 잘못된 선택·중복 적용·레거시/중간 저장·선택 기억·미확인 단서·DAY 12 도달성 PASS");
