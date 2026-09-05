import {BACKGROUND_ASSETS} from './assets/asset-manifest.mjs?v=24';
import {applyDay22V4Choice,beginDay22V4,completeDay22V4,getDay22V4Entry,resolveDay22V4Contact,resolveDay22V4Photo,validateDay22V4} from './day22-v4-state-contract.mjs';
import {getDay22V4PlayableOpening} from './day22-v4-playable-opening.mjs?v=2';
import {getDay22V4PlayableMealPhoto} from './day22-v4-playable-meal-photo.mjs?v=2';
import {getDay22V4PlayableCafe} from './day22-v4-playable-cafe.mjs?v=2';
import {getDay22V4PlayableEvening} from './day22-v4-playable-evening.mjs?v=3';
import {getDay22V4PlayableNoTravel} from './day22-v4-playable-no-travel.mjs';
import {getDay22V4PlayableEnding} from './day22-v4-playable-ending.mjs?v=2';
import {STORY_OUTFIT_ASSETS} from './story-outfit-assets.mjs';

export const DAY22_V4_CAMPAIGN_SLOT='m30-day22-current-recovery-day';
const boundaries=new Set(['openingBoundary','mealPhotoBoundary','cafeBoundary','eveningBoundary','noTravelBoundary','endingBoundary']);
const clock=Object.freeze({morning:'09:00',noon:'12:30',afternoon:'15:30',evening:'19:00',night:'22:00',day:'13:00'});
const backgrounds=Object.freeze({
  'travel-meeting':'yeonhui-station',train:'day22-busan-station','busan-station':'day22-busan-station','seoul-meeting':'neighborhood-street-day','seoul-transit':'yeonhui-station','seoul-start':'neighborhood-park-day',
  'busan-restaurant':'day22-milmyun-house','seoul-restaurant':'day18-gimbap-evening',restaurant:'small-cafe',haeundae:'day22-haeundae-beach','seoul-walk':'day7-river-promenade-day','meeting-point':'neighborhood-street-day',
  'marine-view-cafe':'day22-marine-cafe','seoul-cafe':'small-cafe','outside-cafe':'day7-river-promenade-day',cafe:'small-cafe','busan-shared-lodging':'day22-busan-lodging','busan-separate-lodging':'day22-busan-lodging','seoul-evening':'neighborhood-night','seoul-return':'neighborhood-night',home:'home-night','busan-night':'river-night'
});

export function getDay22V4GameCompatibility(state){const entry=getDay22V4Entry(state);if(entry.mode==='BLOCKED_PREREQUISITE'&&state.storyFlags?.day21RuntimeComplete===true&&state.storyFlags?.day21V4?.complete!==true)return {mode:'LEGACY'};return entry;}
export function prepareDay22V4GameEntry(state){const entry=getDay22V4GameCompatibility(state);return entry.mode==='V4_NEW'?beginDay22V4(state):entry;}

function presentation(direction){const backgroundId=backgrounds[direction.location]??direction.location,backgroundUrl=BACKGROUND_ASSETS[backgroundId];if(!backgroundUrl)throw new Error(`DAY22_BACKGROUND_MISSING:${backgroundId}`);const characterId=direction.character==='girlfriend'?'girlfriend':null;return {backgroundId,backgroundUrl,characterId,characterAssetUrl:characterId?STORY_OUTFIT_ASSETS.day12:null,expressionId:'calm',poseId:'standing',timeOfDay:direction.time,storyClock:clock[direction.time],storyLocation:direction.location};}
function rawSegment(chapter){
  if(['baggage','movement','first_plan'].includes(chapter.phase))return getDay22V4PlayableOpening(chapter);
  if(chapter.phase==='meal_record')return [...getDay22V4PlayableOpening(chapter),...getDay22V4PlayableMealPhoto(chapter)];
  if(['pace','photo_share'].includes(chapter.phase))return getDay22V4PlayableMealPhoto(chapter);
  if(chapter.phase==='cafe')return [...getDay22V4PlayableMealPhoto(chapter),...getDay22V4PlayableCafe(chapter)];
  if(['shared_photo','photo_resolution','expectations','mutual_plan'].includes(chapter.phase))return getDay22V4PlayableCafe(chapter);
  if(chapter.phase==='rest_order')return [...getDay22V4PlayableCafe(chapter),...getDay22V4PlayableEvening(chapter)];
  if(['unwind','presence','contact','contact_resolution','reflection','dinner'].includes(chapter.phase))return getDay22V4PlayableEvening(chapter);
  if(chapter.phase==='seoul_return')return [...getDay22V4PlayableEvening(chapter),...getDay22V4PlayableEnding(chapter)];
  if(chapter.input.route==='NO_TRAVEL'&&chapter.phase!=='ending')return getDay22V4PlayableNoTravel(chapter);
  if(chapter.phase==='ending'&&chapter.input.route==='NO_TRAVEL')return [...getDay22V4PlayableNoTravel(chapter),...getDay22V4PlayableEnding(chapter)];
  if(chapter.phase==='ending'&&chapter.input.route==='BUSAN_TRIP')return [...getDay22V4PlayableEvening(chapter),...getDay22V4PlayableEnding(chapter)];
  return getDay22V4PlayableEnding(chapter);
}
export function getDay22V4GameSegment(state){const chapter=state.storyFlags?.day22V4;if(!validateDay22V4(chapter))throw new Error('DAY22_INVALID_SAVE');return rawSegment(chapter).filter(step=>!boundaries.has(step.type)).map(step=>step.type==='sceneDirection'?{type:'transition',style:'crossfade',label:`SCENE ${String(step.number).padStart(2,'0')} · ${step.title}`,sceneNumber:step.number,bgmId:step.time==='night'?'theme':'daily',...presentation(step)}:step);}

