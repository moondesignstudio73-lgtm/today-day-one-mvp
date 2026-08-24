export const GAME_MODES = Object.freeze({
  FREE_ROMANCE: "free-romance",
  MARRIAGE_30: "marriage-in-30-days"
});

const TRACKED_METRICS = [
  "investigation", "suspicion", "memoryRecovery", "haeunAffection",
  "haeunTrust", "haeunDependency", "homeSearchCount",
  "computerSearchCount", "accidentSearchCount", "coworkerRelation"
];
const COLLECTIONS = ["clues", "contradictions", "profileUnlocks", "unlockedActions"];

export function normalizeGameMode(value) {
  return value === GAME_MODES.MARRIAGE_30 ? value : GAME_MODES.FREE_ROMANCE;
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
