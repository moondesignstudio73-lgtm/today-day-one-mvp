import test from "node:test";
import assert from "node:assert/strict";
import {beginDay16V4} from "../src/day16-v4-state-contract.mjs";
import {applyDay16V4Choice} from "../src/day16-v4-runtime.mjs";
import {composeDay16V4Continuation} from "../src/day16-v4-continuation.mjs";

const fresh=()=>{const state={storyFlags:{day15V4Version:"NOTION_V4",day15V4Completed:true,day16JihoonContactHookPending:true}};beginDay16V4(state);return state;};
const choose=(state,id,context)=>applyDay16V4Choice(state,id,context);
const reactionText=value=>value.reaction.steps.map(step=>step.text).join("\n");
const sceneNumbers=value=>value.plan.scenes.map(scene=>scene.number);

test("choice 1 continuation orders its exact reaction before the scene 2 envelope",()=>{
  const state=fresh();choose(state,"day16_v4_time_solo_cafe");
  const value=composeDay16V4Continuation(state,{afterChoiceNumber:1});
  assert.match(reactionText(value),/마주쳐도 내 몫 주문 안 해 놔/);
  assert.deepEqual(sceneNumbers(value),[2]);assert.equal(value.plan.awaitingChoice,true);
  assert.deepEqual(value.sequence.map(item=>[item.type,item.sceneNumber]),[["choiceReaction",1],["sceneEnvelope",2]]);
  assert.equal(value.sequence[0].steps,value.reaction.steps);assert.equal(value.sequence[1].envelope,value.plan.scenes[0]);
  assert.match(value.sequenceRole,/render-envelope-playerFacingSteps-only/);
  assert.equal(value.sequence[1].envelope.playerFacingSteps,value.plan.scenes[0].playerFacingSteps);
});

test("greeting-only route jumps from the exact scene 5 reaction to scenes 16 and 17",()=>{
  const state=fresh();for(const id of ["day16_v4_time_solo_cafe","day16_v4_morning_own_time","day16_v4_greeting_overwhelmed"])choose(state,id);
  const value=composeDay16V4Continuation(state,{afterChoiceNumber:3});
  assert.match(reactionText(value),/그런 뜻으로 안 들을게/);assert.deepEqual(sceneNumbers(value),[16,17]);
  assert.equal(value.plan.scenes.at(-1).unresolvedChoice.number,8);
  assert.equal(sceneNumbers(value).some(number=>number>=6&&number<=15),false);
});

test("accepted contact reaction remains before the shared scene 16 continuation",()=>{
  const state=fresh();
  for(const [id,context] of [["day16_v4_time_solo_cafe"],["day16_v4_morning_own_time"],["day16_v4_greeting_talk"],["day16_v4_past_not_today"],["day16_v4_starting_points_difficult"],["day16_v4_current_return_to_book"],["day16_v4_contact_ask_next",{yuriAcceptedContact:true}]])choose(state,id,context);
  const value=composeDay16V4Continuation(state,{afterChoiceNumber:7});
  assert.match(reactionText(value),/둘은 연락 방법을 나눈다/);assert.equal(value.plan.startScene,16);assert.equal(value.plan.stopScene,17);
  assert.deepEqual(value.sequence.map(item=>[item.type,item.sceneNumber]),[["choiceReaction",15],["sceneEnvelope",16],["sceneEnvelope",17]]);
});

test("home route projects only the home choice 8 reaction before scene 19",()=>{
  const state=fresh();for(const id of ["day16_v4_time_home_rest","day16_v4_morning_own_time","day16_v4_photo_current_first"])choose(state,id);
  const value=composeDay16V4Continuation(state,{afterChoiceNumber:8});
  assert.equal(reactionText(value),"오늘 사진을 모으면 익숙한 얼굴이 아니라 자기가 본 장소가 먼저 눈에 들어온다.");
  assert.deepEqual(sceneNumbers(value),[19]);assert.equal(value.plan.scenes[0].unresolvedChoice.number,9);
});

test("home choice 9 reaction leads through the exact reachable ending envelopes",()=>{
  const state=fresh();for(const id of ["day16_v4_time_home_rest","day16_v4_morning_own_time","day16_v4_photo_current_first","day16_v4_evening_home_rest"])choose(state,id);
  const value=composeDay16V4Continuation(state,{afterChoiceNumber:9});
  assert.match(reactionText(value),/오늘 사진 보다가 좀 이상했어/);assert.doesNotMatch(reactionText(value),/유리/);
  assert.deepEqual(sceneNumbers(value),[21,22,23,24]);assert.equal(value.plan.reachedFinal,true);assert.equal(value.plan.completionCue.type,"chapterCompletionCue");
});

test("an undisclosed cafe evening skips unauthorised scene 21 prose",()=>{
  const state=fresh();for(const id of ["day16_v4_time_solo_cafe","day16_v4_morning_own_time","day16_v4_greeting_overwhelmed","day16_v4_reflection_eat_first","day16_v4_evening_solo_cafe"])choose(state,id);
  const value=composeDay16V4Continuation(state,{afterChoiceNumber:9});
  assert.equal(value.checkpoint,22);assert.deepEqual(sceneNumbers(value),[22,23,24]);
});

test("an older selected choice cannot be replayed after state has advanced",()=>{
  const state=fresh();choose(state,"day16_v4_time_solo_cafe");choose(state,"day16_v4_morning_own_time");
  assert.throws(()=>composeDay16V4Continuation(state,{afterChoiceNumber:1}),/CONTINUATION_NOT_LATEST_CHOICE:1:2/);
});

test("a forged checkpoint fails before any continuation is emitted",()=>{
  const state=fresh();choose(state,"day16_v4_time_solo_cafe");state.storyFlags.day16V4SceneCheckpoint=3;
  assert.throws(()=>composeDay16V4Continuation(state,{afterChoiceNumber:1}),/CONTINUATION_REQUIRES_V4:BLOCKED_CORRUPT|CONTINUATION_CHECKPOINT_MISMATCH/);
});

test("caller context cannot override the validated checkpoint",()=>{
  const state=fresh();choose(state,"day16_v4_time_solo_cafe");
  const value=composeDay16V4Continuation(state,{afterChoiceNumber:1,startScene:5});
  assert.equal(value.checkpoint,2);assert.equal(value.plan.startScene,2);
  assert.deepEqual(sceneNumbers(value),[2]);
});

test("the missing ended-relationship source variant still fails closed",()=>{
  const state=fresh();for(const id of ["day16_v4_time_solo_cafe","day16_v4_morning_own_time","day16_v4_greeting_talk","day16_v4_past_not_today","day16_v4_starting_points_difficult"])choose(state,id);
  choose(state,"day16_v4_current_name_haeun",{haeunRelationshipActive:false});
  assert.throws(()=>composeDay16V4Continuation(state,{afterChoiceNumber:6}),/SOURCE_VARIANT_UNAVAILABLE:CHOICE6_ENDED_RELATIONSHIP/);
});
