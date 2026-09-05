import {BACKGROUND_ASSETS} from './assets/asset-manifest.mjs';
import {applyDay20V4Choice,beginDay20V4,completeDay20V4,getDay20V4Entry,resolveDay20V4Contact,resolveDay20V4Stay,validateDay20V4} from './day20-v4-state-contract.mjs';
import {getDay20V4PlayableOpening} from './day20-v4-playable-opening.mjs';
import {getDay20V4PlayableDomestic} from './day20-v4-playable-domestic.mjs';
import {getDay20V4PlayableIntimacy} from './day20-v4-playable-intimacy.mjs';
import {getDay20V4PlayableEnding} from './day20-v4-playable-ending.mjs';
import {getDay20V4PlayableSolo} from './day20-v4-playable-solo.mjs';
import {STORY_OUTFIT_ASSETS} from './story-outfit-assets.mjs';

export const DAY20_V4_CAMPAIGN_SLOT='m30-day20-current-shared-meal';
const boundaries=new Set(['openingBoundary','domesticBoundary','intimacyBoundary','endingBoundary','soloBoundary']);
const clock=Object.freeze({evening:'19:00',night:'22:00'});

export function getDay20V4GameCompatibility(state){const entry=getDay20V4Entry(state);if(entry.mode==='BLOCKED_PREREQUISITE'&&state.storyFlags?.day19RuntimeComplete===true&&state.storyFlags?.day19V4?.complete!==true)return {mode:'LEGACY'};return entry;}
export function prepareDay20V4GameEntry(state){const entry=getDay20V4GameCompatibility(state);return entry.mode==='V4_NEW'?beginDay20V4(state):entry;}
function presentation(direction){const backgroundId=direction.time==='night'?'home-night':'home-evening',backgroundUrl=BACKGROUND_ASSETS[backgroundId];if(!backgroundUrl)throw new Error(`DAY20_BACKGROUND_MISSING:${backgroundId}`);const characterId=direction.character==='girlfriend'?'girlfriend':null;return {backgroundId,backgroundUrl,characterId,characterAssetUrl:characterId?STORY_OUTFIT_ASSETS.day12:null,expressionId:'calm',poseId:'standing',timeOfDay:direction.time,storyClock:clock[direction.time],storyLocation:direction.location};}
function rawSegment(chapter){
  if(chapter.input.visitMode==='SOLO')return chapter.phase==='solo_story'?getDay20V4PlayableOpening(chapter):getDay20V4PlayableSolo(chapter);
  if(['preparation','request','cup'].includes(chapter.phase))return getDay20V4PlayableOpening(chapter);
  if(chapter.phase==='kitchen')return [...getDay20V4PlayableOpening(chapter),...getDay20V4PlayableDomestic(chapter)];
  if(['dinner','quiet','shared_screen','extension'].includes(chapter.phase))return getDay20V4PlayableDomestic(chapter);
  if(chapter.phase==='conflict')return [...getDay20V4PlayableDomestic(chapter),...getDay20V4PlayableEnding(chapter)];
  if(chapter.phase==='clothes')return [...getDay20V4PlayableDomestic(chapter),...getDay20V4PlayableIntimacy(chapter)];
  if(['closeness','contact_resolution','next_evening','song'].includes(chapter.phase))return getDay20V4PlayableIntimacy(chapter);
  if(chapter.phase==='night_end')return chapter.facts.preparation==='SHORT_TEA'?[...getDay20V4PlayableOpening(chapter),...getDay20V4PlayableEnding(chapter)]:[...getDay20V4PlayableIntimacy(chapter),...getDay20V4PlayableEnding(chapter)];
  return getDay20V4PlayableEnding(chapter);
}
export function getDay20V4GameSegment(state){const chapter=state.storyFlags?.day20V4;if(!validateDay20V4(chapter))throw new Error('DAY20_INVALID_SAVE');return rawSegment(chapter).filter(step=>!boundaries.has(step.type)).map(step=>step.type==='sceneDirection'?{type:'transition',style:'crossfade',label:`SCENE ${String(step.number).padStart(2,'0')} · ${step.title}`,sceneNumber:step.number,bgmId:step.time==='night'?'theme':'daily',...presentation(step)}:step);}
export function getDay20V4GameResumePresentation(state){const chapter=state.storyFlags?.day20V4;if(!validateDay20V4(chapter))throw new Error('DAY20_INVALID_SAVE');const solo=chapter.input.visitMode==='SOLO',night=!['preparation','request','cup','kitchen','dinner','quiet','shared_screen','extension'].includes(chapter.phase);return presentation({location:night?'home-night':'home-evening',time:night?'night':'evening',character:solo?null:'girlfriend'});}
export function applyDay20V4GameChoice(state,id){const snapshot=structuredClone(state.storyFlags?.day20V4);try{const result=applyDay20V4Choice(state,id);return {result,steps:getDay20V4GameSegment(state)};}catch(error){state.storyFlags.day20V4=snapshot;throw error;}}
export function applyDay20V4GameResolution(state,response){const snapshot=structuredClone(state.storyFlags?.day20V4);try{const result=response?.type==='haeunContactResponse'?resolveDay20V4Contact(state,response):response?.type==='haeunStayResponse'?resolveDay20V4Stay(state,response):(()=>{throw new Error('DAY20_UNKNOWN_RESOLUTION')})();return {result,steps:getDay20V4GameSegment(state)};}catch(error){state.storyFlags.day20V4=snapshot;throw error;}}
export function completeDay20V4GameChapter(state,cue){const chapter=completeDay20V4(state,cue);state.storyHistory??=[];if(!state.storyHistory.some(record=>record.sceneId===DAY20_V4_CAMPAIGN_SLOT))state.storyHistory.push({sceneId:DAY20_V4_CAMPAIGN_SLOT,scenarioId:'day20-notion-v4',day:20,arc:'같은 집, 다른 하루',choiceId:chapter.choices.filter(record=>record.kind==='choice').at(-1)?.id??null,response:'무엇을 해 주는 시간뿐 아니라 각자의 모습으로 함께 있거나 혼자 쉬는 저녁을 실제 선택대로 남겼다.',facts:structuredClone(chapter.facts),choices:structuredClone(chapter.choices)});state.storyFlags.day20RuntimeComplete=true;state.pendingStoryId=null;return {type:'sceneEnd',day:20,complete:true};}
