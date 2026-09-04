import assert from 'node:assert/strict';
import test from 'node:test';
import {prepareDay17V4GameEntry, getDay17V4GameSegment, applyDay17V4GameChoice} from '../src/day17-v4-game-bridge.mjs';

function stateForDinner(extra = {}) {
  const state = {storyFlags: {day16V4Completed: true, day16V4Day17BodyHookPending: true,
    day16V4YuriContact: 'ENDED_HERE', day16V4YuriInvitation: 'NONE', ...extra}};
  prepareDay17V4GameEntry(state);
  for (const id of ['size_home', 'meet_solo', 'goal_info', 'solo_nothing', 'self_enough']) {
    applyDay17V4GameChoice(state, `day17_v4_${id}`);
  }
  return state;
}

test('DAY17 explicit dinner acceptance is recorded separately from proposal', () => {
  const state = stateForDinner();
  const {steps} = applyDay17V4GameChoice(state, 'day17_v4_life_haeun');
  assert.equal(state.storyFlags.day17V4TomorrowPlan, 'HAEUN');
  assert.deepEqual(state.storyFlags.day17V4DinnerAgreement, {
    day: 18, partner: 'HAEUN', status: 'ACCEPTED', sourceChoiceId: 'day17_v4_life_haeun'
  });
  assert.ok(steps.some(s => s.speaker === '하은' && s.text === '퇴근하고 만나자.'));
});

test('DAY17 unavailable Haeun declines: no automatic dinner or replacement guest', () => {
  const state = stateForDinner({day17V4HaeunDinnerAvailable: false});
  const {steps} = applyDay17V4GameChoice(state, 'day17_v4_life_haeun');
  assert.equal(state.storyFlags.day17V4TomorrowPlan, 'SOLO');
  assert.equal(state.storyFlags.day17V4DinnerAgreement.status, 'DECLINED');
  assert.ok(steps.some(s => s.speaker === '하은' && s.text === '내일 저녁은 시간이 안 될 것 같아.'));
  assert.ok(!steps.some(s => s.speaker === '유리'));
});

test('DAY17 solo/open choices never record an accepted partner', () => {
  for (const id of ['day17_v4_life_solo', 'day17_v4_life_open']) {
    const state = stateForDinner();
    applyDay17V4GameChoice(state, id);
    assert.equal(state.storyFlags.day17V4DinnerAgreement.status, 'NONE');
    assert.equal(state.storyFlags.day17V4DinnerAgreement.partner, null);
  }
});

test('DAY17 greeting-only recollection does not claim a seated conversation', () => {
  const state = {storyFlags: {day16V4Completed: true, day16V4Day17BodyHookPending: true,
    day16V4YuriEncountered: true, day16V4ConversationDepth: 'GREETING_ONLY'}};
  prepareDay17V4GameEntry(state);
  const text = JSON.stringify(getDay17V4GameSegment(state));
  assert.ok(text.includes('카페에서 내 이름을 부르던 목소리'));
  assert.ok(!text.includes('맞은편에서 듣던 유리의 목소리'));
});

test('loading old DAY17 proposal does not synthesize a missing acceptance record', () => {
  const state = stateForDinner();
  state.storyFlags.day17V4TomorrowPlan = 'HAEUN';
  const restored = JSON.parse(JSON.stringify(state));
  prepareDay17V4GameEntry(restored);
  assert.equal(restored.storyFlags.day17V4DinnerAgreement, undefined);
});
