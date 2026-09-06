import assert from 'node:assert/strict';
import test from 'node:test';
import {day30FriendlyFixture,day30NewRelationshipFixture,day30SoloFixture} from './day30-v4-playable-fixture.mjs';
import {applyDay30V4Choice,beginDay30V4,getDay30V4Options,resolveDay30V4Future,resolveDay30V4Meeting,resolveDay30V4Next,validateDay30V4} from '../src/day30-v4-state-contract.mjs';
import {getDay30V4PlayableOpening} from '../src/day30-v4-playable-opening.mjs';
import {getDay30V4PlayableHaeun} from '../src/day30-v4-playable-haeun.mjs';
import {getDay30V4PlayableBranches} from '../src/day30-v4-playable-branches.mjs';
import {getDay30V4RuntimeResolution} from '../src/day30-v4-runtime-resolution.mjs';
import {validateDay30V4SourceStep} from '../src/day30-v4-source-selection.mjs';

const chapter=state=>state.storyFlags.day30V4;
const choose=(state,suffix)=>{const options=getDay30V4Options(chapter(state)),option=suffix?options.find(item=>item.id.endsWith(`_${suffix}`)):options[0];assert.ok(option,`${chapter(state).phase}:${suffix}:${options.map(item=>item.id).join(',')}`);applyDay30V4Choice(state,option.id);};
const sourced=steps=>{for(const step of steps)if(['dialogue','monologue','playerNarration','storyActionCue'].includes(step.type))assert.equal(validateDay30V4SourceStep(step),true,`${step.type}:${step.text??step.actionLabel}`);};
const sceneNumber=steps=>steps.find(step=>step.type==='sceneDirection')?.number;

function open(state){beginDay30V4(state);while(!['meeting_resolution','solo','solo_after_breakup'].includes(chapter(state).phase))choose(state);if(chapter(state).phase==='meeting_resolution'){const cue=getDay30V4PlayableOpening(chapter(state)).at(-1);resolveDay30V4Meeting(state,getDay30V4RuntimeResolution(state,cue));}return state;}
function enterHaeun(outcome){const state=open(day30FriendlyFixture());getDay30V4PlayableHaeun(chapter(state));choose(state,'eat_first');getDay30V4PlayableHaeun(chapter(state));choose(state,'prepare');const cue=getDay30V4PlayableHaeun(chapter(state)).at(-1),response=outcome==='END'?{type:'day30FutureResponse',outcome:'END',contactAllowed:false}:outcome==='NEED_TIME'?{type:'day30FutureResponse',outcome:'NEED_TIME',contactAllowed:true}:getDay30V4RuntimeResolution(state,cue);resolveDay30V4Future(state,response);return state;}

test('SCENE14-15 plays an actual Haeun breakup without failure framing or forced reconciliation',()=>{
  for(const breakupChoice of ['no_binding','still_like','different_tomorrow']){
    const state=enterHaeun('END');
    let steps=getDay30V4PlayableBranches(chapter(state));sourced(steps);assert.equal(sceneNumber(steps),14);choose(state,breakupChoice);
    steps=getDay30V4PlayableBranches(chapter(state));sourced(steps);assert.equal(sceneNumber(steps),15);assert.match(JSON.stringify(steps),/우리는 다른 방향으로 걸었다/);assert.doesNotMatch(JSON.stringify(steps),/실패|다시 만나자/);
    choose(state,'eat_rest');steps=getDay30V4PlayableBranches(chapter(state));sourced(steps);assert.equal(steps.at(-1).nextScene,22);assert.equal(chapter(state).facts.route,'HAEUN_ENDED');assert.equal(chapter(state).facts.contactAllowed,false);assert.equal(validateDay30V4(chapter(state)),true);
  }
});

test('SCENE18 keeps the actual Ara route exclusive and waits for the next-meeting response',()=>{
  const state=open(day30NewRelationshipFixture());
  let steps=getDay30V4PlayableBranches(chapter(state));sourced(steps);assert.equal(sceneNumber(steps),18);assert.deepEqual(steps.find(step=>step.type==='sceneDirection').characters,['ARA']);assert.doesNotMatch(JSON.stringify(steps),/유리|서진|하은/);
  choose(state,'contact_time');assert.equal(chapter(state).phase,'next_resolution');assert.equal(chapter(state).facts.nextCommitment,null);
  steps=getDay30V4PlayableBranches(chapter(state));sourced(steps);const cue=steps.at(-1);assert.equal(cue.type,'day30NextCue');assert.equal(cue.target,'ARA');
  const response=getDay30V4RuntimeResolution(state,cue);assert.equal(response.outcome,'ACCEPTED');resolveDay30V4Next(state,response);
  steps=getDay30V4PlayableBranches(chapter(state));sourced(steps);assert.equal(steps.at(-1).nextScene,22);assert.equal(chapter(state).facts.route,'ARA_RELATIONSHIP');assert.equal(chapter(state).facts.nextCommitment,'ARA_NEXT_MEETING');assert.equal(validateDay30V4(chapter(state)),true);
});

test('SCENE19 does not ask Haeun for another meeting after she requested time',()=>{
  const state=enterHaeun('NEED_TIME');
  let steps=getDay30V4PlayableBranches(chapter(state));sourced(steps);assert.equal(sceneNumber(steps),19);assert.deepEqual(steps.at(-1).options.map(option=>option.id.split('_').at(-1)),['slow','promise']);assert.doesNotMatch(JSON.stringify(steps),/무슨 말 하려고 했어/);
  choose(state,'slow');steps=getDay30V4PlayableBranches(chapter(state));sourced(steps);assert.equal(steps.at(-1).nextScene,22);assert.equal(chapter(state).facts.nextCommitment,null);assert.equal(chapter(state).facts.route,'GETTING_TO_KNOW');
});

test('SCENE20 preserves a solo day without inventing Jihoon availability',()=>{
  for(const suffix of ['walk','eat','sit']){const state=open(day30SoloFixture());let steps=getDay30V4PlayableBranches(chapter(state));sourced(steps);assert.equal(sceneNumber(steps),20);assert.doesNotMatch(JSON.stringify(steps),/지훈/);choose(state,suffix);steps=getDay30V4PlayableBranches(chapter(state));sourced(steps);assert.equal(steps.at(-1).nextScene,22);assert.equal(chapter(state).facts.route,'SOLO');assert.equal(chapter(state).facts.meetingTarget,null);}
});
