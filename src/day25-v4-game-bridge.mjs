import {BACKGROUND_ASSETS} from './assets/asset-manifest.mjs?v=25';
import {MAP_LOCATION_ASSETS} from './map-location-assets.mjs';
import {applyDay25V4Choice,beginDay25V4,completeDay25V4,getDay25V4Entry,resolveDay25V4Contact,resolveDay25V4Friends,resolveDay25V4Future,resolveDay25V4Location,resolveDay25V4NewMeeting,validateDay25V4} from './day25-v4-state-contract.mjs?v=2';
import {getDay25V4PlayableOpening} from './day25-v4-playable-opening.mjs?v=1';
import {getDay25V4PlayableFuture} from './day25-v4-playable-future.mjs?v=1';
import {getDay25V4PlayableRelationship} from './day25-v4-playable-relationship.mjs?v=2';
import {getDay25V4PlayableSolo} from './day25-v4-playable-solo.mjs?v=1';
import {getDay25V4PlayableEnding} from './day25-v4-playable-ending.mjs?v=1';
import {STORY_OUTFIT_ASSETS} from './story-outfit-assets.mjs';

export const DAY25_V4_CAMPAIGN_SLOT='m30-day25-current-wedding-scope';
const boundaries=new Set(['openingBoundary','futureBoundary','relationshipBoundary','soloBoundary','endingBoundary']);
const resolutionTypes=new Set(['haeunMealLocationCue','haeunFutureCue','haeunContactCue','newMeetingCue','friendAvailabilityCue']);
const clock=Object.freeze({afternoon:'15:00','late-afternoon':'17:30',evening:'19:00',night:'22:00'});

export function getDay25V4GameCompatibility(state){const entry=getDay25V4Entry(state);if(entry.mode==='BLOCKED_PREREQUISITE'&&state.storyFlags?.day24RuntimeComplete===true&&state.storyFlags?.day24V4?.complete!==true)return {mode:'LEGACY'};return entry;}
export function prepareDay25V4GameEntry(state){const entry=getDay25V4GameCompatibility(state);return entry.mode==='V4_NEW'?beginDay25V4(state):entry;}

function presentation(direction){let backgroundId=direction.location;if(direction.location==='home'||direction.location==='phone')backgroundId=direction.time==='night'?'home-night':'home-evening';else if(direction.location==='home-meal')backgroundId='home-evening';else if(direction.location==='gimbap-village')backgroundId='day18-gimbap-evening';const backgroundUrl=BACKGROUND_ASSETS[backgroundId]??MAP_LOCATION_ASSETS[backgroundId];if(!backgroundUrl)throw new Error(`DAY25_BACKGROUND_MISSING:${backgroundId}`);const characterId=direction.character==='girlfriend'?'girlfriend':null;return {backgroundId,backgroundUrl,characterId,characterAssetUrl:characterId?STORY_OUTFIT_ASSETS.day12:null,expressionId:'calm',poseId:'standing',timeOfDay:direction.time,storyClock:clock[direction.time]??'22:00',storyLocation:direction.location};}
function rawSegment(chapter){
  if(['place','location_resolution','purpose','meal_pace'].includes(chapter.phase))return getDay25V4PlayableOpening(chapter);
  if(chapter.phase==='future_position')return [...getDay25V4PlayableOpening(chapter),...getDay25V4PlayableFuture(chapter)];
  if(['home','listening','money','work','pace'].includes(chapter.phase))return getDay25V4PlayableFuture(chapter);
  if(chapter.phase==='proposal')return [...getDay25V4PlayableFuture(chapter),...getDay25V4PlayableRelationship(chapter)];
  if(['future_resolution','farewell','contact_resolution','intimacy','kiss_followup'].includes(chapter.phase))return getDay25V4PlayableRelationship(chapter);
  if(chapter.phase==='solo_goal')return chapter.input.route==='HAEUN_FUTURE'?[...getDay25V4PlayableRelationship(chapter),...getDay25V4PlayableSolo(chapter)]:getDay25V4PlayableSolo(chapter);
  if(['solo_small','solo_rest','new_meeting','new_meeting_resolution'].includes(chapter.phase))return getDay25V4PlayableSolo(chapter);
  if(chapter.phase==='social_scope')return [...(chapter.facts.relationshipContinues?getDay25V4PlayableRelationship(chapter):getDay25V4PlayableSolo(chapter)),...getDay25V4PlayableEnding(chapter)];
  return getDay25V4PlayableEnding(chapter);
}
export function getDay25V4GameSegment(state){const chapter=state.storyFlags?.day25V4;if(!validateDay25V4(chapter))throw new Error('DAY25_INVALID_SAVE');return rawSegment(chapter).filter(step=>!boundaries.has(step.type)).map(step=>step.type==='sceneDirection'?{type:'transition',style:'crossfade',label:`SCENE ${String(step.number).padStart(2,'0')} · ${step.title}`,sceneNumber:step.number,bgmId:step.time==='night'?'theme':'daily',...presentation(step)}:step);}

