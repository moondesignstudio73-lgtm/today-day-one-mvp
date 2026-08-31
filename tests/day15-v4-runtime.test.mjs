import assert from "node:assert/strict";
import test from "node:test";
import {beginDay15V4,getDay15V4Compatibility,getDay15V4RestoreContract} from "../src/day15-v4-state-contract.mjs";
import {applyDay15V4Choice,completeDay15V4,getDay15V4ActiveChoiceNumbers,getNextDay15V4Choice,offerDay15V4PublicMaterial} from "../src/day15-v4-runtime.mjs";

const newState=(invitation="INVITED",overrides={})=>({storyFlags:{day14V4Version:"NOTION_V4",day14V4Completed:true,day15GalleryPlanPending:true,day14V4ExhibitionInvitation:invitation,day14V4InteractionRoute:"IN_PERSON",day14V4MeetingProposal:"SIT_WITHOUT_DEMAND",day14V4UnresolvedContactBoundary:false,day14V4HandContactEstablished:true,seojinAffection:7,seojinStatusInterest:2,...overrides}});
const choose=(state,...ids)=>ids.forEach(id=>applyDay15V4Choice(state,id));

test("attending route preserves independent Seojin axes, resolves all choices and restores",()=>{
  const state=newState("INVITED",{day11V3SiwooNameKnown:true});beginDay15V4(state,{relationshipBand:"HIGH"});
  choose(state,"day15_v4_invitation_attend","day15_v4_outfit_comfort","day15_v4_gallery_ask","day15_v4_view_ask_preference","day15_v4_rest_together","day15_v4_cafe_inner","day15_v4_conflict_jealousy","day15_v4_reciprocity_admit_fear","day15_v4_boundary_ask_haeun","day15_v4_perception_wavering_line","day15_v4_closing_listen");
  assert.equal(getNextDay15V4Choice(state),null);
  assert.equal(state.storyFlags.day15V4SiwooNameSource,"PRIOR_DAY11");
  assert.equal(state.storyFlags.day15V4SiwooAppearanceSource,"DIRECTLY_OBSERVED");
  assert.equal(state.storyFlags.day15V4ReturnWalk,"CLOSE_PACE");
  assert.equal(state.storyFlags.day15V4ShoulderContactOccurred,true);
  offerDay15V4PublicMaterial(state);
  assert.equal(getNextDay15V4Choice(state).number,12);
  const offeredCheckpoint=state.storyFlags.day15V4SceneCheckpoint;offerDay15V4PublicMaterial(state);assert.equal(state.storyFlags.day15V4SceneCheckpoint,offeredCheckpoint);
  choose(state,"day15_v4_material_request_public");
  assert.throws(()=>completeDay15V4(state),/FINAL_SCENE_NOT_REACHED/);
  completeDay15V4(state,{finalSceneReached:true});
  assert.deepEqual([state.storyFlags.seojinAffection,state.storyFlags.seojinStatusInterest],[7,2]);
  assert.equal(state.storyFlags.day16JihoonContactHookPending,true);
  const restored=JSON.parse(JSON.stringify(state));
  assert.equal(getDay15V4Compatibility(restored).complete,true);
  assert.equal(getDay15V4RestoreContract(restored).selectedChoiceIds.length,12);
});

test("not-invited no-contact route ends after choice 5 without invented knowledge",()=>{
  const state=newState("NOT_INVITED");beginDay15V4(state);
  choose(state,"day15_v4_invitation_no_invite","day15_v4_outfit_comfort","day15_v4_own_stop","day15_v4_own_rest","day15_v4_own_eat");
  assert.deepEqual(getDay15V4ActiveChoiceNumbers(state),[1,2,3,4,5]);
  assert.equal(state.storyFlags.day15V4HaeunContactRoute,"NO_CONTACT");
  assert.equal(state.storyFlags.day15V4SiwooProfessionalBehaviorSource,"UNKNOWN");
  completeDay15V4(state,{finalSceneReached:true});
  assert.equal(state.storyFlags.day15V4PublicMaterialOffered,false);
});

test("phone route transmits only spoken knowledge and continued control makes Haeun leave",()=>{
  const state=newState("NOT_INVITED");beginDay15V4(state,{haeunCallsTonight:true});
  choose(state,"day15_v4_invitation_no_invite","day15_v4_outfit_comfort","day15_v4_own_reread","day15_v4_own_write","day15_v4_own_continue","day15_v4_conflict_control","day15_v4_reciprocity_admit_fear","day15_v4_boundary_continue_control");
  assert.equal(state.storyFlags.day15V4HaeunContactRoute,"PHONE");
  assert.equal(state.storyFlags.day15V4SiwooProfessionalBehaviorSource,"TOLD_BY_HAEUN");
  assert.equal(state.storyFlags.day15V4SiwooRoleSource,"UNKNOWN");
  assert.equal(state.storyFlags.day15V4LastTimePhraseSource,"UNKNOWN");
  assert.equal(state.storyFlags.day15V4HaeunLeft,true);
  assert.equal(state.storyFlags.day15V4ShoulderContactOccurred,false);
  assert.equal(getNextDay15V4Choice(state),null);
  assert.throws(()=>offerDay15V4PublicMaterial(state),/NOT_AVAILABLE/);
  completeDay15V4(state,{finalSceneReached:true});
});

test("runtime rejects route-incompatible and out-of-order options",()=>{
  const state=newState("NOT_INVITED");beginDay15V4(state);
  assert.throws(()=>applyDay15V4Choice(state,"day15_v4_invitation_attend"),/OPTION_UNAVAILABLE/);
  choose(state,"day15_v4_invitation_no_invite");
  assert.throws(()=>applyDay15V4Choice(state,"day15_v4_gallery_ask"),/OPTION_UNAVAILABLE/);
  assert.throws(()=>completeDay15V4(state),/CHOICES_INCOMPLETE:2/);
});

test("choice/history mirror corruption is rejected before mutation",()=>{
  const state=newState();beginDay15V4(state);state.storyFlags.day15V4Choice1="day15_v4_invitation_attend";
  const before=JSON.stringify(state);
  assert.throws(()=>getNextDay15V4Choice(state),/CHOICE_MIRROR_CORRUPT:1/);
  assert.equal(JSON.stringify(state),before);
});

test("choice metadata points to the authoritative Notion choice scenes",async()=>{
  const {DAY15_V4_CHOICES}=await import("../src/day15-v4-campaign-data.mjs");
  assert.equal(DAY15_V4_CHOICES.find(choice=>choice.number===3).sceneNumber,4);
  assert.equal(DAY15_V4_CHOICES.find(choice=>choice.number===7).sceneNumber,12);
});
