import assert from "node:assert/strict";
import test from "node:test";
import {DAY6_V3_CHOICES} from "../src/day6-v3-campaign-data.mjs";
import {getDay6V3ChoiceContinuation,getDay6V3ImmersiveScene,getDay6V3ImmersiveSegment,validateDay6V3ImmersiveAdapter} from "../src/day6-v3-immersive-adapter.mjs";
import {applyDay6V3Choice,beginDay6V3} from "../src/day6-v3-runtime.mjs";

test("fresh DAY 6 V3 segment renders scene 1 and stops at its unresolved choice",()=>{
  const state={storyFlags:{}};
  beginDay6V3(state,{relationshipBand:"LOW"});
  const segment=getDay6V3ImmersiveSegment(state);
  assert.equal(segment.stopScene,1);
  assert.equal(segment.awaitingChoice,true);
  assert.equal(segment.steps[0].type,"transition");
  assert.equal(segment.steps.at(-1).choiceKey,"invitation");
  assert.match(segment.scenes[0].presentation.backgroundUrl,/assets\//);
});

test("selected choice reaction is rendered and the next explicit segment stops correctly",()=>{
  const state={storyFlags:{}};
  beginDay6V3(state,{relationshipBand:"MID"});
  applyDay6V3Choice(state,"date-call-it-date");
  const reaction=getDay6V3ImmersiveScene(state,1);
  assert.ok(reaction.steps.some(step=>step.text==="그 말 캡처함"));
  assert.equal(reaction.hasUnresolvedChoice,false);
  const next=getDay6V3ImmersiveSegment(state,{startScene:2});
  assert.equal(next.stopScene,2);
  assert.equal(next.steps.at(-1).choiceKey,"outfit");
  const continuation=getDay6V3ChoiceContinuation(state,1);
  assert.equal(continuation[0].text,"그 말 캡처함");
  assert.equal(continuation.at(-1).choiceKey,"outfit");
});

test("all 23 scenes retain presentation contracts and a completed run emits sceneEnd",()=>{
  const state={storyFlags:{}};
  beginDay6V3(state,{relationshipBand:"HIGH"});
  for(const choice of DAY6_V3_CHOICES)applyDay6V3Choice(state,choice.options[0].id);
  assert.equal(validateDay6V3ImmersiveAdapter(state),true);
  const ending=getDay6V3ImmersiveSegment(state,{startScene:23});
  assert.equal(ending.awaitingChoice,false);
  assert.equal(ending.steps.at(-1).type,"sceneEnd");
  assert.equal(ending.steps.at(-1).complete,true);
});

test("adapter exposes exactly eleven choices at their authored scenes",()=>{
  const state={storyFlags:{}};
  beginDay6V3(state,{relationshipBand:"VERY_HIGH"});
  const scenes=Array.from({length:23},(_,index)=>getDay6V3ImmersiveScene(state,index+1));
  assert.deepEqual(scenes.filter(scene=>scene.hasUnresolvedChoice).map(scene=>scene.sceneNumber),[1,2,4,7,10,12,15,16,18,20,22]);
});
