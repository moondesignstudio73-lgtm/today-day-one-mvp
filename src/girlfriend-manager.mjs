import { createCharacterAppearance, validateCharacterAppearance } from "./character-appearance.mjs";
import { getHeroineProfile, HEROINE_PROFILES } from "./heroine-data.mjs";
import { createGirlfriendCareer, migrateGirlfriendCareer, validateGirlfriendCareer } from "./girlfriend-jobs-data.mjs";
import { DEFAULT_GIRLFRIEND_VISUAL_ID, lockGirlfriendToIntroVisual } from "./girlfriend-visual-data.mjs";

export const PERSONALITY_KEYS = [
  "contactImportance", "jealousy", "materialism", "romanticism", "independence",
  "marriageDesire", "economicPreference", "vanity", "loyalty", "opportunism",
  "emotionalSensitivity", "giftPreference", "socialPreference"
];

export const VISIBLE_TRAITS = [
  ["contactImportance", "연락 중요도"],
  ["jealousy", "질투"],
  ["materialism", "물질성향"],
  ["opportunism", "기회주의"],
  ["marriageDesire", "결혼 의향"]
];

const ACTION_CLUES = {
  연락: ["contactImportance"],
  데이트: ["marriageDesire", "contactImportance"],
  쇼핑: ["materialism"],
  유혹: ["jealousy", "opportunism"],
  성공: ["materialism", "opportunism"],
  휴식: ["contactImportance"],
  자기관리: ["materialism", "jealousy"]
};

const randomInt = (random, min, max) => min + Math.floor(random() * (max - min + 1));

export function traitLabel(value) {
  if (value < 20) return "매우 낮음";
  if (value < 40) return "낮음";
  if (value < 60) return "보통";
  if (value < 80) return "높음";
  return "매우 높음";
}

export function generateGirlfriend(random = Math.random) {
  const runPersonality=Object.fromEntries(PERSONALITY_KEYS.map(key=>[key,randomInt(random,8,92)]));
  const serial=randomInt(random,100000,999999);
  const profile=HEROINE_PROFILES[randomInt(random,0,HEROINE_PROFILES.length-1)];
  randomInt(random,0,4); randomInt(random,0,4);
  const personality=Object.fromEntries(PERSONALITY_KEYS.map(key=>[key,Math.round(runPersonality[key]*0.75+profile.personality[key]*0.25)]));
  const id=`heroine-${profile.id}-${serial}`;
  const appearanceSeed = randomInt(random, 1, 2147483646);
  return {
    id, heroineId:profile.id, visualId:DEFAULT_GIRLFRIEND_VISUAL_ID, name:profile.name, bio:profile.bio, age:profile.age, ageCategory:profile.ageCategory, job:profile.job, career:createGirlfriendCareer(profile.id), height:profile.height, bodyType:profile.bodyType,
    archetype:profile.archetype, hiddenTrait:profile.hiddenTrait, preferredDates:[...profile.preferredDates], dislikedActions:[...profile.dislikedActions],
    preferredGifts:[...profile.preferredGifts], fashionPreferences:{...profile.fashionPreferences}, rivalReaction:profile.rivalReaction,
    conflictStyle:profile.conflictStyle, reconciliationStyle:profile.reconciliationStyle, aiVoice:profile.aiVoice, referenceImage:profile.referenceImage, uiAccent:profile.uiAccent, studentSafe:Boolean(profile.studentSafe), messageVoice:structuredClone(profile.messageVoice??null), excludedEventTags:[...(profile.excludedEventTags??[])],
    personality,
    appearanceSeed,
    characterAppearance:createCharacterAppearance(appearanceSeed),
    weights: {
      contact: .65 + personality.contactImportance / 100,
      money: .55 + personality.materialism / 100,
      trust: .7 + personality.loyalty / 125
    }
  };
}

export function createGirlfriendFromProfile(profileId, random = Math.random) {
  const profile = getHeroineProfile(profileId) ?? HEROINE_PROFILES[0];
  const runPersonality = Object.fromEntries(PERSONALITY_KEYS.map((key) => [key, randomInt(random, 8, 92)]));
  const personality = Object.fromEntries(PERSONALITY_KEYS.map((key) => [key, Math.round(runPersonality[key] * 0.75 + profile.personality[key] * 0.25)]));
  const serial = randomInt(random, 100000, 999999);
  const appearanceSeed = randomInt(random, 1, 2147483646);
  return {
    id: `heroine-${profile.id}-${serial}`, heroineId: profile.id, visualId:DEFAULT_GIRLFRIEND_VISUAL_ID, name: profile.name, bio: profile.bio, age: profile.age, ageCategory: profile.ageCategory, job: profile.job, career: createGirlfriendCareer(profile.id), height: profile.height, bodyType: profile.bodyType,
    archetype: profile.archetype, hiddenTrait: profile.hiddenTrait, preferredDates: [...profile.preferredDates], dislikedActions: [...profile.dislikedActions],
    preferredGifts: [...profile.preferredGifts], fashionPreferences: { ...profile.fashionPreferences }, rivalReaction: profile.rivalReaction,
    conflictStyle: profile.conflictStyle, reconciliationStyle: profile.reconciliationStyle, aiVoice: profile.aiVoice, referenceImage: profile.referenceImage, uiAccent: profile.uiAccent, studentSafe: Boolean(profile.studentSafe), messageVoice: structuredClone(profile.messageVoice ?? null), excludedEventTags: [...(profile.excludedEventTags ?? [])],
    personality,
    appearanceSeed,
    characterAppearance: createCharacterAppearance(appearanceSeed),
    weights: {
      contact: .65 + personality.contactImportance / 100,
      money: .55 + personality.materialism / 100,
      trust: .7 + personality.loyalty / 125
    }
  };
}

