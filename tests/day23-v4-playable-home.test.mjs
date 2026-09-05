import assert from 'node:assert/strict';
import test from 'node:test';
import {getDay23V4PlayableHome} from '../src/day23-v4-playable-home.mjs';
import {getDay23V4PlayableOpening} from '../src/day23-v4-playable-opening.mjs';
import {getDay23V4PlayableReturn} from '../src/day23-v4-playable-return.mjs';
import {validateDay23V4SourceStep} from '../src/day23-v4-source-selection.mjs';
import {beginDay23V4,resolveDay23V4Photo,resolveDay23V4Relationship,resolveDay23V4Souvenir} from '../src/day23-v4-state-contract.mjs';
import {chooseDay23,completedDay22ForDay23} from './day23-v4-fixture.mjs';

const assertSourced=steps=>{for(const step of steps)if(['dialogue','message','monologue','playerNarration','stageAction'].includes(step.type))assert.equal(validateDay23V4SourceStep(step),true,`${step.type}:${step.text??step.description}`);};

function reachHome(state){
  beginDay23V4(state);let guard=0;
  while(state.storyFlags.day23V4.phase!=='return_ride'){
    assert.ok(guard++<16);const phase=state.storyFlags.day23V4.phase;assertSourced(getDay23V4PlayableOpening(state.storyFlags.day23V4));
    if(phase==='photo_resolution'){resolveDay23V4Photo(state,{type:'haeunPhotoResponse',accepted:false});continue;}
    if(phase==='souvenir_resolution'){resolveDay23V4Souvenir(state,{type:'souvenirPurchaseResponse',purchased:false});continue;}
    chooseDay23(state);
  }
  assertSourced(getDay23V4PlayableReturn(state.storyFlags.day23V4));chooseDay23(state,'one_photo');
  assertSourced(getDay23V4PlayableReturn(state.storyFlags.day23V4));chooseDay23(state,'unpack');
  assertSourced(getDay23V4PlayableReturn(state.storyFlags.day23V4));chooseDay23(state,'discuss_more');
  assert.equal(getDay23V4PlayableReturn(state.storyFlags.day23V4)[0].type,'relationshipConsentCue');resolveDay23V4Relationship(state,{type:'haeunRelationshipResponse',outcome:'UNSURE'});
  assertSourced(getDay23V4PlayableReturn(state.storyFlags.day23V4));chooseDay23(state,'rest_later');
  assert.equal(state.storyFlags.day23V4.phase,'home_arrival');assertSourced(getDay23V4PlayableReturn(state.storyFlags.day23V4));
}

test('Busan home scenes play C11-13 using only the kept landscape and available contacts',()=>{
  const state=completedDay22ForDay23('BUSAN_TRIP',{keepPhoto:false,jihoon:true});reachHome(state);const all=[];
  let steps=getDay23V4PlayableHome(state.storyFlags.day23V4);all.push(...steps);assertSourced(steps);assert.equal(steps.at(-1).choiceNumber,11);chooseDay23(state,'water');
  steps=getDay23V4PlayableHome(state.storyFlags.day23V4);all.push(...steps);assertSourced(steps);assert.ok(steps.at(-1).options.some(option=>option.id.endsWith('_tell_jihoon')));chooseDay23(state,'tell_jihoon');
  steps=getDay23V4PlayableHome(state.storyFlags.day23V4);all.push(...steps);assertSourced(steps);assert.equal(steps.find(step=>step.action==='send-selected-photo')?.recipient,undefined);assert.equal(steps.at(-1).choiceNumber,13);chooseDay23(state,'one_photo');
  steps=getDay23V4PlayableHome(state.storyFlags.day23V4);all.push(...steps);assertSourced(steps);const sent=steps.find(step=>step.action==='send-selected-photo');assert.match(sent.description,/DAY22_LANDSCAPE_PHOTO/);assert.equal(sent.recipient,'하은');
  assert.doesNotMatch(all.map(step=>step.text??'').join('\n'),/나는 네가 웃는 걸 봤어/);
});