function resumeDirection(chapter){const phase=chapter.phase,route=chapter.input.route;if(route==='NO_TRAVEL')return {location:'home',time:phase==='ending'?'night':'day',character:null};if(['baggage','movement','first_plan'].includes(phase))return {location:route==='BUSAN_TRIP'?(phase==='baggage'?'travel-meeting':'train'):(phase==='baggage'?'seoul-meeting':'seoul-transit'),time:'morning',character:'girlfriend'};if(['meal_record','pace'].includes(phase))return {location:route==='BUSAN_TRIP'?'busan-restaurant':'seoul-restaurant',time:'noon',character:'girlfriend'};if(phase==='photo_share')return {location:route==='BUSAN_TRIP'?'haeundae':'seoul-walk',time:'afternoon',character:chapter.facts.pacePlan==='SEPARATE_BRIEFLY'?null:'girlfriend'};if(['cafe','shared_photo','photo_resolution','expectations','mutual_plan'].includes(phase))return {location:route==='BUSAN_TRIP'?'marine-view-cafe':'seoul-cafe',time:'afternoon',character:'girlfriend'};if(phase==='seoul_return'||(route==='SEOUL_DAY'&&phase==='ending'))return {location:'seoul-return',time:'night',character:phase==='seoul_return'?'girlfriend':null};return {location:route==='BUSAN_TRIP'?(chapter.input.sharedLodgingSpace?'busan-shared-lodging':'busan-separate-lodging'):'seoul-evening',time:['rest_order','unwind','presence'].includes(phase)?'evening':'night',character:chapter.input.sharedLodgingSpace?'girlfriend':null};}
export function getDay22V4GameResumePresentation(state){const chapter=state.storyFlags?.day22V4;if(!validateDay22V4(chapter))throw new Error('DAY22_INVALID_SAVE');return presentation(resumeDirection(chapter));}

export function applyDay22V4GameChoice(state,id){const snapshot=structuredClone(state.storyFlags?.day22V4);try{const result=applyDay22V4Choice(state,id);return {result,steps:getDay22V4GameSegment(state)};}catch(error){state.storyFlags.day22V4=snapshot;throw error;}}
export function applyDay22V4GameResolution(state,response){const snapshot=structuredClone(state.storyFlags?.day22V4);try{const result=response?.type==='haeunPhotoResponse'?resolveDay22V4Photo(state,response):response?.type==='haeunContactResponse'?resolveDay22V4Contact(state,response):(()=>{throw new Error('DAY22_UNKNOWN_RESOLUTION')})();return {result,steps:getDay22V4GameSegment(state)};}catch(error){state.storyFlags.day22V4=snapshot;throw error;}}

export function completeDay22V4GameChapter(state,cue){const chapter=completeDay22V4(state,cue);state.storyHistory??=[];if(!state.storyHistory.some(record=>record.sceneId===DAY22_V4_CAMPAIGN_SLOT))state.storyHistory.push({sceneId:DAY22_V4_CAMPAIGN_SLOT,scenarioId:'day22-notion-v4',day:22,arc:'떠날 수 있는 사람',choiceId:chapter.choices.filter(record=>record.kind==='choice').at(-1)?.id??null,response:chapter.input.route==='NO_TRAVEL'?'멀리 떠나지 않은 하루에도 실제로 고른 생활과 자기 속도가 남았다.':chapter.input.route==='SEOUL_DAY'?'서울에서 함께 고친 하루를 보내고 낯선 숙소 없이 각자 집으로 돌아왔다.':'실제로 확정한 부산 여행에서 서로 다른 속도와 경계를 말하며 예약한 공간의 밤까지 보냈다.',facts:structuredClone(chapter.facts),choices:structuredClone(chapter.choices),route:chapter.input.route,travelPurchase:structuredClone(chapter.input.day21TravelPurchase)});state.storyFlags.day22RuntimeComplete=true;state.pendingStoryId=null;return {type:'sceneEnd',day:22,complete:true};}
