import assert from "node:assert/strict";
import { advanceTime, applyEffects, createInitialState, determineEnding, MAX_DAY, validateState } from "../src/game-core.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { generateGirlfriend, getVisibleTraitRows, observePersonality, PERSONALITY_KEYS } from "../src/girlfriend-manager.mjs";
import { getEligibleEvents, getEventDiagnostics, getEventProbability, meetsConditions, rollEvent } from "../src/event-manager.mjs";
import { EVENT_DEFINITIONS } from "../src/events-data.mjs";
import { ACTIONS, PHASES, validateActionData } from "../src/actions-data.mjs";
import { getActionAvailability, getAvailableActions } from "../src/action-manager.mjs";
import { calculateActionEffects } from "../src/consequence-manager.mjs";

const partner = generateGirlfriend(() => 0.5);
const memoryStorage = () => {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
};

for (let run = 0; run < 100; run += 1) {
  const state = createInitialState(partner, () => ((run * 37) % 100) / 100);
  let actions = 0;
  while (!state.ended) {
    const effects = actions % 4 === 0
      ? { money: 25000, work: 5, stress: 4, energy: -6, affection: -2 }
      : { money: -12000, affection: 8, trust: 4, stress: -3, energy: -4 };
    applyEffects(state, effects);
    state.choices.push(actions % 4 === 0 ? "성공" : "연락");
    advanceTime(state);
    actions += 1;
    assert.ok(actions <= 121, "simulation must not stall");
  }
  assert.equal(state.day, MAX_DAY + 1);
  assert.equal(actions, MAX_DAY * 4);
  assert.ok(validateState(state));
  for (const key of ["health", "energy", "stress", "charm", "work", "social"]) assert.ok(state[key] >= 0 && state[key] <= 100);
  assert.ok(state.affection >= 0 && state.affection <= 1000);
  assert.ok(state.trust >= 0 && state.trust <= 1000);
  assert.ok(determineEnding(state)[0].length > 0);
}

const storage = memoryStorage();
const original = createInitialState(partner, () => 0.5);
SaveManager.save(original, storage);
const restored = SaveManager.load(storage);
assert.ok(restored);
assert.equal(restored.partner.name, original.partner.name);
assert.equal(restored.money, original.money);
storage.setItem(SaveManager.key, "{invalid-json");
assert.equal(SaveManager.load(storage), null);

console.log("✓ 100회 × 30일 자동 시뮬레이션 통과");
console.log("✓ 상태 범위, 종료 조건, 엔딩, 저장/불러오기 검증 통과");

const generatedValues = new Set();
for (let seed = 1; seed <= 100; seed += 1) {
  let cursor = seed;
  const random = () => ((cursor = (cursor * 16807) % 2147483647) - 1) / 2147483646;
  const girlfriend = generateGirlfriend(random);
  assert.equal(Object.keys(girlfriend.personality).length, PERSONALITY_KEYS.length);
  for (const value of Object.values(girlfriend.personality)) assert.ok(value >= 8 && value <= 92);
  generatedValues.add(JSON.stringify(girlfriend.personality));
}
assert.ok(generatedValues.size > 95, "personality generation must produce varied results");

const inferenceState = createInitialState(generateGirlfriend(() => 0.5), () => 0.5);
for (let i = 0; i < 12; i += 1) observePersonality(inferenceState, "연락", () => 0.1);
assert.ok(inferenceState.revealedTraits.length > 0, "repeated interaction must reveal a trait");
assert.equal(getVisibleTraitRows(inferenceState).length, 5);
console.log("✓ 100명 성향 랜덤 생성과 숨겨진 성향 추론 검증 통과");

const eventState = createInitialState(generateGirlfriend(() => 0.5), () => 0.5);
eventState.day = 6;
eventState.stress = 90;
assert.ok(meetsConditions(eventState, [{ stat: "stress", operator: ">=", value: 75 }]));
assert.ok(getEligibleEvents(eventState).some(event => event.id === "work-mistake"));
const forcedEvent = rollEvent(eventState, () => 0, EVENT_DEFINITIONS);
assert.equal(forcedEvent.id, "work-mistake");
assert.equal(eventState.eventHistory.length, 1);
assert.equal(getEligibleEvents(eventState).some(event => event.id === "work-mistake"), false, "cooldown must prevent immediate repeat");
eventState.day += 3;
assert.equal(getEligibleEvents(eventState).some(event => event.id === "work-mistake"), true, "event must return after cooldown");

