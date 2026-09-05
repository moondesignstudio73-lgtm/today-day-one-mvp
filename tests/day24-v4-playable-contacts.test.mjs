import assert from 'node:assert/strict';
import test from 'node:test';
import {applyDay24V4Choice,beginDay24V4,getDay24V4Options,resolveDay24V4Contact,resolveDay24V4Conversation,resolveDay24V4Lie,resolveDay24V4Relationship} from '../src/day24-v4-state-contract.mjs';
import {getDay24V4PlayableContacts} from '../src/day24-v4-playable-contacts.mjs';
import {validateDay24V4SourceStep} from '../src/day24-v4-source-selection.mjs';
import {completedDay23ForDay24} from './day24-v4-fixture.mjs';

const choose=(state,suffix)=>{const options=getDay24V4Options(state.storyFlags.day24V4),selected=suffix?options.find(item=>item.id.endsWith(`_${suffix}`)):options[0];assert.ok(selected,`${state.storyFlags.day24V4.phase}:${suffix}`);applyDay24V4Choice(state,selected.id);};
const assertSourced=steps=>{for(const step of steps)if(['dialogue','message','monologue','playerNarration','stageAction'].includes(step.type))assert.equal(validateDay24V4SourceStep(step),true,`${step.type}:${step.text??step.description}`);};
function reachContact(recipient,outcome='CONTINUE'){const state=completedDay23ForDay24('SEOUL_DAY',{pendingContacts:[recipient]});beginDay24V4(state);choose(state);choose(state);resolveDay24V4Conversation(state,{type:'haeunConversationResponse',accepted:true,mode:'MEET'});choose(state);choose(state);choose(state);choose(state,outcome==='END'?'break_up':outcome==='DEFER'?'need_time':'exclusive_continue');resolveDay24V4Relationship(state,{type:'haeunRelationshipResponse',outcome});choose(state,'rest');return state;}

test('SCENE11 opens only the actual pending recipient and exact C8',()=>{
  for(const recipient of ['YURI','SEOJIN','ARA']){const state=reachContact(recipient),name={YURI:'유리',SEOJIN:'서진',ARA:'아라'}[recipient];const steps=getDay24V4PlayableContacts(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).choiceNumber,8);assert.equal(steps[1].description.includes(name),true);const text=steps.filter(step=>step.text).map(step=>step.text).join(' ');for(const other of ['유리','서진','아라'].filter(item=>item!==name))assert.doesNotMatch(text,new RegExp(other));}
});

test('Yuri, Seojin and Ara C9 variants never merge into one player path',()=>{
  const suffix={YURI:'today_yuri',SEOJIN:'coworker',ARA:'photo_exchange'};
  for(const recipient of Object.keys(suffix)){const state=reachContact(recipient);choose(state,'relationship_active');let steps=getDay24V4PlayableContacts(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).variant,recipient);assert.equal(steps.at(-1).choiceNumber,9);choose(state,suffix[recipient]);steps=getDay24V4PlayableContacts(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).type,'otherContactResponseCue');assert.equal(steps.at(-1).recipient,recipient);}
});

test('active romantic interest reaches C10 and lie keeps recipient without auto-exposing to Haeun',()=>{
  const state=reachContact('SEOJIN','DEFER');choose(state,'relationship_active');choose(state,'personal_interest');let steps=getDay24V4PlayableContacts(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).choiceNumber,10);assert.equal(steps.at(-1).variant,'PENDING_RELATIONSHIP');
  choose(state,'alone_lie');steps=getDay24V4PlayableContacts(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).type,'relationshipStatusClarificationCue');resolveDay24V4Lie(state,{type:'relationshipStatusClarification',corrected:false});steps=getDay24V4PlayableContacts(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).type,'otherContactResponseCue');assert.equal(steps.some(step=>step.sender==='하은'||step.speaker==='하은'),false);
  resolveDay24V4Contact(state,{type:'otherContactResponse',outcome:'THINK'});steps=getDay24V4PlayableContacts(state.storyFlags.day24V4);assertSourced(steps);assert.deepEqual(steps.at(-1).lie,{recipient:'SEOJIN',statement:'SINGLE',truth:'RELATIONSHIP_NOT_ENDED',corrected:false});
});

test('new meeting response is accepted only after actual breakup and eligible interest',()=>{
  const ended=reachContact('ARA','END');choose(ended,'relationship_ended');choose(ended,'personal_interest');let steps=getDay24V4PlayableContacts(ended.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).type,'otherContactResponseCue');assert.equal(steps.at(-1).allowMeeting,true);resolveDay24V4Contact(ended,{type:'otherContactResponse',outcome:'ACCEPT_MEETING'});assert.equal(ended.storyFlags.day24V4.facts.newMeetingAccepted,true);
  const cleared=reachContact('ARA','END');choose(cleared,'clear_no_romance');choose(cleared,'photo_exchange');steps=getDay24V4PlayableContacts(cleared.storyFlags.day24V4);assert.equal(steps.at(-1).allowMeeting,false);assert.throws(()=>resolveDay24V4Contact(cleared,{type:'otherContactResponse',outcome:'ACCEPT_MEETING'}),/NEW_MEETING_NOT_ELIGIBLE/);
  const active=reachContact('YURI','CONTINUE');choose(active,'relationship_active');choose(active,'today_yuri');steps=getDay24V4PlayableContacts(active.storyFlags.day24V4);assert.equal(steps.at(-1).allowMeeting,false);assert.throws(()=>resolveDay24V4Contact(active,{type:'otherContactResponse',outcome:'ACCEPT_MEETING'}),/NEW_MEETING_NOT_ELIGIBLE/);
});

test('SCENE17 no-contact route creates neither a fake person nor a relationship message',()=>{
  const state=completedDay23ForDay24();beginDay24V4(state);choose(state);choose(state);resolveDay24V4Conversation(state,{type:'haeunConversationResponse',accepted:true,mode:'MEET'});choose(state);choose(state);choose(state);choose(state);resolveDay24V4Relationship(state,{type:'haeunRelationshipResponse',outcome:'CONTINUE'});choose(state,'rest');let steps=getDay24V4PlayableContacts(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).variant,'NO_PENDING_CONTACT');assert.equal(steps.at(-1).choiceNumber,9);assert.doesNotMatch(steps.filter(step=>step.text).map(step=>step.text).join(' '),/유리|서진|아라/);
  choose(state,'rest');steps=getDay24V4PlayableContacts(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).choiceNumber,10);choose(state,'simple_home');steps=getDay24V4PlayableContacts(state.storyFlags.day24V4);assertSourced(steps);assert.equal(steps.at(-1).nextScene,18);assert.equal(steps.at(-1).recipient,null);
});
