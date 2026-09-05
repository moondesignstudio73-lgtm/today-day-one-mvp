import assert from 'node:assert/strict';
import test from 'node:test';
import {applyDay21V4Choice,completeDay21V4,getDay21V4Options,resolveDay21V4Contact,resolveDay21V4Lodging,resolveDay21V4Travel} from '../src/day21-v4-state-contract.mjs';
import {applyDay22V4Choice,beginDay22V4,completeDay22V4,getDay22V4Entry,getDay22V4Options,resolveDay22V4Contact,resolveDay22V4Photo,validateDay22V4} from '../src/day22-v4-state-contract.mjs';
import {day21State} from './day21-v4-fixture.mjs';

function chooseDay21(state,suffix){
  const options=getDay21V4Options(state.storyFlags.day21V4);
  const selected=suffix?options.find(option=>option.id.endsWith(`_${suffix}`)):options[0];
  assert.ok(selected,`DAY21 ${state.storyFlags.day21V4.phase}:${suffix}`);
  applyDay21V4Choice(state,selected.id);
}

function completedDay21(route,{ara=false}={}){
  const noTravel=route==='NO_TRAVEL';
  const state=day21State(noTravel?{relationshipActive:false,contactAllowed:false,relationshipTone:'DIFFICULT',morningMode:'SOLO_MORNING',day20StayedOver:false,day20VisitMode:'SOLO',day20NightEnd:'LEFT'}:{});
  state.breakup=noTravel?{day:20,reason:'fixture'}:null;
  state.ended=false;
  if(ara){state.storyFlags.day13V3AraMet=true;state.storyFlags.day13V3AraEarlyExit=false;state.storyFlags.day13V3PhotoContact='OCCASIONAL_EXCHANGE';}
  while(state.storyFlags.day21V4.phase!=='ending'){
    const chapter=state.storyFlags.day21V4,phase=chapter.phase;
    if(phase==='contact_resolution'){resolveDay21V4Contact(state,{type:'haeunContactResponse',contact:chapter.facts.contactIntent,accepted:true});continue;}
    if(phase==='lodging_resolution'){resolveDay21V4Lodging(state,{type:'haeunLodgingResponse',accepted:true});continue;}
    if(phase==='travel_resolution'){resolveDay21V4Travel(state,{type:'travelConfirmation',confirmed:true,dateConfirmed:true,transportConfirmed:true,budgetConfirmed:true,lodgingConfirmed:true,mutualConsent:true});continue;}
    const suffix={venue:noTravel?'defer':route==='SEOUL_DAY'?'phone':'park',contact:'hug',dinner:'talk_travel',travel:route==='SEOUL_DAY'?'seoul':'busan',lodging:route==='SEOUL_DAY'?'day_trip':'shared_room_wish'}[phase];
    chooseDay21(state,suffix);
  }
  completeDay21V4(state,{type:'chapterCompletionCue',day:21,finalSceneReached:true});
  if(route==='BUSAN_TRIP')state.storyFlags.day21V4TravelPurchase={day:21,quoteId:'day22-test-booking',playerCost:60000,partnerCostIncluded:false,ledgerIndex:0};
  return state;
}

function chooseDay22(state,suffix){
  const options=getDay22V4Options(state.storyFlags.day22V4);
  const selected=suffix?options.find(option=>option.id.endsWith(`_${suffix}`)):options[0];
  assert.ok(selected,`DAY22 ${state.storyFlags.day22V4.phase}:${suffix}`);
  applyDay22V4Choice(state,selected.id);
}

test('DAY22 entry derives only verified BUSAN, SEOUL, or fail-closed NO_TRAVEL routes',()=>{
  const busan=completedDay21('BUSAN_TRIP');assert.equal(getDay22V4Entry(busan).input.route,'BUSAN_TRIP');
  const seoul=completedDay21('SEOUL_DAY');assert.equal(getDay22V4Entry(seoul).input.route,'SEOUL_DAY');
  const none=completedDay21('NO_TRAVEL');assert.equal(getDay22V4Entry(none).input.route,'NO_TRAVEL');
  delete busan.storyFlags.day21V4TravelPurchase;assert.equal(getDay22V4Entry(busan).input.route,'NO_TRAVEL');
  const legacy=completedDay21('SEOUL_DAY');legacy.storyFlags.day22RuntimeStage=1;assert.equal(getDay22V4Entry(legacy).mode,'LEGACY');
});

