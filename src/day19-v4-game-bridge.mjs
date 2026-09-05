import {BACKGROUND_ASSETS} from './assets/asset-manifest.mjs';
import {recordTransaction} from './economy-manager.mjs';
import {
  DAY19_V4_LOTTERY_TICKET_PRICE, applyDay19V4Choice, beginDay19V4, completeDay19V4,
  getDay19V4Entry, validateDay19V4
} from './day19-v4-state-contract.mjs';
import {getDay19V4PlayableOpening} from './day19-v4-playable-opening.mjs';
import {getDay19V4PlayableMiddle} from './day19-v4-playable-middle.mjs';
import {getDay19V4PlayableCandidates} from './day19-v4-playable-candidates.mjs?v=3';
import {getDay19V4PlayableEnding} from './day19-v4-playable-ending.mjs?v=3';
import {STORY_OUTFIT_ASSETS} from './story-outfit-assets.mjs';

export const DAY19_V4_CAMPAIGN_SLOT = 'm30-day19-current-shared-chore';
const clock = Object.freeze({morning:'09:00', afternoon:'14:00', evening:'19:00', night:'22:00'});
const locations = Object.freeze({
  'home-morning':'home-morning', 'home-afternoon':'day2-home-entry',
  'corner-cafe':'small-cafe', 'home-evening':'home-evening'
});
const boundaries = new Set(['openingBoundary', 'middleBoundary', 'candidateBoundary', 'endingBoundary']);

export function getDay19V4GameCompatibility(state) {
  const entry = getDay19V4Entry(state);
  if (entry.mode === 'BLOCKED_PREREQUISITE' && state.storyFlags?.day18RuntimeComplete === true &&
    state.storyFlags?.day18V4?.complete !== true) return {mode:'LEGACY'};
  return entry;
}

export function prepareDay19V4GameEntry(state) {
  const entry = getDay19V4GameCompatibility(state);
  return entry.mode === 'V4_NEW' ? beginDay19V4(state) : entry;
}

function presentation(direction) {
  const backgroundId = locations[direction.location] ?? direction.location;
  const backgroundUrl = BACKGROUND_ASSETS[backgroundId];
  if (!backgroundUrl) throw new Error(`DAY19_BACKGROUND_MISSING:${backgroundId}`);
  const characterId = direction.character === 'girlfriend' ? 'girlfriend' : null;
  return {backgroundId, backgroundUrl, characterId,
    characterAssetUrl:characterId ? STORY_OUTFIT_ASSETS.day8 : null,
    expressionId:'calm', poseId:'standing', timeOfDay:direction.time,
    storyClock:clock[direction.time], storyLocation:direction.location};
}

function priorDirection(chapter) {
  const phase = chapter.phase;
  if (['money_view','scope','expectation_spend','minho_reply'].includes(phase))
    return {location:'home-morning', time:'morning', character:null};
  if (['budget','schedule_trim','motive','companion_wait','comfort_spend','candidate','reservation'].includes(phase))
    return {location:chapter.input.sharedPlanningEligible ? 'corner-cafe' : 'home-afternoon',
      time:'afternoon', character:chapter.input.sharedPlanningEligible ? 'girlfriend' : null};
  return {location:'home-evening', time:['dinner','tomorrow_table'].includes(phase)?'evening':'night', character:null};
}

function rawSegment(chapter) {
  if (['money_view','scope','expectation_spend','minho_reply'].includes(chapter.phase))
    return getDay19V4PlayableOpening(chapter);
  if (chapter.phase === 'budget')
    return [...getDay19V4PlayableOpening(chapter), ...getDay19V4PlayableMiddle(chapter)];
  if (['schedule_trim','motive'].includes(chapter.phase)) return getDay19V4PlayableMiddle(chapter);
  if (chapter.phase === 'companion_wait')
    return [...getDay19V4PlayableMiddle(chapter), ...getDay19V4PlayableCandidates(chapter)];
  if (['comfort_spend','candidate','reservation','expectation'].includes(chapter.phase))
    return getDay19V4PlayableCandidates(chapter);
  if (chapter.phase === 'dinner')
    return [...getDay19V4PlayableCandidates(chapter), ...getDay19V4PlayableEnding(chapter)];
  return getDay19V4PlayableEnding(chapter);
}

