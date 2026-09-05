import assert from 'node:assert/strict';
import test from 'node:test';
import {beginDay18V4,applyDay18V4Choice,completeDay18V4} from '../src/day18-v4-state-contract.mjs';
import {beginDay19V4,applyDay19V4Choice,completeDay19V4,getDay19V4Options} from '../src/day19-v4-state-contract.mjs';
import {beginDay20V4,applyDay20V4Choice,completeDay20V4,getDay20V4Options,resolveDay20V4Contact,resolveDay20V4Stay} from '../src/day20-v4-state-contract.mjs';
import {applyDay21V4Choice,beginDay21V4,completeDay21V4,getDay21V4Entry,getDay21V4Options,resolveDay21V4Contact,resolveDay21V4Lodging,resolveDay21V4Travel,validateDay21V4} from '../src/day21-v4-state-contract.mjs';

function prior(shared=true){
  const partner=shared?'HAEUN':'SOLO',s={day:21,money:42000,breakup:null,ended:false,storyFlags:{day17V4Completed:true,day17V4Day18HookPending:true,day17V4TomorrowPlan:partner,day17V4Choice9:shared?'day17_v4_life_haeun':'day17_v4_life_solo',day17V4DinnerAgreement:{day:18,partner,status:'ACCEPTED',sourceChoiceId:shared?'day17_v4_life_haeun':'day17_v4_life_solo'},day16V4YuriEncountered:false,day16V4YuriContact:'ENDED_HERE',day16V4YuriInvitation:'NONE'}};
  beginDay18V4(s,shared?{}:{haeunContactAllowed:false});
  for(const key of shared?['morning_keep','disclose_together','menu_each','topic_good','close_home','night_good','calm_trip','travel_near']:['morning_solo','menu_familiar','solo_food','return_home','alone_stop','travel_life'])applyDay18V4Choice(s,`day18_v4_${key}`);
  completeDay18V4(s,{type:'chapterCompletionCue',day:18,finalSceneReached:true});beginDay19V4(s);
  while(s.storyFlags.day19V4.phase!=='ending'){
    const phase=s.storyFlags.day19V4.phase,options=getDay19V4Options(s.storyFlags.day19V4),index=shared&&phase==='dinner'?options.findIndex(option=>option.id.endsWith('_tomorrow_home')):0;
    applyDay19V4Choice(s,options[Math.max(0,index)].id);
  }
  completeDay19V4(s,{type:'chapterCompletionCue',day:19,finalSceneReached:true});beginDay20V4(s);
  return s;
}
function finishDay20(s,{stay=false}={}){
  while(s.storyFlags.day20V4.phase!=='ending'){
    const chapter=s.storyFlags.day20V4,phase=chapter.phase;
    if(phase==='contact_resolution'){resolveDay20V4Contact(s,{type:'haeunContactResponse',contact:chapter.facts.closenessChoice==='HUG_REQUESTED'?'HUG':'HAND',accepted:false});continue;}
    if(phase==='stay_resolution'){resolveDay20V4Stay(s,{type:'haeunStayResponse',accepted:stay,prepared:stay,sleepingPlan:'SEPARATE_BEDDING'});continue;}
    const options=getDay20V4Options(chapter),suffix=stay?{extension:'stay_longer',closeness:'current_distance',next_evening:'another_evening',night_end:'offer_stay'}[phase]:{closeness:'current_distance',night_end:'end_here'}[phase];
    applyDay20V4Choice(s,(suffix?options.find(option=>option.id.endsWith(`_${suffix}`)):options[0]).id);
  }
  completeDay20V4(s,{type:'chapterCompletionCue',day:20,finalSceneReached:true});return s;
}
const choose=(s,suffix)=>{const options=getDay21V4Options(s.storyFlags.day21V4),selected=suffix?options.find(option=>option.id.endsWith(`_${suffix}`)):options[0];assert.ok(selected,`${s.storyFlags.day21V4.phase}:${suffix}`);return applyDay21V4Choice(s,selected.id);};

