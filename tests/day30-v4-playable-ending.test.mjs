import assert from 'node:assert/strict';
import test from 'node:test';
import {day30FriendlyFixture,day30NewRelationshipFixture,day30SoloFixture} from './day30-v4-playable-fixture.mjs';
import {applyDay30V4Choice,beginDay30V4,getDay30V4Options,resolveDay30V4Future,resolveDay30V4Meeting,resolveDay30V4Next,resolveDay30V4Photo,validateDay30V4} from '../src/day30-v4-state-contract.mjs';
import {getDay30V4PlayableOpening} from '../src/day30-v4-playable-opening.mjs';
import {getDay30V4PlayableHaeun} from '../src/day30-v4-playable-haeun.mjs';
import {getDay30V4PlayableBranches} from '../src/day30-v4-playable-branches.mjs';
import {getDay30V4PlayableEnding} from '../src/day30-v4-playable-ending.mjs';
import {getDay30V4RuntimeResolution} from '../src/day30-v4-runtime-resolution.mjs';
import {validateDay30V4SourceStep} from '../src/day30-v4-source-selection.mjs';

const chapter=state=>state.storyFlags.day30V4;
const choose=(state,suffix)=>{const options=getDay30V4Options(chapter(state)),option=suffix?options.find(item=>item.id.endsWith(`_${suffix}`)):options[0];assert.ok(option,`${chapter(state).phase}:${suffix}:${options.map(item=>item.id).join(',')}`);applyDay30V4Choice(state,option.id);};
const sourced=steps=>{for(const step of steps)if(step.source)assert.equal(validateDay30V4SourceStep(step),true,`${step.type}:${step.text??step.actionLabel??step.route}`);};
function open(state){beginDay30V4(state);while(!['meeting_resolution','solo','solo_after_breakup'].includes(chapter(state).phase))choose(state);if(chapter(state).phase==='meeting_resolution'){const cue=getDay30V4PlayableOpening(chapter(state)).at(-1);resolveDay30V4Meeting(state,getDay30V4RuntimeResolution(state,cue));}return state;}
function friendlyToWork(){const state=open(day30FriendlyFixture());getDay30V4PlayableHaeun(chapter(state));choose(state,'eat_first');getDay30V4PlayableHaeun(chapter(state));choose(state,'prepare');let cue=getDay30V4PlayableHaeun(chapter(state)).at(-1);resolveDay30V4Future(state,getDay30V4RuntimeResolution(state,cue));getDay30V4PlayableHaeun(chapter(state));choose(state,'prepare_together');getDay30V4PlayableHaeun(chapter(state));choose(state,'set_time');getDay30V4PlayableHaeun(chapter(state));choose(state,'walk');getDay30V4PlayableHaeun(chapter(state));choose(state,'hear_later');assert.equal(chapter(state).phase,'work');return state;}
function soloToWork(){const state=open(day30SoloFixture());getDay30V4PlayableBranches(chapter(state));choose(state,'eat');assert.equal(chapter(state).phase,'work');return state;}
function araToWork(){const state=open(day30NewRelationshipFixture());getDay30V4PlayableBranches(chapter(state));choose(state,'contact_time');const cue=getDay30V4PlayableBranches(chapter(state)).at(-1);resolveDay30V4Next(state,getDay30V4RuntimeResolution(state,cue));assert.equal(chapter(state).phase,'work');return state;}

test('SCENE22-30 completes the continuing Haeun route with one consented photo and one after story',()=>{
  const state=friendlyToWork(),seen=[];
  const selections={work:'ask_small',money:'shared_only',health:'stop',night_words:'keep_talking',identity:'liked',photo:'together',next:'calendar'};
  while(chapter(state).phase!=='ending'){
    const steps=getDay30V4PlayableEnding(chapter(state));sourced(steps);for(const step of steps)if(step.type==='sceneDirection')seen.push(step.number);
    if(chapter(state).phase==='photo_resolution'){const cue=steps.at(-1);assert.equal(chapter(state).facts.photoResponse,null);const response=getDay30V4RuntimeResolution(state,cue);assert.deepEqual(response,{type:'day30PhotoResponse',target:'HAEUN',accepted:true});resolveDay30V4Photo(state,response);continue;}
    choose(state,selections[chapter(state).phase]);
  }
  const ending=getDay30V4PlayableEnding(chapter(state));sourced(ending);for(const step of ending)if(step.type==='sceneDirection')seen.push(step.number);
  assert.deepEqual(seen,[22,23,24,25,26,27,28,29,30]);
  assert.equal(ending.filter(step=>step.type==='afterStoryDirection').length,1);
  assert.equal(ending.find(step=>step.type==='afterStoryDirection').route,'HAEUN_PREPARE_MARRIAGE');
  assert.match(JSON.stringify(ending),/좋은 집/);assert.doesNotMatch(JSON.stringify(ending),/익숙한 장소를 지나쳤다/);
  assert.equal(ending.at(-1).type,'chapterCompletionCue');assert.equal(ending.at(-1).finalSceneReached,true);
  assert.equal(chapter(state).facts.photoResponse,true);assert.equal(validateDay30V4(chapter(state)),true);
});

