import { validateGirlfriend } from "./girlfriend-manager.mjs";
import { generateJob, validateJob } from "./jobs-data.mjs";
import { generateNpcs, validateNpcs } from "./npc-manager.mjs";
import { validateMemories } from "./memory-manager.mjs";

export const MAX_DAY = 30;
export const PHASE_COUNT = 4;

export function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

export function createInitialState(partner, random = Math.random) {
  return {
    version: 1,
    day: 1,
    phase: 0,
    selected: null,
    partner,
    job: generateJob(random),
    jobLevel: 1,
    jobProgress: 0,
    economyLedger: [],
    inventory: [],
    equipment: {},
    girlfriendEquipment: {},
    npcs: generateNpcs(random),
    npcHistory: [],
    temptationHistory: [],
    rivalHistory: [],
    breakup: null,
    memories: [],
    initiatedMessages: [],
    revealed: 0,
    revealedTraits: [],
    observations: {},
    affection: 500 + Math.floor(random() * 41),
    trust: 480 + Math.floor(random() * 41),
    excitement: 500,
    attachment: 450,
    conflict: 0,
    relationshipStress: 10,
    money: 780000 + Math.floor(random() * 140001),
    health: 68 + Math.floor(random() * 10),
    energy: 72 + Math.floor(random() * 10),
    stress: 20 + Math.floor(random() * 11),
    fatigue: 18 + Math.floor(random() * 10),
    charm: 44 + Math.floor(random() * 10),
    fashion: 35 + Math.floor(random() * 10),
    confidence: 40 + Math.floor(random() * 10),
    work: 38 + Math.floor(random() * 10),
    social: 36 + Math.floor(random() * 10),
    logs: [],
    choices: [],
    actionHistory: [],
    eventHistory: [],
    ended: false,
    updatedAt: new Date().toISOString()
  };
}

export function applyEffects(state, effects) {
  for (const [key, rawValue] of Object.entries(effects)) {
    const value = Number(rawValue) || 0;
    if (key === "money") state.money = Math.max(0, state.money + value);
    else if (["affection", "trust"].includes(key)) state[key] = clamp(state[key] + value, 0, 1000);
    else if (key in state) state[key] = clamp(state[key] + value);
  }
  state.updatedAt = new Date().toISOString();
  return state;
}

export function advanceTime(state) {
  if (state.phase < PHASE_COUNT - 1) state.phase += 1;
  else {
    state.phase = 0;
    state.day += 1;
    state.energy = clamp(state.energy + 18);
    state.stress = clamp(state.stress - 5);
    state.fatigue = clamp(state.fatigue - 12);
  }
  if (state.day > MAX_DAY) state.ended = true;
  state.selected = null;
  state.updatedAt = new Date().toISOString();
  return state;
}

export function validateState(value) {
  if (!value || typeof value !== "object") return false;
  if (value.version !== 1 || !Number.isInteger(value.day) || !Number.isInteger(value.phase)) return false;
  if (value.day < 1 || value.day > MAX_DAY + 1 || value.phase < 0 || value.phase >= PHASE_COUNT) return false;
  if (!validateGirlfriend(value.partner)) return false;
  if (!validateJob(value.job) || !Number.isFinite(value.jobLevel) || !Number.isFinite(value.jobProgress) || !Array.isArray(value.economyLedger) || !Array.isArray(value.inventory) || !value.equipment || !value.girlfriendEquipment || !validateNpcs(value.npcs) || !Array.isArray(value.npcHistory) || !Array.isArray(value.temptationHistory) || !Array.isArray(value.rivalHistory) || !validateMemories(value.memories) || !Array.isArray(value.initiatedMessages)) return false;
  if (!Array.isArray(value.logs) || !Array.isArray(value.choices)) return false;
  return ["affection", "trust", "excitement", "attachment", "conflict", "relationshipStress", "money", "health", "energy", "stress", "fatigue", "charm", "fashion", "confidence", "work", "social"].every(key => Number.isFinite(value[key]));
}

export function determineEnding(state) {
  const count = tag => state.choices.filter(choice => choice === tag).length;
  if (state.affection > 820 && state.trust > 760) return ["사랑으로 결혼", "화려하진 않아도 서로를 가장 잘 아는 두 사람은 평생을 약속했다."];
  if (state.money > 1800000 && state.affection > 650) return ["함께 만든 미래", "사랑과 성공 사이의 균형을 찾아, 더 단단한 미래를 약속했다."];
  if (state.trust < 250) return ["무너진 신뢰", "사랑은 남아 있었지만 반복된 의심을 이겨내지 못했다."];
  if (count("성공") > 25) return ["워커홀릭", "눈부신 커리어를 손에 넣었지만, 가장 가까운 사람과의 거리는 멀어졌다."];
  if (state.affection < 350) return ["사랑하지만 이별", "좋아하는 마음만으로는 함께 살아갈 수 없다는 것을 알게 되었다."];
  return ["각자의 내일", "30일의 선택 끝에 두 사람은 잠시 서로의 삶을 돌아보기로 했다."];
}
