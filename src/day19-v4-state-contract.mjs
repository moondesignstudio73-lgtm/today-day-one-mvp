import {getDay18V4FollowUpContract, validateDay18V4} from './day18-v4-state-contract.mjs';
import {DAY19_V4_SOURCE_SCENES} from './day19-v4-source-registry.mjs';

export const DAY19_V4_SCHEMA = 'day19-notion-v4/1';
export const DAY19_V4_LOTTERY_TICKET_PRICE = 5000;
const clone = value => JSON.parse(JSON.stringify(value));
const legacyKeys = ['day19RoleStrategy', 'day19ZoneStrategy', 'day19RenegotiateStrategy',
  'day19RuntimeStage', 'day19CurrentSharedChoreCompleted', 'day19RuntimeComplete'];
const phaseNumbers = Object.freeze({money_view: 1, scope: 2, expectation_spend: 3, minho_reply: 4,
  budget: 5, schedule_trim: 6, motive: 7, companion_wait: 8, comfort_spend: 9,
  candidate: 10, reservation: 11, expectation: 12, dinner: 13, tomorrow_table: 14,
  pending_contact: 15, reserve: 16});
const suffixes = Object.freeze({
  1: ['money', 'ask_haeun', 'draft'], 2: ['near', 'save_later', 'compare'],
  3: ['no_spend', 'lottery', 'investment_separate'], 4: ['dates', 'duration', 'tomorrow'],
  5: ['separate_ranges', 'offer_more', 'ignore_money'], 6: ['drop_place', 'later_departure', 'one_priority'],
  7: ['good_day', 'show_capacity', 'repair_relationship'], 8: ['conditions_only', 'separate_day', 'share_wants'],
  9: ['easier_move', 'longer_view', 'keep_money'], 10: ['busan_night', 'seoul_day', 'defer_trip'],
  11: ['candidate_only', 'recheck', 'reserve_first'], 12: ['current_money', 'name_disappointment', 'joke_back'],
  13: ['eat_together', 'eat_separately', 'tomorrow_home'], 14: ['cups', 'one_food_each', 'decide_hungry'],
  15: ['answer_now', 'ask_time', 'defer'], 16: ['living_money', 'shared_range', 'no_more_spend']
});
const soloLabels = Object.freeze({
  5: ['생활비를 먼저 남긴다.', '내가 꼭 쓰고 싶은 한 가지를 정한다.', '일단 큰 금액부터 맞춰 본다.'],
  14: ['컵을 꺼내 놓자.', '먹을 것 하나 정하자.', '내일 몸을 보고 정하자.']
});

function sourceChoice(number) {
  const result = DAY19_V4_SOURCE_SCENES.flatMap(scene => scene.choices).find(choice => choice.number === number);
  if (!result) throw new Error(`DAY19_SOURCE_CHOICE_MISSING:${number}`);
  return result;
}

function options(number, labels = sourceChoice(number).labels, variant = null) {
  return labels.map((label, index) => Object.freeze({
    id: `day19_v4_c${number}_${variant ? `${variant}_` : ''}${suffixes[number][index]}`,
    label
  }));
}

function pendingContacts(flags, day18) {
  const result = [];
  if (day18.facts.yuriNext === 'REQUESTED_NOT_ACCEPTED') result.push('YURI');
  if (flags.day12V3PersonalInvitation === true && flags.day12V3SeojinReply === 'ACCEPTED_IN_PRINCIPLE') result.push('SEOJIN');
  if (flags.day13V3PhotoContact === 'OCCASIONAL_EXCHANGE') result.push('ARA');
  return result;
}

function deriveInput(state) {
  const flags = state.storyFlags ?? {}, day18 = flags.day18V4;
  const followUp = getDay18V4FollowUpContract(day18);
  const relationshipActive = state.breakup == null && state.ended !== true && day18.input.relationshipActive;
  const contactAllowed = relationshipActive && day18.input.contactAllowed;
  const relationshipTone = day18.facts.nightRoute === 'CALM' ? 'CALM' :
    ['UNRESOLVED', 'ENDED_CALL', 'RELATIONSHIP'].includes(day18.facts.nightRoute) ? 'DIFFICULT' : 'QUIET';
  const sharedPlanningEligible = contactAllowed && relationshipTone === 'CALM' && day18.facts.travelTogetherDiscussed === true;
  return {
    relationshipActive, contactAllowed, relationshipTone,
    planningMode: sharedPlanningEligible ? 'CALL_SHARED' : 'SOLO',
    sharedPlanningEligible,
    tomorrowMealAcceptancePossible: sharedPlanningEligible,
    day18TravelCandidate: day18.facts.travelCandidate ?? null,
    day18FollowUpStatus: followUp.status,
    day18DiscussionPending: ['DISCUSSION_PENDING', 'CONTACT_PROMISED', 'TIME_WINDOW_AGREED'].includes(followUp.status),
    haeunKnowsYuriDinner: day18.facts.haeunKnowsDinner === true,
    pendingContacts: pendingContacts(flags, day18),
    lotteryBudgetEligible: flags.day19EntertainmentBudgetReserved === true &&
      Number.isFinite(state.money) && state.money >= DAY19_V4_LOTTERY_TICKET_PRICE,
    source: {day18Schema: day18.schema, day18NightRoute: day18.facts.nightRoute,
      day18TravelTogetherDiscussed: day18.facts.travelTogetherDiscussed === true}
  };
}

