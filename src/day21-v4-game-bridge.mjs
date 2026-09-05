import {BACKGROUND_ASSETS} from './assets/asset-manifest.mjs';
import {recordTransaction} from './economy-manager.mjs';
import {applyDay21V4Choice,beginDay21V4,completeDay21V4,getDay21V4Entry,resolveDay21V4Contact,resolveDay21V4Lodging,resolveDay21V4Travel,validateDay21V4} from './day21-v4-state-contract.mjs';
import {getDay21V4PlayableOpening} from './day21-v4-playable-opening.mjs';
import {getDay21V4PlayableStory} from './day21-v4-playable-story.mjs';
import {getDay21V4PlayableFeelings} from './day21-v4-playable-feelings.mjs';
import {getDay21V4PlayableEvening} from './day21-v4-playable-evening.mjs';
import {getDay21V4PlayableDeferred} from './day21-v4-playable-deferred.mjs';
import {STORY_OUTFIT_ASSETS} from './story-outfit-assets.mjs';

export const DAY21_V4_CAMPAIGN_SLOT='m30-day21-current-full-workday';
const boundaries=new Set(['openingBoundary','storyBoundary','feelingsBoundary','eveningBoundary','deferredBoundary']);
const clock=Object.freeze({morning:'09:00',afternoon:'15:00',evening:'19:00',night:'22:00'});
const backgrounds=Object.freeze({'home-morning':'home-morning','memory-park':'neighborhood-park-day','home-phone':'home-morning','planning-screen':'home-evening','home-evening':'home-evening','home-night':'home-night',home:'home-evening'});

export function getDay21V4GameCompatibility(state){const entry=getDay21V4Entry(state);if(entry.mode==='BLOCKED_PREREQUISITE'&&state.storyFlags?.day20RuntimeComplete===true&&state.storyFlags?.day20V4?.complete!==true)return {mode:'LEGACY'};return entry;}
export function prepareDay21V4GameEntry(state){const entry=getDay21V4GameCompatibility(state);return entry.mode==='V4_NEW'?beginDay21V4(state):entry;}

function presentation(direction){const backgroundId=backgrounds[direction.location]??direction.location,backgroundUrl=BACKGROUND_ASSETS[backgroundId];if(!backgroundUrl)throw new Error(`DAY21_BACKGROUND_MISSING:${backgroundId}`);const characterId=direction.character==='girlfriend'?'girlfriend':null;return {backgroundId,backgroundUrl,characterId,characterAssetUrl:characterId?STORY_OUTFIT_ASSETS.day12:null,expressionId:'calm',poseId:'standing',timeOfDay:direction.time,storyClock:clock[direction.time],storyLocation:direction.location};}
function rawSegment(chapter){
  if(['morning','breakfast','venue'].includes(chapter.phase))return getDay21V4PlayableOpening(chapter);
  if(chapter.phase==='listen_start')return [...getDay21V4PlayableOpening(chapter),...getDay21V4PlayableStory(chapter)];
  if(['afternoon','staying','more_story'].includes(chapter.phase))return getDay21V4PlayableStory(chapter);
  if(chapter.phase==='feelings')return [...getDay21V4PlayableStory(chapter),...getDay21V4PlayableFeelings(chapter)];
  if(['openness','contact','contact_resolution'].includes(chapter.phase))return getDay21V4PlayableFeelings(chapter);
  if(chapter.phase==='dinner')return [...getDay21V4PlayableFeelings(chapter),...getDay21V4PlayableEvening(chapter)];
  if(chapter.phase==='deferred_reflect')return [...getDay21V4PlayableOpening(chapter),...getDay21V4PlayableDeferred(chapter)];
  if(['deferred_explain','deferred_tomorrow','deferred_task','deferred_goodnight'].includes(chapter.phase))return getDay21V4PlayableDeferred(chapter);
  if(chapter.phase==='ending'&&chapter.facts.conversationMode==='DEFERRED')return getDay21V4PlayableDeferred(chapter);
  return getDay21V4PlayableEvening(chapter);
}
export function getDay21V4GameSegment(state){const chapter=state.storyFlags?.day21V4;if(!validateDay21V4(chapter))throw new Error('DAY21_INVALID_SAVE');return rawSegment(chapter).filter(step=>!boundaries.has(step.type)).map(step=>step.type==='sceneDirection'?{type:'transition',style:'crossfade',label:`SCENE ${String(step.number).padStart(2,'0')} · ${step.title}`,sceneNumber:step.number,bgmId:step.time==='night'?'theme':'daily',...presentation(step)}:step);}

