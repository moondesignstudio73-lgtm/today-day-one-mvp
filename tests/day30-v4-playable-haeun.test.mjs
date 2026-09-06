import assert from 'node:assert/strict';
import test from 'node:test';
import {day30FriendlyFixture} from './day30-v4-playable-fixture.mjs';
import {
  applyDay30V4Choice,
  beginDay30V4,
  getDay30V4Options,
  resolveDay30V4Future,
  resolveDay30V4Meeting,
  resolveDay30V4Next,
  validateDay30V4,
} from '../src/day30-v4-state-contract.mjs';
import {getDay30V4PlayableOpening} from '../src/day30-v4-playable-opening.mjs';
import {getDay30V4PlayableHaeun} from '../src/day30-v4-playable-haeun.mjs';
import {getDay30V4RuntimeResolution} from '../src/day30-v4-runtime-resolution.mjs';
import {validateDay30V4SourceStep} from '../src/day30-v4-source-selection.mjs';

const chapter=state=>state.storyFlags.day30V4;
const choose=(state,suffix)=>{const options=getDay30V4Options(chapter(state)),option=suffix?options.find(item=>item.id.endsWith(`_${suffix}`)):options[0];assert.ok(option,`${chapter(state).phase}:${suffix}`);applyDay30V4Choice(state,option.id);};
const sourced=steps=>{for(const step of steps)if(['dialogue','monologue','playerNarration','storyActionCue'].includes(step.type))assert.equal(validateDay30V4SourceStep(step),true,`${step.type}:${step.text??step.actionLabel}`);};
const sceneNumber=steps=>steps.find(step=>step.type==='sceneDirection')?.number;

function startHaeun(){
  const state=day30FriendlyFixture();
  beginDay30V4(state);
  while(chapter(state).phase!=='meeting_resolution')choose(state);
  const cue=getDay30V4PlayableOpening(chapter(state)).at(-1);
  resolveDay30V4Meeting(state,getDay30V4RuntimeResolution(state,cue));
  assert.equal(chapter(state).phase,'haeun_meal');
  return state;
}

function readHaeun(state,seen){
  const steps=getDay30V4PlayableHaeun(chapter(state));
  sourced(steps);
  const number=sceneNumber(steps);
  if(number!=null)seen.push(number);
  return steps;
}

test('SCENE05-09 and 13 implement the prepare-together route without completing a wedding',()=>{
  const state=startHaeun(),seen=[];
  readHaeun(state,seen); choose(state,'eat_first');
  readHaeun(state,seen); choose(state,'prepare');
  let steps=readHaeun(state,seen),cue=steps.at(-1);
  assert.equal(cue.type,'day30FutureCue');
  assert.equal(chapter(state).facts.futureResponse,null);
  assert.deepEqual(getDay30V4RuntimeResolution(state,cue),{type:'day30FutureResponse',outcome:'PREPARE_MARRIAGE',contactAllowed:true});
  resolveDay30V4Future(state,getDay30V4RuntimeResolution(state,cue));
  readHaeun(state,seen); choose(state,'prepare_together');
  readHaeun(state,seen); choose(state,'set_time');
  readHaeun(state,seen); choose(state,'shop');
  steps=readHaeun(state,seen); cue=steps.at(-1);
  assert.equal(cue.type,'day30NextCue');
  resolveDay30V4Next(state,getDay30V4RuntimeResolution(state,cue));
  readHaeun(state,seen); choose(state,'hear_later');
  steps=readHaeun(state,seen);
  assert.equal(steps.at(-1).nextScene,22);
  assert.deepEqual(seen,[5,6,7,8,9,13]);
  assert.equal(chapter(state).facts.nextCommitment,'HAEUN_NEXT_TIME');
  assert.equal(chapter(state).facts.route,'HAEUN_PREPARE_MARRIAGE');
  assert.equal(chapter(state).phase,'work');
  assert.equal(validateDay30V4(chapter(state)),true);
  assert.doesNotMatch(JSON.stringify(steps),/결혼식이 끝|결혼 완료/);
});

