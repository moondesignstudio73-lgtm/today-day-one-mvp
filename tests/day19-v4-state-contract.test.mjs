import assert from 'node:assert/strict';
import test from 'node:test';
import {beginDay18V4, applyDay18V4Choice, completeDay18V4} from '../src/day18-v4-state-contract.mjs';
import {
  DAY19_V4_LOTTERY_TICKET_PRICE, applyDay19V4Choice, beginDay19V4, completeDay19V4,
  getDay19V4Entry, getDay19V4Options, validateDay19V4
} from '../src/day19-v4-state-contract.mjs';

const d18 = (state, key) => applyDay18V4Choice(state, `day18_v4_${key}`);
function completedDay18(kind = 'shared') {
  const appointment = kind === 'shared' ? 'HAEUN' : 'SOLO';
  const state = {money: 42000, breakup: null, ended: false, storyFlags: {
    day17V4Completed: true, day17V4Day18HookPending: true,
    day17V4TomorrowPlan: appointment, day17V4Choice9: appointment === 'HAEUN' ? 'day17_v4_life_haeun' : 'day17_v4_life_solo',
    day17V4DinnerAgreement: {day:18, partner:appointment, status:'ACCEPTED', sourceChoiceId:'day17_v4_life_haeun'},
    day16V4YuriEncountered:false, day16V4YuriContact:'ENDED_HERE', day16V4YuriInvitation:'NONE'
  }};
  assert.equal(beginDay18V4(state, kind === 'shared' ? {} : {haeunContactAllowed:false}).mode, 'V4');
  if (kind === 'shared') {
    for (const key of ['morning_keep', 'disclose_together', 'menu_each', 'topic_good', 'close_home',
      'night_good', 'calm_trip', 'travel_near']) d18(state, key);
  } else {
    for (const key of ['morning_solo', 'menu_familiar', 'solo_food', 'return_home', 'alone_stop', 'travel_life']) d18(state, key);
  }
  completeDay18V4(state, {type:'chapterCompletionCue', day:18, finalSceneReached:true});
  return state;
}

test('DAY19 entry uses completed DAY18 facts and preserves legacy saves', () => {
  const shared = completedDay18('shared');
  const entry = getDay19V4Entry(shared);
  assert.equal(entry.mode, 'V4_NEW');
  assert.equal(entry.input.planningMode, 'CALL_SHARED');
  assert.equal(entry.input.sharedPlanningEligible, true);
  assert.equal(entry.input.day18TravelCandidate, 'travel_near');
  assert.equal(entry.input.tomorrowMealAcceptancePossible, true);
  const legacy = completedDay18('shared'); legacy.storyFlags.day19RuntimeStage = 1;
  assert.equal(getDay19V4Entry(legacy).mode, 'LEGACY');
  const blocked = completedDay18('shared'); blocked.storyFlags.day18V4Day19HookPending = false;
  assert.equal(getDay19V4Entry(blocked).mode, 'BLOCKED_PREREQUISITE');
});

test('DAY19 shared and solo choices expose exact conditional variants', () => {
  const shared = completedDay18('shared'); beginDay19V4(shared);
  while (shared.storyFlags.day19V4.phase !== 'budget') applyDay19V4Choice(shared, getDay19V4Options(shared.storyFlags.day19V4)[0].id);
  assert.deepEqual(getDay19V4Options(shared.storyFlags.day19V4).map(option => option.label),
    ['각자 편하게 쓸 수 있는 만큼 같이 보자.', '내가 더 내고 싶은 부분은 말해도 되지?', '네가 돈 신경 안 썼으면 좋겠어.']);

  const solo = completedDay18('solo'); beginDay19V4(solo);
  while (solo.storyFlags.day19V4.phase !== 'budget') applyDay19V4Choice(solo, getDay19V4Options(solo.storyFlags.day19V4)[0].id);
  assert.deepEqual(getDay19V4Options(solo.storyFlags.day19V4).map(option => option.label),
    ['생활비를 먼저 남긴다.', '내가 꼭 쓰고 싶은 한 가지를 정한다.', '일단 큰 금액부터 맞춰 본다.']);
});

