import assert from 'node:assert/strict';
import {applyDay21V4Choice,completeDay21V4,getDay21V4Options,resolveDay21V4Contact,resolveDay21V4Lodging,resolveDay21V4Travel} from '../src/day21-v4-state-contract.mjs';
import {applyDay22V4Choice,getDay22V4Options} from '../src/day22-v4-state-contract.mjs';
import {day21State} from './day21-v4-fixture.mjs';

function chooseDay21(state,suffix){
  const options=getDay21V4Options(state.storyFlags.day21V4);
  const selected=suffix?options.find(option=>option.id.endsWith(`_${suffix}`)):options[0];
  assert.ok(selected,`DAY21 ${state.storyFlags.day21V4.phase}:${suffix}`);
  applyDay21V4Choice(state,selected.id);
}

export function completedDay21ForDay22(route,{ara=false,shared=true}={}){
  const unavailable=route==='NO_TRAVEL';
  const state=day21State(unavailable?{relationshipActive:false,contactAllowed:false,relationshipTone:'DIFFICULT',morningMode:'SOLO_MORNING',day20StayedOver:false,day20VisitMode:'SOLO',day20NightEnd:'LEFT'}:{});
  state.breakup=unavailable?{day:20,reason:'fixture'}:null;
  state.ended=false;
  if(ara){state.storyFlags.day13V3AraMet=true;state.storyFlags.day13V3AraEarlyExit=false;state.storyFlags.day13V3PhotoContact='OCCASIONAL_EXCHANGE';}
  while(state.storyFlags.day21V4.phase!=='ending'){
    const chapter=state.storyFlags.day21V4,phase=chapter.phase;
    if(phase==='contact_resolution'){resolveDay21V4Contact(state,{type:'haeunContactResponse',contact:chapter.facts.contactIntent,accepted:true});continue;}
    if(phase==='lodging_resolution'){resolveDay21V4Lodging(state,{type:'haeunLodgingResponse',accepted:shared});continue;}
    if(phase==='travel_resolution'){resolveDay21V4Travel(state,{type:'travelConfirmation',confirmed:true,dateConfirmed:true,transportConfirmed:true,budgetConfirmed:true,lodgingConfirmed:true,mutualConsent:true});continue;}
    const suffix={venue:unavailable?'defer':route==='SEOUL_DAY'?'phone':'park',contact:'hug',dinner:'talk_travel',travel:route==='BUSAN_TRIP'?'busan':route==='SEOUL_DAY'?'seoul':'rest_separately',lodging:route==='BUSAN_TRIP'?(shared?'shared_room_wish':'separate_spaces'):route==='SEOUL_DAY'?'day_trip':'separate_spaces'}[phase];
    chooseDay21(state,suffix);
  }
  completeDay21V4(state,{type:'chapterCompletionCue',day:21,finalSceneReached:true});
  if(route==='BUSAN_TRIP')state.storyFlags.day21V4TravelPurchase={day:21,quoteId:'day22-test-booking',playerCost:60000,partnerCostIncluded:false,ledgerIndex:0};
  return state;
}

export function chooseDay22(state,suffix){
  const options=getDay22V4Options(state.storyFlags.day22V4);
  const selected=suffix?options.find(option=>option.id.endsWith(`_${suffix}`)):options[0];
  assert.ok(selected,`DAY22 ${state.storyFlags.day22V4.phase}:${suffix}`);
  return applyDay22V4Choice(state,selected.id);
}
