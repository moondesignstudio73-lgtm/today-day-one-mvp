import assert from 'node:assert/strict';
import test from 'node:test';
import {getDay23V4PlayableEnding} from '../src/day23-v4-playable-ending.mjs';
import {getDay23V4PlayableNoTravel} from '../src/day23-v4-playable-no-travel.mjs';
import {validateDay23V4SourceStep} from '../src/day23-v4-source-selection.mjs';
import {beginDay23V4,resolveDay23V4Conversation,resolveDay23V4FarewellContact,resolveDay23V4Meeting,resolveDay23V4Photo,resolveDay23V4Relationship,resolveDay23V4Souvenir} from '../src/day23-v4-state-contract.mjs';
import {chooseDay23,completedDay22ForDay23} from './day23-v4-fixture.mjs';

const assertSourced=steps=>{for(const step of steps)if(['dialogue','message','monologue','playerNarration','stageAction'].includes(step.type))assert.equal(validateDay23V4SourceStep(step),true,`${step.type}:${step.text??step.description}`);};

function reachDinner(state,outcome='CONTINUE'){
  beginDay23V4(state);let guard=0;
  while(state.storyFlags.day23V4.phase!=='dinner_call'){
    assert.ok(guard++<30);const phase=state.storyFlags.day23V4.phase;
    if(phase==='photo_resolution'){resolveDay23V4Photo(state,{type:'haeunPhotoResponse',accepted:false});continue;}
    if(phase==='souvenir_resolution'){resolveDay23V4Souvenir(state,{type:'souvenirPurchaseResponse',purchased:false});continue;}
    if(phase==='relationship_resolution'){resolveDay23V4Relationship(state,{type:'haeunRelationshipResponse',outcome});continue;}
    if(phase==='farewell_resolution'){resolveDay23V4FarewellContact(state,{type:'haeunFarewellContactResponse',accepted:false});continue;}
    chooseDay23(state);
  }
}

test('comfortable Busan call renders SCENE19 and DAY24 method remains unresolved until response',()=>{
  const state=completedDay22ForDay23('BUSAN_TRIP');reachDinner(state,'CONTINUE');let steps=getDay23V4PlayableEnding(state.storyFlags.day23V4);assertSourced(steps);assert.equal(steps.at(-1).choiceNumber,15);chooseDay23(state,'eat_call');
  steps=getDay23V4PlayableEnding(state.storyFlags.day23V4);assertSourced(steps);assert.ok(steps.some(step=>step.type==='sceneDirection'&&step.number===19));assert.ok(steps.some(step=>step.text==='아까까지 봤는데 벌써 보고 싶어?'));chooseDay23(state,'smiling_face');
  steps=getDay23V4PlayableEnding(state.storyFlags.day23V4);assertSourced(steps);assert.ok(steps.some(step=>step.type==='sceneDirection'&&step.number===20));assert.doesNotMatch(steps.map(step=>step.text??'').join('\n'),/내일 무슨 답을 들을지 미리 겁날/);chooseDay23(state,'meet');
  steps=getDay23V4PlayableEnding(state.storyFlags.day23V4);assert.equal(steps[0].type,'conversationConsentCue');assert.equal(state.storyFlags.day23V4.facts.nextConversation,null);assertSourced(steps);
  resolveDay23V4Conversation(state,{type:'haeunConversationResponse',accepted:false});steps=getDay23V4PlayableEnding(state.storyFlags.day23V4);assertSourced(steps);assert.equal(state.storyFlags.day23V4.facts.nextConversation,'NOT_AGREED');assert.equal(steps.at(-1).type,'chapterCompletionCue');assert.equal(steps.at(-1).day,23);assert.doesNotMatch(steps.map(step=>step.text??'').join('\n'),/내일 얘기하자/);
});

test('difficult relationship skips SCENE19 and routes directly to the necessary conversation',()=>{
  const state=completedDay22ForDay23('BUSAN_TRIP',{pendingContacts:['YURI']});reachDinner(state,'UNSURE');chooseDay23(state,'eat_call');assert.equal(state.storyFlags.day23V4.phase,'conversation_method');
  let steps=getDay23V4PlayableEnding(state.storyFlags.day23V4);assertSourced(steps);assert.equal(steps.some(step=>step.type==='sceneDirection'&&step.number===19),false);assert.ok(steps.some(step=>step.text==='내일 무슨 답을 들을지 미리 겁날 것 같아.'));chooseDay23(state,'phone');
  assert.equal(state.storyFlags.day23V4.phase,'conversation_resolution');resolveDay23V4Conversation(state,{type:'haeunConversationResponse',accepted:true});steps=getDay23V4PlayableEnding(state.storyFlags.day23V4);assertSourced(steps);assert.equal(state.storyFlags.day23V4.facts.nextConversation,'PHONE');assert.ok(steps.some(step=>step.text?.includes('실제로 남아 있는 설명')));
});

test('Seoul comfortable call says they did not meet today and never uses the Busan line',()=>{
  const state=completedDay22ForDay23('SEOUL_DAY');reachDinner(state,'CONTINUE');chooseDay23(state,'after_meal');
  const steps=getDay23V4PlayableEnding(state.storyFlags.day23V4);assertSourced(steps);const rendered=steps.map(step=>step.text??'').join('\n');assert.match(rendered,/오늘 못 봤으니 더 궁금한 거냐고/);assert.doesNotMatch(rendered,/오늘은 만나지 않았으므로|아까까지 봤는데|아까까지 함께 있었다는 말은 하지 않았다/);assert.ok(steps.some(step=>step.type==='sceneDirection'&&step.number===19&&step.location==='home'));
});

test('resting tonight skips SCENE19 without turning a calm relationship into a feared answer',()=>{
  const state=completedDay22ForDay23('BUSAN_TRIP');reachDinner(state,'CONTINUE');chooseDay23(state,'rest');assert.equal(state.storyFlags.day23V4.phase,'conversation_method');
  const steps=getDay23V4PlayableEnding(state.storyFlags.day23V4);assertSourced(steps);const rendered=steps.map(step=>step.text??'').join('\n');assert.doesNotMatch(rendered,/아까까지 봤는데|내일 무슨 답을 들을지 미리 겁날/);assert.match(rendered,/앞으로 어떻게 만나고 싶은지/);
});

test('NO_TRAVEL solo ending creates no call, bag, souvenir, or Haeun dialogue',()=>{
  const state=completedDay22ForDay23('NO_TRAVEL');beginDay23V4(state);let guard=0;
  while(state.storyFlags.day23V4.phase!=='ending'){
    assert.ok(guard++<12);const phase=state.storyFlags.day23V4.phase;assertSourced(getDay23V4PlayableNoTravel(state.storyFlags.day23V4));
    if(phase==='meeting_resolution'){resolveDay23V4Meeting(state,{type:'haeunMeetingResponse',accepted:false});continue;}chooseDay23(state);
  }
  const steps=getDay23V4PlayableEnding(state.storyFlags.day23V4);assertSourced(steps);const rendered=steps.map(step=>`${step.speaker??step.sender??''} ${step.text??''}`).join('\n');assert.doesNotMatch(rendered,/하은|통화를 마쳤|가방을 거의 비웠|기념품을 샀다면|여행 전과 같은 방/);assert.equal(steps.some(step=>step.type==='dialogue'||step.type==='message'),false);assert.equal(steps.at(-1).type,'chapterCompletionCue');
});