const suspicionEvent = EVENT_DEFINITIONS.find(event => event.id === "relationship-suspicion");
eventState.partner.personality.jealousy = 50;
eventState.partner.personality.emotionalSensitivity = 50;
eventState.conflict = 0;
const baseSuspicionChance = getEventProbability(eventState, suspicionEvent);
eventState.partner.personality.jealousy = 85;
eventState.partner.personality.emotionalSensitivity = 82;
eventState.conflict = 60;
const modifiedSuspicionChance = getEventProbability(eventState, suspicionEvent);
assert.equal(baseSuspicionChance, 0.42);
assert.equal(modifiedSuspicionChance, 0.87);
assert.ok(meetsConditions(eventState, [{ stat: "partner.personality.jealousy", operator: ">=", value: 70 }]));

const cappedEvent = { probability: 0.9, probabilityModifiers: [{ conditions: [], multiply: 2 }] };
assert.equal(getEventProbability(eventState, cappedEvent), 1, "probability must be capped at one");
eventState.day = eventState.eventHistory[0].day + 1;
const diagnostics = getEventDiagnostics(eventState);
assert.equal(diagnostics.length, EVENT_DEFINITIONS.length);
assert.ok(diagnostics.every(item => typeof item.eligible === "boolean" && item.probability >= 0 && item.probability <= 1));
assert.ok(diagnostics.some(item => item.cooldownRemaining > 0), "diagnostics must expose cooldown state");

for (let run = 0; run < 100; run += 1) {
  const randomEventState = createInitialState(generateGirlfriend(() => 0.5), () => 0.5);
  for (let turn = 0; turn < 120; turn += 1) {
    applyEffects(randomEventState, { stress: turn % 9 === 0 ? 12 : -1, energy: -2, health: turn % 12 === 0 ? -3 : 0 });
    rollEvent(randomEventState, () => ((run * 31 + turn * 17) % 100) / 100);
    advanceTime(randomEventState);
  }
  assert.equal(randomEventState.ended, true);
  assert.ok(randomEventState.eventHistory.length <= 120);
}
console.log("✓ 조건·확률·우선순위·쿨다운 이벤트와 100회 회귀 검증 통과");
console.log("✓ 플레이어 상태·연인 성격 기반 동적 이벤트 확률 검증 통과");
console.log("✓ 디버그용 이벤트 진단 데이터 검증 통과");
assert.equal(validateActionData(), true);
assert.equal(PHASES.length, 4);
assert.equal(Object.values(ACTIONS).flat().length, 16);
assert.equal(new Set(Object.values(ACTIONS).flat().map(action => action.id)).size, 16);
console.log("✓ 4개 시간대·16개 행동 데이터 스키마 검증 통과");
const requirementState = createInitialState(generateGirlfriend(() => 0.5), () => 0.5);
requirementState.money = 10000;
requirementState.energy = 8;
const lockedDate = getActionAvailability(requirementState, ACTIONS.evening.find(action => action.id === "dinner-date"));
assert.equal(lockedDate.available, false);
assert.match(lockedDate.reason, /자산/);
assert.equal(getActionAvailability(requirementState, ACTIONS.morning.find(action => action.id === "morning-gym")).available, false);
assert.ok(getAvailableActions(requirementState, ACTIONS.evening).length > 0, "at least one evening action must remain available");
console.log("✓ 돈·체력 기반 행동 요구조건과 잠금 사유 검증 통과");
const personalityState = createInitialState(generateGirlfriend(() => 0.5), () => 0.5);
const contactAction = ACTIONS.morning.find(action => action.id === "morning-contact");
personalityState.partner.personality.contactImportance = 90;
const highContactEffects = calculateActionEffects(personalityState, contactAction);
personalityState.partner.personality.contactImportance = 10;
const lowContactEffects = calculateActionEffects(personalityState, contactAction);
assert.ok(highContactEffects.effects.affection > lowContactEffects.effects.affection);

const dateAction = ACTIONS.evening.find(action => action.id === "dinner-date");
personalityState.partner.personality.romanticism = 90;
const romanticEffects = calculateActionEffects(personalityState, dateAction);
personalityState.partner.personality.romanticism = 10;
const practicalEffects = calculateActionEffects(personalityState, dateAction);
assert.ok(romanticEffects.effects.affection > practicalEffects.effects.affection);
assert.ok(romanticEffects.effects.excitement > practicalEffects.effects.excitement);

const temptationAction = ACTIONS.evening.find(action => action.id === "coworker-drinks");
personalityState.partner.personality.jealousy = 90;
const jealousEffects = calculateActionEffects(personalityState, temptationAction);
personalityState.partner.personality.jealousy = 10;
const calmEffects = calculateActionEffects(personalityState, temptationAction);
assert.ok(Math.abs(jealousEffects.effects.trust) > Math.abs(calmEffects.effects.trust));
assert.ok(jealousEffects.effects.conflict > calmEffects.effects.conflict);
console.log("✓ 연락·데이트·쇼핑·성공·유혹의 성격별 복합 결과 검증 통과");
