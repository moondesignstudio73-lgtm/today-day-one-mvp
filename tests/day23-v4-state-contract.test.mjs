import assert from 'node:assert/strict';
import test from 'node:test';
import {beginDay23V4,completeDay23V4,getDay23V4Entry,getDay23V4Options,resolveDay23V4Conversation,resolveDay23V4FarewellContact,resolveDay23V4Meeting,resolveDay23V4Photo,resolveDay23V4Relationship,resolveDay23V4Souvenir,validateDay23V4} from '../src/day23-v4-state-contract.mjs';
import {chooseDay23,completedDay22ForDay23 as completedDay22} from './day23-v4-fixture.mjs';

function resolvePending(state,{photo=true,purchase=false,relationship='CONTINUE',meeting=true,conversation=true}={}){
  const phase=state.storyFlags.day23V4.phase;
  if(phase==='photo_resolution')return resolveDay23V4Photo(state,{type:'haeunPhotoResponse',accepted:photo});
  if(phase==='souvenir_resolution')return resolveDay23V4Souvenir(state,purchase?{type:'souvenirPurchaseResponse',purchased:true,itemId:'small-postcard',cost:3000}:{type:'souvenirPurchaseResponse',purchased:false});
  if(phase==='relationship_resolution')return resolveDay23V4Relationship(state,{type:'haeunRelationshipResponse',outcome:relationship});
  if(phase==='farewell_resolution')return resolveDay23V4FarewellContact(state,{type:'haeunFarewellContactResponse',accepted:false});
  if(phase==='meeting_resolution')return resolveDay23V4Meeting(state,{type:'haeunMeetingResponse',accepted:meeting});
  if(phase==='conversation_resolution')return resolveDay23V4Conversation(state,{type:'haeunConversationResponse',accepted:conversation});
  return null;
}
function finish(state,settings={}){let guard=0;while(state.storyFlags.day23V4.phase!=='ending'){assert.ok(guard++<32);if(resolvePending(state,settings))continue;chooseDay23(state,settings.suffixByPhase?.[state.storyFlags.day23V4.phase]);}return state.storyFlags.day23V4;}

test('DAY23 entry freezes verified DAY20-22 history into four morning modes',()=>{
  const shared=completedDay22('BUSAN_TRIP');assert.equal(getDay23V4Entry(shared).input.morningMode,'BUSAN_SHARED');
  const separate=completedDay22('BUSAN_TRIP',{shared:false});assert.equal(getDay23V4Entry(separate).input.morningMode,'BUSAN_SEPARATE');
  const seoul=completedDay22('SEOUL_DAY');assert.equal(getDay23V4Entry(seoul).input.morningMode,'HOME_AFTER_SEOUL');
  const none=completedDay22('NO_TRAVEL');assert.equal(getDay23V4Entry(none).input.morningMode,'HOME_NO_TRAVEL');
  const broken=completedDay22('SEOUL_DAY');broken.storyFlags.day22V4.facts.sharedPhotoKept=!broken.storyFlags.day22V4.facts.sharedPhotoKept;assert.equal(getDay23V4Entry(broken).mode,'BLOCKED_PREREQUISITE');
  const legacy=completedDay22('SEOUL_DAY');legacy.storyFlags.day23RuntimeStage=1;assert.equal(getDay23V4Entry(legacy).mode,'LEGACY');
});

test('Busan main route replays consent, purchase, relationship response and DAY24 hook',()=>{
  const state=completedDay22('BUSAN_TRIP',{jihoon:true,pendingContacts:['YURI'],keepPhoto:false});beginDay23V4(state);
  const chapter=finish(state,{photo:false,purchase:true,relationship:'UNSURE',conversation:false,suffixByPhase:{departure_record:'faces',souvenir:'small_item',small_share:'tell_jihoon',pending_contact:'name_uncertainty'}});
  assert.equal(chapter.input.sharedPhotoDeleted,true);assert.equal(chapter.facts.sharedPhotoToday,false);
  assert.deepEqual(chapter.facts.souvenirPurchase,{itemId:'small-postcard',cost:3000});assert.equal(chapter.facts.haeunRelationshipOutcome,'UNSURE');
  assert.equal(chapter.facts.pendingContactAction,'NAME_UNCERTAINTY');assert.equal(chapter.facts.selfIntent,null);assert.equal(chapter.facts.nextConversation,'NOT_AGREED');assert.equal(validateDay23V4(chapter),true);
  completeDay23V4(state,{type:'chapterCompletionCue',day:23,finalSceneReached:true});assert.equal(state.storyFlags.day23V4Day24HookPending,true);assert.equal(state.storyFlags.day22V4Day23HookPending,false);
});

