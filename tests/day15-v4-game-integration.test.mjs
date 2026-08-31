import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {applyDay15V4GameChoice,completeDay15V4GameChapter,getDay15V4Compatibility,getDay15V4GameResumePresentation,getDay15V4GameSegment,prepareDay15V4GameEntry} from "../src/day15-v4-game-bridge.mjs";

const fresh=(invitation="INVITED")=>({storyFlags:{
  day14V4Version:"NOTION_V4",day14V4Completed:true,day15GalleryPlanPending:true,
  day14V4ExhibitionInvitation:invitation,day14V4InteractionRoute:invitation==="INVITED"?"IN_PERSON":"FULL_REST",
  day14V4MeetingProposal:"WAIT_OWN_WORK",day14V4HaeunCallsLater:true
}});
const choose=(state,id)=>applyDay15V4GameChoice(state,id).steps;

test("new entry, resume and every attendance choice use the V4 game bridge",()=>{
  const state=fresh();
  assert.equal(prepareDay15V4GameEntry(state,{relationshipBand:"HIGH",haeunCallsTonight:true}).mode,"V4");
  assert.equal(getDay15V4GameResumePresentation(state).sceneNumber,1);
  assert.equal(getDay15V4GameSegment(state).at(-1).choiceNumber,1);
  for(const id of [
    "day15_v4_invitation_attend","day15_v4_outfit_comfort","day15_v4_gallery_ask",
    "day15_v4_view_ask_preference","day15_v4_rest_together","day15_v4_cafe_inner",
    "day15_v4_conflict_jealousy","day15_v4_reciprocity_admit_fear",
    "day15_v4_boundary_ask_haeun","day15_v4_perception_wavering_line","day15_v4_closing_listen"
  ])choose(state,id);
  assert.equal(state.storyFlags.day15V4PublicMaterialOffered,true);
  assert.equal(getDay15V4GameSegment(state).at(-1).choiceNumber,12);
  const ending=choose(state,"day15_v4_material_read_tomorrow");
  const cue=ending.at(-1);
  assert.deepEqual(cue,{type:"chapterCompletionCue",day:15,finalSceneReached:true});
  const sceneEnd={type:"sceneEnd",day:15,complete:true,nextHook:"day16-jihoon-contact-pending"};
  assert.deepEqual(completeDay15V4GameChapter(state,cue),sceneEnd);
  assert.deepEqual(completeDay15V4GameChapter(state,cue),sceneEnd);
  assert.equal(getDay15V4Compatibility(state).complete,true);
  assert.equal(prepareDay15V4GameEntry(state).complete,true);
  assert.deepEqual(getDay15V4GameSegment(state).at(-1),sceneEnd);
});

test("checkpoint 22 resume offers material once, while no-contact completes without inventing it",()=>{
  const attendance=fresh();prepareDay15V4GameEntry(attendance,{haeunCallsTonight:true});
  for(const id of ["day15_v4_invitation_attend","day15_v4_outfit_comfort","day15_v4_gallery_ask","day15_v4_view_ask_preference","day15_v4_rest_together","day15_v4_cafe_inner","day15_v4_conflict_jealousy","day15_v4_reciprocity_admit_fear","day15_v4_boundary_ask_haeun","day15_v4_perception_wavering_line","day15_v4_closing_listen"])choose(attendance,id);
  const restored=JSON.parse(JSON.stringify(attendance)),before=restored.storyFlags.day15V4SelectedChoiceIds.length;
  assert.equal(prepareDay15V4GameEntry(restored).mode,"V4");
  assert.equal(prepareDay15V4GameEntry(restored).mode,"V4");
  assert.equal(restored.storyFlags.day15V4SelectedChoiceIds.length,before);
  assert.equal(getDay15V4GameSegment(restored).at(-1).choiceNumber,12);

  const noContact=fresh("NOT_INVITED");prepareDay15V4GameEntry(noContact,{haeunCallsTonight:false});
  let ending;
  for(const id of ["day15_v4_invitation_no_invite","day15_v4_outfit_comfort","day15_v4_own_stop","day15_v4_own_rest","day15_v4_own_eat"])ending=choose(noContact,id);
  assert.equal(noContact.storyFlags.day15V4PublicMaterialOffered,false);
  assert.equal(ending.at(-1).type,"chapterCompletionCue");
  completeDay15V4GameChapter(noContact,ending.at(-1));
  assert.equal(getDay15V4Compatibility(noContact).complete,true);
});

test("legacy and blocked saves remain byte-for-byte unchanged",()=>{
  for(const state of [{storyFlags:{day15RuntimeStage:1,day15ActivityStrategy:"legacy"}},{storyFlags:{}}]){
    const before=JSON.stringify(state),mode=prepareDay15V4GameEntry(state).mode;
    assert.ok(["V1_LEGACY","BLOCKED_PREREQUISITE"].includes(mode));
    assert.equal(JSON.stringify(state),before);
  }
  assert.throws(()=>completeDay15V4GameChapter(fresh(),{type:"chapterCompletionCue",day:15,finalSceneReached:true}),/REQUIRES_V4/);
});

test("read APIs are pure and forged or early completion cues fail closed",()=>{
  const state=fresh();prepareDay15V4GameEntry(state,{haeunCallsTonight:true});
  const cue={type:"chapterCompletionCue",day:15,finalSceneReached:true};
  assert.throws(()=>completeDay15V4GameChapter(state,cue),/COMPLETION_STATE_INVALID/);
  const before=JSON.stringify(state);
  getDay15V4GameResumePresentation(state);
  getDay15V4GameSegment(state);
  assert.equal(JSON.stringify(state),before);
  choose(state,"day15_v4_invitation_attend");
  assert.throws(()=>applyDay15V4GameChoice(state,"day15_v4_invitation_attend"),/OPTION_UNAVAILABLE/);
});

test("game.js routes DAY 15 V4 entry, choice, resume, completion and legacy free action explicitly",()=>{
  const game=readFileSync(new URL("../game.js",import.meta.url),"utf8");
  assert.match(game,/prepareDay15V4GameEntry\(state,/);
  assert.match(game,/getDay15V4GameResumePresentation\(currentState\)/);
  assert.match(game,/getDay15V4GameSegment\(currentState\)/);
  assert.match(game,/applyDay15V4GameChoice\(state,choiceId\)/);
  assert.match(game,/completeDay15V4GameChapter\(state,step\)/);
  assert.match(game,/if\(step\.type==="choiceSelection"\)\{queueSceneStep\(0\);return;\}/);
  assert.match(game,/step\.type==="message"\?step\.sender:step\.speaker/);
  assert.match(game,/immersiveScene\?\.currentStep\?\.prompt\?\?prompt/);
  assert.match(game,/getDay15V4Compatibility\(state\)\.mode==="V1_LEGACY"&&state\.storyFlags\?\.day15RuntimeComplete/);
  assert.match(game,/day15PrivacyStrategy\|\|state\.storyFlags\?\.day15V4Completed/);
});
