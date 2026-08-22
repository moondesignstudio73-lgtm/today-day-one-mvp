export const ACTION_RESULT_ASSETS = Object.freeze({
  "morning-contact": "assets/action-results/morning-contact.png",
  "morning-gym": "assets/action-results/morning-gym.png",
  "sleep-in": "assets/action-results/sleep-in.png",
  "focused-work": "assets/action-results/focus-work.png",
  "lunch-date": "assets/action-results/lunch-girlfriend.png",
  "coworker-lunch": "assets/action-results/lunch-coworkers.png",
  "stock-check": "assets/action-results/check-stocks.png",
  "manager-feedback": "assets/action-results/manager-feedback.png",
  "early-sleep": "assets/action-results/early-sleep.png",
  "temptation-secret": "assets/action-results/coworker-drinks.png"
});

export const ACTION_EFFECT_LABELS = Object.freeze({
  money: "자산",
  affection: "호감도",
  trust: "신뢰도",
  work: "업무 능력",
  confidence: "자신감",
  social: "사회성",
  stress: "스트레스",
  fatigue: "피로",
  energy: "에너지",
  health: "건강",
  charm: "매력",
  fashion: "패션",
  npcInterest: "상대 관심도",
  npcTrust: "상대 신뢰",
  conflict: "갈등"
});

export function getActionResultAsset(actionId) {
  return ACTION_RESULT_ASSETS[actionId] ?? null;
}

export function getVisibleActionEffects(effects = {}) {
  return Object.entries(effects)
    .filter(([key, value]) => ACTION_EFFECT_LABELS[key] && Number.isFinite(value) && value !== 0)
    .map(([key, value]) => ({ key, label: ACTION_EFFECT_LABELS[key], value: Math.round(value) }));
}