function resumeDirection(chapter){const phase=chapter.phase;if(['place','location_resolution','purpose'].includes(phase))return {location:'home',time:'afternoon',character:null};if(phase==='meal_pace')return {location:chapter.facts.mealLocation==='SPECIAL'?'fine-dining':chapter.facts.mealLocation==='HOME'?'home-meal':chapter.facts.mealLocation==='OWN_DINNER'?'home':'gimbap-village',time:'evening',character:chapter.input.route==='HAEUN_FUTURE'?'girlfriend':null};if(['future_position','home','listening','money','work','pace','proposal','future_resolution','farewell','contact_resolution','intimacy','kiss_followup'].includes(phase))return {location:chapter.facts.mealLocation==='SPECIAL'?'fine-dining':chapter.facts.mealLocation==='HOME'?'home-meal':'gimbap-village',time:phase==='future_position'?'evening':'night',character:'girlfriend'};return {location:phase==='friend_meal'||phase==='friend_resolution'?'phone':'home',time:'night',character:phase==='friend_meal'||phase==='friend_resolution'?'girlfriend':null};}
export function getDay25V4GameResumePresentation(state){const chapter=state.storyFlags?.day25V4;if(!validateDay25V4(chapter))throw new Error('DAY25_INVALID_SAVE');return presentation(resumeDirection(chapter));}

export function applyDay25V4GameChoice(state,id){const snapshot=structuredClone(state.storyFlags?.day25V4);try{const result=applyDay25V4Choice(state,id);return {result,steps:getDay25V4GameSegment(state)};}catch(error){state.storyFlags.day25V4=snapshot;throw error;}}
export function applyDay25V4GameResolution(state,response){const snapshot=structuredClone(state.storyFlags?.day25V4);try{const result=response?.type==='haeunMealLocationResponse'?resolveDay25V4Location(state,response):response?.type==='haeunFutureResponse'?resolveDay25V4Future(state,response):response?.type==='haeunContactResponse'?resolveDay25V4Contact(state,response):response?.type==='newMeetingResponse'?resolveDay25V4NewMeeting(state,response):response?.type==='friendAvailabilityResponse'?resolveDay25V4Friends(state,response):(()=>{throw new Error('DAY25_UNKNOWN_RESOLUTION')})();return {result,steps:getDay25V4GameSegment(state)};}catch(error){state.storyFlags.day25V4=snapshot;throw error;}}

export function completeDay25V4GameChapter(state,cue){const chapter=completeDay25V4(state,cue);state.storyHistory??=[];if(!state.storyHistory.some(record=>record.sceneId===DAY25_V4_CAMPAIGN_SLOT))state.storyHistory.push({sceneId:DAY25_V4_CAMPAIGN_SLOT,scenarioId:'day25-notion-v4',day:25,arc:'좋아한다는 말 다음',choiceId:chapter.choices.filter(record=>record.kind==='choice').at(-1)?.id??null,response:chapter.facts.day26Route==='MARRIAGE_PREPARATION'?'결혼 준비의 시작을 합의했지만 아직 정하지 않은 생활 조건과 공개 범위를 그대로 남겼다.':chapter.facts.day26Route==='RELATIONSHIP_REDISCUSSION'?'좋아하는 마음과 서로 다른 미래를 지우지 않고 다시 이야기할 범위를 남겼다.':'다른 사람의 마음을 대신 쓰지 않고 자기 생활과 실제 약속만 다음 날로 이었다.',facts:structuredClone(chapter.facts),choices:structuredClone(chapter.choices),route:chapter.facts.day26Route});state.storyFlags.day25RuntimeComplete=true;state.pendingStoryId=null;return {type:'sceneEnd',day:25,complete:true};}

export function isDay25V4ResolutionStep(step){return resolutionTypes.has(step?.type);}
