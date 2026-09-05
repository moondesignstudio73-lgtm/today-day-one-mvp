import assert from 'node:assert/strict';
import test from 'node:test';
import * as contract from '../src/day24-v4-state-contract.mjs';
import {completedDay23ForDay24} from './day24-v4-fixture.mjs';

const {applyDay24V4Choice,beginDay24V4,completeDay24V4,getDay24V4Entry,getDay24V4Options,resolveDay24V4Contact,resolveDay24V4Conversation,resolveDay24V4Future,resolveDay24V4Lie,resolveDay24V4Relationship,validateDay24V4}=contract;
function choose(state,suffix){const options=getDay24V4Options(state.storyFlags.day24V4);const selected=suffix?options.find(item=>item.id.endsWith(`_${suffix}`)):options[0];assert.ok(selected,`DAY24 ${state.storyFlags.day24V4.phase}:${suffix}`);return applyDay24V4Choice(state,selected.id);}
function reachRelationship(state){choose(state);choose(state);resolveDay24V4Conversation(state,{type:'haeunConversationResponse',accepted:true,mode:'MEET'});choose(state);choose(state);choose(state);choose(state);}
function finish(state){let guard=0;while(state.storyFlags.day24V4.phase!=='ending'){assert.ok(guard++<32);const phase=state.storyFlags.day24V4.phase;if(phase==='conversation_resolution'){resolveDay24V4Conversation(state,{type:'haeunConversationResponse',accepted:true,mode:'MEET'});continue;}if(phase==='relationship_resolution'){resolveDay24V4Relationship(state,{type:'haeunRelationshipResponse',outcome:'CONTINUE'});continue;}if(phase==='contact_resolution'){resolveDay24V4Contact(state,{type:'otherContactResponse',outcome:'ACKNOWLEDGED'});continue;}if(phase==='lie_resolution'){resolveDay24V4Lie(state,{type:'relationshipStatusClarification',corrected:true});continue;}if(phase==='future_resolution'){resolveDay24V4Future(state,{type:'haeunFutureTalkResponse',accepted:true,time:'tomorrow-dinner'});continue;}choose(state);}return state.storyFlags.day24V4;}

test('DAY24 entry freezes verified DAY21-23 history and preserves legacy saves',()=>{
  const state=completedDay23ForDay24('BUSAN_TRIP',{shared:false,pendingContacts:['YURI'],day23Relationship:'UNSURE'});const entry=getDay24V4Entry(state);
  assert.equal(entry.mode,'V4_NEW');assert.equal(entry.input.day23Route,'BUSAN_TRIP');assert.equal(entry.input.priorHaeunOutcome,'UNSURE');assert.deepEqual(entry.input.pendingContacts,['YURI']);assert.equal(entry.input.priorConversation.status,'AGREED');
  const broken=structuredClone(state);broken.storyFlags.day23V4.facts.nextConversation='PHONE';assert.equal(getDay24V4Entry(broken).mode,'BLOCKED_PREREQUISITE');
  const legacy=structuredClone(state);legacy.storyFlags.day24RuntimeStage=1;assert.equal(getDay24V4Entry(legacy).mode,'LEGACY');
});

test('mutual continuation keeps current Haeun response and DAY25 future talk separate',()=>{
  const state=completedDay23ForDay24();beginDay24V4(state);reachRelationship(state);resolveDay24V4Relationship(state,{type:'haeunRelationshipResponse',outcome:'CONTINUE'});finish(state);const chapter=state.storyFlags.day24V4;
  assert.equal(chapter.facts.initialFeeling,'CONTINUE');assert.equal(chapter.facts.haeunRelationshipOutcome,'CONTINUE');assert.equal(chapter.facts.futureTalkAccepted,true);assert.equal(chapter.facts.day25Route,'HAEUN_FUTURE');assert.equal(validateDay24V4(chapter),true);
  completeDay24V4(state,{type:'chapterCompletionCue',day:24,finalSceneReached:true});assert.equal(state.storyFlags.day24V4Day25HookPending,true);assert.equal(state.storyFlags.day23V4Day24HookPending,false);
});

test('active relationship lie is recipient-specific and does not auto-expose to Haeun',()=>{
  const state=completedDay23ForDay24('SEOUL_DAY',{pendingContacts:['SEOJIN']});beginDay24V4(state);reachRelationship(state);resolveDay24V4Relationship(state,{type:'haeunRelationshipResponse',outcome:'DEFER'});choose(state,'rest');choose(state,'relationship_active');assert.equal(state.storyFlags.day24V4.facts.contactRecipient,'SEOJIN');choose(state,'personal_interest');choose(state,'alone_lie');
  assert.equal(state.storyFlags.day24V4.phase,'lie_resolution');resolveDay24V4Lie(state,{type:'relationshipStatusClarification',corrected:false});resolveDay24V4Contact(state,{type:'otherContactResponse',outcome:'THINK'});
  assert.deepEqual(state.storyFlags.day24V4.facts.relationshipStatusLie,{recipient:'SEOJIN',statement:'SINGLE',truth:'RELATIONSHIP_NOT_ENDED',corrected:false});assert.equal(state.storyFlags.day24V4.facts.haeunRelationshipOutcome,'DEFER');assert.equal(validateDay24V4(state.storyFlags.day24V4),true);
});

test('new meeting requires an ended relationship and the other person current acceptance',()=>{
  const state=completedDay23ForDay24('SEOUL_DAY',{pendingContacts:['ARA']});beginDay24V4(state);reachRelationship(state);resolveDay24V4Relationship(state,{type:'haeunRelationshipResponse',outcome:'END'});choose(state,'rest');choose(state,'relationship_ended');choose(state,'personal_interest');resolveDay24V4Contact(state,{type:'otherContactResponse',outcome:'ACCEPT_MEETING'});choose(state,'alone');
  assert.equal(state.storyFlags.day24V4.phase,'new_meeting');assert.equal(state.storyFlags.day24V4.facts.newMeetingAccepted,true);choose(state,'slow');choose(state);assert.equal(state.storyFlags.day24V4.facts.day25Route,'RELATIONSHIP_ENDED');
});

test('unavailable Haeun skips current conversation without fabricating a meeting',()=>{
  const state=completedDay23ForDay24();state.breakup={day:23};beginDay24V4(state);choose(state);choose(state);assert.equal(state.storyFlags.day24V4.phase,'no_pending_home');finish(state);const chapter=state.storyFlags.day24V4;
  assert.equal(chapter.input.relationshipActive,false);assert.equal(chapter.facts.conversationMode,null);assert.equal(chapter.facts.haeunRelationshipOutcome,null);assert.equal(chapter.facts.day25Route,'RELATIONSHIP_ENDED');
});

test('DAY24 replay validator rejects frozen input and resolution tampering',()=>{
  const state=completedDay23ForDay24();beginDay24V4(state);choose(state);choose(state);resolveDay24V4Conversation(state,{type:'haeunConversationResponse',accepted:false});const valid=state.storyFlags.day24V4;assert.equal(validateDay24V4(valid),true);
  const route=structuredClone(valid);route.input.day23Route='NO_TRAVEL';assert.equal(validateDay24V4(route),false);
  const fake=structuredClone(valid);fake.facts.conversationMode='MEET';assert.equal(validateDay24V4(fake),false);
  assert.throws(()=>completeDay24V4(state,{type:'chapterCompletionCue',day:24,finalSceneReached:true}),/INVALID_COMPLETION/);
});
