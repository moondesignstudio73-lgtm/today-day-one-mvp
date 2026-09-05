import assert from 'node:assert/strict';
import test from 'node:test';
import {applyDay24V4Choice,beginDay24V4,getDay24V4Options,resolveDay24V4Conversation} from '../src/day24-v4-state-contract.mjs';
import {getDay24V4PlayableOpening} from '../src/day24-v4-playable-opening.mjs';
import {validateDay24V4SourceStep} from '../src/day24-v4-source-selection.mjs';
import {completedDay23ForDay24} from './day24-v4-fixture.mjs';

const choose=(state,suffix)=>{const options=getDay24V4Options(state.storyFlags.day24V4),selected=suffix?options.find(item=>item.id.endsWith(`_${suffix}`)):options[0];assert.ok(selected);applyDay24V4Choice(state,selected.id);};
const assertSourced=steps=>{for(const step of steps)if(['dialogue','message','monologue','playerNarration','stageAction'].includes(step.type))assert.equal(validateDay24V4SourceStep(step),true,`${step.type}:${step.text??step.description}`);};

test('DAY24 opening renders C1-C2 and waits for a separate current conversation response',()=>{
  const state=completedDay23ForDay24();beginDay24V4(state);let steps=getDay24V4PlayableOpening(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).choiceNumber,1);
  choose(state,'answer');steps=getDay24V4PlayableOpening(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).choiceNumber,2);assert.ok(steps.some(step=>step.text?.includes('미뤄 둔 대답')));
  choose(state,'eat');steps=getDay24V4PlayableOpening(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).type,'haeunConversationCue');assert.equal(state.storyFlags.day24V4.facts.conversationMode,null);
});

test('meeting, phone and declined responses use distinct grounded presentations',()=>{
  for(const mode of ['MEET','PHONE']){const state=completedDay23ForDay24();beginDay24V4(state);choose(state);choose(state);resolveDay24V4Conversation(state,{type:'haeunConversationResponse',accepted:true,mode});const steps=getDay24V4PlayableOpening(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).conversation,mode);const joined=JSON.stringify(steps);if(mode==='MEET'){assert.match(joined,/corner-cafe/);assert.match(joined,/컵/);}else{assert.match(joined,/문 닫는 소리/);assert.doesNotMatch(joined,/corner-cafe|자기 컵/);}}
  const declined=completedDay23ForDay24();beginDay24V4(declined);choose(declined);choose(declined);resolveDay24V4Conversation(declined,{type:'haeunConversationResponse',accepted:false});const steps=getDay24V4PlayableOpening(declined.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).conversation,'DECLINED_TODAY');assert.match(JSON.stringify(steps),/집 앞에 가지 않았다/);
});

test('an already-ended relationship does not fabricate a Haeun message or meeting',()=>{
  const state=completedDay23ForDay24();state.breakup={day:23};beginDay24V4(state);let steps=getDay24V4PlayableOpening(state.storyFlags.day24V4);assertSourced(steps);choose(state);steps=getDay24V4PlayableOpening(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.some(step=>step.type==='message'&&step.sender==='하은'),false);choose(state);steps=getDay24V4PlayableOpening(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).nextScene,17);assert.equal(steps.some(step=>step.location==='corner-cafe'),false);
});
