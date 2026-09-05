import assert from 'node:assert/strict';
import test from 'node:test';
import {getDay23V4PlayableOpening} from '../src/day23-v4-playable-opening.mjs';
import {getDay23V4PlayableReturn} from '../src/day23-v4-playable-return.mjs';
import {validateDay23V4SourceStep} from '../src/day23-v4-source-selection.mjs';
import {beginDay23V4,resolveDay23V4FarewellContact,resolveDay23V4Photo,resolveDay23V4Relationship,resolveDay23V4Souvenir} from '../src/day23-v4-state-contract.mjs';
import {chooseDay23,completedDay22ForDay23} from './day23-v4-fixture.mjs';

const assertSourced=steps=>{for(const step of steps)if(['dialogue','message','monologue','playerNarration','stageAction'].includes(step.type))assert.equal(validateDay23V4SourceStep(step),true,`${step.type}:${step.text??step.description}`);};

function reachReturn(state,{newPhoto=false}={}){
  beginDay23V4(state);let guard=0;
  while(state.storyFlags.day23V4.phase!=='return_ride'){
    assert.ok(guard++<16);const phase=state.storyFlags.day23V4.phase;
    const steps=getDay23V4PlayableOpening(state.storyFlags.day23V4);assertSourced(steps);
    if(phase==='photo_resolution'){resolveDay23V4Photo(state,{type:'haeunPhotoResponse',accepted:newPhoto});continue;}
    if(phase==='souvenir_resolution'){resolveDay23V4Souvenir(state,{type:'souvenirPurchaseResponse',purchased:false});continue;}
    chooseDay23(state,phase==='departure_record'&&newPhoto?'faces':undefined);
  }
}

test('a newly consented DAY23 photo is available for the return ride and deleted photos stay absent',()=>{
  const state=completedDay22ForDay23('BUSAN_TRIP',{keepPhoto:false});reachReturn(state,{newPhoto:true});
  const opening=getDay23V4PlayableReturn(state.storyFlags.day23V4);assertSourced(opening);
  assert.ok(opening.at(-1).options.some(option=>option.id.endsWith('_one_photo')));
  chooseDay23(state,'one_photo');const steps=getDay23V4PlayableReturn(state.storyFlags.day23V4);assertSourced(steps);
  const review=steps.find(step=>step.action==='review-photo');assert.match(review.description,/DAY23_SHARED_PHOTO/);assert.doesNotMatch(review.description,/DAY22_SHARED_PHOTO/);
});

test('Busan relationship and farewell require separate current responses and rejection creates no hug',()=>{
  const state=completedDay22ForDay23('BUSAN_TRIP');reachReturn(state);const all=[];
  all.push(...getDay23V4PlayableReturn(state.storyFlags.day23V4));chooseDay23(state,'rest');
  all.push(...getDay23V4PlayableReturn(state.storyFlags.day23V4));chooseDay23(state,'feel_empty');
  all.push(...getDay23V4PlayableReturn(state.storyFlags.day23V4));chooseDay23(state,'keep_meeting');
  let steps=getDay23V4PlayableReturn(state.storyFlags.day23V4);assert.equal(steps[0].type,'relationshipConsentCue');assert.equal(state.storyFlags.day23V4.facts.haeunRelationshipOutcome,null);assertSourced(steps);
  resolveDay23V4Relationship(state,{type:'haeunRelationshipResponse',outcome:'CONTINUE'});all.push(...getDay23V4PlayableReturn(state.storyFlags.day23V4));chooseDay23(state,'rest_later');
  assert.equal(state.storyFlags.day23V4.phase,'farewell_resolution');steps=getDay23V4PlayableReturn(state.storyFlags.day23V4);assert.equal(steps.at(-1).type,'farewellContactConsentCue');assert.equal(state.storyFlags.day23V4.facts.farewellContact,'NONE');assertSourced(steps);
  resolveDay23V4FarewellContact(state,{type:'haeunFarewellContactResponse',accepted:false});steps=getDay23V4PlayableReturn(state.storyFlags.day23V4);assertSourced(steps);all.push(...steps);
  assert.equal(state.storyFlags.day23V4.phase,'home_arrival');assert.equal(all.some(step=>step.action==='short-farewell-hug'),false);assert.match(all.map(step=>step.text??'').join('\n'),/손을 흔들거나 잠깐 시선을/);assert.deepEqual(steps.at(-1),{type:'returnBoundary',nextScene:13,route:'BUSAN_TRIP'});
});

test('accepted farewell contact renders one short hug only after consent',()=>{
  const state=completedDay22ForDay23('BUSAN_TRIP');reachReturn(state);
  chooseDay23(state,'ask_home');getDay23V4PlayableReturn(state.storyFlags.day23V4);chooseDay23(state,'ordinary_story');getDay23V4PlayableReturn(state.storyFlags.day23V4);chooseDay23(state,'keep_meeting');
  resolveDay23V4Relationship(state,{type:'haeunRelationshipResponse',outcome:'CONTINUE'});getDay23V4PlayableReturn(state.storyFlags.day23V4);chooseDay23(state,'arrival_line');
  assert.equal(state.storyFlags.day23V4.phase,'farewell_resolution');resolveDay23V4FarewellContact(state,{type:'haeunFarewellContactResponse',accepted:true});
  const steps=getDay23V4PlayableReturn(state.storyFlags.day23V4);assertSourced(steps);assert.equal(steps.filter(step=>step.action==='short-farewell-hug').length,1);
});

test('Seoul path stays at home and does not replay train, station, or farewell contact',()=>{
  const state=completedDay22ForDay23('SEOUL_DAY');reachReturn(state);const all=[];
  all.push(...getDay23V4PlayableReturn(state.storyFlags.day23V4));chooseDay23(state,'ask_home');
  all.push(...getDay23V4PlayableReturn(state.storyFlags.day23V4));chooseDay23(state,'unpack');
  all.push(...getDay23V4PlayableReturn(state.storyFlags.day23V4));chooseDay23(state,'discuss_more');
  assert.equal(getDay23V4PlayableReturn(state.storyFlags.day23V4)[0].type,'relationshipConsentCue');resolveDay23V4Relationship(state,{type:'haeunRelationshipResponse',outcome:'UNSURE'});
  all.push(...getDay23V4PlayableReturn(state.storyFlags.day23V4));chooseDay23(state,'rest_later');assert.equal(state.storyFlags.day23V4.phase,'home_arrival');
  const ending=getDay23V4PlayableReturn(state.storyFlags.day23V4);all.push(...ending);assertSourced(all);
  assert.ok(all.filter(step=>step.type==='sceneDirection').every(step=>step.location==='home'));
  assert.doesNotMatch(all.map(step=>step.text??'').join('\n'),/도착한 곳에서 길이 갈렸다|난 오늘 혼자 집에 가서|잘 가라는 말|짧게 포옹|손을 흔들거나/);
  assert.equal(all.some(step=>step.type==='farewellContactConsentCue'),false);assert.deepEqual(ending.at(-1),{type:'returnBoundary',nextScene:13,route:'SEOUL_DAY'});
});

test('NO_TRAVEL never enters the return and station playable',()=>{
  const state=completedDay22ForDay23('NO_TRAVEL');beginDay23V4(state);chooseDay23(state);chooseDay23(state);
  assert.deepEqual(getDay23V4PlayableReturn(state.storyFlags.day23V4),[{type:'returnBoundary',nextScene:21,route:'NO_TRAVEL'}]);
});