test('no pending contact selects the source C14 self-intent variant',()=>{
  const state=completedDay22('SEOUL_DAY');beginDay23V4(state);
  while(state.storyFlags.day23V4.phase!=='self_intent'){if(resolvePending(state))continue;chooseDay23(state);}
  const options=getDay23V4Options(state.storyFlags.day23V4);assert.equal(options.length,3);assert.ok(options.every(option=>option.id.includes('_no_pending_contact_')));
  chooseDay23(state,'miss_you');finish(state);assert.equal(state.storyFlags.day23V4.facts.selfIntent,'MISS_YOU');assert.equal(state.storyFlags.day23V4.facts.pendingContactAction,null);
});

test('NO_TRAVEL plays common morning then only C3-8 and filters unavailable Haeun',()=>{
  const state=completedDay22('NO_TRAVEL');beginDay23V4(state);chooseDay23(state);chooseDay23(state);
  assert.equal(state.storyFlags.day23V4.phase,'no_travel_outing');assert.equal(getDay23V4Options(state.storyFlags.day23V4).some(option=>option.id.endsWith('_meet_if_accepted')),false);
  finish(state);const chapter=state.storyFlags.day23V4;
  assert.deepEqual(chapter.choices.filter(record=>record.kind==='choice').map(record=>[record.variant,record.number]),[['MAIN',1],['MAIN',2],['NO_TRAVEL',3],['NO_TRAVEL',4],['NO_TRAVEL',5],['NO_TRAVEL',6],['NO_TRAVEL',7],['NO_TRAVEL',8]]);
  assert.equal(chapter.facts.returnRide,null);assert.equal(chapter.facts.farewellContact,'NONE');assert.equal(chapter.facts.nextConversation,null);assert.equal(validateDay23V4(chapter),true);
});

test('available no-travel meeting still requires a separate Haeun response',()=>{
  const state=completedDay22('NO_TRAVEL',{contactAvailableNoTravel:true});beginDay23V4(state);chooseDay23(state);chooseDay23(state);
  assert.ok(getDay23V4Options(state.storyFlags.day23V4).some(option=>option.id.endsWith('_meet_if_accepted')));chooseDay23(state,'meet_if_accepted');
  assert.equal(state.storyFlags.day23V4.phase,'meeting_resolution');assert.equal(state.storyFlags.day23V4.facts.noTravelMeetingAccepted,null);
  resolveDay23V4Meeting(state,{type:'haeunMeetingResponse',accepted:false});assert.equal(state.storyFlags.day23V4.facts.noTravelMeetingAccepted,false);assert.equal(state.storyFlags.day23V4.phase,'no_travel_good');
});

test('tampering with frozen photo, route, or replay facts fails closed',()=>{
  const state=completedDay22('BUSAN_TRIP');beginDay23V4(state);chooseDay23(state);chooseDay23(state);const valid=state.storyFlags.day23V4;assert.equal(validateDay23V4(valid),true);
  const route=structuredClone(valid);route.input.route='SEOUL_DAY';assert.equal(validateDay23V4(route),false);
  const photo=structuredClone(valid);photo.input.sharedPhotoDeleted=true;photo.input.sharedPhotoKept=true;assert.equal(validateDay23V4(photo),false);
  const facts=structuredClone(valid);facts.facts.homeArrival='FOOD';assert.equal(validateDay23V4(facts),false);
  assert.throws(()=>completeDay23V4(state,{type:'chapterCompletionCue',day:23,finalSceneReached:true}),/INVALID_COMPLETION/);
});