export function getDay19V4GameSegment(state) {
  const chapter = state.storyFlags?.day19V4;
  if (!validateDay19V4(chapter)) throw new Error('DAY19_INVALID_SAVE');
  const steps = rawSegment(chapter).filter(step => !boundaries.has(step.type));
  return steps.map(step => step.type === 'sceneDirection' ? {
    type:'transition', style:'crossfade', label:`SCENE ${String(step.number).padStart(2,'0')} · ${step.title}`,
    sceneNumber:step.number, bgmId:step.time === 'night' ? 'theme' : 'daily', ...presentation(step)
  } : step);
}

export function getDay19V4GameResumePresentation(state) {
  const chapter = state.storyFlags?.day19V4;
  if (!validateDay19V4(chapter)) throw new Error('DAY19_INVALID_SAVE');
  return presentation(priorDirection(chapter));
}

function purchaseLotteryWithoutResult(state, choiceId) {
  const chapter = state.storyFlags.day19V4;
  if (!choiceId.endsWith('_lottery') || chapter.phase !== 'expectation_spend' ||
    chapter.input.lotteryBudgetEligible !== true) return null;
  if (state.storyFlags.day19V4LotteryPurchase) throw new Error('DAY19_LOTTERY_ALREADY_RECORDED');
  if (!Number.isFinite(state.money) || state.money < DAY19_V4_LOTTERY_TICKET_PRICE)
    throw new Error('DAY19_LOTTERY_BUDGET_CHANGED');
  const before = state.money;
  const entry = recordTransaction(state,{day:19, category:'lottery', label:'DAY 19 결과 미확인 복권 구매',
    amount:-DAY19_V4_LOTTERY_TICKET_PRICE});
  state.storyFlags.day19V4LotteryPurchase = {day:19, cost:DAY19_V4_LOTTERY_TICKET_PRICE,
    resultStatus:'UNOPENED', prizeCounted:false, choiceId, ledgerIndex:state.economyLedger.length-1};
  return {before, entry};
}

export function applyDay19V4GameChoice(state, id) {
  const snapshot = {chapter:structuredClone(state.storyFlags?.day19V4), money:state.money,
    ledger:structuredClone(state.economyLedger ?? []), purchase:state.storyFlags?.day19V4LotteryPurchase};
  try {
    const purchase = purchaseLotteryWithoutResult(state,id);
    const result = applyDay19V4Choice(state,id);
    return {result, purchase, steps:getDay19V4GameSegment(state)};
  } catch (error) {
    state.storyFlags.day19V4 = snapshot.chapter;
    state.money = snapshot.money;
    state.economyLedger = snapshot.ledger;
    if (snapshot.purchase === undefined) delete state.storyFlags.day19V4LotteryPurchase;
    else state.storyFlags.day19V4LotteryPurchase = snapshot.purchase;
    throw error;
  }
}

export function completeDay19V4GameChapter(state, cue) {
  const chapter = completeDay19V4(state,cue);
  state.storyHistory ??= [];
  if (!state.storyHistory.some(record => record.sceneId === DAY19_V4_CAMPAIGN_SLOT)) {
    state.storyHistory.push({sceneId:DAY19_V4_CAMPAIGN_SLOT, scenarioId:'day19-notion-v4', day:19,
      arc:'돈으로 사려던 시간', choiceId:chapter.choices.at(-1).id,
      response:'좋은 시간을 돈만으로 완성하지 않고 실제 예산과 상대의 선택을 남겼다.',
      facts:structuredClone(chapter.facts), choices:structuredClone(chapter.choices),
      lotteryPurchase:structuredClone(state.storyFlags.day19V4LotteryPurchase ?? null)});
  }
  state.storyFlags.day19RuntimeComplete = true;
  state.pendingStoryId = null;
  return {type:'sceneEnd', day:19, complete:true};
}
