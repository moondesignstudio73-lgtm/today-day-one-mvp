import assert from 'node:assert/strict';
import test from 'node:test';
import {applyDay24V4Choice,beginDay24V4,getDay24V4Options,resolveDay24V4Conversation,resolveDay24V4Relationship} from '../src/day24-v4-state-contract.mjs';
import {getDay24V4PlayableRelationship} from '../src/day24-v4-playable-relationship.mjs';
import {validateDay24V4SourceStep} from '../src/day24-v4-source-selection.mjs';
import {completedDay23ForDay24} from './day24-v4-fixture.mjs';

const choose=(state,suffix)=>{const options=getDay24V4Options(state.storyFlags.day24V4),selected=suffix?options.find(item=>item.id.endsWith(`_${suffix}`)):options[0];assert.ok(selected,`${state.storyFlags.day24V4.phase}:${suffix}`);applyDay24V4Choice(state,selected.id);};
const assertSourced=steps=>{for(const step of steps)if(['dialogue','message','monologue','playerNarration','stageAction'].includes(step.type))assert.equal(validateDay24V4SourceStep(step),true,`${step.type}:${step.text??step.description}`);};
function enter(state,mode='MEET'){beginDay24V4(state);choose(state);choose(state);resolveDay24V4Conversation(state,{type:'haeunConversationResponse',accepted:true,mode});}

test('SCENE04-08 renders every choice gate with exact source-backed reactions',()=>{
  const state=completedDay23ForDay24('BUSAN_TRIP');enter(state);let steps=getDay24V4PlayableRelationship(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).choiceNumber,3);
  choose(state,'unsure');steps=getDay24V4PlayableRelationship(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).choiceNumber,4);assert.match(JSON.stringify(steps),/괜찮은 건 다른/);
  choose(state,'not_other');steps=getDay24V4PlayableRelationship(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).choiceNumber,5);
  choose(state,'no_obligation');steps=getDay24V4PlayableRelationship(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).choiceNumber,6);
  choose(state,'need_time');steps=getDay24V4PlayableRelationship(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).type,'haeunRelationshipCue');assert.equal(state.storyFlags.day24V4.facts.haeunRelationshipOutcome,null);
});

test('current relationship resolution controls SCENE09-10 and breakup removes walk',()=>{
  for(const outcome of ['CONTINUE','DEFER','END']){const state=completedDay23ForDay24();enter(state);choose(state);choose(state);choose(state);choose(state,outcome==='END'?'break_up':outcome==='DEFER'?'need_time':'exclusive_continue');resolveDay24V4Relationship(state,{type:'haeunRelationshipResponse',outcome});const steps=getDay24V4PlayableRelationship(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).choiceNumber,7);const walk=steps.at(-1).options.some(item=>item.id.endsWith('_walk'));assert.equal(walk,outcome==='CONTINUE');if(outcome==='END')assert.match(JSON.stringify(steps),/붙잡아 두고 싶지는 않아/);}
});

test('phone route never places Haeun in the cafe or exposes physical cup choreography',()=>{
  const state=completedDay23ForDay24();enter(state,'PHONE');let steps=getDay24V4PlayableRelationship(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps[0].character,null);assert.doesNotMatch(JSON.stringify(steps),/corner-cafe|컵받침|컵 손잡이/);
  choose(state);choose(state);choose(state);choose(state);resolveDay24V4Relationship(state,{type:'haeunRelationshipResponse',outcome:'CONTINUE'});steps=getDay24V4PlayableRelationship(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).options.some(item=>item.id.endsWith('_walk')),false);assert.equal(steps.some(step=>/남은 커피/.test(step.text??step.description??'')),false);
});

test('C7 reaction crosses only into the actual pending-contact or no-contact scene',()=>{
  for(const pending of [[],['YURI']]){const state=completedDay23ForDay24('SEOUL_DAY',{pendingContacts:pending});enter(state);choose(state);choose(state);choose(state);choose(state);resolveDay24V4Relationship(state,{type:'haeunRelationshipResponse',outcome:'CONTINUE'});choose(state,'rest');const steps=getDay24V4PlayableRelationship(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).nextScene,pending.length?11:17);assert.equal(steps.at(-1).outcome,'CONTINUE');}
});