function priorDirection(chapter){if(['morning','breakfast','venue'].includes(chapter.phase))return {location:'home-morning',time:'morning',character:chapter.input.morningMode==='STAYED_MORNING'?'girlfriend':null};if(chapter.facts.conversationMode==='DEFERRED')return {location:'home',time:chapter.phase==='ending'?'night':'evening',character:null};if(['listen_start','afternoon','staying','more_story','feelings','openness','contact','contact_resolution','dinner'].includes(chapter.phase))return {location:chapter.facts.conversationMode==='PARK'?'memory-park':'home-phone',time:chapter.phase==='dinner'?'evening':'afternoon',character:chapter.facts.conversationMode==='PARK'?'girlfriend':null};if(['bag','final','ending'].includes(chapter.phase))return {location:'home-night',time:'night',character:null};return {location:'planning-screen',time:'evening',character:null};}
export function getDay21V4GameResumePresentation(state){const chapter=state.storyFlags?.day21V4;if(!validateDay21V4(chapter))throw new Error('DAY21_INVALID_SAVE');return presentation(priorDirection(chapter));}

export function applyDay21V4GameChoice(state,id){const snapshot=structuredClone(state.storyFlags?.day21V4);try{const result=applyDay21V4Choice(state,id);return {result,steps:getDay21V4GameSegment(state)};}catch(error){state.storyFlags.day21V4=snapshot;throw error;}}

function travelPurchase(state,response){if(response?.type!=='travelConfirmation'||response.confirmed!==true)return null;if(!Number.isFinite(response.playerCost)||response.playerCost<=0)throw new Error('DAY21_TRAVEL_COST_REQUIRED');if(typeof response.quoteId!=='string'||!response.quoteId.trim())throw new Error('DAY21_TRAVEL_QUOTE_REQUIRED');if(state.storyFlags.day21V4TravelPurchase)throw new Error('DAY21_TRAVEL_ALREADY_RECORDED');if(!Number.isFinite(state.money)||state.money<response.playerCost)throw new Error('DAY21_TRAVEL_BUDGET_CHANGED');const entry=recordTransaction(state,{day:21,category:'travel',label:'DAY 21 부산 여행 본인 부담 예약',amount:-response.playerCost});state.storyFlags.day21V4TravelPurchase={day:21,quoteId:response.quoteId,playerCost:response.playerCost,partnerCostIncluded:false,ledgerIndex:state.economyLedger.length-1};return entry;}
export function applyDay21V4GameResolution(state,response){const snapshot={chapter:structuredClone(state.storyFlags?.day21V4),money:state.money,ledger:structuredClone(state.economyLedger??[]),purchase:structuredClone(state.storyFlags?.day21V4TravelPurchase)};try{const purchase=travelPurchase(state,response);const result=response?.type==='haeunContactResponse'?resolveDay21V4Contact(state,response):response?.type==='haeunLodgingResponse'?resolveDay21V4Lodging(state,response):response?.type==='travelConfirmation'?resolveDay21V4Travel(state,response):(()=>{throw new Error('DAY21_UNKNOWN_RESOLUTION')})();return {result,purchase,steps:getDay21V4GameSegment(state)};}catch(error){state.storyFlags.day21V4=snapshot.chapter;state.money=snapshot.money;state.economyLedger=snapshot.ledger;if(snapshot.purchase===undefined)delete state.storyFlags.day21V4TravelPurchase;else state.storyFlags.day21V4TravelPurchase=snapshot.purchase;throw error;}}

export function completeDay21V4GameChapter(state,cue){const chapter=completeDay21V4(state,cue);state.storyHistory??=[];if(!state.storyHistory.some(record=>record.sceneId===DAY21_V4_CAMPAIGN_SLOT))state.storyHistory.push({sceneId:DAY21_V4_CAMPAIGN_SLOT,scenarioId:'day21-notion-v4',day:21,arc:'남겨 둔 자리',choiceId:chapter.choices.filter(record=>record.kind==='choice').at(-1)?.id??null,response:chapter.facts.heardHaeunStory?'하은이 실제로 살아온 여러 모양의 하루를 듣고 고마움과 지금의 마음을 구분해 남겼다.':'오늘 듣지 않은 이야기는 지어내지 않고 다음 대화와 각자의 생활을 실제 선택대로 남겼다.',facts:structuredClone(chapter.facts),choices:structuredClone(chapter.choices),travelPurchase:structuredClone(state.storyFlags.day21V4TravelPurchase??null)});state.storyFlags.day21RuntimeComplete=true;state.pendingStoryId=null;return {type:'sceneEnd',day:21,complete:true};}
