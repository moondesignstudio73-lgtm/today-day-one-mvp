import assert from 'node:assert/strict';
import test from 'node:test';
import {beginDay18V4, getDay18V4Entry, getDay18V4Options, applyDay18V4Choice,
  validateDay18V4, completeDay18V4} from '../src/day18-v4-state-contract.mjs';

const seed = (appointment = 'YURI') => ({money: 42000, storyHistory: [], storyFlags: {
  day17V4Completed: true, day17V4Day18HookPending: true,
  day16V4YuriEncountered: appointment === 'YURI', day16V4YuriContact: appointment === 'YURI' ? 'SHARED' : 'ENDED_HERE',
  day16V4YuriInvitation: appointment === 'YURI' ? 'ANSWER_TOMORROW' : 'NONE',
  day17V4Choice9: appointment === 'YURI' ? 'day17_v4_yuri_short' : appointment === 'HAEUN' ? 'day17_v4_life_haeun' : 'day17_v4_life_solo',
  day17V4TomorrowPlan: appointment === 'YURI' ? 'YURI_MEET' : appointment,
  day17V4HaeunDisclosure: 'WITHHELD',
  day17V4DinnerAgreement: {day: 18, partner: appointment, status: 'ACCEPTED', sourceChoiceId: 'day17_v4_life_haeun'}
}});
const c = s => s.storyFlags.day18V4;
const choose = (s, key) => applyDay18V4Choice(s, `day18_v4_${key}`);
const start = (partner, context) => { const s = seed(partner); assert.equal(beginDay18V4(s, context).mode, 'V4'); return s; };
const yuriDinner = (s, disclosure = 'disclose_yuri') => {
  for (const key of ['morning_keep', disclosure, 'menu_each', 'purpose_past', 'apology_thanks']) choose(s, key);
};
const afterYuriDinner = s => {
  yuriDinner(s);
  for (const key of ['relationship_haeun', 'next_time', 'pay_split']) choose(s, key);
};

test('DAY18 refuses legacy, missing prerequisites, unaccepted proposals and damaged V4 without writes', () => {
  for (const [s, expected] of [
    [{storyFlags: {}}, 'BLOCKED_PREREQUISITE'],
    [{storyFlags: {day18RouteStrategy: 'home18_route_clear_path'}}, 'LEGACY'],
    [{storyFlags: {day18V4: {schema: 'damaged'}}}, 'INVALID_V4']
  ]) {
    const before = JSON.stringify(s);
    assert.equal(beginDay18V4(s).mode, expected);
    assert.equal(JSON.stringify(s), before);
  }
  const s = seed('HAEUN'); delete s.storyFlags.day17V4DinnerAgreement;
  assert.equal(beginDay18V4(s).mode, 'NEEDS_AGREEMENT_REPAIR');
  assert.equal(s.storyFlags.day18V4, undefined);
});

test('Yuri cannot be recreated from only a DAY17 plan string', () => {
  for (const [key, value] of [['day16V4YuriEncountered', false], ['day16V4YuriContact', 'ENDED_HERE'],
    ['day16V4YuriInvitation', 'DECLINED'], ['day17V4Choice9', 'day17_v4_yuri_no_plan']]) {
    const s = seed(); s.storyFlags[key] = value;
    assert.equal(getDay18V4Entry(s).mode, 'INVALID_PREREQUISITE', key);
  }
});

test('morning cancellation becomes solo, not a replacement dinner or automatic new date', () => {
  for (const partner of ['YURI', 'HAEUN']) {
    const s = start(partner);
    choose(s, 'morning_change');
    assert.equal(c(s).facts.dinner, 'SOLO');
    assert.equal(c(s).facts.appointmentCancelled, true);
    assert.deepEqual(getDay18V4Options(c(s)).map(o => o.id), ['day18_v4_disclose_solo']);
  }
});

test('solo and Haeun paths cannot choose a fabricated Yuri disclosure or dinner-only branch', () => {
  for (const partner of ['SOLO', 'HAEUN']) {
    const s = start(partner); choose(s, partner === 'SOLO' ? 'morning_solo' : 'morning_keep');
    const before = JSON.stringify(s);
    assert.throws(() => choose(s, 'disclose_yuri'), /UNAVAILABLE/);
    assert.equal(JSON.stringify(s), before);
    choose(s, partner === 'SOLO' ? 'disclose_solo' : 'disclose_together');
    choose(s, partner === 'SOLO' ? 'menu_familiar' : 'menu_share');
    assert.notEqual(c(s).phase, 'yuri_purpose');
    assert.equal(c(s).facts.heardYuriPast, false);
  }
});

test('no-contact path has no forced Haeun choices or statements', () => {
  const s = start('SOLO', {haeunContactAllowed: false});
  for (const key of ['morning_solo', 'menu_familiar', 'solo_food', 'return_home', 'alone_stop', 'travel_life']) choose(s, key);
  assert.equal(c(s).phase, 'ending');
  assert.equal(c(s).facts.statements.length, 0);
  assert.equal(c(s).facts.contactTonight, null);
  assert.equal(c(s).facts.travelTogetherDiscussed, false);
});

