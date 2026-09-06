import test from 'node:test';
import assert from 'node:assert/strict';
import {day28FriendlyFixture} from './day28-v4-playable-fixture.mjs';
import {applyDay28V4Choice,getDay28V4Options,resolveDay28V4Contact,resolveDay28V4Meeting,resolveDay28V4Relationship,validateDay28V4} from '../src/day28-v4-state-contract.mjs';
import {getDay28V4GameSegment} from '../src/day28-v4-game-bridge.mjs';

function atIntimacy(){
  const state=day28FriendlyFixture();
  const choose=suffix=>{const options=getDay28V4Options(state.storyFlags.day28V4),option=suffix?options.find(item=>item.id.endsWith(`_${suffix}`)):options[0];assert.ok(option);applyDay28V4Choice(state,option.id);};
  choose();resolveDay28V4Meeting(state,{type:'day28MeetingResponse',target:'HAEUN',outcome:'ACCEPTED',method:'IN_PERSON'});
  for(let number=2;number<=8;number++)choose();
  resolveDay28V4Relationship(state,{type:'day28RelationshipResponse',outcome:'CONTINUE',contactAllowed:true});
  choose();choose('hand');resolveDay28V4Contact(state,{type:'day28ContactResponse',contact:'HAND',outcome:'ACCEPTED'});
  assert.equal(state.storyFlags.day28V4.phase,'continuing_intimacy');
  return {state,choose};
}

test('C11 goodbye goes directly to the farewell instead of inventing daily talk or a home invitation',()=>{
  const {state,choose}=atIntimacy();choose('goodbye');
  const chapter=state.storyFlags.day28V4,record=chapter.choices.at(-1),steps=getDay28V4GameSegment(state);
  assert.equal(chapter.phase,'continuing_farewell');
  assert.equal(record.flow,'DIRECT_FAREWELL');
  assert.equal(chapter.facts.dailyListening,null);
  assert.equal(chapter.facts.homeInvitationResponse,null);
  assert.ok(steps.some(step=>step.type==='transition'&&step.sceneNumber===16));
  assert.equal(steps.some(step=>step.type==='transition'&&[14,15].includes(step.sceneNumber)),false);
  assert.doesNotMatch(JSON.stringify(steps),/양말|집 초대|day28HomeInvitationCue/);
  assert.match(JSON.stringify(steps),/아쉬움이 남아도 오늘의 거리를 지키며 인사했다/);
  assert.equal(validateDay28V4(chapter),true);
});

test('a pre-fix C11 goodbye save without the flow marker remains replay-valid',()=>{
  const {state,choose}=atIntimacy();choose('goodbye');
  const legacy=structuredClone(state.storyFlags.day28V4);
  delete legacy.choices.at(-1).flow;
  legacy.phase='daily_listening';
  assert.equal(validateDay28V4(legacy),true);
});
