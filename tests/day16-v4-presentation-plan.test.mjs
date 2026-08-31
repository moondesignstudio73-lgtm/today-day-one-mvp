import test from "node:test";
import assert from "node:assert/strict";
import {beginDay16V4} from "../src/day16-v4-state-contract.mjs";
import {applyDay16V4Choice,completeDay16V4} from "../src/day16-v4-runtime.mjs";
import {getDay16V4PresentationPlan,getDay16V4SceneEnvelope} from "../src/day16-v4-presentation-plan.mjs";

const fresh=()=>{const state={storyFlags:{day15V4Version:"NOTION_V4",day15V4Completed:true,day16JihoonContactHookPending:true}};beginDay16V4(state);return state;};
const choose=(state,id,context)=>applyDay16V4Choice(state,id,context);

test("new chapter stops at exact scene 1 choice without rendering a route superset",()=>{
  const state=fresh(),plan=getDay16V4PresentationPlan(state);
  assert.equal(plan.stopScene,1);assert.equal(plan.awaitingChoice,true);assert.equal(plan.scenes[0].unresolvedChoice.number,1);
  assert.equal(plan.scenes[0].sourceRole,"verbatim-authority; route-superset; not-directly-renderable");
  assert.equal("steps" in plan.scenes[0],false);
});

test("home path jumps from morning to scene 18 and exposes only truthful choice 9",()=>{
  const state=fresh();choose(state,"day16_v4_time_home_rest");let plan=getDay16V4PresentationPlan(state);
  assert.deepEqual(plan.scenes.map(scene=>scene.number),[2]);
  choose(state,"day16_v4_morning_own_time");plan=getDay16V4PresentationPlan(state);
  assert.deepEqual(plan.scenes.map(scene=>scene.number),[18]);assert.equal(plan.scenes[0].unresolvedChoice.number,8);
  choose(state,"day16_v4_photo_current_first");plan=getDay16V4PresentationPlan(state);
  assert.deepEqual(plan.scenes.map(scene=>scene.number),[19]);assert.deepEqual(plan.scenes[0].unresolvedChoice.options.map(option=>option.id),["day16_v4_evening_home_rest"]);
  choose(state,"day16_v4_evening_home_rest");plan=getDay16V4PresentationPlan(state);
  assert.deepEqual(plan.scenes.map(scene=>scene.number),[21,22,23,24]);assert.equal(plan.reachedFinal,true);assert.equal(plan.completionCue.type,"chapterCompletionCue");
  completeDay16V4(state,{finalSceneReached:true});plan=getDay16V4PresentationPlan(state);
  assert.equal(plan.sceneEnd.nextHook,"day17-body-check-pending");
});

test("greeting refusal joins scene 16 and never exposes choices 4 to 7",()=>{
  const state=fresh();choose(state,"day16_v4_time_solo_cafe");choose(state,"day16_v4_morning_own_time");let plan=getDay16V4PresentationPlan(state);
  assert.deepEqual(plan.scenes.map(scene=>scene.number),[3,4,5]);assert.equal(plan.scenes.at(-1).unresolvedChoice.number,3);
  choose(state,"day16_v4_greeting_overwhelmed");plan=getDay16V4PresentationPlan(state);
  assert.deepEqual(plan.scenes.map(scene=>scene.number),[16,17]);assert.equal(plan.scenes.at(-1).unresolvedChoice.number,8);
});

test("full route follows conditional disclosure, invitation and final-update gates",()=>{
  const state=fresh();
  for(const [id,context] of [["day16_v4_time_jihoon_short"],["day16_v4_morning_own_time"],["day16_v4_greeting_talk"],["day16_v4_past_as_much_as_yuri"],["day16_v4_starting_points_acknowledge"],["day16_v4_current_name_haeun",{haeunRelationshipActive:true}],["day16_v4_contact_ask_next",{yuriAcceptedContact:true}],["day16_v4_reflection_record_words"],["day16_v4_evening_disclose_yuri"],["day16_v4_intent_curious_not_restart"],["day16_v4_invite_answer_tomorrow"]])choose(state,id,context);
  const plan=getDay16V4PresentationPlan(state);
  assert.deepEqual(plan.scenes.map(scene=>scene.number),[23]);assert.equal(plan.scenes[0].unresolvedChoice.number,12);
  assert.equal(getDay16V4SceneEnvelope(state,20).variant,"JIHOON_CAFE");
});

test("plan rejects corrupt and skipped checkpoint cursors",()=>{
  const state=fresh();assert.throws(()=>getDay16V4PresentationPlan(state,{startScene:2}),/CHECKPOINT_MISMATCH/);
  const unreachable=fresh();choose(unreachable,"day16_v4_time_home_rest");choose(unreachable,"day16_v4_morning_own_time");unreachable.storyFlags.day16V4SceneCheckpoint=3;
  assert.throws(()=>getDay16V4PresentationPlan(unreachable),/CHECKPOINT_UNREACHABLE:3/);
  const corrupt=JSON.parse(JSON.stringify(state));corrupt.storyFlags.day16V4Choice2="day16_v4_morning_own_time";corrupt.storyFlags.day16V4SelectedChoiceIds=["day16_v4_morning_own_time"];corrupt.storyFlags.day16V4ChoiceIndex=2;
  assert.throws(()=>getDay16V4PresentationPlan(corrupt),/PRESENTATION_REQUIRES_V4:BLOCKED_CORRUPT/);
});
