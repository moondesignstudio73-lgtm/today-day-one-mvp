import assert from "node:assert/strict";
import { advanceTime, applyEffects, createInitialState, determineEnding, MAX_DAY, validateState } from "../src/game-core.mjs";
import { SaveManager } from "../src/save-manager.mjs";

const partner = { name: "테스트 연인", traits: [], weights: { contact: 1, money: 1, trust: 1 } };
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
