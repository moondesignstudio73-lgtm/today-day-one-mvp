import test from 'node:test';
import assert from 'node:assert/strict';
import {day28FriendlyFixture,day28NewMeetingFixture} from './day28-v4-playable-fixture.mjs';
import {applyDay28V4Choice,getDay28V4Options,resolveDay28V4Contact,resolveDay28V4Meeting,resolveDay28V4NewRelationship,resolveDay28V4Relationship,validateDay28V4} from '../src/day28-v4-state-contract.mjs';
import {getDay28V4RuntimeResolution} from '../src/day28-v4-runtime-resolution.mjs';
import {getDay28V4PlayableMiddle} from '../src/day28-v4-playable-middle.mjs';
import {getDay28V4PlayableEnding} from '../src/day28-v4-playable-ending.mjs';

const seal=input=>{let hash=2166136261;for(const char of JSON.stringify(input)){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619);}return (hash>>>0).toString(16).padStart(8,'0');};
const choose=(state,suffix)=>{const options=getDay28V4Options(state.storyFlags.day28V4),option=suffix?options.find(item=>item.id.endsWith(`_${suffix}`)):options[0];assert.ok(option);applyDay28V4Choice(state,option.id);};
function atRelationship(){const state=day28FriendlyFixture();choose(state);resolveDay28V4Meeting(state,{type:'day28MeetingResponse',target:'HAEUN',outcome:'ACCEPTED',method:'IN_PERSON'});for(let number=2;number<=8;number++)choose(state);return state;}

test('relationship response follows trust and requested distance instead of echoing the player wish',()=>{
  const state=atRelationship(),step={type:'day28RelationshipCue'};
  assert.equal(getDay28V4RuntimeResolution(state,step).outcome,'CONTINUE');
  state.storyFlags.day28V4.input.trustForIntimacy=false;
  assert.equal(getDay28V4RuntimeResolution(state,step).outcome,'KNOW_AGAIN');
  state.storyFlags.day28V4.input.respectDistance=true;
  assert.deepEqual(getDay28V4RuntimeResolution(state,step),{type:'day28RelationshipResponse',outcome:'END',contactAllowed:false});
});

test('hand, hug and kiss use separate current-consent evidence',()=>{
  const state=day28FriendlyFixture(),chapter=state.storyFlags.day28V4;
  Object.assign(chapter.facts,{relationshipResponse:'CONTINUE',contactAllowed:true,currentContact:'HAND'});
  assert.equal(getDay28V4RuntimeResolution(state,{type:'day28ContactCue',contact:'HAND'}).outcome,'ACCEPTED');
  assert.equal(getDay28V4RuntimeResolution(state,{type:'day28ContactCue',contact:'HUG'}).outcome,'ACCEPTED');
  assert.equal(getDay28V4RuntimeResolution(state,{type:'day28ContactCue',contact:'KISS'}).outcome,'ACCEPTED');
  chapter.input.trustForIntimacy=false;
  assert.equal(getDay28V4RuntimeResolution(state,{type:'day28ContactCue',contact:'HUG'}).outcome,'HAND_ONLY');
  assert.equal(getDay28V4RuntimeResolution(state,{type:'day28ContactCue',contact:'KISS'}).outcome,'DECLINED');
  chapter.input.respectDistance=true;
  assert.equal(getDay28V4RuntimeResolution(state,{type:'day28ContactCue',contact:'HAND'}).outcome,'DECLINED');
});

test('current relationship and contact responses are spoken before the next authored scene',()=>{
  const state=atRelationship(),chapter=state.storyFlags.day28V4;
  chapter.input.trustForIntimacy=false;chapter.inputSeal=seal(chapter.input);
  assert.equal(validateDay28V4(chapter),true);
  resolveDay28V4Relationship(state,getDay28V4RuntimeResolution(state,{type:'day28RelationshipCue'}));
  let steps=getDay28V4PlayableMiddle(state.storyFlags.day28V4);
  assert.equal(steps.find(step=>step.type==='dialogue')?.text,'지금은 다시 알아가는 쪽이 좋아. 연락이랑 만나는 건 천천히 정하고 싶어.');
  choose(state);choose(state,'hug');
  const response=getDay28V4RuntimeResolution(state,{type:'day28ContactCue',contact:'HUG'});
  assert.equal(response.outcome,'HAND_ONLY');resolveDay28V4Contact(state,response);
  steps=getDay28V4PlayableMiddle(state.storyFlags.day28V4);
  assert.equal(steps.find(step=>step.type==='dialogue')?.text,'오늘은 손만.');
});

test('new romance and follow-up outcomes require the corresponding prior and current facts',()=>{
  const state=day28NewMeetingFixture(),chapter=state.storyFlags.day28V4;
  chapter.facts.newRelationshipWish='KNOW_MORE';
  assert.equal(getDay28V4RuntimeResolution(state,{type:'day28NewRelationshipCue',recipient:'ARA'}).outcome,'NEED_TIME');
  chapter.facts.newRelationshipWish='WANT_ROMANCE';
  assert.equal(getDay28V4RuntimeResolution(state,{type:'day28NewRelationshipCue',recipient:'ARA'}).outcome,'RECIPROCATE');
  chapter.input.newMeeting.lieRepeated=true;
  assert.equal(getDay28V4RuntimeResolution(state,{type:'day28NewRelationshipCue',recipient:'ARA'}).outcome,'NEED_TIME');
});

test('the actual new person speaks their own current response before the ending',()=>{
  const state=day28NewMeetingFixture();choose(state);resolveDay28V4Meeting(state,{type:'day28MeetingResponse',target:'ARA',outcome:'ACCEPTED',method:'IN_PERSON'});choose(state,'want_romance');
  const response=getDay28V4RuntimeResolution(state,{type:'day28NewRelationshipCue',recipient:'ARA'});
  assert.equal(response.outcome,'RECIPROCATE');resolveDay28V4NewRelationship(state,response);
  const steps=getDay28V4PlayableEnding(state.storyFlags.day28V4),dialogue=steps.find(step=>step.type==='dialogue');
  assert.equal(dialogue?.speaker,'아라');
  assert.equal(dialogue?.text,'시간이 맞을 때 다시 만나요.');
  assert.doesNotMatch(JSON.stringify(steps),/하은|유리|서진/);
});