test('SCENE10-11 keeps the deferred-decision route separate from preparation scenes',()=>{
  const state=startHaeun(),seen=[];
  readHaeun(state,seen); choose(state,'short_words');
  readHaeun(state,seen); choose(state,'rediscuss');
  let cue=readHaeun(state,seen).at(-1);
  assert.equal(getDay30V4RuntimeResolution(state,cue).outcome,'REDISCUSS');
  resolveDay30V4Future(state,getDay30V4RuntimeResolution(state,cue));
  readHaeun(state,seen); choose(state,'live_then_talk');
  readHaeun(state,seen); choose(state,'say_not_okay');
  let continuing=readHaeun(state,seen);
  assert.match(JSON.stringify(continuing),/걱정이 없어진 것은 아니었다/);
  choose(state,'own_day');
  const steps=readHaeun(state,seen);
  assert.deepEqual(seen,[5,6,10,11,13]);
  assert.equal(steps.at(-1).nextScene,22);
  assert.equal(chapter(state).facts.route,'HAEUN_REDISCUSS');
  assert.equal(chapter(state).facts.nextCommitment,'HAEUN_REDISCUSSION');
  assert.equal(validateDay30V4(chapter(state)),true);
});

test('SCENE12 keeps the long-term-dating route separate from marriage preparation',()=>{
  const state=startHaeun(),seen=[];
  readHaeun(state,seen); choose(state,'listen_first');
  readHaeun(state,seen); choose(state,'relationship');
  const cue=readHaeun(state,seen).at(-1);
  assert.equal(getDay30V4RuntimeResolution(state,cue).outcome,'LONG_DATING');
  resolveDay30V4Future(state,getDay30V4RuntimeResolution(state,cue));
  readHaeun(state,seen); choose(state,'respect_space');
  let continuing=readHaeun(state,seen);
  assert.match(JSON.stringify(continuing),/이건 누가 먹어/);
  choose(state,'our_time');
  const nextCue=readHaeun(state,seen).at(-1);
  assert.equal(nextCue.type,'day30NextCue');
  resolveDay30V4Next(state,getDay30V4RuntimeResolution(state,nextCue));
  const steps=readHaeun(state,seen);
  assert.deepEqual(seen,[5,6,12,13]);
  assert.equal(steps.at(-1).nextScene,22);
  assert.equal(chapter(state).facts.route,'HAEUN_LONG_DATING');
  assert.equal(validateDay30V4(chapter(state)),true);
});

test('changed feelings and an independent need-time response stop before later Haeun scenes',()=>{
  for(const selected of ['changed','prepare']){
    const state=startHaeun(),seen=[];
    readHaeun(state,seen); choose(state,'eat_first');
    readHaeun(state,seen); choose(state,selected);
    const cue=readHaeun(state,seen).at(-1);
    const response=selected==='changed'?getDay30V4RuntimeResolution(state,cue):{type:'day30FutureResponse',outcome:'NEED_TIME',contactAllowed:true};
    assert.equal(response.outcome,'NEED_TIME');
    resolveDay30V4Future(state,response);
    const steps=readHaeun(state,seen);
    assert.deepEqual(seen,[5,6]);
    assert.equal(steps.at(-1).nextScene,19);
    assert.equal(chapter(state).phase,'getting_to_know');
    assert.equal(validateDay30V4(chapter(state)),true);
  }
});

test('every alternate C7-C12 result remains visible and source-backed at its next scene',()=>{
  const enterFuture=selected=>{const state=startHaeun(),seen=[];readHaeun(state,seen);choose(state,'eat_first');readHaeun(state,seen);choose(state,selected);const cue=readHaeun(state,seen).at(-1);resolveDay30V4Future(state,getDay30V4RuntimeResolution(state,cue));return {state,seen};};

  for(const suffix of ['prepare_together','live_together','listen_values']){const {state,seen}=enterFuture('prepare');readHaeun(state,seen);choose(state,suffix);readHaeun(state,seen);}
  for(const suffix of ['set_time','living_condition','now_later']){const {state,seen}=enterFuture('prepare');readHaeun(state,seen);choose(state,'prepare_together');readHaeun(state,seen);choose(state,suffix);readHaeun(state,seen);}
  for(const suffix of ['walk','goodbye','shop']){const {state,seen}=enterFuture('prepare');readHaeun(state,seen);choose(state,'prepare_together');readHaeun(state,seen);choose(state,'set_time');readHaeun(state,seen);choose(state,suffix);readHaeun(state,seen);}
  for(const suffix of ['live_then_talk','honest_work_body','hear_limit']){const {state,seen}=enterFuture('rediscuss');readHaeun(state,seen);choose(state,suffix);readHaeun(state,seen);}
  for(const suffix of ['wanted_meeting','say_not_okay','quiet']){const {state,seen}=enterFuture('rediscuss');readHaeun(state,seen);choose(state,'live_then_talk');readHaeun(state,seen);choose(state,suffix);readHaeun(state,seen);}
  for(const suffix of ['respect_space','talk_if_cohabit','say_needs']){const {state,seen}=enterFuture('relationship');readHaeun(state,seen);choose(state,suffix);readHaeun(state,seen);}
});