test('BUSAN route replays reunion, explicit photo deletion, and rejected current contact',()=>{
  const state=completedDay21('BUSAN_TRIP');beginDay22V4(state);
  while(state.storyFlags.day22V4.phase!=='ending'){
    const chapter=state.storyFlags.day22V4,phase=chapter.phase;
    if(phase==='photo_resolution'){resolveDay22V4Photo(state,{type:'haeunPhotoResponse',keepAccepted:false});continue;}
    if(phase==='contact_resolution'){resolveDay22V4Contact(state,{type:'haeunContactResponse',contact:'HAND',accepted:false});continue;}
    chooseDay22(state,{pace:'separate_briefly',photo_share:'show_haeun',shared_photo:'keep_if_mutual',contact:'hold_hands'}[phase]);
  }
  const chapter=state.storyFlags.day22V4;
  assert.deepEqual(chapter.facts.separateMeeting,{place:'AGREED_EASY_TO_FIND',time:'AGREED',contactAvailable:true,reunited:true});
  assert.equal(chapter.facts.sharedPhotoKept,false);assert.equal(chapter.facts.sharedPhotoDeleted,true);assert.equal(chapter.facts.todayContact,'NONE');assert.equal(chapter.facts.seoulReturnWords,null);
  assert.equal(validateDay22V4(chapter),true);
  completeDay22V4(state,{type:'chapterCompletionCue',day:22,finalSceneReached:true});
  assert.equal(state.storyFlags.day22V4Day23HookPending,true);assert.equal(state.storyFlags.day21V4Day22HookPending,false);
  assert.equal(completeDay22V4(state,{type:'chapterCompletionCue',day:22,finalSceneReached:true}).complete,true);
});

test('SEOUL day route has return choice and never gains an overnight purchase',()=>{
  const state=completedDay21('SEOUL_DAY');beginDay22V4(state);
  while(state.storyFlags.day22V4.phase!=='ending'){
    const chapter=state.storyFlags.day22V4;
    if(chapter.phase==='photo_resolution'){resolveDay22V4Photo(state,{type:'haeunPhotoResponse',keepAccepted:true});continue;}
    if(chapter.phase==='contact_resolution'){resolveDay22V4Contact(state,{type:'haeunContactResponse',contact:chapter.facts.contactIntent,accepted:true});continue;}
    chooseDay22(state,chapter.phase==='contact'?'rest_as_is':undefined);
  }
  assert.equal(state.storyFlags.day22V4.facts.seoulReturnWords,'CHOOSE_PHOTO_TOMORROW');
  assert.equal(state.storyFlags.day22V4.input.day21TravelPurchase,null);
  assert.equal(state.storyFlags.day21V4TravelPurchase,undefined);
  assert.equal(validateDay22V4(state.storyFlags.day22V4),true);
});

test('NO_TRAVEL route filters unavailable contacts and never creates travel or photo facts',()=>{
  const state=completedDay21('NO_TRAVEL');beginDay22V4(state);
  chooseDay22(state);chooseDay22(state);
  const photoOptions=getDay22V4Options(state.storyFlags.day22V4);assert.equal(photoOptions.length,1);assert.ok(photoOptions[0].id.endsWith('_album_only'));
  chooseDay22(state);assert.equal(state.storyFlags.day22V4.phase,'no_travel_evening');
  while(state.storyFlags.day22V4.phase!=='ending')chooseDay22(state);
  const facts=state.storyFlags.day22V4.facts;
  assert.equal(facts.route,'NO_TRAVEL');assert.equal(facts.landscapePhotoExists,false);assert.equal(facts.photoMessageSent,false);assert.equal(facts.noTravelContact,null);assert.equal(facts.cafeVisited,false);
  assert.equal(validateDay22V4(state.storyFlags.day22V4),true);
});

test('Ara photo option requires an actual DAY13 exchange and replay rejects tampering',()=>{
  const state=completedDay21('NO_TRAVEL',{ara:true});beginDay22V4(state);chooseDay22(state);chooseDay22(state);
  assert.ok(getDay22V4Options(state.storyFlags.day22V4).some(option=>option.id.endsWith('_send_exchange')));
  chooseDay22(state,'send_exchange');
  const tampered=structuredClone(state.storyFlags.day22V4);tampered.input.araPhotoExchange=false;
  assert.equal(validateDay22V4(tampered),false);
  state.storyFlags.day22V4.facts.cafeVisited=true;
  assert.equal(validateDay22V4(state.storyFlags.day22V4),false);
  assert.throws(()=>chooseDay22(state),/DAY22_INVALID_SAVE/);
});
