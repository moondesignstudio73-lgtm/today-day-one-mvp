import assert from "node:assert/strict";
import {DAY11_V3_CHOICES} from "../src/day11-v3-campaign-data.mjs";
import {getDay11V3ChoiceContinuation,getDay11V3ImmersiveScene,getDay11V3ImmersiveSegment,getDay11V3ResumePresentation,validateDay11V3ImmersiveAdapter} from "../src/day11-v3-immersive-adapter.mjs";
import {applyDay11V3Choice,beginDay11V3} from "../src/day11-v3-runtime.mjs";

const makeState=()=>({affection:40,trust:40,storyFlags:{},scenario:{enabled:true,clues:[],unlockedActions:[],followUpHooks:[]}});
const attending=makeState();beginDay11V3(attending,{relationshipBand:"HIGH",haeunConsent:true,soraConsent:true,priorNaturalContact:true});
assert.equal(validateDay11V3ImmersiveAdapter(attending),true);
assert.equal(getDay11V3ImmersiveSegment(attending).stopScene,1);
assert.equal(getDay11V3ImmersiveSegment(attending).steps.at(-1).type,"choice");
for(const choice of DAY11_V3_CHOICES){
  const result=applyDay11V3Choice(attending,choice.options[0].id),continuation=getDay11V3ChoiceContinuation(attending,result.choiceNumber);
  assert.ok(continuation.length>0,`choice ${choice.number} continuation`);
}
const completed=getDay11V3ImmersiveSegment(attending,{startScene:24});
assert.equal(completed.steps.at(-1).type,"sceneEnd");assert.equal(completed.steps.at(-1).complete,true);
assert.equal(getDay11V3ResumePresentation(attending).backgroundId,"home-night");
const attendingCafeScene=getDay11V3ImmersiveScene(attending,16);
assert.equal(attendingCafeScene.steps.find(step=>step.type==="characterEnter").stage.positionPreset,"right");
const soraLayer=attendingCafeScene.steps.find(step=>step.type==="itemShow"&&step.characterId==="sora-day11");
assert.match(soraLayer.source,/sora-day11-cafe-casual-2d-v4\.png$/);
assert.equal(soraLayer.stage.positionPreset,"left");
assert.equal(getDay11V3ImmersiveScene(attending,19).steps.some(step=>step.type==="itemShow"&&step.source===null),true);

const declined=makeState();beginDay11V3(declined,{relationshipBand:"MID",haeunConsent:true,soraConsent:true});
applyDay11V3Choice(declined,"day11_leave_friends_alone");applyDay11V3Choice(declined,"day11_wear_personal_comfort");applyDay11V3Choice(declined,"day11_wait_without_purchase");
const nonAttendance=getDay11V3ImmersiveSegment(declined,{startScene:5});
assert.equal(nonAttendance.scenes.some(scene=>scene.number===6&&scene.hasUnresolvedChoice),false);
assert.equal(getDay11V3ImmersiveScene(declined,5).route,"NON_ATTENDANCE");
assert.equal(getDay11V3ImmersiveScene(declined,5).backgroundId,"small-cafe");
assert.equal(getDay11V3ImmersiveScene(declined,16).steps.some(step=>step.characterId==="sora-day11"),false);

const legacy={storyFlags:{day11RuntimeStage:1,day11AnchorStrategy:"health_first"}};
assert.equal(getDay11V3ResumePresentation(legacy).backgroundId,"home-morning");
console.log("day11-v3-immersive-adapter.test: all assertions passed");
