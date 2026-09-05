import assert from 'node:assert/strict';
import test from 'node:test';
import {applyDay24V4Choice,beginDay24V4,getDay24V4Options,resolveDay24V4Contact,resolveDay24V4Conversation,resolveDay24V4Future,resolveDay24V4Relationship} from '../src/day24-v4-state-contract.mjs';
import {getDay24V4PlayableEnding} from '../src/day24-v4-playable-ending.mjs';
import {validateDay24V4SourceStep} from '../src/day24-v4-source-selection.mjs';
import {completedDay23ForDay24} from './day24-v4-fixture.mjs';

const choose=(state,suffix)=>{const options=getDay24V4Options(state.storyFlags.day24V4),selected=suffix?options.find(item=>item.id.endsWith(`_${suffix}`)):options[0];assert.ok(selected,`${state.storyFlags.day24V4.phase}:${suffix}`);applyDay24V4Choice(state,selected.id);};
const assertSourced=steps=>{for(const step of steps)if(['dialogue','message','monologue','playerNarration','stageAction'].includes(step.type))assert.equal(validateDay24V4SourceStep(step),true,`${step.type}:${step.text??step.description}`);};
function reachEvening(outcome='CONTINUE',options={}){const state=completedDay23ForDay24('SEOUL_DAY',options);beginDay24V4(state);choose(state);choose(state);resolveDay24V4Conversation(state,{type:'haeunConversationResponse',accepted:true,mode:'MEET'});choose(state);choose(state);choose(state);choose(state,outcome==='END'?'break_up':outcome==='DEFER'?'need_time':'exclusive_continue');resolveDay24V4Relationship(state,{type:'haeunRelationshipResponse',outcome});choose(state,'rest');if(!options.pendingContacts){choose(state);choose(state);}return state;}

test('mutual continuation plays SCENE18, independently resolves C14, then reaches C15',()=>{
  const state=reachEvening('CONTINUE');let steps=getDay24V4PlayableEnding(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).choiceNumber,11);assert.equal(steps.at(-1).variant,'CONTINUE');assert.match(JSON.stringify(steps),/국이 너무 많아/);
  choose(state,'thank');steps=getDay24V4PlayableEnding(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).choiceNumber,14);assert.equal(steps.at(-1).variant,'CONTINUE');
  choose(state,'tomorrow_meal');steps=getDay24V4PlayableEnding(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).type,'haeunFutureTalkCue');assert.equal(state.storyFlags.day24V4.facts.futureTalkAccepted,false);
  resolveDay24V4Future(state,{type:'haeunFutureTalkResponse',accepted:true,time:'tomorrow-19:00'});steps=getDay24V4PlayableEnding(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).choiceNumber,15);assert.match(JSON.stringify(steps),/tomorrow-19:00/);
});

test('defer route can call available Jihoon without turning him into a judge',()=>{
  const state=reachEvening('DEFER',{jihoon:true});let steps=getDay24V4PlayableEnding(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).variant,'DEFER_OR_END');assert.equal(steps.at(-1).options.some(item=>item.id.endsWith('_jihoon')),true);
  choose(state,'jihoon');steps=getDay24V4PlayableEnding(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).choiceNumber,12);assert.match(JSON.stringify(steps),/잘했다고 해 주길 기다려/);
  choose(state,'relieved_guilt');steps=getDay24V4PlayableEnding(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).choiceNumber,15);assert.match(JSON.stringify(steps),/상대는 지금 무거울/);assert.equal(steps.some(step=>step.number===21),false);
});

test('ended relationship without accepted new meeting uses the source no-reward projection',()=>{
  const state=reachEvening('END');let steps=getDay24V4PlayableEnding(state.storyFlags.day24V4);assertSourced(steps);choose(state,'alone');steps=getDay24V4PlayableEnding(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.some(step=>step.number===21),true);assert.match(JSON.stringify(steps),/새 연인이 보상/);assert.equal(steps.at(-1).choiceNumber,15);
});

test('accepted new meeting alone opens C13 and never labels it a new relationship',()=>{
  const state=reachEvening('END',{pendingContacts:['ARA']});choose(state,'relationship_ended');choose(state,'personal_interest');resolveDay24V4Contact(state,{type:'otherContactResponse',outcome:'ACCEPT_MEETING'});let steps=getDay24V4PlayableEnding(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).choiceNumber,11);choose(state,'alone');steps=getDay24V4PlayableEnding(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).choiceNumber,13);assert.equal(steps.at(-1).variant,'NEW_MEETING');
  choose(state,'slow');steps=getDay24V4PlayableEnding(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).choiceNumber,15);assert.match(JSON.stringify(steps),/교제 시작으로 기록하지 않았다/);
});

test('SCENE24 ending projects only the actual continue, defer, end or lie result',()=>{
  for(const outcome of ['CONTINUE','DEFER','END']){const state=reachEvening(outcome);if(outcome==='CONTINUE'){choose(state);choose(state);resolveDay24V4Future(state,{type:'haeunFutureTalkResponse',accepted:true,time:'next-talk'});}else choose(state,'alone');choose(state);let steps=getDay24V4PlayableEnding(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).type,'chapterCompletionCue');assert.equal(steps.at(-1).day,24);const text=steps.filter(step=>step.text).map(step=>step.text).join(' ');if(outcome==='CONTINUE'){assert.match(text,/계속 만나고 싶다는 말/);assert.doesNotMatch(text,/관계를 끝내고 싶다는 말|여전히 사실과 다른 말/);}if(outcome==='DEFER'){assert.match(text,/아직 잘 모르겠다는 말/);assert.doesNotMatch(text,/관계를 끝내고 싶다는 말/);}if(outcome==='END')assert.match(text,/관계를 끝내고 싶다는 말/);}
});
