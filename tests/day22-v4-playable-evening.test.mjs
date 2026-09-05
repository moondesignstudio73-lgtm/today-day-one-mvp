import assert from 'node:assert/strict';
import test from 'node:test';
import {getDay22V4PlayableEvening} from '../src/day22-v4-playable-evening.mjs';
import {validateDay22V4SourceStep} from '../src/day22-v4-source-selection.mjs';
import {beginDay22V4,resolveDay22V4Contact,resolveDay22V4Photo} from '../src/day22-v4-state-contract.mjs';
import {chooseDay22,completedDay21ForDay22} from './day22-v4-fixture.mjs';

const assertSourced=steps=>{for(const step of steps)if(step.source)assert.equal(validateDay22V4SourceStep(step),true,`${step.type}:${step.text??step.actionLabel??step.prompt}`);};
const reachEvening=state=>{beginDay22V4(state);while(state.storyFlags.day22V4.phase!=='rest_order'){if(state.storyFlags.day22V4.phase==='photo_resolution')resolveDay22V4Photo(state,{type:'haeunPhotoResponse',keepAccepted:false});else chooseDay22(state);}};

test('shared Busan room waits for current contact consent and preserves a rejection',()=>{
  const state=completedDay21ForDay22('BUSAN_TRIP');reachEvening(state);let steps=getDay22V4PlayableEvening(state.storyFlags.day22V4);assert.equal(steps[0].number,15);assert.equal(steps[0].location,'busan-shared-lodging');assert.equal(steps.at(-1).choiceNumber,11);assertSourced(steps);
  chooseDay22(state);steps=getDay22V4PlayableEvening(state.storyFlags.day22V4);assert.ok(steps.some(step=>step.type==='sceneDirection'&&step.number===16&&step.character==='girlfriend'));assert.equal(steps.at(-1).choiceNumber,12);assertSourced(steps);
  chooseDay22(state,'like_relaxed_face');steps=getDay22V4PlayableEvening(state.storyFlags.day22V4);assert.equal(steps.at(-1).choiceNumber,13);assertSourced(steps);chooseDay22(state);steps=getDay22V4PlayableEvening(state.storyFlags.day22V4);assert.equal(steps.at(-1).choiceNumber,14);assertSourced(steps);
  chooseDay22(state,'hug');steps=getDay22V4PlayableEvening(state.storyFlags.day22V4);assert.equal(steps.at(-1).type,'contactConsentCue');assert.equal(state.storyFlags.day22V4.facts.todayContact,null);assertSourced(steps);resolveDay22V4Contact(state,{type:'haeunContactResponse',contact:'HUG',accepted:false});
  steps=getDay22V4PlayableEvening(state.storyFlags.day22V4);assert.ok(steps.some(step=>step.type==='contactDeclined'));assert.equal(steps.some(step=>step.status==='hug-accepted'),false);assert.equal(steps.at(-1).choiceNumber,15);assertSourced(steps);chooseDay22(state);steps=getDay22V4PlayableEvening(state.storyFlags.day22V4);assert.equal(steps.at(-1).choiceNumber,16);assertSourced(steps);chooseDay22(state,'eat_simple');steps=getDay22V4PlayableEvening(state.storyFlags.day22V4);assert.ok(steps.some(step=>step.type==='sceneDirection'&&step.number===21));assert.deepEqual(steps.at(-1),{type:'eveningBoundary',nextScene:24,route:'BUSAN_SHARED'});assert.equal(state.storyFlags.day22V4.facts.todayContact,'NONE');assertSourced(steps);
});

test('separate Busan rooms expose no face praise, physical contact, or shared bed memory',()=>{
  const state=completedDay21ForDay22('BUSAN_TRIP',{shared:false});reachEvening(state);let steps=getDay22V4PlayableEvening(state.storyFlags.day22V4);assert.equal(steps.some(step=>step.type==='monologue'&&/장면이 생기지 않았다/.test(step.text)),false);chooseDay22(state);steps=getDay22V4PlayableEvening(state.storyFlags.day22V4);assert.equal(steps.some(step=>step.text==='하은이 씻고 편한 차림으로 나왔다.'),false);assert.equal(steps.some(step=>/묘사하지 않았다/.test(step.text??'')),false);assert.equal(steps.at(-1).options.some(option=>option.id.endsWith('_like_relaxed_face')),false);assertSourced(steps);chooseDay22(state);steps=getDay22V4PlayableEvening(state.storyFlags.day22V4);assert.equal(steps.some(step=>/침대 가장자리|추억은 생기지 않았다/.test(step.text??'')),false);assert.ok(steps.some(step=>step.speaker==='나'&&step.text==='지금 통화하는 것도 오늘의 일부네.'));chooseDay22(state);steps=getDay22V4PlayableEvening(state.storyFlags.day22V4);assert.equal(steps.at(-1).options.length,1);assert.ok(steps.at(-1).options[0].id.endsWith('_rest_as_is'));assert.equal(steps.some(step=>step.text==='하은이 내 쪽으로 손을 내밀었다.'),false);assertSourced(steps);
  chooseDay22(state);chooseDay22(state);chooseDay22(state);steps=getDay22V4PlayableEvening(state.storyFlags.day22V4);assert.ok(steps.some(step=>step.text?.startsWith('잘 자라는 인사를 하고 자기 방으로 갔다.')));assert.deepEqual(steps.at(-1),{type:'eveningBoundary',nextScene:24,route:'BUSAN_SEPARATE'});assertSourced(steps);
});

test('Seoul day uses no lodging scene and returns through SCENE22 without SCENE21',()=>{
  const state=completedDay21ForDay22('SEOUL_DAY');reachEvening(state);let steps=getDay22V4PlayableEvening(state.storyFlags.day22V4);assert.equal(steps[0].location,'seoul-evening');assert.equal(steps.some(step=>step.text?.includes('숙소에 들어가는 화면은 없었다')),false);assert.ok(steps.some(step=>step.text==='우리는 집으로 돌아가기 전에 잠깐 앉았다. 쉬고 나서 귀가할지 바로 갈지 골랐다.'));assert.equal(steps.some(step=>step.text?.includes('실제 예약한 곳')),false);assertSourced(steps);
  for(let i=0;i<6;i++){chooseDay22(state);if(i<5){steps=getDay22V4PlayableEvening(state.storyFlags.day22V4);assert.equal(steps.some(step=>step.text?.startsWith('숙소에 도착했다고')),false);assert.equal(steps.some(step=>/각자 공간이면|서울 당일이면/.test(step.text??'')),false);assertSourced(steps);}}
  steps=getDay22V4PlayableEvening(state.storyFlags.day22V4);assert.equal(steps.some(step=>step.type==='sceneDirection'&&step.number===21),false);assert.deepEqual(steps.at(-1),{type:'eveningBoundary',nextScene:22,route:'SEOUL_DAY'});assert.equal(state.storyFlags.day22V4.facts.todayContact,'NONE');assertSourced(steps);
});
