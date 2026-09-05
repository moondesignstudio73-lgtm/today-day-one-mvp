import {BACKGROUND_ASSETS} from './assets/asset-manifest.mjs?v=25';
import {applyDay24V4Choice,beginDay24V4,completeDay24V4,getDay24V4Entry,resolveDay24V4Contact,resolveDay24V4Conversation,resolveDay24V4Future,resolveDay24V4Lie,resolveDay24V4Relationship,validateDay24V4} from './day24-v4-state-contract.mjs';
import {getDay24V4PlayableOpening} from './day24-v4-playable-opening.mjs?v=1';
import {getDay24V4PlayableRelationship} from './day24-v4-playable-relationship.mjs?v=1';
import {getDay24V4PlayableContacts} from './day24-v4-playable-contacts.mjs?v=1';
import {getDay24V4PlayableEnding} from './day24-v4-playable-ending.mjs?v=1';
import {STORY_OUTFIT_ASSETS} from './story-outfit-assets.mjs';

export const DAY24_V4_CAMPAIGN_SLOT='m30-day24-current-commitment-check';
const boundaries=new Set(['openingBoundary','relationshipBoundary','contactBoundary','endingBoundary']);
const resolutionTypes=new Set(['haeunConversationCue','haeunRelationshipCue','relationshipStatusClarificationCue','otherContactResponseCue','haeunFutureTalkCue']);
const clock=Object.freeze({morning:'09:00','late-morning':'11:30',noon:'12:00',afternoon:'15:00','late-afternoon':'17:30',evening:'19:00',night:'22:00'});
const backgrounds=Object.freeze({'gimbap-village':'gimbap-village','corner-cafe':'small-cafe',transition:'home-evening','phone-call':'home-night','phone-message':'home-night'});

export function getDay24V4GameCompatibility(state){const entry=getDay24V4Entry(state);if(entry.mode==='BLOCKED_PREREQUISITE'&&state.storyFlags?.day23RuntimeComplete===true&&state.storyFlags?.day23V4?.complete!==true)return {mode:'LEGACY'};return entry;}
export function prepareDay24V4GameEntry(state){const entry=getDay24V4GameCompatibility(state);return entry.mode==='V4_NEW'?beginDay24V4(state):entry;}

function presentation(direction){let backgroundId=backgrounds[direction.location]??direction.location;if(direction.location==='home')backgroundId=direction.time==='morning'?'home-morning':direction.time==='night'?'home-night':'home-evening';const backgroundUrl=BACKGROUND_ASSETS[backgroundId];if(!backgroundUrl)throw new Error(`DAY24_BACKGROUND_MISSING:${backgroundId}`);const characterId=direction.character==='girlfriend'?'girlfriend':null;return {backgroundId,backgroundUrl,characterId,characterAssetUrl:characterId?STORY_OUTFIT_ASSETS.day12:null,expressionId:'calm',poseId:'standing',timeOfDay:direction.time,storyClock:clock[direction.time]??'19:00',storyLocation:direction.location};}
function rawSegment(chapter){
  if(['start_words','waiting','conversation_resolution'].includes(chapter.phase))return getDay24V4PlayableOpening(chapter);
  if(chapter.phase==='current_feeling')return [...getDay24V4PlayableOpening(chapter),...getDay24V4PlayableRelationship(chapter)];
  if(['feeling_explanation','waiting_answer','relationship_proposal','relationship_resolution','short_time'].includes(chapter.phase))return getDay24V4PlayableRelationship(chapter);
  if(['contact_expectation','no_pending_home'].includes(chapter.phase))return [...getDay24V4PlayableRelationship(chapter),...getDay24V4PlayableContacts(chapter)];
  if(['contact_path','relation_statement','lie_resolution','contact_resolution','no_pending_evening'].includes(chapter.phase))return getDay24V4PlayableContacts(chapter);
  if(['continue_evening','empty_evening'].includes(chapter.phase))return [...getDay24V4PlayableContacts(chapter),...getDay24V4PlayableEnding(chapter)];
  return getDay24V4PlayableEnding(chapter);
}
export function getDay24V4GameSegment(state){const chapter=state.storyFlags?.day24V4;if(!validateDay24V4(chapter))throw new Error('DAY24_INVALID_SAVE');return rawSegment(chapter).filter(step=>!boundaries.has(step.type)).map(step=>step.type==='sceneDirection'?{type:'transition',style:'crossfade',label:`SCENE ${String(step.number).padStart(2,'0')} · ${step.title}`,sceneNumber:step.number,bgmId:step.time==='night'?'theme':'daily',...presentation(step)}:step);}

