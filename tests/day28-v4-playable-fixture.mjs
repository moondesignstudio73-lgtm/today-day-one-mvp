import {day27EndedFixture,day27FriendlyFixture} from './day27-v4-playable-fixture.mjs';
import {applyDay27V4Choice,completeDay27V4,getDay27V4Options,resolveDay27V4Conversation,resolveDay27V4Jihoon,resolveDay27V4NextTalk,resolveDay27V4Relationship} from '../src/day27-v4-state-contract.mjs';
import {beginDay28V4} from '../src/day28-v4-state-contract.mjs';

const choose=state=>applyDay27V4Choice(state,getDay27V4Options(state.storyFlags.day27V4)[0].id);
function finishFriendly(){const state=day27FriendlyFixture();choose(state);resolveDay27V4Conversation(state,{type:'day27ConversationResponse',target:'HAEUN',outcome:'ACCEPTED',method:'IN_PERSON'});choose(state);while(state.storyFlags.day27V4.phase!=='conversation_end')choose(state);choose(state);resolveDay27V4Relationship(state,{type:'day27RelationshipResponse',outcome:'CONTINUE',contactAllowed:true});resolveDay27V4Jihoon(state,{type:'day27JihoonResponse',available:false});choose(state);choose(state);choose(state);resolveDay27V4NextTalk(state,{type:'day27NextTalkResponse',outcome:'ACCEPTED'});completeDay27V4(state,{type:'chapterCompletionCue',day:27,finalSceneReached:true});beginDay28V4(state);return state;}
function finishSolo(){const state=day27EndedFixture();choose(state);for(let index=0;index<6;index++)choose(state);completeDay27V4(state,{type:'chapterCompletionCue',day:27,finalSceneReached:true});beginDay28V4(state);return state;}
export const day28FriendlyFixture=finishFriendly;
export const day28SoloFixture=finishSolo;