export function rerollGirlfriendPersonality(partner, random = Math.random) {
  const profile = getHeroineProfile(partner?.heroineId) ?? HEROINE_PROFILES[0];
  const raw = Object.fromEntries(PERSONALITY_KEYS.map((key) => [key, randomInt(random, 8, 92)]));
  partner.personality = Object.fromEntries(PERSONALITY_KEYS.map((key) => [key, Math.round(raw[key] * 0.75 + profile.personality[key] * 0.25)]));
  partner.weights = {
    contact: .65 + partner.personality.contactImportance / 100,
    money: .55 + partner.personality.materialism / 100,
    trust: .7 + partner.personality.loyalty / 125
  };
  return partner;
}

export function migrateHeroineProfile(partner) {
  if (!partner || typeof partner !== "object") return partner;
  const seed=Number(partner.appearanceSeed) || [...String(partner.id ?? "")].reduce((sum,char)=>sum+char.charCodeAt(0),0);
  const profile=getHeroineProfile(partner.heroineId) ?? HEROINE_PROFILES[Math.abs(seed)%HEROINE_PROFILES.length];
  partner.heroineId=profile.id;
  lockGirlfriendToIntroVisual(partner);
  for (const key of ["age","ageCategory","job","height","bodyType","archetype","hiddenTrait","rivalReaction","conflictStyle","reconciliationStyle","aiVoice","referenceImage","uiAccent","studentSafe","messageVoice","excludedEventTags"]) partner[key] ??= structuredClone(profile[key]);
  partner.preferredDates ??=[...profile.preferredDates]; partner.dislikedActions ??=[...profile.dislikedActions]; partner.preferredGifts ??=[...profile.preferredGifts]; partner.fashionPreferences ??={...profile.fashionPreferences};
  migrateGirlfriendCareer(partner);
  return partner;
}

export function validateGirlfriend(girlfriend) {
  if (!girlfriend || typeof girlfriend !== "object") return false;
  if (typeof girlfriend.id !== "string" || typeof girlfriend.visualId !== "string" || typeof girlfriend.name !== "string" || typeof girlfriend.bio !== "string") return false;
  if (!getHeroineProfile(girlfriend.heroineId) || !validateGirlfriendCareer(girlfriend.career) || !Array.isArray(girlfriend.preferredDates) || !Array.isArray(girlfriend.dislikedActions) || !girlfriend.fashionPreferences || typeof girlfriend.aiVoice !== "string") return false;
  if (!girlfriend.personality || typeof girlfriend.personality !== "object") return false;
  if (!Number.isInteger(girlfriend.appearanceSeed) || !validateCharacterAppearance(girlfriend.characterAppearance)) return false;
  const keys = Object.keys(girlfriend.personality);
  if (keys.length !== PERSONALITY_KEYS.length || !PERSONALITY_KEYS.every(key => keys.includes(key))) return false;
  if (!Object.values(girlfriend.personality).every(value => Number.isFinite(value) && value >= 0 && value <= 100)) return false;
  return girlfriend.weights && ["contact", "money", "trust"].every(key => Number.isFinite(girlfriend.weights[key]));
}

export function observePersonality(state, actionTag, random = Math.random) {
  const candidates = ACTION_CLUES[actionTag];
  if (!candidates?.length) return null;
  const key = candidates[randomInt(random, 0, candidates.length - 1)];
  const observations = state.observations ?? (state.observations = {});
  const current = observations[key] ?? { confidence: 0, samples: 0, estimate: 50 };
  const actual = state.partner.personality[key];
  const noisySample = Math.max(0, Math.min(100, actual + randomInt(random, -18, 18)));
  current.estimate = current.samples === 0 ? noisySample : (current.estimate * current.samples + noisySample) / (current.samples + 1);
  current.samples += 1;
  current.confidence = Math.min(100, current.confidence + randomInt(random, 22, 38));
  observations[key] = current;
  if (current.confidence >= 60 && !state.revealedTraits.includes(key)) state.revealedTraits.push(key);
  return { key, confidence: current.confidence, estimate: current.estimate, hint: estimateHint(current.estimate), revealed: state.revealedTraits.includes(key) };
}

export function estimateHint(estimate) {
  if (estimate < 35) return "낮은 편?";
  if (estimate > 65) return "높은 편?";
  return "보통에 가까움?";
}

export function getVisibleTraitRows(state) {
  return VISIBLE_TRAITS.map(([key, name]) => {
    const observation = state.observations?.[key];
    const revealed = state.revealedTraits?.includes(key);
    return { key, name, value: revealed ? traitLabel(state.partner.personality[key]) : "???", confidence: observation?.confidence ?? 0, hint: observation ? estimateHint(observation.estimate ?? 50) : "", revealed };
  });
}
