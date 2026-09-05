import assert from 'node:assert/strict';
import test from 'node:test';
import {getDay22V4PlayableMealPhoto} from '../src/day22-v4-playable-meal-photo.mjs';
import {validateDay22V4SourceStep} from '../src/day22-v4-source-selection.mjs';
import {beginDay22V4} from '../src/day22-v4-state-contract.mjs';
import {chooseDay22,completedDay21ForDay22} from './day22-v4-fixture.mjs';

const assertSourced=steps=>{for(const step of steps)if(['dialogue','message','monologue','stageAction'].includes(step.type))assert.equal(validateDay22V4SourceStep(step),true,`${step.type}:${step.text??step.actionLabel}`);};
const reachMeal=state=>{beginDay22V4(state);chooseDay22(state);chooseDay22(state);chooseDay22(state);};

test('BUSAN C4-6 preserves separate-meeting agreement and records actual reunion',()=>{
  const state=completedDay21ForDay22('BUSAN_TRIP');reachMeal(state);let steps=getDay22V4PlayableMealPhoto(state.storyFlags.day22V4);assert.equal(steps[0].number,6);assert.equal(steps[0].location,'busan-restaurant');assert.equal(steps.at(-1).choiceNumber,4);assertSourced(steps);
  chooseDay22(state,'ask_taste');steps=getDay22V4PlayableMealPhoto(state.storyFlags.day22V4);assert.ok(steps.some(step=>step.text==='그럼 두 사람이 먹은 것 같네.'));assert.equal(steps.at(-1).choiceNumber,5);assertSourced(steps);
  chooseDay22(state,'separate_briefly');steps=getDay22V4PlayableMealPhoto(state.storyFlags.day22V4);assert.equal(state.storyFlags.day22V4.facts.separateMeeting.reunited,false);assert.ok(steps.some(step=>step.text==='지금 옆에 하은이 없는데도 좋은 풍경이었다.'));assert.equal(steps.some(step=>step.speaker==='하은'&&step.source?.scene===8),false);assert.equal(steps.at(-1).choiceNumber,6);assertSourced(steps);
  chooseDay22(state,'show_haeun');assert.equal(state.storyFlags.day22V4.facts.separateMeeting.reunited,true);steps=getDay22V4PlayableMealPhoto(state.storyFlags.day22V4);assert.ok(steps.some(step=>step.type==='sceneDirection'&&step.number===10));assert.ok(steps.some(step=>step.text==='의자 사진은 안 찍었어.'));assert.deepEqual(steps.at(-1),{type:'mealPhotoBoundary',nextScene:11,route:'BUSAN_TRIP'});assertSourced(steps);
});

test('SEOUL C4-6 uses a local restaurant and walk without positive Busan memories',()=>{
  const state=completedDay21ForDay22('SEOUL_DAY');reachMeal(state);const all=[];for(const suffix of ['just_eat','sit_together','album_only']){const steps=getDay22V4PlayableMealPhoto(state.storyFlags.day22V4);all.push(...steps);assertSourced(steps);chooseDay22(state,suffix);}const ending=getDay22V4PlayableMealPhoto(state.storyFlags.day22V4);all.push(...ending);assertSourced(ending);
  assert.equal(all.some(step=>step.location==='busan-restaurant'||step.location==='haeundae'),false);const rendered=all.map(step=>step.text??'').join('\n');assert.doesNotMatch(rendered,/바다 쪽으로 나가자|부산역|표까지 샀는데|밀면집에 가지 않았다면|부산 바다가 된 척/);assert.match(rendered,/가까운 식당에서 한 입씩/);assert.deepEqual(ending.at(-1),{type:'mealPhotoBoundary',nextScene:11,route:'SEOUL_DAY'});
});

test('photo exchange option is filtered before the playable and NO_TRAVEL routes away',()=>{
  const noAra=completedDay21ForDay22('BUSAN_TRIP');reachMeal(noAra);chooseDay22(noAra);chooseDay22(noAra);let steps=getDay22V4PlayableMealPhoto(noAra.storyFlags.day22V4);assert.equal(steps.at(-1).options.some(option=>option.id.endsWith('_send_exchange')),false);assertSourced(steps);
  const ara=completedDay21ForDay22('BUSAN_TRIP',{ara:true});reachMeal(ara);chooseDay22(ara);chooseDay22(ara);steps=getDay22V4PlayableMealPhoto(ara.storyFlags.day22V4);assert.equal(steps.at(-1).options.some(option=>option.id.endsWith('_send_exchange')),true);assertSourced(steps);
  const none=completedDay21ForDay22('NO_TRAVEL');beginDay22V4(none);assert.deepEqual(getDay22V4PlayableMealPhoto(none.storyFlags.day22V4),[{type:'mealPhotoBoundary',nextScene:23,route:'NO_TRAVEL'}]);
});
