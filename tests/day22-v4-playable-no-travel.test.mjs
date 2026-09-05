import assert from 'node:assert/strict';
import test from 'node:test';
import {getDay22V4PlayableNoTravel} from '../src/day22-v4-playable-no-travel.mjs';
import {validateDay22V4SourceStep} from '../src/day22-v4-source-selection.mjs';
import {beginDay22V4} from '../src/day22-v4-state-contract.mjs';
import {chooseDay22,completedDay21ForDay22} from './day22-v4-fixture.mjs';

const assertSourced=steps=>{for(const step of steps)if(['dialogue','message','monologue','stageAction'].includes(step.type))assert.equal(validateDay22V4SourceStep(step),true,`${step.type}:${step.text??step.actionLabel}`);};

test('solo NO_TRAVEL plays C3-8 without Haeun, tickets, Busan food, or lodging',()=>{
  const state=completedDay21ForDay22('NO_TRAVEL');beginDay22V4(state);const all=[];
  for(const number of [3,4,5,7,8]){const steps=getDay22V4PlayableNoTravel(state.storyFlags.day22V4);all.push(...steps);assert.equal(steps.at(-1).choiceNumber,number);assert.equal(steps.at(-1).variant,'NO_TRAVEL');assertSourced(steps);chooseDay22(state);}
  const ending=getDay22V4PlayableNoTravel(state.storyFlags.day22V4);all.push(...ending);assertSourced(ending);assert.deepEqual(ending.at(-1),{type:'noTravelBoundary',nextScene:24,route:'SOLO'});
  const rendered=all.map(step=>step.text??'').join('\n');assert.doesNotMatch(rendered,/표를 샀|밀면을 먹|숙소에|하은이 기다|산책을 고르면|집의 일을 고르면|쉼을 고르면|연락을 쉬기로 했다면|상대가 없는 경우|하은과 연락을 나눴다면/);assert.equal(all.some(step=>step.speaker==='하은'||step.sender==='하은'),false);assert.equal(state.storyFlags.day22V4.facts.noTravelContact,null);assert.equal(state.storyFlags.day22V4.facts.photoMessageSent,false);
});

test('contact-available rest route exposes C6 and only recalls Haeun after that choice',()=>{
  const state=completedDay21ForDay22('REST_SEPARATELY');beginDay22V4(state);
  chooseDay22(state);chooseDay22(state);let steps=getDay22V4PlayableNoTravel(state.storyFlags.day22V4);assert.ok(steps.at(-1).options.some(option=>option.id.endsWith('_send_haeun')));chooseDay22(state,'send_haeun');
  steps=getDay22V4PlayableNoTravel(state.storyFlags.day22V4);assert.equal(steps.at(-1).choiceNumber,6);assert.equal(steps.some(step=>step.speaker==='하은'),false);assert.ok(steps.some(step=>step.text==='오늘 본 풍경을 하은에게 보냈다.'));assert.equal(state.storyFlags.day22V4.facts.photoMessageSent,true);assertSourced(steps);chooseDay22(state,'ask_haeun_day');
  steps=getDay22V4PlayableNoTravel(state.storyFlags.day22V4);assert.equal(steps.at(-1).choiceNumber,7);assert.ok(steps.some(step=>step.speaker==='하은'&&step.text==='응. 그래도 오늘 못 간 건 같으니까.'));assertSourced(steps);
});

test('actual Ara exchange adds only the friend option and travel chapters route away',()=>{
  const state=completedDay21ForDay22('NO_TRAVEL',{ara:true});beginDay22V4(state);chooseDay22(state);chooseDay22(state);const steps=getDay22V4PlayableNoTravel(state.storyFlags.day22V4);assert.ok(steps.at(-1).options.some(option=>option.id.endsWith('_send_exchange')));assert.equal(steps.at(-1).options.some(option=>option.id.endsWith('_send_haeun')),false);assertSourced(steps);
  const travel=completedDay21ForDay22('BUSAN_TRIP');beginDay22V4(travel);assert.deepEqual(getDay22V4PlayableNoTravel(travel.storyFlags.day22V4),[{type:'noTravelBoundary',nextScene:1,route:'BUSAN_TRIP'}]);
});
