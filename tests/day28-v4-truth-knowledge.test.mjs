import test from 'node:test';
import assert from 'node:assert/strict';
import {day27MixedFixture} from './day27-v4-playable-fixture.mjs';
import {applyDay27V4Choice,completeDay27V4,getDay27V4Options,resolveDay27V4Conversation,resolveDay27V4HaeunListening,resolveDay27V4Jihoon,resolveDay27V4NextTalk,resolveDay27V4Relationship,resolveDay27V4TruthRecipient} from '../src/day27-v4-state-contract.mjs';
import {applyDay28V4Choice,beginDay28V4,getDay28V4Options,resolveDay28V4Meeting,validateDay28V4} from '../src/day28-v4-state-contract.mjs';

const seal=input=>{let hash=2166136261;for(const char of JSON.stringify(input)){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619);}return (hash>>>0).toString(16).padStart(8,'0');};
const choose27=(state,suffix)=>{const options=getDay27V4Options(state.storyFlags.day27V4),option=suffix?options.find(item=>item.id.endsWith(`_${suffix}`)):options[0];assert.ok(option,`${state.storyFlags.day27V4.phase}:${suffix}`);applyDay27V4Choice(state,option.id);};
const choose28=(state,suffix)=>{const options=getDay28V4Options(state.storyFlags.day28V4),option=suffix?options.find(item=>item.id.endsWith(`_${suffix}`)):options[0];assert.ok(option,`${state.storyFlags.day28V4.phase}:${suffix}`);applyDay28V4Choice(state,option.id);};

function listenedTruth(){
  const state=day27MixedFixture();
  choose27(state);resolveDay27V4Conversation(state,{type:'day27ConversationResponse',target:'SEOJIN',outcome:'ACCEPTED',method:'CALL'});
  choose27(state);choose27(state,'admit_lie');resolveDay27V4TruthRecipient(state,{type:'day27TruthRecipientResponse',recipient:'SEOJIN',outcome:'CONTINUE'});
  choose27(state);choose27(state,'disclose');resolveDay27V4HaeunListening(state,{type:'day27HaeunListeningResponse',outcome:'LISTEN'});
  choose27(state);choose27(state);resolveDay27V4Relationship(state,{type:'day27RelationshipResponse',outcome:'CONTINUE',contactAllowed:true});
  if(state.storyFlags.day27V4.phase==='jihoon_resolution')resolveDay27V4Jihoon(state,{type:'day27JihoonResponse',available:false});
  choose27(state);choose27(state);choose27(state,'short_meeting');resolveDay27V4NextTalk(state,{type:'day27NextTalkResponse',outcome:'ACCEPTED'});
  completeDay27V4(state,{type:'chapterCompletionCue',day:27,finalSceneReached:true});beginDay28V4(state);
  return state;
}

function atHeardMeaning(){const state=listenedTruth();choose28(state);resolveDay28V4Meeting(state,{type:'day28MeetingResponse',target:'HAEUN',outcome:'ACCEPTED',method:'IN_PERSON'});choose28(state);assert.equal(state.storyFlags.day28V4.phase,'heard_meaning');return state;}

test('C3 hidden fact requires a real lie, correction, disclosure to Haeun, and her LISTEN response',()=>{
  const state=atHeardMeaning(),chapter=state.storyFlags.day28V4,proof=chapter.input.haeunTruthKnowledge;
  assert.deepEqual(proof,{lieRecipient:'SEOJIN',lieExisted:true,corrected:true,disclosure:'DISCLOSE',listeningResponse:'LISTEN',heard:true});
  assert.deepEqual(getDay28V4Options(chapter).map(option=>option.id.endsWith('_hidden_fact')),[true]);
  assert.equal(validateDay28V4(chapter),true);
});

test('correction alone cannot make Haeun the listener, while a pre-proof save stays compatible',()=>{
  const state=atHeardMeaning(),chapter=state.storyFlags.day28V4;
  chapter.input.haeunTruthKnowledge={...chapter.input.haeunTruthKnowledge,disclosure:'HIDE',listeningResponse:null,heard:false};
  chapter.inputSeal=seal(chapter.input);
  assert.equal(validateDay28V4(chapter),true);
  assert.equal(getDay28V4Options(chapter).some(option=>option.id.endsWith('_hidden_fact')),false);
  const forged=structuredClone(chapter);forged.input.haeunTruthKnowledge.heard=true;forged.inputSeal=seal(forged.input);
  assert.equal(validateDay28V4(forged),false);
  const legacy=structuredClone(state.storyFlags.day28V4);delete legacy.input.haeunTruthKnowledge;legacy.inputSeal=seal(legacy.input);
  assert.equal(validateDay28V4(legacy),true);
});
