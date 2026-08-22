const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Number(value) || 0));

export const PLAYER_ARCHETYPES = [
  {
    id: "balanced",
    name: "기본 캐릭터",
    image: "assets/players/balanced.png",
    premium: false,
    appearanceRating: "보통",
    abilityRating: "보통",
    description: "균형 잡힌 능력치로 시작하는 기본 선택",
    statBonuses: {},
    moneyBonus: 0
  },
  {
    id: "handsome",
    name: "잘생긴 캐릭터",
    image: "assets/players/handsome.png",
    premium: true,
    appearanceRating: "최상",
    abilityRating: "보통",
    description: "매력과 패션, 자신감이 높은 프리미엄 선택",
    statBonuses: { charm: 30, fashion: 20, confidence: 10 },
    moneyBonus: 0
  },
  {
    id: "wealthy",
    name: "부자 캐릭터",
    image: "assets/players/wealthy.png",
    premium: true,
    appearanceRating: "보통",
    abilityRating: "상",
    description: "높은 초기 자금과 사회 능력으로 시작하는 프리미엄 선택",
    statBonuses: { work: 12, social: 8, confidence: 10 },
    moneyBonus: 4000000
  }
];

export function getPlayerArchetype(id) {
  return PLAYER_ARCHETYPES.find((entry) => entry.id === id) ?? PLAYER_ARCHETYPES[0];
}

export function normalizePlayerName(value) {
  return Array.from(String(value ?? "").trim()).slice(0, 3).join("");
}

export function createPlayerProfile(archetypeId = "balanced", name = "나") {
  const archetype = getPlayerArchetype(archetypeId);
  return {
    name: normalizePlayerName(name) || "나",
    archetypeId: archetype.id,
    archetypeName: archetype.name,
    image: archetype.image,
    premium: archetype.premium,
    appearanceRating: archetype.appearanceRating,
    abilityRating: archetype.abilityRating
  };
}

export function applyPlayerArchetype(startingState, player) {
  const archetype = getPlayerArchetype(player?.archetypeId);
  const result = { ...startingState, money: Math.max(0, Number(startingState?.money) || 0) + archetype.moneyBonus };
  for (const [key, bonus] of Object.entries(archetype.statBonuses)) result[key] = clamp((result[key] ?? 0) + bonus);
  return result;
}

export function migratePlayerProfile(value) {
  const source = value && typeof value === "object" ? value : {};
  return { ...createPlayerProfile(source.archetypeId, source.name), ...source, name: normalizePlayerName(source.name) || "나" };
}

export function validatePlayerProfile(value) {
  return Boolean(value) && typeof value === "object" &&
    Array.from(value.name ?? "").length >= 1 && Array.from(value.name ?? "").length <= 3 &&
    PLAYER_ARCHETYPES.some((entry) => entry.id === value.archetypeId) &&
    ["archetypeName", "image", "appearanceRating", "abilityRating"].every((key) => typeof value[key] === "string") &&
    typeof value.premium === "boolean";
}
