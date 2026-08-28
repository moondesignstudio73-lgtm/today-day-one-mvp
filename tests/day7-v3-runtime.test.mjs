import assert from "node:assert/strict";
import {DAY7_V3_CHOICES} from "../src/day7-v3-campaign-data.mjs";
import {applyDay7V3Choice,beginDay7V3,getAvailableDay7V3ChoiceOptions,getDay7V3Compatibility,getDay7V3PlayableScene,getNextDay7V3Choice,resolveDay7V3HandContact,validateDay7V3Runtime} from "../src/day7-v3-runtime.mjs";

assert.equal(validateDay7V3Runtime(),true);
assert.deepEqual(getDay7V3Compatibility({storyFlags:{day7RuntimeComplete:true}}),{mode:"V1_LEGACY",complete:true,checkpoint:null});
assert.deepEqual(beginDay7V3({storyFlags:{day7RuntimeStage:2,day7OpeningStrategy:"date7_confirm_together"}}),{mode:"V1_LEGACY",complete:false,checkpoint:2});

const state={storyFlags:{day6V3HandContactEstablished:true,seojinStatusInterest:7}};
beginDay7V3(state,{relationshipBand:"HIGH"});
assert.equal(getNextDay7V3Choice(state).number,1);
assert.throws(()=>applyDay7V3Choice(state,"route-night-view"),/OUT_OF_ORDER/);
for(let index=0;index<5;index++)applyDay7V3Choice(state,DAY7_V3_CHOICES[index].options[0].id);
assert.equal(getAvailableDay7V3ChoiceOptions(state).length,2);
assert.throws(()=>applyDay7V3Choice(state,"admit-earlier-evasion"),/UNAVAILABLE_CONDITIONAL/);
applyDay7V3Choice(state,"talk-my-confusion");
for(let index=6;index<DAY7_V3_CHOICES.length;index++)applyDay7V3Choice(state,DAY7_V3_CHOICES[index].options[0].id);
assert.equal(state.storyFlags.day7V3Complete,true);
assert.equal(state.storyFlags.day7V3SceneCheckpoint,24);
assert.equal(state.storyFlags.day8JihoonInvitationPending,true);
assert.equal(state.storyFlags.day7V3HandOutcome,"REESTABLISHED");
assert.equal(state.storyFlags.seojinStatusInterest,7);
assert.equal(getNextDay7V3Choice(state),null);
assert.deepEqual(getDay7V3Compatibility(JSON.parse(JSON.stringify(state))),{mode:"V3",complete:true,checkpoint:24});

const repair={storyFlags:{}};beginDay7V3(repair,{relationshipBand:"MID"});
for(let index=0;index<3;index++)applyDay7V3Choice(repair,DAY7_V3_CHOICES[index].options[0].id);
applyDay7V3Choice(repair,"disclose-dismiss");applyDay7V3Choice(repair,"pace-haeun-first");
assert.equal(getAvailableDay7V3ChoiceOptions(repair).length,3);
applyDay7V3Choice(repair,"admit-earlier-evasion");

const lie={storyFlags:{}};beginDay7V3(lie,{relationshipBand:"HIGH"});
for(let index=0;index<8;index++)applyDay7V3Choice(lie,DAY7_V3_CHOICES[index].options[0].id);
applyDay7V3Choice(lie,"seojin-personal-interest");applyDay7V3Choice(lie,"claim-work-only");applyDay7V3Choice(lie,"contact-offer-hand");
assert.equal(lie.storyFlags.day7V3LieRecorded,true);assert.equal(lie.storyFlags.day7V3HandContactEstablished,false);
assert.equal(lie.storyFlags.day7V3SeojinAffectionDelta,1);assert.equal(lie.storyFlags.seojinStatusInterest,undefined);
assert.equal(resolveDay7V3HandContact({choiceId:"contact-offer-hand",relationshipBand:"LOW"}).outcome,"OFFERED_WITHOUT_CONTACT");
assert.equal(resolveDay7V3HandContact({choiceId:"contact-offer-hand",relationshipBand:"HIGH",touchBoundary:true}).outcome,"BOUNDARY_RESPECTED");
assert.equal(resolveDay7V3HandContact({choiceId:"contact-walk-beside",relationshipBand:"HIGH"}).established,false);
const playable=Array.from({length:24},(_,index)=>getDay7V3PlayableScene(state,index+1));
assert.equal(playable.filter(scene=>!scene.skipped).length,22);
assert.equal(playable[7].skipped,false);assert.equal(playable[8].skipped,true);assert.equal(playable[9].skipped,true);
const playedText=JSON.stringify(playable.filter(scene=>!scene.skipped));
for(const signature of ["아직 안 켜진 거.","그럼 매일 처음이겠다.","그건 너 얘기가 아니어서.","다음 회사 방문 때 이야기해요.","이번에는 안 물어볼게.","아까 불 켜지던 거. 기다려서 좋았어.","DAY 7 END"])assert.ok(playedText.includes(signature),signature);
assert.equal(playedText.includes("인형 흉내는 다음에"),false);
assert.throws(()=>getDay7V3PlayableScene({storyFlags:{}},1),/NOT_STARTED/);assert.throws(()=>getDay7V3PlayableScene(state,25),/UNKNOWN_SCENE/);
console.log("day7-v3-runtime.test: all assertions passed");
