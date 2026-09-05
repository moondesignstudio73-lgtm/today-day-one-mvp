import assert from 'node:assert/strict';
import test from 'node:test';
import {getDay22V4PlayableCafe} from '../src/day22-v4-playable-cafe.mjs';
import {validateDay22V4SourceStep} from '../src/day22-v4-source-selection.mjs';
import {beginDay22V4,resolveDay22V4Photo} from '../src/day22-v4-state-contract.mjs';
import {chooseDay22,completedDay21ForDay22} from './day22-v4-fixture.mjs';

const assertSourced=steps=>{for(const step of steps)if(step.source)assert.equal(validateDay22V4SourceStep(step),true,`${step.type}:${step.text??step.actionLabel??step.prompt}`);};
const reachCafe=state=>{beginDay22V4(state);for(let i=0;i<6;i++)chooseDay22(state);};

test('shared photo requires a separate keep response and rejection stays deleted',()=>{
  const state=completedDay21ForDay22('BUSAN_TRIP');reachCafe(state);let steps=getDay22V4PlayableCafe(state.storyFlags.day22V4);assert.equal(steps[0].number,11);assert.equal(steps[0].location,'marine-view-cafe');assert.equal(steps.at(-1).choiceNumber,7);assertSourced(steps);
  chooseDay22(state,'wait_with_limit');steps=getDay22V4PlayableCafe(state.storyFlags.day22V4);assert.ok(steps.some(step=>step.type==='sceneDirection'&&step.number===12));assert.equal(steps.at(-1).choiceNumber,8);assertSourced(steps);
  chooseDay22(state,'keep_if_mutual');assert.equal(state.storyFlags.day22V4.phase,'photo_resolution');steps=getDay22V4PlayableCafe(state.storyFlags.day22V4);assert.equal(steps.at(-1).type,'photoConsentCue');assert.equal(steps.some(step=>step.status==='shared-photo-kept'),false);assertSourced(steps);
  resolveDay22V4Photo(state,{type:'haeunPhotoResponse',keepAccepted:false});steps=getDay22V4PlayableCafe(state.storyFlags.day22V4);assert.ok(steps.some(step=>step.status==='shared-photo-deleted'));assert.equal(steps.some(step=>step.status==='shared-photo-kept'),false);assert.equal(steps.at(-1).choiceNumber,9);assertSourced(steps);
  chooseDay22(state,'name_disappointment');steps=getDay22V4PlayableCafe(state.storyFlags.day22V4);assert.ok(steps.some(step=>step.type==='sceneDirection'&&step.number===14));assert.equal(steps.at(-1).choiceNumber,10);assertSourced(steps);
  chooseDay22(state,'say_current_wants');steps=getDay22V4PlayableCafe(state.storyFlags.day22V4);assert.deepEqual(steps.at(-1),{type:'cafeBoundary',nextScene:15,route:'BUSAN_TRIP'});assert.equal(state.storyFlags.day22V4.facts.sharedPhotoDeleted,true);assertSourced(steps);
});

test('stop-photo route needs no keep response and never emits a kept-photo action',()=>{
  const state=completedDay21ForDay22('BUSAN_TRIP');reachCafe(state);chooseDay22(state);let steps=getDay22V4PlayableCafe(state.storyFlags.day22V4);assert.equal(steps.at(-1).choiceNumber,8);chooseDay22(state,'stop_photos');assert.equal(state.storyFlags.day22V4.phase,'expectations');steps=getDay22V4PlayableCafe(state.storyFlags.day22V4);assert.ok(steps.some(step=>step.status==='stop-shared-photo'));assert.equal(steps.some(step=>step.type==='photoConsentCue'||step.status==='shared-photo-kept'),false);assert.equal(state.storyFlags.day22V4.facts.sharedPhotoDeleted,true);assertSourced(steps);
});

test('SEOUL cafe uses the local difference instead of inventing an occupied marine-view seat',()=>{
  const state=completedDay21ForDay22('SEOUL_DAY');reachCafe(state);const steps=getDay22V4PlayableCafe(state.storyFlags.day22V4);assert.equal(steps[0].location,'seoul-cafe');assert.equal(steps.some(step=>step.text==='창가 자리는 이미 차 있었다.'),false);assert.ok(steps.some(step=>step.text?.startsWith('실제로 선택한 카페에서 같은 일을 겪었다.')));assertSourced(steps);
  chooseDay22(state);chooseDay22(state,'stop_photos');const expectations=getDay22V4PlayableCafe(state.storyFlags.day22V4);assert.equal(expectations.some(step=>step.text?.includes('바다 보고')),false);assert.ok(expectations.some(step=>step.text?.includes('산책하고')));assertSourced(expectations);
  const none=completedDay21ForDay22('NO_TRAVEL');beginDay22V4(none);assert.deepEqual(getDay22V4PlayableCafe(none.storyFlags.day22V4),[{type:'cafeBoundary',nextScene:23,route:'NO_TRAVEL'}]);
});
