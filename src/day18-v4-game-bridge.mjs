import {getDay18V4Entry, beginDay18V4, applyDay18V4Choice, completeDay18V4, getDay18V4FollowUpContract} from './day18-v4-state-contract.mjs?v=3';
import {getDay18V4PlayableSegment} from './day18-v4-playable-script.mjs?v=56';
import {BACKGROUND_ASSETS, NPC_ASSETS} from './assets/asset-manifest.mjs';
import {MAP_LOCATION_ASSETS} from './map-location-assets.mjs';
import {STORY_OUTFIT_ASSETS} from './story-outfit-assets.mjs';

export const DAY18_V4_CAMPAIGN_SLOT = 'm30-day18-current-home-safety';
const clock = {morning: '08:00', afternoon: '12:30', evening: '19:00', night: '22:00'};

export function getDay18V4GameContext(state) {
  const f = state.storyFlags ?? {};
  return {
    callScheduling: true,
    separateDinnerScheduling: true,
    haeunContactAllowed: f.day17V4HaeunContactPaused !== true,
    // Not knowing one's feelings is not an affirmative romantic interest.
    otherInterest: f.day12V3SeojinIntent === 'SPARK',
    yuriPastRelevant: f.day16V4YuriEncountered === true &&
      ['CONTACT_SHARED', 'LIMITED_CONVERSATION'].includes(f.day16V4HaeunYuriKnowledge) &&
      f.day16V4IntentToYuri !== 'END_HERE',
    yuriOwnBookKnown: f.day16V4YuriEncountered === true && f.day16V4ConversationDepth === 'PRESENT_ONLY',
    handHoldingComfortable: f.day7V3HandContactEstablished === true && f.day15V4HaeunLeft !== true
  };
}

export function getDay18V4GameCompatibility(state) {
  const result = getDay18V4Entry(state, getDay18V4GameContext(state));
  // A save that was already running the pre-V4 campaign stays in that campaign.
  if (result.mode === 'BLOCKED_PREREQUISITE' && state.storyFlags?.day17CurrentHealthRoutineCompleted === true &&
    state.storyFlags?.day17V4Completed !== true) return {mode: 'LEGACY'};
  return result;
}

export function prepareDay18V4GameEntry(state) {
  const entry = getDay18V4GameCompatibility(state);
  return entry.mode === 'V4_NEW' ? beginDay18V4(state, getDay18V4GameContext(state)) : entry;
}

function presentation(direction) {
  const characterId = direction.character === 'yuri' ? 'player-ex' : direction.character;
  const backgroundId = ({'rose-bistro': 'day18-rose-bistro', 'alley-pub': 'day18-alley-pub',
    'gimbap-village': 'day18-gimbap-evening', 'neighborhood-day': 'neighborhood-night'})[direction.location] ?? direction.location;
  const backgroundUrl = MAP_LOCATION_ASSETS[backgroundId] ?? BACKGROUND_ASSETS[backgroundId];
  if (!backgroundUrl) throw new Error(`DAY18_BACKGROUND_MISSING:${backgroundId}`);
  return {backgroundId, backgroundUrl, characterId,
    characterAssetUrl: characterId === 'girlfriend' ? STORY_OUTFIT_ASSETS.day8 : characterId === 'player-ex'
      ? (direction.outerwear===true ? 'assets/heroines/yuri/yuri-ex-girlfriend-jacket-2d-v1.png' : NPC_ASSETS['player-ex']) : null,
    expressionId: 'calm', poseId: 'standing', timeOfDay: direction.time,
    storyClock: clock[direction.time], storyLocation: direction.location};
}

function priorDirection(chapter) {
  const previous = chapter.choices.at(-1)?.phase;
  if (!previous && chapter.phase === 'morning') return {number: 1, title: '나의 방', location: 'day4-bedroom-morning', time: 'morning', character: null};
  const restaurant = ['menu', 'yuri_purpose', 'yuri_apology', 'yuri_relationship', 'yuri_correction', 'yuri_next', 'payment', 'haeun_topic', 'closeness', 'solo_contact', 'return'].includes(previous);
  if (restaurant) return {number: 3, title: '저녁', location: chapter.facts.dinner === 'YURI' ? 'rose-bistro' : chapter.facts.dinner === 'HAEUN' ? 'alley-pub' : 'gimbap-village',
    time: 'evening', character: chapter.facts.dinner === 'YURI' ? 'yuri' : chapter.facts.dinner === 'HAEUN' ? 'girlfriend' : null};
  const time = !previous || previous === 'morning' ? 'morning' : previous === 'disclosure' ? 'afternoon' : 'night';
  return {number: time === 'night' ? 17 : 1, title: '나의 방', location: time === 'night' ? 'home-evening' : 'home-morning', time, character: null};
}

export function getDay18V4GameSegment(state) {
  const chapter = state.storyFlags?.day18V4;
  const steps = getDay18V4PlayableSegment(chapter);
  const direction = priorDirection(chapter);
  return [
    {type: 'transition', style: 'crossfade', label: direction.title, ...presentation(direction)},
    ...steps.map(step => step.type === 'sceneDirection' ? {type: 'transition', style: 'crossfade',
      label: `SCENE ${String(step.number).padStart(2, '0')} · ${step.title}`, sceneNumber: step.number,
      bgmId: step.time === 'night' ? 'theme' : 'daily', ...presentation(step)} : step)
  ];
}

export function getDay18V4GameResumePresentation(state) {
  return presentation(priorDirection(state.storyFlags.day18V4));
}

export function applyDay18V4GameChoice(state, id) {
  applyDay18V4Choice(state, id);
  return getDay18V4GameSegment(state);
}

export function completeDay18V4GameChapter(state, cue) {
  const chapter = completeDay18V4(state, cue);
  state.storyHistory ??= [];
  if (!state.storyHistory.some(r => r.sceneId === DAY18_V4_CAMPAIGN_SLOT)) {
    state.storyHistory.push({sceneId: DAY18_V4_CAMPAIGN_SLOT, scenarioId: 'day18-notion-v4', day: 18,
      arc: '말하지 않은 저녁', choiceId: chapter.choices.at(-1).id, response: '오늘의 저녁과 실제로 나눈 말을 기록했다.',
      facts: chapter.facts, choices: chapter.choices, followUp: getDay18V4FollowUpContract(chapter)});
  }
  // Do not call the old safety choice: it grants unrelated access/clue effects.
  state.storyFlags.day18RuntimeComplete = true;
  state.pendingStoryId = null;
  return {type: 'sceneEnd', day: 18, complete: true};
}