test('DAY19 replay is deterministic, skips choice 15 without a real pending contact, and never reserves travel', () => {
  for (const kind of ['shared', 'solo']) for (let attitude = 0; attitude < 3; attitude++) {
    const state = completedDay18(kind);
    if (kind === 'solo' && attitude === 2) Object.assign(state.storyFlags,
      {day12V3PersonalInvitation:true, day12V3SeojinReply:'ACCEPTED_IN_PRINCIPLE'});
    if (attitude === 1) state.storyFlags.day19EntertainmentBudgetReserved = true;
    assert.equal(beginDay19V4(state).mode, 'V4');
    let guard = 0;
    while (state.storyFlags.day19V4.phase !== 'ending') {
      assert.ok(guard++ < 18);
      const chapter = state.storyFlags.day19V4, before = JSON.stringify(chapter);
      const choices = getDay19V4Options(chapter);
      const index = chapter.phase === 'dinner' && kind === 'shared' ? 2 : attitude % choices.length;
      applyDay19V4Choice(state, choices[index].id);
      assert.equal(validateDay19V4(state.storyFlags.day19V4), true);
      assert.notEqual(JSON.stringify(state.storyFlags.day19V4), before);
      assert.equal(validateDay19V4(JSON.parse(JSON.stringify(state.storyFlags.day19V4))), true);
    }
    const chapter = state.storyFlags.day19V4;
    assert.equal(chapter.facts.reservationStatus, 'CANDIDATE_ONLY');
    assert.equal(chapter.facts.travelPaymentMade, false);
    assert.equal(chapter.facts.lotteryWinningsCounted, false);
    assert.equal(chapter.facts.paidWorkConfirmed, false);
    assert.equal(chapter.facts.transferredPartnerMoney, false);
    assert.equal(chapter.choices.some(choice => choice.number === 15), chapter.input.pendingContacts.length > 0);
    if (kind === 'shared') assert.equal(chapter.facts.tomorrowMeal, 'ACCEPTED');
    else assert.notEqual(chapter.facts.tomorrowMeal, 'ACCEPTED');
  }
});

test('lottery choice fails closed without a pre-existing budget and records no imaginary winnings', () => {
  for (const budget of [false, true]) {
    const state = completedDay18('solo');
    state.storyFlags.day19EntertainmentBudgetReserved = budget;
    state.money = DAY19_V4_LOTTERY_TICKET_PRICE;
    beginDay19V4(state);
    applyDay19V4Choice(state, getDay19V4Options(state.storyFlags.day19V4)[0].id);
    applyDay19V4Choice(state, getDay19V4Options(state.storyFlags.day19V4)[0].id);
    applyDay19V4Choice(state, getDay19V4Options(state.storyFlags.day19V4)[1].id);
    assert.equal(state.storyFlags.day19V4.facts.lottery, budget ? 'PURCHASE_PENDING_RESULT' : 'STOPPED_NO_RESERVED_BUDGET');
    assert.equal(state.storyFlags.day19V4.facts.lotteryWinningsCounted, false);
    assert.equal(state.money, DAY19_V4_LOTTERY_TICKET_PRICE, 'state contract alone does not perform a partial ledger mutation');
  }
});

test('tampering is rejected and completion consumes only the DAY19 hook', () => {
  const state = completedDay18('shared'); beginDay19V4(state);
  while (state.storyFlags.day19V4.phase !== 'ending') {
    const options = getDay19V4Options(state.storyFlags.day19V4);
    const index = state.storyFlags.day19V4.phase === 'dinner' ? 2 : 0;
    applyDay19V4Choice(state, options[index].id);
  }
  const damaged = structuredClone(state.storyFlags.day19V4);
  damaged.facts.travelPaymentMade = true;
  assert.equal(validateDay19V4(damaged), false);
  assert.throws(() => completeDay19V4(state, {type:'chapterCompletionCue', day:19}), /INVALID_COMPLETION/);
  completeDay19V4(state, {type:'chapterCompletionCue', day:19, finalSceneReached:true});
  assert.equal(state.storyFlags.day19V4.complete, true);
  assert.equal(state.storyFlags.day18V4Day19HookPending, false);
  assert.equal(state.storyFlags.day19V4Day20HookPending, true);
  assert.equal(getDay19V4Entry(state).mode, 'V4');
});
