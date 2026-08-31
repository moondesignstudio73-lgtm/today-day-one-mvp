import assert from "node:assert/strict";
import test from "node:test";
import {DAY15_V4_CHOICES,DAY15_V4_SCENARIO_ID,DAY15_V4_SCENES} from "../src/day15-v4-campaign-data.mjs";
import {beginDay15V4,getDay15V4Compatibility,getDay15V4RestoreContract,isDay15V4ShoulderContactEligible} from "../src/day15-v4-state-contract.mjs";

const newState=(invitation="INVITED",overrides={})=>({storyFlags:{day14V4Version:"NOTION_V4",day14V4Completed:true,day15GalleryPlanPending:true,day14V4ExhibitionInvitation:invitation,day14V4InteractionRoute:"IN_PERSON",day14V4MeetingProposal:"SIT_WITHOUT_DEMAND",day14V4UnresolvedContactBoundary:false,...overrides}});

test("Notion V4 data keeps all 24 scenes and 12 choice contracts",()=>{
  assert.equal(DAY15_V4_SCENES.length,24);assert.equal(DAY15_V4_CHOICES.length,12);
  assert.deepEqual(DAY15_V4_SCENES.map(scene=>scene.number),Array.from({length:24},(_,index)=>index+1));
  assert.equal(DAY15_V4_CHOICES[0].options[0].label,"나도 보고 싶어. 두 시에 갈게.");
  assert.equal(DAY15_V4_CHOICES[2].variants.ownAfternoonOptions[0].label,"한 번만 더 읽어 보자.");
  assert.equal(DAY15_V4_CHOICES[11].options[2].label,"오늘은 좀 피곤해. 내일 읽어도 돼?");
});

test("fresh invited Day 15 starts V4 from actual Day 14 state",()=>{
  const state=newState("INVITED",{day12V3PersonalInvitation:true,day13V3AraMet:true,day13V3AraContinuation:"ASK_PHOTO_CONTACT",seojinAffection:7,seojinStatusInterest:2});
  assert.equal(getDay15V4Compatibility(state).mode,"V4_NEW");
  const before=[state.storyFlags.seojinAffection,state.storyFlags.seojinStatusInterest];
  assert.equal(beginDay15V4(state,{relationshipBand:"VERY_HIGH"}).mode,"V4");
  assert.equal(state.storyFlags.day15V4ScenarioId,DAY15_V4_SCENARIO_ID);assert.equal(state.storyFlags.day15V4GalleryInvitation,"INVITED");assert.equal(state.storyFlags.day15V4RelationshipBand,"HIGH");
  assert.equal(state.storyFlags.day15V4Day14CallbackRoute,"TALKED_TOGETHER");assert.equal(state.storyFlags.day15V4SeojinCallbackAvailable,true);assert.equal(state.storyFlags.day15V4AraCallbackAvailable,true);
  assert.deepEqual([state.storyFlags.seojinAffection,state.storyFlags.seojinStatusInterest],before);
});

test("fresh not-invited route starts without inventing gallery knowledge",()=>{
  const state=newState("NOT_INVITED",{day11V3SiwooNameKnown:false,day14V4InteractionRoute:"FULL_REST"});
  assert.equal(beginDay15V4(state).mode,"V4");
  const restore=getDay15V4RestoreContract(state);assert.equal(restore.galleryInvitation,"NOT_INVITED");assert.equal(restore.day14CallbackRoute,"RESTED_SEPARATELY");
  assert.ok(Object.values(restore.knowledgeSources).every(value=>value==="UNKNOWN"));
});

test("Day 14 pressure takes callback priority",()=>{
  const state=newState("INVITED",{day14V4MeetingProposal:"SHOW_PREPARED",day14V4InteractionRoute:"PHONE"});beginDay15V4(state);assert.equal(state.storyFlags.day15V4Day14CallbackRoute,"PRESSURED");
});

test("legacy pending, progressed and completed saves remain V1 and unmodified",()=>{
  for(const flags of [{day15CurrentLeisureDatePending:true},{day15RuntimeStage:2,day15ActivityStrategy:"CAFE"},{day15CurrentLeisureDateCompleted:true}]){
    const state={storyFlags:{...flags}},before=JSON.stringify(state);assert.equal(beginDay15V4(state).mode,"V1_LEGACY");assert.equal(JSON.stringify(state),before);
  }
});

