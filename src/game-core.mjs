import { validateGirlfriend } from "./girlfriend-manager.mjs";
import { generateJob, getJobStartingState, validateJob } from "./jobs-data.mjs";
import { generateNpcs, validateNpcs } from "./npc-manager.mjs";
import { validateMemories } from "./memory-manager.mjs";
import { createInvestmentState, validateInvestmentState } from "./investment-manager.mjs";
import { createLotteryState, validateLotteryState } from "./lottery-manager.mjs";
import { createAdvancedEconomyState, validateAdvancedEconomyState } from "./economy-manager.mjs";
import { selectEnding } from "./ending-manager.mjs";
import { createVisualState, validateCharacterAppearance } from "./character-appearance.mjs";
import { createHiddenRouteState, validateHiddenRouteState } from "./hidden-route-manager.mjs";
import { createDaySnapshot } from "./night-manager.mjs";
import { createStoryDirectorState, validateStoryDirectorState } from "./dynamic-story-director.mjs";

export const MAX_DAY = 30;
export const PHASE_COUNT = 4;

export function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

export function createInitialState(partner, random = Math.random) {
  const selectedJob = generateJob(random);
  const jobStart = getJobStartingState(selectedJob, random);
  const state = {
    version: 1,
    day: 1,
    phase: 0,
    selected: null,
    partner,
    ...createVisualState(partner),
    job: selectedJob,
    jobLevel: 1,
    jobProgress: 0,
    economyLedger: [],
    finance: createAdvancedEconomyState(),
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
    conversationHistory: [],
    storyHistory: [],
    storyFlags: {},
    futureScore: 0,
    pendingStoryId: null,
    cgCollection: [],
    storyDirector:createStoryDirectorState(0),
    hiddenRoute:createHiddenRouteState(random),
    investment: createInvestmentState(),
    lottery: createLotteryState(),
    revealed: 0,
    revealedTraits: [],
    observations: {},
    affection: 500 + Math.floor(random() * 41),
    trust: 480 + Math.floor(random() * 41),
    excitement: 500,
    attachment: 450,
    conflict: 0,
    relationshipStress: 10,
    money: jobStart.money,
    health: jobStart.health,
    energy: jobStart.energy,
    stress: jobStart.stress,
    fatigue: jobStart.fatigue,
    charm: jobStart.charm,
    fashion: jobStart.fashion,
    confidence: jobStart.confidence,
    work: jobStart.work,
    social: jobStart.social,
    logs: [],
    choices: [],
    actionHistory: [],
    eventHistory: [],
    microEventHistory: [],
    situationEventStates: {},
    futureEventWeights: {},
    eventRuntime: {activeEvent:null,scene:null,dialogueIndex:0,state:"IDLE",inputLock:{locked:false,owner:null,reason:null,lockedFor:0},eventQueue:[],microQueue:[],pendingEvent:null,triggerReason:[],assetStatus:"IDLE",checkpoint:null,lastError:null,logs:[]},
    settings: {theaterMode:true},
    ended: false,
    nightState: null,
    dayStartSnapshot: null,
    updatedAt: new Date().toISOString()
  };
  state.dayStartSnapshot = createDaySnapshot(state);
  state.storyDirector=createStoryDirectorState(state.appearanceSeed);
  return state;
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
  if (!Number.isInteger(value.appearanceSeed) || !validateCharacterAppearance(value.characterAppearance) || !Array.isArray(value.equippedVisualLayers) || typeof value.currentExpression !== "string" || typeof value.currentPose !== "string" || typeof value.currentOutfit !== "string" || typeof value.currentAccessory !== "string" || typeof value.currentBackground !== "string") return false;
  if (!validateJob(value.job) || !Number.isFinite(value.jobLevel) || !Number.isFinite(value.jobProgress) || !Array.isArray(value.economyLedger) || !validateAdvancedEconomyState(value.finance) || !Array.isArray(value.inventory) || !value.equipment || !value.girlfriendEquipment || !validateNpcs(value.npcs) || !Array.isArray(value.npcHistory) || !Array.isArray(value.temptationHistory) || !Array.isArray(value.rivalHistory) || !validateMemories(value.memories) || !Array.isArray(value.initiatedMessages) || !Array.isArray(value.conversationHistory) || !validateInvestmentState(value.investment) || !validateLotteryState(value.lottery)) return false;
  if (!Array.isArray(value.logs) || !Array.isArray(value.choices) || !value.situationEventStates || !value.futureEventWeights || !Array.isArray(value.microEventHistory) || !value.eventRuntime || !value.settings) return false;
  if (!Array.isArray(value.storyHistory) || !value.storyFlags || typeof value.storyFlags !== "object" || !Number.isFinite(value.futureScore) || (value.pendingStoryId !== null && typeof value.pendingStoryId !== "string") || !Array.isArray(value.cgCollection)) return false;
  if (!validateHiddenRouteState(value.hiddenRoute)) return false;
  if (!validateStoryDirectorState(value.storyDirector)) return false;
  if (!value.dayStartSnapshot || typeof value.dayStartSnapshot !== "object" || (value.nightState !== null && typeof value.nightState !== "object")) return false;
  return ["affection", "trust", "excitement", "attachment", "conflict", "relationshipStress", "money", "health", "energy", "stress", "fatigue", "charm", "fashion", "confidence", "work", "social"].every(key => Number.isFinite(value[key]));
}

export function determineEnding(state) {
  const ending = selectEnding(state);
  return [ending.title,ending.description];
}