export function getDay19V4Entry(state) {
  const flags = state?.storyFlags ?? {};
  if (flags.day19V4 != null) return {mode: validateDay19V4(flags.day19V4) ? 'V4' : 'INVALID_V4'};
  if (legacyKeys.some(key => flags[key] != null && flags[key] !== false && flags[key] !== 0)) return {mode: 'LEGACY'};
  if (!validateDay18V4(flags.day18V4) || flags.day18V4.complete !== true ||
    flags.day18V4Day19HookPending !== true) return {mode: 'BLOCKED_PREREQUISITE'};
  return {mode: 'V4_NEW', input: deriveInput(state)};
}

function initial(input) {
  return {schema: DAY19_V4_SCHEMA, input: clone(input), choices: [], phase: 'money_view', complete: false,
    facts: {planStart: null, tripScope: null, lottery: null, investmentPurchased: false,
      minhoReply: null, paidWorkConfirmed: false, budgetMode: null, scheduleTrim: null,
      preparationMotive: null, companionStatus: input.sharedPlanningEligible ? 'INTEREST_NOT_ACCEPTANCE' : 'NONE',
      spendPriority: null, travelCandidate: null, reservationStatus: 'NOT_RESERVED',
      expectationHandling: null, dinner: null, tomorrowMeal: 'NOT_PROPOSED', tomorrowTable: null,
      contactHandling: null, reservedMoney: null, transferredPartnerMoney: false,
      travelPaymentMade: false, lotteryWinningsCounted: false}}
}

export function beginDay19V4(state) {
  const entry = getDay19V4Entry(state);
  if (entry.mode !== 'V4_NEW') return entry;
  state.storyFlags.day19V4 = initial(entry.input);
  return {mode: 'V4'};
}

export function getDay19V4Options(chapter) {
  const number = phaseNumbers[chapter?.phase];
  if (!number) {
    if (chapter?.phase === 'ending') return [];
    throw new Error(`DAY19_INVALID_PHASE:${chapter?.phase}`);
  }
  if (number === 5 && !chapter.input.sharedPlanningEligible) return options(5, soloLabels[5], 'solo');
  if (number === 14 && chapter.facts.tomorrowMeal !== 'ACCEPTED') return options(14, soloLabels[14], 'solo');
  return options(number);
}

