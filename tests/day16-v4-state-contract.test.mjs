import assert from "node:assert/strict";
import test from "node:test";
import {beginDay16V4,DAY16_V4_CHOICE_IDS,DAY16_V4_SCENARIO_ID,getDay16V4Compatibility,getDay16V4RestoreContract} from "../src/day16-v4-state-contract.mjs";

const freshState=(overrides={})=>({storyFlags:{day15V4Version:"NOTION_V4",day15V4Completed:true,day16JihoonContactHookPending:true,...overrides}});

test("fresh completed Day 15 V4 save starts Day 16 V4",()=>{
  const state=freshState({day15V4AttendanceRoute:"ATTEND",day15V4HaeunLeft:true,seojinAffection:4});
  assert.equal(getDay16V4Compatibility(state).mode,"V4_NEW");
  assert.equal(beginDay16V4(state).mode,"V4");
  assert.equal(state.storyFlags.day16V4ScenarioId,DAY16_V4_SCENARIO_ID);
  assert.equal(state.storyFlags.day16V4GenericYuriEventSuppressed,true);
  assert.equal(state.storyFlags.day16JihoonContactHookPending,true);
  assert.equal(state.storyFlags.seojinAffection,4);
});

test("initial V4 save round-trips without inferred knowledge",()=>{
  const state=freshState();beginDay16V4(state);
  const restored=JSON.parse(JSON.stringify(state)),contract=getDay16V4RestoreContract(restored);
  assert.equal(contract.mode,"V4");assert.equal(contract.dayRoute,null);assert.equal(contract.yuriNameKnown,false);
  assert.deepEqual(contract.knowledgeSources,{identity:"UNKNOWN",work:"UNKNOWN",jihoon:"UNKNOWN",breakupCause:"UNKNOWN"});
});

test("begin is idempotent",()=>{
  const state=freshState();beginDay16V4(state);state.storyFlags.day16V4MorningContact="NO_CONTACT";
  const before=JSON.stringify(state);assert.equal(beginDay16V4(state).mode,"V4");assert.equal(JSON.stringify(state),before);
});

test("legacy pending, progressed and completed saves remain V1 and unmodified",()=>{
  for(const flags of [{day16CurrentSocialCirclePending:true},{day16RuntimeStage:2,day16ContactStrategy:"MESSAGE"},{day16CurrentSocialCircleCompleted:true}]){
    const state={storyFlags:{...flags}},before=JSON.stringify(state);
    assert.equal(beginDay16V4(state).mode,"V1_LEGACY");assert.equal(JSON.stringify(state),before);
  }
});

test("mixed V1 and V4 state is corrupt",()=>{
  const state=freshState();beginDay16V4(state);state.storyFlags.day16RuntimeStage=1;
  const before=JSON.stringify(state);assert.equal(beginDay16V4(state).mode,"BLOCKED_CORRUPT");assert.equal(JSON.stringify(state),before);
});

test("partial V4 state and missing prerequisites fail closed",()=>{
  const partial=freshState({day16V4SceneCheckpoint:3}),before=JSON.stringify(partial);
  assert.equal(beginDay16V4(partial).mode,"BLOCKED_CORRUPT");assert.equal(JSON.stringify(partial),before);
  assert.equal(beginDay16V4({storyFlags:{}}).mode,"BLOCKED_PREREQUISITE");
});

test("home route cannot invent Yuri or Jihoon knowledge",()=>{
  const state=freshState();beginDay16V4(state);Object.assign(state.storyFlags,{day16V4DayRoute:"HOME",day16V4ChoiceIndex:8,day16V4SelectedChoiceIds:["day16_v4_time_home_rest","day16_v4_morning_no_contact","day16_v4_photo_current_first"],day16V4Choice1:"day16_v4_time_home_rest",day16V4Choice2:"day16_v4_morning_no_contact",day16V4Choice8:"day16_v4_photo_current_first"});
  assert.equal(getDay16V4Compatibility(state).mode,"V4");
  state.storyFlags.day16V4YuriNameKnown=true;state.storyFlags.day16V4YuriIdentitySource="DIRECTLY_TOLD_BY_YURI";
  assert.equal(getDay16V4Compatibility(state).mode,"BLOCKED_CORRUPT");
});

test("choice history rejects duplicates, out-of-order numbers and mirror mismatches",()=>{
  for(const mutate of [
    flags=>{flags.day16V4SelectedChoiceIds=["day16_v4_time_home_rest","day16_v4_time_solo_cafe"];flags.day16V4ChoiceIndex=1;},
    flags=>{flags.day16V4SelectedChoiceIds=["day16_v4_evening_disclose_yuri","day16_v4_photo_current_first"];flags.day16V4ChoiceIndex=8;},
    flags=>{flags.day16V4SelectedChoiceIds=["day16_v4_time_home_rest"];flags.day16V4ChoiceIndex=1;flags.day16V4Choice1="day16_v4_time_solo_cafe";}
  ]){const state=freshState();beginDay16V4(state);mutate(state.storyFlags);assert.equal(getDay16V4Compatibility(state).mode,"BLOCKED_CORRUPT");}
});