function resumeDirection(chapter){const phase=chapter.phase;if(['start_words'].includes(phase))return {location:'home',time:'morning',character:null};if(['waiting','conversation_resolution'].includes(phase))return {location:'gimbap-village',time:'late-morning',character:null};if(['current_feeling','feeling_explanation','waiting_answer','relationship_proposal','relationship_resolution','short_time'].includes(phase)){const meet=chapter.facts.conversationMode==='MEET';return {location:meet?'corner-cafe':'home',time:'afternoon',character:meet?'girlfriend':null};}if(['contact_expectation','contact_path','relation_statement','lie_resolution','contact_resolution'].includes(phase))return {location:'phone-message',time:'late-afternoon',character:null};if(['future_talk','future_resolution'].includes(phase))return {location:'phone-message',time:'night',character:null};if(phase==='friend_talk')return {location:'phone-call',time:'evening',character:null};return {location:'home',time:phase==='ending'?'night':'evening',character:null};}
export function getDay24V4GameResumePresentation(state){const chapter=state.storyFlags?.day24V4;if(!validateDay24V4(chapter))throw new Error('DAY24_INVALID_SAVE');return presentation(resumeDirection(chapter));}

export function applyDay24V4GameChoice(state,id){const snapshot=structuredClone(state.storyFlags?.day24V4);try{const result=applyDay24V4Choice(state,id);return {result,steps:getDay24V4GameSegment(state)};}catch(error){state.storyFlags.day24V4=snapshot;throw error;}}
export function applyDay24V4GameResolution(state,response){const snapshot=structuredClone(state.storyFlags?.day24V4);try{const result=response?.type==='haeunConversationResponse'?resolveDay24V4Conversation(state,response):response?.type==='haeunRelationshipResponse'?resolveDay24V4Relationship(state,response):response?.type==='relationshipStatusClarification'?resolveDay24V4Lie(state,response):response?.type==='otherContactResponse'?resolveDay24V4Contact(state,response):response?.type==='haeunFutureTalkResponse'?resolveDay24V4Future(state,response):(()=>{throw new Error('DAY24_UNKNOWN_RESOLUTION')})();return {result,steps:getDay24V4GameSegment(state)};}catch(error){state.storyFlags.day24V4=snapshot;throw error;}}

export function completeDay24V4GameChapter(state,cue){const chapter=completeDay24V4(state,cue);state.storyHistory??=[];if(!state.storyHistory.some(record=>record.sceneId===DAY24_V4_CAMPAIGN_SLOT))state.storyHistory.push({sceneId:DAY24_V4_CAMPAIGN_SLOT,scenarioId:'day24-notion-v4',day:24,arc:'끝내지 못한 문장',choiceId:chapter.choices.filter(record=>record.kind==='choice').at(-1)?.id??null,response:chapter.facts.day25Route==='HAEUN_FUTURE'?'하은과 계속 만나며 서로의 미래를 말할 다음 대화에 합의했다.':chapter.facts.day25Route==='DEFERRED_RELATIONSHIP'?'관계를 유예하고 실제로 합의한 다음 대화만 남겼다.':chapter.facts.day25Route==='RELATIONSHIP_ENDED'?'좋았던 기억을 지우지 않은 채 관계를 끝내고 자기 생활로 돌아왔다.':'오늘 성사된 말과 남겨 둔 말을 구분해 기록했다.',facts:structuredClone(chapter.facts),choices:structuredClone(chapter.choices),route:chapter.facts.day25Route});state.storyFlags.day24RuntimeComplete=true;state.pendingStoryId=null;return {type:'sceneEnd',day:24,complete:true};}

export function isDay24V4ResolutionStep(step){return resolutionTypes.has(step?.type);}
