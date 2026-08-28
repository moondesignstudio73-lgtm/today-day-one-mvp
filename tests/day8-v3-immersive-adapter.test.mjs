import test from "node:test";
import assert from "node:assert/strict";
import {DAY8_V3_CHOICES} from "../src/day8-v3-campaign-data.mjs";
import {getDay8V3ImmersiveScene,getDay8V3ImmersiveSegment,validateDay8V3ImmersiveAdapter} from "../src/day8-v3-immersive-adapter.mjs";
import {applyDay8V3Choice,beginDay8V3} from "../src/day8-v3-runtime.mjs";

test("fresh DAY 8 V3 segment stops at the first strategy choice",()=>{
  const state={storyFlags:{}};beginDay8V3(state,{relationshipBand:"MID"});
  const segment=getDay8V3ImmersiveSegment(state);
  assert.equal(segment.stopScene,1);assert.equal(segment.awaitingChoice,true);
  assert.equal(segment.steps.at(-1).choiceKey,"contactPlan");
  assert.ok(segment.steps.some(step=>step.type==="ambientHold"));
});

test("route and CG playback obey the stored afternoon state",()=>{
  const state={storyFlags:{}};beginDay8V3(state,{relationshipBand:"HIGH"});
  for(const choice of DAY8_V3_CHOICES.slice(0,6))applyDay8V3Choice(state,choice.options[0].id);
  const scene=getDay8V3ImmersiveScene(state,15);
  assert.match(scene.presentation.backgroundUrl,/live/i);
  assert.ok(scene.steps.some(step=>step.type==="cgShow"&&/live-house/.test(step.source??"")));
  assert.ok(!scene.steps.some(step=>step.characterId==="girlfriend"));
});

test("rest boundary skips S20-S22 and withholds tonight's clothing CG",()=>{
  const state={storyFlags:{}};beginDay8V3(state,{relationshipBand:"LOW"});
  const picks=DAY8_V3_CHOICES.slice(0,8).map(choice=>choice.options.at(-1).id);
  for(const id of picks)applyDay8V3Choice(state,id);
  applyDay8V3Choice(state,"late-rest-tomorrow");
  const segment=getDay8V3ImmersiveSegment(state,{startScene:20});
  assert.deepEqual(segment.scenes.map(scene=>scene.sceneNumber),[23,24]);
  assert.ok(!segment.steps.some(step=>step.type==="cgShow"&&/existing-clothes/.test(step.source??"")));
});

test("completed normal run validates all scenes and emits only the DAY 9 color hook",()=>{
  const state={storyFlags:{}};beginDay8V3(state,{relationshipBand:"HIGH"});
  for(const choice of DAY8_V3_CHOICES)applyDay8V3Choice(state,choice.options[0].id);
  assert.equal(validateDay8V3ImmersiveAdapter(state),true);
  const ending=getDay8V3ImmersiveSegment(state,{startScene:24});
  assert.equal(ending.steps.at(-1).type,"sceneEnd");assert.equal(ending.steps.at(-1).nextHook,"day9-clothing-color-invitation");
});