test("incomplete choice history must be a reachable active-choice prefix",()=>{
  const state=freshState();beginDay16V4(state);
  Object.assign(state.storyFlags,{day16V4MorningContact:"OWN_TIME",day16V4Choice2:"day16_v4_morning_own_time",day16V4SelectedChoiceIds:["day16_v4_morning_own_time"],day16V4ChoiceIndex:2});
  assert.equal(getDay16V4Compatibility(state).mode,"BLOCKED_CORRUPT");
});

test("unknown choice suffixes are corrupt instead of accepted by prefix",()=>{
  const state=freshState();beginDay16V4(state);Object.assign(state.storyFlags,{day16V4SelectedChoiceIds:["day16_v4_time_invented"],day16V4ChoiceIndex:1,day16V4Choice1:"day16_v4_time_invented"});
  assert.equal(getDay16V4Compatibility(state).mode,"BLOCKED_CORRUPT");
});

test("choice 9 IDs mirror the source's two common and three route-specific labels",()=>{
  for(const id of ["day16_v4_evening_disclose_yuri","day16_v4_evening_organize_then_tell","day16_v4_evening_jihoon_only","day16_v4_evening_solo_cafe","day16_v4_evening_home_rest"]){
    assert.equal(DAY16_V4_CHOICE_IDS.get(id),9);
  }
  for(const stale of ["day16_v4_evening_omit_yuri","day16_v4_evening_home_photos","day16_v4_evening_home_no_change"]){
    assert.equal(DAY16_V4_CHOICE_IDS.has(stale),false);
  }
});

test("contact and invitation implications are fail-closed",()=>{
  const state=freshState();beginDay16V4(state);state.storyFlags.day16V4YuriInvitation="ACCEPT_INTENT";
  assert.equal(getDay16V4Compatibility(state).mode,"BLOCKED_CORRUPT");
});

test("disclosing Yuri requires bounded Haeun knowledge",()=>{
  const state=freshState();beginDay16V4(state);
  Object.assign(state.storyFlags,{day16V4EveningDisclosure:"DISCLOSED_YURI",day16V4HaeunYuriKnowledge:"UNKNOWN"});
  assert.equal(getDay16V4Compatibility(state).mode,"BLOCKED_CORRUPT");
});

test("completed state requires scene 24, consumed Day 15 hook and Day 17 body hook",()=>{
  const state=freshState();beginDay16V4(state);state.storyFlags.day16V4Completed=true;
  assert.equal(getDay16V4Compatibility(state).mode,"BLOCKED_CORRUPT");
});

test("incomplete state cannot consume or emit adjacent-day hooks early",()=>{
  const state=freshState();beginDay16V4(state);state.storyFlags.day16V4Day17BodyHookPending=true;
  assert.equal(getDay16V4Compatibility(state).mode,"BLOCKED_CORRUPT");
});

test("a completed home route requires exactly choices 1, 2, 8 and 9",()=>{
  const state=freshState();beginDay16V4(state);Object.assign(state.storyFlags,{day16V4DayRoute:"HOME",day16V4MorningContact:"NO_CONTACT",day16V4SceneCheckpoint:24,day16V4ChoiceIndex:9,day16V4SelectedChoiceIds:["day16_v4_time_home_rest","day16_v4_morning_no_contact","day16_v4_photo_current_first","day16_v4_evening_home_rest"],day16V4Choice1:"day16_v4_time_home_rest",day16V4Choice2:"day16_v4_morning_no_contact",day16V4Choice8:"day16_v4_photo_current_first",day16V4Choice9:"day16_v4_evening_home_rest",day16V4Completed:true,day16V4Day17BodyHookPending:true,day16JihoonContactHookPending:false});
  assert.equal(getDay16V4Compatibility(state).mode,"V4");
  state.storyFlags.day16V4Choice3="day16_v4_greeting_talk";
  assert.equal(getDay16V4Compatibility(state).mode,"BLOCKED_CORRUPT");
});

test("knowledge sources require their actual encounter routes",()=>{
  const state=freshState();beginDay16V4(state);state.storyFlags.day16V4YuriWorkSource="DIRECTLY_TOLD_BY_YURI";
  assert.equal(getDay16V4Compatibility(state).mode,"BLOCKED_CORRUPT");
  const solo=freshState();beginDay16V4(solo);Object.assign(solo.storyFlags,{day16V4DayRoute:"SOLO_CAFE",day16V4YuriEncountered:true,day16V4JihoonYuriKnowledgeSource:"DIRECTLY_TOLD_BY_JIHOON"});
  assert.equal(getDay16V4Compatibility(solo).mode,"BLOCKED_CORRUPT");
});
