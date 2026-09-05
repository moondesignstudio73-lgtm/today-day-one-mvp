import assert from 'node:assert/strict';
import test from 'node:test';
import {getDay22V4PlayableOpening} from '../src/day22-v4-playable-opening.mjs';
import {validateDay22V4SourceStep} from '../src/day22-v4-source-selection.mjs';
import {beginDay22V4} from '../src/day22-v4-state-contract.mjs';
import {chooseDay22,completedDay21ForDay22} from './day22-v4-fixture.mjs';

const assertSourced=steps=>{for(const step of steps)if(['dialogue','message','monologue','stageAction'].includes(step.type))assert.equal(validateDay22V4SourceStep(step),true,`${step.type}:${step.text??step.actionLabel}`);};

test('BUSAN opening plays SCENE 01-05 and all first three source choices',()=>{
  const state=completedDay21ForDay22('BUSAN_TRIP');beginDay22V4(state);
  let steps=getDay22V4PlayableOpening(state.storyFlags.day22V4);assert.equal(steps[0].number,1);assert.equal(steps.at(-1).choiceNumber,1);assert.ok(steps.some(step=>step.text==='혹시가 몇 명이야?'));assertSourced(steps);
  chooseDay22(state,'remove_now');steps=getDay22V4PlayableOpening(state.storyFlags.day22V4);assert.ok(steps.some(step=>step.type==='sceneDirection'&&step.number===2));assert.ok(steps.some(step=>step.type==='sceneDirection'&&step.number===3));assert.ok(steps.some(step=>step.text==='표까지 샀는데도 방금까지 안 믿겼어.'));assert.equal(steps.at(-1).choiceNumber,2);assertSourced(steps);
  chooseDay22(state,'close_eyes');steps=getDay22V4PlayableOpening(state.storyFlags.day22V4);assert.ok(steps.some(step=>step.type==='sceneDirection'&&step.number===4&&step.location==='busan-station'));assert.ok(steps.some(step=>step.type==='sceneDirection'&&step.number===5));assert.equal(steps.at(-1).choiceNumber,3);assertSourced(steps);
  chooseDay22(state,'rest_more');steps=getDay22V4PlayableOpening(state.storyFlags.day22V4);assert.deepEqual(steps.at(-1),{type:'openingBoundary',nextScene:6,route:'BUSAN_TRIP'});assertSourced(steps);
});

test('SEOUL opening reuses only location-valid alternatives and creates no ticket or Busan memory',()=>{
  const state=completedDay21ForDay22('SEOUL_DAY');beginDay22V4(state);const all=[];
  for(const suffix of ['carry_own','separate_music','one_nearby']){const steps=getDay22V4PlayableOpening(state.storyFlags.day22V4);all.push(...steps);assertSourced(steps);chooseDay22(state,suffix);}
  const ending=getDay22V4PlayableOpening(state.storyFlags.day22V4);all.push(...ending);assertSourced(ending);
  const rendered=all.map(step=>`${step.location??''} ${step.text??''}`).join('\n');
  assert.doesNotMatch(rendered,/부산역|표까지 샀는데|바다가 여기|train/);assert.match(rendered,/돌아올 수 있는 길/);assert.deepEqual(ending.at(-1),{type:'openingBoundary',nextScene:6,route:'SEOUL_DAY'});
});

test('NO_TRAVEL never enters travel opening or renders an absent companion',()=>{
  const state=completedDay21ForDay22('NO_TRAVEL');beginDay22V4(state);
  assert.deepEqual(getDay22V4PlayableOpening(state.storyFlags.day22V4),[{type:'openingBoundary',nextScene:23,route:'NO_TRAVEL'}]);
});
