import assert from 'node:assert/strict';
import test from 'node:test';
import {getDay23V4PlayableOpening} from '../src/day23-v4-playable-opening.mjs';
import {validateDay23V4SourceStep} from '../src/day23-v4-source-selection.mjs';
import {beginDay23V4,resolveDay23V4Photo,resolveDay23V4Souvenir} from '../src/day23-v4-state-contract.mjs';
import {chooseDay23,completedDay22ForDay23} from './day23-v4-fixture.mjs';

const assertSourced=steps=>{for(const step of steps)if(['dialogue','message','monologue','stageAction'].includes(step.type))assert.equal(validateDay23V4SourceStep(step),true,`${step.type}:${step.text??step.actionLabel}`);};

function playTo(state,target,suffixes={}){const all=[];let guard=0;while(state.storyFlags.day23V4.phase!==target){assert.ok(guard++<16);const chapter=state.storyFlags.day23V4,phase=chapter.phase,steps=getDay23V4PlayableOpening(chapter);all.push(...steps);assertSourced(steps);if(phase==='photo_resolution'){resolveDay23V4Photo(state,{type:'haeunPhotoResponse',accepted:false});continue;}if(phase==='souvenir_resolution'){resolveDay23V4Souvenir(state,{type:'souvenirPurchaseResponse',purchased:false});continue;}chooseDay23(state,suffixes[phase]);}return all;}

test('shared Busan morning plays curtain and cup only from actual shared lodging',()=>{
  const state=completedDay22ForDay23('BUSAN_TRIP');beginDay23V4(state);let steps=getDay23V4PlayableOpening(state.storyFlags.day23V4);assert.ok(steps.some(step=>step.text==='조금만 열었는데.'));assert.equal(steps.at(-1).choiceNumber,1);assertSourced(steps);
  chooseDay23(state,'breakfast_slow');steps=getDay23V4PlayableOpening(state.storyFlags.day23V4);assert.ok(steps.some(step=>step.text==='알아. 숙소 물건은 가져가면 안 되지.'));assert.equal(steps.at(-1).choiceNumber,2);assertSourced(steps);
});

test('separate Busan morning never observes Haeun sleeping, curtain, or shared cup',()=>{
  const state=completedDay22ForDay23('BUSAN_TRIP',{shared:false});beginDay23V4(state);const all=[];all.push(...getDay23V4PlayableOpening(state.storyFlags.day23V4));chooseDay23(state);all.push(...getDay23V4PlayableOpening(state.storyFlags.day23V4));
  const rendered=all.map(step=>step.text??'').join('\n');assert.match(rendered,/그녀의 커튼과 잠든 모습은 보지 못했다/);assert.doesNotMatch(rendered,/조금만 열었는데|어제 네가 여기 두었어|숙소 물건은 가져가면/);assertSourced(all);
});

test('Busan opening reaches SCENE07 through separate photo and souvenir resolutions',()=>{
  const state=completedDay22ForDay23('BUSAN_TRIP',{keepPhoto:false});beginDay23V4(state);const all=playTo(state,'return_ride',{departure_record:'faces',souvenir:'small_item'});
  assert.ok(all.some(step=>step.type==='photoConsentCue'));assert.ok(all.some(step=>step.type==='souvenirPurchaseCue'));assert.equal(state.storyFlags.day23V4.facts.sharedPhotoToday,false);assert.equal(state.storyFlags.day23V4.facts.souvenirPurchase,null);
  const ending=getDay23V4PlayableOpening(state.storyFlags.day23V4);assert.ok(ending.some(step=>step.type==='sceneDirection'&&step.number===7));assert.deepEqual(ending.at(-1),{type:'openingBoundary',nextScene:8,route:'BUSAN_TRIP'});assertSourced(ending);
});

test('Seoul home morning creates no hotel, checkout, train, or absent Haeun staging',()=>{
  const state=completedDay22ForDay23('SEOUL_DAY');beginDay23V4(state);const all=playTo(state,'return_ride');const ending=getDay23V4PlayableOpening(state.storyFlags.day23V4);all.push(...ending);assertSourced(all);
  const rendered=all.map(step=>`${step.location??''} ${step.text??''}`).join('\n');assert.doesNotMatch(rendered,/커튼을 조금 열|중간에 한 번 깼|어제 네가 여기 두었|기차|부산|숙소를 떠|하은이 기다리는 것을 보고|이동편/);assert.match(rendered,/익숙한 천장이었다|여행 짐을 푸는 척하지 않았다/);assert.equal(all.some(step=>step.type==='photoConsentCue'),false);
});

test('NO_TRAVEL common morning routes to SCENE21 after C2',()=>{
  const state=completedDay22ForDay23('NO_TRAVEL');beginDay23V4(state);chooseDay23(state);chooseDay23(state);assert.deepEqual(getDay23V4PlayableOpening(state.storyFlags.day23V4),[{type:'openingBoundary',nextScene:21,route:'NO_TRAVEL'}]);
});
