import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { getLockedDay1Segment } from "../src/day1-campaign-runtime.mjs";
import { ACTIONS } from "../src/actions-data.mjs";
import {
  DAY1_HOSPITAL_ACTIONS, STORY_FEATURES, beginStoryFreeAction,
  completeStoryFreeAction, getStoryFeatureAvailability,
  getStoryFreeActionReport, resolveStoryFreeAction,
  validateStoryFreeActionData
} from "../src/story-free-action-manager.mjs";

const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}};
const create=()=>createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});

assert.equal(validateStoryFreeActionData(),true);
assert.equal(DAY1_HOSPITAL_ACTIONS.length,5);
assert.equal(STORY_FEATURES.length,5);
assert.ok(STORY_FEATURES.every(feature=>!getStoryFeatureAvailability(create(),feature.id).available));

const ending=getLockedDay1Segment(create(),2);
assert.equal(ending.filter(step=>step.type==="freeAction").length,1);
assert.ok(ending.findIndex(step=>step.type==="freeAction")<ending.findIndex(step=>step.type==="sceneEnd"));

for(const action of DAY1_HOSPITAL_ACTIONS){
  const state=create();
  const progress=beginStoryFreeAction(state);
  assert.equal(progress.location,"hospital");
  assert.equal(state.phase,2);
  const result=resolveStoryFreeAction(state,action.id,{random:()=>.99});
  assert.equal(result.status,"REPORT");
  assert.equal(result.used,1);
  assert.equal(state.storyFlags[action.flag],true);
  assert.ok(getStoryFreeActionReport(state).length>0);
  assert.equal(resolveStoryFreeAction(state,action.id),null);
  assert.equal(completeStoryFreeAction(state),true);
  assert.equal(completeStoryFreeAction(state),false);
  assert.equal(state.storyFlags.day1FreeActionComplete,true);
}

const recovery=create();beginStoryFreeAction(recovery);resolveStoryFreeAction(recovery,"rest-safely",{random:()=>.99});
assert.equal(recovery.storyFlags.recovery_focus,true);

const eventState=create();beginStoryFreeAction(eventState);
let roll=0;resolveStoryFreeAction(eventState,"observe-hospital-room",{random:()=>roll++===0?.1:0});
assert.equal(eventState.eventHistory.at(-1).category,"story-free-action");

const persisted=create();beginStoryFreeAction(persisted);resolveStoryFreeAction(persisted,"talk-with-haeun",{random:()=>.99});
const store=storage();SaveManager.save(persisted,store);const loaded=SaveManager.load(store);
assert.equal(loaded.storyFreeAction.chosenActionId,"talk-with-haeun");
assert.equal(loaded.storyFreeAction.status,"REPORT");

const freeState=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.FREE_ROMANCE});
assert.equal(freeState.scenario.enabled,false);
assert.ok(Object.keys(ACTIONS).length>0);
assert.equal(freeState.storyFreeAction,undefined);

console.log("✓ DAY 1 병원 자유행동, 제한 기능, 이벤트, 저장 복원, 중복 방지 검증 통과");
