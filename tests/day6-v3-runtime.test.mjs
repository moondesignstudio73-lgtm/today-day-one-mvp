import assert from "node:assert/strict";
import {DAY6_V3_CHOICES} from "../src/day6-v3-campaign-data.mjs";
import {applyDay6V3Choice,beginDay6V3,getDay6V3Compatibility,getDay6V3PlayableScene,getNextDay6V3Choice,resolveDay6V3HandContact,validateDay6V3Runtime} from "../src/day6-v3-runtime.mjs";

assert.equal(validateDay6V3Runtime(),true);
assert.deepEqual(getDay6V3Compatibility({storyFlags:{day6RuntimeComplete:true}}),{mode:"V1_LEGACY",complete:true,checkpoint:null});
const state={storyFlags:{}};beginDay6V3(state,{relationshipBand:"MID"});
assert.equal(getNextDay6V3Choice(state).number,1);
assert.throws(()=>applyDay6V3Choice(state,"outfit-current-bright"),/OUT_OF_ORDER/);
for(const choice of DAY6_V3_CHOICES){const option=choice.key==="hand"?choice.options[1]:choice.options[0];applyDay6V3Choice(state,option.id);}
assert.equal(state.storyFlags.day6V3ChoiceIndex,11);assert.equal(state.storyFlags.day6V3SceneCheckpoint,23);assert.equal(state.storyFlags.day6V3Complete,true);
assert.equal(state.storyFlags.day6V3HandContactEstablished,true);assert.equal(state.storyFlags.day6V3HandOutcome,"ASKED_AND_ACCEPTED");
assert.equal(state.storyFlags.day7FirstPresentDatePending,true);
const restored=structuredClone(state);assert.equal(getDay6V3Compatibility(restored).complete,true);assert.equal(getNextDay6V3Choice(restored),null);
assert.deepEqual(resolveDay6V3HandContact({choiceId:"hand-offer",relationshipBand:"LOW"}),{established:false,outcome:"OFFERED_WITHOUT_CONTACT"});
assert.deepEqual(resolveDay6V3HandContact({choiceId:"hand-ask",relationshipBand:"HIGH",touchBoundary:true}),{established:false,outcome:"ASKED_AND_WAITED"});
assert.deepEqual(resolveDay6V3HandContact({choiceId:"hand-keep-walking",relationshipBand:"VERY_HIGH"}),{established:false,outcome:"WALK_TOGETHER"});
const fullText=Array.from({length:23},(_,index)=>getDay6V3PlayableScene(state,index+1).steps.map(step=>step.text).join("\n")).join("\n");
for(const signature of ["그 말 캡처함","오늘 질문 몇 개 준비했어?","나는 그 사람 흉내 내는 너랑 데이트하고 싶은 게 아니야.","사진은 연출, 맛은 실전.","나만 처음인 게 아니잖아.","네가 골랐다는 건 마음에 드는데.","나 때문에 웃은 거잖아.","내가 지금 잡고 싶어서.","그냥 궁금해서.","사진 찾았어요."]){assert.ok(fullText.includes(signature),signature);}
assert.equal(fullText.includes("가짜 하은"),false);
assert.throws(()=>getDay6V3PlayableScene({storyFlags:{}},1),/NOT_STARTED/);
assert.throws(()=>getDay6V3PlayableScene(state,24),/UNKNOWN_SCENE/);

const lowWalk={storyFlags:{}};beginDay6V3(lowWalk,{relationshipBand:"LOW"});
for(const choice of DAY6_V3_CHOICES){const option=choice.key==="hand"?choice.options[2]:choice.options[0];applyDay6V3Choice(lowWalk,option.id);}
const lowHandText=getDay6V3PlayableScene(lowWalk,20).steps.map(step=>step.text).join("\n");
assert.ok(lowHandText.includes("조금만 더 걸을까."));
assert.ok(lowHandText.includes("한 바퀴 더?"));
assert.equal(lowHandText.includes("내가 지금 잡고 싶어서."),false);
assert.ok(getDay6V3PlayableScene(lowWalk,23).steps.some(step=>step.text==="오늘 고마웠어."));
console.log("day6-v3-runtime.test: all assertions passed");