test('unresolved attraction removes close-seat and walk choices, no invented attraction otherwise', () => {
  for (const interest of [true, false]) {
    const s = start('HAEUN', {otherInterest: interest});
    for (const key of ['morning_keep', 'disclose_together', 'menu_each', 'topic_other']) choose(s, key);
    assert.equal(c(s).phase, interest ? 'night' : 'closeness');
    assert.equal(c(s).facts.comfortableDinner, !interest);
    assert.equal(c(s).facts.sharedSeat, false);
  }
});

test('Yuri questioning depends on previously disclosed relationship, and correction retains evidence', () => {
  const s = seed(); s.storyFlags.day16V4HaeunRelationshipDisclosure = 'NAMED_GIRLFRIEND'; beginDay18V4(s);
  yuriDinner(s); choose(s, 'relationship_free');
  assert.equal(c(s).phase, 'yuri_correction');
  const lie = c(s).facts.statements.at(-1); assert.equal(lie.truthful, false);
  choose(s, 'yuri_correct');
  assert.equal(c(s).facts.statements.at(-1).correctionOf, lie.id);
  assert.equal(c(s).facts.yuriRelationshipClaim, 'relationship_haeun');
  const unknown = start('YURI'); yuriDinner(unknown); choose(unknown, 'relationship_free');
  assert.equal(c(unknown).phase, 'yuri_next', 'unknown information is not telepathically discovered');
});

test('asking to meet Yuri again never creates reciprocal consent or a new romance', () => {
  const s = start('YURI'); yuriDinner(s); choose(s, 'relationship_haeun'); choose(s, 'next_ask');
  assert.equal(c(s).facts.yuriNext, 'REQUESTED_NOT_ACCEPTED');
  choose(s, 'pay_debt'); assert.equal(c(s).facts.payment, 'SPLIT');
  assert.equal(s.money, 42000, 'no invented source price or trip purchase');
});

test('Haeun challenges a fake cancellation only when told the dinner plan', () => {
  const s = start('YURI'); afterYuriDinner(s); choose(s, 'night_solo');
  assert.equal(c(s).phase, 'night_correction');
  const lie = c(s).facts.statements.at(-1);
  choose(s, 'night_correct');
  assert.equal(c(s).facts.statements.at(-1).correctionOf, lie.id);
  assert.equal(c(s).phase, 'alone_end');
  assert.notEqual(c(s).facts.nightRoute, 'CALM');
  assert.equal(c(s).facts.followUpContact, true);
});

test('undisclosed dinner lie stays in recipient-specific evidence, no forced exposure', () => {
  const s = start('YURI'); yuriDinner(s, 'disclose_withhold');
  for (const key of ['relationship_haeun', 'next_time', 'pay_split', 'night_solo']) choose(s, key);
  assert.equal(c(s).phase, 'alone_end');
  assert.equal(c(s).facts.haeunKnowsDinner, false);
  assert.equal(c(s).facts.statements.at(-1).recipient, 'HAEUN');
  assert.equal(c(s).facts.statements.at(-1).truthful, false);
});

test('call termination never rejoins calm travel call or repeats choice12', () => {
  const s = start('YURI'); afterYuriDinner(s); choose(s, 'night_tell'); choose(s, 'future_others');
  assert.equal(c(s).phase, 'travel');
  assert.equal(c(s).facts.nightRoute, 'ENDED_CALL');
  assert.equal(c(s).facts.travelTogetherDiscussed, false);
  assert.throws(() => choose(s, 'calm_trip'), /UNAVAILABLE/);
});

test('every choice is transactional and replay-valid after JSON save/load on four attitudes and three dinners', () => {
  for (const partner of ['YURI', 'HAEUN', 'SOLO']) for (let route = 0; route < 4; route++) {
    let s = start(partner), count = 0;
    while (c(s).phase !== 'ending') {
      assert.ok(count < 25, 'bounded route');
      const options = getDay18V4Options(c(s));
      const index = route === 3 ? count % options.length : Math.min(route, options.length - 1);
      const chosen = options[index].id;
      applyDay18V4Choice(s, chosen); count++;
      assert.equal(validateDay18V4(c(s)), true, `${partner}:${route}:${chosen}`);
      s = JSON.parse(JSON.stringify(s));
      assert.equal(validateDay18V4(c(s)), true);
      const before = JSON.stringify(s);
      assert.throws(() => applyDay18V4Choice(s, chosen), /UNAVAILABLE/);
      assert.equal(JSON.stringify(s), before);
    }
    assert.equal(c(s).complete, false, 'last choice is not final scene completion');
    completeDay18V4(s, {type: 'chapterCompletionCue', day: 18, finalSceneReached: true});
    assert.equal(c(s).complete, true); assert.equal(validateDay18V4(c(s)), true);
    assert.equal(s.storyFlags.day18V4Day19HookPending, true);
    assert.equal(s.storyFlags.day17V4Day18HookPending, false);
  }
});

test('edited facts, out-of-order choices and premature completion are rejected without resetting saves', () => {
  const s = start('SOLO');
  assert.throws(() => completeDay18V4(s, {type: 'chapterCompletionCue', day: 18, finalSceneReached: true}), /INVALID_COMPLETION/);
  choose(s, 'morning_solo');
  c(s).facts.dinner = 'YURI';
  assert.equal(validateDay18V4(c(s)), false);
  const before = JSON.stringify(s);
  assert.throws(() => choose(s, 'disclose_yuri'), /INVALID_SAVE/);
  assert.equal(JSON.stringify(s), before);
});