test('DAY21 entry freezes only validated DAY19 and DAY20 facts while preserving legacy saves',()=>{
  const s=finishDay20(prior(),{stay:true});assert.equal(getDay21V4Entry(s).mode,'V4_NEW');beginDay21V4(s);const input=s.storyFlags.day21V4.input;
  assert.equal(input.morningMode,'STAYED_MORNING');assert.equal(input.day20SleepingPlan,'SEPARATE_BEDDING');assert.equal(input.day19TravelCandidate,'BUSAN_NIGHT');assert.equal(input.day19ReservationStatus,'CANDIDATE_ONLY');
  assert.equal(validateDay21V4(s.storyFlags.day21V4),true);
  const legacy=finishDay20(prior());legacy.storyFlags.day21RuntimeStage=1;assert.equal(getDay21V4Entry(legacy).mode,'LEGACY');assert.equal(legacy.storyFlags.day21V4,undefined);
});

test('main route requires separate current contact, lodging and travel confirmations',()=>{
  const s=finishDay20(prior(),{stay:true});beginDay21V4(s);choose(s);choose(s);choose(s,'park');choose(s);choose(s);choose(s);choose(s);choose(s);choose(s);choose(s,'hug');
  assert.equal(s.storyFlags.day21V4.phase,'contact_resolution');assert.equal(s.storyFlags.day21V4.facts.todayContact,null);
  resolveDay21V4Contact(s,{type:'haeunContactResponse',contact:'HUG',accepted:true});assert.equal(s.storyFlags.day21V4.facts.todayContact,'HUG');
  choose(s,'talk_travel');choose(s,'busan');choose(s,'shared_room_wish');assert.equal(s.storyFlags.day21V4.phase,'lodging_resolution');
  resolveDay21V4Lodging(s,{type:'haeunLodgingResponse',accepted:true});assert.equal(s.storyFlags.day21V4.facts.lodgingAgreement,'SHARED_ROOM_AGREED');
  const before=structuredClone(s.storyFlags.day21V4);assert.throws(()=>resolveDay21V4Travel(s,{type:'travelConfirmation',confirmed:true,dateConfirmed:true,transportConfirmed:true,budgetConfirmed:false,lodgingConfirmed:true,mutualConsent:true}),/REQUIRES_ALL_CHECKS/);assert.deepEqual(s.storyFlags.day21V4,before);
  resolveDay21V4Travel(s,{type:'travelConfirmation',confirmed:true,dateConfirmed:true,transportConfirmed:true,budgetConfirmed:true,lodgingConfirmed:true,mutualConsent:true});
  while(s.storyFlags.day21V4.phase!=='ending')choose(s);assert.equal(s.storyFlags.day21V4.facts.bookingConfirmed,true);assert.equal(s.storyFlags.day21V4.facts.travelPaymentMade,true);
  completeDay21V4(s,{type:'chapterCompletionCue',day:21,finalSceneReached:true});assert.equal(s.storyFlags.day21V4.complete,true);assert.equal(s.storyFlags.day20V4Day21HookPending,false);assert.equal(s.storyFlags.day21V4Day22HookPending,true);
});

test('no-contact entry exposes only defer and never learns Haeun stories or creates travel',()=>{
  const s=finishDay20(prior(false));beginDay21V4(s);choose(s);choose(s);const venue=getDay21V4Options(s.storyFlags.day21V4);assert.equal(venue.length,1);assert.ok(venue[0].id.endsWith('_defer'));choose(s,'defer');
  while(s.storyFlags.day21V4.phase!=='ending')choose(s);const facts=s.storyFlags.day21V4.facts;
  assert.equal(facts.heardHaeunStory,false);assert.equal(facts.heardLunchStory,false);assert.equal(facts.todayContact,null);assert.equal(facts.bookingConfirmed,false);assert.equal(facts.travelPaymentMade,false);assert.equal(validateDay21V4(s.storyFlags.day21V4),true);
});
