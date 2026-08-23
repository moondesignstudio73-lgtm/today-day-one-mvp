const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Number(value) || 0));

export const PLAYER_ARCHETYPES = [
  {
    id: "balanced",
    name: "기본 캐릭터",
    image: "assets/players/balanced.png",
    mapImage: "assets/characters/map/PLAYER_BALANCED.png",
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
    mapImage: "assets/characters/map/PLAYER_HANDSOME.png",
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
    mapImage: "assets/characters/map/PLAYER_WEALTHY.png",
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

const BLOCKED_PLAYER_NAMES=["시발","씨발","병신","개새","지랄","좆","닥쳐","꺼져","fuck","shit","bitch"];

export function sanitizePlayerNameInput(value){
  const raw=Array.from(String(value??"").normalize("NFKC")).filter(character=>/[가-힣A-Za-z]/.test(character)).join("");
  if(!raw)return {value:"",valid:false,reason:String(value??"").trim()?"이름에는 한글 또는 영문만 사용할 수 있어요.":""};
  const firstIsKorean=/[가-힣]/.test(raw[0]),sameScript=Array.from(raw).filter(character=>firstIsKorean?/[가-힣]/.test(character):/[A-Za-z]/.test(character)).join("");
  const name=Array.from(sameScript).slice(0,3).join("");
  const normalized=name.toLowerCase().replace(/(.)\1{2,}/g,"$1$1");
  if(BLOCKED_PLAYER_NAMES.some(word=>normalized.includes(word)))return {value:"",valid:false,reason:"사용할 수 없는 표현이 포함된 이름이에요."};
  const changed=name!==String(value??"").trim();
  return {value:name,valid:Boolean(name),reason:changed?"한글 또는 영문 중 한 종류만, 최대 3글자까지 사용할 수 있어요.":""};
}

export function normalizePlayerName(value) { return sanitizePlayerNameInput(value).value; }

export function createPlayerProfile(archetypeId = "balanced", name = "나") {
  const archetype = getPlayerArchetype(archetypeId);
  return {
    name: normalizePlayerName(name) || "나",
    archetypeId: archetype.id,
    archetypeName: archetype.name,
    image: archetype.image,
    mapImage: archetype.mapImage,
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
    ["archetypeName", "image", "mapImage", "appearanceRating", "abilityRating"].every((key) => typeof value[key] === "string") &&
    typeof value.premium === "boolean";
}