test('solo ending skips relationship night, shared money, romantic identity, joint photo and calendar',()=>{
  const state=soloToWork(),seen=[];
  while(chapter(state).phase!=='ending'){
    const steps=getDay30V4PlayableEnding(chapter(state));sourced(steps);for(const step of steps)if(step.type==='sceneDirection')seen.push(step.number);
    const ids=getDay30V4Options(chapter(state)).map(item=>item.id);
    if(chapter(state).phase==='money')assert.equal(ids.some(id=>id.endsWith('_shared_only')),false);
    if(chapter(state).phase==='identity'){assert.equal(ids.some(id=>id.endsWith('_liked')||id.endsWith('_ended')||id.endsWith('_unsaid')),false);}
    if(chapter(state).phase==='photo')assert.equal(ids.some(id=>id.endsWith('_together')),false);
    if(chapter(state).phase==='next')assert.equal(ids.some(id=>id.endsWith('_calendar')),false);
    choose(state);
  }
  const ending=getDay30V4PlayableEnding(chapter(state));sourced(ending);for(const step of ending)if(step.type==='sceneDirection')seen.push(step.number);
  assert.deepEqual(seen,[22,23,24,26,27,28,29,30]);
  assert.equal(ending.find(step=>step.type==='afterStoryDirection').route,'SOLO');
  assert.match(JSON.stringify(ending),/혼자인 하루를 빈칸으로 적지는 않았다/);assert.doesNotMatch(JSON.stringify(ending),/하은|유리|서진|아라/);
});

test('new partner night uses Ara-specific context and rejected photo remains absent',()=>{
  const state=araToWork();
  for(const suffix of ['ask_small','keep_cost','rest']){const steps=getDay30V4PlayableEnding(chapter(state));sourced(steps);choose(state,suffix);}
  let steps=getDay30V4PlayableEnding(chapter(state));sourced(steps);assert.equal(steps.find(step=>step.type==='sceneDirection').number,25);assert.match(JSON.stringify(steps),/다음 촬영 준비/);assert.doesNotMatch(JSON.stringify(steps),/평범해서 좋은데/);choose(state,'hear_voice');
  getDay30V4PlayableEnding(chapter(state));choose(state,'liked');getDay30V4PlayableEnding(chapter(state));choose(state,'together');
  steps=getDay30V4PlayableEnding(chapter(state));sourced(steps);assert.equal(steps.at(-1).type,'day30PhotoCue');resolveDay30V4Photo(state,{type:'day30PhotoResponse',target:'ARA',accepted:false});
  steps=getDay30V4PlayableEnding(chapter(state));sourced(steps);assert.match(JSON.stringify(steps),/사진을 원하지 않는다는 답/);choose(state,'calendar');
  const ending=getDay30V4PlayableEnding(chapter(state));sourced(ending);assert.equal(ending.find(step=>step.type==='afterStoryDirection').route,'ARA_RELATIONSHIP');assert.equal(chapter(state).facts.photoResponse,false);
});

test('every available C22-C28 alternative remains source-backed and replay-valid',()=>{
  const state=friendlyToWork();
  while(chapter(state).phase!=='ending'){
    const phase=chapter(state).phase;
    if(phase==='photo_resolution'){const cue=getDay30V4PlayableEnding(chapter(state)).at(-1);resolveDay30V4Photo(state,getDay30V4RuntimeResolution(state,cue));continue;}
    const options=getDay30V4Options(chapter(state));assert.ok(options.length,phase);
    for(const option of options){const copy=structuredClone(state);applyDay30V4Choice(copy,option.id);let steps=getDay30V4PlayableEnding(chapter(copy));sourced(steps);if(chapter(copy).phase==='photo_resolution'){const cue=steps.at(-1);resolveDay30V4Photo(copy,getDay30V4RuntimeResolution(copy,cue));steps=getDay30V4PlayableEnding(chapter(copy));sourced(steps);}assert.equal(validateDay30V4(chapter(copy)),true,`${phase}:${option.id}`);}
    const preferred=phase==='photo'?options.find(option=>option.id.endsWith('_view')):options[0];applyDay30V4Choice(state,preferred.id);
  }
});