test('pending-contact C14 exposes only actual carried contacts and no invented breakup target',()=>{
  const state=completedDay22ForDay23('BUSAN_TRIP',{pendingContacts:['YURI','ARA']});reachHome(state);
  chooseDay23(state,'food');getDay23V4PlayableHome(state.storyFlags.day23V4);chooseDay23(state,'keep_self');getDay23V4PlayableHome(state.storyFlags.day23V4);chooseDay23(state,'leave_unsorted');
  assert.equal(state.storyFlags.day23V4.phase,'pending_contact');let steps=getDay23V4PlayableHome(state.storyFlags.day23V4);assertSourced(steps);
  const list=steps.find(step=>step.action==='show-pending-contacts');assert.deepEqual(list.contacts,['YURI','ARA']);assert.equal(steps.at(-1).options.length,3);chooseDay23(state,'align_relationship');
  steps=getDay23V4PlayableHome(state.storyFlags.day23V4);assertSourced(steps);const message=steps.find(step=>step.type==='message');assert.equal(message.recipient,'YURI');assert.doesNotMatch(steps.map(step=>step.text??'').join('\n'),/서진/);assert.deepEqual(steps.at(-1),{type:'homeBoundary',nextScene:18,route:'BUSAN_TRIP'});
});

test('no-pending-contact path uses SCENE17 and never searches for a new conversation',()=>{
  const state=completedDay22ForDay23('SEOUL_DAY');reachHome(state);
  let steps=getDay23V4PlayableHome(state.storyFlags.day23V4);assertSourced(steps);assert.doesNotMatch(steps.map(step=>step.text??'').join('\n'),/가방을 내려놓고/);chooseDay23(state,'unpack');
  steps=getDay23V4PlayableHome(state.storyFlags.day23V4);assertSourced(steps);assert.doesNotMatch(steps.map(step=>step.text??'').join('\n'),/가방 안을 다시/);chooseDay23(state,'keep_self');
  getDay23V4PlayableHome(state.storyFlags.day23V4);chooseDay23(state,'leave_unsorted');assert.equal(state.storyFlags.day23V4.phase,'self_intent');
  steps=getDay23V4PlayableHome(state.storyFlags.day23V4);assertSourced(steps);assert.ok(steps.some(step=>step.type==='sceneDirection'&&step.number===17));assert.ok(steps.some(step=>step.text?.includes('새로운 대화창을 찾을 필요는 없었다')));assert.equal(steps.at(-1).options.every(option=>option.id.includes('_no_pending_contact_')),true);
  chooseDay23(state,'miss_you');steps=getDay23V4PlayableHome(state.storyFlags.day23V4);assertSourced(steps);assert.equal(steps.find(step=>step.type==='message')?.recipient,'하은');assert.equal(steps.some(step=>step.action==='show-pending-contacts'),false);
});

test('C12 filters an unavailable Jihoon before rendering choices',()=>{
  const state=completedDay22ForDay23('BUSAN_TRIP');reachHome(state);assert.equal(state.storyFlags.day23V4.input.jihoonAvailable,false);chooseDay23(state,'water');
  const options=getDay23V4PlayableHome(state.storyFlags.day23V4).at(-1).options;assert.equal(options.some(option=>option.id.endsWith('_tell_jihoon')),false);assert.equal(options.some(option=>option.id.endsWith('_share_haeun')),true);
});

test('NO_TRAVEL never enters the main home-photo-contact playable',()=>{
  const state=completedDay22ForDay23('NO_TRAVEL');beginDay23V4(state);chooseDay23(state);chooseDay23(state);
  assert.deepEqual(getDay23V4PlayableHome(state.storyFlags.day23V4),[{type:'homeBoundary',nextScene:21,route:'NO_TRAVEL'}]);
});
