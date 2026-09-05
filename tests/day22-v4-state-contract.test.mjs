import assert from 'node:assert/strict';
import test from 'node:test';
import {beginDay22V4,completeDay22V4,getDay22V4Entry,getDay22V4Options,resolveDay22V4Contact,resolveDay22V4Photo,validateDay22V4} from '../src/day22-v4-state-contract.mjs';
import {chooseDay22,completedDay21ForDay22 as completedDay21} from './day22-v4-fixture.mjs';

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

test('only an actually shared Busan room exposes face praise and physical contact',()=>{
  const reachUnwind=state=>{while(state.storyFlags.day22V4.phase!=='unwind'){if(state.storyFlags.day22V4.phase==='photo_resolution')resolveDay22V4Photo(state,{type:'haeunPhotoResponse',keepAccepted:true});else chooseDay22(state);}};
  const shared=completedDay21('BUSAN_TRIP');beginDay22V4(shared);reachUnwind(shared);assert.ok(getDay22V4Options(shared.storyFlags.day22V4).some(option=>option.id.endsWith('_like_relaxed_face')));chooseDay22(shared);chooseDay22(shared);assert.equal(getDay22V4Options(shared.storyFlags.day22V4).length,3);
  const separate=completedDay21('BUSAN_TRIP',{shared:false});beginDay22V4(separate);reachUnwind(separate);assert.equal(getDay22V4Options(separate.storyFlags.day22V4).some(option=>option.id.endsWith('_like_relaxed_face')),false);chooseDay22(separate);chooseDay22(separate);const contact=getDay22V4Options(separate.storyFlags.day22V4);assert.equal(contact.length,1);assert.ok(contact[0].id.endsWith('_rest_as_is'));
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
  assert.equal(state.storyFlags.day22V4.facts.photoMessageSent,true);
  const tampered=structuredClone(state.storyFlags.day22V4);tampered.input.araPhotoExchange=false;
  assert.equal(validateDay22V4(tampered),false);
  state.storyFlags.day22V4.facts.cafeVisited=true;
  assert.equal(validateDay22V4(state.storyFlags.day22V4),false);
  assert.throws(()=>chooseDay22(state),/DAY22_INVALID_SAVE/);
});
