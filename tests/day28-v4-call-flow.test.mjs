import test from 'node:test';
import assert from 'node:assert/strict';
import {day28FriendlyFixture} from './day28-v4-playable-fixture.mjs';
import {applyDay28V4Choice,getDay28V4Options,resolveDay28V4Meeting,resolveDay28V4Relationship,validateDay28V4} from '../src/day28-v4-state-contract.mjs';
import {getDay28V4GameSegment} from '../src/day28-v4-game-bridge.mjs';
import {getDay28V4RuntimeResolution} from '../src/day28-v4-runtime-resolution.mjs';

const choose=(state,suffix)=>{const options=getDay28V4Options(state.storyFlags.day28V4),option=suffix?options.find(item=>item.id.endsWith(`_${suffix}`)):options[0];assert.ok(option,`${state.storyFlags.day28V4.phase}:${suffix}`);applyDay28V4Choice(state,option.id);};

test('a new accepted call uses only call-safe choices and skips walk, bench, touch and home invitation scenes',()=>{
  const state=day28FriendlyFixture();choose(state,'short');
  resolveDay28V4Meeting(state,{type:'day28MeetingResponse',target:'HAEUN',outcome:'ACCEPTED',method:'CALL'});
  assert.equal(state.storyFlags.day28V4.choices.at(-1).flow,'CALL_CONVERSATION');
  let steps=getDay28V4GameSegment(state);
  assert.equal(steps.find(step=>step.type==='transition').characterId,null);
  assert.equal(steps.find(step=>step.type==='choice').prompt,'통화를 시작하며');
  assert.equal(steps.find(step=>step.type==='choice').options.at(-1).label,'지금 이야기할 여유가 있어?');
  choose(state,'ask_path');
  steps=getDay28V4GameSegment(state);
  assert.match(JSON.stringify(steps),/보이지 않는 표정을 추측하지 않았다/);
  assert.doesNotMatch(JSON.stringify(steps),/짧은 길로 걸음|haeun-looks|haeun-stops/);
  choose(state);
  steps=getDay28V4GameSegment(state);
  assert.equal(steps.find(step=>step.type==='choice').options.some(option=>option.id.endsWith('_walk_together')),false);
  choose(state);choose(state);
  assert.equal(state.storyFlags.day28V4.phase,'relationship_wish');
  steps=getDay28V4GameSegment(state);
  assert.equal(steps.some(step=>step.sceneNumber===6||step.sceneNumber===7),false);
  choose(state,'continue_lovers');resolveDay28V4Relationship(state,{type:'day28RelationshipResponse',outcome:'CONTINUE',contactAllowed:true});
  assert.equal(state.storyFlags.day28V4.phase,'continuing_night');
  steps=getDay28V4GameSegment(state);
  assert.ok(steps.some(step=>step.type==='phoneCallCue'));
  assert.equal(steps.find(step=>step.type==='transition').characterId,null);
  assert.doesNotMatch(JSON.stringify(steps),/벤치|손잡|포옹|키스|집 초대|day28ContactCue|day28HomeInvitationCue/);
  assert.equal(validateDay28V4(state.storyFlags.day28V4),true);
});

test('a pre-fix accepted CALL record without the flow marker remains valid and keeps its saved phase rules',()=>{
  const state=day28FriendlyFixture();choose(state);resolveDay28V4Meeting(state,{type:'day28MeetingResponse',target:'HAEUN',outcome:'ACCEPTED',method:'CALL'});
  const legacy=structuredClone(state.storyFlags.day28V4);delete legacy.choices.at(-1).flow;
  assert.equal(validateDay28V4(legacy),true);
  state.storyFlags.day28V4=legacy;
  choose(state);choose(state);choose(state);choose(state);
  assert.equal(state.storyFlags.day28V4.phase,'changed_path');
  assert.equal(validateDay28V4(state.storyFlags.day28V4),true);
});

test('low energy alone does not silently replace a normal meeting with a call',()=>{
  const state=day28FriendlyFixture();state.storyFlags.day28V4.input.currentEnergy=20;
  // Preserve the sealed fixture by testing the pure resolver after the chosen plan.
  state.storyFlags.day28V4.facts.morningPlan='USUAL';
  assert.equal(getDay28V4RuntimeResolution(state,{type:'day28MeetingCue',target:'HAEUN'}).method,'IN_PERSON');
  state.storyFlags.day28V4.facts.morningPlan='SHORT';
  assert.equal(getDay28V4RuntimeResolution(state,{type:'day28MeetingCue',target:'HAEUN'}).method,'CALL');
});