test("mixed legacy and V4 state is blocked without mutation",()=>{
  const state=newState();beginDay15V4(state);state.storyFlags.day15RuntimeStage=2;const before=JSON.stringify(state);
  assert.equal(getDay15V4Compatibility(state).mode,"BLOCKED_CORRUPT");assert.equal(beginDay15V4(state).mode,"BLOCKED_CORRUPT");assert.equal(JSON.stringify(state),before);
});

test("missing or unresolved prerequisites are blocked",()=>{
  assert.equal(beginDay15V4({storyFlags:{}}).mode,"BLOCKED_PREREQUISITE");assert.equal(beginDay15V4(newState("INVITED",{day14V4InteractionRoute:"UNKNOWN"})).mode,"BLOCKED_PREREQUISITE");
});

test("initial V4 state survives JSON save and restore",()=>{
  const state=newState();beginDay15V4(state,{relationshipBand:"MID",haeunCallsTonight:true});const restored=JSON.parse(JSON.stringify(state));
  assert.equal(getDay15V4Compatibility(restored).mode,"V4");assert.deepEqual(getDay15V4RestoreContract(restored).selectedChoiceIds,[]);
});

test("begin is idempotent and never rewrites an existing V4 session",()=>{
  const state=newState();beginDay15V4(state,{relationshipBand:"HIGH",haeunCallsTonight:true});
  state.storyFlags.day15V4AttendanceRoute="ATTEND";const before=JSON.stringify(state);
  assert.equal(beginDay15V4(state,{relationshipBand:"LOW",haeunCallsTonight:false}).mode,"V4");assert.equal(JSON.stringify(state),before);
});

test("any partial day15V4 namespace is corrupt instead of silently initialized",()=>{
  const state=newState();state.storyFlags.day15V4SceneCheckpoint=3;const before=JSON.stringify(state);
  assert.equal(beginDay15V4(state).mode,"BLOCKED_CORRUPT");assert.equal(JSON.stringify(state),before);
});

test("contact eligibility requires prior contact, resolved boundary and close return walk",()=>{
  const base={day14V4HandContactEstablished:true,day15V4BoundaryResolved:true,day15V4HaeunLeft:false,day15V4ReturnWalk:"CLOSE_PACE"};assert.equal(isDay15V4ShoulderContactEligible(base),true);
  assert.equal(isDay15V4ShoulderContactEligible({...base,day13V3HaeunNeedsSpace:true}),false);assert.equal(isDay15V4ShoulderContactEligible({...base,day15V4ReturnWalk:"DISTANT_PACE"}),false);
});

test("invalid public material implications are corrupt",()=>{
  const state=newState();beginDay15V4(state);state.storyFlags.day15V4PublicMaterialAccepted=true;assert.equal(getDay15V4Compatibility(state).mode,"BLOCKED_CORRUPT");
});

test("own-afternoon no-contact saves cannot invent direct knowledge, while attendance can preserve observation",()=>{
  const state=newState();beginDay15V4(state);state.storyFlags.day15V4AttendanceRoute="OWN_AFTERNOON";state.storyFlags.day15V4HaeunContactRoute="NO_CONTACT";state.storyFlags.day15V4SiwooRoleSource="DIRECTLY_OBSERVED";assert.equal(getDay15V4Compatibility(state).mode,"BLOCKED_CORRUPT");
  state.storyFlags.day15V4AttendanceRoute="ATTEND";assert.equal(getDay15V4Compatibility(state).mode,"V4");
});

test("unknown, duplicate and out-of-order choice histories are corrupt",()=>{
  for(const [ids,index] of [[["missing"],1],[["day15_v4_outfit_comfort","day15_v4_invitation_attend"],1],[["day15_v4_invitation_attend","day15_v4_invitation_own_time"],1]]){
    const state=newState();beginDay15V4(state);state.storyFlags.day15V4SelectedChoiceIds=ids;state.storyFlags.day15V4ChoiceIndex=index;assert.equal(getDay15V4Compatibility(state).mode,"BLOCKED_CORRUPT");
  }
});