function reduce(chapter, id) {
  if (chapter.complete) throw new Error('DAY19_ALREADY_COMPLETE');
  const available = getDay19V4Options(chapter);
  const selected = available.find(option => option.id === id);
  if (!selected) throw new Error(`DAY19_CHOICE_UNAVAILABLE:${id}`);
  const phase = chapter.phase, number = phaseNumbers[phase], facts = chapter.facts;
  chapter.choices.push({number, phase, id});
  const index = available.indexOf(selected);
  switch (number) {
    case 1: facts.planStart = ['MONEY_FIRST', 'ASK_HAEUN', 'DRAFT_FIRST'][index]; chapter.phase = 'scope'; break;
    case 2: facts.tripScope = ['NEAR', 'SAVE_FOR_LATER', 'COMPARE_SHORT_TRIP'][index]; chapter.phase = 'expectation_spend'; break;
    case 3:
      facts.lottery = index === 1 ? (chapter.input.lotteryBudgetEligible ? 'PURCHASE_PENDING_RESULT' : 'STOPPED_NO_RESERVED_BUDGET') : 'NOT_PURCHASED';
      facts.investmentPurchased = false; chapter.phase = 'minho_reply'; break;
    case 4: facts.minhoReply = ['CHECK_DATES', 'ASK_DURATION', 'REPLY_TOMORROW'][index]; chapter.phase = 'budget'; break;
    case 5: facts.budgetMode = chapter.input.sharedPlanningEligible ? ['SEPARATE_RANGES', 'OFFER_MORE_NOT_ACCEPTED', 'IGNORE_MONEY_REJECTED'][index] : ['LIVING_MONEY_FIRST', 'ONE_PERSONAL_PRIORITY', 'RESTORE_LIVING_COST'][index]; chapter.phase = 'schedule_trim'; break;
    case 6: facts.scheduleTrim = ['DROP_PLACE', 'DEPART_LATER', 'ONE_PRIORITY'][index]; chapter.phase = 'motive'; break;
    case 7: facts.preparationMotive = ['GOOD_DAY', 'SHOW_CAPACITY', 'REPAIR_RELATIONSHIP'][index]; chapter.phase = 'companion_wait'; break;
    case 8: facts.companionStatus = ['CANDIDATE_CONDITIONS_ONLY', 'SEPARATE_DAY_OK', 'WANTS_SHARED_NOT_ACCEPTED'][index]; chapter.phase = 'comfort_spend'; break;
    case 9: facts.spendPriority = ['EASIER_MOVE', 'LONGER_VIEW', 'KEEP_MONEY'][index]; chapter.phase = 'candidate'; break;
    case 10: facts.travelCandidate = ['BUSAN_NIGHT', 'SEOUL_DAY', 'DEFERRED'][index]; chapter.phase = 'reservation'; break;
    case 11: facts.reservationStatus = 'CANDIDATE_ONLY'; facts.travelPaymentMade = false; chapter.phase = 'expectation'; break;
    case 12: facts.expectationHandling = ['CURRENT_MONEY_ONLY', 'NAME_DISAPPOINTMENT', 'JOKE_WITH_JIHOON'][index]; chapter.phase = 'dinner'; break;
    case 13:
      facts.dinner = ['TOGETHER_IF_AVAILABLE', 'SEPARATE', 'TOMORROW_HOME_PROPOSAL'][index];
      facts.tomorrowMeal = index === 2 ? (chapter.input.tomorrowMealAcceptancePossible ? 'ACCEPTED' : 'DECLINED_OR_REST') : 'NOT_PROPOSED';
      chapter.phase = 'tomorrow_table'; break;
    case 14:
      facts.tomorrowTable = chapter.facts.tomorrowMeal === 'ACCEPTED' ? ['CUPS_TOGETHER', 'ONE_FOOD_EACH', 'DECIDE_WHEN_HUNGRY'][index] : ['CUP_FOR_SELF', 'ONE_FOOD_FOR_SELF', 'CHECK_BODY_TOMORROW'][index];
      chapter.phase = chapter.input.pendingContacts.length ? 'pending_contact' : 'reserve'; break;
    case 15: facts.contactHandling = ['ANSWER_WITHOUT_FALSE_PROMISE', 'REQUEST_TIME_NOT_HOLD', 'DEFERRED_UNRESOLVED'][index]; chapter.phase = 'reserve'; break;
    case 16: facts.reservedMoney = ['LIVING_MONEY', 'AGREED_RANGE_ONLY', 'NO_MORE_SPEND'][index]; chapter.phase = 'ending'; break;
    default: throw new Error(`DAY19_INVALID_CHOICE_NUMBER:${number}`);
  }
  return chapter;
}

export function validateDay19V4(chapter) {
  try {
    if (chapter?.schema !== DAY19_V4_SCHEMA || !Array.isArray(chapter.choices) || typeof chapter.complete !== 'boolean') return false;
    const input = chapter.input;
    if (!['CALM', 'DIFFICULT', 'QUIET'].includes(input?.relationshipTone) || !['CALL_SHARED', 'SOLO'].includes(input?.planningMode)) return false;
    for (const key of ['relationshipActive', 'contactAllowed', 'sharedPlanningEligible', 'tomorrowMealAcceptancePossible',
      'day18DiscussionPending', 'haeunKnowsYuriDinner', 'lotteryBudgetEligible']) if (typeof input[key] !== 'boolean') return false;
    if (!Array.isArray(input.pendingContacts) || new Set(input.pendingContacts).size !== input.pendingContacts.length ||
      input.pendingContacts.some(contact => !['YURI', 'SEOJIN', 'ARA'].includes(contact))) return false;
    if (input.sharedPlanningEligible !== (input.planningMode === 'CALL_SHARED') ||
      (input.sharedPlanningEligible && (!input.relationshipActive || !input.contactAllowed || input.relationshipTone !== 'CALM')) ||
      (input.tomorrowMealAcceptancePossible && !input.sharedPlanningEligible)) return false;
    const replay = initial(input);
    for (const record of chapter.choices) {
      if (record.phase !== replay.phase || record.number !== phaseNumbers[replay.phase]) return false;
      reduce(replay, record.id);
    }
    if (chapter.complete && replay.phase !== 'ending') return false;
    replay.complete = chapter.complete;
    return JSON.stringify(replay) === JSON.stringify(chapter);
  } catch { return false; }
}

export function applyDay19V4Choice(state, id) {
  const chapter = state?.storyFlags?.day19V4;
  if (!validateDay19V4(chapter)) throw new Error('DAY19_INVALID_SAVE');
  const next = reduce(clone(chapter), id);
  state.storyFlags.day19V4 = next;
  return clone(next);
}

export function completeDay19V4(state, cue) {
  const chapter = state?.storyFlags?.day19V4;
  if (!validateDay19V4(chapter) || chapter.phase !== 'ending' || cue?.type !== 'chapterCompletionCue' ||
    cue.day !== 19 || cue.finalSceneReached !== true) throw new Error('DAY19_INVALID_COMPLETION');
  if (chapter.complete) return clone(chapter);
  chapter.complete = true;
  state.storyFlags.day19V4Day20HookPending = true;
  state.storyFlags.day18V4Day19HookPending = false;
  return clone(chapter);
}
