import assert from "node:assert/strict";
import { advanceTime, applyEffects, createInitialState, determineEnding, MAX_DAY, validateState } from "../src/game-core.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { generateGirlfriend, getVisibleTraitRows, observePersonality, PERSONALITY_KEYS } from "../src/girlfriend-manager.mjs";

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
