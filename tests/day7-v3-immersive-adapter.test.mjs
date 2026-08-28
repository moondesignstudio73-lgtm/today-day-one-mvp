import assert from "node:assert/strict";
import test from "node:test";
import {DAY7_V3_CHOICES} from "../src/day7-v3-campaign-data.mjs";
import {getDay7V3ChoiceContinuation,getDay7V3ImmersiveScene,getDay7V3ImmersiveSegment,validateDay7V3ImmersiveAdapter} from "../src/day7-v3-immersive-adapter.mjs";
import {applyDay7V3Choice,beginDay7V3} from "../src/day7-v3-runtime.mjs";

test("fresh segment reaches scene 2 and exposes only the photo consent choice",()=>{
  const state={storyFlags:{}};beginDay7V3(state,{relationshipBand:"LOW"});
  const segment=getDay7V3ImmersiveSegment(state);
  assert.equal(segment.stopScene,2);assert.equal(segment.awaitingChoice,true);
  assert.equal(segment.steps.at(-1).choiceKey,"photoReceipt");
  assert.ok(!segment.steps.some(step=>step.type==="cgShow"),"photo is hidden before consent");
});

test("route choice skips the two unselected route scenes and uses its real map",()=>{
  const state={storyFlags:{}};beginDay7V3(state,{relationshipBand:"MID"});
  applyDay7V3Choice(state,"photo-send-evening");applyDay7V3Choice(state,"route-theme-park");applyDay7V3Choice(state,"morning-rest");applyDay7V3Choice(state,"disclose-company-boundary");
  const segment=getDay7V3ImmersiveSegment(state,{startScene:7});
  assert.equal(segment.stopScene,9);assert.equal(segment.scenes.length,2);
  assert.equal(segment.scenes[1].presentation.backgroundId,"dream-castle");
  assert.equal(segment.steps.at(-1).choiceKey,"attentionPace");
});

test("event CGs respect knowledge and consent boundaries",()=>{
  const state={storyFlags:{}};beginDay7V3(state,{relationshipBand:"HIGH"});
  applyDay7V3Choice(state,"photo-decline");applyDay7V3Choice(state,"route-book-dinner");applyDay7V3Choice(state,"morning-song");applyDay7V3Choice(state,"disclose-photo");
  assert.ok(!getDay7V3ImmersiveScene(state,12).steps.some(step=>step.type==="cgShow"));
  assert.ok(getDay7V3ImmersiveScene(state,17).steps.some(step=>step.type==="cgShow"&&/card-front-back/.test(step.source??"")));
  assert.ok(getDay7V3ImmersiveScene(state,21).steps.some(step=>step.type==="cgShow"&&/hand-offer-consent/.test(step.source??"")));
});

test("completed run validates all scenes and emits DAY 8 hook",()=>{
  const state={storyFlags:{}};beginDay7V3(state,{relationshipBand:"HIGH"});
  for(const choice of DAY7_V3_CHOICES)applyDay7V3Choice(state,choice.options[0].id);
  assert.equal(validateDay7V3ImmersiveAdapter(state),true);
  const ending=getDay7V3ImmersiveSegment(state,{startScene:24});
  assert.equal(ending.steps.at(-1).type,"sceneEnd");assert.equal(ending.steps.at(-1).nextHook,"day8-jihoon-invitation");
  const continuation=getDay7V3ChoiceContinuation(state,11);
  assert.ok(continuation.some(step=>step.type==="sceneEnd"));
});
