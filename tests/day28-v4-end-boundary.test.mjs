import test from 'node:test';
import assert from 'node:assert/strict';
import {day28FriendlyFixture} from './day28-v4-playable-fixture.mjs';
import {applyDay28V4Choice,getDay28V4Options,resolveDay28V4Meeting,resolveDay28V4Relationship,validateDay28V4} from '../src/day28-v4-state-contract.mjs';
import {applyDay28V4GameResolution,getDay28V4GameSegment} from '../src/day28-v4-game-bridge.mjs';
import {validateDay28V4SourceStep} from '../src/day28-v4-source-selection.mjs';

function pendingEnd(){
  const state=day28FriendlyFixture();
  const choose=suffix=>{const options=getDay28V4Options(state.storyFlags.day28V4);applyDay28V4Choice(state,(suffix?options.find(item=>item.id.endsWith(suffix)):options[0]).id);};
  choose();resolveDay28V4Meeting(state,{type:'day28MeetingResponse',target:'HAEUN',outcome:'ACCEPTED',method:'IN_PERSON'});
  for(let index=2;index<8;index++)choose();
  choose('_end_well');return state;
}

test('an explicit ending cannot be replaced by a continuing or ambiguous relationship response',()=>{
  for(const apply of [resolveDay28V4Relationship,applyDay28V4GameResolution])for(const outcome of ['CONTINUE','KNOW_AGAIN']){
    const state=pendingEnd();state.storyHistory=[{day:27}];state.pendingStoryId='day28';
    const before=structuredClone(state);
    assert.throws(()=>apply(state,{type:'day28RelationshipResponse',outcome,contactAllowed:true}),/END_BOUNDARY/);
    assert.deepEqual(state,before);
    assert.equal(validateDay28V4(state.storyFlags.day28V4),true);
  }
});

test('ending proceeds without requiring permission, and restores the authored boundary dialogue',()=>{
  const state=pendingEnd();
  const {steps}=applyDay28V4GameResolution(state,{type:'day28RelationshipResponse',outcome:'END',contactAllowed:false});
  assert.equal(state.storyFlags.day28V4.phase,'breakup_close');
  assert.equal(state.storyFlags.day28V4.facts.contactAllowed,false);
  assert.equal(state.storyFlags.day28V4.facts.currentContact,null);
  assert.deepEqual(steps.filter(step=>step.type==='dialogue').map(step=>step.text),[
    '알겠어. 나도 오늘은 끝까지 이야기하고 싶었어.',
    '좋았던 날까지 없애고 싶지는 않아.',
    '그건 내가 정할게. 지금은 조금 멀리 두고 싶을 수도 있어.',
    '응.',
    '언젠가 좋게 생각할 수 있으면 좋겠어. 지금 약속은 못 하지만.',
  ]);
  for(const step of steps.filter(step=>step.type==='dialogue'))assert.equal(validateDay28V4SourceStep(step),true);
  const saved=JSON.parse(JSON.stringify(state));
  assert.equal(validateDay28V4(saved.storyFlags.day28V4),true);
  assert.deepEqual(getDay28V4GameSegment(saved),steps);
});
