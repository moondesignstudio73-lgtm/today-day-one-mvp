import assert from 'node:assert/strict';
import test from 'node:test';
import {beginDay18V4, applyDay18V4Choice, completeDay18V4} from '../src/day18-v4-state-contract.mjs';
import {beginDay19V4, applyDay19V4Choice, completeDay19V4, getDay19V4Options} from '../src/day19-v4-state-contract.mjs';
import {beginDay20V4, getDay20V4Entry, validateDay20V4} from '../src/day20-v4-state-contract.mjs';

function day19(shared = true) {
  const partner = shared ? 'HAEUN' : 'SOLO';
  const state = {breakup:null, ended:false, money:42000, storyFlags:{day17V4Completed:true,
    day17V4Day18HookPending:true, day17V4TomorrowPlan:partner,
    day17V4Choice9:shared?'day17_v4_life_haeun':'day17_v4_life_solo',
    day17V4DinnerAgreement:{day:18,partner,status:'ACCEPTED',sourceChoiceId:'day17_v4_life_haeun'},
    day16V4YuriEncountered:false,day16V4YuriContact:'ENDED_HERE',day16V4YuriInvitation:'NONE'}};
  beginDay18V4(state, shared ? {} : {haeunContactAllowed:false});
  for (const key of shared ? ['morning_keep','disclose_together','menu_each','topic_good','close_home','night_good','calm_trip','travel_near']
    : ['morning_solo','menu_familiar','solo_food','return_home','alone_stop','travel_life']) applyDay18V4Choice(state,`day18_v4_${key}`);
  completeDay18V4(state,{type:'chapterCompletionCue',day:18,finalSceneReached:true});
  beginDay19V4(state);
  while (state.storyFlags.day19V4.phase !== 'ending') {
    const options = getDay19V4Options(state.storyFlags.day19V4);
    const acceptedMeal = shared && state.storyFlags.day19V4.phase === 'dinner';
    const cups = shared && state.storyFlags.day19V4.phase === 'tomorrow_table';
    applyDay19V4Choice(state,options[acceptedMeal ? 2 : cups ? 0 : 0].id);
  }
  completeDay19V4(state,{type:'chapterCompletionCue',day:19,finalSceneReached:true});
  return state;
}

test('only a genuinely accepted DAY19 meal creates a face-to-face DAY20 entry',()=>{
  const state=day19(true), entry=getDay20V4Entry(state);
  assert.equal(entry.mode,'V4_NEW');
  assert.equal(entry.input.visitMode,'FACE_TO_FACE');
  assert.equal(entry.input.invitation.status,'ACCEPTED');
  assert.match(entry.input.invitation.sourceChoiceId,/day19_v4_c13_tomorrow_home$/);
  assert.equal(entry.input.cupConversationExperienced,true);
  assert.equal(entry.input.sharedTravelConversationExperienced,true);
  assert.deepEqual(beginDay20V4(state),{mode:'V4'});
  assert.equal(validateDay20V4(state.storyFlags.day20V4),true);
  assert.equal(state.storyFlags.day20V4.facts.stayedOver,false);
  assert.equal(state.storyFlags.day20V4.facts.firstHug,false);
});

test('a nonaccepted meal remains solo and invents no visit, cup talk, contact or lodging',()=>{
  const state=day19(false), entry=getDay20V4Entry(state);
  assert.equal(entry.mode,'V4_NEW');
  assert.equal(entry.input.visitMode,'SOLO');
  assert.deepEqual(entry.input.invitation,{status:'NONE',sourceChoiceId:null});
  assert.equal(entry.input.cupConversationExperienced,false);
  assert.equal(entry.input.contactAllowed,false);
  beginDay20V4(state);
  assert.equal(state.storyFlags.day20V4.facts.visitMode,'SOLO');
  assert.equal(state.storyFlags.day20V4.facts.borrowedClothes,false);
  assert.equal(state.storyFlags.day20V4.facts.sleepingPlan,null);
});

test('legacy and malformed saves fail closed without being rewritten',()=>{
  const legacy=day19(true);legacy.storyFlags.day20RuntimeStage=1;
  assert.equal(beginDay20V4(legacy).mode,'LEGACY');assert.equal(legacy.storyFlags.day20V4,undefined);
  const malformed=day19(true);malformed.storyFlags.day20V4={schema:'day20-notion-v4/1'};
  const before=structuredClone(malformed.storyFlags.day20V4);
  assert.equal(beginDay20V4(malformed).mode,'INVALID_V4');
  assert.deepEqual(malformed.storyFlags.day20V4,before);
  assert.equal(getDay20V4Entry({storyFlags:{}}).mode,'BLOCKED_PREREQUISITE');
});
