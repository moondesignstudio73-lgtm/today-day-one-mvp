import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import test from "node:test";
import {DAY15_V4_PLAYABLE_SCRIPT_13_24,DAY15_V4_SOURCE_REGISTRY_13_24_META,RAW_DAY15_V4_SCRIPT_13_24,getDay15V4SourceScene13To24,isDay15V4Scene13To24Active,validateDay15V4PlayableScript13To24} from "../src/day15-v4-playable-script-13-24.mjs";

const state=flags=>({storyFlags:{day15V4AttendanceRoute:"ATTEND",day15V4HaeunContactRoute:"IN_PERSON",day15V4HaeunLeft:false,day15V4SelectedChoiceIds:[],...flags}});

test("SCENE 13-24 source registry preserves all later scenes and choices 8-12",()=>{
  assert.equal(validateDay15V4PlayableScript13To24(),true);assert.equal(DAY15_V4_PLAYABLE_SCRIPT_13_24.length,12);assert.equal(RAW_DAY15_V4_SCRIPT_13_24.length,8508);
  assert.equal(createHash("sha256").update(RAW_DAY15_V4_SCRIPT_13_24).digest("hex"),"ea39ac07f3e45fb61092b999720a1575c679c47791834e9d815ce4965cf02658");
  assert.deepEqual(DAY15_V4_SOURCE_REGISTRY_13_24_META,{role:"verbatim-route-superset",sourceLength:8508,sourceSha256:"ea39ac07f3e45fb61092b999720a1575c679c47791834e9d815ce4965cf02658",stepsRole:"unfiltered-source-steps",choiceOptionsAuthority:"day15-v4-campaign-data.mjs",runtimeStatus:"exact-route-resolved-adapter-connected"});
  assert.deepEqual(DAY15_V4_PLAYABLE_SCRIPT_13_24.map(scene=>scene.number),Array.from({length:12},(_,index)=>index+13));
  assert.deepEqual(DAY15_V4_PLAYABLE_SCRIPT_13_24.filter(scene=>scene.choiceNumber).map(scene=>scene.choiceNumber),[8,9,10,11,12]);
});

test("raw source keeps relationship boundaries, route variants, material consent and pending hook",()=>{
  for(const marker of ["매번 다른 사람은 덜 좋다고 말해야 하면","내 일정을 네 마음에 맞춰 없애자는 건 싫다고","오늘은 더 얘기하면 같은 말만 할 것 같아","걸음 중에 어깨가 잠깐 닿는다","바로 괜찮다고 하라는 뜻은 아니야","숙제 아니야","아침에 몸 보고 말해도 돼?","누가 빛나는지보다 자기가 무엇을 보는지"]){assert.match(RAW_DAY15_V4_SCRIPT_13_24,new RegExp(marker));}
  assert.doesNotMatch(RAW_DAY15_V4_SCRIPT_13_24,/# INTERNAL IMPLEMENTATION NOTES|가짜 하은|사고 원인/);
});

test("route activity never gives an absent caller gallery conversation or material offer",()=>{
  const noContact=state({day15V4AttendanceRoute:"OWN_AFTERNOON",day15V4HaeunContactRoute:"NO_CONTACT"});
  for(const number of [13,14,15,16,17,18,20,21,22])assert.equal(isDay15V4Scene13To24Active(noContact,number),false,`scene ${number}`);
  for(const number of [19,23,24])assert.equal(isDay15V4Scene13To24Active(noContact,number),true,`scene ${number}`);
  const phone=state({day15V4AttendanceRoute:"OWN_AFTERNOON",day15V4HaeunContactRoute:"PHONE"});assert.equal(isDay15V4Scene13To24Active(phone,18),true);assert.equal(isDay15V4Scene13To24Active(phone,17),false);assert.equal(isDay15V4Scene13To24Active(phone,22),false);
  phone.storyFlags.day15V4PublicMaterialOffered=true;assert.equal(isDay15V4Scene13To24Active(phone,22),true);
});

test("Haeun leaving preserves already-played source scenes and blocks only later contact",()=>{
  const left=state({day15V4HaeunLeft:true,day15V4HaeunContactRoute:"IN_PERSON",day15V4PublicMaterialOffered:true});
  for(const number of [13,14,15,16])assert.equal(isDay15V4Scene13To24Active(left,number),true,`scene ${number}`);
  for(const number of [17,18,20,21,22])assert.equal(isDay15V4Scene13To24Active(left,number),false,`scene ${number}`);
  assert.equal(isDay15V4Scene13To24Active(left,19),true);assert.equal(isDay15V4Scene13To24Active(left,23),true);assert.equal(isDay15V4Scene13To24Active(left,24),true);
  left.storyFlags.day15V4HaeunContactRoute="PHONE";assert.equal(isDay15V4Scene13To24Active(left,18),false);assert.equal(isDay15V4Scene13To24Active(left,19),true);
});

test("choice availability is derived from canonical selected choice IDs",()=>{
  const open=getDay15V4SourceScene13To24(state(),15);assert.equal(open.active,true);assert.equal(open.choiceAvailable,true);assert.equal(open.selectedChoiceId,null);
  const selected=getDay15V4SourceScene13To24(state({day15V4SelectedChoiceIds:["day15_v4_reciprocity_admit_fear"]}),15);assert.equal(selected.choiceAvailable,false);assert.equal(selected.selectedChoiceId,"day15_v4_reciprocity_admit_fear");
  const omitted=getDay15V4SourceScene13To24(state({day15V4HaeunContactRoute:"NO_CONTACT"}),15);assert.equal(omitted.active,false);assert.equal(omitted.choiceAvailable,false);
});

test("parsed scene data remains dense enough for runtime segmentation",()=>{
  const stepCount=DAY15_V4_PLAYABLE_SCRIPT_13_24.reduce((total,scene)=>total+scene.steps.length,0);assert.ok(stepCount>=150,`expected >=150 parsed steps, received ${stepCount}`);
  for(const scene of DAY15_V4_PLAYABLE_SCRIPT_13_24){assert.ok(scene.sourceMarkdown.length>180,`scene ${scene.number}`);assert.ok(scene.routeContract);}
});
