import assert from 'node:assert/strict';
import test from 'node:test';
import {getDay23V4PlayableNoTravel} from '../src/day23-v4-playable-no-travel.mjs';
import {validateDay23V4SourceStep} from '../src/day23-v4-source-selection.mjs';
import {beginDay23V4,resolveDay23V4Meeting} from '../src/day23-v4-state-contract.mjs';
import {chooseDay23,completedDay22ForDay23} from './day23-v4-fixture.mjs';

const assertSourced=steps=>{for(const step of steps)if(['dialogue','message','monologue','stageAction'].includes(step.type))assert.equal(validateDay23V4SourceStep(step),true,`${step.type}:${step.text??step.actionLabel}`);};
function enter(state){beginDay23V4(state);chooseDay23(state);chooseDay23(state);}

test('solo NO_TRAVEL plays only SCENE21 C3-8 without Haeun or travel memories',()=>{
  const state=completedDay22ForDay23('NO_TRAVEL');enter(state);const all=[];
  while(state.storyFlags.day23V4.phase!=='ending'){const steps=getDay23V4PlayableNoTravel(state.storyFlags.day23V4);all.push(...steps);assertSourced(steps);chooseDay23(state);}
  const ending=getDay23V4PlayableNoTravel(state.storyFlags.day23V4);all.push(...ending);assertSourced(ending);assert.deepEqual(ending.at(-1),{type:'noTravelBoundary',nextScene:22,route:'SOLO'});
  const rendered=all.map(step=>step.text??'').join('\n');assert.doesNotMatch(rendered,/바다|기차|숙소|하은의 사진|연인처럼 안부를 요구/);assert.equal(all.some(step=>step.speaker==='하은'||step.sender==='하은'),false);
});

test('contact-available NO_TRAVEL meeting is rendered only after current response',()=>{
  const state=completedDay22ForDay23('NO_TRAVEL',{contactAvailableNoTravel:true});enter(state);let steps=getDay23V4PlayableNoTravel(state.storyFlags.day23V4);assert.ok(steps.some(step=>step.speaker==='하은'));assertSourced(steps);chooseDay23(state,'meet_if_accepted');
  steps=getDay23V4PlayableNoTravel(state.storyFlags.day23V4);assert.deepEqual(steps.map(step=>step.type),['meetingConsentCue']);resolveDay23V4Meeting(state,{type:'haeunMeetingResponse',accepted:false});
  steps=getDay23V4PlayableNoTravel(state.storyFlags.day23V4);assert.ok(steps.some(step=>/거절 때문에 하루가 망한/.test(step.text??'')));assert.equal(steps.at(-1).choiceNumber,4);assertSourced(steps);
});

test('pending-contact action uses only an actual carried contact and creates no fake romance cleanup',()=>{
  const state=completedDay22ForDay23('NO_TRAVEL',{pendingContacts:['YURI']});enter(state);for(const phase of ['no_travel_outing','no_travel_good','no_travel_record','no_travel_relationship']){assert.equal(state.storyFlags.day23V4.phase,phase);chooseDay23(state);}
  let steps=getDay23V4PlayableNoTravel(state.storyFlags.day23V4);assert.equal(steps.at(-1).choiceNumber,7);chooseDay23(state,'answer_one');steps=getDay23V4PlayableNoTravel(state.storyFlags.day23V4);assert.ok(steps.some(step=>step.text==='실제 남아 있는 대화 하나에만 답했다.'));assertSourced(steps);
  const clean=completedDay22ForDay23('NO_TRAVEL');enter(clean);for(let i=0;i<4;i++)chooseDay23(clean);chooseDay23(clean,'answer_one');steps=getDay23V4PlayableNoTravel(clean.storyFlags.day23V4);assert.ok(steps.some(step=>step.text==='답할 실제 대화가 없어 새 연락을 만들지 않았다.'));assertSourced(steps);
});

test('travel routes never enter the NO_TRAVEL playable',()=>{
  const state=completedDay22ForDay23('BUSAN_TRIP');beginDay23V4(state);assert.deepEqual(getDay23V4PlayableNoTravel(state.storyFlags.day23V4),[{type:'noTravelBoundary',nextScene:1,route:'BUSAN_TRIP'}]);
});
