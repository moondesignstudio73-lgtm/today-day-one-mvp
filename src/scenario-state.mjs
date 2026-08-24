export const GAME_MODES = Object.freeze({
  FREE_ROMANCE: "free-romance",
  MARRIAGE_30: "marriage-in-30-days"
});

export const GAME_MODE_CONFIGS = Object.freeze({
  [GAME_MODES.FREE_ROMANCE]: Object.freeze({id:GAME_MODES.FREE_ROMANCE,title:"자유 연애",description:"연인과 성향을 직접 정하고 30일의 일상을 자유롭게 만듭니다.",fixedPartnerId:null}),
  [GAME_MODES.MARRIAGE_30]: Object.freeze({id:GAME_MODES.MARRIAGE_30,title:"결혼까지 30일!",description:"기억을 잃은 채 깨어난 뒤 하은과 결혼식까지 남은 30일을 따라갑니다.",fixedPartnerId:"haeun"})
});

const TRACKED_METRICS = [
  "investigation", "suspicion", "memoryRecovery", "haeunAffection",
  "haeunTrust", "haeunDependency", "homeSearchCount",
  "computerSearchCount", "accidentSearchCount", "coworkerRelation"
];
const COLLECTIONS = ["clues", "contradictions", "profileUnlocks", "unlockedActions", "followUpHooks"];

export function normalizeGameMode(value) {
  return value === GAME_MODES.MARRIAGE_30 ? value : GAME_MODES.FREE_ROMANCE;
}

export function getGameModeConfig(value) {
  return GAME_MODE_CONFIGS[normalizeGameMode(value)];
}

export function isContentAvailableForMode(state, content) {
  const mode = normalizeGameMode(state?.gameMode);
  return !content?.modes?.length || content.modes.includes(mode);
}

export function createScenarioState(mode = GAME_MODES.FREE_ROMANCE) {
  const normalizedMode = normalizeGameMode(mode);
  const enabled = normalizedMode === GAME_MODES.MARRIAGE_30;
  return {
    id: enabled ? GAME_MODES.MARRIAGE_30 : null,
    enabled,
    investigation: 0,
    suspicion: 0,
    memoryRecovery: 0,
    haeunAffection: 0,
    haeunTrust: 0,
    haeunDependency: 0,
    homeSearchCount: 0,
    computerSearchCount: 0,
    accidentSearchCount: 0,
    coworkerRelation: 0,
    clues: [],
    contradictions: [],
    profileUnlocks: [],
    unlockedActions: [],
    followUpHooks: [],
    truthRevealed: false,
    finalChoiceUnlocked: false
  };
}

export function migrateScenarioState(mode, value) {
  const base = createScenarioState(mode);
  if (!value || typeof value !== "object") return base;
  const migrated = {...base, ...value, id: base.id, enabled: base.enabled};
  for (const key of COLLECTIONS) migrated[key] = Array.isArray(value[key]) ? [...new Set(value[key].filter(item => typeof item === "string"))] : [];
  return migrated;
}

export function validateScenarioState(mode, value) {
  if (!value || typeof value !== "object") return false;
  const normalizedMode = normalizeGameMode(mode);
  const enabled = normalizedMode === GAME_MODES.MARRIAGE_30;
  if (value.enabled !== enabled || value.id !== (enabled ? GAME_MODES.MARRIAGE_30 : null)) return false;
  if (typeof value.truthRevealed !== "boolean" || typeof value.finalChoiceUnlocked !== "boolean") return false;
  if (!TRACKED_METRICS.every(key => Number.isFinite(value[key]) && value[key] >= 0)) return false;
  return COLLECTIONS.every(key => Array.isArray(value[key]) && value[key].every(item => typeof item === "string") && new Set(value[key]).size === value[key].length);
}
