export const HIDDEN_ROUTE_CHANCE = 0.12;

export const TROUBLE_TRAITS = Object.freeze([
  "강한 연락 의존", "충동적 소비", "거짓말 습관", "잠수 성향", "강한 질투",
  "감정 기복", "충동적 행동", "과도한 애정 확인", "생활관리 부족", "술 관련 사고",
  "타인 의존", "과도한 허영", "관계 회피", "극단적인 소비성향"
]);

export const STRENGTH_TRAITS = Object.freeze([
  "매우 높은 애정표현", "높은 의리", "적극적인 응원", "위기 때 플레이어를 챙김",
  "함께 있을 때 높은 행복도", "솔직한 애정", "뛰어난 유머", "강한 순애성향"
]);

function pickUnique(values, count, random) {
  const pool = [...values];
  const picked = [];
  while (picked.length < count && pool.length) {
    const index = Math.floor(random() * pool.length);
    picked.push(pool.splice(index,1)[0]);
  }
  return picked;
}

export function createHiddenRouteState(random = Math.random, forceActive) {
  const active = typeof forceActive === "boolean" ? forceActive : random() < HIDDEN_ROUTE_CHANCE;
  const troubleCount = 2 + Math.floor(random() * 3);
  const strengthCount = 1 + Math.floor(random() * 2);
  return {
    active,
    started:false,
    troubleTraits:pickUnique(TROUBLE_TRAITS,troubleCount,random),
    strengthTraits:pickUnique(STRENGTH_TRAITS,strengthCount,random),
    revealedTraits:[],
    dependency:120,
    stability:520,
    boundary:180,
    change:0,
    burden:40,
    receivedSupport:false,
    choseLeave:false
  };
}

const ROUTE_METRICS = ["dependency","stability","boundary","change","burden"];

const TROUBLE_SCENES = Object.freeze({
  "강한 연락 의존":["hidden-perfect-first-day","hidden-dependency"],
  "충동적 소비":["hidden-card-debt","hidden-biggest-incident"],
  "거짓말 습관":["hidden-strange-lie"],
  "잠수 성향":["hidden-first-disappearance","hidden-biggest-incident"],
  "강한 질투":["hidden-dependency"],
  "감정 기복":["hidden-night-call","hidden-sweet-day"],
  "충동적 행동":["hidden-police-station","hidden-biggest-incident"],
  "과도한 애정 확인":["hidden-perfect-first-day","hidden-happy-trip"],
  "생활관리 부족":["hidden-card-debt","hidden-cracks"],
  "술 관련 사고":["hidden-police-station"],
  "타인 의존":["hidden-card-debt","hidden-dependency"],
  "과도한 허영":["hidden-luxury-hint"],
  "관계 회피":["hidden-first-disappearance","hidden-strange-lie"],
  "극단적인 소비성향":["hidden-luxury-hint","hidden-biggest-incident"]
});

const STRENGTH_SCENES = Object.freeze({
  "매우 높은 애정표현":["hidden-sweet-day"],
  "높은 의리":["hidden-final-crisis"],
  "적극적인 응원":["hidden-cracks"],
  "위기 때 플레이어를 챙김":["hidden-role-reversal"],
  "함께 있을 때 높은 행복도":["hidden-sweet-day","hidden-happy-trip"],
  "솔직한 애정":["hidden-happy-trip"],
  "뛰어난 유머":["hidden-sweet-day"],
  "강한 순애성향":["hidden-final-crisis"]
});

export function getHiddenRouteSceneEffects(state, sceneId) {
  const route = state.hiddenRoute;
  if (!route?.active) return {};
  const troubleMatches = route.troubleTraits.filter(trait => TROUBLE_SCENES[trait]?.includes(sceneId));
  const strengthMatches = route.strengthTraits.filter(trait => STRENGTH_SCENES[trait]?.includes(sceneId));
  for (const trait of troubleMatches) if (!route.revealedTraits.includes(trait)) route.revealedTraits.push(trait);
  return {
    dependency:troubleMatches.length * 30,
    stability:strengthMatches.length * 35 - troubleMatches.length * 25,
    change:strengthMatches.length * 20,
    burden:troubleMatches.length * 35 - strengthMatches.length * 20
  };
}

export function applyHiddenRouteEffects(state, effects = {}, flags = {}) {
  if (!state.hiddenRoute) state.hiddenRoute = createHiddenRouteState(Math.random,false);
  for (const [key, rawValue] of Object.entries(effects)) {
    if (!ROUTE_METRICS.includes(key)) continue;
    state.hiddenRoute[key] = Math.max(0,Math.min(1000,(state.hiddenRoute[key] ?? 0) + (Number(rawValue) || 0)));
  }
  Object.assign(state.hiddenRoute,flags);
  return state.hiddenRoute;
}

export function revealHiddenTrait(state, trait) {
  const route = state.hiddenRoute;
  if (!route?.active || !route.troubleTraits.includes(trait)) return false;
  if (!route.revealedTraits.includes(trait)) route.revealedTraits.push(trait);
  return true;
}

export function validateHiddenRouteState(route) {
  if (!route || typeof route !== "object") return false;
  if (typeof route.active !== "boolean" || typeof route.started !== "boolean") return false;
  if (!Array.isArray(route.troubleTraits) || route.troubleTraits.length < 2 || route.troubleTraits.length > 4) return false;
  if (!Array.isArray(route.strengthTraits) || route.strengthTraits.length < 1 || route.strengthTraits.length > 2 || !Array.isArray(route.revealedTraits)) return false;
  if (new Set(route.troubleTraits).size !== route.troubleTraits.length || new Set(route.strengthTraits).size !== route.strengthTraits.length) return false;
  if (!route.troubleTraits.every(trait => TROUBLE_TRAITS.includes(trait)) || !route.strengthTraits.every(trait => STRENGTH_TRAITS.includes(trait))) return false;
  if (!route.revealedTraits.every(trait => route.troubleTraits.includes(trait))) return false;
  if (!ROUTE_METRICS.every(key => Number.isFinite(route[key]) && route[key] >= 0 && route[key] <= 1000)) return false;
  return typeof route.receivedSupport === "boolean" && typeof route.choseLeave === "boolean";
}
